window.__define_resource && __define_resource("LBL13165","LBL13616","LBL13164","BTN00070","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2017.11.30
2. Creator     : 소병용(So ByeongYong)
3. Description : 상담원 직접지정
4. Precaution  : 
5. History     : 2018.06.08 (Duyet) : Change width for column
6. Old File : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECU005P_02", {
    pageID: null,
    header: null,
    contents: null,
    footer: null,
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    // Merge rows Count
    MeargeSetCount: [],

    // Split rows Count
    SplitSetCount: [],

    // Merge data Array
    MeargeArrayData: [],
    ListData: null,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            SortType:"",
            Sort: "",
            PARAM: this.viewBag.DefaultOption.Param,
            PAGE_SIZE: this.viewBag.DefaultOption.PAGE_SIZE,
            ADMIN_YN: this.viewBag.DefaultOption.ADMIN_YN,
            BRN_CD: this.viewBag.DefaultOption.BRN_CD,
            LAN_TYPE: this.viewBag.DefaultOption.LAN_TYPE
        };

        this.ListData = this.viewBag.InitDatas.counselor;
        this.MeargeSetCount = [],
        this.SplitSetCount = [],
        this.MeargeArrayData = [];
    },

    /**********************************************************************
   * renter
   **********************************************************************/
    render: function () { this._super.render.apply(this); },

    /********************************************************************** 
       * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성)  
    **********************************************************************/
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL13165).notUsedBookmark().useQuickSearch();
        this._super.onInitHeader.apply(this, arguments);
    },

    onInitContents: function (contents, resource) {
        var _self = this;
        var g = widget.generator,
               form = g.form(),
               ctrl = g.control(),
               ctrl2 = g.control(),
               controls = [],
               grid = g.grid();
               thisobj = this;

               this.setRowDataMerge();

               grid.setRowData(this.ListData)
                    .setKeyColumn(["COUNSEL_PART", "ECOUNT_NAME", "ECOUNT_ID"])
                    .setRowDataUrl("/Service/CustomerCenter/GetListCounselor")
                    .setSessionCreateLocationType(ecount.grid.constValue.locationType.GMC)
                    .setRowDataParameter(this.searchFormParameter)
                    .setColumnFixHeader(true)
                    .setColumnSortable(true) // Sort whether from the grid
                    .setColumnSortDisableList(['ECOUNT_NAME', 'COUNSEL_PART'])
                    .setCheckBoxUse(this.isCheckBoxDisplayFlag) //Set whether to use checkboxes
                    .setColumnSortExecuting(this.setColumnSortClick.bind(this))
                    //.setCheckBoxCallback(this.setGridCheckbox.call(this))
                    // Paging
                    .setPagingUse(false)
                    //.setPagingRowCountPerPage(this.viewBag.DefaultOption.PAGE_SIZE, true)
                    //.setPagingUseDefaultPageIndexChanging(true)

                    .setColumns([
                        { propertyName: "COUNSEL_PART", id: "COUNSEL_PART", title: ecount.resource.LBL13616, width: "340" },
                        { propertyName: "ECOUNT_NAME", id: "ECOUNT_NAME", title: ecount.resource.LBL13164, width: "", align: "center" },
                    ])
                    .setCustomRowCell("ECOUNT_NAME", this.setCounselor.bind(this));

        contents.addGrid("dataGrid", grid);
    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        
        if (this.isCheckBoxDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00070));
        } else {
            toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true });
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
        this._super.onInitFooter.apply(this, arguments);
    },

    onInitControl: function (cid, control) { },

    // Event quick search (Tìm kiếm nhanh)
    onHeaderQuickSearch: function (event) {
        debugger;
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    /********************************************************************** 
    * event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
    **********************************************************************/
    onLoadComplete: function (e) {
        if (this.Param) {
            this.header.getQuickSearchControl().setValue(this.Param);
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        this._super.onLoadComplete.apply(this, arguments);
    },

    onChangeControl: function (event, data) { },

    onFocusOutControlHandler: function (control) {
        this._super.onFocusOutControlHandler.apply(this, arguments);
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, param, handler) { },

    onMessageHandler: function (event, data) { },
    
    /********************************************************************** 
   * event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트) 
   **********************************************************************/
    onGridAfterRowDataLoad: function (e, data, grid) {
        var Data = $.isEmpty(data.result) ? data : data.result.Data;
        this.ListData = Data;
        this.setRowDataMerge();
        return this.ListData;
    },

    /********************************************************************** 
   * event  [button, link, FN, optiondoropdown..] 
   **********************************************************************/
    //적용
    onFooterApply: function () {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "ECOUNT_NAME",
            code: "ECOUNT_ID",
            data: selectedItem,
            isAdded: true,
            callback: this.close.bind(this),
        };

        this.sendMessage(this, message);
    },

    //닫기
    onFooterClose: function () {
        this.close();
    },

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.isCheckBoxDisplayFlag)
            this.onFooterApply();
    },

    /********************************************************************** 
   * user function 
   **********************************************************************/
    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    setGridCheckbox: function () {
        return {
            'change': function (e, data) {
                var grid = this.contents.getGrid("dataGrid").grid;
                var isChecked = grid.isChecked(data.rowKey);
                for (var i = 0; i < grid.getRowList().length; i++) {
                    grid.setCell("ECOUNT_NAME", i, isChecked);
                }
            }.bind(this)
        }
    },

    //직접지정
    setCounselor: function (vlaue, rowItem) {
        var _self = this;
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "ECOUNT_NAME",
                    code: "ECOUNT_ID",
                    data: data.rowItem,
                    isAdded: true,
                    callback: this.close.bind(this),
                };

                _self.sendMessage(_self, message);
               
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // Datea Merge (로우 병함)
    setRowDataMerge: function (e, value) {
        this.setMergeParam("COUNSEL_PART");
        var mergeData = {}, r;
        for (i = 0, j = this.SplitSetCount.length; i < j; i++) {
            r = this.MeargeSetCount[i];
            this.ListData[r]['_MERGE_SET'] = [];
            mergeData = {};
            mergeData['_MERGE_USEOWN'] = true;
            mergeData['_STYLE_USEOWN'] = true;
            mergeData['_ROW_TYPE'] = 'TOTAL';
            mergeData['_MERGE_START_INDEX'] = 0;
            mergeData['_ROWSPAN_COUNT'] = this.SplitSetCount[i];
            this.ListData[r]['_MERGE_SET'].push(mergeData);
        }
    },

    // Set Merge Param (병합 관련 변수값 셋팅)
    setMergeParam: function (column) {
        var _self = this;
        var PreName = "", MergeCount = 0, SplitCount = 1;
        var tmpMergeCount = [], tmpSplitCount = [];
        var unitData = [];
        var PreKey = "";

        $.each(this.ListData, function (idx, item) {
            if (idx != 0) {
                if (PreName != item[column] || PreKey != item["COUNSEL_PART"]) {
                    PreName = item[column];
                    PreKey = item["COUNSEL_PART"];
                    MergeCount = MergeCount + SplitCount;
                    tmpMergeCount.push(MergeCount);
                    tmpSplitCount.push(SplitCount);
                    SplitCount = 1;
                    _self.MeargeArrayData.push(unitData);
                    unitData = [];
                    unitData.push(idx);
                } else {
                    SplitCount++;
                    unitData.push(idx);
                }
                if (idx == _self.ListData.length - 1) {
                    tmpSplitCount.push(SplitCount);
                    unitData.push(idx);
                    _self.MeargeArrayData.push(unitData);
                }
            }
            else {
                unitData.push(idx);
                PreName = item[column];
                PreKey = item["COUNSEL_PART"];
                tmpMergeCount.push(MergeCount);
            }
        });

        this.SplitSetCount = tmpSplitCount;
        this.MeargeSetCount = tmpMergeCount;
    }
});