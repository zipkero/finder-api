window.__define_resource && __define_resource("LBL00613","BTN00113","BTN00351","BTN00007","LBL00619","LBL04037","LBL00865","BTN00426","LBL02482","LBL02488","LBL04038","MSG00822","BTN00069","BTN00043","BTN00008","MSG03839","MSG00456","MSG00141","LBL06097","MSG00962","BTN00603");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 관리항목 팝업
4. Precaution  : 
5. History     : 
            2015.08.25 (강성훈) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링.
            2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
            2016.06.04 (Truong Phuc) Modify view list
            2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
            2019.04.16 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM003P", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    newItem: false,
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.isQtyDisplayFlag = this.YFlag == 'Y';
        this.isDisplayAllFlag = (ecount.config.inventory.ITEM_SUM || 'N') == 'Y' && !$.isEmpty(this.PROD_CD) && !$.isEmpty(this.WH_CD);

        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            USE_GUBUN: "N"
            , STR_ALL_FLAG: this.isAllFlag || 'N'
            , WH_CD: this.WH_CD
            , PROD_CD: this.PROD_CD
            , PARAM: this.keyword
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , PROD_SEARCH: "5"
            , STR_MULTI_FLAG: this.isCheckBoxDisplayFlag ? "Y" : "N"
            , isOthersDataFlag: this.isOthersDataFlag
        };
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
        header.setTitle(ecount.resource.LBL00613).useQuickSearch();

        //퀵서치 추가
        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        //검색하단 버튼
        //toolbar
        //    .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

        //if (this.isIncludeInactive) {
        //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        //}
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        var code = ecount.resource.LBL00619;
        var code_des = ecount.resource.LBL04037;

        //관리항목코드, 관리항목명 검색어
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", code).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", code_des).end());

        if (this.isDisplayAllFlag)
            form1.add(ctrl.define("widget.checkbox", "allFlag", "allFlag", ecount.resource.LBL00865).label(ecount.resource.BTN00426).value([1]).end());//LBL02482

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
            settings = generator.grid()
        var decq = '9' + ecount.config.inventory.DEC_Q,  //수량 소수점자릿수
            columns = [
                { propertyName: 'CODE_NO', id: 'CODE_NO', title: ecount.resource.LBL00619, width: '' },
                { propertyName: 'CODE_DES', id: 'CODE_DES', title: ecount.resource.LBL04037, width: '' }
            ];
        if (this.isQtyDisplayFlag) {
            columns.push({ propertyName: 'TOT_QTY', id: 'TOT_QTY', title: this.resource.LBL02488, width: '', dataType: decq, align: 'right' });
            columns.push({ propertyName: 'WH_QTY', id: 'WH_QTY', title: this.resource.LBL04038, width: '', dataType: decq, align: 'right' });
            settings.setEmptyGridMessage(ecount.resource.MSG00822);
        }

        settings
            .setRowData(this.viewBag.InitDatas.MgmtFieldLoad)
            .setRowDataUrl('/Inventory/Basic/GetListMgmtFieldForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CODE_NO', 'CODE_DES', 'TOT_QTY', 'WH_QTY'])
            .setColumns(columns)
            .setColumnSortable(true)
            .setColumnSortDisableList(['TOT_QTY', 'WH_QTY'])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('CODE_NO', this.setGridDateLink.bind(this))
            .setCustomRowCell('CODE_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('TOT_QTY', null)
            .setCustomRowCell('WH_QTY', null)
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true)
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.USE_GUBUN == "N")
                    return true;
                else
                    return false;
            }, 'danger');

        if (this.isQtyDisplayFlag) {
            columns.push({ propertyName: 'TOT_QTY', id: 'TOT_QTY', title: ecount.resource.LBL02488, width: '', dataType: decq, align: 'right' });
            columns.push({ propertyName: 'WH_QTY', id: 'WH_QTY', title: ecount.resource.LBL04038, width: '', dataType: decq, align: 'right' });
            settings.setEmptyGridMessage(ecount.resource.MSG00822);
        }

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

        if (this.isNewDisplayFlag && this.IsFromCS !== true)
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-default").label(ecount.resource.BTN00043));
        else
            keyHelper.push(10);

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        //debugger
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
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function (e) {

        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (this.keyword != "") {
            //this.onContentsSearch({ keyword: this.keyword, index: 2 });
        }

        if (this.isDisplayAllFlag) {
            if (this.isAllFlag && this.isAllFlag == "Y")
                this.header.getControl("allFlag").setCheckedValue("1");
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());

        if (!e.unfocus) {
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
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

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "CODE_DES",
                    code: "CODE_NO",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                if (this.isReceiveDataAll) {
                    this.getReceiveDataALL(message);
                }
                else {
                    this.sendMessage(this, message);
                }
            }.bind(this)
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
        message.data.CODE_TYPE = ecount.constValue.codePopupType.codeNo; // 팝업 코드 타입 추가
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

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        var _oth = (data.dataRows && ((data.dataRows[1] && data.dataRows[1]["K-E-Y"].indexOf("00∮Others") > -1) || (data.dataRows[0] && data.dataRows[0]["K-E-Y"].indexOf("00∮Others") > -1)));
        if (_oth && ($.isEmpty(this.searchFormParameter.PARAM) && $.isEmpty(this.searchFormParameter.PARAM2) && $.isEmpty(this.searchFormParameter.PARAM3)))
            this.isOnePopupClose = false;
        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "CODE_DES",
                code: "CODE_NO",
                data: rowItem,
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
        //else {
        //    //ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        //}
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
        var permission = this.viewBag.Permission.MgmtField;

        if (permission.CR && !permission.CW) {
            ecount.alert(ecount.resource.MSG00456);
            return false;
        }
        if (!(permission.CW || permission.CD)) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 400,
            codeNo: "",
            codeName: "",
            editFlag: "I",
            USEGUBUN: "",
            isAddGroup: true
        };

        this.openWindow({
            url: '/ECERP/SVC/ESA/ESA012M',
            name: ecount.resource.LBL06097,
            param: param,
            //popupType: false,
            additional: true
        });
    },

    onMessageHandler: function (event, data) {
        if (event.pageID == "ESA012M") {
            this.newItem = true;
            this.isOnePopupClose = true;

            if (this.isIncludeInactive != true) {
                //this.contents.getControl("search").setValue(data.CODE);
                this.header.getQuickSearchControl().setValue(data.CODE);
            }
            this.searchFormParameter.PARAM = data.CODE;
            this.searchFormParameter.WH_CD = "";      // 신규일때는 전체 창고에서 검색해서 바로 입력창으로 연결될수 있게 한다. 
            this.contents.getGrid().settings.setPagingCurrentPage(1)
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

            this.contents.getGrid().draw(this.searchFormParameter);
            if (this.isIncludeInactive != true) {
                //this.contents.getControl("search").setFocus(0);
                this.header.getQuickSearchControl().setFocus(0);
            }

            data.callback && data.callback();
        }
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.USE_GUBUN == "Y")
            this.searchFormParameter.USE_GUBUN = "N";
        else
            this.searchFormParameter.USE_GUBUN = "Y";

        this.onContentsSearch('button');
    },

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.USE_GUBUN == "Y")
            this.searchFormParameter.USE_GUBUN = "N";
        else
            this.searchFormParameter.USE_GUBUN = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "CODE_DES",
            code: "CODE_NO",
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

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 전체보기 
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;

            this.isOnePopupClose = true;

        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        //사용중단포함여부(N - 사용중단제외, Y - 사용중단포함)
        //if (this.isIncludeInactive) {
        //    if (!$.isNull(event) && this.searchFormParameter.USE_GUBUN == "Y") {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        //    }
        //    else {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        //    }
        //}
        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive && btnSearch) {
            if (!$.isNull(event) && this.searchFormParameter.USE_GUBUN == "Y") {
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

        //if (this.isAllFlag == 'Y')
        //    this.searchFormParameter.STR_ALL_FLAG = "Y";
        //else {
        if (event.index === 2)
            this.searchFormParameter.STR_ALL_FLAG = "Y";
        else
            this.searchFormParameter.STR_ALL_FLAG = "N";

        if (this.isDisplayAllFlag) {
            if (this.header.getControl('allFlag').getCheckedValue() == 1)
                this.searchFormParameter.STR_ALL_FLAG = "Y";
            else
                this.searchFormParameter.STR_ALL_FLAG = "N";
        }
        //}

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F2
    ON_KEY_F2: function () {
        this.contents.getGrid("dataGrid" + this.pageID).grid.blur();
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    // ON_KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && target.control && this.onContentsSearch(target.control.getValue());
    },

    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
    },

    // ON_KEY_UP
    ON_KEY_UP: function () {
    },

    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
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
    gridFocus: function () { }
});