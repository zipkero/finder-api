/*************************************************************************************************
1. Create Date : 2016.08.18
2. Creator     : 장재희
3. Description : 연말정산 > 정산내역등록 > 소득공제 > 개인연금저축 > 금융회사 등 검색창
4. Precaution  : 
5. History     :             
****************************************************************************************************/

/***************화면 기본정의*******************/
ecount.page.factory("ecount.page.popup.type2", "CM305P", {
    fDataEdit: null,

    historyData: null,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: "",
            SEARCH_TYPE: "4"
        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    /********************************************************************** 
   * UI Layout setting
   **********************************************************************/
    // Header Initialization
    onInitHeader: function (header) {
        header
            .notUsedBookmark()
            .setTitle("금융회사코드 검색").useQuickSearch();
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid();

        grid
            .setRowData(this.viewBag.InitDatas.BankView)
            //.setRowDataUrl("/TAX2016/BASIC/GetPayBankSearch")
            .setRowDataUrl("/ECAPI/SVC/TaxCommon/Basic/GetListPayBankForSearch")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['BANK_CD'])
            .setColumns([
                { propertyName: "BANK_CD", id: 'BANK_CD', title: '금융회사코드', width: 100, align: 'center' },
                { propertyName: "BANK_DES", id: 'BANK_DES', title: '금융기관명', width: '' }
            ])
            .setCustomRowCell('BANK_CD', this.setGridDataLink.bind(this))
            .setCustomRowCell('BANK_DES', this.setGridDataLink.bind(this))

        contents.add(toolbar).addGrid("dataGrid", grid);
    },

    // 금융회사코드 매핑
    setGridDataLink: function (value, rowItem) {
        var self = this;
        var option = {};
        option.data = rowItem.SITE;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var message = {
                    name: "BANK_DES",
                    code: "BANK_CD",
                    data: data.rowItem,
                    isAdded: false,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };

                self.sendMessage(this, message);
            }.bind(this)
        }
        return option;
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label("닫기"));

        footer.add(toolbar);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    onLoadComplete: function (e) {
        this.header.getQuickSearchControl().setValue(this.PARAM);
        this.header.getQuickSearchControl().setFocus(0);
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.SEARCHTYPE = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
})