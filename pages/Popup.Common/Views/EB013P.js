window.__define_resource && __define_resource("BTN00113","BTN00351","BTN00007","LBL00602","LBL00600","LBL07966","BTN00043","BTN00069","BTN00008","BTN00603","LBL00598","MSG00962");
/****************************************************************************************************
1. Create Date : 2016.02.04
2. Creator     : Nguyen Anh Tuong
3. Description : Groupcode popup page with edit,list,modify data
4. Precaution  :
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2020.12.07 (Hao) - A20_04998 - 기초등록공통화-관리번호등록
6. Old File    : EB013P.aspx                    
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EB013P", {

    /**************************************************************************************************** 
    * page user opion Variables(User variables and Object) 
    ****************************************************************************************************/

    userPermit: null,


    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    initProperties: function () {
        //exec ESP_ACC220_CM @COM_CODE='99997',@DEL_FLAG=NULL,@PROD_SEARCH=NULL,@PARAM=N'',@SORT_COLUMN='',@SORT_TYPE='A',@PAGE_SIZE=10,@PAGE_CURRENT=2
        this.searchFormParameter = {
            PARAM: '', DEL_FLAG: 'N', PROD_SEARCH: '9', SORT_COLUMN: 'TRADE_NAME'
        };
    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        
        var contents = widget.generator.contents(),
          form1 = widget.generator.form(),
          toolbar = widget.generator.toolbar(),
          ctrl = widget.generator.control();

        //toolbar.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))
        //// Check use button include
        //if (this.isIncludeInactive) {
        //    toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함    
        //}
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label(ecount.resource.BTN00113)
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        form1.add(ctrl.define("widget.input.codeName", "tradeCode", "tradeCode", ecount.resource.LBL00602).end())
             .add(ctrl.define("widget.input.codeName", "tradeName", "tradeName", ecount.resource.LBL00600).end())
        contents.add(form1);    // add template for popup search
        contents.add(toolbar);  // add toolbar for popup search
        header.addContents(contents);

        // Define header 
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL07966).add("search").useQuickSearch();

    },

    // Quick search event / Sự kiện tìm kiếm nhanh
    onHeaderQuickSearch: function (event) {
        this.ispopupCloseUse = true;
        this.header.lastReset(this.searchFormParameter.PARAM);
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        // Initialize Grid
        this.searchFormParameter.Columns = [
                { index: 0, propertyName: 'TRADE_CODE', id: 'TRADE_CODE', title: ecount.resource.LBL00602, width: '' },
                { index: 1, propertyName: 'TRADE_NAME', id: 'TRADE_NAME', title: ecount.resource.LBL00600, width: '' }
        ];

        grid
            .setRowData(this.viewBag.InitDatas.TrackingList)
            .setRowDataUrl("/Inventory/Common/GetListImportTracking")
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['TRADE_CODE', 'TRADE_NAME'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)
            .setColumns(this.searchFormParameter.Columns)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isApplyDisplayFlag)
            .setCheckBoxMaxCount(100)


            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Custom cells
            .setCustomRowCell('TRADE_CODE', this.setGridLink.bind(this))
            .setCustomRowCell('TRADE_NAME', this.setGridLink.bind(this))
            .setEventFocusOnInit(true)

            //Keyboard event
            .setKeyboardCursorMove(true)
            .setKeyboardSpacebarForSelectRow(true)
            .setKeyboardPageMove(true)
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        contents.addGrid("dataGrid" + this.pageID, grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();
        if (this.isNewDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "New").css("btn btn-default").label(ecount.resource.BTN00043))
        }

        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069))
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper"));
        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        
        switch (cid) {
            case "search":
                if (this.isIncludeInactive) {
                    option.addGroup([{ id: 'usegubun', label: ecount.resource.BTN00351 }])
                }
                break;
            default:
                break;
        }
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword))
            this.header.getQuickSearchControl().setValue(this.keyword);

        this.searchFormParameter.PARAM = this.keyword || '';

        if (!e.unfocus)
            this.header.getQuickSearchControl().setFocus(0);
    },

    onMessageHandler: function (page, message) {

        switch(page.pageID)
        {
            case "EBA063P_01":
                if (message.type == 0) {
                    this.ispopupCloseUse = true;
                    this.header.getQuickSearchControl().setValue(message.track_no);
                    this.searchFormParameter.PARAM = message.track_no;
                }
                this.setReload(this);
                break;
            default:
                this.setReload(this);
                break;
        }
        
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    // Event header search (Sự kiện nút tìm kiếm đầu trang)
    onHeaderSearch: function (event) {
        this.ispopupCloseUse = true;
        this.onContentsSearch('button');
    },

    // Event handle button [Inactive]
    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y") {
            // Change button to Include
            this.searchFormParameter.DEL_FLAG = "N";
            this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
        }
        else {
            // Change button to Exclude
            this.searchFormParameter.DEL_FLAG = "Y";
            this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
        }
        this.onContentsSearch('usegubun');
    },

    onButtonUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },

    // Search button click event
    onContentsSearch: function (event) {
       
        var value = this.header.getQuickSearchControl().getValue();
        var _tradeName = "";
        var _tradeCode = "";

        _tradeName = this.header.getControl("tradeName").getValue();
        _tradeCode = this.header.getControl("tradeCode").getValue();

        this.searchFormParameter.PARAM_CODE = _tradeCode;
        this.searchFormParameter.PARAM_NAME = _tradeName;

        var btnSearch = this.header.getControl("search");
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
            }
            else {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
                btnSearch.removeGroupItem("usegubun");
                btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
            }
        }

        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    //정렬
    setColumnSortClick: function (e, data) {

        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        if (!this.searchFormParameter.DEL_FLAG)
            this.searchFormParameter.DEL_FLAG = this.DEL_FLAG;

        this.contents.getGrid().draw(this.searchFormParameter);
    },

    //grid row의 특정 date관련  
    setGridLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        if ((!this.editFlag && rowItem['CANCEL'] == 'N' )||( this.isIncludeInactive)) {
            option.controlType = "widget.link";
            option.event = {
                'click': function (e, data) {
                    if (this.isOldFramework) {
                        opener.fnSetGropuNo(data.rowItem["TRADE_CODE"], data.rowItem["TRADE_NAME"], this.CODE_CLASS);
                        this.close();
                    } else {
                        var message = {
                            name: "TRADE_NAME",
                            code: "TRADE_CODE",
                            data: data.rowItem,
                            isAdded: this.isApplyDisplayFlag,
                            addPosition: "current",
                            callback: this.close.bind(this)
                        };

                        this.sendMessage(this, message);
                    }
                }.bind(this)
            };
        }
        return option;
    },


    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (data.dataCount === 1 && this.ispopupCloseUse) {
            var obj = {};
            var rowItem = data.dataRows[0];
            var message = {
                name: "TRADE_NAME",
                code: "TRADE_CODE",
                data: rowItem,
                isAdded: false,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } 
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);        
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    // Close button click event
    onFooterNew: function () {
        if (this.viewBag.Permission.importTrackingNo.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00598, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 310,
            isOpenPopup: true,
            fpopupID: this.PageID,
            Request: {
                EditMode: ecenum.editMode.new,
                isAddGroup: true
            }
        };
        this.openWindow({
            url: '/ECERP/SVC/EBA/EBA063P_01',
            name: ecount.resource.LBL00598,
            param: param,
            popupType: false
        });
    },
    //Event footer apply
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "TRADE_NAME",
            code: "TRADE_CODE",
            data: selectedItem,
            isAdded: this.isApplyDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);

    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    // F2
    ON_KEY_F2: function () {
        this.onFooterNew();
    },

    // F8
    ON_KEY_F8: function () {
        this.ispopupCloseUse = true;
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
        this.onContentsSearch('button');

    },

    // Enter
    ON_KEY_ENTER: function (e, target) {      
        //target && this.onContentsSearch(target.control.getValue());
    },
    ON_KEY_DOWN: function () {
        //this.gridFocus && this.gridFocus();
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
    // Tab 
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        setTimeout(function () { gridObj.focus(); }, 0);
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data['CANCEL'] == "Y")
            return true;
        return false;
    },

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});