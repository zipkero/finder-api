window.__define_resource && __define_resource("MSG01184","LBL02214","LBL00842","LBL01324","BTN00008","MSG04748","MSG00349","MSG09273","MSG06313","MSG01022","MSG02605","MSG01946","MSG06312");
/****************************************************************************************************
1. Create Date : 2015.09.24
2. Creator     : ???
3. Description : 재고1 > 영업관리 > 판매 > 판매조회 > (전표일자클릭)판매수정 > 일자. Fn 클릭. 
4. Precaution  :
5. History     : 
            20xx.xx.xx 생성
            2016.03.28 (seongjun-Joe) 소스리팩토링. 
            2018.12.06 (LOC) : Change Date Time Sheet (NF 3.0)
            2019.07.19 (PhiTa) A18_00268 - 재고 회계반영일자 과거 1년 / 미래 1년으로 제한하기
            2019.10.24(tuan) Change date for ReAssignment Input
			2020.02.05(양미진) - dev 36379 A20_00453 근무기록 일자변경시 시리얼 API 호출하는 로직 제거
            2020.02.10 (이은총) A19_04061 위젯 옵션 삭제에 따른 페이지 수정 요청
6. Old File    :                   
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ES_DATE_CH", {

    pageID: null,


    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/


    off_key_esc: true,
    saveComplete: true,


    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.saveComplete = true; // 연속클릭 막기

        var thisObj = this;
        this.saveFunc = {};
        //ERPProgramId.Manage.ReassignmentInput, E020721
        this.saveFunc["E020721"] = function () {
            var saveBtn = this.footer.getControl("Save");
            var ctrnewdate = this.contents.getControl("NEW_DATE", "details");
            var formData = {
                PRG_ID: "E020721",
                IO_DATE: this.IO_DATE,
                IO_NO: this.IO_NO,
                NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
                CheckPermissionRequest: this.CheckPermissionRequest
            };
            ecount.common.api({
                url: "/Inventory/Common/UpdateChangedDateInInventory",
                data: Object.toJSON(formData),
                success: function (result) {
                    console.log(result);
                    if (result.Status != "200") {
                        saveBtn.setAllowClick();
                        ecount.alert(result.fullErorMsg);
                        thisObj.saveComplete = true;
                    }
                    else {
                        thisObj.saveComplete = true;
                    }
                    ecount.alert(ecount.resource.MSG01184, function () {
                        var message = {
                            data: result.Data,
                            callback: thisObj.close.bind(thisObj)
                        };
                        thisObj.sendMessage(thisObj, message);
                    });
                }.bind(this),
                error: thisObj.apiErrorMessage.bind(this)
            });
        }.bind(this);
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
        // header.setTitle(this.viewBag.Title);
        header.setTitle(ecount.resource.LBL02214);
    },

    onInitContents: function (contents) {
        //위젯 인스턴스 생성
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control();
        var thisRoot = this;
        var form1 = generator.form();
        form1.template("register");
        form1.add(ctrl.define("widget.date.label", "lblCurrentDate", "lblCurrentDate", ecount.resource.LBL00842).select(this.IO_DATE).end());
        form1.add(ctrl.define("widget.date", "NEW_DATE", "NEW_DATE", ecount.resource.LBL01324)
            .setOptions({
                errorContainer: "bottom"
            })
            .end());

        //폼추가
        contents
            .add(form1);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.LBL02214).clickOnce())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
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

    onFocusOutHandler: function (event) {
        this.footer.getControl("Save").setFocus(0);
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

    //닫기버튼
    onFooterClose: function () { 
        this.close();
    },
    //저장
    onFooterSave: function (e) {
        var thisObj = this;
        var date = new Date();
        var ctrnewdate = this.contents.getControl("NEW_DATE", "details");
        var saveBtn = this.footer.getControl("Save");
        //this.saveComplete = false; // 연속클릭 막기

        if (!this.saveComplete) {
            saveBtn.setAllowClick();
            return false;

        }

        //입력가능 연도 자체 내장되있음.오류 상태면 return false
        if (ctrnewdate.validate().length > 0) {
            saveBtn.setAllowClick();
            this.saveComplete = true;
            return false;
        }
        //var yyyy = Date.format("yyyy", ctrnewdate.getDate());
        //if ('1900' > yyyy || (date.getFullYear() + 1 < yyyy) || (yyyy.length != 4)) {
        //    // 입력할수 없는 년도 입니다.\n년도를 다시 입력 바랍니다.  
        //    ctrnewdate.showError(ecount.resource.MSG04748);
        //    ctrnewdate.setFocus(2);
        //    return false;
        //}

        if (this.IO_DATE == Date.format("yyyyMMdd", ctrnewdate.getDate()[0])) {
            //기존일자와 변경일자가 동일합니다.\n\n변경일자를 확인 바랍니다.
            saveBtn.setAllowClick();
            ctrnewdate.showError(ecount.resource.MSG00349);
            ctrnewdate.setFocus(2);
            this.saveComplete = true;
            return false;
        }
        if (Date.format("yyyyMMdd", ctrnewdate.getDate()[0]) < this.viewBag.CheckStockDate) {
            saveBtn.setAllowClick();
            thisObj.resizeLayer((650 < ecount.infra.getPageWidthFromConfig()) ? ecount.infra.getPageWidthFromConfig() : 650, 300);
            ctrnewdate.showError(this.viewBag.MsgCheckStockDate);
            ctrnewdate.setFocus(2);
            this.saveComplete = true;
            return false;
        }

        if (!$.isEmpty(this.TRX_DATE))
        {
            var new_date = parseInt(Date.format("yyyy", ctrnewdate.getDate()[0]));
            var _trx_date = parseInt(this.TRX_DATE.substr(0, 4));
            if (Math.abs(new_date - _trx_date) > 1) {
                saveBtn.setAllowClick();
                ctrnewdate.showError(ecount.resource.MSG09273);
                ctrnewdate.setFocus(2);
                this.saveComplete = true;
                return false;
            }
        }
        if (this.saveFunc && this.saveFunc[this.PRG_ID]) {
            return this.saveFunc[this.PRG_ID]();
        }
        
        //실사일때는 간편조정입력과 중복인지 체크를 해야함
        if (this.FORM_TYPE == "SF710") {
            var _self = this;
            _self.saveComplete = false; // 연속클릭 막기
            if (this.ADJ_FLAG == "3") {
                this.isCheckSale300(function (result) {
                    if (result == false) {
                        ecount.alert(String.format(ecount.resource.MSG06313, "", ""), function (status) {
                            _self.contents.getControl("NEW_DATE", "details").setFocusToSDate();
                        });

                    } else {

                        var formData;

                        formData = {
                            IO_DATE: this.IO_DATE,
                            IO_NO: this.IO_NO,
                            IO_TYPE: this.IO_TYPE,
                            FORM_TYPE2: this.FORM_TYPE2,
                            GUBUN: this.GUBUN,
                            SEQ_NO: this.SEQ_NO,
                            SLIP_FLAG: this.SLIP_FLAG,
                            SLIP_TYPE: this.SLIP_TYPE,
                            FORM_TYPE: this.FORM_TYPE,
                            WIO_TYPE: this.WIO_TYPE,
                            WIO_DATE: this.WIO_DATE,
                            WIO_NO: this.WIO_NO,
                            EDMS_DATE: this.EDMS_DATE,
                            EDMS_NO: this.EDMS_NO,
                            NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
                            GB_TYPE: this.GB_TYPE,
                            CHANGE_FLAG: this.CHANGE_FLAG,
                            SEARCH_FLAG: this.SEARCH_FLAG,
                            SLIP_STATUS: this.SLIP_STATUS,
                            CheckPermissionRequest: this.CheckPermissionRequest,
                            isShowMenuPath: "Y"
                        };
                        formData = this.addCheckRightSlipInfo(formData);
                        formData.FROM_HID = this.FROM_HID,
                            formData.TO_HID = this.TO_HID,
                            formData.HID = this.HID;
                        ecount.common.api({
                            url: "/Inventory/Common/UpdateChangedDateInInventory",
                            data: Object.toJSON(formData),
                            success: function (result) {
                                console.log(result);
                                if (result.Status != "200") {
                                    saveBtn.setAllowClick();
                                    runSuccessFunc = result.Status == "202";
                                    ecount.alert(result.fullErrorMsg);
                                    this.saveComplete = true;
                                }
                                else {
                                    runSuccessFunc = true;
                                    this.saveComplete = true;
                                    if (result.Data.ERRFLAG == "Y") {
                                        saveBtn.setAllowClick();
                                        ecount.alert(ecount.resource.MSG01022);
                                        return;
                                    }
                                    else if (result.Data.ERRFLAG == "Z") {
                                        saveBtn.setAllowClick();
                                        ecount.alert(ecount.resource.MSG02605);
                                    }
                                    else if (result.Data.ERRFLAG == "X") {
                                        saveBtn.setAllowClick();
                                        ecount.alert(ecount.resource.MSG01946);
                                    }
                                    else {
                                        this.checkBalanceForSerial(result, function () {
                                            //부모창에 값 던짐
                                            ecount.alert(ecount.resource.MSG01184, function () {
                                                var message = {
                                                    data: result.Data,
                                                    callback: thisObj.close.bind(thisObj)
                                                };
                                                thisObj.sendMessage(thisObj, message);
                                            });
                                        });
                                    }
                                }
                            }.bind(this),
                            error: thisObj.apiErrorMessage.bind(this)
                        });

                    }
                }.bind(this));
            } else {
                this.isCheckStockAdjust(function (result) {
                    if (result == false) {
                        ecount.alert(String.format(ecount.resource.MSG06312, "", ""), function (status) {
                            thisObj.contents.getControl("NEW_DATE", "details").setFocusToSDate();
                            this.saveComplete = true;
                        });

                    } else {

                        var formData;

                        formData = {
                            IO_DATE: this.IO_DATE,
                            IO_NO: this.IO_NO,
                            IO_TYPE: this.IO_TYPE,
                            FORM_TYPE2: this.FORM_TYPE2,
                            GUBUN: this.GUBUN,
                            SEQ_NO: this.SEQ_NO,
                            SLIP_FLAG: this.SLIP_FLAG,
                            SLIP_TYPE: this.SLIP_TYPE,
                            FORM_TYPE: this.FORM_TYPE,
                            WIO_TYPE: this.WIO_TYPE,
                            WIO_DATE: this.WIO_DATE,
                            WIO_NO: this.WIO_NO,
                            EDMS_DATE: this.EDMS_DATE,
                            EDMS_NO: this.EDMS_NO,
                            NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
                            GB_TYPE: this.GB_TYPE,
                            CHANGE_FLAG: this.CHANGE_FLAG,
                            SEARCH_FLAG: this.SEARCH_FLAG,
                            SLIP_STATUS: this.SLIP_STATUS,
                            CheckPermissionRequest: this.CheckPermissionRequest
                        }
                        formData = this.addCheckRightSlipInfo(formData);
                        formData.FROM_HID = this.FROM_HID,
                            formData.TO_HID = this.TO_HID,
                            formData.HID = this.HID;

                        ecount.common.api({
                            url: "/Inventory/Common/UpdateChangedDateInInventory",
                            data: Object.toJSON(formData),
                            success: function (result) {
                                console.log(result);
                                if (result.Status != "200") {
                                    saveBtn.setAllowClick();
                                    runSuccessFunc = result.Status == "202";
                                    ecount.alert(result.fullErrorMsg);
                                    thisObj.saveComplete = true;
                                }
                                else {
                                    thisObj.saveComplete = true;
                                    runSuccessFunc = true;
                                    if (result.Data.ERRFLAG == "Y") {
                                        saveBtn.setAllowClick();
                                        ecount.alert(ecount.resource.MSG01022);
                                        return;
                                    }
                                    else if (result.Data.ERRFLAG == "Z") {
                                        saveBtn.setAllowClick();
                                        ecount.alert(ecount.resource.MSG02605);
                                    }
                                    else if (result.Data.ERRFLAG == "X") {
                                        saveBtn.setAllowClick();
                                        ecount.alert(ecount.resource.MSG01946);
                                    }
                                    else {
                                        this.checkBalanceForSerial(result, function () {
                                            //부모창에 값 던짐
                                            ecount.alert(ecount.resource.MSG01184, function () {
                                                var message = {
                                                    data: result.Data,
                                                    callback: thisObj.close.bind(thisObj)
                                                };
                                                thisObj.sendMessage(thisObj, message);
                                            });
                                        });
                                    }
                                }
                            }.bind(this),
                            error: thisObj.apiErrorMessage.bind(this)
                        });

                    }
                }.bind(this));
            }

        } else {
            thisObj.saveComplete = false; // 연속클릭 막기
            var formData;
            //if (this.GUBUN == "ESQ104M.aspx") {
            //    formData = {
            //        IO_DATE: this.IO_DATE,
            //        IO_NO: this.IO_NO,
            //        IO_TYPE: this.IO_TYPE,
            //        GUBUN: this.GUBUN,
            //        SLIP_FLAG: this.SLIP_FLAG,
            //        SLIP_TYPE: this.SLIP_TYPE,
            //        FORM_TYPE: this.FORM_TYPE,
            //        WIO_TYPE: this.WIO_TYPE,
            //        WIO_DATE: this.WIO_DATE,
            //        WIO_NO: this.WIO_NO,
            //        NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
            //    }
            //} else
            if (this.GUBUN == "CM") {
                formData = {
                    IO_DATE: this.IO_DATE,
                    IO_NO: this.IO_NO,
                    IO_TYPE: this.IO_TYPE,
                    GUBUN: this.GUBUN,
                    SEQ_NO: this.SEQ_NO,
                    SLIP_FLAG: this.SLIP_FLAG,
                    SLIP_TYPE: this.SLIP_TYPE,
                    FORM_TYPE: this.FORM_TYPE,
                    WIO_TYPE: this.WIO_TYPE,
                    WIO_DATE: this.WIO_DATE,
                    WIO_NO: this.WIO_NO,
                    LinkedPrgID: this.LinkedPrgID,
                    NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
                    CheckPermissionRequest: this.CheckPermissionRequest

                }
            } else {
                formData = {
                    IO_DATE: this.IO_DATE,
                    IO_NO: this.IO_NO,
                    IO_TYPE: this.IO_TYPE,
                    FORM_TYPE2: this.FORM_TYPE2,
                    GUBUN: this.GUBUN,
                    SEQ_NO: this.SEQ_NO,
                    SLIP_FLAG: this.SLIP_FLAG,
                    SLIP_TYPE: this.SLIP_TYPE,
                    FORM_TYPE: this.FORM_TYPE,
                    WIO_TYPE: this.WIO_TYPE,
                    WIO_DATE: this.WIO_DATE,
                    WIO_NO: this.WIO_NO,
                    LinkedPrgID: this.LinkedPrgID,
                    EDMS_DATE: this.EDMS_DATE,
                    EDMS_NO: this.EDMS_NO,
                    NEW_DATE: Date.format("yyyyMMdd", ctrnewdate.getDate()[0]),
                    GB_TYPE: this.GB_TYPE,
                    CHANGE_FLAG: this.CHANGE_FLAG,
                    SEARCH_FLAG: this.SEARCH_FLAG,
                    SLIP_STATUS: this.SLIP_STATUS,
                    CheckPermissionRequest: this.CheckPermissionRequest
                }
                // 생산입고II 불량 링크를 통해 진행되는 경우 구분자 ygh
                if (this.FORM_TYPE == "SF500" && this.QC_YN != null && this.QC_YN != "") {
                    formData.QC_YN = this.QC_YN;
                    formData.PRE_IO_DATE = this.PRE_IO_DATE;
                    formData.PRE_IO_NO = this.PRE_IO_NO;
                }
            }
            formData = this.addCheckRightSlipInfo(formData);

            formData.FROM_HID = this.FROM_HID;
            formData.TO_HID = this.TO_HID;
            formData.HID = this.HID;
            if (["SF650", "SF690"].contains(this.FORM_TYPE)) {
                formData.WMS_ID = this.WMS_ID || "";
            }
            formData.BIZZ_CLAS_CDS = this.BIZZ_CLAS_CDS;


            var urlUpdate = "/Inventory/Common/UpdateChangedDateInInventory"

            // PI620
            if (["PI620", "PI720"].contains(this.FORM_TYPE)) {
                urlUpdate = "/SVC/Manage/Attendance/ChangeDatePsatDailyWorkRecordUnty"
                formData = {
                    Request: {
                        Data: {
                            SLIP_DATE: formData.IO_DATE,
                            SLIP_NO: formData.IO_NO,
                            SLIP_DATE_NEW: formData.NEW_DATE,
                            SLIP_NO_NEW: 0,
                            SAL_TYPE_CD: this.SAL_TYPE_CD
                        },
                        CheckPermissionRequest: this.CheckPermissionRequest
                    }
                }
            }

            ecount.common.api({
                url: urlUpdate,
                data: Object.toJSON(formData),
                success: function (result) {
                    console.log(result);
                    if (result.Status != "200") {
                        saveBtn.setAllowClick();
                        runSuccessFunc = result.Status == "202";
                        ecount.alert(result.fullErorMsg);
                        thisObj.saveComplete = true;
                    }
                    else {
                        thisObj.saveComplete = true;
                        runSuccessFunc = true;
                        if (result.Data.ERRFLAG == "Y") {
                            saveBtn.setAllowClick();
                            ecount.alert(ecount.resource.MSG01022);
                            return;
                        }
                        else if (result.Data.ERRFLAG == "Z") {
                            saveBtn.setAllowClick();
                            ecount.alert(ecount.resource.MSG02605);
                        }
                        else if (result.Data.ERRFLAG == "X") {
                            saveBtn.setAllowClick();
                            ecount.alert(ecount.resource.MSG01946);
                        }
                        else if (result.Data.ERRFLAG == "W") {
                            ecount.alert(ecount.resource.MSG01184, function () {
                                var message = {
                                    data: result.Data,
                                    callback: thisObj.close.bind(thisObj)
                                };
                                thisObj.sendMessage(thisObj, message);
                            });
                        }
						else {
							if (!$.isEmpty(this.FORM_TYPE) && this.FORM_TYPE.substr(0, 2) == "PI") {
								ecount.alert(ecount.resource.MSG01184, function () {
									var message = {
										data: result.Data,
										callback: thisObj.close.bind(thisObj)
									};
									thisObj.sendMessage(thisObj, message);
								});
							} else {
								this.checkBalanceForSerial(result, function () {
									//부모창에 값 던짐
									ecount.alert(ecount.resource.MSG01184, function () {
										var message = {
											data: result.Data,
											callback: thisObj.close.bind(thisObj)
										};
										thisObj.sendMessage(thisObj, message);
									});
								});
							}                            
                        }
                    }
                }.bind(this),
                error: thisObj.apiErrorMessage.bind(this)
            });
        }
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    checkBalanceForSerial: function (result, callback) { /*시리얼 최종수정일 업데이트*/

        var data = {
            IO_DATE: (result.Data.R_NEW_DATE || ""),
            IO_NO: (result.Data.R_NEW_IO_NO || 0),
            IO_TYPE: this.IO_TYPE
        };

        ecount.common.api({
            url: "/Inventory/Serial/GetLoadSerialOnTheSlip",
            data: data,
            success: function (result) {
                var returnData = result.Data;
                callback && callback();
            }
        });

    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    //조정전표2(간편조정) 중복 확인
    isCheckStockAdjust: function (callBack) {
        var data = {
            Request: {
                Data: {
                    IO_DATE: Date.format("yyyyMMdd", this.contents.getControl("NEW_DATE", "details").getDate()[0])
                }
            }
        };

        ecount.common.api({
            url: "/SVC/Inventory/InventoryAdjust/CheckStockAdjustForInventoryCount",
            data: data,
            success: function (result) {
                var returnData = result.Data;
                callBack && callBack(returnData);
            }
        });
    },

    //조정전표1(실사조정) 중복 확인
    isCheckSale300: function (callBack) {
        var data = {
            Request: {
                Data: {
                    IO_DATE: Date.format("yyyyMMdd", this.contents.getControl("NEW_DATE", "details").getDate()[0])
                }
            }
        };

        ecount.common.api({
            url: "/SVC/Inventory/InventoryAdjust/CheckSale300ForNewInvAdjustment",
            data: data,
            success: function (result) {
                var returnData = result.Data;
                callBack && callBack(returnData);
            }
        });
    },
    addCheckRightSlipInfo: function (param) {
        param.CheckRightSlipInfo = this.CheckRightSlipInfo;
        return param;
    },

    apiErrorMessage: function (jqXHR, Status, Error) {
        if (ecount.error) {

            var messageDetail = Error.MessageDetail;
            Error.MessageDetail = '';

            if (!$.isEmpty(messageDetail)) {
                //switch (messageDetail) {
                //    case 'IsBondDebitSlipNo':
                //        this.pageOption.isAcemErrFlag = false;
                //        this.pageOption.IsInvoicing = true;
                //        if (ecount.config.inventory.USE_BALANCE_BASIS == false && this.pageHidden.Gflag == "G")
                //            this.pageHidden.Gflag = "";
                //        break;
                //}
            }
            
            if (Error.Message) {
                ecount.error(Error.Message, {
                    title: 'System Error ' + Status,
                    trace: Error.MessageDetail
                });
            }
        } else {
            ecount.alert(Error.Message);
        }

        this.saveComplete = true;
        this.footer.getControl("Save") && this.footer.getControl("Save").setAllowClick();
    }

});