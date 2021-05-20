window.__define_resource && __define_resource("LBL08741","BTN00113","BTN00007","LBL09151","BTN00069","BTN00043","BTN00008","BTN00351","MSG00962");
/****************************************************************************************************
1. Create Date : 2018.07.20
2. Creator     : Le Dang Hoang Linh
3. Description : 
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMM009P_05", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    apiUrl: '/Groupware/EApproval/GetListMappingInfo',
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
        this.searchFormParameter = {
            PARAM: ''
        };
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            contents = g.contents(),
            form = g.form(),
            res = ecount.resource;

        //Header search content
        form
            .add(ctrl.define('widget.input.search', 'NAME', 'NAME', res.LBL08741, null).value('').end()) //Group code
        ;
        toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(res.BTN00113))
            //.addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007))
        ;

        contents
            .add(form)
            .add(toolbar);
        /***************************************************************************************/


        header
            .notUsedBookmark()
            .setTitle(ecount.resource.LBL09151)
            .add('search', null, false) //중요 null, false 확인
            .addContents(contents)
            .useQuickSearch();
        
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            data = this.viewBag.InitDatas.ListLoad;

        
        this.columns = [
                { propertyName: 'NAME', id: 'NAME', title: ecount.resource.LBL08741, width: '', controlType: 'widget.input', editableState: 1 },
        ];
        //  data
        settings
            .setRowDataUrl(this.apiUrl)
            .setRowData(this.viewBag.InitDatas.ListLoad)
            .setColumnPropertyColumnName('id')
            .setColumns(this.columns)
            .setCustomRowCell('CODE', this.setGridDateLink.bind(this))
            .setCustomRowCell('NAME', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)
            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            //.setStyleRowBackgroundColor(function (rowItem) {
            //    if (rowItem.USE_YN == "N")
            //        return true;
            //    else
            //        return false;
            //}, 'danger')
            .setCheckBoxActiveRowStyle(true);

        if (this.isCheckBoxDisplayFlag) {
            settings.setCheckBoxUse(true);
        }

        contents
            .add(toolbar)
            .addGrid("dataGrid", settings);
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();

        ctrl = widget.generator.control();
        if (this.isCheckBoxDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069));
        }
        if (this.isNewDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(this.resource.BTN00043));
        }
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
        if (!$.isNull(this.PARAM)) {
            this.header.getQuickSearchControl().setValue(this.PARAM);
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1 && !this.isNewDisplayFlag) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = null;
            message = {
                name: "NAME",
                code: "CODE",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next", //current
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
    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = null;
                message = {
                    name: "NAME",
                    code: "CODE",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "next", //current
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    onMessageHandler: function (page, message) {
        this.onContentsSearch('button');
        message.callback && message.callback();  // The popup page is closed   
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    //검색, 전체보기 
    onContentsSearch: function (event) {

        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue() || '';

        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },
    // 적용
    onFooterApply: function () {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        
        var message = {
            name: "NAME",
            code: "CODE",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next", //current
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //// header ReWrite button click event
    //onHeaderRewrite: function (e) {
    //    this.header.reset();
    //},

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        if (this.header.isVisible()) {
            //target && this.onContentsSearch(target.control.getValue());
            this.onHeaderSearch();
        }
    },
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        } else
            this.onFooterApply();
    },

    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },
    // Tab 
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    },

    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    onHeaderSearch: function () {
        var self = this;
        var gridObj = this.contents.getGrid("dataGrid");

        this.header.getQuickSearchControl().setValue("");

        self.searchFormParameter.PARAM = "";
        self.searchFormParameter.SEARCH_KEY = this.header.getControl("NAME").getValue();

        this.contents.getGrid().grid.clearChecked();
        this.contents.getGrid().grid.removeShadedColumn();

        gridObj.draw(this.searchFormParameter);
        this.header.toggle(true);
    },

    onHeaderUsegubun: function (event) {
        this.onContentsSearch('button');
    },

});





