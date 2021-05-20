window.__define_resource && __define_resource("LBL03607","LBL03674","MSG01136","LBL93508","LBL01595","LBL07993","MSG03548","LBL10749","LBL14192","LBL10444","LBL00445","LBL02671","BTN00069","BTN00065","BTN00033","BTN00007","BTN00008","LBL09180","LBL04417","LBL03589","LBL03682","LBL07992","LBL07280","MSG00299","MSG00759","MSG00766","MSG00765","MSG04564","LBL03609");
/****************************************************************************************************
1. Create Date : 2016.04.14 
2. Creator     : 임명식
3. Description : 전자결재, 재고결재, 결재라인 선택등록  Register Apvl. Line  
4. Precaution  :
5. History     : CongKhanh - Add logic code for [Save], [Update], [Delete] functions
               :  2019.01.03 Ngọc Hân A18_04272 - FE 리팩토링_페이지 일괄작업 (Remove $el at function setGridCustomMergeArrow2)   
6. Old File    : ECMain/EGD/EGD002P_01.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.input", "EGD002P_01", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    gridCustomerColumn: {
        APP_ID: null, APP_DT: null, APP_STATUS: null, CSS: "", KEY: {}, CANCEL: "N"
    },

    //해더용 머지
    headerMergeData: {},

    //1차용
    firstMergeData: {},

    //2차용
    secondMergeData: {},

    ///지정된 row에만 컨트롤('+') 표시되도록 지정('data-key'와 동일 값)
    firstMergeRow: 3,

    //지정된 row에만 컨트롤('+') 표시되도록 지정('data-key'와 동일 값)
    secondMergeRow: 3,

    isLoadIndex: false,

    drafter: {},

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        // Get drafter / Lấy người soạn thảo
        this.drafter = this.viewBag.InitDatas.approvalData.ApprovalDetails.where(function (n) { return n.APP_TYPE == 1 && n.SEQ == 1; }).first();
        this.drafter.CHK_FLAG = true;
        this.isShowUseFacto = "Y";
        this.hasWholeRowLayout = true;

        if (options && options.pageOption && options.pageOption.isShowUseFacto) {
            this.isShowUseFacto = options.pageOption.isShowUseFacto;
        }
        if (this.viewBag.DefaultOption.MenuType == "EApproval") {
            this.isShowUseFacto = "N";
        }
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
        header.setTitle(ecount.resource.LBL03607);

    },

    onInitContents: function (contents) {
        var _self = this;
        var form1 = widget.generator.form(),
            controls = new Array(),
            toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            apvlLine = widget.generator.grid(),
            apvlLine2 = widget.generator.grid();

        // header 머지용
        this.headerMergeData['_ROW_TYPE'] = 'TOTAL';
        this.headerMergeData['_MERGE_USEOWN'] = true;
        this.headerMergeData['_IS_CENTER_ALIGN'] = true;
        this.headerMergeData['_COLSPAN_COUNT'] = 0;
        this.headerMergeData['_MERGE_START_INDEX'] = 0;

        // rowdata 머지용 - ygh #21
        this.firstMergeData['_ROW_TYPE'] = 'TOTAL';
        this.firstMergeData['_MERGE_USEOWN'] = true;
        this.firstMergeData['_STYLE_USEOWN'] = true;
        this.firstMergeData['_ROWSPAN_COUNT'] = 4;
        this.firstMergeData['_MERGE_START_INDEX'] = 0;
        this.secondMergeData = Object.clone(this.firstMergeData);

        // Initialize form and grids's data / Khởi tạo dữ liệu cho biểu mẫu và các grid phê duyệt
        var editData = this.viewBag.InitDatas.EditApvlData;
        var rowData = (!this.fnIsCommon() && editData != undefined && editData != null) ? this.fnGetCommonData(editData) : this.getApprovalData(this.firstMergeData, this.secondMergeData);

        // Initialize form / Khởi tạo biểu mẫu
        if (!this.fnIsCommon()) {
            // Set checkboxes values / Thiết lập giá trị cho các checkbox
            var nameYN = '',
                signOnOneLineYN = '';
            if (this.fnIsEditMode()) {
                var masterApvl = editData.where(function (x) { return x.SER_NO == 1 }).first();
                nameYN = masterApvl.NAME_YN == 'Y' ? 'N' : '';
                signOnOneLineYN = masterApvl.SIGNONELINE_YN == 'Y' ? 'P' : '';
            }
            form1.useInputForm()
                 .template("register")
                 .executeValidateIfVisible()
                 .useFixed(true);

            controls.push(ctrl.define('widget.input.codeName', 'APVL_NAME', 'APVL_NAME', ecount.resource.LBL03674)
                              .value(this.fnIsEditMode() ? this.apvlName : '')
                              .filter("maxlength", { message: String.format(ecount.resource.MSG01136, 30, 30), max: 30 })
                              .dataRules(['required'], '')
                              .end());
            //controls.push(ctrl.define("widget.checkbox", "APVL_SETTINGS", "APVL_SETTINGS", ecount.resource.LBL93508)
            //                  .label([ecount.resource.LBL01595, ecount.resource.LBL07993])
            //                  .value(["N", "P"]).inline().popover(ecount.resource.MSG03548)
            //                  .select(nameYN, signOnOneLineYN).end());
            form1.addControls(controls);
            contents.add(form1);

        } else {
            toolbar.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
                   .addLeft(ctrl.define("widget.button", "appLoad", "appLoad").label(ecount.resource.LBL10749))
                   .addLeft(ctrl.define("widget.button", "PersonalApvlLine", "PersonalApvlLine").label(ecount.resource.LBL14192));
            contents.add(toolbar)
        }
        // Initialize approval 1 grid / Khởi tạo lưới phê duyệt 1
        apvlLine
            .setColumnRowCustom([1, 0], [{ '_MERGE_SET': new Array(this.headerMergeData) }])    // 헤더 머지 
            .setRowData(rowData.firstData)
            .setEventWidgetTriggerObj(this.events)
            .setColumnPropertyColumnName("id")
            .setEditable(true, 3, 0)
            .setColumnPropertyNormalize("upper")
            .setEditLimitAddRow(10)
            .setEditRowDataSample(this.gridCustomerColumn)
            .setEditableUseViewMode(ecount.config.user.IS_SLIP_INPUTTYPE_MOVE)
            //.setEditRowShowInputOutLine('activeRow')
            .setColumns([
                { propertyName: 'SL_DES', id: 'SL_DES', controlOption: { maxLength: 30 }, controlType: 'widget.input.general', title: String.format(ecount.resource.LBL10444, "1"), width: '', align: 'left' },
                { propertyName: 'MERGEADDROW1', id: 'MERGEADDROW1', title: '', width: 30, align: 'center'/*, controlType: 'widget.mergeAddRow'*/ },
                { propertyName: 'CHK_FLAG', id: 'CHK_FLAG', controlType: 'widget.checkbox', align: "center", width: '30', columnOption: { attrs: { 'disabled': false } } },
                { propertyName: 'APP_ID_NAME', id: 'APP_ID_NAME', controlOption: { codeType: 4 }, controlType: 'widget.code.user', title: ecount.resource.LBL00445, width: '', align: 'left' },
                { propertyName: 'SIGN_TITLE', id: 'SIGN_TITLE', controlOption: { maxLength: 40 }, controlType: 'widget.input.general', title: ecount.resource.LBL02671, width: '', align: 'left' },
            ])
            .setCustomRowCell('APP_ID_NAME', this.setGridCustomSignId.bind(this))
            .setCustomRowCell('MERGEADDROW1', this.setGridCustomMergeArrow.bind(this))
            .setCustomRowCell('CHK_FLAG', this.setGridCustomChkFlag.bind(this))
            .setCustomRowCell('SIGN_TITLE', this.setGridCustomSignTitle.bind(this));

        // Initialize approval 2 grid / Khởi tạo lưới phê duyệt 2
        apvlLine2
            .setColumnRowCustom([1, 0], [{ '_MERGE_SET': new Array(this.headerMergeData) }])    // 헤더 머지 
            .setRowData(rowData.secondData)
            .setEventWidgetTriggerObj(this.events)
            .setColumnPropertyColumnName("id")
            .setEditable(true, 3, 0)
            .setColumnPropertyNormalize("upper")
            .setEditLimitAddRow(10)
            .setEditRowDataSample(this.gridCustomerColumn)
            .setEditableUseViewMode(ecount.config.user.IS_SLIP_INPUTTYPE_MOVE)

            .setColumns([
                { propertyName: 'SL_DES', id: 'SL_DES', controlOption: { maxLength: 30 }, controlType: 'widget.input.general', title: String.format(ecount.resource.LBL10444, "2"), width: '', align: 'left' },
                { propertyName: 'MERGEADDROW2', id: 'MERGEADDROW2', title: '', width: 30, align: 'center'/*, controlType: 'widget.mergeAddRow'*/ },
                { propertyName: 'CHK_FLAG', id: 'CHK_FLAG', controlType: 'widget.checkbox', align: "center", width: '30', columnOption: { attrs: { 'disabled': false } } },
                { propertyName: 'APP_ID_NAME', id: 'APP_ID_NAME', controlOption: { codeType: 4 }, controlType: 'widget.code.user', title: ecount.resource.LBL00445, width: '', align: 'left' },
                { propertyName: 'SIGN_TITLE', id: 'SIGN_TITLE', controlOption: { maxLength: 40 }, controlType: 'widget.input.general', title: ecount.resource.LBL02671, width: '', align: 'left' },
            ])
            .setCustomRowCell('APP_ID_NAME', this.setGridCustomSignId2.bind(this))
            .setCustomRowCell('MERGEADDROW2', this.setGridCustomMergeArrow2.bind(this))
            .setCustomRowCell('SIGN_TITLE', this.setGridCustomSignTitle2.bind(this));

        contents
            .addGrid("apvlLine" + this.pageID, apvlLine)
            .addGrid("apvlLine2" + this.pageID, apvlLine2);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        var isCommon = this.fnIsCommon();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(isCommon == true ? ecount.resource.BTN00069 : ecount.resource.BTN00065).clickOnce());

        if (!isCommon) {
            if (this.fnIsEditMode())
                toolbar.addLeft(ctrl.define("widget.button", "Delete").label(ecount.resource.BTN00033).clickOnce());
            else
                toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007));
        }

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        if (isCommon) {
            if (this.isShowUseFacto == "Y") {
                toolbar.addLeft(ctrl.define("widget.label", "text").label(ecount.resource.LBL09180 + " : "))
                       .addLeft(ctrl.define("widget.radio", "useFactoApproval").label([ecount.resource.LBL04417, ecount.resource.LBL03589]).value(["Y", "N"]).select(this.viewBag.InitDatas.approvalData.ApprovalMaster.USE_FACTO_APPROVAL));
            }
        } else {
            if (this.fnIsEditMode())
                toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }

        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadComplete: function (e) {
        var grid = this.contents.getGrid("apvlLine" + this.pageID).grid;
        grid.setEditable(false, 'APP_ID_NAME', "0");
        if (!this.fnIsCommon()) {
            this.contents.getControl("APVL_NAME").setFocus(0);
        } else {
            grid.setCellFocus("SIGN_TITLE", "0");
        }
    },

    onMessageHandler: function (event, data) {
        var firstData = data.data || data,
            _self = this;
        var callback = Object.clone(data.callback, true);
        switch (event.pageID) {
            case "EGD008P_03":
                this.isLoadIndex = true;
                this.setGridDataReBinding(firstData);
                break;
            case 'EGD002P_02':
            case 'CM013P':

                if (data.data != undefined && data.data != null) {
                    if (data.data.CANCEL == 'N') {
                        this.fnIsGridRowChecked(event.gridID, 'CHK_FLAG', data.control.rowIdx, true);
                    } else {
                        // TODO: Handle unactived user / Xử lý người dùng không hoạt động
                    }
                }
                break;
        }

        this.setTimeout(function () {
            callback && callback();
            //data.callback && data.callback(false);
        }.bind(this), 0);
    },

    onPopupHandler: function (control, config, handler) {
        if (control.id == "APP_ID_NAME" && this.PrgType == "G") {
            //config.url = "/ECERP/Popup.Search/CM013P";
            //config.isAddDisplayFlag = false;
            //config.IsTitleFlag = true;
            //config.SubTitle = ecount.resource.LBL03682;
            //config.SEARCH_RANGE = "A";
            $.extend(config, {
                IsAppLine: true,
                GwUse: true,
                isCheckBoxDisplayFlag: false
            });
            //config.isPerson = true;
            //config.MENU_TYPE = '';

            config.isPerson = false;
            config.Type = false;
        }
        else {
            if (control.id == "APP_ID_NAME" && this.PrgType != "G") {
                config.url = "/ECERP/Popup.Search/CM013P";
                config.isAddDisplayFlag = false;
                config.IsTitleFlag = true;
                config.SubTitle = ecount.resource.LBL03682;
                config.SEARCH_RANGE = "A";
            }

        }

        handler(config);
    },

    onFocusOutControlHandler: function (control) {
        this._super.onLoadComplete.apply(this, arguments);

    },

    onChangeControl: function (event, data) {
        //if (event.cid == 'APP_ID_NAME') {
        //    var data = event.__self;
        //    var grid = this.fnGetGrid(data.gridID);
        //    var approver = grid.getCell('APP_ID_NAME', data.rowIdx);
        //    var position = grid.getCell('SIGN_TITLE', data.rowIdx);
        //    if ($.isEmpty(approver) && $.isEmpty(position)) {
        //        this.fnIsGridRowChecked(data.gridID, 'CHK_FLAG', data.rowIdx, false);
        //    }
        //}
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        parameter.SEARCH_RANGE = "A"
        handler(parameter);
    },

    onFocusOutHandler: function (event) {
        var grid = this.contents.getGrid("apvlLine" + this.pageID).grid;
        grid.setCellFocus("SL_DES", grid.getRowKeyByIndex(0));
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridRenderComplete: function (e, obj, klass) {
        this._super.onGridRenderComplete.apply(this, arguments);

        if (klass.id === "apvlLine" + this.pageID) {
            var grid = this.contents.getGrid("apvlLine" + this.pageID).grid;
            grid.setEditable(false, 'APP_ID_NAME', "0");
            // grid.setEditable(false, 'SIGN_TITLE', "0");
            if (!this.fnIsCommon()) {
                // Set apvl name / Thiết lập tên phê duyệt
                if (this.apvlName != undefined && !$.isEmpty(this.apvlName)) {
                    this.contents.getControl('APVL_NAME').setValue(this.apvlName);
                }
                grid.setEditable(false, 'SIGN_TITLE', "0");
            } else {
                grid.setCellFocus("SIGN_TITLE", grid.getRowKeyByIndex(0));
            }
            //if (grid.getRowCount() == 10) this.fnHideAddRow('MERGEADDROW1');
        } else if (klass.id === "apvlLine2" + this.pageID) {
            var grid2 = this.contents.getGrid("apvlLine2" + this.pageID).grid;
            if (this.isLoadIndex) {
                var sendData = this.getSendMessageData();
                if (sendData.errCount > 0) {
                    this.contents.getGrid(sendData.errFristGridId).grid.setCellFocus(sendData.errFirstCol, sendData.errFirstRow);
                }
            }
            //if (grid2.getRowCount() == 10) this.fnHideAddRow('MERGEADDROW2');
        }
    },

    setGridCustomChkFlag: function (value, rowItem) {
        var option = {};
        if (rowItem[ecount.grid.constValue.keyColumnPropertyName] == 0) {
            option.controlType = 'widget.label';
            option.data = '';
        }

        return option;
    },

    setGridCustomMergeArrow: function (value, rowItem) {
        var option = {},
            self = this;


        var rowCount = this.contents.getGrid("apvlLine" + this.pageID).grid.getRowCount();

        if (rowCount < 10) {
            if (rowItem[ecount.grid.constValue.rowCountColumnPropertyName] == rowCount) {
                option.controlType = "widget.mergeAddRow";
                option.event = {
                    'click': function (event, object) {
                        event.preventDefault();
                        self.contents.getGrid("apvlLine" + self.pageID).grid.refreshCell("MERGEADDROW1", object.rowKey);
                        self.contents.getGrid("apvlLine" + self.pageID).grid.setCellFocus("APP_ID_NAME", object.rowIdx + 1);
                        //if (object.rowIdx == 8) {
                        //    self.fnHideAddRow('MERGEADDROW1');
                        //}
                    }.bind(this)
                };
            }
        }
        
        return option;

        //option.data = { 'controlViewTargetRow': [this.firstMergeRow] }; // 지정된 row에만 컨트롤('+') 표시되도록 지정('data-key'와 동일 값) - ygh #21
        //option.event = {
        //    'click': function (event, object) {
        //        event.preventDefault();
        //        self.contents.getGrid("apvlLine" + self.pageID).grid.setCellFocus("APP_ID_NAME", object.rowIdx + 1);
        //        if (object.rowIdx == 8) {
        //            self.fnHideAddRow('MERGEADDROW1');
        //        }
        //    }.bind(this)
        //};
        //return option;
    },

    setGridCustomMergeArrow2: function (value, rowItem) {
        var option = {},
            self = this;

        var rowCount = this.contents.getGrid("apvlLine2" + this.pageID).grid.getRowCount();

        if (rowCount < 10) {
            if (rowItem[ecount.grid.constValue.rowCountColumnPropertyName] == rowCount) {
                option.controlType = "widget.mergeAddRow";
                option.event = {
                    'click': function (event, object) {
                        event.preventDefault();
                        self.contents.getGrid("apvlLine2" + self.pageID).grid.refreshCell("MERGEADDROW2", object.rowKey);
                        self.contents.getGrid("apvlLine2" + self.pageID).grid.setCellFocus("APP_ID_NAME", object.rowIdx + 1);
                        //if (object.rowIdx == 8) {
                        //    self.fnHideAddRow('MERGEADDROW2');
                        //}
                    }.bind(this)
                };
            }
        }

        return option;

        //option.data = { 'controlViewTargetRow': [this.secondMergeRow] }; // 지정된 row에만 컨트롤('+') 표시되도록 지정('data-key'와 동일 값) - ygh #21
        //option.event = {
        //    'click': function (event, object) {
        //        self.contents.getGrid("apvlLine2" + self.pageID).grid.setCellFocus("APP_ID_NAME", object.rowIdx + 1);
        //        if (object.rowIdx == 8) {
        //            self.fnHideAddRow('MERGEADDROW2');
        //        }               
        //        self.contents.scrollTop();
        //    }.bind(this)
        //};
        //return option;
    },

    setGridCustomSignId: function (value, rowItem) {
        //this.setGridDateCustomIdDes(value, rowItem, "apvlLine" + this.pageID).bind(this);
        var option = {},
           grid = this.contents.getGrid("apvlLine" + this.pageID).grid;
        option.event = {
            'focus': function (event, gridData) {
            }.bind(this),
            'change': function (e, data) {
                if ($.isEmpty(data.rowItem.APP_ID_NAME)) {
                    grid.setCell("APP_ID", data.rowItem[ecount.grid.constValue.keyColumnPropertyName], "");
                    grid.setCell('CANCEL', data.rowItem[ecount.grid.constValue.keyColumnPropertyName], "N");
                }
            }.bind(this)
        };
        option.controlOption = {
            'maxLength': 50,
            'codeType': 3,
            'controlEvent': {
                'itemSelect': function (rowKey, arg) {
                    if (arg.type == 'addCode') {
                        var rowData = arg.message.data;
                        grid.setCell('APP_ID', rowKey, rowData['ID']);
                        grid.setCell('APP_ID_NAME', rowKey, rowData['UNAME']);
                        grid.setCell('CANCEL', rowKey, rowData['CANCEL']);
                        grid.setNextFocus("APP_ID_NAME", rowKey);
                    }
                }.bind(this)
            }
        };
        return option;
    },

    setGridCustomSignId2: function (value, rowItem) {
        //this.setGridDateCustomIdDes(value, rowItem, "apvlLine2" + this.pageID).bind(this);
        var option = {},
           grid = this.contents.getGrid("apvlLine2" + this.pageID).grid;
        option.event = {
            'focus': function (event, gridData) {
            }.bind(this),
            'change': function (e, data) {
                if ($.isEmpty(data.rowItem.APP_ID_NAME)) {
                    grid.setCell("APP_ID", data.rowItem[ecount.grid.constValue.keyColumnPropertyName], "");
                    grid.setCell('CANCEL', data.rowItem[ecount.grid.constValue.keyColumnPropertyName], "N");
                }
            }.bind(this)
        };
        option.controlOption = {
            'maxLength': 50,
            'codeType': 3,
            'controlEvent': {
                'itemSelect': function (rowKey, arg) {
                    if (arg.type == 'addCode') {
                        var rowData = arg.message.data;
                        grid.setCell('APP_ID', rowKey, rowData['ID']);
                        grid.setCell('APP_ID_NAME', rowKey, rowData['UNAME']);
                        grid.setCell('CANCEL', rowKey, rowData['CANCEL']);
                        grid.setNextFocus("APP_ID_NAME", rowKey);
                    }
                }.bind(this)
            }
        };
        return option;
    },

    setGridCustomSignTitle: function (value, rowItem) {
        var option = {},
            grid = this.contents.getGrid("apvlLine" + this.pageID).grid;
        option.event = {
            'setNextFocus': function (event, gridData) {
                if (gridData.rowIdx == grid.getRowCount() - 1 && (!$.isEmpty(gridData.oldValue) || !$.isEmpty(gridData.newValue))) {
                    grid.activeCellFocusout();
                    this.fnSetGridRowFocus("apvlLine2" + this.pageID, 'SL_DES', "0");
                    this.fnGetGrid("apvlLine1" + this.pageID).refreshCell('SIGN_TITLE', gridData.rowIdx);
                }
            }.bind(this)
        };
        return option;
    },

    setGridCustomSignTitle2: function (value, rowItem) {
        var option = {},
           grid = this.contents.getGrid("apvlLine2" + this.pageID).grid;
        option.event = {
            'setNextFocus': function (event, gridData) {
                if (gridData.rowIdx == grid.getRowCount() - 1) {
                    grid.activeCellFocusout();
                    this.footer.getControl("Save").setFocus(0);
                }
            }.bind(this)
        };
        return option;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    //결재라인 불러오기
    onContentsAppLoad: function () {
        var self = this;
        this.openWindow({
            url: '/ECERP/Popup.Search/EGD008P_03',
            name: ecount.resource.LBL07992,
            param: {
                width: 400,
                height: 450,
                PrgType: self.PrgType,
                IsChange: true
            },
            additional: true
        });
    },

    // My apvl line button click event / Sự kiện click nút dòng phê duyệt cá nhân
    onContentsPersonalApvlLine: function () {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGD008P_03',
            name: ecount.resource.LBL14192, 
            param: {
                width: 400,
                height: 450,
                IsPersonalApvlLine: false,
                PrgType: "P",
                IsChange: true
            },
            additional: true
        });
    },

    //닫기 close
    onFooterClose: function () {
        this.close();
    },

    // Reset button / Nút reset
    onFooterReset: function () {
        var param = {
            IDX_NO: this.IDX_NO,
            PrgType: this.PrgType,
            EditFlag: this.EditFlag
        };
        // Reload popup using edit flag (1: I, 2: M) / Tải lại popup dựa vào cờ kiểm tra sửa
        this.onAllSubmitSelf('/ECERP/Popup.Common/EGD002P_01', param);
    },

    onFooterHistory: function () {
        this.openWindow({
            url: '/ECERP/SVC/Popup/ES303P',
            name: ecount.resource.LBL07280,
            additional: false,
            param: {
                width: 455,
                height: 300,
                Request: {
                    historySlipNo: this.PrgType + this.IDX_NO,
                    menuType: "16"
                }
            }
        });
    },

    onFooterDelete: function () {
        var self = this;

        // Get user's confirm before deleting / Lấy xác nhận của người dùng trước khi xóa
        ecount.confirm(ecount.resource.MSG00299, function (confirm) {
            if (confirm == false) {
                self.footer.getControl("Delete").setAllowClick();
                return;
            }
            // Show progress bar / Hiển thị thanh tiến trình
            self.showProgressbar(true);

            // Initialize data / Khởi tạo dữ liệu
            var param = {
                IDX_NO: self.IDX_NO,
                PRG_TYPE: self.PrgType,
                SER_NO: 0
            };

            // Call API to delete selected items / Gọi API xóa những mục được chọn
            ecount.common.api({
                url: "/Groupware/EApproval/DeleteApvlLine",
                data: Object.toJSON(param),
                complete: function () {
                    // Hide progress bar / Ẩn thanh tiến trình
                    self.hideProgressbar(true);
                },
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg);
                    } else {
                        var data = result.Data;
                        // Check if error exists then process it / Kiểm tra nếu có lỗi thì xử lý
                        if (data != null && data != undefined && data.ErrKey != null && data.Message != null) {
                            ecount.alert(data.Message);
                        } else {
                            self.sendMessage(self, { cmd: "DELETE" });
                            self.setTimeout(function () {
                                self.close();
                            }, 0);
                        }
                    }
                }
            });

            self.footer.getControl("Delete").setAllowClick();
        });
    },

    //적용
    onFooterSave: function (e) {

        var self = this;
        // Get and validate data for common / Lấy và kiểm tra dữ liệu cho common
        if (this.fnIsCommon()) {
            var sendData = this.getSendMessageData();
            if (sendData.errCount > 0) {
                this.footer.getControl("Save").setAllowClick();
                this.contents.getGrid(sendData.errFristGridId).grid.setCellFocus(sendData.errFirstCol, sendData.errFirstRow);
                return false;
            }

            var checkcnt = false;
            if (sendData.appData.ApprovalDetails.where(function (n) { return n.APP_TYPE == 2; }).length > 0) {
                checkcnt = true;
            }

            if (sendData.appData.ApprovalDetails.where(function (n) { return n.APP_TYPE == 1; }).length < 2) {
                if (!checkcnt) {
                    ecount.alert(ecount.resource.MSG00759, function () {
                        this.contents.getGrid("apvlLine" + this.pageID).grid.setCellFocus("APP_ID_NAME", "1");
                    }.bind(this));
                    this.footer.getControl("Save").setAllowClick();
                    return false;
                }
            }
            var message = {
                name: "APP_ID_NAME",
                code: "APP_ID",
                data: sendData.appData.ApprovalDetails,

                callback: this.close.bind(this),
                originalDataset: sendData.appData,
            };
            if (this.isOldFrame) {
                opener.setApprovalUser(message);
                window.close();
            } else {
                this.sendMessage(this, message);
            }
        } else { // Get and validate data for saving / Lấy và kiểm tra dữ liệu cho saving
            var param = this.fnGetSaveData();
            if (!param) {
                this.footer.getControl("Save").setAllowClick();
                return false;
            }
            self.showProgressbar(true);
            ecount.common.api({
                url: '/Groupware/EApproval/SaveApvlLine',
                data: Object.toJSON(param),
                success: function (result) {
                    if (result.Status != '200')
                        ecount.alert(result.fullErrorMsg);
                    else {
                        var data = result.Data;
                        if (data != null && data != undefined && data.ErrKey != null && data.Message != null) {
                            ecount.alert(data.Message);
                        } else {
                            // Reload grid / Tải lại lưới
                            self.sendMessage(self, { cmd: 'SAVE' });
                            // If type is default save then reload grid and close popup / Nếu kiểu lưu trữ là 1 hay mặc định thì sẽ tải lại lưới và đóng popup
                            self.setTimeout(function () {
                                self.close();
                            }, 0);
                        }
                    }
                },
                complete: function () {
                    self.hideProgressbar(true);
                }
            });

        }
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    getSendMessageData: function () {
        var data = this.viewBag.InitDatas.approvalData, _self = this;
        if (this.fnIsCommon()) {
            if (this.isShowUseFacto == "Y") {
                data.ApprovalMaster.USE_FACTO_APPROVAL = this.footer.getControl("useFactoApproval").getValue();
            }
        }
        data.ApprovalDetails.clear();

        var firstGrid = this.contents.getGrid("apvlLine" + this.pageID).grid;
        var secondGrid = this.contents.getGrid("apvlLine2" + this.pageID).grid;
        var errCnt = 0, errFristGridId, errFirstRow, errFirstCol;

        for (var i = 1; i < 3; i++) {
            var firstData = this.getAppUserDataMerge(data, i, errFristGridId, errFirstRow, errFirstCol);
            data = firstData.appData;
            errCnt = errCnt + firstData.errCount;
            errFristGridId = firstData.errFristGridId;
            errFirstRow = firstData.errFirstRow;
            errFirstCol = firstData.errFirstCol
        }

        return {
            appData: data,
            errCount: errCnt,
            errFristGridId: errFristGridId,
            errFirstRow: errFirstRow,
            errFirstCol: errFirstCol
        }
    },

    //1,2차 데이터 병합
    getAppUserDataMerge: function (data, appType, errFristGridId, errFirstRow, errFirstCol) {
        var seq = 1, errCnt = 0, _self = this;
        var gridId = (appType == 1 ? "apvlLine" : "apvlLine2") + _self.pageID;
        var firstGrid = this.contents.getGrid(gridId).grid;

        $.each(firstGrid.getRowList(), function (i, appdata) {
            var slDes;

            if (i == 0) {
                data.ApprovalMaster[(appType == 1 ? "SL_DES" : "SL_DES2")] = appdata.SL_DES
                slDes = appdata.SL_DES;

                if (appType == 1)
                    appdata.CHK_FLAG = true;
            }

            if (appdata.CHK_FLAG == false)
                return true;

            if ((!$.isEmpty(appdata.APP_ID) && $.isEmpty(appdata.SIGN_TITLE)) || ($.isEmpty(appdata.APP_ID) && !$.isEmpty(appdata.SIGN_TITLE)) || appdata.CANCEL == "Y") {
                var options = {
                    placement: 'top', //top, bottom, left, right
                    message: ''
                };
                if ((!$.isEmpty(appdata.APP_ID) && $.isEmpty(appdata.SIGN_TITLE))) {
                    options.message = ecount.resource.MSG00766;
                    firstGrid.setCellShowError("SIGN_TITLE", appdata[ecount.grid.constValue.keyColumnPropertyName], options);
                    errFirstCol = $.isEmpty(errFirstCol) ? "SIGN_TITLE" : errFirstCol;
                } else if ($.isEmpty(appdata.APP_ID) && !$.isEmpty(appdata.SIGN_TITLE)) {
                    options.message = ecount.resource.MSG00765;
                    firstGrid.setCellShowError("APP_ID_NAME", appdata[ecount.grid.constValue.keyColumnPropertyName], options);
                    errFirstCol = $.isEmpty(errFirstCol) ? "APP_ID_NAME" : errFirstCol;
                } else if (!$.isEmpty(appdata.APP_ID) && appdata.CANCEL == "Y") {
                    options.message = ecount.resource.MSG04564;
                    firstGrid.setCellShowError("APP_ID_NAME", appdata[ecount.grid.constValue.keyColumnPropertyName], options);
                    errFirstCol = $.isEmpty(errFirstCol) ? "APP_ID_NAME" : errFirstCol;
                }
                errFristGridId = $.isEmpty(errFristGridId) ? gridId : errFristGridId;
                errFirstRow = $.isEmpty(errFirstRow) ? appdata[ecount.grid.constValue.keyColumnPropertyName] : errFirstRow;
                errCnt++;
            } else {
                var key = {
                    APP_TYPE: appType,
                    COM_CODE: "",
                    IO_DATE: "",
                    IO_NO: 0,
                    SEQ: 0,
                    SLIP_CD: ""
                };
                if (!$.isEmpty(appdata.APP_ID)) {
                    key.SEQ = seq++;
                    data.ApprovalDetails.push($.extend({}, {
                        //Key: key,
                        SL_DES: slDes,
                        SIGN_TITLE: appdata.SIGN_TITLE,
                        APP_ID: appdata.APP_ID,
                        APP_ID_NAME: appdata.APP_ID_NAME,
                        CSS: appType == 1 ? "primary" : "danger",
                        APP_STATUS: appType == 1 && key.SEQ == 1 ? 1 : 0,
                        APP_DT: null
                    }, key));
                }
            }
        });

        return {
            appData: data,
            errCount: errCnt,
            errFristGridId: errFristGridId,
            errFirstRow: errFirstRow,
            errFirstCol: errFirstCol
        }
    },

    //넘어온 데이터 바인딩하도록 변경
    getApprovalData: function (first, second, selectData) {
        var apvlDetails = selectData || this.viewBag.InitDatas.approvalData.ApprovalDetails;
        var firstData, secondData, self = this;

        if (this.fnIsInsertMode()) {
            var data = apvlDetails.where(function (n) { return n.SEQ == 1; }).first();
            data.APP_ID_NAME = ecount.resource.LBL03609;
            data.SIGN_TITLE = ecount.resource.LBL02671;
        }

        // Setting apvl to right position / Thiết lập vị trí cho phê duyệt
        if (this.fnIsCommon()) {
            $.extend();
            firstData = apvlDetails.where(function (n) { return n.APP_TYPE == 1; });
            secondData = apvlDetails.where(function (n) { return n.APP_TYPE == 2; });

        }
        else {
            firstData = this.fnFillApvlData(apvlDetails, 1);
            secondData = this.fnFillApvlData(apvlDetails, 2);
        }

        first['_ROWSPAN_COUNT'] = this.fnGetGreaterThanOrDefaultValue(firstData.length, 3);
        second['_ROWSPAN_COUNT'] = this.fnGetGreaterThanOrDefaultValue(secondData.length, 3);

        firstData[0]["SL_DES"] = this.viewBag.InitDatas.approvalData.ApprovalMaster.SL_DES || '';
        if (secondData.length > 0) {
            secondData[0]["SL_DES"] = this.viewBag.InitDatas.approvalData.ApprovalMaster.SL_DES2 || '';
        }

        firstData.forEach(function (saleItem, i) {
            //saleItem['_MERGE_SET'] = new Array(first);
            if (self.fnIsCommon() && !self.isLoadIndex && !$.isEmpty(saleItem.APP_ID_NAME) && !$.isEmpty(saleItem.SIGN_TITLE)) {
                saleItem.CHK_FLAG = true;
            }
        });
        firstData.length > 0 && (firstData[0]['_MERGE_SET'] = new Array(first));

        secondData.forEach(function (saleItem, i) {
            //saleItem['_MERGE_SET'] = new Array(second);
            if (self.fnIsCommon() && !self.isLoadIndex && !$.isEmpty(saleItem.APP_ID_NAME) && !$.isEmpty(saleItem.SIGN_TITLE)) {
                saleItem.CHK_FLAG = true;
            }
        });

        secondData.length > 0 && (secondData[0]['_MERGE_SET'] = new Array(second));

        this.firstMergeRow = this.fnGetGreaterThanOrDefaultValue(firstData.length - 1, 2);
        this.secondMergeRow = this.fnGetGreaterThanOrDefaultValue(secondData.length - 1, 2);
        return {
            firstData: firstData,
            secondData: secondData,
            firstMergeRow: this.fnGetGreaterThanOrDefaultValue(firstData.length - 1, 2),
            secondMergeRow: this.fnGetGreaterThanOrDefaultValue(secondData.length - 1, 2),
        }

    },

    //결재라인 불러오기 바인딩
    setGridDataReBinding: function (editData) {
        debugger;
        if (!$.isEmpty(editData)) {
            var result = this.fnGetCommonData(editData);
            var grid = this.contents.getGrid("apvlLine" + this.pageID);
            grid.settings.setRowData(result.firstData)
            grid.draw();
            var grid2 = this.contents.getGrid("apvlLine2" + this.pageID);
            grid2.settings.setRowData(result.secondData)
            grid2.draw();
        }
    },

    // Check if this popup is common or not / Kiểm tra popup này có phải là common hay không
    fnIsCommon: function () {
        return this.EditFlag == undefined || this.EditFlag == null || (this.EditFlag != 'I' && this.EditFlag != 'M');
    },

    // Check if [new] mode is on / Kiểm tra nếu chế độ là thêm mới 
    fnIsInsertMode: function () {
        return this.EditFlag != undefined && this.EditFlag == 'I';
    },

    // Check if [modify] mode is on / Kiểm tra nếu chế độ là chỉnh sửa
    fnIsEditMode: function () {
        return this.EditFlag != undefined && this.EditFlag == 'M';
    },

    // Convert common data to edit data for inserting and updating / Chuyển đổi dữ liệu common thành dữ liệu dùng để thêm mới và cập nhật
    fnGetEditData: function (commonData) {
        var editData = [],
            self = this;
        $.each(commonData, function (i, item) {
            editData.push({
                PRG_TYPE: self.PrgType,
                SER_NO: item.APP_TYPE == 1 ? item.SEQ : item.SEQ + 10,
                IDX_NO: self.fnIsEditMode() ? self.IDX_NO : 0,
                SIGN_ID: item.APP_ID,
                SIGN_NAME: item.APP_ID_NAME,
                SIGN_TITLE: item.SIGN_TITLE,
                CHK_FLAG: item.CHK_FLAG == 'Y' ? true : false
            });
        });
        return editData;
    },

    // Convert from edit data to common data for showing on grids / Chuyển đổi dữ liệu lấy từ db thành dữ liệu common để hiển thị lên lưới
    fnGetCommonData: function (editData) {
        var apvlDetails = [],
            self = this;
        $.each(editData, function (i, item) {
            // if (item.CANCEL == 'Y' || item.CHK_FLAG == 'N') {
            if (item.SER_NO === 91) { // Get approval line name 1 / Lấy tên phê duyệt 1
                self.viewBag.InitDatas.approvalData.ApprovalMaster.SL_DES = item.SIGN_TITLE || '';
            } else if (item.SER_NO === 92) { // Get approval line name 2 / Lấy tên phê duyệt 2
                self.viewBag.InitDatas.approvalData.ApprovalMaster.SL_DES2 = item.SIGN_TITLE || '';
            } else { // Remaining is approver / Còn lại là người phê duyệt
                var appType = item.SER_NO <= 10 ? 1 : 2,
                    seq = (item.SER_NO <= 20 && item.SER_NO > 10) ? item.SER_NO - 10 : item.SER_NO,
                    appStatus = appType == 1 && seq == 1 ? 1 : 0;

                // Initialize apvl detail / Khởi tạo chi tiết phê duyệt 
                var apvlDetail = {
                    APP_DT: null,
                    SEQ: seq,
                    APP_ID: item.SIGN_ID,
                    APP_ID_NAME: item.SIGN_NAME,
                    SIGN_TITLE: item.SIGN_TITLE,
                    APP_TYPE: appType,
                    APP_STATUS: appStatus,
                    CHK_FLAG: item.CHK_FLAG == 'Y' ? true : false,
                    CANCEL: item.CANCEL || "Y",
                    CSS: appType == 1 ? 'primary' : 'danger',
                    IO_DATE: '',
                    IO_NO: 0,
                    SLIP_CD: '',
                    SL_DES: ''
                };

                // Assign data for apvl detail when SEQ is 1 / Gán dữ liệu cho chi tiết phê duyệt khi số thứ tự là 1
                if (self.fnIsCommon()) {
                    if (appStatus) {
                        apvlDetail = self.drafter;
                    }
                } else {
                    if (appStatus) {
                        self.apvlName = item.SIGN_TITLE;
                        apvlDetail.APP_ID_NAME = ecount.resource.LBL03609;
                        apvlDetail.SIGN_TITLE = ecount.resource.LBL02671;
                        apvlDetail.CANCEL = 'N';
                        apvlDetail.CHK_FLAG = false;
                    }
                }
                apvlDetails.push(apvlDetail);
            }
        });
        // Add default approver if grid 2 is empty / Thêm người phê duyệt mặc định nếu grid 2 rỗng
        if (!apvlDetails.any(function (x) { return x.APP_TYPE == 2; })) {
            apvlDetails.push({
                APP_DT: null,
                SEQ: 1,
                APP_ID: '',
                APP_ID_NAME: '',
                SIGN_TITLE: '',
                APP_TYPE: 2,
                APP_STATUS: 0,
                CANCEL: "N",
                CSS: 'primary',
                IO_DATE: '',
                IO_NO: 0,
                SLIP_CD: '',
                SL_DES: '',
                CHK_FLAG: false
            });
        }
        return this.getApprovalData(this.firstMergeData, this.secondMergeData, apvlDetails);
    },

    // Fill empty object to apvl list / Đổ đối tượng rỗng vào danh sách phê duyệt
    fnFillApvlData: function (data, appType) {
        var origin = data.where(function (n) { return n.APP_TYPE == appType; });
        var clone = [];
        var max = origin[origin.length - 1].SEQ;
        for (var i = 0; i < origin.length; i++) {
            clone[origin[i].SEQ == 0 ? 0 : origin[i].SEQ - 1] = origin[i];
        }
        for (var i = 0; i < max; i++) {
            if (clone[i] == undefined) {
                clone[i] = {
                    APP_DT: null,
                    SEQ: i + 1,
                    APP_ID: '',
                    APP_ID_NAME: '',
                    SIGN_TITLE: '',
                    APP_TYPE: appType,
                    APP_STATUS: 0,
                    CANCEL: "N",
                    CSS: appType == 1 ? 'primary' : 'danger',
                    IO_DATE: '',
                    IO_NO: 0,
                    SLIP_CD: '',
                    SL_DES: ''
                };
            }
        }
        return clone;
    },

    // Check if value less than default then return default otherwise return value / Kiểm tra nếu giá trị nhỏ hơn giá trị mặc định thì trả về giá trị mặc định ngược lại trả về giá trị
    fnGetGreaterThanOrDefaultValue: function (nValue, nDefault) {
        return nValue < nDefault ? nDefault : nValue;
    },

    // Get data for saving / Lấy dữ liệu để lưu trữ
    fnGetSaveData: function () {
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            // Focus first invalid control / trỏ vào control không hợp lệ đầu tiên
            invalid.result[0][0].control.setFocus(0);
            //invalid.result[0][0].control.showError(invalid.result[0][0].message);
            return false;
        }
        var self = this,
            //checkboxCtrl = this.contents.getControl('APVL_SETTINGS'),
            apvlNameCtrl = this.contents.getControl('APVL_NAME');
        // Declare data object / khai báo đối tượng trả về
        var data = {
            EditFlag: this.EditFlag,
            ApvlList: []
        };

        var master = {
            PRG_TYPE: self.PrgType,
            SER_NO: 1,
            IDX_NO: self.fnIsEditMode() ? self.IDX_NO : 0,
            SIGN_ID: '',
            SIGN_NAME: '',
            SIGN_TITLE: apvlNameCtrl.getValue(),
            NAME_YN: 'N',
            SIGNONELINE_YN: 'N'
        };

        // Get value of 2 checkboxes / Lấy giá trị của 2 checkbox
        //var checked = checkboxCtrl.getCheckedValue();
        //if (checked.contains('N')) {
        //    master.NAME_YN = 'Y';
        //}
        //if (checked.contains('P')) {
        //    master.SIGNONELINE_YN = 'Y';
        //}

        // Store master apvl in 1st child of apvl list / Lưu trữ bản gốc phê duyệt vào thứ tự đầu tiên của danh sách phê duyệt
        data.ApvlList.push(master);

        // Get apvl from 2 grids / Lấy phê duyệt từ 2 lưới
        for (var i = 1; i <= 2; i++) {
            var gridId = (i == 1 ? "apvlLine" : "apvlLine2") + this.pageID;
            var grid = this.contents.getGrid(gridId).grid;
            $.each(grid.getRowList(), function (j, row) {
                // Get apvl name 1, 2 / Lấy tên dòng phê duyệt 1, 2
                if (j == 0) {
                    // 결재방명칭 공백을 허용
                    //if (!$.isEmpty(row.SL_DES)) {
                    data.ApvlList.push({
                        PRG_TYPE: self.PrgType,
                        SER_NO: i == 1 ? 91 : 92,
                        IDX_NO: self.fnIsEditMode() ? self.IDX_NO : 0,
                        SIGN_ID: '',
                        SIGN_NAME: '',
                        SIGN_TITLE: !$.isEmpty(row.SL_DES) ? row.SL_DES : '',
                        NAME_YN: 'N',
                        SIGNONELINE_YN: 'N'
                    });
                    //}
                    if (i == 1) return true; // Skip drafter row / Bỏ qua dòng người soạn thảo
                }
                // Skip empty row / Bỏ qua dòng không có dữ liệu
                if ($.isEmpty(row.APP_ID_NAME) && $.isEmpty(row.SIGN_TITLE)) {
                    return true;
                }
                var seq = j + 1;
                // Push data to apvl list / Đẩy dữ liệu vào danh sách phê duyệt
                data.ApvlList.push({
                    PRG_TYPE: self.PrgType,
                    SER_NO: i == 1 ? seq : seq + 10,
                    IDX_NO: self.fnIsEditMode() ? self.IDX_NO : 0,
                    SIGN_ID: row.APP_ID,
                    SIGN_NAME: row.APP_ID_NAME,
                    SIGN_TITLE: row.SIGN_TITLE,
                    CHK_FLAG: row.CHK_FLAG ? 'Y' : 'N',
                    NAME_YN: 'N',
                    SIGNONELINE_YN: 'N'
                });
            });
        }
        return data;
    },

    //// Hide [+] button / Ẩn nút [+]
    //fnHideAddRow: function (columnId) {
    //    $("a[columnid='" + columnId + "']").attr("style", "visibility: hidden!important");
    //},

    // Get grid by id function / Hàm hỗ trợ lấy đối tượng lưới bằng ID
    fnGetGrid: function (gridID) {
        var gridName = 'apvlLine' + this.pageID;
        if (gridID.indexOf('apvlLine2') > -1) {
            gridName = 'apvlLine2' + this.pageID;
        }
        return this.contents.getGrid(gridName).grid;
    },

    // Set grid row active / Kích hoạt dòng của lưới
    fnIsGridRowChecked: function (gridID, chkColName, rowIdx, isActive) {
        this.fnGetGrid(gridID).setCell(chkColName, rowIdx, isActive);
    },

    // Set grid row focus / Trỏ vào dòng của lưới
    fnSetGridRowFocus: function (gridID, colName, rowIdx) {
        this.fnGetGrid(gridID).setCellFocus(colName, rowIdx);
    },
});