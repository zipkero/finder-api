window.__define_resource && __define_resource("LBL01979","LBL01978","LBL06624","LBL02041","LBL13487","LBL13483","BTN00069","BTN00008","BTN00070","LBL00921","BTN00168","BTN00469","LBL01450","LBL02792","LBL07879","LBL07880","LBL09999","LBL01977","MSG04731","MSG08667");
/****************************************************************************************************
1. Create Date : 2015.01.08
2. Creator     : 강성훈
3. Description : 회계 > 매출전표 > 공급가액fn > 외화 > fn >  설정
4. Precaution  :
5. History     : 2020.12.15 (PhiTa) A20_05813 - 기초등록공통화-외화등록
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM001P"/** page ID */, {
    /**********************************************************************
	* page user opion Variables(사용자변수 및 객체)
	=>페이지에서 사용할 변수 등
	**********************************************************************/
    basicInfo: {
        DEC_AMT: "",
        AMT_CALC: ""
    },
    acc009Code: {
        CODE_NO: "",
        CODE_DES: "",
        EXCHANGE_RATE: "",
        AMTDIGIT_LEN: "",
        GUBUN: "",
        GBSTRING: ""
    },
    custCode: {
        GBSTRINGCUST: "",
        SELECTGBCUST: ""
    },

    page: {
        ACCTCUSTGB: "",
        BUSINESSKEY: "",
        NAMEGB: "",
        ACCTNM: "",
        ACCTCUSTGB: ""
    },
    custView: {
        FOREIGN_FLAG: "",
        EXCHANGE_CODE: "",
        GUBUN: ""
    },

    ecTaxType: '',
    /**********************************************************************
	* page init
	=> 상속 클레스, init, render 등
	**********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.basicInfo.DEC_AMT = ecount.config.company.DEC_AMT;
        this.basicInfo.AMT_CALC = ecount.config.company.AMT_CALC;

        //기초 데이터 설정
        this.setOnLoadData();
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
	* form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
	=> 화면ui 셋팅
	**********************************************************************/
    // onInitHeader
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL01979);
    },

    // onInitContents
    onInitContents: function (contents, resource) {
        var form = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
        var amt = this.AMT || "0";
        var isUseForeignTransaction = this.DifferenceAmt == 0 ? false : true;

        toolbar
            .addRight(ctrl.define("widget.label", "CUST_DES", "CUST_DES").label(''));

        form
            .template("register")
            .add(ctrl.define("widget.custom", "AmtCU", "AmtCU", ecount.resource.LBL01978).numericOnly().end())
            .add(ctrl.define("widget.custom", "EXCHANGE_RATECU", "EXCHANGE_RATECU", ecount.resource.LBL06624).end())
            .add(ctrl.define("widget.combine.foreignTransactionCondition", "Amt", "Amt", ecount.resource.LBL02041)
                .fixedSelect([amt, isUseForeignTransaction, this.getCorrespondingAmt(amt, this.DifferenceAmt)])
                .setOptions({
                    isDeposit: this.CorrespondingAccountType == "DR" ? false : true,
                    isBaseCurrency: ["CR", "DR"].contains(this.CorrespondingAccountType) ? false : true
                })
                .numericOnly(18, ecount.config.company.DEC_AMT)
                .end())
            .add(ctrl.define("widget.custom", "ForeignCust", "ForeignCust", (this.page.NAMEGB == "ACCT") ? ecount.resource.LBL13487 : ecount.resource.LBL13483).end());

        contents.add(toolbar).add(form);
    },

    // onInitFooter
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))

            .addLeft(ctrl.define("widget.button", "applyforeign").css("btn btn-primary").label(ecount.resource.BTN00070).hide())
            .addLeft(ctrl.define("widget.button", "PrePageMove").label(ecount.resource.LBL00921).hide());
        footer.add(toolbar);
    },

    // onInitControl
    onInitControl: function (cid, option) {
        var ctrl = widget.generator.control();

        if (cid == "AmtCU") {
            if ((!$.isNull(this.ACCT) && this.ACCT != "") || (!$.isNull(this.CUST) && this.CUST != "")) {
                option.addControl(ctrl.define("widget.input", "CUAmt", "CUAmt").numericOnly(18, this.acc009Code.AMTDIGIT_LEN).hasFn([{ id: "CUSt", label: ecount.resource.BTN00168 }]));
            }
            else {
                option.addControl(ctrl.define("widget.input", "CUAmt", "CUAmt").numericOnly(18, this.acc009Code.AMTDIGIT_LEN));
            }
        }
        else if (cid == "EXCHANGE_RATECU") {
            option.columns(3, 9)
                .addControl(ctrl.define("widget.label", "CodeNM", "CodeNM").label(this.acc009Code.CODE_DES))
                .addControl(ctrl.define("widget.input", "EXCHANGE_RATE", "EXCHANGE_RATE").numericOnly(18, 4));
            //.hasFn([{ id: "CodeNM", label: ecount.resource.BTN00469 }])
        }
        else if (cid == "ForeignCust") {
            var codeClass = {
                codeClass: ["S10"]
            };

            var optionList = [];
            optionList.push(["0/0", ecount.resource.LBL01450, ""]);
            this.viewBag.InitDatas.ExchangeType.Data.forEach(function (d) {
                optionList.push([d.CODE_NO, d.CODE_DES, ""]);
            });

            optionList.push(["99999", ecount.resource.LBL02792, "text-danger"]);



            option
                //.addControl(ctrl.define("widget.radio", "FOREIGN_FLAG", "FOREIGN_FLAG").label([ecount.resource.LBL07879, ecount.resource.LBL07880]).value(["Y", "N"]).select("Y"))
                .addControl(ctrl.define("widget.select", "ExchangeType", "ExchangeType")
                    .option(optionList)
                );

        }
    },

    /**********************************************************************
	* event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
	=>부모클레스에서 발생하는 이벤트, tab,onload, popup, search 등
	onChangeControl, onChangeContentsTab, onLoadTabPane, onLoadComplete, onMessageHandler...
	**********************************************************************/
    onLoadComplete: function (e) {
        this.setBindData();
        this.contents.hideRow("ForeignCust", null);

        if ($.isEmpty(this.FOREIGN_CODE_DES || "")) {
            this.FOREIGN_CODE_DES = this.acc009Code.CODE_DES;
        }

        this.contents.getControl("EXCHANGE_RATECU").get(0).setLabel(this.FOREIGN_CODE_DES);

        if (!e.unfocus && !this.MainManageNoExists && !this.CorrespondingManageNoExists) {
            this.contents.getControl("AmtCU").get(0).setFocus(0);
        }

        if (this.ecTaxType != "0" && this.ecTaxType != "X") {
            this.contents.getControl("Amt").readOnly();
        }
        else {
            if (this.MainManageNoExists || this.CorrespondingManageNoExists) {
                this.contents.getControl("CUAmt").readOnly();

                if (this.MainManageNoExists) {
                    this.contents.getControl("Amt_krw").readOnly();
                }

                if (this.CorrespondingManageNoExists) {
                    this.contents.getControl("Amt_drCr").readOnly();
                }

                if (this.IsExchangeRateReadonly) {
                    this.contents.getControl("EXCHANGE_RATECU").get(1).readOnly();
                }
            }
        }
    },

    // readonly된 컨트롤에 click 이벤트 발생시 실행
    onFocusInControlHandler: function (event) {
        if (event.origin_control && ["CUAmt", "Amt_krw", "Amt_drCr", "EXCHANGE_RATE"].contains(event.origin_control.id) && event.origin_control.isReadOnly()) {
            var message = {
                openAddInfoPopup: true,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
    },

    //폼 마지막에서 엔터
    onFocusOutHandler: function (event) {
        if (event.target == "contents" && event.control.cid == "Amt") {
            this.footer.getControl("apply").setFocus(0);
        }
    },

    onMessageHandler: function (event, data) {
        switch (event.pageID) {
            case "ESA035M":
                var ctrlExchangeType = this.contents.getControl("ForeignCust").get(0);
                ctrlExchangeType.addOption({
                    text: data.CODE_DES,
                    value: data.CODE_NO,
                    index: ctrlExchangeType.getOptionCount() - 1
                });

                ctrlExchangeType.setValue(data.CODE_NO);
                break;
        }
    },

    onChangeControl: function (e) {
        if (e.cid == "ExchangeType") {
            if (e.value == "99999") {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 250,
                    Request: {
                        FromProgramId: "E040114",
                        EditMode: ecenum.editMode.new,
                        isAddGroup: true,
                        TYPE_CD: "S10"
                    }
                };

                this.openWindow({
                    url: '/ECERP/SVC/ESA/ESA035M',
                    name: String.format(ecount.resource.LBL09999, ecount.resource.LBL01977),
                    param: param,
                    popupType: false,
                    additional: true
                });
            }
        } else if (e.cid == "Amt_IncomeStatementCheckbox") {
            if (e.value == true && this.CorrespondingManageNoExists) {
                this.contents.getControl("Amt").get(2).setValue(this.getCorrespondingAmt(this.AMT, this.DifferenceAmt));
            }
        }

        if (this.ecTaxType == "0" || this.ecTaxType == "X") {
            if (e.cid == "EXCHANGE_RATE") {
                this.setAutoCal();
            }
            if (e.cid == "CUAmt") {
                this.setAutoCal();
            }
        }

    },

    /**********************************************************************
	* event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트)
	=>grid에서 발생하는 이벤트,onGridInit, onGridRenderComplete,  특정컬럼등에 연결할
	callback 함수등
	**********************************************************************/

    /**********************************************************************
	* event  [button, link, FN, optiondoropdown..]
	=>각종 link , button 등에서 클릭이벤트 발생시
	**********************************************************************/
    // 외화 금액 설정
    onFunctionCUSt: function () {
        if (this.custView.GUBUN == "11" || this.custView.GUBUN == "30" || this.custView.GUBUN == "13") {
            this.contents.hideRow("AmtCU", null);
            this.contents.hideRow("EXCHANGE_RATECU", null);
            this.contents.hideRow("Amt", null);
            this.contents.showRow("ForeignCust", null);
            if ($.isEmpty(this.acc009Code.CODE_NO)) this.acc009Code.CODE_NO = "0/0";
            this.contents.getControl("ForeignCust").get(0).setValue(this.FOREIGN_CODE_NO || this.acc009Code.CODE_NO);

            if (this.viewBag.Permission.CUSTPER.Value != "W") {
                this.footer.getControl("applyforeign").hide();
            }
            else {
                this.footer.getControl("applyforeign").show();
            }

            this.footer.getControl("PrePageMove").show();
            this.footer.getControl("apply").hide();
            this.footer.getControl("Close").hide();

            this.contents.getControl("CUST_DES").setLabel(this.CUST_DES);
        } else {
            ecount.alert(ecount.resource.MSG04731, function () {
                this.contents.getControl("EXCHANGE_RATECU").setFocus(1);
            }.bind(this));
            return;
        }
    },
    //환율 정보 팝업
    onFunctionCodeNM: function () {
        var param = {
            width: 850,
            height: 540
        };
        this.openWindow({
            url: 'https://spib.wooribank.com/pib/Dream?withyou=CMCOM0184',
            name: "Dream",
            param: param,
            popupType: true,
            additional: true
        });
    },
    //이번버튼 클릭
    onFooterPrePageMove: function () {
        this.contents.showRow("AmtCU", null);
        this.contents.showRow("EXCHANGE_RATECU", null);
        this.contents.showRow("Amt", null);
        this.contents.hideRow("ForeignCust", null);

        this.footer.getControl("applyforeign").hide();
        this.footer.getControl("PrePageMove").hide();
        this.footer.getControl("apply").show();
        this.footer.getControl("Close").show();
        this.contents.getControl("CUST_DES").setLabel('')
    },
    //외화 거래처 적용
    onFooterApplyforeign: function () {
        var Save = {
            BUSINESS_NO: "",
            FOREIGN_FLAG: "",
            EXCHANGE_CODE: "",
        }
        //0/0

        var flag = this.contents.getControl("ForeignCust").get(0).getValue();
        Save.BUSINESS_NO = this.page.BUSINESSKEY;
        Save.FOREIGN_FLAG = (flag == "0/0") ? "N" : "Y"; //확인대상
        if (Save.FOREIGN_FLAG == "N") {
            Save.EXCHANGE_CODE = "";
        }
        else {
            Save.EXCHANGE_CODE = this.contents.getControl("ForeignCust").get(0).getValue();
        }
        var param = {
            Request: {
                Data: Save
            }
        };


        var thisobj = this;
        var formData = JSON.stringify(param);
        ecount.common.api({
            url: "/SVC/Account/Basic/SaveForeignCurrency",
            data: formData,
            success: function (result) {
                thisobj.onFooterPrePageMove()
                thisobj.setOnLoadData();

                var code = thisobj.contents.getControl("ForeignCust").get(0).getSelectedItem().value;
                var Nm = thisobj.contents.getControl("ForeignCust").get(0).getSelectedItem().label;
                if (Nm == "=======" || flag == "0/0") {
                    Nm = "";
                    code = "0/0";
                }
                var len = thisobj.viewBag.InitDatas.ExchangeType.Data.find(function (item) { return item.CODE_NO == code }).AMTDIGIT_LEN || 0;
                //20160607 SBY ADD
                thisobj.contents.getControl("EXCHANGE_RATECU").get(1).setValue(thisobj.viewBag.InitDatas.ExchangeType.Data.find(function (item) { return item.CODE_NO == code }).EXCHANGE_RATE || 0);
                thisobj.contents.getControl("EXCHANGE_RATECU").get(0).setLabel(Nm);
                thisobj.acc009Code.CODE_DES = Nm;
                thisobj.acc009Code.CODE_NO = code;
                if (thisobj.ecTaxType == "0" || thisobj.ecTaxType == "X")
                    thisobj.setAutoCal();
                //thisobj.contents.getControl("AmtCU").get(0).setLabel(thisobj.viewBag.InitDatas.ExchangeType.Data.find(function (item) { return item.CODE_NO == code }).EXCHANGE_RATE || 0);
                thisobj.contents.getControl("AmtCU").get(0).useNumericOnly(18 - len,len,null,true);
            }.bind(this)
        });

    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },
    //적용 버튼
    onFooterApply: function () {
        var objthis = this;
        var Amt = {
            AMT1: objthis.contents.getControl("AmtCU").get(0).getValue(),
            AMT2: objthis.contents.getControl("Amt").getValue()[0],
            RATE: objthis.contents.getControl("EXCHANGE_RATECU").get(1).getValue(),
            CODE: objthis.contents.getControl("EXCHANGE_RATECU").get(0).getLabel(),
            AMT_DR_CR: objthis.contents.getControl("Amt").getValue()[2],
            DifferenceAmt: objthis.contents.getControl("Amt").getValue()[3],
            EXCHANGE_CODE: this.acc009Code.CODE_NO
        }

        // 지출결의서, 입금보고서인 경우에만 체크
        if (this.DrManageNoExist && this.CrManageNoExist &&
            (this.MainManageNoExists && !this.CorrespondingManageNoExists
                || !this.MainManageNoExists && this.CorrespondingManageNoExists)) {
            if (!$.isNull(this.AMT) && ["CASE94", "CASE93"].contains(this.GUBUN)) {
                var orgAmt = new Decimal(this.AMT || "0"),
                    newAmt = new Decimal(Amt.AMT2 || "0"),
                    difAmt = new Decimal(Amt.DifferenceAmt || "0");

                if (!this.getCheckSyncAmount(orgAmt, this.MainManageNoExists ? newAmt.plus(difAmt) : newAmt))
                    return false;
            }
        }

        var message = {
            openAddInfoPopup: false,
            name: "",
            code: "",
            data: Amt,
            isAdded: false,
            addPosition: "current",
            callback: this.close.bind(this),
            controlID: this.controlID
        };
        this.sendMessage(this, message);
    },
    /**********************************************************************
	*  hotkey [f1~12, 방향키등.. ]
	=>f키 , ctrl+ .. 방향키 등
	**********************************************************************/

    /**********************************************************************
	* user function
	=>사용자가 생성한 기능 function 등
	**********************************************************************/
    //기초 데이터 설정
    setOnLoadData: function () {
        var objthis = this;

        if (this.viewBag.InitDatas.ACC009Code.length > 0) {
            objthis.acc009Code.CODE_NO = this.viewBag.InitDatas.ACC009Code[0].CODE_NO;
            objthis.acc009Code.CODE_DES = this.viewBag.InitDatas.ACC009Code[0].CODE_DES;
            objthis.acc009Code.EXCHANGE_RATE = this.viewBag.InitDatas.ACC009Code[0].EXCHANGE_RATE || "0";
            objthis.acc009Code.AMTDIGIT_LEN = this.viewBag.InitDatas.ACC009Code[0].AMTDIGIT_LEN;
            objthis.acc009Code.GUBUN = this.viewBag.InitDatas.ACC009Code[0].GUBUN;
            objthis.acc009Code.GBSTRING = this.viewBag.InitDatas.ACC009Code[0].GBSTRING;
        }
        else {
            objthis.acc009Code.AMTDIGIT_LEN = this.basicInfo.DEC_AMT;
        }

        if (this.viewBag.InitDatas.CUSTCode.length > 0) {
            objthis.custCode.GBSTRINGCUST = this.viewBag.InitDatas.CUSTCode[0].GBSTRING2;
            objthis.custCode.SELECTGBCUST = this.viewBag.InitDatas.CUSTCode[0].SELECTGB;

            if (objthis.acc009Code.GUBUN == "30") {
                objthis.page.ACCTCUSTGB = "30";

                if (objthis.MENU == "F" && objthis.GUBUN == "CASE98") {
                    objthis.page.BUSINESSKEY = objthis.CUST;
                    objthis.page.NAMEGB = "ACCT";
                    objthis.page.ACCTNM = objthis.CUST_DES;
                }
                else {
                    objthis.page.NAMEGB = "ACCT";
                    if (objthis.GUBUN == "EBD04") {
                        if (objthis.acc009Code.GBSTRING == "ACCT") {
                            objthis.page.BUSINESSKEY = objthis.ACCT;
                        }
                        else {
                            objthis.page.BUSINESSKEY = objthis.CUST;
                            objthis.page.ACCTNM = objthis.CUST_DES;
                        }
                    }
                    else {
                        objthis.page.BUSINESSKEY = objthis.ACCT;
                    }

                }
            }
            else if (objthis.acc009Code.GUBUN == "11" || objthis.acc009Code.GUBUN == "13") {
                objthis.page.ACCTCUSTGB = "11";
                objthis.page.NAMEGB = "CUST";
                objthis.page.BUSINESSKEY = this.CUST;
            }
            else {
                //if(objthis.GUBUN == "CASE98")
                if (objthis.GUBUN == "CASE93" || objthis.GUBUN == "CASE94" || objthis.GUBUN == "EBD01" || objthis.GUBUN == "EBD05" || objthis.GUBUN == "EBD04" || objthis.GUBUN == "EBD53") {
                    if (objthis.custCode.SELECTGBCUST == "11") {
                        if (objthis.custCode.GBSTRINGCUST == "ACCT") {
                            objthis.page.ACCTCUSTGB = "11";
                            objthis.page.NAMEGB = "CUST";
                            objthis.page.BUSINESSKEY = this.ACCT;
                        }
                        else {
                            objthis.page.ACCTCUSTGB = "11";
                            objthis.page.NAMEGB = "CUST";
                            objthis.page.BUSINESSKEY = this.CUST;
                        }
                    }
                    else if (objthis.custCode.SELECTGBCUST == "30") {
                        if (objthis.custCode.GBSTRINGCUST == "ACCT") {
                            objthis.page.ACCTCUSTGB = "30";
                            objthis.page.NAMEGB = "ACCT";
                            objthis.page.BUSINESSKEY = this.ACCT;
                        }
                        else {
                            objthis.page.ACCTCUSTGB = "30";
                            objthis.page.NAMEGB = "ACCT";
                            objthis.page.BUSINESSKEY = this.CUST;
                        }
                    }
                    else if (objthis.custCode.SELECTGBCUST == "13") {
                        if (objthis.custCode.GBSTRINGCUST == "ACCT") {
                            objthis.page.ACCTCUSTGB = "11";
                            objthis.page.NAMEGB = "CUST";
                            objthis.page.BUSINESSKEY = this.ACCT;
                        }
                        else {
                            objthis.page.ACCTCUSTGB = "11";
                            objthis.page.NAMEGB = "CUST";
                            objthis.page.BUSINESSKEY = this.CUST;

                        }
                    }
                }
                else {
                    objthis.page.ACCTCUSTGB = "11";
                    objthis.page.NAMEGB = "CUST";
                    objthis.page.BUSINESSKEY = this.CUST;
                }
            }
            if (!$.isNull(this.contents))
                this.contents.getControl("EXCHANGE_RATECU").get(0).setLabel(this.acc009Code.CODE_DES);

            if (!$.isEmpty(objthis.page.BUSINESSKEY)) {
                var formDataView = JSON.stringify({ BUSINESS_NO: objthis.page.BUSINESSKEY });
                ecount.common.api({
                    url: "/Account/Basic/GetListCustView",
                    data: formDataView,
                    success: function (result) {
                        if ($.isEmpty(result.Data) == false) {
                            objthis.custView.FOREIGN_FLAG = result.Data.FOREIGN_FLAG;
                            objthis.custView.EXCHANGE_CODE = result.Data.EXCHANGE_CODE;
                            objthis.custView.GUBUN = result.Data.GUBUN;
                        }
                        else {
                            objthis.custView.FOREIGN_FLAG = "N";
                            objthis.custView.EXCHANGE_CODE = "";
                        }
                    }.bind(this)
                });
            }
        }

        this.ecTaxType = (this.ECTAX_TYPE == null ? '0' : this.ECTAX_TYPE);
    },

    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    ON_KEY_ENTER: function (e, target) {
        if (target.cid == "apply") {
            this.onFooterApply();
        }
    },

    // 데이터바인드
    setBindData: function () {
        this.contents.getControl("AmtCU").get(0).setValue(this.FOREIGN_AMT || "0");
        // TODO: Load value for control F/X Rate
        if (this.parentPageID == "EBD010M_04") {
            var _EXCHANGE_RATECU = $.isNull(this.EXCHANGE_RATE) ? this.EXCHANGE_RATE : this.acc009Code.EXCHANGE_RATE;
            this.contents.getControl("EXCHANGE_RATECU").get(1).setValue(_EXCHANGE_RATECU);
        } else {
            var _EXCHANGE_RATECU = $.isNull(this.EXCHANGE_RATE) ? this.acc009Code.EXCHANGE_RATE || 0 : this.EXCHANGE_RATE;
            if (_EXCHANGE_RATECU == 0.0) {
                _EXCHANGE_RATECU = this.acc009Code.EXCHANGE_RATE || "0";
            }
            this.contents.getControl("EXCHANGE_RATECU").get(1).setValue(_EXCHANGE_RATECU || "0");
        }
    },

    setAutoCal: function () {
        var amt = new Decimal(this.contents.getControl("AmtCU").get(0).getValue() || 0);
        var rate = new Decimal(this.contents.getControl("EXCHANGE_RATECU").get(1).getValue() || 0);
        var amt2 = this.contents.getControl("Amt");
        var decA = ecount.config.company.DEC_AMT;
        var amtCalc = ecount.config.company.AMT_CALC;
        var amtwon = new Decimal(amt2.getValue()[0] || 0);

        if (amt.isNaN()) amt = new Decimal(0);
        if (rate.isNaN()) rate = new Decimal(0);
        if (amtwon.isNaN()) amtwon = new Decimal(0);

        var won = amtwon;
        if (rate.isZero() == false && amt.isZero() == false) {
            won = ecount.calc.toFixed(rate.times(amt), decA, amtCalc);
        }

        amt2.setValue({ 0:won.toString() });
    },

    getCorrespondingAmt: function (amt, differenceAmt) {
        if (this.CorrespondingAccountType == "DR") {
            return new Decimal(amt || 0).plus(differenceAmt || 0);
        } else {
            return new Decimal(amt || 0).minus(differenceAmt || 0);
        }
    },

    getCheckSyncAmount: function (amt, newAmt) {
        if (amt.equals(newAmt)) {
            return true;
        }
        else {
            ecount.confirm(ecount.resource.MSG08667, function (isOK, index) {
                if (isOK) {
                    var message = {
                        openAddInfoPopup: true,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                }
                else {
                    return false;
                }
            }.bind(this))
        }
    }
});