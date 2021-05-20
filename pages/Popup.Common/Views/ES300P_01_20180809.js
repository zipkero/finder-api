window.__define_resource && __define_resource("LBL05842","BTN00230","BTN00436","BTN00512","LBL09727","LBL06063","LBL09719","LBL03702","LBL09721","BTN85017","LBL09913","LBL11135","LBL09723","LBL09724","LBL09725","MSG01136","LBL01443","LBL09718","LBL09918","LBL03657","LBL09520","BTN00069","BTN00008","MSG02356","MSG00757","LBL03658");
/****************************************************************************************************
1. Create Date : 2016.04.18
2. Creator     : 이정민
3. Description : 발신정보상세입력
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory('ecount.page.list', 'ES300P_01', {

    /*******************************************DEC_AMT********************************************************* 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    defaultEmailAddress: 'ecount@ecounterp.com',
    userEmailList: null,                            //발신정보 - 사용자 메일 정보            
    vatSites: null,                                 //사업장    
    allowFileExtensionList: null,                   //파일첨부 허용 된 확장자

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        debugger;
        this.initProperties();
    },

    initProperties: function () {
        this.userEmailList = this.getUserEmailList.call(this);
        if (this.VAT_SITE_VISIBLE == true && $.isEmpty(this.VAT_SITE_LIST) == false) {
            this.vatSites = this.getVatSiteList.call(this);
        }

        this.allowFileExtensionList = this.viewBag.InitDatas.allowFileExtensionList.join(",");
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        var headerOption = [];
        headerOption.push({ id: 'receiveInfo', label: ecount.resource.LBL05842 }); //회신담당자등록
        headerOption.push({ id: 'smsMessage', label: ecount.resource.BTN00230 }); //SMS발송문구등록 BTN00230
        headerOption.push({ id: 'mailTitle', label: ecount.resource.BTN00436 }); //메일제목등록 BTN00436
        headerOption.push({ id: 'mailMemo', label: ecount.resource.BTN00512 }); //메일추가내용등록 BTN00512        

        if ($.isEmpty(this.RECEIVE_FORM_LIST) == false) {
            headerOption.push({ id: 'EmailReceiveForm', label: ecount.resource.LBL09727 }); //메일수신화면양식
        }
        header.notUsedBookmark();
        header.setTitle(this.HeaderTitle).add('option', headerOption, false);
    },

    onInitContents: function (contents, resource) {
        var g = widget.generator
        ctrl = g.control(),
        infomationContentsTab = g.tabContents(),
        grid = g.grid(),
        emailInfomationForm = g.form(), //이메일정보 form
        smsInfomationForm = g.form(); //sms발신정보 form
        var emailControls = new Array();
        var smsControls = new Array();
        var receiveFormList = null; //수신화면양식
        var receiveFormSelectedItem = null; //수신화면양식 selectedItem

        emailInfomationForm.useInputForm();
        smsInfomationForm.useInputForm();

        emailInfomationForm.setColSize(2);
        smsInfomationForm.setColSize(2);

        if ($.isEmpty(this.RECEIVE_FORM_LIST) == false) {
            receiveFormList = this.getFormListData.call(this, this.RECEIVE_FORM_LIST);
            receiveFormSelectedItem = this.RECEIVE_FORM_SEQ;
        }

        //발신정보 탭
        infomationContentsTab.createActiveTab('sendInfomation', ecount.resource.LBL06063);

        //Email정보 영역
        if (this.MAIL_SEND_YN == 'Y') {
            if (this.userEmailList.length > 1) {
                emailControls.push(ctrl.define('widget.select', 'sendEmailAddress', 'sendEmailAddress', ecount.resource.LBL09719)
                                .option(this.userEmailList).select(this.SELECTED_SEND_EMAIL).multiCell(2).end()); //메일발송주소
            } else {
                emailControls.push(ctrl.define('widget.label', 'sendEmailAddress', 'sendEmailAddress', ecount.resource.LBL09719)
                            .label(this.defaultEmailAddress).value(this.defaultEmailAddress).multiCell(2).end());
            }
            emailControls.push(ctrl.define("widget.code.replier", "replyEmpName", "replyEmpName", ecount.resource.LBL03702)
                            .addCode({
                                value: this.RECEIVE_NAME, label: this.RECEIVE_NAME
                            }).codeType(7).singleCell().end()); //회신담당자
            emailControls.push(ctrl.define("widget.radio", "replyMailSendYn", "replyMailSendYn", ecount.resource.LBL09721) //회신메일발송여부
                            .label([ecount.resource.BTN85017, ecount.resource.LBL09913])
                            .setTitleLink("replyMailSendYn")
                            .value([ecenum.useYn.yes, ecenum.useYn.none])
                            .select(this.REPLY_SEND_YN).singleCell().end());
            emailControls.push(ctrl.define('widget.label', 'replyEmail', 'replyEmail', ecount.resource.LBL11135).label(this.RECEIVE_EMAIL).singleCell().end()); //회신Email
            emailControls.push(ctrl.define('widget.label', 'replyTel', 'replyTel', ecount.resource.LBL09723).label(this.RECEIVE_TEL).singleCell().end()); //회신전화번호
            emailControls.push(ctrl.define('widget.input', 'mailTitle', 'mailTitle', ecount.resource.LBL09724).value(this.SEND_SUBJECT_COMMENT).setTitleLink("mailTitle").multiCell(2).end()); //메일제목
            emailControls.push(ctrl.define('widget.textarea', 'mailMemoComment', 'mailMemoComment', ecount.resource.LBL09725).value(this.SEND_MEMO_COMMENT)
                                    .filter("maxlength", { message: String.format(ecount.resource.MSG01136, 160, 160), max: 160 })
                                    .setTitleLink("mailMemoComment")
                                    .multiCell(2).end()); //메일추가내용

            if ($.isEmpty(receiveFormList) == false) {
                emailControls.push(ctrl
                                    .define('widget.select', 'mailReceiveForm', 'mailReceiveForm', ecount.resource.LBL09727)  //메일수신화면양식 
                                    .option(receiveFormList)
                                    .select(receiveFormSelectedItem).singleCell().end());
            }

            if ($.isEmpty(this.vatSites) == false) {
                emailControls.push(ctrl.define('widget.select', 'vatSite', 'vatSite', ecount.resource.LBL01443).option(this.vatSites).multiCell().end()); //사업장         
            }

            emailInfomationForm.addControls(emailControls);
            infomationContentsTab.add(g.subTitle().title(ecount.resource.LBL09718)).add(emailInfomationForm);

        }

        //SMS 발신정보 영역
        if (this.SMS_SEND_YN == 'Y') {
            smsControls.push(ctrl.define('widget.input', 'sendSmsHp', 'sendSmsHp', ecount.resource.LBL09918).value(this.SEND_HP).multiCell(2).end());
            smsControls.push(ctrl.define('widget.input', 'sendSmsComment', 'sendSmsComment', ecount.resource.LBL03657)    //SMS발송문구 
                                .value(this.SEND_SMS_COMMENT).setTitleLink("sendSmsComment").multiCell(2).end());

            smsInfomationForm.addControls(smsControls);
            infomationContentsTab.add(g.subTitle().title(ecount.resource.LBL09520)).add(smsInfomationForm);
        }
        contents.add(infomationContentsTab);
    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        toolbar
            .addLeft(ctrl.define('widget.button', 'Send').label(ecount.resource.BTN00069))
            .addLeft(ctrl.define('widget.button', 'Close').label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
    onLoadTabPane: function (event) {
    },

    onLoadTabContents: function (event) {
        this._super.onLoadTabContents.apply(this, arguments);
    },

    onChangeHeaderTab: function (event) {
        this._super.onChangeHeaderTab.apply(this, arguments);
    },

    onChangeContentsTab: function (event) {
    },

    onLoadComplete: function (event) {
        this._super.onLoadComplete.apply(this, arguments);

        //웹메일 아이디가 있을경우 회신담당자 정보를 hide함 (defaultEmailAddress인 ecount@ecounterp.com은 항상 select 아래에 들어감)
        if (this.SELECTED_SEND_EMAIL == this.defaultEmailAddress) {
            this.receiverShowAndHide(true);
        } else { //웹메일 아이디 클릭시 회신정보관련 hide
            this.receiverShowAndHide(false);
        }

        //회신담당자 에러 보여주기 (회신Email 없을때)
        if (this.ERROR_RECEIVE_EMAIL && !$.isEmpty(this.contents.getControl('replyEmpName'))) {
            this.contents.getControl('replyEmpName').showError(ecount.resource.MSG02356);
        }

        if (this.ERROR_SEND_EMAIL && !$.isEmpty(this.contents.getControl('sendEmailAddress'))) {
            //메일발송주소 에러 보여주기 (유효하지않은 웹메일계정일때)
            this.contents.getControl('sendEmailAddress').showError(ecount.resource.MSG00757);
        }

    },

    onPopupHandler: function (control, param, handler) {
        switch (control.id) {
            case 'replyEmpName':
                param.SEND_SER = 'MA';
                param.DOC_GUBUN = this.DOC_GUBUN;
                param.isCheckBoxDisplayFlag = false;
                //param.KeyWord = this.contents.getControl('replyEmpName').getValue();
                break;
        }

        handler(param);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        this._super.onAutoCompleteHandler.apply(this, arguments);
    },

    onMessageHandler: function (message, _object) {
        switch (_object.type) {
            case 'replayMailSendType':
                this.contents.getControl('replyMailSendYn').setValue(_object.HEAD_YN);
                break;
            case 'infomation':
                if (!$.isEmpty(_object.data.SEND_NAME))
                    this.contents.getControl('replyEmpName').setValue(_object.data.SEND_NAME);
                if (!$.isEmpty(_object.data.SEND_EMAIL))
                    this.contents.getControl('replyEmail').setLabel(_object.data.SEND_EMAIL);
                if (!$.isEmpty(_object.data.SEND_TEL))
                    this.contents.getControl('replyTel').setLabel(_object.data.SEND_TEL);
                if (!$.isEmpty(_object.data.SEND_HP))
                    this.contents.getControl('sendSmsHp').setValue(_object.data.SEND_HP);
                break;
            case 'sjComment':
                this.contents.getControl('mailTitle').setValue(_object.data.SEND_COMMNET);
                break;
            case 'smComment':
                this.contents.getControl('sendSmsComment').setValue(_object.data.SEND_COMMNET);
                break;
            case 'emComment':
                this.contents.getControl('mailMemoComment').setValue(_object.data.SEND_COMMNET);
                break;
        }
    },

    onChangeControl: function (control) {
        switch (control.cid) {
            case 'sendEmailAddress':
                if (control.value != this.defaultEmailAddress) {
                    this.receiverShowAndHide(false);
                    this.contents.getControl('replyMailSendYn').setValue("N");
                }
                else {
                    this.receiverShowAndHide(true);
                    this.contents.getControl('replyMailSendYn').setValue("Y");
                }
                break;
        }

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

    //메일제목 팝업
    onContentsMailTitle: function () {
        var param = {
            width: 550,
            height: 450,

            SEND_SER: 'SJ',
            DOC_GUBUN: this.DOC_GUBUN,
            KeyWord: '',

            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: '메일제목 검색',
            param: param
        });
    },

    //메일추가내용 팝업
    onContentsmailMemoComment: function () {
        var param = {
            width: 550,
            height: 450,

            SEND_SER: 'EM',
            DOC_GUBUN: this.DOC_GUBUN,
            KeyWord: '',

            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: '메일추가내용 검색',
            param: param
        });
    },

    //SMS발송문구 팝업
    onContentssendSmsHp: function () {
        var param = {
            width: 550,
            height: 450,

            SEND_SER: 'SM',
            DOC_GUBUN: this.DOC_GUBUN,
            KeyWord: '',

            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: 'SMS 발송문구 검색',
            param: param
        });
    },

    //회신담당자등록 (option) 
    onDropdownReceiveInfo: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_06',
            name: "EGA001P_06",
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: "MA",
                DOC_GUBUN: this.DOC_GUBUN,
                Edit: true
            }
        });
    },

    //SMS발송문구등록 (option)
    onDropdownSmsMessage: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: "EGA001P_03_SM",
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: "SM",
                DOC_GUBUN: this.DOC_GUBUN,
                Edit: true
            }
        });
    },

    //메일제목등록 (option)
    onDropdownMailTitle: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: "EGA001P_03_SJ",
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: "SJ",
                DOC_GUBUN: this.DOC_GUBUN,
                Edit: true
            }
        });
    },

    //메일추가내용등록 (option)
    onDropdownMailMemo: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: "EGA001P_03_EM",
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: "EM",
                DOC_GUBUN: this.DOC_GUBUN,
                Edit: true
            }
        });
    },

    onFooterSend: function (e) {
        this.sendData();
    },

    //충전팝업
    onFunctionSmsChargingPopup: function (e) {
        //this.openWindow({
        //    url: 'http://zeus.ecounterp.com/ECMAIN/KCP/KCP001M.aspx?com_code=' + this.COM_CODE + '&db_con_flag=2&emn_flag=N&access_site=ECOUNT&CcProdDesc=' + this.COM_CODE + ' SMS',
        //    name: 'SMS충전',
        //    param: {
        //        width: 630,
        //        height: 700
        //    }
        //});

        //this.openWindow({
        //    url: "/ECERP/GeneralPage/OpenPageForGMC",
        //    name: ecount.resource.LBL03658,
        //    param: {
        //        RetUrl: "/ECERP/GMC.GCP/KCP001M",
        //        PostData: Object.toJSON({
        //            emn_flag: "N",
        //            CallComCode: this.COM_CODE,
        //            access_site: "ECOUNT",
        //            CcProdDesc: this.COM_CODE + ' SMS',
        //        }),
        //        DataType: "jsonp",
        //        width: 630,
        //        height: 700
        //    },
        //    popupType: true,
        //});

        ecount.common.openKCPType1({
            emn_flag: "N",
            callComCode: this.COM_CODE,
            access_site: "ECOUNT",
            ccProdDesc: this.COM_CODE + ' SMS',
        });
    },

    //내역팝업
    onFunctionSmsHistoryPopup: function (e) {
        this.openWindow({
            url: 'http://zeus.ecounterp.com/ECMAIN/CM3/ECC/ECC002M.aspx',
            name: 'SMS내역',
            param: {
                width: 850,
                height: 750
            }
        });
    },

    onTitleFormLinkMailTitle: function (e) {
        var param = {
            width: 550,
            height: 450,

            SEND_SER: 'SJ',
            DOC_GUBUN: this.DOC_GUBUN,
            KeyWord: '',

            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: '메일제목 검색',
            param: param
        });
    },

    onTitleFormLinkReplyMailSendYn: function (e) {
        var param = {
            width: 350,
            height: 550,
            parentPageID: this.pageID,
            responseID: this.callbackID,
            DOC_GUBUN: this.DOC_GUBUN
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Common/ES300P_02',
            name: '회신메일발송여부설정',
            param: param
        });
    },

    onTitleFormLinkMailMemoComment: function (e) {
        var param = {
            width: 550,
            height: 450,

            SEND_SER: 'EM',
            DOC_GUBUN: this.DOC_GUBUN,
            KeyWord: '',

            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: '메일추가내용 검색',
            param: param
        });
    },

    onTitleFormLinkSendSmsComment: function (e) {
        var param = {
            width: 550,
            height: 450,

            SEND_SER: 'SM',
            DOC_GUBUN: this.DOC_GUBUN,
            KeyWord: '',

            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: 'SMS 발송문구 검색',
            param: param
        });
    },

    onDropdownEmailReceiveForm: function (e) {
        var param = {
            width: 800,
            height: 700
        }
        this.openWindow({
            url: "/ECMain/CM3/CM100P_02.aspx?FORM_GUBUN=" + this.FORM_TYPE + "&__NewParents=" + this.pageID,
            name: 'CM100P_02',
            param: param,
            popupType: true
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    ON_KEY_F8: function () {
        this.onFooterSend();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    sendData: function () {
        var sendObject = {
            SEND_EMAIL: $.isEmpty(this.contents.getControl('sendEmailAddress')) ? '' : this.contents.getControl('sendEmailAddress').getValue(), //메일발송주소
            REPLY_SEND_YN: $.isEmpty(this.contents.getControl('replyMailSendYn')) ? 'N' : this.contents.getControl('replyMailSendYn').getValue(), //회신메일발송여부
            RECEIVE_EMAIL: $.isEmpty(this.contents.getControl('replyEmail')) ? '' : this.contents.getControl('replyEmail').getValue(), //회신Email
            RECEIVE_TEL: $.isEmpty(this.contents.getControl('replyTel')) ? '' : this.contents.getControl('replyTel').getValue(), //회신전화번호
            RECEIVE_NAME: $.isEmpty(this.contents.getControl('replyEmpName')) ? '' : this.contents.getControl('replyEmpName').getValue(), //회신담당자
            SEND_SUBJECT_COMMENT: $.isEmpty(this.contents.getControl('mailTitle')) ? '' : this.contents.getControl('mailTitle').getValue(), //메일제목
            SEND_MEMO_COMMENT: $.isEmpty(this.contents.getControl('mailMemoComment')) ? '' : this.contents.getControl('mailMemoComment').getValue(), //메일추가내용
            SEND_HP: $.isEmpty(this.contents.getControl('sendSmsHp')) ? '' : this.contents.getControl('sendSmsHp').getValue(), //SMS발신번호
            SEND_SMS_COMMENT: $.isEmpty(this.contents.getControl('sendSmsComment')) ? '' : this.contents.getControl('sendSmsComment').getValue(), //SMS발신문구
            SEND_BUSINESS_NO: $.isEmpty(this.contents.getControl('vatSite')) ? '' : this.contents.getControl('vatSite').getValue().split(';')[0], //사업자번호
            SEND_COM_DES: $.isEmpty(this.contents.getControl('vatSite')) ? '' : this.contents.getControl('vatSite').getValue().split(';')[1], //사업장명
            RECEIVE_FORM_SEQ: $.isEmpty(this.contents.getControl('mailReceiveForm')) ? 0 : this.contents.getControl('mailReceiveForm').getValue() //수신화면양식번호                                   
        };

        this.sendMessage(this, sendObject);
        this.onFooterClose();
    },

    //발신정보 - 사용자 이메일 리스트
    getUserEmailList: function () {
        var _returnUserEmailListData = [];
        var self = this;

        if ($.isEmpty(this.SEND_EMAIL_LIST) == false) {
            $.each(self.SEND_EMAIL_LIST, function () {
                _returnUserEmailListData.push([[this], [this]]);
            });
        }

        return _returnUserEmailListData;
    },

    getVatSiteList: function () {
        var _returnVatSiteList = [];
        var self = this;

        $.each(self.VAT_SITE_LIST, function () {
            _returnVatSiteList.push([[this.BUSINESS_NO + ';' + this.COM_DES], [this.COM_DES + '  ' + this.BUSINESS_NO]]);
        });

        return _returnVatSiteList;
    },

    getFormListData: function (formList) {
        var _returnFormListData = [];

        if ($.isEmpty(formList)) {
            return null;
        }

        if ($.isEmpty(formList) == false) {
            $.each(formList, function () {
                if (this.ORD == '1') //action쪽에서 임의로 추가한 Ecount기본
                    _returnFormListData.push([[this.FORM_SEQ], [this.TITLE_NM]]);
                else
                    _returnFormListData.push([[this.FORM_SEQ], [this.TITLE_NM + ' ' + this.FORM_SEQ]]);
            });
        }

        return _returnFormListData;
    },

    getFormListSelectedItem: function (formList) {
        var _selectedItem = [];

        _selectedItem = formList.where(function (item, i) {
            return (item.BASIC_TYPE == '0')
        });

        if (_selectedItem.length == 0) {
            _selectedItem = formList.where(function (item, i) {
                return (item.ORD == '1')
            });
        }

        return _selectedItem[0].FORM_SEQ;
    },

    //회신정보 Row Show & Hide
    receiverShowAndHide: function (isShow) {
        if (isShow) {
            this.contents.getForm()[0].showRow("replyEmpName");
            this.contents.getForm()[0].showRow("replyEmail");
        } else {
            this.contents.getForm()[0].hideRow("replyEmpName");
            this.contents.getForm()[0].hideRow("replyEmail");
        }
    },

    onFocusOutControlHandler: function (control) {
        if (control.cid == "replyEmpName") {
            //회신담당자에 빈값을 넣을 경우 나머지 관련(Email,전화번호) 빈 값 처리
            if ($.isEmpty(this.contents.getControl('replyEmpName').getValue())) {
                this.contents.getControl('replyEmail').setLabel("");
                this.contents.getControl('replyTel').setLabel("");
            }
        }
    },
});