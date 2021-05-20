window.__define_resource && __define_resource("LBL10766","LBL10765","LBL03070","LBL00703","LBL03810","MSG04817","LBL05141","LBL05436","MSG04624","BTN00380","BTN00008","BTN00017","MSG08212","MSG04189","LBL05624","MSG00500","LBL03821","MSG00847");
/****************************************************************************************************
1. Create Date : 2016.05.26
2. Creator     : 노지혜
3. Description : 공유양식 등록/수정 (save Sample Forms  )
4. Precaution  : 
5. History     : 
6. MenuPath    :  양식 > 샘플보기,양시공유 > 등록/수정 (Template > Templates ,  Share Template )
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_33", {

  
    //FormTableCode: null,
    formPreview: null, //form html 



    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.acctPermit = this.viewBag.Permission.Account.Value;  //Account Permit(회계권한)
        this.invenPermit = this.viewBag.Permission.Inven.Value;  //Inven Permit(재고권한)
        this.gwPermit = this.viewBag.Permission.Gw.Value;  //Gw Permit(그룹웨어권한)
        this.sampleData = {
            FORM_TYPE: '',  //this.formtype,
            FORM_SEQ: '',   //this.formSeq,
            OLD_FORM_TYPE: '', //this.formtype,
            LAN_TYPE: '',
            TITLE_NM: '',
            SAMPLE: '',
        };
        this.initProperties();
        this.registerDependencies("ecount-textEditor", "pluploader");
    },

    initProperties: function () {       
    },

    render: function () {        
            this._super.render.apply(this, arguments);
        
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {        
        header.notUsedBookmark();
        header.setTitle(this.editFlag == "M" ? ecount.resource.LBL10766 : ecount.resource.LBL10765);      
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            form1 = g.form(),
            ctrl = g.control(),
            subTitle = g.subTitle(),
            panel = g.panel();           
       
        var opts = [];
        var lst = this.viewBag.InitDatas.LanguageType;

        lst.forEach(function (o) {
            if (o.Key.CLASS_SEQ > 0) { 
                opts.push([o.ITEM1, o.ITEM2]);
            }
        });

        form1.useInputForm();

        if (this.listFlag != "S") {
            form1.add(ctrl.define("widget.code.cofmFormTxt", "formTxt", "formTxt", ecount.resource.LBL03070) //양식
                .codeType(7).end())
        }
        form1.add(ctrl.define("widget.code.cofmFormCmcd", "formCmcd", "formCmcd", ecount.resource.LBL00703) //구분
                    .codeType(7)
                    .hasFn([{ id: "codeTable", label: ecount.resource.LBL03810 }])
                    .dataRules(["required"], ecount.resource.MSG04817)
                    .end())
             .add(ctrl.define("widget.select", "lanType", "lanType", ecount.resource.LBL05141) //언어
                 .option(opts)                
                 .end())
             .add(ctrl.define("widget.input", "title", "title", ecount.resource.LBL05436)
                .dataRules(["required"], ecount.resource.MSG04624)
                .end()) //제목

        var uploaderConfig = {
            url: String.format("//{0}/SaveTempResizeImage/{1}/{2}", ecmodule.common.fileStorage.getFileStorageHost(0), ecenum.tempfileLifetime.oneHour, encodeURIComponent([ecmodule.common.fileStorage.tempComCode, ecount.company.COM_CODE].join(ecount.delimiter))),
            dragdrop: true,
            prevent_duplicates: true,
            multi_selection: false,
            autostart: true,
            max_file_count: 1000,
            menu_code: ecenum.filemenuCode.gwmy,
            resize_format_string: this.thumbnailSize || String.format("150*120{0}375*300{0}50*40", ecount.delimiter),
            extensions: 'png,gif,jpg,jpeg,jpe,jfif,bmp'
        };
        var newFileStorageConfig = {
            storage_host_number: 1,
            comcode: this.viewBag.ComCode,
            collection: "ImageStorage",
            temp_file_lifetime: ecenum.tempfileLifetime.oneHour,
            upload_path: "/SAVETEMPFILE/",
            isOwnerKeyNew: true
        };

        var editor = ctrl.define("widget.textEditor", "editor", "editor", "editor")
                   .setEditorMode(1)
                   .useHtmlFormat()
                   .setUploaderConfig("file", uploaderConfig)
                   .setNewFileStorageConfig("file", newFileStorageConfig)
                   .value();
        // 이미지 첨부 권한 확인
        if (this.ImagePermission.Value == "X") {
            editor.isNotEditorImage();          
        }
        
        panel.css("")
           .add(editor);

        contents.add(form1)
                .add(panel)

    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
                
        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00380)); 
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        
        if (this.isViewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "view").label(ecount.resource.BTN00017));

        footer.add(toolbar);
    },

    //팝업띄울경우
    onPopupHandler: function (control, param, handler) {
        if (control.id == "formCmcd") {       // 
            param.isApplyDisplayFlag = false;       // apply 
            param.isCheckBoxDisplayFlag = false;    // checkbox   
            param.classCd = 'LU04';
        }   

        handler(param);
    },
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        if (control.id == "formCmcd") {
            parameter.CLASS_CD = "LU04";
        }

        handler(parameter);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        var self = this;        
        self.formPreview = self.viewBag.InitDatas.FormPreview;

        if (self.editFlag == 'M' && self.formPreview != undefined) {
            self.formPreview = self.formPreview[0];           
            self.contents.getControl("formCmcd").addCode({ label: self.formPreview.FORM_NM, value: self.formPreview.FORM_TYPE });
            self.contents.getControl("lanType").setValue(self.formPreview.LAN_TYPE);
            self.contents.getControl("title").setValue(self.formPreview.TITLE_NM);
            self.contents.getControl("editor").setValue(self.formPreview.SAMPLE);           
        }

        if (this.listFlag != "S")
            self.contents.getControl('formTxt').setFocus(0);
        else
            self.contents.getControl('formCmcd').setFocus(0);

    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //저장버튼
    onFooterSave: function () {
        var self = this;

        if (!self.setPermit(self.cateGory)) {           
            self.footer.getControl("save").setAllowClick();
            return false;
        }

        var htmlsrc = self.contents.getControl("editor").getValue();
        ecount.common.checkLimitContent(htmlsrc, 5, "", this.checkLimitContentCallback.bind(this));
    },

    checkLimitContentCallback: function (state, textEditorId) {
        var _self = this;
        if (state) {
            _self.setSaveApi('save');
        }
        else {
            _self.footer.getControl("save").setAllowClick();
            ecount.alert(ecount.resource.MSG08212);
        }
    },

    checkLimitContentCallbackView: function (state, textEditorId) {
        var _self = this;
        if (state) {
            _self.setSaveApi('view');
        }
        else {
            _self.footer.getControl("view").setAllowClick();
            ecount.alert(ecount.resource.MSG08212);
        }
    },

    //미리보기버튼
    onFooterView: function () {
        var self = this;

        if (!self.setPermit(self.cateGory)) {
            self.footer.getControl("view").setAllowClick();
            return false;
        }

        ecount.confirm(ecount.resource.MSG04189, function (status) {
            if (!status) {
                self.footer.getControl("view").setAllowClick();
                return false;
            }
            else {
                var htmlsrc = self.contents.getControl("editor").getValue();
                ecount.common.checkLimitContent(htmlsrc, 5, "", self.checkLimitContentCallbackView.bind(self));
            }
        });
    },

    //저장시체크
    checkControlValidation: function(){
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {           
            invalid.result[0][0].control.setFocus(0);
            return false;
        }
        return true;
    },

    //저장api
    setSaveApi: function (flag) {
        var self = this;
        if (!self.checkControlValidation()) {
            self.footer.getControl(flag).setAllowClick();
            return false;
        }

        //도장치환
        var editorTxt = self.contents.getControl("editor").getValue();
        var signUrl = self.viewBag.InitDatas.SignPath;

        if (editorTxt.indexOf(signUrl) > -1) {
            editorTxt = editorTxt.replace(signUrl, "00000_sign.gif");          
        }

        if (editorTxt.indexOf(self.viewBag.ComCode + "_sign.gif") > -1) {
            editorTxt = editorTxt.replace(self.viewBag.ComCode + "_sign.gif", "00000_sign.gif");           
        }

        self.sampleData = JSON.stringify({
            FORM_TYPE: self.contents.getControl("formCmcd").serialize()[0].value,
            FORM_SEQ: self.formSeq,
            OLD_FORM_TYPE: self.formType,
            LAN_TYPE: self.contents.getControl("lanType").getValue(),
            TITLE_NM: self.contents.getControl("title").getValue(),
            SAMPLE: editorTxt,
        });

        ecount.common.api({
            url: self.editFlag == "M" ? "/Common/Form/UpdateSampleForm" : "/Common/Form/InsertSampleForm",
            data: self.sampleData,
            success: function (result) {
                if (result.Status == "200") {
                    self.contents.getControl("editor").setValue(editorTxt);
                    self.formSeq = result.Data.FORM_SEQ;
                    self.formType = result.Data.FORM_TYPE;
                    self.editFlag = "M";

                    if (flag == 'view') { //미리보기                      
                        var param = {
                            width: 850,
                            height: 900,
                            formType: self.formType,
                            formSeq: result.Data.FORM_SEQ,
                            isShareView: self.isShareView
                        }

                        self.openWindow({
                            url: '/ECERP/POPUP.FORM/CM100P_34',
                            name: ecount.resource.LBL05624,
                            param: param,
                            additional: true
                        });
                        
                    }
                    else {                       
                        var message = {
                            name: "",
                            code: "",
                            data: {},
                            addPosition: "current",
                            callback: this.close.bind(this)
                        };

                        //ecount.alert(ecount.resource.MSG00500);
                        self.sendMessage(self, message);
                        self.setTimeout(function () {
                            self.close();
                        }, 0);
                    }
                }
            },
            complete: function () {
            }
        });
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },
 
    setPermit: function(value){
        var userPermit = true;
        var self = this,
        msgdto = null;
        switch (value) {
            case "INVEN":
                if (self.invenPermit!= "W" )
                {
                    msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03821, PermissionMode: "W" }]);
                    ecount.alert(msgdto.fullErrorMsg);
                    userPermit = false;
                }
                break;
            case "ACCT":
                if (self.acctPermit != "W") {
                    msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03821, PermissionMode: "W" }]);
                    ecount.alert(msgdto.fullErrorMsg);
                    userPermit = false;
                }
                break;
            case "GW":
                if (self.gwPermit != "W") {
                    msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03821, PermissionMode: "W" }]);
                    ecount.alert(msgdto.fullErrorMsg);
                    userPermit = false;
                }
                break;
        }
        return userPermit;
    },

    onMessageHandler: function (event, data) {
        var firstData = data.data || data,
            self = this;

        if (event.pageID == "ES024P") //구분
        {            
            self.contents.getControl("formCmcd").addCode({ label: firstData.FORM_NM, value: firstData.FORM_TYPE });
            self.cateGory = firstData.CATEGORY;
        }
        else if (event.pageID == "ES033P") { //양식
            self.contents.getControl("editor").setValue(firstData.FORMHTML);            
        }       
    },

    //입력코드표
    onFunctionCodeTable: function () {
        var formCmcd = this.contents.getControl("formCmcd");

        if ($.isEmpty(formCmcd.serialize()[0].value)) {
            ecount.alert(ecount.resource.MSG00847);
            formCmcd.setFocus(0);
        }
        else {
            var param = {
                width: 800,
                height: 900,
                formType: formCmcd.serialize()[0].value
            }

            this.openWindow({
                url: '/ECERP/POPUP.FORM/CM100P_35',
                name: ecount.resource.LBL03810,
                param: param,
                additional: true
            });
        }
    },

    // Get editor information > be called from EGG025m.aspx
    getParentInfo: function (message) {
        if (!$.isNull(message.type) && message.type == "getParentInfo") {
            var parentInfo = {
                editorMode: "Y"
            };
            message.callback && message.callback(parentInfo);
            return;
        }
    },

    // Insert images from editor > be called from EGG025m.aspx
    setParentInfo: function (message) {
        if (!$.isNull(message.type) && message.type == "setParentInfo") {
            var editor = this.contents.getControl("editor");

            editor.setValue(editor.getValue() + message.imagePath);
            message.callback && message.callback();
            return;
        }
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F8
    ON_KEY_F8: function () {        
        this.onFooterSave();
    },
});