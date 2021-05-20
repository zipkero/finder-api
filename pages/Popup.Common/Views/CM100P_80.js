window.__define_resource && __define_resource("LBL11369","MSG00957","MSG01136","LBL11390","LBL11371","BTN00069","BTN00033","BTN00008","MSG04063");
/****************************************************************************************************
1. Create Date : 2016.09.22
2. Creator     : 임명식
3. Description : 계산식 문자등록 팝업(formula string popup)
4. Precaution  :
5. History     : 
6. Old File    : none
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM100P_80", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
   

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL11369).notUsedBookmark();
    },

    onInitContents: function (contents) {
        var g = widget.generator
            , calcGrid = g.grid()
            , ctrl = g.control()
            , subTitle = g.subTitle()
            , itemForm = g.form()
            , toolbar = g.toolbar();

        subTitle.title(String.format("{0}</br>&nbsp;{1}", ecount.resource.LBL11369, String.format(ecount.resource.MSG00957, "25")));

        var value = "";
        if (this.viewBag.DefaultOption.popupEditMode == "02") {
            value = this.viewBag.DefaultOption.textValue;
        }

        toolbar.attach(ctrl.define("widget.input.general", "CALC_STRING", "CALC_STRING", "")
            .value(value)
            .filter("maxlength", { message: String.format(ecount.resource.MSG01136, "25", "25"), max: 25 })
            .setOptions({ _isErrorBorderNone: true })
        );

        contents.add(subTitle).add(toolbar);

        //MSG00957 :최대 {0}자까지 입력 가능합니다.
        //-문자입력   LBL11369
        //-구분기호   LBL11390
        //-설정내용   LBL11371
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce());

        if (this.viewBag.DefaultOption.popupEditMode == "02") {
            toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033));
        }

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onLoadComplete: function () {
        this.contents.getControl("CALC_STRING").setFocus(0);
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    //폼 마지막에서 엔터
    onFocusOutHandler: function (event) {
        this.footer.getControl("apply").setFocus(0);
    },

    onMessageHandler: function (page, param) {
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onFooterApply: function () {
        var calcDescCtrl = this.contents.getControl("CALC_STRING");

        if (calcDescCtrl.validate().length > 0) {
            this.footer.getControl("apply").setAllowClick();
            calcDescCtrl.setFocus(0);
            return false;
        }

        if ($.isEmpty(calcDescCtrl.getValue())) {
            this.footer.getControl("apply").setAllowClick();
            calcDescCtrl.showError(ecount.resource.MSG04063);
            calcDescCtrl.setFocus(0);
            return false;
        }
        var message = {
            index: this.viewBag.DefaultOption.indexEdit,
            editMode: this.viewBag.DefaultOption.popupEditMode,
            data: {
                CALC_DESC: calcDescCtrl.getValue(),
                INDEX: this.INDEX,
            }, callback: this.close.bind(this)
           
        };

        if (this.popupType == "layer") {
            this.sendMessage(this, message);
        } else {
            this.footer.getControl("apply").setAllowClick();
            opener && opener.onMessageHandler && opener.onMessageHandler(message);
        }
    },

    // Delete buttons event
    onFooterDelete: function (e) {
        var message = {
            Type: "delete",
            editMode: this.viewBag.DefaultOption.popupEditMode,
            index: this.viewBag.DefaultOption.indexEdit,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    //ENTER KEY
    ON_KEY_ENTER: function (event, control) {
        if (control && control.cid == "CALC_STRING") {
            this.footer.getControl("apply").setFocus(0);
        }
    },
    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridRenderComplete: function (e, data) {
        
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

});
