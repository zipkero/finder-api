window.__define_resource && __define_resource("LBL05272","BTN00141","LBL12368","LBL12369","LBL93205","LBL09043","LBL09045","BTN00065","BTN00008","MSG00141","MSG04486","LBL07157");
/****************************************************************************************************
1. Create Date : 2017.03.31
2. Creator     : 김혁래
3. Description : 계정설정(account settings)
4. Precaution  : 
5. History     : 2020.10.22 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정_회계1
6. MenuPath    : EasyEntry 계정설정(account settings)
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EBD010P_10", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/

    init: function (options) {
        this.initProperties();
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
        InitDatas: null;
    },

    render: function () {
         this.InitDatas = this.viewBag.InitDatas;
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    //Header Option
    onInitHeader: function (header, resource) {
        var title = ecount.resource.LBL05272;
        header.setTitle(title)
              .notUsedBookmark();

    },

    //Content
    onInitContents: function (contents, resource) {
        debugger;
        var generator = widget.generator,
            formFirst = generator.form(),
            formSecond = generator.form(),
            toolbar = generator.toolbar(),
            ctrl = generator.control();

        toolbar.attach(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce().end());
        formFirst.template("register")
            .add(ctrl.define("widget.code.account", "DR_GYE_CODE1", "DR_GYE_CODE1", ecount.resource.LBL12368)
                     .codeType(7)
                     .end())
            .add(ctrl.define("widget.code.account", "CR_GYE_CODE1", "CR_GYE_CODE1", ecount.resource.LBL12369)
                     .dataRules(["required"])
                     .codeType(7)
                     .end())
            .add(ctrl.define("widget.code.account", "CR_GYE_CODE2", "CR_GYE_CODE2", ecount.resource.LBL12369)
                     .dataRules(["required"])
                     .codeType(7)
                     .end())
            .add(ctrl.define("widget.code.account", "DR_GYE_CODE4", "DR_GYE_CODE4", ecount.resource.LBL93205)
                     .codeType(7)
                     .end())
        formSecond.useInputForm()
            .add(ctrl.define("widget.code.account", "CR_GYE_CODE11", "CR_GYE_CODE11", ecount.resource.LBL12369)                     
                     .codeType(7)
                     .end())
            .add(ctrl.define("widget.code.account", "DR_GYE_CODE11", "DR_GYE_CODE11", ecount.resource.LBL12368)
                     .dataRules(["required"])
                     .codeType(7)
                     .end())
            .add(ctrl.define("widget.code.account", "DR_GYE_CODE22", "DR_GYE_CODE22", ecount.resource.LBL12368)
                     .dataRules(["required"])
                     .codeType(7)
                .end())
            .add(ctrl.define("widget.code.account", "CR_GYE_CODE44", "CR_GYE_CODE44", ecount.resource.LBL93205)
                .codeType(7)
                .end())
        contents.add(toolbar)
                .add(generator.subTitle().title(ecount.resource.LBL09043)).add(formFirst)
                .add(generator.subTitle().title(ecount.resource.LBL09045)).add(formSecond);
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
    // save
    onFooterSave: function () {
        var _self = this;
        if (_self.isDetailPermit == false) {
            if ((_self.viewBag.Permission.EBD010P_10_Permit.UPD == true && _self.viewBag.Permission.EBD010P_10_Permit.CU != true) || (_self.viewBag.Permission.EBD010P_10_Permit.UPD != true && _self.viewBag.Permission.EBD010P_10_Permit.Value != "W")) {
                ecount.alert(this.resource.MSG00141);
                return;
            }
        }

         var basicValidationResult = this.contents.validate(),
             btnSave = _self.footer.get(0).getControl("save")

         if (basicValidationResult.result.length > 0) {
             debugger;
             basicValidationResult.result[0][0].control.setFocus(0);
             btnSave.setAllowClick();
             return false;
         }

         var data = _self.setSaveApiJsonData();
    
         ecount.confirm(ecount.resource.MSG04486, function (isOk) {
             if (isOk) {
                 ecount.common.api({
                     url: "/Account/Common/SaveGeneralJournalEntrySetting",
                     data: Object.toJSON({
                         SaveDetailData: data
                     }),
                     success: function (result) {
                         _self.sendMessage(_self);
                         _self.close();
                     }.bind(this)
                 });
             }
         });

    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
     onLoadComplete: function () {
         this.setInitSaleInvoice();
         this.setInitPurchaseInvoice();
    },

    //컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (event, data) {
       // data.callback && data.callback();
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
        return false;
    },

    // History button clicked event
    onFooterHistory: function (e) {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.InitDatas.PageDataFirst.EDIT_DT,
            lastEditId: this.InitDatas.PageDataFirst.EDITOR_ID
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
    
    // 기본값 복원
    onContentsRestore: function () {
        console.log('onContentsRestore')
        var param1 = { SER_NO: "07" };
        var param2 = { SER_NO: "02" };
        var _self = this;

        ecount.common.api({
            url: "/Account/Common/GetAutoAccountCode",
            data: Object.toJSON(param1),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.Error);
                } else {
                    _self.InitDatas.PageDataFirst = result.Data;
                    _self.setInitSaleInvoice();                  
                }
            }
        });        
        ecount.common.api({
            url: "/Account/Common/GetAutoAccountCode",
            data: Object.toJSON(param2),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.Error);
                } else {
                    _self.InitDatas.PageDataSecond = result.Data;
                    _self.setInitPurchaseInvoice();
                }
            }
        });
    },

    /********************************************************************** 
    * user function 
    **********************************************************************/

    setInitSaleInvoice: function () {
        ///////////////
        // 매출전표II
        ///////////////
        this.contents.getControl("DR_GYE_CODE1").removeAll();;
        this.contents.getControl("CR_GYE_CODE1").removeAll();;
        this.contents.getControl("CR_GYE_CODE2").removeAll();;
        this.contents.getControl("DR_GYE_CODE4").removeAll();;
        this.contents.getControl("DR_GYE_CODE1").addCode({
            label: this.InitDatas.PageDataFirst.DR_GYE_DES1, value: this.InitDatas.PageDataFirst.DR_GYE_CODE1
        });
        this.contents.getControl("CR_GYE_CODE1").addCode({
            label: this.InitDatas.PageDataFirst.CR_GYE_DES1, value: this.InitDatas.PageDataFirst.CR_GYE_CODE1
        });
        this.contents.getControl("CR_GYE_CODE2").addCode({
            label: this.InitDatas.PageDataFirst.CR_GYE_DES2, value: this.InitDatas.PageDataFirst.CR_GYE_CODE2
        });
        this.contents.getControl("DR_GYE_CODE4").addCode({
            label: this.InitDatas.PageDataFirst.DR_GYE_DES4, value: this.InitDatas.PageDataFirst.DR_GYE_CODE4
        });


    },

    setInitPurchaseInvoice:function() {
        this.contents.getControl("CR_GYE_CODE11").removeAll();;
        this.contents.getControl("DR_GYE_CODE11").removeAll();;
        this.contents.getControl("DR_GYE_CODE22").removeAll();;
        this.contents.getControl("CR_GYE_CODE44").removeAll();;

        ///////////////
        // 매입전표II
        ///////////////
        this.contents.getControl("CR_GYE_CODE11").addCode({
            label: this.InitDatas.PageDataSecond.CR_GYE_DES1, value: this.InitDatas.PageDataSecond.CR_GYE_CODE1
        });
        this.contents.getControl("DR_GYE_CODE11").addCode({
            label: this.InitDatas.PageDataSecond.DR_GYE_DES1, value: this.InitDatas.PageDataSecond.DR_GYE_CODE1
        });
        this.contents.getControl("DR_GYE_CODE22").addCode({
            label: this.InitDatas.PageDataSecond.DR_GYE_DES2, value: this.InitDatas.PageDataSecond.DR_GYE_CODE2
        });
        this.contents.getControl("CR_GYE_CODE44").addCode({
            label: this.InitDatas.PageDataSecond.CR_GYE_DES4, value: this.InitDatas.PageDataSecond.CR_GYE_CODE4
        });
    },

    //저장데이터(Set Save Data)
    setSaveApiJsonData: function () {
        var data = [];
        data.push({
            TRX_TYPE: "98",
            SER_NO: "07",
            DR_GYE_CODE1: this.contents.getControl("DR_GYE_CODE1").getSelectedCode()[0],
            DR_GYE_CODE2: null,
            DR_GYE_CODE3: null,
            CR_GYE_CODE1: this.contents.getControl("CR_GYE_CODE1").getSelectedCode()[0],
            CR_GYE_CODE2: this.contents.getControl("CR_GYE_CODE2").getSelectedCode()[0],
            CR_GYE_CODE3: null,
            DR_GYE_CODE4: this.contents.getControl("DR_GYE_CODE4").getSelectedCode()[0],
            CASH_JRNL_TYPE: null,
            ACCOUNT_JRNL_TYPE: null,
            FEES_JRNL_TYPE: null,
            JOURNALS_ITEM: null,
            CR_GYE_CODE3_1: null
        });

        data.push({
            TRX_TYPE: "98",
            SER_NO: "02",
            DR_GYE_CODE1: this.contents.getControl("DR_GYE_CODE11").getSelectedCode()[0],
            DR_GYE_CODE2: this.contents.getControl("DR_GYE_CODE22").getSelectedCode()[0],
            DR_GYE_CODE3: null,
            CR_GYE_CODE1: this.contents.getControl("CR_GYE_CODE11").getSelectedCode()[0],
            CR_GYE_CODE4: this.contents.getControl("CR_GYE_CODE44").getSelectedCode()[0],
            CR_GYE_CODE2: null,
            CR_GYE_CODE3: null,
            CASH_JRNL_TYPE: null,
            ACCOUNT_JRNL_TYPE: null,
            FEES_JRNL_TYPE: null,
            JOURNALS_ITEM: null,
            CR_GYE_CODE3_1: null
        });
        return data;
    },
});
