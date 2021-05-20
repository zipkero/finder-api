window.__define_resource && __define_resource("LBL04963","LBL04964","MSG04124","BTN00276","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.04.14
2. Creator     : 임명식
3. Description : 전자결재, 재고결재, 결재라인 선택  Register Apvl. Line 
4. Precaution  :
5. History     : 
6. Old File    : ECMain/EGD/EGD003P_01.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type1", "EGD003P_01", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    
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

        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL04963);

    },

    onInitContents: function (contents) {
        var _self = this;
        var form1 = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
           
        var option = [];
        $.each(this.viewBag.InitDatas.ApprovalData.ApprovalSelect, function (i, custdata) {
            option.push([String.format("{1}{0}{2}", ecount.delimiter, custdata.Key.APP_TYPE, custdata.Key.SEQ), String.format(ecount.resource.LBL04964, custdata.Key.APP_TYPE, custdata.Key.SEQ)])
        })
        toolbar.addLeft(ctrl.define("widget.label", "warning").label(ecount.resource.MSG04124).useHTML()).end();
        //form1.template("register")
        form1.add(ctrl.define("widget.select", "approvalSelect", "approvalSelect", ecount.resource.LBL04963)
            .option(option)
            .select(String.format("{1}{0}{2}", ecount.delimiter, this.viewBag.InitDatas.ApprovalData.APP_TYPE, this.viewBag.InitDatas.ApprovalData.APP_COUNT))
            .singleCell()
            .end());
        contents
            .add(toolbar)
            .add(form1)
           
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00276))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    
    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onFocusOutHandler: function (event) {
        this.footer.getControl("Save").setFocus(0);
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
        
    onFooterClose: function () {
        this.close();
    },
    
    onFooterSave: function (e) {
        
        var selValue = this.contents.getControl("approvalSelect").getValue();

        var appType, appSeq, arrayValue = selValue.split(ecount.delimiter);
        if (arrayValue.length > 1) {
            appType = arrayValue[0];
            appSeq = arrayValue[1];
        }
        else {
            appType = 1;
            appSeq = selValue;
        }
        var appKey = {
            SIGN_STATUS: null,
            APP_STATUS: null,
            IsSelectView: true,
            SelectSignStatus: appType,
            SelectAppSerNo: appSeq,
            IsIdRedundancy: this.IsIdRedundancy
        }
        var message = {
            data: appKey,
            callback: this.close.bind(this)
        };

        var parentFrame = ecount.getParentFrame(window);
        if (parentFrame.opener && parentFrame.opener.fnNewFrameWorkLink) {
            parentFrame.opener.fnNewFrameWorkLink(message);
        } else {
            this.sendMessage(this, message);
        }
        
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/


    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    

});