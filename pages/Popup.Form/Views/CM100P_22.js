window.__define_resource && __define_resource("LBL00830","LBL13133","LBL13135","LBL13136","LBL13683","LBL09962","LBL05697","LBL05698","LBL05699","LBL93131","LBL05691","LBL01818","MSG01140","MSG01739","LBL03160","LBL06764","LBL04932","LBL00923","LBL01964","BTN00065","BTN00008","MSG04944","MSG05067","LBL03569");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : New(양식등록)
 4. Precaution  :
 5. History     : 2019.11.13 (On Minh Thien): A19_02314 - EP 조회 3초로 제한 후속
                  2020.10.22 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정_회계1
 6. MenuPath    : Self-Customizing>Configuration(환경설정)>Function Setup(사용방법설정)>Inv Tab(재고탭)>Template List(양식리스트)>New(양식등록)
 7. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_22", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    off_key_esc: true,

    DETAIL_BODY_FORM_TYPE: "",

    /// 권한설정이 가능한 양식인지
    /// Whether the form is available to set the authority 
    blAuthForm: false,

    collection: null,
    basicCollection: null,
    isSchedule: false,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },

    initProperties: function () {
        debugger;
        var thisObj = this;
        //상세설정을 사용하는 경우
        //개발결정사항:1581 - 상세설정을 사용하는 경우만 DETAIL_BODY_FORM_TYPE 생성
        if (thisObj.viewBag.InitDatas.formSet.DETAIL_BODY_YN == "Y"
            || (thisObj.viewBag.InitDatas.formSet.QUANTITY_YN == "Y" && thisObj.viewBag.InitDatas.formOutSet.VAT_FLAG == "0")) {
            thisObj.DETAIL_BODY_FORM_TYPE = thisObj.FORM_TYPE.replace("SF", "SE");
        }
        if (this.FORM_TYPE == "GO121" || this.FORM_TYPE == "GO131") {
            var resx = ecount.resource;
            var displayUnit = { 1: 8, 2: 1, 3: 10, 4: 9 };
            var titleNm = {};
            if(this.FORM_TYPE == "GO121")
                titleNm = { 1: resx.LBL00830, 2: resx.LBL13133, 3: resx.LBL13135, 4: resx.LBL13136 };
            else
                titleNm = { 1: resx.LBL00830, 2: resx.LBL13133, 3: resx.LBL13135, 4: resx.LBL13683 || "By Equipment" };
            this.isSchedule = true;
            this.viewBag.InitDatas.allowFormList.forEach(function (item) {
                if (item.ORD == 1) {
                    item.DISP_UNIT = displayUnit[item.FORM_SEQ - 1000];
                    item.TITLE_NM = titleNm[item.FORM_SEQ - 1000];
                    item.FORM_SEQ = 99;
                    item.HEADCOL_CNT = 6;
                    item.ORD = 0;
                }
            });
        }
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL09962);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form = generator.form();

        var thisObj = this;
        var option = this.getDataForFormList(thisObj.viewBag.InitDatas.allowFormList);

        form.template("register")
            .colgroup([{ width: "150" }, { width: "" }]);

        //if (["PF100", "PF101", "PF102", "PF103"].contains(thisObj.FORM_TYPE)) {
        //    var dataCertificateType = [
        //        ['1', ecount.resource.LBL05697],
        //        ['2', ecount.resource.LBL05698],
        //        ['3', ecount.resource.LBL05699],
        //        ['4', ecount.resource.LBL93131]
        //    ];
        //    var selectedVal = '4';
        //    switch (thisObj.FORM_TYPE) {
        //        case 'PF101':
        //            selectedVal = '1';
        //            break;
        //        case 'PF102':
        //            selectedVal = '2';
        //            break;
        //        case 'PF103':
        //            selectedVal = '3';
        //            break;
        //        default:
        //            break;
        //    }

        //    form.add(ctrl.define("widget.select", "certificateType", "certificateType", ecount.resource.LBL05691)
        //        .option(dataCertificateType).select(selectedVal).end());
        //}

        form.add(ctrl.define("widget.input.codeName", "titleNm", "TITLE_NM", ecount.resource.LBL01818)
                .filter("maxlength", { message: String.format(ecount.resource.MSG01140, "100"), max: 100 })
                .dataRules(['required'], ecount.resource.MSG01739).popover(ecount.resource.MSG01739).value("").end());

        var ctrlSelect = ctrl.define("widget.select", "formList", "formList", ecount.resource.LBL03160);
        if (option.length > 0) {
            ctrlSelect.option(option);
        } else {
            ctrlSelect.readOnly();
        }
        if (this.isSchedule == true && !$.isEmpty(this.FORM_SEQ) && !$.isEmpty(this.DISP_UNIT)) {
            ctrlSelect.select(this.DISP_UNIT + ecount.delimiter + this.FORM_SEQ + ecount.delimiter + this.SCH_DTLS_ROW_CNT);
        }
        form.add(ctrlSelect.end());

        var ctr = ctrl.define("widget.radio", "defaultType", "defaultType", ecount.resource.LBL06764);

        //개발결정사항:1581 - 예외케이스는 제거후 아래 설정값으로 처리
        if (thisObj.viewBag.InitDatas.formSet.BASIC_YN == "Y") //기본 사용 폼타입
        {
            //기본,기본양식아님
            ctr.label([ecount.resource.LBL00830, ecount.resource.LBL04932])
                .value(['0', 'N'])
                .select('0');
        }
        else if (thisObj.viewBag.InitDatas.formSet.DOMESTIC_YN == "Y") //내외자기본 사용 폼타입
        {
            //내자기본,외자기본,기본양식아님
            ctr.label([ecount.resource.LBL00923, ecount.resource.LBL01964, ecount.resource.LBL04932])
                .value(['0', '1', 'N'])
                .select('0');
        }
        if (this.FORM_TYPE != 'AO296')
            form.add(ctr.end());
        contents.add(form);
    },
    onChangeControl: function (event, data) {
        //if (event.cid == "certificateType") {
        //    var formListControl = this.contents.getControl("formList");
        //    var optionData = null;
        //    switch (this.contents.getControl("certificateType").getValue()) {
        //        case '1':
        //            optionData = this.getDataForFormList(this.TemplateList.PF101);
        //            if (optionData.length > 0) {
        //                optionData[0][2] = null; // remove text-danger
        //                this.FORM_TYPE = "PF101";
        //                formListControl.removeOption();
        //                formListControl.addOption(optionData);
        //            }
        //            break;
        //        case '2':
        //            optionData = this.getDataForFormList(this.TemplateList.PF102);
        //            if (optionData.length > 0) {
        //                optionData[0][2] = null; // remove text-danger
        //                this.FORM_TYPE = "PF102";
        //                formListControl.removeOption();
        //                formListControl.addOption(optionData);
        //            }
        //            break;
        //        case '3':
        //            optionData = this.getDataForFormList(this.TemplateList.PF103);
        //            if (optionData.length > 0) {
        //                optionData[0][2] = null; // remove text-danger
        //                this.FORM_TYPE = "PF103";
        //                formListControl.removeOption();
        //                formListControl.addOption(optionData);
        //            }
        //            break;
        //        case '4':
        //            optionData = this.getDataForFormList(this.TemplateList.PF100);
        //            if (optionData.length > 0) {
        //                optionData[0][2] = null; // remove text-danger
        //                this.FORM_TYPE = "PF100";
        //                formListControl.removeOption();
        //                formListControl.addOption(optionData);
        //            }
        //            break;
        //        default:
        //            break;
        //    }
        //}
    },
    // Footer Initialization
    onInitFooter: function (footer) {
        var tool = widget.generator.toolbar(),
             ctl = widget.generator.control();

        tool.addLeft(ctl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce());
        tool.addLeft(ctl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(tool);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        if (!e.unfocus) {
            this.contents.getControl("titleNm").setFocus(0);
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

    // Save button click event
    onFooterSave: function (e) {
        var thisObj = this;
        var errcnt = 0;
        //check validate 유효성 체크
        var invalid = this.contents.validate();
        var errcnt = invalid.merge().length;
        if (invalid.result.length > 0) {
            var invalidControl = invalid.result[0][0];
            invalidControl = ($.isArray(invalidControl)) ? invalidControl[0].control : invalidControl.control;
            if (!e.unfocus) invalidControl.setFocus(0);
        }
        if (thisObj.contents.getControl("formList").getValue() == "") {
            ecount.alert(ecount.resource.MSG04944);//모든 양식에 대해 조회권한이 없습니다.\n마스터에게 문의 바랍니다.
            //MSG05067 복사 가능한 양식이 없습니다.\n마스터에게 문의 바랍니다. TO-DO 메시지 문의해야함.
            errcnt++;
        }
        if (errcnt == 0) {
            thisObj.setShowProgressbar();
            var data = {
                FORM_TYPE: this.FORM_TYPE,
                FORM_SEQ: this.contents.getControl("formList").getValue(),
                ExtendedCondition: { IS_FROM_ZA_ONLY: this.contents.getControl("formList").getValue() == "99" ? true : false, BASIC_TYPE: "0" },
                DETAIL_BODY_FORM_TYPE: this.DETAIL_BODY_FORM_TYPE,
                TITLE_NM: this.contents.getControl("titleNm").getValue(),
                DEFAULT_TYPE: this.FORM_TYPE == 'AO296' ? 'N' : this.contents.getControl("defaultType").getValue(),
                MENU_TYPE: thisObj.MENU_TYPE,
                IsDetailPermit: thisObj.IsDetailPermit,
                FromProgramId: thisObj.FromProgramId
            }

            if (thisObj.isSchedule) {
                var form = this.contents.getControl("formList").getValue();
                thisObj.DISP_UNIT = form.split(ecount.delimiter)[0];
                data.FORM_SEQ = form.split(ecount.delimiter)[1];
                thisObj.SCH_DTLS_ROW_CNT = form.split(ecount.delimiter)[2];

                data.ExtendedCondition.DISP_UNIT = thisObj.DISP_UNIT;
                data.ExtendedCondition.IS_FROM_ZA_ONLY = data.FORM_SEQ == "99";
                data.ExtendedCondition.SCH_DTLS_ROW_CNT = thisObj.SCH_DTLS_ROW_CNT;

            }

            ecount.common.api({
                url: "/Common/Form/SaveFormTemplateForCopy",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                    } else {
                        if (thisObj.IsSubmitSelf == true) {
                            thisObj.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_02", { __ecPage__: null, FORM_TYPE: result.Data.FORM_TYPE, FORM_SEQ: result.Data.FORM_SEQ, DISP_UNIT: thisObj.DISP_UNIT, SCH_DTLS_ROW_CNT: thisObj.SCH_DTLS_ROW_CNT, MENU_TYPE: thisObj.MENU_TYPE, isSaveAfterClose: thisObj.isSaveAfterClose, FromProgramId: thisObj.FromProgramId }, null);
                        } else {
                            thisObj.setTimeout(function () {
                                var message = {
                                    FORM_TYPE: result.Data.FORM_TYPE,
                                    FORM_SEQ: result.Data.FORM_SEQ,
                                    DISP_UNIT: thisObj.DISP_UNIT,
                                    SCH_DTLS_ROW_CNT: thisObj.SCH_DTLS_ROW_CNT,
                                    callback: thisObj.close.bind(thisObj),
                                    IsDetailPermit: thisObj.IsDetailPermit,
                                    FromProgramId: thisObj.FromProgramId
                                };
                                thisObj.sendMessage(thisObj, message);
                            }, 0);
                        }
                    }
                },
                complete: function () {
                    thisObj.setHideProgressbar();
                }
            });
        } else {
            thisObj.footer.getControl('save').setAllowClick();
        }
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F2: function () {

    },

    ON_KEY_F8: function (e) {
        if (ecount.global.isDisableAlert())
            this.onFooterSave(e);
    },

    ON_KEY_TAB: function () {
    },

    ON_KEY_ENTER: function () {
    },

    onFocusOutHandler: function (event) {
        if (event.target == "contents") {
            this.footer.getControl('save').setFocus(0);
        }
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //show progress bar 진행바 보이기
    setShowProgressbar: function () {
        this.showProgressbar(true);
    },

    //hide progress bar 진행바 감추기
    setHideProgressbar: function () {
        this.hideProgressbar();
        this.footer.getControl('save').setAllowClick();
    },

    getDataForFormList: function (listData) {
        var thisObj = this;
        var option = new Array();
        thisObj.basicCollection = new Array();
        thisObj.collection = new Array();
        //개발결정사항:1581 - 예외로직 제거
        listData.forEach(function (item) {
            if (item.ORD == "0") {
                thisObj.collection.push(item);
            }
            else if (item.ORD == "1" && item.HEADCOL_CNT != 0) {
                //예외처리 로직 제거되어 AF080인 경우 HEADCOL_CNT가 전부 1로 셋팅되어 있어서 권한이 없는 양식도 추가될 수 있으니, 해당 개발시 주의.
                thisObj.basicCollection.push(item);
            }
        });

        //MENU_SEQ가 0이 아닌것은 권한설정 대상 양식
        if (thisObj.viewBag.InitDatas.formSet.MENU_SEQ != "0")
            thisObj.blAuthForm = true;

        //개발결정사항:1581 - 예외로직 제거
        //양식권한 설정이 가능하고 za기본양식이 있는 경우
        if (thisObj.blAuthForm && (thisObj.basicCollection.length > 0)) {
            option.push([99, "**" + ecount.resource.LBL03569 + "**", "text-danger"]);
        }
        else if (!thisObj.blAuthForm) {
            //각종증명서 케이스 양식권한설정은 아니지만, 양식 추가가 가능한 경우
            option.push([99, "**" + ecount.resource.LBL03569 + "**", "text-danger"]);
        }

        /*
        if (thisObj.blAuthForm && (thisObj.basicCollection.length > 0 || ["PO010", "PO210", "PO300", "AF040", "AF050", "AF060"].contains(thisObj.FORM_TYPE))) {
            //내자기본/외자기본이 있는 양식
            if (thisObj.FORM_TYPE == "SF010" || //영업관리 > 견적서 > 견적서입력
                thisObj.FORM_TYPE == "SF020" || //영업관리 > 주문서 > 주문서입력
                thisObj.FORM_TYPE == "SF030" || //영업관리 > 판매 > 판매입력
                thisObj.FORM_TYPE == "SF220" || //구매관리 > 발주요청 > 발주요청입력
                thisObj.FORM_TYPE == "SF200" || //구매관리 > 발주서 > 발주서입력
                thisObj.FORM_TYPE == "SF210")   //구매관리 > 구매 > 구매입력
                option.push([thisObj.basicCollection[0].FORM_SEQ, "**" + ecount.resource.LBL03569 + "**"]);
            else
                option.push([99, "**" + ecount.resource.LBL03569 + "**"]);

            //급여명세서는 제외
            if (["PO010","PO210","PO300","AF040","AF050","AF060"].contains(thisObj.FORM_TYPE))
                thisObj.formCount++;
        }
        else if (!thisObj.blAuthForm) {
            //각종증명서 케이스 양식권한설정은 아니지만, 양식 추가가 가능한 경우
            thisObj.formCount++;
            option.push([99, "**" + ecount.resource.LBL03569 + "**"]);
        }
        */
        for (var i = 0, len = thisObj.collection.length; i < len; i++) {
            var value = thisObj.collection[i].FORM_SEQ;
            if (thisObj.isSchedule) {
                value = (thisObj.collection[i].DISP_UNIT + ecount.delimiter + value + ecount.delimiter + thisObj.collection[i].SCH_DTLS_ROW_CNT)
            }
            option.push([value, thisObj.collection[i].TITLE_NM.length > 20 ? thisObj.collection[i].TITLE_NM.substr(0, 20) : thisObj.collection[i].TITLE_NM, null]);
        }
        return option;
    },

});
