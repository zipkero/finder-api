window.__define_resource && __define_resource("LGN00061","LGN00076","LGN00071","LGN00077","LGN00062","LGN00070","LGN00073","LGN00063","LGN00060","LGN00078","LGN00006","LGN00074","LGN00075","LGN00059");
/****************************************************************************************************
1. Create Date : 2017-03-21
2. Creator     : Choi Jun Young
3. Description : Menu:  로그인화면(erp, pay, cs) > 비밀번호찾기
                 세션키값을 갖고있지 않은 페이지.
4. Precaution  :
5. History     : 2020.05.04 (HoangLinh) - Check valid comcode
6. Old file    : 
****************************************************************************************************/

var _comCode;
var _domain;
var _zone;
var _eccnSiteStatus;
var _eccnSiteMsg;
var _dbConFlag;
var _csParentCode;

// ----------------------------------------------------------------------------------
// 1. 전역변수 선언 영역
// ----------------------------------------------------------------------------------
var _apiHost = window.location.host;

window.onload = function () {
    
}

var fnConfirm = function (validateMsg) {

    if ($("#comCd").val() == "" || !validCode($("#comCd").val())) {
        alert(pwSearchPram.LGN00061.replace(/<br\/>/gi, "\r\n"));
        $("#comCd").focus();
        return false;
    }

    if ($("#ID").val() == "") {
        alert(pwSearchPram.LGN00061.replace(/<br\/>/gi, "\r\n"));
        $("#ID").focus();
        return false;
    }

    getZone(validateMsg, "idcheck");
}

var fnIdCheckApi = function (validateMsg) {
    var param = {
        ID: $("#ID").val(),
        COM_CODE: $("#comCd").val(),
        MOBILE: "",
        TYPE: "ID"
    };

    var domainUrl = this.fnGetDomainUrl();

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: domainUrl + "/ECAPI/Common/Infra/SaveResetLoginPasswords", //api 호출.
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (result) {
            if (result.Status != "200") {
                alert(pwSearchPram.LGN00061.replace(/<br\/>/gi, "\r\n"));
                $("#ID").focus();
                return false;
            }
            else {
                if (result.Data.RESULT == "OK") {
                    $("#step1").get(0).style.display = 'none';
                    $("#step2").get(0).style.display = '';

                    $("#confirm").get(0).style.display = 'none';
                    $("#sendMail").get(0).style.display = '';

                    if (result.Data.USE_SMS == "Y")
                        $("#spanSms").get(0).style.display = '';
                    else
                        $("#spanSms").get(0).style.display = 'none';

                    fnDivMsg('email');

                    $("#restoreEmail").focus();
                } else {
                    alert(pwSearchPram.LGN00061.replace(/<br\/>/gi, "\r\n"));
                    $("#ID").focus();
                    return false;
                }
            }
        }
    });
}

var fnDivMsg = function (type) {
    $("#divMsgErp").get(0).style.display = 'none';
    $("#divMsgSms").get(0).style.display = 'none';
    $("#divMsgEmail").get(0).style.display = 'none';

    if (type == "sms")
        $("#divMsgSms").get(0).style.display = '';
    else if (type == "email")
        $("#divMsgEmail").get(0).style.display = '';
}

var fnSendEMail = function () {
    var validateMsg;

    // 올바른 코드와 복구 이메일을 입력하지 않았을 시 alert 문구
    switch (pwSearchPram.DOMAIN_FLAG) {
        case "C": //CS
            //validateMsg = String.format("{0}\n{1}\n{2}", pwSearchPram.LGN00076, pwSearchPram.LGN00071, pwSearchPram.LGN00077);
            validateMsg = String.format("{0}", pwSearchPram.LGN00062);
            validateMsg = validateMsg.replace(/<br\/>/gi, "\r\n");
            break;
        case "P": //USERPAY
            //validateMsg = String.format("{0}\n{1}\n{2}", pwSearchPram.LGN00070, pwSearchPram.LGN00071, pwSearchPram.LGN00073);
            validateMsg = String.format("{0}", pwSearchPram.LGN00063);
            validateMsg = validateMsg.replace(/<br\/>/gi, "\r\n");
            break;
        default:  //E : ERP
            validateMsg = String.format("{0}", pwSearchPram.LGN00060); // LGN00078
            validateMsg = validateMsg.replace(/<br\/>/gi,"\r\n");
            break;
    }
    
    // 회사코드 필수여부
    if ($("#comCd").val() == "" || !validCode($("#comCd").val())) {
        alert(validateMsg);
        $("#comCd").focus();
        return false;
    }

    // cs id체크
    if (pwSearchPram.DOMAIN_FLAG == "C") {
        if ($("#csID").val() == "") {
            alert(validateMsg);
            $("#csID").focus();
            return false;
        }
    }

    var email = $("#eMail");
    if (pwSearchPram.DOMAIN_FLAG == "E") {
        email = $("#restoreEmail");
    } 

    // 메일 체크 
    if (email.val() == "") {
        alert(validateMsg);
        email.focus();
        return false;
    }

    var regex = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,15}(?:\.[a-zA-Z]{2})?)$/;
    if (regex.test(email.val()) == false) {
        alert(validateMsg);
        email.focus();
        return false;
    }

    getZone(validateMsg, 'email');
}

// Zone 정보 가져오기
var getZone = function (validateMsg, checktype) {
    var comCode = $("#comCd").val();
    var param = {
        COM_CODE: comCode.toUpperCase(),
        SERVICE: pwSearchPram.DOMAIN_FLAG == "C" ? "CS" : "LOGIN"   // E:"LOGIN", C:"CS", P:"PAY"
    };
    $.ajax({
        type: "POST",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Login/GetZone", // zone정보
        error: function (errorMsg) {
            alert(pwSearchPram.LGN00006); // 회사코드가 존재하지 않습니다.
        },
        success: function (returnData) {
            if (returnData.Status == "200" && !returnData.Data.EMPTY_ZONE) {
                _comCode = returnData.Data.COM_CODE;
                _domain = returnData.Data.DOMAIN.replace("ecounterp", "ecount");
                _zone = returnData.Data.ZONE;
                _eccnSiteStatus = returnData.Data.STATUS;
                _eccnSiteMsg = returnData.Data.MSG;
                _dbConFlag = returnData.Data.DB_CON_FLAG;
                _csParentCode = returnData.Data.CS_COM_CODE; // 거래관리 시스템 본 회사코드

                if (checktype == "idcheck")
                    fnIdCheckApi(validateMsg);
                else
                    fnCallApi(validateMsg);
            }
            else {
                alert(pwSearchPram.LGN00006); // 회사코드가 존재하지 않습니다.
                $("#comCd").focus();
            }
        }
    });
}

var fnLinkBoard = function () {
    
    var width = 835;
    var height = 700;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);

    window.open("/ECERP/Popup.Common/PasswordSearchNotice?DOMAIN_FLAG=E&lan_type=" + (pwSearchPram.LAN_TYPE || "ko-KR"), "searchPasswordNotice", "scrollbars=no,resizable=yes,copyhistory=no,scrollbars=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
}

// password chk API 호출
var fnCallApi = function (validateMsg) {
    
    var param = {
        COM_CODE: pwSearchPram.DOMAIN_FLAG == "C" ? _comCode : $("#comCd").val(), // 입력한 회사코드
        SERVICE: pwSearchPram.DOMAIN_FLAG == "C" ? "CS" : "LOGIN",   // E:"LOGIN", C:"CS", P:"PAY"
        ZONE: _zone,
        DOMAIN: _domain,
        DOMAIN_FLAG: pwSearchPram.DOMAIN_FLAG,
        LAN_TYPE: pwSearchPram.LAN_TYPE || "ko-KR",
        EMAIL: pwSearchPram.DOMAIN_FLAG == "E" ? $("#restoreEmail").val() : $("#eMail").val(),
        DB_CON_FLAG: _dbConFlag || "5",
        CS_COM_CODE: _csParentCode || "",
        SUB_TYPE: "",
        ID: pwSearchPram.DOMAIN_FLAG == "E" ? $("#ID").val() : ""
    };

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Infra/CheckPasswordFind", //api 호출.
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (returnData) {
            // 2. 결과값 가지고 이벤트처리.
            if (returnData.Status == "200") {
                if (returnData.Data.Data) {
                    alert(String.format("{0}\n{1}", pwSearchPram.LGN00074, pwSearchPram.LGN00075));
                    window.close();
                }
                else
                    alert(validateMsg);
            }
        }
    });
}


var fnGetDomainUrl = function () {
    // URL 정보 세팅
    var domain = document.domain;
    var host = domain.substring(0, domain.indexOf("."));
    domain = domain.substring(domain.indexOf("."));

    // 센터, 스테이징서버만 서브 도메인 + zone 구성으로 재생성. 테스트 환경은 접속된 도메인으로 생성.
    if (host.indexOf("login") > -1) {
        host = "login" + _zone;
    }
    else if (host.indexOf("stage") > -1) {
        host = "stage" + _zone;
    }

    var url = "https://" + host + domain;

    return url;
}

// password chk API 호출
var fnSmsApi = function (validateMsg) {

    var domainUrl = this.fnGetDomainUrl();

    var param = {
        DOMAIN_FLAG: pwSearchPram.DOMAIN_FLAG,
        LAN_TYPE: pwSearchPram.LAN_TYPE || "ko-KR",
        COM_CODE: $("#comCd").val(),
        ID: $("#ID").val(),
        TYPE: "SMS",
        MOBILE: $("#restoreMobile").val()
    };
    
    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: domainUrl + "/ECAPI/Common/Infra/SaveResetLoginPasswords",
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (result) {
            if (result.Status != "200") {
                alert(pwSearchPram.LGN00059.replace(/<br\/>/gi, "\r\n")); // 입력한 모바일 번호가 일치하지 않습니다. [...]
                $("#restoreMobile").focus();
                return false;
            }
            else
            {
                if (result.Data.RESULT == "E000") {
                    fnRecoverySMS(result.Data);
                } else {
                    alert(pwSearchPram.LGN00059.replace(/<br\/>/gi, "\r\n")); // 입력한 모바일 번호가 일치하지 않습니다. [...]
                    $("#restoreMobile").focus();
                    return false;
                }
            }
        }
    });
}

function fnRecoverySMS(data) {

    var width = 520;
    var height = 350;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
   
    var param = {
        DOMAIN_FLAG: pwSearchPram.DOMAIN_FLAG,
        LAN_TYPE: pwSearchPram.LAN_TYPE || "ko-KR",
        COM_CODE: $("#comCd").val(),
        ID: $("#ID").val(),
        TYPE: "SMS",
        MOBILE: $("#restoreMobile").val()
    };

    var domainUrl = this.fnGetDomainUrl();

    var url = domainUrl + String.format("/ECERP/Popup.Common/PasswordAuthentication?DOMAIN_FLAG={0}&lan_type={1}&CODE={2}&COM_CODE={3}&ID={4}&MOBILE={5}"
        , encodeURIComponent(param.DOMAIN_FLAG)
        , encodeURIComponent(param.LAN_TYPE)
        , encodeURIComponent(data.CODE)
        , encodeURIComponent(param.COM_CODE)
        , encodeURIComponent(param.ID)
        , encodeURIComponent(param.MOBILE));

    // 팝업 오픈
    window.open(url, "PasswordAuthentication", "scrollbars=no,resizable=yes,copyhistory=no,scrollbars=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
    
    // 1초후 창닫기
    window.setTimeout(function () {
        window.close();
    }, 500)
}

var setEnter = function (obj, nextfield) {
    var keyCode = event.keyCode;
    if (keyCode == 13) {
        if ($("#" + nextfield).get(0) != undefined) {
            $("#" + nextfield).focus();
            return false
        }
        else {
            $("#eMail").focus();
        }
    }
}

var setChangeRadio = function (obj, nextfield) {
    if (nextfield == "restoreEmail" || nextfield == "restoreMobile") {
        if (pwSearchPram.DOMAIN_FLAG != 'E') {
            return;
        } else {
            if (nextfield == "restoreEmail") {
                $("#sendMobile").get(0).style.display = 'none';
                $("#sendMail").get(0).style.display = '';

                $("#trInputMail").get(0).style.display = '';
                $("#trInputSms").get(0).style.display = 'none';

                this.fnDivMsg('email');
            }
            else {
                $("#sendMobile").get(0).style.display = '';
                $("#sendMail").get(0).style.display = 'none';

                $("#trInputMail").get(0).style.display = 'none';
                $("#trInputSms").get(0).style.display = '';

                this.fnDivMsg('sms');
            }
        }
    }
}

document.getElementById("comCd").focus();

if (pwSearchPram.DOMAIN_FLAG != 'E') {
    $("#sendMail").get(0).style.display = '';
} else {
    $("#confirm").get(0).style.display = '';
}


var validCode = function validCode(value) {
    value = value.replace(' ', '');

    if (value === undefined || value === "")
        return false;

    return (/^\w|\d+$/.test(value));
}