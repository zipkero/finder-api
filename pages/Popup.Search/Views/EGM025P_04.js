window.__define_resource && __define_resource("LBL04686","BTN00493","LBL09298","BTN00070","BTN00008","MSG05178","MSG00213","MSG04944","MSG00205","LBL03614","LBL02502","LBL00329","LBL01492","MSG00908","LBL06642");
/****************************************************************************************************
1. Create Date : 2016.7.27
2. Creator     : Nguyen Minh Thien
3. Description : List Ref. Voucher
4. Precaution  : 
5. History     : 2017.07.03 (SON) - modify return data 
               : 2019.01.03 Ngọc Hân A18_04272 - FE 리팩토링_페이지 일괄작업 (Remove $el at function onFocusOutHandler)
                 [2019.04.23][On Minh Thien] A19_01342 (간편검색 공통화 적용 누락 페이지 재요청)
*********************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGM025P_04", {

    /**************************************************************************************************** 
       * user opion Variables(Khai báo biến người dùng và các đối tượng) 
       ****************************************************************************************************/
    isMoreFlag: false,      // Flag if record are more than count (đánh dấu nếu số dòng lớn hơn chỉ định)
    baseCount: 10,        // 1000 case checked (kiểm tra trường hợp 10 dòng)
    maxCount: 100,        // 10000 case checked (kiểm tra trường hợp 100 dòng)   
    formTypeCode: 'GN050', //Form Type(양식 타입)
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
    objectSend: null,
    nameSend: "",
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
    isResetUpdatedSlip: false,
    maxCnt: 0,
    inputFormDetail: null,
    isLoaded: false, // Check action search (Kiểm tra hoạt động tìm kiếm)
    refList: "",     //"IO_DATE"-"IO_NO" / "IO_TYPE
    splitFlag: "ㆍ",          // 분리자   
    versionList: "",          // Version
    selectedCnt: 0,
    countVoucherList: 0,
    checkMaxCount: 0,
    UID: 0,
    slipLinkCount: 0,
    TO_PRG_ID: "",
    FROM_PRG_ID: "",
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
        debugger;
        this.defaultSearchParam = {
            FORM_TYPE: this.templateSetupFormType
            , BOARD_CD: this.BOARD_CD
            , BOARD_SEQ: this.BOARD_SEQ
            , DOC_GUBUN: this.DOC_GUBUN
            , PAGE_SIZE: 10
            , SORTCOL_INDEX: 0
            , SORT_TYPE: 'A'
            , ISMORE_FLAG: "N"
            , COLID: ''
            , QUICKSEARCH: ''
            , SLIP_CD: this.TO_PRG_ID

        };  // search param(검색 조건)
        this.finalSearchParam = {
            FORM_TYPE: this.templateSetupFormType
            , RPT_GUBUN: this.RPT_GUBUN
            , QUICKSEARCH: ''
        };     // 조회시 search_param
        //this.cntERPMappingList = this.countERPMapping[0].CNT || 0;
        this.checkMaxCount = 20 - this.slipLinkCount;
        this.formTypeCode = this.templateSetupFormType;
        this.viewBagDatas = {};
    },

    render: function () {
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
                css: "hide",
            })
            .filter(function (control) {
            });

        contents.add(tabContents).add(toolbar);
        var title = ecount.resource.LBL04686;
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
        var grid = widget.generator.grid(),
           ctrl = widget.generator.control(),
           form = widget.generator.form();

        contents.addGrid("gird-" + this.pageID, null);

        if (this.LevelGroupType == 'CUST')
            form.template("register")
                .add(ctrl.define("widget.multiCode.custLevelGroup", "txtTreeCustCd", "txtTreeCustCd", ecount.resource.LBL09298).setOptions({ label: null }).end());
    },
    // Set up footer
    // Khởi tạo footer
    onInitFooter: function (footer) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var res = ecount.resource;
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00070).end())
        .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar);

        if (this.isShowSearchForm == "3") {
            footer.disable();
        }
    },
    // set default value for search controls
    // khởi tạo giá trị mặc định cho các search controls
    onInitControl: function (cid, control) {
        var g = widget.generator,
            ctrl = g.control();
        switch (cid) {
            case "txtSCustCd":
                // 23. 구매처 22
                control.setOptions({ checkMaxCount: 100, label: false });
                break;
            case "txtCustGroup1":
            case "txtCustGroup2":
                control.setOptions({
                    isApplyDisplayFlag: true,
                    isCheckBoxDisplayFlag: true,
                    canCheckCount: 100
                });
                break;
            case "txtTreeCustCd":
                control.isApplyDisplayFlag = true;
                control.isCheckBoxDisplayFlag = true;
                control.checkMaxCount = 100;
                break;

            default:
                break;
        }
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

        var txtTreeCd = null;
        switch (this.LevelGroupType) {
            case 'CUST':
                txtTreeCd = this.contents.getControl('txtTreeCustCd');
                break;
            default:
                txtTreeCd = this.contents.getControl('txtTreeDeptCd');
                break;
        }


    },

    onChangeControl: function (control, data) {
        var self = this;

    },

    //On popup handler(Xử lý khi chọn widget mở popup)
    onPopupHandler: function (control, param, handler) {

        switch (control.id) {
            case "txtLastUpdatedID":
                param.isApplyDisplayFlag = true;       // apply 
                param.isCheckBoxDisplayFlag = true;    // checkbox
                param.isIncludeInactive = true;
                param.canCheckCount = 100;
                break;
            case "txtSCustCd":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.FilterCustGubun = "101";
                break;
            case "txtCustGroup1":
            case "txtCustGroup2":
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.isIncludeInactive = true;
                param.FilterCustGubun = "101";
                break;
            case 'txtTreeCustCd':
                //param.popupType = false;
                //param.additional = false;
                //param.Type = "SELECT";
                param.isApplyDisplayFlag = true;
                param.isCheckBoxDisplayFlag = true;
                param.checkMaxCount = 100;
                break;
            default:
                break;
        }
        handler(param);
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
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        parameter.PARAM = keyword;
        handler(parameter);
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
        var rowCnt = this.contents.getGrid("gird-" + this.pageID).getSettings().getPagingTotalRowCount();
        this.maxCnt = rowCnt; // get max cnt 
        //if (rowCnt >= this.baseCount && this.isMoreFlag == false)
        //    this.footer.getControl('MoreData').show();
        this.header.getQuickSearchControl().hide();
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
        debugger;
        var lstNo = '';
        var self = this;
        var isNew = false;

        if (self.DOC_GUBUN.length == 7 && self.DOC_GUBUN.substring(0, 1) == "E")
            isNew = true;

        var selectItem = self.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;
        if (self.selectedCnt > 0) {
            //if (self.defaultSearchParam.BOARD_CD == "0" && self.defaultSearchParam.BOARD_SEQ == "0") || self.defaultSearchParam.BOARD_SEQ == "-2") {
            if (!isNew) {
                //NOT GW BOARD                
                var selList = [];
                for (var i = 0; i < selectItem.length; i++) {
                    debugger;
                    var o = selectItem[i];
                    selList.push({
                        TYPE: o.FORM_GUBUN
                        , DATE: o.A2
                        , NO: o.A3
                        , VERSION_NO: o.VERSION_NO
                    })
                }
                var message = {
                    data: selList,
                    type: '03',//slip
                    callback: function () {
                        this.close();
                    }.bind(this)
                };
                self.sendMessage(self, message);
                return;
            }
            else {
                //전자결재를 제외한 나머지 경우
                var selList = [];
                for (var i = 0; i < selectItem.length; i++) {
                    var o = selectItem[i];
                    var no = "";
                    var etc = ""
                    var slipDate = o.A2;
                    var slipNo = o.A3;
                    var ser_no = 0;
                    if (o.FORM_GUBUN == "ASORD" || o.FORM_GUBUN == "ASREP") {
                        slipDate = o.A2.split("-")[0];
                        slipNo = o.A2.split("-")[1];
                    }

                    if (o.FORM_GUBUN == "ASREP") {
                        ser_no = o.A3
                    }
                    else {
                        ser_no = 0;
                    }
                    selList.push({
                        IO_DATE: slipDate,
                        IO_NO: slipNo,
                        IO_TYPE: o.A4,
                        AS_DATE2: o.A0,
                        HID: o.HID,
                        SER_NO: ser_no,
                    })
                }

                var message = {
                    data: {
                        ioNoKey: selList,
                        slipCd: self.DOC_GUBUN
                    },
                    type: '03',//slip
                    callback: function () {
                        this.close();
                    }.bind(this)
                };

                self.sendMessage(self, message);
                return;
            }
            //self.getSelectedItemsForApply(selectItem);  // 선택된 데이타 정보 Get
            //if (self.refList.length > 0) {
            //    self.callApplyListApi(self.refList, self.defaultSearchParam.BOARD_CD, self.defaultSearchParam.BOARD_SEQ, self.versionList, self.defaultSearchParam.DOC_GUBUN);
            // }
        }
        else {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }
    },
    callApplyListApi: function (Data, BoardCd, BoardSeq, Version, DocGubun) {
        debugger;
        var formData = this.setListApiJsonData(Data, BoardCd, BoardSeq, Version, DocGubun);
        var self = this;
        self.showProgressbar(true);
        //var gridObj = self.contents.getGrid().grid;
        //ecount.common.api({
        //    url: "/Groupware/IntegratedBoard/InsertRefVoucherList",
        //    data: formData,
        //    success: function (result) {
        //        if (result.Status == "200") {
        //            var message = {
        //                name: self.nameSend,
        //                code: "",
        //                data: self.objectSend,
        //                isAdded: false,
        //                addPosition: "current"
        //            };
        //            self.sendMessage(self, message);
        //        }
        //    },
        //    complete: function () {
        //        self.showProgressbar(true);
        //        self.close();
        //    }
        //});
        debugger;
        var selectItem = self.contents.getGrid().grid.getChecked();
        self.sendMessage(self, selectItem);

        //debugger;
        //ecmodule.common.slipLink.saveSlipLink(

        //    this.UID,{
        //        BOARD_CD: this.BOARD_CD,
        //        BOARD_SEQ: this.BOARD_SEQ,
        //    },
        //    selectItem, "GW02", self.defaultSearchParam.DOC_GUBUN,
        //    //callback
        //    function (result) {
        //        debugger;
        //        self.sendMessage(self, result);
        //        self.close();
        //    });



    },
    setListApiJsonData: function (Data, BoardCd, BoardSeq, Version, DocGubun) {
        debugger;
        var refApplyListJsonString = "";
        var refApplyLists = [];
        //var uid = this.UID || 0;
        $.each(Data.split("ㆍ"), function (i, val) {
            //refApplyLists.push({
            //    fileId:  DocGubun+ ecount.delimiter +val,
            //    IO_TYPE: val.split("-")[2],
            //    SLIP_DATE: val.split("-")[0],
            //    SLIP_NO: val.split("-")[1],
            //    BOARD_CD: BoardCd,
            //    BOARD_SEQ: BoardSeq,
            //    ERP_CD: DocGubun,
            //    Version: Version.split("ㆍ")[i]
            //})
            refApplyLists.push({
                fileId: DocGubun + ecount.delimiter + val,
                IO_TYPE: val.split("-")[2],
                SLIP_DATE: val.split("-")[0],
                SLIP_NO: val.split("-")[1],
                BOARD_CD: BoardCd,
                BOARD_SEQ: BoardSeq,
                SLIP_CD: DocGubun,
                Version: Version.split("ㆍ")[i],
                //UID: uid,
            })
        });
        //debugger;
        this.objectSend = refApplyLists; //$.isNull(refApplyLists) == false ? refApplyLists[0] : null;
        data = Object.toJSON(refApplyLists);
        return refApplyLists;
    },
    getSelectedItemsForApply: function (selectItem) {
        //debugger;
        var self = this;
        self.setClear();
        $.each(selectItem, function (i, data) {
            self.versionList += data.VERSION_NO + self.splitFlag;
            self.refList += data.A2 + "-" + data.A3 + "-" + (data.A4 == undefined ? "" : data.A4) + self.splitFlag
        });

        self.refList = self.refList.substring(0, self.refList.length - 1);
        self.versionList = self.versionList.substring(0, self.versionList.length - 1);

        return selectItem.length;
    },
    setClear: function () {
        this.refList = "";
        this.versionList = "";
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
        //this.titlePage = searchConditionTitle.excelTitle;
        //그리드 상단 오른쪽  (grid right of top)
        var rightHtml = searchConditionTitle.period;

        //Columns Handle
        var columns = [];

        //그리드 하단 오른쪽  (grid right of bottom)        
        settings
            .setHeaderTopMargin(this.header.height())
            //.setHeaderTopLeftHTML(searchConditionTitle.leftTitle)
           // .setRowData(this.viewBag.InitDatas.LoadData)
            .setHeaderTopRightHTML(rightHtml)
            //.setPagingRowCountPerPage(true)
            .setKeyColumn(['A0'])
            .setHeaderFix(false)
            .setColumnFixHeader(true)
            .setPagingUseDefaultPageIndexChanging(false)
            .setStyleBoldOnMergeRow(true)
            .setEmptyGridMessage(res.MSG00205);
        columns = [
            { propertyName: 'ERP_RESX_CODE', id: 'ERP_RESX_CODE', width: '', align: 'left', fontSize: 11, title: ecount.resource.LBL03614 },
            { propertyName: 'A0', id: 'A0', width: '', align: 'left', fontSize: 11, title: ecount.resource.LBL02502 },
            { propertyName: 'A1', id: 'A1', width: '', align: 'left', fontSize: 11, title: String.format("{0}({1})", ecount.resource.LBL00329, ecount.resource.LBL01492) },
        ];
        settings.setRowDataUrl('/Groupware/IntegratedBoard/GetListRefVoucherForSearch')
                .setColumnSortable(false)
                .setCheckBoxUse(true)
                .setPagingUse(true)
                .setCheckBoxRememberChecked(true) // remember checkbox(Nhớ các dòng đã đánh đấu)
                .setCheckBoxMaxCount(this.checkMaxCount)
                .setCheckBoxMaxCountExceeded(function (e) {
                    ecount.alert(String.format(ecount.resource.MSG00908, 20));
                })
                .setPagingUseDefaultPageIndexChanging(true)
                .setCustomRowCell('ERP_RESX_CODE', this.setGridItemValue.bind(this))
                .setCustomRowCell('A0', this.setGridDateLinkDetail.bind(this))
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
        //if (isShowOptionBtn) this.header.getButton("option").show();


        return true;
    },
    setGridItemValue: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.label";
        if ($.isEmpty(this.nameSend))
            this.nameSend = ecount.resource[value];

        option.data = ecount.resource[value];

        return option;
    },

    setGridDateLinkDetail: function (value, rowItem) {
        var option = {};
        var dataparam = {};
        var params = {},
            param = "",
            url = "",
            name = "";

        console.log(this);

        var selfThis = this;
        if (selfThis.defaultSearchParam.BOARD_SEQ == "-2" && selfThis.defaultSearchParam.BOARD_CD == "1") {
            //in case of e-approval
            option.controlType = "widget.label";
            return option;
        }
        option.dataType = "1";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                debugger;
                var strSliptype = "";
                if (data.rowItem.GB_TYPE == "Y")
                    strSliptype = "1";
                else if (data.rowItem.GB_TYPE == "N")
                    strSliptype = "2";
                else if (data.rowItem.GB_TYPE == "Z")
                    strSliptype = "3";
                else
                    strSliptype = "1";

                var noAs = "";
                var slipDate = data.rowItem.A2;
                var slipNo = data.rowItem.A3;
                if (data.rowItem.FORM_GUBUN == "ASORD" || data.rowItem.FORM_GUBUN == "ASREP") {
                    noAs = data.rowItem.A2;
                    slipDate = noAs.split("-")[0];
                    slipNo = noAs.split("-")[1];
                }
                if (data.rowItem.FORM_GUBUN == "ASORD") {

                    url = "/ECMain/ESQ/ESQ101M.aspx?NO_AS=" + noAs;
                    params.NO_AS = noAs;
                }
                else if (data.rowItem.FORM_GUBUN == "ASREP") {
                    url = "/ECMAIN/ESQ/ESQ104M.aspx?TYPE=POPUP&NO_AS=" + noAs + "&NO_MENDUSER=" + data.rowItem.A3 + "&NO_AS2=" + data.rowItem.A0 + "&url2=";
                }
                else
                    url = data.rowItem.ERP_URL;

                params = this.setXMLData(data.rowItem.A2, data.rowItem.A3, ($.isNull(data.rowItem.A4) ? "" : data.rowItem.A4), ($.isNull(data.rowItem.A3) ? "" : data.rowItem.A3), strSliptype, "M");
                params.width = ecount.infra.getPageWidthFromConfig();
                //params.isGroupware = "Y";
                //params.isCallNewPopup = "Y";

                data.rowItem.SLIP_DATE = data.rowItem.A2;
                data.rowItem.SLIP_NO = data.rowItem.A3;
                var newParam = ecmodule.common.slipLink.changeErpUrl(url, params, "M", data.rowItem);
                newParam.param.callPageName = "EGM025P_07";
                selfThis.openWindow({
                    url: newParam.url,
                    name: name,
                    param: newParam.param,
                    popupType: newParam.popupType,
                    additional: false
                });

                //selfThis.fnShowPopup(url, name, params);

                e.preventDefault();
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
    setXMLData: function (M_Date, M_No, M_Type, M_TrxSer, M_SlipType, M_EditFlag) {
        var data = {};

        data["M_Date"] = M_Date;
        data["M_No"] = M_No;
        data["M_Type"] = M_Type;
        data["M_TrxSer"] = M_TrxSer;
        data["M_SlipType"] = M_SlipType;
        data["M_EditFlag"] = "M";
        data["M_Pgm"] = "/ECMAIN/EGV/EGV006M.aspx";
        data["M_EdmsFlag"] = "N";
        data["M_Page"] = "1";
        data["M_SerNo"] = "0";
        return {
            "hidSearchXml": ecount.common.toXML(data),
        };
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