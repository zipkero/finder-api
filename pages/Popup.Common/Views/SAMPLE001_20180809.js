/****************************************************************************************************
1. Create Date : 2015.11.03
2. Creator     : 허휘영
3. Description : 샘플
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "SAMPLE001", {

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
    
    off_key_esc: true,

onPreInitHeader: function (req) {},
    
    onInitHeader: function (header, resource) { },

    onPreInitContents: function (req) { },

    onInitContents: function (contents, resource) {
        var g = widget.generator,
                grid = g.grid(),
                form = g.form(),
                form2 = g.form(),
                form3 = g.form(),
                form4 = g.form(),
                subTitle = g.subTitle(),
                subTitle2 = g.subTitle(),
                subTitle3 = g.subTitle(),
                subTitle4 = g.subTitle(),
                remark = g.remark(),
                controls = new Array(),
                controls2 = new Array(),
                controls3 = new Array(),
                controls4 = new Array(),
                ctrl = g.control(),
                toolbar = g.toolbar(),
                toolbar2 = g.toolbar();
        tabContents = g.tabContents();

        //remark
        remark.title("리마크 테스트");
        contents.add(remark);

        subTitle.title("서비타이틀 테스트");
        contents.add(subTitle);

        form
            .css("table table-bordered table-border-no-v table-border-no-lr")
            .useBaseForm({ _isThShow: 1 })
            .setColSize(2)
            .colgroup([{width: 100}, {width:200}, {width:0}])
        controls.push(ctrl.define("widget.link", "link1", "link1", "테스트").label("테스트1").end());
        controls.push(ctrl.define("widget.link", "link2", "link2").label("테스트2").end());
        controls.push(ctrl.define("widget.link", "link3", "link3", "테스트3").label("테스트3").end());
        controls.push(ctrl.define("widget.link", "link4", "link4", "테스트4").label("테스트4").end());
        controls.push(ctrl.define("widget.link", "link5", "link5", "테스트5").label("테스트5").end());
        controls.push(ctrl.define("widget.link", "link6", "link6").label("테스트6").end());
        controls.push(ctrl.define("widget.link", "link7", "link7", "테스트7").label("테스트7").end());
        form.addControls(controls);
        form.rowspan(2, 2);
        contents.add(form);


        toolbar.attach(ctrl.define("widget.input.general", "input1", "input1"));
        contents.add(toolbar);

        subTitle.title("서비타이틀 테스트3");
        contents.add(subTitle);

        form2
            .css("table table-bordered table-border-no-v table-border-no-lr")
            .useBaseForm({ _isThShow: 0 })
            .setColSize(3)
        controls2.push(ctrl.define("widget.link", "link1", "link1").label("테스트1").end());
        controls2.push(ctrl.define("widget.link", "link2", "link2").label("테스트2").end());
        controls2.push(ctrl.define("widget.link", "link3", "link3").label("테스트3").end());
        controls2.push(ctrl.define("widget.link", "link4", "link4").label("테스트4").end());
        controls2.push(ctrl.define("widget.link", "link5", "link5").label("테스트5").end());
        controls2.push(ctrl.define("widget.link", "link6", "link6").label("테스트6").end());
        form2.addControls(controls2);
        contents.add(form2);
        
        subTitle2.title("연산자");
        contents.add(subTitle2);
        toolbar2
            .setOptions({"cssToolbar": "text-center"})
            .attach(ctrl.define("widget.button", "button1", "button1").label("양식설정 팝업창 열기").css("btn btn-sm btn-default"))
        .attach(ctrl.define("widget.button", "button2", "button2").label("사용방법설정-(재고)프로젝트별관리").css("btn btn-sm btn-default"));
        contents.add(toolbar2);


        subTitle3.title("계산식");
        contents.add(subTitle3);

        controls3.push(ctrl.define("widget.code.account", "buttongroup1", "buttongroup1", "확인")
            .setOptions({ label: ["삭제", "조건"], statusId: ["bdelete", "bsearch"] })
            .disableCacheOnAutocomplete(true)
            .end());
        controls3.push(ctrl.define("widget.input.buttonGroup", "buttongroup2", "buttongroup2", "확인")
            .setOptions({ label: ["삭제", "조건"], statusId: ["bdelete", "bsearch"] })
            .end());
        controls3.push(ctrl.define("widget.input.buttonGroup", "buttongroup3", "buttongroup3", "확인")
            .setOptions({ label: ["삭제", "조건"], statusId: ["bdelete", "bsearch"] })
            .setOptions({ containsType: "gen" })
            .readOnly(true)
            .value("ijgowjiofwejoiijoijoewiorweijorjewiorjiowerjiowefjiowefjiowefjiowejfiowejiofweji23423423464yhrfhrthrthrthrthrhrtofjweiofjweiofjweio")
            .end());

        //controls3.push(ctrl.define("widget.acDate", "acDate", "acDate", "ac위젯")
        //    .acDatePeriod("2000-01", "2015-12", "2014-03")
        //     .minimumDate("200501", "오류!!!")
        //    .end());

        //controls3.push(ctrl.define("widget.multiAcDate", "multiAcDate", "multiAcDate", "멀티 ac 위젯")
        //    .acDatePeriod("2000-01", "2015-12", ["2014-03", "2015-11"])
        //    .minimumDate("200501", "오류!!!")
        //    .end());
        controls3.push(ctrl.define("widget.label", "label2", "label2", "라벨")
            .setOptions({ _isRight: true, _isTitleLink: true })
            .label("테스트라벨")
           .end());

        controls3.push(ctrl.define("widget.checkbox.flipSwitch", "flipwitch", "flipwitch", "체크스위치")/*.value(true)*/.end());
        controls3.push(ctrl.define("widget.checkbox.flipSwitch", "flipwitch2", "flipwitch2", "체크스위치2")
            //.value("Y")
            .select(true)
            .end());

        form3
            .setOptions({ _depthRows: [1, 2] })
            .css("table table-bordered table-th-left form-control-border-no table-layout-auto")
            .useBaseForm()
            .addControls(controls3);
            
        contents.add(form3);


        //tab
        controls4.push(ctrl.define("widget.input", "tabInput1", "tabInput1", "확인").end());
        controls4.push(ctrl.define("widget.input", "tabInput2", "tabInput2", "확인").end());

        form4.useBaseForm()
            .addControls(controls4);

        tabContents
            .createTab("tab1", "tab1", null, true)
            .add(form4)
            .createTab("tab2", "tab2", null, false)
            .add(subTitle.title("서비타이틀 테스트"))
        contents.add(tabContents);

    },

    onInitFooter: function (footer, resource) { },

    onInitControl: function (cid, control) { },

    onSubTitleLabel2: function (event) {
        ecount.alert("테스트 팝업");
    },


/**************************************************************************************************** 
* define common event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (event) { },

    //onPopupHandler: function (control, config, handler) { },

    //onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (message) { },

    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },

    //onFocusOutHandler: function (event) { },

    onChangeControl:function(){
        var a = "test";
    },
    

/****************************************************************************************************
* define grid event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) { },

    onGridAfterFormLoad: function (e, data, grid) { },


/**************************************************************************************************** 
* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    onContentsButton1: function (event) {
        //var a = this.contents.getControl("acDate").getStringDate();
        //var b = this.contents.getControl("multiAcDate").getStringDate();
        //var validate = this.contents.getControl("acDate").validate();
        //if (validate.length > 0) {
        //    validate[0][0].control.showError(validate[0][0].message);
        //}
        //validate = this.contents.getControl("multiAcDate").validate();
        //if (validate.length > 0) {
        //    validate[0][0].control.showError(validate[0][0].message);
        //}

        //this.openWindow("/ECERP/Popup.Form/CM100P_06", {});
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_06",
            name: 'CM100P_06',
            param: {width:1020, height:800}
        });
    },

    onContentsButton2: function (event) {

        var param = {
            width: 450,
            height: 150,
            ISSELFCUSTOM : true,
            SETUPID: "",
            POPUP_CD:"503"
        };
        this.openWindow({
            url: "/ECERP/ESC/ESC001P_106",
            name: '(재고)프로젝트별관리',
            popupType: false,
            additional: false,
            param: param
        })

    },



/**************************************************************************************************** 
*  define hotkey event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
****************************************************************************************************/
    





/**************************************************************************************************** 
* define user function 
****************************************************************************************************/



});