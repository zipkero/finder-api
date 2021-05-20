/****************************************************************************************************
1. Create Date : 2016.08.17
2. Creator     : 박철민
3. Description : 공통 출력 페이지
4. Precaution  : 
5. History     : 2018.07.26 - 크롬 버그 수정 
                 2018.07.26 - Syntax error 수정
                 2018.08.06 - 크롬 버그 추가 수정
                 2020.09.18(최준영) : A20_04799 - 공용메일 크롬 인쇄버튼 버그 수정
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "PrintLoadPage", {

    /**********************************************************************
     *  page configuration settings 
     **********************************************************************/
    _default: {
        titleName: ""
    },
    proption: {},

    parentFrame: null,

    container: "body",

    _callAfterImageLoad: true,//이미지 로딩 후 인쇄

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.parentFrame = ecount.getParentFrame(window);
        //this.removeKoreanFont();
        var head = document.getElementsByTagName('head')[0];
        var css = (this.printCss != null && this.printCss != "null") ? this.replaceSizeCss(this.printCss) : "";
        this.htmlContent = this.replaceSizeCss(this.htmlContent);
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && navigator.userAgent.toLowerCase().indexOf('edge') < 0) {
            css = css.replace("table-header-group", "table-row-group");
            css = css.indexOf('table-row-group') < 0 ? (css + " thead{ display:table-row-group } ") : css; 
        }

        if (!$.isEmpty(head)) {
            $.each(head.children, function (x, i) {
                if (i.href && i.href.indexOf('common-dark') > -1)
                    i.disabled = true;
            });
        }

        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;
        } else {                // the world
            s.appendChild(document.createTextNode(css));
        }

        //정렬
        if (this.printAlign != null) {
            if (this.printAlign == "R") {
                this.htmlContent = this.htmlContent.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-right\"");
                this.htmlContent = this.htmlContent.replaceAll("class=\"wrapper-print \"", "class=\"wrapper-print wrapper-print-right \"");
            } else if (this.printAlign == "L") {
                this.htmlContent = this.htmlContent.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-left\"");
                this.htmlContent = this.htmlContent.replaceAll("class=\"wrapper-print \"", "class=\"wrapper-print wrapper-print-left \"");
            } else if (this.printAlign == "C") {
                this.htmlContent = this.htmlContent.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-centered\"");
                this.htmlContent = this.htmlContent.replaceAll("class=\"wrapper-print \"", "class=\"wrapper-print wrapper-print-centered \"");
            }
        }

        //메모표시삭제
        this.htmlContent = this.htmlContent.replaceAll("grid-remark", "");

        head.appendChild(s);
    },

    render: function () {
        this._super.render.apply(this);
        var mainPrintHiddenFrame = this.parentFrame.document.getElementsByName(window.name);// parent.parent.document.getElementsByName("printHiddenFrame");
        if (mainPrintHiddenFrame) {
            $(mainPrintHiddenFrame).each(function (index) {
                var iHeight = $(this).innerHeight();
                var iWidth = $(this).innerWidth();
                if (iHeight <= 0 && iWidth <= 0) {
                    //$(this).removeClass("__ecHiddenFrameContainer");
                    //$(this).css("height", 5);
                }
            });
        }

        var Content = this.htmlContent;
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && navigator.userAgent.toLowerCase().indexOf('edge') < 0) {
            Content = Content.replace(/table-header-group/g, "table-row-group");
        }
        Content = Content.replace(/responsive-web/g, " ").replace(/table-responsive/g, " ");

        //인쇄시 lazy 로딩 제거
        var $content = $(Content);
        $content.find("[loading=lazy]").removeAttr("loading");

        $("body").append(Content);
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
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer) {

    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    //@override imageReloader
    imageReloader: function (imageArea, callback) {
        // Waiting completely loaded images
        // 이미지 찾는 곳
        if ($.isString(imageArea)) {
            var $images = this[imageArea] && this[imageArea].$el && this[imageArea].$el.find("img");
        } else {
            var $images = imageArea && imageArea.find("img");
        }

        if ($images && $images.length > 0) {
            ecount.common.requireImage($images, callback);
        } else {
            callback.call(this);
        }
    },

    onBeforeLoadComplete: function () {
    },

    onLoadComplete: function () {
        //this.fnPrintpageDivHeightSet(this.parentFrame.onprintHiddenFrame1)
    },
    /**********************************************************************
   *  기능 처리
   **********************************************************************/
    PrintpageDivHeightSet: function (print, isPopupClose) {
        //virtualpage div에 height를 입력해서 페이지를 넘길때 페이지브레이크가 적용되도록함
        // 사용하지 않는거 같음..
        if ($(".wrapper-print").length > 0) {
            $(".wrapper-print").removeClass("hide");
            var count = 0;
            var isIEBugVersion = this.IsIEVersionCheck();
            var divHeightParamArray = (this.printHeights || "").split(";")//$('#hidHeightParam').val().split(";");
            var parentFrame = this.parentFrame;
            $("#printHeights").remove();
            var mainPrintHiddenFrame = parent.document.getElementsByName(window.name);// parent.parent.document.getElementsByName("printHiddenFrame");
            if (mainPrintHiddenFrame) {
                $(mainPrintHiddenFrame).each(function (index) {
                    var iHeight = $(this).innerHeight();
                    var iWidth = $(this).innerWidth();
                    if (iHeight == 0 && iWidth == 0) {
                        $(this).css("height", 1);
                    }
                });
            }
            $(String.format("iframe[name={0}]", window.name), parentFrame.document).css("height", 1)
            ////$('#' + window.name, parentFrame.document).css("height", 1);
            ////$(".wrapper-print").get(0).innerHTML = $(".wrapper-print").get(0).innerHTML + "<img id='temp_img' src='/ECmain/ECount.Common/Images/xbox.gif'>";

            var images = $(".wrapper-print img");
            var loaded = 0;
            var imageCount = images.length;

            if (imageCount > 0) {
                var isIECheck = function ($image) {
                    return $.browser.msie && ($image.naturalHeight == 0 || $image.naturalWidth == 0);
                }

                for (var k = 0, len = images.length; k < len; k++) {
                    (function () {
                        if (images[k].complete || isIECheck($images[k])) {
                            loaded++;
                            if (loaded == imageCount) {
                                complete(print, isPopupClose);
                            }
                        } else {
                            $(images[k]).load(function () {
                                loaded++;
                                if (loaded == imageCount) {
                                    complete(print, isPopupClose);
                                }
                            });
                            $(images[k]).error(function () {
                                loaded++;
                                if (loaded == imageCount) {
                                    complete(print, isPopupClose);
                                }
                            });
                        }
                    })();
                }
            } else {
                complete(print, isPopupClose);
            }
        } else {
            complete(print, isPopupClose);
        }

        function complete(print, isPopupClose) {
            $("#temp_img").remove();
            $(".wrapper-print").each(function (index) {
                var divHeight = 0,
                    halfContentsLast = $(this).find(".wrapper-print-content:last"),
                    divposition = halfContentsLast.position(),
                    divposition2 = 0,
                    halfline = $(this).find(".print-half-line:last");

                // 절취선이 존재하는 경우
                if (halfline != undefined && halfline.length > 0) {
                    //halfline = $(this).find(".print-half-line:last");
                    divposition2 = halfline.position();
                    if (divposition2 != undefined && (halfline.outerHeight() + divposition2.top > halfContentsLast.outerHeight() + divposition.top)) {
                        divHeight = halfline.outerHeight() + divposition2.top;
                    }
                    else {
                        divHeight = halfContentsLast.outerHeight() + divposition.top;
                    }
                }
                else {
                    divHeight = halfContentsLast.outerHeight() + divposition.top;
                }
                if (divHeight > 0 && !isIEBugVersion) {
                    $(this).css("height", divHeight);
                } else {
                    if (divHeightParamArray.length > 0) {
                        $(this).css("height", divHeightParamArray[count]);
                    }
                }
                count = count + 1;
            });
            $(String.format("iframe[name={0}]", window.name), parentFrame.document).css("height", 0);
            if (mainPrintHiddenFrame) {
                $(mainPrintHiddenFrame).each(function (index) {
                    if ($(this).innerHeight() == 1) {
                        $(this).css("height", 0);
                    }
                });
            }
            print && print(isPopupClose);
        }
        // print && print(isPopupClose);
    },

    IsIEVersionCheck: function () {
        var isIEBugVersion = false;
        if (navigator.appVersion.indexOf("MSIE 8.0") > 0 || navigator.userAgent.indexOf("MSIE 7.0") > 0 || navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            isIEBugVersion = true;
        } else if (navigator.appVersion.indexOf("MSIE 9.0") > 0) {
            isIEBugVersion = false;
        }
        return isIEBugVersion;
    },

    fnDetectIE: function () {
        var agent = navigator.userAgent.toLowerCase();

        // ie 아님
        if (agent.indexOf('msie') == -1 && agent.indexOf('trident') == -1)
            return 0;

        // 호환성 보기 모드인 경우
        if (agent.indexOf('msie 7') > -1 && agent.indexOf('trident') > -1) {
            var bStyle = document.body.style;
            var canvas = document.createElement('canvas');

            if (!('getContext' in canvas))
                return 8;
            if (!('msTransition' in bStyle) && !('transition' in bStyle))
                return 9;
            if (!canvas.getContext('webgl'))
                return 10;

            return 11;
        } else { // 호환성 보기 모드 아닌 경우
            var rv = -1; // Return value assumes failure.

            // msie가 없으면 ie11.
            if (agent.indexOf('msie') == -1)
                return 11;

            var re = new RegExp("msie ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(agent) != null)
                rv = parseFloat(RegExp.$1);

            return rv;
        }
    },

    setContentHTML: function (html, isSet, callback) {

        if (!$.isEmpty(html)) {
            $("body").html(html);
        }
        if (isSet) {
            //그리드에서 높이조정 사용안하는 경우
            this.PrintpageDivHeightSet(callback, false)
        }
    },

    print: function (destroyFrame, frame) {
        var _self = this;
        var images = $("img");
        var loaded = 0;
        var imageCount = images.length;
        var parentFrame = this.parentFrame;
        debugger
        if (imageCount > 0) {
            var isNotImage = function ($image) {
                return $image.naturalHeight == 0 || $image.naturalWidth == 0;
            }

            for (var k = 0, len = images.length; k < len; k++) {
                (function () {
                    if (images[k].complete || isNotImage(images[k])) {
                        loaded++;
                        if (loaded == imageCount) {
                            onPrintComplet(frame, false);
                        }
                    } else {

                        $(images[k]).load(function () {
                            loaded++;
                            if (loaded == imageCount) {
                                onPrintComplet(frame, false);
                            }
                        });
                        $(images[k]).error(function () {
                            loaded++;
                            if (loaded == imageCount) {
                                onPrintComplet(frame, false);
                            }
                        });
                    }
                })();
            }
        } else {
            onPrintComplet(frame, false);
        }
        function onPrintComplet(frame, isClose) {
            var mainPrintHiddenFrame = parentFrame.document.getElementsByName(window.name);// parent.parent.document.getElementsByName("printHiddenFrame");
            if (mainPrintHiddenFrame) {
                $(mainPrintHiddenFrame).each(function (index) {
                    if ($(this).hasClass("__ecHiddenFrameContainer")) {
                        var iHeight = $(this).innerHeight();
                        var iWidth = $(this).innerWidth();
                        if (iHeight >= 0 && iWidth >= 0) {
                            //$(this).addClass("__ecHiddenFrameContainer");
                            $(this).css("height", 0);
                        }
                    }
                });
            }

            window.setTimeout(function () {
                _self.onprintHiddenFram(frame, isClose, destroyFrame);
            }, 800)
        }
    },
    onprintHiddenFram: function (frame, isClose, destroyFrame) {
        var parentFrame = this.parentFrame;
        function onfinish(isClose) {
            $(String.format("iframe[name={0}]", window.name), parentFrame.document).outerHTML = "";
            destroyFrame && destroyFrame();
            if (isClose) {
                setTimeout(function () { window.open('about:blank', '_self').self.close() }, 2000);
            }

        }
        if (!frame) frame = window;

        if (frame.document.readyState !== "complete" &&
            !confirm("The document to print is not downloaded yet! Continue with printing?")) {
            if (onfinish) onfinish();
            return;
        }

        debugger
        if (printIsNativeSupport()) {
            var focused = document.activeElement;
            frame.focus();

            //인쇄시 간헐적으로 여백이 적용안되는 현상으로 인해 아래의 함수로 교체
            //frame.self.print();

            var printFunc = function (callback, errorCount) {
                if (!errorCount) errorCount = 0;
                errorCount++;

                try {
                    //실제 프린트 진행
                    var strBrowser = window.navigator.userAgent || "";
                    if (strBrowser.indexOf("Firefix") > -1) {
                        //firefox인 경우만 self.print()
                        frame.self.print();
                    }
                    else if (frame.document.queryCommandSupported('print')) {
                        //그외 브라우저는 execCommand
                        frame.document.execCommand('print', false, null);
                    }
                    else {
                        //3번 실행후에 그대로 종료함
                        if (errorCount >= 3) {

                        }
                        else {
                            //그외상황은 3번 더 호출해줌
                            window.setTimeout(function () {
                                callback(callback, errorCount);
                            }, 500);
                            return;
                        }
                    }
                } catch (e) {
                    //3번 실행후에 그대로 종료함
                    if (errorCount >= 3) {

                    }
                    else {
                        //그외상황은 3번 더 호출해줌
                        window.setTimeout(function () {
                            callback(callback, errorCount);
                        }, 500);
                        return;
                    }
                    //오류전에 firefox는 분류 하여 인쇄하고 오류시에는 아무것도 실행되지 않도록 변경
                    //frame.self.print() 가 ie11에서 왼쪽으로 쏠리는 현상이 발생되는것으로 예상되어 수정

                    ////실패시 진행 (firefox에서는 위의 함수가 지원 안됨)
                    //frame.self.print();
                }

                try {
                    //close 처리는 별도 try로 묶어줌
                    if (onfinish) onfinish();
                    if (focused && !focused.disabled) focused.focus();

                    //workaround for Chrome bug - bug fixed by hmpark
                    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
                        if (window.stop) {
                            //location.reload(); //triggering unload (e.g. reloading the page) makes the print dialog appear
                            window.stop(); //immediately stop reloading
                        }
                    }
                }
                catch (e) { }
            }

            //인쇄 호출
            setTimeout(function () {
                printFunc(printFunc);
            }, 1000);

            return;
        }

        var eventScope = printGetEventScope(frame);
        var focused = document.activeElement;

        window.printHelper = function () {
            // execScript("on error resume next: printWB.ExecWB 6, 1", "VBScript");
            printFireEvent(frame, eventScope, "onafterprint");
            document.getElementById("printWB").outerHTML = "";
            if (onfinish) onfinish();
            if (focused && !focused.disabled) focused.focus();
            window.printHelper = null;
        }

        document.body.insertAdjacentHTML("beforeEnd", "<object id=\"printWB\" width=0 height=0 \ classid=\"clsid:8856F961-340A-11D0-A96B-00C04FD705A2\"></object>");

        printFireEvent(frame, eventScope, "onbeforeprint");
        frame.focus();
        window.printHelper = printHelper;
        if (printIsNativeSupport()) {
            this.setTimeout(window.printHelper(), 0);
        }
        else {
            frame.print();
        }


    },

    replaceSizeCss: function (css) {
        //var targetVersion = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        //if (!targetVersion || parseInt(targetVersion[2]) < 68) return css;
        //css = css.replace(/size:A4/g, "");
        //css = css.replace(/size:A5/g, "");
        return css;
    },

    removeKoreanFont: function () {
        var targetVersion = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        var isWindow10 = (navigator.userAgent.indexOf('Windows NT 10') > -1);
        var isWindow81 = (navigator.userAgent.indexOf('Windows NT 6.3') > -1);
        if (!targetVersion || parseInt(targetVersion[2]) < 72 || !(isWindow10 || isWindow81)) {
            return;
        }

        var styleList = $(document.head).find('style');
        var styleString;
        for (var i = 0; i < styleList.length; i++) {
            styleString = styleList[i].innerHTML;
            if (styleString.indexOf('font-user-setting')) {
                styleString += ".font-user-setting *{font-family: 'Arial','Apple SD Gothic Neo'!important;}";
                styleList[i].innerHTML = styleString;
            }
        }
    }
});