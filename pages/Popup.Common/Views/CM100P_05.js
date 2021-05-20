window.__define_resource && __define_resource("LBL09090","LBL09091","LBL08906","LBL03813","LBL05518","LBL05519","LBL05520","LBL05521","LBL05522","LBL05523","LBL01249","LBL02513","LBL02512","LBL11398","LBL07994","LBL05360","BTN00141","LBL11390","LBL11371","MSG03551","LBL00703","LBL05875","LBL05571","LBL11370","LBL04128","BTN00069","BTN00008","MSG01377","MSG04739","MSG08211","MSG04741","MSG04770","LBL06434","LBL02282","LBL10109","MSG04740","LBL12866","LBL06065","LBL06240","LBL01195","LBL01810","LBL01221");
/****************************************************************************************************
1. Create Date : 2016.03.
2. Creator     : 정명수
3. Description : 계산식 팝업(formula popup)
4. Precaution  :
5. History     : 
                 2018-07-10 김봉기 A18_01538
                 계산식 최대 5개에서 4개까지 선택 할 수 있게 수정
                 줄번호 : 779
                 option.controlOption.joinMaxLength = 4; // 추가

6. Old File    : EPG003P_01.aspx, EPL003P_01.aspx, CM100P_05.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM100P_05", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    addNo: 1,                       // condition no (조건식 번호)
    itemObject: null,               // formula item list(계산 항목)
    codeList: null,                 // formula item list for widget (위젯용 계산 항목)
    operatorObject: null,           // operator list for click (클릭 처리용 연산자)
    operatorList: null,             // operator list (연산자)
    relationalOperatorObject: null, // relational operator list for click (클릭 처리용 관계연산자)
    relationalOperatorList: null,   // relational operator list (관계연산자)
    inCodeList: null,               // condition item list for widget (위젯용 조건식 항목)
    logicList: null,                // AND, OR
    comparisonList: null,           // >, <, >=, ...
    calcList: null,                 // operator list for widget (위젯용 연산자)
    joinStringList: null,           // join string item list for widget (위젯용 병합식 항목)
    bracketFunctionList: null,      // ROUND, CEILING, FLOOR
    bracketList: null,              // (, )
    lastRowId: "0",                 // last selected row id (마지막으로 선택한 ROW ID)
    conditionCalcData: null,        // formula data (계산식 데이터)
    conditionCalcOrder: null,       // condition tree info (조건식 계층정보)
    popupUrl: "",                   // condition select popup url (조건식 선택 팝업 URL)
    lastCalcData: null,             // save calc data (계산식 데이터 저장)
    formIndexList: null,            // condition form index list (조건식 폼 인덱스)
    viewCodeList: null,             // formula item list for page (화면용 계산 항목)

    isScheduleFormType: false,              // open popup from schedule, office equipment

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.isScheduleFormType = ([
            "GO121", "GO131"
        ].contains(this.FORM_TYPE) ? true : false);

        if (!this.popupType)
        {
            this.popupType = "window";
        }

        var tempItem = {}, tempCalc = [];
        var prevParentRowKey = "";
        var maxNo = 0;
        var itemList = this.viewBag.InitDatas.formulaItems.itemList || [];
        var groupList = this.viewBag.InitDatas.formulaItems.groupList || [];
        var userItemList = this.USERADD || [];
        var calcDesc = this.viewBag.InitDatas.calcDesc || [];
        var calcGubun = this.viewBag.InitDatas.calcGubun || [];

        debugger;
        if (this.COL_CD == "vat_amt") {

            for (var i = itemList.length - 1; i >= 0; i--) {
                if (itemList[i].CALC_CD == "vat_amt") {
                    itemList.splice(i, 1);
                }
            }
        }

        if (this.COL_CD == "supply_amt") {

            for (var i = itemList.length - 1; i >= 0; i--) {
                if (itemList[i].CALC_CD == "vat_amt" || itemList[i].CALC_CD == "supply_amt") {
                    itemList.splice(i, 1);
                }
            }
        }

        if (this.COL_CD == "p_amt1" || this.COL_CD == "p_amt2") {
            for (var i = itemList.length - 1; i >= 0; i--) {
                if (itemList[i].CALC_CD == this.COL_CD) {
                    itemList.splice(i, 1);
                }
            }
        }

        for (var i = itemList.length - 1; i >= 0; i--) {
            if (itemList[i].CALC_CD.indexOf("qty_unit") != -1) {
                itemList.splice(i, 1);
            }
        }



        if (userItemList && userItemList.length > 0) {
            itemList = itemList.concat(userItemList);
        }
        this.lastCalcData = [];
        this.conditionCalcData = [];
        this.conditionCalcOrder = this.viewBag.InitDatas.calcOrder || [];
        this.formIndexList = [];

        this.itemObject = {};
        this.operatorObject = {};
        this.relationalOperatorObject = {};
        this.relationalOperatorList = [];
        this.codeList = [];
        this.viewCodeList = [];
        this.inCodeList = [];

        // 조건식 계층 설정
        for (var i = 0, lng = calcDesc.length; i < lng; i++) {
            tempCalc = calcDesc[i].split("^");

            // conditionCalcOrder 거꾸로 돌면서 split("-")가 자기꺼면 설정하게 수정
            if (calcDesc[i].indexOf("trDefine") > -1 && i != 0) {
                for (var j = this.conditionCalcOrder.length; j < 0; j++) {
                    var currentCalcOrder = this.conditionCalcOrder[j] || "--";
                    if (currentCalcOrder.startsWith("tr" + tempCalc[0])) {
                        if (currentCalcOrder.split("-")[1] == "y") {
                            //prevParentRowKey = this.conditionCalcOrder.shift();
                            prevParentRowKey = this.conditionCalcOrder[j];
                            break;
                        } else if (currentCalcOrder.split("-")[1] == "n") {
                            break;
                        }
                    }
                }
            }

            var parentType = tempCalc[0]; // True1
            var selfType = tempCalc[1]; // trDefine2
            var formula = tempCalc.pop();
            var viewText1 = i == 0 ? "" : "    ", viewText2;

            // is condition expression and not first row
            // 조건식이면서 최상위 행이 아니면
            if (selfType.indexOf("trDefine") > -1) {
                if (parentType != "") {
                    viewText1 = (parentType.indexOf("True") > -1 ? ecount.resource.LBL09090 : ecount.resource.LBL09091) + parentType.replace(/True|False/gi, "");
                }
                maxNo = Math.max(maxNo, parseInt(selfType.replace("trDefine", ""), 10));
            }

            viewText2 = (selfType.indexOf("trDefine") > -1 ? ecount.resource.LBL08906 : selfType.indexOf("trTrue") > -1 ? ecount.resource.LBL09090 : ecount.resource.LBL09091) + selfType.replace(/trDefine|trTrue|trFalse/gi, "");

            this.conditionCalcData.push({
                INDEX: i,
                CALC_DESC: calcDesc[i],
                CALC_GUBUN: calcGubun[i],
                formula: formula,
                parentRowKey: prevParentRowKey + "^" + tempCalc.join("^"),
                type: viewText1 + " [" + viewText2 + "]"
            });
        }

        this.addNo = maxNo + 1;

        itemList.forEach(function (item) {
            if (item.CALC_CD) {
                if (item.CALC_CD.indexOf(ecount.delimiter) == -1) {
                    tempItem = item.SECTION_GROUP ?
                        this.fnCreateFormulaItemWithSectionGroup(item.CALC_CD, item.CALC_TITLE ? String.format("{0} [{1}]", item.CALC_DES, item.CALC_TITLE) : item.CALC_DES, "1", item.Hide, item.SECTION_GROUP) :
                        this.fnCreateFormulaItem(item.CALC_CD, item.CALC_TITLE ? String.format("{0} [{1}]", item.CALC_DES, item.CALC_TITLE) : item.CALC_DES, "1", item.Hide);
                    this.codeList.push(tempItem);
                    this.itemObject[item.CALC_CD] = tempItem;
                }
                else {
                    tempItem = item.SECTION_GROUP ?
                        this.fnCreateFormulaItemWithSectionGroup(item.CALC_CD.split(ecount.delimiter)[0], item.CALC_TITLE ? String.format("{0} [{1}]", item.CALC_DES, item.CALC_TITLE) : item.CALC_DES, "1", item.Hide, item.SECTION_GROUP) :
                        this.fnCreateFormulaItem(item.CALC_CD.split(ecount.delimiter)[0], item.CALC_TITLE ? String.format("{0} [{1}]", item.CALC_DES, item.CALC_TITLE) : item.CALC_DES, "1", item.Hide);
                    this.codeList.push(tempItem);
                    var viewTempItem = item.SECTION_GROUP ?
                        this.fnCreateFormulaItemWithSectionGroup(item.CALC_CD, item.CALC_TITLE ? String.format("{0} [{1}]", item.CALC_DES, item.CALC_TITLE) : item.CALC_DES, "1", item.Hide, item.SECTION_GROUP) :
                        this.fnCreateFormulaItem(item.CALC_CD, item.CALC_TITLE ? String.format("{0} [{1}]", item.CALC_DES, item.CALC_TITLE) : item.CALC_DES, "1", item.Hide);
                    this.viewCodeList.push(viewTempItem);
                    this.itemObject[item.CALC_CD.split(ecount.delimiter)[1]] = tempItem;
                }
            }
        }.bind(this));

        groupList.forEach(function (item) {
            if (item.CALC_CD) {
                tempItem = this.fnCreateFormulaItem(item.CALC_CD, item.CALC_TITLE ? String.format("{0} [{1}]", ecount.resource[item.CALC_DES] ? ecount.resource[item.CALC_DES] : item.CALC_DES, item.CALC_TITLE) : ecount.resource[item.CALC_DES] ? ecount.resource[item.CALC_DES] : item.CALC_DES, "2");
                //this.codeList.push(tempItem);
                this.itemObject[item.CALC_CD] = tempItem;
                this.inCodeList.push({ label: item.CALC_TITLE ? String.format("{0} [{1}]", ecount.resource[item.CALC_DES] ? ecount.resource[item.CALC_DES] : item.CALC_DES, item.CALC_TITLE) : ecount.resource[item.CALC_DES] ? ecount.resource[item.CALC_DES] : item.CALC_DES, value: item.CALC_CD });
            }
        }.bind(this));

        this.logicList = this.IS_CALC_TYPE && !this.IS_CALC_ONLY ? ["AND", "OR"] : [];
        this.comparisonList = this.IS_CALC_TYPE && !this.IS_CALC_ONLY ? [">", "<", "=", ">=", "<=", "<>"] : [];
        this.calcList = this.IS_CALC_TYPE ? ["+", "-", "/", "*"] : [];
        this.bracketFunctionList = this.IS_CALC_TYPE ? [{ label: "R(", value: "ROUND(" }, { label: "C(", value: "CEILING(" }, { label: "F(", value: "FLOOR(" }] : [];
        this.bracketList = this.IS_CALC_TYPE ? ["(", ")"] : [];
        this.joinStringList = this.IS_CALC_TYPE ? [] : this.IS_BALANCE_TYPE ? [{ value: " ", label: ecount.resource.LBL03813 }, "/", "-", "_", "(", ")", ";", ":", ",", ".","\"","'"] : [{ value: " ", label: ecount.resource.LBL03813 }, "/", "-", "_", "(", ")", ";", ":", ",", "."];

        if (this.IS_CALC_TYPE) {
            this.operatorList = [
                { CONTROL_ID: "OpenBracket", CALC_CD: "(", CALC_TYPE: 8, DISPLAY_CD: "(", DISPLAY_DES: ecount.resource.LBL05518 }
                , { CONTROL_ID: "CloseBracket", CALC_CD: ")", CALC_TYPE: 8, DISPLAY_CD: ")", DISPLAY_DES: ecount.resource.LBL05519 }
                , { CONTROL_ID: "Add", CALC_CD: "+", CALC_TYPE: 6, DISPLAY_CD: "+", DISPLAY_DES: ecount.resource.LBL05520 }
                , { CONTROL_ID: "Subtract", CALC_CD: "-", CALC_TYPE: 6, DISPLAY_CD: "-", DISPLAY_DES: ecount.resource.LBL05521 }
                , { CONTROL_ID: "Multiply", CALC_CD: "*", CALC_TYPE: 6, DISPLAY_CD: "*", DISPLAY_DES: ecount.resource.LBL05522 }
                , { CONTROL_ID: "Divide", CALC_CD: "/", CALC_TYPE: 6, DISPLAY_CD: "/", DISPLAY_DES: ecount.resource.LBL05523 }
                , { CONTROL_ID: "Round", CALC_CD: "ROUND(", CALC_TYPE: 7, DISPLAY_CD: "R(", DISPLAY_DES: ecount.resource.LBL01249 }
                , { CONTROL_ID: "Ceiling", CALC_CD: "CEILING(", CALC_TYPE: 7, DISPLAY_CD: "C(", DISPLAY_DES: ecount.resource.LBL02513 }
                , { CONTROL_ID: "Floor", CALC_CD: "FLOOR(", CALC_TYPE: 7, DISPLAY_CD: "F(", DISPLAY_DES: ecount.resource.LBL02512 }
            ];
            if (!this.IS_CALC_ONLY) {
                this.relationalOperatorList = [
                    { CONTROL_ID: "AND", CALC_CD: "AND", CALC_TYPE: 4, DISPLAY_CD: "AND", DISPLAY_DES: "AND" }
                    , { CONTROL_ID: "OR", CALC_CD: "OR", CALC_TYPE: 4, DISPLAY_CD: "OR", DISPLAY_DES: "OR" }
                    , { CONTROL_ID: "EQ", CALC_CD: "=", CALC_TYPE: 5, DISPLAY_CD: "=", DISPLAY_DES: "=" }
                    , { CONTROL_ID: "GT", CALC_CD: ">", CALC_TYPE: 5, DISPLAY_CD: ">", DISPLAY_DES: ">" }
                    , { CONTROL_ID: "LT", CALC_CD: "<", CALC_TYPE: 5, DISPLAY_CD: "<", DISPLAY_DES: "<" }
                    , { CONTROL_ID: "GE", CALC_CD: ">=", CALC_TYPE: 5, DISPLAY_CD: ">=", DISPLAY_DES: ">=" }
                    , { CONTROL_ID: "LE", CALC_CD: "<=", CALC_TYPE: 5, DISPLAY_CD: "<=", DISPLAY_DES: "<=" }
                    , { CONTROL_ID: "NE", CALC_CD: "<>", CALC_TYPE: 5, DISPLAY_CD: "<>", DISPLAY_DES: "<>" }
                ]
            }
        } else {
            this.operatorList = [
                { CONTROL_ID: "Space", CALC_CD: " ", CALC_TYPE: 9, DISPLAY_CD: "&nbsp;", DISPLAY_DES: "[&nbsp;" + ecount.resource.LBL03813 + "&nbsp;]" }
                , { CONTROL_ID: "Slash", CALC_CD: "/", CALC_TYPE: 9, DISPLAY_CD: "/", DISPLAY_DES: "[&nbsp;/&nbsp;]" }
                , { CONTROL_ID: "Dash", CALC_CD: "-", CALC_TYPE: 9, DISPLAY_CD: "-", DISPLAY_DES: "[&nbsp;-&nbsp;]" }
                , { CONTROL_ID: "Underbar", CALC_CD: "_", CALC_TYPE: 9, DISPLAY_CD: "_", DISPLAY_DES: "[&nbsp;_&nbsp;]" }
                , { CONTROL_ID: "OpenBracket", CALC_CD: "(", CALC_TYPE: 9, DISPLAY_CD: "(", DISPLAY_DES: "[&nbsp;(&nbsp;]" }
                , { CONTROL_ID: "CloseBracket", CALC_CD: ")", CALC_TYPE: 9, DISPLAY_CD: ")", DISPLAY_DES: "[&nbsp;)&nbsp;]" }
                , { CONTROL_ID: "Semicolon", CALC_CD: ";", CALC_TYPE: 9, DISPLAY_CD: ";", DISPLAY_DES: "[&nbsp;;&nbsp;]" }
                , { CONTROL_ID: "Colon", CALC_CD: ":", CALC_TYPE: 9, DISPLAY_CD: ":", DISPLAY_DES: "[&nbsp;:&nbsp;]" }
                , { CONTROL_ID: "Comma", CALC_CD: ",", CALC_TYPE: 9, DISPLAY_CD: ",", DISPLAY_DES: "[&nbsp;,&nbsp;]" }
                , { CONTROL_ID: "Dot", CALC_CD: ".", CALC_TYPE: 9, DISPLAY_CD: ".", DISPLAY_DES: "[&nbsp;.&nbsp;]" }
            ];
            if (this.IsUseExtendedMergeExpression) {
                this.operatorList.push({ CONTROL_ID: "DoubleQuotation ", CALC_CD: "\"", CALC_TYPE: 9, DISPLAY_CD: "\"", DISPLAY_DES: "[&nbsp;\"&nbsp;]" });
                this.operatorList.push({ CONTROL_ID: "Quotation", CALC_CD: "'", CALC_TYPE: 9, DISPLAY_CD: "'", DISPLAY_DES: "[&nbsp;'&nbsp;]" });
                this.operatorList.push({ CONTROL_ID: "StringText", CALC_CD: "", CALC_TYPE: 9, DISPLAY_CD: "", DISPLAY_DES: "[&nbsp;" + ecount.resource.LBL11398 + "&nbsp;]" }); //" + ecount.resource.LBL11398 + "
            }
        }

        this.operatorList.forEach(function (item) {
            this.operatorObject[item.CONTROL_ID] = this.fnCreateFormulaItem(item.CALC_CD, item.DISPLAY_CD, item.CALC_TYPE);
        }.bind(this));

        if (this.relationalOperatorList.length > 0) {
            this.relationalOperatorList.forEach(function (item) {
                this.relationalOperatorObject[item.CONTROL_ID] = this.fnCreateFormulaItem(item.CALC_CD, item.DISPLAY_CD, item.CALC_TYPE);
            }.bind(this));
        }

        if (this.CALC_PAGE == "EPG003P_01") {
            this.popupUrl = "/ECERP/EPG/EPG003P_01_01";
        } else if (this.CALC_PAGE == "EPL003P_01") {
            this.popupUrl = "/ECERP/EPL/EPL003P_01_01";
        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/

    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        var ctrl = widget.generator.control();

        header.setTitle($.isEmpty(this.HEADER_TITLE) ? (this.IS_BALANCE_TYPE ? ecount.resource.LBL07994 : ecount.resource.LBL05360) : this.HEADER_TITLE).notUsedBookmark();

        // 상품재고입력에서 사용되는 기본값 복원
        if (this.CALC_PAGE == "ESK012P_03_CALC") {
            header.add(ctrl.define("widget.button", "defaultSetting").label(ecount.resource.BTN00141));
        }
    },

    onInitContents: function (contents) {

        debugger;
        var g = widget.generator
            , calcGrid = g.grid()
            , ctrl = g.control()
            , itemSubTitle = g.subTitle()
            , itemForm = g.form()
            , itemControls = []
            , groupItemSubTitle = g.subTitle()
            , groupItemForm = g.form()
            , groupItemControls = []
            , operatorSubTitle = g.subTitle()
            , operatorForm = g.form()
            , operatorControls = []
            , relationalOperatorSubTitle = g.subTitle()
            , relationalOperatorForm = g.form()
            , relationalOperatorControls = [];
        //-구분기호   LBL11390
        //-설정내용   LBL11371
        var isCheckHidden = this.IS_CALC_ONLY, isTypeHidden = this.conditionCalcData.length <= 1;
        var checkWidth = this.viewBag.Language == "ko-KR" ? 45 : 80;
        var addedFormCount = 0;
        var isConditionItemShow = !(this.conditionCalcData.length >= 2 && !this.IS_CALC_ONLY && this.IS_CALC_TYPE);


        if (this.IS_SHOW_TOP_TITLE == null || this.IS_SHOW_TOP_TITLE == true) {
            if (this.IS_BALANCE_TYPE) {
                contents.add(g.remark().title(ecount.resource.MSG03551));
            }
        }

        calcGrid.setRowData(this.conditionCalcData)
            .setEditable(true, 1, 0)
            .setColumns([
                { propertyName: "type", id: "type", title: ecount.resource.LBL00703, width: 120, isHideColumn: isTypeHidden },
                { propertyName: "formula", id: "formula", title: ($.isEmpty(this.HEADER_TITLE) ? (this.IS_BALANCE_TYPE ? ecount.resource.LBL11371 : ecount.resource.LBL05875) : this.HEADER_TITLE), controlType: "widget.calc", width: "" },
                { propertyName: "check", id: "check", title: ecount.resource.LBL08906, align: "center", width: checkWidth, isHideColumn: isCheckHidden },
                { propertyName: "parentRowKey", id: "parentRowKey", title: "parentRowKey", width:0, isHideColumn: true }
            ])
            .setEditRowShowInputOutLine('activeRow')
            .setCustomRowCell("check", this.setCalcGridCheckBox.bind(this))
            .setCustomRowCell("formula", this.setCalcGridFormula.bind(this))
            .setStyleDisableTableHover(true)
            ;
        contents.addGrid("calcGrid", calcGrid);


        if (this.codeList.length > 0) {
            debugger;
            if (this.codeList.first().Section) {
                var codeListSectionData = (function () {
                    if (this.viewCodeList.length > 0) {
                        return this.viewCodeList.groupBy("Section");
                    } else {
                        return this.codeList.groupBy("Section");
                    }
                }).bind(this)();

                for (_codeListSectionData in codeListSectionData)
                {
                    debugger;
                    itemSubTitle = g.subTitle()
                        , itemForm = g.form()
                        , itemControls = [];

                    itemSubTitle.title(this.fnSectionTitle(_codeListSectionData));
                    itemForm
                        .css("table table-border-no-a table-border-no-a")                        
                        .setColSize(3);                    
                    if (window.__isOldLayout == true) {
                        //refactoring 이전 버전
                        itemForm = itemForm.useBaseForm({ _isThShow: 0 })
                    } else {
                        //refactoring 버전
                        itemForm = itemForm.useTableType()
                                           .hideCellTitle(true)
                    }

                    codeListSectionData[_codeListSectionData].forEach(function (item) {
                        if (this.viewCodeList.length > 0) {
                            itemControls.push(ctrl.define("widget.link", item.value.split(ecount.delimiter)[1], item.value.split(ecount.delimiter)[1]).label(ecount.resource[item.label] == undefined ? item.label : ecount.resource[item.label]).setOptions({ onClick: this.setFormulaItemClick.bind(this) }).end());
                        } else {
                            if (item.Hide == false) {
                                itemControls.push(ctrl.define("widget.link", item.value, item.value).label(ecount.resource[item.label] == undefined ? item.label : ecount.resource[item.label]).setOptions({ onClick: this.setFormulaItemClick.bind(this) }).end());
                            }
                        }
                    }.bind(this));

                    itemForm.addControls(itemControls);
                    contents.add(itemSubTitle).add(itemForm);
                    addedFormCount++;
                }
            } else {
                itemSubTitle.title(ecount.resource.LBL05571);
                itemForm
                    .css("table table-border-no-a table-border-no-a")
                    .setColSize(3);

                if (window.__isOldLayout == true) {
                    //refactoring 이전 버전
                    itemForm = itemForm.useBaseForm({ _isThShow: 0 })
                } else {
                    //refactoring 버전
                    itemForm = itemForm.useTableType()
                                        .hideCellTitle(true)
                }

                if (this.viewCodeList.length > 0) {
                    this.viewCodeList.forEach(function (item) {
                        itemControls.push(ctrl.define("widget.link", item.value.split(ecount.delimiter)[1], item.value.split(ecount.delimiter)[1]).label(ecount.resource[item.label] == undefined ? item.label : ecount.resource[item.label]).setOptions({ onClick: this.setFormulaItemClick.bind(this) }).end());
                    }.bind(this));
                } else {
                    this.codeList.forEach(function (item) {
                        if (item.Hide == false) {
                            itemControls.push(ctrl.define("widget.link", item.value, item.value).label(ecount.resource[item.label] == undefined ? item.label : ecount.resource[item.label]).setOptions({ onClick: this.setFormulaItemClick.bind(this) }).end());
                        }
                    }.bind(this));
                }
                itemForm.addControls(itemControls);
                contents.add(itemSubTitle).add(itemForm);
                addedFormCount++;
            }
        }

        if (this.inCodeList.length > 0) {
            groupItemSubTitle.setId("groupItemTitle").title(String.format("{0} ({1})", ecount.resource.LBL05571, ecount.resource.LBL08906));
            groupItemForm
                .css("table table-border-no-a table-border-no-a")
                .setColSize(3);

            if (window.__isOldLayout == true) {
                //refactoring 이전 버전
                groupItemForm = groupItemForm.useBaseForm({ _isThShow: 0 })
                                             .setOptions({ hidden: isConditionItemShow })
            } else {
                //refactoring 버전
                groupItemForm = groupItemForm.useTableType()
                                             .hideCellTitle(true)
            }
            this.inCodeList.forEach(function (item) {
                groupItemControls.push(ctrl.define("widget.link", item.value, item.value).label(ecount.resource[item.label] == undefined ? item.label : ecount.resource[item.label]).setOptions({ onClick: this.setFormulaItemClick.bind(this) }).end());
            }.bind(this));
            groupItemForm.addControls(groupItemControls);
            contents.add(groupItemSubTitle).add(groupItemForm);

            this.formIndexList.push(addedFormCount++);
        }

        if (this.operatorList.length > 0) {
            if (this.CALC_PAGE == 'DATA_INFORMATION') {
                operatorSubTitle.title(ecount.resource.LBL11370);
            } else {
                operatorSubTitle.title(this.IS_BALANCE_TYPE ? ecount.resource.LBL11370 : ecount.resource.LBL04128);
            }

            operatorForm
                .css("table table-border-no-a table-border-no-a")
                .setColSize(3);

            if (window.__isOldLayout == true) {
                //refactoring 이전 버전
                operatorForm = operatorForm.useBaseForm({ _isThShow: 0 })
            } else {
                //refactoring 버전
                operatorForm = operatorForm.useTableType()
                                           .hideCellTitle(true)
            }

            this.operatorList.forEach(function (item) {
                var label = this.IS_CALC_TYPE ? String.format("{0} {1}", item.DISPLAY_CD, item.DISPLAY_DES) : item.DISPLAY_DES;
                operatorControls.push(ctrl.define("widget.link", item.CONTROL_ID, item.CONTROL_ID).label(label).setOptions({ onClick: this.setOperatorClick.bind(this, this.operatorObject) }).end());
            }.bind(this));

            operatorForm.addControls(operatorControls);
            contents.add(operatorSubTitle).add(operatorForm);

            addedFormCount++;
        }

        if (this.relationalOperatorList.length > 0) {
            relationalOperatorSubTitle.setId("relationalOperatorTitle").title(String.format("{0} ({1})", ecount.resource.LBL04128, ecount.resource.LBL08906));
            relationalOperatorForm
                .css("table table-border-no-a table-border-no-a")
                .setOptions({ hidden: isConditionItemShow })
                .setColSize(3);

            if (window.__isOldLayout == true) {
                //refactoring 이전 버전
                relationalOperatorForm = relationalOperatorForm.useBaseForm({ _isThShow: 0 })
            } else {
                //refactoring 버전
                relationalOperatorForm = relationalOperatorForm.useTableType()
                                                                .hideCellTitle(true)
            }

            this.relationalOperatorList.forEach(function (item) {
                var label = this.IS_CALC_TYPE && item.DISPLAY_CD !== item.DISPLAY_DES ? String.format("{0} {1}", item.DISPLAY_CD, item.DISPLAY_DES) : item.DISPLAY_DES;
                relationalOperatorControls.push(ctrl.define("widget.link", item.CONTROL_ID, item.CONTROL_ID).label(label).setOptions({ onClick: this.setOperatorClick.bind(this, this.relationalOperatorObject) }).end());
            }.bind(this));

            relationalOperatorForm.addControls(relationalOperatorControls);
            contents.add(relationalOperatorSubTitle).add(relationalOperatorForm);

            this.formIndexList.push(addedFormCount++);
        }
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onLoadComplete: function () {
        if (this.conditionCalcData.length <= 1 && !this.IS_CALC_ONLY && this.IS_CALC_TYPE) {
            this.contents.find(function (item) { return ["relationalOperatorTitle", "groupItemTitle"].contains(item.id); }).forEach(function (ctrl) { ctrl.hide(); });
        }

        if (!this.IS_RESIZE) {
            this.resizeLayer(780, 700);
        }

        if (this.IS_BALANCE_TYPE) {
            this.setOnloadBalanceTypeCheck();
        }
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/

    onMessageHandler: function (page, param) {
        if ((page.pageID || "") == "CM100P_80") {
            var addParam = { "StringText": { value: param.data.CALC_DESC, label: param.data.CALC_DESC, type: "10" } };
            this.fnInsertItem(addParam, "StringText");

        } else if ((page.pageID || "") == "ECTAX023P_04") {
            this.fnInsertItem(this.itemObject, "erayear_" + param.data.ITEM1);
        } else {
            var selectedValues = [], selectedLabels = [];

            param.data.forEach(function (item) {
                selectedValues.add("'" + item[param.code] + "'");
                selectedLabels.add("'" + item[param.name] + "'");
            });

            this.contents.getGrid("calcGrid").grid.setCell("formula", this.lastRowId, { value: this.itemObject[param.codeClass].value + " in (" + selectedValues.join(",") + ")", label: this.itemObject[param.codeClass].label + " in (" + selectedValues.join(",") + ")", type: "2" });
        }
        param.callback && param.callback();
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onFooterApply: function () {
        debugger;
        var g = this.contents.getGrid("calcGrid").grid;
        var i = 0, j = 0, k = 0, cnt = g.getRowCount(), lng = 0;
        var rowKey = "";
        var isCondition = false;
        var errorWidget = [], widgetInstance;
        var applyBtn = this.footer.getControl("apply");
        if (cnt > 0) {
            for (i = 0; i < cnt; i++) {
                rowKey = g.getRowKeyByIndex(i);
                widgetInstance = g.getCellWidgetInstance("formula", rowKey);
                isCondition = g.getCell("check", rowKey);

                //var value = g.getCell("formula", rowKey);
                var value = widgetInstance.getValue();

                if ($.isEmpty(value.value)) {
                    if (isCondition) {
                        errorWidget.clear();
                        errorWidget.push({ isCalc: false, widget: widgetInstance });
                        //widgetInstance.showError(ecount.resource.MSG01377);
                        applyBtn.setAllowClick();
                        break;
                    } else {
                        errorWidget.push({ isCalc: true, widget: widgetInstance });
                        applyBtn.setAllowClick();
                        //errorWidget.push(widgetInstance);
                        //widgetInstance.showError(ecount.resource.MSG04739);
                    }
                }
            }
        }

        if (errorWidget.length > 0) {
            for (i = 0; i < errorWidget.length; i++) {
                if (errorWidget[i].isCalc) {
                    errorWidget[i].widget.showError(ecount.resource.MSG04739);
                } else {
                    errorWidget[i].widget.showError(ecount.resource.MSG01377);
                }
            }
            applyBtn.setAllowClick();
            return false;
        }

        var formula, define, calcDesc = [], calcGubun = [], calcOrder = [], calcData = [], mergeGubun = [], mergeDesc = [];
        //MSG08211
        for (i = 0; i < cnt; i++) {
            var widgetInstance = g.getCellWidgetInstance("formula", g.getRowKeyByIndex(i));
            var widgetResult = widgetInstance && widgetInstance.validate && widgetInstance.validate() || [];
            if (widgetResult && widgetResult.length > 0) {
                applyBtn.setAllowClick();
                return false;
            }

            //formula = g.getCell("formula", i);
            var widgetValue = widgetInstance.getValue();
            var widgetValueDesc = widgetValue.value.split("ㆍ"),
                widgetValueGubun = widgetValue.type.split("ㆍ"),
                widgetValueLabel = widgetValue.label.split("ㆍ");

            formula = widgetValueDesc.map(function (desc, index) {
                return { value: desc, label: widgetValueLabel[index], type: widgetValueGubun[index] };
            });

            if (this.isScheduleFormType == true) {
                var fType1 = formula.where(function (item) { return item.type == "1"; });
                if (fType1.length < 1 || fType1.length > 4) {
                    widgetInstance.showError(ecount.resource.MSG08211);
                    applyBtn.setAllowClick();
                    return false;
                }
            }

            if (cnt == 1) {
                define = g.getCellByIndex("parentRowKey", i) || "-y-^default^calc_des";
            } else {
                define = g.getCellByIndex("parentRowKey", i) || "-y-^^trDefine1";
            }

            mergeGubun = [], mergeDesc = [];

            for (j = 0, lng = formula.length; j < lng; j++) {
                if (formula[j].type != "3") {
                    mergeGubun.push(formula[j].type);
                    mergeDesc.push(formula[j].value);
                } else {
                    var replacedValue = [], replacedType = [];
                    for (var k = 0; k < formula[j].value.length; k++) {
                        replacedValue.push(formula[j].value[k]);
                        replacedType.push("3");
                    }

                    mergeGubun.push(replacedType.join("ㆍ"));
                    mergeDesc.push(replacedValue.join("ㆍ"));
                }
            }

            calcData.push(formula);
            calcDesc.push($.trim(define.split("^")[1]) + "^" + $.trim(define.split("^")[2]) + "^" + mergeDesc.join("ㆍ"));
            calcGubun.push(mergeGubun.join("ㆍ"));

            //if ((define.split("^")[2] || "").indexOf("trDefine") > -1 && i > 0) {
            //    calcOrder.push($.trim(define.split("^")[0]));
            //}
        }

        //for (i = 0; i < this.addNo; i++) {
        //    calcOrder.push("-n-");
        //}

        //for (i = 0; i < cnt; i++) {
        //    var define = g.getCellByIndex("parentRowKey", i) || "^^1";
        //    if (define.indexOf("trDefine") > -1) {
        //        var orderNumberList = define.split("^")[2].match(/[0-9]/g);
        //        if (orderNumberList) {
        //            var orderNumber = parseInt(orderNumberList.join(""), 10) - 1;
        //            calcOrder[orderNumber] = define.split("^")[0];
        //        }
        //    }
        //}

        //var calcOrder = [];
        //this.conditionCalcOrder.forEach(function (item) {
        //    calcOrder.push($.trim(item));
        //});
        debugger;
        var message = {
            data: [{
                CALC_PAGE: this.CALC_PAGE,
                CALC_DESC: calcDesc.join("§"),
                CALC_GUBUN: calcGubun.join("§"),
                CALC_ORDER: this.conditionCalcOrder.join("§"),
                CALC_VALUE: calcData,
                UserData: this.UserData,
                INDEX: this.INDEX
            }], callback: this.close.bind(this)
        };

        if (this.IS_BALANCE_TYPE) {
            message.BALANCE_TYPE = this.setBalanceTypeValue(message.data[0].CALC_VALUE[0]);
        }

        if (this.popupType == "layer") {
            this.sendMessage(this, message);
        } else {
            opener && opener.onMessageHandler && opener.onMessageHandler(message);
        }
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {

            var grid = this.contents.getGrid("calcGrid").grid;
            var rowId = grid.getRowKeyByIndex(0);
            grid.setCellFocus("formula", rowId);
        }
    },

    setCalcGridCheckBox: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.checkbox";

        if (event == undefined)
            option.data = (rowItem["parentRowKey"] || "-y-^^").indexOf("trDefine") > -1 ? true : false;

        option.event = {
            'click': function (event, gridData) {
                var g = this.contents.getGrid("calcGrid").grid;
                var key = gridData.rowKey,
                    idx = gridData.rowIdx;
                var i = 0, cnt = 0;
                var isNotEmpty = false;

                if (idx == 0 && !event.target.checked) {
                    for (i = 0, cnt = g.getRowCount() ; i < cnt; i++) {
                        if (!$.isEmpty(g.getCellWidgetInstance("formula", g.getRowKeyByIndex(i)).getValue().value)) {
                            isNotEmpty = true;
                            break;
                        }
                    }

                    if (isNotEmpty) {
                        ecount.confirm(ecount.resource.MSG04741, function (status) {
                            if (status) {
                                this.contents.find(function (item) { return ["relationalOperatorTitle", "groupItemTitle"].contains(item.id); }).forEach(function (ctrl) { ctrl.hide(); });
                                this.formIndexList.forEach(function (i) {
                                    this.contents.getForm()[i].hide();
                                }.bind(this));
                                this.fnDeleteAllRow.call(this, g);
                                g.setCell("formula", this.lastCalcData);
                            } else {
                                g.setCell("check", idx, true);
                            }
                        }.bind(this));
                    } else {
                        this.contents.find(function (item) { return ["relationalOperatorTitle", "groupItemTitle"].contains(item.id); }).forEach(function (ctrl) { ctrl.hide(); });
                        this.formIndexList.forEach(function (i) {
                            this.contents.getForm()[i].hide();
                        }.bind(this));
                        this.fnDeleteAllRow.call(this, g);
                        g.setCell("formula", key, this.lastCalcData);
                    }
                } else if (event.target.checked) {
                    if (idx == 0) {
                        this.contents.find(function (item) { return ["relationalOperatorTitle", "groupItemTitle"].contains(item.id); }).forEach(function (ctrl) { ctrl.show(); });
                        this.formIndexList.forEach(function (i) {
                            this.contents.getForm()[i].show();
                        }.bind(this));
                        this.lastCalcData = g.getCell("formula", key);
                    }
                    this.fnAddChildRow.call(this, g, key, idx);
                } else {
                    var thisRowKey = (gridData.rowItem.parentRowKey || "--^^").split("-")[0];

                    for (i = idx, cnt = g.getRowCount() ; i < cnt; i++) {
                        if (thisRowKey && g.getCell("parentRowKey", g.getRowKeyByIndex(i)).indexOf(thisRowKey) > -1 && !$.isEmpty(g.getCellWidgetInstance("formula", g.getRowKeyByIndex(i)).getValue().value)) {
                            isNotEmpty = true;
                            break;
                        }
                    }

                    if (isNotEmpty) {
                        ecount.confirm(ecount.resource.MSG04741, function (status) {
                            if (status) {
                                this.fnDeleteChildRow.call(this, g, key, idx);
                            } else {
                                g.setCell("check", idx, true);
                            }
                        }.bind(this));
                    } else {
                        this.fnDeleteChildRow.call(this, g, key, idx);
                    }
                }
            }.bind(this)
        };
        return option;
    },

    setCalcGridFormula: function (value, rowItem) {
        debugger;
        var option = {};
        var isCalc = (rowItem["parentRowKey"] || "").indexOf("trDefine") > -1 ? false : true;

        option.data = rowItem["formula"];
        option.dataGubun = rowItem["CALC_GUBUN"] || "";
        option.controlOption = {};

        if (this.codeList.length > 0) {
            option.controlOption.codes = this.codeList;
        }
        option.controlOption.joinMaxLength = 4;
        if (this.IS_CALC_TYPE) {
            option.controlOption.logics = this.logicList;
            option.controlOption.comparisons = this.comparisonList;
            option.controlOption.calcs = this.calcList;
            option.controlOption.bracketFunction = this.bracketFunctionList;
            option.controlOption.bracket = this.bracketList;
            option.controlOption.inCodes = this.inCodeList;
            option.controlOption.isCalc = isCalc;
        } else {
            option.controlOption.joinString = this.joinStringList;
            option.controlOption.isJoinString = true;
        }

        if (this.IsRequired) {
            option.controlOption.isRequired = true;
        }
        if (this.IS_BALANCE_TYPE) {
            option.controlOption.outCheckError = this.onOutErrorCheck.bind(this);
            option.controlOption.maxBytes = 200;
        }

        if (this.MAX_BYTE != null && this.MAX_BYTE != undefined)
            option.controlOption.maxBytes = this.MAX_BYTE;

        option.event = {
            focus: function () {
                this.lastRowId = arguments[1].rowKey;
            }.bind(this)
        };

        return option;
    },

    //list : 현재 등록된 리스트 목록
    //item : insert 하려는 값
    //isString : 문자형 여부(true: 문자형식, false : 계산식)
    onOutErrorCheck: function (list, item, isString) {
        ////에러일때
        var isSlipItem = list.list.any(function (items) { return ['slip_begin', 'slip_end'].contains(items.value); });
        var isDateItem = list.list.any(function (items) { return ['date_begin', 'date_sale', 'date_receipt', 'date_balance', 'date_net_balance'].contains(items.value); });
        if ((['slip_begin', 'slip_end'].contains(list.select.value) && isDateItem) || (['date_begin', 'date_sale', 'date_receipt', 'date_balance', 'date_net_balance'].contains(list.select.value) && isSlipItem)) {
            return { isError: true, message: ecount.resource.MSG03551.replace("*", "") }
        }
        //에러가 없을때
        return { isError: false, message: null };
    },

    setFormulaItemClick: function (e) {
        debugger;
        if (this.itemObject[e.name].type == "2") {
            if (this.contents.getGrid("calcGrid").grid.getCell("check", this.lastRowId) == true) {
                this.fnOpenPopup(e.name, this.itemObject[e.name].label);
            } else {
                ecount.alert(ecount.resource.MSG04770);
            }
        } else {
            if (e.name == "era_name") {
                //this.fnOpenPopupEra();
            } else {
                this.fnInsertItem(this.itemObject, e.name);
            }
        }
    },
    setOperatorClick: function (obj, e) {
        if (["4", "5"].contains(obj[e.name].type.toString()) && this.contents.getGrid("calcGrid").grid.getCell("check", this.lastRowId) != true) {
            ecount.alert(ecount.resource.MSG04770);
        } else if (e.name == "StringText") {
            // Open popup
            var param = {
                width: 300,
                height: 200,
                INDEX : this.INDEX
            }
            this.openWindow({
                url: "/ECERP/Popup.Common/CM100P_80",
                name: "",
                param: param,
                popupType: false,
                additional: false
            });
        } else {
            this.fnInsertItem(obj, e.name);
        }
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    // add item to calc widget (위젯에 항목 추가)
    // obj : formula item object (계산 항목 object)
    // name : formula item name (추가할 항목명)
    fnInsertItem: function (obj, name) {
        // 계산식 그리드 처리 해야함
        var grid = this.contents.getGrid("calcGrid").grid;
        if (obj[name]) {
            var widget = grid.getCellWidgetInstance("formula", this.lastRowId);
            var error = widget.getInsertItemErrorCheck(obj[name]);

            if (error && error.isError) {

                //this.setTimeout(function() {widget.showError(error.message)}, 0);//자릿수를 초과했습니다.
                //widget.showError(error.message);
                grid.activeCellBlur();
                grid.setCellShowError("formula", this.lastRowId, {
                    placement: 'top',
                    message: error.message,
                    popOverVisible: !$.isEmpty(error.message)
                });
                grid.setCellFocus("formula", this.lastRowId);
                return;
            } else {
                grid.setCell("formula", this.lastRowId, obj[name]);
                grid.setCellFocus("formula", this.lastRowId);
            }
        }
    },

    // open condition item select popup (조건식 선택 팝업 오픈)
    // cd : code class
    fnOpenPopup: function (cd, title) {
        this.openWindow({
            url: this.popupUrl,
            name: "popup",
            param: {
                width: 500,
                height: 630,
                CODE_CLASS: cd,
                Title_resx: title
            },
            additional: false,
            popupType: false
        });
    },

    //연호(미사용)
    fnOpenPopupEra: function () {
        this.openWindow({
            url: "/ECERP/Popup.Search/ECTAX023P_04",
            name: String.format(ecount.resource.LBL06434, ecount.resource.LBL02282),
            param: {
                width: 500,
                height: 630,
                CLASS_CD: "LU22",
                PAGE_CURRENT: 0,
                PAGE_SIZE: 100,
                TYPE: "G",
                Title: String.format(ecount.resource.LBL10109, ecount.resource.LBL05360),
                isDeprecatedOnePopupClose: true
            },
            additional: false,
            popupType: false
        });
    },

    // delete all data (전체 데이터 삭제)
    // g : grid (그리드)
    fnDeleteAllRow: function(g) {
        var firstRowKey = g.getRowKeyByIndex(0);

        g.setColumnVisibility("type", false);
        g.setCell("parentRowKey", firstRowKey, "^default^calc_des")
        g.setCell("formula", firstRowKey, []);

        for (var lst = g.getRowList().length - 1; lst > 0; lst--) {
            g.removeRow(g.getRowKeyByIndex(lst), { removeDOM: true });
        }

        this.conditionCalcOrder.clear();
        this.addNo = 1;
    },

    // delete child rows (하위 row 삭제)
    // g : grid (그리드)
    // key : parent row key (삭제할 부모 key)
    // idx : parent row index (삭제할 부모 index)
    fnDeleteChildRow: function (g, key, idx) {
        var deleteConditionRegEx = new RegExp("\\[" + ecount.resource.LBL08906 + ".*\\]|&nbsp;|\\s", "gi");

        var parentRowKey = g.getCell("parentRowKey", key) || "-y-^^";
        var keys = [];
        var currentParentRowKey = parentRowKey.split("^");  // ["trFalse8-y-trFalse8 trFalse7 trFalse6 trFalse5 trFalse1", "False8", "trDefine9"]
        var tempOrder = (currentParentRowKey[0] || "-n-").split("-"); // ["trFalse8", "y", "trFalse8 trFalse7 trFalse6 trFalse5 trFalse1"]
        var tempDeleteOrder = (currentParentRowKey[0] || "-n-").split("-");
        var tempParentList = tempOrder[2].split(" "); // ["trFalse8", "trFalse7", "trFalse6", "trFalse5", "trFalse1"]
        var tempKey = tempParentList.shift(); // ["trFalse7", "trFalse6", "trFalse5", "trFalse1"]

        var tempParent = tempParentList[0] || ""; // "trFalse7"
        tempOrder[0] = tempParent; // "trFalse7"
        tempOrder[2] = tempParentList.join(" "); // "trFalse7 trFalse6 trFalse5 trFalse1"

        var tempParentRowKey = tempOrder.join("-") + "^" + tempParent.replace("tr", "") + "^" + tempKey;

        g.setCell("type", key, "     [" + g.getCell("type", key).replace(deleteConditionRegEx, "") + "]");
        g.setCell("formula", key, []);
        g.setCell("parentRowKey", key, tempParentRowKey);
        keys.push(tempKey);

        var rows = g.getRowList();
        var checkedRows = [];
        var childKeys = [];
        var currentType = "", currentKey = "";

        for (var i = idx + 1, lng = rows.length; i < lng; i++) {
            currentType = rows[i].PARENTROWKEY.split("^")[2];
            currentKey = rows[i].PARENTROWKEY.split("^")[1];

            if (currentType.indexOf("trDefine") > -1 && rows[i].PARENTROWKEY.split("^")[0].split("-")[2].split(" ").contains(tempKey)) {
                keys.push(rows[i].PARENTROWKEY.split("^")[0].split("-")[0]);

                for (var j = 0, lngj = keys.length; j < lngj; j++) {
                    if (rows[i].PARENTROWKEY.split("^")[0].split("-")[2].substring(0, rows[i].PARENTROWKEY.split("^")[0].split("-")[2].indexOf(currentKey) + currentKey.length).split(" ").contains(keys[j])) {
                        g.removeRow(rows[i]["K-E-Y"], { removeDOM: true });
                        break;
                    }
                }
            } else {
                if (keys.contains("tr" + rows[i].PARENTROWKEY.split("^")[1])) {
                    g.removeRow(rows[i]["K-E-Y"], { removeDOM: true });
                }
            }
        }
        this.conditionCalcOrder.push(tempDeleteOrder[0] + "-n-");

        g.refreshCell("formula", key);
    },

    // add child rows (자식 row 추가)
    // g : grid (그리드)
    // key : parent row key (추가할 부모 row key)
    // idx : parent row index (추가할 부모 row index)
    fnAddChildRow: function (g, key, idx) {
        if (g.getRowList().length >= 21) {
            ecount.alert(String.format(ecount.resource.MSG04740, "10"));
            g.setCellByIndex("check", idx, false);
            return false;
        }

        var addConditionRegEx = new RegExp("[\\[\\]]|\\s|&nbsp;", "gi");

        g.addRow(2, idx + 1);
        g.setCell("formula", g.getRowKeyByIndex(idx), []);

        var rowKey1 = g.getRowKeyByIndex(idx + 1);
        var rowKey2 = g.getRowKeyByIndex(idx + 2);

        var currentParentRowKey = (g.getCell("parentRowKey", key) || "-y-^^").split("^"); // ["trFalse8-y-trFalse8 trFalse7 trFalse6 trFalse5 trFalse1", "False8", "trFalse9"]
        var tempOrder = (currentParentRowKey[0] || "-y-").split("-"); // ["trFalse8", "y", "trFalse8 trFalse7 trFalse6 trFalse5 trFalse1"]
        var tempKey1 = currentParentRowKey[2].replace("trDefine1", "") || "trTrue" + this.addNo; // "trFalse9"
        var tempKey2 = currentParentRowKey[2].replace("trDefine1", "") || "trFalse" + this.addNo;
        var tempParent1 = tempKey1.replace("tr", ""); // "False9"
        var tempParent2 = tempKey2.replace("tr", "");
        var tempKey = "trDefine" + this.addNo; // trDefine11

        var parentRowKey1 = tempKey1 + "-" + tempOrder[1] + "-" + tempKey1 + " " + tempOrder[2] + "^" + tempParent1 + "^"; // "trFalse9-y-trFalse9 trFlase8 trFalse7 trFalse6 trFalse5 trFalse1^False8^
        var parentRowKey2 = tempKey2 + "-" + tempOrder[1] + "-" + tempKey2 + " " + tempOrder[2] + "^" + tempParent2 + "^";

        if (idx == 0) {
            parentRowKey1 = "-y-^^";
            parentRowKey2 = "-y-^^";

            g.setColumnVisibility("type", true);
            g.setCellByIndex("type", idx, ecount.resource.LBL08906 + "1")
            g.setCellByIndex("parentRowKey", idx, "^^trDefine1");
        } else {
            g.setCellByIndex("type", idx, g.getCell("type", key).replace(addConditionRegEx, "") + " " + String.format("[{0}{1}]", ecount.resource.LBL08906, this.addNo));
            g.setCellByIndex("parentRowKey", idx, parentRowKey1 + "trDefine" + this.addNo);
        }
        g.setCellByRow({ type: "     [" + ecount.resource.LBL09090 + this.addNo + "]", formula: "", parentRowKey: parentRowKey1 + "trTrue" + this.addNo }, rowKey1);
        g.setCellByRow({ type: "     [" + ecount.resource.LBL09091 + this.addNo + "]", formula: "", parentRowKey: parentRowKey2 + "trFalse" + this.addNo }, rowKey2);

        g.refreshCell("formula", g.getRowKeyByIndex(idx));

        if (idx > 0)
            this.conditionCalcOrder.push($.trim(tempKey1 + "-y-" + tempKey1 + " " + tempOrder[2]));

        this.addNo++;
    },

    // create object for add widget (위젯에 추가할 계산식 아이템 만들기)
    // v : value (실제 저장될 값)
    // l : label (화면에 보일 값)
    // t : type (항목 타입) [1: formula item(계산항목), 2: condition (in) item(조건식항목), 4: and, or, 5: >, <..., 6: arithmetic operations(사칙연산), 7: round, ceiling, floor, 8: bracket(괄호)]
    // h : hide
    fnCreateFormulaItem: function (v, l, t, h) {
        if (arguments.length == 2) {
            return { value: v, label: v, type: l, Hide: h || false };
        }
        else {
            return { value: v, label: l, type: t, Hide: h || false };
        }
    },

    // create object for add widget (위젯에 추가할 계산식 아이템 만들기(Section Group 확장)
    // v : value (실제 저장될 값)
    // l : label (화면에 보일 값)
    // t : type (항목 타입) [1: formula item(계산항목), 2: condition (in) item(조건식항목), 4: and, or, 5: >, <..., 6: arithmetic operations(사칙연산), 7: round, ceiling, floor, 8: bracket(괄호)]
    // h : hide
    // s : section
    fnCreateFormulaItemWithSectionGroup: function (v, l, t, h, s) {
        if (arguments.length == 2) {
            return { value: v, label: v, type: l, Hide: h || false, Section : s || null };
        }
        else {
            return { value: v, label: l, type: t, Hide: h || false, Section: s || null };
        }
    },

    fnSectionTitle: function (SectionID) {
        switch (SectionID) {
            case "SLIP":
                return ecount.resource.LBL12866;
                break;
            case "PROD":
                return ecount.resource.LBL06065;
                break;
                //case "CUST":
                //    return "거래처정보";
                break;
        }
    },

    // 전후잔 계산시 사용항목체크
    setOnloadBalanceTypeCheck: function () {
        var balanceType = (this.BALANCE_TYPE || 0).toString();
        //전잔 1, 3
        this.bySlipBeginning = ['1', '3'].contains(balanceType);
        //후잔 2, 3
        this.bySlipEnding = ['2', '3'].contains(balanceType);
        //전일잔액 4,8,9,10,14,15,16,18
        this.byDateBeginning = ['4', '8', '9', '10', '14', '15', '16', '18'].contains(balanceType);
        //금일(기간)판매 5, 8, 11, 12, 14, 16, 17, 18
        this.byDateSales = ['5', '8', '11', '12', '14', '16', '17', '18'].contains(balanceType);
        //금일(기간)수금 6, 9, 11, 13, 14, 15, 17, 18
        this.byDateReceipt = ['6', '9', '11', '13', '14', '15', '17', '18'].contains(balanceType);
        //금일(기간)잔액 7, 10, 12, 13, 15, 16, 17, 18
        this.byDateBalance = ['7', '10', '12', '13', '15', '16', '17', '18'].contains(balanceType);
        //금일잔액(순잔액)
        this.byDateNetBalance = ['19'].contains(balanceType);
    },
    //최종적으로 내려갈 값
    setBalanceTypeValue: function (setValue) {
        this.balanceUseCheck(setValue);
        var balanceType = 0;
        this.itemObject;
        if (this.bySlipBeginning == true && this.bySlipEnding == false)//* 1-전잔
            balanceType = 1;
        else if (this.bySlipBeginning == false && this.bySlipEnding == true)//* 2-후잔
            balanceType = 2;
        else if (this.bySlipBeginning == true && this.bySlipEnding == true)//* 3-전잔   후잔
            balanceType = 3;
        else if (this.byDateBeginning == true && this.byDateSales == false && this.byDateReceipt == false && this.byDateBalance == false)//* 4-전일잔액
            balanceType = 4;
        else if (this.byDateBeginning == false && this.byDateSales == true && this.byDateReceipt == false && this.byDateBalance == false)//* 5-금일(기간)판매
            balanceType = 5;
        else if (this.byDateBeginning == false && this.byDateSales == false && this.byDateReceipt == true && this.byDateBalance == false)//* 6-금일(기간)수금
            balanceType = 6;
        else if (this.byDateBeginning == false && this.byDateSales == false && this.byDateReceipt == false && this.byDateBalance == true)//* 7-금일(기간)잔액
            balanceType = 7;
        else if (this.byDateBeginning == true && this.byDateSales == true && this.byDateReceipt == false && this.byDateBalance == false)//* 8-전일잔액        금일(기간)판매
            balanceType = 8;
        else if (this.byDateBeginning == true && this.byDateSales == false && this.byDateReceipt == true && this.byDateBalance == false)//* 9-전일잔액        금일(기간)수금
            balanceType = 9;
        else if (this.byDateBeginning == true && this.byDateSales == false && this.byDateReceipt == false && this.byDateBalance == true)//* 10-전일잔액       금일(기간)잔액
            balanceType = 10;
        else if (this.byDateBeginning == false && this.byDateSales == true && this.byDateReceipt == true && this.byDateBalance == false)//* 11-금일(기간)판매 금일(기간)수금
            balanceType = 11;
        else if (this.byDateBeginning == false && this.byDateSales == true && this.byDateReceipt == false && this.byDateBalance == true)//* 12-금일(기간)판매 금일(기간)잔액
            balanceType = 12;
        else if (this.byDateBeginning == false && this.byDateSales == false && this.byDateReceipt == true && this.byDateBalance == true)//* 13-금일(기간)수금 금일(기간)잔액
            balanceType = 13;
        else if (this.byDateBeginning == true && this.byDateSales == true && this.byDateReceipt == true && this.byDateBalance == false) //* 14-전일잔액       금일(기간)판매      금일(기간)수금
            balanceType = 14;
        else if (this.byDateBeginning == true && this.byDateSales == false && this.byDateReceipt == true && this.byDateBalance == true) //* 15-전일잔액       금일(기간)수금      금일(기간)잔액
            balanceType = 15;
        else if (this.byDateBeginning == true && this.byDateSales == true && this.byDateReceipt == false && this.byDateBalance == true) //* 16-전일잔액       금일(기간)판매      금일(기간)잔액
            balanceType = 16;
        else if (this.byDateBeginning == false && this.byDateSales == true && this.byDateReceipt == true && this.byDateBalance == true) //* 17-금일(기간)판매 금일(기간)수금      금일(기간)잔액
            balanceType = 17;
        else if (this.byDateBeginning == true && this.byDateSales == true && this.byDateReceipt == true && this.byDateBalance == true)  //* 18-전일잔액        금일(기간)판매      금일(기간)수금    금일(기간)잔액
            balanceType = 18;
        else if (this.byDateNetBalance == true)  // 금일잔액(순잔액)
            balanceType = 19;
        return balanceType;
    },
    //전후잔 값 체크 사용여부
    balanceUseCheck: function (setValue) {
        this.bySlipBeginning = setValue.any(function (item) { return item.value == 'slip_begin'; });
        this.bySlipEnding = setValue.any(function (item) { return item.value == 'slip_end'; });
        this.byDateBeginning = setValue.any(function (item) { return item.value == 'date_begin'; });
        this.byDateSales = setValue.any(function (item) { return item.value == 'date_sale'; });
        this.byDateReceipt = setValue.any(function (item) { return item.value == 'date_receipt'; });
        this.byDateBalance = setValue.any(function (item) { return item.value == 'date_balance'; });
        this.byDateNetBalance = setValue.any(function (item) { return item.value == 'date_net_balance'; });
        ////this.setDescription();
    },


    // 상품재고입력 기본값복원 기능
    onHeaderDefaultSetting: function () {

        this.CALC_DESC = "default^calc_des^STET_OM_PM_INFO.BAL_QTYㆍ+ㆍSTET_OM_PM_INFO.IN_BALㆍ-ㆍSTET_OM_PM_INFO.SAFE_QTYㆍ-ㆍSTET_OM_PM_INFO.OUT_BAL";
        this.CALC_GUBUN = "1ㆍ6ㆍ1ㆍ6ㆍ1ㆍ6ㆍ1";

        var defaultValue =
            [
                { "value": "STET_OM_PM_INFO.BAL_QTY", "label": "LBL06240", "type": "1" },
                { "value": "+", "label": "+", "type": "6" },
                { "value": "STET_OM_PM_INFO.IN_BAL", "label": "LBL01195", "type": "1" },
                { "value": "-", "label": "-", "type": "6" },
                { "value": "STET_OM_PM_INFO.SAFE_QTY", "label": "LBL01810", "type": "1" },
                { "value": "-", "label": "-", "type": "6" },
                { "value": "STET_OM_PM_INFO.OUT_BAL", "label": "LBL01221", "type": "1" }
            ];

        var g = this.contents.getGrid("calcGrid").grid;
        g.setCell("formula", 0, defaultValue);
    }

});
