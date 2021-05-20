window.__define_resource && __define_resource("LBL02339","LBL93199","BTN00274","BTN00065","BTN00007","BTN00008","MSG07230","MSG07231","MSG07232","MSG07233","LBL80183","MSG00475");
/****************************************************************************************************
1. Create Date : 2017.09.16
2. Creator     : Nguyen Thanh Trung
3. Description : Web uploader popup 
4. Precaution  :
5. History     : 
6. Old File    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "EZI010M", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    isOpenPopup: true,

    currentTabId: null,

    currentTabIdx: -1,

    columns: [],

    resultData: null,

    saveComplete: true,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
    },

    render: function () {
        this._super.render.apply(this);
    },

    //header 옵션 설정
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL02339).notUsedBookmark();
    },

    //body 옵션 설정
    onInitContents: function (contents) {
        debugger;
        var g = widget.generator
            , grid = g.grid()
            , ctrl = g.control()
            , tabContents = g.tabContents()
            , toolbar = g.toolbar()

        //그리드 설정
        this.getColumns(this.viewBag.columnList);

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
            .setEditClipboardMode(true, 1)
            .setEventClipboardCallback(this.gridClipboardCallback.bind(this))
            .setEventAutoAddRowOnLastRow(true, 2)
            .setStyleDisableTableHover(true)

        tabContents.createTab("recordTimeTab", ecount.resource.LBL93199, null, true, "left");

        //버튼 및 탭 설정
        toolbar
            .setOptions({ ignorePrimaryButton: true, css: 'btn btn-default btn-sm' })
            .addLeft(ctrl.define("widget.button", "excelDownload").label(ecount.resource.BTN00274));

        tabContents.onSingleMode();
        tabContents.add(toolbar);
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
        toolbarList.push(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce().end());
        toolbarList.push(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007).end());
        toolbarList.push(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008).end());

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

        this.contents.getTabContents(this.contents.currentTabId).clearAllInvalidStatus();
        grid.setColumnVisibility('checkSuccess', false);
    },

    onContentsExcelDownload: function () {
        debugger;
        var sendData = {
            FormType: this.viewBag.FormType,
            ManagementType: "UO",
        };

        this.EXPORT_EXCEL({
            url: "/Inventory/Sale/GetListBackUpBySalesForExcel",
            param: sendData
        });
    },

    onFooterSave: function () {
        var data = this.setSaveApiJsonData(),
            _self = this;
        _self.saveComplete = false;

        if (data.DefaultBulkDatas.length > 0) {
            _self.showProgressbar(null, null, 0);
            ecount.common.api({
                url: '/Manage/TimeMgmt/UploadDataForRecordTime',
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
                }
            });
        }
        else {
            //자료 입력 없이 저장을 눌렀을 때
            this.contents.getGrid('dataGrid').grid.activeCellBlur();
            ecount.alert(ecount.resource.MSG00475);
            this.saveComplete = true;
            this.footer.getControl("save").setAllowClick();
        }

    },

    onFooterRewrite: function () {
        var param = {
            width: 1000,
            height: 640,
            ProdGubun: '1',
            isOpenPopup: this.isOpenPopup,
            FormType: this.viewBag.FormType,
        };

        this.onAllSubmitSelf("/ECERP/Popup.Common/EZI010M", param, this.contents.currentTabId);
    },

    onFooterClose: function () {
        this.close();
    },

    onMessageHandler: function (event, data) {
        this.saveComplete = true;
    },

    //X버튼 클릭시
    onClosedPopupHandler: function (control) {
        this.sendMessage(this, message);
    },

    ON_KEY_ESC: function () {
        var grid = this.contents.getGrid('dataGrid').grid,
            columnId = grid.getActiveCellColumnId(),
            rowKey = grid.getActiveCellRowId();

        if ((columnId == '' || columnId == null) && (rowKey == '' || rowKey == null))
            this.close();
    },

    ON_KEY_F8: function () {
        if (this.saveComplete)
            this.onFooterSave();
    },

    getColumns: function (formColumns) {
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

    setSaveApiJsonData: function () {
        var saveData = {
            DefaultBulkDatas: [],
            IsSlipBundling: true,
            PaidleaveList: [],
            attendList: [],
            EmployeeList: [],
            INFLOW: 'B',
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
                        if (columnIdList[idx] == "REST_CD")
                            saveData.PaidleaveList.push(item[columnIdList[idx]]);
                        else if (columnIdList[idx] == "EMP_CD")
                            saveData.EmployeeList.push(item[columnIdList[idx]]);
                        else if (columnIdList[idx] == "ATTEND_CD")
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