window.__define_resource && __define_resource("LBL11886","LBL09751","LBL07879","LBL07880","LBL35621","BTN00065","BTN00008","LBL04726","MSG05103");
/****************************************************************************************************
1. Create Date : 2015.09.24
2. Creator     : 박현민
3. Description : 즐겨찾기설정 > Mypage > 메뉴리스트
4. Precaution  :
5. History     : 2018.08.01 이현택 : 마이페이지 관련 테이블 이전으로 인한 처리
                 2020.04.27 (On Minh Thien) - A20_01541 - 유저페이에서 mypage설정 노출하지 않도록 수정
6. Old File    : 
****************************************************************************************************/
if (ecount.page.factory == undefined) {
    //alert('좌측메뉴에서 새창열기를 한 경우 즐겨찾기가 불가합니다. 본메뉴에서 사용해주시기 바랍니다.');          
    var msg = this.viewBag.DefaultOption.openErrMsg.replace(/(\\r)?\\n/gi, "\r\n");
    alert(msg);
    if (ecount.parentFrame.objDHtml != null) {
        ecount.parentFrame.objDHtml.close();
    }
    else {
        this.close();
    }
}

ecount.page.factory("ecount.page.popup.type2", "CM400P_01", {

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    _default: null,
    oldFavoriteInfo: null,
    selectedCodes: null,
    groupInfos: null,
    menuInfos: null,
    programId: null,
    programName: null,
    addedGroups: null,
    flag: null,
    isFromCS: false,
    isFromUserPay: false,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this._default = $.extend({}, this._default, this.viewBag.DefaultOption || {});
        this._default.favoritesSeq = $.isEmpty(this._default.favoritesSeq) || this._default.favoritesSeq == "undefined" ? 0 : this._default.favoritesSeq;
    },

    initProperties: function () {
        this._default = {
            myPageGroups: null,

            titleName: "",
            permissionID: "",
            programSeq: 0,
            menuSeq: 0,
            favoritesSeq: 0,
            favoritesName: ""
        };
        this.isFromCS = this.viewBag.InitDatas.isFromCS;
        this.isFromUserPay = this.viewBag.InitDatas.isFromUserPay;
        this.oldFavoriteInfo = this.viewBag.InitDatas.oldFavoriteInfo;
    },

    render: function () {
        this._super.render.apply(this);
    },


    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        header.notUsedBookmark()
            .setTitle(ecount.resource.LBL11886);
    },

    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            form1 = generator.form(),
            ctrl = generator.control(),
            control = generator.control();

        form1
            .colgroup([{ width: 120 }])
            .rowspan(2)
            .add(ctrl.define("widget.radio", "addtion", "addtion", ecount.resource.LBL09751).label([ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["1", "2"]).select("1").end())
            .add(ctrl.define("widget.input.codeName", "favoriteName", "favoriteName", "").value(this._default.titleName).end())

        if (this._default.permissionID != "E000128" && this.isFromCS !== true && this.isFromUserPay !== true)
            form1.add(ctrl.define("widget.multiCode.myPage", "myPage", "myPage", ecount.resource.LBL35621).end());
        contents.add(form1);
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "save").label(this.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
        footer.add(toolbar);
    },

    onMessageHandler: function (page, param) {        
        if (page.pageID == 'EMW002M') {
            if (['SAVE', 'SAVE2'].contains(param.Flag)) {
                if (param.AddedGroups != null && param.AddedGroups.length > 0) {
                    var checkedGroups = [];
                    for (i = 0; i < param.AddedGroups.length; i++) {
                        checkedGroups.add(param.AddedGroups[i].GROUP_SEQ);
                        this.contents.getControl("myPage").addCode({
                            value: param.AddedGroups[i].GROUP_SEQ,
                            label: param.AddedGroups[i].GROUP_NAME
                        });
                    }

                    this.selectedCodes = checkedGroups.join(ecount.delimiter);
                }
                this.groupInfos = param.GroupInfos;
                this.menuInfos = param.MenuInfos;
                this.programId = param.programId;
                this.programName = param.programName;
                this.addedGroups = param.AddedGroups;
                this.flag = param.Flag;
            }

        }
    },

    onPopupHandler: function (control, config, handler) {
        if (control.id == "myPage") {
            config.width = ecount.infra.getPageWidthFromConfig(true);
            config.programId = this._default.permissionID;
            config.programName = this.contents.getControl("favoriteName").getValue();
            config.selectedCodes = this.contents.getControl("myPage").serialize().value;
        }

        handler(config);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getControl("favoriteName").setFocus(0);
    },

    //데이터 변경시 발생(data change event)
    onChangeControl: function (control, data) {
        switch (control.cid) {
            case "addtion":
                if (control.value.equals("1")) {
                    this.contents.showRow("favoriteName");
                    $("#row-addtion").children("th").attr("rowspan", "2");
                } else {
                    this.contents.hideRow("favoriteName");
                    $("#row-addtion").children("th").attr("rowspan", "1");
                }
                break;

        }
    },

    onContentsMyPage: function (e) {
        url = '/ECERP/EMW/EMW002M';
        var param = {};

        param.TYPE = 'CREATE';
        param.TITLE = ecount.resource.LBL04726;
        param.width = ecount.infra.getPageWidthFromConfig(true);
        param.height = '500';
        popupType = false;

        this.openWindow({
            url: url,
            name: ecount.resource.LBL11886,
            param: param,
            //additional: true,
            isChangePopupType: false,
            resizable: true
        });
    },

    //적용버튼  (save button click event)
    onFooterSave: function (e) {
        var isSaveFavority = this.contents.getControl("addtion").getValue().equals("1");
        var favorityName = this.contents.getControl("favoriteName").getValue();

        if (isSaveFavority && this.contents.getControl("favoriteName").validate(["required"], this.viewBag.Resource.MSG05103).count() == 1) {
            this.footer.getControl("save").setAllowClick();
            this.contents.getControl("favoriteName").setFocus(0);
            return false;
        }

        var self = this;

        var listGroups = [];

        if (this._default.permissionID != "E000128" && this.isFromCS !== true && this.isFromUserPay !== true) {
            var listValues = this.contents.getControl("myPage").getSelectedItem();
            for (i = 0; i < listValues.length; i++) {
                listGroups.add({
                    GROUP_SEQ: listValues[i].value,
                    GROUP_NAME: listValues[i].label
                });
            }
        }

        if ((this.groupInfos != null && this.groupInfos.length > 0) ||
            (this.menuInfos != null && this.menuInfos.length > 0) ||
            (listGroups != null && listGroups.length > 0)) {
            this.flag = "SAVE"

            data = {
                GroupInfos: this.groupInfos == null ? [] : this.groupInfos,
                MenuInfos: this.menuInfos == null ? [] : this.menuInfos,
                AddedGroups: listGroups == null ? [] : listGroups,
                programId: this._default.permissionID,
                programName: this.contents.getControl("favoriteName").getValue(),
                Flag: this.flag,
                UserID: ecount.user.ID
            };

            ecount.common.api({
                url: "/SelfCustomize/User/SaveMypageDetailLevelGroupInfo",
                data: Object.toJSON(data),
                success: function (msg) {
                    if (msg.Status != "200")
                        ecount.alert(msg.fullErrorMsg + msg.Data);
                },
                complete: function () { }

            });
        }

        if (this.oldFavoriteInfo == null && isSaveFavority) {
            ecount.common.api({
                url: "/Common/Favorites/Save",
                data: Object.toJSON({
                    IsSaveFavorites: isSaveFavority,
                    Favorites: {
                        SEQ: self._default.favoritesSeq,
                        FAV_NAME: favorityName,
                        MENU_SEQ: self._default.menuSeq == 0 ? 9011 : self._default.menuSeq,
                        PROGRAM_SEQ: self._default.programSeq,
                        SCR_ID: self._default.permissionID,
                        DELETE_YN: "N"
                    }
                }),
                success: function (result) {
                    if (result.Status == 200) {
                        result.registered = true;                        
                        if (self._default.isOld == false) {
                            self.sendMessage(self, $.extend({}, result, {
                                callback: self.setCloseOrLocation.bind(self)
                            }));
                        } else {
                            // 구 프레임웍 처리 
                            self.sendOldFmwSave(result);
                        }
                    }
                }
            });
        } else if (this.oldFavoriteInfo != null && !isSaveFavority) {
            ecount.common.api({
                url: "/Common/Favorites/Delete",
                data: JSON.stringify({
                    Key: self.oldFavoriteInfo.Key
                }),
                success: function (result) {
                    if (result.Status == 200) {                        
                        result.registered = false;
                        if (self._default.isOld == false) {
                            self.sendMessage(self, $.extend({}, result, {
                                callback: self.setCloseOrLocation.bind(self)
                            }));
                        } else {
                            self.sendOldFmwDelete();
                        }
                    }
                }
            });
        } else {            
            if (self._default.isOld == false) {
                self.sendMessage(self, {
                    callback: self.setCloseOrLocation.bind(self)
                });
            } else {
                this.setCloseOrLocation();
            }
        }
    },

    // 저장시 구프레임웍 처리 
    sendOldFmwSave: function (result) {        
        var favtarget;

        if (ecount.parentFrame.opener != null && ecount.parentFrame.opener.window.name == "mainbody") //일반 팝업 (재고1>구매관리>구매입력>현금지급)
            favtarget = ecount.parentFrame.opener.ecount.parentFrame;
        else if (ecount.parentFrame.opener != null && ecount.parentFrame.opener.window.name == "memo1") { //팝업의 팝업 (쪽지>단가요청수정)
            favtarget = ecount.parentFrame.opener.opener;
        } else if (ecount.parentFrame.opener != null && ecount.parentFrame.opener.ecount.parentFrame === ecount.parentFrame) { //새창열기
            favtarget = ecount.parentFrame.opener;
            if (ecount.parentFrame.opener.mainbody != "undefined") {
                ecount.parentFrame.opener.mainbody.location.reload()
            }
        } else if (ecount.parentFrame.opener != null && ecount.parentFrame.opener.opener != null && ecount.parentFrame.opener.opener.window.name == "mainbody") {
            favtarget = ecount.parentFrame.opener.opener.ecount.parentFrame;
        } else if (ecount.parentFrame.opener != null && ecount.parentFrame.opener.window.name == "_iframe-esq501p") { // 거래처중심입력
            favtarget = ecount.parentFrame.opener.ecount.parentFrame;
        } else {
            favtarget = this.fnFavorityParentObject(ecount.parentFrame);
        }

        if (favtarget != "undefined")
            favtarget.SetFavoriteReload();

        ecount.parentFrame.$(".title-leftarea").filter(".page-bookmark").removeClass("page-bookmark").addClass("page-bookmark-added");
        ecount.parentFrame.$("#hidFavSeq").val(result.Data);
        ecount.parentFrame.$("body").focus();

        this.setCloseOrLocation();
    },

    // 삭제시 구프레임웍 처리 
    sendOldFmwDelete: function () {        
        ecount.parentFrame.$(".title-leftarea").filter(".page-bookmark-added").removeClass("page-bookmark-added").addClass("page-bookmark");
        var favtarget;
        if (opener != null && opener.window.name == "mainbody") //팝업에서 삭제시
            favtarget = opener.parent;
        else if (opener != null && opener.window.name == "memo1") { //팝업의 팝업
            favtarget = opener.opener;
        } else if (opener != null && opener.window.name == "") { //새창열기
            favtarget = opener;
            if (opener.mainbody != "undefined") {
                opener.mainbody.location.reload()
            }
        } else if (parent.opener != null && parent.opener.opener != null && parent.opener.opener.window.name == "mainbody") {
            favtarget = parent.opener.opener.parent;
        } else if (opener != null && opener.window.name == "_iframe-esq501p") { // 거래처중심입력
            favtarget = opener.parent.parent;
        } else
            favtarget = this.fnFavorityParentObject(parent);

        if (favtarget != "undefined")
            favtarget.SetFavoriteReload();

        if (favtarget.window != "undefined" && favtarget.window[favtarget.ecount.page.prefix + "ecp.ecp050fav"] != null)
            favtarget.window[favtarget.ecount.page.prefix + "ecp.ecp050fav"].setInit();

        this.setCloseOrLocation();
    }, 
    // 구 프레임웍 삭제 되면 없애기     
    // 즐겨찾기 삭제 및 추가시 해당 Parent Object 재귀적으로 찾기    
    fnFavorityParentObject: function(obj) {
        if (obj === obj.parent) {
            return obj;
        }
        return this.fnFavorityParentObject(obj.parent);
    },

    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    //닫기버튼
    onFooterClose: function () {
        if (this._default.isOld == true && parent.objDHtml != null) {
            parent.objDHtml.close();
        }
        else {
            this.close();
        }
        return false;
    },

    //엔터   (enter key press event)
    ON_KEY_ENTER: function (e, target) { 
    },

    //마지막 포커스 (content field last focus)
    onFocusOutHandler: function (event) {
        if (event && event.control && event.control.cid == "myPage")
            this.footer.getControl("save").setFocus(0);
    },
    /**********************************************************************
   *  기능 처리
   **********************************************************************/
    setCloseOrLocation: function () {        
        if (this.flag == null) {
            if (this._default.isOld == true && parent.objDHtml != null) {
                parent.objDHtml.close();
            } else {
                this.close();
            }
        }
        else {
            ecount.router.go({
                url: "/ECERP/ECP/ECP050M"
            }, "_top")
        }
    }
});
