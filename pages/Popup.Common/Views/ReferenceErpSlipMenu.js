window.__define_resource && __define_resource("BTN00151","LBL02712","LBL09151","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.12.21
2. Creator     : 최진영(Choi Jin Young)
3. Description : ERP 참조 전체 MENU POPUP(The all menu popup for refering ERP slips)
4. Precaution  :
5. History     :
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ReferenceErpSlipMenu", {
    parentInfo: {},
    _rowItems: null, //원본 rowData
    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        /*pageOption Data
        {
            header: [{ label: '', type: 'label' }, { label: ecount.resource.BTN00151, type: 'link' }, { label: ecount.resource.LBL02712, type: 'link' }]
            , list: []
            , clickCallback: this.onRefErpMenuClick.bind(this)
        };
        */
        this.parentInfo = $.extend(this.parentInfo, options.pageOption);

    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        var menuName = ecount.resource.LBL09151;
        if (this.parentInfo.menuName != null && this.parentInfo.menuName != undefined)
            menuName = this.parentInfo.menuName;


        header.notUsedBookmark();
        header.setTitle(menuName).useQuickSearch();
    },

    onInitContents: function (contents) {


        var g = widget.generator,
            toolbar = g.toolbar(),
            toolbar2 = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();


        var columns = [];
        //GRID HEADER column 구성
        for (var i = 0; i < this.parentInfo.header.length; i++) {
            var tcol = { propertyName: 'COL' + i, id: 'COL' + i, title: this.parentInfo.header[i].label, width: '' };
            if (this.parentInfo.header[i].type == "link") {
                tcol.controlType = "widget.link";
                this.parentInfo.header[i].fnCustRowCell = function (idx) {
                    return function (value, rowItem) {
                        var option = {};
                        var colid = "COL" + idx;
                        //option.data = this.parentInfo.header[idx].label;
                        option.event = {
                            'click': function (e, data) {
                                var reqData = data.rawRowItem[colid + "_DATA"];
                                var param2 = {
                                    MENU_SEQ: this.parentInfo.MENU_SEQ,
                                    CLASS_CD: reqData.CLASS_CD,
                                    CLASS_SEQ: reqData.CLASS_SEQ
                                    //URL: url Api.Common.Infra
                                };

                                ecount.common.api({
                                    url: "/Common/Infra/SaveComnMenuHistory",
                                    data: Object.toJSON(param2),
                                    success: function (result) {
                                        if (result.Status != "200") {
                                            ecount.alert(result.Error);
                                            return;
                                        }
                                        if (this.parentInfo.clickCallback) {
                                            this.parentInfo.clickCallback(reqData);
                                            this.close();
                                        }

                                    }.bind(this)

                                });

                            }.bind(this)
                        };
                        return option;
                    };
                }(i).bind(this);
            }
            columns.push(tcol);
        }
        //GRID data 구성
        var rowItems = [];

        for (var i = 0; i < this.parentInfo.list.length; i++) {
            var row = this.parentInfo.list[i];
            var rowItem = {}
            for (var j = 0; j < row.length; j++) {
                rowItem["COL" + j] = row[j].label;
                if (row[j].data) {
                    rowItem["COL" + j + "_DATA"] = row[j].data;
                }
            }
            rowItems.push(rowItem);

        };
        this._rowItems = rowItems;

        grid
            .setRowData(rowItems)
            .setColumns(columns)
            .setColumnFixHeader(true);
        //Cust Row Cell Function 연결
        for (var i = 0; i < this.parentInfo.header.length; i++) {

            if (this.parentInfo.header[i].fnCustRowCell) {
                grid.setCustomRowCell('COL' + i, this.parentInfo.header[i].fnCustRowCell)     //참조게시글  
            }

        }

        contents.add(toolbar)
            .addGrid("dataGrid", grid)
            .add(toolbar2);

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(); // 닫기



        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {

    },

    //닫기버튼
    onFooterClose: function () {

        this.close();
    },
    onHeaderQuickSearch: function (event) {
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            if (!e.unfocus)
                this.header.getQuickSearchControl().setFocus(0);

            return;
        }

        var keyword = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();
        var searchList = this._rowItems;
        if (keyword != "")
        {
            searchList = this._rowItems.where(function (o, i) {

                return (o.COL0.toUpperCase().indexOf(keyword.toUpperCase()) != -1);
            });
        }

        grid.settings.setRowData(searchList);
        grid.draw();
    },
});