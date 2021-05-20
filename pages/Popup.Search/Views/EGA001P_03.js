window.__define_resource && __define_resource("LBL80149","LBL00397","LBL09724","LBL03657","LBL09725","MSG01334","MSG00957","LBL18695","LBL00561","LBL08289","LBL04833","LBL03030","LBL06083","LBL00351","LBL06204","LBL00315","LBL00420","LBL00672","LBL02586","LBL07386","LBL90008","LBL05319","LBL16416","LBL16534","LBL02237","LBL10476","LBL18631","LBL17941","LBL05040","LBL13036","LBL93226","LBL02916","LBL06370","LBL06373","LBL06374","LBL14260","LBL93212","LBL07460","LBL10337","LBL01177","LBL10497","LBL12268","LBL02283","LBL04936","LBL03962","LBL04030","LBL93362","LBL02728","LBL00692","LBL93320","LBL10942","LBL01489","LBL09840","LBL90113","LBL04937","LBL05127","LBL00274","LBL04366","LBL90140","LBL02939","LBL02963","LBL93402","LBL35299","LBL80300","LBL04417","LBL85190","MSG00339","MSG05663","MSG05664","MSG05662","BTN80002","BTN00008","BTN00065","BTN00037","LBL07157","MSG00303","MSG00299","MSG05665","LBL04785","LBL16316","LBL93213","LBL01604");
/****************************************************************************************************
1. Create Date : 2015.09.14
2. Creator     : 전영준
3. Description : EMAil 메일 제목,메일 추가내용, SMS 팝업
4. Precaution  : 
5. History     : 2016.06.01 노지혜 : 수정
                 2017.04.11(Hao) - add doctype 70 (Internal Use)
                 2017.04.17(BAO) - add doctype 26 (Shipping Order)
                 2017.05.04(Hao) - add doctype 34 (Purchase)
                 2017.05.10(Bao) - add doctype 38 (Location trans)
                 2017.05.23(Hao) - add doctype 30 (Purchase Request)
                 2017.08.04(Hao) - add doctype 28 (Release Sales Order)
                 2018.04.24(김우정) - add doctype 94 (WebMail) 
                 2019.10.07(HEUNGSAN) - ADD DOCTYPE 78 (GENERAL CERTIFICATE)
                 2019.11.07(한재국) - ADD DOCTYPE 29 (DEPOSITSLIP)
                 2020.02.07 (JINHO JANG) - ADD DOCTYPE 19 (PAYMENTSTATEMENT2)
                 2020.02.17 (이현택) - ADD DOCTYPE 20 (일용근로소득지급명세서(원천징수영수증))
                 2020.10.30 (정준호) - A20_02943 외부알림1차로 인해 설문조사 제거
                 2020.12.09 (정준호) - A20_06376 상단SMS 제거
                 2020.12.16 (정준호) - dev.53315
6. MenuPath    : Email >  EMAil 메일 제목,메일 추가내용, SMS 팝업
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGA001P_03", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    columns: null,  //columns
    gridObject: null, //getGrid
    title: null,    //title
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            SEND_SER: this.SEND_SER,
            DOC_GUBUN: this.DOC_GUBUN,
            SEARCH: this.keyword,
            Edit: this.Edit
        };
    },

    render: function () {
        this._super.render.apply(this);
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        var label = "",
            thisObj = this;

        label = this.searchFormParameter.Edit ? ecount.resource.LBL80149 : ecount.resource.LBL00397;         // LBL00397: 검색, LBL80149: 수정

        if (this.searchFormParameter.SEND_SER == "SJ" || this.searchFormParameter.SEND_SER == "GJ") {
            thisObj.title = ecount.resource.LBL09724; //메일제목
        } else if (this.searchFormParameter.SEND_SER == "SM" || this.searchFormParameter.SEND_SER == "GM") {
            thisObj.title = ecount.resource.LBL03657;
        } else { //EM
            thisObj.title = ecount.resource.LBL09725;
        }
        header.notUsedBookmark();
        header.setTitle(thisObj.title + ' ' + label);

        if (!this.searchFormParameter.Edit) {
            header.useQuickSearch();
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            settingsEditable = generator.grid(),
            thisObj = this;

        if (!this.searchFormParameter.Edit) {
            settings
                .setEventFocusOnInit(true)
                .setKeyboardCursorMove(true)
                .setKeyboardEnterForExecute(true)
                .setRowData(this.viewBag.InitDatas.ListLoad.Data)
                .setRowDataParameter(this.searchFormParameter)
                .setRowDataUrl('/Common/Infra/GetListForSearchEmail')
                .setColumns([{ propertyName: 'SEND_COMMNET', id: 'SEND_COMMNET', title: thisObj.title, width: '' }])
                .setColumnSortable(true)
                .setColumnSortExecuting(this.setColumnSortClick.bind(this))
                .setCustomRowCell('SEND_COMMNET', this.setGridDateLink.bind(this))

        } else {
            //EDITABLE
            var max = (this.SEND_SER == "SM" || this.SEND_SER == "GM") ? 90 : 320;
            var msg = (this.SEND_SER == "SM" || this.SEND_SER == "GM") ? String.format(resource.MSG01334, 45, 90) : String.format(resource.MSG00957, 320);

            if (["GJ", "GM", "GE"].contains(this.SEND_SER)) {
                this.columns = [
                    { propertyName: 'SEND_COMMNET', id: 'SEND_COMMNET', title: thisObj.title, width: 445, controlType: 'widget.input', editableState: 1, controlOption: { maxByte: { message: msg, max: max } } },
                    //{ propertyName: 'SURVEY', id: '80', isHideColumn: true, title: resource.LBL18695, width: 120, controlType: 'widget.select', editableState: 1 }, //설문조사 80
                    { propertyName: 'SHAREBOARD', id: '95', isHideColumn: true, title: resource.LBL00561, width: 120, controlType: 'widget.select', editableState: 1 }, //공유정보게시판 95
                    { propertyName: 'WORKBOARD', id: '96', isHideColumn: true, title: resource.LBL08289, width: 120, controlType: 'widget.select', editableState: 1 }, //업무관리게시판 96
                    { propertyName: 'CRMBOARD', id: '97', isHideColumn: true, title: resource.LBL04833, width: 120, controlType: 'widget.select', editableState: 1 }, //고객관리게시판 97
                    { propertyName: 'PROJECTBOARD', id: '81', isHideColumn: true, title: resource.LBL03030, width: 120, controlType: 'widget.select', editableState: 1 } //프로젝트게시판 81
                ];
            }
            else {
                this.columns = [
                    { propertyName: 'SEND_COMMNET', id: 'SEND_COMMNET', title: thisObj.title, width: 445, controlType: 'widget.input', editableState: 1, controlOption: { maxByte: { message: msg, max: max } } },
                    { propertyName: 'TAXINVOICES', id: '44', isHideColumn: true, title: resource.LBL06083, width: 120, controlType: 'widget.select', editableState: 1 },  //매출청구서  44 
                    { propertyName: 'ELECTRONICTAXINVOICE', id: '45', isHideColumn: true, title: this.getTaxResource(resource), width: 120, controlType: 'widget.select', editableState: 1 },  // 전자(세금)계산서 45
                    { propertyName: 'ELECTRONICTAXINVOICETW', id: '49', isHideColumn: true, title: this.getTaxResource(resource), width: 120, controlType: 'widget.select', editableState: 1 },  // 전자(세금)계산서 49
                    { propertyName: 'CUSTOMERVENDORBOOK1', id: '88', isHideColumn: true, title: resource.LBL00351, width: 120, controlType: 'widget.select', editableState: 1 }, //거래처관리대장 88
                    { propertyName: 'CUSTOMERVENDORBOOK2', id: '89', isHideColumn: true, title: resource.LBL06204, width: 120, controlType: 'widget.select', editableState: 1 }, //거래처관리대장 II 89
                    { propertyName: 'SALESSLIP', id: '66', isHideColumn: true, title: resource.LBL00315, width: 120, controlType: 'widget.select', editableState: 1 }, //거래명세서 66
                    { propertyName: 'QUOTATION', id: '22', isHideColumn: true, title: resource.LBL00420, width: 120, controlType: 'widget.select', editableState: 1 }, //견적서 22
                    { propertyName: 'PURCHASEORDER', id: '33', isHideColumn: true, title: resource.LBL00672, width: 120, controlType: 'widget.select', editableState: 1 }, //발주서 33
                    { propertyName: 'SALESORDER', id: '23', isHideColumn: true, title: resource.LBL02586, width: 120, controlType: 'widget.select', editableState: 1 }, //주문서 23
                    { propertyName: 'RFQ', id: '24', isHideColumn: true, title: resource.LBL07386, width: 120, controlType: 'widget.select', editableState: 1 }, //단가요청서 24
                    { propertyName: 'INVOICEPACKINGLIST', id: '46', isHideColumn: true, title: resource.LBL90008, width: 120, controlType: 'widget.select', editableState: 1 }, //Invoice / Packing List 46
                    { propertyName: 'REPAIRORDER', id: '92', isHideColumn: true, title: resource.LBL05319, width: 120, controlType: 'widget.select', editableState: 1 }, //A/S접수 92

                    { propertyName: 'SCHEDULEDRECEIPT', id: '82', isHideColumn: true, title: resource.LBL16416, width: 120, controlType: 'widget.select', editableState: 1 }, //입고예정 82
                    { propertyName: 'SCHEDULEDRELEASE', id: '83', isHideColumn: true, title: resource.LBL16534, width: 120, controlType: 'widget.select', editableState: 1 }, //출고예정 83
                    { propertyName: 'INCREASE', id: '84', isHideColumn: true, title: resource.LBL02237, width: 120, controlType: 'widget.select', editableState: 1 }, //입고 84
                    { propertyName: 'RELEASE', id: '85', isHideColumn: true, title: resource.LBL10476, width: 120, controlType: 'widget.select', editableState: 1 }, //출고 85
                    { propertyName: 'RECEIPTORDER', id: '86', isHideColumn: true, title: resource.LBL18631, width: 120, controlType: 'widget.select', editableState: 1 }, //입고지시 86
                    { propertyName: 'RELEASEORDER', id: '87', isHideColumn: true, title: resource.LBL17941, width: 120, controlType: 'widget.select', editableState: 1 }, //출고지시 87

                    { propertyName: 'PAYROLLSTATEMENT', id: '11', isHideColumn: true, title: resource.LBL05040, width: 120, controlType: 'widget.select', editableState: 1 }, // 급여1 > 급여명세서 11
                    { propertyName: 'PAYROLLSTATEMENTII', id: '19', isHideColumn: true, title: resource.LBL13036, width: 120, controlType: 'widget.select', editableState: 1 }, // 급여2 > 급여명세서 19
                    { propertyName: 'TWRECEIPT', id: '12', isHideColumn: true, title: resource.LBL93226, width: 120, controlType: 'widget.select', editableState: 1 }, //원천징수영수증(보관용) 12
                    { propertyName: 'RETIREMENTINCOME', id: '13', isHideColumn: true, title: resource.LBL02916, width: 120, controlType: 'widget.select', editableState: 1 }, //퇴직소득원천징수영수증 13

                    { propertyName: 'BUSINESSINCOME', id: '15', isHideColumn: true, title: resource.LBL06370, width: 120, controlType: 'widget.select', editableState: 1 }, //사업소득원천징수영수증 15
                    { propertyName: 'INTERESTDIVIDENDINCOME', id: '16', isHideColumn: true, title: resource.LBL06373, width: 120, controlType: 'widget.select', editableState: 1 }, //이자배당소득원천징수영수증 16
                    { propertyName: 'ETCINCOME', id: '17', isHideColumn: true, title: resource.LBL06374, width: 120, controlType: 'widget.select', editableState: 1 }, //기타소득원천징수영수증 17
                    { propertyName: 'ETCINCOMEBYRESIDENT', id: '10', isHideColumn: true, title: resource.LBL14260, width: 120, controlType: 'widget.select', editableState: 1 }, //비거주자기타소득원천징수영수증 10
                    { propertyName: 'WITHHOLDINGTAXLEDGER', id: '21', isHideColumn: true, title: resource.LBL93212, width: 120, controlType: 'widget.select', editableState: 1 }, //원천징수부 21
                    { propertyName: 'WITHHOLDINGFORDAILYWORKER', id: '20', isHideColumn: true, title: resource.LBL07460, width: 120, controlType: 'widget.select', editableState: 1 }, //원천징수영수증(일용직) 20

                    //{ propertyName: 'RECEIPTFORTAX', id: '18', isHideColumn: true, title: resource.LBL10337, width: 120, controlType: 'widget.select', editableState: 1 }, //원천징수영수증 18      
                    { propertyName: 'SMS', id: '77', isHideColumn: true, title: resource.LBL01177, width: 120, controlType: 'widget.select', editableState: 1 },//SMS 77 
                    { propertyName: 'CONTRACT', id: '48', isHideColumn: true, title: (this.FORM_TYPE == 'AF810' ? resource.LBL10497 : resource.LBL12268), width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'INTERNALUSE', id: '70', isHideColumn: true, title: resource.LBL02283, width: 120, controlType: 'widget.select', editableState: 1 }, // internal use
                    { propertyName: 'GOODSISSUE', id: '36', isHideColumn: true, title: resource.LBL04936, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SHIPPINGORDER', id: '26', isHideColumn: true, title: resource.LBL03962, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SHIPPING', id: '27', isHideColumn: true, title: resource.LBL04030, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PRODUCTDEFECT', id: '40', isHideColumn: true, title: resource.LBL93362, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'LOCATIONTRANS', id: '38', isHideColumn: true, title: resource.LBL02728, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PURCHASE', id: '34', isHideColumn: true, title: resource.LBL00692, width: 120, controlType: 'widget.select', editableState: 1 }, // Purchase
                    { propertyName: 'PURCHASEREQUEST', id: '30', isHideColumn: true, title: resource.LBL93320, width: 120, controlType: 'widget.select', editableState: 1 }, // Purchase Request
                    { propertyName: 'QUALITYINSPREQUEST', id: '71', isHideColumn: true, title: resource.LBL10942, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'JOBORDER', id: '35', isHideColumn: true, title: resource.LBL01489, width: 120, controlType: 'widget.select', editableState: 1 }, // job order
                    { propertyName: 'QUALITYINSPECTION', id: '72', isHideColumn: true, title: resource.LBL09840, width: 120, controlType: 'widget.select', editableState: 1 }, // Quality Insp.
                    { propertyName: 'RELEASESALESORDER', id: '28', isHideColumn: true, title: resource.LBL90113, width: 120, controlType: 'widget.select', editableState: 1 }, // Release Sales Order
                    { propertyName: 'GOODSRECEIPT', id: '37', isHideColumn: true, title: resource.LBL04937, width: 120, controlType: 'widget.select', editableState: 1 }, // Goods Receipt 
                    { propertyName: 'WEBMAIL', id: '94', isHideColumn: true, title: resource.LBL05127, width: 120, controlType: 'widget.select', editableState: 1 }, // WebMail
                    { propertyName: 'CERTIFICATE', id: '78', isHideColumn: true, title: resource.LBL00274, width: 120, controlType: 'widget.select', editableState: 1 }, // CERTIFICATE
                    { propertyName: 'DEPOSITSLIP', id: '29', isHideColumn: true, title: resource.LBL04366, width: 120, controlType: 'widget.select', editableState: 1 }, // 입금표
                    { propertyName: 'REPAIR2_MAIL', id: '73', isHideColumn: true, title: resource.LBL90140, width: 120, controlType: 'widget.select', editableState: 1 }, //A/S수리증 73
                    { propertyName: 'SALESSTATUS', id: '67', isHideColumn: true, title: ecount.resource.LBL02939, width: 120, controlType: 'widget.select', editableState: 1 },//판매현황
                    { propertyName: 'ORDERSTATUS', id: '68', isHideColumn: true, title: ecount.resource.LBL02963, width: 120, controlType: 'widget.select', editableState: 1 },//주문서현황
                    { propertyName: 'ESTIMATESTATUS', id: '69', isHideColumn: true, title: ecount.resource.LBL93402, width: 120, controlType: 'widget.select', editableState: 1 },//견적서현황
                    { propertyName: 'PURCHASESTATUS', id: '76', isHideColumn: true, title: ecount.resource.LBL35299, width: 120, controlType: 'widget.select', editableState: 1 }//구매현황

                ];
            }



            settings
                .setCheckBoxUse(true)
                .setRowData(this.viewBag.InitDatas.EditListLoad)
                .setRowDataParameter(this.searchFormParameter)
                .setRowDataUrl('/Common/Infra/GetListForSearchEmailEdit')
                .setColumns(this.columns)
                .setEditable(true, 30, 0)

            for (var i = 1, len = this.columns.length; i < len; i++) {

                settings.setCustomRowCell(this.columns[i].id, function (value, rowItem) {
                    var option = {
                    };
                    var selectOption = new Array();
                    selectOption.push(['0', ecount.resource.LBL80300]);
                    selectOption.push(['1', ecount.resource.LBL04417]);
                    selectOption.push(['2', ecount.resource.LBL85190]);
                    option.optionData = selectOption;

                    //Y : 기본, N : 사용, 빈값 : 사용안함
                    option.data = (function () {
                        if (value == 'Y') {
                            return "0";
                        } else if (value == 'N') {
                            return "1";
                        } else {
                            return "2";
                        }
                    }());
                    option.event = {
                        'change': function (e, data) {
                            //if (data.rowItem.SEND_COMMNET == "") {
                            //    var option = {},
                            //        send_ser = this.searchFormParameter.SEND_SER;

                            //    if (send_ser === "SJ") {
                            //        option.message = ecount.resource.MSG00339; // 수신자 이메일을 입력바랍니다.
                            //    } else if (send_ser === "EM") {
                            //        option.message = ecount.resource.MSG05663; // "메일 추가내용을 입력하세요";
                            //    } else {
                            //        option.message = ecount.resource.MSG05664; //"SMS 발송문구를  입력하세요";
                            //    }
                            //    this.gridObject.setCellShowError("SEND_COMMNET", data.rowKey, option);
                            //    this.gridObject.setCell(data.columnId, data.rowKey, data.oldValue);
                            //    return false;
                            //}
                            if (data.newValue == '0') {
                                var arrGridData = this.gridObject.getRowList();

                                $.each(arrGridData, function (i, item) {
                                    if (item[data.columnProperty] == '0' && item[ecount.grid.constValue.keyColumnPropertyName] !== data.rowKey)
                                        this.gridObject.setCell(data.columnId, item[ecount.grid.constValue.keyColumnPropertyName], '2');
                                }.bind(this));
                            }
                        }.bind(this)
                    }
                    return option;
                }.bind(this))
            }

            if (this.SEND_SER !== 'SM') {
                //툴바
                toolbar.setId("AddColumns")
                    .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                    .addLeft(ctrl.define("widget.label", "Info", "Info").label("<span class=\"wrapper-sub-title\">" + ecount.resource.MSG05662 + "</span>").useHTML())// 기본 설정값은 서식별로 한명만 지정 가능 합니다.
                    .addRight(ctrl.define("widget.button", "AddColumns").label("+"))
            }
        }
        contents
            .add(toolbar)
            .addGrid("dataGrid", settings)
        // this.$el.hide();
    },

    setGridDefault: function () {

        //select 

    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var ctrl = widget.generator.control();
        var toolbar = widget.generator.toolbar();
        var keyHelper = [10, 11];

        if (!this.searchFormParameter.Edit) {
            toolbar.addLeft(ctrl.define("widget.button", "edit").label(ecount.resource.BTN80002))
                .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        } else {
            if (this.OLD_TF) {
                toolbar
                    .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
            }
            else {
                toolbar
                    .addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065))
                    .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                    .addLeft(ctrl.define("widget.button", "deleteMulti").label(ecount.resource.BTN00037))
                    .addLeft(ctrl.define("widget.button", "history").label("H"));
            }
        }
        footer.add(toolbar);
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function (e) {
        var grid = this.contents.getGrid('dataGrid');
        grid.getSettings().setHeaderTopMargin(this.header.height());
        var gridEditable = this.contents.getGrid("dataGrid").grid;

        if (!$.isNull(this.keyword) && !this.searchFormParameter.Edit) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (this.searchFormParameter.Edit) {
            for (var i = 1, len = this.columns.length; i < len; i++) {
                if (this.searchFormParameter.DOC_GUBUN == this.columns[i].id) {
                    gridEditable.setColumnVisibility(this.columns[i].id, true);
                }
            }
        }
        if (!e.unfocus) {
            this.header.getQuickSearchControl() && this.header.getQuickSearchControl().setFocus(0);
        }
        //  this.$el.show();
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    type: (this.SEND_SER == 'SJ' || this.SEND_SER == 'GJ') ? 'sjComment' : ((this.SEND_SER == 'SM' || this.SEND_SER == 'GM') ? 'smComment' : 'emComment'),
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
                this.close();
            }.bind(this)
        };
        return option;
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        this.gridObject = this.contents.getGrid().grid;
        var value = '';
        if (!this.searchFormParameter.Edit) {
            value = this.header.getQuickSearchControl().getValue();
        }
        if (data.dataCount === 1 && !$.isEmpty(value)) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                type: (this.SEND_SER == 'SJ' || this.SEND_SER == 'GJ') ? 'sjComment' : ((this.SEND_SER == 'SM' || this.SEND_SER == 'GM') ? 'smComment' : 'emComment'),
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
            this.close();
        } else {
            ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        }

    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    // 편집
    onFooterEdit: function () {
        this.onContentsPopup();
    },
    // 저장
    onFooterSave: function () {
        var self = this;
        this.dataValidation(function () {
            var gridFilteringData = this.gridObject.getRowList().where(function (entity, i) {
                return !$.isEmpty(entity.SEND_COMMNET);
            });

            if (gridFilteringData.length == 0) {
                this.getParentInstance(this.parentPageID)._ON_REDRAW();
                this.close();
                return false;
            }

            arraySaveData = [];
            $.each(gridFilteringData, function (i, item) {
                arraySaveData.push({
                    SEND_GUBUN: this.SEND_SER,
                    SEND_SER: item.SEND_SER,
                    SEND_COMMNET: item.SEND_COMMNET,
                    DOC_GUBUN_LIST: (function (_item) {
                        var docGubunList = '';

                        if (["GJ", "GM", "GE"].contains(this.SEND_SER)) {
                            //if (_item.SURVEY == '0' || _item.SURVEY == '1')
                            //    docGubunList += '80' + ecount.delimiter
                            if (_item.SHAREBOARD == '0' || _item.SHAREBOARD == '1')
                                docGubunList += '95' + ecount.delimiter
                            if (_item.WORKBOARD == '0' || _item.WORKBOARD == '1')
                                docGubunList += '96' + ecount.delimiter
                            if (_item.CRMBOARD == '0' || _item.CRMBOARD == '1')
                                docGubunList += '97' + ecount.delimiter
                            if (_item.PROJECTBOARD == '0' || _item.PROJECTBOARD == '1')
                                docGubunList += '81' + ecount.delimiter
                        }
                        else {
                            if (_item.PAYROLLSTATEMENT == '0' || _item.PAYROLLSTATEMENT == '1')
                                docGubunList += '11' + ecount.delimiter
                            if (_item.PAYROLLSTATEMENTII == '0' || _item.PAYROLLSTATEMENTII == '1')
                                docGubunList += '19' + ecount.delimiter
                            if (_item.TWRECEIPT == '0' || _item.TWRECEIPT == '1')
                                docGubunList += '12' + ecount.delimiter
                            if (_item.RETIREMENTINCOME == '0' || _item.RETIREMENTINCOME == '1')
                                docGubunList += '13' + ecount.delimiter
                            //if (_item.RECEIPTFORTAX == '0' || _item.RECEIPTFORTAX == '1')
                            //    docGubunList += '18' + ecount.delimiter
                            if (_item.QUOTATION == '0' || _item.QUOTATION == '1')
                                docGubunList += '22' + ecount.delimiter
                            if (_item.SALESORDER == '0' || _item.SALESORDER == '1')
                                docGubunList += '23' + ecount.delimiter
                            if (_item.RFQ == '0' || _item.RFQ == '1')
                                docGubunList += '24' + ecount.delimiter
                            if (_item.PURCHASEORDER == '0' || _item.PURCHASEORDER == '1')
                                docGubunList += '33' + ecount.delimiter
                            if (_item.TAXINVOICES == '0' || _item.TAXINVOICES == '1')
                                docGubunList += '44' + ecount.delimiter
                            if (_item.ELECTRONICTAXINVOICE == '0' || _item.ELECTRONICTAXINVOICE == '1')
                                docGubunList += '45' + ecount.delimiter
                            if (_item.ELECTRONICTAXINVOICETW == '0' || _item.ELECTRONICTAXINVOICETW == '1')
                                docGubunList += '49' + ecount.delimiter
                            if (_item.INVOICEPACKINGLIST == '0' || _item.INVOICEPACKINGLIST == '1')
                                docGubunList += '46' + ecount.delimiter
                            if (_item.SALESSLIP == '0' || _item.SALESSLIP == '1')
                                docGubunList += '66' + ecount.delimiter
                            if (_item.SMS == '0' || _item.SMS == '1')
                                docGubunList += '77' + ecount.delimiter
                            if (_item.CUSTOMERVENDORBOOK1 == '0' || _item.CUSTOMERVENDORBOOK1 == '1')
                                docGubunList += '88' + ecount.delimiter
                            if (_item.CUSTOMERVENDORBOOK2 == '0' || _item.CUSTOMERVENDORBOOK2 == '1')
                                docGubunList += '89' + ecount.delimiter
                            if (_item.REPAIRORDER == '0' || _item.REPAIRORDER == '1')
                                docGubunList += '92' + ecount.delimiter
                            if (_item.CONTRACT == '0' || _item.CONTRACT == '1')
                                docGubunList += '48' + ecount.delimiter
                            if (_item.INTERNALUSE == '0' || _item.INTERNALUSE == '1')
                                docGubunList += '70' + ecount.delimiter
                            if (_item.GOODSISSUE == '0' || _item.GOODSISSUE == '1')
                                docGubunList += '36' + ecount.delimiter
                            if (_item.SHIPPINGORDER == '0' || _item.SHIPPINGORDER == '1')
                                docGubunList += '26' + ecount.delimiter
                            if (_item.SHIPPING == '0' || _item.SHIPPING == '1')
                                docGubunList += '27' + ecount.delimiter
                            if (_item.PURCHASE == '0' || _item.PURCHASE == '1')
                                docGubunList += '34' + ecount.delimiter
                            if (_item.PRODUCTDEFECT == '0' || _item.PRODUCTDEFECT == '1')
                                docGubunList += '40' + ecount.delimiter
                            if (_item.LOCATIONTRANS == '0' || _item.LOCATIONTRANS == '1')
                                docGubunList += '38' + ecount.delimiter
                            if (_item.PURCHASEREQUEST == '0' || _item.PURCHASEREQUEST == '1')
                                docGubunList += '30' + ecount.delimiter
                            if (_item.QUALITYINSPREQUEST == '0' || _item.QUALITYINSPREQUEST == '1')
                                docGubunList += '71' + ecount.delimiter
                            if (_item.JOBORDER == '0' || _item.JOBORDER == '1')
                                docGubunList += '35' + ecount.delimiter
                            if (_item.QUALITYINSPECTION == '0' || _item.QUALITYINSPECTION == '1')
                                docGubunList += '72' + ecount.delimiter
                            if (_item.RELEASESALESORDER == '0' || _item.RELEASESALESORDER == '1')
                                docGubunList += '28' + ecount.delimiter
                            if (_item.GOODSRECEIPT == '0' || _item.GOODSRECEIPT == '1')
                                docGubunList += '37' + ecount.delimiter
                            if (_item.WEBMAIL == '0' || _item.WEBMAIL == '1')
                                docGubunList += '94' + ecount.delimiter
                            if (_item.BUSINESSINCOME == '0' || _item.BUSINESSINCOME == '1')
                                docGubunList += '15' + ecount.delimiter
                            if (_item.INTERESTDIVIDENDINCOME == '0' || _item.INTERESTDIVIDENDINCOME == '1')
                                docGubunList += '16' + ecount.delimiter
                            if (_item.ETCINCOME == '0' || _item.ETCINCOME == '1')
                                docGubunList += '17' + ecount.delimiter
                            if (_item.ETCINCOMEBYRESIDENT == '0' || _item.ETCINCOMEBYRESIDENT == '1')
                                docGubunList += '10' + ecount.delimiter
                            if (_item.WITHHOLDINGTAXLEDGER == '0' || _item.WITHHOLDINGTAXLEDGER == '1')
                                docGubunList += '21' + ecount.delimiter
                            if (_item.WITHHOLDINGFORDAILYWORKER == '0' || _item.WITHHOLDINGFORDAILYWORKER == '1')
                                docGubunList += '20' + ecount.delimiter
                            if (_item.DEPOSITSLIP == '0' || _item.DEPOSITSLIP == '1')
                                docGubunList += '29' + ecount.delimiter
                            if (_item.REPAIR2_MAIL == '0' || _item.REPAIR2_MAIL == '1')
                                docGubunList += '73' + ecount.delimiter
                            if (_item.SCHEDULEDRECEIPT == '0' || _item.SCHEDULEDRECEIPT == '1')
                                docGubunList += '82' + ecount.delimiter
                            if (_item.SCHEDULEDRELEASE == '0' || _item.SCHEDULEDRELEASE == '1')
                                docGubunList += '83' + ecount.delimiter
                            if (_item.INCREASE == '0' || _item.INCREASE == '1')
                                docGubunList += '84' + ecount.delimiter
                            if (_item.RELEASE == '0' || _item.RELEASE == '1')
                                docGubunList += '85' + ecount.delimiter
                            if (_item.RECEIPTORDER == '0' || _item.RECEIPTORDER == '1')
                                docGubunList += '86' + ecount.delimiter
                            if (_item.RELEASEORDER == '0' || _item.RELEASEORDER == '1')
                                docGubunList += '87' + ecount.delimiter
                            if (_item.SALESSTATUS == '0' || _item.SALESSTATUS == '1')
                                docGubunList += '67' + ecount.delimiter
                            if (_item.ORDERSTATUS == '0' || _item.ORDERSTATUS == '1')
                                docGubunList += '68' + ecount.delimiter
                            if (_item.ESTIMATESTATUS == '0' || _item.ESTIMATESTATUS == '1')
                                docGubunList += '69' + ecount.delimiter
                            if (_item.PURCHASESTATUS == '0' || _item.PURCHASESTATUS == '1')
                                docGubunList += '76' + ecount.delimiter
                        }
                        return docGubunList;

                    }.bind(this))(item),
                    HEAD_YN_LIST: (function (_item) {
                        var headYnList = '';

                        if (["GJ", "GM", "GE"].contains(this.SEND_SER)) {
                            //if (_item.SURVEY == '0')
                            //    headYnList += '80' + ecount.delimiter
                            if (_item.SHAREBOARD == '0')
                                headYnList += '95' + ecount.delimiter
                            if (_item.WORKBOARD == '0')
                                headYnList += '96' + ecount.delimiter
                            if (_item.CRMBOARD == '0')
                                headYnList += '97' + ecount.delimiter
                            if (_item.PROJECTBOARD == '0')
                                headYnList += '81' + ecount.delimiter
                        }
                        else {
                            if (_item.PAYROLLSTATEMENT == '0')
                                headYnList += '11' + ecount.delimiter
                            if (_item.TWRECEIPT == '0')
                                headYnList += '12' + ecount.delimiter
                            if (_item.RETIREMENTINCOME == '0')
                                headYnList += '13' + ecount.delimiter
                            //if (_item.RECEIPTFORTAX == '0')
                            //    headYnList += '18' + ecount.delimiter
                            if (_item.PAYROLLSTATEMENTII == '0')
                                headYnList += '19' + ecount.delimiter
                            if (_item.QUOTATION == '0')
                                headYnList += '22' + ecount.delimiter
                            if (_item.SALESORDER == '0')
                                headYnList += '23' + ecount.delimiter
                            if (_item.RFQ == '0')
                                headYnList += '24' + ecount.delimiter
                            if (_item.PURCHASEORDER == '0')
                                headYnList += '33' + ecount.delimiter
                            if (_item.TAXINVOICES == '0')
                                headYnList += '44' + ecount.delimiter
                            if (_item.ELECTRONICTAXINVOICE == '0')
                                headYnList += '45' + ecount.delimiter
                            if (_item.ELECTRONICTAXINVOICETW == '0')
                                headYnList += '49' + ecount.delimiter
                            if (_item.INVOICEPACKINGLIST == '0')
                                headYnList += '46' + ecount.delimiter
                            if (_item.SALESSLIP == '0')
                                headYnList += '66' + ecount.delimiter
                            if (_item.SMS == '0')
                                headYnList += '77' + ecount.delimiter
                            if (_item.CUSTOMERVENDORBOOK1 == '0')
                                headYnList += '88' + ecount.delimiter
                            if (_item.CUSTOMERVENDORBOOK2 == '0')
                                headYnList += '89' + ecount.delimiter
                            if (_item.REPAIRORDER == '0')
                                headYnList += '92' + ecount.delimiter
                            if (_item.CONTRACT == '0')
                                headYnList += '48' + ecount.delimiter
                            if (_item.INTERNALUSE == '0')
                                headYnList += '70' + ecount.delimiter
                            if (_item.GOODSISSUE == '0')
                                headYnList += '36' + ecount.delimiter
                            if (_item.SHIPPINGORDER == '0')
                                headYnList += '26' + ecount.delimiter
                            if (_item.SHIPPING == '0')
                                headYnList += '27' + ecount.delimiter
                            if (_item.PURCHASE == '0')
                                headYnList += '34' + ecount.delimiter
                            if (_item.PRODUCTDEFECT == '0')
                                headYnList += '40' + ecount.delimiter
                            if (_item.LOCATIONTRANS == '0')
                                headYnList += '38' + ecount.delimiter
                            if (_item.PURCHASEREQUEST == '0')
                                headYnList += '30' + ecount.delimiter
                            if (_item.QUALITYINSPREQUEST == '0')
                                headYnList += '71' + ecount.delimiter
                            if (_item.JOBORDER == '0')
                                headYnList += '35' + ecount.delimiter
                            if (_item.QUALITYINSPECTION == '0')
                                headYnList += '72' + ecount.delimiter
                            if (_item.RELEASESALESORDER == '0')
                                headYnList += '28' + ecount.delimiter
                            if (_item.GOODSRECEIPT == '0')
                                headYnList += '37' + ecount.delimiter
                            if (_item.WEBMAIL == '0')
                                headYnList += '94' + ecount.delimiter
                            if (_item.BUSINESSINCOME == '15')
                                headYnList += '15' + ecount.delimiter
                            if (_item.INTERESTDIVIDENDINCOME == '16')
                                headYnList += '16' + ecount.delimiter
                            if (_item.ETCINCOME == '17')
                                headYnList += '17' + ecount.delimiter
                            if (_item.ETCINCOMEBYRESIDENT == '10')
                                headYnList += '10' + ecount.delimiter
                            if (_item.WITHHOLDINGTAXLEDGER == '21')
                                headYnList += '21' + ecount.delimiter
                            if (_item.WITHHOLDINGFORDAILYWORKER == '0')
                                headYnList += '20' + ecount.delimiter
                            if (_item.DEPOSITSLIP == '0')
                                headYnList += '29' + ecount.delimiter
                            if (_item.REPAIR2_MAIL == '0')
                                headYnList += '73' + ecount.delimiter
                            if (_item.SCHEDULEDRECEIPT == '0')
                                headYnList += '82' + ecount.delimiter
                            if (_item.SCHEDULEDRELEASE == '0')
                                headYnList += '83' + ecount.delimiter
                            if (_item.INCREASE == '0')
                                headYnList += '84' + ecount.delimiter
                            if (_item.RELEASE == '0')
                                headYnList += '85' + ecount.delimiter
                            if (_item.RECEIPTORDER == '0')
                                headYnList += '86' + ecount.delimiter
                            if (_item.RELEASEORDER == '0')
                                headYnList += '87' + ecount.delimiter
                            if (_item.SALESSTATUS == '0')
                                headYnList += '67' + ecount.delimiter
                            if (_item.ORDERSTATUS == '0')
                                headYnList += '68' + ecount.delimiter
                            if (_item.ESTIMATESTATUS == '0')
                                headYnList += '69' + ecount.delimiter
                            if (_item.PURCHASESTATUS == '0')
                                headYnList += '76' + ecount.delimiter
                        }
                        debugger;
                        return headYnList;

                    }.bind(this))(item)
                });
            }.bind(this))

            ecount.common.api({
                url: '/Common/Infra/SaveMailContentsInfo',//'/Common/Infra/SaveMailInfo',
                data: Object.toJSON({ mailInfo: arraySaveData }),
                success: function (result) {
                    this.footer.getControl('save').setAllowClick();
                    this.setTimeout(function () {
                        this.getParentInstance(this.parentPageID)._ON_REDRAW();
                        this.close();
                    }.bind(this), 0);
                }.bind(this)
            })
        }.bind(this));
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    // 팝업
    onContentsPopup: function () {
        this.searchFormParameter.Edit = true;
        var label = ecount.resource.LBL80149;
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: this.resource.title + ' ' + label,
            additional: true,

            param: {
                width: 600,
                height: 500,
                SEND_SER: this.searchFormParameter.SEND_SER,
                DOC_GUBUN: this.searchFormParameter.DOC_GUBUN,
                Edit: this.searchFormParameter.Edit
            }
        });
        this.searchFormParameter.Edit = false;

    },
    //이력
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.viewBag.InitDatas.EditListLoad.length > 0 ? this.viewBag.InitDatas.EditListLoad[0].EDIT_DT : "",
            lastEditId: this.viewBag.InitDatas.EditListLoad.length > 0 ? this.viewBag.InitDatas.EditListLoad[0].EDITOR_ID : ""
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            additional: true
        });
    },

    // 선택삭제
    onFooterDeleteMulti: function (cid) {

        var btnDeleteMulti = this.footer.get(0).getControl("deleteMulti");
        var delItem = this.contents.getGrid().grid.getChecked();
        var uniqueItems = new Array();

        if (delItem.length == 0) {
            ecount.alert(ecount.resource.MSG00303);//삭제할 항목을 선택 바랍니다.
            btnDeleteMulti.setAllowClick();
            return false;
        }

        $.each($.makeArray(delItem), function (i, el) {
            uniqueItems.push(el.SEND_SER);
        });
        var formData = Object.toJSON({
            SEND_SER_LIST: uniqueItems
        });

        var strUrl = "/Common/Infra/DeleteMultiEmailSend";
        //if (confirm(ecount.resource.MSG00299)) { // 삭제하시겠습니까?
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: strUrl,
                    async: false,
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else {
                            this.contents.getGrid().draw(this.searchFormParameter);
                        }
                    }.bind(this)
                });
            }
            btnDeleteMulti.setAllowClick();
        }.bind(this));
    },

    onContentsAddColumns: function (event) {
        var width = ["GJ", "GM", "GE"].contains(this.SEND_SER) ? 495 : 0;
        var grid = this.contents.getGrid("dataGrid").grid;
        var windowSize = this.getWindowSize();

        for (var i = 1, len = this.columns.length; i < len; i++) {
            grid.setColumnVisibility(this.columns[i].id, true);
            width += this.columns[i].width;
        }
        this.contents.getControl("AddColumns").hide();
        this.resizeLayer(Math.min(width, windowSize.screenWidth));
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // ON_KEY_F8
    ON_KEY_F8: function () {
        if (this.searchFormParameter.Edit)
            this.onFooterSave();
    },
    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // KEY_DOWN
    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
    },
    // KEY_UP
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
    },

    // KEY_Mouseup
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

    //저장버튼 클릭 시 Validation
    dataValidation: function (saveFunction) {
        var _saveFlag = true;

        //$.each(this.gridObject.getRowList(), function (i, item) {
        //    if (!$.isEmpty(item.SEND_SER) && $.isEmpty(item.SEND_COMMNET)) {
        //        var option = {};
        //        option.message = ecount.resource.MSG05665;
        //        this.gridObject.setCellShowError("SEND_COMMNET", item[ecount.grid.constValue.keyColumnPropertyName], option);
        //        _saveFlag = false;
        //        return false;
        //    }
        //}.bind(this));

        if (_saveFlag)
            saveFunction();
        else
            this.footer.getControl('save').setAllowClick();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.draw(this.searchFormParameter);
    },

    getTaxResource: function (resource) {
        var result = null;
        switch (this.viewBag.Nation) {
            case "KR":
                result = resource.LBL04785;
                break;
            case "TW":
                result = resource.LBL16316;
                break;
        }
        return result;
    }
});
//
//LBL05040:"@GetResource("LBL05040")",// 급여명세서 11
//LBL93226:"@GetResource("LBL93226")",//원천징수영수증(보관용) 12
//LBL02916:"@GetResource("LBL02916")",//퇴직소득원천징수영수증 13
//LBL93213:"@GetResource("LBL93213")",//원천징수영수증 18
//LBL00420:"@GetResource("LBL00420")",//견적서 22
//LBL02586:"@GetResource("LBL02586")",//주문서 23
//LBL07386:"@GetResource("LBL07386")",//단가요청서 24
//LBL00672:"@GetResource("LBL00672")",//발주서 33
//LBL01604:"@GetResource("LBL01604")",//(세금)계산서  Tax Invoices    44 
//LBL04785:"@GetResource("LBL04785")",// 전자(세금)계산서 Electronic (Tax) Invoice 45
//LBL90008:"@GetResource("LBL90008")",//Invoice / Packing List 46
//LBL00315:"@GetResource("LBL00315")",//거래명세서 66
//LBL01177:"@GetResource("LBL01177")",//SMS 77
//LBL00351:"@GetResource("LBL00351")",//거래처관리대장 88
//LBL06204:"@GetResource("LBL06204")",//거래처관리대장 II 89
//LBL05319:"@GetResource("LBL05319")",//A/S접수 92