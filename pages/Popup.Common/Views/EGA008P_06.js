window.__define_resource && __define_resource("BTN00008","MSG00522","MSG05649");
/****************************************************************************************************
1. Create Date : 2016.10.20
2. Creator     : 정명수
3. Description : SMS > 보내기 > 사업자인증
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EGA008P_06", {

/**************************************************************************************************** 
* user opion Variables(사용자변수 및 객체) 
****************************************************************************************************/

/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    onInitHeader: function (header) {
        header
            .setTitle("사업자 인증")
            .notUsedBookmark();
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),               //widget Control
            divTop = g.div(),                    //widget div
            divMiddle = g.div(),                 //widget div
            divBottom = g.div(),
            toolbarButtom = g.toolbar()//,         //widget Toolbar
            /*panel = g.panel()*/;

        divTop
            .html("사업자 인증")
            .css("wrapper-sub-title");

        divMiddle
            .html("이카운트 SMS발송서비스를 이용하기 위해서는 <font color='red'>개인/법인사업자의 인증</font>이 필요합니다.<br/><br/>");

        divBottom.html("* 사업자번호로 발행된 인증서만 사용 가능 합니다.");

        //panel
        //    .setAlign("center")
        //    .add(ctrl.define("widget.button", "Certificate").label("공인인증서로 인증하기").end());


        contents
            .add(divTop)
            .add(divMiddle)
//            .add(panel)
            .add(divBottom);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            control = widget.generator.control();

        toolbar.addLeft(control.define("widget.button", "certificate").label("공인인증서로 인증하기").end());
        toolbar.addLeft(control.define("widget.button", "close").label(ecount.resource.BTN00008).css("btn btn-default").end());

        footer.add(toolbar);
    },

/**************************************************************************************************** 
* define common event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
****************************************************************************************************/
    onLoadComplete: function (event) {

    },

/****************************************************************************************************
* define grid event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/

/**************************************************************************************************** 
* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    onFooterCertificate: function () {
        this.registerCertification();
    },
    onFooterClose: function () {
        this.close();
    },
/**************************************************************************************************** 
*  define hotkey event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
****************************************************************************************************/

/**************************************************************************************************** 
* define user function 
****************************************************************************************************/
    //인증서 등록 함수
    registerCertification: function () {
        var agent = navigator.userAgent.toLowerCase();
        var that = this;

        //인증서 검증
        var extractionCertificationData = function () {
            var POLICIES = "1 2 410 200012 1 1 3:범용기업|1 2 410 200004 5 1 1 7:범용기업|1 2 410 200005 1 1 5:범용기업|1 2 410 200004 5 2 1 1:범용기업|1 2 410 200004 5 4 1 2:범용기업|1 2 410 200004 5 3 1 2:범용기업|1 2 410 200005 1 1 6 8:국세청신고용|1 2 410 200004 5 4 2 80:국세청신고용|1 2 410 200004 5 2 1 5:범용기업|1 2 410 200004 5 2 1 6 257:국세청신고용|1 2 410 200004 5 4 1 31:국세청신고용|1 2 410 200012 5 1 1 171:국세청신고용|1 2 410 200005 1 1 2:은행보험신용카드기업|1 2 410 200004 5 1 1 3:용도제한기업|1 2 410 200004 5 1 1 12:용도제한기업|1 2 410 200005 1 1 6 1:은행기업|1 2 410 200004 5 3 1 5:용도제한기관|1 2 410 200004 5 4 1 5:용도제한기업|";

            var _nRet, _cert,
                _returnCertData = {
                    CertificationData: '',
                    CertificationKey: '',
                    CertificationEndDate: ''

                }, returnCertKey, returnCertEndDate;

            _nRet = TSToolkit.SetConfig("test", CA_LDAP_INFO, CTL_INFO, POLICIES,
                        INC_CERT_SIGN, INC_SIGN_TIME_SIGN, INC_CRL_SIGN, INC_CONTENT_SIGN,
                        USING_CRL_CHECK, USING_ARL_CHECK);

            if (_nRet > 0) {
                ecount.alert(_nRet + " : " + TSToolkit.GetErrorMessage());
                return false;
            }

            _nRet = TSToolkit.SetEncryptionAlgoAndMode(SYMMETRIC_ID_SEED, SYMMETRIC_MODE_CBC);
            if (_nRet > 0) {
                ecount.alert(_nRet + " : " + TSToolkit.GetErrorMessage());
                return false;
            }

            _nRet = TSToolkit.SelectCertificate(STORAGE_TYPE, 0, "");
            if (_nRet > 0) {
                ecount.alert(_nRet + " : " + TSToolkit.GetErrorMessage());
                return false;
            }

            _nRet = TSToolkit.GetCertificate(CERT_TYPE_SIGN, DATA_TYPE_PEM);
            if (_nRet > 0) {
                ecount.alert(_nRet + " : " + TSToolkit.GetErrorMessage());
                return false;
            }

            return true;
        };

        if (((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1)
            || agent.indexOf("msie") != -1) && agent.search('mobile') == -1) {
            if (extractionCertificationData()) {
                ecount.common.api({
                    url: '/Common/Infra/SaveSfsmCertification',
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            ecount.alert(ecount.resource.MSG00522, function () {
                                that.sendMessage(that, { callback: that.close.bind(that) });
                            });
                        }
                    }
                });
            } else {
                window.focus();
            }
        } else {
            ecount.alert(ecount.resource.MSG05649);
            return false;
        }
    }
});