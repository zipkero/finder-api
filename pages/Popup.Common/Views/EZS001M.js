window.__define_resource && __define_resource("MSG09880","LBL02339","LBL14288","LBL10489","BTN00274","BTN00065","BTN00007","BTN00008","MSG07230","MSG07231","MSG07232","MSG07233","LBL80183","MSG00475");
/****************************************************************************************************
1. Create Date : 2017.03.16
2. Creator     : 이용희
3. Description : 웹자료 올리기 팝업(Web uploader popup)
4. Precaution  :
5. History     : 2017.08.22 이수진 - GMCAPI , ECAPI 분기 추가
                 2018.01.08(양미진) - 부가세 웹자료올리기 연도별로 저장되도록 수정
                 2020.03.25 (TanThanh) - Add notify MSG09880
                 2020.06.08 (tuan) Authorization PreJob - A20_01930_Auth_Account01
6. Old File    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "EZS001M", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    isOpenPopup: true,

    currentTabId: null,

    currentTabIdx: -1,

    columns: [],

    resultData: null,

    saveComplete: true,

    formTypeForGmc: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        formTypeForGmc = []; // 저장할 때 GMC API를 타게 하기 위해서 FORM TYPE 추가
    },

    render: function () {
        this._super.render.apply(this);
    },


    //header 옵션 설정
    onInitHeader: function (header, resource) {
        header.setTitle(formTypeForGmc.contains(this.viewBag.FormType) ? 'ECOUNT Web Uploader' : ecount.resource.LBL02339).notUsedBookmark();
    },

    //body 옵션 설정
    onInitContents: function (contents) {
        var g = widget.generator
            , grid = g.grid()
            , ctrl = g.control()
            , tabContents = g.tabContents()
            , toolbar = g.toolbar()
            , toolbarNotify = g.toolbar()
            , formTabs = this.viewBag.FormTabs
            , formColumns = formTabs && formTabs[0].FormInfos;

        if (formColumns.length > 0) {
            this.currentTabIdx = 0;
            this.currentTabId = formTabs[0]['Title'];
        }

        //그리드 설정
        this.setColumnsByTab(formColumns);
        if (this.viewBag.FormType == "PI085") {
            var col = this.columns.first(function (x) { return x.id == "APPLY_TAX_BRACKET"; });
            col.title = this.TAX_BRACKET_TYPE == "1" ? ecount.resource.LBL14288 : ecount.resource.LBL10489;

        }
        grid
            .setColumns(this.columns)
            .setRowData([])
            .setHeaderFix(true)
            .setColumnFixHeader(true)
            .setRowDataNumbering(true, false, { width: 40, title: 'No.' })
            .setCellResize(true, 'width')
            .setEditable(true, 3, 0)
            .setEditableUseViewMode(true)
            .setEditRowShowInputOutLine(false)
            .setEditLimitAddRow(300)
            .setEditClipboardMode(true, 0)
            .setEventClipboardCallback(this.gridClipboardCallback.bind(this))
            .setEvnetRightClickMode(true)
            .setEventAutoAddRowOnLastRow(true, 2)
            .setStyleDisableTableHover(true)

        $.each(formTabs, function (i, x) {
            var tabId = i + 'tabs',
                tabTitle = formTabs[i]['Title'],
                isActive = false;

            if (i == 0) {
                isActive = true;
            }

            tabContents.createTab(tabId, tabTitle, null, isActive, "left");
        });

        //버튼 및 탭 설정
        toolbar
            .setOptions({ ignorePrimaryButton: true, css: 'btn btn-default btn-sm' })
            .addLeft(ctrl.define("widget.button", "excelDownload").label(formTypeForGmc.contains(this.viewBag.FormType) ? 'Download Excel Template' : ecount.resource.BTN00274));

        tabContents.onSingleMode();
        tabContents.add(toolbar);
        toolbarNotify
            .addLeft(ctrl.define("widget.label", "toolbarNotify")
            .label(formTypeForGmc.contains(this.viewBag.FormType) ? 'Please fill in the Excel file you downloaded with Download Excel Template and paste it in to the table below.' : ecount.resource.MSG09880));
        tabContents.add(toolbarNotify);
        tabContents.addGrid("dataGrid", grid);

        contents.add(tabContents);

    },

    //footer 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar();

        footer.add(toolbar);
    },

    onRefreshFooter: function () {
        var toolbar = this.footer.get(0);
        var ctrl = widget.generator.control();
        var res = ecount.resource;
        var toolbarList = [];

        toolbar.remove();
        toolbarList.push(ctrl.define("widget.button", "save").label(formTypeForGmc.contains(this.viewBag.FormType) ? 'Save (F8)' : ecount.resource.BTN00065).clickOnce().end());
        toolbarList.push(ctrl.define("widget.button", "rewrite").label(formTypeForGmc.contains(this.viewBag.FormType) ? 'Reset' : ecount.resource.BTN00007).end());
        toolbarList.push(ctrl.define("widget.button", "close").label(formTypeForGmc.contains(this.viewBag.FormType) ? 'Close' : ecount.resource.BTN00008).end());

        if (this.viewBag.FormTabs[this.currentTabIdx] && this.viewBag.FormTabs[this.currentTabIdx]['OverwriteFlag'] == true) {
            toolbarList.push(ctrl.define("widget.checkbox", "overwrite").label("overwrite").end());
        }

        toolbar.addLeft(toolbarList);
    },

    onGridRenderBefore: function (gridId, settings) {
        settings.setHeaderTopMargin(this.header.height());
    },

    gridClipboardCallback: function (result) {
        var gridObj = this.contents.getGrid('dataGrid'),
            grid = gridObj.grid;

        //붙여넣기 성공 시
        if (result.success == true) {
            //처음으로 붙여넣기할 때, 이것만 사용
            if (result.firstSetting == true) {
                if (result.rowData.length > 300) {
                    result.rowData = result.rowData.slice(0, 300);
                    ecount.alert(String.format(ecount.resource.MSG07230, '300'));
                }

                gridObj.getSettings().setRowData(result.rowData);
                gridObj.draw();
            }
            //이후 붙여넣기할 때, 보류
            else {
                var rowIdx = parseInt(result.currentRowKey, 10);

                for (var idx = 0, len = result.rowData.length; idx < len; idx++) {
                    var rowData = result.rowData[idx];

                    for (var colIdx = 0, colLen = rowData.length; colIdx < colLen; colIdx++) {
                        grid.setCellByIndex(result.columnIdList[colIdx], rowIdx + idx, rowData[colIdx]);
                    }
                }
                grid.setCellFocus(result.currentColumnId, result.currentRowKey);
            }
        }
        //붙여넣기 실패 시
        else {
            if (result.failCause == 'excess') {
                ecount.alert(ecount.resource.MSG07231);
            }
            else if (result.failCause == 'partial error') {
                ecount.alert(ecount.resource.MSG07232);
            }
            else if (result.failCause == 'incorrect form') {
                ecount.alert(ecount.resource.MSG07233);
            }
        }

        this.contents.getTabContents(this.currentTabId).clearAllInvalidStatus();
        grid.setColumnVisibility('checkSuccess', false);
    },

    onContentsExcelDownload: function () {

        if (this.viewBag.FormType == 'AI760') {
            var sendData = {
                GYE_CODE: this.GYE_CODE,
                TABLE_TYPE: this.TABLE_TYPE,
                FormType: this.viewBag.FormType
            };

            this.EXPORT_EXCEL({
                url: "/Account/Basic/GetListBulkFormTemplateByBalanceForExcel",
                param: sendData
            });
        } else {

            var sendData = {
                FormType: this.viewBag.FormType,
                ManagementType: "UO",
            };

            if (this.viewBag.FormType == "PI085") {
                sendData.TAX_BRACKET_TYPE = this.TAX_BRACKET_TYPE
                sendData.FORM_SEQ = this.FORM_SEQ
            }
            this.EXPORT_EXCEL({
                url: "/Common/Form/DownloadBulkFormExcel",
                param: sendData
            });
        }
    },

    onFooterSave: function () {
        debugger
        var data = this.viewBag.FormType == "PI080" ? this.setSaveApiJsonData_RC() : this.setSaveApiJsonData(),
            saveUrl = this.viewBag.FormTabs[this.currentTabIdx]['SaveActionUrl'],
            _self = this;
        _self.saveComplete = false;

        //수출실적명세서, 내국신용장ㆍ구매확인서 전자발급명세서, 영세율첨부서류제출명세서, 부동산임대공급가액명세서, 신용카드 매입전표 등 수령금액 합계표, 의제매입세액공제신고서, 일 때 연도별로 저장되도록 수정
        if (this.viewBag.FormType == "TI010" || this.viewBag.FormType == "TI011" || this.viewBag.FormType == "TI012" || this.viewBag.FormType == "TI013" || this.viewBag.FormType == "TI014" || this.viewBag.FormType == "TI015" || this.viewBag.FormType == "TI016") {
            if (this.VatKeyData.ISSUE_YEAR.length >= 4) {
                saveUrl = saveUrl.replace("/Vat/", "/Vat" + this.VatKeyData.ISSUE_YEAR.substring(0, 4) + "/");
            }
        }

        if (data.DefaultBulkDatas.length > 0) {
            _self.showProgressbar(null, null, 0);

            if (formTypeForGmc.contains(this.viewBag.FormType)) { // GMC API

                ecount.common.gmcSessionApi({
                    sessionURL: saveUrl,
                    callbackApi: function (_saveUrl) {
                        ecount.common.api({
                            url: _saveUrl,
                            data: Object.toJSON(data),
                            success: function (result) {
                                _self.contents.getGrid('dataGrid').grid.setColumnVisibility('checkSuccess', true);
                                _self.resultData = result.Data;

                                _self.openWindow({
                                    url: '/ECERP/Popup.Common/UploaderResult',
                                    name: ecount.resource.LBL80183,
                                    popupType: false,
                                    param: {
                                        width: 600,
                                        height: 500,
                                        ResultData: _self.resultData
                                    }
                                });
                                _self.checkErrorResult(_self.resultData['ResultDetails']);
                            },
                            complete: function () {
                                _self.hideProgressbar(true);
                                _self.footer.getControl("save").setAllowClick();
                            }
                        });
                    }
                });
            } else { // ECAPI

                if (_self.viewBag.FormType == "PI085") {
                    data = _self.setSaveApiJsonDataForTaxBracketDetail();
                }
                ecount.common.api({
                    url: saveUrl,
                    data: Object.toJSON(data),
                    success: function (result) {
                        _self.contents.getGrid('dataGrid').grid.setColumnVisibility('checkSuccess', true);
                        _self.resultData = result.Data;

                        _self.openWindow({
                            url: '/ECERP/Popup.Common/UploaderResult',
                            name: ecount.resource.LBL80183,
                            popupType: false,
                            param: {
                                width: 600,
                                height: 500,
                                ResultData: _self.resultData
                            }
                        });

                        _self.checkErrorResult(_self.resultData['ResultDetails']);
                        _self.footer.getControl("save").setAllowClick();

                    },
                    complete: function () {
                        _self.hideProgressbar(true);
                        _self.footer.getControl("save").setAllowClick();
                    }
                });
            }
        }
        else {
            //자료 입력 없이 저장을 눌렀을 때
            this.contents.getGrid('dataGrid').grid.activeCellFocusout();
            ecount.alert(ecount.resource.MSG00475);
            this.saveComplete = true;
            this.footer.getControl("save").setAllowClick();
        }

    },

    setSaveApiJsonDataForTaxBracketDetail: function () {
        var data = this.setSaveApiJsonData();
        debugger
        return objData = {
            Request: {
                Data: {
                    TAX_BRACKET_CD: this.TAX_BRACKET_CD,
                    APPLY_DATE: this.APPLY_DATE,
                    FORM_SEQ: this.FORM_SEQ,
                    TAX_BRACKET_APPLY_TYPE: this.TAX_BRACKET_APPLY_TYPE,
                    DefaultBulkDatas: data.DefaultBulkDatas
                },
                CheckPermissionRequest: this.CheckPermissionRequest
            }
        }
    },
    onFooterRewrite: function () {
        var param = {
            width: 1000,
            height: 640,
            ProdGubun: '1',
            isOpenPopup: this.isOpenPopup,
            FormType: this.viewBag.FormType,
            VatKeyData: this.VatKeyData,
            GYE_CODE: this.GYE_CODE,
            TABLE_TYPE: this.TABLE_TYPE,
            BAL_DATE: this.BAL_DATE
        };

        this.onAllSubmitSelf("/ECERP/Popup.Common/EZS001M", param, this.currentTabId);
    },

    onFooterClose: function () {
        if (this.VatKeyData != null) {
            var message = {
                VAT_SITE: this.VatKeyData.VAT_SITE,
                BUSINESS_NO: this.VatKeyData.BUSINESS_NO,
                JOB_COM: this.VatKeyData.JOB_COM,
                ISSUE_YEAR: this.VatKeyData.ISSUE_YEAR,
                PHASE_FROM: this.VatKeyData.PHASE_FROM,
                PHASE_TO: this.VatKeyData.PHASE_TO,
                PHASE: this.VatKeyData.PHASE,
                EDIT_MODE: this.VatKeyData.EDIT_MODE,
                DOC_NO: this.VatKeyData.DOC_NO,
                GUBUN: this.VatKeyData.GUBUN,
                RPT_DATE: this.VatKeyData.RPT_DATE,
                DT_OMIT_SDATE: this.VatKeyData.DT_OMIT_SDATE,
                DT_OMIT_EDATE: this.VatKeyData.DT_OMIT_EDATE,
                RPT_TYPE: this.VatKeyData.RPT_TYPE,
                REFRESH_FLAG: "Y"
            };
            this.sendMessage(this, message);
        }
        else if (this.FormType == "AI760") {
            if (!$.isEmpty(this.resultData)) {
                this.sendMessage(this, {});
            }
            this.close();
        }
        else {
            if (!$.isEmpty(this.resultData)) {
                var message = this.resultData;
                this.sendMessage(this, message);
            }

            this.close();
        }
    },

    onMessageHandler: function (event, data) {
        this.saveComplete = true;
    },

    //X버튼 클릭시
    onClosedPopupHandler: function (control) {
        if (this.VatKeyData != null) {
            var message = {
                VAT_SITE: this.VatKeyData.VAT_SITE,
                BUSINESS_NO: this.VatKeyData.BUSINESS_NO,
                JOB_COM: this.VatKeyData.JOB_COM,
                ISSUE_YEAR: this.VatKeyData.ISSUE_YEAR,
                PHASE_FROM: this.VatKeyData.PHASE_FROM,
                PHASE_TO: this.VatKeyData.PHASE_TO,
                PHASE: this.VatKeyData.PHASE,
                EDIT_MODE: this.VatKeyData.EDIT_MODE,
                DOC_NO: this.VatKeyData.DOC_NO,
                GUBUN: this.VatKeyData.GUBUN,
                RPT_DATE: this.VatKeyData.RPT_DATE,
                DT_OMIT_SDATE: this.VatKeyData.DT_OMIT_SDATE,
                DT_OMIT_EDATE: this.VatKeyData.DT_OMIT_EDATE,
                RPT_TYPE: this.VatKeyData.RPT_TYPE,
                REFRESH_FLAG: "Y"
            };
            this.sendMessage(this, message);
        }
        else if (this.FormType == "AI760") {
            if (!$.isEmpty(this.resultData)) {
                this.sendMessage(this, {});
            }
            this.close();
        }
    },

    ON_KEY_ESC: function () {
        var grid = this.contents.getGrid('dataGrid').grid,
            columnId = grid.getActiveCellColumnId(),
            rowKey = grid.getActiveCellRowId();

        if ((columnId == '' || columnId == null) && (rowKey == '' || rowKey == null)) {
            this.close();
        }
    },

    ON_KEY_F8: function () {
        if (this.saveComplete)
            this.onFooterSave();
    },

    onChangeContentsTab: function (event) {
        if (this.currentTabId != event.tabId) {
            this.currentTabId = event.tabId;

            var gridObj = this.contents.getGrid('dataGrid'),
                gridSettings = gridObj.getSettings(),
                tabList = this.viewBag.FormTabs,
                tabIdx = -1;

            gridObj.grid.resetClipboardObj();
            gridSettings.setRowData([]);

            $.each(tabList, function (i, x) {
                if (tabList[i]['Title'] == event.tabId) {
                    this.currentTabIdx = i;
                }
            });

            if (this.currentTabIdx > -1) {
                this.setColumnsByTab(tabList[this.currentTabIdx]['FormInfos']);
                gridSettings.setColumns(this.columns);
            }
            gridObj.draw();
        }
    },

    onGridRenderComplete: function (e, data, gridObj) {
        this._super.onGridRenderComplete.apply(this, arguments);
        var columns = gridObj.grid.getColumnInfoList();
        var column;
        for (var i = 0; i < columns.length; i++) {
            if (!columns[i].isHideColumn) {
                column = columns[i]
                break;
            }
        }

        if (column) {
            var rowKey = gridObj.grid.getRowKeyByIndex(0);
            gridObj.grid.setCellFocus(column.id, rowKey);
        }
    },

    setColumnsByTab: function (formColumns) {
        var columns = this.columns = [],
            okColumn;

        $.each(formColumns, function (idx, item) {
            var column = {};
            column['controlOption'] = {};
            column['columnOption'] = {};

            column['id'] = item['COL_CD'];
            if (item['COL_ESSENTIAL_YN'] === 'Y')
                column['headerClass'] = 'text-bold';

            column['title'] = item['HEAD_TITLE_NM'];
            column['propertyName'] = item['COL_CD'];
            column['controlType'] = 'widget.input';
            column['width'] = 120;

            column['columnOption'] = {
                controlType: 'widget.userHelpMark',
                attrs: {
                    'data-toggle': 'popover',
                    'data-html': 'true',
                    'data-content': item['HEAD_MEMO']
                }
            }


            columns.push(column);
        });

        okColumn = {
            id: 'checkSuccess',
            propertyName: 'checkSuccess',
            title: ecount.resource.LBL80183,
            width: 500,
            isHideColumn: true
        };

        columns.push(okColumn)

        this.columns = columns;
        return columns;
    },

    setSaveApiJsonData_RC: function () {
        var saveData = {
            DefaultBulkDatas: [],
            IsSlipBundling: true,
            PaidleaveList: [],
            attendList: [],
            EmployeeList: [],
            INFLOW: 'B',
            CheckPermissionRequest: this.CheckPermissionRequest
        };
        var grid = this.contents.getGrid('dataGrid').grid,
            itemList = grid.getRowList(),
            columnIdList = [];

        $.each(this.columns, function (i, item) {
            columnIdList.push(item['id'])
        });

        $.each(itemList, function (i, item) {
            var okString = item['CHECKSUCCESS'] && item['CHECKSUCCESS'].slice(-2).toUpperCase();

            if (okString != 'OK') {
                var rowData = {
                    Line: item[ecount.grid.constValue.keyColumnPropertyName],
                    BulkDatas: {}
                };
                var emptyCounter = 0;

                for (var prop in item) {
                    if (item[prop] === '')
                        emptyCounter++;
                }
                if (columnIdList.length == emptyCounter) {
                    return;
                }

                for (var idx = 0, len = columnIdList.length; idx < len; idx++) {
                    if (item[columnIdList[idx]]) {
                        rowData['BulkDatas'][columnIdList[idx]] = item[columnIdList[idx]];
                        if (columnIdList[idx] == "REST_DES")
                            saveData.PaidleaveList.push(item[columnIdList[idx]]);
                        else if (columnIdList[idx] == "EMP_DES")
                            saveData.EmployeeList.push(item[columnIdList[idx]]);
                        else if (columnIdList[idx] == "ATTEND_DES")
                            saveData.attendList.push(item[columnIdList[idx]]);
                    }
                    else
                        rowData['BulkDatas'][columnIdList[idx]] = '';
                }
                saveData.DefaultBulkDatas.push(rowData);
            }
        });
        debugger
        return saveData;
    },

    setSaveApiJsonData: function () {
        var saveData = {
            DefaultBulkDatas: [],
            IsSlipBundling: true,
            INFLOW: 'B',
            VatKeyData: this.VatKeyData,
            FORM_TYPE: this.viewBag.FormType,
            GYE_CODE: this.GYE_CODE,
            TABLE_TYPE: this.TABLE_TYPE,
            BAL_DATE: this.BAL_DATE,
            CheckPermissionRequest: this.CheckPermissionRequest
        };
        var grid = this.contents.getGrid('dataGrid').grid,
            itemList = grid.getRowList(),
            columnIdList = [];

        $.each(this.columns, function (i, item) {
            columnIdList.push(item['id'])
        });
        debugger
        $.each(itemList, function (i, item) {
            var okString = item['CHECKSUCCESS'] && item['CHECKSUCCESS'].slice(-2).toUpperCase();

            if (okString != 'OK') {
                var rowData = {
                    Line: item[ecount.grid.constValue.keyColumnPropertyName],
                    BulkDatas: {}
                };
                var emptyCounter = 0;

                for (var prop in item) {
                    if (item[prop] === '' && prop != 'R-O-W-I-N-D-E-X') {
                        emptyCounter++;
                    }
                }
                if (columnIdList.length == emptyCounter) {
                    return;
                }

                for (var idx = 0, len = columnIdList.length; idx < len; idx++) {
                    if (item[columnIdList[idx]]) {
                        rowData['BulkDatas'][columnIdList[idx]] = item[columnIdList[idx]];
                    }
                    else {
                        rowData['BulkDatas'][columnIdList[idx]] = '';
                    }
                }

                saveData.DefaultBulkDatas.push(rowData);
            }
        });

        return saveData;
    },

    checkErrorResult: function (data) {
        var grid = this.contents.getGrid("dataGrid").grid;

        $.each(data, function (idx, item) {
            var errors = item['Errors'];

            grid.setCell('checkSuccess', item['Line'], item['TotalError']);

            for (var i = 0, len = errors.length; i < len; i++) {
                grid.setCellShowError(errors[i]['ColCd'], item['Line'], { message: errors[i]['Message'] });
            }
        });

        this.setTimeout(function () {
            this.adjustContentsDimensions();
        }.bind(this), 0);
    }
});