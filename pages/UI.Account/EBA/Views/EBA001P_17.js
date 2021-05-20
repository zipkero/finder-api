window.__define_resource && __define_resource("LBL00342","LBL00478","LBL09678","LBL01448","BTN00204","BTN00553","LBL02704","LBL01018","LBL03213","LBL03590","LBL13169","LBL12150","LBL35154","LBL35155","LBL03543","LBL09410","LBL08364","LBL08075","LBL35244","LBL03638","LBL93038","MSG01390","MSG07493","MSG00710","MSG00522","MSG00772","MSG01700","LBL07973");
/****************************************************************************************************
1. Create Date : 2017.02.14
2. Creator     : 신선미
3. Description : 계정선택변경
4. Precaution  :   
5. History     :  2017.09.19 (Hao) - Change link banlance status to Chart of Account Status
                  2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
6. MenuPath    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.changeItem", "EBA001P_17", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    selectedGyeCode: [],
    isShowSaveButtonByRow: true,
    selectedRow: {},
    selectedObject: {},
    filter_control: [],
    userPermit: "",
    incomeFlag: 0,
    updateBalanceList: null,
    iniYymm: null,
    acctDate: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {

        this._super.init.apply(this, arguments);
        this.initProperties(options);
    },

    initProperties: function (options) {
        incomeFlag = Number(ecount.config.company.INCOME_FLAG);
        this.setSettings();
        var willCheckItems = [];
        $.each(this.selectedGyeCode["gye_code"], function (i, data) {
            if ((data.IsSelected || "") != "") {
                willCheckItems.push(data["GYE_CODE"]); /*체크박스에 체크할 목록*/
            };

        });

        var res = ecount.resource;

        options = $.extend({}, options, { data: (this.selectedGyeCode["gye_code"] || []) }); /*그리드에 매칭할 데이터를 공통변수에 넣는다.*/
        var columns = [
            { id: 'GYE_CODE', propertyName: "GYE_CODE", width: "80", title: res.LBL00342, editable: false },
            { id: 'GYE_DES_OLD', width: "100", title: res.LBL00478, editable: false, controlType: "widget.label" },
            { id: 'GYE_DES', propertyName: "GYE_DES", width: "100", title: res.LBL00478, isHideColumn: true, controlType: "widget.input.codeName" },
        ];/*화면에 출력할 그리드 컬럼을 정의한다.*/

        CashAccount = this.viewBag.InitDatas.CashAccount;
        iniYymm = ecount.company.INI_YYMM;
        acctDate = ecount.config.account.ACCT_DATE;
        updateBalanceList = [];

        options = $.extend({}, options, { columns: columns, keycolumns: ["GYE_CODE"], checkedItem: willCheckItems });  /*페이지별로 환경설정 변수.*/
        this._loadShowColumns = ['GYE_CODE', 'GYE_DES_OLD'];
        this._super.initProperties.call(this, options);  /*공통 페이지를 호출한다.*/
    },

    render: function ($parent) {
        this.userPermit = this.viewBag.Permission.Permit.Value;
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        header
            .setTitle(ecount.resource.LBL09678)
            .notUsedBookmark()
    },

    onInitContents: function (contents) {
        var generator = widget.generator,
            ctrl = generator.control(),
            subCtrl = generator.control()
        res = ecount.resource;

        var controls = this._super.onInitContents.apply(this); /*contents를 알수 없어서 공통페이지를 호출해서 받아온다.*/

        /*하위 로직, 받아온 object들을 override 하는 과정. - 다른 페이지에서 필요없음 안해도 됨*/
        controls.grid
            .setCustomRowCell('GYE_DES_OLD', this.setGridDateGyeDesOld.bind(this))
            .setCustomRowCell('GYE_DES', this.setGridDateGyeDes.bind(this))
            .setCustomRowCell('SEARCH_MEMO', this.setGridDateSearchMemo.bind(this))
            .setCustomRowCell('CR_DR', this.setGridDateCrDr.bind(this))
            .setCustomRowCell('INPUT_GUBUN', this.setGridInputGubun.bind(this))
            .setCustomRowCell('SUM_GUBUN', this.setGridSumGubun.bind(this))
            .setCustomRowCell('SE_NAME', this.setGridSEName.bind(this))
            .setCustomRowCell('GYE_DES2', this.setGridDateGyeDes2.bind(this))
            .setCustomRowCell('SUB_GUBUN', this.setGridSubGubun.bind(this))
            .setCustomRowCell('PY_GYE_GUBUN', this.setGridPYGyeGubun.bind(this))
            .setCustomRowCell('STEP_FLAG', this.setGridDateStepFlag.bind(this))
            .setCustomRowCell('BS_PL_GUBUN', this.setGridBSPLGubun.bind(this))
            .setCustomRowCell('BS_PL_GUBUN2', this.setGridBSPLGubun2.bind(this))
            .setCustomRowCell('CANCEL', this.setGridDateCancel.bind(this))


            ;

        var optionStepFlagList = [];
        optionStepFlagList.push([0, "0", ""]);
        optionStepFlagList.push([1, "1", ""]);
        optionStepFlagList.push([2, "2", ""]);
        optionStepFlagList.push([3, "3", ""]);
        optionStepFlagList.push([4, "4", ""]);
        optionStepFlagList.push([5, "5", ""]);


        var optionCancel = [];
        optionCancel.push(["N", res.LBL01448]);
        optionCancel.push(["Y", res.BTN00204]);

        controls.form
            .add(subCtrl.define("widget.input.general", "SEARCH_MEMO").end()).add(ctrl.define("widget.link", "btnApply", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.input.general", "SE_NAME").end()).add(ctrl.define("widget.link", "btnApply1", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.input.general", "GYE_DES2").end()).add(ctrl.define("widget.link", "btnApply2", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.input.codeName", "GYE_DES").end()).add(ctrl.define("widget.link", "btnApply10", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.radio", "CR_DR").label([ecount.resource.LBL02704, ecount.resource.LBL01018]).value(["DR", "CR"]).end()).add(ctrl.define("widget.link", "btnApply11", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.combine.accountTypeNew", "INPUT_GUBUN").setOptions({
                showSummary: true,
                closingExist: "Y", incomeFlag: ecount.config.company.INCOME_FLAG,
                hyperLinkDefaultList: this.viewBag.InitDatas.HyperLinkDefaultList
            }).end()).add(ctrl.define("widget.link", "btnApply5", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.combine.relatedBusiness", "SUB_GUBUN").fixedSelect('00', 'N').end()).add(ctrl.define("widget.link", "btnApply12", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.select", "STEP_FLAG").option(optionStepFlagList).end()).add(ctrl.define("widget.link", "btnApply13", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.select", "CANCEL").option(optionCancel).end()).add(ctrl.define("widget.link", "btnApply15", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.combine.addupBalance", "SUM_GUBUN").value(['1', '2', '3', '4', '5']).setOptions({ account: true }).end())
            .add(ctrl.define("widget.link", "btnApply16", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.combine.valuation", "PY_GYE_GUBUN").fixedSelect(['X', { label: '', value: '' }, 0, 'N']).end()).add(ctrl.define("widget.link", "btnApply17", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.combine.displayMethod", "BS_PL_GUBUN").fixedSelect(['N', '', '1', ["0", "0"]]).end()).add(ctrl.define("widget.link", "btnApply18", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.combine.displayMethod", "BS_PL_GUBUN2").fixedSelect(['N', '', '1', ["0", "0"]]).end()).add(ctrl.define("widget.link", "btnApply19", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end());

        controls.form.setColSize(2);
        controls.form.useBaseForm({ _isThShow: true, _isToolbarType: true })
        controls.form.colgroup([{}, {}, { width: 50 }]);
        controls.form.rowspan(23, 0);
        controls.form.hide();
        /*~여기까지*/

        if (this.IsFromBalanceAdjustment == false)
            contents.add(controls.toolbar);

        contents.add(controls.form)
            .addGrid("dataGrid", controls.grid); /*공통 내부에서 grid의 id는 "dataGrid"로 사용하기 때문에, 이름을 바꾸면 안됨.*/
    },

    onInitFooter: function (footer) {
        var controls = this._super.onInitFooter.apply(this); /*공통페이지를 호출한다. footer를 알수 없어서 받아온다.*/
        footer.add(controls.toolbar);
    },

    setGridSelectItem: function (data) {
        debugger;
        var columns = [
            { id: 'GYE_DES', propertyName: "GYE_DES", width: "100", title: res.LBL00478, controlType: "widget.input.codeName" },
            { id: 'SEARCH_MEMO', propertyName: "SEARCH_MEMO", width: "100", title: res.LBL03213, controlType: "widget.input.general" },
            { id: 'CR_DR', propertyName: "CR_DR", width: "110", title: res.LBL03590, controlType: "widget.radio.multi" },
            { id: 'INPUT_GUBUN', propertyName: "INPUT_GUBUN", width: "450", title: res.LBL13169, controlType: "widget.combine.accountTypeNew" },
            { id: 'SUM_GUBUN', propertyName: "SUM_GUBUN", width: "320", title: res.LBL12150, controlType: "widget.combine.addupBalance" },
            { id: 'SE_NAME', propertyName: "SE_NAME", width: "100", title: res.LBL35154, controlType: "widget.input.general" },
            { id: 'GYE_DES2', propertyName: "GYE_DES2", width: "105", title: res.LBL35155, controlType: "widget.input.general" },
            { id: 'SUB_GUBUN', propertyName: "SUB_GUBUN", width: "250", title: res.LBL03543, controlType: "widget.combine.relatedBusiness" },
            { id: 'PY_GYE_GUBUN', propertyName: "PY_GYE_GUBUN", width: "300", title: res.LBL09410, controlType: "widget.combine.valuation" },
            { id: 'STEP_FLAG', propertyName: "STEP_FLAG", width: "105", title: res.LBL08364, controlType: "widget.select" },
            { id: 'BS_PL_GUBUN', propertyName: "BS_PL_GUBUN", width: "200", title: String.format("{0}1", res.LBL08075), controlType: "widget.combine.displayMethod" },
            { id: 'BS_PL_GUBUN2', propertyName: "BS_PL_GUBUN2", width: "200", title: String.format("{0}2", res.LBL08075), controlType: "widget.combine.displayMethod" },
            { id: 'CANCEL', propertyName: "CANCEL", width: "105", title: res.LBL35244, controlType: "widget.select" },//Type
        ];/*화면에 출력할 그리드 컬럼을 정의한다.*/

        var useColumns = [
            { id: 'GYE_CODE', propertyName: "GYE_CODE", width: "80", title: res.LBL00342, editable: false },
            { id: 'GYE_DES_OLD', width: "100", title: res.LBL00478, editable: false, controlType: "widget.label" },
        ];

        data.forEach(function (item) {
            var selItem = columns.find(function (col) { return col.id == item.COLUMN; });
            if (!$.isEmpty(selItem))
                useColumns.push(selItem);
        });

        var grid = this.contents.getGrid();
        grid.settings.setColumns(useColumns);
        grid.draw(this._data);
    },
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        this.adjustContentsDimensions();
    },
    /**********************************************************************
    * define common event listener
    **********************************************************************/
    // Message Handler for popup
    onMessageHandler: function (page, data) {
        switch (page.pageID) {

            case "EBA001P_18": /*변경항목 팝업에서 선택한 항목을 해당 페이지에 바인딩하는 과정*/
                debugger;
                this.setGridSelectItem(data.data);
                this.contents.getForm()[0].show();
                this.adjustContentsDimensions();
                this.setCheckSettingsItem(data.data);
                this.setTimeout(function () {
                    debugger;
                    data.callback && data.callback(false);
                }.bind(this), 0);
                break;
            case "CM021P": /*일괄저장시 보안창에서 처리한 결과를 받아와서 페이지에서 처리하는 과정*/
                this.setTimeout(function () {
                    data.callback && data.callback(false);
                }.bind(this), 0);
                if ((data.data || "") == "close") {
                    var btn = this.footer.get(0).getControl("save");
                    btn.setAllowClick();
                }
                else {
                    this.SaveData(); /*실제 데이터 저장로직을 호출한다.*/
                };
                break;
        };
    },
    /*상위페이지에서 구현한 부분을 override 한다.*/
    onLoadComplete: function (e) {

        this._super.onLoadComplete.apply(this);
        this.adjustContentsDimensions();
    },

    /*상위 페이지 내부에서 onLoadComplete-event 이후에 해당 함수를 호출하도록 구현함. 페이지별로 구현해야됨-변경항목 팝업항목은 각 페이지별로 다르므로.*/
    onContentsChange: function (e) {
        if (this.IsFromBalanceAdjustment == false) {
            var params = {
                width: ecount.infra.getPageWidthFromConfig(true),
                height: 600,
                dataOfGyeCode: Object.toJSON(this.selectedGyeCode["settings"])
            };
            this.openWindow({
                url: '/ECERP/EBA/EBA001P_18',
                name: ecount.resource.LBL03638,
                param: params,
                fpopupID: this.ecPageID,
                popupType: false,
            });
        } else {
            this.contents.getForm()[0].show();
            var settingData = [];
            var rowData = { COLUMN: "SUM_GUBUN", DES: ecount.resource.LBL12150, _TREE_SET: { _DEPTH: 1, _PARENT_GROUP_ID: "1" } }
            settingData.push(rowData);

            this.setCheckSettingsItem(settingData);
        }
    },

    //닫기
    onFooterClose: function (e) {
        var thisObj = this;
        thisObj.sendMessage(this, {});
        thisObj.setTimeout(function () {
            thisObj.close();
        }, 0);
    },

    onFooterSave: function (e) {

        var btn = this.footer.get(0).getControl("save");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        //체크하기
        var o = (this.contents.getGrid("dataGrid").grid.getRowList() || []);
        var send_data = [];
        var isRaisedError = false;
        var self = this;
        updateBalanceList = [];

        if (o.length <= 0) {
            btn.setAllowClick();
            ecount.alert(ecount.resource.MSG01390);
            return;
        };

        if (this.getPhaseCheck()) {
            btn.setAllowClick();
            return false;
        }
        for (var i = 0; i < o.length; i++) {
            var __check = this.getSendData({ rowItem: o[i], rowIdx: i });
            if (__check["GYE_CODE"] != null) {
                isRaisedError = false;
                send_data.push(__check);
            }
            else {
                isRaisedError = true;
                break;
            }
        };

        self.siteCheck = "N";
        self.pjtCheck = "N";

        if (isRaisedError == false) {
            var listOfGyeCode = [];
            for (var i = 0; i < send_data.length; i++) {
                listOfGyeCode.push(send_data[i].GYE_CODE);

                if (send_data[i].ACC105_SITE == 1) {
                    self.siteCheck = "Y";
                }

                if (send_data[i].ACC105_PJT == 1) {
                    self.pjtCheck = "Y";
                }
            };

            if (listOfGyeCode.length > 0) {
                if (self.siteCheck == "Y" || self.pjtCheck == "Y") {
                    ecount.common.api({
                        url: "/SelfCustomize/Config/GetMypagecompany",
                        data: Object.toJSON({
                            COM_CODE: this.viewBag.InitDatas.ComCode
                        }),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert("error");
                            } else {
                                if (self.siteCheck == "Y" && result.Data.USE_ACC102_SITE == "0") {
                                    ecount.alert(ecount.resource.MSG07493);
                                    btn.setAllowClick();
                                    return false;
                                }

                                if (self.pjtCheck == "Y" && result.Data.USE_ACC102_PJT == "0") {
                                    ecount.alert(ecount.resource.MSG07493);
                                    btn.setAllowClick();
                                    return false;
                                }

                                self._super.onFooterSave.apply(self);
                            }
                        }
                    });
                } else {
                    this._super.onFooterSave.apply(this);
                }

                btn.setAllowClick();
            };
        };
        btn.setAllowClick();
    },

    SaveData: function () {
        var o = this.contents.getGrid("dataGrid").grid.getRowList();
        var send_data = [];
        updateBalanceList = [];
        for (var i = 0; i < o.length; i++) {
            var __check = this.getSendData({ rowItem: o[i], rowIdx: i });
            if (__check["GYE_CODE"] != null) {
                send_data.push(__check);
            };
        };

        var self = this;
        var btn = this.footer.get(0).getControl("save");

        var listOfGyeCode = [];
        var keys = [];
        for (var i = 0; i < send_data.length; i++) {
            listOfGyeCode.push(send_data[i].GYE_CODE);
            keys.push(String.format("[{0}] {1}", send_data[i].GYE_CODE, send_data[i].ORG_GYE_DES || ""));
        };

        if (listOfGyeCode.length > 0) {
            save.call(this);
        }
        else {
            btn.setAllowClick();
        };

        function save() {
            ecount.common.api({
                url: "/SVC/Account/Basic/UpdateAcc002Change",
                data: {
                    Request: {
                        Data: {
                            GYE_CODE_DATA: Object.toJSON(send_data)
                        }
                    },
                    Key: keys,
                    CheckPermissionRequest: self.getPermissonRequest()
                },
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(ecount.resource.MSG00710, function () {
                            self.close(false);
                            btn.setAllowClick();
                        });
                        return;
                    }
                    else {
                        if (updateBalanceList.length > 0) {
                            ecount.common.api({
                                url: "/Account/Basic/InsertBatchUpdateBalanceByAccount",
                                data: Object.toJSON({
                                    Base_From_Date: iniYymm + "01",
                                    Base_To_Date: acctDate,
                                    ACCT_DATE: acctDate,
                                    UpdateBalanceList: updateBalanceList
                                }),
                                error: function (e) {
                                    ecount.alert('재집계 Error', function () {
                                        btn.setAllowClick();
                                    }.bind(this));
                                }.bind(this),
                                success: function (result) {
                                    if (result.Status != "200")
                                        ecount.alert(result.fullErrorMsg);
                                    else {
                                        ecount.alert(ecount.resource.MSG00522, function () {
                                            self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: listOfGyeCode, unfocus: true, checkByPass: true }); /*부모페이지 refresh*/
                                            self.close();
                                            btn.setAllowClick();
                                        }); /*팝업창을 닫지 않음.*/
                                    }
                                }
                            });
                        }
                        else {
                            ecount.alert(ecount.resource.MSG00522, function () {
                                self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: listOfGyeCode, unfocus: true, checkByPass: true }); /*부모페이지 refresh*/
                                self.close();
                                btn.setAllowClick();
                            }); /*팝업창을 닫지 않음.*/
                        }
                    }
                },
                error: function (result) {
                    self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: listOfGyeCode, unfocus: true, checkByPass: true }); /*부모페이지 refresh*/
                    btn.setAllowClick();
                }
            });
            btn.setAllowClick();
        }
    },

    getPermissonRequest: function () {
        var result = {
            ProgramId: this.PROGRAM_ID,
            EditMode: ecenum.editMode.modify,
            IsFromAccount: true
        };
        if (this.CheckPermissionRequest) {
            result.CheckPermissionTabListRequest = [];
            result.CheckPermissionTabListRequest.push(this.CheckPermissionRequest);
        }
        return result;
    },

    /*라인별 저장시 사용한다. - 상위페이지에서 이미 구현해두었으므로, 해당 함수를 구현하면 된다.*/
    onSaveDataByRow: function (e, data) {
        updateBalanceList = [];
        var __self = this;
        var send_data = this.getSendData(data);
        var keys = [String.format("[{0}] {1}", send_data.GYE_CODE, send_data.ORG_GYE_DES || "")];

        if (send_data["GYE_CODE"] == null) {
            return;
        };

        if (this.getPhaseCheck()) {
            return false;
        }
        var o = this.contents.getGrid("dataGrid").grid.getRowList();

        var listOfGyeCode = [];
        listOfGyeCode.push(send_data["GYE_CODE"]);

        //부서, 프로젝트별 집계 사용시 회사설정 다시한번 확인
        __self.saveKey = data.rowItem["K-E-Y"];
        if (send_data.ACC105_SITE == 1 || send_data.ACC105_PJT == 1) {
            ecount.common.api({
                url: "/SelfCustomize/Config/GetMypagecompany",
                data: Object.toJSON({
                    COM_CODE: this.viewBag.InitDatas.ComCode
                }),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert("error");
                    } else {
                        if (send_data.ACC105_SITE == 1 && result.Data.USE_ACC102_SITE == "0") {
                            ecount.alert(ecount.resource.MSG07493);
                            btn.setAllowClick();
                            return false;
                        }

                        if (send_data.ACC105_PJT == 1 && result.Data.USE_ACC102_PJT == "0") {
                            ecount.alert(ecount.resource.MSG07493);
                            btn.setAllowClick();
                            return false;
                        }

                        save.call(this);
                    }
                }
            });
        } else {
            if (listOfGyeCode.length > 0) {
                save.call(this);
            }
        }

        function save() {
            ecount.common.api({
                url: "/SVC/Account/Basic/UpdateAcc002Change",
                data: {
                    Request: {
                        Data: {
                            GYE_CODE_DATA: Object.toJSON([send_data])
                        }
                    },
                    Key: keys,
                    CheckPermissionRequest: __self.getPermissonRequest()
                },
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(ecount.resource.MSG00710, function () {
                            __self.close(false);
                        });
                        return;
                    }
                    else {
                        if (updateBalanceList.length > 0) {
                            ecount.common.api({
                                url: "/Account/Basic/InsertBatchUpdateBalanceByAccount",
                                data: Object.toJSON({
                                    Base_From_Date: iniYymm + "01",
                                    Base_To_Date: acctDate,
                                    ACCT_DATE: acctDate,
                                    UpdateBalanceList: updateBalanceList
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
                                        ecount.alert(ecount.resource.MSG00522, function () {
                                            __self.getParentInstance(self.parentPageID)._ON_REDRAW({
                                                serialIdx: listOfGyeCode, unfocus: true, checkByPass: true
                                            });
                                        }); /*팝업창을 닫지 않음.*/
                                    }
                                }
                            });
                        }
                        else {
                            ecount.alert(ecount.resource.MSG00522, function () {
                                __self.getParentInstance(self.parentPageID)._ON_REDRAW({
                                    serialIdx: listOfGyeCode, unfocus: true, checkByPass: true
                                });
                            }); /*팝업창을 닫지 않음.*/
                        }
                    }
                }
            });
        }
    },


    setSettings: function () {
        this.selectedGyeCode = (this.viewBag.InitDatas.ListsOfGyeCode || []);
        $.each(this.selectedGyeCode["settings"], function (i, data) {
            data["IsSelected"] = "";

        });

        $.each(this.selectedGyeCode["gye_code"], function (i, data) {
            data["IsSelected"] = "1";

            var sitePjtChecked = [];

            if (data["ACC105_SITE"] == "1")
                sitePjtChecked.push("4");

            if (data["ACC105_PJT"] == "1")
                sitePjtChecked.push("5");

            data["INPUT_GUBUN"] = [
                data["INPUT_GUBUN"],
                data["GYE_TYPE"] || "AS",
                data["INEX_DV_CD"] || "I",
                {
                    label: data["GROUP_CODE_DES"],
                    value: data["GROUP_CODE"]
                },
                {
                    label: data["PRTS_INEX_GYE_DES"] || "",
                    value: data["PRTS_INEX_GYE_CODE"] || ""
                },
                data["SUM_GUBUN"],
                sitePjtChecked,
                $.isEmpty(data["GYE_CODE_LINK"]) ? 1 : 2,
                data["GYE_CODE_LINK"],
                {
                    label: data["ITEM_TYPE_NM"],
                    value: data["ITEM_TYPE_CD"]
                },
            ];

            data["SUM_GUBUN"] = [
                data["SUM_GUBUN"],
                sitePjtChecked
            ];

            data["SUB_GUBUN"] = [
                data["SUB_GUBUN"],
                data["USE_BILL_YN"]
            ];
            data["PY_GYE_GUBUN"] = [
                data["PY_GYE_GUBUN"],
                {
                    label: data["APPLY_CODE_DES"],
                    value: data["APPLY_CODE"]
                },
                data["PY_GYE_SORT"],
                data["PY_GYE_BALANCE"],
            ];
            var chk2 = ["0", "0"];
            if (data["CHECK_FLAG"] == "Y" && data["BRACKET"] == "Y") {
                chk2 = ["1", "2"];
            }
            else if (data["CHECK_FLAG"] == "Y") {
                chk2 = ["1"];
            }
            else if (data["BRACKET"] == "Y") {
                chk2 = ["2"];
            }
            data["BS_PL_GUBUN"] = [
                data["BS_PL_GUBUN"],
                data["BS_PL_DES"],
                data["BS_PL_POSITION"],
                chk2
            ];
            var chk3 = ["0", "0"];
            if (data["CHECK_FLAG2"] == "Y" && data["BRACKET2"] == "Y") {
                chk3 = ["1", "2"];
            }
            else if (data["CHECK_FLAG2"] == "Y") {
                chk3 = ["1"];
            }
            else if (data["BRACKET2"] == "Y") {
                chk3 = ["2"];
            }
            data["BS_PL_GUBUN2"] = [
                data["BS_PL_GUBUN2"].toString().trim(),
                data["BS_PL_DES2"],
                data["BS_PL_POSITION2"],
                chk3
            ];
        });
        return this.selectedGyeCode;
    },


    /*변경항목에서 선택한 항목을 그리드에 세팅, 변경항목영역에 항목을 세팅함 - 다른페이지는 다를 수 있음 (참고만)*/
    setCheckSettingsItem: function (selectedItem) {
        this.modifyItems = (selectedItem || []);
        var settingObject = this.selectedGyeCode["settings"];
        var grid = this.contents.getGrid("dataGrid").grid;
        var columns = grid.getColumnInfoList();
        //for (var i = 0; i < columns.length; i++) {
        //    if ((columns[i].id == "GYE_CODE") || (columns[i].id == "GYE_DES_OLD") || (columns[i].id == "save")) continue;
        //    grid.setColumnVisibility((columns[i].id), false); /*그리드에 항목들 초기화 - 계정코드, 저장 컬럼은 계속 보이도록 처리한다.*/
        //};
        for (var i = 0; i < settingObject.length; i++) {
            settingObject[i].IsSelected = "";
        };

        $.each(selectedItem, function (i, data) {
            for (var i = 0; i < settingObject.length; i++) {
                if (settingObject[i].COLUMN == data.COLUMN) {
                    settingObject[i].IsSelected = "1"; /*항목선택 팝업창에서 체크박스에 체크를 할 수 있도록 한다. - 페이지끼리 사용하는 변수*/
                };
            };

            //grid.setColumnVisibility((data.COLUMN), true); /*그리드에 숨겼던 항목 보이게 처리-선택된 항목만 보이게 한다.*/
        });

        /*일괄변경 영역 처리 시작 ~*/
        var vOptions = [];
        for (var i = 0; i < this.modifyItems.length; i++) {
            if (this.modifyItems[i]["_TREE_SET"]._PARENT_GROUP_ID == "0000") continue;
            vOptions.push([this.modifyItems[i].COLUMN, this.modifyItems[i].DES]);
        };

        this.contents.getControl("selApply").show();
        this.contents.getControl("selApply").removeOption();
        this.contents.getControl("selApply").addOption(vOptions);

        this.contents.getForm()[0].showTd("selApply");

        var selectedItem = this.contents.getControl("selApply").getSelectedItem();
        this.setSelApplyFocus(selectedItem.value);
        /*~일괄변경 영역 처리 끝*/
    },

    onChangeControl: function (control, data, command) {
        switch (control.cid) {
            case "selApply":
                this.setSelApplyFocus(control.value);
                break;
            case "INPUT_GUBUN_selectType":
            case "INPUT_GUBUN_radioLink":
            case "INPUT_GUBUN_radioBalance":
                var defaultLink = this.getDefaultLink(this.contents.getControl("INPUT_GUBUN").getValue());
                this.contents.getControl("INPUT_GUBUN").setValue([null, null, null, null, null, null, null, null, defaultLink]);
                break;
        };

        if (control.cid.indexOf("accountTypeNew") > -1) {
            if (control.cid.indexOf("_selectType") > -1) {
                var data = this.contents.getGrid().grid.getCell("INPUT_GUBUN", control.gridDataKey);
                data[1] = control.value;
                var defaultLink = this.getDefaultLink(data);
                this.contents.getGrid().grid.setCell("INPUT_GUBUN", control.gridDataKey, [null, null, null, null, null, null, null, null, defaultLink]);
            } else if (control.cid.indexOf("_radioBalance") > -1) {
                var data = this.contents.getGrid().grid.getCell("INPUT_GUBUN", control.gridDataKey);
                data[5] = control.value;
                var defaultLink = this.getDefaultLink(data);
                this.contents.getGrid().grid.setCell("INPUT_GUBUN", control.gridDataKey, [null, null, null, null, null, null, null, null, defaultLink]);
            } else if (control.cid.indexOf("_radioLink") > -1 && control.value == "1") {
                var data = this.contents.getGrid().grid.getCell("INPUT_GUBUN", control.gridDataKey);
                data[7] = control.value;
                var defaultLink = this.getDefaultLink(data);
                this.contents.getGrid().grid.setCell("INPUT_GUBUN", control.gridDataKey, [null, null, null, null, null, null, null, null, defaultLink]);
            }
        }



    },

    setSelApplyFocus: function (value) {
        /*initialize*/
        //var CUSTOM = this.contents.getControl("CUSTOM");
        //CUSTOM.hideAll();   //hide all
        this.contents.getForm()[0].hideTdAll();
        if (value == "SEARCH_MEMO") {
            this.contents.getForm()[0].showTd("selApply");
            this.contents.getForm()[0].showTd("SEARCH_MEMO");
        } else {
            this.contents.getForm()[0].showTd(value);
        }

        this.contents.getForm()[0].showTd("btnApply19");  //dknam 리팩토링 영향으로 임시처리함 

        /*항목에 따라 일괄변경항목을 초기화 이후 출력여부 결정*/
        switch (value) {
            case "SEARCH_MEMO":
            case "SE_NAME":
            case "GYE_DES2":
            case "GYE_DES":
                this.contents.getControl(value).setValue("");
                break;
            case "CR_DR":
                this.contents.getControl(value).setValue("DR");
                break;
            case "STEP_FLAG":
                this.contents.getControl(value).setValue("0");
                break;
            case "CANCEL":
                this.contents.getControl(value).setValue("N");
                break;
            case "INPUT_GUBUN":
            case "SUM_GUBUN":
            case "PY_GYE_GUBUN":
            case "BS_PL_GUBUN":
            case "BS_PL_GUBUN2":
            case "SUB_GUBUN":
            default:
                break;
        };
    },

    setGridDateGyeDesOld: function (value, rowItem) {
        var option = {};
        option.data = rowItem["GYE_DES"];
        return option;
    },

    setGridDateGyeDes: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("GYE_DES", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridDateSearchMemo: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("SEARCH_MEMO", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridDateCrDr: function (value, rowItem) {
        var option = {};
        option.value = ["DR", "CR"];
        option.label = [ecount.resource.LBL02704, ecount.resource.LBL01018];
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("CR_DR", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridSEName: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("SE_NAME", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridDateGyeDes2: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("GYE_DES2", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridSubGubun: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("SUB_GUBUN", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridPYGyeGubun: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("PY_GYE_GUBUN", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridDateStepFlag: function (value, rowItem) {

        var option = {};

        var optionList = new Array();
        optionList.push([0, "0", ""]);
        optionList.push([1, "1", ""]);
        optionList.push([2, "2", ""]);
        optionList.push([3, "3", ""]);
        optionList.push([4, "4", ""]);
        optionList.push([5, "5", ""]);

        option.optionData = optionList;
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("STEP_FLAG", data.rowKey, "bg-danger");
            }.bind(this)
        }

        return option;
    },

    setGridBSPLGubun: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("BS_PL_GUBUN", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridBSPLGubun2: function (value, rowItem) {
        var option = {};
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("BS_PL_GUBUN2", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridDateCancel: function (value, rowItem) {

        var option = {};

        var optionList = new Array();
        optionList.push(["N", res.LBL01448]);
        optionList.push(["Y", res.BTN00204]);
        option.optionData = optionList;
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("CANCEL", data.rowKey, "bg-danger");
            }.bind(this)
        }

        return option;
    },

    /*디비에 저장할 데이터 가공하는 영역*/
    getSendData: function (data) {
        var return_value = this._super.CheckSaveData.apply(this);
        if (return_value == true) {
            var object_data = this._super.getSaveRowData(data.rowItem);
            var _keys = this._super._KeysOfJson(object_data);
            for (var i = 0; i < _keys.length; i++) {
                if (object_data[(_keys[i])] == null) continue;
            };
        }
        else {
            return {}; /*실패처리해야된다.*/
        };

        var objGrid = this.contents.getGrid("dataGrid").grid;

        var send_data = {}; /*업데이트할 데이터만 가공해서 넘긴다.*/
        if ((this.modifyItems || []).length > 0) {
            for (var i = 0; i < this.modifyItems.length; i++) {
                if (this.modifyItems[i].COLUMN == "GYE_DES" && object_data[(this.modifyItems[i].COLUMN)] == "") {
                    var option = {};
                    option.message = ecount.resource.MSG00772;
                    objGrid.setCellShowError("GYE_DES", object_data["GYE_CODE"], option);
                    return {};
                }
                else if (this.modifyItems[i].COLUMN == "SUM_GUBUN") {
                    this.saveKey = data.rowItem["K-E-Y"];
                    var sumGubun = this.selectedGyeCode["gye_code"][data.rowIdx].SUM_GUBUN;
                    var acc105_site = (sumGubun[1].contains("4") == true) ? 1 : 0;
                    var acc105_pjt = (sumGubun[1].contains("5") == true) ? 1 : 0;

                    send_data["UPDATE_CHK"] = "N";
                    send_data["SUM_GUBUN"] = object_data[(this.modifyItems[i].COLUMN)][0];

                    if (sumGubun[0] != send_data["SUM_GUBUN"]) {
                        send_data["UPDATE_CHK"] = "Y";
                    }

                    if (data.rowItem["GYE_CODE"] != CashAccount && send_data["SUM_GUBUN"] != "1") {
                        send_data["ACC105_SITE"] = (this.contents.getGrid().grid.getRowItem(this.saveKey)["SUM_GUBUN"][1] == true) ? 1 : 0;
                        send_data["ACC105_PJT"] = (this.contents.getGrid().grid.getRowItem(this.saveKey)["SUM_GUBUN"][2] == true) ? 1 : 0;

                        if (acc105_site != send_data["ACC105_SITE"] || acc105_pjt != send_data["ACC105_PJT"]) {
                            send_data["UPDATE_CHK"] = "Y";
                        }
                    }

                    if (send_data["UPDATE_CHK"] == "Y") {
                        var account = {
                            GYE_CODE: data.rowItem["GYE_CODE"],
                            SUM_GUBUN: send_data["SUM_GUBUN"]
                        }

                        updateBalanceList.push(account);
                    }
                } else if (this.modifyItems[i].COLUMN == "PY_GYE_GUBUN") {
                    send_data["PY_GYE_GUBUN"] = object_data[(this.modifyItems[i].COLUMN)][0];
                    send_data["APPLY_CODE"] = object_data[(this.modifyItems[i].COLUMN)][1][0] ? object_data[(this.modifyItems[i].COLUMN)][1][0].VALUE : object_data[(this.modifyItems[i].COLUMN)][1].value;
                    send_data["PY_GYE_SORT"] = object_data[(this.modifyItems[i].COLUMN)][2];
                    send_data["PY_GYE_BALANCE"] = object_data[(this.modifyItems[i].COLUMN)][3];
                }
                else if (this.modifyItems[i].COLUMN == "BS_PL_GUBUN") {
                    send_data["BS_PL_GUBUN"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][0] : null;
                    send_data["BS_PL_DES"] = object_data[(this.modifyItems[i].COLUMN)][1];
                    send_data["BS_PL_POSITION"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][2] : null;
                    send_data["CHECK_FLAG"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][3].contains("1") ? "Y" : "N" : null;
                    send_data["BRACKET"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][3].contains("2") ? "Y" : "N" : null;
                }
                else if (this.modifyItems[i].COLUMN == "BS_PL_GUBUN2") {
                    send_data["BS_PL_GUBUN2"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][0] : null;
                    send_data["BS_PL_DES2"] = object_data[(this.modifyItems[i].COLUMN)][1];
                    send_data["BS_PL_POSITION2"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][2] : null;
                    send_data["CHECK_FLAG2"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][3].contains("1") ? "Y" : "N" : null;
                    send_data["BRACKET2"] = this.selectedGyeCode["gye_code"][data.rowIdx].INPUT_GUBUN != "I" ? object_data[(this.modifyItems[i].COLUMN)][3].contains("2") ? "Y" : "N" : null;
                }
                else if (this.modifyItems[i].COLUMN == "SUB_GUBUN") {
                    send_data["SUB_GUBUN"] = object_data[(this.modifyItems[i].COLUMN)][0];
                    send_data["USE_BILL_YN"] = object_data[(this.modifyItems[i].COLUMN)][0] == "01" ? object_data[(this.modifyItems[i].COLUMN)][1] : "N";
                } else if (this.modifyItems[i].COLUMN == "INPUT_GUBUN") {
                    send_data["ORG_GYE_DES"] = this.selectedGyeCode["gye_code"][data.rowIdx].GYE_DES;
                    send_data["INPUT_GUBUN"] = object_data["INPUT_GUBUN"][0];
                    send_data["GYE_TYPE"] = object_data["INPUT_GUBUN"][1];
                    send_data["INEX_DV_CD"] = !['Y', 'T', 'I'].contains(object_data["INPUT_GUBUN"][0]) || ecount.config.company.INCOME_FLAG == "N" ? null : object_data["INPUT_GUBUN"][2];

                    if ($.isArray(object_data["INPUT_GUBUN"][3]))
                        object_data["INPUT_GUBUN"][3] = object_data["INPUT_GUBUN"][3][0];

                    send_data["GROUP_CODE"] = object_data["INPUT_GUBUN"][3].value || object_data["INPUT_GUBUN"][3].VALUE;

                    if ($.isArray(object_data["INPUT_GUBUN"][4]))
                        object_data["INPUT_GUBUN"][4] = object_data["INPUT_GUBUN"][4][0];

                    send_data["PRTS_INEX_GYE_CODE"] = object_data["INPUT_GUBUN"][4].value || object_data["INPUT_GUBUN"][4].VALUE;
                    send_data["SUM_GUBUN"] = object_data["INPUT_GUBUN"][0] == "Y" ? object_data["INPUT_GUBUN"][5] : "1";
                    send_data["ACC105_SITE"] = object_data["INPUT_GUBUN"][5] == "1" ? 0 : object_data["INPUT_GUBUN"][6].contains("1") ? 1 : 0;
                    send_data["ACC105_PJT"] = object_data["INPUT_GUBUN"][5] == "1" ? 0 : object_data["INPUT_GUBUN"][6].contains("2") ? 1 : 0;
                    send_data["GYE_CODE_LINK"] = ['N', 'I', 'T'].contains(object_data["INPUT_GUBUN"][0]) ? "JA" : (object_data["INPUT_GUBUN"][7] == "2" ? object_data["INPUT_GUBUN"][8] : null)

                    if ($.isArray(object_data["INPUT_GUBUN"][9]))
                        object_data["INPUT_GUBUN"][9] = object_data["INPUT_GUBUN"][9][0];

                    send_data["ITEM_TYPE_CD"] = object_data["INPUT_GUBUN"][0] == "Y" ? (object_data["INPUT_GUBUN"][9].value || object_data["INPUT_GUBUN"][9].VALUE) : ""
                }
                else {
                    send_data[(this.modifyItems[i].COLUMN)] = object_data[(this.modifyItems[i].COLUMN)];
                }
            };
            send_data["GYE_CODE"] = data.rowItem["GYE_CODE"];
        };

        if (send_data["ACC105_SITE"] == null) send_data["ACC105_SITE"] = 9;
        if (send_data["ACC105_PJT"] == null) send_data["ACC105_PJT"] = 9;

        return send_data;
    },

    setGridSumGubun: function (value, rowItem) {
        var option = {};
        option.value = ['1', '2', '3', '4', '5'];
        option.account = true;
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("SUM_GUBUN", data.rowKey, "bg-danger");
            }.bind(this)
        }
        return option;
    },

    setGridInputGubun: function (value, rowItem) {
        var option = {};

        option.controlOption = {
            widgetOptions: {
                showSummary: true,
                closingExist: "Y",
                hyperLinkDefaultList: this.viewBag.InitDatas.HyperLinkDefaultList,
                incomeFlag: ecount.config.company.INCOME_FLAG
            }
        }
        var grid = this.contents.getGrid().grid;
        option.event = {
            'change': function (e, data) {

                grid.addCellClass("INPUT_GUBUN", data.rowKey, "bg-danger");
            }.bind(this)
        }

        return option;
    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {
        switch (control.id) {
            case "INPUT_GUBUN_codeAccount1":
            case "accountType3_codeAccount":
                param.CALL_TYPE = "26";
                param.PARENT_TYPE = "F";
                param.isTreeEventDisable = true;
                break;
            case "INPUT_GUBUN_codeAccount2":
                param.CALL_TYPE = "28";
                param.PARENT_TYPE = "O";
                param.isTreeEventDisable = true;
                break;
            case "INPUT_GUBUN_codeFieldType":
                param.MENU_TYPE = "AI";
                param.PARAM1 = param.PARAM;
                break;
        }

        if (control.id.indexOf("accountTypeNew") > -1) {
            if (control.id.indexOf('_codeAccount1') > -1) {
                param.CALL_TYPE = "26";
                param.PARENT_TYPE = "F";
                param.isTreeEventDisable = true;
            }

            if (control.id.indexOf('_codeAccount2') > -1) {
                param.CALL_TYPE = "28";
                param.PARENT_TYPE = "O";
                param.isTreeEventDisable = true;
            }
        }

        handler(param);
    },
    /*팝업창 호출시 팝업창에 넘겨주는 값들 정의*/
    onPopupHandler: function (control, param, handler) {
        this.selectedRow = { "rowIdx": (control.rowKey || 0), "row_id": control.id };

        switch (control.id) {
            case "INPUT_GUBUN_codeAccount1":
            case "accountType3_codeAccount":
                param.CALL_TYPE = "26";
                param.PARENT_TYPE = "F";
                param.isTreeEventDisable = true;
                break;
            case "INPUT_GUBUN_codeAccount2":
                param.CALL_TYPE = "28";
                param.PARENT_TYPE = "O";
                param.isTreeEventDisable = true;
                break;
            case "PY_GYE_GUBUN_codeAccount":
                param.CALL_TYPE = "25";
                break;
            case "INPUT_GUBUN_codeFieldType":
                param.MENU_TYPE = "AI";
                param.PARAM1 = param.PARAM;
                break;
        };

        if (control.id.indexOf("accountTypeNew") > -1) {
            if (control.id.indexOf('_codeAccount1') > -1) {
                param.CALL_TYPE = "26";
                param.PARENT_TYPE = "F";
                param.isTreeEventDisable = true;
            }

            if (control.id.indexOf('_codeAccount2') > -1) {
                param.CALL_TYPE = "28";
                param.PARENT_TYPE = "O";
                param.isTreeEventDisable = true;
            }
        }

        handler(param);
    },

    //onContentsBtnApply: function (e) {
    setApply: function (e) {
        var selectedItem = this.contents.getControl("selApply").getSelectedItem();
        var row_id = (selectedItem.value || "");
        var row_value = this.contents.getControl(row_id).getValue();
        var new_value = null;

        if ((row_id == "BS_PL_GUBUN" || row_id == "BS_PL_GUBUN2") && row_value[2] == "") {
            this.contents.getControl(row_id).get(2).showError(ecount.resource.MSG01700);
            this.contents.getControl(row_id).get(2).setFocus(0);
            return false;
        }

        var grid = this.contents.getGrid("dataGrid").grid;
        for (var i = 0; i < grid.getRowList().length; i++) {

            var item_grid = grid.getRowList()[i];

            if (this.getCheckedItem(item_grid.GYE_CODE) == true) {

                switch (row_id) {
                    case "SEARCH_MEMO":
                    case "SE_NAME":
                    case "GYE_DES2":
                    case "GYE_DES":
                    case "CR_DR":
                    case "STEP_FLAG":
                    case "CANCEL":
                        grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], row_value, { isRefresh: true, isRunChange: false });
                        break;
                    case "INPUT_GUBUN":
                        row_value = this.contents.getControl(row_id).getValue();
                        grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], row_value);
                        break;
                    case "SUM_GUBUN":
                        new_value = [row_value[0], [row_value[1] == true ? "4" : "", row_value[2] == true ? "5" : ""]];
                        grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], new_value);
                        break;
                    case "BS_PL_GUBUN":
                    case "BS_PL_GUBUN2":
                    case "SUB_GUBUN":
                        grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], row_value);
                        break;
                    default:
                        this.contents.getGrid("dataGrid").grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], row_value, { isRefresh: true, isRunChange: false });
                        break;
                }
            };
        };
    },

    getCheckedItem: function (value) {
        var o = (this.contents.getGrid("dataGrid").grid.getChecked() || []);
        if (o.length <= 0) { return false; };
        var isReturnValue = false;
        for (var i = 0; i < o.length; i++) {
            if (o[i].GYE_CODE == value) {
                isReturnValue = true;
                break;
            };
        };
        return isReturnValue;
    },

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

    // 하이퍼링크 기본값 설정
    getDefaultLink: function (inputGubunValue) {
        var defaultLink = "";

        switch (inputGubunValue[1]) {
            case "AS":
            case "DE":
            case "CP":
                if (inputGubunValue[5] == "1") { //거래처별집계구분
                    defaultLink = this.viewBag.InitDatas.HyperLinkDefaultList[0];
                }
                else {
                    defaultLink = this.viewBag.InitDatas.HyperLinkDefaultList[1];
                }

                break;
            case "PL":
                defaultLink = this.viewBag.InitDatas.HyperLinkDefaultList[2];
                break;
            case "CA":
            case "CB":
            case "CC":
                defaultLink = this.viewBag.InitDatas.HyperLinkDefaultList[3] == "CN" ? inputGubunValue[1] : this.viewBag.InitDatas.HyperLinkDefaultList[3];
                break;
            case "XX":
                defaultLink = this.viewBag.InitDatas.HyperLinkDefaultList[4];
                break;
            default:
                defaultLink = "XX";
                break;
        }

        return defaultLink;
    }
});