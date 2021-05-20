window.__define_resource && __define_resource("LBL01605","LBL02176","MSG01397","LBL01419","LBL02763","LBL01894","BTN00037","BTN00525","LBL03372","LBL02042","LBL02159","LBL02982","LBL00730","LBL01688","LBL00960","LBL00540","LBL01356","LBL03092","LBL05318","LBL01826","LBL01951","BTN00069","BTN00008","MSG00456","MSG00407","MSG00444","MSG00886","MSG00843","MSG00176","MSG04439");
/****************************************************************************************************
1. Create Date : 2015.04.17
2. Creator     : 임명식
3. Description : 재고 > 회계반영 > 세부내역
4. Precaution  :
5. History     : 2021.01.13 김태일 : A21_00229_판매 관련 사용하지 않는 SP 리네임_KTI
****************************************************************************************************/

//ecount.page.factory("ecount.page.input.inventory", "EB011P_DETAIL", {

//    pageID: null,

//    header: null,

//    contents: null,

//    footer: null,

//    /**************************************************************************************************** 
//    * user opion Variables(사용자변수 및 객체) 
//    ****************************************************************************************************/
//    gridObj: null,
//    settingParam: {
//        flag: "",         //파악안됨 계산여부????????????????????????????
//        taxTypeCodeData: null,
//        dates: null,       //
//        vatFlag: "",
//        isEsd: true,
//        cust: "",
//        taxInvoiceDetailData: null,
//        isSetFlag: false,
//        settle: "1",
//        isSettleFlag: false,
//        accountViewFlag: "1",
//        isCW: false,
//        year: "",
//        isCollectiveInvoicing: false,
//        isAmendedSlip: false,
//    },
//    pageOption: {
//        EditFlag: "",
//        decAmt2: "1",
//        priceVat: 0,          //부가세 단가
//        isPriceVat: false,          //부가세 단가여부
//        rowFocusData: null,         //현재포커스 있는데이터
//        rowFocusColumn: "",         //현재포커스 가있는 컬럼 row_col
//        taxInvoiceSelectData: null, // db값 셀렉트 나중에 다시불러오기 사용
//        isInputCode01: false,      //거래내역설정 ecount01추가여부
//        isInputCode02: false,      //거래내역설정 ecount02추가여부
//        totalSettleAmt: 0

//    },
//    invoicingTaxDetail: {
//        TAX_NO: null,       // strTaxNo
//        REMARKS: null,      // strDRemarks
//        SETTLE_AMT1: null,  // strSettleAmt1
//        SETTLE_AMT2: null,  // strSettleAmt2
//        SETTLE_AMT3: null,  // strSettleAmt3
//        SETTLE_AMT4: null,  // strSettleAmt4
//        SUPPLY_AMT_TOTAL: null,
//        VAT_AMT_TOTAL: null,
//        VAT_FLAG: null,     // vat_flag
//        Details: [],
//    },

//    /**************************************************************************************************** 
//    * page initialize
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
//    ****************************************************************************************************/
//    init: function (options) {
//        this._super.init.apply(this, arguments);
//        this.registerDependencies("ecmodule.account.common");
//    },

//    render: function ($parent) {        
//            $.extend(this.settingParam, this.viewBag.DefaultOption || {});            
//            if (!$.isEmpty(this.settingParam.taxTypeCodeData))
//                this.settingParam.taxTypeCodeData = $.parseJSON(decodeURIComponent(this.settingParam.taxTypeCodeData));
//            if (!$.isEmpty(this.settingParam.taxInvoiceDetailData)) {
//                this.settingParam.taxInvoiceDetailData = $.parseJSON(decodeURIComponent(this.settingParam.taxInvoiceDetailData));

//                this.settingParam.taxInvoiceDetailData.Details =
//                    this.settingParam.taxInvoiceDetailData.Details.where(function (x) {                        
//                        if (this.checkEmptyRow(x)) {
//                            if (x.MMDD == "" && x.MM == undefined && x.DD == undefined) {
//                                x.MM = "";
//                                x.DD = "";                               
//                            };
//                        }
//                        return x;
//                    }.bind(this));

//                var temp = $.grep(this.settingParam.taxInvoiceDetailData.Details, function (obj) {
//                    return this.checkEmptyRow(obj) == false;
//                }.bind(this));

//                this.settingParam.taxInvoiceDetailData.Details = temp;
//            }
            
//            this.settingParam.vatFlag = this.settingParam.vatFlag || "";
//            //this.settingParam.isEsd = this.settingParam.isEsd || true;
//            if ($.isEmpty(this.settingParam.isEsd) || !$.isEmptyObject(this.SlipData))
//            this.settingParam.isEsd = true;


//            this.pageOption.EditFlag = this.EditFlag || "I";

//            this.settingParam.settle = this.settingParam.settle != "2" ? "1" : this.settingParam.settle;

//            switch (ecount.config.company.DEC_AMT) {
//                case 1:
//                    this.pageOption.decAmt2 = "10";
//                    break;
//                case 2:
//                    this.pageOption.decAmt2 = "100";
//                    break;
//            }

//            this._super.render.apply(this, arguments);       
//    },


//    /****************************************************************************************************
//    * UI Layout setting
//    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
//    ****************************************************************************************************/

//    onInitHeader: function (header, resource, inputCodes, taxInvoice) {
//        if (!$.isEmptyObject(this.viewBag.InitDatas) && !$.isEmptyObject(this.viewBag.InitDatas.inputCodes)) {
//            var inputs = this.viewBag.InitDatas.inputCodes.toUpperCase().split(ecount.delimiter)
//            this.pageOption.isInputCode01 = inputs.contains("[ECOUNT01]") ? true : false;
//            this.pageOption.isInputCode02 = inputs.contains("[ECOUNT02]") ? true : false;
//        }

//        this.pageOption.taxInvoiceSelectData = !$.isEmptyObject(this.viewBag.InitDatas.taxInvoice) ? this.viewBag.InitDatas.taxInvoice : null;
//        this.setDetailValue(this.pageOption.taxInvoiceSelectData);
//        var g = widget.generator,
//        contents = g.contents();

//        var progressMarkMessage = ecmodule.account.common.getProgressMarkMessage({
//            EDIT_FLAG: "M",
//            ECTAX_TYPE: this.settingParam.EctaxType,
//            GB_TYPE: "Y"
//        });

//        if (progressMarkMessage.IS_SHOW == true) {
//            header.progressMark(progressMarkMessage.MESSAGE1, progressMarkMessage.MESSAGE2);
//        }

//        header.notUsedBookmark()
//            .setTitle(ecount.resource.LBL01605)
//            .addContents(contents);
//    },

//    onInitContents: function (contents, resource) {
//        var g = widget.generator,
//        toolbar = g.toolbar(),
//        toolbar2 = g.toolbar(),
//        ctrl = g.control(),
//        ctrl2 = g.control(),
//        form1 = g.form(),
//        grid = g.grid(),
//        form2 = g.form(),
//        form3 = g.form(),
//        maxDecLength = 16 + $.parseNumber(ecount.config.company.DEC_AMT);;        
//        form1.useInputForm()
//            .setColSize(1)
//            .hideLRBorder()
//            .add(ctrl.define("widget.select.eTaxInvoiceType", "IN_TYPE_ECTAX_FLAG", "IN_TYPE_ECTAX_FLAG", "전자세금계산서 구분").select(this.settingParam.ecTaxFlag).end())
//            .add(ctrl.define("widget.input", "TAX_NO", "TAX_NO", ecount.resource.LBL02176).value(this.invoicingTaxDetail.TAX_NO)
//            .filter("maxlength", { message: String.format(ecount.resource.MSG01397, "20"), max: 20 })
//            .hideCell(ecount.config.limited.feature.USE_STATEMENT_NUM != true)
//            .end());

//        var custom = ctrl.define("widget.custom", "REMARKS", "REMARKS", ecount.resource.LBL01419);

//        custom.addControl(ctrl2.define("widget.input", "REMARKS2", "REMARKS2")
//                                .maxLength(40)
//                                .value(this.invoicingTaxDetail.REMARKS));

//        if (this.settingParam.isSetFlag == true) {
//            custom.addControl(ctrl2.define("widget.radio", "SETTLE", "SETTLE")
//                                    .label([ecount.resource.LBL02763, ecount.resource.LBL01894])
//                                    .value(["1", "2"])
//                                    .select(this.settingParam.settle)).columns(9, 3);
//        }

//        form1.add(custom.end());

//        //툴바
//        toolbar
//            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
//                .addLeft(ctrl.define("widget.button", "selectDelete").label(ecount.resource.BTN00037).hide())
//                .addLeft(ctrl.define("widget.button", "F4").label("F4").hide());
//        if (this.settingParam.isEsd == true) {
//            toolbar.addLeft(ctrl.define("widget.button", "reloadDetail").label(ecount.resource.BTN00525))
//        }

//        //merge Data 추가 2015.11.25 박종국
//        var mergeData = {};
//        mergeData['_MERGE_USEOWN'] = false;
//        mergeData['_ROW_TITLE'] = ecount.resource.LBL03372;
//        mergeData['_MERGE_START_INDEX'] = 2;
//        mergeData['_COLSPAN_COUNT'] = 2;
        
//        var self = this;
//        grid
//            .setColumns([
//                { propertyName: 'MM', id: 'MM', title: ecount.resource.LBL02042, width: 25, align: "left", controlType: 'widget.input.general', dataType: '0' },
//                { propertyName: 'DD', id: 'DD', title: ecount.resource.LBL02159, width: 25, align: "left", controlType: 'widget.input.general', dataType: '0' },
//                { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL02982, width: 170, align: "left", controlType: 'widget.input.general', dataType: '0' },
//                { propertyName: 'SIZE_DES', id: 'SIZE_DES', title: ecount.resource.LBL00730, width: 80, align: "left", controlType: 'widget.input.general', dataType: '0' },
//                {
//                    propertyName: 'QTY', id: 'QTY', title: ecount.resource.LBL01688, width: 80, align: "right", controlType: 'widget.input.number',
//                    dataType: '9' + ecount.config.company.VAT_Q, isCheckZero: false,
//                    controlOption: { decimalUnit: [ecount.common.number.defaultLength + ecount.config.company.VAT_Q, ecount.config.company.VAT_Q] }
//                },
//                {
//                    propertyName: 'PRICE', id: 'PRICE', title: ecount.resource.LBL00960, width: 80, align: "right", controlType: 'widget.input.number',
//                    dataType: '9' + ecount.config.company.VAT_P, isCheckZero: false,
//                    controlOption: { decimalUnit: [ecount.common.number.defaultLength + 10, 10] }
//                },
//                {
//                    propertyName: 'SUPPLY_AMT', id: 'SUPPLY_AMT', title: ecount.resource.LBL00540, width: 80, align: "right", controlType: 'widget.input.number',
//                    dataType: '9' + ecount.config.company.DEC_AMT, isCheckZero: false,
//                    controlOption: { decimalUnit: [ecount.common.number.amountLength + ecount.config.company.DEC_AMT, ecount.config.company.DEC_AMT] }
//                },
//                {
//                    propertyName: 'VAT_AMT', id: 'VAT_AMT', title: ecount.resource.LBL01356, width: 80, align: "right", controlType: 'widget.input.number',
//                    dataType: '9' + ecount.config.company.DEC_AMT, isCheckZero: false,
//                    controlOption: { decimalUnit: [ecount.common.number.amountLength + ecount.config.company.DEC_AMT, ecount.config.company.DEC_AMT] }
//                },
//                { propertyName: 'REMARKS', id: 'REMARKS', title: ecount.resource.LBL01419, width: 80, align: "left", controlType: 'widget.input.general', dataType: '0', controlOption: { maxLength: 30 } }
//            ])
//            .setColumnRowCustom([0], [{ '_MERGE_SET': new Array(mergeData) }])
//            //.setRowData(this.invoicingTaxDetail.Details)
//            .setEventWidgetTriggerObj(this.events)
//            .setEditable(true, 4, 1)
//            .setEditRowMoveable(true)
//            .setColumnFixHeader(true)
//            .setCheckBoxUse(true)
//            .setEventAutoAddRowOnLastRow(true, 1)
//            .setEditSpecialRowCount(1)
//            .setStyleBorderRemoveLeftRight(true)
//            .setCheckBoxHeaderCallback({ 'change': this.setToolbarButton.bind(this) })
//            .setCheckBoxCallback({ 'click': this.setToolbarButton.bind(this) })
//            .setEditableUseViewMode(ecount.config.user.IS_SLIP_INPUTTYPE_MOVE)

//            .setCustomRowCell('MM', this.setGridMMCustomCell.bind(this))
//            .setCustomRowCell('DD', this.setGridMMCustomCell.bind(this))
//            .setCustomRowCell('QTY', this.setGridCustomCell.bind(this))
//            .setCustomRowCell('PRICE', this.setGridPriceCustomCell.bind(this))
//            .setCustomRowCell('SUPPLY_AMT', this.setGridSupplyAmtCustomCell.bind(this))
//            .setCustomRowCell('VAT_AMT', this.setGridVatAmtCustomCell.bind(this));

//        //if (!(ecount.config.inventory.USE_BALANCE_BASIS == false && this.pageOption.EditFlag == "I")) {           
//            grid.setRowData(this.invoicingTaxDetail.Details);
//        //}

//        form2.template("register")
//            .hideLRBorder()
//            .add(ctrl.define("widget.input", "SETTLE_AMT1", "SETTLE_AMT1", ecount.resource.LBL03092)
//                .numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT))
//                .value(this.settingParam.isSettleFlag == false && this.settingParam.settle == "2" ? this.pageOption.totalSettleAmt : this.invoicingTaxDetail.SETTLE_AMT1).end())
//            .add(ctrl.define("widget.input", "SETTLE_AMT2", "SETTLE_AMT2", ecount.resource.LBL05318)
//                .numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT)).value(this.invoicingTaxDetail.SETTLE_AMT2).end())
//            .add(ctrl.define("widget.input", "SETTLE_AMT3", "SETTLE_AMT3", ecount.resource.LBL01826)
//                .numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT)).value(this.invoicingTaxDetail.SETTLE_AMT3).end())
//            .add(ctrl.define("widget.input", "SETTLE_AMT4", "SETTLE_AMT4", ecount.resource.LBL01951)
//                .numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT))
//                .value(this.settingParam.isSettleFlag == false && this.settingParam.settle == "1" ? this.pageOption.totalSettleAmt : this.invoicingTaxDetail.SETTLE_AMT4).end());

//        contents.add(form1)
//            .add(toolbar)
//            .addGrid("dataGrid", grid)
//            .add(form2);
//    },

//    onInitFooter: function (footer, resource) {
//        var g = widget.generator,
//            toolbar = g.toolbar(),
//            ctrl = g.control();
//        toolbar
//            .addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00069))
//            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
//        footer.add(toolbar);
//    },

//    /**************************************************************************************************** 
//    * define common event listener
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
//    ****************************************************************************************************/
//    onLoadTabPane: function (event) { },

//    onLoadTabContents: function (event) { },

//    onChangeHeaderTab: function (event) { },

//    onChangeContentsTab: function (event) { },

//    onChangeControl: function (event) {
//        switch (event.cid) {
//            case "SETTLE":
//                this.setSettleChange(event.value);
//                break;
//            default:
//                break;

//        }
//    },

//    onLoadComplete: function (event) {
//        this.gridObj = this.contents.getGrid().grid;
//        this.contents.hideRow("IN_TYPE_ECTAX_FLAG")

//        if (ecount.config.inventory.USE_BALANCE_BASIS == false && this.pageOption.EditFlag == "I" && this.settingParam.isEsd) {
//            this.setReDetail("1");
//        }

//        if (["11", "12", "13", "19", "15", "21", "22", "24", "25", "28", "29", "2C", "2J"].contains(this.settingParam.taxTypeCodeData.VAT_CODE)) {
//            this.contents.getControl("IN_TYPE_ECTAX_FLAG").show();
//        } else {
//            this.contents.getControl("IN_TYPE_ECTAX_FLAG").hide();
//            this.contents.getControl("IN_TYPE_ECTAX_FLAG").setValue("00");
//        }
//        if (this.accountViewFlag == "2") // 매출전표2 인경우
//            this.setSettleChange(this.settingParam.settle);
//    },
//    onFocusOutControlHandler: function (control) {
//        switch (control.cid) {
//            case "SETTLE_AMT1":
//            case "SETTLE_AMT2":
//            case "SETTLE_AMT3":
//            case "SETTLE_AMT4":
//                this.contents.getControl(control.cid).setValue($.isEmpty(this.contents.getControl(control.cid).getValue()) ? "0" : this.contents.getControl(control.cid).getValue());
//                break;
//            default:
//                break;
//        }
//    },
//    onPopupHandler: function (control, config, handler) { },

//    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

//    onMessageHandler: function (message) { },

//    /****************************************************************************************************
//    * define grid event listener
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
//    ****************************************************************************************************/
//    onGridInit: function (e, data, grid) { },

//    onGridRenderComplete: function (e, data, grid) {
//        this.gridObj = this.contents.getGrid().grid;
//        this.setInitGridSetting();
//        this.setGridTotal();
//        this._super.onGridRenderComplete.apply(this, arguments);
//        this.gridObj.setCellFocus("MM", this.gridObj.getRowKeyByIndex(0));
//    },

//    /**************************************************************************************************** 
//    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
//    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
//    ****************************************************************************************************/

//    //선택 삭제
//    onContentsSelectDelete: function () {
//        this.contents.getControl("selectDelete").hide();
//        this.contents.getControl("F4").hide();

//        this.gridObj.removeCheckedRow();
//        this.setGridTotal();
//        this.setSettleChange(this.settingParam.settle);
//    },

//    //선택 F4 단가조정
//    onContentsF4: function () {
//        var _self = this;
//        var taxTypeCode = this.settingParam.taxTypeCodeData,
//            outType = taxTypeCode.VAT_CODE,
//            vatRate = $.parseNumber(taxTypeCode.VAT_RATE),
//            rowKey = "";

//        this.pageOption.rowFocusColumn = 'price';

//        $.each(this.gridObj.getChecked(), function (i, item) {
//            _self.setCalcPrice(item, vatRate);
//        });

//        this.pageOption.rowFocusColumn = ''
//    },

//    //내역다시불러오기
//    onContentsReloadDetail: function () {
        
//        //test
//        //this.settingParam.isCollectiveInvoicing = true;
        
//        //TODO 회계반영 2기준도 필요
//        //this.settingParam.isCollectiveInvoicing ? this.setReDetailCollective("1") : this.setReDetail("1");
//        if (this.settingParam.isAmendedSlip) {
//            this.setAmendedReDetail();
//        } else {
//            this.setReDetail("1");
//        }
//    },

//    //저장
//    onFooterSave: function () {
        
//        if (this.settingParam.EctaxType != "0") {
//            ecount.alert("인증서 첨부된 전표(타발행 포함)이기 때문에 수정할 수 없습니다.");
//            return false;
//        }

//        this.gridObj.editDone();
//        var result = {
//            isDetailInvoice: false,
//            settle: "1",
//            ecTaxFlag: "",
//            IsSettle: true,
//            SETTLE_FLAG: "",
//            invoicingTaxDetail: {
//                TAX_NO: null,       // strTaxNo
//                REMARKS: null,      // strDRemarks
//                SETTLE_AMT1: null,  // strSettleAmt1
//                SETTLE_AMT2: null,  // strSettleAmt2
//                SETTLE_AMT3: null,  // strSettleAmt3
//                SETTLE_AMT4: null,  // strSettleAmt4
//                SUPPLY_AMT_TOTAL: null,
//                VAT_AMT_TOTAL: null,
//                VAT_FLAG: null,     // vat_flag
//                Details: [],
//            },
//            //invoicingTaxDetail: {
//            //    master: { TREMARKS: "", REMARKS: "", TAX_NO: "", SUPPLY_AMT_TOTAL: "0", VAT_AMT_TOTAL: "0" },
//            //    settleAmt: {
//            //        SETTLE_AMT1: "0",
//            //        SETTLE_AMT2: "0",
//            //        SETTLE_AMT3: "0",
//            //        SETTLE_AMT4: "0",
//            //    },
//            //    details: [{
//            //        MM: null,
//            //        DD: null,
//            //        PROD_DES: null,
//            //        SIZE_DES: null,
//            //        QTY: null,
//            //        PRICE: null,
//            //        SUPPLY_AMT: null,
//            //        VAT_AMT: null,
//            //        REMARKS: null,
//            //        ECOUNT0: null,      //sub_prod
//            //        ECOUNT1: null,      //sub_size
//            //        ECOUNT6: null,      //sub_remarks
//            //        VatFlag: null,
//            //    }]
//            //}
//        }

//        var parentAmt = {
//            supplyAmt: "0",
//            vatAmt: "0"
//        }
        
//        this.contents.getControl("SETTLE_AMT1").hideError();
//        this.contents.getControl("SETTLE_AMT2").hideError();
//        this.contents.getControl("SETTLE_AMT3").hideError();
//        this.contents.getControl("SETTLE_AMT4").hideError();

//        if (this.settingParam.isSetFlag == true) {
//            result.isDetailInvoice = true
//            result.settle = this.contents.getControl("REMARKS").get(1) && this.contents.getControl("REMARKS").get(1).getValue();
//            //$.extend(parentAmt, ecount.page.popup.prototype.getParentInstance.apply(this, arguments).contents.getPage(this.settingParam.accountViewFlag == "1" ? "EBD010M" : "EBD001M").getDetailPopupReturnAmtData());
//            var parent = ecount.page.popup.prototype.getParentInstance.apply(this, arguments);
//            if ($.isFunction(parent.onCallbackPopup)) {
//                var callbackOption = {
//                    pageID: this.pageID,
//                    callbackID: "getAmt",
//                };
//                $.extend(parentAmt, parent.onCallbackPopup(callbackOption));
//            } else {
//                $.extend(parentAmt, parent.getDetailPopupReturnAmtData());
//            }
            


//            //if (this.settingParam.accountViewFlag == "2") {
//            //} else if (this.parentPageID.indexOf("ESD006M") > -1){
//            //} else {
//            //}
//            //TODO 합계
//            //if (!(new Decimal(parentAmt.supplyAmt || "0").eq(this.getGridSupplyAmtTotal()))) {
//            //    ecount.alert("세금계산서 내역의 공급가액과 발행리스트의 공급가액이 일치하지 않습니다.");
//            //    return false;
//            //}
//            //if (!(new Decimal(parentAmt.vatAmt || "0").eq(this.getGridVatAmtTotal()))) {
//            //    ecount.alert("세금계산서 내역의 부가세와 발행리스트의 부가세가 일치하지 않습니다.");
//            //    return false;
//            //}
//        }
//        if (this.settingParam.isCW != true) {
//            ecount.alert(ecount.resource.MSG00456)
//            return false;
//        }

//        var gridRowList = this.gridObj.getRowList();
//        var itemKey;
//        var isValid = true;

//        $.each(gridRowList, function (i, item) {
//            itemKey = item[ecount.grid.constValue.keyColumnPropertyName];

//            // 월 체크
//            if (this.dayCheck("M", item) == false) {
//                isValid = false;
//                this.gridObj.setCellFocus("MM", itemKey);
//                this.gridObj.setCellShowError("MM", itemKey, {
//                    message: ecount.resource.MSG00407,
//                });
//                return false;
//            }

//            // 일자 체크
//            if (this.dayCheck("D", item) == false) {
//                isValid = false;
//                this.gridObj.setCellFocus("DD", itemKey);
//                this.gridObj.setCellShowError("DD", itemKey, {
//                    message: ecount.resource.MSG00444,
//                });
//                return false;
//            }

//            // 일자 체크(공급가액)
//            if ($.isEmpty(item.SUPPLY_AMT) == false && new Decimal(item.SUPPLY_AMT).isNaN() == false && $.isEmpty(item.DD) == true) {
//                isValid = false;
//                this.gridObj.setCellFocus("DD", itemKey);
//                this.gridObj.setCellShowError("DD", itemKey, {
//                    message: ecount.resource.MSG00886,
//                });
//                return false;
//            }

//        	//고객지원 118691 월일이 비어있지 않고 공급가액이 비었을 때 공급가액 유효성 체크
//            if (($.isEmpty(item.DD) == false || $.isEmpty(item.MM) == false) && new Decimal(item.SUPPLY_AMT).isNaN() == true) {
//            	isValid = false;
//            	this.gridObj.setCellFocus("SUPPLY_AMT", itemKey);
//            	this.gridObj.setCellShowError("SUPPLY_AMT", itemKey, {
//            		message: ecount.resource.MSG00843,
//            	});
//            	return false;
//            }

//        	//고객지원 118691 월일, 공급가액이 둘 다 비어있을 때 다른 항목이 비어있지 않을 경우 유효성 체크
//            if ($.isEmpty(item.PROD_DES) == false ||
//				$.isEmpty(item.SIZE_DES) == false ||
//				new Decimal(item.QTY).isNaN() == false ||
//				new Decimal(item.PRICE).isNaN() == false ||
//				new Decimal(item.VAT_AMT).isNaN() == false ||
//				$.isEmpty(item.REMARKS) == false) {
					
//            	if ($.isEmpty(item.MM) == true || $.isEmpty(item.DD) == true) {
//            		isValid = false;
//            		this.gridObj.setCellFocus("DD", itemKey);
//            		this.gridObj.setCellShowError("DD", itemKey, {
//            			message: ecount.resource.MSG00886,
//            		});
//            		return false;
//            	}

//            	if (new Decimal(item.SUPPLY_AMT && 0).isNaN() == true) {
//            		isValid = false;
//            		this.gridObj.setCellFocus("SUPPLY_AMT", itemKey);
//            		this.gridObj.setCellShowError("SUPPLY_AMT", itemKey, {
//            			message: ecount.resource.MSG00843,
//            		});
//            		return false;
//				}
//			}

//            // 월/일자 값보정
//            if (item.MM.trim() == "" || item.DD.trim() == "") {
//                item.MM = item.MM.trim();
//                item.DD = item.DD.trim();
//                this.gridObj.setCell('MM', itemKey, item.MM, { isRunChange: false });
//                this.gridObj.setCell('DD', itemKey, item.DD, { isRunChange: false });
//            }
            
//            if (item.MM.length == 1) {
//                item.MM = "0" + item.MM;
//                this.gridObj.setCell('MM', itemKey, item.MM, { isRunChange: false });
//            }
//            if (item.DD.length == 1) {
//                item.DD = "0" + item.DD;
//                this.gridObj.setCell('DD', itemKey, item.DD, { isRunChange: false });
//            }

//            if (this.checkEmptyRow(item) == false) {
//                result.invoicingTaxDetail.Details.push({
//                    MMDD: item.MM + item.DD,
//                    MM: item.MM,
//                    DD: item.DD,
//                    PROD_DES: item.PROD_DES.replace(/\"/g, "″"),
//                    SIZE_DES: item.SIZE_DES.replace(/\"/g, "″"),
//                    QTY: new Decimal(item.QTY || "0").toString(),
//                    PRICE: new Decimal(item.PRICE || "0").toString(),
//                    SUPPLY_AMT: new Decimal(item.SUPPLY_AMT || "0").toString(),
//                    VAT_AMT: new Decimal(item.VAT_AMT || "0").toString(),
//                    REMARKS: item.REMARKS,
//                    ECOUNT0: null,
//                    ECOUNT1: null,
//                    ECOUNT6: null,
//                });
//            }
//        }.bind(this));

//        if (isValid == false) {
//            return false;
//        }

//        var totalAmt = this.getGridSupplyAmtTotal();
//        var totalVat = this.getGridVatAmtTotal();

//        var totalAmtList = new Decimal("0");
//        var totalVatList = new Decimal("0");

//        for (var i = 0; i < gridRowList.length; i++) {
//            totalAmtList = totalAmtList.plus((gridRowList[i].SUPPLY_AMT || "0"));
//            totalVatList = totalVatList.plus((gridRowList[i].VAT_AMT || "0"));
//        }

//        totalAmtList = totalAmtList.times(10000);
//        totalVatList = totalVatList.times(10000);

//        if (!(totalAmt.eq(totalAmtList.div(10000))) || !(totalVat.eq(totalVatList.div(10000)))) {
//            ecount.alert(ecount.resource.MSG00176);
//            return false;
//        }
//        //if (!(new Decimal(parentAmt.supplyAmt || "0").eq(totalAmtList.div(10000))) || !(new Decimal(parentAmt.vatAmt || "0").eq(totalVatList.div(10000)))) {
//        //    ecount.alert(ecount.resource.MSG00176);
//        //    return false;
//        //}

//        var settleAmt1 = new Decimal(this.contents.getControl("SETTLE_AMT1").getValue() || 0);
//        var settleAmt2 = new Decimal(this.contents.getControl("SETTLE_AMT2").getValue() || 0);
//        var settleAmt3 = new Decimal(this.contents.getControl("SETTLE_AMT3").getValue() || 0);
//        var settleAmt4 = new Decimal(this.contents.getControl("SETTLE_AMT4").getValue() || 0);

//        var tamts = (totalAmt.times(100).plus(totalVat.times(100))).div(100);
//        result.invoicingTaxDetail.SETTLE_AMT1 = settleAmt1.toString();
//        result.invoicingTaxDetail.SETTLE_AMT2 = settleAmt2.toString();
//        result.invoicingTaxDetail.SETTLE_AMT3 = settleAmt3.toString();
//        result.invoicingTaxDetail.SETTLE_AMT4 = settleAmt4.toString();

//        var tsettleamt = settleAmt1.plus(settleAmt2).plus(settleAmt3).plus(settleAmt4);

//        if (tsettleamt.isZero() == false) {
//            if (!tamts.eq(tsettleamt) && 2010 <= $.parseNumber(this.settingParam.year)) {
//                var settleAmtMax = Decimal.max(settleAmt1, settleAmt2, settleAmt3, settleAmt4);
//                var errorTargetDatas = [];
//                errorTargetDatas.push({ id: "SETTLE_AMT1", amt: settleAmt1 });
//                errorTargetDatas.push({ id: "SETTLE_AMT2", amt: settleAmt2 });
//                errorTargetDatas.push({ id: "SETTLE_AMT3", amt: settleAmt3 });
//                errorTargetDatas.push({ id: "SETTLE_AMT4", amt: settleAmt4 });

//                var errorTargetId = errorTargetDatas.where(function (x) {
//                    return x.amt.eq(settleAmtMax);
//                })[0].id;
                
//                ecount.alert("합계금액이 다릅니다.", function () {
//                    this.contents.getControl(errorTargetId).setFocus(0);
//                }.bind(this));

//                return false;
//            }
//        }
//        result.invoicingTaxDetail.SUPPLY_AMT_TOTAL = this.getGridSupplyAmtTotal().toString();
//        result.invoicingTaxDetail.VAT_AMT_TOTAL = this.getGridVatAmtTotal().toString();
//        result.invoicingTaxDetail.TREMARKS = this.contents.getControl("REMARKS").get(0).getValue();
//        result.invoicingTaxDetail.REMARKS = this.contents.getControl("REMARKS").get(0).getValue();
//        result.invoicingTaxDetail.VAT_FLAG = "1";
//        result.invoicingTaxDetail.TAX_NO = this.contents.getControl("TAX_NO").getValue();

//        result.ecTaxFlag = this.contents.getControl("IN_TYPE_ECTAX_FLAG").getValue();
//        //TODO
//        //parent.$("#detail_remarks").get(0).value = $('#rptMain_ctl00_txtRemarks').get(0).value;

//        //IsSettle: false, //$("#settle_flag").val() == "Y" ? true : false,
//        //SETTLE_FLAG: "", //$("#settle_value").val(),
//        var thisobj = this;
//        if (this.settingParam.isSetFlag == true)
//            result.SETTLE_FLAG = thisobj.contents.getControl("REMARKS").get(1) && thisobj.contents.getControl("REMARKS").get(1).getValue() || "1"

//        result.callback = function () {
//            thisobj._getParent = ecount.page.popup.prototype._getParent;
//            ecount.page.popup.prototype.close.call(thisobj);
//        }

//        ecount.page.popup.prototype.sendMessage.call(this, this, result);
//    },

//    //닫기
//    onFooterClose: function () {
//        this._getParent = ecount.page.popup.prototype._getParent;
//        ecount.page.popup.prototype.close.call(this)
//    },

//    /**************************************************************************************************** 
//    *  define hotkey event listener
//    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
//    ****************************************************************************************************/

//    ON_KEY_F4: function (event) {
//        event.preventDefault();

//        var columnId = this.gridObj.getActiveCellColumnId();

//        if (columnId == "PRICE") {
//            this.pageOption.rowFocusColumn = 'price'
//            this.gridObj.editDone();   //에디터모드 완료
//            var rowKey = this.gridObj.getActiveCellRowId(),   //현재포커스 row 키
//                data = this.gridObj.getCell(columnId, rowKey);  //설정한 컬럼의 value
//            //rowItem = this.gridObj.getRowItem(rowKey);      //row의 전체 value가져오기
//            //var index = this.gridObj.getRowIndexByKey(rowKey);
//            var taxTypeCode = this.settingParam.taxTypeCodeData,
//            outType = taxTypeCode.VAT_CODE,
//            vatRate = $.parseNumber(taxTypeCode.VAT_RATE);
//            var item = this.gridObj.getRowItem(rowKey);
//            this.gridObj.saveActiveCell(); //현재 포커스 
//            this.setCalcPrice(item, vatRate);
//            this.gridObj.restoreActiveCell();//예전포커스 돌리기 
//            this.pageOption.rowFocusColumn = ''
//        }
//    },

//    ON_KEY_F8: function () {
//        this.onFooterSave();
//    },


//    /**************************************************************************************************** 
//    * define user function 
//    ****************************************************************************************************/
//    setToolbarButton: function (event, data) {

//        if (this.gridObj.getChecked().length > 0) {
//            this.contents.getControl("selectDelete").show();
//            this.contents.getControl("F4").show();
//        } else {
//            this.contents.getControl("selectDelete").hide();
//            this.contents.getControl("F4").hide();
//        }

//    },
//    setGridMMCustomCell: function (value, rowItem) {
//        var self = this;
//        var option = {}
//        option.controlOption = {
//            maxLength: 2
//        };

//        option.event = {
//            'focus': function (e, data) {
//                if ($.parseNumber(data.rowIdx) > 0 && $.isEmpty(data.rowItem.MM) && $.isEmpty(data.rowItem.DD)) {
//                    var _grid = self.contents.getGrid().grid;

//                    var destKey = _grid.getRowKeyByIndex($.parseNumber(data.rowIdx));
//                    var srcKey = _grid.getRowKeyByIndex($.parseNumber(data.rowIdx) - 1);

//                    _grid.setCell('MM', destKey, _grid.getCell('MM', srcKey), { isRunChange: false });
//                    _grid.setCell('DD', destKey, _grid.getCell('DD', srcKey), { isRunChange: false });
//                }
//            }
//        }
//        return option;
//    },
//    //수량, 단가,  컬럼 변경시 callback
//    setGridCustomCell: function (value, rowItem, convertor, dataTypeOption) {
//        var self = this;
//        var option = {}
//        var convertorOption = {
//            dataType: dataTypeOption.dataType,
//            isCheckZero: dataTypeOption.isCheckZero,
//            amtCalc: dataTypeOption.amtCalc,
//            isShowIfZero: true
//        };

//        option.data = ecount.grid.helper.getDecimalValueByConvertor(value, convertorOption);

//        option.event = {
//            'change': function (e, data) {
//                self.setCalcAmount(e, data)
//            }
//        }
//        return option;
//    },

//    //공급가액,  컬럼 변경시 callback
//    setGridPriceCustomCell: function (value, rowItem, convertor, dataTypeOption) {
//        var self = this;
//        var option = {};
//        var convertorOption = {
//            dataType: dataTypeOption.dataType,
//            isCheckZero: dataTypeOption.isCheckZero,
//            amtCalc: dataTypeOption.amtCalc,
//            isShowIfZero: true
//        };

//        option.data = ecount.grid.helper.getDecimalValueByConvertor(value, convertorOption);

//        option.event = {
//            'change': function (e, data) {
//                self.setCalcAmount(e, data);
//            }
//        };

//        if (this.pageOption.rowFocusColumn == 'price') {
//            option.parentAttrs = {
//                'class': ['danger']
//            }
//        }
//        return option;
//    },

//    // 공급가액,  컬럼 변경시 callback
//    setGridSupplyAmtCustomCell: function (value, rowItem, convertor, dataTypeOption) {
//        var self = this;
//        var option = {};
//        var convertorOption = {
//            dataType: dataTypeOption.dataType,
//            isCheckZero: dataTypeOption.isCheckZero,
//            amtCalc: dataTypeOption.amtCalc,
//            isShowIfZero: true
//        };

//        option.data = ecount.grid.helper.getDecimalValueByConvertor(value, convertorOption);

//        option.event = {
//            'change': function (e, data) {
//                self.setCalcAmountSum("2", null, false);
//                self.setGridTotal();
//            }
//        }
//        return option;
//    },
//    // 부가세
//    setGridVatAmtCustomCell: function (value, rowItem, convertor, dataTypeOption) {
//        var self = this;
//        var option = {};
//        var convertorOption = {
//            dataType: dataTypeOption.dataType,
//            isCheckZero: dataTypeOption.isCheckZero,
//            amtCalc: dataTypeOption.amtCalc,
//            isShowIfZero: true
//        };

//        option.data = ecount.grid.helper.getDecimalValueByConvertor(value, convertorOption);

//        option.event = {
//            'change': function (e, data) {
//                var taxCodeData = "";
//                if (self.getParentInstance().pageID == "ESD006M_S" || self.getParentInstance().pageID == "EBD022M") {
//                    taxCodeData = self.getParentInstance(self.getParentInstance().pageID).getTaxGubunControl("taxType").getCodeData();
//                }
//                else if (self.getParentInstance().pageID == "ESD006M_S2") {
//                    taxCodeData = self.getParentInstance(self.getParentInstance().pageID).getControl("taxType").getCodeData();
//                } else if (self.getParentInstance().pageID == "EBD010M_09" || self.getParentInstance().pageID == "EBD001M" || self.getParentInstance().pageID == "EBD023M"
//                    || self.getParentInstance().pageID == "EBD010M_09_Amended") {
//                    taxCodeData = self.getParentInstance(self.getParentInstance().pageID).getTaxGubunControl("taxType").getCodeData();
//                }
//                else if (self.getParentInstance().pageID == "ETA001P_01" || self.getParentInstance().pageID == "ETA001P_01_Amended") {
//                    taxCodeData = self.getParentInstance(self.getParentInstance().pageID).getTaxGubunControl("taxType").getCodeData();
//                }
//                else if (self.getParentInstance().pageID == "ECTAX022P_02") {
//                    taxCodeData = self.getParentInstance(self.getParentInstance().pageID).getTaxTypeCodeData();
//                }
//                else if (self.getParentInstance().pageID == "EBD022M") {
//                    taxCodeData = self.getParentInstance(self.getParentInstance().pageID).getTaxGubunControl("taxType").getCodeData();
//                }
//                else {
//                    taxCodeData = self.getParentInstance(self.getParentInstance().pageID).getControl("io_type").getCodeData();
//                }
//                var vatRate = new Decimal(taxCodeData.VAT_RATE);  //arr_out_type[1];
//                if (vatRate == 0) {
//                    //부가세율이 0인 경우 부가세금액 0으로 변경
//                    var _grid = self.contents.getGrid().grid;
//                    _grid.setCell('VAT_AMT', data.rowKey, vatRate, { isRunChange: false });
//                    rowItem.VAT_AMT = 0;
//                }
                
//                self.setGridTotal();
//                self.setSettleChange(self.settingParam.settle);
//            }
//        }
//        return option;
//    },
//    setDetailValue: function (tempObj) {
//        var _self = this;
        
//        if (this.settingParam.vatFlag == "0") {
//            this.invoicingTaxDetail.Details.clear();
//            if ($.isEmpty(tempObj) || tempObj.length <= 0) {
//                $.extend(this.invoicingTaxDetail.Details, this.setDetailDefault(4));
//            } else {
//                $.each(tempObj, function (i, item) {
//                    _self.invoicingTaxDetail.Details.push(_self.setDetailDefault(1)[0]);
//                    if (i == 3 && tempObj.length > 4) {
//                        _self.invoicingTaxDetail.Details[i].PROD_DES = item.PROD_DES + " 외";
//                        var sliceItem = tempObj.slice(4)
//                        //debugger
//                        //_self.invoicingTaxDetail.details[i].SUPPLY_AMT = sliceItem.sum(function (item) {
//                        //    return item.SUPPLY_AMT || 0;
//                        //});
//                        //_self.invoicingTaxDetail.details[i].VAT_AMT = sliceItem.sum(function (item) {
//                        //    return item.VAT_AMT || 0;
//                        //});
//                        var sumSupply = new Decimal("0");
//                        var sumVat = new Decimal("0");
//                        for (var j = 0; j < sliceItem.length; j++) {
//                            sumSupply = sumSupply.plus(sliceItem[i].SUPPLY_AMT || 0)
//                            sumVat = sumSupply.plus(sliceItem[i].VAT_AMT || 0)
//                        }
//                        _self.invoicingTaxDetail.Details[i].SUPPLY_AMT = sumSupply.toString();
//                        _self.invoicingTaxDetail.Details[i].VAT_AMT = sumVat.toString();
//                        return false;
//                    } else {
//                        $.each(_self.invoicingTaxDetail.Details[i], function (pro, val) {
//                            _self.invoicingTaxDetail.Details[i][pro] = item[pro];
//                            _self.invoicingTaxDetail.Details[i].MM = item.IO_DATE.substring(4, 6);
//                            _self.invoicingTaxDetail.Details[i].DD = item.IO_DATE.substring(6);
//                        })
//                    }
//                });
//                //var totalSupplyAmt = tempObj.sum(function (item) {
//                //    return item.SUPPLY_AMT || 0;
//                //});
//                //var totalSupplyVat = tempObj.sum(function (item) {
//                //    return item.VAT_AMT || 0;
//                //});

//                if (_self.invoicingTaxDetail.Details.length < 4) {
//                    $.merge(_self.invoicingTaxDetail.Details, _self.setDetailDefault(4 - _self.invoicingTaxDetail.Details.length))
//                }
//                console.log("each end")
//            }

//        } else {
//            $.extend(_self.invoicingTaxDetail, _self.settingParam.taxInvoiceDetailData);
//        }

//        //TODO ioType 81인경우 다시확인
//        //if (_self._settingParma.isEsd == true)
//        _self.pageOption.totalSettleAmt = new Decimal(_self.invoicingTaxDetail.SUPPLY_AMT_TOTAL).plus(_self.invoicingTaxDetail.VAT_AMT_TOTAL).toString();
//        //else
//        //    _self.pageOption.totalSettleAmt = 0;


//        console.log("function end")
//    },

//    setDetailDefault: function (cnt) {
//        var details = new Array();
//        for (var i = 0; i < cnt; i++) {
//            details.push({
//                MMDD: "",
//                MM: "",
//                DD: "",
//                PROD_DES: "",
//                SIZE_DES: "",
//                QTY: "0",
//                PRICE: "0",
//                SUPPLY_AMT: "0",
//                VAT_AMT: "0",
//                REMARKS: "",
//                ECOUNT0: "",      //sub_prod
//                ECOUNT1: "",      //sub_size
//                ECOUNT6: "",      //sub_remarks
//            });
//        }
//        return details;
//    },

//    //수정세금계산서 내역불러오기
//    setAmendedReDetail: function () {
//        this.gridObj.settings().setRowData(this.invoicingTaxDetail.Details)
//        this.gridObj.render();

//        for (var i = 1; i < 5; i++) {
//            this.contents.getControl("SETTLE_AMT" + i.toString()).setValue(ecount.calc.toFixedRound(this.invoicingTaxDetail["SETTLE_AMT" + i.toString()], ecount.config.company.DEC_AMT));
//        }
//    },

//    setReDetail: function (type) {
//        var parentInfo, parentInfoTemp, taxTypeCode, outType, _self = this, notEmpty;
//        var parent = ecount.page.popup.prototype.getParentInstance.apply(this, arguments);

//        if ($.isFunction(parent.onCallbackPopup)) {
//            var callbackOption = {
//                pageID: this.pageID,
//                callbackID: "getProdInfo",
//            };

//            parentInfoTemp = parent.onCallbackPopup(callbackOption, function (data) {
//                parentInfo = data;
//                execute.call(this);
//            }.bind(this));

//            if ($.isEmpty(parentInfoTemp.useCallback) == true || parentInfoTemp.useCallback == false) {
//                parentInfo = parentInfoTemp;
//                execute.call(this);
//            }
//        }

//        function execute() {
//            if ($.isEmpty(parentInfo.taxRemarks)) {
//                parentInfo.taxRemarks = parentInfo.gridData[0].PROD_DES || "";
//            }

//            if (parentInfo.foreignFlag != "0") {
//                parentInfo.taxSupplyAmt = parentInfo.taxVatAmt;
//                parentInfo.taxVatAmt = 0;
//            }

//            taxTypeCode = this.settingParam.taxTypeCodeData,
//            outType = taxTypeCode.VAT_CODE;

//            if (!(["11", "14", "1D", "17", "15", "21", "24", "26", "27", "2E", "2G"].contains(outType) && (parentInfo && parentInfo.foreignFlag == "0"))) {
//                parentInfo.taxSupplyAmt = new Decimal(parentInfo.taxSupplyAmt).plus(parentInfo.taxVatAmt);
//                parentInfo.taxVatAmt = 0;
//            }

//            if ($.isEmpty(parentInfo.useCheckEmptyGridData) == false && parentInfo.useCheckEmptyGridData == false) {
//                notEmpty = parentInfo.gridData;
//            } else {
//                notEmpty = $.isEmptyObject(this.pageOption.taxInvoiceSelectData) ? parentInfo.gridData.where(function (n) { return !$.isEmpty(n.PROD_DES); }) : this.pageOption.taxInvoiceSelectData;
//            }

//            if (notEmpty.length > 4) {
//                ecount.confirm(ecount.resource.MSG04439, function (isResult) {
//                    detailsRowType.call(this, isResult);
//                })
//            } else {
//                detailsRowType.call(this, true);
//            }
//        }

//        function detailsRowType(isOverRow) {
//            this.ecRequire("ecmodule.account.common", function () {
//                var isSingle = (isOverRow == true && notEmpty.length > 4),
//                    option = null,
//                    result = null;

//                if (isSingle == false) {
//                    notEmpty = replaceProdInfo(notEmpty);
//                }

//                option = getOption.call(_self, isSingle);
//                result = ecmodule.account.common.getSyncTaxInvoiceDetail(option);

//                if (isSingle) {
//                    _self.invoicingTaxDetail.VAT_FLAG = "0";
//                    _self.invoicingTaxDetail.REMARKS = "";
//                } else {
//                    _self.invoicingTaxDetail.VAT_FLAG = "1";
//                }

//                _self.invoicingTaxDetail.Details.clear();
//                _self.invoicingTaxDetail.Details = result.Details;

//                _self.invoicingTaxDetail.SUPPLY_AMT_TOTAL = result.SUPPLY_AMT_TOTAL;
//                _self.invoicingTaxDetail.VAT_AMT_TOTAL = result.VAT_AMT_TOTAL;

//                _self.invoicingTaxDetail.SETTLE_AMT1 = result.SETTLE_AMT1;
//                _self.invoicingTaxDetail.SETTLE_AMT2 = result.SETTLE_AMT2;
//                _self.invoicingTaxDetail.SETTLE_AMT3 = result.SETTLE_AMT3;
//                _self.invoicingTaxDetail.SETTLE_AMT4 = result.SETTLE_AMT4;

//                _self.setGridRowData(_self.invoicingTaxDetail);

//                _self.clearToolbar.call(_self);
//            }.bind(this));
//        }

//        function replaceProdInfo(prodInfos) {
//            var isAbleTaxInvoiceSelectData = $.isEmpty(_self.pageOption.taxInvoiceSelectData) == false;
//            var replaceKey = {
//                ecount03: "",
//                ecount04: "",
//                ecount05: "",
//                ecount06: ""
//            };

//            var isOverrideProdDes = _self.pageOption.isInputCode01 != true;
//            var isOverrideSizeDes = _self.pageOption.isInputCode02 != true;
        
//            if ($.isEmpty(parentInfo.useInputCode01) == false && parentInfo.useInputCode01 == true) {
//                isOverrideProdDes = true;
//            }

//            if ($.isEmpty(parentInfo.useInputCode02) == false && parentInfo.useInputCode02 == true) {
//                isOverrideSizeDes = true;
//            }

//            prodInfos.forEach(function (x, i) {
//                if (isOverrideProdDes && !$.isEmpty(x.ECOUNT0)) {
//                    x.PROD_DES = x.ECOUNT0 || "";
//                }

//                if (isOverrideSizeDes && !$.isEmpty(x.ECOUNT1)) {
//                    x.SIZE_DES = x.ECOUNT1 || "";
//                }

//                x.REMARKS = x.ECOUNT6 || "";

//                replaceKey.ecount03 = String.fastFormat((new Decimal(x.QTY || "0")).toString(), {
//                    fractionLimit: 3,
//                    removeFractionIfZero: true
//                });
//                replaceKey.ecount04 = String.fastFormat((new Decimal(x.PRICE || "0")).toString(), {
//                    fractionLimit: 3,
//                    removeFractionIfZero: true
//                });
//                replaceKey.ecount05 = String.fastFormat((new Decimal(x.SUPPLY_AMT || "0")).toString(), {
//                    fractionLimit: 3,
//                    removeFractionIfZero: true
//                });
//                replaceKey.ecount06 = String.fastFormat((new Decimal(x.VAT_AMT || "0")).toString(), {
//                    fractionLimit: 3,
//                    removeFractionIfZero: true
//                });

//                $.each(replaceKey, function (key, val) {
//                    x.PROD_DES = x.PROD_DES.replace(key, val);
//                    x.SIZE_DES = x.SIZE_DES.replace(key, val);
//                    x.REMARKS = x.REMARKS.replace(key, val);
//                });

//            }, this);

//            return prodInfos;
//        }
        
//        function getOption(isSingle) {
//            var option = {
//                IS_MERGE: true,
//                LIMIT_COUNT: 1,
//                DATA_COUNT: 1,
//                FOREIGN_FLAG: parentInfo.foreignFlag,
//                SUPPLY_AMT: new Decimal(parentInfo.taxSupplyAmt || "0"),
//                VAT_AMT: new Decimal(parentInfo.taxVatAmt || "0"),
//                MM: parentInfo.taxMonth,
//                DD: parentInfo.taxDay,
//                UQTY_TAX: ecount.config.company.UQTY_TAX,
//                DEC_AMT: ecount.config.company.DEC_AMT,
//                DEC_PRICE: parentInfo.decPrice,
//                EXCHANGE_RATE: parentInfo.foreignRate,
//                SETTLE_VALUE: this.contents.getControl("REMARKS") && this.contents.getControl("REMARKS").get(1) && this.contents.getControl("REMARKS").get(1).getValue(),
//                PROD_DATAS: $.extend([], [], notEmpty),
//                FILTER_OF_PROD_DATA: function (x) { return true; },
//                SETTER_OF_DETAIL_ITEM: function (i, item, prodData) {
//                   // if ($.isEmpty(prodData.IO_DATE) == false && !$.isEmptyObject(_self.SlipData)) {
//                    if ($.isEmpty(prodData.IO_DATE) == false) {
//                        item.MM = prodData.IO_DATE.substring(4, 6);
//                        item.DD = prodData.IO_DATE.substring(6, 8);
//                        item.MMDD = [item.MM, item.DD].join("");
//                    }
//                    return item;
//                }
//            };

//            if (isSingle == false) {
//                option.IS_MERGE = false;
//                option.LIMIT_COUNT = option.PROD_DATAS.length;
//                option.DATA_COUNT = option.PROD_DATAS.length;
//            }

//            return option;
//        }
//    },

//    ////일괄회계반영인 경우 Collective Invoicing
//    //setReDetailCollective: function (type) {
//    //    var _self = this;
//    //    var notEmpty = this.pageOption.taxInvoiceSelectData;
//    //    var sumSupply = new Decimal("0");
//    //    var sumVat = new Decimal("0");
//    //    var taxMonth = notEmpty.length > 0 ? notEmpty[0].IO_DATE.substring(4, 6) : "";
//    //    var taxDay = notEmpty.length > 0 ? notEmpty[0].IO_DATE.substring(6, 8) : "";

//    //    var parentInfo, parentInfoTemp, taxTypeCode, outType, _self = this, notEmpty;
//    //    var parent = ecount.page.popup.prototype.getParentInstance.apply(this, arguments);

//    //    if ($.isFunction(parent.onCallbackPopup)) {
//    //        var callbackOption = {
//    //            pageID: this.pageID,
//    //                callbackID: "getProdInfo",
//    //            };

//    //        parentInfoTemp = ecount.parentFrame.onCallbackPopup(callbackOption, function (data) {
//    //            parentInfo = data;
//    //            }.bind(this));

//    //        if ($.isEmpty(parentInfoTemp.useCallback) == true || parentInfoTemp.useCallback == false) {
//    //            parentInfo = parentInfoTemp;
//    //        }
//    //    }

//    //    for (var j = 0; j < notEmpty.length; j++) {
//    //        sumSupply = sumSupply.plus(notEmpty[j].SUPPLY_AMT || 0)
//    //        sumVat = sumVat.plus(notEmpty[j].VAT_AMT || 0)
//    //    }

//    //    if (notEmpty.length > 4) {
//    //        ecount.confirm(ecount.resource.MSG04439, function (isResult) {
//    //            detailsRowType(isResult, _self);
//    //        });
//    //    } else {
//    //        detailsRowType(true, _self);
//    //    }

//    //    function detailsRowType(isOverRow, self) {
//    //        require("ecmodule.account.common", function () {
//    //            var isSingle = (isOverRow == true && notEmpty.length > 4),
//    //                option = null,
//    //                result = null;

//    //            if (isSingle == false) {
//    //                notEmpty = replaceProdInfo(notEmpty);
//    //            }

//    //            option = getOption.call(_self, isSingle);
//    //            result = ecmodule.account.common.getSyncTaxInvoiceDetail(option);

//    //            if (isSingle) {
//    //                _self.invoicingTaxDetail.VAT_FLAG = "0";
//    //                _self.invoicingTaxDetail.REMARKS = "";
//    //            } else {
//    //                _self.invoicingTaxDetail.VAT_FLAG = "1";
//    //            }

//    //            _self.invoicingTaxDetail.Details.clear();
//    //            _self.invoicingTaxDetail.Details = result.Details;

//    //            _self.invoicingTaxDetail.SUPPLY_AMT_TOTAL = result.SUPPLY_AMT_TOTAL;
//    //            _self.invoicingTaxDetail.VAT_AMT_TOTAL = result.VAT_AMT_TOTAL;

//    //            _self.invoicingTaxDetail.SETTLE_AMT1 = result.SETTLE_AMT1;
//    //            _self.invoicingTaxDetail.SETTLE_AMT2 = result.SETTLE_AMT2;
//    //            _self.invoicingTaxDetail.SETTLE_AMT3 = result.SETTLE_AMT3;
//    //            _self.invoicingTaxDetail.SETTLE_AMT4 = result.SETTLE_AMT4;

//    //            _self.setGridRowData(_self.invoicingTaxDetail);

//    //            _self.clearToolbar.call(_self);

//    //        }.bind(this));
//    //    }

//    //    function replaceProdInfo(prodInfos) {
//    //        var isAbleTaxInvoiceSelectData = $.isEmpty(_self.pageOption.taxInvoiceSelectData) == false;
//    //        var replaceKey = {
//    //            ecount03: "",
//    //            ecount04: "",
//    //            ecount05: "",
//    //            ecount06: ""
//    //        };

//    //        var isOverrideProdDes = _self.pageOption.isInputCode01 != true;
//    //        var isOverrideSizeDes = _self.pageOption.isInputCode02 != true;

//    //        if ($.isEmpty(parentInfo.useInputCode01) == false && parentInfo.useInputCode01 == true) {
//    //            isOverrideProdDes = true;
//    //        }

//    //        if ($.isEmpty(parentInfo.useInputCode02) == false && parentInfo.useInputCode02 == true) {
//    //            isOverrideSizeDes = true;
//    //        }

//    //        prodInfos.forEach(function (x, i) {
//    //            if (isOverrideProdDes && !$.isEmpty(x.ECOUNT0)) {
//    //                x.PROD_DES = x.ECOUNT0 || "";
//    //            }

//    //            if (isOverrideSizeDes && !$.isEmpty(x.ECOUNT1)) {
//    //                x.SIZE_DES = x.ECOUNT1 || "";
//    //            }

//    //            x.REMARKS = x.ECOUNT6 || "";
                
//    //            replaceKey.ecount03 = String.fastFormat((new Decimal(x.QTY || "0")).toString(), {
//    //                fractionLimit: 3,
//    //                removeFractionIfZero: true
//    //            });
//    //            replaceKey.ecount04 = String.fastFormat((new Decimal(x.PRICE || "0")).toString(), {
//    //                fractionLimit: 3,
//    //                removeFractionIfZero: true
//    //            });
//    //            replaceKey.ecount05 = String.fastFormat((new Decimal(x.SUPPLY_AMT || "0")).toString(), {
//    //                fractionLimit: 3,
//    //                removeFractionIfZero: true
//    //            });
//    //            replaceKey.ecount06 = String.fastFormat((new Decimal(x.VAT_AMT || "0")).toString(), {
//    //                fractionLimit: 3,
//    //                removeFractionIfZero: true
//    //            });

//    //            $.each(replaceKey, function (key, val) {
//    //                x.PROD_DES = x.PROD_DES.replace(key, val);
//    //                x.SIZE_DES = x.SIZE_DES.replace(key, val);
//    //                x.REMARKS = x.REMARKS.replace(key, val);
//    //            });

//    //        }, this);

//    //        return prodInfos;
//    //    }

//    //    function getOption(isSingle) {
//    //        var option = {
//    //            IS_MERGE: true,
//    //            LIMIT_COUNT: 1,
//    //            FOREIGN_FLAG: "0",
//    //            SUPPLY_AMT: sumSupply,
//    //            VAT_AMT: sumVat,
//    //            MM: taxMonth,
//    //            DD: taxDay,
//    //            UQTY_TAX: "0",
//    //            DEC_AMT: ecount.config.company.DEC_AMT,
//    //            DEC_PRICE: ecount.config.company.DEC_AMT,
//    //            PROD_DATAS: $.extend([{}], [{}], notEmpty),
//    //        };

//    //        if (isSingle == false) {
//    //            option.IS_MERGE = false;
//    //            option.LIMIT_COUNT = option.PROD_DATAS.length;
//    //        }

//    //        option.PROD_DATAS.forEach(function (x, i) {
//    //            x.PROD_DES = x.ECOUNT01 || "";
//    //            x.SIZE_DES = x.ECOUNT02 || "";
//    //            x.REMARKS = x.ECOUNT06 || "";
//    //        });

//    //        return option;
//    //    }
//    //},

//    //청구 미청구 변경  fnSettleCh
//    setSettleChange: function (type) {
//        if (this.settingParam.isSetFlag == true) {
//            type = this.contents.getControl("REMARKS").get(1).getValue();
//        }
//        var sumAmt = this.getGridSupplyAmtTotal().plus(this.getGridVatAmtTotal());
//        var settle2Amt = sumAmt.minus(new Decimal(this.contents.getControl("SETTLE_AMT2").getValue() || "0").plus(this.contents.getControl("SETTLE_AMT3").getValue() || "0"));
//        settle2Amt = ecount.calc.toFixedRound(settle2Amt, ecount.config.company.DEC_AMT);
//        this.contents.getControl("SETTLE_AMT1").setValue(type == "1" ? 0 : settle2Amt.toString());
//        this.contents.getControl("SETTLE_AMT4").setValue(type != "1" ? 0 : settle2Amt.toString());

//    },

//    //공급가액 다시 계산 f4   calc_qtys
//    setCalcPrice: function (item, taxRate) {
//        var _grid = this.contents.getGrid().grid;
//        var rowKey = item[ecount.grid.constValue.keyColumnPropertyName];
//        var oldAmt = new Decimal(item.SUPPLY_AMT || "0"),
//            oldVat = new Decimal(item.VAT_AMT || "0"),
//            price = new Decimal(item.PRICE || "0"),
//            qty = new Decimal(item.QTY || "0"),
//            tax = new Decimal("0");


//        if (oldAmt.isNaN()) { oldAmt = new Decimal("0"); }
//        if (oldVat == "" || oldAmt.isNaN()) { oldVat = new Decimal("0"); }
//        if (price == "" || oldAmt.isNaN()) { price = new Decimal("0"); }
//        if (qty == "" || oldAmt.isNaN()) { qty = new Decimal("0"); }

//        taxRate = new Decimal(taxRate || 0);

//        if (taxRate.isZero() == false) {
//            tax = taxRate.times(100);
//        }

//        var amt = new Decimal("0"), vat = new Decimal("0");

//        if (!(price.isZero()) && !(qty.isZero())) {
//            var iPriceA = new Decimal((price.times(100)).div(new Decimal(100).plus(tax)).toFixed(6, 4));  //공급가액 단가
//            var iPriceV = new Decimal((price.times(tax)).div(new Decimal(100).plus(tax)).toFixed(6, 4));  //부가세 단가
//            amt = this.getCalcNumber((qty.times(iPriceA)), ecount.config.company.AMT_CALC);

//            if (!tax.isZero()) {
//                vat = this.getCalcNumber((qty.times(iPriceV)), ecount.config.company.VAT_CALC)
//            }

//            price = new Decimal(iPriceA.toFixed($.parseNumber(ecount.config.company.VAT_P), 4));

//            _grid.addCellClass("PRICE", rowKey, "bg-danger");

//            _grid.setCell('PRICE', rowKey, price.toString(), { isRunChange: false, isRunComplete: false });
//            _grid.setCell('SUPPLY_AMT', rowKey, amt.toString(), { isRunChange: false })
//            _grid.setCell('VAT_AMT', rowKey, vat.toString(), { isRunChange: false })

//            this.pageOption.priceVat = iPriceV.toString();
//            this.pageOption.isPriceVat = true;

//            if (oldAmt != amt) {
//                this.setCalcAmountSum("0", rowKey, true); //amt_sum(0);
//            }

//            //vat = $.parseNumber(unformatNumber(obj_vat.get(0).value));

//            if (!oldVat.eq(vat)) {
//                this.setCalcAmountSum("1", rowKey, true); //
//            }

//            this.pageOption.priceVat = "0";
//            this.pageOption.isPriceVat = false;

//            //obj_price.get(0).style.backgroundColor = "#FDEBF4";	 

//            //$('#old_value').get(0).value = obj_price.get(0).value;   
//        }
//    },

//    //공급가액 계산 amt_calc
//    setCalcAmount: function (e, data) {
//        var _grid = this.contents.getGrid().grid;
//        var taxTypeCode = this.settingParam.taxTypeCodeData,
//            out_type = taxTypeCode.VAT_CODE,
//            rate = new Decimal(taxTypeCode.VAT_RATE || "0"),
//            qty = new Decimal(data.rowItem['QTY'] || "0"),
//            price = new Decimal(data.rowItem['PRICE'] || "0"),
//            iPriceV = new Decimal("0"),
//            iReVat = new Decimal("0");
//        if (qty.isNaN() || qty == "") {
//            qty = new Decimal("0");
//        }
//        else {
//            //qty = $.parseNumber(qty);
//            _grid.setCell('QTY', data.rowKey, qty.toString(), { isRunChange: false });    //formatNumber(qty, "6");
//        }
//        if (price.isNaN() || price == "") {
//            price = new Decimal("0");
//        }
//        else {
//            //price = $.parseNumber(price);
//            _grid.setCell('PRICE', data.rowKey, price.toString(), { isRunChange: false });  // formatNumber(price, "6");
//        }
//        if (!(qty.isZero()) && !(price.isZero())) {
//            iPriceV = new Decimal((price.div(100).times(rate.times(100))).toFixed(6, 4));
//            iReVat = qty.times(iPriceV);
//            var amt = new Decimal("0");
//            amt = this.getCalcNumber((qty.times(price)), ecount.config.company.AMT_CALC); //fnCalcTypesPop((qty * price), strAmtCalcPop);
//            var vat = new Decimal("0");
//            if (!["12", "13", "16", "1A", "1B"].contains(out_type)) {
//                vat = this.getCalcNumber(iReVat, ecount.config.company.VAT_CALC); //fnCalcTypesPop((iReVat), strVatCalcPop);
//            }
//            _grid.setCell('SUPPLY_AMT', data.rowKey, amt.toString(), { isRunChange: false });
//            _grid.setCell('VAT_AMT', data.rowKey, vat.toString(), { isRunChange: false });
//            this.setCalcAmountSum("0", null, false);  //amt_sum('0');
//        }
//    },
//    //합계계산 amt_sum
//    setCalcAmountSum: function (gubun, rowKey, isRunOnlySelectedRow) {
//        var _grid = this.contents.getGrid().grid;
//        var temp_vat = new Decimal("0"),
//            amt = new Decimal("0"),
//            qty = new Decimal("0"),
//            price = new Decimal("0"),
//            iPriceV = new Decimal("0"),
//            iReVat = new Decimal("0");

//        if (this.settingParam.flag == "0") {
//            var taxTypeCode = this.settingParam.taxTypeCodeData,
//                outType = taxTypeCode.VAT_CODE,
//                vatRate = new Decimal(taxTypeCode.VAT_RATE || "0"),
//                gridObj = _grid.getRowList(),
//                self = this;

//            if (isRunOnlySelectedRow) {
//                gridObj = gridObj.first(function (x) {
//                    return x[ecount.grid.constValue.keyColumnPropertyName] == rowKey;
//                });
//            }
            
//			//고객지원 118691 해당 라인만 계산되도록 수정
//            //var rowKey = _grid.getRowItem(this.gridObj.getActiveCellRowId());
//            if (this.gridObj.getActiveCellRowId() != null)
//                rowKey = this.gridObj.getActiveCellRowId();

//            var rowItem = _grid.getRowItem(rowKey);


//            amt = new Decimal(rowItem.SUPPLY_AMT || "0");
//            qty = new Decimal(rowItem.QTY || "0");
//            price = new Decimal(rowItem.PRICE || "0");
//            var vat = new Decimal("0");
//            if (gubun != "2" && price.isZero() == false && qty.isZero() == false) {
//                if (self.pageOption.isPriceVat == false) {
//                    iPriceV = new Decimal((price.div(100).times(vatRate.times(100))).toFixed(6, 4));
//                } else {
//                    iPriceV = new Decimal(self.pageOption.priceVat);
//                }
//                iReVat = (qty.times(iPriceV));
//            } else {
//                iReVat = amt.times(vatRate);
//            }

//            //공급가액 원단위 금액일 경우 부가세 0원 처리
//            if ((amt < 0 && amt > -10) || (amt > 0 && amt < 10)) {
//                vat = new Decimal("0");
//            }
//            else {

//                if (!["12", "13", "16", "1A", "1B"].contains(outType)) {
//                    if ((qty == "" || qty.isNaN() || qty.isZero()) && (price == "" || price.isNaN() || price.isZero()) && (amt == "" || amt.isNaN() || amt.isZero())) { // 수량, 단가 입력 안하고 공급가액만 입력했을경우
//                        vat = new Decimal(rowItem.VAT_AMT || "0");//Number(unformatNumber($('#rptMain_ctl' + str + '_txtVat').get(0).value));
//                        temp_vat = self.getCalcNumber(iReVat, ecount.config.company.VAT_CALC) //fnMathVat(strVatCalcPop, iReVat, decA);

//                        if (gubun == "1" && amt.isZero() == false && vat.eq(temp_vat) == false) {
//                            if (new Decimal(vatRate.toFixed(0, 7)).isZero() == true)// 부가세 제한값이 0인 경우 기존 로직
//                            {
//                                if (!confirm("부가세가 공급가액의 10%가 아닙니다. 발행하시겠습니까? "))
//                                    vat = temp_vat;
//                            }
//                        }
//                        else
//                            vat = temp_vat;
//                    }
//                    else if ((rowItem.VAT_AMT == "") || (new Decimal(rowItem.VAT_AMT || "0").isZero())) {
//                        temp_vat = self.getCalcNumber(iReVat, ecount.config.company.VAT_CALC)
//                        if (gubun == "1" && amt.isZero() == false) {
//                            vat = 0
//                            if (new Decimal(vatRate.toFixed(0, 7)).isZero() == true)// 부가세 제한값이 0인 경우 기존 로직
//                            {
//                                if (!confirm("부가세가 공급가액의 10%가 아닙니다. 발행하시겠습니까? "))
//                                    vat = temp_vat;
//                            }
//                        }
//                        else
//                            vat = temp_vat;
//                    }
//                    else {
//                        vat = new Decimal(rowItem.VAT_AMT || "0");
//                        temp_vat = self.getCalcNumber(iReVat, ecount.config.company.VAT_CALC);
//                        if (gubun == "1" && vat.eq(temp_vat) == false) {
//                            if ((temp_vat.plus(100)) < (vat) || (temp_vat) > (vat.plus(100))) {
//                                if (new Decimal(vatRate.toFixed(0, 7)).isZero() == true) {
//                                    if (!confirm("부가세가 공급가액의 10%가 아닙니다. 발행하시겠습니까? ")) {
//                                        vat = temp_vat;
//                                    }
//                                }
//                            }
//                        }
//                        else
//                            vat = temp_vat;
//                    }
//                }
//            }
                
//            _grid.setCell('VAT_AMT', rowItem[ecount.grid.constValue.keyColumnPropertyName], vat.toString(), { isRunChange: false });
//        }

//        this.setGridTotal();
//        this.setSettleChange(this.settingParam.settle);
//    },

//    setGridRowData: function (data) {
//        var _self = this;
//        this.gridObj.settings().setRowData(this.invoicingTaxDetail.Details)
//        this.gridObj.render();

//        for (var i = 1; i < 5; i++) {
//            _self.contents.getControl("SETTLE_AMT" + i.toString()).setValue(ecount.calc.toFixedRound(data["SETTLE_AMT" + i.toString()], ecount.config.company.DEC_AMT));
//        }
//    },

//    //날짜 체크  daychk
//    dayCheck: function (type, row) {
        
//        if (type == "M") {
//            if (row.MM.trim() == "") {
//                return true;
//            } else {
//                if ($.isNumber(row.MM.trim()) == false) {
//                    return false;
//                }
//                var mm = row.MM.trim().length == 1 ? row.MM.trim() : $.parseNumber(row.MM.trim());
//                if ((mm < 1) || (mm > 12)) {
//                    return false;
//                }
//            }
//            if (row.DD.trim() == "") {
//                // objd.focus();
//                return true;
//            }
//        } else {
//            if (row.MM.trim() != "" && row.DD.trim() == "") {
//                return false;
//            }
//            if (row.DD.trim() == "") {
//                return true;
//            } else {
//                if ($.isNumber(row.DD.trim()) == false) {
//                    return false;
//                }
//                var dd = row.DD.trim().length == 1 ? row.DD.trim() : $.parseNumber(row.DD.trim());
//                if ((dd < 1) || (dd > 31)) {
//                    return false;
//                }
//            }
//            var yy = this.settingParam.year,
//                gridItem = this.gridObj.getRowItem(row["K-E-Y"]),
//                mm = gridItem.MM.trim(),
//                dd = gridItem.DD.trim();

//            if (this.isValidDate(yy, mm, dd) == false) {
//                return false;
//            }
//        }
//    },
//    //날짜 체크 윤달
//    isValidDate: function (yy, mm, dd) {
//        var yy = $.parseNumber(yy),
//            mm = $.parseNumber(mm),
//            dd = $.parseNumber(dd),
//            md = 31;
//        if ((mm < 1) || (mm > 12)) {
//            return false;
//        }
//        else if (mm == 2) { //윤달체크
//            if (((yy % 4 == 0) && (yy % 100 != 0)) || (yy % 400 == 0)) { // 윤달이 아니면...
//                md = 29;
//            }
//            else {
//                md = 28;
//            }
//        }
//        else if ([4, 6, 9, 11].contains(mm)) {
//            md = 30;
//        }
//        if ((dd >= 1) && (dd <= md)) {
//        }
//        else {
//            return false;
//        }
//        return true;
//    },
//    // 합계행 스타일설정
//    setInitGridSetting: function () {
//        this.gridObj.addCellClass("SUPPLY_AMT", "special-row-0", ["text-right", "text-bold"]);
//        this.gridObj.addCellClass("VAT_AMT", "special-row-0", ["text-right", "text-bold"]);
//    },
//    // 합계설정
//    setGridTotal: function () {
//        var rowList = this.contents.getGrid().grid.getRowList();
//        var supplyAmtTotal = rowList.sumToDecimal(function (x) { return x.SUPPLY_AMT });
//        var vatAmtTotal = rowList.sumToDecimal(function (x) { return x.VAT_AMT });

//        this.gridObj.setCell("SUPPLY_AMT", "special-row-0", supplyAmtTotal.toString(), { isRunChange: false });
//        this.gridObj.setCell("VAT_AMT", "special-row-0", vatAmtTotal.toString(), { isRunChange: false });
//    },
//    // 공급가액합계
//    getGridSupplyAmtTotal: function () {
//        return new Decimal(this.gridObj.getCell("SUPPLY_AMT", "special-row-0") || 0);
//    },
//    // 부가세합계
//    getGridVatAmtTotal: function () {
//        return new Decimal(this.gridObj.getCell("VAT_AMT", "special-row-0") || 0);
//    },
//    checkEmptyRow: function (rowData) {

//        // 일자체크
//        if (rowData.MM == undefined || rowData.DD == undefined) return true;
//        if ($.isEmpty(rowData.MM) == false || $.isEmpty(rowData.DD) == false) return false;

//        // 품목/규격체크
//        if ($.isEmpty(rowData.PROD_DES) == false || $.isEmpty(rowData.SIZE_DES) == false) return false;

//        // 숫자항목체크
//        if (new Decimal(rowData.QTY || 0).isZero() == false ||
//            new Decimal(rowData.PRICE || 0).isZero() == false ||
//            new Decimal(rowData.SUPPLY_AMT || 0).isZero() == false ||
//            new Decimal(rowData.VAT_AMT || 0).isZero() == false) {

//            return false;
//        }

//        return true;
//    },

//	//저장시 체크
//    checkEmptyRowSave: function (rowData) {

//    	// 일자체크
//    	if (rowData.MM == undefined || rowData.DD == undefined) return true;
//    	if ($.isEmpty(rowData.MM) == false || $.isEmpty(rowData.DD) == false) {

//    		// 품목/규격체크
//    		if ($.isEmpty(rowData.PROD_DES) == false || $.isEmpty(rowData.SIZE_DES) == false)
//    			return false;
//    		else
//    			return true;

//    	}
//    	// 숫자항목체크
//    	if (new Decimal(rowData.QTY || 0).isZero() == false ||
//            new Decimal(rowData.PRICE || 0).isZero() == false ||
//            new Decimal(rowData.SUPPLY_AMT || 0).isZero() == false ||
//            new Decimal(rowData.VAT_AMT || 0).isZero() == false) {

//    		return false;
//    	}
//    	return true;
//    },
//    clearToolbar: function () {
//        this.contents.getControl("selectDelete").hide();
//        this.contents.getControl("F4").hide();
//    }
//});