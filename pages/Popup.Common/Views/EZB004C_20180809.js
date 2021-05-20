window.__define_resource && __define_resource("LBL00063","LBL00014","LBL00020","MSG02580","LBL09068","LBL03043","LBL00008","LBL00012","MSG02576","BTN00008");
ecount.page.factory("ecount.page.popup.type2", "EZB004C", {

    pageID: null,

    //header: null,

    //contents: null,

    //footer: null,

    ecConfig: null,//"config.account", "config.inventory", "config.groupware", "config.company", "config.user", "config.feature", "config.nation", "company", "user"


/**************************************************************************************************** 
* user opion Variables(사용자변수 및 객체) 
****************************************************************************************************/





/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.ecConfig = [];
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
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

        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL00063);

    },

    onInitContents: function (contents) {


        //위젯기본 인스턴스 생성
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();


        var lstSetting = [];
        Object.values(this.viewBag.InitDatas.mapSetting).forEach(function (item) {
            lstSetting.push({
                Title: item.Title,
                Required: item.Required,
                MaxLength: (item.Integer == 0) ? item.MaxLength.toString() : String.format(ecount.resource.LBL00014 + ":{0}<br/>" + ecount.resource.LBL00020 + ":{1}", item.Integer, (item.MaxLength - item.Integer).toString()),
                Tip: item.Tip
            });
        });
        lstSetting.push({
            Title: "ecount",
            Required: true,
            MaxLength: "",
            Tip: ecount.resource.MSG02580
        });
        settings
            .setColumns([
                { propertyName: 'Title', id: 'Title', title: ecount.resource.LBL09068, width: 250 }, //필드명
                { propertyName: 'Required', id: 'Required', title: ecount.resource.LBL03043, width: 80, align: 'center' }, //필수항목
                { propertyName: 'MaxLength', id: 'MaxLength', title: ecount.resource.LBL00008, width: 80, align: 'center' }, //최대자리
                { propertyName: 'Tip', id: 'Tip', title: ecount.resource.LBL00012, width: 375 }   // 설명
            ])
            //상단 고정
            .setColumnFixHeader(false)
            //기본컬럼정렬사용안함
            .setColumnSortable(false)
            //헤더표시
            .setColumnVisible(true)
            .setCheckBoxUse(false)
            .setPagingUse(false)
            .setCustomRowCell('Required', function (value, rowItem, dataTypeConvertota) {
                var option = {};
                option.attrs = { 'class': 'text-center text-bold' };
                option.data = (rowItem.Required) ? "V" : "";
                return option;
            })
            .setCustomRowCell('Title', function (value, rowItem, dataTypeConvertota) {
                var option = {};
                if (rowItem.Required) {
                    option.attrs = { 'class': 'text-bold' };
                    option.data = value;
                } else {
                    option.data = value;
                }
                return option;
            })
            .setRowData(lstSetting);

        contents.add(ctrl.define("widget.label").label("<div class=\"wrapper-remark\">" + ecount.resource.MSG02576.unescapeHTML() + "</div>").useHTML());
        //컨텐츠에 툴바, 그리드 추가
        contents
            .addGrid("dataGrid", settings);

    
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) { },



/**************************************************************************************************** 
* define common event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (event) {

        var grid = this.contents.getGrid();
        grid.draw();
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (message) { },

    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },

    //onFocusOutHandler: function (event) { },
    

/****************************************************************************************************
* define grid event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) { },

    onGridAfterFormLoad: function (e, data, grid) { },


/**************************************************************************************************** 
* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    }

/**************************************************************************************************** 
*  define hotkey event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
****************************************************************************************************/
    





/**************************************************************************************************** 
* define user function 
****************************************************************************************************/



});