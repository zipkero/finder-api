window.__define_resource && __define_resource("LBL00851","MSG00267","BTN00008");
/**************************************************************************************************** 
1. Create Date : 20??.??.?? 
2. Creator     : Unknown
3. Description : None
4. Precaution  : 
5. History     : 
6. Old file    : Unknown
* ***************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "EGA001P_05", {

    resourceMsg: '',
    resourceCD: '',

    resourceHeaderTitleMsg: '',
    resourceHeaderTitleCD: '',

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        this.resourceCD = this.ResourceCode;
        this.resourceMsg = this.ResourceMessage;

        this.resourceHeaderTitleCD = this.ResourceHeaderTitleCode;
        this.resourceHeaderTitleMsg = this.ResourceHeaderTitleMessage;
    },

    initProperties: function () {

    },

    render: function () {
        this._super.render.apply(this);
    },
    /**********************************************************************
    *  set widget options
    **********************************************************************/
    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {

        var title = this.resource.LBL00851;
        if (this.resourceHeaderTitleCD != '')
            title = this.resourceHeaderTitleMsg;

        header.notUsedBookmark()
              .setTitle(title);
    },
    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            ctrl = generator.control(),
            control = generator.control();

        var msg = this.resource.MSG00267;

        if (this.resourceCD != '')
            msg = this.resourceMsg;

        contents.add(ctrl.define("widget.label", "BUSINESS_NO", "BUSINESS_NO").label(msg).hasWrapperSet(false));
    },
    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();        
        toolbar
            .attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
        footer.add(toolbar);
    },
    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //닫기버튼
    onFooterClose: function () {        
        this.close();
        return false;
    }
});
