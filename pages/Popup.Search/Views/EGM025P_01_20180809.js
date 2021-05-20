window.__define_resource && __define_resource("LBL01669","LBL01595","LBL07171","LBL04331","BTN00426","BTN00351","BTN00756","BTN00603","BTN00004","MSG03839","BTN00069","BTN00008","MSG00962","MSG06800");
/****************************************************************************************************
1. Create Date : 2016.7.25
2. Creator     : Nguyen Minh Thien
3. Description : List Person search To,Cc.
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGM025P_01", {

    gridObject: null,

    inPartList: {},

    columns: null,

    isCount: 1,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.hidCancelYn = this.hidCancelYn ? this.hidCancelYn : "N";

        this.hidGwUse = this.hidGwUse ? this.hidGwUse : "0";
    },

    render: function () {
        this._super.render.apply(this);
    },

    initProperties: function () {
        //this.LIST_CODE_PERSON_CHK = [];

        this.userPermit = this.viewBag.Permission.Permit,
        this.searchFormParameter = {
            SEARCH_TEXT: this.keyword,
            CSFlag: this.CSFlag,
            GW_USE: this.hidGwUse,
            CANCEL: this.hidCancelYn,
            PAGE_SIZE: 100,
            PAGE_CURRENT: 1
        };
        this.checkMaxCount = this.checkMaxCount > 0 ? this.checkMaxCount : 100;
        this.columns = [
                { propertyName: 'SITE_DES', id: 'SITE_DES', title: ecount.resource.LBL01669, width: '' },
                { propertyName: 'CHK2', id: 'CHK2', controlType: 'widget.checkbox', align: "center", width: '30', columnOption: { attrs: { 'disabled': true } } },
                { propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL01595, width: '' },
                { propertyName: 'ID', id: 'ID', title: ecount.resource.LBL07171, width: '' }
        ];

        if (this.LIST_CODE_PERSON_CHK == undefined) { this.LIST_CODE_PERSON_CHK = []; }
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL04331)
        if (!this.CSFlag) {
            header.useQuickSearch();
            if (this.isIncludeInactive) {
                //퀵서치 추가
                var ctrl = widget.generator.control();

                var viewallres = ecount.resource.BTN00426;

                if (this.hidCancelYn == "N") {
                    viewallres = this.hidGwUse == '0' ? ecount.resource.BTN00426 : ecount.resource.BTN00351;
                }
                else {
                    viewallres = this.hidGwUse == '0' ? ecount.resource.BTN00756 : ecount.resource.BTN00603;
                }

                header.add(ctrl.define("widget.button", "viewall").label(viewallres).css("btn btn-sm btn-default").value("Y")); //view all
            }
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        if (this.CSFlag == true) {
            // control search content
            toolbar.attach(ctrl.define("widget.searchGroup", "search").setOptions({ label: ecount.resource.BTN00004 }));
            this.columns.remove(3);
            grid
                .setEventFocusOnInit(true)
                .setKeyboardCursorMove(true)
                .setKeyboardSpacebarForSelectRow(true)
                .setKeyboardEnterForExecute(true)
                .setKeyboardPageMove(true);
        }
        // Init Grid
        grid
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Groupware/CRM/GetListSelectPerson")
            .setRowDataParameter(this.searchFormParameter)
            //.setCheckBoxRememberChecked(false)
            .setCheckBoxUse(true)
            .setColumns(this.columns)
            .setCheckBoxCallback({
                'change': function (e, data) {
                    if (this.inPartList[data.rowItem['IN_PART']] != undefined) {
                        var currentInPartList = this.inPartList[data.rowItem['IN_PART']];
                        for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
                            var dataKey = currentInPartList[i];
                            var isChecked = gridObject && gridObject.isChecked(data.rowKey);
                            var rowItem = gridObject && gridObject.getRowItem(dataKey);
                            if (rowItem != null && rowItem != undefined) {
                                if (isChecked == true) {
                                    if (this.LIST_CODE_PERSON_CHK.where(function (item, i) { return item.value.toLowerCase() == rowItem.ID.toLowerCase() && item.label.toLowerCase() == rowItem.UNAME.toLowerCase() }).length == 0)
                                        this.LIST_CODE_PERSON_CHK.push({ value: rowItem.ID, label: rowItem.UNAME });
                                }
                                else {
                                    this.LIST_CODE_PERSON_CHK = this.LIST_CODE_PERSON_CHK.where(function (item, i) { return !(item.value.toLowerCase() == rowItem.ID.toLowerCase() && item.label.toLowerCase() == rowItem.UNAME.toLowerCase()) });
                                }
                            }
                            gridObject && gridObject.setCell("CHK2", dataKey, isChecked);
                        }//for end
                    }
                }.bind(this)
            })
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e));
            })
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setKeyColumn(['IN_PART', 'ID', 'UNAME'])
            .setCustomRowCell('CHK2', this.setCheckedCellGrid.bind(this))
            .setCustomRowCell('UNAME', this.setGridDataLink.bind(this))
            .setCustomRowCell('ID', this.setDataCellIDGrid.bind(this));

        this.makeMergeData(this.viewBag.InitDatas.LoadData);
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, grid);
    },

    firstToUpperCase: function (value) {
        if ( value.length > 1) {
            return value.substr(0, 1).toUpperCase() + value.substr(1);
        }
        else
            return value;
    },

    setDataCellIDGrid: function (value, rowItem) {
        var self = this,
          option = {};
        var value = rowItem["ID"] != null ? rowItem["ID"].toString() : "";
        option.data = self.firstToUpperCase(value);
        return option;
    },

    setCheckedCellGrid: function (value, rowItem) {
        var self = this,
            option = {};
        
        if (value === "" && this.LIST_CODE_PERSON_CHK) {
            var itemCheck = this.LIST_CODE_PERSON_CHK;
            var result = false;
                       
            for (var i = 0; i < itemCheck.length; i++) {
                var item = itemCheck[i];
                if (item && item.value && item.value.toString().toLowerCase() == rowItem.ID.toString().toLowerCase()
                     && (!$.isNull(item.label) && item.label.replace(/\s+/g, ' ') == rowItem.UNAME.toString())) {
                    result = true;
                    break;
                }                
            }            
            option.data = result;
        }

        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                var id = data.rowItem["ID"] != undefined ? data.rowItem["ID"].toString() : "",
                    name = data.rowItem["UNAME"] != undefined ? data.rowItem["UNAME"].toString().toLowerCase() : "",
                    cID = "",
                    cName = "",
                    rows = [],
                    row = {};
                
                rows = self.contents.getGrid().grid.getRowList();
                
                for (var i = 0; i < rows.length; i++) {
                    row = rows[i];
                    cID = row["ID"] != undefined ? row["ID"].toString().toLowerCase() : "";
                    cName = row["UNAME"] != undefined ? row["UNAME"].toString().toLowerCase() : "";

                    if (cID === id.toLowerCase() && cName === name && data.newValue == true) {
                        self.contents.getGrid().grid.setCell("CHK2", row["K-E-Y"], !data.newValue);
                    }
                }                
                // keep list selected
                if (data.newValue == true) {
                    this.LIST_CODE_PERSON_CHK = this.LIST_CODE_PERSON_CHK.where(function (item, i) { return !(item.value.toLowerCase() == id.toLowerCase() && item.label.toLowerCase() == name) });
                }
                else {
                    if (this.LIST_CODE_PERSON_CHK.where(function (item, i) { return item.value.toLowerCase() == id.toLowerCase() && item.label.toLowerCase() == name }).length == 0)
                        this.LIST_CODE_PERSON_CHK.push({ value: id, label: data.rowItem["UNAME"] });
                }
            }.bind(this)
        };

        return option;
    },

    setGridDataLink: function (value, rowItem) {
        var self = this,
           option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {                
                e.preventDefault();
                var d = data.rowItem;
                var userIds = new Array();
                var cnt = this.LIST_CODE_PERSON_CHK.length;
                // create list from person checked list
                this.LIST_CODE_PERSON_CHK.forEach(function (item, i) {
                    var user = {
                        ID: item.value,
                        UNAME: item.label
                    }
                    userIds.push(user);
                });
                cnt++;
                if (userIds.where(function (item, j) { return item.ID.toLowerCase() == d.ID.toLowerCase() && item.UNAME.toLowerCase() == d.UNAME.toLowerCase() }).length > 0) {
                    cnt--;
                }
                else {
                    d.ID = d.ID;
                    userIds.push(d);
                }
                if (cnt > this.checkMaxCount) {
                    ecount.alert(String.format(ecount.resource.MSG03839, this.checkMaxCount));
                }
                else {
                    var message = {
                        name: "UNAME",
                        code: "ID",
                        data: userIds,
                        isAdded: true,
                        addPosition: "next",
                        callback: this.close.bind(this),
                        Receiver_Type: this.Receiver_Type
                    };
                    self.sendMessage(self, message);
                }
            }.bind(this)
        }

        return option;
    },

    //Change colors for Notice rows 
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == 'Y')
            return true;
    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
               .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        if (this.CSFlag == true)
            toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        if (!e.unfocus) {
            if (this.CSFlag == true) {
                this.contents.getControl("search").setValue(this.keyword || '');
                this.contents.getControl("search").setFocus(0);
            }
            else {
                this.header.getQuickSearchControl().setValue(this.keyword || '');
                this.header.getQuickSearchControl().setFocus(0);
            }
        }
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.draw(this.searchFormParameter);        
    },

    // contents search
    onContentsSearch: function (event) {
        if (this.CSFlag == true) {
            this.searchFormParameter.SEARCH_TEXT = this.contents.getControl("search").getValue().keyword || '';
        }
        else {
            var invalid = this.header.getQuickSearchControl().validate();
            if (invalid.length > 0) {
                if (!e.unfocus)
                    this.header.getQuickSearchControl().setFocus(0);
                return;
            }
            this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl().getValue().keyword || '';
            this.header.toggle(true);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().draw(this.searchFormParameter);
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

    // grid Render complete
    onGridRenderComplete: function (e, data) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        var autoFlag = false;
        var d = {};
        if (data.totalDataCount == 1) {
            autoFlag = true;
            d = data.dataRows[0];            
        }
        else if (data.totalDataCount > 1) {
            autoFlag = true;
            d = data.dataRows[0];
            for (var i = 1; i < data.totalDataCount; i++) {
                if (data.dataRows[i].ID.toLowerCase() != d.ID.toLowerCase()) {
                    autoFlag = false;
                    break;
                }
            }
        }
        //else if (data.totalDataCount > 1) {
        //    d = data.dataRows[0];
        //    if (data.dataRows.where(function (item) { return item.ID.toLowerCase() == d.ID.toLowerCase() && item.UNAME.toLowerCase() == d.UNAME.toLowerCase() }).length == data.totalDataCount)
        //        autoFlag = true;
        //}
        

        if (autoFlag == true) {
            var userIds = new Array();
            var cnt = this.LIST_CODE_PERSON_CHK.length;
            // create list from person checked list
            this.LIST_CODE_PERSON_CHK.forEach(function (item, i) {
                var user = {
                    ID: item.value,
                    UNAME: item.label
                }
                userIds.push(user);
            });
            cnt++;
            if (userIds.where(function (item, j) { return item.ID.toLowerCase() == d.ID.toLowerCase() && item.UNAME.toLowerCase() == d.UNAME.toLowerCase() }).length > 0) {
                cnt--;
            }
            else {
                d.ID = d.ID;
                userIds.push(d);
            }
            if (cnt > this.checkMaxCount) {
                ecount.alert(String.format(ecount.resource.MSG03839, this.checkMaxCount));
            }
            else {
                var message = {
                    name: "UNAME",
                    code: "ID",
                    data: userIds,
                    isAdded: true,
                    addPosition: "next",
                    callback: this.close.bind(this),
                    Receiver_Type: this.Receiver_Type
                };
                this.sendMessage(this, message);
            }
        }

        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        gridObject = this.contents.getGrid().grid;
    },

    // Header reset button click
    // Sự kiện click nút reset
    onHeaderViewall: function (e) {

        if (this.hidCancelYn == 'N') {
            this.hidCancelYn = 'Y';
        }
        else {
            this.hidCancelYn = 'N';
        }
        this.reloadPage();
    },

    // Event Apply
    onFooterApply: function (e) {
        //var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
        var userIds = new Array();        
        var hasItem = false;
        var cnt = this.LIST_CODE_PERSON_CHK.length;

        if (cnt > this.checkMaxCount) {
            ecount.alert(String.format(ecount.resource.MSG03839, this.checkMaxCount));
        } else if (cnt == 0 && this.Receiver_Type == "G") {
            ecount.alert(ecount.resource.MSG00962);            
        } else {
            // create list from person checked list
            this.LIST_CODE_PERSON_CHK.forEach(function (item, i) {
                var user = {
                    ID: item.value,
                    UNAME: item.label
                }
                userIds.push(user);
                hasItem = true;
            });

            // Mr.Thai check it
            if (this.Receiver_Type == "G") {
                if (!hasItem) {
                    ecount.alert(ecount.resource.MSG06800);
                    return false;
                }
            }

            var message = {
                name: "UNAME",
                code: "ID",
                data: userIds,
                isAdded: true,
                addPosition: "next",
                callback: this.close.bind(this),
                Receiver_Type: this.Receiver_Type
            };
            this.sendMessage(this, message);
        }
    },

    // Event close
    onFooterClose: function () {
        this.close();
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

    // ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },

    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
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

            this.inPartList[rowData[i].IN_PART].push(rowData[i].IN_PART + "∮" +rowData[i].ID + "∮" +rowData[i].UNAME);

            InPart = rowData[i].IN_PART;
        }
        return rowData;
    },

    //reload page function 
    reloadPage: function () {
        var self = this;

        var url = "";

        url = "/ECERP/Popup.Search/EGM025P_01";
        params = {
            isIncludeInactive: self.isIncludeInactive,
            hidGwUse: self.hidGwUse,
            hidCancelYn: self.hidCancelYn,
        }

        this.onAllSubmitSelf({
            url: url,
            param: params
        });
    },
});
