window.__define_resource && __define_resource("LBL35120","LBL35121","LBL35122","BTN00113","BTN00351","LBL02341","LBL02342","LBL35194","BTN00004","BTN00603","BTN00070","BTN00043","BTN00008","MSG02158","LBL93705","MSG00962");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 추가항목 검색
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
                 2016.12.07 (김동수) 코드, 코드명 검색어 리소스 오류 수정
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EB014P", {

    newItem: false,
    permission: false,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            TYPE_CD: this.searchCodeType
            , SORT_COLUMN: "NM_CD"
            , PARAM: this.keyword
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , USE_YN: "Y"
        };

        this.permission = this.viewBag.Permission.permit;

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
        header.setTitle(ecount.resource.LBL35120).useQuickSearch();

        if(this.searchCodeType == 2)
            header.setTitle(ecount.resource.LBL35121);
        else if (this.searchCodeType == 3)
            header.setTitle(ecount.resource.LBL35122);


        if (this.isIncludeInactive) {
            //퀵서치 추가
            var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
            var ctrl = widget.generator.control();

            //검색하단 버튼
            toolbar
                .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))
                        
            if (this.isIncludeInactive) {
                toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
            }
            
            //코드, 코드명 검색어
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL02341).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL02342).end())

            //this.onInitHeader.getControl("search3").hide();

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
            settings = generator.grid()

        settings
            .setRowData(this.viewBag.InitDatas.DataLoad)
            .setRowDataUrl('/Account/Basic/GetListAddFieldForSearch')
            .setRowDataParameter(this.searchFormParameter)
            //.setEventFocusOnInit(true)                  //Focus 이벤트 시작
            //.setKeyboardCursorMove(true)                // 위, 아래 방향키
            //.setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            //.setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setKeyColumn(['NM_CD', 'CD_DES', 'KEYWORDS'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'NM_CD', id: 'NM_CD', title: ecount.resource.LBL02341, width: 100 },
                { propertyName: 'CD_DES', id: 'CD_DES', title: ecount.resource.LBL02342, width: 100 },
                { propertyName: 'KEYWORDS', id: 'KEYWORDS', title: ecount.resource.LBL35194, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(20)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(20, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('NM_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('CD_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('KEYWORDS', this.setGridDateLink.bind(this));

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
            ctrl = widget.generator.control();

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00070));
        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-default").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data) {        
        
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1 && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && (!this.isNewDisplayFlag || (this.isNewDisplayFlag && this.isOnePopupClose))) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "CD_DES",
                code: "NM_CD",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "CD_DES",
                    code: "NM_CD",
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

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['USE_YN']== "N")
            return true;        
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

        if (this.permission.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93705, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }


        var code_class = "A05";

        if (this.searchCodeType == 1)
            code_class = "A05";
        else if (this.searchCodeType == 2)
            code_class = "A06";
        else if (this.searchCodeType == 3)
            code_class = "A07";

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 300,
            editFlag: "I",
            TYPE_CD: this.searchCodeType || 1,
            CODE_CLASS: code_class,
            NM_CD: "",
            isAddGroup: true
        };

        this.openWindow({
            url: '/ECERP/EBA/EBA069P_01',
            name: '',
            param: param,
            popupType: false,
            additional: true
        });     
    },

    onMessageHandler: function (event, data) {
        if (event.pageID == "EBA069P_01") {
            this.NewItem = true;

            this.isOnePopupClose = true;
            this.searchFormParameter.PARAM = data.CODE;
            this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

            this.contents.getGrid().draw(this.searchFormParameter);
            //this.contents.getControl("search").onFocus(0);
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

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "CD_DES",
            code: "NM_CD",
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
        
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        
        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }
        this.searchFormParameter.PARAM = "";
        if (value3 || value2) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }
        
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        if (this.isIncludeInactive) {
            //this.searchFormParameter.DEL_FLAG = event.status;
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
            else {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            }
        }

        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("search").onFocus(0);
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

    //엔터
    ON_KEY_ENTER: function (e, target) {
        this.onContentsSearch(target.control.getValue());
    },

    onHeaderQuickSearch: function (event) {        
        
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        
        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }
        this.searchFormParameter.PARAM = value;
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;

        if (value3 || value || value2) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
});
