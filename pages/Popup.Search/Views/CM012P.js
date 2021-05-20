window.__define_resource && __define_resource("LBL03692","LBL08832","LBL05654","MSG00913","LBL01751","LBL02865","LBL11905","LBL13071","LBL13047","LBL13048","BTN00118","LBL13049","BTN00069","BTN00033","BTN00008","MSG02407","LBL03701","MSG00141","MSG07865","LBL00541","MSG00078","MSG00076","LBL03764","MSG00894","BTN00815","LBL00478","LBL01310","MSG00895","MSG00150","BTN00339","LBL01083","BTN00168","LBL00597","LBL03760","LBL00778","LBL07908","LBL01418","LBL02451","LBL02452","LBL02453","LBL02460","LBL02472","LBL02476","LBL02477","MSG04553","LBL02481","LBL05651","LBL00329","LBL05718","LBL00540","BTN00568","LBL01356","MSG00881","MSG03965","MSG03449","MSG00884","MSG00919");
/****************************************************************************************************
1. Create Date : 2016.05.30
2. Creator     : 김대호
3. Description : 건별관리
4. Precaution  : 
5. History     : 2018.01.15(양미진) - 추가정보 컬럼 있고 추가항목탭 있을 경우 포커스 이동시 추가정보 팝업창 자동으로 나타나도록 추가 
               : 2018.01.31(LOC) - A16_02509_Dev790 일반전표 입력화면 추가 개선 요청
                 2020.01.07 (On Minh Thien) - A19_04630 - ecmodule 경로 변경 후속처리 요청
                 2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
6. Old File    : CM/CM012P.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM012P", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    tabChanged: null,
    tabData: null,
    codeTypeData: null,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this.pageOption = {
            AmountLength: ecount.common.getAmountLength(),
            errorMessage: {
                control: new Array(),
                grid: new Array()
            },
            slipsDetailsDocument: null,                     //세부내역 처리 모듈
            SaveFunctionInformation: null,                  //전표 저장 시 호출하는 함수(세부내역에서 전표를 저장시키는 case때문에, 호출되는 흐름을 관리)
            errors: null
        }

        this.pageData = {
            InvoicingTaxDetail: {
                TAX_NO: "",
                REMARKS: "",
                SETTLE_AMT1: 0, // $("#settle_amt1").val()
                SETTLE_AMT2: 0, // $("#settle_amt2").val()
                SETTLE_AMT3: 0, // $("#settle_amt3").val()
                SETTLE_AMT4: 0, // $("#settle_amt4").val()
                VAT_FLAG: null,
                P_DES1: "",
                P_DES2: "",
                P_DES3: "",
                P_DES4: "",
                P_DES5: "",
                P_DES6: "",
                Details: [$.extend({}, ecmodule.account.slipsDetails.model.taxInvoiceDetail)],
            },
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
        this.setAutoFocusOnTabPane = false;
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

        switch (cid) {
            //----------------------------
            // 부가세유형
            //----------------------------
            case "tax_gubun":
                control.initGeneratorOptions("taxType", ctrl.define("widget.select.taxType")
                    .select(this.IoType || "00")
                    .defaultOptions({ isAllAdd: false, isAdd: false, extra: [["00", ecount.resource.LBL03692]] })
                    .end());

                //------------------------
                // (세금)계산서구분
                //------------------------
                control.initGeneratorOptions("eTaxInvoiceType", ctrl.define("widget.select.eTaxInvoiceType")
                    .select(this.EcTaxFlag || "00")
                    .end());

                //------------------------
                // 예정누락분
                //------------------------
                control.initGeneratorOptions("taxDeduct", ctrl.define("widget.radio")
                    .label([ecount.resource.LBL08832, ecount.resource.LBL05654])
                    .value(["0", "1"])
                    .fixedSelect(this.TaxDeduct)
                    .end());

                //------------------------
                // 당초승인번호
                //------------------------
                control.initGeneratorOptions("orgIdIssue", ctrl.define("widget.input.general")
                    .hide()
                    .end());

                //------------------------
                // 승인번호/카드번호
                //------------------------
                var sTitle = "";
                var sNoControl = ctrl.define("widget.input.general")
                    .value(this.IoCardNo)
                    //.popover(ecount.resource.MSG00913.replace(/\n/g, "<br />"))
                    .maxLength(["26", "2I", "2G"].contains(this.IoType) ? 9 : 20);

                if (["26", "2G", "2I", "2L"].contains(this.IoType)) {
                    sTitle = ecount.resource.LBL01751;
                } else {
                    sTitle = ecount.resource.LBL02865;
                }

                sNoControl.setAddonTitle(sTitle);

                sNoControl.hasFn([{ id: "cardNo", label: ecount.resource.LBL11905 }], true);

                control.initGeneratorOptions("sNo", sNoControl.end());

                break;
        }
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

        // 카드매입내역
        if (this.IsFromCardActivity && this.IoType == "00" && !$.isEmpty(this.IoCustName)) {
            this.IoType = "27";
            this.IoCardNo = this.BankAccount;

            if (this.IoCardNo.length > 20) {
                this.IoCardNo = this.IoCardNo.substring(0, 20);
            }
        }

        // 추가항목
        if (this.IsShowAdditionalInfo) {
            tabContents
                .createActiveTab("addInfo", this.DefaultAdditionalInfo[0].ITEM_TYPE_NM) //추가항목
                .add(this.getAdditionalInfoLayout());

            tabData.push("addInfo");
        }

        // 관리번호증가
        if (this.IsShowCreateSubCodeForBankAccount || this.IsShowCreateSubCodeForAccount) {
            this.ActiveTab.equals("createSubCode") ? tabContents.createActiveTab("createSubCode", ecount.resource.LBL13047) : tabContents.createTab("createSubCode", ecount.resource.LBL13047);

            if (this.IsShowCreateSubCodeForBankAccount) {
                tabContents.add(this.getCreateSubCodeLayout(true));
            }

            if (this.IsShowCreateSubCodeForAccount) {
                tabContents.add(this.getCreateSubCodeLayout(false));
            }

            tabData.push("createSubCode");
        }

        // 관리번호감소
        if (this.IsShowAllocationForBankAccount || this.IsShowAllocationForAccount) {
            this.ActiveTab.equals("allocateList") ? tabContents.createActiveTab("allocateList", ecount.resource.LBL13048) : tabContents.createTab("allocateList", ecount.resource.LBL13048);

            if (this.IsShowAllocationForBankAccount) {
                tabContents
                    .add(this.getSubtitleLayout(true))
                    .add(this.getToolbarLayout(true))
                    .addGrid("bankAccountGrid", this.getAllocateTableLayout(true));
            }

            if (this.IsShowAllocationForAccount) {
                tabContents
                    .add(this.getSubtitleLayout(false))
                    .add(this.getToolbarLayout(false))
                    .addGrid("accountGrid", this.getAllocateTableLayout(false));
            }

            tabData.push("allocateList");
        }

        // 부가세정보
        if (this.IsShowTaxInvoice) {
            toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                .addLeft(ctrl.define("widget.button", "load").label(ecount.resource.BTN00118));

            this.ActiveTab.equals("taxInfo") ? tabContents.createActiveTab("taxInfo", ecount.resource.LBL13049) : tabContents.createTab("taxInfo", ecount.resource.LBL13049);

            tabContents.add(toolbar).add(this.getTaxInfoLayout());

            tabData.push("taxInfo");
        }

        contents.add(tabContents);
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
            case "IO_CUST":
                parameter.EmpFlag = "N";
                parameter.IoType = "00";
                parameter.CALL_TYPE = "101";
                if (this.JournalType && this.JournalType.equals("06")) {
                    parameter.ACC002_FLAG = "Y";
                    parameter.GYE_CODE = this.GyeCode;
                }
                else {
                    parameter.ACC002_FLAG = "N";
                }

                parameter.isApplyDisplayFlag = false;
                parameter.isCheckBoxDisplayFlag = false;
                parameter.isIncludeInactive = false;
                parameter.isNewDisplayFlag = true;
                parameter.unUseAutoResize = true;
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
    onChangeControl: function (event, data) {
        switch (event.cid) {
            case "taxType":
                this.changeIoType(this.getTaxGubunControl("taxType").getValue());
                break;
            case "pretax_amount":
                this.setVatAmtBySupplyAmt();
                break;
            case "item1":
            case "item2":
            case "item3":
                if (event.action == "removeCode") {
                    codeTypeData[event.cid] = null;
                }
                break;
        }
    },

    onChangeContentsTab: function (event) {
        this.ActiveTab = event.tabId;

        switch (this.ActiveTab) {
            case "taxInfo":
                if (!tabChanged) {
                    this.setTaxLayout();
                    tabChanged = true;
                }

                break;
            default:
                break;
        }
    },

    onGridRenderComplete: function (e) {
        if (this.IsShowAllocationForBankAccount) {
            this.pageGrid = this.contents.getGrid("bankAccountGrid", "allocateList").grid;
            this.setInitGridSetting();
            this.setInitGridTotal();
        }

        if (this.IsShowAllocationForAccount) {
            this.pageGrid = this.contents.getGrid("accountGrid", "allocateList").grid;
            this.setInitGridSetting();
            this.setInitGridTotal();
        }

        ecount.page.input.account.prototype.onGridRenderComplete.apply(this, arguments);
    },

    onLoadComplete: function (e) {
        if (this.ActiveTab.equals("taxInfo")) {
            this.setTaxLayout();
        }

        this.setInitTaxInvoiceDetail();

        if (this.IsValidationError)
            this.saveValidate();
        else
            this.setFirstFocus();
    },

    onPopupHandler: function (control, parameter, handler) {
        switch (control.id.toUpperCase()) {
            case "IO_CUST":
                parameter.EmpFlag = "N";
                parameter.IoType = "00";
                if (this.JournalType && this.JournalType.equals("06")) {
                    parameter.FilterCustGubun = "101";
                    parameter.ACC002_FLAG = "Y";
                    parameter.GyeCode = this.GyeCode;
                }
                else {
                    parameter.CALL_TYPE = "101";
                    parameter.ACC002_FLAG = "N";
                }

                parameter.isApplyDisplayFlag = false;
                parameter.isCheckBoxDisplayFlag = false;
                parameter.isIncludeInactive = false;
                parameter.isNewDisplayFlag = true;
                parameter.unUseAutoResize = true;
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

    onPreInitPopupHandler: function (self, keyword, config, data) {
        var _self = this;
        switch (self.id.toUpperCase()) {
            case "IO_CUST":
                if (data.length == 0) {
                    if (!this.contents.getControl("io_cust", "taxInfo")._enableDirectInput) {
                        this.contents.getControl("io_cust", "taxInfo").setEmpty();
                    }

                    if (["27", "2E", "2H", "2K"].contains(this.getTaxGubunControl("taxType").getValue()) && keyword.length != 10) {
                        this.pageOption.errors = new ecount.errorMessage({
                            contents: this.contents
                        });

                        this.pageOption.errors.addWidget({
                            id: "io_cust",
                            tab: "taxInfo",
                            message: ecount.resource.MSG02407
                        });

                        this.setTimeout(function () {
                            _self.pageOption.errors.show();
                        }, 10);

                        //this.setErrorMessage("io_cust", ecount.resource.MSG02407, "widget");
                        //this.setTimeout(function () {
                        //    _self.setShowErrorMessage();
                        //}, 10);
                    }
                }

                break;
        }
    },

    onMessageHandler: function (event, data) {
        if (["item1", "item2", "item3"].contains(event.controlID)) {
            codeTypeData[event.controlID] = data.data.SER_NO;
        }
        else {
            if (event.pageID == "CM012P_01") {
                this.etcdate = data.data.ETC_DATE1
            }
            else if (event.pageID == "EBD001P_01") {
                this.contents.getControl("pretax_amount", "taxInfo").setValue(data.data.PretaxAmount || 0);
                this.contents.getControl("tax_amount", "taxInfo").setValue(data.data.Tax || 0);

                data.callback && data.callback();
                this.contents.getControl("pretax_amount", "taxInfo").hideError();
                this.contents.getControl("tax_amount", "taxInfo").setFocus(0);
            }
        }

        switch (event.controlID) {

            case "CM022PoFCard":
                this.getTaxGubunControl("sNo").setValue(data.data.BUSINESS_NO);
                data.callback && data.callback();
                this.getTaxGubunControl("sNo").onNextFocus();
                break;
            default:
                break;
        }
    },

    //last focus (폼 마지막에서 엔터)
    onFocusOutHandler: function (event) {
        if (event.target == "contents") {
            this.footer.getControl('apply').setFocus(0);
        }
    },

    //onFunctionCardNo
    onFunctionCardNo: function () {
        var custControl = this.contents.getControl("io_cust");
        this.openWindow({
            url: '/ECERP/SVC/ESA/ESA001P', //구프레임웍에서 get으로만 받게해놔서
            name: ecount.resource.LBL03701,
            additional: this.pageOption.isAdditionalPopup,
            param: {
                width: 500,
                height: 520,
                IO_TYPE: "00",
                CustInfo: custControl.getValue(),
                EmpFlag: 'N',
                ACC002_FLAG: 'Y',
                isCardNoDisplayFlag: true,
                controlID: "CM022PoFCard",
                FilterCustGubun: 106
            },
            fpopupID: this.ecPageID
        });
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
        var self = this;

        if ((this.Permission == "U" && (this.EditFlag == "M" && this.GbType.equals("Y"))) || this.Permission == "R") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

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

            creatSubCode: {
                BankAccountSubCode: "",
                BankAccountEtcDate: "",
                AccountSubCode: "",
                AccountEtcDate: ""
            },

            bankAccountAllocate: [],

            accountAllocate: [],

            taxData: {
                IO_TYPE: '00',
                IO_DATE: '',
                IO_CUST: '',
                IO_CUST_NAME: '',
                IO_CARD_NO: '',
                ECTAX_FLAG: '',
                TAX_DEDUCT: '0',
                PRETAX_AMOUNT: 0,
                TAX_AMOUNT: 0,
                VAT_DES: ""
            },

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

    //공급가액 다시계산
    onFunctionCalcType: function () {
        var taxCodeData = this.getTaxGubunControl("taxType").getCodeData(),
            vatRate = new Decimal(taxCodeData.VAT_RATE);

        this.setCalculateThePretaxAmount({
            width: 400,
            height: 250,
            resource: ecount.resource.LBL00541,
            isPopup: false,
            supplyAmt: this.contents.getControl("pretax_amount", "taxInfo").getValue().toString(),
            vatRate: vatRate.toString()
        });
    },

    onFunctionCustClosureStatus: function () {
        debugger
        var custControl = this.contents.getControl("io_cust");
        if ($.isEmpty(custControl.getValue()) == true) {
            custControl.showError(ecount.resource.MSG00078);
            custControl.setFocus(0);
            return false;
        }

        var titleName = "Notice";

        this.openWindow({
            url: "/ECERP/ECTAX/NoticeClosureStatus",
            name: titleName,
            additional: this.pageOption.isAdditionalPopup,
            popupType: false,
            param: {
                width: 800,
                height: 500,
                isOpenPopup: true,
                BUSINESS_NO: custControl.getValue(),
                BUSINESS_NO_NAME: custControl.getValue(1),
            },

        });
    },

    //공급값액재걔산
    setCalculateThePretaxAmount: function (param) {
        var taxCodeData = this.getTaxGubunControl("taxType").getCodeData(),
            vatRate = new Decimal(taxCodeData.VAT_RATE || 0),
            supplyAmtTotal = new Decimal(this.contents.getControl("pretax_amount", "taxInfo").getValue() || 0),
            vatAmtTotal = new Decimal(this.contents.getControl("tax_amount", "taxInfo").getValue() || 0);

        this.openWindow({
            url: '/ECERP/SVC/EBD/EBD001P_01',
            name: ((param && param.resource) || "공급가액계산"),
            additional: this.pageOption.isAdditionalPopup,
            param: {
                width: 420,
                height: 310,
                Request: {
                    Data: {
                        TRX_DATE: this.TrxDate,
                        TRX_NO: this.TrxNo,
                        supplyAmt: supplyAmtTotal.toString(),
                        vatAmt: vatAmtTotal.toString(),
                        vatRate: vatRate.toString(),
                        isShowCalcType6: true,
                    }
                }
            }
        });
    },

    // 적용 버튼 클릭
    onFooterApply: function () {
        this.setSlipsDetailsReadyBySlips();
        this.pageOption.errorMessage.control = new Array();

        if ((this.Permission == "U" && (this.EditFlag == "M" && this.GbType.equals("Y"))) || this.Permission == "R") {
            ecount.alert(ecount.resource.MSG00141);
            this.footer.getControl("apply").setAllowClick();
            return false;
        }

        this.saveValidate();
    },

    //설정 버튼 클릭
    onFunctionSetting: function () {
        if ($.isEmpty(this.Cust)) {
            ecount.alert(ecount.resource.MSG00076);
            return;
        }

        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 280,
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

    // 번호 생성 버튼(계정)
    onFunctionNumCreate: function () {

        var strRNum;
        var value = this.contents.getControl("sub_code", "createSubCode").getValue();
        if ($.isEmpty(value) == false) {
            ecount.alert(ecount.resource.MSG00894, function () {
                this.contents.getControl("sub_code", "createSubCode").setFocus(0);
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
                this.contents.getControl("sub_code", "createSubCode").setValue(strRNum);
            }.bind(this)
        });

    },

    // 번호 생성 버튼(계좌의 계정)
    onFunctionAcctNumCreate: function () {
        var strRNum;
        var value = this.contents.getControl("acct_sub_code", "createSubCode").getValue();
        if ($.isEmpty(value) == false) {
            ecount.alert(ecount.resource.MSG00894, function () {
                this.contents.getControl("acct_sub_code", "createSubCode").setFocus(0);
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
                this.contents.getControl("acct_sub_code", "createSubCode").setValue(strRNum);
            }.bind(this)
        });

    },

    // 배부액 자동계산(계좌에 연결된 계정)
    onContentsAutoCalculateBankAccount: function () {
        var expAmt = new Decimal(this.ExpAmt || 0),
            billAmt1 = new Decimal(0),
            self = this;

        this.pageGrid = this.contents.getGrid("bankAccountGrid", "allocateList").grid;

        if (!expAmt.equals(new Decimal(0))) {
            this.pageGrid.getRowList().forEach(function (x, i) {

                billAmt1 = new Decimal(x.BILL_AMT1 || 0);

                if (!$.isEmpty(x.BILL_NO) && [0, 1].contains(billAmt1.comparedTo(new Decimal(0)))) {
                    if ([0, 1].contains(expAmt.comparedTo(billAmt1))) {
                        self.pageGrid.setCell("BILL_AMT2", i, billAmt1.toString());
                        expAmt = expAmt.minus(billAmt1);
                    }
                    else {
                        if (expAmt.comparedTo(billAmt1) == -1) {
                            self.pageGrid.setCell("BILL_AMT2", i, expAmt.toString());
                            expAmt = new Decimal(0);
                        }
                    }
                }
                else {
                    self.pageGrid.setCell("BILL_AMT2", i, new Decimal(0));
                }
            });
        }
    },

    // 배부액 자동계산(계정)
    onContentsAutoCalculate: function () {
        var expAmt = new Decimal(this.ExpAmt || 0),
            billAmt1 = new Decimal(0),
            self = this;

        this.pageGrid = this.contents.getGrid("accountGrid", "allocateList").grid;

        if (!expAmt.equals(new Decimal(0))) {
            this.pageGrid.getRowList().forEach(function (x, i) {

                billAmt1 = new Decimal(x.BILL_AMT1 || 0);

                if (!$.isEmpty(x.BILL_NO) && [0, 1].contains(billAmt1.comparedTo(new Decimal(0)))) {
                    if ([0, 1].contains(expAmt.comparedTo(billAmt1))) {
                        self.pageGrid.setCell("BILL_AMT2", i, billAmt1.toString());
                        expAmt = expAmt.minus(billAmt1);
                    }
                    else {
                        if (expAmt.comparedTo(billAmt1) == -1) {
                            self.pageGrid.setCell("BILL_AMT2", i, expAmt.toString());
                            expAmt = new Decimal(0);
                        }
                    }
                }
                else {
                    self.pageGrid.setCell("BILL_AMT2", i, new Decimal(0));
                }
            });
        }
    },

    //불러오기
    onContentsLoad: function () {
        if (this.getTaxGubunControl("taxType").getValue().equals("00")) {
            this.getTaxGubunControl("taxType").setValue("21");
            this.changeIoType("21");
        }

        var ioType = this.getTaxGubunControl("taxType").getValue();

        this.contents.getControl("io_date", "taxInfo").setDate(this.FormattedIoDate.toDate());

        if (this.getCustDirectInputByIoType(ioType)) {
            if ($.isEmpty(this.contents.getControl("io_cust", "taxInfo").getSelectedItem()[0].value) && $.isEmpty(this.contents.getControl("io_cust", "taxInfo").getSelectedItem()[0].label)) {
                if ($.isEmpty(this.Cust))
                    this.contents.getControl("io_cust", "taxInfo").setValue(1, this.CustDes);
                else
                    this.contents.getControl("io_cust", "taxInfo").addCode({ value: this.Cust, label: this.CustDes });
            }
            else {
                if ($.isEmpty(this.contents.getControl("io_cust", "taxInfo").getSelectedItem()[0].value))
                    this.contents.getControl("io_cust", "taxInfo").addCode({ value: this.Cust, label: this.CustDes });
            }
        }
        else {
            this.contents.getControl("io_cust", "taxInfo").addCode({ value: this.Cust, label: this.CustDes });
        }

        if (["20", "21"].contains(this.AcctFlag))
            this.getTaxGubunControl("sNo").setValue(this.BankAccount);
        else
            this.getTaxGubunControl("sNo").setValue(this.IoCardNo);

        if (this.ExpAmt != 0) {
            var vatRate = new Decimal(this.getTaxGubunControl("taxType").getCodeData().VAT_RATE || 0),
                expAmt2 = ecount.calc.toFixedVat((new Decimal(this.ExpAmt).div(vatRate.plus(1))).times(vatRate)),
                expAmt1 = new Decimal(this.ExpAmt).minus(expAmt2);

            if (vatRate.equals(new Decimal(0))) {
                this.contents.getControl("pretax_amount", "taxInfo").setValue(this.ExpAmt);
                this.contents.getControl("tax_amount", "taxInfo").setValue(0);
            }
            else {
                this.contents.getControl("pretax_amount", "taxInfo").setValue(expAmt1);
                this.contents.getControl("tax_amount", "taxInfo").setValue(expAmt2);
            }
        }
        else {
            this.contents.getControl("pretax_amount", "taxInfo").setValue(0);
            this.contents.getControl("tax_amount", "taxInfo").setValue(0);
        }

        this.getTaxGubunControl("taxType").setFocus(0);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F4
    ON_KEY_F4: function (e) {
        this.onContentsLoad();
        e.preventDefault();
    },

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
            case "addInfo":
                this.contents.getControl(this.FirstAddInfo).setFocus(0);
                break;
            case "createSubCode":
                if (this.IsShowCreateSubCodeForBankAccount)
                    this.contents.getControl("acct_sub_code").setFocus(0);
                else
                    this.contents.getControl("sub_code").setFocus(0);

                break;
            case "allocateList":
                if (this.IsShowAllocationForBankAccount)
                    this.contents.getGrid("bankAccountGrid", "allocateList").grid.setCellFocus("BILL_AMT2", "0");
                else
                    this.contents.getGrid("accountGrid", "allocateList").grid.setCellFocus("BILL_AMT2", "0");

                break;
            case "taxInfo":
                this.getTaxGubunControl("taxType").setFocus(0);
                break;
            default:
                break;
        }
    },

    // 거래처코드 직접입력여부 대상확인(By ioType)
    getCustDirectInputByIoType: function (ioType) {
        if (["26", "2I", "27", "2H", "2E", "2G", "2L", "2K"].contains(ioType)) {
            return true;
        }

        return false;
    },

    // Get Tax_gubun Child Widget
    getTaxGubunControl: function (id) {
        return this.contents.getControl("tax_gubun", "taxInfo").controlList[this.contents.getControl("tax_gubun", "taxInfo").controlIndex[id]];
    },

    //부가세 유형 변경에 따른 컨트롤 속성 변경
    changeIoType: function (ioType) {
        var pretaxAmount = new Decimal(this.contents.getControl("pretax_amount", "taxInfo").getValue() || 0),
            taxAmount = new Decimal(this.contents.getControl("tax_amount", "taxInfo").getValue() || 0),
            custDirectInput = this.getCustDirectInputByIoType(ioType),
            cardControl = this.getTaxGubunControl("sNo"),
            custControl = this.contents.getControl("io_cust", "taxInfo");


        if (["22", "23", "2A", "2B", "2D"].contains(ioType)) {
            this.contents.getControl("pretax_amount", "taxInfo").setValue(pretaxAmount.plus(taxAmount));
            this.contents.getControl("tax_amount", "taxInfo").setValue(0);
        }

        if (custDirectInput) {
            custControl.setEnableDirectInput(true);
            this.getTaxGubunControl("sNo").show();

            if (["26", "2I", "2G", "2L"].contains(ioType)) {
                cardControl.setMaxLength(9);
                this.getTaxGubunControl("sNo").changeAddonTitle(ecount.resource.LBL01751);
                cardControl.setValue(this.IoCardNo);
            }
            else {
                cardControl.setMaxLength(20);
                this.getTaxGubunControl("sNo").changeAddonTitle(ecount.resource.LBL02865);

                if (["20", "21"].contains(this.AcctFlag))
                    cardControl.setValue(this.BankAccount);
                else
                    cardControl.setValue(this.IoCardNo);
            }

            if (["27", "2E", "2H", "2K"].contains(ioType)) {
                cardControl.setFnbuttonDisableChange(false);
            }
            else {
                cardControl.setFnbuttonDisableChange(true);
            }
        }
        else {
            cardControl.setEmpty();
            //this.contents.hideRow("io_card_no");
            this.getTaxGubunControl("sNo").hide();

            if (custControl._enableDirectInput) {
                custControl.setEnableDirectInput(false);

                if (!$.isEmpty(custControl.getValue()))
                    custControl.openPopup(null, custControl.getValue(), "change");
            }
        }

        //--------------------------------
        // show taxdeduct(예정누락분 화면표시여부 설정)
        //--------------------------------
        var isShowTaxDeduct = ecmodule.account.common.isShowTaxDeduct({
            TYPE: "2",
            TAX_TYPE: ioType,
            USE_PREPAID_OMIT: ecount.config.nation.USE_PREPAID_OMIT
        });

        if (isShowTaxDeduct)
            this.getTaxGubunControl("taxDeduct").show();
        else
            this.getTaxGubunControl("taxDeduct").hide();

        if (["21", "22", "23", "24", "25", "28", "29", "2A", "2B", "2C", "2D", "2F", "2J"].contains(ioType)) {
            this.getTaxGubunControl("eTaxInvoiceType").show();
            this.getTaxGubunControl("eTaxInvoiceType").setValue(this.DefaultEcTaxFlag);

            if (ioType.equals("2F"))
                this.getTaxGubunControl("eTaxInvoiceType").setValue("00");
        }
        else {
            this.getTaxGubunControl("eTaxInvoiceType").hide();
            this.getTaxGubunControl("eTaxInvoiceType").setValue("00");
        }

        this.setVatAmtBySupplyAmt();
        this.getTaxGubunControl("taxType").setFocus(0);
    },

    // 공급가액 변경에 따른 부가세 계산처리
    setVatAmtBySupplyAmt: function () {
        var option = getOption.call(this);
        var result = ecmodule.account.common.calcVatAmt(option);

        if (result.IS_CHANGE) {
            this.contents.getControl("tax_amount", "taxInfo").setValue(result.VAT_AMT.toString());
        }

        function getOption() {
            var ioTypeControl = this.getTaxGubunControl("taxType");

            return {
                TAX_TYPE: ioTypeControl.getValue(),
                VAT_RATE: ioTypeControl.getValue().equals("00") ? 0.1 : ioTypeControl.getCodeData().VAT_RATE,
                VAT_CALC: ecount.config.company.VAT_CALC,
                DEC_AMT: ecount.config.company.DEC_AMT,
                SUPPLY_AMT: this.contents.getControl("pretax_amount", "taxInfo").getValue(),
            };
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

    // 툴바 레이아웃 셋팅
    getToolbarLayout: function (accountFlag) {
        var generator = widget.generator,
            ctrl = generator.control(),
            toolbar = generator.toolbar();

        toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", accountFlag ? "autoCalculateBankAccount" : "autoCalculate").label(ecount.resource.BTN00815));

        return toolbar;
    },

    // 서브타이틀 레이아웃 셋팅
    getSubtitleLayout: function (accountFlag) {
        var generator = widget.generator,
            subTitle = generator.subTitle();

        subTitle.title(String.format("{0}/{1}/{2}", accountFlag ? this.AcctGyeDes : this.GyeDes, this.CustDes, String.fastFormat(new Decimal(this.ExpAmt || 0), {
            fractionLimit: ecount.config.company.DEC_AMT,
            removeFractionIfZero: true
        })));

        return subTitle;
    },

    // 건별번호 생성 레이아웃 셋팅
    getCreateSubCodeLayout: function (accountFlag) {
        var generator = widget.generator,
            ctrl = generator.control(),
            form = generator.form(),
            toDay = this.viewBag.LocalTime.left(10).toDate(),
            self = this,
            controls = [],
            gyeDes, subCode, etcDate, gyeDesId, subCodeId, etcDateId, buttonId;

        if (accountFlag) {
            gyeDes = this.AcctGyeDes;
            subCode = this.AcctSubCode;
            etcDate = this.AcctEtcDate;
            gyeDesId = "acct_gye_des";
            subCodeId = "acct_sub_code";
            etcDateId = "acct_etc_date";
            buttonId = "AcctNumCreate";
        }
        else {
            gyeDes = this.GyeDes;
            subCode = this.SubCode;
            etcDate = this.EtcDate;
            gyeDesId = "gye_des";
            subCodeId = "sub_code";
            etcDateId = "etc_date";
            buttonId = "NumCreate";
        }

        if ($.isEmpty(etcDate)) {
            etcDate = toDay.format("yyyy-MM-dd");
        }

        if (etcDate.length == 8) {
            etcDate = etcDate.substring(0, 4) + "-" + etcDate.substring(4, 6) + "-" + etcDate.substring(6, 8);
        }

        form.useInputForm();

        controls.push(ctrl.define("widget.label", gyeDesId, gyeDesId, ecount.resource.LBL00478).label(gyeDes).end());

        controls.push(ctrl.define("widget.input.general", subCodeId, subCodeId, ecount.resource.LBL01310)
            .value(subCode)
            .popover(ecount.resource.MSG00895)
            //.dataRules(["required"], ecount.resource.MSG00150)
            .hasFn([{ id: buttonId, label: ecount.resource.BTN00339 }])
            .maxLength(20).end());

        controls.push(ctrl.define("widget.date", etcDateId, etcDateId, ecount.resource.LBL01083)
            //.hasFn([{ id: "setting", label: ecount.resource.BTN00168 }])
            //.setOptions({
            //    onCallbackBeforeCalendar: function () {
            //        self.resizeLayer((550 < ecount.infra.getPageWidthFromConfig()) ? ecount.infra.getPageWidthFromConfig() : 550, 370)
            //    }
            //})
            .select(etcDate).end());

        return form.addControls(controls);
    },

    // 건별 금액배부 레이아웃 셋팅
    getAllocateTableLayout: function (accountFlag) {
        var generator = widget.generator,
            grid = generator.grid(),
            self = this;

        grid
            .setColumns([
                { propertyName: 'BILL_NO', id: 'BILL_NO', title: ecount.resource.LBL00597, width: 100, align: "center", controlType: 'widget.label', dataType: '0' },
                { propertyName: 'SLIP_DATE', id: 'SLIP_DATE', title: ecount.resource.LBL03760, width: 100, align: "center", controlType: 'widget.label', dataType: '0' },
                { propertyName: 'ETC_DATE', id: 'ETC_DATE', title: ecount.resource.LBL01083, width: 100, align: "center", controlType: 'widget.label', dataType: '0' },
                {
                    propertyName: 'BILL_AMT1', id: 'BILL_AMT1', title: ecount.resource.LBL00778, width: 100, align: "right", controlType: 'widget.label',
                    dataType: '9' + ecount.config.company.DEC_AMT, isCheckZero: true,
                    controlOption: { decimalUnit: [ecount.common.number.amountLength + ecount.config.company.DEC_AMT, ecount.config.company.DEC_AMT] }
                },
                {
                    propertyName: 'BILL_AMT2', id: 'BILL_AMT2', title: ecount.resource.LBL07908, width: 100, align: "right", controlType: 'widget.input.number',
                    dataType: '9' + ecount.config.company.DEC_AMT, isCheckZero: true,
                    controlOption: { decimalUnit: [ecount.common.number.amountLength + ecount.config.company.DEC_AMT, ecount.config.company.DEC_AMT] }
                },
                {
                    propertyName: accountFlag ? 'REMARKS' : 'REMARKS2', id: accountFlag ? 'REMARKS' : 'REMARKS2', title: ecount.resource.LBL01418, width: "", align: "left", controlType: 'widget.input.general', dataType: '0',
                    controlOption: { maxLength: 400 }
                }
            ])
            .setRowData(accountFlag ? this.BankAccountAllocateList : this.AccountAllocateList)
            .setEventWidgetTriggerObj(this.events)
            .setEditable(true, 1, 0)
            .setEditRowMoveable(false)
            .setColumnFixHeader(true)
            .setCheckBoxUse(false)
            .setEventAutoAddRowOnLastRow(false)
            .setEditSpecialRowCount(1)
            .setStyleBorderRemoveLeftRight(false)
            .setEditableUseViewMode(ecount.config.user.IS_SLIP_INPUTTYPE_MOVE)
            .setCustomRowCell("SLIP_DATE", function (value, rowItem) {
                var option = {};
                option.data = !$.isEmpty(value) && value.length == 8 ?
                    Date.format(ecount.infra.getECDateFormat('date10', false, String.format("{0}-{1}-{2}", value.left(4), value.substring(4, 6), value.substring(6)).toDate())) : "";

                return option;
            })
            .setCustomRowCell("ETC_DATE", function (value, rowItem) {
                var option = {};
                option.data = !$.isEmpty(value) && value.length == 8 ?
                    Date.format(ecount.infra.getECDateFormat('date10', false, String.format("{0}-{1}-{2}", value.left(4), value.substring(4, 6), value.substring(6)).toDate())) : "";

                return option;
            })
            .setCustomRowCell("BILL_AMT2", function (value, rowItem) {
                var option = {};
                //self.pageGrid = accountFlag ? self.contents.getGrid("bankAccountGrid").grid : self.contents.getGrid("accountGrid").grid;
                option.event = {
                    change: function (e, data) {
                        self.setSyncGridTotal("BILL_AMT2", data.rowKey, data.newValue, data.oldValue);
                    }
                };

                return option;
            });

        return grid;
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

    // 부가세정보
    getTaxInfoLayout: function () {
        var generator = widget.generator,
            ctrl = generator.control(),
            form = generator.form(),
            controls = [];

        form.useInputForm();

        controls.push(ctrl.define("widget.combine.taxType", "tax_gubun", "tax_gubun", ecount.resource.LBL05651)
            .end());

        controls.push(ctrl.define("widget.date", "io_date", "io_date", ecount.resource.LBL03760)
            .select(this.FormattedIoDate).end());

        controls.push(ctrl.define("widget.code.cust", "io_cust", "io_cust", ecount.resource.LBL00329)
            .addCode(!this.IoType.equals("00") ? { value: $.isEmpty(this.IoCust) ? this.Cust : this.IoCust, label: this.IoCustName } : {})
            .enableDirectInput(this.getCustDirectInputByIoType(this.IoType))

            .hasFn(ecount.config.limited.feature.USE_CLOSING_BUSINESSNO_SEARCH ? [{ id: "custClosureStatus", label: ecount.resource.LBL05718 }] : false)
            .end());

        controls.push(ctrl.define("widget.input.general", "pretax_amount", "pretax_amount", ecount.resource.LBL00540)
            .value(!this.IoType.equals("00") ? this.ExpAmt1 : "")
            .numericOnly(this.pageOption.AmountLength[0], this.pageOption.AmountLength[1], ecount.resource.MSG04553)
            .hasFn([{ id: "calcType", label: ecount.resource.BTN00568 }])
            .end());

        controls.push(ctrl.define("widget.input.general", "tax_amount", "tax_amount", ecount.resource.LBL01356)
            .value(!this.IoType.equals("00") ? this.ExpAmt2 : "")
            .numericOnly(this.pageOption.AmountLength[0], this.pageOption.AmountLength[1], ecount.resource.MSG04553)
            .end());

        return form.addControls(controls);
    },

    // 합계행 스타일설정
    setInitGridSetting: function () {
        this.pageGrid.addCellClass("BILL_AMT1", "special-row-0", ["text-right", "text-bold"]);
        this.pageGrid.addCellClass("BILL_AMT2", "special-row-0", ["text-right", "text-bold"]);
    },

    // 합계초기설정
    setInitGridTotal: function () {
        var option = { isRunChange: false },
            billAmt1 = new Decimal(0),
            billAmt2 = new Decimal(0);

        this.pageGrid.getRowList().forEach(function (x) {
            billAmt1 = billAmt1.plus(x.BILL_AMT1 || 0);
            billAmt2 = billAmt2.plus(x.BILL_AMT2 || 0);
        });

        this.pageGrid.setCell("BILL_AMT1", "special-row-0", billAmt1.toString(), option);
        this.pageGrid.setCell("BILL_AMT2", "special-row-0", billAmt2.toString(), option);
    },

    // 금액변경에 따른 합계반영
    setSyncGridTotal: function (colCd, rowKey, newValue, oldValue) {
        var oldTotal = new Decimal(0);

        newValue = new Decimal(newValue || 0);
        oldValue = new Decimal(oldValue || 0);
        oldTotal = new Decimal(this.pageGrid.getCell(colCd, "special-row-0") || 0);

        this.pageGrid.setCell(colCd, "special-row-0", (oldTotal.minus(oldValue)).plus(newValue).toString(), { isRunChange: false });
    },

    //부가세 오차범위 유효성 검증(validate vat amt in error range)
    setValidateVatAmt: function () {
        var ioTypeControl = this.getTaxGubunControl("taxType").getCodeData();
        var vatLimit = ioTypeControl.VAT_LIMIT;
        // 부가세 제한값
        var fltVat_limit = new Decimal(($.isEmpty(vatLimit) || vatLimit.toString().toUpperCase() == "NULL") ? 0.00 : vatLimit);
        // 공급가액
        var fltAmt1_4limit = new Decimal(this.contents.getControl("pretax_amount", "taxInfo").getValue() || 0);
        // 부가세
        var fltVat2_4limit = new Decimal(this.contents.getControl("tax_amount", "taxInfo").getValue() || 0);
        // 부가세율(예:0.1)
        var fltVat_rate = new Decimal(ioTypeControl.VAT_RATE || 0);
        //소수점 자리
        var decimalAmt = ecount.config.company.DEC_AMT;
        //소수점 계산
        var intDEC_AMT = new Decimal(1);
        if (decimalAmt == '1')
            intDEC_AMT = new Decimal(10);
        else if (decimalAmt == '2')
            intDEC_AMT = new Decimal(100);

        var Calc = ecount.config.company.VAT_CALC;
        var fltgap;

        if (Calc == "R") { //반올림                
            fltgap = (new Decimal((fltAmt1_4limit.times(fltVat_rate)).times(intDEC_AMT).toFixed(0, 4)).div(intDEC_AMT)).minus(fltVat2_4limit);
        }
        else if (Calc == "C") { // 올림
            fltgap = (new Decimal((fltAmt1_4limit.times(fltVat_rate)).times(intDEC_AMT).toFixed(0, 0)).div(intDEC_AMT)).minus(fltVat2_4limit);
        }
        else { // 버림
            fltgap = (new Decimal((fltAmt1_4limit.times(fltVat_rate)).times(intDEC_AMT).toFixed(0, 1)).div(intDEC_AMT)).minus(fltVat2_4limit);
        }

        // 자바스크립트 소수점 마이너스 처리시 문제점 보완 처리.
        fltgap = (fltgap.plus(0.00000001)).times(100).round().div(100);
        if (fltgap.lt(0) == true)
            fltgap = fltgap.times(-1);

        //오차범위에 소수점 셋팅이 안되어 있는 경우는 소수점 체크 안해도 되는 경우이기 때문에 소수점 삭제
        if (new Decimal(fltVat_limit.toFixed(0, 1)).eq(fltVat_limit))
            fltgap = new Decimal(fltgap.toFixed(0, 1));

        //오차범위보다 크다면 메시지 처리
        if (fltVat_limit.lt(fltgap)) { //fltgap > fltVat_limit
            this.pageOption.errors.addWidget({
                id: "pretax_amount",
                tab: "taxInfo",
                message: ""
            });
        }

        return null;
    },

    saveValidate: function () {
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

            creatSubCode: {
                BankAccountSubCode: "",
                BankAccountEtcDate: "",
                AccountSubCode: "",
                AccountEtcDate: ""
            },

            bankAccountAllocate: [],

            accountAllocate: [],

            taxData: {
                IO_TYPE: '00',
                IO_DATE: '',
                IO_CUST: '',
                IO_CUST_NAME: '',
                IO_CARD_NO: '',
                ECTAX_FLAG: '',
                TAX_DEDUCT: '0',
                PRETAX_AMOUNT: 0,
                TAX_AMOUNT: 0,
                VAT_DES: ""
            },

            callback: this.close.bind(this)
        };

        var expAmt = new Decimal(this.ExpAmt),
            totalAmt = new Decimal(0),
            gridRowList,
            ctrlObj = null;

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
                    // 계좌에 연결된 계정의 건별번호 생성
                    if (this.IsShowCreateSubCodeForBankAccount) {
                        message.dataExists = true;
                        message.creatSubCode.BankAccountSubCode = this.contents.getControl("acct_sub_code", "createSubCode").getValue() || "";
                        message.creatSubCode.BankAccountEtcDate = this.getControlDate("acct_etc_date", "yyyyMMdd", "createSubCode") || "";
                    }

                    // 계정의 건별번호 생성
                    if (this.IsShowCreateSubCodeForAccount) {
                        message.dataExists = true;
                        message.creatSubCode.AccountSubCode = this.contents.getControl("sub_code", "createSubCode").getValue() || "";
                        message.creatSubCode.AccountEtcDate = this.getControlDate("etc_date", "yyyyMMdd", "createSubCode") || "";
                    }

                    break;
                case "allocateList":
                    var errAddFlag = false;

                    // 계좌에 연결된 계정의 건별 금액배부
                    if (this.IsShowAllocationForBankAccount) {
                        message.dataExists = true;
                        this.pageGrid = this.contents.getGrid("bankAccountGrid", "allocateList").grid;

                        if (!new Decimal(this.pageGrid.getCell("BILL_AMT2", "special-row-0") || 0).equals(new Decimal(0)) && !expAmt.equals(new Decimal(this.pageGrid.getCell("BILL_AMT2", "special-row-0") || 0))) {
                            this.pageOption.errors.addMessage({
                                tab: "allocateList",
                                message: ecount.resource.MSG00881
                            });

                            errAddFlag = true;
                        }

                        gridRowList = this.pageGrid.getRowList();

                        $.each(gridRowList, function (i, item) {
                            if (!$.isEmpty(item.BILL_NO) && !new Decimal(item.BILL_AMT2 || 0).equals(new Decimal(0))) {
                                totalAmt.plus(new Decimal(item.BILL_AMT2));

                                message.bankAccountAllocate.push({
                                    SUB_CODE: item.BILL_NO,
                                    ETC_DATE: item.ETC_DATE,
                                    AMT: item.BILL_AMT2,
                                    REMARKS: item.REMARKS
                                });
                            }
                        });

                        if (!totalAmt.equals(new Decimal(0)) && !expAmt.equals(totalAmt) && !errAddFlag) {
                            this.pageOption.errors.addMessage({
                                tab: "allocateList",
                                message: ecount.resource.MSG00881
                            });
                        }
                    }

                    // 계정의 건별 금액배부
                    if (this.IsShowAllocationForAccount) {
                        message.dataExists = true;
                        this.pageGrid = this.contents.getGrid("accountGrid", "allocateList").grid;

                        if (!new Decimal(this.pageGrid.getCell("BILL_AMT2", "special-row-0") || 0).equals(new Decimal(0)) && !expAmt.equals(new Decimal(this.pageGrid.getCell("BILL_AMT2", "special-row-0") || 0)) && !errAddFlag) {
                            this.pageOption.errors.addMessage({
                                tab: "allocateList",
                                message: ecount.resource.MSG00881
                            });
                        }

                        gridRowList = this.pageGrid.getRowList();
                        totalAmt = new Decimal(0);

                        $.each(gridRowList, function (i, item) {
                            if (!$.isEmpty(item.BILL_NO) && !new Decimal(item.BILL_AMT2 || 0).equals(new Decimal(0))) {
                                totalAmt.plus(new Decimal(item.BILL_AMT2));

                                message.accountAllocate.push({
                                    SUB_CODE: item.BILL_NO,
                                    ETC_DATE: item.ETC_DATE,
                                    AMT: item.BILL_AMT2,
                                    REMARKS: item.REMARKS2
                                });
                            }
                        });

                        if (!totalAmt.equals(new Decimal(0)) && !expAmt.equals(totalAmt) && !errAddFlag) {
                            this.pageOption.errors.addMessage({
                                tab: "allocateList",
                                message: ecount.resource.MSG00881
                            });
                        }
                    }
                    break;
                case "taxInfo":
                    message.dataExists = true;

                    var ioType = this.getTaxGubunControl("taxType").getValue(),
                        vatDes = this.getTaxGubunControl("taxType").getSelectedItem().label || "",
                        ioDate = this.getControlDate("io_date", "yyyyMMdd", "taxInfo"),
                        ioCust = this.contents.getControl("io_cust", "taxInfo").getSelectedItem()[0].value || "",
                        ioCustName = this.contents.getControl("io_cust", "taxInfo").getSelectedItem()[0].label || "";

                    if (ioType.equals("00") && !new Decimal(this.contents.getControl("pretax_amount", "taxInfo").getValue() || 0).equals(new Decimal(0))) {
                        this.pageOption.errors.addWidget({
                            id: "taxType",
                            tab: "taxInfo",
                            container: "tax_gubun",
                            message: ""
                        });
                    }

                    if (!ioType.equals("00")) {
                        var bChk,
                            limitDate = this.viewBag.ProgramInfo.LIMIT_DATE.left(10).toDate().format("yyyyMMdd"),
                            limitDateFormat = this.viewBag.ProgramInfo.LIMIT_DATE.left(10);

                        // 편집제한일자
                        if (ioDate < limitDate) {
                            this.pageOption.errors.addWidget({
                                id: "io_date",
                                tab: "taxInfo",
                                message: String.format(ecount.resource.MSG03965, ecount.infra.getECDateFormat('date10', false, limitDateFormat.toDate()))
                            });
                        }

                        if (["23", "2B", "2D"].contains(ioType) && ioDate < "20130401" && !this.getTaxGubunControl("eTaxInvoiceType").getValue().equals("00")) {
                            this.pageOption.errors.addWidget({
                                id: "sNoeTaxInvoiceType",
                                tab: "taxInfo",
                                container: "tax_gubun",
                                message: ecount.resource.MSG03449
                            });
                        }

                        if (!ioDate.left(4).equals(this.TrxDate.left(4))) {
                            this.pageOption.errors.addWidget({
                                id: "io_date",
                                tab: "taxInfo",
                                message: ecount.resource.MSG00884
                            });

                            this.pageOption.errors.show();
                        }

                        if (!["2X", "2Z"].contains(ioType) && ($.isEmpty(ioCust) || $.isEmpty(ioCustName))) {
                            this.pageOption.errors.addWidget({
                                id: "io_cust",
                                tab: "taxInfo",
                                message: ""
                            });
                        }
                        else {
                            if (["27", "2E", "2H", "2K"].contains(ioType)) {
                                if ($.isEmpty(this.getTaxGubunControl("sNo").getValue())) {
                                    this.pageOption.errors.addWidget({
                                        id: "sNo",
                                        tab: "taxInfo",
                                        container: "tax_gubun",
                                        message: ecount.resource.MSG00919
                                    });
                                }
                            }

                            bChk = ioCust.isContainsLimitedSpecial('code');

                            if (bChk.result) {
                                this.pageOption.errors.addWidget({
                                    id: "io_cust",
                                    tab: "taxInfo",
                                    message: ""
                                });
                            }

                            bChk = ioCustName.isContainsLimitedSpecial('name');

                            if (bChk.result) {
                                this.pageOption.errors.addWidget({
                                    id: "io_cust",
                                    tab: "taxInfo",
                                    message: ""
                                });
                            }
                        }

                        if (!$.isEmpty(this.getTaxGubunControl("sNo").getValue())) {
                            bChk = this.getTaxGubunControl("sNo").getValue().isContainsLimitedSpecial('name');

                            if (bChk.result) {
                                this.pageOption.errors.addWidget({
                                    id: "sNo",
                                    tab: "taxInfo",
                                    container: "tax_gubun",
                                    message: ""
                                });
                            }
                        }

                        if ($.isEmpty(this.contents.getControl("pretax_amount", "taxInfo").getValue())) {
                            this.pageOption.errors.addWidget({
                                id: "pretax_amount",
                                tab: "taxInfo",
                                message: ""
                            });
                        }

                        this.setValidateVatAmt();
                    }

                    message.taxData.IO_TYPE = ioType;
                    message.taxData.IO_DATE = ioDate;
                    message.taxData.IO_CUST = ioCust;
                    message.taxData.IO_CUST_NAME = ioCustName;
                    message.taxData.VAT_DES = vatDes;

                    break;
                default:
                    break;
            }
        }

        if (this.pageOption.errors.hasError()) {
            this.pageOption.errors.show();
            this.footer.getControl("apply").setAllowClick();
            return false;
        }
        else {
            this.save(message);
        }
    },

    // Save
    save: function (message) {
        this.pageOption.slipsDetailsDocument.saveData.call(this, {
            successCallback: function () {
                if (this.IsShowTaxInvoice) {
                    message.taxData.IO_CARD_NO = this.getTaxGubunControl("sNo").getValue() || "";
                    message.taxData.ECTAX_FLAG = this.getTaxGubunControl("eTaxInvoiceType").getValue() || "";
                    message.taxData.TAX_DEDUCT = this.getTaxGubunControl("taxDeduct").getValue() || "0";

                    message.taxData.PRETAX_AMOUNT = this.pageData.InvoicingTaxDetail.Details[0].SUPPLY_AMT.toString();
                    message.taxData.TAX_AMOUNT = this.pageData.InvoicingTaxDetail.Details[0].VAT_AMT.toString();
                }

                this.sendMessage(this, message);
            }.bind(this),
            failCallback: function () {
                this.footer.getControl("apply").setAllowClick();
                return;
            }.bind(this)
        });
    },

    // 세부내역설정
    setInitTaxInvoiceDetail: function () {
        this.setSlipsDetailsByInit.call(this);
        this.setSlipsDetailsByInitStatus.call(this);
    },

    //세부내역 페이지 초기화
    setSlipsDetailsByInit: function () {
        var formInformation,
            isAutometicInformation,
            slipsDetailsData;

        this.pageData.InvoicingTaxDetail.Details.SUPPLY_AMT = !this.IoType.equals("00") ? this.ExpAmt1 : 0;
        this.pageData.InvoicingTaxDetail.Details.VAT_AMT = !this.IoType.equals("00") ? this.ExpAmt2 : 0;

        isAutometicInformation = {
            IsFormSetting: {
                Master: true,
                Detail: true,
                Calc: true
            },
            IsSettleAmt: true
        }

        isUseFunctionInformation = {
            isUseSettle: ecount.config.nation.USE_SETTLE
        }

        slipsDetailsData = {
            Master: {
                TAX_NO: this.pageData.InvoicingTaxDetail.TAX_NO,
                SETTLE: "",
                REMARKS: this.pageData.InvoicingTaxDetail.REMARKS,
                SETTLE_AMT1: this.pageData.InvoicingTaxDetail.SETTLE_AMT1,
                SETTLE_AMT2: this.pageData.InvoicingTaxDetail.SETTLE_AMT2,
                SETTLE_AMT3: this.pageData.InvoicingTaxDetail.SETTLE_AMT3,
                SETTLE_AMT4: this.pageData.InvoicingTaxDetail.SETTLE_AMT4,
                P_DES1: this.pageData.InvoicingTaxDetail.P_DES1,
                P_DES2: this.pageData.InvoicingTaxDetail.P_DES2,
                P_DES3: this.pageData.InvoicingTaxDetail.P_DES3,
                P_DES4: this.pageData.InvoicingTaxDetail.P_DES4,
                P_DES5: this.pageData.InvoicingTaxDetail.P_DES5,
                P_DES6: this.pageData.InvoicingTaxDetail.P_DES6
            },
            Details: $.extend(true, [{}], this.pageData.InvoicingTaxDetail.Details)
        }

        this.pageOption.slipsDetailsDocument = ecmodule.account.slipsDetails.init({
            editFlag: "I",
            formInformation: formInformation,
            isAutometicInformation: isAutometicInformation,
            isUseFunctionInformation: isUseFunctionInformation,
            slipsDetailsData: slipsDetailsData
        });
    },

    //세부내역 페이지 초기화 시 동기화 설정
    setSlipsDetailsByInitStatus: function () {
        this.pageOption.slipsDetailsDocument.changeStatus('mmdd');
        this.pageOption.slipsDetailsDocument.changeStatus('supply_amt');
        this.pageOption.slipsDetailsDocument.changeStatus('vat_amt');
    },

    //전표에서의 저장 시, 세부내역 함수/옵션 정의
    setSlipsDetailsReadyBySlips: function () {
        this.pageOption.slipsDetailsDocument.saveDataReady('Slips', { //기본 전표저장 시 처리할 함수/옵션
            popupOpenOption: { //팝업옵션
                isAdditionalPopup: this.pageOption.isAdditionalPopup,
                isReloadDetail: 'Y',
                isShowApply: 'Y',
                isShowCheckBox: 'Y',
                taxTypeControl: (function () {
                    var returnObject = {
                        taxType: null,
                        vatRate: null
                    }
                    if (this.contents.getControl("tax_gubun", "taxInfo")) {
                        var taxTypeControl = this.contents.getControl("tax_gubun", "taxInfo")
                            .controlList
                            .first(function (x) {
                                return x.id == "taxType"
                            });

                        returnObject.taxType = taxTypeControl.getValue();
                        returnObject.vatRate = taxTypeControl.getCodeData().VAT_RATE;
                    }
                    return returnObject;
                }.bind(this)())
            },
            baseValidateOption: { //기본 공급가액/부가세 유효성체크 옵션
                supplyAmt: new Decimal((this.contents.getControl("pretax_amount", "taxInfo") && this.contents.getControl("pretax_amount", "taxInfo").getValue()) || 0), //세부내역 유효성체크를 위한 전표의 공급가액
                vatAmt: new Decimal((this.contents.getControl("tax_amount", "taxInfo") && this.contents.getControl("tax_amount", "taxInfo").getValue()) || 0), //세부내역 유효성체크를 위한 전표의 부가세
            },
            dataSyncOption: { //데이터동기화 옵션
                syncData: {
                    Date: this.contents.getControl("io_date", "taxInfo") ? this.contents.getControl("io_date", "taxInfo").getSMonth() + this.contents.getControl("io_date", "taxInfo").getSDay() : '', //월일
                    Supply_amt: new Decimal((this.contents.getControl("pretax_amount", "taxInfo") && this.contents.getControl("pretax_amount", "taxInfo").getValue()) || 0), //공급가액
                    Vat_amt: new Decimal((this.contents.getControl("tax_amount", "taxInfo") && this.contents.getControl("tax_amount", "taxInfo").getValue()) || 0), //부가세
                }
            },
            callbackOption: { //저장 시, 성공/실패에 따른 콜백옵션
                successCallback: function (successData) {
                    this.pageData.InvoicingTaxDetail = successData.Master; //유효성체크 성공 시 가공된 최종 데이터를 저장할 세부내역으로 Mapping(상단)
                    this.pageData.InvoicingTaxDetail.Details = successData.Details; //유효성체크 성공 시 가공된 최종 데이터를 저장할 세부내역으로 Mapping(하단)
                }.bind(this),
                failCallback: function () {
                    return;
                }.bind(this)
            }
        });
    },

    //전표에서의 저장
    slipsSave: function (callFunctionOption) {
        this.setSlipsDetailsReadyBySlips(); //세부내역 저장 시 전표에서 저장이라는 예약
        this.setCallFunction(callFunctionOption);
        this.saveCall();
    },

    //저장 시 이벤트 지정 함수
    setCallFunction: function (callFunctionOption) {
        this.pageOption.SaveFunctionInformation = { //세부내역 팝업에서의 저장 시, 호출되어야 하는 전표의 함수/옵션 정보
            callFunction: callFunctionOption.callFunction,
            callOption: callFunctionOption.callOption
        }
    },

    setTaxLayout: function () {
        if (!["21", "22", "23", "24", "25", "28", "29", "2A", "2B", "2C", "2D", "2F", "2J"].contains(this.IoType))
            this.getTaxGubunControl("eTaxInvoiceType").hide();

        var isShowTaxDeduct = ecmodule.account.common.isShowTaxDeduct({
            TYPE: "2",
            TAX_TYPE: this.IoType,
            USE_PREPAID_OMIT: ecount.config.nation.USE_PREPAID_OMIT
        });

        if (!isShowTaxDeduct)
            this.getTaxGubunControl("taxDeduct").hide();

        if (!this.getCustDirectInputByIoType(this.IoType)) {
            this.getTaxGubunControl("sNo").hide();
        }
        else {
            var cardControl = this.getTaxGubunControl("sNo");
            if (["27", "2E", "2H", "2K"].contains(this.IoType)) {
                cardControl.setFnbuttonDisableChange(false);
            }
            else {
                cardControl.setFnbuttonDisableChange(true);
            }
        }
    }
});
