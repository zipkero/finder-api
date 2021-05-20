window.__define_resource && __define_resource("LBL18546","MSG02604","LBL09333","LBL01504","LBL00056","LBL00057","LBL05102","LBL04799","LBL00058","MSG85001","MSG85025","MSG85002","MSG85026","MSG85003","MSG85027","MSG85004","MSG85028","MSG85005","MSG85029","MSG85006","MSG85007","MSG85030","MSG85008","MSG85031","MSG85009","MSG85032","MSG85010","MSG85033","MSG85011","MSG85034","MSG85012","MSG85013","MSG85014","MSG85035","MSG85015","MSG85036","MSG85016","MSG85037","MSG85017","MSG85038","MSG85018","MSG85019","MSG85039","MSG85020","MSG85040","MSG85021","MSG85041","MSG85022","MSG85042","MSG85023","MSG85024","MSG85043","LBL00061","LBL00060","LBL01473","MSG00205","BTN00008","LBL08033");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 이인호
3. Description : Email 발송로그
4. Precaution  : 
5. History     : [2015-09-04] 강성훈 : 코드 리펙토링
                 [2019.11.25] (On Minh Thien) A18_03568 - ERP 내 용어정리
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESD023P_03", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    off_key_esc: true,

    /**********************************************************************
    * page init
    **********************************************************************/

    //초기화
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    //렌더
    render: function () {
        this._super.render.apply(this);
    },

    /********************************************************************** 
    * form render layout setting [setHeader, setContents, setFooter ...](화면 구성)  
    **********************************************************************/

    //헤더 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL18546);
    },

    //컨텐츠 설정
    onInitContents: function (contents, resource) {
        //위젯 인스턴스 생성
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbar2 = generator.toolbar(),
            ctrl = generator.control();

        var thisRoot = this;
        toolbar.addLeft(ctrl.define("widget.label").css("text-danger").label(ecount.resource.MSG02604.unescapeHTML()).useHTML());
        contents.add(toolbar);

        if (this.viewBag.InitDatas.InitResultDto.length > 0) {
            $.each(this.viewBag.InitDatas.InitResultDto, function (key, value) {
                form1 = generator.form();
                form1.template("register");
                form1.add(ctrl.define("widget.label", "lblMailLog1", "lblMailLog1", ecount.resource.LBL09333).label($.isEmpty(value.DS_FROMMAILADDRESS) ? "ecount@ecounterp.com" : value.DS_FROMMAILADDRESS).end());
                form1.add(ctrl.define("widget.label", "lblMailLog2", "lblMailLog2", ecount.resource.LBL01504).label(thisRoot.S_EMAIL).end());
                form1.add(ctrl.define("widget.label", "lblMailLog3", "lblMailLog3", ecount.resource.LBL00056).label(value.TOMAIL_NM).end());
                form1.add(ctrl.define("widget.label", "lblMailLog4", "lblMailLog4", ecount.resource.LBL00057).label(value.RESULT_FLAG == "S" ? ecount.resource.LBL05102 : ecount.resource.LBL04799).end());
                form1.add(ctrl.define("widget.label", "lblMailLog5", "lblMailLog5", ecount.resource.LBL00058).label(ecount.infra.getECDateFormat('date11', false, value.LOGTIME_DT.toDatetime())).end());

                var causeMessage = "";
                var retMessage = "";

                //고객지원 119181 리턴메일 일 때 실패사유 보여주도록 수정
                if (value.RESULT_FLAG == "F" || value.RESULT_FLAG == "B") {
                    switch (value.RETCODE) {
                        case "611":
                            causeMessage = ecount.resource.MSG85001;  //받는 사람의 메일 서버가 연결이 안되는 경우<br/>받는 사람의 메일 서버에 연결은 됬지만 응답이 없는 경우<br/>받는 사람의 메일 서버가 바쁘거나 응답이 느린 경우
                            retMessage = ecount.resource.MSG85025;    //받는 메일 서버에 네트웍 장애가 있습니다. 다시 시도하세요.
                            break;
                        case "612":
                            causeMessage = ecount.resource.MSG85002;  //받는 사람의 메일 서버 도메인 정보를 얻을 수 없는 경우
                            retMessage = ecount.resource.MSG85026;    //받는 사람의 메일 주소가 정확한지 확인해 주세요.
                            break;
                        case "613":
                            causeMessage = ecount.resource.MSG85003;  //받는 사람의 메일 서버가 연결을 거부한 경우
                            retMessage = ecount.resource.MSG85027;    //스팸메일로 등록되어 있는 경우입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "614":
                            causeMessage = ecount.resource.MSG85004;  //보내는 메일 서버가 메일 발송을 거부한 경우
                            retMessage = ecount.resource.MSG85028;    //스팸메일로 인식한 경우입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "615":
                            causeMessage = ecount.resource.MSG85005;  //보안 연결을 위한 SSL 오류가 발생한 경우
                            retMessage = ecount.resource.MSG85029;    //보안 연결 오류입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "621":
                            causeMessage = ecount.resource.MSG85006;  //보내는 사람의 메일주소 또는 도메인이 수신 서버에서 거부되는 경우
                            retMessage = ecount.resource.MSG85027;    //스팸메일로 등록되어 있는 경우입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "631":
                            causeMessage = ecount.resource.MSG85007; //받는 사람의 계정이 수신 서버에 존재하지 않는 경우<br/>받는 사람의 계정이 정지되어 있는 경우<br/>받는 사람의 메일 주소 형식이 틀린경우<br/>받는 사람의 메일 서버가 수신을 거부한 경우
                            retMessage = ecount.resource.MSG85030; //받는 사람의 메일 주소가 정확한지 확인해 주세요. 받는 사람의 편지함 계정이 활성화 되어 있는지 확인해 주시기 바랍니다.
                            break;
                        case "632":
                            causeMessage = ecount.resource.MSG85008;  //한번에 받을 수 있는 받는 사람의 메일 수신 제한 용량을 초과한 경우
                            retMessage = ecount.resource.MSG85031;    //사이즈를 줄여서 다시 발송해주십시오.
                            break;
                        case "633":
                            causeMessage = ecount.resource.MSG85009;  //받는 사람의 우편함 저장 공간이 부족한 경우
                            retMessage = ecount.resource.MSG85032;    //받는이에게 다른 방법으로 연락이 가능하시다면 편지함 정리를 요청해주시기 바랍니다.
                            break;
                        case "634":
                            causeMessage = ecount.resource.MSG85010;  //한번에 받을 수 있는 받는 사람 수 제한을 초과한 경우
                            retMessage = ecount.resource.MSG85033;    //받는 사람을 나눠서 메일을 다시 발송해주십시오.
                            break;
                        case "641":
                            causeMessage = ecount.resource.MSG85011;  //받는 사람의 메일 서버에서 지원하지 않는 형태의 메일을 수신한 경우<br/>받는 사람의 메일 서버에서 메일이 변환되지 못한 경우<br/>받는 사람의 메일 서버에서 메일이 변환이 필요하지만 지원하지 않는 경우<br/>받는 사람의 메일 서버에서 메일이 변환되는 과정에서 데이터가 손실된 경우
                            retMessage = ecount.resource.MSG85034; //메일 서버에 오류가 있는 경우입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "642":
                            causeMessage = ecount.resource.MSG85012;  //받는 사람의 메일 서버에서 변조된 메일로 인식한 경우
                            retMessage = ecount.resource.MSG85034;    //메일 서버에 오류가 있는 경우입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "650":
                            causeMessage = ecount.resource.MSG85013;  //보내는 메일 서버에서 메일을 송신하는 과정 중 내부 오류 발생
                            retMessage = ecount.resource.MSG85034;    //메일 서버에 오류가 있는 경우입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "651":
                            causeMessage = ecount.resource.MSG85014;  //받는 사람의 메일 서버에서 메일을 수신하는 과정 중 내부 오류 발생
                            retMessage = ecount.resource.MSG85035;    //받는 메일 서버에 내부 오류가 있습니다. 다시 시도하세요.
                            break;
                        case "652":
                            causeMessage = ecount.resource.MSG85015;  //받는 사람의 메일 서버의 디스크 용량이 부족한 경우
                            retMessage = ecount.resource.MSG85036;    //받는 메일 서버의 디스크 용량이 부족합니다. 다시 시도하세요.
                            break;
                        case "653":
                            causeMessage = ecount.resource.MSG85016;  //받는 사람의 메일 서버가 재시동 중이거나 정비중인 경우
                            retMessage = ecount.resource.MSG85037; //받는 메일 서버가 재시동 중이거나 정비중입니다. 다시 시도하세요.
                            break;
                        case "661":
                            causeMessage = ecount.resource.MSG85017;  //받는 사람의 메일 서버에서 메일의 변환이 필요하지만 변환할 수 없는 경우<br/>받는 사람의 메일 서버에서 보안 메일 처리시 오류가 발생한 경우
                            retMessage = ecount.resource.MSG85038;    //보안 메일 오류입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "662":
                            causeMessage = ecount.resource.MSG85018;  //받는 사람의 메일 서버에서 메일의 수신을 취소한 경우
                            retMessage = ecount.resource.MSG85034;    //메일 서버에 오류가 있는 경우입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "671":
                            causeMessage = ecount.resource.MSG85019;  //인증을 위해서 비밀번호가 필요하지만 입력되지 않은 경우
                            retMessage = ecount.resource.MSG85039;    //메일 클라이언트의 메일보내기 설정에서 비밀번호를 설정하십시오.
                            break;
                        case "672":
                            causeMessage = ecount.resource.MSG85020;  //인증하는 과정에서 인증에 필요한 정보가 부족하거나 암호화가 되어 있지 않은 경우
                            retMessage = ecount.resource.MSG85040;    //메일 클라이언트의 메일보내기 설정에서 인증사용을 체크하고 인증방법을 변경해보세요.
                            break;
                        case "673":
                            causeMessage = ecount.resource.MSG85021;  //메일 발송을 위해서 메일서버에 인증이 요구되지만 정보가 전달되지 않은 경우
                            retMessage = ecount.resource.MSG85041;    //메일 클라이언트의 메일보내기 설정에서 인증사용을 체크하고 아이디와 비밀번호를 설정하십시오.
                            break;
                        case "674":
                            causeMessage = ecount.resource.MSG85022;  //보내는 메일 서버에서 인증에 필요한 처리를 하는 과정에서 내부 오류 발생
                            retMessage = ecount.resource.MSG85042;    //메일서버 인증 오류입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "675":
                            causeMessage = ecount.resource.MSG85023;  //보내는 메일 서버에서 인증정보를 얻는 과정에서 TLS 연결 오류 발생
                            retMessage = ecount.resource.MSG85042;    //메일서버 인증 오류입니다. Ecount 고객센터로 문의해 주십시오.
                            break;
                        case "691":
                            causeMessage = ecount.resource.MSG85024;   //인식하지 못하는 SMTP 명령 또는 명령 행이 너무 긴 경우<br/>SMTP 명령의 인자가 잘못된 경우<br/>잘못된 순서의 SMTP 명령 요청
                            retMessage = ecount.resource.MSG85043;    //메일서버 장애입니다. Ecount 고객센터로 문의해 주십시오.
                    }
                    form1.add(ctrl.define("widget.label", "lblMailLog6", "lblMailLog6", ecount.resource.LBL00061).label("<div class=\"warpper-toolbar\">" + causeMessage + "</div>").useHTML().end())
                        .add(ctrl.define("widget.label", "lblMailLog7", "lblMailLog7", ecount.resource.LBL00060).label("<div class=\"warpper-toolbar\">" + retMessage + "</div>").useHTML().end())
                        .add(ctrl.define("widget.label", "lblMailLog8", "lblMailLog8", ecount.resource.LBL01473).label("<div class=\"warpper-toolbar\">" + value.MESSAGE_TXT + "</div>").useHTML().end());

                }

                //폼추가
                contents
                    .add(form1);
            });
        }
        else {
            toolbar2
                .addLeft(ctrl.define("widget.label", "lblMailLog5", "lblMailLog5", "").label("<div class=\"wrapper-nodata\">" + ecount.resource.MSG00205 + "</div>").useHTML());
            contents.add(toolbar2);
        }
    },


    //하단 옵션 설정
    onInitFooter: function (footer, resource) {
        //위젯 인스턴스 생성
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        //닫기 위젯 추가
        toolbar.addLeft(ctrl.define("widget.button", "btnClose").label(ecount.resource.BTN00008));
        //툴바 추가
        footer.add(toolbar);
    },


    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //로드완료시
    onLoadComplete: function () {
        //하단 버튼 위치조정
        this.adjustContentsDimensions();
    },


    /**********************************************************************
    *  event from listener controls
    **********************************************************************/
    onInitControl: function (cid, option) {

    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },


    //키 이벤트
    onKeyDownHandler: function (e) {
        this._super.onKeyDownHandler.apply(this, arguments);
        return true;
    },

    //닫기 이벤트
    onFooterBtnClose: function () {
        this.close();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    //F8 저장
    ON_KEY_F8: function () {

    },

    //엔터
    ON_KEY_ENTER: function (e, target) {

    },

    /*

    onFooterBtn1: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 300,
            popupType: true,//필수값
            responseID: this.callbackID, //필수값
            S_EMAIL: "", //필수(구erp hidSEmail 동일)
            C_NATIVE_NUM: "", //필수(구erp hidData 동일)
        };
        //모달로 띄우기
        this.openWindow({
            url: '/ECERP/Popup.Common/ESD023P_03',
            name: ecount.resource.LBL08033,
            param: param,
            popupType: false,
            additional: false
        });


    },

    */
});
