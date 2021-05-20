window.__define_resource && __define_resource("LBL08833","LBL14288","LBL10489","LBL01806","BTN00141","LBL19154","LBL19155","LBL19156","LBL19157","LBL01414","LBL02522","LBL01533","LBL01661","LBL04003","BTN00065","BTN00007","BTN00008","BTN00785","LBL01593","MSG07622","LBL07157","LBL01482","MSG04677","LBL00407","MSG05280","LBL05455","LBL00703","MSG04678","MSG03602","MSG06577","MSG06879","LBL07879","LBL07880","LBL07709","LBL02792","LBL10736","LBL10607","MSG00141","MSG04357","MSG06880");
/**************************************************formAllDataTemp*********************************
 1. Create Date : 2016.03.03
 2. Creator     : inho
 3. Description : Template Setup for Input(양식설정 입력용) 
 4. Precaution  :
 5. History     : 2017.11.16(Hao) - Add formtype AI070
                  2017.12.22(임태규) - 소요량일때 헤더에 툴팁 안보이도록 수정
                  2018.10.04 (dotrinh) chặn setting trên all server
                  2018.12.03 (HoangLinh) - Add Formtype "AI410", "AI420" to setting colsize
                  2018.12.04 (AiTuan) - Add Formtype "AI480", "AI490" to setting colsize
                  2018.12.19(Tuan, Huynh Huu) - 16306_A18_03814_수령수표/발행수표 입력화면설정 추가
                  2019.03.13(Hao) - change api UpdateForCofmFormoutsetDetailHeadSize to UpdateColumnUse
                  2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2019.12.31 (Kim Woojeong) - [A19_04663] SAL_TYPE_CD 추가
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                  2020.05.15 (Hae In KIM) - A19_02458 단설정 #EUI1
                  2020.10.14 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정
				  2020.12.31 (김동수) : A20_07095 - 대만코드 세부내역 입력항목설정 스크립트오류
 6. MenuPath    : Self-Customizing>Configuration(환경설정)>Function Setup(사용방법설정)>Inv Tab(재고탭)>Input Screen/Template(입력화면/전표양식)>Input Screen(입력화면)
 7. Old File    : CM100P_06.aspx 
 ***********************************************************************************/
ecount.page.factory("ecount.page.formset", "CM100P_06", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: true,

    formInfo: null,

    formDataTemp: null,//temp variables for UI data 양식데이터

    formAllDataTemp: null,//temp variables for all data 양식 전체 데이터

    formTopIdx: null, // top index 상단 인덱스

    formBottomIdx: null, //it is 0, if top is empty   상단이 없으면, 인덱스가 0됨

    totalTabCount: 0,

    formTopTabIndex: 0, // 하단이 두개 이상일때..

    formBottomTabIndex: 0, // 하단이 두개 이상일때..

    currentTabId: "tabFirst", // Tab id (biến id tab)

    gridId: "dataGridFirst", // 하단 입력그리드 명

    gridSumId: "dataGridFirstSum", // 하단 합계그리드 명

    commonForm: null,

    lastEditTime: null,

    lastEditId: null,

    regexEmpty: /["＇'\s\\]/g,

    ENABLE_DRAGGABLE_EDIT: null,

    ENABLE_EDIT_ROW_MOVEABLE: true,

    //프로젝트,부서 추가 예외(add Except Site,Pjt)
    removeSitePjtForm: [],

    //추가버튼X && 순서이동X(remove add button, moving drag formType)
    removeAddMovingFormType: [],

    removeAddModFormType: ["PI620"],
    //remove Batch Settings button
    removeAllModFormType: ["PI620", "PI080"],

    removeAddFormType: ["PI080"], //"AI410", "AI420", "AI430"

    addMultiFormType: ["AI400"],

    //세부내역양식Type
    checkFormTypeisSlipsDetails: ["AU070", "AI080", "AI081"],

    //계산식순환참조 체크대상
    checkFormulaCircularReferenceFormType: ["SI030", "SI021", "SI210", "OI020", "AI080", "AI081", "PI080", "SD010", "OD020", "SD021", "SD030", "SI230", "SI240", "SI200", "SI220", "SI010", "SI420", "SI440", "SI710"],

    //계산식 순환컬럼
    circularReferenceItem: [],

    //[입력순서재정렬] 사용하지 않는 양식 (설정 > 입력순서, 표시순서 없음)
    defaultTypeOnly: ["AU340", "AU350", "AU360", "AU370", "AU380", "AU390", "AU400", "AU410", "AU430", "AU420", "AU440", "AU450", "AU460", "AU470", "AU480", "AU490", "AU500", "AU850", "AU510", "AU520", "AU530", "AU540", "AU550", "AU560"], //, "AU140", "AU150", "AU160"

    isLinkOptionSave: false,

    //bottom of the form type list only  -- DO NOT USE THIS "bottomFormTypeOnly"  사용하지마세요.
    //bottomFormTypeOnly: ["SI460"],

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this.initActiveForm = null;
        this._super.init.apply(this, arguments);

        //20200626 단설정2.0
        this._RowInCellCount = this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[0].ViewModel.colType * 2;

        this.registerDependencies("ecmodule.common.formHelper");
        this.registerDependencies("ecmodule.common.form");
    },

    render: function ($parent) {
        if (!this.isExistTop && this.isExistBottom) {
            this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[0].columns = this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[0].FormOutSetDetails;
            for (var ii = 0; ii < this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[0].columns.length; ii++) {
                this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[0].columns[ii].width = this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[0].FormOutSetDetails[ii].HEAD_SIZE;
            }
            this.setLayout(this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[0]);
        }
        require("widget.lib.dragable", function () {
            this._super.render.apply(this, arguments);
        }.bind(this));
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(this.viewBag.Title || ecount.resource.LBL08833);
    },

    onInitContents: function (contents) {
        
        var g = widget.generator,
            form = widget.generator.form(),
            panel = widget.generator.panel(),
            tabContents = g.tabContents(),
            tabContents1 = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid(),
            //knh #12
            grid2 = g.grid(),
            panelLeft = g.panel(),
            panelRight = g.panel();

        // 라인조정 추가된 입력메뉴, 그리드에서 [줄내리기] 보이지 않도록처리.
        if (["SI500"].contains(this.FORM_TYPE)) {
            this.ENABLE_EDIT_ROW_MOVEABLE = false;
        }

        var thisObj = this;
        this.ENABLE_DRAGGABLE_EDIT = (this.isLock) ? false : true;
        if (this.removeAddMovingFormType.contains(this.FORM_TYPE)) {
            this.ENABLE_DRAGGABLE_EDIT = false;
        }
        //set Template value 양식값 할당
        this.setFormInfosFromDb();

        // 바로 위 this.setFormInfosFromDb()에서 formDataTemp가 생성되기 때문에 CS 주문서입력일 경우 이부분에서 프로젝트(pjt_cd) 제거 - by lhw
        if (this.FORM_TYPE == 'OI020') {
            this.formAllDataTemp[0].FormGroups[0].FormOutColumns.remove(function (item) { return item.COL_CD == "pjt_cd" })
            this.formDataTemp[0].FormGroups[0].FormOutColumns.remove(function (item) { return item.COL_CD == "pjt_cd" })
        }
        if (thisObj.FORM_TYPE == 'PI085') {
            this.isExistTop = false;
            var col = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[0].ViewModel.columns.first(function (x) { return x.id == "APPLY_TAX_BRACKET"; });
            col.title = thisObj.TAX_BRACKET_TYPE == "1" ? ecount.resource.LBL14288 : ecount.resource.LBL10489;
        }
        this.commonForm = new ecount.common.form();
        this.commonForm.setWidgetMap(thisObj);

        if (this.FORM_TYPE == 'GU121') {
            toolbar.attach(ctrl.define("widget.button", "defaultContent").label(ecount.resource.LBL01806).css("btn btn-default btn-sm").end());
        }
        toolbar.addLeft(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce().end());

		//if (this.FORM_TYPE != 'SI760') {
		if (this.isExistTop && !this.isTopMultiTab) {
			toolbar.addLeft(ctrl.define("widget.select", "colType", "colType", "colType").option([["1", ecount.resource.LBL19154], ["2", ecount.resource.LBL19155], ["3", ecount.resource.LBL19156], ["4", ecount.resource.LBL19157]]).select(this.formDataTemp[0].FormGroups[0].ViewModel.colType).end());    // 단설정
		}
            

        var colSize = this.formInfo.ViewModel.colType;

        //양식설정 좌측 Setting Start
        if (thisObj.checkFormTypeisSlipsDetails.contains(this.FORM_TYPE) == true) {
            thisObj.setFormBuilder({ type: "acctDetails", div: panelLeft });//세부내역
        }
        //양식설정 좌측 Setting End
        
        //양식설정 우측 Setting Start
        if (this.isExistTop) {
            var columnSet = thisObj.formDataTemp[0].FormGroups[0].FormColumns;
            if (!this.isTopMultiTab) {
                form.setFormId("topForm")
                    .useTableType()
                    .css((this.isLock) ? "table table-border-no-a table-th-left" : "table table-border-no-a table-th-left table-template-setup-preview")
                    .useBaseForm()
                    .setColSize(colSize)
                    .useDynamicColSize();

                //소요량일때 헤더에 툴팁 안보이도록 수정
                if (this.FORM_TYPE == 'SI412') {
                    thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.forEach(function (s) {
                        s.isWithoutDropdown = true;
                    });
                }

                form.addControls(this._createInitWidgetData(null, columnSet));
                if (this.isExistTop && !this.isExistBottom) {
                    form.showLeftAndRightBorder(true);
                    //if (this.FORM_TYPE == 'GU121') {
                    //    form.colgroup([{ width: "120" }, { width: "" }]);;
                    //}
                }
            } else {
                for (i = 0; i < this.viewBag.InitDatas.Template.FormInfos[0].FormGroups.length; i++) {
                    formMulti = widget.generator.form();
                    formMulti
                        .css((this.isLock) ? "table table-border-no-a table-th-left" : "table table-border-no-a table-th-left table-template-setup-preview")
                        .useBaseForm()
                        .setColSize(2)
                        .useDynamicColSize()
                        .addControls(this._createInitWidgetData(this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[i].FormSet.Key.FORM_TYPE));

                    if (this.isExistTop && !this.isExistBottom) {
                        form.showLeftAndRightBorder(true);
                    }
                    // 탭아이디를 form_type으로 해주세요.
                    if (i == 0) {
                        tabContents1.createActiveTab(this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[i].FormSet.Key.FORM_TYPE, this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[i].FormSet.FORM_REX_CD, null, true).add(formMulti);
                        this.initActiveForm = this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[i].FormSet.Key.FORM_TYPE;
                    } else {
                        tabContents1.createTab(this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[i].FormSet.Key.FORM_TYPE, this.viewBag.InitDatas.Template.FormInfos[0].FormGroups[i].FormSet.FORM_REX_CD, null, false).add(formMulti);
                    }
                }
            }
        }


        this.totalTabCount = 1;
        if (this.viewBag.InitDatas.Template.FormInfos.length > 1) {
            this.totalTabCount = this.viewBag.InitDatas.Template.FormInfos[1].FormGroups.length;
        }
        if (this.totalTabCount > 1) {
            var gridFirst_01 = g.grid(),
                gridFirst_02 = g.grid(),
                gridSecond_01 = g.grid(),
                gridSecond_02 = g.grid(),
                tabResourceFirst = "",
                tabResourceSecond = ""
            ;

            //except only top form Top양식만 사용할 경우는 제외
            if (this.isExistBottom) {
                this.setSettingGrid(gridFirst_01, gridFirst_02, 0);
                this.setSettingGrid(gridSecond_01, gridSecond_02, 1);
            }

            if (this.FORM_TYPE == "SI500") {
                tabResourceFirst = ecount.resource.LBL01414;
                tabResourceSecond = ecount.resource.LBL02522;
            } else if (["SI420", "SI440", "SI421"].contains(this.FORM_TYPE)) {  //[2016.08.22 bsy 생산입고3 탭타이틀]
                tabResourceFirst = ecount.resource.LBL01533;
                tabResourceSecond = ecount.resource.LBL01661;
            }

            tabContents.createTab("tabFirst", tabResourceFirst, null, true, "left");
			tabContents.addGrid("dataGridFirst", gridFirst_01, null, gridFirst_01.getDragable() ? { css: "position-relative" } : {});
            tabContents.addGrid("dataGridFirstSum", gridFirst_02);

            tabContents.createTab("tabSecond", tabResourceSecond, null, false, "left");
			tabContents.addGrid("dataGridSecond", gridSecond_01, null, gridSecond_01.getDragable() ? { css: "position-relative" } : {});
            tabContents.addGrid("dataGridSecondSum", gridSecond_02);

            panelRight.add(toolbar);

            if (this.isTopMultiTab) {
                panelRight.add(tabContents1);
            } else {
                panelRight.add(form);
            }

            panelRight.add(tabContents);
        } else {
            var gridFirst_01 = g.grid(),
                gridFirst_02 = g.grid()
            ;

            //except only top form Top양식만 사용할 경우는 제외
            if (this.isExistBottom) {
                this.setSettingGrid(gridFirst_01, gridFirst_02, 0);
            }

            panelRight.add(toolbar);

            if (this.isTopMultiTab) {
                panelRight.add(tabContents1)
            } else {
                panelRight.add(form);
            }

            if (this.FORM_TYPE == "GU121") {
                var tabdefaultContent = g.tabContents();
                tabdefaultContent.createTab("tabDefaultContent", ecount.resource.LBL01806, null, true, "left");
                tabdefaultContent.colgroup([{ width: 750 }, { width: "" }]);
                tabdefaultContent.add(this.addControlToTabContens("defaultContent", 'TOP_TXT'));
                panelRight.add(tabdefaultContent);
            }
			panelRight.addGrid("dataGridFirst", gridFirst_01, null, gridFirst_01.getDragable() ? { css: "position-relative" } : {})
            panelRight.addGrid("dataGridFirstSum", gridFirst_02);
        }

        if (thisObj.checkFormTypeisSlipsDetails.contains(this.FORM_TYPE) == true) {
            contents.addColGroup(3, panelLeft);
            contents.addColGroup(9, panelRight);
        }
        else {
            contents.addColGroup(12, panelRight);
        }
        isDetailPermit = thisObj.isDetailPermit == true ? true : false;
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
            case "acctDetails": //세부내역 cofm_formoutsetAcct
                thisObj.commonForm.getWidgetHelper().add(["acctDetailsUse"], p);//세부내역 사용
                thisObj.commonForm.getWidgetHelper().add(["acctDetailsByInputDataCheckYn"], p);//입력내용 확인
                thisObj.commonForm.getWidgetHelper().add(["acctDetailsByDetailInformationSetting"], p);//재고정보 반영기준
                thisObj.commonForm.getWidgetHelper().add(["acctDetailsBySyncSlipSetting"], p);//회계정보수정시동기화
                thisObj.commonForm.getWidgetHelper().add(["acctDetailsByTotalQtyWhenAggregation"], p);//집계시 수량합산
                thisObj.commonForm.getWidgetHelper().add(["acctDetailsByReculculatePriceWhenAggregation"], p);//집계/동기화 시 단가 재계산
                x.div.add(widget.generator.subTitle().title(ecount.resource.LBL04003).setFormSetGroup(x.type));
                x.div.add(form.setFormSetGroup(x.type));
                break;
            default:
                break;
        }
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce())
            .addLeft(ctrl.define("widget.button", "cancel").label(ecount.resource.BTN00007))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addLeft(ctrl.define("widget.button", "history").label("H"));

        if (!this.isLock) {
            if (!this.removeAddMovingFormType.contains(this.FORM_TYPE) && !this.defaultTypeOnly.contains(this.FORM_TYPE)) {
                toolbar.addLeft(ctrl.define("widget.checkbox", "cursorResort").label(ecount.resource.BTN00785));
            }
        }

        footer.add(toolbar);
    },

    onChangeControl: function (control, data) {
        switch (control.cid) {
            case "acctDetailsByTotalQtyWhenAggregation":
                if (control.value == true) {
                    this.contents.getControl('acctDetailsByReculculatePriceWhenAggregation').readOnly(false);
                } else {
                    this.contents.getControl('acctDetailsByReculculatePriceWhenAggregation').setValue(false);
                    this.contents.getControl('acctDetailsByReculculatePriceWhenAggregation').readOnly(true);
                }
                break;
            case "colType":
                this._changeColType(control.value);
                break;
        }
    },

    onInitControl: function (cid, control) {

        if (["mystorage"].contains(cid) && ["SI010", "SI021", "SI400", "SI200"].contains(this.FORM_TYPE)) {
            control.setOptions({ disableMod: false, disableAllMod: false });
        }
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) {
    },
    // 탭 체인지 이벤트
    onChangeContentsTab: function (event) {

        this.currentTabId = event.tabId;
        var _slef = this;
        switch (this.currentTabId) {
            case "tabFirst":
                this.formBottomTabIndex = 0;
                this.gridId = "dataGridFirst";
                this.gridSumId = "dataGridFirstSum";
                break;
            case "tabSecond":
                this.formBottomTabIndex = 1;
                this.gridId = "dataGridSecond";
                this.gridSumId = "dataGridSecondSum";
                break;
        }
        console.log("first" + this.formTopTabIndex);
        this.formAllDataTemp[0].FormGroups.forEach(function (val, i) {
            if (_slef.currentTabId == _slef.formAllDataTemp[0].FormGroups[i].FormSet.Key.FORM_TYPE) {
                _slef.formTopTabIndex = i;

            }
        });
        console.log(this.formTopTabIndex);

    },

    onLoadComplete: function (event) {

        if (this.isExistTop) {
            //if add form on right layer, you have to recheck 0 is right.
            //because 0 index is left top form.
            //폼기준으로 그려지는 순서가 마지막인 경우 인덱스0 
            //그외의 경우는 예외 처리 해야함.
            if (this.isTopMultiTab) {
                for (i = 0; i < this.contents.getForm(true).length; i++) {
                    if (this.initActiveForm == this.contents.getForm(true)[i].tabId) {

                        this.setMoveSetting(this.contents.getForm(true)[i], false);
                    } else {
                        this.setMoveSetting(this.contents.getForm(true)[i], true);
                    }
                }
            } else {
                this.setMoveSetting(this.contents.getForm(true)[0], this.isReload ? true : false);
            }

            //sync sort for table on right top 오른쪽 상단 위젯 테이블 순서 동기화-값재할당
            this.setSortSync({ formIndex: this.formTopIdx });
            this.showFormsetLayer(this.formDataTemp[this.formTopIdx].FormGroups[this.formBottomTabIndex].ViewModel.columns[0].id);
            if (this.FORM_TYPE == "GU121") {
                this.contents.getPanel(1).setWidth(750);
                this.contents.getTabContents('tabDefaultContent').setTabWidth(750);
            }
            if (this.FORM_TYPE == "SI520") {
                this.contents.getForm()[0].hideRow("PROD_DES");
                this.contents.getForm()[0].hideRow("SIZE_DES");
            }
        }
        
        if (["AI080", "AI081"].contains(this.FORM_TYPE)) {
            if (this.contents.getControl("acctDetailsByTotalQtyWhenAggregation").getValue() == true) {
                this.contents.getControl('acctDetailsByReculculatePriceWhenAggregation').readOnly(false);
            } else {
                this.contents.getControl('acctDetailsByReculculatePriceWhenAggregation').readOnly(true);
            }
        }
        //this.setHybridGrid();
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        if (page.pageID == 'CM100P_47') {
            if (!$.isNull(message.type) && message.type == "getforminfo") {
                var objcColumn = Object.clone(thisObj.formDataTemp[message.formIndex].FormGroups[0].FormOutColumns, true);
                if (!this.isAreaTop(message.formIndex)) {
                    objcColumn = Object.clone(thisObj.formDataTemp[message.formIndex].FormGroups[this.formBottomTabIndex].FormOutColumns, true);
                } else if (this.isAreaTop(message.formIndex) && thisObj.addMultiFormType.contains(thisObj.FORM_TYPE)) {
                    objcColumn = Object.clone(thisObj.formDataTemp[message.formIndex].FormGroups[this.formTopTabIndex].FormOutColumns, true);
                }

                if (thisObj.isLock && thisObj.FORM_TYPE != "SI760") {
                    // 셀프커 설정따라감(선택에서 제외)
                    objcColumn.remove(function (item) { return item.COL_CD == "pjt_cd" });
                }
                if (!ecount.config.limited.feature.USE_POST)
                    objcColumn.remove(function (item) { return (thisObj.FORM_TYPE == 'SI780' && item.COL_CD == "post_no") || (thisObj.FORM_TYPE == 'SI770' && item.COL_CD == "Address1") });

                if (thisObj.removeSitePjtForm.contains(this.FORM_TYPE)) {
                    objcColumn.remove(function (item) { return item.COL_CD == "pjt_cd" });
                    objcColumn.remove(function (item) { return item.COL_CD == "site_cd" });
                }
                message.callback && message.callback(objcColumn);
                return;
            } else if (!$.isNull(message.type) && message.type == "addItems") {
                var tarcolcd = { COL_CD: message.targetColCd };
                message.colCds.forEach(function (rowItem, j) {
                    thisObj.setSettingDetail({ checked: true, formIndex: message.formIndex, rowItem: rowItem });
                    thisObj.setUiSync({ checked: true, formIndex: message.formIndex, rowItem: rowItem, target: tarcolcd }); //targetColCd: message.targetColCd });
                });
                message.callback && message.callback();
            }
        } else if (page.pageID == 'CM100P_42') {

            if (!$.isNull(message.type) && message.type == "getforminfo") {
                message.callback && message.callback(
                    thisObj.getFormDetailByColCd({ formIndex: message.formIndex, ColCd: message.colCd })
                );
                return;
            }
            var formGroupsIdx = thisObj.formBottomTabIndex;
            if (thisObj.isAreaTop(message.formIndex)) {
                formGroupsIdx = thisObj.formTopTabIndex;
            }
            var formDataTempCurrent = this.formDataTemp[message.formIndex].FormGroups[formGroupsIdx];
            var inputColumns = thisObj.formDataTemp[message.formIndex].FormGroups[formGroupsIdx].ViewModel.columns;
            //원본 표시순서 복제함, 설정 인스턴스 공유해서 쓰기 때문에 첫항목으로 인해 재정렬되면 나머지 순서가 변경되기 때문.
            var newNumSorts = Object.clone(message.data.FormOutSetDetails, true);
            message.data.FormOutSetDetails.forEach(function (detail) {
                if (!$.isNull(detail.HEAD_SIZE) && detail.HEAD_SIZE > 0) {
                    var colCd = detail.COL_CD;
                    var inputColumn = inputColumns.find(function (item) { return item.id == colCd });
                    var newNumSort = newNumSorts.find(function (item) { return item.COL_CD == colCd }).Key.NUM_SORT;
                    var newTabIndex = newNumSorts.find(function (item) { return item.COL_CD == colCd }).TAB_INDEX;
                    var columnInfoOption = {};// for grid. 그리드용
                    //if it is changed number,then update new number  표시 순서가 변경된 경우 순번업데이트
                    if (inputColumn.index != newNumSort) {
                        if (!thisObj.isAreaTop(message.formIndex)) {
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
                            thisObj.setSortSync({ formIndex: thisObj.formBottomIdx });
                        } else {
                            //  전체 순번 재정렬
                            var numSort = parseInt(newNumSort || 99);
                            numSort = (inputColumn.index < numSort) ? numSort + 1 : numSort;
                            detail.Key.NUM_SORT = numSort;
                            inputColumn.index = detail.Key.NUM_SORT;
                            var reSort = inputColumns.sortBy(function (s) {
                                //동일한 번호가 있을 경우 한칸식 밀어주기(자신은 제외)
                                return (s.index >= numSort
                                    && s.id != colCd) ? s.index++ : s.index;
                            });
                            //값재할당
                            var z = 0;
                            reSort = reSort.sortBy(function (s) { return s.index; });
                            reSort.forEach(function (sortedItem, j) {
                                z++;
                                formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = z;
                                inputColumns.find(function (item) { return item.id == sortedItem.id }).index = z;
                            })
                        }
                    }
                    //if it is changed sort number,then update new number  순서가 변경된 경우 순번업데이트
                    if (inputColumn.cursorIndex != detail.TAB_INDEX) {
                        //  전체 순번 재정렬
                        var tabIndex = parseInt(newTabIndex || 99);
                        tabIndex = (inputColumn.cursorIndex < tabIndex && inputColumn.cursorIndex > 0) ? tabIndex + 1 : tabIndex;
                        detail.TAB_INDEX = tabIndex;
                        inputColumn.cursorIndex = detail.TAB_INDEX;
                        var reSort = formDataTempCurrent.FormOutSetDetails.sortBy(function (s) {
                            //동일한 번호가 있을 경우 한칸식 밀어주기(자신은 제외)
                            return (s.TAB_INDEX >= tabIndex
                                && s.COL_CD != detail.COL_CD && s.TAB_INDEX > 0) ? s.TAB_INDEX++ : s.TAB_INDEX;
                        });
                        if (detail.TAB_INDEX == 0)
                            inputColumns.find(function (item) { return item.id == detail.COL_CD }).cursorIndex = 0;

                        //값재할당
                        var z = 0;
                        reSort = reSort.sortBy(function (s) { return s.TAB_INDEX; });
                        reSort.forEach(function (sortedItem, j) {
                            if (sortedItem.TAB_INDEX > 0) {
                                z++;
                                formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.COL_CD }).TAB_INDEX = z;
                                inputColumns.find(function (item) { return item.id == sortedItem.COL_CD }).cursorIndex = z;
                            }
                        })
                    }
                    if (inputColumn.isLineMrge != detail.LINE_MRGE_TF) {
                        //cell split  줄나눔일때
                        inputColumn.isLineMrge = detail.LINE_MRGE_TF;
                    }
                    if (!$.isEmpty(detail.HEAD_TITLE_NM) && detail.HEAD_TITLE_NM.replace(thisObj.regexEmpty, "") == "")
                        detail.HEAD_TITLE_NM = "";

                    if (inputColumn.title != detail.HEAD_TITLE_NM) {
                        //title 제목변경
                        if ($.isEmpty(detail.HEAD_TITLE_NM)) {
                            //inputColumn.title = thisObj.viewBag.InitDatas.Template.FormInfos[message.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == message.colCd }).SUB_REX_DES;
                            inputColumn.title = thisObj.viewBag.InitDatas.Template.FormInfos[message.formIndex].FormGroups[formGroupsIdx].FormColumns.find(function (item) { return item.COL_CD == colCd }).SUB_REX_DES;
                            columnInfoOption.title = inputColumn.title;
                        } else {
                            inputColumn.title = detail.HEAD_TITLE_NM;
                            columnInfoOption.title = detail.HEAD_TITLE_NM;
                        }
                    }
                    if (!$.isEmpty(detail.INPUT_TITLE_NM) && detail.INPUT_TITLE_NM.replace(thisObj.regexEmpty, "") == "")
                        detail.INPUT_TITLE_NM = "";
                    if (inputColumn.subTitle != detail.INPUT_TITLE_NM) {
                        //sub title 제목변경
                        if ($.isEmpty(detail.INPUT_TITLE_NM)) {
                            //inputColumn.subTitle = thisObj.viewBag.InitDatas.Template.FormInfos[message.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == message.colCd }).ADD_RESX_DES1;
                            inputColumn.subTitle = thisObj.viewBag.InitDatas.Template.FormInfos[message.formIndex].FormGroups[formGroupsIdx].FormColumns.find(function (item) { return item.COL_CD == colCd }).ADD_RESX_DES1;
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
                    if (thisObj.isAreaTop(message.formIndex)) {
                        //reset table on right top. 좌측상단 리셋
                        // if (thisObj.isTopMultiTab) {
                        //thisObj.setMoveTableReset(null,thisObj.contents.getForm(true)[1]);
                        //thisObj.setMoveTableReset(null, thisObj.contents.getForm(true)[0]);

                        // 일괄설정
                        //     thisObj.setMoveTableReset();
                        //  } else {
                        thisObj.setMoveTableReset(null, null, formDataTempCurrent.FormColumns);
                        // }
                        //sync sort for table on right top 오른쪽 상단 위젯 테이블 순서 동기화-값재할당
                        thisObj.setSortSync({ formIndex: thisObj.formTopIdx });
                    } else {
                        if (Object.keys(columnInfoOption).length > 0) {
                            thisObj.contents.getGrid(thisObj.gridId, false).grid.setColumnInfo(colCd, columnInfoOption);
                        }
                    }

                    $.extend(thisObj.formAllDataTemp[message.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.find(function (item) { return item.COL_CD == colCd }), detail);
                    $.extend(thisObj.formAllDataTemp[message.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == colCd }), inputColumn);
                    thisObj.formAllDataTemp[message.formIndex].FormGroups[formGroupsIdx].FormOtherDatas.ACCT_INOUT_TYPE = message.data.FormOtherDatas.ACCT_INOUT_TYPE;

                    if (message.data.FormOtherDatas.LINK_OPTION)
                        thisObj.formAllDataTemp[message.formIndex].FormGroups[formGroupsIdx].FormOtherDatas.LINK_OPTION = message.data.FormOtherDatas.LINK_OPTION;

                    thisObj.setUITotalSync();
                }
            });
            //close 부모창 닫기
            message.callback && message.callback();
        } else if (page.pageID == 'CM100P_59') {
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                var objcColumn = Object.clone(thisObj.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct, true);
                message.callback && message.callback(objcColumn);
                return;
            } else {
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.DATE_NEW_SYNC_BY_BEFORE = message.formOutSetAcct.DATE_NEW_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.SUPPLY_AMT_NEW_SYNC_BY_BEFORE = message.formOutSetAcct.SUPPLY_AMT_NEW_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.VAT_AMT_NEW_SYNC_BY_BEFORE = message.formOutSetAcct.VAT_AMT_NEW_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.REMARKS_NEW_SYNC_BY_BEFORE = message.formOutSetAcct.REMARKS_NEW_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_BEFORE = message.formOutSetAcct.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_BEFORE;

                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.DATE_NEW_SYNC_BY_AFTER = message.formOutSetAcct.DATE_NEW_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.SUPPLY_AMT_NEW_SYNC_BY_AFTER = message.formOutSetAcct.SUPPLY_AMT_NEW_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.VAT_AMT_NEW_SYNC_BY_AFTER = message.formOutSetAcct.VAT_AMT_NEW_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.REMARKS_NEW_SYNC_BY_AFTER = message.formOutSetAcct.REMARKS_NEW_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_AFTER = message.formOutSetAcct.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_AFTER;

                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.DATE_MODIFY_SYNC_BY_BEFORE = message.formOutSetAcct.DATE_MODIFY_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.SUPPLY_AMT_MODIFY_SYNC_BY_BEFORE = message.formOutSetAcct.SUPPLY_AMT_MODIFY_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.VAT_AMT_MODIFY_SYNC_BY_BEFORE = message.formOutSetAcct.VAT_AMT_MODIFY_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.REMARKS_MODIFY_SYNC_BY_BEFORE = message.formOutSetAcct.REMARKS_MODIFY_SYNC_BY_BEFORE;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_BEFORE = message.formOutSetAcct.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_BEFORE;

                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.DATE_MODIFY_SYNC_BY_AFTER = message.formOutSetAcct.DATE_MODIFY_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.SUPPLY_AMT_MODIFY_SYNC_BY_AFTER = message.formOutSetAcct.SUPPLY_AMT_MODIFY_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.VAT_AMT_MODIFY_SYNC_BY_AFTER = message.formOutSetAcct.VAT_AMT_MODIFY_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.REMARKS_MODIFY_SYNC_BY_AFTER = message.formOutSetAcct.REMARKS_MODIFY_SYNC_BY_AFTER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_AFTER = message.formOutSetAcct.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_AFTER;

                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.DATE_MERGE_SYNC = message.formOutSetAcct.DATE_MERGE_SYNC;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.SUPPLY_AMT_MERGE_SYNC = message.formOutSetAcct.SUPPLY_AMT_MERGE_SYNC;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.VAT_AMT_MERGE_SYNC = message.formOutSetAcct.VAT_AMT_MERGE_SYNC;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.REMARKS_MERGE_SYNC = message.formOutSetAcct.REMARKS_MERGE_SYNC;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ACCOUNTNUMBER_RECEIVED_MERGE_SYNC = message.formOutSetAcct.ACCOUNTNUMBER_RECEIVED_MERGE_SYNC;

                message.callback && message.callback();
            }
        } else if (page.pageID == 'CM100P_60') {
            if (!$.isNull(message.type) && message.type == "getFormInfo") {
                var objcColumn = Object.clone(thisObj.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct, true);
                message.callback && message.callback(objcColumn);
                return;
            } else {
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.REFLECTED_INVENTORY_SLIP_LINE_NUMBER = message.formOutSetAcct.REFLECTED_INVENTORY_SLIP_LINE_NUMBER;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ITEM_PROD_CODE_AGGREGATION_YN = message.formOutSetAcct.ITEM_PROD_CODE_AGGREGATION_YN;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ITEM_PROD_DES_AGGREGATION_YN = message.formOutSetAcct.ITEM_PROD_DES_AGGREGATION_YN;
                this.formDataTemp[message.formIndex].FormGroups[0].FormOutSetAcct.ITEM_SIZE_DES_AGGREGATION_YN = message.formOutSetAcct.ITEM_SIZE_DES_AGGREGATION_YN;

                message.callback && message.callback();
            }
        }
        else if (page.pageID == 'EGJ006P_20') {

            var formOutSetTxt = this.formAllDataTemp[0].FormGroups[0].FormOutSetTxt;
            formOutSetTxt.TOP_TXT = message.data.TXT;
            thisObj.setDefaultAndReplyContent(formOutSetTxt.TOP_TXT);

            message.callback && message.callback();
        }
    },

    setDefaultAndReplyContent: function (txt) {
        var ctrl = this.contents.getControl("defaultContent", "tabDefaultContent");
        var txtHTML = txt;
        if (txtHTML) {
            txtHTML = txtHTML + "<br/><br/><br/>";
        }
        ctrl.setHtml(txtHTML || "<br/><br/><br/>");
    },
    onContentsDefaultContent: function (e) {

        var self = this;
        var formOutSetTxt = self.formAllDataTemp[0].FormGroups[0].FormOutSetTxt;
        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 800,
            modal: true,
            DefaultContent: formOutSetTxt.TOP_TXT
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/EGJ/EGJ006P_20',
            name: "Default content",
            param: params,
            popupType: false,
            additional: false
        });
    },
    //hhy 수정
    //drag event 드래그 시작 이벤트
    onPreInitDrag: function (event, data, grid) {
        //console.log("드래그이벤트");
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
        if (data && data.target == "widget" && (data.type == "add" || data.type == "move")) {
            //add : from tree grid to widget table 트리에서 위젯으로 추가시 
            //move : drag widget from right to right on right table only 위젯에서 순서만 드래그로 변경시

            //sync table 위젯 순서 동기화-값재할당
            this.setSortSync({ formIndex: this.formTopIdx });
        } else if (data && data.target != "widget") {
            //sync grid 그리드 순서 동기화
            this.setSortSync({ formIndex: this.formBottomIdx });
            this.setUITotalSync();
        }
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onInitGridInitalize: function (cid, option) {
    },

    onGridRenderComplete: function (e, data, gridObj) {
        this._super.onGridRenderComplete.apply(this, arguments);
        if (gridObj.grid.getGridId().indexOf(this.gridId) > -1 && gridObj.grid.getGridId().indexOf("Sum") == -1 && this.isFirstSetupLayerOfGrid) {
            var firstShowId = "";
            for (var i = 0; i < this.formDataTemp[this.formBottomIdx].FormGroups[this.formBottomTabIndex].ViewModel.columns.length; i++) {
                if (this.formDataTemp[this.formBottomIdx].FormGroups[this.formBottomTabIndex].ViewModel.columns[i].width > 0) {
                    firstShowId = this.formDataTemp[this.formBottomIdx].FormGroups[this.formBottomTabIndex].ViewModel.columns[i].id;
                    break;
                }
            }
            this.showGridFormsetLayer(firstShowId, "0");
        }
    },

    //grid cell resize event  그리드 리사이즈 이벤트
    onResizeEndCompleted: function (event, data, grid) {
        this.formDataTemp[this.formBottomIdx].FormGroups[this.formBottomTabIndex].FormOutSetDetails.find(function (item) { return item.COL_CD == data.resizedColumnId }).HEAD_SIZE = data.colList.find(function (item) { return item.id == data.resizedColumnId }).width.toString().replace("px", "");
        this.setUITotalSync();
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onContentsSearch: function () {
    },

    addControlToTabContens: function (controlName, property) {

        var g = widget.generator,
            panel = g.panel(),
            toolbar = g.toolbar(),
            ctrl = g.control();
        var formOutSetTxt = this.formAllDataTemp[0].FormGroups[0].FormOutSetTxt;

        var contentHTML = formOutSetTxt[property];
        if (contentHTML) {
            contentHTML = contentHTML + "<br/><br/><br/>";
        }
        ctrl
            .define("widget.topBottomSetting", controlName, controlName, "")
            .label(ecount.resource.LBL01593)
            //.css({ width: '100%' })
            .setHtmlContent(contentHTML || "<br/><br/><br/>");
        ctrl.topBottomType("gw-board");
        panel.add(ctrl.end());
        return panel;
    },

    //Restore default 기본값 복원
    onContentsRestore: function () {
        //if (thisObj.checkFormTypeisSlipsDetails.contains(this.FORM_TYPE) == true) {
        //    ecount.alert(ecount.resource.MSG07622);
        //} else {
        this.getRestoreForm();
        //}
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

    //cancel 취소
    onFooterCancel: function () {
        this.setFormInfosFromDbOfCancel();
        this.setResetWedgets();
        if (this.isExistTop) {
            var formInfo = this.formAllDataTemp[0].FormGroups[this.formTopTabIndex];
            if (this.isTopMultiTab) {
                this.setMoveTableReset(this._createInitWidgetData(formInfo.FormSet.Key.FORM_TYPE, formInfo.FormColumns), this.contents.getForm(true)[this.formTopTabIndex]);
            } else {
                this.setMoveTableReset(this._createInitWidgetData(null, formInfo.FormColumns));
            }

        }
        this.setHybridGrid();
        if (this.FORM_TYPE == 'GU121') {
            var formOutSetTxt = this.formAllDataTemp[0].FormGroups[0].FormOutSetTxt;
            this.setDefaultAndReplyContent(formOutSetTxt.TOP_TXT);
        }
    },

    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //save 저장
    onFooterSave: function (e) {
        var thisObj = this;
        
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (isDetailPermit == false && permit != "W") {
            //permission message 권한 메시지
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
            thisObj.footer.getControl('save').setAllowClick();
        } else {
            thisObj.commonForm.getWidgetHelper().getMappingKeys().forEach(function (key, j) {
                //call mapping function 호출 매핑 펑션
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get(key)();
            });

            var callbackSave = thisObj.setSave.bind(thisObj);
            if (thisObj.FORM_TYPE == "PI085") {
                thisObj.checkDataTaxBracket(callbackSave);
            }
            else {
                var callbackSearial = thisObj.checkSerial.bind(thisObj, callbackSave);
                thisObj.checkItem(callbackSearial);
            }

        }
    },

    onFormsetAddClick: function (e) {
        if (this.FORM_TYPE == "PI085" && this.TAX_BRACKET_TYPE == "2") {
            ecount.alert("You cannot Add item");
            return
        }
        this.setAddItemPopup({ formIndex: this.formTopIdx, rowItem: { COL_CD: e.cid } });
    },


    onFormsetModClick: function (e) {
        //setting popup 설정 팝업
        this.setSettingPopup({ formIndex: this.formTopIdx, rowItem: { COL_CD: e.cid } });
    },

    onFormsetAllModClick: function (e) {
        //setting popup 설정 팝업
        this.setSettingPopup({ formIndex: this.formTopIdx, rowItem: { COL_CD: "" } });
    },

    onFormsetDelClick: function (e) {
        if (this.FORM_TYPE == "PI085" && this.TAX_BRACKET_TYPE == "2") {
            ecount.alert("You cannot Hide item");
            return
        }
        this.setDeleteItem({ formIndex: this.formTopIdx, rowItem: { COL_CD: e.cid } });
    },

    onContentsAcctDetailsByDetailInformationSetting: function (e) {
        var param = {
            width: 550,
            height: 400,
            modal: true
        };
        // Open popup
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_60",
            name: "",
            param: param,
            popupType: false,
            additional: false
        });
    },

    onContentsAcctDetailsBySyncSlipSetting: function (e) {
        //ecount.alert(ecount.resource.MSG07622);
        //return false;

        var param = {
            width: 590,
            height: 425,
            modal: true
        };
        // Open popup
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_59",
            name: "",
            param: param,
            popupType: false,
            additional: false
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
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
    setResetWedgets: function () {
        var thisObj = this;
        thisObj.commonForm.getWidgetHelper().getResetKeys().forEach(function (key, j) {
            //call reset function 호출 리셋 펑션
            thisObj.commonForm.getWidgetHelper().getResetWedgets().get(key)();
        });
    },

    //check item 체크 관리항목
    checkItem: function (callback) {
        var thisObj = this;
        if (ecount.config.inventory.ITEM_FLAG == "N"
            && !$.isNull(thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[thisObj.formBottomTabIndex].FormOutSetDetails.find(function (item) { return item.COL_CD == "item_des" && item.HEAD_SIZE != 0 }))) {
            //You cannot use the management field function since it has been disabled on the setting.\n\nDo you want to enable it?
            // 관리항목 기능이 사용안함으로 설정된 경우 관리항목을 사용할 수 없습니다.\n\n관리항목 기능을 사용으로 변경하겠습니까? 
            ecount.confirm(ecount.resource.MSG04677, function (status) {
                if (status) {
                    callback && callback();
                } else {

                    thisObj.setHideProgressbar();
                }
            });
        } else {
            callback && callback();
        }
    },

    //check item 체크 관리항목
    checkDataTaxBracket: function (callback) {
        var thisObj = this;
        var dataObj = {
            TAX_BRACKET_CD: thisObj.TAX_BRACKET_CD,
            SAL_TYPE_CD: "P"
        };
        ecount.common.api({
            url: "/SVC/Manage/Allowance/CheckTaxBracketData",
            data: Object.toJSON({ Request: { Data: dataObj, EditMode: thisObj.EditMode, FromProgramId: thisObj.viewBag.Permission.formUserPermit.Value } }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    if (result.Data.length == 0) {
                        callback && callback();
                    } else {

                        thisObj.setHideProgressbar();
                        thisObj.footer.getControl('save').setAllowClick();

                        thisObj.fnErrMessage(result.Data, {
                            titleDate: ecount.resource.LBL00407,
                            msgWarning: String.format(ecount.resource.MSG05280, ecount.resource.LBL05455),
                            isHideColumnCust: true
                        });
                    }
                }
            },
            complete: function () { thisObj.footer.getControl('save').setAllowClick(); }
        });

    },
    fnErrMessage: function (ErrMsg, extraParam) {

        var formErrMsg = Object.toJSON(ErrMsg);
        var param = {
            width: 600,
            height: 500,
            popupType: false,
            additional: false
        };
        var pageOption = {};
        pageOption.parentData = ErrMsg;
        pageOption.titleDate = ecount.resource.LBL00703;
        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeCommonCustom",
            param: param,
            pageOption: pageOption
        });
    },
    //check serial 체크 시리얼
    checkSerial: function (callback) {
        var thisObj = this;
        if (ecount.config.inventory.USE_SERIAL == "N"
            && !$.isNull(thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[thisObj.formBottomTabIndex].FormOutSetDetails.find(function (item) { return item.COL_CD == "serial_cd" && item.HEAD_SIZE != 0 }))) {
            //You cannot use the serial/lot number function since it has been disabled in the settings.\n\nDo you want to uncheck all input screen settings? 
            //시리얼/로트No. 기능이 사용안함으로 설정된 경우 시리얼/로트 항목을 사용할 수 없습니다.\n\n입력화면 설정을 모두 체크 해제 하겠습니까? 
            ecount.confirm(ecount.resource.MSG04678, function (status) {
                if (status) {
                    callback && callback();
                } else {
                    thisObj.setHideProgressbar();
                }
            });
        } else {
            callback && callback();
        }
    },

    //save
    setSave: function () {
        var thisObj = this;
        if (thisObj.FORM_TYPE == 'AI410' || thisObj.FORM_TYPE == 'AI420' || thisObj.FORM_TYPE == 'AI430') {
            var columnlist = thisObj.formDataTemp[1].FormGroups[0].FormOutSetDetails;
            var remark = columnlist.any(function (col) { return ["exp_remarks"].contains(col.COL_CD) });
            var remarkCd = columnlist.any(function (col) { return ["sub_job_gubun"].contains(col.COL_CD) });
            var drRemark = columnlist.any(function (col) { return ["dr_remarks_nm"].contains(col.COL_CD) });
            var drRemarkCd = columnlist.any(function (col) { return ["dr_remarks_cd"].contains(col.COL_CD) });
            var crRemark = columnlist.any(function (col) { return ["cr_remarks_nm"].contains(col.COL_CD) });
            var crRemarkCd = columnlist.any(function (col) { return ["cr_remarks_cd"].contains(col.COL_CD) });

            if (remark || remarkCd) {
                if (drRemark || crRemark || drRemarkCd || crRemarkCd) {
                    ecount.alert(ecount.resource.MSG03602);
                    this.footer.getControl('save').setAllowClick();
                    return false;
                }
            }
        }
        //cursor resort 재정렬
        if (thisObj.footer.getControl('cursorResort') != null && thisObj.footer.getControl('cursorResort').getValue() == true) {
            thisObj.formDataTemp.forEach(function (item, i) {
                //reset cursor order number 커서순서 초기화
                var _formTopTabIndex = i == 0 ? thisObj.formTopTabIndex : 0;
                thisObj.formDataTemp[i].FormGroups[_formTopTabIndex].FormOutSetDetails.forEach(function (item, j) {
                    item.TAB_INDEX = item.Key.NUM_SORT;
                });
                thisObj.formDataTemp[i].FormGroups[_formTopTabIndex].ViewModel.columns.forEach(function (item, j) {
                    item.cursorIndex = item.idx;
                });
            });
        }
        var data = null;
        if (!thisObj.isLock && !thisObj.removeAddMovingFormType.contains(thisObj.FORM_TYPE)) {
            var reSort = null;
            var detail = null;
            var listCodeTypeMessage = [];
            this.formAllDataTemp.forEach(function (formData, i) {
                var _formTopTabIndex = i == 0 ? thisObj.formTopTabIndex : 0;
                formData.FormGroups.forEach(function (formGroup, j) {
                    formGroup.FormOutSet = thisObj.formDataTemp[i].FormGroups[j].FormOutSet;
                    reSort = formGroup.FormOutSetDetails.sortBy(function (s) {
                        detail = thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == s.COL_CD })
                        if ($.isNull(detail)) {
                            s.Key.NUM_SORT = 99;
                            s.HEAD_SIZE = 0;
                        } else {
                            $.extend(s, detail);
                        }

                        if (s.COL_CD.startsWith("COL5") && s.HEAD_SIZE > 0 && (!s.USERTABLE_CD || s.USERTABLE_CD == 0)) {
                            var showColumn = thisObj.formDataTemp[i].FormGroups[_formTopTabIndex].ViewModel.columns.find(function (item) { return item.id == s.COL_CD });
                            listCodeTypeMessage.push(showColumn.title);
                        }
                        return s.Key.NUM_SORT;
                    });
                    reSort = reSort.sortBy(function (s) { return parseInt(s.Key.NUM_SORT); });
                    reSort.forEach(function (sortedItem, j) {
                        sortedItem.Key.NUM_SORT = j + 1;
                    })

                    formGroup.FormOutSetAcct = thisObj.formDataTemp[i].FormGroups[j].FormOutSetAcct;
                });
            });

            if (listCodeTypeMessage.length > 0) {
                ecount.alert(ecount.resource.MSG06577 + ' (' + listCodeTypeMessage.join(', ') + ')');
                this.footer.getControl('save').setAllowClick();
                return;
            }

            if (thisObj.checkFormulaCircularReferenceFormType.contains(this.FORM_TYPE)) {
                //계산식 유효성 체크 로직
                var caseCount = 0;
                var addList = [];
                var addSql = [];
                var addSqlF = [];

                for (var calcI = 0, calcILng = thisObj.formDataTemp.length; calcI < calcILng; calcI++) {
                    for (var calcJ = 0, calcJLng = thisObj.formDataTemp[calcI].FormGroups[0].FormOutSetDetails.length; calcJ < calcJLng; calcJ++) {
                        var calcItem = thisObj.formDataTemp[calcI].FormGroups[0].FormOutSetDetails[calcJ];
                        var selectColCd = calcItem.DEFAULT_CALC_IN_VAL || "";
                        var selectColCdF = calcItem.DEFAULT_CALC_OUT_VAL || "";
                        var colCd = calcItem.COL_CD || "";
                        var caseList = selectColCd.split("case when");

                        caseCount += caseList.length - 1;
                        if ((calcItem.DEFAULT_SET_SHOW_TYPE == "C" && calcItem.DEFAULT_IN_TYPE == "C") || (calcItem.DEFAULT_SET_SHOW_TYPE == "A" && calcItem.DEFAULT_VALUE_TYPE == "F")) {
                            addList.push(colCd);
                            addSql.push(selectColCd);
                            addSqlF.push(selectColCdF);
                        }
                    }
                }
                //내자
                if (!thisObj.checkFormulaCircularReference(addList, addSql, "0")) {
                    ecount.alert(thisObj.messageFormulaCodeCirculation() || ecount.resource.MSG06879);
                    thisObj.footer.getControl('save').setAllowClick();
                    return false;
                }
                //외자
                if (!thisObj.checkFormulaCircularReference(addList, addSqlF, "1")) {
                    ecount.alert(thisObj.messageFormulaCodeCirculation() || ecount.resource.MSG06879);
                    thisObj.footer.getControl('save').setAllowClick();
                    return false;
                }
            }

			//if (this.FORM_TYPE != 'SI760') {
			if (this.isExistTop && !this.isTopMultiTab) {
                this.formAllDataTemp[0].FormGroups[0].FormOutSet.COL_ATTR_ID = this.contents.getControl("colType").getValue();
            }
            
            data = { FORM_TYPE: this.FORM_TYPE, FORM_SEQ: 1, formDataTemp: this.formAllDataTemp, IS_CS: this.IS_CS, isDetailPermit: thisObj.isDetailPermit };
        } else {
            if (thisObj.removeAddMovingFormType.contains(thisObj.FORM_TYPE))
                data = { FORM_TYPE: this.FORM_TYPE, FORM_SEQ: 1, formDataTemp: this.formAllDataTemp, IS_CS: this.IS_CS };
            else {
                // 불량처리입력(SI500) 기본값 데이터를 잘못 가져와서 일단 이렇게 처리함. 20160720(일용)
                if (this.formDataTemp.length > 1) { // 상하단이 존재하면.
                    if (this.formDataTemp[1].FormGroups.length > 1) { // 하단탭정보가 2개일때.
                        if (this.formDataTemp[1].FormGroups[1].FormSeq == 1) {
                            this.formDataTemp[1].FormGroups[1].FormSeq = 2;
                        }
                    }
                }
                data = { FORM_TYPE: this.FORM_TYPE, FORM_SEQ: 1, formDataTemp: this.formDataTemp, IS_CS: this.IS_CS, isDetailPermit: thisObj.isDetailPermit };
            }
        }
        thisObj.setShowProgressbar();
        ecount.common.api({
            url: "/Common/Form/SaveFormTemplate",
            data: Object.toJSON(data),
            success: function (result) {
                thisObj.setHideProgressbar();
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {                    
                    if (thisObj.checkFormTypeisSlipsDetails.contains(thisObj.FORM_TYPE) == true) {
                        var _colUseYn = getUseFlag() == true ? "Y" : "N";
                        var _lstFormType = [thisObj.NationFormType.SalesInvoice1 + "-1", thisObj.NationFormType.AssetDecrease + "-1"];
                        var _lstColUseYN = [_colUseYn, _colUseYn];

                        if (thisObj.NationFormType.SlipsDetailsBySetting == "AU070") {
                            _lstFormType.push("TU001-1");
                            _lstColUseYN.push(_colUseYn);
                        }
                        var _param = {
                            Request: {
                                "FormType": _lstFormType.join(ecount.delimiter),
                                "COL_USE_YN": _lstColUseYN.join(ecount.delimiter),
                                "ColCd": "taxInvoiceDetail"                                
                            }
                        };
                        ecount.common.api({
                            url: "/SVC/Common/Form/UpdateColumnUse",
                            data: JSON.stringify(_param),
                            success: function (result) {
                                if (result.Status != "200") {
                                    ecount.alert("error");
                                } else {
                                    thisObj.sendMessage(thisObj, {
                                        "ACCTDetails": getUseFlag() == true ? ecount.resource.LBL07879 : ecount.resource.LBL07880,
                                        callback: thisObj.close.bind(thisObj)
                                    });
                                }
                            }.bind(this)
                        });

                        function getUseFlag() {
                            return result.Data[0].FormGroups[0].FormOutSetAcct.DETAILS_USE_YN == true;
                        }
                    } else if (thisObj.FORM_TYPE == "PI082" || thisObj.FORM_TYPE == "PI083") {
                        //수당항목등록
                        thisObj.sendMessage(thisObj, {
                        });
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    } else {
                        thisObj.close();
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
        var formType = "";

        if (this.isAreaTop(data.formIndex) && thisObj.addMultiFormType.contains(thisObj.FORM_TYPE)) {
            showColumn = thisObj.formDataTemp[data.formIndex].FormGroups[this.formTopTabIndex].ViewModel.columns.find(function (item) { return item.id == colcd });
            //formType = data.tabType;
            formType = this.formDataTemp[data.formIndex].FormGroups[this.formTopTabIndex].FormSet.Key.FORM_TYPE;
        }
        else if (this.isAreaTop(data.formIndex)) {
            showColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == colcd });
            formType = this.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE;
        } else {
            showColumn = thisObj.formDataTemp[data.formIndex].FormGroups[this.formBottomTabIndex].ViewModel.columns.find(function (item) { return item.id == colcd });
            formType = this.formDataTemp[data.formIndex].FormGroups[this.formBottomTabIndex].FormSet.Key.FORM_TYPE;
        }
        var param = {
            height: 450,
            width: 450,
            modal: true,
            FORM_TYPE: formType,
            formIndex: data.formIndex,
            targetColCd: colcd,
            currentTabId: thisObj.currentTabId
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
        var formGroupsIdx = thisObj.formBottomTabIndex;
        if (thisObj.isAreaTop(data.formIndex)) {
            formGroupsIdx = thisObj.formTopTabIndex;
        }
        var formType = this.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormSet.Key.FORM_TYPE;
        var param = {
            width: (($.isEmpty(colcd)) ? 800 : 350),
            height: 720,
            modal: true,
            FORM_TYPE: formType,
            formIndex: data.formIndex,
            COL_CD: colcd,
            isLock: thisObj.isLock,
            IS_CS: thisObj.IS_CS
        };

		//if (this.FORM_TYPE != 'SI760') {
		if (this.isExistTop && !this.isTopMultiTab) {
            param.colType = this.contents.getFormById('topForm').getColSize();
        }

        if (this.FORM_TYPE == 'GU121' || this.FORM_TYPE == 'GU131') {
            var listcode = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.where(function (n) { return n.COL_CD.indexOf("COL5") > -1; }).select(function (obj) { return obj.USERTABLE_CD })

            if (listcode.length > 0) {
                param.USERTABLE_CD = listcode.join(ecount.delimiter);
            }
        }
        if (this.FORM_TYPE == 'SI520') {
            var code_class = null;
            switch (colcd) {
                case "col1":
                    this.code_class = "L21";
                    break;
                case "col2":
                    this.code_class = "L22";
                    break;
                case "col3":
                    this.code_class = "L23";
                    break;
                case "col4":
                    this.code_class = "L24";
                    break;
                case "col5":
                    this.code_class = "L25";
                    break;
                case "col6":
                    this.code_class = "L26";
                    break;
                case "col7":
                    this.code_class = "L27";
                    break;
                case "col8":
                    this.code_class = "L28";
                    break;
                case "col9":
                    this.code_class = "L29";
                    break;
                case "col10":
                    this.code_class = "L30";
                    break;
            }
            param.CODE_CLASS = this.code_class;
        }
            /* 외근 */
        else if (this.FORM_TYPE == 'GU111') {
            var code_class = null;
            switch (colcd) {
                case "u_code1":
                    this.code_class = "W01";
                    break;
                case "u_code2":
                    this.code_class = "W02";
                    break;
                case "u_code3":
                    this.code_class = "W03";
                    break;
                case "u_code4":
                    this.code_class = "W04";
                    break;
                case "u_code5":
                    this.code_class = "W05";
                    break;
                case "u_code6":
                    this.code_class = "W06";
                    break;
                case "u_code7":
                    this.code_class = "W07";
                    break;
                case "u_code8":
                    this.code_class = "W08";
                    break;
                case "u_code9":
                    this.code_class = "W09";
                    break;
                case "u_code10":
                    this.code_class = "W10";
                    break;
            }
            param.CODE_CLASS = this.code_class;
        }
        else if (this.FORM_TYPE == 'PI085') {
            param.TAX_BRACKET_CD = this.TAX_BRACKET_CD;
            param.TAX_BRACKET_DETAIL_CLASS = this.TAX_BRACKET_DETAIL_CLASS;
        }
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_42',
            name: "",
            param: param,
            popupType: false,
            additional: false,
        });
    },

    // delete item 항목 삭제
    setDeleteItem: function (data) {
        //remove widget 삭제 위젯
        if (this.isAreaTop(data.formIndex)) {
            if (!this.isLock) {
                this.setFormDeleteWidget(data.rowItem.COL_CD);//param : 0[id]
            }
        }
        //update data 상단 데이터 갱신
        this.setSettingDetail({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
        this.setUiSync({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
    },

    //get detail by col code 항목상세 데이터
    getFormDetailByColCd: function (data) {
        var thisObj = this;
        var OtherDates = new Array();
        var currentTabIdx = 0;
        if (!this.isAreaTop(data.formIndex)) {
            currentTabIdx = this.formBottomTabIndex;
        } else {

            currentTabIdx = this.formTopTabIndex;
        }

        if ($.isEmpty(data.ColCd)) {
            return {
                FormSet: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormSet,
                FormOutSet: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOutSet,
                OtherDates: OtherDates, //other dates 다른 날짜 데이터
                FormColumns: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormColumns,
                FormOutSetDetails: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOutSetDetails,
                FormOutColumns: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOutColumns,
                columns: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].ViewModel.columns.sortBy(function (s) { return s.index; }),
                FormOtherDatas: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOtherDatas
            }
        } else {
            return {
                FormSet: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormSet,
                FormOutSet: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOutSet,
                OtherDates: OtherDates, //other dates 다른 날짜 데이터
                FormColumns: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormColumns,
                FormOutSetDetails: [thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOutSetDetails.find(function (item) { return item.COL_CD == data.ColCd })],
                FormOutColumns: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOutColumns,
                columns: [thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].ViewModel.columns.find(function (item) { return item.id == data.ColCd })],
                FormOtherDatas: thisObj.formDataTemp[data.formIndex].FormGroups[currentTabIdx].FormOtherDatas
            }
        }
    },

    //sync left ui 우측 UI 갱신
    setUiSync: function (data) {
        console.log("setUiSync");
        var thisObj = this;
        var formGroupsIdx = thisObj.formBottomTabIndex;
        if (thisObj.isAreaTop(data.formIndex)) {
            formGroupsIdx = thisObj.formTopTabIndex;
        }
        //get group 그룹가져오기
        var groupColCd = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD }).GROUP_COL_CD;
        var colGroup = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.where(function (item, i) { return item.GROUP_COL_CD == groupColCd });
        var formColumns = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormColumns;

        if (thisObj.isLock) {
            if (data.checked) {
                var targetColCdIdx;
                colGroup.forEach(function (colOfGroup) {
                    if (thisObj.isAreaTop(data.formIndex)) {
                        thisObj.setMoveTableReset(thisObj._createInitWidgetData(null, formColumns));
                    } else {
                        var columnInfoOption = {};
                        columnInfoOption.title = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == colOfGroup.COL_CD }).title;
                        columnInfoOption.width = 100;
                        columnInfoOption.isHideColumn = false;
                        thisObj.contents.getGrid(thisObj.gridId, false).grid.setColumnInfo(colOfGroup.COL_CD, columnInfoOption);
                        thisObj.contents.getGrid(thisObj.gridId, false).grid.refreshCell("sub_prod", "0");
                    }
                    data.target.COL_CD = colOfGroup.COL_CD;
                });
            } else {
                colGroup.forEach(function (colOfGroup) {
                    if (thisObj.isAreaTop(data.formIndex)) {
                        thisObj.setMoveTableReset(thisObj._createInitWidgetData(null, formColumns));
                    } else {
                        var columnInfoOption = {};
                        columnInfoOption.width = 0;
                        columnInfoOption.isHideColumn = true;
                        thisObj.contents.getGrid(thisObj.gridId, false).grid.setColumnInfo(colOfGroup.COL_CD, columnInfoOption);
                    }
                });
            }
        } else {
            if (data.checked) {
                var targetColCdIdx;
                colGroup.forEach(function (colOfGroup) {
                    if (thisObj.isAreaTop(data.formIndex)) {
                        targetColCdIdx = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == data.target.COL_CD }).index);
                    }
                    if (thisObj.isAreaTop(data.formIndex)) {
                        //add widget on right top 우측 상단 위젯 추가
                        var objParam = thisObj.formDataTemp[thisObj.formTopIdx].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == colOfGroup.COL_CD });
                        var displayFieldObj = formColumns.find(function (_column) {
                            return _column.COL_CD == objParam.id;
                        });
                        if (displayFieldObj) {
                            if ($.isEmpty(displayFieldObj.REX_CD)) {
                                objParam.label = String.format("{0}", displayFieldObj.SUB_REX_DES);
                            } else {
                                objParam.label = String.format("{0}({1})", displayFieldObj.SUB_REX_DES, ecount.resource[displayFieldObj.REX_CD]);
                            }
                            
                        }
                            
                        thisObj.setFormAddWidget(objParam, targetColCdIdx);
                    } else {
                        var columnItem = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[thisObj.formBottomTabIndex].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                        //add item item on right grid 우측 하단 그리드 항목 추가
                        thisObj.contents.getGrid(thisObj.gridId, false).grid.addColumn({
                            //title: colOfGroup.TITLE,
                            title: thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[thisObj.formBottomTabIndex].ViewModel.columns.find(function (item) { return item.id == colOfGroup.COL_CD }).title,
                            id: colOfGroup.COL_CD,
                            propertyName: colOfGroup.COL_CD,
                            width: '100'
                        }, {
                            columnId: data.target.COL_CD, direction: 'right',
                            customizeColumn: function (value, rowItem) {
                                return thisObj.setCustomSettingRow(value, rowItem, columnItem);
                            }
                        });
                    }
                    data.target.COL_CD = colOfGroup.COL_CD;
                });
            } else {
                colGroup.forEach(function (colOfGroup) {
                    if (thisObj.isAreaTop(data.formIndex)) {
                        //remove widget on right top  우측 상단 위젯제거
                        thisObj.setFormDeleteWidget(colOfGroup.COL_CD);//param : 0[id]
                    } else {
                        //remove item on right grid 우측 하단 그리드 항목 제거
                        thisObj.contents.getGrid(thisObj.gridId, false).grid.removeColumn(colOfGroup.COL_CD, { removeDOM: true });
                    }
                });
            }
        }
        //sync sort number 정렬순서 동기화
        if (this.isAreaTop(data.formIndex))
            this.setSortSync({ formIndex: this.formTopIdx });
        else {
            this.setSortSync({ formIndex: this.formBottomIdx });
            this.setUITotalSync();
        }
    },

    //setting detail 상세 설정
    setSettingDetail: function (data) {
        var thisObj = this;
        var formGroupsIdx = thisObj.formBottomTabIndex;

        if (thisObj.isAreaTop(data.formIndex)) {
            formGroupsIdx = thisObj.formTopTabIndex;
        }

        //get group  그룹가져오기
        var groupColCd = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD }).GROUP_COL_CD;
        var colGroup = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.where(function (item, i) { return item.GROUP_COL_CD == groupColCd });
        if (thisObj.isLock) {
            if (data.checked) {
                colGroup.forEach(function (colOfGroup) {
                    var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.find(function (item) { return item.COL_CD == formColumn.COL_CD }).HEAD_SIZE = 100;
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == formColumn.COL_CD }).width = 100;
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "Y";
                });
            } else {
                colGroup.forEach(function (colOfGroup) {
                    var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.find(function (item) { return item.COL_CD == formColumn.COL_CD }).HEAD_SIZE = 0;
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == formColumn.COL_CD }).width = 0;
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "N";
                });
            }
        } else {
            if (data.checked) {
                colGroup.forEach(function (colOfGroup) {
                    var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                    var index = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.length) + 1;
                    var newFormOutSetDetail = Object.clone(thisObj.formAllDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.find(function (item) { return item.COL_CD == formColumn.COL_CD }), true);
                    newFormOutSetDetail.HEAD_SIZE = 100;
                    var newColumn = Object.clone(thisObj.formAllDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == formColumn.COL_CD }), true);
                    newColumn.width = 100;
                    newFormOutSetDetail.TAB_INDEX = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.where(function (item, i) { return item.TAB_INDEX > 0; }).length + 1;
                    newColumn.cursorIndex = newFormOutSetDetail.TAB_INDEX;
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.add(newFormOutSetDetail);
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.add(newColumn);
                    //check 체크 처리
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "Y";
                });
            } else {
                colGroup.forEach(function (colOfGroup) {
                    var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                    //remove detail  디테일 삭제
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.remove(function (item) { return item.COL_CD == formColumn.COL_CD });
                    //remove item 항목 삭제
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.remove(function (item) { return item.id == formColumn.COL_CD });
                    //uncheck 언체크 처리
                    thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "N";
                });
                var z = 0;
                var reSort = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.sortBy(function (s) { return s.cursorIndex; });
                reSort.forEach(function (sortedItem) {
                    if (sortedItem.cursorIndex != 0) {
                        z++;
                        thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).TAB_INDEX = z;
                        thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).cursorIndex = z;
                    }
                });
            }
        }
    },

    setSettingGrid: function (settings1, settings2, tabIndex) {
        var thisObj = this;
        //settings1.setDragable(true)
        settings1.setDragable(((thisObj.isLock) ? false : true))

            //### refactoring 이후 추가 함수 by knh
            .setFormVersion(ecount.grid.constValue.formVersion.second) //양식 버전 정보

            //.setFormData(thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[0].ViewModel)
            .setFormData(thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[tabIndex].ViewModel)
            .setRowData([])
            .setCellResize(true, 'width', 'totalWidth')    // ygh #9
            .setColumnPropertyColumnName('COL_CD')
            .setColumnPropertyNormalize(true)
            .setStyleBorderRemoveLeftRight(true)
            .setCheckBoxUse(true)
            .setEditable(true, 3, 3)

            //.setCommonGridType(ecount.grid.constValue.gridType.editableForm) //grid refactoring 추가 by knh
            //.setFormVersion(ecount.grid.constValue.formVersion.second) //grid refactoring 추가 by knh
            //.setDragMoveArea(ecount.grid.constValue.dragMoveType.self) //grid refactoring 추가 by knh

            .setEditRowMoveable(this.ENABLE_EDIT_ROW_MOVEABLE, false)
            .setEditSpecialRowCount(1)
            .setCheckBoxCheckingDeterminer(function () {
                return false;
            });
        //make setting delete link button  설정/삭제 처리
        //knh #3 - 우측 그리드 컬럼 id 로 사용하는것으로 setCustomRowCell 바인딩
        thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[tabIndex].FormColumns.forEach(function (item) {
            //var thisObj = this;
            settings1.setCustomRowCell(item.COL_CD, function (value, rowItem) {
                var data = "";
                if (rowItem[ecount.grid.constValue.rowCountColumnPropertyName] == 1) {
                    if ($.isEmpty(item.REX_CD)) {
                        data = String.format("{0}", item.SUB_REX_DES);
                    } else {
                        data = String.format("{0}({1})", item.SUB_REX_DES, ecount.resource[item.REX_CD]);
                    }
                    
                }
                return thisObj.setCustomSettingRow(value, rowItem, item, data);
            }.bind(this));
        });
        var totalWidthVal = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[tabIndex].FormOutSetDetails.sum(function (item) { return item.HEAD_SIZE || 0; }) + 50;
        thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[tabIndex].FormOutSet.TABLE_WIDTH = totalWidthVal;
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
    },

    //bind grid  그리드 바인딩
    setHybridGrid: function () {
        var thisObj = this;
        if (this.isExistBottom) {
            this.totalTabCount = this.totalTabCount || 1;
            for (var formBottomTabIndex = 0; formBottomTabIndex < this.totalTabCount; formBottomTabIndex++) {
                var gridId = "dataGridFirst";
                var gridSumId = "dataGridFirstSum";
                if (formBottomTabIndex != 0) {
                    gridId = "dataGridSecond";
                    gridSumId = "dataGridSecondSum";
                }
                //list 리스트
                var settings = this.contents.getGrid(gridId, false).settings
                    .setFormData(thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[formBottomTabIndex].ViewModel);
                //make setting delete link button  설정/삭제 처리
                //knh #3 - 우측 그리드 컬럼 id 로 사용하는것으로 setCustomRowCell 바인딩
                thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[formBottomTabIndex].FormColumns.forEach(function (item) {
                    //var thisObj = this;
                    settings.setCustomRowCell(item.COL_CD, function (value, rowItem) {
                        var data = "";
                        if (rowItem[ecount.grid.constValue.rowCountColumnPropertyName] == 1) {
                            if ($.isEmpty(item.REX_CD)) {
                                data = String.format("{0}", item.SUB_REX_DES);
                            } else {
                                data = String.format("{0}({1})", item.SUB_REX_DES, ecount.resource[item.REX_CD]);
                            }
                            
                        }

                        return thisObj.setCustomSettingRow(value, rowItem, item, data);
                    }.bind(this));
                });
                this.contents.getGrid(gridId, false).draw();
                var totalWidthVal = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[formBottomTabIndex].FormOutSetDetails.sum(function (item) { return item.HEAD_SIZE || 0; }) + 50;
                thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[formBottomTabIndex].FormOutSet.TABLE_WIDTH = totalWidthVal;
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
        option.event = {
            'click': function (e, data) {
                console.log(data);
                if (data.childElementId == 'add') {
                    thisObj.setAddItemPopup({ formIndex: thisObj.formBottomIdx, rowItem: { COL_CD: data.columnId } });
                }
                else if (data.childElementId == 'modify') {
                    thisObj.setSettingPopup({ formIndex: thisObj.formBottomIdx, rowItem: { COL_CD: data.columnId } });

                }
                else if (data.childElementId == 'multiModify') {
                    thisObj.setSettingPopup({ formIndex: thisObj.formBottomIdx, rowItem: { COL_CD: "" } });

                }
                else if (data.childElementId == 'hide') {

                    thisObj.setDeleteItem({ formIndex: thisObj.formBottomIdx, rowItem: { COL_CD: data.columnId } });
                }
                e.preventDefault();
            }
        };
        return option;
    },

    //sync sort 정렬동기화
    setSortSync: function (data) {
        console.log("setSortSync");
        if (!this.isLock) {
            if (this.isAreaTop(data.formIndex)) {
                //sync table  위젯 순서 동기화-값재할당
                for (i = 0; i < this.formDataTemp[this.formTopIdx].FormGroups.length; i++) {
                    var formDataTempCurrent = this.formDataTemp[this.formTopIdx].FormGroups[i];
                    formDataTempCurrent.ViewModel.columns.forEach(function (sortedItem, j) {
                        formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = j + 1;
                    });
                }
            } else {
                //sync grid 그리드 순서 동기화
                var formDataTempCurrent = this.formDataTemp[this.formBottomIdx].FormGroups[this.formBottomTabIndex];
                this.contents.getGrid(this.gridId, false).grid.getColumnInfoList().forEach(function (sortedItem, j) {
                    formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = j + 1;
                    formDataTempCurrent.ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).index = j + 1;
                });
            }
        }
    },

    //sync total  그리드 전체 합계 리사이즈 동기화
    setUITotalSync: function () {
        if (this.isExistBottom) {
            console.log("setUITotalSync");
            var resizedTotalWidth = this.contents.getGrid(this.gridId, false).grid.getResizeResult().resizedTotalWidth;
            this.formDataTemp[this.formBottomIdx].FormGroups[this.formBottomTabIndex].FormOutSet.TABLE_WIDTH = resizedTotalWidth;
            var dataGridFirstSum = this.contents.getGrid(this.gridSumId, false).grid;
            dataGridFirstSum.setCell("totalWidth", dataGridFirstSum.getRowKeyByIndex(0), String.format(ecount.resource.LBL07709 + " {0}px", resizedTotalWidth));
            dataGridFirstSum.setColumnInfo("totalWidth", { 'width': resizedTotalWidth });
            dataGridFirstSum.refreshCell('totalWidth', 'totalWidth');
        }
    },

    //get form template from db 양식 디비값 가져오기
    setFormInfosFromDb: function () {
        var thisObj = this;
        //for ui UI용 데이터
        this.formDataTemp = new Array();
        //for save 저장용 데이터
        this.formAllDataTemp = new Array();
        Object.clone(this.viewBag.InitDatas.Template, true).FormInfos.forEach(function (formTemp, i) {
            thisObj.formDataTemp.push(formTemp);
            thisObj.setColumnExceptWidthZero(i);
        });
        Object.clone(this.viewBag.InitDatas.Template, true).FormInfos.forEach(function (formTemp, i) {
            thisObj.formAllDataTemp.push(formTemp);
        });

        thisObj.formInfo = this.formDataTemp[0].FormGroups[0];

        if (this.isExistTop && this.isExistBottom) {
            this.formTopIdx = 0;
            this.formBottomIdx = 1;
        } else if (this.isExistTop && !this.isExistBottom) {
            this.formTopIdx = 0;
            this.formBottomIdx = 0;
        } else if (!this.isExistTop && this.isExistBottom) {
            this.formTopIdx = 0;
            this.formBottomIdx = 0;
        } else {
            this.formTopIdx = -1;
            this.formBottomIdx = 0;
        }
        thisObj.lastEditTime = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[this.formBottomTabIndex].FormOutSet.EDIT_DT;
        thisObj.lastEditId = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[this.formBottomTabIndex].FormOutSet.EDIT_ID;
    },

    //get form template from db 양식 디비값 가져오기
    setFormInfosFromDbOfCancel: function () {
        var thisObj = this;
        if (thisObj.isTopMultiTab) {
            thisObj.viewBag.InitDatas.Template.FormInfos.forEach(function (formTemp, i) {
                formTemp.FormGroups.forEach(function (formGroup, j) {
                    if (formGroup.FormSet.VIEW_TYPE == "U" && j == thisObj.formTopTabIndex) {
                        thisObj.formDataTemp[i].FormGroups[j] = Object.clone(formGroup, true);
                        thisObj.formAllDataTemp[i].FormGroups[j] = Object.clone(formGroup, true);
                    }
                    else if (formGroup.FormSet.VIEW_TYPE == "I") {
                        thisObj.formDataTemp[i].FormGroups[j] = Object.clone(formGroup, true);
                        thisObj.formAllDataTemp[i].FormGroups[j] = Object.clone(formGroup, true);
                    }
                });
                thisObj.setColumnExceptWidthZero(i);
            });

        } else {
            thisObj.formDataTemp = Object.clone(this.viewBag.InitDatas.Template.FormInfos, true);
            thisObj.formAllDataTemp = Object.clone(this.viewBag.InitDatas.Template.FormInfos, true);
            thisObj.setColumnExceptWidthZero(0);
        }

        thisObj.lastEditTime = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[this.formBottomTabIndex].FormOutSet.EDIT_DT;
        thisObj.lastEditId = thisObj.formDataTemp[thisObj.formBottomIdx].FormGroups[this.formBottomTabIndex].FormOutSet.EDIT_ID;
    },



    // except width zero 넓이 0 제외 설정
    setColumnExceptWidthZero: function (i) {
        //add button disable by col_cd // choijinyoung
        var removeAddBtnList = {
            //"SI743": ["basic_date", "emp_cd"]
        };
        var checkAppendAddBtn = function (s) {
            return ((this.FORM_TYPE in removeAddBtnList) && removeAddBtnList[this.FORM_TYPE].contains(s.id))
        }.bind(this);
        var removeDelBtnList = {
            "SU721": ["serialLotNum", "txtSProdCd", "customBasicQty", "WH_CD"] //"expirationDate",
        };
        var checkRemoveDelBtn = function (s) {
            return ((this.FORM_TYPE in removeDelBtnList) && removeDelBtnList[this.FORM_TYPE].contains(s.id));
        }.bind(this);

        //add button disable by col_cd // choijinyoung
        if (this.isLock) {
            var thisObj = this;
            var reSort = null;
            thisObj.formDataTemp[i].FormGroups.forEach(function (formGroup, j) {
                formGroup.ViewModel.columns.forEach(function (s) {
                    if (thisObj.isAreaTop(i)) {
                        if (formGroup.FormSet.IS_CS) {

                        } else {
                            if (s.id.indexOf("u_memo") < 0 && s.id.indexOf("u_txt") < 0 && !["widget.code.project", "widget.code.pic", "widget.code.wh", "widget.code.cust"].contains(s.controlType.toLowerCase())) {
                                s.disableMod = true;
                                s.disableAllMod = true;
                            }
                            if (["widget.code.project", "widget.code.pic", "widget.code.site"].contains(s.controlType.toLowerCase())) {
                                s.disableDel = true;
                            }
                        }
                    }
                    //add button disable by col_cd // choijinyoung
                    if (checkAppendAddBtn(s)) {
                        s.disableAdd = true;
                    }


                    //add button disable by col_cd // choijinyoung
                    //sync 싱크
                    s.index = thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == s.id }).Key.NUM_SORT;
                });
            });
        } else {
            var thisObj = this;
            var reSort = null;
            var z = 0;
            thisObj.formDataTemp[i].FormGroups.forEach(function (formGroup, j) {
                reSort = formGroup.ViewModel.columns.sortBy(function (s) {
                    return (s.width == 0) ? s.index = 99 : s.index;
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
                    //add button disable by col_cd // choijinyoung
                    if (checkAppendAddBtn(sortedItem)) {
                        sortedItem.disableAdd = true;
                    }
                    //add button disable by col_cd // choijinyoung
                })
                z = 0;
                reSort = thisObj.formDataTemp[i].FormGroups[j].ViewModel.columns.sortBy(function (s) { return s.cursorIndex; });

                if (!['SU721'].contains(thisObj.FORM_TYPE)) {
                    reSort.forEach(function (sortedItem) {
                        if (sortedItem.cursorIndex != 0) {
                            z++;
                            thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).TAB_INDEX = z;
                            thisObj.formDataTemp[i].FormGroups[j].ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).cursorIndex = z;
                        }
                    })
                };
                if (thisObj.removeAddMovingFormType.contains(thisObj.FORM_TYPE)) {
                    formGroup.ViewModel.columns.forEach(function (s) {
                        s.disableAdd = true;
                    });
                }
                if (thisObj.removeAllModFormType.contains(thisObj.FORM_TYPE)) {
                    formGroup.ViewModel.columns.forEach(function (s) {
                        s.disableAllMod = true;
                    });
                }
                if (thisObj.removeAddModFormType.contains(thisObj.FORM_TYPE)) {
                    formGroup.ViewModel.columns.forEach(function (s) {
                        s.disableAdd = true;
                    });
                }
                if (thisObj.removeAddFormType.contains(thisObj.FORM_TYPE)) {
                    formGroup.ViewModel.columns.forEach(function (s) {
                        s.disableAdd = true;
                    });
                }
                if (thisObj.isTopMultiTab) {
                    formGroup.ViewModel.columns.forEach(function (s) {
                        if (!thisObj.addMultiFormType.contains(thisObj.FORM_TYPE)) {
                            s.disableAdd = true;
                        }
                    });
                }

                if (thisObj.isAreaTop(i)) {
                    formGroup.ViewModel.columns.forEach(function (s) {
                        //remove Hide Button // tuan
                        if (checkRemoveDelBtn(s)) {
                            s.disableDel = true;
                        }
                    });
                }

            });
        }
    },

    //Restore default 기본값 복원
    getRestoreForm: function () {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;

        if (permit != "W" && thisObj.isDetailPermit == false) {
            //MSG00141
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
        } else {
            this.setShowProgressbar();
            //Restore ZA 기본값 복원
            var restoreLists = new Array();
            thisObj.formDataTemp.forEach(function (formData, i) {
                thisObj.formDataTemp[i].FormGroups.forEach(function (formType, j) {
                    restoreLists.push({ FORM_TYPE: formType.FormOutSet.Key.FORM_TYPE, FORM_SEQ: 99 });
                });
            });

            //vuthien remove last index of restoreLists if = 3
            if (["SI420", "SI440"].contains(this.FORM_TYPE) && restoreLists.length == 3) {
                for (var i = restoreLists.length - 1; i >= 0; i--) {
                    if (restoreLists[i].FORM_TYPE == this.FORM_TYPE) {
                        restoreLists.splice(i, 1);
                        break;
                    }
                }
            }

            ecount.common.api({
                url: "/Common/Form/GetListFormTemplate",
                data: Object.toJSON(restoreLists),
                success: function (result) {
                    thisObj.setHideProgressbar();
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {

                        if (thisObj.isTopMultiTab) {
                            for (i = 0; i < result.Data.length; i++) {
                                if (result.Data[i].FormGroups[0].FormSet.VIEW_TYPE == "U" && i == thisObj.formTopTabIndex) {
                                    thisObj.formDataTemp[0].FormGroups[i] = Object.clone(result.Data[i].FormGroups[0], true);
                                    thisObj.formAllDataTemp[0].FormGroups[i] = Object.clone(result.Data[i].FormGroups[0], true);
                                }
                                else if (result.Data[i].FormGroups[0].FormSet.VIEW_TYPE == "I") {
                                    thisObj.formDataTemp[1].FormGroups[0] = Object.clone(result.Data[i].FormGroups[0], true);
                                    thisObj.formAllDataTemp[1].FormGroups[0] = Object.clone(result.Data[i].FormGroups[0], true);
                                }
                            }
                        } else {
                            thisObj.formDataTemp = Object.clone(result.Data, true);
                            thisObj.formAllDataTemp = Object.clone(result.Data, true);
                        }

                        // 부서,프로젝트 관리안함 체크
                        if (ecount.config.company.USE_DEPT == "N" || ecount.config.company.USE_PJT == "N" || ecount.config.company.USE_ACCT_DETAILS == "0") {
                            thisObj.formDataTemp.forEach(function (data, i) {
                                data.FormGroups.forEach(function (FormGroup, i) {
                                    var bannedCol = FormGroup.ViewModel.columns.where(function (item, i) {
                                        return (item.id == "site_cd" && ecount.config.company.USE_DEPT == "N")
                                            || (item.id == "pjt_cd" && ecount.config.company.USE_PJT == "N")
                                            || (item.id == "taxInvoiceDetail" && ecount.config.company.USE_ACCT_DETAILS == "0")
                                    });

                                    if (bannedCol.length > 0) {
                                        bannedCol.forEach(function (item, i) { item.width = 0 });
                                    }
                                })
                            });
                        }

                        else if (thisObj.FORM_TYPE == "GU111") {
                            {
                                thisObj.formDataTemp.forEach(function (data, i) {
                                    data.FormGroups.forEach(function (FormGroup, i) {
                                        var bannedCol = FormGroup.ViewModel.columns.where(function (item, i) {
                                            return (item.id == "site_cd")
                                                || (item.id == "pjt_cd")
                                        });

                                        if (bannedCol.length > 0) {
                                            bannedCol.forEach(function (item, i) { item.width = 0 });
                                        }
                                    })
                                });
                            }
                        }

                        if (!thisObj.removeAddMovingFormType.contains(thisObj.FORM_TYPE)) {
                            for (var i = 0; i < thisObj.formDataTemp.length; i++) {
                                thisObj.setColumnExceptWidthZero(i);
                            }
                        }
                        if (thisObj.FORM_TYPE == "AU350" || thisObj.FORM_TYPE == "AU360" || thisObj.FORM_TYPE == "AU370" || thisObj.FORM_TYPE == "AU380"
                            || thisObj.FORM_TYPE == "AU390" || thisObj.FORM_TYPE == "AU400" || thisObj.FORM_TYPE == "AU430" || thisObj.FORM_TYPE == "AU420"
                            || thisObj.FORM_TYPE == "AU440" || thisObj.FORM_TYPE == "AU450" || thisObj.FORM_TYPE == "AU460" || thisObj.FORM_TYPE == "AU470"
                            || thisObj.FORM_TYPE == "AU480" || thisObj.FORM_TYPE == "AU490" || thisObj.FORM_TYPE == "AU500" || thisObj.FORM_TYPE == "AU850"
                            || thisObj.FORM_TYPE == "AU510" || thisObj.FORM_TYPE == "AU520" || thisObj.FORM_TYPE == "AU760" || thisObj.FORM_TYPE == "AU761"
                            || thisObj.FORM_TYPE == "AU762" || thisObj.FORM_TYPE == "AU763" || thisObj.FORM_TYPE == "AU764") {
                            for (var i = 0; i < thisObj.formDataTemp.length; i++) {
                                thisObj.setColumnExceptWidthZero(i);
                            }
                        }
                        if (thisObj.isExistTop) {
                            var formInfo = thisObj.formAllDataTemp[0].FormGroups[thisObj.formTopTabIndex];
                            if (thisObj.isTopMultiTab) {
                                thisObj.setMoveTableReset(thisObj._createInitWidgetData(formInfo.FormSet.Key.FORM_TYPE, formInfo.FormColumns));
                            } else {
                                //20200626 단설정2.0
                                thisObj._changeColType(thisObj.formAllDataTemp[0].FormGroups[0].ViewModel.colType, true);
                                thisObj.setMoveTableReset(thisObj._createInitWidgetData(null, formInfo.FormColumns));
                            }
                        }
                        thisObj.setResetWedgets();
                        thisObj.setHybridGrid();

                        if (thisObj.FORM_TYPE == "GU121") {
                            thisObj.setDefaultAndReplyContent();
                        }
                    }
                }
            });
        }
    },

    //is top 상단인지
    isAreaTop: function (idx) {

        if (idx == null)
            return ((this.formDataTemp[0].FormGroups[0].FormSet.VIEW_TYPE == "U") ? true : false);
        else
            return ((this.formDataTemp[idx].FormGroups[0].FormSet.VIEW_TYPE == "U") ? true : false);
    },

    //knh #13
    onDragErrorHandler: function (event) {
        if (event._isErrorMessage) {
            ecount.alert(ecount.resource.MSG04357);
        }
    },

    //reload
    reload: function () {
        var param = {
            FORM_TYPE: this.FORM_TYPE,
            isReload: true,
        }
        this.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_06", param);
    },

    //역참조체크
    checkFormulaCircularReference: function (codeList, sqlList, FType) {
        var checkGroup = [];
        // 순환참조 대상값 체크
        for (var i = 0, lng = sqlList.length; i < lng; i++) {
            for (var j = 0, lngJ = codeList.length; j < lngJ; j++) {
                if (sqlList[i].match(codeList[j]) != null) {
                    checkGroup.push(codeList[i] + "-" + codeList[j]);
                }
            }
        }
        if (this.setFormulaCodeSwitch(checkGroup, codeList)) {
            return this.checkFormulaCodeCirculation(codeList, sqlList);
        }
        else {
            return false;
        }
    },
    setFormulaCodeSwitch: function (checkGroup, codeList) {
        var _self = this;
        for (var i = 0, lng = checkGroup.length; i < lng; i++) {
            var tempCode = checkGroup[i].split("-");
            for (var j = 0; j < lng; j++) {
                var tempCode2 = checkGroup[j].split("-");
                if (tempCode[0] == tempCode2[1] && tempCode[1] == tempCode2[0]) {
                    _self.circularReferenceItem.push(tempCode[0]);
                    _self.circularReferenceItem.push(tempCode[1]);
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
                        _self.circularReferenceItem.push(checkData);
                        _self.circularReferenceItem.push(changeData);
                        return false;
                    }
                }
            }
        }
        return true;
    },
    //순환참조체크
    checkFormulaCodeCirculation: function (codeList, sqlList) {
        var listCount = 0;
        var list = [];
        var calcItems = [];
        var loop = 0;
        var whileLoop = false;
        var calcResut = true;
        var _self = this;
        for (var calcI = 0, calcILng = this.formDataTemp.length; calcI < calcILng; calcI++) {
            for (var calcJ = 0, calcJLng = this.formDataTemp[calcI].FormGroups[0].FormColumns.length; calcJ < calcJLng; calcJ++) {
                var item = this.formDataTemp[calcI].FormGroups[0].FormColumns[calcJ];
                if (item.DEFAULT_SET_SHOW_TYPE == "C" || item.DEFAULT_SET_SHOW_TYPE == "A") {
                    calcItems.push({ COL_CD: item.COL_CD, IS_CALC: codeList.any(function (x) { return x == item.COL_CD; }), SHOW_TYPE: item.DEFAULT_SET_SHOW_TYPE, INC: [] });
                    for (var i = 0; i < sqlList.length; i++) {
                        if (sqlList[i].match(item.COL_CD)) {
                            calcItems[loop].INC.push(codeList[i]);
                        }
                    }
                    loop++;
                }
            }
        }

        //트리 모델 변환 메서드
        var getTreeModel = function (_list, _rootId) {
            //최종적인 트리 데이터
            var _treeModel = [];

            //재귀 호출
            function getParentNode(_children, item) {
                //전체 리스트를 탐색
                for (var i = 0, child; child = _children[i]; i++) {
                    //부모를 찾았으면,
                    if (child.id === item.parentId) {
                        var view = { "id": item.id, "children": [] };
                        //현재 요소를 추가하고
                        child.children.push(view);
                        if (_treeModel[0].id != item.id) {
                            var ccilItem = calcItems.where(function (calc) { return calc.COL_CD == item.id; });
                            ccilItem.forEach(function (cc, ii) {
                                cc.INC.forEach(function (inc, jj) {
                                    if (_treeModel[0].id == inc) {
                                        _self.circularReferenceItem.push(_treeModel[0].id || "");
                                        _self.circularReferenceItem.push(cc.COL_CD || "");
                                        _list = [];
                                        listCount = 0;
                                        whileLoop = false;
                                        calcResut = false;
                                        return;
                                    } else {
                                        _list.push({ "parentId": item.id, "id": inc });
                                    }
                                });
                            });
                        } else {
                            _list = [];
                            listCount = 0;
                            whileLoop = false;
                            calcResut = false;
                            return;
                        }
                        //데이터상에서는 삭제
                        _list.splice(_list.indexOf(item), 1);
                        listCount = _list.length;
                        break;
                    }
                        //부모가 아니면,
                    else {
                        if (child.children.length) {
                            getParentNode(child.children, item);
                        }
                    }
                }
            }
            //트리 변환 여부 + 무한 루프 방지
            while (whileLoop == true && listCount > 0) {
                //전체 리스트를 탐색
                for (var i = 0, item; item = _list[i]; i++) {
                    //최상위 객체면,
                    if (item.parentId === _rootId) {
                        var view = { "id": item.id, "children": [] };
                        //현재 요소를 추가하고,
                        _treeModel.push(view);
                        var ccilItem = calcItems.where(function (calc) { return calc.COL_CD == item.id; });
                        ccilItem.forEach(function (cc, ii) {
                            cc.INC.forEach(function (inc, jj) {
                                if (_treeModel[0].id == inc) {
                                    _self.circularReferenceItem.push(_treeModel[0].id || "");
                                    _self.circularReferenceItem.push(cc.COL_CD || "");
                                    _list = [];
                                    listCount = 0;
                                    whileLoop = false;
                                    calcResut = false;
                                    return;
                                } else {
                                    _list.push({ "parentId": item.id, "id": inc });
                                }
                            });
                        });

                        //데이터상에서는 삭제
                        _list.splice(i, 1);
                        listCount = _list.length;
                        break;
                    }
                    //하위 객체면,
                    else {
                        getParentNode(_treeModel, item);
                    }
                }
            }
            return calcResut;
        };

        var changeLoop = calcItems.where(function (temp) { return temp.SHOW_TYPE != "C" && temp.IS_CALC == true; });
        if (changeLoop.length > 0) {
            for (var i = 0; i < calcItems.length; i++) {
                whileLoop = false;
                list.push({ "parentId": "root", "id": calcItems[i].COL_CD });
                listCount = list.length;
                if (listCount > 0) {
                    whileLoop = true;

                    //트리 모델로 변환        
                    if (getTreeModel(list, 'root') == false) {
                        return false;
                        break;
                    }
                }
            }
        }
        return true;
    },
    //계산식 메세지
    messageFormulaCodeCirculation: function () {
        var isAmt = this.circularReferenceItem.any(function (col) { return ["supply_amt", "vat_amt"].contains(col); });
        var isSubAmt = this.circularReferenceItem.any(function (col) { return ["p_amt1", "p_amt2"].contains(col); });
        if (isAmt && isSubAmt) {
            return ecount.resource.MSG06879;
        } else if (!isAmt && isSubAmt) {
            return ecount.resource.MSG06880;
        } else {
            return ecount.resource.MSG06879;
        }
        this.circularReferenceItem = [];
    },

    _changeColType: function (newColType, isSetSelectBox) {
        var topForm = this.contents.getFormById("topForm");
        //var topForm = this.contents.getForm();
        topForm.setColSize(newColType);
        this._RowInCellCount = newColType * 2;
        this.setMoveSetting(topForm, true);

        if (isSetSelectBox) {
			//if (this.FORM_TYPE != 'SI760') {
			if (this.isExistTop && !this.isTopMultiTab) {
                this.contents.getControl("colType").setValue(newColType);
            }
        }
    }


});
