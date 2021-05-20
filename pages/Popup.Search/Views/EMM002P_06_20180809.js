window.__define_resource && __define_resource("LBL11984","LBL04714","BTN00043","BTN00069","BTN00008","BTN00351","BTN00603","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.12.14
2. Creator     : Do Duc Trinh
3. Description : User Customization > User Setup > Register User
4. Precaution  :
5. History     :
6. Old File    : EMM002P_06.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EMM002P_06", {

    /****************************************************************************************************
    * page user opion Variables(User variables and Object)
    ****************************************************************************************************/

    userPermit: null,


    /****************************************************************************************************
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },
    // initProperties
    initProperties: function () {
        this.searchFormParameter = {
            PARAM: (!$.isNull(this.keyword)) ? this.keyword : ' ',
            isGroupAutho: this.isGroupAutho ? this.isGroupAutho : false
        };
    },
    //render
    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var contents = widget.generator.contents(),
          form1 = widget.generator.form(),
          toolbar = widget.generator.toolbar(),
          ctrl = widget.generator.control();
        // Define header
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL11984).useQuickSearch();
    },
    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        // Initialize Grid
        var Columns = [
                { index: 0, propertyName: 'VALUECOPY', id: 'VALUECOPY', title: "", width: '', isHideColumn: true },
                { index: 1, propertyName: 'NAMECOPY', id: 'NAMECOPY', title: ecount.resource.LBL04714, width: '' }
        ];

        var _dataGrid = this.viewBag.InitDatas.WhLoad;
        grid
            .setRowData(_dataGrid)
            .setRowDataUrl("/SelfCustomize/Config/GetCopyDetail")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['VALUECOPY', 'NAMECOPY'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns(Columns)
            // Sorting
            .setColumnSortable(false)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isApplyDisplayFlag)
            .setCheckBoxMaxCount(100)

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
           .setEventFocusOnInit(true)
            .setCheckBoxActiveRowStyle(true);

        contents.addGrid("dataGrid" + this.pageID, grid);
    },
    //header quick search
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        if (!$.isEmpty(this.searchFormParameter.PARAM)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();
        if (this.isNewDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(ecount.resource.BTN00043));
        }

        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069));
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper"));
        footer.add(toolbar);
    },

    /****************************************************************************************************
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword))
            this.header.getQuickSearchControl().setValue(this.keyword);

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    onMessageHandler: function (page, message) {
    },
    /**********************************************************************
    * event grid listener [click, change...]
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    // Event header search (Sự kiện nút tìm kiếm đầu trang)
    onHeaderSearch: function (event) {
        this.ispopupCloseUse = true;
    },

    // Event handle button [Inactive]
    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y") {
            // Change button to Include
            this.searchFormParameter.DEL_FLAG = "N";
            this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        }
        else {
            // Change button to Exclude
            this.searchFormParameter.DEL_FLAG = "Y";
            this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        }
    },

    // Search button click event
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        if (!this.searchFormParameter.DEL_FLAG)
            this.searchFormParameter.DEL_FLAG = this.DEL_FLAG;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //grid row의 특정 date관련
    setGridLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        if ((!this.editFlag && rowItem['CANCEL'] == 'N') || (this.isIncludeInactive)) {
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    if (this.isOldFramework) {
                        opener.fnSetGropuNo(data.rowItem["VALUECOPY"], data.rowItem["NAMECOPY"], this.CODE_CLASS);
                        this.close();
                    } else {
                        var message = {
                            name: "NAMECOPY",
                            code: "VALUECOPY",
                            data: data.rowItem,
                            isAdded: this.isApplyDisplayFlag,
                            addPosition: "current",
                            callback: this.close.bind(this)
                        };
                        this.sendMessage(this, message);
                    }
                }.bind(this)
            };
        }
        return option;
    },

    //grid render()
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1 && this.ispopupCloseUse) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "NAMECOPY",
                code: "VALUECOPY",
                data: rowItem,
                isAdded: false,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },
    onContentsSearch: function (event) {
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            if (!e.unfocus) {
                this.header.getQuickSearchControl().setFocus(0);
            }
            return;
        }
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue().keyword || '';
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.toggle(true);
    },
    /****************************************************************************************************
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    //Event footer apply
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "NAMECOPY",
            code: "VALUECOPY",
            data: selectedItem,
            isAdded: this.isApplyDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);

    },
    /****************************************************************************************************
    *  define hotkey event listener
    ****************************************************************************************************/

    // F2
    ON_KEY_F2: function () {
        this.onFooterNew();
    },

    // F8
    ON_KEY_F8: function () {
        this.ispopupCloseUse = true;
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // Enter
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },
    //down
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },
    //key up
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },
    //hand mouse
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },
    // Tab
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        setTimeout(function () { gridObj.focus(); }, 0);
    },
    /****************************************************************************************************
    * define user function
    ****************************************************************************************************/

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
        return false;
    },

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});