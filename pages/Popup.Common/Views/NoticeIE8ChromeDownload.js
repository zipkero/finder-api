window.__define_resource && __define_resource("MSG05292","LBL03249","MSG05709","MSG05710","MSG05294","BTN00769","LBL01039","BTN00008","LBL01932");

/****************************************************************************************************
1. Create Date : 2015.11.18
2. Creator     : 전영준
3. Description : 판매입력> 모든 페이지
4. Precaution  :
5. History     : 
            2016.03.28 (seongjun-Joe) 소스리팩토링.
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "NoticeIE8ChromeDownload", {

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
            control = generator.control(),
            toolbar = generator.toolbar();

        //var msg = ecount.resource.MSG05292;
        //LBL03249 해결방법

        //var msg = ""
        //msg += "현재 접속하신 브라우저에서는 사용에 제한이 있을 수 있습니다."; //MSG05709
        //msg += "<div class=\"\wrapper-sub-title\">해결방법</div>"; //3249
        //msg += "<b>크롬(Chrome) 브라우저</b>를 사용해주세요."; //MSG05710
        //msg += "<br/>";


        //현재 리소스 버전 형태
        var msg = "";
        msg += ecount.resource.MSG05709;
        msg += "<br/><br/>";
        msg += "<" + ecount.resource.MSG05294 + ">"; // 해결방법
        msg += "<br/>";
        msg += ">" + ecount.resource.MSG05710; // 

        var btnre = "크롬(Chrome) 브라우저 다운로드하기";
        switch (this.viewBag.Language) {
            case "en-US":
                btnre = "Download Google Chrome Browser";
                break;
            case "es":
                btnre = "Download Google Chrome Browser";
                break;
            case "id-ID":
                btnre = "Download Google Chrome Browser";
                break;
            case "ja-JP":
                btnre = "Download Google Chrome Browser";
                break;
            case "ko-KR":
                btnre = "크롬(Chrome) 브라우저 다운로드하기";
                break;
            case "vi-VN":
                btnre = "Download Google Chrome Browser";
                break;
            case "zh-CN":
                btnre = "Download Google Chrome Browser";
                break;
            default:
                btnre = "Download Google Chrome Browser";
                break;
        }

        if (this.viewBag.Language != "zh-CN") {
            toolbar.setOptions({ css: "btn btn-primary", ignorePrimaryButton: true })
                    .addLeft(ctrl.define("widget.button", "ChromeDown", "ChromeDown").label(btnre)) // 없음ecount.resource.BTN00769
        }
        contents
            .add(ctrl.define("widget.label", "guide", "guide").label(msg))
            .add(toolbar)
            
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();        
        toolbar
          //.addLeft(ctrl.define("widget.button", "theEnd").label(this.resource.LBL01039).css("btn btn-primary"))
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.checkbox", "NoseeForToday").value("N").label([ecount.resource.LBL01932]))
            .addRight(ctrl.define("widget.checkbox", "NoseeAnymore").value("N").label([ecount.resource.LBL01039]))
        footer.add(toolbar);
    },
    /*****************************************************S*****************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {
   
        //TODO : JQUERY  제거 위젯팀 요청
        var leftEl = $(".pull-left")[1];
        $(leftEl).removeClass("pull-left");
        $(leftEl).addClass("text-center");
    },

    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //닫기버튼
    onFooterClose: function () {

        this.close();
        return false;
    },

    onContentsChromeDown: function (event) {
        window.open("https://www.google.com/chrome/", "", "width=800, height=600, toolbar=no, menubar=no, scrollbars=yes, resizable=yes");    
    },

    onChangeControl: function (control, data) {

        var cookieValue = $.makeCookieData({
            'esd006m_IE8notice': 'none'
        });
        switch (control.cid) {
            case "NoseeForToday":
                duration = 1;
                break;
            case "NoseeAnymore":
                duration = 365;
                break;
        }
        $.cookie(this.cookieKey+"ie8", cookieValue, { expires: duration, path: '/', encode: false });
        this.onFooterClose();
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
