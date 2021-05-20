window.__define_resource && __define_resource("LGN00105","LGN00010","LGN00204","LGN00009","LGN00006","MSG00254","MSG01136","LGN00013","LGN00014","LGN00015","LGN00016","LGN00113","LGN00114","LGN00115","LGN00111","LGN00012");
/**************************************************************************************************** 
1. Create Date : 20??.??.?? 
2. Creator     : unknown
3. Description : UserPay Login 메인 화면 js
4. Precaution  : 
5. History     : 2019.06.25(taind) A19_01497 - 소스코드진단결과 반영 - Master
6. Old file    : unknown
* ***************************************************************************************************/

// zone 정보
var _domain = ".ecount.com";
var _zone = "";
var _comCode = "";
var _id = "";
var _eccnSiteStatus = "";
var _eccnSiteMsg = "";
var _loginErrorMsg = '';

window.onload = function(){
    if(__require_resource){
        __require_resource(onloadHandler);
    }else{
        onloadHandler.call(window);
    }
}

function onloadHandler() {    
    //if ("using-notice" == 'using-notice') {
    //    $(".page-login-form").addClass("using-notice")
    //}
    var viewBag = window.viewBag;
    if (viewBag.noticeInfo.usingNotice == "Y") {
        $(".login-aside-notice .panel-heading").html(viewBag.LGN00105 + "<button type=\"button\" class=\"close\" onclick=\"closeNotice('N');\"></button>");
        $(".login-aside-notice .panel-body").html(viewBag.noticeInfo.noticeText);
        $(".page-login-form").addClass("using-notice");
    }
    BrowserCheck();

    if (!$.isEmpty(viewBag.errMsg)) {
        errorPopup(viewBag.errMsg);
    }

    nextfield = "done";
    netscape = "";
    ver = navigator.appVersion; len = ver.length;
    for (iln = 0; iln < len; iln++) {
        if (ver.charAt(iln) == "(") break;
    }
    netscape = (ver.charAt(iln + 1).toUpperCase() != "C");

    //_loginErrorMsg = String.format("{0}</ br>{1}", ecount.resource.LGN00010, ecount.resource.LGN00204);
    _loginErrorMsg = viewBag.loginErrorMsg;//String.format("{0}</ br>{1}", ecount.resource.LGN00010, ecount.resource.LGN00009);

    moveFocus();

    if (viewBag.shortcut.toUpperCase() == "Y") {
        createShortcut();
    }
}

// excute login
function excuteLogin() {
    // 입력 값 공백제거 후 전달되도록 SET
    _comCode = document.getElementById('com_code').value.trim();
    _id = document.getElementById('id').value.trim();
    $("#com_code").val(_comCode);
    $("#id").val(_id);

    if (document.getElementById('process_ing').value == "Y") return false;

    document.getElementById('process_ing').value = "Y";

    if (this.validationCheck()) {
        if (document.getElementById('loginck').checked == true) {
            document.getElementById('loginck').value = "Y";
        }

        // zone info & login proccess
        this.getZone();

        if (_eccnSiteStatus == "D") {
            alert(_eccnSiteMsg.replace(/<br>/g, "\n"));
            _eccnSiteStatus = "E";
            document.getElementById('process_ing').value = "N";

            return false;
        }
    } else {
        document.getElementById('process_ing').value = "N";
        return false;
    }
}

// validation
function validationCheck() {
    var fmt1 = /\s/;

    var inputNode = $('.input-group');

    if (document.getElementById('com_code').value == "" || document.getElementById('com_code').value.length < 3)
        inputNode[0].className = 'input-group has-error';

    if (document.getElementById('id').value == "" || document.getElementById('id').value.length > 100)
        inputNode[1].className = 'input-group has-error';

    if (document.getElementById('passwd').value == "" || fmt1.exec(document.getElementById('passwd').value))
        inputNode[2].className = 'input-group has-error';



    if (inputNode[0].className == 'input-group has-error' || inputNode[1].className == 'input-group has-error' || inputNode[2].className == 'input-group has-error') {

        if (inputNode[0].className == 'input-group has-error') {
            document.getElementById('com_code').focus();
            if (document.getElementById('passwd').value == "" || fmt1.exec(document.getElementById('passwd').value))
                inputNode[2].className = 'input-group has-error';
        }
        else if (inputNode[0].className != 'input-group has-error' && inputNode[1].className == 'input-group has-error') {
            document.getElementById('id').focus();
            if (document.getElementById('passwd').value == "" || fmt1.exec(document.getElementById('passwd').value))
                inputNode[2].className = 'input-group has-error';
        }
        else
            document.getElementById('passwd').focus();

        return false;
    }
    else
        return true;
}

// get zone info
function getZone() {
    var comCode = document.getElementById('com_code').value;
    var param = {
        COM_CODE: comCode.toUpperCase(),
        SERVICE: "PAY"
    };
    $.ajax({
        type: "POST",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Login/GetZone",
        error: function (errorMsg) {
            alert(ecount.resource.LGN00006);
        },
        success: function (returnData) {
            if (returnData.Status == "200" && !returnData.Data.EMPTY_ZONE) {
                _domain = returnData.Data.DOMAIN.replace("ecounterp", "ecount");
                _zone = returnData.Data.ZONE;
                _comCode = returnData.Data.COM_CODE;
                _eccnSiteStatus = returnData.Data.STATUS;
                _eccnSiteMsg = returnData.Data.MSG;

                document.getElementById('zone').value = _zone;
                document.getElementById('domain').value = _domain;

                execLoginProc();
            }
            else {
                //errorPopup("There is no ZONE information.");
                errorPopup(_loginErrorMsg);
            }
        }
    });

    document.getElementById('process_ing').value = "N";
}

// login process 
function execLoginProc() {
    var ifrm = document.getElementById("ifrmLoginProc");
    var host = window.location.host;

    var token = (Date.now() + '').substring(0, 7); // convert to string

    $("#spasswd").val(token.length + token + $("#passwd").val().encryptXor(token));
    $("#passwd").val("");
    $("#passwd").remove();

    if (_domain == "") {
        _domain = "." + host.split(".")[1] + "." + host.split(".")[2];
    }

    host = ecount.common.makeZoneHost(_zone, _domain).replace("/ECAPI", "");;

    $("#zone").val(_zone);
    $("#domain").val(_domain);

    $("#loginForm").attr("action", host + "/ECERP/LOGIN/PayLoginProcessor").submit();
}

function errorPopup(message) {
    var messageSplit = message.split(ecount.delimiter);

    $("#errorMessage").html(messageSplit[0]);

    if (messageSplit[1]) {
        $("#errorSolutionMessage").html(messageSplit[1]);
        $("#errorSolution").removeClass("hidden");
        $("#errorSolutionUl").removeClass("hidden");
    }

    $("#errorPopup").removeClass("hidden");
}

function closeErrorPopup() {
    $("#fade").addClass("hidden");
    $("#errorPopup").addClass("hidden");
    document.getElementById("com_code").value = "";
    document.getElementById("id").value = "";
    document.getElementById("passwd").value = "";
    document.getElementById("com_code").focus();
}

function searchPasswordPopup() {
    var width = 835;
    var height = viewBag.lanType != "es" ? 340 : 390;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);

    window.open("/ECERP/Popup.Common/PasswordSearch?DOMAIN_FLAG=P&lan_type=" + viewBag.lanType, "searchPassword", "scrollbars=no,resizable=yes,copyhistory=no,scrollbars=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
}

function eventKeyDown() {
    k = (netscape) ? window.event.which : window.event.keyCode;
    if (k == 13) {
        if (nextfield == 'done') {
            excuteLogin();
        }
        else {
            document.getElementById(nextfield).focus();
        }
    }
}

// 로드이후 포커스 이동
function moveFocus() {
    if (document.getElementById("loginck").checked == true) {
        document.getElementById("passwd").focus();
    }
    else {
        if (document.getElementById("com_code").value == "") {
            document.getElementById("com_code").focus();
        }
    }
}

// 입력 문자열 길이 체크
function textLenCheck(text, total) {
    var obj = document.getElementById(text)
    var len = obj.value.length;
    var count = 0;
    var one_ch = "";
    var total2 = 0;

    for (i = 0; i < len; i++) {
        one_ch = obj.value.charAt(i);    //한문자만 추출
        if (escape(one_ch).length > 4) {
            count = count + 2;   //한글
        } else {
            count = count + 1;   //영문
        }
    }
    total2 = Math.floor(total / 2);
    if (count > total) {
        obj.value = obj.value.substr(0, total2);
        obj.focus();
        var inputNode = $('.input-group');//document.getElementsByClassName('input-group');
        if (text == "com_code") {
            inputNode[0].className = 'input-group has-error';
            //alert(ecount.resource.MSG00254);
        }
        else if (text == "id") {
            inputNode[1].className = 'input-group has-error';
            //alert(ecount.resource.MSG01136);
        }
        return false;
    }
}

function checkClassName(target) {

    if (target.parentNode && target.parentNode.className == 'input-group has-error' && event.keyCode != 13)
        target.parentNode.className = 'input-group';

}


function BrowserCheck() {

    var userAgent = navigator.userAgent.toLowerCase();

    if (this.viewBag.mobile == "False") {

        // Windows 버전 체크 - Windows XP 사용하는지
        var winversion = "";
        if (userAgent.indexOf('nt 5.1') > 0) {
            winversion = "XP";
        }
        else {
            winversion = "ELSE";
        }

        //브라우저 확인
        var browser = "";
        if (userAgent.indexOf('msie') > 0 || userAgent.indexOf('trident') > 0) {
            if (userAgent.indexOf('swing') > 0) //
                browser = "";
            else {
                if (userAgent.indexOf('msie 9.0') > 0) {
                    browser = "";
                } else {
                    browser = "IE";
                }
            }
        } else if (userAgent.indexOf('opera') > 0 || userAgent.indexOf('opr') > 0)
            browser = "Opera";
        else if (userAgent.indexOf('firefox') > 0)
            browser = "Firefox";
        else if (userAgent.indexOf("edge") > 0)    //스파르탄 엣지브라우저 순서 바뀌면 안됨
            browser = "";
        else if (userAgent.indexOf('safari') > 0) {
            if (userAgent.indexOf('chrome') > 0)
                browser = "Chrome";
            else
                browser = "Safari";
        }

        //test mode 
        //winversion = "XP";
        // Windows XP 사용하는 경우
        if (winversion == "XP") {
            this.UpGradeBrowserNoticePopup("os");
        }
        // Windows XP 이외의 OS
        else {
            // 브라우저 제한 안내 팝업
            if (browser == "") {
                this.UpGradeBrowserNoticePopup("browser");
            }
        }
    }
}


function UpGradeBrowserNoticePopup(type) {

    //Type:browser or os
    var title = type == "browser" ? this.viewBag.LGN00013 : this.viewBag.LGN00014;
    var contents = type == "browser" ? this.viewBag.LGN00015 : this.viewBag.LGN00016;
    var cookieName = type == "browser" ? "UpGradeBrowserNoticePAY" : "UpGradeOSNoticePAY";

    var $popupDiv = $("<div>").addClass("notification animated hidden").addClass("notification-warning").attr("id", "UpGradeBrowserNoticeContent");
    var $popupButtonDiv = $("<div>");
    var $popupButton = $("<button>").addClass("close");
    var $popupheadingDiv = $("<div>").addClass("notification-heading").append(title);   //제목
    var $popupcontentsDiv = $("<div>").addClass("notification-contents").append(contents); //내용
    var $MoreNotViewATag = $("<a>").attr("href", "#false").text(this.viewBag.LGN00113).attr("id", "MoreNotViewNotice"); //더이상 안보기
    var $TodaynotViewATag = $("<a>").attr("href", "#false").text(this.viewBag.LGN00114).attr("id", "TodayNotViewNotice");   // 오늘 안보기
    var $popupbottomDiv = $("<div>").addClass("notification-close").addClass("text-right");
    var $browserDownloadATag = $("<a>").attr("href", "https://www.google.com/chrome/index.html")
        .attr("target", "_new").text(this.viewBag.LGN00115).attr("id", "browserDownload"); //크롬다운로드

    if (type == "browser") $popupbottomDiv.append($MoreNotViewATag);    //더이상 안보기
    if (type == "browser") $popupbottomDiv.append($TodaynotViewATag);   // 오늘 안보기
    if (type == "browser") $popupcontentsDiv.append("<BR><BR>").append($browserDownloadATag);   //크롬다운로드

    $popupButtonDiv.append($popupButton);
    $popupDiv.append($popupButtonDiv).append($popupheadingDiv).append($popupcontentsDiv).append($popupbottomDiv);

    if ($.cookie(cookieName) != "done") {
        $("#UpGradeBrowserNotice").append($popupDiv);

        if (type == "browser") {
            // 더이상 안보기 버튼 클릭
            $("#MoreNotViewNotice").click(function (e) {
                e.stopPropagation();
                setCookies(cookieName, "done", 3650);
                $(this).parent().parent().removeClass('bounceInDown').addClass('fadeOut').delay(500).fadeOut(1);
            });
        }

        // 오늘하루 안보기 버튼 클릭
        $("#TodayNotViewNotice").click(function (e) {
            e.stopPropagation();
            setCookies(cookieName, "done", 1);
            $(this).parent().parent().removeClass('bounceInDown').addClass('fadeOut').delay(500).fadeOut(1);
        });

        // 팝업 닫기 버튼 클릭
        $(".wrapper-notification.main > .notification >  > button.close").click(function () {
            $(this).parent().parent().removeClass('bounceInDown').addClass('fadeOut').delay(500).fadeOut(1);
        })

        //팝업 보이기
        $("#UpGradeBrowserNoticeContent").show().removeClass('hidden fadeOut').addClass('bounceInDown');
    }
}

function setCookies(name, value, expiredays) {
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function OpenPageForGMC(url, name, width, height) {
    var domain = '',
        hostUrl = '';
    debugger;
    if (window.location.host.indexOf("tpay") > -1 || window.location.host.indexOf("test") > -1) {
        domain = "test.ecount.com";
    } else if (window.location.host.indexOf("zpay") > -1 || window.location.host.indexOf("apay") > -1 || window.location.host.indexOf("hpay") > -1) {
        hostUrl = window.location.host.split(".")[0];
        domain = hostUrl + ".ecount.com";
    } else {
        domain = "gmc.ecount.com";
    }

    var openUrl = "//" + domain + "/ECERP/GeneralPage/OpenPageForGMC?RetUrl=" + encodeURIComponent(url) + "&IsSessionEcount=true";

    window.open(openUrl, name, "width=" + width + ",height=" + height);

}

function writeCallBack() {
    var param = {
        EDIT_FLAG: "P",
        LAN_TYPE: this.viewBag.lanType,
        title: this.viewBag.LGN00111,
        width: 550,
        height: 300
    };

    this.fnOpenDivPopUp('/ECERP/ECB/ECB009M', param);
}

function createShortcut() {
    document.getElementById("createShortcut").click();
}

function addFavorites() {
    var url, title;

    url = "https://" + window.location.host;
    title = "ECOUNT";

    //브라우저별 즐겨찾기 처리방식 수정    
    if (window.sidebar) {// firefox     
        alert(this.viewBag.LGN00012);
    }
    else if (window.chrome || navigator.appName == "Netscape") {// chrome, safari
        alert(this.viewBag.LGN00012);
    }
    else if (window.opera && window.print) {//opera
        alert(this.viewBag.LGN00012);
    }
    else if (document.getElementById) {// ie
        window.external.AddFavorite(url, title);
    }
}

function lanTypeChange(lan) {
    document.location.href = "/ECERP/Login/PayLogin?lan_type=" + lan;
}

function fnOpenDivPopUp(url, params) {

    $(window.document.body).append("<div class=\"dialog2\" id=\"ecdivpop\"></div>");

    require("jquery-ui-addon", function () {
        var ecpopup = $("#ecdivpop");
        ecpopup.ecDialog({
            modal: false,
            height: params.height,
            width: params.width,
            dialogClass: "panel panel-primary panel-modal",
            title: params.title || '',
            resizable: true,
            removePinButton: true,
            isPinned: false,
            isChangePopupType: false,
            open: function () {
                //var _ecpopup = ecpopup;
                var container = $(this).parent();

                container.attr('tabindex', -1)[0].focus();
                container.find(".ui-dialog-titlebar").addClass("panel-heading");

                var uiButton = container.find(".ui-button");
                uiButton.addClass("btn btn-primary");

                /* X 빼고 전부삭제 */
                $("div.ui-dialog-titlebar").find("button").not("#btn_popup_close").remove();


                if (!$.isEmpty(url)) {
                    $.encryptAjax({
                        url: url,
                        method: "POST",
                        contentType: 'application/json',
                        data: Object.toJSON(params),
                        success: function (res) {   //cshtml 파일 로드 완료                        
                            if (params.callback && $.isFunction(params.callback)) {
                                callback(params.callbacArgs);
                            }

                            ecpopup.html(res);  //html그려주는부분
                        }.bind(this)
                    });
                } else {
                    var popHtml = $("#divDefaultErr").html().replace("page page-fluid page-login-error hidden", "page page-fluid page-login-error");
                    ecpopup.html(popHtml);
                }
            },

            resizeStart: function () {
                $(this).find(".dialog-iframe-overlay").show();
            },
            resizeStop: function () {
                $(this).find(".dialog-iframe-overlay").hide();
            },
            dragStart: function () {
                $(this).find("div.page").hide();
            },
            dragStop: function (e) {
                $(this).find("div.page").show();
            },
            drag: function () {
                //ie에서 드래그 위치가 스크롤로 계산되지 않아서 추가
                var target = arguments[1];
                target.position.top = target.offset.top;
            },
            close: function (ev, isChangePopupType) {

            }
        });
    });
}