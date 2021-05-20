window.__define_resource && __define_resource("LBL10119","LBL09235","LBL04669","LBL04670","LBL04671","LBL04672","LBL04673","LBL04674","LBL04675","BTN00141","LBL05368","LBL12660","LBL03576","LBL10560","LBL03577","LBL10750","LBL05090","LBL05091","LBL01179","LBL03630","LBL05511","LBL04214","LBL09986","LBL07711","LBL07586","LBL09453","LBL10120","LBL09987","LBL01448","LBL03589","LBL09985","LBL09988","LBL09989","LBL09990","LBL09991","LBL09993","BTN00069","BTN00008","MSG05470","MSG05469","MSG05463","MSG05492");
/***********************************************************************************
 1. Create Date : 2016.03.21
 2. Creator     : inho
 3. Description : Paper Settings(용지설정)
 4. Precaution  :
 5. History     : 2017.07.04 (Hao) - Add Formtype SF240
                  2017.07.21 (Hao) - Add Formtype SF910, SF920
                  2017.07.27 (이슬기) - UI 변경
                  2018.12.10(dotrinh) add form_typ[e for SF560 ( adjustment print)
                  2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
 6. MenuPath    : Template Setup(양식설정)>Paper Settings(용지설정)
 7. Old File    : 
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_54", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/
    off_key_esc: true,

    formInfo: null,

    s_MARGIN_FORM_TYPE_1th: null, //인쇄위치(왼쪽여백: Pixel,  1건 : Pixel) 1장짜리

    s_MARGIN_FORM_TYPE_2th: null, //인쇄위치(왼쪽여백: Pixel,  1건 : Pixel,  절취선 :  Pixel,  2건 : Pixel) 2장짜리

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecmodule.common.formHelper");
    },

    render: function () {
        this._super.render.apply(this);
    },


    initProperties: function () {
        this.s_MARGIN_FORM_TYPE_1th = new Array();
        // 절취선, 2건 위치를 지원하지 않는 메뉴는 FORM_TYPE을 추가 하면 안됩니다.
        //구프레임워크 기준으로 해당내용 작성해야하며 신규 프레임워크인쇄에서 새로 추가시에 양식설정 화면도 같이 수정해야합니다.
        this.s_MARGIN_FORM_TYPE_2th = ["SF020", "SF030", "SF210", "SF400", "SF410", "SF420", "SF440", "SF500", "SF600", "SF610", "SF700", "SF743", "SF744", "SF770", "SF530", "SF200", "AF810", "SF780", "SF220", 'SF240', 'SF910', 'SF920', 'PF080', "AF811", "AF752", "SF560",];
        
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var message = {
            type: "getFormInfo",
            callback: function (data) {
                debugger;
                this.formInfo = data;
            }.bind(this)
        };
        this.sendMessage(this, message);
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL10119);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            ctrl2 = generator.control(),
            ctrl3 = generator.control(),
            ctrl4 = generator.control(),
            form = generator.form(),
            form2 = generator.form(),
            divContainer = generator.divContainer(); 

        var thisObj = this;

        //SF900 바코드인쇄인 경우 해당기능 구현전에 한번 정리하고 갈것.(승용책임확인-2016-07-14)
        var sizeTypeOption = null;
        if (thisObj.FORM_TYPE != "SF900") {
            sizeTypeOption = [
                ["20", "A4 (210 * 297)"], ["21", "A5 (148 * 210)"], ["22", "B5 (JIS) (182 * 257)"], ["23", "Letter (216 * 279)"], ["U", ecount.resource.LBL09235]
            ];
        } else {
            sizeTypeOption = [
                ["0000", ecount.resource.LBL04669], ["3114", ecount.resource.LBL04670], ["3112", ecount.resource.LBL04671], ["3100", ecount.resource.LBL04672]
                , ["3102", ecount.resource.LBL04673], ["3104", ecount.resource.LBL04674], ["Roll", ecount.resource.LBL04675]
            ];
        }
        if (thisObj.isRestoreDisplayFlag) {
            toolbar.attach(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").end());//.clickOnce().end());
        }

        contents.add(widget.generator.subTitle().title(ecount.resource.LBL05368));

        form2.template("register")
           .useBaseForm();

        //인쇄 방향
        //인쇄정렬(L:왼쪽, C:가운데, R:오른쪽)
        if (thisObj.isPrintWayDisplayFlag) {
            form2.add(ctrl.define("widget.radio", "printAlign", "PRINT_ALIGN", ecount.resource.LBL12660).label([
                    ecount.resource.LBL03576 //왼쪽  
                    , ecount.resource.LBL10560  //가운데
                    , ecount.resource.LBL03577 //오른쪽
            ]).value(["L", "C", "R"]).select(thisObj.formInfo.PageSetup.PRINT_ALIGN || "C").end());
        }

        //인쇄 형태
        if (thisObj.formInfo.FormSet.SHEET_YN == "Y") {
            var sheetYn = thisObj.formInfo.FormOutSet.SHEET_YN || "Y";
            var printTwice = thisObj.formInfo.FormOutSet.IS_PRINT_TWICE ? "Y" : "N";
            var isDetailBody = (((thisObj.formInfo.FormOutSet.DETAIL_BODY_YN || "N") == "Y") || (thisObj.formInfo.FormSet.QUANTITY_YN == "Y" && thisObj.formInfo.FormOutSet.VAT_FLAG == "0")) ? true : false;
            if (isDetailBody) {
                //상세품목 체크되어 있으면, 인쇄형태 체크해제
                sheetYn = "";
                printTwice = "";
            }
            //select는 배열로 넘기면 오류남. 주의
            
            var ctlCustom = ctrl.define("widget.custom", "customFor_PrintForm", "customFor_PrintForm", ecount.resource.LBL10750);
            ctlCustom.addControl(ctrl2.define("widget.checkbox", "sheetYn", "SHEET_YN", ecount.resource.LBL05090).label(ecount.resource.LBL05090)
                .value("N").select(sheetYn).readOnly(isDetailBody));
            ctlCustom.addControl(ctrl3.define("widget.checkbox", "isPrintTwice", "IS_PRINT_TWICE", ecount.resource.LBL05091).label(ecount.resource.LBL05091)
                .value("Y").select(printTwice).readOnly(isDetailBody));

            ctlCustom.columns(3, 9)
                     .noInlineDivider();      // [2016.10.27 bsy] 세로줄제거

            if (thisObj.s_MARGIN_FORM_TYPE_2th.contains(thisObj.FORM_TYPE))
                form2.add(ctlCustom.end());
        }


        if (!$.isNull(thisObj.formInfo.FormSet.VIEW_TYPE) && thisObj.formInfo.FormSet.VIEW_TYPE == "O") {
            //개발결정사항 : 1581 - 인쇄표시여부,페이지번호표시여부 예외처리, 개발리뷰 때 재확인 받음 나중에 예외 걷어낼 예정.
            if (["AO270", "AO271", "AO280", "AO281", "AO290", "AO291", "AO292", "AO293", "AO294", "AO295", "AO660"].contains(thisObj.FORM_TYPE)) {
                form2.add(ctrl.define("widget.radio", "isPageNo", "IS_PAGE_NO", ecount.resource.LBL01179).label([
                        ecount.resource.LBL03630
                        , ecount.resource.LBL05511
                ]).value(["Y", "N"]).select(((!$.isNull(thisObj.formInfo.FormOutSet.IS_PAGE_NO) && thisObj.formInfo.FormOutSet.IS_PAGE_NO == true) ? "Y" : "N")).end());

                form2.add(ctrl.define("widget.radio", "printDateYn", "PRINTDATE_YN", ecount.resource.LBL04214).label([
                        ecount.resource.LBL03630
                        , ecount.resource.LBL05511
                ]).value(["Y", "N"]).select(thisObj.formInfo.FormOutSet.PRINTDATE_YN).end());
            }
        }
        form2.add(ctrl.define("widget.radio", "printWay", "PRINT_WAY", ecount.resource.LBL09986).label([
                ecount.resource.LBL07711
                , ecount.resource.LBL07586
        ]).value(["P", "L"]).select(thisObj.formInfo.PageSetup.PRINT_WAY || "P").end());

        //절취선
        //TO-DO 보이고 안보이는 로직 처리 해야 함.  
        form2.add(ctrl.define("widget.input.general", "dotLineHeight", "DOTLINE_HEIGHT", ecount.resource.LBL09453)
            .numericOnly(4, 1, null)
            .value(thisObj.formInfo.FormOutSet.DOTLINE_HEIGHT).end());

        // 인쇄위치(왼쪽여백: Pixel,  1건 : Pixel,  절취선 :  Pixel,  2건 : Pixel)  해당코드가 아니면 인쇄위치를 감춘다.
        if (!thisObj.s_MARGIN_FORM_TYPE_1th.contains(thisObj.FORM_TYPE) && !thisObj.s_MARGIN_FORM_TYPE_2th.contains(thisObj.FORM_TYPE) && thisObj.FORM_TYPE != "SF780") {
            form2.hideRow([form2.getRowCount() - 1]);
        }

        //2건 위치
        form2.add(ctrl.define("widget.input.general", "tMarginTwo", "T_MARGIN_TWO", ecount.resource.LBL10120)
            .numericOnly(4, 1, null)
            .value(thisObj.formInfo.FormOutSet.T_MARGIN_TWO).end());

        // 인쇄위치(왼쪽여백: Pixel,  1건 : Pixel,  절취선 :  Pixel,  2건 : Pixel)  해당코드가 아니면 인쇄위치를 감춘다.
        if (!thisObj.s_MARGIN_FORM_TYPE_1th.contains(thisObj.FORM_TYPE) && !thisObj.s_MARGIN_FORM_TYPE_2th.contains(thisObj.FORM_TYPE)) {
            form2.hideRow([form2.getRowCount() - 1]);
        }
        // 인쇄위치(왼쪽여백: Pixel,  1건 : Pixel) 1건 양식이면 일부 양식을 감춘다.
        if (thisObj.s_MARGIN_FORM_TYPE_1th.contains(thisObj.FORM_TYPE)) {
            form2.hideRow([form2.getRowCount() - 1]);
        }

        //축소 사용
        if (!thisObj.isReduceYnDisplayFalse) {
            form2.add(ctrl.define("widget.radio", "reduceYn", "REDUCE_YN", ecount.resource.LBL09987).label([
                ecount.resource.LBL01448
                    , ecount.resource.LBL03589
            ]).value(["Y", "N"]).select(thisObj.formInfo.PageSetup.REDUCE_YN || "N").end());
        }

        divContainer.add(form2);
        divContainer.css("wrapper-toolbar");
        contents.add(divContainer);

        contents.add(widget.generator.subTitle().title(ecount.resource.LBL10119))
                .add(toolbar);

        form.template("register")
            .useBaseForm()
            .add(ctrl.define("widget.select", "sizeType", "SIZE_TYPE", ecount.resource.LBL09985)
                .option(sizeTypeOption).select(thisObj.formInfo.PageSetup.SIZE_TYPE).end());

        form.add(ctrl.define("widget.input.general", "tMargin", "T_MARGIN", ecount.resource.LBL09988)
            .numericOnly(3, 1, null)
            .value(thisObj.formInfo.PageSetup.T_MARGIN).end())
        .add(ctrl.define("widget.input.general", "bMargin", "B_MARGIN", ecount.resource.LBL09989)
            .numericOnly(3, 1, null)
            .value(thisObj.formInfo.PageSetup.B_MARGIN).end())
        .add(ctrl.define("widget.input.general", "lMargin", "L_MARGIN", ecount.resource.LBL09990)
            .numericOnly(3, 1, null)
            .value(thisObj.formInfo.PageSetup.L_MARGIN).end())
        .add(ctrl.define("widget.input.general", "rMargin", "R_MARGIN", ecount.resource.LBL09991)
            .numericOnly(3, 1, null)
            .value(thisObj.formInfo.PageSetup.R_MARGIN).end());        

        var ctlCustom = ctrl.define("widget.custom", "customStandard", "customStandard", ecount.resource.LBL09993);
        ctlCustom.addControl(ctrl2.define("widget.input.general", "height", "HEIGHT", "")
                .numericOnly(4, 1, null)
                .value(thisObj.formInfo.PageSetup.HEIGHT));
        ctlCustom.addControl(ctrl3.define("widget.label", "standardLabel", "standardLabel").label("/"));
        ctlCustom.addControl(ctrl4.define("widget.input.general", "width", "WIDTH", "")
                .numericOnly(4, 1, null)
                .value(thisObj.formInfo.PageSetup.WIDTH))
                .inline();
        //.columns(6, 6)
        //.noInlineDivider();

        form.add(ctlCustom.end());
        if (thisObj.formInfo.PageSetup.SIZE_TYPE != "U")
            form.hideRow([form.getRowCount() - 1]);

        contents.add(form);

    },

    onChangeControl: function (control) {
        var thisObj = this;
        //if you use widget within custom widget,you can't get it directly, so, we use control.__self 
        //커스텀안에 위젯이벤트일때 직접 접근이 안되기 때문에 control.__self로 인스턴스를 직접 받음(휘영책임 확인 2016.01.08)
        var selfControl = control.__self;
        if (["restore", "sizeType"].contains(selfControl.id)) {
            if (["U", "Roll"].contains(thisObj.contents.getControl("sizeType").getValue())) {
                ecmodule.common.formHelper.setShowControls(this, [thisObj.contents.getControl("customStandard")]);
            } else {
                ecmodule.common.formHelper.setHideControls(this, [thisObj.contents.getControl("customStandard")]);
            }
        }
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


        var self = this;

        //2건 페이지 control
        var printForm = this.contents.getControl("customFor_PrintForm");
        //인쇄방향 control
        var printWay = this.contents.getControl("printWay");
        
        var printAlign = this.contents.getControl("printAlign");

       
        if (printForm == undefined) {

            if (self.isPrintWayDisplayFlag) {
                printAlign.setFocus(0);
            }else{
                printWay.setFocus(0);
            }
            
        } else {
        
            if (printForm._readOnly) {
                printWay.setFocus(0);
            } else {
                printForm.setFocus(0);
            }
        }
 
    },

    //show progress bar 진행바 보이기
    setShowProgressbar: function () {
        this.showProgressbar(true);
    },

    //hide progress bar 진행바 감추기
    setHideProgressbar: function () {
        this.hideProgressbar();
        this.footer.getControl('apply').setAllowClick();
        if (this.contents.getControl("restore") != null)
            this.contents.getControl("restore").setAllowClick();
    },


    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/

    onContentsRestore: function (event) {
        var thisObj = this;
        var message = {
            type: "getRestoreFormInfo",
            restoreType: "pageSetup",
            callback: function (data) {
                if (thisObj.formInfo.FormSet.SHEET_YN == "Y") {
                    
                    if (thisObj.s_MARGIN_FORM_TYPE_2th.contains(thisObj.FORM_TYPE)) {
                    var customForPrintForm = thisObj.contents.getControl("customFor_PrintForm");
                    if (thisObj.formInfo.FormOutSet.DETAIL_BODY_YN == "Y" || (thisObj.formInfo.FormSet.QUANTITY_YN == "Y" && thisObj.formInfo.FormOutSet.VAT_FLAG == "0")) {
                        customForPrintForm.get("sheetYn").setValue(false);
                        customForPrintForm.get("sheetYn").readOnly(true);
                        customForPrintForm.get("isPrintTwice").setValue(data.FormOutSet.IS_PRINT_TWICE);
                        customForPrintForm.get("isPrintTwice").readOnly(true);
                    } else {
                        customForPrintForm.get("sheetYn").readOnly(false);
                        customForPrintForm.get("sheetYn").setValue((((data.FormOutSet.SHEET_YN || "Y") == "N") ? true : false));
                        customForPrintForm.get("isPrintTwice").setValue(data.FormOutSet.IS_PRINT_TWICE);
                        customForPrintForm.get("isPrintTwice").readOnly(false);
                    }
                }
                }
                thisObj.contents.getControl("sizeType").setValue(data.PageSetup.SIZE_TYPE || "");
                thisObj.onChangeControl({ cid: "restore", __self: thisObj.contents.getControl("restore") });
                thisObj.contents.getControl("customStandard").get("height").setValue(data.PageSetup.HEIGHT);
                thisObj.contents.getControl("customStandard").get("width").setValue(data.PageSetup.WIDTH);
                if (thisObj.isPrintWayDisplayFlag) { thisObj.contents.getControl("printAlign").setValue(data.PageSetup.PRINT_ALIGN); }
                thisObj.contents.getControl("printWay").setValue(data.PageSetup.PRINT_WAY);
                thisObj.contents.getControl("tMargin").setValue(data.PageSetup.T_MARGIN);
                thisObj.contents.getControl("bMargin").setValue(data.PageSetup.B_MARGIN);
                thisObj.contents.getControl("lMargin").setValue(data.PageSetup.L_MARGIN);
                thisObj.contents.getControl("rMargin").setValue(data.PageSetup.R_MARGIN);
                thisObj.contents.getControl("dotLineHeight").setValue(data.FormOutSet.DOTLINE_HEIGHT);
                thisObj.contents.getControl("tMarginTwo").setValue(data.FormOutSet.T_MARGIN_TWO);
                if (!thisObj.isReduceYnDisplayFalse) {
                thisObj.contents.getControl("reduceYn").setValue(data.PageSetup.REDUCE_YN);
                }
                if (!$.isNull(thisObj.formInfo.FormSet.VIEW_TYPE) && thisObj.formInfo.FormSet.VIEW_TYPE == "O") {
                    //개발결정사항 : 1581 - 인쇄표시여부,페이지번호표시여부 예외처리, 개발리뷰 때 재확인 받음 나중에 예외 걷어낼 예정.
                    if (["AO270", "AO271", "AO280", "AO281", "AO290", "AO291", "AO292", "AO293", "AO294", "AO295", "AO660"].contains(thisObj.FORM_TYPE)) {
                        thisObj.contents.getControl("isPageNo").setValue(((!$.isNull(data.FormOutSet.IS_PAGE_NO) && data.FormOutSet.IS_PAGE_NO == true) ? "Y" : "N"));
                        thisObj.contents.getControl("printDateYn").setValue(data.FormOutSet.PRINTDATE_YN);
                    }
                }

            }.bind(this)
        };
        this.sendMessage(this, message);
    },

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
        if (thisObj.formInfo.FormSet.SHEET_YN == "Y") {
            if (thisObj.s_MARGIN_FORM_TYPE_2th.contains(thisObj.FORM_TYPE)) {
            thisObj.formInfo.FormOutSet.SHEET_YN = (thisObj.contents.getControl("customFor_PrintForm").get("sheetYn").getValue()) ? "N" : "Y";
            thisObj.formInfo.FormOutSet.IS_PRINT_TWICE = thisObj.contents.getControl("customFor_PrintForm").get("isPrintTwice").getValue();
        }
        }
        thisObj.formInfo.PageSetup.SIZE_TYPE = thisObj.contents.getControl("sizeType").getValue();
        thisObj.formInfo.PageSetup.HEIGHT = thisObj.contents.getControl("customStandard").get("height").getValue() || 0;
        thisObj.formInfo.PageSetup.WIDTH = thisObj.contents.getControl("customStandard").get("width").getValue() || 0;
        if (thisObj.isPrintWayDisplayFlag) { thisObj.formInfo.PageSetup.PRINT_ALIGN = thisObj.contents.getControl("printAlign").getValue(); }
        thisObj.formInfo.PageSetup.PRINT_WAY = thisObj.contents.getControl("printWay").getValue();

        thisObj.formInfo.PageSetup.T_MARGIN = thisObj.contents.getControl("tMargin").getValue() || 0;
        thisObj.formInfo.PageSetup.B_MARGIN = thisObj.contents.getControl("bMargin").getValue() || 0;
        thisObj.formInfo.PageSetup.L_MARGIN = thisObj.contents.getControl("lMargin").getValue() || 0;
        thisObj.formInfo.PageSetup.R_MARGIN = thisObj.contents.getControl("rMargin").getValue() || 0;

        //저장 분기 있음. 확인 필요 TO-DO
        thisObj.formInfo.FormOutSet.DOTLINE_HEIGHT = thisObj.contents.getControl("dotLineHeight").getValue() || 0;
        thisObj.formInfo.FormOutSet.T_MARGIN_TWO = thisObj.contents.getControl("tMarginTwo").getValue() || 0;
        if (!thisObj.isReduceYnDisplayFalse) {
        thisObj.formInfo.PageSetup.REDUCE_YN = thisObj.contents.getControl("reduceYn").getValue();
        }

        if (!$.isNull(thisObj.formInfo.FormSet.VIEW_TYPE) && thisObj.formInfo.FormSet.VIEW_TYPE == "O") {
            //개발결정사항 : 1581 - 인쇄표시여부,페이지번호표시여부 예외처리, 개발리뷰 때 재확인 받음 나중에 예외 걷어낼 예정.
            if (["AO270", "AO271", "AO280", "AO281", "AO290", "AO291", "AO292", "AO293", "AO294", "AO295", "AO660"].contains(thisObj.FORM_TYPE)) {
                thisObj.formInfo.FormOutSet.IS_PAGE_NO = ((thisObj.contents.getControl("isPageNo").getValue() == "Y")?true:false);
                thisObj.formInfo.FormOutSet.PRINTDATE_YN = thisObj.contents.getControl("printDateYn").getValue();
            }
        }

        switch (thisObj.contents.getControl("sizeType").getValue()) {
            case "20"://A$선택시
                // 상단, 하단 여백의 합이 용지 높이보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.T_MARGIN) + parseInt(thisObj.formInfo.PageSetup.B_MARGIN)) >= 297) {
                    thisObj.contents.getControl("tMargin").showError(ecount.resource.MSG05470);
                    thisObj.contents.getControl("tMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 왼쪽, 오른쪽 여백의 합이 용지 너비보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.L_MARGIN) + parseInt(thisObj.formInfo.PageSetup.R_MARGIN)) >= 210) {
                    thisObj.contents.getControl("lMargin").showError(ecount.resource.MSG05469);
                    thisObj.contents.getControl("lMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                thisObj.formInfo.PageSetup.WIDTH = 210;
                thisObj.formInfo.PageSetup.HEIGHT = 297;
                break;
                // A5 선택 시
            case "21" :
                // 상단, 하단 여백의 합이 용지 높이보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.T_MARGIN) + parseInt(thisObj.formInfo.PageSetup.B_MARGIN)) >= 210) {
                    thisObj.contents.getControl("tMargin").showError(ecount.resource.MSG05470);
                    thisObj.contents.getControl("tMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 왼쪽, 오른쪽 여백의 합이 용지 너비보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.L_MARGIN) + parseInt(thisObj.formInfo.PageSetup.R_MARGIN)) >= 148) {
                    thisObj.contents.getControl("lMargin").showError(ecount.resource.MSG05469);
                    thisObj.contents.getControl("lMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                thisObj.formInfo.PageSetup.WIDTH = 148;
                thisObj.formInfo.PageSetup.HEIGHT = 210;
                break;
                // B5 선택 시
            case "22" :
                // 상단, 하단 여백의 합이 용지 높이보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.T_MARGIN) + parseInt(thisObj.formInfo.PageSetup.B_MARGIN)) >= 257) {
                    thisObj.contents.getControl("tMargin").showError(ecount.resource.MSG05470);
                    thisObj.contents.getControl("tMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 왼쪽, 오른쪽 여백의 합이 용지 너비보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.L_MARGIN) + parseInt(thisObj.formInfo.PageSetup.R_MARGIN)) >= 182) {
                    thisObj.contents.getControl("lMargin").showError(ecount.resource.MSG05469);
                    thisObj.contents.getControl("lMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                thisObj.formInfo.PageSetup.WIDTH = 182;
                thisObj.formInfo.PageSetup.HEIGHT = 257;
                break;
                // Letter 선택 시
            case "23" :
                // 상단, 하단 여백의 합이 용지 높이보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.T_MARGIN) + parseInt(thisObj.formInfo.PageSetup.B_MARGIN)) >= 279) {
                    thisObj.contents.getControl("tMargin").showError(ecount.resource.MSG05470);
                    thisObj.contents.getControl("tMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 왼쪽, 오른쪽 여백의 합이 용지 너비보다 작은지 확인
                if ((parseInt(thisObj.formInfo.PageSetup.L_MARGIN) + parseInt(thisObj.formInfo.PageSetup.R_MARGIN)) >= 216) {
                    thisObj.contents.getControl("lMargin").showError(ecount.resource.MSG05469);
                    thisObj.contents.getControl("lMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                thisObj.formInfo.PageSetup.WIDTH = 216;
                thisObj.formInfo.PageSetup.HEIGHT = 279;
                break;
                // 직접 선택 시 
            case "U":
                // 높이 입력 확인
                if (parseInt(thisObj.formInfo.PageSetup.HEIGHT) == 0) {
                    thisObj.contents.getControl("customStandard").get("height").showError(ecount.resource.MSG05463);
                    thisObj.contents.getControl("customStandard").get("height").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 너비 입력 확인
                if (parseInt(thisObj.formInfo.PageSetup.WIDTH) == 0) {
                    thisObj.contents.getControl("customStandard").get("width").showError(ecount.resource.MSG05463);
                    thisObj.contents.getControl("customStandard").get("width").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 규격에서 세로 길이보다 가로 길이가 더 작은지 확인
                if (parseInt(thisObj.formInfo.PageSetup.WIDTH) > parseInt(thisObj.formInfo.PageSetup.HEIGHT)) {
                    thisObj.contents.getControl("customStandard").get("width").showError(ecount.resource.MSG05492);
                    thisObj.contents.getControl("customStandard").get("width").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 상단, 하단 여백의 합이 용지 높이보다 작은지 확인
                if (parseInt(thisObj.formInfo.PageSetup.T_MARGIN) + parseInt(thisObj.formInfo.PageSetup.B_MARGIN) >= parseInt(thisObj.formInfo.PageSetup.HEIGHT)) {
                    thisObj.contents.getControl("tMargin").showError(ecount.resource.MSG05470);
                    thisObj.contents.getControl("tMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }
                // 왼쪽, 오른쪽 여백의 합이 용지 너비보다 작은지 확인
                if (parseInt(thisObj.formInfo.PageSetup.L_MARGIN) + parseInt(thisObj.formInfo.PageSetup.R_MARGIN) >= parseInt(thisObj.formInfo.PageSetup.WIDTH)) {
                    thisObj.contents.getControl("lMargin").showError(ecount.resource.MSG05469);
                    thisObj.contents.getControl("lMargin").setFocus(0);
                    thisObj.footer.getControl('apply').setAllowClick();
                    return false;
                }                    
                break;
        }
        var message = {
            formInfo: thisObj.formInfo,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
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


});
