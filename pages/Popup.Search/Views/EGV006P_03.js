window.__define_resource && __define_resource("LBL06816","BTN00493","BTN00070","BTN00008","BTN00035","MSG05178","MSG00213","MSG04944","MSG00205","LBL02533","LBL02354","MSG00590","LBL01303","MSG00588","MSG00589","LBL06642");
/****************************************************************************************************
1. Create Date : 2016.08.03
2. Creator     : Nguyen Minh Thien
3. Description : List Ref. Post
4. Precaution  : 
5. History     : 2017.07.03 (SON) - modify return data 
               : 2019.01.03 Ngọc Hân A18_04272 - FE 리팩토링_페이지 일괄작업 (Remove $el at function onFocusOutHandler)
                 [2019.05.07][On Minh Thien] A19_01514 (간편검색 공통화 적용 추가작업)
                 2019.06.05 (PhiTa) - A19_01764_참조에서 게시글수정시 무한로딩
*******************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGV006P_03", {

    /**************************************************************************************************** 
     * user opion Variables(Khai báo biến người dùng và các đối tượng) 
     ****************************************************************************************************/
    isMoreFlag: false,      // Flag if record are more than count (đánh dấu nếu số dòng lớn hơn chỉ định)
    baseCount: 10,        // 1000 case checked (kiểm tra trường hợp 1000 dòng)
    maxCount: 100,        // 10000 case checked (kiểm tra trường hợp 10000 dòng)   
    defaultSearchParam: null, // default param search (tham số tìm kiếm mặc định)
    finalSearchParam: null, // final param search (tham số tìm kiếm cuối cùng)
    finalHeaderSearch: null, // search constrol (thông tin control tìm kiếm)
    isShowSearchBtn: true, // search button visible flag (cờ nút tìm kiếm)
    isShowOptionBtn: false, // Option button visible flag (cờ nút option)
    saleAutoCodeInfo: null,
    gridWidth: 650,
    titlePage: null,                // excel title(Tiêu đề excel)
    printPageSet: {                 //print setting(Thiết lập in)
        printCss: ""
    },
    pdfHtml: null,                  //pdf setting(Thiết lâp pdf)
    printHtml: null,
    viewBagDatas: null,
    toDay: null,
    baseDateExpectFrom: {
        year: "",
        month: "",
        day: ""
    },

    baseDateExpectTo: {
        year: "",
        month: "",
        day: ""
    },
    objectSend: null,
    nameSend: "",
    isResetUpdatedSlip: false,
    maxCnt: 0,
    inputFormDetail: null,
    isLoaded: false, // Check action search (Kiểm tra hoạt động tìm kiếm)
    refList: "",     //"IO_DATE"-"IO_NO" / "IO_TYPE
    refObj: "",     //"IO_DATE"-"IO_NO" / "IO_TYPE
    splitFlag: "ㆍ",          // 분리자   
    versionList: "",          // Version
    selectedCnt: 0,
    countVoucherList: 0,
    checkMaxCount: 0,
    boardName: "",
    mnuType: "",

    /**************************************************************************************************** 
    * page initialize(Khởi tạo trang)
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {

        this._super.init.apply(this, arguments);
        this.initProperties();
        this.inputFormDetail = this.formViewInput;
        // 1:OPEN, 2:CLOSE, 3:NONE([1: mở, 2:Đóng, 3:Không hiển thị])
        if (this.isShowSearchForm == null) {
            this.isShowSearchForm = "1";
        }

        if (this._userParam) {
            this.isShowSearchForm = this._userParam.isShowSearchForm;
        }
    },

    initProperties: function () {
        this.defaultSearchParam = {
            BOARD_CD: this.BOARD_CD
            //, GWBD_BOARD_CD: this.GWBD_BOARD_CD
            , BOARD_SEQ: this.BOARD_SEQ
            , REF_BOARD_CD: this.REF_BOARD_CD
            , PAGE_SIZE: 20
            , SORTCOL_INDEX: 0
            , SORT_TYPE: 'A'
            , ISMORE_FLAG: "N"
            , COLID: ''
            , QUICKSEARCH: ''
        };  // search param(검색 조건)
        this.finalSearchParam = {
            RPT_GUBUN: this.RPT_GUBUN
            , QUICKSEARCH: ''
        };     // 조회시 search_param

        debugger;
        this.cntERPMappingList = this.countERPMapping || 0;
        this.boardName = this.BoardInfomation.BOARD_NM || "";
        this.mnuType = this.BoardInfomation.MENU_TYPE || "";
        this.checkMaxCount = 20 - this.cntERPMappingList;
        this.viewBagDatas = {};
    },

    render: function () {

        if (this.isOpenPopup) {
            this.resizeLayer(this.width = ecount.infra.getPageWidthFromConfig());
        }
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    *Thiết lập giao diện
    ****************************************************************************************************/
    // Set up header, search form
    // Thiết lập phần header, form tìm kiếm
    onInitHeader: function (header) {

        var self = this;
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();
        toolbar
           .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
           .search("search", null, "list")
        tabContents
            .onSync()
            .setType(this.formType)
            .setOptions({
                showFormLayer: this.isShowSearchForm == "1" ? true : false,
                css: "hide"
            })
            .filter(function (control) {
            });

        contents.add(tabContents).add(toolbar);
        var title = ecount.resource.LBL06816;
        header.notUsedBookmark();
        header.setTitle(title)
            .useQuickSearch(false)
            .add("search", null, this.isShowSearchBtn)
            .add("option", [{ id: "searchTemplate", label: ecount.resource.BTN00493 }], !this.isShowOptionBtn)//
            .addContents(contents);

        if (this.isShowSearchForm == "3") {
            header.disable();
        }
    },
    // Set up grid
    // Khởi tạo lưới
    onInitContents: function (contents) {
        contents.addGrid("gird-" + this.pageID, null);
    },
    // Set up footer
    // Khởi tạo footer
    onInitFooter: function (footer) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var res = ecount.resource;
        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00070).end())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        //btnList.push(ctrl.define("widget.button", "Delete").label(ecount.resource.BTN00035).end());
        footer.add(toolbar);

        if (this.isShowSearchForm == "3") {
            footer.disable();
        }
    },
    // set default value for search controls
    // khởi tạo giá trị mặc định cho các search controls
    onInitControl: function (cid, control) {
    },

    // set default value for search controls
    // khởi tạo giá trị mặc định cho các search controls
    onInitControl_Submit: function (cid, control) {
    },
    /**************************************************************************************************** 
    * define common event listener
    * Định nghĩa sự kiện chung
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onHeaderRewrite: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },
    // Load complete (Tải trang thàng công)
    onLoadComplete: function (e) {

        if (this.__ecParam__) {     // When calling
            for (var cid in this.__ecParam__) {
                var control = this.header.getControl(cid, "all");
                if (cid === "txtSProdCd" || cid === "txtSCustCd") {
                    control.addCodes(this.__ecParam__[cid], true);
                } else if (cid === "ddlSYear") {
                    control.setDate(this.__ecParam__[cid]);
                }
            }
        }

        if (this._userParam) {    // When you come back after moving to another page

            //this.header.getControl("formList").setValue(this._userParam.C_formSer);
            this.header.getQuickSearchControl().setValue(this._userParam.C_QUICKSEARCH);
            this.defaultSearchParam.SORTCOL_INDEX = this._userParam.C_SORTCOL_INDEX;
            this.defaultSearchParam.SORT_TYPE = this._userParam.C_SORT_TYPE;
            this.defaultSearchParam.QUICKSEARCH = this._userParam.C_QUICKSEARCH;
            this.defaultSearchParam.COLID = this._userParam.C_COLID;
            this.isMoreFlag = this._userParam.C_MoreFlag;
            this.header.getQuickSearchControl().show();
            this.isResetUpdatedSlip = true;
            this.dataSearch();
        } else {
            // this.header.getControl("cbRptConfirm", "all").get(0).setValue(0, ecount.config.company.RPT_CONFIRM == "Y" ? true : false, true);
        }
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }


    },

    onChangeControl: function (control, data) {
        var self = this;

    },

    //On popup handler(Xử lý khi chọn widget mở popup)
    onPopupHandler: function (control, param, handler) {
        switch (control.id) {
            default:
                break;
        }
        handler(parameter);
    },
    // Message handler (Xử lý thông tin do popup gởi về)
    onMessageHandler: function (page, data) {
        switch (page.pageID) {
            case "ESC001P_31_02":
                data.callback && data.callback();
                this.reloadPage();
                break;
        }
    },
    // Focus Out handler
    onFocusOutHandler: function () {
        var ctrl = this.header.getControl("search");
        ctrl && ctrl.setFocus(0);
    },

    /**************************************************************************************************** 
    * define action event listener(Định nghĩa cách sự kiện cho lưới)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    // Grid Cycle-Life
    // Event grid init (Sự kiện khởi tạo lưới)
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    // Grid render complete (Tải lưới thành công)
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);

        this.header.getQuickSearchControl().hide();

        var rowCnt = this.contents.getGrid("gird-" + this.pageID).getSettings().getPagingTotalRowCount();
        this.maxCnt = rowCnt; // get max cnt 
        //if (rowCnt >= this.baseCount && this.isMoreFlag == false)
        //    this.footer.getControl('MoreData').show();

        if (rowCnt > this.maxCount && this.isMoreFlag == true)
            ecount.alert(ecount.resource.MSG05178);
        if (this.__ecOpenPopup == "0" || this.isShowSearchForm == "1") {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    // Grid after row data load (Sau khi dòng dữ liệu trên lưới được tải)
    onGridAfterRowDataLoad: function (e, data) {
        var gridObj = this.contents.getGrid("gird-" + this.pageID),
         settings = gridObj.grid.settings();

    },

    onHeaderSimpleSearch: function (e) {
        this.onHeaderSearch();
    },
    onHeaderQuickSearch: function (e) {
        var grid = this.contents.getGrid("gird-" + this.pageID);
        this.isMoreFlag = false;
        this.header.lastReset(this.finalHeaderSearch);
        this.finalSearchParam.PAGE_SIZE = this.baseCount;
        this.finalSearchParam.ISMORE_FLAG = "N";
        this.finalSearchParam.QUICKSEARCH = e.keyword;
        this.cDateNo = '';
        grid.getSettings().setPagingCurrentPage(1); //Paging Page 1
        grid.draw(this.finalSearchParam);
    },

    onHeaderSearch: function (forceHide) {

        var isError = false;
        var invalid = this.header.validate("all", true);

        // When user input special characters prevent the search
        if (invalid.result.length > 0) {
            var targetControl;
            var invalidControl = this.header.getControl(invalid.result[0][0].control.id);
            if (invalidControl) {
                targetControl = invalidControl;
            } else {
                this.header.changeTab(invalid.tabId, true);
                targetControl = invalid.result[0][0].control;
            }
            this.header.toggleContents(true, function () {
                targetControl.setFocus(0);
            });
            targetControl.setFocus(0);
            return;
        }

        var self = this;

        this.header.getQuickSearchControl().setValue('');

        if (!this._userParam)
            self.isMoreFlag = false;

        this.isResetUpdatedSlip = true;
        if (self.dataSearch() && !isError) {

            if (!self._userParam)
                self.header.toggle(forceHide);
        }

        // Reset [Sorting] information
        this.finalSearchParam.SORTCOL_INDEX = 0;
        this.finalSearchParam.COLID = '';
        this.finalSearchParam.SORT_TYPE = 'A';

        this.header.getButton("search").show();
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    onFooterApply: function () {
        var lstNo = '';
        var selectItem = this.contents.getGrid().grid.getChecked();
        this.selectedCnt = selectItem.length;
        if (this.selectedCnt > 0) {
            this.getSelectedItemsForApply(selectItem);  // 선택된 데이타 정보 Get
            if (this.refList.length > 0) {
                this.objectSend = $.extend({ BOARD_NM: this.boardName }, selectItem);
                //this.callApplyListApi(this.refList, this.defaultSearchParam.BOARD_CD, this.defaultSearchParam.BOARD_SEQ, this.defaultSearchParam.REF_BOARD_CD, this.objectSend);
                this.sendMessage(this, {
                    Data: selectItem,
                    BOARD_NM: this.boardName,
                    type: "05"
                });

                this.close();
            }
        }
        else {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }
    },
    callApplyListApi: function (Data, BoardCd, BoardSeq, RefBoardCd, ObjData) {
        var formData = this.setListApiJsonData(Data, BoardCd, BoardSeq, RefBoardCd);
        var self = this;
        var gridObj = self.contents.getGrid().grid;
        self.showProgressbar(true);
        ecount.common.api({
            url: "/Groupware/IntegratedBoard/InsertRefPostList",
            data: formData,
            success: function (result) {
                //debugger;
                if (result.Status == "200") {
                    var message = {
                        name: self.boardName,
                        code: "",
                        data: ObjData,
                        isAdded: false,
                        addPosition: "current"
                    };
                    self.sendMessage(self, message);
                }
            },
            complete: function () {
                self.close();
            }
        });
    },
    setListApiJsonData: function (Data, BoardCd, BoardSeq, RefBoardCd) {
        var refApplyListJsonString = "";
        var refApplyLists = [];
        var refApplyobj = [];

        $.each(Data.split("ㆍ"), function (i, val) {
            refApplyLists.push({
                BOARD_CD: BoardCd,
                BOARD_SEQ: BoardSeq,
                REF_BOARD_CD: RefBoardCd,
                REF_BOARD_SEQ: val,//.split("-")[1]
            })
        });

        // debugger;
        // this.objectSend = $.isNull(refApplyobj) == false ? refApplyobj[0] : null;

        data = Object.toJSON(refApplyLists);
        return data;
    },
    getSelectedItemsForApply: function (selectItem) {
        var self = this;
        self.setClear();
        $.each(selectItem, function (i, data) {
            self.refList += data.BOARD_SEQ + self.splitFlag;
            self.refObj += data.BOARD_NM + self.splitFlag + "-" + data.BOARD_NUM + self.splitFlag + "-" + data.TITLE + self.splitFlag;
        });

        self.refList = self.refList.substring(0, self.refList.length - 1);
        self.refObj = self.refObj.substring(0, self.refObj.length - 1);

        return selectItem.length;
    },
    setClear: function () {
        this.refList = "";
        this.refObj = "";
    },

    /**************************************************************************************************** 
    *  define hotkey event listener(Định nghĩa sự kiện phím tắt)
    ****************************************************************************************************/
    ON_KEY_F8: function () {
        window.focus();
        this.header.getControl("search").setFocus(0);
        this.onHeaderSearch(true);


    },

    reloadPage: function () {
        var self = this;
        if (self.isLoaded) {
            var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);
            self.finalHeaderSearch = this.header.extract("all").merge();  // 조회 당시 컨트롤 정보   
            this.onAllSubmitSelf({
                url: "/ECERP/EBZ/EGM0025P_04",
                formdata: self.finalHeaderSearch,
                _userParam: {
                    C_param: searchParam,
                    C_FINALHEADER: self.finalHeaderSearch,
                    C_QUICKSEARCH: self.finalSearchParam.QUICKSEARCH,
                    // C_formSer: self.header.getControl("formList").getValue(),
                    C_SORTCOL_INDEX: self.finalSearchParam.SORTCOL_INDEX,
                    C_SORT_TYPE: self.finalSearchParam.SORT_TYPE,
                    C_COLID: self.finalSearchParam.COLID,
                    C_MoreFlag: self.isMoreFlag,
                    C_SearchMode: self.searchMode,
                    C_DATE_NO: self.cDateNo,
                    C_isLoaded: self.isLoaded
                }
            });
        }
        else {
            document.location.href = document.location.href;
        }
    },

    /**************************************************************************************************** 
    * define user function (Hàm do người dùng định nghĩa)
    ****************************************************************************************************/

    dataSearch: function (e) {

        var res = ecount.resource;
        var settings = widget.generator.grid();
        var gridObj = this.contents.getGrid("gird-" + this.pageID);

        var searchParam = $.extend({}, this.defaultSearchParam, this.header.serialize("all").result);
        this.finalHeaderSearch = this.header.extract("all").merge();

        //searchParam.FORM_SER = this.header.getControl("formList").getValue();

        if (this.isMoreFlag) {
            searchParam.PAGE_SIZE = this.maxCount;
            searchParam.ISMORE_FLAG = "Y";
        } else {
            searchParam.PAGE_SIZE = this.baseCount;
            searchParam.ISMORE_FLAG = "N";
        }

        if (searchParam.FORM_SER == "") {
            ecount.alert(res.MSG04944);
            return false;
        }
        searchParam.QUICKSEARCH = this.header.getQuickSearchControl().getValue();

        if (this._userParam)
            this.finalSearchParam.QUICKSEARCH = this._userParam.C_QUICKSEARCH;

        /************************************************************
  
          ************************************************************/
        //-----------------------------------------------
        // 1.Title Create Start
        //-----------------------------------------------             
        var isError = false;
        var param = {
            customer: '',
            gyeCode: '',
            project: '',
            site: '',
            dateFrom: searchParam.BASE_DATE_FROM,
            dateTo: searchParam.BASE_DATE_TO
        };
        var searchConditionTitle = ecount.document.getSearchConditionTitle("account", param);
        var rightHtml = searchConditionTitle.period;

        //Columns Handle
        var columns = [];

        //그리드 하단 오른쪽  (grid right of bottom)        
        settings
            .setHeaderTopMargin(this.header.height())
            .setHeaderTopRightHTML(rightHtml)
            .setKeyColumn(['A0'])
            .setHeaderFix(false)
            .setColumnFixHeader(true)
            .setPagingUseDefaultPageIndexChanging(false)
            .setStyleBoldOnMergeRow(true)
            .setEmptyGridMessage(res.MSG00205);
        columns = [
            { propertyName: 'BOARD_NUM', id: 'BOARD_NUM', width: '', align: 'left', fontSize: 11, title: 'No.' },
            { propertyName: 'TITLE', id: 'TITLE', width: '', align: 'left', fontSize: 11, title: ecount.resource.LBL02533 },
            { propertyName: 'WRITER_NAME', id: 'WRITER_NAME', width: '', align: 'left', fontSize: 11, title: ecount.resource.LBL02354 },
        ];
        settings.setRowDataUrl('/Groupware/IntegratedBoard/GetListRefPostForSearch')
                .setColumnSortable(false)
                .setCheckBoxUse(true)
                .setPagingUse(true)
                .setCheckBoxRememberChecked(true) // remember checkbox(Nhớ các dòng đã đánh đấu)
                .setCheckBoxMaxCount(this.checkMaxCount)
                .setCheckBoxMaxCountExceeded(function (e) {
                    ecount.alert(String.format(ecount.resource.MSG00590, ecount.resource.LBL01303, 20));
                })
                .setPagingUseDefaultPageIndexChanging(true)
                .setCustomRowCell('TITLE', this.setGridDateLinkDetail.bind(this))
                .setColumns(columns);

        this.finalSearchParam = searchParam;
        this.finalSearchParam.Columns = columns;

        if (this.IsShowSearchForm == "3") {
            settings.setHeaderTopMargin(100);
        }

        gridObj.setSettings(settings);
        gridObj.draw(this.finalSearchParam);
        this.isLoaded = true;

        if (this.searchMode) this.searchMode = "";
        this.header.getButton("search").show();

        return true;
    },
    setGridItemValue: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.label";
        option.data = this.boardName;

        return option;
    },
    setGridDateLinkDetail: function (value, rowItem) {
        var option = {};
        var dataparam = {};
        var params = {},
            param = "",
            url = "",
            name = "";
        // option.data = this.boardName;
        var selfThis = this;
        option.dataType = "1";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {

                var authYN = "N";

                if (!$.isNull(data.rowItem.BOARD_SEQ))
                    authYN = "Y";

                if (data.rowItem.TITLE == "") {
                    ecount.alert(ecount.resource.MSG00588)
                    return;
                }
                //if (authYN != "Y" || this.viewBag.InitDatas.USER_FLAG != "E" && this.viewBag.InitDatas.USER_FLAG != "M") {
                //    ecount.alert(ecount.resource.MSG00589)
                //    return false;
                //}
                var xxx = ecount.config.user.SLIP_AUTH_TYPE;
                if (this.mnuType == "S" || this.mnuType == "M" || this.mnuType == "C") {
                    url = "/ECERP/EGM/EGM026M";
                    params.BOARD_CD = data.rowItem.BOARD_CD;
                    params.BOARD_SEQ = data.rowItem.BOARD_SEQ;
                    params.MENU_TYPE = this.mnuType;
                    params.BOARD_TYPE = 'N';
                    params.FORM = "MSG";
                    name = data.rowItem.BOARD_NM;
                    params.width = 800;
                    params.height = 600;
                    params.popupflag = 'Y';

                    this.openWindow({
                        url: url,
                        name: name,
                        param: params,
                        popupType: true,
                        fpopupID: this.ecPageID,
                    });
                    e.preventDefault();
                }

            }.bind(this)
        };
        return option;
    },
    _ON_REDRAW: function (editDateNo) {

        this._super._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }
        this.setReload((param && param.editDateNo || ""));
    },

    // Reload grid(Load lại lưới)
    setReload: function (editDateNo) {
        this.cDateNo = "";
        if ($.isEmpty(editDateNo) == false) {
            this.cDateNo = editDateNo;
        }
        this.contents.getGrid("gird-" + this.pageID).draw(this.finalSearchParam);
    },

    onSimpleSearchSetting: function (e) {
        this.openWindow({
            url: '/ECERP/ESC/ESC001P_31_02',
            popupID: 'simpleMenu',
            name: ecount.resource.LBL06642,             // 간편검색
            additional: true,
            param: {
                height: 600,
                PRG_ID: e.PRG_ID,
                POPUP_CD: e.POPUP_CD,
                menuSeq: e.MENU_SEQ,
                isNotShowRemain: true
            }
        });
    },
});