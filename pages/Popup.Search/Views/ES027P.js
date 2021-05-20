window.__define_resource && __define_resource("LBL11300");
/****************************************************************************************************
1. Create Date : 2016.09.09
2. Creator     : 김선웅
3. Description : 재고1> 영업관리 > 판매입력 > 시리얼 검색
4. Precaution  : 
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popupSerial", "ES027P", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this._super.initProperties.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
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
        header.setTitle(ecount.resource.LBL11300).useQuickSearch();
    },

    //onInitContents(본문 옵션 설정)
    onInitContents: function (contents) { 
        this._super.initContents.apply(this, arguments);
    },

    //onInitFooter(풋터 옵션 설정)
    onInitFooter: function (footer) {
        this._super.initFooter.apply(this, arguments);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onLoadComplete: function (e) {
        if (!e.unfocus)
            this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue(this.PARAM);
    },

    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    }
});