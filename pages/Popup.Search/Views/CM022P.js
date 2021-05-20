window.__define_resource && __define_resource("BTN00113","BTN00007","LBL04306","LBL35228","LBL35229","LBL35230","LBL08556","LBL00381","LBL00359","LBL01837","LBL02570","LBL02509","LBL00223","LBL00764","LBL07244","LBL00402","LBL00228","LBL01035","LBL01632","LBL00456","LBL35238","LBL00219","LBL06642","LBL08254","LBL03701","LBL00330","BTN00291","BTN00169","MSG03839","BTN00043","BTN00069","LBL02374","BTN00008","BTN00351","LBL02931","MSG09786","LBL07553","BTN00096","LBL02895","LBL00347","BTN00315","LBL93617","LBL00271","LBL11185","LBL00622","LBL04057","LBL02869","LBL03183","LBL11186","LBL05969","LBL00078","LBL01374","LBL01440","LBL05017","LBL04947","LBL05714","LBL05715","LBL05716","LBL01448","LBL01185","LBL80322","LBL09847","LBL09848","LBL01084","LBL09594","LBL09849","LBL02203","LBL02074","LBL03135","LBL01713","LBL01164","LBL00782","LBL02891","LBL80270","LBL08396","LBL09077","LBL08831","LBL01450","MSG00456","MSG00141","LBL00336","BTN00603","MSG00962","MSG05714");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 거래처 검색 팝업
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 [2015-08-27] 강성훈 : 키워드 검색 후 데이터가 존재 하지 않으면 검색 영역 보이도록 수정
                 [2015-09-07] 노지혜 : 툴팁추가         
                 [2016.06.04] (Truong Phuc) Modify view list
                 [2016.12.22] 노지혜 OPEN_SEARCH_YN 추가 
                 [2017.02.23] (Thien.Nguyen)Change all in one 1 menu to new FW
                 [2018.07.04] 박기정 : 재고 미포함 전체 재조회 되는 현상 수정
                 [2018.09.12] 류상민 : 거래처검색 잔액 검색 분리
                 [2018.09.20] 류상민 : 잔액 소팅 추가
                 [2018.09.20] (PhiVo) : A18_03997 add logic hide simple search when complete search
                 2018.12.27 (HoangLinh): Remove $el
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.07.19 (Huu Tuan) : A18_03412 - Add default search param for Tax Entity(G_BUSINESSNO) field.
                 2019.04.16 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
                 2019.08.08 (김선모) :  isGraph => isViewNoChildParent 로 이름 변경
                 2020.03.27 (이은총) : A20_01246 거래처검색창 [200건이상조회] -> [1,000건이상조회]로 변경
                 2020.05.06 (NgocHan) A20_01830_validation에러로그_거래처 검색창 간편검색 특수문자 제한: change widget.input.general to widget.input.search at ctrl.define for search1
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "CM022P", {
    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체)
    **********************************************************************/
    boardFlag: "N",
    trialOverflowFlag: "N",
    height: 544,
    gridKeyColumn: "BUSINESS_NO",
    gridLabelColumn: "CUST_NAME",
    newItem: false,

    //천건 제한
    _moreCount: 1000,		// 천건이상버튼
    _totalCount: 0,
    isMoreFlag: false,    //"천건이상" 버튼 클릭 여부
    //검색된 상태여부
    isSearched: false,
    isSorted: false,
    isFromBalancePopup: false,
    /**********************************************************************
    * 판매입력 관련 변수
    **********************************************************************/
    // 부모페이지 구분
    callFlag: this.CallFlag,
    /**********************************************************************
    * page init
    **********************************************************************/
    init: function (options, layout) {

        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            SORT_COLUMN: 'CUST_NAME ASC',
            CALL_TYPE: this.FilterCustGubun == null ? 102 : this.FilterCustGubun,// 102
            DEL_FLAG: 'N',
            PROD_SEARCH: '9',
            SORT_TYPE: 'A',
            SEARCH_GB: '2',
            GYE_CODE: this.GyeCode == null ? '' : this.GyeCode,
            IO_TYPE: this.IO_TYPE == null ? '  ' : this.IO_TYPE,
            ACC002_FLAG: this.Acc002_Flag == null ? 'N' : this.Acc002_Flag, //'N',
            EMP_FLAG: this.EmpFlag == null ? 'N' : this.EmpFlag,
            PARAM: "",
            SeachType: "B",
            BALANCE_SORT: 'N',
            BALANCE_SORT_COL: '',
            INCLUDE_BALANCE_YN: 'N',
            INCLUDE_BALANCE_BUTTON_VISIBLE: 'Y',
            OPEN_SEARCH_YN: "Y",
            MAIN_YN: this.MAIN_YN || "N",
            IS_LIMIT: true,
            G_BUSINESSNO: this.viewBag.DefaultOption.G_BUSINESSNO || "",
            PAGE_SIZE: this.viewBag.FormInfos.SP910 && this.viewBag.FormInfos.SP910.option && this.viewBag.FormInfos.SP910.option.pageSize,
            PAGE_CURRENT: 0,
            INCLUDE_BALANCE_SEARCH_FLAG: 'N' // 거래처 조회시 잔액포함 조회(천건이하의 경우)
        };
    },

    render: function () {
        if (this.unUseAutoResize != true) {
            this.setLayout(this.viewBag.FormInfos.SP910);
        }
        this._super.render.apply(this, arguments);
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
    **********************************************************************/
    //Header
    onInitHeader: function (header, resource) {
        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        toolbar
            .setOptions({ css: "btn btn-default btn-sm" })
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        cont1 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1001");
        cont1 = cont1 == '' ? ecount.resource.LBL04306 + "1" : cont1;
        cont2 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1002");
        cont2 = cont2 == '' ? ecount.resource.LBL04306 + "2" : cont2;
        cont3 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1003");
        cont3 = cont3 == '' ? ecount.resource.LBL04306 + "3" : cont3;
        cont4 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1004");
        cont4 = cont4 == '' ? ecount.resource.LBL04306 + "4" : cont4;
        cont5 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1005");
        cont5 = cont5 == '' ? ecount.resource.LBL04306 + "5" : cont5;
        cont6 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1006");
        cont6 = cont6 == '' ? ecount.resource.LBL04306 + "6" : cont6;
        ncuser1 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1301");
        ncuser1 = ncuser1 == '' ? ecount.resource.LBL35228 : ncuser1;
        ncuser2 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1302");
        ncuser2 = ncuser2 == '' ? ecount.resource.LBL35229 : ncuser2;
        ncuser3 = this.getObjects(this.viewBag.InitDatas.CommonCode, "A1303");
        ncuser3 = ncuser3 == '' ? ecount.resource.LBL35230 : ncuser3;
        form1.add(
            ctrl.define("widget.input.search", "search1", "search1", ecount.resource.LBL08556).end()
        );
        //폼
        form2
            .add(ctrl.define("widget.input.codeName", "CUST", "CUST", ecount.resource.LBL00381).end()) //거래처코드
            .add(ctrl.define("widget.input.codeName", "CUST_NAME", "CUST_NAME", ecount.resource.LBL00359).end())   //거래처명
            .add(ctrl.define("widget.input.codeName", "UPTAE", "UPTAE", ecount.resource.LBL01837).end())   //업태
            .add(ctrl.define("widget.input.codeName", "JONGMOK", "JONGMOK", ecount.resource.LBL02570).end())   //종목
            .add(ctrl.define("widget.input.codeName", "TEL", "TEL", ecount.resource.LBL02509).end())  //전화
            .add(ctrl.define("widget.input.codeName", "FAX", "FAX", ecount.resource.LBL00223).end())  //fax
            .add(ctrl.define("widget.multiCode.custGroup", "txtCustGroup1", "CLASS_CD", String.format(ecount.resource.LBL00764, "1")).end())
            .add(ctrl.define("widget.multiCode.custGroup", "txtCustGroup2", "CLASS_CD2", String.format(ecount.resource.LBL00764, "2")).end())
            .add(ctrl.define("widget.multiCode.custLevelGroup", "txtTreeCustCd", "CD_GROUP", ecount.resource.LBL07244).end())
            .add(ctrl.define("widget.input.codeName", "REMARKS_WIN", "REMARKS_WIN", ecount.resource.LBL00402).end())  //검색창내용
            .add(ctrl.define("widget.input.codeName", "HP_NO", "HP_NO", ecount.resource.LBL00228).end())  //모바일
            .add(ctrl.define("widget.input.codeName", "BOSS_NAME", "BOSS_NAME", ecount.resource.LBL01035).end())  //대표자명
            .add(ctrl.define("widget.input.codeName", "G_BUSINESSNO", "G_BUSINESSNO", ecount.resource.LBL01632).value(this.searchFormParameter.G_BUSINESSNO).end())  //세무신고거래처
            .add(ctrl.define("widget.input.codeName", "ADDR", "ADDR", ecount.resource.LBL00456).end())  //주소
            .add(ctrl.define("widget.input.codeName", "POST_NO", "POST_NO", ecount.resource.LBL35238).end())  //우편번호
            .add(ctrl.define("widget.input.codeName", "EMAIL", "EMAIL", ecount.resource.LBL00219).end()) //이메일
            .add(ctrl.define("widget.input.codeName", "CONT1", "CONT1", cont1).end())
            .add(ctrl.define("widget.input.codeName", "CONT2", "CONT2", cont2).end())
            .add(ctrl.define("widget.input.codeName", "CONT3", "CONT3", cont3).end())
            .add(ctrl.define("widget.input.codeName", "CONT4", "CONT4", cont4).end())
            .add(ctrl.define("widget.input.codeName", "CONT5", "CONT5", cont5).end())
            .add(ctrl.define("widget.input.codeName", "CONT6", "CONT6", cont6).end())
            .add(ctrl.define("widget.input.codeName", "NO_CUST_USER1", "NO_CUST_USER1", ncuser1).numericOnly(18, 6).end())
            .add(ctrl.define("widget.input.codeName", "NO_CUST_USER2", "NO_CUST_USER2", ncuser2).numericOnly(18, 6).end())
            .add(ctrl.define("widget.input.codeName", "NO_CUST_USER3", "NO_CUST_USER3", ncuser3).numericOnly(18, 6).end());

        tabContents
            .createActiveTab("quick", ecount.resource.LBL06642)
            .add(form1)
            .setOptions({
                showFormLayer: (!$.isEmpty(this.keyword)) ? false : true,
            })
            .createTab("advanced", ecount.resource.LBL08254)
            .add(form2);

        contents.add(tabContents).add(toolbar);

        header.notUsedBookmark();
        header.setTitle(this.isCardNoDisplayFlag ? ecount.resource.LBL03701 : ecount.resource.LBL00330)
            .useQuickSearch()
            .add("search")  //type, button list
            .add("option", [
                { id: "searchTemplate", label: ecount.resource.BTN00291 },
                { id: "listSetting", label: ecount.resource.BTN00169 }
            ])
            .addContents(contents);
    },

    //Contents
    onInitContents: function (contents, resource) {
        var options = widget.generator,
            toolbar = options.toolbar(),
            ctrl = options.control(),
            grid = options.grid();
        var thisObj = this;

        var froms = this.viewBag.FormInfos.SP910;
        var customColumns = "";
        if (froms && this.viewBag.FormInfos.SP910.columns && this.viewBag.FormInfos.SP910.columns.length > 0) {
            customColumns = this.viewBag.FormInfos.SP910.columns[0].name;   
        }

        if (!$.isEmpty(this.keyword)) {
            grid.setRowData(this.viewBag.InitDatas.LoadData)
        }
        grid
            .setRowDataUrl("/Account/Basic/GetListCustForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setFormData(this.viewBag.FormInfos.SP910)
            .setKeyColumn(['BUSINESS_NO', 'CUST_NAME'])
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true, ['cust.remarks', 'cust.cust_name', customColumns])
            .setColumnSortable(true)
            .setColumnSortExecuting(function (e, data) {

                if (thisObj.searchFormParameter.IS_LIMIT == true) {
                    thisObj.contents.getGrid().grid.toSort(data.sortOrder, data.columnId, null, null, true, false, false);

                    var rows = thisObj.contents.getGrid().grid.getRowList(ecount.grid.constValue.sectionType.thead, null, {});
                    thisObj.contents.getGrid().grid.refreshCell(ecount.grid.constValue.sectionType.thead, data.columnId, rows[0][ecount.grid.constValue.keyColumnPropertyName]);

                }
                else {

                    if (data.sortOrder == "D")
                        thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + ' DESC';
                    else
                        thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + ' ASC';
                    thisObj.searchFormParameter.SORT_TYPE = data.sortOrder;

                    thisObj.searchFormParameter.SeachType = "H";

                    //소팅으로 검색할 경우
                    if (data.columnId == "balance.bal_amt") {
                        thisObj.searchFormParameter.BALANCE_SORT = 'Y';
                        thisObj.searchFormParameter.BALANCE_SORT_COL = thisObj.searchFormParameter.SORT_COLUMN;
                        thisObj.searchFormParameter.INCLUDE_BALANCE_YN = 'Y';

                        var grid = thisObj.contents.getGrid().grid;
                        grid.settings().setColumns([
                            { id: 'balance.bal_amt', isHideColumn: false },
                        ]);
                    } else {
                        thisObj.searchFormParameter.BALANCE_SORT = 'N';
                    }

                    thisObj.isSorted = true;

                    thisObj.contents.getGrid().draw(thisObj.searchFormParameter);
                }
            })
            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxUse(($.isNull(this.isCheckBoxDisplayFlag)) ? false : this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(($.isNull(this.checkMaxCount)) ? 100 : this.checkMaxCount)
            .setCheckBoxRememberChecked(true)
            .setEventUseAfterRowDataLoadForInitialData(true)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e));
            })
            .setCheckBoxCallback({
                'click': function (e, data) {
                    //체크 박스 클릭시 발생 하는 이벤트(입력 화면에서 필요)
                }
            })
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.CANCEL.toUpperCase() == "Y")
                    return true;
                else
                    return false;
            }, 'danger')

            .setColumns([
                { propertyName: 'cust.business_no', id: 'cust.business_no', controlType: 'widget.label' },
                { propertyName: 'balance.bal_amt', id: 'balance.bal_amt', isHideColumn: true }
            ])
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingIndexChanging(function (e, data) {
                thisObj.searchFormParameter.PAGE_CURRENT = data.pageIndex;
                if (thisObj.searchFormParameter.BALANCE_SORT == 'Y') {
                    //파라미터 초기화
                    thisObj.searchFormParameter.SeachType = "B";
                    thisObj.searchFormParameter.SORT_COLUMN = 'CUST_NAME ASC';
                    thisObj.searchFormParameter.SORT_TYPE = 'A';

                    var grid = thisObj.contents.getGrid();
                    grid.settings.setColumns([
                        { id: 'balance.bal_amt', isHideColumn: true },
                    ]);

                    grid.draw(thisObj.searchFormParameter);
                }

            })
            .setCustomRowCell('cust.file', this.setGridDateLinkfile.bind(this))
            .setCustomRowCell('cust.detail', this.setGridDateLinkDetail.bind(this))
            .setCustomRowCell('cust.remarks', this.setGridDateLink.bind(this))
            .setCustomRowCell('cust.cust_name', this.setGridDateLink.bind(this))
            .setCustomRowCell('cust.com_code', this.setGridDateLinkCom.bind(this))
            .setCustomRowCell('cust.cancel', this.setGridDateLinkcancel.bind(this))
            .setCustomRowCell('cust.manage_bond_no', this.setGridResource.bind(this))
            .setCustomRowCell('cust.manage_debit_no', this.setGridResource.bind(this));

        if (this.MariaDb == 'Y') {
            grid
                .setCustomRowCell('cust.outorder_yn', this.setGridforeign_flag.bind(this))
                .setCustomRowCell('cust_gubun.gubun_des', this.setGridGubunDes.bind(this))
                .setCustomRowCell('CUST.G_GUBUN', this.setGridGGubun.bind(this))
                .setCustomRowCell('cust.g_business_type', this.setGridbusiness_type.bind(this))
                .setCustomRowCell('cust.foreign_flag', this.setGridforeign_flag.bind(this))
                .setCustomRowCell('cust.coll_mm', this.setGridcoll_mm.bind(this))
                .setCustomRowCell('cust.manage_bond_no', this.setGridmanage_bond_no.bind(this))
                .setCustomRowCell('cust.manage_debit_no', this.setGridmanage_bond_no.bind(this))
                .setCustomRowCell('cust.io_code_sl_base_yn', this.setGridio_code.bind(this))
                .setCustomRowCell('cust.io_code_by_base_yn', this.setGridio_code.bind(this));
        }

        if (!$.isEmpty(customColumns)) {
            switch (customColumns) {
                case "cust.file":
                    grid.setCustomRowCell(customColumns.toString(), this.setGridDateLinkfile.bind(this));
                    break;
                case "cust.detail":
                    grid.setCustomRowCell(customColumns.toString(), this.setGridDateLinkDetail.bind(this));
                    break;
                case "cust.remarks":
                    grid.setCustomRowCell(customColumns.toString(), this.setGridDateLink.bind(this));
                    break;
                case "cust.cust_name":
                    grid.setCustomRowCell(customColumns.toString(), this.setGridDateLink.bind(this));
                    break;
                case "cust.com_code":
                    grid.setCustomRowCell(customColumns.toString(), this.setGridDateLinkCom.bind(this));
                    break;
                case "cust.cancel":
                    grid.setCustomRowCell(customColumns.toString(), this.setGridDateLinkcancel.bind(this));
                    break;
                case "cust.manage_bond_no":
                case "cust.manage_debit_no":
                    grid.setCustomRowCell(customColumns.toString(), this.setGridResource.bind(this));
                    break;
                default:
                    grid.setCustomRowCell(customColumns.toString(), this.setGridDateLink.bind(this));
                    break;
            }
        }

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, grid);
    },

    setGridDatecustom: function (value, rowItem) {
        var option = {};
        option.data = "adsfadfasdfasdf";
        option.dataType = "1";
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
            }.bind(this)
        };
        return option;
    },

    //Footer
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        if (this.isNewDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(ecount.resource.BTN00043))
        }
        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
        }

        // BEGIN 잔액버튼 추가 (조건변경)
        if (this.IsShowBalanceButton) {
            toolbar.addLeft(ctrl.define("widget.button", "IncludeBalAmt").label(ecount.resource.LBL02374).clickOnce());
            if (this.SumGubun == "2") { // 거래처별 집계
                toolbar.addLeft(ctrl.define("widget.code.account", "AccountOnlyNo2", "AccountOnlyNo2").inline().codeType(10).hide().addCode({ label: this.GyeDes, value: this.GyeCode }).end()) //this.GyeDes
            } else {
                toolbar.addLeft(ctrl.define("widget.code.account", "AccountOnlyNo2", "AccountOnlyNo2").inline().codeType(10).hide().end())
            }
        }

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]))
        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        switch (cid) {
            case "search":
                if (this.isIncludeInactive) {
                    option.addGroup([{ id: 'includeNoUse', label: ecount.resource.BTN00351 }])
                }
                break;
            default:
                break;
        }
    },

    //팝업 오픈 이벤트
    onPopupHandler: function (control, config, handler) {

        if (control.id == "txtCustGroup1" || control.id == "txtCustGroup2") {
            config.isIncludeInactive = true;
            config.isApplyDisplayFlag = false;
            config.isCheckBoxDisplayFlag = false;
            config.Request.Data.PARAM = config.keyword;
        }
        else if (control.id == "AccountOnlyNo2") {
            config.SUM_GUBUN = "2"; // SumGubun 2: 거래처별집계
        }
        handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {
        switch (control.id) {
            case "txtCustGroup1":
            case "txtCustGroup2":
                param.Request.Data.PARAM = keyword;
                break;
        }
        handler(param);
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridAfterFormLoad: function (e, data, grid) {
        
        if (this.IsShowBalanceButton) {
            if (this.searchFormParameter.BALANCE_SORT == 'N') {
                grid.settings.setColumns([
                    { id: 'balance.bal_amt', isHideColumn: true },
                ]);
            }
        }

        var columnForm = data.columnForm.columns
        var customColumns = "";
        if (data.columnForm.columns && data.columnForm.columns.length > 0) {
            customColumns = data.columnForm.columns[0].name;
        }
        //각 컬럼별 툴팁추가
        for (var i = 0; i < columnForm.count(); i++) {

            if (this.MariaDb == "Y") {
                if (!['cust.outorder_yn', 'cust_gubun.gubun_des', 'CUST.G_GUBUN', 'cust.g_business_type', 'cust.foreign_flag', 'cust.coll_mm', 'cust.io_code_sl_base_yn', 'cust.io_code_by_base_yn', 'cust.file', 'cust.detail', 'cust.com_code', 'cust.remarks', 'cust.cust_name', 'cust.cancel', 'cust.manage_bond_no', 'cust.manage_debit_no', customColumns].contains(columnForm[i].name))
                    grid.settings.setCustomRowCell(columnForm[i].name, this.setGridtooltip.bind(this));
            }
            else {
                if (!['cust.file', 'cust.detail', 'cust.com_code', 'cust.remarks', 'cust.cust_name', 'cust.cancel', 'cust.manage_bond_no', 'cust.manage_debit_no', customColumns].contains(columnForm[i].name))
                    grid.settings.setCustomRowCell(columnForm[i].name, this.setGridtooltip.bind(this));
            }
        }
    },

    onGridAfterRowDataLoad: function (e, data, grid) {
        if (data.result && data.result.Data && data.result.Data.length > 0) {
            this._totalCount = data.result.Data[0].MAXCNT;
            if (this._moreCount <= this._totalCount && !this.isMoreFlag) {
                this.isMoreFlag = false;
                //data.result.Data[0].MAXCNT = this._moreCount;
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

    // 그리드 랜더 후
    onGridRenderComplete: function (e, data, gridObj) {
        var grid = this.contents.getGrid().grid;
        var bal_amt = grid.getColumnInfo('balance.bal_amt') == undefined ? undefined : grid.getColumnInfo('balance.bal_amt').dataType;

        if (this.searchFormParameter.INCLUDE_BALANCE_SEARCH_FLAG == 'Y' && this.isMoreFlag && this.searchFormParameter.IS_LIMIT && data.totalDataCount > 0) {
            if (bal_amt != undefined) {
                grid.setColumnVisibility("balance.bal_amt", true);
            }

            grid.setCellTransaction().start();

            data.dataRows.forEach(function (item, i) {
                grid.setCell("balance.bal_amt", item["K-E-Y"], item.BAL_AMT || "0");
            });
            grid.setCellTransaction().end();

            this.setIncludeBalances(false);
        }

        //잔액포함으로 검색하였을 경우 동작
        if (this.searchFormParameter.INCLUDE_BALANCE_YN == 'Y') {
            this.header.toggle(true);
            if (this.isFromBalancePopup) {
                // 잔액버튼을 통해 팝업에서 오면서 천건이상일 때 - 잔액 컬럼 표기하도록 동작
                if (this._totalCount >= this._moreCount) {
                    this.onFooterIncludeBalAmt();
                }
                this.isFromBalancePopup = false;
            }
        } else {
            var includeControl = this.footer.get(0).getControl("IncludeBalAmt");
            if (includeControl != undefined) {
                includeControl.setAllowClick();
            }
        }

        this.isSearched = true;
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.totalDataCount == 1 && this.contents.getGrid().settings.getPagingCurrentPage() == 1 && (!this.isNewDisplayFlag || (this.isNewDisplayFlag && this.isOnePopupClose))) {
            var obj = {};
            var d = data.dataRows[0];

            var message = {
                name: "CUST_NAME",
                code: "BUSINESS_NO",
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
        }
        if (data.totalDataCount == 0) {

            if (['EBD010M_52'].contains(this.parentPageID)) {

                var message = {
                    name: "CUST_NAME",
                    code: "BUSINESS_NO",
                    data: [{ CUST_NAME: "", BUSINESS_NO: this.keyword }],
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: function () { }
                };
                //this.sendMessage(this, message);
                if (this.isReceiveDataAll) {
                    this.getReceiveDataALL(message);
                }
                else {
                    this.sendMessage(this, message);
                } 
            }
        }
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
    **********************************************************************/
    // 페이지 로드 완료 이벤트
    onLoadComplete: function (e) {

        //this.header.toggle(true);
        if (!$.isEmpty(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
            $.extend(this.searchFormParameter, this.header.serialize().result);
            this.searchFormParameter.SEARCH_GB = this.header.serialize().tabId == "quick" ? '2' : '1';
            this.searchFormParameter.PARAM = this.keyword;
        }

        //파일관리 내역 조회
        if (parseInt(ecount.config.groupware.MAX_USERS) > 0) {
            this.boardFlag = "Y";
            if (ecount.config.groupware.USE_STATUS == "1") {
                if (ecount.config.groupware.FREE_EXPIRE_DATE != "" && parseInt(this.LocalTimeyyyyMMdd) > parseInt(ecount.config.groupware.FREE_EXPIRE_DATE)) {
                    this.trialOverflowFlag = "Y";
                }
            }
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());

        // Just apply for ECTAX024M (Acct. I > Electronic (Tax) Invoice > ERP vs. NTS > [ERP전표생성] button)
        if (!$.isEmpty(this.searchFormParameter.G_BUSINESSNO)) {
            this.header.changeTab("advanced");// Active advance tab
            this.onHeaderSearch(e);// Auto search by current conditions.
        }
    },

    // 검색 탭 변경
    onChangeHeaderTab: function (e) {
        if (e.tabId == "quick") {
            this.setFixedHeader(true);
            this.$el.find('#mainPage > .contents').css('margin-top', this.header.height() + 5);
            this.header.removeOptionItems();
            this.header.addOptionItems([
                { id: "searchTemplate", label: ecount.resource.BTN00291 },
                { id: "listSetting", label: ecount.resource.BTN00169 }
            ]);
        }
        else {
            this.setFixedHeader(false);
            this.$el.find('#mainPage > .contents').css('margin-top', 5);
            this.header.removeOptionItems();
            this.header.addOptionItems([
                { id: "listSetting", label: ecount.resource.BTN00169 }
            ]);
        }
    },

    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.isSorted = false;
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.getSettings().setColumnSortable(true);
        grid.draw(this.searchFormParameter);

        this.header.toggle(true);
        this.isOnePopupClose = true;
    },

    /**********************************************************************
    * event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트)
    **********************************************************************/
    // [grid] 파일 관리
    setGridDateLinkfile: function (value, rowItem) {

        var option = {};
        if (rowItem.CUST_FILE_CNT > 0) {
            option.data = ecount.resource.LBL02931;
            option.attrs = {
                'Class': 'text-warning-inverse'
            };
        }
        else option.data = ecount.resource.LBL02931;

        if (!(rowItem.GUBUN == "11" || rowItem.GUBUN == "13"))
            option.data = " ";

        option.dataType = "1";
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {               
                if ($.isEmpty(data.rowItem["CUST_IDX"])) {
                    ecount.alert(ecount.resource.MSG09786);
                    return false;
                }
                var param = {
                    width: 780,
                    height: 600,
                    b_type: "A01",                    
                    TITLE: "[" + data.rowItem.BUSINESS_NO + "] " + data.rowItem.CUST_NAME,
                    BOARD_CD: 7001,
                    custCdAllInOne: data.rowItem["CUST_IDX"],
                    custDesAllInOne: data.rowItem["CUST_DES"],
                    isFileManage: true,
                    Popup_Flag: "Y",
                    ProgramType: "NEW"
                };

                this.openWindow({                    
                    url: "/ECERP/EGM/EGM024M",
                    name: ecount.resource.LBL07553,
                    param: param,
                    popupType: false,
                    additional: true,
                    fpopupID: this.ecPageID
                });
                e.preventDefault();
                
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

        if (this.isNewDisplayFlag) {
            btnList.push(ctrl.define("widget.button", "New").css("btn btn-default").label(res.BTN00043).end());
        }
        if (this.isApplyDisplayFlag) {
            btnList.push(ctrl.define("widget.button", "Apply").label(res.BTN00069).end());
        }

        // BEGIN 잔액버튼 추가 (조건변경)
        if (this.IsShowBalanceButton) {
            btnList.push(ctrl.define("widget.button", "IncludeBalAmt").label(ecount.resource.LBL02374).clickOnce().end());
            if (this.SumGubun == "2") { // 거래처별 집계
                btnList.push(ctrl.define("widget.code.account", "AccountOnlyNo2", "AccountOnlyNo2").inline().codeType(10).hide().addCode({ label: this.GyeDes, value: this.GyeCode }).end()) //this.GyeDes
            } else {
                btnList.push(ctrl.define("widget.code.account", "AccountOnlyNo2", "AccountOnlyNo2").inline().codeType(10).hide().end())
            }
        }
        if (!this.isMoreFlag)
            btnList.push(ctrl.define("widget.button", "moreData").label(res.BTN00096).end());
        btnList.push(ctrl.define("widget.button", "close").label(res.BTN00008).end())

        toolbar.addLeft(btnList);
        btnList = [];
        btnList.push(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]).end())
        toolbar.addRight(btnList);
    },


    // [grid] 통장 관리
    setGridDateLinkCom: function (value, rowItem) {
        var option = {};
        option.data = ecount.resource.LBL02895;
        if (parseInt(rowItem.TONGJANG_CNT) > 0) {
            option.attrs = {
                'Class': 'text-warning-inverse'
            };
        }
        option.dataType = "1";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 600,
                    height: 400,
                    custNo: data.rowItem.BUSINESS_NO,
                    custName: data.rowItem.CUST_NAME,
                    PopupFlag: "Y",
                    pageName: "CM022P"
                };

                this.openWindow({
                    url: '/ECERP/ESA/ESA001P_05',
                    name: ecount.resource.LBL00347,
                    param: param,
                    additional: true
                });
                e.preventDefault();

            }.bind(this)
        };
        return option;
    },

    //팝업창에서 부모에게 넘겨준값 컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (page, param) {
        if (param == "CUST") {
            this.contents.getGrid().draw(this.searchFormParameter);
        }
        else {
            switch (page.pageID) {
                case "CM100P_01_CM3":
                    setTimeout(function () {
                        param.callback && param.callback();
                    }, 0);
                    break;
                case "CM007P":
                    this.footer.get(0).getControl("AccountOnlyNo2").setValue(param.data.GYE_DES);
                    this.searchFormParameter.GYE_CODE = param.data.GYE_CODE;
                    this.searchFormParameter.INCLUDE_BALANCE_YN = 'Y';
                    this.contents.getGrid().draw(this.searchFormParameter);
                    this.isFromBalancePopup = true;
                    //팝업닫기
                    param.callback && param.callback();
                    this.footer.get(0).getControl("IncludeBalAmt").setAllowClick();
                    break;
                case "CM100P_02":
                    if (this.isSearched) {
                        this.SetReload();
                    }

                    this.setTimeout(function () {
                        param.callback && param.callback();
                    }, 0);
                    break;

                case "ESA002M":
                    this.NewReload(param.CUST.BUSINESS_NO, "");
                    break;
            }
        }
    },

    // [grid] 상세 내역
    setGridDateLinkDetail: function (value, rowItem) {
        var option = {};
        var hidData = "";
        var selfThis = this;
        if (rowItem.GUBUN != "11" && rowItem.GUBUN != "13" && rowItem.GUBUN != "19")
            option.data = ' ';
        else
            option.data = ecount.resource.BTN00315;

        option.dataType = "1";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 800,
                    height: 600,
                    Request: {
                        CUST: data.rowItem.BUSINESS_NO
                    },
                    CustEditType: "ALL_IN_ONE_SEARCH",

                };
                this.openWindow({
                    url: '/ECERP/SVC/ESQ/ESQ501M',
                    name: ecount.resource.LBL93617,
                    param: param,
                    popupType: false,
                    additional: true,
                    fpopupID: this.ecPageID
                });
                e.preventDefault();

            }.bind(this)
        };
        return option;
    },

    // [grid] 거래처명, 거래처 코드 클릭
    setGridDateLink: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {

                var message = {
                    name: "CUST_NAME",
                    code: "BUSINESS_NO",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                //this.sendMessage(this, message);
                if (this.isReceiveDataAll) {
                    this.getReceiveDataALL(message);
                }
                else {
                    var params = {
                        rowItem: data.rowItem,
                        callback: function (result) {
                            message.data = result;
                            this.sendMessage(this, message);
                        }.bind(this)
                    };

                    this.setCustBasicInfo(params);
                } 
                e.preventDefault();
            }.bind(this)
        };
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },
    /********************************************************************** 
    * 2019.04.11 : 기초 코드 팝업 데이터 모두 가져오기 API [김봉기]
    **********************************************************************/
    getReceiveDataALL: function (message) {
        var self = this;
        var url = "/SVC/Common/Infra/GetReceiveCodeData";
        var returnData = null;
        message.data.CODE_TYPE = ecount.constValue.codePopupType.businessNo; // 팝업 코드 타입 추가
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
    // [grid] 사용 여부
    setGridDateLinkcancel: function (value, rowItem) {
        var option = {};
        var self = this;

        if (rowItem.CANCEL == "Y") {

            option.data = "NO"
            option.attrs = {
                'Class': 'text-danger',
                'data-trigger': 'hover',
                'data-toggle': 'tooltip',
                'data-placement': 'auto',
                'data-html': true,
                'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
            };
        }
        else
            option.data = "YES";

        option.controlType = "widget.label";
        return option;
    },

    setGridGubunDes: function (value, rowItem) {
        var option = {};

        if (value == "11") {
            option.data = ecount.resource.LBL00271;
        }
        else if (value == "12") {
            option.data = ecount.resource.LBL11185;
        }
        else if (value == "13") {
            option.data = ecount.resource.LBL00622;
        }
        else if (value == "14") {
            option.data = ecount.resource.LBL04057;
        }
        else if (value == "15") {
            option.data = ecount.resource.LBL02869;
        }
        else if (value == "19") {
            option.data = ecount.resource.LBL03183;
        }
        else if (value == "20") {
            option.data = ecount.resource.LBL11186;
        }
        else if (value == "21") {
            option.data = ecount.resource.LBL05969;
        }
        else if (value == "30") {
            option.data = ecount.resource.LBL11185;
        }
        else if (value == "90") {
            option.data = ecount.resource.LBL00078;
        }
        else if (value == "91") {
            option.data = ecount.resource.LBL01374;
        }

        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },

    // 리소스 리턴
    setGridGGubun: function (value, rowItem) {
        var option = {};

        if ($.isEmpty(rowItem.BUSINESS_NO)) {
            option.data = "";
        }
        else {
            if (value == "01") {
                option.data = "[" + ecount.resource.LBL01440 + "]";
            }
            else if (value == "02") {
                option.data = "[" + ecount.resource.LBL05017 + "]";
            }
            else if (value == "03") {
                option.data = "[" + ecount.resource.LBL04947 + "]";
            }
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },

    setGridbusiness_type: function (value, rowItem) {
        var option = {};
        if (value == "1") {
            option.data = ecount.resource.LBL05714;
        }
        else if (value == "2") {
            option.data = ecount.resource.LBL05715;
        }
        else if (value == "2") {
            option.data = ecount.resource.LBL05715;
        }
        else if (value == "3") {
            option.data = ecount.resource.LBL05716;
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };

        return option;
    },

    setGridforeign_flag: function (value, rowItem) {
        var option = {};
        if (value == "Y") {
            option.data = ecount.resource.LBL01448;
        }
        else {
            option.data = ecount.resource.LBL01185;
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };

        return option;
    },

    setGridcoll_mm: function (value, rowItem) {


        var option = {};
        if (value == "B") {
            option.data = ecount.resource.LBL80322;
        }
        else if (value == "D") {
            option.data = String.format(ecount.resource.LBL09847, rowItem.COLL_PAY_D);
        }
        else if (value == "M") {
            option.data = String.format(ecount.resource.LBL09848, rowItem.COLL_PAY_M) + ' ';
            if (rowItem.COLL_PAY_D == "31") {
                option.data += ecount.resource.LBL01084;
            }
            else {
                option.data += rowItem.COLL_PAY_D + ecount.resource.LBL09594;
            }
        }
        else if (value == "W") {
            option.data = String.format(ecount.resource.LBL09849, rowItem.COLL_PAY_W) + ' ';
            if (rowItem.COLL_PAY_DW == 1) {
                option.data += ecount.resource.LBL02203;
            }
            else if (rowItem.COLL_PAY_DW == 2) {
                option.data += ecount.resource.LBL02074;
            }
            else if (rowItem.COLL_PAY_DW == 3) {
                option.data += ecount.resource.LBL03135;
            }
            else if (rowItem.COLL_PAY_DW == 4) {
                option.data += ecount.resource.LBL01713;
            }
            else if (rowItem.COLL_PAY_DW == 5) {
                option.data += ecount.resource.LBL01164;
            }
            else if (rowItem.COLL_PAY_DW == 6) {
                option.data += ecount.resource.LBL00782;
            }
            else if (rowItem.COLL_PAY_DW == 7) {
                option.data += ecount.resource.LBL02891;
            }
            else {
                option.data += '';
            }
        }
        else if (value == "N") {
            option.data = ecount.resource.LBL80270;
        }
        else {
            option.data = '';
        }
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };

        return option;
    },

    setGridio_code: function (value, rowItem) {
        
        var option = {};
        if (value == "N")
            option.data = ecount.resource.LBL05716;
        else
            option.data = ecount.resource.LBL08396;

        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },

    setGridmanage_bond_no: function (value, rowItem) {
        var option = {};
        if (value == "B")
            option.data = ecount.resource.LBL80322;
        else if (value == "M")
            option.data = ecount.resource.LBL09077;
        else if (value == "Y")
            option.data = ecount.resource.LBL08831;
        else
            option.data = ecount.resource.LBL01450;

        return option;
    },

    // 리소스 리턴
    setGridResource: function (value, rowItem) {
        var option = {};
        option.data = ecount.resource[value];

        return option;
    },

    // [grid] row 튤팁 ( 통장, 파일관리, 상세 항목은 제외)
    setGridtooltip: function (value, rowItem) {
        var option = [];
        option.attrs = {
            'data-trigger': 'hover',
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,
            'title': ($.isNull(rowItem['BOSS_NAME']) ? "" : rowItem['BOSS_NAME']) + "/" + ($.isNull(rowItem['ADDR']) ? "" : rowItem['ADDR'])
        };
        return option;
    },

    /**********************************************************************
    * event  [button, link, FN, optiondoropdown..]
    **********************************************************************/
    // 신규 버튼 클릭
    onFooterNew: function () {
        if (this.viewBag.Permission.CUST.Value == "R") {
            ecount.alert(ecount.resource.MSG00456);
            return false;
        }

        if (!(this.viewBag.Permission.CUST.Value == "U" || this.viewBag.Permission.CUST.Value == "W")) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        var cust_name = "";
        if (this.header.currentTabId == "quick") {
            cust_name = this.header.getControl("search1").getValue() || "";
        }

        if (cust_name == "") {
            cust_name = this.header.getQuickSearchControl().getValue();
        }

        var param = {
            Request: {
                EditMode: ecenum.editMode.new,
                Data: {
                    CUST_NAME: cust_name
                }
            },
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 850
        }

        this.openWindow({
            url: '/ECERP/SVC/ESA/ESA002M',
            name: ecount.resource.LBL00336,
            param: param,
            additional: true
        });
    },

    // 사용 중단 버튼 클릭
    onHeaderIncludeNoUse: function (event) {  //포함미포함
        this.onHeaderSearch1()
    },

    onButtonIncludeNoUse: function (event) {
        this.onHeaderSearch1();
    },

    onHeaderReset: function (event) {
        this.header.reset();
        if (this.header.getControl("search1"))
            this.header.getControl("search1").setFocus(0);
        else
            this.header.getControl("CUST").setFocus(0);
    },

    //상단 검색
    onHeaderSearch1: function (event, key) {
        var grid = this.contents.getGrid();
        grid.settings.setColumns([
            { id: 'balance.bal_amt', isHideColumn: true }
        ]);
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        this.contents.getGrid().grid.settings().setFormParameter({
            FormType: "SP910",// 양식구분            
            FormSeq: 1,// 양식순번
            ExtendedCondition: {}
        });

        var invalid = this.header.validate();
        if (invalid.result.length > 0) {
            if (this.header.currentTabId == "quick") {
                this.header.getQuickSearchControl().setFocus(0);
            }
            else {
                this.header.getQuickSearchControl().setFocus(0);
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
                if (this.searchFormParameter.DEL_FLAG == "" || this.searchFormParameter.DEL_FLAG == "N") {
                    this.searchFormParameter.DEL_FLAG = "Y";
                    btnSearch.removeGroupItem("includeNoUse");
                    btnSearch.addGroupItem([{ id: "includeNoUse", label: ecount.resource.BTN00603 }]);
                }
                else {
                    this.searchFormParameter.DEL_FLAG = "N";
                    btnSearch.removeGroupItem("includeNoUse");
                    btnSearch.addGroupItem([{ id: "includeNoUse", label: ecount.resource.BTN00351 }]);
                }
            }
            this.isOnePopupClose = false;
        }
        else {
            var fromheader = this.header.getControl("search1").getValue();
            if (fromheader == "") {
                fromheader = this.header.getQuickSearchControl().getValue();
            }
            else {
                this.header.getQuickSearchControl().setValue("");
            }
            this.searchFormParameter.PARAM = fromheader;

            if (!$.isEmpty(fromheader)) {
                this.isOnePopupClose = true;
            }
            else {
                this.isOnePopupClose = false;
            }


            if (event != "button") {
                if (this.searchFormParameter.DEL_FLAG == "N") {
                    this.searchFormParameter.DEL_FLAG = "Y";
                    btnSearch.removeGroupItem("includeNoUse");
                    btnSearch.addGroupItem([{ id: "includeNoUse", label: ecount.resource.BTN00603 }]);
                }
                else {
                    this.searchFormParameter.DEL_FLAG = "N";
                    btnSearch.removeGroupItem("includeNoUse");
                    btnSearch.addGroupItem([{ id: "includeNoUse", label: ecount.resource.BTN00351 }]);
                }
            }
            this.searchFormParameter.SEARCH_GB = "2";
        }

        this.searchFormParameter.SeachType = 'B';
        this.searchFormParameter.OPEN_SEARCH_YN = "Y";
        this.isSorted = false;
        this.contents.getGrid().grid.settings().setColumnSortable(true);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().draw(this.searchFormParameter);



        this.header.toggle(true);

    },

    // 검색 버튼 클릭
    onHeaderSearch: function (event) {
        this.onHeaderSearch1('button', '');
    },

    // 검색 닫기 버튼 클릭
    onHeaderCloseForm: function (event) {
        this.toggleHeader();
    },

    // 페이지 닫기 버튼 클릭
    onFooterClose: function (e) {
        this.close();
        return false;
    },

    
    // 천건이상조회 버튼 클릭
    onFooterMoreData: function (e) {
        this.header.toggle(true);
        this.isMoreFlag = true;
        this.searchFormParameter.IS_LIMIT = false;
        this.contents.getGrid().grid.settings().setColumnSortable(false);
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 적용 버튼 클릭
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        var _self = this;

        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;           
        }

        var message = {
            name: "CUST_NAME",
            code: "BUSINESS_NO",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        
        if (this.isReceiveDataAll) {
            this.getReceiveDataALL(message);
        }
        else {

            if (this.MariaDb == 'Y') {
                var custs = "";
                selectedItem.forEach(function (cust, i) {
                    custs = custs + cust.BUSINESS_NO + "∬";
                });

                var url = "/SVC/Account/Basic/GetListByFormCustDetail";
                var param = {
                    Request: {
                        CALL_TYPE: this.FilterCustGubun == null ? 102 : this.FilterCustGubun,
                        CUST: custs,
                        IO_TYPE: this.IO_TYPE == null ? '  ' : this.IO_TYPE,
                        EMP_FLAG: this.EmpFlag == null ? 'N' : this.EmpFlag
                    }
                };

                ecount.common.api({
                    url: url,
                    data: Object.toJSON(param),
                    success: function (result) {

                        selectedItem.forEach(function (qtyItem, i) {
                            var rtn = result.Data.where(function (item) { return item.BUSINESS_NO == qtyItem.BUSINESS_NO });
                            if (rtn) {
                                $.extend(qtyItem, qtyItem, rtn[0]);
                            }
                        });

                        message.data = selectedItem;
                        _self.sendMessage(_self, message);
                    }
                });
            }
            else {
                this.sendMessage(this, message);
            }
        } 
    },

    // Include balance Column
    // 잔액포함
    onFooterIncludeBalAmt: function () {
        if (this.searchFormParameter.INCLUDE_BALANCE_BUTTON_VISIBLE == 'Y' || this.isFromBalancePopup) {
            var thisObj = this;
            var grid = thisObj.contents.getGrid().grid;
            var bal_amt = grid.getColumnInfo('balance.bal_amt') == undefined ? undefined : grid.getColumnInfo('balance.bal_amt').dataType;

            var paramData = {
                CustList: [],
            };

            var gridItems = grid && grid.getRowList(gridConst),
                gridConst = ecount.grid.constValue.keyColumnPropertyName; //그리드 key

            this.searchFormParameter.INCLUDE_BALANCE_SEARCH_FLAG = 'Y';

            //계정코드가 없다면 팝업
            if ($.isEmpty(this.searchFormParameter.GYE_CODE)) {
                var params = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 600,
                    parentPageID: this.pageID,
                    SUM_GUBUN: "2",
                    isTopTen: false,
                    isPutWhenOneDataFlag: true,
                    isTreeEventDisable: false,
                    isTreeEventOnLabel: true,
                    isParentCheckBoxDisplayFlag: true,
                    isSpecialCase: false,
                    isViewNoChildParent: false
                };
                this.openWindow({
                    url: '/ECERP/Popup.Search/CM007P',
                    param: params,
                    popupType: false,
                    additional: false
                })
                this.footer.get(0).getControl("AccountOnlyNo2").show();
                return false;
            }

            //그리드 내용이 없을경우
            if (!(gridItems.length > 0)) {
                if (thisObj.searchFormParameter.INCLUDE_BALANCE_YN != 'Y') {
                    //파라미터를 Y값으로 변경하여 검색을 돌린후 조건문에서 잔액포함처리를 함
                    thisObj.searchFormParameter.INCLUDE_BALANCE_YN = 'Y';
                    thisObj.isFromBalancePopup = true;
                    thisObj.onHeaderSearch1('button', '');
                } else {
                    //검색후 내용이없을때 파라미터 상으로는 잔액포함으로 표현
                    thisObj.searchFormParameter.INCLUDE_BALANCE_YN = 'N';
                    thisObj.setIncludeBalances(false);
                }
                return false;
            }

            if (this._totalCount < this._moreCount) {
                this.searchFormParameter.INCLUDE_BALANCE_YN = 'N';

                thisObj.contents.getGrid().draw(thisObj.searchFormParameter);

                return false;
            }
            //예외로직 체크 후 로딩화면
            thisObj.showProgressbar(true, null, 0);

            for (i = 0; i < gridItems.length; i++) {
                if (!$.isEmpty(grid.getCell('BUSINESS_NO', gridItems[i][gridConst]))) {

                    paramData.CustList.push({
                        ROW_KEY: gridItems[i][gridConst],
                        CUST_CD: grid.getCell('BUSINESS_NO', gridItems[i][gridConst]),
                    });
                }
            }

            ecount.common.api({
                url: "/Account/Basic/GetListCustBalanceForSearch",
                async: true,
                data: Object.toJSON($.extend(this.searchFormParameter, paramData)),
                success: function (result) {
                    //해당항목이 추가가안된상태로 로직을 돌면 오류가 나는관계로 체크로직추가
                    if (bal_amt != undefined) {
                        grid.setColumnVisibility("balance.bal_amt", true);
                    }

                    grid.setCellTransaction().start();

                    var items = result && result.Data && result.Data.length > 0 ? result.Data : paramData.CustList;
                    items.forEach(function (qtyItem, i) {
                        grid.setCell("balance.bal_amt", qtyItem.ROW_KEY, qtyItem.BAL_AMT || "0");
                    });
                    grid.setCellTransaction().end();
                    //파라미터를 바꿔줘서 다시 검색할때 파라미터값을 기반으로 재고미포함으로 변경처리
                    thisObj.searchFormParameter.INCLUDE_BALANCE_YN = 'N';
                    thisObj.setIncludeBalances(false);
                },
                complete: function () {
                    thisObj.hideProgressbar(true);
                }
            });
        } else {
            this.searchFormParameter.INCLUDE_BALANCE_SEARCH_FLAG = 'N';
            this.setIncludeBalances(true);
        }
    },

    //잔액표시 셋팅
    setIncludeBalances: function (isHide) {

        this.contents.getGrid().grid.settings().setColumns([
            { propertyName: 'cust.business_no', id: 'cust.business_no', controlType: 'widget.label' },
            { propertyName: 'balance.bal_amt', id: 'balance.bal_amt', isHideColumn: isHide }
        ]);

        var includeControl = this.footer.get(0).getControl("IncludeBalAmt");

        if (isHide) {
            this.searchFormParameter.INCLUDE_BALANCE_BUTTON_VISIBLE = 'Y';
            this.contents.getGrid().grid.setColumnVisibility("balance.bal_amt", false);
            includeControl.removeClass(0, "btn-warning");
            includeControl.addClass(0, "btn-default");
            this.footer.get(0).getControl("AccountOnlyNo2").hide();
        } else {
            this.searchFormParameter.INCLUDE_BALANCE_BUTTON_VISIBLE = 'N';
            this.footer.get(0).getControl("AccountOnlyNo2").show();
            includeControl.addClass(0, "btn-warning");
            includeControl.removeClass(0, "btn-default");
        }

        includeControl.setAllowClick();
    },

    // 검색 조건 클릭
    onDropdownSearchTemplate: function () {
        ecount.alert(ecount.resource.MSG05714);
        return;
        if (this.viewBag.Permission.CUST.Value == "W") {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(),
                height: 450,
                FORM_TYPE: "SS910"
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

    // 리스트 설정 클릭
    onDropdownListSetting: function () {
        if (this.viewBag.Permission.CUST.Value == "W") {
            var param = {
                width: 1020,
                height: 800,
                FORM_TYPE: "SP910",
                FORM_SEQ: 1
            }
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

    /**********************************************************************
    *  hotkey [f1~12, 방향키등.. ]
    **********************************************************************/
    //KEY_F8
    ON_KEY_F8: function () {
        var _self = this;

        if (this.header.isVisible()) {
            this.onHeaderSearch1('button', '');
        }
        else {

            if (this.isApplyDisplayFlag != true)
                return;

            var selectedItem = this.contents.getGrid().grid.getChecked();
            if (selectedItem.length == 0) {
                ecount.alert(ecount.resource.MSG00962);
                return false;
            }

            var message = {
                name: "CUST_NAME",
                code: "BUSINESS_NO",
                data: selectedItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            
            if (this.isReceiveDataAll) {
                this.getReceiveDataALL(message);
            }
            else {

                if (this.MariaDb == 'Y') {
                    var custs = "";
                    selectedItem.forEach(function (cust, i) {
                        custs = custs + cust.BUSINESS_NO + "∬";
                    });

                    var url = "/SVC/Account/Basic/GetListByFormCustDetail";
                    var param = {
                        Request: {
                            CALL_TYPE: this.FilterCustGubun == null ? 102 : this.FilterCustGubun,
                            CUST: custs,
                            IO_TYPE: this.IO_TYPE == null ? '  ' : this.IO_TYPE,
                            EMP_FLAG: this.EmpFlag == null ? 'N' : this.EmpFlag
                        }
                    };

                    ecount.common.api({
                        url: url,
                        data: Object.toJSON(param),
                        success: function (result) {

                            selectedItem.forEach(function (qtyItem, i) {
                                var rtn = result.Data.where(function (item) { return item.BUSINESS_NO == qtyItem.BUSINESS_NO });
                                if (rtn) {
                                    $.extend(qtyItem, qtyItem, rtn[0]);
                                }
                            });

                            message.data = selectedItem;
                            _self.sendMessage(_self, message);
                        }
                    });
                }
                else {
                    this.sendMessage(this, message);
                }
            } 
        }
    },

    //KEY_F2
    ON_KEY_F2: function () {
        this.contents.getGrid("dataGrid" + this.pageID).grid.blur();
        if (this.isNewDisplayFlag) {
            this.onFooterNew();
        }
    },

    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    //KEY_ENTER
    ON_KEY_ENTER: function () {
        if (this.header.isVisible() && this.header.currentTabId != "advanced") {
            this.onHeaderSearch1('button', '');
        }
    },

    //KEY_DOWN
    ON_KEY_DOWN: function () {
    },

    //KEY_UP
    ON_KEY_UP: function () {
    },

    //KEY_Mouseup
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    //KEY_TAB
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    },
    /**********************************************************************
    * user function
    **********************************************************************/
    //신규 등록 후 그리드 다시 그리기
    NewProdList: function (Type, CallType, ChkFlag, GYECODE, empflag, iotype, KeyWord) {
        this.searchFormParameter.IO_TYPE = iotype;
        this.searchFormParameter.EMP_FLAG = empflag;
        this.searchFormParameter.GYE_CODE = GYECODE;
        this.searchFormParameter.keyword = KeyWord;
        this.contents.getGrid().draw(this.searchFormParameter);
        this.isOnePopupClose = true;

    },

    //그리드 포커드 함수
    getObjects: function (obj, val) {
        var retvalue = '';
        $.each(obj, function (i, adata) {
            if (adata.Key.CODE_NO == val)
                retvalue = adata.CODE_DES;
        })

        return retvalue;
    },

    //그리드 포커드 함수
    gridFocus: function () { },

    //파일관리 등록 후 그리드 다시 로드
    SetReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    NewReload: function (code, des) {

        this.isOnePopupClose = true;
        this.header.changeTab("quick");
        this.header.getControl("search1").setValue(code);

        var fromheader = this.header.getControl("search1").getValue();
        this.searchFormParameter.PARAM = fromheader;
        this.searchFormParameter.DEL_FLAG = fromheader.status || "N";

        this.searchFormParameter.SeachType = 'B';
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //  거래처
    setCustBasicInfo: function (data) {

        var self = this;
        var url = "/SVC/Account/Basic/GetListByFormCustDetail";
        var param = {
            Request: {
                CALL_TYPE: this.FilterCustGubun == null ? 102 : this.FilterCustGubun,
                CUST: data.rowItem.BUSINESS_NO,
                IO_TYPE: this.IO_TYPE == null ? '  ' : this.IO_TYPE,
                EMP_FLAG: this.EmpFlag == null ? 'N' : this.EmpFlag
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
    }
});