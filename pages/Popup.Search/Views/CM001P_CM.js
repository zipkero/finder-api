window.__define_resource && __define_resource("LBL02870","LBL80067","LBL16458","LBL06434","LBL02282","BTN00113","BTN00351","LBL35194","MSG02158","BTN00043","BTN00069","BTN00008","LBL05604","LBL01780","BTN00603","LBL06542","MSG00141","LBL00381","LBL00359","LBL07438","LBL07447","LBL17437","LBL02863","LBL00703","LBL01706","LBL12437","LBL09999","LBL02869","LBL93030","LBL03832");
/****************************************************************************************************
1. Create Date : 2016.09.07
2. Creator     : Truong Quang Duyet
3. Description : [From merchant account - calltype: 0] - [Credit Card - calltype: 108]
4. Precaution  : 
5. History     : CM/CM100P.aspx 
                 - Add more function search for Credit Card
                 2017.12.05 (Hao) Remove code unused
                 2019.06.11 (NguyenDucThinh) A18_04171 Update resource
                 2019.06.13 (Ngo Thanh Lam) Fix error reload grid after save
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM001P_CM", {

    titlePage: ecount.resource.LBL02870,                    // Define title page (Định nghĩa tiêu đề trang)

    lblCode: "",                                            // Define title for column code (Định nghĩa tiêu đề cho cột mã)

    lblName: "",                                            // Define title for column name (Định nghĩa tiêu đề cho cột tên)

    columnsUse: null,                                       // Define column is use (Định nghĩa cột sử dụng)

    urlPage: '/Account/CashIn/GetInfoMerchantAccount',      // Define url when call Api for grid (Định nghĩa đường dẫn dữ liệu cho trang) 

    /********************************************************************** 
    * page init (Phần khởi tạo trang)
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        //결제대행사 호출하는 경우 Title 변경
        if (this.CALL_TYPE == 20) {
            this.titlePage = String.format(ecount.resource.LBL80067, ecount.resource.LBL16458);
        }

        this.columnsUse = new Array();
        // Init properties (Khỏi tạo thuộc tính)
        this.initProperties();
        // Define content for page (Định nghĩa nội dung cho trang)
        this.fnDefineContentForPage();
    },

    // Init properties (Khởi tạo tham số)
    initProperties: function () {
        this.searchFormParameter = {
            CODE_CLASS: this.custGroupCodeClass
            , PARAM: this.keyword != null ? this.keyword : ""
            , PARAM_CODE: ''
            , PARAM_KEYWORD: ''
            , IO_TYPE: '00'
            , PAGE_SIZE: 0
            , PAGE_CURRENT: 0
            , DEL_FLAG: 'N'
            , CALL_TYPE: this.CALL_TYPE
            , GYE_CODE: this.GYE_CODE
            , PROD_SEARCH: '9'
            , ACC002_FLAG: this.CALL_TYPE ? 'Y' : 'N'
            , EMP_FLAG: 'N'
            , SORT: ''
            , SORT_TYPE: ''
        };
        this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL02282);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    // Event init header (Sự kiện khởi tạo phần tiêu đề)
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        // TODO: Undo comment for param [isIncludeInactive] when necessary
        // When [isIncludeInactive] is use then check logic for page

        //if (this.isIncludeInactive) {

        // Add control for toolbar
        toolbar.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))
        //if (this.isIncludeInactive && this.searchFormParameter.USE_GUBUN == "Y") {
        if (this.isIncludeInactive) {
            toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        }
        // Add template for tab advanced search
        form1.add(ctrl.define("widget.input.codeName", "custCode", "custCode", this.lblCode).end())
            .add(ctrl.define("widget.input.codeName", "custName", "custName", this.lblName).end())
            .add(ctrl.define("widget.input.codeName", "keywordsearch", "keywordsearch", ecount.resource.LBL35194).end())
        contents.add(form1);    // add template for popup search
        contents.add(toolbar);  // add toolbar for popup search
        header.setTitle(this.titlePage).add("search").useQuickSearch()  // add button search 
            .addContents(contents);
        //}
    },

    // Event init contens (Sự kiện khởi tạo phần nội dung)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.LoadDataForPage)
            .setRowDataUrl(this.urlPage)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CUST', 'CUST_NAME'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns(this.columnsUse)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG02158, e));
            })
            .setColumnSortDisableList(["COST_RATE", "REMARKS_WIN"])
            .setCustomRowCell('CUST', this.setGridDataForCustLink.bind(this))           // Link for col [cust]
            .setCustomRowCell('CUST_NAME', this.setGridDataFroCustNameLink.bind(this))  // Link for col [cust_name]            
            .setCustomRowCell('type_gubun', this.setContentForType.bind(this))               // Change content for col [type]
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true)
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setCheckBoxMaxCount(this.checkMaxCount || 100);
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    // Event init footer (Sự kiện khởi tạo phần cuối trang)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [10];

        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(ecount.resource.BTN00043));

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else
            keyHelper.push(11);

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).css("btn btn-default"));
        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
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

    // Function reload
    fnReload: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        this.header.getQuickSearchControl().setFocus(0);
        if (e != undefined) {
            var grid = this.contents.getGrid();
            grid.getSettings().setHeaderTopMargin(this.header.height());
            grid.draw(this.searchFormParameter);
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    // Event column sort click (Sự kiện sắp xếp danh sách)
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // Function set data for cell grid (Chức năng gán dữ cho từng dòng trên lưới)
    setGridDataForCustLink: function (value, rowItem) {
        return this.fnSetInfoForCol("CUST", value, rowItem);
    },

    // Function set data for cell grid (Chức năng gán dữ cho từng dòng trên lưới)
    setGridDataFroCustNameLink: function (value, rowItem) {
        return this.fnSetInfoForCol("CUST_NAME", value, rowItem);
    },

    // Set info for column (Gán thông tin cho cột)
    fnSetInfoForCol: function (_col, valueCell, _rowItem) {
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "CUST_NAME",
                    code: "CUST",
                    data: data.rowItem,
                    callback: this.close.bind(this) // Close popup when handle complete
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    // Set control type for cell (Gán loại control cho ô)
    fnSetControlTypeForCell: function (col) {
        var _controlType = "";
        switch (col) {
            case "CUST":
                _controlType = "widget.link";
                break;
            case "CUST_NAME":
                _controlType = ['0'].contains(this.CALL_TYPE) ? "widget.link" : "";
                break;
        }
        return _controlType;
    },


    // Set content for type
    setContentForType: function (value, rowItem) {
        var option = {};
        option.data = ['8'].contains(rowItem.TYPE_GUBUN) ? ecount.resource.LBL05604 : ecount.resource.LBL01780;
        return option;
    },

    // Set row backgroud color (Gán màu cho dòng)
    setRowBackgroundColor: function (data) {
        // Check condition for set row backgroud color
        if (data.DEL_FLAG == 'Y')
            return true // Is enable color
        else
            return false; // Is disable color
    },

    // Event grid render complete (Sự kiện khi tải lưới thành công) 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1) {
            var message = {
                name: "CUST_NAME",
                code: "CUST",
                data: data.dataRows[0],
                isAdded: false,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.controlID = 'card_corp';
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // Message Handler (Xử lý tin nhắn trả về)
    onMessageHandler: function (page, message) {

        if (["EBA008M", "EBA010M"].contains(page.pageID)) {
            this.header.getQuickSearchControl().setValue(message.businessNo);
            this.searchFormParameter.PARAM = message.businessNo;
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
            this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

            this.contents.getGrid().draw(this.searchFormParameter);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    // Event button before 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    // Event buttton apply (Sự kiện nút xác nhận)
    onFooterApply: function (e) {
        /*
            Addition code for button apply
        */
    },

    // Event button close (Sự kiến nút tắt)
    onFooterClose: function () {
        this.close();
        return false;
    },

    // Event button modify (Sự kiện nút chỉnh sửa)
    onFooterModify: function () {
        /*
            Add another code for function
        */
    },

    // Event button pre
    onFooterPre: function () {
        var listFlag = "Search";
        this.onComeAndGoListToSearch(listFlag);
    },

    // Event header search (Sự kiện nút tìm kiếm đầu trang)
    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    // Event handle button [Inactive]
    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y") {
            // Change button to Include
            this.searchFormParameter.DEL_FLAG = "N";
            this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        }
        else {
            // Change button to Exclude
            this.searchFormParameter.DEL_FLAG = "Y";
            this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        }
        this.onContentsSearch('usegubun');
    },

    // Function search (Chức năng tìm kiếm)
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var _custName = "";
        var _custCode = "";
        var _custKeyword = "";

        _custName = this.header.getControl("custName").getValue();
        _custCode = this.header.getControl("custCode").getValue();
        _custKeyword = this.header.getControl("keywordsearch").getValue();
        if (_custName != "" || _custCode != "" || _custKeyword != "") {
            this.searchFormParameter.PARAM = _custName;
            this.searchFormParameter.PARAM_CODE = _custCode;
            this.searchFormParameter.PARAM_KEYWORD = _custKeyword;
            this.searchFormParameter.PROD_SEARCH = '1'
        } else {
            this.searchFormParameter.PARAM = "";
            this.searchFormParameter.PROD_SEARCH = '9'
        }

        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    // Event quick search (Tìm kiếm nhanh)
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // Event button search setting (Sự kiện nút tìm kiếm cài đặt)
    onDropdownSearchTemplate: function () {
        if (this.viewBag.Permission.CUST.Value == "W") {
            var param = {
                width: 650,
                height: 170,
                SEARCH_TYPE: "CUST",
                isOpenPopup: true
            };

            this.openWindow({
                //url: '/ECMain/CM3/CM100P_01.aspx?GUBUN=CUST',
                url: "/ECERP/Popup.Search/CM100P_01",
                name: ecount.resource.LBL06542,
                param: param,
                popupType: false,
                additional: false,
                fpopupID: this.ecPageID
            });
        }
        else {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
    },

    // Define content for page (Định nghĩa nội dung cho trang)
    fnDefineContentForPage: function () {

        // Set resource for page
        switch (this.CALL_TYPE) {
            case '0':
                this.lblCode = ecount.resource.LBL00381;
                this.lblName = ecount.resource.LBL00359;
                break;
            case '20':
                this.lblCode = String.format(ecount.resource.LBL07438, ecount.resource.LBL16458);
                this.lblName = String.format(ecount.resource.LBL07447, ecount.resource.LBL16458);
                break;
            default:
                this.lblCode = ecount.resource.LBL17437;
                this.lblName = ecount.resource.LBL02863;
                break;
        }


        // Set default columns (Gán cột mặc định) ecount.resource.LBL00703
        this.columnsUse.push(
            { propertyName: 'CUST', id: 'CUST', title: this.lblCode, width: '' },
            { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: this.lblName, width: '' }
        );
        // TODO: set columns by CALL_TYPE [0: Merchant Account] - [108 - Credit Card]
        if (['0'].contains(this.CALL_TYPE)) {
            this.columnsUse.push({ propertyName: 'COST_RATE', id: 'COST_RATE', title: ecount.resource.LBL01706, width: '' });
        } else if (['108'].contains(this.CALL_TYPE) || ['106'].contains(this.CALL_TYPE)) {
            this.columnsUse.push(
                { propertyName: 'type_gubun', id: 'type_gubun', title: ecount.resource.LBL00703, width: '', align: 'center' }
            );
            // Set title for page (Xét tiêu đề cho trang)
            this.titlePage = ecount.resource.LBL12437;
            this.urlPage = '/Account/CashOut/GetDataCreditCard' // Api get data Credit Card (Api lấy dữ liệu danh sách thẻ tín dụng)
        }
    },

    // New Event 
    onFooterNew: function (cid) {
        if (['U', 'W'].contains(this.viewBag.Permission.CUST.Value)) {
            if (['108'].contains(this.CALL_TYPE) || ['106'].contains(this.CALL_TYPE)) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 385,
                    editFlag: "I",
                    CODE_CLASS: "S10",
                    CLASS_DES: "",
                    isCloseDisplayFlag: true,
                    popupType: true,
                };
                // false : Modal , true : pop-up
                this.openWindow({
                    url: '/ECERP/EBA/EBA008M',
                    name: String.format(ecount.resource.LBL09999, ecount.resource.LBL01780),
                    additional: false,
                    param: param
                });
            } else {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 425,
                    editFlag: 'I',
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/EBA/EBA010M',
                    name: String.format(ecount.resource.LBL09999, ecount.resource.LBL02869),
                    param: param,
                    popupType: false,
                    additional: false
                });
            }
        }
        else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: (['108'].contains(this.CALL_TYPE) || ['106'].contains(this.CALL_TYPE) ? ecount.resource.LBL93030 : ecount.resource.LBL03832), PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    /********************************************************************** 
    *  Keyboard [f1~12] 
    **********************************************************************/
    // ON_KEY_F2
    ON_KEY_F2: function () {
        /*
            Add another code for function
        */
        this.onFooterNew();
    },

    // ON_KEY_F8
    ON_KEY_F8: function () {
        /*
            Add another code for function search
        */
        this.onContentsSearch('button');
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    }
});
