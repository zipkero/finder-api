window.__define_resource && __define_resource("LBL12745","BTN00113","BTN00351","BTN00007","LBL12746","LBL10109","MSG06001","BTN00069","LBL13072","BTN00043","BTN00053","BTN00959","BTN00204","BTN00033","BTN00203","BTN00008","BTN00603","MSG02158","LBL06434","MSG00962","LBL00064","LBL09999","MSG00299","LBL02490","MSG05280","LBL11858","MSG00213");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : self-customizing > form setting > Frequently Used Phrases
 4. Precaution  :
 5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                  2019.05.21 [TanThanh] Fix TP 86101
                  2021.01.14 [Ho Thanh Phu] A20_06859_2 - 규격그룹 선택화면 > 신규 및 수정 >그룹 검색 시 검색된 그룹이 1개면 바로 그룹이 입력되어버리는 건-2차
 6. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGK002P_03", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    editFlag: false,
    userPermit: null,
    titlename: "",
    isEditMode: false,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.searchFormParameter = {
            PARAM: '',
            DEL_FLAG: 'N'
        };
    },

    initProperties: function () {
        //this.userPermit = this.viewBag.Permission.inventoryPermit;
        this.titlename = ecount.resource.LBL12745;
    },

    render: function () {
        this._super.render.apply(this);

    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var contents = widget.generator.contents(),
                     toolbar = widget.generator.toolbar(),
                        form1 = widget.generator.form(),
                     ctrl = widget.generator.control();
        if (this.isIncludeInactive) {
            //toolbar
            //       .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))
            //    .addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함 .
            toolbar.addLeft(ctrl.define("widget.button.group", "search")
                .label(ecount.resource.BTN00113)
            );

            //검색하단 버튼
            toolbar
                .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL12745).end())
               .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL12746).end())
            contents.add(form1);
            contents.add(toolbar);
            header.add("search")
                .addContents(contents);
        }
        var title = String.format(ecount.resource.LBL10109, this.titlename);
        header.notUsedBookmark()
            .useQuickSearch() //로딩시 화면에 표시됨
            .setTitle(title);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            ctrl = generator.control(),
            grid = generator.grid();

        grid
            .setRowData(this.viewBag.InitDatas.CarPurPosLoad)
            .setRowDataUrl("/Groupware/Equipment/GetListCarPurPoseForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['PURPOSE_CD', 'PURPOSE_DES'])
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'PURPOSE_CD', id: 'PURPOSE_CD', title: ecount.resource.LBL12745, width: '' },
                { propertyName: 'PURPOSE_DES', id: 'PURPOSE_DES', title: ecount.resource.LBL12746, width: '', },
            ])
             .setColumnSortable(true)
              .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setEmptyGridMessage(ecount.resource.MSG06001)
            .setCheckBoxMaxCount(100)
             .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setCustomRowCell('PURPOSE_CD', this.setGridDateLink.bind(this))
            .setCustomRowCell('PURPOSE_DES', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))
            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        contents
            .addGrid("dataGrid" + this.pageID, grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();
        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));

        toolbar.addLeft(ctrl.define("widget.button", "change").label(ecount.resource.LBL13072));
        toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-primary").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "list").label(ecount.resource.BTN00053));        
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                        .addGroup([
                            { id: "Deactivate", label: ecount.resource.BTN00204 },
                            { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                            { id: "Activate", label: ecount.resource.BTN00203 }
                        ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up")); 
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        var keyHelper = new Array();
        keyHelper.push(10);
        keyHelper.push(11);
        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        switch (cid) {
            case "search":
                if (this.isIncludeInactive) 
                    option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
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
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        this.footer.getControl("new").hide();
        this.footer.getControl("list").hide();
        this.footer.getControl("deleteRestore").hide();

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    onMessageHandler: function (page, message) {
        var thisObj = this;
        if (page.pageID == 'EGK002P_04') {
            thisObj.searchFormParameter.DEL_FLAG = 'Y';
            message.callback && message.callback();
        }
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y" && this.header.getControl("usegubun")) {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
        }
        this.setReload(this);

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

    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (!this.editFlag) {
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    var message = {
                        name: "PURPOSE_DES",
                        code: "PURPOSE_CD",
                        data: data.rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                }.bind(this)
            };
        }
        else if (this.editFlag) {
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 190,
                        editFlag: "M",
                        wDate: data.rowItem['EDIT_DT'],
                        titleName: this.titlename,
                        wID: data.rowItem['EDITOR_ID'],
                        PURPOSE_CD: data.rowItem['PURPOSE_CD'],
                    };
                    // Open popup
                    this.openWindow({ url: '/ECERP/Popup.Search/EGK002P_04', name: String.format(ecount.resource.LBL06434, this.titlename), param: param, popupType: false, additional: false });
                    e.preventDefault();
                }.bind(this)
            }
        }

        return option;
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        var value = this.keyword;
        if (!$.isEmpty(value))
            this.searchFormParameter.gridRenderFlag = "Y";
       
        if (data.dataCount === 1 && this.searchFormParameter.gridRenderFlag === "Y" && this.isEditMode == false) {
            this.fnSetSendMessage(data.dataRows[0]); // Call function set data for send message
        }
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/

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

    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "PURPOSE_DES",
            code: "PURPOSE_CD",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            callback: this.close.bind(this)
        };

        this.sendMessage(this, message);
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // Change button click event
    onFooterChange: function () {
        var title = String.format(ecount.resource.LBL00064, this.titlename);
        //if (this.userPermit.Value != "W") { //permit check
        //    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: "W" }]);
        //    ecount.alert(msgdto.fullErrorMsg);
        //    return;
        //}
        this.editFlag = true;
        this.footer.getControl("change").hide();
        if (this.footer.getControl("apply")) {
            this.footer.getControl("apply").hide();
        }

        this.footer.getControl("new").show();
        this.isEditMode = true;
        this.footer.getControl("list").show();
        this.footer.getControl("deleteRestore").show();
        this.searchFormParameter.DEL_FLAG = 'Y';
        this.changePopupTile(title, true);
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y" && this.header.getControl("usegubun")) {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setCheckBoxUse(true);
        grid.getSettings().setCheckBoxRememberChecked(false);
        grid.draw(this.searchFormParameter);

        this.header.getQuickSearchControl().setFocus(0);
    },

    // New button click event
    onFooterNew: function (e) {
        // Define data transfer object
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 190,
            editFlag: "I",
            titleName: this.titlename
        };
        // Open popup
        this.openWindow({ url: '/ECERP/Popup.Search/EGK002P_04', name: String.format(ecount.resource.LBL09999, this.titlename), param: param, popupType: false, additional: false });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var thisObj = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var selectedItem = (e && e.gridCheckedItem) || this.contents.getGrid().getCheckedItem() || new Array();
        // Message processing when the choice is not
        if (selectedItem.length == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        // Logic into the DeleteLists the selected sub-array
        var DeleteLists = new Array();
        selectedItem.forEach(function (val) {
            var param = {
                PURPOSE_CD: val.PURPOSE_CD
            }
            DeleteLists.push(param);
        });
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Groupware/Equipment/DeleteCarPurPose",
                    data: Object.toJSON(DeleteLists),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else if (result.Data && result.Data.length > 0) {
                            thisObj.fnErrMessage(result.Data, {
                                titleDate: ecount.resource.LBL02490,
                                msgWarning: String.format(ecount.resource.MSG05280, ecount.resource.LBL02490),
                                menuName: ecount.resource.LBL11858,
                                isHideColumnCust: true
                            });
                        }
                        else {
                            thisObj.setReload(thisObj);
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
        if (this.footer.getControl("apply")) {
            this.footer.getControl("apply").show();
        }
        this.isEditMode = false;
        this.footer.getControl("new").hide();
        this.footer.getControl("list").hide();
        this.footer.getControl("deleteRestore").hide();
        var grid = this.contents.getGrid();
        this.searchFormParameter.DEL_FLAG = "N";
        var title = String.format(ecount.resource.LBL10109, this.titlename);
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "N" && this.header.getControl("usegubun")) {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            }

        }
        this.changePopupTile(title, true);
        grid.getSettings().setCheckBoxUse(this.isCheckBoxDisplayFlag);
        grid.draw(this.searchFormParameter);
    },

    // quick Search button click event 퀴서치
    onHeaderQuickSearch: function (e, value) {
        var thisObj = this;
        var keyword = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.PARAM = keyword;
        this.searchFormParameter.gridRenderFlag = "Y";
        if (this.isIncludeInactive) {
            if (this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.PARAM2 = "";

            if (this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.PARAM3 = "";
        }
        this.setReload(this);
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    // F2
    ON_KEY_F2: function () {
        if (this.editFlag)
            this.onFooterNew();
    },

    // F8
    ON_KEY_F8: function (e) {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag) this.onFooterApply(e);
    },

    // Enter
    ON_KEY_ENTER: function (e, target) {
        if (target && target.control) {
            this.onContentsSearch(target.control.getValue());
        }
    },
    ON_KEY_DOWN: function () {
    },
    ON_KEY_UP: function () {
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

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    // Function set data for send message (Chức năng gán dữ liệu cho tin nhắn trả về)

    //show messasge error
    fnErrMessage: function (ErrMsg, extraParam) {

        var formErrMsg = Object.toJSON(ErrMsg);
        var param = extraParam;
        $.extend(param, {
            name: 'Delete',
            width: 600,
            height: 500,
            datas: formErrMsg,
            popupType: false,
            additional: false
        });

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeCommonDeletable",
            param: param
        });
    },

    fnSetSendMessage: function (data) {
        var message = {
            name: "PURPOSE_DES",
            code: "PURPOSE_CD",
            data: data,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['DEL_GUBUN'] == "Y")
            return true;
    },
    //검색 / 사용중단 버튼 클릭
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";
        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }
        this.searchFormParameter.PARAM = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.searchFormParameter.gridRenderFlag = "Y";
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
    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnCarPurpose(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnCarPurpose(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                PURPOSE_CD: data.PURPOSE_CD,
                DEL_GUBUN: cancelYN
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnCarPurpose: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (updatedList.Data.length == 0) {
            btn.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);            
            return;
        }
        updatedList.CheckPermissionRequest = {
            EditMode: ecenum.editMode.modify,
            ProgramId: this.PROGRAM_ID
        };
        ecount.common.api({
            url: "/Groupware/Equipment/UpdateListCarPurPose",
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
