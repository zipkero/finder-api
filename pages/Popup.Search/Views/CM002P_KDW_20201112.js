window.__define_resource && __define_resource("LBL06434","LBL02282","LBL10731","LBL10732","LBL01409","LBL11353","LBL03330","LBL02286","LBL06158","LBL03786","LBL00485","LBL02684","LBL05668","LBL05669","LBL05670","LBL05671","LBL00630","LBL05672","BTN00113","BTN00351","BTN00007","LBL00653","LBL03209","LBL00655","LBL00754","LBL06622","LBL06623","LBL08493","LBL06825","LBL03142","MSG02158","BTN00069","BTN00033","LBL13072","BTN00008","BTN00043","LBL00921","BTN00050","BTN00959","BTN00204","BTN00203","MSG00962","MSG00303","MSG00299","LBL01408","MSG00141","LBL03176","LBL35244","BTN00603","LBL93292","MSG00213");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 거래처 그룹 팝업
4. Precaution  : 
5. History     : 
            2015.08.25 (강성훈) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링.
            2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
            2016.06.10 (Soojin Lee) A16_00405 자가사용유형등록 신규,수정,선택삭제 팝업에서 가능하도록
            2016.07.05 (Soojin Lee) A16_01211 자가사용유형등록 엑셀변환 추가
            2016.09.22 (이일용) 불량처리입력 추가개발
            2017.02.20 (이일용) 조회, 현황에서 호출시에 [변경]버튼 숨김처리.
            2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
            2020.11.17 (김대원) - A20_02837 - 불량유형 3.0 적용 - Acc009 공통팝업 개발
****************************************************************************************************/
//ecount.page.factory("ecount.page.popup.type2", "CM002P", {
//    /********************************************************************** 
//    * page init 
//    **********************************************************************/
//    init: function (options) {

//        this._super.init.apply(this, arguments);
//        this.initProperties();
//    },

//    initProperties: function () {
//        this.searchFormParameter = {
//            CODE_CLASS: this.custGroupCodeClass
//            , PARAM: this.keyword
//            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
//            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
//            , SORT_COLUMN: "CODE_NO"
//            , PAGE_SIZE: 100
//            , PAGE_CURRENT: 0
//            , ListFlag: this.ListFlag == "List" ? true : false
//        };

//        //Get Permission 
//        this.permission = this.viewBag.Permission.permit;

//        this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL02282);
//    },

//    render: function () {

//        this.setLayout({ columns: [{ width: 200 }, { width: 200 }] });
//        this._super.render.apply(this);
//    },

//    /**********************************************************************
//    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
//    **********************************************************************/
//    //헤더 옵션 설정
//    onInitHeader: function (header, resource) {
//        header.notUsedBookmark();
//        header.setTitle(ecount.resource.LBL10731).useQuickSearch();  //거래처그룹 I

//        if (this.custGroupCodeClass == "A12") {
//            this.menuTitle = ecount.resource.LBL10732;
//            header.setTitle(ecount.resource.LBL10732)  //거래처그룹 II
//        }

//        if (this.custGroupCodeClass == "S09" && this.ListFlag == "List") {
//            this.menuTitle = ecount.resource.LBL01409;
//            header.setTitle(ecount.resource.LBL11353)  //불량유형리스트
//        }
//        else if (this.custGroupCodeClass == "S09") {
//            this.menuTitle = ecount.resource.LBL01409;
//            header.setTitle(ecount.resource.LBL03330)  //불량유형검색
//        }

//        if (this.custGroupCodeClass == "S20") {
//            this.menuTitle = ecount.resource.LBL02286;
//            header.setTitle(ecount.resource.LBL06158)  //재고1 > 자가사용입력 > 하단 사용유형
//        }
//        if (this.custGroupCodeClass == "I01") {
//            this.menuTitle = ecount.resource.LBL03786;
//            header.setTitle(ecount.resource.LBL03786);//Title / Position
//        }
//        //

//        if (this.custGroupCodeClass == "S10") {
//            this.menuTitle = ecount.resource.LBL00485;
//            header.setTitle(ecount.resource.LBL00485);
//        }

//        if (this.custGroupCodeClass == "I10") {
//            this.menuTitle = ecount.resource.LBL02684;
//            header.setTitle(ecount.resource.LBL02684);//Title
//        }
//        if (this.custGroupCodeClass == "I02") {
//            this.menuTitle = ecount.resource.LBL05668;
//            header.setTitle(ecount.resource.LBL05668);//Employment Type
//        }
//        if (this.custGroupCodeClass == "I03") {
//            this.menuTitle = ecount.resource.LBL05669;
//            header.setTitle(ecount.resource.LBL05669);//Qualification
//        }
//        if (this.custGroupCodeClass == "I04") {
//            this.menuTitle = ecount.resource.LBL05670;
//            header.setTitle(ecount.resource.LBL05670);//Language
//        }
//        if (this.custGroupCodeClass == "I05") {
//            this.menuTitle = ecount.resource.LBL05671;
//            header.setTitle(ecount.resource.LBL05671);//Prize
//        }
//        if (this.custGroupCodeClass == "I06") {
//            this.menuTitle = ecount.resource.LBL00630;
//            header.setTitle(ecount.resource.LBL00630);//Education
//        }
//        if (this.custGroupCodeClass == "I30") {
//            this.menuTitle = ecount.resource.LBL05672;
//            header.setTitle(ecount.resource.LBL05672);//Reassignment Type
//        }

//        if (this.isIncludeInactive) {
//            //퀵서치 추가
//            var contents = widget.generator.contents(),
//                tabContents = widget.generator.tabContents(),
//                form1 = widget.generator.form(),
//                form2 = widget.generator.form(),
//                toolbar = widget.generator.toolbar();
//            var ctrl = widget.generator.control();

//            //검색하단 버튼
//            //toolbar
//            //    .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

//            ////if (this.isIncludeInactive && this.searchFormParameter.USE_GUBUN == "Y") {
//            //if (this.isIncludeInactive) {
//            //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
//            //}
//            toolbar.addLeft(ctrl.define("widget.button.group", "search")
//                .label(ecount.resource.BTN00113)
//            );

//            //검색하단 버튼
//            toolbar
//                .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

//            var codeNo = this.custGroupCodeClass == "S20" ? ecount.resource.LBL00653 : ecount.resource.LBL03209;
//            var codeDes = this.custGroupCodeClass == "S20" ? ecount.resource.LBL00655 : ecount.resource.LBL00754;

//            if (this.custGroupCodeClass == "S10") {
//                codeNo = ecount.resource.LBL06622;
//                codeDes = ecount.resource.LBL06623;
//            }

//            //창고코드, 창고명 검색어
//            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", codeNo).end())
//                .add(ctrl.define("widget.input.codeName", "search2", "search2", codeDes).end())

//            //this.onInitHeader.getControl("search3").hide();

//            contents.add(form1);    //검색어
//            contents.add(toolbar);  //버튼

//            header.add("search")
//                .addContents(contents);
//        }
//    },

//    //본문 옵션 설정
//    onInitContents: function (contents, resource) {
//        var generator = widget.generator,
//            toolbar = generator.toolbar(),
//            ctrl = generator.control(),
//            settings = generator.grid()

//        var codeNo = ecount.resource.LBL03209;
//        var codeDes = ecount.resource.LBL00754;

//        switch (this.custGroupCodeClass) {
//            case "S20":
//                codeNo = ecount.resource.LBL03209;
//                codeDes = ecount.resource.LBL00655;
//                break;
//            case "S09":
//                codeNo = ecount.resource.LBL08493;
//                codeDes = ecount.resource.LBL06825;
//                break;
//            case "S10":
//                codeNo = ecount.resource.LBL06622;
//                codeDes = ecount.resource.LBL06623;
//                break;
//            default:
//                break;
//        }

//        console.log("codeDes:" + codeDes);
//        settings
//            .setRowData(this.viewBag.InitDatas.CustGroupLoad)
//            .setRowDataUrl('/Account/Basic/GetListCustGroupForSearch')
//            .setRowDataParameter(this.searchFormParameter)
//            .setKeyColumn(['CODE_NO', 'CODE_DES'])
//            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
//            .setColumns([
//                { propertyName: 'CODE_NO', id: 'CODE_NO', title: codeNo, width: '' },
//                { propertyName: 'CODE_DES', id: 'CODE_DES', title: codeDes, width: '' },
//                { propertyName: 'EXCHANGE_RATE', id: 'EXCHANGE_RATE', title: ecount.resource.LBL03142, width: '', isHideColumn: ['S10'].contains(this.custGroupCodeClass) ? false : true }
//            ])
//            .setColumnSortable(true)
//            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
//            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
//            .setCheckBoxMaxCountExceeded(function (e) {
//                ecount.alert(String.format(ecount.resource.MSG02158, e));
//            })
//            .setCustomRowCell('CODE_NO', this.setGridDateLink.bind(this))
//            .setCustomRowCell('CODE_DES', this.setGridDateLink.bind(this))
//            .setCustomRowCell('EXCHANGE_RATE', this.setGridDateExchangeRate.bind(this))
//            .setCustomRowCell('CHK_H', this.setCheckBoxChecked.bind(this))
//            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
//            .setKeyboardCursorMove(true)                // 위, 아래 방향키
//            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
//            .setKeyboardPageMove(true)                  // 페이징 이동
//            .setKeyboardEnterForExecute(true)
//            .setCheckBoxActiveRowStyle(true)
//            .setPagingUse(true)
//            .setPagingUseDefaultPageIndexChanging(true)
//            .setPagingRowCountPerPage(100, true)
//            .setCheckBoxMaxCount(this.checkMaxCount || 100);
//        contents
//            .add(toolbar)
//            .addGrid("dataGrid" + this.pageID, settings);
//    },

//    //풋터 옵션 설정
//    onInitFooter: function (footer, resource) {
//        var toolbar = widget.generator.toolbar(),
//            ctrl = widget.generator.control(),
//            keyHelper = [10];

//        if (this.isApplyDisplayFlag) {
//            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
//            if (this.viewBag.DefaultOption.popupEditMode == "02") {
//                toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033));
//            }
//        }
//        else
//            keyHelper.push(11);

//        if (["S20", "S09", "I30", "I02", "I01"].contains(this.custGroupCodeClass) && !this.searchFormParameter.ListFlag) {
//            if (this.isNewDisplayFlag) {
//                toolbar.addLeft(ctrl.define("widget.button", "modify").label(ecount.resource.LBL13072));
//            }
//            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
//        } else if (["S20", "S09", "I30", "I02", "I01"].contains(this.custGroupCodeClass) && this.searchFormParameter.ListFlag) {
//            toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043))
//            toolbar.addLeft(ctrl.define("widget.button", "Pre").label(ecount.resource.LBL00921))//이전
//            if (["S20", "S09"].contains(this.custGroupCodeClass) && !this.searchFormParameter.ListFlag) {
//                toolbar.addLeft(ctrl.define("widget.button", "Excel").label(ecount.resource.BTN00050))
//            }

//            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
//                .addGroup([
//                    { id: "Deactivate", label: ecount.resource.BTN00204 },
//                    { id: 'selectedDelete', label: ecount.resource.BTN00033 },
//                    { id: "Activate", label: ecount.resource.BTN00203 }
//                ]).css("btn btn-default")
//                .noActionBtn().setButtonArrowDirection("up"));
//            toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
//        }
//        else {
//            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
//        }

//        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

//        footer.add(toolbar);
//    },

//    // Init Control
//    onInitControl: function (cid, option) {

//        switch (cid) {
//            case "search":
//                if (this.isIncludeInactive) {
//                    option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
//                }
//                break;
//            default:
//                break;
//        }
//    },

//    /**********************************************************************
//    * event form listener [tab, content, search, popup ..]
//    **********************************************************************/
//    onLoadComplete: function (e) {
//        this.searchFormParameter.CODE_CLASS = this.custGroupCodeClass == null ? "A11" : this.custGroupCodeClass;

//        if (!$.isNull(this.keyword)) {
//            //this.contents.getControl('search').setValue(this.keyword);
//            this.header.getQuickSearchControl().setValue(this.keyword);
//        }
//        var grid = this.contents.getGrid();
//        grid.getSettings().setHeaderTopMargin(this.header.height());
//        if (!e.unfocus) {
//            //this.contents.getControl("search").onFocus(0);
//            this.header.getQuickSearchControl().setFocus(0);
//        }
//    },

//    //재로드
//    fnReload: function (e) {

//        this.searchFormParameter.CODE_CLASS = this.custGroupCodeClass == null ? "A11" : this.custGroupCodeClass;
//        this.searchFormParameter.DEL_FLAG = "Y";

//        if (!$.isNull(this.keyword)) {
//            this.header.getQuickSearchControl().setValue(this.keyword);
//        }

//        this.header.getQuickSearchControl().setFocus(0);

//        if (e != undefined) {
//            var grid = this.contents.getGrid();
//            grid.getSettings().setHeaderTopMargin(this.header.height());
//            grid.draw(this.searchFormParameter);
//        }
//    },

//    /********************************************************************** 
//    * event grid listener [click, change...] 
//    **********************************************************************/
//    onGridInit: function (e, data) {
//        this._super.onGridInit.apply(this, arguments);
//    },

//    //체크박스 체크갯수 제한
//    setItemCountMessage: function (count) {
//        ecount.alert(String.format(ecount.resource.MSG02158, count));
//    },

//    //정렬
//    setColumnSortClick: function (e, data) {
//        this.searchFormParameter.SORT_COLUMN = data.columnId;
//        this.searchFormParameter.SORT_TYPE = data.sortOrder;

//        //if (this.searchFormParameter.ListFlag == true) {
//        //    this.searchFormParameter.DEL_FLAG = "Y";
//        //    this.searchFormParameter.LIST_FLAG = "Y";
//        //}
//        //else
//        //    this.searchFormParameter.LIST_FLAG = "N";

//        this.searchFormParameter.LIST_FLAG = "Y";

//        this.contents.getGrid().draw(this.searchFormParameter);
//    },

//    // 환율
//    setGridDateExchangeRate: function (value, rowItem) {
//        var option = {};
//        var data = value;
//        if (!$.isEmpty(value)) {
//            var decimal = data.toString().split(".").length > 1 ? data.toString().split(".")[1].length : 0;
//            data = String.fastFormat(data, { fractionLimit: decimal, removeFractionIfZero: false });

//        }
//        option.data = data;
//        return option;
//    },
//    //grid row의 특정 date관련  
//    setGridDateLink: function (value, rowItem) {
//        var option = {}, self = this;
//        option.data = value;
//        option.controlType = "widget.link";
//        option.event = {
//            'click': function (e, data) {

//                if (self.custGroupCodeClass == "S20" && self.ListFlag == "List") {
//                    var param = {
//                        width: ecount.infra.getPageWidthFromConfig(),
//                        height: 175,
//                        editFlag: "M",
//                        USE_GUBUN: data.rowItem['USE_GUBUN'],
//                        CODE_NO: data.rowItem['CODE_NO'],
//                        CODE_DES: data.rowItem['CODE_DES'],
//                        CODE_CLASS: "S20",
//                        CLASS_DES: "자가",
//                        WDATE: data.rowItem['WDATE'],
//                        WID: data.rowItem['WID'],
//                        popupType: false,
//                        additional: false
//                    };
//                    // false : Modal , true : pop-up
//                    self.openWindow(
//                        {
//                            url: '/ECERP/ESA/ESA021M',
//                            name: self.HeaserTitlePopUpModify,
//                            param: param
//                        });
//                } else if (self.custGroupCodeClass == "S09" && self.ListFlag == "List") {
//                    var param = {
//                        width: ecount.infra.getPageWidthFromConfig(),
//                        height: 175,
//                        editFlag: "M",
//                        USE_GUBUN: data.rowItem['USE_GUBUN'],
//                        CODE_NO: data.rowItem['CODE_NO'],
//                        CODE_DES: data.rowItem['CODE_DES'],
//                        CODE_CLASS: "S09",
//                        CLASS_DES: "불량",
//                        WDATE: data.rowItem['WDATE'],
//                        WID: data.rowItem['WID'],
//                        popupType: false,
//                        additional: false
//                    };
//                    // false : Modal , true : pop-up
//                    self.openWindow(
//                        {
//                            url: '/ECERP/ESA/ESA021M',
//                            name: self.HeaserTitlePopUpModify,
//                            param: param
//                        });
//                } else if ((self.custGroupCodeClass == "I01" || self.custGroupCodeClass == "I02" || self.custGroupCodeClass == "I30") && self.ListFlag == "List") {
//                    var classDes = "";
//                    if (this.custGroupCodeClass == "I30")
//                        classDes = ecount.resource.LBL05672;
//                    else if (this.custGroupCodeClass == "I02")
//                        classDes = ecount.resource.LBL05668;
//                    else if (this.custGroupCodeClass == "I01")
//                        classDes = ecount.resource.LBL03786;
//                    var param = {
//                        width: ecount.infra.getPageWidthFromConfig(),
//                        height: 175,
//                        editFlag: "M",
//                        USE_GUBUN: data.rowItem['USE_GUBUN'],
//                        CODE_NO: data.rowItem['CODE_NO'],
//                        CODE_DES: data.rowItem['CODE_DES'],
//                        CODE_CLASS: self.custGroupCodeClass,
//                        CLASS_DES: classDes,
//                        WDATE: data.rowItem['WDATE'],
//                        WID: data.rowItem['WID'],
//                        popupType: false,
//                        additional: false
//                    };
//                    // false : Modal , true : pop-up
//                    self.openWindow(
//                        {
//                            url: '/ECERP/ESA/ESA021M',
//                            name: self.HeaserTitlePopUpModify,
//                            param: param
//                        });
//                } else if ((self.custGroupCodeClass == "I01" || self.custGroupCodeClass == "I02" || self.custGroupCodeClass == "I30") && self.ListFlag == "Y") {
//                    var message = {
//                        name: "CODE_DES",
//                        code: "CODE_NO",
//                        data: data.rowItem,
//                        isAdded: true,
//                        addPosition: "current",
//                        index: this.viewBag.DefaultOption.indexEdit,
//                        editMode: this.viewBag.DefaultOption.popupEditMode,
//                        callback: self.close.bind(self)
//                    };
//                    self.sendMessage(self, message);
//                }
//                else {
//                    var message = {
//                        name: "CODE_DES",
//                        code: "CODE_NO",
//                        data: data.rowItem,
//                        isAdded: false,
//                        addPosition: "current",
//                        index: this.viewBag.DefaultOption.indexEdit,
//                        editMode: this.viewBag.DefaultOption.popupEditMode,
//                        callback: self.close.bind(self)
//                    };
//                    self.sendMessage(self, message);
//                }
//            }.bind(this)
//        };
//        return option;
//    },

//    setCheckBoxChecked: function (value, rowItem) {
//        var option = {};
//        if (this.viewBag.DefaultOption.popupEditMode == "02" && this.viewBag.DefaultOption.codeValue.split(",").contains(rowItem.CODE_NO)) {
//            option.attrs = {
//                "checked": "checked"
//            }
//        }
//        return option;
//    },

//    //사용중단row색 변경
//    setRowBackgroundColor: function (data) {
//        if (data['USE_GUBUN'] == "N")
//            return true;
//    },

//    //검색값이 한건일경우 자동으로 입력되도록 
//    onGridRenderComplete: function (e, data, gridObj) {
//        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

//        var value = this.keyword;
//        if (!$.isEmpty(value))
//            this.searchFormParameter.gridRenderFlag = "Y";
//        //if (data.dataCount === 1 && !this.isNewDisplayFlag) {
//        if (data.dataCount === 1 && this.searchFormParameter.gridRenderFlag === "Y") {

//            var obj = {};
//            var rowItem = data.dataRows[0];

//            var message = {
//                name: "CODE_DES",
//                code: "CODE_NO",
//                data: rowItem,
//                isAdded: false,
//                addPosition: "next",
//                index: this.viewBag.DefaultOption.indexEdit,
//                editMode: this.viewBag.DefaultOption.popupEditMode,
//                callback: this.close.bind(this)
//            };
//            this.sendMessage(this, message);
//        }
//        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
//    },

//    /**************************************************************************************************** 
//    * define common event listener    
//    ****************************************************************************************************/
//    // Message Handler
//    onMessageHandler: function (page, message) {

//        if (page.pageID == 'ESA021M') {
//            this.fnReload(1);
//        }
//        message.callback && message.callback();  // The popup page is closed   
//    },
//    /********************************************************************** 
//    * event  [button, link, FN, optiondoropdown..] 
//    **********************************************************************/
//    //버튼 이벤트 클릭전 호출 
//    onBeforeEventHandler: function (e) {
//        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
//        return true;
//    },

//    //적용버튼
//    onFooterApply: function (e) {
//        var selectedItem = this.contents.getGrid().getCheckedItem();
//        if (selectedItem.length == 0) {
//            ecount.alert(ecount.resource.MSG00962);
//            return false;
//        }
//        var message = {
//            name: "CODE_DES",
//            code: "CODE_NO",
//            data: selectedItem,
//            isAdded: this.isCheckBoxDisplayFlag,
//            addPosition: "next",
//            index: this.viewBag.DefaultOption.indexEdit,
//            editMode: this.viewBag.DefaultOption.popupEditMode,
//            callback: this.close.bind(this)
//        };
//        this.sendMessage(this, message);
//    },

//    // Delete buttons event
//    onFooterDelete: function (e) {
//        var message = {
//            Type: "delete",
//            editMode: this.viewBag.DefaultOption.popupEditMode,
//            index: this.viewBag.DefaultOption.indexEdit,
//            callback: this.close.bind(this)
//        };
//        this.sendMessage(this, message);
//    },

//    //닫기버튼
//    onFooterClose: function () {
//        this.close();
//        return false;
//    },

//    onFooterModify: function () {
//        var listFlag = "List";
//        //this.searchFormParameter.DEL_FLAG = "Y";
//        this.searchFormParameter.CODE_CLASS = this.custGroupCodeClass == null ? "A11" : this.custGroupCodeClass;
//        this.onComeAndGoListToSearch(listFlag);

//    },
//    onComeAndGoListToSearch: function (listFlag) {

//        var param = {
//            ListFlag: listFlag,
//            height: 600,
//            isOpenPopup: true,
//            callPageName: "CM002P",
//            __ecPage__: "",
//            _ecParam__: "",
//            isPopFlag: "Y",
//            custGroupCodeClass: this.searchFormParameter.CODE_CLASS, //"S20",
//            isNewDisplayFlag: this.isNewDisplayFlag
//        };

//        if (listFlag == "List")
//            param.isCheckBoxDisplayFlag = true;
//        else {
//            param.isCheckBoxDisplayFlag = false;
//            param.isIncludeInactive = true;
//        }

//        this.onAllSubmitSelf("/ECERP/Popup.Search/CM002P", param, "details");
//    },

//    //신규
//    onFooterNew: function () {
//        var classDes = "자가";
//        if (this.custGroupCodeClass == "S09")
//            classDes = "불량";
//        else if (this.custGroupCodeClass == "I30")
//            classDes = ecount.resource.LBL05672;
//        else if (this.custGroupCodeClass == "I02")
//            classDes = ecount.resource.LBL05668;
//        else if (this.custGroupCodeClass == "I01")
//            classDes = ecount.resource.LBL03786;

//        var params = {
//            width: ecount.infra.getPageWidthFromConfig(),
//            height: 175,
//            editFlag: "I",
//            CODE_CLASS: this.custGroupCodeClass,
//            CLASS_DES: classDes,
//            popupType: false
//        }

//        this.openWindow({
//            url: '/ECERP/ESA/ESA021M',
//            name: this.HeaderTitlePopUp,
//            additional: false,
//            param: params
//        });
//    },

//    //리스트 버튼 (검색 페이지로 이동)
//    onFooterPre: function () {
//        var listFlag = "Search";
//        this.onComeAndGoListToSearch(listFlag);
//    },

//    onFooterDeleteRestore: function (e) {
//        this.footer.get(0).getControl("deleteRestore").setAllowClick();
//    },

//    //선택삭제(SelectedDelete)
//    onButtonSelectedDelete: function (e) {
//        var btnDelete = this.footer.get(0).getControl("deleteRestore");

//        if (this.permission.Value != "W") {
//            btnDelete.setAllowClick();
//            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.menuTitle, PermissionMode: "D" }]);
//            ecount.alert(msgdto.fullErrorMsg);
//            return false;
//        }

//        delItem = this.contents.getGrid().grid.getChecked();
//        uniqueItems = new Array();

//        $.each($.makeArray(delItem), function (i, el) {
//            uniqueItems.push({
//                CODE_NO: el.CODE_NO
//            });
//        });

//        if (!uniqueItems.length) {
//            btnDelete.setAllowClick();
//            ecount.alert(ecount.resource.MSG00303);
//            return false;
//        }

//        var formData = Object.toJSON({
//            Request: {
//                Data: {
//                    CODE_NO_LIST: uniqueItems,
//                    CODE_CLASS: this.custGroupCodeClass //"S20"
//                }
//            }
//        });

//        var strUrl = "/SVC/Common/Infra/DeleteMultiInternalUse";
//        ecount.confirm(ecount.resource.MSG00299, function (isOk) {
//            if (isOk == true) {
//                ecount.common.api({
//                    url: strUrl,
//                    async: false,
//                    data: formData,
//                    success: function (result) {
//                        if (result.Status != "200") {
//                            ecount.alert(result.fullErrorMsg);
//                        } else {
//                            this.fnReload(1);
//                           // this.contents.getGrid().draw(this.searchFormParameter);
//                        }
//                    }.bind(this),
//                    complete: function () {
//                        btnDelete.setAllowClick();
//                    }
//                });
//            } else {
//            }
//            btnDelete.setAllowClick();
//        }.bind(this));
//    },

//    //엑셀버튼
//    onFooterExcel: function () {

//        if (this.custGroupCodeClass == "S20") {
//            this.HeaderTitle = ecount.resource.LBL06158;
//            this.codeHeader = ecount.resource.LBL00653;
//            this.codeDesHeader = ecount.resource.LBL00655;
//        } else if (this.custGroupCodeClass == "S09") {
//            this.HeaderTitle = ecount.resource.LBL01408;
//            this.codeHeader = ecount.resource.LBL08493;
//            this.codeDesHeader = ecount.resource.LBL06825;
//        } else {
//            this.HeaderTitle = ecount.resource.LBL10731;
//            this.codeHeader = ecount.resource.LBL03209;
//            this.codeDesHeader = ecount.resource.LBL00754;
//        }

//        var self = this;

//        // Check user authorization
//        if (!ecount.config.user.USE_EXCEL_CONVERT) {
//            ecount.alert(ecount.resource.MSG00141);
//            return false;
//        }
//        self.searchFormParameter.SheeNM = self.HeaderTitle;
//        self.searchFormParameter.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
//        self.searchFormParameter.Columns = [
//            { propertyName: 'CODE_NO', id: 'CODE_NO', title: this.codeHeader, width: '' },
//            { propertyName: 'CODE_DES', id: 'CODE_DES', title: this.codeDesHeader, width: '' }
//            //{ propertyName: 'USE_GUBUN', id: 'USE_GUBUN', title: ecount.resource.LBL35244, width: '', align: 'center' }
//        ];

//        self.searchFormParameter.EXCEL_FLAG = "Y";
//        self.EXPORT_EXCEL({
//            url: "/Account/Basic/GetListInternalUseBySearchForExcel",
//            param: self.searchFormParameter
//        });

//    },

//    onHeaderSearch: function (event) {
//        this.onContentsSearch('button');
//    },

//    onHeaderUsegubun: function (event) {
//        if (this.searchFormParameter.DEL_FLAG == "Y")
//            this.searchFormParameter.DEL_FLAG = "N";
//        else
//            this.searchFormParameter.DEL_FLAG = "Y";

//        this.onContentsSearch('button');
//    },

//    onButtonUsegubun: function (event) {
//        if (this.searchFormParameter.DEL_FLAG == "Y")
//            this.searchFormParameter.DEL_FLAG = "N";
//        else
//            this.searchFormParameter.DEL_FLAG = "Y";

//        this.onContentsSearch('button');
//    },

//    onHeaderReset: function (event) {
//        this.header.reset();
//        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
//    },

//    //검색, 사용중단 
//    onContentsSearch: function (event) {

//        //var invalid = this.contents.getControl("search").validate();
//        //if (invalid.length > 0) {
//        //    this.contents.getControl("search").setFocus(0);
//        //    return;
//        //}
//        var value = this.header.getQuickSearchControl().getValue();
//        var value2 = "";
//        var value3 = "";

//        if (this.isIncludeInactive) {
//            value2 = this.header.getControl("search1").getValue();
//            value3 = this.header.getControl("search2").getValue();
//        }
//        this.searchFormParameter.PARAM = "";
//        this.searchFormParameter.PARAM2 = value2;
//        this.searchFormParameter.PARAM3 = value3;

//        this.searchFormParameter.gridRenderFlag = "Y";

//        //if (this.searchFormParameter.ListsFlag)
//        //    this.searchFormParameter.LIST_FLAG = "Y";
//        //else
//        //    this.searchFormParameter.LIST_FLAG = "N";

//        this.searchFormParameter.LIST_FLAG = "Y";

//        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
//        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

//        //if (this.isIncludeInactive) {
//        //    //this.searchFormParameter.DEL_FLAG = event.status;
//        //    if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
//        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
//        //    }
//        //    else {
//        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
//        //    }
//        //}
//        var btnSearch = this.header.getControl("search");
//        if (this.isIncludeInactive) {
//            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
//                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
//                btnSearch.removeGroupItem("usegubun");
//                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
//            }
//            else {
//                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
//                btnSearch.removeGroupItem("usegubun");
//                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
//            }
//        }

//        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
//        this.contents.getGrid().draw(this.searchFormParameter);
//        this.header.getQuickSearchControl().setFocus(0);
//        this.header.getQuickSearchControl().setValue("");
//        //this.contents.getControl("search").setFocus(0);

//        this.header.toggle(true);
//    },

//    onHeaderQuickSearch: function (event) {
//        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

//        if (this.isIncludeInactive) {
//            if (this.header.getControl("search1").getValue() == "")
//                this.searchFormParameter.PARAM2 = "";

//            if (this.header.getControl("search2").getValue() == "")
//                this.searchFormParameter.PARAM3 = "";
//        }

//        this.searchFormParameter.gridRenderFlag = "Y";

//        var grid = this.contents.getGrid();
//        grid.getSettings().setPagingCurrentPage(1);
//        grid.draw(this.searchFormParameter);
//    },

//    /********************************************************************** 
//    *  hotkey [f1~12, 방향키등.. ] 
//    **********************************************************************/
//    // ON_KEY_F2
//    ON_KEY_F2: function () {
//        if (this.searchFormParameter.ListFlag)
//            this.onFooterNew();
//    },

//    // ON_KEY_F8
//    ON_KEY_F8: function () {
//        if (this.header.isVisible()) {
//            this.onContentsSearch('button', '');
//        }
//        else if (this.isApplyDisplayFlag)
//            this.onFooterApply();
//    },

//    // ON_KEY_ENTER
//    ON_KEY_ENTER: function (e, target) {
//        target && this.onContentsSearch(target.control.getValue());
//    },

//    // onMouseupHandler
//    onMouseupHandler: function () {
//        //
//        //var gridObj = this.contents.getGrid().grid;
//        //this.setTimeout(function () { gridObj.focus(); }, 0);
//    },

//    // ON_KEY_TAB
//    ON_KEY_TAB: function () {
//        var gridObj = this.contents.getGrid().grid;
//        this.setTimeout(function () { gridObj.focus(); }, 0);
//    },
//    // (Activate button click event)
//    onButtonActivate: function (e) {
//        this.updateActiveYn(this.getSelectedListforActivate("Y"));
//    },

//    // (DeActivate button click event)
//    onButtonDeactivate: function (e) {
//        this.updateActiveYn(this.getSelectedListforActivate("N"));
//    },

//    //(the function for get checked list in order to update CANCEL column (use y/n))
//    getSelectedListforActivate: function (cancelYN) {
//        var selectItem = this.contents.getGrid().grid.getChecked();
//        var codeClass = this.custGroupCodeClass;
//        var updatedList = {
//            Data: []
//        };

//        $.each(selectItem, function (i, data) {
//            updatedList.Data.push({
//                CODE_CLASS: codeClass,
//                CODE_NO: data.CODE_NO,
//                USE_GUBUN: cancelYN,
//            });
//        });

//        return updatedList;
//    },

//    // (activate or deactivate the customer)
//    updateActiveYn: function (updatedList) {

//        var btn = this.footer.get(0).getControl("deleteRestore");
//        if (!this.viewBag.Permission.permit.Value.equals("W")) {
//            btn.setAllowClick();
//            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93292, PermissionMode: "U" }]);
//            ecount.alert(msgdto.fullErrorMsg);
//            return false;
//        }

//        if (updatedList.Data.length == 0) {
//            ecount.alert(ecount.resource.MSG00213);
//            btn.setAllowClick();
//            return;
//        }
//        ecount.common.api({
//            url: "/SVC/Account/Basic/UpdateListUseYnForInternalState",
//            data: Object.toJSON({
//                Request: {
//                    Data: {
//                        CD_LIST : updatedList.Data,
//                        CODE_CLASS: this.custGroupCodeClass
//                    }
//                }
//            }),
//            success: function (result) {
//                if (result.Status != "200") {
//                    ecount.alert(result.fullErrorMsg + result.Data);
//                }
//                else {
//                    this.fnReload(1);
//                }
//            }.bind(this),
//            complete: function (e) {
//                btn.setAllowClick();
//            }
//        });
//    },
//});
