window.__define_resource && __define_resource("BTN00169","LBL01482","BTN00807","LBL35311","BTN00141","LBL01593","MSG04993","LBL10757","LBL08396","LBL09235","LBL00832","BTN00070","LBL09869","LBL04003","LBL06400","LBL09870","LBL05358","LBL12697","LBL05368","LBL00867","LBL17613","LBL17798","BTN00065","LBL02853","BTN00275","BTN00744","BTN00008","BTN00033","BTN00375","LBL10748","LBL04107","LBL10747","LBL12659","MSG00141","BTN00808","BTN00809","MSG06151","LBL07157","LBL03818","LBL03821","LBL03822","LBL09124","MSG01152","MSG07509","MSG05374","LBL09746","MSG01738","MSG04541","MSG00423","MSG01743","MSG04758","LBL09100","MSG06280","LBL12303","LBL12304","LBL10119","LBL07709","LBL02792","LBL10736","LBL10607","MSG07662","MSG04243","MSG04357","LBL08023","LBL04596","LBL03132","LBL01680","LBL01161","LBL00777","LBL02890","LBL02203","LBL02074","LBL03135","LBL01713","LBL01164","LBL00782","LBL02891","LBL05360");
/***********************************************************************************
 1. Create Date : 2016.04.29
 2. Creator     : inho
 3. Description : Template Setup for Status, List and Print(양식설정 현황,리스트,전표용) 
 4. Precaution  :
 5. History     : 2016.12.20(김동수) : isSaveAfterClose 제거
                  2017.02.20(Hao): Fixed Error if input empty for Rows per Page ( Sửa lỗi lưu khi nhập giá trị rỗng cho Rows per Page)
                  2017.05.04(Hao): add formtype SF210
                  2017.05.10(Hao): add formtype SF600
                  2017.05.23(Hao): add formtype SF220
                  2017.06.23(이현우) : 거래관리시스템 작업 ( 판매조회 탭 작업 및 CS_FLAG 추가 ) 
                  2017.07.04(Hao): add formtype SF240
                  2017.07.21(Hao): add formtype SF910, SF920
                  2017.08.04(Hao): add formtype SF530
                  2017.10.19(김승연): FORM TYPE 추가 SO421
                  2017.11.06(Nguyen Duy Thanh): set Fund Status actived for FORM TYPE AO625
                  2017.11.14(임태규): "AO523", "AO524" 예외 추가
                  2017.11.24(왕승양): OR230, OR231 예외처리
                  2017.12.18(TanThanh): Change logic Template Setup for 2 menu: "Cash Report" and "Estimated BOM" (Setting Title and SubTotal customize each tab)
                  2017.12.21(Thien.Nguyen) add logic restore data for Total setup 
                  2017.12.27 - [Duyet]: Add more logic for fixed issue in dev progress post no.604
                  2018.02.05(김우정): 양식설정 용어통일 (삭제 > 숨기기)
                  2018.03.12(tuan): Hot fix Dev. 7465
                  2018.03.15 (LOC) - A17_03024_Test44844(LOC) Set Default Value for Period Display
                  2018.03.31 (DAN) - Add form type SO425
                  2018.04.05 (M.Hoang) - Add form type GO131
                  2018.06.01 (박종국) - A17_00107 - 중국규정에 따른 재무제표 출력물
                  2018.08.07(TanThanh): add formtype TO040
                  2018.12.10(dotrinh): add formtype sf560
                  2018.12.03(이일용): add formtype GO040
                  2019.03.12 (DucThai) A19_00757 - 채무잔액으로 정렬 시 거래처가 여러 줄로 표시되는 문제
                  2019.03.22 (Taind) Add Button Ecount Custom Template (print)
                  2019.07.31 (최용환) : A19_02395 품목 팝업 구조 변경
                  2019.08.08 (김선모) : HGRK_AC_BASIC_CD NULL처리 추가
                  2019.11.13 (On Minh Thien): A19_02314 - EP 조회 3초로 제한 후속
                  2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                  2020.03.18 (Yongseok Kim) - A20_00773_권한세분화_선작업
				  2020.04.20 (김동수) : A20_01538 - 최종단가 사용안함 설정 시 최종단가 관련 기능 제한
                  2020.04.14 (Yongseok Kim) - A20_01615_(PK오류)ECAPI_SVC_Inventory_Basic_SaveProd
                  2020-05-27(ThanhSang): A20_01940_권한세분화 선작업_나머지메뉴 적용 (SC설정)
                  2020.10.14 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정
                  2020.10.22 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정_회계1
 6. MenuPath    : Self-Customizing>Configuration(환경설정)>Function Setup(사용방법설정)>Inv Tab(재고탭)>Template List(양식리스트)>Template Setup(양식설정)
 7. Old File    : CM100P_02.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.formset", "CM100P_02", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: true,

    formInfo: null,

    formDataTemp: null,//temp variables for UI data 양식데이터
    formDataTempForReportTitle: null,//temp variables for UI data 양식데이터

    commonForm: null,

    lastEditTime: null,

    lastEditId: null,

    regexEmpty: /[\s\\]/g,

    ENABLE_DRAGGABLE_EDIT: null,

    //old : blAuthForm
    //MENU_SEQ가 0이 아닌것은 권한설정 대상 양식
    isAuthForm: false,

    //old :strFormBasic
    formBasic: 0,

    DETAIL_BODY_FORM_TYPE: "",

    wedgetResetGroupMaps: null,

    //지정사용자 권한 설정했는 지
    isSetAuthType: null,

    _isLeftMenuType: true,

    isNew: false,

    formTabIndex: 0,

    currentTabId: "tab_0", // Tab id (biến id tab)

    gridId: "dataGrid_0", // 하단 입력그리드 명

    gridSumId: "dataGridSum_0", // 하단 합계그리드 명

    isNewSubTotalLogic: false, // 신규 소계 로직인지

    isAllowDeleteAO296: false,

    isScheduleFormType: false,

    isScheduleDisplay: false,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        //this.setLeftpanelRightSize(1, 11);
        //위치를 바꿔야 하지 않을 까?
        this.setFormInfosFromDb();
        this.initProperties();
        this.registerDependencies("widget.lib.dragable");
        this.registerDependencies("ecmodule.common.formHelper");
        this.registerDependencies("ecmodule.common.form");
    },

    render: function () {
        this._super.render.apply(this, arguments);

    },

    initProperties: function () {

        var thisObj = this;

        //상세설정을 사용하는 경우
        //개발결정사항:1581 - 상세설정을 사용하는 경우만 DETAIL_BODY_FORM_TYPE 생성
        if ((!$.isNull(thisObj.formInfo.FormSet.DETAIL_BODY_YN) && thisObj.formInfo.FormSet.DETAIL_BODY_YN == "Y")
            || (thisObj.formInfo.FormSet.QUANTITY_YN == "Y" && thisObj.formInfo.FormOutSet.VAT_FLAG == "0")) {
            this.DETAIL_BODY_FORM_TYPE = this.FORM_TYPE.replace("SF", "SE");
        }
        this.wedgetResetGroupMaps = new $.HashMap();
        this.isSetAuthType = false;
        //신규에서 팝업오픈으로 띄우는 케이스가 있어서 아래옵션추가

        //신규 소계 로직인지
        this.isNewSubTotalLogic = ([
            "SO030", "SO627", "SF030", "SF200", "SE030", "SO210", "SO512", "SF010", "SO550", "SO510", "AO400", "AO420", "SF744",
            "SO400", "SO410", "SO420", "AF810", "AO551", "AO553", "SO681", "SF681", "SO682", "SF682", "SO511", "SO220", "SO770", "SE010",
            "SO610", "SO020", "SO500", "SO780", "SF700", "AO555", "SG031", "SG211", "SG421", "AG201", "AG556", "AO223", "SF400", "SE400",
            "AO224", "SF020", "SE020", "SO684", "SO683", "SO034", "SO200", "SO560", "SF610", "SO010", "SO600", "SF410", "SO688", "SF420",
            "AO240", "SO781", "SF770", "SO214", "SF780", "AO621", "SF210", "SF500", "SO743", "SO744", "SO745", "AO530", "SF600", "SO620",
            "AO620", "AO622", "AO624", "AO623", "AO341", "AO321", "SO700", "SO710", "SF220", "SF743", "AO242", "AO243", "SO690", "SO691", "AO200", "AO670",
            "AO245", "AO970", "AO990", "AO227", "AO228", "AO229", "AO230", "AO960", "AO680", "AO300", "AO260", "AO330", "AO390", "AO380", "AO210", "AO211", "SO032", "SO035", "AO234", "AO233", "SF240",
            "SR790", "SR791", "SR793", "SR794", "SR795", "SR796", "SR799",
            "AO450", "AO460", "AO470", "AO480", "AO040", "AO050", "AO060", "SF910", "SF920", "AF080", "AO225", "AO226", "SF530", "GO030", "GO130", "AO222", "AO221", "AO220", "AO215", "AO216", "AO217", "AO218", "AO219", "AO810", "SO021", "SO031", "SO211", "AO900", "AO910",
            "AO490", "AO491", "AO880", "SO687", "SO900", "SO901", "AO890", "AO625", "AO626", "AO401", "AO421", "AO411", "PO030", "PO040", "SO421", "PF080", "PO710", "AO523", "AO524", "SO621", "SO622",
            "SO633", "SO634", "AO980", "AO981", "AO920", "AO762", "AF752", "AO753", "SO424", "SO425", "SO721", "SO722", "SO723", "SO811", "SO240", "SN241", "GO111", "SO033", "SO213", "SO423", "AO830",
            "AO842", "AO843", "AO844", "AO846", "AO847", "AO848", "TO040", "SF560", "GO040"
        ].contains(this.FORM_TYPE) ? true : false);

        //신규 소계 로직인지
        this.isScheduleFormType = ([
            "GO121", "GO131"
        ].contains(this.FORM_TYPE) ? true : false);

        this.useECT = ecount.config.company.STATE_CODE == 'KR' && this.formInfo.FormSet.VIEW_TYPE == 'F';
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var thisObj = this;
        header.notUsedBookmark();
        if (thisObj.formInfo.FormSet.VIEW_TYPE == "P") {
            header.setTitle(thisObj.viewBag.Title || ecount.resource.BTN00169);;
        } else {
            header.setTitle(thisObj.viewBag.Title || ecount.resource.LBL01482);;
        }
    },

    // Contents Initialization
    onInitContents: function (contents, resouce) {
        var thisObj = this;
        var g = widget.generator,
            form = g.form(),
            panel = g.panel(),
            tabContents = g.tabContents(),
            spStamp = g.settingPanel(),
            toolbar = g.toolbar(),
            ctrl = g.control(),
            ctrl2 = g.control(),
            panelRight = g.panel(),
            panelLeft = g.panel();
        this.resizeLayer(1220, 750);
        this.commonForm = new ecount.common.form();
        this.commonForm.setWidgetMap(thisObj);

        //양식상세설정 사용여부
        IsDetailPermit = this.IsDetailPermit ? true : false;

        thisObj.isAuthForm = (!$.isNull(thisObj.formInfo.FormSet.MENU_SEQ) && thisObj.formInfo.FormSet.MENU_SEQ != 0) ? true : false;
        thisObj.setFormBuilder({ type: "general", div: panelLeft });//default 기본
        if (!thisObj.isFromSc || thisObj.formBasic != 1) {
            //개발결정사항:1581 - 도장인쇄는 설정으로 변경
            if (thisObj.formInfo.FormSet.IS_STAMP_IMPRINTABLE == true) {

                thisObj.setFormBuilder({ type: "stamp", div: panelLeft });//stamp 도장
            }
            thisObj.setFormBuilder({ type: "settingDetail", div: panelLeft });//setting detail 상세설정            
            thisObj.setFormBuilder({ type: "settingPage", div: panelLeft });
            if (["PF080", "AF752"].contains(thisObj.FORM_TYPE) ? false : true)
                thisObj.setFormBuilder({ type: "settingDetailBody", div: panelLeft });
            thisObj.setFormBuilder({ type: "settingBOM", div: panelLeft });
            thisObj.setFormBuilder({ type: "settingConsumed", div: panelLeft });
            thisObj.setFormBuilder({ type: "settingPrint", div: panelLeft });

            thisObj.setFormBuilder({ type: "settingLanguage", div: panelLeft });    //언어설정(수신화면양식설정에서 제공)
        }
        if (!thisObj.isFromSc || thisObj.formBasic != 1) {
            if (thisObj.formInfo.FormSet.TOP_BOTTON_YN == "Y" || thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                toolbar.attach(ctrl.define("widget.button", "settingTopBottom").label((thisObj.formInfo.FormOutSet.ONLYTOP_USE_YN == "N" && thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) ? ecount.resource.BTN00807 : ecount.resource.LBL35311).css("btn btn-default btn-sm").end());
            }
            toolbar.attach(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").end());//.clickOnce().end());
            panelRight.add(toolbar);

            // Add [Top Setting] control
            if (thisObj.formInfo.FormSet.TOP_BOTTON_YN == "Y") {
                panelRight.add(ctrl.define("widget.topBottomSetting", "topViewer", "topViewer")
                    .css("btn btn-primary btn-lg") // Override CSS
                    .setOptions({ _isTop: true })
                    .label(ecount.resource.LBL01593)
                    .setHtmlContent(thisObj.formDataTemp[0].FormGroups[0].FormOutSetTxt.TOP_TXT)
                );
            }
            //----------------------------------

            if (thisObj.viewBag.InitDatas.Template.FormInfos.length > 1) {
                var idx = parseInt(thisObj.viewBag.InitDatas.Template.FormInfos.length) - 1;
                if (['AO625', 'AO626', 'AO400', 'AO420'].contains(thisObj.FORM_TYPE)) {
                    thisObj.formTabIndex = 0;
                    thisObj.gridId = "dataGrid_0";
                    thisObj.gridSumId = "dataGridSum_0";

                } else {
                    thisObj.formTabIndex = idx;
                    thisObj.gridId = "dataGrid_" + idx.toString();
                    thisObj.gridSumId = "dataGridSum_" + idx.toString();
                }
                thisObj.viewBag.InitDatas.Template.FormInfos.forEach(function (item, i) {
                    var grid_N = g.grid(),
                        gridSub_N = g.grid(),
                        tabResource_N = "";

                    thisObj.setSettingGrid(grid_N, gridSub_N, i);
                    tabResource = item.FormGroups[0].FormSet.TAB_REX_CDS;

                    if (['AO625', 'AO626', 'AO400', 'AO420'].contains(thisObj.FORM_TYPE)) // 설정창 open시 받은 쪽지 양식일 때 처음 탭 active되도록
                    {
                        tabContents.createTab("tab_" + i.toString(), tabResource, null, ((i == 0) ? true : false), "left");
                    } else {
                        tabContents.createTab("tab_" + i.toString(), tabResource, null, ((i == idx) ? true : false), "left");
                    }

                    tabContents.addGrid("dataGrid_" + i.toString(), grid_N, null, grid_N.getDragable() ? { css: "position-relative" } : {});
                    tabContents.addGrid("dataGridSum_" + i.toString(), gridSub_N);
                });
                panelRight
                    .add(form)
                    .add(tabContents);
            } else {
                panelRight.add(form);
                if (thisObj.formInfo.FormSet.HTML_BODY_YN == "N") {
                    var gridFirst_01 = g.grid(),
                        gridFirst_02 = g.grid();
                    thisObj.setSettingGrid(gridFirst_01, gridFirst_02, 0);
                    panelRight.addGrid(thisObj.gridId, gridFirst_01, null, gridFirst_01.getDragable() ? { css: "position-relative" } : {})
                        .addGrid(thisObj.gridSumId, gridFirst_02);
                }
            }


            //-----------------------
            if (thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                // Add [Bottom Setting] control
                var ctl = ctrl2.define("widget.topBottomSetting", "bottomViewer", "bottomViewer")
                    .css("btn btn-primary btn-lg") // Override CSS
                    .label(ecount.resource.LBL01593) // You can use this function for set button label   
                    .setOptions({ _isTop: false })
                    .setHtmlContent(thisObj.formDataTemp[0].FormGroups[0].FormOutSetTxt.BOTTON_TXT);

                if (thisObj.formInfo.FormSet.TOP_SET_YN == "Y" && thisObj.formInfo.FormOutSet.ONLYTOP_USE_YN == "Y") {
                    ctl.hide();
                }
                panelRight.add(ctl);
            }
        } else {
            toolbar.attach(ctrl.define("widget.label", "labelBasicMessage").label(ecount.resource.MSG04993).end());
            panelRight.add(toolbar);
        }
        //////set Template value 양식값 할당

        if (this.FORM_TYPE == "AR250")
            contents.addColGroup(12, panelRight);
        else {
            contents.addColGroup(4, panelLeft);
            contents.addColGroup(8, panelRight);
        }

        // ERP-품목검색창 [영업(3),구매(4),생산(5),기타(1)]
        if (this.FORM_TYPE == "SP900" && [3, 4, 5, 1].contains(this.FORM_SEQ)) {
            thisObj.setFormBuilder({ type: "settingSearch", div: panelLeft });//serial 기본
        }

        // 수입지출명세서일 때 계정표시설정
        if (this.FORM_TYPE == "AO950") { 
            thisObj.setFormBuilder({ type: "settingAccountDisplay", div: panelLeft }); 
        }
    },


    //builder for form 폼생성
    setFormBuilder: function (x) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            ctrl2 = generator.control(),
            ctrl3 = generator.control(),
            ctrl4 = generator.control(),
            ctrl5 = generator.control(),
            form = widget.generator.form(),
            hr1 = generator.line(),
            hr2 = generator.line(),
            hr3 = generator.line(),
            hr4 = generator.line(),
            panel = widget.generator.panel();

        form
            .useBaseForm({ _isThShow: true, _isRowInCount: 1 })
            .colgroup([{ width: ecount.config.user.LABEL_WIDTH }, { width: "" }])
            //hhy 수정
            .css("table table-template-setup")
            .setOptions({ _isErrorBorderNone: true });
        var thisObj = this;
        var p = {
            ctrl: ctrl, ctrl2: ctrl2, ctrl3: ctrl3, ctrl4: ctrl4, ctrl5: ctrl5,
            form: form
        };
        
        switch (x.type) {
            case "general"://default 기본                
                thisObj.commonForm.getWidgetHelper().add(["titleNm"], p);//표시명
                thisObj.commonForm.getWidgetHelper().add(["formNm"], p);//표시명
                thisObj.commonForm.getWidgetHelper().add(["onlyTopUseYn"], p);//양식형태
                thisObj.commonForm.getWidgetHelper().add(["basicType"], p);//기본값
                thisObj.commonForm.getWidgetHelper().add(["authType"], p);//기본값
                if (!["OR200", "OR420", "OR230", "OR231", "OR410", "OR400", "AR010", "AR011"].contains(thisObj.FORM_TYPE))
                    thisObj.commonForm.getWidgetHelper().add(["listTabBasic"], p);//기본값

                // 받은 쪽지 양식은 리스트탭 설정 부분에 라디오버튼 없도록
                if (["AR010"].contains(thisObj.FORM_TYPE)) {
                    p.form.add(p.ctrl2.define("widget.link", "settinglistTabBasicYn", "settinglistTabBasicYn", ecount.resource.LBL10757)
                        .label(ecount.resource.LBL01593).end());

                    p.form.add(p.ctrl.define("widget.radio", "listTabBasicYn", "LIST_TAB_BASIC_YN", ecount.resource.LBL10757).label([
                        ecount.resource.LBL08396//기본 
                        , ecount.resource.LBL09235//사용자 지정
                    ]).value(["Y", "N"]).select($.isNull(thisObj.formInfo.FormOutSet.LIST_TAB_BASIC_YN) ? "Y" : thisObj.formInfo.FormOutSet.LIST_TAB_BASIC_YN).end());
                    p.form.hideRow([p.form.getRowCount() - 1]);
                }

                thisObj.commonForm.getWidgetHelper().add(["searchPopupTab", "copyTarget"], p);//기본값
                if (form.getRowCount() > 0) {
                    x.div.add(widget.generator.subTitle().title(ecount.resource.LBL00832).setFormSetGroup(x.type));
                    x.div.add(form.setFormSetGroup(x.type));
                    x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("general", ["titleNm", "formNm", "onlyTopUseYn", "basicType", "authType", "listTabBasic"]);
                break;
            case "stamp"://stamp 도장
                thisObj.commonForm.getWidgetHelper().add(["signYn"], p);//stamp yn
                if ($.isNull(thisObj.formInfo.FormOutSet.SIGN_YN) || (!$.isNull(thisObj.formInfo.FormOutSet.SIGN_YN) && thisObj.formInfo.FormOutSet.SIGN_YN != "Y")) {
                    toolbar.addRight(ctrl.define("widget.button", "applyStamp").label(ecount.resource.BTN00070).css("btn btn-default btn-sm").hide().end());
                } else {
                    toolbar.addRight(ctrl.define("widget.button", "applyStamp").label(ecount.resource.BTN00070).css("btn btn-default btn-sm").end());
                }
                if (form.getRowCount() > 0) {
                    x.div.add(widget.generator.subTitle().title(ecount.resource.LBL09869).setFormSetGroup(x.type));
                    x.div.add(form.setFormSetGroup(x.type));
                    x.div.add(toolbar.setFormSetGroup(x.type));
                    x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("stamp", ["signYn"]);
                break;
            case "settingDetail"://setting detail 상세설정
                if (thisObj.isScheduleFormType) {
                    thisObj.commonForm.getWidgetHelper().add(["searchType"], p);
                    if (!['8'].contains(thisObj.formInfo.FormOutSet.DISP_UNIT)) {
                        thisObj.commonForm.getWidgetHelper().add(["dispUnit"], p);
                        if (!['10', '11', '12', '13', '14', '15', '16'].contains(thisObj.formInfo.FormOutSet.DISP_UNIT)) {
                            thisObj.commonForm.getWidgetHelper().add(["settingDefaultForView"], p);
                        }
                        if (thisObj.FORM_TYPE == "GO121") {
                            if (['9', '90', '91', '92', '93', '94', '95', '96', '97'].contains(thisObj.formInfo.FormOutSet.DISP_UNIT)) {
                                thisObj.commonForm.getWidgetHelper().add(["dispInlineSche"], p);
                            }
                        }
                    }
                }
                thisObj.commonForm.getWidgetHelper().add(["headHeight"], p);//stamp yn
                thisObj.commonForm.getWidgetHelper().add(["bodyHeight"], p);//stamp yn
                thisObj.commonForm.getWidgetHelper().add(["lineViewYn"], p);//stamp yn
                thisObj.commonForm.getWidgetHelper().add(["lineScheduleDetailNum"], p);//stamp yn
                thisObj.commonForm.getWidgetHelper().add(["otherViewYn"], p);//stamp yn
                if (!thisObj.isScheduleFormType || (thisObj.isScheduleFormType && !['8'].contains(thisObj.formInfo.FormOutSet.DISP_UNIT))) {
                    toolbar.addRight(ctrl.define("widget.button", "applyDetail").label(ecount.resource.BTN00070).css("btn btn-default btn-sm").end());
                }
                if (form.getRowCount() > 0) {
                    if (thisObj.formInfo.FormSet.HTML_BODY_YN == "Y" || (thisObj.formInfo.FormSet.TOP_SET_YN == "Y" && thisObj.formInfo.FormOutSet.ONLYTOP_USE_YN == "Y")) {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL04003).setFormSetGroup(x.type).hide());
                        x.div.add(form.setFormSetGroup(x.type).hide());
                        x.div.add(toolbar.setFormSetGroup(x.type).hide());
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type).hide());
                    } else {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL04003).setFormSetGroup(x.type));
                        x.div.add(form.setFormSetGroup(x.type));
                        x.div.add(toolbar.setFormSetGroup(x.type));
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                    }
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingDetail", ["headHeight", "bodyHeight", "lineScheduleDetailNum", "lineViewYn", "otherViewYn"]);
                break;
            case "settingPage":

                if (thisObj.FORM_TYPE == "GP040")
                    thisObj.commonForm.getWidgetHelper().add(["inputMethod", "searchMethodDept", "expandMethodDept"], p);
                else
                    thisObj.commonForm.getWidgetHelper().add(["inputMethod", "searchMethod", "expandMethod"], p);

                if (!thisObj.isScheduleFormType) {
                    thisObj.commonForm.getWidgetHelper().add(["bodyRowCnt"], p);
                }
                else {
                    if (['8'].contains(thisObj.formInfo.FormOutSet.DISP_UNIT)) {
                        thisObj.commonForm.getWidgetHelper().add(["bodyRowCnt"], p);
                    }
                }
                thisObj.commonForm.getWidgetHelper().add(["dateCnt"], p);
                thisObj.commonForm.getWidgetHelper().add(["sortingOfPage"], p);
                thisObj.commonForm.getWidgetHelper().add(["sumOfPage"], p);
                thisObj.commonForm.getWidgetHelper().add(["viewStructYn"], p);
                thisObj.commonForm.getWidgetHelper().add(["displayMethodYn"], p);
                
                if (form.getRowCount() > 0) {
                    if (thisObj.formInfo.FormSet.TOP_SET_YN == "Y" && thisObj.formInfo.FormOutSet.ONLYTOP_USE_YN == "Y") {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL06400).setFormSetGroup(x.type).hide());
                        x.div.add(form.setFormSetGroup(x.type).hide());
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type).hide());
                    } else {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL06400).setFormSetGroup(x.type));
                        x.div.add(form.setFormSetGroup(x.type));
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                    }
                }
                //리셋그룹지정
                var settingPageGroup = ["bodyRowCnt", "dateCnt", "sortingOfPage", "sumOfPage", "displayMethodYn", "inputMethod"];

                if (thisObj.FORM_TYPE == "GP040")
                    settingPageGroup = settingPageGroup.concat(["searchMethodDept", "expandMethodDept"]);
                else
                    settingPageGroup = settingPageGroup.concat(["searchMethod", "expandMethod"]);

                thisObj.wedgetResetGroupMaps.set("settingPage", settingPageGroup);
                break;
            case "settingDetailBody":
                thisObj.commonForm.getWidgetHelper().add(["detailBody"], p);
                if (form.getRowCount() > 0) {
                    if (thisObj.formInfo.FormSet.TOP_SET_YN == "Y" && thisObj.formInfo.FormOutSet.ONLYTOP_USE_YN == "Y") {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL09870).setFormSetGroup(x.type).hide());
                        x.div.add(form.setFormSetGroup(x.type).hide());
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type).hide());
                    } else {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL09870).setFormSetGroup(x.type));
                        x.div.add(form.setFormSetGroup(x.type));
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                    }
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingDetailBody", ["detailBody"]);
                break;
            case "settingBOM":
                thisObj.commonForm.getWidgetHelper().add(["detailBOM"], p);
                if (form.getRowCount() > 0) {
                    if (thisObj.formInfo.FormSet.QUANTITY_YN != "Y") {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL05358).setFormSetGroup(x.type).hide());
                        x.div.add(form.setFormSetGroup(x.type).hide());
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type).hide());
                    } else {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL05358).setFormSetGroup(x.type));
                        x.div.add(form.setFormSetGroup(x.type));
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                    }
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingBOM", ["detailBOM"]);
                break;
            case "settingConsumed":

                thisObj.commonForm.getWidgetHelper().add(["detailConsumed"], p);
                if (form.getRowCount() > 0) {
                    if (thisObj.FORM_TYPE != "SF420") {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL12697).setFormSetGroup(x.type).hide());
                        x.div.add(form.setFormSetGroup(x.type).hide());
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type).hide());
                    } else {
                        x.div.add(widget.generator.subTitle().title(ecount.resource.LBL12697).setFormSetGroup(x.type));
                        x.div.add(form.setFormSetGroup(x.type));
                        x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                    }
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingConsumed", ["detailConsumed"]);
                break;
            case "settingPrint":
                thisObj.commonForm.getWidgetHelper().add(["printForm"], p);
                thisObj.commonForm.getWidgetHelper().add(["settingPepper"], p);
                if (form.getRowCount() > 0) {
                    x.div.add(widget.generator.subTitle().title(ecount.resource.LBL05368).setFormSetGroup(x.type));
                    x.div.add(form.setFormSetGroup(x.type));
                    x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingPrint", ["printForm", "settingPepper"]);
                break;
                break;
            case "settingLanguage": //언어설정(수신화면양식설정에서 제공)
                thisObj.commonForm.getWidgetHelper().add(["settingLanSetup"], p);
                if (form.getRowCount() > 0) {
                    x.div.add(widget.generator.subTitle().title(ecount.resource.LBL00867).setFormSetGroup(x.type));
                    x.div.add(form.setFormSetGroup(x.type));
                    x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                }
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingLanguage", ["settingLanSetup"]);
                break;
            case "settingSearch":
                thisObj.commonForm.getWidgetHelper().add(["serialSearchTF"], p);//양식형태
                x.div.add(widget.generator.subTitle().title(ecount.resource.LBL17613).setFormSetGroup(x.type));
                x.div.add(form.setFormSetGroup(x.type));
                x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingSearch", ["serialSearchTF"]);
                break;
            case "settingAccountDisplay":
                thisObj.commonForm.getWidgetHelper().add(["amtMarkTf"], p);//이월금액표시
                x.div.add(widget.generator.subTitle().title(ecount.resource.LBL17798).setFormSetGroup(x.type));
                x.div.add(form.setFormSetGroup(x.type));
                x.div.add(hr1.add("hr").setFormSetGroup(x.type));
                //리셋그룹지정
                thisObj.wedgetResetGroupMaps.set("settingAccountDisplay", ["amtMarkTf"]);
                break;
            default:
                break;
        }
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var thisObj = this;
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "cancel").label(ecount.resource.LBL02853));
        if ((!$.isNull(thisObj.formInfo.FormSet.FORM_ADD_YN) && thisObj.formInfo.FormSet.FORM_ADD_YN == "Y")) {
            toolbar.addLeft(ctrl.define("widget.button", "formList").label(ecount.resource.BTN00275));
        }
        //개발결정사항:1581 - 해당버튼 예외 처리
        if (["SF010", "SF020", "SF030", "SF770", "SF780", "SF031", "SF220", "SF240", "SF200", "SF210", "SF400", "SF410", "SF420", "SF440", "SF600", "SF610", "SF500", "SF743", "SF744", "SF700", "SF910", "SF920", "AF080", "SF010", "AF810", "SE020", "SF560"].contains(thisObj.FORM_TYPE) && thisObj.viewBag.InitDatas.isShareView) {
            toolbar.addLeft(ctrl.define("widget.button", "Share").label(ecount.resource.BTN00744))
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        if ((thisObj.isFromSc && thisObj.formBasic == 1) == false) {
            if ((!$.isNull(thisObj.formInfo.FormSet.FORM_ADD_YN) && thisObj.formInfo.FormSet.FORM_ADD_YN == "Y")
                && thisObj.formInfo.FormSet.VIEW_TYPE != "P"
            ) {
                toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033))
            }
            if (thisObj.formBasic == 0) {
                toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
            }
        }
        if (this.useECT)
            toolbar.addLeft(ctrl.define("widget.button", "ecountCustomTemplate").label(ecount.resource.BTN00375));
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    onChangeContentsTab: function (event) {
        this.currentTabId = event.tabId;
        var idx = this.currentTabId.split('_')[1];
        this.formTabIndex = parseInt(idx);
        this.gridId = "dataGrid_" + idx;
        this.gridSumId = "dataGridSum_" + idx;
    },


    // After the document loaded
    onLoadComplete: function (e) {
        var thisObj = this;
        if (!thisObj.isFromSc || thisObj.formBasic != 1) {
            if (thisObj.formInfo.FormSet.IS_STAMP_IMPRINTABLE == true) {
                thisObj.setResetWedgets(["stamp"]);
            }
        }
        if (["AR070"].contains(thisObj.FORM_TYPE)) {
            thisObj.contents.getControl("bodyRowCnt").setImeModeKeydownHandler(0, false, "N", true);
            thisObj.contents.getControl("bodyRowCnt").setAlignRight();
        }
    },

    onInitControl: function (cid, control) {
        var res = ecount.resource,
            ctrl = widget.generator.control();
    },

    onChangeControl: function (event, data) {
        console.log("onChangeControl:" + event.cid);
        var thisObj = this;

        //if you use widget within custom widget,you can't get it directly, so, we use control.__self 
        //커스텀안에 위젯이벤트일때 직접 접근이 안되기 때문에 control.__self로 인스턴스를 직접 받음(휘영책임 확인 2016.01.08)
        var selfControl = event.__self;
        if (["restore", "cancel", "onlyTopUseYn"].contains(selfControl.id)) {
            if (!thisObj.isFromSc || thisObj.formBasic != 1) {
                if (thisObj.formInfo.FormSet.TOP_SET_YN == "Y") {
                    if (this.contents.getControl("onlyTopUseYn").getValue() == "N") {
                        this.contents.getGrid(thisObj.gridId, false).show();
                        this.contents.getGrid(thisObj.gridSumId, false).show();
                        if (thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                            this.contents.getControl("bottomViewer", false).show();
                        }
                        if (thisObj.formInfo.FormSet.TOP_BOTTON_YN == "Y" && thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                            this.contents.getControl("settingTopBottom").changeLabel(ecount.resource.BTN00807);
                        }

                        ["settingDetail", "settingPage", "settingDetailBody", "settingBOM", "settingConsumed"].forEach(function (key) {
                            var list = thisObj.contents.getFormSetGroupList(key);
                            for (var i = 0; i < list.length; i++) {
                                list[i].show();
                            }
                        });
                    } else {
                        this.contents.getGrid(thisObj.gridId, false).hide();
                        this.contents.getGrid(thisObj.gridSumId, false).hide();
                        if (thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                            this.contents.getControl("bottomViewer", false).hide();
                        }
                        this.contents.getControl("settingTopBottom").changeLabel(ecount.resource.LBL35311);
                        ["settingDetail", "settingPage", "settingDetailBody", "settingBOM", "settingConsumed"].forEach(function (key) {
                            var list = thisObj.contents.getFormSetGroupList(key);
                            for (var i = 0; i < list.length; i++) {
                                list[i].hide();
                            }
                        });
                    }
                    thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("onlyTopUseYn")();
                }
            }
        }
        if (["restore", "cancel", "authType"].contains(selfControl.id)) {
            if (!$.isNull(thisObj.contents.getControl("authType")) && thisObj.contents.getControl("authType").getValue() == "P") {
                //All Users 모든사용자 
                ecmodule.common.formHelper.setHideControls(thisObj, [thisObj.contents.getControl("settingAuthType")]);
            } else {
                //Selected User  지정사용자
                if (selfControl.id == "authType") {
                    var permit = this.viewBag.Permission.formUserPermit.Value;
                    if (permit != "W" && thisObj.IsDetailPermit == false) {
                        //permission message 권한 메시지
                        thisObj.contents.getControl("authType").setValue("P");
                        ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
                    } else {
                        ecmodule.common.formHelper.setShowControls(thisObj, [thisObj.contents.getControl("settingAuthType")]);
                    }
                } else {
                    ecmodule.common.formHelper.setShowControls(thisObj, [thisObj.contents.getControl("settingAuthType")]);
                }
            }
        }
        if (["restore", "cancel", "listTabBasicYn"].contains(selfControl.id)) {
            if (!$.isNull(thisObj.formInfo.FormSet.LIST_TAB_YN) && thisObj.formInfo.FormSet.LIST_TAB_YN == "Y") {
                if (thisObj.contents.getControl("listTabBasicYn").getValue() != "Y") {
                    ecmodule.common.formHelper.setShowControls(thisObj, [thisObj.contents.getControl("settinglistTabBasicYn")]);
                }
                else {
                    ecmodule.common.formHelper.setHideControls(thisObj, [thisObj.contents.getControl("settinglistTabBasicYn")]);
                }

            }
        }
        if (["restore", "cancel", "signYn"].contains(selfControl.id)) {
            if (!thisObj.isFromSc || thisObj.formBasic != 1) {
                if (thisObj.formInfo.FormSet.IS_STAMP_IMPRINTABLE == true) {

                    var checked = this.contents.getControl("signYn").getValue(),
                        topViewer = this.contents.getControl("topViewer");
                    var ctlSignLeftMargin = this.contents.getControl("signLeftMargin");
                    var ctlSignTopMargin = this.contents.getControl("signTopMargin");
                    var ctlApplyStamp = this.contents.getControl("applyStamp");


                    if (checked === true) {
                        console.log("showStamp");
                        topViewer.showStamp();
                        ecmodule.common.formHelper.setShowControls(thisObj, [ctlSignLeftMargin, ctlSignTopMargin]);
                        ctlApplyStamp.show();
                    } else {
                        console.log("hideStamp");
                        topViewer.hideStamp();
                        ecmodule.common.formHelper.setHideControls(thisObj, [ctlSignLeftMargin, ctlSignTopMargin]);
                        ctlApplyStamp.hide();
                    }
                    thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("signYn")();

                    thisObj.formDataTemp[0].FormGroups[0].FormOutSetTxt.TOP_TXT = topViewer.getHtml();
                }
            }
        }

        if (["searchMethod"].contains(selfControl.id)) {
            if (!$.isNull(thisObj.formInfo.FormSet.SEARCH_METHOD_YN) && thisObj.formInfo.FormSet.SEARCH_METHOD_YN == "Y") {
                thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EXPAND_METHOD = "E";
                //sync
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("searchMethod")();
                //ui reset
                thisObj.commonForm.getWidgetHelper().getResetWedgets().get("expandMethod")();
                //sync
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("expandMethod")();
            }
        }

        if (["searchMethodDept"].contains(selfControl.id)) {
            if (!$.isNull(thisObj.formInfo.FormSet.SEARCH_METHOD_YN) && thisObj.formInfo.FormSet.SEARCH_METHOD_YN == "Y") {
                thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EXPAND_METHOD = "E";
                //sync
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("searchMethodDept")();
                //ui reset
                thisObj.commonForm.getWidgetHelper().getResetWedgets().get("expandMethodDept")();
                //sync
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("expandMethodDept")();
            }
        }

        //양식 기본값 로직 처리
        if (selfControl.name == "BASIC_TYPE") {
            switch (selfControl.id) {
                case "basicType1":
                    //체크리스트를 배열식으로 쓰면 이런식으로 밖에 접근안됨
                    if (event.event.target.value == "0") {
                        thisObj.contents.getControl("basicType1").setCheckedValue(["1"], false);
                    } else if (event.event.target.value == "1") {
                        thisObj.contents.getControl("basicType1").setCheckedValue(["0"], false);
                    }
                    break;
            }
        }
        if (["detailBodyYn"].contains(selfControl.id)) {
            if (thisObj.contents.getControl("customFor_DetailBody").get("detailBodyYn").getValue()) {
                //상세품목 체크시 인쇄형태 체크해제.
                thisObj.formInfo.FormOutSet.SHEET_YN = "Y";
                thisObj.formInfo.FormOutSet.IS_PRINT_TWICE = false;
            }
            //상세품목 동기화
            thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("detailBody")();
        }
        if (["detailBOMYn"].contains(selfControl.id)) {
            if (thisObj.contents.getControl("customFor_DetailBOM").get("detailBOMYn").getValue()) {
                //disable 2 page/sheet and print 2 copy
                thisObj.formInfo.FormOutSet.SHEET_YN = "Y";
                thisObj.formInfo.FormOutSet.IS_PRINT_TWICE = false;
            }
            //상세품목 동기화
            thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("detailConsumed")();
        }
        if (["detailConsumedYn"].contains(selfControl.id)) {
            //상세품목 동기화
            thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("detailConsumed")();
        }
        if (["searchPopupTab"].contains(selfControl.id)) {
            thisObj.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_02", { __ecPage__: null, FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: thisObj.contents.getControl("searchPopupTab").getValue(), isFromSc: thisObj.isFromSc, MENU_TYPE: thisObj.MENU_TYPE, IS_CS: thisObj.IS_CS }, null);
        }
        if (["dispUnit"].contains(selfControl.id)) {
            thisObj.onContentsApplyDetail();
        }
    },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        if (page.pageID == 'CM100P_47') {
            if (!$.isNull(message.type) && message.type == "getforminfo") {
                var objcColumn = Object.clone(thisObj.formDataTemp[message.formIndex].FormGroups[0].FormOutColumns, true);
                message.callback && message.callback(objcColumn);
                return;
            } else if (!$.isNull(message.type) && message.type == "addItems") {
                var tarcolcd = { COL_CD: message.targetColCd };
                var beforeSortData = thisObj.setReSortData({ type: "get" });
                message.colCds.forEach(function (rowItem, j) {
                    thisObj.setSettingDetail({ checked: true, formIndex: message.formIndex, rowItem: rowItem });
                    thisObj.setUiSync({ checked: true, formIndex: message.formIndex, rowItem: rowItem, target: tarcolcd }); //targetColCd: message.targetColCd });
                });
                thisObj.setReSortData({ type: "set", sortCds: beforeSortData.sortCds, subTotTypes: beforeSortData.subTotTypes });
                if (message.isDelete === true) { //품목검색창 제거  대상항목
                    message.deleteItems.forEach(function (col, j) {
                        thisObj.setDeleteItem({ formIndex: thisObj.formTabIndex, rowItem: { COL_CD: col } });
                    });
                }
                message.callback && message.callback();
            }
        } else if (page.pageID == 'CM100P_55') {
            //양식 인스턴스 넘기기
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                var formGroup = Object.clone(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0], true);
                message.callback && message.callback(formGroup);
                return;
            }
            //top/bottom 기본값 복원
            if (!$.isNull(message.type) && message.type == "getRestoreFormInfo") {
                thisObj.getRestoreForm({
                    restoreType: message.restoreType,
                    callback: function (data) {
                        message.callback && message.callback(data[thisObj.formTabIndex].FormGroups[0]);
                    }.bind(this)
                });
                return;
            }
            if (!$.isNull(message.formOutSetTxt)) {
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetTxt.TOP_TXT = message.formOutSetTxt.TOP_TXT;
                thisObj.contents.getControl("topViewer").setHtml(message.formOutSetTxt.TOP_TXT);
                if (thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                    this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetTxt.BOTTON_TXT = message.formOutSetTxt.BOTTON_TXT;
                    thisObj.contents.getControl("bottomViewer").setHtml(message.formOutSetTxt.BOTTON_TXT);
                }
                var stampPosition = thisObj.contents.getControl("topViewer").getStampPosition();
                if (!$.isNull(stampPosition.originTop) && !$.isEmpty(stampPosition.originTop) && stampPosition.originTop.indexOf('%') < 0) {
                    thisObj.formInfo.FormOutSet.SIGN_TOPMARGIN = stampPosition.top || 0;
                }
                if (!$.isNull(stampPosition.originLeft) && !$.isEmpty(stampPosition.originLeft) && stampPosition.originLeft.indexOf('%') < 0) {
                    thisObj.formInfo.FormOutSet.SIGN_LEFTMARGIN = stampPosition.left || 0;
                }
                //도장 url 기준으로 다시 재적용 - 채주영 2016.08.02
                thisObj.setResetWedgets(["stamp"]);
                message.callback && message.callback();
            }
        } else if (page.pageID == 'CM100P_51') {
            if (!$.isNull(message.type) && message.type == "setNewFormTypeSeq") {
                var nFormType = message.data.FORM_TYPE;
                var nFormSeq = message.data.FORM_SEQ;
                message.callback && message.callback();
                thisObj.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_02", { DISP_UNIT: message.data.DISP_UNIT, __ecPage__: null, FORM_TYPE: nFormType, FORM_SEQ: nFormSeq, isFromSc: thisObj.isFromSc, MENU_TYPE: thisObj.MENU_TYPE, isSaveAfterClose: this.isSaveAfterClose , FromProgramId : thisObj.FromProgramId}, null);
                return;
            }
        } else if (page.pageID == 'CM100P_53') {
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                var formGroup = Object.clone(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0], true);
                message.callback && message.callback(formGroup);
                return;
            }
            if (!$.isNull(message.formOutSet)) {
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SORT_CD = message.formOutSet.SORT_CD;
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_TYPE = message.formOutSet.SUBTOT_TYPE;
                message.callback && message.callback();
            }
        } else if (page.pageID == 'CM100P_53_CM3') {
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                var formGroup = Object.clone(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0], true);
                message.callback && message.callback(formGroup);
                return;
            }
            if (!$.isNull(message.formOutSet)) {
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SORT_CD = message.formOutSet.SORT_CD;
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_TYPE = message.formOutSet.SUBTOT_TYPE;
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_DISPLAY_TYPE = message.formOutSet.SUBTOT_DISPLAY_TYPE;
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_ALIGN_TYPE = message.formOutSet.SUBTOT_ALIGN_TYPE;
                if (!$.isNull(message.formOutSetReportTitle)) {
                    this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetReportTitle = Object.clone(message.formOutSetReportTitle, true);
                }
                message.callback && message.callback();
            }
        } else if (page.pageID == 'CM100P_54') {
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                //첫번째 동일하게 사용하기 위해 고정
                message.callback && message.callback(thisObj.formDataTemp[0].FormGroups[0]);
                return;
            }
            //기본값 복원
            if (!$.isNull(message.type) && message.type == "getRestoreFormInfo") {
                thisObj.getRestoreForm({
                    restoreType: message.restoreType,
                    callback: function (data) {
                        //첫번째로 복원
                        message.callback && message.callback(data[0].FormGroups[0]);
                    }.bind(this)
                });
                return;
            }
            if (!$.isNull(message.formInfo)) {
                //소요량계산처럼 여러폼타입이면 동기화
                for (var i = 1; i < thisObj.formDataTemp.length; i++) {
                    var formGrop = thisObj.formDataTemp[i].FormGroups[0];
                    formGrop.FormOutSet.SHEET_YN = message.formInfo.FormOutSet.SHEET_YN;
                    formGrop.FormOutSet.IS_PRINT_TWICE = message.formInfo.FormOutSet.IS_PRINT_TWICE;
                    formGrop.FormOutSet.DOTLINE_HEIGHT = message.formInfo.FormOutSet.DOTLINE_HEIGHT;
                    formGrop.FormOutSet.T_MARGIN_TWO = message.formInfo.FormOutSet.T_MARGIN_TWO;

                    if (formGrop.PageSetup) {
                        formGrop.PageSetup.SIZE_TYPE = message.formInfo.PageSetup.SIZE_TYPE;
                        formGrop.PageSetup.HEIGHT = message.formInfo.PageSetup.HEIGHT;
                        formGrop.PageSetup.WIDTH = message.formInfo.PageSetup.WIDTH;
                        formGrop.PageSetup.PRINT_ALIGN = message.formInfo.PageSetup.PRINT_ALIGN;
                        formGrop.PageSetup.PRINT_WAY = message.formInfo.PageSetup.PRINT_WAY;
                        formGrop.PageSetup.T_MARGIN = message.formInfo.PageSetup.T_MARGIN;
                        formGrop.PageSetup.B_MARGIN = message.formInfo.PageSetup.B_MARGIN;
                        formGrop.PageSetup.L_MARGIN = message.formInfo.PageSetup.L_MARGIN;
                        formGrop.PageSetup.R_MARGIN = message.formInfo.PageSetup.R_MARGIN;
                        formGrop.PageSetup.REDUCE_YN = message.formInfo.PageSetup.REDUCE_YN;
                    } else {
                        formGrop.PageSetup = $.extend({}, message.formInfo.PageSetup);
                    }
                }
                message.callback && message.callback();
            }
        } else if (page.pageID == 'EBA001P_15') {
            if (!$.isNull(message.type) && message.type == "getformOutSetReportTitle") {
                if ($.isNull(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetReportTitle)) {
                    thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetReportTitle = new Array();
                }
                message.callback && message.callback(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetReportTitle);
                return;
            }
            thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetReportTitle = message.formOutSetReportTitle;
            message.callback && message.callback();
        } else if (page.pageID == 'CM100P_56') {//'CM100P_42'


            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                message.callback && message.callback(
                    thisObj.getFormDetailByColCd({ formIndex: message.formIndex, ColCd: message.colCd })
                );
                return;
            }
            var formDataTempCurrent = this.formDataTemp[message.formIndex].FormGroups[0];
            var inputColumns = thisObj.formDataTemp[message.formIndex].FormGroups[0].ViewModel.columns;
            //원본 표시순서 복제함, 설정 인스턴스 공유해서 쓰기 때문에 첫항목으로 인해 재정렬되면 나머지 순서가 변경되기 때문.
            var newNumSorts = Object.clone(message.data.FormOutSetDetails, true);
            message.data.FormOutSetDetails.forEach(function (detail) {
                if (!$.isNull(detail.HEAD_SIZE) && detail.HEAD_SIZE > 0) {
                    var colCd = detail.COL_CD;
                    var inputColumn = inputColumns.find(function (item) { return item.id == colCd });
                    var newNumSort = newNumSorts.find(function (item) { return item.COL_CD == colCd }).Key.NUM_SORT;
                    var columnInfoOption = {};// for grid. 그리드용
                    //if it is changed number,then update new number  표시 순서가 변경된 경우 순번업데이트
                    if (inputColumn.index != newNumSort) {
                        var numSort = parseInt(newNumSort || 99);
                        //knh #5
                        var grid = thisObj.contents.getGrid(thisObj.gridId, false).grid;

                        var columnInfoList = grid.getColumnInfoList(), columnInfo,
                            srcColumnInfo = {}, destColumnInfo = {};

                        for (var i = 0, limit = columnInfoList.length; i < limit; i++) {
                            if (columnInfoList[i].index >= numSort) {
                                columnInfo = columnInfoList[i];
                                break;
                            }
                        }

                        if (columnInfo) {
                            srcColumnInfo = {
                                'columnId': colCd
                                , 'rowKey': '0'
                            };
                            destColumnInfo = {
                                'columnId': columnInfo['id']
                                , 'rowKey': '0'
                            };
                        } else {
                            srcColumnInfo = {
                                'columnId': colCd
                                , 'rowKey': '0'
                            };
                            destColumnInfo = null;
                        }
                        grid.moveColumn(srcColumnInfo, destColumnInfo);
                        //sync sort for grid on right bottom 오른쪽 하단 그리드 순서 동기화
                        thisObj.setSortSync({ formIndex: thisObj.formTabIndex });
                    }
                    if (!$.isEmpty(detail.HEAD_TITLE_NM) && detail.HEAD_TITLE_NM.replace(thisObj.regexEmpty, "") == "")
                        detail.HEAD_TITLE_NM = "";

                    if (thisObj.isScheduleFormType) {
                        if (!['c_date', 'u_date', 'd_date'].contains(colCd)) {
                            if (inputColumn.title != detail.HEAD_TITLE_NM) {
                                //title 제목변경
                                if ($.isEmpty(detail.HEAD_TITLE_NM)) {
                                    inputColumn.title = thisObj.viewBag.InitDatas.Template.FormInfos[message.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == colCd }).SUB_REX_DES;
                                    columnInfoOption.title = inputColumn.title;
                                } else {
                                    inputColumn.title = detail.HEAD_TITLE_NM;
                                    columnInfoOption.title = detail.HEAD_TITLE_NM;
                                }
                            }
                        }
                    }
                    else {
                        if (inputColumn.title != detail.HEAD_TITLE_NM) {
                            //title 제목변경
                            if ($.isEmpty(detail.HEAD_TITLE_NM)) {
                                inputColumn.title = thisObj.viewBag.InitDatas.Template.FormInfos[message.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == colCd }).SUB_REX_DES;
                                columnInfoOption.title = inputColumn.title;
                            } else {
                                inputColumn.title = detail.HEAD_TITLE_NM;
                                columnInfoOption.title = detail.HEAD_TITLE_NM;
                            }
                        }
                    }
                    if (!$.isEmpty(detail.INPUT_TITLE_NM) && detail.INPUT_TITLE_NM.replace(thisObj.regexEmpty, "") == "")
                        detail.INPUT_TITLE_NM = "";

                    if (inputColumn.subTitle != detail.INPUT_TITLE_NM) {
                        //sub title 제목변경
                        if ($.isEmpty(detail.INPUT_TITLE_NM)) {
                            inputColumn.subTitle = thisObj.viewBag.InitDatas.Template.FormInfos[message.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == colCd }).ADD_RESX_DES1;
                        } else {
                            inputColumn.subTitle = detail.INPUT_TITLE_NM;
                        }
                    }
                    if (inputColumn.width != detail.HEAD_SIZE) {
                        inputColumn.width = detail.HEAD_SIZE;
                        columnInfoOption.width = detail.HEAD_SIZE;
                    }
                    if (inputColumn.scpDefaultsPriority != detail.SCP_DEFAULTS_PRIORITY) {
                        inputColumn.scpDefaultsPriority = detail.SCP_DEFAULTS_PRIORITY;
                    }
                    if (Object.keys(columnInfoOption).length > 0) {
                        thisObj.contents.getGrid(thisObj.gridId, false).grid.setColumnInfo(colCd, columnInfoOption);
                        //console.log("width:" +colCd + "," + columnInfoOption.width);
                    }

                    thisObj.contents.getGrid(thisObj.gridId, false).grid.refreshCell(colCd, 0);

                    if (thisObj.isScheduleFormType && ['c_date', 'u_date', 'd_date'].contains(colCd)) {

                        inputColumns.forEach(function (item) {
                            var prefixColcd = item.id.substring(0, colCd.length).toLowerCase();
                            if (['c_date', 'd_date', 'u_date'].contains(prefixColcd)) {
                                if (Object.keys(columnInfoOption).length > 0) {
                                    thisObj.contents.getGrid(thisObj.gridId, false).grid.setColumnInfo(item.id, columnInfoOption);

                                }
                            }

                        });
                    }
                    thisObj.setUITotalSync();
                }
            });
            //close 부모창 닫기
            message.callback && message.callback();
        } else if (page.pageID == 'CM100P_58_CM3') {
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                var formGroup = thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0];
                message.callback && message.callback(formGroup);
                return;
            }

            thisObj.setHybridGrid(message);
            //close 부모창 닫기
            message.callback && message.callback();
        } else if (page.pageID == 'EGJ006P_22') {
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                var formGroup = Object.clone(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0], true);
                message.callback && message.callback(formGroup, this.isScheduleDisplay);
                return;
            }
            if (!$.isNull(message.formOutSet)) {
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SCHEDULE_DISPLAY_COLS = message.formOutSet.SCHEDULE_DISPLAY_COLS;
                this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SCHEDULE_PREVIEW_COLS = message.formOutSet.SCHEDULE_PREVIEW_COLS;

                message.callback && message.callback();
            }
        }
        else if (page.pageID == 'CM100P_05') {

            this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SCHEDULE_DISPLAY_COLS = message.data[0].CALC_DESC + ecount.delimiter + message.data[0].CALC_GUBUN;

            message.callback && message.callback();
        }

    },

    //hhy 수정
    //drag event 드래그 시작 이벤트
    onPreInitDrag: function (event, data, grid) {
        var ctrlGrid = this.contents.getGrid(this.gridId, false);
        var objParam = {
            isDrag: true,
            targetGridId: ctrlGrid && ctrlGrid.grid.getGridId() || null,
            flag: ecount.grid.constValue.dragType.bottom,
        }
        return objParam;
    },

    //hhy 수정
    //drag end event  드래그 드롭 후 설정 값 전달 이벤트
    onDragEndPreInit: function (event, data, grid) {
    },

    //hhy 수정
    //drag completed event  드래그 드롭 완료 후 이벤트
    onDragEndCompleted: function (event, data, grid) {
        if (data && data.target != "widget") {
            var beforeSortData = this.setReSortData({ type: "get" });
            //[A17_02333 bsy] hide 컬럼 정렬
            this.moveHideColumn();
            //sync grid 그리드 순서 동기화
            this.setSortSync({ formIndex: this.formTabIndex });
            this.setUITotalSync();
            this.setReSortData({ type: "set", sortCds: beforeSortData.sortCds, subTotTypes: beforeSortData.subTotTypes });

        }
    },

    onFocusOutHandler: function (event) {
        //move next focus 다음 폼으로 이동
        var forms = this.contents.getForm();
        if (forms.length > 0) {
            if (event.__self == this.contents.getForm()[forms.length - 1]) {
                this.footer.getControl("save").setFocus(0);
            } else {
                for (var i = 0; i < forms.length; i++) {
                    if (event.__self == this.contents.getForm()[i] && (forms.length - 1) > i) {
                        this.contents.getForm()[i + 1].getControlByIndex(0).setFocus(0);
                        break;
                    }
                }
            }
        }
    },

    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    onInitGridInitalize: function (cid, option) {
    },

    onGridRenderComplete: function (e, data, gridObj) {
        var thisObj = this;
        this._super.onGridRenderComplete.apply(this, arguments);
        if (gridObj.grid.getGridId().indexOf(this.gridId) > -1 && gridObj.grid.getGridId().indexOf("Sum") == -1 && this.isFirstSetupLayerOfGrid) {
            var firstShowId = "";
            for (var i = 0; i < this.formDataTemp[this.formTabIndex].FormGroups[0].ViewModel.columns.length; i++) {
                if (this.formDataTemp[this.formTabIndex].FormGroups[0].ViewModel.columns[i].width > 0) {
                    firstShowId = this.formDataTemp[this.formTabIndex].FormGroups[0].ViewModel.columns[i].id;
                    break;
                }
            };

            if ((firstShowId || "") != "") {
                this.showGridFormsetLayer(firstShowId, "0");
            }
            this.isFirstSetupLayerOfGrid = false;

            if (thisObj.formInfo.FormSet.TOP_SET_YN == "Y" && thisObj.formInfo.FormOutSet.ONLYTOP_USE_YN == "Y") {
                thisObj.contents.getGrid(thisObj.gridId, false).hide();
                thisObj.contents.getGrid(thisObj.gridSumId, false).hide();
            }
        }
    },

    //grid cell resize event  그리드 리사이즈 이벤트
    onResizeEndCompleted: function (event, data, grid) {
        var thisObj = this;
        if (!$.isNull(data.resizedHeightType)) {
            if (data.resizedHeightType == "header") {
                thisObj.formInfo.FormOutSet.HEAD_HEIGHT = data.resizedHeight;
                if (thisObj.contents.getControl("headHeight") != null) {
                    thisObj.contents.getControl("headHeight").setValue(data.resizedHeight);
                }

            } else {
                thisObj.formInfo.FormOutSet.BODY_HEIGHT = data.resizedHeight;
                if (thisObj.contents.getControl("headHeight") != null) {
                    thisObj.contents.getControl("bodyHeight").setValue(data.resizedHeight);
                }
            }
        }
        var headSize = data.colList.find(function (item) { return item.id == data.resizedColumnId }).width.toString().replace("px", "");
        this.formDataTemp[this.formTabIndex].FormGroups[0].FormOutSetDetails.find(function (item) { return thisObj.fnCompare(item.COL_CD, data.resizedColumnId); }).HEAD_SIZE = headSize;
        this.formDataTemp[this.formTabIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == data.resizedColumnId }).width = headSize;
        this.setUITotalSync();
    },

    fnCompare: function (col, resizedCol) {
        if (this.isScheduleFormType && ['C', 'U', 'D'].contains(this.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE)) {
            var prefix = resizedCol.split(ecount.delimiter)[0];
            return col == prefix;
        }
        return col == resizedCol;
    },
    onGridAfterFormLoad: function (e, data, gridForm) {
        if (gridForm['id'] == 'dataGrid2') {
            if (data.columnForm) {
                var columns = data.columnForm.columns;
                for (var idx = 0, limit = columns.length; idx < limit; idx++) {
                    columns[idx]['font'] = '';
                    columns[idx]['fontBold'] = false;
                    columns[idx]['fontItalic'] = false;
                    columns[idx]['fontStrike'] = false;
                    columns[idx]['fontUnderline'] = false;
                }
            }
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    onContentsApplyStamp: function () {
        var thisObj = this;
        var topViewer = this.contents.getControl("topViewer"),
            topValue = this.contents.getControl("signTopMargin").getValue(),
            leftValue = this.contents.getControl("signLeftMargin").getValue();
        topViewer.setStampPosition(topValue, leftValue);

        //동기화
        thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("signYn")();
        thisObj.formDataTemp[0].FormGroups[0].FormOutSetTxt.TOP_TXT = topViewer.getHtml();
    },
    onContentsApplyDetail: function () {
        var thisObj = this;
        ////동기화
        var listItem = ["headHeight", "bodyHeight", "lineViewYn", "otherViewYn"];
        if (thisObj.isScheduleFormType) {
            listItem.push("dispUnit");
            listItem.push("searchType");
        }
        listItem.forEach(function (key) {
            thisObj.commonForm.getWidgetHelper().getMappingWedgets().get(key)();
        });

        thisObj.setHybridGrid();
    },
    onContentsTopViewer: function () {
        this.onContentsSettingTopBottom({ tabId: "top" });
    },

    onContentsBottomViewer: function () {
        this.onContentsSettingTopBottom({ tabId: "bottom" });
    },

    onContentsSettingAuthType: function () {
        var thisObj = this;
        var param = {
            width: 600,
            height: 620,
            FormName: thisObj.formInfo.FormOutSet.TITLE_NM
        }

        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (permit != "W" && thisObj.IsDetailPermit ==false) {
            //permission message 권한 메시지
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
            return false;
        }

        //주의  FormType,FormSeq,FromSc 쿼리스트링방식으로 보내야지 구프레임웍 페이지에서 저장시 정상동작됨
        this.openWindow({
            url: "/ECMain/EMM/EMM011P_02.aspx?FormType=" + thisObj.FORM_TYPE + "&FormSeq=" + thisObj.FORM_SEQ + "&FromSc=" + ((thisObj.isFromSc) ? "Y" : "N") + "&__NewParents=" + this.pageID,
            name: 'CM100P_24',
            param: param,
            popupType: true,
            fpopupID: this.ecPageID

        });
    },

    onContentsSettinglistTabBasicYn: function () {
        var thisObj = this;

        var param = {
            width: 470,
            height: 450,
            FormName: thisObj.formInfo.FormOutSet.TITLE_NM,
            POPUP_CD: 118,
            ISSELFCUSTOM: false,
            SETUPID: "GNR044",
            FORM_TYPE: thisObj.FORM_TYPE,
            FORM_SEQ: thisObj.FORM_SEQ,
            IsViewSApprovalTab: true,
            CS_FLAG: this.CS_FLAG
        }
        if (thisObj.FORM_TYPE == "SR770") {
            param.IsViewInProgressTab = true;
            param.IsViewFinishTab = true;
        }
        //주의  FormType,FormSeq,FromSc 쿼리스트링방식으로 보내야지 구프레임웍 페이지에서 저장시 정상동작됨

        //, 'ESC001P_509', 'Y', 470, 450)

        this.openWindow({
            url: "/ECERP/ESC/ESC001P_509",
            name: 'ESC001P_509',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },
    onContentsSettingDetailBody: function () {
        this.openDetailTemplateSetup();
    },

    onContentsSettingBOM: function () {
        this.openDetailTemplateSetup();
    },

    onContentsSumOfPage: function () {
        var thisObj = this;
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 400,
            modal: true,
            FORM_TYPE: this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.Key.FORM_TYPE,
            FORM_SEQ: thisObj.FORM_SEQ,
            isLock: thisObj.isLock
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/EBA/EBA001P_15',
            name: ecount.resource.LBL10748,
            param: param,
            popupType: false,
            additional: false,
        });
    },

    onContentsSortingOfPage: function () {
        var thisObj = this;

        var width = 480;
        var height = 500;
        var url = "/ECERP/Popup.Form/CM100P_53";
        var titleName = "";
        //새소계 공통사용시
        if (this.isNewSubTotalLogic) {
            width = 800;
            height = 600;
            //설정에 따라 화면크기 달라지게 기획요청 - 설기수 2016.11.28
            if (thisObj.formInfo.FormSet.IS_SUBTOTAL_TITLE_SETTABLE == false)
                height = height - 100;

            if (thisObj.formInfo.FormSet.SORT_VIEW_YN != "Y") {
                height = height - 300;
            }
            if (thisObj.formInfo.FormSet.SUBTOT_VIEW_YN != "Y") {
                width = width - 300;
            }

            url = "/ECERP/Popup.Form/CM100P_53_CM3";
            //타이틀 설정에 따라 달라지게 기획요청 - 설기수 2016.11.29
            if (thisObj.formInfo.FormSet.SORT_VIEW_YN != "Y" && thisObj.formInfo.FormSet.SUBTOT_VIEW_YN != "Y"
                && thisObj.formInfo.FormSet.IS_SUBTOTAL_TITLE_SETTABLE == true && thisObj.formInfo.FormSet.SUM_SET_USE_YN != "Y")
                titleName = ecount.resource.LBL10748;
            else if (thisObj.formInfo.FormSet.SUBTOT_VIEW_YN == "N")
                titleName = ecount.resource.LBL04107;
            else
                titleName = ecount.resource.LBL10747;
        } else {
            titleName = ((this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.SUBTOT_VIEW_YN == "N") ? ecount.resource.LBL04107 : ecount.resource.LBL10747);
        }
        var param = {
            width: width,
            height: height,
            modal: true,
            FORM_TYPE: this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.Key.FORM_TYPE,
            FORM_SEQ: thisObj.FORM_SEQ,
            isLock: thisObj.isLock
        };
        // Open popup
        thisObj.openWindow({
            url: url,
            name: titleName,
            param: param,
            popupType: false,
            additional: false,
        });
    },

    onContentsSettingPepper: function () {
        var thisObj = this;
        var form_type = this.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.Key.FORM_TYPE;
        var isShowPrintAlign = form_type.indexOf("SF") > -1 || form_type.indexOf("AF") > -1 || form_type.indexOf("PF") > -1;

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 485,
            modal: true,
            FORM_TYPE: form_type,
            isLock: thisObj.isLock,
            isRestoreDisplayFlag: true,
            isPrintWayDisplayFlag: isShowPrintAlign
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_54',
            name: ecount.resource.LBL12659,
            param: param,
            popupType: false,
            additional: false,
        });
    },


    //Restore default 기본값 복원
    onContentsRestore: function () {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (permit != "W" && thisObj.IsDetailPermit == false) {
            //MSG00141
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
        } else {
            if (thisObj.formInfo.FormSet.TOP_SET_YN == "Y") {
                var customAlert = new Array();
                if (!$.isNull(thisObj.contents.getControl("onlyTopUseYn")) && thisObj.contents.getControl("onlyTopUseYn").getValue() == "N") {
                    customAlert.push({
                        //restore body
                        label: ecount.resource.BTN00808, callback: function () {
                            this.getRestoreForm({ restoreType: "body" });
                        }.bind(this)
                    });
                }
                customAlert.push({
                    //restore all
                    label: ecount.resource.BTN00809, callback: function () {
                        this.getRestoreForm({ restoreType: "all" });
                    }.bind(this)
                });
                ecount.customAlert(ecount.resource.MSG06151, { list: customAlert });
            } else {
                this.getRestoreForm({ restoreType: "all" });
            }
        }
    },

    //Setting Top/Bottom 설정 상단/하단
    onContentsSettingTopBottom: function (data) {
        var thisObj = this;
        var param = {
            width: 800,
            height: 800,
            modal: true,
            FORM_TYPE: this.formDataTemp[0].FormGroups[0].FormSet.Key.FORM_TYPE,
            isLock: thisObj.isLock,
            TabId: data.tabId || "top"
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_55',
            name: ((this.formDataTemp[0].FormGroups[0].FormOutSet.ONLYTOP_USE_YN == "N" && this.formDataTemp[0].FormGroups[0].FormSet.IS_BOTTOM_SETTABLE) ? ecount.resource.BTN00807 : ecount.resource.LBL35311),
            param: param,
            popupType: false,
            additional: false,
        });
    },


    //copy form 양식복사
    onContentsCopyForm: function () {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (permit != "W" && thisObj.IsDetailPermit == false) {
            //MSG00141
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
        } else if (thisObj.contents.getControl("copyTarget").getValue() == "0") {
            thisObj.contents.getControl("copyTarget").showError();
        } else {
            var restoreLists = new Array();
            thisObj.formDataTemp.forEach(function (formData) {
                restoreLists.push({ FORM_TYPE: formData.FormGroups[0].FormOutSet.Key.FORM_TYPE, FORM_SEQ: thisObj.contents.getControl("copyTarget").getValue(), ExtendedCondition: {} });
            });
            ecount.common.api({
                url: "/Common/Form/GetListFormTemplate",
                data: Object.toJSON(restoreLists),
                success: function (result) {
                    thisObj.setHideProgressbar();
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        restoreFormData = Object.clone(result.Data, true);
                        var formGroupTo = thisObj.formDataTemp[0].FormGroups[0];
                        var formGroupFrom = restoreFormData[0].FormGroups[0];

                        formGroupFrom.FormOutSet.AUTH_TYPE = "P";
                        formGroupFrom.FormOutSet.SORT_CD = "";
                        formGroupFrom.FormOutSet.SUBTOT_TYPE = "";
                        formGroupFrom.FormOutSet.SUBTOT_DISPLAY_TYPE = "";
                        formGroupFrom.FormOutSet.SUBTOT_ALIGN_TYPE = "";
                        var possibleColCds = new Array();
                        var formOutColumnFrom = null;
                        formGroupTo.FormOutColumns.forEach(function (col) {
                            possibleColCds.push(col.COL_CD.toUpperCase());
                            formOutColumnFrom = formGroupFrom.FormOutColumns.find(function (item) { return item.COL_CD == col.COL_CD });
                            col.CHECKED_YN = (!$.isNull(formOutColumnFrom) && formOutColumnFrom.CHECKED_YN == "Y") ? "Y" : "N";
                        });
                        //remove item 항목 삭제
                        formGroupFrom.FormOutSetDetails.remove(function (item) { return !possibleColCds.contains(item.COL_CD.toUpperCase()) });
                        formGroupFrom.ViewModel.columns.remove(function (item) { return !possibleColCds.contains(item.id.toUpperCase()) });

                        //해당되는 것만 복사. FormOutColumns은 복사하면 안됨 주의( DO NOT COPY FormOutColumns DTO)
                        formGroupTo.FormOutSet = formGroupFrom.FormOutSet;
                        formGroupTo.FormOutSetDetails = formGroupFrom.FormOutSetDetails;
                        formGroupTo.ViewModel.columns = formGroupFrom.ViewModel.columns;

                        for (var i = 0; i < thisObj.formDataTemp.length; i++) {
                            thisObj.setColumnExceptWidthZero(i);
                        }
                        thisObj.setResetViewer();
                        thisObj.setResetWedgets();
                        thisObj.setHybridGrid();
                        thisObj.onChangeControl({ cid: "restore", __self: thisObj.contents.getControl("restore") });
                    }
                }
            });
        }
    },


    //History 히스토리
    onFooterHistory: function (e) {
        var thisObj = this;
        var param = {
            width: 450,
            height: 150,
            lastEditTime: thisObj.lastEditTime,
            lastEditId: thisObj.lastEditId
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        })
    },

    onFooterShare: function () {
        var thisObj = this;
        //하나라도 없으면 전부다 메시지 보이게 - 주영컨펌2016.06.08
        if (thisObj.viewBag.Permission.Account.Value != "W" && thisObj.viewBag.Permission.Inven.Value != "W" && thisObj.viewBag.Permission.Gw.Value != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03818, PermissionMode: "W" }, { MenuResource: ecount.resource.LBL03821, PermissionMode: "W" }, { MenuResource: ecount.resource.LBL03822, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: '800',
            height: '750',
            formType: thisObj.FORM_TYPE,
            listFlag: 'D',
            isShareView: thisObj.viewBag.InitDatas.isShareView,
            isNewDisplayFlag: true,
            isDeleteDisplayFlag: true,
            isCheckBoxDisplayFlag: true,
            isDonationFlag: ["GF010"].contains(thisObj.FORM_TYPE) ? true : false//양식이 전자결재(GF010) 일경우에만 true
        };
        thisObj.openWindow({
            url: '/ECERP/POPUP.FORM/CM100P_32',
            name: ecount.resource.LBL09124,
            param: param,
            additional: true
        });

    },


    //cancel 취소
    onFooterCancel: function () {
        var thisObj = this;
        thisObj.setFormInfosFromDb();
        //setResetViewer,setResetWedgets 절대 순서 바꾸지 마세요. 
        thisObj.setResetViewer();
        thisObj.setResetWedgets();
        thisObj.setHybridGrid();
        thisObj.onChangeControl({ cid: "cancel", __self: thisObj.footer.getControl("cancel") });
    },

    onFooterDelete: function () {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (thisObj.IsDetailPermit == false) {
            if (permit != "W" && thisObj.IsDetailPermit == false) {
                //permission message 권한 메시지
                ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
                thisObj.footer.getControl('delete').setAllowClick();
                return false;
            }
        }
        // 라벨양식은 순번이 1~7인 양식을 삭제할 수 없음.
        if (thisObj.FORM_TYPE == "SF900" && thisObj.FORM_SEQ < 8) {
            ecount.alert(ecount.resource.MSG01152);
            thisObj.footer.getControl('delete').setAllowClick();
            return false;
        }

        // Processing for AO296
        if (thisObj.FORM_TYPE == 'AO296' && !thisObj.isAllowDeleteAO296) {
            ecount.common.api({
                url: '/Account/Basic/GetListCofmUserReport',
                data: { PARAM: "" },
                success: function (result) {
                    if (result.Status != '200') {
                        alert(result.fullErrorMsg);
                    } else {
                        if (result.Data && result.Data.length > 0) {
                            var _lst = result.Data.where(function (item) { return item.DEFAULT_FORM_SEQ == this.FORM_SEQ }.bind(this));
                            if (_lst && _lst.length > 0) {
                                ecount.alert(ecount.resource.MSG07509 || '보고서에서 사용중인 양식은 삭제할 수 없습니다.<br/>보고서의 양식을 변경 후 다시 시도 바랍니다.');
                                this.footer.getControl('delete').setAllowClick();
                                return false;
                            }
                        }
                        this.isAllowDeleteAO296 = true;
                        this.onFooterDelete();
                    }
                }.bind(this)
            });

            if (!thisObj.isAllowDeleteAO296) {
                thisObj.footer.getControl('delete').setAllowClick();
                return false;
            }
        }

        var csMsg = "";
        // CS기본으로 설정되어있는 양식은 삭제 못하도록
        thisObj.viewBag.InitDatas.CscsFormOutsetBasic.forEach(function (item) {
            csMsg = csMsg + "\n\t - " + item.ALL_MN_GROUPCD + " " + item.ALL_MN_GROUPNM;
        });
        if (csMsg != "") {
            ecount.alert(String.format("{0}\n\n\t{1}{2}", ecount.resource.MSG05374, ecount.resource.LBL09746, csMsg));
            return false;
        }
        // 삭제처리
        var data = new Array();
        thisObj.formDataTemp.forEach(function (item) {
            data.push({
                FORM_TYPE: item.FormGroups[0].FormSet.Key.FORM_TYPE,
                FORM_SEQ: thisObj.FORM_SEQ,
                MENU_TYPE: thisObj.MENU_TYPE,
                IsDetailPermit: thisObj.IsDetailPermit,
                FromProgramId:thisObj.FromProgramId
            });
        });
        if (!$.isEmpty(this.DETAIL_BODY_FORM_TYPE)) {
            data.push({
                FORM_TYPE: this.DETAIL_BODY_FORM_TYPE,
                FORM_SEQ: this.FORM_SEQ,
                MENU_TYPE: thisObj.MENU_TYPE,
                IsDetailPermit: thisObj.IsDetailPermit,
                FromProgramId: thisObj.FromProgramId
            });
        }
        thisObj.setShowProgressbar();
        ecount.confirm(ecount.resource.MSG01738, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Common/Form/DeleteFormTemplate",
                    data: Object.toJSON(data),
                    success: function (result) {
                        thisObj.setHideProgressbar();
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else {
                            if (thisObj.isFromSc) {
                                // 구프레임웍 리로드
                                if (opener != null) {
                                    opener.fnReload();
                                }
                            }
                            // 창닫기
                            if (thisObj.isSaveAfterClose) {
                                var message = {
                                    type: "reload_delete",
                                    formType: thisObj.FORM_TYPE,
                                    formSeq: thisObj.FORM_SEQ,
                                    rowKey: thisObj.rowKey,
                                    callback: thisObj.close.bind(thisObj)
                                };
                                thisObj.sendMessage(thisObj, message);
                            }
                            else {
                                thisObj.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_51", { __ecPage__: null, FORM_TYPE: thisObj.FORM_TYPE, isFromSc: thisObj.isFromSc, MENU_TYPE: thisObj.MENU_TYPE, isSaveAfterClose: thisObj.isSaveAfterClose, FromProgramId : thisObj.FromProgramId }, null);
                            }
                        }
                    }
                });
            } else {
                thisObj.setHideProgressbar();
            }
        });
    },

    onFooterFormList: function () {
        var thisObj = this;
        var param = {
            width: 400,
            height: 400,
            modal: true,
            FORM_TYPE: this.formDataTemp[0].FormGroups[0].FormSet.Key.FORM_TYPE,
            isLock: thisObj.isLock,
            isSelfSubmit: false,
            isSaveAfterClose: this.isSaveAfterClose,
            MENU_TYPE: thisObj.MENU_TYPE,
            FromProgramId: this.FromProgramId
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_51',
            name: "",
            param: param,
            popupType: false,
            additional: false
        });
    },

    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //Ecount Custom Template
    onFooterEcountCustomTemplate: function (e) {
        if (this.useECT) {
            var customerWidth = 1100 * (2 - 0.8);
            var customerHeight = 740 * (2 - 0.8);
            var params = {
                width: customerWidth,
                height: customerHeight

            };
            this.openWindow({
                url: '/ECERP/ECU/ECU570M?navIndex=5&boardId=0&tabFlag=',
                name: ecount.resource.BTN00375,
                param: params,
                fpopupID: this.ecPageID,
                popupType: true,
            });
        }
        
    },

    //save 저장
    onFooterSave: function (e) {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit;//.Value;
        //COFM_FORMOUTSET.AUTH_TYPE
        var authTypeCtl = thisObj.contents.getControl("authType");
        var authType = "";
        if (!$.isNull(authTypeCtl))
            authType = authTypeCtl.getValue();

        if (thisObj.IsDetailPermit == false && ((permit.UPD == true && permit.setting == true) || (permit.UPD != true && permit.Value == "W")) && ($.isEmpty(thisObj.formInfo.FormOutSet.AUTH_TYPE) || thisObj.formInfo.FormOutSet.AUTH_TYPE == "P") && authType == "R") {
            if (thisObj.isSetAuthType == false) {
                this.onContentsSettingAuthType();
                thisObj.footer.getControl('save').setAllowClick();
                return false;
            }
        }
        if (thisObj.IsDetailPermit == false && ($.isEmpty(this.CheckPermissionRequest) && ((permit.UPD == true && permit.CW == false) || (permit.UPD != true && permit.Value != "W")))) {
            //permission message 권한 메시지
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
            thisObj.footer.getControl('save').setAllowClick();
        } else {
            var errcnt = 0;
            //check validate 유효성 체크
            var invalid = thisObj.contents.validate();
            errcnt = invalid.merge().length;
            if (invalid.result.length > 0) {
                var invalidControl = invalid.result[0][0];
                // Fixed Error: List setting > Input empty for Rows per Page > click Save
                invalidControl = ($.isArray(invalidControl)) ? invalidControl[0].control : invalidControl.control;
                if (!e.unfocus) invalidControl.setFocus(0);
            }
            // check valid  유효성 체크
            thisObj.commonForm.getWidgetHelper().getCheckKeys().forEach(function (key, j) {
                //call check function 호출 매핑 펑션
                errcnt = thisObj.commonForm.getWidgetHelper().getCheckWedgets().get(key)(errcnt);
            });


            //TODO: Check display order for AO296
            if (thisObj.FORM_TYPE == 'AO296' && $.isNull(this.formDataTemp) == false && this.formDataTemp.length > 0) {
                var _formGroups = this.formDataTemp[0].FormGroups;
                if ($.isNull(_formGroups) == false && _formGroups.length > 0) {
                    var _formOutSetDetails = this.formDataTemp[0].FormGroups[0].FormOutSetDetails;
                    if ($.isNull(_formOutSetDetails) == false && _formOutSetDetails.length > 2) {
                        var _textColumns = _formOutSetDetails.where(function (item) {
                            return item.COL_TYPE.substring(0, 1) != '8' && item.COL_TYPE.substring(0, 1) != '9';
                        });
                        if ($.isNull(_textColumns) == false && _textColumns.length > 0) {
                            var _isInvalid = false;
                            var _length = _textColumns.length;
                            _textColumns = _textColumns.sort(function (a, b) {
                                if (Number(a.Key.NUM_SORT) < Number(b.Key.NUM_SORT))
                                    return -1;
                                if (Number(a.Key.NUM_SORT) > Number(b.Key.NUM_SORT))
                                    return 1;
                                return 0;
                            });
                            if (Number(_textColumns[0].Key.NUM_SORT) > 1 && Number(_textColumns[_length - 1].Key.NUM_SORT) < _formOutSetDetails.length) {
                                _isInvalid = true;
                            } else if (_length > 1) {
                                for (var i = 1; i < _length; i++) {
                                    if (Number(_textColumns[i].Key.NUM_SORT) != Number(_textColumns[i - 1].Key.NUM_SORT) + 1) {
                                        _isInvalid = true;
                                        break;
                                    }
                                }
                            }
                            if (_isInvalid) {
                                ecount.alert(ecount.resource.MSG04541);
                                thisObj.footer.getControl('save').setAllowClick();
                                return false;
                            }
                        }
                    }
                }
            }

            if (errcnt == 0) {
                thisObj.commonForm.getWidgetHelper().getMappingKeys().forEach(function (key, j) {
                    //call mapping function 호출 매핑 펑션
                    thisObj.commonForm.getWidgetHelper().getMappingWedgets().get(key)();
                });

                if (thisObj.formBasic == 1 && thisObj.isFromSc) {
                    //양식권한 종류만 저장시
                    //    thisObj.setSaveFormAuth();
                    thisObj.setSave();
                } else {

                    if (thisObj.formInfo.FormSet.CHECK_YN == "Y" || (this.isScheduleFormType && thisObj.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE == 'C')) {
                        //TO-DO 현재 수표는 개발대상이 아님.
                    } else if (thisObj.formInfo.FormSet.TOP_SET_YN != "Y" || (thisObj.formInfo.FormSet.TOP_SET_YN == "Y" && this.contents.getControl("onlyTopUseYn").getValue() == "N")) {
                        for (var i = 0; i < thisObj.formDataTemp.length; i++) {
                            if (thisObj.formDataTemp[i].FormGroups[0].FormOutSetDetails.where(function (n) { return n.HEAD_SIZE > 0 }).length < 2 && thisObj.formDataTemp[i].FormGroups[0].FormSet.COLUMN_MAX_CNT > 0) {
                                ecount.alert(ecount.resource.MSG00423);
                                thisObj.footer.getControl('save').setAllowClick();
                                return false;
                            }
                        }
                    }
                    //계산식 유효성 체크 로직
                    for (var calcI = 0, calcILng = thisObj.formDataTemp.length; calcI < calcILng; calcI++) {
                        var caseCount = 0;
                        var addList = [];
                        var addSql = [];
                        for (var calcJ = 0, calcJLng = thisObj.formDataTemp[calcI].FormGroups[0].FormOutSetDetails.length; calcJ < calcJLng; calcJ++) {
                            var calcItem = thisObj.formDataTemp[calcI].FormGroups[0].FormOutSetDetails[calcJ];
                            var selectColCd = calcItem.SELECT_COL_CD || "";
                            var colCd = calcItem.COL_CD || "";
                            var caseList = selectColCd.split("case when");

                            caseCount += caseList.length - 1;

                            if (colCd.trim().startsWith("ADD", true) && $.isEmpty(selectColCd.trim())) {
                                ecount.alert(ecount.resource.MSG01743);
                                thisObj.footer.getControl('save').setAllowClick();
                                return false;
                            }

                            if (colCd.trim().startsWith("ADD", true)) {
                                addList.push(colCd);
                                addSql.push(selectColCd);
                            }
                        }
                        if (!thisObj.checkFormulaCircularReference(addList, addSql, calcI)) {
                            ecount.alert(ecount.resource.MSG04758);
                            thisObj.footer.getControl('save').setAllowClick();
                            return false;
                        }
                        if (caseCount > 10) {
                            ecount.alert(String.format(ecount.resource.LBL09100, 10));
                            thisObj.footer.getControl('save').setAllowClick();
                            return false;
                        }
                    }
                    //저장시 html 도장 위치정보로 갱신 
                    if (thisObj.formInfo.FormSet.IS_STAMP_IMPRINTABLE == true) {
                        if (!$.isNull(thisObj.contents.getControl("signYn")) && thisObj.contents.getControl("signYn").getValue()) {
                            var stampPosition = thisObj.contents.getControl("topViewer").getStampPosition();
                            if (!$.isNull(stampPosition.originTop) && !$.isEmpty(stampPosition.originTop) && stampPosition.originTop.indexOf('%') < 0) {
                                thisObj.formInfo.FormOutSet.SIGN_TOPMARGIN = stampPosition.top || 0;
                                thisObj.contents.getControl("signTopMargin").setValue(thisObj.formInfo.FormOutSet.SIGN_TOPMARGIN);
                            }
                            if (!$.isNull(stampPosition.originLeft) && !$.isEmpty(stampPosition.originLeft) && stampPosition.originLeft.indexOf('%') < 0) {
                                thisObj.formInfo.FormOutSet.SIGN_LEFTMARGIN = stampPosition.left || 0;
                                thisObj.contents.getControl("signLeftMargin").setValue(thisObj.formInfo.FormOutSet.SIGN_LEFTMARGIN);
                            }
                        }
                    }

                    //기본값 할당
                    thisObj.formDataTemp.forEach(function (formTemp, i) {
                        //reset cursor order number 커서순서 초기화
                        formTemp.FormGroups[0].FormOutSetDetails.forEach(function (item, j) {
                            item.HEAD_SIZE = item.HEAD_SIZE || 0;//헤드사이즈
                            item.HEAD_POS = item.HEAD_POS || "";//헤드위치
                            item.TOT_YN = item.TOT_YN || "N";//합계표시여부
                            item.SELECT_COL_CD = item.SELECT_COL_CD || "";//SELECT구문
                            item.USERCOL_CD = item.USERCOL_CD || "";//사용자지정
                            item.BALANCE_TYPE = item.BALANCE_TYPE || "";//잔액구분
                            item.ZERO_CHK_YN = item.ZERO_CHK_YN || "N";//소수뒤0표시여부
                            item.COL_DISPLAY_STATE = item.COL_DISPLAY_STATE || "";//표시기준
                            item.COL_ESSENTIAL_YN = item.COL_ESSENTIAL_YN || "N";//필수항목값
                            item.INPUT_TITLE_NM = item.INPUT_TITLE_NM || "";//입력화면 헤드타이틀
                            item.COLSPAN_CNT = item.COLSPAN_CNT || 1;//셀병합수
                            item.BASIC_YN = item.BASIC_YN || "N";//기본항목 사용여부
                            item.SUBTOT_YN = item.SUBTOT_YN || "N";//소계표시여부
                            if (thisObj.FORM_TYPE == 'AO080' && item.COL_CD == 'F.AMOUNT') {
                                item.DISPLAY_PERIOD_TYPE = item.DISPLAY_PERIOD_TYPE || "1";
                            } else {
                                item.DISPLAY_PERIOD_TYPE = item.DISPLAY_PERIOD_TYPE || "";//기수표시방법
                            }
                            item.DISPLAY_COL_TYPE = item.DISPLAY_COL_TYPE || "";//금액표시방법
                            item.TODAY_TIME_TF = item.TODAY_TIME_TF || 0;   // 금일시간표시 (1: 체크, 0: 체크안함)
                        });
                        if ($.isEmpty(formTemp.FormGroups[0].FormOutSet.SEARCH_METHOD))
                            formTemp.FormGroups[0].FormOutSet.SEARCH_METHOD = "S";

                        if ($.isEmpty(formTemp.FormGroups[0].FormOutSet.HGRK_AC_BASIC_CD))
                            formTemp.FormGroups[0].FormOutSet.HGRK_AC_BASIC_CD = "F";

                        if ($.isEmpty(formTemp.FormGroups[0].FormOutSet.EXPAND_METHOD))
                            formTemp.FormGroups[0].FormOutSet.EXPAND_METHOD = "E";

                        if (thisObj.formInfo.FormSet.FORM_ADD_YN == "N" && $.isEmpty(formTemp.FormGroups[0].FormOutSet.TITLE_NM)) {
                            formTemp.FormGroups[0].FormOutSet.TITLE_NM = "DEFAULT1";
                        }
                        // 양식제목 체크
                        if (thisObj.formInfo.FormSet.BODY_TITLE_YN == 1) { // 타이틀설정이 가능하고
                            if (thisObj.formInfo.FormSet.FORM_ADD_YN == 1 && formTemp.FormGroups[0].FormOutSet.FORM_NM.trim() == "") { // 타이틀이 없으면 양식명을 설정합니다.
                                formTemp.FormGroups[0].FormOutSet.FORM_NM = formTemp.FormGroups[0].FormOutSet.TITLE_NM;
                            }
                        }
                        formTemp.FormGroups[0].FormOutSet.HEADCOL_CNT = formTemp.FormGroups[0].FormOutSetDetails.length;
                        //if formtype is different from each other, basic form info is sync.    폼타입 다른 경우 기본 설정 싱크 
                        if (i > 0) {
                            formTemp.FormGroups[0].FormOutSet.TITLE_NM = thisObj.formDataTemp[i - 1].FormGroups[0].FormOutSet.TITLE_NM;
                            formTemp.FormGroups[0].FormOutSet.FORM_NM = thisObj.formDataTemp[i - 1].FormGroups[0].FormOutSet.FORM_NM;
                            formTemp.FormGroups[0].FormOutSet.BASIC_TYPE = thisObj.formDataTemp[i - 1].FormGroups[0].FormOutSet.BASIC_TYPE;
                            formTemp.FormGroups[0].FormOutSet.AUTH_TYPE = thisObj.formDataTemp[i - 1].FormGroups[0].FormOutSet.AUTH_TYPE;
                        }

                        //선택언어 저장(수신화면양식설정에서 사용)
                        if (!$.isEmpty(thisObj.formInfo.FormSet) && (thisObj.formInfo.FormSet.LAN_YN == "Y")) {
                            formTemp.FormGroups[0].FormOutSet.LAN_TYPE = thisObj.contents.getControl("lanType").getValue();
                        }
                    });

                    thisObj.setSave();
                }
            } else {
                thisObj.footer.getControl('save').setAllowClick();
            }
        }
    },

    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/

    //F8 Event
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterSave();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //reset wedgets
    setResetWedgets: function (targets) {
        var thisObj = this;
        thisObj.commonForm.getWidgetHelper().getResetKeys().forEach(function (key, j) {
            //call reset function 호출 리셋 펑션
            if ($.isNull(targets))
                thisObj.commonForm.getWidgetHelper().getResetWedgets().get(key)();
            else {
                targets.forEach(function (tkey) {
                    if (thisObj.wedgetResetGroupMaps.has(tkey)) {
                        if (thisObj.wedgetResetGroupMaps.get(tkey).contains(key)) {
                            thisObj.commonForm.getWidgetHelper().getResetWedgets().get(key)();
                        }
                    }
                });
            }
        });
    },

    setResetViewer: function () {
        var thisObj = this;
        if (!thisObj.isFromSc || thisObj.formBasic != 1) {
            if (thisObj.formInfo.FormSet.TOP_BOTTON_YN == "Y") {
                thisObj.contents.getControl("topViewer").setHtml(thisObj.formDataTemp[0].FormGroups[0].FormOutSetTxt.TOP_TXT);
            }
            if (thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                thisObj.contents.getControl("bottomViewer").setHtml(thisObj.formDataTemp[0].FormGroups[0].FormOutSetTxt.BOTTON_TXT);
            }
        }
    },



    //save
    setSave: function () {
        var thisObj = this;
        var data;
        if (thisObj.formBasic == 1 && thisObj.formInfo.FormSet.FORM_ADD_TYPE != 0
            || this.FORM_SEQ > 99 && thisObj.formInfo.FormSet.FORM_ADD_TYPE == 0) {
            data = { FORM_TYPE: this.FORM_TYPE, FORM_SEQ: this.FORM_SEQ, formDataTemp: this.formDataTemp, IsJustAuth: true, MENU_TYPE: thisObj.MENU_TYPE, IS_CS: thisObj.IS_CS };
        } else {
            //상세양식이 없는 예외케이스 다른 양식을 불러오기 때문에 seq를 조정함.
            this.formDataTemp[0].FormGroups[0].FormSeq = this.FORM_SEQ;
            data = {
                FORM_TYPE: this.FORM_TYPE,
                FORM_SEQ: this.FORM_SEQ,
                formDataTemp: this.formDataTemp,
                MENU_TYPE: thisObj.MENU_TYPE,
                IS_CS: thisObj.IS_CS,
                CheckPermissionRequest: thisObj.CheckPermissionRequest,
                IsDetailPermit: this.IsDetailPermit,
                FromProgramId: this.FromProgramId
            };
        }
        thisObj.setShowProgressbar();
        ecount.common.api({
            url: "/Common/Form/SaveFormTemplate",
            data: Object.toJSON(data),
            error: function () {
                thisObj.setHideProgressbar();
                return false;
            },
            success: function (result) {
                thisObj.setHideProgressbar();
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    if (thisObj.formInfo.FormSet.VIEW_TYPE == "E") {
                        thisObj.setTimeout(function () { thisObj.close(); }, 0);
                    } else if (thisObj.formInfo.FormSet.VIEW_TYPE == "F") {
                        if (thisObj.isFromSc) {
                            // 구프레임웍 리로드
                            if (opener != null) {
                                opener.fnReload();
                            }
                            thisObj.setTimeout(function () { thisObj.close(); }, 0);
                        } else {
                            var message = {
                                type: "reload",
                                formType: thisObj.FORM_TYPE,
                                formSeq: result.Data[0].FormGroups[0].FormSeq,
                                rowKey: thisObj.rowKey,
                                callback: thisObj.close.bind(thisObj)
                            };
                            thisObj.sendMessage(thisObj, message);
                        }
                    } else if (["H", "J"].contains(thisObj.formInfo.FormSet.VIEW_TYPE)) {
                        //수신화면양식설정
                        var message = {
                            type: "reload",
                            formType: thisObj.FORM_TYPE,
                            formSeq: result.Data[0].FormGroups[0].FormSeq,
                            formName: result.Data[0].FormGroups[0].FormOutSet.TITLE_NM,
                            callback: thisObj.close.bind(thisObj)
                        };
                        thisObj.sendMessage(thisObj, message);
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    } else {
                        // 창닫기
                        if (thisObj.isSaveAfterClose) {
                            var message = {
                                type: "reload",
                                formType: thisObj.FORM_TYPE,
                                formSeq: result.Data[0].FormGroups[0].FormSeq,
                                rowKey: thisObj.rowKey,
                                callback: thisObj.close.bind(thisObj)
                            };
                            if (thisObj.isScheduleFormType) {
                                message["DisplayUnit"] = result.Data[0].FormGroups[0].FormOutSet.DISP_UNIT;
                                message["LineScheduleDetailNum"] = result.Data[0].FormGroups[0].FormOutSet.SCH_DTLS_ROW_CNT;
                            }
                            thisObj.sendMessage(thisObj, message);
                        }
                        else {
                            //신규인 경우 
                            if (thisObj.isNew) {//(thisObj.FORM_SEQ == 99) {
                                thisObj.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_02", { __ecPage__: null, FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: result.Data[0].FormGroups[0].FormSeq, isFromSc: thisObj.isFromSc, MENU_TYPE: thisObj.MENU_TYPE, isSaveAfterClose: this.isSaveAfterClose }, null);
                            } else {
                                thisObj.viewBag.InitDatas.Template.FormInfos = Object.clone(result.Data, true);

                                thisObj.setFormInfosFromDb();
                                //setResetViewer,setResetWedgets 절대 순서 바꾸지 마세요. 
                                thisObj.setResetViewer();
                                thisObj.setResetWedgets();
                                thisObj.setHybridGrid();
                                if (thisObj.isFromSc) {
                                    // 구프레임웍 리로드
                                    if (opener != null) {
                                        opener.fnReload();
                                    }
                                }
                                else {
                                    var message = {
                                        callback: thisObj.close.bind(thisObj)
                                    };

                                    setTimeout(function () {
                                        thisObj.sendMessage(thisObj, message);
                                    }, 500);
                                }
                            }
                        }// 창닫기

                    }
                }
            }
        });
    },

    //show progress bar 진행바 보이기
    setShowProgressbar: function () {
        this.showProgressbar(true);
    },

    //hide progress bar 진행바 감추기
    setHideProgressbar: function () {
        this.hideProgressbar();
        this.footer.getControl('save').setAllowClick();
        if (this.contents.getControl("restore") != null)
            this.contents.getControl("restore").setAllowClick();
    },

    // add item popup 항목 추가 팝업
    setAddItemPopup: function (data) {
        var thisObj = this;
        var colcd = data.rowItem.COL_CD;
        var param = {
            height: 450,
            width: 450,
            modal: true,
			FORM_TYPE: this.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE,
			FORM_SEQ: this.FORM_SEQ,
            formIndex: data.formIndex,
            targetColCd: colcd,
            checkMaxCount: this.formDataTemp[data.formIndex].FormGroups[0].FormSet.COLUMN_MAX_CNT
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_47',
            name: "",
            param: param,
            popupType: false,
            additional: false,
        });
    },

    //setting popup  설정 팝업
    setSettingPopup: function (data) {
        var thisObj = this;

        var colcd = data.rowItem.COL_CD;

        if (this.isScheduleFormType) {
            var idx = colcd.indexOf(ecount.delimiter);
            if (idx > 0) {
                var prefixColcd = colcd.substring(0, idx);
                colcd = prefixColcd.toLowerCase();
            }
        }
        //var showColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == colcd });
        var param = {
            width: (($.isEmpty(colcd)) ? 800 : 350),
            height: 720,
            modal: true,
            FORM_TYPE: this.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE,
            formIndex: data.formIndex,
            COL_CD: colcd,
            //DefaultSetShowType: (showColumn !== null) ? showColumn.defaultSetShowType : "",
            isLock: thisObj.isLock
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_56',// '/ECERP/Popup.Form/CM100P_42',
            name: "",
            param: param,
            popupType: false,
            additional: false,
        });
    },

    setReSortData: function (data) {
        var thisObj = this;
        if (data.type == "get") {
            var sortCds = new Array();
            var subTotTypes = new Array();
            var subTotMap = new $.HashMap();
            if (thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.SUBTOT_VIEW_YN == "Y") {
                if (!$.isEmpty(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_DISPLAY_TYPE)) {
                    thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_DISPLAY_TYPE.split(ecount.delimiter).forEach(function (item, i) {
                        var aryItem = item.split(",");
                        if (aryItem.length > 0 && !$.isEmpty(aryItem[0])) {
                            subTotMap.set(aryItem[0], { SUBTOT: aryItem[1], DISPLAY_PARENT_SUBTOT: aryItem[2] });
                        }
                    });
                }
            }
            if (thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.SORT_VIEW_YN == "Y") {
                //num_sort 기준으로 저장되어 있기 때문에 삭제되면 순서가 바뀌어서 어떤 항목인지 알수 없어서 col_cd값 미리보관.
                if (!$.isEmpty(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SORT_CD)) {
                    thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SORT_CD.split(",").forEach(function (item, i) {
                        var aryItem = item.split(" ");
                        if (aryItem.length >= 2) {
                            var result = thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetDetails.find(function (detail) { return detail.Key.NUM_SORT == aryItem[0]; });
                            if (!$.isNull(result)) {
                                if (subTotMap.has(aryItem[0])) {
                                    sortCds.push({ 'ORDER': i + 1, 'SORTCODE': result.COL_CD, 'SORTTYPE': aryItem[1] || "ASC", 'SUBTOT': subTotMap.get(aryItem[0]).SUBTOT, 'DISPLAY_PARENT_SUBTOT': subTotMap.get(aryItem[0]).DISPLAY_PARENT_SUBTOT });
                                } else {
                                    sortCds.push({ 'ORDER': i + 1, 'SORTCODE': result.COL_CD, 'SORTTYPE': aryItem[1] || "ASC", 'SUBTOT': "", 'DISPLAY_PARENT_SUBTOT': "0" });
                                }
                            }
                        }
                    });
                }
                if (thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.SUBTOT_VIEW_YN == "Y") {
                    if (!$.isEmpty(thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_TYPE)) {
                        thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_TYPE.split(ecount.delimiter).forEach(function (item, i) {
                            var aryItem = item.split(",");
                            subTotTypes.push({ 'ORDER': i + 1, 'COL_CD': aryItem[0].toUpperCase(), 'DATA_TYPE_CHAR1': aryItem[1] });
                        });
                    }
                }
            }
            return { sortCds: sortCds, subTotTypes: subTotTypes };
        } else if (data.type == "set") {
            //정렬기준
            if (thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.SORT_VIEW_YN == "Y") {
                var sortCd = "";
                var reSortCds = new Array();
                var subTot = "";
                var subTotDisplayType = "";
                //항목 있는 것만 가져오기
                data.sortCds.forEach(function (rowItem) {
                    var coldetail = thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSetDetails.find(function (detail) { return detail.COL_CD.toUpperCase() == rowItem.SORTCODE.toUpperCase(); });
                    if (!$.isNull(coldetail)) {
                        sortCd = sortCd + (($.isEmpty(sortCd)) ? "" : ",") + coldetail.Key.NUM_SORT + " " + rowItem.SORTTYPE;
                        if (thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.SUBTOT_VIEW_YN == "Y" && !$.isEmpty(rowItem.SUBTOT))
                            subTotDisplayType = subTotDisplayType + (($.isEmpty(subTotDisplayType)) ? "" : ecount.delimiter) + coldetail.Key.NUM_SORT + "," + rowItem.SUBTOT + "," + rowItem.DISPLAY_PARENT_SUBTOT;

                        reSortCds.push(rowItem.SORTCODE.toUpperCase());
                    }
                });
                thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SORT_CD = sortCd;
                if (thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.SUBTOT_VIEW_YN == "Y") {
                    thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_DISPLAY_TYPE = subTotDisplayType;

                    data.subTotTypes.forEach(function (rowItem) {
                        if (reSortCds.contains(rowItem.COL_CD.toUpperCase())) {
                            subTot = subTot + (($.isEmpty(subTot)) ? "" : ecount.delimiter) + String.format("{0},{1}", rowItem.COL_CD, rowItem.DATA_TYPE_CHAR1);
                        }
                    });
                    thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormOutSet.SUBTOT_TYPE = subTot;
                }
            }
        }
    },



    // delete item 항목 삭제
    setDeleteItem: function (data) {
        var thisObj = this;
        if (thisObj.formInfo.FormSet.CHECK_YN == "Y") {
            //TO-DO 현재 수표는 개발대상이 아님.
        } else if (thisObj.formInfo.FormSet.TOP_SET_YN != "Y" || (thisObj.formInfo.FormSet.TOP_SET_YN == "Y" && this.contents.getControl("onlyTopUseYn").getValue() == "N")) {
            if (thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.where(function (n) { return n.HEAD_SIZE > 0 }).length <= 2 && thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet.COLUMN_MAX_CNT > 0) {
                ecount.alert(ecount.resource.MSG06280);
                return false;
            }
        }
        var sortCds = new Array();
        var subTotTypes = new Array();
        var beforeSortData = this.setReSortData({ type: "get" });
        //update data 상단 데이터 갱신
        this.setSettingDetail({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
        this.setUiSync({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
        this.setReSortData({ type: "set", sortCds: beforeSortData.sortCds, subTotTypes: beforeSortData.subTotTypes });
    },


    //get detail by col code 항목상세 데이터
    getFormDetailByColCd: function (data) {
        var thisObj = this;
        var OtherDates = new Array();
        if ($.isEmpty(data.ColCd)) {
            return {
                FormSet: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet,
                FormOutSet: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSet,
                OtherDates: OtherDates, //other dates 다른 날짜 데이터
                FormColumns: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns,
                FormOutSetDetails: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails,
                FormOutColumns: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns,
                columns: thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.sortBy(function (s) { return s.index; })
            }
        } else {
            return {
                FormSet: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet,
                FormOutSet: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSet,
                OtherDates: OtherDates, //other dates 다른 날짜 데이터
                FormColumns: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns,
                //선택된 항목만 조회
                FormOutSetDetails: [thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.find(function (item) { return item.COL_CD == data.ColCd })],
                FormOutColumns: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns,
                columns: [thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == data.ColCd })]
            }
        }
    },

    //sync left ui 우측 UI 갱신
    setUiSync: function (data) {
        console.log("setUiSync");
        var thisObj = this;
        //get group 그룹가져오기
        var groupColCd = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD }).GROUP_COL_CD;
        var colGroup = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.where(function (item, i) { return item.GROUP_COL_CD == groupColCd });
        if (data.checked) {
            var targetColCdIdx;
            colGroup.forEach(function (colOfGroup) {
                var columnItem = thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                //add item item on right grid 우측 하단 그리드 항목 추가

                //Processing for AO080 (Fixed for display order)
                var col = data.target.COL_CD, direction = "right";
                if (thisObj.FORM_TYPE == "AO080") {
                    var cols = Object.clone(thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns, true);
                    var rightCols = cols.where(function (item) { return item.ITEM_SEQ > colOfGroup.ITEM_SEQ && item.CHECKED_YN == "Y" });
                    if (rightCols != null && rightCols.length > 0) {
                        direction = "left";
                        col = rightCols[0].COL_CD;
                    } else {
                        var leftCols = cols.where(function (item) { return item.ITEM_SEQ < colOfGroup.ITEM_SEQ && item.CHECKED_YN == "Y" });
                        if (leftCols != null && leftCols.length > 0) {
                            direction = "right";
                            col = leftCols[leftCols.length - 1].COL_CD;
                        }
                    }
                }
                var widthCustom = '100';
                if (thisObj.FORM_TYPE == "AO080" && colOfGroup.COL_CD === 'F.AMOUNT') {
                    widthCustom = '180';
                }

                // [A17_02333 bsy] 동일 컬럼 그리드 삭제후 add 
                thisObj.contents.getGrid(thisObj.gridId, false).grid.removeColumn(colOfGroup.COL_CD, { removeDOM: true });
                thisObj.contents.getGrid(thisObj.gridId, false).grid.addColumn({
                    //title: colOfGroup.TITLE,
                    title: thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == colOfGroup.COL_CD }).title,
                    id: colOfGroup.COL_CD,
                    propertyName: colOfGroup.COL_CD,
                    width: widthCustom//Chung Thanh Phuoc
                }, {
                        columnId: col, direction: direction,
                        customizeColumn: function (value, rowItem) {
                            return thisObj.setCustomSettingRow(value, rowItem, columnItem);
                        }
                    });
                data.target.COL_CD = colOfGroup.COL_CD;
                //[A17_02333 bsy] 코드형 couple colcd add
                thisObj.addCodeCoupleGridColumn({ formIndex: thisObj.formTabIndex, COL_CD: colOfGroup.COL_CD });
            });

        } else {
            colGroup.forEach(function (colOfGroup) {
                //[A17_02333 bsy] 코드형 couple colcd get
                var hidColCd = thisObj.getCodeCoupleColCd({ formIndex: thisObj.formTabIndex, COL_CD: colOfGroup.COL_CD });
                var coupleCol;
                var isHideColumn = false;

                //[A17_02333 bsy] 코드형 커플의 hide column 존재여부 체크  
                if (!$.isEmpty(hidColCd)) {
                    coupleCol = thisObj.contents.getGrid(thisObj.gridId, false).grid.getColumnInfoList().where(function (n) { return n.id == hidColCd });
                    if (coupleCol.length == 1 && coupleCol[0].isHideColumn == true) {
                        isHideColumn = true;
                    }
                }
                //[A17_02333 bsy] 코드형 커플이면 커플항목이 보여지는 리스트에 있으면 숨기기
                if (!$.isEmpty(hidColCd) && coupleCol.length == 1 && isHideColumn == false) {
                    thisObj.contents.getGrid(thisObj.gridId, false).grid.setColumnInfo(colOfGroup.COL_CD, { "width": "0", "isHideColumn": true });
                    // thisObj.moveCoupleColumn({ srcColId: hidColCd, destColId: colOfGroup.COL_CD });
                } else {
                    //remove item on right grid 우측 하단 그리드 항목 제거
                    thisObj.contents.getGrid(thisObj.gridId, false).grid.removeColumn(colOfGroup.COL_CD, { removeDOM: true });
                }

                // [A17_02333 bsy] 코드형couple 찾아서 삭제
                if (isHideColumn == true) {
                    thisObj.contents.getGrid(thisObj.gridId, false).grid.removeColumn(hidColCd, { removeDOM: true });
                }

            });
        }
        //[A17_02333 bsy] hide 컬럼 정렬
        this.moveHideColumn();
        //sync sort number 정렬순서 동기화
        this.setSortSync({ formIndex: this.formTabIndex });
        this.setUITotalSync();
    },

    //setting detail 상세 설정
    setSettingDetail: function (data) {
        var thisObj = this;
        //get group  그룹가져오기
        var groupColCd = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD }).GROUP_COL_CD;
        var colGroup = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.where(function (item, i) { return item.GROUP_COL_CD == groupColCd });
        if (data.checked) {
            colGroup.forEach(function (colOfGroup) {
                var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                var index = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.length) + 1;

                var formOutColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD });
                var CUST_PASS_SORT_FLAG = false;
                var COL_TYPE_PREFIX = "0";
                var HEAD_POS = "left";
                if (formColumn.COL_TYPE != null && formColumn.COL_TYPE.length > 0) { COL_TYPE_PREFIX = formColumn.COL_TYPE.substring(0, 1); }
                if (thisObj.FORM_TYPE == "SP900" && formColumn.COL_CD == "CUST_PASS_PROD_CD.SORT") { CUST_PASS_SORT_FLAG = true; }
                //number type 8 or 9 is right   숫자타입(8또는9)일경우 right 또는 CS품목검색창의 정렬순서 인 경우
                if (COL_TYPE_PREFIX == "8" || COL_TYPE_PREFIX == "9" || CUST_PASS_SORT_FLAG) { HEAD_POS = "right"; }
                else if (COL_TYPE_PREFIX == "1" || COL_TYPE_PREFIX == "2") { HEAD_POS = "center"; }

                //12로 고정됨.
                HEAD_FONT = "0";
                var DISPLAY_PERIOD_TYPE = "";
                var HEAD_SIZE = 100;
                /*
                   Modify by Chung Thanh Phuoc
                   Set Param Property DISPLAY_PERIOD_TYPE from null to zero (0)
                   DISPLAY_PERIOD_TYPE is Widget of Display Date / Display Period
                   F.AMOUNT is Col_CD
                   DISPLAY_PERIOD_TYPE : "" is Widget Input
                   DISPLAY_PERIOD_TYPE : "0" is Widget Select option Display Date / Display Period
               */
                if (thisObj.FORM_TYPE == "AO080" && data.rowItem.COL_CD == "F.AMOUNT") {
                    DISPLAY_PERIOD_TYPE = "1";
                    HEAD_SIZE = 180;
                }
                var DISPLAY_COL_TYPE = "";
                var LABEL_IMAGE_YN = formColumn.LABEL_IMAGE_YN;

                //column type  칼럼타입 설정(2번째자리)
                var COL_TYPE_PREFIX2 = "0";
                if (formColumn.COL_TYPE != null && formColumn.COL_TYPE.length > 1) { COL_TYPE_PREFIX2 = formColumn.COL_TYPE.substring(1, 2); }

                //사용자컬럼인지 설정
                var USER_COL = "0";
                if (formColumn.COL_CD.length > 2 && (formColumn.COL_CD.substring(0, 3).toUpperCase() == "ADD" || LABEL_IMAGE_YN == "Y" || LABEL_IMAGE_YN == "N")) { USER_COL = "1"; }

                //폰트는 빈값으로 개발리뷰결정 2016.07.21

                var font = "";
                var tot_Yn = "N";
                if (!["R", "P", "L", "G"].contains(thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet.VIEW_TYPE)) {
                    //개발결정사항:1581 - 예외처리하기로
                    if (!["AO296"].contains(thisObj.FORM_TYPE) && !$.isEmpty(formColumn.COL_TYPE) && formColumn.COL_TYPE.length > 0
                        && ["8", "9"].contains(formColumn.COL_TYPE.substring(0, 1))) {
                        tot_Yn = "Y";
                    }
                }

                var _PERIOD_DISPLAY_TYPE = ["RPS", "SBD", "RPS_F", "SBD_F", "RPS_MULTI", "SBD_MULTI"].contains(formColumn.COL_CD) ? "6" : "4";

                //[A17_02333 bsy] 추가되는 컬럼이 hide 컬럼인데 이미 들어가 있는 경우 삭제 후 다시 넣어주기 (현황)                
                thisObj.removeColumnInfoForDefault({ formIndex: data.formIndex, COL_CD: formColumn.COL_CD });

                //항목정보 설정
                var detailtemp = {
                    Key: { FORM_TYPE: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE, NUM_SORT: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.length + 1 },//?
                    HEAD_SIZE: HEAD_SIZE,
                    HEAD_POS: HEAD_POS,//
                    HEAD_FONT: HEAD_FONT,//
                    COL_TYPE: formColumn.COL_TYPE,//
                    HEAD_TITLE_NM: formOutColumn.TITLE,
                    COL_CD: formColumn.COL_CD,//
                    FONT: font,
                    //구로직에 치환 로직이 있어서 동일하게 처리
                    //컬럼에는 별칭이 존재하지 않는 데 예외 케이스 존재할 수 있어서 동일하게 치환함.
                    SELECT_COL_CD: ($.isEmpty(formColumn.CONVERT_COL_NM) ? "" : formColumn.CONVERT_COL_NM.trim().replace(/\s[aA][0-9]{1,2}$/, "")),//
                    USERCOL_CD: "",
                    BALANCE_TYPE: "",
                    ZERO_CHK_YN: $.isEmpty(formColumn.DECIMAL_TYPE) == false && (formColumn.COL_TYPE.substring(0, 1) == '8' || formColumn.COL_TYPE.substring(0, 1) == '9') ? "B" : "Y",
                    ZERO_DISPLAY_YN: $.isEmpty(formColumn.DECIMAL_TYPE) ? "Y" : "B",
                    COL_DISPLAY_STATE: formColumn.COL_DISPLAY_STATE,
                    COL_ESSENTIAL_YN: "N",
                    INPUT_TITLE_NM: "",//INPUT_TITLE_NM,
                    BASIC_YN: formColumn.DEFAULT_YN || "N",
                    TOT_YN: tot_Yn,
                    DISPLAY_PERIOD_TYPE: DISPLAY_PERIOD_TYPE,//
                    PERIOD_DISPLAY_TYPE: _PERIOD_DISPLAY_TYPE,
                    DISPLAY_COL_TYPE: DISPLAY_COL_TYPE,//
                    LABEL_IMAGE_YN: null,//LABEL_IMAGE_YN,
                    DEFAULT_SET_SHOW_TYPE: $.isNull(formColumn.DEFAULT_SET_SHOW_TYPE) ? "" : formColumn.DEFAULT_SET_SHOW_TYPE.substring(0, 1),//
                    IS_REQUISITE2: formColumn.REQUISITE2_DEFAULT_VALUE,
                    IS_EDITABLE: formColumn.EDITABLE_DEFAULT_VALUE//,
                };
                //get empty temp 빈템플릿 가져오기
                var tmpOutsetData = Object.clone(thisObj.viewBag.InitDatas.Template.FormOutSetDetailTemp, true);//thisObj.formDataTemp[0].FormGroups[0].FormOutSetDetails[0]);
                $.extend(tmpOutsetData, detailtemp);
                thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.add(tmpOutsetData);
                //get empty temp 빈템플릿 가져오기
                var columCloneData;
                var tempcolumn;
                columCloneData = Object.clone(thisObj.viewBag.InitDatas.Template.DefaultTemp, true);
                tempcolumn = {
                    index: parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.length) + 1,
                    dataType: formColumn.COL_TYPE,
                    id: formColumn.COL_CD,
                    name: formColumn.COL_CD,
                    title: formOutColumn.TITLE,
                    width: HEAD_SIZE,
                    align: HEAD_POS,
                    fontSize: HEAD_FONT,
                    fontBold: false,
                    isCheckZero: true,
                    controlType: formColumn.CONTROL_TYPE,
                    controlOption: "",
                    groupColCd: formColumn.GROUP_COL_CD,
                };
                $.extend(columCloneData, tempcolumn);
                thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.add(columCloneData);
                //check 체크 처리
                thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "Y";

                //[A17_02333 bsy]                 
                if (!$.isEmpty(formColumn.CODE_COL_CD)) {
                    thisObj.addCodeCoupleColumn({ formIndex: data.formIndex, CODE_COL_CD: formColumn.CODE_COL_CD, COL_CD: colOfGroup.COL_CD });
                }
            });
        } else {
            colGroup.forEach(function (colOfGroup) {
                //[A17_02333 bsy] 삭제
                thisObj.removeColumnInfoForDefault({ formIndex: data.formIndex, COL_CD: colOfGroup.COL_CD }, true);
            });
        }
    },

    //[A17_02333 bsy] 코드형 couple colcd
    getCodeCoupleColCd: function (data) {
        var result = "";
        var codeColCd = this.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.COL_CD }).CODE_COL_CD;
        if (!$.isEmpty(codeColCd)) {
            var hidColumn = this.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.CODE_COL_CD == codeColCd && item.COL_CD != data.COL_CD });
            result = hidColumn.COL_CD;
        }
        return result;
    },

    //[A17_02333 bsy] 삭제로직 function로 생성함 
    removeColumnInfoForDefault: function (data, isHideColumnRemove) {
        var formColumn = this.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.COL_CD });
        var coupleColumn, coupleView;
        var isRemove = true;

        // 커플컬럼을 가져온다. 
        if (isHideColumnRemove && !$.isEmpty(formColumn.CODE_COL_CD)) {
            coupleColumn = this.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.CODE_COL_CD == formColumn.CODE_COL_CD && item.COL_CD != data.COL_CD });
            coupleView = this.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == coupleColumn.COL_CD });
            if (coupleView) {
                if (coupleView.isHideColumn == false) {     // 커플컬럼이 리스트에 있으면 
                    isRemove = false;
                }
            }
        }
        // [A17_02333 bsy] coupleView가 존재하면 delete가 아니고 remove처리를 해준다. 
        if (isRemove) {
            //remove detail  디테일 삭제
            this.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.remove(function (item) { return item.COL_CD == data.COL_CD });
            //remove item 항목 삭제
            this.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.remove(function (item) { return item.id == data.COL_CD });
        } else {
            // hide 컬럼으로 처리 
            var detailCol = this.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.find(function (item) { return item.COL_CD == data.COL_CD });
            detailCol.HEAD_SIZE = 0;
            //update item width 0 
            var destCol = this.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == data.COL_CD });
            destCol.width = 0;
            //update item isHideColumn true
            destCol.isHideColumn = true;
        }
        //uncheck 언체크 처리
        this.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == data.COL_CD }).CHECKED_YN = "N";

        // 코드형Couple 컬럼도 같이 삭제 할지 여부에 따른 처리        
        if (isHideColumnRemove && !$.isEmpty(formColumn.CODE_COL_CD)) {
            // 커플 컬럼 숨김이면일때 삭제 
            if (coupleView && coupleView.isHideColumn == true) {
                //remove detail  디테일 삭제
                this.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.remove(function (item) { return item.COL_CD == coupleColumn.COL_CD });
                //remove item 항목 삭제
                this.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.remove(function (item) { return item.id == coupleColumn.COL_CD });
                //uncheck 언체크 처리
                this.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == coupleColumn.COL_CD }).CHECKED_YN = "N";
            }
        }
    },

    // [A17_02333 bsy] 코드형couple hide로 추가해주기 
    addCodeCoupleColumn: function (data) {
        var thisObj = this;
        if ($.isEmpty(data.CODE_COL_CD)) {
            // couple code get 
            data.CODE_COL_CD = this.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.COL_CD }).CODE_COL_CD;
        }
        var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD != data.COL_CD && item.CODE_COL_CD == data.CODE_COL_CD });        // 소스합칠때 주의 bsy

        // 이미 존재하면 추가하지 않는다. 
        if (thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == formColumn.COL_CD })) {
            return;
        }

        var index = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.length) + 1;

        var formOutColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD });
        var CUST_PASS_SORT_FLAG = false;
        var COL_TYPE_PREFIX = "0";
        var HEAD_POS = "left";
        if (formColumn.COL_TYPE != null && formColumn.COL_TYPE.length > 0) { COL_TYPE_PREFIX = formColumn.COL_TYPE.substring(0, 1); }
        if (thisObj.FORM_TYPE == "SP900" && formColumn.COL_CD == "CUST_PASS_PROD_CD.SORT") { CUST_PASS_SORT_FLAG = true; }
        //number type 8 or 9 is right   숫자타입(8또는9)일경우 right 또는 CS품목검색창의 정렬순서 인 경우
        if (COL_TYPE_PREFIX == "8" || COL_TYPE_PREFIX == "9" || CUST_PASS_SORT_FLAG) { HEAD_POS = "right"; }
        else if (COL_TYPE_PREFIX == "1" || COL_TYPE_PREFIX == "2") { HEAD_POS = "center"; }

        //12로 고정됨.
        HEAD_FONT = "0";
        var DISPLAY_PERIOD_TYPE = "";
        var DISPLAY_COL_TYPE = "";
        var LABEL_IMAGE_YN = formColumn.LABEL_IMAGE_YN;
        //column type  칼럼타입 설정(2번째자리)
        var COL_TYPE_PREFIX2 = "0";
        if (formColumn.COL_TYPE != null && formColumn.COL_TYPE.length > 1) { COL_TYPE_PREFIX2 = formColumn.COL_TYPE.substring(1, 2); }

        //사용자컬럼인지 설정
        var USER_COL = "0";
        if (formColumn.COL_CD.length > 2 && (formColumn.COL_CD.substring(0, 3).toUpperCase() == "ADD" || LABEL_IMAGE_YN == "Y" || LABEL_IMAGE_YN == "N")) { USER_COL = "1"; }
        var font = "";
        var tot_Yn = "N";
        if (!["R", "P", "L", "G"].contains(thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet.VIEW_TYPE)) {
            //개발결정사항:1581 - 예외처리하기로
            if (!["AO296"].contains(thisObj.FORM_TYPE) && !$.isEmpty(formColumn.COL_TYPE) && formColumn.COL_TYPE.length > 0
                && ["8", "9"].contains(formColumn.COL_TYPE.substring(0, 1))) {
                tot_Yn = "Y";
            }
        }

        //항목정보 설정
        var detailtemp = {
            Key: { FORM_TYPE: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE, NUM_SORT: thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.length + 1 },//?
            HEAD_SIZE: 0,//HEAD_SIZE,
            HEAD_POS: HEAD_POS,//
            HEAD_FONT: HEAD_FONT,//
            COL_TYPE: formColumn.COL_TYPE,//
            HEAD_TITLE_NM: formOutColumn.TITLE,
            COL_CD: formColumn.COL_CD,//
            FONT: font,
            //구로직에 치환 로직이 있어서 동일하게 처리
            //컬럼에는 별칭이 존재하지 않는 데 예외 케이스 존재할 수 있어서 동일하게 치환함.
            SELECT_COL_CD: ($.isEmpty(formColumn.CONVERT_COL_NM) ? "" : formColumn.CONVERT_COL_NM.trim().replace(/\s[aA][0-9]{1,2}$/, "")),//
            USERCOL_CD: "",
            BALANCE_TYPE: "",
            ZERO_CHK_YN: $.isEmpty(formColumn.DECIMAL_TYPE) == false && (formColumn.COL_TYPE.substring(0, 1) == '8' || formColumn.COL_TYPE.substring(0, 1) == '9') ? "B" : "Y",
            ZERO_DISPLAY_YN: $.isEmpty(formColumn.DECIMAL_TYPE) ? "Y" : "B",
            COL_DISPLAY_STATE: formColumn.COL_DISPLAY_STATE,
            COL_ESSENTIAL_YN: "N",
            INPUT_TITLE_NM: "",
            BASIC_YN: formColumn.DEFAULT_YN || "N",
            TOT_YN: tot_Yn,
            DISPLAY_PERIOD_TYPE: DISPLAY_PERIOD_TYPE,//
            DISPLAY_COL_TYPE: DISPLAY_COL_TYPE,//
            LABEL_IMAGE_YN: null,
            DEFAULT_SET_SHOW_TYPE: $.isNull(formColumn.DEFAULT_SET_SHOW_TYPE) ? "" : formColumn.DEFAULT_SET_SHOW_TYPE.substring(0, 1),//
            IS_REQUISITE2: formColumn.REQUISITE2_DEFAULT_VALUE,
            IS_EDITABLE: formColumn.EDITABLE_DEFAULT_VALUE
        };
        //get empty temp 빈템플릿 가져오기
        var tmpOutsetData = Object.clone(thisObj.viewBag.InitDatas.Template.FormOutSetDetailTemp, true);//thisObj.formDataTemp[0].FormGroups[0].FormOutSetDetails[0]);
        $.extend(tmpOutsetData, detailtemp);
        thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.add(tmpOutsetData);
        //get empty temp 빈템플릿 가져오기
        var columCloneData;
        var tempcolumn;
        columCloneData = Object.clone(thisObj.viewBag.InitDatas.Template.DefaultTemp, true);
        tempcolumn = {
            index: parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.length) + 1,
            dataType: formColumn.COL_TYPE,
            id: formColumn.COL_CD,
            name: formColumn.COL_CD,
            title: formOutColumn.TITLE,
            width: 0,
            align: HEAD_POS,
            fontSize: HEAD_FONT,
            fontBold: false,
            isCheckZero: true,
            controlType: formColumn.CONTROL_TYPE,
            controlOption: "",
            groupColCd: formColumn.GROUP_COL_CD,
            isHideColumn: true
        };
        $.extend(columCloneData, tempcolumn);
        thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.add(columCloneData);
        //check 안한것으로 체크 처리
        thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "N";       // 소스합칠때 주의
    },

    // [A17_02333 bsy] 코드형couple hide로 Grid에 추가해주기 
    addCodeCoupleGridColumn: function (data) {
        var thisObj = this;
        var grid = thisObj.contents.getGrid(thisObj.gridId, false).grid;
        data.CODE_COL_CD = this.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.COL_CD }).CODE_COL_CD;
        if ($.isEmpty(data.CODE_COL_CD)) return;
        var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD != data.COL_CD && item.CODE_COL_CD == data.CODE_COL_CD });

        // 이미 존재하면 추가하지 않는다. 
        if (grid.getColumnInfoList().where(function (n) { return n.id == formColumn.COL_CD }).count() == 1) {
            return;
        }
        var lastColId = grid.getColumnInfoList()[grid.getColumnInfoList().length - 1].id;
        thisObj.contents.getGrid(thisObj.gridId, false).grid.addColumn({
            //title: colOfGroup.TITLE,
            title: thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == formColumn.COL_CD }).title,
            id: formColumn.COL_CD,
            propertyName: formColumn.COL_CD,
            width: 0,
            isHideColumn: true
        }, {
                columnId: lastColId, direction: "right",
                customizeColumn: function (value, rowItem) {
                    return thisObj.setCustomSettingRow(value, rowItem, formColumn);
                }
            });
    },

    // [A17_02333 bsy] 코드형 커플 컬럼 이동하기 - 현재 사용안함. 
    moveCoupleColumn: function (data) {
        var srcColumnInfo = {}, destColumnInfo = {};
        var grid = this.contents.getGrid(this.gridId, false).grid;
        srcColumnInfo = {
            'columnId': data.srcColId
            , 'rowKey': '0'
        };
        destColumnInfo = {
            'columnId': data.destColId
            , 'rowKey': '0'
        };
        grid.moveColumn(srcColumnInfo, destColumnInfo);
    },

    //[A17_02333 bsy] 코드형 couple hide 맨뒤로 이동하기
    moveHideColumn: function () {
        var grid = this.contents.getGrid(this.gridId, false).grid;
        //값 가져오기
        var columnList = grid.getColumnInfoList();

        //hide column 추출
        //var inputList = [];
        for (var i = 0, l = columnList.length; i < l; i++) {
            if (columnList[i]["isHideColumn"] === true) {
                //inputList.push(columnList.splice(i, 1)[0]);
                grid.moveColumn({ 'columnId': columnList[i]['id'], 'rowKey': '0' });
            }
        }
    },


    setSettingGrid: function (settings1, settings2, tabIndex) {

        var thisObj = this;
        var titleMenu = new Array(
            { 'titleSetup': ecount.resource.LBL12303 }
        );
        var totalMenu = new Array(
            { 'totalSetup': ecount.resource.LBL12304 }
        );
        if (thisObj.formInfo.FormSet.SUM_SET_USE_YN == "Y") {
            settings1.setTotalSetupDragable(true, totalMenu, null)
                .setTotalSetupCallback({
                    'click': function (columnId, childElementId) {
                        var param = {
                            width: 350,
                            height: 520,
                            modal: true,
                            FORM_TYPE: thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.Key.FORM_TYPE,
                            FORM_SEQ: thisObj.FORM_SEQ,
                            isLock: thisObj.isLock,
                            settingType: "bottomSubtot",
                            isRestoreDisplayFlag: true,
                            formIndex: thisObj.formTabIndex
                        };
                        // Open popup
                        thisObj.openWindow({
                            url: '/ECERP/Popup.Form/CM100P_58_CM3',
                            name: ecount.resource.LBL10119,
                            param: param,
                            popupType: false,
                            additional: false,
                        });
                    }
                });
        }
        if (thisObj.formInfo.FormSet.TITLE_SET_USE_YN == "Y") {
            settings1.setTitleSetupDragable(true, titleMenu, null)
                .setTitleSetupCallback({
                    'click': function (columnId, childElementId) {
                        var param = {
                            width: 350,
                            height: 490,
                            modal: true,
                            FORM_TYPE: thisObj.formDataTemp[thisObj.formTabIndex].FormGroups[0].FormSet.Key.FORM_TYPE,
                            FORM_SEQ: thisObj.FORM_SEQ,
                            isLock: thisObj.isLock,
                            settingType: "headerTitle",
                            isRestoreDisplayFlag: true,
                            formIndex: thisObj.formTabIndex
                        };
                        // Open popup
                        thisObj.openWindow({
                            url: '/ECERP/Popup.Form/CM100P_58_CM3',
                            name: ecount.resource.LBL10119,
                            param: param,
                            popupType: false,
                            additional: false,
                        });
                    }
                });
        }

        var formData = thisObj.formDataTemp[tabIndex].FormGroups[0];
        if (thisObj.isScheduleFormType) {
            //Modify DAILY/ WEEKLY / 2 DAYS-2일 / 4 DAYS-4일
            this.EditTitleTemplateSetup(tabIndex, false, settings1);

            // rezize group columns 
            var dateList = formData.ViewModel.columns.where(function (item) { return ['u_date', 'c_date', 'd_date'].contains(item.id.split(ecount.delimiter)[0]) })
            var columnListTmp = Object.clone(formData.ViewModel.columns, true);
            var groupColumns = {};
            for (var i = 0; i < dateList.length; i++) {
                var groupId = dateList[i].id;
                groupColumns[groupId] = dateList.where(function (item) { return groupId != item.id }).select(function (obj) { return obj['id']; });
            }

            settings1.setCellResizeGroupIdColumns(groupColumns);

            // set row heght
            settings1.setGridTypeRowTrHeight(thisObj.formInfo.FormOutSet.BODY_HEIGHT);
            thisObj.formDataTemp[tabIndex].FormGroups[0].ViewModel.columns.forEach(function (item) {

                var idx = item.id.indexOf(ecount.delimiter);
                if (idx >= 0) {
                    var prefixColcd = item.id.substring(0, idx).toLowerCase();
                    if (['c_date', 'd_date', 'u_date'].contains(prefixColcd)) {
                        settings1.setCustomRowCell(item.id, function (value, rowItem) {
                            return thisObj.setCustomSettingRow(value, rowItem, item);
                        }.bind(this));

                    }
                }
            });
        }


        settings1.setDragable(true, 'all')
            .setFormVersion(ecount.grid.constValue.formVersion.second)
            .setFormData(formData.ViewModel)
            .setRowData([])
            .setCellResize(true, (formData.FormSet.HEAD_HEIGHT_YN == "Y" && formData.FormSet.ROW_HEIGHT_YN == "Y") ? 'all' : 'width', 'totalWidth')    // ygh #9
            .setColumnPropertyColumnName('id')
            .setColumnPropertyNormalize(true)
            .setDragHeaderCalculation(false, { calculate: 'minus' })
            .setCheckBoxUse(formData.FormSet.CHECKBOX_YN == "Y" ? true : false)
            .setEditable(true, 3, 2)
            .setTotalFontSize(formData.FormOutSet.SUBTOT_FONT_SIZE || 0)
            .setTotalFontBold(formData.FormOutSet.SUBTOT_IS_FONT_BOLD || false)
            .setTotalFontItalic(formData.FormOutSet.SUBTOT_IS_FONT_ITALIC || false)
            .setTotalFontUnderline(formData.FormOutSet.SUBTOT_IS_FONT_UNDERLINE || false)
            .setTotalFontStrike(formData.FormOutSet.SUBTOT_IS_FONT_STRIKE || false)
            .setTotalHorizontalAlign((formData.FormOutSet.SUBTOT_ALIGN_TYPE == "1") ? "left" : ((formData.FormOutSet.SUBTOT_ALIGN_TYPE == "2") ? "right" : "center"))
            .setTotalVerticalAlign((formData.FormOutSet.SUBTOT_VALIGN_TYPE == "T") ? "top" : ((formData.FormOutSet.SUBTOT_VALIGN_TYPE == "B") ? "bottom" : "middle"));

        if (["O", "F", "G", "E"].contains(formData.FormSet.VIEW_TYPE))
            settings1.setEditSpecialRowCount(1);

        //make setting delete link button  설정/삭제 처리
        //knh #3 - 우측 그리드 컬럼 id 로 사용하는것으로 setCustomRowCell 바인딩
        formData.FormColumns.forEach(function (item) {
            //var thisObj = this;
            settings1.setCustomRowCell(item.COL_CD, function (value, rowItem, convertor, convertorOption, data) {
                var label = "";
                if (rowItem[ecount.grid.constValue.rowCountColumnPropertyName] == 1) {
                    if ($.isEmpty(item.REX_CD)) {
                        label = String.format("{0}", item.SUB_REX_DES);
                    } else {
                        label = String.format("{0}({1})", item.SUB_REX_DES, $.isEmpty(ecount.resource[item.REX_CD]) ? item.REX_CD : ecount.resource[item.REX_CD]);
                    }
                }

                thisObj.setGridCssAndStyle(item.COL_CD, data, formData);

                return thisObj.setCustomSettingRow(value, rowItem, item, label);
            }.bind(this));
        });

        var totalWidthVal = formData.FormOutSetDetails.sum(function (item) { return item.HEAD_SIZE || 0; }) + (formData.FormSet.CHECKBOX_YN == "Y" ? 25 : 0);
        if (thisObj.isScheduleFormType) {
            // set row editable
            if ((['C', 'D', 'U'].contains(this.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE))) {

                settings1.setDragable(false, 'all')
                    .setFormVersion(null)
                    .setCellResize(true, 'all', 'totalWidth');
                if (this.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE == 'C') {
                    if (this.formInfo.FormOutSet.DISP_UNIT == 10) {
                        settings1.setEditable(true, 4, 4);
                    }
                    else {
                        var numWeek = this.formInfo.FormOutSet.DISP_UNIT - 10;
                        settings1.setEditable(true, numWeek, numWeek);
                    }
                }
                else
                    settings1.setEditable(true, 3, 6);
            }

            totalWidthVal = formData.ViewModel.columns.sum(function (item) { return item.width || 0; }) + (formData.FormSet.CHECKBOX_YN == "Y" ? 25 : 0);
        }
        formData.FormOutSet.TABLE_WIDTH = totalWidthVal;
        //knh #12
        settings2
            .setColumns([{
                'id': 'totalWidth',
                'propertyName': 'totalWidth',
                'width': totalWidthVal,
                'title': 'totalWidth',
                'align': 'center'
            }])
            .setColumnVisible(false)
            .setStyleBorderRemoveLeftRight(true)
            .setRowData([{ 'totalWidth': String.format(ecount.resource.LBL07709 + " {0}px", totalWidthVal) }]);

        if (this.FORM_TYPE == "AO080") {
            settings1.setDragable(false)
                .setFormVersion(null);
        }
    },

    setGridCssAndStyle: function (id, data, formData) {
        if (!data.isGenerateViewData) 
            return;

        var _column = formData.FormOutSetDetails.find(function (detail) {
            return detail.COL_CD == id;
        });

        if (!_column) 
            return;

        var cellCss = data.cellStyler.getCss(),
            cellStyle = data.cellStyler.getStyle(),
            newCss = [],
            newStyle = {}

        //css, style 우선 제거
        data.cellStyler.removeCss(cellCss);
        data.cellStyler.removeStyle("color");

        newCss.push("font-" + ecount.convertor.convertFontClassName(_column.FONT));
        newCss.push("font-" + _column.HEAD_FONT + "px");
        newCss.push("text-" + _column.HEAD_POS);

        switch(_column.VALIGN_TYPE) {
            case "T":
                newCss.push("valign-top");
                break;
            case "M":
                newCss.push("valign-middle");
                break;
            case "B":
                newCss.push("valign-bottom");
                break;
        }
        
        if (_column.BOLD_YN == "Y") {
            newCss.push("text-bold");
        }

        if (_column.IS_FONT_ITALIC) {
            newCss.push("text-italic");
        }

        if (_column.IS_FONT_STRIKE) {
            newCss.push("text-line-through");
        }

        if (_column.IS_FONT_UNDERLINE) {
            newCss.push("text-uline");
        }

        newStyle = _.extend(cellStyle, { color: "#" + _column.FONT_COLOR });

        data.cellStyler.addCss(newCss);
        data.cellStyler.addStyle(newStyle);
    },

    //bind grid  그리드 바인딩
    setHybridGrid: function (message) {
        var thisObj = this;
        if ((!thisObj.isFromSc || thisObj.formBasic != 1) && (thisObj.formInfo.FormSet.HTML_BODY_YN == "N")) {
            for (var formTabIdx = 0; formTabIdx < thisObj.formDataTemp.length; formTabIdx++) {
                if (message != null && message.formIndex != null && formTabIdx == message.formIndex) {
                    thisObj.formDataTemp[formTabIdx].FormGroups[0] = message.data;
                }

                var gridId = "dataGrid_" + formTabIdx.toString();
                var gridSumId = "dataGridSum_" + formTabIdx.toString();
                if (this.isScheduleFormType) {
                    //Modify DAILY/ WEEKLY / 2 DAYS-2일 / 4 DAYS-4일
                    this.EditTitleTemplateSetup(formTabIdx, true);
                }


                //list 리스트
                var formData = thisObj.formDataTemp[formTabIdx].FormGroups[0];
                var settings = thisObj.contents.getGrid(gridId, false).settings
                    .setGridTypeHeaderTrHeight(formData.FormOutSet.HEAD_HEIGHT)
                    .setGridTypeRowTrHeight(formData.FormOutSet.BODY_HEIGHT)
                    .setStyleBorderRemoveVertical((formData.FormOutSet.VERTICAL_VIEW_YN == "Y") ? true : false)
                    .setStyleBorderRemoveHorizontal((formData.FormOutSet.HORIZONTAL_VIEW_YN == "Y") ? true : false)
                    .setStyleBorderRemoveAll((formData.FormOutSet.ALL_VIEW_YN == "Y") ? true : false)

                    .setTitleFontSize(formData.FormOutSet.HEAD_FONT_SIZE || 0)
                    .setTitleHorizontalAlign((formData.FormOutSet.HEAD_HALIGN_TYPE == "L") ? "left" : ((formData.FormOutSet.HEAD_HALIGN_TYPE == "R") ? "right" : "center"))
                    .setTitleVerticalAlign((formData.FormOutSet.HEAD_VALIGN_TYPE == "T") ? "top" : ((formData.FormOutSet.HEAD_VALIGN_TYPE == "B") ? "bottom" : "middle"))
                    .setTitleFontBold(formData.FormOutSet.HEAD_IS_FONT_BOLD || false)
                    .setTitleFontItalic(formData.FormOutSet.HEAD_IS_FONT_ITALIC || false)
                    .setTitleFontStrike(formData.FormOutSet.HEAD_IS_FONT_STRIKE || false)
                    .setTitleFontUnderline(formData.FormOutSet.HEAD_IS_FONT_UNDERLINE || false)
                    .setTotalFontSize(formData.FormOutSet.SUBTOT_FONT_SIZE || 0)
                    .setTotalFontBold(formData.FormOutSet.SUBTOT_IS_FONT_BOLD || false)
                    .setTotalFontItalic(formData.FormOutSet.SUBTOT_IS_FONT_ITALIC || false)
                    .setTotalFontUnderline(formData.FormOutSet.SUBTOT_IS_FONT_UNDERLINE || false)
                    .setTotalFontStrike(formData.FormOutSet.SUBTOT_IS_FONT_STRIKE || false)
                    .setTotalHorizontalAlign((formData.FormOutSet.SUBTOT_ALIGN_TYPE == "1") ? "left" : ((formData.FormOutSet.SUBTOT_ALIGN_TYPE == "2") ? "right" : "center"))
                    .setTotalVerticalAlign((formData.FormOutSet.SUBTOT_VALIGN_TYPE == "T") ? "top" : ((formData.FormOutSet.SUBTOT_VALIGN_TYPE == "B") ? "bottom" : "middle"))
                    .setFormData(formData.ViewModel);
                //make setting delete link button  설정/삭제 처리
                //knh #3 - 우측 그리드 컬럼 id 로 사용하는것으로 setCustomRowCell 바인딩
                formData.FormColumns.forEach(function (item) {
                    //var thisObj = this;
                    settings.setCustomRowCell(item.COL_CD, function (value, rowItem, convertor, convertorOption, data) {
                        var label = "";
                        if (rowItem[ecount.grid.constValue.rowCountColumnPropertyName] == 1) {
                            if ($.isEmpty(item.REX_CD)) {
                                label = String.format("{0}", item.SUB_REX_DES);
                            } else {
                                label = String.format("{0}({1})", item.SUB_REX_DES, $.isEmpty(ecount.resource[item.REX_CD]) ? item.REX_CD : ecount.resource[item.REX_CD]);
                            }
                        }

                        thisObj.setGridCssAndStyle(item.COL_CD, data, formData);

                        return thisObj.setCustomSettingRow(value, rowItem, item, label);
                    }.bind(this));
                });

                if (thisObj.isScheduleFormType) {
                    //Modify DAILY/ WEEKLY / 2 DAYS-2일 / 4 DAYS-4일
                    this.EditTitleTemplateSetup(formTabIdx, true, settings);
                    var dateList = formData.ViewModel.columns.where(function (item) { return ['u_date', 'c_date', 'd_date'].contains(item.id.split(ecount.delimiter)[0]) })
                    var columnListTmp = Object.clone(formData.ViewModel.columns, true);
                    var groupColumns = {};
                    for (var i = 0; i < dateList.length; i++) {
                        var groupId = dateList[i].id;
                        groupColumns[groupId] = dateList.where(function (item) { return groupId != item.id }).select(function (obj) { return obj['id']; });
                    }
                    settings.setCellResizeGroupIdColumns(groupColumns);

                    thisObj.formDataTemp[formTabIdx].FormGroups[0].ViewModel.columns.forEach(function (item) {
                        var idx = item.id.indexOf(ecount.delimiter);
                        if (idx >= 0) {
                            var prefixColcd = item.id.substring(0, idx).toLowerCase();
                            if (['c_date', 'd_date', 'u_date'].contains(prefixColcd)) {
                                settings.setCustomRowCell(item.id, function (value, rowItem) {
                                    return thisObj.setCustomSettingRow(value, rowItem, item);
                                }.bind(this));
                            }
                        }
                    });


                    if (this.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE == 'C') {

                        if (this.formInfo.FormOutSet.DISP_UNIT == 10) {
                            settings.setEditable(true, 4, 4);
                        }
                        else {
                            var numWeek = this.formInfo.FormOutSet.DISP_UNIT - 10;
                            settings.setEditable(true, numWeek, numWeek);
                        }

                    }
                }


                this.contents.getGrid(gridId, false).draw();
                var totalWidthVal = formData.FormOutSetDetails.sum(function (item) { return item.HEAD_SIZE || 0; }) + (formData.FormSet.CHECKBOX_YN == "Y" ? 25 : 0);
                if (thisObj.isScheduleFormType) {
                    totalWidthVal = formData.ViewModel.columns.sum(function (item) { return item.width || 0; }) + (formData.FormSet.CHECKBOX_YN == "Y" ? 25 : 0);
                }
                formData.FormOutSet.TABLE_WIDTH = totalWidthVal;
                //knh #12
                var settings2 = this.contents.getGrid(gridSumId, false).settings
                    .setColumns([{
                        'id': 'totalWidth',
                        'propertyName': 'totalWidth',
                        'width': totalWidthVal,
                        'title': 'totalWidth',
                        'align': 'center'
                    }])
                    .setRowData([{ 'totalWidth': String.format(ecount.resource.LBL07709 + " {0}px", totalWidthVal) }]);
                //knh #12
                this.contents.getGrid(gridSumId, false).draw();
            }
        }
    },


    setCustomSettingRow: function (value, rowItem, item, data) {
        var thisObj = this;
        var option = {};
        option.controlType = 'widget.form.dropdownmenu';
        option.data = data || "";
        if ((/special\-row\-\d+/.test(rowItem[ecount.grid.constValue.keyColumnPropertyName]))) {
        }
        else {
            if (['Y'].contains(item.DEFAULT_YN)) {
                option.dropdownmenuData = [
                    { 'add': ecount.resource.LBL02792 },
                    { 'modify': ecount.resource.LBL01593 },
                    { 'multiModify': ecount.resource.LBL10736 }
                ];
            } else {
                option.dropdownmenuData = [
                    { 'add': ecount.resource.LBL02792 },
                    { 'modify': ecount.resource.LBL01593 },
                    { 'multiModify': ecount.resource.LBL10736 },
                    { 'hide': ecount.resource.LBL10607 }
                ];
            }
        }

        if (['C', 'D', 'U'].contains(this.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE)) {
            if (['U', 'D'].contains(this.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE)) {
                option.dropdownmenuData = [
                    { 'modify': ecount.resource.LBL01593 },
                    { 'multiModify': ecount.resource.LBL10736 }
                ];
            }
            else
                option.dropdownmenuData = [
                    { 'modify': ecount.resource.LBL01593 }
                ];
        }
        option.event = {
            'click': function (e, data) {
                console.log(data);
                if (data.childElementId == 'add') {
                    thisObj.setAddItemPopup({ formIndex: thisObj.formTabIndex, rowItem: { COL_CD: data.columnId } });
                }
                else if (data.childElementId == 'modify') {
                    thisObj.setSettingPopup({ formIndex: thisObj.formTabIndex, rowItem: { COL_CD: data.columnId } });

                }
                else if (data.childElementId == 'multiModify') {
                    thisObj.setSettingPopup({ formIndex: thisObj.formTabIndex, rowItem: { COL_CD: "" } });

                }
                else if (data.childElementId == 'hide') {
                    // TODO: Add more logic for fixed issue in dev progress post no.604
                    if (['AO010', 'AO011', 'AO012'].contains(thisObj.FORM_TYPE) && ['#tmp.bal_amt_f'].contains(data.columnId)) {
                        ecount.confirm(ecount.resource.MSG07662, function (isStatus) {
                            if (isStatus === false) return;
                            thisObj.setDeleteItem({ formIndex: thisObj.formTabIndex, rowItem: { COL_CD: data.columnId } });
                        });
                    } else {
                        thisObj.setDeleteItem({ formIndex: thisObj.formTabIndex, rowItem: { COL_CD: data.columnId } });
                    }
                }
                e.preventDefault();
            }
        };
        return option;
    },


    //sync sort 정렬동기화
    setSortSync: function (data) {
        console.log("setSortSync");
        //sync grid 그리드 순서 동기화
        var formDataTempCurrent = this.formDataTemp[this.formTabIndex].FormGroups[0];
        var cnt1 = 1;
        var cnt2 = this.contents.getGrid(this.gridId, false).grid.getColumnInfoList().length;
        this.contents.getGrid(this.gridId, false).grid.getColumnInfoList().forEach(function (sortedItem, j) {
            if (sortedItem.width > 0) {
                formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = cnt1;
                formDataTempCurrent.ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).index = cnt1;
                cnt1 += 1;
            } else {
                formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = cnt2;
                formDataTempCurrent.ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).index = cnt2;
                cnt2 += -1;
            }

        });
    },

    //sync total  그리드 전체 합계 리사이즈 동기화
    setUITotalSync: function () {
        console.log("setUITotalSync");

        var resizedTotalWidth = this.contents.getGrid(this.gridId, false).grid.getResizeResult().resizedTotalWidth;
        this.formDataTemp[this.formTabIndex].FormGroups[0].FormOutSet.TABLE_WIDTH = resizedTotalWidth;

        var dataGrid3 = this.contents.getGrid(this.gridSumId, false).grid;
        dataGrid3.setCell("totalWidth", dataGrid3.getRowKeyByIndex(0), String.format(ecount.resource.LBL07709 + " {0}px", resizedTotalWidth));
        dataGrid3.setColumnInfo("totalWidth", { 'width': resizedTotalWidth });
        dataGrid3.refreshCell('totalWidth', 'totalWidth');
    },

    //get form template from db 양식 디비값 가져오기
    setFormInfosFromDb: function () {
        var thisObj = this;
        //for ui UI용 데이터
        this.formDataTemp = new Array();
        //for save 저장용 데이터

        Object.clone(this.viewBag.InitDatas.Template, true).FormInfos.forEach(function (formTemp, i) {
            thisObj.formDataTemp.push(formTemp);
            thisObj.setColumnExceptWidthZero(i);
        });
        thisObj.formInfo = this.formDataTemp[0].FormGroups[0];
        //ORD - 0:customized form 사용자양식, 1: basic form 기본양식

        if (!$.isNull(thisObj.formInfo.FormAllowList) && thisObj.formInfo.FormAllowList.length > 0) {
            var allowItem = thisObj.formInfo.FormAllowList.find(function (item) { return item.FORM_SEQ == thisObj.FORM_SEQ });
            if (!$.isNull(allowItem)) {
                thisObj.formBasic = allowItem.ORD;
            }
        } else {
            //등록된 양식이 없으면 구 주석 this.FORM_SEQ = 99인 케이스
            thisObj.formBasic = 1;
            //thisObj.FORM_SEQ = 99;
            thisObj.isNew = true;
        }
        thisObj.lastEditTime = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EDIT_DT;
        thisObj.lastEditId = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EDIT_ID;
    },

    // except width zero 넓이 0 제외 설정
    setColumnExceptWidthZero: function (i) {
        var thisObj = this;
        var reSort = null;
        var z = 0;
        thisObj.formDataTemp[i].FormGroups.forEach(function (formGroup, j) {
            reSort = formGroup.ViewModel.columns.sortBy(function (s) {
                //[A17_02333 bsy]
                return (s.width == 0 && s.IsHideColumn == true) ? s.index = 99 : s.index;
            });
            z = 0;
            reSort = reSort.sortBy(function (s) { return s.index; });
            reSort.forEach(function (sortedItem) {
                if (sortedItem.index == 99) {
                    thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.remove(function (item) { return item.COL_CD == sortedItem.id });
                    thisObj.formDataTemp[i].FormGroups[j].ViewModel.columns.remove(function (item) { return item.id == sortedItem.id });
                } else {
                    z++;
                    thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = z;
                    thisObj.formDataTemp[i].FormGroups[j].ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).index = z;
                }
            })
        });
    },

    //Restore default 기본값 복원
    getRestoreForm: function (message) {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (permit != "W" && thisObj.IsDetailPermit == false) {
            //MSG00141
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
        } else {
            var isPossibleRestore = false;
            if (!thisObj.isAuthForm || thisObj.formInfo.FormSet.FORM_ADD_YN != "Y") {
                isPossibleRestore = true;
            } else if (!$.isNull(thisObj.formInfo.FormAllowList) && thisObj.formInfo.FormAllowList.length > 0 && !$.isNull(thisObj.formInfo.FormAllowList.find(function (item) { return item.ORD == 1 }))) {
                isPossibleRestore = true;
            }

            if (thisObj.isScheduleFormType) {
                isPossibleRestore = true;
            }
            if (!isPossibleRestore) {
                ecount.alert(ecount.resource.MSG04243);
            } else {
                var restoreLists = new Array();
                thisObj.formDataTemp.forEach(function (formData) {
                    if (!$.isNull(thisObj.formInfo.FormSet.TAB_CNT) && thisObj.formInfo.FormSet.TAB_CNT > 1) {
                        restoreLists.push({ FORM_TYPE: formData.FormGroups[0].FormOutSet.Key.FORM_TYPE, FORM_SEQ: thisObj.FORM_SEQ, ExtendedCondition: { IS_FROM_ZA_ONLY: true, BASIC_TYPE: "0" }, IsRestore: true });
                    } else {
                        var obj = { FORM_TYPE: formData.FormGroups[0].FormOutSet.Key.FORM_TYPE, FORM_SEQ: 99, ExtendedCondition: { IS_FROM_ZA_ONLY: true, BASIC_TYPE: "0" } };
                        if (thisObj.isScheduleFormType) {
                            obj.ExtendedCondition.DISP_UNIT = formData.FormGroups[0].FormOutSet.DISP_UNIT;
                        }
                        restoreLists.push(obj);
                    }
                });
                ecount.common.api({
                    url: "/Common/Form/GetListFormTemplate",
                    data: Object.toJSON(restoreLists),
                    success: function (result) {
                        thisObj.setHideProgressbar();
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {
                            var restoreFormData;
                            switch (message.restoreType) {
                                case "top":
                                    restoreFormData = Object.clone(result.Data, true);
                                    break;
                                case "bottom":
                                    restoreFormData = Object.clone(result.Data, true);
                                    break;
                                case "pageSetup":
                                    restoreFormData = Object.clone(result.Data, true);
                                    break;
                                case "body":
                                    //그리드,상세설정,페이지설정,상세품목 까지 복원대상 - 채주영
                                    //인쇄설정 인쇄형태까지 추가 복원대상 용지설정은 제외 - 채주영
                                    //인쇄형태도 복원 안되게 변경(용지설정 팝업으로 옮김) - 채주영 2016-08-22

                                    restoreFormData = Object.clone(result.Data, true);
                                    var formGroupTo = thisObj.formDataTemp[0].FormGroups[0];
                                    var formGroupFrom = restoreFormData[0].FormGroups[0];

                                    formGroupTo.FormOutSet.SORT_CD = formGroupFrom.FormOutSet.SORT_CD;
                                    formGroupTo.FormOutSet.SUBTOT_TYPE = formGroupFrom.FormOutSet.SUBTOT_TYPE;
                                    formGroupTo.FormOutSet.SUBTOT_DISPLAY_TYPE = formGroupFrom.FormOutSet.SUBTOT_DISPLAY_TYPE;
                                    formGroupTo.FormOutSet.SUBTOT_ALIGN_TYPE = formGroupFrom.FormOutSet.SUBTOT_ALIGN_TYPE;
                                    formGroupTo.FormOutSet.BODY_ROW_CNT = formGroupFrom.FormOutSet.BODY_ROW_CNT;
                                    //formGroupTo.FormOutSet.SHEET_YN = formGroupFrom.FormOutSet.SHEET_YN;
                                    //formGroupTo.FormOutSet.IS_PRINT_TWICE = formGroupFrom.FormOutSet.IS_PRINT_TWICE;
                                    formGroupTo.FormOutSet.DETAIL_BODY_YN = formGroupFrom.FormOutSet.DETAIL_BODY_YN;
                                    formGroupTo.FormOutSet.VAT_FLAG = formGroupFrom.FormOutSet.VAT_FLAG;

                                    formGroupTo.FormOutSet.HEAD_HEIGHT = formGroupFrom.FormOutSet.HEAD_HEIGHT;
                                    formGroupTo.FormOutSet.BODY_HEIGHT = formGroupFrom.FormOutSet.BODY_HEIGHT;
                                    formGroupTo.FormOutSet.OTHER_VIEW_YN = formGroupFrom.FormOutSet.OTHER_VIEW_YN;
                                    formGroupTo.FormOutSet.VERTICAL_VIEW_YN = formGroupFrom.FormOutSet.VERTICAL_VIEW_YN;
                                    formGroupTo.FormOutSet.HORIZONTAL_VIEW_YN = formGroupFrom.FormOutSet.HORIZONTAL_VIEW_YN;
                                    formGroupTo.FormOutSet.ALL_VIEW_YN = formGroupFrom.FormOutSet.ALL_VIEW_YN;

                                    formGroupTo.FormOutSet.SUBTOT_IS_FONT_ITALIC = formGroupFrom.FormOutSet.SUBTOT_IS_FONT_ITALIC;
                                    formGroupTo.FormOutSet.SUBTOT_IS_FONT_STRIKE = formGroupFrom.FormOutSet.SUBTOT_IS_FONT_STRIKE;
                                    formGroupTo.FormOutSet.SUBTOT_IS_FONT_UNDERLINE = formGroupFrom.FormOutSet.SUBTOT_IS_FONT_UNDERLINE;
                                    formGroupTo.FormOutSet.SUBTOT_IS_FONT_BOLD = formGroupFrom.FormOutSet.SUBTOT_IS_FONT_BOLD;
                                    formGroupTo.FormOutSet.SUBTOT_FONT_SIZE = formGroupFrom.FormOutSet.SUBTOT_FONT_SIZE;
                                    formGroupTo.FormOutSet.SUBTOT_VALIGN_TYPE = formGroupFrom.FormOutSet.SUBTOT_VALIGN_TYPE;
                                    formGroupTo.FormOutSet.HEAD_IS_FONT_BOLD = formGroupFrom.FormOutSet.HEAD_IS_FONT_BOLD;
                                    formGroupTo.FormOutSet.HEAD_IS_FONT_ITALIC = formGroupFrom.FormOutSet.HEAD_IS_FONT_ITALIC;
                                    formGroupTo.FormOutSet.HEAD_IS_FONT_STRIKE = formGroupFrom.FormOutSet.HEAD_IS_FONT_STRIKE;
                                    formGroupTo.FormOutSet.HEAD_IS_FONT_UNDERLINE = formGroupFrom.FormOutSet.HEAD_IS_FONT_UNDERLINE;
                                    formGroupTo.FormOutSet.HEAD_FONT_SIZE = formGroupFrom.FormOutSet.HEAD_FONT_SIZE;
                                    formGroupTo.FormOutSet.HEAD_HALIGN_TYPE = formGroupFrom.FormOutSet.HEAD_HALIGN_TYPE;
                                    formGroupTo.FormOutSet.HEAD_VALIGN_TYPE = formGroupFrom.FormOutSet.HEAD_VALIGN_TYPE;


                                    formGroupTo.FormOutSetDetails = formGroupFrom.FormOutSetDetails;
                                    formGroupTo.FormColumns = formGroupFrom.FormColumns;
                                    formGroupTo.FormOutColumns = formGroupFrom.FormOutColumns;
                                    formGroupTo.FormOutSetReportTitle = formGroupFrom.FormOutSetReportTitle;

                                    formGroupTo.ViewModel.columns = formGroupFrom.ViewModel.columns;
                                    formGroupTo.ViewModel.option.headHeight = formGroupFrom.ViewModel.option.headHeight;
                                    formGroupTo.ViewModel.option.bodyHeight = formGroupFrom.ViewModel.option.bodyHeight;
                                    formGroupTo.ViewModel.option.verticalViewYn = formGroupFrom.ViewModel.option.verticalViewYn;
                                    formGroupTo.ViewModel.option.horizontalViewYn = formGroupFrom.ViewModel.option.horizontalViewYn;
                                    formGroupTo.ViewModel.option.otherViewYn = formGroupFrom.ViewModel.option.otherViewYn;
                                    formGroupTo.ViewModel.option.allViewYn = formGroupFrom.ViewModel.option.allViewYn;
                                    formGroupTo.ViewModel.option.pageSize = formGroupFrom.ViewModel.option.pageSize;

                                    formGroupTo.ViewModel.option.headFontSize = formGroupFrom.ViewModel.option.headFontSize;
                                    formGroupTo.ViewModel.option.headFontBold = formGroupFrom.ViewModel.option.headFontBold;
                                    formGroupTo.ViewModel.option.headFontItalic = formGroupFrom.ViewModel.option.headFontItalic;
                                    formGroupTo.ViewModel.option.headFontStrike = formGroupFrom.ViewModel.option.headFontStrike;
                                    formGroupTo.ViewModel.option.headFontUnderline = formGroupFrom.ViewModel.option.headFontUnderline;
                                    formGroupTo.ViewModel.option.headVAlign = formGroupFrom.ViewModel.option.headVAlign;
                                    formGroupTo.ViewModel.option.headHAlign = formGroupFrom.ViewModel.option.headHAlign;

                                    formGroupTo.ViewModel.option.totalFontSize = formGroupFrom.ViewModel.option.totalFontSize;
                                    formGroupTo.ViewModel.option.totalFontBold = formGroupFrom.ViewModel.option.totalFontBold;
                                    formGroupTo.ViewModel.option.totalFontItalic = formGroupFrom.ViewModel.option.totalFontItalic;
                                    formGroupTo.ViewModel.option.totalFontStrike = formGroupFrom.ViewModel.option.totalFontStrike;
                                    formGroupTo.ViewModel.option.totalFontUnderline = formGroupFrom.ViewModel.option.totalFontUnderline;

                                    formGroupTo.ViewModel.option.totalVAlign = formGroupFrom.ViewModel.option.totalVAlign;
                                    formGroupTo.ViewModel.option.totalHAlign = formGroupFrom.ViewModel.option.totalHAlign;

                                    for (var i = 0; i < thisObj.formDataTemp.length; i++) {
                                        thisObj.setColumnExceptWidthZero(i);
                                    }
                                    thisObj.setResetWedgets(["settingDetail", "settingPage", "settingDetailBody"]);
                                    thisObj.commonForm.getWidgetHelper().getResetWedgets().get("printForm")();
                                    thisObj.setHybridGrid();
                                    break;
                                case "all":
                                    var titleNm = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.TITLE_NM;
                                    thisObj.formDataTempForReportTitle = Object.clone(thisObj.formDataTemp, true);
                                    //if (thisObj.FORM_TYPE == 'GO121') {
                                    //    result.Data[0].FormGroups[0].FormOutSet.DISP_UNIT = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.DISP_UNIT;
                                    //}
                                    thisObj.formDataTemp = Object.clone(result.Data, true);

                                    for (var i = 0; i < thisObj.formDataTemp.length; i++) {
                                        thisObj.setColumnExceptWidthZero(i);

                                        thisObj.formDataTemp[i].FormGroups[0].FormOutSet.TITLE_NM = titleNm;
                                        thisObj.formDataTemp[i].FormGroups[0].FormOutSet.AUTH_TYPE = "P";
                                        thisObj.formDataTemp[i].FormGroups[0].FormSeq = thisObj.FORM_SEQ;

                                        /****************************************************
                                        * Start Restore form out set report title data
                                        *****************************************************/
                                        var findFormOutSetReportTitleZa = thisObj.formDataTemp[i].FormGroups[0].FormOutSetReportTitle != null && thisObj.formDataTemp[i].FormGroups[0].FormOutSetReportTitle.where(function (item) {
                                            return !$.isEmpty(item.TITLE_NM);
                                        });
                                        var findFormOutSetReportTitleComCode = thisObj.formDataTempForReportTitle[i].FormGroups[0].FormOutSetReportTitle != null && thisObj.formDataTempForReportTitle[i].FormGroups[0].FormOutSetReportTitle.where(function (item) {
                                            return !$.isEmpty(item.TITLE_NM);
                                        });

                                        if (findFormOutSetReportTitleZa && findFormOutSetReportTitleZa.length > 0) {
                                            for (var j = 0; j < thisObj.formDataTemp[i].FormGroups[0].FormOutSetReportTitle.length; j++) {
                                                var _reportTitleNm = find[j].TITLE_NM || "";
                                                thisObj.formDataTemp[i].FormGroups[0].FormOutSetReportTitle[j].TITLE_NM = _reportTitleNm;
                                            }
                                        }
                                        else if (findFormOutSetReportTitleComCode && findFormOutSetReportTitleComCode.length > 0) {
                                            for (var j = 0; j < thisObj.formDataTempForReportTitle[i].FormGroups[0].FormOutSetReportTitle.length; j++) {
                                                thisObj.formDataTemp[i].FormGroups[0].FormOutSetReportTitle = thisObj.formDataTempForReportTitle[i].FormGroups[0].FormOutSetReportTitle;
                                                thisObj.formDataTemp[i].FormGroups[0].FormOutSetReportTitle[j].TITLE_NM = "";
                                            }
                                        }
                                        /****************************************************
                                        * Start Restore form out set report title data
                                        *****************************************************/
                                    }

                                    thisObj.formInfo = thisObj.formDataTemp[0].FormGroups[0];
                                    //유지하기 위해서
                                    thisObj.commonForm.getWidgetHelper().getMappingWedgets().get("basicType")();
                                    //setResetViewer,setResetWedgets 절대 순서 바꾸지 마세요. 
                                    thisObj.setResetViewer();
                                    thisObj.setResetWedgets();
                                    thisObj.setHybridGrid();
                                    thisObj.onChangeControl({ cid: "restore", __self: thisObj.contents.getControl("restore") });
                                    break;
                            }
                            message.callback && message.callback(restoreFormData);
                        }
                    }
                });
            }
        }
    },

    //knh #13
    onDragErrorHandler: function (event) {
        if (event._isErrorMessage) {
            ecount.alert(ecount.resource.MSG04357);
        }
    },

    setParentInfo: function (message) {
        if (!$.isNull(message.type) && message.type == "setParentInfo") {
            this.isSetAuthType = message.isSetAuthType;
            return;
        }
    },

    checkFormulaCircularReference: function (codeList, sqlList, calcI) {
        var checkGroup = [];
        // 순환참조 대상값 체크
        for (var i = 0, lng = sqlList.length; i < lng; i++) {
            for (var j = 0, lngJ = codeList.length; j < lngJ; j++) {
                if (sqlList[i].match(codeList[j]) != null) {
                    checkGroup.push(codeList[i] + "-" + codeList[j]);
                }
            }
        }
        if (this.setFormulaCodeSwitch(checkGroup)) {
            if (this.setFormulaSqlCodeChange(codeList, sqlList, calcI) == 1) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    },
    setFormulaCodeSwitch: function (checkGroup) {
        for (var i = 0, lng = checkGroup.length; i < lng; i++) {
            var tempCode = checkGroup[i].split("-");
            for (var j = 0; j < lng; j++) {
                var tempCode2 = checkGroup[j].split("-");
                if (tempCode[0] == tempCode2[1] && tempCode[1] == tempCode2[0]) {
                    return false;
                }
            }
            var checkData = tempCode[0];
            var changeData = tempCode[1];
            for (var j = 0; j < lng; j++) {
                var tempCode3 = checkGroup[j].split("-");
                if (checkGroup[i] != checkGroup[j]) {
                    if (changeData == tempCode3[0]) {
                        changeData = tempCode3[1];
                    }
                    if (checkData == changeData) {
                        return false;
                    }
                }
            }
        }
        return true;
    },
    setFormulaSqlCodeChange: function (changeCode, changeData, calcI) {
        var checkError = 0;
        var thisObj = this;
        for (var i = 0, lng = changeData.length; i < lng; i++) {
            for (var j = 0, lngC = changeCode.length; j < lngC; j++) {
                if (changeCode[0] != changeCode[j]) {
                    if (changeData[0].indexOf(changeCode[j]) > -1) {
                        if (changeData[0].indexOf("/") > -1) {
                            changeData[0] = changeData[0].replaceAll(changeCode[j], "isnull(nullif(" + changeData[j].replace(/\s[aA][0-9]{1,2}$/, "") + ",0),0)");
                        } else {
                            changeData[0] = changeData[0].replaceAll(changeCode[j], changeData[j].replace(/\s[aA][0-9]{1,2}$/, ""));
                        }
                    }
                }
            }
            var tempCode = changeCode[0];
            var tempData = changeData[0];
            changeCode.shift();
            changeData.shift();
            changeCode.push(tempCode);
            changeData.push(tempData);
        }
        for (var calcJ = 0, calcJLng = thisObj.formDataTemp[calcI].FormGroups[0].FormOutSetDetails.length; calcJ < calcJLng; calcJ++) {
            var item = thisObj.formDataTemp[calcI].FormGroups[0].FormOutSetDetails[calcJ];
            for (var i = 0, lng = changeCode.length; i < lng; i++) {
                if (item.COL_CD == changeCode[i]) {
                    item.SELECT_COL_CD = changeData[i];
                }
                if (changeData[i].match(/ADD\d/i) != null)
                    checkError = 1;
            }
        }
        return checkError;
    },

    openDetailTemplateSetup: function () {
        var param = {
            width: 1020,
            height: 750,
            modal: true,
            FORM_TYPE: this.SUBPROD_FORM_TYPE,
            FORM_SEQ: this.FORM_SEQ,
            isLock: this.isLock,
            isSaveAfterClose: this.isSaveAfterClose,
            MENU_TYPE: this.MENU_TYPE
        }
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: ecount.resource.LBL01482,
            param: param,
            popupType: false,
            additional: false,
        });
    },

    EditTitleTemplateSetup: function (tabIndex, isDefaultWidth, settings) {
        var curr = new Date();

        // var dayNames = [ecount.resource.LBL08023, ecount.resource.LBL04596, ecount.resource.LBL03132, ecount.resource.LBL01680, ecount.resource.LBL01161, ecount.resource.LBL00777, ecount.resource.LBL02890];

        switch (this.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE) {
            case "D":
                // thisObj.formInfo.FormOutSet.SCHEDULE_PERIOD_SEARCH_TYPE == 'D'
                var listColumn = [];
                listColumn.push(this.formDataTemp[0].FormGroups[0].ViewModel.columns[0]);

                var length = this.formInfo.FormOutSet.DISP_UNIT || 1;

                var width = Math.round(676 / length);
                for (var i = 0; i < length; i++) {
                    var col = Object.clone(this.formDataTemp[0].FormGroups[0].ViewModel.columns[1]);

                    col.title = ecount.infra.getECDateFormat('DATE33', false, curr.addDays(i));
                    if (i != 0) {
                        col.id = col.id + ecount.delimiter + i;
                        col.name = col.name + ecount.delimiter + i;
                        col.index = i + 2;

                    }
                    if (isDefaultWidth) {
                        col.width = width;
                    }

                    listColumn.push(col);
                }

                if (isDefaultWidth) {
                    this.formDataTemp[tabIndex].FormGroups[0].FormOutSetDetails[1].HEAD_SIZE = width;
                }
                this.formDataTemp[tabIndex].FormGroups[0].ViewModel.columns = listColumn;
                break;
            case "C":

                var listColumn = [];

                var arrColCd = {
                    "0": 'sunday',
                    "1": 'monday',
                    "2": 'tuesday',
                    "3": 'wednesday',
                    "4": 'thursday',
                    "5": 'friday',
                    "6": 'saturday',
                };

                var arrayConvertColNm = {
                    "0": ecount.resource.LBL02203,
                    "1": ecount.resource.LBL02074,
                    "2": ecount.resource.LBL03135,
                    "3": ecount.resource.LBL01713,
                    "4": ecount.resource.LBL01164,
                    "5": ecount.resource.LBL00782,
                    "6": ecount.resource.LBL02891,
                };
                for (var i = 0; i < 7; i++) {
                    var col = Object.clone(this.formDataTemp[0].FormGroups[0].ViewModel.columns[0]);

                    col.title = arrayConvertColNm[i];
                    col.id = i != 0 ? col.id + ecount.delimiter + i : col.id;
                    col.name = arrColCd[i].toUpperCase();
                    col.index = i != 0 ? i + 2 : col.index;
                    listColumn.push(col);
                }
                this.formDataTemp[tabIndex].FormGroups[0].ViewModel.columns = listColumn;

                break;
            case "U":
                var listColumn = [];
                var inTime = parseInt(this.IN_TIME.substring(0, 2));
                var outTime = parseInt(this.OUT_TIME.substring(0, 2));
                if (outTime < inTime) {
                    outTime = 23;
                }
                var dispUnit = this.formInfo.FormOutSet.DISP_UNIT || 91;
                var numDay = dispUnit == '9' ? 1 : dispUnit - 90;
                //   numDay = 2;
                if (inTime == outTime) {
                    inTime = 9;
                    outTime = 18;
                }
                var offSetTime = (outTime - inTime) + 1;

                listColumn.push(this.formDataTemp[0].FormGroups[0].ViewModel.columns[0]);
                var mergeFirstLineSet = [];
                mergeFirstLineSet.push({ _ROW_TITLE: listColumn[0].title, _MERGE_USEOWN: true, _MERGE_START_INDEX: 0, _ROWSPAN_COUNT: 2 });
                for (var j = 0; j < numDay; j++) {
                    for (var i = inTime; i <= outTime; i++) {
                        var col = Object.clone(this.formDataTemp[0].FormGroups[0].ViewModel.columns[1]);
                        var value = String.format("{0}{1} : 00 ", i <= 9 ? "0" : "", i);
                        col.title = value;
                        col.id = listColumn.length > 1 ? col.id + ecount.delimiter + listColumn.length : col.id;
                        col.name = value + listColumn.length;
                        col.index = listColumn.length + 1;
                        listColumn.push(col);
                    }
                    var startIdx = j == 0 ? 1 : (j * offSetTime) + 1;
                    mergeFirstLineSet.push({ _ROW_TITLE: ecount.infra.getECDateFormat('DATE33', false, curr.addDays(j)), _MERGE_USEOWN: false, _STYLE_USEOWN: false, _MERGE_START_INDEX: startIdx, _COLSPAN_COUNT: offSetTime });

                }
                //mergeFirstLineSet.push({ _ROW_TITLE: ecount.infra.getECDateFormat('DATE33', false, curr.addDays(1)), _MERGE_USEOWN: false, _STYLE_USEOWN: false, _MERGE_START_INDEX: 1, _COLSPAN_COUNT: 11 });
                //mergeFirstLineSet.push({ _ROW_TITLE: ecount.infra.getECDateFormat('DATE33', false, curr.addDays(2)), _MERGE_USEOWN: false, _STYLE_USEOWN: false, _MERGE_START_INDEX: 12, _COLSPAN_COUNT: 11 });
                if (settings) {

                    settings
                        .setColumnRowCustom([0, 0], [{ '_MERGE_SET': mergeFirstLineSet }])
                }


                this.formDataTemp[tabIndex].FormGroups[0].ViewModel.columns = listColumn;
                break;
            default:

        }
    },
    onContentsSettingDefaultViewForOffice: function (event) {

        var previewCol = this.formDataTemp[this.formTabIndex].FormGroups[0].FormOutSet.SCHEDULE_DISPLAY_COLS.split(ecount.delimiter);
        var calc_des = '';
        var calc_gunbun = '';
        if (previewCol.length > 1) {
            calc_des = previewCol[0];
            calc_gunbun = previewCol[1];
        }
        else {
            calc_gunbun = "1ㆍ1ㆍ1ㆍ1";
            calc_des = 'default^calc_des^' + previewCol[0];
        }
        var page = "";
        switch (this.FORM_TYPE) {
            case "GO121":
                page = "EGJ006M";
                break;
            case "GO131":
                page = "EGK001M";
                break;
        }

        var param = {
            width: 780,
            height: 500,
            FORM_TYPE: this.FORM_TYPE,
            //F_TYPE: "",
            SHOW_TYPE: '',
            LOCATION_TOP: false,
            CALC_TYPE: "",//(defaultSetShowType == "C") ? (colCd == "supply_amt" ? "S" : "V") : "",
            CALC_DESC: calc_des,
            CALC_GUBUN: calc_gunbun,
            CALC_PAGE: page,
            IS_CALC_ONLY: true,
            IS_CALC_TYPE: false,
            IsUseExtendedMergeExpression: true,
        };
        this.openWindow({
            url: "/ECERP/Popup.Common/CM100P_05",
            name: ecount.resource.LBL05360,
            param: param,
            popupType: false,
            additional: false
        });
    },
    onContentsSettingDefaultView: function (event) {

        if (this.FORM_TYPE == 'GO131') {
            this.onContentsSettingDefaultViewForOffice(event)
        }
        else {
            var self = this;
            var dispValue = this.formDataTemp[this.formTabIndex].FormGroups[0].FormOutSet.SCHEDULE_DISPLAY_COLS.split(ecount.delimiter);
            var calc_des = '';
            var calc_gunbun = '';
            if (dispValue.length > 1) {
                calc_des = dispValue[0];
                calc_gunbun = dispValue[1];
            }
            else {
                var getValueForFormula = function (array) {
                    var arrCalcDes = [];
                    var arrCalcGunBun = [];
                    for (var i = 0; i < array.length; i++) {
                        if (array[i] != "") {
                            var id = array[i];
                            if (id == 'VCTYPE_DES') {
                                id = 'VCTYPE';
                            }
                            else if (id == 'USER_ID') {
                                id = 'USER_NAME';
                            }

                            var obj = self.viewBag.FormInfos.GU121.columns.find(function (x) { return x.id == id });
                            if ((obj && obj.width > 0) || id == 'TIME') {
                                if (!arrCalcDes.contains(array[i])) {
                                    arrCalcDes.push(array[i]);
                                    arrCalcGunBun.push("1");
                                }

                            }
                        }
                    }

                    return {
                        CalcDes: 'default^calc_des^' + arrCalcDes.join('ㆍ/ㆍ'),
                        CalcGunBun: arrCalcGunBun.join('ㆍ9ㆍ')
                    }
                };
                var arrDispValue = dispValue[0].split('ㆍ/ㆍ');
                var objValue = {};
                if (arrDispValue.length > 1) {
                    objValue = getValueForFormula(arrDispValue);
                }
                else {
                    var preview = this.formDataTemp[this.formTabIndex].FormGroups[0].FormOutSet.SCHEDULE_PREVIEW_COLS;
                    var arrPreview = preview.split("ㆍ");
                    var arrValue = [];
                    var idxRemoved = arrPreview.findIndex(function (p) {
                        return arrDispValue.contains(p)
                    });
                    if (idxRemoved == 0) {
                        objValue = getValueForFormula(arrPreview);
                    }
                    else {
                        if (idxRemoved >= 1) {
                            arrPreview.remove(idxRemoved);

                        }
                        for (var i = 0; i < arrDispValue.length; i++) {
                            if (arrValue.length < 4) {
                                arrValue.push(arrDispValue[i]);
                            }
                        }
                        for (var i = 0; i < arrPreview.length; i++) {
                            if (arrValue.length < 4) {
                                arrValue.push(arrPreview[i]);
                            }
                        }

                        objValue = getValueForFormula(arrValue);
                    }
                }
                calc_des = objValue.CalcDes;
                calc_gunbun = objValue.CalcGunBun;
            }


            var param = {
                width: 780,
                height: 500,
                FORM_TYPE: this.FORM_TYPE,
                //F_TYPE: "",
                SHOW_TYPE: '',
                LOCATION_TOP: false,
                CALC_TYPE: "",//(defaultSetShowType == "C") ? (colCd == "supply_amt" ? "S" : "V") : "",
                CALC_DESC: calc_des,
                CALC_GUBUN: calc_gunbun,
                CALC_PAGE: "EGJ006M",
                IS_CALC_ONLY: true,
                IS_CALC_TYPE: false,
                IsUseExtendedMergeExpression: true,
            };
            this.openWindow({
                url: "/ECERP/Popup.Common/CM100P_05",
                name: ecount.resource.LBL05360,
                param: param,
                popupType: false,
                additional: false
            });
        }

    },

    getMaxFOrmColSize: function (colSize, config) {
        return 1;
    },

    getTitleColumnWidth: function (colSize, config) {
        return 154;
    },


});