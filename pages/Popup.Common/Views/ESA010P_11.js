window.__define_resource && __define_resource("LBL35133","LBL11726","LBL04245","LBL00961","LBL35197","LBL35198","LBL35199","LBL35200","LBL35201","LBL35202","LBL35203","LBL35204","LBL35205","BTN00065","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.10.14
2. Creator     : 전영준
3. Description : 품목등록 단가 A to Z 팝업
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_11", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    /********************************************************************** 
    * page init 
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
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL35133 + ' A to J ' + ecount.resource.LBL11726) //단가그룹

    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
            data = this.viewBag.InitDatas.ListLoad;
        this.columns = [
                       //{propertyName: 'column1', id: 'column1', title: '', width: 100, align: 'center', controlType: 'widget.userHelpMark'},
                       { propertyName: 'column1', id: 'column1', title: '', width: 100, align: 'center', controlType: 'widget.label' },
                       {propertyName: 'column_input', id: 'column_input', title: ecount.resource.LBL04245, width: 200, controlType: 'widget.input', editableState: 1 },
        ]
     var columnData = [
                          { 'column1':ecount.resource.LBL00961 , 'column_input': data.PRICE_1, 'name': 'PRICE_1' },
                          { 'column1':ecount.resource.LBL35197, 'column_input': data.PRICE_2, 'name': 'PRICE_2' },
                          { 'column1':ecount.resource.LBL35198 , 'column_input': data.PRICE_3, 'name': 'PRICE_3' },
                          { 'column1':ecount.resource.LBL35199 , 'column_input': data.PRICE_4, 'name': 'PRICE_4' },
                          { 'column1':ecount.resource.LBL35200 , 'column_input': data.PRICE_5, 'name': 'PRICE_5' },
                          { 'column1':ecount.resource.LBL35201 , 'column_input': data.PRICE_6, 'name': 'PRICE_6' },
                          { 'column1':ecount.resource.LBL35202 , 'column_input': data.PRICE_7, 'name': 'PRICE_7' },
                          { 'column1':ecount.resource.LBL35203 , 'column_input': data.PRICE_8, 'name': 'PRICE_8' },
                          { 'column1':ecount.resource.LBL35204 , 'column_input': data.PRICE_9, 'name': 'PRICE_9' },
                          { 'column1': ecount.resource.LBL35205, 'column_input': data.PRICE_10, 'name': 'PRICE_10' },
     ]
      //  data
        settings
                 .setRowData(columnData)
                 .setColumnPropertyColumnName('id')
                 .setColumns(this.columns)
                 .setEditable(true, 1, 0)
                 .setCustomRowCell('column1', this.setGridExpectDateLink.bind(this))
        contents
                 .add(toolbar)
                 .addGrid("dataGrid", settings)
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar();
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce())
                      .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))

        footer.add(toolbar);
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function () {

       
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },


    setGridExpectDateLink: function (value, rowItem) {
        var option = {};
        option.parentAttrs = { 'class': ['bg-gray'] };
        return option;
    },
    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    type: 'infomation',
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
                this.close();
            }.bind(this)
        };
        return option;
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    // 저장
    onFooterSave: function () {
       
        arraySaveData = {
            PRICE_1: "", PRICE_2: "", PRICE_3: "",PRICE_4: "",PRICE_5: "", PRICE_6: "", PRICE_7: "", PRICE_8: "",PRICE_9: "", PRICE_10: "",
        };
           this.contents.getGrid().grid.getRowList().where(function (entity, i) {
               var idx = i + 1;
               switch (idx) {
                   case 1: arraySaveData.PRICE_1 = entity.COLUMN_INPUT
                       break;
                   case 2: arraySaveData.PRICE_2 = entity.COLUMN_INPUT
                       break;
                   case 3: arraySaveData.PRICE_3 = entity.COLUMN_INPUT
                       break;
                   case 4: arraySaveData.PRICE_4 = entity.COLUMN_INPUT
                       break;
                   case 5: arraySaveData.PRICE_5 = entity.COLUMN_INPUT
                       break;
                   case 6: arraySaveData.PRICE_6 = entity.COLUMN_INPUT
                       break;
                   case 7: arraySaveData.PRICE_7 = entity.COLUMN_INPUT
                       break;
                   case 8: arraySaveData.PRICE_8 = entity.COLUMN_INPUT
                       break;
                   case 9: arraySaveData.PRICE_9 = entity.COLUMN_INPUT
                       break;
                   case 10: arraySaveData.PRICE_10 = entity.COLUMN_INPUT
                       break;
                   default:
                       break;
               }
            }.bind(this))
           ecount.common.api({
               url: '/SelfCustomize/Config/SavePriceGroupInfo',
               data: Object.toJSON(arraySaveData),
               success: function (result) {
                   this.footer.getControl('Save').setAllowClick();
                   this.setTimeout(function () {
                       var message = {
                           callback: this.close.bind(this)
                       };
                       this.sendMessage(this, message);
                       this.close();
                   }.bind(this), 0);
               }.bind(this)
           })

    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
            this.onFooterSave();
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

