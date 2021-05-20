window.__define_resource && __define_resource("LBL01593","BTN00069","BTN00008","MSG06577","LBL10933","LBL00500","MSG07361","LBL01046","LBL14280","LBL01280","LBL07994","LBL13626","LBL05875","LBL09211","LBL04090","LBL10109","LBL10579","LBL00832","LBL70558","LBL11071","LBL35130","LBL01688","LBL00961","LBL00962","LBL00963","LBL08035","LBL08036","LBL08037","LBL08038","LBL08039","LBL08040","LBL08041");
/***********************************************************************************
 1. Create Date : 2016.03.03
 2. Creator     : inho
 3. Description : self-customizing > form setting 
 4. Precaution  :
 5. History     : 2016.05.27 add only top formtype
                  2019.01.07 NgọcHân A18_04272_FE 리팩토링_페이지 일괄작업1 remove $el at onChangeControl
                  2019.02.21 (PhiVo) A19_00558-FE 리팩토링_페이지 일괄작업 8차 apply getSelectedItem() method
                  2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.01.22 (Kim Woojeong) - [A18_03793] 급여 신규프레임웍 적용 - 급여관리II
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
 6. Old File    : CM100P_06.aspx,CM100P_15.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_42", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    cofmTemp: null,

    formInfo: null,

    colCd: null,

    isTop: false,

    decimalHash: null,

    commonForm: null,

    formInfoAll: null,
    useDrCr1: null,
    useDrCr2: null,

    //기본 : 필수항목, 설정값만(default,setting)
    defaultTypeOnly: null,

    zipCodeId: null,

    linkOptionLst: null,

    isLinkOptionSave: false,


    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        debugger;
        this._super.init.apply(this, arguments);
        this.registerDependencies("ecmodule.common.formHelper");
        this.registerDependencies("ecmodule.common.formMulti");
    },

    render: function ($parent) {
        var parent = ecount.page.popup.prototype.getParentInstance.apply(this, arguments);
        this.defaultTypeOnly = parent.defaultTypeOnly;
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    onInitHeader: function (header) {
        var message = {
            type: "getforminfo",
            formIndex: this.formIndex,
            colCd: this.COL_CD,
            callback: function (data) {
                this.formInfo = data;
                this.linkOptionLst = data.FormOtherDatas.LINK_OPTION;
            }.bind(this)
        };
        this.sendMessage(this, message);
        var allMessage = {
            type: "getforminfo",
            formIndex: this.formIndex,
            colCd: "",
            callback: function (data) {
                this.formInfoAll = data;
                this.linkOptionLst = data.FormOtherDatas.LINK_OPTION;
            }.bind(this)
        };
        this.sendMessage(this, allMessage);
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL01593);//this.formInfo.FormOutSetDetail.HEAD_TITLE_NM || "");
        if (this.linkOptionLst) {
            this.isLinkOptionSave = true;
        }
        this.getDecimalHashData(this.COL_CD);
    },

    getDecimalHashData: function (colCd) {
        this.decimalHash = new $.HashMap();
        this.decimalHash.set("00", this.getZeroCheckYnTitle(colCd));
        this.decimalHash.set("0", "<span class='text-bold'>0</span>");
        this.decimalHash.set("1", "0.<span class='text-bold'>0</span>");
        this.decimalHash.set("2", "0.1<span class='text-bold'>0</span>");
        this.decimalHash.set("3", "0.12<span class='text-bold'>0</span>");
        this.decimalHash.set("4", "0.123<span class='text-bold'>0</span>");
        this.decimalHash.set("5", "0.1234<span class='text-bold'>0</span>");
        this.decimalHash.set("6", "0.12345<span class='text-bold'>0</span>");
        this.decimalHash.set("7", "0.123456<span class='text-bold'>0</span>");
        this.decimalHash.set("8", "0.1234567<span class='text-bold'>0</span>");
        this.decimalHash.set("9", "0.12345678<span class='text-bold'>0</span>");
        this.decimalHash.set("10", "0.123456789<span class='text-bold'>0</span>");
    },

    getZeroCheckYnTitle: function (colCd) {
        var thisObj = this;
        var decimalPoint = 1;
        var result = "";
        if (colCd != null && thisObj.formInfo.FormColumns.find(function (column) { return column.COL_CD == colCd }) != undefined) {
            switch (thisObj.formInfo.FormColumns.find(function (column) { return column.COL_CD == colCd }).DECIMAL_TYPE || "X") {
                case "Q":
                    decimalPoint = ecount.config.inventory.DEC_Q;
                    break;
                case "U":
                    decimalPoint = ecount.config.inventory.ETC_DEC_UQ;
                    break;
                case "P":
                    decimalPoint = ecount.config.inventory.DEC_P;
                    break;
                case "PV":
                    decimalPoint = ecount.config.inventory.DEF_PRICE_VAT_DECIMAL_PLACE;
                    break;
                case "R":
                    decimalPoint = ecount.config.inventory.DEC_RATE;
                    break;
                case "D":
                    decimalPoint = ecount.config.inventory.DEC_DEFAULT;
                    break;
                case "A":
                    decimalPoint = ecount.config.company.DEC_AMT;
                    break;
                default:
                    decimalPoint = 0;
            }
        }

        switch (decimalPoint) {
            case 0:
                result = "<span class='text-bold'>0</span>";
                break;
            case 1:
                result = "0.<span class='text-bold'>0</span>"
                break;
            case 2:
                result = "0.1<span class='text-bold'>0</span>"
                break;
            case 3:
                result = "0.12<span class='text-bold'>0</span>"
                break;
            case 4:
                result = "0.123<span class='text-bold'>0</span>"
                break;
            case 5:
                result = "0.1234<span class='text-bold'>0</span>"
                break;
            case 6:
                result = "0.12345<span class='text-bold'>0</span>"
                break;
            case 7:
                result = "0.123456<span class='text-bold'>0</span>"
                break;
            case 8:
                result = "0.1234567<span class='text-bold'>0</span>"
                break;
            case 9:
                result = "0.12345678<span class='text-bold'>0</span>"
                break;
            case 10:
                result = "0.123456789<span class='text-bold'>0</span>"
                break;
        }

        return result;
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            batchSetup = g.batchSetup(),
            form = widget.generator.form(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        var thisObj = this;
        form.template("register")
            .useBaseForm({ _isThShow: true, _isRowInCount: 1 })
            .colgroup([{ width: "150" }, { width: "" }]);

        //is top 상단인지
        this.isTop = (thisObj.formInfo.FormSet.VIEW_TYPE == "U") ? true : false;
        if (['PI050' ,'PI060'].contains(this.FORM_TYPE)) {
            this.isTop = true;
        }

        this.commonForm = new ecount.common.formMulti();
        this.commonForm.setWidgetMap(thisObj);

        thisObj.formInfo.columns.forEach(function (reColumn, i) {
            var detail = thisObj.formInfo.FormOutSetDetails.find(function (item) { return item.COL_CD == reColumn.id });
            // if new formula data is null, make new formula data by old formula data
            // 신규 계산식용 데이터 없는 경우 기존 계산식 데이터로 신규 계산식용 데이터를 생성한다.
            // 마이그레이션 완료되면 걷어낼 코드임.
            var replacedCalcVal = {};
            if (detail.DEFAULT_CALC_IN_VAL && !detail.DEFAULT_CALC_IN_VAL_GUBUN) {
                var replacedCalcVal = thisObj.setCalcDataForFormulaFromDefaultCalcVal(detail.DEFAULT_CALC_IN_VAL);
                detail.DEFAULT_CALC_IN_VAL_GUBUN = replacedCalcVal.DEFAULT_CALC_VAL_GUBUN;
                detail.DEFAULT_CALC_IN_VAL_SQL = replacedCalcVal.DEFAULT_CALC_VAL_SQL;
            }
            if (detail.DEFAULT_CALC_OUT_VAL && !detail.DEFAULT_CALC_OUT_VAL_GUBUN) {
                var replacedCalcVal = thisObj.setCalcDataForFormulaFromDefaultCalcVal(detail.DEFAULT_CALC_OUT_VAL);
                detail.DEFAULT_CALC_OUT_VAL_GUBUN = replacedCalcVal.DEFAULT_CALC_VAL_GUBUN;
                detail.DEFAULT_CALC_OUT_VAL_SQL = replacedCalcVal.DEFAULT_CALC_VAL_SQL;
            }
            if (!$.isNull(detail.HEAD_SIZE) && detail.HEAD_SIZE > 0) {
                if (thisObj.isTop) {
                    //top 상단
                    if (thisObj.isLock && reColumn.id.indexOf("u_memo") < 0 && reColumn.id.indexOf("u_txt") < 0 && !["widget.code.project", "widget.code.pic", "widget.code.wh", "widget.code.cust"].contains(reColumn.controlType.toLowerCase())) {
                        if (["SU010", "SU021", "SU400", "SU200"].contains(thisObj.FORM_TYPE) && reColumn.id == "mystorage") {
                            batchSetup.addLayer("item_" + i, "item_" + i, thisObj.formInfo.FormOutColumns.find(function (column) { return column.COL_CD == reColumn.id }).TITLE);
                            thisObj.setFormBuilder({ type: "general", contents: batchSetup, index: i });//default 기본
                        }
                        //skip 
                    } else {
                        batchSetup.addLayer("item_" + i, "item_" + i, thisObj.formInfo.FormOutColumns.find(function (column) { return column.COL_CD == reColumn.id }).TITLE);
                        thisObj.setFormBuilder({ type: "general", contents: batchSetup, index: i });//default 기본

                        thisObj.setFormBuilder({ type: "setup", contents: batchSetup, index: i });//setup 설정

                        if ((reColumn.dataType || "00").substring(0, 1) == "8" || (reColumn.dataType || "00").substring(0, 1) == "9") {
                            thisObj.setFormBuilder({ type: "displayForm", contents: batchSetup, index: i });//display form 표시형태
                        }
                    }
                } else {
                    //bottom 하단
                    batchSetup.addLayer("item_" + i, "item_" + i, thisObj.formInfo.FormOutColumns.find(function (column) { return column.COL_CD == reColumn.id }).TITLE);
                    thisObj.setFormBuilder({ type: "general", contents: batchSetup, index: i });//default 기본
                    thisObj.setFormBuilder({ type: "font", contents: batchSetup, index: i });//font 글꼴
                    thisObj.setFormBuilder({ type: "displayForm", contents: batchSetup, index: i });//display form 표시형태
                    thisObj.setFormBuilder({ type: "buttomSetup", contents: batchSetup, index: i });//buttomSetup form 표시형태
                }
            }
        });
        contents.add(batchSetup);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        //if (cid == "paymentType__0") {            
        //   // control.fixedSelect(["EC", ""]).setOptions({ nonAddonTitle: true });
        //}
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (e) {
        if (!e.unfocus) {
            if (!$.isNull(this.contents.getControl("headTitleNm__0")))
                this.contents.getControl("headTitleNm__0").setFocus(0);
            else if (!$.isNull(this.contents.getControl("customFor_ColEssentialYn__0")))
                this.contents.getControl("customFor_ColEssentialYn__0").setFocus(0);
        }

        if (this.colType == 1) {
            for (var i = 0, len = this.formInfo.columns.length; i < len; i++) {
                var ctrlKey = "isLineMrge__" + i.toString();
                var ctrl = this.contents.getControl(ctrlKey);
                if (ctrl) {
                    ctrl.setValue(false);
                    ctrl.setReadOnly(true);
                }
            }
        }

    },

    onPopupHandler: function (control, config, handler) {
        switch (control.controlType.toLowerCase()) {
            case "widget.code.pic":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    saleCheckValue: "1",
                    isNewDisplayFlag: false,
                });
                break;
            case "widget.code.user":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    Type: "A",
                    GwUse: true,
                    CANCEL: "N",
                    GW_USE: "0",
                    isPerson: true
                });
                if (["GU121"].contains(this.FORM_TYPE)) {
                    config.isPerson = false;
                }
                break;
            case "widget.code.project":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    isNewDisplayFlag: false,
                    isOthersDataFlag: "N",
                    searchCategoryFlag: "S",
                });
                break;
            case "widget.code.cust":
                $.extend(config, {        //default settings
                    width: 0,
                    height: 0,
                    additional: false,
                    //기본
                    IO_TYPE: "10",
                    popupType: false,
                    isInputLayer: true,
                    CustEmpType: "10",
                    EmpFlag: "N",
                    isNewDisplayFlag: false,
                    CallType: "102",
                    MenuType: "",
                    CustInfo: "Y",
                    TransactionType: "Y",
                });
                if (['AU490', 'AU510', 'AU850'].contains(this.FORM_TYPE)) {
                    config.IO_TYPE = "00";
                    config.Acc002_Flag = "N";
                    config.isNewDisplayFlag = true;
                    config.GyeCode = "102";
                    config.CustInfo = "Y";
                    config.FilterCustGubun = 102;
                    config.isApplyDisplayFlag = false;
                    config.isCheckBoxDisplayFlag = false;
                    config.isIncludeInactive = false;
                    config.isNewDisplayFlag = true;
                    config.unUseAutoResize = true;
                }
                break;
            case "widget.code.wh":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    isNewDisplayFlag: false,
                    searchCategoryFlag: "A",
                });
                break;

            case "widget.code.bankaccount":
                // check for form type au370
                if (this.FORM_TYPE === "AU370" && this.COL_CD === "cust") {
                    $.extend(config, {
                        CALLTYPE: "105",
                        IOTYPE: "00",
                        ACCFLAG: "Y"
                    });
                }
                if (this.FORM_TYPE === "AU410" && this.COL_CD === "cust") {
                    $.extend(config, {
                        CALLTYPE: "105",
                        IOTYPE: "00",
                        ACCFLAG: "Y",
                        GYECODE: "102"
                    });
                }
                break;
            case "widget.code.merchantaccount":
                $.extend(config, {
                    PROD_SEARCH: "9",
                    keyword: "",
                    isApplyDisplayFlag: false,
                    isIncludeInactive: false
                });
                break;
            case "widget.code.schedulelabel":
                $.extend(config, {
                    isApplyDisplayFlag: true,
                    isIncludeInactive: false,       // include inactive
                    isCheckBoxDisplayFlag: true,
                    isSaveDisplayFlag: false,
                });
                break;
            case "widget.code.scheduletype":
                $.extend(config, {
                    isApplyDisplayFlag: false,
                    isIncludeInactive: true,       // include inactive
                });

                break;
            case "widget.code.codetypedata":
                var colName = control.id.replace('col52', 'col51');
                var userTable = this.contents.getControl(colName);

                var current = userTable.getSelectedItem()[0];
                if (current == undefined || current.value == ""){
                    ecount.alert(ecount.resource.MSG06577);
                    return;
                }
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    USERTABLE_CD: current.value,
                    USERTABLE_NM: current.label,
                    CANCEL: 'N'
                });
                break;
            case "widget.code.codetype":
                $.extend(config, {
                    CANCEL: 'N'
                });
                break;
            case "widget.code.fieldapply":
                $.extend(config.Request.Data, {
                    TAX_BRACKET_DETAIL_CLASS: this.TAX_BRACKET_DETAIL_CLASS
                });
                break;
            case "widget.code.codetypetext":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    saleCheckValue: "1",
                    isNewDisplayFlag: false,
                    CODE_CLASS: this.CODE_CLASS,
                    FORM_TYPE: this.FORM_TYPE,
                    titlename: ecount.resource.LBL10933,

                });
                break;
            case "widget.code.bankaccountinout":
                if (this.FORM_TYPE === "AU752") {
                    $.extend(config, {
                        isNewDisplayFlag: true,
                        CALLTYPE: 9,
                        ACC002_FLAG: "N",
                        isInput: false,
                        GYECODE: "",
                        IOTYPE: "00",
                        ACCFLAG: "Y",
                        GUBUN: "CASE94",
                        name: ecount.resource.LBL00500
                    });
                }
                break;
            default:
                break;
        }

        handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.controlType.toLowerCase()) {
            case "widget.code.codetypedata":
                var colName = control.id.replace('col52', 'col51');
                var userTable = this.contents.getControl(colName);
                var current = userTable.getSelectedItem()[0];

                if (current == undefined || current.value == ""){
                    ecount.alert(ecount.resource.MSG06577);
                    return;
                }
                $.extend(parameter, {
                    additional: false,
                    popupType: false,
                    USERTABLE_CD: current.value,
                    USERTABLE_NM: current.label,
                    CANCEL: 'N'
                });
                break;
            case "widget.code.codetype":
                $.extend(parameter, {
                    CANCEL: 'N'
                });
                break;
            case "widget.code.fieldapply":
                $.extend(parameter.Request.Data, {
                    TAX_BRACKET_DETAIL_CLASS: this.TAX_BRACKET_DETAIL_CLASS
                });
                break;
        }

        switch (control.id.toUpperCase()) {
            case "WH_CD":
                parameter.FLAG = "3";
                parameter.DEL_FLAG = "N";
                break;
            case "EMP_CD":
                parameter.SALE_CHK2 = "1";
                break;
            case "PJT_CD":
                parameter.CHK_FLAG = "S";
                parameter.isOthersDataFlag = "N";
                break;
            case "CUST":
                if (["AU490", "AU850"].contains(this.FORM_TYPE)) {
                    parameter.isNewDisplayFlag = true;
                    parameter.GyeCode = "102";
                }
                break;
        }
        parameter.PARAM = keyword;
        handler(parameter);

    },

    onMessageHandler: function (page, message) {
        var thisObj = this;

        switch (page.pageID) {
            case "CM004P":
                var strPostNo = (message.data || message).zipcode;
                strPostNo = strPostNo.replace('-', '');
                this.contents.getControl(this.zipCodeId) && this.contents.getControl(this.zipCodeId).get(1).setValue(strPostNo);
                message.callback && message.callback();
                break;
            case "CM100P_05":
                var isBalanceType = (page && (page.IS_BALANCE_TYPE || false))
                var calcResult = this.setCalcData.call(this, message.data[0].CALC_VALUE[0],
                    message.data[0].CALC_PAGE == "DATA_INFORMATION" ? true : isBalanceType);
                var messageIndex = message.data[0].INDEX;

                if (message.data[0].UserData != "1") {
                    //Domestic 내자
                    this.contents.getControl("defaultCalcInVal__" + messageIndex).setValue(calcResult.DEFAULT_CALC_VAL);
                    this.contents.getControl("defaultCalcInOpenVal__" + messageIndex).setValue(calcResult.DEFAULT_CALC_OPEN_VAL);
                    this.contents.getControl("defaultCalcInValGubun__" + messageIndex).setValue(message.data[0].CALC_GUBUN);
                    this.contents.getControl("defaultCalcInValSql__" + messageIndex).setValue(message.data[0].CALC_DESC);
                    if (isBalanceType) {
                        //set value from Balance popup 잔액표기 넘겨 받은 값 할당.
                        this.contents.getControl("custBalanceType__" + messageIndex).setValue(message.BALANCE_TYPE);
                        if (message.BALANCE_TYPE > 0) {
                            this.contents.getControl("settingBalance__" + messageIndex).removeClass('btn-warning');
                            this.contents.getControl("settingBalance__" + messageIndex).addClass('btn-warning');
                        } else {
                            this.contents.getControl("settingBalance__" + messageIndex).removeClass('btn-warning');
                        }
                        this.contents.getControl("settingBalance__" + messageIndex).setFocus(0);
                    } else {
                        if (message.data[0].CALC_PAGE == "DATA_INFORMATION") {
                            if ($.isEmpty(calcResult.DEFAULT_CALC_VAL) && $.isEmpty(calcResult.DEFAULT_CALC_OPEN_VAL)) {
                                this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaDomestic__" + messageIndex).removeClass('btn-warning');
                            } else {
                                this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaDomestic__" + messageIndex).removeClass('btn-warning');
                                this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaDomestic__" + messageIndex).addClass('btn-warning');
                            }

                            this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaDomestic__" + messageIndex).setFocus(0);
                        } else {
                            if ($.isEmpty(calcResult.DEFAULT_CALC_VAL) && $.isEmpty(calcResult.DEFAULT_CALC_OPEN_VAL)) {
                                this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaDomestic__" + messageIndex).removeClass('btn-warning');
                            } else {
                                this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaDomestic__" + messageIndex).removeClass('btn-warning');
                                this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaDomestic__" + messageIndex).addClass('btn-warning');
                            }

                            this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaDomestic__" + messageIndex).setFocus(0);
                        }
                    }
                } else {
                    //Foreign 외자
                    this.contents.getControl("defaultCalcOutVal__" + messageIndex).setValue(calcResult.DEFAULT_CALC_VAL);
                    this.contents.getControl("defaultCalcOutOpenVal__" + messageIndex).setValue(calcResult.DEFAULT_CALC_OPEN_VAL);
                    this.contents.getControl("defaultCalcOutValGubun__" + messageIndex).setValue(message.data[0].CALC_GUBUN);
                    this.contents.getControl("defaultCalcOutValSql__" + messageIndex).setValue(message.data[0].CALC_DESC);

                    if (message.data[0].CALC_PAGE == "DATA_INFORMATION") {
                        if ($.isEmpty(calcResult.DEFAULT_CALC_VAL) && $.isEmpty(calcResult.DEFAULT_CALC_OPEN_VAL)) {
                            this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaForeign__" + messageIndex).removeClass('btn-warning');
                        } else {
                            this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaForeign__" + messageIndex).removeClass('btn-warning');
                            this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaForeign__" + messageIndex).addClass('btn-warning');
                        }

                        this.contents.getControl("setting3Formula__" + messageIndex).get("setting3FormulaForeign__" + messageIndex).setFocus(0);
                    } else {
                        if ($.isEmpty(calcResult.DEFAULT_CALC_VAL) && $.isEmpty(calcResult.DEFAULT_CALC_OPEN_VAL)) {
                            this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaForeign__" + messageIndex).removeClass('btn-warning');
                        } else {
                            this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaForeign__" + messageIndex).removeClass('btn-warning');
                            this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaForeign__" + messageIndex).addClass('btn-warning');
                        }

                        this.contents.getControl("setting2Formula__" + messageIndex).get("setting2FormulaForeign__" + messageIndex).setFocus(0);
                    }
                }

                message.callback && message.callback();
                break;
            case "CM100P_12":
                var messageIndex = message.INDEX;
                //set value from Balance popup 잔액표기 넘겨 받은 값 할당.
                this.contents.getControl("custBalanceType__" + messageIndex).setValue(message.BALANCE_TYPE);
                if (message.BALANCE_TYPE > 0) {
                    this.contents.getControl("settingBalance__" + messageIndex).removeClass('btn-warning');
                    this.contents.getControl("settingBalance__" + messageIndex).addClass('btn-warning');
                } else {
                    this.contents.getControl("settingBalance__" + messageIndex).removeClass('btn-warning');
                }
                this.contents.getControl("settingBalance__" + messageIndex).setFocus(0);
                break;
            case "CM104P":
                var messageIndex = message.INDEX;
                this.contents.getControl("defaultVal__" + messageIndex).setValue(message.data.TXT);
                break;
            case "CM100P_49":
                if (!$.isNull(message.type) && message.type == "getforminfo") {
                    message.callback && message.callback(
                        thisObj.getFormInfoByColCd({ colCd: message.colCd })
                    );
                    return;
                }
                break;
            case "EB013P":
                message.control.addCode({ label: message.data.TRADE_NAME, value: message.data.TRADE_CODE });
                break;
            case "ESC001P_402_01":
                var messageIndex = message.data.INDEX;
                var self = this.getFormInfoByColCd(message.data);
                self.FormOutSetDetail.SMS_TXT = message.data.SMS_TXT;
                self.FormOutSetDetail.EMAIL_TXT = message.data.EMAIL_TXT;
                self.FormOutSetDetail.MEMO_TXT = message.data.MEMO_TXT;

                break;
            case "EGM023P_17":
                if (!$.isNull(message.type) && message.type.toLowerCase() == "getforminfo") {
                    this.linkOptionLst = message.data ? message.data : thisObj.linkOptionLst;
                    this.isLinkOptionSave = true;
                }
                break;
        }
        message.callback && message.callback();
    },

    onFocusOutHandler: function (event) {
        //move next focus 다음 폼으로 이동
        var forms = this.contents.getForm();
        if (forms.length > 0) {
            if (event.__self == this.contents.getForm()[forms.length - 1]) {
                this.footer.getControl("apply").setFocus(0);
            } else {
                for (var i = 0; i < forms.length; i++) {
                    if (event.__self == this.contents.getForm()[i] && (forms.length - 1) > i) {
                        this.contents.getForm()[i + 1].getControlByIndex(0).setFocus(0);
                        break;
                    }
                }
            }
        }
    },

    onFocusOutControlHandler: function (control) {
    },

    onChangeControl: function (control, data) {
        var thisObj = this;
        //if you use widget within custom widget,you can't get it directly, so, we use control.__self 
        //커스텀안에 위젯이벤트일때 직접 접근이 안되기 때문에 control.__self로 인스턴스를 직접 받음(휘영책임 확인 2016.01.08)
        var selfControl = control.__self;
        var selfId;
        var selfIndex;
        var aryKey = selfControl.id.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        switch (selfId) {
            case "col51":
                var colName = control.cid.replace('col51', 'col52');
                var defaultVal = this.contents.getControl(colName);
                defaultVal.setEmpty();
                break;
            case "defaultSeparator":
                var defaultSeparator = thisObj.contents.getControl("defaultSeparator__" + selfIndex).getValue();
                var thisThousandSeparatorCtl = thisObj.contents.getControl("thousandSeparator__" + selfIndex);
                var thisDecimalSeparatorCtl = thisObj.contents.getControl("decimalSeparator__" + selfIndex);

                if (defaultSeparator == "true") {
                    this.contents.hideRow("thousandSeparator__" + selfIndex);
                    this.contents.hideRow("decimalSeparator__" + selfIndex);
                } else {
                    this.contents.showRow("thousandSeparator__" + selfIndex);
                    this.contents.showRow("decimalSeparator__" + selfIndex);
                }
                break;
            case "thousandSeparator":
            case "decimalSeparator":
                var thisThousandSeparatorCtl = thisObj.contents.getControl("thousandSeparator__" + selfIndex);
                var thisDecimalSeparatorCtl = thisObj.contents.getControl("decimalSeparator__" + selfIndex);

                var thousandSeparator = thisThousandSeparatorCtl.getValue();
                var decimalSeparator = thisDecimalSeparatorCtl.getValue();

                if (thousandSeparator == decimalSeparator) {
                    //ecount.alert("천단위 구분기호와 소수점 구분기호는 중복될 수 없습니다.");
                    ecount.alert(ecount.resource.MSG07361);
                    if (selfId == "thousandSeparator") {
                        thisThousandSeparatorCtl.setValue(control.oldVlaue);
                    } else {
                        thisDecimalSeparatorCtl.setValue(control.oldVlaue);
                    }
                }
                break;
            case "defaultValueTypeFor_prod"://품목 기본값 타입  
                var ctlDEFAULT_VAL = this.contents.getControl("defaultVal__" + selfIndex);
                var ctlDEFAULT_PROD_COL = this.contents.getControl("defaultProdCol__" + selfIndex);
                var ctlSetting2Formula = this.contents.getControl("setting2Formula__" + selfIndex);
                if (selfControl.getValue() == "D") {
                    ecmodule.common.formHelper.setShowControls(this, [ctlDEFAULT_VAL]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlDEFAULT_PROD_COL, ctlSetting2Formula]);
                } else if (selfControl.getValue() == "P") {
                    ecmodule.common.formHelper.setShowControls(this, [ctlDEFAULT_PROD_COL]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlDEFAULT_VAL, ctlSetting2Formula]);
                } else {
                    ecmodule.common.formHelper.setShowControls(this, [ctlSetting2Formula]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlDEFAULT_VAL, ctlDEFAULT_PROD_COL]);
                }
                break;
            case "settingByDataInfoDomestic"://직접설정/사용자설정 기본값 타입  

                var ctlDEFAULT_VAL = this.contents.getControl("defaultVal__" + selfIndex);
                var ctlSetting3Formula = this.contents.getControl("setting3Formula__" + selfIndex);
                if (selfControl.getValue() == "D") {
                    ecmodule.common.formHelper.setShowControls(this, [ctlDEFAULT_VAL]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlSetting3Formula]);
                } else {
                    ecmodule.common.formHelper.setShowControls(this, [ctlSetting3Formula]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlDEFAULT_VAL]);
                }
                break;
            case "defaultValueTypeFor_cust"://cust default type 거래처 기본값 타입
                var ctlTXT = this.contents.getControl("defaultVal__" + selfIndex);
                var ctlCUST_COLUMN_CD = this.contents.getControl("custColumnCd__" + selfIndex);
                var ctlCOL_TYPE = this.contents.getControl("colType__" + selfIndex);
                var ctlBALANCE_TYPE = this.contents.getControl("balanceType__" + selfIndex);
                var ctlNUM_CALC_PERIOD = this.contents.getControl("numCalcPeriod__" + selfIndex);
                var ctlSETTING_BALANCE = this.contents.getControl("settingBalance__" + selfIndex);
                var ctlSETTING_FORMULA = this.contents.getControl("settingFormula__" + selfIndex);
                if (selfControl.getValue() == "D") {//Designate Manually 직접지정
                    ecmodule.common.formHelper.setShowControls(this, [ctlTXT]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlCUST_COLUMN_CD, ctlCOL_TYPE, ctlBALANCE_TYPE, ctlNUM_CALC_PERIOD, ctlSETTING_BALANCE, ctlSETTING_FORMULA]);
                } else if (selfControl.getValue() == "C") {//거래처불러오기
                    ecmodule.common.formHelper.setShowControls(this, [ctlCUST_COLUMN_CD]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlTXT, ctlCOL_TYPE, ctlBALANCE_TYPE, ctlNUM_CALC_PERIOD, ctlSETTING_BALANCE, ctlSETTING_FORMULA]);
                } else if (selfControl.getValue() == "F") {//Formula 계산식지정
                    ecmodule.common.formHelper.setShowControls(this, [ctlCOL_TYPE, ctlNUM_CALC_PERIOD, ctlSETTING_FORMULA]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlTXT, ctlCUST_COLUMN_CD, ctlBALANCE_TYPE, ctlSETTING_BALANCE]);
                    this.contents.getControl("colType__" + selfIndex).setValue("0");
                    this.formInfo["FormOutSetDetail"]["COL_TYPE"] = this.contents.getControl("colType__" + selfIndex).getValue();
                } else if (selfControl.getValue() == "B") {//잔액표기
                    ecmodule.common.formHelper.setShowControls(this, [ctlBALANCE_TYPE, ctlNUM_CALC_PERIOD, ctlSETTING_BALANCE]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlTXT, ctlCUST_COLUMN_CD, ctlCOL_TYPE, ctlSETTING_FORMULA]);
                }
                break;
            case "defaultInType": //ecount / Formula default type 계산식 기본값 타입
                //ecount/Formula 계산식
                if (selfControl.getValue() == "E") {
                    ecmodule.common.formHelper.setHideControls(this, [this.contents.getControl("setting2Formula__" + selfIndex)]);
                    //Domestic 내자
                    this.contents.getControl("defaultCalcInVal__" + selfIndex).setValue("");
                    this.contents.getControl("defaultCalcInOpenVal__" + selfIndex).setValue("");
                    //Foreign 외자
                    this.contents.getControl("defaultCalcOutVal__" + selfIndex).setValue("");
                    this.contents.getControl("defaultCalcOutOpenVal__" + selfIndex).setValue("");
                } else {
                    ecmodule.common.formHelper.setShowControls(this, [this.contents.getControl("setting2Formula__" + selfIndex)]);
                }
                break;
            case "dateType"://date default type 날짜 기본값 타입       
                var defaultSetShowType = this.formInfo.columns[0].defaultSetShowType;
                var ctlDATE_ADJUST = this.contents.getControl("dateAdjust__" + selfIndex);
                var ctlDATE_ADJUST_TYPE = this.contents.getControl("dateAdjustType__" + selfIndex);
                var ctlDATE_COL = this.contents.getControl("dateCol__" + selfIndex);
                if (this.COL_CD === null)
                    defaultSetShowType = "D3";

                if (selfControl.getValue() == "C") {
                    ecmodule.common.formHelper.setShowControls(this, [ctlDATE_ADJUST, ctlDATE_ADJUST_TYPE]);
                    ecmodule.common.formHelper.setHideControls(this, [ctlDATE_COL]);
                }
                else if (selfControl.getValue() == "H") {
                    ecmodule.common.formHelper.setHideControls(this, [ctlDATE_ADJUST, ctlDATE_ADJUST_TYPE, ctlDATE_COL]);
                }
                else if (selfControl.getValue() == "N") {
                    ecmodule.common.formHelper.setHideControls(this, [ctlDATE_ADJUST, ctlDATE_ADJUST_TYPE, ctlDATE_COL]);
                } else if (selfControl.getValue() == "R") {
                    if (defaultSetShowType == "D3") {
                        ecmodule.common.formHelper.setShowControls(this, [ctlDATE_COL]);
                        ecmodule.common.formHelper.setHideControls(this, [ctlDATE_ADJUST, ctlDATE_ADJUST_TYPE]);
                    }
                    else {
                        ecmodule.common.formHelper.setShowControls(this, [ctlDATE_ADJUST, ctlDATE_ADJUST_TYPE, ctlDATE_COL]);
                    }
                } else if (selfControl.getValue() == "L") {
                    ecmodule.common.formHelper.setHideControls(this, [ctlDATE_ADJUST, ctlDATE_ADJUST_TYPE, ctlDATE_COL]);
                }

                break;
            case "defaultValueTypeFor_Foreign":
                //default type 기본값 구분 - D:Designate Manually직접 지정, N:Recent Slips최신 전표  
                var ctlExchangeType = this.contents.getControl("exchangeType__" + selfIndex);
                var ctlExchangeRate = this.contents.getControl("exchangeRate__" + selfIndex);
                if (selfControl.getValue() == "D") {
                    if (ctlExchangeType.getValue() == "")
                        ecmodule.common.formHelper.setShowControls(this, [ctlExchangeType]);
                    else
                        ecmodule.common.formHelper.setShowControls(this, [ctlExchangeType, ctlExchangeRate]);
                }
                else
                    ecmodule.common.formHelper.setHideControls(this, [ctlExchangeType, ctlExchangeRate]);

                break;
            case "exchangeType"://Foreign Currency type 외화종류
                var ctlEXCHANGE_RATE = this.contents.getControl("exchangeRate__" + selfIndex);
                var ctlIsForeignCustEnable = this.contents.getControl("isForeignCustEnable__" + selfIndex);
                var ctlIsForeignCurrency = this.contents.getControl("isForeignCurrency__" + selfIndex);
                var ctlExchangeRate = this.contents.getControl("exchangeRate__" + selfIndex);

                if (selfControl.getValue() == "") {
                    //Domestic 내자
                    ecmodule.common.formHelper.setHideControls(this, [ctlEXCHANGE_RATE]);
                    ctlIsForeignCustEnable.setValue("true");
                    ctlIsForeignCurrency.setValue("false");
                } else {
                    //Foreign 외자
                    ecmodule.common.formHelper.setShowControls(this, [ctlEXCHANGE_RATE]);
                    ctlIsForeignCustEnable.setValue("false");
                    ctlIsForeignCurrency.setValue("true");

                    var strEXCHANGE_TYPE = selfControl.getValue();
                    var CommoCode = thisObj.viewBag.InitDatas.CommonCode.find(function (item) { return item.Key.CODE_NO == strEXCHANGE_TYPE });
                    ctlExchangeRate.setLabel(CommoCode.EXCHANGE_RATE);
                }
                break;
            case "colType":
                thisObj.contents.getForm().forEach(function (formitem, j) {
                    if (!$.isNull(thisObj.contents.getControl("zeroCheckYn__" + selfIndex))) {
                        if (formitem.getControl("zeroCheckYn__" + selfIndex)) {
                            formitem.setTitle("zeroCheckYn__" + selfIndex, thisObj.decimalHash.get(thisObj.contents.getControl("colType__" + selfIndex).getValue()));
                        }
                    }
                });
                break;
            case "defaultReminderType"://date default type 날짜 기본값 타입                
                var ctlcustomFor_ReminderType = this.contents.getControl("customFor_ReminderType__" + selfIndex);
                if (selfControl.getValue() == "0|00|0") {
                    ecmodule.common.formHelper.setHideControls(this, [ctlcustomFor_ReminderType]);

                } else {
                    ecmodule.common.formHelper.setShowControls(this, [ctlcustomFor_ReminderType]);
                }

                break;
            case "colMemoYn"://date default type 날짜 기본값 타입
                var reminderTypeCtl = thisObj.contents.getControl("customFor_ReminderType__" + selfIndex);
                if (control.value === false) {

                    reminderTypeCtl.get("colAppPushYn__" + selfIndex).setValue(false);
                    reminderTypeCtl.get("colAppPushYn__" + selfIndex).readOnly(true);
                } else if (control.value === true) {
                    reminderTypeCtl.get("colAppPushYn__" + selfIndex).readOnly(false);
                    reminderTypeCtl.get("colAppPushYn__" + selfIndex).setValue(true);
                }
                break;
            case "paymentType"://paymentType__0_PT_paymentType
                if (control.value == "CE") {
                    thisObj.contents.getForm()[1].setTitle("paymentType__0", ecount.resource.LBL01046);
                }
                else {
                    //thisObj.contents.getForm()[1].setTitle("paymentType__0", ecount.resource.LBL14280);
                    thisObj.contents.getForm()[1].setTitle("paymentType__0", "");
                }

                break;


        }
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //set Balance 설정 잔액표기
    //onContentsSettingBalance: function () {
    //    var param = {
    //        width: 600,
    //        height: 400,
    //        modal: true,
    //        FORM_TYPE: this.FORM_TYPE,
    //        BALANCE_TYPE: this.contents.getControl("custBalanceType").getValue()
    //    };
    //    // Open popup
    //    this.openWindow({
    //        url: "/ECERP/Popup.Common/CM100P_12",
    //        name: "",
    //        param: param,
    //        popupType: false,
    //        additional: false
    //    });
    //},

    onSettingNoti: function (event) {
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        var param = {
            width: 600,
            height: 230,
            POPUP_CD: 610,
            INDEX: selfIndex,
            COL_CD: this.formInfo.FormOutSetDetails[0].COL_CD,
            SMS_TXT: this.formInfo.FormOutSetDetails[0].SMS_TXT,
            EMAIL_TXT: this.formInfo.FormOutSetDetails[0].EMAIL_TXT,
            MEMO_TXT: this.formInfo.FormOutSetDetails[0].MEMO_TXT
        };
        this.openWindow({
            url: '/ECERP/ESC/ESC001P_402_01',
            name: ecount.resource.LBL01280,
            param: param,
            popupType: false,
            additional: false
        });
    },
    onSettingBalance: function (event) {
        var thisObj = this;
        var selfId;
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        if (this.FORM_TYPE == "SU030" || this.FORM_TYPE == "SU021" || this.FORM_TYPE == "OU020" || this.FORM_TYPE == "PU080" || this.FORM_TYPE == "SU210") {
            //Formula 계산식
            popurl = "/ECERP/Popup.Common/CM100P_05";
            var param = {
                width: 600,
                height: 500,
                FORM_TYPE: this.FORM_TYPE,
                LOCATION_TOP: false,
                CALC_DESC: this.contents.getControl("defaultCalcInValSql__" + selfIndex).getValue(), //data.calc_desc,
                CALC_GUBUN: this.contents.getControl("defaultCalcInValGubun__" + selfIndex).getValue(), //data.calc_gubun,
                BALANCE_TYPE: this.contents.getControl("custBalanceType__" + selfIndex).getValue(),
                CALC_PAGE: "CM100P_42_BALANCE",
                IS_CALC_ONLY: true,
                IS_CALC_TYPE: false,
                IS_BALANCE_TYPE: true,
                IsUseExtendedMergeExpression: true,
                IS_RESIZE: true,
                INDEX: selfIndex,
                COL_CD: this.COL_CD
            };
            // Open popup
            this.openWindow({
                url: popurl,
                name: ecount.resource.LBL07994,
                param: param,
                popupType: false,
                additional: false
            });
        } else {
            var param = {
                width: 600,
                height: 400,
                modal: true,
                FORM_TYPE: this.FORM_TYPE,
                BALANCE_TYPE: this.contents.getControl("custBalanceType__" + selfIndex).getValue(),
                INDEX: selfIndex
            };
            // Open popup
            this.openWindow({
                url: "/ECERP/Popup.Common/CM100P_12",
                name: "",
                param: param,
                popupType: false,
                additional: false
            });
        }
    },

    onSettingScpDefaultsPriority: function (event) {
        var thisObj = this;
        var selfId;
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        var param = {
            width: 400,
            height: 300,
            modal: true,
            FORM_TYPE: this.FORM_TYPE,
            COL_CD: thisObj.formInfo.columns[selfIndex].id,
        };
        // Open popup
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_49",
            name: "",
            param: param,
            popupType: false,
            additional: false
        });
    },

    onSettingFileGroup: function (event) {
        var thisObj = this;
        var param = {
            width: 400,
            height: 300,
            modal: true,
            FORM_TYPE: this.FORM_TYPE,
            COL_CD: thisObj.formInfo.columns[selfIndex].id,
        };
        // Open popup
        this.openWindow({
            url: "/ECERP/EGM/EGM023P_17",
            name: "",
            param: param,
            popupType: false,
            additional: false
        });
    },

    onContentsRefLink: function () {
        var self = this;
        var params = {
            width: 384,
            height: 350,
            model: true,
            IsRefLinkClick: true,
            FORM_TYPE: this.FORM_TYPE,
            FORM_SEQ: 1,
            IsRestore: self.IsRestore,
            linkOptionLst: this.linkOptionLst,
            isLinkOptionSave: this.isLinkOptionSave
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/EGM/EGM023P_17',
            name: ecount.resource.LBL13626,
            param: params,
            popupType: false,
            additional: false
        });
    },

    //setting button 설정버튼
    onContentsSettingSubProd: function () {
        var headForm = this.FORM_TYPE.substring(0, 2);
        if (headForm == "SI" || headForm == "OI") {
            this.FORM_TYPE = this.FORM_TYPE.replace("I", "D")
        }

        var param = {
            width: 1200,
            height: 800,
            modal: true,
            FORM_TYPE: this.FORM_TYPE
        };
        // Open popup
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_06",
            name: "",
            param: param,
            popupType: false,
            additional: false
        });
    },

    onSetting2FormulaDomestic: function (event) {
        var thisObj = this;
        var selfId;
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        thisObj.onSetting2Formula.call(this, { f_type: "0", selfIndex: selfIndex, calc_desc: thisObj.contents.getControl("defaultCalcInValSql__" + selfIndex).getValue(), calc_gubun: thisObj.contents.getControl("defaultCalcInValGubun__" + selfIndex).getValue() });
    },

    //ex) 세부내역에서 품명,규격,비고에 대한 기본값 설정
    onSetting3FormulaDomestic: function (event) {
        var thisObj = this;
        var selfId;
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        thisObj.onSetting3Formula.call(this, { f_type: "0", selfIndex: selfIndex, calc_desc: thisObj.contents.getControl("defaultCalcInValSql__" + selfIndex).getValue(), calc_gubun: thisObj.contents.getControl("defaultCalcInValGubun__" + selfIndex).getValue() });
    },

    onSetting2FormulaForeign: function (event) {
        var thisObj = this;
        var selfId;
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        thisObj.onSetting2Formula.call(this, { f_type: "1", selfIndex: selfIndex, calc_desc: thisObj.contents.getControl("defaultCalcOutValSql__" + selfIndex).getValue(), calc_gubun: thisObj.contents.getControl("defaultCalcOutValGubun__" + selfIndex).getValue() });
    },


    onSetting2Formula: function (data) {
        var thisObj = this;
        var colCd = thisObj.formInfo.columns[data.selfIndex].id;
        var defaultSetShowType = "";
        var column = this.formInfo.columns.find(function (column) { return column.id == colCd });
        if (column.length > 0)
            defaultSetShowType = column.defaultSetShowType

        //Formula 계산식
        popurl = "/ECERP/Popup.Common/CM100P_05";
        var param = {
            width: 780,
            height: 500,
            FORM_TYPE: this.FORM_TYPE,
            F_TYPE: data.f_type,
            SHOW_TYPE: defaultSetShowType,
            LOCATION_TOP: false,
            CALC_TYPE: ((defaultSetShowType == "C") ? (colCd == "supply_amt" ? "S" : "V") : ""),
            CALC_DESC: data.calc_desc,
            CALC_GUBUN: data.calc_gubun,
            CALC_PAGE: "CM100P_45",
            IS_CALC_ONLY: true,
            IS_CALC_TYPE: true,
            UserData: data.f_type,
            INDEX: data.selfIndex,
            COL_CD: colCd
        };
        // Open popup
        this.openWindow({
            url: popurl,
            name: ecount.resource.LBL05875,
            param: param,
            popupType: false,
            additional: false
        });

    },

    //ex) 세부내역에서 품명,규격,비고에 대한 기본값 설정
    onSetting3Formula: function (data) {
        var thisObj = this;
        var colCd = thisObj.formInfo.columns[data.selfIndex].id;
        var defaultSetShowType = "";
        var column = this.formInfo.columns.find(function (column) { return column.id == colCd });
        if (column.length > 0)
            defaultSetShowType = column.defaultSetShowType

        popurl = "/ECERP/Popup.Common/CM100P_05";
        var param = {
            width: 780,
            height: 500,
            FORM_TYPE: this.FORM_TYPE,
            F_TYPE: data.f_type,
            SHOW_TYPE: defaultSetShowType,
            LOCATION_TOP: false,
            CALC_TYPE: ((defaultSetShowType == "C") ? (colCd == "supply_amt" ? "S" : "V") : ""),
            CALC_DESC: data.calc_desc,
            CALC_GUBUN: data.calc_gubun,
            CALC_PAGE: "DATA_INFORMATION",
            IS_CALC_ONLY: true,
            IS_CALC_TYPE: false,
            IsUseExtendedMergeExpression: true,
            UserData: data.f_type,
            INDEX: data.selfIndex,
            COL_CD: colCd,
            HEADER_TITLE: ecount.resource.LBL09211,
            IS_SHOW_TOP_TITLE: false
        };
        // Open popup
        this.openWindow({
            url: popurl,
            name: ecount.resource.LBL05875,
            param: param,
            popupType: false,
            additional: false
        });

    },

    onGetZipCode: function (event) {
        var selfId;
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        this.zipCodeId = 'defaultVal__' + selfIndex;

        var param = {
            IsInputForm: true,
            width: ecount.infra.getPageWidthFromConfig(),
            height: 500
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM004P',
            name: ecount.resource.LBL04090,
            param: param,
            popupType: false
        });
    },


    //Apply 적용 버튼
    onFooterApply: function (e) {
        var thisObj = this;
        var errcnt = 0;
        // check valid  유효성 체크
        thisObj.commonForm.getWidgetHelper().getCheckKeys().forEach(function (key, j) {
            //call check function 호출 매핑 펑션
            var aryKey = key.split("__");
            errcnt = thisObj.commonForm.getWidgetHelper().getCheckWedgets().get(aryKey[0])({ errcnt: errcnt, index: aryKey[1], formInfo: thisObj.getFormInfoByIndex({ index: aryKey[1] }) });
        });
        //check validate 실시간 유효성 체크된 에러확인
        if (errcnt == 0) {
            var invalidNow = this.validateNow();
            errcnt = invalidNow.length;
            if (errcnt > 0) {
                var invalidControl = invalidNow[0];
                invalidControl = ($.isArray(invalidControl)) ? invalidControl[0].control : invalidControl.control;
                if (!e.unfocus) invalidControl.setFocus(0);
            }
        }
        //에러가 없다면 기본 유효성체크 - 실시간하고 순서 바뀌면 안됨 먼저 실행되면 실시간 유효성 체크된게 날라감
        if (errcnt == 0) {
            var invalid = this.contents.validate();
            errcnt = invalid.merge().length;
            if (invalid.result.length > 0) {
                var invalidControl = invalid.result[0][0];
                invalidControl = ($.isArray(invalidControl)) ? invalidControl[0].control : invalidControl.control;
                if (!e.unfocus) invalidControl.setFocus(0);
            }
        }

        if (errcnt == 0) {
            thisObj.commonForm.getWidgetHelper().getMappingKeys().forEach(function (key, j) {
                //call mapping function 호출 매핑 펑션
                var aryKey = key.split("__");
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get(aryKey[0])({ index: aryKey[1], formInfo: thisObj.getFormInfoByIndex({ index: aryKey[1] }) });
            });
            var rowData = this.formInfo;

            if (this.isLinkOptionSave)
                rowData.FormOtherDatas.LINK_OPTION = this.linkOptionLst;

            var message = {
                data: rowData,
                cid: "",// TO-DO 삭제해야 함. 기획변경으로 
                formIndex: this.formIndex,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } else {
            thisObj.footer.getControl('apply').setAllowClick();
        }
    },

    // Frequently Used Phrases 자주사용하는 문구
    onFunctionFrequentlyUsedPhrases: function (event) {
        var thisObj = this;
        var selfId;
        var selfIndex;
        var aryKey = event.controlID.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        var param = {
            height: 550,
            width: 450,
            FORM_TYPE: thisObj.FORM_TYPE,
            COL_CD: thisObj.formInfo.columns[selfIndex].id,
            INDEX: selfIndex
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Search/CM104P',
            name: String.format(ecount.resource.LBL10109, ecount.resource.LBL10579),
            param: param,
            popupType: false,
            additional: false,
        });
    },

    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    //F8 Event
    ON_KEY_F8: function (e) {
        if (ecount.global.isDisableAlert())
            this.onFooterApply(e);
    },

    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //send data 데이터 적용
    sendRowData: function (control) {
        var idx = control.getValue();
        var rowData = "";
        var message = {
            data: rowData,
            formIndex: this.formIndex,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //builder for form 폼생성
    setFormBuilder: function (x) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            ctrl2 = generator.control(),
            ctrl3 = generator.control(),
            ctrl4 = generator.control(),
            ctrl5 = generator.control(),
            ctrl6 = generator.control(),
            ctrl7 = generator.control(),
            ctrl8 = generator.control(),
            ctrl9 = generator.control(),
            ctrl10 = generator.control(),
            form = widget.generator.form(),
            hr1 = generator.line(),
            hr2 = generator.line(),
            hr3 = generator.line(),
            hr4 = generator.line(),
            panel = widget.generator.panel();

        form
            .useBaseForm()
            .css("table-template-setup")
            .templateType("formset")
            .setOptions({ _isErrorBorderNone: true });
        var thisObj = this;
        var p = {
            ctrl: ctrl, ctrl2: ctrl2, ctrl3: ctrl3, ctrl4: ctrl4, ctrl5: ctrl5,
            ctrl6: ctrl6, ctrl7: ctrl7, ctrl8: ctrl8, ctrl9: ctrl9, ctrl10: ctrl10,
            form: form,
            index: x.index,
            formInfo: thisObj.getFormInfoByIndex({ index: x.index }),
        };
        //상속된 디폴트쇼타입 가져오기
        var defaultSetShowType = p.formInfo.column.defaultSetShowType;
        switch (x.type) {

            case "general"://default 기본
                if (thisObj.defaultTypeOnly.contains(thisObj.FORM_TYPE)) {
                    thisObj.commonForm.getWidgetHelper().add(["customFor_ColEssentialYn"], p);
                } else {
                    thisObj.commonForm.getWidgetHelper().add(["headTitleNm"], p);//표시명
                    if (defaultSetShowType == "C")
                        thisObj.commonForm.getWidgetHelper().add(["inputTitleNm"], p);

                    if (thisObj.isTop) {
                        if (thisObj.FORM_TYPE == "GU111" && thisObj.formInfo.columns[x.index].id == "txtCarNum") {
                            thisObj.commonForm.getWidgetHelper().add(["numSort", "tabIndex", "customFor_ColEssentialYn", "isInputable", "isEditable"], p);
                        }
                        else {

                            if (["SU721"].contains(thisObj.FORM_TYPE)) {
                                thisObj.commonForm.getWidgetHelper().add(["numSort", "tabIndex", "customFor_ColEssentialYn", "isLineMrge"], p);
                            } else {
                                thisObj.commonForm.getWidgetHelper().add(["numSort", "tabIndex", "customFor_ColEssentialYn", "isLineMrge", "isInputable", "isEditable"], p);
                            }

                        }
                    } else {
                        thisObj.commonForm.getWidgetHelper().add(["numSort", "tabIndex", "headSize"], p);
                        //if it is not detail, build  ColEssentialYn  상세가 아닌경우 필수항목
                        if (defaultSetShowType != "F" && !["item_des", "serial_cd", "btnInspectionItem", "btnReject"].contains(p.formInfo.FormColumn.COL_CD)
                            && !(thisObj.FORM_TYPE == "AI810" && ["time_date"].contains(p.formInfo.FormColumn.COL_CD))) {
                            thisObj.commonForm.getWidgetHelper().add(["customFor_ColEssentialYn"], p);
                        }
                    }
                }

                if (form.getRowCount() > 0) {
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL00832));
                    x.contents.add(form);
                }

                break;
            case "font"://font 글꼴
                if (defaultSetShowType != "F")//if it is not detail 상세가 아닌경우 
                    thisObj.commonForm.getWidgetHelper().add(["headFont"], p);

                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL70558));//Font 글꼴  
                    x.contents.add(form);
                }
                break;
            case "setup"://setup 설정                
                if (defaultSetShowType == "D1") {
                    if (["SU721"].contains(thisObj.FORM_TYPE)) {
                        thisObj.commonForm.getWidgetHelper().add(["customFor_DateAfter"], p);
                    }
                    else if (["SU722"].contains(thisObj.FORM_TYPE)) {

                    } else {
                        thisObj.commonForm.getWidgetHelper().add(["dateType", "customFor_DateAdjust"], p);
                    }
                } else if (defaultSetShowType == "CD") {//use code 사용자코드
                    thisObj.commonForm.getWidgetHelper().add(["userCd", "code_CodeNm"], p);//there is not widget. 아직 위젯없음 개발되면 적용 해야함 TO-DO
                } else if (defaultSetShowType == "D2") {//date type 일자형식
                    thisObj.commonForm.getWidgetHelper().add(["dateType", "dateCol", "customFor_DateAdjust"], p);
                } else if (defaultSetShowType == "D3") {//date type 일자형식
                    thisObj.commonForm.getWidgetHelper().add(["dateType", "dateCol", "customFor_DateAdjust"], p);
                } else if (defaultSetShowType == "P1") {//cust 거래처
                    thisObj.commonForm.getWidgetHelper().add(["settingPopUpScpDefaultsPriority"], p);
                } else if (defaultSetShowType == "P2" || defaultSetShowType == "P3") {
                    if (["SU721", "SU722"].contains(thisObj.FORM_TYPE)) {

                    } else {
                        thisObj.commonForm.getWidgetHelper().add(["settingScpDefaultsPriority"], p);//project/pic/location-out 프로젝트/담당자/출하창고
                        switch (p.formInfo.FormColumn.CONTROL_TYPE.toLowerCase()) {
                            case "widget.code.pic":
                                if (!["AU460", "SU500", "SU600", "SU230"].contains(thisObj.FORM_TYPE))
                                    thisObj.commonForm.getWidgetHelper().add(["isForeignCustEnable"], p);
                                break;
                        }
                    }
                }
                else if (defaultSetShowType == "P4") {//assets_code 자산코드                   
                    thisObj.commonForm.getWidgetHelper().add(["settingPopUpScpDefaultsPriorityCustom"], p);
                }
                else if (defaultSetShowType == "IO") {
                    //default 기본값,Foreign Currency 외화 환율,load value  불러오는 값
                    thisObj.commonForm.getWidgetHelper().add(["isForeignCurrency", "defaultValueTypeFor_Foreign", "exchangeType", "exchangeRate", "isForeignCustEnable"], p);
                } else if (['R', 'R2', 'C1', 'C2', 'C3', 'C4'].indexOf(defaultSetShowType) >= 0) {//text type 문자 형식,long text 장문형식
                    //TO-DO cs공유 여부 추가시 여기에서 add함
                    thisObj.commonForm.getWidgetHelper().add(["defaultValueTypeFor_cust", "defaultVal", "custColumnCd", "settingBalance", "isCsShareSettable"], p);
                } else if (defaultSetShowType == "R3") {
                    thisObj.commonForm.getWidgetHelper().add(["defaultValAddiction"], p);
                } else if (defaultSetShowType == "A") {//number type 숫자 형식
                    thisObj.commonForm.getWidgetHelper().add(["defaultValueTypeFor_cust", "defaultVal", "custColumnCd", "colType", "balanceType", "settingFormula", "numCalcPeriod"], p);
                } else if (defaultSetShowType == "TN") {    //일련번호
                    thisObj.commonForm.getWidgetHelper().add(["taxNo"], p);
                } else if (defaultSetShowType == "ST") {    //청구/영수
                    thisObj.commonForm.getWidgetHelper().add(["settle"], p);
                } else if (defaultSetShowType == "B") {    //비고                   
                    thisObj.commonForm.getWidgetHelper().add(["remarks"], p);
                } else if (defaultSetShowType == "FG") { //파일그룹
                    thisObj.commonForm.getWidgetHelper().add(["file_cd"], p);
                } else if (["GU121", "GU131"].contains(thisObj.FORM_TYPE)) {
                    if (p.formInfo.column.id == 'PUBLIC_TYPE') {
                        thisObj.commonForm.getWidgetHelper().add(["defaultPublicType"], p);
                    }
                    else if (p.formInfo.column.id == 'RETURN_YN') {
                        thisObj.commonForm.getWidgetHelper().add(["defaultReturnYn"], p);
                    }
                    else if (p.formInfo.column.id == 'REMINDER') {
                        thisObj.commonForm.getWidgetHelper().add(["defaultReminderType", 'customFor_ReminderType'], p);
                    }
                    else if (p.formInfo.column.id.toLowerCase().startsWith('col') && $.isNumeric(p.formInfo.column.id.substring(3, 6))) { // column dynamic, col100 --> col500

                        x.contents.add(hr1.add("hr"));
                        var widType = p.formInfo.column.id.toLowerCase().substring(0, 3);

                        switch (p.formInfo.column.controlType.toLowerCase()) {
                            case "widget.input.number":
                                widType = widType + '' + 1;
                                break;
                            case "widget.input.general":
                                widType = widType + '' + 2;
                                break;
                            case "widget.radio":
                                widType = widType + '' + 3;
                                break;
                            case "widget.date":
                                widType = widType + '' + 4;
                                break;
                            case "widget.code.codetypedata":
                                widType = widType + '' + 5;
                                break;
                        }
                        if (widType != 'col4') {
                            thisObj.commonForm.getWidgetHelper().add([widType], p);
                        }
                    }
                }
                else if (["AU752"].contains(thisObj.FORM_TYPE) && defaultSetShowType == "PT") {
                    thisObj.commonForm.getWidgetHelper().add(["paymentType"], p);
                }

                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL01593));//Setup설정
                    x.contents.add(form);
                }
                break;

            case "buttomSetup"://setup 설정
                if (defaultSetShowType == "I") {
                    thisObj.commonForm.getWidgetHelper().add(["defaultValueSliptype"], p);
                }
                if (["PI085"].contains(thisObj.FORM_TYPE) && p.formInfo.column.id == 'APPLY_AMT') {
                    thisObj.commonForm.getWidgetHelper().add(["settingApplyType"], p);
                    thisObj.commonForm.getWidgetHelper().add(["settingFieldApply"], p);
                }
                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL01593));//Setup설정
                    x.contents.add(form);
                }
                break;
            case "displayForm"://display form 표시형태  
                var dispZeroForm = ["SI220", "SI610", "SI240", "SI744", "SI780", "SI600", "SI210", "SI940", "SI200", "SI760", "SI400", "SI410",
                    "SI420", "SI440", "AI400", "AU101", "AI400", "AI410", "AI420", "AI430", "AU140", "AI400", "AU102", "AU360", "SI010",
                    "AU440", "AU390", "AU370", "AU380", "AU340", "AU450", "AU470", "AU430", "AU350", "AU410", "AU400", "AU150", "SD010", "AU460", "AU420", "AU480", "AU760", "AU761", "AU762", "AU763",
                    "AU764", "AU570", "AU580", "AI752", "AI810", "AU160", "SI412", "SI710", "SU722", "PI080", "AI450", "AI440", "OI020",
                    "AU510", "AU490", "AU850", "AU520", "AU500", "SI400", "SI410", "SI420", "SI440", "AI400", "AI420",
                    "AI430", "AU140", "AU360", "AU440", "AU390", "AU370", "AU380", "AU340", "AU450", "AU470", "AU430", "AU350", "AU410", "AU400"]; //0값 항목 표시제거 양식 
                //decimal 소수점
                //thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn"], p);
                //thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn", "dispZero"], p);
                //thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn", "dispZero", "defaultSeparator", "thousandSeparator", "decimalSeparator"], p);

                if (dispZeroForm.contains(thisObj.FORM_TYPE)) {
                    thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn", "defaultSeparator", "thousandSeparator", "decimalSeparator"], p);
                } else {
                    thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn", "dispZero", "defaultSeparator", "thousandSeparator", "decimalSeparator"], p);
                }

                var DecAmtForm = ["AR480", "AR485", "AR490", "AR495", "AR440", "AR445", "AR450", "AR455", "AR460", "AR465", "AR470", "AR475", "AI810"];
                if (DecAmtForm.contains(thisObj.FORM_TYPE)) {
                    thisObj.commonForm.getWidgetHelper().add(["decAmt"], p);
                }

                if (defaultSetShowType != "N") {
                    //defalut price 1,2 기본값  금액1,2
                    //DEFAULT_SET_SHOW_TYPE = "";//기본값 설정 보이기 타입(N:no view 안보이기, R remark : 적요, A amount 금액  C calc amount:  부가세/공급가액 )

                    if (defaultSetShowType == "C") {
                        thisObj.commonForm.getWidgetHelper().add(["defaultInType", "setting2Formula"], p);
                    } else if (defaultSetShowType == "A" || defaultSetShowType == "R"
                        || defaultSetShowType == "R2") {
                        thisObj.commonForm.getWidgetHelper().add(["defaultValueTypeFor_prod", "defaultVal", "defaultProdCol", "setting2Formula"], p);
                    } else if (defaultSetShowType == "R4") { //품목명, 규격, 비고, 적요1, 적요2, 적요3
                        thisObj.commonForm.getWidgetHelper().add(["settingByDataInfoDomestic", "defaultVal", "setting3Formula"], p);
                    } else if (defaultSetShowType == "F") {//detail 상세
                        thisObj.commonForm.getWidgetHelper().add(["settingSubProd"], p);
                    } else if (defaultSetShowType == "B") {    //비고
                        thisObj.commonForm.getWidgetHelper().add(["remarks"], p);
                    }
                    else if (defaultSetShowType == "K") {    //비고
                        thisObj.commonForm.getWidgetHelper().add(["numericremarks"], p);
                    }
                    else if (defaultSetShowType == "Q") {    //수량
                        thisObj.commonForm.getWidgetHelper().add(["qty"], p);
                    }
                }
                if (form.getRowCount() > 0) {
                    x.contents.add(hr4.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL11071));//Display Form 표시형태 
                    x.contents.add(form);
                }
                break;
        }
    },

    setCalcData: function (data, isString) {
        var result = { DEFAULT_CALC_VAL: "", DEFAULT_CALC_OPEN_VAL: "" };

        if ($.isArray(data)) {
            var defaultCalcVal = "", defaultCalcOpenVal = "";
            var itemOriginalName = {
                uqty: ecount.resource.LBL35130,
                qty: ecount.resource.LBL01688,
                out_price1: ecount.resource.LBL00961,
                out_price2: ecount.resource.LBL00962,
                out_price3: ecount.resource.LBL00963,
                out_price4: ecount.resource.LBL08035,
                out_price5: ecount.resource.LBL08036,
                out_price6: ecount.resource.LBL08037,
                out_price7: ecount.resource.LBL08038,
                out_price8: ecount.resource.LBL08039,
                out_price9: ecount.resource.LBL08040,
                out_price10: ecount.resource.LBL08041
            };

            for (var i = 0, j = 0, lng = data.length; i < lng; i++) {
                switch (data[i].type.toString()) {
                    case "1": // 항목
                        defaultCalcVal += String.format("§{0}§", data[i].value);

                        defaultCalcOpenVal += itemOriginalName[data[i].value] ? itemOriginalName[data[i].value] : data[i].label;
                        break;
                    case "3": // 숫자
                    case "6": // 사칙연산
                        defaultCalcVal += data[i].value;
                        defaultCalcOpenVal += data[i].value;
                        break;
                    case "7": // Round, Floor, Ceiling
                        switch (data[i].value) {
                            case "R(":
                            case "ROUND(":
                                defaultCalcVal += "fnMathRound(";
                                defaultCalcOpenVal += "R(";
                                break;
                            case "C(":
                            case "CEILING(":
                                defaultCalcVal += "fnMathIncrease(";
                                defaultCalcOpenVal += "C(";
                                break;
                            case "F(":
                            case "FLOOR(":
                                defaultCalcVal += "fnMathCutCalc(";
                                defaultCalcOpenVal += "F(";
                                break;
                        }
                        j++;
                        break;
                    case "8": // 괄호
                        defaultCalcVal += data[i].value;
                        defaultCalcOpenVal += data[i].value;
                        break;
                    case "9":
                    case "10":
                        if (isString) {
                            defaultCalcVal += data[i].value;
                            defaultCalcOpenVal += data[i].value;
                        }
                        break;
                }
            }
            if (isString) {
                result.DEFAULT_CALC_VAL = defaultCalcVal;
                result.DEFAULT_CALC_OPEN_VAL = defaultCalcOpenVal;
            } else {
                var taget_string = defaultCalcVal;
                if (taget_string.indexOf("/") == -1) { // /가 있는지 체크 check whether "/" exists
                    return_string = taget_string;
                }
                else {
                    var j_t = taget_string.split("/").length;  //  j_t = /갯수 

                    for (var j_s = 1; j_s < j_t; j_s++) {
                        var taget_string2 = taget_string.split("/");
                        return_string = "";
                        taget_string3 = "";

                        for (var j_0 = 0; j_0 < taget_string2.length; j_0++) {
                            if (j_0 < j_s)
                                return_string += taget_string2[j_0] + "/";
                            else {
                                taget_string3 += taget_string2[j_0];
                                if (j_0 != (taget_string2.length - 1))
                                    taget_string3 += "/";
                            }
                        } //for end 

                        var j = 0;
                        var nullif = "N";

                        if (taget_string3.indexOf("(") != -1) { // /가 있는지 체크 check whether "/" exists
                            return_string += "nullifchk("
                            nullif = "Y"
                        }

                        for (var j_1 = 0; j_1 < taget_string3.length; j_1++) {

                            switch (taget_string3.substr(j_1, 1)) {
                                case "(":
                                    j++;
                                    return_string += taget_string3.substr(j_1, 1);
                                    break;
                                case ")":
                                    j--;
                                    if (j < 1) {
                                        if (j == 0)
                                            return_string += taget_string3.substr(j_1, 1) + ",1)" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                        else {
                                            if (nullif == "Y")
                                                return_string += ",1))" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                            else
                                                return_string += taget_string3.substr(j_1, taget_string3.length);
                                        }

                                        j_1 = taget_string3.length;
                                    }
                                    else
                                        return_string += taget_string3.substr(j_1, 1);
                                    break;
                                default:
                                    return_string += taget_string3.substr(j_1, 1);
                            }
                        }
                        taget_string = return_string;
                    }
                }

                var arrCalcs = ["fnMathRound(", "fnMathIncrease(", "fnMathCutCalc("];
                taget_string = return_string;

                for (var ii = 0; ii < 3; ii++) {
                    if (taget_string.indexOf(arrCalcs[ii]) == -1) { // /가 있는지 체크 check whether "/" exists 
                        return_string = taget_string;
                    }
                    else {
                        var j_t = taget_string.split(arrCalcs[ii]).length;  //  j_t = /갯수 count

                        for (var j_s = 1; j_s < j_t; j_s++) {
                            var taget_string2 = taget_string.split(arrCalcs[ii]);
                            return_string = "";
                            taget_string3 = "";
                            for (var j_0 = 0; j_0 < taget_string2.length; j_0++) {
                                if (j_0 < j_s)
                                    return_string += taget_string2[j_0] + arrCalcs[ii];
                                else {
                                    taget_string3 += taget_string2[j_0];

                                    if (j_0 != (taget_string2.length - 1))
                                        taget_string3 += arrCalcs[ii];
                                }
                            }//for end

                            var j = 1;
                            for (var j_1 = 0; j_1 < taget_string3.length; j_1++) {

                                switch (taget_string3.substr(j_1, 1)) {
                                    case "(":
                                        j++;
                                        return_string += taget_string3.substr(j_1, 1);

                                        break;
                                    case ")":
                                        j--;
                                        if (j == 0) {
                                            return_string += ",0)" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                            j_1 = taget_string3.length;
                                        }
                                        else
                                            return_string += taget_string3.substr(j_1, 1);
                                        break;
                                    default:
                                        return_string += taget_string3.substr(j_1, 1);
                                }
                            }
                            taget_string = return_string;
                        }
                    }
                }
                result.DEFAULT_CALC_VAL = return_string;
                result.DEFAULT_CALC_OPEN_VAL = defaultCalcOpenVal;
            }
        }

        return result;
    },

    setCalcDataForFormulaFromDefaultCalcVal: function (calcVal) {
        var inValSql = "ㆍ" + calcVal + "ㆍ";
        var inValGubun = "ㆍ" + calcVal + "ㆍ";
        inValSql = inValSql.replace(/nullifchk\(/gi, "");
        inValGubun = inValGubun.replace(/nullifchk\(/gi, "");

        inValSql = inValSql.replace(/,1\)/gi, "");
        inValGubun = inValGubun.replace(/,1\)/gi, "");

        inValSql = inValSql.replace(/,0/gi, "");
        inValGubun = inValGubun.replace(/,0/gi, "");

        inValSql = inValSql.replace(/§(\w*)§/gi, "§$1§");
        inValGubun = inValGubun.replace(/§(\w*)§/gi, "§1§");

        inValSql = inValSql.replace(/(\d)(?=[^§])|(\d)\s*$/gi, "ㆍ$1$2ㆍ");
        inValGubun = inValGubun.replace(/(\d)(?=[^§])|(\d)\s*$/gi, "ㆍ3ㆍ");

        inValSql = inValSql.replace(/(\.)/gi, "ㆍ$1ㆍ");
        inValGubun = inValGubun.replace(/(\.)/gi, "ㆍ3ㆍ");

        inValSql = inValSql.replace(/(\+|-|\*|\/)/gi, "ㆍ$1ㆍ");
        inValGubun = inValGubun.replace(/(\+|-|\*|\/)/gi, "ㆍ6ㆍ");

        inValSql = inValSql.replace(/(\(|\))/gi, "ㆍ$1ㆍ");
        inValGubun = inValGubun.replace(/\(|\)/gi, "ㆍ8ㆍ");

        inValSql = inValSql.replace(/fnMathCutCalcㆍ\(|fnMathIncreaseㆍ\(|fnMathRoundㆍ\(/gi, function (v) {
            switch (v) {
                case "fnMathRoundㆍ(":
                    return "ROUND(";
                case "fnMathIncreaseㆍ(":
                    return "CEILING(";
                case "fnMathCutCalcㆍ(":
                    return "FLOOR(";
            }
        });
        inValGubun = inValGubun.replace(/fnMathCutCalcㆍ8|fnMathIncreaseㆍ8|fnMathRoundㆍ8/gi, "ㆍ7ㆍ");

        inValSql = inValSql.replace(/out_priceㆍ1ㆍ0/gi, "out_price10");

        inValSql = inValSql.replace(/§/gi, "ㆍ");
        inValGubun = inValGubun.replace(/§/gi, "ㆍ");

        inValSql = inValSql.replace(/([a-zA-Z])ㆍ([0-9])/gi, "$1$2");
        inValGubun = inValGubun.replace(/([a-zA-Z])ㆍ([0-9])/gi, "$1$2");

        inValSql = inValSql.replace(/ㆍ+/gi, "ㆍ");
        inValGubun = inValGubun.replace(/ㆍ+/gi, "ㆍ");

        if (inValSql.startsWith("ㆍ")) {
            inValSql = inValSql.substr(1);
        }
        if (inValSql.endsWith("ㆍ")) {
            inValSql = inValSql.substr(0, inValSql.length - 1);
        }
        inValSql = "default^calc_des^" + inValSql;

        if (inValGubun.startsWith("ㆍ")) {
            inValGubun = inValGubun.substr(1);
        }
        if (inValGubun.endsWith("ㆍ")) {
            inValGubun = inValGubun.substr(0, inValGubun.length - 1);
        }

        return {
            DEFAULT_CALC_VAL_GUBUN: inValGubun,
            DEFAULT_CALC_VAL_SQL: inValSql
        };
    },

    getFormInfoByIndex: function (data) {
        var thisObj = this;
        var colCd = thisObj.formInfo.columns[data.index].id;
        return this.getFormInfoByColCd.call(this, { colCd: colCd });
    },

    getFormInfoByColCd: function (data) {
        var thisObj = this;
        return {
            FormSet: thisObj.formInfo.FormSet,
            FormOutSet: thisObj.formInfo.FormOutSet,
            OtherDates: thisObj.formInfo.OtherDates, //other dates 다른 날짜 데이터
            FormColumn: thisObj.formInfo.FormColumns.find(function (item) { return item.COL_CD == data.colCd }),
            FormOutSetDetail: thisObj.formInfo.FormOutSetDetails.find(function (item) { return item.COL_CD == data.colCd }),
            FormOutColumn: thisObj.formInfo.FormOutColumns.find(function (item) { return item.COL_CD == data.colCd }),
            column: thisObj.formInfo.columns.find(function (item) { return item.id == data.colCd }),
            FormOtherDatas: thisObj.formInfo.FormOtherDatas,
        };
    },

    // setUseDrCr - 1출, 2입 사용여부 설정
    getUseDrCr: function () {
        switch (this.formInfo.FormOtherDatas.ACCT_INOUT_TYPE) {
            case "Y":
                this.useDrCr1 = 0;
                this.useDrCr2 = 0;
                break;
            case "I":
                this.useDrCr1 = 0;
                this.useDrCr2 = 1;
                break;
            case "O":
                this.useDrCr1 = 1;
                this.useDrCr2 = 0;
                break;
            case "N":
                this.useDrCr1 = 1;
                this.useDrCr2 = 1;
                break;
            default:
                this.useDrCr1 = 0;
                this.useDrCr2 = 0;
                break;
        }
    },

    changeLinkLabel: function (e) {
        var value = e.value, label = e.originEvent.target.text;
        this.toggleLinkLabel(label);
        this._linkValue = value;
    },

    /**
    * link의 dropdwon 메뉴가 선택될 때의 선택된 값의 label로, link widget 의 라벨도 바뀔 수 있는 함수( page에서 호출하기 위해 만든 함수 )
    * changeLinkLabel 은 ecount.control.anchor 에 새로 정의하였다.
    */
    toggleLinkLabel: function (label) {
        this.contents.getControl("settingApplyType__0").changeLinkLabel(label);
        //ecount.control.anchor에 정의, hasdropdown 선택 시 해당 label 값으로 link label이 변경될 수 있게 하는 메소드.
    },

    setUseDrCr: function (useDrCr1, useDrCr2) {
        if (useDrCr1 == true && useDrCr2 == true) {
            return "Y";
        } else if (useDrCr1 == true && useDrCr2 == false) {
            return "I";
        } else if (useDrCr1 == false && useDrCr2 == true) {
            return "O";
        } else if (useDrCr1 == false && useDrCr2 == false) {
            return "N";
        }
    },

    getMaxFOrmColSize: function (colSize, config) {
        return 1;
    },

    getTitleColumnWidth: function (colSize, config) {
        return 154;
    },
});