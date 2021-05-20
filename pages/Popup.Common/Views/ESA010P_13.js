window.__define_resource && __define_resource("LBL00079","LBL05716","LBL00703","LBL01099","LBL01118","LBL10324","LBL01533","BTN00553","BTN00008","LBL00496");
/****************************************************************************************************
1. Create Date : 2015.10.25
2. Creator     : 전영준
3. Description : 품목등록 - 회계계정 직접 입력 
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_13", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    // apiUrl: '/Common/Basic/GetListForInspectType',
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        this.searchFormParameter = {
            IN_GYE_DES: null,
            OUT_GYE_DES: null,
            COST: null,
            PRODUCT_GYE_DES: null,
        };
    },

    initProperties: function () {

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
        header.setTitle(ecount.resource.LBL00079 + ecount.resource.LBL05716) // 회계계정 직접입력
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            data = this.viewBag.InitDatas.ListLoad;

        this.columns = [
                       //{ propertyName: 'PROD_TYPE_DES', id: 'PROD_TYPE_DES', title: ecount.resource.LBL00703, width: 200, align: 'left'}, // 구분 LBL00703
                       { propertyName: 'IN_GYE_DES', id: 'IN_GYE_DES', title: ecount.resource.LBL01099, width: 190, align: 'left', controlType: 'widget.code.account', editableState: 1 }, // 매입 LBL01099
                       { propertyName: 'OUT_GYE_DES', id: 'OUT_GYE_DES', title: ecount.resource.LBL01118, width: 190, align: 'left', controlType: 'widget.code.account', editableState: 1 }, // 매출 LBL01118 
                       { propertyName: 'COST', id: 'COST', title: ecount.resource.LBL10324, width: 190, align: 'left', controlType: 'widget.code.account', editableState: 1 }, // 매출원가  
                       { propertyName: 'PRODUCT_GYE_DES', id: 'PRODUCT_GYE_DES', title: ecount.resource.LBL01533, width: 190, align: 'left', controlType: 'widget.code.account', editableState: 1 }, // 생산 LBL01533
        ]
        //  data
        settings
                    .setEventWidgetTriggerObj(this.events)
                    .setRowData(this.viewBag.InitDatas.ListLoad)
                    .setColumnPropertyColumnName('id')
                    .setColumns(this.columns)
                    .setEditable(true, 1, 0)
        contents
                 .add(toolbar)
                 .addGrid("dataGrid", settings)
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar();
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00553).clickOnce())
                        .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function () {

        var grid = this.contents.getGrid().grid;
        var row = grid.getRowList()[0];

        this.contents.getGrid().grid.setCell("IN_GYE_DES", row[ecount.grid.constValue.keyColumnPropertyName], this.IN_GYE_DES);
        this.contents.getGrid().grid.setCell("OUT_GYE_DES", row[ecount.grid.constValue.keyColumnPropertyName], this.OUT_GYE_DES);
        this.contents.getGrid().grid.setCell("COST", row[ecount.grid.constValue.keyColumnPropertyName], this.COST);
        this.contents.getGrid().grid.setCell("PRODUCT_GYE_DES", row[ecount.grid.constValue.keyColumnPropertyName], this.PRODUCT_GYE_DES);

    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    //grid row의 특정 date관련  
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    // 적용
    onFooterApply: function () {

        var message = {
            data: this.contents.getGrid().grid.getRowList(),
            addPosition: "current",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },
    // Message Handler
    onMessageHandler: function (page, param) {
        var grid = this.contents.getGrid().grid;
        var code = "";

        if (param.control.id == "IN_GYE_DES") {
            code = "IN_GYE_CODE";
        } else if (param.control.id == "OUT_GYE_DES") {
            code = "OUT_GYE_CODE";
        } else if (param.control.id == "COST_GYE_DES") {
            code = "COST_GYE_CODE";
        } else {
            code = "PRODUCT_GYE_CODE";
        }
        grid.setCell(code, param.control.rowKey, param.data.GYE_CODE);
        grid.setCell(param.control.name, param.control.rowKey, param.data.GYE_DES);


        param.callback && param.callback();  // The popup page is closed   
    },
    onPopupHandler: function (control, config, handler) {

        config.name = ecount.resource.LBL00496 //"계정코드검색";
        handler(config);
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
        this.onFooterApply();
    },
    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    // ON_KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },
    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            this.gridObject.focus();
            this.gridFocus = null;
        }.bind(this);
    },
    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        this.setTimeout(function () { this.gridObject.focus(); }, 0);
    },
    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    // 그리드 포커스를 위한 함수
    gridFocus: function () { },
});




