window.__define_resource && __define_resource("LBL15823","BTN00113","BTN00351","BTN00007","LBL06426","LBL06425","LBL02920","BTN00004","BTN00603","MSG03408","LBL03768","BTN00069","BTN00008","MSG02158","MSG00962");
/****************************************************************************************************
1. Create Date : 2015.05.12
2. Creator     : Nguyen Anh Tuong
3. Description : List of sale price group, purchase price group
4. Precaution  :
5. History     : 
                2016.03.28 (seongjun-Joe) 소스리팩토링.
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM020P", {

    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            CODE_CLASS: this.custGroupCodeClass, PARAM: this.keyword, SORT_COLUMN: "CODE_CLASS", SORT_TYPE: "A"
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
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
        header.setTitle(this.titlename).useQuickSearch();  //거래처그룹 I

        if (this.custGroupCodeClass == "A12")
            header.setTitle(ecount.resource.LBL15823); //거래처그룹 II

        //if (this.isIncludeInactive) {
        //퀵서치 추가
        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        //검색하단 버튼
        //toolbar
        //    .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

        //if (this.isIncludeInactive) {
        //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        //}
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        //코드, 코드명 검색어
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL06426).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL06425).end())

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
        settings
            .setRowData(this.viewBag.InitDatas.PriceGroup)
            .setRowDataUrl("/svc/Inventory/Basic/GetListPriceGroupForSearch")///Account/Basic/GetListPriceGroupForSearch
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CODE_CLASS', 'CLASS_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'CODE_CLASS', id: 'CODE_CLASS', title: ecount.resource.LBL06426, width: '' }, //LBL02920
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL06425, width: '' },
            ])
            .setColumnSortable(true)
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setColumnSortDisableList(['CODE_CLASS', 'CLASS_DES'])
            .setPagingUseDefaultPageIndexChanging(true)

            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setCustomRowCell('CODE_CLASS', this.setGridDateLink.bind(this))
            .setCustomRowCell('CLASS_DES', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);
        if (this.checkMaxCount)
            settings.setCheckBoxMaxCount(this.checkMaxCount);

        //툴바
        //toolbar       
        //toolbar.addRight(ctrl.define("widget.searchGroup", "search").setOptions({
        //    label: ecount.resource.BTN00004,  //검색
        //    status: this.isIncludeInactive ? [{ value: 'Y', label: ecount.resource.BTN00351 }, { value: 'N', label: ecount.resource.BTN00603 }] : null //Y:사용중단포함, N:사용중단미포함
        //}))//MSG03408
        //toolbar.addLeft(ctrl.define("widget.label", "label").label(ecount.resource.LBL03768))//MSG03408
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper"));
        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        debugger
        switch (cid) {
            case "search":
                if (this.isIncludeInactive) {
                    option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
                }
                break;
            default:
                break;
        }
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function (e) {
        this.searchFormParameter.CODE_CLASS = this.custGroupCodeClass == null ? "A11" : this.custGroupCodeClass;
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        //$("input[name=keyword]").focus();
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        //grid.draw(this.searchFormParameter);

        if (!e.unfocus) {
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }

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

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    code: "CODE_CLASS",
                    name: "CLASS_DES",
                    data: data.rowItem,
                    isAdded: true,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
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
                code: "CODE_CLASS",
                name: "CLASS_DES",
                data: rowItem,
                isAdded: false,
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
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            if (ecount.global.isDisableAlert())
                ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            code: "CODE_CLASS",
            name: "CLASS_DES",
            data: selectedItem,
            isAdded: true,
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

        //if (this.isIncludeInactive) {
        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();
        //}

        // 코드번호 중복
        //var control = this.contents.getControl("search");
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.isOnePopupClose = true;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        //if (this.isIncludeInactive) {
        //    if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        //    }
        //    else {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        //    }
        //}
        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
            }
            else {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
            }
        }

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
    //F2 신규
    ON_KEY_F2: function () {
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    //F8 적용
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button');
        } else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        //if (this.isIncludeInactive) {
        if (this.header.getControl("search1").getValue() == "")
            this.searchFormParameter.PARAM2 = "";

        if (this.header.getControl("search2").getValue() == "")
            this.searchFormParameter.PARAM3 = "";
        //}
        this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
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
    }
});
