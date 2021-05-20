window.__define_resource && __define_resource("LBL10579","LBL15147","LBL02001","LBL02581","MSG00089","BTN00008");
/***********************************************************************************
 1. Create Date : 2018.10.02
 2. Creator     : 류상민
 3. Description : self-customizing > form setting > load customer
 4. Precaution  :
 5. History     : 
 6. Old File    : 
 7. New File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM105P", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    editFlag: false,
    titlename: "",

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.searchFormParameter = {
            BUSINESS_NO: this.BUSINESS_NO,
            ADDR_TYPE: this.ADDR_TYPE,
            PARAM: ''
        };
    },

    initProperties: function () {
        this.titlename = ecount.resource.LBL10579;
    },

    render: function () {
        this._super.render.apply(this);

    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark()
            .useQuickSearch() //로딩시 화면에 표시됨
            .setTitle(ecount.resource.LBL15147);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            ctrl = generator.control(),
            grid = generator.grid();

        var columns = [];
        if (this.USE_POST == 'Y') {
            columns.add({ propertyName: 'POST_NO', id: 'POST_NO', title: ecount.resource.LBL02001, width: 150 });
        }
        columns.add({ propertyName: 'ADDR', id: 'ADDR', title: ecount.resource.LBL02581, width: '' });

        grid
            .setRowData(this.viewBag.InitDatas.ListLoad)
            .setRowDataUrl('/Account/Basic/GetListCustDlvfcForSearch') //Common.Infra
            .setRowDataParameter(this.searchFormParameter)
            .setColumns(columns)
            .setColumnFixHeader(true)
            .setEventFocusOnInit(true)
            .setEmptyGridMessage(ecount.resource.MSG00089)
            .setCustomRowCell('ADDR', this.setGridDateLink.bind(this));

        contents
            .addGrid("dataGrid" + this.pageID, grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

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
    
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
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
    
    // quick Search button click event 퀴서치
    onHeaderQuickSearch: function (e, value) {
        var thisObj = this;
        var keyword = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.PARAM = keyword;
        this.setReload(this);
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    //그리드 데이터 클릭시
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var returnData = this.USE_POST == 'Y' ? data.rowItem['POST_NO'] +' ' +data.rowItem['ADDR'] : data.rowItem['ADDR'];
                var message = {
                    name: "ADDR",
                    data: {
                        COL_CD: this.COL_CD,
                        ADDR: returnData
                    },
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        
        return option;
    },
    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});
