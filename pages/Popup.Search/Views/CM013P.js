window.__define_resource && __define_resource("LBL03443","BTN00113","BTN00351","BTN00007","LBL01809","LBL01595","BTN00004","BTN00603","BTN00069","BTN00263","BTN00008","MSG02158","MSG00962");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 최종 수정자 팝업
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 [2016-03-18] 이수진 : 헤더 타이틀 변경
                 [2016-03-28] seongjun-Joe) :소스리팩토링.
                 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM013P", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            PARAM: this.keyword
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , GW_USE: this.GW_USE
            , isNolimitFlag: this.isNolimitFlag
        };
    },

    render: function () {
        this._super.render.apply(this);
    },
    
    /****************************************************************************************************
   * UI Layout setting
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
   ****************************************************************************************************/

    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        
        //Set title to form resource
        //양식에서 받아온 resource로 title설정 할 경우
        if (this.IsTitleFlag) {            
            header.setTitle(this.SubTitle).useQuickSearch();
        }            
        else
            header.setTitle(ecount.resource.LBL03443).useQuickSearch();

        if (this.isIncludeInactive) {
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

            //아이디, 성명
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL01809).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL01595).end())

            contents.add(form1);    //검색어
            contents.add(toolbar);  //버튼

            header.add("search")
                .addContents(contents);
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.LoadData) 
            .setRowDataUrl("/Inventory/Sale/GetListModifierForSearch")
            .setRowDataParameter(this.searchFormParameter)      
            .setKeyColumn(['ID', 'UNAME'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'ID', id: 'ID', title: ecount.resource.LBL01809, width: '' },
                { propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL01595, width: '' }
            ])
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setCustomRowCell('ID', this.setGridDateLink.bind(this))
            .setCustomRowCell('UNAME', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        //툴바
        //toolbar
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        category: [[0, ecount.resource.LBL01595], [1, ecount.resource.LBL01809]],
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
            ctrl = widget.generator.control();

        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        }

        if (((this.isAddDisplayFlag == null) ? true : this.isAddDisplayFlag) == true) {
            toolbar.addLeft(ctrl.define("widget.button", "add").label(ecount.resource.BTN00263));
        }

      
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([10, 11]));
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
    //페이지 완료 이벤트
    onLoadComplete: function (e) {        
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            //this.contents.getControl('search').setFocus(0);
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

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};

        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "UNAME",
                    code: "ID",
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
        if (data['CANCEL'] == "Y")
            return true;
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (!$.isEmpty(this.keyword)) {
            this.activeHeader.getQuickSearchControl().setValue(this.keyword);
        }
        debugger
        var value = this.keyword;

        if (!$.isEmpty(value))
            this.isOnePopupClose = true;

        if (data.dataCount === 1 && this.isOnePopupClose === true) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "UNAME",
                code: "ID",
                data: rowItem,
                isAdded: false,
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
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "UNAME",
            code: "ID",
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
            name: "UNAME",
            code: "ID",
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

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.isOnePopupClose = true;
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        //this.searchFormParameter.USER_SEARCH = event.category;

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
        //this.contents.getControl('search').setFocus(0)
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    // ON_KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        if (this.isIncludeInactive) {
            if (this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.PARAM2 = "";

            if (this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.PARAM3 = "";
        }
        this.isOnePopupClose = true;
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
