window.__define_resource && __define_resource("LBL00842","LBL01324","LBL02214","BTN00008","MSG01300","MSG00349","MSG00007","MSG09273","MSG01719","MSG01184","MSG01088");
/****************************************************************************************************
1. Create Date : 2016.03.22
2. Creator     : 이정민
3. Description : 회계 일자변경 (Change Date for Account)
4. Precaution  :
5. History     : 2017.11.15(Hao) - add case Service Hour
                 2019.07.19 (PhiTa) A18_00268 - 재고 회계반영일자 과거 1년 / 미래 1년으로 제한하기
                 2019.09.10 (Nguyen Duc Thinh) A19_02893 - 재고 회계반영일자 과거 1년 / 미래 1년으로 제한하기 후속
                 2019.12.19 [DucThai] A19_04521 - 매출전표 일자변경시 만기일자 체크해주지 못하는 문제
                 2020.01.30 (이은총) A19_04061 위젯 옵션 삭제에 따른 페이지 수정 요청
                 2020.03.25(양미진) - dev 32435 A20_01121 계약관리에서 반영한 매출전표의 일자변경 확인요청 
                 2020.06.09 [DucThai] A20_01931 - 권한세분화 선작업_나머지메뉴 적용 (비현금, 어음, 고정자산, 전표관리)
6. Old File    : ECMain/EBD/EBD002P_03.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EBD002P_03", {

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
        form1.add(ctrl.define("widget.label", "lblCurrentDate", "lblCurrentDate", ecount.resource.LBL00842).label(this.viewBag.lblCurrentDate).end());
        form1.add(ctrl.define("widget.date", "NEW_DATE", "NEW_DATE", ecount.resource.LBL01324)
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
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            btn.setAllowClick();
            return false;
        }

        if (!$.isEmpty(this.CHECK_DATE) && this.CHECK_DATE < Date.format("yyyyMMdd", ctrnewdate.getDate()[0])) {
            ctrnewdate.showError(ecount.resource.MSG01300);
            ctrnewdate.setFocus(2);
            btn.setAllowClick();
            return false;
        }

        if (this.TRX_DATE == Date.format("yyyyMMdd", ctrnewdate.getDate()[0])) {
            ctrnewdate.showError(ecount.resource.MSG00349);
            ctrnewdate.setFocus(2);
            btn.setAllowClick();
            return false;
        }

        if (this.IsTaxInput && this.TRX_DATE.left(4) != Date.format("yyyyMMdd", ctrnewdate.getDate()[0]).left(4)) {
            ctrnewdate.showError(ecount.resource.MSG00007);
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

        if (this.MinDate.trim() != "0" || this.MaxDate.trim() != "0") {
            var new_date = parseInt(Date.format("yyyy", ctrnewdate.getDate()[0]));
            var _trx_date = parseInt(this.MinDate.substr(0, 4));
            var _trx_date_max = parseInt(this.MaxDate.substr(0, 4));
            if (Math.abs(new_date - _trx_date) > 1 || Math.abs(new_date - _trx_date_max) > 1) {
                ctrnewdate.showError(ecount.resource.MSG09273);
                ctrnewdate.setFocus(2);
                btn.setAllowClick();
                return false;
            }
        }

        if (!$.isEmpty(this.DUE_DATE) && Date.format("yyyyMMdd", ctrnewdate.getDate()[0]) > this.DUE_DATE) {
            ctrnewdate.showError(ecount.resource.MSG01719);
            ctrnewdate.setFocus(2);
            btn.setAllowClick();
            return false;
        }

        var formData;
        formData = {
            TRX_DATE: this.TRX_DATE,
            TRX_NO: this.TRX_NO,
            NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
            GB_TYPE: this.GB_TYPE,
            VERSION_NO: this.VERSION_NO,
            CheckRightSlipInfo: this.CheckRightSlipInfo,
            HID: this.HID,
            TRX_TYPE: this.TRX_TYPE,
            SER_NO: this.SER_NO,
            CheckPermissionRequest: this.CheckPermissionRequest
        }

        ecount.common.api({
            url: this.FORM_TYPE == "AF070" ? "/Account/ServiceMgmt/ChangeDateACSVService" : "/Account/Invoice/DateChangeForEasyMulti",
            data: Object.toJSON(formData),
            success: function (result) {

                if (result.Status != "200") {

                }
                else {
                    if ((this.FORM_TYPE == "AF070" && result.Data.ERRFLAG == "1") || this.FORM_TYPE != "AF070") {
                        //부모창에 값 던짐
                        ecount.alert(ecount.resource.MSG01184, function () {
                            // onMessagehandler로 보내는 문자열
                            var retval = new String("changeDate");
                            retval.callback = function () { thisObj.close(); };
                            // onMessagehandler로 보내는 return 객체
                            retval = $.extend(retval, result.Data);

                            thisObj.sendMessage(thisObj, retval);
                        });
                    }
                    else { // error check version
                        ecount.alert(String.format(ecount.resource.MSG01088, "", ""));
                    }
                }
            }.bind(this),
            error: this.setApiError.bind(this)
        });

    },

    // Common Api Error
    setApiError: function (jqXHR, Status, Error) {
        if (ecount.error && !$.isEmpty(Error.MessageDetail)) {
            ecount.error(Error.Message, {
                title: 'System Error ' + Status,
                trace: Error.MessageDetail
            });
        }
        else {
            if (Error.Message)
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