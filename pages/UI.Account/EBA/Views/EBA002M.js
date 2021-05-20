window.__define_resource && __define_resource("MSG05919","LBL90096","MSG05039","MSG03882","LBL03530","LBL01457","LBL08359","LBL00495","BTN00236","MSG01396","MSG00118","LBL03704","BTN00028","LBL00479","MSG01136","MSG00772","MSG00786","LBL00402","MSG03006","LBL03590","LBL02704","LBL01018","MSG03329","LBL04708","LBL35154","MSG03018","LBL35155","LBL08373","LBL03543","LBL02433","LBL08391","LBL08364","LBL10776","LBL08075","LBL03547","LBL03550","LBL03551","LBL00703","MSG00826","LBL00590","MSG00923","LBL03076","LBL07974","LBL01623","LBL06593","LBL06594","LBL06595","BTN00065","BTN00008","BTN00959","BTN00203","BTN00204","BTN00033","MSG00676","MSG02869","MSG04561","LBL93038","MSG01455","LBL09407","MSG01700","MSG85199","MSG03368","MSG05040","MSG00879","MSG07493","MSG08770","MSG00299","LBL07157","LBL07973");
/****************************************************************************************************
1. Create Date : 2017.02.06
2. Creator     : 신선미
3. Description : 회계1>기초등록>계정코드등록  
4. Precaution  :
5. History     : 2017.09.19 (Hao) - Change link banlance status to Chart of Account Status
                 2018.12.27 (HoangLinh): Remove $el
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.25(taind) A19_01497 - 소스코드진단결과 반영 - Master
****************************************************************************************************/
 
ecount.page.factory("ecount.page.popup.type2", "EBA002M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    userPermit: "",
    
    ctrlList: null,
      
    incomeFlag : 0,

    ACC002: null,

    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,

    deptLoadChk : null,
    Acc101GyeCodeChk: null,

    iniYymm: null,
    acctDate: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

    },

    initProperties: function () {
        
        this.ctrlList = [];

        this.ACC002 = {
            GYE_CODE_NEXT:null,
            GYE_DES: null,
            SEARCH_MEMO: null,
            GYE_TYPE: null,
            CR_DR: "DR",
            INPUT_GUBUN: "Y",
            SUM_GUBUN: "3",
            ACC105_SITE: 1,
            ACC105_PJT : 1,
            GROUP_CODE: "",
            GROUP_DES: "",
            SE_NAME: null,
            GYE_DES2: null,

            SUB_GUBUN: "00",
            USE_BILL_YN: "N",

            PY_GYE_GUBUN: "X",
            APPLY_DES: null,
            APPLY_CODE: null,
            PY_GYE_SORT: null,
            GYE_CODE_LINK: null,
            STEP_FLAG: null,
            BS_PL_GUBUN: "N",
            BS_PL_POSITION: null,
            BS_PL_SORT: 0,
            BS_PL_DES: null,
            CHECK_FLAG: null,
            BRACKET: null,
            BS_PL_GUBUN2: "N",
            BS_PL_POSITION2: null,
            BS_PL_SORT2: 0,
            BS_PL_DES2: null,
            CHECK_FLAG2: null,
            BRACKET2: null,

            INEX_CODE: null,

            HANG_NAME: null,
            GYE_NAME: null,
            FUND_CODE: null,
            SHORT_CODE: null,
            SHORT_SORT: null,
            WEB_GUBUN: null,
            EST_GUBUN: null,
            INEX_GUBUN: "B",
            PY_GYE_BALANCE: null,
            TB_GUBUN: null,


            GUBUN: "Y",
            MSG: String.format(ecount.resource.MSG05919, this.GYE_CODE),
            MSG2: "",
            INOUT_FLAG: 'N',//계정타입이 수입, 지출이 있을경우 Y
            CANCEL: 'N',
            WID: null,
            WDATE: null,
            CLOSING_ACCOUNT_YN: "N",   //결산회계처리 설정에 포함되는 계정인지 여부
            ITEM_TYPE_CD: "",
            ITEM_TYPE_NM: ""
        };

        incomeFlag = Number(ecount.config.company.INCOME_FLAG);
        this.userPermit = this.viewBag.Permission.Permit.Value;
        deptLoadChk = this.viewBag.InitDatas.deptLoadChk;
        Acc101GyeCodeChk = this.viewBag.InitDatas.Acc101GyeCodeChk;
        ShowSummary = true;    // 집계구분 없음만 표시할지 여부        
        PrevGyeType = "";
        CashAccount = this.viewBag.InitDatas.CashAccount;        
        iniYymm = ecount.company.INI_YYMM;
        acctDate = ecount.config.account.ACCT_DATE;
    },

    render: function () {
        this._super.render.apply(this);

        if (this.ACC002 && this.ACC002 != '') {
            var data = this.viewBag.InitDatas.deptLoad[0];

            if (this.ACC002 != null && data != null) {
                if (this.EDIT_FLAG == "A") {
                    this.ACC002.GYE_CODE_NEXT = data.GYE_CODE_NEXT;
                    this.ACC002.INPUT_GUBUN = "Y";//입력구분
                    this.ACC002.SUM_GUBUN = "1";//잔액집계구분
                    this.ACC002.GYE_CODE_LINK = "JA";//하이퍼링크대상
                    this.ACC002.PY_GYE_GUBUN = "X";//평가계정
                    if (data.STEP_FLAG != 0) {
                        if (data.STEP_FLAG == "5")
                            this.ACC002.STEP_FLAG = "5";//5탭스면 상위계정동일 처리
                        else
                            this.ACC002.STEP_FLAG = Number(data.STEP_FLAG) + 1;//1증가처리
                    }
                    this.ACC002.BS_PL_POSITION = "1";//인쇄위치
                    this.ACC002.BS_PL_POSITION2 = "1";//인쇄위치
                    if (this.ACC002.GYE_CODE_NEXT != "") {
                        this.ACC002.BS_PL_SORT = this.ACC002.GYE_CODE_NEXT + "0";//표시순서
                        this.ACC002.BS_PL_SORT2 = this.ACC002.GYE_CODE_NEXT + "0";//표시순서
                    }
                    this.ACC002.BS_PL_DES = "";//표시명
                    this.ACC002.BS_PL_DES2 = "";//표시명
                    this.ACC002.BS_PL_GUBUN = "N";//표시여부
                    this.ACC002.BS_PL_GUBUN2 = "N";//표시여부
                    this.ACC002.CHECK_FLAG = "N";//굵게
                    this.ACC002.BRACKET = "N";//괄호
                    this.ACC002.CHECK_FLAG2 = "N";//굵게
                    this.ACC002.BRACKET2 = "N";//괄호
                    this.ACC002.APPLY_CODE = "0000";//대상계정
                    this.ACC002.GROUP_CODE = this.GYE_CODE;//상위계정
                    this.ACC002.GROUP_DES = data.GROUP_DES;//상위계정

                } else {
                    this.ACC002.GYE_DES = data.GYE_DES;
                    this.ACC002.INPUT_GUBUN = data.INPUT_GUBUN;
                    this.ACC002.SUM_GUBUN = data.SUM_GUBUN;
                    this.ACC002.ACC105_SITE = (data.INPUT_GUBUN == "Y" && data.SUM_GUBUN != 1) ? data.ACC105_SITE : 0;
                    this.ACC002.ACC105_PJT = (data.INPUT_GUBUN == "Y" && data.SUM_GUBUN != 1) ? data.ACC105_PJT : 0;
                    this.ACC002.GROUP_CODE = data.GROUP_CODE;
                    this.ACC002.GROUP_DES = data.GROUP_DES;

                    this.ACC002.SUB_GUBUN = data.SUB_GUBUN;
                    this.ACC002.USE_BILL_YN = data.USE_BILL_YN;
                    this.ACC002.PY_GYE_GUBUN = data.PY_GYE_GUBUN;
                    this.ACC002.APPLY_DES = data.APPLY_DES;
                    this.ACC002.APPLY_CODE = data.APPLY_CODE;
                    this.ACC002.GYE_CODE_LINK = data.GYE_CODE_LINK;
                    this.ACC002.STEP_FLAG = data.STEP_FLAG;                    
                    this.ACC002.BS_PL_GUBUN = !$.isEmpty(data.BS_PL_GUBUN) ? data.BS_PL_GUBUN.trim() : '';
                    this.ACC002.BS_PL_POSITION = data.BS_PL_POSITION;
                    this.ACC002.BS_PL_SORT = data.BS_PL_SORT;
                    this.ACC002.BS_PL_DES = data.BS_PL_DES;
                    this.ACC002.CHECK_FLAG = data.CHECK_FLAG;
                    this.ACC002.BRACKET = data.BRACKET;
                    this.ACC002.BS_PL_GUBUN2 = !$.isEmpty(data.BS_PL_GUBUN2) ? data.BS_PL_GUBUN2.trim() : '';
                    this.ACC002.BS_PL_POSITION2 = data.BS_PL_POSITION2;
                    this.ACC002.BS_PL_SORT2 = data.BS_PL_SORT2;
                    this.ACC002.BS_PL_DES2 = data.BS_PL_DES2;
                    this.ACC002.CHECK_FLAG2 = data.CHECK_FLAG2;
                    this.ACC002.BRACKET2 = data.BRACKET2;


                    this.ACC002.GYE_NAME = data.GYE_NAME;
                    this.ACC002.WEB_GUBUN = data.WEB_GUBUN;
                    this.ACC002.INEX_GUBUN = data.INEX_GUBUN;

                    this.ACC002.WID = data.WID;
                    this.ACC002.WDATE = data.WDATE;
                }

                this.ACC002.INOUT_FLAG = data.INOUT_FLAG;
                this.ACC002.GYE_DES2 = data.GYE_DES2;
                this.ACC002.GYE_TYPE = data.GYE_TYPE;
                this.ACC002.CR_DR = (data.CR_DR == null || data.CR_DR == "") ? "DR" : data.CR_DR;
                this.ACC002.SHORT_CODE = data.SHORT_CODE;
                this.ACC002.SHORT_SORT = data.SHORT_SORT;
                this.ACC002.FUND_CODE = data.FUND_CODE;
                this.ACC002.CANCEL = data.CANCEL;
                this.ACC002.HANG_NAME = data.HANG_NAME;
                this.ACC002.EST_GUBUN = data.EST_GUBUN;
                this.ACC002.INEX_CODE = data.INEX_CODE != null ? data.INEX_CODE : "000000000000000000000000000000000000";
                this.ACC002.PY_GYE_BALANCE = data.PY_GYE_BALANCE;
                this.ACC002.PY_GYE_SORT = data.PY_GYE_SORT;
                this.ACC002.TB_GUBUN = data.TB_GUBUN;
                this.ACC002.SEARCH_MEMO = data.SEARCH_MEMO;
                this.ACC002.SE_NAME = data.SE_NAME;
                this.ACC002.CLOSING_ACCOUNT_YN = this.viewBag.InitDatas.ClosingExists;
                this.ACC002.ITEM_TYPE_CD = data.ITEM_TYPE_CD;
                this.ACC002.ITEM_TYPE_NM = data.ITEM_TYPE_NM;
            } else {
                this.ACC002.GYE_DES = "";
                this.ACC002.GYE_DES2 = "";
                this.ACC002.GYE_TYPE = "AS";
                this.ACC002.CR_DR = "DR";
                this.ACC002.GROUP_CODE = "0000";
                this.ACC002.APPLY_CODE = "0000";
                this.ACC002.SHORT_CODE = "000";
                this.ACC002.SHORT_SORT = "0";
                this.ACC002.FUND_CODE = "0";
                this.ACC002.BS_PL_DES = "";
                this.ACC002.CANCEL = "N";

                this.ACC002.HANG_NAME = "";
                this.ACC002.SE_NAME = "";
                this.ACC002.EST_GUBUN = "N";
                this.ACC002.INEX_CODE = "000000000000000000000000000000000000";
                this.ACC002.INEX_GUBUN = "";
                this.ACC002.BS_PL_DES2 = "";
                this.ACC002.PY_GYE_BALANCE = "N";
                this.ACC002.TB_GUBUN = "N";
                this.ACC002.ITEM_TYPE_CD = "";
                this.ACC002.ITEM_TYPE_NM = "";
                //루트인 경우
                if (this.GYE_CODE == "0000") {
                    this.ACC002.INPUT_GUBUN = "N";//입력구분
                    this.ACC002.SUM_GUBUN = "0";//잔액집계구분
                    this.ACC002.GYE_CODE_LINK = "JA";//하이퍼링크대상
                    this.ACC002.PY_GYE_GUBUN = "X";//평가계정
                    this.ACC002.STEP_FLAG = "1";//상위계정
                    this.ACC002.BS_PL_POSITION = "1";//인쇄위치
                    this.ACC002.BS_PL_POSITION2 = "1";//인쇄위치
                    this.ACC002.BS_PL_SORT = "00000";//표시순서
                    this.ACC002.BS_PL_SORT2 = "00000";//표시순서
                    this.ACC002.BS_PL_GUBUN = "N";//표시여부
                    this.ACC002.BS_PL_GUBUN2 = "N";//표시여부
                    this.ACC002.CHECK_FLAG = "N";//굵게
                    this.ACC002.BRACKET = "N";//괄호
                    this.ACC002.CHECK_FLAG2 = "N";//굵게
                    this.ACC002.BRACKET2 = "N";//괄호
                } else {
                    this.ACC002.INPUT_GUBUN = "Y";
                    this.ACC002.SUM_GUBUN = "0";
                    this.ACC002.GYE_CODE_LINK = "JA";
                    this.ACC002.PY_GYE_GUBUN = "N";
                    this.ACC002.STEP_FLAG = "0";
                    this.ACC002.BS_PL_POSITION = "0";
                    this.ACC002.BS_PL_POSITION2 = "0";
                    this.ACC002.BS_PL_SORT = "0";
                    this.ACC002.BS_PL_SORT2 = "0";
                    this.ACC002.BS_PL_GUBUN = "N";
                    this.ACC002.BS_PL_GUBUN2 = "N";
                    this.ACC002.CHECK_FLAG = "Y";
                    this.ACC002.CHECK_FLAG2 = "Y";
                    this.ACC002.BRACKET = "N";
                    this.ACC002.BRACKET2 = "N";
                }
            }

            if (this.EDIT_FLAG == "M") {
                if (deptLoadChk.length > 0) {
                    for (var i = 0; i < deptLoadChk.length; i++) {
                        if (deptLoadChk[i]["GUBUN"] == "1") {
                            if (i == 0) {
                                this.ACC002.MSG = String.format("{0}<br /><br />", this.ACC002.MSG);
                            } else {
                                this.ACC002.MSG = String.format("{0}, ", this.ACC002.MSG);
                            }
                            this.ACC002.GUBUN = "N";
                            if (deptLoadChk[i]["GUBUN_DES"] != "")
                                this.ACC002.MSG = String.format("{0}{1}", this.ACC002.MSG, this.getResource(deptLoadChk[i]["GUBUN_DES"]));
                            else
                                this.ACC002.MSG = String.format("{0}{1}", this.ACC002.MSG, deptLoadChk[i]["SER_DES"]);
                        } else if (deptLoadChk[i]["GUBUN"] == "2") {
                            this.ACC002.MSG = String.format("{0}{1}>{2}", this.ACC002.MSG, ecount.resource.LBL90096, deptLoadChk[i]["GUBUN_DES"]);
                        } else if (deptLoadChk[i]["GUBUN"] == "5") {
                            this.ACC002.GUBUN = "5";
                            var gye_code_des = String.format("[{0}] {1}", deptLoadChk[i]["GUBUN_DES"], deptLoadChk[i]["SER_DES"]);
                            this.ACC002.MSG = String.format(ecount.resource.MSG05039, gye_code_des);
                        }
                    }
                }

                if (this.ACC002.INPUT_GUBUN == "Y" && Acc101GyeCodeChk.length > 0) {
                    this.ACC002.MSG2 = ecount.resource.MSG03882;
                    for (var i = 0; i < Acc101GyeCodeChk.length; i++) {
                        this.ACC002.MSG2 += String.format("<br />{0}/{1}/{2}-{3}", Acc101GyeCodeChk[i]["SLIP_DATE"].substr(0, 4), Acc101GyeCodeChk[i]["SLIP_DATE"].substr(4, 2), Acc101GyeCodeChk[i]["SLIP_DATE"].substr(6), Acc101GyeCodeChk[i]["TRX_NO"])
                    }
                }
            }

            // 현금계정 or 재무제표 계정이 아닌 경우 or 결산회계처리에 포함된 계정일 경우 집계구분은 없음만 보여준다
            ShowSummary = this.GYE_CODE == CashAccount || !["AS", "DE", "CP"].contains(this.ACC002.GYE_TYPE) || this.ACC002.CLOSING_ACCOUNT_YN == "Y" ? false : true;
            PrevGyeType = this.ACC002.GYE_TYPE;
        }
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL03530)
            .add("option", [
                { id: "SelfCustomizing", label: ecount.resource.LBL01457 }
            ]);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var permit = this.viewBag.Permission.Permit;
        //----------------------------------------------------
        var g = widget.generator,
            ctrl = g.control(),
            res = ecount.resource,
            form1 = g.form(),
            form2 = g.form(),
            form3 = g.form(),
            form4 = g.form()
            setting1 = widget.generator.settingPanel(),
            setting2 = widget.generator.settingPanel(),
            setting3 = widget.generator.settingPanel(),
            setting4 = widget.generator.settingPanel();
        
        var optionList = [];
        //계정정보
        setting1.focusIndex(1)
             .setId("setting1")
             .header(ecount.resource.LBL08359);

        form1.template("register")
            //계정코드
            .add(
                   this.EDIT_FLAG == "A" ?
                       ctrl.define("widget.input.codeType", "GYE_CODE", "GYE_CODE", res.LBL00495)
                           .hasFn([{ id: "Check", label: res.BTN00236 }])
                           .filter("maxbyte", { message: res.MSG01396, max: 8 })
                           .dataRules(["required"], res.MSG00118)
                           .value("")
                           .popover(String.format(res.LBL03704, 8)).end()
                       :
                    this.EDIT_FLAG != "M" ?
                        ctrl.define("widget.input.codeType", "GYE_CODE", "GYE_CODE", res.LBL00495)
                            .hasFn([{ id: "Check", label: res.BTN00236 }])
                            .filter("maxbyte", { message: res.MSG01396, max: 8 })
                            .dataRules(["required"], res.MSG00118)
                            .value(this.ACC002.GYE_CODE_NEXT)
                            .popover(String.format(res.LBL03704, 8)).end()
                        :
                        ctrl.define("widget.label", "GYE_CODE", "GYE_CODE", res.LBL00495)
                            .hasFn([{ id: "Copy", label: res.BTN00028 }])
                            .label(this.GYE_CODE).popover(String.format(res.LBL03704, 8)).end()
                )
            //계정명
            .add(ctrl.define("widget.input.codeName", "GYE_DES", "GYE_DES", res.LBL00479)
                    .filter("maxlength", { message: String.format(res.MSG01136, "100", "100"), max: 100 })
                    .value(this.ACC002.GYE_DES)
                    .dataRules(["required"], res.MSG00772)
                    .popover(res.MSG00786).end())
            //검색창내용
            .add(ctrl.define("widget.input.general", "SEARCH_MEMO", "SEARCH_MEMO", res.LBL00402)
                   .filter("maxlength", { message: String.format(res.MSG01136, "100", "100"), max: 100 })
                    .value(this.ACC002.SEARCH_MEMO)
                    .popover(res.MSG03006).end())
            //대차구분
        .add(ctrl.define("widget.radio", "CR_DR", "CR_DR", ecount.resource.LBL03590)
                    .label([ecount.resource.LBL02704, ecount.resource.LBL01018])
                    .value(["DR", "CR"])
                    .select(this.ACC002.CR_DR)
                    .popover(ecount.resource.MSG03329).end());

        var chk = ["0", "0"];
        if (this.ACC002.INPUT_GUBUN == "Y" && this.ACC002.SUM_GUBUN != 1) {
            if (this.ACC002.ACC105_SITE == 1 && this.ACC002.ACC105_PJT == 1) {
                chk = ["1", "2"];
            }
            else if (this.ACC002.ACC105_SITE == 1) {
                chk = ["1"];
            }
            else if (this.ACC002.ACC105_PJT == 1) {
                chk = ["2"];
            }
        }

        //계정구분
        form1.add(ctrl.define("widget.combine.accountType", "INPUT_GUBUN", "INPUT_GUBUN", res.LBL04708)
	            .fixedSelect([this.ACC002.GYE_TYPE, this.ACC002.INPUT_GUBUN, this.ACC002.SUM_GUBUN, chk, { label: this.ACC002.GROUP_DES, value: this.ACC002.GROUP_CODE }, this.ACC002.GYE_CODE_LINK, { label: this.ACC002.ITEM_TYPE_NM, value: this.ACC002.ITEM_TYPE_CD }])
	            .setOptions({ showSummary: ShowSummary, INOUT_FLAG: this.ACC002.INOUT_FLAG, closingExist: this.ACC002.CLOSING_ACCOUNT_YN })
	            .end())
            //적요1
        .add(ctrl.define("widget.input.general", "SE_NAME", "SE_NAME", res.LBL35154)
                   .filter("maxlength", { message: String.format(res.MSG01136, "50", "50"), max: 50 })
                    .value(this.ACC002.SE_NAME)
                    .popover(res.MSG03018).end())
            //적요2
        .add(ctrl.define("widget.input.general", "GYE_DES2", "GYE_DES2", res.LBL35155)
                   .filter("maxlength", { message: String.format(res.MSG01136, "100", "100"), max: 100 })
                    .value(this.ACC002.GYE_DES2)
                    .popover(res.MSG03018).end());

        //기타정보
        setting2.focusIndex(2)
            .setId("setting2")
            .header(res.LBL08373);

        form2.template("register")
         //관련업무
        .add(ctrl.define("widget.combine.relatedBusiness", "SUB_GUBUN", "SUB_GUBUN", res.LBL03543)
                    .fixedSelect(this.ACC002.SUB_GUBUN, this.ACC002.USE_BILL_YN).end());

        //재무제표
        setting3.focusIndex(3)
            .setId("setting3")
            .header(res.LBL02433);
        form3.template("register");
        //평가구분
        form3
        .add(ctrl.define("widget.combine.valuation", "PY_GYE_GUBUN", "PY_GYE_GUBUN", res.LBL08391)
        .fixedSelect([this.ACC002.PY_GYE_GUBUN, { label: this.ACC002.APPLY_DES, value: this.ACC002.APPLY_CODE }, this.ACC002.PY_GYE_SORT, this.ACC002.PY_GYE_BALANCE])
        .end());

        optionList = [];
        optionList.push([0, "0", ""]);
        optionList.push([1, "1", ""]);
        optionList.push([2, "2", ""]);
        optionList.push([3, "3", ""]);
        optionList.push([4, "4", ""]);
        optionList.push([5, "5", ""]);

        //들여쓰기순서
        form3.add(ctrl.define("widget.select", "STEP_FLAG", "STEP_FLAG", res.LBL08364)
                      .popover(res.LBL10776)
                      .option(optionList)
                      .select(this.ACC002.STEP_FLAG).end());


        //표시방법1
        chk = ["0", "0"];
        if (this.ACC002.CHECK_FLAG == "Y" && this.ACC002.BRACKET == "Y") {
            chk = ["1", "2"];
        }
        else if (this.ACC002.CHECK_FLAG == "Y") {
            chk = ["1"];
        }
        else if (this.ACC002.BRACKET == "Y") {
            chk = ["2"];
        }
        if (this.EDIT_FLAG == "A") {
        form3
        .add(ctrl.define("widget.combine.displayMethod", "BS_PL_GUBUN1", "BS_PL_GUBUN1", String.format("{0}1", res.LBL08075))
                           .fixedSelect([this.ACC002.BS_PL_GUBUN, this.ACC002.BS_PL_POSITION, "", "", chk])
                       //.fixedSelect([("Y":"N"),("1":"2"),("345"),("표시명"),(["Y":"N","Y":"N"]])) 
                       .end());
        } else {
            form3
                   .add(ctrl.define("widget.combine.displayMethod", "BS_PL_GUBUN1", "BS_PL_GUBUN1", String.format("{0}1", res.LBL08075))
                .fixedSelect([this.ACC002.BS_PL_GUBUN, this.ACC002.BS_PL_POSITION, this.ACC002.BS_PL_SORT, this.ACC002.BS_PL_DES, chk])
            //.fixedSelect([("Y":"N"),("1":"2"),("345"),("표시명"),(["Y":"N","Y":"N"]])) 
            .end());
        }


        //표시방법2
        chk = ["0", "0"];
        if (this.ACC002.CHECK_FLAG2 == "Y" && this.ACC002.BRACKET2 == "Y") {
            chk = ["1", "2"];
        }
        else if (this.ACC002.CHECK_FLAG2 == "Y") {
            chk = ["1"];
        }
        else if (this.ACC002.BRACKET2 == "Y") {
            chk = ["2"];
        }
        if (this.EDIT_FLAG == "A") {
            form3
                .add(ctrl.define("widget.combine.displayMethod", "BS_PL_GUBUN2", "BS_PL_GUBUN2", String.format("{0}2", res.LBL08075))
                .fixedSelect([this.ACC002.BS_PL_GUBUN2, this.ACC002.BS_PL_POSITION2, "", "", chk])
                .end());
        } else {
        form3
        .add(ctrl.define("widget.combine.displayMethod", "BS_PL_GUBUN2", "BS_PL_GUBUN2", String.format("{0}2", res.LBL08075))
                .fixedSelect([this.ACC002.BS_PL_GUBUN2, this.ACC002.BS_PL_POSITION2, this.ACC002.BS_PL_SORT2, this.ACC002.BS_PL_DES2, chk])
                .end());
        }

        contents.add(setting1);
        contents.add(form1);
        contents.add(setting2);
        contents.add(form2);
        contents.add(setting3);
        contents.add(form3);


        if (incomeFlag != 0) {
            //수입지출코드
            setting4.focusIndex(4)
                .setId("setting4")
                .header(res.LBL03547);

            var inex_code = this.ACC002.INEX_CODE == null ? "000000000000000000000000000000000000" : this.ACC002.INEX_CODE;
            
            optionList = [];
            optionList.push(["0", "====", ""]);
            if (inex_code.substr(0, 1) == "C" || inex_code.substr(0, 1) == "D") {
                optionList.push(["C", String.format("C{0}", res.LBL03550), ""]);
                optionList.push(["D", String.format("D{0}", res.LBL03551), ""]);
            } else {
                optionList.push(["A", String.format("A{0}", res.LBL03550), ""]);
                optionList.push(["B", String.format("B{0}", res.LBL03551), ""]);
            }
            

            form4.template("register")
                .add(ctrl.define("widget.select", "INEX_CODE1", "INEX_CODE1", res.LBL00703)
                      .popover(res.MSG00826)
                      .option(optionList)
                      .select(inex_code.substr(0, 1)).end());

            form4.add(ctrl.define("widget.input.general", "INEX_CODE2", "INEX_CODE2", res.LBL00590)
                    .filter("maxbyte", { max: 5 })
                    .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923 })
                    .value(inex_code.substr(1,5)).end());


            if (incomeFlag > 1) {
                form4.add(ctrl.define("widget.input.general", "INEX_CODE3", "INEX_CODE3", res.LBL03076)
                    .filter("maxbyte", { max: 5 })
                    .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923 })
                    .value(inex_code.substr(6, 5)).end());
            }

            if (incomeFlag > 2) {
            form4.add(ctrl.define("widget.input.general", "INEX_CODE4", "INEX_CODE4", res.LBL07974)
                   .filter("maxbyte", { max: 5 })
                    .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923 })
                    .value(inex_code.substr(11, 5)).end());
            }

            if (incomeFlag > 3) {
            form4.add(ctrl.define("widget.input.general", "INEX_CODE5", "INEX_CODE5", res.LBL01623)
                   .filter("maxbyte", { max: 5 })
                    .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923 })
                    .value(inex_code.substr(16, 5)).end());
            }

            if (incomeFlag > 4) {
            form4.add(ctrl.define("widget.input.general", "INEX_CODE6", "INEX_CODE6", res.LBL06593)
                   .filter("maxbyte", { max: 5 })
                    .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923 })
                    .value(inex_code.substr(21, 5)).end());
            }

            if (incomeFlag > 5) {
            form4.add(ctrl.define("widget.input.general", "INEX_CODE7", "INEX_CODE7", res.LBL06594)
                   .filter("maxbyte", { max: 5 })
                    .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923 })
                    .value(inex_code.substr(26, 5)).end());
            }

            if (incomeFlag > 6) {
                form4.add(ctrl.define("widget.input.general", "INEX_CODE8", "INEX_CODE8", res.LBL06595)
                       .filter("maxbyte", { max: 5 })
                    .filter('numberOnlyAndSign', { message: ecount.resource.MSG00923 })
                        .value(inex_code.substr(31, 5)).end());
            }

            contents.add(setting4);
            contents.add(form4);
        }
    },


    onChangeControl: function (control, data) {
        if (control.cid == "INEX_CODE2" || control.cid == "INEX_CODE3" || control.cid == "INEX_CODE4" || control.cid == "INEX_CODE5" || control.cid == "INEX_CODE6" || control.cid == "INEX_CODE7" || control.cid == "INEX_CODE8") {
            control.value = this.setInexCodeData(control.value);
        } else if (control.cid == "INPUT_GUBUN_select" && this.EDIT_FLAG == "M") {
            var controlValue = this.contents.getControl("INPUT_GUBUN").getValue();

            // controlvalue 배열값
            // 0 계정종류
            // 1 입력구분
            // 2 거래처별집계구분
            // 3 부서별/프로젝트별 집계
            // 4 상위계정
            // 5 하이퍼링크대상

            if (this.ACC002.GUBUN == "N" && controlValue[1].value != "Y") {
                ecount.alert(this.ACC002.MSG);
                this.contents.getControl("INPUT_GUBUN").setValue([null, "Y", null, null, null, null]);
                return false;
            } else if (this.ACC002.GUBUN == "5" && controlValue[1].value == "Y") {
                ecount.alert(this.ACC002.MSG);
                this.contents.getControl("INPUT_GUBUN").setValue([null, "N", null, null, null, null]);
                return false;
            } else if (controlValue[1].value == "N" && Acc101GyeCodeChk.length > 0 && this.ACC002.MSG2 != "") {
                ecount.alert(this.ACC002.MSG2);
                this.contents.getControl("INPUT_GUBUN").setValue([null, "Y", null, null, null, null]);
                return false;
            }
        }
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             addgroup = [],
            ctrl = widget.generator.control();
        
        if (this.EDIT_FLAG != "M") {
            toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        } else {
            toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                                                                       .css("btn btn-default")
                                                                       .addGroup(
                                                                        [
                                                                           {
                                                                               id: 'Use',
                                                                               label: (this.ACC002.CANCEL == "Y" ? ecount.resource.BTN00203 : ecount.resource.BTN00204)                //Resource : 재사용, 사용중단
                                                                           },
                                                                           { id: 'delete', label: ecount.resource.BTN00033 }
                                                                        ]).clickOnce());  // Delete
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    /**********************************************************************     
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        if (this.EDIT_FLAG != "M") {
            this.contents.getControl('GYE_CODE').setFocus(0);
        } else {
            this.contents.getControl('GYE_DES').setFocus(0);
        }
        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 670
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case 'ES013P':
                this.contents.getControl("GYE_CODE").setValue(message.data);
                page.close();
                this.contents.getControl("GYE_CODE").onNextFocus();
                break;
        }
    },
    onAutoCompleteHandler: function (control, keyword, param, handler) {
        switch (control.id) {
            case "INPUT_GUBUN_codeAccount":
                param.CALL_TYPE = "26";
                param.isTreeEventDisable = true;
                break;
            case "INPUT_GUBUN_codeFieldType":
                param.MENU_TYPE = "AI";
                param.PARAM1 = param.PARAM;
                break;
        }

        handler(param);
    },
    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        switch (control.id) {
            case "INPUT_GUBUN_codeAccount":
                params.CALL_TYPE = "26";
                params.isTreeEventDisable = true;
                break;
            case "PY_GYE_GUBUN_codeAccount":
                params.CALL_TYPE = "25";
                break;
            case "INPUT_GUBUN_codeFieldType":
                params.MENU_TYPE = "AI";
                params.PARAM1 = params.PARAM;
                break;
        }

        handler(params);
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //중복확인
    onFunctionCheck: function () {
        if (this.contents.getControl("GYE_CODE").getValue() == "") {
            alert(ecount.resource.MSG00118);
            return false;
        }
        var data = {
            Key: {
                GYE_CODE: this.contents.getControl("GYE_CODE").getValue()
            }
            // SEARCH_TYPE: "gye_code",
        };

        var thisObj = this;

        if (thisObj.contents.getControl('GYE_CODE').getValue() != '0000') {
            ecount.common.api({
                url: "/Account/Basic/CheckExistedAcc002",
                data: Object.toJSON(data),
                error: function (e) {
                    ecount.alert('Error', function () {
                        this.hideProgressbar();
                    }.bind(this));
                }.bind(this),
                success: function (result) {
                    if (result.Status != "200")
                        ecount.alert(result.fullErrorMsg);
                    else if (result.Data == 1) {
                        thisObj.contents.getControl('GYE_CODE').showError(ecount.resource.MSG00676);
                        thisObj.contents.getControl('GYE_CODE').setFocus(0);
                    } else {
                        thisObj.contents.getControl('GYE_CODE').showError(String.format(ecount.resource.MSG02869, thisObj.contents.getControl("GYE_CODE").getValue(), ecount.resource.LBL00495));
                        thisObj.contents.getControl('GYE_CODE').setFocus(0);
                    }
                }
            });
        }
        else {
            thisObj.contents.getControl('GYE_CODE').showError(ecount.resource.MSG04561);
            thisObj.contents.getControl('GYE_CODE').setFocus(0);
        }
    },

    //복사
    onFunctionCopy: function () {

        var params = { EDIT_FLAG: "Copy", GYE_CODE : this.GYE_CODE  };

        this.onAllSubmitSelf('/ECERP/EBA/EBA002M', params);
    },

    //저장
    onFooterSave: function (e, type) {
        
        var btnSave = this.footer.get(0).getControl("Save");
        var thisObj = this;

        if (['R', 'X'].contains(this.userPermit) || (this.userPermit == "U" && this.EDIT_FLAG == "M")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: this.EDIT_FLAG != "M" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        if (this.contents.getControl("GYE_CODE").getValue() == "0000") {
            this.contents.getControl('GYE_CODE').showError(ecount.resource.MSG01455);
            this.contents.getControl('GYE_CODE').setFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        if (this.EDIT_FLAG != "M" && this.contents.getControl("GYE_CODE").getValue() == "") {
            this.contents.getControl('GYE_CODE').showError(ecount.resource.MSG00118);
            this.contents.getControl('GYE_CODE').setFocus(0);
            btnSave.setAllowClick();
            return false;
        }
      
        if (this.contents.getControl('GYE_DES').getValue() == "") {
            this.contents.getControl('GYE_DES').showError(ecount.resource.MSG00772);
            this.contents.getControl('GYE_DES').setFocus(0);
            btnSave.setAllowClick();
            return false;
        }
        
        var InputGubun = this.contents.getControl("INPUT_GUBUN");
        var InputGubunValue = this.contents.getControl("INPUT_GUBUN").getValue();

        // InputGubunValue 배열값
        // 0 계정종류
        // 1 입력구분
        // 2 거래처별집계구분
        // 3 부서별/프로젝트별 집계
        // 4 상위계정
        // 5 하이퍼링크대상

        var BsPlGubun1 = this.contents.getControl("BS_PL_GUBUN1");
        var BsPlGubun2 = this.contents.getControl("BS_PL_GUBUN2");
        var PyGyeGubun = this.contents.getControl("PY_GYE_GUBUN");
        
        if (this.contents.getControl("GYE_CODE").getValue() == InputGubunValue[4][0].value) {
            this.contents.getControl('INPUT_GUBUN').showError(ecount.resource.LBL09407);
            this.contents.getControl('INPUT_GUBUN').setFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        if (BsPlGubun1.get(2).getValue() != "undefined" && BsPlGubun1.get(2).getValue() == "") {
            if (BsPlGubun1.get(0).getValue() == "Y") {
                BsPlGubun1.get(2).showError(ecount.resource.MSG01700);
                BsPlGubun1.get(2).setFocus(0);
                btnSave.setAllowClick();
                return false;
            } else {
                BsPlGubun1.get(2).setValue("0");
            }
        }
        //for name

        if (BsPlGubun1.get(3).getValue() != "undefined" && BsPlGubun1.get(3).getValue() == "") {
            if (BsPlGubun1.get(0).getValue() == "Y") {
                BsPlGubun1.get(3).showError(ecount.resource.MSG85199);
                BsPlGubun1.get(3).setFocus(0);
                btnSave.setAllowClick();
                return false;
            } else {
                BsPlGubun1.get(3).setValue("");
            }
        }

        if (BsPlGubun2.get(2).getValue() != "undefined" && BsPlGubun2.get(2).getValue() == "") {
            if (BsPlGubun2.get(0).getValue() == "Y") {
                BsPlGubun2.get(2).showError(ecount.resource.MSG01700);
                BsPlGubun2.get(2).setFocus(0);
                btnSave.setAllowClick();
                return false;
            } else {
                BsPlGubun2.get(2).setValue("0");
            }
        }

        //for name
        if (BsPlGubun2.get(3).getValue() != "undefined" && BsPlGubun2.get(3).getValue() == "") {
            if (BsPlGubun2.get(0).getValue() == "Y") {
                BsPlGubun2.get(3).showError(ecount.resource.MSG85199);
                BsPlGubun2.get(3).setFocus(0);
                btnSave.setAllowClick();
                return false;
            } else {
                BsPlGubun2.get(3).setValue("");
            }
        }


        var py_gye_gubun = PyGyeGubun.get(0).getValue();
        var apply_code = "";
        var py_gye_sort = 0;
        var py_gye_balance = "N";
        if (py_gye_gubun == "G") {
            apply_code = PyGyeGubun.get(1).getSelectedItem()[0].value;
            py_gye_sort = PyGyeGubun.get(2).getValue();
            py_gye_balance = PyGyeGubun.get(3).getValue();
            if (apply_code == "") {
                ecount.alert(ecount.resource.MSG03368);
                PyGyeGubun.get(0).setFocus(0);
                btnSave.setAllowClick();
                return false;
            }
        }
        var inex_code = "000000000000000000000000000000000000";
        var p_inex_code = "000000000000000000000000000000000000";
        if (incomeFlag != 0) {
            var inex_code1 = this.contents.getControl("INEX_CODE1").getValue();
            var inex_code2 = this.contents.getControl("INEX_CODE2").getValue();
            var inex_code3 = "00000";
            var inex_code4 = "00000";
            var inex_code5 = "00000";
            var inex_code6 = "00000";
            var inex_code7 = "00000";
            var inex_code8 = "00000";

            if (incomeFlag > 1) {
                inex_code3 = this.setInexCodeData(this.contents.getControl("INEX_CODE3").getValue());
            }

            if (incomeFlag > 2) {
                inex_code4 = this.setInexCodeData(this.contents.getControl("INEX_CODE4").getValue());
            }

            if (incomeFlag > 3) {
                inex_code5 = this.setInexCodeData(this.contents.getControl("INEX_CODE5").getValue());
            }

            if (incomeFlag > 4) {
                inex_code6 = this.setInexCodeData(this.contents.getControl("INEX_CODE6").getValue());
            }

            if (incomeFlag > 5) {
                inex_code7 = this.setInexCodeData(this.contents.getControl("INEX_CODE7").getValue());
            }

            if (incomeFlag > 6) {
                inex_code8 = this.setInexCodeData(this.contents.getControl("INEX_CODE8").getValue());
            }
            inex_code = inex_code1 + inex_code2 + inex_code3 + inex_code4 + inex_code5 + inex_code6 + inex_code7 + inex_code8;
            
            if (inex_code8 != "00000") p_inex_code = inex_code1 + inex_code2 + inex_code3 + inex_code4 + inex_code5 + inex_code6 + inex_code7 + "00000";
            else if (inex_code7 != "00000") p_inex_code = inex_code1 + inex_code2 + inex_code3 + inex_code4 + inex_code5 + inex_code6 + "0000000000";
            else if (inex_code6 != "00000") p_inex_code = inex_code1 + inex_code2 + inex_code3 + inex_code4 + inex_code5 + "000000000000000";
            else if (inex_code5 != "00000") p_inex_code = inex_code1 + inex_code2 + inex_code3 + inex_code4 + "00000000000000000000";
            else if (inex_code4 != "00000") p_inex_code = inex_code1 + inex_code2 + inex_code3 + "0000000000000000000000000";
            else if (inex_code3 != "00000") p_inex_code = inex_code1 + inex_code2 + "000000000000000000000000000000";
            else if (inex_code2 != "00000") p_inex_code = inex_code1 + "00000000000000000000000000000000000";
        }

        var acc105_site = 0;
        var acc105_pjt = 0;
        var update_chk = "N";
        if (InputGubunValue[1].value == "Y") {
            if ($.isEmpty(InputGubunValue[4][0].value)) {
                InputGubun.get(4).showError(ecount.resource.MSG05040);
                InputGubun.get(4).setFocus(0);
                btnSave.setAllowClick();
                return false;
            }
            acc105_site = (InputGubunValue[2] == "1") ? 0 : (InputGubunValue[3].contains("1") == true ? 1 : 0);
            acc105_pjt = (InputGubunValue[2] == "1") ? 0 : (InputGubunValue[3].contains("2") == true ? 1 : 0);
        }        

        if (this.EDIT_FLAG == "M" && (this.ACC002.SUM_GUBUN != InputGubunValue[2] || this.ACC002.ACC105_SITE != acc105_site || this.ACC002.ACC105_PJT != acc105_pjt)) {
            update_chk = "Y";
        }

        var GyeCode = (this.EDIT_FLAG != "M") ? this.contents.getControl("GYE_CODE").getValue() : this.GYE_CODE;


        if (InputGubunValue[0].value == "IN" || InputGubunValue[0].value == "OU") {
            var check = GyeCode.substr(0, 1);
            
            if (check == "A" || check == "B" || check == "C" || check == "D") {
                if (incomeFlag == 0) {
                    this.contents.getControl('GYE_TYPE').setFocus(0);
                    btnSave.setAllowClick();
                    return false;
                }
            } else {
                this.contents.getControl('GYE_TYPE').showError(ecount.resource.MSG00879);
                this.contents.getControl('GYE_TYPE').setFocus(0);
                btnSave.setAllowClick();
                return false;
            }
        }

        // Apply new logic Copy Account Code -> Account Setting Cash Report
        var fundCode = this.ACC002.FUND_CODE;
        var subGubunValue = this.contents.getControl("SUB_GUBUN").getValue();

        if (InputGubunValue[1].value == "Y") {
            if (fundCode == "0") {
                if (this.contents.getControl("SUB_GUBUN").getValue() == "01") {
                    if (InputGubunValue[2] == "1") {
                        fundCode = "1"
                    }
                    else {
                        fundCode = "2"
                    }
                }
            }
        }

        if (update_chk == "Y") {
        if (this.getPhaseCheck()) {
            btnSave.setAllowClick();
            return false;
        }
        }
        
        var data = {
            'GYE_CODE': GyeCode,
            'HANG_NAME': this.ACC002.HANG_NAME,
            'SE_NAME': this.contents.getControl("SE_NAME").getValue(),
            'GYE_DES': this.contents.getControl("GYE_DES").getValue(),
            'GYE_DES2': this.contents.getControl("GYE_DES2").getValue(),
            'GYE_TYPE': InputGubunValue[0].value,
            'GYE_NAME': this.ACC002.GYE_NAME,
            'GROUP_CODE': InputGubunValue[4][0].value,
            'INPUT_GUBUN': InputGubunValue[1].value,
            'SUM_GUBUN': InputGubunValue[1].value == "Y" ? InputGubunValue[2] : "1",
            'CR_DR': this.contents.getControl("CR_DR").getValue(),
            'BS_PL_GUBUN': BsPlGubun1.get(0).getValue(),
            'BS_PL_POSITION': BsPlGubun1.get(1).getValue(),
            'BS_PL_SORT': BsPlGubun1.get(2).getValue() == "undefined" ? 0 : BsPlGubun1.get(2).getValue(),
            'BS_PL_DES': BsPlGubun1.get(3).getValue(),
            'CHECK_FLAG': BsPlGubun1.get(4).getValue(0) == true ? "Y" : "N",
            'BRACKET': BsPlGubun1.get(4).getValue(1) == true ? "Y" : "N",
            'STEP_FLAG': this.contents.getControl("STEP_FLAG").getValue(),
            'FUND_CODE': fundCode,//this.ACC002.FUND_CODE,
            'SHORT_CODE': this.ACC002.SHORT_CODE,
            'SHORT_SORT': this.ACC002.SHORT_SORT,
            'WEB_GUBUN': this.ACC002.WEB_GUBUN,
            'EST_GUBUN': this.ACC002.EST_GUBUN,
            'INEX_CODE': inex_code,
            'INEX_GUBUN': this.ACC002.INEX_GUBUN,
            'BS_PL_GUBUN2': BsPlGubun2.get(0).getValue(),
            'BS_PL_POSITION2': BsPlGubun2.get(1).getValue(),
            'BS_PL_SORT2': BsPlGubun2.get(2).getValue() == "undefined" ? 0 : BsPlGubun2.get(2).getValue(),
            'BS_PL_DES2': BsPlGubun2.get(3).getValue(),
            'CHECK_FLAG2': BsPlGubun2.get(4).getValue(0) == true ? "Y" : "N",
            'BRACKET2': BsPlGubun2.get(4).getValue(1) == true ? "Y" : "N",
            'GYE_CODE_LINK': InputGubunValue[5].value,
            'PY_GYE_GUBUN': py_gye_gubun,
            'APPLY_CODE': apply_code,
            'PY_GYE_BALANCE': py_gye_balance,
            'PY_GYE_SORT': py_gye_sort,
            'TB_GUBUN': this.ACC002.TB_GUBUN,
            'CANCEL': this.ACC002.CANCEL,
            'SEARCH_MEMO': this.contents.getControl("SEARCH_MEMO").getValue(),
            'P_INEX_CODE': p_inex_code,
            'ACC105_SITE': acc105_site,
            'ACC105_PJT': acc105_pjt,
            'SUB_GUBUN': subGubunValue[0],
            'USE_BILL_YN': subGubunValue[0] == "01" ? subGubunValue[1] : "N",
            'UPDATE_CHK': update_chk,
            'ITEM_TYPE_CD': InputGubunValue[1].value == "Y" ? InputGubunValue[6][0].value : ""
        };

    	//부서, 프로젝트별 집계 사용시 회사설정 다시한번 확인
        var _self = this;
        if (acc105_site == 1 || acc105_pjt == 1) {
        	ecount.common.api({
        		url: "/SelfCustomize/Config/GetMypagecompany",
        		data: Object.toJSON({
        			COM_CODE: this.viewBag.InitDatas.ComCode
        		}),
        		success: function (result) {
        			if (result.Status != "200") {
        				ecount.alert("error");
        			} else {
        			    var controlValue = _self.contents.getControl("INPUT_GUBUN").getValue();

        			    // InputGubunValue 배열값
        			    // 0 계정종류
        			    // 1 입력구분
        			    // 2 거래처별집계구분
        			    // 3 부서별/프로젝트별 집계
        			    // 4 상위계정
        			    // 5 하이퍼링크대상

        			    if (controlValue[3].contains("1") == true && result.Data.USE_ACC102_SITE == "0") {
        					ecount.alert(ecount.resource.MSG07493);
        					btnSave.setAllowClick();
        					return false;
        				}

        			    if (controlValue[3].contains("2") == true && result.Data.USE_ACC102_PJT == "0") {
        					ecount.alert(ecount.resource.MSG07493);
        					btnSave.setAllowClick();
        					return false;
        				}

                        // 자동으로 집계를 돌려주므로 메세지 보여줄 필요없음
        				save.call(this, update_chk);
        		}
        			}
        		});
        	} else {
            // 자동으로 집계를 돌려주므로 메세지 보여줄 필요없음
            save.call(this, update_chk);
        }        

        function save(updateChk) {
            ecount.common.api({
                url: "/Account/Basic/InsertAcc002",
                data: Object.toJSON({
                    SaveDatas: data,
                    EditFlag: thisObj.EDIT_FLAG != "M" ? "I" : "M",
                }),
                error: function (e) {
                    ecount.alert('저장 처리 시 Error', function () {
                        this.hideProgressbar();
                    }.bind(this));
                }.bind(this),
                success: function (result) {
                    if (result.Status != "200")
                        ecount.alert(result.fullErrorMsg);
                    else if (result.Data.length != 0) {
                        if (result.Data[0].ERRFLAG == "1") {
                            InputGubun.get(1).showError(result.Data[0].MSG);
                            InputGubun.get(1).setFocus(0);
                        } else if (result.Data[0].ERRFLAG == "2") {
                            PyGyeGubun.get(0).showError(result.Data[0].MSG);
                            PyGyeGubun.get(0).setFocus(0);
                        } else if (result.Data[0].ERRFLAG == "4" || result.Data[0].ERRFLAG == "5") {
                            InputGubun.get(4).showError(result.Data[0].MSG);
                            InputGubun.get(4).setFocus(0);
                        } else {
                            if (thisObj.EDIT_FLAG != "M") {
                                thisObj.contents.getControl('GYE_CODE').showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL03530));
                                thisObj.contents.getControl('GYE_CODE').setFocus(0);
                            } else {
                                alert(result.Data[0].MSG);
                            }
                        }
                        btnSave.setAllowClick();
                        return false;
                    }
                    else {
                        if (updateChk == "Y") {
                            var accountList = [
                                {
                                    GYE_CODE: thisObj.contents.getControl('GYE_CODE').getValue(),
                                    SUM_GUBUN: thisObj.contents.getControl("INPUT_GUBUN").getValue()[2]
                                }
                            ];

                            ecount.common.api({
                                url: "/Account/Basic/InsertBatchUpdateBalanceByAccount",
                                data: Object.toJSON({
                                    Base_From_Date: iniYymm + "01",
                                    Base_To_Date: acctDate,
                                    ACCT_DATE: acctDate,
                                    UpdateBalanceList: accountList
                                }),
                                error: function (e) {
                                    ecount.alert('재집계 Error', function () {
                                        thisObj.hideProgressbar();
                                    }.bind(this));
                                }.bind(this),
                                success: function (result) {
                                    if (result.Status != "200")
                                        ecount.alert(result.fullErrorMsg);
                                    else {
                                        thisObj.sendMessage(thisObj, {});
                                        thisObj.setTimeout(function () {
                                            thisObj.close();
                                        }, 0);
                                    }
                                },
                                complete: function () {
                                    btnSave.setAllowClick();
                                }
                            });
                    }
                    else {
                        thisObj.sendMessage(thisObj, {});
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
        }
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },
    //삭제
    onButtonDelete: function () {
        
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }

        var thisObj = this;
        var data = [{
            'GYE_CODE': this.GYE_CODE
        }];
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/Account/Basic/DeleteUpdateAcc002",
                    data: Object.toJSON({
                        DeleteDatas: data,
                        EditFlag: "D"
                    }),
                    error: function (e) {
                        ecount.alert('삭제 처리 시 Error', function () {
                            this.hideProgressbar();
                        }.bind(this));
                    }.bind(this),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else if (result.Data.length != 0) {

                            var _data = thisObj.setDataCustom(result.Data);
                            var param = {
                                name: 'frmDetail',
                                width: 650,
                                height: 500,
                                Result_Datas: _data,
                                popupType: false,
                                additional: false
                            };

                            this.setTimeout(function () {
                                thisObj.openWindow({
                                    url: '/ECERP/EBA/EBA001P_19',
                                    param: param
                                });
                            }.bind(this), 0)

                        }
                        else {
                            thisObj.sendMessage(thisObj, {});
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                    },
                    complete: function () {
                        btnDelete.setAllowClick();
                    }
                });
            } else {
                btnDelete.setAllowClick();
            }
        });
    },

    //사용중단
    onButtonUse: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }

        var thisObj = this;
        var data = [{
            'GYE_CODE': this.GYE_CODE
        }];

        ecount.common.api({
            url: "/Account/Basic/DeleteUpdateAcc002",
            data: Object.toJSON({
                DeleteDatas: data,
                EditFlag: "U",
                Cancel: (thisObj.ACC002.CANCEL == "Y") ? "N" : "Y"
            }),
            error: function (e) {
                ecount.alert('사용중단 처리 시 Error', function () {
                    this.hideProgressbar();
                }.bind(this));
            }.bind(this),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else if (result.Data.length != 0) {

                    var _data = thisObj.setDataCustom(result.Data);
                    var param = {
                        name: 'frmDetail',
                        width: 650,
                        height: 500,
                        Result_Datas: _data,
                        popupType: false,
                        additional: false
                    };

                    this.setTimeout(function () {
                        thisObj.openWindow({
                            url: '/ECERP/EBA/EBA001P_19',
                            param: param
                        });
                    }.bind(this), 0)

                }
                else {
                    thisObj.sendMessage(thisObj, {});
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () {
                btnDelete.setAllowClick();
            }

        });

    },

    //History button click event
    onFooterHistory: function (e) {
        var params = {
            width: 450,
            height: 150,
            lastEditTime: this.ACC002.WDATE,
            lastEditId: this.ACC002.WID,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: params,
            popupType: false,
            additional: false
        });
    },

    //Close button click event
    onFooterClose: function () {
        this.close();
    },

    // 사용방법설정 Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: 750,
            height: this.selfCustomizingHeight,
            PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/ESC/ESC002M',
            name: ecount.resource.LBL01457,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
        });
    },
    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
       

    //삭제불가 이력 Data 가공
    setDataCustom: function (_data) {
        var _result = [];

        _data.forEach(function (A) {
            var _customObject = {
                GYE_CODE: A.GYE_CODE,
                ERROR_MESSAGE: A.MSG.replace(/\\n/g, '</br>')
            };
            _result.push(_customObject);
        });

        return _result.toJSON();
    },

    //수입지출코드 자리
    setInexCodeData:function(data){
        if (data.length != 5) {
            for (var i = 0; i < 5 - data.length; i++) {
                data = "0" + data;
            }
        }
        return data;
    },

    // Resources
    getResource: function (value) {
        if (value != undefined && !($.isEmpty(value))) {
            return ecount.resource[value];
        }
        else {
            return "";
        }
    },

    getPhaseCheck: function () {

        var self = this;
        var isEmptyPhase = false;

        ecount.common.api({
            async: false,
            url: "/Account/Common/CheckAccountPhase",
            data: { StatusCheckPhase: "I" },
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else {
                    if (result && result.Data) {
                        self.openWindow({
                            url: "/ECERP/EMG/EMG001P_16",
                            name: ecount.resource.LBL07973,
                            param: { height: 230, width: 500 },
                            popupType: false,
                            fpopupID: self.ecPageID
                        });
                        isEmptyPhase = true;
                    }
                }
            }.bind(this)
        });

        return isEmptyPhase;
    },
});