window.__define_resource && __define_resource("LBL07157","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.
2. Creator     : 
3. Description : 최종수정이력 (Last Edit History)
4. Precaution  : 
5. History     : [2015-09-03] BSY : 코드 리펙토링
6. MenuPath    : 최종수정이력 (Last Edit History)
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM100P_31", {

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
    }, 

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL07157);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    }
});
