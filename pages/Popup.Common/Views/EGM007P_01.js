window.__define_resource && __define_resource("LBL09727","LBL06789","BTN00141","BTN00784","LBL00703","LBL01280","BTN00070","BTN00008","MSG05398","LBL01482","LBL09915","LBL06787","LBL03657","MSG02288","MSG01334","MSG05416","MSG05422","MSG05419","LBL80077","LBL01809","LBL85161","LBL70053","MSG00008","LBL35235","LBL02695","LBL07157");
/****************************************************************************************************
1. Create Date : 2015.08.26
2. Creator     : Nguyen Minh thien
3. Description : ECERP/EGM/EGM025M
4. Precaution  :
5. History     : 2016.12.19 (SON) - Fix validate when send notification
                2016.2.9 (vthien) - apply sort and merge row
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EGM007P_01", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    gridObjectSfSnoti: null,                        //문구설정 그리드 전역변수                     commentSetting Grid Property
    gridObjectSfSnotiReceiver: null,                //대상자설정 그리드 전역변수                   receiverSetting Grid Property
    isUseSMS: ecount.config.limited.feature.USE_SMS,        //SMS 사용여부                                 SMS UseFlag
    idPopupApplyFilterIndex: 0,                     //ID팝업창 적용 시 중복체크를 위한 Index변수   IDPopupApply for
    loadsfSnotiReceiverGridData: null,
    sfSnotiData: null,
    receiveSelectedFormSeq: null,                   //수신화면 양식 FORM_SEQ
    inSiteList: {},
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },
    initProperties: function () {
        this.receiveSelectedFormSeq = this.RECEIVE_FORM_SEQ;
        //수신화면양식 FORM_SEQ DEFALUT SETTING (발신정보상세에서 선택안할경우 대비)
        if ($.isEmpty(this.viewBag.InitDatas.receiveFormList) == false && $.isNull(this.receiveSelectedFormSeq)) {
            this.receiveSelectedFormSeq = this.getFormListSelectedItem.call(this, this.viewBag.InitDatas.receiveFormList);
        }
    },
    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting(Thiết lập giao diện)
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        var headerOption = []

        if ($.isEmpty(this.RECEIVE_FORM_TYPE) == false) {
            headerOption.push({ id: 'EmailReceiveForm', label: ecount.resource.LBL09727 }); //메일수신화면양식
        }

        header.setTitle(ecount.resource.LBL06789);
        header.add('option', headerOption, false);
    },
    onInitContents: function (contents, resource) {
        var sfSnotiReceiverData = this.viewBag.InitDatas.SfSnotiReceiverData,    //대상자설정 GridData, ReceiverSetting GridData
           sfSnotiGridData = this.getSfSnotiGridData.call(this),           //문구설정그리드 데이타 (commentSetting Grid Data)
           sfSnotiReceiverGridData = $.parseJSON(this.IsDBSelect === "N" ? Object.toJSON(this.BOARD_DATA.RECEIVERS) : Object.toJSON(sfSnotiReceiverData)), //대상자설정 그리드 데이타 (ReceiverSetting Grid Data)
           g = widget.generator,
           toolbar = g.toolbar(),
           toolbar1 = g.toolbar(),
           setting3 = g.settingPanel(),
           SfSnotiSettingGrid = g.grid(),
           SfSnotiReceiverSettingGrid = g.grid(),
           ctrl = g.control(),
           form = g.form(),
           form2 = g.form();

        toolbar.addRight(ctrl.define("widget.button", "defaultSetting").label(ecount.resource.BTN00141));
        toolbar1.addLeft(ctrl.define("widget.button", "searchText").css("btn btn-default btn-sm visible-border").label(ecount.resource.BTN00784))
        this.makeMergeData4Sort(sfSnotiReceiverGridData);
        this.loadsfSnotiReceiverGridData = sfSnotiReceiverGridData;

        //문구설정그리드 설정 Setting Notification grid(Thiết lập lưới thiết lập thông báo)
        SfSnotiSettingGrid
            .setEditable(true, 0, 0)
            .setColumns([
                { id: 'DisplayComment', propertyName: 'DISPLAYCOMMENT', width: this.getWidthSfSnotiGrid(sfSnotiGridData), controlType: 'widget.userHelpMark', title: ecount.resource.LBL00703 },
                { id: 'Register', propertyName: 'REGISTER', title: ecount.resource.LBL01280, width: '', controlType: 'widget.input.general', validation: this.CheckSfSnotiSettingGridValidation.bind(this, 'Register') }
            ])
            .setRowData(sfSnotiGridData)
            .setStyleBorderRemoveLeftRight(true)
            .setCustomRowCell('DisplayComment', this.setGridDataCustomDisplayCommentBySfSnotiSettingGrid.bind(this))
            .setCustomRowCell('Register', this.setGridDataCustomRegisterBySfSnotiSettingGrid.bind(this))


        //대상자설정 그리드 설정 Setting Receiver Notification grid(Thiết lập lưới người nhận thiết lập thông báo)
        SfSnotiReceiverSettingGrid
            .setEditable(true, 0, 0)
            .setColumns(this.getSfSnotiReceiverGridColumn.call(this))
            .setRowData(sfSnotiReceiverGridData)
            .setCheckBoxUse(true)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setGridSort.bind(this))
            //.setCheckBoxInitialCheckedItems(['0','2'])
            .setKeyColumn(['SITE', 'USER_ID', 'UNAME'])
            .setCheckBoxHeaderCallback({
                'change': function (e, data) {
                    //debugger;
                    this.gridObjectSfSnotiReceiver.checkAllCustom('EmailCheck', data.target.checked);
                    this.gridObjectSfSnotiReceiver.checkAllCustom('MobileCheck', data.target.checked);
                    this.gridObjectSfSnotiReceiver.checkAllCustom('MessageCheck', data.target.checked);
                }.bind(this)
            })
            .setCheckBoxCallback({
                'change': function (e, data) {
                    //debugger;
                    if (this.inSiteList[data.rowItem['SITE']] != undefined) {
                        var currentInSiteList = this.inSiteList[data.rowItem['SITE']];
                        for (var i = 0, limit = currentInSiteList.length; i < limit; i++) {
                            var dataKey = currentInSiteList[i];
                            var isChecked = this.gridObjectSfSnotiReceiver.isChecked(data.rowKey);

                            this.gridObjectSfSnotiReceiver.setCell("CHK_YN", dataKey, isChecked);
                            this.gridObjectSfSnotiReceiver.setCell("EmailCheck", dataKey, isChecked);
                            this.gridObjectSfSnotiReceiver.setCell("MobileCheck", dataKey, isChecked);
                            this.gridObjectSfSnotiReceiver.setCell("MessageCheck", dataKey, isChecked);
                        }//for end
                    }
                    //var _checkedItem = this.gridObjectSfSnotiReceiver.getChecked();

                }.bind(this)
            })
            .setEditRowDataSample({ CHK_YN: "N", LAN_TYPE: this.viewBag.Language })
            .setEventAutoAddRowOnLastRow(true, 2)
            .setStyleBorderRemoveLeftRight(true)
            .setEventWidgetTriggerObj(this.events)
            .setCustomRowCell('ID', this.setGridDataCustomIDCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('EmailCheck', this.setGridDataCustomEmailCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('MobileCheck', this.setGridDataCustomMobileCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('MessageCheck', this.setGridDataCustomMessageCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('Email', this.setGridDataCustomEmailBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('Mobile', this.setGridDataCustomMobileBySfSnotiReceiverSettingGrid.bind(this))
            .setColumnSortDisableList(["SITE_DES"])
        //.setKeyboardUseSelectEach(true, ['EmailCheck', 'MobileCheck', 'MessageCheck'])
        ;

        if ($.isEmpty(this.viewBag.InitDatas.receiveFormList) == false) {
            form2.add(ctrl.define('widget.select', 'mailReceiveForm', 'mailReceiveForm', ecount.resource.LBL09727)  //메일수신화면양식 
                        .option(this.getFormListData(this.viewBag.InitDatas.receiveFormList))
                        .select(this.receiveSelectedFormSeq).singleCell().end());
        }

        form.template("register")
        contents
            .add(form2)
            .addGrid("SfSnotiSettingGrid" + this.pageID, SfSnotiSettingGrid)
            .add(toolbar1)
            .addGrid("SfSnotiReceiverSettingGrid" + this.pageID, SfSnotiReceiverSettingGrid);

    },
    onInitFooter: function (footer, resource) {
        var generator = widget.generator;
        var toolbar = generator.toolbar();
        var ctrl = generator.control();
        toolbar
            .addLeft(ctrl.define("widget.button", "Save").label(resource.BTN00070))    //적용
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar); //toolbar add[footer 영역의 닫기] (Thêm thanh chức năng vào chân trang)
    },
    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
    },

    onChangeControl: function (control) {
        if (control.cid == "mailReceiveForm") {
            this.receiveSelectedFormSeq = control.value;
        }
    },
    /**************************************************************************************************** 
    * define common event listener(Định nghĩa các sự kiện dùng chung)
    ****************************************************************************************************/
    onLoadTabPane: function (event) {
        this._super.onLoadTabPane.apply(this, arguments);
    },

    onLoadTabContents: function (event) {
        this._super.onLoadTabContents.apply(this, arguments);
    },

    onChangeHeaderTab: function (event) {
        this._super.onChangeHeaderTab.apply(this, arguments);
    },

    onChangeContentsTab: function (event) {
        this._super.onChangeContentsTab.apply(this, arguments);
    },

    onLoadComplete: function (event) {

        this._super.onLoadComplete.apply(this, arguments);
        if (this.DOC_GUBUN == "00") {
            if (this.contents.getControl("defaultSetting") != undefined)
                this.contents.getControl("defaultSetting").hide();
        }
        else {
            if (this.contents.getControl("defaultSetting") != undefined)
                this.contents.getControl("defaultSetting").show();
        }


        if (!event.unfocus || event.unfocus == undefined) {
            var g = this.contents.getGrid("SfSnotiSettingGrid" + this.pageID);
            g.grid.setCellFocus("Register", g.grid.getRowKeyByIndex(0));
        }
    },

    onPopupHandler: function (control, config, handler) {
        this.idPopupApplyFilterIndex = 0;

        if (control.id === "ID") {
            var user = this.contents.getGrid("SfSnotiReceiverSettingGrid" + this.pageID).grid.getRowList();
            var ChkUserId = "";

            $.each(user, function (i, item) {
                if (!$.isEmpty(item.ID)) {
                    ChkUserId = ChkUserId + item.ID + ecount.delimiter;
                }
            }.bind(this));

            $.extend(config, {
                Type: 'WID',
                Flag: 'NOTICE',
                ChkUserId: ChkUserId
            });
        }
        handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        //this._super.onAutoCompleteHandler.apply(this, arguments);
        parameter.SEARCH = keyword;
        handler(parameter);
    },

    onMessageHandler: function (page, data) {
        switch (page.pageID) {
            case "CM100P_02": // 수신화면양식설정
                var ctrl = this.contents.getControl("mailReceiveForm");
                if (data.type == "reload" && !ctrl.isContain(data.formSeq)) {
                    var newReceiveForm = this.getFormListData([{ FORM_SEQ: data.formSeq, TITLE_NM: data.formName }]);
                    newReceiveForm[0].push(this.viewBag.InitDatas.receiveFormList.length - 1); // insert할 인덱스
                    ctrl.addOption(newReceiveForm);
                    this.viewBag.InitDatas.receiveFormList.insert(this.viewBag.InitDatas.receiveFormList.length - 1, newReceiveForm[0]);
                }
                ctrl.setValue(data.formSeq);
                this.receiveSelectedFormSeq = data.formSeq;
                break;
        }
    },
    setFirstFocus: function (event) {
    },
    onFocusOutHandler: function (event) {
        var g = this.contents.getGrid("SfSnotiSettingGrid" + this.pageID);
        if (event.target == "contents") {
            g.grid.setCellFocus("Register", g.grid.getRowKeyByIndex(0));
        }
    },
    /****************************************************************************************************
    * define grid event listener(Định nghĩa các sự kiện cho lưới)
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);
        if (grid.id == "SfSnotiSettingGrid" + this.pageID)
            this.gridObjectSfSnoti = this.contents.getGrid(grid.id).grid;

        if (grid.id == "SfSnotiReceiverSettingGrid" + this.pageID) {
            this.gridObjectSfSnotiReceiver = this.contents.getGrid(grid.id).grid;

            //if (this.SCOPE_TYPE == "A" && this.IsDBSelect === "Y") {
            //    this.gridObjectSfSnotiReceiver.checkAll(true);
            //}
            var prevSiteCD = "";
            for (var idx = 0, limit = data.dataRows.length; idx < limit; idx++) {
                var curSiteCD = data.dataRows[idx]['SITE'];
                if (curSiteCD != prevSiteCD) {
                    prevSiteCD = curSiteCD;
                    if (this.valueConverting(data.dataRows[idx]['CHK_YN']))
                        this.gridObjectSfSnotiReceiver.addChecked(data.dataRows[idx][ecount.grid.constValue.keyColumnPropertyName], { isRunChange: false });
                }
            }
            //var _checkedItem = this.gridObjectSfSnotiReceiver.getChecked();
        }
    },

    onGridAfterFormLoad: function (e, data, grid) {
        this._super.onGridAfterFormLoad.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)(Định nghĩa các sự kiện)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/

    onFooterClose: function (e) {
        this.close();
    },
    onFooterSave: function (e) {
        this.applydata();
    },

    applydata: function () {
        //debugger;
        var validateSucess = true,
          mergeEntity = {

              BOARD_DATA: {
                  SMS_CHK_YN: this.BOARD_DATA.SMS_CHK_YN, // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함
                  EMAIL_CHK_YN: this.BOARD_DATA.EMAIL_CHK_YN, // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함
                  MEMO_CHK_YN: this.BOARD_DATA.MEMO_CHK_YN, // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함

                  MEMO_TXT_REG: null,
                  EMAIL_TXT_REG: null,
                  SMS_TXT_REG: null,

                  RECEIVERS: [],
                  RECEIVE_FORM_TYPE: this.RECEIVE_FORM_TYPE,
                  RECEIVE_FORM_SEQ: this.receiveSelectedFormSeq
              }

          };

        /*
        SfSnotiReceiverGrid Validation - Start
        */
        // * CustomValidation - 체크된 항목중에 중복된 아이디가 존재하는지 체크
        this.loopSfSnotiReceiverGridCheck('Validation', function (propertyType, index) {
            //debugger;
            if (propertyType == "CHK_H" || propertyType == "EMAIL_CHK_YN" || propertyType == "HPNO_CHK_YN" || propertyType == "MEMO_CHK_YN") {
                var gridObjectSfSnotiReceiverGetRowList = this.gridObjectSfSnotiReceiver.getRowList();
                var thisUserID = gridObjectSfSnotiReceiverGetRowList[index].USER_ID;

                if (!$.isEmpty(thisUserID)) {
                    var filteringSfSnotiReceiverSettingGridList,
                        resultGridList;

                    filteringSfSnotiReceiverSettingGridList = gridObjectSfSnotiReceiverGetRowList.where(function (entity, i) {
                        return (i != index);
                    });

                    resultGridList = filteringSfSnotiReceiverSettingGridList.where(function (entity, i) {
                        return (thisUserID == entity.USER_ID);
                    });

                    if (resultGridList.length > 0) {
                        validateSucess = false;
                        var option = {};
                        option.message = ecount.resource.MSG05398;
                        this.gridObjectSfSnotiReceiver.setCellShowError("ID", resultGridList[0][ecount.grid.constValue.keyColumnPropertyName], option);
                        return false;
                    }
                }
            }
        }.bind(this))

        ////SfSnotiGrid EmailValidation
        if (validateSucess)
            validateSucess = this.gridObjectSfSnotiReceiver.validate().result;
        //this.gridObjectSfSnotiReceiver.validate();
        /*
        SfSnotiReceiverGrid Validation - End
        */

        //SfSnotiGrid Validation
        if (validateSucess)
            validateSucess = this.gridObjectSfSnoti.validate().result;
        //this.gridObjectSfSnoti.validate();

        //dataSave inner function
        function _setMergeEntity() {
            this.loopSfSnotiGridCheck('SetEntity', function (entity, index) {
                switch (entity.TYPE) {
                    case "SMS":
                        mergeEntity.BOARD_DATA.SMS_TXT_REG = entity.REGISTER;
                        break;
                    case "Memo":
                        mergeEntity.BOARD_DATA.MEMO_TXT_REG = entity.REGISTER;
                        break;
                    case "Email":
                        mergeEntity.BOARD_DATA.EMAIL_TXT_REG = entity.REGISTER;
                        break;
                }
            }.bind(this));

            this.loopSfSnotiReceiverGridCheck('SetEntity', function (entity, index) {
                if (!$.isEmpty(entity.USER_ID) || !$.isEmpty(entity.UNAME) || !$.isEmpty(entity.EMAIL) || !$.isEmpty(entity.HP_NO) ||
                    entity.EMAIL_CHK_YN || entity.HPNO_CHK_YN || entity.MEMO_CHK_YN) {

                    entity.EMAIL_CHK_YN = entity.EMAIL_CHK_YN ? 'Y' : 'N';
                    entity.HPNO_CHK_YN = entity.HPNO_CHK_YN ? 'Y' : 'N';
                    entity.MEMO_CHK_YN = entity.MEMO_CHK_YN ? 'Y' : 'N';
                    mergeEntity.BOARD_DATA.RECEIVERS.push(entity);
                }
            }.bind(this));
        }

        if (validateSucess) {
            _setMergeEntity.apply(this);
            mergeEntity.noticeType = 'board';
            mergeEntity.callback = function () {
                setTimeout(function () {
                    this.close();
                }.bind(this), 0);
            }.bind(this);

            this.sendMessage(this, mergeEntity);
        }
    },

    onDropdownEmailReceiveForm: function (e) {
        var ctrl = this.contents.getControl("mailReceiveForm", "sendInformation");

        var receiverFormSeq = ctrl.getValue() == 1000 ? 0 : this.contents.getControl("mailReceiveForm", "sendInformation").getValue();
        var param = {
            width: 700,
            height: 600,
            FORM_TYPE: this.RECEIVE_FORM_TYPE,
            FORM_SEQ: receiverFormSeq
        };

        if (ctrl.getOptionCount() == 1 && ctrl.getValue() == 1000) {
            param.IsSubmitSelf = true

            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_22",
                name: ecount.resource.LBL01482,
                param: param,
                popupType: this.popupType == "layer" ? false : true,
                fpopupID: this.ecPageID
            });
        } else {
            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: ecount.resource.LBL01482,
                param: param,
                popupType: this.popupType == "layer" ? false : true,
                fpopupID: this.ecPageID
            });
        }
    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    /**************************************************************************************************** 
    // SfSnotiSettingGrid 관련 Function, SfSnotiSettingGrid By Function - Start
    ****************************************************************************************************/

    //SfSnoti GridData Call
    getSfSnotiGridData: function () {
        //debugger;
        var returnData = [];
        if (this.BOARD_DATA.EMAIL_CHK_YN == "Y") {
            returnData.unshift(
                {
                    "TYPE": "Email",
                    "DISPLAYCOMMENT": ecount.resource.LBL09915, //이메일제목
                    "REGISTER": this.BOARD_DATA.EMAIL_TXT_REG || "aaaaaa", //[ecount01] [ecount02] 번 전표가 등록되었습니다.
                }
            );
        }
        if (this.BOARD_DATA.MEMO_CHK_YN == "Y") {
            returnData.unshift(
               {
                   "TYPE": "Memo",
                   "DISPLAYCOMMENT": ecount.resource.LBL06787, //쪽지발송문구
                   "REGISTER": this.BOARD_DATA.MEMO_TXT_REG, //[ecount01] [ecount02] 번 전표가 등록되었습니다.
               }
            );
        }
        if (this.isUseSMS && this.BOARD_DATA.SMS_CHK_YN == "Y") {
            returnData.unshift(
                {
                    "TYPE": "SMS",
                    "DISPLAYCOMMENT": ecount.resource.LBL03657, //SMS발송문구
                    "REGISTER": this.BOARD_DATA.SMS_TXT_REG, //[ecount01] [ecount02] 번 전표가 등록되었습니다.  
                }
            );
        }
        return returnData;
    },

    getWidthSfSnotiGrid: function (sfSnotiGridData) {
        var width = 0;

        if (sfSnotiGridData.length > 0) {

            for (var i = 0; i < sfSnotiGridData.length; i++) {
                if (width < sfSnotiGridData[i].DISPLAYCOMMENT.length) {
                    width = sfSnotiGridData[i].DISPLAYCOMMENT.length;
                }
            }
        }

        width = width * 15;
        return width;
    },

    //타이틀Tip 이벤트핸들러, TitleTip EventHandler
    setGridDataCustomDisplayCommentBySfSnotiSettingGrid: function (value, rowItem) {
        var option = {},
            content;

        switch (rowItem["TYPE"]) {
            case "SMS": content = ecount.resource.MSG02288; break;
            case "Email": content = ecount.resource.MSG02288; break;
            case "Memo": content = ecount.resource.MSG02288; break;
        }
        option.attrs = {
            'data-toggle': 'popover',
            'data-placement': 'right',
            'data-html': 'true',
            'data-content': content
        }

        option.parentAttrs = {

        };
        return option;
    },

    //Reister 이벤트핸들러
    setGridDataCustomRegisterBySfSnotiSettingGrid: function (value, rowItem) {
        var option = {};
        // Set edit able State(kiểm tra thiết lập cho phép chỉnh sửa)
        switch (rowItem["TYPE"]) {
            case "SMS":
                option.controlOption = {
                    maxByte: { message: ecount.resource.MSG01334, max: 90 }
                };
                break;
        }

        return option;
    },
    //IsEmpty Validation Check
    CheckSfSnotiSettingGridValidation: function (target, value, rowItem) {
        var message,
            resultFlag = false;

        if (target == "Register") {
            switch (rowItem["TYPE"]) {
                case "SMS":
                    message = ecount.resource.MSG05416; //[SMS발송문구] 등록 시 사용할 문구를 입력 바랍니다.  
                    break;
                case "Memo":
                    message = ecount.resource.MSG05422; //[이메일제목] 등록 시 사용할 문구를 입력 바랍니다.
                case "Email":
                    message = ecount.resource.MSG05419; //[쪽지발송문구] 등록 시 사용할 문구를 입력 바랍니다.
                    break;
            }
            var check = ecount.common.ValidCheckSpecial(value);
            if ($.isEmpty(value) || check.result == false)
                resultFlag = true;
            if (check.result == false)
                message = '';//check.message;
            return {
                result: !resultFlag,
                error: {
                    popover: {
                        visible: resultFlag,
                        message: message,
                        placement: 'top'
                    }, css: {
                        visible: resultFlag
                    }
                }
            };
        }
    },

    /**************************************************************************************************** 
    // SfSnotiSettingGrid 관련 Function, SfSnotiSettingGrid By Function - End
    ****************************************************************************************************/

    /**************************************************************************************************** 
    // SfSnotiReceiverSettingGrid 관련 Function, SfSnotiReceiverSettingGrid By Function - Start
    ****************************************************************************************************/

    //SfSnotiReceiver GridColumn Call
    getSfSnotiReceiverGridColumn: function () {
        var returnData = [
            { id: 'SITE_DES', propertyName: 'SITE_DES', title: ecount.resource.LBL80077, width: this.isUseSMS ? '' : '', controlType: 'widget.label' },   //아이디 
            { id: 'ID', propertyName: 'USER_ID', title: ecount.resource.LBL01809, width: this.isUseSMS ? '' : '', controlType: 'widget.label' },   //아이디
            { id: 'Name', propertyName: 'UNAME', title: ecount.resource.LBL85161, width: this.isUseSMS ? '' : '', controlType: 'widget.label' }       //이름            
        ];

        if (this.BOARD_DATA.EMAIL_CHK_YN == 'Y') {
            returnData.push({ id: 'EmailCheck', propertyName: 'EMAIL_CHK_YN', align: "center", width: '30', controlType: 'widget.checkbox' });
            returnData.push({
                id: 'Email', propertyName: 'EMAIL', title: ecount.resource.LBL70053, width: this.isUseSMS ? '155' : '216', controlType: 'widget.input',
                validation: function (value, rowItem) {
                    var message = ecount.resource.MSG00008, resultFlag = false;   //이메일 형식에 맞춰 입력 바랍니다. 
                    if (rowItem['EMAIL'].length > 0 && !ecount.validator.check("email", rowItem['EMAIL']))
                        resultFlag = true;
                    return {
                        result: !resultFlag,
                        error: { popover: { visible: resultFlag, message: message, placement: 'top' }, css: { visible: resultFlag } }
                    };
                }.bind(this),
                editableState: 1
            });
        }

        if (this.isUseSMS && this.BOARD_DATA.SMS_CHK_YN == 'Y') {
            returnData.push({ id: 'MobileCheck', propertyName: 'HPNO_CHK_YN', controlType: 'widget.checkbox', align: "center", width: '30' });
            returnData.push({ id: 'Mobile', propertyName: 'HP_NO', controlType: 'widget.input', title: ecount.resource.LBL35235, width: '155', controlOption: { maxLength: 50, numberType: ecount.grid.constValue.numberType.onlyNumber } });
        }

        if (this.BOARD_DATA.MEMO_CHK_YN == 'Y') {
            returnData.push({ id: 'MessageCheck', propertyName: 'MEMO_CHK_YN', align: "left", title: ecount.resource.LBL02695, width: '55', controlType: 'widget.checkbox' });
        }

        return returnData;
    },
    CheckSpecialCharacterEtc: function (value, rowItem) {
        var message,
           resultFlag = false;
        var resultObject = ecount.common.ValidCheckSpecial(value);
        message = resultObject.message;
        if (resultObject.result == false)
            resultFlag = true;
        return {
            result: !resultFlag,
            error: {
                popover: { visible: resultFlag, message: '', placement: 'top' },
                css: { visible: resultFlag }
            }
        };
    },

    //ID항목, ID EventHandler
    setGridDataCustomIDCheckBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};

        option.event = {
            'change': function (e, data) {
                if ($.isEmpty(data.rowItem["USER_ID"]))
                    this.gridObjectSfSnotiReceiver.setCell('MEMO_CHK_YN', data.rowKey, "N");

                this.gridObjectSfSnotiReceiver.refreshCell('MessageCheck', data.rowKey);
            }.bind(this),


            'beforeChange': function (e, data) {
                var gridObjectSfSnotiReceiverGetRowList = this.gridObjectSfSnotiReceiver.getRowList(),
                    insertFlag = true;

                if (!$.isEmpty(data.newValue)) {
                    $.each(gridObjectSfSnotiReceiverGetRowList, function (i, item) {
                        if (item[ecount.grid.constValue.keyColumnPropertyName] != data.rowKey && data.newValue == item.ID) {
                            var option = {};
                            option.message = ecount.resource.MSG05398;
                            option.showDirect = true;
                            option.hideTimeout = 1000;
                            option.hideAll = true;
                            this.gridObjectSfSnotiReceiver.setCellShowError("ID", item[ecount.grid.constValue.keyColumnPropertyName], option);
                            insertFlag = false;
                            return false;
                        }
                    }.bind(this));
                }

                return insertFlag;
            }.bind(this),
            //'keyup': function (e, data) {
            //    // data.newValue
            //}
        };

        option.controlOption = {
            'codeType': 3,
            'controlEvent': {
                'itemSelect': function (rowKey, arg) {
                    if (arg.type == 'addCode') {
                        var rowData = arg.message.data,
                            continueToChange = true;

                        arg.message.index = this.idPopupApplyFilterIndex++;

                        if (arg.message.position == 'next') {
                            if (arg.message.index != 0)
                                rowKey = this.gridObjectSfSnotiReceiver.getNextRowId('ID');

                            // 추가 할 행이 없으면 행 추가
                            if (rowKey == null) {//special-row-0
                                this.gridObjectSfSnotiReceiver.addRow(2);
                                rowKey = this.gridObjectSfSnotiReceiver.getNextRowId('ID');
                            }
                        }

                        //적용시 ItemSelect경우의 beforeChange Return
                        continueToChange = this.gridObjectSfSnotiReceiver.setCell('ID', rowKey, rowData.USER_ID);

                        if (continueToChange !== false) {
                            this.gridObjectSfSnotiReceiver.setCell('Name', rowKey, rowData.UNAME);
                            this.gridObjectSfSnotiReceiver.setCell('Email', rowKey, rowData.EMAIL);
                            this.gridObjectSfSnotiReceiver.setCell('LAN_TYPE', rowKey, rowData.LAN_TYPE);
                            this.gridObjectSfSnotiReceiver.refreshCell('EmailCheck', rowKey); //확인
                            this.gridObjectSfSnotiReceiver.refreshCell('MessageCheck', rowKey);

                            if (this.isUseSMS == true) {
                                this.gridObjectSfSnotiReceiver.setCell('Mobile', rowKey, rowData.HP_NO);
                                this.gridObjectSfSnotiReceiver.refreshCell('MobileCheck', rowKey); //확인
                            }
                        } else
                            this.idPopupApplyFilterIndex--;
                    }
                }.bind(this)
            }
        };
        return option;
    },

    //이메일체크박스 이벤트핸들러, EmailCheckBox EventHandler
    setGridDataCustomEmailCheckBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};

        if (!ecount.validator.check("email", rowItem['EMAIL'])) {
            option.attrs = {
                'disabled': true
            }
        } else {
            option.attrs = {
                'disabled': false
            }
        }

        option.data = this.valueConverting(value);

        return option;
    },

    //모바일체크박스 이벤트핸들러, MoblieCheckBox EventHandler
    setGridDataCustomMobileCheckBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};

        if ($.isEmpty(rowItem['HP_NO'])) {
            option.attrs = {
                'disabled': true
            }
        } else {
            option.attrs = {
                'disabled': false
            }
        }

        option.data = this.valueConverting(value);

        return option;
    },

    //쪽지체크박스 이벤트핸들러, MemoCheckBox EventHandler
    setGridDataCustomMessageCheckBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};

        if ($.isEmpty(rowItem['USER_ID'])) {
            option.attrs = {
                'disabled': true
            }
        } else {
            option.attrs = {
                'disabled': false
            }
        }

        option.data = this.valueConverting(value);

        return option;
    },

    //이메일항목 이벤트핸들러, Email EventHandler
    setGridDataCustomEmailBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};

        option.event = {
            'keydown': function (e, data) {
                if (!ecount.validator.check("email", data.newValue))
                    this.gridObjectSfSnotiReceiver.setCell('EmailCheck', data.rowKey, "N");

                this.gridObjectSfSnotiReceiver.setCell('EMAIL', data.rowKey, data.newValue);
                this.gridObjectSfSnotiReceiver.refreshCell('EmailCheck', data.rowKey);
            }.bind(this)
        };

        return option;
    },

    //모바일항목 이벤트핸들러, Mobile EventHandler
    setGridDataCustomMobileBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};

        option.event = {
            'keydown': function (e, data) {
                if ($.isEmpty(data.newValue))
                    this.gridObjectSfSnotiReceiver.setCell('MobileCheck', data.rowKey, "N");

                this.gridObjectSfSnotiReceiver.setCell('HP_NO', data.rowKey, data.newValue);
                this.gridObjectSfSnotiReceiver.refreshCell('MobileCheck', data.rowKey);
            }.bind(this)
        };

        return option;
    },

    /**************************************************************************************************** 
    // SfSnotiReceiverSettingGrid 관련 Function, SfSnotiReceiverSettingGrid By Function - End
    ****************************************************************************************************/

    /**************************************************************************************************** 
    // 공통 Function, Common Function - Start
    ****************************************************************************************************/

    //checkType별로 SfSnotiGrid를 Loop돌면서, Property항목의 값이 비어있을 때 callback함수가 동작
    //checkType이 Validation인 경우는 특정 유효성검사를 체크할때 사용, 기본적인 각 셀에 대한 유효성검사는 그리드 내장함수인 validate로 합니다.
    loopSfSnotiGridCheck: function (checkType, callback) {
        var gridObjectSfSnotiGetRowList = this.gridObjectSfSnoti.getRowList();
        $.each(gridObjectSfSnotiGetRowList, function (i, item) {
            if (checkType == 'Validation') {
                if ($.isEmpty(item.REGISTER))
                    return callback(item.TYPE, "Register", i);

            } else if (checkType == "SetEntity") {
                return callback(item, i);
            }
        }.bind(this));
    },

    //checkType별로 SfSnotiReceiverGrid를 Loop돌면서, Property항목의 값이 비어있을 때 callback함수가 동작 (체크박스는 클릭된 경우 동작)
    //checkType이 Validation인 경우는 특정 유효성검사를 체크할때 사용, 기본적인 각 셀에 대한 유효성검사는 그리드 내장함수인 validate로 합니다.
    loopSfSnotiReceiverGridCheck: function (checkType, callback) {
        var gridObjectSfSnotiReceiverGetRowList = this.gridObjectSfSnotiReceiver.getRowList();

        $.each(gridObjectSfSnotiReceiverGetRowList, function (i, item) {
            if (checkType == 'Validation') {
                if (this.gridObjectSfSnotiReceiver.isChecked(item[ecount.grid.constValue.keyColumnPropertyName]))
                    return callback("CHK_H", i);
                if ($.isEmpty(item.USER_ID))
                    return callback("USER_ID", i);
                if ($.isEmpty(item.UNAME))
                    return callback("UNAME", i);
                if (item.EMAIL_CHK_YN)
                    return callback("EMAIL_CHK_YN", i);
                if ($.isEmpty(item.EMAIL))
                    return callback("EMAIL", i);
                if (item.HPNO_CHK_YN)
                    return callback("HPNO_CHK_YN", i);
                if ($.isEmpty(item.HP_NO))
                    return callback("HP_NO", i);
                if (item.MEMO_CHK_YN)
                    return callback("MEMO_CHK_YN", i);
            } else if (checkType == "SetEntity") {
                return callback(item);
            }
        }.bind(this))
    },
    reloadPage: function () {
        var self = this;
        var strDefault = "";
        var reqnoti = window.requestUrl.param["hidNoticePopup"];
        var reqBasicType = window.requestUrl.param["basicType"];
        var gubun = self.contents.getControl("doc_gubun").getValue()
        self.onAllSubmitSelf({
            url: "/ECERP/Popup.Common/EMJ002P_29?hidNoticePopup=" + reqnoti + "&basicType=" + reqBasicType,
            param: {
                DOC_GUBUN: gubun,
                IS_DEFAULT: strDefault
            }
        });
    },

    //체크박스 값 Y/N으로 Converting
    valueConverting: function (value) {
        if (typeof (value) == "boolean")
            return value;
        else if (value == 'Y')
            return true;
        else
            return false;
    },
    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.WDATE,
            lastEditId: this.WID,
            parentPageID: this.pageID,
            responseID: this.callbackID
        }
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        })
    },
    onContentsSearchText: function (e) {
        this.ON_KEY_F3();
    },
    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },
    ON_KEY_F3: function (e) {
        //debugger;
        var myGrid = this.contents.getGrid("SfSnotiReceiverSettingGrid" + this.pageID);
        myGrid.grid.searchInputText();
        e && e.preventDefault();
    },
    ON_KEY_ENTER: function (e, target) {
        // set default enter keypess(xử lý load mặt định khi nhấn enter tại nút thiết lập mặt định)
        if (target != null && target.cid == 'defaultSetting') {
            this.onContentsDefaultSetting();
        }

        var option = {
            isTreeOpen: true,
            searchCellColor: "active-kbd",
            isMoveScrollTop: true,
            searchTextControlId: "txt-contents-searchText"
        };

        if (e.target.attributes['id'] && e.target.attributes['id'].value == "txt-contents-searchText") {
            this.gridObjectSfSnotiReceiver.searchTextCellHighlight(e.target.value);
            e.stopPropagation();
            e.preventDefault();
        }
    },
    getFormListData: function (formList) {
        var _returnFormListData = [];

        if ($.isEmpty(formList)) {
            return null;
        }

        if ($.isEmpty(formList) == false) {
            $.each(formList, function () {
                if (this.ORD == '1') //action쪽에서 임의로 추가한 Ecount기본
                    _returnFormListData.push([[this.FORM_SEQ], [this.TITLE_NM]]);
                else
                    _returnFormListData.push([[this.FORM_SEQ], [this.TITLE_NM + ' ' + this.FORM_SEQ]]);
            });
        }

        return _returnFormListData;
    },

    getFormListSelectedItem: function (formList, selectedFormSeq) {
        var _selectedItem = [];

        if (selectedFormSeq != undefined && selectedFormSeq != null) {
            _selectedItem = formList.where(function (item, i) {
                return (item.FORM_SEQ == selectedFormSeq);
            });
        }

        if (_selectedItem.length == 0) {
            _selectedItem = formList.where(function (item, i) {
                return (item.BASIC_TYPE == '0')
            });
        }

        if (_selectedItem.length == 0) {
            _selectedItem = formList.where(function (item, i) {
                return (item.ORD == '1')
            });
        }

        return _selectedItem.length > 0 ? _selectedItem[0].FORM_SEQ : 0;
    },


    /**************************************************************************************************** 
    // 공통 Function, Common Function - End
    ****************************************************************************************************/
    setGridSort: function (e, data) {
        debugger;
        var self = this;
        var sendData = {
            BOARD_CD: self.BOARD_CD,
            SORT_COLUMN: data.columnId,
            SORT_TYPE: data.sortOrder,
            SCOPE_TYPE: self.SCOPE_TYPE,
            LIST_CODE_PERSON_CHK: self.LIST_CODE_PERSON_CHK,
            hidParentMenu: self.hidParentMenu,
        };

        ecount.common.api({
            url: "/Groupware/IntegratedBoard/GetBoardNotificationSetting",
            data: Object.toJSON(sendData),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.Error);
                } else {
                    if (!result.Data) return;
                    self.inSiteList = [];
                    var sfSnotiReceiverGridData = $.parseJSON(Object.toJSON(result.Data))
                    self.makeMergeData4Sort(sfSnotiReceiverGridData);
                    self.loadsfSnotiReceiverGridData = sfSnotiReceiverGridData;
                    self.contents.getGrid("SfSnotiReceiverSettingGrid" + self.pageID).settings.setRowData(sfSnotiReceiverGridData);
                    self.contents.getGrid("SfSnotiReceiverSettingGrid" + self.pageID).draw();
                }
                //_self.vhideProgressbar();
            }.bind(self)
        });
    },

    // It is useful if not use sort
    makeMergeData: function (rowData) {
        var self = this;
        var loadDateCnt = rowData.count();
        var site_des = '___';
        var site = '___'
        for (var i = 0 ; i < loadDateCnt; i++) {
            var tempRowCnt = parseInt(rowData[i].ROW_CNT);

            if (i < loadDateCnt - 1 && tempRowCnt > 1 && site_des != rowData[i].SITE_DES && site != rowData[i].SITE) {
                rowData[i]['_MERGE_SET'] = [];
                rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(0, tempRowCnt));
                rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(1, tempRowCnt));
            }

            if (self.inSiteList[rowData[i].SITE] == undefined) {
                self.inSiteList[rowData[i].SITE] = new Array();
            }

            self.inSiteList[rowData[i].SITE].push(rowData[i].SITE + "∮" + rowData[i].USER_ID + "∮" + rowData[i].UNAME);

            site_des = rowData[i].SITE_DES;
            site = rowData[i].SITE;
        }

        return rowData;
    },

    // vthien in case dept. column allowed sortable, it is useful. 
    makeMergeData4Sort: function (rowData) {
        var self = this;
        var loadDateCnt = rowData.count();
        var site_des = '___';
        var site = '___';
        var tempRowCnt = 1;
        var curMerg = 0;
        for (var i = 0; i < loadDateCnt; i++) {
            if (i >= curMerg && loadDateCnt > curMerg) {
                for (var j = curMerg + 1; j < loadDateCnt; j++) {
                    if (rowData[i].SITE_DES == rowData[j].SITE_DES) {
                        tempRowCnt++;
                    }
                    else if (tempRowCnt > 1) {
                        break;
                    }
                }
                curMerg = i + tempRowCnt;
                if (i < loadDateCnt -1 && tempRowCnt > 1 && site_des != rowData[i].SITE_DES && site != rowData[i].SITE) {
                    rowData[i]['_MERGE_SET'] = [];
                    rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(0, tempRowCnt));
                    rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(1, tempRowCnt));
                    tempRowCnt = 1;
                }
            }

            if (self.inSiteList[rowData[i].SITE] == undefined) {
                self.inSiteList[rowData[i].SITE] = new Array();
            }

            self.inSiteList[rowData[i].SITE].push(rowData[i].SITE + "∮" + rowData[i].USER_ID + "∮" + rowData[i].UNAME);

            site_des = rowData[i].SITE_DES;
            site = rowData[i].SITE;
        }

        return rowData;
    },

    // rowspan merge
    setRowSpanMerge: function (startIndex, rowCnt) {
        var mergeData = {};

        mergeData['_MERGE_USEOWN'] = true;
        if (startIndex == 0)
            mergeData['_IS_CENTER_ALIGN'] = true;
        mergeData['_MERGE_START_INDEX'] = startIndex;
        mergeData['_ROWSPAN_COUNT'] = rowCnt;
        return mergeData;
    }

});