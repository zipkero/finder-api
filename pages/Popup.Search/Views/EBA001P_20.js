window.__define_resource && __define_resource("LBL00703","BTN00069","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.10.19
2. Creator     : Unknown
3. Description : (세금)계산서구분
4. Precaution  : 
5. History     : 2019.06.25(taind) A19_01497 - 소스코드진단결과 반영 - Master
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EBA001P_20", {
    gridObject: null,
    inPartList: null,
    //data: [],
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            CLASS_CD: this.CLASS_CD,
            PARAM: this.PARAM,
            Title: this.Title
        };

        this.inPartList = {};

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

        header.setTitle(this.Title).useQuickSearch();

    },


    //본문 옵션 설정
    onInitContents: function (contents) {
        
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        grid
             .setRowData(this.viewBag.InitDatas.CmcdList)
             .setRowDataUrl("/Account/Basic/GetCmcdSearchList")
             .setRowDataParameter(this.searchFormParameter)
             .setCheckBoxUse(true)
             .setCustomRowCell('ITEM2', this.setGridDateLink.bind(this))
             .setColumns([{ propertyName: 'ITEM2', id: 'ITEM2', title: ecount.resource.LBL00703, width: '' },
             ]);

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);

    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
               .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },


    /*************************************  *********************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        if (this.keyword) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

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


    onGridAfterRowDataLoad: function (e, data) {
        this._super.onGridAfterRowDataLoad.apply(this, arguments);

    },

    onGridRenderBefore: function (gridId, settings) {
        this._super.onGridRenderBefore.apply(this, arguments);
        debugger;
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data) {
        
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);


        if (data.totalDataCount == 1 && !this.isDeprecatedOnePopupClose) {
            var obj = {};
            var d = data.dataRows[0];

            var message = {
                name: "ITEM2",
                code: "ITEM1",
                data: d,
                isAdded: true,
                addPosition: "next",
                callTypeData: this.callTypeData,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        gridObject = this.contents.getGrid().grid;

    },

    //구분 선택
    setGridDateLink: function (value, rowItem) {

        var option = {};
        var self = this;
        
        option.controlType = "widget.link";
        option.treeAttrs = {
            'class': ['text-uline-no', 'text-default']
        }
        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var message = {
                    name: "ITEM2",
                    code: "ITEM1",
                    data: data.rowItem,
                    addPosition: "current",
                    callTypeData: this.callTypeData,
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "ITEM2",
            code: "ITEM1",
            data: selectedItem,
            isAdded: true,
            addPosition: "next",
            callTypeData: this.callTypeData,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색
    onContentsSearch: function (event) {
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            if (!e.unfocus)
                this.header.getQuickSearchControl().setFocus(0);

            return;
        }

        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue().keyword || '';
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.toggle(true);
    },



    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // KEY_F8
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target))
            this.onContentsSearch(target.control.getValue());
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();

        grid.draw(this.searchFormParameter);
    },
});