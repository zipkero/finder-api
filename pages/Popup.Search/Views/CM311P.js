window.__define_resource && __define_resource("LBL10018","LBL10019","LBL10731","LBL10732","LBL00703","LBL06543","LBL03638","LBL10109","BTN00113","BTN00351","BTN00007","LBL03209","LBL00754","LBL03556","LBL05299","LBL00574","LBL00568","LBL01742","BTN00069","LBL13072","BTN00043","BTN00053","BTN00050","BTN00008","BTN00959","BTN00204","BTN00033","BTN00203","MSG02158","BTN00603","LBL06434","LBL02718","MSG00962","LBL00064","LBL09999","MSG00141","LBL09653","LBL00336","MSG00299","BTN00373","MSG00213");
/****************************************************************************************************
1. Create Date : 2015.05.12
2. Creator     : Nguyen Anh Tuong
3. Description : Groupcode popup page with edit,list,modify data / Search. 품목정보탭 > 그룹코드 팝업
4. Precaution  :
5. History     : 
                2015.11.18 (seongjun-Joe) 고정자산 개선 추가
                2016.03.28 (seongjun-Joe) 소스리팩토링.
                2016.04.15 최용환 - 엑셀변환 후 엑셀 플래그 수정
                2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                2020.11.03 (Ho Thanh Phu) A20_05742 - 근태집계표 > 근태그룹 검색창 잘못 뜹니다
****************************************************************************************************/

/*  (참고. 20151126)
/   코드번호, 코드명 을 보여주고 싶을 때는 codeClass1을 사용,
/   코드번호, 코드명, 순번까지 보여주고 싶을 때는 codeClass2를 사용

/   G10, G11 의 경우, 현재 로직을 탐. 기초등록 > 프로젝트등록 > 신규
/   A21, A22 의 경우, 현재 로직을 탐. 고정자산코드등록 > 신규
/   A11, A12도 다른 로직을 타는것으로 파악됨. 기초등록> 프로젝트등록> 신규

/  나머지 codeCalss 들은 구프레임으로 구현됨. or 현재 신규로 개발중.
/  L03은 현재 신규로 개발중 (작업중. 20151126)

/  해당 팝업을 보여주는 쿼리에서는 위의 codeClass들을 전부 if문으로 분기 하고 있음.
/  그러나, G10, G11의 등과 같이 해당 페이지로 구현하지 않고, 다른 페이지와 다른 쿼리를 만들어서 구현하는 것도 있음.
*/


ecount.page.factory("ecount.page.popup.type2", "CM311P", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    editFlag: false,
    HideOrder: true,
    userPermit: null,
    isUseExcelConvert: null,
    codeClass3: [],
    updateKeys: [],
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        // this.userPermit = this.viewBag.InitDatas.Permit.Value; // undefined
        this.userPermit = this.viewBag.InitDatas.Permit.USER_PERMIT;
        this.isUseExcelConvert = ecount.config.user.USE_EXCEL_CONVERT;    // 액셀변환권한유무

        this.searchFormParameter = {
            //이 부분때문에 팝업 호출시, custGroupCodeClass 값을 사용 안해도, custGroupCodeClass 값 그룹코드클래스 값을 넣어주어야 됨.
            CODE_CLASS: this.custGroupCodeClass != null ? this.custGroupCodeClass : "L08",
            PARAM: ''
            , PARAM2: (!$.isNull(this.keyword2)) ? this.keyword2 : ' '
            , PARAM3: (!$.isNull(this.keyword3)) ? this.keyword3 : ' '
            , SORT_COLUMN: this.SORT_COLUMN
            , SORT_TYPE: this.SORT_TYPE
        };


        //순번컬럼을 보여주고 싶은경우에는, codeClass2에 추가.
        //구프레임워크 로직을 신규로 그대로 옮긴 상황. codeClass2의 code_Class 값들을 안사용하는 것들도 있음.
        //Don't you use these code. because these code use much contains-context -> 팝업띄우는 화면에서 특정 파라미터를 보내는 것으로 개선 필요.
        //you can program that onPopuphandler-func in parent-page adds titlename.
        var codeClass1 = ['A11', 'A12', 'A21', 'A22', 'G01', 'G10', 'G11', 'G25', 'G26', 'G27', 'I09', 'G30', 'L07', 'L08', 'L09'];
        this.codeClass3 = ['L13', 'L14', 'L15'];
        var codeClass2 = ['L03', 'L13', 'L14', 'L15'];
        
        this.HideOrder = codeClass1.contains(this.searchFormParameter.CODE_CLASS) || this.codeClass3.contains(this.searchFormParameter.CODE_CLASS);
    },

    render: function () {
        this._super.render.apply(this);

    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        //Don't you use these code. because these code use much if-context -> 팝업띄우는 화면에서 특정 파라미터를 보내는 것으로 개선 필요.
        //you can program that onPopuphandler-func in parent-page adds titlename.
        if (this.custGroupCodeClass === "G10") {
            this.titlename = ecount.resource.LBL10018;
        } else if (this.custGroupCodeClass === "G11") {
            this.titlename = ecount.resource.LBL10019;
        } else if (this.custGroupCodeClass === "A11") {
            this.titlename = ecount.resource.LBL10731;
        } else if (this.custGroupCodeClass === "A12") {
            this.titlename = ecount.resource.LBL10732;
        } else if (this.custGroupCodeClass === "G01") {
            this.titlename = ecount.resource.LBL00703;
        }else if (this.custGroupCodeClass === "I09") {
            this.titlename = ecount.resource.LBL06543;
        }

        header.setTitle(this.codeClass3.contains(this.custGroupCodeClass) ? ecount.resource.LBL03638 : String.format(ecount.resource.LBL10109, this.titlename)).useQuickSearch();

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
        //
        //if (this.isIncludeInactive) {
        //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        //}
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        var codeNoResource = ecount.resource.LBL03209;
        var codeDesResource = ecount.resource.LBL00754;

        if (this.codeClass3.contains(this.searchFormParameter.CODE_CLASS)) {
            codeNoResource = ecount.resource.LBL03556;
            codeDesResource = ecount.resource.LBL05299;
        }

        if (this.ResourceType == "PROD") {
            codeNoResource = ecount.resource.LBL00574;
            codeDesResource = ecount.resource.LBL00568;
        }

        //아이디, 성명
        form1.add(ctrl.define("widget.input.search", "search1", "search1", codeNoResource).end())
            .add(ctrl.define("widget.input.search", "search2", "search2", codeDesResource).end());

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
        //}
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        // 품목일때는 생산공정으로 컬럼표시.
        var codeNoResource = ecount.resource.LBL03209;
        var codeDesResource = ecount.resource.LBL00754;

        if (this.codeClass3.contains(this.searchFormParameter.CODE_CLASS)) {
            codeNoResource = ecount.resource.LBL03556;
            codeDesResource = ecount.resource.LBL05299;
        }

        if (this.ResourceType == "PROD" || this.IsCostingOpen) {
            codeNoResource = ecount.resource.LBL00574;
            codeDesResource = ecount.resource.LBL00568;
        }

        // Initialize Grid

        this.searchFormParameter.Columns = [
                { index: 0, propertyName: 'CODE_NO', id: 'CODE_NO', title: codeNoResource, width: '' },
                { index: 1, propertyName: 'CODE_DES', id: 'CODE_DES', title: codeDesResource, width: '' },
                { index: 2, propertyName: 'PLANT_SER', id: 'PLANT_SER', title: ecount.resource.LBL01742, width: '', isHideColumn: this.HideOrder }
        ];

        grid
            .setRowData(this.viewBag.InitDatas.GroupCodes)
            .setRowDataUrl("/Account/Basic/GetListGroupCodeForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['CODE_NO', 'CODE_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns(this.searchFormParameter.Columns)

            // Sorting
            .setColumnSortable(this.IsCostingOpen ? false : true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isApplyDisplayFlag)
            .setCheckBoxMaxCount(100)


            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setCustomRowCell('CODE_NO', this.setGridDateLinkCode.bind(this))
            .setCustomRowCell('CODE_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('PLANT_SER', this.setGridDateLinkSer.bind(this))
            .setEventFocusOnInit(true)

            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else {
            if (this.DoNotUseModify != true) {
                toolbar.addLeft(ctrl.define("widget.button", "change").label(ecount.resource.LBL13072));
            }
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-primary").label(ecount.resource.BTN00043));
            toolbar.addLeft(ctrl.define("widget.button", "list").label(ecount.resource.BTN00053));
            toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050));
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        if (!this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                        .addGroup([
                            { id: "Deactivate", label: ecount.resource.BTN00204 },
                            { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                            { id: "Activate", label: ecount.resource.BTN00203 }
                        ]).css("btn btn-default")
                .noActionBtn().setButtonArrowDirection("up")); 
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

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        this.searchFormParameter.CODE_CLASS = this.custGroupCodeClass == null ? "L08" : this.custGroupCodeClass;
        this.searchFormParameter.IS_COSTING = this.IsCostingOpen;
        //this.contents.getControl("search").setValue(this.keyword || '');
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        //this.searchFormParameter.PARAM = this.keyword || '';

        if (!this.isApplyDisplayFlag) {
            this.footer.getControl("new").hide();
            this.footer.getControl("list").hide();
            this.footer.getControl("excel").hide();
            this.footer.getControl("deleteRestore").hide();
        }

        if (!e.unfocus) {
            //this.contents.getControl("search").onFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }

    },
    onMessageHandler: function (page, message) {

        this.setReload(this);

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

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },

    // Search button click event
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        
        value2 = this.header.getControl("search1").getValue();
        value3 = this.header.getControl("search2").getValue();

        this.searchFormParameter.gridRenderFlag = "Y";

        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
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
        this.header.getQuickSearchControl().setFocus(0);
        //this.contents.getControl("search").onFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    //정렬
    setColumnSortClick: function (e, data) {



        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        if (!this.searchFormParameter.DEL_FLAG) {
            this.searchFormParameter.DEL_FLAG = this.DEL_FLAG;
        }
        
        this.contents.getGrid().draw(this.searchFormParameter);



    },
    setGridDateLinkCode: function (value, rowItem) {
        var option = this.setGridDateLink(value, rowItem);
        if (this.IsCostingOpen && ["1", "3"].contains(rowItem.ADD_TYPE)) {
            option.data = "";
        }

        return option
    },
    setGridDateLinkSer: function (value, rowItem) {
        var option = this.setGridDateLink(value, rowItem);
        if (this.IsCostingOpen && ["1", "3"].contains(rowItem.ADD_TYPE)) {
            option.data = "";
        }   

        return option
    },
    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        //if (!this.editFlag && (this.isShowLinkDeactive || rowItem['USE_GUBUN'] == 'Y')) {
        if (!this.editFlag) {
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    if (this.isOldFramework) {
                        opener.fnSetGropuNo(data.rowItem["CODE_NO"], data.rowItem["CODE_DES"], this.CODE_CLASS);
                        this.close();
                    } else {
                        var message = {
                            name: "CODE_DES",
                            code: "CODE_NO",
                            data: data.rowItem,
                            isAdded: this.IsCostingOpen ? true : false,
                            addPosition: "current",
                            callback: this.close.bind(this)
                        };
                        this.sendMessage(this, message);
                    }
                }.bind(this)
            };
        }
        else if (this.editFlag) {
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: this.HideOrder ? 183 : 210,
                        editFlag: "M",
                        groupName: data.rowItem['CODE_DES'],
                        groupCode: data.rowItem['CODE_NO'],
                        useGubun: data.rowItem['USE_GUBUN'],
                        plantSer: data.rowItem['PLANT_SER'],
                        wDate: data.rowItem['EDIT_DT'],
                        hideOrderField: this.HideOrder,
                        titleName: this.titlename,
                        wID: data.rowItem['EDITOR_ID'],
                        custGroupCodeClass: this.searchFormParameter.CODE_CLASS,
                        FromProgramId: this.FromProgramId
                    };
                    // Open popup
                    //this.openWindow({ url: '/ECERP/ESA/ESA006M', name: String.format(ecount.resource.LBL06434, ecount.resource.LBL02718), param: param, popupType: false, additional: true });
                    this.openWindow({ url: '/ECERP/Popup.Search/CM311P_01', name: String.format(ecount.resource.LBL06434, this.titlename), param: param, additional: false });
                    e.preventDefault();
                }.bind(this)

            };
        }
        return option;
    },



    onGridRenderComplete: function (e, data, gridObj) {
        debugger
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        var value = this.keyword;
        if (!$.isEmpty(value))
            this.searchFormParameter.gridRenderFlag = "Y";

        if (data.dataCount === 1 && this.searchFormParameter.gridRenderFlag === "Y" && data.dataRows[0].USE_GUBUN === 'Y') {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "CODE_DES",
                code: "CODE_NO",
                data: rowItem,
                isAdded: this.isApplyDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } else {
            // Open popup

            if (!e.unfocus) {
                if (this.searchFormParameter.PARAM != undefined)
                    this.header.getQuickSearchControl().setValue(this.searchFormParameter.PARAM);
                //this.contents.getControl("search").setValue(this.searchFormParameter.PARAM);
            }

        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Apply button click event
    onFooterApply: function (e) {

        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        if (this.isOldFramework) {
            var arrCodeNo = [], arrCodeDes = [];
            for (i = 0; i < selectedItem.length; i++) {
                arrCodeNo.push(selectedItem[i]["CODE_NO"]);
                arrCodeDes.push(selectedItem[i]["CODE_DES"]);
            }
            opener.fnSetGropuNo(arrCodeNo.join("ㆍ"), arrCodeDes.join("ㆍ"), this.CODE_CLASS);
            this.close();
        } else {
            var message = {
                name: "CODE_DES",
                code: "CODE_NO",
                data: selectedItem,
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
    },


    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // Change button click event
    onFooterChange: function () {
        var title = String.format(ecount.resource.LBL00064, this.titlename);
        if (this.viewBag.InitDatas.Permit.USER_PERMIT != "W") { //permit check
            //Value.equals("X")
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
        this.editFlag = true;
        this.footer.getControl("change").hide();
        this.ispopupCloseUse = false;
        this.footer.getControl("new").show();
        this.footer.getControl("list").show();
        this.footer.getControl("excel").show();
        this.footer.getControl("deleteRestore").show();

        //this.changeTitle(title);
        this.changePopupTile(title, true);

        var grid = this.contents.getGrid();
        var search = this.header.getQuickSearchControl().getValue();//this.contents.getControl('search').getValue();
        //this.searchFormParameter.PARAM = search.keyword;
        this.searchFormParameter.DEL_FLAG = "Y";
        grid.getSettings().setCheckBoxUse(true);
        grid.getSettings().setCheckBoxRememberChecked(false); //이거 사용하면 삭제가 안된답.
        grid.draw(this.searchFormParameter);
        //this.contents.getControl("search").onFocus(0);
        this.header.getQuickSearchControl().setFocus(0);
    },

    // New button click event
    onFooterNew: function (e) {
        // Define data transfer object
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: this.HideOrder ? 183 : 210,
            editFlag: "I",
            custGroupCodeClass: this.searchFormParameter.CODE_CLASS,
            hideOrderField: this.HideOrder,
            titleName: this.titlename,
            FromProgramId: this.FromProgramId
        };
        // Open popup
        //ecount.popup.openWindow('/ECERP/Popup.Search/CM311P_01', String.format(ecount.resource.LBL09999, this.titlename), param, false);
        this.openWindow({ url: '/ECERP/Popup.Search/CM311P_01', name: String.format(ecount.resource.LBL09999, this.titlename), param: param, additional: false });
    },

    // Excel clicked event
    onFooterExcel: function (e) {
        //구프레임 호출
        //var key = new Date()._tick();
        //var param = {
        //    hidParam: this.searchFormParameter.PARAM,
        //    hidSort: this.searchFormParameter.SORT_COLUMN,
        //    hidSortAd: this.searchFormParameter.SORT_TYPE,
        //    hidCodeCd: this.searchFormParameter.CODE_CLASS
        //};
        //var options = {
        //    type: "ExcelDic",
        //    keyword: this.key,
        //    iMaxCnt: this.contents.getGrid().getSettings().getPagingTotalRowCount(),
        //    verisionCheck: true
        //};
        //ecount.infra.convertExcel("/ECMain/CM3/CM311E.aspx", param, options);




        //권한 추가
        if ((this.viewBag.Permission.Self && this.viewBag.Permission.Self.UPD == true) || (this.viewBag.InitDatas.Permit.USER_PERMIT === "W" && this.isUseExcelConvert == true)) {

            if (this.viewBag.Permission.Self && this.viewBag.Permission.Self.UPD == true && this.viewBag.Permission.Self.CEE != true) {
                var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
                ecount.alert(message);
                return false;
            }

            var excelSearch = this.searchFormParameter;
            excelSearch.excelTitle = this.titlename
            excelSearch.EXCEL_FLAG = "Y";  //flag에 따라 select 미사용.

            ecount.document.exportExcel("/Account/Basic/ExcelCommonGroupCode", excelSearch);
            excelSearch.EXCEL_FLAG = "N";
        }
        else {
            if (this.isUseExcelConvert != true) {
                ecount.alert(ecount.resource.MSG00141);
            } else {
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: "", PermissionMode: "X" }]);   //공통이므로 MenuResource에 "" 처리. 기존은 -> ecount.resource.LBL00336
                ecount.alert(msgdto.fullErrorMsg);
            }
            return;
        }

    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var objthis = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var selectedItem = (e && e.gridCheckedItem) || this.contents.getGrid().getCheckedItem() || [];
        // Message processing when the choice is not
        if (selectedItem.length == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        // Logic into the DeleteLists the selected sub-array
        var DeleteLists = [];
        var codeClass = this.searchFormParameter.CODE_CLASS;
        var Key = [], _self=this;
        selectedItem.forEach(function (val) {
            Key.push(val.CODE_NO);
            var param = {
                Code_Class: codeClass,
                Code_No: val.CODE_NO,
                CheckPermissionRequest: {
                    EditMode: ecenum.editMode.delete,
                    ProgramId: _self.FromProgramId
                },
            }
            DeleteLists.push(param);
        });
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/SVC/Account/Basic/DeleteGroupCodeList",
                    data: Object.toJSON({
                        Key: Key,
                        Request: {
                            Data: DeleteLists
                        }
                    }),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            //When successful reload
                            //지워졌던거는 체크박스 정보 지워
                            //차후확인
                            //for (var idx = 0, limit = selectedItem.length; idx < limit; idx++) {
                            //    objthis.contents.getGrid().grid.removeChecked(selectedItem[idx][ecount.grid.constValue.keyColumnPropertyName]);
                            //}


                            objthis.setReload(objthis);
                        }
                    },
                    complete: function () {
                        btnDelete.setAllowClick();
                    }
                });
            } else {
                btnDelete.setAllowClick();
            }
        });
    },

    // List button click event
    onFooterList: function () {
        this.editFlag = false;
        this.footer.getControl("change").show();
        this.footer.getControl("excel").hide();
        this.footer.getControl("new").hide();
        this.footer.getControl("list").hide();
        this.footer.getControl("deleteRestore").hide();
        var grid = this.contents.getGrid();
        var search = this.header.getQuickSearchControl().getValue();//this.contents.getControl('search').getValue();
        var title = String.format(ecount.resource.LBL10109, this.titlename);
        //this.changeTitle(title);
        this.changePopupTile(title, true);
        this.ispopupCloseUse = true;
        //this.searchFormParameter.PARAM = search.keyword;
        this.searchFormParameter.DEL_FLAG = "N";
        grid.getSettings().setCheckBoxUse(false);
        grid.draw(this.searchFormParameter);
        //this.contents.getControl("search").onFocus(0);
        this.header.getQuickSearchControl().setFocus(0);
    },

    //// History button click event
    //onFooterHistory: function (e) {
    //    var param = {
    //        width: 400,
    //        height: 250,
    //        lastEditTime: WDATE,
    //        lastEditId: WID
    //    };
    //    // Open popup
    //    ecount.popup.openWindow('/ECERP/Popup.Search/CM100P_31', ecount.resource.BTN00373, param, false);
    //},


    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    // F2
    ON_KEY_F2: function () {
        if (this.editFlag)
            this.onFooterNew();
    },

    // F8
    ON_KEY_F8: function () {
        if (this.header.isVisible())
            this.onContentsSearch('button');
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // Enter
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },
    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
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

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        if (this.header.getControl("search1").getValue() == "")
            this.searchFormParameter.PARAM2 = "";

        if (this.header.getControl("search2").getValue() == "")
            this.searchFormParameter.PARAM3 = "";

        this.searchFormParameter.gridRenderFlag = "Y";

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data['USE_GUBUN'] == "N")
            return true;
        return false;
    },

    // Reload grid
    setReload: function (e) {

        this.contents.getGrid().draw(this.searchFormParameter);
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnProjectGroup(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnProjectGroup(this.getSelectedListforActivate("N"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        var codeClass = this.searchFormParameter.CODE_CLASS;
        var _self = this;
        
        $.each(selectItem, function (i, data) {
            _self.updateKeys.push(data.CODE_NO);
            updatedList.Data.push({
                USE_GUBUN: cancelYN,
                CODE_CLASS: codeClass,
                CODE_NO: data.CODE_NO,
                CheckPermissionRequest: {
                    EditMode: ecenum.editMode.modify,
                    ProgramId: _self.FromProgramId
                },
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnProjectGroup: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");       
        var _self = this;
        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/SVC/Account/Basic/UpdateListStateGroupCode",
            data: Object.toJSON({
                Key:_self.updateKeys,
                Request: updatedList
                
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.setReload();
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },
});
