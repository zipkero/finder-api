window.__define_resource && __define_resource("LBL01593","BTN00069","BTN00008","MSG07361","LBL10109","LBL10579","LBL05360","LBL00832","LBL70558","LBL35589","LBL11071","LBL35130","LBL01688","LBL00961","LBL00962","LBL00963","LBL08035","LBL08036","LBL08037","LBL08038","LBL08039","LBL08040","LBL08041");
/***********************************************************************************
 1. Create Date : 2016.03.03
 2. Creator     : inho
 3. Description : Batch Settings(일괄설정)
 4. Precaution  :
 5. History     : 2017.06.02 천단위 구분기호, 소수기호 추가
                  2018.03.07 (LOC) A17_03024_Dev3994 채권채무잔액분석표 기간 늘리기
                  2019.01.03 Ngọc Hân A18_04272 - FE 리팩토링_페이지 일괄작업 (Remove $el at function onChangeControl)
                  2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.04.06 (On Minh Thien) - A20_01182 - 일정관리 금액 항목에 천단위 구분 , 안 뜨는 현상
 6. MenuPath    : Template Setup(양식설정)>Batch Settings(일괄설정)
 7. Old File    : CM100P_02.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_56", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    cofmTemp: null,

    formInfo: null,

    decimalHash: null,

    commonForm: null,

    formInfoAll: null,

    isScheduleFormType: false,

    isCalcFormula: true, // 숫자형계산식(true), 문자형계산식(false)

    isCalcFormulaMaria : false, // Maria 계산식 여부

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecmodule.common.formHelper");   
        this.registerDependencies("ecmodule.common.formMulti");
    },

    initProperties: function(){
        //신규 소계 로직인지
        this.isScheduleFormType = ([
            "GO121", "GO131"
        ].contains(this.FORM_TYPE) ? true : false);
    },

    render: function ($parent) {
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
            type: "getFormInfo",
            formIndex :this.formIndex,
            colCd : this.COL_CD, 
            callback: function (data) {
                this.formInfo = data;
            }.bind(this)
        };
        this.sendMessage(this, message);

        var allMessage = {
            type: "getFormInfo",
            formIndex: this.formIndex,
            colCd: "",
            callback: function (data) {
                this.formInfoAll = data;
            }.bind(this)
        };
        this.sendMessage(this, allMessage);
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL01593);//this.formInfo.FormOutSetDetail.HEAD_TITLE_NM || "");

        debugger;

        this.decimalHash = new $.HashMap();
        this.decimalHash.set("00", this.getZeroCheckYnTitle()); //"<span class='text-bold'>0</span>"
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

        if (this.FORM_TYPE == "GO040" && this.COL_CD == "ADD2") {
            this.isCalcFormula = false;
            this.isCalcFormulaMaria = true;
        }
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            batchSetup = g.batchSetup(),
            line = g.line(),
            subTitle = g.subTitle(),
            form = widget.generator.form(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        var thisObj = this;
        form.template("register")
            .useBaseForm({ _isThShow: true, _isRowInCount: 1 })
            .colgroup([{ width: "150" }, { width: "" }]);

        this.commonForm = new ecount.common.formMulti();
        this.commonForm.setWidgetMap(thisObj);
        debugger
        thisObj.formInfo.columns.forEach(function (reColumn, i) {
            var detail = thisObj.formInfo.FormOutSetDetails.find(function (item) { return item.COL_CD.toUpperCase() == reColumn.id.toUpperCase() });
            if (detail) {
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
                    batchSetup.addLayer("item_" + i, "item_" + i, thisObj.formInfo.FormOutColumns.find(function (column) { return column.COL_CD.toUpperCase() == reColumn.id.toUpperCase() }).TITLE);
                    thisObj.setFormBuilder({ type: "general", contents: batchSetup, index: i });//default 기본
                    thisObj.setFormBuilder({ type: "font", contents: batchSetup, index: i });//font 글꼴
                    thisObj.setFormBuilder({ type: "align", contents: batchSetup, index: i });//align 정렬               
                    if (detail.Key.FORM_TYPE != "GP040")
                        thisObj.setFormBuilder({ type: "displayForm", contents: batchSetup, index: i });//display form 표시형태
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
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        //.setOptions({ignorePrimaryButton : true});
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) { },

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
            else if (!$.isNull(this.contents.getControl("displayPeriodType__0")))
                this.contents.getControl("displayPeriodType__0").setFocus(0);
            else if (!$.isNull(this.contents.getControl("customFor_ColEssentialYn__0")))
                this.contents.getControl("customFor_ColEssentialYn__0").setFocus(0);
        }

        if (this.FORM_TYPE == "AO080") {
            if (!$.isNull(this.contents.getControl("headSize__0")))
                this.contents.getControl("headSize__0").setFocus(0);

            if (!$.isNull(this.contents.getControl("numSort__0")))
                this.contents.getControl("numSort__0").setReadOnly(true);

            if (!$.isNull(this.contents.getControl("numSort__1")))
                this.contents.getControl("numSort__1").setReadOnly(true);

            if (!$.isNull(this.contents.getControl("numSort__2")))
                this.contents.getControl("numSort__2").setReadOnly(true);

            if (!$.isNull(this.contents.getControl("numSort__3")))
                this.contents.getControl("numSort__3").setReadOnly(true);
        }
    },

    onPopupHandler: function (control, config, handler) {

        switch (control.id.toUpperCase()) {
            case "EMP_CD":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    saleCheckValue: "1",
                    isNewDisplayFlag: false,
                });
                break;
            case "PJT_CD":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    isNewDisplayFlag: false,
                    isOthersDataFlag: "N",
                    searchCategoryFlag: "S",
                });
                break;
            case "WH_CD":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    isNewDisplayFlag: false,
                    searchCategoryFlag: "A",
                });
                break;
            case "CUST":
                $.extend(config, {        //default settings
                    width: 0,
                    height: 0,
                    additional: false,
                    //기본
                    IO_TYPE: "10",
                    popupType: false,
                    isInputLayer: true,
                    CustEmpType: "10",
                    //FilterCustGubun: "102",
                    EmpFlag: "N",
                    isNewDisplayFlag: false,
                    CallType: "102",
                    MenuType: "",
                    //bal_chk: this.sale006Detail ? this.sale006Detail.BAL_CHK_SALE : "0",
                    //stock_date: Date.format("yyyyMMdd", this.pageOption.receivaledBaseDate),
                    //sdate: this.getControlDate("yyyyMMdd"),
                    CustInfo: "Y",
                    //FormGubun: "SF030",
                    TransactionType: "Y",
                });
                break;
        }
        handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
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
        }
        parameter.PARAM = keyword;
        handler(parameter);

    },



    onMessageHandler: function (page, message) {
        var thisObj = this;

        switch (page.pageID) {
            case "CM100P_05":
                debugger;
                var calcResult = this.setCalcData.call(this, message.data[0].CALC_VALUE[0]);

                var messageIndex = message.data[0].INDEX;
                var ColCd = thisObj.formInfo.FormOutSetDetails[messageIndex].COL_CD;

                if (this.FORM_TYPE == "GO040" && ColCd == "ADD1") {
                    this.isCalcFormula = false;
                    this.isCalcFormulaMaria = false;
                } else if (this.FORM_TYPE == "GO040" && ColCd == "ADD2") {
                    this.isCalcFormula = false;
                    this.isCalcFormulaMaria = true;
                }

                this.contents.getControl("calcGubun__" + messageIndex).setValue(message.data[0].CALC_GUBUN);
                this.contents.getControl("calcDesc__" + messageIndex).setValue(message.data[0].CALC_DESC.replace("ㆍANDㆍ", "ㆍ AND ㆍ").replace("ㆍORㆍ", "ㆍ OR ㆍ"));
                this.contents.getControl("calcOrder__" + messageIndex).setValue(message.data[0].CALC_ORDER);

                //전표용
                var formColumn = thisObj.getFormInfoByIndex({ index: messageIndex }).FormColumn;
                var colType = formColumn.COL_TYPE.toString();
                if (colType.length > 1 && ["1", "2"].contains(colType.substring(0, 1))) {
                } else {
                    debugger;
                    this.contents.getControl("selectColCd__" + messageIndex).setValue(thisObj.getSelectColCd(message.data[0].CALC_DESC, message.data[0].CALC_GUBUN));
                }

                //--message.data[0].CALC_VALUE[0][0].label + 'ㆍ' + message.data[0].CALC_VALUE[0][1].label + 'ㆍ' +  message.data[0].CALC_VALUE[0][2].label + '§'
                var userColCd = "";
                message.data[0].CALC_VALUE.forEach(function (formula, i) {
                    userColCd += ((i > 0) ? "§" : "");
                    formula.forEach(function (item, j) {
                        if (j > 0)
                            userColCd += "ㆍ";

                        switch (item.type.toString()) {
                            case "3":
                                userColCd += item.label.split("").join("ㆍ");
                                break;
                            case "4":
                                userColCd += " " + item.label + " ";
                                break;
                            default:
                                userColCd += item.label;
                                break;
                        }
                    });
                });
                this.contents.getControl("userColCd__" + messageIndex).setValue(userColCd);
                if ($.isEmpty(message.data[0].CALC_GUBUN)) {
                    this.contents.getControl("settingCalcFormula__" + messageIndex).removeClass('btn-warning');
                } else {
                    this.contents.getControl("settingCalcFormula__" + messageIndex).addClass('btn-warning');
                }

                message.callback && message.callback();
                break;
            case "CM100P_45":
                //Domestic 내자
                this.contents.getControl("defaultCalcInVal").setValue(message.DOMESTIC_VAL);
                this.contents.getControl("defaultCalcInOpenVal").setValue(message.DOMESTIC_DES);
                //Foreign 외자
                this.contents.getControl("defaultCalcOutVal").setValue(message.FOREIGN_VAL);
                this.contents.getControl("defaultCalcOutOpenVal").setValue(message.FOREIGN_DES);

                if ($.isEmpty(message.DOMESTIC_VAL) && $.isEmpty(message.DOMESTIC_DES)
                    && $.isEmpty(message.FOREIGN_VAL) && $.isEmpty(message.FOREIGN_DES)) {
                    this.contents.getControl("setting2Formula").removeClass('btn-warning');
                } else {
                    this.contents.getControl("setting2Formula").removeClass('btn-warning');
                    this.contents.getControl("setting2Formula").addClass('btn-warning');
                }
                this.contents.getControl("setting2Formula").setFocus(0);
                break;
            case "CM100P_12":
                //set value from Balance popup 잔액표기 넘겨 받은 값 할당.
                this.contents.getControl("custBalanceType").setValue(message.BALANCE_TYPE);
                if (message.BALANCE_TYPE > 0){
                    this.contents.getControl("settingBalance").removeClass('btn-warning');
                    this.contents.getControl("settingBalance").addClass('btn-warning');
                }else{
                    this.contents.getControl("settingBalance").removeClass('btn-warning');
                }
                this.contents.getControl("settingBalance").setFocus(0);
                break;
            case "CM104P":
                this.contents.getControl("defaultVal").setValue(message.data.TXT);
                break;
            case "CM100P_49":
                if (!$.isNull(message.type) && message.type == "getforminfo") {
                    message.callback && message.callback(
                       thisObj.formInfo
                        );
                    return;
                }
                //this.formInfo.FormOutSetDetail.SCP_DEFAULTS_PRIORITY = message.scpDefaultsPriority;
                break;
        }
        message.callback && message.callback();
    },

    onFocusOutHandler: function (event) {
        //move next focus 다음 폼으로 이동
        var forms = this.contents.getForm();
        if (forms.length > 0)
        {
            if (event.__self == this.contents.getForm()[forms.length-1]){
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
            case "colType":                
                 thisObj.contents.getForm().forEach(function (formitem, j) {
                     if (!$.isNull(thisObj.contents.getControl("zeroCheckYn__" + selfIndex))){                       
                          if (formitem.getControl("zeroCheckYn__" + selfIndex)) {                        
                             formitem.setTitle("zeroCheckYn__" + selfIndex, thisObj.decimalHash.get(thisObj.contents.getControl("colType__" + selfIndex).getValue()));
                         }
                     }
                 });
                 var formColumn = thisObj.getFormInfoByIndex({ index: selfIndex }).FormColumn;
                 var colType = formColumn.COL_TYPE.toString();
                 if (formColumn.IS_FORMULA_SETTABLE && colType.length > 1 && ["1", "2"].contains(colType.substring(0, 1))) {
                     var ctlSettingCalcFormula = this.contents.getControl("settingCalcFormula__" + selfIndex);
                     if (["19", "29"].contains(selfControl.getValue())) {
                         ecmodule.common.formHelper.setShowControls(this, [ctlSettingCalcFormula]);
                     } else {
                         ecmodule.common.formHelper.setHideControls(this, [ctlSettingCalcFormula]);
                     }
                 }
                break;
        }
    },

    getZeroCheckYnTitle: function () {
        var thisObj = this;
        var decimalPoint = 0;
        var result = "";
        if (thisObj.COL_CD != null && thisObj.formInfo.FormColumns.find(function (column) { return column.COL_CD.toUpperCase() == thisObj.COL_CD.toUpperCase() }) != undefined) {
            switch (thisObj.formInfo.FormColumns.find(function (column) { return column.COL_CD.toUpperCase() == thisObj.COL_CD.toUpperCase() }).DECIMAL_TYPE || "X") {
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
    onContentsSettingBalance: function () {
        var param = {
            width: 600,
            height: 400,
            modal: true,
            BALANCE_TYPE: this.contents.getControl("custBalanceType").getValue()
        };
        // Open popup
        this.openWindow({
            url: "/ECERP/Popup.Common/CM100P_12",
            name: "",
            param: param,
            popupType: false,
            additional: false
        });
    },

    /// PIC,W/H ,Project Priority 담당,창고,프로젝트 우선순위
    onContentsSettingScpDefaultsPriority: function () {
        var param = {
            width: 400,
            height: 300,
            modal: true,
            FORM_TYPE: this.FORM_TYPE,
            COL_CD: this.COL_CD,
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

    //setting button 설정버튼
    onContentsSettingSubProd: function () {
        var param = {
            width: 1200,
            height: 800,
            modal: true,
            FORM_TYPE: this.FORM_TYPE.replace("SI", "SD")
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

    //Apply 적용 버튼
    onFooterApply: function () {
        var thisObj = this;
        //check validate 유효성 체크
        var errcnt = this.validateNow().length;
        if(errcnt == 0)
            errcnt = this.contents.validate().merge().length;

        // check valid  유효성 체크
        thisObj.commonForm.getWidgetHelper().getCheckKeys().forEach(function (key, j) {
            //call check function 호출 매핑 펑션
            var aryKey = key.split("__");
            errcnt = thisObj.commonForm.getWidgetHelper().getCheckWedgets().get(aryKey[0])({ errcnt: errcnt, index: aryKey[1], formInfo: thisObj.getFormInfoByIndex({ index: aryKey[1] }) });
        });
        if (errcnt == 0) {
            thisObj.commonForm.getWidgetHelper().getMappingKeys().forEach(function (key, j) {
                //call mapping function 호출 매핑 펑션
                var aryKey = key.split("__");
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get(aryKey[0])({ index: aryKey[1], formInfo: thisObj.getFormInfoByIndex({ index: aryKey[1] }) });
            });
            var rowData = this.formInfo;
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
    onFunctionFrequentlyUsedPhrases: function (e) {
        var thisObj = this;
        var param = {
            height: 550,
            width: 450,
            FORM_TYPE: thisObj.FORM_TYPE,
            COL_CD: thisObj.COL_CD
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
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterApply();
    },


    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    onSettingCalcFormula: function (event) {
        
        var thisObj = this;
        var selfId;
        var selfIndex;
        var aryKey = event.cid.split("__");
        if (aryKey.length > 1) {
            selfId = aryKey[0];
            selfIndex = aryKey[1];
        }
        var colCd = thisObj.formInfo.columns[selfIndex].id;
        var defaultSetShowType = "";
        var column = this.formInfo.columns.find(function (column) { return column.id == colCd });
        if (column.length > 0)
            defaultSetShowType = column.defaultSetShowType

        var userAdd = new Array();
        thisObj.formInfoAll.FormOutSetDetails.forEach(function (detail) {
            if (detail.COL_CD != colCd && ["ADD1", "ADD2", "ADD3", "ADD4", "ADD5"].contains(detail.COL_CD)) {
                var col = thisObj.formInfo.FormOutColumns.find(function (column) { return column.COL_CD.toUpperCase() == detail.COL_CD.toUpperCase() });
                if (!$.isNull(col)) {
                    userAdd.push({ CALC_CD: String.format("{0}{1}{0}", col.COL_CD, ecount.delimiter), CALC_DES: col.TITLE });
                }
            }
        });

        //Formula 계산식
        popurl = "/ECERP/Popup.Common/CM100P_05";
        var colType = thisObj.formInfo.FormColumns.find(function (item) { return item.COL_CD.toUpperCase() == colCd.toUpperCase() }).COL_TYPE.toString();

        if (colType.length > 1 && ["1", "2"].contains(colType.substring(0, 1))) {
            param = {
                width: 780,
                height: 500,
                FORM_TYPE: this.FORM_TYPE,
                //F_TYPE: "",
                SHOW_TYPE: defaultSetShowType,
                LOCATION_TOP: false,
                CALC_TYPE: "",//(defaultSetShowType == "C") ? (colCd == "supply_amt" ? "S" : "V") : "",
                CALC_DESC: this.contents.getControl("calcDesc__" + selfIndex).getValue(),
                CALC_GUBUN: this.contents.getControl("calcGubun__" + selfIndex).getValue(),
                CALC_ORDER: this.contents.getControl("calcOrder__" + selfIndex).getValue(),
                CALC_PAGE: "CM100P_56_CUSTOM_DATE",
                IS_CALC_ONLY: true,
                IS_CALC_TYPE: false,
                IsUseExtendedMergeExpression: true,
                INDEX: selfIndex
            };
        } else if (this.FORM_TYPE == "GO040" && colType.length >= 1 && ["ADD1", "ADD2"].contains(colCd) && ["0"].contains(colType.substring(0, 1))) {
            this.isCalcFormula = false;
            param = {
                width: 780,
                height: 500,
                FORM_TYPE: colCd == "ADD1" ? "PO710" : "GO121", // (출퇴근/근태/일정현황) 근태, 일정
                //F_TYPE: "",
                SHOW_TYPE: defaultSetShowType,
                LOCATION_TOP: false,
                CALC_TYPE: "",//(defaultSetShowType == "C") ? (colCd == "supply_amt" ? "S" : "V") : "",
                CALC_DESC: this.contents.getControl("calcDesc__" + selfIndex).getValue(),
                CALC_GUBUN: this.contents.getControl("calcGubun__" + selfIndex).getValue(),
                CALC_ORDER: this.contents.getControl("calcOrder__" + selfIndex).getValue(),
                CALC_PAGE: colCd == "ADD1" ? "EPD020M" : "EGJ006M", //CM100P_56_EGM038R_TIME CM100P_56_EGM038R_SCHEDULE
                IS_CALC_ONLY: true,
                IS_CALC_TYPE: false,
                IsUseExtendedMergeExpression: true,
                INDEX: selfIndex
            };
        } else {
            var param = {
                width: 780,
                height: 500,
                FORM_TYPE: this.FORM_TYPE,
                //F_TYPE: "",
                SHOW_TYPE: defaultSetShowType,
                LOCATION_TOP: false,
                CALC_TYPE: "",//(defaultSetShowType == "C") ? (colCd == "supply_amt" ? "S" : "V") : "",
                CALC_DESC: this.contents.getControl("calcDesc__" + selfIndex).getValue(),
                CALC_GUBUN: this.contents.getControl("calcGubun__" + selfIndex).getValue(),
                CALC_ORDER: this.contents.getControl("calcOrder__" + selfIndex).getValue(),
                CALC_PAGE: "CM100P_56",
                IS_CALC_ONLY: (["R"].contains(thisObj.formInfo.FormSet.VIEW_TYPE)) ? true : false,
                IS_CALC_TYPE: true,
                USERADD: userAdd,
                //UserData: "",
                INDEX: selfIndex
            };
        }
        // Open popup
        this.openWindow({
            url: popurl,
            name: ecount.resource.LBL05360,
            param: param,
            popupType: false,
            additional: false
        });

    },



    //send data 데이터 적용
    sendRowData: function (control) {
        var idx = control.getValue();
        var rowData = "";//this.contents.getGrid().grid.getRowItem((idx - 1).toString());
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
            //.useBaseForm({ _isThShow: true, _isRowInCount: 1 })
            //.colgroup([{ width: ecount.config.user.LABEL_WIDTH }, { width: "" }])
            //hhy 수정
            //.css("table table-template-setup")
            .css("table-template-setup")
            .templateType("formset")
            .setOptions({ _isErrorBorderNone: true });
        

        var thisObj = this;
        var p = {
            ctrl: ctrl, ctrl2: ctrl2, ctrl3: ctrl3, ctrl4: ctrl4, ctrl5: ctrl5,
            ctrl6: ctrl6, ctrl7: ctrl7, ctrl8: ctrl8, ctrl9: ctrl9, ctrl10: ctrl10,
            form: form,
            index: x.index,
            formInfo: thisObj.getFormInfoByIndex({ index: x.index })
        };

        //상속된 디폴트쇼타입 가져오기
        var defaultSetShowType = p.formInfo.column.defaultSetShowType;
        
        switch (x.type) {
            case "general"://default 기본
                thisObj.commonForm.getWidgetHelper().add(["headTitleNm", "displayPeriodType"], p);//표시명
                if (defaultSetShowType == "C")
                    thisObj.commonForm.getWidgetHelper().add(["inputTitleNm"], p);
                
                thisObj.commonForm.getWidgetHelper().add(["numSort", "headSize"], p);
                if (form.getRowCount() > 0) {
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL00832));
                    x.contents.add(form);
                    //x.contents.add(hr1.add("hr"));
                }
                break;
            case "font"://font 글꼴
                if (defaultSetShowType != "F")//if it is not detail 상세가 아닌경우 
                    if (this.isScheduleFormType == false) {
                        thisObj.commonForm.getWidgetHelper().add(["font", "headFont", "fontStyle", "fontColor"], p);
                    }
                    else {
                        if (!['10', '11', '12', '13', '14', '15', '16'].contains(thisObj.formInfo.FormOutSet.DISP_UNIT)) {
                            thisObj.commonForm.getWidgetHelper().add(["font", "headFont", "fontStyle", "fontColor"], p);
                        }
                    }

                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL70558));//Font 글꼴  
                    x.contents.add(form);
                }
                break;
            case "align"://align 정렬

                if (this.isScheduleFormType == false) {
                    thisObj.commonForm.getWidgetHelper().add(["headPos", "valignType"], p);
                }
                else {
                    if (!['10', '11', '12', '13', '14', '15', '16'].contains(thisObj.formInfo.FormOutSet.DISP_UNIT)) {
                        thisObj.commonForm.getWidgetHelper().add(["headPos", "valignType"], p);
                    }
                }
                
                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL35589));//align 정렬
                    x.contents.add(form);
                }
                break;
            case "displayForm"://display form 표시형태
                 //decimal 소수점
                if (this.FORM_TYPE == "SO030" && !p.formInfo.FormColumn.COL_TYPE.startsWith('9') && !p.formInfo.FormColumn.COL_TYPE.startsWith('8'))   //.COL_DISPLAY_STATE != '8' && p.formInfo.FormColumn.COL_DISPLAY_STATE != '9')
                    thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn", "dispZero", "defaultSeparator", "thousandSeparator", "decimalSeparator", "subTotYn", "TotYn", "settingCalcFormula"], p);
                else if (this.FORM_TYPE == "GO121")
                {
                    thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn", "dispZero", "defaultSeparator", "thousandSeparator", "decimalSeparator", "subTotYn", "colDisplayState", "settingCalcFormula", "TodayTime", "CalcPeriod"], p);
                }
                else
                    thisObj.commonForm.getWidgetHelper().add(["colType", "zeroCheckYn", "dispZero", "defaultSeparator", "thousandSeparator", "decimalSeparator", "subTotYn", "TotYn", "colDisplayState", "settingCalcFormula", "TodayTime", "CalcPeriod"], p);

                if (["AO242", "AO243", "AO245", "AO670"].contains(this.FORM_TYPE)) {
                    thisObj.commonForm.getWidgetHelper().add(["periodDisplay"], p);
                }
                
                thisObj.commonForm.getWidgetHelper().add(["labelType", "displayColType"], p);
                if (form.getRowCount() > 0) {
                    x.contents.add(hr4.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL11071));//Display Form 표시형태 
                    x.contents.add(form);

                }
                break;
            default:
                break;
        }
    },

    


    setCalcData: function (data) {
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
                        //debugger;
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
                }
            }

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
                        //return_string += "ecount.calc.nullifchk("
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
            //var arrCalcs = ["ecount.calc.toFixedRound(", "ecount.calc.toFixedCeil(", "ecount.calc.toFixedFloor("];
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
        return {
            FormSet: thisObj.formInfo.FormSet,
            FormOutSet: thisObj.formInfo.FormOutSet,
            OtherDates: thisObj.formInfo.OtherDates, //other dates 다른 날짜 데이터
            FormColumn: thisObj.formInfo.FormColumns.find(function (item) { return item.COL_CD.toUpperCase() == colCd.toUpperCase() }),
            FormOutSetDetail: thisObj.formInfo.FormOutSetDetails.find(function (item) { return item.COL_CD.toUpperCase() == colCd.toUpperCase() }),
            FormOutColumn: thisObj.formInfo.FormOutColumns.find(function (item) { return item.COL_CD.toUpperCase() == colCd.toUpperCase() }),
            column: thisObj.formInfo.columns.find(function (item) { return item.id.toUpperCase() == colCd.toUpperCase() }),
        };
    },

    //sql 쿼리화
    getSelectColCd: function (strDes, strCalcList) {   //function fn_SetSqlData(strDes, strCalcList){
        var arSql = strDes.split('§');
        var arCalinfo = strCalcList.split('§');

        var strSql = "";
        var arData = new Array();

        var ino = 0;

        if(arSql.length <= 3){
            if(arSql.length == 1)
                strSql = "{0}";
            else
                strSql = "case when {0} then {1} else {2} end ";
                
            for(var i = 0; i < arSql.length; i++){
                var strtmp = arSql[i].replace("trTrue", "True").replace("trFalse", "False").replace("trDefine", "Define").replace("trgroup", "group").split('^');
                if (this.isCalcFormula)
                    arData[i] = this.setCapsule(strtmp[2].split('ㆍ'), arCalinfo[i].split('ㆍ'));
                else {
                    debugger;
                    arData[i] = this.setCapsuleString(strtmp[2].split('ㆍ'), arCalinfo[i].split('ㆍ'));
                }
            }
        }else{
            for(var i = 0; i < arSql.length; i++){
                var strtmp = arSql[i].replace("trTrue", "True").replace("trFalse", "False").replace("trDefine", "Define").replace("trgroup", "group").split('^');

                if (this.isCalcFormula)
                    arData[i] = this.setCapsule(strtmp[2].split('ㆍ'), arCalinfo[i].split('ㆍ'));
                else {
                    debugger;
                    arData[i] = this.setCapsuleString(strtmp[2].split('ㆍ'), arCalinfo[i].split('ㆍ'));
                }

                if(strtmp[0] == "default" || strtmp[0] == ""){
                    if(strtmp[1].indexOf("Define") > -1)
                        strSql = "case when {0} then True1 else False1 end";
                    else
                        strSql = strSql.replace(strtmp[1], "{" + i + "}");
                }else{
                    if(strtmp[1].indexOf("Define") > -1){
                        ino = parseInt(strtmp[1].replace("True","").replace("False","").replace("Define",""),0);
                        strSql = strSql.replace(strtmp[0], "case when {" + i + "} then True" + ino + " else False" + ino + " end ");
                    }else
                        strSql = strSql.replace(strtmp[1], "{" + i + "}");
                }
            }
        }
        
        arData.unshift(strSql);
        return String.format.apply(this, arData);
    },
    setCapsuleStringData: function (strRetdata, strData, separator) {
        if (!$.isEmpty(strRetdata) && !this.isCalcFormula) {
            strRetdata += separator + strData;
        } else {
            strRetdata += strData;
        }
        return strRetdata;
    },
    setCapsuleString: function (arData, arOrder) {
        debugger;

        var separator = "+";
        var strRetdata = "";
        var bchk = false;
        var icount = 0;

        if (this.isCalcFormulaMaria) {
            separator = ",";
        }

        for (var i = 0; i < arOrder.length; i++) {
            switch (arOrder[i]) {
                case "1":
                    if (this.isCalcFormulaMaria) {
                        var data = arData[i];
                        strRetdata = this.setCapsuleStringData(strRetdata, "IFNULL(" + data + ",\" \")", separator);
                    } else {
                        strRetdata = this.setCapsuleStringData(strRetdata, "ISNULL(CONVERT(NVARCHAR," + arData[i] + "),' ')", separator);
                    }
                    break;
                default: //9
                    var data = "'" + arData[i] + "'";
                    if (this.isCalcFormulaMaria) {
                        if (arData[i] == "\"") {
                            data = "\"\\\"\"";
                        }
                        if (arData[i] == "'") {
                            data = "\"\\'\"";
                        }
                    }
                    
                    strRetdata = this.setCapsuleStringData(strRetdata, data, separator);
                    break;
            }
        }
        if (this.isCalcFormulaMaria && arOrder.length > 1) {
            strRetdata = "CONCAT(" + strRetdata + ")";
        }
        return strRetdata;
    },
    //특정값 캡슐화
    setCapsule: function (arData, arOrder) {    //function fn_SetCapsule(arData, arOrder){
        
        var strRetdata = "";
        var bchk = false;
        var icount = 0;

        for (var i = 0; i < arOrder.length; i++){
            switch(arOrder[i]){
                case "1":
                    if (arData[i].toLowerCase().indexOf("isnull") == -1)
                        strRetdata += "isnull(" + arData[i].split(ecount.delimiter)[0] + ",0)";
                    else
                        strRetdata += arData[i].split(ecount.delimiter)[0];
                    break;
                case "4":
                    strRetdata += " " + arData[i] + " ";
                    break;
                case "7":
                    if(arData[i] == "ROUND("){
                        bchk = true;
                        icount++;
                        strRetdata += arData[i];
                    }
                    else
                        strRetdata += arData[i];
                    break;
                case "8":
                    if (arData[i] == "(" && bchk)
                        icount++;
                    else if (arData[i] == ")" && bchk){
                        icount--;

                        if(icount == 0){
                            strRetdata += ",0)";
                            bchk = false;
                        }
                    }
                    else
                        strRetdata += arData[i];
                    break;
                default:
                    strRetdata += arData[i];
                    break;
            }
        }
        debugger;
        if (strRetdata.indexOf("/") == -1) { // /가 있는지 체크 
            return_string = strRetdata; 
        } 
        else { 
            var j_t = strRetdata.split("/").length;  //  j_t = /갯수
	   
            for (var j_s=1; j_s < j_t; j_s++) {
                var taget_string2 = strRetdata.split("/");
                return_string = "";
                taget_string3 = "";

                for (var j_0=0; j_0 < taget_string2.length; j_0++) 
                {
                    if (j_0 < j_s) {
                        return_string += taget_string2[j_0] + "/";
                    } 
                    else 
                    {
                        taget_string3 += taget_string2[j_0];
                        if (j_0 != (taget_string2.length - 1)) {
                            taget_string3 += "/";
                        }					  
                    }			   
                } //for end 

                var numchk = 0;
                var j = 0;
                var nullif = "N";

                if (taget_string3.indexOf("(") != -1) { // /가 있는지 체크 
                    return_string += "isnull(nullif(";
                    nullif = "Y";
                }
                else{
                    //return_string += "(";
                    //var pattern = "/[(|)]/";
                    var pattern = /[)]/;
                    if (pattern.test(taget_string3))
                    {
                        return_string += "(";
                    }
                    else
                    {

                    }
                }
			
                for (var j_1=0; j_1 < taget_string3.length; j_1++) {
			   
                    switch(taget_string3.substr(j_1,1)) {
                        case "(":
                            j++;
                            return_string += taget_string3.substr(j_1,1);
                            break;
                        case ")":
                            j--;
                            if (j < 1) {
                                if(j == 0)
                                {
                                    return_string += taget_string3.substr(j_1,1) + ",0),1)" + taget_string3.substr(j_1 + 1,taget_string3.length);
                                }
                                else
                                {   
                                    if(nullif == "Y"){
                                        return_string +=  ",0),1))" + taget_string3.substr(j_1 + 1,taget_string3.length);
                                    }
                                    else
                                    {
                                        var pattern = /[)]/;
                                        if (pattern.test(taget_string3))
                                            return_string += ")";

                                        return_string += taget_string3.substr(j_1,taget_string3.length);
                                    }
                                }

                                j_1 = taget_string3.length;
                            } 
                            else {
                                return_string += taget_string3.substr(j_1,1);
                            }   
                            break;
                        case "=":
                        case "<":
                        case ">":
                        case "*":
                        case "-":
                        case "+":
                        case ",":
                            if (j < 1) {
                                if(nullif == "Y"){
                                    return_string += ",0),1)" + taget_string3.substr(j_1,taget_string3.length);
                                }
                                else
                                {
                                    var pattern = /[)]/;
                                    if (pattern.test(taget_string3))
                                        return_string += ")";
                                    return_string += taget_string3.substr(j_1,taget_string3.length);
                                }
                                j_1 = taget_string3.length;
                            }else{
                                return_string += taget_string3.substr(j_1,1);
                            }
                            break;
                        default :			   
                            return_string += taget_string3.substr(j_1,1);
                    }
                        
                    if(j_1 == taget_string3.length - 1){
                        var arleft = 0;
                        for(var i = 0 ;i < return_string.length ; i++){ //괄호체크
                            if(return_string.charAt(i) == "(")
                                arleft++;
                            if(return_string.charAt(i) == ")")
                                arleft--;
                        }

                        if(arleft > 0){
                            for(var i = 0; i < arleft; i++){
                                return_string += ")";
                            }
                        }
                    }
                }
                strRetdata = return_string;
            }

            strRetdata = return_string;
        }
        return strRetdata;
    },

    getMaxFOrmColSize: function (colSize, config) {
        return 1;
    },

    getTitleColumnWidth: function (colSize, config) {
        return 154;
    },
});
