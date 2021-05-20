window.__define_resource && __define_resource("LBL04124","BTN00113","BTN00351","BTN00456","BTN00007","LBL01496","LBL02605","LBL01492","LBL01587","BTN00069","BTN00043","BTN00008","MSG03839","LBL03032","MSG00962","BTN00625","BTN00603");
/****************************************************************************************************
1. Create Date : 2016.11.11
2. Creator     : LeNguyen
3. Description : seach(Code,Name,Dept Name)
4. Precaution  : 
5. History     : 2017.09.20(Thien.Nguyen) Modify add param seach(Code,Name,Dept Name) and Include Retiree.
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기

****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EP004P", {
    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체)
    **********************************************************************/
    isFirstClick: false,
    rowAddCnt: 0,
    boardFlag: "N",
    trialOverflowFlag: "N",
    height: 644,
    chkflag: false,

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

    newItem: false,
    retire_flag: 'N',
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            PARAM: this.keyword
            , EMP_CD: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , JUMIN_NO: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , ERP_KNAME: (!$.isNull(this.keyword4)) ? this.keyword4 : ' '
        };

        if (this.checkMaxCount == null || this.checkMaxCount <= 0)
            this.checkMaxCount = 20;
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
        header.setTitle(ecount.resource.LBL04124).useQuickSearch();
        //퀵서치 추가
        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
        //검색하단 버튼
        //toolbar.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113));

        //if (this.isIncludeInactive) {
        //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        //}
        //if (this.isIncludeRetiree)
        //toolbar.addLeft(ctrl.define("widget.button", "includeRetiree").label(ecount.resource.BTN00456).value("Y"));  //포함        
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))


        //프로젝트코드, 프로젝트명 검색어
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL01496).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL02605).end())
            .add(ctrl.define("widget.input.codeName", "search3", "search3", ecount.resource.LBL01492).end());

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼
        header.add("search")
            .addContents(contents);
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
        var keymode = this.isApplyDisplayFlag ? true : false;

        settings
            .setRowData(this.viewBag.InitDatas.ProjectLoad)
            .setRowDataUrl('/Account/Basic/GetListTempEmployeeForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['EMP_CD', 'EMP_KNAME'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'EMP_CD', id: 'EMP_CD', title: ecount.resource.LBL01496, width: '' },
                { propertyName: 'JUMIN_NO', id: 'JUMIN_NO', title: ecount.resource.LBL02605, width: '' },
                { propertyName: 'EMP_KNAME', id: 'EMP_KNAME', title: ecount.resource.LBL01492, width: '' },

            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('EMP_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('JUMIN_NO', this.setGridDateLink.bind(this))
            .setCustomRowCell('EMP_KNAME', this.setGridDateLink.bind(this))

            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxCallback({                                                          //체크 박스 클릭시 발생 하는 이벤트(입력 화면에서 필요)
                'change': function (e, data) {
                    if (this.isNewDisplayFlag && e.target.checked) {
                        this.setInputSendMessage(data.rowItem, "chk")
                    }
                }.bind(this)
            })
            .setCheckBoxHeaderStyle({
                'title': keymode == true ? '' : ecount.resource.LBL01587,
                'visible': keymode,
                'width': 35
            });

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else
            keyHelper.push(11);

        if (this.isNewDisplayFlag && !this.isFromUserPay)
            toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        else
            keyHelper.push(10);

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        
        switch (cid) {
            case "search":
                //if (this.isIncludeInactive) {
                option.addGroup([{ id: 'includeRetiree', label: ecount.resource.BTN00351 }])
                //}
                break;
            default:
                break;
        }
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {

        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },



    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {

                if (this.isIncludeRetiree) {
                    this.retire_flag = this.searchFormParameter.RETIRE_FLAG || 'N';
                }

                var message = {
                    name: "EMP_KNAME",
                    code: "EMP_CD",
                    data: data.rowItem,
                    retire_flag: this.retire_flag,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;

        if (this.isIncludeRetiree) {
            if (!$.isEmpty(data['OUT_DATE']))
                return true;
        }
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {
        
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        var value4 = "";

        if (this.isIncludeInactive || this.isIncludeRetiree) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
            value4 = this.header.getControl("search3").getValue();
        }

        if ((!$.isEmpty(value) || !$.isEmpty(value2) || !$.isEmpty(value3)) && data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && (!this.isNewDisplayFlag || (this.isNewDisplayFlag && this.isOnePopupClose))) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message

        }
        else if ((this.parentPageID == "EBD010M_55" || this.parentPageID == "EPD020M" || this.parentPageID.indexOf("EPD021M") > -1 || this.parentPageID.indexOf("EPD025R") > -1) && data.dataCount == 1) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
    },

    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)
    fnSetSendMessage: function (data) {
        if (this.isIncludeRetiree) {
            this.retire_flag = this.searchFormParameter.RETIRE_FLAG || 'N';
        }
        var message = {
            name: "EMP_KNAME",
            code: "EMP_CD",
            data: data,
            retire_flag: this.retire_flag,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },
    onHeaderIncludeRetiree: function (event) {
        if (this.searchFormParameter.RETIRE_FLAG == "Y")
            this.searchFormParameter.RETIRE_FLAG = "N";
        else
            this.searchFormParameter.RETIRE_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onButtonIncludeRetiree: function (event) {
        if (this.searchFormParameter.RETIRE_FLAG == "Y")
            this.searchFormParameter.RETIRE_FLAG = "N";
        else
            this.searchFormParameter.RETIRE_FLAG = "Y";

        this.onContentsSearch('button');
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //신규버튼
    onFooterNew: function () {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 500,
            isAddGroup: false
        };

        this.openWindow({
            url: '/ECMain/EPD/EPD002M.aspx',
            name: ecount.resource.LBL03032,
            param: param,
            popupType: true,
            additional: true
        });
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        if (this.isIncludeRetiree) {
            this.retire_flag = this.searchFormParameter.RETIRE_FLAG || 'N';
        }
        var message = {
            name: "EMP_KNAME",
            code: "EMP_CD",
            retire_flag: this.retire_flag,
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
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

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        var value4 = "";

        //if (this.isIncludeRetiree || this.isIncludeInactive) {
        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();
        value4 = this.header.getControl("search3").getValue();
        //}
        if (!$.isEmpty(value2) || !$.isEmpty(value3)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.EMP_CD = value2;
        this.searchFormParameter.JUMIN_NO = value3;
        this.searchFormParameter.EMP_KNAME = value4;
        //this.searchFormParameter.DAYWORKER = (!$.isNull(this.strDayWorker)) ? this.strDayWorker : '';
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();


        //if (!$.isNull(event) && this.searchFormParameter.RETIRE_FLAG == "Y") {
        //    this.header.getControl("includeRetiree").changeLabel(ecount.resource.BTN00625);
        //}
        //else {
        //    this.header.getControl("includeRetiree").changeLabel(ecount.resource.BTN00456);
        //}

        var btnSearch = this.header.getControl("search");
        if (!$.isNull(event) && this.searchFormParameter.RETIRE_FLAG == "Y") {
            //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            btnSearch.removeGroupItem("includeRetiree");
            btnSearch.addGroupItem([{ id: "includeRetiree", label: ecount.resource.BTN00603 }]);
        }
        else {
            //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            btnSearch.removeGroupItem("includeRetiree");
            btnSearch.addGroupItem([{ id: "includeRetiree", label: ecount.resource.BTN00351 }]);
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("search").setFocus(0);
        //this.keyword = event.keyword;
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, data) {
        
        if (event.pageID == "ESA008M") {
            this.newItem = true;
            this.isOnePopupClose = true;
            this.keyword = data.EMP_CD;

            this.header.getQuickSearchControl().setValue(data.EMP_CD);
            this.searchFormParameter.PARAM = data.EMP_CD;
            this.contents.getGrid().settings.setPagingCurrentPage(1)
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

            this.contents.getGrid().draw(this.searchFormParameter);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F2
    ON_KEY_F2: function () {
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // KEY_DOWN
    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
    },
    // KEY_UP
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
    },

    // KEY_Mouseup
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.EMP_CD = this.header.getControl("search1").getValue();
        this.searchFormParameter.JUMIN_NO = this.header.getControl("search2").getValue();
        this.searchFormParameter.EMP_KNAME = this.header.getControl("search3").getValue();
        //if (this.isIncludeInactive) {
        //    if (this.header.getControl("search1").getValue() == "")
        //        this.searchFormParameter.PARAM2 = "";

        //    if (this.header.getControl("search2").getValue() == "")
        //        this.searchFormParameter.PARAM3 = "";
        //}

        if (!$.isEmpty(this.searchFormParameter.PARAM) || !$.isEmpty(this.searchFormParameter.PARAM2) || !$.isEmpty(this.searchFormParameter.PARAM3)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

    // 입력 데이터 내려주기
    setInputSendMessage: function (data, gubun, load) {
        
        if (gubun == "chk") {
            this.chkflag = true;
        }

        var AddData = this.setDataSetting(gubun);
        var Data = $.extend({}, data, AddData);

        if ($.isNull(Data)) {
            return false;
        }

        this.parentLoadData = Data.INPUTFOCUS;

        if (gubun !== "chk") {
            Data.rowKey = this.rowKey;
            Data.rowIdx = this.rowIdx;
        }
        else if (gubun !== "chk") {
            Data.rowKey = AddData.lastRowKey || "0";
            Data.rowIdx = AddData.lastRowIdx || "0";
        }
        else if (gubun !== "chk" && this.chkflag) {
            Data.ApplyGubun = true;
            if (gubun !== "chk") {
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
            name: "EMP_KNAME",
            code: "EMP_CD",
            data: Data,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: (gubun == "chk") ? "next" : "current",
            callback: (gubun !== "chk") ? this.close.bind(this) : null
        };
        if (gubun == "chk") {
            this.rowKey++;
            this.parentLoadData = "EMP_CD";
        };
        this.sendMessage(this, message);
        this.rowAddCnt++;

        return true;
    },

    //기초 파람 설정
    setDataSetting: function (gubun) {
        var parentrow;
        if (gubun != "chk" && this.rowAddCnt == 0) this.isFirstClick = true;

        if (gubun != "chk" && this.rowAddCnt > 0) {
            this.isFirstClick = true;
        }
        var config = {
            controlID: this.controlID

        };

        if (this.getParentInstance(this.getParentInstance().pageID).getGridEmpPopupInfo) {
            parentrow = this.getParentInstance(this.getParentInstance().pageID).getGridEmpPopupInfo(this.rowKey, this.rowIdx, this.isFirstClick, config);  // bsy start #1501670
            parentrow.Parent = JSON.parse(parentrow.ParentDate);
        }

        return parentrow;
    },
});
