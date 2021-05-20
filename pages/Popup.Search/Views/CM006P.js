window.__define_resource && __define_resource("LBL01375","BTN00113","BTN00007","LBL04043","LBL01377","MSG02158","BTN00069","BTN00033","BTN00043","BTN00957","BTN00008","BTN00351","BTN00603","MSG00962","MSG00456","MSG00141");
/****************************************************************************************************
1. Create Date : 2015.01.08
2. Creator     : 강성훈
3. Description : 재고 > 기초등록 > 부서 코드 조회(SITE)
4. Precaution  :
5. History     : 2015.12.18(정나리) - 체크박스 체크 후 적용버튼 클릭시 부모창으로 데이터 넘겨주도록 추가.
                 2016.01.28(노지혜) - 키보드 방향키 이동로직 추가
                 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
                 2016.11.01 (DUYBAO) use isAdded: this.isCheckBoxDisplayFlag for setGridDataLink, setGridDataLinkDes
                 2019.04.16 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
                 2019.05.08 (Nguyen Thi Ngoc Han) add more condition to function onGridRenderComplete
                 2019.05.08 Nguye Thi Ngoc Han  Test progress : 69082  remove condition to function onGridRenderComplete
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.07.25 [Hao]   - A19_00732 - 양식설정공통화 - 본계정대체 
                                    - Apply rule: 
                                        Input - don't search by IncludeInactive
                                        List/Status search by IncludeInactive
                 2019.12.23 (한재국) : A19_01765 코드형 검색팝업 200건이하시에만 정렬적용
                 2021.01.15(ThanhSang): A19_02687 - 담당자, 부서에대한 개념 재정립_조직도 추가
				 2021.02.03 (김동수) : A21_00863 - 검색창 및 BOM등록조회에 버튼 강조색 빼기
				 2021.02.18 (김동수) : A21_01092 - 검색창에 강조색 빼기_2차
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "CM006P", {
    newItem: false,
    _moreCount: 200,
    _totalCount: 0,
    isMoreFlag: false, // 200건이상 버튼

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            DEL_FLAG: "N",
            CHK_FLAG: (this.CHKFLAG === "L") ? "A" : this.CHKFLAG,
            PARAM: "",
            PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' ',
            PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' ',
            CHK_FLAG_ORGCHT: this.CHK_FLAG_ORGCHT,
            ALLSITE:this.ALLSITE,
            SORT_COLUMN: "",
            SORT_TYPE: "",
            PAGE_SIZE: 0,
            PAGE_CURRENT: 0,
            DIFF_FLAG: "",
            isOthersDataFlag: this.isOthersDataFlag, //'Y'
            ALL_GROUP_SITE: (!$.isNull(this.ALL_GROUP_SITE)) ? this.ALL_GROUP_SITE : ecount.user.ALL_GROUP_SITE,
            IS_LIMIT: true,            
        };
    },
    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },
    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL01375).useQuickSearch();

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

        //부서코드, 부서명 검색어
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL04043).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL01377).end())

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}
    },
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();
        var thisObj = this;

        grid
            .setRowData(this.viewBag.InitDatas.Site)
            .setRowDataUrl("/Account/Basic/GetSiteSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['SITE', 'SITE_DES'])
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardEnterForExecute(true)
            .setKeyboardPageMove(true)
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setColumnFixHeader(true)
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount || 100)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG02158, e));
            })
            .setCheckBoxActiveRowStyle(true, 'active')
            .setColumns([
                { propertyName: "SITE", id: 'SITE', title: ecount.resource.LBL04043, width: '' },
                { propertyName: "SITE_DES", id: 'SITE_DES', title: ecount.resource.LBL01377, width: '' }
            ])
            .setCustomRowCell('SITE', this.setGridDataLink.bind(this))
            .setCustomRowCell('SITE_DES', this.setGridDataLinkDes.bind(this))
            .setCustomRowCell('CHK_H', this.setCheckBoxChecked.bind(this))
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.CANCEL == "Y")
                    return true;
                else
                    return false;
            }, 'danger');
        if (this.viewBag.InitDatas.Site.length != 0 && this.viewBag.InitDatas.Site[0].MAXCNT < this._moreCount) {
            grid.setColumnSortable(true);
        }

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
    },
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));

            if (this.viewBag.DefaultOption.popupEditMode == "02") {
                toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033));
            }
        }
		if (this.isNewDisplayFlag) {
			toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043));
			toolbar.setOptions({ css: "btn btn-default", ignorePrimaryButton: true });
		}
        if (this.viewBag.InitDatas.Site.length != 0 && this.viewBag.InitDatas.Site[0].MAXCNT >= this._moreCount) {
            toolbar.addLeft(ctrl.define("widget.button", "moreData").label(ecount.resource.BTN00957).end());
        }
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar)
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
    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },
    onLoadTabContents: function (event) { },
    onChangeHeaderTab: function (event) { },
    onChangeContentsTab: function (event) { },
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
    },
    onPopupHandler: function (control, config, handler) { },
    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (event, data) {
        debugger
        if (event.pageID == "EBA004M") {
            this.newItem = true;
            this.isOnePopupClose = true;
            this.header.getQuickSearchControl().setValue(data.SITE);
            this.searchFormParameter.PARAM = data.SITE;
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
            this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

            this.contents.getGrid().draw(this.searchFormParameter);
            this.header.getQuickSearchControl().setFocus(0);

        }
    },

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

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },
    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) { },
    onGridRenderComplete: function (e, data, grid) {
        debugger
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = ((this.isOthersDataFlag || "N") != "N" && ecount.user.ALL_GROUP_SITE == "0") ? 2 : 1;
        var _oth = (data.dataRows && ((data.dataRows[1] && data.dataRows[1]["K-E-Y"].indexOf("00∮Others") > -1) || (data.dataRows[0] && data.dataRows[0]["K-E-Y"].indexOf("00∮Others") > -1)));
        if (_oth && ($.isEmpty(this.searchFormParameter.PARAM) && $.isEmpty(this.searchFormParameter.PARAM2) && $.isEmpty(this.searchFormParameter.PARAM3)))
            this.isOnePopupClose = false;
        if (data.dataCount === cnt && this.isOnePopupClose) {
            var obj = {};
            var d = data.dataRows[0];

            var message = {
                name: "SITE_DES",
                code: "SITE",
                data: d,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
                index: this.viewBag.DefaultOption.indexEdit,
                editMode: this.viewBag.DefaultOption.popupEditMode,
                callback: this.close.bind(this)
            };

            if (this.isReceiveDataAll) {
                this.getReceiveDataALL(message);
            }
            else {
                this.sendMessage(this, message);
            }
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },
    onGridAfterFormLoad: function (e, data, grid) { },
    onPopupHandler: function (control, config, handler) {
        handler(config);
    },
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    //검색 / 사용중단 버튼 클릭
    onContentsSearch: function (event) {

        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }
        this.contents.getGrid().settings.setPagingCurrentPage(1);
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.searchFormParameter.PAGE_CURRENT = 1;

            this.isOnePopupClose = true;

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

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },
    //닫기 버튼 클릭
    onFooterClose: function () {
        this.close();
    },

    // Delete buttons event
    onFooterDelete: function (e) {
        var message = {
            Type: "delete",
            editMode: this.viewBag.DefaultOption.popupEditMode,
            index: this.viewBag.DefaultOption.indexEdit,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "SITE_DES",
            code: "SITE",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            index: this.viewBag.DefaultOption.indexEdit,
            editMode: this.viewBag.DefaultOption.popupEditMode,
            callback: this.close.bind(this)
        };

        if (this.isReceiveDataAll) {
            this.getReceiveDataALL(message);
        }
        else {
            this.sendMessage(this, message);
        }
    },

    //계층그룹 버튼 클릭
    onFooterGroup: function () {

        var param = {
            width: 760,
            height: 560,
            Type: "SEARCH",
            Gubun: "ACCT",
            Code: "",
            Text: "",
            input_flag: "Y"
        }

        this.openWindow({
            url: '/ECMain/ESA/ESA056M.aspx',
            name: "ESA056M",
            param: param,
            popupType: true,
            additional: true
        });
    },
    // 부서코드 매핑
    setGridDataLink: function (value, rowItem) {
        var self = this;
        var option = {};
        option.data = rowItem.SITE;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var message = {
                    name: "SITE_DES",
                    code: "SITE",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    index: this.viewBag.DefaultOption.indexEdit,
                    editMode: this.viewBag.DefaultOption.popupEditMode,
                    callback: this.close.bind(this)
                };

                if (this.isReceiveDataAll) {
                    this.getReceiveDataALL(message);
                }
                else {
                    this.sendMessage(this, message);
                }
            }.bind(this)
        }
        return option;
    },
    // 부서명 매핑
    setGridDataLinkDes: function (value, rowItem) {
        var self = this;
        var option = {};        
        option.data = this.CHK_FLAG_ORGCHT == "1" ? rowItem.ORGCHT_MARK_NM : rowItem.SITE_DES;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var message = {
                    name: "SITE_DES",
                    code: "SITE",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    index: this.viewBag.DefaultOption.indexEdit,
                    editMode: this.viewBag.DefaultOption.popupEditMode,
                    callback: this.close.bind(this)
                };

                if (this.isReceiveDataAll) {
                    this.getReceiveDataALL(message);
                }
                else {
                    this.sendMessage(this, message);
                }
            }.bind(this)
        }
        return option;
    },

    setCheckBoxChecked: function (value, rowItem) {
        var option = {};
        if (this.viewBag.DefaultOption.popupEditMode == "02" && this.viewBag.DefaultOption.codeValue.split(",").contains(rowItem.SITE)) {
            option.attrs = {
                "checked": "checked"
            }
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
        message.data.CODE_TYPE = ecount.constValue.codePopupType.site; // 팝업 코드 타입 추가
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
    onFooterNew: function () {

        if (this.viewBag.Permission.Permit.Value == "R") {
            ecount.alert(ecount.resource.MSG00456);
            return;
        }
        if (!(this.viewBag.Permission.Permit.Value == "U" || this.viewBag.Permission.Permit.Value == "W")) {
            ecount.alert(ecount.resource.MSG00141);
            return;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 400,
            Request: {
                EditMode: ecenum.editMode.new,
                Data: {
                    isAddGroup: false
                }
            }
        };

        this.openWindow({
            url: "/ECERP/SVC/EBA/EBA004M",
            name: ecount.resource.LBL01375,
            param: param,
            popupType: false,
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
            name: "SITE_DES",
            code: "SITE",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            index: this.viewBag.DefaultOption.indexEdit,
            editMode: this.viewBag.DefaultOption.popupEditMode,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    // KEY_F2
    ON_KEY_F2: function () {
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_ESC: function () {
        this.close();
    },
    ON_KEY_ENTER: function (e, target) {
        if (target && target.control) {
            this.onContentsSearch(target.control.getValue());
        }
    },

    ON_KEY_F8: function (e) {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag) this.onFooterApply(e);
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

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.IS_LIMIT = true;
        this.isMoreFlag = false;
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

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

});
