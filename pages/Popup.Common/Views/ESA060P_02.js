window.__define_resource && __define_resource("LBL10784","LBL10949","LBL10909","BTN00113","BTN00351","BTN00007","LBL10902","LBL10789","LBL10921","LBL10920","BTN00004","LBL10911","LBL08877","LBL10910","BTN00069","BTN00043","BTN00008","BTN00603","MSG00962","LBL10922");
/****************************************************************************************************
1. Create Date : 2015.10.15
2. Creator     : 전영준
3. Description : 품목등록 - 검사항목코드 팝업
4. Precaution  : 
5. History     : 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
                 2016.06.01 (Pham Van Phu) add Type for Item
                 2016.07.01 (Cong Thanh) add logic for sub item (TYPE_QC) and type (SUB_ITEM)
                 2016.07.08 (Truong Quang Duyet) modify get columns when Type = SUB_ITEM
                 2016.07.12 (Jusik Min) to add the button new (신규버튼 추가)
                 2018.01.31(Hao) Fix dev 6411 품목등록에서 품질검사유형명으로 검색 시 조회 안되는 문제
                 2018.02.08(Hao) - Fix dev 6717 품목등록 - 품질검사유형등록 입력 후 저장해도 적용이 되지 않는 문제
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 [2021.01.12] taind: A20_06944 - QueryGenerator구조 적용_품질검사조회
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA060P_02", { 
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    apiUrl: '/Inventory/Basic/GetListForInspectType',
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
        this.searchFormParameter = {
            KEYWORD: this.KeyWord,
            USE_YN: 'Y'
        };
        if (this.TYPE !== "TYPE") {
            this.searchFormParameter.DATA_TYPE = this.DATA_TYPE
            this.apiUrl = '/Inventory/Basic/GetListForInspectItem';
        }
        if (this.TYPE === "SUB_ITEM") {
            this.apiUrl = '/Inventory/QcInspection/GetListSearchStqcSubItemDetail';
        }

    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {

        header.notUsedBookmark();
        if (this.TYPE === "SUB_ITEM")
            header.setTitle(ecount.resource.LBL10784).useQuickSearch();
        else
            header.setTitle(this.TYPE == 'TYPE' ? ecount.resource.LBL10949 : ecount.resource.LBL10909).useQuickSearch(); // 검사 항목코드 검색
        // Add function search F3 with isIncludeInactive = true
        if (this.isIncludeInactive) {
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

            var resource1 = "";
            var resource2 = "";
            if (this.TYPE == "TYPE") {
                resource1 = ecount.resource.LBL10902;
                resource2 = ecount.resource.LBL10789;
            } else {
                resource1 = ecount.resource.LBL10921;
                resource2 = ecount.resource.LBL10920;
            }

            //창고코드, 창고명 검색어
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", resource1).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", resource2).end())
            contents.add(form1);    //검색어
            contents.add(toolbar);  //버튼

            header.add("search").addContents(contents);
        }
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            data = this.viewBag.InitDatas.ListLoad;

        //툴바
        //toolbar.setId("search")
        //    .attach(ctrl.define("widget.searchGroup", "search").setOptions({
        //        label: ecount.resource.BTN00004,  //검색
        //    }));
        if (this.TYPE === "SUB_ITEM") {
            this.columns = [
                 { propertyName: 'ITEMDETAIL_CD2', id: 'ITEMDETAIL_CD2', title: ecount.resource.LBL10921, width: '', controlType: 'widget.input', editableState: 1 },
                 { propertyName: 'ITEMDETAIL_NM', id: 'ITEMDETAIL_NM', title: ecount.resource.LBL10920, width: '', align: 'center', controlType: 'widget.input', editableState: 1 },
            ];
        }
        else if (this.TYPE === "TYPE")
            this.columns = [
                    { propertyName: 'CODE2', id: 'CODE2', title: this.TYPE == 'TYPE' ? ecount.resource.LBL10902 : ecount.resource.LBL10911, width: '', controlType: 'widget.input', editableState: 1 },
                    { propertyName: 'NAME', id: 'NAME', title: this.TYPE == 'TYPE' ? ecount.resource.LBL08877 : ecount.resource.LBL10910, width: '', align: 'center', controlType: 'widget.input', editableState: 1 },
            ];
        else {
            this.columns = [
                    { propertyName: 'CODE', id: 'CODE', title: this.TYPE == 'TYPE' ? ecount.resource.LBL10902 : ecount.resource.LBL10911, width: '', controlType: 'widget.input', editableState: 1 },
                    { propertyName: 'NAME', id: 'NAME', title: this.TYPE == 'TYPE' ? ecount.resource.LBL08877 : ecount.resource.LBL10910, width: '', align: 'center', controlType: 'widget.input', editableState: 1 },
            ];
        }
        //  data
        settings
            .setRowDataUrl(this.apiUrl)
            .setRowData(this.viewBag.InitDatas.ListLoad)
            .setColumnPropertyColumnName('id')
            .setColumns(this.columns)
            .setCustomRowCell('CODE', this.setGridDateLink.bind(this))
            .setCustomRowCell('CODE2', this.setGridDateLink.bind(this))
            .setCustomRowCell('NAME', this.setGridDateLink.bind(this))
            .setCustomRowCell('ITEMDETAIL_CD2', this.setGridDateLink.bind(this))
            .setCustomRowCell('ITEMDETAIL_NM', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)
            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setStyleRowBackgroundColor(function (rowItem) {
                if (rowItem.USE_YN == "N")
                    return true;
                else
                    return false;
            }, 'danger')
            .setCheckBoxActiveRowStyle(true);

        if (this.isCheckBoxDisplayFlag) {
            settings.setCheckBoxUse(true);
        }

        contents
            .add(toolbar)
            .addGrid("dataGrid", settings);
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();

        ctrl = widget.generator.control();
        if (this.isCheckBoxDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069));
        }
        if (this.isNewDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(this.resource.BTN00043));
        }
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper"));
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
    //페이지 완료 이벤트
    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this, arguments);
        if (!$.isNull(this.keyword)) {
            //this.contents.getControl('search').setValue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        var value = this.keyword;
        if (!$.isEmpty(value))
            this.searchFormParameter.gridRenderFlag = "Y";

        if (data.dataCount === 1 && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.searchFormParameter.gridRenderFlag === "Y") {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = null;

            if (this.TYPE === "SUB_ITEM") {
                if (this.SUB_TYPE === "TYPE_QC") {
                    message = {
                        //type: 'infomation',
                        name: "ITEMDETAIL_NM",
                        code: "ITEMDETAIL_CD2",
                        data: rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                } else {
                    message = {
                        //type: 'infomation',
                        name: "ITEMDETAIL_NM",
                        code: "ITEMDETAIL_CD",
                        data: rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                }
            }
            else {
                if (this.SUB_TYPE === "TYPE_QC_MASTER") {
                    message = {
                        name: "NAME",
                        code: "CODE2",
                        data: rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "next", //current
                        callback: this.close.bind(this)
                    }
                } else {                    
                    message = {
                        name: "NAME",
                        code: this.callPageName == "ESA009M" || this.TYPE === "ITEM" ? "CODE2" : "CODE",
                        data: rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "next",
                        callback: this.close.bind(this)
                    };
                }

            }

            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
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
                
                var message = null;

                if (this.SUB_TYPE === "TYPE_QC_MASTER") {
                    message = {
                        name: "NAME",
                        code: "CODE2",
                        data: data.rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "next", //current
                        callback: this.close.bind(this)
                    };
                } else {
                    if (this.TYPE !== "SUB_ITEM") {
                        message = {
                            name: "NAME",
                            code: this.callPageName == "ESA009M" || this.TYPE === "ITEM" ? "CODE2" : "CODE",
                            data: data.rowItem,
                            isAdded: this.isCheckBoxDisplayFlag,
                            addPosition: "current",
                            callback: this.close.bind(this)
                        };
                    } else {
                        if (this.SUB_TYPE === "TYPE_QC") {
                            message = {
                                name: "ITEMDETAIL_NM",
                                code: "ITEMDETAIL_CD2",
                                data: data.rowItem,
                                isAdded: this.isCheckBoxDisplayFlag,
                                addPosition: "current",
                                callback: this.close.bind(this)
                            };
                        } else {
                            message = {
                                name: "ITEMDETAIL_NM",
                                code: "ITEMDETAIL_CD",
                                data: data.rowItem,
                                isAdded: this.isCheckBoxDisplayFlag,
                                addPosition: "current",
                                callback: this.close.bind(this)
                            };
                        }
                    }

                }

                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA062P_01')
            this.onContentsSearch('button');
        message.callback && message.callback();  // The popup page is closed   
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.USE_YN == "Y")
            this.searchFormParameter.USE_YN = "";
        else
            this.searchFormParameter.USE_YN = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },

    //버튼 이벤트 클릭전 호출
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    //검색, 전체보기 
    onContentsSearch: function (event) {

        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue(); // Code
            value3 = this.header.getControl("search2").getValue(); // Name
        }

        if (this.TYPE === "SUB_ITEM") {
            this.searchFormParameter.ITEMDETAIL_CD = this.ITEMDETAIL_CD;
            this.searchFormParameter.PAGE_SIZE = 100;
            this.searchFormParameter.PAGE_CURRENT = 1;
            this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue() || '';
        } else
            this.searchFormParameter.KEYWORD = this.header.getQuickSearchControl().getValue() || '';

        this.searchFormParameter.KEYWORD2 = value2;
        this.searchFormParameter.KEYWORD3 = value3;

        this.searchFormParameter.gridRenderFlag = "Y";

        this.contents.getGrid().draw(this.searchFormParameter);
        //if (this.isIncludeInactive) {
        //    if (this.searchFormParameter.USE_YN == "") {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        //    }
        //    else {
        //        this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        //    }
        //}
        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.USE_YN == "") {
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

        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },
    // 적용
    onFooterApply: function () {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        
        var message = this.SUB_TYPE == "TYPE_QC" ? {
            name: "ITEMDETAIL_NM",
            code: "ITEMDETAIL_CD2",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next", //current
            callback: this.close.bind(this)
        } : {
            name: "NAME",
            code: "CODE2",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next", //current
            callback: this.close.bind(this)
        };

        this.sendMessage(this, message);
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    // New button clicked event (Đăng ký mục giám sát)
    onFooterNew: function (cid) {
        var res = this.resource;
        var btn = this.footer.get(0).getControl("New");
        
        // Define data transfer object
        var param = {};
        param.width = ecount.infra.getPageWidthFromConfig();
        param.height = 165;
        param.editFlag = 'I';
        param.ITEM_CD = this.ITEM_CD;

        this.openWindow({
            url: '/ECERP/ESA/ESA062P_01',
            name: ecount.resource.LBL10922,
            param: param,
            popupType: false
        });

        btn.setAllowClick();
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
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
        this.gridFocus && this.gridFocus();
    },
    // Tab 
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    },

    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderQuickSearch: function (event) {

        if (this.TYPE === "SUB_ITEM") {
            this.searchFormParameter.ITEMDETAIL_CD = this.ITEMDETAIL_CD;
            this.searchFormParameter.PAGE_SIZE = 100;
            this.searchFormParameter.PAGE_CURRENT = 1;
            this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        } else
            this.searchFormParameter.KEYWORD = this.header.getQuickSearchControl().getValue();

        if (this.isIncludeInactive) {
            if (this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.KEYWORD2 = "";

            if (this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.KEYWORD3 = "";
        }

        this.searchFormParameter.gridRenderFlag = "Y";

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.USE_YN == "Y")
            this.searchFormParameter.USE_YN = "";
        else
            this.searchFormParameter.USE_YN = "Y";

        this.onContentsSearch('button');
    },

    ON_KEY_F8: function () {
        if (this.isApplyDisplayFlag) {
            this.onFooterApply();
        }
        if (this.isIncludeInactive) {
            this.onContentsSearch('button', '');
            return;
        }
    },


});





