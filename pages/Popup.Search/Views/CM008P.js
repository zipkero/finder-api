window.__define_resource && __define_resource("LBL04124","LBL00500","BTN00113","BTN00007","LBL01501","LBL04020","LBL01492","LBL00503","MSG03839","BTN00069","BTN00043","BTN00008","BTN00045","BTN00351","BTN00603","MSG00962","LBL01490","LBL09999","LBL00078");
/****************************************************************************************************
1. Create Date : 2015.00.00
2. Creator     : Unknown
3. Description : 들어올계좌
4. Precaution  : 
5. History     : 
            2015.09.03 (BSY) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링.
            2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
            2016.11.17 (bsy) 기타가 아닐때만 자동매핑 
            2019.03.15 (LuongAnhDuy) Dev progress A19_00880
            2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
            2019.06.05 (NguyenDucThinh) A18_04171 Update resource
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM008P"/** page ID */, {
    /**********************************************************************
	* page user opion Variables(사용자변수 및 객체)
	=>페이지에서 사용할 변수 등
	**********************************************************************/
    findGyeCode: false,
    /**********************************************************************
	* page init
	=> 상속 클레스, init, render 등
	**********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            CHK_FLAG: this.CHK_FLAG,
            CALL_TYPE: this.CALLTYPE || '2',
            DEL_FLAG: this.DEL_FLAG,
            PROD_SEARCH: '9',
            PARAM: this.keyword || '',
            PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' ',
            PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' ',
            GYE_CODE: this.GYECODE || '',
            IO_TYPE: this.IOTYPE || '00',
            ACC002_FLAG: this.ACCFLAG || 'Y',
            EMP_FLAG: 'N',
            isOthersDataFlag: this.isOthersDataFlag,
            ALL_GROUP_CUST: ecount.user.ALL_GROUP_CUST,
            isAdmin: this.isAdmin || false,
            comCode: this.comCode || '',
            PAGE_SIZE: 100
        };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
	* form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
	=> 화면ui 셋팅
	**********************************************************************/
    // onInitHeader(상단 설정)
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        var title = (this.CALLTYPE == 6 || this.CALLTYPE == 103 || this.CALLTYPE == 109) ? ecount.resource.LBL04124 : ecount.resource.LBL00500;
        header.setTitle(title).useQuickSearch();

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

        //아이디, 성명
        form1.add(ctrl.define("widget.input.codeName", "search1", "search1", this.GUBUN == "CASE92" ? ecount.resource.LBL01501 : ecount.resource.LBL04020).end())
            .add(ctrl.define("widget.input.codeName", "search2", "search2", this.GUBUN == "CASE92" ? ecount.resource.LBL01492 : ecount.resource.LBL00503).end())

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}
    },

    // onInitContents(본문 설정)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();
        var thisObj = this;

        grid
            .setRowData(this.viewBag.InitDatas.AccCust)
            .setRowDataUrl("/Account/Basic/GetListCustAcc")
            .setRowDataParameter(this.searchFormParameter)
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardEnterForExecute(true)
            .setKeyColumn(['BUSINESS_NO', 'CUST_NAME'])
            .setCheckBoxUse((this.isCheckBoxDisplayFlag) ? true : false)
            .setCheckBoxMaxCount(($.isNull(this.checkMaxCount)) ? 100 : this.checkMaxCount)
            .setCheckBoxRememberChecked(true)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e));
            })
            .setCheckBoxCallback({
                'click': function (e, data) {
                    //체크 박스 클릭시 발생 하는 이벤트(입력 화면에서 필요)
                }
            })
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.CANCEL == "Y") return true;
                else return false;
            }, 'danger')
            .setColumnSortable(true)
            .setColumnSortExecuting(function (e, data) {
                thisObj.searchFormParameter.SORT_COLUMN = data.columnId;
                thisObj.searchFormParameter.SORT_TYPE = data.sortOrder;
                thisObj.contents.getGrid().draw(thisObj.searchFormParameter);
            })

            .setPagingUse(true) // Sử dụng phân trang/Use paging
            .setPagingRowCountPerPage(100, true)    // Đặt số dòng hiển thị ở mỗi trang/Set row to show a page
            .setPagingUseDefaultPageIndexChanging(true)

            .setColumnFixHeader(true)
            .setColumns(
                [
                    { propertyName: 0, id: 'BUSINESS_NO', title: this.GUBUN == "CASE92" ? ecount.resource.LBL01501 : ecount.resource.LBL04020, width: 210 },
                    { propertyName: 1, id: 'CUST_NAME', title: this.GUBUN == "CASE92" ? ecount.resource.LBL01492 : ecount.resource.LBL00503, width: '' }
                ]
            )
            .setCustomRowCell('BUSINESS_NO', this.setGridDataLink.bind(this))
            .setCustomRowCell('CUST_NAME', this.setGridDataNameLink.bind(this))
            ;

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
    },

    // onInitFooter(하단 설정)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));

        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(ecount.resource.BTN00043));

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008).css("btn btn-default"));

        if (this.BTNFALG == "Y") {
            toolbar.addLeft(ctrl.define("widget.button", "PageMove").label(ecount.resource.BTN00045));
        }

        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper"));

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
	=>부모클레스에서 발생하는 이벤트, tab,onload, popup, search 등
	onChangeControl, onChangeContentsTab, onLoadTabPane, onLoadComplete, onMessageHandler...
	**********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        this.header.getQuickSearchControl().setValue(this.keyword);

        if (this.viewBag.InitDatas.AccCust.length == 0 && ![6, 10, 109].contains(this.CALLTYPE) && this.isInput) {
            this.onAllSubmitSelf("/ECERP/Popup.Search/CM007P", {
                keyword: this.keyword,
                CALL_TYPE: "0",
                GYE_CODE: "",
                BUSINESS_NO: "",
                TRX_TYPE: "",
                SER_NO: "",
                CUST_CD: "",
                isOnePopupClose: false,
                isPutWhenOneDataFlag: true,
                isTreeEventOnLabel: true
            }, "details");
        }
        else if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "Z";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "Z";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        debugger
        var value = this.keyword;
        var cnt = ((this.isOthersDataFlag || "N") != "N") ? 2 : 1;
        if (!$.isEmpty(value))
            this.isOnePopupClose = "Y";
        var _oth = (data.dataRows && ((data.dataRows[1] && data.dataRows[1]["K-E-Y"].indexOf("00∮Others") > -1) || (data.dataRows[0] && data.dataRows[0]["K-E-Y"].indexOf("00∮Others") > -1)));
        if (_oth && ($.isEmpty(this.searchFormParameter.PARAM) && $.isEmpty(this.searchFormParameter.PARAM2) && $.isEmpty(this.searchFormParameter.PARAM3)))
            this.isOnePopupClose = false;
        // [2016.11.17 bsy] 기타가 아닐때만
        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
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
            this.sendMessage(this, message);
        }
        else if (data.totalDataCount === 0 && ![6, 10, 109].contains(this.CALLTYPE) && this.isInput) {
            this.onAllSubmitSelf("/ECERP/Popup.Search/CM007P", {
                keyword: this.header.getQuickSearchControl().getValue() || this.keyword,
                CALL_TYPE: "0",
                GYE_CODE: "",
                BUSINESS_NO: "",
                TRX_TYPE: "",
                SER_NO: "",
                CUST_CD: "",
                isOnePopupClose: false,
                isPutWhenOneDataFlag: true,
                isTreeEventOnLabel: true
            }, "details");
        } 
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    fnSendMessage: function (_data) {
        var obj = {};
        var d = _data.dataRows[0];

        var message = {
            name: "CUST_NAME",
            code: "BUSINESS_NO",
            data: d,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "current",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    onMessageHandler: function (event, data) {

        if (event.pageID == "ESA016M") {
            this.isOnePopupClose = true;
            this.header.getQuickSearchControl().setValue(data.business_no);
            this.searchFormParameter.PARAM = data.business_no;
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
            this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

            this.contents.getGrid().draw(this.searchFormParameter);
            this.header.getQuickSearchControl().setFocus(0);

        }
    },

    /**********************************************************************
	* event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트)
	=>grid에서 발생하는 이벤트,onGridInit, onGridRenderComplete,  특정컬럼등에 연결할
	callback 함수등
	**********************************************************************/
    //계좌번호클릭
    setGridDataLink: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = rowItem.BUSINESS_NO;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var message = {
                    name: "CUST_NAME",
                    code: "BUSINESS_NO",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        }
        return option;
    },
    //계좌명클릭
    setGridDataNameLink: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = rowItem.CUST_NAME;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var message = {
                    name: "CUST_NAME",
                    code: "BUSINESS_NO",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        }
        return option;
    },
    /**********************************************************************
	* event  [button, link, FN, optiondoropdown..]
	=>각종 link , button 등에서 클릭이벤트 발생시
	**********************************************************************/
    //검색버튼 클릭
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();

            this.isOnePopupClose = true;

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.searchFormParameter.PAGE_CURRENT = 1;

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
    onFooterClose: function (event) {
        this.close();
    },
    //다른계정찾기(페이지 이동)
    onFooterPageMove: function (event) {
        this.onAllSubmitSelf("/ECERP/Popup.Search/CM007P", {
            keyword: this.keyword,
            CALL_TYPE: "0",
            GYE_CODE: "",
            BUSINESS_NO: "",
            TRX_TYPE: "",
            SER_NO: "",
            CUST_CD: "",
            isTreeEventOnLabel: true
        }, "details");
    },
 
    // Click button [Apply]
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
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
        this.sendMessage(this, message);
    },

    // 신규 (New)
    onFooterNew: function () {
        // Check user authorization    
        if (!['U', 'W'].contains(this.viewBag.Permission.ACCT.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01490, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var param, url;

        // Define data transfer object
        if (this.GUBUN == "CASE92") {
            param = {
                width: ecount.infra.getPageWidthFromConfig(true),
                height: 550,
                editFlag: 'I'
            };
            url = '/ECERP/ESA/ESA016M';
        }
        else {
            param = {
                width: ecount.infra.getPageWidthFromConfig(true),
                height: 550,
                EDIT_FLAG: ecenum.editFlag.New
            };
            url = '/ECERP/EBA/EBA006M';
        }

        // Open popup
        this.openWindow({
            url: url,
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL00078),
            param: param,
            popupType: false,
            additional: false
        });
    },

    /**********************************************************************
	*  hotkey [f1~12, 방향키등.. ]
	=>f키 , ctrl+ .. 방향키 등
	**********************************************************************/
    // ESC
    ON_KEY_ESC: function () {
        this.close();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target) && target.control)
            this.onContentsSearch(target.control.getValue());
    },

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
        else
            this.onContentsSearch();
    },

    onHeaderQuickSearch: function (event) {

        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        if (this.header.getControl("search1").getValue() == "")
            this.searchFormParameter.PARAM2 = "";

        if (this.header.getControl("search2").getValue() == "")
            this.searchFormParameter.PARAM3 = "";

        var value2 = "";
        var value3 = "";

        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();

        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;

            this.isOnePopupClose = true;

        this.contents.getGrid().getSettings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

    },
    /**********************************************************************
	* user function
	=>사용자가 생성한 기능 function 등
	**********************************************************************/
});
