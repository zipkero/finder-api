window.__define_resource && __define_resource("LBL04124","BTN00113","BTN00007","LBL01501","LBL01492","MSG02158","BTN00004","BTN00351","BTN00603","BTN00069","LBL02792","BTN00043","BTN00008","MSG00456","MSG00141","LBL09999","LBL00078","MSG00962");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 담당자 팝업
4. Precaution  : 
5. History     : 
            2015.08.25 (강성훈) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링.
            2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
            2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
            2019.04.15 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
            2019.06.05 (NguyenDucThinh) A18_04171 Update resource
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES006P", {

    newItem: false,

    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            ACCT_CHK: this.accountCheckValue
            , SALE_CHK1: this.purchaseCheckValue
            , SALE_CHK2: this.saleCheckValue
            , SALE_CHK3: this.othersCheckValue
            , SALE_CHK4: this.repairCheckValue
            , PARAM: this.keyword
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , PAGE_SIZE: 100
            , PAGE_CURRENT: 0
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
        header.setTitle(this.customPopupTitle || ecount.resource.LBL04124).useQuickSearch();

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
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        //담당자코드, 담당자명 검색어
        form1.add(ctrl.define("widget.input.search", "search1", "search1", ecount.resource.LBL01501).end())
            .add(ctrl.define("widget.input.search", "search2", "search2", ecount.resource.LBL01492).end())


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
            .setRowData(this.viewBag.InitDatas.PicLoad)
            .setRowDataUrl('/Account/Basic/GetListPicForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['EMP_CD', 'EMP_NAME'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'EMP_CD', id: 'EMP_CD', title: ecount.resource.LBL01501, width: '' },
                { propertyName: 'EMP_NAME', id: 'EMP_NAME', title: ecount.resource.LBL01492, width: '' }
            ])
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingRowCountPerPage(100, true)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount || 100)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG02158, e));
            })
            .setCustomRowCell('EMP_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('EMP_NAME', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

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
        }
        else
            keyHelper.push(11);
        if (this.isAddDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "add").label(ecount.resource.LBL02792));
        }
        else {
            keyHelper.push(11);
        };

        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-default").label(ecount.resource.BTN00043));
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
    // 페이지 완료 이벤트
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
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
                    name: "EMP_NAME",
                    code: "EMP_CD",
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
        message.data.CODE_TYPE = ecount.constValue.codePopupType.custEmpCode; // 팝업 코드 타입 추가
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
        if (data['DEL_GUBUN'] == "Y")
            return true;
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (!$.isEmpty(this.keyword))
            this.isOnePopupClose = true;
        if (data.dataCount === 1 && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "EMP_NAME",
                code: "EMP_CD",
                data: rowItem,
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
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
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
        var permission = this.viewBag.Permission.Pic;

        if (permission.CR && !permission.CW) {
            ecount.alert(ecount.resource.MSG00456);
            return false;
        }
        if (!(permission.CW || permission.CD)) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 500,
            editFlag: "I",
            isAddGroup: false
        };

        this.openWindow({
            url: '/ECERP/ESA/ESA016M',
            name: String.format(ecount.resource.LBL09999, ecount.resource.LBL00078),
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
        var message = {
            name: "EMP_NAME",
            code: "EMP_CD",
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

    //추가버튼
    onFooterAdd: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "EMP_NAME",
            code: "EMP_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next"
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

    //검색, 사용중단 
    onContentsSearch: function (event) {
        //var invalid = this.contents.getControl("search").validate();
        //if (invalid.length > 0) {
        //    this.contents.getControl("search").setFocus(0);
        //    return;
        //}
        // Basic data validation
        var invalid = this.header.validate();

        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return false;
        }

        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        //if (this.isIncludeInactive) {
        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();
        //}

            this.isOnePopupClose = true;
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

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
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, data) {
        if (event.pageID == "ESA016M") {
            this.isOnePopupClose = true;
            //this.contents.getControl("search").setValue(data.business_no);
            this.header.getQuickSearchControl().setValue(data.business_no);
            this.searchFormParameter.PARAM = data.business_no;
            this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
            this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

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
        this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) {
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

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
