window.__define_resource && __define_resource("LGN00371","MSG00308","MSG02826","MSG00362","MSG00309","MSG02827","MSG02828","MSG02829","MSG02830","MSG02831","MSG01395","MSG70593");
/****************************************************************************************************
1. Create Date : 2020.09.23
2. Creator     : 한재국
3. Description : Menu:  로그인화면(erp) > 로그인정보찾기 > 비밀번호 변경(세션키값을 갖고있지 않은 페이지)
4. Precaution  :
5. History     :		2020.10.27 (김동수) : A20_05459 - 비밀번호 최소자리수 변경
6. Old file    : 
****************************************************************************************************/

window.onload = function () {
    debugger;
    if (this.viewBag.InitDatas.isExpiry == true) {
        alert(Resource.LGN00371.replace(/<br\/>/gi, "\r\n"));
        this.close();
        return;
    }
    var target = document.getElementById("ddlUser");
    var dataList = this.viewBag.InitDatas.LoadData;
    var com_code = $("#ddlComCode option:selected").get(0).value;

    target.options.length = 0;

    for (x in dataList) {
        if (dataList[x].COM_CODE == com_code) {
            if (dataList[x].PW_CHNG_TF == 0) {
                var opt = document.createElement("option");
                opt.value = dataList[x].PW_CRTK;
                opt.innerHTML = dataList[x].USER_ID;
                target.appendChild(opt);
            }
        }
    }	
}

// 비밀번호 유효성 체크
var fnPasswordChangeValidator = function () {

    debugger;
    var com_code = $("#ddlComCode option:selected").get(0).value;
    var id = $("#ddlUser option:selected").text();
    var key = $("#ddlUser").get(0).value;
    var NewPassword = $("#NewPassword").get(0).value;
    var ConfirmPassword = $("#ConfirmPassword").get(0).value;

    var domainFlag = $("#DOMAIN_FLAG").get(0).value;
    var pwdLevel = $("#pwdLevel").get(0).value;
    
    if ($("#NewPassword").val() == "") {
        alert(Resource.MSG00308);
        $("#NewPassword").focus();
        return false;
    }
    
    if ($("#ConfirmPassword").val() == "") {
        alert(Resource.MSG00308);
        $("#ConfirmPassword").focus();
        return false;
    }

    var result = fnPwValidationChk("#NewPassword", id, pwdLevel);
    if (result == false) {
        return result;
    }
    debugger;
    var loadAcc001Data = this.viewBag.InitDatas.Acc001Data;
    for (var i = 0; i < loadAcc001Data.length; i++) {
        if (loadAcc001Data[i].COM_CODE == com_code && loadAcc001Data[i].strPwdLevel == "2" && (domainFlag == "E")) {
            var strPwuper = NewPassword.toUpperCase().toString();
            var json_data = loadAcc001Data[i];
            var result = [];

            for (var temp in json_data) {
                if (temp != "strPwdLevel" && temp != "strGbPwdexpirationdate") {
                    result.push([json_data[temp]]);
                }
            }

            for (var j = 0; j < result.length; j++) {
                if (result[j].toString() != "" && strPwuper.indexOf(result[j].toString().toUpperCase()) > -1) {
                    alert(Resource.MSG02826 + " " + result[j].toString());
                    $("#NewPassword").get(0).focus();
                    return false;
                    break;
                }
            }
        }
    }

    if (id.toUpperCase() == $("#NewPassword").val().toUpperCase()) {
        alert(Resource.MSG00362);
        $("#ConfirmPassword").focus();
        return false;
    }

    if ($("#NewPassword").val() != $("#ConfirmPassword").val()) {
        alert(Resource.MSG00309);
        $("#ConfirmPassword").focus();
        return false;
    }

    // 비밀번호 저장 실행 (Api Call)
    fnPasswordChangeSave();
}


// 작성자 :
// 내  용 : 패스워드 기본 체크 구문
// 사용법 : 
// 설  명 : 비밀 번호 변경시.... 공통script 를 가져온것임
var fnPwValidationChk = function(strfild, userid, level) {
    var strPwd = $(strfild).get(0).value;
    var alpaBig1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var alpaBig2 = "ZYXWVUTSRQPONMLKJIHGFEDCBA";
    var alpaSmall1 = "abcdefghijklmnopqrstuvwxyz";
    var alpaSmall2 = "zyxwvutsrqponmlkjihgfedcba";
    var num1 = "0123456789";
    var num2 = "9876543210";
    var pw_rep_check1 = /(\w)\1\1/;
    var pw_rep_check2 = /(\W)\1\1/;
    var chk_num = strPwd.search(/[0-9]/g);
    var chk_eng = strPwd.search(/[a-z]/ig);
    var pw_len_check = /^[A-Za-z0-9\!\@\#\$\%\^\&\*\(\)\_\+\|\{\}\<\>\:\;\[\]\-\=\,\.\?]{10,15}$/;
    var strblankck = /\s/;

    //입력형식
    if (!pw_len_check.test(strPwd)) {
        alert(Resource.MSG02827);
        $(strfild).get(0).focus();
        return false;
    }

    //영문, 숫자 조합
    if (chk_num < 0 || chk_eng < 0) {
        alert(Resource.MSG02828);
        $(strfild).get(0).focus();
        return false;
    }

    //공백 체크
    if (strblankck.exec(strPwd)) {
        alert(Resource.MSG02829);
        $(strfild).get(0).focus();
        return false;
    }

    if (level.toString() != "0") {
        //반복된 형식 찾기
        if (pw_rep_check1.test(strPwd) || pw_rep_check2.test(strPwd)) {
            alert(Resource.MSG02830);
            $(strfild).get(0).focus();
            return false;
        }

        //연속된 형식 찾기                
        for (var i = 0; i < strPwd.length; i++) {
            if ((i + 3) <= strPwd.length) {
                if ((alpaBig1.indexOf(strPwd.substring(i, i + 3)) > -1) || (alpaBig2.indexOf(strPwd.substring(i, i + 3)) > -1) ||
                   (alpaSmall1.indexOf(strPwd.substring(i, i + 3)) > -1) || (alpaSmall2.indexOf(strPwd.substring(i, i + 3)) > -1) ||
                   (num1.indexOf(strPwd.substring(i, i + 3)) > -1) || (num2.indexOf(strPwd.substring(i, i + 3)) > -1))
                {
                    alert(Resource.MSG02831);
                    $(strfild).get(0).focus();
                    return false;
                }
            }
        }

        if (userid != "" && strPwd.toUpperCase().indexOf(userid.toUpperCase()) > -1) {
            alert(Resource.MSG01395);
            return false;
        }
    }

    return true;
}


var fnPasswordChangeSave = function () {
    var id = $("#ddlUser option:selected").text();
    var key = $("#ddlUser").get(0).value;
    var com_code = $("#ddlComCode option:selected").get(0).value;

    var param = {
        COM_CODE: com_code,
        CS_COM_CODE: $("#outside_com_code").val(),
        DOMAIN_FLAG: $("#DOMAIN_FLAG").val(),
        LAN_TYPE: $("#lan_type").val() || "ko-KR",
        EMAIL: $("#to_mail").val(),
        MOBILE: $("#mobile").val(),
        ID: id,
        ID_KEY: key,
        SEND_GUID: $("#send_guid").val(),
        DB_CON_FLAG: $("#db_con_flag").val(),
        ZONE: $("#zone").val(),
        NEWPASSWORD: $("#NewPassword").val(),
        SUB_TYPE: $("#sub_type").val()
    };

    $.ajax({
        type: "post",
        dataType: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Infra/SaveLoginInfoSearch",
        error: function (errorMsg) {
            alert("ERROR");
        },
        success: function (returnData) {
            if (returnData.Status == "200") {
                if (returnData.Data == true) {
                    alert(Resource.MSG70593);
                    //location.reload();
                    window.close();
                } else if (returnData.Data == false) {
                    //location.reload();
                    window.close();
                } else if (returnData.Data.indexOf("ERROR") > -1) {
                    alert(returnData.Data.replace("ERROR:", ""));
                    $("#NewPassword").get(0).focus();
                }
            }
        }
    });
}
debugger;
var setEnter = function (obj, nextfield) {
    var keyCode = event.keyCode;
    if (keyCode == 13) {
        if ($("#" + nextfield).get(0) != undefined) {
            $("#" + nextfield).focus();
            return false
        }
        else {
            $("#ddlUser").focus();
        }
    }
}

if ($("#NewPassword").get(0) != undefined) {
	document.getElementById("NewPassword").focus();
}

var categoryChange = function (e) {
    debugger;
    var target = document.getElementById("ddlUser");
    var dataList = this.viewBag.InitDatas.LoadData;

    target.options.length = 0;

    for (x in dataList) {
        if (dataList[x].COM_CODE == e.value) {
            if (dataList[x].PW_CHNG_TF == 0) {
                var opt = document.createElement("option");
                opt.value = dataList[x].PW_CRTK;
                opt.innerHTML = dataList[x].USER_ID;
                target.appendChild(opt);
            }
        }
    }	
}


window.resizeTo(650, 500);
