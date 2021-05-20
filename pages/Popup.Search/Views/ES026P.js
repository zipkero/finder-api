window.__define_resource && __define_resource("LBL11082","BTN00113","BTN00351","LBL01506","LBL02581","MSG06096","BTN00004","BTN00008","MSG00205");
/****************************************************************************************************
1. Create Date : 2016.01.14
2. Creator     : ShinHeejun
3. Description : Inv/Acct > Setup > Customer > LinkEGCardCom(재고/회계 > 기초등록 > 거래처등록 > 잠재거래처연결)
4. Precaution  : 
5. History     : 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type1", "ES026P", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    gridLoad: new Object(),             //EGCardComInfomation(잠재거래처 정보)

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        //기본검색 Parameter Setting
        this.searchFormParameter = {
            SEARCHTEXT: '',
            //PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' ',
            //PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' ',
            PAGE_SIZE: 100,
            PAGE_CURRENT: 0,
            SORT_COLUMN: '',
            SORT_TYPE: ''
        };

        this._super.init.apply(this, arguments);
        this.initProperties();
    },


    initProperties: function () {
        this.gridLoad = this.viewBag.InitDatas.GridLoad;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //onInitHeader(헤더 옵션 설정)
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL11082).useQuickSearch();

        //if (this.isIncludeInactive) {
        //    //퀵서치 추가
        //    var contents = widget.generator.contents(),
        //    tabContents = widget.generator.tabContents(),
        //    form1 = widget.generator.form(),
        //    form2 = widget.generator.form(),
        //    toolbar = widget.generator.toolbar();
        //    var ctrl = widget.generator.control();

        //    //검색하단 버튼
        //    toolbar
        //        .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

        //    if (this.isIncludeInactive) {
        //        toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        //    }

        //    //아이디, 성명
        //    form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL01506).end())
        //        .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL02581).end())

        //    contents.add(form1);    //검색어
        //    contents.add(toolbar);  //버튼

        //    header.add("search")
        //        .addContents(contents);
        //}
    },

    //onInitContents(본문 옵션 설정)
    onInitContents: function (contents) {
        
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid();

        if ($.isEmpty(this.searchFormParameter.SEARCHTEXT)) {            
            grid.setEmptyGridMessage(ecount.resource.MSG06096)
        }

        grid
            .setRowData(this.gridLoad)
            .setRowDataUrl('/Groupware/CRM/GetListEGCardCom')
            .setRowDataParameter(this.searchFormParameter)
            .setColumns([
                { propertyName: 'COMPANY_DES', id: 'COMPANY_DES', title: ecount.resource.LBL01506, width: '170' },
                { propertyName: 'COM_ADDR', id: 'COM_ADDR', title: ecount.resource.LBL02581, width: '' }
            ])
            .setPagingUse(true)                                                                                         
            .setPagingRowCountPerPage(100, true)                                                                        
            .setPagingUseDefaultPageIndexChanging(true)                                                                 

            .setColumnSortable(true)                                                                                   
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))                                                 
            .setCustomRowCell('COMPANY_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('COM_ADDR', this.setGridDateLink.bind(this))


        //toolbar
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004,
        //        status: null
        //    }));

        contents
            .add(toolbar)
            .addGrid("dataGrid", grid);
    },

    //onInitFooter(풋터 옵션 설정)
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008).css("btn btn-default"));


        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
    },

    onInitControl_Submit: function (cid, control) {
    },

    //onChangeControl(컨트롤 변경시)
    onChangeControl: function (control) {
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //Popup initHandler
    onPopupHandler: function (control, config, handler) {
    },

    //PreOpenPopup
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
    },

    //Popup에서 SendMessage After
    onMessageHandler: function (message) { 
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onLoadComplete: function (e) {        
        if (!e.unfocus)
            this.header.getQuickSearchControl().setFocus(0);

        this.header.getQuickSearchControl().setValue(this.SEARCHTEXT);
        //this.contents.getControl('search').setValue(this.SEARCHTEXT);
    },

    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },

    onChangeContentsTab: function (event) {
    },

    //onHeaderSearch: function (event) {
    //    this.onContentsSearch('button');
    //},

    //onHeaderUsegubun: function (event) {
    //    if (this.searchFormParameter.DEL_FLAG == "Y")
    //        this.searchFormParameter.DEL_FLAG = "N";
    //    else
    //        this.searchFormParameter.DEL_FLAG = "Y";

    //    this.onContentsSearch('button');
    //},
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    // Search button click event
    onContentsSearch: function (e) {        
        var value = this.header.getQuickSearchControl().getValue();
        //var value2 = "";
        //var value3 = "";

        //if (this.isIncludeInactive) {
        //    value2 = this.header.getControl("search1").getValue();
        //    value3 = this.header.getControl("search2").getValue();

        //    //var searchControl = this.contents.getControl('search');

        //    this.searchFormParameter.PARAM2 = value2;
        //    this.searchFormParameter.PARAM3 = value3;
        //}
        var grid = this.contents.getGrid();
        this.searchFormParameter.SEARCHTEXT = value;


        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        //searchControl.setFocus(0);
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //onFooterClose(닫기버튼)
    onFooterClose: function () {
        this.close();
        return false;
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    ON_KEY_F8: function () {
        this.onHeaderSearch();
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        if (target.cid == 'search')
            this.onContentsSearch(e);
    },

    onHeaderQuickSearch: function (event) {        
        this.searchFormParameter.SEARCHTEXT = this.header.getQuickSearchControl().getValue();

        //if (this.isIncludeInactive) {
        //    if (this.header.getControl("search1").getValue() == "")
        //        this.searchFormParameter.PARAM2 = "";

        //    if (this.header.getControl("search2").getValue() == "")
        //        this.searchFormParameter.PARAM3 = "";
        //}

        var grid = this.contents.getGrid();
        grid.settings.setEmptyGridMessage(ecount.resource.MSG00205)
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    /**********************************************************************
	* user function
	=>사용자가 생성한 기능 function 등
	**********************************************************************/

    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = 'widget.link';
        option.event = {
            'click': function (e, data) {
                var message = {
                    data: data.rowItem,
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    }
});