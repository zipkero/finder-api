window.__define_resource && __define_resource("BTN00113","LBL00381","LBL00359","LBL01440","LBL03233","LBL01809","LBL04331","LBL13839","BTN00291","BTN00169","MSG03839","BTN00069","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.04.01
2. Creator       : Cao Vinh Thai
3. Description :  List Person search CS.
4. Precaution  : None
5. History       : [2017.11.06][Duyet] Remove check max count 100
                       2018.06.05 (이현택) - 사용자선택 갯수 1000개로 제한 & 페이징처리
                       2018.07.18 Huu Lan: Apply Dev 9134 - ERP게시글 작성 시, CS 거래처 담당자에게 쪽지 발송되도록
6. Old File     : EG007P.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EG007P", {
    /**********************************************************************
    * page user opion Variables(User variables and objects)
    **********************************************************************/
    customerName: null,
    customerId: null,
    searchFormParameter: null,
    formType: "SP911",
    inPartList: {},
    gridObject: null,
    formInfo: null,
    /**********************************************************************
    * page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        var customerInfo = "";
        if (this.CUSTOMER_INFO != null && this.CUSTOMER_INFO != undefined && this.CUSTOMER_INFO != '')
            customerInfo = this.CUSTOMER_INFO.split(ecount.delimiter);
        else
            customerInfo = ecount.delimiter.split(ecount.delimiter);

        this.customerId = customerInfo[0].split(";");
        this.customerName = customerInfo[1].split(";");
    },

    initProperties: function () {
        this.formInfo = this.viewBag.InitDatas.SP911;
        this.lstSelectedCucstomer = new Array();
        this.searchFormParameter = {
            PARAM: (!$.isNull(this.keyword)) ? this.keyword : ' ',
            SEARCH2: (!$.isNull(this.keyword2)) ? this.keyword2 : '',
            SEARCH3: (!$.isNull(this.keyword3)) ? this.keyword3 : '',
            SEARCH4: (!$.isNull(this.keyword4)) ? this.keyword4 : '',
            PAGE_SIZE: 100,
            PAGE_CURRENT: 1,
            FORM_TYPE: this.formType,
            FORM_SER: 1,
            BUSINESS_NO :'',
            CUST_NAME : '',
            ID : ''
        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](Screen configuration) 
    **********************************************************************/
    // Header Setting
    // Thiết lập phần tiêu đề 
    onInitHeader: function (header, resource) {
        var g = widget.generator,
            res = ecount.resource,
            contents = g.contents(),
            form = g.form(),
            toolbar = g.toolbar()
        ctrl = g.control();

        toolbar.addLeft(ctrl.define("widget.button", "search").label(res.BTN00113));
        /*
        WHEN 'BUSINESS_NO' THEN 'LBL00381' --Customer/Vendor Code
	WHEN 'CUST_NAME' THEN 'LBL00359' --Customer/Vendor Name
        */
        form.add(ctrl.define("widget.input.codeName", "BUSINESS_NO", "BUSINESS_NO", res.LBL01440).end()) 
            .add(ctrl.define("widget.input.codeName", "CUST_NAME", "CUST_NAME", res.LBL03233).end())
            .add(ctrl.define("widget.input.codeName", "ID", "ID", res.LBL01809).end());

        contents.add(form);    //검색어
        contents.add(toolbar);  //버튼

        header
            .notUsedBookmark()
            .setTitle(res.LBL04331)//res.LBL13839)
            .useQuickSearch()
            .add("search").addContents(contents)
            .add("option", [
                     { id: "searchTemplate", label: res.BTN00291 },
                     { id: "listSetting", label: res.BTN00169 }
            ]);
    },

    // Contents Setting
    // Thiết lập phần nội dung
    onInitContents: function (contents, resource) {
        var self = this;

        if ($.isEmpty(this.MENU_TYPE)) {
            for (var i = 0; i < self.ColumnInfoList.count() ; i++) {
                if (self.ColumnInfoList[i].id == "CHK2") {
                    self.ColumnInfoList.remove(self.ColumnInfoList[i].index);
                };
                var findForms = self.formInfo.columns.where(function (obj) {
                    return obj.id.toString() == self.ColumnInfoList[i].id.toString();
                });
                if (findForms != null) {
                    self.ColumnInfoList[i].align = findForms[0].align;
                    self.ColumnInfoList[i].valign = findForms[0].valign;
                };
            }
        };
        
        var grid = widget.generator.grid();
        grid
            .setColumns(self.ColumnInfoList)
            .setRowDataParameter(self.searchFormParameter)
            .setRowData(self.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Account/Basic/GetCustomerList")
            .setCheckBoxCustomRememberChecked("CHK2", true)
            .setCheckBoxUse(true)
            .setCheckBoxHeaderCallback({
                'change': function (e, data) {
                    self.gridObject.checkAllCustom('CHK2', data.target.checked);
                }
            })
            .setCheckBoxCallback({
                'change': self.setChangeCheckBoxCallback.bind(self)
            })
            .setKeyColumn(['SITE_DES', 'CUST_NAME', 'BUSINESS_NO', 'ID'])
            .setCustomRowCell('BUSINESS_NO', this.setGridCheckboxOption.bind(this))
            .setCustomRowCell('CUST_NAME', this.setGridDataLink.bind(this))
            //.setCustomRowCell('ID', this.setGridDataLink.bind(this)) 
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfo.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCheckBoxCustomMaxCount("CHK2", self.checkMaxCount)
            .setCheckBoxCustomMaxCountExceeded("CHK2", function (maxcount) { ecount.alert(String.format(ecount.resource.MSG03839, maxcount)); });

        if (self.formInfo != null && self.formInfo.option != null) {
            var formOutSet = self.formInfo.option;
            grid
                .setGridTypeHeaderTrHeight(formOutSet.headHeight || 0)
                .setTitleFontSize(formOutSet.headFontSize || 0)
                .setTitleHorizontalAlign((formOutSet.headHAlign == "left") ? "left" : ((formOutSet.headHAlign == "right") ? "right" : "center"))
                .setTitleVerticalAlign((formOutSet.headVAlign == "top") ? "top" : ((formOutSet.headVAlign == "bottom") ? "bottom" : "middle"))
                .setTitleFontBold(formOutSet.headFontBold || false)
                .setTitleFontItalic(formOutSet.headFontItalic || false)
                .setTitleFontStrike(formOutSet.headFontStrike || false)
                .setTitleFontUnderline(formOutSet.headFontUnderline || false);
        }

        // merge data
        if ($.isArray(self.viewBag.InitDatas.LoadData))
            self.makeMergeData(self.viewBag.InitDatas.LoadData);

        //for (var i = 0; i < self.ColumnInfoList.count() ; i++) {
        //    if (!columnDanger.contains(self.ColumnInfoList[i].id))
        //        grid.setCustomRowCell(self.ColumnInfoList[i].id, self.setBackGroudCellForList.bind(self));
        //}

        contents.addGrid("dataGrid" + self.pageID, grid);
    },

    // Footer Setting
    // Thiết lập phần cuối
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);

    },

    // 검색 항목 설정
    onDropdownSearchTemplate: function () {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 450,
            FORM_TYPE: this.formType
        };
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_01_CM3",
            name: ecount.resource.BTN00169,
            param: param
        });

    },

    // 리스트 설정
    onDropdownListSetting: function () {
        var param = {
            width: 1020,
            height: 800,
            FORM_TYPE: this.formType,
            FORM_SEQ: 1
        }
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: ecount.resource.BTN00169,
            param: param
        });
    },

    // Event Load Complete
    // Sự kiện tải trang hoàn thành
    onLoadComplete: function (event) {
        this.header.getQuickSearchControl().setFocus(0);
    },

    // Event Grid Render Complete
    // Sự kiện lưới được tải 
    onGridRenderComplete: function (e, data) {

        var self = this;
        this.isSearched = true;
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        var autoFlag = false;
        var d = {};

        if (!$.isEmpty(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }

        var value = this.keyword;
        if (!$.isEmpty(value))
            this.isOnePopupClose = true;


        if (data.totalDataCount === 1) {
            autoFlag = true;
            d = data.dataRows[0];
        }
        else if (data.totalDataCount > 1) {
            autoFlag = true;
            d = data.dataRows[0];
            for (var i = 1; i < data.totalDataCount; i++) {
                if (!$.isEmpty(data.dataRows[i]) && !$.isEmpty(d.ID)) {
                    if (!$.isEmpty(data.dataRows[i].ID) && data.dataRows[i].ID.toLowerCase() != d.ID.toLowerCase()) {
                        autoFlag = false;
                        break;
                    }
                }
            }
        }

        if (autoFlag === true && this.isOnePopupClose) {
            var userIds = new Array();

            d.ID = d.ID.toLowerCase();
            userIds.push(d);

            var message;
            message = {
                name: "CUST_NAME",
                code: "ID",
                data: userIds.length > 0 ? userIds : d,
                isAdded: true,
                addPosition: "next",
                callback: self.close.bind(self),
                Receiver_Type: self.Receiver_Type
            };
            self.sendMessage(self, message);
        }

        if (data.datacount > 1) {
            var rowlist = self.contents.getgrid().grid.getrowlist();

            $.each(rowlist, function (i, item) {
                self.contents.getgrid().grid.setcell("CHK2", item[ecount.grid.constvalue.keycolumnpropertyname], true);
            }.bind(self));
        }

        self.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        self.gridObject = self.contents.getGrid().grid;

    },

    // Apply button click event
    // Sự kiện click nút Apply
    onFooterApply: function (e) {
        var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
        var userIds = new Array();
        var users = new Array();
        var hasItem = false;

        for (var i = 0, limit = rowList.length ; i < limit; i++) {
            if (rowList[i].CHK2 == true) {
                if ($.inArray(rowList[i]["CUST"], users) == -1) {
                    userIds.push(rowList[i]);

                }
                hasItem = true;
            }
        }//for end
        if (!hasItem) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "CUST_NAME",
            code: "ID",
            data: userIds,
            isAdded: true,
            addPosition: "next",
            callback: this.close.bind(this),
            Receiver_Type: this.Receiver_Type
        };

        this.sendMessage(this, message);
    },

    // Close button click event
    // Sự kiện click nút Close
    onFooterClose: function () {
        this.close();
        return false;
    },

    // Event button ENTER click
    // Sự kiện ENTER được nhấn
    ON_KEY_ENTER: function (e, target) {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
    },

    // Event button F8 click
    // Sự kiện F8 được nhấn
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        } else
            this.onFooterApply();
    },

    // Call back message
    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case "CM100P_01_CM3":
                setTimeout(function () {
                    message.callback && message.callback();
                }, 0);
                break;
            case "CM100P_02":
                this.reloadPage();
                break;

        }
    },

    onHeaderSearch: function (event) {
        if (this.header.getQuickSearchControl())
            this.header.getQuickSearchControl().setValue('');
        this.onContentsSearch('button');
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.isOnePopupClose = true;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //검색
    onContentsSearch: function (event) {
        if (this.header.getQuickSearchControl() != undefined) {
            var invalid = this.header.getQuickSearchControl().validate();
            if (invalid.length > 0) {
                if (!e.unfocus)
                    this.header.getQuickSearchControl().setFocus(0);
                return;
            }
        }

        this.searchFormParameter.PARAM = this.header.getQuickSearchControl() ? this.header.getQuickSearchControl().getValue().keyword || '' : '';
        this.searchFormParameter.BUSINESS_NO = this.header.getControl("BUSINESS_NO") ? this.header.getControl("BUSINESS_NO").getValue() : '';
        this.searchFormParameter.CUST_NAME = this.header.getControl("CUST_NAME") ? this.header.getControl("CUST_NAME").getValue() : '';
        this.searchFormParameter.ID = this.header.getControl("ID") ? this.header.getControl("ID").getValue() : '';
        this.isOnePopupClose = true;
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        if (this.header.getQuickSearchControl())
            this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    // Set checked item at grid
    // Thiết lập những mục được chọn trên lưới
    setGridCheckboxOption: function (value, rowItem) {

        for (k = 0; k < this.customerId.length; k++) {
            if (this.customerId[k].toUpperCase() == rowItem.ID.toUpperCase() && this.customerName[k].toUpperCase() == rowItem.CUST_NAME.toUpperCase()) {
                this.lstSelectedCucstomer.push(rowItem[ecount.grid.constValue.keyColumnPropertyName]);
                break;
            }
        }

        var option = {};
        var self = this;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                var message = {
                    name: "CUST_NAME",
                    code: "ID",
                    data: data.rowItem,
                    isAdded: true,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        }
        return option;
    },

    // header ReWrite button click event
    onHeaderRewrite: function (e) {
        this.header.reset();
    },

    // Set value for [Link] column
    // Thiết lấp giá trị cho cột Link
    setGridDataLink: function (value, rowItem) {
        var option = {};
        var self = this;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                e.preventDefault();
                var message = {
                    name: "CUST_NAME",
                    code: "ID",
                    data: data.rowItem,
                    isAdded: true,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        }
        return option;
    },

    //reload page function 
    reloadPage: function () {
        var self = this;
        var url = "/ECERP/Popup.Search/EG007P";
        params = {
            isIncludeInactive: self.isIncludeInactive,
            hidGwUse: self.hidGwUse,
            hidCancelYn: self.hidCancelYn,
            isPerson: self.isPerson,
            MENU_TYPE: self.MENU_TYPE,
            GwUse: self.GwUse,
            Type: self.Type,
            CSFlag: self.CSFlag,
            isCheckBoxDisplayFlag: true,
            keyword: self.searchFormParameter.PARAM,
            keyword2: self.searchFormParameter.BUSINESS_NO,
            keyword3: self.searchFormParameter.CUST_NAME,
            keyword4: self.searchFormParameter.ID,
            MEMBERS: self.MEMBERS,
            IsAppLine: self.IsAppLine
        }

        self.onAllSubmitSelf({
            url: url,
            param: params
        });
    },

    makeMergeData: function (rowData) {
        var loadDateCnt = rowData.count();
        var str_site_des = '';
        var self = this;
        var indexMerge = 1;

        var listColumns = self.ColumnInfoList;
        for (var i = 0; i < loadDateCnt; i++) {

            var findForms = listColumns.where(function (obj) {
                return obj.id.toString() == "SITE_DES";
            });

            if (findForms != null)
                rowData[i]["ALIGN_DATA"] = findForms[0].align;
            else
                rowData[i]["ALIGN_DATA"] = "center";

            var findFormsCHK = listColumns.where(function (obj) {
                return obj.id.toString() == "CHK2";
            });
            if (findFormsCHK != null)
                rowData[i]["ALIGN_DATA"] = "center";
        };
        
        for (var i = 0; i < listColumns.count() ; i++) {
            if (listColumns[i].id == "SITE_DES") {
                indexMerge = i+1;
                break;
            }
        }

        for (var i = 0 ; i < loadDateCnt; i++) {
            var tempRowCnt = parseInt(rowData[i].ROW_CNT);

            if (i < loadDateCnt - 1 && tempRowCnt > 1 && str_site_des != rowData[i].SITE_DES) {
                rowData[i]['_MERGE_SET'] = [];
                rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(0, tempRowCnt, rowData[i]));
                rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(indexMerge, tempRowCnt, rowData[i]));
            }

            if (self.inPartList[rowData[i].SITE_DES] == undefined)
                self.inPartList[rowData[i].SITE_DES] = new Array();

            this.inPartList[rowData[i].SITE_DES].push(rowData[i].SITE_DES + "∮" + rowData[i].CUST_NAME + "∮" + rowData[i].BUSINESS_NO + "∮" + rowData[i].ID);
            str_site_des = rowData[i].SITE_DES;
        }

        return rowData;
    },

    // rowspan merge
    setRowSpanMerge: function (startIndex, rowCnt) {
        mergeData = {};
        mergeData['_MERGE_USEOWN'] = true;
        mergeData['_MERGE_START_INDEX'] = startIndex;
        mergeData['_ROWSPAN_COUNT'] = rowCnt;
        return mergeData;
    },

    setChangeCheckBoxCallback: function (e, data) {
        
        var self = this;
        if (self.inPartList[data.rowItem['SITE_DES']] != undefined) {
            var currentInPartList = self.inPartList[data.rowItem['SITE_DES']];
            for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
                var dataKey = currentInPartList[i];
                var isChecked = self.gridObject && self.gridObject.isChecked(data.rowKey);

                self.gridObject && self.gridObject.setCell("CHK2", dataKey, isChecked);
            }
        }
    },

    setBackGroudCellForList: function (value, rowItem) {
 
    },

    onGridInit: function (e, data) {
        var self = this;
        var q = this.contents.getGrid().grid.getColumnInfoList();

        for (var i = 0; i < q.count() ; i++) {
            if (q[i].id == "CHK2") {
                q[i].columnOption = { attrs: { 'disabled': true } };
                break;
            }
        }
        this._super.onGridInit.apply(this, arguments);
    },

    onGridAfterRowDataLoad: function (e, data) {
        
        this._super.onGridAfterRowDataLoad.apply(this, arguments);
        if ($.isArray(data.result.Data))
            this.makeMergeData(data.result.Data);
    },

});