window.__define_resource && __define_resource("LBL07280","LBL07154","LBL07155","LBL03614","LBL01519","LBL02498","BTN00008","LBL02468","LBL01209","LBL00723","LBL01770","LBL01155","LBL05310","LBL01042","LBL01382","LBL00732","LBL03448","LBL02337","LBL05852","LBL19547","LBL08134","BTN01050","BTN01051","LBL06157");
/****************************************************************************************************
1. Create Date : 2016.03.10
2. Creator     : 소병용
3. Description : 회계전표 이력(History for Sales Invoice III)
4. Precaution  :
5. History     : 2020.05.15(Hao) Add Extension Number to profile
                 2020.10.30 (박종국) : A20_02943 - 외부알림1차 (FAX 추가)
6. Old File    : EBG001P_02.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "EBG001P_02", {
    pageID: null,

    header: null,

    contents: null,

    footer: null,

    listUser: null,
    /**********************************************************************
    *  page init
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.listUser = this.viewBag.InitDatas.ListUser;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    //Header Option
    onInitHeader: function (header, resource) {
        header.notUsedBookmark().setTitle(ecount.resource.LBL07280);
    },

    //Content
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings.setRowData(this.viewBag.InitDatas.LoadData)
            .setColumns([
                { propertyName: 'WID', id: 'wid', title: ecount.resource.LBL07154, width: 100, align: "center" },
                { propertyName: 'WDATE', id: 'wdate', title: ecount.resource.LBL07155, width: 200, align: "center" },
                { propertyName: 'GB_TYPE', id: 'gb_type', title: ecount.resource.LBL03614, width: 100, align: "center" },
                { propertyName: 'STATUS_TYPE', id: 'status_type', title: ecount.resource.LBL01519, width: '', align: "center" }
            ])
            .setRowDataNumbering(true, true)
            .setCustomRowCell("WDATE", this.setGridDataWDate.bind(this))
            .setCustomRowCell("GB_TYPE", this.setGridDataGbType.bind(this))
            .setCustomRowCell("STATUS_TYPE", this.setGridDataStatusType.bind(this))
            .setCustomRowCell("WID", this.setGridDataLinkProfile.bind(this))
            .setEmptyGridMessage(this.isLastDateShow ? "Last Update : " + this.lastData : "");

        var salesInvoiceNo = (this.TRX_DATE && this.TRX_DATE.length && this.TRX_DATE.length >= 8) ?
            ecount.infra.getECDateFormat('DATE10', false, this.TRX_DATE.toDate()) + "-" + this.TRX_NO : this.TRX_DATE + "-" + this.TRX_NO;

        //toolbar(툴바)
        toolbar.addLeft(ctrl.define("widget.label", "information").label(this.resource.LBL02498 + " : " + salesInvoiceNo));

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, settings);
    },

    //Footer(하단)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
         ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },


    /**********************************************************************
    * event grid listener [click, change...] 
    **********************************************************************/
    
    setProfileLink: function (userId) {
        var self = this;
        userId = userId.toLowerCase();

        var lstTmp = $.grep($(self.listUser), function (x) {
            return (x.USER_ID.toLowerCase() == userId);
        });

        if (lstTmp.length > 0)
            return true;
        
        return false;
    },

    //Set link 
    setGridDataLinkProfile: function (value, rowItem) {
        var self = this;
        var option = { controlType: "widget.label" };

        if (this.setProfileLink(rowItem.WID) === true) {
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                ecount.common.api({
                    url: '/Common/Menu/GetProfileUserInfomation',
                    data: { WRITER_ID: data.rowItem.WID },
                    ecPageID: self.ecPageID,
                    success: function (result) {
                        if (result.Status == "200" && result.Data.length != 0) {
                            var vData = result.Data.Data,
                            url = vData.DefaultImage;

                            if (vData.IS_EXIST) {
                                url = vData.FILE_PATH;
                            }

                            var userData = {
                                ID: vData.data.ID,
                                name: vData.data.UNAME,
                                site: vData.data.SITE_DES,
                                extNumber: vData.data.EXTENSION_PHONE,
                                phone: vData.data.HP_NO,
                                email: vData.data.EMAIL,
                                message: vData.CHAT_STATUS_PHRASE,
                                url: url, //image url 입니다.
                                authority: {    //sms를 권한을 체크합니다. 추후에 1:1대화나 쪽지보내기 기능이 추가되면 늘어날 수 있습니다.
                                        sms: vData.AuthSMS
                                },
                                chatYN: vData.CHAT_YN,
                                userName: vData.data.UNAME,
                                metaData: self._getPopupMetadata(),
                                memoPopupType: vData.MEMO_POPUP_TYPE,
                                RetUrl: result.Data.Data.RetUrl,
                                SessionData: result.Data.Data.SessionData,
                                PostData: result.Data.Data.PostData
                            };

                            ecount.profile.show(userData);
                        }
                    },
                    complete: function () {
                        self.hideProgressbar();
                    }
                   .bind(self)
                });

                e.preventDefault();
            }.bind(self)
            }
        }

        return option;
    },

    setGridDataWDate: function (e, data) {
        var option = {};

        if (data.STATUS_TYPE == "U")
            option.data = data.WDATE;
        else
            option.data = ecount.infra.getECDateFormat('date11', false, data.WDATE.toDatetime());
        
        return option;
    },

    setGridDataGbType: function (e, data) {
        var option = {},
            value;

        switch (data["GB_TYPE"]) {
            case "Z":
                value = ecount.resource.LBL02468;
                break;
            case "N":
                value = ecount.resource.LBL01209;
                break;
            case "Y":
                value = ecount.resource.LBL00723;
                break;
            default:
                value = "";
                break;

        }

        option.data = value;

        return option;
    },

    setGridDataStatusType: function (e, data) {
        var option = {},
            value;

        switch (data["STATUS_TYPE"]) {
            case "I":
                value = ecount.resource.LBL01770;
                break;
            case "M":
                value = ecount.resource.LBL01155;
                break;
            case "Z":
                value = ecount.resource.LBL05310;
                break;
            case "Y":
                value = ecount.resource.LBL01042;
                break;
            case "R":
                value = ecount.resource.LBL01382;
                break;
            case "C":
                value = ecount.resource.LBL00732;
                break;
            case "T":
                value = ecount.resource.LBL03448;
                break;
            case "B":
                value = ecount.resource.LBL02337;
                break;
            case "U":
                value = "";
                break;
            case "E":
                value = ecount.resource.LBL05852;
                break;
            case "/":
                value = ecount.resource.LBL19547;
                break;
            case "F":
                value = ecount.resource.LBL08134;
                break;
            case "N":
                value = ecount.resource.BTN01050;
                break;
            case "O":
                value = ecount.resource.BTN01051;
                break;
            default:
                value = ecount.resource.LBL06157;
                break;
        }

        option.data = value;

        return option;
    },

    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/ 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    //닫기버튼(Close Button)
    onFooterClose: function () {
        this.close();
        return false;
    },
});
