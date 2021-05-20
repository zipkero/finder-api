window.__define_resource && __define_resource("LBL03444","LBL08947","LBL00321","BTN00069","BTN00008");
/****************************************************************************************************
1. Create Date : 2018.06.15
2. Creator     : 최용환(Choi Yong-hwan)
3. Description : 거래유형 검색 팝업창 (채권/채무/수표/어음) Transaction Type Popup in 
4. Precaution  : 
5. History     : 
            
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_36", {
    gridObject: null,
    inPartList: null,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            SEARCH: this.keyword,
            GUBUN: this.Gubun,
            MENU_TYPE: this.MENU_TYPE,
            CLASS_CD: this.CLASS_CD
        };

        this.inPartList = {};
        this.registerDependencies("ecmodule.account.common");
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
        header.setTitle(ecount.resource.LBL03444).useQuickSearch();  
    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        
        //전표관리 신규버튼 동일팝업 사용을 위해
        var bollChk = true;
        var bollChk2 = false;        

        
        grid
            .setRowData(this.viewBag.InitDatas.ManageNoTypeList)
            .setRowDataUrl("/Common/Infra/GetListTransactionType")
            .setRowDataParameter(this.searchFormParameter)
            .setCheckBoxRememberChecked(false)
            .setCheckBoxUse(true)
            .setCustomRowCell('ITEM8', this.setGridAccResx.bind(this))
            .setCustomRowCell('ITEM9', this.setGridAccCaseResx.bind(this))
            .setCheckBoxHeaderCallback({
                'change': function (e, data) {
                    gridObject.checkAllCustom('CHK2', data.target.checked);
                }
            })
            .setCheckBoxCallback({
                'change': function (e, data) {
                    if (this.inPartList[data.rowItem['ITEM6']] != undefined) {
                        var currentInPartList = this.inPartList[data.rowItem['ITEM6']];
                        for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
                            gridObject.setCell('CHK2', currentInPartList[i], gridObject.isChecked(data.rowKey));
                        }//for end
                    }
                }.bind(this)
            })
            .setKeyColumn(['ITEM8' , 'ITEM9'])
            .setColumns([
                { propertyName: 'ITEM8', id: 'ITEM8', title: ecount.resource.LBL08947, width: '' },
                {
                    propertyName: 'CHK2', id: 'CHK2', controlType: 'widget.checkbox', align: "center", width: '30', isHideColumn: bollChk2,
                    columnOption: {
                        attrs: { 'disabled': true }
                    }
                },
               { propertyName: 'ITEM9', id: 'ITEM9', title: ecount.resource.LBL00321, width: '' }
            ]);
        this.makeMergeData(this.viewBag.InitDatas.ManageNoTypeList);

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);

    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
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
        this.makeMergeData(data.result.Data);
    },

    makeMergeData: function (rowData) {
        var loadDateCnt = rowData.count();
        var InPart = '';
        for (var i = 0 ; i < loadDateCnt; i++) {
            var tempRowCnt = parseInt(rowData[i].ITEM10);

            if (i < loadDateCnt - 1 && tempRowCnt > 1 && InPart != rowData[i].ITEM6) {
                rowData[i]['_MERGE_SET'] = [];
                rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(0, tempRowCnt));
                rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(1, tempRowCnt));
            }

            if (this.inPartList[rowData[i].ITEM6] == undefined) {
                this.inPartList[rowData[i].ITEM6] = new Array();
            }

            this.inPartList[rowData[i].ITEM6].push(rowData[i].ITEM8 +'∮'+ rowData[i].ITEM9);
            InPart = rowData[i].ITEM6;
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

    setGridAccResx: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.label";
        option.data = ecount.resource[value];

        return option;
    },

    setGridAccCaseResx: function (value, rowItem) {
        var option = {};
        option.data = ecount.resource[value];
        var self = this;
        option.event = {
            'click': function (e, data) {
                var optionData = {};
                //신규프레임웍 파라미터
                optionData.PARAM = {
                    width: 800,
                    height: 600,
                    EditFlag: "I",
                    s_system: data.rowItem.ITEM1+data.rowItem.ITEM2,
                    rbRptSort: this.rbRptSort,
                    popupType: false,
                    IsPopup: true,
                    isOpenPopup: true,
                    ROOM_SEQ : this.ROOM_SEQ
                }

                optionData.hidSearchData = {
                    USE_DEFAULT_DATE: "N",
                    SLIP_TYPE: "",
                    TRX_DATE: "",
                    TRX_NO: "",
                    TRX_TYPE: data.rowItem.ITEM1,
                    SER_NO: data.rowItem.ITEM2,
                    PRG_URL: "",
                    PARENT_URL: "/ECErp/SVC/EBG/EBG001M",
                    IsPopup: true,
                    isOpenPopup: true
                }


                //결과값 받아서 처리 callback함수
                optionData.callback = function (option) {

                    
                    var param = {
                        MENU_SEQ: "98",
                        CLASS_CD: data.rowItem.Key.CLASS_CD,
                        CLASS_SEQ: data.rowItem.Key.CLASS_SEQ,
                    };
                    //히스토리 테이블저장
                    ecount.common.api({
                        url: "/Common/Infra/SaveComnMenuHistory",
                        data: Object.toJSON(param),
                        success: function (result) {
                            if (result.Status != "200") {
                                runSuccessFunc = result.Status == "202";
                                ecount.alert(result.Error);
                            }
                        },
                        complete: function () {
                            //self.close();
                        }
                    });
                    debugger
                    if (option.URL) {

                        var paramData = {
                            url: option.URL,
                            param: option.PARAM,
                        };

                        //if (option.PARAM.isOpenPopup) {
                        //this.openWindow(paramData);

                        self.onAllSubmitSelf({
                            url: option.URL,
                            param: option.PARAM,
                            IsPopup: true,
                            isOpenPopup: true,

                        });

                        //} else {
                        //    self.onAllSubmitSelf(paramData);
                        //}
                    } else {
                        debugger;
                        if (data.rowItem.ITEM4.toLowerCase() == "/ecmain/ebd/ebd010m_08.aspx" && data.rowItem.ITEM1 == "35" && data.rowItem.ITEM2 == "01") {
                            data.rowItem.ITEM4 = "/ECERP/EBD/EBD010M_08";
                        } else if (data.rowItem.ITEM4.toLowerCase() == "/ecmain/ebd/ebd010m_03.aspx" && data.rowItem.ITEM1 == "10" && data.rowItem.ITEM2 == "04")
                            data.rowItem.ITEM4 = "/ECERP/EBD/EBD010M_03_01";
                        else if (data.rowItem.ITEM4.toLowerCase() == "/ecmain/ebd/ebd010m_17.aspx" && data.rowItem.ITEM1 == "36" && data.rowItem.ITEM2 == "01")
                            data.rowItem.ITEM4 = "/ECERP/EBD/EBD010M_17";
                        else if (data.rowItem.ITEM4.toLowerCase() == "/ecmain/ebd/ebd010m_08.aspx" && data.rowItem.ITEM1 == "30" && data.rowItem.ITEM2 == "01")
                            data.rowItem.ITEM4 = "/ECERP/EBD/EBD010M_08_01";
                        else if (data.rowItem.ITEM4.toLowerCase() == "/ecmain/ebd/ebd010m_07.aspx" && data.rowItem.ITEM1 == "20" && data.rowItem.ITEM2 == "04")
                            data.rowItem.ITEM4 = "/ECERP/EBD/EBD010M_07";

                        var param = {
                            width: 800,
                            height: 600,
                            trx_type: data.rowItem.ITEM1,
                            ser_no: data.rowItem.ITEM2,
                            ListYn: "Y",
                            fpopupID: self.parentPageID,
                            popupID: self.parentPageID,
                            ROOM_SEQ : self.ROOM_SEQ
                        };

                        self.openWindow({
                            url: data.rowItem.ITEM4,
                            param: param,
                            popupType: data.rowItem.ITEM4.toUpperCase().indexOf("ECMAIN") > -1 ? true : false,
                        });

                        //self.close();
                    }
                }
                   
                

                //회계전표연결 체크로직(Check Connect Invoice)
                ecmodule.account.common.checkConnectInvoice(optionData);

            }.bind(this)
        };

        return option;
    },

    //검색값이 한건일경우 자동으로 팝업뜨도록
    onGridRenderComplete: function (e, data) {
        debugger;
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var obj = {};
        var d = data.dataRows[0];
        if (data.totalDataCount == 1) {
            d["ITEM9"] = ecount.resource[d["ITEM9"]];

            var message = {
                name: "ITEM9",
                code: "ITEM11",
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

    //적용버튼
    onFooterApply: function (e) {
        var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
        var userIds = new Array();
        var users = new Array();

        for (var i = 0, limit = rowList.length ; i < limit; i++) {
            if (rowList[i].CHK2 == true) {
                if ($.inArray(rowList[i]["KEY"]["CLASS_SEQ"], users) == -1) {
                    rowList[i]["ITEM9"] = ecount.resource[rowList[i]["ITEM9"]];
                    userIds.push(rowList[i]);

                }
                users.push(rowList[i]["KEY"]["CLASS_SEQ"]);
            }
        }//for end

        var message = {
            name: "ITEM9",
            code: "ITEM11",
            data: userIds,
            isAdded: true,
            addPosition: "next",
            callback: this.close.bind(this)
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
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            if (!e.unfocus)
                this.header.getQuickSearchControl().setFocus(0);

            return;
        }
        this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue().keyword || '';
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.toggle(true);
    },
    
    onMessageHandler: function (event, data) {
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

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();

        grid.draw(this.searchFormParameter);
    },

    onCallbackPopup: function () {
        // 구프레임웍 팝업으로 오픈시 임시 처리 
        try{   
            this.findPageInstance(this.ecPageID).reloadGrid();
        } catch (e) { };

        this.close();
    }    
});
