window.__define_resource && __define_resource("LBL14188","LBL03017","LBL03004","LBL01742","BTN00065","BTN00067","BTN00035","BTN00008","MSG00198","MSG00621","MSG03232");
/****************************************************************************************************
1. Create Date : 2016.01.07
2. Creator     : 조영상
3. Description : 개인정보변경 > 내품목 
4. Precaution  :
5. History     : 2020.03.06 (PhiVo): A20_00121 - pre-deploy
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EMD001P_01"/** page ID */, {

    rowCount: 0,

    checkDup: null,

    init: function () {
        this._super.init.apply(this, arguments);

        this.rowCount = this.viewBag.InitDatas.ListLoad.length;
        this.initProperties();

    },

    initProperties: function () {

        this.checkDup = {
            checkDupCount: 0,
            checkDupCountState: 0

        }
    },

    render: function () {
        this._super.render.apply(this);
    },

    // 상단 영역 셋팅
    onInitHeader: function (header) {
        
        var g = widget.generator,
        contents = g.contents();

        header.notUsedBookmark()
              .setTitle(ecount.resource.LBL14188)
              .addContents(contents);
    },

    // 메인 컨텐츠 영역 셋팅 (그리드)
    onInitContents: function (contents) {

        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var grid = g.grid();
        
        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.ListLoad)
            .setRowDataUrl("/SelfCustomize/User/GetListByUserProd")
            .setCheckBoxUse(true)
            .setColumnFixHeader(true)
            .setEditable(true, 3)
            .setEditRowMoveable(true)
            .setColumns([
                { propertyName: 'FAV_CODE', id: 'PROD_CD', title: ecount.resource.LBL03017, width: '200', controlType: 'widget.code.prod' },  // 품목코드
                { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL03004, width: '300',  },    // 품목명
                { propertyName: 'SORT_ORDER', id: 'SORT_ORDER', title: ecount.resource.LBL01742, width: '50', controlType: 'widget.input.number', dataType:'90', align: 'center', controlOption: { decimalUnit: [3, 0] } },  // 순번
            ])
            //.setKeyColumn(['FAV_CODE'])
        
        .setEventWidgetTriggerObj(this.events)  // 그리드 내부 이벤트 요청 시 필수
        .setEventAutoAddRowOnLastRow(true, 2, 2)
        .setCustomRowCell('PROD_CD', this.setGridDateCustomProdCd.bind(this))

        contents.addGrid("dataGrid" + this.pageID, grid);
    },

    // todu : 확인 필요
    onLoadComplete: function (e) {
        
        

        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
    },


    
    // 하단 영역 셋팅
    onInitFooter: function (footer) {

        var g = widget.generator,
        toolbar = g.toolbar(),
        ctrl = g.control();

        toolbar
            .addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup([
            { id: "SaveContents", label: ecount.resource.BTN00067 },
            ]).clickOnce()) // 저장 todu : 신규,유지가 필요 여부 확인
            .addLeft(ctrl.define("widget.button", "Delete").label(ecount.resource.BTN00035)) // 선택삭제
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    // 팝업 클릭 시 셋팅 값 적용
    onPopupHandler: function (control, config, handler) {
        
        switch (control.id.toUpperCase()) {
            case "PROD_CD":     // 품목
                $.extend(config, {
                    isCheckBoxDisplayFlag: true,    // 체크박스 추가
                    isApplyDisplayFlag: true,       // 적용 버튼 추가
                    checkMaxCount: 100,              // 체크 카운트 100개
                    isProdRoot : false
                });
                break;
        }

        handler(config);
    },

    onFooterClose: function () {
        this.close();
    },

    //  팝업 설정값 내려주기
    onMessageHandler: function (page, message) {

        switch (page.pageID) {
            case "ES020P":
                if (this.checkDup.checkDupCount > 0) {
                    ecount.alert(ecount.resource.MSG00198);
                    page.__ecOpenPopup = "1";
                    this.checkDup.checkDupCount = 0;
                }

                // 100건 체크 로직
                if (this.rowCount > 100) {
                    var msg = String.format(ecount.resource.MSG00621, "100");
                    ecount.alert(msg);
                    
                    page.__ecOpenPopup = "1";
                }
                break;
        }
    },

    // 삭제 버튼 기능
    onFooterDelete: function () {
        
        this.rowCount = this.rowCount - this.contents.getGrid().grid.getCheckedCount();
        this.contents.getGrid().grid.removeCheckedRow();

    },

    //  저장 버튼 기능 (일반저장)
    onFooterSave: function (e) {
        this.fnSave(e, true);
    },

    // 저장 버튼 기능 (저장/내용유지)
    onButtonSaveContents: function (e) {
        this.fnSave(e, false);
    },

    // 그리드뷰 호출 후 실행
    // api를 통해서 변경된 값에 대한 데이터를 원천데이터에 적용하는 로직 (중요)
    onGridAfterRowDataLoad: function (e, data) {
        this.viewBag.InitDatas.ListLoad = data.result.Data;

        this.rowCount = this.viewBag.InitDatas.ListLoad.length;
    },

    // 그리드 품목 컬럼 재정의 기능
    setGridDateCustomProdCd: function (value, rowItem) {

        var option = {};
        _grid = this.contents.getGrid().grid;

        option.controlOption = {
            maxLength: 50,
            codeType: 3,
            widgetOptions: { useAsteriskMode: false },
            controlEvent: {
             
                itemSelect: function (rowKey, arg) {
                    
                    if (arg.type == 'addCode') {

                        $.each(_grid.getRowList(), function (i, data) {

                            if (data.FAV_CODE == arg.message.data.PROD_CD) {
                                this.checkDup.checkDupCount++;
                                this.checkDup.checkDupCountState = 1;
                            }
                        }.bind(this))

                        if (this.checkDup.checkDupCountState > 0) {
                            this.checkDup.checkDupCountState = 0;
                            return;
                        }

                        this.rowCount++;

                        // 100건 체크
                        if (this.rowCount > 100) {
                            return;
                        }

                        // 라인수 체크
                        var gridLine = _grid.getRowCount();

                        if (Number(gridLine - _grid.getNextRowId('PROD_CD')) == 2)
                        {
                            if (arg.message.length == 1 && arg.message.index == 0)
                            {
                            }
                            else{
                                _grid.addRow(1);
                            }
                        }
           
                        // 한건 선택시 바로 적용
                        if (arg.message.length == 1 && arg.message.index == 0) {
                            if (!$.isNull(arg.message.data)) {
                                _grid.setCell('PROD_CD', rowKey, arg.message.data.PROD_CD, { isRunChange: false });
                                _grid.setCell('PROD_DES', rowKey, arg.message.data.PROD_DES, { isRunChange: false });
                                _grid.setCell('SORT_ORDER', rowKey, '0', { isRunChange: false });   // 기본값 0
                            }
                        }
                        // 여러건 일 경우 처리 내용
                        else {
                            if (!$.isNull(arg.message.data)) {
                                _grid.setCell('PROD_CD', _grid.getNextRowId('PROD_CD'), arg.message.data.PROD_CD, { isRunChange: false });
                                _grid.setCell('PROD_DES', _grid.getNextRowId('PROD_DES'), arg.message.data.PROD_DES, { isRunChange: false });
                                _grid.setCell('SORT_ORDER', _grid.getNextRowId('SORT_ORDER'), "0", { isRunChange: false });   // 기본값 0
                            }
                        }
                    }
                }.bind(this)
            }
        };

        return option;
    },

    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        var _grid = this.contents.getGrid().grid;

        var rowKey = _grid.getRowKeyByIndex(0);
        _grid.setCellFocus("PROD_CD", rowKey);
    },

    // 그리드 선택여부 확인 함수
    setCheckProd: function () {

        var isOk = true,
         _self = this;
        // 체크 확인
        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {    // 품목 선택 여부 체크
            ecount.alert(ecount.resource.MSG03232);
            return false;
        }
        return isOk;
    },

    // 저장 프로세스
    fnSave: function (e, isDefault) {

        var thisObj = this;
        var btn = this.footer.get(0).getControl("Save");
        var oldCode = null;


        // 전체 삭제 진행 
        ecount.common.api({
            url: "/SelfCustomize/User/DeleteAllMyProd",
            data: Object.toJSON(),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {

                    // 체크 확인
                    var contentLists = [];
                    $.each(thisObj.contents.getGrid().grid.getRowList(), function (i, data) {
                        if (data.FAV_CODE != "") {
                            //if (!$.isNull(thisObj.viewBag.InitDatas.ListLoad[data[ecount.grid.constValue.keyColumnPropertyName]])) {
                            //    oldCode = thisObj.viewBag.InitDatas.ListLoad[data[ecount.grid.constValue.keyColumnPropertyName]].FAV_CODE;
                            //}
                            //else {
                            //    oldCode = null;
                            //}

                            contentLists.push({
                                FAV_CODE: data.FAV_CODE,
                                SORT_ORDER: data.SORT_ORDER,
                                FAV_NAME: data.PROD_DES
                            })
                        }
                    })

                    ecount.common.api({
                        url: "/SelfCustomize/User/InsertMyProd",
                        data: Object.toJSON(contentLists),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert(result.fullErrorMsg);
                            }
                            else {

                                // 기본 저장
                                if (isDefault) {
                                    this.setTimeout(function () {
                                        thisObj.close();
                                    }, 0);
                                }
                                else {
                                    var grid = thisObj.contents.getGrid();
                                    grid.draw();
                                }
                            }
                        },
                        complete: function () {
                            btn.setAllowClick();
                        }

                    });
                }
            },
            complete: function () {
                btn.setAllowClick();
            }
        });


       
    },

    //onAutoCompleteHandler: function (control, keyword, parameter, handler) {
    //    console.log(arguments);
    //},
     
    // F8 click
    ON_KEY_F8: function (e) {
        this.fnSave(e, true);
    }
});