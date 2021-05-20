window.__define_resource && __define_resource("LBL04331","BTN00113","BTN00351","LBL01669","LBL01595","LBL00359","LBL00381","BTN00069","BTN00008","MSG03839","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.08.08
2. Creator     : Nguyen Minh Thien
3. Description : List Person search CS.
4. Precaution  : 
5. History     : 
            
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGM025P_06", {
    gridObject: null,
    inPartList: {},
    //data: [],
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            SEARCH_TEXT: this.keyword,
            PROGRAM_ID: this.PROGRAM_ID
        };
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
        header.setTitle(ecount.resource.LBL04331).useQuickSearch();
        //if (this.isIncludeInactive) {
        //퀵서치 추가
        var contents = widget.generator.contents(),
        tabContents = widget.generator.tabContents(),
        form1 = widget.generator.form(),
        form2 = widget.generator.form(),
        toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

        if (this.isIncludeInactive) {
            toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //view all    
            //프로젝트코드, 프로젝트명 검색어
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL01669).end())
                    .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL01595).end())
            contents.add(form1);    //검색어
            contents.add(toolbar);  //버튼
            header.add("search")
           .addContents(contents);
        }





       
        // }
    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        grid
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Groupware/CRM/GetListSelectSharePerson")
            .setRowDataParameter(this.searchFormParameter)
            .setCheckBoxRememberChecked(false)
            .setCheckBoxUse(true)
           .setCheckBoxHeaderCallback({
               'change': function (e, data) {
                   gridObject.checkAllCustom('CHK2', data.target.checked);
               }
           })
            .setCheckBoxCallback({
                'change': function (e, data) {

                    if (this.inPartList[data.rowItem['IN_PART']] != undefined) {
                        var currentInPartList = this.inPartList[data.rowItem['IN_PART']];
                        for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
                            var dataKey = currentInPartList[i];
                            gridObject.setCell("CHK2", dataKey, (data.oldValue != true ? (data.rowItem['CHK2'] == false ? !data.rowItem['CHK2'] : data.rowItem['CHK2']) : data.rowItem['CHK2'] = false));
                        }//for end
                    }
                }.bind(this)
            })
            .setKeyColumn(['IN_PART', 'CUST_IDX'])
            .setCustomRowCell('CHK2', this.setCheckedCellGrid.bind(this))
            .setColumns([
                { propertyName: 'IN_PART', id: 'IN_PART', title: ecount.resource.LBL01669, width: '' },
                {
                    propertyName: 'CHK2', id: 'CHK2', controlType: 'widget.checkbox', align: "center", width: '30',
                    columnOption: {
                        attrs: { 'disabled': true }
                    }
                },
               { propertyName: 'COMPANY_DES', id: 'COMPANY_DES', title: ecount.resource.LBL00359, width: '' },
               { propertyName: 'CUST', id: 'CUST', title: ecount.resource.LBL00381, width: '' }
            ]);
        //if ($.isArray(this.viewBag.InitDatas.LoadData))
        //    this.makeMergeData(this.viewBag.InitDatas.LoadData);
        this.makeMergeData(this.viewBag.InitDatas.LoadData);

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);

    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
               .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setValue(this.keyword || '');
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
        this.makeMergeData(data.result.Data);
        //if ($.isArray(data.result.Data))
        //    this.makeMergeData(data.result.Data);
    },
    setCheckedCellGrid: function (value, rowItem) {
        var option = {};
        //var a = 0;
        //var itemClick = this.inPartList['NO TITLE1'];
        if (this.LIST_CODE_PERSON_CHK) {
            //var itemCheck = this.LIST_CODE_PERSON_CHK.split('∬');
            //option.data = value === "" ? (itemCheck.contains(rowItem.CUST) ? true : false) : value;
            var itemCheck = this.LIST_CODE_PERSON_CHK.where(function (obj) {
                return obj.value.toLowerCase() === rowItem.CUST.toLowerCase() && (!$.isNull(obj.label) && obj.label.toString().replace(/\s+/g, ' ') == rowItem.COMPANY_DES)
            });
            option.data = value === "" ? (itemCheck.length > 0 ? true : false) : value;
        }
        return option;
    },
    makeMergeData: function (rowData) {
        var loadDateCnt = rowData.count();
        var InPart = '';

        for (var i = 0 ; i < loadDateCnt; i++) {
            var tempRowCnt = parseInt(rowData[i].ROW_CNT);

            if (i < loadDateCnt - 1 && tempRowCnt > 1 && InPart != rowData[i].IN_PART) {
                rowData[i]['_MERGE_SET'] = [];
                rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(0, tempRowCnt));
                rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(1, tempRowCnt));
            }

            if (this.inPartList[rowData[i].IN_PART] == undefined) {
                this.inPartList[rowData[i].IN_PART] = new Array();
            }

            this.inPartList[rowData[i].IN_PART].push(rowData[i].IN_PART + "∮" + rowData[i].CUST_IDX);
            InPart = rowData[i].IN_PART;
        }
        return rowData;
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

    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.totalDataCount == 1) {
            var obj = {};
            var d = data.dataRows[0];

            d["SITE_DES"] = d["SITE_DES"];
            // d["UNAME"] = d["KEY"]["SORT_CNT"];

            var message = {
                name: "COMPANY_DES",
                code: "CUST", //?? ITEM5
                data: d,
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        gridObject = this.contents.getGrid().grid;

    },

    //체크박스 체크갯수 제한
    //setItemCountMessage: function (count) {
    //    ecount.alert(String.format(ecount.resource.MSG03839, count));
    //},

    //적용버튼
    onFooterApply: function (e) {
        var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
        var userIds = new Array();
        var users = new Array();
        var hasItem = false;

        for (var i = 0, limit = rowList.length ; i < limit; i++) {
            if (rowList[i].CHK2 == true) {
                if ($.inArray(rowList[i]["CUST"], users) == -1) {
                    // rowList[i]["IN_PART"] = rowList[i]["IN_PART"];
                    //rowList[i]["ITEM5"] = (rowList[i]["KEY"]["CLASS_SEQ"]-1).toString();
                    userIds.push(rowList[i]);

                }
                // users.push(rowList[i]["KEY"]["CUST"]);
                hasItem = true;
            }
        }//for end
        if (!hasItem) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "COMPANY_DES",
            code: "CUST",
            data: userIds,
            isAdded: true,
            addPosition: "next",
            callback: this.close.bind(this),
            Receiver_Type: this.Receiver_Type
        };
        this.sendMessage(this, message);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        //var invalid = this.contents.getControl("Search").validate();
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            if (!e.unfocus)
                this.header.getQuickSearchControl().setFocus(0);

            return;
        }

        this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl().getValue().keyword || '';
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.toggle(true);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    onChangeControl: function (control, data, command) {

        var aaaa = "";
    },

    // KEY_F8
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target))
            this.onContentsSearch(target.control.getValue());
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();

        grid.draw(this.searchFormParameter);
    }

});
