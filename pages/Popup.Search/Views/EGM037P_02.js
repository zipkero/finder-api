window.__define_resource && __define_resource("LBL10187","LBL09958","LBL09959","BTN00069","BTN00043","BTN00959","BTN00204","BTN00033","BTN00203","BTN00008","MSG03839","LBL10186","MSG00962","BTN00603","BTN00351","MSG00213","MSG00705","MSG00299");
/****************************************************************************************************
1. Create Date : 2016.7.27
2. Creator     : Nguyen Minh Thien
3. Description : List label
4. Precaution  : 
5. History     : 2020.02.20 (On Minh Thien) - A20_00443 - 일정관리 > 신규 > 라벨 '돋보기' 버튼 클릭시 [신규]버튼 안보입니다.
                    2020.03.09 (김동수) : A20_00898 - 라벨검색 팝업창 입력 후 엔터쳐도 적용 안되는 현상
            
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGM037P_02", {
    newItem: false,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            CHK_FLAG: this.searchCategoryFlag == "L" ? "A" : this.searchCategoryFlag
            , NAME: ''
            , SEARCHTEXT: this.keyword || ''
            , SORTCOL_INDEX: '1'
            , SORT_TYPE: 'A'
            , BOARD_CD: this.BOARD_CD || 0
            , USE_YN: this.isIncludeInactive ? "Y" : "N"
            , isNoLabel: this.isNoLabel
        };
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
        header.setTitle(ecount.resource.LBL10187).useQuickSearch();

    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl('/Groupware/CRM/GetListLabelForSearch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['LABEL_CD', 'LABEL_NM'])
            .setColumns([
                    { propertyName: 'LABEL_CD', id: 'LABEL_CD', title: ecount.resource.LBL09958, controlType: 'widget.label', width: '' },
                    { propertyName: 'LABEL_NM', id: 'LABEL_NM', title: ecount.resource.LBL09959, controlType: 'widget.label', width: '' },


            ])
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCustomRowCell('LABEL_CD', this.setGridDateLink.bind(this, "LABEL_CD"))
            .setCustomRowCell('LABEL_NM', this.setGridDateLink.bind(this, "LABEL_NM"))

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

        if (this.isApplyDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        else
            keyHelper.push(11);

        if (this.isNewDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        else
            keyHelper.push(10);

        if (this.isIncludeInactive) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                        .addGroup([
                            { id: "Deactivate", label: ecount.resource.BTN00204 },
                            { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                            { id: "Activate", label: ecount.resource.BTN00203 }
                        ]).css("btn btn-default")
                    .noActionBtn().setButtonArrowDirection("up").end());
        }

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {

        if (!$.isNull(this.keyword)) {
            //this.contents.getcontrol('search').setvalue(this.keyword);
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        var grid = this.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(this.header.height());
        if (!e.unfocus) {
            //this.contents.getControl("search").setFocus(0);
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
    setGridDateLink: function (target, value, rowItem) {
        var option = {};
        //Set background
        if (target == "LABEL_NM") {
            option.labelBackgroundColor = rowItem.LABEL_COLOR;
            
        }
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "LABEL_NM",
                    code: "LABEL_CD",
                    bgColor: "LABEL_COLOR",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },
    //검색값이 한건일경우 자동으로 입력되도록  
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        var value = this.keyword;
        var cnt = (this.isNoLabel) ? 2 : 1;
        if (!$.isEmpty(value))
            this.isOnePopupClose = true;

        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1 && this.isOnePopupClose) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "LABEL_NM",
                code: "LABEL_CD",
                bgColor: "LABEL_COLOR",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "next",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);

        this.newItem = false;
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORTCOL_INDEX = data.columnId == "LABEL_CD" ? 1 : 2;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    onHeaderUsegubun: function (event) {
        if (this.searchFormParameter.USE_YN == "Y")
            this.searchFormParameter.USE_YN = "N";
        else
            this.searchFormParameter.USE_YN = "Y";

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
            height: 400,
            isAddGroup: false,
            BOARD_CD: this.BOARD_CD,
            editFlag: "I",
        };
        this.openWindow({
            url: "/ECERP/EGM/EGM037P_01",
            name: ecount.resource.LBL10186,
            param: param,
            popupType: false,
            additional: true
        });
    },

    //적용버튼
    onFooterApply: function (e) {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "LABEL_NM",
            code: "LABEL_CD",
            bgColor: "LABEL_COLOR",
            data: selectedItem,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        
        var value = this.header.getQuickSearchControl().getValue();
        var value2 = "";
        var value3 = "";

            this.isOnePopupClose = true;
        this.searchFormParameter.SEARCHTEXT = "";
        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();

        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.USE_YN == "Y") {
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

    onMessageHandler: function (event, data) {
        this.contents.getGrid().draw(this.searchFormParameter);
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
        this.searchFormParameter.SEARCHTEXT = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.USE_YN = this.isIncludeInactive ? "Y" : "N";
        if (this.isIncludeInactive) {
            if (this.header.getControl("search1") && this.header.getControl("search1").getValue() == "")
                this.searchFormParameter.PARAM2 = "";

            if (this.header.getControl("search2") && this.header.getControl("search2").getValue() == "")
                this.searchFormParameter.PARAM3 = "";
        }

        this.isOnePopupClose = true;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    // Set background color for [Active] column
    setRowBackgroundColor: function (data) {
        if (data['USE_YN'] == "N")
            return true;
    },
    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnLabel(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnLabel(this.getSelectedListforActivate("N"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            BatchModel: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.BatchModel.push({
                LABEL_CD: data.LABEL_CD,
                USE_YN: cancelYN,
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnLabel: function (updatedList) {
        var thisObj = this;
        var btn = this.footer.get(0).getControl("deleteRestore");

        if (updatedList.BatchModel.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }

        $.each(updatedList.BatchModel, function (i, dataUpdate) {
            var data = {
                BOARD_CD: thisObj.BOARD_CD,
                LABEL_CD: dataUpdate.LABEL_CD,
                USE_YN: dataUpdate.USE_YN
            };

            ecount.common.api({
                url: "/Groupware/IntegratedBoard/UpdateBoardLabelSet",
                data: Object.toJSON(data),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(result.fullErrorMsg + result.Data);
                    }
                    else {
                        thisObj.setReload(thisObj);
                    }
                }.bind(this),
                complete: function (e) {
                    btn.setAllowClick();
                }
            });
        });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonSelectedDelete: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");

        var listForDelete = this.contents.getGrid().grid.getChecked();
        if (listForDelete.length == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00705);
            return;
        }

        var keyForDelete = [];
        $.each(listForDelete, function (key, value) {
            keyForDelete.push({
                LABEL_CD: value.LABEL_CD,
                LABEL_NM: value.LABEL_NM
            })
        });

        var thisObj = this;

        var data = {
            DeleteListInfo: keyForDelete
        }

        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                $.each(data.DeleteListInfo, function (key, value) {

                    var dataDelete = {
                        BOARD_CD: thisObj.BOARD_CD,
                        LABEL_CD: value.LABEL_CD
                    };

                    thisObj.showProgressbar();
                    ecount.common.api({
                        url: "/Groupware/IntegratedBoard/DeleteLabel",
                        data: Object.toJSON(dataDelete),
                        success: function (result) {
                            if (result.Status != "200")
                                ecount.alert(result.fullErrorMsg);
                            else {
                                thisObj.setReload(thisObj);
                            }
                        },
                        complete: function () {
                            thisObj.hideProgressbar();
                            btnDelete.setAllowClick();
                        }
                    });
                });
            } else {
                btnDelete.setAllowClick();
            }
        });
    },

});
