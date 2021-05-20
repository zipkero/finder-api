window.__define_resource && __define_resource("LBL02835","LBL12613","LBL12614","BTN00553","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.12.14
2. Creator     : Do Duc Trinh
3. Description : language setting
4. Precaution  :
5. History     :  
6. Old File    :
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EGD002P_03", {

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
            PARAM: (!$.isNull(this.keyword)) ? this.keyword : ' '
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
        header.setTitle(ecount.resource.LBL02835);
    },
    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        // Initialize Grid
        var Columns = [
                { index: 0, propertyName: 'LANGUAGE_CODE', id: 'LANGUAGE_CODE', title: "", width: '', isHideColumn: true },
                { index: 1, propertyName: 'LANGUAGE_NAME', id: 'LANGUAGE_NAME', title: ecount.resource.LBL12613, width: '', controlType: "widget.link" },
                { index: 2, propertyName: 'LANGUAGE_CODE1', id: 'LANGUAGE_CODE1', title: "", width: '', isHideColumn: true },
                { index: 3, propertyName: 'LANGUAGE_NAME1', id: 'LANGUAGE_NAME1', title: ecount.resource.LBL12614, width: '', controlType: "widget.link" }
        ];

        var _dataGrid = this.viewBag.InitDatas.WhLoad;
        grid
            .setRowData(_dataGrid)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['LANGUAGE_CODE', 'LANGUAGE_NAME', 'LANGUAGE_NAME1'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns(Columns)
            // Sorting
            .setColumnSortable(false)
           // .setCheckBoxUse(this.isApplyDisplayFlag)
            //.setCheckBoxMaxCount(100)
            // custom 
            .setCustomRowCell('LANGUAGE_NAME', this.SelectLanguage.bind(this))
            .setCustomRowCell('LANGUAGE_NAME1', this.SelectLanguage.bind(this))
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
           .setEventFocusOnInit(true)
            .setCheckBoxActiveRowStyle(true);

        if (this.isCheckBoxDisplayFlag) {
            grid.setCheckBoxUse(true);
        }

        contents.addGrid("dataGrid" + this.pageID, grid);
    },
   

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();

        if (this.isCheckBoxDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00553));
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        //toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper"));
        footer.add(toolbar);
    },

    /****************************************************************************************************
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
       
    },

    onMessageHandler: function (page, message) {
    },
    /**********************************************************************
    * event grid listener [click, change...]
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    //grid render()
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1 && this.ispopupCloseUse) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "LANGUAGE_NAME",
                code: "LANGUAGE_CODE",
                data: rowItem,
                isAdded: false,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },
   
    /****************************************************************************************************
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    onFooterApply: function () {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "LANGUAGE_CODE",
            code: "LANGUAGE_CODE",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next", //current
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
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
        if (this.isCheckBoxDisplayFlag)
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
    SelectLanguage: function (value, rowItem) {
        var self = this,
           option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                var d = data.rowItem;
                var message = {
                    name: "LANGUAGE_NAME",
                    code: "LANGUAGE_CODE",
                    data: d,
                    isAdded: self.isPerson ? true : self.isCheckBoxDisplayFlag,
                    addPosition: self.isCheckBoxDisplayFlag ? "next" : "current",
                    Receiver_Type: self.Receiver_Type,
                    callback: self.close.bind(self)
                };
                self.sendMessage(self, message);
                
            }.bind(self)
        }

        return option;
    },
    
});