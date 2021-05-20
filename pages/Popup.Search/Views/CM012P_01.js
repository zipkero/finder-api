window.__define_resource && __define_resource("LBL03767","LBL00597","LBL00778","LBL00329","BTN00004","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.01.08
2. Creator     : 강성훈
3. Description : 건별 번호검색
4. Precaution  :
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM012P_01", {

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            GYE_CODE: this.GYE_CODE
            , SUB_CODE: this.keyword
            , CUST: this.CUST
            , TRX_DATE : this.TRX_DATE
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
        header.setTitle(ecount.resource.LBL03767)
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid()

        settings
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Account/Common/GetListInvoiceNoForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['JANECK_CODE2'])
            .setColumns([
                { propertyName: 'JANECK_CODE2', id: 'JANECK_CODE2', title: this.resource.LBL00597, width: '' },
                { propertyName: 'BILL_AMT', id: 'BILL_AMT', title: this.resource.LBL00778, dataType: '9' + 0, width: '', align: 'right' },
                { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: this.resource.LBL00329, width: '' }
            ])
            .setCustomRowCell('JANECK_CODE2', this.setGridDateLink.bind(this));

        //툴바
        toolbar
            .attach(ctrl.define("widget.searchGroup", "search").setOptions({
                label: this.resource.BTN00004,  //검색
            }));

        contents
            .add(toolbar)
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
            this.contents.getControl('search').setValue(this.keyword);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.contents.getControl("search").onFocus(0);
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
                    name: "JANECK_CODE2",
                    code: "JANECK_CODE2",
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
                name: "JANECK_CODE2",
                code: "JANECK_CODE2",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
               // addPosition: "next",
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
        this.searchFormParameter.SUB_CODE = event.keyword;
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //엔터
    ON_KEY_ENTER: function (e, target) {
        this.onContentsSearch(target.control.getValue());
    }
});
