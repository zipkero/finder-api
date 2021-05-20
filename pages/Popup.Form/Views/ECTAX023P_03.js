window.__define_resource && __define_resource("LBL07157","LBL16365","LBL01335","LBL01255","LBL00703","LBL01519","LBL02853","LBL18546","LBL14861","LBL14862","LBL01419","LBL07154","LBL07155","LBL03614","LBL14859","LBL14860","LBL16366","BTN00008","LBL01332","LBL01328","LBL01192","LBL01193","LBL01042","LBL19792","LBL00733","LBL00736","LBL02230","LBL04799","LBL01225","LBL06763","LBL00723","LBL06761","LBL14675","LBL08033","LBL14891","LBL14898","LBL11306","LBL14890","LBL05852","LBL05851","LBL04831","LBL02468","LBL01209","LBL01770","LBL01155","LBL05310","LBL01382","LBL00732","LBL03448","LBL02337","LBL08134","LBL06157","LBL04921","LBL07582","LBL06767","LBL06755","LBL06756","LBL01747","LBL02832","LBL06613","LBL06614","LBL01746","LBL02155","LBL06759","LBL06760","LBL06762");
/****************************************************************************************************
1. Create Date : 2016-11-01
2. Creator     : 신선미
3. Description : 전자(세금)계산서이력
4. Precaution  :
5. History     : 2020.10.30 (박종국) : A20_02943 - 외부알림1차 (Email,FAX 추가)
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECTAX023P_03", {

    /**********************************************************************
    *  page configuration settings
    **********************************************************************/

    //수정화면에서 보여줄 데이터(history)
    editData: null,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },


    /**********************************************************************
    *  set widget options
    **********************************************************************/
    initProperties: function () {


    },

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        header.notUsedBookmark().disable()
            .setTitle(this.Nation == "TW" ? ecount.resource.LBL07157 : ecount.resource.LBL16365); //전자(세금)계산서이력
    },


    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            setting1 = g.grid(),
            setting2 = g.grid(),
            setting3 = g.grid(),
            columns1 = [],
            columns2 = [],
            columns3 = [],
            res = ecount.resource;

        columns1.push({ propertyName: 'SENDDATE', id: 'SENDDATE', title: res.LBL01335, width: 80, align: "center" });
        columns1.push({ propertyName: 'C_TO_EMAIL', id: 'C_TO_EMAIL', title: res.LBL01255, width: 200, align: "left" });
        columns1.push({ propertyName: 'NTS_TRMS_STAT_CD', id: 'NTS_TRMS_STAT_CD', title: res.LBL00703, width: 80, align: "center" });
        columns1.push({ propertyName: 'AGREE_FLAG', id: 'AGREE_FLAG', title: res.LBL01519, width: 80, align: "center" });
        columns1.push({ propertyName: 'CANCEL', id: 'CANCEL', title: res.LBL02853, width: 50, align: "center" });
        columns1.push({ propertyName: 'LOG', id: 'LOG', title: res.LBL18546, width: 50, align: "center" });

        columns2.push({ propertyName: 'DATE', id: 'DATE', title: res.LBL14861, width: 200, align: "center" });
        columns2.push({ propertyName: 'STATS', id: 'STATS', title: res.LBL14862, width: 120, align: "left" });
        columns2.push({ propertyName: 'BIGO', id: 'BIGO', title: res.LBL01419, width: 200, align: "left" });

        columns3.push({ propertyName: 'WID', id: 'WID', title: res.LBL07154, width: 120, align: "center" });
        columns3.push({ propertyName: 'WDATE', id: 'WDATE', title: res.LBL07155, width: 200, align: "center" });
        columns3.push({ propertyName: 'GB_TYPE', id: 'GB_TYPE', title: res.LBL03614, width: 100, align: "center" });
        columns3.push({ propertyName: 'STATUS_TYPE', id: 'STATUS_TYPE', title: res.LBL01519, width: 100, align: "center" });

        // Mail수신정보
        setting1.setRowData(this.viewBag.InitDatas.LoadData1)
            .setHeaderTopLeftHTML(res.LBL14859)
            .setColumns(columns1)
            .setCustomRowCell("SENDDATE", this.setGridSendDate.bind(this))
            .setCustomRowCell("NTS_TRMS_STAT_CD", this.setGridDataNtsTrmsStatCd.bind(this))
            .setCustomRowCell("AGREE_FLAG", this.setGridDataAgreeFlag.bind(this))
            .setCustomRowCell("CANCEL", this.setGridDataCancel.bind(this))
            .setCustomRowCell("LOG", this.setGridDataLog.bind(this));

        // 진행단계 상세보기 - 대만 예외처리
        setting2.setRowData(this.viewBag.InitDatas.LoadData2)
            .setHeaderTopLeftHTML(res.LBL14860)
            .setColumns(columns2)
            .setRowDataNumbering(true, true)
            .setCustomRowCell("DATE", this.setGridDataDate.bind(this))
            .setCustomRowCell("STATS", this.setGridDataStats.bind(this))
            .setCustomRowCell("BIGO", this.setGridDataBigo.bind(this));
        //
        setting3.setRowData(this.viewBag.InitDatas.LoadData3)
            .setHeaderTopLeftHTML(res.LBL16366) //전표이력
            .setColumns(columns3)
            .setRowDataNumbering(true, true)
            .setCustomRowCell("WDATE", this.setGridDataWDate.bind(this))
            .setCustomRowCell("GB_TYPE", this.setGridDataGbType.bind(this))
            .setCustomRowCell("STATUS_TYPE", this.setGridDataStatusType.bind(this))
            .setEmptyGridMessage(this.IsLastDateShow ? "Last Update : " + this.lastData : "");


        contents.addGrid("dataGrid1" + this.pageID, setting1);
        contents.addGrid("dataGrid2" + this.pageID, setting2);
        contents.addGrid("dataGrid3" + this.pageID, setting3);

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
  *  event listener   ==>  [header, form, footer widget]
  **********************************************************************/
    onLoadComplete: function () {

    },


    //팝업창에서 부모에게 넘겨준값 컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (page, param) {
        var self = this;
        if (page.pageID == "ESD023P_02") {
            var formData = {
                C_NATIVE_NUM: param.C_NATIVE_NUM
                , G_TEXT: param.G_TEXT
            };

            var Url = "/Common/Infra/SaveCancellationReasonOfMail";
            if (self.viewBag.DefaultOption.UnfySendFlag) {
                Url = "/SVC/Common/Infra/SaveCancellationReasonOfMail";
            };

            ecount.common.api({
                url: Url,
                data: Object.toJSON(formData),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                    }
                    else {
                        self.dataSearch(param);
                    }
                }.bind(this)
            });
        }

    },

    dataSearch: function (data) {
        var gridObj1 = this.contents.getGrid("dataGrid1" + this.pageID);
        gridObj1.grid.getRowList().where(function (e) {
            if (e.SEND_CM_ID == data.C_NATIVE_NUM) {
                gridObj1.grid.setCell("AGREE_FLAG", e["K-E-Y"], "5");
                gridObj1.grid.setCell("CANCEL", e["K-E-Y"], "Y");
            }
        });
    },


    /********************************************************************** 
   * event grid listener [click, change...] 
   **********************************************************************/
    setGridDataNtsTrmsStatCd: function (e, data) {
        var option = {},
            res = ecount.resource;

        if (this.viewBag.DefaultOption.UnfySendFlag) {
            if (data.NTS_TRMS_STAT_CD == "S") {
                option.data = res.LBL01332; //전송
            } else if (data.NTS_TRMS_STAT_CD == "N") {
                option.data = res.LBL01328; //미전송
            } else {
                option.data = "";
            }
        } else {
            if (data.NTS_TRMS_STAT_CD == "S") {
                option.data = res.LBL01332; //전송
            }
            else if (data.NTS_TRMS_STAT_CD == "N") {
                option.data = res.LBL01328;//미전송
            }
            else {
                option.data = "";
            }

        }


        return option;
    },

    setGridDataAgreeFlag: function (e, data) {
        var option = {},
            res = ecount.resource,
            status = "";

        if (this.viewBag.DefaultOption.UnfySendFlag) {

            switch (data.AGREE_FLAG) {
                case "0":
                    status = ecount.resource.LBL01192; //미수신
                    break;
                case "1":
                    status = ecount.resource.LBL01193; //미확인
                    break;
                case "2":
                    status = ecount.resource.LBL01042; //확인
                    break;
                case "3":
                    status = ecount.resource.LBL19792; //확인취소
                    break;
                case "4":
                    status = ecount.resource.LBL00733; //검토
                    break;
                case "5":
                    status = ecount.resource.LBL00736; //발송취소
                    break;
                default:
                    status = ecount.resource.LBL01192; //미수신
            }

            if (data.AGREE_FLAG == "0" || data.AGREE_FLAG == "1") {
                confirm = ecount.resource.LBL02230; //읽지않음
            }

            if (data.RSLT_TYPCD == "F") {
                confirm = ecount.resource.LBL04799; //발송실패
            }


            option.data = status;
            option.attrs = {
                'data-trigger': 'hover',
                'data-toggle': 'tooltip',
                'data-placement': 'auto',
                'data-html': true,
                'title': this.setStatusTooltip({
                    C_CONFIRM: confirm,
                    WID: data.WRTR_ID,
                    AGREE_FLAG: data.AGREE_FLAG,
                    CANCEL: "",
                    C_SEND_DATE: data.RQST_SEND_DTM,
                    AGREE_DATE: data.AGREE_DATE,
                    G_TEXT: data.RSPS_CTT,
                    AGREE_MAIL: "",
                    PRINT_FLAG: data.PRINT_FLAG,
                    PRINT_HIT: data.PRINT_HIT
                })
            };


        } else {
            var confirm = data.C_CONFIRM;

            if ([ecount.resource.LBL02230, "읽지않음"].contains(confirm)) {
                confirm = ecount.resource.LBL02230;
            }
            else if ([ecount.resource.LBL04799, "발송실패"].contains(confirm)) {
                confirm = ecount.resource.LBL04799;
            }

            if ((confirm == ecount.resource.LBL02230 || $.isEmpty(confirm)) && data.AGREE_FLAG == "0") {
                status = ecount.resource.LBL01192; //미수신
            }
            else if (data.AGREE_FLAG == "3" && data.CANCEL == "Y") {
                status = ecount.resource.LBL00736; //발행취소
            }
            else if (data.AGREE_FLAG == "0" && ![ecount.resource.LBL02230, "읽지않음"].contains(confirm)) {
                status = ecount.resource.LBL01225; //미확인

                if (!$.isEmpty(data.CANCEL_MENT)) {
                    status = ecount.resource.LBL06763;//확인취소요청
                }
            }
            else if (data.AGREE_FLAG == "1") {
                status = ecount.resource.LBL00723;//확인
            }
            else {
                status = ecount.resource.LBL06761;//검토요청

                if (!$.isEmpty(data.CANCEL_MENT)) {
                    status = ecount.resource.LBL06761;//검토요청
                }
            }

            option.data = status;
            option.attrs = {
                'data-trigger': 'hover',
                'data-toggle': 'tooltip',
                'data-placement': 'auto',
                'data-html': true,
                'title': this.setStatusTooltip({
                    C_CONFIRM: data.C_CONFIRM,
                    WID: data.WID,
                    AGREE_FLAG: data.AGREE_FLAG,
                    CANCEL: data.CANCEL,
                    C_SEND_DATE: data.C_SEND_DATE,
                    AGREE_DATE: data.AGREE_DATE,
                    G_TEXT: data.CANCEL_MENT,
                    AGREE_MAIL: data.AGREE_MAIL,
                    PRINT_FLAG: data.PRINT_FLAG,
                    PRINT_HIT: data.PRINT_HIT
                })
            };
        }
        return option;
    },


    setGridDataCancel: function (e, data) {
        var option = {};
        if (this.viewBag.DefaultOption.UnfySendFlag) {
            //3.그 외(0:미수신, 1:미확인, 3:확인취소요청, 4:검토요청)인 경우에는 취소 링크 표시
            if (data.AGREE_FLAG == "0" || data.AGREE_FLAG == "1" || data.AGREE_FLAG == "3" || data.AGREE_FLAG == "4") {
                option.controlType = "widget.link";
                option.data = ecount.resource.LBL02853; //취소
                option.event = {
                    'click': function (e, data) {

                        if (this.viewBag.Permission.mailSendPermit && this.viewBag.Permission.mailSendPermit.UPD == true && this.viewBag.Permission.mailSendPermit.CS == false) {
                            var msgdto = ecount.common.getAuthMessage("", [{
                                MenuResource: this.Nation == "TW" ? ecount.resource.LBL14675 : '(세금)계산서진행단계', PermissionMode: "CS"
                            }]);
                            ecount.alert(msgdto.fullErrorMsg);
                            return false;
                        }

                        var param = {
                            width: ecount.infra.getPageWidthFromConfig(),
                            height: 220,
                            popupType: true,
                            responseID: this.callbackID,
                            popupReasonType: "Not",
                            C_NATIVE_NUM: data.rowItem['SEND_CM_ID'],
                            PRG_ID: data.rowItem['PRG_ID']
                        };
                        //모달로 띄우기
                        this.openWindow({
                            url: '/ECERP/SVC/POPUP/ESD023P_02',
                            name: ecount.resource.LBL08033,
                            param: param,
                            popupType: false
                        });

                    }.bind(this)

                }
            } else {
                option.controlType = "widget.faCheck";
                option.data = "";
                option.attrs = {
                    'class': ['text-warning']
                };
            }

        } else {
            if (data.CANCEL == "N" && data.AGREE_FLAG != "1") {
                option.controlType = "widget.link";
                option.data = ecount.resource.LBL02853; //취소
                option.event = {
                    'click': function (e, data) {

                        if (this.viewBag.Permission.mailSendPermit && this.viewBag.Permission.mailSendPermit.UPD == true && this.viewBag.Permission.mailSendPermit.CS == false) {
                            var msgdto = ecount.common.getAuthMessage("", [{
                                MenuResource: this.Nation == "TW" ? ecount.resource.LBL14675 : '(세금)계산서진행단계', PermissionMode: "CS"
                            }]);
                            ecount.alert(msgdto.fullErrorMsg);
                            return false;
                        }

                        var param = {
                            width: ecount.infra.getPageWidthFromConfig(),
                            height: 220,
                            popupType: true,
                            responseID: this.callbackID,
                            popupReasonType: "Not",
                            C_NATIVE_NUM: data.rowItem['C_NATIVE_NUM']
                        };
                        //모달로 띄우기
                        this.openWindow({
                            url: '/ECERP/Popup.Common/ESD023P_02',
                            name: ecount.resource.LBL08033,
                            param: param,
                            popupType: false
                        });

                    }.bind(this)
                };

            }
            else {
                option.controlType = "widget.faCheck";
                option.data = "";
                option.attrs = {
                    'class': ['text-warning']
                };
            }
        }
        return option;
    },

    setGridDataLog: function (value, data) {
        var option = {};

        option.controlType = "widget.link";
        option.data = value; //로그
        if (this.viewBag.DefaultOption.UnfySendFlag) {
            option.event = {
                'click': function (e, data) {


                    if (this.viewBag.Permission.mailSendPermit && this.viewBag.Permission.mailSendPermit.UPD == true && this.viewBag.Permission.mailSendPermit.CS == false) {
                        var msgdto = ecount.common.getAuthMessage("", [{
                            MenuResource: this.Nation == "TW" ? ecount.resource.LBL14675 : '(세금)계산서진행단계', PermissionMode: "CS"
                        }]);
                        ecount.alert(msgdto.fullErrorMsg);
                        return false;
                    }

                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 300,
                        popupType: true,//필수값
                        responseID: this.callbackID, //필수값
                        SEND_CM_ID: data.rowItem['SEND_CM_ID'],
                        SEND_CM_SNO: data.rowItem['SEND_CM_SNO'],
                        SEND_TYPE_CD: data.rowItem['SEND_TYPE_CD'],
                        MGRT_TF: data.rowItem['MGRT_TF'] == true ? "1" : "0",
                        RPLY_EMAIL: data.rowItem['RPLY_EMAIL']
                    };
                    //모달로 띄우기
                    this.openWindow({
                        url: '/ECERP/SVC/POPUP/ESD023P_03',
                        name: ecount.resource.LBL08033,
                        param: param,
                        popupType: false
                    });

                }.bind(this)
            };
        } else {
            option.event = {
                'click': function (e, data) {
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 300,
                        popupType: true,//필수값
                        responseID: this.callbackID, //필수값
                        S_EMAIL: data.rowItem['S_EMAIL'],
                        C_NATIVE_NUM: data.rowItem['C_NATIVE_NUM'],

                    };
                    //모달로 띄우기
                    this.openWindow({
                        url: '/ECERP/Popup.Common/ESD023P_03',
                        name: ecount.resource.LBL08033,
                        param: param,
                        popupType: false
                    });

                }.bind(this)
            };
        }
        return option;
    },


    setGridSendDate: function (e, data) {
        var option = {};
        if (this.viewBag.DefaultOption.UnfySendFlag) {
            option.data = ecount.infra.getECDateFormat('date10', false, data.SENDDATE.toDatetime());
        } else {
            option.data = data.SENDDATE;
        }

        return option;
    },

    setGridDataDate: function (e, data) {
        var option = {};

        // XML 발송 이력 (단독 날짜 형식)
        if (data.S_EMAIL == null || data.S_EMAIL == "") {
            if (data != null && data.DATE.toString().length > 4 && this.Nation == "TW") {
                // 대만 날자 형식 전환
                data.DATE = (parseInt(data.DATE.substring(0, 4)) + 1911) + data.DATE.substring(4);
            }
        }
        option.data = ecount.infra.getECDateFormat('date11', false, data.DATE.toDatetime());
        return option;
    },

    setGridDataStats: function (e, data) {
        var option = {},
            value,
            res = ecount.resource;

        if (this.Nation == "TW") {
            switch (data["STATS"]) {
                case "E": value = res.LBL14891; break;  // 전송오류
                case "P": value = res.LBL14898; break;  // 전송중
                case "C": value = res.LBL11306; break;  // 전송완료
                case "T": value = res.LBL14890; break;  // 전송취소
                case "0": value = String.format("{0}({1})", res.LBL05852, res.LBL01192); break;  // Email발송(미수신)
                case "1": value = String.format("{0}({1})", res.LBL05852, res.LBL00723); break;  // Email발송(확인)
                case "2": value = String.format("{0}({1})", res.LBL05852, res.LBL06761); break;  // Email발송(검토요청)
                case "3": value = String.format("{0}({1})", res.LBL05852, res.LBL00736); break;  // Email발송(발송취소)
                default:
                    value = ""
                    break;
            }
        } else if (this.Nation == "KR") {
            switch (data["STATS"]) {
                case "I": value = res.LBL05851; break; //인증서첨부
                case "N": value = "인증서첨부취소"; break; //인증서첨부취소
                case "Y": value = res.LBL04831; break;   //국세청전송
                case "E": value = "국세청전송에러"; break; //국세청전송에러
                case "C": value = "국세청전송완료"; break; //국세청전송완료
                case "0": value = String.format("{0}({1})", res.LBL05852, res.LBL01192); break;  // Email발송(미수신)
                case "1": value = String.format("{0}({1})", res.LBL05852, res.LBL00723); break;  // Email발송(확인)
                case "2": value = String.format("{0}({1})", res.LBL05852, res.LBL06761); break;  // Email발송(검토요청)
                case "3": value = String.format("{0}({1})", res.LBL05852, res.LBL00736); break;  // Email발송(발송취소)
                default:
                    value = "";
                    break;

            }
        }

        option.data = value;

        return option;
    },

    setGridDataBigo: function (e, data) {
        var option = {},
            loadData1 = this.viewBag.InitDatas.LoadData1,
            isOldPopupCall = false; //이전 팝업 호출 여부

        //미수신 확인 검토요청 발송취소
        if (!['0', '1', '2', '3'].contains(data["STATS"])) {
            option.data = data["BIGO"];
            return option;
        }

        option.controlType = "widget.link";
        option.data = ecount.resource.LBL18546;

        for (var i = 0; i < loadData1.length; i++) {
            if (this.viewBag.DefaultOption.UnfySendFlag && data.BIGO === loadData1[i].SEND_CM_ID && loadData1[i].RCVR_TYPCD === "T") {
                option.event = {
                    'click': function (e, data) {
                        var param = {
                            width: ecount.infra.getPageWidthFromConfig(),
                            height: 300,
                            popupType: true,//필수값
                            responseID: this.callbackID, //필수값
                            SEND_CM_ID: loadData1[i]['SEND_CM_ID'],
                            SEND_CM_SNO: loadData1[i]['SEND_CM_SNO'],
                            SEND_TYPE_CD: loadData1[i]['SEND_TYPE_CD'],
                            MGRT_TF: loadData1[i]['MGRT_TF'] == true ? "1" : "0",
                            RPLY_EMAIL: loadData1[i]['RPLY_EMAIL']
                        };
                        //모달로 띄우기
                        this.openWindow({
                            url: '/ECERP/SVC/POPUP/ESD023P_03',
                            name: ecount.resource.LBL08033,
                            param: param,
                            popupType: false
                        });

                    }.bind(this)
                };
                break;
            } else {
                isOldPopupCall = true;
            }
        }

        if (isOldPopupCall) {
            option.event = {
                'click': function (e, data) {
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 300,
                        popupType: true,//필수값
                        responseID: this.callbackID, //필수값
                        S_EMAIL: data.rowItem['S_EMAIL'],
                        C_NATIVE_NUM: data.rowItem['BIGO'],

                    };
                    //모달로 띄우기
                    this.openWindow({
                        url: '/ECERP/Popup.Common/ESD023P_03',
                        name: ecount.resource.LBL08033,
                        param: param,
                        popupType: false
                    });

                }.bind(this)
            };
        }

        return option;
    },

    setGridDataWDate: function (e, data) {
        var option = {};
        option.data = ecount.infra.getECDateFormat('date11', false, data.WDATE.toDatetime());
        return option;
    },


    setGridDataGbType: function (e, data) {
        var option = {},
            value;

        switch (data["GB_TYPE"]) {
            case "Z":
                value = ecount.resource.LBL02468;
                break;
            case "N":
                value = ecount.resource.LBL01209;
                break;
            case "Y":
                value = ecount.resource.LBL00723;
                break;
            default:
                value = "";
                break;

        }

        option.data = value;

        return option;
    },

    setGridDataStatusType: function (e, data) {
        var option = {},
            value;

        switch (data["STATUS_TYPE"]) {
            case "I":
                value = ecount.resource.LBL01770;
                break;
            case "M":
                value = ecount.resource.LBL01155;
                break;
            case "Z":
                value = ecount.resource.LBL05310;
                break;
            case "Y":
                value = ecount.resource.LBL01042;
                break;
            case "R":
                value = ecount.resource.LBL01382;
                break;
            case "C":
                value = ecount.resource.LBL00732;
                break;
            case "T":
                value = ecount.resource.LBL03448;
                break;
            case "B":
                value = ecount.resource.LBL02337;
                break;
            case "E":
                value = ecount.resource.LBL05852;
                break;
            case "F":
                value = ecount.resource.LBL08134;
                break;
            default:
                value = ecount.resource.LBL06157;
                break;
        }

        option.data = value;

        return option;
    },



    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //닫기 버튼
    onFooterClose: function () {
        this.close();
        return false;
    },


    /**********************************************************************
    *  기능 처리
    **********************************************************************/

    // 상태값 툴팁 처리
    setStatusTooltip: function (option) {
        var returnText = "",
            tooltip = {
                C_CONFIRM: "",
                WID: "",
                AGREE_FLAG: "",
                CANCEL: "",
                C_SEND_DATE: "",
                AGREE_DATE: "",
                G_TEXT: "",
                AGREE_MAIL: "",
                PRINT_FLAG: "",
                PRINT_HIT: ""
            },
            cSendDate = "",
            cConfirm = "";
        agreeDate = "",
            res = ecount.resource;

        tooltip = $.extend({}, tooltip, option || {});

        if (this.viewBag.DefaultOption.UnfySendFlag) {
            cSendDate = Date.ecFormat("DATE11_ko", tooltip.C_SEND_DATE);
            agreeDate = Date.ecFormat("DATE11_ko", tooltip.AGREE_DATE);
            switch (tooltip.AGREE_FLAG_CD) {
                case "0":
                    // '미수신'
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}", res.LBL04921, cSendDate, res.LBL07582, tooltip.WID);
                    break;
                case "1":
                    // '미확인' 
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}", res.LBL06767, cConfirm, res.LBL07582, tooltip.WID);

                    if (!$.isEmpty(tooltip.G_TEXT)) {
                        returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}", res.LBL06755, agreeDate, res.LBL06756, tooltip.G_TEXT.replace(/[\r\n|\n]/gi, "<br/>"), res.LBL07582, tooltip.WID);
                    }
                    break;
                case "2":
                    //'확인' 
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}",
                        res.LBL01747, agreeDate,
                        res.LBL02832, tooltip.PRINT_HIT,
                        res.LBL07582, tooltip.WID);
                    break;
                case "3":
                    //확인취소
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}", res.LBL06767, cConfirm, res.LBL07582, tooltip.WID);

                    if (!$.isEmpty(tooltip.G_TEXT)) {
                        returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}", res.LBL06755, agreeDate, res.LBL06756, tooltip.G_TEXT.replace(/[\r\n|\n]/gi, "<br/>"), res.LBL07582, tooltip.WID);
                    }
                    break;
                case "4":
                    //검토
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}", res.LBL01747, agreeDate, res.LBL02832, tooltip.PRINT_HIT, res.LBL07582, tooltip.WID);

                    break;
                case "5":
                    //'발송취소'
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}", res.LBL06613, agreeDate, res.LBL06614, tooltip.G_TEXT.replace(/[\r\n|\n]/gi, "<br/>"), res.LBL07582, tooltip.WID);

                    break;
                default:
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}", res.LBL04921, cSendDate, res.LBL07582, tooltip.WID);

                    break;

            }
        } else {

            if (tooltip.C_SEND_DATE != null && tooltip.C_SEND_DATE != "") {
                cSendDate = Date.ecFormat("DATE11_ko", tooltip.C_SEND_DATE);
            }

            if (tooltip.AGREE_DATE != null && tooltip.AGREE_DATE != "") {
                agreeDate = Date.ecFormat("DATE11_ko", tooltip.AGREE_DATE);
            }

            if (tooltip.C_CONFIRM != null && tooltip.C_CONFIRM != "" && tooltip.C_CONFIRM != "읽지않음") {
                cConfirm = Date.ecFormat("DATE11_ko", tooltip.C_CONFIRM);
            }

            if ((tooltip.C_CONFIRM == "읽지않음" || $.isEmpty(tooltip.C_CONFIRM)) && tooltip.AGREE_FLAG == "0") {    // 미수신
                returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}", res.LBL04921, cSendDate, res.LBL07582, tooltip.WID);
            }
            else if (tooltip.AGREE_FLAG == "3" && tooltip.CANCEL == "Y") {  // 발송취소
                returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}", res.LBL06613, agreeDate, res.LBL06614, tooltip.G_TEXT.replace(/[\r\n|\n]/gi, "<br/>"), res.LBL07582, tooltip.WID);
            }
            else if (tooltip.AGREE_FLAG == "0" && ![ecount.resource.LBL02230, "읽지않음"].contains(tooltip.C_CONFIRM)) { // 미확인, 확인취소요청
                returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}", res.LBL06767, cConfirm, res.LBL07582, tooltip.WID);

                if (!$.isEmpty(tooltip.G_TEXT)) {
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}", res.LBL06755, agreeDate, res.LBL06756, tooltip.G_TEXT.replace(/[\r\n|\n]/gi, "<br/>"), res.LBL07582, tooltip.WID);
                }
            }
            else if (tooltip.AGREE_FLAG == "1") {   // 확인
                returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}<br />◎ {6} : {7}", res.LBL01747, agreeDate, res.LBL01746, tooltip.AGREE_MAIL, res.LBL02832, tooltip.PRINT_FLAG == "1" ? tooltip.PRINT_HIT : res.LBL02155, res.LBL07582, tooltip.WID);
            }
            else {  // 검토요청
                returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}<br />◎ {6} : {7}", res.LBL06759, agreeDate, res.LBL06760, tooltip.AGREE_MAIL, res.LBL02832, tooltip.PRINT_FLAG == "1" ? tooltip.PRINT_HIT : res.LBL02155, res.LBL07582, tooltip.WID);

                if (tooltip.G_TEXT != "") { // 검토요청사유 있을 경우
                    returnText = String.format("◎ {0} : {1} <br />◎ {2} : {3}<br />◎ {4} : {5}<br />◎ {6} : {7}<br />◎ {8} : {9}", res.LBL06759, agreeDate, res.LBL06760, tooltip.AGREE_MAIL, res.LBL02832, tooltip.PRINT_FLAG == "1" ? tooltip.PRINT_HIT : res.LBL02155, res.LBL06762, tooltip.G_TEXT.replace(/[\r\n|\n]/gi, "<br/>"), res.LBL07582, tooltip.WID);
                }
            }
        }

        return returnText;
    }
});