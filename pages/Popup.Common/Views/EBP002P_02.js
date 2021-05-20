window.__define_resource && __define_resource("LBL00847","LBL03718","LBL02214","BTN00008","MSG00349","MSG01184");
/****************************************************************************************************
1. Create Date : 2017.01.19
2. Creator     : LeNguyen
3. Description : (Change Date for Contract)
4. Precaution  :
5. History     : [2018.10.11][DOTRINH] - apply common ref.
                 2020.01.30 (이은총) A19_04061 위젯 옵션 삭제에 따른 페이지 수정 요청
6. Old File    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EBP002P_02", {

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
        header.setTitle(this.viewBag.Title);

    },

    onInitContents: function (contents) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control();

        var _self = this;
        var form1 = generator.form();
        form1.template("register");


        form1.add(ctrl.define("widget.date.label", "lblCurrentDate", "lblCurrentDate", ecount.resource.LBL00847).select(this.CT_DATE).end());
        form1.add(ctrl.define("widget.date", "NEW_DATE", "NEW_DATE", ecount.resource.LBL03718)
            .setOptions({
                errorContainer: "bottom"
            })
            .end());

        contents.add(form1);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.LBL02214).clickOnce())
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
        var thisObj = this;
        var date = new Date();
        var ctrnewdate = this.contents.getControl("NEW_DATE", "details");
        var btn = this.footer.get(0).getControl("Save");
                
        if (ctrnewdate.needValidate) {
            btn.setAllowClick();
            return false;
        }

        if (this.CT_DATE == Date.format("yyyyMMdd", ctrnewdate.getDate()[0])) {            
            ctrnewdate.showError(ecount.resource.MSG00349);
            ctrnewdate.setFocus(2);
            btn.setAllowClick();
            return false;
        }

       

        if (Date.format("yyyyMMdd", ctrnewdate.getDate()[0]) < thisObj.viewBag.ProgramInfo.AC_LIMIT_DATE.left(10).toDate().format("yyyyMMdd")) {
            thisObj.resizeLayer((650 < ecount.infra.getPageWidthFromConfig()) ? ecount.infra.getPageWidthFromConfig() : 650, 300);
            ctrnewdate.showError(this.viewBag.MsgCheckDate);
            ctrnewdate.setFocus(2);
            btn.setAllowClick();
            return false;
        }

        var formData;

        formData = {
            CT_DATE: this.CT_DATE,
            CT_NO: this.CT_NO,
            NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
            CheckRightSlipInfo: this.CheckRightSlipInfo,
            HID: this.HID,
            CheckPermissionRequest: this.CheckPermissionRequest

        }

        ecount.common.api({
            url: "/Account/ContractMgmt/DateChangeForContractMgmt",
            data: Object.toJSON(formData),
            success: function (result) {
               
                if (result.Status != "200") {                    
                    
                }
                else {    
                    //부모창에 값 던짐
                    ecount.alert(ecount.resource.MSG01184, function () {
                        thisObj.sendMessage(thisObj, result.Data);
                    });                    
                }
            }.bind(this),
            error: this.setApiError.bind(this)
        });

    },

    // Common Api Error
    setApiError: function (jqXHR, Status, Error) {
        if (ecount.error && Error.Message) {
            ecount.error(Error.Message, {
                title: 'System Error ' + Status,
                trace: Error.MessageDetail
            });
        }
        else if (Error.Message){
            alert(Error.Message);
        }
        this.footer.get(0).getControl("Save").setAllowClick();;
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/


    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    

});