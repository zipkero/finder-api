window.__define_resource && __define_resource("LBL01745","BTN00672","LBL11579","LBL13373","LBL10610","LBL02502","MSG06017","LBL09629","MSG06155","MSG06329","LBL02874","LBL10901","MSG05280","LBL06768","LBL02878","MSG05282","LBL00271","BTN00008","LBL90003");
/****************************************************************************************************
1. Create Date : 2015.09.01
2. Creator     : admin
3. Description : NoticeCommonDeletable.js
4. Precaution  :
5. History     :
                2016.01.19 Pham Van Phu Add NEW CHECKTYPR, MERGE ROW SPAN AND LINK TO PAGE EDIT
                2016.11.14 Pham Van Phu Add New Property by merge
                2018.01.25 (Duyet) Add more logic handle for function link in column MESSAGE
                2018.07.02 (박종국) : onClosedPopupHandler 오류 수정
                2019.01.29 (신희준) : 일괄회계반영 2.0 관련 수정
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "NoticeCommonDeletable", {
    MeargeSetCount: [],
    SplitSetCount: [],
    MeargeArrayData: [],

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
        this.initConfig();
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        
        if (this.checkType == "Confirm") {
            header.setTitle(ecount.resource.LBL01745);//Confirm
        }
        else if (this.checkType == "UndoConfirm") {
            header.setTitle(ecount.resource.BTN00672);
        }
        else if (this.checkType == "InvoicingCancelled") {
            header.setTitle(ecount.resource.LBL11579);
        }
        else if (this.checkType == "MgmtProcess") {
            // Wait for resource
            header.setTitle(ecount.resource.LBL13373);
        }
        else {
            if (this.menuName != null && this.menuName != undefined)
                header.setTitle(this.menuName); // 
            else
                header.setTitle(ecount.resource.LBL10610); //Unable to delete
        }
        header.notUsedBookmark();
    },

    //데이터 병합에 필요한 변수 세팅
    initConfig: function () {

    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();
        
        var titleDate = this.titleDate != null ? this.titleDate : ecount.resource.LBL02502;   //Voucher Date
        var msgWarning = this.msgWarning != null ? this.msgWarning : ecount.resource.MSG06017;  //The following vouchers cannot be deleted.<br />Please review the following.
        var titleMsg = this.titleMsg != null ? this.titleMsg : ecount.resource.LBL09629;    //Cause
        var menuName = this.menuName != null ? this.menuName : ecount.resource.LBL10610;    //Unable to delete
        var titleCus = this.titleCus != null ? this.titleCus : "";


        var leftHtml = "<span style=' font-weight: bold'>[" + menuName + "]</span>";

        if (this.checkType == "Confirm") {//Confirm or UndoConfirm
            menuName = ecount.resource.LBL01745;
            leftHtml = "<span style=' font-weight: bold'>[" + menuName + "]</span>";
            msgWarning = ecount.resource.MSG06155;
        }
        else if (this.checkType == "UndoConfirm") {//Confirm or UndoConfirm
            menuName = ecount.resource.BTN00672;
            leftHtml = "<span style=' font-weight: bold'>[" + menuName + "]</span>";
            msgWarning = ecount.resource.MSG06329;
        }
        else if (this.checkType == "TypeCode") {//Delete InspectionType
            titleDate = ecount.resource.LBL02874;
            menuName = ecount.resource.LBL10901;//Menu Name
            msgWarning = String.format(ecount.resource.MSG05280, menuName);
            titleMsg = ecount.resource.LBL06768;
            this.isHideColumnCust = false;
            titleCus = ecount.resource.LBL02878;
            leftHtml = "<span style=' font-weight: bold'>" + String.format(ecount.resource.MSG05282, menuName) + "</span>";
        }
        else if (this.checkType == "QCCode") {//Delete Quality Inspect
            titleDate = ecount.resource.LBL02874;
            menuName = ecount.resource.LBL10901;//Menu Name
            msgWarning = String.format(ecount.resource.MSG05280, menuName);
            titleMsg = ecount.resource.LBL06768;
            this.isHideColumnCust = false;
            titleCus = ecount.resource.LBL02878;
            leftHtml = "<span style=' font-weight: bold'>" + String.format(ecount.resource.MSG05282, menuName) + "</span>";
        }
        else if (this.checkType == "InvoicingCancelled") {
            titleCus = ecount.resource.LBL00271;
        }
        else if (this.checkType == "GyeCode") {
            msgWarning = "";
        }

        toolbar.addLeft(ctrl.define("widget.label", "warning").label(msgWarning).useHTML()).end();

        var columns = [];
        if (this.isHideColumnCust) {
            columns = [
                { propertyName: 'IO_DATE', id: 'IO_DATE', title: titleDate, width: this.date_width, dataType: 'DATE10' },
                { propertyName: 'MESSAGE', id: 'MESSAGE', title: titleMsg, width: this.msg_width }
            ];
        }
        else {
            columns = [
                { propertyName: 'IO_DATE', id: 'IO_DATE', title: titleDate, width: this.date_width, dataType: 'DATE10' },
                { propertyName: 'CUS_NAME', id: 'CUS_NAME', title: titleCus, width: this.cus_width, isHideColumn: $.isEmpty(titleCus) }, //.setColumns([{ id: 'SELF_D.s_confirm', isHideColumn: !this.strSlipAuth_YN }])
                { propertyName: 'MESSAGE', id: 'MESSAGE', title: titleMsg, width: this.msg_width }
            ];
        }

        var _keyColumn = ['IO_DATE', 'MESSAGE'];
        if (this.checkType == "MgmtProcess")
            _keyColumn.push("TYPE");

        grid
            .setRowData(this.viewBag.InitDatas.PageData.sortBy(this.idDataMerge))
            .setColumns(columns)
            .setKeyColumn(_keyColumn)
            .setColumnFixHeader(true)
            .setHeaderTopLeftHTML(leftHtml)
            .setCustomRowCell('IO_DATE', this.checkConditionShowLink.bind(this))
            .setCustomRowCell('MESSAGE', this.setOptionColMessage.bind(this));

        // Use ref : ESD026P_01.js > ErrShow function
        if (this.isMergeColumn)
            if ($.isArray(this.viewBag.InitDatas.PageData))
                this.setCnt(this.viewBag.InitDatas.PageData.sortBy(this.idDataMerge), this.idDataMerge, this.colIndex);

        contents.add(toolbar)
            .addGrid("dataGrid", grid);
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar
            .attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008));

        footer.add(toolbar);
    },

    onMessageHandler: function (page, message) {
        switch (page.pageID) {
        }
        message.callback && message.callback();  // The popup page is closed   
    },

    onPopupHandler: function (control, config, handler) {
        switch (control.id) {
        }

        handler(config);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {
    },

    //닫기버튼
    onFooterClose: function () {
        var message = {};
        if (this.checkType == "TypeCode") {
            message.addPosition = "next"
            message.callback = this.close.bind(this)
            this.setReload(message);
        }
        if (this.isReloadPage) {
            message.reload = "reload",
                message.callback = this.close.bind(this)
            this.setReload(message);
        }
        this.close();
    },

    onBeforeClosePopup: function (pageID) {
        var message = {};
        if (this.checkType == "TypeCode") {
            message.addPosition = "next"
            message.callback = this.close.bind(this)
            this.setReload(message);
        }
        if (this.isReloadPage) {
            message.reload = "reload",
                message.callback = this.close.bind(this)
            this.setReload(message);
        }
        return true;
    },

    _ON_REDRAW: function (param) {
        this._super._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }
    },

    /**********************************************************************
   *  기능 처리
   **********************************************************************/
    // check show link to page by condition
    checkConditionShowLink: function (data, rowItem) {
        if ($.isEmpty(data) == true)
            return;

        var self = this;
        if (self.checkType == "InvoicingCancelled" && (rowItem["TYPE"] == "1" || rowItem["TYPE"] == "2" || rowItem["TYPE"] == "3") && rowItem["XML"] != "" || rowItem["TYPE"] == "4")
            return self.setGridDateLink(data, rowItem);
    },

    // Set option for column message
    setOptionColMessage: function (value, rowItem, dataTypeConvertor) {
        var option = {};
        if (this.checkType == "MgmtProcess") {
            option.controlType = 'widget.link';
            option.event = {
                'click': function (e, data) {
                    var _valueXML = data.rowItem.XML.split('-')
                    this.openWindow({
                        url: "/ECERP/ESO/ESO004M",
                        name: ecount.resource.LBL90003,
                        param: {
                            TYPE_CD: data.rowItem.IO_DATE,
                            TYPE_NM: data.rowItem.CUS_NAME,
                            PROC_NO: "",
                            PROC_NM: "",
                            baseDateFrom: _valueXML[0],
                            isShowPopup: true,
                            processFlag: "Y",
                            popupflag: "Y"
                        },
                        popupType: false,
                        fpopupID: this.ecPageID
                    });
                }.bind(this)
            }
        } else {
            option.controlType = 'widget.text.multi';
        }
        option.attrs = {
            'type': 'vertical'     // 나열형 지정(가로형) - ygh #20
        }
        return option;
    },

    // set param to option of the link to page
    setGridDateLink: function (data, rowItem) {
        var option = {};
        var self = this;
        if (self.isLinkToPage && self.linkToPage != "") {
            if (rowItem[self.rowItemKey] != undefined) {
                option.data = rowItem[self.rowItemKey];
            } else
                option.data = data;

            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    var grid = self.contents.getGrid().grid;
                    self.cDateNo = data.rowItem[self.rowItemKey]
                    var prevClickedRowId = self.clickedRowId;
                    self.clickedRowId = data.rowKey;

                    var isOpenPopup = data.rowItem.URL = self.linkToPage;

                    var param;

                    if (rowItem["TYPE"] == "4") {
                        param = self.setParam(data)
                    } else {
                        // invers attr delete
                        if (prevClickedRowId) {
                            grid.refreshCell(data.columnId, prevClickedRowId);
                        }
                        // invers attr insert 
                        grid.refreshCell(data.columnId, self.clickedRowId);
                        param = data.rowItem['XML'];
                        param = $.extend(param, { ApprovalStepButtonKey: data.rowItem || {} });
                        var param2 = self.setParam(data);

                        param = $.extend(param, param2);
                        if (data.rowItem.CUS_NAME.split(ecount.delimiter)[1] == "42")
                            self.linkToPage = "/ECERP/ESJ/ESJ009M";
                        else if (data.rowItem.CUS_NAME.split(ecount.delimiter)[1] == "43")
                            self.linkToPage = "/ECERP/ESJ/ESJ008M";
                    }

                    if (!isOpenPopup) {
                        this.onAllSubmit({
                            url: self.linkToPage,
                            param: param,
                        });

                    } else {
                        param.width = self.widthLinkToPage;
                        param.height = self.heightLinkToPage;
                        self.openWindow({
                            url: self.linkToPage,
                            name: self.menuNameOfLinkToPage,
                            param: param,
                            popupType: false,
                            additional: true
                        });
                    }
                }
            }
            if (self.cDateNo == rowItem[self.rowItemKey]) {
                option.attrs = {
                    'class': ['text-primary-inverse'] //text-primary-inverse event-target
                }
            }
        }
        return option;
    },

    //Set Row CNT
    setCnt: function (data, idMerge, colIndex) {
        var lengArray = data.select(function (item) {
            return item[idMerge]
        }).distinct(); //[1,2,2,3,3,4,5,6] ==> [1,2,3,4,5,6]

        //Group by type error
        var group = data.groupBy(idMerge);
        // Insert Row_Cnt = leng of Group
        lengArray.forEach(function (item, index) {
            var arrLength = group[item].length;
            for (var i = 0; i < data.length; i++) {
                if (data[i][idMerge] == item)
                    data[i].ROW_CNT = arrLength;
            }
        })
        // calculator for merge set of group
        this.makeMergeData(data, idMerge, colIndex);
    },

    // rowspan merge ref : EGD002P_02.js
    setRowSpanMerge: function (startIndex, rowCnt) {
        mergeData = {};
        mergeData['_MERGE_USEOWN'] = true;
        //if (startIndex == 0)
        //    mergeData['_IS_CENTER_ALIGN'] = false;
        mergeData['_MERGE_START_INDEX'] = startIndex;
        mergeData['_ROWSPAN_COUNT'] = rowCnt;
        return mergeData;
    },
    //  Make Merge
    makeMergeData: function (rowData, idMerge, colIndex) {
        var loadDateCnt = rowData.count();
        var InPart = '';
        for (var i = 0; i < loadDateCnt; i++) {
            var tempRowCnt = rowData[i].ROW_CNT;
            if (i < loadDateCnt - 1 && tempRowCnt > 1 && InPart != rowData[i][idMerge]) {
                rowData[i]['_MERGE_SET'] = [];
                rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(colIndex, rowData[i].ROW_CNT)); // Merge in column 0 or 1 or 2
            }
            InPart = rowData[i][idMerge];
        }
        return rowData;
    },

    // Reload grid(khởi tạo lại lưới)
    setReload: function (message) {
        this.sendMessage(this, message);
    },

    //Set param for link to page
    setParam: function (data) {
        if (this.checkType == "InvoicingCancelled") {
            var io_Date = data.rowItem.IO_DATE.split('/');
            return {
                IO_DATE: data.rowItem['CUS_NAME'].split(ecount.delimiter)[0],
                IO_NO: io_Date[2].split('-')[1],
                IO_TYPE: data.rowItem['CUS_NAME'].split(ecount.delimiter)[1],
                EditFlag: this.editFlag,
                hfSelfUrl: "/ECERP/Popup.Common/NoticeCommonDeletable",
                hidProcNo: null,
                hidProcStep: 0,
                hidProgress: null,
                hidSearchFlag: "Y",
                isViewHistory: false,
                hidSTETOrderEditFlag: null,
                hidSTETOrderProgress: null,
                STETOrderDsProcStep: 0,
                STETOrderMode: 0,
                STETOrderPopupFlag: "N",
                STETOrderProcNo: null,
                STETOrderProcStep: 0,
                fpopupID: this.pageID,
                callPageName: "NoticeCommonDeletable",
                URL: "/ECERP/Popup.Common/NoticeCommonDeletable",
                alreadyIncludedLayout: true
            };
        }
        else if (this.checkType == "InvoicingMultiSlipCancelled") {
            return {
                IO_DATE: data.rowItem['CUS_NAME'],
                IO_NO: data.rowItem.IO_DATE.split('-')[1],
            };
        }
        else if (data.rowItem["TYPE"] == "4") {
            return {
                REQ_DATE: data.rowItem.IO_DATE.split('-')[0],
                REQ_NO: data.rowItem.IO_DATE.split('-')[1],
                EditFlag: this.editFlag,
                callPageName: "NoticeCommonDeletable",
                URL: "/ECERP/Popup.Common/NoticeCommonDeletable"
            }
        }
    },
});