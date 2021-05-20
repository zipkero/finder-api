window.__define_resource && __define_resource("LBL08076","LBL00857","LBL08079","LBL04395","LBL00827","LBL08080","LBL00703","LBL08077","LBL08078","BTN00065","BTN00008","LBL93038","MSG00500","MSG03328");

ecount.page.factory("ecount.page.popup.type2", "EBA001P_13", {
    userPermit: "",
    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
    },

    render: function () {
        this.userPermit = this.viewBag.Permission.Permit.Value;
        this._super.render.apply(this);
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {

        header.setTitle(resource.LBL08076);
        header.notUsedBookmark();
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();

        var resultData, strGubun;
        for (var i = 0, len = this.viewBag.InitDatas.deptLoad.length; i < len; i++) {
            resultData = this.viewBag.InitDatas.deptLoad[i];

            if (resultData["PARENT_SER_NO"].toString().trim() == "1") {
                if (resultData["GYE_NM"].toString().trim() != "")
                    strGubun = resultData["GYE_NM"];
                else {
                    switch (resultData["GUBUN"].toString().trim()) {
                        case "1":
                            strGubun = ecount.resource.LBL00857;
                            break;
                        case "2":
                            strGubun = ecount.resource.LBL08079;
                            break;
                        case "3":
                            strGubun = ecount.resource.LBL04395;
                            break;
                        case "4":
                            strGubun = ecount.resource.LBL00827;
                            break;
                        default:
                            strGubun = "";
                            break;
                    }
                }
            } else {
                if (resultData["BS_PL_DES"] != "")
                    strGubun = resultData["BS_PL_DES"];
                else
                    strGubun = ecount.resource.LBL08080;
            }

            resultData["GYE_NM"] = strGubun;
        }

        grid
            .setRowData(this.viewBag.InitDatas.deptLoad)
            .setColumns([
               { propertyName: 'GYE_CODE', id: 'GYE_CODE', title: ecount.resource.LBL00703, width: '300' },
                { propertyName: 'GYE_NM', id: 'GYE_NM', title: ecount.resource.LBL08077, width: '100' },
                { propertyName: 'MARK_ORDER', id: 'MARK_ORDER', title: ecount.resource.LBL08078, width: '80', align: 'center' },
            ])
            .setEditable(true, 0, 0)
            .setColumnFixHeader(true)
              .setCustomRowCell('GYE_CODE', this.setGridDataGyeCode.bind(this))
            .setCustomRowCell('GYE_NM', this.setGridDataGyeNm.bind(this))
            .setCustomRowCell('MARK_ORDER', this.setGridDataMarkOrder.bind(this));

        contents.addGrid("dataGrid", grid);
    },



    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/

    onMessageHandler: function (page, message) {
        this.reloadPage();
    },

    onLoadComplete: function () {
        debugger
        var self = this;
        
        if (this.GYE_CODE != "" && this.INPUT_FLAG == "N" && this.viewBag.InitDatas.deptLoad.length > 0) {
            self.sendMessage("EBA001P_13_Load", { data: { rowKey: self.ROW_KEY } });
        }
        
    },


    //닫기버튼
    onFooterClose: function () {
        this.close();
    },


    //Footer Save Event
    onFooterSave: function (e) {
        debugger
        var btnSave = this.footer.get(0).getControl("save");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var thisObj = this;
        var rowKey = 0;

        var SaveFlag = true;
        var overlapData = "|";
        var SaveData = this.contents.getGrid('dataGrid').grid.getRowList().select(function (item,data) {
            if (overlapData.indexOf("|" + item.MARK_ORDER + "|") > -1) {
                SaveFlag = false;
                rowKey = item[ecount.grid.constValue.keyColumnPropertyName];
            }
            if (SaveFlag == true) {
                overlapData += item.MARK_ORDER + "|";

                return {
                    'GYE_CODE': thisObj.GYE_CODE,
                    'FOREIGN_FLAG': thisObj.FOREIGN_FLAG,
                    'PARENT_SER_NO': item.PARENT_SER_NO,
                    'GUBUN': item.GUBUN,
                    'GYE_NM': item.GYE_NM,
                    'MARK_ORDER': item.MARK_ORDER
                };
            }
        });

        if (SaveFlag == true) {
            ecount.common.api({
                url: "/Account/Basic/UpdateAcc002InventoryDetail",
                async: true,
                data: Object.toJSON({
                    SaveDatas: SaveData
                }),
                success: function (result) {
                    console.log(result);
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg + result.Data);
                    }
                    else {
                        alert(ecount.resource.MSG00500);
                        this.close();
                        return false;
                    }
                }.bind(this)
            });
        } else {
            ecount.alert(ecount.resource.MSG03328);
            this.contents.getGrid('dataGrid').grid.setCellFocus("MARK_ORDER", rowKey);
        }
    },

    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },



    /**********************************************************************
   *  기능 처리
   **********************************************************************/

    //계정코드
    setGridDataGyeCode: function (value, rowItem) {
        var option = {};
        var self = this;
        if (rowItem["GYE_CODE_F"] != null && rowItem["GYE_CODE_F"] != "")
            option.data = String.format("[{0}]{1}", rowItem["GYE_CODE_F"], rowItem["GYE_DES"]);
        else
            option.data = "";
        return option;
    },

    //표시여부
    setGridDataGyeNm: function (value, rowItem) {
        var option = {};
        var self = this;

        if (rowItem["PARENT_SER_NO"].toString().trim() == "1") {
            option.controlType = "widget.input";
        }

        //if (rowItem["PARENT_SER_NO"].toString().trim() == "1") {
        //    if (rowItem["GYE_NM"].toString().trim() != "")
        //        strGubun = rowItem["GYE_NM"];
        //    else {
        //        switch (rowItem["GUBUN"].toString().trim()) {
        //            case "1":
        //                strGubun = ecount.resource.LBL00857;
        //                break;
        //            case "2":
        //                strGubun = ecount.resource.LBL08079;
        //                break;
        //            case "3":
        //                strGubun = ecount.resource.LBL04395;
        //                break;
        //            case "4":
        //                strGubun = ecount.resource.LBL00827;
        //                break;
        //            default:
        //                strGubun = "";
        //                break;
        //        }
        //    }
        //    option.controlType = "widget.input";
        //} else {
        //    if (rowItem["BS_PL_DES"] != "")
        //        strGubun = rowItem["BS_PL_DES"];
        //    else
        //        strGubun = ecount.resource.LBL08080;
        //}
        //option.data = strGubun;

        return option;
    },

    //표시방법
    setGridDataMarkOrder: function (value, rowItem) {

        var option = {};
        var self = this;
        option.controlType = "widget.select";
        var selectOption = new Array();
        for (var i = 1; i <= this.viewBag.InitDatas.deptLoad.length; i++) {
            selectOption.push([i, i.toString()]);
        }
        option.optionData = selectOption;
        option.data = value;
        return option;
    },

    reloadPage: function () {
        this.onAllSubmitSelf({
            url: "/ECERP/EBA/EBA001P_13"
        });
    },
});