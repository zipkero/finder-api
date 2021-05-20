window.__define_resource && __define_resource("BTN00113","LBL11653","LBL11654","LBL35194","LBL11652","MSG02158","BTN00043","BTN00069","BTN00008","MSG00456","MSG00141","LBL00336");
/****************************************************************************************************
1. Create Date : 2016.10.31
2. Creator     : Nguyen Van Lap
3. Description : Popup search [Customs Broker]
4. Precaution  : 
5. History     : [2016.10.31] Lap : Create new
                 [2018.11.26] [DucThai]: Change popup call new FW
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "CM022P_CM", {
    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체)


    /**********************************************************************
    * page init
    **********************************************************************/
    init: function (options, layout) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            SORT_COLUMN: 'CUST_NAME',
            PROD_SEARCH: '9',
            SORT_TYPE: 'A',
            SEARCH_GB: '2',
            PARAM: "",
            CALL_TYPE: 107
        };
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
    **********************************************************************/

    onInitHeader: function (header, resource) {

        var contents = widget.generator.contents(),
            form1 = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        // Add control for toolbar
        toolbar.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

        // Add template for tab advanced search
        form1.add(ctrl.define("widget.input.codeName", "custCode", "custCode", ecount.resource.LBL11653).end())
            .add(ctrl.define("widget.input.codeName", "custName", "custName", ecount.resource.LBL11654).end())
            .add(ctrl.define("widget.input.codeName", "keywordsearch", "keywordsearch", ecount.resource.LBL35194).end())

        contents.add(form1);
        contents.add(toolbar);
        header.notUsedBookmark().setTitle(ecount.resource.LBL11652).add("search").useQuickSearch().addContents(contents);
    },


    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Account/Import/GetDataCustomsBroker", false)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['BUSINESS_NO', 'CUST_NAME'])
            .setColumns([
                { propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: ecount.resource.LBL11653, width: '' },
                { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL11654, width: '' },
                { propertyName: 'REMARKS_WIN', id: 'REMARKS_WIN', title: ecount.resource.LBL35194, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCountExceeded(function (e) { ecount.alert(String.format(ecount.resource.MSG02158, e)); })
            .setCustomRowCell('BUSINESS_NO', this.setGridDataForCustLink.bind(this))    // Link for col [cust]
            .setCustomRowCell('CUST_NAME', this.setGridDataFroCustNameLink.bind(this))  // Link for col [cust_name]
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true)
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingRowCountPerPage(100, true)
            .setCheckBoxMaxCount(this.checkMaxCount || 100);

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);

    },


    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        if (this.isNewDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).css("btn btn-default"))
        }
        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]))
        footer.add(toolbar);
    },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

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


    // 그리드 랜더 후
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (data.dataCount === 1 && this.ispopupCloseUse) {
            var message = {
                name: "CUST_NAME",
                code: "BUSINESS_NO",
                data: data.dataRows[0],
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },


    //팝업창에서 부모에게 넘겨준값 컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (page, param) {
        switch (page.pageID) {
            case "ESA002M":
                this.NewReload(param.CUST.BUSINESS_NO, "");
                break;
        }
    },

    //상단 검색
    onHeaderSearch: function (event, key) {
        this.ispopupCloseUse = true;

        var _custName = "";
        var _custCode = "";
        var _custKeyword = "";

        _custName = this.header.getControl("custName").getValue();
        _custCode = this.header.getControl("custCode").getValue();
        _custKeyword = this.header.getControl("keywordsearch").getValue();
        if (_custName != "" || _custCode != "" || _custKeyword != "") {
            this.searchFormParameter.CUST_NAME = _custName;
            this.searchFormParameter.BUSINESS_NO = _custCode;
            this.searchFormParameter.REMARKS_WIN = _custKeyword;
            this.searchFormParameter.PROD_SEARCH = '1'
            this.searchFormParameter.SEARCH_GB = '1'
        } else {
            this.searchFormParameter.PARAM = "";
            this.searchFormParameter.PROD_SEARCH = '9'
            this.searchFormParameter.SEARCH_GB = '2'
        }

        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },


    onHeaderQuickSearch: function (event) {
        this.ispopupCloseUse = true;
        this.searchFormParameter.SEARCH_GB = '2';
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 신규 버튼 클릭
    onFooterNew: function () {
        if (this.viewBag.Permission.CUST.Value == "R") {
            ecount.alert(ecount.resource.MSG00456);
            return false;
        }

        if (!(this.viewBag.Permission.CUST.Value == "U" || this.viewBag.Permission.CUST.Value == "W")) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        var cust_name = this.header.getQuickSearchControl().getValue() || "";

        var param = {
            Request: {
                EditMode: ecenum.editMode.new,
                Data: {
                    CUST_NAME: cust_name
                }
            },
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 850
        }

        this.openWindow({
            url: '/ECERP/SVC/ESA/ESA002M',
            name: ecount.resource.LBL00336,
            param: param,
            additional: true,
            fpopupID: this.ecPageID
        });
    },


    // 페이지 닫기 버튼 클릭
    onFooterClose: function (e) {
        this.close();
        return false;
    },

    // 적용 버튼 클릭
    onFooterApply: function (e) {
        // TODO
    },

    // Event column sort click
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // Function set data for cell grid
    setGridDataForCustLink: function (value, rowItem) {
        return this.fnSetInfoForCol("BUSSINESS_NO", value, rowItem);
    },

    // Function set data for cell grid
    setGridDataFroCustNameLink: function (value, rowItem) {
        return this.fnSetInfoForCol("CUST_NAME", value, rowItem);
    },

    // Set info for column
    fnSetInfoForCol: function (_col, valueCell, _rowItem) {
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "CUST_NAME",
                    code: "BUSINESS_NO",
                    data: data.rowItem,
                    callback: this.close.bind(this) // Close popup when handle complete
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    /**********************************************************************
    *  hotkey [f1~12, 방향키등.. ]
    **********************************************************************/
    //KEY_F8
    ON_KEY_F8: function () {
        this.onHeaderSearch('button');
    },

    //KEY_F2
    ON_KEY_F2: function () {
        this.contents.getGrid("dataGrid" + this.pageID).grid.blur();
        if (this.isNewDisplayFlag) {
            this.onFooterNew();
        }
    },

    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        this.onHeaderSearch('button');

    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);

        this.contents.getGrid().draw(this.searchFormParameter);
    },

    NewReload: function (code, des) {
        this.ispopupCloseUse = true;
        this.header.getQuickSearchControl().setValue(code);
        this.searchFormParameter.SEARCH_GB = '2';
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().draw(this.searchFormParameter);
    }
});