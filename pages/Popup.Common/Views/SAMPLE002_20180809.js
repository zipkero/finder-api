/****************************************************************************************************
1. Create Date : 2015.11.03
2. Creator     : 허휘영
3. Description : 양식샘플
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "SAMPLE002", {

    header: null,

    contents: null,

    footer: null,

/**************************************************************************************************** 
* user opion Variables(사용자변수 및 객체) 
****************************************************************************************************/
    




/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    initEcConfig: function () {},

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
    onPreInitHeader: function (req) {},
    
    onInitHeader: function (header, resource) { },

    onPreInitContents: function (req) { },

    onInitContents: function (contents, resource) {
        var g = widget.generator,
            tabContents1 = g.tabContents(),
            form1 = g.form(),
            form2 = g.form(),
            form3 = g.form(),
            panel = g.panel(),
            panel2 = g.panel(),
            panel3 = g.panel(),
            toolbar = g.toolbar(),
            ctrl = g.control(),
            subctrl = g.control(),
            grid = g.grid(),
            grid2 = g.grid(),
            subTitle = g.subTitle(),
            controls = new Array(),
            subTitle2 = g.subTitle(),
            controls = new Array();

        form1.add(ctrl.define("widget.button", "calcEPG1", "calcEPG1", "국내 수당 그냥 띄우기").label("팝업").end());
        form1.add(ctrl.define("widget.button", "calcEPG3", "calcEPG3", "국내 수당 계산식 데이터 띄우기").label("팝업").end());

        form1.add(ctrl.define("widget.button", "calcEPG2", "calcEPG2", "국내 공제 그냥 띄우기").label("팝업").end());

        form1.add(ctrl.define("widget.button", "calcEPL1", "calcEPL1", "국외 수당 그냥 띄우기").label("팝업").end());

        form1.add(ctrl.define("widget.button", "calcEPL2", "calcEPL2", "국외 공제 그냥 띄우기").label("팝업").end());
        form1.add(ctrl.define("widget.button", "calcEPL4", "calcEPL4", "국외 공제 조건식 데이터 띄우기").label("팝업").end());

        form1.add(ctrl.define("widget.button", "calcString", "calcString", "문자연결식").label("팝업").end());

        form1.add(ctrl.define("widget.button", "calcCM100P05", "calcCM100P05", "판매현황").label("팝업").end());

        contents.add(form1);
    },

    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label("New"));
        toolbar.addLeft(ctrl.define("widget.button", "Change").label("Change"));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label("Close"));
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) { },



/**************************************************************************************************** 
* define common event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
****************************************************************************************************/
    

/****************************************************************************************************
* define grid event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    
/**************************************************************************************************** 
* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    onContentsCalcEPG1: function () {
        //this.openWindow({
        //    url: '/ECERP/Popup.Common/CM100P_05',
        //    name: "TEST",
        //    param: {
        //        width: 750,
        //        height: 630,
        //        CALC_PAGE: "EPG003P_01",
        //        AdType: "A",
        //        AdYear: "2016",
        //        IS_CALC_ONLY: false,
        //        IS_CALC_TYPE: true
        //    },
        //    additional: false,
        //    popupType: false
        //});
        var url = ecount.common.buildSessionUrl("/ECERP/Popup.Common/CM100P_05?CALC_PAGE=EPG003P_01&AdType=A&AdYear=2016&IS_CALC_ONLY=false&IS_CALC_TYPE=true");
        window.open(url, "asdf", "width=350,height=400");
    },
    onContentsCalcEPG2: function () {
        this.openWindow({
            url: '/ECERP/Popup.Common/CM100P_05',
            name: "TEST",
            param: {
                width: 750,
                height: 630,
                
                AdType: "D",
                AdYear: "2016",
                IS_CALC_ONLY: false,
                IS_CALC_TYPE: true,
                CALC_PAGE: "EPG003P_01",
                UserData: "UserData",
                IsRequired: false
            },
            additional: false,
            popupType: false
        });
    },
    onContentsCalcEPG3: function () {
        this.openWindow({
            url: '/ECERP/Popup.Common/CM100P_05',
            name: "TEST",
            param: {
                width: 750,
                height: 630,

                AdType: "A",
                AdYear: "2016",
                IS_CALC_ONLY: false,
                IS_CALC_TYPE: true,
                CALC_PAGE: "EPG003P_01",
                CALC_DESC: "default^calc_des^R(ㆍA01ㆍ/ㆍ1ㆍ5ㆍ*ㆍ1ㆍ2ㆍ/ㆍ8ㆍ*ㆍ2ㆍ0ㆍ9ㆍ/ㆍ3ㆍ0ㆍ*ㆍA08ㆍ)ㆍ+ㆍC(ㆍA06ㆍ)ㆍ*ㆍA25",
                CALC_GUBUN: "7ㆍ1ㆍ6ㆍ3ㆍ3ㆍ6ㆍ3ㆍ3ㆍ6ㆍ3ㆍ6ㆍ3ㆍ3ㆍ3ㆍ6ㆍ3ㆍ3ㆍ6ㆍ1ㆍ8ㆍ6ㆍ7ㆍ1ㆍ8ㆍ6ㆍ1",
                UserData: "UserData",
                IsRequired: false
            },
            additional: false,
            popupType: false
        });
    },
    onContentsCalcEPL1: function () {
        this.openWindow({
            url: '/ECERP/Popup.Common/CM100P_05',
            name: "TEST",
            param: {
                width: 750,
                height: 630,
                AdType: "A",
                IS_CALC_ONLY: false,
                IS_CALC_TYPE: true,
                CALC_PAGE: "EPL003P_01",
                UserData: "UserData",
                IsRequired: false
            },
            additional: false,
            popupType: false
        });
    },
    onContentsCalcEPL2: function () {
        this.openWindow({
            url: '/ECERP/Popup.Common/CM100P_05',
            name: "TEST",
            param: {
                width: 750,
                height: 630,
                
                AdType: "D",
                IS_CALC_ONLY: false,
                IS_CALC_TYPE: true,
                CALC_PAGE: "EPL003P_01",
                UserData: "UserData",
                IsRequired: false
            },
            additional: false,
            popupType: false
        });
    },
    onContentsCalcEPL4: function () {
        this.openWindow({
            url: '/ECERP/Popup.Common/CM100P_05',
            name: "TEST",
            param: {
                width: 750,
                height: 630,
                CALC_PAGE: "EPL003P_01",
                AdType: "D",
                IS_CALC_ONLY: false,
                IS_CALC_TYPE: true,
                CALC_DESC: "^trDefine1^GRP02 in ('04')§True1^trDefine2^GRP03 in ('cd01')§True1^trTrue2^1§False2^trDefine3^GRP03 in ('00001','00002')§True3^trDefine4^D001ㆍ>ㆍA001§True3^trTrue4^2§True3^trFalse4^3§False2^trFalse3^4§False1^trDefine5^T002ㆍ<=ㆍT004§False1^trTrue5^5§False5^trDefine6^GRP04 in ('00004','cn01')§False5^trTrue6^6§False6^trDefine7^A005ㆍ=ㆍA004§False6^trTrue7^7§False7^trDefine8^D002ㆍ<>ㆍD001§False7^trTrue8^8§False8^trDefine9^1ㆍ>ㆍT002§False8^trTrue9^9§False9^trDefine10^T002ㆍ*ㆍT003ㆍ>=ㆍA005§False9^trTrue10^1ㆍ0§False9^trFalse10^1ㆍ1",
                CALC_GUBUN: "2§2§3§2§1ㆍ5ㆍ1§3§3§3§1ㆍ5ㆍ1§3§2§3§1ㆍ5ㆍ1§3§1ㆍ5ㆍ1§3§3ㆍ5ㆍ1§3§1ㆍ6ㆍ1ㆍ5ㆍ1§3ㆍ3§3ㆍ3",
                CALC_ORDER: "trTrue1-y-trTrue1§trFalse2-y-trFalse2 trTrue1§trTrue3-y-trTrue3 trFalse2 trTrue1§trFalse1-y-trFalse1§trFalse5-y-trFalse5 trFalse1§trFalse6-y-trFalse6 trFalse5 trFalse1§trFalse7-y-trFalse7 trFalse6 trFalse5 trFalse1§trFalse8-y-trFalse8 trFalse7 trFalse6 trFalse5 trFalse1§trFalse9-y-trFalse9 trFalse8 trFalse7 trFalse6 trFalse5 trFalse1"
            },
            additional: false,
            popupType: false
        });
    },
    onContentsCalcString: function() {
        this.openWindow({
            url: '/ECERP/Popup.Common/CM100P_05',
            name: "TEST",
            param: {
                width: 750,
                height: 630,
                CALC_PAGE: "EPL003P_02",
                IS_CALC_ONLY: true,
                IS_CALC_TYPE: false,
                IS_RESIZE: true
            },
            additional: false,
            popupType: false
        });
    },
    onContentsCalcCM100P05: function () {
        this.openWindow({
            url: '/ECERP/Popup.Common/CM100P_05',
            name: "TEST",
            param: {
                width: 750,
                height: 630,
                CALC_PAGE: "CM100P_05",
                AdType: "SO030",
                IS_CALC_ONLY: false,
                IS_CALC_TYPE: true
            },
            additional: false,
            popupType: false
        });
    },
/**************************************************************************************************** 
*  define hotkey event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
****************************************************************************************************/

/**************************************************************************************************** 
* define user function 
****************************************************************************************************/
    fnSave: function() {

    }
});

function onMessageHandler(message) {
    message && message.callback && message.callback();
}