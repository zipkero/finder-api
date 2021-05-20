window.__define_resource && __define_resource("LBL06542","LBL00977","LBL00979","LBL00988","LBL00992","BTN00141","BTN00065","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.11.22
2. Creator     : 이정록
3. Description : 거래처/품목/계정 검색조건 팝업
4. Precaution  :
5. History     : 
        2016.11.22 (이정록) 신규개발

****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_01", {
    SearchTypeItem: [],     //selectBox Item
    ComboSelectValue1: "",  //selectBox defalut value1
    ComboSelectValue2: "",  //selectBox defalut value2
    ComboSelectValue3: "",  //selectBox defalut value3
    ComboSelectValue4: "",  //selectBox defalut value4
    FormTypeSeqKey: {},  //폼키 Save value
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    initProperties: function () {

        var infoData = this.viewBag.InitDatas;

        this.SearchTypeItem = [];

        for (var key in infoData.ComboboxSetData) {
            this.SearchTypeItem.push([key, infoData.ComboboxSetData[key]]);
        }

        this.ComboSelectValue1 = infoData.ComboSelectValue[0];
        this.ComboSelectValue2 = infoData.ComboSelectValue[1];
        this.ComboSelectValue3 = infoData.ComboSelectValue[2];
        this.ComboSelectValue4 = infoData.ComboSelectValue[3];

        this.FormTypeSeqKey = {
            COM_CODE: ecount.company.COM_CODE,
            FORM_TYPE: this.FORM_TYPE,
            FORM_SEQ: 0,
        };
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
        header.setTitle(ecount.resource.LBL06542);
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var self = this;
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            form = g.form();

        //폼
        form
            //.template("register")
            .add(ctrl.define("widget.select", "SearchTypeItem1", "SearchTypeItem1", ecount.resource.LBL00977).option(self.SearchTypeItem).select(self.ComboSelectValue1).end())
            .add(ctrl.define("widget.select", "SearchTypeItem2", "SearchTypeItem2", ecount.resource.LBL00979).option(self.SearchTypeItem).select(self.ComboSelectValue2).end())
            .add(ctrl.define("widget.select", "SearchTypeItem3", "SearchTypeItem3", ecount.resource.LBL00988).option(self.SearchTypeItem).select(self.ComboSelectValue3).end())
            .add(ctrl.define("widget.select", "SearchTypeItem4", "SearchTypeItem4", ecount.resource.LBL00992).option(self.SearchTypeItem).select(self.ComboSelectValue4).end());
                
        //툴바
        toolbar
            .addLeft(ctrl.define("widget.button", "Restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce());

        contents
            .add(toolbar)
            .add(form);

    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();
        
        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                //.addRight(ctrl.define("widget.keyHelper", "keyHelper"));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function (e) {

    },

    onHeaderSearch: function (event) {

    },

    onHeaderUsegubun: function (event) {

    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        
    },


    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {

    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        //this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        //return true;
    },

    //저장
    onFooterSave: function () {
        var self = this,
            btnSave = self.footer.getControl("Save");
        var PARAM = [];

        PARAM.push({COL_CD: self.contents.getControl("SearchTypeItem1").getValue()});
        PARAM.push({COL_CD: self.contents.getControl("SearchTypeItem2").getValue()});
        PARAM.push({COL_CD: self.contents.getControl("SearchTypeItem3").getValue()});
        PARAM.push({COL_CD: self.contents.getControl("SearchTypeItem4").getValue()});

        self.callSaveDataApi(PARAM, self.FormTypeSeqKey);
    },


    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //검색  
    onContentsSearch: function (event) {

    },

    //기본값 설정
    onContentsRestore: function () {
        var self = this,
            btnRestore = self.contents.getControl("Restore");

        self.contents.getControl("SearchTypeItem1").setValue(self.ComboSelectValue1);
        self.contents.getControl("SearchTypeItem2").setValue(self.ComboSelectValue2)
        self.contents.getControl("SearchTypeItem3").setValue(self.ComboSelectValue3);
        self.contents.getControl("SearchTypeItem4").setValue(self.ComboSelectValue4);
        self.contents.getControl("SearchTypeItem1").setFocus(0);
        btnRestore.setAllowClick();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F2 신규
    ON_KEY_F2: function () {

    },

    //F8 적용
    ON_KEY_F8: function () {
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {

    },

    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) {

    },

    onMouseupHandler: function () {

    },

    ON_KEY_TAB: function () {

    },
    /********************************************************************** 
    *  User function
    **********************************************************************/
    //저장 API
    callSaveDataApi: function (Data, FormTypeSeqKey) {
        var self = this,
            btnSave = self.footer.getControl("Save");
        ecount.common.api({
            url: "/Common/Form/SaveCofmOutSetDetailMust",
            data: Object.toJSON({
                CofmFormoutsetDetailMusts: Data,
                FormTypeSeqKey: FormTypeSeqKey
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else if (result != null) {
                    self.callUpdateCustomerSearchTypeIdxApi(self.SEARCH_TYPE);
                }
            },
            complete: function () {
                btnSave.setAllowClick();

                if (self.isOpenPopup) {
                    var message = {
                        callback: self.close.bind(self)
                    };
                    self.sendMessage(self, message);
                }
            }
        });
    },

    /// 거래처/품목 (검색테이블 동기화) API
    callUpdateCustomerSearchTypeIdxApi: function (SearchType) {
        var self = this;
        ecount.common.api({
            url: "/Common/Infra/UpdateCustomerSearchTypeIdx",
            data:Object.toJSON({
                SEARCH_TYPE: SearchType
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
            },
            complete: function () {

            }
        });

    },
});
