window.__define_resource && __define_resource("LBL12869","LBL12905","MSG07551","MSG01397","LBL02610","LBL12906","MSG07557","LBL03017","LBL03004","LBL00730","BTN00069","BTN00008","MSG07552","MSG07553");
/***********************************************************************************
 1. Create Date : 2017.03.24
 2. Creator     : heejun
 3. Description : 세부내역 양식설정에서 재고정보 반영기준 팝업창
 4. Precaution  :
 5. History     : 
 6. MenuPath    : 
 7. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.input", "CM100P_60", {

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
        header.setTitle(ecount.resource.LBL12869).notUsedBookmark();
    },

    onInitContents: function (contents) {
        var control = widget.generator.control(),
            settingLinePanel = widget.generator.settingPanel(),
            settingAggregationPanel = widget.generator.settingPanel(),
            customDiv = widget.generator.div();



        settingLinePanel
            .focusIndex(1).setId("reflectedInventorySlipLineNumber")
            .header(ecount.resource.LBL12905, ecount.resource.MSG07551) // '재고정보 반영줄수'
            .addContents(control.define("widget.input.number", "reflectedInventorySlipLineNumber", "REFLECTED_INVENTORY_SLIP_LINE_NUMBER", "재고전표 반영줄수")
                .numericOnly(3, 0, String.format(ecount.resource.MSG01397, '3'))
                .subLabel(ecount.resource.LBL02610)
                .value(this.formInfo.REFLECTED_INVENTORY_SLIP_LINE_NUMBER));

        customDiv.html("</br>");
        settingAggregationPanel
            .focusIndex(1).setId("acctDetailsByProdCodeAggregationYn")
            .header(ecount.resource.LBL12906, ecount.resource.MSG07557) // '재고정보 집계기준'
            .addContents(control.define("widget.checkbox", "acctDetailsByProdCodeAggregationYn").label(ecount.resource.LBL03017).value(["1"]).select(this.formInfo.ITEM_PROD_CODE_AGGREGATION_YN))
            .addContents(control.define("widget.checkbox", "acctDetailsByProdDesAggregationYn").label(ecount.resource.LBL03004).value(["1"]).select(this.formInfo.ITEM_PROD_DES_AGGREGATION_YN))
            .addContents(control.define("widget.checkbox", "acctDetailsBySizeDesAggregationYn").label(ecount.resource.LBL00730).value(["1"]).select(this.formInfo.ITEM_SIZE_DES_AGGREGATION_YN));


        contents
            .add(settingLinePanel)
            .add(customDiv)
            .add(settingAggregationPanel);
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
            this.contents.getControl('reflectedInventorySlipLineNumber').setFocus(0);
        }

        if (this.contents.getControl("acctDetailsByProdCodeAggregationYn").getValue() == true) {
            this.contents.getControl('acctDetailsByProdDesAggregationYn').readOnly(false);
            this.contents.getControl('acctDetailsBySizeDesAggregationYn').readOnly(false);
        } else {
            this.contents.getControl('acctDetailsByProdDesAggregationYn').readOnly(true);
            this.contents.getControl('acctDetailsBySizeDesAggregationYn').readOnly(true);
        }
    },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        switch (page.pageID) {
        }
        message.callback && message.callback();
    },

    onFocusOutHandler: function (event) {
        this.footer.getControl("apply").setFocus(0);
    },

    onFocusOutControlHandler: function (control) {
    },

    onChangeControl: function (control, data) {
        switch (control.cid) {
            case 'acctDetailsByProdCodeAggregationYn':
                if (control.value == true) {
                    this.contents.getControl('acctDetailsByProdDesAggregationYn').readOnly(false);
                    this.contents.getControl('acctDetailsBySizeDesAggregationYn').readOnly(false);
                } else {
                    this.contents.getControl('acctDetailsByProdDesAggregationYn').setValue(false);
                    this.contents.getControl('acctDetailsByProdDesAggregationYn').readOnly(true);
                    this.contents.getControl('acctDetailsBySizeDesAggregationYn').setValue(false);
                    this.contents.getControl('acctDetailsBySizeDesAggregationYn').readOnly(true);
                }
                break;
        }
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
        this.formInfo.REFLECTED_INVENTORY_SLIP_LINE_NUMBER = this.contents.getControl('reflectedInventorySlipLineNumber').getValue();
        this.formInfo.ITEM_PROD_CODE_AGGREGATION_YN = this.contents.getControl('acctDetailsByProdCodeAggregationYn').getValue();
        this.formInfo.ITEM_PROD_DES_AGGREGATION_YN = this.contents.getControl('acctDetailsByProdDesAggregationYn').getValue();
        this.formInfo.ITEM_SIZE_DES_AGGREGATION_YN = this.contents.getControl('acctDetailsBySizeDesAggregationYn').getValue();

        if ($.isEmpty(this.formInfo.REFLECTED_INVENTORY_SLIP_LINE_NUMBER)) {
            this.contents.getControl('reflectedInventorySlipLineNumber').showError(ecount.resource.MSG07552);
            this.contents.getControl('reflectedInventorySlipLineNumber').setFocus(0);
            return false;
        }

        if (Number(this.formInfo.REFLECTED_INVENTORY_SLIP_LINE_NUMBER) < 1) {
            this.contents.getControl('reflectedInventorySlipLineNumber').showError(String.format(ecount.resource.MSG07553, '1'));
            return false;
        }

        var message = {
            formIndex: 0,
            formOutSetAcct: this.formInfo,
            callback: this.close.bind(this)
        };

        debugger;
        this.sendMessage(this, message);
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

});