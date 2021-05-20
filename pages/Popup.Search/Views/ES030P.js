window.__define_resource && __define_resource("LBL03638","BTN00113","BTN00351","BTN00007","LBL11225","LBL11226","LBL12572","LBL10504","BTN00069","BTN00043","BTN00008","MSG03839","MSG00456","MSG00141","LBL09999","LBL90100","MSG00962","BTN00603");
/****************************************************************************************************
1. Create Date : 2017.01.15
2. Creator     : NGUYEN DANG CHI
3. Description : CONTRACT ITEM ( MÃ HẠN MỤC )
4. Precaution  : 
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
           
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES030P", {
    newItem: false,
    isFirstClick: false,
    rowAddCnt: 0,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            PARAM: this.keyword,
            PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' ',
            PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' ',
            isOthersDataFlag: this.isOthersDataFlag,
            SORT_COLUMN: 'CT_ITEM_CD',
            SORT_TYPE: 'A'
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
        header.setTitle(ecount.resource.LBL03638).useQuickSearch();

        if (this.isIncludeInactive) {
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

            //프로젝트코드, 프로젝트명 검색어
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL11225).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL11226).end())

            contents.add(form1);    //검색어
            contents.add(toolbar);  //버튼

            header.add("search")
                .addContents(contents);
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.DataLoad)
            .setRowDataUrl('/Account/Basic/GetListContractTypeForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CT_ITEM_CD', 'CT_ITEM_NM'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'CT_ITEM_CD', id: 'CT_ITEM_CD', title: ecount.resource.LBL11225, width: '' },
                { propertyName: 'CT_ITEM_NM', id: 'CT_ITEM_NM', title: ecount.resource.LBL11226, width: '' },
                { propertyName: 'CT_PRICE_TYPE_DES', id: 'CT_PRICE_TYPE_DES', title: ecount.resource.LBL12572, width: '', align: 'center' }, // nguyenln -> 단가형태
                { propertyName: 'BILLING_CYCLE_TYPE_DES', id: 'BILLING_CYCLE_TYPE_DES', title: ecount.resource.LBL10504, width: '', align: 'center' }

            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount || 100)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('CT_ITEM_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('CT_ITEM_NM', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

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

        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        else
            keyHelper.push(10);

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        debugger
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
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {

        if (!$.isNull(this.keyword)) {
            //this.contents.getcontrol('search').setvalue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
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

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {

        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                if (!this.isNewDisplayFlag) {//현황
                    var message = {
                        code: "CT_ITEM_CD",
                        name: "CT_ITEM_NM",
                        data: data.rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                }
                else {//입력
                    this.setInputSendMessage(data.rowItem, "");
                }
            }.bind(this)
        };
        return option;
    },

    // 입력 데이터 내려주기
    setInputSendMessage: function (data, gubun, load) {
        var AddData = this.setDataSetting(gubun);
        AddData.totalItemCnt = 1;
        AddData.ItemCnt = 0;
        var Data = $.extend(data, AddData);
        var message = {
            code: "CT_ITEM_CD",
            name: "CT_ITEM_NM",
            data: Data,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
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
        var config = {
            controlID: this.controlID,
            TargetTab: this.TargetTab

        };

        if (this.getParentInstance(this.getParentInstance().pageID).getGridProdPopupInfo) {
            parentrow = this.getParentInstance(this.getParentInstance().pageID).getGridProdPopupInfo(this.rowKey, this.rowIdx, this.isFirstClick, config);  // bsy start #1501670
            parentrow.Parent = JSON.parse(parentrow.ParentDate);

            this.barCode = parentrow.BGubun;
            this.barCode2 = parentrow.BGubun2;
        }

        return parentrow;
    },

    setRowBackgroundColor: function (data) {
        if (data['ENABLED'] == false)
            return true;
    },

    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        debugger
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        if (!$.isEmpty(this.keyword)) {
            this.isOnePopupClose = true;
        }

        if (data.dataCount === cnt && this.isNewDisplayFlag && this.isOnePopupClose) {
            return this.setInputSendMessage(data.dataRows[0], "", "");
        } else if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                code: "CT_ITEM_CD",
                name: "CT_ITEM_NM",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
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

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

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
        var permission = this.viewBag.Permission.Permit;

        //if (permission.CR && !permission.CW) {
        //    ecount.alert(ecount.resource.MSG00456);
        //    return false;
        //}
        //if (!(permission.CW || permission.CD)) {
        //    ecount.alert(ecount.resource.MSG00141);
        //    return false;
        //}

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 500,
            isAddGroup: false
        };

        this.openWindow({
            url: '/ECERP/EBP/EBP001P',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL90100),
            param: param,
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

        if (this.isNewDisplayFlag) {
            for (var i = 0; i < selectedItem.length; i++) {

                var AddData = this.setDataSetting("chk");
                //  var Data = common.prod.setInputSendMessage(selectedItem[i], AddData);

                selectedItem.rowKey = AddData.rowKey;
                selectedItem.rowIdx = AddData.rowIdx;

                selectedItem[i].rowKey = AddData.rowKey;
                selectedItem[i].rowIdx = AddData.rowIdx;

                if (i == 0) {
                    selectedItem.oldrowKey = AddData.rowKey;
                }

                selectedItem[i].totalItemCnt = 1;
                selectedItem[i].ItemCnt = i;
                selectedItem[i].oldrowKey = selectedItem.oldrowKey;

                var Data = selectedItem[i];

                if (ecount.config.company.ROW_LIMIT_CNT > 0 && (Number(AddData.AddRow) + 1 >= Number(ecount.config.company.ROW_LIMIT_CNT) || AddData.AddRow == "special-row-0")) {
                    i = selectedItem.length - 1;
                }

                var message = {
                    code: "CT_ITEM_CD",
                    name: "CT_ITEM_NM",
                    data: Data,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "next",
                    callback: (i == selectedItem.length - 1) ? this.close.bind(this) : null,
                    isLastData: (i == selectedItem.length - 1) ? true : false
                };



                this.sendMessage(this, message);
            }
        }
        else {

            var message = {
                code: "CT_ITEM_CD",
                name: "CT_ITEM_NM",
                data: selectedItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
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

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }

        this.isOnePopupClose = true;
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        //if (this.isIncludeInactive) {
        //    if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        //    }
        //    else {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        //    }
        //}
        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive) {
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
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, data) {

        if (event.pageID == "EBP001P") {
            this.newItem = true;
            this.isOnePopupClose = true;
            this.keyword = data.CT_ITEM_CD;
            this.isOnePopupClose = true;
            this.header.getQuickSearchControl().setValue(data.CT_ITEM_CD);
            this.searchFormParameter.PARAM = data.CT_ITEM_CD;
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
