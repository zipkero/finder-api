window.__define_resource && __define_resource("LBL10446","LBL80147","LBL01595","MSG70228","MSG00550","MSG01140","LBL01420","MSG01423","LBL01809","LBL03297","LBL01423","LBL10471","MSG70069","MSG00297","LBL10447","LBL10448","LBL10472","LBL04421","LBL02980","LBL02509","MSG00923","LBL35238","LBL03780","LBL10449","LBL04417","LBL03589","LBL10451","MSG08108","BTN00065","BTN00008","MSG02158","MSG00140","MSG02421","MSG00309","MSG00008","MSG09029","MSG05850");
/****************************************************************************************************
1. Create Date : 2016.11.11
2. Creator     : LeNguyen
3. Description :  User Customization > User Setup > Register User
4. Precaution  : 
5. History     : 2020-08-25 최준영 - 용량알림 사용안함 제거
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMM002P_23", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    selectedDomain: null,
    domainData: [],
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.selectedDomain = {};
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
   * UI Layout setting
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
   ****************************************************************************************************/

    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        var self = this;

        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        header.setTitle(ecount.resource.LBL10446);
        header.notUsedBookmark();
    },
    
    onPreInitContents: function (request) {
        request.add({
            isGMC: true,
            notUseCn: true,
            url: '/Service/CustomerCenter/GetListWebMailDomain',
            data: {
                COM_CODE: this.comCode
            }
        });
    },

    //본문 옵션 설정(Contents Option Setup)
    onInitContents: function (contents, resource, apiResult) {
        var g = widget.generator,
         ctrl = g.control(),
         form = g.form()
        ;
        var isExisted = 0;
        var opts1 = [], opts2 = [], opts3 = [], opts4 = [], selectedValue = '', selectZone = '';
        var lst = this.viewBag.InitDatas.langList;
        lst.forEach(function (item) {
            opts1.push([item.LAN_TYPE, item.LAN_DES]);
        });

        var lst2 = this.listTimeZone;
        for (var i = 0, len = lst2.length; i < len; i++) {
            opts2.push([lst2[i].Id, lst2[i].Value]);
        }

        for (var i = 1 ; i < 51 ; i++) {
            opts3.push([i * 1073741824, i + "GB"]);
        }

        this.domainData = apiResult.Data;

        if (this.domainData.length > 0) {
            selectZone = this.domainData[0].TIME_ZONE;
        }

        this.selectedDomain = this.domainData[0];

        form.template("register")
            .add(ctrl.define("widget.custom", "Idmail", "Idmail", ecount.resource.LBL80147).end())
            .add(ctrl.define("widget.input.general", "Name", "Name", ecount.resource.LBL01595)
                .dataRules(["required"], ecount.resource.MSG70228)
                .filter("regexp", { regexp: "[<>&?'\":/=\\\\]", message: ecount.resource.MSG00550 })
                .filter("maxlength", { message: String.format(ecount.resource.MSG01140, "40"), max: 40 }).end())
            .add(ctrl.define("widget.input.password", "Password", "Password", ecount.resource.LBL01420)
                .dataRules(["required"], ecount.resource.MSG01423)
                .passwordLevel(this.selectedDomain && this.selectedDomain.PASSWD_LEVEL || "1")
                .setOptions({
                    passWordValidationInfo: [
                                ["", ecount.resource.LBL01809],
                                [this.selectedDomain && this.selectedDomain.MASTER_DOMAIN || "", ecount.resource.LBL03297]  // this.selectedDomain.MASTER_DOMAIN
                    ]
                })
                .maxLength(15)
                .end())
            .add(ctrl.define("widget.input.password", "ConfPassword", "ConfPassword", ecount.resource.LBL01423)
                .dataRules(["required"], ecount.resource.MSG01423)
                .maxLength(15)
                .end())
            .add(ctrl.define("widget.input", "Email", "Email", ecount.resource.LBL10471)
                .dataRules(["required"], ecount.resource.MSG70069)
                .filter('maxbyte', { message: String.format(ecount.resource.MSG00297, '100'), max: 100 }).end())
            .add(ctrl.define("widget.select", "MaxStorage", "MaxStorage", ecount.resource.LBL10447).option(opts3).select((2 * 1073741824)).end())
            .add(ctrl.define("widget.select", "Storage", "Storage", ecount.resource.LBL10448).option([[50, "50%"], [60, "60%"], [70, "70%"], [80, "80%"], [90, "90%"]]).select(70).end())
            .add(ctrl.define("widget.multiCode.departmentLevelGroup", "Department", "Department", ecount.resource.LBL10472).end())
            .add(ctrl.define("widget.select", "Language", "Language", ecount.resource.LBL04421).option(opts1)
                .select(this.prodView ? this.prodView.LAN_TYPE : ecount.user.LAN_TYPE).end())
            .add(ctrl.define("widget.select", "TimeZone", "TimeZone", ecount.resource.LBL02980).option(opts2).select(selectZone).end())
            .add(ctrl.define("widget.input", "Phone", "Phone", ecount.resource.LBL02509)
                .filter('maxbyte', { message: String.format(ecount.resource.MSG00297, '20'), max: 20 })
                .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923, reg: '' }).end())
            .add(ctrl.define("widget.input.general", "ZipCode", "ZipCode", ecount.resource.LBL35238).end())
            .add(ctrl.define("widget.input.general", "Address", "Address", ecount.resource.LBL03780).end())
            .add(ctrl.define("widget.radio", "ServiceType ", "ServiceType", ecount.resource.LBL10449).label([ecount.resource.LBL04417, ecount.resource.LBL03589]).value(["1", "0"]).select("1").end())
            .add(ctrl.define("widget.radio", "AdminType", "AdminType", ecount.resource.LBL10451).label([ecount.resource.LBL04417, ecount.resource.LBL03589]).value(["1", "0"]).select("0").end());

        contents.add(form);
    },

    onInitControl: function (cid, control) {
        var g = widget.generator,
            ctrl = g.control();

        switch (cid) {
            case "Idmail":
                var option = [];
                this.domainData.forEach(function (item) {
                    option.push([item.MASTER_DOMAIN, item.MASTER_DOMAIN]);
                });

                control.columns(4, 1, 7).noInlineDivider()
                    .addControl(ctrl.define("widget.input.general", "txtWebMailId", "txtWebMailId").inline()
                    .dataRules(["required"], ecount.resource.LBL01809)
                    .filter('maxbyte', { message: String.format(ecount.resource.MSG01140, '40'), max: 40 })
                    .filter("regexp", { regexp: "[^-_a-zA-Z0-9\.]", message: ecount.resource.MSG08108 }))
                    .addControl(ctrl.define("widget.label", "label1", "label1").label('@'))
                    .addControl(ctrl.define("widget.select", "drdWebMailDomain", "drdWebMailDomain").option(option)).end();
                break;
        }
    },

    onChangeControl: function (control, data, command) {
        switch (control.cid) {
            case "drdWebMailDomain":
                for (var i = 0; i < this.domainData.count() ; i++) {
                    if (this.domainData[i].MASTER_DOMAIN == control.value) {
                        this.selectedDomain = this.domainData[i];
                    }
                }
                this.contents.getControl("TimeZone").setValue(this.selectedDomain.TIME_ZONE);
                this.contents.getControl("Department").removeAll();

                break;
        }
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function (e) {
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    onFooterSave: function () {
        if (this.PermissionType != '1') {
            ecount.alert(String.format("{0}<br/><{1}", ecount.resource.MSG00140, ecount.resource.MSG02421));
            return;
        }

        var self = this;
        var invalid = self.contents.validate();
        var invalidControl = {};
        var targetControl = {};

        if (invalid.result.length > 0) {
            isError = true;
            invalidControl = self.contents.getControl(invalid.result[0][0].control.id);
            if (invalidControl) {   //현재 탭에 없을때 
                targetControl = invalidControl;
            }
            else {
                self.contents.changeTab(invalid.tabId, false);
                targetControl = invalid.result[0][0].control;
            }
            targetControl.setFocus(0);
            return false;
        }

        var ctrlObj = this.contents.getControl("Password");
        if (ctrlObj.getValue() != this.contents.getControl("ConfPassword").getValue()) {
            this.contents.getControl("ConfPassword").showError(ecount.resource.MSG00309);
            this.contents.getControl("ConfPassword").setFocus(0);
            return false;
        }

        var ctrlObj2 = this.contents.getControl("Email");
        if (!ecount.validator.check("email", ctrlObj2.getValue())) {
            ctrlObj2.showError(ecount.resource.MSG00008);
            ctrlObj2.setFocus(0);
            return;
        }

        // Check Email Id regx
        var tempIdMail = this.contents.getControl("Idmail");
        var regExp = /^[A-Za-z0-9\_\-\\.]{1,20}$/;

        if (!regExp.test(tempIdMail.get("txtWebMailId").getValue())) {
            tempIdMail.showError(ecount.resource.MSG00008);
            tempIdMail.setFocus(0);
            return false;
        }

        var addParam = {
            Domain: this.contents.getControl("Idmail").get("drdWebMailDomain").getValue(),
            MailCode: this.selectedDomain.MAIL_CODE,
            Id: this.contents.getControl("Idmail").get("txtWebMailId").getValue(),
            Locale: this.selectedDomain.LOCALE
        }

        // 웹메일 아이디와 복구 Email은 다르게 설정해야 합니다.
        var ctrlObj3 = this.contents.getControl("Email");
        var newEmailID = addParam.Id + "@" + addParam.Domain;
        if (ctrlObj3.getValue().toLowerCase() == newEmailID.toLowerCase()) {
            ctrlObj3.showError(ecount.resource.MSG09029);
            ctrlObj3.setFocus(0);
            return;
        }

        var mailManagerDto = this.contents.serialize().merge();
        var SaveParam = $.extend({}, mailManagerDto, addParam);

        var param = {
            mailManagerDto: SaveParam
        };

        self.showProgressbar(true);

        ecount.common.api({
            url: "/SelfCustomize/User/AddMailManager",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200" || (result.Data != null && result.Data != "OK")) {
                    ecount.alert(ecount.resource.MSG05850);
                }
                else {
                    self.sendMessage(self, {});
                    self.setTimeout(function () {
                        self.close();
                    }, 0);
                }

            },
            complete: function () {
                self.hideProgressbar(true);
            }
        });
    },

    onPopupHandler: function (control, config, handler) {
        switch (control.id.toUpperCase()) {
            case "DEPARTMENT":
                $.extend(config, {
                    mailCode: this.selectedDomain.MAIL_CODE,
                    popupType: false
                });
                break;
        }
        handler(config);
    },

    onPreInitPopupHandler: function (control, keyword, config, response) {
        var flag = false;
        switch (control.id.toUpperCase()) {
            case "DEPARTMENT":
                config.isOnePopupClose = true;

                break;
        }
        return flag;
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    }
});
