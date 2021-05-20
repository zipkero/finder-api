window.__define_resource && __define_resource("LBL12124","BTN00113","BTN00351","BTN00007","LBL12155","LBL12156","BTN00069","BTN00043","BTN00053","BTN00050","BTN00026","BTN00008","BTN00959","BTN00204","BTN00033","BTN00203","MSG03839","MSG00299","LBL03176","BTN00603","LBL11065","MSG00962","MSG00213");
/****************************************************************************************************
1. Create Date : 2017.01.11
2. Creator     : LeNguyen
3. Description : Biling Unit
4. Precaution  : 
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
            
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EM002P", {
    newItem: false,
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
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , isOthersDataFlag: this.isOthersDataFlag
            , SORT_COLUMN: 'CT_CD'
            , SORT_TYPE: 'A'
            , CD_TYPE: 2  // (1:CONTRACT; 2:UNIT)
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
        header.setTitle(ecount.resource.LBL12124).useQuickSearch();

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
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL12155).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL12156).end())

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
            .setRowData(this.viewBag.InitDatas.Data)
            .setRowDataUrl('/Account/Basic/GetListUnitForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CT_CD'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'CT_CD', id: 'CT_CD', title: ecount.resource.LBL12155, width: '' },
                { propertyName: 'CT_CDNM', id: 'CT_CDNM', title: ecount.resource.LBL12156, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('CT_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('CT_CDNM', this.setGridDateLink.bind(this))
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

        if (this.EditFlag == "M") {
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-primary").label(ecount.resource.BTN00043));
            toolbar.addLeft(ctrl.define("widget.button", "back").css("btn btn-default").label(ecount.resource.BTN00053));
            toolbar.addLeft(ctrl.define("widget.button", "excel").css("btn btn-default").label(ecount.resource.BTN00050));
        }
        else if (this.isChangeDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "change").css("btn btn-primary").label(ecount.resource.BTN00026));

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        if (this.EditFlag == "M") {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                .addGroup([
                    { id: "Deactivate", label: ecount.resource.BTN00204 },
                    { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                    { id: "Activate", label: ecount.resource.BTN00203 }
                ]).css("btn btn-default")
                .clickOnce())
        }

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

        if (this.EditFlag == "I") {
            option.event = {
                'click': function (e, data) {
                    var message = {
                        name: "CT_CDNM",
                        code: "CT_CD",
                        data: data.rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                }.bind(this)
            };
        }
        else {
            option.event = {
                'click': function (e, data) {
                    var params = {
                        width: 500,
                        height: 200,
                        uid: this.uid,
                        CT_CD: data.rowItem["CT_CD"],
                        EditFlag: "M"

                    };

                    //Open popup
                    this.openWindow({
                        url: '/ECERP/EBP/EBP002P_01',
                        name: ecount.resource.LBL12124,
                        param: params,
                        popupType: false,
                        additional: false
                    });

                    e.preventDefault();
                }.bind(this)
            };
        }
        return option;
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['ENABLED'] == false)
            return true;
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        if (!$.isEmpty(this.keyword)) {
            this.isOnePopupClose = true;
        }
        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
    },

    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)
    fnSetSendMessage: function (data) {
        var message = {
            name: "CT_CDNM",
            code: "CT_CD",
            data: data,
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
    onFooterChange: function () {
        this.reloadPage2();
    },

    onFooterBack: function () {
        var param = {
            width: 500,
            height: 200,
            EditFlag: "I",
            isCheckBoxDisplayFlag: false,
            isChangeDisplayFlag: this.isChangeDisplayFlag,
            isIncludeInactive: this.isIncludeInactive
        }

        var self = this;
        self.onAllSubmitSelf("/ECERP/Popup.Search/EM002P", param);
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        self.CodeList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.CodeList += data.CT_CD + ecount.delimiter;
            });

            if (self.CodeList.lastIndexOf(ecount.delimiter) == (self.CodeList.length - 1))
                self.CodeList = self.CodeList.slice(0, -1);

            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }
            self.callDeleteListApi(self.CodeList, selectItem);
        });
    },


    //삭제 처리
    callDeleteListApi: function (Data, selectItem) {

        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val)
            }
        });

        var formdata = {
            DeleteCodes: {
                PARAMS: data                    //단일, 선택삭제시 삭제할 거래처코드
            }
        };

        ecount.common.api({
            url: "/Account/Basic/DeleteBillingUnitList",
            data: Object.toJSON(formdata),
            success: function (result) {

                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else if (result.Data != null && result.Data != "") {
                    self.ShowNoticeNonDeletable(result.Data);
                    for (var idx = 0, limit = selectItem.length; idx < limit; idx++) {
                        self.contents.getGrid().grid.removeChecked(selectItem[idx][ecount.grid.constValue.keyColumnPropertyName]);
                    }
                    self.contents.getGrid().draw(self.searchFormParameter);
                }
                else {
                    self.contents.getGrid().grid.removeCheckedRow();
                    self.contents.getGrid().draw(self.searchFormParameter);
                }
            },
            complete: function (e) {
                btnDelete.setAllowClick();
            }
        });
    },


    //신규버튼
    onFooterNew: function () {

        var param = {
            width: 500,
            height: 200,
            EditFlag: "I",
            uid: this.uid
        }
        this.openWindow({
            url: "/ECERP/EBP/EBP002P_01",
            name: ecount.resource.LBL12124,
            param: param
        });


    },

    onFooterExcel: function (e) {

        var self = this;

        self.searchFormParameter.ExcelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.Columns = [
            { propertyName: 'CT_CD', id: 'CT_CD', title: ecount.resource.LBL12155, width: 180 },
            { propertyName: 'CT_CDNM', id: 'CT_CDNM', title: ecount.resource.LBL12156, width: 180 }

        ];
        self.searchFormParameter.EXCEL_FLAG = "Y";
        self.EXPORT_EXCEL({
            url: "/Account/Basic/GetListUnitForSearchForExcel",
            param: self.searchFormParameter
        });
        self.searchFormParameter.EXCEL_FLAG = "N";
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

    ShowNoticeNonDeletable: function (data) {

        this.errDataAllKey = null;
        this.errDataAllKey = new Array();

        //그리드 리로드후 삭제되지 않은 코드들 체크하기 위해 담아둠 (=> onGridRenderComplete에서 체크로직 진행)
        for (var i = 0; i < data.length; i++) {
            this.errDataAllKey.push(data[i].CHECK_CODE);
        }

        var param = {
            width: 520,
            height: 300,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: "ContractUnit"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    onMessageHandler: function (event, data) {
        if (event.pageID == "ESA008M") {
            this.newItem = true;
            this.isOnePopupClose = true;
            this.keyword = data.CT_CD;

            this.header.getQuickSearchControl().setValue(data.CT_CD);
            this.searchFormParameter.PARAM = data.CT_CD;
            this.contents.getGrid().settings.setPagingCurrentPage(1)
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

            this.contents.getGrid().draw(this.searchFormParameter);
            this.header.getQuickSearchControl().setFocus(0);
        }
        else if (event.pageID == "EBP002P_01") {
            this.contents.getGrid().draw(this.searchFormParameter);
        }

    },

    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            code: "CT_CD",
            name: "CT_CDNM",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
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

        // 입력화면에서 text 컨트롤의 띄어쓰기가 안되는 문제가 있어서 '버튼' 클릭 시 예외 처리
        if (!$.isNull(event) && !$.isNull(event.target) && event.target.nodeName != "BUTTON") {
            this.gridFocus && this.gridFocus();
        }
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        if (this.isIncludeInactive) {
            if (this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.PARAM2 = "";

            if (this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.PARAM3 = "";
        }

        this.searchFormParameter.CD_TYPE = 2;

            this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    reloadPage2: function () {
        var param = {
            width: 500,
            height: 200,
            EditFlag: "M",
            isCheckBoxDisplayFlag: true,
            isNewDisplayFlag: true,
            isChangeDisplayFlag: this.isChangeDisplayFlag,
            isIncludeInactive: this.isIncludeInactive
        }
        var self = this;
        self.onAllSubmitSelf("/ECERP/Popup.Search/EM002P", param);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnBillingUnit(this.getSelectedListforActivate(1));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnBillingUnit(this.getSelectedListforActivate(0));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                CD_TYPE: 2,
                CT_CD: data.CT_CD,
                ENABLED: cancelYN
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnBillingUnit: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/Account/ContractMgmt/UpdateListActiveBillingUnit",
            data: Object.toJSON(updatedList),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.searchFormParameter);
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },
});
