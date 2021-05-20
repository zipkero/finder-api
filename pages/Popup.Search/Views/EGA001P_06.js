window.__define_resource && __define_resource("LBL06434","LBL03702","LBL10109","LBL05840","LBL02508","LBL00219","LBL00227","MSG01396","LBL00561","LBL08289","LBL04833","LBL03030","LBL06083","LBL00351","LBL06204","LBL00315","LBL00420","LBL00672","LBL02586","LBL07386","LBL90008","LBL05319","LBL90140","LBL16416","LBL16534","LBL02237","LBL10476","LBL18631","LBL17941","LBL05040","LBL13036","LBL93226","LBL02916","LBL06370","LBL06373","LBL06374","LBL14260","LBL93212","LBL07460","LBL10337","LBL00274","LBL12268","LBL02283","LBL04936","LBL03962","LBL04030","LBL00692","LBL93362","LBL93320","LBL02728","LBL10942","LBL01489","LBL09840","LBL90113","LBL04937","LBL04366","LBL02939","LBL02963","LBL93402","LBL35299","LBL80300","LBL04417","LBL85190","MSG05662","BTN80002","BTN00008","BTN00065","BTN00037","LBL07157","MSG00303","MSG00644","MSG05665","MSG02902","MSG01939","MSG00528","MSG00008","LBL04785","LBL16316");
/****************************************************************************************************
1. Create Date : 2015.09.14
2. Creator     : 전영준
3. Description : EMAil 회신 정보 팝업
4. Precaution  : 
5. History     : 2016.06.01 노지혜 : 수정
                 2017.04.11(Hao) - add doctype 70 (Internal Use)
                 2017.05.04(Hao) - add doctype 34 (Purchase)
                 2017.05.10(Bao) - add doctype 38 (Location Trans)
                 2017.05.23(Hao) - add doctype 30 (Purchase Request)
                 2017.08.04(Hao) - add doctype 28 (Release Sales Order)
                 2019.10.07(HEUNGSAN) - ADD 78 (GENERAL CERTIFICATE)
                 2019.11.07(한재국) - ADD DOCTYPE 29 (DEPOSITSLIP)
                 2020.02.07 (JINHO JANG) - ADD DOCTYPE 19 (PAYMENTSTATEMENT2)
                 2020.02.17 (이현택) - ADD DOCTYPE 20 (일용근로소득지급명세서(원천징수영수증))
                 2020.07.22 (왕승양) - 화피아오 DOC_GUBUN분리 49
                 2020.10.30 (정준호) A20_02943 - 외부알림1차
6. MenuPath    : Email > 회신담당자등록
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGA001P_06", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    gridObject: null, //getGrid
    columns: null,   //columns
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            SEND_SER: this.SEND_SER,
            DOC_GUBUN: this.DOC_GUBUN,
            TYPE: this.TYPE,
            SEARCH: this.keyword,
            Edit: this.Edit,
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
        header.notUsedBookmark();

        if (this.searchFormParameter.Edit) {
            header.setTitle(String.format(ecount.resource.LBL06434, ' ' + ecount.resource.LBL03702))  //회신담당자수정

        } else {
            header.setTitle(String.format(ecount.resource.LBL10109, ' ' + ecount.resource.LBL03702)) //회신담당자검색
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
            subtitle = generator.subTitle();

        if (!this.searchFormParameter.Edit) {
            settings
                .setEventFocusOnInit(true)
                .setKeyboardCursorMove(true)
                .setKeyboardEnterForExecute(true)
                .setRowData(this.viewBag.InitDatas.ListLoad)
                .setRowDataParameter(this.searchFormParameter)
                .setRowDataUrl('/Common/Infra/GetListForSearchEmail')
                .setColumns([
                    { propertyName: 'SEND_NAME', id: 'SEND_NAME', title: ecount.resource.LBL05840, width: 120 },
                    { propertyName: 'SEND_TEL', id: 'SEND_TEL', title: ecount.resource.LBL02508, width: 120, align: 'center' },
                    { propertyName: 'SEND_EMAIL', id: 'SEND_EMAIL', title: ecount.resource.LBL00219, width: '', align: 'center' },
                    { propertyName: 'SEND_HP', id: 'SEND_HP', title: ecount.resource.LBL00227, width: 120, align: 'center' }
                ])
                .setColumnSortable(true)
                .setColumnSortExecuting(this.setColumnSortClick.bind(this))
                .setCustomRowCell('SEND_NAME', this.setGridDateLink.bind(this))
                .setCustomRowCell('SEND_TEL', this.setGridDateLink.bind(this))
                .setCustomRowCell('SEND_EMAIL', this.setGridDateLink.bind(this))
                .setCustomRowCell('SEND_HP', this.setGridDateLink.bind(this))

        } else {
            //EDITABLE

            if (["GA"].contains(this.SEND_SER)) {
                this.columns = [
                    { propertyName: 'SEND_NAME', id: 'SEND_NAME', title: ecount.resource.LBL05840, width: 90, controlType: 'widget.input', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 50 } } },
                    { propertyName: 'SEND_TEL', id: 'SEND_TEL', title: ecount.resource.LBL02508, width: 90, align: 'center', controlType: 'widget.input.numberOnlyAndSign', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 50 } } },
                    { propertyName: 'SEND_EMAIL', id: 'SEND_EMAIL', title: ecount.resource.LBL00219, width: 120, align: 'center', controlType: 'widget.input', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 100 } } },
                    { propertyName: 'SEND_HP', id: 'SEND_HP', title: ecount.resource.LBL00227, width: 120, align: 'center', controlType: 'widget.input.numberOnlyAndSign', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 50 } } },
                    { propertyName: 'SHAREBOARD', id: '95', isHideColumn: true, title: resource.LBL00561, width: 120, controlType: 'widget.select', editableState: 1 }, //공유정보게시판 95
                    { propertyName: 'WORKBOARD', id: '96', isHideColumn: true, title: resource.LBL08289, width: 120, controlType: 'widget.select', editableState: 1 }, //업무관리게시판 96
                    { propertyName: 'CRMBOARD', id: '97', isHideColumn: true, title: resource.LBL04833, width: 120, controlType: 'widget.select', editableState: 1 }, //고객관리게시판 97
                    { propertyName: 'PROJECTBOARD', id: '81', isHideColumn: true, title: resource.LBL03030, width: 120, controlType: 'widget.select', editableState: 1 } //프로젝트게시판 WORK
                ];
            }
            else {

                this.columns = [
                    { propertyName: 'SEND_NAME', id: 'SEND_NAME', title: ecount.resource.LBL05840, width: 90, controlType: 'widget.input', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 50 } } },
                    { propertyName: 'SEND_TEL', id: 'SEND_TEL', title: ecount.resource.LBL02508, width: 120, align: 'center', controlType: 'widget.input.numberOnlyAndSign', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 50 } } },
                    { propertyName: 'SEND_EMAIL', id: 'SEND_EMAIL', title: ecount.resource.LBL00219, width: 120, align: 'center', controlType: 'widget.input', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 100 } } },
                    { propertyName: 'SEND_HP', id: 'SEND_HP', title: ecount.resource.LBL00227, width: 120, align: 'center', controlType: 'widget.input.numberOnlyAndSign', editableState: 1, controlOption: { maxByte: { message: resource.MSG01396, max: 50 } } },
                    { propertyName: 'TAXINVOICES', id: '44', isHideColumn: true, title: ecount.resource.LBL06083, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: this.getTaxPropName(), id: this.getTaxDocGubun(), isHideColumn: true, title: this.getTaxResource(), width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'CUSTOMERVENDORBOOK1', id: '88', isHideColumn: true, title: ecount.resource.LBL00351, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'CUSTOMERVENDORBOOK2', id: '89', isHideColumn: true, title: ecount.resource.LBL06204, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SALESSLIP', id: '66', isHideColumn: true, title: ecount.resource.LBL00315, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'QUOTATION', id: '22', isHideColumn: true, title: ecount.resource.LBL00420, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PURCHASEORDER', id: '33', isHideColumn: true, title: ecount.resource.LBL00672, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SALESORDER', id: '23', isHideColumn: true, title: ecount.resource.LBL02586, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'RFQ', id: '24', isHideColumn: true, title: ecount.resource.LBL07386, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'INVOICEPACKINGLIST', id: '46', isHideColumn: true, title: ecount.resource.LBL90008, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'REPAIRORDER', id: '92', isHideColumn: true, title: ecount.resource.LBL05319, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'REPAIR', id: '73', isHideColumn: true, title: ecount.resource.LBL90140, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SCHEDULEDRECEIPT', id: '82', isHideColumn: true, title: ecount.resource.LBL16416, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SCHEDULEDRELEASE', id: '83', isHideColumn: true, title: ecount.resource.LBL16534, width: 120, controlType: 'widget.select', editableState: 1 }, 
                    { propertyName: 'INCREASE', id: '84', isHideColumn: true, title: resource.LBL02237, width: 120, controlType: 'widget.select', editableState: 1 }, 
                    { propertyName: 'RELEASE', id: '85', isHideColumn: true, title: resource.LBL10476, width: 120, controlType: 'widget.select', editableState: 1 }, 
                    { propertyName: 'RECEIPTORDER', id: '86', isHideColumn: true, title: resource.LBL18631, width: 120, controlType: 'widget.select', editableState: 1 }, 
                    { propertyName: 'RELEASEORDER', id: '87', isHideColumn: true, title: resource.LBL17941, width: 120, controlType: 'widget.select', editableState: 1 }, 

                    { propertyName: 'PAYROLLSTATEMENT', id: '11', isHideColumn: true, title: ecount.resource.LBL05040, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PAYROLLSTATEMENTII', id: '19', isHideColumn: true, title: ecount.resource.LBL13036, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'TWRECEIPT', id: '12', isHideColumn: true, title: ecount.resource.LBL93226, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'RETIREMENTINCOME', id: '13', isHideColumn: true, title: ecount.resource.LBL02916, width: 120, controlType: 'widget.select', editableState: 1 },

                    { propertyName: 'BUSINESSINCOME', id: '15', isHideColumn: true, title: ecount.resource.LBL06370, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'INTERESTDIVIDENDINCOME', id: '16', isHideColumn: true, title: ecount.resource.LBL06373, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'ETCINCOME', id: '17', isHideColumn: true, title: ecount.resource.LBL06374, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'ETCINCOMEBYRESIDENT', id: '10', isHideColumn: true, title: ecount.resource.LBL14260, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'WITHHOLDINGTAXLEDGER', id: '21', isHideColumn: true, title: ecount.resource.LBL93212, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'WITHHOLDINGFORDAILYWORKER', id: '20', isHideColumn: true, title: ecount.resource.LBL07460, width: 120, controlType: 'widget.select', editableState: 1 },

                    //{ propertyName: 'RECEIPTFORTAX', id: '18', isHideColumn: true, title: ecount.resource.LBL10337, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'CERTIFICATE', id: '78', isHideColumn: true, title: ecount.resource.LBL00274, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'CONTRACT', id: '48', isHideColumn: true, title: ecount.resource.LBL12268, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'INTERNALUSE', id: '70', isHideColumn: true, title: ecount.resource.LBL02283, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'GOODSISSUE', id: '36', isHideColumn: true, title: ecount.resource.LBL04936, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SHIPPINGORDER', id: '26', isHideColumn: true, title: ecount.resource.LBL03962, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SHIPPING', id: '27', isHideColumn: true, title: ecount.resource.LBL04030, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PURCHASE', id: '34', isHideColumn: true, title: ecount.resource.LBL00692, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PRODUCTDEFECT', id: '40', isHideColumn: true, title: ecount.resource.LBL93362, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PURCHASEREQUEST', id: '30', isHideColumn: true, title: ecount.resource.LBL93320, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'LOCATIONTRANS', id: '38', isHideColumn: true, title: ecount.resource.LBL02728, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'QUALITYINSPREQUEST', id: '71', isHideColumn: true, title: ecount.resource.LBL10942, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'JOBORDER', id: '35', isHideColumn: true, title: ecount.resource.LBL01489, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'QUALITYINSPECTION', id: '72', isHideColumn: true, title: ecount.resource.LBL09840, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'RELEASESALESORDER', id: '28', isHideColumn: true, title: ecount.resource.LBL90113, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'GOODSRECEIPT', id: '37', isHideColumn: true, title: ecount.resource.LBL04937, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'DEPOSITSLIP', id: '29', isHideColumn: true, title: ecount.resource.LBL04366, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'SALESSTATUS', id: '67', isHideColumn: true, title: ecount.resource.LBL02939, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'ORDERSTATUS', id: '68', isHideColumn: true, title: ecount.resource.LBL02963, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'ESTIMATESTATUS', id: '69', isHideColumn: true, title: ecount.resource.LBL93402, width: 120, controlType: 'widget.select', editableState: 1 },
                    { propertyName: 'PURCHASESTATUS', id: '76', isHideColumn: true, title: ecount.resource.LBL35299, width: 120, controlType: 'widget.select', editableState: 1 }

                ];
            }
            settings
                .setEditRowDataSample({ ISCHANGE: 'N' })
                .setCheckBoxUse(true)
                .setRowData(this.viewBag.InitDatas.ListLoad)
                .setRowDataParameter(this.searchFormParameter)
                .setRowDataUrl('/Common/Infra/GetListForSearchEmailEdit')
                .setColumns(this.columns)
                .setEditable(true, 3, 3)
                .setEventAutoAddRowOnLastRow(true, 2)
                .setCustomRowCell('SEND_NAME', this.setIsChangeProperty.bind(this))
                .setCustomRowCell('SEND_TEL', this.setIsChangeProperty.bind(this))
                .setCustomRowCell('SEND_EMAIL', this.setIsChangeProperty.bind(this))
                .setCustomRowCell('SEND_HP', this.setIsChangeProperty.bind(this))

            for (var i = 4, len = this.columns.length; i < len; i++) {
                //var thisPropertyName = this.columns[i].propertyName;
                settings.setCustomRowCell(this.columns[i].id, function (value, rowItem) {
                    var option = {};
                    var selectOption = new Array();
                    selectOption.push(['0', ecount.resource.LBL80300]);
                    selectOption.push(['1', ecount.resource.LBL04417]);
                    selectOption.push(['2', ecount.resource.LBL85190]);
                    option.optionData = selectOption;

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
                            if (data.newValue == '0') {
                                var arrGridData = this.gridObject.getRowList();

                                $.each(arrGridData, function (i, item) {
                                    if (item[data.columnProperty] == '0' && item[ecount.grid.constValue.keyColumnPropertyName] !== data.rowKey)
                                        this.gridObject.setCell(data.columnId, item[ecount.grid.constValue.keyColumnPropertyName], '2');
                                }.bind(this));
                            }

                            this.gridObject.setCell('ISCHANGE', data.rowKey, 'Y');
                        }.bind(this)
                    }
                    return option;
                }.bind(this))
            }

            //subtitle.title(ecount.resource.MSG05662)
            //    .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            //    .add(ctrl.define("widget.button", "AddColumns").label("+").end());
            toolbar.setId("AddColumns")
                .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                .addLeft(ctrl.define("widget.label", "Info", "Info").label("<span class=\"wrapper-sub-title\">" + ecount.resource.MSG05662 + "</span>").useHTML())// 기본 설정값은 서식별로 한명만 지정 가능 합니다.
                .addRight(ctrl.define("widget.button", "AddColumns").label("+"))
        }
        contents
            .add(toolbar)
            .addGrid("dataGrid", settings)
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        ctrl = widget.generator.control(),
            keyHelper = [10, 11];

        if (!this.searchFormParameter.Edit) {
            toolbar.addLeft(ctrl.define("widget.button", "edit").label(ecount.resource.BTN80002))
                .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        } else {
            toolbar
                .addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce())
                .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addLeft(ctrl.define("widget.button", "deleteMulti").label(ecount.resource.BTN00037))
                .addLeft(ctrl.define("widget.button", "history").label("H"));
        }
        footer.add(toolbar);
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword) && !this.searchFormParameter.Edit) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        if (this.searchFormParameter.Edit) {
            for (var i = 4, len = this.columns.length; i < len; i++) {
                if (this.searchFormParameter.DOC_GUBUN == this.columns[i].id) {
                    this.gridObject.setColumnVisibility(this.columns[i].id, true);
                }
            }
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl() && this.header.getQuickSearchControl().setFocus(0);
        }
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
                    type: 'infomation',
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this),
                    code: "SEND_SER",
                    name: "SEND_NAME"
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
                type: 'infomation',
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
                callback: this.close.bind(this),
                code: "SEND_SER",
                name: "SEND_NAME"
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

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        message.callback && message.callback();  // The popup page is closed   
    },

    // 팝업
    onContentsPopup: function () {
        this.searchFormParameter.Edit = true;
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_06',
            name: String.format(ecount.resource.LBL06434, ' ' + ecount.resource.LBL03702),
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: this.searchFormParameter.SEND_SER,
                DOC_GUBUN: this.searchFormParameter.DOC_GUBUN,
                Edit: this.searchFormParameter.Edit
            }
        });
        this.searchFormParameter.Edit = false;
    },

    onContentsAddColumns: function (event) {
        var width = 0;
        var windowSize = this.getWindowSize();

        for (var i = 1, len = this.columns.length; i < len; i++) {
            this.gridObject.setColumnVisibility(this.columns[i].id, true);
            width += this.columns[i].width;
        }
        this.contents.getControl("AddColumns").hide();
        this.resizeLayer(Math.min(width, windowSize.screenWidth));
    },

    // 저장
    onFooterSave: function () {

        this.dataValidation(function () {
            var gridFilteringData = this.gridObject.getRowList().where(function (entity, i) {
                //return entity.ISCHANGE == 'Y' &&
                //    (!$.isEmpty(entity.SEND_SER) ||  //수정인경우
                //        ($.isEmpty(entity.SEND_SER) && !$.isEmpty(entity.SEND_NAME) || !$.isEmpty(entity.SEND_TEL) || !$.isEmpty(entity.SEND_EMAIL) || !$.isEmpty(entity.SEND_HP)) //신규인경우
                //    );
                return !$.isEmpty(entity.SEND_NAME) || !$.isEmpty(entity.SEND_TEL) || !$.isEmpty(entity.SEND_EMAIL) || !$.isEmpty(entity.SEND_HP)
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
                    SEND_NAME: item.SEND_NAME,
                    SEND_TEL: item.SEND_TEL,
                    SEND_EMAIL: item.SEND_EMAIL,
                    SEND_HP: item.SEND_HP,
                    SEND_COMMNET: item.SEND_COMMNET,
                    DOC_GUBUN_LIST: (function (_item) {
                        var docGubunList = '';

                        if (["GA"].contains(this.SEND_SER)) {
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
                            if (_item.TWRECEIPT == '0' || _item.TWRECEIPT == '1')
                                docGubunList += '12' + ecount.delimiter
                            if (_item.RETIREMENTINCOME == '0' || _item.RETIREMENTINCOME == '1')
                                docGubunList += '13' + ecount.delimiter
                            //if (_item.RECEIPTFORTAX == '0' || _item.RECEIPTFORTAX == '1')
                            //    docGubunList += '18' + ecount.delimiter
                            if (_item.PAYROLLSTATEMENTII == '0' || _item.PAYROLLSTATEMENTII == '1')
                                docGubunList += '19' + ecount.delimiter
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
                            if (_item.CUSTOMERVENDORBOOK1 == '0' || _item.CUSTOMERVENDORBOOK1 == '1')
                                docGubunList += '88' + ecount.delimiter
                            if (_item.CUSTOMERVENDORBOOK2 == '0' || _item.CUSTOMERVENDORBOOK2 == '1')
                                docGubunList += '89' + ecount.delimiter
                            if (_item.REPAIRORDER == '0' || _item.REPAIRORDER == '1')
                                docGubunList += '92' + ecount.delimiter
                            if (_item.REPAIR == '0' || _item.REPAIR == '1')
                                docGubunList += '73' + ecount.delimiter
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
                            if (_item.CERTIFICATE == '0' || _item.CERTIFICATE == '1')
                                docGubunList += '78' + ecount.delimiter
                            if (_item.DEPOSITSLIP == '0' || _item.DEPOSITSLIP == '1')
                                docGubunList += '29' + ecount.delimiter
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

                        if (["GA"].contains(this.SEND_SER)) {
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
                            if (_item.PAYROLLSTATEMENTII == '0')
                                headYnList += '19' + ecount.delimiter
                            if (_item.TWRECEIPT == '0')
                                headYnList += '12' + ecount.delimiter
                            if (_item.RETIREMENTINCOME == '0')
                                headYnList += '13' + ecount.delimiter
                            //if (_item.RECEIPTFORTAX == '0')
                            //    headYnList += '18' + ecount.delimiter
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
                            if (_item.CUSTOMERVENDORBOOK1 == '0')
                                headYnList += '88' + ecount.delimiter
                            if (_item.CUSTOMERVENDORBOOK2 == '0')
                                headYnList += '89' + ecount.delimiter
                            if (_item.REPAIRORDER == '0')
                                headYnList += '92' + ecount.delimiter
                            if (_item.REPAIR == '0')
                                headYnList += '73' + ecount.delimiter
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
                            if (_item.BUSINESSINCOME == '0')
                                headYnList += '15' + ecount.delimiter
                            if (_item.INTERESTDIVIDENDINCOME == '0')
                                headYnList += '16' + ecount.delimiter
                            if (_item.ETCINCOME == '0')
                                headYnList += '17' + ecount.delimiter
                            if (_item.ETCINCOMEBYRESIDENT == '0')
                                headYnList += '10' + ecount.delimiter
                            if (_item.WITHHOLDINGTAXLEDGER == '0')
                                headYnList += '21' + ecount.delimiter
                            if (_item.WITHHOLDINGFORDAILYWORKER == '0')
                                headYnList += '20' + ecount.delimiter
                            if (_item.CERTIFICATE == '0')
                                headYnList += '78' + ecount.delimiter
                            if (_item.DEPOSITSLIP == '0')
                                headYnList += '29' + ecount.delimiter
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
                        return headYnList;

                    }.bind(this))(item)
                });
            }.bind(this))

            ecount.common.api({
                url: '/Common/Infra/SaveMailContentsInfo',
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

    // 이력
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.viewBag.InitDatas.ListLoad.length > 0 ? this.viewBag.InitDatas.ListLoad[0].EDIT_DT : "",
            lastEditId: this.viewBag.InitDatas.ListLoad.length > 0 ? this.viewBag.InitDatas.ListLoad[0].EDITOR_ID : ""
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            additional: true
        });
    },


    // New button click event
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
            SEND_SER_LIST: uniqueItems,
        });
        var strUrl = "/Common/Infra/DeleteMultiEmailSend";
        //if (ecount.confirm(ecount.resource.MSG00644)) {
        ecount.confirm(ecount.resource.MSG00644, function (status) {
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
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
        if (this.searchFormParameter.Edit)
            this.onFooterSave();
    },

    //// ON_KEY_ENTER
    //ON_KEY_ENTER: function (e, target) {
    //    target && this.onContentsSearch(target.control.getValue());
    //},

    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    // ON_KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            this.gridObject.focus();
            this.gridFocus = null;
        }.bind(this);
    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        this.setTimeout(function () { this.gridObject.focus(); }, 0);
    },

    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

    //
    setIsChangeProperty: function () {
        var option = {};
        option.event = {
            'keydown': function (e, data) {
                this.gridObject.setCell('ISCHANGE', data.rowKey, 'Y');
            }.bind(this)
        }

        return option;
    },
    //저장버튼 클릭 시 Validation
    dataValidation: function (saveFunction) {
        var _saveFlag = true;
        $.each(this.gridObject.getRowList(), function (i, item) {
            if (item.ISCHANGE == 'Y' &&
                (!$.isEmpty(item.SEND_SER) &&
                    ($.isEmpty(item.SEND_NAME) && $.isEmpty(item.SEND_TEL) && $.isEmpty(item.SEND_EMAIL) && $.isEmpty(item.SEND_HP)))) {
                var option = {};
                option.message = ecount.resource.MSG05665;
                this.gridObject.setCellShowError("SEND_NAME", item[ecount.grid.constValue.keyColumnPropertyName], option);

                _saveFlag = false;
                return false;
            }

            if (item.hasOwnProperty('COM_CODE') || !item.hasOwnProperty('COM_CODE') && (item.SEND_NAME !== "" || item.SEND_TEL !== "" || item.SEND_EMAIL !== "" || item.SEND_HP !== "")) {
                if (item.SEND_NAME === "") {
                    var option = {};
                    option.message = ecount.resource.MSG02902; // 이름을 입력합니다.
                    this.gridObject.setCellShowError("SEND_NAME", item[ecount.grid.constValue.keyColumnPropertyName], option);
                    _saveFlag = false;
                    //return false;
                }
                if (item.SEND_EMAIL === "") {
                    var option = {};
                    //  option.message = ecount.resource.MSG01939; //Email 주소가 없는 곳에 확인 체크되어있습니다.....bla bla(As-is)
                    option.message = ecount.resource.MSG00528;
                    this.gridObject.setCellShowError("SEND_EMAIL", item[ecount.grid.constValue.keyColumnPropertyName], option);
                    _saveFlag = false;
                    //return false;
                } else {
                    var regex = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,15}(?:\.[a-zA-Z]{2})?)$/;
                    if (!regex.test(item.SEND_EMAIL)) {
                        var option = {};
                        option.message = ecount.resource.MSG00008; //이메일 형식에 맞춰 입력 바랍니다.
                        this.gridObject.setCellShowError("SEND_EMAIL", item[ecount.grid.constValue.keyColumnPropertyName], option);
                        _saveFlag = false;
                        //return false;
                    }
                }
            }

        }.bind(this));

        if (_saveFlag)
            saveFunction();
        else {
            var errorKeyList = this.gridObject.getValidateErrorKeyList();
            if (errorKeyList && errorKeyList.length > 0) {
                this.gridObject.setCellFocus(errorKeyList[0].columnId, errorKeyList[0].rowKey);
            }
            this.footer.getControl('save').setAllowClick();
        }
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.draw(this.searchFormParameter);
    },

    getTaxResource: function () {
        var res = ecount.resource;
        var result = null;
        switch (this.viewBag.Nation) {
            case "KR":
                result = res.LBL04785;
                break;
            case "TW":
                result = res.LBL16316;
                break;
        }
        return result;
    },

    getTaxDocGubun: function () {
        var result = '45'
        switch (this.viewBag.Nation) {
            case "KR":
                result = '45'
                break;
            case "TW":
                result = '49'
                break;
        }
        return result;
    },

    getTaxPropName: function () {
        var result = 'ELECTRONICTAXINVOICE';
        switch (this.viewBag.Nation) {
            case "KR":
                result = 'ELECTRONICTAXINVOICE'
                break;
            case "TW":
                result = 'ELECTRONICTAXINVOICETW'
                break;
        }
        return result;
    }
});






