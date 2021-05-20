window.__define_resource && __define_resource("LBL11065","MSG05280","LBL00342","LBL09629","BTN00008");

ecount.page.factory("ecount.page.popup.type2", "EBA001P_19", {
    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
        this.initConfig();
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        header.setTitle(resource.LBL11065);
        header.notUsedBookmark();
    },

    //데이터 병합에 필요한 변수 세팅
    initConfig: function () {

    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();

        toolbar.addLeft(ctrl.define("widget.label", "warning")
            .label(String.format(ecount.resource.MSG05280, ecount.resource.LBL00342))
            .useHTML())
            .end();

        grid
            .setRowData(this.viewBag.InitDatas.PageData)
            .setColumns([
                { propertyName: 'GYE_CODE', id: 'GYE_CODE', title: ecount.resource.LBL00342, width: '130', align: 'center' },
                { propertyName: 'ERROR_MESSAGE', id: 'ERROR_MESSAGE', title: ecount.resource.LBL09629, width: '480' },
            ])
            .setColumnFixHeader(true);

        contents.add(toolbar)
                .addGrid("dataGrid", grid);
    },



    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar
            .attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {

    },

    //X버튼 클릭시
    onClosedPopupHandler: function (control) {
        this.sendMessage(this, {});
    },

    //닫기버튼
    onFooterClose: function () {
        this.sendMessage(this, {});
        this.close();
    },

    /**********************************************************************
   *  기능 처리
   **********************************************************************/

});