window.__define_resource && __define_resource("LBL19664","MSG10328","LBL11065","MSG06891","MSG02237","MSG05919","MSG05280","LBL19665","MSG05282","MSG10227","LBL02874","LBL02878","LBL00387","LBL00597","LBL90361","LBL02502","LBL06768","LBL09629","LBL01595","LBL03176","LBL04959","LBL93200","MSG05888","LBL02935","LBL02936","LBL09351","LBL00642","LBL10422","LBL03895","LBL02728","LBL02732","LBL08272","LBL01556","LBL02283","LBL02288","LBL01398","LBL10421","LBL01412","LBL02419","LBL02393","LBL03166","LBL02506","LBL02531","LBL03119","LBL04057","LBL01054","LBL93036","LBL02869","LBL02870","LBL01780","LBL05606","LBL01782","LBL11361","LBL90103","LBL11087","LBL10991","LBL11559","LBL12588","LBL04178","LBL12778","LBL03146","LBL00178","LBL06069","LBL01563","LBL93353","LBL03092","LBL00878","LBL02348","LBL00850","LBL03830","LBL00449","LBL00497","LBL08060","LBL09833","LBL01632","LBL20093","LBL20094","LBL02207","LBL06293","LBL17916","LBL07497","LBL12812","LBL02173","LBL00793","LBL04623","LBL01881","LBL10423","LBL02736","LBL00619","LBL06426","LBL03311","LBL09022","LBL00078","LBL01486","LBL00272","LBL03478","LBL06218","LBL08493","LBL01984","LBL00615","LBL04593","LBL02871","LBL03034","LBL01381","LBL00495","LBL06524","LBL06525","LBL01501","LBL01478","LBL03017","LBL00834","LBL01151","LBL11225","LBL12592","LBL20085","BTN00276","BTN00133","BTN00008");
/****************************************************************************************************
1. Create Date : xxxx.xx.xx
2. Creator     : xxx
3. Description : xxx
4. Precaution  :
5. History     : 2019.01.04 (Ngo Thanh Lam) - Modified Link Url for Internal Use List menu
                 2019.01.04 (LuongAnhDuy) : A19_01521 - 거래처삭제시 삭제불가코드에서 2.0양식 연결되는메뉴 수정
                 2020.07.03 (NgocHan) A20_03106 Appy 3.0 :  change URL for menu Link to Online Store Item Code
                 2020.10.27 (Donghyuk) A20_02953 근태DB분리
                 2020.12.03 (Hao) A20_04998 - 기초등록공통화-관리번호등록
                 2020.12.15 (PhiTa) A20_05813 - 기초등록공통화-외화등록
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "NoticeNonDeletable", {

    MeargeSetCount: null,
    SplitSetCount: null,
    MeargeArrayData: null,

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this.ListData = $.parseJSON(this.datas);
        this._super.render.apply(this);

        this.initConfig();
    },


    initProperties: function () {
        this.MeargeSetCount = [],
            this.SplitSetCount = [],
            this.MeargeArrayData = [];

    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        var title = "";

        if (this.isUpdateYn) {
            title = ecount.resource.LBL19664;
        } else if (this.isChangeYn) {
            title = ecount.resource.MSG10328;
        } else {
            title = ecount.resource.LBL11065
        }
        header.setTitle(title);
        //header.setTitle("삭제불가코드");
        header.notUsedBookmark();
    },

    //데이터 병합에 필요한 변수 세팅
    initConfig: function () {
        var _self = this;
        var PreName = "", MergeCount = 0, SplitCount = 1;
        var tmpMergeCount = [], tmpSplitCount = [];

        if (this.MENU_CODE === "AccountCode")
            this.ListData = this.ListData.filter(function (item) { return (!$.isEmpty(item.ERR_MSG) || item.CHECK_GUBUN === "BANKACCOUNT" || item.CHECK_GUBUN === "CHARTACC"); });

        $.each(this.ListData, function (idx, item) {
            if (idx != 0) {
                if (PreName != item.CHECK_CODE) {
                    PreName = item.CHECK_CODE;
                    MergeCount = MergeCount + SplitCount;
                    tmpMergeCount.push(MergeCount);
                    tmpSplitCount.push(SplitCount);
                    SplitCount = 1;
                } else {
                    SplitCount++;
                }
                if (idx == _self.ListData.length - 1) {
                    tmpSplitCount.push(SplitCount);
                }
            }
            else {
                PreName = item.CHECK_CODE;
                tmpMergeCount.push(MergeCount);
            }
        });

        this.SplitSetCount = tmpSplitCount;
        this.MeargeSetCount = tmpMergeCount;
    },

    onInitContents: function (contents) {     
        
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();

        var leftHtml = "";
        var menuName = this.GetMenuName(this.MENU_CODE);        
        //if (this.MENU_CODE !== "AccountCode")
            this.setRowDataMerge(); //grid Row Merge            
            if (this.MENU_CODE === 'ContractItem') {
                leftHtml = ecount.resource.MSG06891;
            } else if (this.MENU_CODE === 'AD_TypeCode') {
                leftHtml = ecount.resource.MSG02237;
            } else {
                var msg = this.isChangeYn ? ecount.resource.MSG05919 : ecount.resource.MSG05280;

                leftHtml = "<span style=' font-weight: bold'>" + String.format(this.isUpdateYn ? ecount.resource.LBL19665 : ecount.resource.MSG05282, menuName) + "</span>"
                toolbar.addLeft(ctrl.define("widget.label", "warning").label(String.format(this.isUpdateYn ? ecount.resource.MSG10227 : msg, menuName)).useHTML()).end();
            }
        
        grid.setRowData(this.ListData);
        if (this.MENU_CODE == "TrackingNo")
            grid.setKeyColumn(['CHECK_CODE', 'CHECK_GUBUN', 'SLIP_DATE']);
        else if (this.MENU_CODE !== "AccountCode")
            grid.setKeyColumn(['CHECK_CODE', 'CHECK_GUBUN']);        
        else
            grid.setKeyColumn(['CHECK_CODE', 'CHECK_GUBUN', 'ERR_MSG']);

        if (this.MENU_CODE === 'ContractItem') {
            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL02874, width: '130' },
                { propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL02878, width: '170' },
                { propertyName: 'CHECK_CNT', id: 'CHECK_CNT', title: ecount.resource.LBL00387, width: '150', align: 'right' }
            ])
        }
        else if (this.MENU_CODE === 'AD_TypeCode') {
            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL02874, width: '130' },
                { propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL02878, width: '170' },
                { propertyName: 'CHECK_CNT', id: 'CHECK_CNT', title: ecount.resource.LBL00387, width: '150', align: 'right' }
            ])
        }

        else if (this.MENU_CODE === 'TrackingNo') {

            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL00597, width: '130' },
                { propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL90361, width: '170' },
                { propertyName: 'SLIP_DATE', id: 'SLIP_DATE', title: ecount.resource.LBL02502, width: '150', align: 'left' }
            ])
                .setCustomRowCell('SLIP_DATE', this.setGridDisplayDateColumn.bind(this))                 // 파일관리
        } else if (this.MENU_CODE === "PaidLeaveCode" || this.MENU_CODE === "TimeCode") {
            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL02874, width: '130' },
                { propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL02878, width: '170' },
                { propertyName: 'CHECK_GUBUN', id: 'CHECK_GUBUN', title: ecount.resource.LBL06768, width: '140' }, //자료
                { propertyName: 'CHECK_CNT', id: 'CHECK_CNT', title: ecount.resource.LBL00387, width: '100', align: 'right' } //건수
            ]);
        } else if (this.MENU_CODE === "AccountCode" || this.MENU_CODE === "ForeignCurrencyCode") {
            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL02874, width: '100', align: 'center' },
                //{ propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL02878, width: '170' },
                { propertyName: 'CHECK_GUBUN', id: 'CHECK_GUBUN', title: ecount.resource.LBL09629, width: '300' } //자료
            ]);
        } else if (this.MENU_CODE === "CardComment") {
            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL01595, width: '100', align: 'center' },
                { propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL03176, width: '170' },
                { propertyName: 'CHECK_GUBUN', id: 'CHECK_GUBUN', title: ecount.resource.LBL06768, width: '140' } //자료
            ]);
        } else if (this.MENU_CODE === "EmployeeCode" && this.isChangeYn) {
            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL04959, width: '130' },
                { propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL01595, width: '170' },
                { propertyName: 'CHECK_GUBUN', id: 'CHECK_GUBUN', title: ecount.resource.LBL06768, width: '140' } //자료
            ]);
        } else {
            grid.setColumns([
                { propertyName: 'CHECK_CODE', id: 'CHECK_CODE', title: ecount.resource.LBL02874, width: '130' },
                { propertyName: 'CODE_NAME', id: 'CODE_NAME', title: ecount.resource.LBL02878, width: '170' },
                { propertyName: 'CHECK_GUBUN', id: 'CHECK_GUBUN', title: ecount.resource.LBL06768, width: '250' } //자료
            ]);
        }
        grid.setColumnFixHeader(true)
            .setHeaderTopLeftHTML(leftHtml);
        if (this.MENU_CODE !== "AccountCode" && this.MENU_CODE !== "ForeignCurrencyCode")
            grid.setCustomRowCell('CHECK_GUBUN', this.setLinkData.bind(this));
        else
            grid.setCustomRowCell('CHECK_GUBUN', this.setLabelData.bind(this));

        contents.add(toolbar)
            .addGrid("dataGrid", grid);
    },

    //데이터 Merge
    setRowDataMerge: function (e, value) {
        var mergeData = {}, r;
        for (i = 0, j = this.SplitSetCount.length; i < j; i++) {
            mergeData = {};
            r = this.MeargeSetCount[i];
            this.ListData[r]['_MERGE_SET'] = [];
            mergeData['_MERGE_USEOWN'] = true;
            mergeData['_STYLE_USEOWN'] = true;
            mergeData['_ROW_TYPE'] = 'TOTAL';
            mergeData['_MERGE_START_INDEX'] = 0;
            mergeData['_ROWSPAN_COUNT'] = this.SplitSetCount[i];
            this.ListData[r]['_MERGE_SET'].push(mergeData);

            if (this.MENU_CODE !== "AccountCode") {
                mergeData = {};
                r = this.MeargeSetCount[i];
                mergeData['_MERGE_USEOWN'] = true;
                mergeData['_STYLE_USEOWN'] = true;
                mergeData['_ROW_TYPE'] = 'TOTAL';
                mergeData['_MERGE_START_INDEX'] = 1;
                mergeData['_ROWSPAN_COUNT'] = this.SplitSetCount[i];
                this.ListData[r]['_MERGE_SET'].push(mergeData);
            }
        }
    },

    //팝업연결
    setLinkData: function (value, rowData) {
        
        var option = {};
        option.data = this.GetLinkDataInfo(rowData, "TEXT");
        option.controlType = "widget.link";

        if (this.MENU_CODE == "EmployeeCode" && this.isChangeYn) {
            option.controlType = "widget.label";
            return option;
        }


        if (rowData['CHECK_GUBUN'] == "ERROR_MSG")
            option.controlType = "widget.label";

        switch (rowData['CHECK_GUBUN']) {
            case "REST":
                option.event = {
                    'click': function (e, data) {
                        var param = this.GetLinkDataObjParam(data.rowItem);
                        this.openWindow({
                            url: '/ECERP/SVC/EPD/EPD021M',
                            name: ecount.resource.LBL93200,
                            param: { Request: { param } },
                            popupType: false,
                            additional: false
                        });
                    }.bind(this)
                }
                break;

            case "ATTEND":
                option.event = {
                    'click': function (e, data) {
                        var param = this.GetLinkDataObjParam(data.rowItem);
                        this.openWindow({
                            url: '/ECERP/SVC/EPD/EPD021M',
                            name: ecount.resource.LBL93200,
                            param: { Request: { param } },
                            popupType: false,
                            additional: false
                        });
                    }.bind(this)
                }
                break;

            case "CONTRACT":

            case "OM_ORDER":

            case "OM_PROD":

            case "OM_PROD_MAPPING":
                option.event = {
                    'click': function (e, data) {

                        this.openWindow({
                            url: this.GetLinkDataInfo(data.rowItem, "URL"),
                            name: this.GetLinkDataInfo(data.rowItem, "POP"),
                            param: this.GetLinkDataObjParam(data.rowItem),
                            popupType: this.GetLinkDataInfo(data.rowItem, "POPUPTYPE"),
                            additional: false
                        });
                    }.bind(this)

                };
                break;
            case "RECORD_TIME":
                option.event = {
                    'click': function (e, data) {
                        this.openWindow({
                            url: this.GetLinkDataInfo(data.rowItem, "URL"),
                            name: this.GetLinkDataInfo(data.rowItem, "POP"),
                            param: this.GetLinkDataObjParam(data.rowItem),
                            popupType: this.GetLinkDataInfo(data.rowItem, "POPUPTYPE"),
                            additional: false
                        });
                    }.bind(this)
                }
                break;
            default:
                option.event = {
                    'click': function (e, data) {
                        ecount.confirm(ecount.resource.MSG05888, function (status) {
                            if (status == true) {
                                this.openWindow({
                                    url: this.GetLinkDataInfo(data.rowItem, "URL"),
                                    name: this.GetLinkDataInfo(data.rowItem, "POP"),
                                    param: this.GetLinkDataObjParam(data.rowItem),
                                    popupType: this.GetLinkDataInfo(data.rowItem, "POPUPTYPE"),
                                    additional: false
                                });
                            }
                            e.preventDefault();
                        }.bind(this));
                    }.bind(this)
                };
                break;
        }

        return option;
    },

    //팝업연결
    setLabelData: function (value, rowData) {
        var option = {};
        option.data = this.GetLinkDataInfo(rowData, "TEXT");
        option.controlType = "widget.label";
        //switch (rowData['CHECK_GUBUN']) {
        //    case "REST":
        //        option.event = {
        //            'click': function (e, data) {
        //                var param = this.GetLinkDataObjParam(data.rowItem);
        //                this.openWindow({
        //                    url: '/ECERP/SVC/EPD/EPD021M',
        //                    name: ecount.resource.LBL93200,
        //                    param: { Request: { param } },
        //                    popupType: false,
        //                    additional: false
        //                });
        //            }.bind(this)
        //        }
        //        break;

        //    case "ATTEND":
        //        option.event = {
        //            'click': function (e, data) {
        //                var param = this.GetLinkDataObjParam(data.rowItem);
        //                this.openWindow({
        //                    url: '/ECERP/SVC/EPD/EPD021M',
        //                    name: ecount.resource.LBL93200,
        //                    param: { Request: { param } },
        //                    popupType: false,
        //                    additional: false
        //                });
        //            }.bind(this)
        //        }
        //        break;

        //    case "CONTRACT":

        //    case "OM_ORDER":

        //    case "OM_PROD":

        //    case "OM_PROD_MAPPING":
        //        option.event = {
        //            'click': function (e, data) {

        //                this.openWindow({
        //                    url: this.GetLinkDataInfo(data.rowItem, "URL"),
        //                    name: this.GetLinkDataInfo(data.rowItem, "POP"),
        //                    param: this.GetLinkDataObjParam(data.rowItem),
        //                    popupType: this.GetLinkDataInfo(data.rowItem, "POPUPTYPE"),
        //                    additional: false
        //                });
        //            }.bind(this)

        //        };
        //        break;
        //    case "RECORD_TIME":
        //        option.event = {
        //            'click': function (e, data) {
        //                this.openWindow({
        //                    url: this.GetLinkDataInfo(data.rowItem, "URL"),
        //                    name: this.GetLinkDataInfo(data.rowItem, "POP"),
        //                    param: this.GetLinkDataObjParam(data.rowItem),
        //                    popupType: this.GetLinkDataInfo(data.rowItem, "POPUPTYPE"),
        //                    additional: false
        //                });
        //            }.bind(this)
        //        }
        //        break;
        //    default:
        //        option.event = {
        //            'click': function (e, data) {
        //                ecount.confirm(ecount.resource.MSG05888, function (status) {
        //                    if (status == true) {
        //                        this.openWindow({
        //                            url: this.GetLinkDataInfo(data.rowItem, "URL"),
        //                            name: this.GetLinkDataInfo(data.rowItem, "POP"),
        //                            param: this.GetLinkDataObjParam(data.rowItem),
        //                            popupType: this.GetLinkDataInfo(data.rowItem, "POPUPTYPE"),
        //                            additional: false
        //                        });
        //                    }
        //                    e.preventDefault();
        //                }.bind(this));
        //            }.bind(this)
        //        };
        //        break;
        //}

        return option;
    },

    //링크정보 반환
    GetLinkDataInfo: function (rowData, returnType) {
        var linkText;
        var linkUrl;
        var popupName;
        var popupType;
        var returnValue;
        var gubun = rowData.CHECK_GUBUN;
        var strGubunDes = rowData.ERR_MSG;
        switch (gubun) {
            case "SELL":
                linkText = ecount.resource.LBL02935;
                linkUrl = "/ECERP/SVC/ESD/ESD007M";
                popupName = ecount.resource.LBL02936;
                popupType = false;
                break;
            case "BUY":
                linkText = ecount.resource.LBL09351;
                linkUrl = "/ECERP/SVC/ESG/ESG010M";
                popupName = ecount.resource.LBL00642;
                popupType = false;
                break;
            case "PRODUCE":
                linkText = ecount.resource.LBL10422;
                linkUrl = "/ECERP/SVC/ESJ/ESJ010M";
                popupName = ecount.resource.LBL03895;
                popupType = false;
                break;
            case "WHMOVE":
                linkText = ecount.resource.LBL02728;
                linkUrl = "/ECERP/SVC/ESM/ESM002M";
                popupName = ecount.resource.LBL02732;
                popupType = false;
                break;
            case "ISSUE":
                linkText = ecount.resource.LBL08272;
                linkUrl = "/ECERP/SVC/ESJ/ESJ007M";
                popupName = ecount.resource.LBL01556;
                popupType = false;
                break;
            case "SELF":
                linkText = ecount.resource.LBL02283;
                linkUrl = "/ECERP/SVC/ESM/ESM016M";
                popupName = ecount.resource.LBL02288;
                popupType = false;
                break;
            case "BAD":
                linkText = String.format("{0}/{1}", ecount.resource.LBL01398, ecount.resource.LBL10421);
                linkUrl = "/ECERP/SVC/ESM/ESM006M";
                popupName = ecount.resource.LBL01412;
                popupType = false;
                break;
            case "STOCKADJUST":
                linkText = ecount.resource.LBL02419;
                linkUrl = "/ECERP/SVC/ESP/ESP018M";
                popupName = ecount.resource.LBL02393;
                popupType = false;
                break;
            case "INVOICING":
                //linkText = ecount.resource.LBL03166;
                //linkUrl = "/ECMAIN/EBG/EBG001M.aspx",
                //popupName = ecount.resource.LBL02506;
                //popupType = true;

                //test
                linkText = ecount.resource.LBL03166;
                linkUrl = "/ECERP/SVC/EBG/EBG001M"
                popupName = ecount.resource.LBL02506;
                popupType = false;
                break;
            case "BC":
                linkText = ecount.resource.LBL02531;
                linkUrl = "/ECERP/SVC/EGM/EGM002M";
                popupName = ecount.resource.LBL03119;
                popupType = false;
                break;
            case "PAYMENTAGENCY": //결재대행사
                linkText = String.format("{0}({1})", ecount.resource.LBL04057, ecount.resource.LBL01054);
                linkUrl = "/ECERP/Popup.Common/NoticeNonDeletableBankAccount";
                popupName = ecount.resource.LBL93036;
                popupType = false;
                break;
            case "MERCHANTACCOUNT": //카드사
                linkText = String.format("{0}({1})", ecount.resource.LBL02869, ecount.resource.LBL01054);
                linkUrl = "/ECERP/Popup.Common/NoticeNonDeletableBankAccount";
                popupName = ecount.resource.LBL02870;
                popupType = false;
                break;

            case "CREDITCARD": //신용카드
                linkText = String.format("{0}({1})", ecount.resource.LBL01780, ecount.resource.LBL05606);
                linkUrl = "/ECERP/Popup.Common/NoticeNonDeletableBankAccount";
                popupName = ecount.resource.LBL01782;
                popupType = false;
                break;
            case "CONTRACT":
                linkText = ecount.resource.LBL11361;
                linkUrl = "/ECERP/EBP/EBP003M";
                popupName = ecount.resource.LBL90103;
                popupType = false;
                break;
            case "OM_ORDER": // 오픈마켓 주문관리
                linkText = ecount.resource.LBL11087;
                linkUrl = "/ECERP/ESK/ESK003M";
                popupName = ecount.resource.LBL10991;
                popupType = false;
                break;
            case "OM_PROD": // 오픈마켓 상품관리
                linkText = ecount.resource.LBL11559;
                linkUrl = "/ECERP/SVC/ESK/ESK011M";
                popupName = ecount.resource.LBL11559;
                popupType = false;
                break;
            case "OM_PROD_MAPPING": // 오픈마켓 상품연결
                linkText = ecount.resource.LBL12588;
                linkUrl = "/ECERP/SVC/ESK/ESK002M";
                popupName = ecount.resource.LBL12588;
                popupType = false;
                break;
            case "REST": // Paid Leave
                linkText = ecount.resource.LBL04178;
                linkUrl = "/ECERP/SVC/EPD/EPD021M";
                popupName = ecount.resource.LBL93200;
                popupType = false;
                break;
            case "ATTEND": // Attendance
                linkText = ecount.resource.LBL04178;
                linkUrl = "/ECERP/SVC/EPD/EPD021M";
                popupName = ecount.resource.LBL93200;
                popupType = false;
                break;
            case "RECORD_TIME": // Paid Leave
                linkText = ecount.resource.LBL12778;
                linkUrl = "/ECERP/SVC/EPA/EPA030M";
                popupName = ecount.resource.LBL12778;
                popupType = false;
                break;
            case "BANKACCOUNT":
                //test
                linkText = String.format("{0} > {1}", ecount.resource.LBL03146, ecount.resource.LBL02506);
                linkUrl = "/ECERP/EBA/EBA005M";
                popupName = ecount.resource.LBL02506;
                popupType = false;
                break;
            case "BOM":
                linkText = ecount.resource.LBL00178;
                linkUrl = "/ECERP/ESA/ESA009P_16_01";
                popupName = ecount.resource.LBL00178;
                popupType = false;
                break;
            case "SERIALLOTNO":
                //test
                linkText = ecount.resource.LBL06069;
                linkUrl = "/ECERP/SVC/ESQ/ESQ202M";
                popupName = ecount.resource.LBL06069;
                popupType = false;
                break;
            case "CONSUME":
                //test
                linkText = ecount.resource.LBL01563;
                linkUrl = "/ECERP/SVC/ESJ/ESJ010M";
                popupName = ecount.resource.LBL93353;
                popupType = false;
                break;
            case "JOURNAL":
                //test
                var _strmsg = ecount.resource.LBL03092;
                var _strResource = ecount.resource[strGubunDes];
                if (strGubunDes.indexOf("LBL14") > -1)
                    _strmsg = ecount.resource.LBL00878;
                else if (strGubunDes === "00001") {
                    _strResource = "00001";
                    _strmsg = ecount.resource.LBL02348;
                }

                linkText = String.format("{0} > {1}", _strmsg, _strResource);
                linkUrl = "";
                popupName = _strmsg;
                popupType = false;
                break;
            case "SETUP":
                switch (strGubunDes) {
                    case "20"://신용카드등록
                        linkText = String.format("{0} > {1}", ecount.resource.LBL00850, ecount.resource.LBL01782);
                        linkUrl = "";
                        popupName = ecount.resource.LBL00850;
                        popupType = false;
                        break;
                    case "30":  //통장계좌등록
                        linkText = String.format("{0} > {1}", ecount.resource.LBL00850, ecount.resource.LBL03830);
                        linkUrl = "";
                        popupName = ecount.resource.LBL00850;
                        popupType = false;
                        break;
                    case "15":  //카드사등록
                        linkText = String.format("{0} > {1}", ecount.resource.LBL00850, ecount.resource.LBL02870);
                        linkUrl = "";
                        popupName = ecount.resource.LBL00850;
                        popupType = false;
                        break;
                    case "14":  //결제대행사등록
                        linkText = String.format("{0} > {1}", ecount.resource.LBL00850, ecount.resource.LBL00449);
                        linkUrl = "";
                        popupName = ecount.resource.LBL00850;
                        popupType = false;
                        break;
                }
                break;
            case "CHARTACC":
                //test
                linkText = String.format("{0} > {1}", ecount.resource.LBL00497, ecount.resource.LBL08060);
                linkUrl = "";
                popupName = ecount.resource.LBL00497;
                popupType = false;
                break;
            case "OTHERACC":
                //test
                linkText = ecount.resource.LBL09833;
                linkUrl = "";
                popupName = ecount.resource.LBL00497;
                popupType = false;
                break;
            case "GBusinessNo":
                linkText = ecount.resource.LBL01632;
                linkUrl = "/ECERP/SVC/ESA/ESA001M";
                popupName = ecount.resource.LBL01632;
                popupType = false;
                break;
            case "CSID":
                linkText = "CSID";
                linkUrl = "/ECERP/SVC/EMP/EMP002M";
                popupName = "CSID";
                popupType = false;
                break;
            case "BOR":
                linkText = ecount.resource.LBL20093;
                linkUrl = "/ECERP/SVC/ESJ/ESJ042M";
                popupName = ecount.resource.LBL20094;
                popupType = false;
                break;
            case "EMP_EXIST1":
                linkText = ecount.resource.LBL02207;
                break;
            case "EMP_EXIST2":
                linkText = ecount.resource.LBL06293;
                break;
            case "EMP_EXIST3":
                linkText = ecount.resource.LBL17916;
                break;
            case "EMP_EXIST4":
                linkText = ecount.resource.LBL07497;
                break;
            case "EMP_EXIST5":
                linkText = ecount.resource.LBL12812;
                break;
            case "EMP_EXIST6":
                linkText = ecount.resource.LBL02173;
                break;
            case "EMP_EXIST7":
                linkText = ecount.resource.LBL00793;
                break;
            case "EMP_EXIST8":
                linkText = ecount.resource.LBL04623;
                break;
            case "EMP_EXIST9":
                linkText = ecount.resource.LBL01881;
                break;

                break;                
            case "ERROR_MSG":
                linkText = rowData.Message ? rowData.Message : ecount.common.getMessage(rowData.ERR_TYPE, ecount.config).MESSAGE;
                if ($.isEmpty(rowData["Param"]) == false) {                
                    var errorData = ecount.common.getMessage(rowData["Code"], ecount.config, rowData["Param"]["SubMessage"]);
                    linkText = errorData.MESSAGE.RESOURCE || errorData.MESSAGE;
                }
                break;
            default:
                linkText = ecount.resource.LBL02935;
                linkUrl = "";
                popupName = "List";
                popupType = true;
                break;
        }

        if (returnType == "TEXT") {
            //linkText = String.format(ecount.resource.LBL10423, linkText, rowData.CHECK_CNT[idx]); //{0} ({1}건)
            linkText = linkText; //{0} ({1}건)
            returnValue = linkText;
        }
        else if (returnType == "URL") {
            returnValue = linkUrl;
        }
        else if (returnType == "POPUPTYPE") {
            returnValue = popupType;
        }
        else {
            returnValue = popupName;
        }

        return returnValue;
    },

    //링크연결시 검색조건값 설정
    GetLinkDataObjParam: function (rowData) {

        var returnParam = {};
        var gubun = rowData.CHECK_GUBUN;
        var checkCode = rowData.CHECK_CODE;
        var checkCodeName = rowData.CODE_NAME;
        var custIdx = rowData.LINK_IDX;
        var nowDate = new Date().format("yyyyMMdd");
        var fromDate = String.format("{0}0101", (Number(nowDate.substr(0, 4)) - 2));
        var toDate = new Date().format("yyyy1231");
        var menuCode = this.MENU_CODE;
        var whCd = '', whDes = '',
            itemCd = '', itemDes = '',
            pjtCd = '', pjtDes = '',
            siteCd = '', siteDes = '',
            gyeCd = '', gyeDes = '',
            empCd = '', empDes = '',
            prodCd = '', prodDes = '',
            custCd = '', custDes = ''

        if (menuCode === "LocationCode") {
            whCd = checkCode;
            whDes = checkCodeName;
        } else if (menuCode === "MgmtFieldCode") {
            itemCd = checkCode;
            itemDes = checkCodeName;
        } else if (menuCode === "Project") {
            pjtCd = checkCode;
            pjtDes = checkCodeName;
            checkCode = "";
            checkCodeName = "";
        } else if (menuCode === "Dept") {
            siteCd = checkCode;
            siteDes = checkCodeName;
            checkCode = "";
            checkCodeName = "";
        } else if (menuCode === "AccountCode") {
            gyeCd = checkCode;
            gyeDes = checkCodeName;
        } else if (menuCode === "EmployeeCode") {
            empCd = checkCode;
            empDes = checkCodeName;
        } else if (menuCode === "Item") {
            prodCd = checkCode;
            prodDes = checkCodeName;
        } else if (menuCode === "Customer") {
            custCd = checkCode;
            custDes = checkCodeName;
        } else if (menuCode === "CreditCard") {
            custCd = checkCode;
            custDes = checkCodeName;
        } else if (menuCode === "BankAccount") {
            custCd = checkCode;
            custDes = checkCodeName;
        } else if (menuCode === "MerchantAccount") {
            custCd = checkCode;
            custDes = checkCodeName;
        } else if (menuCode === "PaymentAgency") {
            custCd = checkCode;
            custDes = checkCodeName;
        } else if (menuCode === "ContractUnit") {
            unit = checkCode;
            unit_des = checkCodeName;
        }


        switch (gubun) {
            case "SELL":
                //판매
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "tabConfirm",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    WH_CD: whCd,
                    WH_DES: whDes,
                    ITEM_CD: itemCd,
                    ITEM_DES: itemDes,
                    PJT_CD: pjtCd,
                    PJT_DES: pjtDes,
                    EMP_CD: empCd,
                    EMP_DES: empDes,
                    PROD_CD: prodCd,
                    PROD_DES: prodDes,
                    CUST: custCd,
                    CUST_DES: custDes,
                    isShowBtnClose: true,
                    hidSearchXml: ''
                    //isSimpleDate : true
                }
                break;
            case "BUY":
                //구매
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "Confirmed",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    WH_CD: whCd,
                    WH_DES: whDes,
                    ITEM_CD: itemCd,
                    ITEM_DES: itemDes,
                    PJT_CD: pjtCd,
                    PJT_DES: pjtDes,
                    EMP_CD: empCd,
                    EMP_DES: empDes,
                    PROD_CD: prodCd,
                    PROD_DES: prodDes,
                    CUST: custCd,
                    CUST_DES: custDes,
                    isShowBtnClose: true,
                    hidSearchXml: '',
                }

                // siteCd = '', siteDes = '',
                // gyeCd = '', gyeDes = '',
                break;
            case "PRODUCE":
                //생산입고
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "tabConfirm",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    WH_CD: whCd,
                    WH_DES: whDes,
                    ITEM_CD: itemCd,
                    ITEM_DES: itemDes,
                    PJT_CD: pjtCd,
                    PJT_DES: pjtDes,
                    EMP_CD: empCd,
                    EMP_DES: empDes,
                    PROD_CD: prodCd,
                    PROD_DES: prodDes,
                    CUST: custCd,
                    CUST_DES: custDes,
                    isShowBtnClose: true,
                    hidSearchXml: '',

                }

                break;
            case "WHMOVE":
                //창고이동
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    isShowBtnClose: true,
                    Request: {
                        ActiveTab: "tabAll",
                        BASE_DATE_FROM: fromDate,
                        BASE_DATE_TO: toDate,
                        WH_CD: whCd,
                        WH_DES: whDes,
                        ITEM_CD: itemCd,
                        ITEM_DES: itemDes,
                        PJT_CD: pjtCd,
                        PJT_DES: pjtDes,
                        EMP_CD: empCd,
                        EMP_DES: empDes,
                        PROD_CD: prodCd,
                        PROD_DES: prodDes,
                        hidSearchXml: ''
                    }
                }

                break;
            case "ISSUE":
                //생산불출

                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "Confirmed",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    WH_CD: whCd,
                    WH_DES: whDes,
                    ITEM_CD: itemCd,
                    ITEM_DES: itemDes,
                    PJT_CD: pjtCd,
                    PJT_DES: pjtDes,
                    EMP_CD: empCd,
                    EMP_DES: empDes,
                    PROD_CD: prodCd,
                    PROD_DES: prodDes,
                    isShowBtnClose: true,
                    hidSearchXml: ''
                }

                break;
            case "SELF":
                //자가사용
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "Confirmed",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    WH_CD: whCd,
                    WH_DES: whDes,
                    ITEM_CD: itemCd,
                    ITEM_DES: itemDes,
                    PJT_CD: pjtCd,
                    PJT_DES: pjtDes,
                    EMP_CD: empCd,
                    EMP_DES: empDes,
                    PROD_CD: prodCd,
                    PROD_DES: prodDes,
                    isShowBtnClose: true,
                    hidSearchXml: ''
                }

                break;
            case "BAD":
                //불량
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    isShowBtnClose: true,
                    Request: {
                        ActiveTab: "tabAll",
                        BASE_DATE_FROM: fromDate,
                        BASE_DATE_TO: toDate,
                        WH_CD: whCd,
                        WH_DES: whDes,
                        ITEM_CD: itemCd,
                        ITEM_DES: itemDes,
                        PJT_CD: pjtCd,
                        PJT_DES: pjtDes,
                        EMP_CD: empCd,
                        EMP_DES: empDes,
                        PROD_CD: prodCd,
                        PROD_DES: prodDes,
                        CUST: custCd,
                        CUST_DES: custDes,
                        hidSearchXml: ''
                    }
                }

                break;
            case "STOCKADJUST":
                //재고조정
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    Request:{
                        BASE_DATE_FROM: fromDate,
                        BASE_DATE_TO: toDate,
                        WH_CD: whCd,
                        WH_DES: whDes,
                        ITEM_CD: itemCd,
                        ITEM_DES: itemDes,
                        PJT_CD: pjtCd,
                        PJT_DES: pjtDes,
                        EMP_CD: empCd,
                        EMP_DES: empDes,
                        PROD_CD: prodCd,
                        PROD_DES: prodDes,
                        CUST: custCd,
                        CUST_DES: custDes,
                        isShowBtnClose: true,
                        hidSearchXml: ''
                    }
                }

                break;
            case "INVOICING":
                //회계전표
                //returnParam = {
                //    width: ecount.infra.getPageWidthFromConfig(),
                //    height: 600,
                //    hidSearchXml: '<root><ddlSYear><![CDATA[' + fromDate.substr(0, 4) + ']]></ddlSYear><ddlSMonth><![CDATA[01]]></ddlSMonth><txtSDay><![CDATA[01]]></txtSDay><ddlEYear><![CDATA[' + toDate.substr(0, 4) + ']]></ddlEYear><ddlEMonth><![CDATA[12]]></ddlEMonth><txtEDay><![CDATA[31]]></txtEDay><txtSCustCd><![CDATA[' + checkCode + ']]></txtSCustCd><txtSCustDes><![CDATA[' + checkCodeName + ']]></txtSCustDes><EtcVal><![CDATA[0]]></EtcVal><txtSiteCd><![CDATA[' + siteCd + ']]></txtSiteCd><txtSiteDes><![CDATA[' + siteDes + ']]></txtSiteDes><txtPjtCd><![CDATA[' + pjtCd + ']]></txtPjtCd><txtPjtDes><![CDATA[' + pjtDes + ']]></txtPjtDes><ddlSFirstInsertYear></ddlSFirstInsertYear><ddlSFirstInsertMonth></ddlSFirstInsertMonth><txtSFirstInsertDay></txtSFirstInsertDay><ddlEFirstInsertYear></ddlEFirstInsertYear><ddlEFirstInsertMonth></ddlEFirstInsertMonth><txtEFirstInsertDay></txtEFirstInsertDay><ddlSLastUpdatedYear></ddlSLastUpdatedYear><ddlSLastUpdatedMonth></ddlSLastUpdatedMonth><txtSLastUpdatedDay></txtSLastUpdatedDay><ddlELastUpdatedYear></ddlELastUpdatedYear><ddlELastUpdatedMonth></ddlELastUpdatedMonth><txtELastUpdatedDay></txtELastUpdatedDay><ddlLastHistory></ddlLastHistory><txtTreeSiteCd><![CDATA[]]></txtTreeSiteCd><txtTreeSiteNm><![CDATA[]]></txtTreeSiteNm><cbSubTreeSite><![CDATA[]]></cbSubTreeSite><txtTreeCustCd><![CDATA[]]></txtTreeCustCd><txtTreeCustNm><![CDATA[]]></txtTreeCustNm><cbSubTreeCust><![CDATA[]]></cbSubTreeCust><txtSGyeCode></txtSGyeCode><txtSGyeDes></txtSGyeDes><txtEGyeCode></txtEGyeCode><txtEGyeDes></txtEGyeDes><txtAccCase></txtAccCase><hidAccCaseCd><![CDATA[9999]]></hidAccCaseCd><txtBillNo></txtBillNo><txtBillName></txtBillName><SMoney></SMoney><EMoney></EMoney><sub_code></sub_code><Remark></Remark><WID></WID><WName></WName><chkJournal><![CDATA[0]]></chkJournal><FWID></FWID><FWName></FWName><M_Page><![CDATA[1]]></M_Page><M_SlipType><![CDATA[]]></M_SlipType><M_TradeGubun><![CDATA[]]></M_TradeGubun><FirstFlag><![CDATA[N]]></FirstFlag><M_Pgm></M_Pgm><M_Date></M_Date><M_No></M_No><chkJGubun><![CDATA[0]]></chkJGubun><M_Type></M_Type><M_TrxSer></M_TrxSer><M_EditFlag><![CDATA[M]]></M_EditFlag><M_Uid></M_Uid><M_SerNo></M_SerNo><M_RptGubun2></M_RptGubun2><M_TabFlag><![CDATA[tabAll]]></M_TabFlag><M_IngFlag></M_IngFlag><txtDocNo></txtDocNo></root>'
                //}

                //test
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "tabComplete",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    CUST: custCd,
                    CUST_DES: custDes,
                    GYE_CODE: gyeCd,
                    GYE_DES: gyeDes,    //계정
                    site_Cd: siteCd,
                    site_Des: siteDes,  //부서
                    PJT_CD: pjtCd,
                    PJT_DES: pjtDes,
                    IsPopup: true,
                    isShowBtnClose: true,
                }
                break;

            case "PAYMENTAGENCY": //결재대행사
                returnParam = {
                    width: 200,
                    height: 100,
                    JOIN_NO: checkCode,
                    MENU_CODE: gubun
                }
                break;

            case "BC": //명함
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    Request: {
                        Data: {
                            Key: {
                                CUST_IDX: custIdx 
                            }
                        },
                        EditMode:"02"
                    },
                    JOIN_NO: checkCode,
                    MENU_CODE: gubun
                }
                break;

            case "MERCHANTACCOUNT": //카드사
                returnParam = {
                    width: 200,
                    height: 100,
                    JOIN_NO: checkCode,
                    MENU_CODE: gubun
                }
                break;
            case "CREDITCARD": //신용카드
                returnParam = {
                    width: 200,
                    height: 100,
                    JOIN_NO: checkCode,
                    MENU_CODE: gubun
                }
                break;
            case "CONTRACT": //신용카드
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "tabAll",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    UNIT: unit,
                    UNIT_DES: unit_des,
                    hidSearchXml: ''
                }
                break;
            case "OM_ORDER": //오픈마켓 주문관리
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    PayDateFrom: fromDate.toDate().format("yyyy-MM-dd"),
                    PayDateTo: toDate.toDate().format("yyyy-MM-dd"),
                    OpenMarketCd: checkCode,
                    OpenMarketNM: checkCodeName
                }
                break;
            case "OM_PROD": //오픈마켓 상품관리
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    WriteDateFrom: fromDate.toDate().format("yyyy-MM-dd"),
                    WriteDateTo: toDate.toDate().format("yyyy-MM-dd"),
                    OpenMarketCd: checkCode,
                    OpenMarketNM: checkCodeName
                }
                break;
            case "OM_PROD_MAPPING": //오픈마켓 상품연결
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    OpenMarketCd: checkCode,
                    OpenMarketNM: checkCodeName
                }
                break;
            case "REST": //오픈마켓 상품연결
                returnParam = {
                    width: 580,
                    height: 400,
                    CodeList: checkCode,
                    NameList: checkCodeName,
                    fromPage: 'EPA032M'
                }
                break;

            case "ATTEND": //오픈마켓 상품연결
                returnParam = {
                    width: 580,
                    height: 400,
                    CodeList: checkCode,
                    NameList: checkCodeName,
                    fromPage: 'EPA030M'
                }
                break;
            case "SERIALLOTNO": //오픈마켓 상품연결
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 400,
                    PROD_CD: prodCd,
                    PROD_DES: prodDes
                };
                break;
            case "BOM": //BOM
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 400,
                    BOM_CD: prodCd
                };
                break;
            case "CONSUME": //오픈마켓 상품연결
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 400,
                    PROD_CD: prodCd,
                    PROD_DES: prodDes
                };
                break;
            case "GBusinessNo":
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 400,
                    Request: {
                        Data: {
                            G_BUSINESS: checkCode,
                            G_BUSINESS_TYPE: 2,
                            isFromNonDeletable: true
                        }
                    },
                };
                break;
            case "CSID":
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 400,
                    CustCd: checkCode,
                    CustDes: checkCodeName
                };
            case "BOR":
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    PRDN_JOB_CD: checkCode,
                    PRDN_JOB_NM: checkCodeName
                };
                break;
            default:
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(),
                    height: 600,
                    actTab: "tabConfirm",
                    baseDateFrom: fromDate,
                    baseDateTo: toDate,
                    WH_CD: whCd,
                    WH_DES: whDes,
                    hidSearchXml: ''
                }
                break;
        }
        returnParam = $.extend(returnParam, { isSimpleDate: true, IsFromErrorNotice: true }); //isSimpleDate : true
        return returnParam;
    },

    //메뉴명 반환
    GetMenuName: function () {
        var menuCode = this.MENU_CODE;
        var returnName = "";
        switch (menuCode) {

            case "LocationCode":
                returnName = ecount.resource.LBL02736;    //창고코드
                break;
            case "MgmtFieldCode":
                returnName = ecount.resource.LBL00619;    //관리항목코드
                break;
            case "PriceLevelGroup":
                returnName = ecount.resource.LBL06426;    //특별단가그룹코드
                break;
            case "PricebyItem":
                returnName = ecount.resource.LBL03311;    //품목별
                break;
            case "PricebyItemGroup":
                returnName = ecount.resource.LBL09022;    //품목그룹별
                break;
            case "EmployeePic":
                returnName = ecount.resource.LBL00078;    //사원(담당) (LBL01486 : 사원(담당)코드)
                break;
            case "AS_StatusCode":
                returnName = ecount.resource.LBL00272;    //AS 접수진행단계코드
                break;
            case "AS_TypeCode":
                returnName = ecount.resource.LBL03478;    //AS 수리유형코드
                break;
            case "InternalUseTypeCode":
                returnName = ecount.resource.LBL06218;    //자가사용유형코드
                break;
            case "DefectTypeCode":
                returnName = ecount.resource.LBL08493;    //불량유형코드
                break;
            case "ForeignCurrencyCode":
                returnName = ecount.resource.LBL01984;    //외화코드
                break;
            case "SerialLotNo":
                returnName = "";    //시리얼
                break;
            case "AddFieldCode":
                returnName = String.format(ecount.resource.LBL00615, "");    //추가항목(추가항목{0})
                break;
            case "CreditCard":
                returnName = ecount.resource.LBL01780;    //신용카드
                break;
            case "BankAccount":
                returnName = ecount.resource.LBL04593;    //통장계좌
                break;
            case "MerchantAccount":
                returnName = ecount.resource.LBL02869;    //카드사 (LBL02871 : 카드사코드)
                break;
            case "PaymentAgency":
                returnName = ecount.resource.LBL04057;    //결제대행사
                break;
            case "Project":
                returnName = ecount.resource.LBL03034;    //프로젝트코드
                break;
            case "Dept":
                returnName = ecount.resource.LBL01381;    //부서코드
                break;
            case "AccountCode":
                returnName = ecount.resource.LBL00495;    //계정코드
                break;
            case "TimeCode":
                returnName = ecount.resource.LBL06524;    //근태코드
                break;
            case "PaidLeaveCode":
                returnName = ecount.resource.LBL06525;    //휴가코드
                break;
            case "EmployeeCode":
                returnName = this.isChangeYn ? ecount.resource.LBL01501 : ecount.resource.LBL01478;    //사원
                break;
            case "Taxpayer":
                returnName = "";    //소득자
                break;
            case "Item":
                returnName = ecount.resource.LBL03017;    //품목코드
                break;
            case "Customer":
                returnName = ecount.resource.LBL00834;    //거래처코드
                break;
            case "CardComment":
                returnName = ecount.resource.LBL01151;    //명함
                break;
            case "ContractItem":
                returnName = ecount.resource.LBL11225;    // Contract Item
                break;
            case "Openmarket":
                returnName = ecount.resource.LBL12592;    // Openmarket Code
                break;
            case "PrdnJobCode":
                returnName = ecount.resource.LBL20085;    // 작업코드
                break;
            default:
                returnName = ecount.resource.LBL02874;    //코드
                break;
        }

        return returnName;

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        if (this.confirmMode) {
            toolbar
                .addLeft(ctrl.define("widget.button", "confirm").label(this.resource.BTN00276))
                .addLeft(ctrl.define("widget.button", "cancel").label(this.resource.BTN00133));
        } else {
            toolbar
                .attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
        }
        

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {

    },

    onFooterConfirm: function () {
        this.sendMessage(this, { 
            data: { status: true },
            callback: function () {
                this.close();
            }.bind(this)
        });
    },

    onFooterCancel: function () {
        this.sendMessage(this, { 
            data: { status: false },
            callback: function () {
                this.close();
            }.bind(this)
        });
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    /**********************************************************************
   *  기능 처리
   **********************************************************************/
    /** 
    *  grid 날짜 컬럼 
    **/
    setGridDisplayDateColumn: function (value, rowItem) {
        var option = {};
        option.controlType = "widget.label";
        option.data = (value != null && value != '') ? ecount.infra.getECDateFormat('DATE10', false, value.toDate()) : '';
        return option;
    },
});