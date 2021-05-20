window.__define_resource && __define_resource("LBL13215","LBL04421","LBL13216","LBL13217","LBL07534","BTN00069","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2017.12.13
2. Creator     : 한아름
3. Description : 고객센타>온라인메뉴얼>튜토리얼
4. Precaution  : 고객센타>온라인메뉴얼>튜토리얼
5. History     :              
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGD002P_02", {
    PAGE_SIZE: 100,
    PAGE_CURRENT: 1,
/**********************************************************************
   *  page init
 **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = { LAN_TYPE: "ko-kr", SEARCH_KEYWORD: ""};
    },


    render: function () {        
        this._super.render.apply(this);
    },

/********************************************************************** 
* UI Layout setting
**********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL13215);
        var contents = widget.generator.contents(),
              form = widget.generator.form(),
              toolbar = widget.generator.toolbar()

        var ctrl = widget.generator.control();
        var ctrl2 = widget.generator.control();

       
        var list = this.LanguageList;
        var langOptions = [];

        for (var i = 0; i < list.length; i++) {
            langOptions.push([list[i].ITEM1, list[i].ITEM2]);
        }
        debugger;
        var quickLabel = ctrl.define("widget.select", "tutorial_lanType", "tutorial_lanType", ecount.resource.LBL04421).option(langOptions).select(this.LANG_TYPE).inline()
        var quickLabel2 = ctrl2.define("widget.input", "tutorial_input", "tutorial_input", "tutorial").value(this.SEARCH_KEYWORD).inline()

        header.add(quickLabel)
        header.add(quickLabel2);
        

    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
        debugger;

        settings
            .setRowData(this.viewBag.InitDatas.TutorialScenario)
            .setRowDataUrl('/Service/Tutorial/GetListTutorialScenarioSearch', false)
            .setRowDataParameter(this.searchFormParameter)            
            .setKeyColumn(['SCENARIO_ID'])
			.setColumnFixHeader(true)
            .setColumns([
                { propertyName: 'SCENARIO_ID', id: 'SCENARIO_ID', title: ecount.resource.LBL13216, align: 'center', width: 100 },
                { propertyName: 'SCENARIO_NM', id: 'SCENARIO_NM', title: ecount.resource.LBL13217, width: 'left', width: '' },
                { propertyName: 'SCENARIO_VIEW', id: 'SCENARIO_VIEW', title: ecount.resource.LBL07534, width: 80, align: 'center' },
            ])
            .setColumnSortable(false)
            //.setColumnSortExecuting(this.setColumnSortClick.bind(this))
            //.setColumnSortEnableList(['CODE_NO', 'CODE_DES', 'PERMISSION'])
            .setCustomRowCell('SCENARIO_ID', this.setScenarioID.bind(this))
            .setCustomRowCell('SCENARIO_NM', this.setScenarioNM.bind(this))
            .setCustomRowCell('SCENARIO_VIEW', this.setScenarioView.bind(this))
            .setCheckBoxUse(true)
			.setPagingUse(true)
            .setPagingCurrentPage(this.PAGE_CURRENT)
            .setPagingRowCountPerPage(this.PAGE_SIZE, true)
			.setPagingUseDefaultPageIndexChanging(true)

 

        contents
            .add(toolbar)
            .addGrid('dataGrid' + this.pageID, settings);
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
			ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

/**********************************************************************
* define common event listener
**********************************************************************/


/********************************************************************** 
* define grid event listener
**********************************************************************/
    // set grid SCENARIO_NM
    setScenarioNM: function (value, rowItem) {
        var option = [];
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                debugger;
                var message = {
                    name: "SCENARIO_NM",
                    code: "SCENARIO_ID",
                    data: data.rowItem,
                    isAdded: true,
                    addPosition: "next",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        }

        return option;
    },

    // set grid SCENARIO_ID
    setScenarioID: function (value, rowItem) {
        var option = [];
        option.data = rowItem.SCENARIO_NM_SEQ.split("-")[0];
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                debugger;
                var message = {
                    name: "SCENARIO_NM",
                    code: "SCENARIO_ID",
                    data: data.rowItem,
                    isAdded: true,
                    addPosition: "next",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        }

        return option;
    },

    // set grid SCENARIO_VIEW
    setScenarioView: function (value, rowItem) {
        var option = [];
        option.data = ecount.resource.LBL07534;
        option.controlType = "widget.link";
        var self = this;
        option.event = {
            'click': function (e, data) {
                ecount.alert(data.rawRowItem.SCENARIO_DESC);
            }.bind(this)
        }
        return option;
    },

/********************************************************************** 
* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
**********************************************************************/
    //Close button click event
    onFooterClose: function () {
        this.close();
    },

    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        debugger;

        var message = {
            name: "SCENARIO_NM",
            code: "SCENARIO_ID",
            data: selectedItem,
            isAdded: true,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        debugger;
        this.searchFormParameter.SEARCH_KEYWORD = event;  
        this.searchFormParameter.LAN_TYPE = this.header.getControl("tutorial_lanType").getValue();
       
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

    },

    //엔터
    ON_KEY_ENTER: function (e, target) {
        this.onContentsSearch(target.control.getValue());
    }
});