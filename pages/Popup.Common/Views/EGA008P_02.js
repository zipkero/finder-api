window.__define_resource && __define_resource("LBL10243","LBL10234","LBL10233","LBL10239","LBL10240","LBL10241","LBL10237","MSG05625","BTN00065","BTN00008","MSG05629","MSG05648","MSG05624","MSG05640","MSG05627","MSG05622","MSG05623");
/****************************************************************************************************
1. Create Date : 2016.10.17
2. Creator     : 정명수
3. Description : SMS > 발신번호인증 > 신규 (SMS > Caller ID Authentication > Register Sender ID)
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EGA008P_02", {
/**************************************************************************************************** 
* user opion Variables(사용자변수 및 객체) 
****************************************************************************************************/

    attachedFiles: null,
    authCtrl: null,
    canSend: true,

/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("pluploader");
    },

    initProperties: function () {
        this.AuthMethod = (this.AuthMethod || 1).toString();
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
            form = g.form(),
            fileList = g.fileList()
        ;

        var buttonLabel = this.AuthMethod == "2" ? ecount.resource.LBL10234 : ecount.resource.LBL10233,
            selectLabels = [ecount.resource.LBL10239, ecount.resource.LBL10240, ecount.resource.LBL10241],
            fileOption = {
                tempUploadUrl: "/ECAPI/Common/Infra/SaveTempFile",
                extensions: "bmp,jpg,gif,png,jpeg,pdf",//this.allowFileExtensionList,      // 허용할 확장자 
                prevent_duplicates: false,          // 중복파일 허용여부
                multi_selection: false,
                max_file_count: 1,                  // 파일최대갯수
                autostart: false,                 // 파일이 첨부되는 순간 임시 폴더에 업로더를 해야 할 경우 true 아니면 false
                noHead: false,                       //상단영역 출력여부
                autoHeightBody: true,               //파일첨부 영역높이
                tot_size_lmt: { size: "2097152", flag: true },       //파일당 2MB 제한 - byte로 환산  
                com_storage_size: { size: "0" },
                use_storage_size: { size: "" },
                extensionErrorMsg: true
            };


        form.add(ctrl.define("widget.combine.authenticationType", "AuthType", "AuthType", ecount.resource.LBL10237)
            .label(selectLabels)
            .value(["1", "2", "3"])
            //.fixedSelect(this.AuthMethod)
            .popover(ecount.resource.MSG05625)
            .end());

        contents.add(form)
            .add(fileList.fileLinkId("AuthType_fileListLink").callBack(this.afterTempFileSave.bind(this)).setOptions(fileOption));
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            control = widget.generator.control();

        toolbar
            .addLeft(control.define('widget.button', 'save').label(ecount.resource.BTN00065).clickOnce().end())
            .addLeft(control.define('widget.button', 'close').label(ecount.resource.BTN00008).end());

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

        this.authCtrl.get(1).setValue(this.Caller);
        this.authCtrl.hide([3, 4, 5, 7]);

        if (!e.unfocus) {
            this.authCtrl.get(0).setFocus(this.AuthMethod - 1);
        }
    },

    onChangeControl: function (event, data) {
        this.authCtrl.hide([3, 4, 5, 7]);
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
    //onContentsSend: function () {
    //    this.sendData();
    //},
    onContentsAuthType_sendAuthNumLink: function() {
        this.sendData();
    },

    onFooterSave: function () {
        var authMethod = this.authCtrl.get(0).getValue();

        if (["1", "2"].contains(authMethod)) {
            ecount.alert(ecount.resource.MSG05629);
            this.footer.getControl("save").setAllowClick();
            return false;
        } else if (authMethod == "3") {
            this.sendData();
        }
    },

    onFooterClose: function () {
        this.close();
    },
/**************************************************************************************************** 
*  define hotkey event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
****************************************************************************************************/

    ON_KEY_F8: function () {
        this.onFooterSave();
    },

/**************************************************************************************************** 
* define user function 
****************************************************************************************************/
    tempFileSave: function () {
        //파일 임시저장
        this.attachedFiles = this.contents.getFileList("AuthType_fileListLink").serialize();

        if (this.attachedFiles.value.length > 0) { //첨부파일이 있을경우
            this.contents.getFileList("AuthType_fileListLink").uploadStart();
        } else {
            this.footer.getControl("save").setAllowClick();
            ecount.alert(ecount.resource.MSG05648);
            return false;
        }
    },

    afterTempFileSave: function () {
        this.saveData();
    },

    saveData: function () {
        var that = this;
        var param = {
            CALLER: this.authCtrl.get(1).getValue(),
            AUTH_METHOD: this.authCtrl.get(0).getValue()
        };

        if (this.attachedFiles) {
            param.FILE_NAME = this.attachedFiles.value[0].name;
            param.FILE_ID = this.attachedFiles.value[0].id;
        }

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

    sendData: function () {
        var that = this;
        var caller = this.authCtrl.get(1);
        var authMethod = this.authCtrl.get(0);
        var btn = null;

        if (authMethod.getValue() == "3")
            btn = this.footer.getControl("save");
        //else
        //    btn = this.contents.getControl("Send");

        var checkValidate = function () {
            ecount.common.api({
                url: '/Common/Infra/CheckCallerForRegist',
                data: { CALLER: caller.getValue(), AUTH_METHOD: authMethod.getValue() },
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                        return false;
                    }
                    else {
                        if (result.Data.RESULT == "E000") {
                            if (authMethod.getValue() == "3") {
                                this.tempFileSave(); // 서류심사는 파일 등록
                            } else {
                                var param = {
                                    Caller: caller.getValue(),
                                    AuthMethod: authMethod.getValue(),
                                    AuthCode: result.Data.CODE,
                                    EditFlag: "I"
                                };

                                this.onAllSubmitSelf("/ECERP/Popup.Common/EGA008P_04", param);
                            }
                        } else if (result.Data.RESULT == "E001") { // 모바일 아님
                            ecount.alert(ecount.resource.MSG05624);
                        } else if (result.Data.RESULT == "E999") { // 번호없음 또는 ARS 발신 실패
                            ecount.alert(ecount.resource.MSG05640);
                        } else if (result.Data.RESULT == "E002") { // 이미 등록된 번호
                            ecount.alert(ecount.resource.MSG05627);
                        }
                    }
                }.bind(this),
                complete: function () {
                    btn && btn.setAllowClick();
                }.bind(this)
            });
        }.bind(this);

        if ($.isEmpty(caller.getValue())) {
            btn && btn.setAllowClick();
            ecount.alert(ecount.resource.MSG05640, function () {
                caller.setFocus(0);
            }.bind(this));
            return false;
        }

        var regExp1 = /^(02|0[3-6][0-9]|01(0|1|3|5|6|7|8|9)|070|080|007)-?[0-9]{3,4}-?[0-9]{4,5}$/;
        var regExp2 = /^(15|16|18)[0-9]{2}-?[0-9]{4,5}$/;
        var regExp3 = /^(02|0[3-6][0-9])-?(15|16|18)[0-9]{2}-?[0-9]{4}$/;

        if (!(regExp1.test(caller.getValue()) || regExp2.test(caller.getValue())) || regExp3.test(caller.getValue())) {
            btn && btn.setAllowClick();
            ecount.alert(ecount.resource.MSG05624, function () {
                caller.setFocus(0);
            }.bind(this));

            return false;
        }

        if (["1", "2"].contains(authMethod.getValue())) {
            var message = authMethod.getValue() == "1" ? ecount.resource.MSG05622 : ecount.resource.MSG05623;
            ecount.confirm(String.format(message, caller.getValue()), function (status) {
                if (status) {
                    checkValidate();
                } else {
                    btn && btn.setAllowClick();
                }
            });
        } else if (authMethod.getValue() == "3") {
            checkValidate();
        }
    }
});