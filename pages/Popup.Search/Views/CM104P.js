window.__define_resource && __define_resource("LBL10579","LBL10109","LBL01743","MSG06001","LBL13072","BTN00043","BTN00053","BTN00008","BTN00037","MSG02158","LBL06434","LBL00064","LBL09999","MSG00962","MSG00299");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : self-customizing > form setting > Frequently Used Phrases
 4. Precaution  :
 5. History     : 
 6. Old File    : 
 7. New File    : FM064P_01
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM104P", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    editFlag: false,
    userPermit: null,
    titlename: "",

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.searchFormParameter = {
            FORM_TYPE: this.FORM_TYPE,
            COL_CD: this.COL_CD,
            PARAM: ''
        };
    },

    initProperties: function () {
        this.userPermit = this.viewBag.Permission.userPermit;
        this.titlename = ecount.resource.LBL10579;
    },

    render: function () {
        this._super.render.apply(this);

    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark()
            .useQuickSearch() //로딩시 화면에 표시됨
            .setTitle(String.format(ecount.resource.LBL10109, ecount.resource.LBL10579));
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            ctrl = generator.control(),
            grid = generator.grid();

        grid
            .setRowData(this.viewBag.InitDatas.UserTxtLoad)
            .setRowDataUrl("/Inventory/Common/GetListCofmUserTxt")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['SEQ'])
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'TXT', id: 'TXT', title: ecount.resource.LBL10579, width: '' },
                { propertyName: 'SORT_ORDER', id: 'SORT_ORDER', title: ecount.resource.LBL01743, width: '100', align: 'center' },
            ])
            .setEmptyGridMessage(ecount.resource.MSG06001)
            .setCheckBoxMaxCount(100)
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setCustomRowCell('TXT', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)

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
        toolbar.addLeft(ctrl.define("widget.button", "change").label(ecount.resource.LBL13072));
        toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-primary").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "list").label(ecount.resource.BTN00053));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        toolbar.addLeft(ctrl.define("widget.button", "deleteSelected").label(ecount.resource.BTN00037));
        var keyHelper = new Array();
        keyHelper.push(10);
        keyHelper.push(11);
        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        this.footer.getControl("new").hide();
        this.footer.getControl("list").hide();
        this.footer.getControl("deleteSelected").hide();

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    onMessageHandler: function (page, message) {
        var thisObj = this;
        if (page.pageID == 'CM104P_01') {
            message.callback && message.callback();
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

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        if (!this.editFlag) {
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    var message = {
                        name: "TXT",
                        data: data.rowItem,
                        INDEX: this.INDEX,
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
                        FORM_TYPE: this.searchFormParameter.FORM_TYPE,
                        COL_CD: this.searchFormParameter.COL_CD,
                        INDEX: this.INDEX,
                        SEQ: data.rowItem['SEQ'],
                        TXT: data.rowItem['TXT'],
                        SORT_ORDER: data.rowItem['SORT_ORDER']
                    };
                    // Open popup
                    this.openWindow({ url: '/ECERP/Popup.Search/CM104P_01', name: String.format(ecount.resource.LBL06434, this.titlename), param: param, popupType: false, additional: false });
                    e.preventDefault();
                }.bind(this)
            }
        }
        return option;
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // Change button click event
    onFooterChange: function () {
        var title = String.format(ecount.resource.LBL00064, this.titlename);
        if (this.userPermit.Value != "W") { //permit check
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: title, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
        this.editFlag = true;
        this.footer.getControl("change").hide();
        this.footer.getControl("new").show();
        this.footer.getControl("list").show();
        this.footer.getControl("deleteSelected").show();

        this.changePopupTile(title, true);
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
            FORM_TYPE: this.searchFormParameter.FORM_TYPE,
            COL_CD: this.searchFormParameter.COL_CD,
            titleName: this.titlename
        };
        // Open popup
        this.openWindow({ url: '/ECERP/Popup.Search/CM104P_01', name: String.format(ecount.resource.LBL09999, this.titlename), param: param, popupType: false, additional: false });
    },

    // Delete button click event
    onFooterDeleteSelected: function (e) {
        var thisObj = this;
        var selectedItem = (e && e.gridCheckedItem) || this.contents.getGrid().getCheckedItem() || new Array();
        // Message processing when the choice is not
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        // Logic into the DeleteLists the selected sub-array
        var DeleteLists = new Array();
        selectedItem.forEach(function (val) {
            var param = {
                FORM_TYPE: thisObj.searchFormParameter.FORM_TYPE,
                COL_CD: thisObj.searchFormParameter.COL_CD,
                SEQ: val.SEQ
            }
            DeleteLists.push(param);
        });
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Inventory/Common/DeleteCofmUserTxt",
                    data: Object.toJSON(DeleteLists),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            thisObj.setReload(thisObj);
                        }
                    }
                });
            }
        });
    },

    // List button click event
    onFooterList: function () {
        this.editFlag = false;
        this.footer.getControl("change").show();
        this.footer.getControl("new").hide();
        this.footer.getControl("list").hide();
        this.footer.getControl("deleteSelected").hide();
        var grid = this.contents.getGrid();
        var title = String.format(ecount.resource.LBL10109, this.titlename);
        this.changePopupTile(title, true);
        grid.getSettings().setCheckBoxUse(false);
        grid.draw(this.searchFormParameter);
    },

    // quick Search button click event 퀴서치
    onHeaderQuickSearch: function (e, value) {
        var thisObj = this;
        var keyword = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.PARAM = keyword;
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
    ON_KEY_F8: function () {
    },

    // Enter
    ON_KEY_ENTER: function (e, target) {
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

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});
