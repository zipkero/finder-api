window.__define_resource && __define_resource("LBL13143","BTN00113","BTN00351","LBL13115","LBL13116","BTN00008","BTN00603");
/****************************************************************************************************
1. Create Date : 2017.12.11
2. Creator     : 김대호
3. Description : 추가항목유형 코드검색 팝업
4. Precaution  : 
5. History     :
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EBA070P_08", { 
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
        this.searchFormParameter = {
            MENU_TYPE: this.viewBag.DefaultOption.MenuType,    //todo : 파라미터 처리 (this.viewBag.DefaultOption.MenuType)
            PARAM1: this.viewBag.DefaultOption.Keyword,
            PARAM2: "",
            PARAM3: "",
            USE_YN: 'Y'
        };
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL13143).useQuickSearch().notUsedBookmark();
        
        //var contents = widget.generator.contents(),
        //    form = widget.generator.form(),
        //    toolbar = widget.generator.toolbar(),
        //    ctrl = widget.generator.control();

        //toolbar.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))
        //       .addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));
                
        //form.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL13115).end())
        //    .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL13116).end());

        //contents.add(form);
        //contents.add(toolbar);

        //header.add("search").addContents(contents);
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            ctrl = generator.control(),
            grid = generator.grid();
        
        grid
            .setRowDataUrl("/Account/Basic/GetListForSearchCmcdItemTypePopup")
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setColumnPropertyColumnName('id')
            .setColumns([
                { propertyName: 'ITEM_TYPE_CD', id: 'ITEM_TYPE_CD', title: ecount.resource.LBL13115, width: '' },
                { propertyName: 'ITEM_TYPE_NM', id: 'ITEM_TYPE_NM', title: ecount.resource.LBL13116, width: '' },
            ])

            .setCustomRowCell('ITEM_TYPE_CD', this.setGridLink.bind(this))
            .setCustomRowCell('ITEM_TYPE_NM', this.setGridLink.bind(this))
            .setEventFocusOnInit(true)
            .setCheckBoxUse(false)
            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.USE_YN == "N")
                    return true;
                else
                    return false;
            }, 'danger');

        contents.addGrid("dataGrid", grid);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();        
        
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper"));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this, arguments);
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (!$.isEmpty(this.keyword)) {
            this.activeHeader.getQuickSearchControl().setValue(this.keyword);
        }

        var value = this.keyword;
        
        if (!$.isEmpty(value))
            this.isOnePopupClose = true;

        if (data.dataCount === 1 && this.isOnePopupClose === true) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "ITEM_TYPE_NM",
                code: "ITEM_TYPE_CD",
                data: rowItem,
                addPosition: "next",
                callback: this.close.bind(this)
            }

            this.sendMessage(this, message);
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    
    setGridLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = null;

                message = {
                    name: "ITEM_TYPE_NM",
                    code: "ITEM_TYPE_CD",
                    data: data.rowItem,
                    isAdded: true,
                    addPosition: "next",
                    callback: this.close.bind(this)
                };

                this.sendMessage(this, message);
            }.bind(this)
        };

        return option;
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    
    ON_KEY_ENTER: function (e, target) {
        target && this.onHeaderSearch(target.control.getValue());
    },

    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },
    
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    },

    ON_KEY_F8: function () {
        this.onHeaderSearch('button');
    },

    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM1 = this.header.getQuickSearchControl().getValue();
        this.isOnePopupClose = true;
        this.contents.getGrid().draw(this.searchFormParameter);
    }

    //onHeaderSearch: function (event) {
    //    this.searchFormParameter.PARAM1 = "";
    //    this.searchFormParameter.PARAM2 = this.header.getControl("search1").getValue();
    //    this.searchFormParameter.PARAM3 = this.header.getControl("search2").getValue();
    //    this.contents.getGrid().draw(this.searchFormParameter);

    //    if (this.searchFormParameter.USE_YN == "") {
    //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
    //    }
    //    else {
    //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
    //    }

    //    this.header.getQuickSearchControl().setFocus(0);
    //    this.header.getQuickSearchControl().setValue("");
    //    this.header.toggle(true);
    //},

    //onHeaderUsegubun: function (event) {
    //    if (this.searchFormParameter.USE_YN == "Y")
    //        this.searchFormParameter.USE_YN = "";
    //    else
    //        this.searchFormParameter.USE_YN = "Y";

    //    this.onHeaderSearch('button');
    //}
});