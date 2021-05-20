window.__define_resource && __define_resource("LBL07992","LBL14192","BTN00113","BTN00351","LBL00993","LBL00989","LBL01742","LBL35284","LBL03674","MSG02158","BTN00069","LBL02792","BTN00043","BTN00026","BTN00053","BTN00037","BTN00008","MSG00962","MSG00299","BTN00603");
/****************************************************************************************************
1. Create Date : 2016.05.19
2. Creator        : 임명식 
3. Description  : 결재자 서택 팝업  
4. Precaution   : 
5. History         :  2018.10.12 Huu Lan applied A18_02737 결재라인 검색창 오류 수정 at Dev 12491
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGD008P_03", {

    newItem: false,
    isChange: false,
    isCheckhide: true,
    Edit_Change: false,
    type_prg: null,
    page_size: 100,
    page_current: 1,
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
              PRG_TYPE: this.PrgType
            , IDX_NO: this.IdxNo == 0 ? '' : this.IdxNo
            , PARAM: this.keyword
            , PAGE_SIZE: this.page_size
            , PAGE_CURRENT: this.page_current
            , SORT_COLUMN: 'IDX_NO'
            , SORT_TYPE: 'A'
        };
        this.isChange = this.IsChange;
        this.type_prg = this.PrgType;
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
        var pageTitle = ecount.resource.LBL07992;

        if (this.IsPersonalApvlLine) {
            pageTitle = ecount.resource.LBL14192; 
        }
        header.setTitle(pageTitle).useQuickSearch();

        if (this.isIncludeInactive) {
            //퀵서치 추가
            var contents = widget.generator.contents(),
            form1 = widget.generator.form(),
            toolbar = widget.generator.toolbar();
            var ctrl = widget.generator.control();

            //검색하단 버튼
            toolbar
                .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

            if (this.isIncludeInactive) {
                toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
            }

            //담당자코드, 담당자명 검색어
            form1.add(ctrl.define("widget.input.codeName", "search1", "search1", ecount.resource.LBL00993).end())
                .add(ctrl.define("widget.input.codeName", "search2", "search2", ecount.resource.LBL00989).end())

            contents.add(form1);    //검색어
            contents.add(toolbar);  //버튼

            header.add("search")
                .addContents(contents);
        }
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.ApprovalLine)
            .setRowDataUrl('/Groupware/Common/GetListForSearchApprovalLine')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['IDX_NO'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumns([
                { propertyName: 'IDX_NO', id: 'IDX_NO', title: this.IsPersonalApvlLine ? ecount.resource.LBL01742 : ecount.resource.LBL35284, width: 100 },
                { propertyName: 'SIGN_TITLE', id: 'SIGN_TITLE', title: ecount.resource.LBL03674, width: '' }
            ])
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setPagingRowCountPerPage(this.page_size, true)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount || 20)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG02158, e));
            })
            .setCustomRowCell('IDX_NO', this.setGridDateLink.bind(this))
            .setCustomRowCell('SIGN_TITLE', this.setGridDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];

        if (this.isApplyDisplayFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
            toolbar.addLeft(ctrl.define("widget.button", "add").label(ecount.resource.LBL02792));
        }
        else
            keyHelper.push(11);

        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        else
            keyHelper.push(10);
        if (this.isChange == true) {
            toolbar.addLeft(ctrl.define("widget.button", "change").label(ecount.resource.BTN00026));
            toolbar.addLeft(ctrl.define("widget.button", "new").css("btn btn-primary").label(ecount.resource.BTN00043));
            toolbar.addLeft(ctrl.define("widget.button", "back").label(ecount.resource.BTN00053));
            toolbar.addLeft(ctrl.define("widget.button", "DeleteSelected").label(ecount.resource.BTN00037));
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        
        if (!this.IsPersonalApvlLine) {
            toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        }


        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    // 페이지 완료 이벤트
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        if (this.isChange == true) {
            if (this.isCheckhide) {
                this.footer.getControl("new").hide();
                this.footer.getControl("back").hide();
                this.footer.getControl("DeleteSelected").hide();
            } else {

                this.footer.getControl("new").show();
                this.footer.getControl("back").show();
                this.footer.getControl("DeleteSelected").show();
            }
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
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
        var option = {}
            self = this;
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                if (this.Edit_Change == true) {
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 455,
                        EditFlag: 'M',
                        PrgType: self.PrgType,
                        IDX_NO: data.rowItem.IDX_NO,
                        isOpenPopup: true
                    };
                    this.openWindow({
                        url: '/ECERP/Popup.Common/EGD002P_01',
                        name: this.popupTitle,
                        popupType: false,
                        additional: false,
                        param: param
                    });

                } else {
                    if (self.IsPersonalApvlLine) {
                        var param = {
                            width: ecount.infra.getPageWidthFromConfig(),
                            height: 455,
                            EditFlag: 'M',
                            PrgType: self.PrgType,
                            IDX_NO: data.rowItem.IDX_NO,
                            isOpenPopup: true
                        };
                        this.openWindow({
                            url: '/ECERP/Popup.Common/EGD002P_01',
                            name: this.popupTitle,
                            popupType: false,
                            additional: false,
                            param: param
                        });
                    } else {
                        this.getLineDetailsData(data.rowItem.IDX_NO);
                    }
                }
               
            }.bind(this)
        };
        return option;
    },

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['DEL_GUBUN'] == "Y")
            return true;
    },

    //선택한 라인 가져오기
    getLineDetailsData: function (idx, callBack) {
        this.showProgressbar(true);
        var param = this.searchFormParameter, _self = this;
        param.IDX_NO = idx;
        ecount.common.api({
            url: "/Groupware/Common/GetListForSearchApprovalLineByIdx",
            data: Object.toJSON(param),
            success: function (result) {
                var message = {
                    name: "SIGN_TITLE",
                    code: "IDX_NO",
                    data: result.Data,
                    isAdded: _self.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: _self.close.bind(_self)
                };
                _self.sendMessage(_self, message);
            }
        });
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {

        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (!this.IsPersonalApvlLine) {
           this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
        }
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //신규버튼
    onFooterNew: function () {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 455,
            EditFlag: 'I',
            PrgType: this.PrgType,
            IDX_NO: 0,
            isOpenPopup: true
        };
        this.openWindow({
            url: '/ECERP/Popup.Common/EGD002P_01',
            name: this.popupTitle,
            popupType: false,
            additional: false,
            param: param
        });
    },

    // List button click event
    onFooterBack: function () {
        this.isCheckhide = false;
        this.Edit_Change = false;
        this.footer.getControl("change").show();
        this.footer.getControl("new").hide();
        this.footer.getControl("back").hide();
        this.footer.getControl("DeleteSelected").hide();
        var grid = this.contents.getGrid();
        this.ispopupCloseUse = true;
        this.searchFormParameter.DEL_FLAG = "N";
        grid.getSettings().setCheckBoxUse(false);
        grid.draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
    },

    // Change button click event
    onFooterChange: function () {
        this.Edit_Change = true;
        this.isNewDisplayFlag = true;
        this.ispopupCloseUse = false;
        this.footer.getControl("change").hide();
        this.footer.getControl("new").show();
        this.footer.getControl("back").show();
        this.footer.getControl("DeleteSelected").show();

        var grid = this.contents.getGrid();
        this.searchFormParameter.PrgType = this.PrgType;
        this.searchFormParameter.IDX_NO = this.IdxNo == 0 ? '' : this.IdxNo;

        grid.getSettings().setCheckBoxUse(true);
        grid.getSettings().setCheckBoxRememberChecked(false); //이거 사용하면 삭제가 안된답.
        grid.draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }  
        var message = {
            name: "SIGN_TITLE",
            code: "IDX_NO",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //추가버튼
    onFooterAdd: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "SIGN_TITLE",
            code: "IDX_NO",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next"
        };
        this.sendMessage(this, message);
    },

    onFooterDeleteSelected: function (e) {
       var self = this;
        var selectedItem = (e && e.gridCheckedItem) || self.contents.getGrid().getCheckedItem() || [];

        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        
        // Get user's confirm before deleting / Lấy xác nhận của người dùng trước khi xóa
        ecount.confirm(ecount.resource.MSG00299, function (confirm) {
            if (confirm == false) return;
            // Show progress bar / Hiển thị thanh tiến trình
            self.showProgressbar(true);

            // Initialize data / Khởi tạo dữ liệu
            var DeleteLists = [];
            selectedItem.forEach(function (val) {
                var param = {
                    IDX_NO: val.IDX_NO,
                    PRG_TYPE: self.type_prg,
                    SER_NO: val.SER_NO
                };
                DeleteLists.push(param);
            });

            // Call API to delete selected items / Gọi API xóa những mục được chọn
            ecount.common.api({
                url: "/Groupware/EApproval/DeleteApvlLineList",
                data: Object.toJSON({ listdata: DeleteLists }),
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
                            self.fnReloadGrid();
                        }
                    }
                }
            });
        });
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var value2 = "";
        var value3 = "";

        if (this.isIncludeInactive) {
            value2 = this.header.getControl("search1").getValue();
            value3 = this.header.getControl("search2").getValue();
        }

        if (!$.isEmpty(value2) || !$.isEmpty(value3))
            this.isOnePopupClose = true;
        else
            this.isOnePopupClose = false;

        this.searchFormParameter.PARAM = "";
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);

        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
            else {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            }
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    // Message handler from popup / Xử lý tin nhắn từ cửa sổ bật lên
    onMessageHandler: function (event, data) {
       if (event.pageID == 'EGD002P_01' &&
            data != null && data != undefined &&
            data.cmd != null && data.cmd) {
            switch (data.cmd) {
                default:
                    this.fnReloadGrid();
                    break;
            }
        }
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F2
    ON_KEY_F2: function () {
        if (this.isNewDisplayFlag)
            this.onFooterNew();
    },

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // KEY_DOWN
    ON_KEY_DOWN: function () {
    },

    // KEY_UP
    ON_KEY_UP: function () {
    },

    // KEY_Mouseup
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) {
        debugger;
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();

        if (!$.isEmpty(this.searchFormParameter.PARAM)) {
            this.isOnePopupClose = true;
        }
        else {
            this.isOnePopupClose = false;
        }

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

    fnReloadGrid: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },
});
