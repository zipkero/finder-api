window.__define_resource && __define_resource("LBL10231","LBL09918","LBL11613","LBL08463","LBL11614","LBL00830","BTN00043","LBL08396","BTN00008","LBL01241","LBL09676","LBL10232","MSG00213","MSG05621","MSG05631","LBL10243");
/****************************************************************************************************
1. Create Date : 2016.10.13
2. Creator     : 정명수
3. Description : SMS > 발신번호인증 (SMS > Caller ID Authentication)
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EGA008P_05", {
/**************************************************************************************************** 
* user opion Variables(사용자변수 및 객체) 
****************************************************************************************************/
    PAGE_CURRENT: 1,
    defaultSearchParam: null,

/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.defaultSearchParam = {
            PAGE_SIZE: this.PAGE_SIZE
            , PAGE_CURRENT: this.PAGE_CURRENT
        }
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
        header
            .setTitle(ecount.resource.LBL10231)
            .notUsedBookmark();
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            form = g.form(),
            toolbar = g.toolbar(),
            grid = g.grid();

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.ListLoad)
            .setRowDataUrl("/Common/Infra/GetListSfsmCaller")
            .setRowDataParameter(this.defaultSearchParam)
            .setKeyColumn(["COM_CODE", "CALLER"])
            .setColumns([
                { propertyName: "CALLER", id: "CALLER", controlType: "widget.link", title: ecount.resource.LBL09918, width: "", align: "left" }
                , { propertyName: "STATUS", id: "STATUS", title: ecount.resource.LBL11613, width: "150", align: "center" }
                , { propertyName: "WRITER_ID", id: "WRITER_ID", title: ecount.resource.LBL08463, width: "80", align: "left" }
                , { propertyName: "AUTH_DT", id: "AUTH_DT", title: ecount.resource.LBL11614, width: "150", align: "center" }
                , { propertyName: "IS_DEFAULT", id: "IS_DEFAULT", title: ecount.resource.LBL00830, width: "50", align: "center" }

            ])
            .setCheckBoxUse(true)
            .setCheckBoxHeaderStyle({ visible: false })
            .setCheckBoxCallback({ click: this.setGridCheckbox.bind(this) })
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingCurrentPage(this.PAGE_CURRENT)
            .setPagingRowCountPerPage(this.PAGE_SIZE, true)
            .setCustomRowCell("CALLER", this.setGridCaller.bind(this))
            .setCustomRowCell("STATUS", this.setGridStatus.bind(this))
            .setCustomRowCell("AUTH_DT", this.setGridAuthDt.bind(this))
            .setCustomRowCell("IS_DEFAULT", this.setGridIsDefault.bind(this))
            .setCustomRowCell(ecount.grid.constValue.checkBoxPropertyName, this.setGridCheckboxOption.bind(this))
            ;

        contents.addGrid("dataGrid", grid);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            control = widget.generator.control();

        toolbar
            .addLeft(control.define('widget.button', 'new').label(ecount.resource.BTN00043).end())
            .addLeft(control.define('widget.button', 'default').label(ecount.resource.LBL08396).clickOnce().end())
            .addLeft(control.define('widget.button', 'close').label(ecount.resource.BTN00008).end());

        footer.add(toolbar);
    },

/**************************************************************************************************** 
* define common event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
****************************************************************************************************/
    onLoadComplete: function (e) {
        if (!$.isEmpty(this.DirectOpen)) {
            this.openRegist(this.Caller);
        } else if (!$.isEmpty(this.DirectOpenView)) {
            this.openView(this.Caller, this.AuthType);
        }
    },

    onMessageHandler: function (page, message) {
        this.contents.getGrid("dataGrid").draw(this.defaultSearchParam);
        message.callback && message.callback();
    },
/****************************************************************************************************
* define grid event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    setGridCaller: function (value, rowItem) {
        var option = {};

        option.event = {
            click: function (event, data) {
                var authMethod = data.rowItem["AUTH_TYPE"] == "N" ? "1" : data.rowItem["AUTH_TYPE"] == "A" ? "2" : "3";
                var param = { width: 800, height: 600, Caller: data.rowItem["CALLER"], AuthMethod: authMethod, EditFlag: "M" };

                this.openView(data.rowItem["CALLER"], authMethod);
            }.bind(this)
        };

        return option;
    },

    setGridStatus: function (value, rowItem) {
        var option = {};

        switch (value) {
            case "D":
                option.data = ecount.resource.LBL01241;
                break;
            case "C":
                option.data = ecount.resource.LBL09676;
                break;
            case "R":
                option.data = ecount.resource.LBL10232;
                break;
        }

        return option;
    },

    setGridAuthDt: function (value, rowItem) {
        var option = { data: rowItem["STATUS"] == "C" ? ecount.infra.getECDateFormat('date11', false, value.toDatetime()) : "" };

        return option;
    },

    setGridIsDefault: function (value, rowItem) {
        var option = { data: "" };

        if (value) {
            option.controlType = 'widget.faCheckLink';
            option.attrs = {
                'class': ['text-warning']
            };
        };

        return option;
    },

    setGridCheckboxOption: function(value, rowItem) {
        var option = {};
        if (rowItem["IS_DEFAULT"] == true || rowItem["STATUS"] != "C") {
            option.attrs = {
                'disabled': true
            };
        }
        return option;
    },

    setGridCheckbox: function (value, rowItem) {
        var grid = this.contents.getGrid("dataGrid").grid;
        var isChecked = grid.getCheckedCount() > 0;
        if (isChecked) {
            if (value.target.checked == false) {
                grid.addChecked(rowItem.rowKey);
            } else {
                grid.clearChecked();
                grid.addChecked(rowItem.rowKey);
            }
        }
    },
/**************************************************************************************************** 
* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/

    onFooterNew: function () {
        this.openRegist();
    },

    onFooterDefault: function () {
        var grid = this.contents.getGrid("dataGrid").grid,
            btn = this.footer.getControl("default"),
            checked = grid.getChecked(),
            that = this;

        if (checked.length == 0) {
            btn.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);
            return false;
        }

        ecount.confirm(ecount.resource.MSG05621, function (status) {
            if (status) {
                checked.forEach(function (item) {
                    // Call API
                    if ($.isEmpty(item.CALLER)) {
                        btn.setAllowClick();
                        ecount.alert(ecount.resource.MSG05631);
                        return false;
                    }
                    var data = { CALLER: item.CALLER };
                    ecount.common.api({
                        url: '/Common/Infra/UpdateSfsmCallerDefault',
                        data: data,
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            }
                            else {
                                // 새로고침
                                that.contents.getGrid().draw(that.defaultSearchParam);
                            }
                        },
                        complete: function () {
                            btn.setAllowClick();
                        }
                    });
                });
            } else {
                btn.setAllowClick();
                return false;
            }
        }.bind(this));
    },

    onFooterClose: function () {
        this.close();
    },
/**************************************************************************************************** 
*  define hotkey event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
****************************************************************************************************/
    ON_KEY_F2: function () {
        this.onFooterNew();
    },
/**************************************************************************************************** 
* define user function 
****************************************************************************************************/
    openRegist: function (caller) {
        var param = { width: 500, height: 300 };
        if (caller) {
            param.Caller = caller;
        }

        this.openWindow({
            url: '/ECERP/Popup.Common/EGA008P_02',
            name: ecount.resource.LBL10243,
            param: param,
            popupType: false,
            additional: false
        });
    },
    openView: function (caller, authMethod) {
        var param = { width: 500, height: 300, Caller: caller, AuthMethod: authMethod, EditFlag: "M" };

        this.openWindow({
            url: '/ECERP/Popup.Common/EGA008P_04',
            name: ecount.resource.LBL10243,
            param: param,
            popupType: false,
            additional: false
        });
    }
});