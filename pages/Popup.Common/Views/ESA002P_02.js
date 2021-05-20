window.__define_resource && __define_resource("LBL02881","LBL01327","LBL03759","LBL09904","LBL09905","LBL09906","MSG05464","MSG01136","LBL09907","MSG05465","LBL00381","LBL03017","LBL01780","LBL02874","LBL02895","LBL02869","LBL04057","LBL01486","LBL06694","LBL14244","BTN00026","BTN00008","MSG06932","MSG06933","MSG02054","MSG00598","MSG05386","MSG03170","MSG00223","LBL04804","MSG09246","MSG09929","MSG01471","MSG06359","MSG10259","MSG06352","MSG06353","MSG06354","MSG06355","MSG06356","MSG06357","MSG06358","MSG00676","MSG02221","MSG00488","MSG00496");
/****************************************************************************************************
1. Create Date : 2015.06.09
2. Creator     : Choi Bok Seob
3. Description : 재고1 > 기초등록 > 품목등록 > 품목코드 내용 클릭 > 품목정보탭 > 품목코드 Fn 코드변경 클릭.
4. Precaution  : 
5. History     : 
        2015.09.03 (BSY) 코드 리펙토링.
        2016.03.28 (seongjun-Joe) 소스리팩토링.
        2019.03.20 (최용환) - 저장로직 3.0 으로 변경 Dev.20390 A19_00727 2기초등록 저장로직 3.0변경 - 코드변경
        2019.07.03 (김선모) - 회계 > 거래처 코드변경시 컨펌 리소스 변경, 인증서 첨부건 존재할때 알럿 리소스 변경 (A19_02961)
        2019.12.10 (Ngo Thanh Lam) - Fix Dev 33690 remove validate '-'
        2020.09.08 (taind) - A20_02935 - [콜백줄이기-33] 편집제한일자,설립일자,회계잔액기준월 등 한번에 변경가능하게
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA002P_02", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    off_key_esc: true,
    saveComplete: true,
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {


    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL02881);
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            ctrl = generator.control(),
             ctrlgroup = generator.control(),
              ctrlgroup2 = generator.control(),
                form1 = generator.form(),
                form2 = generator.form();

        //입력에서 필수 설정해야 함
        form1.template("register");
        form2.template("register");

        var lblDateFromTo = "";
        lblDateFromTo = this.viewBag.InitResultDto.CultureDateFrom + " ~ " + this.viewBag.InitResultDto.CultureDateTo;

        var requestsubTypeDes = this.buildTitle();

        if (['allodedugroup'].contains(this.viewBag.DefaultOption.RequestType)) {
            this.createForm1(form1, ctrl, function (form) {
                form.add(ctrl.define("widget.label", "lblCodeTitle", "lblCodeTitle", ecount.resource.LBL01327).label(requestsubTypeDes).end());
            });
        }
        else {
            if (this.viewBag.DefaultOption.RequestType != "menu") {
                form1.add(ctrl.define("widget.label", "lblCodeTitle", "lblCodeTitle", ecount.resource.LBL01327).label(requestsubTypeDes).end());
                form1.add(ctrl.define("widget.label", "lblDateFromTo", "lblDateFromTo", ecount.resource.LBL03759).label(lblDateFromTo).end());//기간
            }
        }

        if (['allodedugroup'].contains(this.viewBag.DefaultOption.RequestType)) {
            this.createForm2(form2, ctrl, function (form) {
                form.add(ctrl.define("widget.label", "lblCodeFrom", "lblCodeFrom", ecount.resource.LBL09904).label(this.viewBag.DefaultOption.Code).end()) //변경전 코드
                    .add(ctrl.define("widget.label", "lblCodeDesFrom", "lblCodeDesFrom", ecount.resource.LBL09905).label(this.viewBag.InitResultDto.CodeDes).end()); //변경전 코드명
            }.bind(this));
        }
        else {
            form2.add(ctrl.define("widget.label", "lblCodeFrom", "lblCodeFrom", ecount.resource.LBL09904).label(this.viewBag.DefaultOption.Code).end()) //변경전 코드
                .add(ctrl.define("widget.label", "lblCodeDesFrom", "lblCodeDesFrom", ecount.resource.LBL09905).label(this.viewBag.InitResultDto.CodeDes).end()); //변경전 코드명

            // 코드
            if (this.viewBag.DefaultOption.RequestSubType == "8")
                form2.add(ctrl.define("widget.input.codeType", "txtCodeTo", "txtCodeTo", ecount.resource.LBL09906).filter("maxbyte", { max: 5 }).popover(ecount.resource.MSG05464).end()); //변경후 코드
            else if (this.viewBag.DefaultOption.RequestSubType == "2") // 품목 Prod
                form2.add(ctrl.define("widget.input.codeType", "txtCodeTo", "txtCodeTo", ecount.resource.LBL09906).filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "10", "20"), max: 20 }).popover(ecount.resource.MSG05464).end()); //변경후 코드
            else
                form2.add(ctrl.define("widget.input.codeType", "txtCodeTo", "txtCodeTo", ecount.resource.LBL09906).filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 }).popover(ecount.resource.MSG05464).end()); //변경후 코드


            // 코드명
            if (this.viewBag.DefaultOption.RequestSubType == "2") // 품목 Prod
                form2.add(ctrl.define("widget.input.codeName", "txtCodeDesTo", "txtCodeDesTo", ecount.resource.LBL09907).value(this.viewBag.InitResultDto.CodeDes).maxLength(100).popover(ecount.resource.MSG05465).end()); //변경후 코드명
            else
                form2.add(ctrl.define("widget.input.codeName", "txtCodeDesTo", "txtCodeDesTo", ecount.resource.LBL09907).value(this.viewBag.InitResultDto.CodeDes).filter("maxlength", { max: 50 }).popover(ecount.resource.MSG05465).end()); //변경후 코드명

        }

        //폼추가
        contents
            .add(form1)
            .add(form2);
    },

    buildTitle: function () {
        var requestsubTypeDes = '';

        switch (this.viewBag.DefaultOption.RequestSubType) {
            case "1":
                requestsubTypeDes = ecount.resource.LBL00381;
                break;
            case "2":
                requestsubTypeDes = ecount.resource.LBL03017;
                break;
            case "3":
                requestsubTypeDes = ecount.resource.LBL01780 + ecount.resource.LBL02874;
                break;
            case "4":
                requestsubTypeDes = ecount.resource.LBL02895 + ecount.resource.LBL02874;
                break;
            case "5":
                requestsubTypeDes = ecount.resource.LBL02869 + ecount.resource.LBL02874;
                break;
            case "6":
                requestsubTypeDes = ecount.resource.LBL04057 + ecount.resource.LBL02874;
                break;
            case "7":
                requestsubTypeDes = ecount.resource.LBL01486;
                break;
            case "8":
                requestsubTypeDes = ecount.resource.LBL06694;
                break;
            default:
                requestsubTypeDes = ecount.resource.LBL00381;
                break;
        }

        switch (this.viewBag.DefaultOption.RequestType) {
            case "allodedugroup":
                requestsubTypeDes = ecount.resource.LBL14244;
                break;
        }

        return requestsubTypeDes;
    },

    createForm2: function (form2, ctrl, callback) {
        callback && callback(form2);

        switch (this.viewBag.DefaultOption.RequestType) {
            case "allodedugroup":
                form2.add(ctrl.define("widget.input.codeType", "txtCodeTo", "txtCodeTo", ecount.resource.LBL09906).filter("maxbyte", { max: 5 }).popover(ecount.resource.MSG05464).end()); //변경후 코드
                form2.add(ctrl.define("widget.input.codeName", "txtCodeDesTo", "txtCodeDesTo", ecount.resource.LBL09907).value(this.viewBag.InitResultDto.CodeDes).maxLength(50).popover(ecount.resource.MSG05465).end()); //변경후 코드명
                break;
            default:
                form2.add(ctrl.define("widget.input.codeType", "txtCodeTo", "txtCodeTo", ecount.resource.LBL09906).filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 }).popover(ecount.resource.MSG05464).end()); //변경후 코드
                form2.add(ctrl.define("widget.input.codeName", "txtCodeDesTo", "txtCodeDesTo", ecount.resource.LBL09907).value(this.viewBag.InitResultDto.CodeDes).filter("maxlength", { max: 50 }).popover(ecount.resource.MSG05465).end()); //변경후 코드명
                break;
        }
    },

    createForm1: function (form1, ctrl, callback) {
        callback && callback(form1);

        var lblDateFromTo = this.viewBag.InitResultDto.CultureDateFrom + " ~ " + this.viewBag.InitResultDto.CultureDateTo;
        switch (this.viewBag.DefaultOption.RequestType) {
            case "allodedugroup":
                break;
            default:
                form1.add(ctrl.define("widget.label", "lblDateFromTo", "lblDateFromTo", ecount.resource.LBL03759).label(lblDateFromTo).end());//기간
                break;
        }
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "modify").label(ecount.resource.BTN00026));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getControl("txtCodeTo").setFocus(0);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //신규버튼
    onFooterNew: function () {

    },

    //적용버튼
    onFooterModify: function (e) {
        //저장 중인 데이터가 있으면
        if (!this.saveComplete) {
            return false;
        }

        if (this.contents.validate().merge().length > 0) return;

        //컨트롤 선언
        var ctltxtCodeTo = this.contents.getControl("txtCodeTo");
        var ctltxtCodeDesTo = this.contents.getControl("txtCodeDesTo");
        var txtCodeToValue = ctltxtCodeTo.getValue();
        var txtCodeDesToValue = ctltxtCodeDesTo.getValue();
        var thisObj = this;

        //메시지 초기화
        ctltxtCodeTo.hideError("");

        //유효성 체크

        if (txtCodeToValue == "000") {
            ctltxtCodeTo.showError(ecount.resource.MSG06932);

            ctltxtCodeTo.setFocus(0);
            return false;
        }

        if (txtCodeToValue != "000" && this.Gye_Code == "1019") {
            ctltxtCodeTo.showError(ecount.resource.MSG06933);

            ctltxtCodeTo.setFocus(0);
            return false;
        }

        if (txtCodeToValue.indexOf(' ') >= 0) {
            ctltxtCodeTo.showError(String.format(ecount.resource.MSG02054, ecount.resource.LBL02874));
            ctltxtCodeTo.setFocus(0);
            return false;
        }
        if (txtCodeToValue == "") {
            ctltxtCodeTo.showError(ecount.resource.MSG00598);
            ctltxtCodeTo.setFocus(0);
            return false;
        }

        if (txtCodeDesToValue == "") {
            ctltxtCodeDesTo.showError(ecount.resource.MSG05386);
            ctltxtCodeDesTo.setFocus(0);
            return false;
        }

        if (thisObj.viewBag.DefaultOption.RequestType == "cust" && thisObj.viewBag.DefaultOption.RequestSubType == "4" && this.hasInvalidChar(txtCodeToValue) == true) { // 통장계좌등록 
            ctltxtCodeTo.showError(ecount.resource.MSG03170);
            ctltxtCodeTo.setFocus(0);
            return false;
        }

        var apiUrl = '/SVC/Account/Basic/UpdateChangeCode';
        var formData = {
            Request: {
                Data: {
                    RequestType: thisObj.viewBag.DefaultOption.RequestType,
                    CodeFrom: thisObj.viewBag.DefaultOption.Code,
                    CodeDesFrom: thisObj.viewBag.InitResultDto.CodeDes,
                    CodeTo: txtCodeToValue,
                    CodeDesTo: txtCodeDesToValue,
                    StartDate: thisObj.viewBag.InitResultDto.Date,
                    CheckPermissionRequest: this.CheckPermissionRequest,
                    VersionNo: thisObj.viewBag.DefaultOption.VersionNo
                }
            },
            fromPage: "Setup"
        }

        if (['allodedugroup'].contains(this.viewBag.DefaultOption.RequestType)) {
            apiUrl = '/SVC/Manage/Common/ChangeCode';
            formData = {
                Request: {
                    Data: {
                        OLD_KEY: {
                            ALLODEDU_GRP_CD: thisObj.viewBag.DefaultOption.Code,
                            SAL_TYPE_CD: thisObj.SAL_TYPE_CD
                        },
                        NEW_KEY: {
                            ALLODEDU_GRP_CD: txtCodeToValue,
                            SAL_TYPE_CD: thisObj.SAL_TYPE_CD
                        },
                        NEW_NAME: txtCodeDesToValue,
                        RequestType: thisObj.viewBag.DefaultOption.RequestType
                    },
                    CheckPermissionRequest: this.CheckPermissionRequest
                }
            };
        }

        ecount.confirm(ecount.resource.MSG00223, function (status) {
            if (status === true) {
                thisObj.saveComplete = false;
                ecount.common.api({
                    url: apiUrl,
                    data: Object.toJSON(formData),
                    progressbar: true,
                    success: function (result) {
                        if (result.Status != "200") {
                            runSuccessFunc = result.Status == "202";
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            runSuccessFunc = true;
                            //에러가 있으면 얼럿창 띄움(기획문의 확인)
                            if (result.Data.ErrFlag == "Y") {
                                //ecount.alert(String.format(ecount.resource.LBL04804, result.Data.CodeFrom, result.Data.CodeDesFrom, result.Data.CodeTo, result.Data.CodeDesTo));
                                //부모창에 값 던짐
                                thisObj.sendMessage(thisObj, {
                                    CodeTo: txtCodeToValue,
                                    CodeDesTo: txtCodeDesToValue
                                });
                                this.setTimeout(function () { thisObj.close(); }, 0);
                            }
                            else if (result.Data.ErrFlag == "X") {
                                thisObj.saveComplete = true;
                                ecount.alert(ecount.resource.MSG09246);
                            }
                            else if (result.Data.ErrFlag == "Z") {
                                ecount.alert(ecount.resource.MSG09929 + "<br/>" + txtCodeToValue);
                                thisObj.saveComplete = true;
                            }
                            else {
                                if (thisObj.viewBag.DefaultOption.RequestType == "cust") {
                                    var strMsg = "";
                                    if (result.Data.CustGubunT.indexOf('01') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG01471, thisObj.viewBag.InitResultDto.LimitDate) + "<br/><br/>";//편집제한일자 이전 전표
                                    }
                                    if (result.Data.CustGubunT.indexOf('02') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06359, thisObj.viewBag.InitResultDto.CultureDateFrom) + "<br/><br/>";//작년 1월1일 이전 전표
                                    }
                                    if (result.Data.CustGubunT.indexOf('03') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG10259) + "<br/><br/>";//재무재표별기초잔액입력
                                    }

                                    if (result.Data.CustGubunT.indexOf('11') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06352, txtCodeToValue, txtCodeDesToValue);//거래처
                                    }
                                    else if (result.Data.CustGubunT.indexOf('15') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06353, txtCodeToValue, txtCodeDesToValue);//카드사
                                    }
                                    else if (result.Data.CustGubunT.indexOf('14') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06354, txtCodeToValue, txtCodeDesToValue);//결재대행사
                                    }
                                    else if (result.Data.CustGubunT.indexOf('20') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06355, txtCodeToValue, txtCodeDesToValue);//신용카드
                                    }
                                    else if (result.Data.CustGubunT.indexOf('30') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06356, txtCodeToValue, txtCodeDesToValue);//계좌번호
                                    }
                                    else if (result.Data.CustGubunT.indexOf('90') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06357, txtCodeToValue, txtCodeDesToValue);//사원번호
                                    }
                                    else if (result.Data.CustGubunT.indexOf('99') >= 0) {
                                        strMsg += String.format(ecount.resource.MSG06358, txtCodeToValue, txtCodeDesToValue);//계정코드
                                    }
                                    ecount.alert(strMsg, {
                                        onBodyLinkClick: function (e) {
                                            if (e.currentTarget.id == 'fnBalanceStandardMonth') {
                                                thisObj.fnBalanceStandardMonth()
                                            }
                                        }.bind(thisObj)
                                    });
                                    //ecount.alert(ecount.resource.MSG00676);//이미 존재하는 코드 입니다.\n\n다른 코드를 입력 바랍니다.

                                    //ecount.alert(editLimitMsg + "<br/>" + String.format(ecount.resource.MSG02221, txtCodeToValue, txtCodeDesToValue) + "<br/>" + ecount.resource.MSG00488);
                                } else if (thisObj.viewBag.DefaultOption.RequestType == "menu") {
                                    ecount.alert(ecount.resource.MSG00676);
                                } else if (thisObj.viewBag.DefaultOption.RequestType == "allodedugroup") {
                                    ecount.alert(ecount.resource.MSG00676);
                                }
                                else {
                                    ecount.alert("<br/>" + String.format(ecount.resource.MSG01471, thisObj.viewBag.InitResultDto.CultureDateFrom) + "<br/>" + String.format(ecount.resource.MSG00496, txtCodeToValue, txtCodeDesToValue));
                                }

                                thisObj.saveComplete = true;
                            }
                            /*
                            //부모 페이지에서 받는 방법
                            onMessageHandler: function (page, param) {
                                if (page == "ESA002P_02") {
                                    ecount.alert("결과값:" + param.CodeTo + "," + param.CodeDesTo);
                                }
                            },
                            */
                        }
                    }.bind(this),
                    complete: function () {
                        thisObj.saveComplete = true;
                    }
                });
            }
        });
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    onFocusOutHandler: function () {
        var ctrl = this.footer.getControl("modify");
        ctrl && ctrl.setFocus(0);
    },

    hasInvalidChar: function (s) {
        return s.indexOf('-') >= 0;
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F2 신규
    ON_KEY_F2: function () {
    },

    //F8 적용
    ON_KEY_F8: function () {
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {
    },

    fnBalanceStandardMonth: function () {
        var param = {
            width: 550,
            height: 300,
        responseID: this.callbackID, //필수값
        };
        //모달로 띄우기
        this.openWindow({
            url: '/ECERP/EBA/EBA062P_14',

            popupType: true,//필수값
            responseID: this.callbackID, //필수값
            param: param,
            popupType: true
        });
    },
    onMessageHandler: function (page, param) {
        switch (page.pageID) {
            case "EBA062P_14":
            this.onAllSubmitSelf({
                url: "/ECERP/ESA/ESA002P_02",
            });
            break;
        }
    },
});

/*

############# 사용하는 방법 ############


		---------- 팝업창 띄우기--------------
    onFooterBtn19: function (e) {
        var param = {
            width: 550,
            height: 300,
            popupType: true,//필수값
            responseID: this.callbackID, //필수값
            Code: "22224",//변경할 코드
            RequestType: "cust",//cust:거래처등록,신용카드등록/통장계좌등록/카드사등록/결제대행사등록/사원(담당)등록,prod:품목코드등록,menu:메뉴권한그룹등록 
            RequestSubType: "7"//1:거래처등록,2:품목코드등록,3:신용카드등록,4:통장계좌등록,5:카드사등록,6:결제대행사등록,7:사원(담당)코드,메뉴권한그룹등록은 공백으로 설정
        };
        //모달로 띄우기
        ecount.popup.openWindow('/ECERP/Popup.Common/ESA002P_02', "코드 변경", param, false);
    },

		---------- 결과 받기--------------
        //부모 페이지에서 받는 방법
        onMessageHandler: function (page, param) {
            if (page == "ESA002P_02") {
                ecount.alert("결과값:" + param.CodeTo + "," + param.CodeDesTo);
            }
        },


*/