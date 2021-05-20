window.__define_resource && __define_resource("LBL01427","MSG02213","BTN00276","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 이인호
3. Description : Email 발송취소
4. Precaution  : 
5. History     : [2015-09-04] 강성훈 : 코드 리펙토링
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESD023P_02", {

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
        header.setTitle(this.viewBag.Title);
    },

    //컨텐츠 설정
    onInitContents: function (contents, resource) {
        //위젯 인스턴스 생성
        var generator = widget.generator,
            ctrl = generator.control(),
            form1 = generator.form();

        //입력에서 필수 설정해야 함
        form1.template("register")
            .add(ctrl.define("widget.textarea", "txtReason", "txtReason", ecount.resource.LBL01427).dataRules(['required'], ecount.resource.MSG02213).maxBytes(200).end());

        //폼추가
        contents
            .add(form1);
    },


    //하단 옵션 설정
    onInitFooter: function (footer, resource) {
        //위젯 인스턴스 생성
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        //확인 위젯 추가
        toolbar.addLeft(ctrl.define("widget.button", "btnSave").label(ecount.resource.BTN00276));
        //닫기 위젯 추가
        toolbar.addLeft(ctrl.define("widget.button", "btnClose").label(ecount.resource.BTN00008));
        //툴바 추가
        footer.add(toolbar);
    },


    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //로드완료시
    onLoadComplete: function (e) {
        //하단 버튼 위치조정
        this.adjustContentsDimensions();
        if (!e.unfocus) {
            this.contents.getControl("txtReason").setFocus(0)
        }

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

    //확인(저장) 이벤트
    onFooterBtnSave: function () {

        //폼입력값 유효성 체크
        var msg = this.contents.validate();
        if (msg.result.length > 0) {
            console.log(msg);
            return false;
        }
        //부모창에 값 던짐
        this.sendMessage(this, {
            C_NATIVE_NUM: this.C_NATIVE_NUM
            , IO_DATE: this.IO_DATE
            , IO_NO: this.IO_NO
            , CONFIRM_STATUS: this.CONFIRM_STATUS
            , G_TEXT: this.contents.getControl("txtReason").getValue()
        });
        this.close();
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
        this.onFooterBtnSave();
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {

    }

    /*  

    //사용 예제) 
    onFooterBtn2: function (e) {

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 300,
            popupType: true,//필수값
            responseID: this.callbackID, //필수값
            popupReasonType: "",//필수(구ERP flag 동일)
            C_NATIVE_NUM: ""//필수(구ERP num 동일)
        };
        //모달로 띄우기
        this.openWindow({
            url: '/ECERP/Popup.Common/ESD023P_02',
            name: "",
            param: param,
            popupType: false,
            additional: false
        });

    },



    //부모 페이지에서 메일 취소 사용 예
    onMessageHandler: function (page, param) {
        if (page == "ESD023P_02") {
            var formData = {
                C_NATIVE_NUM: param.C_NATIVE_NUM
                , G_TEXT: param.G_TEXT
            }

            ecount.common.api({
                url: "/Common/Infra/SaveCancellationReasonOfMail",
                async: false,
                data: Object.toJSON(formData),
                success: function (result) {
                    console.log(result);
                    if (result.Status != "200") {
                        runSuccessFunc = result.Status == "202";
                        ecount.alert(result.fullErrorMsg);
                    }
                    else {
                        runSuccessFunc = true;
                        ecount.alert("완료");
                    }
                }.bind(this)
            });
        }
    },
    */

});
