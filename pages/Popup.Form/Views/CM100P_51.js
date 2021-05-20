window.__define_resource && __define_resource("LBL10579","LBL00064","LBL03070","LBL01818","LBL06764","MSG00205","LBL05882","BTN00065","BTN00043","BTN00008","MSG02158","LBL00830","LBL00923","LBL01964","LBL08834","LBL35286","LBL01482","LBL09962");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : Template List(양식리스트)
 4. Precaution  :
 5. History     : 2020.10.22 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정_회계1
 6. MenuPath    : Self-Customizing>Configuration(환경설정)>Function Setup(사용방법설정)>Inv Tab(재고탭)>Template List(양식리스트)
 7. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_51", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
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
            PARAM: ''
        };
    },

    initProperties: function () {
        this.userPermit = this.viewBag.Permission.inventoryPermit;
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
            .setTitle(String.format(ecount.resource.LBL00064, ecount.resource.LBL03070));

        if (!this.isCS)
            header.useQuickSearch(); //로딩시 화면에 표시됨


        var isSubmit = false;
        var message = {
            type: "getFormSubmitParent",
            callback: function (data) {
                isSubmit = true;
            }.bind(this)
        };
        this.sendMessage(this, message);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            ctrl = generator.control(),
            grid = generator.grid();

        this.resizeLayer(500, 500);

        this.viewBag.InitDatas.listLoad.sort(function (a, b) {
            return a.TITLE_NM.localeCompare(b.TITLE_NM, 'en-US');
        }.bind(this));
       
        if (this.isCS)
        {
            var listLoad = this.viewBag.InitDatas.listLoad;
            if (listLoad) {
                if (this.FORM_TYPE == "AO012") {
                    for (var i = 0, len = listLoad.length; i < len; i++) {
                        if (i == 0)
                            listLoad[i]['IS_CHECKED'] = "Y";
                        else
                            listLoad[i]['IS_CHECKED'] = "N";
                    }
                } else {
                    for (var i = 0, len = listLoad.length; i < len; i++) {
                        listLoad[i]['IS_CHECKED'] = "Y";
                    }
                }
            }

        grid
            .setRowData(listLoad)
            .setColumnFixHeader(true)
            .setRowDataNumbering(true)
            .setColumns([                
                { propertyName: 'TITLE_NM', id: 'TITLE_NM', title: ecount.resource.LBL01818, width: '' },
                { propertyName: 'IS_SELECTED', id: 'IS_SELECTED', title: ecount.resource.LBL06764, width: '100', align: 'center' }
            ])
            .setCustomRowCell('IS_SELECTED', this.setGridDataSelected.bind(this))
            .setEmptyGridMessage(ecount.resource.MSG00205)
            .setEventFocusOnInit(true)
            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            
        }
        else 
        {
            grid
            .setRowData(this.viewBag.InitDatas.listLoad)
            .setRowDataUrl("/Common/Form/GetListCofmFormoutsetByAllow")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['FORM_SEQ'])
            .setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'ROW', id: 'ROW', title: ecount.resource.LBL05882, width: '100' },
                { propertyName: 'TITLE_NM', id: 'TITLE_NM', title: ecount.resource.LBL01818, width: '' },
                { propertyName: 'BASIC_TYPE', id: 'BASIC_TYPE', title: ecount.resource.LBL06764, width: '100' },
            ])
            .setEmptyGridMessage(ecount.resource.MSG00205)
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setCustomRowCell('TITLE_NM', this.setGridDataLink.bind(this))
            .setCustomRowCell('BASIC_TYPE', this.setGridDataDefaultType.bind(this))
            .setEventFocusOnInit(true)

            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            //.setCheckBoxActiveRowStyle(true);
        }
        contents
            .addGrid("dataGrid" + this.pageID, grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();

        if (this.isCS)
            toolbar.addLeft(ctrl.define("widget.button", "save").css("btn btn-primary").label(ecount.resource.BTN00065).clickOnce());
        else
        toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-primary").label(ecount.resource.BTN00043));

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
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
        if (!this.isCS) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
        }
    },
    onMessageHandler: function (page, message) {
        var thisObj = this;
        if (page.pageID == 'CM100P_22') {
            var nFormType = message.FORM_TYPE;
            var nFormSeq = message.FORM_SEQ;
            message.callback && message.callback();
            if (thisObj.isSelfSubmit) {
                thisObj.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_02", { __ecPage__: null, FORM_TYPE: nFormType, FORM_SEQ: nFormSeq, isFromSc: thisObj.isFromSc, MENU_TYPE: thisObj.MENU_TYPE, isSaveAfterClose: this.isSaveAfterClose, DISP_UNIT: message.DISP_UNIT, FromProgramId : thisObj.FromProgramId }, null);
            } else {

              
                var keyword = thisObj.header.getQuickSearchControl().getValue();
                thisObj.searchFormParameter.PARAM = keyword;
                thisObj.setReload(thisObj);

                //var message = {
                //    type: "setNewFormTypeSeq",
                //    data: { FORM_TYPE: nFormType, FORM_SEQ: nFormSeq },
                //    callback: this.close.bind(this)
                //};
                //thisObj.sendMessage(this, message);
            }
        }
        //this.setReload(this);
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
    setGridDataLink: function (value, rowItem) {
        var thisObj = this;
        var option = {};
        option.controlType = "widget.link";
        option.data = value || ".";
        option.event = {
            'click': function (e, data) {
                debugger;
                if (thisObj.isSelfSubmit) {
                    thisObj.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_02", { DISP_UNIT: data.rowItem.DISP_UNIT, __ecPage__: null, FORM_TYPE: data.rowItem.FORM_TYPE, FORM_SEQ: data.rowItem.FORM_SEQ, isFromSc: thisObj.isFromSc, MENU_TYPE: thisObj.MENU_TYPE, isSaveAfterClose: this.isSaveAfterClose, FromProgramId :thisObj.FromProgramId }, null);
                } else {
                    var message = {
                        type: "setNewFormTypeSeq",
                        data: { FORM_TYPE: data.rowItem.FORM_TYPE, FORM_SEQ: data.rowItem.FORM_SEQ, isSaveAfterClose: this.isSaveAfterClose },
                        callback: this.close.bind(this)
                    };
                    message.data.DISP_UNIT = data.rowItem.DISP_UNIT;
                    thisObj.sendMessage(this, message);
                }
            }.bind(this)
        };
        return option;
    },

    setGridDataDefaultType: function (value, rowItem) {
        var thisObj = this;
        var option = {};
        switch (rowItem.BASIC_TYPE) {
            case "0":
                if (thisObj.viewBag.InitDatas.formSet.BASIC_YN == "Y")
                    option.data = ecount.resource.LBL00830;
                else if (thisObj.viewBag.InitDatas.formSet.DOMESTIC_YN == "Y")
                    option.data = ecount.resource.LBL00923;

                break;
            case "1":
                option.data = ecount.resource.LBL01964;
                break;
            case "2":
                //option.data = ecount.resource.LBL08834;
                //break;
            case "3":
                //if (this.isShowCSDefault)
                //    option.data = ecount.resource.LBL35286;
                //else {
                //    option.data = "";
                //}
                //break;
            case "N":
                option.data = "";
                break;
        }
        return option;
    },


    setGridDataSelected: function (value, rowItem) {
        var thisObj = this;
        var option = {};

        option.controlType = "widget.radio";
        option.value = "Y";
        option.name = "radio1";
        option.event = {
            'change': function (e, data) {
                thisObj.contents.getGrid().grid.getRowList().forEach(function (item) {
                    if (data.rowItem[ecount.grid.constValue.keyColumnPropertyName] == item[ecount.grid.constValue.keyColumnPropertyName]) {
                        thisObj.contents.getGrid().grid.setCell("IS_CHECKED", item[ecount.grid.constValue.keyColumnPropertyName], "Y");
                    }
                    else {
                        thisObj.contents.getGrid().grid.setCell("IS_CHECKED", item[ecount.grid.constValue.keyColumnPropertyName], "N");
                    }
                });
            }.bind(this)
        };

        if (this.FORM_TYPE == "AO012" && this.isCS) {
            option.attrs = {
                'disabled': true
            }
        }
        return option;
    },

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
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

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // New button click event
    onFooterNew: function (e) {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        
        if (permit != "W" && thisObj.IsDetailPermit == false) {
            //permission message 권한 메시지
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
        } else {
            var param = {
                width: 420,//width: ecount.infra.getPageWidthFromConfig(),
                height: 400,
                modal: true,
                FORM_TYPE: this.searchFormParameter.FORM_TYPE,
                IsSubmitSelf: false,
                isLock: thisObj.isLock,
                isSaveAfterClose: this.isSaveAfterClose,
                MENU_TYPE: thisObj.MENU_TYPE,
                FromProgramId: thisObj.FromProgramId
            };
            // Open popup
            thisObj.openWindow({
                url: '/ECERP/Popup.Form/CM100P_22',
                name: ecount.resource.LBL09962,
                param: param,
                popupType: false,
                additional: false,
            });
        }
    },

    // quick Search button click event 퀴서치
    onHeaderQuickSearch: function (e, value) {
        var thisObj = this;
        var keyword = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.PARAM = keyword;
        this.setReload(this);
    },



    onFooterSave: function () {
        var self = this;
        var gridData = this.contents.getGrid().grid.getRowList();
        var basicData = null;

        for (var i = 0, len = gridData.length; i < len; i++) {
            if (gridData[i]['IS_CHECKED'] == "Y") {
                basicData = gridData[i];
            }
        }
        
        var param = [{
            BASIC_TYPE: basicData["BASIC_TYPE"],
            FORM_BASIC: basicData["FORM_BASIC"],
            FORM_SEQ: basicData["FORM_SEQ"],
            FORM_TYPE: basicData["FORM_TYPE"],
            PROGRAM_ID: basicData["PROGRAM_ID"],
        }];

        this.showProgressbar();
        ecount.common.api({
            url: "/SelfCustomize/CSPortal/UpdateOrInsertMenuAndTemplateCS",
            data: Object.toJSON({ Templates: param, ALL_MN_GROUPCD: self.ALL_MN_GROUPCD }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    self.sendMessage(self, { reload: true });
                    self.onFooterClose();
                }
            },
            complete: function (e) {
                self.hideProgressbar();
            }
        });

        this.footer.getControl("save").setAllowClick();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    // F2
    ON_KEY_F2: function () {
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
        setTimeout(function () { gridObj.focus(); }, 0);
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});
