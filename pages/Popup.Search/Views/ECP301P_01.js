window.__define_resource && __define_resource("LBL03614","LBL07955","LBL04509","LBL02490","BTN00069","BTN00008");
/****************************************************************************************************
1. Create Date : 2017.03.27
2. Creator     : 정나리(Jung Na-Ri)
3. Description : 회계 & 전표 목록 The slip type list of account & inventory
4. Precaution  : 
5. History     :         
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECP301P_01", {

    //search parameter
    finalSearchParam: null,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.finalSearchParam = {};
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.useQuickSearch()
              .notUsedBookmark()
              .setTitle(ecount.resource.LBL03614)
        ;
    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid(),
            columns = [
                { propertyName: "TOP_GROUP_NM", id: "TOP_GROUP_NM", title: ecount.resource.LBL07955, width: "80" },     //회계/재고 구분 대분류. Acct/Inv seperation, TOP Category
                { propertyName: "SLIP_GROUP_CHK", id: "SLIP_GROUP_CHK", controlType: 'widget.checkbox', width: "30", align: "center" },    //전표그룹 체크박스 the group of each slip type, Category
                { propertyName: "SLIP_GROUP_NM", id: "SLIP_GROUP_NM", title: ecount.resource.LBL04509, width: "100" },  //전표그룹 분류 the group of each slip type, Category
                { propertyName: "SLIP_CHK", id: "SLIP_CHK", controlType: 'widget.checkbox', width: "30", align: "center" },    //전표그룹 분류 the group of each slip type, Category
                { propertyName: "SLIP_NM", id: "SLIP_NM", title: ecount.resource.LBL02490, width: "200" },  //전표이름 the name of slip type
            ];

        grid.setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Common/Infra/GetListSlipType")
            .setRowDataParameter(this.finalSearchParam)
            .setKeyColumn(["SLIP_CD"])
            .setColumns(columns)

            .setCheckBoxUse(true)
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)

            .setCheckBoxHeaderCallback({
                "change": function (e, data) {
                    this.contents.getGrid().grid.checkAllCustom("SLIP_GROUP_CHK", data.target.checked);
                }.bind(this)
            })
            .setCheckBoxCallback({
                "change": this.setChangeFirstColCheckBoxEvt.bind(this)
            })
            .setCustomRowCell("SLIP_GROUP_CHK", this.setGridDataSlipGroupCheck.bind(this))
        ;
        //setting up row span data
        this.setGridMergeInfo(this.viewBag.InitDatas.LoadData, "TOP_GROUP", 0);
        this.setGridMergeInfo(this.viewBag.InitDatas.LoadData, "SLIP_GROUP", 2);

        contents
            .add(toolbar)
            .addGrid("dataGrid-" + this.pageID, grid);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control()
        ;

        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
               .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        footer.add(toolbar);

    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
 
    //Apply button action 적용버튼
    onFooterApply: function (e) {
        var returnData = [];

        this.contents.getGrid().grid.getRowList().forEach(function (data, idx) {
            if (data["SLIP_CHK"]) {
                returnData.push(data);
            }
        });

        this.sendMessage(this, {
            code: "SLIP_CD",
            name: "SLIP_NM",
            data: returnData,
            isAdded: true,
            addPosition: "next",
            callback: this.close.bind(this)
        });
    },

    //Close button action 닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //When grid is re-draw.
    onGridAfterRowDataLoad: function (e, data) {
        this._super.onGridAfterRowDataLoad.apply(this, arguments);

        //setting up row span data
        this.setGridMergeInfo(data.result.Data, "TOP_GROUP", 0);
        this.setGridMergeInfo(data.result.Data, "SLIP_GROUP", 2);

    },

    //When the result row is only one
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.totalDataCount == 1) {
            this.sendMessage(this, {
                code: "SLIP_CD",
                name: "SLIP_NM",
                data: data.dataRows[0],
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this)
            });
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    onChangeControl: function (control, data, command) {
    },

    // KEY_F8
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target)) this.onHeaderQuickSearch();
    },

    onHeaderQuickSearch: function (event) {
        this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().draw(this.finalSearchParam);
    },

    /********************************************************************** 
    * user defined function 
    **********************************************************************/
    //Apply row span to the grid data
    setGridMergeInfo: function (data, groupKey, colIdx) {
        var group = "",
            groupList = groupKey.ecCamelize();

        data.forEach(function (row, idx) {
            if (group == row[groupKey + "_SEQ"]) return;

            //assign new groupKey value
            group = row[groupKey + "_SEQ"];

            //create rowset to row
            if (!row["_MERGE_SET"] || !$.isArray(row["_MERGE_SET"])) {
                row["_MERGE_SET"] = [];
            }

            //inserting rowset data
            row["_MERGE_SET"].push(
                { "_MERGE_USEOWN": true, "_MERGE_START_INDEX": colIdx, "_ROWSPAN_COUNT": row[groupKey + "_CNT"], "_IS_CENTER_ALIGN": true }, //Check box
                { "_MERGE_USEOWN": true, "_MERGE_START_INDEX": colIdx + 1, "_ROWSPAN_COUNT": row[groupKey + "_CNT"] }   //contents
            );

        }, this);

    },

    //first col check box check event
    setChangeFirstColCheckBoxEvt: function (e, data) {
        var checkedTopGroupKey = data.rowItem["TOP_GROUP_SEQ"],
            chekedGroupKey = "";

        //3번째 컬럼은 rowSpan되어 있기때문에 각 그룹의 첫번째 row외에는 셀의 attribute가 없는 상태이므로,
        //각 그룹의 첫번째 로우에만 setCell을 수행하도록 한다.
        //the third column is applied rowspan so it doesn't have cell attribute, except the first row of the group
        //so this code do setCell to the only first row of each group.
        this.setCheckToCheckbox(function (row, idx) {
            var rowTopCategoryKey = row["TOP_GROUP_SEQ"],
                rowSlipGroupKey = row["SLIP_GROUP_SEQ"];

            if (checkedTopGroupKey != rowTopCategoryKey) return false;     //if its group key is not same as checked row's group key
            if (chekedGroupKey === rowSlipGroupKey) return false;       //if it is not the first row of the group

            //keep it to setCell to only first row of the group.
            chekedGroupKey = rowSlipGroupKey;

            return true;
        }, "SLIP_GROUP_CHK", e.target.checked);
    },

    //thrid col check box check event
    setGridDataSlipGroupCheck: function (value, rowItem) {
        var option = {};

        option.event = {
            "change": function (e, data) {
                var checkedGroupKey = data.rowItem["SLIP_GROUP_SEQ"];

                this.setCheckToCheckbox(function (row, idx) {
                    if (checkedGroupKey == row["SLIP_GROUP_SEQ"]) return true;
                    return false;
                }, "SLIP_CHK", data.newValue);
            }.bind(this),
        };

        return option;
    },

    //Grid Checkbox Check
    setCheckToCheckbox: function (predicate, checkCol, checked) {
        var grid = this.contents.getGrid().grid,
            rowList = grid.getRowList(),
            rowKey;

        grid.setCellTransaction().start();
        rowList.forEach(function (row, idx) {
            if (predicate(row, idx)) {
                rowKey = grid.getRowKeyByIndex(idx);
                grid.setCell(checkCol, rowKey, checked);
            }
        });
        grid.setCellTransaction().end();
    },
}); 