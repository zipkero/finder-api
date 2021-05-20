window.__define_resource && __define_resource("LBL03552","LBL11083","LBL09092","LBL11075","LBL10621","LBL01743","LBL01593","LBL10622","LBL09235","BTN00069","BTN00008","MSG06026","MSG06025");
/***********************************************************************************
 1. Create Date : 2016.03.16
 2. Creator     : inho
 3. Description : self-customizing > form setting 
 4. Precaution  : 
 5. History     : 2020.01.07 (On Minh Thien) - A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
 6. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.formset", "CM100P_49", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    formInfo: null,

    scpDefaultItems: null, //PIC,W/H ,Project Priority List  담당,창고,프로젝트 우선순위 목록

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.scpDefaultItems = [
            ["", ecount.resource.LBL03552],//none 없음
            ["U", ecount.resource.LBL11083],//Default Code by User 사용자별기본코드 
            ["D", ecount.resource.LBL09092],//Designate Manually 직접지정 
            ["N", ecount.resource.LBL11075]//Recent Slips History 최신전표내역 
        ];
        this.registerDependencies("ecmodule.common.form");
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
            type: "getforminfo",
            colCd: this.COL_CD,
            callback: function (data) {
                this.formInfo = data;

                if (this.formInfo.FormColumn.DEFAULT_SET_SHOW_TYPE == "P3") {
                    this.scpDefaultItems = [
                                            ["", ecount.resource.LBL03552],//none 없음
                                            ["D", ecount.resource.LBL09092],//Designate Manually 직접지정 
                                            ["N", ecount.resource.LBL11075]//Recent Slips History 최신전표내역 
                    ];

                }
            }.bind(this)
        };
        this.sendMessage(this, message);
        var g = widget.generator,
              contents = g.contents(),
              toolbar = g.toolbar(),
              ctrl = g.control();

        header.notUsedBookmark()
            .setTitle(ecount.resource.LBL10621)
            .addContents(contents);
    },

    onInitContents: function (contents) {
        var thisObj = this;
        var defaultShowType = thisObj.formInfo.FormColumn.DEFAULT_SET_SHOW_TYPE;
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid(),
            form = g.form();

        var rowData = [];

        if (defaultShowType == "P3") {
            rowData = [{ 'order': 1, 'column': "" }, { 'order': 2, 'column': "" }];
        } else {
            rowData = [{ 'order': 1, 'column': "" }, { 'order': 2, 'column': "" }, { 'order': 3, 'column': "" }];
        }

        if (!$.isEmpty(thisObj.formInfo.FormOutSetDetail.SCP_DEFAULTS_PRIORITY)) {
            thisObj.formInfo.FormOutSetDetail.SCP_DEFAULTS_PRIORITY.split(ecount.delimiter).forEach(function (item, i) {
                rowData[i] = { 'order': i + 1, 'column': item };
            });
        }
        grid
            .setKeyColumn(['order'])
            .setEventFocusOnInit(true)
            .setEditable(true, defaultShowType == "P3" ? 2 : 3, 0)
            .setColumns([
                { propertyName: 'order', id: 'order', title: ecount.resource.LBL01743, width: "50", align: 'center' },
                { propertyName: 'column', id: 'column', title: ecount.resource.LBL01593, width: "", align: 'center' }
            ])
            .setCustomRowCell('column', this.setGridData.bind(this))
            .setRowData(rowData);
        switch (thisObj.formInfo.FormColumn.CONTROL_TYPE.toLowerCase()) {
            case "widget.code.project":
                toolbar.addLeft(ctrl.define("widget.code.project", "pjt_cd", "SCP_CD")
                        .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" })
                        .setOptions({ isOthersDataFlag: "N" })
                        .end());
                break;
            case "widget.code.pic":
                toolbar.addLeft(ctrl.define("widget.code.PIC", "emp_cd", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.code.wh":
                toolbar.addLeft(ctrl.define("widget.code.wh", "wh_cd", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.code.site":
                toolbar.addLeft(ctrl.define("widget.code.site", "site_cd", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.code.bankaccountinout":
                toolbar.addLeft(ctrl.define("widget.code.bankAccountInOut", "acct_no", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.combine.bankaccountout":

                toolbar.addLeft(ctrl.define("widget.code.bankAccountInOut", "acct_no_t", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.code.account":
                toolbar.addLeft(ctrl.define("widget.code.account", "cr_gye_code1", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.code.cust":
                toolbar.addLeft(ctrl.define("widget.code.cust", "cust", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.code.merchantaccount":
                toolbar.addLeft(ctrl.define("widget.code.merchantAccount", "card_corp1", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
            case "widget.code.importtracking":
                toolbar.addLeft(ctrl.define("widget.code.importTracking", "trade_code", "SCP_CD")
                    .addCode({ label: thisObj.formInfo.FormOutSetDetail.SCP_DES || "", value: thisObj.formInfo.FormOutSetDetail.SCP_CD || "" }).end());
                break;
        }
        // test progress 74619 : code 위젯을 레이어 팝업 크기에 맞추기 위해 수정.
        toolbar.wholeRow(true);
        contents.add(g.subTitle().title(ecount.resource.LBL10622))
                .add(form)
                .addGrid("dataGrid-" + thisObj.pageID, grid)
                .add(g.subTitle().title(ecount.resource.LBL09235).setId("subtitle2"))
                .add(toolbar);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onChangeControl: function (control, data) {
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
        var thisObj = this;
        var selectItems = new Array();
        if (!$.isEmpty(thisObj.formInfo.FormOutSetDetail.SCP_DEFAULTS_PRIORITY)) {
            thisObj.formInfo.FormOutSetDetail.SCP_DEFAULTS_PRIORITY.split(ecount.delimiter).forEach(function (item, i) {
                selectItems.push(item);
            });
        }
        if (selectItems.contains("D")) {
            thisObj.getWidgetControl().show();
            thisObj.contents.find(function (item) { return item.id == "subtitle2" })[0].show();
        } else {
            thisObj.getWidgetControl().hide();
            thisObj.contents.find(function (item) { return item.id == "subtitle2" })[0].hide();
        }
    },

    onPopupHandler: function (control, config, handler) {
        switch (control.id.toUpperCase()) {
            case "EMP_CD":
                if (this.FORM_TYPE == "AU810") {
                    $.extend(config, {
                        additional: false,
                        popupType: false,
                        accountCheckValue: "1",
                        isNewDisplayFlag: false,
                    });
                }
                else {
                    $.extend(config, {
                        additional: false,
                        popupType: false,
                        saleCheckValue: "1",
                        isNewDisplayFlag: false,
                    });

                }
                break;
            case "PJT_CD":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    isNewDisplayFlag: false,
                    isOthersDataFlag: "N",
                    searchCategoryFlag: "S",
                });

                if (this.FORM_TYPE.substring(0, 2) == "AU") {
                    config.searchCategoryFlag = "A";
                }

                if (this.FORM_TYPE == 'AU510') {
                    // Add button [New] for menu Import Expenses
                    config.isNewDisplayFlag = true;
                }

                break;
            case "WH_CD":
                //if ($.isEmpty(control.getValue())) {
                //    this.pageHidden.whVatRate = 0;
                //    this.pageHidden.isWhVatRate = false;
                //}

                $.extend(config, {
                    additional: false,
                    popupType: false,
                    isNewDisplayFlag: false,
                    searchCategoryFlag: "A",
                });

                if ((this.FORM_TYPE == "SU410" && this.COL_CD == "wh_cd_t") || (this.FORM_TYPE == "SU420" && this.COL_CD == "wh_cd_f")) {
                    config.FLAG = "1";
                }

                break;
            case "ACCT_NO_T":
            case "ACCT_NO":
                //조건에 따라 달라질 수 있음(calltype)
                $.extend(config, {
                    isIncludeInactive: false,
                    isCheckBoxDisplayFlag: false,
                    isApplyDisplayFlag: false,
                    BTNFALG: "N",
                    GUBUN: "ACCT",
                    CALLTYPE: 13,
                    GYECODE: "",
                    IOTYPE: "00",
                    ACCFLAG: "Y",
                    additional: false,
                    isInput: false,
                });
                if (this.FORM_TYPE == "AU350") {
                    if (this.COL_CD == "cust") {
                        config.CALLTYPE = 6;
                        config.GUBUN = "CASE92";
                    }
                    else {
                        config.CALLTYPE = 5;
                    }
                }
                else if (this.FORM_TYPE == "AU360") {
                    config.CALLTYPE = 11;
                } else if (this.FORM_TYPE == "AU370") {
                    if (this.COL_CD == 'cust')
                        config.CALLTYPE = 105;
                    else
                        config.CALLTYPE = 5;
                } else if (this.FORM_TYPE == "AU390") {
                    if (this.COL_CD == "cust") {
                        config.CALLTYPE = 6;
                        config.GUBUN = "CASE92";
                    }
                    else {
                        config.CALLTYPE = 5;
                    }
                }
                else if (this.FORM_TYPE == "AU380" || this.FORM_TYPE == "AU430" || this.FORM_TYPE == "AU440" || this.FORM_TYPE == "AU450" || this.FORM_TYPE == "AU470" || this.FORM_TYPE == "AU530" || this.FORM_TYPE == "AU540" || this.FORM_TYPE == "AU760") {
                    config.CALLTYPE = 5;
                }
                else if (this.FORM_TYPE == "AU400") {
                    if (this.COL_CD == 'cust')
                        config.CALLTYPE = 102;
                    else
                        config.CALLTYPE = 5;
                }
                else if (this.FORM_TYPE == "AU460") {
                    config.CALLTYPE = 103;
                    config.GYECODE = "102";
                    config.GUBUN = "CASE92";
                }
                else if (this.FORM_TYPE == "AU490" || this.FORM_TYPE == "AU850")
                    config.CALLTYPE = 17;
                else if (this.FORM_TYPE == "AU510")
                    config.CALLTYPE = 7;
                else if (this.FORM_TYPE == "AU520")
                    config.CALLTYPE = 9;
                break;
            case "SITE_CD":
                $.extend(config, {
                    additional: false,
                    popupType: false,
                    isNewDisplayFlag: false,
                    isOthersDataFlag: "N",
                    CHKFLAG: "S",
                });

                if (this.FORM_TYPE.substring(0, 2) == "AU") {
                    config.CHKFLAG = "A";
                }

                if (this.FORM_TYPE == 'AU510') {
                    // Add button [New] for menu Import Expenses
                    config.isNewDisplayFlag = true;
                }

                break;
            case "CUST":
                if (["AU420"].contains(this.FORM_TYPE)) {
                    $.extend(config, {
                        additional: false,
                        popupType: false,
                        width: 500,
                        height: 520,
                        IO_TYPE: "00",
                        EmpFlag: 'N',
                        ACC002_FLAG: 'Y',
                        isCardNoDisplayFlag: true,
                        FilterCustGubun: 106,
                        CHKFLAG: "A"
                    });
                }
                else if (["AU490", "AU850"].contains(this.FORM_TYPE)) {
                    config.IO_TYPE = "00";
                    config.ACC002_FLAG = "N";
                    config.isNewDisplayFlag = true;
                    config.GYE_CODE = "102";
                    config.CustInfo = "Y";
                    config.FilterCustGubun = 102;
                    config.isApplyDisplayFlag = false;
                    config.isCheckBoxDisplayFlag = false;
                    config.isIncludeInactive = false;
                    config.isNewDisplayFlag = true;
                    config.unUseAutoResize = true;
                }
                break;
            case "CARD_CORP1":
                config.CALL_TYPE = 0;               // Set config for merchant account
                config.GYE_CODE = "00";
                config.PROD_SEARCH = "9";
                config.keyword = "";
                config.isApplyDisplayFlag = false;
                config.isIncludeInactive = false;
                if (this.FORM_TYPE == "AU470") {
                    // Set config for card no.
                    config.CALL_TYPE = 108;
                    config.GYE_CODE = "102";
                }
                break;
            case "TRADE_CODE":
                config.ispopupCloseUse = true;
                config.isNewDisplayFlag = true;
                break;
        }
        control.controlType = "widget.code.bankAccountInOut";
        handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id.toUpperCase()) {
            case "WH_CD":
                if ((this.FORM_TYPE == "SU410" && this.COL_CD == "wh_cd_t") || (this.FORM_TYPE == "SU420" && this.COL_CD == "wh_cd_f")) {
                    parameter.FLAG = "1";
                    parameter.DEL_FLAG = "N";
                } else {
                    parameter.FLAG = "3";
                    parameter.DEL_FLAG = "N";
                }
                break;
            case "EMP_CD":
                if (this.FORM_TYPE == "AU810")
                    parameter.ACCT_CHK = "1";
                else
                    parameter.SALE_CHK2 = "1";

                break;
            case "PJT_CD":
                parameter.CHK_FLAG = "S";
                parameter.isOthersDataFlag = "N";

                if (this.FORM_TYPE.substring(0, 2) == "AU") {
                    parameter.CHK_FLAG = "A";
                }
                break;
                //메뉴마다 다름(calltype)  Each menu is different type > call_type
            case "ACCT_NO_T":
            case "ACCT_NO":
                parameter.DEL_FLAG = "N";
                parameter.GYE_CODE = "";
                parameter.IO_TYPE = "00";
                parameter.EMP_FLAG = "N";
                parameter.ACC002_FLAG = "Y";
                parameter.PROD_SEARCH = "9";
                parameter.CALL_TYPE = 13;
                if (this.FORM_TYPE == "AU350") {
                    if (this.COL_CD == "cust") {
                        parameter.CALL_TYPE = 6;
                        parameter.GUBUN = "CASE92";
                    }
                    else {
                        parameter.CALL_TYPE = 5;
                    }
                } else if (this.FORM_TYPE == "AU360") {
                    // Set for from customer
                    parameter.CALL_TYPE = 11;
                } else if (this.FORM_TYPE == "AU370") {
                    if (this.COL_CD == 'cust')
                        parameter.CALL_TYPE = 105;
                    else
                        parameter.CALL_TYPE = 5;
                } else if (this.FORM_TYPE == "AU390") {
                    // set for [from employee] and [cash in - other]
                    if (this.COL_CD == "cust") {
                        parameter.CALL_TYPE = 6;
                        parameter.GUBUN = "CASE92";
                    }
                    else {
                        parameter.CALL_TYPE = 5;
                    }
                } else if (this.FORM_TYPE == "AU380" || this.FORM_TYPE == "AU430" || this.FORM_TYPE == "AU440" || this.FORM_TYPE == "AU450" || this.FORM_TYPE == "AU470" || this.FORM_TYPE == "AU530" || this.FORM_TYPE == "AU540" || this.FORM_TYPE == "AU760") {
                    // FORM_TYPE [AU440 - From Merchant Account], [AU430 Credit card receip], [AU380 - Other], [AU450 - By Receipt]
                    parameter.CALL_TYPE = 5;
                }
                else if (this.FORM_TYPE == "AU460") {
                    parameter.CALL_TYPE = 103;
                    parameter.GYE_CODE = "102";
                    parameter.GUBUN = "CASE92";
                }
                break;
            case "SITE_CD":
                parameter.CHK_FLAG = "S";
                parameter.isOthersDataFlag = "N";

                if (this.FORM_TYPE.substring(0, 2) == "AU") {
                    parameter.CHK_FLAG = "A";
                }


                break;
            case "CARD_CORP1":
                parameter.CALL_TYPE = 0;                // Set config for merchant account
                parameter.GYE_CODE = "00";
                parameter.PROD_SEARCH = "9";
                parameter.isApplyDisplayFlag = false;
                parameter.isIncludeInactive = false;
                if (this.FORM_TYPE == "AU470") {
                    // Set config for card no.
                    parameter.CALL_TYPE = 108;
                    parameter.GYE_CODE = "102";
                }
                break;
            case "CUST":
                if (["AU490", "AU850"].contains(this.FORM_TYPE)) {
                    parameter.isNewDisplayFlag = true;
                    parameter.GYE_CODE = "102";
                }
                break;
            case "TRADE_CODE":
                parameter.ispopupCloseUse = true;
                parameter.isNewDisplayFlag = true;
                break;
        }
        parameter.PARAM = keyword;
        handler(parameter);

    },

    onMessageHandler: function (page, message) {
        switch (page.controlID) {
            case "trade_code":
                this.contents.getControl("trade_code").addCode({ label: message.data.TRADE_NAME, value: message.data.TRADE_CODE })
                break;
        }
    },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onInitGridInitalize: function (cid, option) {
    },

    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().grid.setCellFocus("column", this.contents.getGrid().grid.getRowKeyByIndex(0));
    },


    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/


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

    //Apply 적용 버튼
    onFooterApply: function () {
        var thisObj = this;
        var grid = this.contents.getGrid().grid;
        var selectItems = new Array();
        var selectItemsJoin = "";
        var duplicatedScp = "";
        grid.getRowList().forEach(function (rowItem) {
            if (rowItem.COLUMN != "") {
                if (selectItems.contains(rowItem.COLUMN))
                    duplicatedScp = rowItem.COLUMN;

                selectItems.push(rowItem.COLUMN);
                selectItemsJoin = selectItemsJoin + ((selectItemsJoin == "") ? rowItem.COLUMN : ecount.delimiter + rowItem.COLUMN);
            }
        });
        if (selectItems.length == 0) {
            ecount.alert(ecount.resource.MSG06026);
        } else if (duplicatedScp != "") {
            var errCnt = 0;
            grid.getRowList().forEach(function (rowItem, index) {
                if (rowItem.COLUMN == duplicatedScp && errCnt == 0) {
                    grid.setCellShowError("column", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG06025 });
                    errCnt++;
                }
            });
        } else {
            thisObj.formInfo.FormOutSetDetail.SCP_CD = thisObj.getWidgetControl().getValue(0);
            thisObj.formInfo.FormOutSetDetail.SCP_DES = thisObj.getWidgetControl().getValue(1);
            thisObj.formInfo.FormOutSetDetail.SCP_DEFAULTS_PRIORITY = selectItemsJoin;
            var rowData = thisObj.formInfo;
            var message = {
                data: rowData,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
    },


    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },


    //포커스
    onFocusInControlHandler: function (event) {
        event = event || ecount.page.prototype._onFocusInControlHandler.apply(this, arguments);
    },

    onFocusOutControlHandler: function (control) {
    },

    //폼 마지막에서 엔터
    onFocusOutHandler: function (event) {
    },

    ON_KEY_ENTER: function (event, target) {
        if (target.cid == this.getWidgetControl().id) {
            this.footer.getControl("apply").setFocus(0);
        }
    },


    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    setGridData: function (value, rowItem) {
        var thisObj = this;
        var option = {};
        option.optionData = thisObj.scpDefaultItems;
        option.controlType = "widget.select";
        option.event = {
            'setNextFocus': function (event, gridData) {
                var rowcnt = this.contents.getGrid().grid.getRowCount() - 1;
                if (rowcnt == gridData.rowIdx) {
                    var selectItems = new Array();
                    this.contents.getGrid().grid.getRowList().forEach(function (item) {
                        if (item.COLUMN != "") {
                            selectItems.push(item.COLUMN);
                        }
                    });
                    if (selectItems.contains("D")) {
                        this.getWidgetControl().setFocus(0);
                    } else {
                        this.footer.getControl("apply").setFocus(0);
                    }
                }
            }.bind(this),
            'change': function (e, data) {
                var selectItems = new Array();
                var duplicatedScp = "";
                var grid = thisObj.contents.getGrid().grid;
                grid.getRowList().forEach(function (rowItem) {
                    if (rowItem.COLUMN != "") {
                        if (selectItems.contains(rowItem.COLUMN))
                            duplicatedScp = rowItem.COLUMN;

                        selectItems.push(rowItem.COLUMN);
                    }
                });

                if (selectItems.contains("D")) {
                    thisObj.getWidgetControl().show();
                    thisObj.contents.find(function (item) { return item.id == "subtitle2" })[0].show();
                } else {
                    thisObj.getWidgetControl().hide();
                    thisObj.contents.find(function (item) { return item.id == "subtitle2" })[0].hide();
                }

                grid.getRowList().forEach(function (rowItem, index) {
                    if (duplicatedScp != "" && rowItem.COLUMN == duplicatedScp && data.rowItem[ecount.grid.constValue.keyColumnPropertyName] == rowItem[ecount.grid.constValue.keyColumnPropertyName]) {
                        grid.setCellShowError("column", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG06025 });
                    }
                });


            }.bind(this)
        }
        return option;
    },


    getWidgetControl: function () {
        var thisObj = this;
        var thisCtl;

        switch (thisObj.formInfo.FormColumn.CONTROL_TYPE.toLowerCase()) {
            case "widget.code.project":
                thisCtl = thisObj.contents.getControl("pjt_cd")
                break;
            case "widget.code.pic":
                thisCtl = thisObj.contents.getControl("emp_cd")
                break;
            case "widget.code.wh":
                thisCtl = thisObj.contents.getControl("wh_cd")
                break;
            case "widget.code.site":
                thisCtl = thisObj.contents.getControl("site_cd")
                break;
            case "widget.code.bankaccountinout":
                thisCtl = thisObj.contents.getControl("acct_no")
                break;
            case "widget.code.account":
                thisCtl = thisObj.contents.getControl("cr_gye_code1")
                break;
            case "widget.code.cust":
                thisCtl = thisObj.contents.getControl("cust")
                break;
            case "widget.code.merchantaccount":
                thisCtl = thisObj.contents.getControl("card_corp1");
                break;
            case "widget.code.importtracking":
                thisCtl = thisObj.contents.getControl("trade_code");
                break;
            case "widget.combine.bankaccountout":
                thisCtl = thisObj.contents.getControl("acct_no_t");
                break;
        }
        return thisCtl;
    }

});
