window.__define_resource && __define_resource("LBL07255","LBL15034","LBL15035","MSG10097","BTN00065","BTN00008","LBL07244","LBL07531","LBL07243");
/****************************************************************************************************
1. Create Date : 2015.05.18
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department
                 재고1 > 기초등록 > 창고등록 > 계층그룹 > 체크 후, 이동 
4. Precaution  :
5. History     : 2016.02.17(Nguyen Anh Tuong) 창고계층그룹 공통화 Location Level Group Standardization
                 2016.03.28 (seongjun-Joe) 소스리팩토링.
                 2019.05.29 (문요한) 창고이동 API3.0 호출
                 2020.03.18 (Yongseok Kim) - A20_00773_권한세분화_선작업
6. Old File    : ESA056P_04.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA057P_01", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL07255);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            frm = g.form();

        var opts = [];
        opts.push(["", "-------------------"]);

        var lst = this.viewBag.InitDatas.DestGroupLoad;
        if (lst != null && lst != undefined) {
            lst.forEach(function (o) {
                opts.push([o.CD_GROUP, String.format("[{0}] {1}", o.CD_GROUP, o.NM_GROUP)]);
            });
        }

        frm.template("register")
            .add(ctrl.define("widget.label", "CUR_GROUP", "CUR_GROUP", ecount.resource.LBL15034).label(String.format("[{0}] {1}", this.CD_Group, this.NM_Group)).end())
            .add(ctrl.define("widget.select", "NEW_GROUP", "NEW_GROUP", ecount.resource.LBL15035)
                    .option(opts)
                    .dataRules(["required"], ecount.resource.MSG10097)
                    .end()
                );

        contents.add(frm);
    },

    onLoadComplete: function () {
        this.contents.getControl("NEW_GROUP").setFocus(0);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).clickOnce());
        footer.add(toolbar);
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //Save button click event
    onFooterSave: function (e) {
        var btnSave = this.footer.get(0).getControl("Save");
        var thisObj = this;
        
        //this.LevelGroupType == 'CUST' ? ecount.resource.LBL07244 : ecount.resource.LBL07531
        var sCD_To = this.contents.getControl('NEW_GROUP').getValue().trim();
        var data = {
            CD_FROM: this.CD_Group,
            CD_TO: sCD_To,
            CD_LIST: this.PCodes
        };
        var url = '', msg = '';
        if (this.LevelGroupType == 'CUST') {
            url = "/SVC/Account/Basic/MoveParentCustItem";
            msg = ecount.resource.LBL07244;
            data = {
                Request: {
                    Data: data
                }
            };
        }
        else if (this.LevelGroupType == 'PROD') { 
            url = "/SVC/Inventory/Basic/UpdateMoveParentProd";
            msg = ecount.resource.LBL07243;
            data = {
                Request: {
                    data,
                    CheckPermissionRequest: {
                        EditMode: ecenum.editMode.modify,
                        ProgramId: "E040121"
                    }
                }
            }
        }
        else if (this.LevelGroupType == 'WH') {
            url = "/SVC/Inventory/Basic/UpdateMoveItemsLocationLevelGroup";
            data.CheckPermissionRequest = {
                EditMode: ecenum.editMode.modify,
                ProgramId: "E040123"
            };
            msg = ecount.resource.LBL07243;
        }
        else {
            url = "/Account/Basic/MoveParentSiteItem";
            msg = ecount.resource.LBL07531;
            data.CheckPermissionRequest = {
                EditMode: ecenum.editMode.modify,
                ProgramId: "E010120"
            };
        }

        if (this.viewBag.Permission.PermitTree.Value != "W" && this.LevelGroupType != 'PROD' && this.LevelGroupType != 'WH' && this.LevelGroupType != 'CUST' && this.LevelGroupType != null) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: msg, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        if (this.CD_Group == sCD_To) {
            thisObj.sendMessage(thisObj, {});
            thisObj.setTimeout(function () {
                thisObj.close();
            }, 0);
        } else {
            ecount.common.api({
                url: url,
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
                    btnSave.setAllowClick();
                }
            });
        }
    },

    //Close button click event
    onFooterClose: function () {
        this.close();
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    }

    /**********************************************************************
    * define user function
    **********************************************************************/
});