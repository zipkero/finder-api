window.__define_resource && __define_resource("LBL02717","BTN00113","BTN00007","LBL02736","LBL02722","MSG03839","LBL00703","BTN00004","BTN00351","BTN00603","BTN00069","BTN00043","BTN00265","BTN00957","BTN00008","LBL00562","LBL01970","LBL02716","MSG00456","MSG00141","LBL02718","MSG00962","LBL85138","LBL07309");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 창고 검색 팝업
4. Precaution  : 
5. History     : 
            2015.08.25 (강성훈) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링
            2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
            2016.05.09 (bsy)    :   Add FtFlag , 생산입고에서 사용 생산공장(F), 
            2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
            2019.04.16 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
            2019.12.23 (한재국) : A19_01765 코드형 검색팝업 200건이하시에만 정렬적용
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES008P", {
    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체)
    **********************************************************************/
    objtargetCnt: 1,
    targetCnt: 1,
    newItem: false,
    _moreCount: 200,
    _totalCount: 0,
    isMoreFlag: false, // 200건이상 버튼

    /**********************************************************************
    * page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

        this.searchFormParameter = {
            MULTI_WH_FLAG: '0',
            SUB_CODE: '',
            //FLAG: this.ISLOCATION_OUT ? '1' : this.FLAG,   // 1.공장만 2:창고만 3:전체
            FLAG: this.FLAG,   // 1.공장만 2:창고만 3:전체
            DEL_FLAG: 'N',
            PARAM: (!$.isNull(this.keyword)) ? this.keyword : ' ',
            PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' ',
            PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' ',
            IO_TYPE: (!$.isNull(this.IO_TYPE)) ? this.IO_TYPE : '00',
            FT_FLAG: (!$.isNull(this.FT_FLAG)) ? this.FT_FLAG : ' ',
            PAGE_SIZE: 100,
            PAGE_CURRENT: 0,
            SORT_COLUMN: '',
            SORT_TYPE: 'ASC',
            USERID: '',
            USERID2: '',
            CS_BUSINESSNO: '',
            CD_GROUP: null,
            WH_CD: null,
            MOVE_STAND: ecount.config.inventory.MOVE_STAND,
            PROD_STAND: ecount.config.inventory.PROD_STAND,
            WH_GUBUN: ecount.config.inventory.WH_GUBUN,
            ALL_GROUP_WH: this.allGroupWH,
            IS_LIMIT: true
        };
    },

    render: function () {
        this._super.render.apply(this);
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
    **********************************************************************/
    //Header Setting
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL02717).useQuickSearch();

        //if (this.isIncludeInactive) {
        //퀵서치 추가
        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        //창고코드, 창고명 검색어
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL02736).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL02722).end())

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}
    },

    //Contents Setting
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();
        var thisObj = this;
        grid
            .setRowData(this.viewBag.InitDatas.WhLoad)
            .setRowDataUrl("/Inventory/Basic/GetListLocationForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['WH_CD', 'WH_DES'])
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardEnterForExecute(true)
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse((this.isCheckBoxDisplayFlag) ? true : false)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e));
            })
            .setColumns([
                { propertyName: 'CHK_GUBUN', id: 'CHK_GUBUN', title: ecount.resource.LBL00703, width: 100, align: 'center' },
                { propertyName: 'WH_CD', id: 'WH_CD', title: ecount.resource.LBL02736, width: 100 },
                { propertyName: 'WH_DES', id: 'WH_DES', title: ecount.resource.LBL02722, width: '' }
            ])
            .setCheckBoxActiveRowStyle(true)
            .setCustomRowCell('CHK_GUBUN', this.setGridDataLabel)
            .setCustomRowCell('WH_CD', this.setGridDataLink.bind(this))
            .setCustomRowCell('WH_DES', this.setGridDataLink1.bind(this))
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingRowCountPerPage(100, true)
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.DEL_GUBUN == "Y")
                    return true;
                else
                    return false;
            }, 'danger')
        if (this.viewBag.InitDatas.WhLoad.length != 0 && this.viewBag.InitDatas.WhLoad[0].MAXCNT < this._moreCount) {
            grid.setColumnSortable(true);
        }

        //toolbar.attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //    label: ecount.resource.BTN00004,  //검색
        //    status: this.isIncludeInactive ? [{ value: 'Y', label: ecount.resource.BTN00351 }, { value: 'N', label: ecount.resource.BTN00603 }] : null //N:사용중단미포함, Y:사용중단포함
        //}));

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
    },

    // Footer Setting
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.isApplyDisplayFlag) toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        if (this.isNewDisplayFlag) toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(ecount.resource.BTN00043));
        //toolbar.addLeft(ctrl.define("widget.button", "LevelGroup").label(ecount.resource.BTN00265)); // 임시 제거[하상수 과장님 요청]
        if (this.viewBag.InitDatas.WhLoad.length != 0 && this.viewBag.InitDatas.WhLoad[0].MAXCNT >= this._moreCount) {
            toolbar.addLeft(ctrl.define("widget.button", "moreData").label(ecount.resource.BTN00957).end());
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
                    option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
                }
                break;
            default:
                break;
        }
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
    **********************************************************************/
    // 페이지 로드 완료 이벤트(Completion event page load)
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
            this.header.getQuickSearchControl().setFocus(0);

        }
    },

    // 그리드 로드 완료 이벤트(Completion event Grid load)
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (data.totalDataCount === 1 && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            var obj = {};
            var d = data.dataRows[0];

            var message = {
                name: "WH_DES",
                code: "WH_CD",
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
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },
    /**********************************************************************
    * event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트)
    **********************************************************************/
    // 공장 명칭 변경(Factory name changes)
    setGridDataLabel: function (value, rowItem) {
        var option = {};
        option.data = rowItem.CHK_GUBUN == "1" ? ecount.resource.LBL00562 : rowItem.CHK_GUBUN == "2" ? ecount.resource.LBL01970 : ecount.resource.LBL02716;
        option.controlType = "widget.label";
        return option;
    },

    // 창고 클릭(Click a warehouse)
    setGridDataLink: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = rowItem.WH_CD;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                var message = {
                    name: "WH_DES",
                    code: "WH_CD",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    isFromOrderMngt: this.isFromOrderMngt,
                    callback: this.close.bind(this)
                };

                if (this.isFromOldFramework) {
                    opener.fnNewSlipOrderMng(rowItem.WH_CD);
                    self.close();
                } else {
                    //this.sendMessage(this, message);
                    if (this.isReceiveDataAll) {
                        this.getReceiveDataALL(message);
                    }
                    else {
                        this.sendMessage(this, message);
                    }
                }
            }.bind(this)
        }
        return option;
    },
    /********************************************************************** 
    * 2019.04.11 : 기초 코드 팝업 데이터 모두 가져오기 API [김봉기]
    **********************************************************************/
    getReceiveDataALL: function (message) {
        var self = this;
        var url = "/SVC/Common/Infra/GetReceiveCodeData";
        var returnData = null;
        message.data.CODE_TYPE = ecount.constValue.codePopupType.whCode; // 팝업 코드 타입 추가
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
    // 창고 클릭(Click a warehouse)
    setGridDataLink1: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = rowItem.WH_DES;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                var message = {
                    name: "WH_DES",
                    code: "WH_CD",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    isFromOrderMngt: this.isFromOrderMngt,
                    callback: this.close.bind(this)
                };

                if (this.isFromOldFramework) {
                    opener.fnNewSlipOrderMng(rowItem.WH_CD);
                    self.close();
                } else {
                    //this.sendMessage(this, message);s
                    if (this.isReceiveDataAll) {
                        this.getReceiveDataALL(message);
                    }
                    else {
                        this.sendMessage(this, message);
                    }
                }
            }.bind(this)
        }
        return option;
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },

    onHeaderUsegubun: function (event) {
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onButtonUsegubun: function (event) {
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    /**********************************************************************
    * event  [button, link, FN, optiondoropdown..]
    **********************************************************************/
    // 검색 이벤트(Search event)
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        //if (this.isIncludeInactive) {
        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();
        //}

            this.isOnePopupClose = true;
        this.searchFormParameter.PARAM = "";//value;
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().settings.setPagingCurrentPage(1)
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive && btnSearch) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
            }
            else {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
            }
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("search").setFocus(0);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    // 신규버튼 이벤트(New button in the event)
    onFooterNew: function () {

        if (this.viewBag.Permission.wh.Value == "R") {
            ecount.alert(ecount.resource.MSG00456);
            return;
        }
        if (!(this.viewBag.Permission.wh.Value == "U" || this.viewBag.Permission.wh.Value == "W")) {
            ecount.alert(ecount.resource.MSG00141);
            return;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 400,
            Request: {
                Data: {
                    isAddGroup: false,       
                },
                EditMode: ecenum.editMode.new,
            },
        };

        this.openWindow({
            url: "/ECERP/SVC/ESA/ESA006M",
            name: ecount.resource.LBL02718,
            param: param,
            additional: true
        });
    },

    // 적용 버튼 이벤트(Apply buttons event)
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "WH_DES",
            code: "WH_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        //this.sendMessage(this, message);
        if (this.isReceiveDataAll) {
            this.getReceiveDataALL(message);
        }
        else {
            this.sendMessage(this, message);
        }
    },

    // 닫기 버튼 이벤트(CLOSE button to event)
    onFooterClose: function () {
        this.close();
        return false;
    },

    // 계층 그룹 팝업(Pop-up class group)
    onFooterLevelGroup: function () {
        if (this.viewBag.Permission.wh) {
            var param = {
                width: 900,
                height: 600,
                Type: "SEARCH",
                keyword: "",
            };
            this.openWindow({
                url: '/ECERP/ESA/ESA051M',
                name: ecount.resource.LBL85138,
                param: param,
                additional: true
            });
        }
        else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07309, PermissionMode: "R" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    onMessageHandler: function (event, data) {
        if (event.pageID == "ESA006M") {
            this.isOnePopupClose = true;

            //this.contents.getControl("search").setValue(data.WH_CD);
            this.header.getQuickSearchControl().setValue(data.WH_CD);
            this.searchFormParameter.PARAM = data.WH_CD;
            this.contents.getGrid().settings.setPagingCurrentPage(1)
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

            this.contents.getGrid().draw(this.searchFormParameter);
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /**********************************************************************
    *  hotkey [f1~12, 방향키등.. ]
    **********************************************************************/
    // KEY_F8
    ON_KEY_F8: function () {

        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
            return;
        }
        else if (this.isApplyDisplayFlag != true)
            return;

        var selectedItem = this.contents.getGrid().grid.getChecked();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "WH_DES",
            code: "WH_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    // KEY_F2
    ON_KEY_F2: function () {
        this.contents.getGrid("dataGrid" + this.pageID).grid.blur();
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    // KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target) && target.control)
            this.onContentsSearch(target.control.getValue());
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        //if (this.isIncludeInactive) {
        if (this.header.getControl("search1").getValue() == "")
            this.searchFormParameter.PARAM2 = "";

        if (this.header.getControl("search2").getValue() == "")
            this.searchFormParameter.PARAM3 = "";
        //}

            this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
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

    // KEY_TAB
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    },

    /**********************************************************************
    * user function
    **********************************************************************/
    //창고 신규등록 후 부모 메세지 보내기
    setfnLink: function (objValue) {
        var arrReturnData = objValue.split('|');

        var CallParams = {
            WH_DES: arrReturnData[1],
            WH_CD: arrReturnData[0],
        }

        var message = {
            name: "WH_DES",
            code: "WH_CD",
            data: CallParams,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "current",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //200건 이상 검색시에 정렬링크 없애기
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

        if (data.result.Data.length > 0 && data.result.Data[0].MAXCNT >= this._moreCount) {
            grid.settings.setColumnSortable(false);
            if (this.footer.getControl("moreData") != null && this.isMoreFlag == false) {
                this.footer.getControl("moreData").hide(false);
            }
        } else {
            grid.settings.setColumnSortable(true);
            if (this.footer.getControl("moreData") != null) {
                this.footer.getControl("moreData").hide();
            }
        }

    },

    //200건이상조회 버튼 클릭
    onFooterMoreData: function (e) {
        this.header.toggle(true);
        this.isMoreFlag = true;
        this.searchFormParameter.IS_LIMIT = false;
        this.footer.getControl("moreData").hide();

        this.contents.getGrid().grid.settings().setColumnSortable(false);
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //그리드 포커스를 위한 함수
    gridFocus: function () {

    }
});

