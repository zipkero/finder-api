window.__define_resource && __define_resource("LBL05272","BTN00141","LBL10613","LBL01127","LBL01356","LBL10614","LBL01956","LBL10615","LBL00703","LBL09406","LBL02895","LBL06764","LBL05125","LBL01743","LBL10616","LBL10617","LBL01448","LBL03589","BTN00168","BTN00065","BTN00008","LBL85026","LBL00540","LBL90114","MSG04486","LBL07157","LBL10618","MSG06027","MSG06020","MSG03698");
/****************************************************************************************************
1. Create Date : 2016.01.25
2. Creator     : 이정민
3. Description : 매출전표3 계정설정(Account Settings for Sales Invoice III )
4. Precaution  :
5. History     : 2018.12.27 (HoangLinh): Remove $el
6. Old File    :
****************************************************************************************************/


ecount.page.factory("ecount.page.popup.type1", "EBD014P_01", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    header: null,
    contents: null,
    footer: null,
    pageGrid1: null,
    pageGrid2: null,
    errorMessage: null,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    initProperties: function () {

        initPageData.call(this);

        function initPageData() {
            this.basicEntrySet = null;

            this.etcEntrySetDetailInc = [];
            this.etcEntrySetDetailDec = [];
        }
    },

    init: function (options) {
        debugger;

        this.initProperties();
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this.basicEntrySet = $.extend(this.basicEntrySet, this.viewBag.InitDatas.EntryDisplaySetting);
        this.etcEntrySetDetailInc = $.extend(this.etcEntrySetDetailInc, this.viewBag.InitDatas.EntryDisplayEtcDetailInc);
        this.etcEntrySetDetailDec = $.extend(this.etcEntrySetDetailDec, this.viewBag.InitDatas.EntryDisplayEtcDetailDec);
        this.Permit = this.viewBag.InitDatas.Permit;

        this._super.render.apply(this);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var g = widget.generator,
            contents = g.contents();

        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL05272)
            .add("option", [{ id: "restoreDefault", label: ecount.resource.BTN00141 }]);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            form = generator.form(),
            ctrl = generator.control(),
            divToolbar = generator.divContainer(),
            grid1 = generator.grid(),
            grid2 = generator.grid();

        //divToolbar
        //    .css("wrapper-toolbar")
        //    .add(generator.subTitle().title(ecount.resource.LBL10613).css("")/*.inline()*/) // 안에 .inline() 을 붙이면 span으로 감싸집니다.
        //contents.add(divToolbar);
        contents.add(generator.subTitle().title(ecount.resource.LBL10613));

        var control = [];

        control.push(ctrl.define("widget.multiCode.account", "cr_code1", "CR_CODE1", ecount.resource.LBL01127).singleCell().maxSelectCount(1).end());

        control.push(ctrl.define("widget.multiCode.account", "cr_code2", "CR_CODE2", ecount.resource.LBL01356).singleCell().maxSelectCount(1).end());

        control.push(ctrl.define("widget.custom", "CUSTOM_LAYER", "CUSTOM_LAYER", ecount.resource.LBL10614).end());

        control.push(ctrl.define("widget.multiCode.account", "dr_code1", "DR_CODE1", ecount.resource.LBL01956).singleCell().maxSelectCount(1).end());

        form.useInputForm();
        form.addControls(control);

        contents.add(form);

        grid1
            .setColumns([
                { propertyName: 'GYE_NAME', id: 'GYE_NAME', title: ecount.resource.LBL10615, width: 180, align: "left", controlType: 'widget.input.general', dataType: '0' },
                { propertyName: 'ACCT_TYPE', id: 'ACCT_TYPE', title: ecount.resource.LBL00703, width: 90, align: "left", controlType: 'widget.select' },
                { propertyName: 'ACCT_NO', id: 'ACCT_NO', width: 0, align: "left", controlType: 'widget.input' },   //always hide 
                { propertyName: 'GYE_CODE', id: 'GYE_CODE', width: 0, align: "left", controlType: 'widget.input' },   //always hide 
                { propertyName: 'GYE_DES', id: 'GYE_DES', title: ecount.resource.LBL09406 + "/" + ecount.resource.LBL02895, width: 180, align: "left", controlType: 'widget.code.account' },
                { propertyName: 'CUST_NAME', id: 'CUST_NAME', width: 0, align: "left", controlType: 'widget.input.general', dataType: '0' }, //always hide 
                { propertyName: 'DEFAULT_TYPE', id: 'DEFAULT_TYPE', title: ecount.resource.LBL06764, width: 180, align: "left", controlType: 'widget.select' },
                { propertyName: 'RATE', id: 'RATE', title: ecount.resource.LBL05125 + "(%)", width: 60, align: "left", controlType: 'widget.input.number', dataType: '96', controlOption: { decimalUnit: [10, 6] } },
                { propertyName: 'SORT', id: 'SORT', title: ecount.resource.LBL01743, width: 60, align: "right", controlType: 'widget.input.number', dataType: '90', controlOption: { decimalUnit: [3, 0] } }
            ])
            .setEditable(true, 5, 0)
            .setStyleBorderRemoveLeftRight(true)
            .setHeaderTopLeftHTML("<div class=\"wrapper-sub-title\">" + ecount.resource.LBL10616 + "</div>")
            .setEventWidgetTriggerObj(this.events) //그리드에서 위젯 팝업 이벤트 바인딩 (widget popuphandler event binding in grid)
            .setRowData(this.etcEntrySetDetailInc)
            .setCustomRowCell('GYE_NAME', this.setEditableColumns.bind(this))
            .setCustomRowCell('ACCT_TYPE', this.setAcctType.bind(this))
            .setCustomRowCell('GYE_DES', this.setGyeCodeOnGrid.bind(this))
            .setCustomRowCell('DEFAULT_TYPE', this.setDefaultType.bind(this))
            .setCustomRowCell('RATE', this.setRateValue.bind(this));

        grid2
            .setColumns([
                { propertyName: 'GYE_NAME', id: 'GYE_NAME', title: ecount.resource.LBL10615, width: 180, align: "left", controlType: 'widget.input.general', dataType: '0' },
                { propertyName: 'ACCT_TYPE', id: 'ACCT_TYPE', title: ecount.resource.LBL00703, width: 90, align: "left", controlType: 'widget.select' },
                { propertyName: 'ACCT_NO', id: 'ACCT_NO', width: 0, align: "left", controlType: 'widget.input' },   //always hide 
                { propertyName: 'GYE_CODE', id: 'GYE_CODE', width: 0, align: "left", controlType: 'widget.input' },   //always hide 
                { propertyName: 'GYE_DES', id: 'GYE_DES', title: ecount.resource.LBL09406 + "/" + ecount.resource.LBL02895, width: 180, align: "left", controlType: 'widget.code.account' },
                { propertyName: 'CUST_NAME', id: 'CUST_NAME', width: 0, align: "left", controlType: 'widget.input.general', dataType: '0' }, //always hide 
                { propertyName: 'DEFAULT_TYPE', id: 'DEFAULT_TYPE', title: ecount.resource.LBL06764, width: 180, align: "left", controlType: 'widget.select' },
                { propertyName: 'RATE', id: 'RATE', title: ecount.resource.LBL05125 + "(%)", width: 60, align: "left", controlType: 'widget.input.number', dataType: '96', controlOption: { decimalUnit: [10, 6] } },
                { propertyName: 'SORT', id: 'SORT', title: ecount.resource.LBL01743, width: 60, align: "right", controlType: 'widget.input.number', dataType: '90', controlOption: { decimalUnit: [3, 0] } }
            ])
            .setEditable(true, 5, 0)
            .setStyleBorderRemoveLeftRight(true)
            .setHeaderTopLeftHTML("<div class=\"wrapper-sub-title\">" + ecount.resource.LBL10617 + "</div>")
            .setEventWidgetTriggerObj(this.events) //그리드에서 위젯 팝업 이벤트 바인딩 (widget popuphandler event binding in grid)
            .setRowData(this.etcEntrySetDetailDec)
            .setCustomRowCell('GYE_NAME', this.setEditableColumns.bind(this))
            .setCustomRowCell('ACCT_TYPE', this.setAcctType.bind(this))
            .setCustomRowCell('GYE_DES', this.setGyeCodeOnGrid.bind(this))
            .setCustomRowCell('DEFAULT_TYPE', this.setDefaultType.bind(this))
            .setCustomRowCell('RATE', this.setRateValue.bind(this));

        contents.addGrid("gridObj1" + this.pageID, grid1);
        contents.addGrid("gridObj2" + this.pageID, grid2);
    },

    onInitControl: function (cid, control) {
        var ctrl = widget.generator.control();

        switch (cid) {
            case "CUSTOM_LAYER":
                //COST_FLAG value 0: NOT USE, 1: USE
                control.setCutInControlsTag([{ "index": 0, "value": "&nbsp;" }])
                    .addControl(ctrl.define("widget.radio", "COST_FLAG", "COST_FLAG", ecount.resource.LBL10614)
                        .label([ecount.resource.LBL01448, ecount.resource.LBL03589]).value(['1', '0'])
                        .select($.isEmpty(this.basicEntrySet.COST_FLAG) ? '0' : this.basicEntrySet.COST_FLAG)
                        .setInlineIndex(0).noneFlex(true))
                    .addControl(ctrl.define("widget.link", "COST_FLAG_SET", "COST_FLAG_SET", ecount.resource.BTN00168)
                        .label(ecount.resource.BTN00168)
                        .setInlineIndex(0));
                break;
            case "cr_code1":
                if (!$.isEmpty(this.basicEntrySet.CR_GYE_CODE1)) {
                    control.addCode({ value: this.basicEntrySet.CR_GYE_CODE1, label: this.basicEntrySet.CR_GYE_DES1 });
                }
                break;
            case "cr_code2":
                if (!$.isEmpty(this.basicEntrySet.CR_GYE_CODE2)) {
                    control.addCode({ value: this.basicEntrySet.CR_GYE_CODE2, label: this.basicEntrySet.CR_GYE_DES2 });
                }
                break;
            case "dr_code1":
                if (!$.isEmpty(this.basicEntrySet.DR_GYE_CODE1)) {
                    control.addCode({ value: this.basicEntrySet.DR_GYE_CODE1, label: this.basicEntrySet.DR_GYE_DES1 });
                }
                break;
        }
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(this.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
        toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));

        footer.add(toolbar);
    },

    onChangeControl: function (control, data) {
        switch (control.cid) {
            case "COST_FLAG":
                if (control.value == "1") { //Use
                    this.contents.getControl("CUSTOM_LAYER").get(1).enable();
                } else { //Do not use
                    this.contents.getControl("CUSTOM_LAYER").get(1).disable();
                }
                break;
        }
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    onPopupHandler: function (control, param, handler) {
        if (control.controlType == "widget.multiCode.account") {
            param.isCheckBoxDisplayFlag = false;
        }

        handler(param);
    },

    onLoadComplete: function (event) {
        if (this.basicEntrySet.COST_FLAG == 1) { //Use
            this.contents.getControl("CUSTOM_LAYER").get(1).enable();
        } else { //Do not use
            this.contents.getControl("CUSTOM_LAYER").get(1).disable();
        }

        this.pageGrid1 = this.contents.getGrid("gridObj1" + this.pageID).grid;
        this.pageGrid2 = this.contents.getGrid("gridObj2" + this.pageID).grid;

        this.pageGrid1.render();
        this.pageGrid2.render();
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);

        var gridObj = this.contents.getGrid(grid.id).grid;
        var rowList = gridObj.getRowList();

        $.each(rowList, function (i, item) {
            var rowKey = parseInt(item[ecount.grid.constValue.keyColumnPropertyName]);

            if ($.isEmpty(item.GYE_NAME)) {
                gridObj.setEditable(false, 'GYE_DES', rowKey);
                gridObj.setEditable(false, 'RATE', rowKey);
                gridObj.setEditable(false, 'SORT', rowKey);

                gridObj.setSelectDisabled('ACCT_TYPE', rowKey, true);
                gridObj.setSelectDisabled('DEFAULT_TYPE', rowKey, true);
            }
        });
    },

    setAcctType: function (value, rowItem) {
        var option = {};
        var selectOption = new Array();
        var _self = this;

        option.controlType = 'widget.select';

        selectOption.push(['00', ecount.resource.LBL09406, '']);
        selectOption.push(['30', ecount.resource.LBL02895, '']);
        option.optionData = selectOption;

        option.data = $.isEmpty(rowItem.ACCT_TYPE) == true ? "00" : rowItem.ACCT_TYPE;

        option.event = {
            change: function (e, data) {
                var target = data.gridId;
                var gridObj = _self.GetGrid(target);

                // 계정/통장 구분을 빈값 처리 후 CUSTOMROWCELL을 다시 호출하여 팝업 위젯 타입을 변경한다.
                // account/bankAccount Flag is empty, then recall CUSTOMROWCELL to widget type Change.
                gridObj.setCell("GYE_DES", data.rowKey, "");
                gridObj.setCell("GYE_CODE", data.rowKey, "");

                gridObj.setCell("CUST_NAME", data.rowKey, "");
            },
        };

        return option;
    },

    setDefaultType: function (value, rowItem) {
        var option = {};
        var selectOption = new Array();
        var _self = this;

        option.controlType = 'widget.select';

        option.data = $.isEmpty(rowItem.DEFAULT_TYPE) == true ? "1" : rowItem.DEFAULT_TYPE;

        selectOption.push(['1', ecount.resource.LBL85026, '']);
        selectOption.push(['2', "(" + ecount.resource.LBL00540 + "+" + ecount.resource.LBL01356 + ")*" + ecount.resource.LBL05125, '']);
        selectOption.push(['3', ecount.resource.LBL00540 + "*" + ecount.resource.LBL05125, '']);
        selectOption.push(['4', ecount.resource.LBL01356 + "*" + ecount.resource.LBL05125, '']);

        option.optionData = selectOption;

        option.event = {
            change: function (e, data) {
                var target = data.gridId;
                var gridObj = _self.GetGrid(target);

                if (data.newValue == "1") {
                    gridObj.setCell("RATE", data.rowKey, "");
                    gridObj.setEditable(false, "RATE", data.rowKey);
                } else {
                    gridObj.setEditable(true, "RATE", data.rowKey);
                }
            },
        };

        return option;
    },

    setEditableColumns: function (value, rowItem) {
        var option = {};
        var _self = this;

        option.event = {
            change: function (e, data) {
                var target = data.gridId;
                var gridObj = _self.GetGrid(target);

                //GYE_NAME is not Empty, Then all Grid Widget usable.
                //계정명 입력시 모든 그리드 위젯 활성화                
                if ($.isEmpty(data.newValue)) {
                    gridObj.setCell("GYE_DES", data.rowKey, "");
                    gridObj.setCell("SORT", data.rowKey, "");

                    gridObj.setEditable(false, "GYE_DES", data.rowKey);
                    gridObj.setEditable(false, "SORT", data.rowKey);

                    gridObj.setSelectDisabled('ACCT_TYPE', data.rowIdx, true);
                    gridObj.setSelectDisabled('DEFAULT_TYPE', data.rowIdx, true);
                } else {
                    //change Sort Column Value (Default Value is value of maxSort variable)
                    //기본적으로 sort 컬럼은 max값 변수로 대체
                    var maxSortValue = _self.GetMaxSort(target);

                    if ($.isEmpty(data.oldValue)) {
                        maxSortValue = parseInt(maxSortValue) + 1;
                        gridObj.setCell("SORT", data.rowKey, parseInt(maxSortValue));
                    }

                    gridObj.setEditable(true, "GYE_DES", data.rowKey);
                    gridObj.setEditable(true, "SORT", data.rowKey);

                    gridObj.setSelectDisabled('ACCT_TYPE', data.rowIdx, false);
                    gridObj.setSelectDisabled('DEFAULT_TYPE', data.rowIdx, false);
                }
            },
        };

        return option;
    },

    setGyeCodeOnGrid: function (value, rowItem) {
        var option = {};
        var _self = this;

        var acct_type = rowItem.ACCT_TYPE;

        if (acct_type == "30") { //if Type is BankAccount, then Change widget type            
            option.controlType = "widget.code.bankAccount";
            if ($.isEmpty(rowItem.GYE_DES)) {
                option.data = rowItem.CUST_NAME;
            }
        } else {
            option.controlType = "widget.code.account";
        }

        option.event = {
            'focus': function (e, data) {
                var target = data.gridId;
                var gridObj = _self.GetGrid(target);

                if (acct_type == "30") { //if Type is BankAccount, then Change widget type            
                    if ($.isEmpty(data.rowItem.GYE_DES)) {
                        option.data = rowItem.CUST_NAME;
                        gridObj.setCell("GYE_DES", data.rowItem[ecount.grid.constValue.keyColumnPropertyName], data.rowItem.CUST_NAME);
                    }
                }
            }.bind(this)
        };

        option.controlOption = {
            controlEvent: {
                itemSelect: function (rowKey, arg) {
                    var gridObj = _self.GetGrid(arg.control.gridID);

                    var accountFlag = gridObj.getCell("ACCT_TYPE", rowKey);
                    var code = "";
                    var name = "";

                    switch (arg.type) {
                        case "addCode":
                            if (accountFlag == "00") { // "00" -> Account (계정)
                                code = arg.message.data.GYE_CODE;
                                name = arg.message.data.GYE_DES;

                                gridObj.setCell("GYE_CODE", rowKey, code);
                            } else { // "30" -> BanckAccount (계좌)
                                code = arg.message.data.BUSINESS_NO;
                                name = arg.message.data.CUST_NAME;

                                gridObj.setCell("ACCT_NO", rowKey, code);
                            }

                            gridObj.setCell("GYE_DES", rowKey, name);
                            gridObj.setNextFocus("GYE_DES", rowKey);
                            break;
                    }
                }
            },
        }

        return option;
    },

    setRateValue: function (value, rowItem) {
        var option = {};

        if (rowItem.DEFAULT_TYPE == "1") {
            option.data = "";
        }

        return option;
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    onFooterSave: function () {
        debugger;
        if ((this.Permit.UPD == true && this.Permit.CU != true) || (this.Permit.UPD != true&& this.Permit.Value != "W")) {
            this.footer.getControl("save").setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL90114, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        ecount.confirm(ecount.resource.MSG04486, function (isOk) {
            if (isOk == true) {
                this.callSaveApi();
            }
            else {
                this.footer.getControl("save").setAllowClick();
            }
        }.bind(this));
    },

    onFooterClose: function () {
        this._getParent = ecount.page.popup.prototype._getParent;
        ecount.page.popup.prototype.close.call(this);
    },

    // History button clicked event
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.basicEntrySet.EDIT_DT,
            lastEditId: this.basicEntrySet.EDITOR_ID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false,
            additional: false
        });
    },

    onDropdownRestoreDefault: function (e) {
        var param = {};
        var _self = this;

        ecount.common.api({
            url: "/Account/Common/GetEntryEtcSet",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200") {
                    runSuccessFunc = result.Status == "202";
                    ecount.alert(result.Error);
                } else {
                    _self.etcEntrySetDetailInc.splice(0, _self.etcEntrySetDetailInc.length);
                    _self.etcEntrySetDetailDec.splice(0, _self.etcEntrySetDetailDec.length);
                    _self.basicEntrySet = result.Data.BasicInfo;

                    $.each(result.Data.DetailsInfo, function (i, x) {
                        if (x.Key.GYE_TYPE == "P") { //Account for Plus
                            _self.etcEntrySetDetailInc.push(x);
                        } else { //Account for Minus
                            _self.etcEntrySetDetailDec.push(x);
                        }
                    });

                    _self.contents.getControl("cr_code1").removeAll();
                    _self.contents.getControl("cr_code2").removeAll();
                    _self.contents.getControl("dr_code1").removeAll();

                    _self.contents.getControl("cr_code1").addCode({ value: _self.basicEntrySet.CR_GYE_CODE1, label: _self.basicEntrySet.CR_GYE_DES1 });
                    _self.contents.getControl("cr_code2").addCode({ value: _self.basicEntrySet.CR_GYE_CODE2, label: _self.basicEntrySet.CR_GYE_DES2 });

                    _self.contents.getControl("dr_code1").addCode({ value: _self.basicEntrySet.DR_GYE_CODE1, label: _self.basicEntrySet.DR_GYE_DES1 });

                    _self.contents.getControl("CUSTOM_LAYER").get(0).setValue(_self.basicEntrySet.COST_FLAG == "1" ? "1" : "0");

                    if (_self.basicEntrySet.COST_FLAG == 1) { //Use
                        _self.contents.getControl("CUSTOM_LAYER").get(1).enable();
                    } else { //Do not use
                        _self.contents.getControl("CUSTOM_LAYER").get(1).disable();
                    }

                    _self.contents.getGrid("gridObj1" + _self.pageID).draw();
                    _self.contents.getGrid("gridObj2" + _self.pageID).draw();
                }
            }
        });
    },

    onContentsCOST_FLAG_SET: function (e) {
        if ((this.Permit.UPD == true && this.Permit.CU != true) || (this.Permit.UPD != true && this.Permit.Value != "W")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL90114, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param = {
            width: 500,
            height: 400

        };
        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/EBD014P_02',
            name: ecount.resource.LBL10618,
            param: param,
            popupType: false,
            additional: false
        });
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

    GetGrid: function (gridId) {
        if (gridId.indexOf('gridObj1') > -1) {
            return this.pageGrid1;
        } else {
            return this.pageGrid2;
        }
    },

    GetMaxSort: function (gridId) {
        var gridRowList = null;
        var maxSortValue = 0;

        if (gridId.indexOf('gridObj1') > -1) {
            gridRowList = this.pageGrid1.getRowList();
        } else {
            gridRowList = this.pageGrid2.getRowList();
        }

        $.each(gridRowList, function (i, item) {
            if (item.SORT > maxSortValue) {
                maxSortValue = item.SORT;
            }
        });

        return maxSortValue;
    },

    callSaveApi: function () {
        if (this.errorMessage == null) {
            this.errorMessage = new Array();
        }

        var msg06027 = ecount.resource.MSG06027;
        if (msg06027 == "MSG06027") {
            msg06027 = "외상으로 계정을 입력 바랍니다.";
        }

        this.setValidateCodeEmpty("cr_code1", ecount.resource.MSG06020);
        this.setValidateCodeEmpty("cr_code2", ecount.resource.MSG03698);
        this.setValidateCodeEmpty("dr_code1", msg06027);

        if (this.errorMessage.length > 0) {
            this.setShowErrorMessage();
            this.footer.getControl("save").setAllowClick();
            this.errorMessage = null;
            return;
        }

        var data = this.setSaveApiJsonData();
        var _self = this;

        ecount.common.api({
            url: "/Account/Common/SaveEntryEtcSet",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    runSuccessFunc = result.Status == "202";
                    _self.footer.getControl("save").setAllowClick();
                    ecount.alert(result.Error);
                } else {
                    _self.sendMessage(_self);
                    _self.onFooterClose();
                }
            }
        });
    },

    setSaveApiJsonData: function () {
        var itemList_Inc = this.pageGrid1.getRowList();
        var itemList_Dec = this.pageGrid2.getRowList();

        var dec_seqNo = 1;
        var inc_seqNo = 1;

        var saveData = {
            BasicInfo: {},
            DetailsInfo: new Array()
        }

        // 1:use, 0: not use
        var costFlag = this.contents.getControl("CUSTOM_LAYER").get(0).getValue() == "1" ? true : false;

        saveData.BasicInfo = {
            CR_GYE_CODE1: this.contents.getControl("cr_code1").getSelectedCode()[0],
            CR_GYE_CODE2: this.contents.getControl("cr_code2").getSelectedCode()[0],
            DR_GYE_CODE1: this.contents.getControl("dr_code1").getSelectedCode()[0],
            COST_FLAG: costFlag
        };

        $.each(itemList_Dec, function (i, item) {
            var acctName = item.GYE_NAME;

            if ($.isEmpty(acctName)) {
                return;
            }

            saveData.DetailsInfo.push({
                GYE_NAME: acctName,
                GYE_TYPE: "M",
                ACCT_TYPE: item.ACCT_TYPE,
                GYE_CODE: item.ACCT_TYPE == "00" ? item.GYE_CODE : "", //ACCT_TYPE value '00' -> ACCOUNT CODE
                ACCT_NO: item.ACCT_TYPE == "30" ? item.ACCT_NO : "", //ACCT_TYPE value '30' -> BANK_ACCOUNT CODE
                DEFAULT_TYPE: item.DEFAULT_TYPE,
                RATE: item.RATE,
                SORT: item.SORT,
                ETC_SEQ: dec_seqNo
            });

            dec_seqNo++;
        });

        $.each(itemList_Inc, function (i, item) {
            var acctName = item.GYE_NAME;

            if ($.isEmpty(acctName)) {
                return;
            }

            saveData.DetailsInfo.push({
                GYE_NAME: acctName,
                GYE_TYPE: "P",
                ACCT_TYPE: item.ACCT_TYPE,
                GYE_CODE: item.ACCT_TYPE == "00" ? item.GYE_CODE : "", //ACCT_TYPE value '00' -> ACCOUNT CODE
                ACCT_NO: item.ACCT_TYPE == "30" ? item.ACCT_NO : "", //ACCT_TYPE value '30' -> BANK_ACCOUNT CODE
                DEFAULT_TYPE: item.DEFAULT_TYPE,
                RATE: item.RATE,
                SORT: item.SORT,
                ETC_SEQ: inc_seqNo
            });

            inc_seqNo++;
        });

        return saveData;
    },

    setErrorMessage: function (controlId, message, type, callback) {
        callback = callback || function () { };

        this.errorMessage.push({ controlId: controlId, errorMessage: message, type: type, callback: callback });
    },

    setValidateCodeEmpty: function (Id, msg) {
        var codeValue = this.contents.getControl(Id).getSelectedCode()[0];

        if ($.isEmpty(codeValue)) {
            this.setErrorMessage(Id, msg, "widget");
        }
    },

    setShowErrorMessage: function () {
        var _self = this;
        var focusTarget = null;

        var errorsOfForm = this.errorMessage.where(function (x) {
            return x.type === "widget";
        });

        showFormError(errorsOfForm);

        //----------------------------------------
        // form/grid(폼,그리드)
        // Message/Confirm Error
        //----------------------------------------
        if ($.isNull(focusTarget) == false || $.isEmpty(errorsOfForm) == false) {
            showFocusTarget();
            return;
        }

        //----------------------------------------
        // Message error
        //----------------------------------------
        var errorOfMessage = this.errorMessage.first(function (obj) { return obj.type === "message"; });
        if ($.isEmpty(errorOfMessage) == false) {
            ecount.alert(errorOfMessage.errorMessage, errorOfMessage.callback);
            return;
        }

        //----------------------------------------
        // util
        //----------------------------------------
        // focus
        function showFocusTarget() {
            var error = focusTarget.error;

            //handling various Widget(종류에 따른 메시지 및 포커스 처리_
            switch (focusTarget.type) {
                case "form":
                    _self.contents.getControl(error.controlId).showError(error.errorMessage);
                    if (!_self.contents.getControl(error.controlId).isCombinedControl()) {
                        _self.contents.getControl(error.controlId).setFocus(0, { readonly: true }); //{ index: 0, readonly: true }
                    } else {
                        _self.contents.getControl(error.controlId).get(0).setFocus(0, { readonly: true }); //{ index: 0, readonly: true }
                    }
                    break;
            }

        }

        //setting focus target(포커스대상 콘트롤설정)
        function setFocusTarget(type, error) {
            return {
                type: type,
                error: error
            };
        }

        //form error(폼 에러표시)
        function showFormError(errors) {
            $.each(errors, function (i, x) {
                if ($.isNull(focusTarget)) {
                    focusTarget = setFocusTarget("form", x);
                    return true;
                }
                _self.contents.getControl(x.controlId).showError(x.errorMessage);
            });
        }

    },


});