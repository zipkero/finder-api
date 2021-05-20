window.__define_resource && __define_resource("LBL11876","LBL11875","LBL11880","LBL11881","LBL05875","LBL13072","BTN00008","BTN00043","LBL00921","BTN80047","LBL11878","BTN70010","LBL02874","LBL01070","MSG02158","LBL11877","MSG00141","LBL07436","MSG00303","MSG00299","LBL35130","LBL01688","LBL00961","LBL00962","LBL00963","LBL08035","LBL08036","LBL08037","LBL08038","LBL08039","LBL08040","LBL08041");

/*--- ES050P.js ---*/
/****************************************************************************************************
1. Create Date : 2016.11.23
2. Creator     : 임명식
3. Description : 재고 > 기초등록 > 품목등록 > 규격계산그룹검색(Search Spec. calc group)
4. Precaution  :
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES050P", {

    //isOnePopupClose: false,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: this.keyword,
            SORT_COLUMN: 'CODE_CLASS',
            ListFlag: this.ListFlag == "List" ? true : false,
            DEL_FLAG: this.ListFlag == "List" ? true : false
        };
        this.isUseExcelConvert = ecount.config.user.USE_EXCEL_CONVERT;
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

        if (this.ListFlag === "List") {
            header.setTitle(ecount.resource.LBL11876).useQuickSearch(); //규격계산그룹리스트
        } else {
            header.setTitle(ecount.resource.LBL11875).useQuickSearch(); // 규격계산그룹검색
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        var columns = [
                { propertyName: 'CODE_CLASS', id: 'CODE_CLASS', title: ecount.resource.LBL11880, width: '' }, // resource: 규격계산그룹코드
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', title: ecount.resource.LBL11881, width: '' }, //resource: 규격계산그룹명
        ]
        settings
            .setRowDataUrl('/Inventory/Common/GetListSpecCalcForSearch')
            .setRowData(this.viewBag.InitDatas.ListLoad)
            .setKeyColumn(['CODE_CLASS', 'CLASS_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnSortable(true)
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCustomRowCell('CODE_CLASS', this.setGridDateLink.bind(this))
            .setCustomRowCell('CLASS_DES', this.setGridDateLink.bind(this))
            .setColumnSortDisableList(['CODE'])
            .setCustomRowCell("CALC_CODE", this.registerSpecGroupPopupLink.bind(this))
        //Keyboard event
            .setEventFocusOnInit(true)
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);
        if (this.ListFlag === "List") {
            settings.setCheckBoxUse(true)
            columns.push({ propertyName: 'CALC_CODE', id: 'CALC_CODE', title: ecount.resource.LBL05875, width: '55', align: 'center' }) //resource: 계산식
        }
        settings.setColumns(columns);
        this.searchFormParameter.columns = columns;

        contents
            .add(toolbar)
            .addGrid("dataGrid", settings);
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        debugger;
        var toolbar = widget.generator.toolbar(),
               ctrl = widget.generator.control();

        if (!this.searchFormParameter.ListFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "modify").label(ecount.resource.LBL13072));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        } else {
            toolbar
                .addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).end()) //신규(F2)
                .addLeft(ctrl.define("widget.button", "Pre").label(ecount.resource.LBL00921).end())//이전
                .addLeft(ctrl.define("widget.button", "Excel").label("Excel").end())//
                .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).end())// 닫기
                .addLeft(ctrl.define("widget.button", "DeleteMulti").label(ecount.resource.BTN80047).clickOnce().end())//선택삭제
        }
        toolbar
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([10, 11]));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        this.header.getQuickSearchControl().setValue(this.keyword);
        this.header.getQuickSearchControl().setFocus(0);
        this.fnReload();

    },
    //재로드
    fnReload: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        this.header.getQuickSearchControl().setFocus(0);

        if (e != undefined) {
            var grid = this.contents.getGrid();
            grid.getSettings().setHeaderTopMargin(this.header.height());
            grid.draw(this.searchFormParameter);
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {

        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                //리스트
                if (this.ListFlag == "List") {
                    this.openWindow({
                        url: "/ECERP/Popup.Search/ES050P_01",
                        name: ecount.resource.LBL11878,//"규격계산그룹수정"
                        additional: false,
                        param: {
                            width: 600,
                            height: 180,
                            EDIT_FLAG: true,
                            CODE_CLASS: data.rowItem.CODE_CLASS,
                        },
                    });
                    //변경
                } else {
                    var message = {
                        name: "CLASS_DES",
                        code: "CODE_CLASS",
                        data: data.rowItem,
                        isAdded: this.isCheckBoxDisplayFlag,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                }

            }.bind(this)
        };
        return option;
    },

    // Set bank account link 이름 바꾸기
    registerSpecGroupPopupLink: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.link";
        option.data = ecount.resource.BTN70010;
        if (!$.isEmpty(rowItem.CALC_OPEN_VAL)) {
            option.attrs = {
                "class": "text-warning-inverse",
            }
        }
        option.event = {
            'click': function (e, data) {
                //00002∮테스트2

                var param = {
                    width: 500,
                    height: 500,
                    CODE_CLASS: data.rowItem.CODE_CLASS,
                    CALC_DESC: data.rowItem.CALC_VAL_SQL,
                    CALC_GUBUN: data.rowItem.CALC_VAL_GUBUN,
                    COL_CD: "SIZE_CALC_CD",
                    IS_CALC_ONLY: true,
                    IS_CALC_TYPE: true,
                    INDEX: 0,
                    CALC_PAGE: "ES050P",
                    FORM_TYPE: "SI902",
                    FORM_SEQ: 1,
                    UserData: data.rowKey
                };
                // Open popup                
                this.openWindow({
                    url: '/ECERP/Popup.Common/CM100P_05',
                    name: data.rowItem.CODE_CLASS + ecount.resource.LBL02874 + ecount.resource.LBL01070, //" 코드 리스트"
                    param: param,
                    popupType: false,
                    additional: false

                });
                e.preventDefault();
            }.bind(this)
        };
        return option;
    },
    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['ENABLED'] == 0)
            return true;
    },
    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {

        if (data.dataCount === 1 && this.isOnePopupClose == true) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "CLASS_DES",
                code: "CODE_CLASS",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        } else {
            ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        }
    },
    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.ecount.alert(String.format(this.resource.MSG02158, count));
    },
    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {

        if (page.pageID == 'ES050P_01') {
            this.fnReload(1);
        } else if (page.pageID == 'CM100P_05') {
            var thisObj = this;
            var grid = thisObj.contents.getGrid().grid;
            var calcResult = this.setCalcData.call(this, message.data[0].CALC_VALUE[0], false);
            if (calcResult) {
                var gridKey = message.data[0].UserData;
                var param = {
                    CODE_CLASS: gridKey.split("∮")[0],
                    CALC_VAL: calcResult.DEFAULT_CALC_VAL,
                    CALC_OPEN_VAL: calcResult.DEFAULT_CALC_OPEN_VAL,
                    CALC_NOTMATH_VAL: calcResult.DEFAULT_CALC_NOTMATH_VAL,
                    CALC_VAL_GUBUN: message.data[0].CALC_GUBUN,
                    CALC_VAL_SQL: message.data[0].CALC_DESC,
                    ENABLED: grid.getCell('ENABLED', gridKey)
                }
                ecount.common.api({
                    url: "/Inventory/Basic/UpdateSale008CalcGCode",
                    data: Object.toJSON(param),
                    success: function (result) {
                        if (result.Data == "0") {
                            grid.setCell('CALC_VAL', gridKey, param.CALC_VAL);
                            grid.setCell('CALC_OPEN_VAL', gridKey, param.CALC_OPEN_VAL);
                            grid.setCell('CALC_VAL_GUBUN', gridKey, param.CALC_VAL_GUBUN);
                            grid.setCell('CALC_VAL_SQL', gridKey, param.CALC_VAL_SQL);
                            grid.refreshCell('CALC_CODE', gridKey);
                        }
                    }.bind(this)
                });
            }
        }
        message.callback && message.callback();  // The popup page is closed   
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //신규
    onFooterNew: function () {
        this.openWindow({
            url: "/ECERP/Popup.Search/ES050P_01",
            name: String.format(ecount.resource.LBL11877),//"규격계산그룹등록"
            additional: false,
            param: {
                width: 600,
                height: 180,
            },
        });
    },
    //리스트 버튼 (검색 페이지로 이동)
    onFooterPre: function () {
        this.searchFormParameter.DEL_FLAG = false;
        var listFlag = "Search";
        this.onComeAndGoListToSearch(listFlag);
    },
    //엑셀버튼
    onFooterExcel: function () {

        if (this.isUseExcelConvert) {
            var excelSearch = this.searchFormParameter
            ecount.document.exportExcel("/Inventory/Basic/ExcelCodeGroupForSale008CalcG", excelSearch);     // Please excelTitle check!
        } else {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL07436);
            ecount.alert(message);
            return;
        }
    },
    //선택삭제
    onFooterDeleteMulti: function (cid) {
        var _self = this;
        var btnDeleteMulti = this.footer.get(0).getControl("DeleteMulti");
        delItem = this.contents.getGrid().grid.getChecked();
        uniqueItems = new Array();

        $.each($.makeArray(delItem), function (i, el) {
            uniqueItems.push(el.CODE_CLASS);
        });

        if (!uniqueItems.length) {
            ecount.alert(ecount.resource.MSG00303);
            return false;
        }

        var formData = Object.toJSON({
            CODE_CLASS_LIST: uniqueItems.join(ecount.delimiter),
        });
        var strUrl = "/Inventory/Basic/DeleteGroupListForSale008GCalcG";
        ecount.confirm(ecount.resource.MSG00299, function (isOk) {
            if (isOk) {
                ecount.common.api({
                    url: strUrl,
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.ecount.alert(result.fullErrorMsg);
                        } else {
                            _self.contents.getGrid().draw(_self.searchFormParameter);
                        }
                    }.bind(_self)
                });
            }
            btnDeleteMulti.setAllowClick();
        });
    },

    onFooterModify: function () {
        var listFlag = "List";
        this.searchFormParameter.DEL_FLAG = true;
        this.onComeAndGoListToSearch(listFlag);

    },
    onComeAndGoListToSearch: function (listFlag) {

        var param = {
            ListFlag: listFlag,
            DEL_FLAG: this.searchFormParameter.DEL_FLAG,
            height: 600,
            isOpenPopup: true,
            callPageName: "ES050P",
            __ecPage__: "",
            _ecParam__: "",
            isPopFlag: "Y"
        };
        this.onAllSubmitSelf("/ECERP/Popup.Search/ES050P", param, "details");
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.PARAM = value;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        if (this.searchFormParameter.isIncludeInactive) {
            ;
            this.searchFormParameter.DEL_FLAG = event.status;
        }
        this.contents.getGrid().draw(this.searchFormParameter);
        this.setTimeout(function () {
            this.header.getQuickSearchControl().setFocus(0);
        }.bind(this), 500);
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //엔터
    // ON_KEY_F2
    ON_KEY_F2: function () {
        this.onFooterNew();
    },
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(e);
    },
    ON_KEY_DOWN: function () {
        // this.gridFocus && this.gridFocus();
    },
    ON_KEY_UP: function () {
        //this.gridFocus && this.gridFocus();
    },
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    gridFocus: function () {
    },
    //var calcResult = this.setCalcData.call(this, message.data[0].CALC_VALUE[0], isBalanceType);
    setCalcData: function (data, isString) {
        var result = { DEFAULT_CALC_VAL: "", DEFAULT_CALC_OPEN_VAL: "", DEFAULT_CALC_NOTMATH_VAL: "" };

        if ($.isArray(data)) {
            var defaultCalcVal = "", defaultCalcOpenVal = "", defaultCalcNotMathVal = "";
            var itemOriginalName = {
                uqty: ecount.resource.LBL35130,
                qty: ecount.resource.LBL01688,
                out_price1: ecount.resource.LBL00961,
                out_price2: ecount.resource.LBL00962,
                out_price3: ecount.resource.LBL00963,
                out_price4: ecount.resource.LBL08035,
                out_price5: ecount.resource.LBL08036,
                out_price6: ecount.resource.LBL08037,
                out_price7: ecount.resource.LBL08038,
                out_price8: ecount.resource.LBL08039,
                out_price9: ecount.resource.LBL08040,
                out_price10: ecount.resource.LBL08041
            };

            for (var i = 0, j = 0, lng = data.length; i < lng; i++) {
                switch (data[i].type.toString()) {
                    case "1": // 항목
                        defaultCalcVal += String.format("§{0}§", data[i].value);
                        defaultCalcOpenVal += itemOriginalName[data[i].value] ? itemOriginalName[data[i].value] : data[i].label;
                        defaultCalcNotMathVal += String.format("§{0}§", data[i].value);
                        break;
                    case "3": // 숫자
                    case "6": // 사칙연산
                        defaultCalcVal += data[i].value;
                        defaultCalcOpenVal += data[i].value;
                        defaultCalcNotMathVal += data[i].value;
                        break;
                    case "7": // Round, Floor, Ceiling
                        switch (data[i].value) {
                            case "R(":
                            case "ROUND(":
                                defaultCalcVal += "fnMathRound(";
                                defaultCalcOpenVal += "R(";
                                defaultCalcNotMathVal += "R(";
                                break;
                            case "C(":
                            case "CEILING(":
                                defaultCalcVal += "fnMathIncrease(";
                                defaultCalcOpenVal += "C(";
                                defaultCalcNotMathVal += "C(";
                                break;
                            case "F(":
                            case "FLOOR(":
                                defaultCalcVal += "fnMathCutCalc(";
                                defaultCalcOpenVal += "F(";
                                defaultCalcNotMathVal += "F(";
                                break;
                        }
                        j++;
                        break;
                    case "8": // 괄호
                        defaultCalcVal += data[i].value;
                        defaultCalcOpenVal += data[i].value;
                        defaultCalcNotMathVal += data[i].value;
                        break;
                    case "9":
                    case "10":
                        if (isString) {
                            defaultCalcVal += data[i].value;
                            defaultCalcOpenVal += data[i].value;
                            defaultCalcNotMathVal += data[i].value;
                        }
                        break;
                }
            }
            result.DEFAULT_CALC_NOTMATH_VAL = defaultCalcNotMathVal;
            if (isString) {
                result.DEFAULT_CALC_VAL = defaultCalcVal;
                result.DEFAULT_CALC_OPEN_VAL = defaultCalcOpenVal;
            } else {
                var taget_string = defaultCalcVal;
                if (taget_string.indexOf("/") == -1) { // /가 있는지 체크 check whether "/" exists
                    return_string = taget_string;
                }
                else {
                    var j_t = taget_string.split("/").length;  //  j_t = /갯수 

                    for (var j_s = 1; j_s < j_t; j_s++) {
                        var taget_string2 = taget_string.split("/");
                        return_string = "";
                        taget_string3 = "";

                        for (var j_0 = 0; j_0 < taget_string2.length; j_0++) {
                            if (j_0 < j_s)
                                return_string += taget_string2[j_0] + "/";
                            else {
                                taget_string3 += taget_string2[j_0];
                                if (j_0 != (taget_string2.length - 1))
                                    taget_string3 += "/";
                            }
                        } //for end 

                        var j = 0;
                        var nullif = "N";

                        if (taget_string3.indexOf("(") != -1) { // /가 있는지 체크 check whether "/" exists
                            //return_string += "ecount.calc.nullifchk("
                            return_string += "nullifchk("
                            nullif = "Y"
                        }

                        for (var j_1 = 0; j_1 < taget_string3.length; j_1++) {

                            switch (taget_string3.substr(j_1, 1)) {
                                case "(":
                                    j++;
                                    return_string += taget_string3.substr(j_1, 1);
                                    break;
                                case ")":
                                    j--;
                                    if (j < 1) {
                                        if (j == 0)
                                            return_string += taget_string3.substr(j_1, 1) + ",1)" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                        else {
                                            if (nullif == "Y")
                                                return_string += ",1))" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                            else
                                                return_string += taget_string3.substr(j_1, taget_string3.length);
                                        }

                                        j_1 = taget_string3.length;
                                    }
                                    else
                                        return_string += taget_string3.substr(j_1, 1);
                                    break;
                                default:
                                    return_string += taget_string3.substr(j_1, 1);
                            }
                        }
                        taget_string = return_string;
                    }
                }


                var arrCalcs = ["fnMathRound(", "fnMathIncrease(", "fnMathCutCalc("];
                //var arrCalcs = ["ecount.calc.toFixedRound(", "ecount.calc.toFixedCeil(", "ecount.calc.toFixedFloor("];
                taget_string = return_string;

                for (var ii = 0; ii < 3; ii++) {
                    if (taget_string.indexOf(arrCalcs[ii]) == -1) { // /가 있는지 체크 check whether "/" exists 
                        return_string = taget_string;
                    }
                    else {
                        var j_t = taget_string.split(arrCalcs[ii]).length;  //  j_t = /갯수 count

                        for (var j_s = 1; j_s < j_t; j_s++) {
                            var taget_string2 = taget_string.split(arrCalcs[ii]);
                            return_string = "";
                            taget_string3 = "";
                            for (var j_0 = 0; j_0 < taget_string2.length; j_0++) {
                                if (j_0 < j_s)
                                    return_string += taget_string2[j_0] + arrCalcs[ii];
                                else {
                                    taget_string3 += taget_string2[j_0];

                                    if (j_0 != (taget_string2.length - 1))
                                        taget_string3 += arrCalcs[ii];
                                }
                            }//for end

                            var j = 1;
                            for (var j_1 = 0; j_1 < taget_string3.length; j_1++) {

                                switch (taget_string3.substr(j_1, 1)) {
                                    case "(":
                                        j++;
                                        return_string += taget_string3.substr(j_1, 1);

                                        break;
                                    case ")":
                                        j--;
                                        if (j == 0) {
                                            return_string += ",0)" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                            j_1 = taget_string3.length;
                                        }
                                        else
                                            return_string += taget_string3.substr(j_1, 1);
                                        break;
                                    default:
                                        return_string += taget_string3.substr(j_1, 1);
                                }
                            }
                            taget_string = return_string;
                        }
                    }
                }
                result.DEFAULT_CALC_VAL = return_string;
                result.DEFAULT_CALC_OPEN_VAL = defaultCalcOpenVal;
            }
        }

        return result;
    },
});
