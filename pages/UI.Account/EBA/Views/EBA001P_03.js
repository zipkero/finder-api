window.__define_resource && __define_resource("BTN00141","LBL08060","LBL08065","LBL08066","LBL08067","LBL08068","LBL08069","BTN00065","BTN00008","LBL93038","MSG03318","MSG02479");
/****************************************************************************************************
1. Create Date : 2015-12-03
2. Creator     : 안정환
3. Description : S.C > GENERALTAB > POPUP 공통탭 > 복잡성
4. Precaution  :
5. History     :
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EBA001P_03", {

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    PL_CHANGE_CODE1: null,
    PL_GYE_CODE1: null,
    PL_GYE_DES1: null,
    PL_CHANGE_CODE2: null,
    PL_GYE_CODE2: null,
    PL_GYE_DES2: null,
    CA_CHANGE_CODE: null,
    CA_GYE_CODE: null,
    CA_GYE_DES: null,
    CB_CHANGE_CODE: null,
    CB_GYE_CODE: null,
    CB_GYE_DES: null,
    CC_CHANGE_CODE: null,
    CC_GYE_CODE: null,
    CC_GYE_DES: null,
    userPermit: "",


    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

    },

    render: function () {
        this._super.render.apply(this);
        var self = this;
        var changecode = this.viewBag.InitDatas.deptLoad.Data;
        changecode.forEach(function (A) {
            switch (A.INPUT_GUBUN) {
                case "P":
                    self.PL_GYE_CODE1 = A.GYE_CODE;
                    self.PL_CHANGE_CODE1 = A.CHANGE_CODE;
                    self.PL_GYE_DES1 = A.GYE_DES;
                    break;
                case "A":
                    self.CA_GYE_CODE = A.GYE_CODE;
                    self.CA_CHANGE_CODE = A.CHANGE_CODE;
                    self.CA_GYE_DES = A.GYE_DES;
                    break;
                case "B":
                    self.CB_GYE_CODE = A.GYE_CODE;
                    self.CB_CHANGE_CODE = A.CHANGE_CODE;
                    self.CB_GYE_DES = A.GYE_DES;
                    break;
                case "C":
                    self.CC_GYE_CODE = A.GYE_CODE;
                    self.CC_CHANGE_CODE = A.CHANGE_CODE;
                    self.CC_GYE_DES = A.GYE_DES;
                    break;
                case "Z":
                    self.PL_GYE_CODE2 = A.GYE_CODE;
                    self.PL_CHANGE_CODE2 = A.CHANGE_CODE;
                    self.PL_GYE_DES2 = A.GYE_DES;
                    break;
                default:
                    break;
            }
        });
    },

    initProperties: function () {

        this.userPermit = this.viewBag.Permission.Permit.Value;
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        var option = [];
        option.push({ id: "DefaultSettings", label: ecount.resource.BTN00141 });
        header.setTitle(resource.LBL08060);
        header.notUsedBookmark();
        header.add("option", option, false);

    },

    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {
        var g = widget.generator;
            ctrl = g.control(),         //widget Control
            toolbar = g.toolbar(),       //widget Toolbar
            form = g.form(),             //widget Form
            res = ecount.resource;


        form.add(ctrl.define('widget.code.account', 'PL_GYE_CODE1', 'PL_GYE_CODE1', String.format(res.LBL08065, this.PL_GYE_CODE1), null)
            .addCode({ label: this.PL_GYE_DES1, value: this.PL_CHANGE_CODE1 }).end())
                .add(ctrl.define('widget.code.account', 'PL_GYE_CODE2', 'PL_GYE_CODE2', res.LBL08066, null)
            .addCode({ label: this.PL_GYE_DES2, value: this.PL_CHANGE_CODE2 }).end())
                .add(ctrl.define('widget.code.account', 'CA_GYE_CODE', 'CA_GYE_CODE', String.format(res.LBL08067,this.CA_GYE_CODE), null)
            .addCode({ label: this.CA_GYE_DES, value: this.CA_CHANGE_CODE }).end())
                .add(ctrl.define('widget.code.account', 'CB_GYE_CODE', 'CB_GYE_CODE', String.format(res.LBL08068, this.CB_GYE_CODE), null)
            .addCode({ label: this.CB_GYE_DES, value: this.CB_CHANGE_CODE }).end())
                .add(ctrl.define('widget.code.account', 'CC_GYE_CODE', 'CC_GYE_CODE', String.format(res.LBL08069, this.CC_GYE_CODE), null)
            .addCode({ label: this.CC_GYE_DES, value: this.CC_CHANGE_CODE }).end())

        contents.add(form);

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/

    //로드시 (On Load Complete)
    onLoadComplete: function () {

    },

    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        switch (control.id) {
            case "PL_GYE_CODE1":
            case "PL_GYE_CODE2":
            case "CA_GYE_CODE":
            case "CB_GYE_CODE":
            case "CC_GYE_CODE":
                params.CALL_TYPE = "16";
                params.isTreeEventDisable = true;
                break;
        }
        handler(params);
    },

    //저장 버튼 (save button click event)
    onFooterSave: function (e) {
        var btnSave = this.footer.get(0).getControl("save");
        if (['R', 'X'].contains(this.userPermit) || (this.userPermit == "U" && this.editFlag == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var code1 = this.contents.getControl("PL_GYE_CODE1").getValue();		//손익 대체계정
        var code2 = this.contents.getControl("PL_GYE_CODE2").getValue();		//전년순이익 대체계정
        var code3 = this.contents.getControl("CA_GYE_CODE").getValue();	        //원가1 대체계정
        var code4 = this.contents.getControl("CB_GYE_CODE").getValue();	        //원가2 대체계정
        var code5 = this.contents.getControl("CC_GYE_CODE").getValue();	        //원가3 대체계정
        
        if (code1 != "" && (code1 == code2 || code1 == code3 || code1 == code4 || code1 == code5))
        {
            alert(ecount.resource.MSG03318);
            this.contents.getControl("PL_GYE_CODE1").setFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        if (code2 != "" && (code2 == code3 || code2 == code4 || code2 == code5))
        {
            alert(ecount.resource.MSG03318);
            this.contents.getControl("PL_GYE_CODE2").setFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        if (code3 != "" && (code3 == code4 || code3 == code5))
        {
            alert(ecount.resource.MSG03318);
            this.contents.getControl("CA_GYE_CODE").setFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        if (code4 != "" && code4 == code5)
        {
            alert(ecount.resource.MSG03318);
            this.contents.getControl("CB_GYE_CODE").setFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        ecount.common.api({
            url: '/Account/Basic/UpdateAcc002ChangeCode',
            data: Object.toJSON({
                PL_GYE_CODE1:code1, 	//손익 대체계정
                PL_GYE_CODE2:code2, 	//전년순이익 대체계정
                CA_GYE_CODE: code3, 	//원가1 대체계정
                CB_GYE_CODE: code4, 	//원가2 대체계정
                CC_GYE_CODE: code5      //원가3 대체계정
            }),
            error: function (e) {
                ecount.alert('자동대체설정 저장 처리 시 Error', function () {
                    this.hideProgressbar();
                }.bind(this));
            }.bind(this),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                } else {
                    this.close();
                    return false;
                }
            }.bind(this)
        });
       
    },


    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //엔터   (enter key press event)
    ON_KEY_ENTER: function (e, target) {
    },

    //마지막 포커스 (content field last focus)
    onFocusOutHandler: function (event) {
        var hasNext = this._super.onFocusOutHandler.apply(this, arguments);

        if (!hasNext)
            this.footer.getControl("save").setFocus(0);
    },

    
    //기본값복원
    onDropdownDefaultSettings: function (e) {
        debugger
        var self = this;

        ecount.confirm(ecount.resource.MSG02479, function (status) {
            if (status) {
                ecount.common.api({
                    url: '/Account/Basic/GetAcc002ChangeCode',
                    data: Object.toJSON({
                        CODE_GUBUN: this.viewBag.InitDatas.IniComCode
                    }),
                    error: function (e) {
                        ecount.alert('자동대체설정 기본값복원 처리 시 Error', function () {
                            this.hideProgressbar();
                        }.bind(this));
                    }.bind(this),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert("error");
                        } else {
                            self.contents.getControl("PL_GYE_CODE1").removeAll();
                            self.contents.getControl("PL_GYE_CODE2").removeAll();
                            self.contents.getControl("CA_GYE_CODE").removeAll();
                            self.contents.getControl("CB_GYE_CODE").removeAll();
                            self.contents.getControl("CC_GYE_CODE").removeAll();
                            result.Data.forEach(function (A) {
                                switch (A.INPUT_GUBUN) {
                                    case "P":
                                        self.PL_GYE_CODE1 = A.GYE_CODE;
                                        self.PL_CHANGE_CODE1 = A.CHANGE_CODE;
                                        self.PL_GYE_DES1 = A.GYE_DES;
                                        break;
                                    case "A":
                                        self.CA_GYE_CODE = A.GYE_CODE;
                                        self.CA_CHANGE_CODE = A.CHANGE_CODE;
                                        self.CA_GYE_DES = A.GYE_DES;
                                        break;
                                    case "B":
                                        self.CB_GYE_CODE = A.GYE_CODE;
                                        self.CB_CHANGE_CODE = A.CHANGE_CODE;
                                        self.CB_GYE_DES = A.GYE_DES;
                                        break;
                                    case "C":
                                        self.CC_GYE_CODE = A.GYE_CODE;
                                        self.CC_CHANGE_CODE = A.CHANGE_CODE;
                                        self.CC_GYE_DES = A.GYE_DES;
                                        break;
                                    case "Z":
                                        self.PL_GYE_CODE2 = A.GYE_CODE;
                                        self.PL_CHANGE_CODE2 = A.CHANGE_CODE;
                                        self.PL_GYE_DES2 = A.GYE_DES;
                                        break;
                                    default:
                                        break;
                                }
                            });
                            self.contents.getControl("PL_GYE_CODE1").addCode({ label: this.PL_GYE_DES1, value: this.PL_CHANGE_CODE1 });
                            self.contents.getControl("PL_GYE_CODE2").addCode({ label: this.PL_GYE_DES2, value: this.PL_CHANGE_CODE2 });
                            self.contents.getControl("CA_GYE_CODE").addCode({ label: this.CA_GYE_DES, value: this.CA_CHANGE_CODE });
                            self.contents.getControl("CB_GYE_CODE").addCode({ label: this.CB_GYE_DES, value: this.CB_CHANGE_CODE });
                            self.contents.getControl("CC_GYE_CODE").addCode({ label: this.CC_GYE_DES, value: this.CC_CHANGE_CODE });
                        }
                    }.bind(this)
                });
            }
        }.bind(this));
},
    /**********************************************************************
   *  기능 처리
   **********************************************************************/
});
