window.__define_resource && __define_resource("LBL04389","BTN00113","LBL01829","LBL00359","LBL00778","LBL00329","BTN00008");
/****************************************************************************************************
1. Create Date : 2018.05.25
2. Creator     : NGUYEN THANH TRUNG
3. Description : BILL SEARCH 
4. Precaution  :
5. History     : 2018.08.16 (Choi Yong-hwan) : 어음번호검색창 변경
6. Old file    : ECMain\CM\EB\EB012P.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EB012P", {

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            MANAGE_NO_TYPE: this.MANAGE_NO_TYPE
            , MANAGE_NO: this.MANAGE_NO
            , PARAM: this.keyword
            , CUST_NAME: this.CUST_NAME
            , BASE_DATE: this.BASE_DATE
            , SORT_COLUMN: ""
            , SORT_TYPE: "A"
        };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL04389);
        header.useQuickSearch();

        var contents = widget.generator.contents(),
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            form = widget.generator.form();

        toolbar
                .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

        //프로젝트코드, 프로젝트명 검색어
        form.add(ctrl.define("widget.input.codeName", "MANAGE_NO", "MANAGE_NO", ecount.resource.LBL01829).end())
            .add(ctrl.define("widget.input.codeName", "CUST_NAME", "CUST_NAME", ecount.resource.LBL00359).end())

        contents.add(form);     //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
                .addContents(contents);

    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            settings = generator.grid()

        settings
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Account/Notes/GetListRcvIssNoteBalanceForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setGridSort.bind(this))
            //.setKeyColumn(['MANAGE_NO', 'CUST_NAME'])
            .setColumns([
                { propertyName: 'MANAGE_NO', id: 'MANAGE_NO', title: this.resource.LBL01829, width: '' },
                { propertyName: 'BALANCE', id: 'BALANCE', title: this.resource.LBL00778, dataType: '9' + 0, width: '', align: 'right' },
                { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: this.resource.LBL00329, width: '' }
            ])
            .setCustomRowCell('MANAGE_NO', this.setGridDateLink.bind(this));


        contents
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
        
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "CUST_NAME",
                    code: "MANAGE_NO",
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

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "CUST_NAME",
                code: "MANAGE_NO",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var formData = this.header.serialize().merge();

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.MANAGE_NO = formData.MANAGE_NO;
        this.searchFormParameter.CUST_NAME = formData.CUST_NAME;

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.toggle(true);
    },

    // Quick search
    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        if (!$.isEmpty(this.searchFormParameter.PARAM)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }

        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);

        this.header.toggle(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //엔터
    ON_KEY_ENTER: function (e, target) {
        this.onContentsSearch(target.control.getValue());
    },

    ON_KEY_F8: function (event) {
        this.onHeaderSearch();
    },

    /********************************************************************** 
    *  User define
    **********************************************************************/
    // 정렬 (Sort)
    setGridSort: function (e, data) {
        this.searchFormParameter.SORTCOL_INDEX = data.columnIndex + 1;
        this.searchFormParameter.SORTCOL_ID = data.columnId;
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});
