window.__define_resource && __define_resource("LBL09119","LBL03088","LBL01818","LBL02079","BTN00008","LBL09137","LBL09138");
/****************************************************************************************************
1. Create Date : 2016.05.20
2. Creator     : 노지혜
3. Description : 양식>양식 검색 팝업  (Search Form  )
4. Precaution  : 
5. History     : 
6. MenuPath    : 양식 > 샘플보기,양식공유 > 신규등록> 양식검색팝업  (Template > Templates ,  Share Template > New > Search Template)
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES033P", {
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            PARAM: this.keyword
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
        header.setTitle(ecount.resource.LBL09119).useQuickSearch();
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.SearchFormLoad)
            .setRowDataUrl('/Common/Form/GetListCofmFormSearchTxt')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['FORM_SEQ', 'FORM_TYPE', 'LOCATION'])
            .setColumns([
                { propertyName: 'FORMTYPE_NM', id: 'FORMTYPE_NM', title: ecount.resource.LBL03088, width: '' }, //메뉴
                { propertyName: 'TITLE_NM', id: 'TITLE_NM', title: ecount.resource.LBL01818, width: '' },  //양식명
                { propertyName: 'LOCATION', id: 'LOCATION', title: ecount.resource.LBL02079, width: '' }  //위치
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setPagingUse(true)
            .setPagingRowCountPerPage(14, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('FORMTYPE_NM', this.setGridDateLink.bind(this))
            .setCustomRowCell('TITLE_NM', this.setGridDateLink.bind(this))
            .setCustomRowCell('LOCATION', this.setGridDatalocationStatus.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        contents
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
              
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
                    name: "FORMTYPE_NM",
                    code: "FORMTYPE_TYPE",
                    data: data.rowItem,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    //위치
    setGridDatalocationStatus: function (value, rowItem) {
        var location = "";
        if (value == "TOP")
            location = ecount.resource.LBL09137;
        else if (value == "BOTTOM")
            location = ecount.resource.LBL09138;

        var option = {};
        option.data = location;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "FORMTYPE_NM",
                    code: "FORMTYPE_TYPE",
                    data: data.rowItem,
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
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var value = this.header.getQuickSearchControl().getValue();

        if (!$.isEmpty(value)  && data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "FORMTYPE_NM",
                code: "FORMTYPE_TYPE",
                data: rowItem,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
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
    },

    onMessageHandler: function (event, data) {

    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // KEY_F8
    ON_KEY_F8: function () {
       this.onFooterApply();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
