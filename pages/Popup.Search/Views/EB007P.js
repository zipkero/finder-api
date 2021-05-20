window.__define_resource && __define_resource("LBL10109","LBL00515","BTN00113","BTN00351","BTN00007","LBL00234","LBL17427","LBL04156","BTN00069","BTN00043","BTN00008","MSG03839","LBL90096","MSG00962","BTN00603");
/****************************************************************************************************
1. Create Date : 2015.12.02
2. Creator     : 서득서
3. Description : 회계1 > 고정자산 > 고정자산 검색 팝업
                 Search popup of fixed assets
4. Precaution  :
5. History     : 
                    2017-01-18  Pham Nhat Quang     Add: this.parentPageID == 'EBH011R'
                    2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                    2017-01-18  Pham Nhat Quang     Add: this.parentPageID == 'EBH011R'
                    2019.04.16 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
                    2019.06.05 (NguyenDucThinh) A18_04171 Update resource
                    2020.11.26 (Ho Thanh Phu) A20_06356 - 회계1>고정자산>고정자산대장>고정자산검색시 [적용]버튼 없음
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EB007P", {
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
            CHK_FLAG: this.searchCategoryFlag == "L" ? "A" : this.searchCategoryFlag
            , PARAM: this.keyword
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            
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
        header.setTitle(String.format(ecount.resource.LBL10109, ecount.resource.LBL00515)).useQuickSearch();

        //if (this.isIncludeInactive) {
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
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL00234).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL17427).end())

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.ListFixedAssetsCode)
            .setRowDataUrl('/Account/FixedAssets/GetListFixedAssetsCodeForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn('ASSETS_CODE')
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'GYE_DES', id: 'GYE_DES', title: ecount.resource.LBL04156, width: '', isHideColumn: this.parentPageID == 'EBH006R' || this.parentPageID == 'EBH007R' || this.parentPageID == 'EBH011R' || this.parentPageID == 'EBH009R' ? false : true },
                {
                    propertyName: 'ASSETS_CODE', id: 'ASSETS_CODE', title: ecount.resource.LBL00234, width: ''
                },
                { propertyName: 'ASSETS_DES', id: 'ASSETS_DES', title: ecount.resource.LBL17427, width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(20, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('ASSETS_CODE', this.setGridDateLink.bind(this))
            .setCustomRowCell('ASSETS_DES', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);



        contents
            .addGrid("dataGrid", settings);
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
    onLoadComplete: function (event) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());

        if (!event.unfocus) {
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
                if (this.isOldFramework) {
                    opener.fnSetFixedAssetsCode(
                        data.rowItem["ASSETS_CODE"],
                        data.rowItem["ASSETS_DES"],
                        data.rowItem["GYE_CODE"],
                        data.rowItem["IN_AMT"],
                        data.rowItem["REPAY_AMT"],
                        data.rowItem["QTY"],
                        data.rowItem["QTY_GUBUN"],
                        data.rowItem["EST_GUBUN"]);
                    this.close();
                } else {
                    var message = {
                        name: "ASSETS_DES",
                        code: "ASSETS_CODE",
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
        message.data.CODE_TYPE = ecount.constValue.codePopupType.assetsCode; // 팝업 코드 타입 추가
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
    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['CANCEL_YN'] == "Y")
            return true;
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {
        if (!$.isEmpty(this.keyword)) {
            this.isOnePopupClose = true;
        }
        if (data.dataCount === 1 && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "ASSETS_DES",
                code: "ASSETS_CODE",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            if (this.isReceiveDataAll) {
                this.getReceiveDataALL(message);
            }

        } else {
            ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        }

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
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 800,
            isAddGroup: false,
            IsOldFramework: this.isOldFramework,
            IsFromSearch: true,
            Request: {
                EditMode : ecenum.editMode.new,
                Key: {
                    Code : ""
                }
            }
        };

        this.openWindow({
            url: '/ECERP/SVC/EBH/EBH002M',
            name: ecount.resource.LBL90096,
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

        var message = {
            name: "ASSETS_DES",
            code: "ASSETS_CODE",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };

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

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = this.header.getControl("search1").getValue();
        var value3 = this.header.getControl("search2").getValue();

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
        this.header.getControl("search").setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, message) {
        var self = this;
        if (event.pageID == "EBH002M") {
            if (message.EditMode == ecenum.editMode.new) {
                var formData = {
                    ASSETS_CODE: message.ASSETS_CODE
                }
                if (message.callback) message.callback();

                ecount.common.api({
                    url: "/Account/FixedAssets/GetFixedAssetsCodeAjax",
                    data: Object.toJSON(formData),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else {
                            if (self.isOldFramework) {
                                opener.fnSetFixedAssetsCode(
                                    message.ASSETS_CODE,
                                    result.Data.ASSETS_DES,
                                    result.Data.GYE_CODE,
                                    result.Data.IN_AMT,
                                    result.Data.REPAY_AMT,
                                    result.Data.QTY,
                                    result.Data.QTY_GUBUN,
                                    result.Data.EST_GUBUN);
                                this.close();
                            } else {
                                self.newItem = true;
                                self.isOnePopupClose = true;
                                self.keyword = message.ASSETS_CODE;

                                self.header.getQuickSearchControl().setValue(message.ASSETS_CODE);
                                self.searchFormParameter.PARAM = message.ASSETS_CODE;
                                self.contents.getGrid().settings.setPagingCurrentPage(1)
                                self.contents.getGrid().grid.settings().setCheckBoxClearChecked();

                                self.contents.getGrid().draw(self.searchFormParameter);
                                self.header.getQuickSearchControl().setFocus(0);
                            }
                        }
                    }
                });
                /*ecount.parentFrame.fnSetFixedAssetsCode(
                    message.assetsInfo.ASSETS_CODE,
                    message.assetsInfo.ASSETS_DES,
                    message.assetsInfo.GYE_CODE,
                    message.assetsInfo.IN_AMT,
                    message.assetsInfo.REPAY_AMT,
                    message.assetsInfo.QTY,
                    message.assetsInfo.QTY_GUBUN,
                    message.assetsInfo.EST_GUBUN);
                ecount.parentFrame.objDHtml.close();*/
            } else {
                this.newItem = true;
                this.isOnePopupClose = true;
                this.keyword = message.ASSETS_CODE;

                this.header.getQuickSearchControl().setValue(message.ASSETS_CODE);
                this.searchFormParameter.PARAM = message.ASSETS_CODE;
                this.contents.getGrid().settings.setPagingCurrentPage(1)
                this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

                this.contents.getGrid().draw(this.searchFormParameter);
            }
        }

        if (message.callback) message.callback();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F2
    ON_KEY_F2: function () {
        this.contents.getGrid().grid.blur();
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

        if (this.header.getControl("search1").getValue() == "")
            this.searchFormParameter.PARAM2 = "";

        if (this.header.getControl("search2").getValue() == "")
            this.searchFormParameter.PARAM3 = "";

            this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
