window.__define_resource && __define_resource("LBL10748","LBL03261","LBL03262","LBL03263","LBL03264","LBL04412","LBL00862","LBL03067","LBL00829","LBL04395","LBL04396","LBL01642","LBL01643","LBL03201","LBL10956","BTN00069","BTN00008","MSG01140");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : Total/Subtotal Display Name(합계/소계표시명)
 4. Precaution  :
 5. History     : 
 6. MenuPath    : Template Setup(양식설정)>Total/Subtotal Display Name(합계/소계표시명)
 7. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EBA001P_15", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    off_key_esc: true,

    formOutSetReportTitle: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var message = {
            type: "getformOutSetReportTitle",
            callback: function (data) {
                this.formOutSetReportTitle = data;
            }.bind(this)
        };
        this.sendMessage(this, message);
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL10748);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form = generator.form();

        var thisObj = this;
        form.template("register")
            .useBaseForm();

        //개발결정사항 1581  재무상태표, 원가명세서 케이스일때 프로그램에서 예외 케이스로 구현한다. 해당양식 개발시 구현 TO-DO
        if (["AO270", "AO271"].contains(thisObj.FORM_TYPE)) {
            thisObj.setFormOutSetReportTitle({ form: form, ctrl: ctrl, ary: [["11", ecount.resource.LBL03261], ["12", ecount.resource.LBL03262], ["13", ecount.resource.LBL03263], ["14", ecount.resource.LBL03264]] });
        } else if (thisObj.FORM_TYPE.substring(0, 4) == "AO29") {
            thisObj.setFormOutSetReportTitle({ form: form, ctrl: ctrl, ary: [["21", ecount.resource.LBL04412], ["22", ecount.resource.LBL00862], ["23", ecount.resource.LBL03067], ["24", ecount.resource.LBL00829], ["25", ecount.resource.LBL04395], ["26", ecount.resource.LBL04396]] });
        } else if (["AO950", "AO951"].contains(thisObj.FORM_TYPE)) {
            thisObj.setFormOutSetReportTitle({ form: form, ctrl: ctrl, ary: [["27", ecount.resource.LBL01642], ["28", ecount.resource.LBL01643], ["29", ecount.resource.LBL03201]] });
        } else {
            thisObj.setFormOutSetReportTitle({ form: form, ctrl: ctrl, ary: [["30", ecount.resource.LBL10956], ["31", ecount.resource.LBL03067]] });
        }
        contents.add(form);
    },
    onChangeControl: function (control) {


    },
    // Footer Initialization
    onInitFooter: function (footer) {
        var tool = widget.generator.toolbar(),
             ctl = widget.generator.control();

        tool.addLeft(ctl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce())
            .addLeft(ctl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(tool);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        if (!e.unfocus) {
            if (["AO270", "AO271"].contains(this.FORM_TYPE)) {
                this.contents.getControl("titleCd11").setFocus(0);
            } else if (this.FORM_TYPE.substring(0, 4) == "AO29") {
                this.contents.getControl("titleCd21").setFocus(0);
            } else if (["AO950", "AO951"].contains(this.FORM_TYPE)) {
                this.contents.getControl("titleCd27").setFocus(0);
            } else {
                this.contents.getControl("titleCd30").setFocus(0);
            }
        }
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // apply button click event
    onFooterApply: function () {
        var thisObj = this;
        var errcnt = thisObj.contents.validate().merge().length;
        if (errcnt == 0) {
            thisObj.formOutSetReportTitle.forEach(function (item) {
                if (thisObj.contents.getControl("titleCd" + item.Key.TITLE_CD) != null)
                    item.TITLE_NM = thisObj.contents.getControl("titleCd" + item.Key.TITLE_CD).getValue();
            });

            var message = {
                formOutSetReportTitle: thisObj.formOutSetReportTitle,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } else {
            thisObj.footer.getControl('apply').setAllowClick();
        }
    },


    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F2: function () {

    },

    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterApply();
    },

    ON_KEY_TAB: function () {
    },

    ON_KEY_ENTER: function () {
    },

    onFocusOutHandler: function (event) {
        if (event.target == "contents") {
            this.footer.getControl('apply').setFocus(0);
        }
    },


    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    setFormOutSetReportTitle: function (param) {
        var thisObj = this;
        //디비에 값이 없을때 처리
        if (thisObj.formOutSetReportTitle.length == 0) {
            param.ary.forEach(function (item) {
                thisObj.formOutSetReportTitle.push({ Key: { FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: thisObj.FORM_SEQ, TITLE_CD: item[0] }, TITLE_NM: "" });
            });
        } else {
            param.ary.forEach(function (item) {
                if ($.isNull(thisObj.formOutSetReportTitle.find(function (row) { return row.Key.TITLE_CD == item[0] })))
                    thisObj.formOutSetReportTitle.push({ Key: { FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: thisObj.FORM_SEQ, TITLE_CD: item[0] }, TITLE_NM: "" });
            });
        }
        param.ary.forEach(function (item) {
            param.form.add(param.ctrl.define("widget.input.general", "titleCd" + item[0], "titleCd" + item[0], item[1])
                    .filter("maxlength", { message: String.format(ecount.resource.MSG01140, "100"), max: 100 })
                    .value(thisObj.formOutSetReportTitle.find(function (row) { return row.Key.TITLE_CD == item[0] }).TITLE_NM).end());

        });
    }
});
