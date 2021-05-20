window.__define_resource && __define_resource("LBL02097","BTN00113","LBL02093","MSG02158","LBL70549","BTN00069","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.10.26
2. Creator     : Yu Seung Jun
3. Description : Search for Bank Code
4. Precaution  : 
5. History     :	2020.09.28 (김동수) : A20_04939 - 급여이체 메뉴에서 출금계좌 입력시 하나은행이 입력되는 건
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM201P", {

    /**************************************************************************************************** 
    * user opion Variables (사용자변수 및 객체) 
    ****************************************************************************************************/


    /**********************************************************************
    * page init 
    **********************************************************************/
    init: function (options) {        
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    // initProperties
    initProperties: function () {                
        this.searchFormParameter = {
            PARAM: this.keyword,
            PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' ',
            PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' ',
            SEARCH_TYPE: this.isSearchType, SORT_COLUMN: 'BANK_CD', SORT_TYPE: 'A'
        };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //Set Header option(헤더 옵션 설정)
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL02097).useQuickSearch();

        //if (this.isIncludeInactive) {
        //퀵서치 추가
        var contents = widget.generator.contents(),
        tabContents = widget.generator.tabContents(),
        form1 = widget.generator.form(),
        form2 = widget.generator.form(),
        toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        //검색하단 버튼
        toolbar.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))


        // 검색어
        if (!this.isBankCodeDisplayFlag) {
            form1.add(ctrl.define("widget.input.search", "search1", "search1", ecount.resource.LBL02097).end());
        }
        form1.add(ctrl.define("widget.input.search", "search2", "search2", ecount.resource.LBL02093).end());


        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}

    },

    //Body options settings(본문 옵션 설정)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            //form = generator.form(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.BankView)
            .setRowDataUrl('/Account/Basic/GetListPayBank')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['BANK_CD'])
            .setColumns([
                { propertyName: 'BANK_CD', id: 'BANK_CD', title: ecount.resource.LBL02097, width: '', align: 'center', isHideColumn: this.isBankCodeDisplayFlag },
                { propertyName: 'BANK_DES', id: 'BANK_DES', title: ecount.resource.LBL02093, width: '', align: 'left' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG02158, e));
            })

            .setCustomRowCell('BANK_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('BANK_DES', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxMaxCount(this.checkMaxCount || 100);

        // Toolbals
        var opts = [];
        opts.push(['kr', ecount.resource.LBL70549]);

        toolbar.attach(ctrl.define("widget.select", "NATION", "NATION")
            .option(opts)
            .end());
        toolbar.wholeRow(true);
        
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
        
    },

    //Set footer options(풋터 옵션 설정)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        
        toolbar
            .addLeft(ctrl.define("widget.button", "close").css("btn btn-default").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    // init grid
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //Checkbox count limit(체크박스 체크갯수 제한)
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },

    //Sort(정렬)
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.searchFormParameter.SEARCH_TYPE = this.isSearchType;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    //Select Open Market Code(오픈마켓코드 선택)
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "BANK_DES",
                    code: "BANK_CD",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    //If one thing is to be automatically entered in the search value
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var value = this.PARAM;
        if (!$.isEmpty(value))
            this.searchFormParameter.gridRenderFlag = "Y";
        if (data.dataCount === 1 && this.searchFormParameter.gridRenderFlag === "Y") {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "BANK_DES",
                code: "BANK_CD",
                data: rowItem,
                //isAdded: false,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    // onHeaderQuickSearch
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        this.searchFormParameter.gridRenderFlag = "Y";

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    //Button click event before calling(버튼 이벤트 클릭전 호출)
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    // Apply button click event
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "BANK_DES",
            code: "BANK_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
        return false;
    },

    // Contents Search
    onContentsSearch: function (event) {

        // Basic data validation
        var invalid = this.header.validate();

        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return false;
        }

        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        //if (this.isIncludeInactive) {
		if (!this.isBankCodeDisplayFlag) {
			value2 = this.header.getControl("search1").getValue();
		}
        value3 = this.header.getControl("search2").getValue();
        //}

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        this.searchFormParameter.gridRenderFlag = "Y";

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("search").setFocus(0);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // ON_KEY_F2
    ON_KEY_F2: function () {
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    // F8
    ON_KEY_F8: function () {
        if (this.header.isVisible())
            this.onContentsSearch('button');
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        //target && this.onContentsSearch(target.control.getValue());
        target && this.onContentsSearch(target.control.getValue());
    },

    // onMouseupHandler
    onMouseupHandler: function () {
    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        var grid = this.contents.getGrid().grid;
        //this.setTimeout(function () { grid.focus(); }, 0);
        grid.focus();
    },   
});
