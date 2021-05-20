window.__define_resource && __define_resource("LBL13071","BTN00069","BTN00033","BTN00008","MSG08567","MSG00141","MSG07959","LBL01784","LBL01788","LBL01785","LBL01789","LBL13524","LBL13525","LBL13526","LBL13527","LBL14107","LBL14108","LBL14100","LBL14101","LBL13049","LBL13006","LBL08600","LBL01977","MSG08492","LBL14521");
/****************************************************************************************************
1. Create Date : 2018.05.24
2. Creator     : 김대호
3. Description : 일반전표/지출/입금/가지급 추가정보 입력팝업
4. Precaution  : 
5. History     : 2020.01.07 (On Minh Thien) - A19_04630 - ecmodule 경로 변경 후속처리 요청
				 2020.01.31(양미진) - dev 35548 A20_00271  발행수표 관련 확인 요청 
				 2020.02.10(양미진) - dev 35548 A20_00271  발행수표 관련 확인 요청 추가수정
                 2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                 2020.06.08 (TanThanh) - Fix Dev 43217
                 2020.08.04 (최용환) - Dev.35548 발행수표 관련 확인 요청 - 수령/발행 수표 증가 체크시 ACCOUNT_NO
                 2020.11.23 (TanThanh) - A20_05863 권한세분화 회계2 후속
				 2020.12.16 (김동수) : A20_06811 - 금보고서 추가정보 입력에서 채권번호 적용하면 금액이 0으로 변경되는 현상
6. Old File    : UI.Popup.Search/CM012P.js
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM014P", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    tabChanged: null,
    codeTypeData: null,
    lazyLoadtargetTabIdByCheck: null,                       //수령수표/발행수표 페이지 전환시 LazyLoadTarget TabId를 지정하기 위한 변수

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this.pageOption = {
            AmountLength: ecount.common.getAmountLength(),
            errorMessage: {
                control: new Array(),
                grid: new Array()
            },
            SaveFunctionInformation: null,                  //전표 저장 시 호출하는 함수(세부내역에서 전표를 저장시키는 case때문에, 호출되는 흐름을 관리)
            errors: null
        }

        this.pageData = {
            InvoicingTaxDetail: {
                TAX_NO: "",
                REMARKS: "",
                SETTLE_AMT1: 0, // $("#settle_amt1").val()
                SETTLE_AMT2: 0, // $("#settle_amt2").val()
                SETTLE_AMT3: 0, // $("#settle_amt3").val()
                SETTLE_AMT4: 0, // $("#settle_amt4").val()
                VAT_FLAG: null,
                P_DES1: "",
                P_DES2: "",
                P_DES3: "",
                P_DES4: "",
                P_DES5: "",
                P_DES6: "",
                Details: [$.extend({}, ecmodule.account.slipsDetails.model.taxInvoiceDetail)],
            },
        }

        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecount.errorMessage");
        this.registerDependencies("ecmodule.account.common");
    },

    initProperties: function () {
        tabChanged = false;
        codeTypeData = {
            item1: null,
            item2: null,
            item3: null
        };

        this.sumAmountDto = {
            BondIncrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            BondDecrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            DebitIncrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            DebitDecrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            IssCheckIncrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            IssCheckDecrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            RcvCheckIncrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            RcvCheckDecrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            IssNoteIncrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            IssNoteDecrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            RcvNoteIncrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            RcvNoteDecrease: { Amt: new Decimal(0), AmtF: new Decimal(0) },
            taxInfo: { Amt: new Decimal(0), AmtF: new Decimal(0) }
        };

        //this.setAutoFocusOnTabPane = false;
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
        header.setTitle(ecount.resource.LBL13071)
    },

    onFocusOutHandler: function (event) {
        if (event.target == "contents") {
            this.footer.getControl('apply').setFocus(0);
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
			tabContents = generator.tabContents();

        // 카드매입내역
        if (this.IsFromCardActivity && this.IoType == "00" && !$.isEmpty(this.IoCustName)) {
            this.IoType = "27";
            this.IoCardNo = this.BankAccount;

            if (this.IoCardNo.length > 20) {
                this.IoCardNo = this.IoCardNo.substring(0, 20);
            }
        }

        tabContents
			.createActiveTab(this.ActiveTab, this.getPageResx(this.ActiveTab, true))
			.add(this.getPageInfo(this.ActiveTab));

        for (var i = 1; i < this.TabList.length; i++) {
            tabContents
				.createTab(this.TabList[i], this.getPageResx(this.TabList[i], true))
				.add(this.getPageInfo(this.TabList[i]));
        }

        contents.add(tabContents);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
			ctrl = widget.generator.control();

        ////////////
        // 적용 ////
        ////////////
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));//todo: .clickOnce() 적용

        ////////////
        // 삭제 ////
        ////////////
        var listFn = [];
        $.each(this.TabList, function (i, item) {
            listFn.push({ id: "delete" + item, label: String.format("{0} {1}", this.getPageResx(item, false), ecount.resource.BTN00033) });

            this["onButtonDelete" + item] = function () {
                this.deleteByTabId(item);
            }
            this["onButtonDelete" + item + "_PAGE"] = function () {
                this.deleteByTabId(item);
            }
        }.bind(this));


        toolbar.addLeft(ctrl.define("widget.button.group", "delete")
			.css("btn btn-default")
			.label(ecount.resource.BTN00033)
			.addGroup(listFn));


        ////////////
        // 닫기 ////
        ////////////
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
   * event form listener [tab, content, search, popup ..]
   **********************************************************************/
    // 탭 변경 시 발생
    onChangeContentsTab: function (event) {

        var page = this.contents.getPage(event.tabId);
        if (!this.isPopupTypeWindow() && event.tabId.indexOf("Decrease") > -1) {
            if (page && page.viewBag)
                this.setLayout(page.viewBag.FormInfos[page.ListFormType]);
        }

        //활성화 된 탭과 클릭한 탭이 같다면 진행하지 않는다.
        if (this.ActiveTab == event.tabId) {
            return false;
        }

        this.ActiveTab = event.tabId;

        //(채권/채무/수표/어음 감소가 아닐경우
        if (page && this.ActiveTab.indexOf("Decrease") == -1) {
            var tabcontents = page.contents.itemList.where(function (x) { return x.__type.indexOf("grid") > -1 }).first();

            //그리드일때 처음 항목 포커스
            if (!$.isEmptyObject(tabcontents)) {
                var grid = tabcontents.getGrid().grid;
                var girdFirstid = grid.getColumnInfoList().where(function (x) { return x.controlType && !x.isHideColumn && x.controlType.indexOf("input") > -1 }).first().id;

                if (girdFirstid)
                    grid.setCellFocus(girdFirstid, grid.getRowKeyByIndex(0));
            }
        }

    },

    onLoadComplete: function (e) {
        //this.adjustHeaderSearchDimensions();
        if (this.IsValidationError)
            this.saveValidate();

        if (this.TabList.indexOf("RcvCheckIncrease") > -1) {
            lazyLoadtargetTabIdByCheck = "RcvCheckIncrease";
        } else if (this.TabList.indexOf("RcvCheckDecrease") > -1) {
            lazyLoadtargetTabIdByCheck = "RcvCheckDecrease";
        } else if (this.TabList.indexOf("IssCheckIncrease") > -1) {
            lazyLoadtargetTabIdByCheck = "IssCheckIncrease";
        } else if (this.TabList.indexOf("IssCheckDecrease") > -1) {
            lazyLoadtargetTabIdByCheck = "IssCheckDecrease";
        }
    },

    // 인크루드 페이지 로드 후 init 실행할때 호출되는 이벤트
    onIncludeCompleteByCheck: function (pageId, option) {
        var parentThis = this,
			commonIncludeHandler = {
			    //유효성체크
			    checkValidate: function (e, callback) {
			        ecount.confirm(ecount.resource.MSG08567, function (isOK) {
			            if (isOK) {
			                callback();
			            } else {
			                this.contents.getControl("selectCheckType").setValue(e.oldVlaue);
			            }
			        }.bind(this));
			    },

			    //탭 페이지 변경 후, 이전 탭 관련정보 정리
			    garbageCleaning: function (garbageId) {
			        //destory할 대상 ID의 page객체를 가져온다.
			        var garbageTarget = parentThis.contents.getPage(garbageId, garbageId);

			        // 1. 증가번호 관리 Object에서 삭제                       
			        // 2. 채권/채무/수표 증가/감소 관리 Object에서 삭제       
			        // 3. 해당 채권/채무/수표 증가/감소 관리 Object에서 삭제  
			        // 4. 탭을 관리하는 Object인 TabList에서 대상ID를 삭제,
			        // 5. 해당페이지를 destroy하고,
			        // 6. 해당 탭 명칭을 reflash한다.
			        parentThis.cleanRelationObjectByTabId(garbageId, false);

			        ///////////////////////////////////
			        // 7.삭제버튼 그룹을 reflash //////
			        ///////////////////////////////////
			        parentThis.footer.getControl('delete').removeGroupItem('delete' + garbageId);

			        parentThis.footer.getControl('delete').addGroupItem([{
			            id: "delete" + parentThis.ActiveTab,
			            label: String.format("{0} {1}", parentThis.getPageResx(parentThis.ActiveTab, false), ecount.resource.BTN00033)
			        }]);
			        parentThis["onButtonDelete" + parentThis.ActiveTab] = function () {
			            parentThis.deleteByTabId(parentThis.ActiveTab);
			        }
			        parentThis["onButtonDelete" + parentThis.ActiveTab + "_PAGE"] = function () {
			            parentThis.deleteByTabId(parentThis.ActiveTab);
			        }

			        //////////////////////////////////////////////////////////////////////
			        // 8.페이지 전환이 일어난 해당 탭의명칭을 정상적으로 재변경 해줌 /////
			        //////////////////////////////////////////////////////////////////////
			        parentThis.contents.getTabContents().renameTab(lazyLoadtargetTabIdByCheck, parentThis.getPageResx(parentThis.ActiveTab, true));
			    }
			};

        $.extend(option, {
            //수령수표증가 페이지이동
            callPageByRcvCheckIncreasePage: function (e) {
                commonIncludeHandler.checkValidate.call(this, e, function () {
                    parentThis.ActiveTab = "RcvCheckIncrease";
                    parentThis.lazyLoadPage(lazyLoadtargetTabIdByCheck, parentThis.getPageInfo(parentThis.ActiveTab), true, commonIncludeHandler.garbageCleaning.bind(this, "IssCheckDecrease"));
                    //this.garbageCleaning("IssCheckDecrease");
                });
            },

            //수령수표감소 페이지이동
            callPageByRcvCheckDecreasePage: function (e) {
                commonIncludeHandler.checkValidate.call(this, e, function () {
                    parentThis.ActiveTab = "RcvCheckDecrease";
                    parentThis.lazyLoadPage(lazyLoadtargetTabIdByCheck, parentThis.getPageInfo(parentThis.ActiveTab), true, commonIncludeHandler.garbageCleaning.bind(this, "IssCheckIncrease"));
                    //this.garbageCleaning("IssCheckIncrease");
                });
            },

            //발행수표증가 페이지이동
            callPageByIssCheckIncreasePage: function (e) {
                commonIncludeHandler.checkValidate.call(this, e, function () {
                    parentThis.ActiveTab = "IssCheckIncrease";
                    parentThis.lazyLoadPage(lazyLoadtargetTabIdByCheck, parentThis.getPageInfo(parentThis.ActiveTab), true, commonIncludeHandler.garbageCleaning.bind(this, "RcvCheckDecrease"));
                    //this.garbageCleaning("RcvCheckDecrease");
                });
            },

            //발행수표감소 페이지이동
            callPageByIssCheckDecreasePage: function (e) {
                commonIncludeHandler.checkValidate.call(this, e, function () {
                    parentThis.ActiveTab = "IssCheckDecrease";
                    parentThis.lazyLoadPage(lazyLoadtargetTabIdByCheck, parentThis.getPageInfo(parentThis.ActiveTab), true, commonIncludeHandler.garbageCleaning.bind(this, "RcvCheckIncrease"));
                    //this.garbageCleaning("RcvCheckIncrease");
                });
            }
        });
    },

    // 페이지들의 인크루드가 끝난 후, 동작하는 이벤트
    onAfterLoadIncludePage: function (event) {
        this._super.onAfterLoadIncludePage.apply(this, arguments);

        this.contents.changeTab(this.ActiveTab, true);
        //this.contents.getControl().setFocus(0);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/


    /************************f********************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //닫기버튼_include page 있을 경우
    onFooterClose_PAGE: function () {
        this.close();
    },

    // 삭제 버튼 클릭
    onFooterDelete: function () {
        this.delete();
    },

    // 삭제 버튼 클릭 
    onFooterDelete_PAGE: function () {
        this.delete();
    },

    onFooterApply: function () {
        this.dataApply();
    },

    // 적용 버튼 클릭
    onFooterApply_PAGE: function () {
        this.dataApply();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // KEY_ENTER
    //ON_KEY_ENTER: function (event, control) {
    //},

    //ON_KEY_ENTER_PAGE: function (event, control) {
    //    if (!$.isEmpty(control)) {
    //        if (control.cid == "apply") {
    //            this.onFooterApply_PAGE();
    //        } else {
    //            return;
    //        }
    //    }
    //},

    // KEY_F8
    ON_KEY_F8: function () { },

    ON_KEY_F8_PAGE: function () {
        this.onFooterApply_PAGE();
    },

    /********************************************************************** 
    * general function 
    **********************************************************************/

    // 저장용 DTO 생성
    getSendMessageDto: function () {
        var message = {
            dataExists: false,
            amountAdjustment: false,

            TabList: [],

            additionalInfo: {
                ITEM1: null,
                ITEM1_CD: null,
                ITEM1_DES: null,
                ITEM2: null,
                ITEM2_CD: null,
                ITEM2_DES: null,
                ITEM3: null,
                ITEM3_CD: null,
                ITEM3_DES: null,
                ITEM4: null,
                ITEM5: null,
                ITEM6: null,
                ITEM7: null,
                ITEM8: null
            },

            manageNo: {
                RowKey: this.rowKey,
                Cust: this.Cust,
                BondIncrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0),
                    ExchangeRate: new Decimal(0)
                },
                BondDecrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0),
                    ExchangeRate: new Decimal(0)
                },
                DebitIncrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0),
                    ExchangeRate: new Decimal(0)
                },
                DebitDecrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0),
                    ExchangeRate: new Decimal(0)
                },
                IssCheckIncrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                },
                IssCheckDecrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                },
                RcvCheckIncrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                },
                RcvCheckDecrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                },
                RcvNoteIncrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                },
                RcvNoteDecrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                },
                IssNoteIncrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                },
                IssNoteDecrease: {
                    InputYn: "N",
                    Detail: [],
                    GyeCode: null,
                    SumAmt: new Decimal(0),
                    SumAmtF: new Decimal(0)
                }
            },

            taxData: {
                IO_TYPE: '00',
                IO_DATE: '',
                IO_CUST: '',
                IO_CUST_NAME: '',
                IO_CARD_NO: '',
                ECTAX_FLAG: '',
                TAX_DEDUCT: '0',
                PRETAX_AMOUNT: 0,
                TAX_AMOUNT: 0,
                VAT_DES: ""
            },

            manageNoIncreaseList: this.ManageNoIncreaseList,
            allManageNoList: this.AllManageNoList || [],

            callback: this.close.bind(this)
        };

        return message;
    },

    //적용
    dataApply: function () {

        this.pageOption.errorMessage.control = new Array();

        if ((this.Permission == "U" && (this.EditFlag == "M" && this.GbType.equals("Y"))) || this.Permission == "R") {
            ecount.alert(ecount.resource.MSG00141);
            this.footer.getControl("apply").setAllowClick();
            return false;
        }

        var result = this.saveValidate();

        if (result == true) {
            this.save();
        }
    },

    saveValidate: function () {
        var self = this,
			errorTabList = [],
			page;

        this.pageOption.errors = new ecount.errorMessage({
            contents: this.contents
        });

        for (var i = 0; i < this.TabList.length; i++) {
            page = this.contents.getPage(this.TabList[i]);

            if (page && page.saveValidate) {
                //page.saveValidate();
                var result = page.saveValidate({
                    errorShowPredicate: function (error) {
                        if (self.contents.currentTabId != this.TabList[i]) {
                            self.contents.changeTab(this.TabList[i], false);
                        }

                    }.bind(self)
                });

                if (page.pageOption.errors.hasError()) {

                    //(채권/채무/수표/어음 감소 일때 체크된게 없으면 에러체크를 하지 않음
                    if (this.TabList[i].indexOf("Decrease") > -1) {
                        var tabcontents = page.contents.itemList.where(function (x) { return x.__type.indexOf("grid") > -1 }).first();
                        if (!$.isEmptyObject(tabcontents)) {
                            var gridCheckCount = tabcontents.getGrid().grid.getCheckedCount();
                            if (gridCheckCount > 0) {
                                errorTabList.push(this.TabList[i]);
                                page.pageOption.errors.show();
                                page.hideProgressbar(true);
                            }
                        }
                    }
                    else {
                        errorTabList.push(this.TabList[i]);
                        page.pageOption.errors.show();
                        page.hideProgressbar(true);
                    }
                }
                else {
                    if (this.TabList[i] != "additionalInfo")
                        this.sumAmountDto[this.TabList[i]] = page.sumDto;
                }
            }
        }

        if (!$.isEmpty(errorTabList)) {
            return false;
        }
        else {
            var //compareAmountByParent = true, // 부모에서 받은 금액과 각 탭별 금액 비교결과
				compareAmountByTabs = true, // 각 탭간의 금액 비교결과
				//parentAmt = this.CustForeignFlag.equals("N") ? new Decimal(this.ExpAmt || 0) : new Decimal(this.ExpAmtF || 0),
				isForeign = this.CustForeignFlag.equals("N") ? false : true,
				informTargetList = [], srcAmt, targetAmt;

            // 탭간 금액비교
            for (var i = 0; i < this.TabList.length; i++) {
                if (this.TabList[i].equals("additionalInfo") || // 추가항목은 금액비교대상 아님
					(this.CustForeignFlag.equals("Y") && (this.TabList[i].indexOf("Check") > -1 || this.TabList[i].indexOf("Note") > -1))) { // 외화일 경우 수표/어음은 비교대상에서 제외
                    continue;
                }
                else {
                    srcAmt = this.CustForeignFlag.equals("N") ? this.sumAmountDto[this.TabList[i]].Amt : this.sumAmountDto[this.TabList[i]].AmtF;

                    if (!srcAmt.eq(0)) {
                        //if (!srcAmt.eq(parentAmt)) {
                        //    compareAmountByParent = false;
                        //}

                        for (var j = i + 1; j < this.TabList.length; j++) {
                            if (this.CustForeignFlag.equals("Y") && (this.TabList[j].indexOf("Check") > -1 || this.TabList[j].indexOf("Note") > -1)) {
                                // 외화일 경우 수표는 비교대상에서 제외
                                continue;
                            }
                            else {
                                targetAmt = this.CustForeignFlag.equals("N") ? this.sumAmountDto[this.TabList[j]].Amt : this.sumAmountDto[this.TabList[j]].AmtF;

                                if (!targetAmt.eq(new Decimal(0)) && !targetAmt.eq(srcAmt)) {
                                    if (!informTargetList.contains({ tabId: this.TabList[i], foreignFlag: isForeign })) {
                                        informTargetList.push({ tabId: this.TabList[i], foreignFlag: isForeign });
                                    }

                                    if (!informTargetList.contains({ tabId: this.TabList[j], foreignFlag: isForeign })) {
                                        informTargetList.push({ tabId: this.TabList[j], foreignFlag: isForeign });
                                    }

                                    compareAmountByTabs = false;
                                }
                            }
                        }
                    }
                }
            }

            if (compareAmountByTabs == false) {
                ecount.alert(this.getInformContents(informTargetList));
                this.footer.getControl("apply").setAllowClick();
                return false;
            }
            else {
                return true;
            }
        }
    },

    // Save
    save: function (message) {
        var message = this.getSendMessageDto(),
			self = this;

        for (var i = 0; i < this.TabList.length; i++) {
            page = this.contents.getPage(this.TabList[i]);

            if (page && page.getSaveData) {
                var tabData = page.getSaveData();

                if (!$.isEmpty(tabData.SlipDetail)) {
                    if (this.TabList[i].indexOf("Decrease") > -1 || this.TabList[i].indexOf("Increase") > -1) {
                        if (this.JournalType.equals("01") == true &&
							["RcvCheckIncrease", "RcvCheckDecrease", "IssCheckIncrease", "IssCheckDecrease"]            //일반전표에서 수표증가로 저장되는 경우,//전표거래처를 ACCOUNT_NO로 저장 (감소에서 출금계좌로 입력되는거 일단 무시, 나중에 출금계좌를 저장하기 위한 컬럼이 필요한 상황)
								.contains(this.TabList[i]) == true) {
                            tabData.SlipDetail.forEach(function (item, i) {
                                item.ACCOUNT_NO = this.Cust;
                            }.bind(this));
                        } else if (["RcvCheckIncrease", "RcvCheckDecrease", "IssCheckIncrease", "IssCheckDecrease"].    //입금/지출/가지급의 수표인 경우, 전표 거래처를 저장
							contains(this.TabList[i]) == true) {
                            tabData.SlipDetail.forEach(function (item, i) {
                                item.CUST = this.Cust;
                                item.CUST_DES = this.CustDes;
                                item.ACCOUNT_NO = this.BankAccount;
                            }.bind(this));
                        }

                        //if (this.JournalType.equals("01") == true &&                                                    //일반전표에서 수표증가로 저장되는 경우,
                        //    ["RcvCheckIncrease", "IssCheckIncrease"].contains(this.TabList[i]) == true) {               //전표거래처를 ACCOUNT_NO로 저장

                        //    tabData.SlipDetail.forEach(function (item, i) {
                        //        item.ACCOUNT_NO = this.Cust;
                        //    }.bind(this));
                        //}
                        ////수표감소인 경우, 전표 거래처를 저장
                        //else if (["RcvCheckDecrease", "IssCheckDecrease"].
                        //    contains(this.TabList[i]) == true) {

                        //    tabData.SlipDetail.forEach(function (item, i) {
                        //        item.CUST = this.Cust;
                        //        item.CUST_DES = this.CustDes;
                        //    }.bind(this));
                        //}

                        message.TabList.push(this.TabList[i]); // 차대변 금액 동기화는 채권/채무/수표/어음만 진행
                        message.manageNo[this.TabList[i]].InputYn = "Y";
                        message.manageNo[this.TabList[i]].GyeCode = this.CurrentManageBalance[this.TabList[i]].GyeCode;
                        message.manageNo[this.TabList[i]].Detail = tabData.SlipDetail;
                        message.manageNo[this.TabList[i]].SumAmt = this.sumAmountDto[this.TabList[i]].Amt;

						// 내자거래처인 경우 "입금보고서/지출결의서/가지급금정산서"가 AMT로 설정되어 있는데 AMT_F가 넘어가면 외자로 계산되 금액이 0 으로 반영됨
						message.manageNo[this.TabList[i]].SumAmtF = this.CustForeignFlag.equals("N") && ["BondDecrease", "DebitDecrease"].contains(this.TabList[i]) ? new Decimal(0) : this.sumAmountDto[this.TabList[i]].AmtF;

                        if (!$.isEmpty(tabData.IncreaseList)) {
                            tabData.IncreaseList.forEach(function (item, j) {
                                if (!message.manageNoIncreaseList[self.TabList[i].replace("Decrease", "Increase")].contains(item)) {
                                    message.manageNoIncreaseList[self.TabList[i].replace("Decrease", "Increase")].push(item);
                                }
                            });
                        }

                        //환율은 채권/채무일 때만 셋팅
                        if (this.TabList[i].indexOf("Bond") > -1 || this.TabList[i].indexOf("Debit") > -1) {
                            message.manageNo[this.TabList[i]].ExchangeRate = tabData.ExchangeRate;
                        }
                    }
                    else if (this.TabList[i].equals("additionalInfo")) {
                        //추가항목
                        message.dataExists = true;
                        message.additionalInfo = tabData.SlipDetail;
                    }
                    else {
                        //부가세정보
                        message.dataExists = true;
                        message.taxData = tabData.SlipDetail;
                    }
                }
            }
        }

        if (!$.isEmpty(message.allManageNoList)) {
            message.allManageNoList.remove(function (x) {
                return x.RowKey == self.rowKey;
            });
        }

        message.allManageNoList.push(message.manageNo);

        this.sendMessage(this, message);
    },

    // 탭간의 금액 다른 정보 얻기
    getInformContents: function (tabList) {
        var msg = ecount.resource.MSG07959,
			order = 0;

        tabList.forEach(function (x, i) {
            order++;
            msg += String.format("\n\n{0}. ", order.toString());

            switch (x.tabId) {
                case "BondIncrease":
                    msg += ecount.resource.LBL01784;
                    break;
                case "BondDecrease":
                    msg += ecount.resource.LBL01788;
                    break;
                case "DebitIncrease":
                    msg += ecount.resource.LBL01785;
                    break;
                case "DebitDecrease":
                    msg += ecount.resource.LBL01789;
                    break;
                case "IssCheckIncrease":
                    msg += ecount.resource.LBL13524;
                    break;
                case "IssCheckDecrease":
                    msg += ecount.resource.LBL13525;
                    break;
                case "RcvCheckIncrease":
                    msg += ecount.resource.LBL13526;
                    break;
                case "RcvCheckDecrease":
                    msg += ecount.resource.LBL13527;
                    break;
                case "IssNoteIncrease":
                    msg += ecount.resource.LBL14107;
                    break;
                case "IssNoteDecrease":
                    msg += ecount.resource.LBL14108;
                    break;
                case "RcvNoteIncrease":
                    msg += ecount.resource.LBL14100;
                    break;
                case "RcvNoteDecrease":
                    msg += ecount.resource.LBL14101;
                    break;
                case "taxInfo":
                    msg += ecount.resource.LBL13049;
                    break;
            }

            if (x.tabId.indexOf("Increase") > -1) {
                msg += String.format(" - {0}", ecount.resource.LBL13006);
            }

            if (x.tabId.indexOf("Decrease") > -1) {
                msg += String.format(" - {0}", ecount.resource.LBL08600);
            }

            if (x.foreignFlag == true) {
                msg += String.format("({0})", ecount.resource.LBL01977);
            }
        });

        return msg;
    },

    // 탭(페이지)명칭 리턴
    getPageResx: function (tabId, isDetail) {
        var title;

        switch (tabId) {
            case "additionalInfo":
                title = this.DefaultAdditionalInfo[0].ITEM_TYPE_NM;
                break;
            case "BondIncrease":
                title = ecount.resource.LBL01784;
                break;
            case "BondDecrease":
                title = ecount.resource.LBL01788;
                break;
            case "DebitIncrease":
                title = ecount.resource.LBL01785;
                break;
            case "DebitDecrease":
                title = ecount.resource.LBL01789;
                break;
            case "RcvCheckIncrease":
                title = ecount.resource.LBL13526;
                break;
            case "RcvCheckDecrease":
                title = ecount.resource.LBL13527;
                break;
            case "IssCheckIncrease":
                title = ecount.resource.LBL13524;
                break;
            case "IssCheckDecrease":
                title = ecount.resource.LBL13525;
                break;
            case "RcvNoteIncrease":
                title = ecount.resource.LBL14100;
                break;
            case "RcvNoteDecrease":
                title = ecount.resource.LBL14101;
                break;
            case "IssNoteIncrease":
                title = ecount.resource.LBL14107;
                break;
            case "IssNoteDecrease":
                title = ecount.resource.LBL14108;
                break;
            case "taxInfo":
                title = ecount.resource.LBL13049;
                break;
        }

        if (isDetail == true) {
            if (tabId.indexOf("Increase") > -1 || tabId.indexOf("Decrease") > -1) {
                if (this.CurrentManageBalance[tabId] && this.CurrentManageBalance[tabId].Detail && this.CurrentManageBalance[tabId].Detail.length > 0) {
                    title += String.format("({0})", this.CurrentManageBalance[tabId].Detail.length.toString());
                }
            }
        }

        return title;
    },

    // 탭에 포함시킬 페이지정보 셋팅하기
    getPageInfo: function (tabId) {
        var generator = widget.generator,
			page = generator.page(this.PageDict[tabId], tabId, this);

        switch (tabId) {
            case "additionalInfo":
                page.param($.extend({
                    EditFlag: this.EditFlag,
                    ItemTypeCd: this.ItemTypeCd,
                    AdditionalInfo: this.AdditionalInfo,
                    GbType: this.GbType,
                }, this.getIncludedPageDefaultParam()));
                break;
            case "BondIncrease":
            case "DebitIncrease":
            case "RcvCheckIncrease":
            case "IssCheckIncrease":
            case "RcvNoteIncrease":
            case "IssNoteIncrease":
                page.param($.extend({
                    IsFromAccount: true,
                    IsFromGeneralJournal: this.JournalType.equals("01") ? true : false,
                    CustManageNo: tabId.equals("BondIncrease") ? this.CustManageBondNo : tabId.equals("DebitIncrease") ? this.CustManageDebitNo : null,
                    EditFlag: this.EditFlag,
                    ExpDate: this.JournalType.equals("05") ? this.TrxDateSelect : this.TrxDate,
                    ManageNoIncrease: this.CurrentManageBalance[tabId],
                    IncreaseList: this.ManageNoIncreaseList[tabId] || [],
                    IdType: "I",
                    Amt: this.ExpAmt,
                    AmtF: this.ExpAmtF,
                    ExchangeRate: this.ExchangeRate,
                    CustCd: this.Cust,
                    CustForeignFlag: this.CustForeignFlag,
                    ExchangeCodeInfo: this.ExchangeCodeInfo,
                    JournalType: this.JournalType,
                }, this.getIncludedPageDefaultParam()));

                break;
            case "BondDecrease":
            case "DebitDecrease":
            case "RcvCheckDecrease":
            case "IssCheckDecrease":
            case "RcvNoteDecrease":
            case "IssNoteDecrease":
                page.param($.extend({
                    IsFromAccount: true,
                    IsFromGeneralJournal: this.JournalType.equals("01") ? true : false,
                    CustManageNo: tabId.equals("BondDecrease") ? this.CustManageBondNo : tabId.equals("DebitDecrease") ? this.CustManageDebitNo : null,
                    BaseDate: this.TrxDate,
                    CustCd: this.Cust,
                    CustForeignFlag: this.CustForeignFlag,
                    GyeCode: ["BondDecrease", "RcvCheckDecrease", "RcvNoteDecrease"].contains(tabId) ? this.CrGyeCode : this.DrGyeCode,
                    AllManageNoList: this.AllManageNoList,
                    rowKey: this.rowKey,
                    Amt: this.ExpAmt,
                    AmtF: this.ExpAmtF,
                    ExchangeCodeInfo: this.ExchangeCodeInfo,
                    TrxNo: this.TrxNo,
                    JournalType: this.JournalType,
                }, this.getIncludedPageDefaultParam()));

                break;
            case "taxInfo":
                page.param($.extend({
                    AcctFlag: this.AcctFlag,
                    BankAccount: this.BankAccount,
                    Cust: this.Cust,
                    CustDes: this.CustDes,
                    DefaultEcTaxFlag: this.DefaultEcTaxFlag,
                    EditFlag: this.EditFlag,
                    GbType: this.GbType,
                    GyeCode: this.DrGyeCode,
                    TrxDate: this.TrxDate,
                    IoType: this.IoType,
                    IoDate: this.IoDate,
                    IoCust: this.IoCust,
                    IoCustName: this.IoCustName,
                    IoCardNo: this.IoCardNo,
                    IsFromCardActivity: this.IsFromCardActivity,
                    JournalType: this.JournalType,
                    EcTaxFlag: this.EcTaxFlag,
                    TaxDeduct: this.TaxDeduct,
                    ExpAmt: this.ExpAmt,
                    ExpAmt1: this.ExpAmt1,
                    ExpAmt2: this.ExpAmt2
                    //PRETAX_AMOUNT: this.PRETAX_AMOUNT,
                    //TAX_AMOUNT: this.TAX_AMOUNT,
                    //VAT_DES: this.VAT_DES                    
                }, this.getIncludedPageDefaultParam()));
        }

        return page;
    },

    //삭제
    delete: function () {
        var self = this,
			message = this.getSendMessageDto();

        if ((this.Permission == "U" && (this.EditFlag == "M" && this.GbType.equals("Y"))) || this.Permission == "R") {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }

        ecount.confirm(String.format("{0}</br>{1}",
			ecount.resource.MSG08492,
			this.TabList.select(function (x) {
			    return String.format(" - {0} {1}", this.getPageResx(x, false), ecount.resource.LBL14521)
			}.bind(this)).join("</br>")),
			function (status) {
			    if (status) {

			        if (!$.isEmpty(message.allManageNoList)) {
			            message.allManageNoList.remove(function (x) {
			                return x.RowKey == self.rowKey;
			            });
			        }

			        self.sendMessage(self, message);
			    }
			});
    },

    //탭별삭제
    deleteByTabId: function (tabId) {
        ecount.confirm(String.format("{0}</br>{1}",
			ecount.resource.MSG08492,
			String.format(" - {0} {1}", this.getPageResx(tabId, false), ecount.resource.LBL14521)),
			function (status) {
			    if (status) {
			        // 1. 증가번호 관리 Object에서 삭제                       
			        // 2. 채권/채무/수표 증가/감소 관리 Object에서 삭제       
			        // 3. 해당 채권/채무/수표 증가/감소 관리 Object에서 삭제
			        // 4. 탭의 Navigation을 관리하는 Object정리
			        // 5. 삭제할 탭의 기존 페이지를 destroy
			        // 6. 해당 탭 명칭을 reflash
			        this.cleanRelationObjectByTabId(tabId, true);

			        // 7. 삭제할 탭의 Object를 정리한 이후, page정보를 생성
			        var reflashPage = this.getPageInfo(tabId);

			        // 8. 페이지 재호출
			        if (["RcvCheckIncrease", "RcvCheckDecrease", "IssCheckIncrease", "IssCheckDecrease"].contains(tabId) == true) {
			            this.lazyLoadPage(lazyLoadtargetTabIdByCheck, reflashPage, true, null);
			        } else {
			            this.lazyLoadPage(tabId, reflashPage, true, null);
			        }
			    }
			}.bind(this));
    },

    //탭 삭제 시, 페이지전환 시, 대상 탭에 관련된 공통 로직처리
    cleanRelationObjectByTabId: function (tabId, isDeleteDataOnly) {
        //////////////////////////////////////////////////////////
        // **증가/감소 ///////////////////////////////////////////
        //////////////////////////////////////////////////////////
        if (tabId.indexOf("Increase") > -1 || tabId.indexOf("Decrease") > -1) {
            ////////////////////////////////////////
            // 1. 증가번호 관리 Object에서 삭제 ////
            ////////////////////////////////////////

            if (['RcvCheckIncrease', 'RcvCheckDecrease'].contains(tabId) == true) {
                this.ManageNoIncreaseList['RcvCheckIncrease'].clear();
            } else {
                this.ManageNoIncreaseList['IssCheckIncrease'].clear();
            }

            //////////////////////////////////////////////////////////
            // 2. 채권/채무/수표 증가/감소 관리 Object에서 삭제 //////
            //////////////////////////////////////////////////////////
            for (var i = 0; i < this.AllManageNoList.length; i++) {
                if (this.AllManageNoList[i].RowKey == this.rowKey) {
                    this.AllManageNoList[i][tabId].InputYn = isDeleteDataOnly ? this.AllManageNoList[i][tabId].InputYn : 'N';
                    this.AllManageNoList[i][tabId].Detail = [];
                    this.AllManageNoList[i][tabId].GyeCode = isDeleteDataOnly ? this.AllManageNoList[i][tabId].GyeCode : null;
                    this.AllManageNoList[i][tabId].SumAmt = new Decimal(0);
                    this.AllManageNoList[i][tabId].SumAmtF = new Decimal(0);
                    this.AllManageNoList[i][tabId].ExchangeRate = new Decimal(0);

                    break;
                }
            }

            /////////////////////////////////////////////////////////////
            // 3. 해당 채권/채무/수표 증가/감소 관리 Object에서 삭제 ////
            /////////////////////////////////////////////////////////////
            this.CurrentManageBalance[tabId].InputYn = 'N';
            this.CurrentManageBalance[tabId].Detail = [];
            this.CurrentManageBalance[tabId].GyeCode = null;
            this.CurrentManageBalance[tabId].SumAmt = new Decimal(0);
            this.CurrentManageBalance[tabId].SumAmtF = new Decimal(0);
            this.CurrentManageBalance[tabId].ExchangeRate = new Decimal(0);

            ////////////////////////////////////////////////////////////
            // 4. 탭을 관리하는 Object인 TabList에서 대상ID를 삭제 /////
            ////////////////////////////////////////////////////////////
            //현재 처리하는 탭이 TabList에 존재하지 않으면, TabList에 과거 탭을 지우고, 현재 탭으로 할당한다. (Layer 선택시)
            //현재 처리하는 탭이 TabList에 이미 존재하면, TabList 조정을 하지 않는다. (선택삭제 시)
            if (this.TabList.indexOf(this.ActiveTab) == -1) {
                var replaceIndex = this.TabList.indexOf(tabId);
                this.TabList[replaceIndex] = this.ActiveTab;
            }

            ////////////////////////////////
            // 5. 해당페이지를 destroy /////
            ////////////////////////////////
            var removeTargetId = this.contents.getPage(tabId, tabId);
            if ($.isEmptyObject(removeTargetId) == true) {
                removeTargetId = this.contents.getPage(tabId);
            }
            removeTargetId.destroy();

            //////////////////////////////////
            // 6. 해당 탭 명칭을 reflash /////
            //////////////////////////////////
            this.contents.getTabContents().renameTab(tabId, this.getPageResx(tabId, true));
        }
            //////////////////////////////////////////////////////////
            // **추가정보/부가세정보 ///////////////////////////////////////////
            //////////////////////////////////////////////////////////
        else {
            /* 관리하는 Object정보가 다름, 추가구현 필요함 */
            if (tabId.indexOf("additionalInfo") > -1) {
                this.AdditionalInfo = {
                    ITEM1: null,
                    ITEM1_CD: null,
                    ITEM1_DES: null,
                    ITEM2: null,
                    ITEM2_CD: null,
                    ITEM2_DES: null,
                    ITEM3: null,
                    ITEM3_CD: null,
                    ITEM3_DES: null,
                    ITEM4: null,
                    ITEM5: null,
                    ITEM6: null,
                    ITEM7: null,
                    ITEM8: null
                };
            }
            else if (tabId.indexOf("taxInfo") > -1) {
                this.IoType = null,
					this.IoDate = null,
					this.IoCust = null,
					this.IoCustName = null,
					this.IoCardNo = null
            }

            this.contents.getPage(tabId, tabId).destroy();
        }
    }
});
