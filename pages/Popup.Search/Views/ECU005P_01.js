window.__define_resource && __define_resource("LBL13152","LBL13163","LBL13164","BTN00008");
/****************************************************************************************************
1. Create Date : 2017.11.30
2. Creator     : 소병용(So ByeongYong)
3. Description : 직전상담원
4. Precaution  : 
5. History     : 
6. Old File : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECU005P_01", {
    pageID: null,

    header: null,

    contents: null,

    footer: null,
    /********************************************************************** 
* page user opion Variables(사용자변수 및 객체) 
**********************************************************************/
    //PastOnlineInquiryContents: null,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this.initProperties();
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
        this.searchFormParameter = {
            SortColumn: "",
            Sort: "",
            CATEGORY: viewBag.DefaultOption.Category,
            PARAM: viewBag.DefaultOption.Param
        };
    },

    /**********************************************************************
   * renter
   **********************************************************************/
    render: function () {
        this._super.render.apply(this);
    },

    /********************************************************************** 
       * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성)  
       **********************************************************************/
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL13152)
              .notUsedBookmark()
              .useQuickSearch();

        this._super.onInitHeader.apply(this, arguments);
    },

    onInitContents: function (contents, resource) {
        var g = widget.generator,
        grid = g.grid();
        debugger;

        grid
            .setRowData(this.viewBag.InitDatas.recentlyCounselor)
            .setKeyColumn(["REQ_DATE", "ECOUNT_NAME"])
            .setRowDataUrl("/Service/CustomerCenter/GetListCounselorRecently")
            .setSessionCreateLocationType(ecount.grid.constValue.locationType.GMC)
            .setRowDataParameter(this.searchFormParameter)
            .setColumnFixHeader(true)
            .setColumnSortable(true) // Sort whether from the grid
            .setCheckBoxUse(false) //Set whether to use checkboxes
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setColumns([
                {
                    propertyName: "REQ_DATE", id: "REQ_DATE", title: ecount.resource.LBL13163, width: "240", align:
                    "center"
                },
                { propertyName: "ECOUNT_NAME", id: "ECOUNT_NAME", title: ecount.resource.LBL13164, width: "200" }
            ])
            .setCustomRowCell("REQ_DATE", this.setReqDate.bind(this))
            .setCustomRowCell("ECOUNT_NAME", this.setCounselor.bind(this));
        
        contents.addGrid("dataGrid", grid); 
    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();

        toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
        this._super.onInitFooter.apply(this, arguments);
    },


    onInitControl: function (cid, control) {

    },

    // Event quick search (Tìm kiếm nhanh)
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.draw(this.searchFormParameter);
    },


    /********************************************************************** 
    * event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
    **********************************************************************/
    onLoadComplete: function (e) {
        if (this.Param) {
            this.header.getQuickSearchControl().setValue(this.Param);
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        this._super.onLoadComplete.apply(this, arguments);
    },

    onChangeControl: function (event, data) {
    },

    onFocusOutControlHandler: function (control) {
        this._super.onFocusOutControlHandler.apply(this, arguments);
    },

    onPopupHandler: function (control, config, handler) {

    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {

    },

    onMessageHandler: function (event, data) {

    },

    /********************************************************************** 
   * event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트) 
   **********************************************************************/


    /********************************************************************** 
   * event  [button, link, FN, optiondoropdown..] 
   **********************************************************************/
    //닫기
    onFooterClose: function () {
        this.close();
    },

    /********************************************************************** 
   * user function 
   **********************************************************************/
    //상담일자
    setReqDate: function (value, rowItem) {
        var option = {};
        option.data = this.fnDateFormat(rowItem.REQ_DATE);
        return option;
    },

    //직전상담원
    setCounselor: function (vlaue, rowItem) {
        var _self = this;
        var option = {};
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "ECOUNT_NAME",
                    code: "ECOUNT_ID",
                    data: data.rowItem,
                    isAdded: true,
                    callback: this.close.bind(this),
                };
                
                _self.sendMessage(_self, message);
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    //일자포맷
    fnDateFormat: function (value) {
        return ecount.infra.getECDateFormat('date10', false, value.toDate());
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SortColumn = data.columnId;
        this.searchFormParameter.Sort = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    }
});