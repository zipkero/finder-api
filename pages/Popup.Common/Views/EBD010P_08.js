window.__define_resource && __define_resource("LBL05272","BTN00141","LBL80282","LBL01514","MSG06739","LBL04701","BTN00065","BTN00008","MSG00141","MSG04486","LBL07157","LBL35004","LBL01705","LBL93205","LBL01492","LBL04362","LBL01356","LBL00778","LBL01127","LBL01048","LBL01046","LBL08366","LBL01459","LBL01137","LBL13501","LBL13502","LBL00622","LBL00495","LBL02704","LBL05576","LBL01018","LBL03707","LBL12529","LBL12530","LBL19081","LBL00329","LBL01829","MSG00118");
/****************************************************************************************************
1. Create Date : 2016.05.27
2. Creator     : 소병용
3. Description : 계정설정(account settings) 
4. Precaution  : 
5. History     : 2020.02.13 (한재국) - A18_02373 - 수입비용 메뉴에서 외환차손익 입력
                 2020.10.22 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정_회계1
6. MenuPath    : EasyEntry 계정설정(account settings)
****************************************************************************************************/

ecount.page.factory("ecount.page.input", "EBD010P_08", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    pageID: null,
    header: null,
    contents: null,
    footer: null,
    errorMessage: null,
    errorFormFocus: 0,      //리펙토링 해야할 것 같음... validate함수 쓰면 됩니다.. 구조 맞추기 위하여 일단 추가함

    /**********************************************************************
    *  page init
    **********************************************************************/

    init: function (options) {
        this.initProperties();
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {

        initPageData.call(this);

        function initPageData() {
            this.basicEntrySet = null;
            this.useBasicEntrySet = null;
            this.basicEntrySort = null;
            this.ioGubun = null;
        }
    },

    render: function () {
        this.basicEntrySet = $.extend(this.basicEntrySet, this.viewBag.InitDatas.LoadData);
        this.useBasicEntrySet = this.setUseBasicEntrySet(this.TrxType, this.SerNo);
        this.basicEntrySort = this.setBasicEntrySort(this.TrxType, this.SerNo);
        this.ioGubun = this.setIoGubun(this.TrxType, this.SerNo);

        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    //Header Option
    onInitHeader: function (header, resource) {
        var title = ecount.resource.LBL05272;

        header.setTitle(title)
            .notUsedBookmark()
        .add("option", [{ id: "restoreDefault", label: ecount.resource.BTN00141 }]);       
    },

    //Content
    onInitContents: function (contents, resource) {
        
        var generator = widget.generator,
            form = generator.form(),
            toolbar = generator.toolbar(),
            ctrl = generator.control();

        var controls = [];

        if (this.TrxType == "98" && this.SerNo == "96") {
            controls.push(ctrl.define("widget.code.bankAccount", "defaultAccount", "defaultAccount", ecount.resource.LBL80282)
                .codeType(7)
                .addCode({ value: this.basicEntrySet.CASH_JNLZ_AC_ACCN, label: this.basicEntrySet.CASH_JNLZ_AC_ACCN_DES })
                .end());
        }
        //------------------------
        // Add Basic Control
        //------------------------
        $.each(this.basicEntrySort, function (i, o) {
            var propertyInfo = this.getPropertyInfo(o);
            var useProperty = this.useBasicEntrySet[propertyInfo.use];
            var useFeesCombine = this.useBasicEntrySet[propertyInfo.useCombine];
            var control;


            //수수료 통합형 위젯과의 분기처리
            if (useFeesCombine == true) {
                
                var valueArray = [{ value: this.basicEntrySet[propertyInfo.value], label: this.basicEntrySet[propertyInfo.label] }];

                switch (this.useBasicEntrySet[propertyInfo.useCombineType])
                {
                    case "1":
                    default:
                        break;
                    case "2":
                    case "3":
                        valueArray.push(this.basicEntrySet.JOURNALS_ITEM);
                        break;
                    case "4":
                        valueArray.push({ value: this.basicEntrySet[this.useBasicEntrySet[propertyInfo.useCombinCodeTargetValue]], label: this.basicEntrySet[this.useBasicEntrySet[propertyInfo.useCombinCodeTargetLabel]] });
                        break;
                }

                control = ctrl.define("widget.combine.fees", propertyInfo.id, propertyInfo.name, this.useBasicEntrySet[propertyInfo.title])
                              .setOptions({ combineType: this.useBasicEntrySet[propertyInfo.useCombineType] })
                              .fixedSelect(valueArray)
                              .hideCell(useProperty == false);

            } else {
                var useSettingFn = this.useBasicEntrySet[propertyInfo.useSettingFn];

                control = ctrl.define("widget.code.account", propertyInfo.id, propertyInfo.name, this.useBasicEntrySet[propertyInfo.title])
                              .addCode({ value: this.basicEntrySet[propertyInfo.value], label: this.basicEntrySet[propertyInfo.label] })
                              .codeType(7)
                              .hideCell(useProperty == false);

                if (useSettingFn == true) {
                    var settingFnInfo = getSettingFnInfo(this.useBasicEntrySet[propertyInfo.useSettingFnType]);

                    if ($.isEmptyObject(settingFnInfo) == false) {
                        control.hasFn([{ id: settingFnInfo.id, label: settingFnInfo.label }]);
                    }
                }
            }

            controls.push(control.end());

        }.bind(this));

        //------------------------
        // Add Jrnl Type Control
        //------------------------
        controls.push(ctrl.define("widget.input", "cash_jrnl_type", "cash_jrnl_type", "분개설정(현금/계좌)").value(this.basicEntrySet.CASH_JRNL_TYPE).hideCell(true).end());
        controls.push(ctrl.define("widget.input", "account_jrnl_type", "account_jrnl_type", "분개설정(계정)").value(this.basicEntrySet.ACCOUNT_JRNL_TYPE).hideCell(true).end());
        controls.push(ctrl.define("widget.input", "fees_jrnl_type", "fees_jrnl_type", "분개설정(수수료)").value(this.basicEntrySet.FEES_JRNL_TYPE).hideCell(true).end());
        controls.push(ctrl.define("widget.input", "wthdg_jnlz_type_cd", "wthdg_jnlz_type_cd", "분개설정(원천징수)").value(this.basicEntrySet.WTHDG_JNLZ_TYPE_CD).hideCell(true).end());
        controls.push(ctrl.define("widget.input", "vat_jnlz_type_cd", "vat_jnlz_type_cd", "분개설정(부가세)").value(this.basicEntrySet.VAT_JNLZ_TYPE_CD).hideCell(true).end());

        form.useInputForm()
            .showLeftAndRightBorder(true)
            .addControls(controls);

        contents.add(form);

        var finalControl = controls.last(function (x) {
            return x.isHideCell != true;
        });

        if ($.isNull(finalControl) == false && finalControl.hasFn == true) {
            toolbar.addLeft(ctrl.define("widget.label", "blank").label("<div class='h-20'></div>").useHTML()).end();
            contents.add(toolbar);
        }

        if (this.TrxType == "98" && this.SerNo == "97") {
            var setting = widget.generator.settingPanel();
            setting.focusIndex(1)
                .header(ecount.resource.LBL01514, ecount.resource.MSG06739);
            contents.add(setting);
        }

        function getSettingFnInfo(key) {
            var result = {
                id: "",
                label: "",
            };

            switch (key) {
                case "ACCT_NO":
                    result.id = "acctNo";
                    result.label = ecount.resource.LBL04701;
                    break;
                case "FEES":
                    result.id = "fees";
                    result.label = ecount.resource.LBL04701;
                    break;
                case "VAT":
                    result.id = "vat";
                    result.label = ecount.resource.LBL04701;
                    break;
                case "WTHDG":
                    result.id = "withholding";
                    result.label = ecount.resource.LBL04701;
                    break;
            }

            return result;
        }
    },

    //Footer(하단)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

           toolbar.addLeft(ctrl.define("widget.button", "save").label(this.resource.BTN00065).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
        
        footer.add(toolbar);
     },

     onFooterSave: function () {
         var _self = this;
         if (_self.isDetailPermit == false) {
             if (_self.viewBag.Permission.EBD010P_08_Permit.Value != "W") {
                 this.footer.getControl("save").setAllowClick();
                 ecount.alert(this.resource.MSG00141);
                 return;
             }
         }
        _self.saveValidate()

        if (_self.errorMessage.length > 0) {
            this.footer.getControl("save").setAllowClick();
            setShowErrorMessage.call(this);
            _self.errorMessage = null;
            _self.errorFormFocus = 0;
            return;
        }
         
        var data = _self.setSaveApiJsonData();

         ecount.confirm(ecount.resource.MSG04486, function (isOk) {
            if (isOk) {
                ecount.common.api({
                    url: "/Account/Common/SaveEasyEntrySetting",
                    data: Object.toJSON(data),
                    success: function (result) {
                        _self.sendMessage(_self, { callback: _self.close.bind(_self) });
                    }
                });
            }
            else {
                _self.footer.getControl("save").setAllowClick();
            }
        });

        
        function setShowErrorMessage() {
            var focusTarget = null;

            var errorsOfForm = _self.errorMessage.where(function (x) {
                return x.type === "widget";
            });

            showFormError(errorsOfForm);

            //----------------------------------------
            // form/grid(폼,그리드)
            // Message/Confirm Error
            //----------------------------------------
            if ($.isNull(focusTarget) == false || $.isEmpty(errorsOfForm) == false) {
                showFocusTarget.call(this);
                return;
            }

            //----------------------------------------
            // Message error
            //----------------------------------------
            var errorOfMessage = _self.errorMessage.first(function (obj) { return obj.type === "message"; });
            if ($.isEmpty(errorOfMessage) == false) {
                ecount.alert(errorOfMessage.errorMessage, errorOfMessage.callback);
                return;
            }

            //----------------------------------------
            // util
            //----------------------------------------
            // focus
            function showFocusTarget() { 
                var error = focusTarget.error;

                //handling various Widget(종류에 따른 메시지 및 포커스 처리_
                switch (focusTarget.type) {
                    case "form":
                        _self.contents.getControl(error.controlId).showError(error.errorMessage);
                        _self.contents.getControl(error.controlId).setFocus(this.errorFormFocus, { readonly: true }); //{ index: 0, readonly: true }

                        break;
                }

            }

            //form error(폼 에러표시)
            function showFormError(errors) {
                $.each(errors, function (i, x) {
                    if ($.isNull(focusTarget)) {
                        focusTarget = setFocusTarget("form", x);
                        return true;
                    }
                    _self.contents.getControl(x.controlId).showError(x.errorMessage);
                });
            }

            //setting focus target(포커스대상 콘트롤설정)
            function setFocusTarget(type, error) {
                return {
                    type: type,
                    error: error
                };
            }
        }
     },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {

    },

    onPopupHandler: function (event, param, handler) {
        if (event.cid == "defaultAccount") {
            param.CALLTYPE = "5"; // 5, 계좌, 104: 카드사, 106: 카드
        }

        handler(param);
    },

    //컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (event, data) {
        switch (event.controlID) {
            case "AcctNo":
                this.contents.getControl("cash_jrnl_type").setValue(data.data.CASH_JRNL_TYPE);
                this.contents.getControl("account_jrnl_type").setValue(data.data.ACCOUNT_JRNL_TYPE);
                break;
            case "Fees":
                this.contents.getControl("fees_jrnl_type").setValue(data.data.FEES_JRNL_TYPE);
                break;
            case "Vat":
                this.contents.getControl("vat_jnlz_type_cd").setValue(data.data.VAT_JNLZ_TYPE_CD);
                break;
            case "Withholding":
                this.contents.getControl("wthdg_jnlz_type_cd").setValue(data.data.WTHDG_JNLZ_TYPE_CD);
                break;
            default:
                break;
        }

        data.callback && data.callback();
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/

    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    onDropdownRestoreDefault:function(e){
        var _self = this;
        var param = {
            IsZACODE: 1,
            TRX_TYPE: _self.TrxType,
            SER_NO: _self.SerNo
        };


        ecount.common.api({
            url: "/Account/Common/GetEasyEntrySetting",
        data: Object.toJSON(param),
            success: function (result) {
                if (result.Status != "200") {
                        runSuccessFunc = result.Status == "202";
                        ecount.alert(result.Error);
                } else {
                        var basicEditorId = _self.basicEntrySet.EDITOR_ID||"";
                    var basicEditDt = _self.basicEntrySet.EDIT_DT||"";
                    _self.basicEntrySet = result.Data.Data;
                    _self.basicEntrySet.EDITOR_ID = basicEditorId;
                    _self.basicEntrySet.EDIT_DT = basicEditDt;
                        _self.setInitControl();
                }
            }
        });
    },

    // 돈들어온계좌/돈나가는계좌 분개설정
    onFunctionAcctNo: function () {
        var param = {
            UseCash: true,
            UseAccount: true,
            UseFees: false,
            UseVat: false,
            UseWithholding: false,
            controlID: "AcctNo",
            width: 300,
        height: 600,
        };

        this.callJrnlPopup(param);
    },

    // 수수료 분개설정
    onFunctionFees: function () {
        var param = {
                    UseCash: false,
                    UseAccount: false,
                    UseFees: true,
                    UseVat: false,
                    UseWithholding: false,
                    JRNL_TYPE_DES1: this.JRNL_TYPE_DES1,
                    JRNL_TYPE_DES2: this.JRNL_TYPE_DES2,

                    controlID: "Fees",
                    width: 300,
                    height: 350,
            };

        this.callJrnlPopup(param);
    },

    // 부가세 분개설정
    onFunctionVat: function () {
        var param = {
            UseCash: false,
            UseAccount: false,
            UseFees: false,
            UseVat: true,
            UseWithholding: false,
            JRNL_TYPE_DES1: this.JRNL_TYPE_DES1,
            JRNL_TYPE_DES2: this.JRNL_TYPE_DES2,

            controlID: "Vat",
            width: 300,
            height: 350,
        };

        this.callJrnlPopup(param);
    },

    // 원천징수 분개설정
    onFunctionWithholding: function () {
        var param = {
            UseCash: false,
            UseAccount: false,
            UseFees: false,
            UseVat: false,
            UseWithholding: true,
            JRNL_TYPE_DES1: this.JRNL_TYPE_DES1,
            JRNL_TYPE_DES2: this.JRNL_TYPE_DES2,

            controlID: "Withholding",
            width: 300,
            height: 350,
        };

        this.callJrnlPopup(param);
    },

    ON_KEY_F8: function () {
            this.onFooterSave();
    },
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    //닫기버튼(Close Button)
    onFooterClose: function () {
        this.close();
    },

    // History button clicked event
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.basicEntrySet.EDIT_DT,
            lastEditId: this.basicEntrySet.EDITOR_ID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false,
            additional: false
        });
    },


    /********************************************************************** 
    * user function 
    **********************************************************************/

    getPropertyInfo: function (key) {
        var result = {
            id: "",
            name: "",
            title: "",
            value: "",
            label: "",
            use: "",
            useSettingFn: "",
            useSettingFnType: ""
        };

        switch (key) {
            case "DR_GYE_CODE1":
                result = {
                    id: "dr_gye_code1",
                    name: "DR_GYE_CODE1",
                    title: "DR_GYE_CODE1_TITLE",
                    value: "DR_GYE_CODE1",
                    label: "DR_GYE_DES1",
                    use: "DR_GYE_CODE1_USE",
                    useSettingFn: "DR_GYE_CODE1_USE_SETTING_FN",
                    useSettingFnType: "DR_GYE_CODE1_USE_SETTING_FN_TYPE",
                    useCombine: "DR_GYE_CODE1_USE_COMBINE",
                    useCombineType: "DR_GYE_CODE1_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue : "DR_GYE_CODE1_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "DR_GYE_CODE1_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "DR_GYE_CODE1_EMPTY_CHECK"
                };
                break;
            case "DR_GYE_CODE2":
                result = {
                    id: "dr_gye_code2",
                    name: "DR_GYE_CODE2",
                    title: "DR_GYE_CODE2_TITLE",
                    value: "DR_GYE_CODE2",
                    label: "DR_GYE_DES2",
                    use: "DR_GYE_CODE2_USE",
                    useSettingFn: "DR_GYE_CODE2_USE_SETTING_FN",
                    useSettingFnType: "DR_GYE_CODE2_USE_SETTING_FN_TYPE",
                    useCombine: "DR_GYE_CODE2_USE_COMBINE",
                    useCombineType: "DR_GYE_CODE2_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue : "DR_GYE_CODE2_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "DR_GYE_CODE2_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "DR_GYE_CODE2_EMPTY_CHECK"
                };
                break;
            case "DR_GYE_CODE3":
                result = {
                    id: "dr_gye_code3",
                    name: "DR_GYE_CODE3",
                    title: "DR_GYE_CODE3_TITLE",
                    value: "DR_GYE_CODE3",
                    label: "DR_GYE_DES3",
                    use: "DR_GYE_CODE3_USE",
                    useSettingFn: "DR_GYE_CODE3_USE_SETTING_FN",
                    useSettingFnType: "DR_GYE_CODE3_USE_SETTING_FN_TYPE",
                    useCombine: "DR_GYE_CODE3_USE_COMBINE",
                    useCombineType: "DR_GYE_CODE3_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue : "DR_GYE_CODE3_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "DR_GYE_CODE3_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "DR_GYE_CODE3_EMPTY_CHECK"
                };
                break;
            case "DR_GYE_CODE4":
                result = {
                    id: "dr_gye_code4",
                    name: "DR_GYE_CODE4",
                    title: "DR_GYE_CODE4_TITLE",
                    value: "DR_GYE_CODE4",
                    label: "DR_GYE_DES4",
                    use: "DR_GYE_CODE4_USE",
                    useSettingFn: "DR_GYE_CODE4_USE_SETTING_FN",
                    useSettingFnType: "DR_GYE_CODE4_USE_SETTING_FN_TYPE",
                    useCombine: "DR_GYE_CODE4_USE_COMBINE",
                    useCombineType: "DR_GYE_CODE4_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue: "DR_GYE_CODE4_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "DR_GYE_CODE4_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "DR_GYE_CODE4_EMPTY_CHECK"
                };
                break;
            case "CR_GYE_CODE1":
                result = {
                    id: "cr_gye_code1",
                    name: "CR_GYE_CODE1",
                    title: "CR_GYE_CODE1_TITLE",
                    value: "CR_GYE_CODE1",
                    label: "CR_GYE_DES1",
                    use: "CR_GYE_CODE1_USE",
                    useSettingFn: "CR_GYE_CODE1_USE_SETTING_FN",
                    useSettingFnType: "CR_GYE_CODE1_USE_SETTING_FN_TYPE",
                    useCombine: "CR_GYE_CODE1_USE_COMBINE",
                    useCombineType: "CR_GYE_CODE1_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue : "CR_GYE_CODE1_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "CR_GYE_CODE1_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "CR_GYE_CODE1_EMPTY_CHECK"
                };
                break;
            case "CR_GYE_CODE2":
                result = {
                    id: "cr_gye_code2",
                    name: "CR_GYE_CODE2",
                    title: "CR_GYE_CODE2_TITLE",
                    value: "CR_GYE_CODE2",
                    label: "CR_GYE_DES2",
                    use: "CR_GYE_CODE2_USE",
                    useSettingFn: "CR_GYE_CODE2_USE_SETTING_FN",
                    useSettingFnType: "CR_GYE_CODE2_USE_SETTING_FN_TYPE",
                    useCombine: "CR_GYE_CODE2_USE_COMBINE",
                    useCombineType: "CR_GYE_CODE2_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue : "CR_GYE_CODE2_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "CR_GYE_CODE2_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "CR_GYE_CODE2_EMPTY_CHECK"
                };
                break;
            case "CR_GYE_CODE3":
                result = {
                    id: "cr_gye_code3",
                    name: "CR_GYE_CODE3",
                    title: "CR_GYE_CODE3_TITLE",
                    value: "CR_GYE_CODE3",
                    label: "CR_GYE_DES3",
                    use: "CR_GYE_CODE3_USE",
                    useSettingFn: "CR_GYE_CODE3_USE_SETTING_FN",
                    useSettingFnType: "CR_GYE_CODE3_USE_SETTING_FN_TYPE",
                    useCombine: "CR_GYE_CODE3_USE_COMBINE",
                    useCombineType: "CR_GYE_CODE3_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue: "CR_GYE_CODE3_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "CR_GYE_CODE3_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "CR_GYE_CODE3_EMPTY_CHECK"
                };
                break;
            case "CR_GYE_CODE4":
                result = {
                    id: "cr_gye_code4",
                    name: "CR_GYE_CODE4",
                    title: "CR_GYE_CODE4_TITLE",
                    value: "CR_GYE_CODE4",
                    label: "CR_GYE_DES4",
                    use: "CR_GYE_CODE4_USE",
                    useSettingFn: "CR_GYE_CODE4_USE_SETTING_FN",
                    useSettingFnType: "CR_GYE_CODE4_USE_SETTING_FN_TYPE",
                    useCombine: "CR_GYE_CODE4_USE_COMBINE",
                    useCombineType: "CR_GYE_CODE4_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue: "CR_GYE_CODE4_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "CR_GYE_CODE4_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "CR_GYE_CODE4_EMPTY_CHECK"
                };
                break;
            case "EXCHANGE_GAIN_GYE_CODE":
                result = {
                    id: "exchange_gain_gye_code",
                    name: "EXCHANGE_GAIN_GYE_CODE",
                    title: "EXCHANGE_GAIN_GYE_CODE_TITLE",
                    value: "EXCHANGE_GAIN_GYE_CODE",
                        label: "EXCHANGE_GAIN_GYE_DES",
                    use: "EXCHANGE_GAIN_GYE_CODE_USE",
                    useSettingFn: "EXCHANGE_GAIN_GYE_CODE_USE_SETTING_FN",
                    useSettingFnType: "EXCHANGE_GAIN_GYE_CODE_USE_SETTING_FN_TYPE",
                    useCombine: "EXCHANGE_GAIN_GYE_CODE_USE_COMBINE",
                    useCombineType: "EXCHANGE_GAIN_GYE_CODE_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue: "EXCHANGE_GAIN_GYE_CODE_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "EXCHANGE_GAIN_GYE_CODE_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "EXCHANGE_GAIN_GYE_CODE_EMPTY_CHECK"
                };
                break;
            case "EXCHANGE_LOSS_GYE_CODE":
                result = {
                    id: "exchange_loss_gye_code",
                    name: "EXCHANGE_LOSS_GYE_CODE",
                    title: "EXCHANGE_LOSS_GYE_CODE_TITLE",
                    value: "EXCHANGE_LOSS_GYE_CODE",
                    label: "EXCHANGE_LOSS_GYE_DES",
                    use: "EXCHANGE_LOSS_GYE_CODE_USE",
                    useSettingFn: "EXCHANGE_LOSS_GYE_CODE_USE_SETTING_FN",
                    useSettingFnType: "EXCHANGE_LOSS_GYE_CODE_USE_SETTING_FN_TYPE",
                    useCombine: "EXCHANGE_LOSS_GYE_CODE_USE_COMBINE",
                    useCombineType: "EXCHANGE_LOSS_GYE_CODE_USE_COMBINE_TYPE",
                    useCombinCodeTargetValue: "EXCHANGE_LOSS_GYE_CODE_USE_COMBINE_TARGET_VALUE",
                    useCombinCodeTargetLabel: "EXCHANGE_LOSS_GYE_CODE_USE_COMBINE_TARGET_DES",
                    isEmptyCheck: "EXCHANGE_LOSS_GYE_CODE_EMPTY_CHECK"
                };
                break;
        }

        return result;
    },

    setUseBasicEntrySet: function (trxType, serNo) {
        var _option = {
            CR_GYE_CODE1_USE: false,
            CR_GYE_CODE2_USE: false,
            CR_GYE_CODE3_USE: false,
            CR_GYE_CODE4_USE: false,
            EXCHANGE_LOSS_GYE_CODE_USE: false,

            CR_GYE_CODE1_TITLE: null,
            CR_GYE_CODE2_TITLE: null,
            CR_GYE_CODE3_TITLE: null,
            CR_GYE_CODE4_TITLE: null,
            EXCHANGE_LOSS_GYE_CODE_TITLE: null,

            CR_GYE_CODE1_USE_SETTING_FN: false,
            CR_GYE_CODE1_USE_SETTING_FN_TYPE: null,
            CR_GYE_CODE2_USE_SETTING_FN: false,
            CR_GYE_CODE2_USE_SETTING_FN_TYPE: null,
            CR_GYE_CODE3_USE_SETTING_FN: false,
            CR_GYE_CODE3_USE_SETTING_FN_TYPE: null,
            CR_GYE_CODE4_USE_SETTING_FN: false,
            CR_GYE_CODE4_USE_SETTING_FN_TYPE: null,
            EXCHANGE_LOSS_GYE_CODE_USE_SETTING_FN: false,
            EXCHANGE_LOSS_GYE_CODE_USE_SETTING_FN_TYPE: null,

            CR_GYE_CODE1_USE_COMBINE: false,
            CR_GYE_CODE1_USE_COMBINE_TYPE: null,
            CR_GYE_CODE1_USE_COMBINE_TARGET_VALUE: null,
            CR_GYE_CODE1_USE_COMBINE_TARGET_DES: null,
            CR_GYE_CODE2_USE_COMBINE: false,
            CR_GYE_CODE2_USE_COMBINE_TYPE: null,
            CR_GYE_CODE2_USE_COMBINE_TARGET_VALUE: null,
            CR_GYE_CODE2_USE_COMBINE_TARGET_DES: null,
            CR_GYE_CODE3_USE_COMBINE: false,
            CR_GYE_CODE3_USE_COMBINE_TYPE: null,
            CR_GYE_CODE3_USE_COMBINE_TARGET_VALUE: null,
            CR_GYE_CODE3_USE_COMBINE_TARGET_DES: null,
            CR_GYE_CODE4_USE_COMBINE: false,
            CR_GYE_CODE4_USE_COMBINE_TYPE: null,
            CR_GYE_CODE4_USE_COMBINE_TARGET_VALUE: null,
            CR_GYE_CODE4_USE_COMBINE_TARGET_DES: null,
            EXCHANGE_LOSS_GYE_CODE_USE_COMBINE: false,
            EXCHANGE_LOSS_GYE_CODE_USE_COMBINE_TYPE: null,
            EXCHANGE_LOSS_GYE_CODE_USE_COMBINE_TARGET_VALUE: null,
            EXCHANGE_LOSS_GYE_CODE_USE_COMBINE_TARGET_DES: null,

            DR_GYE_CODE1_USE: false,
            DR_GYE_CODE2_USE: false,
            DR_GYE_CODE3_USE: false,
            DR_GYE_CODE4_USE: false,
            EXCHANGE_GAIN_GYE_CODE_USE: false,

            DR_GYE_CODE1_TITLE: null,
            DR_GYE_CODE2_TITLE: null,
            DR_GYE_CODE3_TITLE: null,
            DR_GYE_CODE4_TITLE: null,
            EXCHANGE_GAIN_GYE_CODE_TITLE: null,

            DR_GYE_CODE1_USE_SETTING_FN: false,
            DR_GYE_CODE1_USE_SETTING_FN_TYPE: null,
            DR_GYE_CODE2_USE_SETTING_FN: false,
            DR_GYE_CODE2_USE_SETTING_FN_TYPE: null,
            DR_GYE_CODE3_USE_SETTING_FN: false,
            DR_GYE_CODE3_USE_SETTING_FN_TYPE: null,
            DR_GYE_CODE4_USE_SETTING_FN: false,
            DR_GYE_CODE4_USE_SETTING_FN_TYPE: null,
            EXCHANGE_GAIN_GYE_CODE_USE_SETTING_FN: false,
            EXCHANGE_GAIN_GYE_CODE_USE_SETTING_FN_TYPE: null,

            DR_GYE_CODE1_USE_COMBINE: false,
            DR_GYE_CODE1_USE_COMBINE_TYPE: null,
            DR_GYE_CODE1_USE_COMBINE_TARGET_VALUE: null,
            DR_GYE_CODE1_USE_COMBINE_TARGET_DES: null,
            DR_GYE_CODE2_USE_COMBINE: false,
            DR_GYE_CODE2_USE_COMBINE_TYPE: null,
            DR_GYE_CODE2_USE_COMBINE_TARGET_VALUE: null,
            DR_GYE_CODE2_USE_COMBINE_TARGET_DES: null,
            DR_GYE_CODE3_USE_COMBINE: false,
            DR_GYE_CODE3_USE_COMBINE_TYPE: null,
            DR_GYE_CODE3_USE_COMBINE_TARGET_VALUE: null,
            DR_GYE_CODE3_USE_COMBINE_TARGET_DES: null,
            DR_GYE_CODE4_USE_COMBINE: false,
            DR_GYE_CODE4_USE_COMBINE_TYPE: null,
            DR_GYE_CODE4_USE_COMBINE_TARGET_VALUE: null,
            DR_GYE_CODE4_USE_COMBINE_TARGET_DES: null,
            EXCHANGE_GAIN_GYE_CODE_USE_COMBINE: false,
            EXCHANGE_GAIN_GYE_CODE_USE_COMBINE_TYPE: null,
            EXCHANGE_GAIN_GYE_CODE_USE_COMBINE_TARGET_VALUE: null,
            EXCHANGE_GAIN_GYE_CODE_USE_COMBINE_TARGET_DES: null,

            CR_GYE_CODE1_EMPTY_CHECK: true,
            CR_GYE_CODE2_EMPTY_CHECK: true,
            CR_GYE_CODE3_EMPTY_CHECK: true,
            CR_GYE_CODE4_EMPTY_CHECK: true,
            DR_GYE_CODE1_EMPTY_CHECK: true,
            DR_GYE_CODE2_EMPTY_CHECK: true,
            DR_GYE_CODE3_EMPTY_CHECK: true,
            DR_GYE_CODE4_EMPTY_CHECK: true,
            EXCHANGE_GAIN_GYE_CODE_EMPTY_CHECK: true,
            EXCHANGE_LOSS_GYE_CODE_EMPTY_CHECK: true,
        }

        //매입처로(ToVendor)
        if (trxType == "20" && serNo == "01") {
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL35004;
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
         }
        else if (trxType == "20" && serNo == "05") {
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL01492;
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;
        }

        // FromCustomer and FromEmployee
        if (trxType == "10" && (serNo == "02" || serNo == "01")) {
            // Customer
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = serNo == "02" ? ecount.resource.LBL35004 : ecount.resource.LBL01492;
            // Fees
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;

            if (serNo == "02") {
                //원천징수
                _option.DR_GYE_CODE4_USE = true;
                _option.DR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

                _option.DR_GYE_CODE4_USE_SETTING_FN = true;
                _option.DR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
            }
        }


        //(bank loan) and (acct > cash-in > others)
        if (trxType == "10" && (serNo == "03" || serNo == "05")) {
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;
        }

        //Cash Out Others
        if (trxType == "20" && serNo == "08") {
        // Fees
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;
        }

        //loan Repayment & Interest
        if (trxType == "20" && serNo == "03") {
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL04362;
        }

        // Cash Out - Bank Transfer
        if (trxType == "20" && serNo == "06") {
            // Fees
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;
        }

        //non-cash > credit card receipt
        if (trxType == "60" && serNo == "01") {
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;//LBL00778

            _option.DR_GYE_CODE2_USE_SETTING_FN = true;
            _option.DR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT";
        }

        // From merchant account
        if (trxType == "10" && serNo == "08") {
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;

            _option.DR_GYE_CODE2_USE_COMBINE = true;
            _option.DR_GYE_CODE2_USE_COMBINE_TYPE = "4";
            _option.DR_GYE_CODE2_USE_COMBINE_TARGET_VALUE = "CR_GYE_CODE3_1",
            _option.DR_GYE_CODE2_USE_COMBINE_TARGET_DES = "CR_GYE_DES3_1"
        }

        // From merchant account
        if (trxType == "20" && serNo == "07") {
            // Fees
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;
        }

        if (trxType == "40" && serNo == "01") {
            //------------------------------
            // 매출전표1 (Sale Invoice 1)
            //------------------------------
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01127;
            _option.CR_GYE_CODE2_USE = true;
            _option.CR_GYE_CODE2_TITLE = ecount.resource.LBL01356;

            _option.CR_GYE_CODE2_USE_SETTING_FN = true;
            _option.CR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT";

            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL01048;
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL01705;

            //원천징수
            _option.DR_GYE_CODE4_USE = true;
            _option.DR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.DR_GYE_CODE1_USE_SETTING_FN = true;
            _option.DR_GYE_CODE1_USE_SETTING_FN_TYPE = "ACCT_NO";
            _option.DR_GYE_CODE3_USE_SETTING_FN = true;
            _option.DR_GYE_CODE3_USE_SETTING_FN_TYPE = "FEES";
            _option.DR_GYE_CODE4_USE_SETTING_FN = true;
            _option.DR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }
        else if (trxType == "45" && serNo == "01") {
            //------------------------------
            // 매입전표1 (Sale Invoice 1)
            //------------------------------
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01046;

            _option.CR_GYE_CODE1_USE_SETTING_FN = true;
            _option.CR_GYE_CODE1_USE_SETTING_FN_TYPE = "ACCT_NO";

            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL08366;
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL01705;

            _option.DR_GYE_CODE2_USE_SETTING_FN = true;
            _option.DR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT";

            _option.DR_GYE_CODE3_USE_SETTING_FN = true;
            _option.DR_GYE_CODE3_USE_SETTING_FN_TYPE = "FEES";

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }

        //cash out > by receipt
        if (trxType == "20" && serNo == "02") {
            //amount
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;//LBL00778

            _option.DR_GYE_CODE2_USE_SETTING_FN = true;
            _option.DR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT";

            //fees
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL01705;

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }

        //non-cash > receipt
        if (trxType == "50" && serNo == "01") {
            //user
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01459;

            //vat
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;

            _option.DR_GYE_CODE2_USE_SETTING_FN = true;
            _option.DR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT";

        }

        //Import - Log Misc Expenses
        if (trxType == "20" && serNo == "15") {
            //Expenses
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL01137;

            // Fees
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;

            // Bank Account Out [CR_GYE_CODE1]
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01046;

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
            
        }

        //import > update account
        if (trxType == "90" && serNo == "03") {
            //amount
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL00778;
        }
        //Import - To Vendor
        if (trxType == "20" && serNo == "14") {
            // Customer
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL35004 ;
            // Fees
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            // 외환차손익
            _option.EXCHANGE_GAIN_GYE_CODE_USE = true;
            _option.EXCHANGE_GAIN_GYE_CODE_TITLE = ecount.resource.LBL13501;
            _option.EXCHANGE_GAIN_GYE_CODE_EMPTY_CHECK = false;
            _option.EXCHANGE_LOSS_GYE_CODE_USE = true;
            _option.EXCHANGE_LOSS_GYE_CODE_TITLE = ecount.resource.LBL13502;
            _option.EXCHANGE_LOSS_GYE_CODE_EMPTY_CHECK = false;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }
        //import > to customs broker
        if (trxType == "20" && serNo == "13") {

            // customs broker
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL00622;

            // fees
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            // 외환차손익
            _option.EXCHANGE_GAIN_GYE_CODE_USE = true;
            _option.EXCHANGE_GAIN_GYE_CODE_TITLE = ecount.resource.LBL13501;
            _option.EXCHANGE_GAIN_GYE_CODE_EMPTY_CHECK = false;
            _option.EXCHANGE_LOSS_GYE_CODE_USE = true;
            _option.EXCHANGE_LOSS_GYE_CODE_TITLE = ecount.resource.LBL13502;
            _option.EXCHANGE_LOSS_GYE_CODE_EMPTY_CHECK = false;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }
        // 매입대금청구서
        if (trxType == "20" && serNo == "16") {
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL35004;
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705;
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01046;

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }

        //잔액조정 (Balance Adjustment)
        if (trxType == "98" && serNo == "97") {
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01514;
        }

        //각각 메뉴별 셋팅(add another menu)

        //Import - Log Misc Expenses
        if (trxType == "45" && serNo == "04") {
            //Expenses [DR_GYE_CODE1]
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL01137;

            // Tax [DR_GYE_CODE2]
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;

            _option.DR_GYE_CODE2_USE_SETTING_FN = true;
            _option.DR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT";

            // Fees [DR_GYE_CODE3]
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL01705;

            _option.DR_GYE_CODE3_USE_SETTING_FN = true;
            _option.DR_GYE_CODE3_USE_SETTING_FN_TYPE = "FEES";

            // Bank Account Out [CR_GYE_CODE1]
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01046;

            _option.CR_GYE_CODE1_USE_SETTING_FN = true;
            _option.CR_GYE_CODE1_USE_SETTING_FN_TYPE = "ACCT_NO";

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }

        if (trxType == "98" && serNo == "04") {
                //------------------------------
                // 지출보고서
                //------------------------------
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL00495 + '(' + ecount.resource.LBL02704 + ')';
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL05576;

            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;

            _option.EXCHANGE_GAIN_GYE_CODE_USE = true;
            _option.EXCHANGE_GAIN_GYE_CODE_TITLE = ecount.resource.LBL13501;
            _option.EXCHANGE_GAIN_GYE_CODE_EMPTY_CHECK = false;
            _option.EXCHANGE_LOSS_GYE_CODE_USE = true;
            _option.EXCHANGE_LOSS_GYE_CODE_TITLE = ecount.resource.LBL13502;
            _option.EXCHANGE_LOSS_GYE_CODE_EMPTY_CHECK = false;

            _option.DR_GYE_CODE3_USE_COMBINE = true;
            _option.DR_GYE_CODE3_USE_COMBINE_TYPE = "2";

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }

        if (trxType == "98" && serNo == "05") {
                //------------------------------
                // 입금보고서
                //------------------------------
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL00495 + '(' + ecount.resource.LBL01018 + ')';
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL05576;

            _option.EXCHANGE_GAIN_GYE_CODE_USE = true;
            _option.EXCHANGE_GAIN_GYE_CODE_TITLE = ecount.resource.LBL13501;
            _option.EXCHANGE_GAIN_GYE_CODE_EMPTY_CHECK = false;
            _option.EXCHANGE_LOSS_GYE_CODE_USE = true;
            _option.EXCHANGE_LOSS_GYE_CODE_TITLE = ecount.resource.LBL13502;
            _option.EXCHANGE_LOSS_GYE_CODE_EMPTY_CHECK = false;

            _option.DR_GYE_CODE3_USE_COMBINE = true;
            _option.DR_GYE_CODE3_USE_COMBINE_TYPE = "2";

            //원천징수
            _option.DR_GYE_CODE4_USE = true;
            _option.DR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.DR_GYE_CODE4_USE_SETTING_FN = true;
            _option.DR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }

        if (trxType == "98" && serNo == "06") {
                //------------------------------
                // 가지급금보고서
                //------------------------------
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL03707;

            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL00495 + '(' + ecount.resource.LBL02704 + ')';
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL05576;
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;

            _option.EXCHANGE_GAIN_GYE_CODE_USE = true;
            _option.EXCHANGE_GAIN_GYE_CODE_TITLE = ecount.resource.LBL13501;
            _option.EXCHANGE_GAIN_GYE_CODE_EMPTY_CHECK = false;
            _option.EXCHANGE_LOSS_GYE_CODE_USE = true;
            _option.EXCHANGE_LOSS_GYE_CODE_TITLE = ecount.resource.LBL13502;
            _option.EXCHANGE_LOSS_GYE_CODE_EMPTY_CHECK = false;

            _option.DR_GYE_CODE3_USE_COMBINE = true;
            _option.DR_GYE_CODE3_USE_COMBINE_TYPE = "1";
        }

        if (trxType == "98" && serNo == "98") {

            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL12529;  //LBL12529


            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL12530;  //LBL12530

        }

        if (trxType == "98" && serNo == "96") {
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL19081;
        }

        if (trxType == "45" && serNo == "10") {
            //------------------------------
            // 고정자산증가 (FixedAssets Increase)
            //------------------------------
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01046;

            _option.CR_GYE_CODE1_USE_SETTING_FN = true;
            _option.CR_GYE_CODE1_USE_SETTING_FN_TYPE = "ACCT_NO";

            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01356;
            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL01705;

            _option.DR_GYE_CODE2_USE_SETTING_FN = true;
            _option.DR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT";

            _option.DR_GYE_CODE3_USE_SETTING_FN = true;
            _option.DR_GYE_CODE3_USE_SETTING_FN_TYPE = "FEES";

            //원천징수
            _option.CR_GYE_CODE4_USE = true;
            _option.CR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.CR_GYE_CODE4_USE_SETTING_FN = true;
            _option.CR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";
        }


        if (trxType == "40" && serNo == "10") {
            //------------------------------
            // 고정자산감소 (FixedAssets Decrease)
            //------------------------------
            _option.CR_GYE_CODE2_USE = true;
            _option.CR_GYE_CODE2_TITLE = ecount.resource.LBL01356; // 부가세

            _option.CR_GYE_CODE2_USE_SETTING_FN = true;
            _option.CR_GYE_CODE2_USE_SETTING_FN_TYPE = "VAT"; // 부가세

            _option.DR_GYE_CODE3_USE = true;
            _option.DR_GYE_CODE3_TITLE = ecount.resource.LBL01705; // 수수료

            _option.DR_GYE_CODE3_USE_SETTING_FN = true;
            _option.DR_GYE_CODE3_USE_SETTING_FN_TYPE = "FEES";

            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL01048; // 돈들어온계좌번호
            _option.DR_GYE_CODE1_USE_SETTING_FN = true;
            _option.DR_GYE_CODE1_USE_SETTING_FN_TYPE = "ACCT_NO";

            //원천징수
            _option.DR_GYE_CODE4_USE = true;
            _option.DR_GYE_CODE4_TITLE = ecount.resource.LBL93205;

            _option.DR_GYE_CODE4_USE_SETTING_FN = true;
            _option.DR_GYE_CODE4_USE_SETTING_FN_TYPE = "WTHDG";

        }

        if (trxType == "35" && serNo == "01") {
            //------------------------------
            // 받을어음수령 (Notes Receivable)
            //------------------------------
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL00329; // 거래처(Customer/vendor)
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL01829; // 어음번호(Note No.)
        }

        if (trxType == "10" && serNo == "04") {
            //------------------------------
            // 어음관리-어음할인/만기 (Notes - Discount/ Maturity)
            //------------------------------
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01829; // 어음번호(Note No.)
            _option.DR_GYE_CODE2_USE = true;
            _option.DR_GYE_CODE2_TITLE = ecount.resource.LBL01705; // 수수료(Fees)
        }

        if ((trxType == "36" || trxType == "30") && serNo == "01") {
            //------------------------------
            // 받을어음결제-받을어음거래처결제 (Notes Endorsement)
            //------------------------------
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL00329; // 거래처(Customer/vendor)
            _option.CR_GYE_CODE1_USE = true;
            _option.CR_GYE_CODE1_TITLE = ecount.resource.LBL01829; // 어음번호(Note No.)
        }

        if (trxType == "20" && serNo == "04") {
            //------------------------------
            // 출금-지급어음결제 (Payment Note Payable)
            //------------------------------
            _option.DR_GYE_CODE1_USE = true;
            _option.DR_GYE_CODE1_TITLE = ecount.resource.LBL01829; // 어음번호(Note No.)
        }

        return _option;
    },

    setBasicEntrySort: function (trxType, serNo) {
        var _option = [
            "DR_GYE_CODE1",
            "CR_GYE_CODE1",
            "DR_GYE_CODE2",
            "DR_GYE_CODE3",
            "DR_GYE_CODE4",
            "CR_GYE_CODE2",
            "CR_GYE_CODE3",
            "CR_GYE_CODE4"
        ];


        if (trxType == "40" && serNo == "01") {
            //------------------------------
            // 매출전표1 (Sale Invoice 1)
            //------------------------------
            _option = [
                "CR_GYE_CODE2",
                "DR_GYE_CODE3",
                "CR_GYE_CODE1",
                "DR_GYE_CODE1",

                "CR_GYE_CODE3",
                "DR_GYE_CODE2",
                "DR_GYE_CODE4"
            ];
        }
        else if (trxType == "45" && serNo == "01") {
            //------------------------------
            // 매입전표1 (Sale Invoice 1)
            //------------------------------
            _option = [
                "DR_GYE_CODE1",
                "DR_GYE_CODE2",
                "DR_GYE_CODE3",
                "CR_GYE_CODE1",

                "CR_GYE_CODE2",
                "CR_GYE_CODE3",
                "CR_GYE_CODE4"
            ];
        }
        else if (trxType == "20" && serNo == "16") {
            //------------------------------
            // 매입대금청구서
            //------------------------------
            _option = [
                "DR_GYE_CODE1",
                "DR_GYE_CODE2",
                "CR_GYE_CODE1",

                "DR_GYE_CODE3",
                "CR_GYE_CODE2",
                "CR_GYE_CODE3",
                "CR_GYE_CODE4"
            ];
        }
        else if (trxType == "98" && serNo == "04") {
            //------------------------------
            // 지출보고서
            //------------------------------
            _option =[
                "DR_GYE_CODE1",
                "DR_GYE_CODE3",
                "DR_GYE_CODE2",
                "EXCHANGE_GAIN_GYE_CODE",
                "EXCHANGE_LOSS_GYE_CODE",

                "CR_GYE_CODE1",
                "CR_GYE_CODE2",
                "CR_GYE_CODE3",
                "CR_GYE_CODE4"
            ];
        }
        else if (trxType == "98" && serNo == "05") {
            //------------------------------
            // 입금보고서
            //------------------------------
            _option =[
                "CR_GYE_CODE1",
                "DR_GYE_CODE3",
                "EXCHANGE_GAIN_GYE_CODE",
                "EXCHANGE_LOSS_GYE_CODE",

                "DR_GYE_CODE1",
                "DR_GYE_CODE2",
                "CR_GYE_CODE2",
                "CR_GYE_CODE3",
                "DR_GYE_CODE4"
            ];
        }
        else if (trxType == "98" && serNo == "06") {
            //------------------------------
            // 가지급금보고서
            //------------------------------
            _option =[
                "CR_GYE_CODE1",
                "DR_GYE_CODE1",
                "DR_GYE_CODE3",
                "DR_GYE_CODE2",
                "EXCHANGE_GAIN_GYE_CODE",
                "EXCHANGE_LOSS_GYE_CODE",

                "CR_GYE_CODE2",
                "CR_GYE_CODE3"
            ];
        }
        else if (trxType == "98" && serNo == "96") {
            //------------------------------
            // 입금보고서
            //------------------------------
            _option = [
                "CR_GYE_CODE1"
            ];
        }
        else if (trxType == "45" && serNo == "10") {
            //------------------------------
            // 고정자산증가 (FixedAssets Increase)
            //------------------------------
            _option = [
                "DR_GYE_CODE1",
                "DR_GYE_CODE2",
                "DR_GYE_CODE3",
                "CR_GYE_CODE1",

                "CR_GYE_CODE2",
                "CR_GYE_CODE3",
                "CR_GYE_CODE4"
            ];
        } else if (trxType == "40" && serNo == "10") {
            //------------------------------
            // 매출전표1 (Sale Invoice 1)
            //------------------------------
            _option = [
                "CR_GYE_CODE2",
                "DR_GYE_CODE3",
                "DR_GYE_CODE1",
                "DR_GYE_CODE4"
            ];
        } else if (trxType == "35" && serNo == "01") {
            //------------------------------
            // 받을어음수령 (Notes Receivable)
            //------------------------------
            _option = [
                "CR_GYE_CODE1",
                "DR_GYE_CODE1"
            ];
        } else if (trxType == "10" && serNo == "04") {
            //------------------------------
            // 어음관리-어음할인/만기 (Notes - Discount/ Maturity)
            //------------------------------
            _option = [
                "CR_GYE_CODE1",
                "DR_GYE_CODE2"
            ];
        } else if ((trxType == "36" || trxType == "30") && serNo == "01") {
            //------------------------------
            // 받을어음결제-받을어음거래처결제 (Notes Endorsement) 36
            // 어음관리-지급어음발행 (Issue Notes Payable) 30
            //------------------------------
            _option = [
                "DR_GYE_CODE1",
                "CR_GYE_CODE1"
            ];
        } else if (trxType == "20" && serNo == "04") {
            //------------------------------
            // 출금-지급어음결제 (Payment Note Payable)
            //------------------------------
            _option = [
                "DR_GYE_CODE1"
            ];
        } else if (trxType == "20" && serNo == "14") {
            //------------------------------
            // 수입비용 - 거래대금지급
            //------------------------------
            _option = [
                "DR_GYE_CODE1",
                "CR_GYE_CODE1",
                "DR_GYE_CODE2",
                "DR_GYE_CODE3",
                "DR_GYE_CODE4",
                "CR_GYE_CODE2",
                "CR_GYE_CODE3",
                "CR_GYE_CODE4",

                "EXCHANGE_GAIN_GYE_CODE",
                "EXCHANGE_LOSS_GYE_CODE",
            ];
        } else if (trxType == "20" && serNo == "13") {
            //------------------------------
            // 수입비용 - 관세사에게 지급
            //------------------------------
            _option = [
                "DR_GYE_CODE1",
                "CR_GYE_CODE1",
                "DR_GYE_CODE2",
                "DR_GYE_CODE3",
                "DR_GYE_CODE4",
                "CR_GYE_CODE2",
                "CR_GYE_CODE3",
                "CR_GYE_CODE4",

                "EXCHANGE_GAIN_GYE_CODE",
                "EXCHANGE_LOSS_GYE_CODE",
            ];
        }

        return _option;
    },

    // 매입/매출구분 설정 (Set IoGubun)
    setIoGubun: function (trxType, serNo) {
        var mapper = {
                "40": {
                    "01": "1",   // 매출전표1
                    "10": "1"      // 고정자산감소 (serNo:10, 매출:1)
                },
                "98": {
                    "05": "1",   // 입금보고서
                    "04": "2",   // 지출결의서
                    "96": "1",   // 판매에서 복합결제 시 -> 입금보고서
                },
                "45": {
                    "01": "2",   // 매입전표1
                    "04": "2",   // Import - Import Expenses
                    "10": "2"    // 고정자산증가 (FixedAssets Increase)
                },
                "35": {
                    "01": "2"   // 받을어음수령 (Notes Receivable)
                },
                "10": {
                    "04": "2"   // 어음관리-어음할인/만기 (Notes - Discount/ Maturity)
                },
                "36": {
                    "01": "2"   // 받을어음결제-받을어음거래처결제 (Notes Endorsement)
                },
                "30": {
                    "01": "2"   // 받을어음결제-받을어음거래처결제 (Notes Endorsement)
                },
                "20": {
                    "02": "2",   // 영수증으로
                    "04": "2",   // 출금-지급어음결제 (Payment Note Payable)
                    "16": "2",   // 매입대금청구서
                    "01": "2",
                    "13": "2",   // 관세사에지급
                    "14": "2",   // 거래대금지급
                    "15": "2"   // 일반영수증수령
                },
                "50": {
                    "01": "2" // 일반영수증
                },
                "60": {
                    "01": "2" // 신용카드전표
                }
            };

        if ($.isEmptyObject(mapper[trxType]) == false) {
            return mapper[trxType][serNo];
        }

        return "1";
    },

    //기본값복원시 setInitControl
    setInitControl: function () {
        if (this.TrxType == "98" && this.SerNo == "96") {
            this.contents.getControl("defaultAccount").removeAll();
            this.contents.getControl("defaultAccount").addCode({ value: this.basicEntrySet.CASH_JNLZ_AC_ACCN || "", label: this.basicEntrySet.CASH_JNLZ_AC_ACCN_DES || "" });
        }
        $.each(this.basicEntrySort, function (i, o) {
            
            var propertyInfo = this.getPropertyInfo(o);
            var useFeesCombine = this.useBasicEntrySet[propertyInfo.useCombine];
            
            //수수료 통합형 위젯과의 분기처리
            if (useFeesCombine == true) {
                var valueArray = [{ value: this.basicEntrySet[propertyInfo.value], label: this.basicEntrySet[propertyInfo.label] }];

                switch (this.useBasicEntrySet[propertyInfo.useCombineType]) {
                    case "1":
                    default:
                        break;
                    case "2":
                    case "3":
                        valueArray.push(this.basicEntrySet.JOURNALS_ITEM);
                        break;
                    case "4":
                        valueArray.push({ value: this.basicEntrySet[this.useBasicEntrySet[propertyInfo.useCombinCodeTargetValue]], label: this.basicEntrySet[this.useBasicEntrySet[propertyInfo.useCombinCodeTargetLabel]] });
                        break;
                }

                this.contents.getControl(propertyInfo.id).setValue(valueArray);
            } else {
                this.contents.getControl(propertyInfo.id).removeAll();
                this.contents.getControl(propertyInfo.id).addCode({ value: this.basicEntrySet[propertyInfo.value] || "", label: this.basicEntrySet[propertyInfo.label] || "" });
            }
        }.bind(this));

        this.contents.getControl("cash_jrnl_type").setValue(this.basicEntrySet.CASH_JRNL_TYPE);
        this.contents.getControl("account_jrnl_type").setValue(this.basicEntrySet.ACCOUNT_JRNL_TYPE);
        this.contents.getControl("fees_jrnl_type").setValue(this.basicEntrySet.FEES_JRNL_TYPE);
        this.contents.getControl("wthdg_jnlz_type_cd").setValue(this.basicEntrySet.WTHDG_JNLZ_TYPE_CD);
        this.contents.getControl("vat_jnlz_type_cd").setValue(this.basicEntrySet.VAT_JNLZ_TYPE_CD);
    },


    saveValidate: function () {
        
        if (this.errorMessage == null) {
            this.errorMessage = new Array();
        }

        if (this.TrxType == "98" && this.SerNo == "96") {
            setValidateCodeEmpty.call(this, false, "defaultAccount", "");
        }

        $.each(this.basicEntrySort, function (i, o) {
            var propertyInfo = this.getPropertyInfo(o);
            var useProperty = this.useBasicEntrySet[propertyInfo.use];
            var useFeesCombine = this.useBasicEntrySet[propertyInfo.useCombine];
            var isEmptyCheck = this.useBasicEntrySet[propertyInfo.isEmptyCheck];

            if (useProperty == true && isEmptyCheck == true) {
                if (propertyInfo.id == "dr_gye_code4" || propertyInfo.id == "cr_gye_code4")
                    return true;

                setValidateCodeEmpty.call(this, useFeesCombine, propertyInfo.id, ecount.resource.MSG00118, function () {
                    if (useFeesCombine == true) {
                        switch (this.useBasicEntrySet[propertyInfo.useCombineType]) {
                            case "4":
                                if ($.isEmpty(this.contents.getControl(propertyInfo.id).getValue()[1][0].value)) {
                                    return false;
                                }
                                break;
                        }
                    }

                    return true;
                }.bind(this));
            }
        }.bind(this));

        return true;

        function setErrorMessage(controlId, message, type, callback) {
            callback = callback || function () { };

            this.errorMessage.push({ controlId: controlId, errorMessage: message, type: type, callback: callback });
        }

        function setValidateCodeEmpty(isUseFeesCombine, Id, msg, customCheck) {
            var codeValue;
            
            if (isUseFeesCombine == true) {
                codeValue = this.contents.getControl(Id).getValue()[0][0].value;
            } else {
                codeValue = this.contents.getControl(Id).getSelectedCode()[0];
            }

            if (customCheck && customCheck() == false) {
                this.errorFormFocus = 1;
                setErrorMessage.call(this, Id, msg, "widget");
            }

            if ($.isEmpty(codeValue)) {
                this.errorFormFocus = 0;
                setErrorMessage.call(this, Id, msg, "widget");
            }

        }
    },

    //저장데이터(Set Save Data)
    setSaveApiJsonData: function () {
        var data = {
            TRX_TYPE: this.TrxType,
            SER_NO : this.SerNo,
            DR_GYE_CODE1: "",
            DR_GYE_CODE2: "",
            DR_GYE_CODE3: "",
            DR_GYE_CODE4: "",
            EXCHANGE_GAIN_GYE_CODE: "",

            CR_GYE_CODE1: "",
            CR_GYE_CODE2: "",
            CR_GYE_CODE3: "",
            CR_GYE_CODE4: "",
            EXCHANGE_LOSS_GYE_CODE: "",

            CASH_JRNL_TYPE: this.contents.getControl("cash_jrnl_type").getValue(),
            ACCOUNT_JRNL_TYPE: this.contents.getControl("account_jrnl_type").getValue(),
            FEES_JRNL_TYPE: this.contents.getControl("fees_jrnl_type").getValue(),
            WTHDG_JNLZ_TYPE_CD: this.contents.getControl("wthdg_jnlz_type_cd").getValue(),
            VAT_JNLZ_TYPE_CD: this.contents.getControl("vat_jnlz_type_cd").getValue(),
            
            JOURNALS_ITEM: this.basicEntrySet.JOURNALS_ITEM,

            CR_GYE_CODE3_1: this.basicEntrySet.CR_GYE_CODE3_1 || "",
            CASH_JNLZ_AC_ACCN: this.contents.getControl("defaultAccount") && this.contents.getControl("defaultAccount").getSelectedItem()[0].value
        }

        
        $.each(this.basicEntrySort, function (i, o) {
            
            var propertyInfo = this.getPropertyInfo(o);
            var useFeesCombine = this.useBasicEntrySet[propertyInfo.useCombine];
            //수수료 통합형 위젯과의 분기처리
            if (useFeesCombine == true) {
                data[propertyInfo.value] = this.contents.getControl(propertyInfo.id).getValue()[0][0].value;

                if (["2", "3"].contains(this.useBasicEntrySet[propertyInfo.useCombineType])) {
                    data.JOURNALS_ITEM = this.contents.getControl(propertyInfo.id).getValue()[1];
                }
                if (["4"].contains(this.useBasicEntrySet[propertyInfo.useCombineType])) {
                    data[this.useBasicEntrySet[propertyInfo.useCombinCodeTargetValue]] = this.contents.getControl(propertyInfo.id).getValue()[1][0].value;
                }

            } else {
                data[propertyInfo.value] = this.contents.getControl(propertyInfo.id).getSelectedCode()[0];
            }
        }.bind(this));

        return data;
    },

    // 분개설정팝업호출 (Call Jrnl Popup)
    callJrnlPopup: function (param) {
        var defaultParam = {
            IoGubun: this.ioGubun,
            TrxType: this.TrxType,
            SerNo: this.SerNo,
            UseCash: false,
            UseAccount: false,
            UseFees: false,
            UseVat: false,
            UseWithholding: false,

       
            CR_GYE_DES1: null,
            CR_GYE_DES2: null,
            CR_GYE_DES3: null,
            CR_GYE_DES4: null,
            DR_GYE_DES1: null,
            DR_GYE_DES2: null,
            DR_GYE_DES3: null,
            DR_GYE_DES4: null,

            CASH_JRNL_TYPE: this.contents.getControl("cash_jrnl_type").getValue() || "A",
            ACCOUNT_JRNL_TYPE: this.contents.getControl("account_jrnl_type").getValue() || "A",
            FEES_JRNL_TYPE: this.contents.getControl("fees_jrnl_type").getValue() || "A",
            WTHDG_JNLZ_TYPE_CD: this.contents.getControl("wthdg_jnlz_type_cd").getValue() || "A",
            VAT_JNLZ_TYPE_CD: this.contents.getControl("vat_jnlz_type_cd").getValue() || "A",

            controlID: "",
            width: 350,
            height: 500,
        };
        
        $.each(this.basicEntrySort, function (i, o) {
            
            var propertyInfo = this.getPropertyInfo(o);
            var useFeesCombine = this.useBasicEntrySet[propertyInfo.useCombine];

            //수수료 통합형 위젯과의 분기처리
            if (useFeesCombine == true) {
                defaultParam[propertyInfo.label] = this.contents.getControl(propertyInfo.id).getValue()[0][0].label;

                if (["2", "3"].contains(this.useBasicEntrySet[propertyInfo.useCombineType])) {
                    defaultParam.JOURNALS_ITEM = this.contents.getControl(propertyInfo.id).getValue()[1];
                }
            } else {
                defaultParam[propertyInfo.label]= this.contents.getControl(propertyInfo.id).getSelectedItem()[0].label || (this.basicEntrySet[propertyInfo.label]|| "")
            }
        }.bind(this));

        defaultParam = $.extend(defaultParam, param);

        var parent = ecount.page.popup.prototype.getParentInstance.apply(this, arguments);

        if ($.isFunction(parent.onCallbackPopup)) {
            var callbackOption = {
                pageID: this.pageID,
                callbackID: "setJournalEntry",
            };
            
            var tmpParam = parent.onCallbackPopup(callbackOption, defaultParam);
            if (tmpParam) {
                defaultParam = tmpParam;
            }
        }
        
        //this.basicEntrySet
        this.openWindow({
                url: "/ECERP/Popup.Common/EBD010P_11",
                name: "",
            param: defaultParam,
                popupType: false,
            additional: true
        });
    }
});
