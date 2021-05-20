window.__define_resource && __define_resource("LBL07741","LBL00381","LBL00359","LBL03017","LBL03004","LBL02736","LBL02722","LBL01381","LBL01377","LBL00752","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.05.15
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department
                 재고1 > 기초등록 > 창고등록 > 계층그룹 > 체크 후, 소속그룹
4. Precaution  :
5. History     : 2016.02.17(Nguyen Anh Tuong) 창고계층그룹 공통화 Location Level Group Standardization
                 2016.03.28 (seongjun-Joe) 소스리팩토링.
6. Old File    : ESA056P_04.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA057P_02", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    searchFormParameter: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        var self = this;

        this._super.init.apply(this, arguments);
        this.initProperties();

    },

    initProperties: function () {
        this.searchFormParameter = {
            CD_LIST: this.PCodes,
            SORT_COLUMN: 'CD_GROUP',
            SORT_TYPE: 'A'
        };
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark().setTitle(ecount.resource.LBL07741);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var grid = widget.generator.grid();

        var url = '', cdGroupResource='', nmGroupResource='' ;
        if (this.LevelGroupType == 'CUST') {
            url = "/Account/Basic/GetLevelGroupByCustList";
            cdGroupResource = ecount.resource.LBL00381;
            nmGroupResource = ecount.resource.LBL00359;
        }
        else if (this.LevelGroupType == 'PROD') {
            url = "/Inventory/Basic/GetLevelGroupByProdList";
            cdGroupResource = ecount.resource.LBL03017;
            nmGroupResource = ecount.resource.LBL03004;
        }
        else if (this.LevelGroupType == 'WH') {
            url = "/Inventory/Basic/GetListLevelGroupByLocationList";
            cdGroupResource = ecount.resource.LBL02736;
            nmGroupResource = ecount.resource.LBL02722;
        }
        else {
            url = "/Account/Basic/GetLevelGroupByDeptList";
            cdGroupResource = ecount.resource.LBL01381;
            nmGroupResource = ecount.resource.LBL01377;
        }

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.gridLoad)
            .setRowDataUrl(url)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CD_GROUP', 'CD_PARENT'])
            .setColumns([
                    { propertyName: 'CD_GROUP', id: 'CD_GROUP', title: cdGroupResource, width: 100 },
                    { propertyName: 'NM_GROUP', id: 'NM_GROUP', title: nmGroupResource, width: 150 },
                    { propertyName: '', id: 'PARENT', title: ecount.resource.LBL00752, width: '' }
            ])
            .setColumnFixHeader(true)

            //Sorting
            .setColumnSortable(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setCustomRowCell('PARENT', this.setParentColumn.bind(this));

        contents.addGrid("dataGrid", grid);
    },
    
    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Close").css("btn btn-default").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },
    
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //Close button click event
    onFooterClose: function () {
        this.close();
        return false;
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    setParentColumn: function (value, rowItem) {
        var option = {};
        if (this.LevelGroupType == 'WH') {
            option.data = '[' + rowItem.CD_PARENT + '] ' + rowItem.NM_GROUP;
        }else
        option.data = '[' + rowItem.CD_PARENT + '] ' + rowItem.NM_PARENT;
        return option;
    }
});