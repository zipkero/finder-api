window.__define_resource && __define_resource("LBL02449","LBL00495","LBL03228","LBL03229","BTN00004","BTN00069","BTN00043","BTN00008","MSG00962","MSG03839");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 적요 팝업
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경    
                 2019.06.05 (NguyenDucThinh) A18_04171 Update resource
                 2020.07.01 (Ngo Thanh Lam) A20_02839 Change popup input to 3.0
				 2021.02.03 (김동수) : A21_00863 - 검색창 및 BOM등록조회에 버튼 강조색 빼기
				 2021.02.18 (김동수) : A21_01092 - 검색창에 강조색 빼기_2차
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EB009P", {

    newItem: false,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            PARAM: this.keyword,
            GYE_CODE: this.gyeCode
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
        header.setTitle(ecount.resource.LBL02449).useQuickSearch();
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid()

        settings
            .setRowData(this.viewBag.InitDatas.DataLoad)
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setRowDataUrl('/Account/Basic/GetListRemarkForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['GYE_CODE', 'REMARKS_CD', 'REMARKS_DES'])
            .setColumns([
                    { propertyName: 'GYE_CODE', id: 'GYE_CODE', title: ecount.resource.LBL00495, width: 100 },
                    { propertyName: 'REMARKS_CD', id: 'REMARKS_CD', title: ecount.resource.LBL03228, width: 100 },
                    { propertyName: 'REMARKS_DES', id: 'REMARKS_DES', title: ecount.resource.LBL03229, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortDisableList(['GYE_CODE'])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCustomRowCell('REMARKS_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('REMARKS_DES', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true);

        //툴바
        //toolbar
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004  //검색                
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

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else
            keyHelper.push(11);
		if (this.isNewDisplayFlag) {
			toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
			toolbar.setOptions({ css: "btn btn-default", ignorePrimaryButton: true });
}
        else
            keyHelper.push(10);

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
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

    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = (this.isOthersDataFlag !== "N") ? 2 : 1;
        var value = this.keyword;
        if (!$.isEmpty(value)) {
            this.isOnePopupClose = true;
        }
        if (data.totalDataCount === cnt && this.isOnePopupClose) {
        //if (data.dataCount === 1) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "REMARKS_DES",
                code: "REMARKS_CD",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        this.newItem = false;
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "REMARKS_DES",
            code: "REMARKS_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "REMARKS_DES",
                    code: "REMARKS_CD",
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
    
    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
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

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 200,
            Request: {
                Data: {
                    Key: {
                        GYE_CODE: this.gyeCode
                    },
                    IsOthersDataFlag: 'Y'
                },
                EditMode: ecenum.editMode.new
            } 
        };
       
        this.openWindow({
            url: '/ECERP/SVC/EBA/EBA024M',
            name: "EBA024M",
            param: param,
            popupType: false,
            additional: false,
            fpopupID: this.ecPageID
        });    
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {
        target && target.control && this.onContentsSearch(target.control.getValue());
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var invalid = this.header.getQuickSearchControl().validate();

        if (invalid.length > 0) {
            this.header.getQuickSearchControl().setFocus(0);
            return;
        }

        var value = this.header.getQuickSearchControl().getValue().keyword;

            this.isOnePopupClose = true;

        this.searchFormParameter.PARAM = "";
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

    // KEY_F8
    ON_KEY_F8: function () {
         if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = event.keyword;
        //this.header.getQuickSearchControl().setValue(event.keyword);
        //if (this.header.getControl("search1").getValue() == "")
        //    this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        //if (this.header.getControl("search2").getValue() == "")
        //    this.searchFormParameter.PARAM2 = this.header.getQuickSearchControl().getValue();
            this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    fnLink: function (code, name) {
        this.searchFormParameter.PARAM = code;
        this.header.getQuickSearchControl().setValue(code);
        this.header.getQuickSearchControl().setFocus(0);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.isOnePopupClose = true;
    },
    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case 'EBA024M':
                this.contents.getGrid().draw(this.searchFormParameter);
                break;
        }
    }
});