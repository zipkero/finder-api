window.__define_resource && __define_resource("LBL05117","LBL03726","LBL01457","LBL00985","LBL02716","LBL02820","LBL02247","LBL03028","LBL01380","LBL35193","MSG07979","MSG04135","LBL03170","LBL00926","LBL00785","LBL04452","LBL02042","LBL02159","LBL03175","LBL00141","LBL07516","LBL17602","MSG05329","LBL02176","BTN00069","BTN00070","BTN00008","MSG04165");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 노지혜
3. Description : 자동채번생성팝업, 자동코드생성팝업 (Auto Code)
4. Precaution  : 팝업띄울시 데이터 주의
                ex) autoNumberSettings: encodeURIComponent(Object.toJSON(
                            [{ CODE_TYPE: "42", IO_DATE: "20150324" },
                            { CODE_TYPE: "43", IO_DATE: "20150324" }]
                        );
5. History     : [2015-09-04] 강성훈 : 코드 리펙토링
                 [2016-03-22] Tran Quoc Hung: add saveType="I" for call popup to get hidRcd
                 [2016-03-28] seongjun-Joe : 소스리팩토링.
                 [2016.09.07 bsy] reverse가 실행이 되어 다중일때 값이 변경되어 처리
                 [2016.1026]  Hoi - Modified:  Apply -> Apply (F8)
                 [2016.11.09] Pham Van Phu add new property hiddent field Year(slip), Year(ToDay), Month(slip), 
                 Month(ToDay), Day(slip), Day(ToDay) in Action and js
                 [2017.01.10] LAP: Processing for codeType is 12, 13 (add isAutoApply, controlId)
                 [2017.02.15] LAP: Processing for codeType is 10, 11 (add isAutoApply, controlId)
                 [2018.03.02] Huu Lan: Add IO_DATE: self.autoNumberSettings[0].IO_DATE and controlID at reload method
                                       Add hidRcd4, hidRcd5, hidRcd6 at Apply method
                 [2019.01.03] Ngọc Hân A18_04272 - FE 리팩토링_페이지 일괄작업 (Remove $el at function onFocusOutHandler)
                 [2019.08.22] 이현택 : WMS 일련번호 생성 분기처리
                 [2020.06.22] (Kim Min Joon) - A18_03219_전표 기초 채번규칙 정리하기
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM102P", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    numDigitLen: "", //일련번호 자릿수
    codeType: null,    //생성기준 구분코드
    slipIodate: "", //현재 전표일자
    autoCodeInfo: null, //코드생성정보
    initFocusControlId: "",  //포커스주기위한 용도
    firstControlId: "", //첫번째 콘트롤의id
    isAutoApply: false,  //Auto Apply Flag
    controlId: "",  //Control ID

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.codeType = [];
        this.autoNumberSettings = $.parseJSON(decodeURIComponent(this.autoNumberSettings));
        //this.autoCodeCodeTypeValue = $.parseJSON(decodeURIComponent(this.autoCodeCodeTypeValue));
        var infoData = this.viewBag.InitDatas;
        this.autoCodeInfo = infoData.autoCodeItems;
        this.__needChangeTitle = false; //팝업name과 타이틀명을 다르게 설정하기 위한 플래그값
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
        if (this.autoNumberSettings[0].CODE_TYPE <= 16 && !this.isMultiFlag)
            header.setTitle(ecount.resource.LBL05117);  //코드생성
        else
            header.setTitle(ecount.resource.LBL03726);  //번호생성

        var option = [];

        option.push({ id: "SelfCustomizing", label: ecount.resource.LBL01457 });
        if (!$.isEmpty(this.programID)) {
            header.add('option', option, false);
        }
    },

    // 사용방법설정 Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: ecount.infra.getPageWidthFromConfig(true)
            , height: 400
            , PRG_ID: this.programID
        };
        this.openWindow({
            url: '/ECERP/ESC/ESC002M',
            name: ecount.resource.LBL01457,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
        });
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar,
            ctrl = generator.control(),
            result,
            menuname,
            res = ecount.resource,
            readonlyFlag;

        var strCritType,
            strItemLen,
            strItemValue,
            strItemTitle,
            itemName,
            controlType = "",
            _control,
            selectBoxOptions = [],
            nowDate = new Date(this.viewBag.LocalTime.left(10).toDate());//현재날짜

        if (!$.isEmpty(ecount.config.companyForm.IN_GROUP_CD) && ["00003", "00004"].contains(ecount.config.companyForm.IN_GROUP_CD)) {
            nowDate = nowDate.addYears(543);
        }

        // 창고 등 설정된 값을 가져온다.
        var getTrxValue = function (Trx, strCritType, index) {
            return (Trx.head(function (trx) {
                return trx.Key.CRIT_TYPE == strCritType && trx.Key.DTLS_CLAS_CD == this.autoNumberSettings[index][ecount.constValue.autoCodeType[strCritType].trxKey];
            }.bind(this)) || { SETUP_VAL: "" }).SETUP_VAL;
        };

        // 담당자 등 리소스
        var getItemTitle = function (strCritType) {
            var titlte = {
                "F": "LBL00985",		// 담당자
                "G": "LBL02716",		// 창고
                "H": "LBL02820",		// 출고창고
                "I": "LBL02247",		// 입고창고
                "J": "LBL03028",		// 프로젝트
                "K": "LBL01380",		// 부서
                "L": "LBL35193",		// 품목구분
                "N": "MSG07979"			// 창고유형구분
            };
            return res[titlte[strCritType]];
        };

        //Processing for CODE_TYPE 13, 12, 11, 10
        var self = this;

        if (!$.isEmpty(this.autoNumberSettings[0].CHECK_NO)
            && (this.autoNumberSettings[0].CODE_TYPE == 13 || this.autoNumberSettings[0].CODE_TYPE == 12
                || this.autoNumberSettings[0].CODE_TYPE == 11 || this.autoNumberSettings[0].CODE_TYPE == 10)) {
            var checkNo = this.autoNumberSettings[0].CHECK_NO;

            for (var iRow = 0; iRow < this.autoCodeInfo.length; iRow++) {
                result = this.autoCodeInfo[iRow];
                for (var i = 0; i < result.Sub.length; i++) {
                    strCritType = result.Sub[i].Key.CRIT_TYPE;
                    strItemLen = result.Sub[i].CD_LEN;
                    strItemValue = result.Sub[i].CD_STR;

                    if (strCritType == "R" && strItemValue == "") {
                        if (checkNo.length == strItemLen) {
                            this.isAutoApply = true;
                            this.controlId = String.format("{0}_{1}_{2}", strCritType, iRow, i);
                            break;
                        } else {
                            ecount.alert(String.format(res.MSG04135, strItemLen + ""), function () {
                                self.contents.getControl(self.initFocusControlId).setFocus(0);
                            });
                            break;
                        }
                    }
                }
            }
        }
        //End Processing for CODE_TYPE 13, 12, 11, 10


        for (var iRow = 0; iRow < this.autoCodeInfo.length; iRow++) {
            result = this.autoCodeInfo[iRow];

            this.slipIodate = this.autoNumberSettings[iRow].IO_DATE ? this.autoNumberSettings[iRow].IO_DATE : "";
            this.codeType[iRow] = this.autoNumberSettings[iRow].CODE_TYPE;

            if (this.isMultiFlag && result.MenuName) {
                menuname = result.MenuName.ITEM10;
                // Test Progress 87907 수정
                toolbar = generator.toolbar();
                toolbar.addLeft(ctrl.define("widget.label").label("<div class=\"wrapper-remark \">" + menuname + "</div>"));
                contents.add(toolbar);
            }
            form1 = generator.form();
            form1.setVertical();

            for (var i = 0; i < result.Sub.length; i++) {
                readonlyFlag = false;
                strCritType = result.Sub[i].Key.CRIT_TYPE;
                strItemLen = result.Sub[i].CD_LEN;
                strItemValue = result.Sub[i].CD_STR;
                itemName = String.format("{0}_{1}_{2}", strCritType, iRow, i);

                switch (strCritType) {
                    case "R":   //반복코드
                        strItemTitle = res.LBL03170;
                        break;
                    case "Y":   //년(금일)
                        strItemTitle = res.LBL00926 + "(" + res.LBL00785 + ")";
                        strItemValue = nowDate.getFullYear();

                        if (strItemLen == 2) {
                            strItemValue = strItemValue.toString().substring(2, 4);
                        }
                        if (this.isDisableYearToday) {
                            readonlyFlag = true;
                            strItemValue = "*".padLeft(strItemLen, "*");
                        }
                        break;
                    case "E":   //년(전표)
                        strItemTitle = res.LBL00926 + "(" + res.LBL04452 + ")";
                        if (this.slipIodate.length > 4) {
                            strItemValue = this.slipIodate.substring(0, 4);
                            if (strItemLen == 2)
                                strItemValue = strItemValue.toString().substring(2, 4);
                        }
                        if (this.saveType == "L") {
                            strItemValue = "";
                            readonlyFlag = true;
                        }
                        if (this.isDisableYearSlip) {
                            readonlyFlag = true;
                            strItemValue = "*".padLeft(strItemLen, "*");
                        }
                        break;
                    case "M":   //월(금일)
                        strItemTitle = res.LBL02042 + "(" + res.LBL00785 + ")";
                        if ($.isEmpty(strItemValue)) {
                            strItemValue = nowDate.getMonth() + 1;
                            if (strItemValue < 10)
                                strItemValue = "0" + strItemValue;
                        }
                        if (this.isDisableMonthToday) {
                            strItemValue = "*".padLeft(strItemLen, "*");
                            readonlyFlag = true;
                        }
                        break;
                    case "O":   //월(전표)
                        strItemTitle = res.LBL02042 + "(" + res.LBL04452 + ")";
                        if (this.slipIodate.length > 6)
                            strItemValue = this.slipIodate.substring(4, 6);

                        if (this.saveType == "L") {
                            strItemValue = "";
                            readonlyFlag = true;
                        }
                        if (this.isDisableMonthSlip) {
                            strItemValue = "*".padLeft(strItemLen, "*");
                            readonlyFlag = true;
                        }

                        break;
                    case "D":   //일(금일)
                        strItemTitle = res.LBL02159 + "(" + res.LBL00785 + ")";
                        if ($.isEmpty(strItemValue)) {
                            strItemValue = nowDate.getDate();
                            if (strItemValue < 10)
                                strItemValue = "0" + strItemValue;
                        }
                        if (this.isDisableDayToday) {
                            strItemValue = "*".padLeft(strItemLen, "*");
                            readonlyFlag = true;
                        }
                        break;
                    case "A":   //일(전표)
                        strItemTitle = res.LBL02159 + "(" + res.LBL04452 + ")";
                        if (this.slipIodate.length == 8)
                            strItemValue = this.slipIodate.substring(6, 8);
                        if (this.saveType == "L") {
                            strItemValue = "";
                            readonlyFlag = true;
                        }
                        if (this.isDisableDaySlip) {
                            strItemValue = "*".padLeft(strItemLen, "*");
                            readonlyFlag = true;
                        }
                        break;
                    case "1":   //구분1
                        strItemTitle = String.format(res.LBL03175, "1");
                        readonlyFlag = true;
                        break;
                    case "2":   //구분2
                        strItemTitle = String.format(res.LBL03175, "2");
                        readonlyFlag = true;
                        break;
                    case "3":   //구분3
                        strItemTitle = String.format(res.LBL03175, "3");
                        readonlyFlag = true;
                        break;
                    case "T":   //거래유형별 코드
                    case "B":   //계정코드 - 계정종류
                    case "C":   //계정코드 - 수입지출구분
                        strItemTitle = strCritType == "T" ? res.LBL00141 : strCritType == "B" ? res.LBL07516 : res.LBL17602;
                        readonlyFlag = strCritType == "T" ? false : true;
                        if (this.saveType == "L" && this.isMultiFlag) {
                            strItemValue = "*".padLeft(strItemLen, "*");
                        }
                        break;
                    case "F":   // 담당자
                    case "G":   // 창고
                    case "H":   // 출고창고
                    case "I":   // 입고창고
                    case "J":   // 프로젝트
                    case "K":   // 부서
                    case "L":   // 품목구분
                    case "N":   // 창고유형구분
                        strItemTitle = getItemTitle(strCritType);

                        if (!["L", "N"].contains(strCritType) && this.saveType == "L" && this.isMultiFlag) {
                            strItemValue = "*".padLeft(strItemLen, "*");
                        } else {
                            strItemValue = getTrxValue.call(this, result.Trx, strCritType, iRow);
                        }
                        break;
                    default:
                        break;
                }

                // 초기화
                _control = null;
                controlType = "";
                selectBoxOptions = [];

                // 반복코드 이면
                if (strCritType == "R") {

                    // selectBox 옵션을 찾는다.
                    selectBoxOptions = (result.Trx || []).where(function (trx) {
                        return trx.Key.CRIT_TYPE == strCritType;
                    }).sort(function (a, b) {
                        return a.SORT_SNO - b.SORT_SNO;                         // SORT_SNO 순서대로 정렬
                    }).map(function (opt) {
                        return [opt.Key.DTLS_CLAS_CD, opt.Key.DTLS_CLAS_CD];    // selectBox option 생성
                    });

                    // 설정한 반복코드가 있으면 selectBox
                    if (selectBoxOptions.length) {
                        controlType = "widget.select";
                    }
                }

                // 위에 widget.select가 아니면 기존로직대로
                if ($.isEmpty(controlType)) {
                    controlType = (this.autoNumberSettings[0].CODE_TYPE == 13 || this.autoNumberSettings[0].CODE_TYPE == 12 || this.autoNumberSettings[0].CODE_TYPE == 11 || this.autoNumberSettings[0].CODE_TYPE == 10) ? "widget.input.codeType" : "widget.input.codeName";
                }

                if (this.saveType == "L") {
                    _control = ctrl.define(controlType, itemName, itemName, strItemTitle + "[" + strItemLen + "]")
                        .value(strItemValue)
                        .maxLength(strItemLen)
                        .readOnly(readonlyFlag);

                    if (["R", "F", "G", "H", "I", "J", "K", "L", "N"].contains(strCritType)) {
                        _control.dataRules([{ rangelength: [strItemLen, strItemLen] }, "required"], res.MSG05329);
                    }
                }
                else {
                    _control = ctrl.define(controlType, itemName, itemName, strItemTitle + "[" + strItemLen + "]")
                        .value(strItemValue)
                        .dataRules([{ rangelength: [strItemLen, strItemLen] }, "required"], res.MSG05329)
                        .maxLength(strItemLen)
                        .readOnly(readonlyFlag);
                }

                if (strCritType == "R" || strCritType == "1" || strCritType == "2" || strCritType == "3")
                    _control.dataFilter(ecount.common.ValidCheckSpecial)


                // 반복코드 control option 설정
                if (strCritType == "R") {
                    // selectBox option 넣는다
                    if (selectBoxOptions.length) {
                        _control
                            .option(selectBoxOptions)
                            .useSpace()
                            .useManualInput(true)                       // 날짜 컨트롤 처럼 직접입력 나오게하는 옵션
                            .showLayerInputMode(true);                  // 직접입력으로 input박스일때 레이어 나오게 하는 옵션

                        // 설정된 반복코드가 1개 이면 1번째 값으로 select
                        if (selectBoxOptions.length == 1) {
                            _control.select(selectBoxOptions[0]);
                        }
                    }
                }

                if (readonlyFlag == false && strItemValue == "" && this.initFocusControlId == "") {
                    this.initFocusControlId = itemName;
                }

                if (i == 0) {
                    this.firstControlId = itemName;
                }

                form1.add(_control.end());
            } //for

            //일련번호
            this.numDigitLen = result.NUM_DIGIT_LEN;

            // 창고유형구분 N 이 추가되고, 알파뱃으로 추가될 여지가 있어 숫자로 바꿈
            form1.add(ctrl.define("widget.input.codeName", "7_" + iRow, "7_" + iRow, res.LBL02176 + "[" + this.numDigitLen + "]")
                .value("*".padLeft(this.numDigitLen, "*"))
                .maxLength(this.numDigitLen)
                .readOnly()
                .end())
                .template("register")
            contents.add(form1);
        }
    },
    onMessageHandler: function (page, message) {
        switch (message.type) {
            case "spAutoCodeDes":
                this.reload();
                break;
        };
    },

    //reload
    reload: function () {
        var self = this;
        var params = {
            height: 250,
            width: 820,
            autoNumberSettings: encodeURIComponent(Object.toJSON([{ CODE_TYPE: self.autoNumberSettings[0].CODE_TYPE, IO_DATE: self.autoNumberSettings[0].IO_DATE }])),
            programSeq: this.programSeq,
            programID: this.programID,
            controlID: this.controlID
        };
        this.onAllSubmitSelf("/ECERP/Popup.Search/CM102P", params);
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(this.autoNumberSettings[0].CODE_TYPE == '14' ? ecount.resource.BTN00069 : ecount.resource.BTN00070));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    // After the document loaded
    onLoadComplete: function (e) {
        if ($.isEmpty(this.initFocusControlId) == false) {
            if (!e.unfocus) {
                this.contents.getControl(this.initFocusControlId).setFocus(0);
            }
        } else {
            if (!e.unfocus) {
                this.contents.getControl(this.firstControlId).setFocus(0);
            }
        }

        //Processing for CODE_TYPE 13, 12
        if (this.isAutoApply == true) {
            var checkNo = this.autoNumberSettings[0].CHECK_NO;
            var control = this.contents.getControl(this.controlId);
            if (control) {
                control.setValue(checkNo);
                this.onFooterApply();
            }
        }
        //End Processing for CODE_TYPE 13, 12
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크        
        return true;
    },

    //적용버튼
    onFooterApply: function (e) {
        var invalid = this.contents.validate();
        var setFocusObj;
        if (invalid.merge().length > 1) {
            setFocusObj = invalid.result[invalid.result.length - 1][0];
        }
        else if (invalid.merge().length > 0) {
            setFocusObj = invalid.merge()[0][0];
        }
        if ($.isEmpty(setFocusObj) == false) {
            if ($.isEmpty(setFocusObj.control)) {
                setFocusObj[0] && setFocusObj[0].control.setFocus(0);
                return;
            } else {
                setFocusObj.control.setFocus(0);
                return;
            }
        }
        var thisObj = this,
            type = null,
            formData = { result: [] }, // thisObj.contents.serialize(), [2016.09.07 bsy] reverse가 실행이 되어 다중일때 값이 변경되어 주석 처리 후 아래서 처리
            contents = null,
            sendFalg = true,
            autoCodeInfo = new Array;

        //  [2016.09.07 bsy] reverse가 실행이 되어 다중일때 값이 변경되어 처리
        if (thisObj.contents.getForm().length > 1) {
            for (var i = 0; i < thisObj.contents.getForm().length; i++) {
                formData.result.push(thisObj.contents.getForm()[i].serialize());
            }
        } else {
            formData = thisObj.contents.serialize();
        }

        for (var iRow = 0; iRow < thisObj.codeType.length; iRow++) {
            var repeatCode = "" //자동생성번호
            var hidRcd = new Object;
            hidRcd["CodeType"] = thisObj.codeType[iRow];
            hidRcd["hidRcd"] = "";
            hidRcd["hidRcd1"] = "";
            hidRcd["hidRcd2"] = "";
            hidRcd["hidRcd3"] = "";
            hidRcd["hidRcd4"] = "";
            hidRcd["hidRcd5"] = "";
            hidRcd["hidRcd6"] = "";
            hidRcd["hidRcd7"] = "";
            hidRcd["hidRcd8"] = "";
            hidRcd["hidRcd9"] = "";

            if (thisObj.codeType.length > 1)
                contents = formData.result[iRow];
            else
                contents = formData.result;

            $.each(contents, function (id, value) {
                type = id.left(1);

                if (type != "7") //일련번호
                    repeatCode += value;

                //리스트에서 해당창의 값을 받아서 다중전표를 처리해야하는 경우를 위한 로직 추가
                if (thisObj.saveType == "L" || thisObj.saveType == "I") {
                    switch (type) {
                        case "R":
                            hidRcd["hidRcd"] = value;
                            break;
                        case "Y":
                            hidRcd["hidRcd1"] = value;
                            break;
                        case "M":
                            hidRcd["hidRcd2"] = value;
                            break;
                        case "D":
                            hidRcd["hidRcd3"] = value;
                            break;
                        case "E":
                            hidRcd["hidRcd4"] = value;
                            break;
                        case "O":
                            hidRcd["hidRcd5"] = value;
                            break;
                        case "A":
                            hidRcd["hidRcd6"] = value;
                            break;
                        case "F":
                            hidRcd["hidRcd7"] = value;
                            break;
                        case "G":
                            hidRcd["hidRcd8"] = value;
                            break;
                        case "J":
                            hidRcd["hidRcd9"] = value;
                            break;
                    }
                }
            }) //for

            if (thisObj.saveType == "L") {
                autoCodeInfo.push(hidRcd);
            }
            else {
                //debugger
                var data = {
                    CodeType: parseInt(thisObj.codeType[iRow]),
                    RepeatCd: repeatCode,
                    isMaxInputFlag: thisObj.isMaxInputFlag,
                    CreateCount: thisObj.createCount
                };
                thisObj.showProgressbar(true);
                ecount.common.api({
                    url: "/SelfCustomize/Config/GetAutoCodeRepeatCd",
                    async: false,
                    data: Object.toJSON(data),
                    success: function (result) {
                        thisObj.hideProgressbar();
                        if (thisObj.createCount && thisObj.createCount > 1)    //채번을 복수로 하는 경우
                        {
                            var repeatSerSplit = result.Data.RepeatSer.split(ecount.delimiter);

                            for (i = 0; i < repeatSerSplit.length; i++) {
                                if (repeatSerSplit[i].length > thisObj.numDigitLen) {
                                    ecount.alert(String.format(ecount.resource.MSG04165, thisObj.numDigitLen));
                                    return sendFalg = false;

                                    break;
                                }
                            }

                        } else {
                            if (result.Data.RepeatSer.length > thisObj.numDigitLen) {
                                ecount.alert(String.format(ecount.resource.MSG04165, thisObj.numDigitLen));
                                return sendFalg = false;
                            }
                        }

                        if (sendFalg) {
                            var item = new Object;
                            item["CodeType"] = thisObj.codeType[iRow];
                            item["AutoCode"] = result.Data.AutoCode;
                            //item["AutoCode"] = result.Data.RepeatCd;
                            //item["Type"] = result.Data.Type;
                            //item["RepeatCd"]= result.Data.RepeatCd;
                            //item["RepeatSer"] = result.Data.RepeatSer;

                            autoCodeInfo.push(item);
                            if (thisObj.saveType == "I")
                                autoCodeInfo.push(hidRcd);
                        }
                    },
                    complete: function () {
                        thisObj.hideProgressbar();
                    }
                });
            }
        }

        if (sendFalg) {
            var message = {
                data: autoCodeInfo,
                code: "CM102P",
                codeType: autoCodeInfo[0].CodeType,
                callback: thisObj.close.bind(thisObj)
            };
            this.sendMessage(thisObj, message);
        }
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    onFocusOutHandler: function (event) {

        var originForm = event.__self;  //현재 포커스가 있는 form
        var forms = this.contents.getForm();
        var isBtnFocus = true;

        if (forms.length > 1) {
            forms.forEach(function (form, i) {
                if (form.itemIndex > originForm.itemIndex) {
                    form.itemList.forEach(function (items, j) {
                        if (items.isReadOnly() && isBtnFocus == true) {
                            items.setFocus(0);
                            isBtnFocus = false;
                        }
                    });
                }
                else {
                    isBtnFocus = true;
                }
            });
        }
        else {
            isBtnFocus = true;
        }

        if (isBtnFocus) {
            var ctrl = this.footer.getControl("apply");
            ctrl && ctrl.setFocus(0);
        }
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    ON_KEY_F8: function (e) {
        if (this.autoNumberSettings[0].CODE_TYPE == '14') {
            this.onFooterApply(e);
        }
    }
});
