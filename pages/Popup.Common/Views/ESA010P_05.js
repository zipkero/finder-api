window.__define_resource && __define_resource("LBL10323","LBL00703","LBL01099","LBL01118","LBL01533","BTN00065","BTN00008","LBL00496","LBL07157");
/****************************************************************************************************
1. Create Date : 2015.10.20
2. Creator     : 전영준
3. Description : 품목등록 - 품목 계정 추가 
4. Precaution  : 
5. History     : 2016.06.22 (최용환) : Update / Insert Sp분리 작업 (ESP_ESA010_ITEM_INSERT / ESP_ESA010_ITEM_UPDATE)
                 2018.09.18 (bsy): [] 무형자산
                 2018.12.20 (bsy): 최초 무형자산 들어갈수 있게 
                 2019.06.13 (LuongAnhDuy) A19_00674 - 품목등록 > 계정설정 데이터 조회 방식 변경
                 2020.03.18 (Yongseok Kim) - A20_00773_권한세분화_선작업
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_05", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    // apiUrl: '/Common/Basic/GetListForInspectType',
    /********************************************************************** 
    * page init 
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
        this.searchFormParameter = {
            KEYWORD: this.KeyWord,
        };
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL10323) // 품목구분별회계계정  
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var self = this;
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            data = this.viewBag.InitDatas.ListLoad;

        this.columns = [
            { propertyName: 'PROD_TYPE_DES', id: 'PROD_TYPE_DES', title: ecount.resource.LBL00703, width: 120, align: 'left' }, // 구분 LBL00703
            { propertyName: 'IN_GYE_DES', id: 'IN_GYE_DES', title: ecount.resource.LBL01099, width: 120, align: 'left', controlType: 'widget.code.account', editableState: 1 }, // 매입 LBL01099
            { propertyName: 'OUT_GYE_DES', id: 'OUT_GYE_DES', title: ecount.resource.LBL01118, width: 120, align: 'left', controlType: 'widget.code.account', editableState: 1 }, // 매출 LBL01118 
            { propertyName: 'PRODUCT_GYE_DES', id: 'PRODUCT_GYE_DES', title: ecount.resource.LBL01533, width: 120, align: 'left', controlType: 'widget.code.account', editableState: 0 }, // 생산 LBL01533
        ]
        //  data
        settings
            .setEventWidgetTriggerObj(this.events)
            .setRowData(data)
            .setColumns(this.columns)
            .setKeyColumn(['PROD_TYPE'])
            .setEditable(true, 0, 0)
            .setCustomRowCell('PROD_TYPE_DES', data['PROD_TYPE_DES'])
            .setCustomRowCell("IN_GYE_DES", function (value, rowItem) {
                var option = {};
                option.event = {
                    'change': function (e, data) {
                        var _grid = self.contents.getGrid().grid;
                        if ($.isEmpty(data.newValue)) {
                            _grid.setCell("IN_GYE_CODE", data.rowKey, "");
                        }
                    }
                };
                return option;
            })
            .setCustomRowCell("OUT_GYE_DES", function (value, rowItem) {
                var option = {};
                option.event = {
                    'change': function (e, data) {
                        var _grid = self.contents.getGrid().grid;
                        if ($.isEmpty(data.newValue)) {
                            _grid.setCell("OUT_GYE_CODE", data.rowKey, "");
                        }
                    }
                };
                return option;
            })
            .setCustomRowCell("PRODUCT_GYE_DES", function (value, rowItem) {
                var option = {};
                option.event = {
                    'change': function (e, data) {
                        var _grid = self.contents.getGrid().grid;
                        if ($.isEmpty(data.newValue)) {
                            _grid.setCell("PRODUCT_GYE_CODE", data.rowKey, "");
                        }
                    }
                };
                return option;
            })
            ;
        contents
            .add(toolbar)
            .addGrid("dataGrid", settings);
    },
    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar();
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        if (this.viewBag.InitDatas.ListLoad.length != 0) {
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 완료 이벤트
    onLoadComplete: function () {
        var grid = this.contents.getGrid().grid;
        grid.setEditable(true, "PRODUCT_GYE_DES", 1);
        grid.setEditable(true, "PRODUCT_GYE_DES", 2);
        grid.setEditable(true, "PRODUCT_GYE_DES", 3);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //검색, 전체보기 
    onContentsSearch: function (event) {
        var invalid = this.contents.getControl("search").validate();
        if (invalid.length > 0) {
            this.contents.getControl("search").setFocus(0);
            return;
        }
        this.searchFormParameter.KEYWORD = this.contents.getControl("search").getValue().keyword || '';
        this.contents.getGrid().draw(this.searchFormParameter);
        this.contents.getControl("search").setFocus(0);
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.name = ecount.resource.LBL00496;
        handler(config);
    },

    // Message Handler
    onMessageHandler: function (page, param) {
        var grid = this.contents.getGrid().grid;
        var code = "";

        if (param.control.id == "IN_GYE_DES") {
            code = "IN_GYE_CODE";
        } else if (param.control.id == "OUT_GYE_DES") {
            code = "OUT_GYE_CODE";
        } else if (param.control.id == "COST_GYE_DES") {
            code = "COST_GYE_CODE";
        } else {
            code = "PRODUCT_GYE_CODE";
        }
        grid.setCell(code, param.control.rowKey, param.data.GYE_CODE);
        grid.setCell(param.control.id, param.control.rowKey, param.data.GYE_DES);
        param.callback && param.callback();  // The popup page is closed   
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    // 저장
    onFooterSave: function () {
        var objThis = this;
        var saveBtn = this.footer.get(0).getControl("Save");
        var gridFilteringData = this.contents.getGrid().grid.getRowList();
        var arraySaveData = [];
        var arrayKey = [];
        $.each(gridFilteringData, function (i, item) {
            arraySaveData.push({
                PROD_TYPE: item.PROD_TYPE,
                PROD_TYPE_DES: item.PROD_TYPE_DES,
                PROD_TYPE2: item.PROD_TYPE2,
                IN_GYE_CODE: item.IN_GYE_CODE,
                OUT_GYE_CODE: item.OUT_GYE_CODE,
                COST_GYE_CODE: item.COST_GYE_CODE,
                PRODUCT_GYE_CODE: item.PRODUCT_GYE_CODE
            });
            arrayKey.push("");
        }.bind(this));
        ecount.common.api({
            url: '/SVC/Inventory/Basic/SaveAccountCodebyItemCategory',
            data: {
                Key: arrayKey,
                Request: {
                    Data: arraySaveData,
                    CheckPermissionRequest: objThis.CheckPermissionRequest
                }
            },
            success: function (result) {
                var message = {
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this),
            complete: function () {
                saveBtn.setAllowClick();
            }
        });
    },
    // 히스토리
    onFooterHistory: function (e) {
        var param = {
            lastEditTime: this.viewBag.InitDatas.ListLoad.length != 0 ? this.viewBag.InitDatas.ListLoad[0].WDATE : null, // datetime, // datetime
            lastEditId: this.viewBag.InitDatas.ListLoad.length != 0 ? this.viewBag.InitDatas.ListLoad[0].WID : null,      //id
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            width: 450,
            height: 150
        };
        // false : Modal , true : pop-up
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },

    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    // ON_KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            this.gridObject.focus();
            this.gridFocus = null;
        }.bind(this);
    },

    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        this.setTimeout(function () { this.gridObject.focus(); }, 0);
    },

    //Page Reload
    _ON_REDRAW: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { },

 
});




