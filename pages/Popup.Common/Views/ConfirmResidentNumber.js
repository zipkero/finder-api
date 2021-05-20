/****************************************************************************************************
1. Create Date : 2018.07.26
2. Creator     : 이슬기
3. Description : 이메일 발송 > 수신화면 > 수신문서 확인하기 클릭 시 > 주민번호 확인 팝업
4. Precaution  :
5. History     : 
6. Old File    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ConfirmResidentNumber", {
    
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ////****************************************************************************************************/
   
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
       
    },

    render: function () {
        debugger;
        this._super.render.apply(this);
    },
    /**********************************************************************
    * 1.form render layout setting [onInitHeader, onInitContents, onInitFooter ...] 기본 페이지 설정
    **********************************************************************/
    //SettingHeaderOption(헤더 옵션 설정) - 검색창 search 화면
    onInitHeader: function (header) {
        debugger;
        header
            .setTitle('원천징수영수증 비밀번호입력') // 소득자등록
            .notUsedBookmark();
    },

    //SettingContentsOption(본문 옵션 설정)
    onInitContents: function (contents) {



        var g = widget.generator,
            setting1 = g.settingPanel(),
            ctrl = g.control();

        setting1.focusIndex(1)
            .header("개인 : 주민등록번호 앞6자리를 입력바랍니다.<br>법인 : 사업자등록번호 10자리를 입력바랍니다.<br>비거주자 : 여권번호, 거주지국 납세번호 등  지급처에 전달한 번호를 입력합니다.")
            .setId("password")
            .addContents(ctrl.define("widget.input", "password", "password", ''));

        contents.add(setting1);

    },

    //SettingFooterOption(풋터 옵션 설정)
    onInitFooter: function (footer, resource) {
        var g = widget.generator,
            ctrl = g.control(),
            toolbar = g.toolbar();

        toolbar.addLeft(ctrl.define('widget.button', 'confirm').label("확인"));    //변경
        toolbar.addLeft(ctrl.define('widget.button', 'close').label("닫기"));     //닫기

        footer.add(toolbar);

        //this.$el.find("> .header").attr("style", "width:630px; margin:300px auto 0; left : 600px");
        //this.$el.find(".wrapper-title").attr("style", "border-bottom : none; border-right : none;");
        //this.$el.find(".contents").attr("style", "width:710px; margin:330px auto 0; left : 0px");
        //this.$el.find(".footer").attr("style", "width:710px; margin:0px auto 0; left : 0px");
    },

    //주민번호 확인
    onFooterConfirm: function () {
        debugger;
        var password = this.contents.getControl("password").getValue();
        var redirectUrl = "/ECERP/Popup.Common/EmailReportByTax"
            + "?com_code=" + this.com_code
            + "&approval_value=" + this.approval_value   
            + "&doc_gubun=" + this.doc_gubun   
            + "&trx_type=" + this.trx_type   
            + "&io_date=" + this.io_date   
            + "&io_no=" + this.io_no   
            + "&ser_no=" + this.ser_no   
            + "&p_email=" + this.p_email   
            + "&c_native_num=" + this.c_native_num   

            + "&s_mail=" + this.s_mail 
            + "&s_tel=" + this.s_tel
            + "&s_cust_des=" + this.s_cust_des
            + "&emn_flag=&t_width="
            + "&strLanguage=" + this.strLanguage
            + "&nts_statecode="
            + "&form_Type=" + this.form_Type
            + "&form_Ser=" + this.form_Ser
            + "&cust_cd=" + this.cust_cd

        //개인일 경우 > 주민번호 앞자리 6자리
        //법인인 경우 > 사업자 등록번호
        //비거주자인경우 > 외국인등록번호
        if (password.length == 0) {
            ecount.alert("비밀번호를 입력해주세요.");
        }
        else {

            if (this.person_gubun != "1" && this.io_gubun == "1") {
                this.password = this.password.substring(0, 6);
            }

            if (password == this.password) {
                this.onAllSubmitSelf(redirectUrl, "details");
            } else {
                ecount.alert("주민(법인)등록번호가 일치하지 않습니다.");
            }
        }

        
        
    },

    //닫기
    onFooterClose : function () {
        this.close();
    },

    onLoadComplete: function () {

        /*************************************
         * 정렬 적용.......
         ************************************/
        //this.$el.find("> .header").attr("style", "width:710px;top:300px; left : 600px");
        //this.$el.find(".wrapper-title").attr("style", "border-bottom : none; border-right : none;");
        //this.$el.find(".contents").attr("style", "width:710px; margin:330px auto 0; left : 0px");
        //this.$el.find(".footer").attr("style", "width:710px; margin:0px auto 0; left : 0px");

    },








});