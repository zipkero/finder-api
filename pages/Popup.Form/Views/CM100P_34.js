window.__define_resource && __define_resource("LBL05624","BTN00069","BTN00042","BTN00008","MSG00287");
/****************************************************************************************************
1. Create Date : 2016.05.25
2. Creator     : 노지혜
3. Description : 양식 샘플 미리보기  (view Sample Forms  )
4. Precaution  :
5. History     : 
6. MenuPath    : 양식 > 샘플보기 > 보기 (Template > Templates ,  Share Template )
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM100P_34", {
    sampleHtml: "",  //modify form html 
    formPreview: null, //form html 

/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.acctPermit = this.viewBag.Permission.Account.Value; //Account Permit(회계권한)
        this.invenPermit = this.viewBag.Permission.Inven.Value;  //Inven Permit(재고권한)
        this.gwPermit = this.viewBag.Permission.Gw.Value;  //Gw Permit(그룹웨어권한)
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            FORM_TYPE: this.formType
            ,FORM_SEQ: this.formSeq
        };
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },
    
/****************************************************************************************************
* UI Layout setting
* http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL05624);
    },

    onInitContents: function (contents, resource) {
        var thisObj = this,
            g = widget.generator,
            printContent = g.printContent();

        thisObj.formPreview = thisObj.viewBag.InitDatas.FormPreview;

        if (thisObj.formPreview != undefined) {
            thisObj.sampleHtml = thisObj.formPreview[0].SAMPLE;
        }

        printContent.add("print", thisObj.sampleHtml); 
        contents.add(printContent);
    },

    onInitControl: function (cid, control) { },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control()

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        
        if (this.isShareView)
            toolbar.addLeft(ctrl.define("widget.button", "modify").label(ecount.resource.BTN00042));
        
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },


    /**************************************************************************************************** 
   * define common event listener
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
   ****************************************************************************************************/

    onLoadComplete: function (event) {
        var thisObj = this;
        //if (thisObj.listFlag == "S")
        //    thisObj.setViewsIncreaseApi();
        
        thisObj.footer.get(0).setFocus(0);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //적용버튼
    onFooterApply: function () {
        if (this.sampleHtml.indexOf("00000_sign.gif") > -1)
            this.sampleHtml = this.sampleHtml.replace("00000_sign.gif", "transparent.gif");        
        
        var message = {
            type: "getFormViewHtml",
            sampleHtml: this.sampleHtml,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //수정버튼
    onFooterModify: function () {
        if (this.setPermit(this.cateGory) != "W") {
            ecount.alert(ecount.resource.MSG00287);
            return false;
        }

        var param = {
            width: 800,
            height: 750,
            formType: this.formType,
            formSeq: this.formSeq,
            category: this.cateGory,
            listFlag: this.listFlag,
            editFlag: 'M',
            isViewDisplayFlag: true,
            sampleHtml: this.sampleHtml,
        }       

        this.onAllSubmitSelf('/ECERP/POPUP.FORM/CM100P_33', param);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    // 조회수증가
    setViewsIncreaseApi: function () {
        var self = this;
        var data = {           
            FORM_TYPE: self.formType,
            FORM_SEQ: self.formSeq         
        }

        ecount.common.api({
            url: "/Common/Form/UpdateSampleFormReadCount",
            data: Object.toJSON(data),
            success: function (result) {
                //if (result.Status == "200") {                  
                //}
            }
        });
    },

    //권한
    setPermit: function (value) {
        var userPermit = "";
        var self = this;

        switch (value) {
            case "INVEN":
                userPermit = self.invenPermit;
                break;
            case "ACCT":
                userPermit = self.acctPermit;
                break;
            case "GW":
                userPermit = self.gwPermit;
                break;
        }
        return userPermit;
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    
    ON_KEY_F8: function () {
        this.onFooterApply();
    }
});