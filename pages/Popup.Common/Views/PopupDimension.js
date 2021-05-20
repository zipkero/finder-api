window.__define_resource && __define_resource("LBL01593","LBL12323","MSG07834","BTN00069","BTN00008");
/****************************************************************************************************
1. Create Date : 2017.12.19
2. Creator     : Kang inhan
3. Description : Popup Dimension Setting (팝업 위치/사이즈 설정창)
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "PopupDimension", {

    _default: null,
    _isCancel: true,    // 설정 취소여부

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._default = this.viewBag.DefaultOption;
        this._super.render.apply(this);
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL01593);
    },

    onInitContents: function (contents, resource) {        
        var generator = widget.generator,
            ctrl = generator.control();

        var resLabels = [];
        var values = [];

        this._default.resolutions.forEach(function (res, i) {
            resLabels.add(ecount.resource.LBL12323 + (i+1) + " : " + res.RES_WIDTH + " x " + res.RES_HEIGHT);
            values.add(i);
        });

        contents.add(ctrl.define("widget.label", "resLabel", "resLabel").label(ecount.resource.MSG07834 + "<br/><br/>").useHTML());
        contents.add(ctrl.define("widget.radio", "resolution", "resolution").label(resLabels).value(values).select(0).setVertical());
    },

    onInitFooter: function (footer, resource) {
        
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .attach(ctrl.define("widget.button", "apply").label(this.resource.BTN00069).css("btn btn-primary"))
            .attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
            
        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this._isCancel = false;
        this.save();
    },

    // 적용
    onFooterApply: function () {
        this._isCancel = false;
        this.save();
    },

    //닫기버튼
    onFooterClose: function () {
        this._isCancel = true;
        this.close();
    },

    onClosedPopupHandler: function (pageID) {
        if (this._isCancel) {
            this.removeActivePin();
        }
    },
    
    /**********************************************************************
   *  기능 처리
   **********************************************************************/

    save: function () {
        var checked = this._default.resolutions[this.contents.getControl("resolution").getValue()];
        var position = {
            popupId: this._default.position.POPUP_ID,
            width: this._default.position.WIDTH,
            height: this._default.position.HEIGHT,
            top: this._default.position.TOP,
            left: this._default.position.LEFT,
        }

        ecount.popup.dimension.replace(checked, position);
        this.close();
    },
});
