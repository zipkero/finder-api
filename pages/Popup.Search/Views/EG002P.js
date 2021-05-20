window.__define_resource && __define_resource("LBL00330","BTN00113","BTN00351","BTN00007","LBL00381","LBL00359","LBL02874","LBL02509","LBL01864","LBL01517","BTN00004","BTN00603","BTN00069","BTN00043","BTN00008","BTN00315","LBL93617","MSG03839","MSG00456","MSG00141","LBL03119","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.07.21
2. Creator     : Nguyen Minh Thien
3. Description : List Customer/vendor
4. Precaution  : 
5. History     : [2017.02.23] (Thien.Nguyen)Change all in one 1 menu to new FW
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "EG002P", {
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
            , isOthersDataFlag: this.isOthersDataFlag
            , SORT_COLUMN: ''
            , PARAM_TYPE: '9' // search by company des/ cust_idx
            , SORT_TYPE: ''
            , CANCEL_TYPE: 'N'
            , PAGE_SIZE: 100

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
        header.setTitle(ecount.resource.LBL00330).useQuickSearch();

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
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL00381).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL00359).end())

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
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl('/Groupware/CRM/GetListCustForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CUST_IDX', 'COMPANY_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                    { propertyName: 'CUST_IDX', id: 'CUST_IDX', title: ecount.resource.LBL02874, controlType: 'widget.label', width: '' },
                    { propertyName: 'COMPANY_DES', id: 'COMPANY_DES', title: ecount.resource.LBL00359, controlType: 'widget.label', width: '' },
                    { propertyName: 'TEL_NO', id: 'TEL_NO', title: ecount.resource.LBL02509, controlType: 'widget.label', width: '' },
                    { propertyName: 'COM_ADDR', id: 'COM_ADDR', title: ecount.resource.LBL01864, controlType: 'widget.label', width: '' },
                    { propertyName: 'aaa', id: 'aaa', title: ecount.resource.LBL01517, controlType: 'widget.label', width: '' }
            ])
            .setColumnSortable(true)
            .setColumnSortDisableList(['TEL_NO', 'COM_ADDR', 'aaa'])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))

            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setColumnFixHeader(true)

            .setCustomRowCell('CUST_IDX', this.setGridDateLink.bind(this))
            .setCustomRowCell('COMPANY_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('aaa', this.setGridDateLinkDetail.bind(this))

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
    onLoadComplete: function (e) {

        if (!$.isEmpty(this.keyword)) {
            //this.contents.getcontrol('search').setvalue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        //var grid = this.contents.getGrid();
        //grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
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
                this.corverData(data.rowItem);
                var message = {
                    name: "COMPANY_DES",
                    code: "CUST_IDX",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    corverData: function(rowItem){
        if (this.parentPageID == "EGG011R")
            if (rowItem.length > 0) {
                for (var i = 0; i < rowItem.length; i++) {
                    rowItem[i].CUST_IDX = rowItem[i].CUST_IDX + '-' + rowItem[i].CUST;
                }
            } else {
                rowItem.CUST_IDX = rowItem.CUST_IDX + '-' + rowItem.CUST;
            }
    },

    setGridDateLinkDetail: function (value, rowItem) {
        var option = {};
        var hidData = "";
        var selfThis = this;
        if (rowItem.GUBUN != "11" && rowItem.GUBUN != "13" && rowItem.GUBUN != "19")
            option.data = ' ';
        else
            option.data = ecount.resource.BTN00315;

        option.dataType = "1";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                
                var SDate = selfThis.viewBag.Sdate.substring(0, 10).replace('-', '').replace('-', '');
                var EDate = selfThis.viewBag.Edate.substring(0, 10).replace('-', '').replace('-', '');

                var param = {
                    width: 800,
                    height: 600,
                    cust: data.rowItem.CUST_IDX,
                    CustEditType: "ALL_IN_ONE_SEARCH",
                    MENU_TYPE: "G",
                    hidCustType:"G"
                    //hidData: String.format("{0};{1};{2};CUST_NAME;A;0;", data.rowItem.CUST_IDX, "N", "00"),

                };
               // var Req = "?cust=" + data.rowItem.CUST_IDX + "&SDate=" + SDate + "&EDate=" + EDate + "&MENU_TYPE=G&hidCustType=G&CustEditType=ALL_IN_ONE_SEARCH";

                this.openWindow({
                    url: '/ECERP/ESQ/ESQ501M',
                    name: ecount.resource.LBL93617,
                    param: param,
                    popupType: false,
                    additional: true,
                    fpopupID: this.ecPageID
                });
                e.preventDefault();

            }.bind(this)
        };
        return option;
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['CANCEL_YN'] == "Y")
            return true;
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {
        
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var cnt = (this.isOthersDataFlag != "N") ? 2 : 1;
        var value = this.keyword;

        if (!$.isEmpty(value))
            this.isOnePopupClose = true;

        if (data.dataCount === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];
            this.corverData(rowItem);
            var message = {
                name: "COMPANY_DES",
                code: "CUST_IDX",
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
        if (this.searchFormParameter.CANCEL_TYPE == "Y")
            this.searchFormParameter.CANCEL_TYPE = "N";
        else
            this.searchFormParameter.CANCEL_TYPE = "Y";

        this.onContentsSearch('button');
    },

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.CANCEL_TYPE == "Y")
            this.searchFormParameter.CANCEL_TYPE = "N";
        else
            this.searchFormParameter.CANCEL_TYPE = "Y";

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
        var permission = this.viewBag.Permission.CrmClient.Value;
        
        if (permission.Value == "R") {
            ecount.alert(ecount.resource.MSG00456);
            return false;
        }
        if (!(permission == "U" || permission == "W")) {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 850,
            Request: {
                Data: {
                    Key: {
                        CUST_IDX: 0
                    }
                },
                EditMode: ecenum.editMode.new
                , Url: "EG002P"
            }
        };

        this.openWindow({
            url: "/ECERP/SVC/EGM/EGM002M",
            name: ecount.resource.LBL03119,
            param: param
        });
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        this.corverData(selectedItem);
        var message = {
            name: "COMPANY_DES",
            code: "CUST_IDX",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
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

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }

        this.isOnePopupClose = true;
        
        if (!$.isEmpty(value2)) {
            this.searchFormParameter.PARAM = value2;
            this.searchFormParameter.PARAM_TYPE = 1;
        }
        else if (!$.isEmpty(value3)) {
            this.searchFormParameter.PARAM = value3;
            this.searchFormParameter.PARAM_TYPE = 0;
        }

        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        //if (this.isIncludeInactive) {
        //    if (!$.isNull(event) && this.searchFormParameter.CANCEL_TYPE == "Y") {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        //    }
        //    else {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        //    }
        //}
        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.CANCEL_TYPE == "Y") {
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
        else if (event.pageID == "EGM002M") {
            // 잠재거래처등록
            this.fnReturnResult(data.custIdx);
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

        var gridObj = this.contents.getGrid();
        var settings = gridObj.grid.settings();
        settings.setHeaderTopMargin(this.header.height());
        gridObj.getSettings().setPagingCurrentPage(1);
        gridObj.draw(this.searchFormParameter);
    },
    setXMLData: function () {
        var data = {};
        
        data["txtEgCustCd"] = "";
        data["txtCustTitle"] = "";
        data["ddlGubun"] = "";
        data["txtTel"] = "";
        data["txtMobile"] = "";
        data["txtCustCd"] = "";
        data["txtCustDes"] = "";
        data["txtBossName"] = "N";
        data["txtUptae"] = "";
        data["txtJongmok"] = "0";
        data["txtAddr"] = "";
        data["txtRemark"] = "";
        data["txtUpdateId"] = "";
        data["txtUpdateName"] = "";
        data["hidTabGubun"] = "1";
        data["hidcdkey1"] = "";
        data["hidcdkey2"] = "";
        data["hidcdkey3"] = "";
        data["hidcdkey4"] = "";
        data["hidcdkey5"] = "";
        data["hidcdkey6"] = "";
        data["hidcdkey7"] = "";
        data["hidcdkey8"] = "";
        data["hidcdkey9"] = "";
        data["hidcdkey10"] = "";
        data["hidcdkey11"] = "";
        data["hidcdkey12"] = "";
        data["hidcdkey13"] = "";
        data["hidcdkey14"] = "";
        data["hidcdkey15"] = "";
        data["hidcdkey16"] = "";
        data["hidcdkey17"] = "";
        data["hidcdkey18"] = "";
        data["hidcdkey19"] = "";
        data["hidcdkey20"] = "";
        data["txtColValue1"] = "";
        data["txtColValue2"] = "";
        data["txtColValue3"] = "";
        data["txtColValue4"] = "";
        data["txtColValue5"] = "";
        data["txtColValue6"] = "";
        data["txtColValue7"] = "";
        data["txtColValue8"] = "";
        data["txtColValue9"] = "";
        data["txtColValue10"] = "";
        data["txtColValue11"] = "";
        data["txtColValue12"] = "";
        data["txtColValue13"] = "";
        data["txtColValue14"] = "";
        data["txtColValue15"] = "";
        data["txtColValue16"] = "";
        data["txtColValue17"] = "";
        data["txtColValue18"] = "";
        data["txtColValue19"] = "";
        data["txtColValue20"] = "";
        data["hidEditMode"] = "";
        data["hidCustidx"] = "";
        data["hidFirstOpen"] = "Y";
        data["hidsort"] = "";
        data["hidsortad"] = "";
        data["hidCurrentPage"] = "0";
        data["hidPageSize"] = "";
        data["hidpop"] = "";
        return {
            "hidSearchXml": ecount.common.toXML(data),
        };
    },
    fnReturnResult: function (strCustNm) {
        
        //  ecount.alert('cust');

        this.header.getQuickSearchControl().setValue(strCustNm);
        this.searchFormParameter.PARAM_TYPE = '9';
        this.searchFormParameter.PARAM = strCustNm;

        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("search").setFocus(0);
        this.header.getQuickSearchControl().setFocus(0);
    },
    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
