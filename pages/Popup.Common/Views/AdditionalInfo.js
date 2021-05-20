window.__define_resource && __define_resource("LBL13071","BTN00069","BTN00033","BTN00008","MSG00141","MSG07865","LBL02451","LBL02452","LBL02453","LBL02460","LBL02472","LBL02476","LBL02477","MSG04553","LBL02481");
/****************************************************************************************************
1. Create Date : 2018.06.29
2. Creator     : 최용환(Choi Yong-hwan)
3. Description : 추가정보 입력 (Additional Info)
4. Precaution  :
5. History     : 2020.03.30 (HoangLinh) - Add logic check validate for widget.date at function saveValidate
6. Old File    :
****************************************************************************************************/
ecount.page.factory("ecount.page.input", "AdditionalInfo", {
    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    pageID: "AdditionalInfo",

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this.pageOption = {
            errorMessage: {
                control: new Array()
            },
            errors: null
        }

        this._super.init.apply(this, arguments);
        this.registerDependencies("ecount.errorMessage");
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    onInitControl: function (cid, control) {
        var g = widget.generator,
            ctrl = g.control();
    },

    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL13071)
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form = generator.form(),
            tabContents = generator.tabContents(),
            controls = [];

        // 추가항목
        if (this.IsShowAdditionalInfo) {
            contents.add(this.getAdditionalInfoLayout());
        }
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id.toUpperCase()) {
            case "ITEM1":
                parameter.TYPE_CD = 1;
                break;
            case "ITEM2":
                parameter.TYPE_CD = 2;
                break;
            case "ITEM3":
                parameter.TYPE_CD = 3;
                break;
            default:
                break;
        }

        handler(parameter);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onGridRenderComplete: function (e, data, grid) {
        ecount.page.input.account.prototype.onGridRenderComplete.apply(this, arguments);
    },

    onLoadComplete: function (e) {
        if (this.IsValidationError)
            this.processSave();
        else
            this.setFirstFocus();
    },

    onPopupHandler: function (control, parameter, handler) {
        switch (control.id.toUpperCase()) {
            case "ITEM1":
                parameter.searchCodeType = 1;
                break;
            case "ITEM2":
                parameter.searchCodeType = 2;
                break;
            case "ITEM3":
                parameter.searchCodeType = 3;
                break;
            default:
                break;
        }

        handler(parameter);
    },

    onMessageHandler: function (event, data) {
        switch (event.controlID) {
            case "item1":
                this.AdditionalInfo.ITEM1 = data.data.SER_NO;
                break;
            case "item2":
                this.AdditionalInfo.ITEM2 = data.data.SER_NO;
                break;
            case "item3":
                this.AdditionalInfo.ITEM3 = data.data.SER_NO;
                break;
            default:
                break;
        }
    },

    //last focus (폼 마지막에서 엔터)
    onFocusOutHandler: function (event) {
        if (event.target == "contents") {
            if (this.isInclude) {
                if (this._ecParent.contents.currentTabId == this.ActiveTab)
                    this._ecParent.footer.getControl('apply').setFocus(0);
            }
            else
                this.footer.getControl('apply').setFocus(0);
        }
    },

	/********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //Enter Click
    ON_KEY_ENTER: function (event, control) {
        if (!$.isEmpty(control)) {
            if (control.cid == "apply") {
                this.onFooterApply();
            } else {
                return;
            }
        }
    },

    /************************f********************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    // 삭제 버튼 클릭 
    onFooterDelete: function () {
        var self = this,
            message = this.getSendMessageDto();

        if ((this.Permission == "U" && (this.EditFlag == "M" && this.GbType.equals("Y"))) || this.Permission == "R") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
               
        ecount.confirm(ecount.resource.MSG07865, function (status) {
            if (status) {
                self.sendMessage(self, message);
            }
        });
        
    },

    // 적용 버튼 클릭
    onFooterApply: function () {
        this.pageOption.errorMessage.control = new Array();

        if ((this.Permission == "U" && (this.EditFlag == "M" && this.GbType.equals("Y"))) || this.Permission == "R") {
            ecount.alert(ecount.resource.MSG00141);
            this.footer.getControl("apply").setAllowClick();
            return false;
        }

        this.processSave();
    },
   
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // KEY_F8
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    /********************************************************************** 
    * general function 
    **********************************************************************/

    // 첫포커스 셋팅
    setFirstFocus: function () {
        switch (this.ActiveTab) {
            case "additionalInfo":
                this.contents.getControl(this.FirstAddInfo).setFocus(0);
                break;
            default:
                break;
        }
    },

    // Gets the formatted date value(날짜 값 가져오기)
    getControlDate: function (target, format, tabId) {
        var result = "",
            dateCtrl = this.contents.getControl(target, tabId);

        result = String.format("{0}-{1}-{2}", dateCtrl.getDate().first().format("yyyy"), dateCtrl.getDate().first().format("MM"), dateCtrl.getDate().first().format("dd")).toDate();

        if (!$.isEmpty(format))
            return result.format(format);

        return result;
    },

    // 추가항목 레이아웃
    getAdditionalInfoLayout: function () {
        var generator = widget.generator,
            ctrl = generator.control(),
            form = generator.form(),
            toDay = this.viewBag.LocalTime.left(10).toDate(),
            controls = [];

        form.useInputForm();

        var _self = this;
        var title, itemCd, itemDes;

        $.each(_self.DefaultAdditionalInfo, function (i, item) {
            if ([1, 2, 3].contains(item.ITEM_SEQ)) {    //코드형
                title = !$.isEmpty(item.TITLE) ? item.TITLE : item.ITEM_SEQ == 0 ? ecount.resource.LBL02451 : item.ITEM_SEQ == 1 ? ecount.resource.LBL02452 : ecount.resource.LBL02453;
                itemCd = !$.isEmpty(_self.AdditionalInfo[String.format("ITEM{0}_CD", item.ITEM_SEQ.toString())]) ? _self.AdditionalInfo[String.format("ITEM{0}_CD", item.ITEM_SEQ.toString())] : "";
                itemDes = !$.isEmpty(_self.AdditionalInfo[String.format("ITEM{0}_DES", item.ITEM_SEQ.toString())]) ? _self.AdditionalInfo[String.format("ITEM{0}_DES", item.ITEM_SEQ.toString())] : "";

                controls.push(ctrl.define("widget.code.addfield", String.format("item{0}", item.ITEM_SEQ.toString()), String.format("item{0}", item.ITEM_SEQ.toString()), title)
                    .setOptions({ TYPE_CD: item.ITEM_SEQ })
                    .addCode({ value: itemCd, label: itemDes })
                    .end());
            }
            else if ([4, 5].contains(item.ITEM_SEQ)) {  //문자형
                title = !$.isEmpty(item.TITLE) ? item.TITLE : item.ITEM_SEQ == 4 ? ecount.resource.LBL02460 : ecount.resource.LBL02472;

                controls.push(ctrl.define("widget.input.general", String.format("item{0}", item.ITEM_SEQ.toString()), String.format("item{0}", item.ITEM_SEQ.toString()), title)
                    .value(!$.isEmpty(_self.AdditionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())]) ? _self.AdditionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] : "")
                    .maxLength(100)
                    .end());
            }
            else if ([6, 7].contains(item.ITEM_SEQ)) {  //숫자형                
                title = !$.isEmpty(item.TITLE) ? item.TITLE : item.ITEM_SEQ == 6 ? ecount.resource.LBL02476 : ecount.resource.LBL02477;

                var unit_delimiter, point_delimiter, obj;

                obj = _self.AdditionalInfoSetting.where(function (x) {
                    return x.ITEM_SEQ == item.ITEM_SEQ;
                });

                unit_delimiter = ecmodule.account.common.getDelimiter(obj[0].UNIT_DELIMITER);
                point_delimiter = ecmodule.account.common.getDelimiter(obj[0].POINT_DELIMITER);
           
                controls.push(ctrl.define("widget.input", String.format("item{0}", item.ITEM_SEQ.toString()), String.format("item{0}", item.ITEM_SEQ.toString()), title)
                    .value(!$.isEmpty(_self.AdditionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())]) ? _self.AdditionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] : "")
                    .numericOnly(18, obj[0].POINTDIGIT, ecount.resource.MSG04553)
                    .showZeroInPoint(obj[0].POINTZERO_VIEW_YN.equals("Y") ? true : false)                    
                    .setNumericOnlySeparator(unit_delimiter, point_delimiter)
                    .end());
            }
            else {  //일자형
                var dateValue = "";

                if (!$.isEmpty(_self.AdditionalInfo.ITEM8) && _self.AdditionalInfo.ITEM8.length == 8) {
                    dateValue = String.format("{0}-{1}-{2}", _self.AdditionalInfo.ITEM8.left(4), _self.AdditionalInfo.ITEM8.substring(4, 6), _self.AdditionalInfo.ITEM8.substring(6)).toDate().format("yyyy-MM-dd");
                }

                title = !$.isEmpty(item.TITLE) ? item.TITLE : ecount.resource.LBL02481;

                controls.push(ctrl.define("widget.date", "item8", "item8", title)
                    .setOptions({ from: _self.viewBag.ProgramInfo.AC_LIMIT_DATE.left(10).toDate().format("yyyy-01-01"), to: toDay.addYears(1).format("yyyy-12-31") })
                    .select(dateValue)
                    .useDateSpace()
                    .end());
            }
        });

        return form.addControls(controls);
    },

    //현재탭의 그리드 가져오기
    getActiveGrid: function () {
        return this.contents.getGrid(this.ActiveTab + "Grid", this.ActiveTab).grid;
    },

    // 저장용 DTO 생성
    getSendMessageDto: function () {
        var message = {
            dataExists: false,
            additionalInfo: {
                ITEM1: null,
                ITEM1_CD: null,
                ITEM1_DES: null,
                ITEM2: null,
                ITEM2_CD: null,
                ITEM2_DES: null,
                ITEM3: null,
                ITEM3_CD: null,
                ITEM3_DES: null,
                ITEM4: null,
                ITEM5: null,
                ITEM6: null,
                ITEM7: null,
                ITEM8: null
            },
            callback: this.close.bind(this)
        };

        return message;
    },

    //저장
    processSave: function () {
        this.saveValidate();
        if (this.pageOption.errors.hasError()) {
            this.pageOption.errors.show();
            this.footer.getControl("apply").setAllowClick();
            return false;
        }
        else {
            
            var message = this.getSendMessageDto();
            message = this.getAddInfoDto(message);
            this.sendMessage(message, this);
        }
    },

    // 저장시 유효성 체크
    saveValidate: function (option) {
        this.pageOption.errors = new ecount.errorMessage({
            contents: this.contents,
            errorShowPredicate: option ? option.errorShowPredicate : null
        });

        var item;

        for (var j = 0; j < this.DefaultAdditionalInfo.length; j++) {
            item = this.DefaultAdditionalInfo[j];
            ctrlObj = this.contents.getControl(String.format("item{0}", item.ITEM_SEQ.toString()), "additionalInfo");

            if (!$.isEmpty(item.MUST_YN) && item.MUST_YN.equals("Y")) {
                if (ctrlObj.controlType === "widget.date") {
                    if ($.isEmpty(ctrlObj.getDate()[0])) {
                        this.pageOption.errors.addWidget({
                            id: String.format("item{0}", item.ITEM_SEQ.toString()),
                            tab: "additionalInfo",
                            message: ""
                        });
                    }
                } else {
                    if ($.isEmpty(ctrlObj.getValue())) {
                        this.pageOption.errors.addWidget({
                            id: String.format("item{0}", item.ITEM_SEQ.toString()),
                            tab: "additionalInfo",
                            message: ""
                        });
                    }
                }
            }
        }
    },

    // 저장을 위한 데이터 셋팅
    getSaveData: function (option) {
        var formData = {
            EditFlag: "I",
            SlipDetail: ""
        };

        var message = this.getSendMessageDto();

        formData.SlipDetail = this.getAddInfoDto(message).additionalInfo;
        return formData;
    },

    // 추가항목 DTO
    getAddInfoDto: function (message) {
        var ctrlObj = null,
            item;
        message.dataExists = true;
        for (var j = 0; j < this.DefaultAdditionalInfo.length; j++) {
            item = this.DefaultAdditionalInfo[j];
            ctrlObj = this.contents.getControl(String.format("item{0}", item.ITEM_SEQ.toString()), "additionalInfo");

            if ([1, 2, 3].contains(item.ITEM_SEQ)) {
                message.additionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] = ctrlObj.getSelectedItem()[0].value ? this.AdditionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] : "";
                message.additionalInfo[String.format("ITEM{0}_CD", item.ITEM_SEQ.toString())] = ctrlObj.getSelectedItem()[0].value;
                message.additionalInfo[String.format("ITEM{0}_DES", item.ITEM_SEQ.toString())] = ctrlObj.getSelectedItem()[0].label;
            }
            else if (item.ITEM_SEQ == 8) {
                message.additionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] = !$.isEmpty(ctrlObj.getDate().first()) ? this.getControlDate("item8", "yyyyMMdd", "additionalInfo") : "";
            }
            else {
                message.additionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] = ctrlObj.getValue();
            }
        }
        return message;
    },

});
