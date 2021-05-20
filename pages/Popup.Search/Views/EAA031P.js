/****************************************************************************************************
 1. Create Date : 2017.09.04
 2. Creator     : inho
 3. Description : Search Real Customer Code(실거래처코드검색) 
 4. Precaution  :
 5. History     : 
 6. MenuPath    : Manage Customer/Vendor(거래처관리)>Enter Customer/Vendor Management(거래처관리입력)>Company Information Tab(회사정보탭)>Search Real Customer Code(실거래처코드검색)
 7. Old File    : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EAA031P", {
    gridRowDataUrl: "/Admin/Manage/GetListCustForBusinessNo",
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

        this.searchFormParameter = {
            PAGE_CURRENT: 1, PAGE_SIZE: 100, SORT_COLUMN: "COM_CODE", SORT_TYPE: "A",
            PARAM: "",
            BUSINESS_NO: "",
            CUST_NAME: ""
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
        header.setTitle("Company Code Search").useQuickSearch();

        //퀵서치 추가
        var contents = widget.generator.contents(),
        form1 = widget.generator.form(),
        toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "search").label("Search(F8)"))
        // Check use button include
        if (this.isIncludeInactive) {
            toolbar.addLeft(ctrl.define("widget.button", "usegubun").label("Include Inactive").value("Y"));  //포함    
        }

        //관리자ID, 관리자명 검색어
        form1.add(ctrl.define("widget.input", "searchBusinessNo", "searchBusinessNo", "Business No.").end())
            .add(ctrl.define("widget.input", "searchCustName", "searchCustName", "Business Name").end())

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.CustList)
            .setRowDataUrl(this.gridRowDataUrl)
            //.setSessionCreateLocationType(ecount.grid.constValue.locationType.GMC)
            .setSessionCreateLocationType(ecount.grid.constValue.locationType.ZONE, this.custZone)
            .setSessionParameter({ zoneName: this.custZone })
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['BUSINESS_NO'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: "Business No.", width: '' },
                { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: "Business Name", width: '' }
            ])
             .setEmptyGridMessage("No data.")
            //Page
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            //Custom
            .setCustomRowCell('BUSINESS_NO', this.setGridDateLink.bind(this))
            .setCustomRowCell('CUST_NAME', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true);

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control()

        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label("Apply (F8)"))
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label("Close"))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper"));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {

        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
            this.searchFormParameter.PARAM = this.keyword;
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
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

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var _setDataCode = "";
                if (data.rowItem.CUST_NAME == null) {
                    _setDataCode = "BUSINESS_NO";
                }
                else {
                    if (data.rowItem.CUST_NAME == "") {
                        _setDataCode = "BUSINESS_NO";
                    }
                    else {
                        _setDataCode = "CUST_NAME";
                    }
                }

                var message = {
                    name: _setDataCode,
                    code: "BUSINESS_NO",
                    data: data.rowItem,
                    isAdded: this.isApplyDisplayFlag,
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

    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)
    fnSetSendMessage: function (data) {
        debugger;
        if (data.rowItem.COM_DES == null) {
            _setDataCode = "BUSINESS_NO";
            data.rowItem.COM_DES = data.rowItem.COM_CODE;
        }
        else {
            if (data.rowItem.COM_DES == "") {
                _setDataCode = "BUSINESS_NO";
                data.rowItem.COM_DES = data.rowItem.COM_CODE;
            }
            else {
                _setDataCode = "CUST_NAME";
            }
        }

        var message = {
            name: _setDataCode,
            code: "BUSINESS_NO",
            data: data.rowItem,
            isAdded: "",
            addPosition: "current",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
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

    // Event handle button [Inactive]
    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y") {
            // Change button to Include
            this.searchFormParameter.DEL_FLAG = "N";
            this.header.getControl("usegubun").changeLabel("Include Inactive");
        }
        else {
            // Change button to Exclude
            this.searchFormParameter.DEL_FLAG = "Y";
            this.header.getControl("usegubun").changeLabel("Exclude Inactive");
        }
        this.onContentsSearch('usegubun');
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = this.header.getControl("searchBusinessNo").getValue();
        var value3 = this.header.getControl("searchCustName").getValue();
        if ((!$.isEmpty(value) || !$.isEmpty(value2) || !$.isEmpty(value3)) && data.dataCount == 1 && this.contents.getGrid().settings.getPagingCurrentPage() == 1) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var _setDataCode = "";
            if (rowItem.CUST_NAME == null) {
                _setDataCode = "BUSINESS_NO";
            }
            else {
                if (rowItem.CUST_NAME == "") {
                    _setDataCode = "BUSINESS_NO";
                }
                else {
                    _setDataCode = "CUST_NAME";
                }
            }
            var message = {
                name: _setDataCode,
                code: "BUSINESS_NO",
                data: rowItem,
                isAdded: this.isApplyDisplayFlag,
                addPosition: "current",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        value2 = this.header.getControl("searchBusinessNo").getValue();
        value3 = this.header.getControl("searchCustName").getValue();

        if (!$.isEmpty(value2) || !$.isEmpty(value3)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.BUSINESS_NO = value2;
        this.searchFormParameter.CUST_NAME = value3;

        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    //Event footer apply
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert("More than one need to be selected.");
            return false;
        }
        var message = {
            name: "CUST_NAME",
            code: "BUSINESS_NO",
            data: selectedItem,
            isAdded: this.isApplyDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);

    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // KEY_DOWN
    ON_KEY_DOWN: function () {
    },
    // KEY_UP
    ON_KEY_UP: function () {
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

    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.searchFormParameter);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        if (this.header.getControl("searchBusinessNo").getValue() == "")
            this.searchFormParameter.BUSINESS_NO = "";

        if (this.header.getControl("searchCustName").getValue() == "")
            this.searchFormParameter.CUST_NAME = "";

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
