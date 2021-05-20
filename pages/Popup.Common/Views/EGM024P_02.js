window.__define_resource && __define_resource("LBL12308","MSG07035","LBL12310","MSG07036","LBL09473","MSG07037","LBL11220","MSG07038","MSG08613","MSG08612","LBL12309","BTN00008","BTN85001","LBL01932","LBL01039","MSG07031");
/****************************************************************************************************
1. Create Date : 2017.03.10
2. Creator     : 김동수
3. Description : 그룹웨어 사용량 추가 
4. Precaution  :
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGM024P_02", {
                                                
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
        if (viewBag.InitDatas.userFlag == "M") {
            header.setTitle(resource.LBL12308); //그룹웨어 사용량 추가
        }
        else
            header.disable();
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            toolbar1 = g.toolbar(),
            ctrl = widget.generator.control(),
            //toolbar1 = g.toolbar(),
            //toolbar2 = g.toolbar(),
            //controls = [],
            //div0 = g.toolbar(),

            div1 = g.div(),
            div2 = g.div(),
            div21 = g.div(),
            div3 = g.div(),
            div31 = g.div(),
            div4 = g.div(),
            div41 = g.div();

        divcs = g.div();
        divuser = g.div();

        div1.css("wrapper-article").html(ecount.resource.MSG07035); //귀사의 그룹웨어 사용 용량이 초과되었거나 100MB 미만 남았습니다.<br/> 지속적인 그룹웨어의 사용을 위해, 사용인원(사용량)을 추가해주시기 바랍니다.
        div2.css("wrapper-sub-title").html(ecount.resource.LBL12310); //사용량 확인
        div21.css("wrapper-article").html(ecount.resource.MSG07036); //<span class='text-info'>Self-Customizing > 사용방법설정 > 그룹웨어 > 그룹웨어사용현황</span><br/> Self-Customizing > 정보관리 > 데이터관리 메뉴를 통해 불필요한 자료에 대한 백업 및 삭제가 가능합니다. (마스터ID만 백업 및 삭제 가능합니다.)
        div3.css("wrapper-sub-title").html(ecount.resource.LBL09473);
        div31.css("wrapper-article").html(ecount.resource.MSG07037); //<span class='text-danger'>5 User 당(2.5GB 제공) 월 1만원(VAT 별도)</span>의 사용료가 청구됩니다.<br/> 5 User 단위로 신청 및 추가할 수 있습니다.
        div4.css("wrapper-sub-title").html(ecount.resource.LBL11220);
        div41.css("wrapper-article").html(ecount.resource.MSG07038); //마스터ID만 신청/취소할 수 있습니다.

        if (viewBag.InitDatas.csFlag == true) {
            this.resizeLayer(350, 210);
            divcs.css("wrapper-article").html(ecount.resource.MSG08613);
            contents.add(divcs)
        }
        else if (viewBag.InitDatas.userFlag == "C") {
            this.resizeLayer(350, 210);
            divuser.css("wrapper-article").html(ecount.resource.MSG08612);
            contents.add(divuser)
        }           
        else{
            contents.add(div1)
            //.add(div0).add(toolbar1).add(toolbar2)
                    .add(div2).add(div21).add(div3).add(div31).add(div4).add(div41);
        }
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        if (viewBag.InitDatas.userFlag == "M") {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(resource.LBL12309).clickOnce()); //사용량추가
        }
        if (viewBag.InitDatas.userFlag == "M")
            toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        else
            toolbar.addLeft(ctrl.define("widget.button", "ok").label(resource.BTN85001));
        if (this.IsMoreCheckbox) {
            toolbar.addRight(ctrl.define("widget.checkbox", "closePopupToday").value("1").label(ecount.resource.LBL01932));
            toolbar.addRight(ctrl.define("widget.checkbox", "closePopup").value("1").label(ecount.resource.LBL01039));
        }
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {

        var cookieValue = $.cookie("EGM024P_02");
        //ecount.alert(cookieValue);
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

        // 더이상안보기(100MB 이하일 경우만 처리 가능)
        var check = this.footer.getControl("closePopup");
        if (check) {
            if (this.footer.getControl("closePopup").getValue() == true) {
                $.cookie('EGM024P_02', 'done365', { expires: 365, path: '/' });
            }
            else if (this.footer.getControl("closePopupToday").getValue() == true) {
                $.cookie('EGM024P_02', 'done', { expires: 1, path: '/' });
            }
        }

        this.close();
        return false;
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {

    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
       // this.onContentsSearch(target.control.getValue());
    },

    /**********************************************************************
    *  utility
    **********************************************************************/
    setCookies: function (name, value, expiredays) {
        //var todayDate = new Date();
        //todayDate.setDate(todayDate.getDate() + expiredays);
        //document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"

        $.cookie(name, value, { expires: expiredays, path: '/' });
        //$.cookie(name, value, { expires: expiredays, path: '/', domain: 'jquery.com', secure: true });
    },

    onFooterOk: function () {
        this.close();
        return false;
    },

});
