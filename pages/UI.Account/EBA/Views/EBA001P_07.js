window.__define_resource && __define_resource("LBL08070","LBL08071","LBL08072","LBL08081","LBL08082","BTN00065","BTN00033","BTN00008","LBL93038","MSG03319","MSG03320","MSG00118","MSG03321","MSG03325","MSG00588","MSG01209","MSG00299","LBL07973");
/****************************************************************************************************
1. Create Date : 2015-12-03
2. Creator     : 안정환
3. Description : S.C > GENERALTAB > POPUP 공통탭 > 복잡성
4. Precaution  :
5. History     :
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EBA001P_07", {

    userPermit: "",
    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    CR_GYE_CODE: null,
    CR_GYE_DES: null,
    GYE_CODE : null,
    GYE_DES: null,
    PROCESS_DES: null,
    PROCESS_ORDER: null,
    ctrlList: null,
    iniYymm: null,
    acctDate: null,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

    },

    render: function () {
        this._super.render.apply(this);
        var self = this;
        var data = this.viewBag.InitDatas.deptLoad;
        if (data.length > 0) {
            this.CR_GYE_CODE = data[0]["CR_GYE_CODE"];
            this.CR_GYE_DES = data[0]["CR_GYE_DES"];
            this.GYE_CODE = data[0]["GYE_CODE"];
            this.GYE_DES = data[0]["GYE_DES"];
            this.PROCESS_DES = data[0]["PROCESS_DES"];
            this.PROCESS_ORDER = data[0]["PROCESS_ORDER"];
        }
    },

    initProperties: function () {
        this.ctrlList = [];
        this.userPermit = this.viewBag.Permission.Permit.Value;
        iniYymm = ecount.company.INI_YYMM;
        acctDate = ecount.config.account.ACCT_DATE;
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        header.setTitle(resource.LBL08070);
        header.notUsedBookmark();

    },

    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {
        var g = widget.generator;
        ctrl = g.control(),         //widget Control
        toolbar = g.toolbar(),       //widget Toolbar
        form = g.form(),             //widget Form
        res = ecount.resource;

        var opts = [];
        for (var i = 1; i < 100; i++) {
            opts.push([i, i]);
        }

        form
            .add(ctrl.define('widget.input', 'PROCESS_DES', 'PROCESS_DES', res.LBL08071, null)
                .value(this.PROCESS_DES).end())
            .add(ctrl.define('widget.select', 'PROCESS_ORDER', 'PROCESS_ORDER', res.LBL08072, null)
                .option(opts).select(this.PROCESS_ORDER).end())
            .add(ctrl.define('widget.code.account', 'CR_GYE_CODE', 'CR_GYE_CODE', res.LBL08081, null)
            .addCode({ label: this.CR_GYE_DES, value: this.CR_GYE_CODE }).end())
                .add(ctrl.define('widget.code.account', 'GYE_CODE', 'GYE_CODE', res.LBL08082, null)
            .addCode({ label: this.GYE_DES, value: this.GYE_CODE }).end())

        contents.add(form);

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065));
        if (this.SER_NO != 0)
            toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/

    //로드시 (On Load Complete)
    onLoadComplete: function () {
        for (var i = 0; i < this.contents.items[0].rows.length; i++) {
            this.ctrlList.push(this.contents.items[0].rows[i].id);
        }
        this.contents.getControl('PROCESS_DES').setFocus(0);
    },

    //저장 버튼 (save button click event)
    onFooterSave: function (e) {
        var btnSave = this.footer.get(0).getControl("save");
        if (['R', 'X'].contains(this.userPermit) || (this.userPermit == "U" && this.SER_NO != 0)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: this.SER_NO == 0 ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var self = this;
        var errList = [];
        if (this.contents.getControl("PROCESS_DES").getValue() == "") {
            errList.push(this.contents.getControl('PROCESS_DES').id);
            this.contents.getControl('PROCESS_DES').showError(ecount.resource.MSG03319);
        }
        if (this.contents.getControl("CR_GYE_CODE").getValue() == "")
        {
            errList.push(this.contents.getControl('CR_GYE_CODE').id);
            this.contents.getControl('CR_GYE_CODE').showError(ecount.resource.MSG03320);
        }
        if (this.contents.getControl("GYE_CODE").getValue() == "") {
            errList.push(this.contents.getControl('GYE_CODE').id);
            this.contents.getControl('GYE_CODE').showError(ecount.resource.MSG00118);
        }
        if (this.contents.getControl("CR_GYE_CODE").getValue() == this.contents.getControl("GYE_CODE").getValue()) {
            errList.push(this.contents.getControl('GYE_CODE').id);
            this.contents.getControl('GYE_CODE').showError(ecount.resource.MSG03321);
            return false;
        }
      
        if (errList.length > 0) {
            $.each(this.ctrlList, function (index, val) {
                if (errList.contains(val)) {
                    self.contents.getControl(val).setFocus(0);
                    return false;
                }
            });

            btnSave.setAllowClick();
            return false;
        }

        if (this.getPhaseCheck()) {
            btnSave.setAllowClick();
            return false;
        }

        ecount.common.api({
            url: '/Account/Basic/InsertAcc104',
            data: Object.toJSON({
                SER_NO: self.SER_NO,
                PROCESS_DES: self.contents.getControl("PROCESS_DES").getValue(), 	//회계처리명칭
                PROCESS_ORDER: self.contents.getControl("PROCESS_ORDER").getValue(),//결산처리순서
                CR_GYE_CODE: self.contents.getControl("CR_GYE_CODE").getValue(), 	//재고자산계정
                GYE_CODE: self.contents.getControl("GYE_CODE").getValue()           //재고자산계정
            }),
            error: function (e) {
                ecount.alert('자동대체설정 저장 처리 시 Error', function () {
                    this.hideProgressbar();
                }.bind(this));
            }.bind(this),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert("error");
                } else if (result.Data == "1") {
                    //ecount.alert(ecount.resource.MSG03325);
                    self.contents.getControl("PROCESS_ORDER").showError(ecount.resource.MSG03325);
                    self.contents.getControl("PROCESS_ORDER").setFocus(0);
                    return false;
                } else if (result.Data == "2") {
                    ecount.alert(ecount.resource.MSG00588);
                    self.sendMessage(self, "EBA001P_07");
                    self.close();
                    return false;
                } else if (result.Data == "3") {                                        
                    //ecount.alert(ecount.resource.MSG01209);
                    self.contents.getControl("CR_GYE_CODE").showError(ecount.resource.MSG01209);
                    self.contents.getControl("CR_GYE_CODE").setFocus(0);
                    return false;
                }
                else {
                    var accountList = [
                        {
                            GYE_CODE: self.contents.getControl("CR_GYE_CODE").getValue(),
                            SUM_GUBUN: "1"
                        },
                        {
                            GYE_CODE: self.contents.getControl("GYE_CODE").getValue(),
                            SUM_GUBUN: "1"
                        }
                    ];

                    ecount.common.api({
                        url: "/Account/Basic/InsertBatchUpdateBalanceByAccount",
                        data: Object.toJSON({
                            Base_From_Date: iniYymm + "01",
                            Base_To_Date: acctDate,
                            ACCT_DATE: acctDate,
                            UpdateBalanceList: accountList
                        }),
                        error: function (e) {
                            ecount.alert('재집계 Error', function () {
                                thisObj.hideProgressbar();
                            }.bind(this));
                        }.bind(this),
                        success: function (result) {
                            if (result.Status != "200")
                                ecount.alert(result.fullErrorMsg);
                            else {
                                self.sendMessage(self, "EBA001P_07");
                                self.close();
                                return false;
                            }
                        }
                    });

                }
            }.bind(this)
        });

    },

    //Delete button click event
    onFooterDelete: function () {
        debugger
        var btnDelete = this.footer.get(0).getControl("delete");

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }

        var thisObj = this;

        var DeleteData = [{
            'SER_NO': this.SER_NO
        }];

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: '/Account/Basic/DeleteAcc104',
                    data: Object.toJSON({
                        DeleteDatas: DeleteData
                    }),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg + result.Data);
                        } else {
                            thisObj.sendMessage(this, {});
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                        }
                    }.bind(this)
                });
            } else {
                btnDelete.setAllowClick();
            }
        });
    },


    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //엔터   (enter key press event)
    ON_KEY_ENTER: function (e, target) {
    },

    //마지막 포커스 (content field last focus)
    onFocusOutHandler: function (event) {
        var hasNext = this._super.onFocusOutHandler.apply(this, arguments);

        if (!hasNext)
            this.footer.getControl("save").setFocus(0);
    },

    /**********************************************************************
   *  기능 처리
   **********************************************************************/
    getPhaseCheck: function () {

       
        var self = this;
        var isEmptyPhase = false;

        ecount.common.api({
            async: false,
            url: "/Account/Common/CheckAccountPhase",
            data: { StatusCheckPhase: "I" },
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg);
                else {
                    if (result && result.Data) {
                        self.openWindow({
                            url: "/ECERP/EMG/EMG001P_16",
                            name: ecount.resource.LBL07973,
                            param: { height: 230, width: 500 },
                            popupType: false,
                            fpopupID: self.ecPageID
                        });
                        isEmptyPhase = true;
                    }
                }
            }.bind(this)
        });

        return isEmptyPhase;
    },
});
