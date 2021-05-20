window.__define_resource && __define_resource("LBL13071","LBL13047","LBL00478","LBL01310","MSG00895","BTN00339","LBL01083","BTN00168","LBL13048","BTN00069","BTN00033","BTN00008","MSG07865","MSG00150","MSG00141","MSG00076","LBL03764","MSG00894","LBL02451","LBL02452","LBL02453","LBL02460","LBL02472","LBL02476","LBL02477","MSG04553","LBL02481");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 관리 번호 등록
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
			     2018.01.15(양미진) - 추가정보 컬럼 있고 추가항목탭 있을 경우 포커스 이동시 추가정보 팝업창 자동으로 나타나도록 추가
                 2020.01.07 (On Minh Thien) - A19_04630 - ecmodule 경로 변경 후속처리 요청
                 2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                 2020.02.19 (이은총) A19_04061 위젯 옵션 삭제에 따른 페이지 수정 요청
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM011P_01", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    etcdate: "",
    tabChanged: null,
    tabData: null,
    codeTypeData: null,
    activeTab: null,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this.pageOption = {
            errors: null
        }

        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecount.errorMessage");
        this.registerDependencies("ecmodule.account.common");
    },

    initProperties: function () {
        tabChanged = false;
        tabData = [];
        codeTypeData = {
            item1: null,
            item2: null,
            item3: null
        };
        activeTab = "";
        this.setAutoFocusOnTabPane = false;
    },

    render: function () {
            this._super.render.apply(this);
        
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
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
            controls = []

        this.toDay = this.viewBag.LocalTime.left(10).toDate();  //현재날짜(current date)    
        var endYear = this.toDay.addYears(+1).getFullYear();
        var startYear = ecount.company.SETTING_DATE.substr(0, 4);  // 설립일 (Foundation Date)

        var thisRoot = this;

        // 추가항목
        if (this.IsShowAdditionalInfo) {
            tabContents
                .createActiveTab("addInfo", this.DefaultAdditionalInfo[0].ITEM_TYPE_NM) //추가항목
                    .add(this.getAdditionalInfoLayout());

            tabData.push("addInfo");
            activeTab = "addInfo";
        }

        if (this.IsShowSubCode) {
            form.useInputForm();

            if (this.viewBag.DefaultOption.CrDr == this.viewBag.InitDatas.GyeCodeInfo.CR_DR) {

                var ecDateTime = this.EtcDate;

                if ($.isEmpty(ecDateTime)) {
                    ecDateTime = this.viewBag.InitDatas.CalcDate;
                }

                if ($.isEmpty(ecDateTime)) {
                    ecDateTime = this.toDay.format("yyyy-MM-dd");
                }

                if (ecDateTime.length == 8) {
                    ecDateTime = ecDateTime.substring(0, 4) + "-" + ecDateTime.substring(4, 6) + "-" + ecDateTime.substring(6, 8);
                }

                $.isEmpty(activeTab) ? tabContents.createActiveTab("createSubCode", ecount.resource.LBL13047) : tabContents.createTab("createSubCode", ecount.resource.LBL13047);

                controls.push(ctrl.define("widget.label", "gyedes", "gyedes", ecount.resource.LBL00478).label(this.viewBag.InitDatas.GyeCodeInfo.GYE_DES).end());
                controls.push(ctrl.define("widget.input.general", "imgBill", "imgBill", ecount.resource.LBL01310).value(this.SubCode).popover(ecount.resource.MSG00895)
                                    .hasFn([{ id: "NumCreate", label: ecount.resource.BTN00339 }]).end());

                controls.push(ctrl.define("widget.date", "ECDateTime", "ECDateTime", ecount.resource.LBL01083)
                                    .hasFn([{ id: "setting", label: ecount.resource.BTN00168 }])
                                    .select(ecDateTime).end());

                tabContents.add(form.addControls(controls));

                tabData.push("createSubCode");

                if ($.isEmpty(activeTab))
                    activeTab = "createSubCode";
            }
            else {
                $.isEmpty(activeTab) ? tabContents.createActiveTab("selectSubCode", ecount.resource.LBL13048) : tabContents.createTab("selectSubCode", ecount.resource.LBL13048);

                controls.push(ctrl.define("widget.label", "gyedes", "gyedes", ecount.resource.LBL00478).label(this.viewBag.InitDatas.GyeCodeInfo.GYE_DES).end());
                controls.push(ctrl.define("widget.multiCode.billSearch", "imgBillSearch", "imgBillSearch", ecount.resource.LBL01310).end());

                tabContents.add(form.addControls(controls));

                tabData.push("selectSubCode");

                if ($.isEmpty(activeTab))
                    activeTab = "selectSubCode";
            }
        }

        contents.add(tabContents);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        if (cid == "imgBillSearch") {
            if (!$.isNull(this.SubCode) && !$.isEmpty(this.SubCode)) {
                control.addCode({ label: this.SubCode, value: this.SubCode });
            }   
        }
    },
    
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id.toUpperCase()) {
            case "IMGBILLSEARCH":
                parameter.GYE_CODE = this.GyeCode;
                parameter.CUST = this.Cust || "";
                parameter.TRX_DATE = this.TrxDate || "";
                break;
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
    onLoadComplete: function (e) {
        if (this.IsValidationError)
            this.onFooterApply();
        else {
            switch (activeTab) {
                case "addInfo":
                    this.contents.getControl(this.FirstAddInfo).setFocus(0);
                    break;
                case "createSubCode":
                    this.contents.getControl("imgBill").setFocus(0);
                    break;
                case "selectSubCode":
                    this.contents.getControl("imgBillSearch").setFocus(0);
                    break;
                default:
                    break;
            }
        }
    },

    onPopupHandler: function (control, parameter, handler) {
        switch (control.id.toUpperCase()) {
            case "IMGBILLSEARCH":
                parameter.GYE_CODE = this.GyeCode;
                parameter.CUST = this.Cust || "";
                parameter.TRX_DATE = this.TrxDate || "";
                break;
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
        if (["item1", "item2", "item3"].contains(event.controlID)) {
            codeTypeData[event.controlID] = data.data.SER_NO;
        }
        else {
            if (event.pageID == "CM012P_01") {
                this.etcdate = data.data.ETC_DATE1
            }
        }

    },
    
    onChangeControl: function (e) {
        if (event) {
            switch (event.cid) {
                case "item1":
                case "item2":
                case "item3":
                    if (event.action == "removeCode") {
                        codeTypeData[event.cid] = null;
                    }
                    break;
                default:
                    break;
            }
        }
    },

	//last focus (폼 마지막에서 엔터)
    onFocusOutHandler: function (event) {
    	if (event.target == "contents") {
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
	//F8
    ON_KEY_F8: function () {
    	this.onFooterApply();
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    // 삭제 버튼 클릭 
    onFooterDelete: function () {
        var self = this;

        var message = {
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

            data: {
                BILL_NO: '',
                EXPIRY_DATE: ''
            },
            isAdded: true,
            addPosition: "current",
            callback: self.close.bind(self)
        };

        if (tabData.length > 1) {
            ecount.confirm(ecount.resource.MSG07865, function (status) {
                if (status) {
                    self.sendMessage(self, message);
                }
            });
        }
        else {
            self.sendMessage(self, message);
        }
    },

    // 적용 버튼 클릭
    onFooterApply: function () {
        var ctrlObj = null;

        var message = {
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

            data: {
                BILL_NO: "",
                EXPIRY_DATE: ""
            },
            isAdded: true,
            addPosition: "current",
            callback: this.close.bind(this)
        };

        this.pageOption.errors = new ecount.errorMessage({
            contents: this.contents
        });

        for (var i = 0; i < tabData.length; i++) {
            switch (tabData[i]) {
                case "addInfo":
                    var item;
                    message.dataExists = true;

                    for (var j = 0; j < this.DefaultAdditionalInfo.length; j++) {
                        item = this.DefaultAdditionalInfo[j];
                        ctrlObj = this.contents.getControl(String.format("item{0}", item.ITEM_SEQ.toString()), "addInfo");

                        if ([1, 2, 3].contains(item.ITEM_SEQ)) {
                            message.additionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] = codeTypeData[String.format("item{0}", item.ITEM_SEQ.toString())];
                            message.additionalInfo[String.format("ITEM{0}_CD", item.ITEM_SEQ.toString())] = ctrlObj.getSelectedItem()[0].value;
                            message.additionalInfo[String.format("ITEM{0}_DES", item.ITEM_SEQ.toString())] = ctrlObj.getSelectedItem()[0].label;
                        }
                        else if (item.ITEM_SEQ == 8) {
                            message.additionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] = !$.isEmpty(ctrlObj.getDate().first()) ? this.getControlDate("item8", "yyyyMMdd", "addInfo") : "";
                        }
                        else {
                            message.additionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())] = ctrlObj.getValue();
                        }

                        if (!$.isEmpty(item.MUST_YN) && item.MUST_YN.equals("Y")) {
                            if ($.isEmpty(ctrlObj.getValue())) {
                                this.pageOption.errors.addWidget({
                                    id: String.format("item{0}", item.ITEM_SEQ.toString()),
                                    tab: "addInfo",
                                    message: ""
                                });
                            }
                        }
                    }

                    break;
                case "createSubCode":
                    message.data.BILL_NO = this.contents.getControl("imgBill", "createSubCode").getValue();
                    message.data.EXPIRY_DATE = this.getControlDate("ECDateTime", "yyyyMMdd", "createSubCode");

                    if ($.isEmpty(this.contents.getControl("imgBill", "createSubCode").getValue())) {
                        this.pageOption.errors.addWidget({
                            id: "imgBill",
                            tab: "createSubCode",
                            message: ecount.resource.MSG00150
                        });
                    }

                    break;
                case "selectSubCode":
                    if (this.contents.getControl("imgBillSearch", "selectSubCode").getSelectedItem().length > 0) {
                        message.data.BILL_NO = this.contents.getControl("imgBillSearch", "selectSubCode").getSelectedItem()[0].value;
                        message.data.EXPIRY_DATE = this.etcdate;
                    }
                    break;
                default:
                    break;
            }
        }
        
        if (this.pageOption.errors.hasError()) {
            this.pageOption.errors.show();
            return false;
        }
        else {
            this.sendMessage(this, message);
        }
    },

    //설정 버튼 클릭
    onFunctionSetting: function () {
        //onFunctionChColldate: function(){

        if (ecount.config.limited.menu.USE_CASH_FLOW == false) {
            ecount.alert(ecount.resource.MSG00141);
            return
        }

        if ($.isEmpty(this.Cust)) {
            ecount.alert(ecount.resource.MSG00076);
            return;
        }

        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 280,
            //parentPageID: this.pageID,
            //responseID: this.callbackID, //필수값
            TrxType: '1',                   
            CustCode: this.Cust,                   
            IsCustNameDisplay: true

        };
        this.openWindow({
            url: '/ECERP/Popup.Common/CM009P_02',
            name: ecount.resource.LBL03764,
            param: params,
            popupType: false,
            additional: true
        });
    },

    // 번호 생성 버튼
    onFunctionNumCreate: function () {

        var strRNum;
        var value = this.contents.getControl("imgBill", "createSubCode").getValue();
        if ($.isEmpty(value) == false) {
            ecount.alert(ecount.resource.MSG00894, function () {
                this.contents.getControl("imgBill", "createSubCode").setFocus(0);
            }.bind(this));
            return;
        }

        data = {};
        ecount.common.api({
            url: "/Account/Common/GetDateTimeNow",
            data: Object.toJSON(data),
            success: function (result) {

                strRNum = result.Data.substring(2, 4)
                         + result.Data.substring(5, 7)
                         + result.Data.substring(8, 10)
                         + result.Data.substring(11, 13)
                         + result.Data.substring(14, 16)
                         + result.Data.substring(17, 19)
                         + result.Data.substring(20, 23);
                this.contents.getControl("imgBill", "createSubCode").setValue(strRNum);
            }.bind(this)
        });

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

                codeTypeData[String.format("item{0}", item.ITEM_SEQ.toString())] = _self.AdditionalInfo[String.format("ITEM{0}", item.ITEM_SEQ.toString())];
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
                    .showValueZero(obj[0].ZERO_VIEW_YN.equals("Y") ? true : false)
                    .setNumericOnlySeparator(unit_delimiter, point_delimiter)
                    .end());
            }
            else {  //일자형
                var dateValue = "";

                if (!$.isEmpty(_self.AdditionalInfo.ITEM8) && _self.AdditionalInfo.ITEM8.length == 8) {
                    dateValue = String.format("{0}-{1}-{2}", _self.AdditionalInfo.ITEM8.left(4), _self.AdditionalInfo.ITEM8.substring(4, 6), _self.AdditionalInfo.ITEM8.substring(6)).toDate().format("yyyy-MM-dd");
                }

                title = !$.isEmpty(item.TITLE) ? item.TITLE : ecount.resource.LBL02481

                controls.push(ctrl.define("widget.date", "item8", "item8", title)
                    .setOptions({ from: _self.viewBag.ProgramInfo.AC_LIMIT_DATE.left(10).toDate().format("yyyy-01-01"), to: toDay.addYears(1).format("yyyy-12-31") })
                    .select(dateValue)
                    .useDateSpace()
                    .end());
            }
        });

        return form.addControls(controls);
    },

    // Gets the formatted date value(날짜 값 가져오기)
    getControlDate: function (target, format, tabId) {
        var result = "",
            dateCtrl = this.contents.getControl(target, tabId);

        result = String.format("{0}-{1}-{2}", dateCtrl.getDate().first().format("yyyy"), dateCtrl.getDate().first().format("MM"), dateCtrl.getDate().first().format("dd")).toDate();

        if (!$.isEmpty(format))
            return result.format(format);

        return result;
    }
});
