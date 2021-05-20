window.__define_resource && __define_resource("BTN00069","BTN00008","BTN00603","BTN00351");
/****************************************************************************************************
1. Create Date : 2016.08.24
2. Creator     : 백종인
3. Description : 비과세 및 감면소득 코드 검색
4. Precaution  : 
5. History     : 2019.10.17(이현택) - 신규프레임웍 반영 (3.0 api 호출)
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "EP005P", {
    newItem: false,
    isFixedFooter: true,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            YEAR: (!$.isNull(this.JSYY)) ? this.JSYY : this.viewBag.LocalTime.toDatetime().format('yyyy'),
            PARAM: (!$.isNull(this.PARAM)) ? this.PARAM : '',
            TAX_FLAG : 'Y'
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
        header.setTitle("비과세 및 감면소득 코드").useQuickSearch();
                
        //퀵서치 추가
        var contents = widget.generator.contents(),        
        form1 = widget.generator.form(),        
        toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {        
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        var url = '/SVC/TaxCommon/Basic/GetPay001NonTax';
        //if (!$.isNull(this.JSYY))
        //    url = '/Tax' + this.JSYY + '/Basic/GetPay001NonTax';
        //else
        //    url = '/Tax' + this.viewBag.LocalTime.toDatetime().format('yyyy') + '/Basic/GetPay001NonTax';

        settings
            .setRowData(this.viewBag.InitDatas.UserLoad)
            .setRowDataUrl(url)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['EMP_CD', 'EMP_KNAME'])            
            .setColumns([                
                { propertyName: 'NON_TAX_CD', id: 'NON_TAX_CD', title: "비과세코드", width: '150', align: 'center' },
                { propertyName: 'NON_TAX_DES', id: 'NON_TAX_DES', title: "비과세명", width: '' },                
            ])            
            .setCustomRowCell('NON_TAX_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('NON_TAX_DES', this.setGridDateLink.bind(this))
            //.setColumnSortExecuting(this.setColumnSortClick.bind(this))
            //.setCheckBoxUse(true)                        
            .setColumnSortable(true)
            //.setColumnSortExecuting(this.setColumnSortClick.bind(this))
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
        
        //toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
               .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
            
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {        
        if (!$.isNull(this.PARAM)) {
            this.header.getQuickSearchControl().setValue(this.PARAM);
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
                    name: "NON_TAX_DES",
                    code: "NON_TAX_CD",
                    data: data.rowItem,
                    addPosition: "current",
                    isAdded: this.isCheckBoxDisplayFlag,
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
        //var value2 = "";
        //var value3 = "";

        //value2 = this.header.getControl("search1").getValue();
        //value3 = this.header.getControl("search2").getValue();

        if ((!$.isEmpty(value) || !$.isEmpty(value2) || !$.isEmpty(value3)) && data.dataCount === 1) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "NON_TAX_CD",
                code: "NON_TAX_DES",
                data: rowItem,
                addPosition: "next",
                isAdded: this.isCheckBoxDisplayFlag,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    onHeaderSearch: function (event) {
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

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        //var value = this.header.getQuickSearchControl().getValue();
        var value1 = "";
        var value2 = "";
                
        value1 = this.header.getControl("search1").getValue();
        value2 = this.header.getControl("search2").getValue();
                
        this.searchFormParameter.KEYWORD = "";
        this.searchFormParameter.PARAM1 = value1;
        this.searchFormParameter.PARAM2 = value2;
        //this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
            else {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            }
        }
                
        if (this.searchFormParameter.SORT.isNull)
            this.searchFormParameter.SORT = "";
        
        if (this.searchFormParameter.SORT_AD.isNull)
            this.searchFormParameter.SORT_AD = "";

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);        
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {        
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        //if (data.dataCount === 1 && !this.isNewDisplayFlag) {
        if (data.dataCount === 1){ //&& this.searchFormParameter.gridRenderFlag == "Y") {

            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "CODE_DES",
                code: "CODE_NO",
                data: rowItem,
                isAdded: false,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    onMessageHandler: function (event, data) {        
        //this.contents.getGrid().draw(this.searchFormParameter);
        //message.callback && message.callback();  // The popup page is closed   
        //if (event.pageID == "ESA008M") {
        //    this.newItem = true;
        //    this.isOnePopupClose = true;
        //    this.keyword = data.PJT_CD;

        //    //this.contents.getControl("search").setValue(data.PJT_CD);
        //    this.header.getQuickSearchControl().setValue(data.PJT_CD);
        //    this.searchFormParameter.PARAM = data.PJT_CD;
        //    this.contents.getGrid().settings.setPagingCurrentPage(1)
        //    this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        //    this.contents.getGrid().draw(this.searchFormParameter);
        //    //this.contents.getControl("search").setFocus(0);
        //    this.header.getQuickSearchControl().setFocus(0);
        //}
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
            //var gridObj = this.contents.getGrid().grid;
            //gridObj.focus();
            //this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
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
