window.__define_resource && __define_resource("LBL07530","LBL01381","LBL01377","LBL01845","LBL02489","LBL03146","LBL04189","LBL00757","BTN00176","LBL02794","LBL07531","LBL35244","LBL02475","LBL01448","BTN00204","LBL00870","LBL10548","BTN00863","BTN00033","BTN00113","BTN00007","LBL00064","LBL01457","BTN00330","BTN00427","MSG02158","BTN00043","BTN00265","BTN00959","BTN00203","BTN00050","MSG09849","LBL06434","LBL02484","MSG09785","LBL93032","LBL09999","MSG00141","LBL09653","LBL03176","MSG00213","MSG00299","LBL00243","LBL08030","LBL11065");
/****************************************************************************************************
1. Create Date : 2015.05.11
2. Creator       : Le Dan
3. Description : Acct. I > Setup > Department
4. Precaution  : None
5. History     : [2016.02.01] 이은규: 헤더에 옵션 > 사용방법설정 추가
                 2018.01.16(Thien.Nguyen) Add option set shaded for grid, set scroll top for page.
                 2018.05.29 Huu Lan Apply Dev 9670
                 2018.08.03 Huu Lan Fixed Dev 12049 (Rename SITE_CD to SITE_CD_DEPT and SITE_DES to SITE_DES_DEPT because it duplicated at FinancialParamRequestDto which GetListIncomeStatementBiz, GetBalanceSheetDataBiz and GetListScheduleOfCostBiz used. 
                 2018.08.06 Huu Lan Fixed Dev 12145 부서등록 - 수정화면 클릭 시 등록창이 뜨는 문제
                 2018.09.20 (Chung Thanh Phuoc) Add link navigation Dept. Code/ Dept. Name of menu Department
                 2018.10.02 Chung Thanh Phuoc Apply disable search when data search > 1000
                 2018.11.02 (PhiTa) Remove Apply disable sort > 1000
                 2018.12.27 (HoangLinh): Remove $el
                 2019.03.29 (Duyet): Refac logic reloadPage
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                 2020.01.07 (HoangLinh): Changed to select data from MS to MYSQL
                 [2020.02.01](hrkim):  데이터관리.
                 2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
6. Old file    : None
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "EBA003M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    canCheckCount: 100,
    formTypeCode: 'AR771',                                      // 리스트폼타입
    formInfoData: null,                                         // 리스트 양식정보
    cSite: '',

    userFlag: null,
    ALL_GROUP_SITE: null,                                       // 허용부서그룹   - 0: 전체, 1: 특정그룹    
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,
    searchFormParameter: null, // 검색 시 정보
    finalHeaderSearch: null,        // 검색 시 검색 컨트롤 정보 
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        debugger
        var params = {
            url: "/ECERP/SVC/EBA/EBA003M",
            formdata: {},
            param: {}
        };

        this.onAllSubmit(params);
        return;
        this._super.init.apply(this, arguments);
        this.initProperties();

        //debugger;
        if (this.isShowSearchForm == null) {   // 데이터관리에서 넘어 온경우 보이기 - 2019.11.26 김봉기 
            this.isShowSearchForm = "2";
        }
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 보이기 - 2019.11.26 김봉기 
            this.isShowSearchForm = "1";
        }
        this.registerDependencies("ecmodule.common.formHelper");
    },

    initProperties: function () {
        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];
        this.searchFormParameter = {
            Request: {
                Data: {
                        PARAM: this.PARAM,
                        SORT_COLUMN: "SITE.SITE",
                        SORT_TYPE: "A",
                        FORM_TYPE: this.formTypeCode,
                        FORM_SER: '1',
                        INI_COM_CODE: this.viewBag.InitDatas.IniComCode,
                        PAGE_SIZE: this.formInfoData.option.pageSize,
                        PAGE_CURRENT: 1,
                        SITE_CD_DEPT: this.SITE_CD_DEPT,
                        SITE_DES_DEPT: this.SITE_DES_DEPT,
                        MENU: this.MENU,
                        BUSINESS_NO: this.BUSINESS_NO,
                        SITE_CD_TREE: this.SITE_CD_TREE, // DEPT LEVEL GROUP
                        CANCEL: this.CANCEL || 'N', // ACTIVE
                        BASE_DATE_CHK: this.BASE_DATE_CHK,
                        PRG_ID : this.viewBag.DefaultOption.PROGRAM_ID,
                        pageTitle: ecount.resource.LBL07530
                }
            }
        };
        this.userFlag = this.viewBag.InitDatas.USER_FLAG;                   // 사용자 구분
        this.ALL_GROUP_SITE = this.viewBag.InitDatas.ALL_GROUP_SITE;        // 허용부서그룹   - 0: 전체, 1: 특정그룹
    },

    render: function () {
        this._super.render.apply(this);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var g = widget.generator;
        var contents = g.contents();         //widget Content
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var form = g.form();                 //widget Form
        var res = ecount.resource;

        var activeFlag = ["N", "Y"].join(ecount.delimiter);
        var menuFlag = ['99', '1', '2', '3'].join(ecount.delimiter);

        // Search Form
        form.add(ctrl.define('widget.input', 'txtSITE', 'SITE_CD_DEPT', res.LBL01381, null).end());

        form.add(ctrl.define('widget.input', 'txtSiteDes', 'SITE_DES_DEPT', res.LBL01377, null).end());

        form.add(ctrl.define("widget.checkbox.whole", "cbMENU", "MENU", res.LBL01845)
            .label([res.LBL02489, res.LBL03146, res.LBL04189, res.LBL00757])
            .value([menuFlag, '1', '2', '3'])
            .select(menuFlag, '1', '2', '3')
            .end());

        if (ecount.company.VAT_SITE == 'Y') {
            var opts = [];
            var lst = this.viewBag.InitDatas.OtherEstablishment;
            opts.push(['', res.BTN00176]);
            lst.forEach(function (o) {
                opts.push([o.BUSINESS_NO, o.COM_DES]);
            });

            form.add(ctrl.define("widget.select", "txtOtherEstablishment", "BUSINESS_NO", res.LBL02794)
                .option(opts)
                .select('')
                .end());
        }

        form.add(ctrl.define("widget.multiCode.deptLevelGroup", "txtTreeDeptCd", "SITE_CD_TREE", res.LBL07531)
            .setOptions({ label: null })
            .end());

        form.add(ctrl.define('widget.radio', 'rdActive', 'CANCEL', res.LBL35244, null)
            .label([res.LBL02475, res.LBL01448, res.BTN00204])
            .value([activeFlag, "N", "Y"]) // All / Use /Temp Delete
            .select("N")
            .end());           //Active

        form.add(ctrl.define("widget.checkbox", "cbEtcVal", "BASE_DATE_CHK", res.LBL00870).label([res.LBL10548]).end()); // Other

        // 데이터백업 관련 항상 열림 추가
        form.setOptions({ showFormLayer: (["1"].contains(this.isShowSearchForm || "")) ? true : false /* 검색 창 접기 */ });
        // Toolbar
        if (this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 숨기기 - 2019.11.26 김봉기 
            toolbar
                .setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true })
            switch (this.viewBag.DefaultOption.ManagementType) {
                case "BA": // BA:Excel, UF:자료올리기형태, ZI:백업, AT:첨부파일, SD:조건삭제
                    toolbar.addLeft(ctrl.define("widget.button", "excelDownload").css("btn btn-sm btn-primary").label(ecount.resource.BTN00863));
                    break;
                case "SD":
                    toolbar.addLeft(ctrl.define("widget.button", "dmDelete").css("btn btn-sm btn-primary").label(ecount.resource.BTN00033));
                    break;
            }
        }
        else {
            toolbar
                .setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true }) //중요 ignorePrimaryButton 확인
                .addLeft(ctrl.define('widget.button', 'search').css('btn btn-sm btn-primary').label(res.BTN00113))
                .addLeft(ctrl.define("widget.button", "reset").label(res.BTN00007)); //다시작성
        }
        // Content
        contents
            .add(form)
            .add(toolbar);

        // Header
        if (this.viewBag.DefaultOption.ManagementType =='BA') {
            header
            .setTitle(ecount.resource[this.viewBag.DefaultOption.BackupObj.RESX_CODE])
            .notUsedBookmark()
            .addContents(contents);
        } else if (this.viewBag.DefaultOption.ManagementType == 'SD') {
            header
                .setTitle(String.format(res.LBL07530))
                .notUsedBookmark()
                .addContents(contents);
        }
        else {
            header
            .setTitle(String.format(res.LBL00064, res.LBL07530))
            .useQuickSearch()
            .add('search', null, false) //중요 null, false 확인
            .add("option", [
                { id: "SelfCustomizing", label: res.LBL01457 },
                { id: "ListSettings", label: res.BTN00330 },
                { id: "TotalDelete", label: res.BTN00427}

            ], false)
            .addContents(contents);
        }
        
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            grid = g.grid(),
            form = g.form();

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 그리드 숨기기 - 2019.11.26 김봉기 
            grid.setRowData(this.viewBag.InitDatas.ListDeptLoad);
        }
        // Initialize Grid
        grid.setRowDataUrl("/SVC/Account/Basic/GetSiteList")
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setKeyColumn(['SITE'])
            .setColumnFixHeader(true)
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(ecount.resource.MSG02158, maxcount)) })
            .setColumnFixHeader(true)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))
            .setColumnSortDisableList(['SITE.MENU', 'ACC001.COM_DES'])

            // Shaded
            .setEventShadedColumnId(['SITE.SITE'], { isAllRememberShaded: true })

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCustomRowCell('SITE.SITE', this.setGridDataLink.bind(this))
            .setCustomRowCell('SITE.SITE_DES', this.setGridDataLink.bind(this))
            .setCustomRowCell('SITE.MENU', this.setMenuColumn.bind(this))
            .setCustomRowCell('SITE.CANCEL', this.setActiveColumn.bind(this));

        contents.add(form)
            .addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Tree").label(ecount.resource.BTN00265).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
        toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050).end());

        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터관리에서 넘어 온경우 하단 버튼 숨기기 - 2019.11.26 김봉기 
            footer.add(toolbar);
        }
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setFocus(0);
        }
        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 685
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus && !this.viewBag.DefaultOption.ManagementType) { // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setValue(this.searchFormParameter.Request.Data.PARAM);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    // [Quick Search] event
    onHeaderQuickSearch: function (e) {
        this.searchFormParameter.Request.Data.PARAM = this.header.getQuickSearchControl().getValue();
        this.dataSearch(e);
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {

        if (page.controlID == 'batchDelete') {
            debugger;
            this.dataSearch();
            message.callback && message.callback();
            if (this.header.getQuickSearchControl()) {
                this.searchFormParameter.Request.Data.PARAM = this.header.getQuickSearchControl().getValue();
            }
            formData = Object.toJSON(this.searchFormParameter);
            ecount.common.api({
                url: "/ECAPI/SVC/SelfCustomize/DataManagement/DeleteForDataManagement",
                data: formData,
                success: function (result) {
                    
                }.bind(this),
            });
            if (this.popupID) {
                this.close();
            }
            ecount.alert(String.format(ecount.resource.MSG09849, message.menuTitle));  
        }

        switch (page.pageID) {
            case "CM100P_02":
                this.reloadPage();
                break;
            case "EBA004M":
                this._ON_REDRAW();
                break;
        }
    },

    /**
    * reload the grid 
    **/
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload();
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.Request.Data.SORT_COLUMN = data.columnId;
        this.searchFormParameter.Request.Data.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // Set Code link for modify popup
    setGridDataLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";

        var self = this;

        option.event = {
            'click': function (e, data) {

                var params = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 285,
                    SITE_CD: data.rowItem['SITE']
                };

                //Open popup
                this.openWindow({
                    url: '/ECERP/EBA/EBA004M',
                    name: String.format(ecount.resource.LBL06434, ecount.resource.LBL07530),
                    param: params,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/
    // Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: 750,
            height: this.selfCustomizingHeight,
            PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/ESC/ESC002M',
            name: ecount.resource.LBL01457,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
        });
    },

    //전체삭제
    onDropdownTotalDelete: function (e) {

        var param = {
            width: 400,
            height: 380,
            headerTitle: ecount.resource.LBL02484,
            contentsTitle: ecount.resource.MSG09785,
            menuTitle: ecount.resource.LBL07530,
            inputPath: "batchDelete",
            controlID: "batchDelete"
        };
        this.openWindow({
            url: "/ECERP/SVC/Popup/CM030P",
            param: param,
            popType: false,
            additional: false
        });

    },

    onDropdownListSettings: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: this.formTypeCode,
            isSaveAfterClose: true, // Save and close
            FORM_SEQ: 1
        };
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },


    //NEW button click event
    onFooterNew: function (e) {
        var btnNew = this.footer.get(0).getControl("New");

        if (this.viewBag.Permission.Permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93032, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnNew.setAllowClick();
            return false;
        }

        var params = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 285
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/EBA/EBA004M',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL07530),
            param: params,
            popupType: false,
            additional: false
        });

        btnNew.setAllowClick();
    },

    //TREE button click event
    onFooterTree: function (e) {
        this.footer.get(0).getControl("Tree").setAllowClick();

        if (this.userFlag != "M" && this.ALL_GROUP_SITE == "1") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        if (this.viewBag.Permission.PermitTree.Value == "X") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07531, PermissionMode: "R" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        // Define data transfer object
        var params = {
            width: 900,
            height: 600,
            Type: "CREATE"
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA056M',
            name: ecount.resource.LBL07531,
            param: params,
            popupType: false,
            additional: false
        });
    },

    // Excel click event
    onFooterExcel: function () {
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
            ecount.alert(message);
            return false;
        }
        var self = this;
        var res = ecount.resource;
        self.searchFormParameter.Request.Data.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.Request.Data.EXCEL_FLAG = "Y";
        self.EXPORT_EXCEL({
            url: "/SVC/Account/Basic/GetSiteListExcel",
            param: self.searchFormParameter
        });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        this.SiteList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93032, PermissionMode: "D" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.SiteList += data.SITE + ecount.delimiter;
            });

            if (self.SiteList.lastIndexOf(ecount.delimiter) == (self.SiteList.length - 1))
                self.SiteList = self.SiteList.slice(0, -1);

            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }
            //self.showProgressbar();

            //삭제함수
            self.callDeleteListApi(self.SiteList, selectItem);

            //self.showProgressbar(false);
        });
    },
    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F2 click
    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/

    //Set value for [Menu] column
    setMenuColumn: function (value, rowItem) {
        var option = {};
        var menu = "";

        if (rowItem.ACCT_CHK == "Y")
            menu += ecount.resource.LBL03146 + " ";
        if (rowItem.PAY_CHK == "Y")
            menu += ecount.resource.LBL04189 + " ";
        if (rowItem.EGW_CHK == "Y")
            menu += ecount.resource.LBL00757 + " ";

        menu = menu.trim();
        option.data = menu;
        return option;
    },

    //Set value for [Active] column
    setActiveColumn: function (value, rowItem) {
        var option = {};

        if (rowItem.CANCEL == "Y")
            option.data = ecount.resource.LBL00243;
        else
            option.data = ecount.resource.LBL08030;

        return option;
    },

    // Set background color for Deactivated rows
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    },

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    reloadPage: function (param) {
        var params = {
            url: "/ECERP/EBA/EBA003M",
            formdata: $.extend({}, this.header.extract().merge()),
            param: this.searchFormParameter
        };

        this.onAllSubmit(params);
    },


    //삭제 처리
    callDeleteListApi: function (Data, selectItem) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("SelectedDelete");
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val)
            }
        });

        var formdata = {
            DeleteCodes: {
                MENU_CODE: "Dept",          //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                CHECK_TYPE: "A",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드
            }
        };

        ecount.common.api({
            url: "/Account/Basic/DeleteSelectedSite",
            data: Object.toJSON(formdata),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else if (result.Data != null && result.Data != "") {
                    //삭제불가 코드리스트 팝업창 연결                    
                    self.ShowNoticeNonDeletable(result.Data);

                    //체크해제
                    for (var idx = 0, limit = selectItem.length; idx < limit; idx++) {
                        self.contents.getGrid().grid.removeChecked(selectItem[idx][ecount.grid.constValue.keyColumnPropertyName]);
                    }

                    //그리드 리로드
                    self.contents.getGrid().draw(self.searchFormParameter);
                }
                else {

                    //그리드 로우 삭제
                    self.contents.getGrid().grid.removeCheckedRow();

                    self.contents.getGrid().draw(self.searchFormParameter);
                }
            },
            complete: function (e) {
                //self.hideProgressbar();
                btnDelete.setAllowClick();
            }
        });
    },

    //삭제불가 메세지 팝업창
    ShowNoticeNonDeletable: function (data) {

        this.errDataAllKey = null;
        this.errDataAllKey = new Array();

        //그리드 리로드후 삭제되지 않은 코드들 체크하기 위해 담아둠 (=> onGridRenderComplete에서 체크로직 진행)
        for (var i = 0; i < data.length; i++) {
            this.errDataAllKey.push(data[i].CHECK_CODE);
        }

        var param = {
            width: 520,
            height: 300,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: "Dept"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnDepartment(this.getSelectedListforActivate("N"), 'A');
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnDepartment(this.getSelectedListforActivate("Y"), 'D');
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                SITE: data.SITE,
                CANCEL: cancelYN,
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnDepartment: function (updatedList, isAction) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.Permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93032, PermissionMode: isAction === 'D' ? 'D' : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/Account/Basic/UpdateListActiveSite",
            data: Object.toJSON(updatedList),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.searchFormParameter);
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },

    // header Search button click event
    onHeaderSearch: function (forceHide) {
        this.searchFormParameter.Request.Data.PARAM = "";
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.header.getQuickSearchControl().setValue(this.searchFormParameter.Request.Data.PARAM);
        }

        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }
    },
    // 조건별 삭제
    onHeaderDmDelete: function () {
        var param = {
            width: 400,
            height: 380,
            headerTitle: ecount.resource.LBL02484,
            contentsTitle: ecount.resource.MSG09785,
            menuTitle: ecount.resource.LBL07530,
            inputPath: "batchDelete",
            controlID: "batchDelete"
        };
        
        this.openWindow({
            url: "/ECERP/SVC/Popup/CM030P",
            param: param,
            popType: false,
            additional: false
        });

    },

    // reset Search Form
    onHeaderReset: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },

    // 데이터관리 > Excel 다운로드
    onHeaderExcelDownload: function (e) {
        var _obj = this.viewBag.DefaultOption.BackupObj;
        var _self = this;

        _self.showProgressbar();
        _self.dataSearch();

        // 페이징 파라미터 세팅
        _self.searchFormParameter.Request.Data.PAGE_SIZE = 10000;
        _self.searchFormParameter.Request.Data.PAGE_CURRENT = 1;
        _self.searchFormParameter.Request.Data.LIMIT_COUNT = 100000;
        _self.searchFormParameter.Request.Data.EXCEL_FLAG = "N";
        _self.searchFormParameter.Request.Data.IS_FROM_BACKUP = true;

        var invalid = _self.header.validate();

        if (invalid.result.length > 0) {
            this.header.toggleContents(true, function () {
                invalid.result[0][0].control.setFocus(0);
            });
            _self.hideProgressbar();
            return;
        }

        ecount.common.api({
            url: "/ECAPI/SVC/SelfCustomize/DataManagement/DataBackupRequest",

            data: Object.toJSON({
                BackupObj: _obj,
                KEY: _obj.KEY + "|" + _self.viewBag.DefaultOption.ManagementType,
                pageSessionKey: _self.viewBag.DefaultOption.SessionKey,
                ManagementType: _self.viewBag.DefaultOption.ManagementType,
                PARAM: _self.searchFormParameter.Request.Data
            }),

            success: function (result) {
                _self.hideProgressbar();
                _self.close();
            },
            error: function (result) {
                _self.footer.getControl("excelDownload") && _self.footer.getControl("excelDownload").setAllowClick();
            }
            .bind(_self)
        });
    },      

    dataSearch: function (e) {
        // 검색조건 validate 
        var self = this,
            invalid = self.header.validate();

        if (invalid.result.length > 0) {
            this.header.toggleContents(true, function () {
                invalid.result[0][0].control.setFocus(0);
            });
            return;
        }

        var gridObj = self.contents.getGrid("dataGrid"),
            settings = gridObj.settings;

        // search parameter setting
        self.setGridParameter(settings);
        gridObj.grid.removeShadedColumn();
        if (!this.viewBag.DefaultOption.ManagementType) {       // 데이터 백업에서 온경우 draw 하지 않음
            gridObj.draw(self.searchFormParameter);
        } else {
            
        }
        this.header.toggle(true);
    },

    // grid parameter setting 
    setGridParameter: function (settings) {
        // Grid Setting & Search        
        settings.setPagingCurrentPage(1); //Paging Page 1
        searchParam = $.extend({}, this.searchFormParameter.Request.Data, this.header.serialize().result);
        searchParam.PARAM = this.searchFormParameter.Request.Data.PARAM;
        searchParam.BASE_DATE_CHK = (searchParam.BASE_DATE_CHK != null && searchParam.BASE_DATE_CHK != undefined && searchParam.BASE_DATE_CHK.length > 0) ? true : false;

        // Set param CANCEL
        if (searchParam.CANCEL.indexOf(ecount.delimiter) > -1) {
            searchParam.CANCEL = "";
        }

        settings.setHeaderTopMargin(this.header.height())
            .setRowDataParameter(searchParam);

        // 조회 당시 컨트롤 정보
        this.finalHeaderSearch = this.header.extract(true).merge();

        this.searchFormParameter.Request.Data = searchParam;
    },

    // F3 click - 서치클릭
    ON_KEY_F3: function (e) {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onHeaderClose();
        }
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Save button
        if (target != null && target.cid == "search" && !this.viewBag.DefaultOption.ManagementType) {
            this.onHeaderSearch(false);
        }
    },

    // F8 click
    ON_KEY_F8: function (e) {
        if (!this.viewBag.DefaultOption.ManagementType) {   // 데이터 백업에서 넘어 온경우 적용하지 않음
            this.onHeaderSearch(false);
        }        
    },
});