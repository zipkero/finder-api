window.__define_resource && __define_resource("LBL10243","LBL10239","LBL10240","LBL10241","LBL10237","MSG05625","BTN00065","BTN00008","BTN00033","LBL10236","LBL01258","LBL09676","LBL10232","MSG05635","MSG05633","MSG05632","MSG05631","MSG05630","MSG05629","MSG00299","MSG05641");
/****************************************************************************************************
1. Create Date : 2016.10.17
2. Creator     : 정명수
3. Description : SMS > 발신번호인증 > 신규 (SMS > Caller ID Authentication > Register Sender ID)
4. Precaution  :
5. History     :	2019.08.27(양미진) - A19_03069 dev 28560  SMS 발신번호인증 자료 삭제 요청
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EGA008P_04", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    checkSeconds: 0,
    isTimeout: false,
    intervalIndex: 0,
    callerInfo: null,
    fileData: null,
    wrongCount: 0,
    isSave: false,
    authCtrl: null,
    isConfirm: false,
    canSend: true,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.AuthMethod = (this.AuthMethod || 1).toString();
        this.checkSeconds = (this.AuthMethod == "2" ? 5 : 3) * 60;
        this.callerInfo = this.viewBag.InitDatas.CallerInfo.CALLER || {};
        this.fileData = this.viewBag.InitDatas.CallerInfo.FILE_DATA || {};
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },
    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    onInitHeader: function (header) {
        header
            .setTitle(ecount.resource.LBL10243)
            .notUsedBookmark();
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            form = g.form()
        ;
        var selectLabels = [ecount.resource.LBL10239, ecount.resource.LBL10240, ecount.resource.LBL10241];

        form.add(ctrl.define("widget.combine.authenticationType", "AuthType", "AuthType", ecount.resource.LBL10237)
            .label(selectLabels)
            .value(["1", "2", "3"])
            .popover(ecount.resource.MSG05625)
            .end());

        contents.add(form);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            control = widget.generator.control();

        if (this.EditFlag == "I") {
            toolbar
                .addLeft(control.define('widget.button', 'save').label(ecount.resource.BTN00065).clickOnce().end())
                .addLeft(control.define('widget.button', 'close').label(ecount.resource.BTN00008).end());
        } else if (this.EditFlag == "M") {
            toolbar
                .addLeft(control.define('widget.button', 'delete').label(ecount.resource.BTN00033).clickOnce().css("btn btn-default").end())
                .addLeft(control.define('widget.button', 'close').label(ecount.resource.BTN00008).end())
            ;
        }
        footer.add(toolbar);
    },
    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadComplete: function (e) {
        this.authCtrl = this.contents.getControl("AuthType");

        this.authCtrl.get(0).setValue(this.AuthMethod);
        this.authCtrl.toggleRadio(e, this.AuthMethod);
        this.authCtrl.get(0).setReadOnly(true);

        this.authCtrl.get(1).setValue(this.Caller);
        this.authCtrl.get(1).setReadOnly(true);

        this.authCtrl.get(2).changeLabel(this.AuthMethod == "2" ? ecount.resource.LBL10236 : ecount.resource.LBL01258);

        var _file_name = (this.callerInfo && this.callerInfo.FILE_NAME) || (this.fileData.Key && this.fileData.FILE_NAME);

        if (!$.isEmpty(_file_name))
            this.authCtrl.get(6).changeLabel(_file_name);

        this.authCtrl.get(7).setLabel(this.callerInfo.STATUS == "C" ? ecount.resource.LBL09676 :
                this.callerInfo.STATUS == "R" ? ecount.resource.LBL10232 : this.callerInfo.STATUS == "D" ? ecount.resource.MSG05635 : "");

        this.authCtrl.get(3).setImeModeKeydownHandler(0, false, "N", true);

        if (["1", "2"].contains(this.AuthMethod)) {
            if (this.EditFlag == "I") {
                this.setTimeout(this.setCountDown.bind(this), 0);
                this.authCtrl.get(7).hide();
            } else if (this.EditFlag == "M") {
                this.authCtrl.get(2).hide();
                this.authCtrl.get(3).hide();
                this.authCtrl.get(4).hide();
            }
        }
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

    onContentsAuthType_fileListLink: function () {
        if (!$.isEmpty(this.fileData.Key)) {
            var param = {
                ComCode: this.viewBag.ComCode_L
                , IdKey: this.fileData.Key.ID_KEY
                , SerNo: this.fileData.Key.SER_NO
                , FileMenuCode: ecenum.filemenuCode.gw04
            };

            this.DOWNLOAD_FILE(param);
        } else if (!$.isEmpty(this.callerInfo.OWNER_KEY)) {

            this.DOWNLOAD_FILE({
                downloadURL: '//' + ecmodule.common.fileStorage.getFileStorageHost(1) + '/DownloadFile/' + ecenum.tempfileLifetime.infinity + '/' + this.viewBag.ComCode_L + '/' + this.callerInfo.FILE_NAME + '/' + this.callerInfo.FILE_NAME + '/' + this.callerInfo.OWNER_KEY
            });
        }
    },

    onContentsAuthType_sendAuthNumLink: function () {
        // 인증번호 확인한 후나 재발송한지 10초 안 지났으면 return
        if (this.isConfirm || !this.canSend)
            return;

        var that = this;
        var caller = this.authCtrl.get(1).getValue();
        var authMethod = this.authCtrl.get(0).getValue().toString();
        this.canSend = false;

        ecount.common.api({
            url: '/Common/Infra/CheckCallerForRegist',
            data: { CALLER: caller, AUTH_METHOD: authMethod },
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    clearInterval(that.intervalIndex);
                    that.isTimeout = false;
                    that.setTimeout(that.setCountDown.bind(that), 0);
                }
            },
            complete: function () {
                that.setTimeout(function () {
                    that.canSend = true;
                    //btn.setAllowClick();
                }, 10000);
            }
        });
    },

    onContentsAuthType_confirmLink: function () {
        var that = this;
        var authCode = this.authCtrl.get(3).getValue();
        var verificationCode = this.AuthCode;
        var caller = this.authCtrl.get(1).getValue();
        var authMethod = this.authCtrl.get(0).getValue();

        if (this.isTimeout) {
            ecount.alert(ecount.resource.MSG05633);
            return false;
        }

        if (this.wrongCount >= 3) {
            ecount.alert(ecount.resource.MSG05632, function () {
                var param = { Caller: caller, AuthMethod: authMethod };
                this.onAllSubmitSelf("/ECERP/Popup.Common/EGA008P_02", param);
            }.bind(this));
            return false;
        }

        if ($.isEmpty(authCode)) {
            ecount.alert(ecount.resource.MSG05631)
        }
        ecount.common.api({
            url: '/Common/Infra/CheckCallerVerificationCode',
            data: { AuthCode: authCode, VerificationCode: verificationCode },
            success: function (result) {
                if (result.Status == "200") {
                    if (result.Data == "E001") {
                        this.authCtrl.get(3).readOnly(false);
                        ecount.alert(ecount.resource.MSG05630);
                        this.wrongCount++;
                    } else if (result.Data == "E999") {
                        this.authCtrl.get(3).readOnly(false);
                        ecount.alert(ecount.resource.MSG05631)
                    }
                    else {
                        this.authCtrl.get(3).readOnly(true);
                        this.authCtrl.get(3).hide();
                        this.authCtrl.get(7).setLabel(ecount.resource.LBL09676);
                        this.authCtrl.get(7).show();
                        this.isSave = true;
                        this.isConfirm = true;
                    }
                }
                else {
                    ecount.alert(result.fullErrorMsg);

                }
            }.bind(this),
            complete: function () {
                //btn.setAllowClick();
            }.bind(this)
        });
    },

    onFooterSave: function () {
        if (!this.isSave) {
            this.footer.getControl("save").setAllowClick();
            ecount.alert(ecount.resource.MSG05629);
            return false;
        }

        var param = { CALLER: this.authCtrl.get(1).getValue(), AUTH_METHOD: this.authCtrl.get(0).getValue() };

        ecount.common.api({
            url: '/Common/Infra/SaveCaller',
            data: param,
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                    return false;
                }
                else {
                    var message = { callback: this.close.bind(this) };
                    this.sendMessage(this, message);
                }
            }.bind(this)
        });
    },

    onFooterDelete: function () {
        var btn = this.footer.getControl("delete");
        var caller = this.authCtrl.get(1).getValue();
        var that = this;
		
        if (this.callerInfo.STATUS != "C" || (this.callerInfo.STATUS == "C" && ecount.user.PER_TYPE == "1")) {
            ecount.confirm(ecount.resource.MSG00299, function (status) {
                if (status) {
                    ecount.common.api({
                        url: '/Common/Infra/DeleteCaller',
                        data: { CALLER: caller },
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            }
                            else {
                                that.sendMessage(that, { callback: that.close.bind(that) });
                            }
                        },
                        complete: function () {
                            btn.setAllowClick();
                        }
                    });
                }
            });
        } else if (this.callerInfo.STATUS == "C" && ecount.user.PER_TYPE != "1") {
            btn.setAllowClick();
            ecount.alert(ecount.resource.MSG05641);
            return false;
        }
    },

    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_ENTER: function (e, target) {
        if (target != null && target.cid == 'registerCertification')
            this.registerCertification();
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    setCountDown: function () {
        var timer = this.checkSeconds, minutes, seconds;

        this.intervalIndex = setInterval(function () {
            if ($.isEmpty(this.contents)) {
                clearInterval(this.intervalIndex);
                return;
            }

            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            this.authCtrl.get(5).setLabel(minutes + ":" + seconds);
            if (--timer < 0) {
                clearInterval(this.intervalIndex);
                this.isTimeout = true;

                return;
            }
        }.bind(this), 1000);
    }
});