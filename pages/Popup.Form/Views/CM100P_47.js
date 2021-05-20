window.__define_resource && __define_resource("MSG06612","MSG06613","MSG06628","LBL05334","BTN00069","BTN00008","MSG03839","MSG04357","MSG07859","MSG05390","MSG03602","MSG03364","MSG03679","LBL05299","MSG06002");
/***********************************************************************************
 1. Create Date : 2016.03.16
 2. Creator     : inho
 3. Description : Add. Fields(항목추가) 
 4. Precaution  :
 5. History     : [2017.12.27] - [Duyet]: Add more logic for fixed issue in dev progress post no.604
                  2018.01.10(Hao) - Remove exception for SI240
				  2019.12.16 - dev 33890 A19_04546 기초코드 > 거래처/품목등록 > 리스트설정 가능항목 최대 50개로 제한
                  2020.01.07 (On Minh Thien) - A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
				  2020.04.20 (김동수) : A20_01538 - 최종단가 사용안함 설정 시 최종단가 관련 기능 제한
 6. MenuPath    : Template Setup(양식설정)>Add. Fields(항목추가)
 7. Old File    : CM100P_06.aspx,CM100P_02.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.formset", "CM100P_47", {

    pageID: null, 

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    formOutColumns : null,

    //parent group count 부모 그룹 카운트
    groupCount: 0,

    avaliRows: null,

    notUsedWithHash: null, 
    //requirePreUsedHash:null, //[같이 선택되어야 하는 목록]은 해당 개발자가 SP를 수정해서 예외 처리 하지 않는 것으로 - TO-DO

    reMaxCount: 0,

    productMessage: null,   //TODO나중에제거예정, 품목검색 설정 메세지, product search setting message

    isMultiCheckProdSetting: false, //TODO나중에제거예정,품목검색창 설정시 예외처리 

    multiCheckProdLastId: null,  //TODO나중에제거예정,품목검색창 설정시 예외처리 다중체크시 마지막 체크항목

    multiIdList: [],//TODO나중에제거예정,품목검색창 설정시 예외처리 다중체크시 마지막 체크항목
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.avaliRows = new Array();
        this.registerDependencies("ecmodule.common.form");
    },

    render: function ($parent) {       
            this._super.render.apply(this, arguments);
            //같이 선택되면 안되는 목록 정의
            this.notUsedWithHash = new $.HashMap();
            this.notUsedWithHash.set("SI", { left: ["serial_cd"], right: ["sub_prod"] });
            this.notUsedWithHash.set("OI", { left: ["serial_cd"], right: ["sub_prod"] });
            //this.notUsedWithHash.set("OI020", { left: ["real_qty"], right: ["uqty"] });
            this.notUsedWithHash.set("OI020", { left: ["base_qty", "real_qty"], right: ["uqty"] }); // Changed by LAN
            
            //TODO나중에제거예정,품목검색창 전체재고/창고재고/받는창고재고관련 예외처리 나중에 제거예정 (YMS)
            this.notUsedWithHash.set("SP900_BAL_QTY", { left: ["STOCK.BAL_QTY"], right: ["STOCKS.BAL_QTY"] });
            this.notUsedWithHash.set("SP900_WH_F_QTY", { left: ["STOCK.WH_F_QTY"], right: ["STOCKS.WH_F_QTY"] });
            this.notUsedWithHash.set("SP900_WH_T_QTY", { left: ["STOCK.WH_T_QTY"], right: ["STOCKS.WH_T_QTY"] });
            //TODO나중에제거예정,품목검색창 전체재고/창고재고/받는창고재고관련 예외처리 나중에 제거예정 (YMS)
            this.productMessage = {
                "STOCKS.BAL_QTY": { message: ecount.resource.MSG06612, deleteItem: "STOCK.BAL_QTY" }
                , "STOCKS.WH_F_QTY": { message: ecount.resource.MSG06613, deleteItem: "STOCK.WH_F_QTY" }
                , "STOCKS.WH_T_QTY": { message: ecount.resource.MSG06628, deleteItem: "STOCK.WH_T_QTY" }
                , "STOCK.BAL_QTY": { message: "", deleteItem: "STOCKS.BAL_QTY" }
                , "STOCK.WH_F_QTY": { message: "", deleteItem: "STOCKS.WH_F_QTY" }
                , "STOCK.WH_T_QTY": { message: "", deleteItem: "STOCKS.WH_T_QTY" }
            };

            /*
            //개발결정사항 1581
            //[같이 선택되면 안되는 목록 정의]는 디비설정 값으로 처리 예정 - TO-DO 관련 개발 진행시 해당 개발자가 구현

            this.notUsedWithHash.set("AF040", { left: ["EXP_REMARKS", "EXP_SUB_JOB_GUBUN", "EXP_SUB_JOB_GUBUN_DES"], right: ["DR_REMARKS_CD", "DR_REMARKS_NM", "CR_REMARKS_CD", "CR_REMARKS_NM"] });
            //같이 선택되어야 하는 목록
            this.requirePreUsedHash = new $.HashMap();
            this.requirePreUsedHash.set("SR230_CUST", { items: ["CUST.", "CUST_A11.", "CUST_A12.", "CUST_GBUSINESS.", "CUST_PRICE."], require: ["SALE060.CUST"] });
            this.requirePreUsedHash.set("SR230_PROD", { items: ["SALE003.", "SALE002.CLASS_DES", "S003_GROUP2.", "S003_GROUP3.", "S003_PLANT."], require: ["SALE060.PROD_CD"] });
            this.requirePreUsedHash.set("SR744_CUST", { items: ["CUST.", "CUST_A11.", "CUST_A12.", "CUST_GBUSINESS.", "CUST_PRICE.", "CUST_EMP."], require: ["SIR.CUST_CD"] });
            this.requirePreUsedHash.set("SR744_PROD", { items: ["SALE003.", "SALE002.CLASS_DES", "S003_GROUP2.", "S003_GROUP3.", "S003_PLANT."], require: ["SIR.PROD_CD"] });
            */

            //requirePreUsedHash
            //notUsedWithHash
            //        
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    onInitHeader: function (header) {        
        var thisObj = this;
        var g = widget.generator,
              contents = g.contents(),
              toolbar = g.toolbar(),
              ctrl = g.control();
        var message = {
            type: "getforminfo",
            formIndex: this.formIndex,
            targetColCd: this.targetColCd,
            colCd: this.COL_CD,
            callback: function (data) {
                // CS 주문서입력 상단 양식에는 COL_CD가 아래와 같을때만 보여줘야 함
                // 추후 이와 비슷한 작업을 할때는 이와같이 리스트만들어서 filter 걸면됨 (CM100P_06.js의 _createInitWidgetData 호출하는 부분도 검토) - 이현우
                var csfilterList = ['basic_date', 'time_date', 'u_memo1', 'u_memo2', 'u_memo3', 'u_memo4', 'u_memo5', 'u_txt1']
                               
                if (thisObj.FORM_TYPE.substring(0, 2) == 'OU') {       // O로 시작하는 양식은 CS양식, CS 다른 입력메뉴가 추가된다면 이안에서 분기처리 - 이현우
                    this.formOutColumns = data.filter(function (item) { console.log(item.COL_CD); return (csfilterList.contains(item.COL_CD)) });
                } else if (['AO010', 'AO011', 'AO012'].contains(thisObj.FORM_TYPE)) {
                    // TODO: Add more logic for fixed issue in dev progress post no.604
                    this.formOutColumns = data.filter(function (item) { return item.COL_CD != "#tmp.bal_amt_f"; });
                } else if (['SI440', 'SI420'].contains(thisObj.FORM_TYPE) && thisObj.currentTabId =="tabSecond") {
                    //tab Consumed on menu Goods Receipt
                    this.formOutColumns = data.filter(function (item) { return item.COL_CD != "user_price_vat"; });
                } else if (['AF080'].contains(thisObj.FORM_TYPE) && this.Nation == "TW") {
                    //TODO: Except column [DETAIL_DATE]
                    this.formOutColumns = data.filter(function (item) { return item.COL_CD != "DETAIL_DATE"; });
				}
				else if (['SP900'].contains(thisObj.FORM_TYPE)) {
					// 품목검색창: 최종단가 예외처리
					if (ecount.config.inventory.LAST_SALE_FLAG != "I" && this.FORM_SEQ == "3")
						this.formOutColumns = data.filter(function (item) { return !["LP.LAST_PRICE", "LP.IO_DATE", "LP.USE_CNT"].contains(item.COL_CD) });	// 최종단가,최종거래일,사용빈도
					else if (ecount.config.inventory.LAST_INOUT_FLAG != "I" && this.FORM_SEQ == "4")
						this.formOutColumns = data.filter(function (item) { return !["LP.LAST_PRICE", "LP.IO_DATE", "LP.USE_CNT"].contains(item.COL_CD) });	// 최종단가,최종거래일,사용빈도
					else
						this.formOutColumns = data;
				}
                else
                {
                    this.formOutColumns = data;
                }
            }.bind(this)
        };
        this.sendMessage(this, message);
        //parent group count 부모 그룹 카운트
        this.groupCount = this.formOutColumns.where(function (item, i) { return item._TREE_SET._PARENT_GROUP_ID == "0000"; }).length;
        this.reMaxCount = parseInt(this.checkMaxCount) - parseInt(this.formOutColumns.where(function (item, i) { return ['Y'].contains(item.CHECKED_YN); }).length);
        header.notUsedBookmark()
            .useQuickSearch() 
            .setTitle(ecount.resource.LBL05334)
            .addContents(contents);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid();
        var thisObj = this;
        var generator = widget.generator,
        ctrl = generator.control(),
        form = widget.generator.form(),
        grid = generator.grid();
        contents.add(form)
                .addGrid("dataGrid-" + thisObj.pageID, grid)
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        var keyHelper = new Array();
        keyHelper.push(10);
        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    onChangeControl: function (control, data) {
        var thisObj = this;
        //switch (control.cid) {
        //}
    },

    onInitControl: function (cid, control) { },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (e) {
        this.onHeaderQuickSearch(e);
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (page, message) { },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/


    onInitGridInitalize: function (cid, option) {
        var thisObj = this;
        option
            .setKeyColumn(['COL_CD'])
            .setColumnFixHeader(true)
            .setCheckBoxUse(true)
            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxMaxCount(thisObj.reMaxCount)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, thisObj.checkMaxCount));
            })
            .setCheckBoxCountingDeterminer(function (rowItem) {
                if (thisObj.contents.getGrid().grid.hasChildRow(rowItem[ecount.grid.constValue.keyColumnPropertyName]))
                    return false;
                return true;
            })
            .setCheckBoxCheckingDeterminer(function (rowItem, onlyCheck) {
                if (!onlyCheck) {
                    var selectedItem = thisObj.contents.getGrid().grid.getChecked();
                    if (thisObj.FORM_TYPE.substring(0, 2) == "SI") {
                        if (!thisObj.getNotUsedWith("1", rowItem.COL_CD, thisObj.notUsedWithHash.get("SI"), selectedItem, ecount.resource.MSG04357))
                            return false;
                    } else if (thisObj.FORM_TYPE.substring(0, 2) == "OI") {
                        if (!thisObj.getNotUsedWith("1", rowItem.COL_CD, thisObj.notUsedWithHash.get("OI"), selectedItem, ecount.resource.MSG04357))
                            return false;

                    }
                    if (["OI020"].contains(thisObj.FORM_TYPE)) {
                        if (!thisObj.getNotUsedWith("1", rowItem.COL_CD, thisObj.notUsedWithHash.get("OI020"), selectedItem, ecount.resource.MSG07859)) // Changed from MSG05390 to MSG07859 by LAN
                            return false;
                    }


                    //TODO나중에제거예정,품목검색창 전체재고/창고재고/받는창고재고관련 예외처리 나중에 제거예정 (YMS)
                    if (["SP900"].contains(thisObj.FORM_TYPE) && (rowItem.COL_CD.indexOf("STOCK.") > -1 || rowItem.COL_CD.indexOf("STOCKS.") > -1)) {
                        var hashGet = rowItem.COL_CD.split(".")[1];
                        if (!thisObj.getNotUsedWith("1", rowItem.COL_CD, thisObj.notUsedWithHash.get("SP900_" + hashGet), selectedItem, "")) {
                            if (!$.isEmpty(thisObj.productMessage[rowItem.COL_CD].message)) {
                                if (thisObj.isMultiCheckProdSetting) {
                                    thisObj.multiIdList.push(rowItem.COL_CD);
                                } else {
                                    ecount.confirm(thisObj.productMessage[rowItem.COL_CD].message, function (status) {
                                        thisObj.contents.getGrid().grid.removeChecked([status ? thisObj.productMessage[rowItem.COL_CD].deleteItem : rowItem.COL_CD]);
                                    });
                                }
                            } else {
                                thisObj.contents.getGrid().grid.removeChecked([thisObj.productMessage[rowItem.COL_CD].deleteItem]);
                            }
                        }
                        if (thisObj.isMultiCheckProdSetting && thisObj.multiIdList.length > 0 && thisObj.multiCheckProdLastId == rowItem.COL_CD) {
                            ecount.confirm(ecount.resource.MSG06628, function (status) {
                                thisObj.multiIdList.forEach(function (item) {
                                    thisObj.contents.getGrid().grid.removeChecked([status ? thisObj.productMessage[item].deleteItem : item]);
                                });
                                thisObj.multiIdList = [];
                                thisObj.isMultiCheckProdSetting = false;
                            });
                        }
                    }
                    //if (["AF040", "AF050", "AF060"].contains(thisObj.FORM_TYPE)) {
                    //    if (!thisObj.getNotUsedWith("1", rowItem.COL_CD, thisObj.notUsedWithHash.get("AF040"), selectedItem, ecount.resource.MSG03602))
                    //        return false;
                    //}else if (["SR230"].contains(thisObj.FORM_TYPE)) {
                    //    if (!thisObj.getRequirePreUsedHash("1", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR230_CUST"), selectedItem, ecount.resource.MSG03364))
                    //        return false;

                    //    if (!thisObj.getRequirePreUsedHash("1", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR230_PROD"), selectedItem, ecount.resource.MSG03364))
                    //        return false;
                    //}else if (["SR744"].contains(thisObj.FORM_TYPE)) {
                    //    if (!thisObj.getRequirePreUsedHash("1", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR744_CUST"), selectedItem, ecount.resource.MSG03679))
                    //        return false;

                    //    if (!thisObj.getRequirePreUsedHash("1", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR744_PROD"), selectedItem, ecount.resource.MSG03679))
                    //        return false;
                    //}

                    return true;
                } else {
                    thisObj.avaliRows.push(rowItem.COL_CD);
                    if (thisObj.FORM_TYPE.substring(0, 2) == "SI") {
                        if (!thisObj.getNotUsedWith("2", rowItem.COL_CD, thisObj.notUsedWithHash.get("SI"), thisObj.avaliRows))
                            return false;
                    } else if (thisObj.FORM_TYPE.substring(0, 2) == "OI") {
                        if (!thisObj.getNotUsedWith("2", rowItem.COL_CD, thisObj.notUsedWithHash.get("OI"), thisObj.avaliRows))
                            return false;
                    }
                    if (["OI020"].contains(thisObj.FORM_TYPE)) {
                        if (!thisObj.getNotUsedWith("2", rowItem.COL_CD, thisObj.notUsedWithHash.get("OI020"), thisObj.avaliRows))
                            return false;
                    }
                    //TODO나중에제거예정,품목검색창 전체재고/창고재고/받는창고재고관련 예외처리 나중에 제거예정 (YMS)
                    if (["SP900"].contains(thisObj.FORM_TYPE) && (rowItem.COL_CD.indexOf("STOCK.") > -1 || rowItem.COL_CD.indexOf("STOCKS.") > -1)) {
                        var hashGet = rowItem.COL_CD.split(".")[1];
                        if (!thisObj.getNotUsedWith("2", rowItem.COL_CD, thisObj.notUsedWithHash.get("SP900_" + hashGet), thisObj.avaliRows))
                            return false;
                    }
                    //if (["AF040", "AF050", "AF060"].contains(thisObj.FORM_TYPE)) {
                    //    if (!thisObj.getNotUsedWith("2", rowItem.COL_CD, thisObj.notUsedWithHash.get("AF040"), thisObj.avaliRows))
                    //        return false;
                    //}else if (["SR230"].contains(thisObj.FORM_TYPE)) {
                    //    if (!thisObj.getRequirePreUsedHash("2", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR230_CUST"), thisObj.avaliRows))
                    //        return false;

                    //    if (!thisObj.getRequirePreUsedHash("2", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR230_PROD"), thisObj.avaliRows))
                    //        return false;
                    //}else if (["SR744"].contains(thisObj.FORM_TYPE)) {
                    //    if (!thisObj.getRequirePreUsedHash("2", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR744_CUST"), thisObj.avaliRows))
                    //        return false;

                    //    if (!thisObj.getRequirePreUsedHash("2", rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR744_PROD"), thisObj.avaliRows))
                    //        return false;
                    //}
                }
                return true;
            })
            .setCheckBoxCallback({
                //'click': function (e, data) {
                //    myGrid.setCheckWithChild(data['rowKey'], e.target.checked);
                //},
                'change': function (e, data) {
                    e.stopPropagation();
                    if (thisObj.contents.getGrid().grid.hasChildRow(data.rowItem[ecount.grid.constValue.keyColumnPropertyName])) {
                        //TODO나중에제거예정,품목검색관련 시작
                        if (thisObj.FORM_TYPE == "SP900") {
                            thisObj.isMultiCheckProdSetting = e.target.checked;
                            var childelast = thisObj.contents.getGrid().grid.getChildRowList(data['rowKey'], { isRetrieveKey: true }).where(function (item) { return item.indexOf("STOCKS.") > -1; });
                            if (childelast.length > 0) {
                                thisObj.multiCheckProdLastId = childelast.last();
                            }
                        }
                        //품목검색관련 끝
                        thisObj.contents.getGrid().grid.setCheckWithChild(data['rowKey'], e.target.checked);

                    }
                    console.log('checkbox change');
                }
            })
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardEnterForExecute(true)
            .setCustomRowCell('TITLE', this.setGridDataLink.bind(this));        
        option.setColumns([
                { propertyName: 'TITLE', id: 'TITLE', title: ecount.resource.LBL05299, width: "" }
            
            ]);
                                        
        //if parent group is multi 부모 그룹이 여러개면
        if (thisObj.groupCount > 1) {
            option.setStyleTreeGrid(true, 'TITLE')
            .setEventFocusOnInit(true)
            //.setStyleBorderRemoveAll(true)
            //.setStyleTreeEventDisable(false)
            .setStyleTreeEventOnLabel('cell')
            .setStyleTreeOpenOnInit(true)
            .setStyleTreeColumnSort(false)
            .setStyleTreeHideOnNoChild(true);
        }else{
            option.setStyleTreeGrid(false, 'TITLE');
        }
    },

    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },


    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    // quick Search button click event 퀴서치
    onHeaderQuickSearch: function (e, value) {
        var thisObj = this;
        var keyword = this.header.getQuickSearchControl().getValue().toUpperCase();
        var searchingrow = null;

        var SPFlag = true;
        
        if (thisObj.FORM_TYPE == "GU111") {
            SPFlag = false;
        }

        //init
        if (thisObj.isUsingGroupColCd) {
            if (thisObj.groupCount > 1) {
                var rawchild = thisObj.formOutColumns.where(function (item, i) {
                    return ((
                        !(item.COL_CD == "site_cd" && ecount.config.company.USE_DEPT == "N" && SPFlag)
                        && !(item.COL_CD == "pjt_cd" && ecount.config.company.USE_PJT == "N" && SPFlag)
                        && item.COL_CD == item.GROUP_COL_CD && ['N'].contains(item.CHECKED_YN)
                        && (item.TITLE.toUpperCase().indexOf(keyword) > -1)
                        && item._TREE_SET._PARENT_GROUP_ID != "0000") ? true : false)
                });
                if (rawchild.length > 0) {
                    var parentGroupIds = new Array();
                    rawchild.forEach(function (item) {
                        parentGroupIds.push(item._TREE_SET._PARENT_GROUP_ID)
                    });
                    parentGroupIds = $.unique(parentGroupIds);
                    var rawparent = thisObj.formOutColumns.where(function (item, i) {
                        return ((
                            item._TREE_SET._PARENT_GROUP_ID == "0000"
                            && parentGroupIds.contains(item.GROUP_CODE)) ? true : false)
                    });
                    searchingrow = $.merge(rawparent, rawchild);
                }
            } else {
                searchingrow = thisObj.formOutColumns.where(function (item, i) {
                    return ((
                        !(item.COL_CD == "site_cd" && ecount.config.company.USE_DEPT == "N" && SPFlag)
                        && !(item.COL_CD == "pjt_cd" && ecount.config.company.USE_PJT == "N" && SPFlag)
                        && item.COL_CD == item.GROUP_COL_CD
                        && ['N'].contains(item.CHECKED_YN)
                        && (item.TITLE.toUpperCase().indexOf(keyword) > -1)) ? true : false)
                });
            }
        }else{
            searchingrow = thisObj.formOutColumns.where(function (item, i) {
                return ((
                    !(item.COL_CD == "site_cd" && ecount.config.company.USE_DEPT == "N" && SPFlag)
                    && !(item.COL_CD == "pjt_cd" && ecount.config.company.USE_PJT == "N" && SPFlag)
                    && ['N'].contains(item.CHECKED_YN)
                    && (item.TITLE.toUpperCase().indexOf(keyword) > -1)) ? true : false)
            });
        }
        thisObj.avaliRows = new Array();
        this.contents.getGrid("dataGrid-" + thisObj.pageID).settings
            .setCheckBoxClearChecked()
            .setRowData(searchingrow);

        this.contents.getGrid("dataGrid-" + thisObj.pageID).draw();
    },


    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    //F8 Event
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterApply();
    },

    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    //Apply 적용 버튼
    onFooterApply: function () {
        var thisObj = this;
        var grid = this.contents.getGrid().grid;
        var selectItemKeys = grid.getCheckedKeyList();
        if (selectItemKeys.length == 0) {
            this.footer.getControl('apply').setAllowClick();
            ecount.alert(ecount.resource.MSG06002);
            return false;
		}

		//품목등록, 거래처등록
		if (thisObj.FORM_TYPE == "SR900" || thisObj.FORM_TYPE == "SR910") {
			if (selectItemKeys.length > thisObj.reMaxCount) {
				this.footer.getControl('apply').setAllowClick();
				ecount.alert(String.format(ecount.resource.MSG03839, thisObj.checkMaxCount));
				return false;
			}
		}

        var selectItems = new Array();
        var deleteItems = new Array();  //품목검색창 재고 설정관련 제거대상 나중에 제거
        selectItemKeys.forEach(function (key) {
            var rowItem = grid.getRowItem(key);
            if (rowItem._TREE_SET._PARENT_GROUP_ID != "0000") {
                selectItems.push(grid.getRowItem(key));
            }

            //TODO나중에제거예정,품목검색창 전체재고/창고재고/받는창고재고관련 예외처리 나중에 제거예정 (YMS)
            if (["SP900"].contains(thisObj.FORM_TYPE) && (key.indexOf("STOCK.") > -1 || key.indexOf("STOCKS.") > -1)) {
                if (thisObj.formOutColumns.any(function (item) { return item.COL_CD == thisObj.productMessage[key].deleteItem && item.CHECKED_YN == "Y" })) {
                    deleteItems.push(thisObj.productMessage[key].deleteItem || "");
                }
            }
        });
        var message = {
            type: "addItems",
            formIndex: this.formIndex,
            targetColCd: this.targetColCd,
            colCds: selectItems,
            isDelete: deleteItems.length > 0,
            deleteItems: deleteItems,
            callback: function () {
                this.footer.getControl('apply').setAllowClick();
                this.close();
            }.bind(this)
        };
        this.sendMessage(this, message);
    },


    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    setGridDataLink: function (value, rowItem) {

        var thisObj = this;
        var errcnt = 0;
        var option = {};
        if (("p31opDes1"==rowItem.COL_CD||"p31opDes2"==rowItem.COL_CD||"p31opDes3"==rowItem.COL_CD||"p31opDes4"==rowItem.COL_CD||"p31opDes5"==rowItem.COL_CD||"p31opDes6"==rowItem.COL_CD) && this.FORM_TYPE == "SN530") {
            option.data = rowItem.TITLE.substring(1, rowItem.TITLE.length);
        } else {
            option.data = rowItem.TITLE;
        }
        
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                errcnt = 0;
                if (thisObj.reMaxCount <= 0) {
                    errcnt = 1;
                    ecount.alert(String.format(ecount.resource.MSG03839, thisObj.checkMaxCount));
                }
                if (thisObj.FORM_TYPE.substring(0, 2) == "SI") {
                    if (!thisObj.getNotUsedWith("3", data.rowItem.COL_CD, thisObj.notUsedWithHash.get("SI"), null, ecount.resource.MSG04357)) {
                        errcnt = 1;
                    }
                } else if (thisObj.FORM_TYPE.substring(0, 2) == "OI") {
                    if (!thisObj.getNotUsedWith("3", data.rowItem.COL_CD, thisObj.notUsedWithHash.get("OI"), null, ecount.resource.MSG04357)) {
                        errcnt = 1;
                    }
                }

                if (["OI020"].contains(thisObj.FORM_TYPE)) {
                    if (!thisObj.getNotUsedWith("3", data.rowItem.COL_CD, thisObj.notUsedWithHash.get("OI020"), null, ecount.resource.MSG07859)) // Changed from MSG05390 to MSG07859 by LAN
                        errcnt = 1;
                }

                //TODO,품목검색창 전체재고/창고재고/받는창고재고관련 예외처리 나중에 제거예정 (YMS)
                if (["SP900"].contains(thisObj.FORM_TYPE) && (data.rowItem.COL_CD.indexOf("STOCK.") > -1 || data.rowItem.COL_CD.indexOf("STOCKS.") > -1)) {
                    var hashGet = data.rowItem.COL_CD.split(".")[1];
                    if (!thisObj.getNotUsedWith("3", data.rowItem.COL_CD, thisObj.notUsedWithHash.get("SP900_" + hashGet), null, "")) {
                        var deltems = new Array();
                        if ($.isEmpty(thisObj.productMessage[data.rowItem.COL_CD].message)) {
                            deltems.push(thisObj.productMessage[data.rowItem.COL_CD].deleteItem);
                            subSendmessage(true, deltems);
                        } else {
                            ecount.confirm(thisObj.productMessage[data.rowItem.COL_CD].message, function (status) {
                                if (status) {
                                    deltems.push(thisObj.productMessage[data.rowItem.COL_CD].deleteItem);
                                    subSendmessage(true, deltems);
                                }
                            });
                        }
                        errcnt = 1;
                    }
                }
                if (errcnt == 0) {
                    subSendmessage();
                    //var selectItems = new Array();
                    //selectItems.push(data.rowItem);
                    //var message = {
                    //    type: "addItems",
                    //    formIndex: thisObj.formIndex,
                    //    targetColCd: thisObj.targetColCd,
                    //    colCds: selectItems,
                    //    callback: thisObj.close.bind(thisObj)
                    //};
                    //thisObj.sendMessage(thisObj, message);
                }
                function subSendmessage(isDelete, deleteItems) {
                    var selectItems = new Array();
                    selectItems.push(data.rowItem);
                    var message = {
                        type: "addItems",
                        formIndex: thisObj.formIndex,
                        targetColCd: thisObj.targetColCd,
                        colCds: selectItems,
                        isDelete: isDelete,
                        deleteItems: deleteItems,
                        callback: thisObj.close.bind(thisObj)
                    };
                    thisObj.sendMessage(thisObj, message);
                }

                //if (["AF040", "AF050", "AF060"].contains(thisObj.FORM_TYPE)) {
                //    if (!thisObj.getNotUsedWith("3", data.rowItem.COL_CD, thisObj.notUsedWithHash.get("AF040"), null, ecount.resource.MSG03602))
                //        errcnt = 1;
                //}else if (["SR230"].contains(thisObj.FORM_TYPE)) {
                //    if (!thisObj.getRequirePreUsedHash("3", data.rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR230_CUST"), null, ecount.resource.MSG03364))
                //        return false;

                //    if (!thisObj.getRequirePreUsedHash("3", data.rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR230_PROD"), null, ecount.resource.MSG03364))
                //        return false;
                //}else if (["SR744"].contains(thisObj.FORM_TYPE)) {
                //    if (!thisObj.getRequirePreUsedHash("3", data.rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR744_CUST"), null, ecount.resource.MSG03679))
                //        return false;

                //    if (!thisObj.getRequirePreUsedHash("3", data.rowItem.COL_CD, thisObj.requirePreUsedHash.get("SR744_PROD"), null, ecount.resource.MSG03679))
                //        return false;
                //}

            }.bind(this)
        }
        return option;
    },


    getNotUsedWith: function (type, colCd, check, selectedItem, msg) {
        var thisObj = this;
        switch (type) {
            case "1":
                if (check.left.contains(colCd)) {
                    for (var i = 0; i < check.right.length; i++) {
                        if (!$.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.right[i] && item.CHECKED_YN == "Y" })) || !$.isNull(selectedItem.find(function (item) { return item.COL_CD == check.right[i] }))) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                if (check.right.contains(colCd)) {
                    for (var i = 0; i < check.left.length; i++) {
                        if (!$.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.left[i] && item.CHECKED_YN == "Y" })) || !$.isNull(selectedItem.find(function (item) { return item.COL_CD == check.left[i] }))) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                break;
            case "2":
                if (check.left.contains(colCd)) {
                    for (var i = 0; i < check.right.length; i++) {
                        if (!$.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.right[i] && item.CHECKED_YN == "Y" })) || selectedItem.contains(check.right[i])) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                if (check.right.contains(colCd)) {
                    for (var i = 0; i < check.left.length; i++) {
                        if (!$.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.left[i] && item.CHECKED_YN == "Y" })) || selectedItem.contains(check.left[i])) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                break;
            case "3":
                if (check.left.contains(colCd)) {
                    for (var i = 0; i < check.right.length; i++) {
                        if (!$.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.right[i] && item.CHECKED_YN == "Y" }))) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                if (check.right.contains(colCd)) {
                    for (var i = 0; i < check.left.length; i++) {
                        if (!$.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.left[i] && item.CHECKED_YN == "Y" }))) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                break;
        }
        return true;
    },

    getRequirePreUsedHash: function (type, colCd, check, selectedItem, msg) {
        var thisObj = this;
        switch (type) {
            case "1":
                if (check.items.where(function (item) { return (colCd.indexOf(item) == 0 ? true : false) }).length > 0) {
                    for (var i = 0; i < check.require.length; i++) {
                        if ($.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.require[i] && item.CHECKED_YN == "Y" })) || !$.isNull(selectedItem.find(function (item) { return item.COL_CD == require.right[i] }))) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                break;
            case "2":
                if (check.items.where(function (item) { return (colCd.indexOf(item) == 0 ? true : false) }).length > 0) {
                    for (var i = 0; i < check.require.length; i++) {
                        if ($.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.require[i] && item.CHECKED_YN == "Y" })) || selectedItem.contains(check.require[i])) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                break;
            case "3":
                if (check.items.where(function (item) { return (colCd.indexOf(item) == 0 ? true : false) }).length > 0) {
                    for (var i = 0; i < check.require.length; i++) {
                        if ($.isNull(thisObj.formOutColumns.find(function (item) { return item.COL_CD == check.require[i] && item.CHECKED_YN == "Y" }))) {
                            if (!$.isEmpty(msg))
                                ecount.alert(msg);

                            return false;
                        }
                    }
                }
                break;
        }
        return true;
    },



});
