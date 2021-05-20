window.__define_resource && __define_resource("LBL05193","LBL06830","LBL06831","LBL35284","LBL00445","LBL05310","LBL10781","BTN00008","LBL02354","LBL11726","LBL01241","LBL03684","LBL05626");
/****************************************************************************************************
1. Create Date : 2016.06.09
2. Creator     : 임명식
3. Description : 전자결재, 재고결재, 결재정보  approval information
4. Precaution  :
5. History     : 
6. Old File    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type1", "ESD006P_APPINFO", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    gridCustomerColumn: {
        APP_ID: null, APP_TYPE: null, APP_ID2: null, APP_TYPE2: null
    },

    //전결여부
    isBypassApproval: [false, false],
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
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

    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL05193);
    },

    onInitContents: function (contents) {
        var _self = this;
        var form1 = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            apvlInfo = widget.generator.grid();

        var mergeFirstLineSet = [];
        mergeFirstLineSet.push({});
        mergeFirstLineSet[0]['_MERGE_USEOWN'] = false;
        mergeFirstLineSet[0]['_ROW_TITLE'] = ecount.resource.LBL06830;
        mergeFirstLineSet[0]['_MERGE_START_INDEX'] = 0;
        mergeFirstLineSet[0]['_COLSPAN_COUNT'] = 4;
        mergeFirstLineSet.push({});
        mergeFirstLineSet[1]['_MERGE_USEOWN'] = false;
        mergeFirstLineSet[1]['_ROW_TITLE'] = ecount.resource.LBL06831;
        mergeFirstLineSet[1]['_MERGE_START_INDEX'] = 4;
        mergeFirstLineSet[1]['_COLSPAN_COUNT'] = 4;

        apvlInfo
            .setRowData(this.getSatusData())
            .setEventWidgetTriggerObj(this.events)
            .setColumnPropertyColumnName("id")
            .setEditable(true, 3, 0)
            .setColumnPropertyNormalize("upper")
            .setEditLimitAddRow(10)
            .setEditRowDataSample(this.gridCustomerColumn)
            .setEditableUseViewMode(ecount.config.user.IS_SLIP_INPUTTYPE_MOVE)
            .setColumnRowCustom(['new', 0], [
                { '_MERGE_SET': mergeFirstLineSet }
            ])
            .setColumns([
                { propertyName: 'SEQ', id: 'SEQ', controlType: 'widget.input.label', title: ecount.resource.LBL35284, width: '70', align: 'center' },
                { propertyName: 'APP_ID_NAME', id: 'APP_ID_NAME', controlType: 'widget.input.label', title: ecount.resource.LBL00445, width: '', align: 'center' },
                { propertyName: 'APP_STATUS', id: 'APP_STATUS', controlType: 'widget.input.label', title: ecount.resource.LBL05310, width: '50', align: 'center' },
                { propertyName: 'APP_DT', id: 'APP_DT', controlType: 'widget.input.label', title: "결재일", width: '90', align: 'center' },
                { propertyName: 'SEQ2', id: 'SEQ2', controlType: 'widget.input.label', title: ecount.resource.LBL35284, width: '70', align: 'center' },
                { propertyName: 'APP_ID_NAME2', id: 'APP_ID_NAME2', controlType: 'widget.input.label', title: ecount.resource.LBL00445, width: '', align: 'center' },
                { propertyName: 'APP_STATUS2', id: 'APP_STATUS2', controlType: 'widget.input.label', title: ecount.resource.LBL05310, width: '50', align: 'center' },
                { propertyName: 'APP_DT2', id: 'APP_DT2', controlType: 'widget.input.label', title: ecount.resource.LBL10781, width: '90', align: 'center' },
            ])
            .setCustomRowCell('SEQ', this.setGridDateCustomSeqCall.bind(this))
            .setCustomRowCell('APP_STATUS', this.setGridDateCustomAppStatusCall.bind(this))
            .setCustomRowCell('APP_DT', this.setGridDateCustomDateCall.bind(this))
            .setCustomRowCell('SEQ2', this.setGridDateCustomSeqCall2.bind(this))
            .setCustomRowCell('APP_STATUS2', this.setGridDateCustomAppStatusCall2.bind(this))
            .setCustomRowCell('APP_DT2', this.setGridDateCustomDateCall2.bind(this))

        contents
           .addGrid("apvlInfo" + this.pageID, apvlInfo)
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onFocusOutHandler: function (event) {
        this.footer.getControl("close").setFocus(0);
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //그리드 순번 이벤트
    setGridDateCustomSeqCall: function (value, rowItem) {
        var option = {};
        option.data = rowItem.SEQ == 1 ? ecount.resource.LBL02354 : ((value.toString() || "0") == "0" ? "" : (value - 1 || ""));
        return option;
    },

    //그리드 순번 이벤트2
    setGridDateCustomSeqCall2: function (value, rowItem) {
        var option = {};
        option.data = value == "0" ? "" : (value || "");
        return option;
    },

    //그리드 상태 이벤트
    setGridDateCustomAppStatusCall: function (value, rowItem) {
        return this.setGridDataAppStatus(value, rowItem, 1);
    },

    //그리드 상태 이벤트2
    setGridDateCustomAppStatusCall2: function (value, rowItem) {
        return this.setGridDataAppStatus(value, rowItem, 2);
    },

    //상태 처리
    setGridDataAppStatus: function (value, rowItem, type) {
        var option = {};
        this.isBypassApproval[type] = value.toString() == "9" && this.isBypassApproval[type] == false ? true : this.isBypassApproval[type];
        debugger
        switch (value.toString()) {
            case "0":
                option.data = this.isBypassApproval[type] == true ? "-" : "";
                break;
            case "1":
                option.data = (rowItem.APP_TYPE == 1 && rowItem.SEQ == 1 && type == 1) ? ecount.resource.LBL11726 : ecount.resource.LBL05310; //결재
                break;
            case "3":
                option.data = ecount.resource.LBL01241; // 반려
                break;
            case "8":
                option.data = !$.isEmpty(rowItem["APP_DT" + (type == 1 ? "" : "2")]) ? ecount.resource.LBL03684 : "-"; //"─" 후결;
                break;
            case "9":
                option.data = ecount.resource.LBL05626; //"-"; //"─";
                break;
        }
        return option;
    },

    //그리드 날짜 이벤트
    setGridDateCustomDateCall: function (value, rowItem) {
        return this.setGridDateCustomDate(value, rowItem, 1);
    },
    //그리드 날짜 이벤트
    setGridDateCustomDateCall2: function (value, rowItem) {
        return this.setGridDateCustomDate(value, rowItem, 2);
    },
    setGridDateCustomDate: function (value, rowItem, type) {
        var option = {};
        if (rowItem["APP_STATUS" + (type == 1 ? "" : "2")] == 9) {
            option.data = !$.isEmpty(rowItem["APP_DT" + (type == 1 ? "" : "2")]) && rowItem["APP_STATUS" + (type == 1 ? "" : "2")] != 0 ? ecount.infra.getECDateFormat('date10', false, rowItem["APP_DT" + (type == 1 ? "" : "2")].toDate()) : ""; //ecount.resource.LBL05626;  //전결
        } else {
            if (rowItem["APP_STATUS" + (type == 1 ? "" : "2")] == 8 && $.isEmpty(rowItem["APP_DT" + (type == 1 ? "" : "2")])) {
                option.data = ecount.resource.LBL03684 //후결
            } else if (this.isBypassApproval[type] == true) {
                option.data = ecount.resource.LBL05626; //전결
            }else{
                option.data = !$.isEmpty(rowItem["APP_DT" + (type == 1 ? "" : "2")]) && rowItem["APP_STATUS" + (type == 1 ? "" : "2")] != 0 ? ecount.infra.getECDateFormat('date10', false, rowItem["APP_DT" + (type == 1 ? "" : "2")].toDate()) : "";
            }
        }

        return option;
    },
    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onFooterClose: function () {
        this.close();
    },


    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/


    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    getSatusData: function () {
        var reFirst = this.viewBag.InitDatas.ApprovalData.where(function (obj) { return obj.APP_TYPE == 1; }),
            reSencod = this.viewBag.InitDatas.ApprovalData.where(function (obj) { return obj.APP_TYPE == 2; }),
            maxCount = 0, newRecord = [], newSecond = [];

        maxCount = (reFirst.length > reSencod.length) ? reFirst.length : reSencod.length;

        $.each(reSencod, function (i, item) {
            newSecond.push({
                APP_DT2: item.APP_DT, APP_ID2: item.APP_ID, APP_ID_NAME2: item.APP_ID_NAME, APP_STATUS2: item.APP_STATUS, APP_TYPE2: item.APP_TYPE, SEQ2: item.SEQ, SIGN_TITLE2: item.SIGN_TITLE, SLIP_CD2: item.SLIP_CD
            });
        });

        for (var i = 0; i < maxCount; i++) {
            newRecord.push({
                APP_DT: reFirst, APP_ID: "", APP_ID_NAME: "", APP_STATUS: 0, APP_TYPE: 1, SEQ: 0, SIGN_TITLE: "", SLIP_CD: "",
                APP_DT2: null, APP_ID2: "", APP_ID_NAME2: "", APP_STATUS2: 0, APP_TYPE2: 2, SEQ2: 0, SIGN_TITLE2: "", SLIP_CD2: ""
            });
            if (reFirst.length > i) {
                $.extend(newRecord[i], reFirst[i]);
            }
            if (newSecond.length > i) {
                $.extend(newRecord[i], newSecond[i]);
            }
        }
        return newRecord;
    }

});