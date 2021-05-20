window.__define_resource && __define_resource("BTN00226","LBL08017","LBL00754","BTN00065","BTN00008","LBL07531","MSG10113","MSG10114","MSG10116","MSG10104","MSG02642");
/****************************************************************************************************
1. Create Date : 2015.05.14
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department
4. Precaution  :
5. History     : 2015.10.28(ShinHeeJun) 계층그룹 공통페이지 사용할 수 있게 수정
                 2015.11.23(LeeIlYong) 품목계층그룹 사용할 수 있게 수정
                 2016.02.17(Nguyen Anh Tuong) 창고계층그룹 공통화 Location Level Group Standardization
                 2016.03.28 (seongjun-Joe) 소스리팩토링.
                 2019.05.30 (문요한) - 품목계층그룹 그룹이동 API3.0 호출
6. Old File    : ESA056P_02.aspx                    
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA056P_02", {
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
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    render: function () {
        this._super.render.apply(this);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.setTitle(ecount.resource.BTN00226).notUsedBookmark();
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            frm = g.form();

        var opts = [];
        opts.push(["ROOT", "root"]);

        var lst = this.viewBag.InitDatas.DestGroupLoad;
        if (lst != null && lst != undefined) {
            lst.forEach(function (o) {
                opts.push([o.CD_GROUP, "[" + o.CD_GROUP + "] " + o.NM_GROUP]);
            });
        }

        frm.template("register")
            .add(ctrl.define("widget.select", "PARENT", "PARENT", ecount.resource.LBL08017).option(opts).end())
            .add(ctrl.define("widget.label", "GROUP", "GROUP", ecount.resource.LBL00754).label("[" + this.PCode + "] " + this.PText).end());
        contents.add(frm);
    },

    onLoadComplete: function () {
        this.contents.getControl("PARENT").setFocus(0);
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
        if (this.viewBag.Permission.PermitTree.Value != 'W' && this.viewBag.Permission.PermitTree.UPD != true) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07531, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var thisObj = this;
        var txtParent = this.contents.getControl('PARENT');

        var data = {
            CD_GROUP: this.PCode,
            CD_PARENT: txtParent.getValue(),
        };
        
        if (this.ParentCode == data.CD_PARENT) {
            thisObj.sendMessage(thisObj, { keyword: '' });
            thisObj.setTimeout(function () {
                thisObj.close();
            }, 0);
            btnSave.setAllowClick();
            return true;
        }


        var callUrl = '';
        switch (this.LevelGroupType) {
            case 'CUST':
                callUrl = '/SVC/Account/Basic/UpdateCustLevelGroupInfo';
                data = {
                    Request: {
                        Data: data
                    },
                    CheckPermissionRequest: {
                        EditMode: ecenum.editMode.modify,
                        ProgramId: this.PROGRAM_ID
                    }
                };
                break;
            case 'PROD':
                callUrl = '/SVC/Inventory/Basic/UpdateProdLevelGroupInfo';
                data = {
                    Request: {
                        Data: data
                    },
                    CheckPermissionRequest: {
                        EditMode: ecenum.editMode.modify,
                        ProgramId: this.PROGRAM_ID
                    }
                };
                break;
            case 'WH':
                callUrl = '/SVC/Inventory/Basic/UpdateMoveLocationLevelGroup';
                data = {
                    Request: {
                        Data: data
                    }
                };
                break;
            default:
                callUrl = '/Account/Basic/UpdateSiteGroupInfo';
                data.CheckPermissionRequest = {
                    EditMode: ecenum.editMode.modify,
                    ProgramId: this.PROGRAM_ID
                };
                break;
        }
        ecount.common.api({
            //url: this.LevelGroupType == 'CUST' ? "/Common/Basic/UpdateCustLevelGroupInfo" : "/Common/Basic/UpdateSiteGroupInfo",
            url:callUrl,
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != '200')
                    ecount.alert(result.fullErrorMsg);
                else {
                    var sReturn = result.Data.toString();

                    if (['1', '2', '3', '4', '5'].contains(sReturn)) {
                        if (sReturn == '1')
                            ecount.alert(ecount.resource.MSG10113);
                        else if (sReturn == '2')
                            ecount.alert(ecount.resource.MSG10114);
                        else if (sReturn == '3')
                            ecount.alert(ecount.resource.MSG10116);
                        else if (sReturn == '4')
                            ecount.alert(ecount.resource.MSG10104);
                        else if (sReturn == '5')
                            ecount.alert(ecount.resource.MSG02642);
                        txtParent.setFocus(0);
                    }
                    else {
                       
                        thisObj.sendMessage(thisObj, { keyword: '' });
                        thisObj.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    }
                }
            },
            complete: function () {
                btnSave.setAllowClick();
            }
        });
    },

    /**********************************************************************
    * define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    /**********************************************************************
    * user defined function
    **********************************************************************/

    //Close button click event
    onFooterClose: function () {
        this.close();
    }
});