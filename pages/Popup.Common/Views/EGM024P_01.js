window.__define_resource && __define_resource("LBL12306","MSG07032","MSG07033","MSG08593","MSG07034","LBL12307","BTN00008","MSG07031");
/****************************************************************************************************
1. Create Date : 2017.03.10
2. Creator     : 김동수
3. Description : 그룹웨어 안내 
4. Precaution  :
5. History     :  
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGM024P_01", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);

    },

    initProperties: function () {

    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(resource.LBL12306); //그룹웨어 안내
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            toolbar1 = g.toolbar(),
            ctrl = widget.generator.control(),
            div1 = g.div(),
            div2 = g.div(),
            div4 = g.div(),
            div3 = g.div();

        div1.css("wrapper-article").html(ecount.resource.MSG07032); //이카운트 그룹웨어를 통해, 각 구성원들이 원활하게 업무를 공유할 수 있으며 <br/> ERP 기능과 통합하여 업무 효율을 극대화할 수 있습니다.
        div2.css("wrapper-article").html(ecount.resource.MSG07033); //<b>[주요기능]</b> <br/> <table width='95%'><tr><td>- 전자결재</td><td> - 각종 게시판</td><td> - 일정관리</td></tr><tr><td> - 업무전달</td><td> - 고객관리(CRM)</td><td> - 출퇴근관리</td></tr><tr><td> - 파일관리함</td><td> - 프로젝트관리</td><td> - 공용품관리</td></tr></table>
        div4.css("wrapper-article").html(ecount.resource.MSG08593); //<b>[무료 제공 기능]</b> <br/> <table width='95%'><tr><td>- 일정관리</td><td> - 출퇴근관리</td><td> - 명함관리</td></tr></table>
        if (ecount.config.groupware.FREE_USED_YN != "Y") {
            div3.css("wrapper-article").html(ecount.resource.MSG07034); //그룹웨어 신청을 통해, 지금 바로 <span class='text-danger'>3개월 무료 서비스</span>를 이용할 수 있습니다. <br/> (3개월 무료 서비스는 <span class='text-danger'>최초 1회만</span> 가능합니다.)
        }

        contents.add(div1).add(div2).add(div4).add(div3);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(resource.LBL12307).clickOnce()); //그룹웨어 신청
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {

    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //저장- Flag = 1
    onFooterApply: function (e) {

        if (this.viewBag.InitDatas.userFlag != "M") {
            var btnApply = this.footer.getControl("apply");
            btnApply.setAllowClick();
            ecount.alert(ecount.resource.MSG07031); //마스터ID만 신청이 가능합니다.
            return false;
        }

        var customerWidth = 1100;
        var customerHeight = 740;

        if (screen.availWidth < 1100) {
            customerWidth = screen.availWidth * 0.95;
        }

        if (screen.availHeight < 740) {
            customerHeight = screen.availHeight * 0.9;
        }

        var url = ecount.common.buildSessionUrl("/ECERP/ECU/ECU500M") + "&navIndex=5";
        window.open(url, 'groupware', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=' + customerWidth + ',height=' + customerHeight);

    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        //this.onFooterApply();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
        // this.onContentsSearch(target.control.getValue());
    },


});
