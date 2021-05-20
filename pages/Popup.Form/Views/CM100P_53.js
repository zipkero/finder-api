window.__define_resource && __define_resource("LBL03552","LBL02119","LBL04835","LBL04107","LBL10747","LBL10192","BTN00069","BTN00008","LBL07243","LBL01743","LBL80195","LBL35589","MSG03976","MSG06077","LBL07443","LBL07377","LBL02056");
/***********************************************************************************
 1. Create Date : 2016.03.03
 2. Creator     : inho
 3. Description : Sort/Subtotal Standard(정렬/소계기준)
 4. Precaution  :
 5. History     : 20170210 (Truong Phuc) Add option disable state for dropdown sort
 6. MenuPath    : Template Setup(양식설정)>Sort/Subtotal Standard(정렬/소계기준)
 7. Old File    : CM100P_06.aspx,CM100P_15.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_53", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    formInfo: null,

    sortCdOption: null,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.registerDependencies("ecount-textEditor", "pluploader");
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
        var thisObj = this;
        var message = {
            type: "getFormInfo",
            callback: function (data) {
                this.formInfo = data;
            }.bind(this)
        };
        this.sendMessage(this, message);
        
        // Danh sách column đang sử dụng sort by
        var sortColumns = [];
        if (!$.isEmpty(thisObj.formInfo.FormOutSet.SORT_CD)) { 
            thisObj.formInfo.FormOutSet.SORT_CD.replace(/ ASC/gi, "").replace(/ DESC/gi, "").split(',').forEach(function (column, i) {
                sortColumns.push(thisObj.formInfo.FormOutSetDetails.select(function (x) { if (x.Key.NUM_SORT == column) return x.COL_CD; }));
            });
        }
        debugger
        // Danh sách column sẽ remove
        var removeColumns = [];
        thisObj.formInfo.FormOutSetDetails.forEach(function (column, i) {
            if (["STOCKS.BAL_QTY"
                , "STOCKS.WH_F_QTY"
                , "STOCKS.WH_T_QTY"
                , "LP.LAST_PRICE"
                , "LP.IO_DATE"
                , "LP.USE_CNT"
                , "#SALE003_SETUP.C0002"
                , "CUST_PASS_PROD_CD.CS_BASE_QTY"
                , "CUST.COM_CODE"
                , "CUST.DETAIL"
                , "BALANCE.BAL_AMT"
                , "CUST.FILE"
                , "CUST.IO_CODE_BY"
                , "CUST.IO_CODE_SL"
            ].contains((column.COL_CD || "").toUpperCase()) && (column.SAVE_SEQ == undefined || !sortColumns.contains(column.COL_CD)))//colu.SAVE_SEQ == undefined -> Column vừa được thêm vào, chưa lưu.
                removeColumns.push(column.COL_CD);
        });

        thisObj.sortCdOption = new Array();
        thisObj.sortCdOption.push(["0", ecount.resource.LBL03552]);
        thisObj.formInfo.ViewModel.columns
            // A19_02321 - 품목팝업 내 사용빈도, 최종거래일, 최종단가 항목 정렬기준설정 값 제거
            // Item List > [Option] > Search Pop-up Template > Page Settings > Setup Sort by
            .filter(function (column, j) {
                if (!["SP900", "SP910"].contains(thisObj.formInfo.ViewModel.formType))
                    return true;
                return !removeColumns.contains(column.id);
            })
            .forEach(function (column, j) {
                //item.cursorIndex = item.idx;
                var columnDto = thisObj.formInfo.FormColumns.find(function (item) { return item.COL_CD.toUpperCase() == column.id.toUpperCase() });
                //로직변경 기존 코드 및 리소스로 체크하던것을 리소스 코드로 체크하게 변경 그외 조건은 기존과 동일하게 - 기획자 채주영확인 2016.05.17
                //개발결정사항:1581 - 생산관련 정렬기준 구분 예외로직 제거
                if (!$.isNull(columnDto)) {
                    if (columnDto.SUB_REX_CD != "LBL02119" && !((columnDto.Key.FORM_TYPE == "SO620" || columnDto.Key.FORM_TYPE == "SO850") && columnDto.COL_CD.toUpperCase() == "STOCKS")) {
                        if (!(columnDto.SUB_REX_CD == "LBL04835" && (columnDto.Key.FORM_TYPE == "AO960" || columnDto.Key.FORM_TYPE == "AO680") && (columnDto.COL_CD.toUpperCase() == "ACC211.EXCLUSIONPERIOD" || columnDto.COL_CD.toUpperCase() == "EXCLUSIONPERIOD"))) {
                            if (columnDto.Key.FORM_TYPE == "AO242" || columnDto.Key.FORM_TYPE == "AO243") {
                                if (column.id == "a.acc_stt" || column.id == "a.pro_stt") {
                                    return true;// break for each
                                }
                            }
                            else if (columnDto.Key.FORM_TYPE == "AO670" || columnDto.Key.FORM_TYPE == "AO245") {
                                if (column.id == "RPS" || column.id == "SBD") {
                                    return true; // break for each
                                }
                            }
                            thisObj.sortCdOption.push([column.id, column.title]);
                        }
                    }
                }
            });
        header.notUsedBookmark();
        if (thisObj.formInfo.FormSet.SORT_VIEW_YN == "Y" && thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "N") {
            header.setTitle(ecount.resource.LBL04107);
        } else {
            header.setTitle(ecount.resource.LBL10747);
        }
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            form = widget.generator.form(),
            grid1 = g.grid(),
            grid2 = g.grid(),
            ctrl = g.control();

        var thisObj = this;

        if (thisObj.formInfo.FormSet.SORT_VIEW_YN == "Y") {
            contents
                .add(widget.generator.subTitle().title(ecount.resource.LBL04107))
                .addGrid("dataGrid1_" + this.pageID, grid1)
        }
        if (thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "Y") {
            contents.add(widget.generator.subTitle().title(ecount.resource.LBL10192))
                .addGrid("dataGrid2_" + this.pageID, grid2);
        }
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        //.setOptions({ignorePrimaryButton : true});
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        //if (cid = 'custom') {
        //    var ctrl = widget.generator.control();
        //    control.inline().addControl(ctrl.define("widget.input", "title", "title", ecount.resource.LBL07243))
        //                    .addControl(ctrl.define("widget.link", "changePlainText").label('>>Plain Text'))
        //                    .addControl(ctrl.define("widget.link", "changeRichFormat").label('>>Rich Format'));
        //}    
    },

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
    },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        switch (page.pageID) {
        }
        message.callback && message.callback();
    },

    onFocusOutHandler: function (event) {
        //move next focus 다음 폼으로 이동
        var forms = this.contents.getForm();
        if (forms.length > 0) {
            if (event.__self == this.contents.getForm()[forms.length - 1]) {
                this.footer.getControl("apply").setFocus(0);
            } else {
                for (var i = 0; i < forms.length; i++) {
                    if (event.__self == this.contents.getForm()[i] && (forms.length - 1) > i) {
                        this.contents.getForm()[i + 1].getControlByIndex(0).setFocus(0);
                        break;
                    }
                }
            }
        }
    },

    onFocusOutControlHandler: function (control) {
    },

    onChangeControl: function (control, data) {
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onInitGridInitalize: function (cid, option) {

        var thisObj = this;
        //SORT_CD,SUBTOT_TYPE
        if (cid == "dataGrid1_" + thisObj.pageID) {
            var rowData = [{ 'ORDER': 1, 'SORTCODE': "", 'SORTTYPE': "ASC" }, { 'ORDER': 2, 'SORTCODE': "", 'SORTTYPE': "ASC" }, { 'ORDER': 3, 'SORTCODE': "", 'SORTTYPE': "ASC" }];
            if (!$.isEmpty(thisObj.formInfo.FormOutSet.SORT_CD)) {
                thisObj.formInfo.FormOutSet.SORT_CD.split(",").forEach(function (item, i) {
                    var aryItem = item.split(" ");
                    if (aryItem.length >= 2) {
                        var result = thisObj.formInfo.FormOutSetDetails.find(function (detail) { return detail.Key.NUM_SORT == aryItem[0]; });
                        var colCd = "0";
                        if (!$.isNull(result))
                            colCd = result.COL_CD;

                        rowData[i] = { 'ORDER': i + 1, 'SORTCODE': colCd, 'SORTTYPE': aryItem[1] || "ASC" };
                    }
                });
            }
            option
                .setEditable(true, 0, 0)
                .setEventWidgetTriggerObj(this.events)
                .setStyleBorderRemoveLeftRight(true)
                .setKeyColumn(['ORDER'])
                .setColumnSortable(false)
                .setColumns([
                            { propertyName: 'ORDER', id: 'ORDER', title: ecount.resource.LBL01743, width: 50, align: 'center' },
                            { propertyName: 'SORTCODE', id: 'SORTCODE', title: ecount.resource.LBL80195, width: "", controlType: 'widget.select' },
                            { propertyName: 'SORTTYPE', id: 'SORTTYPE', title: ecount.resource.LBL35589, width: 160, controlType: 'widget.radio' },
                ])
                .setRowData(rowData)
                .setCustomRowCell('SORTCODE', this.setGridDataCustomSortCode.bind(this))
                .setCustomRowCell("sortType", this.setGridDataCustomSortType.bind(this));


        } else {
            var rowData = [{ 'ORDER': 1, 'SUBTOT': "" }, { 'ORDER': 2, 'SUBTOT': "" }, { 'ORDER': 3, 'SUBTOT': "" }];
            if (!$.isEmpty(thisObj.formInfo.FormOutSet.SUBTOT_TYPE)) {
                thisObj.formInfo.FormOutSet.SUBTOT_TYPE.split(ecount.delimiter).forEach(function (item, i) {
                    rowData[i] = { 'ORDER': i + 1, 'SUBTOT': item };
                });
            }
            option
                .setEditable(true, 0, 0)
                .setEventWidgetTriggerObj(this.events)
                .setStyleBorderRemoveLeftRight(true)
                .setKeyColumn(['ORDER'])
                .setColumnSortable(false)
                .setColumns([
                            { propertyName: 'ORDER', id: 'ORDER', title: ecount.resource.LBL01743, width: 50, align: 'center' },
                            { propertyName: 'SUBTOT', id: 'SUBTOT', title: ecount.resource.LBL80195, width: "", controlType: 'widget.select' },
                ])
        }
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        var thisObj = this;
        this.contents.getGrid("dataGrid1_" + this.pageID).grid.settings().setEventFocusOnInit(true);

        //상단 렌더링된 값을 접근을 해야 해서 여기다 선언
        if (gridObj.id == "dataGrid1_" + this.pageID) {
            var rowData = [{ 'ORDER': 1, 'SUBTOT': "" }, { 'ORDER': 2, 'SUBTOT': "" }, { 'ORDER': 3, 'SUBTOT': "" }];
            if (!$.isEmpty(thisObj.formInfo.FormOutSet.SUBTOT_TYPE)) {
                thisObj.formInfo.FormOutSet.SUBTOT_TYPE.split(ecount.delimiter).forEach(function (item, i) {
                    rowData[i] = { 'ORDER': i + 1, 'SUBTOT': item };
                });
            }
            if (thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "Y") {
                var grid2 = this.contents.getGrid("dataGrid2_" + this.pageID);
                grid2.grid.settings()
                    .setCustomRowCell('SUBTOT', this.setGridDataCustomSubTot.bind(this))
                    .setRowData(rowData);
                grid2.draw();
            }
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //Apply 적용 버튼
    onFooterApply: function () {
        var thisObj = this;
        var sortCd = "";
        var subTot = "";
        //정렬기준및 방법
        if (thisObj.formInfo.FormSet.SORT_VIEW_YN == "Y") {
            var grid = this.contents.getGrid("dataGrid1_" + this.pageID).grid;
            var errflag = 0;
            var selected = grid.getRowList().where(function (x) { return x.SORTCODE != "0"; });
            // 선택된 값이 있을때만 처리
            if (selected.length > 0) {
                sortCd = "";
                //같은 값이 있는지 확인합니다
                grid.getRowList().forEach(function (rowItem, index) {
                    if (rowItem.SORTCODE != "0") {
                        if (selected.where(function (x) { return x.SORTCODE == rowItem.SORTCODE; }).length > 1) {
                            if (errflag == 0) {
                                grid.setCellShowError("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG03976, showDirect: true });
                                grid.setCellFocus("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName]);
                            }
                            else {
                                grid.setCellShowError("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG03976 });
                            }
                            errflag = 1;
                        }
                        var numSort = thisObj.formInfo.FormOutSetDetails.find(function (detail) { return detail.COL_CD.toUpperCase() == rowItem.SORTCODE.toUpperCase(); }).Key.NUM_SORT;
                        sortCd = sortCd + (($.isEmpty(sortCd)) ? "" : ",") + numSort + " " + rowItem.SORTTYPE;
                        //시리얼 체크
                        if (rowItem.SORTCODE.toUpperCase().indexOf("SERIAL") != -1) {
                            if (errflag == 0) {
                                grid.setCellShowError("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG06077, showDirect: true });
                                grid.setCellFocus("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName]);
                            } else {
                                grid.setCellShowError("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG06077 });
                            }
                            errflag = 2;
                        }
                    }
                });
                if (errflag != 0)
                    return false;
            }
        }
        //소계기준및 방법
        if (thisObj.formInfo.FormSet.SORT_VIEW_YN == "Y" && thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "Y") {
            // 선택된 값이 있을때만 처리
            var grid = this.contents.getGrid("dataGrid2_" + this.pageID).grid;
            var errflag = 0;
            var selected = grid.getRowList().where(function (x) { return x.SUBTOT != "0"; });//.sortBy(function (s) { return s.ORDER; });
            // 선택된 값이 있을때만 처리
            if (selected.length > 0) {
                subTot = "";
                //같은 값이 있는지 확인합니다
                grid.getRowList().forEach(function (rowItem, index) {
                    if (rowItem.SUBTOT != "0") {
                        if (selected.where(function (x) { return (x.SUBTOT == rowItem.SUBTOT.split(',')[0] + ",0" || x.SUBTOT == rowItem.SUBTOT.split(',')[0] + ",1"); }).length > 1) {
                            if (errflag == 0) {
                                grid.setCellShowError("SUBTOT", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG03976, showDirect: true });
                                grid.setCellFocus("SUBTOT", rowItem[ecount.grid.constValue.keyColumnPropertyName]);
                            } else {
                                grid.setCellShowError("SUBTOT", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG03976 });
                            }
                            errflag = 1;
                        }
                        subTot = subTot + (($.isEmpty(subTot)) ? "" : ecount.delimiter) + rowItem.SUBTOT;
                    }
                });
                if (errflag != 0)
                    return false;
            }
        } else {
            subTot = thisObj.formInfo.FormOutSet.SUBTOT_TYPE;
        }

        thisObj.formInfo.FormOutSet.SORT_CD = sortCd;
        thisObj.formInfo.FormOutSet.SUBTOT_TYPE = subTot;
        var message = {
            formOutSet: thisObj.formInfo.FormOutSet,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

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

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    setGridDataLink: function (value, rowItem) {
        var thisObj = this;
        var errcnt = 0;
        var option = {};
        option.data = rowItem.TITLE;
        option.controlType = "widget.link";
        return option;
    },

    setGridDataCustomSortCode: function (value, rowItem) {
        var option = {
            controlType: 'widget.select'
        };
        option.optionData = this.sortCdOption;

        if (rowItem.ORDER == 1 && (this.formInfo.ViewModel.formType == "GP040" || this.formInfo.ViewModel.formType == "PP605"))
            option.editableState = 0;

        //if (this.sortCdOption.length >= parseInt(rowItem.sortCode)) {
        //    option.data = this.sortCdOption[rowItem.sortCode][0];
        //}

        option.event = {
            'change': function (e, data) {
                if (this.formInfo.FormSet.SUBTOT_VIEW_YN == "Y") {
                    var grid2 = this.contents.getGrid("dataGrid2_" + this.pageID).grid;
                    grid2.refreshCell("SUBTOT", "1");
                    grid2.refreshCell("SUBTOT", "2");
                    grid2.refreshCell("SUBTOT", "3");
                }
            }.bind(this)
        }
        return option;
    },

    setGridDataCustomSortType: function (value, rowItem) {
        var option = {
            controlType: 'widget.radio.multi'
        };
        //radio label 값 설정
        option.label = [ecount.resource.LBL07443, ecount.resource.LBL07377]
        //radio value 값 설정
        option.value = ['ASC', 'DESC']
        option.data = rowItem.SortType;
        option.event = {
            'change': function (e, data) {
                //grid.refreshCell(data.columnId, self.clickedRowId);


                //var checkFlag = false;
                //var objthis = this;
                //var param = {
                //    KIND: data.rowItem.KIND,
                //    CLASS_GUBUN: this.strGroupCode,
                //    CODE_CLASS: data.rowItem.CODE_CLASS,
                //    PROD_CD: data.rowItem.PROD_CD
                //};
            }.bind(this)
        }
        return option;
    },

    setGridDataCustomSubTot: function (value, rowItem) {
        var option = {
            controlType: 'widget.select'
        };
        var thisObj = this;
        var subTotOption = new Array();
        subTotOption.push(["0", ecount.resource.LBL03552]);
        var grid = this.contents.getGrid("dataGrid1_" + this.pageID).grid;
        var aryDuplicate = new Array();
        for (var i = 1; i <= 3; i++) {
            var val = grid.getCell("SORTCODE", i).toUpperCase();
            if (val != "0") {
                if ($.inArray(val, aryDuplicate) < 0) {
                    var column = thisObj.formInfo.ViewModel.columns.find(function (item) { return item.id.toUpperCase() == val });
                    var text = column.title;
                    if (column.dataType.substring(0, 1) == "0") {
                        subTotOption.push([String.format("{0},0", val), text]);
                    } else if (column.dataType.substring(0, 1) == "1" || column.dataType.substring(0, 1) == "2" || column.dataType.substring(0, 1) == "D") {
                        subTotOption.push([String.format("{0},0", val), text]);
                        subTotOption.push([String.format("{0},1", val), String.format("{0}({1})", text, ecount.resource.LBL02056)]);
                    }
                }
                aryDuplicate.push(val);
            }
        }
        option.optionData = subTotOption;
        option.data = rowItem.SUBTOT.toUpperCase();
        option.event = {
            'change': function (e, data) {

                //var checkFlag = false;
                //var objthis = this;
                //var param = {
                //    KIND: data.rowItem.KIND,
                //    CLASS_GUBUN: this.strGroupCode,
                //    CODE_CLASS: data.rowItem.CODE_CLASS,
                //    PROD_CD: data.rowItem.PROD_CD
                //};
            }.bind(this)
        }
        return option;
    },
});