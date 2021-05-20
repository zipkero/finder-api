window.__define_resource && __define_resource("LBL10471","BTN00026","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.10.20
2. Creator     : 정명수
3. Description : SMS > 보내기 > 사업자인증
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "RestoreEmailNotification", {
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    initProperties: function () {

    },

    onInitHeader: function (header) {
        header
            .setTitle(ecount.resource.LBL10471)
            .notUsedBookmark();
    },

    onInitContents: function (contents) {
      
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            control = widget.generator.control();

        toolbar.addLeft(control.define("widget.button", "change").label(ecount.resource.BTN00026).end());
        toolbar.addLeft(control.define("widget.button", "close").label(ecount.resource.BTN00008).css("btn btn-default").end());

        footer.add(toolbar);
    },

    onFooterChange: function () {
        var param = {};
        this.onAllSubmitSelf("/ECERP/ESC/ESC003P_02?IsRestoreEmail=Y", param);
    },

    onLoadComplete: function (event) {

    },

    onFooterClose: function () {
        this.close();
    }
});