window.__define_resource && __define_resource("LBL13158","LBL00737","LBL01149","BTN00070","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2017.12.08
2. Creator     : 소병용(So ByeongYong)
3. Description : 문의유형
4. Precaution  : 
5. History     : 2018.02.28 (이현택) : GMC API 호출을 위해 setSessionCreateLocationType 추가
                 2018.06.08 (Duyet) : Change width for column
                 2019.09.25 (황재빈) : IsShowStatesSelectBoxinSearch true일 때 헤더에 서칭보여주기
6. Old File : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECU006P_01", {
    pageID: null,

    header: null,

    contents: null,

    footer: null,
    /********************************************************************** 
* page user opion Variables(사용자변수 및 객체) 
**********************************************************************/
    //PastOnlineInquiryContents: null,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this.initProperties();
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
    },

    /**********************************************************************
   * renter
   **********************************************************************/
    render: function () {
        this._super.render.apply(this);
        this.searchFormParameter = {
            SORT_TYPE: "", SORT_COLUMN: "",
            PARAM: this.viewBag.DefaultOption.Param,
            PAGE_SIZE: this.viewBag.DefaultOption.PAGE_SIZE,
            BRN_CD: this.viewBag.DefaultOption.BRN_CD,
            LAN_TYPE: this.viewBag.DefaultOption.LAN_TYPE
        };


    },

    /********************************************************************** 
       * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성)  
       **********************************************************************/
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL13158).notUsedBookmark().useQuickSearch();

        if (this.IsShowStatesSelectBoxinSearch) {
            var g = widget.generator,
                contents = g.contents(),
                form = g.form(),
                toolbar = g.toolbar(),
                ctrl = g.control();

            var optionList = [];
            optionList.push(["KR", "Korea"]);
            optionList.push(["US", "United States"]);
            optionList.push(["CN", "China"]);
            optionList.push(["MY", "Malaysia"]);
            optionList.push(["VN", "Vietnam"]);
            optionList.push(["ID", "Indonesia"]);
            optionList.push(["TW", "Taiwan"]);
            optionList.push(["TH", "Thailand"]);

            header.setTitle(ecount.resource.LBL13158)
                .add("search", null, false)
                .notUsedBookmark().useQuickSearch();

            toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label("Search(F8)"));

            form.add(ctrl.define("widget.select", "State", "State", "State").option(optionList).end());

            contents.add(form).add(toolbar);
            header.addContents(contents);
        }

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

        grid.setRowData(this.viewBag.InitDatas.counselCategory)
            .setKeyColumn(["CATEGORY", "CATEGORY_DES"])
            .setRowDataUrl("/Service/CustomerCenter/GetListCounselCategory")
            .setSessionCreateLocationType(ecount.grid.constValue.locationType.GMC)
            .setRowDataParameter(this.searchFormParameter)
            .setColumnFixHeader(true)
            .setColumnSortable(true) // Sort whether from the grid
            .setCheckBoxUse(this.isCheckBoxDisplayFlag) //Set whether to use checkboxes

            // Paging
            .setPagingUse(false)
            //.setPagingRowCountPerPage(this.viewBag.DefaultOption.PAGE_SIZE, true)
            //.setPagingUseDefaultPageIndexChanging(true)

            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setColumnSortDisableList(['CATEGORY_DES_RES'])
            .setColumns([
                { propertyName: "CATEGORY", id: "CATEGORY", title: ecount.resource.LBL13158 + ecount.resource.LBL00737, width: "140", align: "center" },
                //{ propertyName: "CATEGORY_DES", id: "CATEGORY_DES", title: ecount.resource.LBL13158 + ecount.resource.LBL01149, width: "" },
                { propertyName: "CATEGORY_DES_RES", id: "CATEGORY_DES_RES", title: ecount.resource.LBL13158 + ecount.resource.LBL01149, width: "" }
            ])
            .setCustomRowCell("CATEGORY", this.setCounselCategory.bind(this));
                   //.setCustomRowCell("CATEGORY_DES_RES", this.setGridCategoryRes.bind(this));

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
        //debugger;
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

    onGridRenderComplete: function (e, data, gridObj) {
        var self = this;
        ecount.page.popup.prototype.onGridRenderComplete.apply(self, arguments);

        if (data.dataCount === 1) {
            var rowItem = data.dataRows[0];
            self.setTimeout(function () {
                var message = {
                    name: "CATEGORY_DES_RES",
                    code: "CATEGORY",
                    data: rowItem,
                    isAdded: true,
                    callback: self.close.bind(self)
                };
                self.sendMessage(self, message);
            }, 10);
        }

    },

    onChangeControl: function (event, data) { },

    onFocusOutControlHandler: function (control) {
        this._super.onFocusOutControlHandler.apply(this, arguments);
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, param, handler) { },

    onMessageHandler: function (event, data) { },

    ////Header Search 검색
    //onHeaderSearch: function (e) {
    //    debugger;
    //    this.header.toggle(true);
    //    this.searchFormParameter.BRN_CD = this.header.getControl("State").getValue();
    //    this.searchFormParameter.PARAM = "";
    //    var grid = this.contents.getGrid();
    //    grid.getSettings().setPagingCurrentPage(1);
    //},

    onHeaderSearch: function (event) {
        debugger;
        this.onContentsSearch('button');
    },

    //검색
    onContentsSearch: function (event) {
        debugger;
        this.searchFormParameter.PARAM = '';
        this.searchFormParameter.BRN_CD = this.header.getControl("State").getValue();
        this.searchFormParameter.PAGE_CURRENT = 1;

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
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
            name: "CATEGORY_DES_RES",
            code: "CATEGORY",
            data: selectedItem,
            isAdded: true,
            callback: this.close.bind(this),
        };

        this.sendMessage(this, message);
    },

    //닫기
    onFooterClose: function () { this.close(); },

    // KEY_F8
    ON_KEY_F8: function () {
        this.onHeaderSearch();
    },

    /********************************************************************** 
   * user function 
   **********************************************************************/
    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //직접지정
    setCounselCategory: function (vlaue, rowItem) {
        var _self = this;
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "CATEGORY_DES_RES",
                    code: "CATEGORY",
                    data: data.rowItem,
                    isAdded: true,
                    callback: this.close.bind(this)
                };
                _self.sendMessage(_self, message);
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    //setGridCategoryRes: function (value, rowItem) {
    //    var option = {};

    //    option.data = !$.isEmpty(ecount.resource[rowItem.CATEGORY_DES]) ? ecount.resource[rowItem.CATEGORY_DES] : rowItem.CATEGORY_DES;
    //    return option;
    //}

});