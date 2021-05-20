window.__define_resource && __define_resource("LBL07157","LBL11657","LBL11865","LBL11658","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.03.10
2. Creator     : 소병용
3. Description : 회계전표 이력(History for Sales Invoice III)
4. Precaution  :
5. History     : 
6. Old File    : EBG001P_02.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "EBQ002P_04", {
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
        
        if (this.isTransferDateShow) {
            columns.push({
                propertyName: 'COUNT',
                id: 'COUNT',
                title: ecount.resource.LBL11657,
                width: 100,
                align: "center"
            });

            columns.push({
                propertyName: 'AMOUNT',
                id: 'AMOUNT',
                title: ecount.resource.LBL11865,
                width: 350,
                align: "center"
            });
        }
        columns.push({
            propertyName: 'ERROR_CODE',
            id: 'ERROR_CODE',
            title: ecount.resource.LBL11657,
            width: 100,
            align: "center"
        });

        columns.push({
            propertyName: 'ERROR_MESSAGE',
            id: 'ERROR_MESSAGE',
            title: ecount.resource.LBL11658,
            width: 350,
            align: "center"
        });
        settings.setRowData(this.Error)
            .setColumns(columns)
            .setRowDataNumbering(true, true)

        contents
            //.add(toolbar)
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
