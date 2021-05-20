window.__define_resource && __define_resource("LBL10109","LBL10018","LBL10019","LBL03028","LBL03029","BTN00113","BTN00351","BTN00007","LBL03039","LBL03037","BTN00004","BTN00603","BTN00069","BTN00033","BTN00043","BTN00957","BTN00008","MSG03839","MSG00456","MSG00141","LBL03032","MSG00962");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 프로젝트 팝업 팝업
4. Precaution  : 
5. History     : 
            2015.08.25 (강성훈) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링.
            2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
            2017.10.13 (Hao) Add form search: Project Group 1, Project Group 2
            2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
            2019.04.16 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
            2019.12.23(한재국)	- A19_01765 코드형 검색팝업 200건이하시에만 정렬적용
			2021.02.03 (김동수) : A21_00863 - 검색창 및 BOM등록조회에 버튼 강조색 빼기
			2021.02.18 (김동수) : A21_01092 - 검색창에 강조색 빼기_2차
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES007P", {
    newItem: false,
    titlename: '',
    _moreCount: 200,
    _totalCount: 0,
    isMoreFlag: false, // 200건이상 버튼

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
            , PJT_CODE1: (!$.isNull(this.projectGroup1)) ? this.projectGroup1 : ' '
            , PJT_CODE2: (!$.isNull(this.projectGroup1)) ? this.projectGroup1 : ' '
            , isOthersDataFlag: this.isOthersDataFlag
            , IS_LIMIT: true
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

        //Don't you use these code. because these code use much if-context -> 팝업띄우는 화면에서 특정 파라미터를 보내는 것으로 개선 필요.
        //you can program that onPopuphandler-func in parent-page adds titlename.
        if (this.custGroupCodeClass === "G10") {
            this.titlename = String.format(ecount.resource.LBL10109, ecount.resource.LBL10018);
        } else if (this.custGroupCodeClass === "G11") {
            this.titlename = String.format(ecount.resource.LBL10109, ecount.resource.LBL10019);;
        } else this.titlename = ecount.resource.LBL03028;

        header.setTitle(!$.isEmpty(this.titlename) ? String.format(ecount.resource.LBL10109, this.titlename) : ecount.resource.LBL03029).useQuickSearch();

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
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL03039).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL03037).end())
            .add(ctrl.define("widget.multiCode.processCode", "txtPjtGroup1", "PJT_CODE1", ecount.resource.LBL10018).end())
            .add(ctrl.define("widget.multiCode.processCode", "txtPjtGroup2", "PJT_CODE2", ecount.resource.LBL10019).end())

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
        settings
            .setRowData(this.viewBag.InitDatas.ProjectLoad)
            .setRowDataUrl('/Account/Basic/GetListProjectForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['PJT_CD', 'PJT_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'PJT_CD', id: 'PJT_CD', title: ecount.resource.LBL03039, width: '' },
                { propertyName: 'PJT_DES', id: 'PJT_DES', title: ecount.resource.LBL03037, width: '' }
            ])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('PJT_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('PJT_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('CHK_H', this.setCheckBoxChecked.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        if (this.viewBag.InitDatas.ProjectLoad.length != 0 && this.viewBag.InitDatas.ProjectLoad[0].MAXCNT < this._moreCount) {
            settings.setColumnSortable(true);
        }


        //툴바
        //toolbar
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004,  //검색
        //        status: this.isIncludeInactive ? [{ value: 'Y', label: ecount.resource.BTN00351 }, { value: 'N', label: ecount.resource.BTN00603 }] : null //Y:사용중단포함, N:사용중단미포함
        //    }));

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
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
        else
            keyHelper.push(11);

		if (this.isNewDisplayFlag) {
			toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
			toolbar.setOptions({ css: "btn btn-default ", ignorePrimaryButton: true });
		}
        else
            keyHelper.push(10);

        //if (this.viewBag.InitDatas.ProjectLoad.length != 0 && this.viewBag.InitDatas.ProjectLoad[0].MAXCNT >= this._moreCount)
        toolbar.addLeft(ctrl.define("widget.button", "moreData").label(ecount.resource.BTN00957).end());

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
    onLoadComplete: function (e) {
        if (this.footer.getControl("moreData") != null && (this.contents.getGrid().getSettings().getPagingTotalRowCount() < this._moreCount)) {
            this.footer.getControl("moreData").hide();
        }

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
                var message = {
                    name: "PJT_DES",
                    code: "PJT_CD",
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
        };
        return option;
    },

    setCheckBoxChecked: function (value, rowItem) {
        var option = {};
        if (this.viewBag.DefaultOption.popupEditMode == "02" && this.viewBag.DefaultOption.codeValue.split(",").contains(rowItem.PJT_CD)) {
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
        message.data.CODE_TYPE = ecount.constValue.codePopupType.pjtCode; // 팝업 코드 타입 추가
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
        if (data['CANCEL'] == "Y")
            return true;
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        var value = this.keyword;
        if (!$.isEmpty(value)) {
            this.isOnePopupClose = true;
        }
        var _oth = (data.dataRows && ((data.dataRows[1] && data.dataRows[1]["K-E-Y"].indexOf("00∮Others") > -1) || (data.dataRows[0] && data.dataRows[0]["K-E-Y"].indexOf("00∮Others") > -1)));
        if (_oth && ($.isEmpty(this.searchFormParameter.PARAM) && $.isEmpty(this.searchFormParameter.PARAM2) && $.isEmpty(this.searchFormParameter.PARAM3)))
            this.isOnePopupClose = false;
        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
    },

    onPopupHandler: function (control, param, handler) {

        param.isApplyDisplayFlag = true;
        param.isCheckBoxDisplayFlag = true;
        param.isIncludeInactive = true;

        switch (control.id) {
            case "txtPjtGroup1":
                param.Request.Data.CODE_CLASS = "G10";
                param.Request.Data.PARAM = param.keyword;
                break;
            case "txtPjtGroup2":
                param.Request.Data.CODE_CLASS = "G11";
                param.Request.Data.PARAM = param.keyword;
                break;
        }
        this._super.onPopupHandler.apply(this, [control, param, handler]);
    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {
        switch (control.id) {

            case "txtPjtGroup1":
                param.Request.Data.CODE_CLASS = "G10";
                param.Request.Data.PARAM = keyword;
                break;
            case "txtPjtGroup2":
                param.Request.Data.CODE_CLASS = "G11";
                param.Request.Data.PARAM = keyword;
                break;
        }
        handler(param);
    },
    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)
    fnSetSendMessage: function (data) {
        var message = {
            name: "PJT_DES",
            code: "PJT_CD",
            data: data,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            index: this.viewBag.DefaultOption.indexEdit,
            editMode: this.viewBag.DefaultOption.popupEditMode,
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
        var permission = this.viewBag.Permission.Project;

        //if (permission.CR && !permission.CW) {
        //    ecount.alert(ecount.resource.MSG00456);
        //    return false;
        //}
        //if (!(permission.CW || permission.CD)) {
        //    ecount.alert(ecount.resource.MSG00141);
        //    return false;
        //}

        // Define data transfer object
        var params = {
            Request: {
                Data: {
                    isAddGroup: false,
                },
                EditMode: ecenum.editMode.new,

            },
            width: 865, //ecount.infra.getPageWidthFromConfig(true),
            height: 400,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({
            url: '/ECERP/SVC/ESA/ESA008M',
            name: ecount.resource.LBL03032,
            param: params,
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
            name: "PJT_DES",
            code: "PJT_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            index: this.viewBag.DefaultOption.indexEdit,
            editMode: this.viewBag.DefaultOption.popupEditMode,
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

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {

        //var invalid = this.contents.getControl("search").validate();
        //if (invalid.length > 0) {
        //    this.contents.getControl("search").setFocus(0);
        //    return;
        //}
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        var value4 = "";
        var value5 = "";

        var formData = this.header.serialize().merge();
        value2 = formData.search1;
        value3 = formData.search2;
        value4 = formData.PJT_CODE1;
        value5 = formData.PJT_CODE2;

        this.isOnePopupClose = true;

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.searchFormParameter.PJT_CODE1 = value4;
        this.searchFormParameter.PJT_CODE2 = value5;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

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
            this.keyword = data.PJT_CD;

            //this.contents.getControl("search").setValue(data.PJT_CD);
            this.header.getQuickSearchControl().setValue(data.PJT_CD);
            this.searchFormParameter.PARAM = data.PJT_CD;
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
    // KEY_F2
    ON_KEY_F2: function () {
        this.contents.getGrid("dataGrid" + this.pageID).grid.blur();
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
        target && target.control && this.onContentsSearch(target.control.getValue());
    },

    // KEY_DOWN
    ON_KEY_DOWN: function () {
    },
    // KEY_UP
    ON_KEY_UP: function () {
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
});
