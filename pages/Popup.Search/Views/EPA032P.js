window.__define_resource && __define_resource("LBL10109","LBL06534","BTN00113","BTN00351","BTN00007","LBL05325","LBL06553","LBL00830","BTN00069","BTN00043","BTN00008","MSG03839","LBL03881","MSG00962","BTN00603");
/****************************************************************************************************
1. Create Date : 2017.09.01
2. Creator     : DoTrinh
3. Description : widget paid leave code
4. Precaution  :  manage> time Mgmt > paid leave status
5. History     : 2017.09.01(DoTrinh) - Create new
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
6: Old file    : EBG/EPA032P.aspx                 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EPA032P", {
    newItem: false,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            CHK_FLAG: this.searchCategoryFlag == "L" ? "A" : this.searchCategoryFlag
            , PARAM: this.keyword
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , isOthersDataFlag: this.isOthersDataFlag
            , USE_GUBUN: 'N'
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
        if (this.TitleName && this.TitleName != null) {
            header.setTitle(String.format(ecount.resource.LBL10109, this.TitleName)).useQuickSearch();
        } else {
            header.setTitle(ecount.resource.LBL06534).useQuickSearch();
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

        //프로젝트코드, 프로젝트명 검색어
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL05325).value(this.keyword2).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL06553).value(this.keyword3).end())

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

        var field = [{ propertyName: 'REST_CD', id: 'REST_CD', title: ecount.resource.LBL05325, width: '' },
                { propertyName: 'REST_DES', id: 'REST_DES', title: ecount.resource.LBL06553, width: '' }];
        if (['FM055P_01'].contains(this.popupID)) {
            field.push({ propertyName: 'REST_SEL', id: 'REST_SEL', title: ecount.resource.LBL00830, width: '60' });
        }
        settings
            .setRowData(this.viewBag.InitDatas.ProjectLoad)
            .setRowDataUrl('/Manage/TimeMgmt/GetDataWidgetPaidLeave')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['REST_CD', 'REST_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns(field)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('REST_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('REST_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('REST_SEL', this.setGridDateREST_SEL.bind(this))
            //.setCustomRowCell('USE_GUBUN', this.setUseGubun.bind(this))
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

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else
            keyHelper.push(11);        
        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043)); //.css("btn btn-default")
        else
            keyHelper.push(10);

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {        
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
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {

        if (!$.isNull(this.keyword)) {
            //this.contents.getcontrol('search').setvalue(this.keyword);
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
                    name: "REST_DES",
                    code: "REST_CD",
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

    setGridDateREST_SEL: function (value, rowItem) {        
        var option = {};
        option.data = value;
        option.controlType = "widget.label";
        if (rowItem.REST_CD == this.REST_SEL) {
            option.data = ecount.resource.LBL00830;
        }
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
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        //if (this.isIncludeInactive) {
        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();
        //}

        if ((!$.isEmpty(value) || !$.isEmpty(value2) || !$.isEmpty(value3)) && data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && (!this.isNewDisplayFlag || (this.isNewDisplayFlag && this.isOnePopupClose))) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }
        else if (data.dataCount == 1) {// && !['FM055P_01'].contains(this.popupID)
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        this.newItem = false;
    },

    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)
    fnSetSendMessage: function (data) {
        var message = {
            name: "REST_DES",
            code: "REST_CD",
            data: data,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
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

    // Will merge with Trinh for this new function
    onFooterNew: function () {
        //var btnNew = this.footer.get(0).getControl("New");
        // Define data transfer object
        var params = {
            width: 860, // ecount.infra.getPageWidthFromConfig(true),
            height: 285,
            PARAM: ""
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/EPA/EPA033M',
            name: String.format(ecount.resource.LBL03881, ""),
            param: params,
            popupType: false,
            additional: false
        });

        //btnNew.setAllowClick();
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "REST_DES",
            code: "REST_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
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
        //var invalid = this.contents.getControl("search").validate();
        //if (invalid.length > 0) {
        //    this.contents.getControl("search").setFocus(0);
        //    return;
        //}
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        //if (this.isIncludeInactive) {
        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();
        //}

        if (!$.isEmpty(value2) || !$.isEmpty(value3)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

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
        //this.keyword = event.keyword;
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
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

        // 입력화면에서 text 컨트롤의 띄어쓰기가 안되는 문제가 있어서 '버튼' 클릭 시 예외 처리
        if (!$.isNull(event) && !$.isNull(event.target) && event.target.nodeName != "BUTTON") {
            this.gridFocus && this.gridFocus();
        }
    },

    onMessageHandler:function(page, message) {        
        if (page.pageID == "EPA033M") {
            //this.reloadPage();
            this.contents.getGrid().draw(this.searchFormParameter);
        }
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        //if (this.isIncludeInactive) {
        if (this.header.getControl("search1").getValue() == "")
            this.searchFormParameter.PARAM2 = "";

        if (this.header.getControl("search2").getValue() == "")
            this.searchFormParameter.PARAM3 = "";
        //}

        if (!$.isEmpty(this.searchFormParameter.PARAM) || !$.isEmpty(this.searchFormParameter.PARAM2) || !$.isEmpty(this.searchFormParameter.PARAM3)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
   

    reloadPage: function () {
        this.onAllSubmitSelf({
            url: "/ECERP/Popup.Search/EPA032P",
            param: {
                isOpenSearchYN: "Y"
                , isNewDisplayFlag: true
            }
        });

        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }


});
