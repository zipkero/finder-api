window.__define_resource && __define_resource("LBL12867","MSG07550","LBL09270","LBL13009","LBL13010","LBL12868","LBL01770","LBL01732","BTN00069","BTN00008","LBL02211","LBL00540","LBL01356","LBL02802","LBL01048");
/***********************************************************************************
 1. Create Date : 2017.03.24
 2. Creator     : heejun
 3. Description : 세부내역 양식설정에서 회계정보수정시동기화 팝업창
 4. Precaution  :
 5. History     : 
 6. MenuPath    : 
 7. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.input", "CM100P_59", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    formInfo: null,


    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },


    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    onInitHeader: function (header) {
        var message = {
            type: "getFormInfo",
            formIndex: 0,
            callback: function (data) {
                this.formInfo = data;
            }.bind(this)
        }
        this.sendMessage(this, message);
        header.setTitle(ecount.resource.LBL12867).notUsedBookmark();
    },

    onInitContents: function (contents) {
        var settingPanel = widget.generator.settingPanel(),
            customDiv = widget.generator.div(),
            grid = widget.generator.grid();


        settingPanel
            .focusIndex(1).setId("settingPanel")
            .header(ecount.resource.LBL12867, ecount.resource.MSG07550);


        customDiv.html("</br>");

        grid
            .setRowData(this.getRowData.call(this))
            .setColumns([
                { id: 'DESCRIPTION', propertyName: 'DESCRIPTION', title: ecount.resource.LBL09270, width: '200' },
                { id: 'NEW_BY_BEFORE', propertyName: 'NEW_BY_BEFORE', title: ecount.resource.LBL13009, width: '70', controlType: 'widget.checkbox', align: 'center' },
                { id: 'NEW_BY_AFTER', propertyName: 'NEW_BY_AFTER', title: ecount.resource.LBL13010, width: '70', controlType: 'widget.checkbox', align: 'center' },
                { id: 'MODIFY_BY_BEFORE', propertyName: 'MODIFY_BY_BEFORE', title: ecount.resource.LBL13009, width: '70', controlType: 'widget.checkbox', align: 'center' },
                { id: 'MODIFY_BY_AFTER', propertyName: 'MODIFY_BY_AFTER', title: ecount.resource.LBL13010, width: '70', controlType: 'widget.checkbox', align: 'center' },
                { id: 'MERGE', propertyName: 'MERGE', title: ecount.resource.LBL12868, width: '100', controlType: 'widget.checkbox', align: 'center' }
            ])
            .setColumnRowCustom([0, 0], [{
                '_MERGE_SET': new Array(
                    {
                        _MERGE_USEOWN: true,
                        _MERGE_START_INDEX: 0,
                        _ROWSPAN_COUNT: 2,
                        _IS_CENTER_ALIGN: 'center'
                    },
                    {
                        _MERGE_USEOWN: false,
                        _ROW_TITLE: ecount.resource.LBL01770,
                        _MERGE_START_INDEX: 1,
                        _COLSPAN_COUNT: 2,
                        _IS_CENTER_ALIGN: 'center'
                    },
                    {
                        _MERGE_USEOWN: false,
                        _ROW_TITLE: ecount.resource.LBL01732,
                        _MERGE_START_INDEX: 3,
                        _COLSPAN_COUNT: 2,
                        _IS_CENTER_ALIGN: 'center'
                    },
                    {
                        _MERGE_USEOWN: true,
                        _MERGE_START_INDEX: 5,
                        _ROWSPAN_COUNT: 2,
                        _IS_CENTER_ALIGN: 'center'
                    })
            }])
            .setCustomRowCell('MODIFY_BY_BEFORE', function (value, rowItem) {
                return option = {
                    attrs: {
                        'disabled': ['DATE'].contains(rowItem.DATAKEY) ? true : false
                    }
                };
            })
            .setCustomRowCell('MODIFY_BY_AFTER', function (value, rowItem) {
                return option = {
                    attrs: {
                        'disabled': ['DATE'].contains(rowItem.DATAKEY) ? true : false
                    }
                };
            })
            .setCustomRowCell('MERGE', function (value, rowItem) {
                debugger;
                return option = {
                    attrs: {
                        'disabled': ['ACCOUNTNUMBER_RECEIVED'].contains(rowItem.DATAKEY) ? true : false
                    }
                };
            }.bind(this));

        contents
            .add(settingPanel)
            .add(customDiv)
            .addGrid('grid_' + this.pageID, grid);


    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (e) {
        if (!e.unfocus) {

        }
    },

    onMessageHandler: function (page, message) {
        switch (page.pageID) {
        }
        message.callback && message.callback();
    },

    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },

    onFocusOutHandler: function (event) {
    },

    onFocusOutControlHandler: function (control) {
    },

    onChangeControl: function (control, data) {
    },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //Apply 적용 버튼
    onFooterApply: function () {
        var gridData = this.contents.getGrid("grid_" + this.pageID).grid.getRowList();

        this.formInfo.DATE_NEW_SYNC_BY_BEFORE = getSettingValue('DATE', 'NEW_BY_BEFORE');
        this.formInfo.SUPPLY_AMT_NEW_SYNC_BY_BEFORE = getSettingValue('SUPPLYAMT', 'NEW_BY_BEFORE');
        this.formInfo.VAT_AMT_NEW_SYNC_BY_BEFORE = getSettingValue('VATAMT', 'NEW_BY_BEFORE');
        this.formInfo.REMARKS_NEW_SYNC_BY_BEFORE = getSettingValue('REMARKS', 'NEW_BY_BEFORE');
        this.formInfo.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_BEFORE = getSettingValue('ACCOUNTNUMBER_RECEIVED', 'NEW_BY_BEFORE');

        this.formInfo.DATE_NEW_SYNC_BY_AFTER = getSettingValue('DATE', 'NEW_BY_AFTER');
        this.formInfo.SUPPLY_AMT_NEW_SYNC_BY_AFTER = getSettingValue('SUPPLYAMT', 'NEW_BY_AFTER');
        this.formInfo.VAT_AMT_NEW_SYNC_BY_AFTER = getSettingValue('VATAMT', 'NEW_BY_AFTER');
        this.formInfo.REMARKS_NEW_SYNC_BY_AFTER = getSettingValue('REMARKS', 'NEW_BY_AFTER');
        this.formInfo.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_AFTER = getSettingValue('ACCOUNTNUMBER_RECEIVED', 'NEW_BY_AFTER');

        this.formInfo.DATE_MODIFY_SYNC_BY_BEFORE = getSettingValue('DATE', 'MODIFY_BY_BEFORE');
        this.formInfo.SUPPLY_AMT_MODIFY_SYNC_BY_BEFORE = getSettingValue('SUPPLYAMT', 'MODIFY_BY_BEFORE');
        this.formInfo.VAT_AMT_MODIFY_SYNC_BY_BEFORE = getSettingValue('VATAMT', 'MODIFY_BY_BEFORE');
        this.formInfo.REMARKS_MODIFY_SYNC_BY_BEFORE = getSettingValue('REMARKS', 'MODIFY_BY_BEFORE');
        this.formInfo.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_BEFORE = getSettingValue('ACCOUNTNUMBER_RECEIVED', 'MODIFY_BY_BEFORE');

        this.formInfo.DATE_MODIFY_SYNC_BY_AFTER = getSettingValue('DATE', 'MODIFY_BY_AFTER');
        this.formInfo.SUPPLY_AMT_MODIFY_SYNC_BY_AFTER = getSettingValue('SUPPLYAMT', 'MODIFY_BY_AFTER');
        this.formInfo.VAT_AMT_MODIFY_SYNC_BY_AFTER = getSettingValue('VATAMT', 'MODIFY_BY_AFTER');
        this.formInfo.REMARKS_MODIFY_SYNC_BY_AFTER = getSettingValue('REMARKS', 'MODIFY_BY_AFTER');
        this.formInfo.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_AFTER = getSettingValue('ACCOUNTNUMBER_RECEIVED', 'MODIFY_BY_AFTER');;

        this.formInfo.DATE_MERGE_SYNC = getSettingValue('DATE', 'MERGE');
        this.formInfo.SUPPLY_AMT_MERGE_SYNC = getSettingValue('SUPPLYAMT', 'MERGE');
        this.formInfo.VAT_AMT_MERGE_SYNC = getSettingValue('VATAMT', 'MERGE');
        this.formInfo.REMARKS_MERGE_SYNC = getSettingValue('REMARKS', 'MERGE');
        this.formInfo.ACCOUNTNUMBER_RECEIVED_MERGE_SYNC = getSettingValue('ACCOUNTNUMBER_RECEIVED', 'MERGE');

        var message = {
            formIndex: 0,
            formOutSetAcct: this.formInfo,
            callback: this.close.bind(this)
        };

        debugger;
        this.sendMessage(this, message);

        function getSettingValue(gridID, settingType) {
            if (gridData.where(function (x) { return x.DATAKEY == gridID }).length > 0) {
                return gridData.where(function (x) { return x.DATAKEY == gridID }).first()[settingType];
            }

            return null;
        }
    },


    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    //F8 Event
    ON_KEY_F8: function () {
        this.onFooterApply();
    },


    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },



    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    getRowData: function () {
        debugger;

        var returnData = [];

        //일자
        if (this.viewBag.FormInfos.Details.columns.where(function (x) { return x.id == "mmdd"; }).length > 0) {
            returnData.push({ 'DATAKEY': 'DATE', 'DESCRIPTION': ecount.resource.LBL02211, 'NEW_BY_BEFORE': this.formInfo.DATE_NEW_SYNC_BY_BEFORE, 'NEW_BY_AFTER': this.formInfo.DATE_NEW_SYNC_BY_AFTER, 'MODIFY_BY_BEFORE': this.formInfo.DATE_MODIFY_SYNC_BY_BEFORE, 'MODIFY_BY_AFTER': this.formInfo.DATE_MODIFY_SYNC_BY_AFTER, 'MERGE': this.formInfo.DATE_MERGE_SYNC });
        }

        //공급가액
        if (this.viewBag.FormInfos.Details.columns.where(function (x) { return x.id == "supply_amt"; }).length > 0) {
            returnData.push({ 'DATAKEY': 'SUPPLYAMT', 'DESCRIPTION': ecount.resource.LBL00540, 'NEW_BY_BEFORE': this.formInfo.SUPPLY_AMT_NEW_SYNC_BY_BEFORE, 'NEW_BY_AFTER': this.formInfo.SUPPLY_AMT_NEW_SYNC_BY_AFTER, 'MODIFY_BY_BEFORE': this.formInfo.SUPPLY_AMT_MODIFY_SYNC_BY_BEFORE, 'MODIFY_BY_AFTER': this.formInfo.SUPPLY_AMT_MODIFY_SYNC_BY_AFTER, 'MERGE': this.formInfo.SUPPLY_AMT_MERGE_SYNC });
        }

        //부가세
        if (this.viewBag.FormInfos.Details.columns.where(function (x) { return x.id == "vat_amt"; }).length > 0) {
            returnData.push({ 'DATAKEY': 'VATAMT', 'DESCRIPTION': ecount.resource.LBL01356, 'NEW_BY_BEFORE': this.formInfo.VAT_AMT_NEW_SYNC_BY_BEFORE, 'NEW_BY_AFTER': this.formInfo.VAT_AMT_NEW_SYNC_BY_AFTER, 'MODIFY_BY_BEFORE': this.formInfo.VAT_AMT_MODIFY_SYNC_BY_BEFORE, 'MODIFY_BY_AFTER': this.formInfo.VAT_AMT_MODIFY_SYNC_BY_AFTER, 'MERGE': this.formInfo.VAT_AMT_MERGE_SYNC });
        }

        //적요
        if (this.viewBag.FormInfos.Details.columns.where(function (x) { return x.id == "prod_des"; }).length > 0) {
            returnData.push({ 'DATAKEY': 'REMARKS', 'DESCRIPTION': ecount.resource.LBL02802, 'NEW_BY_BEFORE': this.formInfo.REMARKS_NEW_SYNC_BY_BEFORE, 'NEW_BY_AFTER': this.formInfo.REMARKS_NEW_SYNC_BY_AFTER, 'MODIFY_BY_BEFORE': this.formInfo.REMARKS_MODIFY_SYNC_BY_BEFORE, 'MODIFY_BY_AFTER': this.formInfo.REMARKS_MODIFY_SYNC_BY_AFTER, 'MERGE': this.formInfo.REMARKS_MERGE_SYNC });
        }

        //돈들어온계좌번호
        if (this.viewBag.FormInfos.Master != null && this.viewBag.FormInfos.Master.columns.where(function (x) { return x.id == "settle"; }).length > 0) {
            returnData.push({ 'DATAKEY': 'ACCOUNTNUMBER_RECEIVED', 'DESCRIPTION': ecount.resource.LBL01048, 'NEW_BY_BEFORE': this.formInfo.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_BEFORE, 'NEW_BY_AFTER': this.formInfo.ACCOUNTNUMBER_RECEIVED_NEW_SYNC_BY_AFTER, 'MODIFY_BY_BEFORE': this.formInfo.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_BEFORE, 'MODIFY_BY_AFTER': this.formInfo.ACCOUNTNUMBER_RECEIVED_MODIFY_SYNC_BY_AFTER, 'MERGE': this.formInfo.ACCOUNTNUMBER_RECEIVED_MERGE_SYNC });
        }

        return returnData;
    }

});