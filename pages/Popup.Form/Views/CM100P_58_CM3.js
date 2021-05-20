window.__define_resource && __define_resource("LBL01593","LBL12301","LBL12302","BTN00069","BTN00008","LBL04003","LBL70558","LBL35589","LBL12300");
/***********************************************************************************
 1. Create Date : 2017.03.09
 2. Creator     : inho
 3. Description : Head Title,SubTot Settings(헤더타이틀,소계 설정)
 4. Precaution  :
 5. History     : 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
 6. MenuPath    : Template Setup(양식설정)>Head Title,SubTot Settings(헤더타이틀,소계 설정)
 7. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_58_CM3", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    cofmTemp: null,

    formInfo: null,

    commonForm: null,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.registerDependencies("ecmodule.common.formHelper");
        this.registerDependencies("ecmodule.common.form");
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

    onInitHeader: function (header) {
        var message = {
            type: "getFormInfo",
            formIndex :this.formIndex,
            callback: function (data) {
                this.formInfo = data;
            }.bind(this)
        };
        this.sendMessage(this, message);
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL01593);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            batchSetup = g.batchSetup(),
            line = g.line(),
            subTitle = g.subTitle(),
            form = widget.generator.form(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        var thisObj = this;
        form.template("register")
            .useBaseForm({ _isThShow: true, _isRowInCount: 1 })
            .colgroup([{ width: "150" }, { width: "" }]);

        this.commonForm = new ecount.common.form();
        this.commonForm.setWidgetMap(thisObj);

        if (this.settingType == "headerTitle") {
            batchSetup.addLayer("item_0", "item_0", ecount.resource.LBL12301);
            thisObj.setFormBuilder({ type: "headDetail", contents: batchSetup });//default 기본
            thisObj.setFormBuilder({ type: "headFont", contents: batchSetup });//font 글꼴
            thisObj.setFormBuilder({ type: "headAlign", contents: batchSetup });//align 정렬

        } else {
            batchSetup.addLayer("item_0", "item_0", ecount.resource.LBL12302);
            thisObj.setFormBuilder({ type: "subTotTitle", contents: batchSetup });//default 기본
            thisObj.setFormBuilder({ type: "subTotFont", contents: batchSetup });//font 글꼴
            thisObj.setFormBuilder({ type: "subTotAlign", contents: batchSetup });//align 정렬
        }
        contents.add(batchSetup);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) { },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (e) {
        if (!e.unfocus) {
            if (!$.isNull(this.contents.getControl("headHeight")))
                this.contents.getControl("headHeight").setFocus(0);
            else if (!$.isNull(this.contents.getControl("titleCd30")))
                this.contents.getControl("titleCd30").setFocus(0);
            else if (!$.isNull(this.contents.getControl("subTotFontSize")))
                this.contents.getControl("subTotFontSize").setFocus(0);
        }
    },


    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },

    onFocusOutHandler: function (event) {
        //move next focus 다음 폼으로 이동
        var forms = this.contents.getForm();
        if (forms.length > 0)
        {
            if (event.__self == this.contents.getForm()[forms.length-1]){
                this.footer.getControl("apply").setFocus(0);
            } else {
                for (var i = 0; i < forms.length; i++) {
                    if (event.__self == this.contents.getForm()[i] && (forms.length - 1) > i) {
                        this.contents.getForm()[i + 1].getControlByIndex(0).setFocus(0);
                        break;
                    }
                }
            }
        }
    },

    onFocusOutControlHandler: function (control) {
    },

    onChangeControl: function (control, data) {
        var thisObj = this;
    },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //Apply 적용 버튼
    onFooterApply: function () {
        var thisObj = this;
        //check validate 유효성 체크
        var errcnt = this.validateNow().length;
        if(errcnt == 0)
            errcnt = this.contents.validate().merge().length;

        thisObj.commonForm.getWidgetHelper().getCheckKeys().forEach(function (key, j) {
            //call check function 호출 매핑 펑션
            errcnt = thisObj.commonForm.getWidgetHelper().getCheckWedgets().get(key)(errcnt);
        });

        if (errcnt == 0) {
            thisObj.commonForm.getWidgetHelper().getMappingKeys().forEach(function (key, j) {
                //call mapping function 호출 매핑 펑션
                thisObj.commonForm.getWidgetHelper().getMappingWedgets().get(key)();
            });
            var rowData = this.formInfo;
            var message = {
                data: rowData,
                formIndex: this.formIndex,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } else {
            thisObj.footer.getControl('apply').setAllowClick();
        }
    },

    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    //F8 Event
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterApply();
    },


    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/


    //builder for form 폼생성
    setFormBuilder: function (x) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            ctrl2 = generator.control(),
            ctrl3 = generator.control(),
            ctrl4 = generator.control(),
            ctrl5 = generator.control(),
            ctrl6 = generator.control(),
            ctrl7 = generator.control(),
            ctrl8 = generator.control(),
            ctrl9 = generator.control(),
            ctrl10 = generator.control(),
            form = widget.generator.form(),
            hr1 = generator.line(),
            hr2 = generator.line(),
            hr3 = generator.line(),
            hr4 = generator.line(),
            panel = widget.generator.panel();

        form
            .useBaseForm()
            .css("table-template-setup")
            .templateType("formset")
            .setOptions({ _isErrorBorderNone: true });
        

        var thisObj = this;
        var p = {
            ctrl: ctrl, ctrl2: ctrl2, ctrl3: ctrl3, ctrl4: ctrl4, ctrl5: ctrl5,
            ctrl6: ctrl6, ctrl7: ctrl7, ctrl8: ctrl8, ctrl9: ctrl9, ctrl10: ctrl10,
            form: form
        };
        switch (x.type) {
            case "headDetail"://상세설정
                thisObj.commonForm.getWidgetHelper().add(["headHeight2"], p);//표시명
                if (form.getRowCount() > 0) {
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL04003));
                    x.contents.add(form);
                }
                break;
            case "headFont"://font 글꼴
                thisObj.commonForm.getWidgetHelper().add(["headFontSize", "headFontStyle"], p);
                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL70558));//Font 글꼴  
                    x.contents.add(form);
                }
                break;
            case "headAlign"://align 정렬
                thisObj.commonForm.getWidgetHelper().add(["headHAlignType", "headVAlignType"], p);
                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL35589));//align 정렬
                    x.contents.add(form);
                }
                break;
            case "subTotTitle"://계 표시명
                thisObj.commonForm.getWidgetHelper().add(["subTotTitle"], p);//표시명
                if (form.getRowCount() > 0) {
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL12300));
                    x.contents.add(form);
                }
                break;
            case "subTotFont"://font 글꼴
                if (form.getRowCount() > 0)
                    x.contents.add(hr3.add("hr"));

                thisObj.commonForm.getWidgetHelper().add(["subTotFontSize", "subTotFontStyle"], p);
                if (form.getRowCount() > 0) {
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL70558));//Font 글꼴  
                    x.contents.add(form);
                }
                break;
            case "subTotAlign"://align 정렬
                thisObj.commonForm.getWidgetHelper().add(["subTotHAlignType", "subTotVAlignType"], p);
                if (form.getRowCount() > 0) {
                    x.contents.add(hr3.add("hr"));
                    x.contents.add(widget.generator.subTitle().title(ecount.resource.LBL35589));//align 정렬
                    x.contents.add(form);
                }
                break;
            default:

                break;


        }
    },
});
