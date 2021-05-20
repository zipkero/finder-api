window.__define_resource && __define_resource("BTN00236","LBL12473","LBL00998","MSG02964","MSG07266","MSG01366","MSG02965","MSG07267","MSG01367","BTN00346","BTN00008","MSG02158","MSG04494");
/****************************************************************************************************
1. Create Date : 2016.11.11
2. Creator     : LeNguyen
3. Description : User Customization > User Setup > Register User
4. Precaution  : 
5. History     : 2019.03.08 Nguyen Thi Ngoc Han [A19_00850] : Fix button Use not Working
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMM002P_01", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {        
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
                
        this.searchFormParameter = {
            MASTERID: this.id
          
        };
    },

    render: function () {        
        this._super.render.apply(this);
    },
    
    /****************************************************************************************************
   * UI Layout setting
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
   * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
   ****************************************************************************************************/

    //헤더 옵션 설정
    onInitHeader: function (header, resource) {        
        var self = this;

        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        header.useQuickSearch().notUsedBookmark()   
                .setTitle(String.format('{0} ({1})', ecount.resource.BTN00236, this.GROUP_FLAG ? ecount.resource.LBL12473 : ecount.resource.LBL00998));
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            ctrl = g.control(),
            toolbar = g.toolbar();
       
        if (this.viewBag.InitDatas.IsDuplicates == "0") {
            if (this.MNG_FLAG == "M") {
                strMsg = ecount.resource.MSG02964; // 코드는 사용이 가능한 그룹코드 입니다.
            }
            else {
                strMsg = this.GROUP_FLAG ? ecount.resource.MSG07266 : ecount.resource.MSG01366; //코드는 사용이 가능한 ID입니다 
            }
        }
        else {
            if (this.MNG_FLAG  == "M") {
                strMsg = ecount.resource.MSG02965; // 코드는 이미 사용중인 그룹코드 입니다.
            }
            else {
                strMsg = this.GROUP_FLAG ? ecount.resource.MSG07267 : ecount.resource.MSG01367; //코드는 이미사용중인 ID입니다
            }
        }

        toolbar.addLeft(ctrl.define("widget.label", "lblid", "lblid", "").label(this.id).css("text-danger ml-30"))
            .addLeft(ctrl.define("widget.label", "lblmsg", "lblmsg", "").label(" " + strMsg).css("mr-30"));
        
        contents.add(toolbar);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {        
        
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();       
        
        toolbar.addLeft(ctrl.define("widget.button", "user").label(ecount.resource.BTN00346));
      
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
             
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function (e) {
        
        if (this.viewBag.InitDatas.IsDuplicates == "1") {
            var btnSave = this.footer.getControl("user");
            btnSave.hide()
        }

        this.header.getQuickSearchControl().setValue(this.id);
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }      
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

   
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};

        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "UNAME",
                    code: "ID",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },    

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
       
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },   

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    onFooterUser: function (event, data) {        

        var UserID = this.header.getQuickSearchControl().getValue();      

        var message = {            
            data: UserID,            
            addPosition: "current",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);

    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        
        var value = this.header.getQuickSearchControl().getValue();
        
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    // ON_KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },
    
    onHeaderQuickSearch: function (event) {      
                
        var masterId = this.header.getQuickSearchControl().getValue();

        if (masterId == "") {
            ecount.alert(ecount.resource.MSG04494);
            return;
        }

        _self = this;
        var param ={
            MASTERID: masterId
           
        }
        this.showProgressbar(true);
        // [2016.01.21] Check whether items can be saved when saving
        // [2016.01.21] 저장 가능 여부 체크 후 저장 호출 
        ecount.common.api({
            url: "/SelfCustomize/User/GetCheckByUserId",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status == "200") {
                    if (result.Data == "0") {
                        if (_self.MNG_FLAG == "M") {                           
                            _self.contents.getControl("lblid").setLabel(_self.header.getQuickSearchControl().getValue());
                            _self.contents.getControl("lblmsg").setLabel(" " + ecount.resource.MSG02964);
                        }
                        else {                             
                            _self.contents.getControl("lblid").setLabel(_self.header.getQuickSearchControl().getValue());
                            _self.contents.getControl("lblmsg").setLabel(" " + _self.GROUP_FLAG ? ecount.resource.MSG07266 : ecount.resource.MSG01366);
                        }
                        _self.footer.getControl("user").show();
                    }
                    else {
                        if (_self.MNG_FLAG == "M") {                          
                            _self.contents.getControl("lblid").setLabel(_self.header.getQuickSearchControl().getValue());
                            _self.contents.getControl("lblmsg").setLabel(" " + ecount.resource.MSG02965);
                        }
                        else {                           
                            _self.contents.getControl("lblid").setLabel(_self.header.getQuickSearchControl().getValue());
                            _self.contents.getControl("lblmsg").setLabel(" " + _self.GROUP_FLAG ? ecount.resource.MSG07267 : ecount.resource.MSG01367);
                        }
                        _self.footer.getControl("user").hide();
                    }
                }
            }
            ,
            complete: function () {
                _self.hideProgressbar(true);
            }
        });

    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
