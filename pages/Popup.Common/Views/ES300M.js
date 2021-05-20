window.__define_resource && __define_resource("MSG06903","LBL00218","LBL05842","BTN00230","BTN00436","BTN00512","LBL09727","BTN00369","LBL12224","BTN00159","LBL09718","LBL09917","LBL12038","LBL00219","LBL01177","LBL00223","LBL11130","LBL08396","LBL11132","LBL06063","LBL09719","LBL03702","LBL09721","BTN85017","LBL09913","LBL11135","LBL09723","LBL09724","LBL09725","MSG01136","LBL02760","LBL02929","LBL09918","MSG04805","LBL09728","BTN00220","LBL00909","LBL03657","LBL12187","LBL12188","LBL01418","LBL00778","LBL09729","LBL09730","LBL00227","LBL12186","BTN80002","LBL06064","BTN00069","BTN00667","BTN00008","LBL01183","LBL02076","LBL35158","MSG00456","MSG00342","LBL04956","LBL04957","MSG04944","MSG06848","MSG05133","MSG02356","MSG00757","LBL11147","LBL00397","MSG05714","LBL01482","LBL03658","LBL19690","LBL85270","MSG06906","MSG06789","MSG01488","MSG06909","MSG06907","MSG06908","MSG06311","MSG10009","MSG10007","LBL12191");
/****************************************************************************************************
1. Create Date : 2015.04.25
2. Creator     : 이정민
3. Description : Email보내기 팝업
4. Precaution  :
5. History     : 2017.07.21(Hao) - Custom mail outgoing radio and custom send mail funtion for Invoice/Packing List
                 2019.01.04 (Ngo Thanh Lam) - Prevent setup email template for Internal Use menu
                 [2019.03.05][On Minh Thien] A19_00444 (메일발송화면에서 UI 틀어지는현상)
                 2019.06.07(신선미) - A19_01943 거래처관리대장1(채권) 메일발송시 무한로딩발생
                 [2019.06.24] (taind) - A18_03743 - 전자세금계산서 메일발송 시 첨부파일 갯수 추가 요청
                 2019.11.14 (정준호) - A19_03368 '수신자확인 전' 워터마크 추가
                 2020.04.15 (Nguyen Duc Thinh) A20_01021 - 구 프레임워크 소스 제거
                 2020.10.06 (임태규) : A20_03352 - 내/외부알림 통합이력/큐 개발 및 커뮤니케이션센터 리뉴얼
                 2020.10.30 (박종국) : A20_02943 - 외부알림1차 (모바일/Email다중등록 제거)
****************************************************************************************************/

ecount.page.factory('ecount.page.list', 'ES300M', {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    gridObj: null,
    defaultEmailAddress: 'ecount@ecounterp.com',    //기본 메일발송주소
    userEmailList: null,                            //발신정보 - 사용자 메일 정보
    senderData: null,                               //발신정보 - 기타 정보

    isUseSMS: null,                                 //SMS 사용여부 
    isUseFAX: null,                                 //Fax 사용여부 
    amtEmoney: null,                                //이카운트머니 (Ecount Money)
    sendMailInfo: null,                             //전송데이터
    receiverMailInfo: null,                         //하단 수신정보(Grid Data) 

    SALES_SLIP_ADD_YN: "N",

    receiveSelectedFormSeq: null,                   //수신화면 양식 FORM_SEQ
    contentsSelectedFormSeq: null,                  //보내는화면 양식 FORM_SEQ
    contentsSubSelectedFormSeq: null,               //보내는화면2 양식 FORM_SEQ

    contentsSelectedFormUseYn: "Y",
    contentsSubSelectedFormUseYn: "N",

    receiveFormList: null,                          // 메일수신화면 양식 list
    contentsFormList: null,                         //보내는화면 양식 list
    contentsSubFormList: null,                      // 보내는화면2 양식 List

    mergeAddRowList: null,                          //grid mergeAddRowList controlType 적용할 rowKey list
    isMailChecked: true,                              //발신수단 Email 체크여부
    isSmsChecked: true,                               //발신수단 SMS 체크여부       
    isFaxChecked: true,                               //발신수단 Fax 체크여부

    attachedFiles: null,                            //임시저장한 첨부파일명
    allowFileExtensionList: null,                   //파일첨부 허용 된 확장자
    basicReplySendYn: "N",
    defaultCaller: null,
    COM_CODE: "",
    tableIdColumns: "",
    receiveFormName: "",
    selectedSendEmail: "",

    FSTmpLifeTime: ecenum.tempfileLifetime.oneWeek,
    FSCollection: 'MailAttachment',
    FS_OWNER_KEY: "",
    FS_TOTAL_SIZE: 0,
    ATTACH_INFO_SRC: { SIZE: 0, LIST: [] },
    ATTACH_INFO: { SIZE: 0, LIST: [] },
    UPLOAD_FILE: false,
    REMOVE_ATTACH_FILES: [],

    _FORM_SEQ: "0",
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        //this.pageID = "ES300M";
        this.registerDependencies("pluploader");
    },

    initProperties: function () {
        this.userEmailList = this.getUserEmailList();
        this.senderData = this.viewBag.InitDatas.senderData; //발신상세정보

        this.receiverMailInfo = this.viewBag.InitDatas.receiverMailInfo; //메일수신정보(그리드 데이터)
        this.receiveFormName = ecount.resource[this.viewBag.InitDatas.receiveFormResource];

        if ((this.FORM_TYPE == "SF030" || this.FORM_TYPE == "AF810") && this.TradingStatementPrintingYn == "Y")
            this.usingData.TooltipResource = "MSG06903";

        var isViewFax = $.isEmpty(this.isViewFax) ? true : this.isViewFax;

        // 다중선택인 경우 FAX 발송 안되도록
        if (this.receiverMailInfo.length > 1)
            isViewFax = false;

        this.isUseSMS = ecount.config.limited.feature.USE_SMS;
        this.isUseFAX = ecount.config.limited.feature.USE_FAX && isViewFax && this.usingData.FAX_USE_YN;

        // Email/Fax 타입에 따라 isXXXChecked 값 설정해주기 <- 초기 체크박스 세팅 위해
        this.isMailChecked = this.AccessType == "E";
        this.isSmsChecked = this.isUseSMS;
        this.isFaxChecked = this.isUseFAX && this.AccessType == "F";

        this.amtEmoney = ecount.config.company.AMT_EMONEY;
        this.mergeAddRowList = [];
        this.allowFileExtensionList = this.viewBag.InitDatas.allowFileExtensionList.join(",");
        this.defaultCaller = this.viewBag.InitDatas.callerInfo;

        this.COM_CODE = this.viewBag.COM_CODE;

        this.tableIdColumns = "IO_DATE" + ecount.delimiter + "IO_NO";

        var basicBusinessNo = null;
        var comDes = null;
        var replySendYn = null;

        // 메일수신화면양식 위젯 바인딩용 list와 기본양식 세팅
        if (!$.isEmpty(this.viewBag.InitDatas.receiveFormList)) {
            this.receiveFormList = this.getFormListData(this.viewBag.InitDatas.receiveFormList);
            this.receiveSelectedFormSeq = this.getFormListSelectedItem(this.viewBag.InitDatas.receiveFormList);
        }

        // 전자세금계산서인 경우 양식 넣어준다
        if (this.FORM_TYPE == "ELECTRIC" || this.FORM_TYPE == "ECTAX") {
            this.viewBag.InitDatas.mailContentFormList = [
                {
                    ORD: 1,
                    FORM_SEQ: 0,
                    BASIC_TYPE: "",
                    TITLE_NM: ecount.resource.LBL00218,
                    FORM_NM: ecount.resource.LBL00218,
                    BASIC_SEQ: 0,
                    HEADCOL_CNT: 1,
                    SHEET_YN: ""
                }
            ];
        }

        // 보내는양식 위젯 바인딩용 list와 기본양식 세팅
        if (!$.isEmpty(this.viewBag.InitDatas.mailContentFormList)) {
            // ECount 기본양식인 경우
            if ([1000, 1001].contains(this.FORM_SEQ)) {
                this.FORM_SEQ = 0;
            }

            //if (this.BASIC_TYPE == "1") {
            // 양식번호 없는 경우.. 리스트에서 넘어왔을때?
            if (this.FORM_SEQ == null) {
                var basicTypeFormSeq = -1;
                var basicTypeFormSeqDom = -1;
                this.viewBag.InitDatas.mailContentFormList.forEach(function (v) {
                    if (v.BASIC_TYPE == "1")
                        basicTypeFormSeq = v.FORM_SEQ;
                    if (v.BASIC_TYPE == "0")
                        basicTypeFormSeqDom = v.FORM_SEQ;
                }.bind(this));

                if (this.BASIC_TYPE == "1")
                    this.FORM_SEQ = basicTypeFormSeq == -1 ? 0 : basicTypeFormSeq;
                else
                    this.FORM_SEQ = basicTypeFormSeqDom == -1 ? 0 : basicTypeFormSeqDom;
            }
            //}
            this.contentsFormList = this.getFormListData(this.viewBag.InitDatas.mailContentFormList);
            this.contentsSelectedFormSeq = this.getFormListSelectedItem(this.viewBag.InitDatas.mailContentFormList, this.FORM_SEQ);
        }

        if (!$.isEmpty(this.viewBag.InitDatas.custs)) {
            basicBusinessNo = this.viewBag.InitDatas.custs[0].BUSINESS_NO;
            comDes = this.viewBag.InitDatas.custs[0].COM_DES;
        }

        // EMAIL_INFO가 없는 경우..
        if ($.isEmpty(this.EMAIL_INFO)) {
            if ($.isEmpty(this.viewBag.InitDatas.replySendYn)) {
                replySendYn = "N"
            } else {
                //발송주소가 defaultEmailAddress가 아니라면(웹메일계정) 회신메일발송여부 기본값은 미발송
                if (this.userEmailList.length == 1) {
                    replySendYn = this.viewBag.InitDatas.replySendYn[0].HEAD_YN;
                } else {
                    replySendYn = "N"
                }
                this.basicReplySendYn = this.viewBag.InitDatas.replySendYn[0].HEAD_YN;
            }

            this.selectedSendEmail = this.userEmailList[0][0];
        } else {
            // 이전 페이지에서 유지된 값이 있을경우 (전자세금계산서 인증서첨부에서 값 유지를 위해)
            // 전자세금계산서에서 발송정보 클릭해서 정보 입력한 다음에 다시 발송정보 열때 넘김
            replySendYn = this.EMAIL_INFO.SendMailBasicInfo.REPLY_SEND_YN;
            this.basicReplySendYn = this.EMAIL_INFO.SendMailBasicInfo.REPLY_SEND_YN;
            this.SALES_SLIP_ADD_YN = this.EMAIL_INFO.SendMailBasicInfo.SALES_SLIP_ADD_YN;
            this.contentsSubSelectedFormSeq = this.EMAIL_INFO.SendMailBasicInfo.CONTENT_SUB_FORM_SEQ;
            this.contentsSubSelectedFormUseYn = this.EMAIL_INFO.SendMailBasicInfo.CONTENT_SUB_FORM_USE_YN;
            this.receiveSelectedFormSeq = this.EMAIL_INFO.SendMailBasicInfo.RECEIVE_FORM_SEQ;
            this.selectedSendEmail = this.EMAIL_INFO.SendMailBasicInfo.SEND_EMAIL || this.userEmailList[0][0];
        }

        // 거래명세서/PackingList양식 위젯 바인딩용 list와 기본양식 세팅
        if (!$.isEmpty(this.viewBag.InitDatas.mailContentSubFormList)) {
            this.contentsSubFormList = this.getFormListData(this.viewBag.InitDatas.mailContentSubFormList);
            if (this.isSubNFormType) {
                this.contentsSubSelectedFormSeq = this.getXFormListSelectedItem(this.viewBag.InitDatas.mailContentSubFormList, this.subCondSeq, this.isZaSubFormType);
            }
            else {
                this.contentsSubSelectedFormSeq = this.getFormListSelectedItem(this.viewBag.InitDatas.mailContentSubFormList, this.contentsSubSelectedFormSeq);
            }
        }

        this.senderData.REPLY_SEND_YN = replySendYn;

        //DTO 초기값 설정 - 발신정보 BasicInfo
        // 컨트롤 변경해도 바뀌지 않는 값들만 여기서 넣는다.
        this.sendMailInfo = {
            SEND_BUSINESS_NO: basicBusinessNo, //사업자번호
            SEND_COM_DES: comDes, //사업장명
            SALES_SLIP_ADD_YN: this.SALES_SLIP_ADD_YN, //거래명세서 포함
            WH_FLAG: ecount.company.VAT_SITE,
            RM_FLAG: replySendYn, // <- 어디에 쓰는건지? 회신메일발송여부.. 세금계산서에서 쓰나
            SalesSlip_YN: (this.TradingStatementPrintingYn == "Y" && this.TAX_FLAG != "Y") ? "Y" : "N", //SF030에서만 사용됨. (From 거래명세서조회 or From 판매조회 구분)
            ONE_FLAG: this.ONE_FLAG
        };
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        var headerOption = [
            { id: "receiveInfo", label: ecount.resource.LBL05842 }, //회신담당자등록
            { id: "smsMessage", label: ecount.resource.BTN00230 }, //SMS발송문구등록
            { id: "mailTitle", label: ecount.resource.BTN00436 }, //메일제목등록
            { id: "mailMemo", label: ecount.resource.BTN00512 } //메일추가내용등록
        ];

        // 메일 수신화면양식 있는 경우 
        if (!$.isEmpty(this.receiveFormList)) { //if (!$.isEmpty(this.usingData.ReceiveFormType)) {
            headerOption.push({ id: "emailReceiveForm", label: ecount.resource.LBL09727 }); //메일수신화면양식
        }

        //// 세무인경우 수신확인 추가 > 회계1 > 출력물 > 커뮤니케이션 센터에서 확인
        //if (this.FORM_TYPE.startsWith("TH")) {
        //    headerOption.push({ id: "sendHistory", label: ecount.resource.BTN00369 });
        //}

        header.notUsedBookmark()
            .setTitle(this.AccessType == "F" ? ecount.resource.LBL12224 : ecount.resource.BTN00159)
            .add('option', headerOption, false);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            sendInformationTab = g.tabContents(), //발신정보
            receiveTab = g.tabContents(), //수신정보 (grid Tab)
            grid = g.grid(),
            sendInformationForm = g.form(),
            emailInformationForm = g.form(),
            smsInformationForm = g.form(),
            faxInformationForm = g.form(),
            emailInformationSubTitle = g.subTitle().setId("EmailInformationTitle").title(ecount.resource.LBL09718),
            smsInformationSubTitle = g.subTitle().setId("SmsInformationTitle").title(ecount.resource.LBL09917),
            faxInformationSubTitle = g.subTitle().setId("FaxInformationTitle").title(ecount.resource.LBL12038),
            isHideColumnStatus
        ;

        var control = [];

        sendInformationForm.useInputForm().setColSize(1);
        emailInformationForm.useInputForm().executeValidateIfVisible().setColSize(2);
        smsInformationForm.useInputForm().executeValidateIfVisible().setColSize(2);
        faxInformationForm.useInputForm().executeValidateIfVisible().setColSize(2);

        // 발신정보 s
        // 발신수단 (EMAIL, SMS, FAX checkbox)
        var arryLabel = [], arryKeyValue = [], arrChecked = [];

        arryLabel.push(ecount.resource.LBL00219);
        arryKeyValue.push("SENDTYPE_EMAIL");
        this.isMailChecked && arrChecked.push("SENDTYPE_EMAIL");

        if (this.isUseSMS) {
            arryLabel.push(ecount.resource.LBL01177);
            arryKeyValue.push("SENDTYPE_SMS");
            this.isSmsChecked && arrChecked.push("SENDTYPE_SMS");
        }

        if (this.isUseFAX) {
            arryLabel.push(ecount.resource.LBL00223);
            arryKeyValue.push("SENDTYPE_FAX");
            this.isFaxChecked && arrChecked.push("SENDTYPE_FAX");
        }

        control.push(ctrl.define("widget.checkbox", "sendType", "sendType", ecount.resource.LBL11130)
            .label(arryLabel).value(arryKeyValue)
            .select.apply(ctrl, arrChecked).multiCell(2).end());

        // 보내는 양식
        if (!$.isEmpty(this.contentsFormList)) {

            if (this.FORM_TYPE == "TAX") {
                this.contentsFormList.push(["9", ecount.resource.LBL08396]);
                this.contentsSelectedFormSeq = (this.FORM_SEQ == null || this.BASIC_FORM_SETTING) ? "9" : this.FORM_SEQ; /*넘어온 폼SEQ가 없으면, 기본값 세팅*/
            };

            var fixSelect = {
                outgoingTemplate_select1: this.contentsSelectedFormSeq,
                outgoingTemplate_checkbox1: false,
                outgoingTemplate_checkbox2: false,
            };

            if (this.usingData.FormWidgetType == "1") { // 세금계산서 / 청구서
                fixSelect.outgoingTemplate_radio2 = this.contentsSubSelectedFormUseYn;
                fixSelect.outgoingTemplate_select2 = this.contentsSubSelectedFormSeq;
            } else if (this.usingData.FormWidgetType == "2") { // A/S접수
                fixSelect.outgoingTemplate_radio2 = "N";
            } else if (this.usingData.FormWidgetType == "3") { // Invoice/Packing List
                fixSelect.outgoingTemplate_radio1 = ["A", "I"].contains(this.MailFlag) ? "Y" : "N";
                fixSelect.outgoingTemplate_select2 = this.contentsSubSelectedFormSeq;
                fixSelect.outgoingTemplate_radio2 = ["A", "P"].contains(this.MailFlag) ? "Y" : "N"; 
            }

            var useCheckBox = false;
            if (this.viewBag.InitDatas.UseFormApplicationStandards) {
                useCheckBox = true;
                if (this.viewBag.InitDatas.UseFormApplicationStandards.SETUP_VAL == "S") {
                    fixSelect.outgoingTemplate_checkbox1 = true;
                    fixSelect.outgoingTemplate_checkbox2 = true;
                }
            }

            control.push(ctrl.define("widget.combine.outgoingTemplate", "outgoingTemplate", "outgoingTemplate", ecount.resource.LBL11132)
                .option([this.contentsFormList, this.contentsSubFormList])    //양식종류 리스트 : 배열형태로 전달
                .setOptions({ templateType: parseInt(this.usingData.FormWidgetType), useCheckbox: useCheckBox })    //네이밍변경
                .fixedSelect(fixSelect)
                .multiCell(2)
                .end());

        }

        sendInformationForm.addControls(control);

        sendInformationTab
            .createActiveTab("sendInformation", ecount.resource.LBL06063)
            .add(sendInformationForm);

        // Email정보 영역
        control = [];

        // 메일발송주소
        if (this.userEmailList.length > 1) {
            control.push(ctrl.define('widget.select', 'sendEmailAddress', 'sendEmailAddress', ecount.resource.LBL09719)
                .option(this.userEmailList).select(this.selectedSendEmail).multiCell(2).end());
        } else {
            control.push(ctrl.define('widget.label', 'sendEmailAddress', 'sendEmailAddress', ecount.resource.LBL09719)
                .label(this.defaultEmailAddress).value(this.defaultEmailAddress).multiCell(2).end());
        }

        // 회신담당자
        control.push(ctrl.define("widget.code.replier", "replyEmpName", "replyEmpName", ecount.resource.LBL03702)
            .addCode({ value: this.senderData.RECEIVE_NAME, label: this.senderData.RECEIVE_NAME })
            .codeType(7).singleCell().hideCell(this.userEmailList.length > 1).end());

        // 회신메일발송여부
        control.push(ctrl.define("widget.radio", "replyMailSendYn", "replyMailSendYn", ecount.resource.LBL09721)
            .label([ecount.resource.BTN85017, ecount.resource.LBL09913])
            //.setTitleLink("replyMailSendYn")
            .value([ecenum.useYn.yes, ecenum.useYn.none])
            .select(this.senderData.REPLY_SEND_YN).singleCell().hideCell(this.userEmailList.length > 1).end());

        // 회신Email
        control.push(ctrl.define('widget.label', 'replyEmail', 'replyEmail', ecount.resource.LBL11135)
            .label(this.senderData.RECEIVE_EMAIL).singleCell().hideCell(this.userEmailList.length > 1).end());

        // 회신전화번호
        control.push(ctrl.define('widget.label', 'replyTel', 'replyTel', ecount.resource.LBL09723)
            .label(this.senderData.RECEIVE_TEL).singleCell().hideCell(this.userEmailList.length > 1).end());

        // 메일제목
        ctrl = ctrl.define('widget.input', 'mailTitle', 'mailTitle', ecount.resource.LBL09724)
            .dataRules(["required", ""])
            .value(this.senderData.SEND_SUBJECT_COMMENT).setTitleLink("mailTitle").multiCell(2);

        if (!$.isEmpty(this.usingData.TooltipResource))
            ctrl = ctrl.popover(ecount.resource[this.usingData.TooltipResource]);

        control.push(ctrl.end());

        // 메일추가내용
        control.push(ctrl.define('widget.textarea', 'mailMemoComment', 'mailMemoComment', ecount.resource.LBL09725)
            .value(this.senderData.SEND_MEMO_COMMENT)
            .filter("maxlength", { message: String.format(ecount.resource.MSG01136, 160, 160), max: 160 })
            .setTitleLink("mailMemoComment")
            .multiCell(2).end());

        // 메일수신화면양식
        if (!$.isEmpty(this.receiveFormList)) {
            control.push(ctrl.define('widget.select', 'mailReceiveForm', 'mailReceiveForm', ecount.resource.LBL09727)
                .option(this.receiveFormList)
                .select(this.receiveSelectedFormSeq).singleCell().end());
        }

        // 파일첨부
        if (!this.IsNotAttachment) {
            var fileGroup = ctrl.define("widget.fileGroup", "attachment", "attachment", ecount.resource.LBL02760).multiCell(2);
            var files = [];

            fileGroup
                .setCallbackFunction(function () { this.trigger("FileUploadComplete"); }.bind(this))
                .setGroups({ id: "file", name: ecount.resource.LBL02929 })
                .setGroupFiles(["file", files])
                .setMaxCount(["file", 10])
                .setUploaderConfig("file", {
                    dragdrop: true,
                    extensions: this.allowFileExfileLtensionList,
                    prevent_duplicates: true,
                    multi_selection: true,
                    autostart: false,
                    max_file_count: 10,
                    max_file_size: plupload.parseSize("19.5mb"),
                    //menu_code: ecenum.filemenuCode.gw03,
                    tot_size_lmt: {
                        size: plupload.parseSize("19.5mb"), flag: true
                    },
                    com_storage_size: {
                        size: "", flag: true
                    },
                    use_storage_size: {
                        size: ""
                    }

                })
                .setNewFileStorageConfig("file", {
                    storage_host_number: 0,
                    temp_file_lifetime: this.FSTmpLifeTime,
                    comcode: this.COM_CODE,
                    collection: this.FSCollection,
                    owner_key: this.FS_OWNER_KEY
                });

            control.push(fileGroup.end());
        }
        emailInformationForm.addControls(control);

        if (!this.isMailChecked) {
            emailInformationForm.hide();
            emailInformationSubTitle.hide();
        }

        //if (this.userEmailList.length > 1) {
        //    emailInformationForm.hideRow([1, 2]);
        //}

        sendInformationTab
            .add(emailInformationSubTitle)
            .add(emailInformationForm);


        //충전잔액 (이카운트 머니)
        var smsFaxAmtEmoney = String.fastFormat(this.amtEmoney, {
            fractionLimit: "1",
            removeFractionIfZero: false
        });

        //편집 컬럼 숨김 여부
        if (["15", "16", "17", "10"].contains(this.usingData.DocGubun)) {
            isHideColumnStatus = true;
        } else {
            isHideColumnStatus = !this.usingData.IsCustEmailEdit;
        }


        // SMS 발신정보 영역
        control = [];

        // SMS발신번호
        control.push(ctrl.define('widget.input', 'sendSmsHp', 'sendSmsHp', ecount.resource.LBL09918)
            .filter('numberOnlyAndSign', { message: ecount.resource.MSG04805, reg: '-' })
            .value(!$.isEmpty(this.senderData.SEND_HP) ? this.senderData.SEND_HP : this.defaultCaller.CALLER).end());

        // 충전잔액
        control.push(ctrl.define('widget.label', 'SMSBalanceLabel', 'SMSBalanceLabel', ecount.resource.LBL09728)
            .label(smsFaxAmtEmoney)
            .hasFn([
                { id: 'smsChargingPopup', label: ecount.resource.BTN00220 },
                { id: 'historyPopup', label: ecount.resource.LBL00909 },
            ]).singleCell().end());

        // SMS발송문구
        control.push(ctrl.define('widget.input', 'sendSmsComment', 'sendSmsComment', ecount.resource.LBL03657)
            .dataRules(["required"], "")
            .value(this.senderData.SEND_SMS_COMMENT).setTitleLink("sendSmsComment").multiCell(2)
            .popover(ecount.resource.MSG06903).end());
        smsInformationForm.addControls(control);

        if (!this.isSmsChecked) {
            smsInformationForm.hide();
            smsInformationSubTitle.hide();
        }

        sendInformationTab
            .add(smsInformationSubTitle)
            .add(smsInformationForm);

        // FAX 발신정보 영역
        control = [];

        // FAX발신번호
        control.push(ctrl.define('widget.input', 'sendFaxNo', 'sendFaxNo', ecount.resource.LBL09918)
            .dataRules(["required"], "")
            .filter('numberOnlyAndSign', { message: ecount.resource.MSG04805, reg: '-' })
            .value(!$.isEmpty(this.senderData.SEND_FAX_NO) ? this.senderData.SEND_FAX_NO : ecount.company.FAX).end());

        // 충전잔액
        control.push(ctrl.define('widget.label', 'FAXBalanceLabel', 'FAXBalanceLabel', ecount.resource.LBL09728)
            .label(smsFaxAmtEmoney)
            .hasFn([
                { id: 'faxChargingPopup', label: ecount.resource.BTN00220 },
                { id: 'historyPopup', label: ecount.resource.LBL00909 },
            ]).singleCell().end());

        faxInformationForm.addControls(control);

        if (!this.isFaxChecked) {
            faxInformationForm.hide();
            faxInformationSubTitle.hide();
        }

        sendInformationTab
            .add(faxInformationSubTitle)
            .add(faxInformationForm);


        // 하단 수신정보 그리드영역
        if (this.DontShowReceiverInfo != true) {
            this.columnList = [];

            if (this.usingData.ReceiveInfoTabType == "1") {
                this.columnList.push({ propertyName: "RECEIVER_CD", id: "RECEIVER_CD", title: ecount.resource.LBL12187, width: 100, align: "center", controlType: "widget.label", isRowMerge: true });
                this.columnList.push({ propertyName: "RECEIVER_NM", id: "RECEIVER_NM", title: ecount.resource.LBL12188, width: 150, align: "center", controlType: "widget.label", isRowMerge: true });
                this.columnList.push({ propertyName: "REMARKS", id: "REMARKS", title: ecount.resource.LBL01418, width: 180, align: "left", controlType: "widget.label", isRowMerge: true });
                this.columnList.push({ propertyName: "TOT_AMT", id: "TOT_AMT", title: ecount.resource.LBL00778, width: 100, align: "right", controlType: "widget.label", isHideColumn: (this.FORM_TYPE == "CUSTOMER") ? true : false, dataType: "9" + ecount.config.company.DEC_AMT, isRowMerge: true });
            } else {
                this.columnList.push({ propertyName: "REMARKS", id: "REMARKS", title: ecount.resource.LBL01418, width: 180, align: "left", controlType: "widget.label", isRowMerge: true });
            }

            this.columnList.push({ propertyName: "ADDROW", id: "ADDROW", title: ecount.resource.LBL09729, width: 30, align: "center", /*controlType: "widget.mergeAddRow",*/ headerColSpan: 2 });
            this.columnList.push({ propertyName: "UNAME", id: "UNAME", title: "", width: 120, align: "left", controlType: "widget.label" });
            this.columnList.push({ propertyName: "SEND_TYPE", id: "SEND_TYPE", title: ecount.resource.LBL09730, width: 80, align: "center", controlType: "widget.checkbox", isHideColumn: !this.isMailChecked, columnOption: this.onSendTypeHeaderClick(), headerColSpan: 2 });
            this.columnList.push({ propertyName: "EMAIL", id: "EMAIL", title: "", width: 200, align: "left", controlType: "widget.input", isHideColumn: !this.isMailChecked, controlOption: { maxLength: 100 }, validation: this.CheckSpecialCharacterForCode.bind(this) });
            this.columnList.push({ propertyName: "ISCHECKSMS", id: "ISCHECKSMS", title: ecount.resource.LBL00227, width: 30, align: "center", controlType: "widget.checkbox", isHideColumn: !this.isSmsChecked, columnOption: this.onSmsHeaderClick(), headerColSpan: 2 });
            this.columnList.push({ propertyName: "HP_NO", id: "HP_NO", title: "", width: 100, align: "left", controlType: "widget.input.numberOnlyAndSign", isHideColumn: !this.isSmsChecked, controlOption: { maxLength: 50 }, validation: this.CheckSpecialCharacterForCode.bind(this) });
            this.columnList.push({ propertyName: "ISCHECKFAX", id: "ISCHECKFAX", title: ecount.resource.LBL12186, width: 30, align: "center", controlType: "widget.checkbox", isHideColumn: !this.isFaxChecked, columnOption: this.onFaxHeaderClick(), isRowMerge: true, headerColSpan: 2 });
            this.columnList.push({ propertyName: "FAX_NO", id: "FAX_NO", title: "", width: 100, align: "left", controlType: "widget.input.numberOnlyAndSign", isHideColumn: !this.isFaxChecked, controlOption: { maxLength: 50 }, validation: this.CheckSpecialCharacterForCode.bind(this), isRowMerge: true });
            this.columnList.push({ propertyName: "EDITOR", id: "EDITOR", title: ecount.resource.BTN80002, width: 50, align: "center", controlType: "widget.link", isHideColumn: isHideColumnStatus, isRowMerge: true });

            // 머지 셀 리스트
            var mergeList = [];
            // 머지 기본값 설정
            var mergeData = { _ROW_TYPE: "TOTAL", _MERGE_USEOWN: true, _IS_CENTER_ALIGN: true };

            // 컬럼정보에 headerColSpan이 있으면 그 수만큼 col 머지
            this.columnList.forEach(function (v, i) {
                if (v.headerColSpan)
                    mergeList.push($.extend({}, mergeData, { _MERGE_START_INDEX: i, _COLSPAN_COUNT: v.headerColSpan }));
            });

            grid
                .setColumnRowCustom([0, /* 'new', 'new'*/], [{ '_MERGE_SET': mergeList }])
                .setEditable(true, 1, 0)
                .setRowData(this.getMailGridData())
                .setColumnPropertyColumnName('id')
                .setColumns(this.columnList)
                .setCheckboxIgnore(true, ["SEND_TYPE"])
                .setEditRowDataSample({ "RECEIVER_KEY": "", "SER_NO": "", "IO_DATE": "", "IO_NO": "" })
                .setCustomRowCell('ADDROW', this.setGridAddRow.bind(this))
                .setCustomRowCell('SEND_TYPE', this.setGridSendType.bind(this))
                //.setCustomRowCell('EDITOR', this.setGridEditor.bind(this))
                .setCustomRowCell("TOT_AMT", this.setGridTotAmt.bind(this))
                .setCustomRowCell("ISCHECKSMS", this.setGridSms.bind(this))
                .setCustomRowCell("ISCHECKFAX", this.setGridFax.bind(this))
                .setCustomRowCell("REMARKS", this.setGridRemarks.bind(this))
            ;

            receiveTab
                .createTab('receiverInformation', ecount.resource.LBL06064, null, true, "left")
                .addGrid("dataGrid" + this.pageID, grid); //수신정보       

            sendInformationTab
                .add(receiveTab);
        }
        contents.add(sendInformationTab);
    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        var sendBtnLabel = this.FORM_TYPE == "ELECTRIC" ? ecount.resource.BTN00069 : String.format("{0}(F8)", ecount.resource.BTN00667);
        toolbar
            .addLeft(ctrl.define('widget.button', 'Send').label(sendBtnLabel).clickOnce())
            .addLeft(ctrl.define('widget.button', 'Close').label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onLoadComplete: function (e) {
        if (!$.isEmpty(this.contentsFormList) && ((this.FORM_TYPE == "TAX" || this.FORM_TYPE == "ECTAX" || this.FORM_TYPE == "ELECTRIC") && this.S_SYSTEM != "S")) {
            this.contents.getControl("outgoingTemplate").get(1).hide();
        }
        //if (this.EMAIL_INFO && this.EMAIL_INFO.SendMailBasicInfo && this.EMAIL_INFO.SendMailBasicInfo && this.EMAIL_INFO.SendMailBasicInfo.SEND_FILENAMES_DETAIL.length > 0) {
        //    this.contents.getFileList("attachment").handleAddFiles(this.EMAIL_INFO.SendMailBasicInfo.SEND_FILENAMES_DETAIL, this.contents.getFileList("attachment").uploader);
        //}
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/


    onPopupHandler: function (control, param, handler) {
        switch (control.id) {
            case 'replyEmpName':
                param.SEND_SER = this.FORM_TYPE.startsWith("GH") ? "GA" : "MA";
                param.DOC_GUBUN = this.usingData.DocGubun;
                param.isCheckBoxDisplayFlag = false;
                //param.KeyWord = this.contents.getControl('replyEmpName').getValue();
                break;
        }

        handler(param);
    },

    onMessageHandler: function (page, data) {
        switch (page.pageID) {            
            case "ES300P_02": // 회신메일발송여부 팝업
                this.contents.getControl('replyMailSendYn', "sendInformation").setValue(data.HEAD_YN);
                break;
            case 'EGA001P_06': // 회신담당자 팝업
                if (!$.isEmpty(data.data.SEND_EMAIL)) {
                    this.contents.getControl('replyEmail', "sendInformation").setLabel(data.data.SEND_EMAIL);
                }
                if (!$.isEmpty(data.data.SEND_TEL)) {
                    this.contents.getControl('replyTel', "sendInformation").setLabel(data.data.SEND_TEL);
                }
                if (this.isUseSMS && !$.isEmpty(data.data.SEND_HP)) {
                    this.contents.getControl('sendSmsHp', "sendInformation").setValue(data.data.SEND_HP);
                }
                if (this.isUseFAX && !$.isEmpty(data.data.SEND_FAX)) {
                    this.contents.getControl('sendFaxNo', "sendInformation").setValue(data.data.SEND_FAX);
                }
                break;
            case "EGA001P_03": // 메일제목, 메일추가내용, SMS발송문구 팝업
                if (data.type == "sjComment") {
                    this.contents.getControl('mailTitle', "sendInformation").setValue(data.data.SEND_COMMNET);
                } else if (data.type == "smComment") {
                    this.contents.getControl('sendSmsComment', "sendInformation").setValue(data.data.SEND_COMMNET);
                } else if (data.type == "emComment") {
                    this.contents.getControl('mailMemoComment', "sendInformation").setValue(data.data.SEND_COMMNET);
                }
                break;
            case "CM100P_02": // 수신화면양식설정
                var ctrl = this.contents.getControl("mailReceiveForm", "sendInformation");
                if (data.type == "reload" && !ctrl.isContain(data.formSeq)) {
                    var newReceiveForm = this.getFormListData([{ FORM_SEQ: data.formSeq, TITLE_NM: data.formName }]);
                    newReceiveForm[0].push([this.receiveFormList.length - 1]); // insert할 인덱스
                    ctrl.addOption(newReceiveForm);
                    this.receiveFormList.insert(this.receiveFormList.length - 1, newReceiveForm[0]);
                }

                ctrl.setValue(data.formSeq);
                break;
        }
    },

    onFocusOutControlHandler: function (control) {
        if (control.cid == "replyEmpName") {
            //회신담당자에 빈값을 넣을 경우 나머지 관련(Email,전화번호) 빈 값 처리
            if ($.isEmpty(this.contents.getControl('replyEmpName', "sendInformation").getValue())) {
                this.contents.getControl('replyEmail', "sendInformation").setLabel("");
                this.contents.getControl('replyTel', "sendInformation").setLabel("");
            }
        }
    },

    onChangeControl: function (control) {
        switch (control.cid) {
            case "sendType":
                // 발신수단 체크값에 따라 발신정보 상세 display 여부 바꿈
                var form = this.contents.getForm("sendInformation");
                var checkControl = this.contents.getControl("sendType").getValueInData(control.cindex);
                var titleControlName = "", columnName = "";

                if (checkControl == "SENDTYPE_EMAIL") { //Email 
                    titleControlName = "EmailInformationTitle";
                    columnName = "SEND_TYPE";
                }
                else if (checkControl == "SENDTYPE_SMS") {
                    titleControlName = "SmsInformationTitle";
                    columnName = "ISCHECKSMS";
                }
                else if (checkControl == "SENDTYPE_FAX") {
                    titleControlName = "FaxInformationTitle";
                    columnName = "ISCHECKFAX";
                }

                var titleControl = this.contents.find(function (item) { return item.id == titleControlName; })[0];

                if (control.value) {
                    titleControl.show();
                    form[control.cindex + 1].show();
                } else {
                    titleControl.hide();
                    form[control.cindex + 1].hide();
                }

                if (this.DontShowReceiverInfo != true) {
                    this.gridObj.grid.setColumnVisibility(columnName, control.value);
                    this.gridObj.grid.setColumnInfo(columnName, { isHideColumn: !control.value });

                    if (checkControl == "SENDTYPE_FAX") {
                        this.gridObj.grid.setColumnVisibility("FAX_NO", control.value);
                        this.gridObj.grid.setColumnInfo("FAX_NO", { isHideColumn: !control.value });
                    }
                }

                this.adjustContentsDimensions(true);
                break;
            case 'sendEmailAddress':
                // 메일발송주소 ecount@econterp.com인지 아닌지에 따라 회신담당자 정보 display 여부 바꿈
                if (control.value != this.defaultEmailAddress) {
                    this.receiverShowAndHide(false);
                    this.contents.getControl('replyMailSendYn', "sendInformation").setValue("N");
                }
                else {
                    this.receiverShowAndHide(true);
                    this.contents.getControl('replyMailSendYn', "sendInformation").setValue(this.basicReplySendYn || "Y");
                }

                break;
        }
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);
        this.gridObj = grid;
    },


    onGridRenderAllRowComplete: function (e, data) {
        var grid = this.gridObj.grid;
        var addedRowKeyValue = grid.getRowKeyByIndex(data.addRowStartIndex);
        var custKey = grid.getCell("RECEIVER_KEY", addedRowKeyValue);

        if ($.isEmpty(custKey)) {
            //바로위의 index의 ROW를 통해 RECEIVER_KEY를 알 수 있음.
            //한 거래처별로 최소 2개의 ROW가 merge되므로 위의 ROW를 get하면 자신의 거래처와 같은 ROW
            var value = grid.getCell("RECEIVER_KEY", grid.getRowKeyByIndex(data.addRowStartIndex - 1));
            grid.setCell("RECEIVER_KEY", addedRowKeyValue, value);
        }
    },

    setGridAddRow: function (value, rowItem) {
        var option = {};

        if (this.usingData.CantAddCustEmail != true) {
            var grid = this.contents.getGrid("dataGrid" + this.pageID, "receiverInformation").grid;
            var receiverList = grid.getRowList().groupBy("RECEIVER_KEY")[rowItem["RECEIVER_KEY"]];
            var controlRowIdx = receiverList[receiverList.length - 1][ecount.grid.constValue.rowCountColumnPropertyName];

            if (controlRowIdx == rowItem[ecount.grid.constValue.rowCountColumnPropertyName]) {
                option.controlType = "widget.mergeAddRow";
                option.event = {
                    "click": function (e, data) {
                        this.contents.getGrid("dataGrid" + this.pageID, "receiverInformation").grid.refreshCell("ADDROW", data.rowKey);
                    }.bind(this)
                };
            }
        }

        return option;

        //var targetArray = new Array();

        //if (this.usingData.CantAddCustEmail != true) // 수신정보 추가 되는 경우에만
        //    option.data = { 'controlViewTargetRow': this.mergeAddRowList }; // 지정된 row에만 컨트롤('+') 표시되도록 지정('data-key'와 동일 값)             

        //return option;
    },

    setGridSendType: function (value, rowItem) {
        var that = this;
        var option = {};
        option.controlType = "widget.select";
        var selectOption = [['N', ecount.resource.LBL01183, ''], ['T', ecount.resource.LBL02076, ''], ['C', ecount.resource.LBL35158, '']];
        option.optionData = selectOption;

        option.event = {
            'change': function (e, data) {
                if (data.rowItem.SEND_TYPE == "T") {
                    //한 거래처(전표)에 수신은 하나씩 가능 (기존에 수신으로 선택된 row 반환)
                    var targetRow = that.gridObj.grid.getRowList().where(function (item, i) {
                        //같은 거래처(전표)에 속한 email중 자신을 제외한 수신자 row 반환 (거래처코드가 같은 MergeRow가 있을 수 있으므로 RECEIVER_KEY를 이용함)
                        return item.RECEIVER_KEY == data.rowItem.RECEIVER_KEY && item.SEND_TYPE == "T" && item[ecount.grid.constValue.keyColumnPropertyName] != data.rowKey;
                    });

                    if (!$.isEmpty(targetRow)) { //기존에 수신자가 있을경우 미발송으로 변경
                        that.gridObj.grid.setCell("SEND_TYPE", targetRow[0][ecount.grid.constValue.keyColumnPropertyName], "N");
                    }
                }
            }.bind(this)
        }

        return option;
    },

    //setGridEditor: function (value, rowItem) {
    //    var option = {};

    //    option.event = {
    //        'click': function (e, data) {
    //            //Permission check
    //            var userPermit = this.Permit.Value;

    //            if (userPermit == "R") {
    //                ecount.alert(ecount.resource.MSG00456); // 읽기 권한자는 사용할 수 없는 기능입니다.\n\n마스터에게 문의 바랍니다.
    //                return false;
    //            }
    //            else if (["U", "X"].contains(userPermit)) {
    //                ecount.alert(ecount.resource.MSG00342); // 수정 권한이 없습니다.
    //                return false;
    //            }

    //            var param = {
    //                width: 605,
    //                height: 400,
    //                controlID: "custMailEdit",
    //                CUST: data.rowItem.RECEIVER_CD,
    //                DOC_GUBUN: this.usingData.DocGubun
    //            };

    //            this.openWindow({
    //                url: '/ECERP/ESA/ESA001P_09',
    //                name: ecount.resource.BTN80002,
    //                param: param,
    //                popupType: false,
    //                additional: false
    //            });

    //        }.bind(this)
    //    }
    //    return option;
    //},

    setGridTotAmt: function (value, rowItem) {
        var option = {};

        if (rowItem.TOT_AMT) {
            var totAmt = String.fastFormat(rowItem.TOT_AMT, {
                fractionLimit: ecount.config.company.DEC_AMT,
                removeFractionIfZero: false
            });

            if (!$.isEmpty(rowItem["AMT_F"]) && Decimal(rowItem["AMT_F"]) > 0) {
                var saleAmt = String.fastFormat(rowItem.AMT_F, {
                    fractionLimit: ecount.config.company.DEC_AMT,
                    removeFractionIfZero: false
                });

                totAmt += "<br />(" + saleAmt + ")";
            }

            option.data = totAmt;
        }
        else if (!$.isEmpty(rowItem.AMT)) {
            var totAmt = String.fastFormat(rowItem.AMT, {
                fractionLimit: ecount.config.company.DEC_AMT,
                removeFractionIfZero: false
            });

            option.data = totAmt;
        }
        return option;
    },

    setGridSms: function () {
        var option = {};
        option.controlType = "widget.checkbox";
        option.event = {
            'change': function (e, data) {
                if (data['newValue'] === false) {
                    this.gridObj.grid.removeValidate('HP_NO', data.rowKey);
                }
            }.bind(this)
        };
        return option;
    },

    setGridFax: function () {
        var option = {};
        option.controlType = "widget.checkbox";
        option.event = {
            'change': function (e, data) {
                if (data['newValue'] === false) {
                    this.gridObj.grid.removeValidate('FAX_NO', data.rowKey);
                }
            }.bind(this)
        };
        return option;
    },

    setGridRemarks: function (value, rowItem) {
        var option = {}, remarks = [];

        if (this.FORM_TYPE.startsWith("GH")) { // 그룹웨어
            if (!$.isEmpty(rowItem.IO_DATE_NO))
                remarks.push(rowItem.IO_DATE_NO);

            remarks.push(rowItem.REMARKS);
        } else if (this.FORM_TYPE.startsWith("TH")) { // 세무
            if (["TH010", "TH020", "TH030", "TH070"].contains(this.FORM_TYPE)) {
                remarks.push(rowItem.PER_NO + "\n" + rowItem.UNAME);
            } else {
                if (!$.isEmpty(rowItem.IN_DATE))
                    remarks.push(String.format("[{0}]{1}", ecount.resource.LBL04956, ecount.infra.getECDateFormat('DATE10', false, rowItem.IN_DATE.toDate()).toString().trim()));
                if (!$.isEmpty(rowItem.OUT_DATE))
                    remarks.push(String.format("[{0}]{1}", ecount.resource.LBL04957, ecount.infra.getECDateFormat('DATE10', false, rowItem.OUT_DATE.toDate()).toString().trim()));
            }
        } else if (this.FORM_TYPE.startsWith("PH")) { // 급여
            remarks.push(rowItem.REMARKS);

            if (!$.isEmpty(rowItem.IN_DATE))
                remarks.push(String.format("[{0}]{1}", ecount.resource.LBL04956, ecount.infra.getECDateFormat('DATE10', false, rowItem.IN_DATE.toDate()).toString().trim()));
            if (!$.isEmpty(rowItem.OUT_DATE))
                remarks.push(String.format("[{0}]{1}", ecount.resource.LBL04957, ecount.infra.getECDateFormat('DATE10', false, rowItem.OUT_DATE.toDate()).toString().trim()));
        } else if (["TAX", "SERVICE", "ELECTRIC", "ECTAX"].contains(this.FORM_TYPE)) { // 청구서, 매출청구서조회(서비스), (전자)세금계산서
            if (!$.isEmpty(rowItem.IO_DATE_NO))
                remarks.push(rowItem.IO_DATE_NO);

            remarks.push(rowItem.REMARKS);
        } else { // 재고전표
            if (!$.isEmpty(rowItem.IO_DATE_NO))
                remarks.push(rowItem.IO_DATE_NO);

            remarks.push(rowItem.REMARKS);
        }
        option.data = remarks.join("<br />");

        return option;
    },

    onSendTypeHeaderClick: function () {
        return {
            attrs: {
                'checked': true
            },
            event: {
                "change": function (e, data) {
                    var isCheck = data.newValue;
                    $.each(this.gridObj.grid.getRowList(), function (e, data) {
                        if (isCheck) {
                            //거래처별 N개씩 데이터를 가지기때문에 첫번째 ROW를 수신으로, 나머지는 참조, 값이없는 ROW는 미발송으로 변경
                            if (!$.isEmpty(data.RECEIVER_CD)) {
                                //CUST 값이 있는 ROW가 각 거래처별 첫번째 ROW - 수신자로 변경
                                this.gridObj.grid.setCell("SEND_TYPE", data[ecount.grid.constValue.keyColumnPropertyName], "T");
                            } else if (!$.isEmpty(data.EMAIL)) {
                                //Email값이 입력된 나머지 ROW는 참조자로
                                this.gridObj.grid.setCell("SEND_TYPE", data[ecount.grid.constValue.keyColumnPropertyName], "C");
                            } else {
                                //그 외는 미발송으로
                                this.gridObj.grid.setCell("SEND_TYPE", data[ecount.grid.constValue.keyColumnPropertyName], "N");
                            }
                        } else {
                            this.gridObj.grid.setCell("SEND_TYPE", data[ecount.grid.constValue.keyColumnPropertyName], "N");
                        }
                    }.bind(this));
                }.bind(this)
            }
        };
    },

    onFaxHeaderClick: function () {
        return {
            attrs: {
                'checked': false
            },
            event: {
                "change": function (e, data) {
                    var _newCheckValue = data.newValue;
                    var rowListByReceiverKey = this.gridObj.grid.getRowList().groupBy("RECEIVER_KEY");

                    for (var receiverKey in rowListByReceiverKey) {
                        if (rowListByReceiverKey.hasOwnProperty(receiverKey)) {
                            var row = rowListByReceiverKey[receiverKey][0];
                            this.gridObj.grid.setCell("ISCHECKFAX", row[ecount.grid.constValue.keyColumnPropertyName], _newCheckValue);
                        }
                    }
                }.bind(this)
            }
        };
    },

    onSmsHeaderClick: function () {
        return {
            attrs: {
                'checked': false
            },
            event: {
                "change": function (e, data) {
                    var _newCheckValue = data.newValue;

                    $.each(this.gridObj.grid.getRowList(), function (e, data) {
                        this.gridObj.grid.setCell("ISCHECKSMS", data[ecount.grid.constValue.keyColumnPropertyName], _newCheckValue);
                    }.bind(this));
                }.bind(this)
            }
        };
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ 'on' + target + control id ]
    ****************************************************************************************************/

    onFooterClose: function () {
        this.isClose = true;                //MessageHandler쪽에서 닫기버튼에 대한 정확한 인식을 위해 Flag를 추가하여 넘김
        this.sendMessage(this, null);

        this.close();

        if (this.isFromApp) {
            window.open('mobile/close');
        }
    },

    // 적용버튼 클릭
    onFooterSend: function (e) {
        // 메일제목만 우선 체크하고 SMS발송문구는 SMS수신 체크된거 있을때만 체크
        var invalid = this.contents.getControl("mailTitle", "sendInformation").validate();// this.contents.validate();

        if (invalid.length > 0) {
            this.footer.getControl("Send").setAllowClick();
            return false;
        }

        //onFooterSend에서는 발신정보 관련 체크 후 checkValidation 호출하여 수신정보 관련 체크
        var msgFormAuth = ecount.resource.MSG04944; // 모든 양식에 대해 조회권한이 없습니다.\n마스터에게 문의 바랍니다.

        var checked = this.contents.getControl("sendType").getCheckedValue(), // 발신수단
            sendEmail = this.contents.getControl("sendEmailAddress").getValue(), // 메일발송주소
            replyEmail = this.contents.getControl("replyEmail").getValue(); // 회신담당자Email

        // Email, SMS, Fax 셋다 체크 안했을 경우 -pcm0828
        if ($.isEmpty(checked)) {
            ecount.alert(ecount.resource.MSG06848, function () {
                this.footer.getControl("Send").setAllowClick();
            }.bind(this)); // Email, SMS, Fax 중 하나 이상 선택해야 합니다.
            return false;
        }

        var mailSendYn = checked.contains("SENDTYPE_EMAIL"), // 발신수단 Email 체크여부
            smsSendYn = checked.contains("SENDTYPE_SMS"), // 발신수단 SMS 체크여부
            faxSendYn = checked.contains("SENDTYPE_FAX"); // 발신수단 Fax 체크여부

        // 양식 포함이고 양식타입은 있는데 양식리스트 없는 경우
        var outGoingTemplate = (this.contents.getControl("outgoingTemplate", "sendInformation") && this.contents.getControl("outgoingTemplate", "sendInformation").getValue()) || { outgoingTemplate_radio1: "N", outgoingTemplate_radio2: "N" },
            isContentsFormSend = (outGoingTemplate.outgoingTemplate_radio1 || "N") == "Y",
            isContentsSubFormSend = (outGoingTemplate.outgoingTemplate_radio2 || "N") == "Y",
            contentsFormSeq = outGoingTemplate.outgoingTemplate_select1,
            contentsSubFormSeq = outGoingTemplate.outgoingTemplate_select2,
            receiveFormSeq = this.contents.getControl("mailReceiveForm", "sendInformation") && this.contents.getControl("mailReceiveForm", "sendInformation").getValue();

        var receiveFormCheck = mailSendYn && !$.isEmpty(this.usingData.ReceiveFormType) && $.isEmpty(receiveFormSeq), // 메일수신화면양식
            contentsFormCheck = isContentsFormSend && !$.isEmpty(this.usingData.ContentsFormType) && $.isEmpty(contentsFormSeq), // 보내는양식
            contentsSubFormCheck = isContentsSubFormSend && !$.isEmpty(this.usingData.ContentsSubFormType) && $.isEmpty(contentsSubFormSeq); // 거래명세서양식/PackingList (세금계산서/InvoicePackingList)

        if (receiveFormCheck || contentsFormCheck || contentsSubFormCheck) {
            ecount.alert(msgFormAuth, function () {
                this.footer.getControl("Send").setAllowClick();
            }.bind(this));
            return false;
        }

        // Invoice/PackingList에서 양식 둘다 포함안함 했을 경우
        if (this.usingData.FormWidgetType == "3" && !isContentsFormSend && !isContentsSubFormSend) {
            ecount.alert(ecount.resource.MSG05133, function () {
                this.footer.getControl("Send").setAllowClick();
            }); // 전송할 양식을 선택 바랍니다.
            return false;
        }

        // 발신수단 Email 체크되어있고 메일발송주소가 ecount@ecounterp.com인데 회신담당자Email이 없을경우
        if (mailSendYn && sendEmail == this.defaultEmailAddress && $.isEmpty(replyEmail)) {
            ecount.alert(ecount.resource.MSG02356, function () { // 회신받을 Email을 입력 바랍니다.
                this.contents.getControl("replyEmpName", "sendInformation").setFocus(0);
                this.footer.getControl("Send").setAllowClick();
            }.bind(this));

            return false;
        }

        // ecount@ecounterp.com이 아닌 다른 웹메일 주소로 보내려 할시 유효한 메일인지 체크
        if (mailSendYn && sendEmail != this.defaultEmailAddress) {
            var param = {
                'MAIL_ID': sendEmail.split('@')[0].toString(),
                'MAIL_DOMAIN': sendEmail.split('@')[1].toString()
            };

            ecount.common.api({
                url: '/Common/Infra/GetMailUserFlag',
                data: Object.toJSON(param),
                progressbar: true,
                success: function (result) {
                    if (result.Data != 'Y') {
                        ecount.alert(ecount.resource.MSG00757); // 계정을 확인 바랍니다.
                    } else {
                        // 하단 수신정보 관련 Validation
                        this.checkValidation();
                    }
                    this.footer.getControl("Send").setAllowClick();
                }.bind(this)
            });
        } else {
            // 하단 수신정보 관련 Validation
            this.checkValidation();
        }
    },


    // 회신메일발송여부 링크 클릭
    onTitleFormLinkReplyMailSendYn: function (e) {
        var param = {
            width: 350,
            height: 550,
            parentPageID: this.pageID,
            responseID: this.callbackID,
            DOC_GUBUN: this.usingData.DocGubun
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Common/ES300P_02',
            name: ecount.resource.LBL11147,
            param: param
        });
    },

    //SMS 충전팝업
    onFunctionSmsChargingPopup: function (e) {
        this.openChargingPopup("SMS");
    },

    //FAX 충전팝업
    onFunctionFaxChargingPopup: function (e) {
        // 구프레임워크상 fax구분값을 따로 구분하지 않고, sms로 사용하고 있음
        this.openChargingPopup("SMS");
    },



    //메일제목 팝업
    onTitleFormLinkMailTitle: function () {
        this.openCommentPopupForSearch(this.FORM_TYPE.startsWith("GH") ? "GJ" : "SJ", String.format("{0} {1}", ecount.resource.LBL09724, ecount.resource.LBL00397));
    },

    //메일추가내용 팝업
    onTitleFormLinkMailMemoComment: function () {
        this.openCommentPopupForSearch(this.FORM_TYPE.startsWith("GH") ? "GE" : "EM", String.format("{0} {1}", ecount.resource.LBL09725, ecount.resource.LBL00397));
    },

    //SMS발송문구 팝업
    onTitleFormLinkSendSmsComment: function () {
        this.openCommentPopupForSearch(this.FORM_TYPE.startsWith("GH") ? "GM" : "SM", String.format("{0} {1}", ecount.resource.LBL03657, ecount.resource.LBL00397));
    },


    //회신담당자등록 
    onDropdownReceiveInfo: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_06',
            name: "EGA001P_06",
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: this.FORM_TYPE.startsWith("GH") ? "GA" : "MA",
                DOC_GUBUN: this.usingData.DocGubun ,
                Edit: true
            }
        });
    },

    // SMS발송문구등록
    onDropdownSmsMessage: function (e) {
        this.openCommentPopupForRegist(this.FORM_TYPE.startsWith("GH") ? "GM" : "SM");
    },

    // 메일제목등록
    onDropdownMailTitle: function (e) {
        this.openCommentPopupForRegist(this.FORM_TYPE.startsWith("GH") ? "GJ" : "SJ");
    },

    // 메일추가내용등록
    onDropdownMailMemo: function (e) {
        this.openCommentPopupForRegist(this.FORM_TYPE.startsWith("GH") ? "GE" : "EM"); // 그룹웨어 GE
    },

    // 메일수신화면양식
    onDropdownEmailReceiveForm: function (e) {
        if (["SF010", "SF020", "SF210", "SF770", "SF500", "SF743", "SF600", "SF420", "SF220", "SF410", "SF200",
            "SF610", "SF910", "SF920", "SF240", "SF780", "SF744"].contains(this.FORM_TYPE) // From 구매 조회
        ) {
            ecount.alert(ecount.resource.MSG05714);
            return false;
        }

        var ctrl = this.contents.getControl("mailReceiveForm", "sendInformation");

        var receiverFormSeq = ctrl.getValue() == 1000 ? 0 : this.contents.getControl("mailReceiveForm", "sendInformation").getValue();
        var param = {
            width: 700,
            height: 600,
            FORM_TYPE: (this.usingData.ReceiveFormType || this.FORM_TYPE),
            FORM_SEQ: receiverFormSeq
        };

        if (ctrl.getOptionCount() == 1 && ctrl.getValue() == 1000) {
            param.IsSubmitSelf = true;

            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_22",
                name: ecount.resource.LBL01482,
                param: param,
                popupType: this.popupType == "layer" ? false : true,
                fpopupID: this.ecPageID
            });
        } else {
            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: ecount.resource.LBL01482,
                param: param,
                popupType: this.popupType == "layer" ? false : true,
                fpopupID: this.ecPageID
            });
        }
    },

    // 수신확인
    onDropdownSendHistory: function (e) {
        this.openWindow({
            url: String.format("/ECMAIN/EPZ/EPZ012P_01.aspx?doc_gubun={0}&sub_title={1}", this.usingData.DocGubun, encodeURIComponent(this.receiveFormName)),
            name: ecount.resource.LBL03658,
            param: {
                width: 630,
                height: 700
            },
            fpopupID: this.ecPageID,
            popupType: true,
            additional: false
        });
    },

    //내역팝업 - 문서발송내역팝업
    onFunctionHistoryPopup: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 650,
            Request: {
                IsFromLink: true,
                Data: {},
                NotiProgramId: this.NotiProgramId || this.PROGRAM_ID
            }
        };

        this.openWindow({
            url: "/ECERP/SVC/ECC/ECC006M",
            name: ecount.resource.LBL19690, //문서발송내역
            param: param,
            popupType: false,
            additional: false
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


    //그리드 편집버튼 저장 후 그리드 email, SMS 데이터 변경
    setEditedDataBind: function (data) {
        var dataLength = 0;
        var cust = "";
        var returnGrid = null;
        var custGroup = null;
        var tempKey = "";
        var grid = this.gridObj.grid;

        if ($.isEmpty(data)) {
            return false;
        } else {
            dataLength = data.length;
            cust = data[0].CUST;

            //편집창에서 편집한 거래처에 해당하는 grid만 RECEIVER_KEY 그룹별로 추출
            returnGrid = grid.getRowList().where(function (e) {
                //SER_NO가 없는 ROW는 사용자가 직접 addMerge 이벤트로 추가한 ROW이기 때문에 제외
                if (e.RECEIVER_KEY.split(ecount.delimiter)[0] == cust && $.isEmpty(e.SER_NO) == false) {
                    return true;
                }
            }).groupBy('RECEIVER_KEY');

            //행 추가 관련
            for (var key in returnGrid) { // key equals RECEIVER_KEY value
                var addedRowKeyList = new Array(); //setCell 대상 rowKey
                var setCellRowCount = 0; //편집 data setting한 ROW count
                var addRowCount = data.length - (returnGrid[key].length);
                var addRowIndex = 0;
                var firstRowIndex = 0;
                var itemCount = 0;
                var dataKey = null;

                returnGrid[key].forEach(function (item, index) {
                    if (index == 0) {
                        firstRowIndex = grid.getRowIndexByKey(item[ecount.grid.constValue.keyColumnPropertyName], "EMAIL");
                    }

                    //setCell 대상 rowKey push
                    addedRowKeyList.push(item[ecount.grid.constValue.keyColumnPropertyName]);
                    itemCount++;
                }.bind(this));

                //해당거래처의 저장한 갯수가 그리드의 Row보다 클 경우 MergeRow Add
                if (data.length > returnGrid[key].length) {
                    addRowIndex = firstRowIndex + itemCount + 1; //SER_NO가 있는 (거래처에 등록된 메일) 마지막 index에 +1 위치부터 add
                    grid.addMergeRow(addRowCount, addRowIndex, { addDirection: 'up' });

                    //추가한 row수만큼 RECEIVER_KEY 설정
                    for (var i = 0; i < addRowCount; i++) {
                        dataKey = grid.getRowKeyByIndex((addRowIndex - 1) + i);
                        grid.setCell("RECEIVER_KEY", dataKey, key);
                        addedRowKeyList.push(dataKey); //추가한 row의 key push
                    }
                }

                //각 컬럼 setCell (기존 setCell 대상 row 및 추가한 row에 대한 setCell)
                for (var i = 0; i < addedRowKeyList.length; i++) {
                    //data.length와 addedRowKeyList의 length는 같음
                    var rowKey = addedRowKeyList[i];

                    if (data.length <= i) { // 수신or참조 데이터가 편집에서 사용안함으로 지정된 case (data Array는 SEND_TYPE이 미발송인 데이터는 반환하지 않음)
                        grid.setCell("SEND_TYPE", rowKey, "N");
                        grid.setCell("UNAME", rowKey, "");
                        grid.setCell("EMAIL", rowKey, "");
                        grid.setCell("HP_NO", rowKey, "");
                        //grid.setCell("FAX_NO", rowKey, "");
                        grid.setCell("SER_NO", rowKey, "");
                    } else {
                        grid.setCell("SEND_TYPE", rowKey, data[i].SEND_TYPE);
                        grid.setCell("UNAME", rowKey, data[i].UNAME);
                        grid.setCell("EMAIL", rowKey, data[i].EMAIL);
                        grid.setCell("HP_NO", rowKey, data[i].HP_NO);
                        //grid.setCell("FAX_NO", rowKey, data[i].FAX_NO);
                        grid.setCell("SER_NO", rowKey, data[i].SER_NO);
                    }
                }
            }
        }
    },

    //하단 그리드(수신정보)에 바인딩할 데이터형식으로 변경
    //그리드의 RowData의 갯수는 N개의 거래처의 각각의 거래처메일갯수의 합
    getMailGridData: function () {
        var that = this;
        var emailReceiverInfo = new Array();

        //총 전표수 (거래처 수)만큼 실행
        $.each(this.receiverMailInfo, function (custIndex) {
            var receiverKey = this.SlipInfo.RECEIVER_CD + ecount.delimiter + custIndex;
            this.SlipInfo.RECEIVER_KEY = receiverKey;

            //전표정보 (전표일자, 거래처명, 품목, 금액 - 전표와 1대1 개념인 데이터 처리)               
            emailReceiverInfo.push({
                RECEIVER_CD: that.FORM_TYPE == "SF744" ? "" : this.SlipInfo.RECEIVER_CD,
                RECEIVER_NM: that.FORM_TYPE == "SF744" ? "" : this.SlipInfo.RECEIVER_NM,
                REMARKS: this.SlipInfo.REMARKS,
                IO_DATE: this.SlipInfo.IO_DATE,
                IO_NO: this.SlipInfo.IO_NO,
                IO_DATE_NO: $.isEmpty(this.SlipInfo.IO_DATE) ? "" : ecount.infra.getECDateFormat('DATE10', false, this.SlipInfo.IO_DATE.toDate()).toString().trim() + '-' + this.SlipInfo.IO_NO, //거래명세서 Email은 IO_DATE 제공 안함                
                CUST: this.SlipInfo.CUST,
                CUST_DES: this.SlipInfo.CUST_DES,
                PROD_DES: this.SlipInfo.PROD_DES,
                TOT_AMT: this.SlipInfo.AMT != "0" && this.SlipInfo.TOT_AMT == "0" ? this.SlipInfo.AMT : this.SlipInfo.TOT_AMT,
                AMT: this.SlipInfo.AMT,
                AMT_F: this.SlipInfo.AMT_F,
                IN_DATE: this.SlipInfo.IN_DATE,
                OUT_DATE: this.SlipInfo.OUT_DATE,
                JSYY: this.SlipInfo.JSYY,
                CUST_NAME: this.SlipInfo.CUST_NAME,

                UNAME: null,
                SEND_TYPE: null,
                EMAIL: null,
                HP_NO: null,
                FAX_NO: null,
                ISCHECKSMS: null,
                RECEIVER_USER_ID: "",
                ISCHECKFAX: null,
                SER_NO: null,
                RECEIVER_KEY: receiverKey
            });

            // 각 전표별로 Merge를 위해서 _MERGE_SET 컬럼을 세팅해줘야 함.
            var rowsSpan = this.CustEmailList.length;

            // ROWSPAN_COUNT수신정보 추가입력 가능할때만 해당 거래처에 등록된 수신정보갯수 + 1만큼 세팅
            if (that.usingData.CantAddCustEmail != true)
                rowsSpan++;

            if ($.isEmpty(this.CustEmailList)) {
                //거래처가 입력되지않은 전표의 기본값
                emailReceiverInfo.last().UNAME = ['TH010', 'TH020', 'TH030', 'TH070'].contains(that.FORM_TYPE) ? this.SlipInfo.UNAME : "";
                emailReceiverInfo.last().SEND_TYPE = "T";
                emailReceiverInfo.last().EMAIL = ['TH010', 'TH020', 'TH030', 'TH070'].contains(that.FORM_TYPE) ? this.SlipInfo.EMAIL : "";
                emailReceiverInfo.last().HP_NO = ['TH010', 'TH020', 'TH030', 'TH070'].contains(that.FORM_TYPE) ? this.SlipInfo.HP_NO : "";;
                emailReceiverInfo.last().FAX_NO = "";
                emailReceiverInfo.last().SER_NO = "";
                emailReceiverInfo.last().ISCHECKSMS = false;
                emailReceiverInfo.last().ISCHECKFAX = that.isFaxChecked;
                emailReceiverInfo.last().RECEIVER_USER_ID = "";
                emailReceiverInfo.last().PER_NO = ['TH010', 'TH020', 'TH030', 'TH070'].contains(that.FORM_TYPE) ? this.SlipInfo.PER_NO : "";
                emailReceiverInfo.last().PERSON_GUBUN = ['TH010', 'TH020', 'TH030', 'TH070'].contains(that.FORM_TYPE) ? this.SlipInfo.PERSON_GUBUN : "";
                rowsSpan = that.usingData.CantAddCustEmail != true ? 2 : 1; //거래처가 입력되지 않은 정보는 강제로 rowspan2 지정
            } else {
                //첫번째 데이터는 전표정보의 첫번째 ROW와 같은 ROW의 데이터로 
                emailReceiverInfo.last().UNAME = this.CustEmailList[0].UNAME;
                emailReceiverInfo.last().SEND_TYPE = this.CustEmailList[0].SEND_TYPE;
                emailReceiverInfo.last().EMAIL = this.CustEmailList[0].EMAIL;
                emailReceiverInfo.last().HP_NO = this.CustEmailList[0].HP_NO;
                emailReceiverInfo.last().FAX_NO = this.CustEmailList[0].FAX_NO;
                emailReceiverInfo.last().SER_NO = this.CustEmailList[0].SER_NO;
                emailReceiverInfo.last().ISCHECKSMS = this.CustEmailList[0].ISCHECKSMS;
                emailReceiverInfo.last().ISCHECKFAX = that.isFaxChecked;
                emailReceiverInfo.last().RECEIVER_USER_ID = this.CustEmailList[0].RECEIVER_USER_ID;
            }

            // 머지데이터 기본세팅 설정
            var mergeData = { _ROW_TYPE: "TOTAL", _MERGE_USEOWN: true, _STYLE_USEOWN: true, _ROWSPAN_COUNT: rowsSpan };
            var mergeList = [];

            // 컬럼리스트에서 isRowMerge가 true인 경우 머지
            that.columnList.forEach(function (v, i) {
                if (v.isRowMerge)
                    mergeList.push($.extend({}, mergeData, { _MERGE_START_INDEX: i }));
            });

            emailReceiverInfo.last()._MERGE_SET = mergeList;

            // 편집문구 추가(전표의 첫번째 Row에만)
            if (!$.isEmpty(this.CustEmailList) || this.SlipInfo.RECEIVER_CD)
                emailReceiverInfo.last().EDITOR = ecount.resource.LBL85270;

            //수신정보 (받을대상, 받을메일주소, SMS수신번호 - 전표와 1대N 개념인 데이터 처리)     
            //for문은 거래처가 있는 전표만 실행함
            for (var i = 1; i < this.CustEmailList.length; i++) {
                //두번째 이후의 데이터는 ROWMERGE를 위해 전표정보없이 거래처메일관련정보만 담음 (프로그램에서 기능을 위해 RECEIVER_KEY생성)
                emailReceiverInfo.push({
                    UNAME: this.CustEmailList[i].UNAME,
                    SEND_TYPE: this.CustEmailList[i].SEND_TYPE,
                    EMAIL: this.CustEmailList[i].EMAIL,
                    HP_NO: this.CustEmailList[i].HP_NO,
                    FAX_NO: this.CustEmailList[i].FAX_NO,
                    SER_NO: this.CustEmailList[i].SER_NO,
                    RECEIVER_KEY: receiverKey,
                    ISCHECKSMS: this.CustEmailList[i].ISCHECKSMS,
                    ISCHECKFAX: this.CustEmailList[i].ISCHECKFAX,
                    RECEIVER_USER_ID: this.CustEmailList[i].RECEIVER_USER_ID
                });
            }

            //거래처 수신정보는 무조건 해당거래처의 수신정보 갯수보다 1개의 Row를 더 추가하여 빈값이 들어있는 Row를 보여주게끔 하기위함
            //의미없는 Row를 전표별로 하나씩 추가하여 control.mergeAddRow (+ 표시)를 하나씩 강제로 추가                                    
            if (that.usingData.CantAddCustEmail != true)
                emailReceiverInfo.push({
                    RECEIVER_KEY: receiverKey,
                    controlViewTargetRowYN: "Y",
                    HP_NO: "",
                    FAX_NO: "",
                    EMAIL: ""
                });

            // mergeAddRow controlType 적용 Row 설정
            that.mergeAddRowList.push(emailReceiverInfo.length - 1);
        });

        return emailReceiverInfo;
    },

    //blTransEmailCheck false일 때의 경우와 EmailType이 4, 5인 경우는 배제된 체크로직입니다.
    //거래명세서, 판매조회 기준으로 작성된 체크로직이며 왠만한 체크는 거의 다 하고있으나 특정 메뉴에서의 체크로직은 해당메뉴 개발시 확인해야 할 사항들이 있어 구현하지 않았습니다.
    //실제 해당메뉴 신규프레임웍 적용시 신규프레임웍 기준으로 구프레임로직을 참고하셔서 코딩 바랍니다. - LJM -
    checkValidation: function () {
        self = this;
        // 이메일 유효성 체크 정규식
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // 발신수단 체크여부
        var checked = this.contents.getControl("sendType").getCheckedValue(),
            mailSendYn = checked.contains("SENDTYPE_EMAIL"),
            smsSendYn = checked.contains("SENDTYPE_SMS"),
            faxSendYn = checked.contains("SENDTYPE_FAX");

        // SMS, Fax 발송카운트
        var smsCount = 0, faxCount = 0;

        // 발송 안되는 에러 체크용
        var hasNormalError = false, normalErrorMessage = "", normalErrorRowList = [];

        // 확인 누르면 발송되는 에러 체크용
        var hasConfirmError = false, confirmErrorMessageList = [], confirmErrorRowList = [];

        if (this.DontShowReceiverInfo != true) {
            // validation 체크/에러용 리스트
            var receiverList = this.gridObj.grid.getRowList(), // 전체 validation 체크로직용 리스트
                receiverListByGroup = receiverList.groupBy("RECEIVER_KEY"); // 거래처별 validation 체크로직용 리스트

            // 메일발송 체크시
            if (mailSendYn) {
                // 수신으로 설정된 메일리스트
                var toEmailList = receiverList.where(function (v) { return v.SEND_TYPE == "T"; });
                // 수신으로 설정되었는데 메일이 비어있는 리스트
                var emptyToEmailList = toEmailList.where(function (v) { return $.isEmpty(v.EMAIL); });
                // 수신/참조로 설정되었고 메일이 비어있지 않은데 유효한 메일주소가 아닌 리스트
                var invalidEmailList = receiverList.where(function (v) { return ["T", "C"].contains(v.SEND_TYPE) && !$.isEmpty(v.EMAIL) && !regex.test(v.EMAIL); });

                // 1-1. 수신자가 설정되어있지 않은 경우(미발송) s
                if (toEmailList.length == 0) {
                    // 거래처별로 첫번째 라인 normalErrorRowList에 넣기
                    hasNormalError = true;
                    normalErrorMessage = ecount.resource.MSG06906;//"거래처 중 최소 한 명은 [수신]으로 설정되어야 합니다.\r\n\r\n-->>ecount.alert으로 변경예정";
                    for (var receiverGroup in receiverListByGroup) {
                        if (receiverListByGroup.hasOwnProperty(receiverGroup)) {
                            normalErrorRowList.push({ TYPE: "EMAIL", VALUE: receiverListByGroup[receiverGroup][0][ecount.grid.constValue.keyColumnPropertyName] });
                        }
                    }
                }
                // 1-1. 수신자가 설정되어있지 않은 경우(미발송) e

                // 1-2. 수신으로 선택은 되어있으나, 메일주소란에 메일이 하나도 없는 경우 s             
                if (!hasNormalError && toEmailList.length == emptyToEmailList.length) {
                    // 인증서 첨부 X || 80000번이 아닌경우 조건추가
                    if (this.FORM_TYPE != "ELECTRIC" || this.COM_CODE != "80000") {
                        // 거래처별로 첫번째 라인 normalErrorRowList에 넣기
                        hasNormalError = true;
                        normalErrorMessage = ecount.resource.MSG06906;//"거래처 중 최소 한 명은 [수신]으로 설정되어야 합니다.\r\n\r\n-->>ecount.alert으로 변경예정"
                        for (var receiverGroup in receiverListByGroup) {
                            if (receiverListByGroup.hasOwnProperty(receiverGroup)) {
                                normalErrorRowList.push({ TYPE: "EMAIL", VALUE: receiverListByGroup[receiverGroup][0][ecount.grid.constValue.keyColumnPropertyName] });
                            }
                        }
                    }
                }
                // 1-2. 수신으로 선택은 되어있으나, 메일주소란에 메일이 하나도 없는 경우 e

                // 1-3, 1-5를 한번에 처리
                // 1-3. 수신으로 선택된 라인 중 메일주소가 일부는 비어있는 경우 s
                // 1-5. 이메일 유효한 형식인지 체크 s
                if (emptyToEmailList.length > 0 || invalidEmailList.length > 0) {
                    // 인증서 첨부 X || 80000번이 아닌경우 조건추가
                    if (this.FORM_TYPE != "ELECTRIC" || this.COM_CODE != "80000") {
                        hasConfirmError = true;
                        confirmErrorMessageList.push(ecount.resource.MSG06789); // 유효하지 않은 메일주소가 포함되어 있으며 해당 메일주소는 제외하고 적용됩니다.
                        var tempErrorRowList = [];

                        if (emptyToEmailList.length > 0) {
                            tempErrorRowList = tempErrorRowList.concat(emptyToEmailList)
                        }
                        if (invalidEmailList.length > 0) {
                            tempErrorRowList = tempErrorRowList.concat(invalidEmailList)
                        }

                        confirmErrorRowList.push({ TYPE: "EMAIL_INVAILD", LIST: tempErrorRowList });
                    }
                }
                // 1-3. 수신으로 선택된 라인 중 메일주소가 일부는 비어있는 경우 e
                // 1-5. 이메일 유효한 형식인지 체크 e

                // ex. 이메일만 체크했는데 수신 메일 없는 경우
                if (!smsSendYn && !faxSendYn && toEmailList.length == 0) {
                    if (this.FORM_TYPE != "ELECTRIC" || this.COM_CODE != "80000") {
                        hasNormalError = true;
                        normalErrorMessage = ecount.resource.MSG01488; // 선택된 자료가 없습니다. 자료를 체크한 후 다시 시도 바랍니다.
                    }
                }
            }

            // Fax발송 체크시
            if (faxSendYn) {
                // 체크된 Fax리스트
                var faxList = receiverList.where(function (v) { return v.ISCHECKFAX; });
                // 체크되었는데 Fax수신번호 비어있는 리스트
                var emptyFaxList = faxList.where(function (v) { return v.FAX_NO && $.isEmpty(v.FAX_NO.replaceAll("-", "")); });
                // Fax발송건수
                faxCount = faxList.length - emptyFaxList.length;

                // 팩스 보내는건 있는데 팩스발신번호 없는 경우
                if (faxCount > 0) {
                    var invalid = this.contents.getControl("sendFaxNo", "sendInformation").validate();// this.contents.validate();

                    if (invalid.length > 0) {
                        self.footer.getControl("Send").setAllowClick();
                        return false;
                    }
                }

                // 1-1. 발송수단에 Fax가 체크 되었으나, 수신정보에는 체크값이 하나도 없을 경우 s
                //if (!hasNormalError && faxList.length == 0) {
                //    hasNormalError = true;
                //    normalErrorMessage = "거래처 중 최소 한 명은 Fax수신번호가 설정되어야 합니다.\r\n\r\n-->>ecount.alert으로 변경예정";
                //}
                // 1-1. 발송수단에 Fax가 체크 되었으나, 수신정보에는 체크값이 하나도 없을 경우 e

                // 1-2. 체크된 라인중 수신번호가 일부는 비어있는 경우 s
                if (emptyFaxList.length > 0) {
                    hasConfirmError = true;
                    confirmErrorMessageList.push(ecount.resource.MSG06909); // 유효하지 않은 Fax수신번호가 포함되어 있으며 해당 Fax수신번호는 제외하고 적용됩니다. 계속 진행하시겠습니까?
                    confirmErrorRowList.push({ TYPE: "FAX_NO", LIST: emptyFaxList });
                }
                // 1-2. 체크된 라인중 수신번호가 일부는 비어있는 경우 e

                // ex. 팩스만 체크했는데 팩스 수신번호 없는 경우
                if (!smsSendYn && !mailSendYn && faxCount == 0) {
                    hasNormalError = true;
                    normalErrorMessage = ecount.resource.MSG01488; // 선택된 자료가 없습니다. 자료를 체크한 후 다시 시도 바랍니다.
                }
            }

            // SMS발송 체크시
            if (smsSendYn) {
                // 체크된 SMS리스트
                var smsList = receiverList.where(function (v) { return v.ISCHECKSMS; });
                // 체크되었는데 SMS수신번호 비어있는 리스트
                var emptySmsList = smsList.where(function (v) { return $.isEmpty(v.HP_NO.replaceAll("-", "")); });
                // SMS 발송건수
                smsCount = smsList.length - emptySmsList.length;

                // SMS 발송하는데 SMS발송문구 없는 경우
                if (smsCount > 0) {
                    var invalid = this.contents.getControl("sendSmsComment", "sendInformation").validate();// this.contents.validate();

                    if (invalid.length > 0) {
                        self.footer.getControl("Send").setAllowClick();
                        return false;
                    }
                }
                // 1-1. 발송수단에 SMS가 체크 되었으나, 수신정보에는 체크값이 하나도 없을 경우 s
                //if (!hasNormalError && smsList.length == 0) {
                //    hasNormalError = true;
                //    normalErrorMessage = ecount.resource.MSG06907;//"거래처 중 최소 한 명은 SMS수신번호가 설정되어야 합니다.\r\n\r\n-->>ecount.alert으로 변경예정";
                //}
                // 1-1. 발송수단에 SMS가 체크 되었으나, 수신정보에는 체크값이 하나도 없을 경우 e

                // 1-2. 체크된 라인중 수신번호가 일부는 비어있는 경우 s
                if (emptySmsList.length > 0) {
                    hasConfirmError = true;
                    confirmErrorMessageList.push(ecount.resource.MSG06908); // 유효하지 않은 SMS수신번호가 포함되어 있으며 해당 SMS수신번호는 제외하고 적용됩니다. 계속 진행하시겠습니까?
                    confirmErrorRowList.push({ TYPE: "HP_NO", LIST: emptySmsList });
                }
                // 1-2. 체크된 라인중 수신번호가 일부는 비어있는 경우 e

                // 1-3. SMS 발신번호 인증여부 체크 s
                // 유효하지 않거나 사용할 수 없는 발신번호입니다. 확인 후 다시 시도 바랍니다.
                // finalValidate에서 하고 있음
                // 1-3. SMS 발신번호 인증여부 체크 e

                // ex. SMS만 체크했는데 SMS 수신번호 없는 경우
                if (!faxSendYn && !mailSendYn && smsCount == 0) {
                    hasNormalError = true;
                    normalErrorMessage = ecount.resource.MSG01488; // 선택된 자료가 없습니다. 자료를 체크한 후 다시 시도 바랍니다.
                }
            }

            // 전체 거래처 한번에 체크로 변경
            // 그리드에 테두리 그리기용 실데이터, 경고창에 이메일주소 띄워주기용 데이터
            var duplicatedEmailList = [], duplicatedEmailListForMessage = [],
                duplicatedSmsList = [], duplicatedSmsListForMessage = [];

            // 수신자별(거래처별) 체크로직    
            for (var receiver in receiverListByGroup) {
                // 메일관련 체크로직
                if (mailSendYn) {
                    // 수신/참조 수
                    var toCount = 0, ccCount = 0;
                    // 미발송인 건은 무시
                    var emailList = receiverListByGroup[receiver].where(function (v, i) { return v.SEND_TYPE != "N"; })
                    // 메일주소로 그룹바이
                    var duplicatedEmail = emailList.groupBy("EMAIL");

                    // 1-4. 중복메일 체크 - 수신자별(거래처별) 체크 s
                    for (var duplicated in duplicatedEmail) {
                        // 메일주소별로 for 돌면서 length 1 초과시 중복메일로 체크
                        if (duplicatedEmail[duplicated].length > 1 && !$.isEmpty(duplicated)) {
                            duplicatedEmailListForMessage.push(duplicated); // 경고창에 띄워주려고 이메일주소 넣음
                            duplicatedEmail[duplicated].forEach(function (v, i) { duplicatedEmailList.push(v); }); // 빨간 테두리용 실 데이터
                        }
                    }
                    // 1-4. 중복메일 체크 - 수신자별(거래처별) 체크 e

                    // 참조는 있는데 수신은 없는 경우 s
                    // 아직 그림문서 체크로직에 포함되지는 않았음. 원래 있던 로직이라 우선 추가해 둠
                    emailList.forEach(function (v) { if (v.SEND_TYPE == "T") toCount++; if (v.SEND_TYPE == "C") ccCount++; });

                    if (!hasNormalError && toCount == 0 && ccCount > 0) {
                        // 거래처 중 최소 한 명은 [수신]으로 설정되어야 합니다.
                        hasNormalError = true;
                        normalErrorMessage = ecount.resource.MSG06906;//"!!거래처 중 최소 한 명은 [수신]으로 설정되어야 합니다.\r\n\r\n-->>ecount.alert으로 변경예정";
                    }
                    // 참조는 있는데 수신은 없는 경우 e
                }

                // SMS관련 체크로직
                if (smsSendYn) {
                    // 체크 안 된 건은 무시
                    var smsList = receiverListByGroup[receiver].where(function (v) { return v.ISCHECKSMS; });
                    // 핸드폰번호로 그룹바이
                    var duplicatedSms = smsList.groupBy(function (v) { return v.HP_NO.replaceAll("-", ""); });

                    // 1-4. 중복번호 체크 - 수신자별(거래처별) 체크  s
                    for (var duplicated in duplicatedSms) {
                        // 핸드폰번호로 for 돌면서 length 체크해서 1 초과시 중복번호로 체크
                        if (duplicatedSms[duplicated].length > 1 && !$.isEmpty(duplicated)) {
                            duplicatedSmsListForMessage.push(duplicated); // 경고창에 띄워주려고 핸드폰번호 넣음
                            duplicatedSms[duplicated].forEach(function (v, i) { duplicatedSmsList.push(v); }); // 빨간 테두리용 실 데이터
                        }
                    }
                    // 1-4. 중복번호 체크 - 수신자별(거래처별) 체크  e
                }
            }

            if (!$.isEmpty(duplicatedEmailList)) {
                hasConfirmError = true;
                confirmErrorMessageList.push(String.format(ecount.resource.MSG06311, "Email: " + duplicatedEmailListForMessage.join("\r\n"))); // 중복된 {0}이(가) 있습니다. 사용하겠습니까?
                confirmErrorRowList.push({ TYPE: "EMAIL", LIST: duplicatedEmailList });
            }

            if (!$.isEmpty(duplicatedSmsList)) {
                hasConfirmError = true;
                confirmErrorMessageList.push(String.format(ecount.resource.MSG06311, "H.P: " + duplicatedSmsListForMessage.join("\r\n"))); // 중복된 H.P: {0}이(가) 있습니다. 사용하겠습니까?
                confirmErrorRowList.push({ TYPE: "HP_NO", LIST: duplicatedSmsList });
            }

            //sms만, fax만, sms+fax 경우의 수 체크
            var checkSendEmail = mailSendYn && receiverList.any(function (v) {
                if (self.FORM_TYPE == "ELECTRIC" && self.COM_CODE == "80000")
                    return true;
                else
                    return v.SEND_TYPE == "T" && !$.isEmpty(v.EMAIL);
            }),
                checkSendSms = smsSendYn && receiverList.any(function (v) { return v.ISCHECKSMS && !$.isEmpty(v.HP_NO); }),
                checkSendFax = faxSendYn && receiverList.any(function (v) { return v.ISCHECKFAX && !$.isEmpty(v.FAX_NO); });

            if (!checkSendEmail && !checkSendSms && !checkSendFax) {
                hasNormalError = true;
                normalErrorMessage = ecount.resource.MSG01488; // 선택된 자료가 없습니다. 자료를 체크한 후 다시 시도 바랍니다.
            }

            this.gridObj.grid.removeValidate();

            // 일반 오류 있으면
            if (hasNormalError) {
                ecount.alert(normalErrorMessage, function () {
                    this.footer.getControl("Send").setAllowClick();
                }.bind(this));
                // normalErrorRowList 빨간 테두리 긋기
                if (!$.isEmpty(normalErrorRowList)) {
                    for (var i = 0; i < normalErrorRowList.length; i++) {
                        this.setShowError(normalErrorRowList[i].TYPE, this.gridObj.grid.getRowIndexByKey(normalErrorRowList[i].VALUE, normalErrorRowList[i].TYPE), ""/*item.MSG*/, normalErrorRowList[i].VALUE);
                    }
                }
                return false;
            }

            // 컨펌창 에러 재귀호출용 함수
            var confirmErrorCheck = function (messageList, rowList) {
                // 컨펌에러메세지 중 제일 앞에꺼로 컨펌 띄운다.
                var message = messageList.shift(),
                    row = rowList.shift();

                ecount.confirm(message, function (status) {
                    if (status) {
                        if (row.TYPE == "EMAIL_INVAILD") {
                            row.LIST.forEach(function (obj, index, array) {
                                var key = obj["K-E-Y"];
                                this.gridObj.grid.setCell('SEND_TYPE', key, "N");
                                this.gridObj.grid.setCell('EMAIL', key, "");
                            }.bind(this));

                            this.checkValidation();
                            return false;
                        }

                        // 확인 눌렀는데 컨펌에러메세지 남은거 있으면 다시 호출
                        if (!$.isEmpty(messageList)) {
                            confirmErrorCheck.call(this, messageList, rowList);
                        } else { // 컨펌에러메세지 전부 다 확인 눌렀으면 다음 체크로직 태움
                            this.finalValidate(smsCount, faxCount);
                        }

                        return true;
                    } else {
                        if (row.TYPE == "EMAIL_INVAILD") {
                            row.TYPE = "EMAIL";
                        }

                        for (var i = 0; i < row.LIST.length; i++) {
                            this.setShowError(row.TYPE, this.gridObj.grid.getRowIndexByKey(row.LIST[i][ecount.grid.constValue.keyColumnPropertyName], row.TYPE), ""/*item.MSG*/, row.LIST[i][ecount.grid.constValue.keyColumnPropertyName]);
                        }

                        this.gridObj.grid.setCellFocus(row.LIST[0].TYPE, row.LIST[0][ecount.grid.constValue.keyColumnPropertyName]);
                        this.footer.getControl("Send").setAllowClick();

                        return false;
                    }
                }.bind(this));
            };
        }
        else {
            if (smsSendYn || faxSendYn) {
                smsCount = smsSendYn ? 1 : 0;
                faxCount = faxSendYn ? 1 : 0;
            }
        }

        // 컨펌창 띄우는 에러가 있으면 컨펌창 띄우게..
        if (hasConfirmError) {
            confirmErrorCheck.call(this, confirmErrorMessageList, confirmErrorRowList);
        } else {
            this.finalValidate(smsCount, faxCount);
        }

        ////기존에 emailType이 1인 경우 (ex: SF030) 내자기본, 외자기본이 양식에 있어 이에대한 권한체크 하였으나 내외자기본이 없어진것으로 추정되어 로직구현이 필요없어보임.
        ////cookie에 값을 set하는 구문이 있으나 이 값을 사용하는곳이 파악되지않음 (솔루션에서 발견되지 않음)
        ////Email_ECStatus_회사코드_양식구분_rptgubun 형식의 cookie Key값에 E,C,-E,-C 의 값을 넣고있음. 구현이 필요하진 않은것으로 판단됨
    },

    finalValidate: function (smsCount, faxCount) {
        // amtEmoney 0원 이상 있으면 보낼 수 있도록.. -처리하고 나중에 청구하는것으로 함
        if (smsCount > 0 || faxCount > 0) {
            //SMS 잔액 체크
            if (this.amtEmoney < 0) {
                //현재 잔액이 부족합니다.\n\n충전하겠습니까?                    
                ecount.confirm(ecount.resource.MSG10009, function (status) {
                    if (status) {
                        this.onFunctionSmsChargingPopup();
                        this.footer.getControl("Send").setAllowClick();
                        return false;
                    } else {
                        //ecount.alert(ecount.resource.MSG10007);
                        this.footer.getControl("Send").setAllowClick();
                        return false;
                    }
                }.bind(this));
            }
            else if (smsCount > 0 && faxCount > 0) {
                var sendHp = this.contents.getControl("sendSmsHp", "sendInformation").getValue();

                //발신번호에 대해서 SMS 인증 체크            
                ecount.infra.checkEnableSendSms.apply(this, [sendHp, function (status) {
                    if (status) {
                        this._finalAttachFileSave();
                    } else {
                        this.footer.getControl("Send").setAllowClick();
                        return false;
                    }
                }.bind(this)]);
            }
            else if (smsCount > 0) {
                var sendHp = this.contents.getControl("sendSmsHp", "sendInformation").getValue();

                //발신번호에 대해서 SMS 인증 체크            
                ecount.infra.checkEnableSendSms.apply(this, [sendHp, function (status) {
                    if (status) {
                        this._finalAttachFileSave();
                    } else {
                        this.footer.getControl("Send").setAllowClick();
                        return false;
                    }
                }.bind(this)]);
            }
            else if (faxCount > 0) {
                this._finalAttachFileSave();
            }
        } else {
            this._finalAttachFileSave();
        }
    },

    //메일보내기
    sendData: function (ownerKey) {
        var data = this.getSendMailApiData(ownerKey);

        //전자세금계산서 (분기처리한 이유는 전자세금계산서는 부모창과 값이 서로 유지되는 부분이있어서)
        if (this.FORM_TYPE == "ELECTRIC") { //전자세금계산서의 경우 곧바로 mailAPI를 통해 전송되는게 아니라 부모창으로 데이터를 전송함
            var sendObject = {
                SendMailBasicInfo: data.BasicInfo,
                EmailReceiverInfo: data.ReceiverInfos,
                ValidatePass: true, //전자세금계산서용 (부모창과 값을 유지하기위한)
                isCheckEmail: data.BasicInfo.MAIL_SEND_YN == "Y",
                isCheckSMS: data.BasicInfo.SMS_SEND_YN == "Y",
                isCheckFAX: data.BasicInfo.FAX_SEND_YN == "Y"
            };

            // 여기는 받는쪽때문에 변수명 바꾸면 안됨 s
            sendObject.SendMailBasicInfo.SALES_SLIP_ADD_YN = sendObject.SendMailBasicInfo.CONTENT_SUB_FORM_USE_YN || "N";
            //거래명세서 양식이 없을 때 기본양식 넣어줌
            sendObject.SendMailBasicInfo.SALES_FORM_SEQ = sendObject.SendMailBasicInfo.CONTENT_SUB_FORM_SEQ == 0 ? 0 : sendObject.SendMailBasicInfo.CONTENT_SUB_FORM_SEQ || 999;
            sendObject.SendMailBasicInfo.RECEIVE_FORM_SEQ = sendObject.SendMailBasicInfo.RECEIVE_FORM_SEQ || 999;
            // 여기는 받는쪽때문에 변수명 바꾸면 안됨 e

            this.sendMessage(this, sendObject);
            this.footer.getControl("Send").setAllowClick();
            this.close();
        } else {
            if ((this.FORM_TYPE != "TAX" && this.FORM_TYPE != "ECTAX" && this.FORM_TYPE != "CUSTOMER" && !this.FORM_TYPE.startsWith("GH")) && data.BasicInfo.CONTENT_FORM_SEQ == 0) { // Ecount기본인 경우
                data.BasicInfo.CONTENT_FORM_SEQ = 100;
                data.BasicInfo.IS_FROM_ZA_ONLY = true;
            }
            else {
                data.BasicInfo.IS_FROM_ZA_ONLY = false;
            }

            // 화면 그리는 페이지에 보낼 파라미터 세팅
            var requestData = {
                IsFromMail: true,
            };
            // ECount 기본양식인 경우 내외자 값 distinct
            var foreignFlags = data.BasicInfo.IS_FROM_ZA_ONLY ? data.ReceiverInfos.select(function (v) {
                return v.SlipInfo.FOREIGN_FLAG;
            }).distinct() : ["0"];
            requestData.TradingStatementPrintingYn = this.TradingStatementPrintingYn;
            requestData.TAX_FLAG = this.TAX_FLAG;
            //requestData.popupID = this.popupID;
            //requestData.popupLevel = this.popupLevel;
            if (data.BasicInfo) {
                requestData.FORM_TYPE = data.BasicInfo.CONTENT_FORM_TYPE;
                requestData.FORM_SEQ = this.Nation == "TW" ? "" : data.BasicInfo.CONTENT_FORM_SEQ;
                requestData.IS_FROM_ZA_ONLY = data.BasicInfo.IS_FROM_ZA_ONLY;

                // Invoice포함안함/PackingList포함인 경우 PackingList 양식으로 변경
                if (this.usingData.FormWidgetType == "3" && data.BasicInfo.CONTENT_FORM_USE_YN == "N" && data.BasicInfo.CONTENT_SUB_FORM_USE_YN == "Y") {
                    requestData.FORM_TYPE = data.BasicInfo.CONTENT_SUB_FORM_TYPE;
                    requestData.FORM_SEQ = data.BasicInfo.CONTENT_SUB_FORM_SEQ;
                }
            }


            // 내외자값이 외자만 있는 경우 외자, 아니면 내자
            requestData.BASIC_TYPE = $.isArray(foreignFlags) && foreignFlags.length == 1 && foreignFlags[0] == "1" ? 1 : 0;
            // 거래명세서 페이지에 보낼 전표정보 생성

            _FORM_SEQ = requestData.FORM_SEQ;
            requestData.SlipsInfos = this.createRequestSlipInfo(data.ReceiverInfos);
            requestData.Slips = JSON.parse(requestData.SlipsInfos);

            if (this.TAXPAY_INFO_LIST) {
                requestData.JSYY = this.TAXPAY_INFO_LIST.INPUTTED_YYMM_LIST;
                requestData.EMP_CD = this.TAXPAY_INFO_LIST.EMP_CD_LIST;
                requestData.GUBUN = this.TAXPAY_INFO_LIST.TAX_PAY703_GUBUN;
                requestData.BUSINESS_NO = this.TAXPAY_INFO_LIST.BUSINESS_NO;
                requestData.PRINT_TYPE = "02";
                requestData.IS_EMAIL = "Y";


                if (this.TAXPAY_INFO_LIST.REPORT_YY) {
                    requestData.REPORT_YY = this.TAXPAY_INFO_LIST.REPORT_YY;
                    requestData.REPORT_MM = this.TAXPAY_INFO_LIST.REPORT_MM;
                    requestData.REPORT_DD = this.TAXPAY_INFO_LIST.REPORT_DD;
                }
                //사업자 등록의 경우
                if (this.FORM_TYPE == 'TH010') {
                    requestData.PAY_DATE = this.TAXPAY_INFO_LIST.PAY_DATE_LIST;
                    requestData.PER_NO = this.TAXPAY_INFO_LIST.PER_NO_LIST;
                    requestData.PAY_NO = this.TAXPAY_INFO_LIST.PAY_NO_LIST;
                    requestData.SER_NO = this.TAXPAY_INFO_LIST.SER_NO_LIST;
                    requestData.PHASE_FROM = this.TAXPAY_INFO_LIST.PHASE_FROM;
                    requestData.PHASE_TO = this.TAXPAY_INFO_LIST.PHASE_TO;
                    requestData.BUSINESS_NO = this.TAXPAY_INFO_LIST.BUSINESS_NO;
                    requestData.VIEW_TYPE = this.TAXPAY_INFO_LIST.VIEW_TYPE;
                    requestData.PayYear = this.TAXPAY_INFO_LIST.PayYear;
                    requestData.SubYear = this.TAXPAY_INFO_LIST.REPORT_YY;
                    requestData.SubMonth = this.TAXPAY_INFO_LIST.REPORT_MM;
                    requestData.SubDay = this.TAXPAY_INFO_LIST.REPORT_DD;
                    requestData.RptType = this.TAXPAY_INFO_LIST.RptType;


                } else if (this.FORM_TYPE == 'TH020') {
                    requestData.PAY_DATE = this.TAXPAY_INFO_LIST.PAY_DATE;
                    requestData.PER_NO = this.TAXPAY_INFO_LIST.PER_NO_LIST;
                    requestData.PAY_YYMM = this.TAXPAY_INFO_LIST.PAY_YYMM;
                    requestData.PHASE_FROM = this.TAXPAY_INFO_LIST.PHASE_FROM;
                    requestData.PHASE_TO = this.TAXPAY_INFO_LIST.PHASE_TO;
                    requestData.BUSINESS_NO = this.TAXPAY_INFO_LIST.BUSINESS_NO;
                    requestData.IO_GUBUN = this.TAXPAY_INFO_LIST.IO_GUBUN;
                    requestData.VIEW_TYPE = this.TAXPAY_INFO_LIST.VIEW_TYPE;

                    requestData.PayYear = this.TAXPAY_INFO_LIST.PayYear;
                    requestData.SubYear = this.TAXPAY_INFO_LIST.REPORT_YY;
                    requestData.SubMonth = this.TAXPAY_INFO_LIST.REPORT_MM;
                    requestData.SubDay = this.TAXPAY_INFO_LIST.REPORT_DD;
                    requestData.RptType = this.TAXPAY_INFO_LIST.RptType;
                } else if (this.FORM_TYPE == 'TH030' || this.FORM_TYPE == 'TH070') {
                    requestData.PAY_DATE = this.TAXPAY_INFO_LIST.PAY_DATE_LIST;
                    requestData.PER_NO = this.TAXPAY_INFO_LIST.PER_NO_LIST;
                    requestData.PAY_NO = this.TAXPAY_INFO_LIST.PAY_NO_LIST;
                    requestData.SER_NO = this.TAXPAY_INFO_LIST.SER_NO_LIST;

                    requestData.PHASE_FROM = this.TAXPAY_INFO_LIST.PHASE_FROM;
                    requestData.PHASE_TO = this.TAXPAY_INFO_LIST.PHASE_TO;
                    requestData.BUSINESS_NO = this.TAXPAY_INFO_LIST.BUSINESS_NO;
                    requestData.VIEW_TYPE = this.TAXPAY_INFO_LIST.VIEW_TYPE;
                    requestData.INCOME_TYPE = this.TAXPAY_INFO_LIST.INCOME_TYPE_LIST;

                    requestData.PayYear = this.TAXPAY_INFO_LIST.PayYear;
                    requestData.SubYear = this.TAXPAY_INFO_LIST.REPORT_YY;
                    requestData.SubMonth = this.TAXPAY_INFO_LIST.REPORT_MM;
                    requestData.SubDay = this.TAXPAY_INFO_LIST.REPORT_DD;
                    requestData.IO_GUBUN = this.TAXPAY_INFO_LIST.IO_GUBUN;
                    requestData.RptType = this.TAXPAY_INFO_LIST.RptType;

                }

            }
            // 조회 시작일자 - 거래명세서 인쇄리스트에서 선택인쇄시 사용
            if (this.FROM_DATE) {
                requestData.FROM_DATE = this.FROM_DATE;
            }

            // 조회 종료일자 - 거래명세서 인쇄리스트에서 선택인쇄시 사용
            if (this.TO_DATE) {
                requestData.TO_DATE = this.TO_DATE;
            }

            // 추가 항목 1~6 검색 여부
            for (var i = 1; i <= 6; i++)
                requestData["P_DES" + i.toString()] = this["P_DES" + i.toString()] || "";

            // 거래명세서 인쇄리스트에서 인쇄 => 검색조건창에서 미수금집계 체크여부 (미수금체크시 전후잔 조회)
            if (this.IsBill)
                requestData.IsBill = true;

            if (this.FORM_TYPE == "CUSTOMER") {
                var _formSer = this.FORM_SEQ;
                var outGoin = this.contents.getControl("outgoingTemplate");
                if (outGoin) {
                    _formSer = this.contents.getControl("outgoingTemplate").get(0).getValue();
                }

                requestData.__ecPage__ = encodeURIComponent(Object.toJSON({
                    formdata: JSON.parse(this.HeaderSearch)
                }));
                requestData.IsHeaderSearch = 'N';
                requestData.BalanceCheckYn = 'N';
                requestData.isGridRenderAfterPrint = true;
                requestData.IsOpenPopup2 = "Y";
                requestData.IsSelfOpenPopup = 'N';
                requestData.RptConfirm = "0";
                requestData.CUST = $.isEmpty(data.ReceiverInfos[0].SlipInfo.RECEIVER_CD) ? "" : data.ReceiverInfos[0].SlipInfo.RECEIVER_CD;
                requestData.CUST_DES = $.isEmpty(data.ReceiverInfos[0].SlipInfo.RECEIVER_NM) ? "" : data.ReceiverInfos[0].SlipInfo.RECEIVER_NM;
                requestData.FormSer = _formSer;
                requestData.isTopDisplyNone = true;
                requestData.CUST_SEARCH = this.CUST_SEARCH;
                requestData.Gubun1 = this.BOND_DEBIT_TYPE;
                requestData.MAIN_CUST_CONVERT_YN = this.MAIN_CUST_CONVERT_YN;
                requestData.MAIN_CUST_CONVERT_ALL_YN = this.MAIN_CUST_CONVERT_ALL_YN;
                requestData.RPT_GUBUN = this.RPT_GUBUN;

                data.BasicInfo.TradingStatementPrintingYn = "Y";
            }

            if (this.FORM_TYPE == "TAX" || this.FORM_TYPE == "ECTAX") {
                requestData.SIGN_PRINT_YN = this.SIGN_PRINT_YN != null ? this.SIGN_PRINT_YN : ecount.config.company.SIGN_PRINT_YN;
                requestData.DATE_PRINT_YN = this.DATE_PRINT_YN != null ? this.DATE_PRINT_YN : ecount.config.company.DATE_PRINT_YN;
                requestData.SER_NO_PRINT_YN = this.SER_NO_PRINT_YN != null ? this.SER_NO_PRINT_YN : ecount.config.company.SER_NO_PRINT_YN;
                requestData.SUPPLIER_PRINT_YN = "N";
                requestData.PURCHASER_PRINT_YN = "Y";
                requestData.SIGN_TYPE = this.SIGN_TYPE != null ? this.SIGN_TYPE : ecount.config.company.SIGN_TYPE;
                requestData.SHEET_TF = this.SHEET_TF != null ? this.SHEET_TF : ecount.config.company.SHEET_TF;

                if (this.FORM_TYPE == "ECTAX") {
                    requestData.IsEtax = true;
                }
            }

            var url = this.usingData.ContentsUrl;

            if (this.FORM_TYPE.startsWith("TH"))
                url = String.format(url, this.TAXPAY_INFO_LIST.INPUTTED_YYMM_LIST);

            var subUrl = this.usingData.ContentsSubUrl;
            var pageFormInfo = {
                printPageSet: {
                    paperSize: "A4"
                }
            };
            var printPageSet = pageFormInfo.printPageSet;

            this.showProgressbar(null, null, 0);

            if (!this.FORM_TYPE.startsWith("GH") && !this.FORM_TYPE.startsWith("CU")) {
                //보내기 (MailAPI 호출)
                this.loadHiddenPage({
                    url: url,
                    data: requestData,
                    keepAlive: true,
                    destroyImmediately: false,
                    callback: function (page) {
                        // 테이블 묶음 구분을 위해 그리드 데이터 가져옴
                        if (this.FORM_TYPE.startsWith("TH")) {
                            // 세무
                            var pageList = page.contents.$el.find("div[groupid]");
                            printPageSet = {
                                paperSize: "A4",
                                topMargin: "13",
                                bottomMargin: "5.3",
                                leftMargin: "4.2",
                                rightMargin: "4.6",
                                printWay: "P"
                            };
                            $.extend(printPageSet, page.printPageSet);
                            if (this.FORM_TYPE == "TH010" || this.FORM_TYPE == "TH020" || this.FORM_TYPE == "TH030" || this.FORM_TYPE == "TH060" || this.FORM_TYPE == "TH070") {
                                for (var j = 0; j < pageList.length; j++) {
                                    for (var i = 0, lng = data.ReceiverInfos.length; i < lng; i++) {
                                        var groupid = pageList.eq(j).attr("groupid");
                                        var key = ["TH010", "TH020", "TH030", "TH070"].contains(this.FORM_TYPE) ? pageList.eq(j).attr("groupid").split("§")[0].trim().replace("-", "") : pageList.eq(j).attr("groupid").split("§")[0].trim();

                                        if (key == data.ReceiverInfos[i].SlipInfo.PER_NO || key == data.ReceiverInfos[i].SlipInfo.RECEIVER_CD) {

                                            data.ReceiverInfos[i].SlipInfo.RECEIVER_CD = groupid.split("§")[0].trim();
                                            data.ReceiverInfos[i].SlipInfo.RECEIVER_NM = data.ReceiverInfos[i].SlipInfo.UNAME;

                                            data.ReceiverInfos[i].SlipInfo.REMARKS = data.ReceiverInfos[i].SlipInfo.RECEIVER_CD + "<br>" + data.ReceiverInfos[i].SlipInfo.UNAME;
                                            data.ReceiverInfos[i].SlipInfo.GROUP_ID = groupid;
                                            data.ReceiverInfos[i].SlipInfo.PASSWORD_CHECK = "Y";
                                            //패스워드 설정
                                            if (data.ReceiverInfos[i].SlipInfo.PERSON_GUBUN == "1" && pageList.eq(j).attr("data-password").split("§")[1] != "2") {
                                                data.ReceiverInfos[i].SlipInfo.PASSWORD = pageList.eq(j).attr("data-password").split("§")[0].trim();

                                            } else {
                                                if (pageList.eq(j).attr("data-password").split("§")[1] == "2") {
                                                    data.ReceiverInfos[i].SlipInfo.PASSWORD = pageList.eq(j).attr("data-password").split("§")[2];
                                                } else {
                                                    data.ReceiverInfos[i].SlipInfo.PASSWORD = groupid.split("§")[0].trim();
                                                }

                                            }

                                            data.ReceiverInfos[i].SlipInfo.IO_GUBUN = pageList.eq(j).attr("data-password").split("§")[1].trim();
                                            data.ReceiverInfos[i].SlipInfo.MAIL_INNER_HTML =
                                                pageList.eq(j).clone().wrapAll("<div><div style=\"width:650px;\" class=\"print-centered\"></div></div>").parent().parent().html();
                                        }
                                    }
                                }

                            } else {
                                for (var i = 0, lng = pageList.length; i < lng; i++) {
                                    for (var j = 0, lng = data.ReceiverInfos.length; j < lng; j++) {
                                        var groupid = pageList.eq(i).attr("groupid"),
                                            empCd = data.ReceiverInfos[j].SlipInfo.RECEIVER_CD + " § _";

                                        if (groupid == empCd) {
                                            // 익스에서 메일발송할경우, 수신문서 인쇄시 쌍따옴표로 인한 도장 미출력 오류수정
                                            var regextax = /url\(\s*(\")[^\"]+(\")/;

                                            //원본
                                            var str = pageList.eq(i).clone().wrapAll("<div><div style=\"width:675px;\" class=\"print-centered\"></div></div>").parent().parent().html();

                                            if (str.match(regextax) != null) {  //쌍따옴표 붙는경우(익스)
                                                //url 쌍따옴표제거된버전
                                                var matchRegex = str.match(regextax)[0];

                                                //쌍따옴표
                                                var matchSub = str.match(regextax)[1];

                                                var replaceMatch = matchRegex.replaceAll(matchSub, "");

                                                //최종결과
                                                var result = str.replace(matchRegex, replaceMatch);
                                            }
                                            else {
                                                //쌍따옴표 안 붙는경우(크롬)
                                                var result = str;
                                            }

                                            data.ReceiverInfos[j].SlipInfo.MAIL_INNER_HTML = result;
                                            data.ReceiverInfos[j].SlipInfo.GROUP_ID = groupid;
                                            //data.ReceiverInfos[j].SlipInfo.GRID_WIDTH = 675;
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                        else if (this.FORM_TYPE.startsWith("GH")) {
                            page.contents.$el.find("")
                            // 그룹웨어
                        }
                        else {
                            var rowList = page.contents.getGrid().grid.getRowList();
                            var baseIdList = this.getBaseIdList(rowList, data, requestData); // 그리드 getHTMLByGrid에 보내줄 정보

                            // mail 내용 받아오기
                            var gridHtmlList = page.contents.getGrid().grid.getHTMLByGrid(true, baseIdList);
                            var gridHtmlListDup = data.BasicInfo.FAX_SEND_YN == "Y" ? page.contents.getGrid().grid.getHTMLByGrid(false, baseIdList) : {
                            };
                            var gridWidth = page.contents.getGrid().grid.getMaxWidthForPrint();
                            printPageSet = (page.pageFormInfo || pageFormInfo).printPageSet;
                            this.setMailBodyByForeignFlag(requestData, gridHtmlList, gridHtmlListDup, data, {
                                gridWidth: gridWidth,
                                SlipFormAllowList: page.SlipFormAllowList
                            });
                        }

                        if (this.usingData.FormWidgetType == "2" && data.BasicInfo.CONTENT_SUB_FORM_USE_YN == "Y") {
                            // A/S접수인 경우 상세 붙인다
                            var gridHtmlList2 = {}, gridHtmlList2Dup = {}, baseIdListArray = [];

                            var loadDetailPage = function (groupId, paramData, currentIndex, lastIndex, gridHtml, gridHtmlDup) {
                                var detailParam = {
                                    AS_DATE: paramData[currentIndex].IO_DATE, AS_NO: paramData[currentIndex].IO_NO
                                };

                                this.loadHiddenPage({
                                    url: subUrl,
                                    data: detailParam,
                                    keepAlive: true,
                                    destroyImmediately: false,
                                    callback: function (page2) {
                                        gridHtml[groupId[currentIndex]] = page2.contents.getGrid().grid.getHTMLByGrid(true)[0];
                                        gridHtmlDup[groupId[currentIndex]] = data.BasicInfo.FAX_SEND_YN == "Y" ? page2.contents.getGrid().grid.getHTMLByGrid(false)[0] : "";

                                        currentIndex++;

                                        if (currentIndex < lastIndex)
                                            loadDetailPage(baseIdListArray, paramData, currentIndex, lastIndex, gridHtml, gridHtmlDup);
                                        else {
                                            var gridWidth = page2.contents.getGrid().grid.getMaxWidthForPrint();
                                            printPageSet = (page2.pageFormInfo || pageFormInfo).printPageSet;
                                            this.setMailBodyByForeignFlag(requestData, gridHtml, gridHtmlDup, data, {
                                                addContents: true, gridWidth: gridWidth
                                            });
                                            this.saveMail(data, {
                                                printPageSet: printPageSet
                                            });
                                        }
                                    }.bind(this)
                                });
                            }.bind(this);

                            for (var groupId in baseIdList)
                                baseIdListArray.push(groupId);

                            var slipInfoJson = JSON.parse(requestData.SlipsInfos);

                            loadDetailPage(baseIdListArray, slipInfoJson, 0, slipInfoJson.length, gridHtmlList2, gridHtmlList2Dup);
                        }
                        else if ((this.usingData.FormWidgetType == "3") && data.BasicInfo.CONTENT_FORM_USE_YN == "Y" && data.BasicInfo.CONTENT_SUB_FORM_USE_YN == "Y") {
                            // Invoice/Packing List인 경우 한세트 더 만든다
                            requestData.FORM_TYPE = data.BasicInfo.CONTENT_SUB_FORM_TYPE;
                            requestData.FORM_SEQ = data.BasicInfo.CONTENT_SUB_FORM_SEQ;



                            this.loadHiddenPage({
                                url: subUrl,
                                data: requestData,
                                keepAlive: true,
                                destroyImmediately: false,
                                callback: function (page2) {
                                    var gridHtmlList2 = page2.contents.getGrid().grid.getHTMLByGrid(true, baseIdList);
                                    var gridHtmlList2Dup = data.BasicInfo.FAX_SEND_YN == "Y" ? page2.contents.getGrid().grid.getHTMLByGrid(false, baseIdList) : {
                                    };
                                    var gridWidth = page2.contents.getGrid().grid.getMaxWidthForPrint();
                                    printPageSet = (page2.pageFormInfo || pageFormInfo).printPageSet;
                                    this.setMailBodyByForeignFlag(requestData, gridHtmlList2, gridHtmlList2Dup, data, {
                                        duplicate: true, gridWidth: gridWidth
                                    });
                                    this.saveMail(data, {
                                        printPageSet: printPageSet
                                    });
                                }.bind(this)
                            });
                        }
                        else if ((this.FORM_TYPE == "TAX" || this.FORM_TYPE == "ECTAX") && data.BasicInfo.CONTENT_FORM_USE_YN == "Y" && data.BasicInfo.CONTENT_SUB_FORM_USE_YN == "Y") {

                            var _saleData = [];
                            var objthis = this;

                            requestData.FORM_TYPE = data.BasicInfo.CONTENT_SUB_FORM_TYPE;
                            requestData.FORM_SEQ = data.BasicInfo.CONTENT_SUB_FORM_SEQ;
                            var _cnt = objthis.Slips.length;
                            var _baseIdList = {
                            };
                            var _ioDataList = {
                            };

                            $.each(objthis.Slips, function (i, row) {
                                var _trxData = objthis.TrxDataInfos.where(function (item, i) {
                                    return (item.IO_DATE == row.IO_DATE && item.IO_NO == row.IO_NO)
                                });


                                $.each(_trxData, function (j, row2) {
                                    ecount.common.api({
                                        url: '/Account/Common/GetSellDetail',
                                        async: false,
                                        data: Object.toJSON({
                                            TRX_DATE: row2.TRX_DATE,
                                            TRX_NO: row2.TRX_NO
                                        }),
                                        error: function (e) {
                                            //ecount.alert('연결 된 재고전표 호출 시 Error');
                                        }.bind(this),
                                        success: function (result) {
                                            var _cust = "";
                                            if (result != null) {

                                                $.each(result.Data, function (j, ioData) {
                                                    _saleData.push({
                                                        IO_DATE: ioData.IO_DATE,
                                                        IO_NO: ioData.IO_NO,
                                                        SER_NO: ioData.SER_NO,
                                                        IO_TYPE: ioData.IO_TYPE,
                                                        GB_TYPE: ioData.GB_TYPE,
                                                        TRX_DATE: row2.TRX_DATE,
                                                        TRX_NO: row2.TRX_NO,
                                                        CUST: ""
                                                    });


                                                    _baseIdList[String.format("{0}§{1}§", row2.TRX_DATE, row2.TRX_NO)] = [];

                                                    _baseIdList[String.format("{0}§{1}§", row2.TRX_DATE, row2.TRX_NO)].push(String.format("{0}§{1}", row2.TRX_DATE, row2.TRX_NO));

                                                });


                                            }
                                        }.bind(this),
                                    });

                                });
                            });
                            
                            requestData.Slips = _saleData;
                            requestData.SlipsInfos = Object.toJSON(_saleData);
                            requestData.IS_FROM_ZA_ONLY = requestData.FORM_SEQ == 0 ? true : false;
                            requestData.IS_ONE_PRINT = true;
                            requestData.SET_PAGE_HALF_LINE = false;
                            requestData.TradingStatementPrintingYn = "Y";
                            //requestData.TradingStatementPrintingYn = objthis.TradingStatementPrintingYn;
                            requestData.TradingStatementEmailYn = "Y";
                            requestData.fax_Flag = "N";
                            requestData.CS_FLAG = "N";
                            requestData.TAX_FLAG = "Y";
                            requestData.IsBill = false;

                            this.loadHiddenPage({
                                url: subUrl,
                                data: requestData,
                                keepAlive: true,
                                destroyImmediately: false,
                                callback: function (page2) {
                                    //그리드 생성
                                    this.createAllGrid(page2, function () {
                                        var gridHtmlList2 = page2.getHtmlByGrid ? page2.getHtmlByGrid(true, _baseIdList) : page2.contents.getGrid().grid.getHTMLByGrid(true, _baseIdList);

                                        printPageSet = (page2.pageFormInfo || pageFormInfo).printPageSet;
                                        var _trxData = "";
                                        var gridWidth = page2.getMaxWidthForPrint && page2.getMaxWidthForPrint(_baseIdList);
                                        for (var html in gridHtmlList2) {
                                            if (gridHtmlList2.hasOwnProperty(html)) {
                                                $.each(objthis.TrxDataInfos, function (j, item) {
                                                    _trxData = String.format("{0}§{1}§", item.TRX_DATE, item.TRX_NO);
                                                    if (html == _trxData) {
                                                        if (objthis.printAlign != null) {
                                                            if (objthis.printAlign == "R") {
                                                                gridHtmlList2[html] = gridHtmlList2[html].replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-right\"");
                                                            } else if (objthis.printAlign == "L") {
                                                                gridHtmlList2[html] = gridHtmlList2[html].replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-left\"");
                                                            } else if (objthis.printAlign == "C") {
                                                                gridHtmlList2[html] = gridHtmlList2[html].replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-centered\"");
                                                            }
                                                        };
                                                        if (gridHtmlList2[html] != null)
                                                            gridHtmlList2[html] = gridHtmlList2[html].replace(/class=\"css_Indications\"/gi, "class='invisible'");
                                                        if (data.BasicInfo.CONTENT_SUB_FORM_TYPE == "SF030") {  // 거래명세서
                                                            data.ReceiverInfos[j].SlipInfo.MAIL_INNER_HTML += "<div class=\"page-break\"/>";
                                                        }
                                                        data.ReceiverInfos[j].SlipInfo.MAIL_INNER_HTML += gridHtmlList2[html];

                                                        //그리드 너비
                                                        if (gridWidth && gridWidth[html]) {
                                                            data.ReceiverInfos[j].SlipInfo.GRID_WIDTH = gridWidth[html];
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                        this.saveMail(data, {
                                            printPageSet: printPageSet
                                        });
                                    }.bind(this));
                                }.bind(this)
                            });
                        }
                        else {
                            // 내외자 섞여있는 경우 외자용으로 다시 부른다 (ECOUNT기본양식을 선택한 경우)
                            if (requestData.IS_FROM_ZA_ONLY && foreignFlags.length > 1) {
                                requestData.BASIC_TYPE = 1;

                                //보내기 (MailAPI 호출)
                                this.loadHiddenPage({
                                    url: url,
                                    data: requestData,
                                    keepAlive: true,
                                    destroyImmediately: false,
                                    callback: function (page2) {
                                        var gridHtmlList2 = page2.contents.getGrid().grid.getHTMLByGrid(true, baseIdList);
                                        var gridHtmlList2Dup = data.BasicInfo.FAX_SEND_YN == "Y" ? page2.contents.getGrid().grid.getHTMLByGrid(false, baseIdList) : {
                                        };
                                        var gridWidth = page2.contents.getGrid().grid.getMaxWidthForPrint();
                                        printPageSet = (page2.pageFormInfo || pageFormInfo).printPageSet;
                                        this.setMailBodyByForeignFlag(requestData, gridHtmlList2, gridHtmlList2Dup, data, {
                                            gridWidth: gridWidth
                                        });
                                        this.saveMail(data, {
                                            printPageSet: printPageSet
                                        });
                                    }.bind(this)
                                });
                            }
                            else {
                                this.saveMail(data, {
                                    printPageSet: printPageSet
                                });
                            }
                        }

                    }.bind(this)
                });

            }
            else if (this.FORM_TYPE.startsWith("CU")) {
                // 거래처 관리 대장 다중 거래처 발송시 예외 처리 함
                //보내기 (MailAPI 호출)

                //TODO 그리드, 타이틀바 직접 dom 접근 하는것 제거 할것 dknam
                var pageGridData = "";
                if (requestData.FormSer != "99999") {
                    url = "/ECERP/EBZ/EBZ056R";
                    pageGridData = "[data-gid=grid-EBZ056R]";
                }
                else {
                    url = "/ECERP/EBZ/EBZ029R";
                    pageGridData = "#titleContents";
                }

                this.loadHiddenPage({
                    url: url,
                    data: requestData,
                    keepAlive: true,
                    destroyImmediately: false,
                    callback: function (page) {

                        // 거래처 관리 대장 
                        var contentsList = "";

                        var RECEIVER_NM = $.isEmpty(data.ReceiverInfos[0].SlipInfo.RECEIVER_NM) ? "" : data.ReceiverInfos[0].SlipInfo.RECEIVER_NM;
                        var RECEIVER_CD = $.isEmpty(data.ReceiverInfos[0].SlipInfo.RECEIVER_CD) ? "" : data.ReceiverInfos[0].SlipInfo.RECEIVER_CD;

                        var GroupID = RECEIVER_NM + "§" + RECEIVER_CD + "§";
                        printPageSet = page.printPageSet;

                        if (requestData.FormSer != "99999") {
                            //contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find(pageGridData)[0].outerHTML + "</div>";
                            if (ecount.config.inventory.TOP_ICLS_SEND_TF) {
                                contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find("#titleContents")[0].outerHTML + page.$el.find(pageGridData)[0].outerHTML + "</div>";
                            } else {
                                contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find(pageGridData)[0].outerHTML + "</div>";
                            }
                        }
                        else {
                            //contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML + "</div>";
                            if (ecount.config.inventory.TOP_ICLS_SEND_TF) {
                                contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#gridTop-EBZ029R")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML + "</div>";
                            } else {
                                contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML + "</div>";
                            }
                        }
                        if ($.isEmpty(RECEIVER_NM)) {
                            data.ReceiverInfos[0].SlipInfo.RECEIVER_NM = "";
                        }
                        if ($.isEmpty(RECEIVER_CD)) {
                            data.ReceiverInfos[0].SlipInfo.RECEIVER_CD = "";
                        }


                        contentsList = "<style type=\"text/css\"> .table-clone-top {display: none;} </style>" + contentsList;

                        data.ReceiverInfos[0].SlipInfo.MAIL_INNER_HTML = contentsList;
                        data.ReceiverInfos[0].SlipInfo.GROUP_ID = GroupID;
                        data.ReceiverInfos[0].SlipInfo.IO_DATE2 = this.FROM_DATE;
                        data.ReceiverInfos[0].SlipInfo.IO_DATE3 = this.TO_DATE;

                        var gridWidth = page.contents.getGrid().grid.getMaxWidthForPrint();
                        contentsList = contentsList.replace(/&quot;/g, "");
                        data.ReceiverInfos[0].SlipInfo.FAX_INNER_HTML = contentsList;
                        data.ReceiverInfos[0].SlipInfo.GRID_WIDTH = gridWidth;
                        //printPageSet = (page.pageFormInfo || pageFormInfo).printPageSet;

                        if (data.ReceiverInfos.length > 1) {
                            // ===========================================================
                            // 첫번 째. 받는사람과 실제 본문받는사람 키값이 다를 경우 0번부터 다시.
                            // ===========================================================
                            if (!$.isEmpty(requestData.CUST) && requestData.CUST != page.CUST) {
                                this.getCustmerHtml(url, requestData, 0, data, printPageSet, pageGridData, pageFormInfo); // 7개
                            }
                            else {
                                this.getCustmerHtml(url, requestData, 1, data, printPageSet, pageGridData, pageFormInfo); // 7개
                            }
                        }
                        else {
                            this.saveMail(data, {
                                printPageSet: printPageSet
                            });
                        }

                    }.bind(this)
                });
            }
            else {
                this.saveMail(data, {
                    printPageSet: printPageSet
                });
            }
        }
    },


    // 청구서 거래명세서 포함반복 호출
    // 6개
    getCustmerHtml: function (url, requestData, ii, data, printPageSet, pageFormInfo) {
        requestData.CUST = data.ReceiverInfos[ii].SlipInfo.RECEIVER_CD;
        requestData.CUST_DES = data.ReceiverInfos[ii].SlipInfo.RECEIVER_NM;

        this.loadHiddenPage({
            url: url,
            data: requestData,
            keepAlive: false,
            destroyImmediately: false,
            callback: function (page) {

                var html = "";
                if (requestData.FormSer != "99999") {
                    html = page.$el.find(pageGridData)[0].outerHTML;
                    //contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find(pageGridData)[0].outerHTML + "</div>";
                }
                else {
                    //html = page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML;
                    if (ecount.config.inventory.TOP_ICLS_SEND_TF) {
                        html = page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#gridTop-EBZ029R")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML;
                    } else {
                        html = page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML;
                    }
                }

                //var html = page.$el.find(pageGridData)[0].outerHTML;
                this.setCustmerHtml(html, ii, data, printPageSet, page, pageFormInfo);

                ii = ii + 1;
                if (ii < data.ReceiverInfos.length) {
                    this.getCustmerHtml(url, requestData, ii, data, printPageSet, pageGridData, pageFormInfo);
                }
            }.bind(this)
        });
    },

    // 거래처 관리 대장 반복 호출 후 값이 다 채워지면 메일 보내기
    setCustmerHtml: function (html, ii, data, printPageSet, page, pageFormInfo) {
        var receiverRowData = data.ReceiverInfos[ii];
        // ===========================================================
        // 받는사람과 실제 본문 조회한 받는사람 키값이 다를 경우.
        // ===========================================================
        if (!$.isEmpty(receiverRowData.SlipInfo.RECEIVER_CD)) {
            if (receiverRowData.SlipInfo.RECEIVER_CD != page.CUST) {
                data.ReceiverInfos.forEach(function (obj, i) {
                    obj.CustEmailList.forEach(function (obj2) {
                        if (obj2.RECEIVER_CD === page.CUST) {
                            receiverRowData = obj;
                            return;
                        }
                    });
                });
            }
        }

        var RECEIVER_NM = $.isEmpty(receiverRowData.SlipInfo.RECEIVER_NM) ? "" : receiverRowData.SlipInfo.RECEIVER_NM;
        var RECEIVER_CD = $.isEmpty(receiverRowData.SlipInfo.RECEIVER_CD) ? "" : receiverRowData.SlipInfo.RECEIVER_CD;
        var GroupID = RECEIVER_NM + "§" + RECEIVER_CD + "§";

        if ($.isEmpty(RECEIVER_NM)) {
            data.ReceiverInfos[0].SlipInfo.RECEIVER_NM = "";
        }
        if ($.isEmpty(RECEIVER_CD)) {
            data.ReceiverInfos[0].SlipInfo.RECEIVER_CD = "";
        }

        receiverRowData.SlipInfo.MAIL_INNER_HTML = "<div groupid='" + GroupID + "'>" + html + "</div>";
        receiverRowData.SlipInfo.GROUP_ID = GroupID;
        receiverRowData.SlipInfo.IO_DATE2 = this.FROM_DATE;
        receiverRowData.SlipInfo.IO_DATE3 = this.TO_DATE;


        var gridWidth = page.contents.getGrid().grid.getMaxWidthForPrint();
        receiverRowData.SlipInfo.FAX_INNER_HTML = "<div groupid='" + GroupID + "'>" + html + "</div>";
        receiverRowData.SlipInfo.GRID_WIDTH = gridWidth;
        printPageSet = (page.pageFormInfo || pageFormInfo).printPageSet;

        var flag = true;
        for (var k = 0; k < data.ReceiverInfos.length; k++) {
            if ($.isEmpty(data.ReceiverInfos[k].SlipInfo.MAIL_INNER_HTML)) {
                flag = false;
                break;
            }
        }

        if (flag == true) {
            this.saveMail(data, { printPageSet: printPageSet });
        }
    },

    // 거래처 관리 대장 반복 호출
    // 다중건일 때 조회호출 (7개)
    getCustmerHtml: function (url, requestData, ii, data, printPageSet, pageGridData, pageFormInfo) {
        requestData.CUST = data.ReceiverInfos[ii].SlipInfo.RECEIVER_CD;
        requestData.CUST_DES = data.ReceiverInfos[ii].SlipInfo.RECEIVER_NM;

        this.loadHiddenPage({
            url: url,
            data: requestData,
            keepAlive: false,
            destroyImmediately: false,
            callback: function (page) {
                var html = "";
                if (requestData.FormSer != "99999") {
                    html = page.$el.find(pageGridData)[0].outerHTML;
                    //contentsList = "<div groupid='" + GroupID + "'>" + page.$el.find(pageGridData)[0].outerHTML + "</div>";
                }
                else {
                    //html = page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML;
                    if (ecount.config.inventory.TOP_ICLS_SEND_TF) {
                        html = page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#gridTop-EBZ029R")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML;
                    } else {
                        html = page.$el.find("#titleContents")[0].outerHTML + page.$el.find("#grid-EBZ029R")[0].outerHTML;
                    }
                }
                //var html = page.$el.find(pageGridData)[0].outerHTML;
                this.setCustmerHtml(html, ii, data, printPageSet, page, pageFormInfo);

                ii = ii + 1;
                if (ii < data.ReceiverInfos.length) {
                    this.getCustmerHtml(url, requestData, ii, data, printPageSet, pageGridData, pageFormInfo);
                }
            }.bind(this)
        });
    },

    // 그리드에서 groupid별로 구분해서 뽑기 위해 groupid 목록을 object로 만듬
    getBaseIdList: function (rowList, data, requestData) {
        var baseIdList = {}; // 그리드 getHTMLByGrid에 보내줄 정보

        rowList.forEach(function (e) {
            // 렌더셋이 있으면(그룹의 첫번째 행)
            if (e["_RENDER_SET"] && e["_RENDER_SET"]["_TABLEID"]) {
                // 수신자 정보 돌면서 수신자 키값이랑 그리드 키값 비교함
                for (var i = 0, lng = data.ReceiverInfos.length; i < lng; i++) {
                    if (requestData.TradingStatementPrintingYn == "Y") { // 거래명세서인 경우
                        var slipCust = data.ReceiverInfos[i].SlipInfo.RECEIVER_CD || "",
                            slipCustDes = data.ReceiverInfos[i].SlipInfo.CUST_NAME || "";

                        // 거래처코드가 같으면.. 거래처명이 수정되는 경우가 있어서 거래처명 비교는 주석처리
                        // 거래명세서인 경우 추가사업장등을 하나로 묶으려고 배열로 만듬
                        if ((e["CUST"] || "") == slipCust/* && e["CUST_NAME"] == slipCustDes*/) {
                            // 해당 거래처 정보가 없으면 배열로 생성 <- 추가사업장도 하나로 묶기위해 배열
                            if (baseIdList[String.format("{0}§{1}§", slipCustDes, slipCust)] == undefined ||
                                !$.isArray(baseIdList[String.format("{0}§{1}§", slipCustDes, slipCust)]))
                                baseIdList[String.format("{0}§{1}§", slipCustDes, slipCust)] = [];

                            baseIdList[String.format("{0}§{1}§", slipCustDes, slipCust)].push(e["_RENDER_SET"]["_TABLEID"].split(ecount.delimiter)[0]);
                            break;
                        }
                    } else { // 전표
                        var tableIdColumnList = this.tableIdColumns.split(ecount.delimiter),
                            isTableIdCorrect = true, baseIdKey = "";

                        for (var j = 0; j < tableIdColumnList.length; j++)
                            if (e[tableIdColumnList[j]] != data.ReceiverInfos[i].SlipInfo[tableIdColumnList[j]]) {
                                isTableIdCorrect = false;
                                break;
                            } else {
                                baseIdKey += e[tableIdColumnList[j]] + "§";
                            }

                        if (isTableIdCorrect) {
                            baseIdList[baseIdKey] = e["_RENDER_SET"]["_TABLEID"].split(ecount.delimiter)[0];
                            break;
                        }
                    }
                }
            }
        }.bind(this));

        return baseIdList;
    },

    // 내외자 구분에 따라 메일 내용 넣기
    setMailBodyByForeignFlag: function (requestData, gridHtmlList, gridHtmlListDuplicated, param, option) {
        var receiverInfos = [];

        // Invoice/PackingList에서 Invoice랑 PackingList 둘다 포함해서 보내면 한사람에게 두번 보내야해서 수신자목록 복사
        if (option && option.duplicate)
            receiverInfos = Object.clone(param.ReceiverInfos, true);
        else
            receiverInfos = param.ReceiverInfos;

        for (var i = 0, lng = receiverInfos.length; i < lng; i++) {
            if ($.isEmpty(receiverInfos[i].SlipInfo.MAIL_INNER_HTML))
                receiverInfos[i].SlipInfo.MAIL_INNER_HTML = "";
            if ($.isEmpty(receiverInfos[i].SlipInfo.FAX_INNER_HTML))
                receiverInfos[i].SlipInfo.FAX_INNER_HTML = "";
            if (this.FORM_TYPE == "TAX" || this.FORM_TYPE == "ECTAX") {
                if (!$.isEmpty(requestData.Slips[i].S_SYSTEM))
                    receiverInfos[i].SlipInfo.MENU_GUBUN = requestData.Slips[i].S_SYSTEM == "0" ? "B" : requestData.Slips[i].S_SYSTEM;
                else
                    receiverInfos[i].SlipInfo.MENU_GUBUN = this.S_SYSTEM == "0" ? "B" : this.S_SYSTEM; //B:회계, S:재고
            }

            if (!requestData.IS_FROM_ZA_ONLY || (requestData.IS_FROM_ZA_ONLY && receiverInfos[i].SlipInfo.FOREIGN_FLAG == requestData.BASIC_TYPE.toString())) {
                for (var html in gridHtmlList) {
                    if (option && option.duplicate)
                        receiverInfos[i].CONTENT_FORM_TYPE = param.BasicInfo.CONTENT_SUB_FORM_SEQ;
                    if (gridHtmlList.hasOwnProperty(html)) {
                        if ((requestData.TradingStatementPrintingYn == "Y" &&
                            html.startsWith(String.format("{0}§{1}§", receiverInfos[i].SlipInfo.CUST_NAME || "", receiverInfos[i].SlipInfo.RECEIVER_CD || "")))
                            || (requestData.TradingStatementPrintingYn != "Y" &&
                                html.startsWith(String.format("{0}§{1}§", receiverInfos[i].SlipInfo.IO_DATE, receiverInfos[i].SlipInfo.IO_NO)))) {// 거래명세서인쇄에서 온 경우

                            // 발신정보의 거래처 정보와 비교해서 같으면 메일내용 넣음
                            var mailContents = gridHtmlList[html].replace(/text-primary-inverse/g, "bsy").replace(/url\(\"/g, "url(").replace(/.gif"\)/g, ".gif)");
                            mailContents = mailContents.replace(/class=\"css_Indications\"/gi, "class='invisible'");
                            mailContents = mailContents.replace(/grid-print-cut-line/gi, "hide");
                            mailContents = mailContents.replace(/class=['|\"][^'|\"]*attached-file['|\"][^>]*onclick=\"[^\"]*\"/g, "class='attached-file hide' onclick='return false'");
                            if (this.printAlign != null) {
                                if (this.printAlign == "R") {
                                    mailContents = mailContents.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-right\"");
                                } else if (this.printAlign == "L") {
                                    mailContents = mailContents.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-left\"");
                                } else if (this.printAlign == "C") {
                                    mailContents = mailContents.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-centered\"");
                                }
                            }

                            //if (this.Nation == "TW") {
                            //    if (option.SlipFormAllowList != null) {
                            //        var key = receiverInfos[i].SlipInfo.IO_DATE + "§" + receiverInfos[i].SlipInfo.IO_NO;
                            //        var slipForm = option.SlipFormAllowList[key]

                            //        if (slipForm != null && [1000, 1001, 1003].contains(slipForm.FORM_SEQ)) {
                            //            mailContents = mailContents.replace("width: 650px", "width: 210px");
                            //        }
                            //    }
                            //}

                            var faxContents = (gridHtmlListDuplicated[html] || "").replace(/text-primary-inverse/g, "bsy").replace(/url\(\"/g, "url(").replace(/.gif"\)/g, ".gif)");
                            //faxContents = faxContents.replace(/class=\"css_Indications\"/gi, "class='invisible'");
                            //faxContents = faxContents.replace(/grid-print-cut-line/gi, "hide");
                            faxContents = faxContents.replace(/class=['|\"][^'|\"]*attached-file['|\"][^>]*onclick=\"[^\"]*\"/g, "class='attached-file hide' onclick='return false'");
                            faxContents = faxContents.replace(/&quot;/g, "");



                            if (option && option.addContents) {// a/s 접수 상세포함인 경우
                                receiverInfos[i].SlipInfo.MAIL_INNER_HTML += mailContents;
                                receiverInfos[i].SlipInfo.FAX_INNER_HTML += faxContents;
                            }
                            else {
                                receiverInfos[i].SlipInfo.MAIL_INNER_HTML = mailContents;
                                receiverInfos[i].SlipInfo.FAX_INNER_HTML = faxContents;
                                receiverInfos[i].SlipInfo.GROUP_ID = html;
                            }

                            receiverInfos[i].SlipInfo.GRID_WIDTH = option.gridWidth;
                        }
                    }
                }
            }
        }

        // Invoice/PackingList에서 Invoice랑 PackingList 둘다 포함해서 보내면 한사람에게 두번 보내야해서 수신자목록 복사
        if (option && option.duplicate)
            param.ReceiverInfos = param.ReceiverInfos.concat(receiverInfos);
    },

    //거래명세서포함 메일발송
    callSaveMail: function (param, option, i) {

        if (i + 1 == this.Slips.length)
            this.saveMail(param, option);
    },

    // 메일발송
    saveMail: function (param, option) {

        // 세금계산서의 경우 sc 설정 데이터를 html에 추가
        if (this.usingData.DocGubun == '45') {
            param.ReceiverInfos[0].SlipInfo.MAIL_INNER_HTML = param.ReceiverInfos[0].SlipInfo.MAIL_INNER_HTML + "<NSNDD_ACSH_EMAIL_MGNT_TF>" + ecount.config.company.NSNDD_ACSH_EMAIL_MGNT_TF + "</NSNDD_ACSH_EMAIL_MGNT_TF>";
        }

        var callApi = function (param) {
            ecount.common.api({
                url: "/Common/Infra/SaveMail",
                data: param,
                success: function (result) {

                    if (result.Status != "200") {
                        ecount.alert(result.Error);
                    } else {
                        //When "Print Sales Slip(거래명세서인쇄)"
                        if (result.Data[0].EMAIL_SEND_STATE != "2" && this.FORM_TYPE == "SF030" && this.parentPageID != "ESD007M" && this.parentPageID != "ESD007M_1" && this.parentPageID.substring(0, 7) != "ESD006M") {
                            var slips = [];
                            var custList = this.CUST_LIST.split(ecount.delimiter);
                            var gbTypeList = this.GBTYPE_LIST.split(ecount.delimiter);
                            var ioDateList = this.DATE_LIST.split(ecount.delimiter);
                            var ioNoList = this.NO_LIST.split(ecount.delimiter);
                            var ioTypeList = this.IOTYPE_LIST.split(ecount.delimiter);
                            var serNoList = this.SERNO_LIST.split(ecount.delimiter);

                            for (var i = 0; i < ioDateList.length; i++) {
                                slips.push({
                                    CUST: custList[i],
                                    DEL_GUBUN: "False",
                                    FORM_GUBUN: this.FORM_TYPE,
                                    GB_TYPE: gbTypeList[i],
                                    IO_DATE: ioDateList[i],
                                    IO_NO: ioNoList[i],
                                    IO_TYPE: ioTypeList[i],
                                    SER_NO: serNoList[i],
                                    LOG_STATUS: "E"
                                });
                            }

                            ecount.document.setHistory({
                                LOG_STATUS: "E",
                                Slips: slips,    //layer용
                                SlipsInfos: Object.toJSON(slips)    //popup용
                            }, function (o) { }, function (o) { });
                        }

                        this.moveFinishPage(result.Data, param);
                    }
                }.bind(this),
                complete: function () {
                    this.hideProgressbar();
                    this.footer && this.footer.getControl("Send") && this.footer.getControl("Send").setAllowClick();
                }.bind(this)
            });
        }.bind(this);
        var receiverInfos = param.ReceiverInfos,
            faxCheckCount = receiverInfos.where(function (v) { return v.SlipInfo.ISCHECKFAX && !$.isEmpty(v.SlipInfo.RECEIVE_FAX_NO); }).length,
            faxMakeCount = 0;
        
        if (param.BasicInfo.RECEIVE_FORM_SEQ == 0)
            param.BasicInfo.IS_FROM_ZA_ONLY = true;

        if (param.BasicInfo.FAX_SEND_YN == "Y" && faxCheckCount > 0) {
            param.ReceiverInfos.forEach(function (v) {
                if (v.SlipInfo.ISCHECKFAX && !$.isEmpty(v.SlipInfo.RECEIVE_FAX_NO)) {
                    ecount.document.convertPdf(function (result) {
                        if (result == false) {

                        } else {
                            v.SlipInfo.FAX_PAGE_COUNT = result.PageCount;
                            v.SlipInfo.FAX_PDF_FILE_NAME = result.FileName;

                            faxMakeCount++;
                            if (faxMakeCount == faxCheckCount) {
                                callApi(param);
                            }
                        }
                    }.bind(this), {
                        PaperSize: option.printPageSet.paperSize,
                        MarginLeft: option.printPageSet.leftMargin,
                        MarginRight: option.printPageSet.rightMargin,
                        MarginTop: option.printPageSet.topMargin,
                        MarginBottom: option.printPageSet.bottomMargin,
                        Landscape: option.printPageSet.printWay == "L" ? true : false,
                        UseMargins: true,
                        htmlContent: v.SlipInfo.FAX_INNER_HTML,
                        gridWidth: v.SlipInfo.GRID_WIDTH,
                        IsCompress: false,
                        IsPermanence: false,
                        LifeTimeString: ecenum.tempfileLifetime.infinity,

                    }, "FAX", true);
                }
            }.bind(this));
            this.footer && this.footer.getControl("Send") && this.footer.getControl("Send").setAllowClick();
        } else {
            callApi(param);
        }
    },

    // 메일 발송할 파라미터 생성
    getSendMailApiData: function (ownerKey) {
        // 여기서 this.sendMailInfo에 바로 담는게 아니고 데이터 조합해서 새 object 만들어서 return 할것임
        var returnGrid;

        if (this.DontShowReceiverInfo != true)
            returnGrid = this.gridObj.grid.getRowList().groupBy("RECEIVER_KEY");

        var that = this;
        //var isDataSend = false;
        var basicInfo = $.extend({}, this.sendMailInfo, {
            DOC_GUBUN: this.usingData.DocGubun,
            RECEIVE_FORM_TYPE: this.usingData.ReceiveFormType,
            CONTENT_FORM_TYPE: this.usingData.ContentsFormType,
            CONTENT_SUB_FORM_TYPE: this.usingData.ContentsSubFormType,
            BOARD_CD: (this.GROUPWARE_INFO_LIST || {}).BOARD_CD,
            BOARD_NM: (this.GROUPWARE_INFO_LIST || {}).BOARD_NM,
            MENU_TYPE: (this.GROUPWARE_INFO_LIST || {}).MENU_TYPE,
            OWNER_KEY: ownerKey
        });

        var receiverInfo = Object.clone(this.receiverMailInfo, true);

        var checked = this.contents.getControl("sendType").getCheckedValue(), // 발신수단
            mailSendYn = checked.contains("SENDTYPE_EMAIL"), // 발신수단 Email 체크여부
            smsSendYn = checked.contains("SENDTYPE_SMS"), // 발신수단 SMS 체크여부
            faxSendYn = checked.contains("SENDTYPE_FAX"), // 발신수단 Fax 체크여부
            formValue = (this.contents.getControl("outgoingTemplate", "sendInformation") && this.contents.getControl("outgoingTemplate", "sendInformation").getValue())
                || { outgoingTemplate_select1: 0, outgoingTemplate_radio1: "N", outgoingTemplate_select2: 0, outgoingTemplate_radio2: "N" }; // 보내는양식관련

        // 발신정보 담기 s
        //basicInfo.IS_SEND = true;//isDataSend;
        basicInfo.MAIL_SEND_YN = mailSendYn ? "Y" : "N";
        basicInfo.SMS_SEND_YN = smsSendYn ? "Y" : "N";
        basicInfo.FAX_SEND_YN = faxSendYn ? "Y" : "N";


        basicInfo.SEND_EMAIL = this.contents.getControl("sendEmailAddress", "sendInformation").getValue();
        basicInfo.REPLY_SEND_YN = this.contents.getControl("replyMailSendYn", "sendInformation").getValue();
        basicInfo.RECEIVE_EMAIL = this.contents.getControl("replyEmail").getValue();
        basicInfo.RECEIVE_TEL = this.contents.getControl("replyTel").getValue();
        basicInfo.RECEIVE_NAME = this.contents.getControl("replyEmpName").getValue();

        basicInfo.WEBMAIL_YN = this.contents.getControl("sendEmailAddress", "sendInformation").getValue() == this.defaultEmailAddress ? "N" : "Y";
        basicInfo.SEND_SUBJECT_COMMENT = this.contents.getControl("mailTitle", "sendInformation").getValue();
        basicInfo.SEND_MEMO_COMMENT = this.contents.getControl("mailMemoComment", "sendInformation").getValue().replace(/(\r){0,}\n/gi, "<br/>");
        basicInfo.SEND_SMS_COMMENT = this.contents.getControl("sendSmsComment", "sendInformation").getValue();
        basicInfo.SEND_HP = this.contents.getControl('sendSmsHp', "sendInformation").getValue();
        basicInfo.SEND_FAX_NO = this.contents.getControl('sendFaxNo', "sendInformation").getValue();

        basicInfo.CONTENT_FORM_SEQ = ecount.common.isTrue(formValue["outgoingTemplate_checkbox1"]) ? null : formValue["outgoingTemplate_select1"];
        basicInfo.CONTENT_FORM_USE_YN = formValue["outgoingTemplate_radio1"] || "Y";

        basicInfo.CONTENT_SUB_FORM_SEQ = ecount.common.isTrue(formValue["outgoingTemplate_checkbox2"]) ? "0" : (formValue["outgoingTemplate_select2"] == "0" ? "100" : formValue["outgoingTemplate_select2"]);
        basicInfo.CONTENT_SUB_FORM_USE_YN = formValue["outgoingTemplate_radio2"] || "N";

        basicInfo.RECEIVE_FORM_SEQ = this.contents.getControl("mailReceiveForm", "sendInformation") && this.contents.getControl("mailReceiveForm", "sendInformation").getValue();

        basicInfo.TradingStatementPrintingYn = this.TradingStatementPrintingYn;

        if ($.isEmpty(basicInfo.RECEIVE_EMAIL)) {
            basicInfo.RECEIVE_EMAIL = mailSendYn ? basicInfo.SEND_EMAIL : "";
        }

        if ($.isEmpty(basicInfo.RECEIVE_TEL)) {
            basicInfo.RECEIVE_TEL = smsSendYn ? basicInfo.SEND_HP : "";
        }

        // SMS발신번호 미입력 or 빈값일 때 회사번호로 대체
        if ($.isEmpty(basicInfo.SEND_HP)) {
            if (this.FORM_TYPE == "ELECTRIC") {
                basicInfo.SEND_HP = ecount.company.TEL_NO1;
            } else {
                basicInfo.SEND_HP = this.defaultCaller.ERROR_CODE == "E000" ? this.defaultCaller.CALLER : "";
            }
        }

        //임시저장한 파일에 대한 처리 (파일명, 파일키 저장)
        var tempFileIdArray = [];
        var sendFileInfo = []

        var tempFileIdArray = [];
        if (this.ATTACH_INFO.LIST) {
            this.ATTACH_INFO.LIST.forEach(function (item, i) {
                tempFileIdArray.push(item.name + ecount.delimiter + item.id);
            });
        }
        basicInfo.SEND_FILENAMES = tempFileIdArray;
        basicInfo.SEND_FILENAMES_DETAIL = sendFileInfo;
        // 발신정보 담기 e

        // 수신정보 상세 담기 s
        $.each(receiverInfo, function (index, data) {
            var custMailInfoList = [];
            var detailInfo = returnGrid[data.SlipInfo.RECEIVER_KEY];

            if (!detailInfo)
                return true;

            //전자세금계산서 발송메일 확인은 세무신고거래처로 
            data.SlipInfo.RECEIVER_CD = (this.FORM_TYPE == "ECTAX") ? data.SlipInfo.D_NO2 : data.SlipInfo.RECEIVER_CD;

            // 전표/거래처별 수신자 상세목록 만들기 s
            detailInfo.forEach(function (v, i) {
                if (v.SEND_TYPE == "N" && (!v.ISCHECKSMS || (v.ISCHECKSMS && $.isEmpty(v.HP_NO))) && (!v.ISCHECKFAX || (v.ISCHECKFAX && $.isEmpty(v.FAX_NO))))
                    return true;

                if ($.isEmpty(v.EMAIL) && $.isEmpty(v.HP_NO) && $.isEmpty(v.FAX_NO))
                    return true;

                //isDataSend = true;

                custMailInfoList.push({
                    RECEIVER_CD: data.SlipInfo.RECEIVER_CD,
                    UNAME: v.UNAME,
                    EMAIL: v.SEND_TYPE == "N" ? "" : v.EMAIL,
                    HP_NO: v.ISCHECKSMS ? v.HP_NO : "",
                    APP_FLAG: v.SEND_TYPE == "T" ? "Y" : "N",
                    SEND_TYPE: v.SEND_TYPE,
                    ISCHECKSMS: v.ISCHECKSMS,
                    RECEIVER_USER_ID: v.RECEIVER_USER_ID
                });

                if (v.ISCHECKFAX && !$.isEmpty(v.FAX_NO)) {
                    data.SlipInfo.RECEIVE_FAX_NO = v.FAX_NO;
                    data.SlipInfo.ISCHECKFAX = v.ISCHECKFAX;
                }
            });
            // 전표/거래처별 수신자 상세목록 만들기 e

            // 전표정보 담기 s
            data.CustEmailList = custMailInfoList;
            data.SlipInfo.SUB_COM_DES = data.SlipInfo.SUB_COM_DES || this.sendMailInfo.SEND_COM_DES;
            data.SlipInfo.SUB_CUST = data.SlipInfo.SUB_CUST || data.SlipInfo.SUB_CUST_MAX || data.SUB_CUST_MIN || this.sendMailInfo.SEND_BUSINESS_NO;

            if (this.TradingStatementPrintingYn == "Y" && this.sendMailInfo.SalesSlip_YN == "N" && $.trim(data.SlipInfo.IO_DATE) == "") {
                data.SlipInfo.IO_DATE = data.SlipInfo.IO_DATE2;
            }

            if (this.TAX_FLAG == "Y" && $.trim(data.SlipInfo.IO_NO) == "0") {
                data.SlipInfo.IO_NO = JSON.parse(this.SlipsInfos)[0].IO_NO;
            }
            if (data.SlipInfo.AMT != "0" && data.SlipInfo.TOT_AMT == "0")
                data.SlipInfo.TOT_AMT = data.SlipInfo.AMT;
            data.CONTENT_FORM_TYPE = basicInfo.CONTENT_FORM_TYPE;
            // 전표정보 담기 e
        }.bind(this));
        // 수신정보 상세 담기 e

        var saveData = {
            BasicInfo: basicInfo,
            ReceiverInfos: receiverInfo.where(function (v) {
                return that.FORM_TYPE == "ELECTRIC" || $.isEmpty(v.CustEmailList) == false;
            }),
            CheckPermissionRequest: this.CheckPermissionRequest
        }

        return saveData;
    },

    // 완료페이지로 이동
    moveFinishPage: function (data, sendInfo) {
        var param = {
            width: 1200,
            height: 800,
            MAIL_SEND_YN: sendInfo.BasicInfo.MAIL_SEND_YN,
            SMS_SEND_YN: sendInfo.BasicInfo.SMS_SEND_YN,
            FAX_SEND_YN: sendInfo.BasicInfo.FAX_SEND_YN,
            RECEIVE_FORM_TYPE: sendInfo.BasicInfo.RECEIVE_FORM_TYPE,
            ReceiveInfoTabType: this.usingData.ReceiveInfoTabType,
            FORM_TYPE: this.FORM_TYPE,
            isFromApp: this.isFromApp ? true : false
        };

        if (this.AccessType == "F")
            param.TITLE = ecount.resource.LBL12191;

        var resultInfo = data.where(function (v) { return v.EMAIL_SEND_STATE != "2" || v.SMS_SEND_STATE != "2" || v.FAX_SEND_STATE != "2"; });
        param.RESULT_INFO = resultInfo;
        param.RESULT_INFO_JSON = Object.toJSON(resultInfo);

        // EMAIL 발송성공 여부 (1: 성공)
        var emailSendInfo = resultInfo.where(function (v) { return v.EMAIL_SEND_STATE == "1" });
        if (emailSendInfo != undefined && emailSendInfo.length > 0 && (this.parentPageID == "ECTAX023M" || this.parentPageID == "ECTAX100M")) {
            var sendObject = {
                FORM_TYPE: this.FORM_TYPE,
                EMAIL_SUCCESS_FLAG: "Y",
                EMAIL_SEND_INFO: emailSendInfo
            };
            this.sendMessage(this, sendObject);
        }
        this.footer.getControl("Send").setAllowClick();
        this.onAllSubmitSelf("/ECERP/Popup.Common/ES300P_03", param);
    },

    // 거래명세서 페이지에 보낼 전표정보 생성
    createRequestSlipInfo: function (receiverInfos) {
        var slipInfos = [];
        var formTypeFlag = '0';

        if (this.Nation == "TW" && this.contents.getControl("outgoingTemplate_select1") != null) {
            formTypeFlag = this.contents.getControl("outgoingTemplate_select1").getSelectedItem().value;
        }

        if (this.Slips && $.isArray(this.Slips)) {
            for (var i = 0, lng = this.Slips.length; i < lng; i++) {
                slipInfos.push(JSON.stringify({
                    IO_DATE: this.Slips[i].IO_DATE,
                    IO_NO: this.Slips[i].IO_NO,
                    SER_NO: this.Slips[i].SER_NO,
                    IO_TYPE: this.Slips[i].IO_TYPE,
                    GB_TYPE: this.Slips[i].GB_TYPE,
                    NO_FORM: ((this.FORM_TYPE == "TAX" && _FORM_SEQ == "9") || this.FORM_TYPE == "ECTAX" ? this.Slips[i].NO_FORM : _FORM_SEQ),
                    CUST: this.Slips[i].CUST,
                    S_SYSTEM: (this.FORM_TYPE == "TAX" || this.FORM_TYPE == "ECTAX") ? this.Slips[i].S_SYSTEM : "0",
                    HID: this.Slips[i].HID || 0,
                    ECTAX_TYPE: ["0", "9"].contains(formTypeFlag.toString()) ? this.Slips[i].ECTAX_TYPE : '0', // 기본양식이 아닐경우 청구서양식으로
                    INVOICE_KIND: this.Slips[i].INVOICE_KIND,
                    SUBMIT_STATUS: this.Slips[i].SUBMIT_STATUS
                }));
            }
        }
        else if (this.TradingStatementPrintingYn == "N" && receiverInfos && $.isArray(receiverInfos)) {
            for (var i = 0, lng = receiverInfos.length; i < lng; i++) {
                slipInfos.push(JSON.stringify({
                    IO_DATE: receiverInfos[i].SlipInfo.IO_DATE,
                    IO_NO: receiverInfos[i].SlipInfo.IO_NO,
                    SER_NO: 0,
                    IO_TYPE: receiverInfos[i].SlipInfo.IO_TYPE,
                    GB_TYPE: receiverInfos[i].SlipInfo.GB_TYPE,
                    NO_FORM: ((this.FORM_TYPE == "TAX" && _FORM_SEQ == "9") || this.FORM_TYPE == "ECTAX" ? this.Slips[i].NO_FORM : _FORM_SEQ),
                    CUST: receiverInfos[i].SlipInfo.CUST,
                    S_SYSTEM: (this.FORM_TYPE == "TAX" || this.FORM_TYPE == "ECTAX") ? this.Slips[i].S_SYSTEM : "0"
                }));
            }
        } else {
            slipInfos.push(JSON.stringify({
                IO_DATE: this.DATE_LIST,
                IO_NO: this.NO_LIST,
                SER_NO: this.SERNO_LIST,
                IO_TYPE: this.IOTYPE_LIST,
                GB_TYPE: this.GBTYPE_LIST,
                NO_FORM: ((this.FORM_TYPE == "TAX" && _FORM_SEQ == "9") || this.FORM_TYPE == "ECTAX" ? this.Slips[i].NO_FORM : _FORM_SEQ),
                CUST: this.CUST_LIST,
                S_SYSTEM: (this.FORM_TYPE == "TAX" || this.FORM_TYPE == "ECTAX") ? this.Slips[i].S_SYSTEM : "0"
            }));
        }
        return "[" + slipInfos + "]";
    },

    //회신정보 Row Show & Hide
    receiverShowAndHide: function (isShow) {
        var form = this.contents.getForm("sendInformation")[1];
        if (isShow) {
            form.showCell("replyEmpName");
            form.showCell("replyMailSendYn");
            form.showCell("replyEmail");
            form.showCell("replyTel");
            //this.contents.getForm("sendInformation")[1].showRow("replyEmpName");
            //this.contents.getForm("sendInformation")[1].showRow("replyEmail");
        } else {
            form.hideCell("replyEmpName");
            form.hideCell("replyMailSendYn");
            form.hideCell("replyEmail");
            form.hideCell("replyTel");
            //this.contents.getForm("sendInformation")[1].hideRow("replyEmpName");
            //this.contents.getForm("sendInformation")[1].hideRow("replyEmail");
        }
    },

    // SMS, FAX충전 : KCP 연결 (OLD FRAMEWORK)
    openChargingPopup: function (gubun) {
        //gubun = " " + gubun;
        //this.openWindow({
        //    url: '/ECMAIN/KCP/KCP001M.aspx?com_code=' + this.COM_CODE + '&db_con_flag=2&emn_flag=N&access_site=ECOUNT&CcProdDesc=' + this.COM_CODE + gubun,
        //    name: ecount.resource.LBL03658,
        //    param: {
        //        width: 630,
        //        height: 700
        //    },
        //    fpopupID: this.ecPageID,
        //    popupType: true,
        //    additional: false
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
        //            CcProdDesc: this.COM_CODE + gubun
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
            ccProdDesc: this.COM_CODE + " " + gubun
        });
    },

    // 메일제목, 메일추가내용, SMS발송문구 조회 팝업
    openCommentPopupForSearch: function (sendSer, name) {
        var param = {
            width: 550,
            height: 450,
            SEND_SER: sendSer,
            DOC_GUBUN: this.usingData.DocGubun,
            KeyWord: '',
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        this.openWindow({// Open popup
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: name,
            param: param
        });
    },

    // 메일제목, 메일추가내용, SMS발송문구 등록 팝업
    openCommentPopupForRegist: function (sendSer) {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: "EGA001P_03",
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: sendSer,
                DOC_GUBUN: this.usingData.DocGubun,
                Edit: true,
                FORM_TYPE: this.FORM_TYPE
            }
        });
    },

    // 발신정보 - 사용자 이메일 리스트 위젯에 바인딩할 배열로 변경
    getUserEmailList: function () {
        var _returnUserEmailListData = [];

        $.each(this.viewBag.InitDatas.userMailList, function (i, v) {
            _returnUserEmailListData.push([v, v]);
        });

        _returnUserEmailListData.push([this.defaultEmailAddress, this.defaultEmailAddress]);

        return _returnUserEmailListData;
    },

    // 양식 리스트 위젯에 바인딩할 배열로 변경
    getFormListData: function (formList) {
        var _returnFormListData = [];

        if ($.isEmpty(formList)) {
            return null;
        }

        if ($.isEmpty(formList) == false) {
            $.each(formList, function () {
                if (this.FORM_SEQ >= 1000)
                    this.FORM_SEQ = this.FORM_SEQ - 1000;
                if (this.ORD == '1') //action쪽에서 임의로 추가한 Ecount기본
                    _returnFormListData.push([[this.FORM_SEQ], [this.TITLE_NM]]);
                else
                    _returnFormListData.push([[this.FORM_SEQ], [this.TITLE_NM + ' ' + this.FORM_SEQ]]);
            });
        }

        return _returnFormListData;
    },

    // 양식 리스트 기본 선택값 가져오기
    getFormListSelectedItem: function (formList, selectedFormSeq) {
        var _selectedItem = [];

        if (selectedFormSeq != undefined && selectedFormSeq != null) {
            _selectedItem = formList.where(function (item, i) {
                return (item.FORM_SEQ == selectedFormSeq);
            });
        }

        if (_selectedItem.length == 0) {
            _selectedItem = formList.where(function (item, i) {
                return (item.BASIC_TYPE == '0')
            });
        }

        if (_selectedItem.length == 0) {
            _selectedItem = formList.where(function (item, i) {
                return (item.ORD == '1')
            });
        }

        return _selectedItem.length > 0 ? _selectedItem[0].FORM_SEQ : 0;
    },

    // 양식 리스트 기본 선택값 가져오기
    getXFormListSelectedItem: function (formList, selectedFormSeq, isZaCode) {
        var _selectedItem = [];

        if (isZaCode) {
            selectedFormSeq = selectedFormSeq - 1;
        }

        if (selectedFormSeq != undefined && selectedFormSeq != null) {
            _selectedItem = formList.where(function (item, i) {
                if (isZaCode) {
                    if (item.ORD == '1') {
                        return (item.FORM_SEQ == selectedFormSeq);
                    }
                }
                else {
                    return (item.FORM_SEQ == selectedFormSeq);
                }
            });
        }

        if (_selectedItem.length == 0) {
            _selectedItem = formList.where(function (item, i) {
                return (item.ORD == '1')
            });
        }

        return _selectedItem.length > 0 ? _selectedItem[0].FORM_SEQ : 0;
    },

    // 그리드에 에러 표시
    setShowError: function (name, index, message, rowKey) {
        var option = {};
        var grid = this.gridObj.grid;
        option.message = message;
        grid.setCellShowError(name, rowKey, option);
    },

    //파일 임시저장
    tempFileSave: function () {

        this.attachedFiles = this.IsNotAttachment ? null : this.contents.getFileList("attachment").serialize();

        if (this.attachedFiles && this.attachedFiles.value.length > 0) { //첨부파일이 있을경우
            this.contents.getFileList("attachment").uploadStart();
        } else {
            this.sendData();
        }
    },

    // 특수 문자 체크 check special character code type
    CheckSpecialCharacterForCode: function (value, rowItem) {
        var resultObject = ecount.common.ValidCheckSpecialForCodeType(value);

        return {
            result: resultObject.result,
            error: {
                popover: {
                    visible: !resultObject.result,
                    message: resultObject.message,
                    placement: 'right'
                }, css: {
                    visible: !resultObject.result
                }
            }
        };
    },

    _attachFileSave: function (callback) {
        //파일 임시저장  
        var file = this.contents.getControl("attachment"),
            flist = file.getValue("file").first();

        if (!$.isEmpty(flist) && (flist.uploadFiles.length > 0 || flist.removeFiles.length > 0)) {
            //갱신할 첨부 파일 정보가 있을 경우
            this.bind("FileUploadComplete", function () {
                this.FS_OWNER_KEY = file.getOwnerKey("file");
                this.FS_TOTAL_SIZE = file.getTotalSize("file");
                this.ATTACH_INFO.SIZE = file.getTotalSize("file");

                var tattinfolist = [], removes = "";

                flist.removeFiles.forEach(function (item, i) {
                    if (removes != "") {
                        removes += ecount.delimiter;
                    }
                    removes += item.name;
                    this.REMOVE_ATTACH_FILES.push(item.name);
                }.bind(this));

                if (removes != "") {
                    removes = ecount.delimiter + removes + ecount.delimiter;
                }

                for (var i = 0; i < this.ATTACH_INFO.LIST.length; i++) {
                    var tfile = this.ATTACH_INFO.LIST[i];
                    if (removes.indexOf(ecount.delimiter + tfile.name + ecount.delimiter) == -1)
                        tattinfolist.push(tfile);
                }

                if (flist.uploadFiles && flist.uploadFiles.length > 0)
                    this.UPLOAD_FILE = true;

                var isSafari = ($ && $.browser && typeof $.browser.safari != "undefined" && $.browser.safari === true) ? true : false;

                flist.uploadFiles.forEach(function (item, i) {
                    //브라우져가 사파리이면 encoded file name을 함께 저장 (mac safari NFD,NFC 이슈 해결)
                    if (isSafari)
                        tattinfolist.push({
                            name: item.name, size: item.size, ename: encodeURIComponent(item.name), id: item.id
                        })
                    else
                        tattinfolist.push({
                            name: item.name, size: item.size, id: item.id
                        })
                });

                this.ATTACH_INFO.LIST = tattinfolist;

                if (!$.isEmpty(callback))
                    callback();
            }).bind(this);

            var errcallback = function () {
                this.footer.getControl("Send").setAllowClick();
            }.bind(this);

            file.startUpload('', errcallback, '');
            return;
        }


        if (!$.isEmpty(callback))
            callback();
    },
    _finalAttachFileSave: function () {
        var _self = this;
        this._attachFileSave(function () {
            _self.sendData(_self.FS_OWNER_KEY);
        });
    },

    //전체 그리드 생성
    createAllGrid: function (page, callback) {
        if (page.createAllGrid) {
            page.createAllGrid(callback);
            return;
        }

        callback();
    },
});
