window.__define_resource && __define_resource("LBL00043","LBL08886","LBL00045","LBL02441","LBL00055","BTN00044","LBL30290","LBL19772","LBL00048","MSG02586","MSG08963","BTN00427","MSG02587","MSG04685","LBL02274","MSG00643","LBL00115","MSG03928","MSG04792","MSG04793","MSG02474","MSG70756","MSG10273","LBL19481","MSG01089","BTN00332","BTN00276","BTN00033","BTN00026","BTN00133","LBL02485","LBL01326","MSG00226","MSG00225","MSG01352","MSG01353","MSG00564","MSG09734","MSG00295");
/****************************************************************************************************
1. Create Date : 2015.09.24
2. Creator     : 강성훈
3. Description : 재고 > 기초등록 > 전체 삭제
4. Precaution  :
5. History     :
            2015.09.03 (BSY) : 코드 리펙토링
            2016.03.28 (seongjun-Joe) 소스리팩토링.
            2017.08.22 (Soojin-Lee) : GMC API 추가, 계좌CMS EB13, EI13 삭제 추가
            2018.04.25 (임태규) : 품목전체삭제 타임아웃 방지를 위해서, SALE003의 전체 삭제를 API호출을 해당 페이지에서 하도록 변경
            2018.08.24 (Kim Woojeong) : INSA001 추가
            2018.12.24 (Phi Vo): A18_04081 modify logic method DeleteAll case TABLE equal SALE005
            2019.02.18 (Lap) : Process for close popup
            2019.04.08 (문요한) : 마리아 DB동기화 작업 - 거래처
            2019.05.10 (문요한) : 마리아 DB동기화 작업 - BOM
            2019.12.24(hrkim): 데이터 관리
            2020.06.08 (tuan) Authorization PreJob - A20_01930_Auth_Account01
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM021P", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    randomStr: null,
    arrAnsi: null,
    arrAnsiRoom: null,
    arrAscCharNum: null,
    arrFormTags: "",
    intClickCnt: 0,
    //api 호출 변수
    DeleteParam: null,
    GmcTables: null,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this.initProperties();
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.randomStr = {
            WordRangr: "",
            iMinWordLen: 5,
            iMaxWordLen: 5,
            RanString: ""
        };

        this.arrAnsi = new Array();          // 사용할 문자열 범위를 담고있는 2차원배열
        this.arrAnsiRoom = new Array();      // 사용할 문자열 범위를 담고있는 1차원배열
        this.arrAscCharNum = new Array();    // 사용할 문자열 범위를 담고있는 1차원배열

        //api 호출 변수
        this.DeleteParam = {
            OLD_DES: "",
            FILE_DEL: "",
            ZT_CODE: this.ZT_CODE
        };

        GmcTables = ['CMS100', 'ACC001_CMS']; // 저장할 때 GMC API를 타게 하기 위해서 FORM TYPE 추가
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

    onInitHeader: function (header, resource) {
        var Title = "";
        if (this.DELFLAG == "Y") {
            Title = ecount.resource.LBL00043;
        }
        else if (this.MODFLAG == "Y") {
            Title = ecount.resource.LBL08886;
        }
        else {
            if (this.TABLES == "ACC102" || this.TABLES == "ACC001") {
                Title = ecount.resource.LBL00045;
            }
            else if (this.TABLES == "ACC001_PHASE") {
                Title = ecount.resource.LBL02441
            }
            else if (this.TABLES == "ACC002_DELETE_INSERT") {
                Title = ecount.resource.LBL00055
            }
            else if (this.TABLES == "CMS100") {
                Title = "Delete New/Cancel File";
            }
            else if (this.TABLES == "ACC001_CMS") {
                Title = "Delete CMS Request";
            } else if (this.TABLES == "SCHEDULE") {
                Title = ecount.resource.LBL00043;
            }
            else if (this.TABLES == "OFFICE_EQUIPMENT") {
                Title = ecount.resource.LBL00043;
            }
            else if (this.TABLES == "COM051") {
                Title = ecount.resource.BTN00044;
            }
            else if (this.TABLES == "WMS_LOADINV") {
                Title = ecount.resource.LBL30290;
            }
            else if (this.TABLES == "WMS_RESET") {
                Title = ecount.resource.LBL19772;
            }
            else {
                Title = ecount.resource.LBL00048;
            }
        }
        header.notUsedBookmark();
        header.setTitle(Title);
    },

    onInitContents: function (contents, resource) {
        ctrl = widget.generator.control();
        var toolbar1 = widget.generator.toolbar();
        var toolbar2 = widget.generator.toolbar();
        var toolbar3 = widget.generator.toolbar();
        var toolbar4 = widget.generator.toolbar();
        var toolbar5 = widget.generator.toolbar();

        if (this.DELFLAG == "Y") {
            toolbar1.addLeft(ctrl.define("widget.label", "MSG02586").label(ecount.resource.MSG02586).useHTML());            
          //  toolbar2.addLeft(ctrl.define("widget.label", "MSG08963").label(String.format(ecount.resource.MSG08963, ecount.resource.BTN00427)).useHTML());            
            toolbar3.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG02587).useHTML());
        }
        else if (this.MODFLAG == "Y") {
            toolbar1.addLeft(ctrl.define("widget.label", "MSG04685").label(ecount.resource.MSG04685).useHTML());
        }
        else {
            if (this.TABLES == "ACC102") {
                toolbar1.addLeft(ctrl.define("widget.label", "LBL02274").label(String.format(ecount.resource.LBL02274, this.OLD_SITE, this.NEW_SITE)).useHTML());
                toolbar2.addLeft(ctrl.define("widget.label", "MSG00643").label(ecount.resource.MSG00643).useHTML());
                toolbar3.addLeft(ctrl.define("widget.label", "LBL00115").label(ecount.resource.LBL00115).useHTML());
                toolbar4.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG02587).useHTML());
            }
            else if (this.TABLES == "ACC001") {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG03928").label(String.format(ecount.resource.MSG03928, this.OLD_SITE, this.NEW_SITE)).useHTML());
                toolbar2.addLeft(ctrl.define("widget.label", "MSG00643").label(ecount.resource.MSG00643).useHTML());
                toolbar3.addLeft(ctrl.define("widget.label", "LBL00115").label(ecount.resource.LBL00115).useHTML());
                toolbar4.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG02587).useHTML());
            }
            else if (this.TABLES == "ACC001_PHASE") {
                if (this.stateCode == "KR") {
                    toolbar1.addLeft(ctrl.define("widget.label", "MSG04792").label(ecount.resource.MSG04792).useHTML());
                } else {
                    toolbar1.addLeft(ctrl.define("widget.label", "MSG04793").label(ecount.resource.MSG04793).useHTML());
                }
            } else if (this.TABLES == "ACC002_DELETE_INSERT") {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG02474").label(ecount.resource.MSG02474).useHTML());
                toolbar2.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG02587).useHTML());
            } else if (this.TABLES == "CMS100") {
                toolbar1.addLeft(ctrl.define("widget.label", "CMS100_LABEL")
                    .label("Delete Selected New/Cancel File.<br/>The data cannot be restored once deleted.<br/>Data will be deleted if you enter text below for confirmation.<br/>The Captcha is case sensitive.").useHTML());
            } else if (this.TABLES == "ACC001_CMS") {
                toolbar1.addLeft(ctrl.define("widget.label", "ACC001_CMS_LABEL")
                    .label("Delete Selected CMS Request.<br/>The data cannot be restored once deleted.<br/>Data will be deleted if you enter text below for confirmation.<br/>The Captcha is case sensitive.").useHTML());
            } else if (this.TABLES == "SCHEDULE") {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG02586").label(ecount.resource.MSG02586).useHTML());
                toolbar2.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG02587).useHTML());
            }
            else if (this.TABLES == "OFFICE_EQUIPMENT") {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG02586").label(ecount.resource.MSG02586).useHTML());
                toolbar2.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG02587).useHTML());
            }
            else if (this.TABLES == "COM051") {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG70756").label(ecount.resource.MSG70756).useHTML()); // 리소스 추가해야함..
                toolbar2.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG02587).useHTML()); // 대소문자를 구분해서 입력 바랍니다.
            }
            else if (this.TABLES == "WMS_LOADINV") {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG70756").label(ecount.resource.MSG10273).useHTML()); 
                toolbar2.addLeft(ctrl.define("widget.label", "MSG02587").label(ecount.resource.MSG04685).useHTML()); 
            }
            else if (this.TABLES == "WMS_RESET") {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG02586").label(ecount.resource.MSG02586).useHTML());
                toolbar2.addLeft(ctrl.define("widget.label", "MSG08963").label(String.format(ecount.resource.MSG08963, ecount.resource.LBL19481)).useHTML());
            }
            else {
                toolbar1.addLeft(ctrl.define("widget.label", "MSG01089").label(ecount.resource.MSG01089).useHTML());
            }
        }
        toolbar5
            .addLeft(ctrl.define("widget.label", "random_text", "random_text").label(""))
            .addLeft(ctrl.define("widget.input", "DES", "DES").maxLength(6))
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00332).css("btn btn-default btn-sm"));

        contents.add(toolbar1).add(toolbar2).add(toolbar3).add(toolbar4).add(toolbar5);

        // api 주소 정의
        switch (this.TABLES) {
            case "SITE_PJT":
                this.DeleteApiUrl = "/SVC/Account/Basic/DeleteBasicSitePjt";
                break;
            //case "SALE003":
            //    this.DeleteApiUrl = "/SVC/Inventory/Basic/DeleteBasicProd";
            //    break;
            case "SALE001":
                this.DeleteApiUrl = "/SVC/Inventory/Basic/DeleteSale001Location";
                break;
            case "SALE004":
                this.DeleteApiUrl = "/Inventory/Basic/DeleteAllPriceLevelItemSale004";
                break;
            case "SALE009":
                this.DeleteApiUrl = "/Inventory/Basic/DeleteAllMgmtFieldSale009";
                break;
            case "SALE004_G":
                this.DeleteApiUrl = "/Inventory/Basic/DeleteAllPriceLevelSale004G";
                break;
            case "SALE007":
                this.DeleteApiUrl = "/Inventory/Basic/DeleteAllPriceLevelByGroupSale007";
                break;
            case "SALE005":
                this.DeleteApiUrl = "/SVC/Inventory/Basic/DeleteAllBomDesignSale005";
                break;
            case "CUST":
                this.DeleteApiUrl = "/SVC/Account/Basic/CustAllDeleteList";       
                break;
            case "STET_OM_ERP_PROD_MAPPING":
                this.DeleteApiUrl = "/Inventory/OpenMarket/DeleteStetOmErpProdMappingByTotal";
                break;
            case "STET_OM_CD":
                this.DeleteApiUrl = "/Inventory/OpenMarket/DeleteTotalStetOmCdDeliveryMapping";
                break;
            case "SERVICECODE":
                this.DeleteApiUrl = "/Account/ServiceMgmt/DeleteALLServiceCode";
                break;
            case "SFSC_BKTX_CUST":
                this.DeleteApiUrl = "/Account/Others/DeleteALLSfscBktxCust";
                break;
            case "ACC001_PHASE":
                this.DeleteApiUrl = "/SelfCustomize/Info/DeleteAccountingPeriod";
                break;
            case "ACC002":
                this.DeleteApiUrl = "/Account/Basic/DeleteAllAcc002";
                break;
            case "ACC002_DELETE_INSERT":
                this.DeleteApiUrl = "/Account/Basic/DeleteInsertAcc002";
                break;
            case "CMS100":
                this.DeleteApiUrl = "/Admin/BankAccountCMS/DeleteCMS";
                break;
            case "ACC001_CMS":
                this.DeleteApiUrl = "/Admin/BankAccountCMS/DeleteAcc001CMS";
                break;
            case "INSA002":
                this.DeleteApiUrl = "/TaxOthers/Basic/DeleteAllInsa002";
                break;
            case "INSA001":
                this.DeleteApiUrl = "/SVC/Manage/Employee/DeleteAllInsa001";
                break;
            case "COM051": // 수신웹메일 취소요청
                this.DeleteApiUrl = "/Service/CustomerCenter/UpdateCom051ForReceiveEmail";
                break;
            case "STWMSACCSELECT":
                this.DeleteApiUrl = "/SVC/Inventory/Wms/DeleteWMSAccount";
                break;

        }

        if ($.isNull(this.SEARCHTEXT))
            this.SEARCHTEXT = "";
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        var isDelete = ["ACC001_PHASE", "SCHEDULE", "OFFICE_EQUIPMENT"];

        if (this.MODFLAG == "Y")
            toolbar.addLeft(ctrl.define("widget.button", "Confirm").label(GmcTables.contains(this.TABLES) ? 'Delete' : ecount.resource.BTN00276).clickOnce());
        else if (this.TABLES == "COM051") {
            toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00033).clickOnce());
        }
        else
            toolbar.addLeft(ctrl.define("widget.button", "Save").label(GmcTables.contains(this.TABLES) ? 'Delete' : (this.DELFLAG == "Y" || isDelete.contains(this.TABLES)) ? ecount.resource.BTN00033 : ecount.resource.BTN00026).clickOnce()); // 삭제 : 변경

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(GmcTables.contains(this.TABLES) ? 'Cancel' : ecount.resource.BTN00133));
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadComplete: function (event) {
        this.arrAnsi = {
            arrAnsi: [48, 57],
            arrAnsi: [65, 90],
            arrAnsi: [97, 122]
        };

        this.arrAnsi = {
            arrAnsi: [
                { min: 48, max: 57 },
                { min: 65, max: 90 },
                { min: 97, max: 122 }
            ]
        };

        this.arrFormTags = "input|textarea|select|span";
        this.fnAnsiChar();
        this.fnMakeCharNum();
        this.setrandomText();
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onGridRenderComplete: function (e, data, grid) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    // 문구 새로고침
    onContentsApply: function () {
        this.setrandomText();
    },

    //삭제
    onFooterSave: function () {
        var self = this;
        var btn = null;

        if (self.MODFLAG == "Y") {
            btn = self.footer.get(0).getControl("Confirm");
        } else {
            btn = self.footer.get(0).getControl("Save");
        }

        if (this.intClickCnt == 0) {
            $.extend(this.DeleteParam, this.DeleteParam, this.viewBag.DefaultOption);
            if (this.DELFLAG == "Y") {
                if (this.DEL_TYPE == "Y") {
                    this.DeleteParam.OLD_DES = ecount.resource.LBL02485;
                }
                else if (this.TABLES == "ACC102" || this.TABLES == "ACC001") {
                    this.DeleteParam.OLD_DES = ecount.resource.LBL01326;
                }
                else {
                    this.DeleteParam.OLD_DES = ecount.resource.LBL01326;// 리소스 요청 중 (마스터변경 원상복구불가)
                }
            }

            if (this.TABLES == "SALE003" || this.TABLES == "CUST") {
                this.DeleteParam.FILE_DEL = "Y";
            }

            var msg = this.randomStr.RanString;

            if ($.isEmpty(this.contents.getControl("DES").getValue())) {
                ecount.alert(ecount.resource.MSG00226, {
                    width: 120, height: 100
                    , callback: function () {
                        self.setFocusDes(self);
                    }
                });

                btn.setAllowClick();
                return false;
            }

            if (this.contents.getControl("DES").getValue() != msg.trim()) {
                ecount.alert(ecount.resource.MSG00225, {
                    width: 250, height: 100
                    , callback: function () {
                        self.setValueFocusDes(self);
                    }
                });

                btn.setAllowClick();
                return false;
            }

            // Processing for delete all schedule
            // 조회메뉴 전체삭제 추가 (BatchSearchDelete) by inhan
            if (["SCHEDULE", "OFFICE_EQUIPMENT", "BatchSearchDelete"].contains(this.TABLES)) {
                this.sendMessage(this, {
                    callback: this.close.bind(this)
                });
                btn.setAllowClick();
                return false;
            }

            if (this.MODFLAG === "Y") {
                //추후 다시 확인
            }
            else {
                if (this.DEL_TYPE === "" && this.TABLES === "ACC001") {
                    if (this.viewBag.Permission.UserPermitDat) {
                        ecount.confirm(ecount.resource.MSG01352, function (status) {
                            if (status === true) {
                                self.intClickCnt++;
                            } else {
                                btn.setAllowClick();
                                return false;
                            }
                        });
                    }
                    else {
                        ecount.alert(ecount.resource.MSG01353);
                        btn.setAllowClick();
                        return false;
                    }
                }
                else {
                    var formData;
                    if (this.TABLES == "CUST") {
                        //New Version : Search  (Ex:CUST, SALE003)
                      //  formData = Object.toJSON({ Request: { Data: this.DeleteParam.DeleteCodesDto } });
                        formData = Object.toJSON({ Data: { DeleteSearchParam: this.DeleteParam.DeleteCodesDto } });

                    } else if (this.TABLES == "SALE001") {
                        //New Version : Quick Search
                        formData = Object.toJSON({ Data: { MENU_CODE: "LocationCode", DELETE_TYPE: "DELETEALL", DELETE_PARAM: this.delete_param } });
                    }
                    else if (this.TABLES == "STET_OM_ERP_PROD_MAPPING") {
                        formData = Object.toJSON({ DeleteSearchParam: this.DeleteParam.DeleteCodesOmMappingDto });
                    }
                    else if (this.TABLES == "STET_OM_CD") {
                        formData = Object.toJSON({ DeleteOmCdDelivery: this.DeleteOmCdDelivery });
                        this.CheckPermissionRequest = {
                            EditMode: ecenum.editMode.delete,
                            ProgramId: "P000054"
                        };
                    }
                    else if (this.TABLES == "SERVICECODE") {
                        formData = Object.toJSON({ PARAM: this.PARAM });
                    }
                    else if (this.TABLES == "SFSC_BKTX_CUST") {
                        formData = Object.toJSON({ SfscBktxCustDto: this.SfscBktxCustDto });
                    }
                    else if (this.TABLES == "ACC001_PHASE") {
                        formData = Object.toJSON({ BtnFlag: "AD", DateF: this.nowDate, DateT: "" });
                    }
                    else if (this.TABLES == "SALE003") {
                        //전체삭제 API 호출을 호출 페이지에서 진행하도록 변경 (클라이언트에서 삭제API 반복호출)

                        var param = {
                            Request: {
                                Data: {
                                    FILE_DEL: "Y",
                                    SEARCH_CNT: this.SEARCH_CNT,
                                    DeleteSearchParam: this.DeleteParam.ProdListSearchDto
                                }
                            }
                        }


                        formData = Object.toJSON(param);
                        self.sendMessage(self, formData);
                        return false;
                    }
                    else if (this.TABLES == "STWMSACC") {
                        var param = {};
                        self.sendMessage(self, param);
                        return;
                    }
                    else if (this.TABLES == "WMS_LOADINV") {
                        var param = {};
                        self.sendMessage(self, param);
                        return;
                    }
                    else if (this.TABLES == "WMS_RESET") {
                        var param = {};
                        self.sendMessage(self, param);
                        return;
                    }
                    else if (this.TABLES == "STWMSACCSELECT") {
                        var param = {
                            Data: self.DeleteCodesDtos,
                            callback: self.close.bind(self)
                        };

                        self.sendMessage(self, param);
                        return;
                    }
                    else if (this.TABLES == "CMS100") {
                        formData = Object.toJSON({ F_FLAG: this.DeleteParam.F_FLAG, SER_NO: this.DeleteParam.SER_NO, F_NAME: this.DeleteParam.F_NAME, F_NAME1: this.DeleteParam.F_NAME1, OWNER_KEY: this.DeleteParam.OWNER_KEY });
                    }
                    else if (this.TABLES == "ACC001_CMS") {
                        formData = Object.toJSON({ ListKey: this.DeleteParam.ListKey });
                    }
                    else if (this.TABLES == "SALE005") {
                        // DeleteAll BOM Design
                        formData = Object.toJSON({ isShowMenuPath: 'Y', Data: { DeleteSearchParam: this.DeleteParam.BomListSearchDto } });
                        this.CheckPermissionRequest = {
                            EditMode: ecenum.editMode.delete,
                            ProgramId: "P000054"
                        };
                    }
                    else if (this.TABLES == "SITE_PJT") {
                        formData = JSON.stringify({
                            Request: {
                                Data: this.DeleteParam
                            }

                        });
                    }
                    else if (this.TABLES == "COM051") {
                        // api 전송 Data
                        var parser = new UAParser();
                        formData = Object.toJSON({
                            EditFlag: "C",    // 취소관련 Param (ECU520M.js)
                            ServiceFlag: "C", // 취소관련 Param (ECU520M.js)
                            Browser: parser.getBrowser().name + parser.getBrowser().major
                        });
                    }
                    else {
                        //Old Version
                        formData = JSON.stringify(this.DeleteParam);
                    }
                    if (this.CheckPermissionRequest) {
                        formData.CheckPermissionRequest = this.CheckPermissionRequest;

                        if (!formData.CheckPermissionRequest) {
                            var tempObject = Object.toObject(formData);
                            tempObject.CheckPermissionRequest = this.CheckPermissionRequest;
                            if (tempObject.Request) {
                                tempObject.Request.CheckPermissionRequest = this.CheckPermissionRequest;
                            }
                            formData = Object.toJSON(tempObject);
                        }
                    }
                    if (!$.isEmpty(this.TABLES) && GmcTables.contains(this.TABLES)) { // GMCAPI
                        ecount.common.gmcSessionApi({
                            sessionURL: this.DeleteApiUrl,
                            callbackApi: function (_DeleteApiUrl) {
                                ecount.common.api({
                                    url: _DeleteApiUrl,
                                    data: formData,
                                    success: function (result) {

                                        if (self.TABLES == 'CMS100' || self.TABLES == 'ACC001_CMS')
                                            ecount.alert("Confirmed.");
                                        else
                                            ecount.alert(ecount.resource.MSG00564);

                                        // If you call [Delete All] popup from another popup, you need to implement onMessageHandler function on your popup for reloading data (because Retry Error on IE)
                                        // Recommend: Use sendMessage() function instead of reloadParent() function for better performance
                                        if (self.isSendMsgAfterDelete) {
                                            var message = {
                                                flag: "Delete"
                                            };

                                            self.sendMessage(self, message);

                                        } else {
                                            //분기 필요
                                            self.reloadParent();
                                        }

                                        self.setTimeout(function () { self.close(); }.bind(self), 0);

                                    }.bind(this)
                                });
                            }
                        });
                    } else {     

                        /*
                        if (self.TABLES == "CUST") {
                            debugger;
                            ecount.confirm(ecount.resource.MSG09734, function (status) {
                                if (status === true) {
                                    self.showProgressbar();
                                    ecount.common.api({
                                        url: this.DeleteApiUrl,
                                        data: formData,
                                        success: function (result) {
                                            self.sendMessage("DeleteAll", "DeleteAll");
                                            self.setTimeout(function () { self.close(); }.bind(self), 0);
                                        }.bind(this),
                                        complete: function (event, status) {
                                            self.hideProgressbar();
                                        }
                                    });
                                }
                            }.bind(this));
                        }
                        else if (this.TABLES == "SALE003") {
                            ecount.confirm(ecount.resource.MSG09734, function (status) {
                                if (status === true) {
                                    var param = {
                                        Request: {
                                            Data: this.DeleteParam.ProdListSearchDto,
                                        }
                                    }
                                    formData = Object.toJSON(param);
                                    self.sendMessage(self, formData);
                                    return false;
                                }
                            }.bind(this));
                        } else {

                            */
                        self.showProgressbar();
                        ecount.common.api({
                            url: this.DeleteApiUrl,
                            data: formData,
                            success: function (result) {
                                if (self.TABLES == "COM051") {
                                    self.sendMessage(self, { editFlag: "C" });
                                    ecount.alert(ecount.resource.MSG00295, function () {
                                        this.close();
                                    });

                                    return;
                                }

                                if (self.TABLES != "ACC001_PHASE" && self.TABLES != "ACC002_DELETE_INSERT") {
                                    ecount.alert(ecount.resource.MSG00564);
                                }

                                // If you call [Delete All] popup from another popup, you need to implement onMessageHandler function on your popup for reloading data (because Retry Error on IE)
                                // Recommend: Use sendMessage() function instead of reloadParent() function for better performance
                                if (this.isSendMsgAfterDelete) {
                                    var message = {
                                        callback: self.close.bind(self)
                                    };
                                    if (["STET_OM_ERP_PROD_MAPPING", "SFSC_BKTX_CUST"].contains(self.TABLES)) {
                                        self.sendMessage(self, message);
                                    }
                                    else if (self.TABLES == "SERVICECODE") {
                                        self.sendMessage("DeleteAll", result);
                                    }
                                    else if (self.TABLES == "ACC001_PHASE") {
                                        self.sendMessage(self, null);
                                    } else if (self.TABLES == "ACC002_DELETE_INSERT") {
                                        self.sendMessage("DefaultSettings", result);
                                    }
                                    else {
                                        // 정리필요
                                        self.sendMessage("DeleteAll", "DeleteAll");
                                    }
                                } else {
                                    self.reloadParent();
                                }

                                if (self.TABLES != "STET_OM_ERP_PROD_MAPPING") {
                                    self.setTimeout(function () { self.close(); }.bind(self), 0);
                                }

                            }.bind(this),
                            complete: function (event, status) {
                                self.hideProgressbar();
                            }
                        });
                       // }
                    }
                }
            }
        }

        btn.setAllowClick();
    },

    //닫기
    onFooterClose: function () {
        var self = this;
        if (this.MODFLAG == "Y") {
            var message = {
                data: "close",
                callback: self.close.bind(self)
            };
            this.sendMessage(this, message);
        }
        else {
            this.close();
        };
    },

    onFooterConfirm: function () {
        //처리결과..
        var msg = this.randomStr.RanString;
        var self = this;
        var btn = this.footer.get(0).getControl("Confirm");
        if (this.intClickCnt == 0) {
            if ($.isEmpty(this.contents.getControl("DES").getValue())) {
                ecount.alert(ecount.resource.MSG00226, {
                    width: 120, height: 100
                    , callback: function () {
                        self.setFocusDes(self);
                    }
                });
                btn.setAllowClick();
                return false;
            };

            if (this.contents.getControl("DES").getValue() != msg.trim()) {
                ecount.alert(ecount.resource.MSG00225, {
                    width: 250, height: 100
                    , callback: function () {
                        self.setValueFocusDes(self);
                    }
                });

                btn.setAllowClick();
                return false;
            };

            var message = {
                callback: self.close.bind(self)
            };

            this.sendMessage(this, message);
        };
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    /**********************************************************************
    *  ## ENTER
    **********************************************************************/
    ON_KEY_ENTER: function () {
        if (this.MODFLAG === "Y") {
            this.onFooterConfirm();
        }
        else {
            this.onFooterSave();
        }
    },

    /**************************************************************************************************** 
    * Process for close popup
    ****************************************************************************************************/
    ON_KEY_ESC: function () {
        this.onFooterClose();
    },

    onClosedPopupHandler: function () {
        this.onFooterClose();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    setFocusDes: function (current) {
        current.contents.getControl("DES").setFocus(0);
    },

    setValueFocusDes: function (current) {
        current.contents.getControl("DES").setValue("");
        current.contents.getControl("DES").setFocus(0);
    },

    setrandomText: function () {
        this.randomStr.RanString = this.fnMakeWord();
        this.contents.getControl("random_text").setLabel("<span  class=\"label label-default text-xl \">&nbsp;<b>" + this.randomStr.RanString + "</b>&nbsp;</span>");
        this.contents.getControl("DES").setFocus(0);
    },

    setRandomString: function () {
        this.randomStr.WordRangr = parseInt(Math.random() * this.randomStr.iMaxWordLen);
        if (this.randomStr.WordRangr = this.randomStr.iMinWordLen) { return this.randomStr.WordRangr; }
    },

    fnMakeWord: function () {
        var Word = "";
        var Len = this.setRandomString();
        for (i = 0; i <= Len; i++) {
            Word += String.fromCharCode(this.arrAnsiRoom[this.fnMakeCharNum()]);
        }
        return Word;
    },
    // 랜덤 문자 1개를 리턴
    fnMakeCharNum: function () {
        while (true) {
            this.arrAscCharNum = this.arrAnsiRoom;
            AscNum = parseInt(Math.random() * this.arrAscCharNum.length);
            var strWord = String.fromCharCode(this.arrAnsiRoom[AscNum]);
            // Il0Ooj 문자는 사용하지 않음.
            if (strWord != "I" && strWord != "l" && strWord != "0" && strWord != "O" && strWord != "o" && strWord != "j") {
                break;
            }
        }
        return AscNum;
    },

    fnAnsiChar: function () {
        var cnt = 0
        var Ansi = this.arrAnsi.arrAnsi.toArray();

        for (i = 0; i <= Ansi.length - 1; i++) {
            for (j = Ansi[i].min; j <= Ansi[i].max; j++) {
                this.arrAnsiRoom[cnt] = j;
                cnt++;
            }
        }
    }
});