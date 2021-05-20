window.__define_resource && __define_resource("LBL10769","LBL10768","LBL10834","LBL06621","LBL10767","BTN00113","BTN00351","LBL00703","LBL00397","BTN00069","BTN00008","MSG00962","LBL00011","BTN00603");
/****************************************************************************************************
1. Create Date : 2016.06.01
2. Creator     : HO NGUYEN CONG THANH
3. Description : Request Quality Inspection
4. Precaution  : 
5. History     : 2017-02-20 NgocHoang - refactoring
                 2020.03.19 (DucThai): A20_00795 - 조건양식설정 - 시리얼/로트No.내역조회/현황
                 2020.03.30 [DucThai] A20_00803 - 조건양식설정 - 품질검사조회/인쇄
            
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESQ310P_02", {
    gridObject: null,
    inPartList: {},
    //data: [],
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            keyword: this.keyword,
            Item1: '',
            Item3: '',
            Title: this.Title,
            dataType: this.dataType,
            DEL_FLAG: 'N'
        };

        if (this.isIncludeInactive == null) this.isIncludeInactive = true;
    },

    render: function () {
        this.setLayout({ columns: [{ width: 230 }, { width: 230 }] });
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        var ctrl = widget.generator.control(),
            contents = widget.generator.contents(),
            form1 = widget.generator.form(),
            toolbar = widget.generator.toolbar();

        header.notUsedBookmark();
        if (this.Title === '1')
            header.setTitle(ecount.resource.LBL10769).useQuickSearch();
        else if (this.Title === '2')
            header.setTitle(ecount.resource.LBL10768).useQuickSearch();
        else if (this.Title === '3')//this is for widget slip_type (esq207r)
            header.setTitle(ecount.resource.LBL10834).useQuickSearch();
        else if (this.Title === 'SN01')
            header.setTitle(ecount.resource.LBL06621).useQuickSearch();
        else
            header.setTitle(ecount.resource.LBL10767).useQuickSearch();

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))
        //if (this.isIncludeInactive) {
        //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        //}

        //담당자코드, 담당자명 검색어
        if (this.Title == "3") {
            form1.add(ctrl.define("widget.input.codeName", "SearchItem3", "SearchItem3", ecount.resource.LBL00703).end())
                .add(ctrl.define("widget.input.codeName", "SearchItem1", "SearchItem1", ecount.resource.LBL06621).end());
        }
        else if (this.Title == 'SN01') {
            form1.add(ctrl.define("widget.input.codeName", "SearchItem1", "SearchItem1", ecount.resource.LBL06621).end());
        }
        else {
            form1.add(ctrl.define("widget.input.codeName", "SearchItem3", "SearchItem3", ecount.resource.LBL00703).end())
                .add(ctrl.define("widget.input.codeName", "SearchItem1", "SearchItem1", ecount.resource.LBL00397).end());
        }

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid(),
            self = this;
        grid
            .setRowData(this.viewBag.InitDatas.RequestQCList)
            .setRowDataUrl("/Common/Infra/GetRequestQualityControl")
            .setRowDataParameter(this.searchFormParameter)
            .setCheckBoxRememberChecked(false)
            .setCheckBoxUse(true)


        if (this.Title == "3") {
            grid
             .setCustomRowCell('ITEM1', this.setGridItem1.bind(this))
             .setCustomRowCell('ITEM3', this.setGridItem3.bind(this))
             .setCheckBoxHeaderCallback({
                 'change': function (e, data) {
                     self.gridObject.checkAllCustom('CHK2', data.target.checked);
                 }
             })
             .setCheckBoxCallback({
                 'change': function (e, data) {
                     if (this.inPartList[data.rowItem['ITEM2']] != undefined) {
                         var currentInPartList = this.inPartList[data.rowItem['ITEM2']];
                         for (var i = 0, limit = currentInPartList.length; i < limit; i++) {
                             var dataKey = currentInPartList[i];
                             self.gridObject.setCell("CHK2", dataKey.substr(0, 8) + "∮" + dataKey.substr(8, 8), self.gridObject.isChecked(data.rowKey));
                         }//for end
                     }
                 }.bind(this)
             })
             .setKeyColumn(['ITEM3', 'ITEM1'])
             .setColumns([
             { propertyName: 'ITEM3', id: 'ITEM3', title: ecount.resource.LBL00703, width: '' },
             {
                 propertyName: 'CHK2', id: 'CHK2', controlType: 'widget.checkbox', align: "center", width: '30',
                 columnOption: {
                     attrs: { 'disabled': true }
                 }
             },
             { propertyName: 'ITEM1', id: 'ITEM1', title: ecount.resource.LBL06621, width: '' }
             ]);
            if (this.viewBag.InitDatas.RequestQCList)
                this.viewBag.InitDatas.RequestQCList = this.makeMergeData(this.viewBag.InitDatas.RequestQCList);

            contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
        }
        else if (this.Title == 'SN01') {
            grid
                .setCustomRowCell('ITEM1', this.setGridItem1.bind(this))
                .setKeyColumn(['ITEM1'])
                .setColumns([
                   { propertyName: 'ITEM1', id: 'ITEM1', title: ecount.resource.LBL06621, width: '' }
                ]);

            contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
        }
        else {
            grid
                .setCustomRowCell('ITEM1', this.setGridItem1.bind(this))
                .setCustomRowCell('ITEM3', this.setGridItem3.bind(this))
                .setCheckBoxHeaderCallback({
                    'change': function (e, data) {
                        self.gridObject.checkAllCustom('CHK2', data.target.checked);
                    }
                })
                .setCheckBoxCallback({
                    'change': function (e, data) {
                        if (this.inPartList[data.rowItem['ITEM2']] != undefined) {
                            var currentInPartList = this.inPartList[data.rowItem['ITEM2']];
                            for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
                                var dataKey = currentInPartList[i];
                                self.gridObject.setCell("CHK2", dataKey.substr(0, 8) + "∮" + dataKey.substr(8, 8), self.gridObject.isChecked(data.rowKey));
                            }//for end
                        }
                    }.bind(this)
                })
                .setKeyColumn(['ITEM3', 'ITEM1'])
                .setColumns([
                    { propertyName: 'ITEM3', id: 'ITEM3', title: ecount.resource.LBL00703, width: '' },
                    {
                        propertyName: 'CHK2', id: 'CHK2', controlType: 'widget.checkbox', align: "center", width: '30',
                        columnOption: {
                            attrs: { 'disabled': true }
                        }
                    },
                   { propertyName: 'ITEM1', id: 'ITEM1', title: ecount.resource.LBL00397, width: '' }
                ]);
            if (this.viewBag.InitDatas.RequestQCList)
                this.viewBag.InitDatas.RequestQCList = this.makeMergeData(this.viewBag.InitDatas.RequestQCList);

            contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
        }
    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        //keyHelper = [10, 11];

        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
                .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        //.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridAfterRowDataLoad: function (e, data) {
        this._super.onGridAfterRowDataLoad.apply(this, arguments);
        if (this.Title != 'SN01' && data.result.Data)
            data.result.Data = this.makeMergeData(data.result.Data);
    },

    makeMergeData: function (rowData) {
        var loadDateCnt = rowData.count();
        var resultData = [];

        for (var i = 0 ; i < loadDateCnt; i++) {
            var item = rowData[i];
            if (!item._displayed_) {
                item._displayed_ = true;
                resultData.push(item);

                if (item.ITEM2 != null) {
                    if (this.inPartList[item.ITEM2] == undefined) {
                        this.inPartList[item.ITEM2] = new Array();
                    }

                    this.inPartList[item.ITEM2].push(item.ITEM3 + item.ITEM1);
                }

                var totalRow = 1;
                for (var j = i + 1; j < loadDateCnt; j++) {
                    var nextItem = rowData[j];
                    if ((!nextItem._displayed_) && nextItem.ITEM2 == item.ITEM2 && nextItem.ITEM2 != null) {
                        nextItem._displayed_ = true;
                        resultData.push(nextItem);
                        ++totalRow;
                        if (item.ITEM2 != null)
                            this.inPartList[item.ITEM2].push(nextItem.ITEM3 + nextItem.ITEM1);
                    }
                }
                if (totalRow > 1) {
                    item['_MERGE_SET'] = [];
                    item['_MERGE_SET'].push(this.setRowSpanMerge(0, totalRow));
                    item['_MERGE_SET'].push(this.setRowSpanMerge(1, totalRow));
                }
            }
        }
        return resultData;
    },

    // rowspan merge
    setRowSpanMerge: function (startIndex, rowCnt) {
        var mergeData = {};

        mergeData['_MERGE_USEOWN'] = true;
        if (startIndex == 0)
            mergeData['_IS_CENTER_ALIGN'] = true;
        mergeData['_MERGE_START_INDEX'] = startIndex;
        mergeData['_ROWSPAN_COUNT'] = rowCnt;
        return mergeData;
    },

    setGridItem1: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.label";
        option.data = ecount.resource[value];

        return option;
    },

    setGridItem3: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.label";
        option.data = ecount.resource[value];

        return option;
    },

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.totalDataCount == 1) {
            var obj = {};
            var d = data.dataRows[0];

            d["ITEM1"] = ecount.resource[d["ITEM1"]] || d["ITEM1"];
            d["ITEM3"] = d["Key"]["CLASS_SEQ"];

            var message = {
                name: "ITEM1",
                code: "ITEM5",
                data: d,
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        this.gridObject = this.contents.getGrid().grid;
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    //적용버튼
    onFooterApply: function (e) {
        if (this.Title == "3") {
            var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
            var userIds = new Array();
            var users = new Array();
            var hasItem = false;
            for (var i = 0, limit = rowList.length; i < limit; i++) {
                if (rowList[i].CHK2 == true) {
                    if ($.inArray(rowList[i]["KEY"]["CLASS_SEQ"], users) == -1) {
                        rowList[i]["ITEM1"] = ecount.resource[rowList[i]["ITEM1"]];
                        rowList[i]["ITEM5"] = (rowList[i]["ITEM5"]).toString();
                        userIds.push(rowList[i]);

                    }
                    users.push(rowList[i]["KEY"]["CLASS_SEQ"]);
                    hasItem = true;
                }
            }//for end
            if (!hasItem) {
                ecount.alert(ecount.resource.MSG00962);
                return false;
            }
            var message = {
                name: "ITEM1",
                code: "ITEM5",
                data: userIds,
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        else if (this.Title == "SN01") {//using  Inv II > Serial/Lot No. > Serial/Lot No. Slip List > wiget SlipType
            var selectedItem = this.contents.getGrid("dataGrid" + this.pageID).getCheckedItem(); // get checked items
            if (selectedItem.length == 0) {
                ecount.alert(ecount.resource.MSG00962);
                return false;
            }
            else {
                for (var i = 0, limit = selectedItem.length ; i < limit; i++) {
                    selectedItem[i]["ITEM1"] = ecount.resource[selectedItem[i]["ITEM1"]]; //set resource for ITEM1, ex ITEM1 = LBL00011
                }//for end

                var message = {
                    name: "ITEM1",
                    code: "ITEM5",
                    data: selectedItem,
                    isAdded: true,
                    addPosition: "next",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }
        }
        else {
            var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
            var userIds = new Array();
            var users = new Array();
            var hasItem = false;
            for (var i = 0, limit = rowList.length ; i < limit; i++) {
                if (rowList[i].CHK2 == true) {
                    if ($.inArray(rowList[i]["KEY"]["CLASS_SEQ"], users) == -1) {
                        rowList[i]["ITEM1"] = ecount.resource[rowList[i]["ITEM1"]];
                        rowList[i]["ITEM5"] = (rowList[i]["KEY"]["CLASS_SEQ"] - 1).toString();
                        userIds.push(rowList[i]);

                    }
                    users.push(rowList[i]["KEY"]["CLASS_SEQ"]);
                    hasItem = true;
                }
            }//for end
            if (!hasItem) {
                ecount.alert(ecount.resource.MSG00962);
                return false;
            }
            var message = {
                name: "ITEM1",
                code: "ITEM5",
                data: userIds,
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        //var invalid = this.header.getQuickSearchControl().validate();
        //if (invalid.length > 0) {
        //    if (!e.unfocus)
        //        this.header.getQuickSearchControl().setFocus(0);
        //    return;
        //}

        this.searchFormParameter.keyword = '';
        this.searchFormParameter.Title = this.Title;
        this.searchFormParameter.dataType = this.dataType;
        this.searchFormParameter.Item1 = this.header.getControl("SearchItem1") != null ? this.header.getControl("SearchItem1").getValue() : '';
        this.searchFormParameter.Item3 = this.header.getControl("SearchItem3") != null ? this.header.getControl("SearchItem3").getValue() : '';

        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
            else {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            }
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    onChangeControl: function (control, data, command) {
    },

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else
            this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.Title = this.Title;
        this.searchFormParameter.dataType = this.dataType;
        this.searchFormParameter.keyword = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.Item1 = '';
        this.searchFormParameter.Item3 = '';

        var grid = this.contents.getGrid();
        grid.draw(this.searchFormParameter);
    }
});