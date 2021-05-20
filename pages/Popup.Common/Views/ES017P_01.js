window.__define_resource && __define_resource("LBL04173","LBL00329","LBL05100","LBL00899","LBL01742","LBL80163","LBL15145","LBL09351","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.11.18
2. Creator     : 전영준
3. Description : 판매입력> 품목검색> 최근거래 > 최근단가
4. Precaution  :
5. History     : 
            2016.03.28 (seongjun-Joe) 소스리팩토링.
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES017P_01", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/

    permission: null,

    tableIndicator: 0, //0 판매, 1 구매

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.permission = {
                sale: this.viewBag.Permission.PermitSale.Value,
                purchase: this.viewBag.Permission.PermitPurchase.Value
        };

    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL04173) // 최근단가

    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            tabContentsSale = generator.tabContents(),
            tabContentsPurchase = generator.tabContents(),
            ctrl = generator.control(),
            settingsCust = generator.grid(),
            settingsSale = generator.grid(),
            settingsPurchase = generator.grid(),
            custInfo = this.viewBag.InitDatas.CustInfo[0];
            sale = this.dataFormatting(this.viewBag.InitDatas.ListLoad[0]),
            purchase = this.dataFormatting(this.viewBag.InitDatas.ListLoad[1]);

        //권한
        this.setPermission();
        //거래처
        settingsCust
            .setRowData(custInfo)
            .setCustomRowCell('CUST_DES', this.setGridDateLinkCust.bind(this))
            .setCustomRowCell('PROD_DES', this.setGridDateLinkProd.bind(this))
            .setColumns([
                { propertyName: 'CUST_DES', id: 'CUST_DES', title: ecount.resource.LBL00329, width: 185, editable: false },
                { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL05100, width: 185, editable: false },
            ])
        contents
        .addGrid("cust" + this.pageID, settingsCust)

        if (this.permission.sale !== "X") {
            //판매
        settingsSale
            .setRowData(sale)
            .setKeyColumn(['IO_DATE'])
            .setCustomRowCell('PRICE', this.setGridDateLink.bind(this))
            .setColumns([
                    { propertyName: 'IO_DATE', id: 'IO_DATE', title: ecount.resource.LBL00899 + "-" + ecount.resource.LBL01742, width: 185, editable: false },
                    { propertyName: 'PRICE', id: 'PRICE', title: ecount.resource.LBL80163, width: 185, dataType: '9' + this.DECP, align: 'right', isCheckZero: false },
            ])
            tabContentsSale
                .createActiveTab("details", ecount.resource.LBL15145)

            contents
                .add(tabContentsSale)
                .addGrid("sale" + this.pageID, settingsSale)
        }
        if (this.permission.purchase !== "X") {
            //구매
        settingsPurchase
           .setRowData(purchase)
           .setKeyColumn(['IO_DATE'])
           .setCustomRowCell('PRICE', this.setGridDateLink.bind(this))
           .setColumns([
                   { propertyName: 'IO_DATE', id: 'IO_DATE', title: ecount.resource.LBL00899 + "-" + ecount.resource.LBL01742, width: 185, editable: false },
                   { propertyName: 'PRICE', id: 'PRICE', title: ecount.resource.LBL80163, width: 185, dataType: '9' + this.DECP, align: 'right', isCheckZero: false },
           ])
        tabContentsPurchase
                .createActiveTab("details2", ecount.resource.LBL09351)
        contents
            .add(tabContentsPurchase)
            .addGrid("purchase" + this.pageID, settingsPurchase)
        }
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {

    },
   
    setPermission: function () {
        //판매 권한
        if (this.permission.sale === "M" || this.permission.sale === "E") {
            this.permission.sale = "W";
        } else {
            this.permission.sale = this.viewBag.Permission.PermitSale.Value;
        }
        //구매 권한
        if (this.permission.purchase === "M" || this.permission.purchase === "E") {
            this.permission.purchase = "W";
        } else {
            this.permission.purchase = this.viewBag.Permission.PermitSale.Value;
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    dataFormatting: function (data) {

        var list = [];
        for (var i = 0, len = data.length; i < len; i++) {
            var obj = {
                "IO_DATE": data[i].IO_DATE + "-" + data[i].IO_NO,
                "PRICE": data[i].PRICE,
                "IN_PRICE": data[i].IN_PRICE,
                "OUT_PRICE": data[i].OUT_PRICE,
                "SIZE_DES": data[i].SIZE_DES,
                "TAX": data[i].TAX,
                "SIZE_FLAG": data[i].SIZE_FLAG,
                "BAL_FLAG": data[i].BAL_FLAG,
                "PROD_DES": data[i].PROD_DES,
                "UNIT": data[i].UNIT,
                "SER_NO": data[i].SER_NO,
                "ROWNUM": data[i].ROWNUM,
                "USER_PRICE_VAT": data[i].USER_PRICE_VAT || 0
            }
            list.push(obj);
        }
        this.tableIndicator++;
        return list;
    },

    selectedRow: function (rowdata) {

        var ioType = this.IO_TYPE.substring(0, 1),
            data = rowdata,
            table = this.viewBag.InitDatas.ListLoad[2];
          
        data = {
                PROD_CD: this.PROD_CD,
            PROD_DES: data.PROD_DES,
            IN_PRICE: ioType === "1" ? data.IN_PRICE : data.PRICE,
            PRICE: ioType === "1" ? data.PRICE : data.OUT_PRICE,
            SpecialPrice: "0",
                InPriceVat: "0",
            OutPriceVat: "0",
            ExchRate: "0",
            SpriceVat: "0",
                SIZE_DES: data.SIZE_DES,
                SALETAX: data.TAX,
            SIZE_FLAG: data.SIZE_FLAG,
            BAL_FLAG: data.BAL_FLAG,
            ChkFlag: "N",
            TAX: table ? table.TAX:"",
            VAT_YN: table ? table.VAT_YN : "",
            USER_PRICE_VAT: data.USER_PRICE_VAT || 0

        }
            return data;

    },
    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {

        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                
                var rowdata = this.selectedRow(data.rowItem),
                    message = {
                        data: rowdata,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    setGridDateLinkCust: function (value, rowItem) {
        var option = {};
        option.data = this.CUST + "[" + value + "]";
        option.controlType = "widget.label";
        return option;
    },
    setGridDateLinkProd: function (value, rowItem) {
        var option = {};
        option.data = this.PROD_CD + "[" + value + "]";
        option.controlType = "widget.label";
        return option;
    }
    /**********************************************************************
    *  event listener  ==>  [grid]
    **********************************************************************/

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

});
