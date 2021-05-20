window.__define_resource && __define_resource("LBL11664","LBL05002","LBL80169","LBL06110","LBL05616","LBL05442","LBL04701","BTN00008","LBL00793","LBL01518","LBL05001","MSG00141");
/****************************************************************************************************
1. CREATE DATE : 2016.11.04
2. CREATOR     : 윤국한
3. DESCRIPTION : 급여불러오기 팝업(국내급여, 글로벌급여, 일용직급여I, 일용직급여II)
4. PRECAUTION  : 
5. HISTORY     : 2020.02.18 (JINHO JANG) - 급여관리2 신규프레임 진행하면서 일용직의 급여불러오기 팝업을 더이상 사용하지 않게 되어 주석처리 함
****************************************************************************************************/
//ecount.page.factory("ecount.page.popup.type2", "EBD001P", {
//    /********************************************************************** 
//    * page user opion Variables(사용자변수 및 객체) 
//    **********************************************************************/
//    newItem: false,
//    /********************************************************************** 
//    * page init 
//    **********************************************************************/
//    init: function (options) {
//        this._super.init.apply(this, arguments);

//        this.payListFlag = !$.isEmpty(this.PAY_LIST_FLAG) ? this.PAY_LIST_FLAG : "P0"; // P0 : 국내급여, P1 : 글로벌급여, P2 : 일용직급여I, P3 : 일용직급여II
        
//        this.initProperties();
//    },

//    initProperties: function () {
        
//    },

//    render: function () {
//        this._super.render.apply(this);
//    },

//    /**********************************************************************
//    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
//    **********************************************************************/
//    //헤더 옵션 설정
//    onInitHeader: function (header, resource) {
//        header.notUsedBookmark();
//        header.setTitle(ecount.resource.LBL11664);
//    },

//    //본문 옵션 설정
//    onInitContents: function (contents, resource) {
//        debugger;
//        var generator = widget.generator,
//            toolbar = generator.toolbar(),
//            ctrl = generator.control(),
//            settings = generator.grid();
//        var columns = [];

//        if (this.payListFlag == "P0") {
//            columns.push({ propertyName: 'YYYYMM', id: 'YYYYMM', title: ecount.resource.LBL05002, align: 'center', width: '' });
//            columns.push({ propertyName: 'PAY_GUBUN', id: 'PAY_GUBUN', title: ecount.resource.LBL80169, align: 'center', width: '' });
//            columns.push({ propertyName: 'PAY_DES', id: 'PAY_DES', title: ecount.resource.LBL06110, width: '' });
//            columns.push({ propertyName: 'PAY_DATE', id: 'PAY_DATE', title: ecount.resource.LBL05616, align: 'center', width: '' });
//            columns.push({ propertyName: 'YYMM_RPT', id: 'YYMM_RPT', title: ecount.resource.LBL05442, align: 'center', width: '' });

//            settings
//                .setCustomRowCell('YYYYMM', this.setGridDateLink.bind(this))
//                .setCustomRowCell('PAY_GUBUN', this.setGridPayGubunDataFormat.bind(this))
//                .setCustomRowCell('PAY_DES', this.setGridPayDesDataFormat.bind(this))
//                .setCustomRowCell('PAY_DATE', this.setGridPayDateDataFormat.bind(this))
//                .setCustomRowCell('YYMM_RPT', this.setGridYyMmRptDataFormat.bind(this));
//        }
//        else if (this.payListFlag == "P1") {
//            columns.push({ propertyName: 'PAYROLL_NM', id: 'PAYROLL_NM', title: ecount.resource.LBL06110, width: '' });
//            columns.push({ propertyName: 'PAYTYPE_NM', id: 'PAYTYPE_NM', title: ecount.resource.LBL80169, width: '' });
//            columns.push({ propertyName: 'PAY_DATE', id: 'PAY_DATE', title: ecount.resource.LBL05616, align: 'center', width: '' });
//            columns.push({ propertyName: 'WORK_DAYS', id: 'WORK_DAYS', title: ecount.resource.LBL05442, align: 'center', width: '' });

//            settings
//                .setCustomRowCell('PAYROLL_NM', this.setGridDateLink.bind(this))
//                .setCustomRowCell('PAYTYPE_NM', this.setGridPayGubunDataFormat.bind(this))
//                .setCustomRowCell('PAY_DATE', this.setGridPayDateDataFormat.bind(this))
//                .setCustomRowCell('WORK_DAYS', this.setGridYyMmRptDataFormat.bind(this));
//        }
//        else if (this.payListFlag == "P2") {
//            columns.push({ propertyName: 'YYYYMM', id: 'YYYYMM', title: ecount.resource.LBL05002, align: 'center', width: '' });
//            columns.push({ propertyName: 'YYMM_RPT', id: 'YYMM_RPT', title: ecount.resource.LBL05442, align: 'center', width: '' });
//            columns.push({ propertyName: 'PAY_GUBUN', id: 'PAY_GUBUN', title: ecount.resource.LBL80169, align: 'center', width: '' });

//            settings
//                .setCustomRowCell('YYYYMM', this.setGridDateLink.bind(this))
//                .setCustomRowCell('YYMM_RPT', this.setGridYyMmRptDataFormat.bind(this))
//                .setCustomRowCell('PAY_GUBUN', this.setGridPayGubunDataFormat.bind(this));
//        }
//        else if (this.payListFlag == "P3") {
//            columns.push({ propertyName: 'YYYYMM', id: 'YYYYMM', title: ecount.resource.LBL05002, align: 'center', width: '' });
//            columns.push({ propertyName: 'PAY_DES', id: 'PAY_DES', title: ecount.resource.LBL06110, width: '' });
//            columns.push({ propertyName: 'PAY_DATE', id: 'PAY_DATE', title: ecount.resource.LBL05616, align: 'center', width: '' });
//            columns.push({ propertyName: 'YYMM_RPT', id: 'YYMM_RPT', title: ecount.resource.LBL05442, align: 'center', width: '' });

//            settings
//                .setCustomRowCell('YYYYMM', this.setGridDateLink.bind(this))
//                .setCustomRowCell('PAY_DES', this.setGridPayDesDataFormat.bind(this))
//                .setCustomRowCell('PAY_DATE', this.setGridPayDateDataFormat.bind(this))
//                .setCustomRowCell('YYMM_RPT', this.setGridYyMmRptDataFormat.bind(this));
//        }

//        settings
//            .setRowData(this.viewBag.InitDatas.PayListLoad)
//            .setColumns(columns)
//            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
//            .setKeyboardCursorMove(true)                // 위, 아래 방향키
//            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
//            .setKeyboardEnterForExecute(true);

//        contents
//            .add(toolbar)
//            .addGrid("dataGrid" + this.pageID, settings);
//    },

//    //풋터 옵션 설정
//    onInitFooter: function (footer, resource) {
//        debugger;
//        var toolbar = widget.generator.toolbar(),
//            ctrl = widget.generator.control(),
//            keyHelper = [];

//        toolbar.addLeft(ctrl.define("widget.button", "journalEntry").label(ecount.resource.LBL04701));
//        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
//        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper"));

//        footer.add(toolbar);
//    },

//    /**********************************************************************
//    * event form listener [tab, content, search, popup ..]
//    **********************************************************************/
//    //페이지 완료 이벤트
//    onLoadComplete: function (e) {
//        var grid = this.contents.getGrid();
//        grid.getSettings().setHeaderTopMargin(this.header.height());
//    },

//    /********************************************************************** 
//    * event grid listener [click, change...] 
//    **********************************************************************/
//    onGridInit: function (e, data) {
//        this._super.onGridInit.apply(this, arguments);
//    },

//    // 급여구분 변환
//    getPayGubunConvert: function (value) {
//        debugger;
//        var convertValue = "";

//        if (this.payListFlag != "P1") {
//            switch (value.substring(0, 1)) {
//                case '1':  // 급여
//                    convertValue = ecount.resource.LBL00793;
//                    break;
//                case '2':  // 상여
//                    convertValue = ecount.resource.LBL01518 + "(" + value.substring(1) + ") 회";
//                    break;
//                case '3':  // 급(상)여
//                    convertValue = ecount.resource.LBL05001;
//                    break;
//            }
//        }

//        return convertValue;
//    },

//    // 대장명칭 변환
//    getPayDesConvert: function (value, rowItem) {
//        debugger;
//        var convertValue = '';
//        var payGubun = rowItem.PAY_GUBUN ? rowItem.PAY_GUBUN : "";

//        switch (this.payListFlag) {
//            case 'P1':  // 글로벌급여
//                convertValue = !$.isNull(value) && !$.isEmpty(value) ? value : "(" + Date.parse(rowItem.WORK_DAYS.substring(0, 4) + "-" + rowItem.WORK_DAYS.substring(4)).format(Date.CultureInfo.formatPatterns.yearMonth) + ")";
//                break;
//            default:
//                convertValue = !$.isNull(value) && !$.isEmpty(value) ? value : Date.parse(rowItem.YYYYMM.substring(0, 4) + "-" + rowItem.YYYYMM.substring(4)).format(Date.CultureInfo.formatPatterns.yearMonth) + " " + this.getPayGubunConvert(payGubun);
//                break;
//        }

//        return convertValue;
//    },

//    // 지급일 변환
//    getPayDateConvert: function (value) {
//        debugger;
//        var convertValue = '';
        
//        switch (this.payListFlag) {
//            case 'P1':  // 글로벌급여
//                convertValue = value.substring(0, 4) + "/" + value.substring(7, 5) + "/" + value.substring(10, 8);
//                break;
//            default:
//                convertValue = value.substring(0, 4) + "/" + value.substring(6, 4) + "/" + value.substring(8, 6);
//                break;
//        }
        
//        return convertValue;
//    },

//    // 지급연월 변환
//    getPayDateRptConvert: function (value) {
//        debugger;
//        var convertValue = '';

//        convertValue = value.substring(0, 4) + "/" + value.substring(4);

//        return convertValue;
//    },

//    // MENU_FLAG 변환
//    getMenuFlagConvert: function (value) {
//        switch (value) {
//            case 'P2':  // 일용직I
//                convertValue = "2";
//                break;
//            case 'P3':  // 일용직II
//                convertValue = "3";
//                break;
//            default:    // 국내급여, 글로벌급여
//                convertValue = "1";
//                break;
//        }

//        return convertValue;
//    },

//    //급여 선택 시 이벤트(각 급여목록별 데이터 포멧 포함)
//    setGridDateLink: function (value, rowItem) {
//        debugger;
//        var option = {};
//        var dataFomat = '';

//        // 데이터 포멧
//        switch (this.payListFlag) {
//            case 'P0':  // 국내급여
//                dataFomat = value.substring(0, 4) + "/" + value.substring(4) + "-" + (parseInt(rowItem.PAY_GROUP) + 1).toString();
//                break;
//            case 'P1':  // 글로벌급여
//                dataFomat = this.getPayDesConvert(value, rowItem);
//                break;
//            case 'P2':  // 일용직I
//                dataFomat = value.substring(0, 4) + "/" + value.substring(4);
//                break;
//            case 'P3':  // 일용직II
//                dataFomat = value.substring(0, 4) + "/" + value.substring(4) + "-" + (parseInt(rowItem.PAY_GROUP) + 1).toString();
//                break;
//        }
        
//        option.data = dataFomat;
//        option.controlType = "widget.link";
//        option.event = {
//            'click': function (e, data) {
//                debugger;

//                // 급여대장 권한이 없는 경우
//                if (this.viewBag.Permission.Permit.Value == ecenum.permissionType.none) {
//                    ecount.alert(ecount.resource.MSG00141);
//                    return false;
//                }
//                this.getPayJournalEntry(this, data);
//            }.bind(this)
//        };
//        return option;
//    },

//    //급여분개
//    getPayJournalEntry: function (value, data) {
//        debugger;
//        var returnData, _self = this;
//        var journalEntryParameter = {
//            MENU_FLAG: _self.getMenuFlagConvert(_self.payListFlag),
//            PAY_YYMM: _self.payListFlag == "P1" ? null : data.rowItem.YYYYMM,
//            PAY_GUBUN: _self.payListFlag == "P1" ? null : data.rowItem.PAY_GUBUN,
//            YYMM_RPT: _self.payListFlag == "P1" ? null : data.rowItem.YYMM_RPT,
//            PAY_GROUP: _self.payListFlag == "P1" || _self.payListFlag == "P2" ? null : data.rowItem.PAY_GROUP,
//            P_BUSINESSNO: _self.payListFlag == "P1" || _self.payListFlag == "P0" ? null : data.rowItem.P_BUSINESSNO,
//            WORK_DAYS: _self.payListFlag == "P1" ? data.rowItem.WORK_DAYS : null,
//            PAY_SEQ: _self.payListFlag == "P1" ? data.rowItem.PAY_SEQ : null,
//            PAYROLL_NM: _self.payListFlag == "P1" ? data.rowItem.PAYROLL_NM : null,
//            PAYTYPE_CD: _self.payListFlag == "P1" ? data.rowItem.PAYTYPE_CD : null
//        };

//        ecount.common.api({
//            url: _self.payListFlag == "P1" ? "/Account/GeneralJournal/GetGlobalPayJournalEntry" : "/Account/GeneralJournal/GetPayJournalEntry",
//            data: Object.toJSON(journalEntryParameter),
//            success: function (result) {
//                if (result.Status != "200") {

//                }
//                else {
//                    var message = {
//                        data: result.Data,
//                        isAdded: true,
//                        addPosition: "current",
//                        callback: _self.close.bind(_self)
//                    };
//                    _self.sendMessage(_self, message);
//                }
//            }
//        });
//    },

//    //데이터 표기방식 설정(구분)
//    setGridPayGubunDataFormat: function (value, rowItem) {
//        var option = {};
//        option.controlType = "widget.label";

//        option.data = this.getPayGubunConvert(rowItem.PAY_GUBUN);
//        return option;
//    },

//    //데이터 표기방식 설정(대장명칭)
//    setGridPayDesDataFormat: function (value, rowItem) {
//        debugger;
//        var option = {};
//        option.controlType = "widget.label";

//        option.data = this.getPayDesConvert(value, rowItem);
//        return option;
//    },

//    //데이터 표기방식 설정(지급일)
//    setGridPayDateDataFormat: function (value, rowItem) {
//        debugger;
//        var option = {};
//        option.controlType = "widget.label";

//        option.data = this.getPayDateConvert(rowItem.PAY_DATE);
//        return option;
//    },

//    //데이터 표기방식 설정(지급연월)
//    setGridYyMmRptDataFormat: function (value, rowItem) {
//        debugger;
//        var option = {};
//        option.controlType = "widget.label";

//        option.data = this.getPayDateRptConvert(this.payListFlag == "P1" ? rowItem.WORK_DAYS : rowItem.YYMM_RPT);
//        return option;
//    },

//    /********************************************************************** 
//    * event  [button, link, FN, optiondoropdown..] 
//    **********************************************************************/
//    //버튼 이벤트 클릭전 호출 
//    onBeforeEventHandler: function (e) {
//        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
//        return true;
//    },

//    //분개설정버튼
//    onFooterJournalEntry: function () {
//        debugger;
//        this.openWindow({
//            url: '/ecerp/popup.common/EBD001P_02',
//            name: ecount.resource.LBL04701,
//            additional: true,
//            popupType: false,
//            param: {
//                width: 560,
//                height: this.selfCustomizingHeight,
//                MENU_FLAG: this.getMenuFlagConvert(this.payListFlag)
//            }
//        });
//    },

//    onMessageHandler: function (event, data) {
        
//    },

//    //닫기버튼
//    onFooterClose: function () {
//        this.close();
//        return false;
//    },

//    /********************************************************************** 
//    *  hotkey [f1~12, 방향키등.. ] 
//    **********************************************************************/
//    // ON_KEY_ENTER
//    ON_KEY_ENTER: function (e, target) {
//        target && this.onContentsSearch(target.control.getValue());
//    },

//    // ON_KEY_DOWN
//    ON_KEY_DOWN: function () {
//        //this.gridFocus && this.gridFocus();
//    },

//    // ON_KEY_UP
//    ON_KEY_UP: function () {
//        //this.gridFocus && this.gridFocus();
//    },

//    // onMouseupHandler
//    onMouseupHandler: function () {
//        this.gridFocus = function () {
//            var gridObj = this.contents.getGrid().grid;
//            gridObj.focus();
//            this.gridFocus = null;
//        }.bind(this);
//        this.gridFocus && this.gridFocus();
//    },

//    // ON_KEY_TAB
//    ON_KEY_TAB: function () {
//        var gridObj = this.contents.getGrid().grid;
//        this.setTimeout(function () { gridObj.focus(); }, 0);
//    },
//});
