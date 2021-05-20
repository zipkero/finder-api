window.__define_resource && __define_resource("LBL00435","MSG05714");
/****************************************************************************************************
1. Create Date : 2015.11.19
2. Creator     : 소병용
3. Description : 업데이트중입니다. 
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "Maintenance", {
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    render: function () {
        this._super.render.apply(this);
    },
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL00435)
    },

    onInitContents: function (contents, resource) {
        
    },
    onInitFooter: function (footer, resource) {
    },

    onLoadComplete: function () {
        //팝업으로 열릴 경우 리사이즈
        if (this.parentPageID) {
            this.resizeLayer(760, 400);
        }
        $("#divContent").html(ecount.resource.MSG05714);

        $("#divBlock").css("display", "block");
    }
});