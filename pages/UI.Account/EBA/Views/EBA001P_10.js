window.__define_resource && __define_resource("LBL00495","LBL00478","LBL00703","LBL03552","LBL03553","LBL03554","LBL01826","LBL08097","LBL03557","LBL02739","LBL02740","BTN00065","BTN00008");
ecount.page.factory("ecount.page.popup.type2", "EBA001P_10", {

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/

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

    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(this.viewBag.Title)  
    },

    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form1 = generator.form()

        form1
            .template("register")
            .add(ctrl.define("widget.label", "lblGyeCode", "lblGyeCode", resource.LBL00495).label(this.GYE_CODE).end())
            .add(ctrl.define("widget.label", "lblGyeDes", "lblGyeDes", resource.LBL00478).label(this.viewBag.InitDatas.AccountCodeData.Data.GYE_DES).end());

        if (this.PAGE_FLAG == "1") {
            form1.add(ctrl.define("widget.select", "ddlGubun", "ddlGubun", resource.LBL00703).option([
                    ["00", resource.LBL03552],
                    ["01", resource.LBL03553],
                    ["02", resource.LBL03554],
                    ["03", resource.LBL01826],
                    ["32", resource.LBL08097],
                    ["31", resource.LBL03557],
            ]).select(this.viewBag.InitDatas.AccountCodeData.Data.SUB_GUBUN).end())
        } else {
            form1.add(ctrl.define("widget.select", "ddlGubun", "ddlGubun", resource.LBL00703).option([
                    ["0", resource.LBL03552],
                    ["1", resource.LBL02739],
                    ["2", resource.LBL02740],
            ]).select(this.viewBag.InitDatas.AccountCodeData.Data.BD_GUBUN).end())
        }
        contents.add(form1)
    },

    onChangeControl: function (control, data) {
        console.log(control.cid + " " + control.cindex)
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));

        footer.add(toolbar);
    },


    /**********************************************************************
    * define common event listener
    **********************************************************************/
    onLoadComplete: function () {

    },

    //Before Event Handle Event
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);   
        return true;
    },

    //Footer Save Event
    onFooterSave: function (e) {
        var thisObj = this;
        var form = this.contents.serialize();
        var formData = {
            PAGE_FLAG: thisObj.PAGE_FLAG,
            GYE_CODE: thisObj.GYE_CODE,
            GUBUN: form.result.ddlGubun
        };
        ecount.common.api({
            url: "/Account/Basic/UpdateGubunAccount",
            async: true,
            data: Object.toJSON(formData),
            success: function (result) {
                console.log(result);
                if (result.Status != "200") {
                    runSuccessFunc = result.Status == "202";
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    runSuccessFunc = true;
                    //부모창에 값 던짐
                    thisObj.sendMessage(thisObj, "EBA001P_10");
                    this.setTimeout(function () { thisObj.close(); }, 0)
                }
            }.bind(this)
        });
    },

    //Footer Reset Event
    onFooterSaveApply: function () {

    },


    //Footer Close Event
    onFooterClose: function () {
        this.close();
        return false;
    },


    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/


    /**************************************************************************************************** 
    * define action event listener 
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/


    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/
    //F8 Event
    ON_KEY_F8: function () {
       this.onFooterSave();
    },

    //Enter Key Event
    ON_KEY_ENTER: function (e, target) {
        this.onFooterSave();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

});
