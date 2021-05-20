window.__define_resource && __define_resource("LBL13785");
/**************************************************************************************************** 
1. Create Date : 2019.02.19 
2. Creator     : Lee Eun Kyu
3. Description : Admin Login Gate
4. Precaution  : 
5. History     : 
6. Old file    : 
* ***************************************************************************************************/

window.onload = function () {    
    debugger;
    this.getAdminLoginResult(false);
}


// 로그인 시도
function getAdminLoginResult (isAdminChecked) {
    var _self = this;

    var param = {
        COM_CODE: _self.viewBag.com_code,
        USER_ID: _self.viewBag.user_id,
        ZONE: _self.viewBag.zone,
        SPASSWORD: _self.viewBag.spassword,
        ADMIN_CHECKED: isAdminChecked ? 'Y' : ''
    };

    $.encryptAjax({
        type: "POST",
        dataType: "json",
        dataTypeCustom: "json",
        data: Object.toJSON(param),
        contentType: 'application/json',
        async: false,
        url: "/ECAPI/Common/Login/GetERPLoginProcessorForAdminLogin",
        success: function (result) {
            if (result.Data) {
                var lanType = !$.isEmpty(result.Data.Data.Datas.LAN_TYPE) ? result.Data.Data.Datas.LAN_TYPE : "";

                switch (result.Data.CODE) {
                    case "00":  // 로그인 성공
                        var _moveHost = result.Data.Data.Datas.HOST_URL.replace("ecounterp", "ecount");
                        var _ec_req_sid = result.Data.Data.Datas.SESSION_ID;
                        resultUrl = String.format("https://{0}{1}&ec_req_sid={2}", _moveHost, result.Data.Data.Datas.RESULT_URL, _ec_req_sid);
                        location.href = resultUrl;
                        break;
                    case "93":
                    case "94":
                    case "95":
                        debugger;
                        var param = {
                            title: ecount.resource.LBL13785,
                            width: 550,
                            height: 330,
                            Request: {
                                Data: {
                                    EDIT_FLAG: result.Data.CODE == "95" ? "2" : (result.Data.CODE == "94" ? "1" : "0"),
                                    ZONE: _self.viewBag.zone,
                                    DOMAIN: _self.viewBag.DOMAIN,
                                    COM_CODE: _self.viewBag.com_code,
                                    USERID: _self.viewBag.user_id,
                                    CON_TYPE: !$.isEmpty(result.Data.Data.Datas.CON_TYPE) ? result.Data.Data.Datas.CON_TYPE : '',
                                    UNAME: !$.isEmpty(result.Data.Data.Datas.UNAME) ? result.Data.Data.Datas.UNAME : '',
                                    LAN_TYPE: !$.isEmpty(lanType) ? lanType : '',
                                    SPASSWD: '',
                                    isFromAdmin: true
                                }
                            }
                        };

                        _self.fnOpenDivPopUp('/ECERP/SVC/ECB/ECB002M', param);

                        //ecount.popup.openWindow({
                        //    url: '/ECERP/ECB/ECB002M',
                        //    name: popupParams.title,
                        //    param: popupParams,
                        //    popupType: false,
                        //    responseID: _self.callbackID,
                        //    __ecPageID: _self.ecPageID
                        //});
                        break;
                    default:
                        alert(result.Data.Data.Message.replace(/\\n/g, "<br/>"));
                        window.close();
                        break;
                }

            }
        }
    });    
}


function fnOpenDivPopUp(url, params) {
    $(window.document.body).append("<div class=\"dialog2\" id=\"ecdivpop\"></div>");

    require("jquery-ui-addon", function () {
        ecount.popup.openWindow({ url: url, popupID: "ECB002M", name: "ECB002M", param: params, popupType: false });
    });
}