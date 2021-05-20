window.__define_resource && __define_resource("LBL02072","LBL35126","LBL35129");
ecount.page.factory("ecount.page.list", "ES020P_02"/** page ID */, {
    /**********************************************************************
    *  전역변수
    **********************************************************************/
    imageData: null,

    /**********************************************************************
    *  page initialize
    **********************************************************************/
    init: function () {
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
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL02072)
    },

    /**********************************************************************
    *  setContents
    **********************************************************************/
    onInitContents: function (contents, resource) {
        //var form1 = widget.generator.form();
        //var toolbar = widget.generator.toolbar();
        //var ctrl = widget.generator.control();

        //toolbar.addLeft(ctrl.define("widget.label", "Des", "Des").label(String.format("<div class='well well-sm'><ul><li>" + resource.LBL35126 + " : {0}</li><li>" + resource.LBL35129 + " : {1}[{2}]</li></ul></div>", ($.isNull(this.PROD_CD)) ? "" : this.PROD_CD, ($.isNull(this.PROD_DES)) ? "" : this.PROD_DES, ($.isNull(this.SIZE_DES)) ? "" : this.SIZE_DES)).setOptions({
        //    useHTML: true
        //}));


        ///*
        //이미지 컨트롤이 개발 되면 imageData 객체로 생성한다.
        //*/

        //contents
        //    .add(ctrl.define("widget.label", "img", "img").label("<img src='http://zeus.ecounterp.com:8080/image/20150114/0/1/c538569d-9bc7-11e4-8d68-00155dde4602/국화zz.gif' alt='국화zz.gif'>")
        //    .setOptions({
        //        useHTML: true
        //    }))
        //    .add(toolbar);
               
    },

    /**********************************************************************
    *  setFooter
    **********************************************************************/
    onInitFooter: function (footer, resource) {
    },

    /**********************************************************************
    *  페이지 로드 후 이벤트
    **********************************************************************/
    onLoadComplete: function () {

        /**********************************************************************
        *  품목에 대한 이미지 리스트 조회
        **********************************************************************/
        
        var objthis = this;
        var Size_des = $.isNull(objthis.SIZE_DES) ? ($.isNull(objthis.CLASS_DES) ? "" : objthis.CLASS_DES) : objthis.SIZE_DES;

        var slidehtml = "";
        var imgListhtml = "";

        this.viewBag.InitDatas.PRODIMG.forEach(function (t, ii) {
            var classhtml = (ii == 0) ? "active" : "";
            var imageUrlHtml = "";
            if (!$.isNull(t.ATTACH_INFO) && !$.isNull(t.FS_OWNER_KEY)) {
                imageUrlHtml = t.FILE_FULLPATH;
            }
            else {
                imageUrlHtml = "";
            }

            slidehtml += "<li data-slide-to='" + ii + "' data-target='#carousel' class='" + classhtml + "'></li>";
            imgListhtml += "<div class='item " + classhtml + "'><img style='width: 100%;' alt='Lighthouse.jpg' src='" + imageUrlHtml + "'></div>";
        });
        if (slidehtml.equals("")) {
            slidehtml += "<li data-slide-to='0' data-target='#carousel' class='active'></li>";
            imgListhtml += "<div class='item active'><img style='width: 400px;height:300px' alt='' src=''></div>";
        }

        var contentHtml = "<div class='carousel slide' id='carousel' data-ride='carousel'><ol class='carousel-indicators'>" + slidehtml + "</ol><div class='carousel-inner' role='listbox'>" + imgListhtml + "</div><a class='left carousel-control' role='button' href='#carousel' data-slide='prev'><span class='fa fa-chevron-left' aria-hidden='true'></span></a><a class='right carousel-control' role='button' href='#carousel' data-slide='next'><span class='fa fa-chevron-right' aria-hidden='true'></span></a></div><div class='well well-sm'><ul><li>" + ecount.resource.LBL35126 + " : " + this.PROD_CD + "</li><li>" + ecount.resource.LBL35129 + " : " + this.PROD_DES + "[" + Size_des + "]" + "</li></ul></div>    "

        objthis.contents.$el.append(contentHtml)


    },
});