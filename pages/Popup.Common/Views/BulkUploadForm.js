window.__define_resource && __define_resource("LBL30298","LBL09099","LBL08833","MSG00639","LBL00043","LBL11065","MSG30299","MSG08053","MSG30391","LBL03638","MSG04486");
/****************************************************************************************************
1. Create Date : 2018.01.23
2. Creator     : 고흥모
3. Description : 웹자료 올리기 팝업(Web uploader popup) - 기본
4. Precaution  :
5. History     : 2018.04.05(임명식) 탭관련  , 기초등록 품목관련 수정
                 2018.10.04(PhiTa): A18_02925 자료올리기 세션타임아웃 개선
                 2019.02.18(Lap) - Development A19_00391
                 2019.10.29(HuuTuan) : A19_03558 - 신규_인사카드등록(NF_Employee Profile)_웹자료올리기
                 2019.12.31 (Kim Woojeong) - [A19_04663] SAL_TYPE_CD 추가
                 2020.01.22 (Kim Woojeong) - [A18_03793] 급여 신규프레임웍 적용 - 급여관리II
                 2020.04.14 (Chang Jongmun) - [A20_01298] 기초코드(품목,거래처) 엑셀업로드 로직 개선(로직 일괄처리되도록 변경)
                 2020.06.22 (정우용) - [A20_01863] 전표 묶음기준설정 옵션
                 2020.07.03 (Chang Jongmun) - [A20_02700] 웹자료올리기 50건씩 끊어서 처리 - data undefined check
                 2020.09.01 (TanThanh) : A20_02121 - add button Data Uploader Add field
6. Old File    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.list.bulkForm", "BulkUploadForm", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ////****************************************************************************************************/

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.selfPath = "/ECERP/Popup.Common/BulkUploadForm";
        this.initProperties();

    },

    initProperties: function () {
        //this.viewBag = this.viewBag;
        this._super.initProperties.apply(this);
        this.SAL_TYPE_CD = this.SAL_TYPE_CD ? this.SAL_TYPE_CD : 'P';
    },

    render: function () {
        this._super.render.apply(this);
    },

    onInitHeader: function (header) {
        this._super.onInitHeader.apply(this, arguments);
        if (this.viewBag.DefaultOption.isUseBundleSetting) {
            header.add("option", ([
                { id: "SlipBundleSetting", label: ecount.resource.LBL30298 },
            ]), false)
        }
    },

    //복사 붙여넣기 copy & paste
    gridClipboardCallback: function (result) {
        //var gridObj = this.contents.getGrid('dataGrid'),
        //    grid = gridObj.grid;
        this.gridClipboardPaste(this.contents, this.currentTabId, result);
    },

    //download excel 
    onContentsExcelDownload: function (e, resultData) {
        var formType = this.viewBag.FormType;
        if (formType.indexOf(ecount.delimiter) >= 0)
            formType = formType.split(ecount.delimiter)[this.currentTabIdx];
        this.defaultExcelDown(formType, "/Common/Form/DownloadBulkFormExcel", this.currentTabName, resultData);
    },

    //Data Uploader Add field 
    onContentsDataUploaderAddField: function (e, resultData) {
        if (["AI250", "GI020", "GI030", "PI020", "PI050", "PI060"].contains(this.viewBag.FormType)) {
            this.openInputScreenSettingFM006P_02();
        } else if (this.viewBag.FormType.toUpperCase().startsWith("GI4") == true) { //DIY Board
            this.openInputScreenSettingDIYBoard();
        } else {
            this.openInputScreenSettingFM006P_01();
        }
    },

    openInputScreenSettingFM006P_01: function () {
        var param = {
            width: 1020,
            height: 750,
            modal: true,
            FormType: this.viewBag.FormType,
            FormSeq: 1,
            FromProgramId: this.FromProgramId,
            IsFromTargetOption: true
        };

        //Payroll
        var payrollFormType = ['PI070', 'PI071', 'PI082', 'PI083', 'PI090'];
        var dayLaborPayrollMgmt = ['PI070', 'PI071'];
        if (payrollFormType.contains(this.viewBag.FormType)) {
            var paramExt = {
                SAL_TYPE_CD: dayLaborPayrollMgmt.contains(this.viewBag.FormType) ? 'D' : 'P',
            }
            param = $.extend(true, param, paramExt);
        }

        this.openWindow({
            url: "/ECERP/SVC/Popup/FM006P_01",
            param: param
        });
    },

    openInputScreenSettingDIYBoard: function () {
        if (!this.IsBoardAdmin) {
            var errMessage = [];
            errMessage.push({ MenuResource: ecount.resource.LBL09099, PermissionMode: "U" });
            var msgdto = ecount.common.getAuthMessage("", errMessage);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var params = {
            width: 1020,
            height: 750,
            FormType: this.viewBag.FormType,
            FormSeq: 1,
            PRG_ID: this.FromProgramId,
            isSaveAfterSendMessage: true,
            IsBoardAdmin: this.IsBoardAdmin,
            IsMultiBoard: "1",
        };

        this.openWindow({
            url: '/ECERP/SVC/Popup/FM006P_01',
            name: ecount.resource.LBL08833,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false

        });
    },

    openInputScreenSettingFM006P_02: function () {
        var param = {
            width: 800,
            height: 815,
            modal: true,
            FormType: this.viewBag.FormType,
            FormSeq: 1,
            FromProgramId: this.FromProgramId,
        };

        var payrollFormType = ['PI020', 'PI050', 'PI060'];
        var dayLaborPayrollMgmt = ['PI060'];
        if (payrollFormType.contains(this.viewBag.FormType)) {
            var paramExt = {
                SAL_TYPE_CD: dayLaborPayrollMgmt.contains(this.viewBag.FormType) ? 'D' : 'P',
            }
            param = $.extend(true, param, paramExt);
        }

        this.openWindow({
            url: "/ECERP/SVC/Popup/FM006P_02",
            name: ecount.resource.LBL08833,
            param: param
        });
    },

    //save data
    onFooterSave: function () {
        var isConfirmOpen = this.viewBag.FormTabs[this.currentTabIdx].IsConfirmPopup
            , _self = this;
        //Use for Budget
        var lstBudget = this.viewBag.FormTabs[this.currentTabIdx].FormInfos.filter(function (item) { return item.COL_CD.indexOf('BUDGET') >= 0 });
        var formType = this.viewBag.FormType;

        if ((this.isItemSelectPopupOpen && this.viewBag.FormTabs[this.currentTabIdx].FormInfos.length < 2)
            || (this.isItemSelectPopupOpen && this.viewBag.FormTabs[this.currentTabIdx].FormInfos.length < 3 && ["SI984", "SI986"].indexOf(formType) > -1)
            || (formType == "AU600" && lstBudget.length == 0)) {
            ecount.alert(ecount.resource.MSG00639, function () {
                _self.onContentsSelectChangeItem({ cid: "selectChangeItem" });
            });
            return false;
        } else {
            saveCall();
        }
        function saveCall() {
            var data = _self.setSaveApiJsonData(_self.contents);
            if (!$.isEmpty(_self.TAX_BRACKET_CD)) {
                data.Data = { TAX_BRACKET_CD: _self.TAX_BRACKET_CD, APPLY_DATE: _self.APPLY_DATE.toDate().format("yyyy-MM-dd"), SAL_TYPE_CD: _self.SAL_TYPE_CD };
            }
            else if (!$.isEmpty(_self.PAY_SEQ)) {
                data.Data = { PAY_SEQ: _self.PAY_SEQ, SAL_TYPE_CD: _self.SAL_TYPE_CD };
            }

            if (isConfirmOpen && data.DefaultBulkDatas.length > 0) {

                if (["SI912", "SI902"].contains(formType)) {
                    var checkParam = {};
                    var checkList = [];

                    if (formType == "SI912") {
                        checkList = data.DefaultBulkDatas.where(function (x) {
                            return x.BulkDatas.CANCEL && x.BulkDatas.CANCEL.toUpperCase() == "Y"
                        });
                        checkParam = {
                            Request: {
                                Data: {
                                    MENU_CODE: "Customer",
                                    CHECK_TYPE: "S",
                                    DELETE_TYPE: "SEARCH",
                                    PARAMS: checkList.select(function (x) { return x.BulkDatas.BUSINESS_NO })
                                }
                            }
                        }
                    } else if (formType == "SI902") {
                        checkList = data.DefaultBulkDatas.where(function (x) {
                            return x.BulkDatas.DEL_GUBUN && x.BulkDatas.DEL_GUBUN.toUpperCase() == "Y"
                        });
                        checkParam = {
                            Request: {
                                Data: {
                                    MENU_CODE: "Item",
                                    CHECK_TYPE: "S",
                                    DELETE_TYPE: "SEARCH",
                                    PARAMS: checkList.select(function (x) { return x.BulkDatas.PROD_CD })
                                }
                            }
                        }
                    }

                    if (checkList.length > 0) {
                        ecount.common.api({
                            url: "/SVC/Common/Infra/CheckUnUseCode",
                            data: Object.toJSON(checkParam),
                            success: function (result) {
                                if (result.Data && result.Data.length > 0) {
                                    _self.ShowNoticeNonDeletable(result.Data, checkParam.Request.Data.MENU_CODE);
                                } else {
                                    _self.openConfirmPopup();
                                }
                            }
                        });
                    } else {
                        _self.openConfirmPopup();
                    }
                } else {
                    _self.openConfirmPopup();
                }

            } else {
                if (_self.CheckPermissionRequest) {
                    _self.CheckPermissionRequest.EditMode = ecenum.editMode.webUpload;  //자료올리기

                    if (!$.isEmpty(_self.CheckPermissionRequest.CheckPermissionTabListRequest) && _self.CheckPermissionRequest.CheckPermissionTabListRequest.length > 0) {
                        _self.CheckPermissionRequest.CheckPermissionTabListRequest.remove(function (item) { return item.EditMode == ecenum.editMode.webUpload; });
                    }
                    var notInputPrgId = ['E041007']; //배송처리
                    if (isConfirmOpen != true && !notInputPrgId.contains(_self.CheckPermissionRequest.ProgramId)) {
                        var tabCheck = $.extend({}, _self.CheckPermissionRequest);
                        tabCheck.EditMode = ecenum.editMode.new;
                        tabCheck.CheckPermissionTabListRequest = null;

                        if ($.isEmpty(_self.CheckPermissionRequest.CheckPermissionTabListRequest)) {
                            _self.CheckPermissionRequest.CheckPermissionTabListRequest = [
                                tabCheck
                            ];
                        } else {
                            
                            if ((_self.CheckPermissionRequest.CheckPermissionTabListRequest.length > 0 || $.isArray(_self.CheckPermissionRequest.CheckPermissionTabListRequest))&& !_self.CheckPermissionRequest.CheckPermissionTabListRequest.any(function (item) { return item.EditMode == ecenum.editMode.new; })) {
                                _self.CheckPermissionRequest.CheckPermissionTabListRequest.push(tabCheck);
                            }
                        }
                    }

                }
                if (formType == 'AI440' || formType == 'AI450' || formType == 'AU140' || formType == 'AU150' || formType == 'SI793') {
                    _self.doFooterSaveBySlip(_self, data, 100);
                }
                else if (formType == "SI800" || formType == "SI960" || formType == 'SI902' || formType == 'SI912') {
                    data.DefaultBulkDatas.forEach(function (item) { item.BulkDatas[formType] = item.Line });
                    _self.doFooterSaveBySlip(_self, data, 50);
                }
                else {
                    _self.doFooterSave(_self, data);
                }
            }
        }

    },

    openConfirmPopup: function () {
        if (this.CheckPermissionRequest) {
            this.CheckPermissionRequest.EditMode = ecenum.editMode.modify;  //자료변경

            if (!$.isEmpty(this.CheckPermissionRequest.CheckPermissionTabListRequest) && this.CheckPermissionRequest.CheckPermissionTabListRequest.length > 0) {
                this.CheckPermissionRequest.CheckPermissionTabListRequest.remove(function (item) { return item.EditMode == ecenum.editMode.new; });
            }
            var tabCheck = $.extend({}, this.CheckPermissionRequest);
            tabCheck.EditMode = ecenum.editMode.webUpload;
            tabCheck.CheckPermissionTabListRequest = null;

            if ($.isEmpty(this.CheckPermissionRequest.CheckPermissionTabListRequest)) {
                this.CheckPermissionRequest.CheckPermissionTabListRequest = [
                    tabCheck
                ];
            } else {

                if ((this.CheckPermissionRequest.CheckPermissionTabListRequest.length > 0 || $.isArray(this.CheckPermissionRequest.CheckPermissionTabListRequest)) && !this.CheckPermissionRequest.CheckPermissionTabListRequest.any(function (item) { return item.EditMode == ecenum.editMode.webUpload; })) {
                    this.CheckPermissionRequest.CheckPermissionTabListRequest.push(tabCheck);
                }
            }
        }
        var params = {
            width: 480,
            height: 250,
            isSendMsgAfterDelete: true,
            MODFLAG: 'Y',
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: ecount.resource.LBL00043,
            param: params,
            popupType: false,
            additional: true
        });
    },

    ShowNoticeNonDeletable: function (data, menuCode) {
        var param = {
            width: 520,
            height: 500,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: menuCode,
            IsUpdateYn: true,
            ConfirmMode: true
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    onLoadComplete: function (e) {
        this.setTabClickEvent();
    },

    //탭클릭시
    setTabClickEvent: function () {
        switch (this.viewBag.FormType) {
            case "SI902":
                this.contents.hideTab("BASIC");
                this.tabChangeEvent = function (tab) {
                    if (tab == "2tabs" && ecount.config.inventory.PROC_FLAG != "Y") {
                        ecount.alert(ecount.resource.MSG30299);
                        return false;
                    } else if (tab == "3tabs" && ecount.config.inventory.WHSAFE_TYPE == "0") {
                        ecount.alert(ecount.resource.MSG08053);
                        return false;
                    }
                    return true;
                }
                break;
            case "SU721":
                this.contents.hideTab("BASIC");
                this.tabChangeEvent = function (tab) {
                    if (tab == "1tabs" && ecount.config.inventory.SL_ANYINPUT_YN != "Y") {
                        ecount.alert(ecount.resource.MSG30391);
                        return false;
                    }
                    return true;
                }
                break;
            default:
                this.contents.hideTab("BASIC");
                this.tabChangeEvent = function (tab) {
                    return true;
                }
                break;
        }
    },

    //변경항목 선택
    onContentsSelectChangeItem: function (e) {
        var option = this.getToolBarOptionUrl(e.cid || e.originId),
            url = "/ECERP/SVC/ESA/ESA001P_15";
        if (!$.isEmpty(option) && option.url) {
            url = option.url;
        }
        var _selectedItem = [];
        for (var i = 0; i < (this.viewBag.FormTabs[this.currentTabIdx].FormInfos || []).length; i++) {

            var detailCol = (this.viewBag.FormTabs[this.currentTabIdx].FormInfos[i]["DETAIL_COL_CD"] || "");
            if (detailCol == "ETC") {
                detailCol = (this.viewBag.FormTabs[this.currentTabIdx].FormInfos[i]["COL_CD"] || "")
            }
            _selectedItem.add(detailCol);
        };
        _selectedItem = (_selectedItem).distinct();
        var params = {
            width: 400,
            height: 600,
            FORM_TYPE: this.viewBag.FormType,
            selectedItem: Object.toJSON(_selectedItem)
        };

        if (["PI050", "PI020", "PI060"].contains(this.viewBag.FormType))
            params.FixedCheckColumns = ["EMP_CD"];

        if (["PI050", "PI060", "PI020"].contains(this.viewBag.FormType))
            params.SAL_TYPE_CD = this.SAL_TYPE_CD;

        if (["GI030"].contains(this.viewBag.FormType)) {
            params.FixedCheckColumns = ["CUST_IDX"];
        }

        if (["GI020"].contains(this.viewBag.FormType)) {
            params.FixedCheckColumns = ["UNAME"];
        }

        // HR > Reg. Employee Profile not use [A3] tab
        if (["PI020"].contains(this.viewBag.FormType)) {
            params.isUseAlloTab = false;
        }

        if (this.viewBag.FormType == "AI250")
            params.FixedCheckColumns = ["GYE_CODE"];

        this.openWindow({
            url: url,
            name: ecount.resource.LBL03638,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false
        });
    },

    onDropdownSlipBundleSetting: function () {
        var url = "";
        var param = {
            Width: 420,
            Height: 370,
            FromProgramId: this.FromProgramId,
            IsFromTargetOption: true
        };

        if (!_.isEmpty(this.viewBag.BundleFormType)) {
            url = "/ECERP/Popup.Form/CM100P_13";
            param.FORM_TYPE = this.viewBag.BundleFormType;
            param.FORM_SEQ = 1;
        } else {
            url = "/ECERP/SVC/Popup/FM013P_01";
            param.FormType = this.viewBag.FormType;
            param.FormSeq = 1;
        }

        this.openWindow({
            url: url,
            name: "",
            param: param
        })
    },

    IsLockProcess: function () {
        return this.isLockProcess || false;
    },

    onMessageHandler: function (event, data) {
        this.saveComplete = true;
        if ((this.IsLockProcess() || false) == true) {
            this.setTimeout(function () {
                data.callback && data.callback();
            }.bind(this), 0);
            return;
        };

        var firstData = $.isEmpty(data) ? "" : (data.data || data);
        switch (event.pageID) {
            case "EBA001P_22":
            case "ESA071P_04": //품목별 특별단가 등록
            case "ESA010P_15": //변경항목선택팝업창
            case "EPB013P": //변경항목선택팝업창
            case "EGM002P_01":
            case "EGM003P_01":
                if (firstData && (firstData.sendType || "") == "load") {
                    this.popupOpenId = firstData.data;
                } else {
                    this.showProgressbar(null, null, 0);
                    this.ChangeSelectedItemPagecallBack(firstData, data);
                    this.hideProgressbar(true);
                }
                break;
            case "EBA001M":
            case "EBJ001M": //Budget
            case "ESA001M": //거래처등록리스트
            case "ESA009M": //품목등록리스트
            case "EPB002M": //Register Employee List
            case "EPD003M": //Register Employee List (KR)
            case "EGM001M":
            case "EGM003M":
            case "ESA070M":
            case "ESA071M":
                this.setResultDataPagecallBack(firstData, data);
                break;
            case "CM021P":
                if (firstData == "close") {
                    this.footer.getControl("save").setAllowClick();
                } else {
                    this.setTimeout(function () {
                        data.callback && data.callback();
                    }.bind(this), 0);
                    var data = this.setSaveApiJsonData(this.contents);
                    this.doFooterSave(this, data);
                }
                break;
            case "NoticeNonDeletable":
                if (data.data.status) {
                    this.openConfirmPopup();
                }
                data.callback && data.callback();
                break;
            case "FM006P_01":
            case "FM006P_02":
                ecount.confirm(ecount.resource.MSG04486, function (isOk) {
                    if (isOk) {
                        this.onFooterRewrite();
                    }
                }.bind(this));
                break;
        };
        this.setTimeout(function () {
            data && data.callback && data.callback();
        }.bind(this), 0);
    },

    //변경항목선택 팝업 callback
    ChangeSelectedItemPagecallBack: function (firstData, data) {
        var sendItems = [];
        for (var i = 0; i < firstData.length; i++) {
            if (((firstData[i]["id"] || "") == "") && ((firstData[i]["ID"] || "") == "")) continue;
            if ((firstData[i]["id"] || "") != "")
                sendItems.add((firstData[i]["id"] || ""));
            if ((firstData[i]["ID"] || "") != "")
                sendItems.add((firstData[i]["ID"] || ""));
        };
        //if (this.viewBag.FormTabs[this.currentTabIdx].FormInfos.any(function (item) { return item.DETAIL_COL_CD == "ETC" })) {
        //    sendItems.add("ETC");
        //}
        this.getBulkUploadColumnsBySelectedItems(sendItems.distinct(), firstData);
    },

    getBulkUploadColumnsBySelectedItems: function (items, firstData) {
        if ((this.IsLockProcess()) == false) {
            this.isLockProcess = true;
            var _self = this;
            _self.showProgressbar(null, null, 0);

            var gridObj = this.contents.getGrid(("dataGrid" + this.currentTabIdx)),
                gridSettings = gridObj.getSettings();
            if (gridObj != null) {
                gridObj.grid.resetClipboardObj();
                gridSettings.setRowData([]);
                this.selectedColCd = items;
                var selectedColums = items;
                var _url = "/Common/Form/GetListBulkFormTemplate", _data;
                var _param = {
                    FormType: _self.FormType,
                    FormSeq: parseInt(_self.currentTabIdx) + 1,
                    IsSave: false,
                    IsUpload: true,
                    IsTabInfo: true,
                    IsGetBasicTab: _self.IsGetBasicTab,
                    GetSelectedColumns: selectedColums,
                    PAY_SEQ: _self.PAY_SEQ
                };

                // TODO: Used for get info by NF 3.0
                if (["PI020", "PI050", "PI530", "PI540", "AI250", "GI030", "PI060", "GI020", "SI984", "SI986", "SI912"].contains(_self.FormType)) {
                    _url = "/SVC/Common/Form/GetListBulkForm";
                    _param.FormSeq = 1;
                    if (["PI020", "PI050", "AI250", "GI030", "PI060", "GI020", "SI984", "SI986", "SI912"].contains(_self.FormType))
                        _param.FormSeq = null;
                    _data = { Request: _param };
                } else {
                    _data = _param;
                }

                ecount.common.api({
                    url: _url,
                    data: Object.toJSON(_data),
                    success: function (result) {
                        try {
                            _self.viewBag.FormTabs[_self.currentTabIdx].FormInfos = result.Data[_self.currentTabIdx].FormInfos;
                            _self.setColumnsByTab(_self.viewBag.FormTabs[_self.currentTabIdx]['FormInfos']);
                            gridSettings.setColumns(_self.columns);
                        } catch (e) {
                        }; /*바인딩 중 에러가 발생해도 처리는 해야됨..*/
                        gridObj.draw();
                    },
                    complete: function () {
                        _self.isLockProcess = false;
                        _self.hideProgressbar(true);
                    }
                });
            };
        }
    },

    //자료포함
    onButtonIncludeRegistedSlips: function (e) {
        var option = this.getToolBarOptionUrl(e.cid || e.originId),
            url = "/ECERP/ESA/ESA009M";
        if (!$.isEmpty(option) && option.url) {
            url = option.url;
        }
        var _selectedItem = [];
        for (var i = 0; i < (this.viewBag.FormTabs[this.currentTabIdx].FormInfos || []).length; i++) {
            var detailCol = (this.viewBag.FormTabs[this.currentTabIdx].FormInfos[i]["DETAIL_COL_CD"] || "");
            if (detailCol == "ETC") {
                detailCol = (this.viewBag.FormTabs[this.currentTabIdx].FormInfos[i]["COL_CD"] || "")
            }
            _selectedItem.add(detailCol);
        };
        this.selectedColCd = (_selectedItem || []).distinct();
        var param = {
            width: 800,
            height: 600,
            isShowSearchForm: 4,
            isShowSearchClose: true,
            IsFromBulkUpload: true,
            BulkUploadColumns: this.selectedColCd || [],
            SAL_TYPE_CD: this.SAL_TYPE_CD
        };

        // 계정등록자료포함은 검색탭이 케이스에 따라 분리됨
        if (this.viewBag.FormType == "AI250") {
            if (!$.isEmpty(this.Options)) {
                param.TabType = this.Options[0].TabType;
            }
        }

        this.openWindow({
            url: url,
            name: 'search',
            param: param,
            popupType: false
        });
    },

    //등록자료포함 이후 callback
    setResultDataPagecallBack: function (firstData, data) {
        var _rowData_columns = [];
        for (var key in firstData[0]) {
            _rowData_columns.push({ id: key });
        };

        var sendData = this.getDataBind(_rowData_columns, firstData);

        this.onContentsExcelDownload(null, sendData);
    },

    ///검색결과에서받은 컬럼을 바인딩한다.
    getDataBind: function (sendItems, _grid_rowList) {

        var _grid_column = [];
        for (var i = 0; i < this.viewBag.FormTabs[this.currentTabIdx].FormInfos.length; i++) {
            _grid_column.push({ id: this.viewBag.FormTabs[this.currentTabIdx].FormInfos[i].COL_CD });
        };

        var _binding_grid_data = [];
        var _tt = {};
        if (this.FormType == "AU600") {
            for (var i = 0; i < _grid_rowList.length; i++) {
                for (var j = 0; j < _grid_column.length; j++) {
                    if (_grid_column[j] == null) break;
                    switch (_grid_column[j].id) {
                        case "BUDGET_JANUARY":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "01"] || "");
                            break;
                        case "BUDGET_FEBRUARY":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "02"] || "");
                            break;
                        case "BUDGET_MARCH":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "03"] || "");
                            break;
                        case "BUDGET_APRIL":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "04"] || "");
                            break;
                        case "BUDGET_MAY":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "05"] || "");
                            break;
                        case "BUDGET_JUNE":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "06"] || "");
                            break;
                        case "BUDGET_JULY":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "07"] || "");
                            break;
                        case "BUDGET_AUGUST":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "08"] || "");
                            break;
                        case "BUDGET_SEPTEMBER":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "09"] || "");
                            break;
                        case "BUDGET_OCTOBER":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "10"] || "");
                            break;
                        case "BUDGET_NOVEMBER":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "11"] || "");
                            break;
                        case "BUDGET_DECEMBER":
                            _tt[_grid_column[j].id] = (_grid_rowList[i][sendItems[0].id.substr(0, 4) + "12"] || "");
                            break;
                        case "YEAR":
                            _tt[_grid_column[j].id] = (sendItems[0].id.substr(0, 4));
                            break;
                        default:
                            _tt[_grid_column[j].id] = (_grid_rowList[i][(_grid_column[j].id)] || "");
                            break;
                    }
                    //_tt.push("\"" + (_grid_column[j].id) + "\" : \"" + (_grid_rowList[i][(_grid_column[j].id)] || "") + "\"");
                };
                _tt["MAXCNT"] = (_grid_rowList[i]["MAXCNT"] || "");
                _binding_grid_data.push(_tt);
                _tt = {};
            };
        } else {
            for (var i = 0; i < _grid_rowList.length; i++) {
                for (var j = 0; j < sendItems.length; j++) {
                    if (_grid_column[j] == null) break;
                    _tt[_grid_column[j].id] = (_grid_rowList[i][(sendItems[j].id)] || "");

                    //2019.02.18(Lap) - Development A19_00391
                    if (this.FormType == "SI912" && _grid_column[j].id == "PROD_CD") {
                        _tt[_grid_column[j].id] = (_grid_rowList[i]["PROD_CD"] || "");
                    }
                };
                _tt["MAXCNT"] = (_grid_rowList[i]["MAXCNT"] || "");
                _binding_grid_data.push(_tt);
                _tt = {};
            };
        }

        return _binding_grid_data;
    },

    //툴바url가져오기
    getToolBarOptionUrl: function (id) {
        var tabToolbar = this.viewBag.FormTabs[this.currentTabIdx].TabToolbar,
            toolBarOptioin;
        if (!$.isEmpty(tabToolbar)) {
            toolBarOptioin = JSON.parse(tabToolbar);
            var option = toolBarOptioin.where(function (item) { return item.id == id; }).first();
            if (!$.isEmpty(option)) {
                return option;
            } else {
                option = toolBarOptioin.where(function (item) { return item.isGroup == true; }).select(function (gItem) { return gItem.groupItem; });
                option = option.where(function (item) {
                    return item.where(function (d) {
                        return d.id == id;
                    }).first();
                }).first();
                return $.isArray(option) ? option.first() : option;
            }
        }
        return null;
    }

});