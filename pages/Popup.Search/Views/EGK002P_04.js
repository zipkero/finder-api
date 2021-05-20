window.__define_resource && __define_resource("LBL12749","LBL12750","LBL12745","MSG01136","MSG11916","LBL12746","MSG01140","BTN00065","BTN00067","BTN00765","BTN00007","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","MSG00676","LBL05292","LBL07157","MSG00299","LBL02490","MSG05280","LBL11858");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : self-customizing > form setting > Frequently Used Phrases
 4. Precaution  :
 5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
 6. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGK002P_04", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },

    initProperties: function () {
        this.editFlag = this.viewBag.DefaultOption.EditFlag;
    },
    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(['I'].contains(this.editFlag) ? ecount.resource.LBL12749 : ecount.resource.LBL12750);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form = generator.form();
        var carPurPoseCd = '';
        var carPurPoseDes = '';
        if (this.viewBag.InitDatas.CarPurPoseViewLoad) {
            carPurPoseCd = this.viewBag.InitDatas.CarPurPoseViewLoad.PURPOSE_CD;
            carPurPoseDes = this.viewBag.InitDatas.CarPurPoseViewLoad.PURPOSE_DES;
        }
        
        form.template("register")
          .add(
                    this.editFlag == "I" ?
                        ctrl.define("widget.input.codeType", "carPurPoseCd", "PURPOSE_CD", ecount.resource.LBL12745)
                            .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "7", "14"), max: 14 })
                            .dataRules(["required"], ecount.resource.MSG11916)
                            .value(carPurPoseCd)
                           .end()
                        :
                        ctrl.define("widget.label", "carPurPoseCd", "PURPOSE_CD", ecount.resource.LBL12745)
                            .label(carPurPoseCd).end()
                )
            .add(ctrl.define("widget.input.general", "carPurPoseDes", "PURPOSE_DES", ecount.resource.LBL12746)
                .filter("maxlength", { message: String.format(ecount.resource.MSG01140, "100"), max: 100 })
                .dataRules(['required'], '').value(carPurPoseDes).end())
        contents.add(form);
       
    },
   
    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
       ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup([{ id: "SaveReview", label: ecount.resource.BTN00067 }, { id: "SaveNew", label: ecount.resource.BTN00765 }]).clickOnce());
        // toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
        if (["M"].contains(this.editFlag)) {            
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                                                                       .css("btn btn-default")
                                                                       .addGroup(
                                                                        [
                                                                           {
                                                                               id: 'ActiveDeactive',
                                                                               label: (this.viewBag.InitDatas.CarPurPoseViewLoad.DEL_GUBUN == "Y" ? ecount.resource.BTN00203 : ecount.resource.BTN00204)                //Resource : 재사용, 사용중단
                                                                           },
                                                                           { id: 'delete', label: ecount.resource.BTN00033 }
                ]).noActionBtn().setButtonArrowDirection("up")); 
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }
        else {
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }
        
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        if (!e.unfocus) {
            this.contents.getControl("carPurPoseCd").setFocus(0);
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

   
    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    //Handle to callback the fnSave
    fnCallbackDuplicateCheck: function (callback, a) {
        
        var formData = this.contents.serialize().merge();
        if (formData.PURPOSE_CD != undefined && formData.PURPOSE_CD != null)
            formData.PURPOSE_CD = formData.PURPOSE_CD.trim();
        var cd = formData.PURPOSE_CD.trim();

        if (['I'].contains(this.editFlag)) {
            if (cd != "" && (ecount.common.ValidCheckSpecialForCodeType(cd).result)) {
                //If user entried data, call to API to check the item existed or not
                ecount.common.api({
                    url: "/Groupware/Equipment/CheckExistedCarPurPose",
                    data: Object.toJSON({
                        PURPOSE_CD: cd
                    }),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {
                            callback(result.Data, a);
                        }
                    }.bind(this),
                    complete: function () {
                    },
                });
            } else {
                callback("0", a);
            }
        }
        else
            callback("0", a);
    },

    fnSave: function (e, SaveAction) {
        var thisObj = this;
        var res = ecount.resource;
        var btn = this.footer.get(0).getControl('Save');
        var objFocusTarget = this.contents.getControl('carPurPoseCd');
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
           
            btn.setAllowClick();
            return false;
        }
       
        if (e == "1") {
          
            objFocusTarget.showError(ecount.resource.MSG00676);
            objFocusTarget.setFocus(0);
            btn.setAllowClick();
            return;
        }
      
        var formData = this.contents.serialize().merge();

        // Get input's value
        var dataObj = {
            PURPOSE_CD: formData.PURPOSE_CD, //this.code_class,
            PURPOSE_DES: formData.PURPOSE_DES,
            CheckPermissionRequest: {
                EditMode: this.editFlag == "M" ? ecenum.editMode.modify : ecenum.editMode.new,
                ProgramId: this.PROGRAM_ID
            }
        };
        // Call API
        ecount.common.api({
            url: ['I'].contains(this.editFlag) ? "/Groupware/Equipment/InsertCarPurPose" : "/Groupware/Equipment/UpdateCarPurPose",
            data: Object.toJSON(dataObj),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    thisObj.sendMessage(thisObj, "Save");
                    if (SaveAction == "Save") {
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    } else if (SaveAction == "SaveNew") {
                        thisObj.moveSaveNewOrReview(SaveAction);
                    } else if (SaveAction == "SaveReview") {
                        thisObj.moveSaveNewOrReview(SaveAction);
                    }
                }
            },
            complete: function () { btn.setAllowClick(); }
        });

    },

    moveSaveNewOrReview: function (SaveAction) {
        var formData = this.contents.serialize().merge();
        // Define data transfer object
        var param = {
            editFlag: SaveAction == 'SaveNew' ? 'I' : 'M',
            PURPOSE_CD: formData.PURPOSE_CD,
        };

        this.onAllSubmitSelf("/ECERP/Popup.Search/EGK002P_04", param, "details")
    },

    // [Save] button clicked event
    onFooterSave: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 'Save');
    },
    // [Save & New] button clicked event
    onButtonSaveNew: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 'SaveNew');
    },
    // [Save & New] button clicked event
    onButtonSaveReview: function (e) {
        this.fnCallbackDuplicateCheck(this.fnSave.bind(this), 'SaveReview');
    },

    // Active/Deactive button clicked event
    onButtonActiveDeactive: function (e) {
        var thisObj = this;
        var res = ecount.resource;
        var btn = this.footer.get(0).getControl("deleteRestore");
        var formData = this.contents.serialize().merge();
        // Check user authorization
        //if (this.userPermit != "W") {
        //    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL05292, PermissionMode: "W" }]);
        //    ecount.alert(msgdto.fullErrorMsg);
        //    btn.setAllowClick();
        //    return false;
        //}

        var data = {
            PURPOSE_CD: formData.PURPOSE_CD,
            DEL_GUBUN: this.viewBag.InitDatas.CarPurPoseViewLoad.DEL_GUBUN == 'Y' ? 'N' : 'Y',
            CheckPermissionRequest: {
                EditMode: ecenum.editMode.modify,
                ProgramId: this.PROGRAM_ID
            }
        };
        ecount.common.api({
            url: "/Groupware/Equipment/UpdateCarPurPose",
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    thisObj.sendMessage(thisObj, "ActiveDeactive");
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () { btn.setAllowClick(); }
        });
    },

    // History button click event    
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.viewBag.InitDatas.CarPurPoseViewLoad.EDIT_DT,
            lastEditId: this.viewBag.InitDatas.CarPurPoseViewLoad.EDITOR_ID
        };
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // Delete button click event
    onButtonDelete: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        thisObj = this;
        var formdata = {
            PURPOSE_CD: this.viewBag.InitDatas.CarPurPoseViewLoad.PURPOSE_CD,
        };
        var DeleteLists = new Array();
        DeleteLists.push(formdata);
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Groupware/Equipment/DeleteCarPurPose",
                    data: Object.toJSON(DeleteLists),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else if (result.Data && result.Data.length > 0) {
                            thisObj.fnErrMessage(result.Data, {
                                titleDate: ecount.resource.LBL02490,
                                msgWarning: String.format(ecount.resource.MSG05280, ecount.resource.LBL02490),
                                menuName: ecount.resource.LBL11858,
                                isHideColumnCust: true
                            });
                        }
                        else {
                            thisObj.setTimeout(function () {
                                var message = {
                                    callback: thisObj.close.bind(thisObj)
                                };
                                thisObj.sendMessage(thisObj, message);
                            }, 0);
                        }
                    },
                    complete: function () { btnDelete.setAllowClick(); }
                });
            } else {
                btnDelete.setAllowClick();
            }
            
        });
    },

    fnErrMessage: function (ErrMsg, extraParam) {

        var formErrMsg = Object.toJSON(ErrMsg);
        var param = extraParam;
        $.extend(param, {
            name: 'Delete',
            width: 600,
            height: 500,
            datas: formErrMsg,
            popupType: false,
            additional: false
        });

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeCommonDeletable",
            param: param
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F2: function () {

    },

    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterSave();
    },

    ON_KEY_TAB: function () {
    },

    ON_KEY_ENTER: function () {
    },

    onFocusOutHandler: function (event) {
        if (event.target == "contents") {
            this.footer.getControl('save').setFocus(0);
        }
    },

});
