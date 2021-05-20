window.__define_resource && __define_resource("MSG01928");
/****************************************************************************************************
1. Create Date : 2016.05.13
2. Creator     : 이정민
3. Description : 회신메일발송여부설정
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory('ecount.page.popup.type2', 'ESD023P_01', {

    /*******************************************DEC_AMT********************************************************* 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    INNER_HTML: null,   //메일 컨텐츠 HTML
    REMARKS: null,      //메모
    FILE_NAME: null,    //첨부파일명
    
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties(); 
    },

    initProperties: function () {
        this.INNER_HTML = this.viewBag.InitDatas.mainData && this.viewBag.InitDatas.mainData.MAIL_CONTENTS;
        this.REMARKS = this.viewBag.InitDatas.mainData && this.viewBag.InitDatas.mainData.REMARKS;
        this.FILE_NAME = this.viewBag.InitDatas.mainData && this.viewBag.InitDatas.mainData.FILE_NAME;
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.disable();        
    },

    onInitContents: function (contents) {
        // 기간만료 또는 파일 삭제되었는지 체크
        if (this.viewBag.InitDatas.isShowContents == false) {
            ecount.alert(ecount.resource.MSG01928, function () {
                this.onFooterClose();
            }.bind(this));
            return;
        }
        
        var g = widget.generator,            
            div = g.div(),        
            ctrl = g.control(),
            form = g.form();        

        form.add(ctrl.define('widget.label', 'remarks', 'remarks', "메모").label(this.REMARKS).singleCell().end());
        form.add(ctrl.define('widget.label', 'filename', 'filename', "파일명").label(this.FILE_NAME).singleCell().end());
        
        var innerHtml = this.INNER_HTML.replace(/wrapper-print hide/g, "wrapper-print");
        var tempArray = ["23", "66", "92", "82", "83", "84", "85", "86", "87" ]; //DOC_GUBUN 포함여부에 따라 메모,파일명이 상단or하단에 그려짐 (23: 주문서, 66:거래명세서, 92:A/S)
        var isContain = tempArray.indexOf(this.DOC_GUBUN);

        if (isContain > 0) {
            div.html(innerHtml);
            contents.add(form);
            contents.add(div);
        } else {
            div.html(innerHtml);            
            contents.add(div);
            contents.add(form);
        }

    },

    onInitFooter: function (footer, resource) {
        
    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/       
    onLoadComplete: function (event) {
        this._super.onLoadComplete.apply(this, arguments);
    },

    onPopupHandler: function (control, param, handler) {
        handler(param);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        this._super.onAutoCompleteHandler.apply(this, arguments);
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },

    onGridAfterFormLoad: function (e, data, grid) {
        this._super.onGridAfterFormLoad.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ 'on' + target + control id ]
    ****************************************************************************************************/
    onFooterClose: function () {        
        ecount.page.popup.prototype.close.call(this);
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/


    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    

});