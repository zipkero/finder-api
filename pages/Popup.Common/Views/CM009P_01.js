window.__define_resource && __define_resource("LBL04065","LBL04066","LBL04053","LBL03068","LBL02211","LBL00778","LBL01826","BTN00553","BTN00008","MSG00456","MSG00342","MSG00975","MSG00076");
/****************************************************************************************************
1. Create Date : 2015.00.00
2. Creator     : hrkim
3. Description : 수금지급예정일
4. Precaution  : 
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM009P_01", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,
  
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    // 수금/지급 예정일 유형(D:일, M:월, W:주, N:사용안함)  strColl_Pay_type  - > collPaytype
    collPaytype: null,
    // 수금/지급 예정일 (일)  strColl_Pay_d  --> collPayDD
    collPayDD: null,
    // 수금/지급 예정일 (월)  strColl_Pay_m   -->  collPayMM
    collPayMM: null,
    // 수금/지급 예정일 (주)  strColl_Pay_w   -->   collPayWW
    collPayWW: null,
    // 수금/지급 예정일 (요일)(1:일,2:월,3:화,4:수,5:목,6:금,7:토)  strColl_Pay_dw --> CollPaydw
    collPaydw: null,

    //회사 정보의 수금, 지급일 기본 설정값을 중 일,월,주 구분값(strColl_Basic_Pay_type  -> collBasicPaytype)
    collBasicPaytype: null,
    // row 개수 계산
    rowCount: 5,
    //strCollFlag
    collCntFlag: null,

    // 날짜 계산
    dtCollDate: null,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        
    },

    render: function () {
        if (this.isInputFlag == false && $.isEmpty(this.inputBasicDate) == false) {
            this.dtCollDate = String.format("{0}-{1}-{2}", this.inputBasicDate.substring(0, 4), this.inputBasicDate.substring(4, 6), this.inputBasicDate.substring(6, 8)).toDate();
        }
        else {
            this.dtCollDate = ecount.control.date.serverDate(this.ecPageID);
        }
        this._super.render.apply(this, arguments);        
        this.changePayment();
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var g = widget.generator;
        var ctrl = g.control();
        var resourceNm;
        if (this.IoFlag == "1") {
            resourceNm = ecount.resource.LBL04065;
        } else {
            resourceNm = ecount.resource.LBL04066;
        }
        header.notUsedBookmark().setTitle(resourceNm);
        header.add("option", ([{ id: "setupModify", label:  ecount.resource.LBL04053 }]), false);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
                        toolbar = generator.toolbar(),
                        form = generator.form(),
                        ctrl = generator.control(),
                        grid = generator.grid();                    

        var mergeData = {};
        mergeData['_MERGE_USEOWN'] = false;
        mergeData['_ROW_TYPE'] = 'TOTAL';
        mergeData['_ROW_TITLE'] = ecount.resource.LBL03068;
        mergeData['_IS_CENTER_ALIGN'] = true;
        mergeData['_MERGE_START_INDEX'] = 0;
        mergeData['_COLSPAN_COUNT'] = 1;
        mergeData['_ROWSPAN_COUNT'] = 0;

        // Initialize Grid 
        grid.setEditable(true,this.rowCount)
            .setColumns([
                {
                    propertyName: 'COLLDATE', id: 'COLLDATE', title: ecount.resource.LBL02211, controlType: 'widget.date', width: '200', controlOption: { maxLength: 8 },
                    align: "center"
                },
                {
                    propertyName: 'COLLAMT', id: 'COLLAMT', title: ecount.resource.LBL00778, width: '', controlType: 'widget.input.number', dataType: ('9' + parseInt(2)), controlOption: {
                        decimalUnit: [28, parseInt(2)]
                    }, align: "right", isCheckZero: false
                },
                { propertyName: 'COLLCHECK', id: 'COLLCHECK', title: ecount.resource.LBL01826, width: '', align: "center" }
            ])
            .setRowData(this.receiptPaymentPlan)
            .setColumnFixHeader(true)
            .setCheckBoxActiveRowStyle(true)
            .setKeyColumn('row_key')
            .setEditSpecialRowCount(1)
            .setEventAutoAddRowOnLastRow(true, 2)
            .setEditSpecialRowMerge([{ '_MERGE_SET': new Array(mergeData) }])
            .setCustomRowCell('COLLDATE', this.setGridDateCustomDate.bind(this))
            .setCustomRowCell('COLLAMT', this.setGridDateCustomSupplyAmt.bind(this))
            .setCustomRowCell('COLLCHECK', this.setGridDateCustomCheckbox.bind(this))
        ;
        //form
        form.template("register")
        contents.add(form);
        contents.addGrid("dataGrid" + this.pageID, grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00553))
               .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/
  
    // After the document loaded
    onLoadComplete: function () {
        var _gridObj = this.contents.getGrid().grid;
        _gridObj.setCellFocus("COLLAMT", _gridObj.getRowKeyByIndex(0));
       // this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        //   gridObj.grid.setCellFocus('CD_GROUP', '0');
        var _gridObj = this.contents.getGrid().grid;
        _gridObj.addCellClass('COLLAMT', "special-row-0", ['text-right']);
        //this.saleGrid = this.contents.getGrid().grid;
        //하단 합계
        this.footerTotalCntDraw();
    },

    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        handler(params);
    },
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/


    setGridDateCustomDate: function (value, rowItem) {
        var option = {};
        option.useDateSpace = true;
        return option;
    },

    //그리드 공급가액 이벤트
    setGridDateCustomSupplyAmt: function (value, rowItem) {
        var option = {},
            grid = this.contents.getGrid().grid;
        var t = this;
        option.event = {
            'change': function (event, gridData) {
                t.footerTotalCntDraw();
            }
        }
        return option;
    },

    setGridDateCustomCheckbox: function (value, rowItem) {
        var option = {};
        option.controlType = 'widget.checkbox';
        return option;
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    onFooterApply: function (e) {
        if (this.viewBag.Permission.collPayPermission.Value.equals("R")) { 
            ecount.alert(ecount.resource.MSG00456);
            return false; 
        } 
        else if ((this.viewBag.Permission.collPayPermission.Value.equals("U")) && (this.editFlag == 'M')) {
            ecount.alert(ecount.resource.MSG00342);
            return false; 
        }	

        var basicDate = $.parseNumber(this.inputBasicDate);

        var grid = this.contents.getGrid('dataGrid' + this.pageID).grid;
        var rowList = grid.getRowList();

        var isValid = true;
        var resultItems = [];
        
        var collDate = "";
        var collAmt = "";
        var collCheck = "";

        grid.editDone();

        $.each(rowList, function (i, item) {
            collDate = item.COLLDATE.replaceAll("-", "");
            collAmt = new Decimal(item.COLLAMT || 0);
            collCheck = item.COLLCHECK == true ? "1" : "0";

            // 금액이 입력된 Row만 처리대상으로 함.
            if (collAmt.isZero() || collAmt.isNaN()) {
                return true;
            }
            
            // 일자가 입력된 Row만 처리대상으로 함.
            if ($.isEmpty(collDate)) {
                return true;
            }

            // 일자체크
            if ($.parseNumber(collDate) < basicDate) {
                var rowKey = item[ecount.grid.constValue.keyColumnPropertyName];

                grid.setCellFocus('COLLDATE', rowKey);
                grid.setCellShowError("COLLDATE", rowKey, {
                    message: ecount.resource.MSG00975
                });

                isValid = false;
                return false;
            }

            // 처리결과 생성
            resultItems.push(String.format("{0}@{1}@{2}", collDate, collAmt, collCheck));
        });

        // 데이터체크 결과가 유효하지 않을 경우 이후 처리를 실행하지 않음.
        if (isValid == false) {
            return;
        }

        var result = "";

        if (resultItems.length > 0) {
            result += resultItems.length.toString();
            result += "/";
            result += resultItems.join("/");
        }

        this.sendMessage(this, {
            resultCollData: result,
            callback: this.close.bind(this)
        });
    },

    onDropdownSetupModify: function (e) {

        if (this.custCode == "" || $.isEmpty(this.custCode) || $.isNull(this.custCode)) {
            ecount.alert(ecount.resource.MSG00076);
        } else
        {
            var params = {
                width: ecount.infra.getPageWidthFromConfig(),
                height: 240,
                parentPageID: this.pageID,
                responseID: this.callbackID, //필수값
                TrxType: this.paymentType,                   //  hidTrx_Type  --> paymentType
                CustCode: this.custCode,                     // this.contents.getControl("CUST").getValue(),
                IsCustNameDisplay : false

            };
            // Open popup
            this.openWindow({
                url: '/ECERP/Popup.Common/CM009P_02',
                name: "",
                param: params,
                popupType: false,
                additional: false
            });

        }       
    },
    
    //Close button click event
    onFooterClose: function () {
        this.close();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/

    
    footerTotalCntDraw: function () {
        var _gridObj = this.contents.getGrid().grid;
        var totalSupplyAmt = new Decimal(0);
        //for (var i = 0; i < _gridObj.getRowCount() ; i++) {
        //    var o = _gridObj.getRowListObject()[i];
        //    totalSupplyAmt = totalSupplyAmt.plus(new Decimal(o.COLLAMT || 0));
        //}
        var rowList = _gridObj.getRowList();
        for (var i = 0, ilimit = rowList.length; i < ilimit; i++) {
            totalSupplyAmt = totalSupplyAmt.plus(new Decimal(rowList[i].COLLAMT || 0));
        }
        _gridObj.setCell('COLLAMT', 'special-row-0', totalSupplyAmt.toString(), ["text-right", "text-bold"]);
    },



    changePayment: function () {
        if (this.paymentType == "1")//수금
        {
            if (!($.isEmpty(ecount.config.company.COLL_PLAN_TYPE) || $.isNull(ecount.config.company.COLL_PLAN_TYPE)))    ///  COLL_PLAN_TYPE
                this.collBasicPaytype = ecount.config.company.COLL_PLAN_TYPE;   // COLL_PLAN_TYPE
            else
                this.collBasicPaytype = "N";

            if (this.collBasicPaytype != "N") {
                this.collPayDD = ecount.config.company.COLL_PLAN_D;   //COLL_PLAN_D 
                this.collPayMM = ecount.config.company.COLL_PLAN_M;   //COLL_PLAN_M
                this.collPayWW = ecount.config.company.COLL_PLAN_W;   // COLL_PLAN_W
                this.collPaydw = ecount.config.company.COLL_PLAN_DW;  //COLL_PLAN_DW
            }
        }
        else if (this.paymentType == "2")//지급
        {
            if (!($.isEmpty(ecount.config.company.PAY_PLAN_TYPE) || $.isNull(ecount.config.company.PAY_PLAN_TYPE)))   //PAY_PLAN_TYPE
                this.collBasicPaytype = ecount.config.company.PAY_PLAN_TYPE;  //PAY_PLAN_TYPE
            else
                this.collBasicPaytype = "N";

            if (this.collBasicPaytype != "N") {
                this.collPayDD = ecount.config.company.PAY_PLAN_D;   //PAY_PLAN_D
                this.collPayMM = ecount.config.company.PAY_PLAN_M;   // PAY_PLAN_M
                this.collPayWW = ecount.config.company.PAY_PLAN_W;   // PAY_PLAN_W
                this.collPaydw = ecount.config.company.PAY_PLAN_DW;  // PAY_PLAN_DW
            }
        }

        //해당거래처 수금지급일 
        if (!$.isNull(this.viewBag.InitDatas.custInfo))  //COLL_PAY_TYPE this.viewBag.InitDatas.custInfo
            this.collPaytype = this.viewBag.InitDatas.custInfo.Data.COLL_PAY_TYPE;    //COLL_PAY_TYPE
        else
            this.collPaytype = "N";

        //기본설정사용이 아닐때만 사용
        if (this.collPaytype != "B") {
            if (!$.isNull(this.viewBag.InitDatas.custInfo))   //COLL_PAY_D
            {
                this.collPayDD = this.viewBag.InitDatas.custInfo.Data.COLL_PAY_D;  //COLL_PAY_D
                this.collPayMM = this.viewBag.InitDatas.custInfo.Data.COLL_PAY_M;  // COLL_PAY_M
                this.collPayWW = this.viewBag.InitDatas.custInfo.Data.COLL_PAY_W;   // COLL_PAY_W
                this.collPaydw = this.viewBag.InitDatas.custInfo.Data.COLL_PAY_DW;  // COLL_PAY_DW
            }
            else {
                this.collPayDD = "0";
                this.collPayMM = "0";
                this.collPayWW = "0";
                this.collPaydw = "0";
            }
        }

        var arrAdata = [];
        
        if (this.inRowCollCnt == "0") {
            this.collCntFlag = "I";
        }
        else {
            this.collCntFlag = "M";
            if (this.inRowCollCnt > 5) this.rowCount = this.inRowCollCnt;
        }

        if (this.collCntFlag == "M") {
            for (var j = 0; j < this.receiptPaymentPlan.length; j++) {
                if (this.receiptPaymentPlan[0].COLLDATE == "") {
                    this.fnCollDate();
                    this.receiptPaymentPlan[0].COLLDATE = this.dtCollDate.format('yyyyMMdd');  // dtCollDate.ToString("yyyyMMdd");     
                }
            }
        }
        else {
            //날짜셋팅
            this.fnCollDate();
            this.receiptPaymentPlan[0].COLLDATE = this.dtCollDate.format('yyyyMMdd');  //dtCollDate.ToString("yyyyMMdd");
        }
    },
    
 
    fnCollDate: function () {
        switch (this.collPaytype) {
            case "B": 
                this.fnCollDate_Detail(this.collBasicPaytype);
                break;
            default :
                this.fnCollDate_Detail(this.collPaytype);
                break;
        }
    },


    fnCollDate_Detail: function (subCollDateType) {
        switch (subCollDateType) {
         
            case "D": //일
                this.dtCollDate = this.dtCollDate.addDays(parseInt(this.collPayDD));
                break;
            case "M": //월
                var dtTempDate = this.dtCollDate;
                this.dtCollDate = this.dtCollDate.format("yyyy-MM-" + 01).toDate();
                this.dtCollDate = this.dtCollDate.addMonths(parseInt(this.collPayMM));
                var collDay = (this.collPayDD.length > 1 ? this.collPayDD : "0" + this.collPayDD);
                if (ecount.validator.check("ecDate", this.dtCollDate.format("yyyyMM") + collDay)) {
                    //this.dtCollDate = this.dtCollDate.lastDayOfMonth();
                    this.dtCollDate = (this.dtCollDate.format("yyyy-MM-" + collDay)).toDate();
                }
                else {
                    //this.dtCollDate = this.dtCollDate.format("yyyyMM") + "01"
                    this.dtCollDate = this.dtCollDate.firstDayOfMonth();
                    this.dtCollDate = this.dtCollDate.addMonths(1).addDays(-1);
                }
                if (this.dtCollDate.format("yyyyMMdd") < dtTempDate.format("yyyyMMdd")) {
                    this.dtCollDate = this.dtCollDate.addMonths(1);
                    if (ecount.validator.check("ecDate", this.dtCollDate.format("yyyyMM") + collDay)) {
                        this.dtCollDate = (this.dtCollDate.format("yyyy-MM-" + collDay)).toDate();
                        //this.dtCollDate = this.dtCollDate.addDays(parseInt(this.collPayDD));
                    }
                }
                 break;
            case "W": //주
                var dtTempDate = this.dtCollDate;
                var iCollPayw = parseInt(this.collPayWW); // 설정된 주
                var iCollPaydw = parseInt(this.collPaydw); // 설정된 일
                var d = new Date();
                var inowdayofweek = parseInt(dtTempDate.getDay()) + 1;  //오늘 요일
                this.dtCollDate = this.dtCollDate.addDays(iCollPayw * 7);
                    
                if(iCollPayw * 7 - inowdayofweek + iCollPaydw < 0 )
                    this.dtCollDate = dtTempDate.addDays(iCollPayw * 7 - inowdayofweek + iCollPaydw + 7);
                else
                    this.dtCollDate = dtTempDate.addDays(iCollPayw * 7 - inowdayofweek + iCollPaydw);
                break;
        }

    },

});


