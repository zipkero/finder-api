window.__define_resource && __define_resource("LBL04124","BTN00113","BTN00007","LBL01496","LBL01492","LBL01377","LBL01587","BTN00069","BTN00043","BTN00008","BTN00351","BTN00456","MSG03839","LBL02207","MSG00962","BTN00603","BTN00625");
/****************************************************************************************************
1. Create Date : 2016.11.11
2. Creator     : LeNguyen
3. Description : popup search Employee
4. Precaution  : 
5. History     :    2017.09.20(Thien.Nguyen) Modify add param seach(Code,Name,Dept Name) and Include Retiree.
                    2019.04.16(Le Dan)  setInputSendMessage: [AddData] override [data] ==> [data] override [AddData]
                                        remove: Data.EMP_CD = $.isNull(data.EMP_CD) ? AddData.EMP_CD : data.EMP_CD;
                   [2019.04.24](DucThai) A19_01399 - 팝업 내 체크박스를 이용 코드 선택 시 오류수정
                   2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                   2020.02.28 (JINHO JANG) - A18_03793 - 급여관리2 진행하면서 globalyn 구분값 제거

****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EP001P", {
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
            CHK_FLAG: this.searchCategoryFlag == "L" ? "A" : this.searchCategoryFlag
            , PARAM: this.keyword
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , PARAM4: (!$.isNull(this.keyword4)) ? this.keyword4 : ' '
            , DAYWORKER: (!$.isNull(this.strDayWorker)) ? this.strDayWorker : ' '
            , isOthersDataFlag: this.isOthersDataFlag
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
            form1 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button.group", "search").label(ecount.resource.BTN00113));

        //검색하단 버튼
        toolbar.addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));

        //프로젝트코드, 프로젝트명 검색어
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL01496).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL01492).end())
            .add(ctrl.define("widget.input.codeName", "search3", "search3", ecount.resource.LBL01377).end());

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼
        header.add("search").addContents(contents);
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            settings = generator.grid();
        var keymode = this.isApplyDisplayFlag ? true : false;

        settings
            .setRowData(this.viewBag.InitDatas.ProjectLoad)
            .setRowDataUrl('/Account/Basic/GetListEmployeeForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['EMP_CD', 'EMP_KNAME'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'EMP_CD', id: 'EMP_CD', title: ecount.resource.LBL01496, width: '' },
                { propertyName: 'EMP_KNAME', id: 'EMP_KNAME', title: ecount.resource.LBL01492, width: '' },
                { propertyName: 'SITE_DES', id: 'SITE_DES', title: ecount.resource.LBL01377, width: '' }
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
                if (this.isIncludeInactive) {
                    option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
                }
                if (this.isIncludeRetiree) {
                    option.addGroup([{ id: 'includeRetiree', label: ecount.resource.BTN00456 }])
                }
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
        if (!$.isNull(this.keyword))
            this.header.getQuickSearchControl().setValue(this.keyword);

        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());

        if (!e.unfocus)
            this.header.getQuickSearchControl().setFocus(0);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/

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
                    callback: this.close.bind(this),
                    emp_focus: true
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
        if (!$.isEmpty(this.keyword))
            this.isOnePopupClose = true;
        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose)
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
    },

    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)
    fnSetSendMessage: function (data) {
        if (this.isIncludeRetiree)
            this.retire_flag = this.searchFormParameter.RETIRE_FLAG || 'N';

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
    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onButtonIncludeRetiree: function (event) {
        if (this.searchFormParameter.RETIRE_FLAG == "Y")
            this.searchFormParameter.RETIRE_FLAG = "N";
        else
            this.searchFormParameter.RETIRE_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
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
            height: 800,
            Request: {
                EditMode: ecenum.editMode.new,
                FromProgramId: 'E090101',
                UIOption: {
                    IsShowListButton: false,
                    IsShowSaveNewButton: false,
                    IsShowSaveReviewButton: false
                }
            },
            SAL_TYPE_CD: 'P'
        };

        this.openWindow({
            url: '/ECERP/SVC/EPB/EPB001M',
            name: ecount.resource.LBL02207,
            param: param,
            popupType: false,
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

        if (this.isIncludeRetiree)
            this.retire_flag = this.searchFormParameter.RETIRE_FLAG || 'N';

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
        if (!$.isEmpty(this.parentLoadData)) {
            if (this.getParentInstance(this.getParentInstance().pageID).setEmpCloseFocus) {
                this.getParentInstance(this.getParentInstance().pageID).setEmpCloseFocus(this.parentLoadData, this.rowKey);
            }
        }

        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = this.header.getControl("search1").getValue();
        var value3 = this.header.getControl("search2").getValue();
        var value4 = this.header.getControl("search3").getValue();

            this.isOnePopupClose = true;

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.searchFormParameter.PARAM4 = value4;
        this.searchFormParameter.DAYWORKER = !$.isNull(this.strDayWorker) ? this.strDayWorker : '';
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
            }
            else {
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
            }
        }
        if (this.isIncludeRetiree) {
            if (!$.isNull(event) && this.searchFormParameter.RETIRE_FLAG == "Y") {
                btnSearch.removeGroupItem("includeRetiree");
                btnSearch.addGroupItem([{ id: "includeRetiree", label: ecount.resource.BTN00625 }]);
            }
            else {
                btnSearch.removeGroupItem("includeRetiree");
                btnSearch.addGroupItem([{ id: "includeRetiree", label: ecount.resource.BTN00456 }]);
            }
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, data) {
        switch (event.pageID) {
            case "ESA008M":
                this.triggerQuickSearch(data.EMP_CD);
                break;
        }
    },

    // call from OF -- donot remove -- only remove when develop the NF version of EPD002M.aspx/EPL002M.aspx 
    fnRetGo: function (objValue) {
        if (objValue) {
            var arrReturnData = objValue.split(ecount.delimiter);
            if (arrReturnData.length > 0) {
                this.header.getQuickSearchControl().setValue(arrReturnData[0]);
                this.searchFormParameter.PARAM = arrReturnData[0];
            }
        }
        this.isOnePopupClose = true;
        this.contents.getGrid().settings.setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
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
        if (this.header.isVisible())
            this.onContentsSearch('button', '');
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    ON_KEY_ESC: function () {
        if (!$.isEmpty(this.parentLoadData)) {
            if (this.getParentInstance(this.getParentInstance().pageID).setEmpCloseFocus) {
                this.getParentInstance(this.getParentInstance().pageID).setEmpCloseFocus(this.parentLoadData, this.rowKey);
            }
        }

        this.close();
        return false;
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

        if (this.isIncludeInactive) {
            if (this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.PARAM2 = "";

            if (this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.PARAM3 = "";
        }

            this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

    // 입력 데이터 내려주기
    setInputSendMessage: function (data, gubun, load) {
        if (gubun == "chk")
            this.chkflag = true;

        var AddData = this.setDataSetting(gubun);
        var Data = $.extend({}, AddData, data);

        if ($.isNull(Data))
            return false;

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

            if (gubun !== "chk")
                Data.oldrowKey = AddData.lastRowKey;
            else
                Data.oldrowKey = this.rowKey;

            Data.rowIdx = this.rowIdx;
        }
        else {
            Data.rowKey = AddData ? AddData.rowKey : "";
            Data.rowIdx = AddData ? AddData.rowIdx : "";
        }

        // 체크박스를 클릭 했을땐  포커스를 제거 한다.
        if (gubun == "chk")
            Data.INPUTFOCUS = "";

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
            this.parentLoadData = "EMP_CD";
        }

        this.sendMessage(this, message);
        this.rowAddCnt++;

        return true;
    },

    //기초 파람 설정
    setDataSetting: function (gubun) {
        var parentrow;

        if (gubun != "chk" && this.rowAddCnt == 0)
            this.isFirstClick = true;

        if (gubun != "chk" && this.rowAddCnt > 0)
            this.isFirstClick = true;

        var config = {
            controlID: this.controlID
        };

        if (this.getParentInstance(this.getParentInstance().pageID).getGridEmpPopupInfo) {
            parentrow = this.getParentInstance(this.getParentInstance().pageID).getGridEmpPopupInfo(this.rowKey, this.rowIdx, this.isFirstClick, config);  // bsy start #1501670
            parentrow.Parent = JSON.parse(parentrow.ParentDate);
        }

        return parentrow;
    },

    triggerQuickSearch: function (keyword) {
        this.newItem = true;
        this.isOnePopupClose = true;
        this.keyword = keyword;

        this.header.getQuickSearchControl().setValue(keyword);
        this.searchFormParameter.PARAM = keyword;
        this.contents.getGrid().settings.setPagingCurrentPage(1)
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
    },


    _ON_REDRAW: function (message) {
        var keyword = '';
        if (message && message.Key) keyword = message.Key;
        this.triggerQuickSearch(keyword);
    }
});
