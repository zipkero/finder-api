window.__define_resource && __define_resource("LBL02339","LBL00021","LBL00023","MSG80019","BTN00065","BTN00007","BTN00008","BTN00274","LBL07690","MSG02574","MSG03085","MSG02881","LBL00030","LBL00031","LBL00032");
ecount.page.factory("ecount.page.popup.type2", "EZB004M", {

    pageID: null,

    //header: null,

    //contents: null,

    //footer: null,

    ecConfig : null,//"config.account", "config.inventory", "config.groupware", "config.company", "config.user", "config.feature", "config.nation", "company", "user"


    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/





    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.ecConfig = [];
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

        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL02339);

    },

    onInitContents: function (contents) {

        var tabContents = widget.generator.tabContents();
        var ctrl = widget.generator.control();
        var form1 = widget.generator.form(),
            form2 = widget.generator.form();

        form1.colgroup([{ width: 100 }]);
        form2.colgroup([{ width: 100 }]);

        var titleCols = "";
        Object.values(this.viewBag.InitDatas.mapSetting).forEach(function (item) {
            if (titleCols == "") {
                if (item.Required)
                    titleCols = String.format("<span class=\"text-bold\">{0}({1})</span>", item.Title, item.MaxLength);
                else
                    titleCols = String.format("{0}({1})", item.Title, item.MaxLength);
            }
            else {
                if (item.Required)
                    titleCols += String.format(", <span class=\"text-bold\">{0}({1})</span>", item.Title, item.MaxLength);
                else
                    titleCols += String.format(", {0}({1})", item.Title, item.MaxLength);
            }
        });
        titleCols = titleCols + ", <span class=\"text-bold\">ecount</span>";

        //titleCols.unescapeHTML()
        form1.add(ctrl.define("widget.label", "lblCode", "lblCode", ecount.resource.LBL00021).label(titleCols).useHTML().end());
        form2.add(ctrl.define("widget.textarea", "txtExcel", "txtExcel", ecount.resource.LBL00023).rowSize(10).dataRules(['required'], ecount.resource.MSG80019).end());
        tabContents
            .createActiveTab("quick", ecount.resource.LBL00023)
            .add(form1)
            .add(form2);

        contents.add(tabContents);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        //임시구현 - 위젯에서 웹자료 올리기형태 UI 지원이 안됨
        toolbar.addLeft(ctrl.define("widget.button", "downExcel").label(ecount.resource.BTN00274));
        toolbar.addLeft(ctrl.define("widget.button", "viewDetail").label(ecount.resource.LBL07690));
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

    onLoadComplete: function (event) { },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (message) { },

    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },


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

    //초기화
    onFooterReset: function () {
        this.contents.getControl("txtExcel").setValue("");
    },

    //저장버튼
    onFooterSave: function () {

        if (this.contents.validate().merge().length > 0) return;

        var txtExcel = this.contents.getControl("txtExcel");
        var thisObj = this;

        //메시지 초기화
        txtExcel.hideError("");

        var s = this.fnCheckRemarks(txtExcel.getValue());
        if (s == 0) {
            txtExcel.showError(ecount.resource.MSG02574); //현재 자료가 없거나 마지막 항목에 ecount를 확인하세요.
            txtExcel.setFocus(0);

            return false;
        }else if (s > 300) {
            txtExcel.showError(ecount.resource.MSG03085); // 현재 자료가 300건이 넘습니다
            txtExcel.setFocus(0);
            return false;
        }
        //엑셀 데이터 배열로
        var data = [];
        var txtExcelValue = this.contents.getControl("txtExcel").getValue();
        for (var i = 0; i < txtExcelValue.replace('\n', '').replace(/ECOUNT/gi, "ecount").split('ecount').length; i++) {
            if (txtExcelValue.replace(/ECOUNT/gi, "ecount").split('ecount')[i].replace(/\n/gi, "").split('\t').length > 1)
                data.push(txtExcelValue.replace(/ECOUNT/gi, "ecount").split('ecount')[i].replace(/\n/gi, "").split('\t'));
        }
        var formData = {
            FormType: this.viewBag.DefaultOption.DocCode,
            UploadWebDatas: []//this.contents.getControl("txtExcel").getValue()
        };
        //엑셀 값 할당
        for (var i = 0; i < data.length ; i++) {
            var hash = new $.HashMap();
            $.each(Object.keys(this.viewBag.InitDatas.mapSetting), function (j, key) {
                hash.set(key, data[i][j] || "");
            });
            formData.UploadWebDatas.push(hash);
        }
        ecount.common.api({
            url: "/Common/Infra/DataUploadForWeb",
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

                    if (result.Data.Sucess == 0 && result.Data.fail == 0) {
                        //자료올리기 할 자료가 없습니다.\n\n먼저 자료를 등록 바랍니다.
                        ecount.alert(ecount.resource.MSG02881);
                    }
                    else if (result.Data.Sucess == 0 && result.Data.fail > 0) {
                        //실패 : {0}건
                        var msg = String.format(ecount.resource.LBL00030, result.Data.fail) + "\n";
                        for (var i = 0; i < result.Data.RowErrMessage.length; i++) {
                            msg += "\n" + result.Data.ErrMessage[i];
                        }
                        ecount.alert(msg);
                    }
                    else if (result.Data.Sucess > 0 && result.Data.fail == 0) {
                        //성공 : {0}건
                        var msg = String.format(ecount.resource.LBL00031, result.Data.Sucess) + "\n";
                        ecount.alert(msg);
                    }
                    else if (result.Data.Sucess > 0 && result.Data.fail > 0) {
                        //성공 : {0}건/ 실패 : {1}건
                        var msg = String.format(ecount.resource.LBL00032, result.Data.Sucess, result.Data.fail) + "\n";
                        for (var i = 0; i < result.Data.RowErrMessage.length; i++) {
                            if (result.Data.ErrMessage[i] != null && result.Data.ErrMessage[i] != "")
                                msg += "\n" + result.Data.ErrMessage[i];
                        }
                        ecount.alert(msg);
                    }
                    else
                        ecount.alert("Pass");
                }
            }.bind(this)
        });
        //{"Data":{"Sucess":1,"fail":0,"RowErrMessage":[{"row":1,"message":null}],"ErrMessage":[]},"Status":"200","Error":null,"Timestamp":"2015년 5월 12일 오전 11:10:44"}
        return false;
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    //엑셀다운
    onFooterDownExcel: function () {
        var param = {
            hidExDocCode: this.viewBag.DefaultOption.DocCode,
        }
        ecount.infra.convertExcel("/ECMAIN/EZB/EZB004E.aspx", param);
        return false;
    },
    //자세히보기
    onFooterViewDetail: function (e) {
        var param = {
            width: 800,
            height: 600,
            DocCode: this.viewBag.DefaultOption.DocCode
        };
        //모달로 띄우기
        this.openWindow({
            url: '/ECERP/Popup.Common/EZB004C',
            name: "",
            param: param,
            popupType: true,
            additional: false
        });
    },




    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/






    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //글자수 체크
    fnCheckRemarks: function (compare_text) {
        var target_word = new Array("ECOUNT", "ecount");
        var s = 0;
        for (var i = 0; i < target_word.length; i++) {
            for (var j = 0; j < (compare_text.length); j++) {
                if (target_word[i] == compare_text.substring(j, (j + target_word[i].length)).toLowerCase()) {
                    s++;
                }
            }
        }
        return s
    },

});