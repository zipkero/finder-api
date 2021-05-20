window.__define_resource && __define_resource("LBL15847","LBL15848","LBL00397","BTN00113","BTN00351","BTN00007","LBL00225","LBL35182","LBL02874","BTN00004","BTN00553","LBL13072","BTN00008","BTN00043","LBL00921","BTN80047","LBL70203","BTN70010","LBL01070","MSG02158","LBL11726","MSG00141","LBL07436","MSG00303","MSG00299","MSG00962","BTN00603");

/*--- ES019P.js ---*/
/****************************************************************************************************
1. Create Date : 2015.04.02
2. Creator     : 노지혜
3. Description : 재고 > 기초등록 > 품목등록 > 규격검색(Search Spec.)
4. Precaution  :
5. History     : 2015.10.28 전영준 - 규격 그룹리스트 팝업, 규격코드,그룹코드 등록 수정, 선택삭제 리스트  EXCEL 기능 추가.   
                 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2020.04.27 [황재빈] Dev. 41015 오류수정 - 적용버튼이 항상 보이는 문제
                 2021.01.14 (Ho Thanh Phu) A20_06859 - 규격그룹 선택화면 > 신규 및 수정 > 그룹 검색 시 검색된 그룹이 1개면 바로 그룹이 입력되어버리는 건
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES019P", {

    //isOnePopupClose: false,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: this.keyword,
            PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' ',
            PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' ',
            SORT_COLUMN: 'CODE_CLASS',
            ListFlag: this.ListFlag == "List" ? true : false,
            DEL_FLAG: this.ListFlag == "List" ? "" : "N"
        };
        this.isUseExcelConvert = ecount.config.user.USE_EXCEL_CONVERT;
        this.isNewDisplayFlag = this.isNewDisplayFlag == null ? true : this.isNewDisplayFlag;
        this.isEditMode = false;
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

        if (this.ListFlag === "List") {
            header.setTitle(ecount.resource.LBL15847).useQuickSearch(); //규격그룹리스트
        } else {
            header.setTitle(ecount.resource.LBL15848 + ecount.resource.LBL00397).useQuickSearch(); // 규격그룹검색
        }

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

            //아이디, 성명
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL00225).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL35182).end())

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

        var columns = [
            { propertyName: 'CODE_CLASS', id: 'CODE_CLASS', title: ecount.resource.LBL00225, width: '' }, // resource: 규격그룹코드
            { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL35182, width: '' }, //resource: 규격그룹명
        ]
        settings
            .setRowDataUrl('/Inventory/Common/GetListSpecForSearch')
            .setRowData(this.viewBag.InitDatas.ListLoad)
            .setKeyColumn(['CODE_CLASS', 'CLASS_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCustomRowCell('CODE_CLASS', this.setGridDateLink.bind(this))
            .setCustomRowCell('CLASS_DES', this.setGridDateLink.bind(this))
            .setColumnSortDisableList(['CODE'])
            .setCustomRowCell("CODE", this.registerSpecGroupPopupLink.bind(this))
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardEnterForExecute(true)
            .setEventFocusOnInit(true);                  //Focus 이벤트 시작;
        if (this.ListFlag === "List") {
            settings.setCheckBoxUse(true)
            columns.push({ propertyName: 'CODE', id: 'CODE', title: ecount.resource.LBL02874, width: '55', align: 'center' }) //resource: 코드
        }

        if (this.isApplyDisplayFlag) {
            settings.setCheckBoxUse(true);
        }

        settings.setColumns(columns);
        this.searchFormParameter.columns = columns;
        //툴바
        //toolbar
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004  //검색
        //    }));
        contents
            .add(toolbar)
            .addGrid("dataGrid", settings);
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00553));
        } else {
            if (!this.searchFormParameter.ListFlag) {
                if (this.isNewDisplayFlag) {
                    toolbar.addLeft(ctrl.define("widget.button", "modify").label(ecount.resource.LBL13072));
                }
                toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
            } else {
                toolbar
                    .addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).end()) //신규(F2)
                    .addLeft(ctrl.define("widget.button", "Pre").label(ecount.resource.LBL00921).end())//이전
                    .addLeft(ctrl.define("widget.button", "Excel").label("Excel").end())//
                    .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).end())// 닫기
                    .addLeft(ctrl.define("widget.button", "DeleteMulti").label(ecount.resource.BTN80047).clickOnce().end());//선택삭제

                this.isEditMode = true;
            }
        }

        toolbar
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([10, 11]));
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
    onLoadComplete: function () {
        this.header.getQuickSearchControl().setFocus(0);
        this.fnReload();
    },
    //재로드
    fnReload: function (e) {
        this.header.getQuickSearchControl().setFocus(0);

        if (e != undefined) {
            var grid = this.contents.getGrid();
            grid.getSettings().setHeaderTopMargin(this.header.height());
            grid.draw(this.searchFormParameter);
        }
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
                //리스트
                if (this.ListFlag == "List") {
                    this.openWindow({
                        url: "/ECERP/ESA/ESA010P_07",
                        name: ecount.resource.LBL15848 + ecount.resource.LBL70203,//"규격그룹수정"
                        additional: false,
                        param: {
                            width: 600,
                            height: 180,
                            EDIT_FLAG: true,
                            CODE_CLASS: data.rowItem.CODE_CLASS,
                        },
                    });
                    //변경
                } else {
                    var message = {
                        name: "CLASS_DES",
                        code: "CODE_CLASS",
                        data: data.rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                }

            }.bind(this)
        };
        return option;
    },

    // Set bank account link 이름 바꾸기
    registerSpecGroupPopupLink: function (value, rowItem) {

        var option = {};

        option.controlType = "widget.link";
        option.data = ecount.resource.BTN70010;
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 500,
                    height: 500,
                    CODE_CLASS: data.rowItem.CODE_CLASS,
                    SORT: 'CODE_NO',
                    PAGESIZE: 10,
                    CURR_PAGE: 1,
                    SORT_AD: "",
                    PARAM: "",
                    TITLE: data.rowItem.CODE_CLASS + ecount.resource.LBL02874 + ecount.resource.LBL01070 //" 코드 리스트"
                };
                // Open popup                
                this.openWindow({
                    url: '/ECERP/ESA/ESA010P_08',
                    name: data.rowItem.CODE_CLASS + ecount.resource.LBL02874 + ecount.resource.LBL01070, //" 코드 리스트"
                    param: param,
                    popupType: false,
                    additional: false

                });
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
    },
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        if (!$.isEmpty(this.searchFormParameter.PARAM)) {
            this.header.getQuickSearchControl().setValue(this.searchFormParameter.PARAM);
        }

        var value = this.keyword;

        if (!$.isEmpty(value))
            this.isOnePopupClose = true;
    
        if (data.dataCount === 1 && this.isOnePopupClose === true && this.isEditMode == false) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "CLASS_DES",
                code: "CODE_CLASS",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        } else {
            ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        }
    },
    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.ecount.alert(String.format(this.resource.MSG02158, count));
    },
    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {

        if (page.pageID == 'ESA010P_07') {
            this.fnReload(1);
        }
        message.callback && message.callback();  // The popup page is closed   
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    //onBeforeEventHandler: function (e) {
    //    this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
    //    return true;
    //},    

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //신규
    onFooterNew: function () {
        this.openWindow({
            url: "/ECERP/ESA/ESA010P_07",
            name: String.format(ecount.resource.LBL15848 + ecount.resource.LBL11726),//"규격그룹등록"
            additional: false,
            param: {
                width: 600,
                height: 180,
            },
        });
    },
    //리스트 버튼 (검색 페이지로 이동)
    onFooterPre: function () {
        var listFlag = "Search";
        this.onComeAndGoListToSearch(listFlag);
    },
    //엑셀버튼
    onFooterExcel: function () {

        if (this.isUseExcelConvert) {
            var excelSearch = this.searchFormParameter
            ecount.document.exportExcel("/Inventory/Basic/ExcelCodeGroupForSpec", excelSearch);     // Please excelTitle check!
        } else {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return;
        }
    },
    //선택삭제
    onFooterDeleteMulti: function (cid) {

        var btnDeleteMulti = this.footer.get(0).getControl("DeleteMulti");
        delItem = this.contents.getGrid().grid.getChecked();
        uniqueItems = new Array();

        $.each($.makeArray(delItem), function (i, el) {
            uniqueItems.push(el.CODE_CLASS);
        });

        if (!uniqueItems.length) {
            ecount.alert(ecount.resource.MSG00303);
            return false;
        }

        var formData = {
            Request: {
                CODE_CLASS: uniqueItems.join(ecount.delimiter)
            }
        };

        var strUrl = "/SVC/Inventory/Basic/DeleteGroupListForSpec";
        if (confirm(ecount.resource.MSG00299)) {
            ecount.common.api({
                url: strUrl,
                async: false,
                data: Object.toJSON(formData),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.ecount.alert(result.fullErrorMsg);
                    } else {
                        this.contents.getGrid().draw(this.searchFormParameter);
                    }
                }.bind(this)
            });
            btnDeleteMulti.setAllowClick();
        }
    },

    // 적용
    onFooterApply: function () {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) { ecount.alert(ecount.resource.MSG00962); return false; }

        var message = {
            name: "CLASS_DES",
            code: "CODE_CLASS",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next", //current
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },


    onFooterModify: function () {
        var listFlag = "List";
        this.searchFormParameter.DEL_FLAG = "Y";
        this.onComeAndGoListToSearch(listFlag);

    },
    onComeAndGoListToSearch: function (listFlag) {

        var param = {
            ListFlag: listFlag,
            height: 600,
            isOpenPopup: true,
            callPageName: "ES019P",
            __ecPage__: "",
            _ecParam__: "",
            isPopFlag: "Y"
        };
        this.onAllSubmitSelf("/ECERP/Popup.Search/ES019P", param, "details");
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value = "";//this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();

            this.searchFormParameter.PARAM2 = value2;
            this.searchFormParameter.PARAM3 = value3;
        }

        this.searchFormParameter.PARAM = value;
        this.isOnePopupClose = true;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        //if (this.searchFormParameter.isIncludeInactive) {
        //    ;
        //    this.searchFormParameter.DEL_FLAG = event.status;
        //}

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
        this.setTimeout(function () {
            //this.contents.getControl('search').setFocus(0);
            this.header.getQuickSearchControl().setValue("");
            this.header.getQuickSearchControl().setFocus(0);
            if (this.isIncludeInactive) {
                this.header.toggle(true);
            }
        }.bind(this), 100);
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
            return;
        }
        else if (this.isApplyDisplayFlag != true)
            return;
        else if (!this.isIncludeInactive)
            return;
        //var selectedItem = this.contents.getGrid().grid.getChecked();
        //if (selectedItem.length == 0) {
        //    ecount.alert(ecount.resource.MSG00962);
        //    return false;
        //}
        //var message = {
        //    name: "WH_DES",
        //    code: "WH_CD",
        //    data: selectedItem,
        //    isAdded: this.isCheckBoxDisplayFlag,
        //    addPosition: "next",
        //    callback: this.close.bind(this)
        //};
        //this.sendMessage(this, message);
    },
    //엔터
    // ON_KEY_F2
    ON_KEY_F2: function () {
        this.onFooterNew();
    },
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(e);
    },
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
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
    gridFocus: function () {
    }
});
