window.__define_resource && __define_resource("BTN00113","BTN00351","BTN00008","LBL08556","BTN00603","BTN00007","LBL04306","LBL03017","LBL03004","LBL80099","LBL00976","LBL01234","LBL03289","LBL03290","LBL03291","LBL07243","LBL00402","LBL16387","LBL16386","LBL06642","LBL08254","LBL02985","BTN00291","BTN00169","BTN00255","LBL01587","MSG03839","LBL04173","BTN00069","BTN00043","LBL14188","LBL14189","BTN00816","BTN00817","BTN00096","LBL02072","LBL02931","MSG04121","MSG00141","MSG04479","LBL00914","LBL18820","BTN00315","LBL93736","LBL00731","LBL08396","LBL09077","LBL08831","LBL07880","LBL02025","LBL02538","LBL01250","LBL01523","LBL01387","LBL15087","LBL01448","LBL01185","LBL01701","LBL01704","LBL04298","LBL05716","LBL10923","LBL10932","LBL07247","LBL03755","LBL01450","LBL03589","LBL07879","MSG00456","LBL02987","LBL02390","MSG00962","MSG06097","MSG04738","MSG01758","MSG05900","MSG09852");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 품목검색 팝업 
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 [2015-08-27] 강성훈 : 키워드 검색 후 데이터가 존재 하지 않으면 검색 영역 보이도록 수정
                 [2016-05-16] 최용환 : 품목코드 검색시 이벤트별 카운트 누적
                 [2016-05-27] 최용환 : 품목코드 검색시 이벤트별 카운트 누적 관련 로직 제거
                 [2016-10-28] 최용환 : 오픈마켓 > 상품관리 > 상품재고입력,조회 검색창 품목코드 검색시 플래그값 추가
                 [2017.02.23] (Thien.Nguyen)Change all in one 2 menu to new FW
                 [2017.06.23] 이현우 : 거래관리시스템 작업을 위한 CS_FLAG 추가
                 [2018.09.05] 류상민 : 품목검색 재고 검색 분리
                 [2018.09.20] 류상민 : 재고 소팅 추가
                 2018.12.27 (HoangLinh): Remove $el
                 [2019.01.28] bsy    : 주품목 관련 리소스변경 , 연결품목 신규 등록 여부 추가 
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.28 [DucThai]  A18_04098 - CS 공유 품목 리스트 별도 제공
                 2019.11.20 정준호 - 검색창팝업 시 api 호출 불필요하여 api안타도록 수정
                 2020.02.05 (Nguyen Duc Thinh) : A20_00238 - 재고전표 입력 시 F9 단축키 클릭 시 품목검색(재고수량) 팝업 변경                 
                 2020.02.10 유형준 - A20_00080_단가기준정립 2차 품목정보 조회시 거래유형 파라미터 전달
                 2020.03.12 (신선미) : A20_00950 - F9 200건 이하인 경우만 재고수량
                 2020.03.25 (이은총) : A20_01245 품목검색창 [200건이상조회] -> [1,000건이상조회]로 변경
                 2020.03.06 (PhiVo): A20_00121 - change logic my item
                 2020.04.08 (PhiVo): fix up30 40038
                 2020.04.13 박종국 : A20_00879_최종단가 성능개선 2차 => 사용빈도 초기화 제거
                 2020.07.07 (정우용) - [A20_02620] 조건하에 그리드 체크박스 체크 API 강제 비활성화
                 2020.08.11 (신선미) - A20_03840 품목체크했을때 퀵서치 param 넘어가지 않도록 수정
                 2020.10.14 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정
                 2020.10.22 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정_회계1
                 2020.11.10 (Hao) - Recal Calc for SIZE_DES
                 2020.12.15 (김대원) - A20_06470 - 품목그룹1~3 3.0적용
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "ES020P", {
    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체)
    **********************************************************************/

    isFirstClick: false,
    rowAddCnt: 0,
    boardFlag: "N",
    trialOverflowFlag: "N",
    height: 644,
    chkflag: false,
    _moreCount: 1000,		// 천건이상버튼
    _totalCount: 0,
    isMoreFlag: false,    //"천건이상" 버튼 클릭 여부
    barCode: "N",
    barCode2: "N",

    parentLoadData: "",
    myProdFlag: false,

    //입력화면에 내려줄 데이터 기초
    ParentDataM: null,
    //입력화면에 내려줄 데이터
    ParentData: null,

    //검색된 상태여부
    isSearched: false,
    isSpecGroupAdd: false,
    isSorted: false,
    _IsF9: "",
    isNotSaveSerial: false,
    /**********************************************************************
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.searchFormParameter = {
            IO_TYPE: this.IoType
            , POS: this.rowKey
            , FORM_SEQ: this.FORM_SER_SEQ
            , CLASS_TYPE: "9"
            , PROD_SEARCH: "5"
            , PARAM: this.keyword
            , SIMPLE_SEARCH_PARAM: ""
            , SORT_COLUMN: "PROD_CD ASC"
            , SORT_TYPE: "A"
            , PAGE_SIZE: this.viewBag.FormInfos.SP900 && this.viewBag.FormInfos.SP900.option && this.viewBag.FormInfos.SP900.option.pageSize || "12"
            , SFLAG: "N"
            , REQ_TYPE: "0"
            , DEL_GUBUN: "N"
            , BARCODE2: this.BGubun2
            , LAN_TYPE: "ko-KR"
            , BARCODE_SEARCH: this.barcodechk || "N"
            , PAGE_CURRENT: 0
            , WH_CD: this.WHCD || ""
            , CUST: this.Cust || ""
            , MAIN_YN: this.MAIN_YN || "N"
            , IS_RELATION_NEW: this.isRelationNew || "N"
            , MAIN_PROD_CD: this.mainProdCd || ""
            , MAIN_PROD_TYPE: this.mainProdType || ""
            , ADD_COLUMN: this.AddColumn
            , WH_CD_T: this.WHCDT || ""
            , SEARCH_GB: ""
            , PROD_CD2: ""
            , PROD_DES: ""
            , SIZE_DES: ""
            , UNIT: ""
            , BAR_CODE: ""
            , CLASS_CD: ""
            , CLASS_CD2: ""
            , CLASS_CD3: ""
            , REMARKS_WIN: ""
            , MAIN_PROD_CD: ""
            , MAIN_PROD_DES: ""
            , CONT1: ""
            , CONT2: ""
            , CONT3: ""
            , CONT4: ""
            , CONT5: ""
            , CONT6: ""
            , NOW_DATE: this.viewBag.LocalTime
            , SeachType: "B"
            , NEWITEM: ""
            , SERIAL_DATE: this.SerialTime
            , SERIAL_FLAG: (this.SerialFlag || "N")
            , STOCK_SORT: 'N'
            , STOCK_SORT_COL: ''
            , INCLUDE_STOCK_YN: 'N'
            , INCLUDE_STOCK_BUTTON_VISIBLE: 'Y'
            , isOpenMarketProd: this.isOpenMarketProd ? true : false
            , OPEN_SEARCH_YN: "Y"
            , OEM_MODEL_PROD: this.OEM_MODEL_PROD
            , MULTI_SIZE_PROD: this.MULTI_SIZE_PROD
            , MENU_SEQ: this.MENU_SEQ || 0
            , IS_LIMIT: true
            , ID: this.ID || ""
            , IsCallCSAPI: this.IsCallCSAPI || false
            , IsF9: this.eventTarget            
            , IO_CODE: this.IO_CODE
            , INCLUDE_STOCK_SEARCH_FLAG: 'N' // 품목 조회시 재고포함 조회(천건이하의 경우)
            , IS_FROM_MS: this.IS_FROM_MS
        };

        this.barCode = this.BGubun;
        this.barCode2 = this.BGubun2;
        this._IsF9 = this.eventTarget;
        this.registerDependencies("inventorylib.common"); 
        if (this.IsCallCSAPI) {
            this.searchFormParameter.CS_PROD_TYPE = this.CS_PROD_TYPE;
            this.searchFormParameter.CS_PROD_RANGE = this.CS_PROD_RANGE;
            this.searchFormParameter.CS_SHARED_CHK = this.CS_SHARED_CHK;
            this.searchFormParameter.CS_PRC_LEVEL_CHK = this.CS_PRC_LEVEL_CHK;
            this.searchFormParameter.CS_ITEM_LEVEL_GROUP_CHK_YN = this.CS_ITEM_LEVEL_GROUP_CHK_YN;
            this.searchFormParameter.ALL_MN_GROUPCD = this.ALL_MN_GROUPCD;
        }
        if (this._IsF9 == "keyDown") {
            this.searchFormParameter.INCLUDE_STOCK_SEARCH_FLAG = 'Y';
        }
        this.isNotSaveSerial = this.IsNotSaveSerial;
    },

    initProperties: function () {
        this.ParentDataM = {
            PROD_CD: "",
            PROD_CD_FOCUS: "",
            PROD_DES: "",
            PROD_DES_FOCUS: "",
            QTY: "",
            isQtyChange: false,
            QTY_READONLY: "",
            QTY_FOCUS: "",
            UQTY: "",
            isUqtyChange: false,
            UQTY_FOCUS: "",
            SIZE_DES: "",
            TAX: "",
            PROD_TAX: "",
            PROD_TAX_YN: "",
            PRICE: "",
            PRICE_VAT_INCLUDE: new Decimal(0),
            EXCH_RATE: "",
            SIZE_FLAG: "",
            BAL_FLAG: "",
            OLD_PROD_CD: "",
            OLD_PROD_DES: "",
            SERIAL_CLASS: "",
            T_QTY: "",
            BOM_DES: "",
            BOM_NO: "",
            HFBOMDESDEFAULT: "",
            HFBOMNODEFAULT: "",
            UNIT: "",
            CUST: "",
            CUST_FOCUS: "",
            CUST_DES: "",
            ITEM_TYPE: "",
            ITEM_CD: "",
            ITEM_DES: "",
            ITEM_DES_READONLY: "",
            SERIALNO: "",
            SERIAL_TYPE: "",
            SERIAL_CD_CSS: "",
            SERIAL_CD_FOCUS: "",
            CHKWARE_CHECKED: "",
            WARE_FLAG_CHECKED: "",
            QC_YN: "",
            QC_BUY_TYPE: "",
            ACCTSUBPROD: "",
            ACCTSUBSIZE: "",
            ACCTSUBBIGO: "",
            TIME_DATE: "",
            TIME_DATE_COLOR: "",
            WH_CD_FOCUS: "",
            BARCODEADD: false,
            INPUTFOCUS: "",
            rowKey: "",
            rowIdx: "",
            ApplyGubun: false,
            oldrowKey: "",
            totalItemCnt: 0,
            ItemCnt: 0,
            OPEN_SEARCH_YN: "Y",
            SERIAL_FLAG: ""
        };
        this.ParentData = {
        };
    },

    render: function (renderData) {


        if (this.unUseAutoResize != true) {
            this.setLayout(this.viewBag.FormInfos.SP900);
        }
        this._super.render.apply(this);


    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
    **********************************************************************/
    //Header Setting
    onInitHeader: function (header, resource) {

        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
            toolbar2 = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        // 사용빈도 양식 컬럼 사용 여부 확인
        //var useCntCheck = false;
        //if (this.viewBag.FormInfos.SP900 && this.viewBag.FormInfos.SP900.columns && this.viewBag.FormInfos.SP900.columns.length > 0) {
        //    for (var i = 0; i < this.viewBag.FormInfos.SP900.columns.length; i++) {
        //        if (this.viewBag.FormInfos.SP900.columns[i].name == "LP.USE_CNT") {
        //            useCntCheck = true
        //        }
        //    }
        //}

        toolbar
            .setOptions({ css: "btn btn-default btn-sm" })
        //    .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113));

        //if (this.isIncludeInactive) {
        //    toolbar.addLeft(ctrl.define("widget.button", "btnUsestop").label(ecount.resource.BTN00351));
        //}
        //toolbar.addLeft(ctrl.define("widget.button", "closeForm").label(ecount.resource.BTN00008));

        //form1.add(ctrl.define("widget.searchGroup", "search1", "search1", ecount.resource.LBL08556).setOptions({
        //    label: ecount.resource.BTN00113,  //검색
        //    status: this.isIncludeInactive ? [{ value: 'Y', label: ecount.resource.BTN00351 }, { value: 'N', label: ecount.resource.BTN00603 }] : null //N:사용중단미포함, Y:사용중단포함
        //}).end());
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        form1.add(
            ctrl.define("widget.input.search", "search1", "search1", ecount.resource.LBL08556).end()
        );

        cont1 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0101");
        cont1 = cont1 == '' ? ecount.resource.LBL04306 + "1" : cont1;
        cont2 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0102");
        cont2 = cont2 == '' ? ecount.resource.LBL04306 + "2" : cont2;
        cont3 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0103");
        cont3 = cont3 == '' ? ecount.resource.LBL04306 + "3" : cont3;
        cont4 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0104");
        cont4 = cont4 == '' ? ecount.resource.LBL04306 + "4" : cont4;
        cont5 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0105");
        cont5 = cont5 == '' ? ecount.resource.LBL04306 + "5" : cont5;
        cont6 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0106");
        cont6 = cont6 == '' ? ecount.resource.LBL04306 + "6" : cont6;
        form2
            .add(ctrl.define("widget.input.search", "SProdCd", "PROD_CD2", ecount.resource.LBL03017).end())
            .add(ctrl.define("widget.input.search", "SProdDes", "PROD_DES", ecount.resource.LBL03004).end())
            .add(ctrl.define("widget.input.search", "SizeDes", "SIZE_DES", ecount.resource.LBL80099).end())
            .add(ctrl.define("widget.input.search", "unit", "UNIT", ecount.resource.LBL00976).end())
            .add(ctrl.define("widget.input.search", "BarCode", "BAR_CODE", ecount.resource.LBL01234).end())
            .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd1", "CLASS_CD", ecount.resource.LBL03289).end())
            .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd2", "CLASS_CD2", ecount.resource.LBL03290).end())
            .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd3", "CLASS_CD3", ecount.resource.LBL03291).end())
            .add(ctrl.define("widget.multiCode.prodLevelGroup", "txtTreeGroupCd", "PROD_LEVEL_GROUP", ecount.resource.LBL07243).end())
            .add(ctrl.define("widget.input.search", "RemarksWin", "REMARKS_WIN", ecount.resource.LBL00402).end());

        form2
            .add(ctrl.define("widget.input.search", "main_prod_cd", "MAIN_PROD_CD", ecount.resource.LBL16387).end())     // 주품목코드=>대표품목코드
            .add(ctrl.define("widget.input.search", "main_prod_des", "MAIN_PROD_DES", ecount.resource.LBL16386).end());   // 주품목명=>대표품목명


        form2
            .add(ctrl.define("widget.input.search", "Cont1", "CONT1", cont1).end())
            .add(ctrl.define("widget.input.search", "Cont2", "CONT2", cont2).end())
            .add(ctrl.define("widget.input.search", "Cont3", "CONT3", cont3).end())
            .add(ctrl.define("widget.input.search", "Cont4", "CONT4", cont4).end())
            .add(ctrl.define("widget.input.search", "Cont5", "CONT5", cont5).end())
            .add(ctrl.define("widget.input.search", "Cont6", "CONT6", cont6).end());

        tabContents
            .createActiveTab("quick", ecount.resource.LBL06642)
            .add(form1)
            .setOptions({
                showFormLayer: (!$.isEmpty(this.keyword) || (this.isOpenMarketProd && !$.isEmpty(this.viewBag.InitDatas.LoadData))) ? false : true
                //showFormLayer: (!$.isEmpty(this.viewBag.InitDatas.LoadData)) ? false : true
            })
            .createTab("advanced", ecount.resource.LBL08254)
            .add(form2);

        contents.add(tabContents).add(toolbar);
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL02985)
            .useQuickSearch()
            .add("search")  //type, button list

        header.add("option", [
            { id: "searchTemplate", label: ecount.resource.BTN00291 },
            { id: "listSetting", label: ecount.resource.BTN00169 }
        ], this.isFromCS === true);

        //if (useCntCheck && !$.isEmpty(this.Cust) && ["10", "20", "71", "72"].contains(this.IoType)) {
        //    header.add("option", [
        //        { id: "searchTemplate", label: ecount.resource.BTN00291 },
        //        { id: "listSetting", label: ecount.resource.BTN00169 },
        //        { id: "usecnt", label: ecount.resource.BTN00255 }
        //    ], this.isFromCS === true)
        //}
        //else {
        //    header.add("option", [
        //        { id: "searchTemplate", label: ecount.resource.BTN00291 },
        //        { id: "listSetting", label: ecount.resource.BTN00169 }
        //    ], this.isFromCS === true)
        //}

        header.addContents(contents);
    },

    //Contents Setting
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            settings = g.grid(),
            ctrl = g.control(),
            tabContents = g.tabContents();
        var thisObj = this;
        var keymode = ((this.viewBag.FormInfos.SP900.option.inputMethod == "K" && this.isNewDisplayFlag) || !this.isNewDisplayFlag) ? true : false;

        if (!$.isEmpty(this.keyword) || this.isOpenMarketProd) { // 상품재고입력,조회에서는 기본적으로 검색된 값을 보여줌
            settings.setRowData(this.viewBag.InitDatas.LoadData)
        }
        settings
            .setRowDataUrl(this.isFromCS === true || this.IsCallCSAPI === true ? "/Inventory/Basic/GetListProdForSearchCs" : "/Inventory/Basic/GetListProdForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({
                FormType: "SP900",// 양식구분            
                FormSeq: this.FORM_SER_SEQ,// 양식순번,
                ExtendedCondition: {}
            })
            .setKeyColumn(['PROD_CD', 'PROD_DES'])
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true, ['sale003.prod_cd', 'sale003.prod_des', 'sale003.prod_size', 'sale003_sub.prod_des'])
            .setColumnSortable(true)                                                        // 그리드 타이틀 정렬 조건 설정          
            .setEventUseAfterRowDataLoadForInitialData(true)
            .setColumnSortExecuting(function (e, data) {

                if (thisObj.searchFormParameter.IS_LIMIT == true) {
                    thisObj.contents.getGrid().grid.toSort(data.sortOrder, data.columnId, null, null, true, false, false);

                    var rows = thisObj.contents.getGrid().grid.getRowList(ecount.grid.constValue.sectionType.thead, null, {});
                    thisObj.contents.getGrid().grid.refreshCell(ecount.grid.constValue.sectionType.thead, data.columnId, rows[0][ecount.grid.constValue.keyColumnPropertyName]);

                }
                else {

                    //그리드 타이틀 정렬 조건 클릭 이벤트
                    if (data.sortOrder == "D")
                        thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + " DESC";
                    else
                        thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + " ASC";
                    thisObj.searchFormParameter.SORT_TYPE = data.sortOrder;
                    thisObj.searchFormParameter.SeachType = "H";
                    
                    //소팅으로 검색할 경우
                    if (data.columnId == "STOCKS.BAL_QTY" || data.columnId == "STOCKS.WH_F_QTY" || data.columnId == "STOCKS.WH_T_QTY") {
                        thisObj.searchFormParameter.STOCK_SORT = 'Y';
                        thisObj.searchFormParameter.STOCK_SORT_COL = thisObj.searchFormParameter.SORT_COLUMN;
                        thisObj.searchFormParameter.INCLUDE_STOCK_YN = 'Y';

                        var grid = thisObj.contents.getGrid().grid;
                        grid.settings().setColumns([
                            { id: 'STOCKS.BAL_QTY', isHideColumn: false },
                            { id: 'STOCKS.WH_F_QTY', isHideColumn: false },
                            { id: 'STOCKS.WH_T_QTY', isHideColumn: false }
                        ]);
                    } else {
                        thisObj.searchFormParameter.STOCK_SORT = 'N';
                    }
                    thisObj.isSorted = true;
                    thisObj.contents.getGrid().draw(thisObj.searchFormParameter);
                }




            })
            .setColumnSortDisableList(['sale003.com_code', 'sale003_img.prod_img'])
            .setCheckBoxUse((this.isCheckBoxDisplayFlag) ? true : false)
            .setCheckBoxCallback({                                                          //체크 박스 클릭시 발생 하는 이벤트(입력 화면에서 필요)
                'change': function (e, data) {
                    this.setGridCheckBox(data);
                }.bind(this)
            })
            .setCheckBoxHeaderStyle({
                'title': keymode == true ? '' : ecount.resource.LBL01587,
                'visible': keymode,
                'width': 35
            })


            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxRememberChecked(true)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e));
            })
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingIndexChanging(function (e, data) {
                thisObj.searchFormParameter.PAGE_CURRENT = data.pageIndex;
                if (thisObj.searchFormParameter.STOCK_SORT == 'Y') {
                    //파라미터 초기화
                    thisObj.searchFormParameter.SeachType = "B";
                    thisObj.searchFormParameter.SORT_COLUMN = 'PROD_CD ASC';
                    thisObj.searchFormParameter.SORT_TYPE = 'A';

                    var grid = thisObj.contents.getGrid();
                    grid.settings.setColumns([
                        { id: 'STOCKS.BAL_QTY', isHideColumn: true },
                        { id: 'STOCKS.WH_F_QTY', isHideColumn: true },
                        { id: 'STOCKS.WH_T_QTY', isHideColumn: true }
                    ]);

                    grid.draw(thisObj.searchFormParameter);
                }

            })
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.DEL_GUBUN && rowItem.DEL_GUBUN.toUpperCase() == "Y")
                    return true;
                else
                    return false;
            }, 'danger')
            .setCustomRowCell('sale003.prod_cd', this.setGridDateLink.bind(this))           // 품목코드
            .setCustomRowCell('sale003.prod_size', this.setGridDateLink.bind(this))           // 품목코드
            .setCustomRowCell('sale003.prod_des', this.setGridDateLink.bind(this))          // 품목명
            .setCustomRowCell('sale003_sub.prod_des', this.setGridDateLink.bind(this))      // 품목코드
            .setCustomRowCell('sale003.com_code', this.setGridDateChk.bind(this))           // 파일관리
            .setCustomRowCell('sale003_img.prod_img', this.setGridDateImage.bind(this))     // 이미지
            .setCustomRowCell('sale003.detail', this.setGridDatedetail.bind(this))          // 상세내역

            .setCustomRowCell('SALE003.serial_type', this.setGridDateType.bind(this))
            .setCustomRowCell('SALE003.item_type', this.setGridDateType.bind(this))
            .setCustomRowCell('SALE003.prod_sell_type', this.setGridDateType2.bind(this))
            .setCustomRowCell('SALE003.prod_whmove_type', this.setGridDateType.bind(this))
            .setCustomRowCell('SALE003.qc_buy_type', this.setGridDateType2.bind(this))
            .setCustomRowCell('SALE003.qc_yn', this.setGridDateType2.bind(this))
            .setCustomRowCell('sale003.size_chk', this.setGridDatesize_chk.bind(this))      // 규격 

        if (this.MariaDb == 'Y') {
            settings
                .setCustomRowCell('sale003.prod_type', this.setGridDateProdtype.bind(this))
                .setCustomRowCell('sale003.set_flag', this.setGridDateSetFlag.bind(this))
                .setCustomRowCell('sale003.bal_flag', this.setGridDateBalFlag.bind(this))
                .setCustomRowCell('sale003.vat_yn', this.setGridDateVatYn.bind(this))
                .setCustomRowCell('SALE003_PRICE.VAT_RATE_BY_BASE_YN', this.setGridDatePRICEVATRATEBYBASEYN.bind(this))
                .setCustomRowCell('sale003.cs_flag', this.setGridDatecsflag.bind(this))
                .setCustomRowCell('sale003.inspect_status', this.setGridDateinspectstatus.bind(this))
                .setCustomRowCell('sale003.in_price_vat', this.setGridDateinpricevat.bind(this))
                .setCustomRowCell('sale003.out_price_vat', this.setGridDateoutpricevat.bind(this))
                .setCustomRowCell('sale003.out_price1_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price2_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price3_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price4_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price5_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price6_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price7_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price8_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price9_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003.out_price10_vat_yn', this.setGridDateoutpricevatyn.bind(this))

                .setCustomRowCell('sale003_user_price.out_price1_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price2_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price3_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price4_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price5_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price6_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price7_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price8_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price9_vat_yn', this.setGridDateoutpricevatyn.bind(this))
                .setCustomRowCell('sale003_user_price.out_price10_vat_yn', this.setGridDateoutpricevatyn.bind(this))


                .setCustomRowCell('#SALE003_SETUP.C0001', this.setGridDateC0001.bind(this))
                .setCustomRowCell('#SALE003_SETUP.C0003', this.setGridDateC0003.bind(this))
                .setCustomRowCell('LP.USE_CNT', this.setGridDateUseCnt.bind(this))
        }


        if (this.isNewDisplayFlag) {
            settings

                .setCustomRowCell('SALE003.in_price', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.special_price', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price1', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price2', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price3', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price4', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price5', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price6', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price7', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price8', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price9', this.setGridDatePrice.bind(this))
                .setCustomRowCell('SALE003.out_price10', this.setGridDatePrice.bind(this))
                .setCustomRowCell('LP.LAST_PRICE', this.setGridDatePrice.bind(this))
                .setCustomRowCell('LP.LAST_DEAL', this.setGridDateLastDetail.bind(this))
                .setCustomRowCell('WP', this.setGridDatePrice.bind(this))
                .setCustomRowCell('WPG', this.setGridDatePrice.bind(this))
                .setCustomRowCell('CP', this.setGridDatePrice.bind(this))
                .setCustomRowCell('CPG', this.setGridDatePrice.bind(this));
        }
        // 초기데이터 할당

        //마우스 모드일때만 그리드 멀티체크 사용하지않음
        if(!keymode){
            settings.setCheckBoxUseMultiCheck(false);
        }

        contents.add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },


    // Init Control
    onInitControl: function (cid, option) {

        switch (cid) {
            case "search":
                if (this.isIncludeInactive) {
                    option.addGroup([{ id: 'btnUsestop', label: ecount.resource.BTN00351 }])
                }
                break;
            default:
                break;
        }
    },

    setGridCheckBox: function (data) {
        if (this.isNewDisplayFlag && data.checked && !this.isBlockCheckboxSendMessage && this.viewBag.FormInfos.SP900.option.inputMethod != "K") {

            var param = {
                rowItem: data.rowItem,
                type: "check",
                callback: function (result) {
                    this.setInputSendMessage(result, "chk");
                }.bind(this)
            };

            this.setProdBasicInfo(param);

        }
    },

    setGridDateLastDetail: function () {
        var self = this;
        var option = {};

        if (!$.isNull(this.Cust) && !$.isEmpty(this.Cust) && ["10", "20", "71", "72"].contains(this.IoType)) {
            option.attrs = {
                'Class': 'fa fa-check text-primary'
            };
        }


        option.data = "";
        option.dataType = "1";
        option.controlType = (this.IsCallCSAPI === true ? "widget.label" : "widget.link");

        option.event = {
            'click': function (e, data) {
                var strKey = "";
                if (["71", "72"].contains(this.IoType)) {
                    strKey = "20ㆍ" + this.Cust + "ㆍ" + data.rowItem.PROD_CD;
                }
                else {
                    strKey = this.IoType + "ㆍ" + this.Cust + "ㆍ" + data.rowItem.PROD_CD;
                }

                var param = {
                    width: 380,
                    height: 500,
                    IO_TYPE: (["71", "72"].contains(this.IoType)) ? "20" : this.IoType,
                    CUST: this.Cust,
                    PROD_CD: data.rowItem.PROD_CD,
                    DECUQ: this.Parent.DecUq,
                    DECQ: this.Parent.DecQ,
                    DECP: this.Parent.DecP,
                    rowKey: data.rowItem[ecount.grid.constValue.keyColumnPropertyName],
                    hidSearchDatas: strKey,
                    hidPointDecSize: this.Parent.DecUq + "§" + this.Parent.DecQ + "§" + this.Parent.DecP + "§§"
                };

                this.openWindow({
                    url: '/ECERP/Popup.Common/ES017P_01',
                    name: ecount.resource.LBL04173,
                    param: param,
                    popupType: false,
                    additional: true
                });

                data.event.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // Footer Setting
    onInitFooter: function (footer, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();

        if (this.isApplyDisplayDoNotShow) {
            // 적용버튼 보여주지 않음.
        }
        else if (this.isApplyDisplayFlag || this.viewBag.FormInfos.SP900.option.inputMethod == "K") {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        }


        if (this.isNewDisplayFlag && this.isFromCS !== true && this.IsCallCSAPI !== true) {
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-default").label(ecount.resource.BTN00043));
        }

        if (this.isCheckBoxDisplayFlag && this.isFromCS !== true) {
            if ($.isNull(this.isProdRoot) && this.isFromFavoriteCode !== true) {
                toolbar.//addLeft(ctrl.define("widget.button", "myprod").css("btn btn-default").label(ecount.resource.LBL14188)); // 내품목
                    addLeft(ctrl.define("widget.button.group", "MyprodLoad").css("btn btn-default").label(ecount.resource.LBL14188).addGroup([{ id: "MyProd", label: ecount.resource.LBL14189 }]))
            }
        }
        if (this.IsShowStockButton) {
            toolbar.addLeft(ctrl.define("widget.button", "IncludeStockQty").label(ecount.resource.BTN00816).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "NotIncludeStockQty").label(ecount.resource.BTN00817).clickOnce().hide());
        }

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]))
        footer.add(toolbar);
    },


    /**********************************************************************
    * event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
    **********************************************************************/
    // 페이지 로드 완료 이벤트(Completion event page load)
    onLoadComplete: function (e) {
        var formdata = this.header.serialize();
        if (!$.isEmpty(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
            this.searchFormParameter.PARAM = this.keyword;
        }
        if (parseInt(ecount.config.groupware.MAX_USERS) > 0) {
            this.boardFlag = "Y";
            if (ecount.config.groupware.USE_STATUS == "1") {
                if (ecount.config.groupware.FREE_EXPIRE_DATE != "" && parseInt(this.LocalTimeyyyyMMdd) > parseInt(ecount.config.groupware.FREE_EXPIRE_DATE)) {
                    this.trialOverflowFlag = "Y";
                }
            }
        }

        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());

        var col = this.viewBag.FormInfos.SP900.columns;
        var searchFormLength = col.length;
        var noticeOn = false;
        if (searchFormLength > 0) {
            for (var i = 0; i < searchFormLength; i++) {
                if (col[i].id == "STOCK.WH_F_QTY" || col[i].id == "STOCK.BAL_QTY" || col[i].id == "STOCKS.WH_F_QTY" || col[i].id == "STOCKS.BAL_QTY")
                    noticeOn = true;
            }
            //[전체재고], [기본창고재고] 사용하는 코드만 공지사항 띄우기
            if (noticeOn && $.cookie("02441996") != "done") {
                var url = ecount.common.buildSessionUrl("/ECERP/SVC/EAM/EAM012M") + "&boardType=M&prgid=244&MenuType=0&seq=1996";
                //window.open(url, 244, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=800,height=600');
            }
        }


        if (!e.unfocus) {
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }

        if (this.isFromCS == true) {
            this.header.getTabContents().itemList[1].itemList[0].hideRow("txtTreeGroupCd");     // CS 품목검색 창에서는 품목계층그룹 안보이기로
        }

        // 품목관계등록시 대표품목 코드가 넘어왔으면
        if (this.mainProdCd) {
            this.searchFormParameter.MAIN_PROD_CD = this.mainProdCd;
        }
    },


    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.isSorted = false;
        //this.header.lastReset(this.searchFormParameter.PARAM);        
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.getSettings().setColumnSortable(true);


        grid.draw(this.searchFormParameter);

        this.header.toggle(true);
        this.isOnePopupClose = true;
    },

    onGridAfterFormLoad: function (e, data, gridObj) {

        if (data.columnForm.columns.length > 0) {
            data.columnForm.columns.forEach(function (item) {
                if (item.id == "LP.USE_CNT") {
                    item.dataType = "90";
                }
            });
        }

        if (this.IsShowStockButton) {
            if (this.searchFormParameter.STOCK_SORT == 'N') {
                gridObj.settings.setColumns([
                    { id: 'STOCKS.BAL_QTY', isHideColumn: true },
                    { id: 'STOCKS.WH_F_QTY', isHideColumn: true },
                    { id: 'STOCKS.WH_T_QTY', isHideColumn: true }
                ]);
            }

            //검색외 재고포함으로 검색하였을경우 체크
            this.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE = 'Y';

            //페이지 이동의 경우 버튼초기화
            var includeControl = this.footer.get(0).getControl("IncludeStockQty");
            var notIncludeControl = this.footer.get(0).getControl("NotIncludeStockQty");
            includeControl.show();
            notIncludeControl.hide();
            includeControl.setAllowClick();

        }
    },

    //1000건 이상 검색시에 정렬링크 없애기
    onGridAfterRowDataLoad: function (e, data, grid) {
        if (data.result && data.result.Data && data.result.Data.length > 0) {
            this._totalCount = data.result.Data[0].MAXCNT;
            if (this._moreCount <= this._totalCount && !this.isMoreFlag) {
                this.isMoreFlag = false;
                //data.result.Data[0].MAXCNT = this._moreCount - 1;
            }
            else
                this.isMoreFlag = true;
        }
        else
            this.isMoreFlag = true;

        if (!this.isSorted) {
            if (data.result.Data.length > 0 && data.result.Data[0].MAXCNT >= this._moreCount) {
                grid.settings.setColumnSortable(false);
            } else {
                grid.settings.setColumnSortable(true);
            }
        }
        this.generateButton();
        this.isSorted = false;
    },

    // 그리드 로드 완료 이벤트(Completion event Grid load)
    onGridRenderComplete: function (e, data, gridObj) {
        var grid = this.contents.getGrid().grid;
        var bal_val = grid.getColumnInfo('STOCKS.BAL_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.BAL_QTY').dataType;
        var wh_f_val = grid.getColumnInfo('STOCKS.WH_F_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.WH_F_QTY').dataType;
        var wh_t_val = grid.getColumnInfo('STOCKS.WH_T_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.WH_T_QTY').dataType;
        var whFValue = this.searchFormParameter.WH_CD,
            whTValue = this.searchFormParameter.WH_CD_T,
            isNotWhFromValue = false,
            isNotWhToValue = false;

        if ($.isEmpty(whFValue)) {
            isNotWhFromValue = true;
        }

        if ($.isEmpty(whTValue)) {
            isNotWhToValue = true;
        }

        if (this.IsShowStockButton && this.searchFormParameter.INCLUDE_STOCK_SEARCH_FLAG == 'Y' && this.isMoreFlag && this.searchFormParameter.IS_LIMIT && data.totalDataCount > 0) {
            if (bal_val != undefined) {
                grid.setColumnVisibility("STOCKS.BAL_QTY", true);
            }

            if (wh_f_val != undefined) {
                grid.setColumnVisibility("STOCKS.WH_F_QTY", true);
            }

            if (wh_t_val != undefined) {
                grid.setColumnVisibility("STOCKS.WH_T_QTY", true);
            }

            grid.setCellTransaction().start();

            data.dataRows.forEach(function (item, i) {
                grid.setCell("STOCKS.BAL_QTY", item["K-E-Y"], item.BAL_QTY || "0");
                grid.setCell("STOCKS.WH_F_QTY", item["K-E-Y"], isNotWhFromValue ? "" : (item.WH_QTY || "0"));
                grid.setCell("STOCKS.WH_T_QTY", item["K-E-Y"], isNotWhToValue ? "" : (item.WH_QTY_T || "0"));
            });
            grid.setCellTransaction().end();

            this.setIncludeStocks(false);
        }
        //재고포함으로 검색하였을 경우 동작
        if (this._moreCount < this._totalCount && !this.isMoreFlag) {
            this.searchFormParameter.INCLUDE_STOCK_SEARCH_FLAG = 'N';
        }
        else {
            if (this.IsShowStockButton && this.searchFormParameter.INCLUDE_STOCK_YN == 'Y') {
                if (this.searchFormParameter.STOCK_SORT == 'N') {
                    this.onFooterIncludeStockQty();
                } else {
                    this.searchFormParameter.INCLUDE_STOCK_YN = 'N';
                    this.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE = 'N';
                    this.setIncludeStocks(false);
                }
            }
        }
        this.isSearched = true;
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        //---------------------------------------
        // 데이터 조회결과에 따른 sendMessage처리
        //---------------------------------------
        var result = initSendMessage.call(this);
        // 부모창으로 값을 전달하지 않은 경우 기본기능 실행
        if (result == false) {
            if (!$.isEmpty(this.keyword)) {
                if (!e.unfocus && this.header.currentTabId == "quick") {
                    //this.header.getControl("search1").onFocus(0);
                    //this.header.getQuickSearchControl().setFocus(0);
                }
            }
            if (data.totalDataCount == 0) {
                //this.header.toggle();
            }
        }

        this.searchFormParameter.NEWITEM = "";

        //-----------------------------
        // util
        //-----------------------------
        // 검색된 결과에 따른 부모창으로의 값 자동전달
        function initSendMessage() {

            // 검색된 결과가 1건인 경우에만 부모창으로 값 전달
            if (data.totalDataCount == 1 && this.contents.getGrid().settings.getPagingCurrentPage() == 1 && this._IsF9 != "keyDown") {
                if (!this.isNewDisplayFlag) {
                    var obj = {};
                    var d = data.dataRows[0];

                    var message = {
                        name: "PROD_DES",
                        code: "PROD_CD",
                        data: d,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                    //this.sendMessage(this, message);
                    if (this.isReceiveDataAll) {
                        this.getReceiveDataALL(message);
                    }
                    else {
                        this.sendMessage(this, message);
                    }
                    return true;
                }
                else if (this.isNewDisplayFlag && this.isOnePopupClose && this.searchFormParameter.NEWITEM != "") {
                    return this.setInputSendMessage(data.dataRows[0], "", "N");
                }
                else if (this.isNewDisplayFlag && this.isOnePopupClose) {
                    if ($.isEmpty(data.dataRows[0].SIZE_CD)) {
                        return this.setInputSendMessage(data.dataRows[0], "", "L");
                    }
                }
            }

            return false;
        }

    },

    /**********************************************************************
    * event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트)
    **********************************************************************/
    //[grid] 품목코드, 품목명, 규격명 클릭
    setGridDateLink: function (value, rowItem) {
        var self = this;
        var option = {};
        option.data = value;
        option.dataType = "1";
        option.controlType = (this.IsCallCSAPI === true ? "widget.label" : "widget.link");
        option.event = {
            'click': function (e, data) {
                if (!this.isNewDisplayFlag) {
                    var message = {
                        name: "PROD_DES",
                        code: "PROD_CD",
                        data: data.rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "next",
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                    return;
                }
                var param = {
                    rowItem: data.rowItem,
                    type: "",
                    callback: function (result) {
                        if (!this.isNewDisplayFlag) {//현황
                            var message = {
                                name: "PROD_DES",
                                code: "PROD_CD",
                                data: result,
                                isAdded: this.isCheckBoxDisplayFlag,
                                addPosition: "current",
                                callback: this.close.bind(this)
                            };
                            this.sendMessage(this, message);
                        }
                        else {//입력
                            if (this.isReceiveDataAll) {    // 다목적입력 코드연계관련 데이터 가져오기
                                var message = {
                                    name: "PROD_DES",
                                    code: "PROD_CD",
                                    data: result,
                                    isAdded: this.isCheckBoxDisplayFlag,
                                    addPosition: "current",
                                    callback: this.close.bind(this)
                                };

                                this.getReceiveDataALL(message);
                            }
                            else {
                                if ($.isEmpty(result.SERIAL_IDX)) {
                                    result.SERIAL_IDX = '';
                                }
                                this.setInputSendMessage(result, "");
                            }
                        }
                    }.bind(this)
                };

                this.setProdBasicInfo(param);





            }.bind(this)
        };
        return option;
    },

    generateButton: function () {
        var toolbar = this.footer.get(0);
        var ctrl = widget.generator.control();
        toolbar.remove();
        var btnList = [];
        var res = ecount.resource;

        if (this.isApplyDisplayDoNotShow) {
            // 적용버튼 보여주지 않음.
        }
        else if (this.isApplyDisplayFlag || this.viewBag.FormInfos.SP900.option.inputMethod == "K") {
            btnList.push(ctrl.define("widget.button", "apply").label(res.BTN00069).end());
        }


        if (this.isNewDisplayFlag && this.isFromCS !== true && this.IsCallCSAPI !== true) {
            btnList.push(ctrl.define("widget.button", "new").css("btn btn-default").label(res.BTN00043).end());
        }

        if (this.isCheckBoxDisplayFlag && this.isFromCS !== true) {
            if ($.isNull(this.isProdRoot) && this.isFromFavoriteCode !== true) {
                btnList.push(ctrl.define("widget.button.group", "MyprodLoad").css("btn btn-default").label(res.LBL14188).addGroup([{ id: "MyProd", label: ecount.resource.LBL14189 }]).end())
            }
        }
        if (this.IsShowStockButton) {
            btnList.push(ctrl.define("widget.button", "IncludeStockQty").label(res.BTN00816).clickOnce().end());
            btnList.push(ctrl.define("widget.button", "NotIncludeStockQty").label(res.BTN00817).clickOnce().hide().end());
        }
        if (!this.isMoreFlag)
            btnList.push(ctrl.define("widget.button", "moreData").label(res.BTN00096).end());
        btnList.push(ctrl.define("widget.button", "Close").label(res.BTN00008).end())

        toolbar.addLeft(btnList);
        btnList = [];
        btnList.push(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]).end())
        toolbar.addRight(btnList);
    },

    /********************************************************************** 
    * 2019.04.11 : 기초 코드 팝업 데이터 모두 가져오기 API [김봉기]
    **********************************************************************/
    getReceiveDataALL: function (message) {
        var self = this;
        var url = "/SVC/Common/Infra/GetReceiveCodeData";
        var returnData = null;
        message.data.CODE_TYPE = ecount.constValue.codePopupType.prodCode; // 팝업 코드 타입 추가
        var param = {
            Request: {
                Data: message.data
            }
        };

        ecount.common.api({
            url: url,
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    returnData = result.Data;
                }
            },
            complete: function () {
                message.data = returnData;
                self.sendMessage(self, message);
            }
        });
    },

    //[grid] 이미지 링크
    setGridDateImage: function (value, rowItem) {
        var option = {};
        if (!$.isNull(rowItem.ATTACH_INFO) && !$.isNull(rowItem.FS_OWNER_KEY)) {
            option.data = rowItem.FILE_FULLPATH
            option.controlType = "widget.thumbnailLink";
        }
        else {
            option.data = '';
            option.controlType = "widget.link";
        }
        option.dataType = "1";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 400,
                    height: 420,
                    PROD_CD: data.rowItem.PROD_CD,
                    isViewOnly: true
                };

                this.openWindow({
                    url: '/ECERP/EGG/EGG024M',
                    name: ecount.resource.LBL02072,
                    param: param,
                    popupType: false,
                    additional: true
                });

                data.event.preventDefault();
            }.bind(this)
        };
        return option;
    },

    //[grid] 파일관리 클릭
    setGridDateChk: function (value, rowItem) {
        var option = {};
        if (rowItem.FILE_CNT > 0) {
            option.data = ecount.resource.LBL02931;
            option.attrs = {
                'Class': 'text-warning-inverse'
            };
        }
        else option.data = ecount.resource.LBL02931;

        option.dataType = "1";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                if (this.isFromCS) {
                    this.file.Value = "R";
                    this.trialOverflowFlag == "Y";
                }
                if (['R', 'W'].contains(this.file.Value) && this.boardFlag == "Y") {
                    if (this.trialOverflowFlag == "N") {
                        this.SetFileWindowOpen(data);
                    }
                    else ecount.alert(ecount.resource.MSG04121);
                }
                else {
                    if (!['R', 'W'].contains(this.file.Value) && this.boardFlag == "Y") {
                        if (this.trialOverflowFlag == "N") ecount.alert(ecount.resource.MSG00141);
                        else ecount.alert(ecount.resource.MSG04121);
                    }
                    else ecount.alert(ecount.resource.MSG04479);
                }
            }.bind(this)
        };
        return option;
    },
    onButtonMyProd: function () {
        var url = '/ECERP/Popup.Common/EMD001P_01';
        var param = {
            width: 700,
            height: 640,
            ProdGubun: '1'
        };

        if (this.isUseFavoriteCode == true) {
            url = '/ECERP/SVC/Popup/EMD001P_01';
            param = {
                width: 600,
                height: 640,
                Request: {
                    Data: this.FavoriteRequest
                }
            };
        } 

        this.openWindow({
            url: url,
            name: ecount.resource.LBL14188,
            popupType: false,
            param: param
        });
    },

    //[grid]파일 목록 팝업
    SetFileWindowOpen: function (data) {
        var param = {
            width: 780,
            height: 600,
            b_type: "S01",
            BOARD_CD: 7000,
            isFileManage: true,
            //code: data.rowItem.PROD_CD,
            //code_des: data.rowItem.PROD_DES,
            prodCdAllInOne: data.rowItem.PROD_CD,
            prodDesAllInOne: data.rowItem.PROD_DES,
            Popup_Flag: "Y",
            ProgramType: "NEW"
        };

        this.openWindow({
            //url: this.isFromCS == true ? '/ECMain/CSA/ESA009P_04.aspx' : '/ECMain/ESA/ESA009P_04.aspx',
            url: this.isFromCS == true ? '/ECErp/CSA/CSA_EGM024M' : '/ECERP/EGM/EGM024M' ,
            //name: 'ESA009P_04',
            //name: data.rowItem.PROD_DES + "[" + data.rowItem.PROD_CD + "] " + ecount.resource.LBL00914,
            name: ecount.resource.LBL18820,
            param: param,
            popupType: false,
            additional: true,
            fpopupID: this.ecPageID
        });

        data.event.preventDefault();
    },

    //[grid]상세내역 클릭
    setGridDatedetail: function (value, rowItem) {
        var option = {};
        option.data = ecount.resource.BTN00315;
        option.dataType = "1";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 800,
                    height: 700,
                    Request: {
                        PROD_CD: data.rowItem.PROD_CD,
                        ProdEditType: "ALL_IN_ONE_SEARCH",
                    }
                };

                this.openWindow({
                    url: '/ECERP/SVC/ESQ/ESQ503M',
                    name: ecount.resource.LBL93736,
                    param: param,
                    popupType: false,
                    additional: true,
                    fpopupID: this.ecPageID
                });

                data.event.preventDefault();
            }.bind(this)
        };
        return option;
    },

    //[grid]규격그룹선택(입력 화면 개발시 추가 예정)
    setGridDatesize_chk: function (value, rowItem) {
        var self = this;
        var option = {};
        option.data = '';
        option.controlType = (this.IsCallCSAPI === true ? "widget.label" : "widget.link");
        if (this.isNewDisplayFlag) {
            if (rowItem.SIZE_CD !== "") {
                option.attrs = {
                    'Class': 'fa fa-check text-info'
                };
                option.event = {
                    'click': function (e, data) {

                        var param = {
                            rowItem: data.rowItem,
                            type: "",
                            callback: function (result) {

                                this.setSizeLoad(result, ecmodule.common.prod.setInitDataSetting(self, result, this.setDataSetting("")));
                                data.event.preventDefault();
                            }.bind(this)
                        };
                        this.setProdBasicInfo(param);



                    }.bind(this)
                };
            }
        }
        return option;
    },

    //규격그룹 팝업 오픈
    setSizeLoad: function (data, InputData) {
        //var Key = String.format("{0}ㆍ{1}ㆍ{2}ㆍ{3}ㆍ{4}ㆍ{5}ㆍ{6}ㆍ{7}ㆍ{8}ㆍ{9}ㆍ{10}ㆍ{11}ㆍ{12}ㆍ{13}ㆍ{14}ㆍ{15}ㆍ{16}ㆍ{17}ㆍ{18}ㆍ{19}ㆍ{20}ㆍ{21}ㆍ{22}ㆍ{23}", data.SIZE_CD, data.PROD_CD, data.PROD_DES, InputData.InPrice, InputData.OutPrice, InputData.SpecialPrice, InputData.InPriceVat, InputData.OutPriceVat, InputData.ExchRate, InputData.SpriceVat, data.SIZE_DES, InputData.VatRate, data.SIZE_FLAG, data.BAL_FLAG, this.FcName, this.rowKey, this.BGubun, this.AddRow, data.EXCH_RATE2, data.DENO_RATE, InputData.Tax, InputData.VatYn, data.BUSINESS_NO, data.CUST_NAME);
        var parent = {
            Io_Type: this.IoType,
            isSetInputValue: false,
            DecQ: this.Parent.DecQ,
            DecP: this.Parent.DecP
            //DecQ: ecount.config.inventory.DEC_Q,
            //DecP: ecount.config.inventory.DEC_P
        }

        if (this.isFromCS == true) {
            parent.C0001 = data.C0001 || "B",
                parent.C0002 = data.C0002 || "0",
                parent.C0003 = data.C0003 || "N",
                parent.BASE_QTY = data.CS_BASE_QTY || "0"
        }

        var keymode = ((this.viewBag.FormInfos.SP900.option.inputMethod == "K" && this.isNewDisplayFlag) || !this.isNewDisplayFlag) ? true : false;

        var param = {
            width: 400,
            height: 500,
            Size_Cd: data.SIZE_CD,
            Prod_Cd: data.PROD_CD,
            Prod_Des: data.PROD_DES,
            InPrice: (InputData.InPrice || 0).toString(),
            OutPrice: (InputData.OutPrice || 0).toString(),
            SpecialPrice: (InputData.SpecialPrice || 0).toString(),
            InPriceVat: (InputData.InPriceVat || 0).toString(),
            OutPriceVat: (InputData.OutPriceVat || 0).toString(),
            ExchRate: (InputData.ExchRate || 0).toString(),
            SpriceVat: InputData.SpriceVat,
            Size_Des: data.SIZE_DES,
            VatRate: (InputData.VatRate || 0).toString(),
            Size_Flag: data.SIZE_FLAG,
            Bal_Flag: data.BAL_FLAG,
            FcName: this.FcName,
            rowKey: this.rowKey,
            rowIdx: this.rowIdx,
            BGubun: this.BGubun,
            AddRow: this.AddRow,
            Exch_Rate2: data.EXCH_RATE2,
            Deno_Rate: data.DENO_RATE,
            Tax: (InputData.Tax || 0).toString(),
            VatYn: InputData.VatYn,
            Business_No: data.BUSINESS_NO,
            Cust_Name: data.CUST_NAME,
            isCheckBoxDisplayFlag: true,
            checkBoxMaxCount: 1,
            Parent: Object.toJSON(parent),
            OwnerPopupID: this.parentPageID,
            ParentPopupID: "ES020P",
            LastPriceVatInclude: InputData.lastPriceVatInclude.toString(),
            IsLastPriceVatInc: InputData.isLastPriceVatInc,
            Unit: data.UNIT,            
            KeyMode: keymode,
            SizePriceInfo: {
                PRICE: data.PRICE,
                PRICE_VAT_INCLUDE: data.PRICE_VAT_INCLUDE,
                PRICE_VAT_YN: data.PRICE_VATE_YN,

                IN_PRICE : data.IN_PRICE,
                IN_PRICE_VAT_INCLUDE : data.IN_PRICE_VAT_INCLUDE,
                IN_PRICE_VAT_YN: data.IN_PRICE_VAT_YN,

                OUT_PRICE: data.OUT_PRICE,
                OUT_PRICE_VAT_INCLUDE: data.OUT_PRICE_VAT_INCLUDE,
                OUT_PRICE_VAT_YN: data.OUT_PRICE_VAT_YN,

                OUT_PRICE1: data.OUT_PRICE1,
                OUT_PRICE1_VAT: data.OUT_PRICE1_VAT,
                OUT_PRICE1_VAT_YN: data.OUT_PRICE1_VAT_YN,

                OUT_PRICE2: data.OUT_PRICE2,
                OUT_PRICE2_VAT: data.OUT_PRICE2_VAT,
                OUT_PRICE2_VAT_YN: data.OUT_PRICE2_VAT_YN,

                OUT_PRICE3: data.OUT_PRICE3,
                OUT_PRICE3_VAT: data.OUT_PRICE3_VAT,
                OUT_PRICE3_VAT_YN: data.OUT_PRICE3_VAT_YN,

                OUT_PRICE4: data.OUT_PRICE4,
                OUT_PRICE4_VAT: data.OUT_PRICE4_VAT,
                OUT_PRICE4_VAT_YN: data.OUT_PRICE4_VAT_YN,

                OUT_PRICE5: data.OUT_PRICE5,
                OUT_PRICE5_VAT: data.OUT_PRICE5_VAT,
                OUT_PRICE5_VAT_YN: data.OUT_PRICE5_VAT_YN,

                OUT_PRICE6: data.OUT_PRICE6,
                OUT_PRICE6_VAT: data.OUT_PRICE6_VAT,
                OUT_PRICE6_VAT_YN: data.OUT_PRICE6_VAT_YN,

                OUT_PRICE7: data.OUT_PRICE7,
                OUT_PRICE7_VAT: data.OUT_PRICE7_VAT,
                OUT_PRICE7_VAT_YN: data.OUT_PRICE7_VAT_YN,

                OUT_PRICE8: data.OUT_PRICE8,
                OUT_PRICE8_VAT: data.OUT_PRICE8_VAT,
                OUT_PRICE8_VAT_YN: data.OUT_PRICE8_VAT_YN,

                OUT_PRICE9: data.OUT_PRICE9,
                OUT_PRICE9_VAT: data.OUT_PRICE9_VAT,
                OUT_PRICE9_VAT_YN: data.OUT_PRICE9_VAT_YN,

                OUT_PRICE10: data.OUT_PRICE10,
                OUT_PRICE10_VAT: data.OUT_PRICE10_VAT,
                OUT_PRICE10_VAT_YN: data.OUT_PRICE10_VAT_YN
            },
            InspectStaus: data.INSPECT_STATUS,
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/ES016P_01',
            name: ecount.resource.LBL00731,
            param: param,
            popupType: false,
            additional: true
        });
    },

    //[grid]Type
    setGridDateType: function (value, rowItem) {
        var option = {};
        if (value.toLowerCase() == "b") value = ecount.resource.LBL08396;
        else if (value.toLowerCase() == "m") value = ecount.resource.LBL09077;
        else if (value.toLowerCase() == "y") value = ecount.resource.LBL08831;
        else if (value.toLowerCase() == "n") value = ecount.resource.LBL07880;

        option.data = value;
        option.controlType = 'widget.label';
        option.event = {
            'click': function (e, data) {
            }.bind(this)
        };
        return option;
    },

    setGridDateProdtype: function (value, rowItem) {
        var option = {};
        if (value == "0") value = ecount.resource.LBL02025;
        else if (value == "1") value = ecount.resource.LBL02538;
        else if (value == "2") value = ecount.resource.LBL01250;
        else if (value == "3") value = ecount.resource.LBL01523;
        else if (value == "4") value = ecount.resource.LBL01387;
        else if (value == "7") value = ecount.resource.LBL15087;
        else value = "";

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateSetFlag: function (value, rowItem) {
        var option = {};
        if (value == "1") value = ecount.resource.LBL01448;
        else value = ecount.resource.LBL01185;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateBalFlag: function (value, rowItem) {
        var option = {};
        if (value == "0") value = ecount.resource.LBL01701;
        else if (value == "1") value = ecount.resource.LBL01704;
        else if (value == "2") value = ecount.resource.LBL04298;
        else value = ecount.resource.LBL01701;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateVatYn: function (value, rowItem) {
        var option = {};
        if (value == "Y") value = ecount.resource.LBL05716;
        else value = ecount.resource.LBL08396;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDatePRICEVATRATEBYBASEYN: function (value, rowItem) {
        var option = {};
        if (value == "Y") value = ecount.resource.LBL05716;
        else value = ecount.resource.LBL08396;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDatecsflag: function (value, rowItem) {
        var option = {};
        if (value == "1") value = ecount.resource.LBL01448;
        else value = ecount.resource.LBL01185;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateinspectstatus: function (value, rowItem) {
        var option = {};
        if (value == "") value = "";
        else if (value == "S") value = ecount.resource.LBL10923;
        else if (value == "L") value = ecount.resource.LBL10932;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateinpricevat: function (value, rowItem) {
        var option = {};
        if (value == "0") value = ecount.resource.LBL07247;
        else if (value == "1") value = ecount.resource.LBL03755;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateoutpricevat: function (value, rowItem) {
        var option = {};
        if (value == "0") value = ecount.resource.LBL07247;
        else if (value == "1") value = ecount.resource.LBL03755;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateoutpricevatyn: function (value, rowItem) {
        var option = {};
        if (value == "N") value = ecount.resource.LBL07247;
        else if (value == "Y") value = ecount.resource.LBL03755;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateC0001: function (value, rowItem) {
        var option = {};
        if (value == "B") value = ecount.resource.LBL08396;
        else if (value == "N") value = ecount.resource.LBL01450;
        else if (value == "Y") value = ecount.resource.LBL01448;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateC0003: function (value, rowItem) {
        var option = {};
        if (value == "N") value = ecount.resource.LBL03589;
        else if (value == "Y") value = ecount.resource.LBL01448;

        option.data = value;
        option.controlType = 'widget.label';
        return option;
    },

    setGridDateUseCnt: function (value, rowItem) {
        var self = this;
        var option = {};
        option.dataType = 90;
        option.value = value;
        option.controlType = 'widget.label';
        return option;
    },

    //[grid]Type2
    setGridDateType2: function (value, rowItem) {
        var option = {};
        if (value.toLowerCase() == "b") value = ecount.resource.LBL08396;
        else if (value.toLowerCase() == "y") value = ecount.resource.LBL07879;
        else if (value.toLowerCase() == "n") value = ecount.resource.LBL07880;

        option.data = value;
        option.controlType = 'widget.label';
        option.event = {
            'click': function (e, data) {
            }.bind(this)
        };
        return option;
    },

    //[grid]단가(입력 개발시 추가 예정)
    setGridDatePrice: function (value, rowItem) {
        var self = this;
        var option = {};

        option.data = value;
        option.controlType = (this.IsCallCSAPI === true ? "widget.label" : "widget.link");

        option.event = {
            'click': function (e, data) {
                var param = {
                    rowItem: data.rowItem,
                    type: "",
                    callback: function (result) {

                        var InputData = ecmodule.common.prod.setInitDataSetting(self, result, this.setDataSetting(''));

                        var Key = {
                            PROD_CD: result.PROD_CD,
                            PROD_DES: result.PROD_DES,
                            Price: "",
                            D: "",
                            VAT: "",
                            ExchRate: InputData.ExchRate,
                            G: "0",
                            SIZE_DES: result.SIZE_DES,
                            VatRate: InputData.VatRate,
                            SIZE_FLAG: result.SIZE_FLAG,
                            BAL_FLAG: result.BAL_FLAG,
                            UNIT: result.UNIT,
                            BUSINESS_NO: result.BUSINESS_NO,
                            CUST_NAME: result.CUST_NAME,
                            TAX: new Decimal(result.TAX),
                            VAT_YN: result.VAT_YN,
                            VAT_RATE_BY: new Decimal(result.VAT_RATE_BY),
                            VAT_RATE_BY_BASE_YN: result.VAT_RATE_BY_BASE_YN,
                            ecount0: result.ecount0 || "",
                            ecount1: result.ecount1 || "",
                            ecount6: result.ecount6 || "",
                            ITEM_TYPE: result.ITEM_TYPE,
                            SERIAL_TYPE: result.SERIAL_TYPE,
                            PROD_SELL_TYPE: result.PROD_SELL_TYPE,
                            PROD_WHMOVE_TYPE: result.PROD_WHMOVE_TYPE,
                            QC_BUY_TYPE: result.QC_BUY_TYPE,
                            QC_YN: result.QC_YN,
                            lastPriceVat: "0",
                            isLastPriceVat: false,
                            SET_FLAG: result.SET_FLAG,
                            PROD_TYPE: result.PROD_TYPE
                        };

                        $.extend(Key, this.setProdInputDataSave(result));
                        
                        if (data.columnId == "sale003.out_price") {
                            Key.Price = new Decimal(result.OUT_PRICE || "0");
                            Key.VAT = new Decimal(result.OUT_PRICE_VAT_INCLUDE || "0");
                        }
                        else if (data.columnId == "sale003.in_price") {
                            Key.Price = new Decimal(result.IN_PRICE || "0");
                            Key.VAT = new Decimal(result.IN_PRICE_VAT_INCLUDE || "0");
                        }
                        else if (data.columnId == "LP.LAST_PRICE") {
                            Key.Price = new Decimal(result.LAST_PRICE || "0");
                            Key.VAT = new Decimal(result.LAST_PRICE_VAT || "0");                            
                        }
                        else if (data.columnId == "sale003.special_price") {
                            Key.Price = InputData.SpecialPrice;
                            Key.VAT = InputData.SpriceVat;

                        }
                        else {
                            switch (data.columnId) {
                                case "sale003.out_price1":
                                    Key.Price = new Decimal(result.OUT_PRICE1);
                                    Key.VAT = result.OUT_PRICE1_VAT;
                                    break;
                                case "sale003.out_price2":
                                    Key.Price = new Decimal(result.OUT_PRICE2);
                                    Key.VAT = result.OUT_PRICE2_VAT;
                                    break;
                                case "sale003.out_price3":
                                    Key.Price = new Decimal(result.OUT_PRICE3);
                                    Key.VAT = result.OUT_PRICE3_VAT;
                                    break;
                                case "sale003.out_price4":
                                    Key.Price = new Decimal(result.OUT_PRICE4);
                                    Key.VAT = result.OUT_PRICE4_VAT;
                                    break;
                                case "sale003.out_price5":
                                    Key.Price = new Decimal(result.OUT_PRICE5);
                                    Key.VAT = result.OUT_PRICE5_VAT;
                                    break;
                                case "sale003.out_price6":
                                    Key.Price = new Decimal(result.OUT_PRICE6);
                                    Key.VAT = result.OUT_PRICE6_VAT;
                                    break;
                                case "sale003.out_price7":
                                    Key.Price = new Decimal(result.OUT_PRICE7);
                                    Key.VAT = result.OUT_PRICE7_VAT;
                                    break;
                                case "sale003.out_price8":
                                    Key.Price = new Decimal(result.OUT_PRICE8);
                                    Key.VAT = result.OUT_PRICE8_VAT;
                                    break;
                                case "sale003.out_price9":
                                    Key.Price = new Decimal(result.OUT_PRICE9);
                                    Key.VAT = result.OUT_PRICE9_VAT;
                                    break;
                                case "sale003.out_price10":
                                    Key.Price = new Decimal(result.OUT_PRICE10);
                                    Key.VAT = result.OUT_PRICE10_VAT;
                                    break;
                                case "WP":
                                    Key.Price = new Decimal(result.WP);
                                    Key.VAT = result.WP_VAT_INCLUDE;
                                    break;
                                case "WPG":
                                    Key.Price = new Decimal(result.WPG);
                                    Key.VAT = result.WPG_VAT_INCLUDE;
                                    break;
                                case "CP":
                                    Key.Price = new Decimal(result.CP);
                                    Key.VAT = result.CP_VAT_INCLUDE;
                                    break;
                                case "CPG":
                                    Key.Price = new Decimal(result.CPG);
                                    Key.VAT = result.CPG_VAT_INCLUDE;
                                    break;
                                
                            }
                        }

                        this.setLoadPrice(Key);
                    }.bind(this)
                };

                this.setProdBasicInfo(param);



            }.bind(this)
        };
        return option;
    },

    //팝업 오픈 이벤트
    onPopupHandler: function (control, parameter, handler) {

        if (control.id == "txtClassCd1" || control.id == "txtClassCd2" || control.id == "txtClassCd3") {
            parameter.isIncludeInactive = true;
            parameter.isApplyDisplayFlag = false;
            parameter.isCheckBoxDisplayFlag = false;
            parameter.Request.Data.PARAM = parameter.keyword;
        }
        handler(parameter);
    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {
        if (control.id == "txtClassCd1" || control.id == "txtClassCd2" || control.id == "txtClassCd3") {
            param.Request.Data.PARAM = keyword;
        }
        handler(param);
    },

    /**********************************************************************
    * event  [button, link, FN, optiondoropdown..]
    **********************************************************************/
    // Header 검색

    onHeaderSearch1: function (event, key) {
            this.header.getQuickSearchControl().setValue("");
            this.searchFormParameter.PARAM = "";
     
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        var grid = this.contents.getGrid();
        grid.settings.setColumns([
            { id: 'STOCKS.BAL_QTY', isHideColumn: true },
            { id: 'STOCKS.WH_F_QTY', isHideColumn: true },
            { id: 'STOCKS.WH_T_QTY', isHideColumn: true }
        ]);

        var invalid = this.header.validate();
        if (invalid.result.length > 0) {
            if (this.header.currentTabId == "quick") {
                //this.header.getControl("search1", "quick").setFocus(0);
                this.header.getQuickSearchControl().setFocus(0);
            }
            else {
                invalid.result[0][0].control.setFocus(0);
                //this.header.getQuickSearchControl().setFocus(0);
            }
            return;
        }
        var btnSearch = this.header.getControl("search");
        if (this.header.currentTabId != "quick") {
            var form = this.header.serialize(),
                params = {};
            $.extend(this.searchFormParameter, this.searchFormParameter, form.result);

            this.searchFormParameter.SEARCH_GB = "1";
            this.searchFormParameter.PARAM = "";

            if (event != "button") {
                if (this.searchFormParameter.DEL_GUBUN == "" || this.searchFormParameter.DEL_GUBUN == "N") {
                    this.searchFormParameter.DEL_GUBUN = "Y";
                    //$("button[id=btn-header-btnUsestop]")[0].innerHTML = ecount.resource.BTN00603;
                    //this.header.getControl("search1", "quick").setStatus("N", ecount.resource.BTN00603);
                    btnSearch.removeGroupItem("btnUsestop");
                    btnSearch.addGroupItem([{ id: "btnUsestop", label: ecount.resource.BTN00603 }]);
                }
                else {
                    this.searchFormParameter.DEL_GUBUN = "N";
                    //$("button[id=btn-header-btnUsestop]")[0].innerHTML = ecount.resource.BTN00351;
                    //this.header.getControl("search1", "quick").setStatus("Y", ecount.resource.BTN00351);
                    btnSearch.removeGroupItem("btnUsestop");
                    btnSearch.addGroupItem([{ id: "btnUsestop", label: ecount.resource.BTN00351 }]);
                }
            }
        }
        else {

            var fromheader = this.header.getControl("search1", "quick").getValue();
            this.searchFormParameter.SEARCH_GB = "0";
            this.searchFormParameter.SIMPLE_SEARCH_PARAM = fromheader;
            if (!$.isEmpty(fromheader)) {
                this.isOnePopupClose = true;
            }
            else {
                this.isOnePopupClose = false;
            }

            if (event != "button") {
                if ($.isNull(event) || event.event.target.id != "btn--search1") {
                    if (this.searchFormParameter.DEL_GUBUN == "N") {
                        this.searchFormParameter.DEL_GUBUN = "Y";
                        //$("button[id=btn-header-btnUsestop]")[0].innerHTML = ecount.resource.BTN00603;
                        btnSearch.removeGroupItem("btnUsestop");
                        btnSearch.addGroupItem([{ id: "btnUsestop", label: ecount.resource.BTN00603 }]);
                    }
                    else {
                        this.searchFormParameter.DEL_GUBUN = "N";
                        //$("button[id=btn-header-btnUsestop]")[0].innerHTML = ecount.resource.BTN00351;
                        btnSearch.removeGroupItem("btnUsestop");
                        btnSearch.addGroupItem([{ id: "btnUsestop", label: ecount.resource.BTN00351 }]);
                    }
                }
            }
            //this.searchFormParameter.DEL_GUBUN = fromheader.status;
        }

        if (this.isFromCS == true && (this.searchFormParameter.DEL_GUBUN == null || this.searchFormParameter.DEL_GUBUN == "")) {
            this.searchFormParameter.DEL_GUBUN = "N";
        }
        this.searchFormParameter.SeachType = "B";
        this.searchFormParameter.OPEN_SEARCH_YN = "Y";
        this.isSorted = false;




        this.contents.getGrid().grid.settings().setColumnSortable(true);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.toggle(true);
        //

    },

    onMessageHandler: function (event, data) {
        debugger
        var firstData = data.data || data;
        switch (event.pageID) {
            case "ES017P_01":
                this.setLoadLastPri_Pre(firstData);
                break;
            case "CM100P_01_CM3":
                setTimeout(function () {
                    data.callback && data.callback();
                }, 0);
                break;
            case "ESA010M":
                if (!firstData.CONTINUE) { /*품목코드에서 신규 클릭해서 품목등록시 호출하는 곳 (2017.02.01)시리얼로만 체크하는 오류 수정*/
                    this.searchFormParameter.SEARCH_GB = "0";
                    this.searchFormParameter.NEWITEM = "N";
                    this.searchFormParameter.SeachType = "B";
                    this.header.getControl("search1", "quick").setValue(firstData.PROD_CD);
                    this.onHeaderSearch1('button', '');
                    var fromheader = this.header.getControl("search1", "quick").getValue();
                    this.searchFormParameter.SEARCH_GB = "0";
                    this.searchFormParameter.SIMPLE_SEARCH_PARAM = fromheader;
                    this.searchFormParameter.DEL_GUBUN = fromheader.status || "N";

                    if (this.header.currentTabId != "quick") {
                        this.header.changeTab("quick");
                        this.onHeaderSearch1('button', '');
                    }
                };
                break;
            case "CM100P_02":
                if (this.isSearched) {
                    this.onHeaderSearch1('button', '');
                }

                setTimeout(function () {
                    data.callback && data.callback();
                }, 0);
                break;
        }
    },

    //헤더 검색 버튼 이벤트
    onHeaderSearch: function (event, key) {
        this.onHeaderSearch1('button', '');

    },

    // 사용 중단 버튼
    onHeaderBtnUsestop: function (event) {
        this.onHeaderSearch1();
    },

    onButtonBtnUsestop: function (event) {
        //if (this.searchFormParameter.DEL_FLAG == "Y")
        //    this.searchFormParameter.DEL_FLAG = "N";
        //else
        //    this.searchFormParameter.DEL_FLAG = "Y";

        //this.onContentsSearch('button');
        this.onHeaderSearch1();
    },

    onHeaderReset: function (event) {
        this.header.reset();
        if (this.header.getControl("search1"))
            this.header.getControl("search1").setFocus(0);
        else
            this.header.getControl("SProdCd").setFocus(0);
    },

    // 검색 탭 변경
    onChangeHeaderTab: function (e) {

        // 사용빈도 양식 컬럼 사용 여부 확인
        //var useCntCheck = false;
        //if (this.viewBag.FormInfos.SP900 && this.viewBag.FormInfos.SP900.columns && this.viewBag.FormInfos.SP900.columns.length > 0) {
        //    for (var i = 0; i < this.viewBag.FormInfos.SP900.columns.length; i++) {
        //        if (this.viewBag.FormInfos.SP900.columns[i].name == "LP.USE_CNT") {
        //            useCntCheck = true
        //        }
        //    }
        //}

        if (e.tabId == "quick") {
            //this.header.getToolbar().hide();
            this.setFixedHeader(true);
            this.header.removeOptionItems();
            this.header.addOptionItems([
                { id: "searchTemplate", label: ecount.resource.BTN00291 },
                { id: "listSetting", label: ecount.resource.BTN00169 }
            ]);

            //if (useCntCheck && !$.isEmpty(this.Cust) && ["10", "20", "71", "72"].contains(this.IoType)) {
            //    this.header.addOptionItems([
            //        { id: "usecnt", label: ecount.resource.BTN00255 }
            //    ]);
            //}

        }
        else {
            this.setFixedHeader(false);
            this.header.removeOptionItems();
            this.header.addOptionItems([
                { id: "listSetting", label: ecount.resource.BTN00169 }
            ]);

            //if (useCntCheck && !$.isEmpty(this.Cust) && ["10", "20", "71", "72"].contains(this.IoType)) {
            //    this.header.addOptionItems([
            //        { id: "usecnt", label: ecount.resource.BTN00255 }
            //    ]);
            //}
        }
    },

    // 검색 항목 설정
    onDropdownSearchTemplate: function () {
        if (this.viewBag.Permission.prod.Value == "W") {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(),
                height: 450,
                FORM_TYPE: "SS900"
            };
            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_01_CM3",
                name: ecount.resource.BTN00169,
                param: param
            });
        }
        else {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
    },

    // 리스트 설정
    onDropdownListSetting: function () {
        if (this.viewBag.Permission.prod.Value == "W") {
            var param = {
                width: 1020,
                height: 800,
                FORM_TYPE: "SP900",
                FORM_SEQ: this.FORM_SER_SEQ
            }

            if (this.IsCallCSAPI)
                param.IS_CS = true;

            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: ecount.resource.BTN00169,
                param: param
            });
        }
        else {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
    },

    //사용 빈도 초기화
    //onDropdownUsecnt: function () {
    //    var Param = {
    //        CUST_CD: this.Cust
    //    }

    //    var url = "/Inventory/Basic/UpdateUseCntReSet";
    //    if (!$.isEmpty(this.__ecPageID)) {
    //        var parentPageID = this.__ecPageID.substring(0, 7);
    //        if (parentPageID == "ESG009M" || parentPageID == "ESG004M") {
    //            url = "/Inventory/Basic/UpdateSTBYUseCntReSet";
    //        }
    //    }

    //    ecount.common.api({
    //        url: url,
    //        data: Object.toJSON(Param),
    //        success: function (result) {
    //            this.searchFormParameter.SeachType = "B";
    //            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
    //            this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
    //            this.contents.getGrid().draw(this.searchFormParameter);
    //        }.bind(this)
    //    });
    //},

    // 신규 버튼 클릭(신규 팝업의 경우는 신규 등록 팝업에서 부모페이지로 등록된 코드를 전달 하므로 팝어 띄우는 로직이 다르다)
    onFooterNew: function (e) {
        if (this.viewBag.Permission.prod.Value == "R") {
            ecount.alert(ecount.resource.MSG00456)
            return false;
        }
        if (!(this.viewBag.Permission.prod.Value == "U" || this.viewBag.Permission.prod.Value == "W")) {
            ecount.alert(ecount.resource.MSG00141)
            return false;
        }

        //var formdata = this.header.serialize();
        //var CodeChange = this.CodeChangeFlag || "";
        //var prod_des = this.searchFormParameter.PARAM || "";

        ////var url = "/ECMain/ESA/ESA010M.aspx?hidData=;;PROD_CD;A;0;Y;I;N;ESA009M.aspx&CodeChangeFlag=" + CodeChange + "&PROD_DES=" + prod_des + "&hidEasySchData=";
        //var url = "/ECMain/ESA/ESA010M.aspx"

        //var param = {
        //    width: 800,
        //    height: 500,
        //    hidData: ";;PROD_CD;A;0;Y;I;N;ESA009M.aspx",
        //    CodeChangeFlag: CodeChange,
        //    PROD_DES: prod_des
        //};

        //this.openWindow({
        //    url: url,
        //    name: ecount.resource.LBL02987,
        //    param: param,
        //    popupType: true,
        //    additional: true,
        //    fpopupID: this.ecPageID
        //});


        var self = this;
        var btn = self.footer.get(0).getControl("new");

        var fromheader = self.header.getControl("search1", "quick").getValue();
        var QuickSearchParam = this.header.getQuickSearchControl().getValue();

        var param = {
            isMultiProcess: false,
            EditFlag: "I",
            isSaveContentsFlag: false,   // 저장유지버튼 사용여부
            PROD_FLAG: "S",
            PROD_CD: "",
            KEYWORD: $.isEmpty(fromheader) ? QuickSearchParam : fromheader
        }

        this.openItemReg(param);

        btn.setAllowClick();


    },


    // 품목등록창 오픈
    openItemReg: function (inValue) {


        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 700,
            isMultiProcess: inValue.isMultiProcess,
            EditFlag: inValue.EditFlag,
            isSaveContentsFlag: inValue.isSaveContentsFlag,   // 저장유지버튼 사용여부
            isCloseFlag: true,  // 닫기버튼 사용여부
            PROD_FLAG: inValue.PROD_FLAG,
            PROD_CD: inValue.PROD_CD,
            KEYWORD: inValue.KEYWORD

        }
        this.openWindow({
            url: "/ECERP/ESA/ESA010M",
            name: ecount.resource.LBL02390,
            param: param
        });
    },


    // 닫기 버튼 클릭
    onFooterClose: function () {
        if (!$.isEmpty(this.parentLoadData)) {
            if (this.getParentInstance(this.getParentInstance().pageID).setProdCloseFocus) {
                var gridId = this.gridID || "";
                this.getParentInstance(this.getParentInstance().pageID).setProdCloseFocus(this.parentLoadData, this.rowKey, gridId);
            }
        }
        this.close();
        return false;
    },

    // 검색 닫기 버튼 클릭
    onHeaderCloseForm: function (e) {
        //this.header.toggle();
    },

    // 판매입력 키보드 모드일때 일괄 적용 로직 이관
    setFooterApplyKeyBord: function (result, selectedItem) {

        for (var i = 0; i < selectedItem.length; i++) {

            var AddData = this.setDataSetting("chk");
            //AddData 없는 것은 품목을 넣을 그리드 row가 없는것
            if (!AddData) {
                this.close();
            }

            //시리얼코드와 연결된 품목코드를 조회만하고 저장을 안할시 sale013에 저장x(ex. 바코드검증)
            if (this.isNotSaveSerial) {
                selectedItem[i].isNotSaveSerial = true;
            }

            var Data = ecmodule.common.prod.setInputSendMessage(this, selectedItem[i], AddData);

            if (this.isSpecGroupAdd) {
                var numrow = this.rowAddCnt;
                Data.rowKey = (numrow).toString();
                Data.rowIdx = numrow;
                this.rowAddCnt++;
            }
            //Data.rowKey = AddData.rowKey;
            //Data.rowIdx = AddData.rowIdx;

            if ((AddData.BGubun != "Y" && AddData.BGubun2 != "Y")) {
                Data.ApplyGubun = true;
                Data.oldrowKey = this.rowKey;
            }

            Data.totalItemCnt = 1;
            Data.ItemCnt = i;

            if (result.Data) {
                for (var j = 0; j < result.Data.length; j++) {
                    if (Data.PROD_CD == result.Data[j].Key.PROD_CD) {
                        Data.PriceInfo = result.Data[j];
                        Data.PriceInfo.rowKey = Data.rowKey;
                        break;
                    }
                }
            }

            if (ecount.config.company.ROW_LIMIT_CNT > 0 && (Number(AddData.AddRow) + 1 >= Number(ecount.config.company.ROW_LIMIT_CNT) || AddData.AddRow == "special-row-0")) {
                i = selectedItem.length - 1;
            }

            var message = {
                isNextFocus: selectedItem.length == 1,
                name: "PROD_DES",
                code: "PROD_CD",
                data: Data,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",   // 입력양식 첫번째 입력 항목에 포커스 주는 포지션 추가
                callback: (i == selectedItem.length - 1) ? this.close.bind(this) : null,
                isLastData: (i == selectedItem.length - 1) ? true : false,
            };
            this.sendMessage(this, message);
        }
    },

    // 적용 버튼 클릭
    onFooterApply: function (e) { 
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var _self = this;

        if (!_self.isNewDisplayFlag || _self.isFromFavoriteCode ) {
            var message = {
                name: "PROD_DES",
                code: "PROD_CD",
                data: selectedItem,
                isAdded: _self.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: _self.close.bind(_self)
            };
            _self.sendMessage(_self, message);
            return;
        }

        var prods = "";
        selectedItem.forEach(function (qtyItem, i) {
            prods = prods + qtyItem.PROD_CD + "∬";
        });

        var url = "/SVC/Inventory/Basic/GetListProdForBasicSearchInfo";
        var param = {
            Request: {
                Data: {
                    PRODS: prods,
                    IO_TYPE: this.IoType,
                    CUST: this.Cust,
                    OPEN_SEARCH_YN: "Y",
                    REQ_TYPE: 0,
                    MYPROD_FLAG: "N",
                    SFLAG: "N",
                    WH_CD: this.WHCD,
                    ADD_COLUMN: this.AddColumn,
                    IO_CODE: this.IO_CODE

                }
            }
        };
        ecount.common.api({
            url: url,
            data: Object.toJSON(param),
            success: function (result) {

                selectedItem.forEach(function (qtyItem, i) {
                    var rtn = result.Data.where(function (item) { return item.PROD_CD == qtyItem.PROD_CD });
                    if (rtn) {
                        $.extend(qtyItem, qtyItem, rtn[0]);
                    }
                });

                if ((_self.viewBag.FormInfos.SP900.option.inputMethod == "K" && _self.isNewDisplayFlag) || (_self.myProdFlag == true && _self.viewBag.FormInfos.SP900.option.inputMethod == "M" && _self.isNewDisplayFlag) || _self.isFromFavoriteCode) {
                    if (_self.isApplyMulti == true) {
                        var PRODCD = {
                            PROD_CD: "",
                            callback: function (result) {
                                this.setFooterApplyKeyBord(result, selectedItem);
                            }.bind(_self)
                        };
                        for (var i = 0; i < selectedItem.length; i++) {
                            PRODCD.PROD_CD = PRODCD.PROD_CD + selectedItem[i].PROD_CD + ecount.delimiter;
                        }


                        ecount.common.api({
                            url: "/Inventory/Basic/GetProdSale003PriceInfoMulti",
                            data: Object.toJSON(PRODCD),
                            success: function (result) {
                                PRODCD.callback && PRODCD.callback(result);
                            }.bind(_self)
                        });
                    }
                    else {
                        for (var i = 0; i < selectedItem.length; i++) {
                            var AddData = _self.setDataSetting("chk");

                            //시리얼코드와 연결된 품목코드를 조회만하고 저장을 안할시 sale013에 저장x(ex. 바코드검증)
                            if (this.isNotSaveSerial) {
                                selectedItem[i].isNotSaveSerial = true;
                            }

                            var Data = ecmodule.common.prod.setInputSendMessage(_self, selectedItem[i], AddData);

                            Data.rowKey = AddData.rowKey;
                            Data.rowIdx = AddData.rowIdx;

                            if ((AddData.BGubun != "Y" && AddData.BGubun2 != "Y")) {
                                Data.ApplyGubun = true;
                                Data.oldrowKey = _self.rowKey;
                            }

                            Data.totalItemCnt = selectedItem.length;
                            Data.ItemCnt = i;

                            var message = {
                                name: "PROD_DES",
                                code: "PROD_CD",
                                data: Data,
                                isAdded: _self.isCheckBoxDisplayFlag,
                                addPosition: "next",
                                callback: (i == selectedItem.length - 1) ? _self.close.bind(_self) : null,
                                isLastData: (i == selectedItem.length - 1) ? true : false
                            };
                            _self.sendMessage(_self, message);
                        }
                    }

                }
                else {
                    var message = {
                        name: "PROD_DES",
                        code: "PROD_CD",
                        data: selectedItem,
                        isAdded: _self.isCheckBoxDisplayFlag,
                        addPosition: "next",
                        callback: _self.close.bind(_self)
                    };
                    _self.sendMessage(_self, message);
                } 
            }
        });




    },
    /**
	* 천건이상조회 버튼 클릭
	**/
    onFooterMoreData: function (e) {
        this.header.toggle(true);
        this.isMoreFlag = true;
        this.searchFormParameter.IS_LIMIT = false;

        if (this.IsShowStockButton) {
            this.onFooterNotIncludeStockQty();
        }
        this.contents.getGrid().grid.settings().setColumnSortable(false);
        this.contents.getGrid().draw(this.searchFormParameter);



    },


    // 내품목 선택 버튼 기능
    onFooterMyprodLoad: function () {
        if (this.isUseFavoriteCode == true) {
            this.loadMyItemNew();
        } else {
            this.loadMyItemOld();
        }
    },
    // Include Stock Column
    // 재고포함보기
    onFooterIncludeStockQty: function () {
        if (this.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE == 'Y') {
            ////재고포함소팅의 경우
            //if (this.searchFormParameter.STOCK_SORT == 'Y') {
            //    this.searchFormParameter.INCLUDE_STOCK_YN = 'Y';
            //    //this.searchFormParameter.SORT_COLUMN = this.searchFormParameter.STOCK_SORT_COL;
            //    //this.searchFormParameter.SeachType = 'H';
            //    var grid = this.contents.getGrid();
            //    grid.settings.setColumns([
            //        { id: 'STOCKS.BAL_QTY', isHideColumn: false },
            //        { id: 'STOCKS.WH_F_QTY', isHideColumn: false },
            //        { id: 'STOCKS.WH_T_QTY', isHideColumn: false }
            //    ]);
            //    grid.draw(this.searchFormParameter);
            //    return false;
            //}

            var thisObj = this;
            var grid = thisObj.contents.getGrid().grid;

            if (!grid) return;

            var bal_val = grid.getColumnInfo('STOCKS.BAL_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.BAL_QTY').dataType;
            var wh_f_val = grid.getColumnInfo('STOCKS.WH_F_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.WH_F_QTY').dataType;
            var wh_t_val = grid.getColumnInfo('STOCKS.WH_T_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.WH_T_QTY').dataType;
            var whFValue = thisObj.searchFormParameter.WH_CD,
                whTValue = thisObj.searchFormParameter.WH_CD_T,
                gridItems = grid && grid.getRowList(gridConst),
                isNotWhFromValue = false,
                isNotWhToValue = false,
                gridConst = ecount.grid.constValue.keyColumnPropertyName; //그리드 key

            var paramData = {
                ProdList: [],
                IsStockSearchLoop: false
            };

            if ($.isEmpty(whFValue)) {
                isNotWhFromValue = true;
            }

            if ($.isEmpty(whTValue)) {
                isNotWhToValue = true;
            }
            //그리드 내용이 없을경우
            if (!gridItems || !(gridItems.length > 0)) {
                //ecount.alert(ecount.resource.MSG06097);
                if (thisObj.searchFormParameter.INCLUDE_STOCK_YN != 'Y') {
                    //파라미터를 Y값으로 변경하여 검색을 돌린후 조건문에서 재고포함처리를 함
                    thisObj.searchFormParameter.INCLUDE_STOCK_YN = 'Y';
                    thisObj.onHeaderSearch1('button', '');
                } else {
                    //검색후 내용이없을때 파라미터 상으로는 재고포함으로 표현
                    thisObj.searchFormParameter.INCLUDE_STOCK_YN = 'N';
                    thisObj.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE = 'N';
                    thisObj.setIncludeStocks(false);
                }
                return false;
            }

            this.searchFormParameter.INCLUDE_STOCK_SEARCH_FLAG = 'Y';
            if (this._totalCount < this._moreCount) {
                this.searchFormParameter.INCLUDE_STOCK_YN = 'N';
                this.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE = 'N';

                thisObj.contents.getGrid().draw(thisObj.searchFormParameter);

                return false;
            }
            //예외로직 체크 후 로딩화면
            thisObj.showProgressbar(true, null, 0);

            for (i = 0; i < gridItems.length; i++) {
                if (!$.isEmpty(grid.getCell('PROD_CD', gridItems[i][gridConst]))) {

                    paramData.ProdList.push({
                        ROW_KEY: gridItems[i][gridConst],
                        PROD_CD: grid.getCell('PROD_CD', gridItems[i][gridConst]),
                        WH_CD: whFValue,
                        WH_CD_T: whTValue,
                    });
                }
            }

            ecount.common.api({
                url: "/Inventory/Common/GetViewInventoryOrWhQty",
                async: true,
                data: Object.toJSON(paramData),
                success: function (result) {
                    //해당항목이 추가가안된상태로 로직을 돌면 오류가 나는관계로 체크로직추가
                    var columnId = "STOCKS.BAL_QTY";
                    if (bal_val != undefined) {
                        grid.setColumnVisibility("STOCKS.BAL_QTY", true);
                    }

                    if (wh_f_val != undefined) {
                        grid.setColumnVisibility("STOCKS.WH_F_QTY", true);
                        if (thisObj.searchFormParameter.WH_CD != "")
                            columnId = "STOCKS.WH_F_QTY";
                    }

                    if (wh_t_val != undefined) {
                        grid.setColumnVisibility("STOCKS.WH_T_QTY", true);
                        if (thisObj.searchFormParameter.WH_CD != "")
                            columnId = "STOCKS.WH_T_QTY";
                    }
                    grid.setCellTransaction().start();

                    var isSort = false;
                    var items = result && result.Data && result.Data.length > 0 ? result.Data : paramData.ProdList;
                    items.forEach(function (qtyItem, i) {
                        grid.setCell("STOCKS.BAL_QTY", qtyItem.ROW_KEY, qtyItem.BAL_QTY || "0");
                        grid.setCell("STOCKS.WH_F_QTY", qtyItem.ROW_KEY, isNotWhFromValue ? "" : (qtyItem.WH_QTY || "0"));
                        grid.setCell("STOCKS.WH_T_QTY", qtyItem.ROW_KEY, isNotWhToValue ? "" : (qtyItem.WH_QTY_T || "0"));
                        if (isSort == false && (qtyItem.BAL_QTY != 0 || qtyItem.WH_QTY != 0 || qtyItem.WH_QTY_T != 0))
                            isSort = true;
                    });
                    grid.setCellTransaction().end();
                    //파라미터를 바꿔줘서 다시 검색할때 파라미터값을 기반으로 재고미포함으로 변경처리
                    thisObj.searchFormParameter.INCLUDE_STOCK_YN = 'N';
                    thisObj.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE = 'N';
                    thisObj.setIncludeStocks(false);

                    if (thisObj._IsF9 == "keyDown" && thisObj.isMoreFlag && isSort) {
                        grid.toSort("D", columnId, null, null, true, false, false);
                        var rows = grid.getRowList(ecount.grid.constValue.sectionType.thead, null, {});
                        grid.refreshCell(ecount.grid.constValue.sectionType.thead, columnId, rows[0][ecount.grid.constValue.keyColumnPropertyName]);
                    }
                },
                complete: function () {
                    thisObj.hideProgressbar(true);
                }
            });
        } else {
            this.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE = 'Y';
            this.setIncludeStocks(true);
        }
    },

    // Not Include Stock Column
    // 재고 미포함
    onFooterNotIncludeStockQty: function () {
        if (this.searchFormParameter.IS_LIMIT) {
            //천건이상 조회일때는 재고포함검색 플래그상태 변경하지 않음
            this.searchFormParameter.INCLUDE_STOCK_SEARCH_FLAG = 'N';
        }
        this.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE = 'Y';
        this.setIncludeStocks(true);
    },

    setIncludeStocks: function (isHide) {
        var grid = this.contents.getGrid().grid;
        grid.settings().setColumns([
            { id: 'STOCKS.BAL_QTY', isHideColumn: isHide },
            { id: 'STOCKS.WH_F_QTY', isHideColumn: isHide },
            { id: 'STOCKS.WH_T_QTY', isHideColumn: isHide }
        ]);

        if (isHide) {
            var bal_val = grid.getColumnInfo('STOCKS.BAL_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.BAL_QTY').dataType;
            var wh_f_val = grid.getColumnInfo('STOCKS.WH_F_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.WH_F_QTY').dataType;
            var wh_t_val = grid.getColumnInfo('STOCKS.WH_T_QTY') == undefined ? undefined : grid.getColumnInfo('STOCKS.WH_T_QTY').dataType;

            //해당항목이 추가가안된상태로 로직을 돌면 오류가 나는관계로 체크로직추가
            if (bal_val != undefined) {
                grid.setColumnVisibility("STOCKS.BAL_QTY", false);
            }

            if (wh_f_val != undefined) {
                grid.setColumnVisibility("STOCKS.WH_F_QTY", false);
            }

            if (wh_t_val != undefined) {
                grid.setColumnVisibility("STOCKS.WH_T_QTY", false);
            }
        }



        var includeControl = this.footer.get(0).getControl("IncludeStockQty");
        var notIncludeControl = this.footer.get(0).getControl("NotIncludeStockQty");
        if (isHide) {
            includeControl.show();
            notIncludeControl.hide();
            includeControl.setAllowClick();
        } else {
            includeControl.hide();
            notIncludeControl.show();
            notIncludeControl.setAllowClick();
        }

    },

    /**********************************************************************
    *  hotkey [f1~12, 방향키등.. ]
    **********************************************************************/
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onHeaderSearch1('button', '');
        }
        else {
            if (this.isApplyDisplayDoNotShow) {
                // 적용버튼 보여주지 않음.
            }
            else if (this.isApplyDisplayFlag || this.viewBag.FormInfos.SP900.option.inputMethod == "K") {
                this.onFooterApply();
            }
        }
    },

    ON_KEY_F7: function () {
        if (this.IsShowStockButton) {
            //재고포함버튼 보이는 여부
            if (this.searchFormParameter.INCLUDE_STOCK_BUTTON_VISIBLE == 'Y') {
                // 재고포함보기
                this.onFooterIncludeStockQty();
            }
            else {
                // 재고 미포함
                this.onFooterNotIncludeStockQty();
            }
        }
    },

    /**********************************************************************
    *  ## F2
    **********************************************************************/
    ON_KEY_F2: function () {
        this.contents.getGrid("dataGrid" + this.pageID).grid.blur();
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    /**********************************************************************
    *  ## ESC
    **********************************************************************/
    ON_KEY_ESC: function () {
        if (!$.isEmpty(this.parentLoadData)) {
            if (this.getParentInstance(this.getParentInstance().pageID).setProdCloseFocus) {
                this.getParentInstance(this.getParentInstance().pageID).setProdCloseFocus(this.parentLoadData, this.rowKey);
            }
        }
        this.close();
        return false;
    },

    /**********************************************************************
    *  ## ON_KEY_DOWN
    **********************************************************************/
    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
    },

    /**********************************************************************
    *  ## ON_KEY_UP
    **********************************************************************/
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
    },

    /**********************************************************************
    *  ## ENTER
    **********************************************************************/
    ON_KEY_ENTER: function () {
        if (this.header && this.header.isVisible() && this.header.currentTabId != "advanced") {
            this.onHeaderSearch1('button', '');
        }
    },

    /**********************************************************************
    *  ## onMouseupHandler
    **********************************************************************/
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    /**********************************************************************
    *  ## ON_KEY_TAB
    **********************************************************************/
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    },

    /**********************************************************************
    * 신규 등록 후 리턴 함수
    **********************************************************************/
    getObjects: function (obj, val) {
        var retvalue = '';
        $.each(obj, function (i, adata) {
            if (adata.Key.CODE_NO == val)
                retvalue = adata.CODE_DES;
        })
        return retvalue;
    },

    gridFocus: function () {

    },

    // 입력 데이터 내려주기
    setInputSendMessage: function (data, gubun, load) {
        if (this.isFromFavoriteCode || this.isDefaultSendMessage) {
            if (gubun == "chk") {
                return;
            }

            var message = {
                name: "PROD_DES",
                code: "PROD_CD",
                data: [data],
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
            return;
        }

        if (load !== "L") {
            if ((this.SerialFlag || "N") == "N") { /*시리얼이 사용중이면, 값을 초기화하면 안된다.*/
                data.SERIAL_IDX = "";
            };
        }

        if (gubun == "chk") {
            this.chkflag = true;
        }

        var AddData = this.setDataSetting(gubun);
        //AddData 없는 것은 품목을 넣을 그리드 row가 없는것
        if (!AddData) {
            return false;
        }
        if (this.isSpecGroupAdd) {
            var numrow = this.rowAddCnt;
            AddData.rowKey = (numrow).toString();
            AddData.rowIdx = this.rowKey;
        }

        //시리얼코드와 연결된 품목코드를 조회만하고 저장을 안할시 sale013에 저장x(ex. 바코드검증)
        if (this.isNotSaveSerial) {
            data.isNotSaveSerial = true; 
        }

        var Data = ecmodule.common.prod.setInputSendMessage(this, data, AddData);

        if ($.isNull(Data)) {
            return false;
        }

        if ($.isEmpty(this.SerialFlag)) this.SerialFlag = ecount.config.inventory.USE_SERIAL;
        
        this.parentLoadData = Data.INPUTFOCUS;

        if ((this.SerialFlag || "N") == "Y") {
            Data["SERIAL_FLAG"] = this.SerialFlag;
            Data["SERIAL_IDX"] = data.SERIAL_IDX;
        };

        if ((AddData.BGubun == "Y" || AddData.BGubun2 == "Y") && gubun !== "chk" && this.SerialFlag != "N") {
            Data.rowKey = this.rowKey;
            Data.rowIdx = this.rowIdx;
        }
        else if (!Data.BARCODEADD && (AddData.BGubun == "Y" || AddData.BGubun2 == "Y") && gubun !== "chk" && this.SerialFlag == "N") {
            Data.rowKey = AddData.lastRowKey || "0";
            Data.rowIdx = AddData.lastRowIdx || "0";
        }
        else if (gubun !== "chk" && this.chkflag) {
            Data.ApplyGubun = true;
            if (Data.BARCODEADD && (AddData.BGubun == "Y" || AddData.BGubun2 == "Y") && gubun !== "chk" && this.SerialFlag == "N") {
                Data.oldrowKey = AddData.lastRowKey;
            }
            else {
                Data.oldrowKey = this.rowKey;
            }
            Data.rowIdx = this.rowIdx;
        }
        else {
            Data.rowKey = AddData.rowKey;
            Data.rowIdx = AddData.rowIdx;
        };

        // 체크박스를 클릭 했을땐  포커스를 제거 한다.
        if (gubun == "chk") {
            Data.INPUTFOCUS = "";
        }
        Data.totalItemCnt = 1;
        Data.ItemCnt = 0;

        var message = {
            name: "PROD_DES",
            code: "PROD_CD",
            data: Data,
            isAdded: this.isCheckBoxDisplayFlag,
            isNextFocus: (gubun == "chk") ? false : true,
            deleteFocus: (gubun == "chk") ? true : false,
            callback: (gubun !== "chk") ? this.close.bind(this) : null
        };
        if (AddData.BGubun == "Y" && gubun == "chk") {
            this.rowKey++;
            this.parentLoadData = "prod_cd";
        };
        this.sendMessage(this, message);
        this.rowAddCnt++;

        return true;
    },

    //기초 파람 설정
    setDataSetting: function (gubun) {
        var parentrow;
        if (gubun != "chk" && this.rowAddCnt == 0) this.isFirstClick = true;

        if (gubun != "chk" && this.rowAddCnt > 0 && (this.barCode == "Y" || this.barCode2 == "Y")) {
            this.isFirstClick = true;
        }

        if (this.isSpecGroupAdd)
            this.isFirstClick = false;
        // bsy start #1501670
        var config = {
            controlID: this.controlID,
            TargetTab: this.TargetTab

        };
        // bsy end #1501670

        if (this.getParentInstance(this.getParentInstance().pageID).getGridProdPopupInfo) {
            parentrow = this.getParentInstance(this.getParentInstance().pageID).getGridProdPopupInfo(this.rowKey, this.rowIdx, this.isFirstClick, config);  // bsy start #1501670

            if (!parentrow) {
                return;
            }
            parentrow.Parent = JSON.parse(parentrow.ParentDate);

            this.barCode = parentrow.BGubun;
            this.barCode2 = parentrow.BGubun2;
        }

        return parentrow;
    },

    //규격 팝업을 위해 만든 함수
    setDataSettingSize: function (gubun) {
        var parentrow;
        // [2016.08.29 bsy] 하단탭이 두개인 경우의 처리를 위해 추가    
        // ex)생산입고3
        var config = {
            controlID: this.controlID,
            TargetTab: this.TargetTab
        };

        if (this.getParentInstance(this.getParentInstance().pageID).getGridProdPopupInfo) {
            parentrow = this.getParentInstance(this.getParentInstance().pageID).getGridProdPopupInfo(this.rowKey, this.rowIdx, false, config);
        }

        return parentrow;
    },

    // 그리드 포커스 함수
    getObjects: function (obj, val) {
        var retvalue = '';
        $.each(obj, function (i, adata) {
            if (adata.Key.CODE_NO == val)
                retvalue = adata.CODE_DES;
        })
        return retvalue;
    },

    setLoadLastPri_Pre: function (lastPri) {

        var self = this;
        var url = "/SVC/Inventory/Basic/GetListProdForBasicSearchInfo";
        var param = {
            Request: {
                Data: {
                    PRODS: lastPri.PROD_CD,
                    IO_TYPE: this.IoType,
                    CUST: this.Cust,
                    OPEN_SEARCH_YN: "Y",
                    REQ_TYPE: 0,
                    MYPROD_FLAG: "N",
                    SFLAG: "N",
                    WH_CD: this.WHCD,
                    ADD_COLUMN: this.AddColumn,
                    INFOAPI: true,
                    FORM_SEQ: this.FORM_SER_SEQ,
                    SERIAL_DATE: this.SerialTime,
                    PARAM: this.header.getQuickSearchControl().getValue(),
                    ERR_FLAG: "1",
                    IO_CODE: this.IO_CODE

                }
            }
        };
        if (this.MariaDb == 'Y') {
            ecount.common.api({
                url: url,
                data: Object.toJSON(param),
                success: function (result) {
                    self.setLoadLastPri(lastPri, result.Data[0]);
                }
            });
        }
    },

    //최근 단가 정보 설정
    setLoadLastPri: function (lastPri, rowDataApi) {
        var rowData = this.contents.getGrid().grid.getRowItem(lastPri.PROD_CD + "∮" + lastPri.PROD_DES);

        $.extend(rowData, rowData, rowDataApi);

        $.extend(this.ParentData, this.ParentDataM, rowData);
        var Parent = this.setDataSetting('');

        this.ParentData.rowKey = Parent.rowKey;
        this.ParentData.rowIdx = Parent.rowIdx;

        var WhVatRateYn = "N";
        var WhVatRate = new Decimal(0);
        var StockVatRate = new Decimal(0);

        if (Parent.IoType == "20" || Parent.IoType == "24" || Parent.IoType == "42" || Parent.IoType == "43") {
            WhVatRate = new Decimal(ecount.config.user.ALLOW_WH_VAT_RATE_BY) || new Decimal(0);
            WhVatRateYn = ecount.config.user.ALLOW_WH_VAT_RATE_BY_BASE_YN || "N";
        }
        else {
            WhVatRate = new Decimal(ecount.config.user.ALLOW_WH_VAT_RATE) || new Decimal(0);
            WhVatRateYn = ecount.config.user.ALLOW_WH_VAT_RATE_YN || "N";
        }

        if (Parent.IoType.substring(0, 1) == "1") {
            if (ecount.config.inventory.USE_OUT_VAT_RATE == true)
                StockVatRate = new Decimal(ecount.config.inventory.OUT_VAT_RATE);
            else
                StockVatRate = new Decimal(0);
        }
        else {
            if (ecount.config.inventory.USE_IN_VAT_RATE == true)
                StockVatRate = new Decimal(ecount.config.inventory.IN_VAT_RATE);
            else
                StockVatRate = new Decimal(0);
        }


        var VAT_YN = lastPri.VAT_YN || "N";
        var TAX = new Decimal(lastPri.TAX) || new Decimal("0");

        if (VAT_YN == "Y") {
            lastPri.SALETAX = new Decimal(lastPri.TAX);
        }
        else {
            if (WhVatRateYn == "Y") {
                lastPri.SALETAX = new Decimal(WhVatRate);
            }
            else {
                lastPri.SALETAX = new Decimal(StockVatRate);
            }
        }
        if (lastPri.SALETAX.isZero() || !lastPri.SALETAX) {
            lastPri.SALETAX = new Decimal(0);
        }

        var N = "N";

        var Io_Type = Parent.Parent.Io_Type;

        //바코드관련 시작
        var bar_pos = 0; var bar_add = "N";
        if (this.BGubun == "Y") {
            if (Parent.Parent.prod_cd == lastPri.PROD_CD) {
                bar_add = "Y";
            }
        }

        var bar_re = new Decimal(Parent.Parent.qty);
        if (bar_add == "Y") {
            // 바코드가 체크 되면 수량만 업데이트 한다.
            this.ParentData.BARCODEADD = true;
            this.ParentData.QTY = bar_re.plus(1);
            this.ParentData.isQtyChange = true;
        }
        else {
            this.ParentData.PROD_CD = lastPri.PROD_CD; //코드
            if (this.BGubun == "Y") {
                this.ParentData.QTY = new Decimal(1);
                this.ParentData.isQtyChange = true;
            }

            if (["1", "2"].contains(Io_Type.substring(0, 1))) {
                this.ParentData.SIZE_DES = lastPri.SIZE_DES;
                this.ParentData.PROD_DES = lastPri.PROD_DES;
                this.ParentData.TAX = lastPri.SALETAX;
            }
            else if (["31", "41", "70", "42", "43"].contains(Io_Type) || (Io_Type == "44" && this.rowKey != "1000") && this.DGubun == "Y") {
                this.ParentData.SIZE_DES = lastPri.SIZE_DES;
                this.ParentData.PROD_DES = lastPri.PROD_DES;
            }
            else {
                if (lastPri.SIZE_DES != "") {
                    if (["AS", "71", "72"].contains(Io_Type)) {
                        this.ParentData.SIZE_DES = lastPri.SIZE_DES;
                        this.ParentData.PROD_DES = lastPri.PROD_DES;
                    }
                    else {
                        this.ParentData.PROD_DES = lastPri.PROD_DES + "[" + lastPri.SIZE_DES + "]";
                    }
                }
                else {
                    this.ParentData.PROD_DES = lastPri.PROD_DES;
                }
                if (["51", "59"].contains(Io_Type)) {
                    this.ParentData.SIZE_DES = lastPri.SIZE_DES;
                }
            }
            if (["1", "2"].contains(Io_Type.substring(0, 1)) || ["71", "72"].contains(Io_Type)) {
                this.ParentData.SIZE_DES = lastPri.SIZE_DES;
            }

            var dec_p = Parent.Parent.DecP;
            var dec_q = Parent.Parent.DecQ;

            this.ParentData.PROD_TAX = lastPri.TAX;
            this.ParentData.PROD_TAX_YN = lastPri.VAT_YN;

            var DataPrice = new Decimal(lastPri.PRICE);
            var DataUserPriceVat = new Decimal(lastPri.USER_PRICE_VAT || 0);
            var DataTax = new Decimal(lastPri.SALETAX);
            var DataInPrice = new Decimal(lastPri.IN_PRICE);
            var DataSpecialPrice = new Decimal(lastPri.SpecialPrice);

            if (!["31", "32", "70", "41", "42", "43", "44", "47", "50", "51", "58", "60", "59", "90", "91", "92", "99"].contains(Io_Type)) {
                var price = new Decimal("0");
                var userPriceVat = new Decimal("0");
                if (DataSpecialPrice.toString() == "") {
                    DataSpecialPrice = new Decimal("0");
                }
                if (DataSpecialPrice.toString() == "0" && lastPri.ChkFlag == "N") {
                    if (["1", "3"].contains(Io_Type.substring(0, 1))) {
                        if (DataPrice.toString() == "") {
                            DataPrice = new Decimal("0");
                        }
                        if (DataPrice.toString() != "0") {
                            if (lastPri.OutPriceVat.toString() == "0") {
                                price = DataPrice;
                                userPriceVat = DataUserPriceVat;
                            }
                            else {
                                price = DataPrice.div(DataTax.div(100).plus(1)).times(10).times(0.1);
                                userPriceVat = DataPrice;
                            }

                        }
                    }
                    else {
                        if (DataInPrice.toString() == "") DataInPrice = new Decimal("0");
                        if (DataInPrice.toString() != "0") {
                            if (lastPri.InPriceVat.toString() == "0") price = new Decimal(DataInPrice);
                            else {
                                price = DataInPrice.div(DataTax.div(100).plus(1)).times(10).times(0.1);
                                userPriceVat = DataInPrice;
                            }
                        }
                    }
                }
                else {
                    if (lastPri.SpriceVat.toString() == "0") {
                        price = new Decimal(DataSpecialPrice);
                    }
                    else {
                        price = DataSpecialPrice.div(DataTax.div(100).plus(1)).times(10).times(0.1);
                        userPriceVat = DataSpecialPrice;
                    }
                }

                if (price.toString() != "0") {
                    switch (dec_p) {
                        case 0: price = price.round(); break;
                        case 1: price = price.times(10).round().div(10); break;
                        case 2: price = price.times(100).round().div(100); break;
                        case 3: price = price.times(1000).round().div(1000); break;
                        case 4: price = price.times(10000).round().div(10000); break;
                        case 5: price = price.times(100000).round().div(100000); break;
                        case 6: price = price.times(1000000).round().div(1000000); break;
                        case 7: price = price.times(10000000).round().div(10000000); break;
                        case 8: price = price.times(100000000).round().div(100000000); break;
                        case 9: price = price.times(1000000000).round().div(1000000000); break;
                        case 10: price = price.times(10000000000).round().div(10000000000); break;
                    }
                    var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(price.toString(), 'R', dec_p));
                    this.ParentData.PRICE = new Decimal(num);
                }
                else {
                    this.ParentData.PRICE = new Decimal("0");
                }
                if (userPriceVat.toString() != "0") {
                    switch (dec_p) {
                        case 0: userPriceVat = userPriceVat.round(); break;
                        case 1: userPriceVat = userPriceVat.times(10).round().div(10); break;
                        case 2: userPriceVat = userPriceVat.times(100).round().div(100); break;
                        case 3: userPriceVat = userPriceVat.times(1000).round().div(1000); break;
                        case 4: userPriceVat = userPriceVat.times(10000).round().div(10000); break;
                        case 5: userPriceVat = userPriceVat.times(100000).round().div(100000); break;
                        case 6: userPriceVat = userPriceVat.times(1000000).round().div(1000000); break;
                        case 7: userPriceVat = userPriceVat.times(10000000).round().div(10000000); break;
                        case 8: userPriceVat = userPriceVat.times(100000000).round().div(100000000); break;
                        case 9: userPriceVat = userPriceVat.times(1000000000).round().div(1000000000); break;
                        case 10: userPriceVat = userPriceVat.times(10000000000).round().div(10000000000); break;
                    }
                    var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(userPriceVat.toString(), 'R', dec_p));
                    this.ParentData.PRICE_VAT_INCLUDE = new Decimal(num);
                }
                else {
                    this.ParentData.PRICE_VAT_INCLUDE = new Decimal("0");
                }

                if (["1", "2"].contains(Io_Type.substring(0, 1)) || ["71", "72", "AS"].contains(Io_Type)) {
                    if (ecount.config.inventory.UQTY_FLAG == "0") {
                        var size_qty = new Decimal("1");
                        if (lastPri.SIZE_FLAG == "1") {
                            var old_size_des = lastPri.SIZE_DES;
                            var filter = /([^0-9\.\/\*\-\+\(\)])/g

                            if (old_size_des != "") {
                                var strlen = old_size_des.length;
                                if (!filter.test(old_size_des.replace(' ', ''))) {
                                    try {
                                        size_qty = new Decimal(eval(old_size_des.replace(' ', '')));
                                    }
                                    catch (e) {
                                        size_qty = new Decimal(1);
                                    }
                                }
                            }
                            if (size_qty.toString() == "0")
                                size_qty = new Decimal(1);

                            if (size_qty > 0) {
                                if (dec_q == 0) {
                                    size_qty = size_qty.floor();
                                }
                                else if (dec_q == 1) {
                                    size_qty = size_qty.times(10).round().div(10);
                                }
                                else if (dec_q == 2) {
                                    size_qty = size_qty.times(100).round().div(100);
                                }
                                else if (dec_q == 3) {
                                    size_qty = size_qty.times(1000).round().div(1000);
                                }
                                else if (dec_q == 4) {
                                    size_qty = size_qty.times(10000).round().div(10000);
                                }
                                else if (dec_q == 5) {
                                    size_qty = size_qty.times(100000).round().div(100000);
                                }
                                else if (dec_q == 6) {
                                    size_qty = size_qty.times(1000000).round().div(1000000);
                                }
                                var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(size_qty.toString(), 'R', Parent.Parent.DecQ));
                                this.ParentData.QTY = num;
                                this.ParentData.isQtyChange = true;
                            }
                        }
                    }
                    else {
                        this.ParentData.UQTY = new Decimal(lastPri.ExchRate);
                        this.ParentData.isUqtyChange = true;
                        //this.ParentData.EXCH_RATE = new Decimal(lastPri.ExchRate);
                    }
                    this.ParentData.SIZE_FLAG = lastPri.SIZE_FLAG;
                    this.ParentData.BAL_FLAG = lastPri.BAL_FLAG;
                }
            }

            if (["20", "71", "72", "42", "43"].contains(Io_Type)) {
                this.ParentData.BAL_FLAG = lastPri.BAL_FLAG;
            }
        }

        if (this.ParentData.BARCODEADD) {
            this.ParentData.INPUTFOCUS = "prod_cd";
        }
        else {

            if (!$.isEmpty(this.FcName)) {
                if (Io_Type == "44" && this.rowKey == 1000) {
                    if (this.FcName == "qty") {
                        this.ParentData.QTY_FOCUS = true;
                    }
                    else {
                        this.ParentData.UQTY_FOCUS = true;
                    }
                }
                else {
                    if (this.IoType != "42") {
                        if (this.FcName == "qty") {
                            this.ParentData.QTY_FOCUS = true;
                        }
                        else {
                            this.ParentData.UQTY_FOCUS = true;
                        }
                    }
                }
            }

            if (this.ParentData.UQTY_FOCUS) {
                this.ParentData.INPUTFOCUS = "uqty";
            }
            else {
                this.ParentData.INPUTFOCUS = "qty";
            }
        }

        this.ParentData.totalItemCnt = 1;
        this.ParentData.ItemCnt = 0;

        var message = {
            name: "PROD_DES",
            code: "PROD_CD",
            data: this.ParentData,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "current",
            callback: this.close.bind(this, false)
        };
        this.sendMessage(this, message);


    },

    //단가 클릭
    setLoadPrice: function (data) {
        $.extend(this.ParentData, this.ParentData, this.ParentDataM, data);

        if (ecount.user.SL_PRICE_RIGHT && ecount.user.SL_PRICE_RIGHT == "N") {
            ecount.alert(ecount.resource.MSG04738);
            return;
        }

        this.Parent = this.setDataSetting('');

        this.ParentData.rowKey = this.Parent.rowKey;
        this.ParentData.rowIdx = this.Parent.rowIdx;

        var rowIdx = this.rowKey;

        this.ParentData.PROD_CD = data.PROD_CD; //코드
        this.ParentData.PROD_DES = data.PROD_DES; //품목명
        this.ParentData.SIZE_DES = data.SIZE_DES; //규격명
        this.ParentData.TAX = data.TAX; //tax

        this.ParentData.PRICE = new Decimal(data.Price || 0);
        this.ParentData.PRICE_VAT_INCLUDE = new Decimal(data.VAT || 0);

        //품목 셋트여부
        this.ParentData.SET_FLAG = data.SET_FLAG;
        //품목구분 설정
        this.ParentData.PROD_TYPE = data.PROD_TYPE;
        this.ParentData.PROD_SELL_TYPE = data.PROD_SELL_TYPE;

        if (this.Parent.Parent.cust == "") {
            this.ParentData.CUST = data.BUSINESS_NO;
            this.ParentData.CUST_DES = data.CUST_NAME;
        }

        if (this.IoType.substring(0, 1) == "1" || this.IoType.substring(0, 1) == "2") {
            if (data.UNIT != undefined) {
                this.ParentData.UNIT = data.UNIT; //단위
            }
            else {
                this.ParentData.UNIT = ""; //단위
            }
        }

        if ((this.IoType.substring(0, 1) == '1') || (this.IoType.substring(0, 1) == '3')) {
            this.ParentData.PROD_TAX = data.TAX;
            this.ParentData.PROD_TAX_YN = data.VAT_YN;
        }
        else {
            this.ParentData.PROD_TAX = data.VAT_RATE_BY;
            this.ParentData.PROD_TAX_YN = data.VAT_RATE_BY_BASE_YN;
        }

        if (data.Price != 0) {
            if ((this.IoType.substring(0, 1) == '1') || (this.IoType.substring(0, 1) == '3')) {
                this.ParentData.EXCH_RATE = data.ExchRate;

                this.ParentData.QTY = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(data.ExchRate.toString(), 'R', this.Parent.Parent.DecP));
                this.ParentData.isQtyChange = true;
            }
        }

        if (this.IoType.substring(0, 1) == '1' || this.IoType.substring(0, 1) == '2') {
            var strUqtyFlags;
            if (this.IoType.substring(0, 1) == '1')
                strUqtyFlags = ecount.config.inventory.UQTY_FLAG;
            if (strUqtyFlags == "0") {
                // 규격계산시작
                var size_qty = new Decimal(1);
                if (data.SIZE_FLAG == '1') {
                    var old_size_des = data.SIZE_DES;
                    var filter = /([^0-9\.\/\*\-\+\(\)])/g

                    if (old_size_des != "") {
                        var strlen = old_size_des.length;
                        var calc = 0;
                        for (i = 0; i < strlen; i++) {
                            if (old_size_des.charAt(i) == "*" || old_size_des.charAt(i) == "/" || old_size_des.charAt(i) == "+" || old_size_des.charAt(i) == "-")
                                calc++;
                        }

                        if (calc > 0) {
                            try {
                                size_qty = new Decimal(eval(old_size_des.replace(' ', '')));
                            }
                            catch (e) {
                                size_qty = new Decimal(1);
                            }
                        }
                    }
                    if (size_qty.toString == "0")
                        size_qty = new Decimal(1);


                    if (size_qty > 0) {
                        if (dec_q == 0) {
                            size_qty = size_qty.floor();
                        } else if (dec_q == 1) {
                            size_qty = size_qty.times(10).round().div(10);
                        } else if (dec_q == 2) {
                            size_qty = size_qty.times(100).round().div(100);
                        } else if (dec_q == 3) {
                            size_qty = size_qty.times(1000).round().div(1000);
                        } else if (dec_q == 4) {
                            size_qty = size_qty.times(10000).round().div(10000);
                        }
                        var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(size_qty.toString(), 'R', dec_q)); //size_qty;
                    }

                }

                if (this.Parent.Parent.PageType) {
                    if (this.Parent.Parent.iscust && !this.Parent.Parent.iscust_hidden && !this.Parent.Parent.iscust_readOnly)
                        this.ParentData.CUST_FOCUS = true;
                    else if (this.Parent.Parent.iswh_cd)
                        this.ParentData.WH_CD_FOCUS = true;
                    else
                        this.ParentData.QTY_FOCUS = true;
                }
                else {
                    if (strUqtyFlags == "1")
                        this.ParentData.UQTY_FOCUS = true;
                    else
                        this.ParentData.QTY_FOCUS = true;
                }
            }
            else {
                if (this.Parent.Parent.PageType) {
                    if (this.Parent.Parent.iscust && !this.Parent.Parent.iscust_hidden && !this.Parent.Parent.iscust_readOnly)
                        this.ParentData.CUST_FOCUS = true;
                    else if (this.Parent.Parent.iswh_cd)
                        this.ParentData.WH_CD_FOCUS = true;
                    else
                        this.ParentData.QTY_FOCUS = true;
                }
                else {
                    if (this.UQtyUse == "Y" || this.UQtyUse == "1")
                        this.ParentData.UQTY_FOCUS = true;
                    else
                        this.ParentData.QTY_FOCUS = true;
                }
            }
            this.ParentData.SIZE_FLAG = data.SIZE_FLAG;
            this.ParentData.BAL_FLAG = data.BAL_FLAG;
        }
        else {
            if (this.Parent.Parent.PageType) {
                if (this.Parent.Parent.iscust && !this.Parent.Parent.iscust_hidden && !this.Parent.Parent.iscust_readOnly)
                    this.ParentData.CUST_FOCUS = true;
                else if (this.Parent.Parent.iswh_cd)
                    this.ParentData.WH_CD_FOCUS = true;
                else
                    this.ParentData.QTY_FOCUS = true;
            }
            else {
                this.ParentData.QTY_FOCUS = true;
            }
        }
        if (this.IoType == '20' || this.IoType == '71' || this.IoType == '72') {
            this.ParentData.BAL_FLAG = data.BAL_FLAG;
        }

        if (this.isSetInputValue) {
            //ecount.parentFrame.fnSetInputValue(this.rowKey, A);
        }

        // 품목 검사항목(품질관리)
        if (this.isGetProdInspectItem) {
            //ecount.parentFrame.fnGetProdInspectItem(this.rowKey);
        }
        //관리항목
        this.ParentData.ITEM_TYPE = data.ITEM_TYPE;
        if (data.ITEM_TYPE == "N") {
            this.ParentData.ITEM_CD = "";
            this.ParentData.ITEM_DES = "";
            this.ParentData.ITEM_DES_READONLY = true;
        } else if (this.Parent.Parent.item_des_ReadOnly == true) {
            this.ParentData.ITEM_DES_READONLY = false;
        }
        //시리얼
        this.ParentData.SERIAL_TYPE = data.SERIAL_TYPE;
        if (data.SERIAL_TYPE == "N") {
            this.ParentData.SERIALNO = "";

            if (this.Parent.Parent.isSerial_cd)
                this.ParentData.SERIAL_CD_CSS = "link-gray";
        }
        //판매
        if (this.Parent.Parent.ware_flag) {
            if (this.Parent.WarePermit && (this.Parent.WarePermit == "R" || this.Parent.WarePermit == "X")) {
                this.ParentData.CHKWARE_CHECKED = false;
                this.ParentData.WARE_FLAG_CHECKED = false;
            } else {
                if (!this.Parent.Parent.ware_check && ((data.PROD_SELL_TYPE == "Y") || (data.PROD_SELL_TYPE == "B" && ecount.config.inventory.PROD_SELL_YN && ecount.config.inventory.PROD_SELL_YN == "Y"))) {
                    //ecount.parentFrame.fnWareChk2(this.rowKey);
                }
                if (data.PROD_SELL_TYPE == "Y") {
                    this.ParentData.CHKWARE_CHECKED = true;
                } else if (data.PROD_SELL_TYPE == "N") {
                    this.ParentData.CHKWARE_CHECKED = false;
                } else {
                    if (ecount.config.inventory.PROD_SELL_YN && ecount.config.inventory.PROD_SELL_YN == "Y")
                        this.ParentData.CHKWARE_CHECKED = true;
                    else
                        this.ParentData.CHKWARE_CHECKED = false;
                }
            }
        }
        //창고이동
        else if (this.IoType == "31") {
            if (this.Parent.WarePermit && (this.Parent.WarePermit == "R" || this.Parent.WarePermit == "X")) {
                this.ParentData.CHKWARE_CHECKED = false;
                this.ParentData.WARE_FLAG_CHECKED = false;
            } else {
                if (!this.Parent.Parent.ware_flag && ((data.PROD_WHMOVE_TYPE == "Y") || (data.PROD_WHMOVE_TYPE == "B" && this.Parent.Parent.ProdWhmoveYn && this.Parent.Parent.ProdWhmoveYn == "Y"))) {
                    //ecount.parentFrame.fnWareChk2(rowIdx);
                }
                if (data.PROD_WHMOVE_TYPE == "Y") {
                    this.ParentData.CHKWARE_CHECKED = true;
                } else if (data.PROD_WHMOVE_TYPE == "N") {
                    this.ParentData.CHKWARE_CHECKED = false;
                } else {
                    if (this.Parent.Parent.ProdWhmoveYn && this.Parent.Parent.ProdWhmoveYn == "Y")
                        this.ParentData.CHKWARE_CHECKED = true;
                    else
                        this.ParentData.CHKWARE_CHECKED = false;
                }
            }
        }
        //생산입고
        this.ParentData.QC_YN = data.QC_YN;
        //구매        
        this.ParentData.QC_BUY_TYPE = data.QC_BUY_TYPE;

        if (this.ParentData.PROD_CD_FOCUS) {
            this.ParentData.INPUTFOCUS = "prod_cd";
        }
        else if (this.ParentData.SERIAL_CD_FOCUS) {
            this.ParentData.INPUTFOCUS = "serial_cd";
        }
        else if (this.ParentData.QTY_FOCUS) {
            this.ParentData.INPUTFOCUS = "qty";
        }
        else if (this.ParentData.UQTY_FOCUS) {
            this.ParentData.INPUTFOCUS = "uqty";
        }
        else {
            this.ParentData.INPUTFOCUS = "qty";
        }


        if (this.Parent.Parent.RptGubun && this.Parent.Parent.RptGubun == "SELL") {
            this.ParentData.ACCTSUBPROD = data.ecount0;
            this.ParentData.ACCTSUBSIZE = data.ecount1;
            this.ParentData.ACCTSUBBIGO = data.ecount6;
        }

        $.extend(this.ParentData, this.ParentData, this.InputData);

        this.ParentData.totalItemCnt = 1;
        this.ParentData.ItemCnt = 0;
        
        var message = {
            name: "PROD_DES",
            code: "PROD_CD",
            data: this.ParentData,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "current",
            isNextFocus: true,          // dev.46419
            callback: this.close.bind(this, false)
        };
        this.sendMessage(this, message);

    },

    fnLink: function (prodcd, proddes, prodType, setFlag) {
        if (this.IoType == "91" || this.IoType == "92") {
            if ((this.hfTabGubun == "tabSet" && setFlag == "1") || (this.hfTabGubun != "tabSet" && (prodType == "1" || prodType == "3"))) {
                if (this.hfTabGubun != "tabSet" && (prodType == "1" || prodType == "3")) {
                    ecount.alert(ecount.resource.MSG01758);
                }
                return false;
            }
        }


        this.isOnePopupClose = true;
        this.header.changeTab("quick");
        this.header.getControl("search1").setValue(prodcd)

        var fromheader = this.header.getControl("search1", "quick").getValue();
        this.searchFormParameter.SEARCH_GB = "0";
        this.searchFormParameter.PARAM = fromheader.keyword;
        this.searchFormParameter.DEL_GUBUN = fromheader.status;



        this.searchFormParameter.NEWITEM = "N";
        this.searchFormParameter.SeachType = "B";
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().draw(this.searchFormParameter);



        //this.header.toggle();
    },
    // 파일 관리 등록 후 그리드 다시 작성
    SetReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },



    onClosedPopupHandler: function (page, target) {

        if (target == false)
            return;

        var data = {
            closeFlag: true
        }

        var message = {
            name: false,
            code: false,
            data: data,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "current"
            // callback: this.close.bind(this, false)
        };
        this.sendMessage(this, message);
    },

    setProdInputDataSave: function (result) {
        var Key = {};
        Key.PROD_TYPE = result.PROD_TYPE;
        Key.INSPECT_STATUS = result.INSPECT_STATUS;
        Key.SAMPLE_PERCENT = result.SAMPLE_PERCENT;
        Key.CALC_VAL = result.CALC_VAL;
        Key.CALC_NOTMATH_VAL = result.CALC_NOTMATH_VAL;

        Key.CLASS_CD = result.CLASS_CD;
        Key.CLASS_CD2 = result.CLASS_CD2;
        Key.CLASS_CD3 = result.CLASS_CD3;
        Key.CLASS_DES = result.CLASS_DES;
        Key.CLASS_DES2 = result.CLASS_DES2;
        Key.CLASS_DES3 = result.CLASS_DES3;
        Key.BAR_CODE = result.BAR_CODE;
        Key.VAT_RATE_BY = result.VAT_RATE_BY;
        Key.EXCH_RATE = result.EXCH_RATE;
        Key.EXCH_RATE2 = result.EXCH_RATE2;
        Key.DENO_RATE = result.DENO_RATE;
        
        if (result.IN_PRICE_VAT_YN == true) {
            Key.IN_PRICE = result.IN_PRICE_VAT_INCLUDE;
        } else {
            Key.IN_PRICE = result.IN_PRICE;
        }

        if (result.OUT_PRICE_VAT_YN == true) {
            Key.OUT_PRICE = result.OUT_PRICE_VAT_INCLUDE;
        } else {
            Key.OUT_PRICE = result.OUT_PRICE;
        }

        if (result.OUT_PRICE1_VAT_YN == true) {
            Key.OUT_PRICE1 = result.OUT_PRICE1_VAT;
        } else {
            Key.OUT_PRICE1 = result.OUT_PRICE1;
        }

        if (result.OUT_PRICE2_VAT_YN == true) {
            Key.OUT_PRICE2 = result.OUT_PRICE2_VAT;
        } else {
            Key.OUT_PRICE2 = result.OUT_PRICE2;
        }

        if (result.OUT_PRICE3_VAT_YN == true) {
            Key.OUT_PRICE3 = result.OUT_PRICE3_VAT;
        } else {
            Key.OUT_PRICE3 = result.OUT_PRICE3;
        }

        if (result.OUT_PRICE4_VAT_YN == true) {
            Key.OUT_PRICE4 = result.OUT_PRICE4_VAT;
        } else {
            Key.OUT_PRICE4 = result.OUT_PRICE4;
        }

        if (result.OUT_PRICE5_VAT_YN == true) {
            Key.OUT_PRICE5 = result.OUT_PRICE5_VAT;
        } else {
            Key.OUT_PRICE5 = result.OUT_PRICE5;
        }
        if (result.OUT_PRICE6_VAT_YN == true) {
            Key.OUT_PRICE6 = result.OUT_PRICE6_VAT;
        } else {
            Key.OUT_PRICE6 = result.OUT_PRICE6;
        }

        if (result.OUT_PRICE7_VAT_YN == true) {
            Key.OUT_PRICE7 = result.OUT_PRICE7_VAT;
        } else {
            Key.OUT_PRICE7 = result.OUT_PRICE7;
        }

        if (result.OUT_PRICE8_VAT_YN == true) {
            Key.OUT_PRICE8 = result.OUT_PRICE8_VAT;
        } else {
            Key.OUT_PRICE8 = result.OUT_PRICE8;
        }

        if (result.OUT_PRICE9_VAT_YN == true) {
            Key.OUT_PRICE9 = result.OUT_PRICE9_VAT;
        } else {
            Key.OUT_PRICE9 = result.OUT_PRICE9;
        }

        if (result.OUT_PRICE10_VAT_YN == true) {
            Key.OUT_PRICE10 = result.OUT_PRICE10_VAT;
        } else {
            Key.OUT_PRICE10 = result.OUT_PRICE10;
        }


        Key.OUT_PRICE2 = result.OUT_PRICE2;
        Key.OUT_PRICE3 = result.OUT_PRICE3;
        Key.OUT_PRICE4 = result.OUT_PRICE4;
        Key.OUT_PRICE5 = result.OUT_PRICE5;
        Key.OUT_PRICE6 = result.OUT_PRICE6;
        Key.OUT_PRICE7 = result.OUT_PRICE7;
        Key.OUT_PRICE8 = result.OUT_PRICE8;
        Key.OUT_PRICE9 = result.OUT_PRICE9;
        Key.OUT_PRICE10 = result.OUT_PRICE10;
        Key.NO_USER1 = result.NO_USER1;
        Key.NO_USER2 = result.NO_USER2;
        Key.NO_USER3 = result.NO_USER3;
        Key.NO_USER4 = result.NO_USER4;
        Key.NO_USER5 = result.NO_USER5;
        Key.NO_USER6 = result.NO_USER6;
        Key.NO_USER7 = result.NO_USER7;
        Key.NO_USER8 = result.NO_USER8;
        Key.NO_USER9 = result.NO_USER9;
        Key.NO_USER10 = result.NO_USER10;
        Key.CALC_VAL_ORIGIN = result.CALC_VAL;
        Key.CALC_NOTMATH_VAL_ORIGIN = result.CALC_NOTMATH_VAL;
        Key.SAFE_QTY = result.SAFE_QTY;
        Key.REMARKS = result.REMARKS;
        Key.REMARKS_WIN = result.REMARKS_WIN;
        Key.WH_CD = result.WH_CD;
        Key.WH_DES = result.WH_DES;
        Key.CONT1 = result.CONT1;
        Key.CONT2 = result.CONT2;
        Key.CONT3 = result.CONT3;
        Key.CONT4 = result.CONT4;
        Key.CONT5 = result.CONT5;
        Key.CONT6 = result.CONT6;

        Key.OUT_PRICE1_VAT_YN = result.OUT_PRICE1_VAT_YN;
        Key.OUT_PRICE2_VAT_YN = result.OUT_PRICE2_VAT_YN;
        Key.OUT_PRICE3_VAT_YN = result.OUT_PRICE3_VAT_YN;
        Key.OUT_PRICE4_VAT_YN = result.OUT_PRICE4_VAT_YN;
        Key.OUT_PRICE5_VAT_YN = result.OUT_PRICE5_VAT_YN;
        Key.OUT_PRICE6_VAT_YN = result.OUT_PRICE6_VAT_YN;
        Key.OUT_PRICE7_VAT_YN = result.OUT_PRICE7_VAT_YN;
        Key.OUT_PRICE8_VAT_YN = result.OUT_PRICE8_VAT_YN;
        Key.OUT_PRICE9_VAT_YN = result.OUT_PRICE9_VAT_YN;
        Key.OUT_PRICE10_VAT_YN = result.OUT_PRICE10_VAT_YN;
        
        Key.OUT_PRICE1_VAT = result.OUT_PRICE1_VAT;
        Key.OUT_PRICE2_VAT = result.OUT_PRICE2_VAT;
        Key.OUT_PRICE3_VAT = result.OUT_PRICE3_VAT;
        Key.OUT_PRICE4_VAT = result.OUT_PRICE4_VAT;
        Key.OUT_PRICE5_VAT = result.OUT_PRICE5_VAT;
        Key.OUT_PRICE6_VAT = result.OUT_PRICE6_VAT;
        Key.OUT_PRICE7_VAT = result.OUT_PRICE7_VAT;
        Key.OUT_PRICE8_VAT = result.OUT_PRICE8_VAT;
        Key.OUT_PRICE9_VAT = result.OUT_PRICE9_VAT;
        Key.OUT_PRICE10_VAT = result.OUT_PRICE10_VAT;

        Key.IN_PRICE_VAT = result.IN_PRICE_VAT_INCLUDE;
        Key.IN_PRICE_VAT_YN = result.IN_PRICE_VAT_YN;
        Key.OUT_PRICE_VAT = result.OUT_PRICE_VAT_INCLUDE;
        Key.OUT_PRICE_VAT_YN = result.OUT_PRICE_VAT_YN;


        Key.SET_FLAG = result.SET_FLAG;

        if (!$.isEmpty(result.CALC_VAL)) {
            var calcCols = result.CALC_VAL.split('§').where(function (col) { return col.indexOf("NO_USER") > -1 });
            var calcValue = result.CALC_VAL;
            var calcNotMathValue = result.CALC_NOTMATH_VAL;
            calcCols.forEach(function (item, i) {                
                var reCol = RegExp(String.format("§{0}§", item), 'gi');
                calcValue = calcValue.replace(reCol, new Decimal(result[item] || "0").toString());
                calcNotMathValue = calcNotMathValue.replace(reCol, new Decimal(result[item] || "0").toString());
            });            
            Key.CALC_VAL = calcValue;
            Key.CALC_NOTMATH_VAL = calcNotMathValue;
            Key.SIZE_DES = calcNotMathValue;
        }

        return Key;
    },

    //  품목 기본 정보
    setProdBasicInfo: function (data) {
        var self = this;
        var url = "/SVC/Inventory/Basic/GetListProdForBasicSearchInfo";
        var param = {
            Request: {
                Data: {
                    PRODS: data.rowItem.PROD_CD,
                    IO_TYPE: this.IoType,
                    CUST: this.Cust,
                    OPEN_SEARCH_YN: "Y",
                    REQ_TYPE: 0,
                    MYPROD_FLAG: "N",
                    SFLAG: "N",
                    WH_CD: this.WHCD,
                    ADD_COLUMN: this.AddColumn,
                    INFOAPI: true,
                    FORM_SEQ: this.FORM_SER_SEQ,
                    SERIAL_DATE: this.SerialTime,
                    PARAM: data.type == "check" ? "" : this.header.getQuickSearchControl().getValue(),
                    ERR_FLAG: "1",
                    IO_CODE: this.IO_CODE,
                    IsProdSearch : true
                    
                }
            }
        };

        var returnData = null;

        if (this.MariaDb == 'Y') {
            ecount.common.api({
                url: url,
                data: Object.toJSON(param),
                success: function (result) {
                    $.extend(data.rowItem, data.rowItem, result.Data[0]);
                    data.callback && data.callback(data.rowItem);
                }
            });
        }
        else {
            data.callback && data.callback(data.rowItem);
        }


        return returnData;
    },

    loadMyItemNew: function () {
        var objthis = this;
        var param = {
            Request: {
                Data: this.FavoriteRequest
            }
        };

        ecount.common.api({
            url: "/SVC/Common/Infra/GetListMyProdCodeFavorite",
            data: Object.toJSON(param),
            success: function (result) {
                if (result && result.Data && result.Data.length > 0) {
                    var prodCds = "";
                    for (var i = 0; i < result.Data.length; i++) {
                        prodCds = prodCds + result.Data[i] + ecount.delimiter;
                    }

                    param = {
                        Request: {
                            Data: {
                                ADD_COLUMN: objthis.AddColumn,
                                CUST: objthis.Cust || "",
                                IO_TYPE: objthis.IoType,
                                MYPROD_FLAG: "N",
                                OPEN_SEARCH: "Y",
                                PRODS: prodCds,
                                REQ_TYPE: 0,
                                SFLAG: "N",
                                WH_CD: "",
                                PRG_ID: this.FavoriteRequest.RootPrgId
                            }
                        }
                    };

                    ecount.common.api({
                        url: "/SVC/Inventory/Basic/GetListProdForBasicSearchInfo",
                        data: Object.toJSON(param),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            } else {
                                if (result.Data.length > 0) {
                                    // 현황, 입력 분기처리
                                    if (!objthis.isNewDisplayFlag) {
                                        var message = {
                                            name: "PROD_DES",
                                            code: "PROD_CD",
                                            data: result.Data,
                                            isAdded: objthis.isCheckBoxDisplayFlag,
                                            addPosition: "next",
                                            callback: objthis.close.bind(objthis)
                                        };
                                        objthis.sendMessage(objthis, message);
                                    }
                                    else {
                                        var PRODCD = {
                                            PROD_CD: "",
                                            callback: function (result_obj) {
                                                objthis.setFooterApplyKeyBord(result_obj, result.Data);
                                            }
                                        };
                                        for (var i = 0; i < result.Data.length; i++) {
                                            PRODCD.PROD_CD = PRODCD.PROD_CD + result.Data[i].PROD_CD + ecount.delimiter;
                                        }
                                        ecount.common.api({
                                            url: "/Inventory/Basic/GetProdSale003PriceInfoMulti",
                                            data: Object.toJSON(PRODCD),
                                            success: function (result) {
                                                PRODCD.callback && PRODCD.callback(result);
                                            }.bind(this)
                                        });
                                    }
                                } else {
                                    ecount.alert(ecount.resource.MSG05900);
                                    return;
                                }
                            }
                        }
                    });
                } else {
                    ecount.alert(ecount.resource.MSG09852);
                }
            }.bind(this)
        });
    },

    loadMyItemOld: function () {
        // 1.api를 호출하여 내품목의 리스트 내역을 가져옵니다.
        // 2.품목리스트의 데이터와 비교하여 체크를 해줍니다.

        var objthis = this;

        param = {

            IO_TYPE: objthis.IoType
            , POS: objthis.rowKey
            , FORM_SEQ: objthis.FORM_SER_SEQ
            , CLASS_TYPE: "9"
            , PROD_SEARCH: "5"
            , PARAM: ""
            , SORT_COLUMN: "PROD_CD ASC"
            , SORT_TYPE: "A"
            , PAGE_SIZE: "100"
            , SFLAG: "N"
            , REQ_TYPE: "0"
            , DEL_GUBUN: "N"
            , BARCODE2: objthis.BGubun2
            , LAN_TYPE: "ko-KR"
            , BARCODE_SEARCH: objthis.barcodechk || "N"
            , PAGE_CURRENT: 0
            , WH_CD: objthis.WHCD || ""
            , CUST: objthis.Cust || ""
            , MAIN_YN: "N"
            , ADD_COLUMN: objthis.AddColumn
            , WH_CD_T: ""
            , SEARCH_GB: ""
            , PROD_CD2: ""
            , PROD_DES: ""
            , SIZE_DES: ""
            , UNIT: ""
            , BAR_CODE: ""
            , CLASS_CD: ""
            , CLASS_CD2: ""
            , CLASS_CD3: ""
            , REMARKS_WIN: ""
            , MAIN_PROD_CD: ""
            , MAIN_PROD_DES: ""
            , CONT1: ""
            , CONT2: ""
            , CONT3: ""
            , CONT4: ""
            , CONT5: ""
            , CONT6: ""
            , NOW_DATE: objthis.viewBag.LocalTime
            , SeachType: "B"
            , NEWITEM: ""
            , SERIAL_DATE: objthis.SerialTime
            , MYPROD_FLAG: 'Y'
            , IO_CODE: this.IO_CODE
        };

        ecount.common.api({
            url: "/Inventory/Basic/GetListProdForSearch",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    if (result.Data.length > 0) {

                        // 현황, 입력 분기처리

                        if (!objthis.isNewDisplayFlag) {
                            var message = {
                                name: "PROD_DES",
                                code: "PROD_CD",
                                data: result.Data,
                                isAdded: objthis.isCheckBoxDisplayFlag,
                                addPosition: "next",
                                callback: objthis.close.bind(objthis)
                            };
                            objthis.sendMessage(objthis, message);
                        }
                        else {
                            var PRODCD = {
                                PROD_CD: "",
                                callback: function (result_obj) {
                                    objthis.setFooterApplyKeyBord(result_obj, result.Data);
                                }
                            };
                            for (var i = 0; i < result.Data.length; i++) {
                                PRODCD.PROD_CD = PRODCD.PROD_CD + result.Data[i].PROD_CD + ecount.delimiter;
                            }

                            ecount.common.api({
                                url: "/Inventory/Basic/GetProdSale003PriceInfoMulti",
                                data: Object.toJSON(PRODCD),
                                success: function (result) {
                                    PRODCD.callback && PRODCD.callback(result);
                                }.bind(this)
                            });
                        }
                    } else {
                        ecount.alert(ecount.resource.MSG05900)
                        return;
                    }
                }
            }
        });
    }

});
