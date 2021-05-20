/****************************************************************************************************
1. Create Date : 2019.04.22
2. Creator     : 이일용
3. Description : SMS 인증하기
4. Precaution  :
5. History     : 
6. Old file    : 
****************************************************************************************************/

var fnConfirm = function () {
    debugger;
    var param = {
        CODE_NUM: $("#CODE_NUM").val(),
        CODE: pwSearchPram.CODE,
        COM_CODE: pwSearchPram.COM_CODE,
        ID: pwSearchPram.ID.replace("amp;", ""),
        TYPE: "CHK"
    };

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Infra/SaveResetLoginPasswords", //api 호출.
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
                    alert("인증번호가 일치하지 않습니다.\n다시 확인하고 입력부탁드립니다.")
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
    var frm = document.forms[0];
    frm["SESSION_ID"].value = data.SESSION_KEY;      
    frm["DOMAIN_FLAG"].value = pwSearchPram.DOMAIN_FLAG;
    frm["lan_type"].value = pwSearchPram.LAN_TYPE;
    frm["code"].value = pwSearchPram.CODE;
    frm["code_num"].value = $("#CODE_NUM").val();
    frm["com_code"].value = pwSearchPram.COM_CODE;
    frm["id"].value = pwSearchPram.ID.replace("amp;", "");
    frm["mobile"].value = pwSearchPram.MOBILE;
    frm.method = "POST";
    frm.action = "/ECERP/Popup.Common/PasswordChange";
    frm.submit();
 
}

var setEnter = function (obj, nextfield) {
    var keyCode = event.keyCode;
    if (keyCode == 13) {
        if ($("#" + nextfield).get(0) != undefined) {
            $("#" + nextfield).focus();
            return false
        }
    }
}

document.getElementById("CODE_NUM").focus();

// 제한시간 10분
window.setTimeout(function () {
    window.close();
}, 600000);


