window.__define_resource && __define_resource("LBL11878","LBL11877","LBL11880","MSG01136","MSG01356","MSG05725","LBL11881","MSG05726","MSG05727","BTN00765","BTN00067","BTN00065","BTN00007","BTN00008","BTN00959","BTN00204","BTN00203","BTN00033","MSG00299","LBL07157","MSG00676");
/****************************************************************************************************
1. Create Date : 2016.11.23
2. Creator     : 임명식
3. Description : 재고>기초등록>품목등록 > 규격계산그룹 등록 
4. Precaution  :규격계산그룹검색
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES050P_01", {
                                                
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/
    
    bindData: {},

    title: null,

    init: function (options) {
        this._super.init.apply(this, arguments);

        var data = this.viewBag.InitDatas.ListLoad.length !=0 ?this.viewBag.InitDatas.ListLoad : null

        if (this.EDIT_FLAG) {
            this.title = ecount.resource.LBL11878; //"규격계산그룹수정";
            this.bindData.CODE_CLASS = data[0].CODE_CLASS;
            this.bindData.CLASS_DES = data[0].CLASS_DES;
            this.bindData.ENABLED = data[0].ENABLED == 1 ? true : false;
        } else {
            this.title = ecount.resource.LBL11877; //"규격계산그룹등록";
            this.bindData.CODE_CLASS = data[0].NEXT_CODE;
        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();        
            header.setTitle(this.title)
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        
        var form = widget.generator.form(),
            ctrl = widget.generator.control(),
            codeClassControl = null;

        if (this.EDIT_FLAG) {
            codeClassControl = ctrl.define("widget.label", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL11880)
                      .label(this.bindData.CODE_CLASS).popover(ecount.resource.LBL11880).end()
        } else {
           codeClassControl =
            ctrl.define("widget.input", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL11880).dataFilter(ecount.common.ValidCheckSpecialForCodeType)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "2", "5"), max: 5 })
                .dataRules(['required'], ecount.resource.MSG01356).popover(ecount.resource.MSG05725).value(this.bindData.CODE_CLASS).end()
        }
        form.setOptions({ css: "table-layout-auto" })
            .add(codeClassControl)
            .add(ctrl.define("widget.input", "CLASS_DES", "CLASS_DES", ecount.resource.LBL11881)
                .dataRules(["required"], ecount.resource.MSG05726)
                .filter("maxlength", { message: String.format(ecount.resource.MSG01136, "50", "50"), max: 50 })
                .popover(ecount.resource.MSG05727)
                .value(this.bindData.CLASS_DES).end())
        contents.add(form);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addgroup =[]

        //if (!this.EDIT_FLAG) {
            addgroup.push({ id: "SaveAndNew", label: ecount.resource.BTN00765 });
            addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        //}
        toolbar.addLeft(ctrl.define("widget.button.group", "save").label(resource.BTN00065).addGroup(addgroup).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Rewrite").label(ecount.resource.BTN00007)); //다시작성 
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        if (this.EDIT_FLAG) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").css("btn btn-default").label(ecount.resource.BTN00959)
                .addGroup([
                { id: 'Deactivate', label: this.bindData.ENABLED == true ? ecount.resource.BTN00204: ecount.resource.BTN00203 },
                { id: 'delete', label: ecount.resource.BTN00033 }
                ]).clickOnce());

            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
       
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    onButtonDeactivate: function (e) {
        debugger
        this.bindData.ENABLED = !this.bindData.ENABLED;
        this.fnSave(1); //저장(사용/사용안함,업데이트)
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //저장버튼
    onButtonDelete: function(){
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        
        var formData = Object.toJSON({
            CODE_CLASS_LIST: this.bindData.CODE_CLASS,
        });
        var strUrl = "/Inventory/Basic/DeleteGroupListForSale008GCalcG";
        ecount.confirm(ecount.resource.MSG00299, function (isOk) {
            if (isOk) {
                ecount.common.api({
                    url: strUrl,
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.ecount.alert(result.fullErrorMsg);
                        } else {
                            this.sendMessage(this, { callback: this.close.bind(this) });
                        }
                    }.bind(this),
                    complete: function () {
                        btnDelete.setAllowClick();
                    }
                });
            } else {
                btnDelete.setAllowClick();
            }
        }.bind(this));
    },

    //저장- Flag = 1
    onFooterSave: function (e) {
        this.fnClientValidation(this.fnSave.bind(this),1);
    },
    //저장/신규 Flag = 2
    onButtonSaveAndNew: function (e) {
        this.fnClientValidation(this.fnSave.bind(this),2);
    },
    //저장/내용유지 Flag = 3
    onButtonSaveReview: function (e) {
        this.fnClientValidation(this.fnSave.bind(this), 3);
    },
    //History button click event
    onFooterHistory: function (e) {
        var params = {
            width: 450,
            height: 150,
            lastEditTime: this.viewBag.InitDatas.ListLoad[0].EDIT_DT,
            lastEditId: this.viewBag.InitDatas.ListLoad[0].EDITOR_ID,
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
    // [Save] and [Save & New] [Save & Review],[onButtonActivate],[onButtonDeactivate] button function
    fnSave: function (isSaveNew) {
        var thisObj = this;
        var formData = Object.toJSON({
            CODE_CLASS: this.contents.getControl('CODE_CLASS').getValue(),
            CLASS_DES: this.contents.getControl('CLASS_DES').getValue(),
            ENABLED: this.EDIT_FLAG ? this.bindData.ENABLED : true
        });
        
        ecount.common.api({
            url: String.format("/Inventory/Basic/{0}", thisObj.EDIT_FLAG ? "UpdateSale008CalcGCode" : "InsertSale008CalcGCode"),
            data: formData,
            success: function (result) {
                thisObj.isUseUpdate = false;
                if (result.Status === "200" && result.Data == "1") {
                    ecount.alert(ecount.resource.MSG00676);  //"이미등록된코드 입니다."
                    thisObj.buttonRefresh();
                    return false;
                }
                thisObj.sendMessage(thisObj, "SaveSuccess");
                param = {
                    EDIT_FLAG: false,
                    CODE_CLASS: "L18"
                }
                if (isSaveNew === 1) {
                    //저장
                    this.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                } else {
                    //if (isSaveNew == 2) {
                    //    var url = "/Inventory/Basic/GetSpecGroupAutoCode"
                    //    var formData = JSON.stringify(param);
                    //    ecount.common.api({
                    //        url: url,
                    //        data: formData,
                    //        success: function (result) {
                    //            this.contents.getControl("CODE_CLASS").setValue(result.Data[0].NEXT_CODE);
                    //            this.contents.getControl("CLASS_DES").setValue("");
                    //            this.buttonRefresh();
                    //        }.bind(this)
                    //    });
                    //} else if (isSaveNew == 3) {
                        var param = {
                            width: 600,
                            height: 200,
                            isOpenPopup: true,
                            callPageName: "ES050P_01",
                            __ecPage__: "",
                            _ecParam__: "",
                            isPopFlag: "Y",
                            EDIT_FLAG: isSaveNew == 3,
                            CODE_CLASS: isSaveNew == 3 ? this.contents.getControl("CODE_CLASS").getValue() : ""
                        };
                        this.onAllSubmitSelf("/ECERP/Popup.Search/ES050P_01", param, "details");
                    //}
                }
            }.bind(this)
        });
    },

    //Handle to callback the fnSave
    fnClientValidation: function (callback, isSave) {
    
        var invalid = this.contents.validate();
        if (invalid.result.length == 0) {
            callback(isSave);
        } else {
            for (var i = 0, len = invalid.result.length; i < len; i++) {
                this.contents.getControl(invalid.result[i][0].control.id).showError(invalid.result[i][0].message);
            }
            this.footer.getControl('save').setAllowClick();
            return;
        }
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    //다시작성 버튼
    onFooterRewrite: function () {
        var param = {
            width: 600,
            height: 200,
            isOpenPopup: true,
            callPageName: "ES050P_01",
            __ecPage__: "",
            _ecParam__: "",
            isPopFlag: "Y",
            EDIT_FLAG: this.EDIT_FLAG,
            CODE_CLASS: this.contents.getControl("CODE_CLASS").getValue()
        };
        this.onAllSubmitSelf("/ECERP/Popup.Search/ES050P_01", param, "details");
    },
    /**********************************************************************
    *  페이지 기능
    **********************************************************************/

    buttonRefresh: function () {
      
        this.contents.getControl("CODE_CLASS").setFocus(0);
        this.footer.getControl('save').setAllowClick();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
       // this.onContentsSearch(target.control.getValue());
    },


});
