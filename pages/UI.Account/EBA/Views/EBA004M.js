window.__define_resource && __define_resource("MSG02605","LBL06434","LBL09999","LBL07530","LBL19318","LBL01381","MSG01136","MSG02920","MSG11916","BTN00541","MSG08804","LBL19062","LBL01377","MSG00270","MSG02919","LBL03088","LBL03146","LBL04189","LBL00757","MSG00367","MSG02921","LBL01374","LBL02794","MSG02922","LBL04832","MSG02621","MSG30203","LBL07531","MSG04808","BTN00067","BTN00765","BTN00065","BTN00007","BTN00008","BTN00959","BTN00203","BTN00204","BTN00033","MSG00299","MSG00075","MSG05604","LBL93032","LBL07157","MSG05458","MSG00923","MSG01674","MSG09929","MSG00048","MSG08770","LBL03831");
/****************************************************************************************************
1. Create Date : 2015.05.11
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department > New/Modify
4. Precaution  :
5. History     :
                [2016.02.01] 이은규: 헤더에 옵션 > 사용방법설정 추가
                2018.12.27 (HoangLinh): Remove $el
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                2020.06.22 (박종국) : A20_01863 사용방법설정 재정립 1차
                2020-06-22 (Kim Min Joon) - A18_03219_전표 기초 채번규칙 정리하기
                2020.09.07 (HoangLinh): A18_00479 - 계층그룹 팝업창에서 신규 계층그룹 생성 기능 추가
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EBA004M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    _isSaving: false,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: "",

    editFlag: "I",

    ctrlList: null,

    SITE: null,

    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecmodule.common.formHelper");
    },

    initProperties: function () {
        this.ctrlList = [];

        this.SITE = {
            SITE_CD: null,
            SITE_DES: null,
            ACCT_CHK: "Y",
            PAY_CHK: "Y",
            EGW_CHK: "Y",
            BUSINESS_NO: null,
            TAX_REG_ID: null,
            CANCEL: null,
            WID: null,
            WDATE: null
        };

        this.userPermit = this.viewBag.Permission.Permit.Value;

        // 채번(부서코드) 설정 data들
        this.autoCodeInfo = this.viewBag.InitDatas.UseAutoCode;

        // 채번(문서번호) 코드 타입
        this.codeType = "5";
    },

    render: function () {
        this._super.render.apply(this);

        if (this.SITE_CD && this.SITE_CD != '')
            this.editFlag = "M";

        if (this.editFlag == "M") {
            var site = this.viewBag.InitDatas.deptLoad;

            if (site != null && site != undefined) {
                this.SITE.SITE_CD = site.Key.SITE,
                    this.SITE.SITE_DES = site.SITE_DES;
                this.SITE.ACCT_CHK = site.ACCT_CHK;
                this.SITE.PAY_CHK = site.PAY_CHK;
                this.SITE.EGW_CHK = site.EGW_CHK;
                this.SITE.BUSINESS_NO = site.BUSINESS_NO;
                this.SITE.TAX_REG_ID = site.TAX_REG_ID.trim();
                this.SITE.CANCEL = site.CANCEL;
                this.SITE.WID = site.WID;
                this.SITE.WDATE = site.WDATE;
            } else {
                ecount.alert(ecount.resource.MSG02605);
                this.sendMessage(this, {});
                this.close();
            }
        }
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(String.format(this.editFlag == "M" ? ecount.resource.LBL06434 : ecount.resource.LBL09999, ecount.resource.LBL07530))
            .add("option", [
                { id: "SelfCustomizing", label: ecount.resource.LBL19318 }
            ]);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var permit = this.viewBag.Permission.Permit;
        var business_no = '';
        //----------------------------------------------------
        var g = widget.generator,
            ctrl = g.control(),
            control,
            form = g.form();

        if (this.editFlag == "M")
            business_no = this.SITE.BUSINESS_NO;

        form.template("register")

        if (this.editFlag == "I") {

            var fnOptions = [];

            control = ctrl
                .define("widget.input.codeType", "SITE", "SITE", ecount.resource.LBL01381)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "7", "14"), max: 14 })
                .popover(ecount.resource.MSG02920);

            // 직접입력일때만 필수값 처리
            if (this.autoCodeInfo.INPUTMAKE_TYPE == "1") {
                control
                    //.value(this.viewBag.InitDatas.AutoNewCode)
                    .dataRules(["required"], ecount.resource.MSG11916);
                    //.hasFn([{ id: "NewCode", label: ecount.resource.BTN00541 }, ]);
                fnOptions.push({ id: "NewCode", label: ecount.resource.BTN00541 });

            } else {
                control
                    .readOnly()
                    .setPlaceHolder(ecount.resource.MSG08804); //저장시점에 생성됩니다.
            }

            fnOptions.push({ id: 'autoNumberSetting', label: ecount.resource.LBL19062 });
            control.hasFn(fnOptions);
        } else {
            control = ctrl
                .define("widget.label", "SITE", "SITE", ecount.resource.LBL01381)
                .label(this.SITE.SITE_CD).popover(ecount.resource.MSG02920);
        }

        form.add(control.end());

        form
            .add(ctrl.define("widget.input.codeName", "SITE_DES", "SITE_DES", ecount.resource.LBL01377)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "25", "50"), max: 50 })
                .value(this.SITE.SITE_DES)
                .dataRules(["required"], ecount.resource.MSG00270)
                .popover(ecount.resource.MSG02919).end())
            .add(ctrl.define("widget.checkbox", "MENU", "MENU", ecount.resource.LBL03088)
                .label([ecount.resource.LBL03146, ecount.resource.LBL04189, ecount.resource.LBL00757])
                .value(["1", "2", "3"])
                .select((this.SITE.ACCT_CHK == "Y" || this.SITE.SITE_CD == "00") ? "1" : "", (this.SITE.PAY_CHK == "Y" || this.SITE.SITE_CD == "00") ? "2" : "", (this.SITE.EGW_CHK == "Y" || this.SITE.SITE_CD == "00") ? "3" : "")
                .dataRules(["required"], ecount.resource.MSG00367)
                .readOnly(this.SITE.SITE_CD == "00" ? true : false)
                .popover(String.format(ecount.resource.MSG02921, ecount.resource.LBL01374)).end())


        if (ecount.company.VAT_SITE == 'Y') {
            var opts = [];
            var lst = this.viewBag.InitDatas.otherEstablishmentLoad;
            lst.forEach(function (o) {
                opts.push([o.BUSINESS_NO, o.COM_DES]);
            });

            form.add(ctrl.define("widget.select", "BUSINESS_NO", "BUSINESS_NO", ecount.resource.LBL02794)
                .option(opts).select(business_no)
                .popover(ecount.resource.MSG02922).end()
            )
        }

        if (ecount.company.PAYER_TYPE == '5')
            form.add(ctrl.define("widget.input", "TAX_REG_ID", "TAX_REG_ID", ecount.resource.LBL04832)
                .value(this.SITE.TAX_REG_ID).popover(ecount.resource.MSG02621)
                .filter("maxbyte", { message: ecount.resource.MSG30203, max: 4 })
                .handler({ "keyup": function (e, ctrl) { this.numberCheck(ctrl, true); }.bind(this) })
                .end()
            )

        form.add(ctrl.define("widget.multiCode.deptLevelGroup", "txtTreeDeptCd", "txtTreeDeptCd", ecount.resource.LBL07531).popover(ecount.resource.MSG04808).setOptions({ label: null }).end())

        contents.add(form)
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            addgroup = [],
            ctrl = widget.generator.control();
        addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        addgroup.push({ id: "SaveNew", label: ecount.resource.BTN00765 });
        if (this.editFlag == "I") {

            if (this.isAddGroup) {

                toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).clickOnce());
            }
            else {
                toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
            }
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        } else {
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup(addgroup).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                .css("btn btn-default")
                .addGroup(
                    [
                        {
                            id: 'use',
                            label: (this.SITE.CANCEL == "Y" ? ecount.resource.BTN00203 : ecount.resource.BTN00204)                //Resource : 재사용, 사용중단
                        },
                        { id: 'delete', label: ecount.resource.BTN00033 }
                    ]).noActionBtn().setButtonArrowDirection("up"));  // Delete
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    /**********************************************************************     
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        var txtTreeDeptCd = this.contents.getControl("txtTreeDeptCd");
        txtTreeDeptCd.defaultParam.GUBUN = '1';

        var siteControl = this.contents.getControl('SITE'),
            siteDesControl = this.contents.getControl('SITE_DES');

        for (var i = 0; i < this.contents.items[0].rows.length; i++) {
            this.ctrlList.push(this.contents.items[0].rows[i].id);
        }

        if (this.editFlag == "I") {
            // 직접입력이고 메뉴오픈시에 값 넣어준다.
            if (this.autoCodeInfo.INPUTMAKE_TYPE == "1" && this.autoCodeInfo.USE_BUTTON == false) {
                var autoCodeValue = this.viewBag.InitDatas.AutoNewCode;

                // 서버에서 전달된 채번값이 공백이면 
                if ($.isEmpty(autoCodeValue)) {
                    siteControl.setFocus(0);
                } else {
                    siteControl.setValue(autoCodeValue);
                    siteDesControl.setFocus(0);
                }
            } else {
                // 자동생성이면 명칭에 포커스
                siteDesControl.setFocus(0);
            }
        } else {
            var deptLevelList = this.viewBag.InitDatas.deptLevelByDeptLoad;

            for (var i = 0; i < deptLevelList.length; i++) {
                if (deptLevelList[i].CD_PARENT != null && deptLevelList[i].CD_PARENT != '' && deptLevelList[i].NM_PARENT != null && deptLevelList[i].NM_PARENT != '')
                    txtTreeDeptCd.addCode({ label: deptLevelList[i].NM_PARENT, value: deptLevelList[i].CD_PARENT });
            }

            this.contents.getControl('SITE_DES').setFocus(0);
        }

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 686
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (page.pageID == 'CM102P') {
            var autoCode = message.data[0].AutoCode;
            this.contents.getControl('SITE').setValue(autoCode);
            page.close();

            // 자동생성
            if (this.editFlag == "I" && this.autoCodeInfo.INPUTMAKE_TYPE == "2") {

                // autoCode 값이 정상으로 내려와야 저장을 진행한다.
                if (!$.isEmpty(autoCode)) {
                    // 저장
                    this.saveData();
                }
            } else {
                if (autoCode == '') {
                    this.contents.getControl('SITE').setFocus(0);
                } else {
                    this.contents.getControl('SITE').onNextFocus();
                }
            }
        } else if (page.pageID === 'EMJ002P_10') {
            message.callback && message.callback();
            this.onAllSubmitSelf('/ECERP/EBA/EBA004M', '');
        }
    },

    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        if (control.id == "txtTreeDeptCd") {
            params.IsNewAndEdit = true;
            params.popupType = false;
            params.additional = false;
        }
        handler(params);
    },

    onAutoCompleteHandler: function (control, keyword, params, handler) {
        if (control.id == "txtTreeDeptCd") {
            params.IsNewAndEdit = true;
            params.popupType = false;
            params.additional = false;
            handler(params);
        } else {
            this._super.onAutoCompleteHandler.apply(this, arguments);
        }
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //FN NewCode click event
    onFunctionNewCode: function () {
        this.openPopUpMakeCodePage();
    },

    //번호생성설정
    onFunctionAutoNumberSetting: function (e) {
        var params = {
            width: 800,
            height: 600,
            CODE_TYPE: 5
        };
        this.openWindow({
            url: '/ECERP/EMJ/EMJ002P_10',
            name: ecount.resource.LBL19062,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false
        });
    },

    //Save button click event
    onFooterSave: function (e) {
        this.checkAutoCode();
    },

    onButtonSaveNew: function (e) {
        this.checkAutoCode(2);
    },

    onButtonSaveReview: function (e) {
        this.checkAutoCode(3);
    },
    //Reset button click event
    onFooterReset: function (e) {
        var siteCd = this.SAVE_SITE_CD != null ? this.SAVE_SITE_CD : this.SITE_CD
        if (siteCd == null || siteCd == undefined) {
            this.contents.reset();

            var thisObj = this;
            var txtSITE = thisObj.contents.getControl('SITE');
            var chks = this.contents.getControl('MENU');

            chks.setValue(0, true);
            chks.setValue(1, true);
            chks.setValue(2, true);

            // 직접입력이고 메뉴오픈시에만
            if (this.autoCodeInfo.INPUTMAKE_TYPE == "1" && this.autoCodeInfo.USE_BUTTON == false) {
                ecount.common.getAutoCodeRepeatCdForInfo(this.getDocnoCreateInfo("A"), function (result) {

                    if (result && !$.isEmpty(result.RepeatCd)) {
                        txtSITE.setValue(result.RepeatCd);
                        this.contents.getControl("SITE_DES").setFocus(0);
                    } else {
                        txtSITE.setValue("");
                        txtSITE.setFocus(0);
                    }
                }.bind(this));
            } else {
                txtSITE.setValue('');
                txtSITE.setFocus(0);
            }
        }
        else {
            var params = {
                SITE_CD: siteCd,
            };
            this.onAllSubmitSelf('/ECERP/EBA/EBA004M', params);
        }
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },
    //Delete button click event
    onButtonDelete: function () {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var thisObj = this;
        var siteCD = this.contents.getControl('SITE').getLabel();

        this.showProgressbar();

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Account/Basic/DeleteSite",
                    data: Object.toJSON({
                        SITE: siteCD,
                        CheckPermissionRequest: {
                            EditMode: ecenum.editMode.delete,
                            ProgramId: thisObj.PROGRAM_ID
                        }
                    }),
                    success: function (result) {
                        if (result.Status != "200")
                            alert(result.fullErrorMsg);
                        else {
                            var output = result.Data.split("ㆍ");
                            if (output[0] == "1")
                                ecount.alert(ecount.resource.MSG00075);
                            else if (output[0] == "2")
                                ecount.alert(String.format(ecount.resource.MSG05604, output[1]));
                            else {
                                thisObj.sendMessage(thisObj, {});
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                        }
                    },
                    complete: function () {
                        thisObj.hideProgressbar();
                        btnDelete.setAllowClick();
                    }.bind(this)
                });
            } else {
                thisObj.hideProgressbar();
                btnDelete.setAllowClick();
            }
        });
    },

    //Activate/Deactivate button click event
    onButtonUse: function (e) {
        var btnActivate = this.footer.get(0).getControl("deleteRestore");

        //if (this.userPermit != "W") {
        //    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93032, PermissionMode: "U" }]);
        //    ecount.alert(msgdto.fullErrorMsg);
        //    btnActivate.setAllowClick();
        //    return false;
        //}

        var thisObj = this;
        var data = {
            SITE: this.SITE.SITE_CD,
            CANCEL: this.SITE.CANCEL == "Y" ? "N" : "Y",
            CheckPermissionRequest: {
                EditMode: ecenum.editMode.modify,
                ProgramId: this.PROGRAM_ID
            }
        }

        ecount.common.api({
            url: "/Account/Basic/ActivateSite",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else {
                    thisObj.sendMessage(thisObj, {});
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () {
                btnActivate.setAllowClick();
            }
        });
    },

    //History button click event
    onFooterHistory: function (e) {
        var params = {
            width: 450,
            height: 150,
            lastEditTime: this.SITE.WDATE,
            lastEditId: this.SITE.WID,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: params,
            popupType: false,
            additional: false
        });
    },

    //Close button click event
    onFooterClose: function () {
        this.close();
        return false;
    },

    // 사용방법설정 Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: 750,
            height: this.selfCustomizingHeight,
            PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/SVC/ESC/ESC002M',
            name: ecount.resource.LBL19318,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false
        });
    },
    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.checkAutoCode(e);
    },

    /**********************************************************************
    * define user function
    **********************************************************************/

    // 코드생성 팝업창 오픈
    openPopUpMakeCodePage: function (params) {
        //Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM102P',
            name: ecount.resource.BTN00541,
            param: _.merge(params || {}, this.getDocnoCreateInfo("P")),
            popupType: false,
            additional: false
        });
    },

    // 코드생성 팝업 및 자동생성시 코드생성 api 호출 param
    getDocnoCreateInfo: function (type) {

        var autoNumberSettings = _.merge({
            CODE_TYPE: this.codeType,           // CM102P 에서 사용
            CodeType: this.codeType,            // API 에서 사용
            DOCNO_USE_YN: this.autoCodeInfo.USE_DOCNO === true ? "Y" : "N",
        }, this.getAutoCodeSubData());

        // 팝업오픈
        if (type == "P") {
            return {
                height: 300,
                width: 860,
                autoNumberSettings: encodeURIComponent(Object.toJSON([autoNumberSettings])),
                parentPageID: this.pageID,
                responseID: this.callbackID,
                programID: this.viewBag.DefaultOption.PROGRAM_ID
            };
        }

        // API 호출
        return _.merge({
            isMaxInputFlag: false,
            CreateCount: 1,
            INPUTMAKE_TYPE: this.autoCodeInfo.INPUTMAKE_TYPE,
            makeType: this.autoCodeInfo.AUTOMAKE_TYPE
        }, autoNumberSettings);
    },

    // 채번 서브 data에서 필요한 값을 가져온다.
    getAutoCodeSubData: function () {
        return ecount.common.getAutoCodeSubData(this.autoCodeInfo.Sub || []).autoCodeCodeTypeValue;
    },

    // 코드 자동성성시 코드번호 생성후 저장, 직접입력이면 바로 저장 진행
    checkAutoCode: function (type) {
        
        if (type == null || type == undefined) {
            type = 1;
        }

        this.type = type;

        var siteControl = this.contents.getControl("SITE");

        // 신규, 자동생성, 코드값이 없을때만
        if (this.editFlag == "I" && this.autoCodeInfo.INPUTMAKE_TYPE == "2" && $.isEmpty(siteControl.getValue())) {
            ecount.common.checkAutoCode({
                apiParam: this.getDocnoCreateInfo("A"),                         // 자동생성인 경우 설정 정보를 받아오는 api 호출 param
                openPopupFunc: function (param) {                               // 자동생성에서 설정 값이 완성되지 않을때 cm102p 오픈 함수
                    this.openPopUpMakeCodePage(param);
                }.bind(this),
                allowFunc: function () {                                        // 자동생성인 경우 cm102p 페이지 호출 후 버튼 등 다시 클릭 가능하게 등
                    this.footer.get(0).getControl("Save").setAllowClick();
                }.bind(this),
                setCodeFunc: function (repeatCd) {                              // 자동생성시 코드 input에 값 넣어주는 함수
                    siteControl.setValue(repeatCd);
                    this.saveData();
                }.bind(this)
            });
        } else {
            this.saveData();
        }
    },

    // 저장진행
    saveData: function () {
        var btnSave = this.footer.get(0).getControl("Save");
        var thisObj = this;
        var errList = [];

        if (!thisObj.canSaveProcess()) return;

        thisObj.startSave();

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            errList.push(invalid.result[0][0].control.id);
            thisObj.completeSave();
            btnSave.setAllowClick();
        }

        var sSITE = this.SITE.SITE_CD;
        var txtSITE = this.contents.getControl('SITE');
        if (this.editFlag == 'I') {
            sSITE = txtSITE.getValue().trim();
            this.checkCode(sSITE, _saveData.bind(this));
        } else {
            _saveData.call(this, false, '');
        }

        function _saveData(isError, errMess) {
            if (isError) {
                errList.push(txtSITE.id);
                this.completeSave();
                if (this.autoCodeInfo.INPUTMAKE_TYPE == "1") {
                    txtSITE.showError(errMess);
                } else {
                    // 자동생성일 경우 에러메세지 바로 나오게
                    txtSITE.showError(null, errMess, true);
                }
                btnSave.setAllowClick();
            }

            var sBUSINESS_NO = "";
            if (ecount.company.VAT_SITE == 'Y') {
                var txtBUSINESS_NO = this.contents.getControl('BUSINESS_NO');
                sBUSINESS_NO = txtBUSINESS_NO.getValue();

                if (sBUSINESS_NO == this.viewBag.InitDatas.wrongCode) {
                    errList.push(txtBUSINESS_NO.id);
                    txtBUSINESS_NO.showError(ecount.resource.MSG05458);
                }
            }

            var sTAX_REG_ID = '';
            if (ecount.company.PAYER_TYPE == '5') {
                var txtTAX_REG_ID = this.contents.getControl('TAX_REG_ID');
                sTAX_REG_ID = txtTAX_REG_ID.getValue();

                if (!this.numberCheck(txtTAX_REG_ID, false)) {
                    errList.push(txtTAX_REG_ID.id);
                    txtTAX_REG_ID.showError(ecount.resource.MSG00923);
                }

                if (sTAX_REG_ID.length != 0 && sTAX_REG_ID.length != 4) {
                    errList.push(txtTAX_REG_ID.id);
                    txtTAX_REG_ID.showError(ecount.resource.MSG01674);
                }
            }

            if (errList.length > 0) {
                $.each(this.ctrlList, function (index, val) {
                    if (errList.contains(val)) {
                        if (val != "SITE" && this.autoCodeInfo.INPUTMAKE_TYPE != "2") { 
                            this.contents.getControl(val).setFocus(0);
                        }
                        return false;
                    }
                }.bind(this));
                this.completeSave();
                btnSave.setAllowClick();
                return false;
            }

            var sSITE_DES = this.contents.getControl('SITE_DES').getValue();
            var parentCD = this.contents.getControl('txtTreeDeptCd').serialize().value;
            var chks = this.contents.getControl('MENU'),
                sACCT_CHK = chks.getValue(0) == true ? "Y" : "N",
                sPAY_CHK = chks.getValue(1) == true ? "Y" : "N",
                sEGW_CHK = chks.getValue(2) == true ? "Y" : "N";

            if (sSITE == "00")
                parentCD = "";

            var data = {
                EditFlag: this.editFlag,
                CD_PARENT: parentCD,
                SITE: sSITE,
                SITE_DES: sSITE_DES,
                ACCT_CHK: sACCT_CHK,
                PAY_CHK: sPAY_CHK,
                EGW_CHK: sEGW_CHK,
                BUSINESS_NO: sBUSINESS_NO,
                TAX_REG_ID: sTAX_REG_ID,
                CheckPermissionRequest: {
                    EditMode: this.editFlag == "M" ? ecenum.editMode.modify : ecenum.editMode.new,
                    ProgramId: this.PROGRAM_ID
                }
            };

            ecount.common.api({
                url: "/Account/Basic/SaveSite",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                    } else if (result.Data == "1") {//No code
                        ecount.alert(ecount.resource.MSG02605);//Verify the data change.
                        thisObj.sendMessage(thisObj, {});
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    }
                    else if (result.Data == "BC") {// has broken characters
                        var txtCode = thisObj.contents.getControl('SITE');
                        txtCode.showError(ecount.resource.MSG09929);
                        txtCode.setFocus(0);
                    }
                    else {
                        var sVal = '';
                        if (thisObj.InputFlag == 'Y') {
                            if ((thisObj.ChkFlag == 'A' && sACCT_CHK == 'Y')
                                || (thisObj.ChkFlag == 'G' && sEGW_CHK == 'Y')
                                || (thisObj.ChkFlag == 'P' && sPAY_CHK == 'Y')
                                || ['EMM002', 'EMM002SITE'].contains(thisObj.PopUp))
                                sVal = sSITE + '|' + sSITE_DES;
                            else
                                sVal = '|';
                        }

                        var params = {
                            sVal: sVal,
                            SITE: thisObj.contents.getControl('SITE').getValue(),
                            SITE_DES: thisObj.contents.getControl('SITE_DES').getValue()
                        };
                        thisObj.sendMessage(thisObj, params);
                        if (thisObj.type == '1') {
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                        else {
                            var param = {
                            };
                            if (thisObj.type == '2') {
                                param.SAVE_SITE_CD = sSITE
                            }
                            else {
                                param.SITE_CD = sSITE
                                param.SAVE_SITE_CD = sSITE
                            }
                            thisObj.onAllSubmitSelf('/ECERP/EBA/EBA004M', param);
                        }
                    }
                },
                complete: function () {
                    thisObj.completeSave();
                    btnSave.setAllowClick();
                }
            });
        }
    },

    //Check valid code
    checkCode: function (sCode, callback) {
        if (sCode == '')
            callback(false, '');
        else if (sCode == '00')
            callback(true, ecount.resource.MSG00048);
        else if (ecount.common.ValidCheckSpecialForCodeType(sCode).result) {
            ecount.common.api({
                url: "/Account/Basic/GetSiteByCode",
                data: Object.toJSON({ SITE: sCode }),
                success: function (result) {
                    if (result.Status != "200")
                        callback(true, result.fullErrorMsg);
                    else if (result.Data != undefined && result.Data != null)
                        callback(true, String.format(ecount.resource.MSG08770, ecount.resource.LBL03831));
                    else
                        callback(false, '');
                }
            });
        }
    },

    //Check number
    numberCheck: function (ctl, flag) {
        var reg = /([^0-9])/g;
        var val = ctl.getValue();

        if (reg.test(val)) {//false: a number, true: not a number
            if (flag) {
                val = val.substring(0, val.length - 1);
                ctl.setValue(val);
                ctl.showError(ecount.resource.MSG00923);
                ctl.setFocus(0);
            }
            return false;
        }

        return true;
    },

    startSave: function () {
        this._isSaving = true;
        this.showProgressbar();
    },

    completeSave: function () {
        this._isSaving = false;
        this.hideProgressbar();
    },

    canSaveProcess: function () {
        return !this._isSaving;
    },
});