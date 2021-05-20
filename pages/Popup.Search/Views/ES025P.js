window.__define_resource && __define_resource("LBL07736","BTN00169","MSG03839","BTN00004","BTN00372","LBL01770","BTN00008","BTN00069","LBL80158","LBL93387","LBL01517","MSG05445","MSG00336","MSG85139","MSG05382","MSG00141","LBL06100","MSG02006");
/****************************************************************************************************
1. Create Date : 2015.09.02
2. Creator     : 이일용
3. Description : 시리얼/로트 선택 팝업창
4. Precaution  :
5. History     : 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경 
                 2016.10.26 (HOI) Modified to open popup NF-Generate Serial/Lot No
                 2019.08.27(Hao) Link Serial / Lot No. Slip List to NF3.0
****************************************************************************************************/

/*--- ES025P.js ---*/
ecount.page.factory("ecount.page.popup.type2", "ES025P", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    checkMaxCount: 100, // checkbox 최대 선택 개수
    strWarningAlertYN: "N",
    InOutType: 0,
    rowNo: this.POS,
    serialLotNoList: "",
    serialLotQtyList: "",
    serialLotTotQty: 0,
    firstLoadFlag: true,
    lastSelectSerialLotNumber: 0,
    parentPageID: null,
    checkAll: false,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        var serNo = this.SerialKey;

        // 생산입고 소모이면 500을 빼줌
        if (this.IO_TYPE == "47") {
            serNo = this.SerialKey - 500;
        }

        if ($.isEmpty(this.WH_CD))
            ecount.config.inventory.USE_SERIAL_WH = false;

        this.searchFormParameter = {
            PROD_CD: this.PROD_CD,
            IO_TYPE: this.IO_TYPE,
            IO_DATE: this.IO_DATE,
            IO_NO: this.IO_NO,
            SER_NO: serNo, //this.POS,
            SERIAL_IDX: this.SERIAL_IDX,
            SERIAL_IDXS: this.SERIAL_IDXS,
            CALL_TYPE: this.CALL_TYPE,
            GUBUN_CHK: this.Check,
            SERIAL_DATE: this.SerialTime,
            SERIAL_KEY: this.SerialKey,
            QTY: this.Qty,
            WH_CD: this.WH_CD,
            WH_CD_TO: this.WH_CD_TO,
            FORM_TYPE: this.FORM_TYPE,
            FORM_SEQ: this.FORM_SEQ,
            POPUP_TYPE: this.POPUP_TYPE,
            PAGE_CURRENT: this.PAGE_CURRENT,
            PAGE_SIZE: this.PAGE_SIZE,
            SERIAL_WH_FLAG: ecount.config.inventory.USE_SERIAL_WH ? "Y" : "N",
            SERIAL_FLAG: ecount.config.inventory.USE_SERIAL,
            SL_ANYINPUT_YN: ecount.config.inventory.USE_ANYINPUT,
            //SL_NOTI_YN: ecount.config.inventory.USE_NOTI,
            //SL_MAPPING_FLAG: ecount.config.inventory.USE_MAPPING_FLAG == "Y" ? "1" : "0"
        };

        if (this.IO_TYPE.substring(0, 1) == "2" || this.IO_TYPE == "42" || this.IO_TYPE == "43" || this.IO_TYPE == "62") //--증가 || strIoType == "71" || strIoType == "72"
            this.InOutType = 1;
        else if (this.IO_TYPE.substring(0, 1) == "1" || this.IO_TYPE == "47" || this.IO_TYPE == "59" || this.IO_TYPE == "52" || this.IO_TYPE == "51")  //--감소
            this.InOutType = -1;
        else
            this.InOutType = 0;
    },

    initProperties: function () {

    },

    render: function ($parent) {

        this.setLayout(this.viewBag.FormInfos.SP721);
        this._super.render.apply(this, arguments);
    },
    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(this.PROD_DES + '  ' + ecount.resource.LBL07736)
                .add("search", null, true)
                .add("option", [
                { id: "searchTemplate", label: ecount.resource.BTN00169 }
                ], false).useQuickSearch();
    },
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            ctrl = generator.control(),
            toolbar = generator.toolbar(),
            grid2 = generator.grid(),
            grid = generator.grid();

        var totalRowCount = 0;
        if (this.viewBag.InitDatas.ListSerialLotLoad && this.viewBag.InitDatas.ListSerialLotLoad.length > 0) {
            totalRowCount = parseInt(this.viewBag.InitDatas.ListSerialLotLoad[0]['MAXCNT'], 10);
        }
        var _editableState = 1;
        // 수량1만 입력허용
        if (this.searchFormParameter.SL_ANYINPUT_YN == "N") {
            _editableState = -1;
        }
        //// 하나의 시리얼/로트No.당 하나의 품목만 사용 가능, 저장되지 않기
        //if (this.searchFormParameter.SL_ANYINPUT_YN == "N" && this.searchFormParameter.SL_NOTI_YN == "N") {
        //    _editableState = -1;
        //}
        if (!$.isEmpty(this.__ecPageID)) {
            this.parentPageID = this.__ecPageID.substring(0, 7);
        }
        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
            grid
               .setEditable(true, 0, 0)
               .setRowData(this.viewBag.InitDatas.ListSerialLotLoad)
               .setRowDataUrl("/Inventory/Serial/GetSerialLotList")
               .setRowDataParameter(this.searchFormParameter)
               .setFormParameter({
                   FormType: this.FORM_TYPE,
                   FormSeq: this.FORM_SEQ,
               })
               .setKeyColumn(['SID'])
               .setColumns([
                   { id: 'sale012.prodqty', controlType: 'widget.input.number', editableState: _editableState, dataType: '96', isCheckZero: false, controlOption: { decimalUnit: [28, ecount.config.inventory.DEC_Q], isCheckZero: false } },
                   //{ id: 'sale012.whqty', controlType: 'widget.label', editableState: -1, dataType: '96', isHideColumn: ecount.config.inventory.USE_SERIAL_WH ? false : true, isCheckZero: false, controlOption: { decimalUnit: [28, 10], isCheckZero: false } },
                   { id: 'sale012.totqty', controlType: 'widget.label', editableState: -1, dataType: '9' + this.DEC_Q, controlOption: { decimalUnit: [28, 10], isCheckZero: false } },
                   { id: 'sale012.oriqty', controlType: 'widget.label', editableState: -1, dataType: '9' + this.DEC_Q, controlOption: { decimalUnit: [28, 10], isCheckZero: false } },
                   { id: 'sale011.detail', align: 'center' }
               ])
               .setColumnFixHeader(true)

               // Paging
               .setPagingUse(true)
               .setPagingRowCountPerPage(this.PAGE_SIZE, true)
               .setPagingUseDefaultPageIndexChanging(true)
               .setCheckBoxUse(false)
               // Custom cells
                .setCustomRowCell('sale011.serial_idx', this.setGridSerialLotNoLink.bind(this))
                .setCustomRowCell('sale012.prodqty', this.setGridDateLinkProdQty.bind(this))
                .setCustomRowCell('sale012.oriqty', this.setGridDateLinkOriQty.bind(this))
                .setCustomRowCell('sale011.detail', this.setGridDateLinkDetail.bind(this))
            contents
             .add(toolbar)
             .addGrid(this.pageID, grid);
        }
        else {
            //  맨 위에 행 추가
            this.viewBag.InitDatas.ListSerialLotLoad.splice(0, 0, { currentRowType1: 'searchrow' });

            // Initialize Grid
            grid
                .setEditable(true, 0, 0)
                .setRowData(this.viewBag.InitDatas.ListSerialLotLoad)
                .setRowDataUrl("/Inventory/Serial/GetSerialLotList")
                .setRowDataParameter(this.searchFormParameter)
                .setFormParameter({
                    FormType: this.FORM_TYPE,
                    FormSeq: this.FORM_SEQ,
                })
                .setKeyColumn(['SID'])
                .setColumns([
                    { id: 'sale012.prodqty', controlType: 'widget.input.number', editableState: _editableState, dataType: '96', isCheckZero: false, controlOption: { decimalUnit: [28, ecount.config.inventory.DEC_Q], isCheckZero: false } },
                    //{ id: 'sale012.whqty', controlType: 'widget.label', editableState: -1, dataType: '96', isHideColumn: ecount.config.inventory.USE_SERIAL_WH ? false : true, isCheckZero: false, controlOption: { decimalUnit: [28, 10], isCheckZero: false } },
                    { id: 'sale012.totqty', controlType: 'widget.label', editableState: -1, dataType: '9' + this.DEC_Q, controlOption: { decimalUnit: [28, 10], isCheckZero: false } },
                    { id: 'sale012.oriqty', controlType: 'widget.label', editableState: -1, dataType: '9' + this.DEC_Q, controlOption: { decimalUnit: [28, 10], isCheckZero: false } },
                    { id: 'sale011.detail', align: 'center' }
                ])
                .setColumnFixHeader(true)

                // Paging
                .setPagingUse(true)
                .setPagingRowCountPerPage(this.PAGE_SIZE, true)
                .setPagingUseDefaultPageIndexChanging(true)

                // Custom cells
                .setCustomRowCell(ecount.grid.constValue.checkBoxPropertyName, function (value, rowItem) {
                    var option = {};
                    // 서치행일 때,
                    if (rowItem['currentRowType1'] === 'searchrow') {
                        option.controlType = 'widget.empty';
                    }
                    return option;
                })
                .setCustomRowCell('sale011.serial_idx', this.setGridSerialLotNoLink2.bind(this))
                .setCustomRowCell('sale012.prodqty', this.setGridDateLinkProdQty.bind(this))
                .setCustomRowCell('sale012.oriqty', this.setGridDateLinkOriQty.bind(this))
                .setCustomRowCell('sale011.detail', this.setGridDateLinkDetail.bind(this))
                .setEventWidgetTriggerObj(this.events)
                .setPagingTotalRowCount(totalRowCount)
                // CheckBox
                .setCheckBoxUse(true)
                .setCheckBoxCallback({ 'click': this.setGridCheckBoxClickEvent.bind(this) })
                .setCheckBoxHeaderCallback({ 'click': this.setGridCheckBoxAllClickEvent.bind(this) })
                .setCheckBoxMaxCount(this.checkMaxCount)
                .setCheckBoxRememberChecked(true)
                .setCheckBoxMaxCountExceeded(function (e) {
                    ecount.alert(String.format(ecount.resource.MSG03839, e));
                })
                .setCheckBoxActiveRowStyle(true)
                .setCheckboxOriginal(true)
                .setCheckBoxUseMultiCheck(false)

            //toolbar.attach(ctrl.define("widget.searchGroup", "search").setOptions({ label: ecount.resource.BTN00004 }));

            contents
                .add(toolbar)
                .addGrid("dataGrid" + this.pageID, grid);
        }
    },
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        ctrl = widget.generator.control();
        if (this.parentPageID == "ESQ201M") { //Serial/Lot No.               
            //toolbar.addLeft(ctrl.define("widget.button", "SerialLotReg").label(ecount.resource.BTN00372));
            toolbar.addLeft(ctrl.define("widget.button", "SerialLotReg").label(ecount.resource.LBL01770));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        } else {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069));
            //toolbar.addLeft(ctrl.define("widget.button", "SerialLotReg").label(ecount.resource.BTN00372));
            toolbar.addLeft(ctrl.define("widget.button", "SerialLotReg").label(ecount.resource.LBL01770));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }
        footer.add(toolbar);
    },
    onInitControl: function (cid, control) {
    },
    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },
    onLoadTabContents: function (event) { },
    onChangeHeaderTab: function (event) { },
    onChangeContentsTab: function (event) { },
    onLoadComplete: function (event) {
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.SERIAL_IDX);
            this.header.getQuickSearchControl().setValue(this.SERIAL_IDX);
        }

        if (!event.unfocus) {
            //this.header.getControl("search").onFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    onPopupHandler: function (control, config, handler) {
        $.extend(config, {
            SerialTime: this.SerialTime == null ? '' : this.SerialTime,
            IO_TYPE: this.IO_TYPE,
            SerialKey: this.SerialKey,
            PROD_CD: this.PROD_CD,
            PROD_DES: this.PROD_DES,
            Check: this.Check,
            SERIAL_IDXS: this.searchFormParameter.SERIAL_IDXS,
            SERIAL_IDX: this.serialLotNoList,
            SERIAL_CNT: this.serialLotQtyList,
            POS: this.POS
        });
        handler(config);
    },
    // onAutoCompleteHandler: function (control, keyword, parameter, handler) {
    // $.extend(parameter, {
    //    SerialTime: this.SerialTime == null ? '': this.SerialTime,
    //    IO_TYPE: this.IO_TYPE,
    //    SerialKey: this.SerialKey,
    //    PROD_CD: this.PROD_CD,
    //    SERIAL_IDXS: this.searchFormParameter.SERIAL_IDXS,
    //    SERIAL_IDX: this.serialLotNoList,
    //    SERIAL_CNT: this.serialLotQtyList,
    //    POS: this.POS
    //});
    // handler(parameter);

    //this.searchFormParameter.SERIAL_IDXS = $.isEmpty(this.searchFormParameter.SERIAL_IDXS) ? data.rowItem.SERIAL_IDX + 'ㆍ1': this.searchFormParameter.SERIAL_IDXS + '∬' +data.rowItem.SERIAL_IDX + 'ㆍ1';
    //       this.serialLotNosList += data.rowItem.SERIAL_IDX + 'ㆍ1';
    //       this.serialLotNoList += data.rowItem.SERIAL_IDX + 'ㆍ';
    //       this.serialLotQtyList += '1ㆍ';
    //       $.extend(parameter, {
    //       SERIAL_DATE: this.SerialTime == null ? '': this.SerialTime,
    //       IO_TYPE: this.IO_TYPE,
    //       SERIAL_IDX: this.serialLotNoList,
    //       SERIAL_IDXS: this.searchFormParameter.SERIAL_IDXS,
    //       SERIAL_CNT: this.serialLotQtyList,
    //       SERIAL_KEY: this.SerialKey,
    //       PROD_CD: this.PROD_CD,
    //       DEL_FLAG: 'I'          
    //       });
    //  },
    onMessageHandler: function (event, data) {

        switch (event.pageID) {
            case "ES027P":
                this.serialLotNoList = data.SERIAL_IDX;
                this.serialLotQtyList = data.SERIAL_CNT;
                this.searchFormParameter.SERIAL_IDXS = data.SERIAL_IDXS;
                this.onContentsSearch(null);
                this.contents.getGrid().grid.restoreLastActiveCell();
                break;
            case "ESA009P_09":
                var firtData = data.data;
                var param = {
                    width: 800,
                    height: 600,
                    PROD_CD: this.PROD_CD,
                    PROD_DES: this.PROD_DES,
                    POS: this.POS,
                    EditFlag: 'I',
                    IO_TYPE: this.IO_TYPE,
                    IO_NO: this.IO_NO,
                    Qty: this.Qty,
                    SerialTime: this.SerialTime == null ? '' : this.SerialTime,
                    SerialKey: this.SerialKey,
                    Check: this.Check,
                    WH_CD: this.WH_CD,
                    DEC_Q: this.DEC_Q
                };
                this.onAllSubmitSelf("/ECERP/Popup.Search/ES025P", param, "details");
                data.callback && data.callback();
                break;
        }

    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/
    // 체크박스 클릭
    setGridCheckBoxClickEvent: function (event, data) {
        this.checkAll = false;
        var grid = this.contents.getGrid().grid;
        var checked = event.target.checked;
        var prodqty = checked ? this.Check : 0;

        if (checked && this.lastSelectSerialLotNumber >= this.checkMaxCount - 1) {
            ecount.alert(String.format(ecount.resource.MSG03839, this.checkMaxCount));
            grid.setCell('sale012.prodqty', data.rowKey, '0', { isRunChange: true });
        }
        else
            grid.setCell('sale012.prodqty', data.rowKey, prodqty.toString(), { isRunChange: true });
    },

    // 체크박스 ALL 클릭
    setGridCheckBoxAllClickEvent: function (event, data) {
        this.checkAll = true;
        var self = this;
        var checked = event.target.checked;

        if (checked == false)
            self.lastSelectSerialLotNumber = -1;

        var grid = self.contents.getGrid().grid;
        var items = grid.getRowList();
        var maxCount = grid.getRowCount();
        if (self.checkMaxCount <= maxCount)
            maxCount = self.checkMaxCount;

        //for (var i = self.lastSelectSerialLotNumber +1; i < maxCount; i++) {
        for (var i = 0; i < maxCount; i++) {
            if (i >= maxCount) {
                break;
            }
            var prodqty = checked ? self.Check : 0;
            if (items[i] != undefined && items[i].SID != undefined)
                grid.setCell('sale012.prodqty', items[i].SID, prodqty.toString(), {
                    isRunChange: true
                });
        }
        self.lastSelectSerialLotNumber = checked ? maxCount - 1 : -1;
    },
    // 선택된 시리얼/로트No. 이동
    setGridCheckMove: function (isChecked, grid, rowKey) {
        if (this.checkAll) return;
        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
            /*내역입력은 시리얼 다중선택이 안되므로, 굳이 필요없는 거 같음*/
        }
        else {
            var idx = grid.getRowIndexByKey(rowKey, 'sale012.prodqty');
            if (isChecked) {
                this.lastSelectSerialLotNumber += 1;
                if (idx == this.lastSelectSerialLotNumber) {
                }
                else {
                    if (this.lastSelectSerialLotNumber > 0) {
                        grid.moveRow(idx, this.lastSelectSerialLotNumber, false);
                    }
                }
            }
            else {
                if (idx == this.lastSelectSerialLotNumber) {
                }
                else {
                    if (this.lastSelectSerialLotNumber > 0) {
                        grid.moveRow(idx, this.lastSelectSerialLotNumber, false);
                    }
                }
                this.lastSelectSerialLotNumber -= 1;
            }
        };
    },
    setGridDateLinkOriQty: function (value, rowItem) {
        var option = {},
            _self = this;

        if (ecount.config.inventory.USE_SERIAL_WH)
            option.data = rowItem.WHQTY;
        else
            option.data = rowItem.TOTQTY;

        return option;
    },
    // 입력수량
    setGridDateLinkProdQty: function (value, rowItem) {
        var option = {},
            grid = this.contents.getGrid().grid;
        var hidData = "";
        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
            /*상단에 검색기능이 없으므로, 예외로직 추가*/
            option.controlType = "widget.input.number";
            option.event = {
                'focus': function (event, data) {
                }.bind(this),
                'click': function (event, data) {
                }.bind(this),
                'change': function (event, data) {
                    this.setEnterQuantityEvent(event, data, grid);
                }.bind(this),
                'keyup': function (event, data) {
                }.bind(this)
            };
        }
        else {
            if (grid.getRowIndexByKey(rowItem[ecount.grid.constValue.keyColumnPropertyName]) === 0) {
                option.controlType = "widget.label";
            }
            else {
                option.controlType = "widget.input.number";
            };
            option.event = {
                'focus': function (event, data) {
                }.bind(this),
                'click': function (event, data) {
                }.bind(this),
                'change': function (event, data) {
                    this.setEnterQuantityEvent(event, data, grid);
                }.bind(this),
                'keyup': function (event, data) {
                }.bind(this)
            };
        };
        return option;
    },
    // 상세보기 클릭
    setGridDateLinkDetail: function (value, rowItem) {
        var option = {
        };
        var hidData = "";
        var self = this;
        var grid = self.contents.getGrid().grid;

        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
            option.data = ecount.resource.LBL80158;
            option.dataType = "1";
            option.controlType = "widget.link";
            if (rowItem.SL_USE_FG != "0") {
                option.attrs = {
                    'Class': 'text-warning-inverse',
                };
            }
            option.event = {
                'click': function (e, data) {
                    var param = {
                        width: 950,
                        height: 580,                        
                        Request: {
                            AFlag: '4',
                            editFlag: 'M',
                            pageSize: 100,
                            PROD_CD: this.PROD_CD,
                            PROD_DES: this.PROD_DES,
                            Data: {
                                SERIAL_IDX: data.rowItem.SID,
                                isDetail: '1'
                            },
                            pageSize: 100
                        }
                    };
                    this.openWindow({
                        url: '/ECERP/SVC/ESQ/ESQ200M',
                        name: ecount.resource.LBL93387 + ' ' + ecount.resource.LBL01517,
                        param: param,
                        popupType: false,
                        additional: true,
                    });
                }.bind(this)
            };
        }
        else {
            if (grid.getRowIndexByKey(rowItem[ecount.grid.constValue.keyColumnPropertyName]) !== 0) {
                option.data = ecount.resource.LBL80158;
                option.dataType = "1";
                option.controlType = "widget.link";
                if (rowItem.SL_USE_FG != "0") {
                    option.attrs = {
                        'Class': 'text-warning-inverse',
                    };
                }
                option.event = {
                    'click': function (e, data) {
                        var param = {
                            width: 950,
                            height: 580,
                            Request: {
                                AFlag: '4',
                                editFlag: 'M',
                                pageSize: 100,
                                PROD_CD: this.PROD_CD,
                                PROD_DES: this.PROD_DES,
                                Data: {
                                    SERIAL_IDX: data.rowItem.SID,
                                    isDetail: '1'
                                },
                                pageSize: 100
                            }
                        };
                        this.openWindow({
                            url: '/ECERP/SVC/ESQ/ESQ200M',
                            name: ecount.resource.LBL93387 + ' ' + ecount.resource.LBL01517,
                            param: param,
                            popupType: false,
                            additional: true,
                        });
                    }.bind(this)
                };
            }
        };
        return option;
    },

    setGridSerialLotNoLink2: function (value, rowItem) {
        var option = {};
        var self = this;
        var grid = self.contents.getGrid().grid;
        if (grid.getRowIndexByKey(rowItem[ecount.grid.constValue.keyColumnPropertyName]) === 0) {
            option.controlType = "widget.code.serialCodeItemNative";
            option.controlOption = {
                controlEvent: {
                    itemSelect: function (rowKey, arg) {
                        console.log(arguments);
                    }
                },
                codeType: 7
            };
            option.isNativeControl = true;
        }
        else {
            option.controlType = "widget.label";
        }
        return option;
    },

    setGridSerialLotNoLink: function (value, rowItem) {
        var self = this;
        var option = {};
        var hidData = "";
        option.data = value;
        option.dataType = "1";
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                var datas = {
                    SERIAL_DATE: self.SerialTime == null ? '' : self.SerialTime,
                    IO_TYPE: self.IO_TYPE,
                    SERIAL_IDX: data.rowItem.SID,
                    SERIAL_CNT: 0,// data.rowItem.SERIAL_CNT,
                    SERIAL_KEY: self.SerialKey,
                    PROD_CD: self.PROD_CD,
                    TOTQTY: self.serialLotTotQty,
                    POS: self.POS,
                    callback: self.close.bind(self)
                };

                var message = {
                    SERIAL_DATE: self.SerialTime == null ? '' : self.SerialTime,
                    IO_TYPE: self.IO_TYPE,
                    SERIAL_IDX: data.rowItem.SID,
                    SERIAL_CNT: 0,// data.rowItem.SERIAL_CNT,
                    SERIAL_KEY: self.SerialKey,
                    PROD_CD: self.PROD_CD,
                    TOTQTY: self.serialLotTotQty,
                    POS: self.POS,
                    callback: self.close.bind(self),

                    name: "SERIAL_IDX",
                    code: "SERIAL_IDX",
                    data: datas
                };

                self.fnApply(message);
            }.bind(self)
        };

        return option;
    },
    setGridDateLinkOriQty: function (value, rowItem) {
        var option = {},
            _self = this;
        if (ecount.config.inventory.USE_SERIAL_WH)
            option.data = rowItem.WHQTY;
        else
            option.data = rowItem.TOTQTY;
        return option;
    },
    setEnterQuantityEvent: function (event, data, grid) {

        var self = this;
        var key = data.rowKey;
        var prodqtyqty = grid.getCell("sale012.prodqty", key);
        //var oldqty = $.parseNumber(grid.getCell("PRODQTY", key));
        var oldqty = grid.getCell("PRODQTY", key);
        //var isRunChangeFlag = grid.isChecked(key);

        prodqtyqty = prodqtyqty == "" ? "0" : prodqtyqty;
        oldqty = oldqty == "" ? "0" : oldqty;

        // 수량1만 입력허용
        //if (this.searchFormParameter.SL_MAPPING_FLAG == "0") {
        //    if (!['0', '1', '-1'].contains(prodqtyqty)) {
        //        if (oldqty == '0') grid.removeChecked(key);
        //        grid.setCell('sale012.prodqty', key, oldqty, { isRunChange: false });
        //        ecount.alert(ecount.resource.MSG05445);
        //        return false;
        //    }
        //}
        // 하나의 시리얼/로트No.당 하나의 품목만 사용 가능, 저장되지 않기
        if (this.searchFormParameter.SL_ANYINPUT_YN == "N" && this.searchFormParameter.SL_NOTI_YN == "N") {
            if (!['0', '1', '-1'].contains(prodqtyqty)) {
                if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
                    /*체크박스가 없으므로.*/
                }
                else {
                    if (oldqty == '0') grid.removeChecked(key);
                };
                grid.setCell('sale012.prodqty', key, oldqty, { isRunChange: false });
                ecount.alert(ecount.resource.MSG05445);
                return false;
            }
        }

        if (['0'].contains(prodqtyqty))
            grid.setCell('sale012.prodqty', key, prodqtyqty, { isRunChange: false });

        if (this.searchFormParameter.SL_ANYINPUT_YN == "N" && [-1, 0, 1].contains($.parseNumber(prodqtyqty)) == false && $.parseNumber(oldqty) != $.parseNumber(prodqtyqty)) {
            alert(ecount.resource.MSG00336);
            grid.setCell('sale012.prodqty', key, oldqty, { isRunChange: true });
            return false;
        }

        if ($.parseNumber(prodqtyqty) != 0) {
            if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
                /*체크박스가 없으므로.*/
            }
            else {
                grid.addChecked(key);
            };
            self.lastSelectSerialLotNumber++;
        } else {
            if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
                /*체크박스가 없으므로.*/
            }
            else {
                grid.removeChecked(key);
            }
            self.lastSelectSerialLotNumber--;
        }

        var qty = $.parseNumber(prodqtyqty);
        var whqty = $.parseNumber(grid.getCell("WHQTY", key));
        var whqtyto = $.parseNumber(grid.getCell("WHQTY_TO", key));
        var totqty = $.parseNumber(grid.getCell("TOTQTY", key));

        // 창고,합계 기본값
        var newWhQty = 0.0;
        var newWhQtyTo = 0.0;
        var newTotQty = 0.0;

        // 시리얼/로트 설정 적용
        if (!this.setCheckSerialLotSetting(qty, oldqty)) {
            if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
                /*체크박스가 없으므로*/
            }
            else {
                if (oldqty == '0')
                    grid.removeChecked(key);
            };
            this.strWarningAlertYN = "N";
            grid.setCell('sale012.prodqty', key, oldqty, {
                isRunChange: false
            });
            return false;
        }

        if (this.InOutType == -1) { //감소
            newTotQty = this.fnMathRound(totqty - qty, 10);
            newWhQty = this.fnMathRound(whqty - qty, 10);
            newWhQtyTo = this.fnMathRound(whqtyto - qty, 10);
        } else if (this.InOutType == 1) { //증가
            newTotQty = this.fnMathRound(totqty + qty, 10);
            newWhQty = this.fnMathRound(whqty + qty, 10);
            newWhQtyTo = this.fnMathRound(whqtyto + qty, 10);
        } else { //이동
            newTotQty = this.fnMathRound(totqty, 10);
            // - (마이너스)
            newWhQty = qty < 0 ? this.fnMathRound(whqty + qty, 10) : this.fnMathRound(whqty - qty, 10);
            // + (플러스)
            newWhQtyTo = qty < 0 ? this.fnMathRound(whqty + qty, 10) : this.fnMathRound(whqty + qty, 10);
        }

        grid.setCell('PRODQTY', key, prodqtyqty);
        grid.setCell('sale012.whqty', key, newWhQty);
        grid.setCell('sale012.whqtyto', key, newWhQtyTo);
        grid.setCell('sale012.totqty', key, newTotQty);

        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
            /*체크박스가 없으므로*/
        }
        else {
            if (oldqty == '0' || qty == 0)
                this.setGridCheckMove(grid.isChecked(key), grid, key);
        };

        // 선택값저장.
        self.setTimeout(function () {
            self.setGridDateToSaveVariable(false);
        }, 50);
        //self.setGridDateToSaveVariable();
    },

    // 선택항목 변수 저장
    setGridDateToSaveVariable: function (messageOpen) {
        var grid = this.contents.getGrid().grid
        var idx = 0, idxfix = 0, checkValueSerialLotList = "", serial = "", serialqty = "", totqty = 0, QtyCnt = 0;
        $.each(this.viewBag.FormInfos.SP721.columns, function (i, item) {
            if (item.name == "sale012.prodqty") {
                idxfix = idx;
            }
            idx++;
        });
        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
            /*체크박스가 없다.*/
        }
        else {
            $.each(grid.getCheckedObject(), function (i, item) {
                if ((['']).contains(checkValueSerialLotList))
                    checkValueSerialLotList = item['SID'] + 'ㆍ' + item['A' + idxfix.toString()];
                else
                    checkValueSerialLotList += ecount.delimiter + item['SID'] + 'ㆍ' + item['A' + idxfix.toString()];
                if ($.parseNumber(item['A' + idxfix.toString()]) >= 0)
                    QtyCnt++;
                serial += item['SID'] + 'ㆍ';
                serialqty += item['A' + idxfix.toString()] + 'ㆍ';
                totqty += $.parseNumber(item['A' + idxfix.toString()]);
            });

            if (grid.getCheckedCount() != QtyCnt && QtyCnt != 0 && messageOpen) {
                ecount.alert(ecount.resource.MSG85139);
                return false;
            }
            this.searchFormParameter.SERIAL_IDXS = checkValueSerialLotList;
            this.serialLotNoList = serial;
            this.serialLotQtyList = serialqty;
            this.serialLotTotQty = totqty;
        };
    },
    setCheckSerialLotSetting: function (qty, oldqty) {
        if (this.firstLoadFlag) return true;
        if (['Y'].contains(this.searchFormParameter.SL_ANYINPUT_YN) == false) { //&& strIoType != "31" 창고이동은 제외.
            if ([-1, 0, 1].contains($.parseNumber(qty))) {
            } else {
                if (['Y'].contains(this.searchFormParameter.SL_NOTI_YN)) {
                    if (qty != oldqty && this.strWarningAlertYN == "N") {
                        if (confirm(ecount.resource.MSG05382)) {
                            this.strWarningAlertYN = "Y";
                        } else
                            return false;
                    }
                } else {
                    if ($.parseNumber(qty) != $.parseNumber(oldqty)) {
                        //ecount.alert(ecount.resource.MSG05445);
                        alert(ecount.resource.MSG05445);
                        return false;
                    }
                }
            }
        }
        return true;
    },

    onGridInit: function (e, data, grid) {
    },
    // 그리드 로드 완료 이벤트(Completion event Grid load)
    onGridRenderComplete: function (e, data, grid) {
        var grid = this.contents.getGrid().grid;
        this._super.onGridRenderComplete.apply(this, arguments);

        this.lastSelectSerialLotNumber = grid.getCheckedCount();

        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }

        var qtyMapping = $.parseNumber(this.Qty);

        var bindqty = 0;
        var checkCount = 0;
        var editMode = 0;

        var items = grid.getRowList();
        for (var i = 0; i < items.length; i++) {
            if (checkCount >= this.checkMaxCount) break;
            if (items[i].SL_NUM == "1") {
                editMode = 1;
                if (this.InOutType == -1) {
                    grid.setCell('sale012.prodqty', items[i].SID, items[i].OUT_QTY, { isRunChange: true });
                } else if (this.InOutType == 1) {
                    grid.setCell('sale012.prodqty', items[i].SID, items[i].IN_QTY, { isRunChange: true });
                } else {
                    grid.setCell('sale012.prodqty', items[i].SID, items[i].IN_QTY, { isRunChange: true });
                }
                checkCount++;
            } else if (items[i].SL_NUM == "2" && editMode == 0 && this.firstLoadFlag == true) {
                if (qtyMapping != 0 && ['Y'].contains(this.searchFormParameter.SL_ANYINPUT_YN)) {
                    if (qtyMapping != 0 && (qtyMapping > 1 || qtyMapping < -1)) {
                        grid.setCell('sale012.prodqty', items[i].SID, qtyMapping, { isRunChange: true });
                        qtyMapping = 0;
                    } else if (qtyMapping != 0 && (qtyMapping < 1 || qtyMapping > -1)) {
                        grid.setCell('sale012.prodqty', items[i].SID, qtyMapping, { isRunChange: true });
                        qtyMapping = 0;
                    }
                } else if (qtyMapping != 0) {
                    if (qtyMapping != 0 && (qtyMapping > 1 || qtyMapping < -1)) {
                        if (this.Check == '1')
                            qtyMapping -= 1;
                        else if (this.Check == '-1')
                            qtyMapping += 1;
                        grid.setCell('sale012.prodqty', items[i].SID, this.Check, { isRunChange: true });
                    } else if (qtyMapping != 0 && (qtyMapping < 1 || qtyMapping > -1)) {
                        if (['Y'].contains(this.searchFormParameter.SL_NOTI_YN)) {
                            grid.setCell('sale012.prodqty', items[i].SID, qtyMapping, { isRunChange: true });
                        } else {
                            grid.setCell('sale012.prodqty', items[i].SID, this.Check, { isRunChange: true });
                        }
                        qtyMapping = 0;
                    }
                }
                checkCount++;
            };
        }

        if (qtyMapping != 0) {
        }
        this.firstLoadFlag = false;
    },
    onGridAfterFormLoad: function (e, data, grid) {
    },
    onGridAfterRowDataLoad: function (e, data) {
        //  맨 위에 행 추가
        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
        }
        else {
            if (data['result'] && $.isArray(data['result']['Data']) && data['result']['Data'].length > 0) {
                data['result']['Data'].splice(0, 0, {
                    currentRowType1: 'searchrow'
                });
            };
        };
    },
    /**************************************************************************************************** 
    * define action event listener
    ****************************************************************************************************/
    // 버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },
    onHeaderSearch: function (forceHide) {
    },
    // 검색 이벤트(Search event)
    onContentsSearch: function (event) {
        //var invalid = this.contents.getControl("search").validate();
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
            return;
        };
        //var value = this.contents.getControl("search").getValue().keyword;
        var value = this.header.getQuickSearchControl().getValue().keyword;
        this.searchFormParameter.SERIAL_IDX = value;
        this.contents.getGrid().settings.setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("search").onFocus(0);
        //this.header.getQuickSearchControl().setFocus(0);

    },
    // 검색창 설정 팝업(Search Settings pop-up window)
    onDropdownSearchTemplate: function (e) {
        if (this.viewBag.Permission.sale.Value != "W") {
            ecount.alert(ecount.resource.MSG00141);
            return;
        };

        //var param = {
        //    width: 800,
        //    height: 500,
        //    //FORM_GUBUN: 'SP721',
        //    //FORM_SER: 1,
        //    //CHKBOXFLAG: 'Y',
        //    __NewParents: this.pageID
        //};

        //this.openWindow({
        //    url: "/ECMain/CM3/CM100P_02.aspx?FORM_GUBUN=SP721&FORM_SER=1&CHKBOXFLAG=Y",
        //    name: 'CM100P_02',
        //    param: param,
        //    popupType: true,
        //    fpopupID: this.ecPageID
        //});


        var param = {
            width: 1020,
            height: 800,
            FORM_TYPE: 'SP721',  //this.parentPageID=='EBH006R'?'AO960':
            FORM_SEQ: 1
        }
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: ecount.resource.BTN00169,
            param: param
        });

    },
    //시리얼/로트No.등록
    onFooterSerialLotReg: function () {
        var param = {
            width: 700,
            height: 600,
            PROD_CD: this.PROD_CD,
            PROD_DES: this.PROD_DES,
            SIZE_DES: "",
            EDIT_FLAG: "I",
            hidPage: 1,
            PAGE: "",
            NEWERP: "T"
        }
        this.openWindow({
            url: '/ECERP/ESA/ESA009P_09',
            name: String.format(ecount.resource.LBL06100),
            PROD_CD: this.PROD_CD,
            PROD_DES: this.PROD_DES,
            param: param,
            popupType: false,
            additional: true,
            fpopupID: false//this.ecPageID
        });
    },
    //적용F8
    onFooterApply: function () {
        var Success = true;
        var thisObj = this;
        if (this.setGridDateToSaveVariable(true) == false)
            return false;

        var data = {
            SERIAL_DATE: this.SerialTime == null ? '' : this.SerialTime,
            IO_TYPE: this.IO_TYPE,
            SERIAL_IDX: this.serialLotNoList,
            SERIAL_CNT: this.serialLotQtyList,
            SERIAL_KEY: this.SerialKey,
            PROD_CD: this.PROD_CD,
            TOTQTY: this.serialLotTotQty,
            POS: this.POS,
            callback: this.close.bind(this)
        };

        if (data.TOTQTY != this.Qty) {
            if (confirm(ecount.resource.MSG02006)) {
                this.fnApply(data);
            } else {
                return false;
            }
        } else {
            this.fnApply(data);
        }
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    fnApply: function (data) {
        var thisObj = this;
        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
            thisObj.sendMessage(thisObj, data);
        }
        else {
            ecount.common.api({
                url: "/Inventory/Serial/InsertSerialLotApplyTempSave",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    }
                    else {
                        //window.setTimeout(function () { thisObj.close(); }, 0);
                        thisObj.sendMessage(thisObj, data);
                    }
                }
            });
        };
        return false;
    },
    fnMathRound: function (num, jari) {
        jari = Math.pow(10, jari);
        return Math.round(num * jari) / jari;
    },
    /**********************************************************************
    *  hotkey [f1~12, 방향키등.. ]
    **********************************************************************/
    //엔터
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target)) {
            this.onContentsSearch(target.control.getValue());
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    //F8 (적용)
    ON_KEY_F8: function () {
        if (this.parentPageID == "ESQ201M") {//Serial/Lot No.
        }
        else {
            this.onFooterApply();
        };
    },
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.SERIAL_IDX = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    }
});

