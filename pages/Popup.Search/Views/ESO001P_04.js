window.__define_resource && __define_resource("LBL08722","BTN00069","BTN00008","MSG00962","LBL08721","LBL08731","LBL03088");
/****************************************************************************************************
1. Create Date : 2015.09.28
2. Creator     : NGUYEN CHI HIEU
3. Description : ESO001M, Inv. II > Order Management > Order Management List	
4. Precaution  : None
5. History     : 2018.08.15 (VuThien): add PROC_STEP
6. Old file: None
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESO001P_04", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/    

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            VIEW_TYPE: this.VIEW_TYPE,
            PROC_NO: this.PROC_NO,
            PARAM: '', // Value of quick searach            
        };
    },
    render: function () {
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting    
    ****************************************************************************************************/
    // Header Initialization
    onInitHeader: function (header) {
        var contents = widget.generator.contents();
        header.notUsedBookmark();

        header
            .setTitle(ecount.resource.LBL08722)
            .useQuickSearch(true)
    },
    // Contents Initialization
    onInitContents: function (contents, resource) {
        var self = this;
        var g = widget.generator;
        var toolbar = g.toolbar();
        var grid = g.grid();

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Inventory/OrderMgmt/GetListStetOrderProcMenuName")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn([this.getCodeViewColumn()])
            .setColumnFixHeader(true)
            .setCheckBoxUse(this.isApplyDisplayFlag)
            .setColumns(this.getColumns())

            // Sorting
            .setColumnSortable(false)
            .setCustomRowCell(this.getCodeViewColumn(), this.setGridMenuNameLink.bind(this))
            .setCustomRowCell(this.getNameColumn(), this.setGridMenuNameLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else
            keyHelper.push(11);

        // Begin inital toolbar
        toolbar
            .setOptions({ ignorePrimaryButton: !this.isApplyDisplayFlag })
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))// Close button
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // After the document is loaded
    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this, arguments);
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },


    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        message.callback && message.callback();  // The popup page is closed   
    },
    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    onGridInit: function (e, data) {
        ecount.page.popup.prototype.onGridInit.apply(this, arguments);
    },

    // After grid rendered
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1)
            this.sendMessageToOwner(data.dataRows[0]);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        this.sendMessageToOwner(selectedItem);
    },

    // Close button clicked event
    onFooterClose: function () {
        this.close();
    },
    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/
    // KEY_F8
    ON_KEY_F8: function () {
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // Set setGridMenuNameLink
    setGridMenuNameLink: function (value, rowItem) {
        var option = {};
        option.data = value;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                this.sendMessageToOwner(data.rowItem);
            }.bind(this)
        };

        return option;
    },

    getColumns: function () {
        if (this.VIEW_TYPE == "1") {
            /*
            { propertyName: 'PROC_STEP_NM', id: 'PROC_STEP_NM', title: ecount.resource.LBL08721, width: '' },
            { propertyName: 'PROC_MENU_NM', id: 'PROC_MENU_NM', title: ecount.resource.LBL08731, width: '' }
            */
            return [
                { propertyName: 'PROC_STEP_NM', id: 'PROC_STEP_NM', title: ecount.resource.LBL08721, width: '' }
            ];
        }
        
        return [
                 { propertyName: 'MENU_SEQ', id: 'MENU_SEQ', title: ecount.resource.LBL03088, width: '' },
                 { propertyName: 'MENU_NM', id: 'MENU_NM', title: ecount.resource.LBL03088, width: '' }
        ];
    },

    getCodeViewColumn: function () {
        if (this.VIEW_TYPE == "1")
            return "PROC_STEP_NM";
        return "MENU_SEQ";
    },

    getCodeColumn: function(){
        if (this.VIEW_TYPE == "1")
            return "PROC_STEP";
        return "MENU_SEQ";
    },

    getNameColumn: function () {
        if (this.VIEW_TYPE == "1")
            return "PROC_STEP_NM";
        return "MENU_NM";
    },

    sendMessageToOwner: function (passData) {
        var message = {
            name: this.getNameColumn(),
            code: this.getCodeColumn(),
            data: passData,
            addPosition: this.isApplyDisplayFlag ? "next" : "current",
            isAdded: this.isApplyDisplayFlag,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    }

});
