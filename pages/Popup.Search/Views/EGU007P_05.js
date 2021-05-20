window.__define_resource && __define_resource("LBL03606","LBL01879","LBL00783","BTN00069","BTN00008","MSG03839","MSG00962","BTN00603","BTN00351");
/****************************************************************************************************
1. Create Date : 2016.07.21
2. Creator     : Nguyen Minh Thien
3. Description : List contact
4. Precaution  : 
5. History     : 2018.02.05(Thien.Nguyen) Remove new button
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "EGU007P_05", {
    newItem: false,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            CHK_FLAG: this.searchCategoryFlag == "L" ? "A" : this.searchCategoryFlag
            , NAME: ''
            , SEARCHTEXT: this.keyword || ''
            , SORT_COLUMN: ''
            , SORT_TYPE: ''
            , PAGE_SIZE: 100
            , PAGE_CURRENT: 1
            , CUST_IDX: this.CUST_IDX
            , SER_NO: 0
            , GUBUN: ''
            , CUST_CD: this.CUST_CD
            , TELL: ''
            , PHONE: ''
            , EMAIL: ''
            , ADD_WHERE: ''
            , COUNT: 0

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
        header.setTitle(ecount.resource.LBL03606).useQuickSearch();
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl('/Groupware/CRM/GetListContactForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['HP_NO', 'UNAME'])
            .setColumns([
                    { propertyName: 'HP_NO', id: 'HP_NO', title: ecount.resource.LBL01879, controlType: 'widget.label', width: '' },
                    { propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL00783, controlType: 'widget.label', width: '' },

            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('HP_NO', this.setGridDateLink.bind(this))
            .setCustomRowCell('UNAME', this.setGridDateLink.bind(this))

            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else
            keyHelper.push(11);
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
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
                    name: "UNAME",
                    code: "HP_NO",
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
    onGridRenderComplete: function (e, data, gridObj) {
        debugger;
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = 1;
        var value = this.keyword;

        if (!$.isEmpty(value))
            this.isOnePopupClose = true;

        if (data.dataCount === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "UNAME",
                code: "HP_NO",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "UNAME",
            code: "HP_NO",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }

            this.isOnePopupClose = true;
        this.searchFormParameter.SEARCHTEXT = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
            else {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            }
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, data) {

    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // KEY_DOWN
    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
    },
    // KEY_UP
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
    },

    // KEY_Mouseup
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.SEARCHTEXT = this.header.getQuickSearchControl().getValue();

        if (this.isIncludeInactive) {
            if (this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.PARAM2 = "";

            if (this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.PARAM3 = "";
        }

            this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
