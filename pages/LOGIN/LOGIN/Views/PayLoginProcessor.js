/**************************************************************************************************** 
1. Create Date : 20??.??.?? 
2. Creator     : unknown
3. Description : Login Process js
4. Precaution  : 
5. History     : 
6. Old file    : unknown
* ***************************************************************************************************/
// 변수선언
var _https = "https";
var _userAgent = navigator.userAgent.toUpperCase();
var _form = document.getElementById("frmSuccess");
var _ec_req_sid;

window.onload = function () {
    //if (_userAgent.indexOf("NT 5.1") > 0) {
    //    _https = "http";
    //}

    getLoginResult();
}

// excute login
function getLoginResult() {
    var comCode = viewBag.com_code;
    var userId = viewBag.id;
    var password = viewBag.passwd;
    var spassword = viewBag.spasswd;
    var lan_type = viewBag.lan_type;
    var isCookieless = false;
    var isLoginCheck = viewBag.loginck;
    var zone = viewBag.zone;
    var domain = viewBag.domain;
    var reqApiUrl = "/ECAPI/Common/Login/GetPayLoginResult";

    var param = {
        COM_CODE: comCode,
        USER_ID: userId,
        //PASSWORD: password,
        SPASSWORD: spassword,
        ZONE: zone,
        DOMAIN: domain,
        LAN_TYPE: lan_type,
        LOGIN_TYPE: "P",
        ACCESS_SITE: "PAY",
        IsCookieless: isCookieless
    };
    $.ajax({
        type: "POST",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: reqApiUrl,
        error: function (errorMsg) {
            alert(errorMsg);
        },
        success: function (returnData) {
            var param = "";
            var successUrl = "";

            if (returnData.Status == "200") {
                if (returnData.Data.Code == "00") { // 로그인 정상, 이후 프로세스 진행
                    //document.getElementById("domain").value = domain;

                    param = "&loginck=" + isLoginCheck
                        + "&domain=" + domain;

                    _ec_req_sid = returnData.Data.Datas.SESSION_ID;
                    successUrl = returnData.Data.Datas.HOST_URL;

                    loginSuccess(successUrl, param);
                }
                else {
                    $("#error_code").val(returnData.Data.Code);
                    $("#error_msg").val(returnData.Data.Message);
                    $("#frmError").submit();
                }
            }
            else {
                alert(returnData.Error.Message);
            }
        }
    });
}

function loginSuccess(url, param) {
    _form.target = "_parent";
    _form.action = _https + "://" + url + "/ECERP/LOGIN/PayLoginSuccess?ec_req_sid=" + _ec_req_sid + param;
    _form.submit();
}
