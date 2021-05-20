window.__define_resource && __define_resource("LBL03552","LBL02119","LBL10748","LBL04107","LBL10747","LBL11931","LBL03576","LBL10560","LBL03577","LBL03261","LBL03262","LBL03263","LBL03264","LBL04412","LBL00862","LBL03067","LBL00829","LBL04395","LBL04396","LBL10956","BTN00069","BTN00008","LBL01743","LBL07487","LBL00090","LBL11930","MSG03976","MSG06077","LBL07443","LBL07377","LBL03630","LBL35101","LBL02042","LBL03755","LBL30178","MSG01140");
/***********************************************************************************
 1. Create Date : 2016.11.24
 2. Creator     : inho
 3. Description : Sort/Subtotal Standard(정렬/소계기준)
 4. Precaution  :
 5. History     : 2018.12.10 (이일용) : GO040 예외처리
 6. MenuPath    : Template Setup(양식설정)>Sort/Subtotal Standard(정렬/소계기준)
 7. Old File    : CM100P_06.aspx,CM100P_15.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.input", "CM100P_53_CM3", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    formInfo: null,

    sortCdOption: null,

    firstTitleCd: null,


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


        thisObj.sortCdOption = new Array();
        thisObj.sortCdOption.push(["0", ecount.resource.LBL03552, "0"]);        // [A17_02333 bsy] 정렬위해 arry 추가 

        thisObj.formInfo.ViewModel.columns.forEach(function (column, j) {
            //item.cursorIndex = item.idx;
            var columnDto = thisObj.formInfo.FormColumns.find(function (item) { return item.COL_CD.toUpperCase() == column.id.toUpperCase() });
            
            //로직변경 기존 코드 및 리소스로 체크하던것을 리소스 코드로 체크하게 변경 그외 조건은 기존과 동일하게 - 기획자 채주영확인 2016.05.17
            //개발결정사항:1581 - 생산관련 정렬기준 구분 예외로직 제거
            if (!$.isNull(columnDto)) {
                if (columnDto.SUB_REX_CD != "LBL02119"
                    && !((columnDto.Key.FORM_TYPE == "SO620" || columnDto.Key.FORM_TYPE == "SO850") && columnDto.COL_CD.toUpperCase() == "STOCKS")
                    && !((columnDto.Key.FORM_TYPE == "AO555") && columnDto.COL_CD.toUpperCase() == "SLIP_DETAIL.BILLING_CYCLE")
                    && !((columnDto.Key.FORM_TYPE == "AO330") && columnDto.COL_CD.toUpperCase() == "CUST_TONGJANG_ALL.CUST_DES")
                    && !((columnDto.Key.FORM_TYPE == "AO900" || columnDto.Key.FORM_TYPE == "AO910"
                        || columnDto.Key.FORM_TYPE == "AO523" || columnDto.Key.FORM_TYPE == "AO524")
                        && columnDto.COL_CD.toUpperCase() == "TOTAL")
                    && !((columnDto.Key.FORM_TYPE == "AO900" || columnDto.Key.FORM_TYPE == "AO910"
                        || columnDto.Key.FORM_TYPE == "AO523" || columnDto.Key.FORM_TYPE == "AO524"
                        || columnDto.Key.FORM_TYPE == "AO490" || columnDto.Key.FORM_TYPE == "AO491")
                        && columnDto.COL_CD.toUpperCase() == "AMOUNT")
                    //&& !(columnDto.Key.FORM_TYPE == "AO242" && columnDto.COL_CD.toUpperCase() == "A.DIFF_AMT")
                    && !(columnDto.Key.FORM_TYPE == "GO040")
                    || (columnDto.Key.FORM_TYPE == "GO040" && (columnDto.COL_CD.toUpperCase() == "EG020.YYMMDD" || columnDto.COL_CD.toUpperCase() == "PASSWORD.UNAME"))
                    )
                {
                    var tempIndex = column.index;
                    
                    
                    // [A17_02333 bsy] 정렬
                    if (!$.isEmpty(columnDto.CODE_COL_CD) && column.isHideColumn == true) {
                        var coupleColumn = thisObj.formInfo.FormColumns.find(function (item) { return item.CODE_COL_CD == columnDto.CODE_COL_CD && item.COL_CD.toUpperCase() != column.id.toUpperCase() });

                        if (coupleColumn) {
                            var tempSortColumn = thisObj.formInfo.ViewModel.columns.find(function (item) { return item.id.toUpperCase() == coupleColumn.COL_CD.toUpperCase() });
                            if (tempSortColumn) {
                                tempIndex = tempSortColumn.index;
                            }
                        }
                    }
                    var numSort = "A" + tempIndex.toString().padLeft(3, "0") + ($.isEmpty(columnDto.CODE_COL_CD) ? "" : columnDto.CODE_COL_CD);

                    if (!(columnDto.Key.FORM_TYPE == "AO990" && columnDto.COL_CD == "ACC100.EXPENSES_TYPE")) {
                        thisObj.sortCdOption.push([column.id, column.title, numSort]);
                    }
                }
            }
        });

        // [A17_02333 bsy] 정렬
        thisObj.sortCdOption = thisObj.sortCdOption.sortBy(2);

        header.notUsedBookmark();
        //타이틀 설정에 따라 달라지게 기획요청 - 설기수 2016.11.29
        if (thisObj.formInfo.FormSet.SORT_VIEW_YN != "Y" && thisObj.formInfo.FormSet.SUBTOT_VIEW_YN != "Y"
            && thisObj.formInfo.FormSet.IS_SUBTOTAL_TITLE_SETTABLE == true && thisObj.formInfo.FormSet.SUM_SET_USE_YN != "Y")
            header.setTitle(ecount.resource.LBL10748);//합계/소계표시명 Total/Subtotal Display Name 
        else if (thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "N")
            header.setTitle(ecount.resource.LBL04107);//정렬기준 Sort by
        else
            header.setTitle(ecount.resource.LBL10747);//정렬/소계기준 Sort/Subtotal Standard 
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            form = widget.generator.form(),
            form2 = widget.generator.form(),
            grid1 = g.grid(),
            grid2 = g.grid(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        var thisObj = this;
        if (thisObj.formInfo.FormSet.SORT_VIEW_YN == "Y") {
            contents
                .add(widget.generator.subTitle().title((thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "N") ? ecount.resource.LBL04107 : ecount.resource.LBL10747))
                .addGrid("dataGrid1_" + this.pageID, grid1)
        }
        if (thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "Y" && thisObj.formInfo.FormSet.SUM_SET_USE_YN != "Y") {
            contents.add(widget.generator.subTitle().title(ecount.resource.LBL11931));
            form.add(ctrl.define("widget.radio", "subTotAlignType", "SUBTOT_ALIGN_TYPE", ecount.resource.LBL11931).label([
                        ecount.resource.LBL03576 //왼쪽  
                        , ecount.resource.LBL10560  //가운데
                       , ecount.resource.LBL03577 //오른쪽
            ]).value(["1", "0", "2"]).select(thisObj.formInfo.FormOutSet.SUBTOT_ALIGN_TYPE || "0").end());

            contents.add(form);
        }

        if (!thisObj.isLock) {
            if (thisObj.formInfo.FormSet.IS_SUBTOTAL_TITLE_SETTABLE && thisObj.formInfo.FormSet.SUM_SET_USE_YN != "Y") {
                contents.add(widget.generator.subTitle().title(ecount.resource.LBL10748));
                //개발결정사항 1581  재무상태표, 원가명세서 케이스일때 프로그램에서 예외 케이스로 구현한다. 해당양식 개발시 구현 TO-DO
                if (["AO270", "AO271"].contains(thisObj.FORM_TYPE)) {
                    thisObj.setFormOutSetReportTitle({ form: form2, ctrl: ctrl, ary: [["11", ecount.resource.LBL03261], ["12", ecount.resource.LBL03262], ["13", ecount.resource.LBL03263], ["14", ecount.resource.LBL03264]] });
                } else if (thisObj.FORM_TYPE.substring(0, 4) == "AO29") {
                    thisObj.setFormOutSetReportTitle({ form: form2, ctrl: ctrl, ary: [["21", ecount.resource.LBL04412], ["22", ecount.resource.LBL00862], ["23", ecount.resource.LBL03067], ["24", ecount.resource.LBL00829], ["25", ecount.resource.LBL04395], ["26", ecount.resource.LBL04396]] });
                } else {
                    thisObj.setFormOutSetReportTitle({ form: form2, ctrl: ctrl, ary: [["30", ecount.resource.LBL10956], ["31", ecount.resource.LBL03067]] });
                }
                contents.add(form2);
            }
        }

    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
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
        if (!e.unfocus) {

        }
    },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        switch (page.pageID) {
        }
        message.callback && message.callback();
    },

    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },

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
        debugger;
        var thisObj = this;
        var subTotMap = new $.HashMap();
        if (!$.isEmpty(thisObj.formInfo.FormOutSet.SUBTOT_DISPLAY_TYPE)) {
            thisObj.formInfo.FormOutSet.SUBTOT_DISPLAY_TYPE.split(ecount.delimiter).forEach(function (item, i) {
                var aryItem = item.split(",");
                if (aryItem.length > 0 && !$.isEmpty(aryItem[0])) {
                    subTotMap.set(aryItem[0], { SUBTOT: aryItem[1], DISPLAY_PARENT_SUBTOT: aryItem[2] });
                }
            });
        }
        var rowData = new Array();
        for (var i = 1; i <= 5; i++) {
            rowData.push({ 'ORDER': i, 'SORTCODE': "", 'SORTTYPE': "ASC", 'SUBTOT': "", 'DISPLAY_PARENT_SUBTOT': "0" });
        }
        if (!$.isEmpty(thisObj.formInfo.FormOutSet.SORT_CD)) {
            thisObj.formInfo.FormOutSet.SORT_CD.split(",").forEach(function (item, i) {
                var aryItem = item.split(" ");
                if (aryItem.length >= 2) {
                    var result = thisObj.formInfo.FormOutSetDetails.find(function (detail) { return detail.Key.NUM_SORT == aryItem[0]; });
                    var colCd = "0";
                    if (!$.isNull(result))
                        colCd = result.COL_CD;

                    if (subTotMap.has(aryItem[0])) {
                        rowData[i] = { 'ORDER': i + 1, 'SORTCODE': colCd, 'SORTTYPE': aryItem[1] || "ASC", 'SUBTOT': subTotMap.get(aryItem[0]).SUBTOT, 'DISPLAY_PARENT_SUBTOT': subTotMap.get(aryItem[0]).DISPLAY_PARENT_SUBTOT };
                    } else {
                        rowData[i] = { 'ORDER': i + 1, 'SORTCODE': colCd, 'SORTTYPE': aryItem[1] || "ASC", 'SUBTOT': "", 'DISPLAY_PARENT_SUBTOT': "0" };
                    }
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
                        { propertyName: 'SORTCODE', id: 'SORTCODE', title: ecount.resource.LBL10747, width: "", controlType: 'widget.select' },
                        { propertyName: 'SORTTYPE', id: 'SORTTYPE', title: ecount.resource.LBL07487, width: 160, controlType: 'widget.radio' },
                        { propertyName: 'SUBTOT', id: 'SUBTOT', title: ecount.resource.LBL00090, width: 120, controlType: 'widget.select', isHideColumn: ((thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "Y") ? false : true) },
                        { propertyName: 'DISPLAY_PARENT_SUBTOT', id: 'DISPLAY_PARENT_SUBTOT', title: ecount.resource.LBL11930, width: 160, controlType: 'widget.radio', isHideColumn: ((thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "Y") ? false : true) },
            ])
            .setRowData(rowData)
            .setCustomRowCell('SORTCODE', this.setGridDataCustomSortCode.bind(this))
            .setCustomRowCell("SORTTYPE", this.setGridDataCustomSortType.bind(this))
            .setCustomRowCell("SUBTOT", this.setGridDataCustomSubTot.bind(this))
            .setCustomRowCell("DISPLAY_PARENT_SUBTOT", this.setGridDataCustomDisplayParentSubTot.bind(this));
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var thisObj = this;
        this.contents.getGrid("dataGrid1_" + this.pageID).grid.settings().setEventFocusOnInit(true);
        gridObj.grid.getRowList().forEach(function (rowItem, index) {
            thisObj.setControlDefaultValue(gridObj.grid, rowItem);
        });
        if (!e.unfocus) {
            gridObj.grid.setCellFocus("SORTCODE", 1);
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
        var subTotDisplayType = "";
        //var subTot = "";
        //정렬기준및 방법
        if (thisObj.formInfo.FormSet.SORT_VIEW_YN == "Y") {
            var grid = this.contents.getGrid("dataGrid1_" + this.pageID).grid;
            var errflag = 0;
            var selected = grid.getRowList().where(function (x) { return x.SORTCODE != "0"; });
            // 선택된 값이 있을때만 처리
            if (selected.length > 0) {
                sortCd = "";
                subTotDisplayType = "";
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
                        if (thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "Y" && !$.isEmpty(rowItem.SUBTOT))
                            subTotDisplayType = subTotDisplayType + (($.isEmpty(subTotDisplayType)) ? "" : ecount.delimiter) + numSort + "," + rowItem.SUBTOT + "," + rowItem.DISPLAY_PARENT_SUBTOT;
                        debugger
                        //시리얼 체크
                        if (!["SO721", "SO722", "SO723", "SO811"].contains(thisObj.FORM_TYPE) && rowItem.SORTCODE.toUpperCase() == "SALE011.SERIAL_IDX") {
                            if (errflag == 0) {
                                grid.setCellShowError("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG06077, showDirect: true });
                                grid.setCellFocus("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName]);
                            } else {
                                grid.setCellShowError("SORTCODE", rowItem[ecount.grid.constValue.keyColumnPropertyName], { placement: 'top', message: ecount.resource.MSG06077 });
                            }
                            errflag = 2;
                        }

                        if (rowItem.SORTCODE.toUpperCase() == "SALE011.SERIAL" || rowItem.SORTCODE.toUpperCase() == "C.SERIAL") {
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
        //합계/소계 표시명
        if (!thisObj.isLock) {
            if (thisObj.formInfo.FormSet.IS_SUBTOTAL_TITLE_SETTABLE && thisObj.formInfo.FormSet.SUM_SET_USE_YN != "Y") {
                var errcnt = thisObj.contents.validate().merge().length;
                if (errcnt == 0) {
                    thisObj.formInfo.FormOutSetReportTitle.forEach(function (item) {
                        if (thisObj.contents.getControl("titleCd" + item.Key.TITLE_CD) != null)
                            item.TITLE_NM = thisObj.contents.getControl("titleCd" + item.Key.TITLE_CD).getValue();
                    });
                } else {
                    return false;
                }
            }
        }
        thisObj.formInfo.FormOutSet.SORT_CD = sortCd;
        thisObj.formInfo.FormOutSet.SUBTOT_TYPE = "";//subTot
        thisObj.formInfo.FormOutSet.SUBTOT_DISPLAY_TYPE = subTotDisplayType;
        if (!$.isNull(thisObj.contents.getControl("subTotAlignType"))) {
            thisObj.formInfo.FormOutSet.SUBTOT_ALIGN_TYPE = thisObj.contents.getControl("subTotAlignType").getValue();
        }
        var message = {
            formOutSet: thisObj.formInfo.FormOutSet,
            formOutSetReportTitle: thisObj.formInfo.FormOutSetReportTitle,
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
        debugger;
        var option = {
            controlType: 'widget.select'
        };
        option.optionData = this.sortCdOption;
        option.event = {
            'change': function (e, data) {
                if (this.formInfo.FormSet.SUBTOT_VIEW_YN == "Y") {
                    var grid1 = this.contents.getGrid("dataGrid1_" + this.pageID).grid;
                    grid1.refreshCell("SUBTOT", data.rowKey);
                    //refreshCell로 변경된 rowItem 넘기기
                    this.setControlDefaultValue(grid1, grid1.getRowItem(data.rowKey));
                }
            }.bind(this),
            'setNextFocus': function (e, data) {
                if (data['isLastCell'] === true) {
                    // 엔터키를 눌렀을 때, 맨 마지막 셀에서 더이상 다음으로 이동할 셀을 찾지 못한 경우 data['isLastCell'] 에 true 의 값이 넘어옵니다.
                    this.setGridtoFormFocus();
                }
            }.bind(this)
        }
        return option;
    },


    //그리드 기본값 셋팅
    setControlDefaultValue: function (grid, rowItem) {
        if (!$.isEmpty(rowItem.SORTCODE) && rowItem.SORTCODE != "0") {
            grid.setEditable(true, 'SORTTYPE', rowItem.ORDER);
            grid.setEditable(true, 'SUBTOT', rowItem.ORDER);
            if (!$.isEmpty(rowItem.SUBTOT) && rowItem.ORDER != "1")
                grid.setEditable(true, 'DISPLAY_PARENT_SUBTOT', rowItem.ORDER);
            else
                grid.setEditable(false, 'DISPLAY_PARENT_SUBTOT', rowItem.ORDER);

        } else {
            grid.setEditable(false, 'SORTTYPE', rowItem.ORDER);
            grid.setEditable(false, 'SUBTOT', rowItem.ORDER);
            grid.setEditable(false, 'DISPLAY_PARENT_SUBTOT', rowItem.ORDER);
        }
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
            }.bind(this),
            'setNextFocus': function (e, data) {
                if (data['isLastCell'] === true) {
                    // 엔터키를 눌렀을 때, 맨 마지막 셀에서 더이상 다음으로 이동할 셀을 찾지 못한 경우 data['isLastCell'] 에 true 의 값이 넘어옵니다.
                    this.setGridtoFormFocus();
                }
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
        subTotOption.push(["", ecount.resource.LBL03552]);
        var grid = this.contents.getGrid("dataGrid1_" + this.pageID).grid;
        var val = grid.getCell("SORTCODE", rowItem.ORDER).toUpperCase();
        if (val != "0") {
            var column = thisObj.formInfo.ViewModel.columns.find(function (item) { return item.id.toUpperCase() == val });
            var text = column.title;
            if (column.dataType) {
                if (column.dataType.substring(0, 1) == "0") {
                    subTotOption.push(["0", ecount.resource.LBL03630]);
                } else if (column.dataType.substring(0, 1) == "1" || column.dataType.substring(0, 1) == "2" || column.dataType.substring(0, 1) == "D") {
                    subTotOption.push(["0", String.format("{0}({1})", ecount.resource.LBL03630, ecount.resource.LBL35101)]);
                    subTotOption.push(["1", String.format("{0}({1})", ecount.resource.LBL03630, ecount.resource.LBL02042)]);
                }
            }
        }
        option.optionData = subTotOption;
        option.data = rowItem.SUBTOT.toUpperCase();
        option.event = {
            'change': function (e, data) {
                var grid1 = this.contents.getGrid("dataGrid1_" + this.pageID).grid;
                this.setControlDefaultValue(grid1, data.rowItem);
            }.bind(this),
            'setNextFocus': function (e, data) {
                if (data['isLastCell'] === true) {
                    // 엔터키를 눌렀을 때, 맨 마지막 셀에서 더이상 다음으로 이동할 셀을 찾지 못한 경우 data['isLastCell'] 에 true 의 값이 넘어옵니다.
                    this.setGridtoFormFocus();
                }
            }.bind(this)
        }
        return option;
    },

    setGridDataCustomDisplayParentSubTot: function (value, rowItem) {
        var option = {
            controlType: 'widget.radio.multi'
        };
        //radio label 값 설정
        option.label = [ecount.resource.LBL03755, ecount.resource.LBL30178]
        //radio value 값 설정
        option.value = ['1', '0']
        option.data = rowItem.SortType;
        option.event = {
            'change': function (e, data) {
            }.bind(this),
            'setNextFocus': function (e, data) {
                if (data['isLastCell'] === true) {
                    // 엔터키를 눌렀을 때, 맨 마지막 셀에서 더이상 다음으로 이동할 셀을 찾지 못한 경우 data['isLastCell'] 에 true 의 값이 넘어옵니다.
                    this.setGridtoFormFocus();
                }
            }.bind(this)
        }
        return option;
    },

    setFormOutSetReportTitle: function (param) {
        var thisObj = this;
        //디비에 값이 없을때 처리
        if ($.isNull(thisObj.formInfo.FormOutSetReportTitle)) {
            thisObj.formInfo.FormOutSetReportTitle = new Array();
        }

        if (thisObj.formInfo.FormOutSetReportTitle.length == 0) {
            param.ary.forEach(function (item) {
                thisObj.formInfo.FormOutSetReportTitle.push({ Key: { FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: thisObj.FORM_SEQ, TITLE_CD: item[0] }, TITLE_NM: "" });
            });
        } else {
            param.ary.forEach(function (item) {
                if ($.isNull(thisObj.formInfo.FormOutSetReportTitle.find(function (row) { return row.Key.TITLE_CD == item[0] })))
                    thisObj.formInfo.FormOutSetReportTitle.push({ Key: { FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: thisObj.FORM_SEQ, TITLE_CD: item[0] }, TITLE_NM: "" });
            });
        }
        param.ary.forEach(function (item) {
            if ($.isEmpty(thisObj.firstTitleCd))
                thisObj.firstTitleCd = "titleCd" + item[0];

            param.form.add(param.ctrl.define("widget.input.general", "titleCd" + item[0], "titleCd" + item[0], item[1])
                    .filter("maxlength", { message: String.format(ecount.resource.MSG01140, "100"), max: 100 })
                    .value(thisObj.formInfo.FormOutSetReportTitle.find(function (row) { return row.Key.TITLE_CD == item[0] }).TITLE_NM).end());

        });
    },

    setGridtoFormFocus: function () {
        var thisObj = this;
        if (!$.isNull(thisObj.contents.getControl("subTotAlignType"))) {
            thisObj.contents.getControl("subTotAlignType").setFocus(0);
        } else if (!$.isEmpty(thisObj.firstTitleCd)) {
            thisObj.contents.getControl(thisObj.firstTitleCd).setFocus(0);
        } else {
            thisObj.footer.getControl("apply").setFocus(0);
        }
    }

});