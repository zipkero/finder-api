window.__define_resource && __define_resource("MSG00277","MSG02325","MSG80143");
/**************************************************************************************************** 
1. Create Date : 20??.??.?? 
2. Creator     : unknown
3. Description : Login Process js
4. Precaution  : 
5. History     : (2018.08.30) 허성길 새로운 기기 알림 등록 팝업 추가
                 2020.11.16 (박흥산) - 로그인 2차인증
6. Old file    : unknown
* ***************************************************************************************************/
// 변수선언
//var _https = "https";
var _userAgent = navigator.userAgent.toUpperCase();
var _form = document.getElementById("frmSuccess");

window.onload = function () {    
    getLoginResult();
}

// excute login
function getLoginResult() {
    var comCode = viewBag.com_code;
    var userId = viewBag.id;
    var password = viewBag.passwd;
    var spassword = viewBag.spasswd;
    var lan_type = viewBag.lan_type;
    var isLoginTimeCheck = viewBag.logintimeinck;
    var isCookieless = false;
    var isLoginCheck = viewBag.loginck;
    var zone = viewBag.zone;
    var domain = viewBag.domain;
    var login_type = viewBag.login_type;
    var email = viewBag.email;
    var home_gubun = viewBag.home_gubun;
    var move_url = viewBag.move_url;
    var new_flag = viewBag.new_flag;
    var mailRefURL = viewBag.mailRefURL;
    var reqApiUrl = "/ECAPI/Common/Login/GetERPLoginResult";
    var oldComCd = viewBag.oldComCd;
    var oldUserId = viewBag.oldUserId;
    var currComCd = viewBag.currComCd;
    var currUserId = viewBag.currUserId
    var decryptPassword = viewBag.decryptPassword;
    var forceLogout = viewBag.forceLogout;
    var secondApproval = viewBag.secondApproval;
    var deviceKey = getDeviceCookie();

    if (login_type == "G") {    //ecu101m used
        sessionStorage.setItem('DemoMail', viewBag.email);
    }

    var param = {
        COM_CODE: comCode,
        USER_ID: login_type == "G" ? "GUEST" : userId,
        //PASSWORD: password,	
        SPASSWORD: spassword,
        EMAIL: email,
        ZONE: zone,
        DOMAIN: domain,
        LAN_TYPE: lan_type,
        LOGIN_TYPE: login_type ? login_type : "0",
        ACCESS_SITE: accessSite,
        MASTER_FLAG: mFlag,
        //SECESSION_LOGIN_FLAG: sFlag,
        IsLoginTimeCheck: isLoginTimeCheck,
        IsCookieless: isCookieless,
        IsLoginCheck: isLoginCheck,
        OLD_COM_CODE: oldComCd,
        OLD_USER_ID: oldUserId,
        CURR_COM_CODE: currComCd,
        CURR_USER_ID: currUserId,
        HOME_GUBUN: home_gubun,
        MOVE_URL: move_url,
        NEW_FLAG: new_flag,
        ADMIN_CHECKED: adminChecked,
        NO_HISTORY_IP_REASON: noHistoryIpReason,
        GetSessionInfo: "Y",
        ForceLogout: forceLogout,
        SECOND_APPROVAL: secondApproval,
        DEVICE_KEY: login_type == "G" ? "" : deviceKey,
        DEVICE_FLAG: deviceFlag
    };

    $.encryptAjax({
        type: "POST",
        dataType: "json",
        dataTypeCustom: 'json',
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: reqApiUrl,
        error: function (errorMsg) {
            alert(errorMsg);
        },
        success: function (returnData) {
            if (returnData.Status == "200") {
                if (returnData.Data.Code == "00") { // 로그인 정상, 이후 프로세스 진행

                    document.cookie = "second=;expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
                    var _ec_req_sid = returnData.Data.Datas.SESSION_ID;
                    var resultUrl = String.format("{0}&ec_req_sid={1}", returnData.Data.Datas.RESULT_URL.replace(/^\/\/ECERP\//i, "/ECERP/"), _ec_req_sid);

                    //top.location.href = $.ecrt(resultUrl);
                    $("#resultUrl").val(resultUrl);
                    $("#frmSuccess").submit();
                }
                else {                    
                    if (home_gubun == "E") { // 메일 수신문서확인 시 비밀번호오류 메세지 처리
                        switch (returnData.Data.Code) {
                            case "97":
                            alert(errorMsg.MSG00277);
                                break;
                            case "98":
                            alert(errorMsg.MSG02325);
                                break;
                            case "505":
                                break;
                            default:
                                alert(returnData.Data.Message);
                                break;
                        }

                        if (returnData.Data.Code == "505") {
                            if (confirm(errorMsg.MSG80143)) {
                                deviceFlag = "Y";
                            }
                            else {
                                deviceFlag = "N";
                            }

                            getLoginResult();
                            return;
                        }
                        else
                            location.href = mailRefURL;
                    }
                    else {
                        $("#zone").val(zone);
                        $("#login_domain").val(domain);

                        if (["86", "95", "402", "403", "404", "405","406","505"].contains(returnData.Data.Code)) { // 86: 탈퇴, 95: 관리자ID, 402: 패스워드 정기 변경, 403: 일정 기간 사용 기록이 없는 IP
                            $("#password").val(decryptPassword);
                            
                            if (returnData.Data.Code != "86") {
                                $("#loginck").val(isLoginCheck);            // [code, id] 저장 여부
                                $("#logintimeinck").val(isLoginTimeCheck);  // 출근 체크 여부
                            }
                    	}  

                        if (returnData.Data.Code == "505")
                            $("#m_flag").val(mFlag);
                        else
                            $("#m_flag").val(returnData.Data.Datas.MASTER_FLAG);
                        //$("#s_flag").val(returnData.Data.Datas.SECESSION_LOGIN_FLAG);
                        $("#error_code").val(returnData.Data.Code);
                        $("#error_msg").val(returnData.Data.Message);
                        if (!$.isEmpty(returnData.Data.LoginErrcountResult))
                            $("#loginErrcountResult").val(returnData.Data.LoginErrcountResult.toJSON());

                        var act = $("#frmError").attr("action");
                        if (act.indexOf("ECERP/LOGIN/ERPLoginProcessor") > 0) {
                            $("#frmError").attr("action", "/ECERP/Login/ERPLogin");
                        }
                        
                        if (!$.isEmpty(returnData.Data.Datas)) {
                            switch (returnData.Data.Code) {
                                case "95": // 관리자ID 로그인
                                    $("#con_type").val(returnData.Data.Datas.CON_TYPE ? returnData.Data.Datas.CON_TYPE : "");
                                    $("#uname").val(returnData.Data.Datas.UNAME ? returnData.Data.Datas.UNAME : "");
                                    break;
                                case "402": // 비밀번호 정기 변경
                                    $("#uname").val(returnData.Data.Datas.UNAME ? returnData.Data.Datas.UNAME : "");
                                    $("#yn_pwdskip").val(returnData.Data.Datas.YN_PWDSKIPEXPIRATIONDATE ? returnData.Data.Datas.YN_PWDSKIPEXPIRATIONDATE : "N");
                                    break;
                                case "403": // 일정 기간 사용 기록이 없는 IP
                                    $("#login_days").val(returnData.Data.Datas.LOGIN_DAYS ? returnData.Data.Datas.LOGIN_DAYS : "");
                                    $("#uname").val(returnData.Data.Datas.UNAME ? returnData.Data.Datas.UNAME : "");
                                    break;
                                case "404": // 임시사용차단
                                    $("#sessions").val(returnData.Data.Datas.AllSessionDatas);
                                    $("#noHistoryIpReason").val(returnData.Data.Datas.NoHistoryIpReason);
                                    $("#deviceKey").val(returnData.Data.Datas.DeviceKey);
                                    $("#deviceFlag").val(returnData.Data.Datas.DeviceFlag);
                                    break;
                                case "405":
                                case "406": // 2차인증
                                    $("#noHistoryIpReason").val(returnData.Data.Datas.NoHistoryIpReason);
                                    $("#deviceKey").val(returnData.Data.Datas.DeviceKey);
                                    $("#deviceFlag").val(returnData.Data.Datas.DeviceFlag);
                                    break;
                                case "505": // 새로운기기등록
                                    $("#noHistoryIpReason").val(returnData.Data.Datas.NoHistoryIpReason);
                                    break;
                            }
                            
                            $("#login_lantype").val(returnData.Data.Datas.LAN_TYPE ? returnData.Data.Datas.LAN_TYPE : ""); // 언어 설정
                            $("#brn_cd").val(returnData.Data.Datas.BRN_CD ? returnData.Data.Datas.BRN_CD : ""); // 지사코드
                        }

                        $("#frmError").submit();
                    }
                }
            }
            else {
                alert(returnData.Error.Message);
            }
        }
    });
}

function getDeviceCookie() {
    var cookieName = "EcNewDeviceKey";

    var deviceKey = $.cookie(cookieName);

    if ($.isEmpty(deviceKey)) {
        deviceKey = self.createCookieValue();

        $.cookie(cookieName, null, {
            expires: null, path: '/', domain: viewBag.domain
        });

        $.cookie(cookieName, deviceKey, {
            expires: 3650, path: '/', domain: viewBag.domain
        });
    }

    return deviceKey;
}

function createCookieValue() {
    var todayDate = new Date().format("yyyy-MM-dd HH-mm-ss");

    var cookieValue =
        String.format("{0}&{1}&{2}",
        parseInt(Math.random() * 10000),
        todayDate,
        parseInt(Math.random() * 1000)
        );

    return cookieValue;
}
