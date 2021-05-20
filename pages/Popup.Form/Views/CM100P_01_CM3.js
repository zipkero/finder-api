window.__define_resource && __define_resource("MSG02283","MSG02282","MSG05038","MSG02163","MSG11916","LBL06542","BTN00141","LBL03552","LBL06764","BTN00065","BTN00008","LBL06541","MSG01547","LBL07157");
/***********************************************************************************
 1. Create Date : 2016.12.22
 2. Creator     : inho
 3. Description : Search Settings(검색조건설정)
 4. Precaution  :
 5. History     : 2018.09.19(Hao) - Add form type AS020
 6. MenuPath    : Search Customer/Vendor popup(거래처검색팝업)>option(옵션)>Search Settings(검색조건설정)
 7. Old File    : CM100P_01.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.input", "CM100P_01_CM3", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    isFixedFooter: true,

    restoreMaps: null,

    validMaps: null,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("pluploader");
    },

    render: function ($parent) {        
            this._super.render.apply(this, arguments);        
    },

    initProperties: function () {
        var thisObj = this;
        //restore map
        thisObj.restoreMaps = new $.HashMap();
        thisObj.restoreMaps.set("SS910", function () {
            thisObj.contents.getControl("customCondition").get("condition1").setValue("CUST.CUST_NAME");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("CUST.BUSINESS_NO");
            thisObj.contents.getControl("customCondition").get("condition3").setValue("CUST.REMARKS_WIN");
            thisObj.contents.getControl("customCondition").get("condition4").setValue("");
        });
        thisObj.restoreMaps.set("SS900", function () {
            thisObj.contents.getControl("customCondition").get("condition1").setValue("SALE003.PROD_DES");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("SALE003.PROD_CD");
            thisObj.contents.getControl("customCondition").get("condition3").setValue("SALE003.REMARKS_WIN");
            thisObj.contents.getControl("customCondition").get("condition4").setValue("SALE003.BAR_CODE");
        });
        thisObj.restoreMaps.set("AS010", function () {
            thisObj.contents.getControl("customCondition").get("condition1").setValue("ACC002.GYE_CODE");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("ACC002.GYE_DES");
            thisObj.contents.getControl("customCondition").get("condition3").setValue("ACC002.SEARCH_MEMO");
            thisObj.contents.getControl("customCondition").get("condition4").setValue("");
        });
        thisObj.restoreMaps.set("AS020", function () {
            thisObj.contents.getControl("customCondition").get("condition1").setValue("ACC002.GYE_CODE");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("ACC002.GYE_DES");
            thisObj.contents.getControl("customCondition").get("condition3").setValue("ACC002.SEARCH_MEMO");
            thisObj.contents.getControl("customCondition").get("condition4").setValue("");
        });
        thisObj.restoreMaps.set("GP040", function () {
            thisObj.contents.getControl("customCondition").get("condition1").setValue("T.SITE_DES");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("T.UNAME");
            thisObj.contents.getControl("customCondition").get("condition3").setValue("T.ID");
            thisObj.contents.getControl("customCondition").get("condition4").setValue("");
        });
        thisObj.restoreMaps.set("PP605", function () {
            thisObj.contents.getControl("customCondition").get("condition1").setValue("T.SITE");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("T.EMP_KNAME");
            thisObj.contents.getControl("customCondition").get("condition3").setValue("T.EMP_CD");
            thisObj.contents.getControl("customCondition").get("condition4").setValue("");
        });
        thisObj.restoreMaps.set("SP911", function () {
            thisObj.contents.getControl("customCondition").get("condition1").setValue("BUSINESS_NO");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("CUST_NAME");
            thisObj.contents.getControl("customCondition").get("condition2").setValue("ID");
            thisObj.contents.getControl("customCondition").get("condition4").setValue("");
        });
        //validation map
        thisObj.validMaps = new $.HashMap();
        thisObj.validMaps.set("SS910", function (p) {
            if (!p.selectedItem.contains("CUST.BUSINESS_NO")) {
                thisObj.contents.getControl("customCondition").get("condition1").showError(ecount.resource.MSG02283);
                thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
                p.errcnt++;
            }
            return p.errcnt;
        });
        thisObj.validMaps.set("SS900", function (p) {
            if (!p.selectedItem.contains("SALE003.PROD_CD")) {
                thisObj.contents.getControl("customCondition").get("condition1").showError(ecount.resource.MSG02282);
                thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
                p.errcnt++;
            }
            return p.errcnt;
        });
        thisObj.validMaps.set("AS010", function (p) {
            if (!p.selectedItem.contains("ACC002.GYE_CODE")) {
                thisObj.contents.getControl("customCondition").get("condition1").showError(ecount.resource.MSG05038);
                thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
                p.errcnt++;
            }
            return p.errcnt;
        });
        thisObj.validMaps.set("AS020", function (p) {
            if (!p.selectedItem.contains("ACC002.GYE_CODE")) {
                thisObj.contents.getControl("customCondition").get("condition1").showError(ecount.resource.MSG05038);
                thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
                p.errcnt++;
            }
            return p.errcnt;
        });
        thisObj.validMaps.set("GP040", function (p) {

            if (!p.selectedItem.contains("T.UNAME")) {
                thisObj.contents.getControl("customCondition").get("condition2").showError(ecount.resource.MSG02163);
                thisObj.contents.getControl("customCondition").get("condition2").setFocus(0);
                p.errcnt++;
            }
            if (!p.selectedItem.contains("T.SITE_DES")) {
                thisObj.contents.getControl("customCondition").get("condition1").showError(ecount.resource.MSG11916);
                thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
                p.errcnt++;
            }

            return p.errcnt;
        });
        thisObj.validMaps.set("SP911", function (p) {

            if (!p.selectedItem.contains("BUSINESS_NO")) {
                thisObj.contents.getControl("customCondition").get("condition2").showError(ecount.resource.MSG02163);
                thisObj.contents.getControl("customCondition").get("condition2").setFocus(0);
                p.errcnt++;
            }

            return p.errcnt;
        });
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
        var thisObj = this;
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL06542);
    },

    onInitContents: function (contents) {
        
        var g = widget.generator,
            form = widget.generator.form(),
            form2 = widget.generator.form(),
            grid1 = g.grid(),
            grid2 = g.grid(),
            toolbar = g.toolbar(),
            ctrl = g.control();
        ctrl1 = g.control();
        ctrl2 = g.control();
        ctrl3 = g.control();
        ctrl4 = g.control();

        var thisObj = this;
        toolbar.attach(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").end());
        contents.add(widget.generator.subTitle().title(ecount.resource.LBL06542))
            .add(toolbar);

        form.useInputForm();
        var ctlCustom = ctrl.define("widget.custom", "customCondition", "CUSTOMCONDITION", ecount.resource.LBL06542);
        var option = new Array();
        option.push(["", ecount.resource.LBL03552]);
        Object.keys(this.viewBag.InitDatas.listdata).forEach(function (key, index) {
            option.push([key, thisObj.viewBag.InitDatas.listdata[key]]);
        });
        ctlCustom.addControl(ctrl1.define("widget.select", "condition1", "CONDITION1", ecount.resource.LBL06764).option(option)
            .select(this.getConditionValue(0)).end());
        ctlCustom.addControl(ctrl2.define("widget.select", "condition2", "CONDITION2", ecount.resource.LBL06764).option(option)
            .select(this.getConditionValue(1)).end());
        ctlCustom.addControl(ctrl3.define("widget.select", "condition3", "CONDITION3", ecount.resource.LBL06764).option(option)
            .select(this.getConditionValue(2)).end());
        ctlCustom.addControl(ctrl4.define("widget.select", "condition4", "CONDITION4", ecount.resource.LBL06764).option(option)
            .select(this.getConditionValue(3)).end());
        ctlCustom.columns(3, 3, 3, 3);

        form.add(ctlCustom.end());
        contents.add(form);

        this.resizeLayer(ecount.infra.getPageWidthFromConfig(), 450);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        if (!$.isNull(this.viewBag.InitDatas.LoadData) && this.viewBag.InitDatas.LoadData.length > 0)
            toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));

        footer.add(toolbar);
    },

    onInitControl: function (cid, control) { },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (e) {

        //if (this.FORM_TYPE == "GP040") {
        //    this.contents.getControl("customCondition").get("condition1").readOnly(true);
        //    this.contents.getControl("customCondition").get("condition2").readOnly(true);
        //}

        var thisObj = this;
        if (!e.unfocus) {
            if ($.isNull(this.viewBag.InitDatas.LoadData) || (!$.isNull(this.viewBag.InitDatas.LoadData) && this.viewBag.InitDatas.LoadData.length == 0)) {
                //set default value;
                this.onContentsRestore();
            }
            thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
        }
    },

    onFocusOutHandler: function (event) {
        //move next focus 다음 폼으로 이동
        var forms = this.contents.getForm();
        if (forms.length > 0) {
            if (event.__self == this.contents.getForm()[forms.length - 1]) {
                this.footer.getControl("save").setFocus(0);
            } else {
                for (var i = 0; i < forms.length; i++) {
                    if (event.__self == this.contents.getForm()[i] && (forms.length - 1) > i) {
                        this.contents.getForm()[i + 1].getControlByIndex(0).setFocus(0);
                        break;
                    }
                }
            }
        }
    },

    onFocusOutControlHandler: function (control) { },

    onChangeControl: function (control, data) { },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/


    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //Apply 적용 버튼
    onFooterSave: function () {

        var thisObj = this;
        var errcnt = 0;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (permit != "W") {
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL06542, PermissionMode: "W" }]).fullErrorMsg);
            errcnt++;
        }
        //유효성 체크
        if (errcnt == 0 && thisObj.contents.getControl("customCondition").get("condition1").getValue() == "" && thisObj.contents.getControl("customCondition").get("condition2").getValue() == ""
            && thisObj.contents.getControl("customCondition").get("condition3").getValue() == "" && thisObj.contents.getControl("customCondition").get("condition4").getValue() == "") {
            thisObj.contents.getControl("customCondition").get("condition1").showError(ecount.resource.LBL06541);
            thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
            errcnt++;
        }
        var selectedItem = new Array();
        for (var i = 1; i <= 4; i++) {
            if (thisObj.contents.getControl("customCondition").get("condition" + i.toString()).getValue() != "")
                selectedItem.push(thisObj.contents.getControl("customCondition").get("condition" + i.toString()).getValue());
        }

        if (errcnt == 0 && selectedItem.length != thisObj.getLenghtUnique(selectedItem).count()) {

            if (thisObj.FORM_TYPE == "GP040") {
                var indexDuplicate = (this.getIndextDuplicate(selectedItem) + 1).toString();
                thisObj.contents.getControl("customCondition").get("condition" + indexDuplicate).showError(ecount.resource.MSG01547);
                thisObj.contents.getControl("customCondition").get("condition" + indexDuplicate).setFocus(0);
            }
            else {
                thisObj.contents.getControl("customCondition").get("condition1").showError(ecount.resource.MSG01547);
                thisObj.contents.getControl("customCondition").get("condition1").setFocus(0);
            }
            errcnt++;
        }
        //개별 유효성 체크
        if (!["GP040", "SS900", "SS910", "AS010", "AS020", "SP911"].contains(thisObj.FORM_TYPE)) {
            if (errcnt == 0 && thisObj.validMaps.has(thisObj.FORM_TYPE)) {
                errcnt = thisObj.validMaps.get(thisObj.FORM_TYPE)({ selectedItem: selectedItem, errcnt: errcnt });

            }
        }
            

        if (errcnt > 0) {
            thisObj.footer.getControl('save').setAllowClick();
        } else {
            thisObj.setShowProgressbar();
            var detail = new Array();
            for (var i = 1; i <= 4; i++) {
                detail.push({ FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: 0, COL_SEQ: i, COL_CD: thisObj.contents.getControl("customCondition").get("condition" + i.toString()).getValue() });
            }
            ecount.common.api({
                url: "/SVC/Common/Form/SaveSearchCondition",
                data: Object.toJSON({ Request: { Data: { FormTypeSeqKey: { FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: 0 }, CofmFormoutsetDetailMusts: detail } } }),
                success: function (result) {
                    thisObj.setHideProgressbar();
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        var message = {
                            callback: thisObj.close.bind(thisObj)
                        };
                        thisObj.sendMessage(thisObj, message);
                    }
                }
            });
        }
    },

    getLenghtUnique: function (selectedItem) {
        return $.grep(selectedItem, function (el, index) {
            return index === $.inArray(el, selectedItem);
        });
    },

    getIndextDuplicate: function (selectedItem) {

        var count = 0;
        for (var i = 0; i < selectedItem.length; i++) {
            for (var j = i + 1; j < selectedItem.length; j++) {
                if (selectedItem[i] === selectedItem[j]) {
                    count = j;
                }
            }
        }
        return count;
    },

    //restore 복원
    onContentsRestore: function (event) {
        var thisObj = this;
        if (thisObj.restoreMaps.has(thisObj.FORM_TYPE))
            thisObj.restoreMaps.get(thisObj.FORM_TYPE)();
    },

    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //History 히스토리
    onFooterHistory: function (e) {
        var thisObj = this;
        var param = {
            width: 450,
            height: 150,
            lastEditTime: thisObj.viewBag.InitDatas.LoadData[0].WRITE_DT,
            lastEditId: thisObj.viewBag.InitDatas.LoadData[0].WRITE_ID
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        })
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    //F8 Event
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert() && !this.saveLoading.locked)
            this.onFooterSave();
    },

    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //default value 기본값
    getConditionValue: function (i) {
        if (!$.isNull(this.viewBag.InitDatas.LoadData) && this.viewBag.InitDatas.LoadData.length > i)
            return this.viewBag.InitDatas.LoadData[i].COL_CD;

        return "";
    },

    //show progress bar 진행바 보이기
    setShowProgressbar: function () {
        this.saveLoading.locked = true;
        this.showProgressbar(true);
    },

    //hide progress bar 진행바 감추기
    setHideProgressbar: function () {
        this.saveLoading.locked = false;
        this.hideProgressbar();
        this.footer.getControl('save').setAllowClick();
    },
});