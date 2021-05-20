window.__define_resource && __define_resource("LBL12189","LBL12187","LBL12188","LBL01418","LBL00778","LBL01141","LBL00227","LBL00228","BTN85017","LBL03366","LBL12186","LBL12191","BTN00008","LBL04799","LBL05102");
/****************************************************************************************************
1. Create Date : 2016.06.06
2. Creator     : 이정민
3. Description : Email 발송완료
4. Precaution  :
5. History     : 2019.1.31(Jang Aram) - Test Progress 60595
                 2019.10.16(PARK HEUNGSAN) - ADD CERTIFICATE
                 2020.10.30(정준호) - A20_02943 외부알림 1차
****************************************************************************************************/

ecount.page.factory('ecount.page.popup.type2', 'ES300P_03', {

    /*******************************************DEC_AMT********************************************************* 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    gridRowData: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(this.TITLE || ecount.resource.LBL12189);
    },

    onInitContents: function (contents, resource) {
        var g = widget.generator,
            grid = g.grid()
            ;

        var columnList = [];

        var allEmailEmpty = true, allSmsEmpty = true, allFaxEmpty = true;

        this.RESULT_INFO.forEach(function (v) {
            if (!$.isEmpty(v.EMAIL_LIST))
                allEmailEmpty = false;

            if (!$.isEmpty(v.SMS_LIST))
                allSmsEmpty = false;

            if (!$.isEmpty(v.FAX_LIST))
                allFaxEmpty = false;

            if (!allEmailEmpty && !allSmsEmpty && !allFaxEmpty)
                return;
        });

        if (this.ReceiveInfoTabType == "1") {
            columnList.push({ propertyName: "RECEIVER_CD", id: "RECEIVER_CD", title: ecount.resource.LBL12187, width: 100, align: "center", controlType: "widget.label", isHideColumn: (this.FORM_TYPE == "GH210") ? true : false });
            columnList.push({ propertyName: "RECEIVER_NM", id: "RECEIVER_NM", title: ecount.resource.LBL12188, width: 150, align: "center", controlType: "widget.label" });
            columnList.push({ propertyName: "REMARKS", id: "REMARKS", title: ecount.resource.LBL01418, width: 180, align: "left", controlType: "widget.label" });
            columnList.push({ propertyName: "TOT_AMT", id: "TOT_AMT", title: ecount.resource.LBL00778, width: 100, align: "right", isHideColumn: (this.FORM_TYPE == "CUSTOMER" || this.FORM_TYPE == "GH210") ? true : false, controlType: "widget.label" });
        } else if (this.RECEIVE_FORM_TYPE == "TH080") {
            columnList.push({ propertyName: "RECEIVER_CD", id: "RECEIVER_CD", title: ecount.resource.LBL12187, width: 100, align: "center", controlType: "widget.label" });
            columnList.push({ propertyName: "RECEIVER_NM", id: "RECEIVER_NM", title: ecount.resource.LBL12188, width: 150, align: "center", controlType: "widget.label" });
            columnList.push({ propertyName: "REMARKS", id: "REMARKS", title: ecount.resource.LBL01418, width: 180, align: "left", controlType: "widget.label" });
        } else {
            columnList.push({ propertyName: "REMARKS", id: "REMARKS", title: ecount.resource.LBL01418, width: 180, align: "left", controlType: "widget.label" });
        }

        columnList.push({ propertyName: 'EMAIL_LIST', id: 'EMAIL_LIST', title: ecount.resource.LBL01141, width: 220, align: "center", controlType: 'widget.label', isHideColumn: this.MAIL_SEND_YN != "Y" || allEmailEmpty });
        columnList.push({ propertyName: "EMAIL_SEND_STATE", id: "EMAIL_SEND_STATE", title: ecount.resource.LBL12189, width: 100, align: "center", controlType: "widget.label", isHideColumn: this.MAIL_SEND_YN != "Y" || allEmailEmpty });
        columnList.push({ propertyName: 'SMS_LIST', id: 'SMS_LIST', title: ecount.resource.LBL00227, width: 220, align: "center", controlType: 'widget.label', isHideColumn: this.SMS_SEND_YN != "Y" || allSmsEmpty });
        columnList.push({ propertyName: "SMS_SEND_STATE", id: "SMS_SEND_STATE", title: ecount.resource.LBL00228.concat(ecount.resource.BTN85017, ecount.resource.LBL03366), width: 100, align: "center", controlType: "widget.label", isHideColumn: this.SMS_SEND_YN != "Y" || allSmsEmpty });
        columnList.push({ propertyName: 'FAX_LIST', id: 'FAX_LIST', title: ecount.resource.LBL12186, width: 220, align: "center", controlType: 'widget.label', isHideColumn: this.FAX_SEND_YN != "Y" || allFaxEmpty });
        columnList.push({ propertyName: "FAX_SEND_STATE", id: "FAX_SEND_STATE", title: ecount.resource.LBL12191, width: 100, align: "center", controlType: "widget.label", isHideColumn: this.FAX_SEND_YN != "Y" || allFaxEmpty });

        grid
            .setColumns(columnList)
            .setRowData(this.RESULT_INFO)
            .setCustomRowCell('TOT_AMT', this.setGridTotAmt.bind(this))
            .setCustomRowCell('EMAIL_SEND_STATE', this.setGridEmailSendState.bind(this))
            .setCustomRowCell('SMS_SEND_STATE', this.setGridSmsSendState.bind(this))
            .setCustomRowCell('FAX_SEND_STATE', this.setGridFaxSendState.bind(this))

        contents.addGrid("dataGrid" + this.pageID, grid)

    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        toolbar
            .addLeft(ctrl.define('widget.button', 'Close').label(ecount.resource.BTN00008));

        footer.add(toolbar); //toolbar add[footer 영역의 닫기]
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    setGridTotAmt: function (value, rowItem) {
        var option = {};

        if (rowItem.TOT_AMT) {
            var totAmt = String.fastFormat(rowItem.TOT_AMT, {
                fractionLimit: ecount.config.company.DEC_AMT,
                removeFractionIfZero: false
            });

            if (!$.isEmpty(rowItem["TOT_AMT_F"]) && Decimal(rowItem["TOT_AMT_F"]) > 0) {
                var saleAmt = String.fastFormat(rowItem.TOT_AMT_F, {
                    fractionLimit: ecount.config.company.DEC_AMT,
                    removeFractionIfZero: false
                });

                totAmt += "<br />(" + saleAmt + ")";
            }

            option.data = totAmt;
        }
        return option;
    },

    setGridEmailSendState: function (value, rowItem) {
        var option = {};

        if (this.MAIL_SEND_YN == "Y") {
            if (rowItem.EMAIL_SEND_STATE == "0") {
                option.data = ecount.resource.LBL04799; //발송실패
            } else if (rowItem.EMAIL_SEND_STATE == "1") {
                option.data = ecount.resource.LBL05102; //발송성공
            } else {
                option.data = "";
            }
        } else {
            option.data = "";
        }

        return option;
    },

    setGridSmsSendState: function (value, rowItem) {
        var option = {};

        if (this.SMS_SEND_YN == "Y") {
            if (rowItem.SMS_SEND_STATE == "0") {
                option.data = ecount.resource.LBL04799; //발송실패
            } else if (rowItem.SMS_SEND_STATE == "1") {
                option.data = ecount.resource.LBL05102; //발송성공
            } else {
                option.data = "";
            }
        } else {
            option.data = "";
        }

        return option;
    },

    setGridFaxSendState: function (value, rowItem) {
        var option = {};

        if (this.FAX_SEND_YN == "Y") {
            if (rowItem.FAX_SEND_STATE == "0") {
                option.data = ecount.resource.LBL04799; //발송실패
            } else if (rowItem.FAX_SEND_STATE == "1") {
                option.data = ecount.resource.LBL05102; //발송성공
            } else {
                option.data = "";
            }
        } else {
            option.data = "";
        }

        return option;
    },


    onBeforeClosePopup: function () {
        this.checkRedrawGridParent()
        return true;
    },

    onClosedPopupHandler: function (page, target) {
        this.onFooterClose()
    },
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ 'on' + target + control id ]
    ****************************************************************************************************/
    onFooterClose: function () {
        this.checkRedrawGridParent()
        ecount.page.popup.prototype.close.call(this);
        if (this.isFromApp) {
            window.open('mobile/close');
        }
    },

    checkRedrawGridParent: function () {
        var callFromPrintPage = false;
        ["ESD005R", "ESD002R", "ESD007R", "ESG005R", "ESQ100P_02", "EBZ032P_07"].forEach((function (item) {
            if (this.__ecPageID.indexOf(item) >= 0) callFromPrintPage = true;
        }).bind(this));
        if (callFromPrintPage == true && this.getParentInstance(this.__ecPageID)) {
            if (this.getParentInstance(this.__ecPageID).isSendMailFax == false) {
                this.getParentInstance(this.__ecPageID).isSendMailFax = true;
            }
            this.getParentInstance(this.__ecPageID).eventPropagate && this.getParentInstance(this.__ecPageID).eventPropagate("onSendMailFaxComplete");
        }

        if (["ESD005M", "ESD002M", "ESD007M", "ESG005M", "ESQ100M", "EBG006M", "EPC003M"].contains(this.parentPageID))
            this.getParentInstance(this.parentPageID) && this.getParentInstance(this.parentPageID)._ON_REDRAW();
    }

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

});