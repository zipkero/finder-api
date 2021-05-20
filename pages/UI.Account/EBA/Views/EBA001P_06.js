window.__define_resource && __define_resource("BTN00141","LBL08063","LBL08071","LBL08072","BTN00043","BTN00035","BTN00008","LBL93038","LBL08070","MSG02479","MSG00500","MSG00213","MSG00301");

/*******************************************************************************************************
1. Create Date : 2017.02.23
2. Creator     : 신선미
3. Description : 결산회계처리설정
4. Precaution  :
5. History     : 2017.11.07 박종국 - this.viewBag.InitDatas.deptLoad DTO 변경으로 인한 SER_NO 변경 (SER_NO => Key.SER_NO)
6. MenuPath    : 회계1 > 기초등록 > 계정코드등록 > 옵션 > 결산회계처리설정 팝업
********************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EBA001P_06", {
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
        var option = [];
        option.push({ id: "DefaultSettings", label: ecount.resource.BTN00141 });
        header.setTitle(resource.LBL08063);
        header.notUsedBookmark();
        header.add("option", option, false);
    },

    onInitContents: function (contents) {

        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();

        grid
            .setRowData(this.viewBag.InitDatas.deptLoad)
            .setColumns([
                { propertyName: 'PROCESS_DES', id: 'PROCESS_DES', title: ecount.resource.LBL08071, width: '300'},
                { propertyName: 'PROCESS_ORDER', id: 'PROCESS_ORDER', title: ecount.resource.LBL08072, width: '100' },
            ])
            .setCheckBoxUse(true)
            .setColumnFixHeader(true)
            .setCustomRowCell('PROCESS_DES', this.setGridDataLink.bind(this));

        contents.addGrid("dataGrid", grid);
    },



    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button", "SelectedDelete").label(ecount.resource.BTN00035));
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

    },

    //신규버튼
    onFooterNew: function () {
        var btnNew = this.footer.get(0).getControl("New");
        if (this.userPermit.equals("R")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnNew.setAllowClick();
            return false;
        }
        var popupParam = {
            SER_NO:0,
            width: 450,
            height: 400,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };
        this.openWindow({
            url: '/ECERP/EBA/EBA001P_07',
            name: ecount.resource.LBL08070,
            param: popupParam,
            additional: true
        });
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //F2 적용 (function2 click event)
    ON_KEY_F2: function () {
        this.onFooterNew();
    },



    //기본값복원
    onDropdownDefaultSettings: function (e) {
        var self = this;

        ecount.confirm(ecount.resource.MSG02479, function (status) {
            if (status) {
                var formData = {
                    GUBUN: "3"
                };
                ecount.common.api({
                    url: "/Account/Basic/UpdateAccountCodeForRestore",
                    async: true,
                    data: Object.toJSON(formData),
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


    //선택삭제
    onFooterSelectedDelete: function () {

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.footer.getControl('SelectedDelete').setAllowClick();
            return false;
        }

        var self = this;
        var DeleteData = this.contents.getGrid('dataGrid').grid.getChecked().select(function (x) {
            return {
                'SER_NO': x.KEY.SER_NO
            }
        });

        if (DeleteData.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            this.footer.getControl('SelectedDelete').setAllowClick();
            this.hideProgressbar();
        } else {
            ecount.confirm(ecount.resource.MSG00301, function (ok) {
                if (ok) {
                    ecount.common.api({
                        url: '/Account/Basic/DeleteAcc104',
                        data: Object.toJSON({
                            DeleteDatas: DeleteData
                        }),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg + result.Data);
                            } else {
                                self.reloadPage();
                                return false;
                            }
                        }.bind(this)
                    });
                } else {
                    this.footer.getControl('SelectedDelete').setAllowClick();
                    this.hideProgressbar();
                }
            }.bind(this));
        }
    },
    /**********************************************************************
   *  기능 처리
   **********************************************************************/

    //회계처리명칭
    setGridDataLink: function (value, rowItem) {
        var option = {};        
            var self = this;
            option.data =  rowItem["PROCESS_DES"];
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {

                    var popupParam = {
                        SER_NO: data.rowItem.Key["SER_NO"],
                        width: 400,
                        height: 350,
                        parentPageID: this.pageID,
                        responseID: this.callbackID
                    };
                    this.openWindow({
                        url: '/ECERP/EBA/EBA001P_07',
                        name: ecount.resource.LBL08070,
                        param: popupParam,
                        additional: true
                    });
                    e.preventDefault();

                }.bind(this)
            }
        return option;
    },

    reloadPage: function () {
        this.onAllSubmitSelf({
            url: "/ECERP/EBA/EBA001P_06"
        });
    },
});