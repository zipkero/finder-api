window.__define_resource && __define_resource("LBL08064","LBL00495","LBL00479","LBL08074","LBL08075","BTN00065","BTN00144","BTN00719","BTN00718","BTN00008","LBL93038","MSG00500","MSG03327","LBL08030","LBL00243","BTN00168","LBL08076");

ecount.page.factory("ecount.page.popup.type2", "EBA001P_08", {
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
       
        header.setTitle(resource.LBL08064);
        header.notUsedBookmark();
    },

    onInitContents: function (contents) {
        debugger

        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();

        grid
            .setRowData(this.viewBag.InitDatas.deptLoad)
            .setColumns([
                { propertyName: 'GYE_CODE', id: 'GYE_CODE', title: ecount.resource.LBL00495, width: '250' },
                { propertyName: 'GYE_DES', id: 'GYE_DES', title: ecount.resource.LBL00479, width: '0', isHideColumn: true },
                { propertyName: 'INVENTORY_FLAG', id: 'INVENTORY_FLAG', title: ecount.resource.LBL08074, width: '130' },
                { propertyName: 'SET_FLAG', id: 'SET_FLAG', title: ecount.resource.LBL08075, width: '80', align: 'center' },
                { propertyName: 'INPUT_FLAG', id: 'INPUT_FLAG', title: ecount.resource.LBL08075, width: '0', isHideColumn: true },
            ])
            .setColumnFixHeader(true)
            .setEditable(true, 0, 10)
            .setEventWidgetTriggerObj(this.events)
            .setEventAutoAddRowOnLastRow(true, 3) //로우 증가시킴
            .setCustomRowCell('GYE_CODE', this.setGridDataGyeCode.bind(this))
            .setCustomRowCell('INVENTORY_FLAG', this.setGridDataInventoryFlag.bind(this))
            .setCustomRowCell('SET_FLAG', this.setGridDataSetFlag.bind(this))
            //.setEventShadedColumnId('SET_FLAG', { shadedClassName: "text-warning-inverse" })
        ;
        contents.addGrid("dataGrid", grid);
    },



    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065));
        toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00144));
        toolbar.addLeft(ctrl.define("widget.button", "foreign").label((this.FOREIGN_FLAG == "N") ? ecount.resource.BTN00719 : ecount.resource.BTN00718));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/

    onMessageHandler: function (page, message) {
        debugger
        if (page == "EBA001P_13_Load") {
            this.contents.getGrid().grid.setCell("SET_FLAG", message.data.rowKey, 'Y');
        }
        else if (page.pageID == "CM007P") {
            this.contents.getGrid().grid.setCell("INPUT_FLAG", message.control.rowKey, 'N')
            this.contents.getGrid().grid.setCell("INVENTORY_FLAG", message.control.rowKey, 'Y');
        } else {
            this.reloadPage();
        }
    },

    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        switch (control.id) {
            case "GYE_CODE":
                params.CALL_TYPE = "17";
                params.isTreeEventDisable = true;

                break;
        }
        handler(params);
    },

    onLoadComplete: function () {

    },


    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },


    //Footer Save Event
    onFooterSave: function (e) {
        var thisObj = this;
        var btnSave = this.footer.get(0).getControl("save");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }

        var SaveData = this.contents.getGrid('dataGrid').grid.getRowList().select(function (item, data) {
            if (item.GYE_CODE != "") {
                return {
                    'FOREIGN_FLAG': thisObj.FOREIGN_FLAG,
                    'GYE_CODE': item.GYE_CODE,
                    'INVENTORY_FLAG': item.INVENTORY_FLAG
                };
            }
        });

        ecount.common.api({
            url: "/Account/Basic/UpdateAcc002Inventory",
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

    },

    //새로불러오기
    onFooterNew: function (e) {
        var self = this;

        ecount.confirm(ecount.resource.MSG03327, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Account/Basic/CreateAcc002InventoryDetail",
                    async: true,
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            alert(ecount.resource.MSG00500);
                            self.reloadPage();
                            return false;

                        }
                    }.bind(this)
                });
            }
        }.bind(this));
    },

    //계정표시방법1,2
    onFooterForeign: function (e) {
        var param = { FOREIGN_FLAG: (this.FOREIGN_FLAG == "Y") ? "N" : "Y" };
        this.onAllSubmitSelf("/ECERP/EBA/EBA001P_08", param);
    },


    /**********************************************************************
   *  기능 처리
   **********************************************************************/

    //계정코드
    setGridDataGyeCode: function (value, rowItem) {
        var option = {};
        var self = this;
        if (rowItem["GYE_CODE"] != "")
            option.data = String.format("[{0}]{1}", rowItem["GYE_CODE"], rowItem["GYE_DES"]);
        else
            option.data = "";
        if (rowItem["FLAG"] == null || rowItem["FLAG"] != "1") {
            option.controlType = "widget.code.account";
            option.controlOption = {
                controlEvent: {
                    itemSelect: function (rowKey, arg) {
                        console.log('itemSelect');
                        console.log(arguments);
                        if (arg.message.data != null) {
                            self.contents.getGrid().grid.setCell("GYE_DES", rowKey, arg.message.data["GYE_DES"]);
                            self.contents.getGrid().grid.setCell("GYE_CODE", rowKey, arg.message.data["GYE_CODE"]);
                        }
                    }.bind(this)
                }
            }
        }

        return option;
    },
    
    //표시여부
    setGridDataInventoryFlag: function (value, rowItem) {
        var option = {};
        var self = this;
        option.controlType = "widget.radio.multi";
        option.label = ([ecount.resource.LBL08030, ecount.resource.LBL00243]);
        option.value = (['Y', 'N']);
        option.select = value;
        //option.event = {
        //    'change': function (e, data) {
        //        console.log('INVENTORY_FLAG change');
        //        console.log(data);
        //        console.log(data[ecount.grid.constValue.keyColumnPropertyName]);
        //    }
        //}
        return option;
    },
    
    //표시방법
    setGridDataSetFlag: function (value, rowItem) {
        
        var option = {};
        var self = this;
        option.data = ecount.resource.BTN00168;
        option.controlType = "widget.link";
        if (value == "Y") {
            option.attrs = { 'class': 'text-warning-inverse' }
        }
        option.event = {
            'click': function (e, data) {
                debugger
                var popupParam = {
                    GYE_CODE: data.rowItem["GYE_CODE"],
                    INPUT_FLAG: data.rowItem["INPUT_FLAG"],
                    FOREIGN_FLAG: this.FOREIGN_FLAG,
                    ROW_KEY : data['rowKey'],
                    width: 500,
                    height: 400,
                    parentPageID: this.pageID,
                    responseID: this.callbackID
                };
                this.openWindow({
                    url: '/ECERP/EBA/EBA001P_13',
                    name: ecount.resource.LBL08076,
                    param: popupParam,
                    additional: true
                });
                //if (data.rowItem["GYE_CODE"] != "" && data.rowItem["INPUT_FLAG"] == "N") {
                //    var grid = self.contents.getGrid().grid;
                //    grid.refreshCell(data.columnId, data.rowKey);
                //}
                e.preventDefault();

            }.bind(this)
        }
        return option;
    },

    reloadPage: function () {
        var _self = this;
        var param = { FOREIGN_FLAG: this.FOREIGN_FLAG };
        this.onAllSubmitSelf("/ECERP/EBA/EBA001P_08", param);

    },


});