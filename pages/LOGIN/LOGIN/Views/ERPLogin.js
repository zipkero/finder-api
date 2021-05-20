window.__define_resource && __define_resource("LGN00104","LGN00105","LGN00010","LGN00009","LGN00006","LGN00106","LGN00107","LGN00007","LGN00108","LGN00008","LGN00001","LGN00235","LGN00109","LGN00383","LGN00404","LGN00110","LGN00355","MSG00254","MSG01136","LGN00111","LGN00012","LGN00112","LGN00013","LGN00014","LGN00015","LGN00016","LGN00113","LGN00114","LGN00115");
/**************************************************************************************************** 
1. Create Date : 20??.??.?? 
2. Creator     : unknown
3. Description : Login 메인 화면 js
4. Precaution  : 
5. History     : (2018.08.30) 허성길 새로운 기기 알림 등록 팝업 추가
                  2019.04.18(DucThai) A18_04146 - 로그인 > 원격지원 팝업 신규로
                  2019.06.25(taind) A19_01497 - 소스코드진단결과 반영 - Master
				  2019.11.15(양미진) - dev 30228 A19_04105 해외 원격프로그램 서버 통합 V2
                  2020.07.28(양미진) - dev 13447 A18_02955 로그인페이지 반응형 레이어팝업 사이즈조정
                  2020.11.16 (박흥산) - 로그인 2차인증
6. Old file    : unknown
* ***************************************************************************************************/
// 변수선언
window.name = "__externalEcountIFrame";
var _lanType = "ko-KR";
var _masterFlag = "N";
//var _secessionFlag = "N";   // 탈퇴한 경우 로그인 여부

// zone 정보
var _domain = ".ecount.com";
var _zone = "";
var _comCode = "";
var _id = "";
var _eccnSiteStatus = "";
var _eccnSiteMsg = "";
var _loginErrorMsg = '';
var _accessAll = "";
var _host = window.location.host;

window.onload = function () {
    if (__require_resource) {
        __require_resource(onloadHandler);
    } else {
        onloadHandler();
    }
}

function onloadHandler() {
    var viewBag = window.viewBag;
    if (viewBag.noticeInfo.usingNotice == "Y" || viewBag.noticeInfo.usingNotification == "Y") {
        var noticeTitle = viewBag.noticeInfo.usingNotification == "Y" ? viewBag.LGN00104 : viewBag.LGN00105;
        var noticeMsg = viewBag.noticeInfo.usingNotification == "Y" ? viewBag.noticeInfo.notificationText : viewBag.noticeInfo.noticeText;
        var hasNext = viewBag.noticeInfo.usingNotice == "Y" && viewBag.noticeInfo.usingNotification == "Y" ? "Y" : "N";
        $(".login-aside-notice .panel-heading").html(noticeTitle + "<button type=\"button\" class=\"close\" onclick=\"closeNotice('" + hasNext + "');\"></button>");
        $(".login-aside-notice .panel-body").html(noticeMsg);
        $(".page-login-form").addClass("using-notice");
    }

    _lanType = document.getElementById("lan_type").value;

    //if (_lanType.toUpperCase() == "KO-KR") {
    //    $("#callCenter").removeClass("hidden");
    //} else {
    //    $("#callCenter").addClass("hidden");
    //}

    nextfield = "done";
    netscape = "";
    ver = navigator.appVersion; len = ver.length;
    for (iln = 0; iln < len; iln++) {
        if (ver.charAt(iln) == "(") break;
    }
    netscape = (ver.charAt(iln + 1).toUpperCase() != "C");

    _loginErrorMsg = viewBag.loginErrorMsg;//String.format("{0}</ br>{1}", ecount.resource.LGN00010, ecount.resource.LGN00009);

    moveFocus();

    selectCountry();

    if (viewBag.shortcut.toUpperCase() == "Y") {
        createShortcut();
    }

    //브라우저 체크
    BrowserCheck();

    // CTI 연결 프로그램을 통해 접속한 경우 자동 로그인 처리 추가
    if (!$.isEmpty(viewBag.errMsg)) {
        if (viewBag.loginck == "Y") {
            $("#loginck").attr("checked", true);
        }
        if (viewBag.logintimeinck == "Y") {
            $("#logintimeinck").attr("checked", true);
        }

        errorPopup(viewBag.errCode, viewBag.errMsg, viewBag.sessions);
    }
    else {
        if (viewBag.cti == "Y") {
            excuteLogin();
        }
    }

    ecount.error = function () {

    };
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

    if (validationCheck()) {
        if (document.getElementById('loginck').checked == true) {
            document.getElementById('loginck').value = "Y";
        }
        if (document.getElementById('logintimeinck').checked == true) {
            document.getElementById('logintimeinck').value = "Y";
        }

        // zone info & login proccess
        getZone();

        if (_eccnSiteStatus == "D") {
            errorPopup("", _eccnSiteMsg.replace(/<br>/g, "\n"));
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
    var inputNode = $('.input-group');//document.getElementsByClassName('input-group');

    if (document.getElementById('com_code').value == "" || document.getElementById('com_code').value.length < 3)
        inputNode[0].className = 'input-group has-error';

    if (document.getElementById('id').value == "" || document.getElementById('id').value.length > 100)
        inputNode[1].className = 'input-group has-error';

    if (document.getElementById('passwd').value == "" || fmt1.exec(document.getElementById('passwd').value))
        inputNode[2].className = 'input-group has-error';

    //if (document.getElementsByClassName('input-group has-error').length > 0) {
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
    var param = {
        COM_CODE: _comCode.toUpperCase(),
        SERVICE: "LOGIN"
    };

    $.encryptAjax({
        type: "POST",
        dataType: "json",
        dataTypeCustom: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Login/GetZone",
        error: function (errorMsg) {
            alert(self.viewBag.LGN00006);
        },
        success: function (returnData) {
            if (returnData.Status == "200" && !returnData.Data.EMPTY_ZONE) {
                _domain = returnData.Data.DOMAIN.replace("ecounterp", "ecount");
                _zone = returnData.Data.ZONE;
                _eccnSiteStatus = returnData.Data.STATUS;
                _eccnSiteMsg = returnData.Data.MSG;
                _accessAll = returnData.Data.ACCESS_ALL;

                document.getElementById('zone').value = _zone;
                document.getElementById('domain').value = _domain;

                execLoginProc();
            }
            else {
                errorPopup("", _loginErrorMsg);
            }
        }
    });

    $("#process_ing").val("N");
}

//function checkCreateData() {
//    ecount.common.zoneSessionApi({
//        sessionURL: "/SVC/Common/Login/GetCompleteCreateData",
//        zoneName: self._zone,
//        UserId: "ECOUNT",
//        callbackApi: function (_returnUrl) {
//            ecount.common.api({
//                url: _returnUrl,
//                data: Object.toJSON({
//                    COM_CODE: self._comCode.toUpperCase()
//                }),
//                success: function (result) {
//                    if (result.Status != "200") {
//                        alert(result.fullErrorMsg);
//                    } else {
//                        if (result.Data == "" || (result.Data[0] && result.Data[0].DATA_CRE_TF == 1)) {    // 데이터가 아예 없거나(프로세스 변경전 코드), 생성이 완료되었을 때 로그인 진행
//                            self.execLoginProc();
//                        }
//                        else {
//                            // progress bar는 리소스 등 유동적으로 변경하기 위해 공통 js 사용안함
//                            setTimeout(function () {
//                                $(".wrapper-overlay").addClass('show');
//                                $(".wrapper-page-progress").removeClass('hidden'); 
//                            }, 100);

//                            setTimeout(function () {
//                                self.checkCreateData();
//                            }, 3000);
//                        }
//                    }
//                },
//                error: function () {
//                    alert(self.viewBag.LGN00006);
//                    return;
//                },
//                complete: function () {

//                }
//            });
//        }
//    });
//}

// login process 
function execLoginProc() {
    var token = (Date.now() + '').substring(0, 7); // convert to string

    if (_domain == "") {
        _domain = "." + host.split(".")[1] + "." + host.split(".")[2];
    }

    _host = ecount.common.makeZoneHost(_zone, _domain).replace("/ECAPI", "");

    $("#spasswd").val(token.length + token + $("#passwd").val().encryptXor(token));
    $("#passwd").val("");
    //$("#passwd").remove();
    $("#zone").val(_zone);
    $("#domain").val(_domain);
    $("#m_flag").val(_masterFlag);
    //$("#s_flag").val(_secessionFlag);

    $("#loginForm").attr("action", _host + "/ECERP/LOGIN/ERPLoginProcessor").submit();
}

function errorPopup(code, message, session) {
    //var host = ecount.common.makeZoneHost(this.viewBag.zone, this.viewBag.login_domain).replace("/ECAPI", "");
    var host = '';
    var token = (Date.now() + '').substring(0, 7); // convert to string

    $("#titleMessage2").hide();
    $("#passwordReSetting").hide();

    switch (code) {
        case "93":
        case "94":
        case "95":      // 관리자ID 접속 사유
            var param = {
                title: this.viewBag.LGN00106,
                width: 550,
                height: 330,
                Request: {
                    Data: {
                        EDIT_FLAG: code == "95" ? "2" : (code == "94" ? "1" : "0"),
                        ZONE: this.viewBag.zone,
                        DOMAIN: this.viewBag.login_domain,
                        COM_CODE: $("#com_code").val(),
                        USERID: $("#id").val(),
                        CON_TYPE: this.viewBag.con_type,
                        UNAME: this.viewBag.uname,
                        LAN_TYPE: this.viewBag.login_lantype,
                        SPASSWD: token.length + token + $("#passwd").val().encryptXor(token)
                    }
                }
            };
            this.fnOpenDivPopUp(host + '/ECERP/SVC/ECB/ECB002M', param, code);
            break;
        case "402":     // 비밀번호 정기 변경            
            var param = {
                EDIT_FLAG: "0",             // 어디로부터 호출됐는지
                ZONE: this.viewBag.zone,
                DOMAIN: this.viewBag.login_domain,
                COM_CODE: $("#com_code").val(),
                USERID: $("#id").val(),
                LAN_TYPE: this.viewBag.login_lantype,
                SPASSWD: token.length + token + $("#passwd").val().encryptXor(token),
                UNAME: this.viewBag.uname,
                YN_PWDSKIPEXPIRATIONDATE: this.viewBag.yn_pwdskip == "Y" ? true : false,
                title: this.viewBag.LGN00107,
                width: 550,
                height: ecount.isMobile ? 460 : 430
            };

            this.fnOpenDivPopUp(host + '/ECERP/ECB/ECB001M', param);
            break;
        case "403":     // 일정기간 사용 기록이 없는 IP인 경우
            var param = {
                EDIT_FLAG: "0",             // 어디로부터 호출됐는지
                ZONE: this.viewBag.zone,
                DOMAIN: this.viewBag.login_domain,
                COM_CODE: $("#com_code").val(),
                USERID: $("#id").val(),
                UNAME: this.viewBag.uname,
                LAN_TYPE: this.viewBag.login_lantype,
                SPASSWD: token.length + token + $("#passwd").val().encryptXor(token),
                LOGIN_DAYS: this.viewBag.login_days,
                MFLAG: this.viewBag.mflag,
                title: this.viewBag.LGN00007,
                width: 550,
                height: ecount.isMobile ? 400 : 350
            };

            this.fnOpenDivPopUp(host + '/ECERP/ECB/ECB003M', param);
            break;
        case "82":  // 결제요청(미납금) (구 미수차단1)
        case "83":  // 탈퇴예정(미납+1개월분) (구 미수차단2)
        case "84":  // 결제요청(가입비) (구 가입비 미수차단)
            //case "404": // 미수차단 재사용 처리
            var gubun = "V"; // 84

            if (code == "82")
                gubun = "T";
            else if (code == "83")
                gubun = "U";
            //else if (code == "404")
            //gubun = "R";

            var param = {
                width: 1197,
                height: 835,
                EDIT_FLAG: "0",
                ZONE: this.viewBag.zone,
                DOMAIN: this.viewBag.login_domain,
                COM_CODE: $("#com_code").val(),
                USERID: $("#id").val(),
                GUBUN: gubun,
                LAN_TYPE: this.viewBag.login_lantype,
                BRN_CD: this.viewBag.brn_cd,
                ERR_CODE: code
            };

            this.fnOpenDivPopUp(host + '/ECERP/SVC/ECB/ECB010MNoAuth', param, code);
            break;
        case "400": // 해외 코드 기간 만료 (인도네시아 외)
        case "401": // 해외 코드 기간 만료 (인도네시아)
            var title = this.viewBag.LGN00108;

            var param = {
                EDIT_FLAG: "0",             // 어디로부터 호출됐는지
                ZONE: this.viewBag.zone,
                DOMAIN: this.viewBag.login_domain,
                COM_CODE: $("#com_code").val(),
                USERID: $("#id").val(),
                LAN_TYPE: this.viewBag.login_lantype,
                INDONESIA_YN: code == "401" ? "Y" : "N",
                BRN_CD: this.viewBag.brn_cd,
                title: title,
                width: 825,
                height: 800,
                ERR_CODE: code
            };
            this.fnOpenDivPopUp(host + '/ECERP/SVC/ECB/ECB010MNoAuth', param, code);
            break;
        case "97":  // 비밀번호 오류
        case "98":  // 비밀번호 5회 이상 틀린 경우
            if (!$.isEmpty(this.viewBag.loginErrcountResult)) {
                var _failList = JSON.parse(this.viewBag.loginErrcountResult);
                var _dtDate;
                var _logIp;
                var messageSplit = message.split(ecount.delimiter);
                var tbRow = '';

                // 로그인processor 기존오류 로그인 에러 카운트 insert보다 selet가 빨라 스크립트에서 한번더 체크
                if (_failList[0].ERROR_COUNT >= 5) {
                    code = '98';
                    messageSplit[0] = this.viewBag.LGN00008;
                }

                $("#failCountMessage1").html(messageSplit[0]);
                $("#divFailMessage").addClass("hidden");
                $("#divErrElse").addClass("hidden");
                $("#divErrPwd").removeClass("hidden");

                if (code == "97") {
                    $("#failCountMessage3").remove();
                }
                else {
                    $("#failCountMessage2").remove();
                    $("#titleMessage1").remove();
                    $("#titleMessage2").show();
                    $("#passwordReSetting").show();
                }

                for (var i = 0; i < _failList.length; i++) {
                    _dtDate = _failList[i].LGIN_DTM;
                    _logIp = _failList[i].LGIN_IP;
                    tbRow += String.format("<tr><td class='text-center'>{0}</td><td class='text-center'>{1}</td></tr>", _dtDate, _logIp);
                }

                $("#tbRowBody").append(tbRow);
            }

            var param = {
                title: code == 97 ? viewBag.LGN00001 : viewBag.LGN00235,
                width: 550,
                height: 400
            };
            this.fnOpenDivPopUp('', param);
            break;
        case "404": // 임시접속제한
            var param = {
                ZONE: this.viewBag.zone,
                DOMAIN: this.viewBag.login_domain,
                COM_CODE: $("#com_code").val(),
                USERID: $("#id").val(),
                UNAME: this.viewBag.uname,
                LAN_TYPE: this.viewBag.login_lantype,
                SPASSWD: token.length + token + $("#passwd").val().encryptXor(token),
                MFLAG: this.viewBag.mflag,
                title: this.viewBag.LGN00109,
                LOGIN_TYPE: "0",
                ALL_SESSION_DATAS: session,
                width: 550,
                height: 350
            };

            this.fnOpenDivPopUp(host + '/ECERP/ECB/ECB007M', param);
            break;
        case "405": // 2차인증
            ecount.company = { COM_CODE: $("#com_code").val() };
            ecount.user = { ID: $("#id").val() };
            var param = {
                title: this.viewBag.LGN00383,
                width: 800,
                height: 550,
                Request: {
                    Data: {
                        ZONE: this.viewBag.zone,
                        DOMAIN: this.viewBag.login_domain,
                        COM_CODE: $("#com_code").val(),
                        USERID: $("#id").val(),
                        UNAME: this.viewBag.uname,
                        LAN_TYPE: this.viewBag.login_lantype,
                        SPASSWD: token.length + token + $("#passwd").val().encryptXor(token)
                    }
                }
            };

            this.fnOpenDivPopUp(host + '/ECERP/SVC/ECB/ECB011M', param, code);
            break;

        case "406": // 2차인증
            ecount.company = { COM_CODE: $("#com_code").val() };
            ecount.user = { ID: $("#id").val() };
            var param = {
                title: this.viewBag.LGN00404,
                width: 550,
                height: 320,
                Request: {
                    Data: {
                        ZONE: this.viewBag.zone,
                        DOMAIN: this.viewBag.login_domain,
                        COM_CODE: $("#com_code").val(),
                        USERID: $("#id").val(),
                        UNAME: this.viewBag.uname,
                        LAN_TYPE: this.viewBag.login_lantype,
                        SPASSWD: token.length + token + $("#passwd").val().encryptXor(token)
                    }
                }
            };

            this.fnOpenDivPopUp(host + '/ECERP/SVC/ECB/ECB012M', param, code);
            break;
        case "505":
            var param = {
                EDIT_FLAG: "0",             // 어디로부터 호출됐는지
                ZONE: this.viewBag.zone,
                DOMAIN: this.viewBag.login_domain,
                COM_CODE: $("#com_code").val(),
                USERID: $("#id").val(),
                UNAME: this.viewBag.uname,
                LAN_TYPE: this.viewBag.login_lantype,
                SPASSWD: token.length + token + $("#passwd").val().encryptXor(token),
                DEVICE_KEY: $("#deviceKey").val(),
                MFLAG: this.viewBag.mflag,
                LOGIN_TYPE: "0",
                title: this.viewBag.LGN00110,
                width: 550,
                height: 350
            };

            this.fnOpenDivPopUp(host + '/ECERP/ECB/ECB006M', param);
            break;
        default:
            var width = 550;
            var height = ["KR", "TW"].contains(this.viewBag.brn_cd) ? 300 : 200;
            var popupUrl = host + '/ECERP/ECB/ECB008M';
            var title = viewBag.LGN00001;
            $("#divErrPwd").addClass("hidden");

            switch (code) {
                case "85": // 사용차단
                case "86": // 탈퇴
                case "90": // 미수차단
                    height = 300;
                    break;
                case "20":
                    //$("#errorPopup .panel-heading").text() = "";
                    break;
                case "27":
                    title = this.viewBag.LGN00104;
                    break;
                case "28":
                    title = this.viewBag.LGN00355;
                    break;
                default:
                    if (["22", "23", "24", "25"].contains(code)) {
                        var messageSplit = message.split(ecount.delimiter);
                        popupUrl = '';

                        $("#divErrElse").removeClass("hidden");
                        $("#errorMessage").html(messageSplit[0]);

                        if (messageSplit[1]) {
                            $("#errorSolutionMessage").html(messageSplit[1]);
                            $("#errorSolution").removeClass("hidden");
                            $("#errorSolutionUl").removeClass("hidden");
                        }

                        height = 300;
                    }
                    break;
            }

            var param = {
                EDIT_FLAG: "0",             // 어디로부터 호출됐는지
                ZONE: this.viewBag.zone,
                DOMAIN: this.viewBag.login_domain,
                COM_CODE: $("#com_code").val(),
                USERID: $("#id").val(),
                LAN_TYPE: this.viewBag.login_lantype,
                GUBUN: gubun,
                BRN_CD: this.viewBag.brn_cd,
                ERR_CODE: code,
                ERR_MSG: message,
                title: title,
                width: width,
                height: height
            };
            this.fnOpenDivPopUp(popupUrl, param);
            break;
    }

}

function fnOpenDivPopUp(url, params, code) {
    $(window.document.body).append("<div class=\"dialog2\" id=\"ecdivpop\"></div>");
    require("jquery-ui-addon", function () {
        if (code == "93" || code == "94" || code == "95") {
            ecount.popup.openWindow({ url: url, popupID: "ECB002M", name: "ECB002M", param: params, popupType: false });
        } else if (code == "82" || code == "83" || code == "84") {
            ecount.popup.openWindow({ url: url, popupID: "ECB010MNoAuth", name: "ECB010MNoAuth", param: params, popupType: false });
        } else if (code == "400" || code == "401") {
            ecount.popup.openWindow({ url: url, popupID: "ECB010MNoAuth", name: "ECB010MNoAuth", param: params, popupType: false });
        } else if (code == "405") {
            ecount.popup.openWindow({ url: url, popupID: "ECB011M", name: "ECB011M", param: params, popupType: false });
        } else if (code == "406") {
            ecount.popup.openWindow({ url: url, popupID: "ECB012M", name: params.title, param: params, popupType: false });
        }

        else {
            var ecpopup = $("#ecdivpop");

            if (ecount.isMobile) {
                params.width = window.innerWidth * (0.9);
            }

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
        }
    });
}

function closeErrorPopup() {
    $("#fade").addClass("hidden");
    $("#btn_popup_close")[0].click();
    //document.getElementById("com_code").value = "";
    //document.getElementById("id").value = "";
    document.getElementById("passwd").value = "";
    document.getElementById("com_code").focus();
}

function searchPasswordPopup() {
    var width = 835;
    var height = _lanType != "es" ? 380 : 430;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);

    window.open("/ECERP/Popup.Common/LoginInfoSearch?DOMAIN_FLAG=E&lan_type=" + _lanType, "searchPassword", "scrollbars=no,resizable=yes,copyhistory=no,scrollbars=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
}

function QuestionMailPopup() {

    if (_lanType.toUpperCase() == "KO-KR") {
        var domain = '';

        if (window.location.host.indexOf("test") > -1 || window.location.host.indexOf("sale") > -1) {
            domain = "test.ecounterp.co.kr";
        } else if (window.location.host.indexOf("zeus") > -1) {
            domain = "http://zeus_www.ecount.com/kr";
        } else if (window.location.host.indexOf("apollo") > -1) {
            domain = "http://apollo_www.ecount.com/kr";
        } else if (window.location.host.indexOf("hera") > -1) {
            domain = "http://hera_www.ecount.com/kr";
        } else {
            domain = "https://www.ecount.com/kr";
            //domain = "gmc.ecount.com";
        }

        var accessSite = '';

        if (viewBag.access_site.toUpperCase() == "KTNET") {
            accessSite = 'KTNET';
        }

        window.open(domain + "/ECK/ECK006P_01.aspx?&url_gubun=1&access_site=" + accessSite, "email", 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=900,height=650');
        //window.open("http://" + domain + "/ECERP/GeneralPage/OpenPageForGMC?RetUrl=" + encodeURIComponent("/ECERP/GMC.GCK/ECK006P_01?lan_type=" + _lanType + "&url_gubun=1&access_site=" + accessSite) + "&IsSessionEcount=true", 'EMAIL', "width=880,height=610");

    }
    //else if (_lanType.toUpperCase() == "ID-ID") {
    //    window.open("http://www.ecount.co.id/#!sevice/c3vn", "EMAIL", "");
    //}
    else {
        var domain = '';


        if (window.location.host.indexOf("test") > -1 || window.location.host.indexOf("sale") > -1) {
            domain = "test.ecount.com";
        } else if (window.location.host.indexOf("z") > -1 || window.location.host.indexOf("hera") > -1) {
            switch (_lanType.toUpperCase()) {
                case "EN-US":
                    domain = "zeus_www.ecount.com/us";
                    break;
                case "ES":
                    domain = "zeus_www.ecount.com/es";
                    break;
                case "ZH-CN":
                    domain = "zeus_www.ecount.cn";
                    break;
                case "ZH-TW":
                    domain = "zeus_www.ecount.com/tw";
                    break;
                case "VI-VN":
                    domain = "zeus_www.ecount.com/vn";
                    break;
                case "JA-JP":
                    domain = "zeus_www.ecount.com/jp";
                    break;
                case "EN-MY":
                    domain = "zeus_www.ecount.com/my";
                    break;
                case "ID-ID":
                    domain = "zeus_www.ecount.com/id";
                    break;
                case "TH-TH":
                    domain = "zeus_www.ecount.com/th";
                    break;
            }
        } else if (window.location.host.indexOf("apollo") > -1) {
            switch (_lanType.toUpperCase()) {
                case "EN-US":
                    domain = "apollo_www.ecount.com/us";
                    break;
                case "ES":
                    domain = "apollo_www.ecount.com/es";
                    break;
                case "ZH-CN":
                    domain = "apollo_www.ecount.cn";
                    break;
                case "ZH-TW":
                    domain = "apollo_www.ecount.com/tw";
                    break;
                case "VI-VN":
                    domain = "apollo_www.ecount.com/vn";
                    break;
                case "JA-JP":
                    domain = "apollo_www.ecount.com/jp";
                    break;
                case "EN-MY":
                    domain = "apollo_www.ecount.com/my";
                    break;
                case "ID-ID":
                    domain = "apollo_www.ecount.com/id";
                    break;
                case "TH-TH":
                    domain = "apollo_www.ecount.com/th";
                    break;
            }
        } else {
            switch (_lanType.toUpperCase()) {
                case "EN-US":
                    domain = "www.ecount.com/us";
                    break;
                case "ES":
                    domain = "www.ecount.com/es";
                    break;
                case "ZH-CN":
                    domain = "www.ecount.cn";
                    break;
                case "ZH-TW":
                    domain = "www.ecount.com/tw";
                    break;
                case "VI-VN":
                    domain = "www.ecount.com/vn";
                    break;
                case "JA-JP":
                    domain = "www.ecount.com/jp";
                    break;
                case "EN-MY":
                    domain = "www.ecount.com/my";
                    break;
                case "ID-ID":
                    domain = "www.ecount.com/id";
                    break;
                case "TH-TH":
                    domain = "www.ecount.com/th";
                    break;
            }
        }


        window.open("https://" + domain + "/ECK/ECK006P_02.aspx?lan_type=" + _lanType + "&url_gubun=2", "email", 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=900,height=650');
    }
}

function eventKeyDown() {
    console.log(window.event);
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
    console.log(arguments);
    if (document.getElementById("loginck").checked == true) {
        document.getElementById("passwd").focus();
    }
    else {
        if (document.getElementById("com_code").value == "") {
            window.setTimeout(document.getElementById("com_code").focus(), 500);
            document.getElementById("com_code").focus();
            document.getElementById("com_code").click();
        }
    }
}

// 입력 문자열 길이 체크
function textLenCheck(text, total) {
    console.log(text, total);
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

function createShortcut() {
    document.getElementById("createShortcut").click();
}

function OpenPageForGMC(url, name, width, height) {
    var domain = '',
        hostUrl = '';
    if (window.location.host.indexOf("test") > -1 || window.location.host.indexOf("sale") > -1) {
        domain = "test.ecount.com";
    } else if (window.location.host.indexOf("zeus") > -1 || window.location.host.indexOf("apollo") > -1 || window.location.host.indexOf("hera") > -1) {
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
        EDIT_FLAG: "0",
        LAN_TYPE: _lanType,
        title: this.viewBag.LGN00111,
        width: 550,
        height: 400
    };

    this.fnOpenDivPopUp('/ECERP/ECB/ECB009M', param);
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

function browserOptimization() {
    var agent = navigator.userAgent.toLowerCase();
    var strUrl = "";

    if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
        if (location.href.indexOf("http://") > -1) {
            strUrl = "http://ucloud.ecounterp.com/Download/IE_Opt/EcountRegSet.exe";
        } else {
            strUrl = "https://ucloud.ecounterp.com/Download/IE_Opt/EcountRegSet.exe";
        }
    } else if (agent.indexOf("chrome") > -1 && agent.indexOf("opr") == -1) {
        if (location.href.indexOf("http://") > -1) {
            strUrl = "http://ucloud.ecounterp.com/Download/IE_Opt/EcountChromeSet.exe";
        } else {
            strUrl = "https://ucloud.ecounterp.com/Download/IE_Opt/EcountChromeSet.exe";
        }
    } else {
        alert(this.viewBag.LGN00112);
        return;
    }

    location.href = strUrl;
}

function remoteAssistance() {
    var element = document.getElementById("remoteAssistance");
    var openUrl = "/ECERP/ECU/ECU004M_01?lan_type=" + this._lanType;

    window.open(openUrl, "helps", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=auto,resizable=yes,copyhistory=no,width=850,height=415");
}

function connectionFailureRequest() {
    var accessSite = !$.isEmpty(viewBag.access_site) ? viewBag.access_site.toUpperCase() : 'ECOUNT';
    //var ecZone = getServerZone(viewBag.serverName);
    window.open("/ECERP/EAB/EAB001P?access_site=" + accessSite + "&lan_type=" + _lanType + "&ec_zone=" + viewBag.zoneName, "error_singo", "scrollbars=no,resizable=yes,copyhistory=no,scrollbars=no,width=500,height=350")
}

function getServerZone(serverName) {
    switch (serverName) {
        // A ZONE
        case "LOGIN10": return "A1";
        case "LOGIN13": return "A2";
        case "LOGIN16": return "A3";
        case "LOGIN-S6": return "A4";
        // B ZONE
        case "LOGIN01": return "B1";
        case "LOGIN03": return "B2";
        case "LOGIN11": return "B3";
        case "LOGIN17": return "B4";
        case "LOGINB5": return "B5";
        case "LOGIN-S4": return "B6";
        case "LOGIN-S5": return "B7";
        // C ZONE
        case "LOGIN02": return "C1";
        case "LOGIN04": return "C2";
        case "LOGIN06": return "C3";
        case "LOGIN19": return "C4";
        case "LOGINC5": return "C5";
        case "LOGINA4": return "C6";
        case "LOGIN-S1": return "C7";
        case "LOGIN-S2": return "C8";
        case "LOGIN-S3": return "C9";
        // D ZONE
        case "LOGIN05": return "D1";
        case "LOGIN14": return "D2";
        case "LOGIN20": return "D3";
        case "LOGIND4": return "D4";
        case "LOGIN08": return "D5";
        // E ZONE
        case "LOGINE1": return "E1";
        case "LOGINE2": return "E2";
        // F ZONE
        case "LOGINF1": return "F1";
        case "LOGINF2": return "F2";
        // ETC (LOGIN07, LOGIN8-TEST)
        default: return serverName;
    }
}

function lanTypeChange(lan) {
    document.location.href = "/ECERP/Login/ERPLogin?lan_type=" + lan;
}

function selectCountry() {
    $("#li_" + _lanType).addClass("active");
}

function openApiPopup() {
    window.open("/ECMain/INFO/API_adver.aspx", "ApiAd", "width=885,height=805,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no");
}

function homePagePopup() {
    var element = document.getElementById("homePage");

    switch (this._lanType) {
        case "ko-KR":
            element.href = "http://www.ecount.com/kr/";
            break;
        case "en-US":
            element.href = "http://www.ecount.com/us/";
            break;
        case "zh-CN":
            element.href = "http://www.ecount.cn/";
            break;
        case "zh-TW":
            element.href = "http://www.ecount.com/tw/";
            break;
        case "ja-JP":
            element.href = "http://www.ecount.com/jp/";
            break;
        case "vi-VN":
            element.href = "http://www.ecount.com/vn/";
            break;
        case "es":
            element.href = "http://www.ecount.com/es/";
            break;
        case "id-ID":
            element.href = "http://www.ecount.com/id/";
            break;
        case "en-MY":
            element.href = "http://www.ecount.com/my/";
            break;
        case "th-TH":
            element.href = "http://www.ecount.com/th/";
            break;
        default:
            element.href = "http://www.ecount.com/kr/";
            break;
    }
}

function masterLogin() {
    _masterFlag = "Y";
    excuteLogin();
}

function closeNotice(hasNext) {
    if (hasNext == "Y") {
        $(".login-aside-notice .panel-heading").html(this.viewBag.LGN00105 + "<button type=\"button\" class=\"close\" onclick=\"closeNotice('N');\"></button>");
        $(".login-aside-notice .panel-body").html(this.viewBag.noticeInfo.noticeText);
    }
    else
        $(".page-login-form").removeClass("using-notice");
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
        //winversion  = "XP";
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

//
function UpGradeBrowserNoticePopup(type) {

    //type:browser or os
    var title = type == "browser" ? this.viewBag.LGN00013 : this.viewBag.LGN00014;
    var contents = type == "browser" ? this.viewBag.LGN00015 : this.viewBag.LGN00016;
    var cookieName = type == "browser" ? "UpGradeBrowserNoticeERP" : "UpGradeOSNoticeERP";

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
        });

        //팝업 보이기
        $("#UpGradeBrowserNoticeContent").show().removeClass('hidden fadeOut').addClass('bounceInDown');
    }

}


function setCookies(name, value, expiredays) {
    var todayDate = new Date();
    todayDate.setDate(todayDate.getDate() + expiredays);
    document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function fnOpenCallback() {
    var host = window.location.host;

    host = ecount.common.makeZoneHost(viewBagNotice.zone, viewBagNotice.domain).replace("/ECAPI", "");

    // url 설정
    var url = String.format("{0}/ECERP/ECU/ECU005M?SESSION_ID={1}&FROM_LOGIN=Y", host, viewBagNotice.sessionID);
    // 팝업 오픈
    window.open(url, "CallBack", "height=800,width=800,menubar=no,resizable=no,titlebar=no,scrollbars=no,status=no,toolbar=no,menubar=no,location=no");
} 

function checkUrl() {
    var urlList =
        [
            //유형별로 URL기재 테스트용
            , "login.ecount.com"
            , "login.ecount.cn"
            , "loginf.ecount.cn"
            , "loginf2.ecount.cn"
            , "loginba.ecount.com"
            , "loginba2.ecount.com"
            , "loginca2.ecount.com"
            , "oapi.ecount.com"
            , "oapiba.ecount.com"
            , "sboapiba.ecount.com"
            , "sboapica.ecount.com"
            , "sboapi7.ecount.com"
            , "sboapi8.ecount.com"
            , "zeus.ecount.com"
            , "zeus01ba.ecount.com"
            , "zoapi03.ecount.com"
            , "zoapi03ba.ecount.com"
            , "zsboapi03.ecount.com"
            , "zsboapi02ba.ecount.com"
            , "zeus11.ecount.com"
            , "zsboapi11.ecount.com"
            , "stage.ecount.com"
            , "stageoapi.ecount.com"
            , "stagesboapi.ecount.com"
            , "hera.ecount.com"
            , "hoapi.ecount.com"
            , "hoapiba.ecount.com"
            , "hsboapiba.ecount.com"
        ];

    var count = 0;
    var errCount = 0;
    var resultArr = [];
    for (var i = 0; i < urlList.length; i++) {
        var url = oapiPageRedirect("ko-kr", urlList[i]);
        $.ajax({
            type: "GET",
            url: url,
            timeout: 3000,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("ImmediateExecute", "Y");
            },
            error: function (errorMsg) {
                debugger;
                errCount++;
                resultArr.push({ "URL": this.url});
                if (count + errCount == urlList.length) {
                    callResult(count, errCount, resultArr);
                }
            },
            success: function (resultData) {
                count++;
                if (count + errCount == urlList.length) {
                    callResult(count, errCount, resultArr);
                }
            }
        });
    }
}

function callResult(count, errCount, resultArr) {
    var msg = "각 카운트 정상건수 : " + count + "\n오류  : " + errCount ;

    if (resultArr.length > 0) {
        "\n오류내용 : "
    }
    for (var i = 0; i < resultArr.length; i++) {
        msg += "\n URL : " + resultArr[i].URL;
    }

    window.alert(msg);
}


function oapiPageRedirect(lantype, customDomain) {
    var element = document.getElementById("api");
    var domainurl = document.domain;
    var host = "";
    if (customDomain != null && customDomain != undefined) {
        domainurl = customDomain;
    }
    var sub = domainurl.substring(0, domainurl.indexOf("."));
    domainurl = domainurl.substring(domainurl.indexOf("."));


    if (sub.indexOf("sboapi") >= 0) {
        host = sub;
    }
    else if (match = /^(test|toapi|tsboapi)(-dev)?$/i.exec(sub))
        host = "tsboapi";
    else if (match = /^(zeus|zoapi|zsboapi)(\d*)([a-z|A-Z]+)?(\d*)$/i.exec(sub)) {
        debugger;
        host = "zsboapi" + (match[2] || "");
    }
    else if (match = /^(apollo|aopai|asboapi)(\d*)([a-z|A-Z]+)?(\d*)$/i.exec(sub)) {
        debugger;
        host = "asboapi" + (match[2] || "");
    }
    else if (match = /^(stage|stageoapi)(\d*)([a-z|A-Z]+)?/i.exec(sub)) {
        debugger;
        host = "stagesboapi" + (match[2] || "") /*+ (match[3] || "")*/;
    }
    else if (match = /^(hera|hopai|hsboapi)(\d*)([a-z|A-Z]+)?(\d*)$/i.exec(sub)) {
        debugger;
        host = "hsboapi" + (match[2] || "") + (match[3] || "") + (match[4] || "");
    }
    else if (match = /^(login|oapi|sboapi)(\d*)([a-z|A-Z]+)?(\d*)$/i.exec(sub)) {
        debugger;
        //sboapi의경우 서버별 번호는 바인딩 추가하지않음
        host = "sboapi" + (match[2] || "") + (match[3] || "") /* + (match[4] || "")*/;
    }
    else {
        host = "sboapi";
    }

    var url = "/ECERP/OAPI/OAPIView?lan_type=" + lantype;

    var url = "https://" + host + domainurl + url;

    if (customDomain != null && customDomain != undefined) {
        return url;
    } else {
        element.href = url;
    }
}