window.__define_resource && __define_resource("LGN00364","LGN00365","LGN00368","LGN00366","LGN00059","LGN00374","LGN00367","LGN00369","LGN00370");
/****************************************************************************************************
1. Create Date : 2020.09.21
2. Creator     : 한재국
3. Description : Menu:  로그인화면(erp) > 로그인정보찾기(세션키값을 갖고있지 않은 페이지.)
4. Precaution  :
5. History     : 
6. Old file    : 
****************************************************************************************************/

var _comCode;
var _domain;
var _zone;
var _eccnSiteStatus;
var _eccnSiteMsg;
var _dbConFlag;
var _csParentCode;
var _result;
var _canSend;
var _isExpiryNum;

// ----------------------------------------------------------------------------------
// 1. 전역변수 선언 영역
// ----------------------------------------------------------------------------------
var _apiHost = window.location.host;

window.onload = function () {
    
}

var fnDivMsg = function (type) {
    $("#divMsgSms").get(0).style.display = 'none';
    $("#divMsgEmail").get(0).style.display = 'none';

    if (type == "sms")
        $("#divMsgSms").get(0).style.display = '';
    else if (type == "email")
        $("#divMsgEmail").get(0).style.display = '';
}

//메일 발송API
var fnSendEMailApi = function () {
    debugger;
    var validateMsg;

    // 올바른 코드와 복구 이메일을 입력하지 않았을 시 alert 문구
    switch (pwSearchPram.DOMAIN_FLAG) {
        default:  //E : ERP
            validateMsg = String.format("{0}", pwSearchPram.LGN00364); // LGN00364
            validateMsg = validateMsg.replace(/<br\/>/gi,"\r\n");
            break;
    }

    // 성명 필수여부
    if ($("#UNAME").val() == "") {
        alert(validateMsg);
        $("#UNAME").focus();
        return false;
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

    var param = {
        DOMAIN_FLAG: pwSearchPram.DOMAIN_FLAG,
        LAN_TYPE: pwSearchPram.LAN_TYPE || "ko-KR",
        UNAME: $("#UNAME").val(),
        TYPE: "EMAIL",
        EMAIL: $("#restoreEmail").val()
    };
    var regex = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,15}(?:\.[a-zA-Z]{2})?)$/;
    if (regex.test(email.val()) == false) {
        alert(validateMsg);
        email.focus();
        return false;
    }

    var domainUrl = this.fnGetDomainUrl();

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: domainUrl + "/ECAPI/Common/Infra/SaveResetLoginInfo",
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (result) {
            if (result.Status == "200") {
                if (result.Data.RESULT == "X") {
                    alert(pwSearchPram.LGN00364.replace(/<br\/>/gi, "\r\n"));
                }
                else {
                    _domain = result.Data.DOMAIN;
                    _result = result.Data;
                    fnCallApi(result.Data);
                }
            }
        }
    });
}


var fnCallApi = function (data) {
    debugger;

    var param = {
        COM_CODE: data.COM_CODE,
        SERVICE: pwSearchPram.DOMAIN_FLAG == "C" ? "CS" : "LOGIN",   // E:"LOGIN", C:"CS", P:"PAY"
        ZONE: data.zone,
        DOMAIN: _domain,
        DOMAIN_FLAG: pwSearchPram.DOMAIN_FLAG,
        LAN_TYPE: pwSearchPram.LAN_TYPE || "ko-KR",
        EMAIL: pwSearchPram.DOMAIN_FLAG == "E" ? $("#restoreEmail").val() : $("#eMail").val(),
        DB_CON_FLAG: data.DB_CON_FLAG || "5",
        CS_COM_CODE: _csParentCode || "",
        SUB_TYPE: "",
        ID: data.ID,
        UNAME: data.UNAME,
        RESULT_LIST: data.RESULT_LIST
    };

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Infra/CheckPasswordFindForEmail", //api 호출.
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (returnData) {
            // 2. 결과값 가지고 이벤트처리.
            if (returnData.Status == "200") {
                if (returnData.Data.Data) {
                    alert(pwSearchPram.LGN00365.replace(/<br\/>/gi, "\r\n"));
                    window.close();
                }
                else
                    alert(pwSearchPram.LGN00364.replace(/<br\/>/gi, "\r\n"));
            }
        }
    });
}

// 인증번호 발송 api 호출
var fnSendSmsApi = function () {
    debugger;

    if (this._canSend == false) {
        alert(pwSearchPram.LGN00368);
        return false;
    }

    // 올바른 코드와 복구 이메일을 입력하지 않았을 시 alert 문구
    switch (pwSearchPram.DOMAIN_FLAG) {
        default:  //E : ERP
            validateMsg = String.format("{0}", pwSearchPram.LGN00366); // LGN00366
            validateMsg = validateMsg.replace(/<br\/>/gi, "\r\n");
            break;
    }

    if ($("#UNAME").val() == "" || $("#restoreMobile").val() == "") {
        alert(validateMsg);
        return false;
    }

    var domainUrl = this.fnGetDomainUrl();
    var that = this;

    var param = {
        DOMAIN_FLAG: pwSearchPram.DOMAIN_FLAG,
        LAN_TYPE: pwSearchPram.LAN_TYPE || "ko-KR",
        UNAME: $("#UNAME").val(),
        TYPE: "SMS",
        MOBILE: $("#restoreMobile").val()
    };

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: domainUrl + "/ECAPI/Common/Infra/SaveResetLoginInfo",
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (result) {
            if (result.Status != "200") {
                alert(pwSearchPram.LGN00059.replace(/<br\/>/gi, "\r\n")); // 입력한 모바일 번호가 일치하지 않습니다. [...]
                $("#restoreMobile").focus();
                return false;
            }
            else {
                // 정상(SMS로 비밀번호 변경가능한 회사코드가 조회되었을때(한국 회사코드))
                if (result.Data.RESULT == "E000" || result.Data.RESULT == "E001") {
                    if ($("#confirmCode").get(0).style.display != '') {
                        $("#confirmCode").get(0).style.display = '';
                        $("#sendMobile").get(0).style.display = '';
                        var dateObj = new Date();
                        dateObj.setMinutes(dateObj.getMinutes() + 10);
                        setCountDown('countTime', dateObj);
                    }
                    that._canSend = false;
                    _result = result.Data;
                    // 경고(한국,해외 회사코드가 전부 조회되었을때, 한국회사코드에 한해서만 변경가능) 
                    if (result.Data.RESULT == "E001") {
                        alert(pwSearchPram.LGN00374.replace(/<br\/>/gi, "\r\n"));  // SMS 인증이 불가능한 번호입니다. [...]
                    } else {
                        alert(pwSearchPram.LGN00367.replace(/<br\/>/gi, "\r\n"));  // [SMS 인증번호]가 발송되었습니다. [...]
                    }
                }
                // 불가(해외 회사코드만 조회되었을때)
                else if (result.Data.RESULT == "E901") {
                    alert(pwSearchPram.LGN00374.replace(/<br\/>/gi, "\r\n")); 
                    return false;
                }
                else {
                    alert(validateMsg); // 입력한 성명 또는 모바일 번호가 확인되지 않습니다. [...]
                    $("#restoreMobile").focus();
                    return false;
                }
            }
        },
        complete: function () {
            // 2분뒤 재전송 가능하도록
            that.setTimeout(function () {
                that._canSend = true;
            }, 120000);
        }
    });
}


var fnConfirm = function () {
    debugger;
    var validateMsg;

    // 올바른 코드와 복구 이메일을 입력하지 않았을 시 alert 문구
    switch (pwSearchPram.DOMAIN_FLAG) {
        default:  //E : ERP
            validateMsg = String.format("{0}", pwSearchPram.LGN00369); // LGN00369
            validateMsg = validateMsg.replace(/<br\/>/gi, "\r\n");
            break;
    }

    var CODE_NUM = $("#CODE_NUM");

    if ($.isEmpty(_result) || CODE_NUM.val() == "") {
        alert(validateMsg);
        return false;
    }

    if (this._isExpiryNum == true) {
        alert(pwSearchPram.LGN00370.replace(/<br\/>/gi, "\r\n")); 
        return false;
    }

    var param = {
        CODE_NUM: $("#CODE_NUM").val(),
        CODE: _result.CODE,
        COM_CODE: _result.COM_CODE,
        ID: _result.ID,
        MOBILE: _result.MOBILE,
        UNAME: _result.UNAME,
        TYPE: "CHK"
    };

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Infra/SaveResetLoginInfo", //api 호출.
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (result) {
            debugger;
            if (result.Status != "200") {
                ecount.alert(result.fullErrorMsg);
                return false;
            }
            else {
                if (result.Data.RESULT == "OK") {
                    fnPasswordChange(result.Data);
                } else {
                    alert(validateMsg);
                }
            }
        }
    });
}

var fnPasswordChange = function (data) {
    debugger;

    var width = 450;
    var height = 330; 
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);
    /*
    // url 설정
    var url = String.format("/ECERP/Popup.Common/PasswordChange?SESSION_ID={0}&DOMAIN_FLAG={1}&lan_type={2}&code={3}&code_num={4}&com_code={5}&id={6}&mobile={7}"
        , data.SESSION_KEY
        , pwSearchPram.DOMAIN_FLAG
        , pwSearchPram.LAN_TYPE
        , pwSearchPram.CODE
        , $("#CODE_NUM").val()
        , pwSearchPram.COM_CODE
        , pwSearchPram.ID
        , pwSearchPram.MOBILE
    );

    location.href = url;
   */

    var domain = document.domain;
    var host = domain.substring(0, domain.indexOf("."));
    domain = domain.substring(domain.indexOf("."));

    // 센터, 스테이징서버만 서브 도메인 + zone 구성으로 재생성. 테스트 환경은 접속된 도메인으로 생성.
    if (host.indexOf("login") > -1) {
        host = "login" + _result.zone;
    }
    else if (host.indexOf("stage") > -1) {
        host = "stage" + _result.zone;
    }

    var url = "https://" + host + _result.DOMAIN;

    var frm = document.forms[0];
    frm["SESSION_ID"].value = data.SESSION_KEY;
    frm["DOMAIN_FLAG"].value = pwSearchPram.DOMAIN_FLAG;
    frm["lan_type"].value = pwSearchPram.LAN_TYPE;
    frm["code"].value = data.CODE;
    frm["code_num"].value = $("#CODE_NUM").val();
    frm["com_code"].value = data.COM_CODE;
    frm["id"].value = data.ID;
    frm["mobile"].value = data.MOBILE;
    frm["uname"].value = data.UNAME;
    frm["RESULT_LIST"].value = _result.RESULT_LIST;
    frm.method = "POST";
    frm.action = url.replace("ecounterp", "ecount") + "/ECERP/Popup.Common/LoginInfoChange";
    frm.submit();

}

var fnLinkBoard = function () {
    
    var width = 835;
    var height = 700;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);

    window.open("/ECERP/Popup.Common/PasswordSearchNotice?DOMAIN_FLAG=E&lan_type=" + (pwSearchPram.LAN_TYPE || "ko-KR"), "searchPasswordNotice", "scrollbars=no,resizable=yes,copyhistory=no,scrollbars=no,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
}

var fnGetDomainUrl = function () {
    // URL 정보 세팅
    var domain = document.domain;
    var host = domain.substring(0, domain.indexOf("."));
    domain = domain.substring(domain.indexOf("."));

    var url = "https://" + host + domain;

    return url.replace("ecounterp", "ecount");
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
    debugger;
    if (nextfield == "restoreEmail" || nextfield == "restoreMobile") {
        if (pwSearchPram.DOMAIN_FLAG != 'E') {
            return;
        } else {
            if (nextfield == "restoreEmail") {
                $("#sendMail").get(0).style.display = '';

                $("#trInputMail").get(0).style.display = '';
                $("#trInputSms").get(0).style.display = 'none';

                $("#confirmCode").get(0).style.display = 'none';

                this.fnDivMsg('email');
            }
            else {
                $("#sendMail").get(0).style.display = 'none';

                $("#trInputMail").get(0).style.display = 'none';
                $("#trInputSms").get(0).style.display = '';

                if (!$.isEmpty(_result)) {
                    $("#confirmCode").get(0).style.display = '';
                }

                this.fnDivMsg('sms');
            }
        }
    }
}

var setCountDown = function (id, date) {

    var _vDate = new Date(date); // 전달 받은 일자

    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60; var _day = _hour * 24;
    var timer;
    function showRemaining() {
        var now = new Date();
        var distDt = _vDate - now;
        if (distDt < 0) {
            clearInterval(timer);
            document.getElementById(id).textContent = '(00:00)';
            this._isExpiryNum = true;
            return;
        }
        var days = Math.floor(distDt / _day);
        var hours = Math.floor((distDt % _day) / _hour);
        var minutes = Math.floor((distDt % _hour) / _minute);
        var seconds = Math.floor((distDt % _minute) / _second);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById(id).textContent = '(';
        document.getElementById(id).textContent += minutes;
        document.getElementById(id).textContent += ':';
        document.getElementById(id).textContent += seconds;
        document.getElementById(id).textContent += ')';

    }

    timer = setInterval(showRemaining, 0);
}


document.getElementById("UNAME").focus();

var validCode = function validCode(value) {
    value = value.replace(' ', '');

    if (value === undefined || value === "")
        return false;

    return (/^\w|\d+$/.test(value));
}