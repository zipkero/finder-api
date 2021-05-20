window.__define_resource && __define_resource("MSG06945","LBL11726","LBL01732","LBL06157","LBL01042","LBL06763","BTN00672","LBL06761","LBL12238","LBL19235","LBL05628","LBL19236","LBL19237","LBL03617","LBL01241","LBL06953","LBL05626","LBL03684","BTN00991","BTN00992","LBL03615","LBL19397","LBL05636","LBL12236","MSG05387","MSG05388","MSG05389","MSG06315","MSG06316","MSG06947","MSG09945","MSG06948","MSG09946","MSG09947","MSG06949","MSG06950","MSG06951","MSG09888","MSG09889","MSG09909","MSG09910","MSG06954","MSG10067","MSG06955","MSG06956","LBL09727","LBL01457","LBL35346","LBL00703","LBL01280","LBL14263","LBL00830","LBL09019","LBL09020","LBL02938","LBL08581","LBL03858","LBL04600","LBL04601","LBL93739","LBL00683","LBL93330","LBL02361","LBL01554","LBL01564","LBL02263","LBL01565","LBL01171","LBL02730","LBL93360","LBL93363","LBL93687","LBL93689","LBL13024","LBL93381","LBL93383","LBL20105","LBL18623","LBL18624","LBL16417","LBL18641","LBL18643","LBL16535","LBL18642","LBL18644","LBL01607","BTN00141","LBL09963","LBL93024","LBL93002","LBL02695","LBL10288","MSG05400","MSG05401","MSG05402","MSG07527","MSG07528","MSG07529","MSG07846","MSG07847","MSG07848","LBL03657","MSG00465","MSG06975","LBL09915","MSG06976","LBL06787","MSG06977","BTN00784","BTN00037","BTN00065","BTN00008","BTN00070","MSG05398","LBL07157","MSG05714","LBL01482","LBL01809","LBL13759","LBL70053","MSG00008","LBL35235","LBL80077","LBL02458","LBL02715","LBL10989","LBL02354","LBL10790","LBL09977","MSG01699","MSG00500");
/****************************************************************************************************
1. Create Date : 2017.02.15
2. Creator     : 정명수
3. Description : 알림설정 팝업창 (Notice setting popup)
4. Precaution  : 
5. History     : 2017.04.11(Hao) - Add Formgubun for internal use (228)
5. History     : 2017.04.11(Bao) - Add Formgubun for shipping order (215)
                 2017.04.26(Vuthien) - Shipping: 216
                 2017.05.04(Hao) - Add Formgubun for Purchase (226)
                 2017.05.04(Hao) - Add Formgubun for Purchase (229)
                 2017.05.23(Hao) - Add Formgubun for Purchase Request (223)
                 2017.05.15(LeNguyen) - Add Formgubun for Purchase (230)
                 2017.05.17(VuThien) - Quality Insp. (231)
                 2017.05.30(VuThien) - Job Order (217)
                 2017.08.07(VuThien) - Goods Receipt 1,2,3 ("219", "220", "221")
                 2018.01.17(TanThanh) - Goods Receipt 1,2,3 ("219", "220", "221")
                 2018.05.03(Huu Lan) Apply Dev7970_Remove SMS column UI by CS (CS에서 SMS 알림 기능 제거)
                                    1. Self-Customizing > Others > Default  > Others > Reminder Setting >
                                    2. Self-Customizing > Others > User Setup > Set Manually > 
                2018.07.18 Huu Lan: Apply Dev 9134 - ERP게시글 작성 시, CS 거래처 담당자에게 쪽지 발송되도록
                2018.08.17(Lan) - Backed to previous version
                2018.08.31(이정록) - 양식변경시 메일양식도 변경
                2018.09.05(이정록) - 양식변경시 메일양식도 변경(back)
                2018.09.06(이정록) - 양식변경시 메일양식도 변경 재배포
                2018.12.27 (HoangLinh): Remove $el 
                2019.01.04 (Ngo Thanh Lam) - Prevent setup email template for Internal Use menu
                2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                2020.03.12 (소병용) - 매출전표1 추가
                2020.03.26 (김선모) - 다른탭의 인풋박스도 밸리데이션 할 수 있도록 변경
                2020.05.29 (황재빈): 저장 시 부모함수를 통해 권한체크 로직수정
                2020.12.15 (seongbeom kim) - A19_00808 작업내역입력 추가
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "NoticeSetup", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    receiveSelectedFormSeq: null,                           // 수신화면 양식 FORM_SEQ
    isUseSMS: ecount.config.limited.feature.USE_SMS,        // SMS 사용여부SMS UseFlag
    data: null,
    titleByDocGubun: null,
    messageByMessageCode: null,
    mode: "I",
    idPopupApplyFilterIndex: 0,
    editFlagMsg: "I",
    toolTipByDocGubun: null,
    toolTipResource: "",
    isSmsVisible: false,
    isMemoVisible: false,
    isEmailVisible: false,
    //selfCustomizingHeight: 0,                               // 사용방법설정 팝업창 높이
    programSeq: 0,
    modifyRowCountOrigin: 0,
    targetDefaultData: null,
    targetData: null,
    boardReceiver: null,
    inSiteList: null,
    smsCheckedList: null,
    emailCheckedList: null,
    memoCheckedList: null,
    showEmailDocGubun: null,
    lastEditInfo: null,
    isToVisible: null,
    isCcVisible: null,
    isShareVisible: null,
    inNotiTargetList: null,
    isWriterVisible: null,
    isReplyVisible: null,
    isCSVisible: null,
    mapingDocGubunToFormType: null,
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties(options.pageOption);
        this.registerDependencies("ecmodule.common.formHelper");
    },

    initProperties: function (pageOption) {

        this.inNotiTargetList = {};
        this.inSiteList = {};
        this.showEmailDocGubun = [
            "00", "210", "211",
            "212", "214", "227",
            "225", "999", "900",
            "901", "228", "215",
            "300", "226", "222",
            "223", "230", "217",
            "216", "218", "229",
            "219", "220", "221",
            "231", "232", "235",
            "236", "240", "705", "704",
            "802", "806", "804",
            "803", "807", "805",
            "401"
        ];
        this.mapingDocGubunToFormType = [

            //문서코드/메일수신양식/신규여부(SVC 인지 여부)
            ["00", "", "N"],       //기본
            ["211", "SJ010", "Y"],      //견적서입력
            ["212", "SJ020", "Y"],      //주문서입력
            ["214", "SJ030", "Y"],      //판매입력
            ["215", "SJ770", "Y"],      //출하지시서입력
            ["216", "SJ780", "Y"],      //출하입력
            ["217", "SJ400", "N"],      //작업지시서입력
            ["218", "SJ410", "N"],      //생산불출입력
            ["219", "SJ420", "Y"],     //생산입고I 입력    --SH420 통일
            ["220", "SJ420", "Y"],    //생산입고II 입력
            ["221", "SJ420", "Y"],     //생산입고 III 입력
            ["222", "SJ600", "N"],      //창고이동입력
            ["223", "SJ220", "N"],      //발주요청입력
            ["224", "", "N"],           //발주계획입력- 메일발송없음
            ["225", "SJ200", "N"],      //발주서입력
            ["226", "SJ210", "Y"],      //구매입력
            ["227", "SJ240", "N"],      //단가요청입력
            ["228", "SJ610", "Y"],      //자가사용입력
            ["229", "SJ500", "N"],      //불량처리입력
            ["230", "SJ743", "Y"],      //품질검사요청입력
            ["231", "SJ744", "N"],     //품질검사입력
            ["232", "SJ940", "N"],     //Invoice/Packing List 입력
            ["235", "SJ700", "Y"],     // A/S접수등록 
            ["236", "SJ711", "Y"],     // A/S수리등록 
            ["240", "SJ474", "Y"],     // 작업내역입력
            ["705", "SJ661", "Y"],           //위치이동입력
            ["704", "SJ660", "Y"],           //수량이동입력
            ["802", "SJ650", "Y"],           //입고예정입력
            ["806", "SJ670", "Y"],           //입고지시
            ["804", "SJ673", "Y"],           //입고
            ["803", "SJ690", "Y"],          //출고예정입력
            ["807", "SJ732", "Y"],           //출고지시
            ["805", "SJ731", "Y"],           //출고
            ["401", "AJ100", "Y"]           //매출전표1
        ];
        this.lastEditInfo = this.viewBag.InitDatas.LastEdit;

        this.smsCheckedList = [], this.emailCheckedList = [], this.memoCheckedList = [];

        if (pageOption && pageOption.DATA) {
            this.data = pageOption.DATA;
        }

        if (this.data && this.data.SLIP_DEFAULT && this.data.SLIP_DEFAULT.MESSAGE)
            this.receiveSelectedFormSeq = this.data.SLIP_DEFAULT.MESSAGE.EMAIL_FORM_SER;

        // 메일수신화면양식 기본값 SETTING
        if (!$.isEmpty(this.viewBag.InitDatas.ReceiveFormList) && $.isNull(this.receiveSelectedFormSeq)) {
            this.receiveSelectedFormSeq = this.getFormListSelectedItem(this.viewBag.InitDatas.ReceiveFormList);
        }

        this.toolTipByDocGubun = {
            "210": ecount.resource.MSG06945
        };

        if (this.toolTipByDocGubun[this.DOC_GUBUN])
            this.toolTipResource = this.toolTipByDocGubun[this.DOC_GUBUN];

        this.titleByMessageCode = {
            N: ecount.resource.LBL11726, // 등록
            M: ecount.resource.LBL01732, // 수정
            D: ecount.resource.LBL06157, // 삭제
            C: ecount.resource.LBL01042, // 확인
            CX: this.DOC_GUBUN == "300" ? ecount.resource.LBL06763 : ecount.resource.BTN00672, // 확인취소
            DN: ecount.resource.LBL06761, // 확인취소
            "210A": ecount.resource.LBL12238, // 결재요청
            "210A2": ecount.resource.LBL19235, //결재요청(전결)
            "210AX": ecount.resource.LBL05628, // 결재취소
            "210CB": ecount.resource.LBL19236, //결재취소(전결)
            "210CW": ecount.resource.LBL19237, //결재취소(후결)
            "210CT": ecount.resource.LBL03617, // 결재완료
            "210R": ecount.resource.LBL01241, // 반려
            "210RX": ecount.resource.LBL06953, // 반려취소
            "210BA": ecount.resource.LBL05626, // 전결
            "210AA": ecount.resource.LBL03684, // 후결
            "210RB": ecount.resource.BTN00991, // 반려(전결)
            "210RA": ecount.resource.BTN00992, // 반려(후결)
            "210CC": ecount.resource.LBL03615, // 수신참조
            "210S": ecount.resource.LBL19397, // 공유문서
            "210CN": ecount.resource.LBL05636, // 첨언등록
            "210CM": ecount.resource.LBL12236 // 첨언수정
        };

        this.messageByMessageCode = {
            N: {
                SMS_TXT: ecount.resource.MSG05387,
                MEMO_TXT: ecount.resource.MSG05387,
                EMAIL_TXT: ecount.resource.MSG05387
            },
            M: {
                SMS_TXT: ecount.resource.MSG05388,
                MEMO_TXT: ecount.resource.MSG05388,
                EMAIL_TXT: ecount.resource.MSG05388
            },
            D: {
                SMS_TXT: ecount.resource.MSG05389,
                MEMO_TXT: ecount.resource.MSG05389,
                EMAIL_TXT: ecount.resource.MSG05389
            },
            C: {
                SMS_TXT: ecount.resource.MSG06315,
                MEMO_TXT: ecount.resource.MSG06315,
                EMAIL_TXT: ecount.resource.MSG06315
            },
            CX: {
                SMS_TXT: ecount.resource.MSG06316,
                MEMO_TXT: ecount.resource.MSG06316,
                EMAIL_TXT: ecount.resource.MSG06316
            },
            "210A": {
                SMS_TXT: ecount.resource.MSG06947,
                MEMO_TXT: ecount.resource.MSG06947,
                EMAIL_TXT: ecount.resource.MSG06947
            },
            "210A2": {
                SMS_TXT: ecount.resource.MSG09945,
                MEMO_TXT: ecount.resource.MSG09945,
                EMAIL_TXT: ecount.resource.MSG09945
            },
            "210AX": {
                SMS_TXT: ecount.resource.MSG06948,
                MEMO_TXT: ecount.resource.MSG06948,
                EMAIL_TXT: ecount.resource.MSG06948
            },
            "210CB": {
                SMS_TXT: ecount.resource.MSG09946,
                MEMO_TXT: ecount.resource.MSG09946,
                EMAIL_TXT: ecount.resource.MSG09946
            },
            "210CW": {
                SMS_TXT: ecount.resource.MSG09947,
                MEMO_TXT: ecount.resource.MSG09947,
                EMAIL_TXT: ecount.resource.MSG09947
            },
            "210CT": {
                SMS_TXT: ecount.resource.MSG06949,
                MEMO_TXT: ecount.resource.MSG06949,
                EMAIL_TXT: ecount.resource.MSG06949
            },
            "210R": {
                SMS_TXT: ecount.resource.MSG06950,
                MEMO_TXT: ecount.resource.MSG06950,
                EMAIL_TXT: ecount.resource.MSG06950
            },
            "210RX": {
                SMS_TXT: ecount.resource.MSG06951,
                MEMO_TXT: ecount.resource.MSG06951,
                EMAIL_TXT: ecount.resource.MSG06951
            },


            "210BA": {
                SMS_TXT: ecount.resource.MSG09888,
                MEMO_TXT: ecount.resource.MSG09888,
                EMAIL_TXT: ecount.resource.MSG09888
            },
            "210AA": {
                SMS_TXT: ecount.resource.MSG09889,
                MEMO_TXT: ecount.resource.MSG09889,
                EMAIL_TXT: ecount.resource.MSG09889
            },
            "210RB": { 
                SMS_TXT: ecount.resource.MSG09909,
                MEMO_TXT: ecount.resource.MSG09909,
                EMAIL_TXT: ecount.resource.MSG09909
            },
            "210RA": {
                SMS_TXT: ecount.resource.MSG09910,
                MEMO_TXT: ecount.resource.MSG09910,
                EMAIL_TXT: ecount.resource.MSG09910
            },
            "210CC": {
                SMS_TXT: ecount.resource.MSG06954,
                MEMO_TXT: ecount.resource.MSG06954,
                EMAIL_TXT: ecount.resource.MSG06954
            },
            "210S": {
                SMS_TXT: ecount.resource.MSG10067,
                MEMO_TXT: ecount.resource.MSG10067,
                EMAIL_TXT: ecount.resource.MSG10067
            },
            "210CN": {
                SMS_TXT: ecount.resource.MSG06955,
                MEMO_TXT: ecount.resource.MSG06955,
                EMAIL_TXT: ecount.resource.MSG06955
            },
            "210CM": {
                SMS_TXT: ecount.resource.MSG06956,
                MEMO_TXT: ecount.resource.MSG06956,
                EMAIL_TXT: ecount.resource.MSG06956
            }
        };

        // 문서구분 표출여부
        this.IsDocTypeDisplay = this.IsSc == "Y" && !["210", "300"].contains(this.DOC_GUBUN) ? "Y" : "N";

        // 대상자 목록 표출여부
        this.IsReceiverDisplay = this.IsSc == "Y" && this.DOC_GUBUN == "210" ? "N" : "Y";

        // 알림수단 표출여부
        this.IsTypeDisplay = this.IsSc == "Y" && this.DOC_GUBUN != "210" ? "Y" : "N";

        // 대상자 수정 가능여부
        this.IsReceiverEditable = this.DOC_GUBUN == "210" || this.DOC_GUBUN == "999" || this.NoticeType == "approval" || this.DOC_GUBUN == "900" || this.DOC_GUBUN == "901" ? "N" : "Y";

        // 대상자가 탭별인지 여부
        this.IsReceiverByTab = this.DOC_GUBUN == "210" ? "Y" : "N";

        // 대상자 선택 가능여부
        this.IsReceiverSelectable = this.DOC_GUBUN == "210" || this.DOC_GUBUN == "999" || this.NoticeType == "approval" ? 0 : 1;

        this.NotiCheck = this.viewBag.InitDatas.NotiCheck;
        this.NotiList = this.viewBag.InitDatas.NotiList;
        this.ReceiverList = this.viewBag.InitDatas.ReceiverList;

        if (this.IsSc == "Y") {
            this.modifyRowCountOrigin = (this.ReceiverList && this.ReceiverList.length) || 0;

            this.data = {
                SLIP_DEFAULT: {
                    MESSAGE: {
                        SMS_CHK_YN: this.NotiCheck.SMS_CHK_YN,
                        EMAIL_CHK_YN: this.NotiCheck.EMAIL_CHK_YN,
                        MEMO_CHK_YN: this.NotiCheck.MEMO_CHK_YN,
                        APP_PUSH_CHK_YN: this.NotiCheck.APP_PUSH_CHK_YN
                    },
                    RECEIVERS: []
                },
                SLIP_DATA: []
            };

            this.NotiList.forEach(function (v, i) {
                if (i == 0)
                    this.editFlagMsg = v.Key.COM_CODE == this.viewBag.COM_CODE ? "M" : "I";

                this.data.SLIP_DATA.push({
                    CODE: v.Key.NOTI_TYPE,
                    DATA: {
                        MESSAGE: {
                            SMS_TXT: v.SMS_TXT,
                            EMAIL_TXT: v.EMAIL_TXT,
                            MEMO_TXT: v.MEMO_TXT ? v.MEMO_TXT.replace(/(\\r)?\\n/gi, "\r\n") : ""
                        },
                        RECEIVERS: []
                    }
                });
            }.bind(this));
        }

        this.targetDefaultData = this.NoticeType == "approval" ? this.data.APPROVAL_DEFAULT : this.data.SLIP_DEFAULT;
        this.targetData = this.NoticeType == "approval" ? this.data.APPROVAL_DATA : this.data.SLIP_DATA;

        if (!this.showEmailDocGubun.contains(this.DOC_GUBUN) && this.IsOrderProc != "Y") {
            this.targetDefaultData.MESSAGE.EMAIL_CHK_YN = "N";
        }

        /*
            1. this.DOC_GUBUN == "300" 
               - Self-Customizing > Others > Default  > Others > Reminder Setting >
               - Self-Customizing > Others > User Setup > Set Manually > 
            2. this.IsOrderProc == "Y"
               - Inv.II > Order Managerment > Order Mgmt.Process > New > Reminder Setting
        */
        if (this.DOC_GUBUN == "300" || this.IsOrderProc == "Y") {
            this.isUseSMS = false;
        }

        this.isSmsVisible = this.isUseSMS && (this.IsSc == "Y" || this.targetDefaultData.MESSAGE.SMS_CHK_YN == "Y");
        this.isMemoVisible = this.IsSc == "Y" || this.targetDefaultData.MESSAGE.MEMO_CHK_YN == "Y";
        this.isEmailVisible = this.IsSc == "Y" || this.targetDefaultData.MESSAGE.EMAIL_CHK_YN == "Y";

        if (this.DOC_GUBUN == "999") {
            this.isToVisible = this.targetDefaultData.MESSAGE.TO_CHK_YN;
            this.isCcVisible = this.targetDefaultData.MESSAGE.CC_CHK_YN;
            this.isShareVisible = this.targetDefaultData.MESSAGE.SHARE_CHK_YN;
            this.isWriterVisible = this.targetDefaultData.MESSAGE.WRITER_CHK_YN;
            if (this.targetDefaultData.MESSAGE.REPLY_CHK_YN)
                this.isReplyVisible = this.targetDefaultData.MESSAGE.REPLY_CHK_YN;
            this.isCSVisible = this.targetDefaultData.MESSAGE.CSSHARE_CHK_YN;
        }
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
        var headerOption = [];

        if (!$.isEmpty(this.RECEIVE_FORM_TYPE)) {
            headerOption.push({ id: "EmailReceiveForm", label: ecount.resource.LBL09727 }); // 메일수신화면양식
        }

        // program_seq 0 으로 보내고 있으므로 의미없음. Dev.Support 200번 게시글에서 제거하기로 결정
        //headerOption.push({ id: "SelfCustomizing", label: ecount.resource.LBL01457 }); // 사용방법설정 

        header.setTitle(ecount.resource.LBL35346) // 알림설정
            .notUsedBookmark();
        if (headerOption.length > 0) {
            header.add("option", headerOption, false);
        }
    },

    onInitContents: function (contents, resource) {

        var g = widget.generator,
            txtGrid = g.grid(),
            receiverGrid = g.grid(),
            ctrl = g.control(),
            form = g.form(),
            tabContents = g.tabContents(),
            searchToolbar = g.toolbar();

        if (this.isUseSMS) {
            var templateTable = [
                "<table class=\"table table-bordered table-layout-auto table-nowrap\">",
                "<colgroup><col style=\"width:155px;\"/><col/></colgroup>",
                "<thead>",
                "<tr><th>" + ecount.resource.LBL00703 + "</th><th>" + ecount.resource.LBL01280 + "</th></tr>",
                "</thead>",
                "<tbody>",
                "<tr id=\"row-SMS_TXT\"><th></th><td></td></tr>",
                "<tr id=\"row-EMAIL_TXT\"><th></th><td></td></tr>",
                "<tr id=\"row-MEMO_TXT\"><th></th><td></td></tr>",
                "</tbody>",
                "</table>",
            ].join("\n");
        }
        else {
            var templateTable = [
                "<table class=\"table table-bordered table-layout-auto table-nowrap\">",
                "<colgroup><col style=\"width:155px;\"/><col/></colgroup>",
                "<thead>",
                "<tr><th>" + ecount.resource.LBL00703 + "</th><th>" + ecount.resource.LBL01280 + "</th></tr>",
                "</thead>",
                "<tbody>",
                "<tr id=\"row-EMAIL_TXT\"><th></th><td></td></tr>",
                "<tr id=\"row-MEMO_TXT\"><th></th><td></td></tr>",
                "</tbody>",
                "</table>",
            ].join("\n");
        }

        // 메일수신화면양식
        if (!$.isEmpty(this.viewBag.InitDatas.ReceiveFormList) && !['999', '900', '901'].contains(this.DOC_GUBUN)) {
            form.add(ctrl.define('widget.select', 'mailReceiveForm', 'mailReceiveForm', ecount.resource.LBL09727)  //메일수신화면양식 
                .option(this.getFormListData(this.viewBag.InitDatas.ReceiveFormList))
                .select(this.receiveSelectedFormSeq).singleCell().end());
        }

        // 문서구분
        if (this.IsDocTypeDisplay == "Y") {

            form.add(ctrl.define("widget.select", "DOC_GUBUN", "DOC_GUBUN", ecount.resource.LBL14263).option([
                ["00", ecount.resource.LBL00830],
                ["211", ecount.resource.LBL09019],
                ["212", ecount.resource.LBL09020],
                ["214", ecount.resource.LBL02938],
                ["215", ecount.resource.LBL08581],
                ["216", ecount.resource.LBL03858],
                ["223", ecount.resource.LBL04600],
                ["224", ecount.resource.LBL04601],
                ["227", ecount.resource.LBL93739],
                ["225", ecount.resource.LBL00683],
                ["226", ecount.resource.LBL93330],
                ["217", ecount.resource.LBL02361],
                ["218", ecount.resource.LBL01554],
                ["219", ecount.resource.LBL01564 + " " + ecount.resource.LBL02263],
                ["220", ecount.resource.LBL01565 + " " + ecount.resource.LBL02263],
                ["221", ecount.resource.LBL01171 + " " + ecount.resource.LBL02263],
                ["222", ecount.resource.LBL02730],
                ["228", ecount.resource.LBL93360],
                ["229", ecount.resource.LBL93363],
                ["230", ecount.resource.LBL93687],
                ["231", ecount.resource.LBL93689],
                ["232", ecount.resource.LBL13024],
                ["235", ecount.resource.LBL93381],
                ["236", ecount.resource.LBL93383],
                ["240", ecount.resource.LBL20105],
                ["705", ecount.resource.LBL18623],
                ["704", ecount.resource.LBL18624],
                ["802", ecount.resource.LBL16417],
                ["806", ecount.resource.LBL18641],
                ["804", ecount.resource.LBL18643],
                ["803", ecount.resource.LBL16535],
                ["807", ecount.resource.LBL18642],
                ["805", ecount.resource.LBL18644],
                ["401", ecount.resource.LBL01607]
            ])
                .select(this.DOC_GUBUN)
                .hasFn([{ id: "defaultSetting", label: ecount.resource.BTN00141 }])
                .end());

        }

        // 알림수단
        if (this.IsTypeDisplay == "Y" || this.IsSc == "Y") {
            var checkedValues = [], hiddenValues = [],
                noticeWayValues = ["SMS", "EMAIL", "MEMO", "APP_PUSH"];

            if (this.isUseSMS && this.targetDefaultData.MESSAGE.SMS_CHK_YN == "Y")
                checkedValues.push("SMS");

            if (this.targetDefaultData.MESSAGE.EMAIL_CHK_YN == "Y")
                checkedValues.push("EMAIL");

            if (this.targetDefaultData.MESSAGE.MEMO_CHK_YN == "Y")
                checkedValues.push("MEMO");

            if (this.targetDefaultData.MESSAGE.APP_PUSH_CHK_YN == "Y")
                checkedValues.push("APP_PUSH");

            if (!this.isUseSMS)
                hiddenValues.push(noticeWayValues.indexOf("SMS"));

            if (this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "N") {
                var receiver = !$.isEmpty(this.targetDefaultData.RECEIVERS) ? this.targetDefaultData.RECEIVERS : this.ReceiverList;

                if (!$.isEmpty(receiver)) {
                    receiver.forEach(function (rv, ri) {
                        this.smsCheckedList.push({ key: rv.USER_ID, value: rv.HPNO_CHK_YN == true || rv.HPNO_CHK_YN == "Y" ? 1 : 0 });
                        this.emailCheckedList.push({ key: rv.USER_ID, value: rv.EMAIL_CHK_YN == true || rv.EMAIL_CHK_YN == "Y" ? 1 : 0 });
                        this.memoCheckedList.push({ key: rv.USER_ID, value: rv.MEMO_CHK_YN == true || rv.MEMO_CHK_YN == "Y" ? 1 : 0 });
                    }.bind(this));
                }
            }
            form.add(ctrl.define("widget.checkbox.noticeWay", "noticeWay", "noticeWay", ecount.resource.LBL09963)
                .label([ecount.resource.LBL93024, ecount.resource.LBL93002, ecount.resource.LBL02695, ecount.resource.LBL10288])
                .value(noticeWayValues)
                .select.apply(ctrl, checkedValues)
                .setOptions({
                    number: [
                        this.smsCheckedList.sum(function (v) { return v.value; }),
                        this.emailCheckedList.sum(function (v) { return v.value; }),
                        this.memoCheckedList.sum(function (v) { return v.value; }),
                        this.memoCheckedList.sum(function (v) { return v.value; })
                    ],
                    lockKeyIndex: noticeWayValues.indexOf("MEMO"),      //체크/해제시 lockedIndex 컴포넌트의 readonly를 풀 수 있는 컴포넌트 인덱스
                    lockedIndex: noticeWayValues.indexOf("APP_PUSH")
                })
                .hideCheckbox(hiddenValues)
                .end());
        }

        contents.add(form);

        if (this.DOC_GUBUN != '901') {

            // 탭(문구, 수신자목록-탭별)
            this.targetData.forEach(function (v, i) {
                var smsPopOverMsg = ecount.resource.MSG05400;
                var emailPopOverMsg = ecount.resource.MSG05401;
                var memoPopOverMsg = ecount.resource.MSG05402;

                if (this.DOC_GUBUN == "300") { // CS에 적용할 때 리소스 변경 (SC - 거래관리시스템에서 설정 했을 경우)
                    smsPopOverMsg = ecount.resource.MSG07527;
                    emailPopOverMsg = ecount.resource.MSG07528;
                    memoPopOverMsg = ecount.resource.MSG07529;
                }
                else if (this.DOC_GUBUN == "900") {
                    smsPopOverMsg = ecount.resource.MSG07846;
                    emailPopOverMsg = ecount.resource.MSG07847;
                    memoPopOverMsg = ecount.resource.MSG07848;
                }

                form = g.form();

                if (this.isUseSMS) {
                    form.add(ctrl.define("widget.input", "SMS_TXT", "SMS_TXT", ecount.resource.LBL03657).value(v.DATA.MESSAGE.SMS_TXT)
                        .popover(this.toolTipResource || smsPopOverMsg.replaceAll("\n", "<br />")).filter("maxbyte", { message: String.format(ecount.resource.MSG00465, "40", "80"), max: 80 }).dataRules(["required"], ecount.resource.MSG06975).end());
                }

                form.add(ctrl.define("widget.input", "EMAIL_TXT", "EMAIL_TXT", ecount.resource.LBL09915).value(v.DATA.MESSAGE.EMAIL_TXT)
                    .popover(this.toolTipResource || emailPopOverMsg.replaceAll("\n", "<br />")).filter("maxbyte", { message: String.format(ecount.resource.MSG00465, "40", "80"), max: 80 }).dataRules(["required"], ecount.resource.MSG06976).end());

                form.add(ctrl.define("widget.textarea", "MEMO_TXT", "MEMO_TXT", ecount.resource.LBL06787).value(v.DATA.MESSAGE.MEMO_TXT)
                    .popover(this.toolTipResource || memoPopOverMsg.replaceAll("\n", "<br />")).filter("maxlength", { message: String.format(ecount.resource.MSG00465, "125", "250"), max: 250 }).dataRules(["required"], ecount.resource.MSG06977).end());

                form.useCustomForm();
                form.customTemplate(templateTable);
                form.setOptions({ isOnlyBodySearch: true });

                tabContents.createTab(v.CODE, v.TAB_LABEL || this.titleByMessageCode[v.CODE], null, i == 0)
                    .add(form);

                if (this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "Y") {
                    searchToolbar = g.toolbar();
                    searchToolbar.addLeft(ctrl.define("widget.button", "searchText").css("btn btn-default btn-sm visible-border").label(ecount.resource.BTN00784));
                    tabContents.add(searchToolbar);

                    var receiver = !$.isEmpty(v.DATA.RECEIVERS) ? v.DATA.RECEIVERS : this.targetDefaultData.RECEIVERS;

                    if (this.DOC_GUBUN == "210") { //e-Approval Only
                        receiver = v.DATA.RECEIVERS;
                    }
                    receiverGrid = this.createGridObject(receiver, g);
                    tabContents.addGrid("receiverGrid-" + i.toString(), receiverGrid);
                }
            }.bind(this));

            contents.add(tabContents);
        }

        // 선택삭제
        if (this.IsReceiverDisplay == "Y" && this.IsReceiverEditable == "Y") {
            var toolbar1 = g.toolbar();
            toolbar1
                .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                .addLeft(ctrl.define("widget.button", "deleteSelected").label(ecount.resource.BTN00037).hide());

            contents.add(toolbar1);
        }

        // 수신자목록-전체
        if (this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "N") {
            var receiver = !$.isEmpty(this.targetDefaultData.RECEIVERS) ? this.targetDefaultData.RECEIVERS : this.ReceiverList;

            if (this.DOC_GUBUN == "999") {

                // 게시판인 경우 이전에 설정돼있던 값 유지를 위해 (In the case of a bulletin board, to maintain the previously set value)
                if (!$.isEmpty(this.ReceiverList) && $.isEmpty(this.targetDefaultData.RECEIVERS)) {
                    var tempReceiver = Object.clone(this.ReceiverList, true);

                    tempReceiver.forEach(function (tr) {
                        var existItem = receiver.first(function (r) { return tr.USER_ID == r.USER_ID; });
                        if (!$.isEmpty(existItem) && existItem.REPLY_CHK_YN == null)
                            $.extend(tr, existItem);
                    });
                    receiver = tempReceiver;
                }

                var listPerson = [];
                var listPersonTo, listPersonCC, listPersonShare, listPersonWriter, listPersonReply, listPersonCS;
                if (!$.isEmpty(this.targetDefaultData.RECEIVERS)) {
                    listPersonTo = receiver.where(function (item, i) {
                        return (item.TO_CHK_YN == "Y" && item.NOTI_TARGET == "TO");
                    });

                    listPersonCC = receiver.where(function (item, i) {
                        return (item.CC_CHK_YN == "Y" && item.NOTI_TARGET == "CC");
                    });

                    listPersonShare = receiver.where(function (item, i) {
                        return (item.SHARE_CHK_YN == "Y" && item.NOTI_TARGET == "SHARE");
                    });

                    listPersonWriter = receiver.where(function (item, i) {
                        return (item.WRITER_CHK_YN == "Y" && item.NOTI_TARGET == "WRITER");
                    });

                    listPersonReply = receiver.where(function (item, i) {
                        return (item.REPLY_CHK_YN == "Y" && item.NOTI_TARGET == "REPLY");
                    });

                    listPersonCS = receiver.where(function (item, i) {
                        return (item.CSSHARE_CHK_YN == "Y" && item.NOTI_TARGET == "CS");
                    });
                }
                else {
                    listPersonTo = receiver.where(function (item, i) {
                        return (item.TO_CHK_YN == "Y");
                    });

                    listPersonCC = receiver.where(function (item, i) {
                        return (item.CC_CHK_YN == "Y");
                    });

                    listPersonShare = receiver.where(function (item, i) {
                        return (item.SHARE_CHK_YN == "Y");
                    });

                    listPersonWriter = receiver.where(function (item, i) {
                        return (item.WRITER_CHK_YN == "Y");
                    });

                    listPersonReply = receiver.where(function (item, i) {
                        return (item.REPLY_CHK_YN == "Y");
                    });

                    listPersonCS = receiver.where(function (item, i) {
                        return (item.CSSHARE_CHK_YN == "Y");
                    });
                }

                if (!$.isEmpty(listPersonCS) && listPersonCS.length > 0)
                    listPersonCS = this.removeDuplicates(listPersonCS, "USER_ID");

                var isCheckItemWriter = this.isWriterVisible;
                if (listPersonWriter != null && listPersonWriter.length > 0) {
                    var listWriter = Object.clone(listPersonWriter, true);
                    listWriter.where(function (item, i) { return (item.MEMO_CHK_YN == "Y"); }).forEach(function (item, j) {
                        item.CHK_YN = isCheckItemWriter;
                        item.HPNO_CHK_YN = isCheckItemWriter;
                        //item.EMAIL_CHK_YN = isCheckItemWriter;
                        item.MEMO_CHK_YN = isCheckItemWriter;
                        $.extend(item, { NOTI_TARGET: "WRITER", SITE_CHK_YN: isCheckItemWriter, USER_ID_CHK_YN: isCheckItemWriter });
                    });
                    listPerson = listPerson.concat(listWriter);
                }

                var isCheckItemReply = this.isReplyVisible;
                if (listPersonReply != null && listPersonReply.length > 0) {
                    var lisReply = Object.clone(listPersonReply, true);
                    lisReply.where(function (item, i) { return (item.MEMO_CHK_YN == "Y"); }).forEach(function (item, j) {
                        item.CHK_YN = isCheckItemReply;
                        item.HPNO_CHK_YN = isCheckItemReply;
                        //item.EMAIL_CHK_YN = isCheckItemReply;
                        item.MEMO_CHK_YN = isCheckItemReply;
                        $.extend(item, { NOTI_TARGET: "REPLY", SITE_CHK_YN: isCheckItemReply, USER_ID_CHK_YN: isCheckItemReply });
                    });
                    listPerson = listPerson.concat(lisReply);
                }

                var isCheckedItemTo = this.isToVisible;
                if (listPersonTo != null && listPersonTo.length > 0) {
                    var lstTo = Object.clone(listPersonTo, true);
                    lstTo.where(function (item, i) { return (item.MEMO_CHK_YN == "Y"); }).forEach(function (item, j) {
                        item.CHK_YN = isCheckedItemTo;
                        item.HPNO_CHK_YN = isCheckedItemTo;
                        //item.EMAIL_CHK_YN = isCheckedItemTo;
                        item.MEMO_CHK_YN = isCheckedItemTo;
                        $.extend(item, { NOTI_TARGET: "TO", SITE_CHK_YN: isCheckedItemTo, USER_ID_CHK_YN: isCheckedItemTo });

                    });
                    listPerson = listPerson.concat(lstTo);
                }

                var isCheckItemCc = this.isCcVisible;
                if (listPersonCC != null && listPersonCC.length > 0) {
                    var lstCC = Object.clone(listPersonCC, true);
                    lstCC.where(function (item, i) { return (item.MEMO_CHK_YN == "Y"); }).forEach(function (item, j) {
                        item.CHK_YN = isCheckItemCc;
                        item.HPNO_CHK_YN = isCheckItemCc;
                        //item.EMAIL_CHK_YN = isCheckItemCc;
                        item.MEMO_CHK_YN = isCheckItemCc;
                        $.extend(item, { NOTI_TARGET: "CC", SITE_CHK_YN: isCheckItemCc, USER_ID_CHK_YN: isCheckItemCc });
                    });
                    listPerson = listPerson.concat(lstCC);
                }

                var isCheckItemShare = this.isShareVisible;
                if (listPersonShare != null && listPersonShare.length > 0) {
                    var listShare = Object.clone(listPersonShare, true);
                    listShare.where(function (item, i) { return (item.MEMO_CHK_YN == "Y"); }).forEach(function (item, j) {
                        item.CHK_YN = isCheckItemShare;
                        item.HPNO_CHK_YN = isCheckItemShare;
                        //item.EMAIL_CHK_YN = isCheckItemShare;
                        item.MEMO_CHK_YN = isCheckItemShare;
                        $.extend(item, { NOTI_TARGET: "SHARE", SITE_CHK_YN: isCheckItemShare, USER_ID_CHK_YN: isCheckItemShare });
                    });
                    listPerson = listPerson.concat(listShare);
                }

                var isCheckItemCS = this.isCSVisible;
                if (!$.isEmpty(listPersonCS) && listPersonCS.length > 0) {
                    var lstCS = Object.clone(listPersonCS, true);

                    lstCS.where(function (item, i) { return (item.MEMO_CHK_YN == "Y"); }).forEach(function (item, j) {
                        item.CHK_YN = isCheckItemCS;
                        item.HPNO_CHK_YN = isCheckItemCS;
                        //item.EMAIL_CHK_YN = isCheckItemCS;
                        item.MEMO_CHK_YN = isCheckItemCS;
                        $.extend(item, { NOTI_TARGET: "CS", SITE_CHK_YN: isCheckItemCS, USER_ID_CHK_YN: isCheckItemCS });
                    });

                    listPerson = listPerson.concat(lstCS);
                }

                searchToolbar = g.toolbar();
                searchToolbar.addLeft(ctrl.define("widget.button", "searchText").css("btn btn-default btn-sm visible-border").label(ecount.resource.BTN00784));
                contents.add(searchToolbar);

                this.boardReceiver = Object.clone(listPerson, true);
                var siteList = [];
                var site = "";

                this.boardReceiver.forEach(function (v) {
                    site = v.NOTI_TARGET + ecount.grid.constValue.rowKeySeparator + v.SITE;
                    if (this.inSiteList[site] == undefined) {
                        this.inSiteList[site] = new Array();
                    }

                    this.inSiteList[site].push([v.NOTI_TARGET, v.SITE, v.USER_ID, v.UNAME].join(ecount.grid.constValue.rowKeySeparator));

                    if (this.inNotiTargetList[v.NOTI_TARGET] == undefined) {
                        this.inNotiTargetList[v.NOTI_TARGET] = new Array();
                    }

                    if (!siteList.contains(site)) {
                        this.inNotiTargetList[v.NOTI_TARGET].push([v.NOTI_TARGET, v.SITE, v.USER_ID, v.UNAME].join(ecount.grid.constValue.rowKeySeparator));
                        siteList.push([v.NOTI_TARGET, v.SITE].join(ecount.grid.constValue.rowKeySeparator));
                    }

                }.bind(this));

                var receiverGrid = this.createGridObject(listPerson, g);
                contents.addGrid("receiverGrid", receiverGrid);
            }

            if (this.DOC_GUBUN != "999") {
                var receiverGrid = this.createGridObject(receiver, g);
                contents.addGrid("receiverGrid", receiverGrid);
            }
        }
    },

    onInitFooter: function (footer, resource) {
        var generator = widget.generator;
        var toolbar = generator.toolbar();
        var ctrl = generator.control();

        if (this.IsSc == "Y") {
            toolbar
                .addLeft(ctrl.define("widget.button", "Save").label(resource.BTN00065).clickOnce())    //적용
                .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
                .addLeft(ctrl.define("widget.button", "History").label("H"));
        }
        else {
            toolbar
                .addLeft(ctrl.define("widget.button", "Save").label(resource.BTN00070))    //적용
                .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))     // 닫기
        }

        footer.add(toolbar); //toolbar add[footer 영역의 닫기] (Thêm thanh chức năng vào chân trang)
    },

    onInitControl: function (cid, control) {
        switch (cid) {
            case "noticeWay":
                break;
        }
    },

    onLoadComplete: function () {
        this._super.onLoadComplete.apply(this, arguments);

        // SC에서 온거 아니면 체크값에 따라 표출여부 변경
        if (this.DOC_GUBUN != '901') {
            if (this.IsSc != "Y") {
                var isHideSms = false;
                this.targetData.forEach(function (v, i) {
                    var form = this.contents.getForm(v.CODE)[0];

                    if (!this.isSmsVisible || this.targetDefaultData.MESSAGE.SMS_CHK_YN == "N") {
                        form.hideRow("SMS_TXT");
                        isHideSms = true;
                    }
                    if (!this.isEmailVisible || this.targetDefaultData.MESSAGE.EMAIL_CHK_YN == "N")
                        form.hideRow("EMAIL_TXT");
                    if (!this.isMemoVisible || this.targetDefaultData.MESSAGE.MEMO_CHK_YN == "N")
                        form.hideRow("MEMO_TXT");
                }.bind(this));
                if (isHideSms)
                    this.contents.validate();
            } else {
                this.targetData.forEach(function (v, i) {
                    if (!this.isUseSMS) {
                        var smsCtrl = this.contents.getControl("SMS_TXT", v.CODE);
                        if (!$.isEmpty(smsCtrl))
                            smsCtrl.readOnly(true);
                    }
                    if (!this.showEmailDocGubun.contains(this.DOC_GUBUN))
                        this.contents.getControl("EMAIL_TXT", v.CODE).readOnly(true);
                }.bind(this));

                // 이메일 안되는 애들은 비활성화
                if (!this.showEmailDocGubun.contains(this.DOC_GUBUN)) {
                    this.contents.getControl("noticeWay").setReadOnly(true, 1); // 1 is Email column
                }
            }
        }

        //ecmodule.common.formHelper.checkSetupList(this.programSeq); //PROGRAM_SEQ
        if (this.DOC_GUBUN == "999" && this.header.getButton("tgHeaderOption") != null)
            this.header.getButton("tgHeaderOption").disable();
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/

    onPopupHandler: function (control, config, handler) {
        this.idPopupApplyFilterIndex = 0;
        if (control.id === "USER_ID") {
            $.extend(config, {
                Type: 'WID',
                Flag: 'NOTICE',
                isCheckBoxDisplayFlag: true
            });
        }
        handler(config);
    },

    onChangeControl: function (e) {
        switch (e.cid) {
            case "DOC_GUBUN":
                var docGubun = this.contents.getControl("DOC_GUBUN").getValue();
                var url = this.isSVCNoticeSetup(docGubun) ? "/ECERP/SVC/Popup/NoticeSetup?IsSc=" + this.IsSc : "/ECERP/Popup.Common/NoticeSetup?IsSc=" + this.IsSc;
                var param = {};

                if (this.isSVCNoticeSetup(docGubun)) {
                    param = {
                        Request: {
                            DOC_GUBUN: docGubun,
                            IsSc: this.IsSc,
                            RECEIVE_FORM_TYPE: this.getformType(docGubun),
                        }
                    };

                } else {
                    param = {
                        DOC_GUBUN: docGubun,
                        IsSc: this.IsSc,
                        RECEIVE_FORM_TYPE: this.getformType(docGubun),
                    };
                }

                this.onAllSubmitSelf({
                    url: url,
                    param: param
                });
                break;
        }
    },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);

        if (this.DOC_GUBUN == "999") {
            var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;

            var prevSiteCD = "";
            for (var idx = 0, limit = data.dataRows.length; idx < limit; idx++) {
                var curSiteCD = data.dataRows[idx]['NOTI_TARGET'];
                if (curSiteCD != prevSiteCD) {
                    prevSiteCD = curSiteCD;
                    if (data.dataRows[idx].CHK_YN == "Y" || data.dataRows[idx].CHK_YN == true)
                        grid.addChecked(data.dataRows[idx][ecount.grid.constValue.keyColumnPropertyName], { isRunChange: false });
                }
            }
        }
    },

    setReceiverGridSort: function (e, data) {
        var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false),
            gridData, oldGridData = grid.grid.getRowList();

        if (data.sortOrder == "D")
            gridData = this.boardReceiver.sort(function (left, right) {
                var a = left.NOTI_TARGET + ecount.delimiter + left.SITE_DES + ecount.delimiter + left[data.columnId], b = right.NOTI_TARGET + ecount.delimiter + right.SITE_DES + ecount.delimiter + right[data.columnId];
                return a < b ? -1 : a > b ? 1 : 0;
            });
        else
            gridData = this.boardReceiver.sort(function (left, right) {
                var a = left.NOTI_TARGET + ecount.delimiter + left.SITE_DES + ecount.delimiter + left[data.columnId], b = right.NOTI_TARGET + ecount.delimiter + right.SITE_DES + ecount.delimiter + right[data.columnId];
                return a < b ? 1 : a > b ? -1 : 0;
            });

        gridData.forEach(function (v) {
            delete v._MERGE_SET;
            var oldData = oldGridData.first(function (ov) { return v.NOTI_TARGET == v.NOTI_TARGET && v.SITE == ov.SITE && v.USER_ID == ov.USER_ID && v.UNAME == ov.UNAME; });
            if (!$.isEmpty(oldData)) {
                v.CHK_YN = oldData.CHK_YN;
                v.EMAIL_CHK_YN = oldData.EMAIL_CHK_YN;
                v.HPNO_CHK_YN = oldData.HPNO_CHK_YN;
                v.MEMO_CHK_YN = oldData.MEMO_CHK_YN;
            }
        }.bind(this));

        this.makeMergeData4Sort(gridData);
        grid.settings.setRowData(gridData);
        grid.draw();
    },

    // vthien in case dept. column allowed sortable, it is useful. 
    makeMergeData4Sort: function (rowData) {
        var loadDataCnt = rowData.count();
        var site_des = '___';
        var site = '___';
        var tempRowCnt = 1;
        var curMerg = 0;

        var groupBy = rowData.groupBy("NOTI_TARGET");

        for (var group in groupBy) {
            if (groupBy.hasOwnProperty(group)) {
                var cnt = groupBy[group].length;
                groupBy[group][0]["_MERGE_SET"] = [this.setRowSpanMerge(0, cnt), this.setRowSpanMerge(1, cnt)];

                var groupBy2 = groupBy[group].groupBy("SITE_DES");
                for (var groupChild in groupBy2) {
                    if (groupBy2.hasOwnProperty(groupChild)) {
                        var cnt2 = groupBy2[groupChild].length;
                        if (groupBy2[groupChild][0]["_MERGE_SET"]) {
                            groupBy2[groupChild][0]["_MERGE_SET"].push(this.setRowSpanMerge(2, cnt2));
                            groupBy2[groupChild][0]["_MERGE_SET"].push(this.setRowSpanMerge(3, cnt2));
                        }
                        else {
                            groupBy2[groupChild][0]["_MERGE_SET"] = [this.setRowSpanMerge(2, cnt2), this.setRowSpanMerge(3, cnt2)];
                        }
                    }
                }
            }
        }

        return rowData;
    },

    // rowspan merge
    setRowSpanMerge: function (startIndex, rowCnt) {
        var mergeData = {};

        mergeData['_MERGE_USEOWN'] = true;
        if (startIndex == 0)
            mergeData['_IS_CENTER_ALIGN'] = true;
        mergeData['_MERGE_START_INDEX'] = startIndex;
        mergeData['_ROWSPAN_COUNT'] = rowCnt;
        return mergeData;
    },

    //ID항목, ID EventHandler
    setReceiverGridUserID: function (value, rowItem) {
        var option = {};

        option.event = {
            change: function (e, data) {
                var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;

                if ($.isEmpty(data.rowItem["USER_ID"]))
                    grid.setCell('MEMO_CHK_YN', data.rowKey, "N");

                grid.refreshCell('MEMO_CHK_YN', data.rowKey);
            }.bind(this),

            beforeChange: function (e, data) {
                var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;
                var gridRowList = grid.getRowList(),
                    insertFlag = true;

                if (!$.isEmpty(data.newValue)) {
                    $.each(gridRowList, function (i, item) {
                        if (item[ecount.grid.constValue.keyColumnPropertyName] != data.rowKey && data.newValue == item.USER_ID) {
                            var option = {};
                            option.message = ecount.resource.MSG05398;
                            option.showDirect = true;
                            option.hideTimeout = 1000;
                            option.hideAll = true;
                            grid.setCellShowError("USER_ID", item[ecount.grid.constValue.keyColumnPropertyName], option);
                            insertFlag = false;
                            return false;
                        }
                    }.bind(this));
                }

                return insertFlag;
            }.bind(this)
        };

        option.controlOption = {
            codeType: 3,
            controlEvent: {
                itemSelect: function (rowKey, arg) {
                    if (arg.type == "addCode") {
                        var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;
                        var rowData = arg.message.data,
                            continueToChange = true;

                        arg.message.index = this.idPopupApplyFilterIndex++;

                        if (arg.message.position == "next") {
                            if (arg.message.index != 0)
                                rowKey = grid.getNextRowId("USER_ID");

                            // 추가 할 행이 없으면 행 추가
                            if (rowKey == null) {//special-row-0
                                grid.addRow(2);
                                rowKey = grid.getNextRowId("USER_ID");
                            }
                        }

                        //적용시 ItemSelect경우의 beforeChange Return
                        continueToChange = grid.setCell("USER_ID", rowKey, rowData.USER_ID);

                        if (continueToChange !== false) {
                            grid.setCell("UNAME", rowKey, rowData.UNAME);
                            grid.setCell("EMAIL", rowKey, rowData.EMAIL);

                            if (this.showEmailDocGubun.contains(this.DOC_GUBUN)) {
                                grid.refreshCell("EMAIL_CHK_YN", rowKey);
                                grid.setCell("EMAIL_CHK_YN", rowKey, this.targetDefaultData.MESSAGE.EMAIL_CHK_YN == "Y"); //확인
                            }

                            grid.setCell("LAN_TYPE", rowKey, rowData.LAN_TYPE);
                            grid.setCell("MEMO_CHK_YN", rowKey, this.targetDefaultData.MESSAGE.MEMO_CHK_YN == "Y");

                            if (this.isUseSMS) {
                                grid.setCell("HP_NO", rowKey, rowData.HP_NO);
                                grid.refreshCell("HPNO_CHK_YN", rowKey);
                                grid.setCell("HPNO_CHK_YN", rowKey, this.targetDefaultData.MESSAGE.SMS_CHK_YN == "Y"); //확인
                            }

                            if (this.contents.getControl("noticeWay")) {
                                if (this.isUseSMS) {
                                    var smsObj = this.smsCheckedList.first(function (v) { return v.key == rowData.USER_ID; });

                                    if ($.isEmpty(smsObj))
                                        this.smsCheckedList.push({ key: rowData.USER_ID, value: 0 });
                                    else
                                        smsObj.value = 0;
                                }

                                var emailObj = this.emailCheckedList.first(function (v) { return v.key == rowData.USER_ID; }),
                                    memoObj = this.memoCheckedList.first(function (v) { return v.key == rowData.USER_ID; });

                                if ($.isEmpty(emailObj))
                                    this.emailCheckedList.push({ key: rowData.USER_ID, value: 0 });
                                else
                                    emailObj.value = 0;

                                if ($.isEmpty(memoObj))
                                    this.memoCheckedList.push({ key: rowData.USER_ID, value: 0 });
                                else
                                    memoObj.value = 0;

                                var emailCheckedCount = this.emailCheckedList.sum(function (v) { return v.value; }),
                                    memoCheckedCount = this.memoCheckedList.sum(function (v) { return v.value; });

                                if (this.isUseSMS) {
                                    var smsCheckedCount = this.smsCheckedList.sum(function (v) { return v.value; });
                                    this.contents.getControl("noticeWay").setCheckboxNumber([smsCheckedCount, emailCheckedCount, memoCheckedCount, memoCheckedCount], [0, 1, 2, 3]);
                                }
                                else
                                    this.contents.getControl("noticeWay").setCheckboxNumber([emailCheckedCount, memoCheckedCount, memoCheckedCount], [1, 2, 3]);
                            }
                            grid.setCellFocus("UNAME", rowKey);
                        } else
                            this.idPopupApplyFilterIndex--;
                    }
                }.bind(this)
            }
        };
        return option;
    },

    setReceiverGridEmailCheck: function (value, rowItem) {
        var option = {};

        option.attrs = {
            'disabled': rowItem.NOTI_TARGET == "CS" || !ecount.validator.check("email", rowItem['EMAIL'])
        }

        option.event = {
            change: function (e, data) {
                if (this.contents.getControl("noticeWay")) {
                    if (this.IsTypeDisplay == "Y" && this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "N") {
                        var changedObj = this.emailCheckedList.first(function (v) { return v.key == data.rowItem.USER_ID; });
                        if (!$.isEmpty(changedObj))
                            changedObj.value = data.newValue ? 1 : 0;
                    }
                    var checkedCount = this.emailCheckedList.sum(function (v) { return v.value; });
                    this.contents.getControl("noticeWay").setCheckboxNumber([checkedCount], 1);
                }
            }.bind(this)
        };

        option.data = rowItem.NOTI_TARGET == "CS" ? false : (value == "Y" || value == true ? true : false);

        return option;
    },

    setReceiverGridHpNoCheck: function (value, rowItem) {
        var option = {};

        option.attrs = {
            'disabled': $.isEmpty(rowItem['HP_NO']) || !this.isUseSMS
        }

        if (!this.isUseSMS) return option;

        option.event = {
            change: function (e, data) {
                if (this.contents.getControl("noticeWay")) {
                    if (this.IsTypeDisplay == "Y" && this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "N") {
                        var changedObj = this.smsCheckedList.first(function (v) { return v.key == data.rowItem.USER_ID; });
                        if (!$.isEmpty(changedObj))
                            changedObj.value = data.newValue ? 1 : 0;
                    }
                    var checkedCount = this.smsCheckedList.sum(function (v) { return v.value; });
                    this.contents.getControl("noticeWay").setCheckboxNumber([checkedCount], 0);
                }
            }.bind(this)
        };

        option.data = value == "Y" || value == true ? true : false;

        return option;
    },

    // checkbox Msg at Bottom
    setReceiverGridMemoCheck: function (value, rowItem) {
        var option = {};

        option.attrs = {
            'disabled': $.isEmpty(rowItem['USER_ID'])
        }

        option.event = {
            change: function (e, data) {
                if (this.contents.getControl("noticeWay")) {
                    if (this.IsTypeDisplay == "Y" && this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "N") {
                        var changedObj = this.memoCheckedList.first(function (v) { return v.key == data.rowItem.USER_ID; });
                        if (!$.isEmpty(changedObj))
                            changedObj.value = data.newValue ? 1 : 0;
                    }
                    var checkedCount = this.memoCheckedList.sum(function (v) { return v.value; });
                    this.contents.getControl("noticeWay").setCheckboxNumber([checkedCount, checkedCount], [2, 3]);
                }
            }.bind(this)
        };

        option.data = value == "Y" || value == true ? true : false;
        return option;
    },

    setReceiverGridUserIdCheck: function (value, rowItem) {
        var option = {};

        option.event = {
            change: function (e, data) {

                var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;
                var dataKey = data.rowKey;
                var isChecked = e.target.checked;
                grid.setCellTransaction().start();
                if (this.IsSc == "Y") {
                    grid.setCell("EMAIL_CHK_YN", dataKey, isChecked, { isNotCreate: true });
                    if (this.isUseSMS)
                        grid.setCell("HPNO_CHK_YN", dataKey, isChecked, { isNotCreate: true });
                    grid.setCell("MEMO_CHK_YN", dataKey, isChecked, { isNotCreate: true });
                } else {
                    grid.setCell("EMAIL_CHK_YN", dataKey, this.targetDefaultData.MESSAGE.EMAIL_CHK_YN == "Y" && isChecked, { isNotCreate: true });
                    if (this.isUseSMS)
                        grid.setCell("HPNO_CHK_YN", dataKey, this.targetDefaultData.MESSAGE.SMS_CHK_YN == "Y" && isChecked, { isNotCreate: true });
                    grid.setCell("MEMO_CHK_YN", dataKey, this.targetDefaultData.MESSAGE.MEMO_CHK_YN == "Y" && isChecked, { isNotCreate: true });
                }
                grid.setCellTransaction().end();
            }.bind(this)
        };

        option.data = value == "Y" || value == true ? true : false;
        return option;
    },

    setReceiverGridSiteCheck: function (value, rowItem) {
        var option = {};

        option.event = {
            change: function (e, data) {
                var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;
                var site = data.rowItem['NOTI_TARGET'] + ecount.grid.constValue.rowKeySeparator + data.rowItem['SITE']
                if (this.inSiteList[site] != undefined) {

                    var currentInSiteList = this.inSiteList[site];
                    grid.setCellTransaction().start();
                    for (var i = 0, limit = currentInSiteList.length; i < limit; i++) {
                        var dataKey = currentInSiteList[i];
                        var isChecked = e.target.checked;

                        grid.setCell("USER_ID_CHK_YN", dataKey, isChecked, { isNotCreate: true });
                    }//for end
                    grid.setCellTransaction().end();
                }
            }.bind(this)
        };

        option.data = value == "Y" || value == true ? true : false;
        return option;
    },

    //이메일항목 이벤트핸들러, Email EventHandler
    setReceiverGridEmail: function (value, rowItem) {
        var option = {};

        if (rowItem.NOTI_TARGET == "CS") {
            option.editableState = 0;
            option.data = '';
        } else {
            option.event = {
                'keydown': function (e, data) {
                    var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;

                    if (!ecount.validator.check("email", data.newValue))
                        grid.setCell("EMAIL_CHK_YN", data.rowKey, "N");

                    grid.setCell("EMAIL", data.rowKey, data.newValue, { isInputNotRefresh: true });
                    grid.refreshCell("EMAIL_CHK_YN", data.rowKey);
                }.bind(this)
            };
        }
        return option;
    },

    // check box content Mobile
    setReceiverGridHpNo: function (value, rowItem) {
        var option = {};

        if (!this.isUseSMS) return option;

        option.event = {
            'keydown': function (e, data) {
                var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;

                if ($.isEmpty(data.newValue))
                    grid.setCell('HPNO_CHK_YN', data.rowKey, "N");

                grid.setCell('HP_NO', data.rowKey, data.newValue, { isInputNotRefresh: true });
                grid.refreshCell('HPNO_CHK_YN', data.rowKey);
            }.bind(this)
        };

        return option;
    },

    setReceiverGridCheckbox: function () {

        return {
            'change': function (e, data) {
                var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;
                var isChecked = grid.isChecked(data.rowKey) ? "Y" : "N";

                if (this.DOC_GUBUN == "999") {
                    if (this.inNotiTargetList[data.rowItem['NOTI_TARGET']] != undefined) {

                        var currentinNotiTargetList = this.inNotiTargetList[data.rowItem['NOTI_TARGET']];
                        grid.setCellTransaction().start();
                        for (var i = 0, limit = currentinNotiTargetList.length; i < limit; i++) {
                            var dataKey = currentinNotiTargetList[i];
                            var isChecked = grid.isChecked(data.rowKey);

                            grid.setCell("CHK_YN", dataKey, isChecked, { isNotCreate: true });
                            grid.setCell("SITE_CHK_YN", dataKey, isChecked, { isNotCreate: true });

                        }//for end
                        grid.setCellTransaction().end();
                    }
                } else {
                    var _checkedItem = grid.getChecked();
                    if (this.IsSc == "Y") {

                        grid.setCell("EMAIL_CHK_YN", data.rowKey, isChecked);
                        if (this.isUseSMS)
                            grid.setCell("HPNO_CHK_YN", data.rowKey, isChecked);

                        grid.setCell("MEMO_CHK_YN", data.rowKey, isChecked);
                    } else {
                        grid.setCell("EMAIL_CHK_YN", data.rowKey, this.targetDefaultData.MESSAGE.EMAIL_CHK_YN == "Y" && isChecked);
                        if (this.isUseSMS)
                            grid.setCell("HPNO_CHK_YN", data.rowKey, this.targetDefaultData.MESSAGE.SMS_CHK_YN == "Y" && isChecked);

                        grid.setCell("MEMO_CHK_YN", data.rowKey, this.targetDefaultData.MESSAGE.MEMO_CHK_YN == "Y" && isChecked);
                    }

                    if (this.contents.getControl("deleteSelected")) {
                        if (_checkedItem.length > 0)
                            this.contents.getControl("deleteSelected").show();
                        else
                            this.contents.getControl("deleteSelected").hide();
                    }
                }
            }.bind(this)
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onContentsDeleteSelected: function () {
        var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid,
            selectItem = grid.getChecked();

        grid.removeCheckedRow();
        // row를 지운후 체크박스 사용여부를 처리 하기 위해서 강제로 Setting
        for (var i = 0; i < selectItem.length; i++) {
            this.setReceiverGridEmailCheck(false, selectItem[i]);
            this.setReceiverGridHpNoCheck(false, selectItem[i]);
            this.setReceiverGridMemoCheck(false, selectItem[i]);

            grid.refreshCell("EMAIL_CHK_YN", selectItem[i][ecount.grid.constValue.keyColumnPropertyName]);
            if (this.isUseSMS)
                grid.refreshCell("HPNO_CHK_YN", selectItem[i][ecount.grid.constValue.keyColumnPropertyName]);
            grid.refreshCell("MEMO_CHK_YN", selectItem[i][ecount.grid.constValue.keyColumnPropertyName]);

            if (this.contents.getControl("noticeWay")) {
                if (this.isUseSMS) {
                    var smsObj = this.smsCheckedList.first(function (v) { return v.key == selectItem[i].USER_ID; });

                    if ($.isEmpty(smsObj))
                        this.smsCheckedList.push({ key: selectItem[i].USER_ID, value: 0 });
                    else
                        smsObj.value = 0;
                }

                var emailObj = this.emailCheckedList.first(function (v) { return v.key == selectItem[i].USER_ID; }),
                    memoObj = this.memoCheckedList.first(function (v) { return v.key == selectItem[i].USER_ID; });

                if ($.isEmpty(emailObj))
                    this.emailCheckedList.push({ key: selectItem[i].USER_ID, value: 0 });
                else
                    emailObj.value = 0;

                if ($.isEmpty(memoObj))
                    this.memoCheckedList.push({ key: selectItem[i].USER_ID, value: 0 });
                else
                    memoObj.value = 0;

                var emailCheckedCount = this.emailCheckedList.sum(function (v) { return v.value; }),
                    memoCheckedCount = this.memoCheckedList.sum(function (v) { return v.value; });

                if (this.isUseSMS) {
                    var smsCheckedCount = this.smsCheckedList.sum(function (v) { return v.value; });
                    this.contents.getControl("noticeWay").setCheckboxNumber([smsCheckedCount, emailCheckedCount, memoCheckedCount, memoCheckedCount], [0, 1, 2, 3]);
                }
                else
                    this.contents.getControl("noticeWay").setCheckboxNumber([emailCheckedCount, memoCheckedCount, memoCheckedCount], [1, 2, 3]);
            }
        }

        this.contents.getControl("deleteSelected").hide();
    },

    onFunctionDefaultSetting: function (e) {
        var param = { DOC_GUBUN: "00" };

        ecount.common.api({
            url: "/Common/Infra/GetNotification",
            data: Object.toJSON(param),
            success: function (result) {
                if (result.Status == "200") {
                    var notiCheck = result.Data.NotiCheck;
                    var notiList = result.Data.Noti;
                    var receiverList = result.Data.ReceiverList;

                    var checked = [], unchecked = [];

                    if (this.isUseSMS) {
                        if (notiCheck.SMS_CHK_YN == "Y")
                            checked.push("SMS");
                        else
                            unchecked.push("SMS");
                    }

                    if (notiCheck.EMAIL_CHK_YN == "Y")
                        checked.push("EMAIL");
                    else
                        unchecked.push("EMAIL");

                    if (notiCheck.MEMO_CHK_YN == "Y")
                        checked.push("MEMO");
                    else
                        unchecked.push("MEMO");

                    if (notiCheck.APP_PUSH_CHK_YN == "Y")
                        checked.push("APP_PUSH");
                    else
                        unchecked.push("APP_PUSH");

                    this.contents.getControl("noticeWay").setCheckedValue(checked, true);
                    this.contents.getControl("noticeWay").setCheckedValue(unchecked, false);

                    notiList.forEach(function (v, i) {
                        if (this.contents.getTabContents().tabItems[v.Key.NOTI_TYPE]) {
                            if (this.isUseSMS)
                                this.contents.getControl("SMS_TXT", v.Key.NOTI_TYPE).setValue(v.SMS_TXT);

                            this.contents.getControl("EMAIL_TXT", v.Key.NOTI_TYPE).setValue(v.EMAIL_TXT);
                            this.contents.getControl("MEMO_TXT", v.Key.NOTI_TYPE).setValue(v.MEMO_TXT);
                        }
                    }.bind(this));

                    receiverList.forEach(function (item, idx) {
                        if (!this.showEmailDocGubun.contains(this.DOC_GUBUN)) {
                            item.EMAIL = "";
                        }
                    }.bind(this));

                    var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false);

                    if (this.IsReceiverByTab == "N") {
                        grid.settings.setRowData(receiverList);
                        grid.draw();
                    }

                    this.smsCheckedList = [], this.emailCheckedList = [], this.memoCheckedList = [];

                    var receiver = !$.isEmpty(this.targetDefaultData.RECEIVERS) ? this.targetDefaultData.RECEIVERS : this.ReceiverList;

                    if (!$.isEmpty(receiverList)) {
                        receiverList.forEach(function (rv, ri) {
                            if (this.isUseSMS)
                                this.smsCheckedList.push({ key: rv.USER_ID, value: rv.HPNO_CHK_YN == true || rv.HPNO_CHK_YN == "Y" ? 1 : 0 });

                            this.emailCheckedList.push({ key: rv.USER_ID, value: rv.EMAIL_CHK_YN == true || rv.EMAIL_CHK_YN == "Y" ? 1 : 0 });
                            this.memoCheckedList.push({ key: rv.USER_ID, value: rv.MEMO_CHK_YN == true || rv.MEMO_CHK_YN == "Y" ? 1 : 0 });

                        }.bind(this));
                    }

                    var emailCheckedCount = this.emailCheckedList.sum(function (v) { return v.value; }),
                        memoCheckedCount = this.memoCheckedList.sum(function (v) { return v.value; });

                    if (this.isUseSMS) {
                        var smsCheckedCount = this.smsCheckedList.sum(function (v) { return v.value; });
                        this.contents.getControl("noticeWay").setCheckboxNumber([smsCheckedCount, emailCheckedCount, memoCheckedCount, memoCheckedCount], [0, 1, 2, 3]);
                    }
                    else
                        this.contents.getControl("noticeWay").setCheckboxNumber([emailCheckedCount, memoCheckedCount, memoCheckedCount], [1, 2, 3]);
                }
                else {
                    ecount.alert(result.fullErrorMsg);
                }
            }.bind(this)
        });
    },

    onContentsSearchText: function (e) {
        this.ON_KEY_F3();
    },

    onFooterSave: function () {

        if (this.IsSc == "Y") {
            this.saveData();
        } else {
            this.applyData();
        }
    },

    onFooterClose: function (e) {
        this.close();
    },

    onFooterHistory: function () {
        var lastEditId = "", lastEditTiem = "";

        if (this.lastEditInfo) {
            lastEditId = this.lastEditInfo.WID;
            lastEditTime = this.lastEditInfo.WDATE;
        } else {
            lastEditTime = this.NotiCheck.Key.COM_CODE == this.viewBag.COM_CODE ? (this.NotiCheck.EDIT_DT || this.NotiCheck.WRITE_DT) : "",
                lastEditId = this.NotiCheck.Key.COM_CODE == this.viewBag.COM_CODE ? (this.NotiCheck.EDITOR_ID || this.NotiCheck.WRITER_ID) : "";
        }
        var param = {
            width: 450,
            height: 150,
            lastEditTime: lastEditTime,
            lastEditId: lastEditId,
            parentPageID: this.pageID,
            responseID: this.callbackID
        }
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        });
    },

    // Option -> 메일수신화면양식
    onDropdownEmailReceiveForm: function (e) {
        if (["SJ010", "SJ020", "SJ210", "SJ500", "SJ770", "SJ743", "SJ600", "SJ420", "SJ220", "SJ410", "SJ200", "SJ610", "SJ940", "SJ240", "SJ780", "SJ650", "SJ690"].contains(this.RECEIVE_FORM_TYPE) // From 구매 조회
        ) {
            ecount.alert(ecount.resource.MSG05714);
            return false;
        }
        var ctrl = this.contents.getControl("mailReceiveForm");
        var receiverFormSeq = ctrl.getValue() == 1000 ? 0 : ctrl.getValue();

        var param = {
            width: 700,
            height: 600,
            FORM_TYPE: this.RECEIVE_FORM_TYPE,
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

    // 사용방법설정 Dropdown Self-Customizing click event
    //onDropdownSelfCustomizing: function (e) {
    //    var params = {
    //        width: 750,
    //        height: this.selfCustomizingHeight,
    //        programSeq: this.programSeq,
    //        programID: "NOTICE_SETUP"
    //    };

    //    this.openWindow({
    //        url: '/ECERP/ESC/ESC002M',
    //        name: ecount.resource.LBL01457,
    //        param: params,
    //        fpopupID: this.ecPageID,
    //        popupType: false,
    //    });
    //},

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    ON_KEY_F3: function (e) {
        var grid = this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid;

        grid.searchInputText("searchText");
        e && e.preventDefault();
    },

    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },

    ON_KEY_ENTER: function (e, target) {
        // set default enter keypess(xử lý load mặt định khi nhấn enter tại nút thiết lập mặt định)
        if (target != null && target.cid == 'defaultSetting') {
            this.onContentsDefaultSetting();
        }
        else {
            if (e.target.attributes['id'] && e.target.attributes['id'].value == "txt-contents-searchText-searchText") {
                this.contents.getGrid(null, this.IsReceiverByTab == "Y" ? this.contents.currentTabId : false).grid.searchTextCellHighlight(e.target.value);
                e.stopPropagation();
                e.preventDefault();
            }
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    createGridObject: function (receiver, generator) {

        var receiverGrid = generator.grid();

        //if (this.DOC_GUBUN == "999")
        //    this.isEmailVisible = true;
        var columns = [
            { id: "USER_ID", propertyName: "USER_ID", title: ecount.resource.LBL01809, width: "", controlType: this.IsReceiverEditable == "N" ? "widget.label" : "widget.code.user", validation: this.CheckSpecialCharacterEtc.bind(this), editableState: this.IsReceiverSelectable },   //아이디 
            { id: "UNAME", propertyName: "UNAME", title: ecount.resource.LBL13759, width: "", controlType: this.IsReceiverEditable == "N" ? "widget.label" : "widget.input", editableState: this.IsReceiverSelectable },       //이름
            { id: "EMAIL_CHK_YN", propertyName: "EMAIL_CHK_YN", isHideColumn: !this.isEmailVisible, align: "center", width: "30", controlType: "widget.checkbox", columnOption: { attrs: { 'disabled': !this.showEmailDocGubun.contains(this.DOC_GUBUN) } } },
            {
                id: "EMAIL", propertyName: "EMAIL", isHideColumn: !this.isEmailVisible, title: ecount.resource.LBL70053, width: "", controlType: "widget.input", editableState: !this.showEmailDocGubun.contains(this.DOC_GUBUN) && this.IsOrderProc != "Y" ? 0 : 1,
                validation: function (value, rowItem) {
                    var message = ecount.resource.MSG00008, resultFlag = false;   //이메일 형식에 맞춰 입력 바랍니다. 

                    if (rowItem["EMAIL"] && rowItem["EMAIL"].length > 0 && !ecount.validator.check("email", rowItem["EMAIL"]))
                        resultFlag = true;

                    return {
                        result: !resultFlag,
                        error: {
                            popover: { visible: resultFlag, message: message, placement: "top" },
                            css: { visible: resultFlag }
                        }
                    };
                }.bind(this),
            },
            { id: "HPNO_CHK_YN", propertyName: "HPNO_CHK_YN", isHideColumn: !this.isSmsVisible, controlType: "widget.checkbox", align: "center", width: "30" },
            { id: "HP_NO", propertyName: "HP_NO", isHideColumn: !this.isSmsVisible, controlType: "widget.input", title: ecount.resource.LBL35235, width: "", controlOption: { maxLength: 50, numberType: ecount.grid.constValue.numberType.onlyNumber } },
            { id: "MEMO_CHK_YN", propertyName: "MEMO_CHK_YN", isHideColumn: !this.isMemoVisible, align: "center", title: ecount.resource.LBL02695, width: "55", controlType: "widget.checkbox" }

        ];

        if (this.DOC_GUBUN == "999") {
            columns.unshift({ id: 'USER_ID_CHK_YN', propertyName: 'USER_ID_CHK_YN', width: '25', controlType: "widget.checkbox" });
            columns.unshift({ id: 'SITE_DES', propertyName: 'SITE_DES', title: ecount.resource.LBL80077, width: '', controlType: "widget.label" });
            columns.unshift({ id: 'SITE_CHK_YN', propertyName: 'SITE_CHK_YN', width: '25', controlType: "widget.checkbox" });
            columns.unshift({ id: 'NOTI_TARGET', propertyName: 'NOTI_TARGET', title: ecount.resource.LBL00703, width: '', controlType: 'widget.label' });
            this.makeMergeData4Sort(receiver);
        }
        if (this.IsReceiverEditable != "N")
            receiverGrid.setEditable(true, (receiver && receiver.length) || 3, 1);
        else
            receiverGrid.setEditable(true, 0, 0);

        receiverGrid
            .setColumns(columns)
            .setKeyColumn(["SITE", "USER_ID", "UNAME"])
            .setRowData(receiver)
            .setStyleBorderRemoveLeftRight(true)
            .setCheckBoxUse(true)
            .setEventWidgetTriggerObj(this.events)
            .setCustomRowCell("USER_ID", this.setReceiverGridUserID.bind(this))
            .setCustomRowCell("EMAIL_CHK_YN", this.setReceiverGridEmailCheck.bind(this))
            .setCustomRowCell("MEMO_CHK_YN", this.setReceiverGridMemoCheck.bind(this)) // checkbox Msg at Bottom
            .setCustomRowCell("EMAIL", this.setReceiverGridEmail.bind(this))
            .setEventAutoAddRowOnLastRow(this.IsReceiverEditable == "Y", 2)
            .setEditRowDataSample({ CHK_YN: "N", LAN_TYPE: this.viewBag.Language });

        if (this.isUseSMS) {
            receiverGrid.setCustomRowCell("HP_NO", this.setReceiverGridHpNo.bind(this)) // checkbox mobile at Bottom
                .setCustomRowCell("HPNO_CHK_YN", this.setReceiverGridHpNoCheck.bind(this)); // txt mobile at Bottom
        }

        // 게시판이면 정렬기능
        if (this.DOC_GUBUN == "999") {
            receiverGrid.setColumnSortable(true)
                .setKeyColumn(["NOTI_TARGET", "SITE", "USER_ID", "UNAME"])
                .setColumnSortExecuting(this.setReceiverGridSort.bind(this))
                .setColumnSortDisableList(["NOTI_TARGET", "SITE_DES"])
                .setCustomRowCell("SITE_CHK_YN", this.setReceiverGridSiteCheck.bind(this))
                .setCustomRowCell("NOTI_TARGET", this.setValueForNoTiTarGet.bind(this))
                .setCustomRowCell("USER_ID_CHK_YN", this.setReceiverGridUserIdCheck.bind(this));
        }

        receiverGrid.setCheckBoxCallback(this.setReceiverGridCheckbox.call(this));

        return receiverGrid;
    },

    setValueForNoTiTarGet: function (value, rowItem) {
        var option = {};

        if (rowItem.NOTI_TARGET == "TO") {
            option.data = ecount.resource.LBL02458;
        }
        else if (rowItem.NOTI_TARGET == "CC") {
            option.data = ecount.resource.LBL02715;
        }
        else if (rowItem.NOTI_TARGET == "SHARE") {
            option.data = ecount.resource.LBL10989;
        }
        else if (rowItem.NOTI_TARGET == "WRITER") {
            option.data = ecount.resource.LBL02354;
        }
        else if (rowItem.NOTI_TARGET == "REPLY") {
            option.data = ecount.resource.LBL10790;
        }
        else if (rowItem.NOTI_TARGET == "CS") {
            option.data = ecount.resource.LBL09977;
        }
        return option;
    },

    saveData: function (gubun) {
        var btnSave = this.footer.get(0).getControl("Save");

        if (this.getParentInstance().getAuthorize) {
            if (this.getParentInstance().getAuthorize() == false) {
                btnSave.setAllowClick();
                return false;
            }
        }

        var invalidAll = this.contents.validateAll();
        if (invalidAll.result) {
            for (var inv in invalidAll.result) {
                if (invalidAll.result.hasOwnProperty(inv)) {
                    if (!$.isEmpty(invalidAll.result[inv]) && invalidAll.result[inv].length > 0) {
                        btnSave.setAllowClick();
                        return false;
                    }
                }
            }
        }

        var comCode = this.viewBag.COM_CODE,
            userId = this.viewBag.USERID,
            docGubun = (this.contents.getControl("DOC_GUBUN") && this.contents.getControl("DOC_GUBUN").getValue()) || this.DOC_GUBUN;

        var param = { ModifyRowCountOrigin: this.modifyRowCountOrigin };

        var isValid = true;

        if (!$.isEmpty(comCode) && ["G1", "G2"].contains(comCode.substr(0, 2)) && userId.toUpperCase() == "GUEST") {
            btnSave.setAllowClick();
            return false;
        }

        if (this.viewBag.InitDatas.UserPermit == "R" || (this.DOC_GUBUN == "300" && this.viewBag.InitDatas.CSPermision != "W")) {
            btnSave.setAllowClick();
            ecount.alert(ecount.resource.MSG01699) // 권한이 없습니다.마스터에게 문의 바랍니다. resource not found
            return false;
        }

        var chks = this.contents.getControl('noticeWay').getValue();

        for (var i = 0; i < chks.length; i++) {
            param[chks[i].key] = chks[i].value;
        }

        param.EDIT_FLAG_CHECK = this.EditFlagCheck || (this.NotiCheck.Key.COM_CODE == comCode ? "M" : "I");
        param.EDIT_FLAG_MESSAGE = this.EditFlagMessage || this.editFlagMsg;
        param.DOC_GUBUN = docGubun;
        param.MESSAGE = [];
        param.ByUser = this.ByUser || "N";

        if (this.ByUser == "Y") {
            param.TARGET_ID = this.TargetID;
            param.CUST = this.BusinessNo;
        }

        var tabs = this.contents.getTabContents().tabItems;
        var tabOrder = 1;

        for (var tab in tabs) {
            if (tabs.hasOwnProperty(tab)) {
                param.MESSAGE.push({
                    Key: {
                        COM_CODE: comCode,
                        DOC_GUBUN: docGubun,
                        NOTI_TYPE: tab
                    },
                    SMS_TXT: !this.isUseSMS ? "" : this.contents.getControl("SMS_TXT", tab).getValue(),
                    MEMO_TXT: this.contents.getControl("MEMO_TXT", tab).getValue(),
                    EMAIL_TXT: this.contents.getControl("EMAIL_TXT", tab).getValue(),
                    SORT_ORDER: tabOrder++
                });
            }
        }

        if (this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "N") {
            var grid = this.contents.getGrid("receiverGrid", false).grid;
            isValid = grid.validate().result;
            var seq = 1;

            param.RECEIVERS = grid.getRowList().where(function (v, i) {
                v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                v.EMAIL_CHK_YN = v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y" ? "Y" : "N";
                v.HPNO_CHK_YN = v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y" ? "Y" : "N";
                v.MEMO_CHK_YN = v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y" ? "Y" : "N";

                var isAdded = !$.isEmpty(v.USER_ID) || !$.isEmpty(v.UNAME) || !$.isEmpty(v.EMAIL) || !$.isEmpty(v.HP_NO) ||
                    v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y";

                if (isAdded)
                    v.SEQ = seq++;

                return isAdded;
            });
        }

        if (isValid) {
            ecount.common.api({
                url: "/Common/Infra/SaveNotification",
                data: Object.toJSON(param),
                success: function (result) {
                    if (result.Status == "200") {
                        if (this.DOC_GUBUN == "300") {
                            var sendParam = {
                                result: {
                                    EMAIL_CHK_YN: param.EMAIL_CHK_YN,
                                    SMS_CHK_YN: !this.isUseSMS ? "" : param.SMS_CHK_YN,
                                    MEMO_CHK_YN: param.MEMO_CHK_YN,
                                    APP_PUSH_CHK_YN: param.APP_PUSH_CHK_YN
                                },
                                callback: this.close.bind(this)
                            };
                            this.sendMessage(this, sendParam);
                        } else {
                            ecount.alert(ecount.resource.MSG00500, function () {
                                this.onAllSubmitSelf({
                                    url: "/ECERP/Popup.Common/NoticeSetup?IsSc=Y",
                                    param: {
                                        DOC_GUBUN: docGubun,
                                        IsSc: "Y",
                                        RECEIVE_FORM_TYPE: this.getformType(docGubun),
                                    }
                                });
                            }.bind(this));
                        }
                    }
                    else {
                        ecount.alert(result.fullErrorMsg);
                        btnSave.setAllowClick();
                    }
                }.bind(this),
                complete: function () {
                    btnSave.setAllowClick();
                }
            });
        }
        else {
            btnSave.setAllowClick();
        }
    },

    applyData: function () {

        var invalidAll = this.contents.validateAll();

        if (invalidAll.result) {
            for (var inv in invalidAll.result) {
                if (invalidAll.result.hasOwnProperty(inv)) {
                    if (!$.isEmpty(invalidAll.result[inv]) && invalidAll.result[inv].length > 0) {
                        this.footer.getControl("Save").setAllowClick();
                        return false;
                    }
                }
            }
        }

        var isValid = true;
        var dataType = this.NoticeType == "approval" ? "APPROVAL" : "SLIP",
            defaultName = dataType + "_DEFAULT",
            dataName = dataType + "_DATA";

        var smsCheckedCount = 0, emailCheckedCount = 0, memoCheckedCount = 0,
            toCheckedCount = 0, ccCheckedCount = 0; shareCheckedCount = 0,
                writerCheckedCount = 0, replyCheckedCount = 0, csCheckedCount = 0;

        var param = {
            DATA: {},
            noticeType: this.NoticeType,//
            callback: this.close.bind(this),
            eApproval: (this.DOC_GUBUN == "210")
        };
        param.DATA[defaultName] = {
            MESSAGE: {},
            RECEIVERS: []
        };
        param.DATA[dataName] = [];

        param.DATA[defaultName].MESSAGE.EMAIL_FORM_SER = this.contents.getControl("mailReceiveForm") && this.contents.getControl("mailReceiveForm").getValue();

        if (this.IsReceiverByTab == "Y") {
            param.DATA[defaultName] = this.data[defaultName];
        }

        param.DATA[defaultName].MESSAGE.EMAIL_CHECKED_COUNT = 0;
        param.DATA[defaultName].MESSAGE.SMS_CHECKED_COUNT = 0;
        param.DATA[defaultName].MESSAGE.MEMO_CHECKED_COUNT = 0;
        param.DATA[defaultName].MESSAGE.APP_CHECKED_COUNT = 0;

        var tabcontents = this.contents.getTabContents();
        if (tabcontents) {
            var tabs = tabcontents.tabItems;
            var tabOrder = 1;
            for (var tab in tabs) {
                if (tabs.hasOwnProperty(tab)) {

                    var paramData = {
                        CODE: tab,
                        TAB_LABEL: tabcontents.getTabInfo(tab).title,
                        DATA: {
                            MESSAGE: {
                                SMS_TXT: !this.isUseSMS ? "" : this.contents.getControl("SMS_TXT", tab).getValue(),
                                MEMO_TXT: this.contents.getControl("MEMO_TXT", tab).getValue(),
                                EMAIL_TXT: this.contents.getControl("EMAIL_TXT", tab).getValue(),
                                SMS_CHECKED_COUNT: 0,
                                EMAIL_CHECKED_COUNT: 0,
                                MEMO_CHECKED_COUNT: 0,
                                APP_CHECKED_COUNT: 0
                            },
                            RECEIVERS: []
                        }
                    }

                    if (this.IsReceiverByTab == "Y") {
                        var grid = this.contents.getGrid(null, tab).grid;
                        isValid = grid.validate().result;

                        if (!isValid)
                            return false;

                        paramData.DATA.RECEIVERS = grid.getRowList();

                        paramData.DATA.RECEIVERS.forEach(function (v) {
                            v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";

                            if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                                v.EMAIL_CHK_YN = "Y";
                                paramData.DATA.MESSAGE.EMAIL_CHECKED_COUNT++;
                            } else
                                v.EMAIL_CHK_YN = "N";

                            if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                                v.HPNO_CHK_YN = "Y";
                                paramData.DATA.MESSAGE.SMS_CHECKED_COUNT++;
                            } else
                                v.HPNO_CHK_YN = "N";

                            if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                                v.MEMO_CHK_YN = "Y";
                                paramData.DATA.MESSAGE.MEMO_CHECKED_COUNT++;
                                paramData.DATA.MESSAGE.APP_CHECKED_COUNT++;
                            } else
                                v.MEMO_CHK_YN = "N";
                            v.APP_PUSH_CHK_YN = v.MEMO_CHK_YN;

                            return !$.isEmpty(v.USER_ID) || !$.isEmpty(v.UNAME) || !$.isEmpty(v.EMAIL) || !$.isEmpty(v.HP_NO) ||
                                v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y";
                        });

                        param.DATA[defaultName].MESSAGE.EMAIL_CHECKED_COUNT += paramData.DATA.MESSAGE.EMAIL_CHECKED_COUNT;
                        param.DATA[defaultName].MESSAGE.SMS_CHECKED_COUNT += paramData.DATA.MESSAGE.SMS_CHECKED_COUNT;
                        param.DATA[defaultName].MESSAGE.MEMO_CHECKED_COUNT += paramData.DATA.MESSAGE.MEMO_CHECKED_COUNT;
                        param.DATA[defaultName].MESSAGE.APP_CHECKED_COUNT += paramData.DATA.MESSAGE.APP_CHECKED_COUNT;
                    }

                    param.DATA[dataName].push(paramData);
                }
            }

        }

        if (this.IsReceiverDisplay == "Y" && this.IsReceiverByTab == "N") {
            var grid = this.contents.getGrid("receiverGrid", false).grid;
            isValid = grid.validate().result;

            if (!isValid)
                return false;

            var isChecked = false;
            var EmailVisible = this.isEmailVisible;
            var MemoVisible = this.isMemoVisible;

            if (this.DOC_GUBUN == "999") {
                var listUserNoti = grid.getRowList();
                var thisObj = this;
                var isCheckNoTiTargetTo = 'N';
                var isCheckNoTiTargetCc = 'N';
                var isCheckNoTiTargetShare = 'N';
                var isCheckNoTiTargetCS = 'N';

                param.DATA[defaultName].MESSAGE.REPLY_CHECKED_COUNT = 0;
                param.DATA[defaultName].MESSAGE.TO_CHECKED_COUNT = 0;
                param.DATA[defaultName].MESSAGE.CC_CHECKED_COUNT = 0;
                param.DATA[defaultName].MESSAGE.SHARE_CHECKED_COUNT = 0;
                param.DATA[defaultName].MESSAGE.WRITER_CHECKED_COUNT = 0;
                param.DATA[defaultName].MESSAGE.CSSHARE_CHECKED_COUNT = 0;

                var listWriter = listUserNoti.where(function (v) {
                    return v.NOTI_TARGET == "WRITER";
                });

                var listTo = listUserNoti.where(function (v) {
                    return v.NOTI_TARGET == "TO";
                });

                var listCc = listUserNoti.where(function (v) {
                    return v.NOTI_TARGET == "CC";
                });

                var listShare = listUserNoti.where(function (v) {
                    return v.NOTI_TARGET == "SHARE";
                });

                var listReply = listUserNoti.where(function (v) {
                    return v.NOTI_TARGET == "REPLY";
                });

                var listCS = listUserNoti.where(function (v) {
                    return v.NOTI_TARGET == "CS";
                });

                param.DATA[defaultName].RECEIVERS = listUserNoti.where(function (v) {

                    if (v.NOTI_TARGET == "WRITER") {
                        v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                        if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                            v.EMAIL_CHK_YN = "Y";
                            emailCheckedCount++;
                        } else
                            v.EMAIL_CHK_YN = "N";

                        if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                            v.HPNO_CHK_YN = "Y";
                            smsCheckedCount++;
                        } else
                            v.HPNO_CHK_YN = "N";

                        if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                            v.MEMO_CHK_YN = "Y";
                            memoCheckedCount++;
                        } else
                            v.MEMO_CHK_YN = "N";

                        if (v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y") {
                            writerCheckedCount++;
                        }

                    }
                    else if (v.NOTI_TARGET == "REPLY") {

                        var userDuplicateWriter = thisObj.checkExistUser(listWriter, v);
                        if (userDuplicateWriter) {
                            v.EMAIL_CHK_YN = "N";
                            v.MEMO_CHK_YN = "N";
                            v.HPNO_CHK_YN = "N";
                        }
                        else {
                            v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                            if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                                v.EMAIL_CHK_YN = "Y";
                                emailCheckedCount++;
                            } else
                                v.EMAIL_CHK_YN = "N";

                            if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                                v.HPNO_CHK_YN = "Y";
                                smsCheckedCount++;
                            } else
                                v.HPNO_CHK_YN = "N";

                            if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                                v.MEMO_CHK_YN = "Y";
                                memoCheckedCount++;
                            } else
                                v.MEMO_CHK_YN = "N";
                        }
                        if (v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y") {
                            isCheckNoTiTargetCc = "Y";
                            replyCheckedCount++;
                        }

                    }
                    else if (v.NOTI_TARGET == "TO") {

                        var user = thisObj.checkExistUser(listWriter, v);
                        var userReply = thisObj.checkExistUser(listReply, v);
                        if (user || userReply) {
                            v.EMAIL_CHK_YN = "N";
                            v.MEMO_CHK_YN = "N";
                            v.HPNO_CHK_YN = "N";
                        }
                        else {
                            v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                            if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                                v.EMAIL_CHK_YN = "Y";
                                emailCheckedCount++;
                            } else
                                v.EMAIL_CHK_YN = "N";

                            if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                                v.HPNO_CHK_YN = "Y";
                                smsCheckedCount++;
                            } else
                                v.HPNO_CHK_YN = "N";

                            if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                                v.MEMO_CHK_YN = "Y";
                                memoCheckedCount++;
                            } else
                                v.MEMO_CHK_YN = "N";
                        }
                        if (v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y") {
                            isCheckNoTiTargetTo = "Y";
                            toCheckedCount++;
                        }

                    }
                    else if (v.NOTI_TARGET == "CC") {
                        var userDuplicateWriter = thisObj.checkExistUser(listWriter, v);
                        var userDuplicateTo = thisObj.checkExistUser(listTo, v);
                        var userReply = thisObj.checkExistUser(listReply, v);
                        if (userDuplicateWriter || userDuplicateTo || userReply) {
                            v.EMAIL_CHK_YN = "N";
                            v.MEMO_CHK_YN = "N";
                            v.HPNO_CHK_YN = "N";
                        }
                        else {
                            v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                            if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                                v.EMAIL_CHK_YN = "Y";
                                emailCheckedCount++;
                            } else
                                v.EMAIL_CHK_YN = "N";

                            if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                                v.HPNO_CHK_YN = "Y";
                                smsCheckedCount++;
                            } else
                                v.HPNO_CHK_YN = "N";

                            if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                                v.MEMO_CHK_YN = "Y";
                                memoCheckedCount++;
                            } else
                                v.MEMO_CHK_YN = "N";
                        }
                        if (v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y") {
                            isCheckNoTiTargetCc = "Y";
                            ccCheckedCount++;
                        }

                    }
                    else if (v.NOTI_TARGET == "SHARE") {

                        var userDuplicateWriter = thisObj.checkExistUser(listWriter, v);
                        var userReply = thisObj.checkExistUser(listReply, v);
                        var userDuplicateTo = thisObj.checkExistUser(listTo, v);
                        var userDuplicateCC = thisObj.checkExistUser(listCc, v);

                        if (userDuplicateWriter || userDuplicateTo || userDuplicateCC || userReply) {
                            v.EMAIL_CHK_YN = "N";
                            v.MEMO_CHK_YN = "N";
                            v.HPNO_CHK_YN = "N";
                        }
                        else {
                            v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                            if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                                v.EMAIL_CHK_YN = "Y";
                                emailCheckedCount++;
                            } else
                                v.EMAIL_CHK_YN = "N";

                            if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                                v.HPNO_CHK_YN = "Y";
                                smsCheckedCount++;
                            } else
                                v.HPNO_CHK_YN = "N";

                            if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                                v.MEMO_CHK_YN = "Y";
                                memoCheckedCount++;
                            } else
                                v.MEMO_CHK_YN = "N";
                        }
                        if (v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y") {
                            isCheckNoTiTargetShare = "Y";
                            shareCheckedCount++;
                        }
                    }
                    else if (v.NOTI_TARGET == "CS") {
                        v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                        if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                            v.EMAIL_CHK_YN = "Y";
                            emailCheckedCount++;
                        } else
                            v.EMAIL_CHK_YN = "N";

                        if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                            v.HPNO_CHK_YN = "Y";
                            smsCheckedCount++;
                        } else
                            v.HPNO_CHK_YN = "N";

                        if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                            v.MEMO_CHK_YN = "Y";
                            memoCheckedCount++;
                        } else
                            v.MEMO_CHK_YN = "N";

                        if (v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y") {
                            isCheckNoTiTargetCS = "Y";
                            csCheckedCount++;
                        }
                    }

                    v._MERGE_SET = null;

                    return !$.isEmpty(v.USER_ID) || !$.isEmpty(v.UNAME) || !$.isEmpty(v.EMAIL) || !$.isEmpty(v.HP_NO) ||
                        v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y";
                });

                param.DATA[defaultName].MESSAGE.REPLY_CHECKED_COUNT += replyCheckedCount;
                param.DATA[defaultName].MESSAGE.TO_CHECKED_COUNT += toCheckedCount;
                param.DATA[defaultName].MESSAGE.CC_CHECKED_COUNT += ccCheckedCount;
                param.DATA[defaultName].MESSAGE.SHARE_CHECKED_COUNT += shareCheckedCount;
                param.DATA[defaultName].MESSAGE.WRITER_CHECKED_COUNT += writerCheckedCount;
                param.DATA[defaultName].MESSAGE.CSSHARE_CHECKED_COUNT += csCheckedCount;

                param.DATA[defaultName].MESSAGE.TO_CHK_YN = isCheckNoTiTargetTo;
                param.DATA[defaultName].MESSAGE.CC_CHK_YN = isCheckNoTiTargetCc;
                param.DATA[defaultName].MESSAGE.SHARE_CHK_YN = isCheckNoTiTargetShare;
                param.DATA[defaultName].MESSAGE.CSSHARE_CHK_YN = isCheckNoTiTargetCS;
            }
            else {
                param.DATA[defaultName].RECEIVERS = grid.getRowList().where(function (v) {
                    v.CHK_YN = v.CHK_YN == true || v.CHK_YN == "Y" ? "Y" : "N";
                    if (v.EMAIL_CHK_YN == true || v.EMAIL_CHK_YN == "Y") {
                        v.EMAIL_CHK_YN = "Y";
                        emailCheckedCount++;
                    } else
                        v.EMAIL_CHK_YN = "N";

                    if (v.HPNO_CHK_YN == true || v.HPNO_CHK_YN == "Y") {
                        v.HPNO_CHK_YN = "Y";
                        smsCheckedCount++;
                    } else
                        v.HPNO_CHK_YN = "N";

                    if (v.MEMO_CHK_YN == true || v.MEMO_CHK_YN == "Y") {
                        v.MEMO_CHK_YN = "Y";
                        memoCheckedCount++;
                    } else
                        v.MEMO_CHK_YN = "N";

                    return !$.isEmpty(v.USER_ID) || !$.isEmpty(v.UNAME) || !$.isEmpty(v.EMAIL) || !$.isEmpty(v.HP_NO) ||
                        v.EMAIL_CHK_YN == "Y" || v.HPNO_CHK_YN == "Y" || v.MEMO_CHK_YN == "Y";
                });
            }
            param.DATA[defaultName].MESSAGE.SMS_CHECKED_COUNT += smsCheckedCount;
            param.DATA[defaultName].MESSAGE.EMAIL_CHECKED_COUNT += emailCheckedCount;
            param.DATA[defaultName].MESSAGE.MEMO_CHECKED_COUNT += memoCheckedCount;
            param.DATA[defaultName].MESSAGE.APP_CHECKED_COUNT += memoCheckedCount;

        }

        if (['900', '901'].contains(this.DOC_GUBUN)) {
            param.ModeOpenPopup = this.ModeOpenPopup;
        }

        this.sendMessage(this, param);
    },

    checkExistUser: function (list, object) {
        var user = list.first(function (v) {
            return v.USER_ID == object.USER_ID && v.USER_ID_CHK_YN == object.USER_ID_CHK_YN;
        });
        return user;
    },

    CheckSpecialCharacterEtc: function (value, rowItem) {
        var message, resultFlag = false;
        var resultObject = ecount.common.ValidCheckSpecialForCodeName(value);

        message = resultObject.message;

        if (resultObject.result == false)
            resultFlag = true;

        return {
            result: !resultFlag,
            error: {
                popover: { visible: resultFlag, message: "", placement: "top" },
                css: { visible: resultFlag }
            }
        };
    },

    //IsEmpty Validation Check
    CheckGridValidation: function (target, value, rowItem) {
        var message,
            resultFlag = false;

        switch (rowItem["TYPE"].toLowerCase()) {
            case "sms":
                message = ecount.resource.MSG06975;// "!!SMS 발송 시 사용할 문구를 입력 바랍니다.";
                break;
            case "memo":
                message = ecount.resource.MSG06977;//"!!쪽지 발송 시 사용할 문구를 입력 바랍니다.";
                break;
            case "email":
                message = ecount.resource.MSG06976;//"!!이메일 발송 시 제목으로 사용할 문구를 입력 바랍니다.";
                break;
        }

        var check = ecount.common.ValidCheckSpecial(value);

        if ($.isEmpty(value) || check.result == false)
            resultFlag = true;

        if (check.result == false)
            message = "";

        return {
            result: !resultFlag,
            error: {
                popover: {
                    visible: resultFlag,
                    message: message,
                    placement: 'top'
                }, css: {
                    visible: resultFlag
                }
            }
        };
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
                    _returnFormListData.push([[this.FORM_SEQ], [String.format("{0} {1}", this.TITLE_NM, this.FORM_SEQ)]]);
            });
        }

        return _returnFormListData;
    },

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

    removeDuplicates: function (originalArray, prop) {
        var newArray = [];
        var lookupObject = {};

        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i];
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i]);
        }
        return newArray;
    },

    getformType: function (docGubun) {
        return this.mapingDocGubunToFormType.where(function (data) {
            return data[0] == docGubun;
        }).first()[1];
    },

    isSVCNoticeSetup: function (docGubun) {
        return this.mapingDocGubunToFormType.where(function (data) {
            return data[0] == docGubun;
        }).first()[2] == "Y" ? true : false;
    }
});