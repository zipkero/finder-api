window.__define_resource && __define_resource("LBL09999","LBL06434","LBL03209","LBL00754","LBL03556","LBL05299","LBL35214","LBL00568","MSG01136","MSG01356","MSG02917","MSG02233","MSG10103","LBL01742","MSG04046","MSG05467","BTN00065","BTN00765","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","MSG08770","MSG09929","LBL07157","MSG00299");
/****************************************************************************************************
1. Create Date : 2015.05.12
2. Creator     : Nguyen Anh Tuong
3. Description : Popup to edit data.
4. Precaution  :
5. History     : 
                2016.03.28 (seongjun-Joe) 소스리팩토링.
                2017.06.13 (CHOI JIN YOUNG) 자동코드 발급시 전자결재 G01 예외처리 (Groupware E-Approval Exception Code (G01 => G00 For AutoCode))
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                2020.05.29 (LuongAnhDuy)  A20_02358 - 에러로그_중복키_품목그룹
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM311P_01", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    editFlag: false,
    codeClass: "",
    off_key_esc: true,
    isNeedLoadGrid: false,
    ChkFlag: "0",
    ctrlList: null,
    codeClass3: [],
    isSuccess: false,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.ctrlList = [];
        this.codeClass3 = ['L13', 'L14', 'L15'];
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(['I'].contains(this.editFlag) ? String.format(ecount.resource.LBL09999, this.titlename) : String.format(ecount.resource.LBL06434, this.titlename));
    },

    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form = generator.form();
        this.codeClass = this.custGroupCodeClass;

        var codeNoResource = ecount.resource.LBL03209;
        var codeDesResource = ecount.resource.LBL00754;

        if (this.codeClass3.contains(this.codeClass)) {
            codeNoResource = ecount.resource.LBL03556;
            codeDesResource = ecount.resource.LBL05299;
        }

        if (this.codeClass == "L03") {
            codeNoResource = ecount.resource.LBL35214;
            codeDesResource = ecount.resource.LBL00568;
        }

        form.template("register")
            .add(['I'].contains(this.editFlag) ?
                ctrl.define("widget.input.codeType", "Code", "Code", codeNoResource)
                    .dataFilter(ecount.common.ValidCheckSpecialForCodeType)
                    .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "2", "5"), max: 5 })
                    .dataRules(['required'], ecount.resource.MSG01356).popover(ecount.resource.MSG02917).value().end()
                : ctrl.define("widget.label", "Code", "Code", codeNoResource).popover(ecount.resource.MSG02917).label(this.groupCode).end())
            .add(ctrl.define("widget.input.codeName", "Name", "Name", codeDesResource)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "25", "50"), max: 50 })
                .dataRules(['required'], ecount.resource.MSG02233).popover(ecount.resource.MSG10103).value(this.groupName).end());
        if (this.hideOrderField == false) {
            form.add(ctrl.define("widget.input", "PlantSer", "PlantSer", ecount.resource.LBL01742)
                .dataRules(['required'], ecount.resource.MSG04046)
                .popover(ecount.resource.MSG05467).value(this.groupName)
                //.filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "2", "2"), max: 2 })
                .numericOnly(2, 0).value(this.plantSer).end());
        }
        contents.add(form);
    },

    onChangeControl: function (control) {


    },

    onInitFooter: function (footer) {
        var t = widget.generator.toolbar(),
            c = widget.generator.control();
        if (['I'].contains(this.editFlag)) {
            t.addLeft(c.define("widget.button.group", "Save").label(ecount.resource.BTN00065).clickOnce()
                .addGroup([{ id: "SaveAndNew", label: ecount.resource.BTN00765 }]));
        } else {
            t.addLeft(c.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        }
        if (['M'].contains(this.editFlag)) {
            t.addLeft(c.define('widget.button.group', 'deleteRestore').label(ecount.resource.BTN00959)        //Resource : 삭제
                .css("btn btn-default")
                .addGroup(
                    [
                        {
                            id: 'Deactivate',
                            label: ((this.useGubun == 'N') ? ecount.resource.BTN00203 : ecount.resource.BTN00204)                //Resource : 재사용, 사용중단 
                        },
                        { id: 'delete', label: ecount.resource.BTN00033 }
                ]).noActionBtn().setButtonArrowDirection("up")); 
            t.addLeft(c.define("widget.button", "Close").label(ecount.resource.BTN00008));
            t.addLeft(c.define("widget.button", "History").label("H"));
        }
        else {
            t.addLeft(c.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }
        footer.add(t);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
    onLoadComplete: function () {
        for (var i = 0; i < this.contents.items[0].rows.length; i++) {
            this.ctrlList.push(this.contents.items[0].rows[i].id);
        }

        if (this.editFlag == "I") {
            var nextCode = this.viewBag.InitDatas.NewGroupCode[0].NEXT_CODE;
            this.contents.getControl("Code").setValue(nextCode);
            this.contents.getControl("Name").setFocus(0);

        }
        else {
            this.contents.getControl("Name").setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    onFooterClose: function () {
        this.close();
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonDeactivate: function () {
        var thisObj = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var data = {
            USE_GUBUN: this.useGubun == 'N' ? 'Y' : 'N',
            CODE_CLASS: this.custGroupCodeClass,
            CODE_NO: this.contents.getControl('Code').getLabel(),
            Title: this.Title,
            CID: this.CID,
            CheckPermissionRequest: {
                EditMode: ecenum.editMode.modify,
                ProgramId: this.FromProgramId
            },
        }
        ecount.common.api({
            url: "/SVC/Account/Basic/UpdateStateGroupCode",
            data: Object.toJSON({
                Request: {
                    Data : data
                }
            }),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                }
                else {
                    thisObj.sendMessage(thisObj, "Reactivate");
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function (e) {
                btnDelete.setAllowClick();
            }
        });
    },
    //저장- Flag = 1
    onFooterSave: function (e) {
        if (this.isSuccess == false) {
            this.isSuccess = true;
            this.fnClientValidation(this.fnSave.bind(this), 1);
        }
    },
    //저장/신규 Flag = 2
    onButtonSaveAndNew: function (e) {
        if (this.isSuccess == false) {
            this.isSuccess = true;
            this.fnClientValidation(this.fnSave.bind(this), 2);
        }
    },
    fnClientValidation: function (callback, isSave) {

        var invalid = this.contents.validate();
        if (invalid.result.length == 0) {
            callback(isSave);
        } else {
            for (var i = 0, len = invalid.result.length; i < len; i++) {
                this.contents.getControl(invalid.result[i][0].control.id).showError(invalid.result[i][0].message);
            }
            this.contents.getControl(invalid.result[0][0].control.id).setFocus(0);
            this.footer.getControl('Save').setAllowClick();
            this.isSuccess = false;
            return;
        }
    },
    fnSave: function (_saveType) {//_saveType{ 1:Save And New }
        var thisObj = this,
            codeControl = this.contents.getControl('Code');

        var data = {
            EditFlag: this.editFlag,
            CODE_CLASS: this.custGroupCodeClass,
            CODE_NO: ['I'].contains(this.editFlag) ? codeControl.getValue() : codeControl.getLabel(),
            CODE_DES: this.contents.getControl('Name').getValue(),
            SERNO: this.hideOrderField == false ? this.contents.getControl('PlantSer').getValue() : "",
            Title: this.Title,
            CID: this.CID,
            CheckPermissionRequest: {
                EditMode: ['I'].contains(this.editFlag)  ? ecenum.editMode.new : ecenum.editMode.modify,
                ProgramId: this.FromProgramId
            },
        }

        saveData.call(this, false, '');

        function saveData(isError, errMess) {
            ecount.common.api({
                url: ['I'].contains(this.editFlag) ? "/SVC/Account/Basic/InsertGroupCode" : "/SVC/Account/Basic/UpdateGroupCode",
                data: Object.toJSON({
                    Request: {
                        Data: data
                    }
                }),
                success: function (result) {
                    
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                        this.isSuccess = false;
                    } else if (result.Data == '1') {
                        codeControl.showError(String.format(ecount.resource.MSG08770, thisObj.titlename));
                        codeControl.setFocus(0);
                        this.isSuccess = false;
                    } else if (result.Data == 'BC') {
                        codeControl.showError(ecount.resource.MSG09929);
                        codeControl.setFocus(0);
                        this.isSuccess = false;
                    } else {
                        thisObj.setTimeout(function () {
                            thisObj.footer.get(0).getControl("Save").setAllowClick();
                            thisObj.sendMessage(thisObj, "SaveSuccess");
                            var dt = { CODE_CLASS: thisObj.custGroupCodeClass };
                            if (_saveType == 2) {
                                ecount.common.api({
                                    url: "/SelfCustomize/Config/GetAutoCodeByGroupCode",
                                    data: Object.toJSON(dt),
                                    success: function (newcodeResult) {
                                        thisObj.isNeedLoadGrid = true;
                                        this.isSuccess = false;
                                        thisObj.footer.get(0).getControl("Save").setAllowClick();
                                        thisObj.contents.getControl("Code").setValue(newcodeResult.Data[0].NEXT_CODE);
                                        thisObj.contents.getControl("Name").setFocus(0);
                                        thisObj.contents.getControl("Name").setValue("");
                                    }
                                });
                            }
                            else {
                                this.isSuccess = false;
                                thisObj.close();
                            }
                        }, 0);
                    }
                },
                complete: function () {
                    thisObj.footer.get(0).getControl("Save").setAllowClick();
                    thisObj.isSuccess = false;
                }
            });
        }
    },
    onFooterHistory: function (e) {

        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.wDate,
            lastEditId: this.wID
        };
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, additional: true });
    },

    onButtonDelete: function (e) {
        var thisObj = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var formdata = {
            Code_Class: this.custGroupCodeClass,
            Code_No: this.contents.getControl('Code').getLabel(),
            Title: this.Title,
            CID: this.CID,
            CheckPermissionRequest: {
                EditMode: ecenum.editMode.delete,
                ProgramId: thisObj.FromProgramId
            },
        };
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/SVC/Account/Basic/DeleteGroupCode",
                    data: Object.toJSON({
                        Request: {
                            Data: formdata
                        }
                    }),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            thisObj.sendMessage(thisObj, "Delete");
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                    },
                    complete: function (e) {
                        btnDelete.setAllowClick();
                    }
                });
            } else {
                btnDelete.setAllowClick();
            }
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F2: function () {

    },

    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    ON_KEY_TAB: function () {
    },

    ON_KEY_ENTER: function (e, target) {
        if (target != null) {
            var control = target.control;
            var idx = control.getValue();
            if (control.id === "Name" && this.hideOrderField == true) {
                this.footer.getControl('Save').setFocus(0);
            } else if (control.id === "PlantSer" && this.hideOrderField == false) {
                this.footer.getControl('Save').setFocus(0);
            }
        }
    },
});
