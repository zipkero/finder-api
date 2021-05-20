window.__define_resource && __define_resource("LBL08849","LBL06702","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.09.28
2. Creator     : NGUYEN CHI HIEU
3. Description : ESO001M, Inv. II > Order Management > Order Management List	
4. Precaution  :
5. History     : 
6. Old file:
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESO001P_05", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    userPermit: '',                 // Page permission    
    selectHearderControl: '',
    isShowSearchBtn: true,
    isShowOptionBtn: true,
    finalHeaderSearch: null,
    stepFilter: null,

    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: '', // Value of quick searach          
            STEPDETAIL: this.STEPDETAIL,
            TYPE_SEARCH : "P"
        };

        this.userPermit = this.viewBag.Permission.Permit.Value;        
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
            .setTitle(ecount.resource.LBL08849)
            .useQuickSearch(true)
    },
    // Contents Initialization
    onInitContents: function (contents, resource) {        
        var self = this;
        var g = widget.generator;
        var toolbar = g.toolbar();
        var grid = g.grid();
        
        // Initialize Grid
        grid
            .setRowData(this.STEPDETAIL)
            .setRowDataUrl('/Inventory/OrderMgmt/GetListStetOrderProcStepForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["STET_ID"])
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'STET_ID', id: 'STET_ID', title: ecount.resource.LBL06702, width: '' }
            ])

            // Sorting
            .setColumnSortable(false)
            .setCustomRowCell('STET_ID', this.setGridStetIdLink.bind(this))

            
        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        // Begin inital toolbar
        toolbar
            .setOptions({ ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008)); // Close button

        footer.add(toolbar);
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // After the document is loaded
    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this, arguments);
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
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
        if (page.pageID == 'ESA063P_01') {
            this.setReload();
        }
        message.callback && message.callback();  // The popup page is closed   
    },
    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        debugger;
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();

        grid.draw(this.searchFormParameter);
    },



    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    onGridInit: function (e, data) {
        ecount.page.popup.prototype.onGridInit.apply(this, arguments);
    },

    // After grid rendered
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        debugger;
        if (data.dataCount === 1) {            
            var message = {
                name: "STET_ID",
                code: "PROC_STEP",
                data: data.dataRows[0],
                addPosition: "current",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        }
    },
    

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/


    // Close button clicked event
    onFooterClose: function () {
        this.close();
    },
    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/
    // F2
    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },
    // F8
    ON_KEY_F8: function (e, target) {
        this.onFooterSave('');
    },
    // ENTER
    //ON_KEY_ENTER: function (e, target) {
    //    target && this.onContentsSearch(target.control.getValue());
    //},
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // Set setDEFAULT_YN
    setGridStetIdLink: function (value, rowItem) {
        var option = {};
        option.data = value;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {                
                var message = {
                    name: "STET_ID",
                    code: "PROC_STEP",
                    data: data.rowItem,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);

            }.bind(this)

        };

        return option;
    },
 
    // Reload grid
    setReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },
    resetParam: function () {
        this.searchFormParameter.PARAM = '';
        this.header.getQuickSearchControl().setValue(this.searchFormParameter.PARAM);
        this.searchFormParameter.PAGE_SIZE = 100;
        this.searchFormParameter.PAGE_CURRENT = 1;
        this.contents.getGrid().getSettings().setPagingCurrentPage(1);
    },

});
