window.__define_resource && __define_resource("BTN00113","BTN00008","LBL08556","LBL03004","LBL03017","LBL03213","LBL00730","LBL01234","LBL04306","LBL00749","LBL00976","LBL03289","LBL03290","LBL03291","LBL07243","LBL00402","LBL01360","LBL01361","LBL06642","LBL08254","LBL02985","LBL02983","LBL02405","LBL01587");
/****************************************************************************************************
1. Create Date : 2015.06.12
2. Creator     : 강성훈
3. Description : 재고 > 판매입력 > 품목검색(F9)
4. Precaution  :
5. History     : [2016-05-16] 최용환 : 품목코드 검색시 이벤트별 카운트 누적
                 [2016-05-27] 최용환 : 품목코드 검색시 이벤트별 카운트 누적 관련 로직 제거
                 2019.06.25(taind) A19_01497 - 소스코드진단결과 반영 - Master
                 2019.09.23 (NgocHan) [A19_03065] add more param ISFROMCS to searchFormParameter
                 2019.12.23 (PhiTa) [A19_04413] 판매입력 - F9로 품목을 입력하면 단가가 잘못 나오는 문제
                 2020.01.21 (김동수) : A20_00245 - 각 재고 전표에서 F9 단축키 사용빈도 조사요청
                 2020.03.18 (김동수) : A20_00530 - 각 재고 전표에서 F9 단축키 사용빈도 조사_로직 제거
6. SP          : ESP_STCM_SALE003_PRODQTY_LIST
****************************************************************************************************/

// this.ParentData.isQtyChange = true;
ecount.page.factory("ecount.page.popup.type2", "ES018P", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    isFirstClick: false,
    rowAddCnt: 0,
    //부모한테 내려가야 할 object
    parentData: null,
    parentDataNew: null,
    checked: "",
    check_flag: "N",
    oldNum: 0,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.searchFormParameter = {
            IO_TYPE: this.IO_TYPE
            , POS: this.rowKey
            , CUST: this.Cust || ""
            , PARAM: this.keyword
            , SORT_COLUMN: "PROD_CD ASC"
            , SFLAG: this.SFLAG
            , WH_CD: this.WHCD || ""
            , ADD_COLUMN: (this.viewBag.InitDatas.AO070.SELECT_SQL != "") ? this.viewBag.InitDatas.AO070.SELECT_SQL.replaceAll("''", "''''") : ", '''' ECOUNT0, '''' ECOUNT1, '''' ECOUNT6 "
            , QTY_Q: "1"         //ecount.config.inventory.DEC_Q
            , PREV_YYMM: this.viewBag.LocalTime.toDate().addMonths(-1).format("yyyyMM")
            , DATES: this.viewBag.LocalTime.toDate().format("yyyyMMdd")
            , START: "N"
            , BARCODE_SEARCH: "N"
            , PROD_SEARCH: "1"   //search > category
            , SEARCH_GB: ""
            , PROD_CD2: ""
            , PROD_DES: ""
            , SIZE_DES: ""
            , UNIT: ""
            , BAR_CODE: ""
            , CLASS_CD: ""
            , CLASS_CD2: ""
            , CLASS_CD3: ""
            , REMARKS_WIN: ""
            , MAIN_PROD_CD: ""
            , MAIN_PROD_DES: ""
            , CONT1: ""
            , CONT2: ""
            , CONT3: ""
            , CONT4: ""
            , CONT5: ""
            , CONT6: ""
            , MAIN_YN: "N"
            , ISFROMCS: this.ISFROMCS
        };
        this.setInitSearchFormParameter();
        this.registerDependencies("inventorylib.common");
    },

    initProperties: function () {
        //부모한테 내려가야 할 object
        this.parentData = {
            PROD_CD: "",
            PROD_DES: "",
            SIZE_DES: "",
            CUST: "",
            CUST_DES: "",
            CUST_FOCUS: "",
            WH_CD_FOCUS: "",
            TAX: "",
            UNIT: "",
            PRICE: new Decimal(0),
            PRICE_VAT_INCLUDE: new Decimal(0),
            EXCH_RATE: "",
            QTY: new Decimal(0),
            isQtyChange: false,
            UQTY: new Decimal(0),
            isUqtyChange: false,
            QTYFOCUS: "",
            SIZE_FLAG: "",
            BAL_FLAG: "",
            PROD_TAX: "",
            PROD_TAX_YN: "",
            ACCTSUBPROD: "",
            ACCTSUBSIZE: "",
            ACCTSUBBIGO: "",
            ITEM_TYPE: "",
            ITEM_CD: "",
            ITEM_DES: "",
            ITEM_DES_READONLY: "",
            SERIAL_TYPE: "",
            SERIALNO: "",
            CHKWARE_CHECKED: "",
            WARE_FLAG_CHECKED: "",
            SERIAL_CLASS: "",
            QC_YN: "",
            QC_BUY_TYPE: "",
            TIME_DATE: "",
            TIME_DATE_COLOR: "",
            rowKey: "",
            rowIdx: "",
            INPUTFOCUS: "",
            totalItemCnt: 0,
            ItemCnt: 0

        };
        this.parentDataNew = {};
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    onInitHeader: function (header, resource) {

        var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        toolbar
            .setOptions({ css: "btn btn-default btn-sm" })
            .addLeft(ctrl.define("widget.button", "searchOfHeader").label(ecount.resource.BTN00113))
            .addLeft(ctrl.define("widget.button", "closeOfHeader").label(ecount.resource.BTN00008));

        form1.add(ctrl.define("widget.searchGroup", "search", "search", ecount.resource.LBL08556).setOptions({
            //category: [[0, ecount.resource.LBL03004], [1, ecount.resource.LBL03017], [2, ecount.resource.LBL03213], [3, ecount.resource.LBL00730], [4, ecount.resource.LBL01234]],
            label: ecount.resource.BTN00113  //검색            
        }).end());

        cont1 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0101");
        cont1 = cont1 == '' ? ecount.resource.LBL04306 + "1" : cont1;
        cont2 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0102");
        cont2 = cont2 == '' ? ecount.resource.LBL04306 + "2" : cont2;
        cont3 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0103");
        cont3 = cont3 == '' ? ecount.resource.LBL04306 + "3" : cont3;
        cont4 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0104");
        cont4 = cont4 == '' ? ecount.resource.LBL04306 + "4" : cont4;
        cont5 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0105");
        cont5 = cont5 == '' ? ecount.resource.LBL04306 + "5" : cont5;
        cont6 = this.getObjects(this.viewBag.InitDatas.CommonCode, "S0106");
        cont6 = cont6 == '' ? ecount.resource.LBL04306 + "6" : cont6;

        form2
          .add(ctrl.define("widget.input", "SProdCd", "PROD_CD2", ecount.resource.LBL03017).end())
          .add(ctrl.define("widget.input", "SProdDes", "PROD_DES", ecount.resource.LBL03004).end())
          .add(ctrl.define("widget.input", "SizeDes", "SIZE_DES", ecount.resource.LBL00749).end())
          .add(ctrl.define("widget.input", "unit", "UNIT", ecount.resource.LBL00976).end())
          .add(ctrl.define("widget.input", "BarCode", "BAR_CODE", ecount.resource.LBL01234).end())
          .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd1", "CLASS_CD", ecount.resource.LBL03289).end())
          .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd2", "CLASS_CD2", ecount.resource.LBL03290).end())
          .add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd3", "CLASS_CD3", ecount.resource.LBL03291).end())
          .add(ctrl.define("widget.multiCode.prodLevelGroup", "txtTreeGroupCd", "PROD_LEVEL_GROUP", ecount.resource.LBL07243).end())
          .add(ctrl.define("widget.input", "RemarksWin", "REMARKS_WIN", ecount.resource.LBL00402).end())
          .add(ctrl.define("widget.input", "main_prod_cd", "MAIN_PROD_CD", ecount.resource.LBL01360).end())
          .add(ctrl.define("widget.input", "main_prod_des", "MAIN_PROD_DES", ecount.resource.LBL01361).end())
          .add(ctrl.define("widget.input", "Cont1", "CONT1", cont1).end())
          .add(ctrl.define("widget.input", "Cont2", "CONT2", cont2).end())
          .add(ctrl.define("widget.input", "Cont3", "CONT3", cont3).end())
          .add(ctrl.define("widget.input", "Cont4", "CONT4", cont4).end())
          .add(ctrl.define("widget.input", "Cont5", "CONT5", cont5).end())
          .add(ctrl.define("widget.input", "Cont6", "CONT6", cont6).end())

        tabContents
            .createActiveTab("quick", ecount.resource.LBL06642)
            .add(form1)
            .setOptions({
                showFormLayer: ($.isEmpty(this.keyword)) ? true : false,
            })
            .createTab("advanced", ecount.resource.LBL08254)
            .add(form2)
            .add(toolbar);

        contents.add(tabContents)

        header.setTitle(ecount.resource.LBL02985)
            .notUsedBookmark()
            .addContents(contents)
            .add("search")
    },

    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            ctrl = generator.control(),
            grid = generator.grid();
        var thisObj = this;

        if (!$.isNull(this.keyword)) {
            grid.setRowData(this.viewBag.InitDatas.Data)
        }
        grid
        .setRowDataUrl("/Inventory/Basic/GetListProdBalQtyForSearch")
        .setRowDataParameter(this.searchFormParameter)
        .setKeyColumn(['PROD_CD', 'PROD_DES', 'SIZE_DES2'])
        .setColumns([
                    { propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017, width: 100 },
                    { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL02983, width: '' },
                    { propertyName: 'BAL_QTY', id: 'BAL_QTY', dataType: '9' + ecount.config.inventory.DEC_Q, title: ecount.resource.LBL02405, width: 80, align: 'right' },
                    { propertyName: 'REMARKS_WIN', id: 'REMARKS_WIN', title: ecount.resource.LBL03213, width: 100 }
        ])
        .setColumnSortable(true)
        .setColumnSortExecuting(function (e, data) {
            if (data.sortOrder == "A")
                thisObj.searchFormParameter.SORT_COLUMN = data.columnId + ' ASC';
            else
                thisObj.searchFormParameter.SORT_COLUMN = data.columnId + ' DESC';

            thisObj.contents.getGrid().draw(thisObj.searchFormParameter);
        })
        //그리드 타이틀 정렬 조건 설정 제거(입력된 값만 제거)
        .setColumnSortDisableList(['BAL_QTY'])
        .setCheckBoxUse(true)

        .setCheckBoxHeaderStyle({
            'title': ecount.resource.LBL01587,
            'visible': false,
            'width': 35
        })

        .setCheckBoxActiveRowStyle(true)
        .setCheckBoxCallback({//그리드 체크 박스 클릭 이벤트(다중 이벤트 가능)
            'click': function (e, data) {
                if (e.target.checked) {
                    thisObj.setRowOpenerDown(data, "chk");
                }
            }
        })
        .setCustomRowCell('PROD_CD', this.setGridDataLinkCD.bind(this))
        .setCustomRowCell('PROD_DES', this.setGridDataLinkDES.bind(this))


        contents.addGrid("dataGrid" + this.pageID, grid);
    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
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

        if (!$.isNull(this.keyword)) {
            this.header.getControl("search").setValue(this.keyword);
            this.searchFormParameter.PARAM = this.keyword;
        }
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.header.getControl("search").onFocus(0);
        }
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (obj, message) { },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.totalDataCount == 0) {
            this.header.toggle();
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    onGridAfterFormLoad: function (e, data, grid) { },

    // 품목코드 클릭 및 링크 설절
    setGridDataLinkCD: function (value, rowItem) {
        var option = {};
        var self = this;
        option.data = rowItem.PROD_CD;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                self.setRowOpenerDown(data, "");
            }.bind(this)
        }
        return option;
    },
    // 품목/규격명 클릭 및 링크 설절
    setGridDataLinkDES: function (value, rowItem) {
        var option = {};
        var self = this;

        var sizedes = "";

        if ($.isNull(rowItem.SIZE_DES) || $.isEmpty(rowItem.SIZE_DES))
            sizedes = rowItem.SIZE_DES2;
        else
            sizedes = rowItem.SIZE_DES + " " + rowItem.SIZE_DES2;

        if ($.isEmpty(sizedes))
            option.data = rowItem.PROD_DES;
        else
            option.data = rowItem.PROD_DES + "[" + sizedes + "]";
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                self.setRowOpenerDown(data, "");
            }.bind(this)
        }
        return option;
    },

    setGridDataLinkQty: function (value, rowItem) {
        var option = {};
        var self = this;

        option.data = rowItem.BAL_QTY;
        option.controlType = "widget.label";
        option.event = {
            'click': function (e, data) {
            }.bind(this)
        }
        return option;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    // 검색 닫기 버튼 클릭
    onHeaderCloseOfHeader: function (e) {
        this.header.toggle();
    },
    onHeaderSearchOfHeader: function (event) {
        this.onHeaderSearch(event);
    },

    // 검색 버튼 클릭
    onHeaderSearch: function (event) {
        if (this.header.currentTabId == "quick") {
            var fromheader = this.header.getControl("search").getValue();
            this.searchFormParameter.SEARCH_GB = "0";
            this.searchFormParameter.PARAM = fromheader.keyword;
            this.searchFormParameter.PROD_SEARCH = "5";
        }
        else {
            var form = this.header.serialize();
            $.extend(this.searchFormParameter, this.searchFormParameter, form.result);

            this.searchFormParameter.SEARCH_GB = "1";
            this.searchFormParameter.PARAM = "";
        }
        this.searchFormParameter.SORT_COLUMN = "PROD_CD ASC";
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.toggle();

    },
    // 하단 닫기 버튼 클릭
    onFooterClose: function () {
        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    // 팝업 핸들러
    onPopupHandler: function (control, parameter, handler) {
        parameter.popupType = true;

        if (control.id == "txtClassCd1" || control.id == "txtClassCd2" || control.id == "txtClassCd3") {
            parameter.isIncludeInactive = true;
            parameter.isApplyDisplayFlag = false;
            parameter.isCheckBoxDisplayFlag = false;
        }
        handler(parameter);
    },

    //탭 변경 이벤트    
    onChangeHeaderTab: function (event) {
        if (event.tabId == "advanced") {
            this.setFixedHeader(false);
        }
        else {
            this.setFixedHeader(true);
        }
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    getObjects: function (obj, val) {
        var retvalue = '';
        $.each(obj, function (i, adata) {
            if (adata.Key.CODE_NO == val)
                retvalue = adata.CODE_DES;
        })
        return retvalue;
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {
        target && this.onHeaderSearch(target.control.getValue());
    },

    // 부모페이지에 값 내리기
    setRowOpenerDown: function (data, checked) {
        var objthis = this;
        this.checked = checked;
        debugger
        var Param = {
            CUST: this.Cust,
            PROD_CD: data.rowItem.PROD_CD,
            WH_CD: this.WHCD,
            IO_TYPE: this.IO_TYPE,
            IO_NO: this.IO_NO,
            PRICE_GROUP_FLAG: ecount.config.inventory.PRICE_GROUP_FLAG,
            ARRIOTYPESData: Object.toJSON(""),
            IN_PRICE: data.rowItem.IN_PRICE.toString(),
            OUT_PRICE: data.rowItem.OUT_PRICE.toString(),
            EXCH_RATE: (new Decimal(data.rowItem.EXCH_RATE.toString())).toFixed(10),
            IN_PRICE_VAT: data.rowItem.IN_PRICE_VAT.toString(),
            OUT_PRICE_VAT: data.rowItem.OUT_PRICE_VAT.toString(),
            UNIT: data.rowItem.UNIT,
            REMARKS_WIN: data.rowItem.REMARKS_WIN,
            TAX: data.rowItem.TAX,
            VAT_YN: data.rowItem.VAT_YN
        }
        ecount.common.api({
            url: "/Inventory/Basic/GetListProdBalQtyByPriceForSearch",
            data: Object.toJSON(Param),
            success: function (result) {
                $.extend(result.Data, result.Data, data.rowItem);
                if (objthis.checked == "") {
                    objthis.setParentLoad(result.Data, "");
                }
                else {
                    objthis.setParentLoadCheckBox(result.Data, "chk");
                }
            }.bind(objthis)
        });
    },

    // 그리드 파람 기초 데이터 설정
    setInitSearchFormParameter: function () {
        //QTY_Q 설정
        switch (ecount.config.inventory.DEC_Q) {
            case "0": this.searchFormParameter.QTY_Q = "1"; break;
            case "1": this.searchFormParameter.QTY_Q = "10"; break;
            case "2": this.searchFormParameter.QTY_Q = "100"; break;
            case "3": this.searchFormParameter.QTY_Q = "1000"; break;
            case "4": this.searchFormParameter.QTY_Q = "10000"; break;
            case "5": this.searchFormParameter.QTY_Q = "100000"; break;
            case "6": this.searchFormParameter.QTY_Q = "1000000"; break;
            default: this.searchFormParameter.QTY_Q = "1"; break;
        }
    },
    //기초 파람 설정
    setDataSetting: function (gubun) {
        var parentrow;
        if (gubun != "chk" && this.rowAddCnt == 0) this.isFirstClick = true;

        if (this.getParentInstance(this.parentPageID).getGridProdPopupInfo) {
            parentrow = this.getParentInstance(this.parentPageID).getGridProdPopupInfo(this.rowKey, this.rowIdx, this.isFirstClick, { TargetTab: this.TargetTab })
            parentrow.Parent = JSON.parse(parentrow.ParentDate);
        }

        return parentrow;
    },

    // 부모페이지 값 보내기(체크박스)
    setParentLoadCheckBox: function (data, gubun) {
        $.extend(this.parentDataNew, this.parentDataNew, this.parentData);

        //체크박스를 클릭했다는 플래그
        this.PARENT = this.setDataSetting('chk');
        if (this.check_flag == "N") this.check_flag = "Y";
        var prodName = "prod_cd";
        var arriotype;
        var iotype;
        var SizeDes;
        this.PARENT = this.setDataSetting(gubun);
        this.parentDataNew.rowKey = this.PARENT.rowKey;
        this.parentDataNew.rowIdx = this.PARENT.rowIdx;

        iotype = this.PARENT.Parent.Io_Type;
        arriotype = iotype.split('ㆍ');
        iotype = arriotype[0];

        //입력공통에서 추가로 사용되는 파라미터
        this.parentDataNew = $.extend(this.parentDataNew, this.getInputPageProdData(data));

        if (!$.isEmpty(data.CALC_VAL)) {
            var calcCols = data.CALC_VAL.split('§').where(function (col) { return col.indexOf("NO_USER") > -1 });
            var calcValue = data.CALC_VAL;
            var calcNotMathValue = data.CALC_NOTMATH_VAL;

            calcCols.forEach(function (item, i) {
                //calcVal = calcVal.replace(/-/g, item.CALC_DES);
                var reCol = RegExp(String.format("§{0}§", item), 'gi');
                calcValue = calcValue.replace(reCol, new Decimal(data[item] || "0").toString());
                calcNotMathValue = calcNotMathValue.replace(reCol, new Decimal(data[item] || "0").toString());
            });
            data.CALC_VAL = calcValue;
            data.CALC_NOTMATH_VAL = calcNotMathValue;
            data.SIZE_DES = data.CALC_NOTMATH_VAL;
        }

        if (data.SIZE_DES2 == "") {
            SizeDes = data.SIZE_DES;
        }
        else {
            if (data.SIZE_DES == "") {
                SizeDes = data.SIZE_DES2;
            }
            else {
                SizeDes = data.SIZE_DES; + " " + data.SIZE_DES2;
            }
        }
        this.PARENT.Parent.prod_cd = "";
        this.PARENT.Parent.prod_des = "";
        if (this.PARENT.Parent.prod_cd == "" && this.PARENT.Parent.prod_des == "") {
            this.parentDataNew.PROD_CD = data.PROD_CD;
            if (this.PARENT.Parent.PageType) {
                if (this.Cust == "") {
                    this.parentDataNew.CUST = data.BUSINESS_NO;
                    this.parentDataNew.CUST_DES = data.CUST_NAME;
                }
            }
            if (iotype.substring(0, 1) == '1') {
                this.parentDataNew.UNIT = data.UNIT;
            }
            if ((iotype.substring(0, 1) == '1') || (iotype.substring(0, 1) == '2')) {
                this.parentDataNew.PROD_DES = data.PROD_DES;
                this.parentDataNew.SIZE_DES = SizeDes;
                this.parentDataNew.TAX = data.VatRate;
                this.parentDataNew.UNIT = data.UNIT;
            }
            else if ((iotype == '31') || (iotype == '32') || (iotype == '70') || (iotype == '41') || (iotype == '42') || (iotype == '43') || (iotype == '59')) {

                this.parentDataNew.PROD_DES = data.PROD_DES;
                if (this.PARENT.Parent.isSize_des) {
                    this.parentDataNew.SIZE_DES = SizeDes;
                }

                if (iotype == '31' || iotype == '41' || iotype == '59' || iotype == '51') {
                    this.parentDataNew.UNIT = data.UNIT;
                }
            }
            else {
                if (SizeDes != "") {
                    if (iotype == "71" || iotype == "72") {
                        this.parentDataNew.PROD_DES = data.PROD_DES;
                        this.parentDataNew.SIZE_DES = SizeDes;
                    }
                    else {
                        this.parentDataNew.PROD_DES = data.PROD_DES + " [" + SizeDes + "]";
                    }
                }
                else {
                    this.parentDataNew.PROD_DES = data.PROD_DES;
                }
                if ((iotype == '51')) {
                    if (this.PARENT.Parent.isSize_des) {
                        this.parentDataNew.SIZE_DES = SizeDes;
                    }
                }
            }
            if ((iotype.substring(0, 1) == '1') || (iotype.substring(0, 1) == '3')) {
                var dec_p = Number(this.PARENT.Parent.DecP);
                var dec_q = Number(this.PARENT.Parent.DecQ);
            } else {
                var dec_p = Number(ecount.config.inventory.IN_DEC_P);
            }
            var dec_p = Number(this.PARENT.Parent.DecP);
            var dec_q = Number(this.PARENT.Parent.DecQ);

            var OutPrice = new Decimal(data.OutPrice);
            var VatRate = new Decimal(data.VatRate);
            var InPrice = new Decimal(data.InPrice);
            var SpecialPrice = new Decimal(data.SpecialPrice);

            if ((iotype != '31') && (iotype != '32') && (iotype != '70') && (iotype != '41') && (iotype != '42') && (iotype != '43') && (iotype != '47') && (iotype != '50') && (iotype != '51') && (iotype != '59') && (iotype != '99')) {
                var price = new Decimal(0);
                var userPriceVat = new Decimal("0");
                if (data.SpecialPrice == '') { data.SpecialPrice = new Decimal(0); }
                if (data.SpecialPrice == 0 && data.ChkFlag == 'N') {
                    if (iotype.substring(0, 1) == '1' || iotype.substring(0, 1) == '3') {
                        if (data.OutPrice == '') { data.OutPrice = new Decimal(0); }
                        if (data.OutPrice != 0) {
                            if (data.OutPriceVat == '0') {
                                price = new Decimal(data.OutPrice);
                            }
                            else {
                                price = OutPrice.div(VatRate.div(100).plus(1)).times(10).times(0.1);
                                userPriceVat = OutPrice;
                            }
                        }
                    }
                    else {
                        if (data.InPrice == '') { data.InPrice = new Decimal(0); }
                        if (data.InPrice != 0) {
                            if (data.InPriceVat == '0') {
                                price = new Decimal(data.InPrice);
                            }
                            else {
                                price = InPrice.div(VatRate.div(100).plus(1)).times(10).times(0.1);
                                userPriceVat = InPrice;
                            }
                        }
                    }
                    if (data.IsLastPriceVatInc) {
                        userPriceVat = new Decimal(data.LastPriceVatInclude || "0");
                    }
                }
                else {
                    if (data.SpriceVat == 0 || data.SpriceVat == 'N') {//특별단가
                        price = new Decimal(data.SpecialPrice);
                    }
                    else {
                        if (data.VatRate != 0) {
                            price = SpecialPrice.div(VatRate.div(100).plus(1)).times(10).times(0.1);
                        }
                        else {
                            price = new Decimal(data.SpecialPrice);
                        }
                        userPriceVat = SpecialPrice;
                    }
                }
                if (price.toString() != "0") {
                    switch (dec_p) {
                        case 0: price = price.round(); break;
                        case 1: price = price.times(10).round().div(10); break;
                        case 2: price = price.times(100).round().div(100); break;
                        case 3: price = price.times(1000).round().div(1000); break;
                        case 4: price = price.times(10000).round().div(10000); break;
                        case 5: price = price.times(100000).round().div(100000); break;
                        case 6: price = price.times(1000000).round().div(1000000); break;
                        case 7: price = price.times(10000000).round().div(10000000); break;
                        case 8: price = price.times(100000000).round().div(100000000); break;
                        case 9: price = price.times(1000000000).round().div(1000000000); break;
                        case 10: price = price.times(10000000000).round().div(10000000000); break;
                    }
                    var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(price.toString(), 'R', dec_p));
                    this.parentDataNew.PRICE = new Decimal(num);
                    this.parentDataNew.EXCH_RATE = new Decimal(data.EXCH_RATE);
                }
                else {
                    this.parentDataNew.PRICE = new Decimal(0);
                    this.parentDataNew.EXCH_RATE = new Decimal(0);
                }
                if (userPriceVat.toString() != "0") {
                    switch (dec_p) {
                        case 0: userPriceVat = userPriceVat.round(); break;
                        case 1: userPriceVat = userPriceVat.times(10).round().div(10); break;
                        case 2: userPriceVat = userPriceVat.times(100).round().div(100); break;
                        case 3: userPriceVat = userPriceVat.times(1000).round().div(1000); break;
                        case 4: userPriceVat = userPriceVat.times(10000).round().div(10000); break;
                        case 5: userPriceVat = userPriceVat.times(100000).round().div(100000); break;
                        case 6: userPriceVat = userPriceVat.times(1000000).round().div(1000000); break;
                        case 7: userPriceVat = userPriceVat.times(10000000).round().div(10000000); break;
                        case 8: userPriceVat = userPriceVat.times(100000000).round().div(100000000); break;
                        case 9: userPriceVat = userPriceVat.times(1000000000).round().div(1000000000); break;
                        case 10: userPriceVat = userPriceVat.times(10000000000).round().div(10000000000); break;
                    }
                    var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(userPriceVat.toString(), 'R', dec_p));
                    this.parentDataNew.PRICE_VAT_INCLUDE = new Decimal(num);
                }
                else {
                    this.parentDataNew.PRICE_VAT_INCLUDE = new Decimal("0");
                }
                if (iotype.substring(0, 1) == '1' || (iotype.substring(0, 1) == '2')) {

                    var strUqtyFlags = ecount.config.inventory.UQTY_FLAG;
                    if (strUqtyFlags == "0") {
                        var size_qty = new Decimal(1);
                        if (data.SIZE_FLAG == '1') {
                            var old_size_des = SizeDes;
                            var chk_flags = 1;
                            var size_len = old_size_des.length;
                            for (var d = 0; d <= size_len; d++) {
                                schar = old_size_des.charAt(d);
                                if (schar == '*') {
                                    chk_flags = chk_flags + 1;
                                }
                            }

                            if (chk_flags > 1) {
                                var tmps = old_size_des.split('*');
                                for (var g = 0; g < chk_flags; g++) {
                                    if (isNaN(tmps[g])) size_qty = new Decimal(1);
                                    else size_qty = size_qty.times(Number(tmps[g]));
                                }

                                if (size_qty > 0) {
                                    if (dec_q == 0) {
                                        size_qty = size_qty.floor();
                                    }
                                    else if (dec_q == 1) {
                                        size_qty = size_qty.times(10).round().div(10);
                                    }
                                    else if (dec_q == 2) {
                                        size_qty = size_qty.times(100).round().div(100);
                                    }
                                    else if (dec_q == 3) {
                                        size_qty = size_qty.times(1000).round().div(1000);
                                    }
                                    else if (dec_q == 4) {
                                        size_qty = size_qty.times(10000).round().div(10000);
                                    }
                                    else if (dec_q == 5) {
                                        size_qty = size_qty.times(100000).round().div(100000);
                                    }
                                    else if (dec_q == 6) {
                                        size_qty = size_qty.times(1000000).round().div(1000000);
                                    }

                                    var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(size_qty.toString(), 'R', this.PARENT.Parent.DecQ));
                                    this.parentDataNew.QTY = num;
                                    this.parentDataNew.isQtyChange = true;
                                }
                            }
                        }
                    }
                    else {
                        this.parentDataNew.EXCH_RATE = new Decimal(data.ExchRate);
                        this.parentDataNew.UQTY = new Decimal(data.ExchRate);
                        this.parentDataNew.isUqtyChange = true;
                    }
                    this.parentDataNew.SIZE_FLAG = data.SIZE_FLAG;
                    this.parentDataNew.BAL_FLAG = data.BAL_FLAG;
                }
            }
            else {
                //작업지시서, 창고이동, 불량처리, 자가사용
                if ((iotype == '31') || (iotype == '41') || (iotype == '51') || (iotype == '59')) {
                    this.parentDataNew.EXCH_RATE = new Decimal(data.ExchRate);
                    this.parentDataNew.QTYFOCUS = true;
                    this.parentDataNew.SIZE_FLAG = data.SIZE_FLAG;
                    this.parentDataNew.BAL_FLAG = data.BAL_FLAG;
                }
            }

            if (iotype == '20') {
                this.parentDataNew.BAL_FLAG = data.BAL_FLAG;
            }

            this.parentDataNew.PROD_TAX = data.TAX2;
            this.parentDataNew.PROD_TAX_YN = data.VAT_YN;
            if (this.PARENT.RptGubun == "SELL") {
                this.parentDataNew.ACCTSUBPROD = data.ECOUNT0;
                this.parentDataNew.ACCTSUBSIZE = data.ECOUNT1;
                this.parentDataNew.ACCTSUBBIGO = data.ECOUNT2;
            }
            //관리항목
            this.parentDataNew.ITEM_TYPE = data.ITEM_TYPE;
            if (data.ITEM_TYPE == "N") {
                this.parentDataNew.ITEM_CD = "";
                this.parentDataNew.ITEM_DES = "";
                this.parentDataNew.ITEM_DES_READONLY = true;
            } else if (this.PARENT.Parent.item_des_ReadOnly) {
                this.parentDataNew.ITEM_DES_READONLY = false;
            }
            //시리얼
            this.parentDataNew.SERIAL_TYPE = data.SERLAL_TYPE;
            if (data.SERLAL_TYPE == "N") {
                this.parentDataNew.SERIALNO = "";
                this.parentDataNew.SERIAL_CLASS = "link-gray";
            }
            if (this.PARENT.Parent.ware_flag) {
                if (this.IO_TYPE == "10") {
                    if (this.PARENT.Parent.WarePermit == "R" || this.PARENT.Parent.WarePermit == "X") {
                        this.parentDataNew.CHKWARE_CHECKED = false;
                        this.parentDataNew.WARE_FLAG_CHECKED = false;
                    }
                    else {
                        if (data.PROD_SELL_TYPE == "Y") {
                            this.parentDataNew.CHKWARE_CHECKED = true;
                        }
                        else if (data.PROD_SELL_TYPE == "N") {
                            this.parentDataNew.CHKWARE_CHECKED = false;
                        }
                        else {
                            if (ecount.config.inventory.PROD_SELL_YN && ecount.config.inventory.PROD_SELL_YN == "Y") {
                                this.parentDataNew.CHKWARE_CHECKED = true;
                            }
                            else {
                                this.parentDataNew.CHKWARE_CHECKED = false;
                            }
                        }
                    }
                }
                else if (this.IO_TYPE == "31") {
                    if (this.PARENT.Parent.WarePermit == "R" || this.PARENT.Parent.WarePermit == "X") {
                        this.parentDataNew.CHKWARE_CHECKED = false;
                        this.parentDataNew.WARE_FLAG_CHECKED = false;
                    }
                    else {
                        if (data.PROD_SELL_TYPE == "Y") {
                            this.parentDataNew.CHKWARE_CHECKED = true;
                        }
                        else if (data.PROD_SELL_TYPE == "N") {
                            this.parentDataNew.CHKWARE_CHECKED = false;
                        }
                        else {
                            if (this.PARENT.Parent.ProdWhmoveYn == "Y") {
                                this.parentDataNew.CHKWARE_CHECKED = true;
                            }
                            else {
                                this.parentDataNew.CHKWARE_CHECKED = false;
                            }
                        }
                    }
                }
            }
            this.parentDataNew.QC_YN = data.QC_YN;
            //품질검사요청-구매
            this.parentDataNew.QC_BUY_TYPE = data.QC_BUY_TYPE;

            if (!$.isNull(this.PARENT.Parent.RptGubun) && (this.PARENT.Parent.RptGubun == "ORDER" || this.PARENT.Parent.OrdGubun == "ORD")) {
                if (isNaN(this.PARENT.Parent.time_date.split("/").join("").split("-").join("")) == true || this.PARENT.Parent.time_date == "") {
                    var strColType = this.PARENT.Parent.colType2;
                    var dateTime = this.PARENT.Parent.TimeDate.split("/").join("").split("-").join("");
                    if (dateTime != "") {
                        if (strColType == "10") {
                            dateTime = dateTime.substring(0, 4) + "/" + dateTime.substring(4, 6) + "/" + dateTime.substring(6, 8)
                        } else if (strColType == "11") {  //mm/dd/yy                            
                            dateTime = dateTime.substring(4, 6) + "/" + dateTime.substring(6, 8) + "/" + dateTime.substring(0, 4);
                        } else if (strColType == "12") {  //dd/mm/yyyy
                            dateTime = dateTime.substring(6, 8) + "/" + dateTime.substring(4, 6) + "/" + dateTime.substring(0, 4);
                        } else if (strColType == "13") {
                            dateTime = dateTime.substring(0, 4) + "-" + dateTime.substring(4, 6) + "-" + dateTime.substring(6, 8);
                        } else if (strColType == "14") {
                            dateTime = dateTime.substring(4, 6) + "-" + dateTime.substring(6, 8) + "-" + dateTime.substring(0, 4);
                        } else if (strColType == "15") {
                            dateTime = dateTime.substring(6, 8) + "-" + dateTime.substring(4, 6) + "-" + dateTime.substring(0, 4);
                        }
                    }
                    this.parentDataNew.TIME_DATE = dateTime;
                    this.parentDataNew.TIME_DATE_COLOR = "black";
                }
            }
        }

        this.parentDataNew.totalItemCnt = 1;
        this.parentDataNew.ItemCnt = 0;

        var message = {
            name: "PROD_DES",
            code: "PROD_CD",
            data: this.parentDataNew,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next"
        };
        this.sendMessage(this, message);

        this.rowAddCnt++;
    },

    // 부모페이지 값 보내기(품목코드, 품목명)
    setParentLoad: function (data) {
        $.extend(this.parentDataNew, this.parentDataNew, this.parentData);
        debugger
        var N = data.ChkFlag || "N";
        var rowIdx = this.rowKey;
        var prodName = "prod_cd";

        var arriotype;
        var iotype;
        var SizeDes;

        this.PARENT = this.setDataSetting('');
        this.parentDataNew.rowKey = this.PARENT.rowKey;
        this.parentDataNew.rowIdx = this.PARENT.rowIdx;

        //입력공통에서 추가로 사용되는 파라미터
        this.parentDataNew = $.extend(this.parentDataNew, this.getInputPageProdData(data));

        iotype = this.PARENT.Parent.Io_Type;
        arriotype = iotype.split('ㆍ');
        iotype = arriotype[0];

        if (!$.isEmpty(data.CALC_VAL)) {
            var calcCols = data.CALC_VAL.split('§').where(function (col) { return col.indexOf("NO_USER") > -1 });
            var calcValue = data.CALC_VAL;
            var calcNotMathValue = data.CALC_NOTMATH_VAL;

            calcCols.forEach(function (item, i) {
                var reCol = RegExp(String.format("§{0}§", item), 'gi');
                calcValue = calcValue.replace(reCol, new Decimal(data[item] || "0").toString());
                calcNotMathValue = calcNotMathValue.replace(reCol, new Decimal(data[item] || "0").toString());
            });
            data.CALC_VAL = calcValue;
            data.CALC_NOTMATH_VAL = calcNotMathValue;
            data.SIZE_DES = data.CALC_NOTMATH_VAL;
        }

        if (data.SIZE_DES2 == "") {
            SizeDes = data.SIZE_DES;
        }
        else {
            if (data.SIZE_DES == "") {
                SizeDes = data.SIZE_DES2;
            }
            else {
                SizeDes = data.SIZE_DES; + " " + data.SIZE_DES2;
            }
        }

        this.parentDataNew.PROD_CD = data.PROD_CD;
        this.parentDataNew.BOM_NO = data.BOM_NO;
        if (this.PARENT.Parent.isPageType) {
            if (this.PARENT.Parent.cust == "") {
                this.parentDataNew.CUST = data.BUSINESS_NO;
                this.parentDataNew.CUST_DES = data.CUST_NAME;
            }
        }
       
        if (this.PARENT.arrIoTypesData)
            this.PARENT.arrIoTypes = JSON.parse(this.PARENT.arrIoTypesData);

        if (this.PARENT.arrIoTypes && this.PARENT.arrIoTypes.VAT_YN == "N") {
            data.VatRate = new Decimal(this.PARENT.arrIoTypes.VAT_RATE);
        }

        if ((iotype.substring(0, 1) == '1') || (iotype.substring(0, 1) == '2')) {
            this.parentDataNew.PROD_DES = data.PROD_DES;
            this.parentDataNew.SIZE_DES = SizeDes;
            this.parentDataNew.TAX = data.VatRate;
            this.parentDataNew.UNIT = data.UNIT;
        }
        else if ((iotype == '31') || (iotype == '32') || (iotype == '70') || (iotype == '41') || (iotype == '42') || (iotype == '43') || (iotype == '59')) {          
                this.parentDataNew.PROD_DES = data.PROD_DES;
                if (this.PARENT.Parent.isSize_des) {
                    this.parentDataNew.SIZE_DES = SizeDes;
                }
            
        }
        else {
            if (SizeDes != "") {
                if (iotype == "71" || iotype == "72") {
                    this.parentDataNew.PROD_DES = data.PROD_DES;
                    this.parentDataNew.SIZE_DES = SizeDes;
                }
                else {
                    this.parentDataNew.PROD_DES = data.PROD_DES + " [" + SizeDes + "]";
                }
            }
            else {
                this.parentDataNew.PROD_DES = data.PROD_DES;
            }
            if ((iotype == '51')) {
                this.parentDataNew.SIZE_DES = SizeDes;
            }
        }

        if ((iotype.substring(0, 1) == '1') || (iotype.substring(0, 1) == '3')) {
            var dec_p = Number(this.PARENT.Parent.DecP);
            var dec_q = Number(this.PARENT.Parent.DecQ);
        } else {
            var dec_p = Number(ecount.config.inventory.IN_DEC_P);
        }
        var dec_p = Number(this.PARENT.Parent.DecP);
        var dec_q = Number(this.PARENT.Parent.DecQ);

        var OutPrice = new Decimal(data.OutPrice);
        var VatRate = new Decimal(data.VatRate);
        var InPrice = new Decimal(data.InPrice);
        var SpecialPrice = new Decimal(data.SpecialPrice);

        if ((iotype != '31') && (iotype != '32') && (iotype != '70') && (iotype != '41') && (iotype != '42') && (iotype != '43') && (iotype != '47') && (iotype != '50') && (iotype != '51') && (iotype != '59') && (iotype != '99')) {
            var price = new Decimal(0);
            var userPriceVat = new Decimal("0");
            if (data.SpecialPrice == '') { data.SpecialPrice = new Decimal(0); }
            if (data.SpecialPrice == 0 && data.ChkFlag == 'N') {
                if (iotype.substring(0, 1) == '1' || iotype.substring(0, 1) == '3') {
                    if (data.OutPrice == '') { data.OutPrice = new Decimal(0); }
                    if (data.OutPrice != 0) {
                        if (data.OutPriceVat == '0') {
                            price = new Decimal(data.OutPrice);
                        }
                        else {
                            price = OutPrice.div(VatRate.div(100).plus(1)).times(10).times(0.1);
                            userPriceVat = OutPrice;
                        }
                    }
                }
                else {
                    if (data.InPrice == '') { data.InPrice = new Decimal(0); }
                    if (data.InPrice != 0) {
                        if (data.InPriceVat == '0') {
                            price = new Decimal(data.InPrice);
                        }
                        else {
                            price = InPrice.div(VatRate.div(100).plus(1)).times(10).times(0.1);
                            userPriceVat = InPrice;
                        }
                    }
                }
                if (data.IsLastPriceVatInc) {
                    userPriceVat = new Decimal(data.LastPriceVatInclude || "0");
                }
            }
            else {
                if (data.SpriceVat == 0 || data.SpriceVat == 'N') {//특별단가
                    price = new Decimal(data.SpecialPrice);
                }
                else {
                    if (data.VatRate != 0) {
                        price = SpecialPrice.div(VatRate.div(100).plus(1)).times(10).times(0.1);
                    }
                    else {
                        price = new Decimal(data.SpecialPrice);
                    }
                    userPriceVat = SpecialPrice;
                }
            }
            if (price != 0) {
                switch (dec_p) {
                    case 0: price = price.round(); break;
                    case 1: price = price.times(10).round().div(10); break;
                    case 2: price = price.times(100).round().div(100); break;
                    case 3: price = price.times(1000).round().div(1000); break;
                    case 4: price = price.times(10000).round().div(10000); break;
                    case 5: price = price.times(100000).round().div(100000); break;
                    case 6: price = price.times(1000000).round().div(1000000); break;
                    case 7: price = price.times(10000000).round().div(10000000); break;
                    case 8: price = price.times(100000000).round().div(100000000); break;
                    case 9: price = price.times(1000000000).round().div(1000000000); break;
                    case 10: price = price.times(10000000000).round().div(10000000000); break;
                }

                var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(price.toString(), 'R', dec_p));
                this.parentDataNew.PRICE = new Decimal(num);
                if ((iotype.substring(0, 1) == "1") || (iotype.substring(0, 1) == "3")) {
                    this.parentDataNew.EXCH_RATE = new Decimal(data.ExchRate);
                }
            }
            else {
                this.parentDataNew.PRICE = new Decimal(0);
                if ((iotype.substring(0, 1) == "1") || (iotype.substring(0, 1) == "3")) {
                    this.parentDataNew.EXCH_RATE = new Decimal(0);
                }
            }

            if (userPriceVat.toString() != "0") {
                switch (dec_p) {
                    case 0: userPriceVat = userPriceVat.round(); break;
                    case 1: userPriceVat = userPriceVat.times(10).round().div(10); break;
                    case 2: userPriceVat = userPriceVat.times(100).round().div(100); break;
                    case 3: userPriceVat = userPriceVat.times(1000).round().div(1000); break;
                    case 4: userPriceVat = userPriceVat.times(10000).round().div(10000); break;
                    case 5: userPriceVat = userPriceVat.times(100000).round().div(100000); break;
                    case 6: userPriceVat = userPriceVat.times(1000000).round().div(1000000); break;
                    case 7: userPriceVat = userPriceVat.times(10000000).round().div(10000000); break;
                    case 8: userPriceVat = userPriceVat.times(100000000).round().div(100000000); break;
                    case 9: userPriceVat = userPriceVat.times(1000000000).round().div(1000000000); break;
                    case 10: userPriceVat = userPriceVat.times(10000000000).round().div(10000000000); break;
                }
                var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(userPriceVat.toString(), 'R', dec_p));
                this.parentDataNew.PRICE_VAT_INCLUDE = new Decimal(num);
            }
            else {
                this.parentDataNew.PRICE_VAT_INCLUDE = new Decimal("0");
            }

            if (iotype.substring(0, 1) == '1' || (iotype.substring(0, 1) == '2')) {
                var strUqtyFlags = ecount.config.inventory.UQTY_FLAG;

                if (strUqtyFlags == "0") {
                    var size_qty = new Decimal(1);
                    if (data.SIZE_FLAG == '1') {
                        var old_size_des = SizeDes;
                        var chk_flags = 1;
                        var size_len = old_size_des.length;
                        for (var d = 0; d <= size_len; d++) {
                            schar = old_size_des.charAt(d);
                            if (schar == '*') {
                                chk_flags = chk_flags + 1;
                            }
                        }

                        if (chk_flags > 1) {
                            var tmps = old_size_des.split('*');
                            for (var g = 0; g < chk_flags; g++) {
                                if (isNaN(tmps[g])) size_qty = new Decimal(1);
                                else size_qty = size_qty.times(Number(tmps[g]));
                            }

                            if (size_qty > 0) {
                                if (dec_q == 0) {
                                    size_qty = size_qty.floor();
                                }
                                else if (dec_q == 1) {
                                    size_qty = size_qty.times(10).round().div(10);
                                }
                                else if (dec_q == 2) {
                                    size_qty = size_qty.times(100).round().div(100);
                                }
                                else if (dec_q == 3) {
                                    size_qty = size_qty.times(1000).round().div(1000);
                                }
                                else if (dec_q == 4) {
                                    size_qty = size_qty.times(10000).round().div(10000);
                                }
                                else if (dec_q == 5) {
                                    size_qty = size_qty.times(100000).round().div(100000);
                                }
                                else if (dec_q == 6) {
                                    size_qty = size_qty.times(1000000).round().div(1000000);
                                }
                                var num = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(size_qty.toString(), 'R', this.PARENT.Parent.DecQ));
                                this.parentDataNew.QTY = num;
                                this.parentDataNew.isQtyChange = true;
                            }
                        }
                    }
                    //현업요청및 발주계획 포커스 주기
                    if (this.PARENT.Parent.isPageType) {
                        if (this.PARENT.Parent.isCust && this.PARENT.Parent.isCustHidden && this.PARENT.Parent.isCustReadOnly) {
                            this.parentDataNew.CUST_FOCUS = true;
                        }
                        else if (this.PARENT.Parent.isWh_cd) {
                            this.parentDataNew.WH_CD_FOCUS = true;
                        }
                        else {
                            this.parentDataNew.QTYFOCUS = true;
                        }
                    }
                    else {
                        this.parentDataNew.QTYFOCUS = true;
                    }
                }
                else {
                    this.parentDataNew.EXCH_RATE = data.ExchRate;
                    this.parentDataNew.QTYFOCUS = true;
                }
                this.parentDataNew.SIZE_FLAG = data.SIZE_FLAG;
                this.parentDataNew.BAL_FLAG = data.BAL_FLAG;
            }
            else {
                //현업요청및 발주계획 포커스 주기
                if (this.PARENT.Parent.isPageType) {
                    if (this.PARENT.Parent.isCust && this.PARENT.Parent.isCustDisplay && this.PARENT.Parent.isCustReadOnly) {
                        this.parentDataNew.CUST_FOCUS = true;
                    }
                    else if (this.PARENT.Parent.isWh_cd) {
                        this.parentDataNew.WH_CD_FOCUS = true;
                    }
                    else {
                        this.parentDataNew.QTYFOCUS = true;
                    }
                }
                else {
                    this.parentDataNew.QTYFOCUS = true;
                }
            }
        }
        else {
            //작업지시서, 창고이동, 불량처리, 자가사용
            if ((iotype == '31') || (iotype == '41') || (iotype == '51') || (iotype == '59') || (iotype == '70')) {
                this.parentDataNew.EXCH_RATE = new Decimal(data.ExchRate);
                this.parentDataNew.QTYFOCUS = true;
                this.parentDataNew.SIZE_FLAG = data.SIZE_FLAG;
                this.parentDataNew.BAL_FLAG = data.BAL_FLAG;
                this.parentDataNew.UNIT = data.UNIT;
            }
        }
        if (iotype == '20') {
            this.parentDataNew.BAL_FLAG = data.BAL_FLAG;
        }

        if (this.PARENT.Parent.isProd_tax) {
            this.parentDataNew.PROD_TAX = new Decimal(data.TAX2);
            this.parentDataNew.PROD_TAX_YN = data.VAT_YN;
        }

        if (this.parentDataNew.QTYFOCUS) {
            this.parentDataNew.INPUTFOCUS = "qty";
        }

        if (this.PARENT.Parent.RptGubun == "SELL") {
            this.parentDataNew.ACCTSUBPROD = data.ECOUNT0;
            this.parentDataNew.ACCTSUBSIZE = data.ECOUNT1;
            this.parentDataNew.ACCTSUBBIGO = data.ECOUNT2;
        }

        //관리항목
        this.parentDataNew.ITEM_TYPE = data.ITEM_TYPE;
        if (data.ITEM_TYPE == "N") {
            this.parentDataNew.ITEM_CD = "";
            this.parentDataNew.ITEM_DES = "";
            this.parentDataNew.ITEM_DES_READONLY = true;
        } else if (this.PARENT.Parent.item_des_ReadOnly) {
            this.parentDataNew.ITEM_DES_READONLY = false;
        }
        //시리얼
        this.parentDataNew.SERIAL_TYPE = data.SERLAL_TYPE;
        if (data.SERLAL_TYPE == "N") {
            this.parentDataNew.SERIALNO = "";
            this.parentDataNew.SERIAL_CLASS = "link-gray";
        }
        this.parentDataNew.PROD_TAX_YN = data.VAT_YN;
        //생산전표생성
        if (this.PARENT.Parent.ware_flag) {
            if (this.IO_TYPE == "10") {
                if (this.PARENT.Parent.WarePermit == "R" || this.PARENT.Parent.WarePermit == "X") {
                    this.parentDataNew.CHKWARE_CHECKED = false;
                    this.parentDataNew.WARE_FLAG_CHECKED = false;
                }
                else {                    
                    if (data.PROD_SELL_TYPE == "Y") {
                        this.parentDataNew.CHKWARE_CHECKED = true;
                    }
                    else if (data.PROD_SELL_TYPE == "N") {
                        this.parentDataNew.CHKWARE_CHECKED = false;
                    }
                    else {
                        if (ecount.config.inventory.PROD_SELL_YN && ecount.config.inventory.PROD_SELL_YN == "Y") {
                            this.parentDataNew.CHKWARE_CHECKED = true;
                        }
                        else {
                            this.parentDataNew.CHKWARE_CHECKED = false;
                        }
                    }
                }
            }
            else if (this.IO_TYPE == "31") {
                if (this.PARENT.Parent.WarePermit == "R" || this.PARENT.Parent.WarePermit == "X") {
                    this.parentDataNew.CHKWARE_CHECKED = false;
                    this.parentDataNew.WARE_FLAG_CHECKED = false;
                }
                else {                    
                    if (data.PROD_SELL_TYPE == "Y") {
                        this.parentDataNew.CHKWARE_CHECKED = true;
                    }
                    else if (data.PROD_SELL_TYPE == "N") {
                        this.parentDataNew.CHKWARE_CHECKED = false;
                    }
                    else {
                        if (this.PARENT.Parent.ProdWhmoveYn == "Y") {
                            this.parentDataNew.CHKWARE_CHECKED = true;
                        }
                        else {
                            this.parentDataNew.CHKWARE_CHECKED = false;
                        }
                    }
                }
            }
            //품질검사요청-생산입고
            this.parentDataNew.QC_YN = data.QC_YN;
            //품질검사요청-구매
            this.parentDataNew.QC_BUY_TYPE = data.QC_BUY_TYPE;

            if (this.PARENT.Parent.RptGubun == "ORDER" || this.PARENT.Parent.OrdGubun == "ORD") {
                if (isNaN(this.PARENT.Parent.time_date.split("/").join("").split("-").join("")) == true || this.PARENT.Parent.time_date == "") {
                    var strColType = this.PARENT.Parent.colType2;
                    var dateTime = this.PARENT.Parent.TimeDate.split("/").join("").split("-").join("");
                    if (dateTime != "") {
                        if (strColType == "10") {
                            dateTime = dateTime.substring(0, 4) + "/" + dateTime.substring(4, 6) + "/" + dateTime.substring(6, 8)
                        } else if (strColType == "11") {  //mm/dd/yy                            
                            dateTime = dateTime.substring(4, 6) + "/" + dateTime.substring(6, 8) + "/" + dateTime.substring(0, 4);
                        } else if (strColType == "12") {  //dd/mm/yyyy
                            dateTime = dateTime.substring(6, 8) + "/" + dateTime.substring(4, 6) + "/" + dateTime.substring(0, 4);
                        } else if (strColType == "13") {
                            dateTime = dateTime.substring(0, 4) + "-" + dateTime.substring(4, 6) + "-" + dateTime.substring(6, 8);
                        } else if (strColType == "14") {
                            dateTime = dateTime.substring(4, 6) + "-" + dateTime.substring(6, 8) + "-" + dateTime.substring(0, 4);
                        } else if (strColType == "15") {
                            dateTime = dateTime.substring(6, 8) + "-" + dateTime.substring(4, 6) + "-" + dateTime.substring(0, 4);
                        }
                    }
                    this.parentDataNew.TIME_DATE = dateTime;
                    this.parentDataNew.TIME_DATE_COLOR = "black";
                }
            }
        }

        this.parentDataNew.totalItemCnt = 1;
        this.parentDataNew.ItemCnt = 0;

        var message = {
            name: "PROD_DES",
            code: "PROD_CD",
            data: this.parentDataNew,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "current",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //신규양식에서 필요한 품목정보 추가로 설정
    getInputPageProdData: function (data) {
        var addData = {};

        addData.PROD_TYPE = data.PROD_TYPE;
        addData.INSPECT_STATUS = data.INSPECT_STATUS;
        addData.SAMPLE_PERCENT = data.SAMPLE_PERCENT;
        addData.CALC_VAL = data.CALC_VAL;
        addData.CALC_NOTMATH_VAL = data.CALC_NOTMATH_VAL;

        addData.CLASS_CD = data.CLASS_CD;
        addData.CLASS_CD2 = data.CLASS_CD2;
        addData.CLASS_CD3 = data.CLASS_CD3;
        addData.CLASS_DES = data.CLASS_DES;
        addData.CLASS_DES2 = data.CLASS_DES2;
        addData.CLASS_DES3 = data.CLASS_DES3;
        addData.BAR_CODE = data.BAR_CODE;
        addData.VAT_RATE_BY = data.VAT_RATE_BY;
        addData.EXCH_RATE = data.EXCH_RATE;
        addData.EXCH_RATE2 = data.EXCH_RATE2;
        addData.DENO_RATE = data.DENO_RATE;
        addData.IN_PRICE = data.IN_PRICE;
        addData.OUT_PRICE = data.OUT_PRICE;
        addData.OUT_PRICE1 = data.OUT_PRICE1;
        addData.OUT_PRICE2 = data.OUT_PRICE2;
        addData.OUT_PRICE3 = data.OUT_PRICE3;
        addData.OUT_PRICE4 = data.OUT_PRICE4;
        addData.OUT_PRICE5 = data.OUT_PRICE5;
        addData.OUT_PRICE6 = data.OUT_PRICE6;
        addData.OUT_PRICE7 = data.OUT_PRICE7;
        addData.OUT_PRICE8 = data.OUT_PRICE8;
        addData.OUT_PRICE9 = data.OUT_PRICE9;
        addData.OUT_PRICE10 = data.OUT_PRICE10;
        addData.NO_USER1 = data.NO_USER1;
        addData.NO_USER2 = data.NO_USER2;
        addData.NO_USER3 = data.NO_USER3;
        addData.NO_USER4 = data.NO_USER4;
        addData.NO_USER5 = data.NO_USER5;
        addData.NO_USER6 = data.NO_USER6;
        addData.NO_USER7 = data.NO_USER7;
        addData.NO_USER8 = data.NO_USER8;
        addData.NO_USER9 = data.NO_USER9;
        addData.NO_USER10 = data.NO_USER10;
        addData.CALC_VAL_ORIGIN = data.CALC_VAL;
        addData.CALC_NOTMATH_VAL_ORIGIN = data.CALC_NOTMATH_VAL;
        addData.SAFE_QTY = data.SAFE_QTY;
        addData.REMARKS = data.REMARKS;
        addData.REMARKS_WIN = data.REMARKS_WIN;
        addData.WH_CD = data.WH_CD;
        addData.WH_DES = data.WH_DES;
        addData.CONT1 = data.CONT1;
        addData.CONT2 = data.CONT2;
        addData.CONT3 = data.CONT3;
        addData.CONT4 = data.CONT4;
        addData.CONT5 = data.CONT5;
        addData.CONT6 = data.CONT6;
        addData.SET_FLAG = data.SET_FLAG;

        addData.PROD_SELL_TYPE = data.PROD_SELL_TYPE;
        addData.PROD_WHMOVE_TYPE = data.PROD_WHMOVE_TYPE;
        //생산입고
        addData.QC_YN = data.QC_YN;
        //구매
        addData.QC_BUY_TYPE = data.QC_BUY_TYPE;

        return addData;
    },

    ON_KEY_F8: function (e) {
        this.onHeaderSearch(e);
    }

});
