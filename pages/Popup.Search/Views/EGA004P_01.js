window.__define_resource && __define_resource("LBL12638","LBL85000","LBL03176","LBL01595","MSG00089","MSG03839","BTN00069","BTN00008","MSG00598");
/****************************************************************************************************
1. Create Date : 2016.04.02
2. Creator     : Cao Vinh Thai
3. Description : 회사코드검색 팝업
4. Precaution  :
5. History     : 20170818 HaeIn Kim(김해인) add COM_CODE, COM_DES.
                 2017.10.17 (Duyet) Add more column [Company code], [Company name]
                 2018.06.05 (이현택) - 사용자선택 갯수 1000개로 제한 & 페이징처리
6. Old File    : ECC001P_01
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGA004P_01", {
    /********************************************************************** 
    * page user opion Variables(User variables and objects)
    **********************************************************************/
    searchFormParameter: null,

    /**********************************************************************
    * page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = { COM_CODE: (!$.isNull(this.keyword)) ? this.keyword : ' ', SORT_TYPE: 'A', SORT_COLUMN: 'USERID', PAGE_SIZE: 100, PAGE_CURRENT: 1 }
    },

    render: function () { this._super.render.apply(this); },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](Screen configuration) 
    **********************************************************************/
    // Header Setting
    // Thiết lập phần tiêu đề 
    onInitHeader: function (header, resource) {
        var ctrl = widget.generator.control();
        header.notUsedBookmark();
        header.add(ctrl.define("widget.input", "txtSearchText", "txtSearchText", ecount.resource.LBL12638).inline());  
        header.setTitle(ecount.resource.LBL12638);
    },

    // Contents Setting
    // Thiết lập phần nội dung
    onInitContents: function (contents, resource) {
        var grid = widget.generator.grid(), self = this;
        grid.setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataParameter(this.searchFormParameter)
            .setRowDataUrl("/Account/Basic/GetListVendorByComCode")
            .setColumns([
                        { id: 'COM_CODE', propertyName: 'COM_CODE', title: ecount.resource.LBL85000, width: 120, align: 'left' },
                        { id: 'COM_DES', propertyName: 'COM_DES', title: ecount.resource.LBL03176, width: 120, align: 'left' },
                        {
                            id: 'CHK2', propertyName: 'CHK2', title: "", width: 25, align: 'left', controlType: "widget.checkbox",
                            columnOption: { attrs: { 'disabled': true } }
                        },
                        { id: 'USERID', propertyName: 'USERID', title: "ID", width: 150, align: 'left' },
                        { id: 'USERNAME', propertyName: 'USERNAME', title: ecount.resource.LBL01595, width: '', align: 'left' },
                        { id: 'DB_CON_FLAG', propertyName: 'DB_CON_FLAG', isHideColumn: true }
            ])
            .setKeyColumn(['ID'])
           .setColumnFixHeader(true)
           .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), '#FEF2F8')
           .setEmptyGridMessage(ecount.resource.MSG00089)
           .setColumnSortEnableList(['USERID', 'USERNAME'])
           .setColumnSortExecuting(this.onColumnSortClick.bind(this))

           // 특정 컬럼에 대해 Max Count 지정
           .setCheckBoxCustomRememberChecked("CHK2", true)
           .setCheckBoxCustomMaxCount("CHK2", 1000)
           .setCheckBoxCustomMaxCountExceeded("CHK2", function (maxcount) { ecount.alert(String.format(ecount.resource.MSG03839, maxcount)); })
           .setCheckBoxUse(true)
           .setCheckBoxHeaderCallback({ 'change': function (e, data) { self.contents.getGrid().grid.checkAllCustom('CHK2', data.target.checked); } })
           .setCheckBoxCallback({ 'change': self.setChangeCheckBoxCallback.bind(self) })
           //.setCustomRowCell('CHK2', this.setCheckedCellGrid.bind(this))
           .setCustomRowCell('USERID', this.setGridDataLink.bind(this))
           .setCustomRowCell('USERNAME', this.setGridDataLink.bind(this))

           .setPagingUse(true)
           .setPagingRowCountPerPage(100)
           .setPagingUseDefaultPageIndexChanging(true);

        contents.addGrid("dataGrid", grid);
    },

    // Footer Setting
    // Thiết lập phần cuối
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(), ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    onColumnSortClick: function (e, data) {
        this.searchFormParameter.PARAM = this.header.getControl("txtSearchText").getValue();
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // Event Load Complete
    // Sự kiện tải trang hoàn thành
    onLoadComplete: function (event) {
        if (!$.isNull(this.keyword))
            this.header.getControl("txtSearchText").setValue(this.keyword);
        if (!event.unfocus)
            this.header.getControl("txtSearchText").setFocus(0);
    },

    // Event Grid Render Complete
    // Sự kiện lưới được tải 
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        if (data.totalDataCount == 1) {
            var obj = {}, d = data.dataRows[0];
            var message = {
                searchCompanyInfo: {
                    COM_CODE: userIds[0].COM_CODE,
                    COM_DES: userIds[0].COM_DES,
                    DB_CON_FLAG: userIds[0].DB_CON_FLAG,
                },
                name: "USERNAME",
                code: "USERID",
                data: d,
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    // Apply button click event
    // Sự kiện click nút Apply
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().grid.getCheckedCustomRowDatas("CHK2"),
            userIds = new Array();

        for (var i = 0; i < selectedItem.length; i++) {
            userIds.push(selectedItem[i].rowItem);
        }

        if (userIds.length == 0) {
            ecount.alert(ecount.resource.MSG00598);
            return false;
        }

        var message = {
            searchCompanyInfo: {
                COM_CODE: userIds[0].COM_CODE,
                COM_DES: userIds[0].COM_DES,
                DB_CON_FLAG: userIds[0].DB_CON_FLAG,
            },
            name: "USERNAME",
            code: "USERID",
            data: userIds,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    // Close button click event
    // Sự kiện click nút Close
    onFooterClose: function () {
        this.close();
        return false;
    },

    // Event button ENTER click
    // Sự kiện ENTER được nhấn
    ON_KEY_ENTER: function (e, target) {
        this.searchFormParameter.PARAM = this.header.getControl("txtSearchText").getValue();
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // Event button F8 click
    // Sự kiện F8 được nhấn
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    // Set value for [Link] column
    // Thiết lấp giá trị cho cột Link
    setGridDataLink: function (value, rowItem) {
        var option = {};
        var self = this;
        if ($.isEmpty(rowItem.USERNAME)) {
            rowItem.USERNAME = rowItem.USERID;
            option.data = rowItem.USERNAME;
        }
        option.controlType = "widget.link";

        if (rowItem.PER_TYPE == '1')
            option.parentAttrs = { 'class': 'danger' };

        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                var message = {
                    searchCompanyInfo: {
                        COM_CODE: data.rowItem.COM_CODE,
                        COM_DES: data.rowItem.COM_DES,
                        DB_CON_FLAG: data.rowItem.DB_CON_FLAG,
                    },
                    name: "USERNAME",
                    code: "USERID",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        }
        return option;
    },

    setChangeCheckBoxCallback: function (e, data) {
        var self = this;
        var gridObject = self.contents.getGrid().grid;
        var currentInPartList = gridObject.getRowList()
        for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
            var dataKey = currentInPartList[i];
            var isChecked = gridObject && gridObject.isChecked(data.rowKey);
            gridObject && gridObject.setCell("CHK2", dataKey['K-E-Y'], isChecked);
        }
        gridObject.checkAllCustom('CHK2', gridObject.isChecked(data.rowKey));
    },

    // Set background color 
    setRowBackgroundColor: function (data) {
        if (data['PER_TYPE'] == "1") return true;
    },
});