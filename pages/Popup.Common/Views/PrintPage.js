
ecount.page.factory("ecount.page.popup.type2", "PrintPage", {

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    _default: {
        titleName: ""
    },
    proption: {},

    printCss:"",

    init: function (options) {
        debugger
        this._super.init.apply(this, arguments);

        var head = document.getElementsByTagName('head')[0];
        var css = (this.printCss != null && this.printCss != "null" && this.printCss != "[object Object]") ? this.printCss : "";

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && navigator.userAgent.toLowerCase().indexOf('edge') < 0) {
            css = css.replace("table-header-group", "table-row-group");
            css = css.indexOf('table-row-group') < 0 ? (css + " thead{ display:table-row-group } ") : css;
        }
        printCss = css;

        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;            
        } else {                // the world
            s.appendChild(document.createTextNode(css));            
        }
        head.appendChild(s);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header) {
        header.disable();       
    },

    //본문 옵션 설정(content option setting)
    onInitContents: function (contents) {        
        this.sendMessage(this, this.execPrint);        
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer) {

    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {
    },
    /**********************************************************************
   *  기능 처리
   **********************************************************************/    
    execPrint: function (option) {
        option.printCss = printCss;
        debugger;
        ecount.document.printPop2(option);
    }

});
