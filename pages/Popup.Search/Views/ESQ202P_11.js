window.__define_resource && __define_resource("LBL11300","BTN00113","BTN00351","BTN00007","LBL06069","LBL03004","MSG02158","BTN00069","BTN00008","LBL00004","MSG00962","BTN00603");
/****************************************************************************************************
1. Create Date : 2017.04.06
2. Creator     : Seung Jun Yu
3. Description : Search for Serial/Lot No. by prod_cd
4. Precaution  : 
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESQ202P_11", {

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
            //SORT_COLUMN: 'SERIAL_IDX',
            //SORT_TYPE: 'A',
            //USE_YN: 'N'
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
        header.setTitle(ecount.resource.LBL11300).useQuickSearch();

        //퀵서치 추가
        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        // 검색하단 버튼
        //toolbar
        //    .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))        
        //    .addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        // 검색어
        form1
            .add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL06069).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL03004).end())

        // 검색어
        contents.add(form1);
        // 버튼
        contents.add(toolbar);

        header.add("search")
            .addContents(contents);

    },

    // Body options settings(본문 옵션 설정)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid()

        settings
            .setRowData(this.viewBag.InitDatas.SerialView)
            .setRowDataUrl('/Inventory/Serial/GetListSerialLotNoSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['STNO_LOT_SER.SERIAL_IDX'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'SERIAL_IDX', id: 'STNO_LOT_SER.SERIAL_IDX', title: ecount.resource.LBL06069, width: '' },
                { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL03004, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG02158, e));
            })

            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setCustomRowCell('STNO_LOT_SER.SERIAL_IDX', this.setGridSerialIDXLink.bind(this))
            .setCustomRowCell('PROD_DES', this.setGridProdDesLink.bind(this))
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxMaxCount(this.checkMaxCount || 100)

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings)

    },

    // Set footer options(풋터 옵션 설정)
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

    // Init Control
    onInitControl: function (cid, option) {
        debugger
        switch (cid) {
            case "search":
                option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
                break;
            default:
                break;
        }
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

    // Checkbox count limit(체크박스 체크갯수 제한)
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },

    // Sort(정렬)
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.USE_YN == "Y")
            this.searchFormParameter.USE_YN = "N";
        else
            this.searchFormParameter.USE_YN = "Y";

        this.onContentsSearch('button');
    },

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.USE_YN == "Y")
            this.searchFormParameter.USE_YN = "N";
        else
            this.searchFormParameter.USE_YN = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },

    // Select SERIAL_IDX
    setGridSerialIDXLink: function (value, rowItem) {

        var option = {};
        option.data = value
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "SERIAL_IDX",
                    code: "SERIAL_IDX",
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

    // Select PROD_DES
    setGridProdDesLink: function (value, rowItem) {
        var option = {};

        if (rowItem.PROD_CNT != '' && rowItem.PROD_CNT > 1)
            option.data = String.format(ecount.resource.LBL00004, value, (rowItem.PROD_CNT - 1));
        else
            option.data = value

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "SERIAL_IDX",
                    code: "SERIAL_IDX",
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

    // If one thing is to be automatically entered in the search value
    // 검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (data.dataCount === 1 && !this.isNewDisplayFlag && this.contents.getGrid().settings.getPagingCurrentPage() === 1) {
            //var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "SERIAL_IDX",
                code: "SERIAL_IDX",
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

        //if (this.isIncludeInactive) {
        if (this.header.getControl("search1").getValue() == "")
            this.searchFormParameter.PARAM2 = "";

        if (this.header.getControl("search2").getValue() == "")
            this.searchFormParameter.PARAM3 = "";
        //}


        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // Button click event before calling(버튼 이벤트 클릭전 호출)
    onBeforeEventHandler: function (e) {
        //권한 체크
        this._super.onBeforeEventHandler.apply(this, arguments);
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
            name: "SERIAL_IDX",
            code: "SERIAL_IDX",
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

        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();

        //if (!$.isNull(event) && this.searchFormParameter.USE_YN == "Y") {
        //    this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);   // Exclude Inactive (사용중단미포함)
        //}
        //else {
        //    this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        //}
        var btnSearch = this.header.getControl("search");
        if (!$.isNull(event) && this.searchFormParameter.USE_YN == "Y") {
            //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            btnSearch.removeGroupItem("usegubun");
            btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
        }
        else {
            //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            btnSearch.removeGroupItem("usegubun");
            btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
        }

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

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

    // ON_KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onHeaderSearch();
        }
        else {
            if (this.isApplyDisplayFlag)
                this.onFooterApply();
        }
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // onMouseupHandler
    onMouseupHandler: function () {
    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        var grid = this.contents.getGrid().grid;
        grid.focus();
    },

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["USE_YN"] == "Y")
            return true;
    },
});
