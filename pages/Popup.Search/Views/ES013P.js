window.__define_resource && __define_resource("LBL03017","LBL03004","LBL05410","LBL01234","LBL02869","LBL00703","LBL04590","LBL00359","LBL00501","LBL02865","LBL04591","LBL00737","LBL00749","LBL00495","LBL00479","LBL08256","LBL08549","LBL10492","LBL10493","LBL10901","LBL35896","LBL35895","LBL10908","LBL10911","LBL10910","LBL10922","LBL10921","LBL10920","LBL10495","LBL10496","LBL13115","LBL13116","LBL09746","LBL09747","LBL13513","LBL01528","LBL01432","LBL01595","LBL02605","BTN00236","MSG02869","BTN00004","MSG01136","BTN00346","BTN00008","MSG02054","LBL02878","LBL02874");
/****************************************************************************************************
1. Create Date : 2015.04.13
2. Creator     : 노지혜
3. Description : 재고>기초등록>품목등록 > 중복확인
4. Precaution  :
5. History     : 
            2015.09.04 (강성훈) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링
            2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
            2016.05.18 (Pham Van Phu add check code for case inspection type)
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES013P", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    headerTitle: null,  //헤더명
    columnTitle1: null, // 첫번째열 컬럼명
    columnTitle2: null, // 두번째열 컬럼명 
    columnTitle3: null, // 세번째열 컬럼명 
    columnTitle4: null, // 네번째열 컬럼명
    columnLength: 2,    //컬럼출력갯수 
    testflag: false,
    validType: 'code',
    isColumSort: false,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        if ($.isNull(this.searchType))
            this.searchType = "prod_cd";

        if ($.isNull(this.keyword))
            this.keyword = "";

        this.searchFormParameter = {
            SEARCH_TYPE: this.searchType == "txtbusinessno" ? "business_no" : this.searchType
            , PARAM: this.keyword
        };
        this.columnTitle1 = ecount.resource.LBL03017;
        this.columnTitle2 = ecount.resource.LBL03004;

        if (this.searchType == "prod_cd") //품목코드
        {
            this.headerTitle = ecount.resource.LBL03017;
        }
        else if (this.searchType == "g_prod_cd") //다공정 품목코드
        {
            this.headerTitle = ecount.resource.LBL05410;
        }
        else if (this.searchType == "prod_des") //품목명
        {
            this.headerTitle = ecount.resource.LBL03004;
            this.validType = 'name';
        }
        else if (this.searchType == "bar_code") //바코드(명)
        {
            this.columnLength = 3;
            this.headerTitle = ecount.resource.LBL01234;
            this.columnTitle3 = ecount.resource.LBL01234;  //바코드
            this.validType = 'name';
        }
        else if (this.searchType == "card_no") //카드사
        {
            this.columnLength = 3;

            this.headerTitle = ecount.resource.LBL02869;
            this.columnTitle1 = ecount.resource.LBL00703;  //구분
            this.columnTitle2 = ecount.resource.LBL04590;  //코드번호
            this.columnTitle3 = ecount.resource.LBL00359;  //거래처명
        }
        else if (this.searchType == "tongjang_no")  //통장
        {
            this.columnLength = 3;

            this.headerTitle = ecount.resource.LBL00501;
            this.columnTitle1 = ecount.resource.LBL00703;
            this.columnTitle2 = ecount.resource.LBL04590;
            this.columnTitle3 = ecount.resource.LBL00359;
        }
        else if (this.searchType == "credit_no") //신용카드등록
        {
            this.columnLength = 3;

            this.headerTitle = ecount.resource.LBL02865;
            this.columnTitle1 = ecount.resource.LBL00703;
            this.columnTitle2 = ecount.resource.LBL04590;
            this.columnTitle3 = ecount.resource.LBL00359;
        }
        else if (this.searchType == "business_no" || this.searchType == "txtbusinessno")  //거래처 , 사원담당
        {
            this.columnLength = 4;
            this.isColumSort = true;
            this.headerTitle = ecount.resource.LBL04590;
            this.columnTitle1 = ecount.resource.LBL00703;
            this.columnTitle2 = ecount.resource.LBL04590;
            this.columnTitle3 = ecount.resource.LBL00359;
            this.columnTitle4 = ecount.resource.LBL04591;
        }
        else if (this.searchType == "business_des")  //거래처명
        {
            this.columnLength = 2;
            this.isColumSort = true;
            this.headerTitle = ecount.resource.LBL00359;
            this.columnTitle2 = ecount.resource.LBL00737;
            this.columnTitle3 = ecount.resource.LBL00359;
        }
        else if (this.searchType == "size_des")   //규격(명)
        {
            this.columnLength = 3;
            this.columnTitle3 = ecount.resource.LBL00749;
            this.headerTitle = ecount.resource.LBL00749;
            this.validType = 'name';
        }
        else if (this.searchType == "gye_code") //계정코드
        {
            this.columnTitle1 = ecount.resource.LBL00495;
            this.columnTitle2 = ecount.resource.LBL00479;
            this.headerTitle = ecount.resource.LBL00495;
        }
        else if (this.searchType == "order_proc") //주문처리번호(명)
        {
            this.columnTitle1 = ecount.resource.LBL08256;
            this.columnTitle2 = ecount.resource.LBL08549;
            this.headerTitle = ecount.resource.LBL08549;
            this.validType = 'name';
        }
        else if (this.searchType == "openMarket" || this.searchType == "openMarket_v2") //외부시스템연결 (명)  
        {
            this.columnLength = 4;

            this.headerTitle = ecount.resource.LBL04590;
            this.columnTitle1 = ecount.resource.LBL00703;
            this.columnTitle2 = ecount.resource.LBL04590;
            this.columnTitle3 = ecount.resource.LBL00359;
            this.columnTitle4 = ecount.resource.LBL04591;
            this.validType = 'name';
        }
        else if (this.searchType == "tax_bracket_cd") {
            this.columnLength = 2;
            this.headerTitle = ecount.resource.LBL10492;
            this.columnTitle1 = ecount.resource.LBL10492;
            this.columnTitle2 = ecount.resource.LBL10493;
        } // inspection type
        else if (this.searchType == "insp_type_cd") {
            this.columnLength = 2;
            this.headerTitle = ecount.resource.LBL10901;
            this.columnTitle1 = ecount.resource.LBL35896;
            this.columnTitle2 = ecount.resource.LBL35895;
        }
            // Inspection item
        else if (this.searchType == "insp_item_cd") {
            this.columnLength = 2;
            this.headerTitle = ecount.resource.LBL10908;
            this.columnTitle1 = ecount.resource.LBL10911;
            this.columnTitle2 = ecount.resource.LBL10910;
        }
        //sub_insp_item_cd
        else if (this.searchType == "insp_sub_item_cd") {
            this.columnLength = 2;
            this.headerTitle = ecount.resource.LBL10922;
            this.columnTitle1 = ecount.resource.LBL10921;
            this.columnTitle2 = ecount.resource.LBL10920;
        }
        else if (this.searchType == "contract_cd") {
            this.columnLength = 2;
            this.headerTitle = ecount.resource.LBL10495;
            this.columnTitle1 = ecount.resource.LBL10495;
            this.columnTitle2 = ecount.resource.LBL10496;
        }
        else if (this.searchType == "acct_item_type_cd") {
            this.columnLength = 2;
            this.headerTitle = ecount.resource.LBL13115;
            this.columnTitle1 = ecount.resource.LBL13115;
            this.columnTitle2 = ecount.resource.LBL13116;
        }
        else if (this.searchType == "CS_GROUPCD") //cs그룹코드
        {
            this.columnTitle1 = ecount.resource.LBL09746;
            this.columnTitle2 = ecount.resource.LBL09747;
            this.headerTitle = ecount.resource.LBL13513;

        } else if (this.searchType == "ven_no") {
            debugger;
            this.columnTitle1 = ecount.resource.LBL01528;
            this.columnTitle2 = ecount.resource.LBL01432;
            this.headerTitle = ecount.resource.LBL01432;
            

        } else if (this.searchType == "per_no") {
            debugger;
            this.columnTitle1 = ecount.resource.LBL01595;
            this.columnTitle2 = ecount.resource.LBL02605;
            this.headerTitle = ecount.resource.LBL02605;
        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.BTN00236 + " (" + this.headerTitle + ")").useQuickSearch();

        // 검색창 maxlength 설정
        switch (this.searchType.toUpperCase()) {
            case "PROD_CD":
            case "G_PROD_CD":
            case "VEN_NO":
                header.maxbytes(20);
                break;
            case "CARD_NO":
            case "BUSINESS_NO":
            case "TXTBUSINESSNO":
            case "INSP_TYPE_CD":
                header.maxbytes(30);
                break;
            case "OPENMARKET":
            case "OPENMARKET_V2":
            case "ACCT_ITEM_TYPE_CD":
            case "CS_GROUPCD":
                header.maxbytes(5);
                break;
            case "INSP_ITEM_CD":
            case "INSP_SUB_ITEM_CD":
                header.maxbytes(10);
                break;
            case "PROD_DES":
            case "SIZE_DES":
                header.maxLength(100);
                break;
            case "CONTRACT_CD":
            case "BAR_CODE":
            case "TONGJANG_NO":
            case "CREDIT_NO":
                header.maxLength(30);
                break;
            case "BUSINESS_DES":
                header.maxLength(50);
                break;
            case "PER_NO":
                header.maxLength(26);
                break;
        }
        
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            krlen = 20,
            enlen = 40,
            form = generator.form();

        if (this.searchType == "openMarket") {
            krlen = 2;
            enlen = 5;
        }

        settings
             .setRowData(this.viewBag.InitDatas.DuplicatesLoad.Data)
            .setRowDataUrl('/Inventory/Common/GetListCheckForDuplicates')
            .setRowDataParameter(this.searchFormParameter)
            .setColumns(this.setColumnsSettings())
            .setEmptyGridMessage(this.testflag ? "" : String.format(ecount.resource.MSG02869, this.keyword, this.headerTitle))


        if (this.isColumSort) {
            settings.setColumnSortable(true)
            settings.setColumnSortExecuting(this.onColumnSortClick.bind(this))
            settings.setColumnSortDisableList(['CUSTNOCHECK']);
        }

        //툴바
        //toolbar  
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004  //검색
        //    }).dataFilter(this.validType == 'name' ? ecount.common.ValidCheckSpecialForCodeName : ecount.common.ValidCheckSpecialForCodeType)
        //     .tooltipDirection("bottom")
        //     .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, krlen, enlen), max: enlen }));

        contents.add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00346).hide());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }

    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data, gridObj) {
        this._super.onGridRenderComplete.apply(this, arguments);
        var equalsCnt = 0;
        if (data.dataCount > 0)
            equalsCnt = data.dataRows[0].EQUALS_COUNT;
        
        if (equalsCnt < 1 && !this.testflag && !this.IsMultiCheck)
            this.footer.getControl("apply").show();
        else
            this.footer.getControl("apply").hide();

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    //grid columns
    setColumnsSettings: function (e, data) {
        var columns = [];

        if (this.searchType == "bar_code" || this.searchType == "size_des") {
            var align = 'center';
            if (this.searchType == "size_des")
                align = 'left';

            columns = [
                        { propertyName: 'PROD_CD', id: 'PROD_CD', title: this.columnTitle1, width: '' },
                        { propertyName: 'PROD_DES', id: 'PROD_DES', title: this.columnTitle2, width: '' },
                        { propertyName: 'BAR_CODE', id: 'BAR_CODE', title: this.columnTitle3, width: '', align: align }
            ];
        }
        else if (this.searchType == "card_no" || this.searchType == "tongjang_no" || this.searchType == "credit_no" || this.searchType == "openMarket") {
            columns = [
                        { propertyName: 'GUBUN', id: 'GUBUN', title: this.columnTitle1, width: '' },
                        { propertyName: 'PROD_CD', id: 'PROD_CD', title: this.columnTitle2, width: '' },
                        { propertyName: 'PROD_DES', id: 'PROD_DES', title: this.columnTitle3, width: '' }
            ];
        }
        else if (this.searchType == "business_no" || this.searchType == "txtbusinessno") {
            columns = [
                        { propertyName: 'GUBUN', id: 'GUBUN', title: this.columnTitle1, width: '' },
                        { propertyName: 'PROD_CD', id: 'PROD_CD', title: this.columnTitle2, width: '' },
                        { propertyName: 'PROD_DES', id: 'PROD_DES', title: this.columnTitle3, width: '' },
                        { propertyName: 'CUSTNOCHECK', id: 'CUSTNOCHECK', title: this.columnTitle4, width: '' }
            ];
        }
        else if (this.searchType == "business_des") {
            columns = [
                        { propertyName: 'PROD_CD', id: 'PROD_CD', title: this.columnTitle2, width: '' },
                        { propertyName: 'PROD_DES', id: 'PROD_DES', title: this.columnTitle3, width: '' },
            ];
        }
        else if (this.searchType == "tax_bracket_cd") {
            columns = [
                        { propertyName: 'TAX_BRACKET_CD', id: 'TAX_BRACKET_CD', title: this.columnTitle1, width: '' },
                        { propertyName: 'TAX_BRACKET_NM', id: 'TAX_BRACKET_NM', title: this.columnTitle2, width: '' }
            ];
        }
            // inspection type
        else if (this.searchType == "insp_type_cd") {
            columns = [
                        { propertyName: 'INSPECT_TYPE_CD2', id: 'INSPECT_TYPE_CD2', title: this.columnTitle1, width: '' },
                        { propertyName: 'INSPECT_TYPE_NM', id: 'INSPECT_TYPE_NM', title: this.columnTitle2, width: '' }
            ];
        }
            // inspection item
        else if (this.searchType == "insp_item_cd") {
            columns = [
                        { propertyName: 'ITEM_CD2', id: 'ITEM_CD2', title: this.columnTitle1, width: '' },
                        { propertyName: 'ITEM_NM', id: 'ITEM_NM', title: this.columnTitle2, width: '' }
            ];
        }
            // sub insp item
        else if (this.searchType == "insp_sub_item_cd") {
            columns = [
                        { propertyName: 'ITEMDETAIL_CD2', id: 'ITEMDETAIL_CD2', title: this.columnTitle1, width: '' },
                        { propertyName: 'ITEMDETAIL_NM', id: 'ITEMDETAIL_NM', title: this.columnTitle2, width: '' }
            ];
        }
        else if (this.searchType == "contract_cd" || this.searchType == "contract_nm") {
            columns = [
                        { propertyName: 'CT_CD', id: 'CT_CD', title: this.columnTitle1, width: '' },
                        { propertyName: 'CT_CDNM', id: 'CT_CDNM', title: this.columnTitle2, width: '' }
            ];
        }
        else if (this.searchType == "acct_item_type_cd") {
            columns = [
                        { propertyName: 'ITEM_TYPE_CD', id: 'ITEM_TYPE_CD', title: this.columnTitle1, width: '' },
                        { propertyName: 'ITEM_TYPE_NM', id: 'ITEM_TYPE_NM', title: this.columnTitle2, width: '' }
            ];
        }
            // cs그룹코드
        else if (this.searchType == "CS_GROUPCD") {
            columns = [
                        { propertyName: 'ALL_MN_GROUPCD', id: 'ALL_MN_GROUPCD', title: this.columnTitle1, width: '' },
                        { propertyName: 'ALL_MN_GROUPNM', id: 'ALL_MN_GROUPNM', title: this.columnTitle2, width: '' }
            ];
        }
        else if (this.searchType == "per_no") {
            columns = [
                        { propertyName: 'PER_NAME', id: 'PER_NAME', title: this.columnTitle1, width: '' },
                        { propertyName: 'PER_NO', id: 'PER_NO', title: this.columnTitle2, width: '' }
            ];
        }
        else if (this.searchType == "ven_no") {
            columns = [
                        { propertyName: 'VEN_DES', id: 'VEN_DES', title: this.columnTitle1, width: '' },
                        { propertyName: 'VEN_NO', id: 'VEN_NO', title: this.columnTitle2, width: '' }
            ];
        }
        else {
            columns = [
                        { propertyName: 'PROD_CD', id: 'PROD_CD', title: this.columnTitle1, width: '' },
                        { propertyName: 'PROD_DES', id: 'PROD_DES', title: this.columnTitle2, width: '' }
            ];
        }

        return columns;
    },

    //정렬
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        if (this.IsMultiCheck) {
            this.searchFormParameter.MULTI_KEY = this.MULTI_KEY;
            this.searchFormParameter.MULTI_YN = this.MULTI_YN;
            this.searchFormParameter.PARAM = this.PARAM;
        }

        this.contents.getGrid().draw(this.searchFormParameter);
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //검색
    onContentsSearch: function (event) {
        var control = event.__self;
        var returnkeyword = null;
        var invalid = control.validate();

        if (invalid.length > 0) {
            control.setFocus(0);
            return;
        }
        else {
            returnkeyword = control.getValue().keyword;
            this.setSearchCheck(returnkeyword);
        }

        this.searchFormParameter.PARAM = returnkeyword;
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.contents.getGrid().settings.setEmptyGridMessage(this.testflag ? "&nbsp;" : String.format(ecount.resource.MSG02869, returnkeyword, this.headerTitle));
        this.header.getQuickSearchControl().setFocus(0);

        this.header.toggle(true);
    },

    //적용버튼
    onFooterApply: function (e) {
        //var keyword = this.contents.getControl('search').getElements();

        var keyword = this.header.getQuickSearchControl().getValue();
        var code_no = keyword;//.val();
        var before_length = code_no.length;
        var after_length = code_no.length;

        if (this.searchType == "prod_des" || this.searchType == "size_des")
            code_no = code_no.trim();
        else
            code_no = code_no.trim(' ').trim('　');

        if (after_length < before_length) {
            ecount.alert(String.format(ecount.resource.MSG02054, ecount.resource.LBL04590));
            keyword.focus();
            return false;
        }

        var control = this.header.getQuickSearchControl();
        var invalid = control.validate();

        if (invalid.length > 0) {
            control.setFocus(0);
            return;
        }

        var message = {
            data: keyword,//.val(),
            CheckLine : this.CheckLine,
            addPosition: "next",
            callback: this.close.bind(this)
        };

        this.sendMessage(this, message);
        
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    //엔터
    ON_KEY_ENTER: function (e, target) {

        if (target && target.control) {
            this.onContentsSearch({ __self: target.control });
        }

    },

    onHeaderQuickSearch: function (event) {
        

        var returnkeyword = event.keyword;
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        if (this.IsMultiCheck) {
            this.MULTI_KEY = "";
            this.MULTI_YN = "";
            this.PARAM = this.searchFormParameter.PARAM;
            this.searchFormParameter.MULTI_KEY = this.MULTI_KEY;
            this.searchFormParameter.MULTI_YN = this.MULTI_YN;
            this.searchFormParameter.PARAM = this.PARAM;
        }
        this.keyword = this.searchFormParameter.PARAM;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
        this.contents.getGrid().settings.setEmptyGridMessage(this.testflag ? "&nbsp;" : String.format(ecount.resource.MSG02869, returnkeyword, this.headerTitle));
    },
    /**********************************************************************
    * user function
    **********************************************************************/
    //search check
    setSearchCheck: function (param) {
        var keyword = param
        , iBeforeLength = keyword.length
        , iAfterLength = 0;
        this.testflag = false;

        if (!$.isEmpty(keyword)) {
            if (this.searchType == "prod_des") {
                iAfterLength = keyword.trim().length;
            }
            else {
                iAfterLength = keyword.replace(" ", "").replace("　", "").length;
            }
        }

        if (this.searchType != "size_des" && iAfterLength < iBeforeLength) {
            if (this.searchType == "prod_des")
                ecount.alert(String.format(ecount.resource.MSG02054, ecount.resource.LBL02878));  //코드명 
            else
                ecount.alert(String.format(ecount.resource.MSG02054, ecount.resource.LBL02874));  //코드

            this.testflag = true;
            return false;
        }
        return true;
    }

});
