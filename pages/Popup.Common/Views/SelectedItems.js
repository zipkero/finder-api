window.__define_resource && __define_resource("MSG07830","MSG07944","LBL03638","LBL00703","LBL04414","MSG02158","BTN00069","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2017.06.27
2. Creator     : 변경> 항목선택
3. Description : 변경> 항목선택
4. Precaution  : 
5. History     : 2018.01.02(LOC) A17_03177_Dev5735 리소스 적용이 잘못된 내용 수정 (Change resource MSG07830 -> MSG07944)
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "SelectedItmes", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
     ****************************************************************************************************/
    selectedItems: null,
    _data: [],
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    initProperties: function (options) {
    },

    render: function ($parent) {
        
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        header
            .setTitle(ecount.resource.LBL03638)
            .notUsedBookmark();
    },
    onInitContents: function (contents) {
        var thisObj = this,
            generator = widget.generator,
            grid = generator.grid();
        var self = this;
        var gridDatas = this.getGridDatas();

        grid
            .setColumns([
                { propertyName: 'id', id: 'id', title: ecount.resource.LBL00703, isHideColumn: true },
                { propertyName: 'title', id: 'title', controlType: 'widget.lable', title: ecount.resource.LBL04414, width: '' },
            ])
            .setEventWidgetTriggerObj(this.events)
            //.setFormData({ columns: this.viewBag.FormInfos.Columns })            
            .setRowData(gridDatas)
            .setKeyColumn(['id'])
            .setColumnSortable(false)
            .setCheckBoxUse(true)
            .setCheckBoxInitialCheckedItems(this.CheckItemList)

            //.setColumnPropertyColumnName('id')

            .setStyleTreeOpenOnInit(true)
            .setStyleTreeNoReOrder(true)
            .setStyleTreeGrid(true, "title")
            .setStyleTreeColumnSort(false)

            .setCheckBoxCountingDeterminer(function (rowItem) {
                var isParent = thisObj.contents.getGrid().grid.hasChildRow(rowItem[ecount.grid.constValue.keyColumnPropertyName]),
                    isAllChildCheckboxDisabled = thisObj.contents.getGrid().grid.hasChildRow(rowItem[ecount.grid.constValue.keyColumnPropertyName], true, { searchDepth: 1 })

                //if (this.viewBag.DefaultOption.disableColumns && this.viewBag.DefaultOption.disableColumns.contains(rowItem.id))
                //    self.contents.getGrid().grid.addChecked(rowItem[ecount.grid.constValue.keyColumnPropertyName]);

                if (isParent) {
                    if (isAllChildCheckboxDisabled) {
                        return true;
                    }
                    else
                        return false;
                }
                else {
                    return true;
                }
            }.bind(this))
            .setCheckBoxCallback({
                'change': function (e, data) {
                    var gridObj = thisObj.contents.getGrid('dataGrid').grid,
                        isParent = gridObj.hasChildRow(data.rowKey),
                        isChecked = gridObj.isChecked(data.rowKey);

                    if (isParent === true) {
                        gridObj.setCheckWithChild(data.rowKey, isChecked);
                    }

                }
            })
            .setCustomRowCell('CHK_H', function (value, rowItem) {
                var option = {};
                var self = this;
                if ((this.viewBag.DefaultOption.disableColumns || []).contains(rowItem[ecount.grid.constValue.keyColumnPropertyName])) {
                    option.attrs = {
                        'disabled': true,
                        'checked': true
                    };
                };
                return option;
            }.bind(this))
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardEnterForExecute(true)
            .setCheckboxUseDisableCheck(true)
            .setCheckBoxMaxCount(thisObj.maxCnt || 5)
            .setCheckBoxMaxCountExceeded(
                function (maxcount) {
                    var popupId = this.popupID.split('_');

                    var start = popupId[0];
                    if (start == "EMM015P") {
                        ecount.alert(String.format(ecount.resource.MSG07944, maxcount || 5));
                    } else {
                        ecount.alert(String.format(ecount.resource.MSG02158, maxcount || 5));
                    }

                }.bind(this)
            );

        contents.addGrid("dataGrid", grid);
    },

    onInitFooter: function (footer) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00069).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        var keyHelper = new Array();
        keyHelper.push(10);
        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    /*상단에 퀵서치 영역 처리하는 부분*/
    onHeaderQuickSearch: function (e, value) {
        var grid = this.contents.getGrid("dataGrid");
        var searchParam = { "Keyword": (this.header.getQuickSearchControl().getValue() || "") };
        this.contents.getGrid("dataGrid").grid.clearChecked();
        this.contents.getGrid("dataGrid").draw(searchParam);
    },

    setGridDateCheck: function (value, rowItem) {
        var option = {};
        var self = this;
        if (rowItem["related"] != "") {
            option.attrs = {
                'disabled': true
            };
        }
        return option;
    },

    /*tree를 그리기 위해서 가공*/
    onGridAfterRowDataLoad: function (e, data) {
        var result = data.result.Data;

        $.each(result, function (i, data1) {
            if (data1["COLUMN"] == "1" || data1["COLUMN"] == "2" || data1["COLUMN"] == "3" || data1["COLUMN"] == "4" || data1["COLUMN"] == "5") {
                data1["GROUP_CODE"] = data1["COLUMN"];
                data1["_TREE_SET"] = { "_PARENT_GROUP_ID": "0000" };
            }
            else if (data1["related"] != "") {
                data1["GROUP_CODE"] = data1["related"];
                data1["_TREE_SET"] = { "_PARENT_GROUP_ID": data1["related"] };
            }
            else {
                data1["GROUP_CODE"] = data1["DOMAIN_TYPE"];
                data1["_TREE_SET"] = { "_PARENT_GROUP_ID": data1["DOMAIN_TYPE"] };
            };
        });
    },

    onFooterSave: function (e) {
        var self = this;
        var btn = this.footer.get(0).getControl("save");

        var checkedData = null;
        try {
            checkedData = this.contents.getGrid("dataGrid").grid.getChecked(null, {
                sortOrder: "asc",
                sortColumn: "index"
            });
        }
        catch (e) {
            checkedData = this.contents.getGrid("dataGrid").grid.getChecked();
        };

        var isChecked = true;
        if ($.isEmpty(this.viewBag.InitDatas.TreeSetColumns) == true) {
            if (checkedData.length === 0) isChecked = false;
        } else {
            isChecked = checkedData.contains(function (x) {
                return x._TREE_SET != null && x._TREE_SET._PARENT_GROUP_ID != "0000";
            }); // [수정필요: 박현민] 페이지를 신규로 연결
        }

        if (isChecked == false) {
            ecount.alert(ecount.resource.MSG00962);
            btn.setAllowClick();
        }
        else {
            this.modifyItems = checkedData;

            var message = {
                data: checkedData,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message); /*처리 이후 호출한 페이지에 message 전송.*/
        };

    },

    onFooterClose: function () {
        var thisObj = this;
        thisObj.close();
    },

    getGridDatas: function () {
        var result = [];

        if ($.isEmpty(this.viewBag.InitDatas.TreeSetColumns) == true) {
            if (this.FromProgramId == this.EmployeeId) {
                var searchingrow = null;

                var rawchild = this.DataOfList.where(function (item, i) {
                    return (
                        item.COL_CD == item.GROUP_COL_CD
                        && item._TREE_SET._PARENT_GROUP_ID != "0000")
                }.bind(this));

                if (rawchild.length > 0) {
                    var parentGroupIds = new Array();
                    rawchild.forEach(function (item) {
                        parentGroupIds.push(item._TREE_SET._PARENT_GROUP_ID)
                    });
                    parentGroupIds = $.unique(parentGroupIds);
                    var rawparent = this.DataOfList.where(function (item, i) {
                        return ((
                            item._TREE_SET._PARENT_GROUP_ID == "0000"
                            && parentGroupIds.contains(item.id)) ? true : false)
                    });
                    searchingrow = $.merge(rawparent, rawchild);
                }

                return searchingrow;
            } else {
                return this.DataOfList;
            }
        }

        $.each(this.viewBag.InitDatas.TreeSetColumns, function (i, o) {
            o["_TREE_SET"] = {
                _PARENT_GROUP_ID: "0000"
            }

            result.add(o);

            $.each(this.DataOfList.where(function (x) { return x["data"]["_PARENT_GROUP_ID"] == o.id; }), function (j, x) {
                x["_TREE_SET"] = {
                    _PARENT_GROUP_ID: x["data"]["_PARENT_GROUP_ID"]
                };

                result.add(x);
            });
        }.bind(this));

        return result;
    },

    ON_KEY_F8: function () {
        this.onFooterSave();
    },
});
