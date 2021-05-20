window.__define_resource && __define_resource("LBL10445","LBL03297","LBL80147","LBL01595","BTN00043","BTN00008","MSG03839","MSG00140","MSG02421","LBL10446");
/****************************************************************************************************
1. Create Date : 2016.11.11
2. Creator     : LeNguyen
3. Description : User Customization > User Setup > Register User
4. Precaution  : 
5. History     : 

****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMM002P_22", {
    newItem: false,

    MeargeSetCount: [],     // Merge rows Count
    SplitSetCount: [],      // Split rows Count
    MeargeArrayData: [],    // Merge data Array
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            COM_CODE: this.comCode,
            PARAM: this.keyword,
            isOthersDataFlag: this.isOthersDataFlag
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
        header.setTitle(ecount.resource.LBL10445).useQuickSearch();
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowDataUrl('/Service/CustomerCenter/GetListWebMailUser')
            .setSessionCreateLocationType(ecount.grid.constValue.locationType.GMC)
            .setGMCNotUseCN(true)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['DOMAIN', 'USER_ID'])
            .setColumns([
                { propertyName: 'DOMAIN', id: 'DOMAIN', title: ecount.resource.LBL03297, width: '' },
                { propertyName: 'USER_ID', id: 'USER_ID', title: ecount.resource.LBL80147, width: '' },
                { propertyName: 'USER_NAME', id: 'USER_NAME', title: ecount.resource.LBL01595, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('USER_ID', this.setGridDateLink.bind(this))
            .setCustomRowCell('USER_NAME', this.setGridDateLink.bind(this));

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    onDrawAgain: function (cid, option) {
        var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowDataUrl('/Service/CustomerCenter/GetListWebMailUser')
            .setSessionCreateLocationType(ecount.grid.constValue.locationType.GMC)
            .setGMCNotUseCN(true)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['USER_ID', 'USER_NAME'])
            .setColumns([
                { propertyName: 'DOMAIN', id: 'DOMAIN', title: ecount.resource.LBL03297, width: '' },
                { propertyName: 'USER_ID', id: 'USER_ID', title: ecount.resource.LBL80147, width: '' },
                { propertyName: 'USER_NAME', id: 'USER_NAME', title: ecount.resource.LBL01595, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('USER_ID', this.setGridDateLink.bind(this))
            .setCustomRowCell('USER_NAME', this.setGridDateLink.bind(this));

        this.setRowDataMerge(rowList);
    },

    setRowDataMerge: function (datagrid) {
        this.setMergeParam("DOMAIN", datagrid);

        var mergeData = {}, r;

        for (i = 0, j = this.SplitSetCount.length; i < j; i++) {
            r = this.MeargeSetCount[i];
            datagrid[r]['_MERGE_SET'] = [];
            mergeData = {};
            mergeData['_MERGE_USEOWN'] = true;
            mergeData['_STYLE_USEOWN'] = true;
            mergeData['_ROW_TYPE'] = 'TOTAL';
            mergeData['_MERGE_START_INDEX'] = 0;
            mergeData['_ROWSPAN_COUNT'] = this.SplitSetCount[i];
            datagrid[r]['_MERGE_SET'].push(mergeData);
        }
    },

    setMergeParam: function (column, datagrid) {
        var _self = this;
        var PreName = "", MergeCount = 0, SplitCount = 1;
        var tmpMergeCount = [], tmpSplitCount = [];
        var unitData = [];

        $.each(datagrid, function (idx, item) {
            if (idx != 0) {
                if (PreName != item[column]) {
                    PreName = item[column];
                    MergeCount = MergeCount + SplitCount;
                    tmpMergeCount.push(MergeCount);
                    tmpSplitCount.push(SplitCount);
                    SplitCount = 1;
                    _self.MeargeArrayData.push(unitData);
                    unitData = [];
                    unitData.push(idx);
                }
                else {
                    SplitCount++;
                    unitData.push(idx);
                }
                if (idx == datagrid.length - 1) {
                    tmpSplitCount.push(SplitCount);
                    unitData.push(idx);
                    _self.MeargeArrayData.push(unitData);
                }
            }
            else {
                unitData.push(idx);
                PreName = item[column];
                tmpMergeCount.push(MergeCount);
            }
        });

        this.SplitSetCount = tmpSplitCount;
        this.MeargeSetCount = tmpMergeCount;
    },

    onGridAfterRowDataLoad: function (e, data, grid) {
        var Data = $.isEmpty(data.result) ? data : data.result.Data;

        this.setRowDataMerge(Data);

        return Data;
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
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

        this.onDrawAgain();
        this.contents.getGrid().draw(this.searchFormParameter);
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
                    name: "USER_NAME",
                    code: "USER_ID",
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

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }

        if ((!$.isEmpty(value) || !$.isEmpty(value2) || !$.isEmpty(value3)) && data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && (!this.isNewDisplayFlag || (this.isNewDisplayFlag && this.isOnePopupClose))) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }
        else if (this.parentPageID == "EBD010M_55" && data.dataCount == 1) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        this.newItem = false;
    },


    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.onDrawAgain();
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
        if (this.PermissionType != '1') {
            ecount.alert(String.format("{0}<br/><{1}", ecount.resource.MSG00140, ecount.resource.MSG02421));
            return;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 600,
            isAddGroup: false
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/EMM002P_23',
            name: ecount.resource.LBL10446,
            param: param,
            additional: true
        });
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    onMessageHandler: function (event, data) {
        if (event.pageID == "EMM002P_23") {
            this.setReload();
        }
    },

    setReload: function () {
        this.contents.getGrid().grid.clearChecked();
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F2
    ON_KEY_F2: function () {
        this.onFooterNew();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
