window.__define_resource && __define_resource("LBL04226","LBL12637","LBL01691","LBL01044","LBL02217","LBL18293","LBL18295","LBL18296","LBL18291","LBL18292","BTN00069","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.07.04
2. Creator     : 김정수
3. Description : 양식지설정 팝업
4. Precaution  :
5. History     : 2016-11-03 (안정환) - 올드 카운트
6. Old File    : 없음
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_46", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    pageOption: null,
    slipInfo: {
        IO_DATE: "",
        IO_NO: "",
        SER_NO: "",
        IO_TYPE: "",
        CUST: "",
        GB_TYPE: ""
    },
    printHtml: "",
    printCss: "",
    printOption: {},
    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("inventorylib.common");
    },

    initProperties: function () {
        this.pageOption = {}
    },

    render: function () {        
                this.pageOption = $.extend({}, this.pageOption, this.viewBag.DefaultOption || {});
                this.pageOption.Slips = this.pageOption.Slips || [];
                if (this.pageOption.Slips.length <= 0) {
                    this.pageOption.Slips.push(this.slipInfo);
                };
                for (var i = 0; i < this.pageOption.Slips.length; i++) {
                    this.pageOption.Slips[i]["FORM_GUBUN"] = "SF030";
                    this.pageOption.Slips[i]["CS_FLAG"] = this.pageOption.CS_FLAG;
                };
                this._super.render.apply(this);
            
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark().setTitle(ecount.resource.LBL04226);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            notice1 = g.settingPanel(),
            notice2 = g.settingPanel(),
            form = g.form(),
            toolbar1 = g.toolbar(),
            toolbar2 = g.toolbar();

        notice1.header(ecount.resource.LBL12637);

        toolbar1.addLeft(ctrl.define("widget.checkbox", "PRT_OPT", "PRT_OPT")
            .label([ecount.resource.LBL01691, ecount.resource.LBL01044, ecount.resource.LBL02217])
            .value(["cbOptionQuantity", "cbOptionStamp", "cbOptionDate"])
            .select(((this.pageOption.IsCheckQuantity || "0") == "1" ? "cbOptionQuantity" : "")
                , ((this.pageOption.IsCheckStamp || "0") == "1" ? "cbOptionStamp" : "")
                , ((this.pageOption.IsCheckDate || "0") == "1" ? "cbOptionDate" : ""))
            .end());


        notice2.header(ecount.resource.LBL18293);

        toolbar2.addLeft(ctrl.define("widget.radio", "prtNcnt", "PRT_NCNT")
            .label([ecount.resource.LBL18295, ecount.resource.LBL18296, ecount.resource.LBL18291, ecount.resource.LBL18292])
            .value([1, 2, 3, 4])
            .select(this.pageOption.PrintNcnt)
            .end());

        contents
            .add(notice1)
            .add(toolbar1)
            .add(notice2)
            .add(toolbar2);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "print").label(ecount.resource.BTN00069))
                //.addLeft(ctrl.define("widget.button", "print1").label(ecount.resource.BTN00069 + "(OLD)"))
                .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
    },

    ON_KEY_F8_PAGE: function () {
        this.ON_KEY_F8();
    },

    ON_KEY_F8: function () {
        this.onFooterPrint();
    },

    onFooterPrint: function () {

        var permission = (this.viewBag && this.viewBag.Permission.Self ? this.viewBag.Permission.Self : null);
        if (permission && permission.CP != true) {
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: permission.RESX ? ecount.resource[permission.RESX] : this.pageInfo.title, PermissionMode: "CP" }]).fullErrorMsg);
            return false;
        }


        var _self = this;
        var _checkedValue = this.contents.getControl("PRT_OPT").getCheckedValue();

        var param = {
            Request: {
                Slips: this.pageOption.Slips,    //layer용
                TAX_FLAG: this.TAX_FLAG,
                FORM_TYPE: 'SF035',
                FORM_SEQ: 1,
                Data: {
                    IsESD014R: this.pageOption.IsESD014R,
                    P_DES1: this.pageOption.P_DES1 || "",
                    P_DES2: this.pageOption.P_DES2 || "",
                    SIGN_GUBUN: (_checkedValue.indexOf("cbOptionStamp") < 0) ? 0 : 1, /*도장체크박스 선택여부 (where or not stamp check box)*/
                    DATE_FLAG: (_checkedValue.indexOf("cbOptionDate") < 0) ? 0 : 1, /*일자체크박스 선택여부 (where or not date check box)*/
                    ZERO_CHK: (_checkedValue.indexOf("cbOptionQuantity") < 0) ? 0 : 1, /*수량체크박스 선택여부 (where or not qty check box)*/
                    FROM_DATE: this.pageOption.FROM_DATE,
                    TO_DATE: this.pageOption.TO_DATE,
                    IsBill: this.pageOption.IsBill || false,
                    TwoPagesOfSheet: 1, /*2건인쇄 선택여부*/
                    PrintNcnt: this.contents.getControl("prtNcnt").getValue(),     /*2장인쇄 선택여부*/
                    TradingStatementPrintingYn: (this.pageOption.TradingStatementPrintingYn || "N"),
                }
            },
            width: ecount.infra.getPageWidthFromConfig(),
            height: 600,
            
        };

        this.loadHiddenPage({
            url: "/ECERP/SVC/ESD/ESD007P_02",
            data: param,
            progressbar: true,
            destroyImmediately : false,
            callback: function (page, destory) {                
                _self.getPrintHtml(page);
                destory();
            }.bind(this)
        });
        setTimeout(function () {
            _self.checkResult();
        }, 500);

    },
    //Close button click event
    onFooterClose: function () {
        this.close();
    },
    getPrintHtml: function (page) {
        this.printCss = page.printPageSet.printCss;
        this.printHtml = page.contents.getGrid().grid.getHTML().replace(/text-primary-inverse/g, "bsy").replace(/url\(\"/g, "url(").replace(/.gif"\)/g, ".gif)");
        this.printCss = "@media print{@page {size:A4;margin-top:11.3mm;margin-left:20.5mm;margin-right:4.6mm;margin-bottom:5.3mm;}} @page{size:A4;margin-top:11.3mm;margin-left:20.5mm;margin-right:4.6mm;margin-bottom:5.3mm;}@media print{html,body{min-width:184.9mm;overflow:hidden;}thead {display: table-header-group;}} .esd007_02_tbody_td3{font-size:10px; font-weight:normal; vertical-align:-7px; *vertical-align:0px} ";
        this.printHtml = "<style type='text/css'>" + this.printCss + "</style> " + this.printHtml;
        
        this.printOption = {
            gridWidth: page.printPageSet.gridWidth
                , htmlContent: this.printHtml
                , printCss: page.printPageSet.printCss
                , isContentAlignCenter: false
                , isHeightReSize: true
                , isOpenPopupPrint: false
                , isAnotherPrint: true
                , isBodyOnload: false
                , contentsMargin: { top: 0, right: 0, bottom: 0, left: 0 }
        };
        return page;
    },
    checkPrintHtml: function () {
        if ((this.printHtml || "") == "") return false;
        return true;
    },
    checkResult: function () {
        var _self = this;
        var successCallback = function (o) { };
        var faultCallback = function (o) { _self.onFooterClose(); };

        setTimeout(function () {
            if (_self.checkPrintHtml()) {
                ecount.document.setHistory({
                    CS_FLAG: (_self.pageOption.CS_FLAG || "None"),
                    Slips: _self.pageOption.Slips,    //layer용
                    SlipsInfos: Object.toJSON(_self.pageOption.Slips)    //popup용
                }, successCallback, faultCallback);
                var option = {
                    url: "/ECERP/Popup.Common/PrintLoadPage",
                    destroyImmediately: false,
                    callback: function (page, destroyFrame) {
                        console.log(page);
                        page.print(destroyFrame);
                        _self.onFooterClose();
                    }.bind(_self),
                    loadHiddenPage: _self.loadHiddenPage.bind(_self),
                    data: _self.printOption,
                    printCss: _self.printCss
                };
                _self.EXPORT_PRINT(option);
                return;
            }
            else {
                _self.checkResult();
            }
        }, 500);
    }
});