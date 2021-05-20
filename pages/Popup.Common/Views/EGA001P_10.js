window.__define_resource && __define_resource("LBL00851","BTN00008");
ecount.page.factory("ecount.page.popup.type1", "EGA001P_10", {


    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

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

        var title = "관련법령";//this.resource.LBL00851;
        header.notUsedBookmark()
              .setTitle(title);
    },
    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            ctrl = generator.control(),
            panel = generator.panel(),
            control = generator.control();

        var comment = [
            "<div class='wrapper-toolbar text-xl text-center text-bold'>정보 통신망 이용 촉진 및 정보 보호 등에 관한 법률 안내</div>"
            , "<div class='wrapper-article'><ol><li>광고성 정보를 전송받는 수신자의 사전 동의 필요</li><li>야간 광고는 보낼 수 없음</li>"
            + "<li>문자 본문에 [광고] 표시 의무화</li>" + "<li>광고성 정보 수신자의 사전 동의여부는 매2년 마다 정기적으로 확인</li>"
            + "<li>수신동의 여부 미 확인 시 3천만원 이하 과태로 부과</li></ol></div>"
            ,"<div class='wrapper-article text-right'>※관련법령 : 정보통신망 이용 촉진 및 정보보호에 관란 법률 제50조<br />정보통신망 이용 촉진 및 정보보호에 관한 법률 시행령<br />[시행 2014.11.29]</div>"
        ];

        
        
        contents.add(widget.generator.div().id("lbldesc1").css("contents").html(comment));
        //panel.add(generator.div().css("received-documents-info").html(comment));
        //contents.add(ctrl.define("widget.label", "BUSINESS_NO", "BUSINESS_NO").html(comment));
        //contents.add(panel);
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
