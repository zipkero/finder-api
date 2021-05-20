window.__define_resource && __define_resource("LBL10109","LBL12783","BTN00113","BTN00351","BTN00007","LBL06524","LBL06540","MSG02158","BTN00004","BTN00603","BTN00069","LBL02792","BTN00043","BTN00008","MSG00456","MSG00141","LBL09999","LBL00078","MSG00962");
/****************************************************************************************************
1. Create Date : 2017.09.06
2. Creator     : Nguyen Thanh Trung
3. Description : Search time code
4. Precaution  : 
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.09.24 (Ngo Thanh Lam) Apply logic job code A18_01220
6. Old file    : EPA030P.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EPA030P_01", {

    newItem: false,

    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            PARAM: this.keyword,
            PAGE_SIZE: 100,
            PAGE_CURRENT: 1,
            ATTEND_CD: '',
            ATTEND_DES: '',
            USE_GUBUN: 'N',
            ATTEND_APCL_TYPE_CD: this.ATTEND_APCL_TYPE_CD,
            OPEN_SEARCH_YN: this.isOpenSearchYN
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
        if (this.titleName && this.titleName != null) {
            header.setTitle(String.format(ecount.resource.LBL10109, this.titleName)).useQuickSearch();
        } else {
            header.setTitle(ecount.resource.LBL12783).useQuickSearch();
        }

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

        //담당자코드, 담당자명 검색어
        form1.add(ctrl.define("widget.input.codeName", "ATTEND_CD", "ATTEND_CD", ecount.resource.LBL06524).end())
            .add(ctrl.define("widget.input.codeName", "ATTEND_DES", "ATTEND_DES", ecount.resource.LBL06540).end())


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
            .setRowData(this.viewBag.InitDatas.TimeCodeLoad)
            .setRowDataUrl('/Manage/TimeMgmt/GetListSearchTimeCode')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['ATTEND_CD', 'ATTEND_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'ATTEND_CD', id: 'ATTEND_CD', title: ecount.resource.LBL06524, width: '' },
                { propertyName: 'ATTEND_DES', id: 'ATTEND_DES', title: ecount.resource.LBL06540, width: '' }
            ])
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingRowCountPerPage(100, true)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount || 100)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG02158, e));
            })
            .setCustomRowCell('ATTEND_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('ATTEND_DES', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        //툴바
        //toolbar
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004,  //검색
        //        status: this.isIncludeInactive ? [{ value: 'Y', label: ecount.resource.BTN00351 }, { value: 'N', label: ecount.resource.BTN00603 }] : null //Y:사용중단포함, N:사용중단미포함
        //    }));

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        }
        else
            keyHelper.push(11);
        if (this.isAddDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "add").label(ecount.resource.LBL02792));
        }
        else {
            keyHelper.push(11);
        };

        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        else
            keyHelper.push(10);

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));


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
    // 페이지 완료 이벤트
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
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
                    name: "ATTEND_DES",
                    code: "ATTEND_CD",
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

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['USE_GUBUN'] == "1")
            return true;
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1 && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "ATTEND_DES",
                code: "ATTEND_CD",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT = data.columnId;
        this.searchFormParameter.SORT_AD = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
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
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //신규버튼
    onFooterNew: function () {
        //var permission = this.viewBag.Permission.Pic;

        //if (permission.CR && !permission.CW) {
        //    ecount.alert(ecount.resource.MSG00456);
        //    return false;
        //}
        //if (!(permission.CW || permission.CD)) {
        //    ecount.alert(ecount.resource.MSG00141);
        //    return false;
        //}

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 500,
            editFlag: "I",
            isAddGroup: false
        };

        this.openWindow({
            url: '/ECERP/EPA/EPA031M',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL00078),
            param: param,
            additional: true
        });
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "ATTEND_DES",
            code: "ATTEND_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //추가버튼
    onFooterAdd: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "ATTEND_DES",
            code: "ATTEND_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next"
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

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.ATTEND_CD = this.header.getControl("ATTEND_CD").getValue();
        this.searchFormParameter.ATTEND_DES = this.header.getControl("ATTEND_DES").getValue();
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
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
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, data) {
        if (event.pageID == "EPA031M") {
            this.contents.getGrid().draw(this.searchFormParameter);
        }
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F2
    ON_KEY_F2: function () {
        this.contents.getGrid("dataGrid" + this.pageID).grid.blur();
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

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
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        if (this.header.getControl("ATTEND_CD").getValue() == "")
            this.searchFormParameter.ATTEND_CD = "";

        if (this.header.getControl("ATTEND_DES").getValue() == "")
            this.searchFormParameter.ATTEND_DES = "";

            this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
