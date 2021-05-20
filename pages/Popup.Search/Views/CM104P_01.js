window.__define_resource && __define_resource("LBL09999","LBL06434","LBL10579","MSG01140","MSG00226","LBL01743","MSG05467","BTN00065","BTN00008","BTN00033","LBL07157","MSG00299");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : self-customizing > form setting > Frequently Used Phrases
 4. Precaution  :
 5. History     : 
 6. Old File    : 
 7. New File    : FM065P_01
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM104P_01", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    editFlag: false,
    off_key_esc: true,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(['I'].contains(this.editFlag) ? String.format(ecount.resource.LBL09999, this.titlename) : String.format(ecount.resource.LBL06434, this.titlename));
    },

    // Contents Initialization
    onInitContents: function (contents) {
        debugger;
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form = generator.form();

        form.template("register")
            .add(ctrl.define("widget.input.general", "txt", "TXT", ecount.resource.LBL10579)
                .filter("maxlength", { message: String.format(ecount.resource.MSG01140, (this.COL_CD == "u_txt1" ? "2000" : "200")), max: (this.COL_CD == "u_txt1" ? 2000 : 200) })
                .dataRules(['required'], ecount.resource.MSG00226).popover(ecount.resource.MSG00226).value(this.TXT).end());

        form.add(ctrl.define("widget.input", "sortOrder", "SORT_ORDER", ecount.resource.LBL01743)
                .popover(ecount.resource.MSG05467)
                .numericOnly(3, 0, null, null, true).value(this.SORT_ORDER).end());

        contents.add(form);
    },
    onChangeControl: function (control) {


    },
    // Footer Initialization
    onInitFooter: function (footer) {
        var tool = widget.generator.toolbar(),
             ctl = widget.generator.control();

        tool.addLeft(ctl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce());
        tool.addLeft(ctl.define("widget.button", "close").label(ecount.resource.BTN00008));
        if (['M'].contains(this.editFlag)) {
            tool.addLeft(ctl.define("widget.button", "delete").label(ecount.resource.BTN00033));
            tool.addLeft(ctl.define("widget.button", "history").label("H"));
        }

        footer.add(tool);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        if (!e.unfocus) {
            this.contents.getControl("txt").setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // Save button click event
    onFooterSave: function () {
        var thisObj = this;
        var errList = new Array();

        var data = {
            EditFlag: this.editFlag,
            FORM_TYPE: this.FORM_TYPE,
            COL_CD: this.COL_CD,
            TXT: this.contents.getControl('txt').getValue(),
            SORT_ORDER: this.contents.getControl('sortOrder').getValue(),
            SEQ: this.SEQ
        }
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            thisObj.contents.getControl("txt").setFocus(0);
            thisObj.footer.getControl("save").setAllowClick();
            return;
        }
        ecount.common.api({
            url: ['I'].contains(this.editFlag) ? "/Inventory/Common/InsertCofmUserTxt" : "/Inventory/Common/UpdateCofmUserTxt",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    thisObj.setTimeout(function () {
                        var message = {
                            callback: thisObj.close.bind(thisObj)
                        };
                        thisObj.sendMessage(thisObj, message);
                    }, 0);
                }
            },
            complete: function () {
                thisObj.footer.getControl("save").setAllowClick();
            }
        });
    },

    // History button click event    
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.wDate,
            lastEditId: this.wID
        };
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },

    // Delete button click event    
    onFooterDelete: function (e) {
        thisObj = this;
        var formdata = {
            FORM_TYPE: this.FORM_TYPE,
            COL_CD: this.COL_CD,
            SEQ: this.SEQ
        };

        var DeleteLists = new Array();
        DeleteLists.push(formdata);
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Inventory/Common/DeleteCofmUserTxt",
                    data: Object.toJSON(DeleteLists),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            thisObj.setTimeout(function () {
                                var message = {
                                    callback: thisObj.close.bind(thisObj)
                                };
                                thisObj.sendMessage(thisObj, message);
                            }, 0);
                        }
                    }
                });
            }
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F2: function () {

    },

    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterSave();
    },

    ON_KEY_TAB: function () {
    },

    ON_KEY_ENTER: function () {
    },

    onFocusOutHandler: function (event) {
        if (event.target == "contents") {
            this.footer.getControl('save').setFocus(0);
        }
    },

});
