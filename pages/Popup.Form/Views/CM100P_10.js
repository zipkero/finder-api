window.__define_resource && __define_resource("LBL10862","LBL07887","LBL07465","LBL07886","LBL07885","LBL08168","MSG01136","BTN00065","BTN00007","BTN00008","LBL93033","MSG00676");
/****************************************************************************************************
1. Create Date : 2016.05.06
2. Creator     : Do Duc Trinh
3. Description : Action for User Customization > function Setup> Acct >Input Screen / Template> Default comments
4. Precaution  :
5. History     :
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM100P_10", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    /****************************************************************************************************
    * user opion Variables(Khai báo biến)
    ****************************************************************************************************/

    userPermit: "",

    SALE006: null,

    form_gubun: "",

    /**********************************************************************
    * page initialize (Khởi tạo trang)
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.userPermit = this.viewBag.Permission.Permit.Value;
        this.form_gubun = this.FORM_TYPE;
        if (this.FORM_TYPE != null && this.FORM_TYPE != undefined && this.FORM_TYPE != '') {
            var sale006 = this.viewBag.InitDatas.Sale006View;

            if (sale006 != null && sale006 != undefined) {
                this.SALE006.FORM_GUBUN = sale006.FORM_GUBUN;
                this.SALE006.DES6 = sale006.DES6;
            } else {
                this.SALE006.FORM_GUBUN = this.form_gubun;
                this.SALE006.DES6 = "";
            }
        } else if (this.userPermit == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10862, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.close();
        }
    },

    //Render
    render: function () {
        this._super.render.apply(this);
    },

    //Init properties (Khởi tạo thuộc tính, biến)
    initProperties: function () {
        this.SALE006 = {
            FORM_GUBUN: "",
            DES6: ""
        };
    },

    /**********************************************************************
    * UI Layout setting ()
    **********************************************************************/

    // Header Initialization
    //Khởi tạo header
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(String.format(this.FORM_TYPE == "AF060" ? ecount.resource.LBL07887 : this.FORM_TYPE == "AF050" ? ecount.resource.LBL07465 : this.FORM_TYPE == "AF040" ? ecount.resource.LBL07886 : ecount.resource.LBL07885, ecount.resource.LBL10862));
    },

    // Contents Initialization
    //Khởi tạo nội dung
    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            form = g.form();
        //If form_gubun not equal null then set value (Biến form_gubun khác null thì xét value)
        if (this.form_gubun != '' && this.form_gubun != null) {
            form
           .add(ctrl.define("widget.textarea", "DES6", "DES6", ecount.resource.LBL08168)
           .value(this.SALE006.DES6)
           .filter("maxlength", { message: String.format(ecount.resource.MSG01136, "300", "300"), max: 300 })
           .end());
            contents.add(form);
        }
    },

    // Footer Initialization(Khởi tạo footer)
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    // After the document loaded (Sau khi load data)
    onLoadComplete: function () {
        this.contents.getControl('DES6').setFocus(0);
    },

    /**********************************************************************
    * define action event listener (Định nghĩa các sự kiện save ,reset,close)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    // SAVE button click event(Sự kiện save)
    onFooterSave: function () {
        this.fnSave();
    },

    // RESET button click event(Sự kiện nhấn reset)
    onFooterReset: function (e) {
        this.contents.reset();
        //Reset TextArea
        this.contents.getControl('DES6').setValue(this.SALE006.DES6);
        var btnSave = this.footer.get(0).getControl("Reset");
        btnSave.setAllowClick();
    },


    // CLOSE button click event(Sự kiện đóng popup)
    onFooterClose: function () {
        this.close();
    },

    /**********************************************************************
    *  define hotkey event listener (Định nghĩa hotkey)
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    /**********************************************************************
    * define user function (Các chức năng người dùng định nghĩa)
    **********************************************************************/

    //Function save (Chức năng lưu)
    fnSave: function () {
        var btnSave = this.footer.get(0).getControl("Save");

        //Check authorizes (Kiểm tra quyền)
        if (this.userPermit == "R" || (this.userPermit == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93033, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        //Get value (Lấy giá trị)
        var txtDES6 = this.contents.getControl('DES6');
        var thisObj = this;
        var des6 = txtDES6.getValue();
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            thisObj.footer.get(0).getControl("Save").setAllowClick();
            return false;
        }

        if (this.form_gubun == '' || this.form_gubun == null) {
            btnSave.setAllowClick();
            return false;
        }

        //Call api save (Gọi api lưu)
        ecount.common.api({
            url: "/SelfCustomize/Config/SaveSale006CM",
            data: Object.toJSON({
                FORM_GUBUN: this.form_gubun,
                DES6: des6
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else if (result.Data == "1") {
                    txtDES6.showError(ecount.resource.MSG00676);
                    txtDES6.setFocus(0);
                }
                else {
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () {
                btnSave.setAllowClick();
            }
        });
    },
});