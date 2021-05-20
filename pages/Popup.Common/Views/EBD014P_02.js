window.__define_resource && __define_resource("LBL05272","BTN00037","LBL01127","LBL02011","LBL08081","BTN00069","BTN00008","MSG06018","MSG06019","MSG06020","MSG06021");
/****************************************************************************************************
1. Create Date : 2016.02.11
2. Creator     : 이정민
3. Description : 매출전표3 매출원가계정설정(Cost Of Sales Account Settings for Sales Invoice III )
4. Precaution  :
5. History     : 
6. Old File    :
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type1", "EBD014P_02", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    header: null,
    contents: null,
    footer: null,
    pageGrid: null,
    costAcctSetDetails: null,
    errorMessage: null,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    initProperties: function () {
        initPageData.call(this);

        function initPageData() {
            this.costAcctSetDetails = [{
                OUT_GYE_CODE: null
            }];
        }
    },

    init: function (options) {
        debugger;

        this.initProperties();
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this.costAcctSetDetails = $.extend(this.costAcctSetDetails, this.viewBag.InitDatas.costAcctSetDetails);

        this._super.render.apply(this);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL05272);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        toolbar.addLeft(ctrl.define("widget.button", "deleteSelected").label(ecount.resource.BTN00037).css("btn btn-default btn-sm"));

        grid
            .setColumns([
                { propertyName: 'OUT_GYE_CODE', id: 'OUT_GYE_CODE', width: 0, align: "left", controlType: 'widget.input', dataType: '0' },   //always hide 
                { propertyName: 'OUT_GYE_DES', id: 'OUT_GYE_DES', title: ecount.resource.LBL01127, width: 150, align: "left", controlType: 'widget.code.account', dataType: '0' },
                { propertyName: 'COST_GYE_CODE', id: 'COST_GYE_CODE', width: 0, align: "left", controlType: 'widget.input', dataType: '0' },   //always hide 
                { propertyName: 'COST_GYE_DES', id: 'COST_GYE_DES', title: ecount.resource.LBL02011, width: 150, align: "left", controlType: 'widget.code.account', dataType: '0' },
                { propertyName: 'ST_GYE_DES', id: 'ST_GYE_DES', title: ecount.resource.LBL08081, width: 150, align: "left", controlType: 'widget.label', dataType: '0' }
            ])
            .setCheckBoxUse(true)
            .setEditable(true, 5, 1)
            .setEventAutoAddRowOnLastRow(true, 2)
            .setEventWidgetTriggerObj(this.events) //그리드에서 위젯 팝업 이벤트 바인딩 (widget popuphandler event binding in grid)
            .setRowData(this.costAcctSetDetails)
            .setCustomRowCell('OUT_GYE_DES', this.setGyeDesOnGrid.bind(this))
            .setCustomRowCell('COST_GYE_DES', this.setGyeDesOnGrid.bind(this));

        contents.add(toolbar);
        contents.addGrid("gridObj" + this.pageID, grid);
    },

    onInitControl: function (cid, control) {
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(this.resource.BTN00069).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));

        footer.add(toolbar);
    },

    onChangeControl: function (control, data) {
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    onPopupHandler: function (control, param, handler) {
        handler(param);
    },

    onLoadComplete: function (event) {
        this.pageGrid = this.contents.getGrid("gridObj" + this.pageID).grid;

        this.pageGrid.render();
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },

    setGyeDesOnGrid: function (value, rowItem) {
        var option = {};
        var _self = this;

        option.event = {
            change: function (e, data) {
                switch (data.columnId) {
                    case "OUT_GYE_DES":
                        if ($.isEmpty(data.newValue)) {
                            _self.pageGrid.setCell("OUT_GYE_CODE", data.rowKey, "");
                        }
                        break;
                    case "COST_GYE_DES":
                        if ($.isEmpty(data.newValue)) {
                            _self.pageGrid.setCell("COST_GYE_CODE", data.rowKey, "");
                            _self.pageGrid.setCell("ST_GYE_DES", data.rowKey, "");
                        }
                        break;
                }
            },
        };

        option.controlOption = {
            controlEvent: {
                itemSelect: function (rowKey, arg) {
                    var id = arg.control.id;
                    var isSetCell = true;

                    switch (arg.type) {                        
                        case "addCode":
                            if (id == "COST_GYE_DES") {
                                var param = {
                                    GYE_CODE: arg.message.data.GYE_CODE
                                };

                                ecount.common.api({
                                    url: "/Account/Common/GetInventoryAccount",
                                    data: Object.toJSON(param),
                                    success: function (result) {
                                        if (result.Status != "200") {
                                            runSuccessFunc = result.Status == "202";
                                            ecount.alert(result.Error);
                                        } else {
                                            if ($.isEmpty(result.Data) == false) {
                                                _self.pageGrid.setCell("ST_GYE_DES", rowKey, result.Data.CODE_NAME);

                                                _self.pageGrid.setCell(id, rowKey, arg.message.data.GYE_DES);
                                                _self.pageGrid.setCell(id.replace("DES", "CODE"), rowKey, arg.message.data.GYE_CODE);

                                                _self.pageGrid.setNextFocus(id, rowKey);
                                            } else {
                                                isSetCell = false;
                                                ecount.alert(ecount.resource.MSG06018);
                                                _self.pageGrid.setCellFocus(id, rowKey);
                                            }
                                        }
                                    }
                                });
                            } else { // OUT_GYE_CODE
                                var itemList = _self.pageGrid.getRowList();
                                var gyeCodeArray = new Array();

                                $.each(itemList, function (i, item) {
                                    if ($.isEmpty(item.OUT_GYE_CODE)) {
                                        return;
                                    }

                                    if (gyeCodeArray.contains(arg.message.data.GYE_CODE)) {
                                        isSetCell = false;
                                    }

                                    gyeCodeArray.push(item.OUT_GYE_CODE);
                                });

                                if (isSetCell == true) {
                                    _self.pageGrid.setCell(id, rowKey, arg.message.data.GYE_DES);
                                    _self.pageGrid.setCell(id.replace("DES", "CODE"), rowKey, arg.message.data.GYE_CODE);

                                    _self.pageGrid.setNextFocus(id, rowKey);
                                } else {
                                    ecount.alert(ecount.resource.MSG06019);
                                    _self.pageGrid.setCellFocus(id, rowKey);
                                }
                            }

                            break;
                    }
                }
            },
        }

        return option;
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    onFooterSave: function () {
        var _self = this;
        _self.callSaveApi();
    },

    onFooterClose: function () {
        this._getParent = ecount.page.popup.prototype._getParent;
        ecount.page.popup.prototype.close.call(this);
    },

    onContentsDeleteSelected: function (e) {

        var checkedDatas = this.pageGrid.getChecked();

        checkedDatas.forEach(function (x, i) {
            var rowKey = x[ecount.grid.constValue.keyColumnPropertyName];

            this.pageGrid.removeRow(rowKey);
            this.pageGrid.removeChecked([rowKey], false);
        }.bind(this));
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    /**********************************************************************
    * define user function
    **********************************************************************/

    callSaveApi: function () {
        var data = this.setSaveApiJsonData();
        var saveBtn = this.footer.getControl("save");
        var _self = this;

        if (this.errorMessage.length > 0) {
            saveBtn.setAllowClick();
            this.errorMessage = null;
            return;
        }

        ecount.common.api({
            url: "/Account/Common/SaveCostAcctSet",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    runSuccessFunc = result.Status == "202";
                    saveBtn.setAllowClick();
                    ecount.alert(result.Error);
                }
                else {
                    _self.onFooterClose();
                }
            }
        });
    },

    setSaveApiJsonData: function () {
        var _self = this;
        var itemList = this.pageGrid.getRowList();
        var saveData = {
            DetailsInfo: new Array()
        }
        //중복되는 계정코드 (be overlaped Code)
        var overlapCode = null;

        if (this.errorMessage == null) {
            this.errorMessage = new Array();
        }
        debugger;
        $.each(itemList, function (i, item) {
            if (overlapCode == null) {
                overlapCode = new Array();
            } else {
                if (overlapCode.contains(item.OUT_GYE_CODE)) {
                    _self.setErrorMessage("OUT_GYE_DES", ecount.resource.MSG06019, i);

                    return;
                }
            }

            if ($.isEmpty(item.OUT_GYE_CODE) == true) {

                if ($.isEmpty(item.COST_GYE_CODE) == false) {
                    _self.setErrorMessage("OUT_GYE_DES", ecount.resource.MSG06020, i);
                    return;
                }
            } else {

                if ($.isEmpty(item.COST_GYE_CODE) == true) {
                    _self.setErrorMessage("COST_GYE_DES", ecount.resource.MSG06021, i);
                    return;
                }

                overlapCode.push(item.OUT_GYE_CODE);

                saveData.DetailsInfo.push({
                    OUT_GYE_CODE: item.OUT_GYE_CODE,
                    COST_GYE_CODE: item.COST_GYE_CODE
                });
            }
        });

        $.each(this.errorMessage, function (i, x) {
            _self.pageGrid.setCellShowError(x.controlId, x.rowKey, {
                placement: 'top',
                message: x.errorMessage,
                popOverVisible: true
            });

            _self.pageGrid.setCellFocus(x.controlId, x.rowKey);
        });

        return saveData;
    },

    //그리드 에러 list
    setErrorMessage: function (controlId, message, rowKey) {
        this.errorMessage.push({ controlId: controlId, errorMessage: message, rowKey: rowKey });
    },

});