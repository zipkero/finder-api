window.__define_resource && __define_resource("LBL09727","LBL35346","LBL09927","LBL06789","LBL00830","LBL93528","LBL09019","LBL09020","LBL02938","LBL08581","LBL03858","LBL04600","LBL04601","LBL93739","LBL00683","LBL93330","LBL02361","LBL01554","LBL01564","LBL02263","LBL01565","LBL01171","LBL02730","LBL93360","LBL93363","LBL93687","LBL93689","BTN00141","BTN00037","LBL11726","LBL01280","LBL01732","LBL06157","LBL01042","BTN00672","LBL09914","BTN00070","BTN00008","BTN00065","LBL10288","MSG10452","MSG05398","MSG00500","LBL01482","LBL09915","MSG05387","MSG05388","MSG05389","MSG06315","MSG06316","LBL06787","LBL03657","MSG05400","MSG05401","MSG05402","MSG01334","MSG05416","MSG05417","MSG05418","MSG06318","MSG05422","MSG05423","MSG05424","MSG06319","MSG05419","MSG05420","MSG05421","MSG06317","LBL01809","LBL13759","LBL70053","MSG00008","LBL02695","LBL07973","LBL02853","LBL35235","LBL07157");
/****************************************************************************************************
1. Create Date : 2015.08.26
2. Creator     : 신희준
3. Description : ex) 판매입력 - 알림설정 팝업창
4. Precaution  :
5. History     : Modify 2016.05.04 (add function Notification Setting menu by Thien.Nguyen)
                 Modify 2016.10.01 (edit with mgmt process case)
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EMJ002P_29", {

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
        var headerOption = []
        
        if ($.isEmpty(this.RECEIVE_FORM_TYPE) == false) {
            headerOption.push({ id: 'EmailReceiveForm', label: ecount.resource.LBL09727 }); //메일수신화면양식
        }
        
        if (this.hidSlipGubun == 'N')
            header.setTitle(ecount.resource.LBL35346 + "-" + ecount.resource.LBL09927);
        else
            header.setTitle(ecount.resource.LBL06789); //발송설정

        if (this.hidMgmtProc == "Y") 
            header.setTitle(ecount.resource.LBL35346); //발송설정    

        header.notUsedBookmark();
        header.add('option', headerOption, false);

    },
    onInitContents: function (contents, resource) {
        this.sfSnotiData = this.viewBag.InitDatas.SfSnotiData;                   //문구설정   GridData, CommentSetting GridData
        var sfSnotiReceiverData = this.viewBag.InitDatas.SfSnotiReceiverData,    //대상자설정 GridData, ReceiverSetting GridData
           sfSnotiGridData = this.getSfSnotiGridData.call(this),           //문구설정그리드 데이타 (commentSetting Grid Data)
           sfSnotiReceiverGridData =                                       //대상자설정 그리드 데이타 (ReceiverSetting Grid Data)
                       $.parseJSON(this.IsDBSelect === "N" ?
                                       this.RECEIVERS :
                                       Object.toJSON(sfSnotiReceiverData)),
           g = widget.generator,
           toolbar = g.toolbar(),
           toolbar1 = g.toolbar(),                    
           SfSnotiSettingGrid = g.grid(),
           SfSnotiReceiverSettingGrid = g.grid(),
           ctrl = g.control(),
            form = g.form(),
            form2 = g.form();
        // document gubun select for setting (Chọn Loại Menu cần thiết lập)
        if (this.hidSlipGubun == 'N') {
            toolbar.addRight(ctrl.define("widget.select", "doc_gubun", "doc_gubun").option([
               ["00", ecount.resource.LBL00830],
               ["210", ecount.resource.LBL93528],
               ["211", ecount.resource.LBL09019],
               ["212", ecount.resource.LBL09020],
               ["214", ecount.resource.LBL02938],
               ["215", ecount.resource.LBL08581],
               ["216", ecount.resource.LBL03858],
               ["223", ecount.resource.LBL04600],
               ["224", ecount.resource.LBL04601],
               ["227", ecount.resource.LBL93739],
               ["225", ecount.resource.LBL00683],
               ["226", ecount.resource.LBL93330],
               ["217", ecount.resource.LBL02361],
               ["218", ecount.resource.LBL01554],
               ["219", ecount.resource.LBL01564 + " " + ecount.resource.LBL02263],
               ["220", ecount.resource.LBL01565 + " " + ecount.resource.LBL02263],
               ["221", ecount.resource.LBL01171 + " " + ecount.resource.LBL02263],
               ["222", ecount.resource.LBL02730],
               ["228", ecount.resource.LBL93360],
               ["229", ecount.resource.LBL93363],
               ["230", ecount.resource.LBL93687],
               ["231", ecount.resource.LBL93689],
            ])
               .select(this.DOC_GUBUN))
        }
        //this.NoticeType = "approve"
        toolbar.addRight(ctrl.define("widget.button", "defaultSetting").label(ecount.resource.BTN00141));
        this.loadsfSnotiReceiverGridData = sfSnotiReceiverGridData;
        toolbar1
               .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
               .addLeft(ctrl.define("widget.button", "deleteSelected").label(ecount.resource.BTN00037).hide());

        if ($.isEmpty(this.viewBag.InitDatas.receiveFormList) == false) {
            form2.add(ctrl.define('widget.select', 'mailReceiveForm', 'mailReceiveForm', ecount.resource.LBL09727)  //메일수신화면양식 
                        .option(this.getFormListData(this.viewBag.InitDatas.receiveFormList))
                        .select(this.receiveSelectedFormSeq).singleCell().end());            
        }

        //문구설정그리드 설정 Setting Notification grid(Thiết lập lưới thiết lập thông báo)
        var setColumns = [
                { id: 'DisplayComment', propertyName: 'DISPLAYCOMMENT', width: '115', controlType: 'widget.userHelpMark' , title : this.hidMgmtProc == "Y" ? "Type" : "" },
                {
                    id: 'Register', propertyName: 'REGISTER', title: !this.hidMgmtProc ? ecount.resource.LBL11726 : ecount.resource.LBL01280, width: !this.hidMgmtProc ? (this.NoticeType == "approve" ? '775' : "155") : "", controlType: 'widget.input.general', //등록 edit controlType
                    validation: this.CheckSfSnotiSettingGridValidation.bind(this, 'Register')
                }];
        
        if (this.NoticeType != "approve" && !this.hidMgmtProc) {
            setColumns.push({
                id: 'Modify', propertyName: 'MODIFY', title: ecount.resource.LBL01732, width: '155', controlType: 'widget.input.general', //수정 edit controlType
                validation: this.CheckSfSnotiSettingGridValidation.bind(this, 'Modify')
            });
            setColumns.push({
                id: 'Delete', propertyName: 'DELETE', title: ecount.resource.LBL06157, width: '155', controlType: 'widget.input.general', //삭제 edit controlType
                validation: this.CheckSfSnotiSettingGridValidation.bind(this, 'Delete')
            });
            setColumns.push({
                id: 'Confirm', propertyName: 'CONFIRM', title: ecount.resource.LBL01042, width: '155', controlType: 'widget.input.general', //확인 confirm controltype
                validation: this.CheckSfSnotiSettingGridValidation.bind(this, 'Confirm')
            });
            setColumns.push({
                id: 'UnConfirm', propertyName: 'UNCONFIRM', title: ecount.resource.BTN00672, width: '155', controlType: 'widget.input.general', //확인취소 unconfirm controlType
                validation: this.CheckSfSnotiSettingGridValidation.bind(this, 'UnConfirm')
            });


        }

        SfSnotiSettingGrid
            .setEditable(true, 0, 0)
            .setColumns(setColumns)
            .setRowData(sfSnotiGridData)
            .setStyleBorderRemoveLeftRight(true)
            .setCustomRowCell('DisplayComment', this.setGridDataCustomDisplayCommentBySfSnotiSettingGrid.bind(this))
            .setCustomRowCell('Register', this.setGridDataCustomRegisterBySfSnotiSettingGrid.bind(this))
            .setCustomRowCell('Modify', this.setGridDataCustomModifyBySfSnotiSettingGrid.bind(this))
            .setCustomRowCell('Delete', this.setGridDataCustomDeleteBySfSnotiSettingGrid.bind(this))
            .setCustomRowCell('Confirm', this.setGridDataCustomConfirmBySfSnotiSettingGrid.bind(this))
            .setCustomRowCell('UnConfirm', this.setGridDataCustomUnConfirmBySfSnotiSettingGrid.bind(this));


        //대상자설정 그리드 설정 Setting Receiver Notification grid(Thiết lập lưới người nhận thiết lập thông báo)
        SfSnotiReceiverSettingGrid
            .setEditable(true, this.NoticeType == "approve" ? (this.ReceiversCount || 0) : 3, this.NoticeType == "approve" ? 0 : 1)
            .setColumns(this.getSfSnotiReceiverGridColumn.call(this))
            .setRowData(sfSnotiReceiverGridData)
            .setCheckBoxUse(true)
            //.setCheckBoxInitialCheckedItems(['0','2'])
            //.setCheckBoxHeaderCallback({
            //    'change': function (e, data) {
            //        this.gridObjectSfSnotiReceiver.checkAllCustom('EmailCheck', data.target.checked);
            //        this.gridObjectSfSnotiReceiver.checkAllCustom('MobileCheck', data.target.checked);
            //        this.gridObjectSfSnotiReceiver.checkAllCustom('MessageCheck', data.target.checked);
            //        this.gridObjectSfSnotiReceiver.checkAllCustom('RegisterCheck', data.target.checked);
            //        this.gridObjectSfSnotiReceiver.checkAllCustom('ConfirmCheck', data.target.checked);
            //    }.bind(this)
            //})
            .setCheckBoxCallback({
                'change': function (e, data) {
                    var isChecked = this.gridObjectSfSnotiReceiver.isChecked(data.rowKey);
                    this.gridObjectSfSnotiReceiver.setCell('CHK_YN', data.rowKey, this.valueConverting(isChecked));
                    this.gridObjectSfSnotiReceiver.setCell('EmailCheck', data.rowKey, this.valueConverting(isChecked));
                    this.gridObjectSfSnotiReceiver.setCell('MobileCheck', data.rowKey, this.valueConverting(isChecked));
                    this.gridObjectSfSnotiReceiver.setCell('MessageCheck', data.rowKey, this.valueConverting(isChecked));
                    this.gridObjectSfSnotiReceiver.setCell('RegisterCheck', data.rowKey, this.valueConverting(isChecked));
                    this.gridObjectSfSnotiReceiver.setCell('ConfirmCheck', data.rowKey, this.valueConverting(isChecked));

                    var _checkedItem = this.gridObjectSfSnotiReceiver.getChecked();

                    if (_checkedItem.length > 0)
                        this.contents.getControl("deleteSelected").show();
                    else
                        this.contents.getControl("deleteSelected").hide();

                }.bind(this)
            })
            .setEditRowDataSample({ CHK_YN: "N", LAN_TYPE: this.viewBag.Language })
            .setEventAutoAddRowOnLastRow(!(this.NoticeType == "approve"), 2)
            .setStyleBorderRemoveLeftRight(true)
            .setEventWidgetTriggerObj(this.events)
            .setCustomRowCell('ID', this.setGridDataCustomIDCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('EmailCheck', this.setGridDataCustomEmailCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('MobileCheck', this.setGridDataCustomMobileCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('MessageCheck', this.setGridDataCustomMessageCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('Email', this.setGridDataCustomEmailBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('Mobile', this.setGridDataCustomMobileBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('RegisterCheck', this.setGridDataCustomRegisterCheckBySfSnotiReceiverSettingGrid.bind(this))
            .setCustomRowCell('ConfirmCheck', this.setGridDataCustomConfirmCheckBySfSnotiReceiverSettingGrid.bind(this));
            if (this.NoticeType != "approve") {
                SfSnotiReceiverSettingGrid.setCheckBoxHeaderCallback({
                    'change': function (e, data) {
                        this.gridObjectSfSnotiReceiver.checkAllCustom('EmailCheck', data.target.checked);
                        this.gridObjectSfSnotiReceiver.checkAllCustom('MobileCheck', data.target.checked);
                        this.gridObjectSfSnotiReceiver.checkAllCustom('MessageCheck', data.target.checked);
                        this.gridObjectSfSnotiReceiver.checkAllCustom('RegisterCheck', data.target.checked);
                        this.gridObjectSfSnotiReceiver.checkAllCustom('ConfirmCheck', data.target.checked);
                    }.bind(this)
                })
            } else {
                SfSnotiReceiverSettingGrid.setCheckBoxHeaderCallback({
                    'change': function (e, data) {
                        this.gridObjectSfSnotiReceiver.checkAllCustom('MobileCheck', data.target.checked);
                        this.gridObjectSfSnotiReceiver.checkAllCustom('MessageCheck', data.target.checked);
                    }.bind(this)
                })

            }
        
        if (!$.isEmpty(this.sfSnotiData) && this.DOC_GUBUN != "00" && this.DOC_GUBUN != "210" && this.DOC_GUBUN != "211" && this.DOC_GUBUN != "212" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "227" && this.DOC_GUBUN != "225") {
            this.sfSnotiData.EMAIL_CHK_DEL_YN = "N"
            this.sfSnotiData.EMAIL_CHK_YN = "N";
        }
        form.template("")
        .add(ctrl.define("widget.custom", "notifMenu", "notifMenu", ecount.resource.LBL09914).end())
        if (this.hidSlipGubun == 'N') {
            contents
            .add(toolbar)
            .add(form)
            .add(form2)
            .addGrid("SfSnotiSettingGrid" + this.pageID, SfSnotiSettingGrid)
            .add(toolbar1)
            .addGrid("SfSnotiReceiverSettingGrid" + this.pageID, SfSnotiReceiverSettingGrid);
        }
        else {
            contents
                .add(form2)
                .addGrid("SfSnotiSettingGrid" + this.pageID, SfSnotiSettingGrid)               
                .add(toolbar1)
                .addGrid("SfSnotiReceiverSettingGrid" + this.pageID, SfSnotiReceiverSettingGrid);
        }

    },
    onInitFooter: function (footer, resource) {
        var generator = widget.generator;
        var toolbar = generator.toolbar();
        var ctrl = generator.control();
        if (this.hidSlipGubun == "Y") {
            toolbar
                .addLeft(ctrl.define("widget.button", "Save").label(resource.BTN00070))    //적용
                .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        }
        else {
            if (this.hidSlipGubun == "N") {
                toolbar
                    .addLeft(ctrl.define("widget.button", "Save").label(resource.BTN00065).clickOnce())    //적용
                    .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))     // 닫기
                    .addLeft(ctrl.define("widget.button", "History").label("H"));
            }
            else {
                toolbar
                    .addLeft(ctrl.define("widget.button", "Save").label(resource.BTN00065).clickOnce())    //적용
                    .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))     // 닫기
            }
        }

        footer.add(toolbar); //toolbar add[footer 영역의 닫기] (Thêm thanh chức năng vào chân trang)
    },
    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);

        if (cid == "notifMenu") {
            var ctrl = widget.generator.control();
            control
                .addControl(ctrl.define("widget.checkbox", "sms", "sms").label("<img src=\"/ECMain/ECount.Common/Images/work_alram_01.gif\">").useHTML().value(1).hide())
                .addControl(ctrl.define("widget.checkbox", "email", "email").label("<img src=\"/ECMain/ECount.Common/Images/work_alram_02.gif\">").useHTML().value(1))
                .addControl(ctrl.define("widget.checkbox", "message", "message").label("<img src=\"/ECMain/ECount.Common/Images/work_alram_03.gif\">").useHTML().value(1))
                .addControl(ctrl.define("widget.checkbox", "appPush", "appPush").label(ecount.resource.LBL10288).value(1))
        }
    },
    onContentsDefaultSetting: function () {
        this.loadDataSelect("Y");
    },
    onChangeControl: function (control) {
        var self = this;
        if (control.cid == "doc_gubun") {
            self.loadDataSelect();
        }

        if (control.cid == "message") {
            var chks = self.contents.getControl("notifMenu");
            if (control.value == true) {
                chks.get(3).readOnly(false);
                chks.get(3).setValue(1);
            }
            else {
                chks.get(3).setValue(0);
                chks.get(3).readOnly(true);
            }
        }
        else if (control.cid == "mailReceiveForm") {
            this.receiveSelectedFormSeq = control.value;
        }
    },
    loadDataSelect: function (isDefault) {
        var self = this;
        var strDefault = "";
        if (!$.isEmpty(isDefault))
            strDefault = isDefault;
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

        var chks = this.contents.getControl("notifMenu");
        if (chks != undefined) {
            if (!$.isEmpty(this.sfSnotiData) && this.sfSnotiData.APP_PUSH_CHK_YN == "Y" || !$.isEmpty(this.sfSnotiData) && this.sfSnotiData.MEMO_CHK_YN == "Y")
                chks.get(3).readOnly(false)
            else
                chks.get(3).readOnly(true)
            if (this.isUseSMS) {
                chks.get(0).show();
                chks.get(0).setValue(!$.isEmpty(this.sfSnotiData) && this.sfSnotiData.SMS_CHK_YN == "Y" ? 1 : 0);
            }
            chks.get(1).setValue(!$.isEmpty(this.sfSnotiData) && this.sfSnotiData.EMAIL_CHK_YN == "Y" ? 1 : 0);
            chks.get(2).setValue(!$.isEmpty(this.sfSnotiData) && this.sfSnotiData.MEMO_CHK_YN == "Y" ? 1 : 0);
            chks.get(3).setValue(!$.isEmpty(this.sfSnotiData) && this.sfSnotiData.APP_PUSH_CHK_YN == "Y" ? 1 : 0);

            if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "210" && this.DOC_GUBUN != "211" && this.DOC_GUBUN != "212" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "227" && this.DOC_GUBUN != "225") {
                chks.get(1).readOnly(true)
            }
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
                if (!$.isEmpty(item.USER_ID)) {
                    ChkUserId = ChkUserId + item.USER_ID + ecount.delimiter;
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
       switch(page.pageID) {
            case "CM100P_02": // 수신화면양식설정
                var ctrl = this.contents.getControl("mailReceiveForm");
                if (data.type == "reload" && !ctrl.isContain(data.formSeq)) {
                    var newReceiveForm = this.getFormListData([{ FORM_SEQ: data.formSeq, TITLE_NM: data.formName }]);
                    newReceiveForm[0].push(this.viewBag.InitDatas.receiveFormList.length -1); // insert할 인덱스
                    ctrl.addOption(newReceiveForm);
                    this.viewBag.InitDatas.receiveFormList.insert(this.viewBag.InitDatas.receiveFormList.length -1, newReceiveForm[0]);
                }
                ctrl.setValue(data.formSeq);
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

            for (var idx = 0, limit = data.dataRows.length; idx < limit; idx++) {
                if (this.valueConverting(data.dataRows[idx]['CHK_YN']))
                    this.gridObjectSfSnotiReceiver.addChecked(data.dataRows[idx][ecount.grid.constValue.keyColumnPropertyName], { isRunChange: false });
            }

            var _checkedItem = this.gridObjectSfSnotiReceiver.getChecked();

            if (_checkedItem.length > 0)
                this.contents.getControl("deleteSelected").show();
            else
                this.contents.getControl("deleteSelected").hide();
        }
    },

    onGridAfterFormLoad: function (e, data, grid) {
        this._super.onGridAfterFormLoad.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)(Định nghĩa các sự kiện)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/

    onContentsDeleteSelected: function () {
        var selectItem = this.gridObjectSfSnotiReceiver.getChecked()
        this.gridObjectSfSnotiReceiver.removeCheckedRow();
        // row를 지운후 체크박스 사용여부를 처리 하기 위해서 강제로 Setting
        for (var i = 0; i < selectItem.length ; i++) {
            this.setGridDataCustomEmailCheckBySfSnotiReceiverSettingGrid(false, selectItem[i]);
            this.setGridDataCustomMobileCheckBySfSnotiReceiverSettingGrid(false, selectItem[i]);
            this.setGridDataCustomMessageCheckBySfSnotiReceiverSettingGrid(false, selectItem[i]);

            this.setGridDataCustomRegisterCheckBySfSnotiReceiverSettingGrid(false, selectItem[i]);
            this.setGridDataCustomConfirmCheckBySfSnotiReceiverSettingGrid(false, selectItem[i]);

            this.gridObjectSfSnotiReceiver.refreshCell("EmailCheck", selectItem[i]["K-E-Y"]);
            this.gridObjectSfSnotiReceiver.refreshCell("MobileCheck", selectItem[i]["K-E-Y"]);
            this.gridObjectSfSnotiReceiver.refreshCell("MessageCheck", selectItem[i]["K-E-Y"]);
            this.gridObjectSfSnotiReceiver.refreshCell("RegisterCheck", selectItem[i]["K-E-Y"]);
            this.gridObjectSfSnotiReceiver.refreshCell("ConfirmCheck", selectItem[i]["K-E-Y"]);
        }

        this.contents.getControl("deleteSelected").hide();
    },

    onFooterClose: function (e) {
        this.close();
    },
    onFooterSave: function (e) {

        if (this.hidSlipGubun == "N") {
            this.savedata("2");
        }
        else
            this.applydata();
    },
    savedata: function (gubun) {

        var self = this;
        var btnSave = self.footer.get(0).getControl("Save");
        if (self.ComCd.length > 0 && (self.ComCd.substring(0, 2).toUpperCase() == "G1" || self.ComCd.substring(0, 2).toUpperCase() == "G2") && self.UserId.toUpperCase() == "GUEST")
            return false;
        if (self.viewBag.InitDatas.USER_PERMIT == "R") {
            ecount.alert(ecount.resource.MSG10452) // resource not found
            return false;
        }

        var chks = self.contents.getControl('notifMenu'),
        SMS_CHK_YN = chks.get(0).getValue() == true ? "Y" : "N",
        EMAIL_CHK_YN = chks.get(1).getValue() == true ? "Y" : "N",
        MEMO_CHK_YN = chks.get(2).getValue() == true ? "Y" : "N";
        APP_PUSH_CHK_YN = chks.get(3).getValue() == true ? "Y" : "N";
        var validateSucess = true,
          mergeEntity = {
              SMS_CHK_YN: self.hidNoticePopup == "N" ? SMS_CHK_YN : "N",
              EMAIL_CHK_YN: self.hidNoticePopup == "N" ? EMAIL_CHK_YN : "N",
              MEMO_CHK_YN: self.hidNoticePopup == "N" ? MEMO_CHK_YN : "N",
              APP_PUSH_CHK_YN: self.hidNoticePopup == "N" ? APP_PUSH_CHK_YN : "N",

              SMS_TXT_REG: null,
              SMS_TXT_UPT: null,
              SMS_TXT_DEL: null,

              EMAIL_TXT_REG: null,
              EMAIL_TXT_UPT: null,
              EMAIL_TXT_DEL: null,

              MEMO_TXT_REG: null,
              MEMO_TXT_UPT: null,
              MEMO_TXT_DEL: null,

              SMS_TXT_CONFIRM: null,
              SMS_TXT_UNDO_CONFIRM: null,

              EMAIL_TXT_CONFIRM: null,
              EMAIL_TXT_UNDO_CONFIRM: null,

              MEMO_TXT_CONFIRM: null,
              MEMO_TXT_UNDO_CONFIRM: null,

              SMS_CHK_DEL_YN: self.hidNoticePopup == "N" ? this.SMS_CHK_DEL_YN : "N",
              EMAIL_CHK_DEL_YN: self.hidNoticePopup == "N" ? this.EMAIL_CHK_DEL_YN : "N",
              MEMO_CHK_DEL_YN: self.hidNoticePopup == "N" ? this.MEMO_CHK_DEL_YN : "N",
              DOC_GUBUN: self.DOC_GUBUN,
              DOC_RESPORE: gubun == 1 ? "Y" : "",

              RECEIVERS: [],

              RECEIVE_FORM_TYPE: this.RECEIVE_FORM_TYPE,
              RECEIVE_FORM_SEQ: this.receiveSelectedFormSeq
          };

        /*
        SfSnotiReceiverGrid Validation - Start(Kiểm tra tính hợp lệ dữ liệu SfSnotiReceiverGrid)
        */
        // * CustomValidation - 체크된 항목중에 중복된 아이디가 존재하는지 체크
        this.loopSfSnotiReceiverGridCheck('Validation', function (propertyType, index) {
            if (propertyType == "CHK_H" || propertyType == "EMAIL_CHK_YN" || propertyType == "HPNO_CHK_YN" || propertyType == "MEMO_CHK_YN") {
                var gridObjectSfSnotiReceiverGetRowList = self.gridObjectSfSnotiReceiver.getRowList();
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
        }.bind(self))

        ////SfSnotiGrid EmailValidation
        if (validateSucess)
            validateSucess = self.gridObjectSfSnotiReceiver.validate().result;
        //this.gridObjectSfSnotiReceiver.validate();
        /*
        SfSnotiReceiverGrid Validation - End
        */

        //SfSnotiGrid Validation
        if (validateSucess)
            validateSucess = self.gridObjectSfSnoti.validate().result;
        //this.gridObjectSfSnoti.validate();

        //dataSave inner function
        function _setMergeEntity() {
            this.loopSfSnotiGridCheck('SetEntity', function (entity, index) {
                switch (entity.TYPE) {
                    case "SMS":
                        mergeEntity.SMS_TXT_REG = entity.REGISTER;
                        mergeEntity.SMS_TXT_UPT = entity.MODIFY;
                        mergeEntity.SMS_TXT_DEL = entity.DELETE;
                        mergeEntity.SMS_TXT_CONFIRM = entity.CONFIRM;
                        mergeEntity.SMS_TXT_UNDO_CONFIRM = entity.UNCONFIRM;
                        break;
                    case "Memo":
                        mergeEntity.MEMO_TXT_REG = entity.REGISTER;
                        mergeEntity.MEMO_TXT_UPT = entity.MODIFY;
                        mergeEntity.MEMO_TXT_DEL = entity.DELETE;
                        mergeEntity.MEMO_TXT_CONFIRM = entity.CONFIRM;
                        mergeEntity.MEMO_TXT_UNDO_CONFIRM = entity.UNCONFIRM;
                        break;
                    case "Email":
                        mergeEntity.EMAIL_TXT_REG = entity.REGISTER;
                        mergeEntity.EMAIL_TXT_UPT = entity.MODIFY;
                        mergeEntity.EMAIL_TXT_DEL = entity.DELETE;
                        mergeEntity.EMAIL_TXT_CONFIRM = entity.CONFIRM;
                        mergeEntity.EMAIL_TXT_UNDO_CONFIRM = entity.UNCONFIRM;
                        break;
                }
            }.bind(this));

            self.loopSfSnotiReceiverGridCheck('SetEntity', function (entity, index) {
                if (!$.isEmpty(entity.USER_ID) || !$.isEmpty(entity.UNAME) || !$.isEmpty(entity.EMAIL) || !$.isEmpty(entity.HP_NO) ||
                    entity.EMAIL_CHK_YN || entity.HPNO_CHK_YN || entity.MEMO_CHK_YN) {

                    entity.EMAIL_CHK_YN = entity.EMAIL_CHK_YN ? 'Y' : 'N';
                    entity.HPNO_CHK_YN = entity.HPNO_CHK_YN ? 'Y' : 'N';
                    entity.MEMO_CHK_YN = entity.MEMO_CHK_YN ? 'Y' : 'N';
                    entity.REGISTER_CHK_YN = entity.REGISTER_CHK_YN ? 'Y' : 'N';
                    entity.CONFIRM_CHK_YN = entity.CONFIRM_CHK_YN ? 'Y' : 'N';
                    mergeEntity.RECEIVERS.push(entity);
                }
            }.bind(self));
        }

        if (validateSucess) {
            _setMergeEntity.apply(self);
            ecount.common.api({
                url: "/SelfCustomize/Config/InsertSFSNoti",
                data: Object.toJSON(mergeEntity),
                success: function (result) {
                    if (result.Status == "200") {
                        this.reloadPage();
                        ecount.alert(ecount.resource.MSG00500);
                    }
                    else {
                        ecount.alert(result.fullErrorMsg);
                        btnSave.setAllowClick();
                    }
                }.bind(self),
                complete: function () {
                    btnSave.setAllowClick();
                }
            }
            );

        }
        else {
            btnSave.setAllowClick();
        }
    },
    applydata: function () {

        var validateSucess = true,
          mergeEntity = {
              SMS_CHK_YN: this.IsDBSelect == "N" ? this.SMS_CHK_YN : "N", // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함
              EMAIL_CHK_YN: this.IsDBSelect == "N" ? this.EMAIL_CHK_YN : "N", // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함
              MEMO_CHK_YN: this.IsDBSelect == "N" ? this.MEMO_CHK_YN : "N", // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함

              SMS_TXT_REG: null,
              SMS_TXT_UPT: null,
              SMS_TXT_DEL: null,

              EMAIL_TXT_REG: null,
              EMAIL_TXT_UPT: null,
              EMAIL_TXT_DEL: null,

              MEMO_TXT_REG: null,
              MEMO_TXT_UPT: null,
              MEMO_TXT_DEL: null,

              SMS_TXT_CONFIRM: null,
              SMS_TXT_UNDO_CONFIRM: null,

              EMAIL_TXT_CONFIRM: null,
              EMAIL_TXT_UNDO_CONFIRM: null,

              MEMO_TXT_CONFIRM: null,
              MEMO_TXT_UNDO_CONFIRM: null,

              SMS_CHK_DEL_YN: this.IsDBSelect == "N" ? this.SMS_CHK_DEL_YN : "N", // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함
              EMAIL_CHK_DEL_YN: this.IsDBSelect == "N" ? this.EMAIL_CHK_DEL_YN : "N", // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함
              MEMO_CHK_DEL_YN: this.IsDBSelect == "N" ? this.MEMO_CHK_DEL_YN : "N", // 추후 Self-Customizing 공통페이지가 개발되면 this.IsDBSelect != "N" 은 Control에서 가져오게 수정해야함

              RECEIVERS: [],
              RECEIVE_FORM_TYPE: this.RECEIVE_FORM_TYPE,
              RECEIVE_FORM_SEQ: this.receiveSelectedFormSeq
          };

        /*
        SfSnotiReceiverGrid Validation - Start
        */
        // * CustomValidation - 체크된 항목중에 중복된 아이디가 존재하는지 체크
        this.loopSfSnotiReceiverGridCheck('Validation', function (propertyType, index) {
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
                        mergeEntity.SMS_TXT_REG = entity.REGISTER;
                        mergeEntity.SMS_TXT_UPT = entity.MODIFY;
                        mergeEntity.SMS_TXT_DEL = entity.DELETE;
                        mergeEntity.SMS_TXT_CONFIRM = entity.CONFIRM;
                        mergeEntity.SMS_TXT_UNDO_CONFIRM = entity.UNCONFIRM;
                        break;
                    case "Memo":
                        mergeEntity.MEMO_TXT_REG = entity.REGISTER;
                        mergeEntity.MEMO_TXT_UPT = entity.MODIFY;
                        mergeEntity.MEMO_TXT_DEL = entity.DELETE;
                        mergeEntity.MEMO_TXT_CONFIRM = entity.CONFIRM;
                        mergeEntity.MEMO_TXT_UNDO_CONFIRM = entity.UNCONFIRM;
                        break;
                    case "Email":
                        mergeEntity.EMAIL_TXT_REG = entity.REGISTER;
                        mergeEntity.EMAIL_TXT_UPT = entity.MODIFY;
                        mergeEntity.EMAIL_TXT_DEL = entity.DELETE;
                        mergeEntity.EMAIL_TXT_CONFIRM = entity.CONFIRM;
                        mergeEntity.EMAIL_TXT_UNDO_CONFIRM = entity.UNCONFIRM;
                        break;
                }
            }.bind(this));

            this.loopSfSnotiReceiverGridCheck('SetEntity', function (entity, index) {
                if (!$.isEmpty(entity.USER_ID) || !$.isEmpty(entity.UNAME) || !$.isEmpty(entity.EMAIL) || !$.isEmpty(entity.HP_NO) ||
                    entity.EMAIL_CHK_YN || entity.HPNO_CHK_YN || entity.MEMO_CHK_YN) {

                    entity.EMAIL_CHK_YN = entity.EMAIL_CHK_YN ? 'Y' : 'N';
                    entity.HPNO_CHK_YN = entity.HPNO_CHK_YN ? 'Y' : 'N';
                    entity.MEMO_CHK_YN = entity.MEMO_CHK_YN ? 'Y' : 'N';
                    entity.REGISTER_CHK_YN = entity.REGISTER_CHK_YN ? 'Y' : 'N';
                    entity.CONFIRM_CHK_YN = entity.CONFIRM_CHK_YN ? 'Y' : 'N';
                    mergeEntity.RECEIVERS.push(entity);
                }
            }.bind(this));
        }

        if (validateSucess) {
            _setMergeEntity.apply(this);
            mergeEntity.noticeType = this.NoticeType;
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
        var returnData = []
        if (this.NoticeType != "approve") {
            returnData.push({
                "TYPE": "Email",
                "DISPLAYCOMMENT": ecount.resource.LBL09915, //이메일제목
                "REGISTER": this.IsDBSelect == "N" ? this.EMAIL_TXT_REG : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.EMAIL_TXT_REG : ecount.resource.MSG05387), //[ecount01] [ecount02] 번 전표가 등록되었습니다.
                "MODIFY": this.IsDBSelect == "N" ? this.EMAIL_TXT_UPT : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.EMAIL_TXT_UPT : ecount.resource.MSG05388), //[ecount01] [ecount02] 번 전표가 수정되었습니다.
                "DELETE": this.IsDBSelect == "N" ? this.EMAIL_TXT_DEL : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.EMAIL_TXT_DEL : ecount.resource.MSG05389),  //[ecount01] [ecount02] 번 전표가 삭제되었습니다.
                "CONFIRM": this.IsDBSelect == "N" ? this.EMAIL_TXT_CONFIRM : (!$.isEmpty(this.sfSnotiData) ? ($.isNull(this.sfSnotiData.EMAIL_TXT_CONFIRM) ? ecount.resource.MSG06315 : this.sfSnotiData.EMAIL_TXT_CONFIRM) : ecount.resource.MSG06315),  //[ecount01] [ecount02] 번 전표가 확인되었습니다.
                "UNCONFIRM": this.IsDBSelect == "N" ? this.EMAIL_TXT_UNDO_CONFIRM : (!$.isEmpty(this.sfSnotiData) ? ($.isNull(this.sfSnotiData.EMAIL_TXT_UNDO_CONFIRM) ? ecount.resource.MSG06316 : this.sfSnotiData.EMAIL_TXT_UNDO_CONFIRM) : ecount.resource.MSG06316),  //[ecount01] [ecount02] 번 전표가 확인취소되었습니다.
            });
        }
        returnData.push({
            "TYPE": "Memo",
            "DISPLAYCOMMENT": ecount.resource.LBL06787, //쪽지발송문구
            "REGISTER": this.IsDBSelect == "N" ? this.MEMO_TXT_REG : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.MEMO_TXT_REG : ecount.resource.MSG05387), //[ecount01] [ecount02] 번 전표가 등록되었습니다.
            "MODIFY": this.IsDBSelect == "N" ? this.MEMO_TXT_UPT : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.MEMO_TXT_UPT : ecount.resource.MSG05388), //[ecount01] [ecount02] 번 전표가 수정되었습니다.
            "DELETE": this.IsDBSelect == "N" ? this.MEMO_TXT_DEL : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.MEMO_TXT_DEL : ecount.resource.MSG05389),  //[ecount01] [ecount02] 번 전표가 삭제되었습니다.
            "CONFIRM": this.IsDBSelect == "N" ? this.MEMO_TXT_CONFIRM : (!$.isEmpty(this.sfSnotiData) ? ($.isNull(this.sfSnotiData.MEMO_TXT_CONFIRM) ? ecount.resource.MSG06315 : this.sfSnotiData.MEMO_TXT_CONFIRM) : ecount.resource.MSG06315),  //[ecount01] [ecount02] 번 전표가 확인되었습니다.
            "UNCONFIRM": this.IsDBSelect == "N" ? this.MEMO_TXT_UNDO_CONFIRM : (!$.isEmpty(this.sfSnotiData) ? ($.isNull(this.sfSnotiData.MEMO_TXT_UNDO_CONFIRM) ? ecount.resource.MSG06316 : this.sfSnotiData.MEMO_TXT_UNDO_CONFIRM) : ecount.resource.MSG06316),  //[ecount01] [ecount02] 번 전표가 확인취소되었습니다.
        });

        if (this.isUseSMS) {
            returnData.unshift(
                {
                    "TYPE": "SMS",
                    "DISPLAYCOMMENT": ecount.resource.LBL03657, //SMS발송문구
                    "REGISTER": this.IsDBSelect == "N" ? this.SMS_TXT_REG : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.SMS_TXT_REG : ecount.resource.MSG05387), //[ecount01] [ecount02] 번 전표가 등록되었습니다.  
                    "MODIFY": this.IsDBSelect == "N" ? this.SMS_TXT_UPT : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.SMS_TXT_UPT : ecount.resource.MSG05388), //[ecount01] [ecount02] 번 전표가 수정되었습니다.
                    "DELETE": this.IsDBSelect == "N" ? this.SMS_TXT_DEL : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.SMS_TXT_DEL : ecount.resource.MSG05389),  //[ecount01] [ecount02] 번 전표가 삭제되었습니다.  
                    "CONFIRM": this.IsDBSelect == "N" ? this.SMS_TXT_CONFIRM : (!$.isEmpty(this.sfSnotiData) ? ($.isNull(this.sfSnotiData.SMS_TXT_CONFIRM) ? ecount.resource.MSG06315 : this.sfSnotiData.SMS_TXT_CONFIRM) : ecount.resource.MSG06315),  //[ecount01] [ecount02] 번 전표가 확인되었습니다.
                    "UNCONFIRM": this.IsDBSelect == "N" ? this.SMS_TXT_UNDO_CONFIRM : (!$.isEmpty(this.sfSnotiData) ? ($.isNull(this.sfSnotiData.SMS_TXT_UNDO_CONFIRM) ? ecount.resource.MSG06316 : this.sfSnotiData.SMS_TXT_UNDO_CONFIRM) : ecount.resource.MSG06316),  //[ecount01] [ecount02] 번 전표가 확인취소되었습니다.
                }
            );
        }

        if (this.hidMgmtProc == "Y") {
            returnData.clear();
            debugger;
            returnData.push({
                "TYPE": "Email",
                "DISPLAYCOMMENT": ecount.resource.LBL09915, //이메일제목
                "REGISTER": this.IsDBSelect == "N" ? this.EMAIL_TXT_REG : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.EMAIL_TXT_REG : ''), //[ecount01] [ecount02] 번 전표가 등록되었습니다.

                //"REGISTER" : "test ne"
            }, {
                "TYPE": "Memo",
                "DISPLAYCOMMENT": ecount.resource.LBL06787, //쪽지발송문구
                "REGISTER": this.IsDBSelect == "N" ? this.MEMO_TXT_REG : (!$.isEmpty(this.sfSnotiData) ? this.sfSnotiData.MEMO_TXT_REG : ''), //[ecount01] [ecount02] 번 전표가 등록되었습니다.

                //"REGISTER": "test ne"
            });
        }
        return returnData;
    },

    //타이틀Tip 이벤트핸들러, TitleTip EventHandler
    setGridDataCustomDisplayCommentBySfSnotiSettingGrid: function (value, rowItem) {
        
        var option = {},
            content;

        switch (rowItem["TYPE"]) {
            case "SMS": content = ecount.resource.MSG05400; break;
            case "Email": content = ecount.resource.MSG05401; break;
            case "Memo": content = ecount.resource.MSG05402; break;
        }
        option.attrs = {
            'data-toggle': 'popover',
            'data-placement': 'right',
            'data-html': 'true',
            'data-content': content
        }
        return option;
    },

    //Reister 이벤트핸들러
    setGridDataCustomRegisterBySfSnotiSettingGrid: function (value, rowItem) {
        
        var option = {};
        // Set edit able State(kiểm tra thiết lập cho phép chỉnh sửa)
        switch (rowItem["TYPE"]) {
            case "Email":
                if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "210" && this.DOC_GUBUN != "211" && this.DOC_GUBUN != "212" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "227" && this.DOC_GUBUN != "225")
                    option.editableState = 0;
                else
                    option.editableState = 1;
                break;
        }
        if (this.isUseSMS && rowItem[ecount.grid.constValue.keyColumnPropertyName] == "0") {
            option.controlOption = {
                maxByte: { message: ecount.resource.MSG01334, max: this.hidMgmtProc == "Y" ? 100 : 90 }
            };
        }
        return option;
    },

    //Modify 이벤트핸들러
    setGridDataCustomModifyBySfSnotiSettingGrid: function (value, rowItem) {
        var option = {};
        // Set edit able State(kiểm tra thiết lập cho phép chỉnh sửa)
        switch (rowItem["TYPE"]) {
            case "Email":
                if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "210" && this.DOC_GUBUN != "211" && this.DOC_GUBUN != "212" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "227" && this.DOC_GUBUN != "225")
                    option.editableState = 0;
                else
                    option.editableState = 1;
                break;
        }
        if (this.isUseSMS && rowItem[ecount.grid.constValue.keyColumnPropertyName] == "0") {
            option.controlOption = {
                maxByte: { message: ecount.resource.MSG01334, max: 90 }
            };
        }
        return option;
    },

    //Delete 이벤트핸들러
    setGridDataCustomDeleteBySfSnotiSettingGrid: function (value, rowItem) {
        var option = {};
        // Set edit able State(kiểm tra thiết lập cho phép chỉnh sửa)
        switch (rowItem["TYPE"]) {
            case "Email":
                if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "210" && this.DOC_GUBUN != "211" && this.DOC_GUBUN != "212" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "227" && this.DOC_GUBUN != "225")
                    option.editableState = 0;
                else
                    option.editableState = 1;
                break;
        }
        if (this.isUseSMS && rowItem[ecount.grid.constValue.keyColumnPropertyName] == "0") {
            option.controlOption = {
                maxByte: { message: ecount.resource.MSG01334, max: 90 }
            };
        }
        if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "214") {
            option.event = {
                'setNextFocus': function (e, data) {
                    if (data.rowIdx == this.gridObjectSfSnoti.getRowCount() - 1) {
                        this.gridObjectSfSnoti.activeCellFocusout();
                        this.gridObjectSfSnotiReceiver.setCellFocus("ID", "0");
                    }
                }.bind(this)
            }
        }
        return option;
    },

    //Confirm 이벤트핸들러
    setGridDataCustomConfirmBySfSnotiSettingGrid: function (value, rowItem) {
        var option = {};
        // Set edit able State(kiểm tra thiết lập cho phép chỉnh sửa)
        if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "210")
            option.editableState = 0;
       else
            option.editableState = 1;
        
        if (this.isUseSMS && rowItem[ecount.grid.constValue.keyColumnPropertyName] == "0") {
            option.controlOption = {
                maxByte: { message: ecount.resource.MSG01334, max: 90 }
            };
        }
        
        return option;
    },

    setGridDataCustomUnConfirmBySfSnotiSettingGrid: function (value, rowItem) {
        var option = {};
        // Set edit able State(kiểm tra thiết lập cho phép chỉnh sửa)
        if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "210")
            option.editableState = 0;
        else
            option.editableState = 1;
        if (this.isUseSMS && rowItem[ecount.grid.constValue.keyColumnPropertyName] == "0") {
            option.controlOption = {
                maxByte: { message: ecount.resource.MSG01334, max: 90 }
            };
        }
        option.event = {
            'setNextFocus': function (e, data) {
                if (data.rowIdx == this.gridObjectSfSnoti.getRowCount() - 1) {
                    this.gridObjectSfSnoti.activeCellFocusout();
                    this.gridObjectSfSnotiReceiver.setCellFocus("ID", "0");
                }
            }.bind(this)
        }

        return option;
    },

    //IsEmpty Validation Check
    CheckSfSnotiSettingGridValidation: function (target, value, rowItem) {
        var message,
            resultFlag = false;
        switch (rowItem["TYPE"]) {
            case "SMS":
                if (target == "Register")
                    message = ecount.resource.MSG05416; //[SMS발송문구] 등록 시 사용할 문구를 입력 바랍니다.  
                else if (target == "Modify")
                    message = ecount.resource.MSG05417; //[SMS발송문구] 수정 시 사용할 문구를 입력 바랍니다.
                else if (target == "Delete")
                    message = ecount.resource.MSG05418; //[SMS발송문구] 삭제 시 사용할 문구를 입력 바랍니다.
                else if (target == "Confirm")
                    message = String.format(ecount.resource.MSG06318, ecount.resource.LBL01042); //[SMS발송문구] 확인 시 사용할 문구를 입력 바랍니다.
                else if (target == "UnConfirm")
                    message = String.format(ecount.resource.MSG06318, ecount.resource.BTN00672); //[SMS발송문구] 확인취소 시 사용할 문구를 입력 바랍니다.
                break;
            case "Memo":
                if (target == "Register")
                    message = ecount.resource.MSG05422; //[이메일제목] 등록 시 사용할 문구를 입력 바랍니다.
                else if (target == "Modify")
                    message = ecount.resource.MSG05423; //[이메일제목] 수정 시 사용할 문구를 입력 바랍니다.
                else if (target == "Delete")
                    message = ecount.resource.MSG05424; //[이메일제목] 삭제 시 사용할 문구를 입력 바랍니다.
                else if (target == "Confirm")
                    message = String.format(ecount.resource.MSG06319, ecount.resource.LBL01042); //[이메일제목] 확인 시 사용할 문구를 입력 바랍니다.   MSG06319
                else if (target == "UnConfirm")
                    message = String.format(ecount.resource.MSG06319, ecount.resource.BTN00672); //[이메일제목] 확인취소 시 사용할 문구를 입력 바랍니다.   MSG06319
                break;
            case "Email":
                if (target == "Register")
                    message = ecount.resource.MSG05419; //[쪽지발송문구] 등록 시 사용할 문구를 입력 바랍니다.
                else if (target == "Modify")
                    message = ecount.resource.MSG05420; //[쪽지발송문구] 수정 시 사용할 문구를 입력 바랍니다.
                else if (target == "Delete")
                    message = ecount.resource.MSG05421; //[쪽지발송문구] 삭제 시 사용할 문구를 입력 바랍니다.
                else if (target == "Confirm")
                    message = String.format(ecount.resource.MSG06317, ecount.resource.LBL01042); //[쪽지발송문구] 확인 시 사용할 문구를 입력 바랍니다.   MSG06317
                else if (target == "UnConfirm")
                    message = String.format(ecount.resource.MSG06317, ecount.resource.BTN00672); //[쪽지발송문구] 확인취소 시 사용할 문구를 입력 바랍니다.   MSG06317
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
    },

    /**************************************************************************************************** 
    // SfSnotiSettingGrid 관련 Function, SfSnotiSettingGrid By Function - End
    ****************************************************************************************************/

    /**************************************************************************************************** 
    // SfSnotiReceiverSettingGrid 관련 Function, SfSnotiReceiverSettingGrid By Function - Start
    ****************************************************************************************************/

    //SfSnotiReceiver GridColumn Call
    getSfSnotiReceiverGridColumn: function () {

        var width = 195;
        if (this.isUseSMS) {
            width = 140;
        }
        if (this.NoticeType == "approve") {
            width = (width + 47) + (this.isUseSMS ? 0 : 16);
            width = Number(width + ((width + 30) / (this.isUseSMS ? 3 : 2)));
        }

        var returnData = [
                { id: 'ID', propertyName: 'USER_ID', title: ecount.resource.LBL01809, width: width, controlType: 'widget.code.user', validation: this.CheckSpecialCharacterEtc.bind(this), editableState: this.NoticeType == "approve" ? 0 : 1 },   //아이디 
                { id: 'Name', propertyName: 'UNAME', title: ecount.resource.LBL13759, width: width, controlType: 'widget.input', editableState: this.NoticeType == "approve" ? 0 : 1 }       //이름
        ]
        if (this.NoticeType != "approve") {
            returnData.push({ id: 'EmailCheck', propertyName: 'EMAIL_CHK_YN', align: "center", width: '30', controlType: 'widget.checkbox' });
            returnData.push({
                id: 'Email', propertyName: 'EMAIL', title: ecount.resource.LBL70053, width: this.hidMgmtProc ? 260 : width, controlType: 'widget.input',        //이메일
                validation: function (value, rowItem) {
                    var message = ecount.resource.MSG00008, resultFlag = false;   //이메일 형식에 맞춰 입력 바랍니다. 

                    if (rowItem['EMAIL'].length > 0 && !ecount.validator.check("email", rowItem['EMAIL']))
                        resultFlag = true;

                    return {
                        result: !resultFlag,
                        error: {
                            popover: { visible: resultFlag, message: message, placement: 'top' },
                            css: { visible: resultFlag }
                        }
                    };
                }.bind(this),
                editableState: (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "210" && this.DOC_GUBUN != "211" && this.DOC_GUBUN != "212" && this.DOC_GUBUN != "214" && this.DOC_GUBUN != "227" && this.DOC_GUBUN != "225") || this.NoticeType == "approve" ? 0 : 1
            });
        }
        returnData.push({ id: 'MessageCheck', propertyName: 'MEMO_CHK_YN', align: "center", title: ecount.resource.LBL02695, width: '55', controlType: 'widget.checkbox' }); //쪽지
        
        if (this.NoticeType != "approve" && !this.hidMgmtProc) {
            returnData.push({ id: 'RegisterCheck', propertyName: 'REGISTER_CHK_YN', align: "center", title: ecount.resource.LBL11726 + " " + ecount.resource.LBL07973, width: '80', controlType: 'widget.checkbox' }); //등록시 발송여부
            returnData.push({ id: 'ConfirmCheck', propertyName: 'CONFIRM_CHK_YN', align: "center", title: ecount.resource.LBL01042 + "/" + ecount.resource.LBL02853 + " " + ecount.resource.LBL07973, width: '110', controlType: 'widget.checkbox' }) //확인, 확인취소시
        }

        if (this.isUseSMS && !this.hidMgmtProc) {            
            returnData.splice(this.NoticeType != "approve" ? 4: 2, 0,
                { id: 'MobileCheck', propertyName: 'HPNO_CHK_YN', controlType: 'widget.checkbox', align: "center", width: '30' },
                {
                    id: 'Mobile',
                    propertyName: 'HP_NO',
                    controlType: 'widget.input',
                    title: ecount.resource.LBL35235, //모바일
                    width: width,
                    controlOption: { maxLength: 50, numberType: ecount.grid.constValue.numberType.onlyNumber }
                }
            )
        }

        return returnData;
    },
    CheckSpecialCharacterEtc: function (value, rowItem) {
        var message,
           resultFlag = false;
        var resultObject = ecount.common.ValidCheckSpecialForCodeName(value);
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
                        if (item[ecount.grid.constValue.keyColumnPropertyName] != data.rowKey && data.newValue == item.USER_ID) {
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

    //등록 이벤트핸들러, RegisterCheckBox EventHandler
    setGridDataCustomRegisterCheckBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};
        if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "214") {
            option.attrs = {
                'disabled': true
            }
        } else {
            option.attrs = {
                'disabled': false
            }
        }
        if ($.isEmpty(value)) {
            value = 'Y';
        }
        option.data = this.valueConverting(value);
        return option;
    },

    //확인 이벤트핸들러,ConfirmCheckBox EventHandler
    setGridDataCustomConfirmCheckBySfSnotiReceiverSettingGrid: function (value, rowItem) {
        var option = {};
        if (this.DOC_GUBUN != "00" && this.DOC_GUBUN != "214") {
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
                debugger;

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
                debugger;

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
                if ($.isEmpty(item.MODIFY))
                    return callback(item.TYPE, "Modify", i);
                if ($.isEmpty(item.DELETE))
                    return callback(item.TYPE, "Delete", i);
                if ($.isEmpty(item.CONFIRM))
                    return callback(item.TYPE, "Confirm", i);
                if ($.isEmpty(item.UNCONFIRM))
                    return callback(item.TYPE, "UnConfirm", i);

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
                if (item.REGISTER_CHK_YN)
                    return callback("REGISTER_CHK_YN", i);
                if (item.CONFIRM_CHK_YN)
                    return callback("CONFIRM_CHK_YN", i);
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

    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },


    ON_KEY_ENTER: function (e, target) {
        // set default enter keypess(xử lý load mặt định khi nhấn enter tại nút thiết lập mặt định)
        debugger;
        if (target != null) {
            if (target.cid == 'defaultSetting') {
                this.onContentsDefaultSetting();
            }
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
    }





    /**************************************************************************************************** 
    // 공통 Function, Common Function - End
    ****************************************************************************************************/
});