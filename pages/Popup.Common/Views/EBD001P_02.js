window.__define_resource && __define_resource("LBL04701","LBL04708","LBL00495","LBL04709","LBL06484","BTN00065","BTN00008","LBL04710","LBL04713","LBL04719","LBL04711","LBL04720","LBL07399","LBL02723");
/****************************************************************************************************
1. Create Date : 2017.03.31
2. Creator     : 김혁래
3. Description : 급여계정설정(Set up a payroll_ journal entry)
4. Precaution  : 
5. History     : 
6. MenuPath    : EasyEntry 급여계정설정(Set up a payroll_ journal entry)
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EBD001P_02", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/



    init: function (options) {
        this.initProperties();
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
        InitDatas: null;
        this.popupPageOption = {
            errorMessage: {
                grid: []
            }
        };

    },

    render: function () {
        this.InitDatas = this.viewBag.InitDatas;
        if (this.InitDatas.PayListLoad.count() == 0) {            
            this.setInitdata();
        }
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    //Header Option
    onInitHeader: function (header, resource) {
        var title = ecount.resource.LBL04701;
        header.setTitle(title)
              .notUsedBookmark();
    },

    //contents
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
        var columns = [],_self = this;

        columns.push({ propertyName: 'GYE_GUBUN', id: 'GYE_GUBUN', title: ecount.resource.LBL04708, align: 'left', width: '' });
        columns.push({ propertyName: 'GYE_DES', id: 'GYE_DES', title: ecount.resource.LBL00495, align: 'left', width: '' });
        if ((['Y'].contains(ecount.config.company.USE_DEPT) || (['Y'].contains(ecount.config.company.USE_PJT) && this.MENU_FLAG == "1")) && this.MENU_FLAG != "4") {
            columns.push({ propertyName: 'GYE_DEPT_PJT', id: 'GYE_DEPT_PJT', title: ecount.resource.LBL04709, align: 'center', width: '200' });
        }
        columns.push({ propertyName: 'SORT', id: 'SORT', title: ecount.resource.LBL06484, align: 'right', width: '' });


        settings
            .setCustomRowCell('GYE_GUBUN', this.setGridDateGyeGubun.bind(this))
            .setCustomRowCell('GYE_DES', this.setGridDateGyeDes.bind(this))
            .setCustomRowCell('GYE_DEPT_PJT', this.setGridDateLink.bind(this))
            .setCustomRowCell('SORT', this.setGridDateSort.bind(this))
            .setRowData(this.viewBag.InitDatas.PayListLoad)
            .setColumns(columns)
            .setEventFocusOnInit(true)
            .setEventWidgetTriggerObj(this.events)
            .setEditable(true, 0, 0)
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
        
        
    },

    //Footer(하단)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "save").label(this.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));   
        footer.add(toolbar);
    },

    //onFooterSave
    onFooterSave: function () {
        debugger;
         var _self = this;
         var gridItems = this.contents.getGrid().grid.getRowList();
         gridItems.forEach(function (Item, i) {
             var rowKey = Item[ecount.grid.constValue.keyColumnPropertyName];
             if (new Decimal(Item.SORT).isNaN() == true) {
                 _self.setErrorMessageGrid("SORT", "", "widget", rowKey, ""); // 
             }
             if ($.parseNumber(Item.SORT) < 1 || $.parseNumber(Item.SORT) > 3) {
                 _self.setErrorMessageGrid("SORT", "", "widget", rowKey, ""); // 
             }
         });
         if (_self.popupPageOption.errorMessage.grid.length > 0) {
             this.footer.getControl("save").setAllowClick();
             this.setShowErrorMessage();
             this.popupPageOption.errorMessage.grid = [];
             return false;
         }
        //var SaveData = this.contents.getGrid('dataGrid' + this.pageID).grid.getRowList();      
        var SaveData = new Array();
        this.contents.getGrid('dataGrid' + this.pageID).grid.getRowList().forEach(function (rowItem) {
            if (rowItem.GYE_DES == "") {
                rowItem.GYE_CODE = "";
            }
            SaveData.push(rowItem);
        });

         ecount.common.api({
             url: "/Account/Common/SavePayJournalEntrySetup",
             data: Object.toJSON({
                 SaveDetailData: SaveData,
                 MENU_FLAG: this.MENU_FLAG
             }),
             success: function (result) {
                 debugger;
                 console.log(result);
                 if (result.Status != "200") {
                     ecount.alert(result.fullErrorMsg + result.Data);
                 }
                 else {
                     this.close();                    
                 }
             }.bind(this)
         });

    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
     onLoadComplete: function () {
        this.contents.getGrid().grid.setCellFocus("SORT", "0");
    },

    //컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (event, data) {
        //data.callback && data.callback();
    },

    onPopupHandler: function (control, param, handler) {
        handler(param);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/

    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    //닫기버튼(Close Button)
    onFooterClose: function () {
        this.close();
        return false;
    },
    

    /********************************************************************** 
    * user function 
    **********************************************************************/

    setGridDateGyeGubun: function (value, rowItem) {

        var option = {};

        if (this.MENU_FLAG != '4') {
            switch (rowItem["K-E-Y"]) {
                case "0":
                    option.data = ecount.resource.LBL04710;
                    break;
                case "1":
                    option.data = ecount.resource.LBL04713;
                    break;
                case "2":
                    option.data = ecount.resource.LBL04719;
                    break;
            }
        }
        else {
            //기타원천세(세무) 리소스 사용안함
            switch (rowItem["K-E-Y"]) {
                case "0":
                    option.data = '지급총액';
                    break;
                case "1":
                    option.data = '지급';
                    break;
                case "2":
                    option.data = '예수금(세액)';
                    break;
            }
        }

        return option;
    },
    setGridDateGyeDes: function (value, rowItem) {
        var self = this;
        var option = {};

        if (this.MENU_FLAG != '4') {
            switch (rowItem["K-E-Y"]) {
                case "0":
                    option.data = ecount.resource.LBL04711;
                    break;
                case "1":
                    option.controlType = "widget.code.account";
                    option.controlOption = {
                        controlEvent: {

                            itemSelect: function (rowKey, arg) {

                                switch (arg.type) {

                                    case "addCode":

                                        self.contents.getGrid().grid.setCell("GYE_DES", rowKey, arg.message.data["GYE_DES"]);
                                        self.contents.getGrid().grid.setCell("GYE_CODE", rowKey, arg.message.data["GYE_CODE"]);
                                        break;

                                    case "removeCode":
                                        break;
                                }
                            }
                        }
                    }
                    break;
                case "2":
                    option.data = ecount.resource.LBL04720;
                    break;
            }
        }
        else {
            //기타원천세(세무) 리소스 사용안함
            switch (rowItem["K-E-Y"]) {
                case "0":
                    option.data = '소득자별 설정';
                    break;
                case "1":
                case "2":
                    option.controlType = "widget.code.account";
                    option.controlOption = {
                        controlEvent: {

                            itemSelect: function (rowKey, arg) {

                                switch (arg.type) {

                                    case "addCode":

                                        self.contents.getGrid().grid.setCell("GYE_DES", rowKey, arg.message.data["GYE_DES"]);
                                        self.contents.getGrid().grid.setCell("GYE_CODE", rowKey, arg.message.data["GYE_CODE"]);
                                        break;

                                    case "removeCode":
                                        break;
                                }
                            }
                        }
                    }
                    break;
            }
        }

        return option;

    },

    setGridDateSort: function (value, rowitem) {

        var option = {};
        option.controlType = 'widget.input.number';
        option.controlOption = {
            maxLength: 1,
        };

        return option;
    },

    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.controlType = 'widget.checkbox.multi';
        option.data = [];
        if(['Y'].contains(ecount.config.company.USE_DEPT)){
            option.data.push({ id: 'site', label: ecount.resource.LBL07399 })
        }
        if (['Y'].contains(ecount.config.company.USE_PJT)) {
            option.data.push({ id: 'pjt', label: ecount.resource.LBL02723 })
        }

        option.attrs = {};
        option.attrs['checked'] = {};
        option.attrs['disabled'] = {};
        if (rowItem.GYE_DEPT == "Y") {
            option.attrs['checked']['site'] = 'checked';
        }
        if (rowItem.GYE_PJT == "Y") {
            option.attrs['checked']['pjt'] = 'checked';
        }

        option.event = {
            'click': function (e, data) {
                var self = this;
                var grid = self.contents.getGrid().grid,
                    childElementId = data['childElementId'];
                if (childElementId === 'site') {
                    grid.setCell('GYE_DEPT', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
                else if (childElementId === 'pjt') {
                    grid.setCell('GYE_PJT', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                    //     grid.refreshCell('GYE_DEPT_PJT', data['rowKey'], { isRunChange: false, isForceFocus: true, childElementId: data['childElementId'] });
                }
                console.log(arguments);

            }.bind(this)
        }
        return option;
    },

    // 값이 없을때 dafault 넣어줌.
    setInitdata: function () {
        this.InitDatas.PayListLoad.push({
            GYE_GUBUN: 1,
            GYE_CODE: '',
            GYE_DEPT: 'N',
            GYE_PJT: 'N',
            SORT: '1',
            EDITOR_ID: '',
            EDIT_DE: '',
            MENU_FLAG: this.MENU_FLAG
        });
        this.InitDatas.PayListLoad.push({
            GYE_GUBUN: 2,
            GYE_CODE: '',
            GYE_DEPT: 'N',
            GYE_PJT: 'N',
            SORT: '2',
            EDITOR_ID: '',
            EDIT_DE: '',
            MENU_FLAG: this.MENU_FLAG
        });
        this.InitDatas.PayListLoad.push({
            GYE_GUBUN: 3,
            GYE_CODE: '',
            GYE_DEPT: 'N',
            GYE_PJT: 'N',
            SORT: '3',
            EDITOR_ID: '',
            EDIT_DE: '',
            MENU_FLAG: this.MENU_FLAG
        });

    },

    setShowErrorMessage: function (isConfirmCheck) {
        var _self = this;
        var focusTarget = null;
        var errorsOfGrid = this.popupPageOption.errorMessage.grid;
        showGridError(this.contents.getGrid().grid, errorsOfGrid);

        if ($.isNull(focusTarget) == false || $.isEmpty(errorsOfGrid) == false) {
            showFocusTarget();
            return;
        }
        // 포커스대상에 포커스지정
        function showFocusTarget() {
            var error = focusTarget.error;

            // 탭이동
            // Widget종류에 따른 메시지 및 포커스 처리
            switch (focusTarget.type) {
                case "grid":
                    var grid = null;
                        grid = _self.contents.getGrid().grid;

                    if ($.isNull(grid) == false) {
                        grid.activeCellBlur();
                        grid.setCellShowError(error.controlId, error.rowKey, {
                            placement: 'top',
                            message: error.errorMessage,
                            popOverVisible: !$.isEmpty(error.errorMessage)
                        });
                        grid.setCellFocus(error.controlId, error.rowKey);
                    }
                    break;
            }
        }

        // 포커스대상 콘트롤설정
        function setFocusTarget(type, error) {
            return {
                type: type,
                error: error
            };
        }

        function showGridError(grid, errors) {
            $.each(errors, function (i, x) {
                if ($.isNull(focusTarget)) {
                    focusTarget = setFocusTarget("grid", x);
                    return true;
                }
                grid.setCellShowError(x.controlId, x.rowKey, {
                    placement: 'top',
                    message: x.errorMessage,
                    popOverVisible: !$.isEmpty(x.errorMessage)
                });
            });
        }
    },

    //그리드 에러 list
    setErrorMessageGrid: function (controlId, message, type, rowKey, tab) {
        tab = "dataGrid" + this.pageID;
        this.popupPageOption.errorMessage.grid.push({ controlId: controlId, errorMessage: message, tabId: tab, type: type, rowKey: rowKey });
    },
});
