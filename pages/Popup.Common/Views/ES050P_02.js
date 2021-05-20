window.__define_resource && __define_resource("LBL11874","LBL11960","LBL11879","BTN00069","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.11.23
2. Creator     : 임명식
3. Description : 재고>기초등록>품목등록 > 규격계산그룹 등록 
4. Precaution  :규격계산그룹검색
5. History     : 2019.06.25(taind) A19_01497 - 소스코드진단결과 반영 - Master
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES050P_02", {
                                                
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/
    
    calcVal: null,

    calcNotMathVal: null,

    calcCols: [],

    gridCalcCols: [],
    init: function (options) {
        this._super.init.apply(this, arguments);
        var _self = this;
        //v§NO_USER1§*§NO_USER5§*§NO_USER10§*§NO_USER9§
        
        this.calcVal = this.viewBag.InitDatas.CalcLoad.CALC_VAL;
        this.calcNotMathVal = this.viewBag.InitDatas.CalcLoad.CALC_NOTMATH_VAL;
        this.calcCols = this.calcVal.split('§').where(function (col) { return col.indexOf("NO_USER") > -1 });
        this.gridCalcCols = this.viewBag.InitDatas.FormCalc.where(function (col) { return _self.calcCols.contains(col.CALC_CD) });
        this.gridCalcCols.forEach(function (item, i) {
            item.CALC_DES = this.viewBag.InitDatas.CalcLoad[item.CALC_CD];
        }.bind(this));
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
        header.setTitle(ecount.resource.LBL11874);
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        
        var generator = widget.generator,
            ctrl = widget.generator.control(),
             settings = generator.grid();


        var columns = [
             { propertyName: 'CALC_TITLE', id: 'CALC_TITLE', title: ecount.resource.LBL11960, width: '' }, // resource: 계산항목명   
             { propertyName: 'CALC_DES', id: 'CALC_DES', title: ecount.resource.LBL11879, width: '', dataType: "810", controlType: "widget.input.number", align: "right", isCheckZero: false, controlOption: { decimalUnit: [18, 6] } }, //resource: 수치   
        ]
        settings
            .setEditable(true, 0, 0)
            .setRowData(this.gridCalcCols)
            .setKeyColumn(['CALC_CD'])
            .setCustomRowCell('CALC_DES', this.setGridCustomDes.bind(this));
        settings.setColumns(columns);
        contents
            .addGrid("dataGrid", settings);
        
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        if (!$.isEmpty(this.gridCalcCols.first().CALC_CD)) {
            var grid = this.contents.getGrid().grid;
            grid.setCellFocus("CALC_DES", this.gridCalcCols.first().CALC_CD);
        }
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    setGridCustomDes: function (value, rowItem) {
        var option = {},
           grid = this.contents.getGrid().grid;
        option.event = {
            'setNextFocus': function (event, gridData) {
                if (gridData.rowIdx == grid.getRowCount() - 1) {
                    this.footer.getControl("apply").setFocus(0);
                }
            }.bind(this)
        };
        return option;
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //저장- Flag = 1
    onFooterApply: function (e) {
        var message = {
            data: {
                ROW_KEY: this.ROW_KEY,
                SIZE_DES: "",
                SIZE_DES_CALC: "",
                SIZE_DES_CALC_NOTMATH: ""
            },
            callback: this.close.bind(this)
        };
        //§NO_USER5§
        var _self = this;
        var gridItems = this.contents.getGrid().grid.getRowList();
        if (gridItems.length > 0) {
            debugger
            gridItems.forEach(function (item, i) {
                Decimal.toExpNeg = -11;

                //calcVal = calcVal.replace(/-/g, item.CALC_DES);
                var reCol = RegExp(String.format("§{0}§", item.CALC_CD), 'gi');
                _self.calcVal = _self.calcVal.replace(reCol, new Decimal(item.CALC_DES).toString());
                _self.calcNotMathVal = _self.calcNotMathVal.replace(reCol, new Decimal(item.CALC_DES).toString());
            });
        }
        //message.data.SIZE_DES = _self.calcVal.replace(/fnMathRound/gi, "").replace(/fnMathIncrease/gi, "").replace(/fnMathCutCalc/gi, "");
        message.data.SIZE_DES = _self.calcNotMathVal; //_self.calcVal;
        message.data.SIZE_DES_CALC = _self.calcVal;
        message.data.SIZE_DES_CALC_NOTMATH = _self.calcNotMathVal;
        this.sendMessage(this, message);
    },
   
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onFooterApply();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
       // this.onContentsSearch(target.control.getValue());
    },


});
