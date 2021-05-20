window.__define_resource && __define_resource("LBL00754","BTN00008","BTN00069");
/****************************************************************************************************
1. Create Date : 2016.10.19
2. Creator     : xxxx
3. Description : (세금)계산서구분
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECTAX023P_04", {
    gridObject: null,
    inPartList: null,
    //data: [],
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        debugger
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            CLASS_CD: this.CLASS_CD,
            PARAM: this.PARAM,
            Title: this.Title,
            TYPE: this.TYPE
        };

        this.inPartList = {};
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

        header.setTitle(this.Title).useQuickSearch();

    },


    //본문 옵션 설정
    onInitContents: function (contents) {
        debugger
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        if (this.TYPE == "M") {
            grid
                .setRowData(this.viewBag.InitDatas.CmcdList)
                .setRowDataUrl("/Account/Basic/GetCmcdSearchList")
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
                        if (this.inPartList[data.rowItem['ITEM3']] != undefined) {
                            var currentInPartList = this.inPartList[data.rowItem['ITEM3']];
                            for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
                                gridObject.setCell('CHK2', currentInPartList[i], gridObject.isChecked(data.rowKey));
                            }//for end
                        }
                    }.bind(this)
                })
                .setKeyColumn(['ITEM4', 'ITEM2'])
                .setColumns([
                    { propertyName: 'ITEM4', id: 'ITEM4', title: '구분', width: '100' },
                    {
                        propertyName: 'CHK2', id: 'CHK2', controlType: 'widget.checkbox', align: "center", width: '30',
                        columnOption: {
                            attrs: { 'disabled': true }
                        }
                    },
                   { propertyName: 'ITEM2', id: 'ITEM2', title: '검색', width: '' }
                ]);
            this.makeMergeData(this.viewBag.InitDatas.CmcdList);
        } else if (this.TYPE == "Y") {
            grid
                .setRowData(this.viewBag.InitDatas.CmcdList)
                .setRowDataUrl("/Account/Basic/GetCmcdSearchList")
                .setRowDataParameter(this.searchFormParameter)
            .setCheckBoxUse(true)
            .setColumns([{ propertyName: 'ITEM2', id: 'ITEM2', title: '구분', width: '' },

            ]);
        } else if (this.TYPE == "G") {
            grid
                .setRowData(this.viewBag.InitDatas.CmcdList)
                .setRowDataUrl("/Account/Basic/GetCmcdSearchList")
                .setRowDataParameter(this.searchFormParameter)
                .setCustomRowCell('ITEM2', this.setGridDateLink.bind(this))
                .setColumns([{ propertyName: 'ITEM2', id: 'ITEM2', title: ecount.resource.LBL00754, width: '' },

                ]);
        }
        else {
            grid
                .setRowData(this.viewBag.InitDatas.CmcdList)
                .setRowDataUrl("/Account/Basic/GetCmcdSearchList")
                .setRowDataParameter(this.searchFormParameter)
                .setCustomRowCell('ITEM2', this.setGridDateLink.bind(this))
                .setColumns([{ propertyName: 'ITEM2', id: 'ITEM2', title: '구분', width: '' },
            ]);

        }
        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);

    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             ctrl = widget.generator.control();

        if (["N","G"].contains(this.TYPE)) {
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        } else {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
                   .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        }
        footer.add(toolbar);
    },


    /*************************************  *********************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        if (this.keyword) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        if (!e.unfocus) {
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
        if (this.TYPE == "M")
            this.makeMergeData(data.result.Data);
    },


    makeMergeData: function (rowData) {

        //국세청전송메뉴에서 (세금)계산서구분에는 전자만 나오게 처리
        if (this.CLASS_CD == "TX09" && this.GUBUN == "99") {
            rowData.remove(function (item) { return item.ITEM3 == "1" });
        }

        var loadDateCnt = rowData.count();
        var InPart = '';
        for (var i = 0 ; i < loadDateCnt; i++) {
            var tempRowCnt = parseInt(rowData[i].ITEM10);

            if (i < loadDateCnt - 1 && tempRowCnt > 1 && InPart != rowData[i].ITEM3) {
                rowData[i]['_MERGE_SET'] = [];
                rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(0, tempRowCnt));
                rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(1, tempRowCnt));
            }

            if (this.inPartList[rowData[i].ITEM3] == undefined) {
                this.inPartList[rowData[i].ITEM3] = new Array();
            }

            this.inPartList[rowData[i].ITEM3].push(rowData[i].ITEM4 + '∮' + rowData[i].ITEM2);
            InPart = rowData[i].ITEM3;
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
        

        var value = this.keyword;
        if (!$.isEmpty(value))
            this.searchFormParameter.gridRenderFlag = "Y";

        if (data.totalDataCount === 1 && !this.isDeprecatedOnePopupClose && this.searchFormParameter.gridRenderFlag === "Y") {
            var obj = {};
            var d = data.dataRows[0];

            var message = {
                name: "ITEM2",
                code: "ITEM1",
                data: d,
                isAdded: true,
                addPosition: "next",
                callTypeData: this.callTypeData,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        gridObject = this.contents.getGrid().grid;

    },
    
    //구분 선택
    setGridDateLink: function (value, rowItem) {
        
        var option = {};
        var self = this;

        //기존 공통에 조건 넣어서 추가하는 것으로 채주영2016.11.21
        if (["G"].contains(this.TYPE)) {
            option.data = rowItem.ITEM2;
        }else{
            option.data = String.format("[{0}] {1}", rowItem.ITEM1, rowItem.ITEM2);
        }
        option.controlType = "widget.link";
        option.treeAttrs = {
            'class': ['text-uline-no', 'text-default']
        }
        option.event = {
            'click': function (e, data) {
                e.preventDefault();

                var message = {
                    name: "ITEM2",
                    code: "ITEM1",
                    data: data.rowItem,
                    //isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callTypeData: this.callTypeData,
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    //적용버튼
    onFooterApply: function (e) {
        var userIds;
        if (this.TYPE == "M") {
            var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
            userIds = new Array();
            var users = new Array();

            for (var i = 0, limit = rowList.length ; i < limit; i++) {
                if (rowList[i].CHK2 == true) {
                    if ($.inArray(rowList[i]["KEY"]["CLASS_SEQ"], users) == -1) {
                        userIds.push(rowList[i]);

                    }
                    users.push(rowList[i]["KEY"]["CLASS_SEQ"]);
                }
            }
        } else if (this.TYPE == "Y") {
            userIds = this.contents.getGrid().getCheckedItem();
        }

        var message = {
            name: "ITEM2",
            code: "ITEM1",
            data: userIds,
            isAdded: true,
            addPosition: "next",
            callTypeData:this.callTypeData,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색
    onContentsSearch: function (event) {
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            if (!e.unfocus)
                this.header.getQuickSearchControl().setFocus(0);

            return;
        }
        this.searchFormParameter.gridRenderFlag = "Y";
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue().keyword || '';
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.toggle(true);
    },



    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

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
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.gridRenderFlag = "Y";
        var grid = this.contents.getGrid();

        grid.draw(this.searchFormParameter);
    }

});