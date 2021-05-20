window.__define_resource && __define_resource("MSG05407","LBL01932","BTN00008","LBL01039");

ecount.page.factory("ecount.page.popup.type1", "Notice", {

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    _default: null,

    init: function (options) {
        this.resizeLayer(650, 250);
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this._default = {
            titleName: ""
        };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        header.disable();
    },

    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {        
        var generator = widget.generator,
            ctrl = generator.control(),
            control = generator.control();

        //if (this.parentPageID =="")  // 판매현황이면

        //var msg = "현재  <font color='red'><B>리뉴얼</B></font>된 메뉴는 <font color='blue'><B>베타버전</B></font>으로 문제발생 시 기존 버전으로 되돌아갈 수 있습니다";
        //msg += "<br/>안정된 서비스를 제공해드릴 수 있도록 최선의 노력을 다하겠습니다.";
        //msg += "<br/>감사합니다.";

        var msg = this.resource.MSG05407;

        contents.add(ctrl.define("widget.label", "BUSINESS_NO", "BUSINESS_NO").label(msg));
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();        
        toolbar
            //.attach(ctrl.define("widget.checkbox", "theEnd").label([this.resource.LBL01932]).value(["Y"]))
        //.attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008).css("btn btn-primary"));
            .attach(ctrl.define("widget.button", "theEnd").label(this.resource.LBL01039).css("btn btn-primary"))
            .attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
            
        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {
       
    },

    //데이터 변경시 발생(data change event)
    onChangeControl: function (control, data) {
        
    },

    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    // 더이상안보기
    onFooterTheEnd: function () {
        var date = new Date();

        $.cookie(this.cookPath, date, { expires: 365, path: '/' });        
        this.close();
        return false;
    },
    //닫기버튼
    onFooterClose: function () {        
        //var date = new Date();
        //var chks = this.footer.get(0).getControl("theEnd").getValue();
        
        //if (chks) {            
        //    $.cookie(this.cookPath, date, { expires: 365 , path: '/' });
        //}
        this.close();
        return false;
    },


    //엔터   (enter key press event)
    ON_KEY_ENTER: function (e, target) {
    },

    //마지막 포커스 (content field last focus)
    onFocusOutHandler: function (event) {
       // this.onFooterSave();
    }
    /**********************************************************************
   *  기능 처리
   **********************************************************************/

});
