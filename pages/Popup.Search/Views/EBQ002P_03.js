window.__define_resource && __define_resource("LBL07157","LBL07154","LBL07155","LBL01519","LBL02498","BTN00008","LBL01770","LBL01155");
/****************************************************************************************************
1. Create Date : 2016.03.10
2. Creator     : 소병용
3. Description : 회계전표 이력(History for Sales Invoice III)
4. Precaution  :
5. History     : 
6. Old File    : EBG001P_02.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "EBQ002P_03", {
    pageID: null,

    header: null,

    contents: null,

    footer: null,
    /**********************************************************************
    *  page init
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/

    //Header Option
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        var title = ecount.resource.LBL07157;

        header.setTitle(title)
    },

    //Content
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            columns = [];

        columns.push({
            propertyName: 'WRITER_ID',
            id: 'WRITER_ID',
            title: ecount.resource.LBL07154,
            width: 100,
            align: "center"
        });

        columns.push({
            propertyName: 'WRITE_DT',
            id: 'WRITE_DT',
            title: ecount.resource.LBL07155,
            width: 200,
            align: "center"
        });

        columns.push({
            propertyName: 'STATUS',
            id: 'STATUS',
            title: ecount.resource.LBL01519,
            width: 100,
            align: "center"
        });

        settings.setRowData(this.history)
            .setColumns(columns)
            .setRowDataNumbering(true, true)
            .setCustomRowCell("WRITER_ID", this.setGridDataWid.bind(this))
            .setCustomRowCell("WRITE_DT", this.setGridDataWDate.bind(this))
            .setCustomRowCell("STATUS", this.setGridDataStatusType.bind(this))
            .setEmptyGridMessage(this.IsLastDateShow ? "Last Update : " + this.lastData : "");

        var salesInvoiceNo = (this.PayDate && this.PayDate.length && this.PayDate.length >= 8) ?
           ecount.infra.getECDateFormat('DATE10', false, this.PayDate.toDate()) + "-" + this.PayNo
           : this.PayDate + "-" + this.PayNo;
        //toolbar(툴바)
        toolbar
            .addLeft(ctrl.define("widget.label", "information").label(this.resource.LBL02498 + " : " + salesInvoiceNo));

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
           
    },

    //Footer(하단)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
         ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        
    },


    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    setGridDataWDate: function (e, data) {
        var option = {};
        option.data = ecount.infra.getECDateFormat('date11', false, data.WRITE_DT.toDatetime());
        return option;
    },

    setGridDataWid: function (e, data) {
        var option = {};
        option.data = data["WRITER_ID"];
        return option;
    },

    setGridDataStatusType : function(e, data){
        var option = {},
            value;

        switch (data["STATUS"]) {
            case "I":
                value = ecount.resource.LBL01770;
                break;
            case "M":
                value = ecount.resource.LBL01155;
                break;
                break;
            default:
                value = ecount.resource.LBL01155;
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
