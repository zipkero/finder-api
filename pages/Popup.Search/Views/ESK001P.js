window.__define_resource && __define_resource("LBL12595","LBL12592","LBL12590","BTN00069","BTN00043","BTN00008","MSG03839","MSG00456","MSG00141","LBL03032","MSG00962");
/****************************************************************************************************
1. Create Date : 2018.06.21
2. Creator     : NGO THANH LAM
3. Description : SHOPPING MALL NAME
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESK001P", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
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
            , isOthersDataFlag: this.isOthersDataFlag
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
        header.setTitle(ecount.resource.LBL12595).useQuickSearch();
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.ShoppingMallNameLoad)
            .setRowDataUrl('/Inventory/Basic/GetListForSearchShoppingMallName')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['ITEM1'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'ITEM1', id: 'ITEM1', title: ecount.resource.LBL12592, width: '', isHideColumn: true },
                { propertyName: 'ITEM3', id: 'ITEM3', title: ecount.resource.LBL12590, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('ITEM3', this.setGridDateLink.bind(this))
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
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-default").label(ecount.resource.BTN00043));
        else
            keyHelper.push(10);

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
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
                    name: "ITEM3",
                    code: "ITEM1",
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
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        var value = this.header.getQuickSearchControl().getValue();

        if (!$.isEmpty(value) && data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && (!this.isNewDisplayFlag || (this.isNewDisplayFlag && this.isOnePopupClose))) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message

        }
        else if (['EBD010M_55', 'EBD010M_52', 'EGM024M', 'EGM025M'].contains(this.parentPageID) && data.dataCount == 1) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
    },

    onPopupHandler: function (control, param, handler) {

        param.isApplyDisplayFlag = true;
        param.isCheckBoxDisplayFlag = true;
        param.isIncludeInactive = true;

        this._super.onPopupHandler.apply(this, [control, param, handler]);
    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {
        handler(param);
    },
    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)
    fnSetSendMessage: function (data) {
        var message = {
            name: "ITEM3",
            code: "ITEM1",
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
        var permission = this.viewBag.Permission.ShoppingMallName;

        if (permission.CR && !permission.CW) {
            ecount.alert(ecount.resource.MSG00456);
            return false;
        }
        if (!(permission.CW || permission.CD)) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
        // Define data transfer object
        var params = {
            Request: {
                Data: {
                    isAddGroup: false,
                },
                EditMode: ecenum.editMode.new,

            },

            width: ecount.infra.getPageWidthFromConfig(true),
            height: 400,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({
            url: '/ECERP/SVC/ESA/ESA008M',
            name: ecount.resource.LBL03032,
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
            name: "ITEM3",
            code: "ITEM1",
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
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
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

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        if (!$.isEmpty(this.searchFormParameter.PARAM)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});