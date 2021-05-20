window.__define_resource && __define_resource("LBL06734","LBL00843","LBL02009","LBL06735","BTN00069","BTN00008","LBL02780","LBL01585","LBL02787","LBL00178","LBL06750","MSG00962");
/****************************************************************************************************
1. Create Date : 2018.04.26
2. Creator     : Nguyen Van Lap
3. Description : Inv.II > Costing > Standard Cost Status > Period (Search Form)
4. Precaution  : 
5. History     : [2018.04.26] (Lap) - Create New
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESS016P_03", {

    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = { PARAM: this.keyword };
    },

    onInitHeader: function (header, resource) {        
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL06734).useQuickSearch();
    },

    onInitContents: function (contents, resource) {        
        var toolbar = widget.generator.toolbar(),
            settings = widget.generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Inventory/Basic/GetListForSearchPeriod")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["YYMM"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), "danger")
            .setColumns([
                { propertyName: "YYMM", id: "period", title: ecount.resource.LBL00843, width: "", align: "center" },
                { propertyName: "WON_GUBUN", id: "method", title: ecount.resource.LBL02009, width: "", align: "center" },
                { propertyName: "SOMO_GUBUN", id: "standard", title: ecount.resource.LBL06735, width: "", align: "center" }
            ])
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell("period", this.setGridDataPeriod.bind(this))
            .setCustomRowCell("method", this.setGridDataMethod.bind(this))
            .setCustomRowCell("standard", this.setGridDataStandard.bind(this));

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onLoadComplete: function (e) {        
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    setGridDataPeriod: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                this.sendMessageEx(data.rowItem);
            }.bind(this)
        };
        return option;
   },

    setGridDataMethod: function (value, rowItem) {
        var option = {}, str = "";
        switch (value) {
            case "1":
                str = ecount.resource.LBL02780;
                break;
            case "2":
                str = ecount.resource.LBL01585;
                break;
            case "3":
                str = ecount.resource.LBL02787;
                break;
        }
        option.data = str;
        return option;
    },

    setGridDataStandard: function (value, rowItem) {
        var option = {}, str = "";
        switch (value) {
            case "1":
                str = ecount.resource.LBL00178;
                break;
            case "2":
                str = ecount.resource.LBL06750;
                break;
        }
        option.data = str;
        return option;
    },
   
    setRowBackgroundColor: function (data) {
        if (data["DEL_GUBUN"] == "Y")
            return true;        
    },
 
    onGridRenderComplete: function (e, data, gridObj) {        
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1 && this.contents.getGrid().settings.getPagingCurrentPage() === 1) {
            this.sendMessageEx(data.dataRows[0]);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        this.sendMessageEx(selectedItem);
    },

    onFooterClose: function () {
        this.close();
    },

    ON_KEY_F8: function () {
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    sendMessageEx: function (data) {
        var message = {
            name: "YYMM",
            code: "YYMM_ORG",
            data: data,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    }
});
