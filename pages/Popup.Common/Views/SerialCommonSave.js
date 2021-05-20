window.__define_resource && __define_resource("LBL07973","LBL06069","MSG06371","MSG06372","LBL11337","LBL09867","LBL11387","LBL11388","BTN00063","BTN00766");

ecount.page.factory("ecount.page.popup.type2", "SerialCommonSave", {
    isSaveClose: false,
    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        //this.ListData = this.PageData;
        this._super.render.apply(this);

        this.initConfig();
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL07973);
        header.notUsedBookmark();
    },

    //데이터 병합에 필요한 변수 세팅
    initConfig: function () {
       
    },

    onInitContents: function (contents) {
        debugger
        var g = widget.generator,
            toolbar1 = g.toolbar(),
            toolbar2 = g.toolbar(),
            toolbar3 = g.toolbar(),
            toolbar4 = g.toolbar(),
            toolbar5 = g.toolbar(),
            toolbar6 = g.toolbar(),
            grid1 = g.grid(),
            grid2 = g.grid(),
            grid3 = g.grid(),
            grid4 = g.grid(),
            ctrl = g.control(),
            form = g.form();

        var titleDate = ecount.resource.LBL06069;
        var msgWarning1 = ecount.resource.MSG06371;
        var msgWarning2 = ecount.resource.MSG06372;
        var titleCus = ecount.resource.LBL11337;
        var titleTotalQty = ecount.resource.LBL09867;

        var DEC_Q = ecount.config.inventory.DEC_Q || 0;
        
        if (this.viewBag.InitDatas.ResidualData || this.viewBag.InitDatas.ResidualDataT) {
            toolbar1.addLeft(ctrl.define("widget.label", "warning1").label(msgWarning1).useHTML()).end();
        }
        if (this.viewBag.InitDatas.ResidualData) {
            toolbar3.addLeft(ctrl.define("widget.label", "title1").label(ecount.resource.LBL11387).useHTML()).end();
            grid1
              .setRowData(this.viewBag.InitDatas.ResidualData)
              .setColumns([
                  { propertyName: 'SERIAL_IDX', id: 'SERIAL_IDX', title: titleDate, width: '130' },
                  { propertyName: 'PROD_CD', id: 'PROD_CD', title: titleCus, width: '200' },
                  { propertyName: 'TOTAL_QTY', id: 'TOTAL_QTY', title: titleTotalQty, width: '150', align: 'right', isCheckZero: true, dataType: '9' + DEC_Q }
              ])
              .setColumnFixHeader(true)
            contents.add(toolbar1)
            if(this.viewBag.InitDatas.MakeCheck)
                contents.add(toolbar3)
            contents.addGrid("gridObj1", grid1)
        }

        if (this.viewBag.InitDatas.ResidualDataT) {
            toolbar4.addLeft(ctrl.define("widget.label", "title2").label(ecount.resource.LBL11388).useHTML()).end();
            grid3
            .setRowData(this.viewBag.InitDatas.ResidualDataT)
            .setColumns([
                { propertyName: 'SERIAL_IDX', id: 'SERIAL_IDX', title: titleDate, width: '130' },
                { propertyName: 'PROD_CD', id: 'PROD_CD', title: titleCus, width: '200' },
                { propertyName: 'TOTAL_QTY', id: 'TOTAL_QTY', title: titleTotalQty, width: '150', align: 'right', isCheckZero: true, dataType: '9' + DEC_Q }
            ])
            .setColumnFixHeader(true)
            if (!this.viewBag.InitDatas.ResidualData)
                contents.add(toolbar1)
            if (this.viewBag.InitDatas.MakeCheck)
                contents.add(toolbar4)
            contents.addGrid("gridObj3", grid3)
        }


        if (this.viewBag.InitDatas.RedundancyData || this.viewBag.InitDatas.RedundancyDataT) {
            toolbar2.addLeft(ctrl.define("widget.label", "warning2").label(msgWarning2).useHTML()).end();
        }
        if (this.viewBag.InitDatas.RedundancyData) {
            toolbar5.addLeft(ctrl.define("widget.label", "title3").label(ecount.resource.LBL11387).useHTML()).end();
            grid2
                .setRowData(this.viewBag.InitDatas.RedundancyData)
                .setColumns([
                    { propertyName: 'SERIAL_IDX', id: 'SERIAL_IDX', title: titleDate, width: '130' },
                    { propertyName: 'PROD_CD', id: 'PROD_CD', title: titleCus, width: '200' }
                ])
                .setColumnFixHeader(true)
            contents.add(toolbar2)
            if (this.viewBag.InitDatas.MakeCheck)
                contents.add(toolbar5)
            contents.addGrid("gridObj2", grid2);
        }
        if (this.viewBag.InitDatas.RedundancyDataT) {
            toolbar6.addLeft(ctrl.define("widget.label", "title4").label(ecount.resource.LBL11388).useHTML()).end();
            grid4
                    .setRowData(this.viewBag.InitDatas.RedundancyDataT)
            .setColumns([
                { propertyName: 'SERIAL_IDX', id: 'SERIAL_IDX', title: titleDate, width: '130' },
                { propertyName: 'PROD_CD', id: 'PROD_CD', title: titleCus, width: '200' }
            ])
            .setColumnFixHeader(true)
            if (!this.viewBag.InitDatas.RedundancyData)
                contents.add(toolbar2)
            if (this.viewBag.InitDatas.MakeCheck)
                contents.add(toolbar6)
            contents.addGrid("gridObj4", grid4)
        }
        
    },



    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00063));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00766));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {

    },

    //저장
    onFooterSave: function () {
        this.isSaveClose = true;
        var data = {
            validate: true,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, data);
    },

    //닫기버튼
    onFooterClose: function () {
        this.isSaveClose = false;
        var data = {
            validate: false,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, data);
    },
    onClosedPopupHandler: function () {
        if (this.isSaveClose)
            return false;
        var data = {
            validate: false,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, data);
    }
    /**********************************************************************
   *  기능 처리
   **********************************************************************/

});