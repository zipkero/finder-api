window.__define_resource && __define_resource("LBL10723","BTN00802","BTN00803","BTN00804","BTN00037","BTN00525","LBL01605","BTN00070","BTN00008","MSG00297","LBL02763","LBL01894","BTN00063","MSG05294","MSG00303","MSG07549");
/****************************************************************************************************
1. Create Date : 2017.03.29
2. Creator     : 신희준
3. Description : 세부내역 공통페이지(SlipsDetails Common)
4. Precaution  :
5. History     : 
6. MenuPath    : 
7. Old File    : EB011P_DETAIL.js
****************************************************************************************************/

ecount.page.factory('ecount.page.input', 'SlipsDetails', {
    /**************************************************************************************************** 
    * base opion Variables
    ****************************************************************************************************/
    header: null,
    contents: null,
    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    pageOption: null,                           //JS에서 관리되기 위한 Custom항목의 객체

    SlipsDetailsData: null,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies('ecmodule.account.common', 'ecmodule.account.slipsDetails', 'ecmodule.common.calculation', 'ecount.errorMessage', 'inventorylib.common');
    },

    initProperties: function () {
        this.pageOption = {
            RequestType: this.RequestType,                                                                          //세부내역 팝업창 요청 Type
            isReloadDetail: this.IsReloadDetail,                                                                    //내역불러오기 제공/미제공
            isShowApply: this.IsShowApply,                                                                          //저장/적용버튼 제공/미제공
            isShowCheckBox: this.IsShowCheckBox,                                                                    //체크박스 제공/미제공
            isShowDetailsMonthCheck: this.IsShowDetailsMonthCheck,                                                  //세부내역 월체크 표시 여부
            MasterFormTypeString: this.MasterFormTypeString,                                                        //세부내역 상단양식 Type String
            DetailFormTypeString: this.DetailFormTypeString,                                                        //세부내역 하단양식 Type String

            DetailForm: this.viewBag.FormInfos.Details,                                                             //세부내역 하단양식 원본 Data

            gridObject: null,                                                                                       //세부내역 Rendering된 하단 그리드
            gridFirstCursor: this.viewBag.FormInfos.Details.option.firstCursorId,                                   //세부내역 하단양식에서 첫번째 Focus에 해당하는 항목

            slipsDetailsData: new Object(),                                                                         //세부내역 데이타

            detailFormSetting: null,                                                                                //하단 기본값, 게산식을 처리하기 위한 양식 SettingObject

            toolbarSetting: [{                                                                                      //툴바 Setting 정의
                settingType: 'Show',                                                                            //툴바에 Setting시 기본적으로 보여줘야 하는 widget
                widget: []
            }, {
                settingType: 'Hide',                                                                            //툴바에 Setting시 기본적으로 보여주지 않아야 하는 widget
                widget: [
                    { type: 'widget.button', id: 'F4', title: 'F4' },                                           //F4
                    { type: 'widget.checkbox', id: 'LineAdjust', title: ecount.resource.LBL10723 },             //라인조정
                    { type: 'widget.button', id: 'InsertUp', title: ecount.resource.BTN00802 },                 //삽입
                    { type: 'widget.button', id: 'MoveUp', title: ecount.resource.BTN00803 },                   //올림
                    { type: 'widget.button', id: 'MoveDown', title: ecount.resource.BTN00804 },                 //내림
                    { type: 'widget.button', id: 'DeleteSelected', title: ecount.resource.BTN00037 },           //선택삭제
                    { type: 'widget.button', id: 'ReloadDetail', title: ecount.resource.BTN00525 }              //내역불러오기
                ]
            }
            ],
            toolbarNavigation: [{                                                                                   //툴바 Navigation 정의
                action: 'ReloadDetailShow',                                                                     //내역불러오기 보이기
                showContents: ['ReloadDetail'],
                hideContents: []
            }, {
                action: 'ReloadDetailHide',                                                                     //내역불러오기 감추기
                showContents: [],
                hideContents: ['ReloadDetail']
            }, {
                action: 'NoCheckItem',                                                                          //다 감추기
                showContents: [],
                hideContents: ['F4', 'LineAdjust', 'InsertUp', 'MoveUp', 'MoveDown', 'DeleteSelected']
            }, {
                action: 'CheckItem',                                                                            //F4, 라인조정 만 보이기
                showContents: ['F4', 'LineAdjust'],
                hideContents: ['InsertUp', 'MoveUp', 'MoveDown', 'DeleteSelected']
            }, {
                action: 'CheckLineAdjust',                                                                      //모두 보이기
                showContents: ['F4', 'LineAdjust', 'InsertUp', 'MoveUp', 'MoveDown', 'DeleteSelected'],
                hideContents: []
            }
            ],

            TaxTypeControlString: {
                taxType: '',
                vatRate: ''
            },                                                                                                      //호출자의 세금계산서 구분
            SerialTime: this.serialTime
        }
    },

    initEcConfig: function () { },

    render: function ($parent) {
        /********************************************************************************************************************
        *Process Start
        ********************************************************************************************************************/
        /***************************************************************************************************
        *호출자의 세금계산서 구분 가져오기 Start
        ***************************************************************************************************/
        this.pageOption.TaxTypeControlString = JSON.parse(this.TaxTypeControlString);
        /***************************************************************************************************
        *호출자의 세금계산서 구분 가져오기 End
        ***************************************************************************************************/


        /***************************************************************************************************
        *하단양식Setting Object 설정 초기화 Start
        ***************************************************************************************************/
        this.pageOption.detailFormSetting = ecmodule.account.common.setFormDefaultInit({                                //하단양식(Details)
            form: this.pageOption.DetailForm.columns
        });
        /***************************************************************************************************
        *양식Setting 기본값 설정 초기화 End
        ***************************************************************************************************/


        /***************************************************************************************************
        *처리할 세부내역 Data Mapping Start
        ***************************************************************************************************/
        /************************
        *원복 데이터 Mapping Start
        ************************/
        this.pageOption.slipsDetailsData = $.extend(true, {}, this.viewBag.InitDatas.SlipsDetailsData || null);         //Data복사
        /************************
        *원복 데이터 Mapping End
        ************************/

        /************************
        *품목코드, 단위 에 대한 예외처리 Start
        ************************/
        $.each(this.pageOption.slipsDetailsData.Details, function (i, item) {
            if (item.PROD_CD == null) { item.PROD_CD = ''; }
            if (item.UNIT == null) { item.UNIT = ''; }
        });
        /************************
        *금액1,금액2 에 대한 예외처리 End
        ************************/
        /***************************************************************************************************
        *처리할 세부내역 Data Mapping End
        ***************************************************************************************************/

        this._super.render.apply(this);
        /********************************************************************************************************************
        *Process End
        ********************************************************************************************************************/
    },


    /****************************************************************************************************
    * UI Layout setting
    * http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header
            .notUsedBookmark()
            .setTitle(ecount.resource.LBL01605);
    },

    onInitContents: function (contents, resource) {
        /********************************************************************************************************************
        *Content Add Start
        ********************************************************************************************************************/
        /***************************************************************************************************
        *Init Start
        ***************************************************************************************************/
        var form = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
            grid = widget.generator.grid(),
            controls = widget.generator.control();
        /***************************************************************************************************
        *Init End
        ***************************************************************************************************/


        /***************************************************************************************************
        *상단 Start
        ***************************************************************************************************/
        if ($.isEmpty(this.pageOption.MasterFormTypeString) == false) {
            form
                .useInputForm()
                .executeValidateIfVisible()
                .setType('Master')
                .setColSize(2)
                .setOptions({ _isModifyMode: true });
        }
        /***************************************************************************************************
        *상단 End
        ***************************************************************************************************/


        /***************************************************************************************************
        *Toobal Start
        ***************************************************************************************************/
        toolbar.setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true });
        setToolbarWidget.call(this);
        /***************************************************************************************************
        *Toobal End
        ***************************************************************************************************/


        /***************************************************************************************************
        *하단 Start
        ***************************************************************************************************/
        grid
            .setFormData(this.pageOption.DetailForm)                                        //세부내역 하단양식에 대한 FormInfos
            .setRowData(this.pageOption.slipsDetailsData.Details)                           //세부내역 하단 데이터
            .setColumnPropertyColumnName('id')
            .setColumnPropertyNormalize('upper')
            .setEditable(true, 3, this.setEditableLimitCount.call(this))
            .setEventAutoAddRowOnLastRow(true, 2, 2)
            .setEditLimitAddRow(999)
            .setColumnSortable(false)
            .setEditSpecialRowCount(1)
            .setCheckBoxUse(this.pageOption.isShowCheckBox == 'Y' ? true : false)
            .setCheckBoxHeaderCallback({ 'change': setCheckBoxCallback.bind(this) })
            .setCheckBoxCallback({ 'click': setCheckBoxCallback.bind(this) })
            .setCustomRowCell('mmdd', setCustomMMDD.bind(this))                             //월,일
            .setCustomRowCell('qty', setCustomQty.bind(this))                               //수량
            .setCustomRowCell('price', setCustomPrice.bind(this))                           //단가
            .setCustomRowCell('supply_amt', setCustomSupplyAmt.bind(this))                  //공급가액
            .setCustomRowCell('vat_amt', setCustomVatAmt.bind(this))                        //부가세
            .setCustomRowCell('prod_cd', setGridDateCustomProdCd.bind(this))                //품목코드
            .setCustomRowCell('prod_des', setCustomProdDes.bind(this))               //품명
            .setCustomRowCell('size_des', setCustomSizeDes.bind(this))               //규격
            .setCustomRowCell('unit', setCustomUnit.bind(this))                   //단위
            .setCustomRowCell('remarks', setCustomRemarks.bind(this))                //비고
            
            .setEventWidgetTriggerObj(this.events);
        ;
        /***************************************************************************************************
        *하단 End
        ***************************************************************************************************/

        contents
            .add(form)
            .add(toolbar)
            .addGrid(this.pageID + '_Grid', grid);
        /********************************************************************************************************************
        *Content Add End
        ********************************************************************************************************************/


        /********************************************************************************************************************
        *Content Add For Function Start
        ********************************************************************************************************************/
        /***************************************************************************************************
        *툴바에 위젯 Setting Start
        ***************************************************************************************************/
        function setToolbarWidget() {
            for (var objectIndex in this.pageOption.toolbarSetting) {
                switch (this.pageOption.toolbarSetting[objectIndex].settingType) {
                    case 'Show':
                        if ($.isArray(this.pageOption.toolbarSetting[objectIndex].widget)) {
                            this.pageOption.toolbarSetting[objectIndex].widget.forEach(function (x) {
                                toolbar.addLeft(controls.define(x.type, x.id).label(x.title));
                            })
                        } else {
                            toolbar.addLeft(controls
                                .define(this.pageOption.toolbarSetting[objectIndex].widget.type, this.pageOption.toolbarSetting[objectIndex].widget.id)
                                .label(this.pageOption.toolbarSetting[objectIndex].widget.title));
                        }
                        break;
                    case 'Hide':
                        if ($.isArray(this.pageOption.toolbarSetting[objectIndex].widget)) {
                            this.pageOption.toolbarSetting[objectIndex].widget.forEach(function (x) {
                                toolbar.addLeft(controls.define(x.type, x.id).label(x.title).hide());
                            })
                        } else {
                            toolbar.addLeft(controls
                                .define(this.pageOption.toolbarSetting[objectIndex].widget.type, this.pageOption.toolbarSetting[objectIndex].widget.id)
                                .label(this.pageOption.toolbarSetting[objectIndex].widget.title)
                                .hide());
                        }
                        break;
                }
            }
        }
        /***************************************************************************************************
        *툴바에 위젯 Setting End
        ***************************************************************************************************/

        /***************************************************************************************************
        *체크박스 SetCell Start
        ***************************************************************************************************/
        function setCheckBoxCallback(value, gridData) {
            this.setToolbar.call(this);
        }
        /***************************************************************************************************
        *체크박스 SetCell End
        ***************************************************************************************************/


        /***************************************************************************************************
        *월/일 SetCell Start
        ***************************************************************************************************/
        function setCustomMMDD(value, rowItem) {
            var option = {};

            option.isOnlyThisYear = true;
            option.useDateSpace = true;

            option.event = {
                'focus': function (e, data) {

                    if (Number(data.rowKey) > 0) {
                        //일자복사
                        if ($.isEmpty(this.pageOption.gridObject.grid.getRowItem(data.rowKey).MMDD) == true) {
                            var beforeRowKey = String(Number(data.rowKey) - 1),
                                beforeRowData = this.pageOption.gridObject.grid.getRowItem(beforeRowKey);

                            var errorKeyList = this.pageOption.gridObject.grid.getValidateErrorKeyList();
                            if (errorKeyList.length == 0)
                                this.pageOption.gridObject.grid.setCell('mmdd', data.rowItem[ecount.grid.constValue.keyColumnPropertyName], beforeRowData.MMDD);
                        }
                    }
                }.bind(this),
                'change': function (e, data) {
                    this.setToolbar.call(this);
                }.bind(this)
            };

            return option;
        }
        /***************************************************************************************************
        *월/일 SetCell End
        ***************************************************************************************************/


        /***************************************************************************************************
        *수량 SetCell Start
        ***************************************************************************************************/
        function setCustomQty(value, rowItem, convertor, dataTypeOption) {
            var option = {};

            option.style = {
                align: 'right'
            };

            option.controlOption = {
                decimalUnit: [28, 10],
                isCheckZero: dataTypeOption.isCheckZero || true,
                dataType: '910'
            }

            option.event = {
                'change': function (e, data) {
                    var qty = new Decimal(data.rowItem['QTY'] || 0),                           //수량
                        price = new Decimal(data.rowItem['PRICE'] || 0),                       //단가
                        nowSupplyAmt = new Decimal(0),                                         //계산될 공급가액
                        changeIDArray = new Array('qty');                                      //수량이 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 수량인 경우는 무시
                    if (qty.isZero() == false && price.isZero() == false) {                    //수량과 단가 모두 값이 있다면
                        nowSupplyAmt = _setCalcSupplyAmt.call(this, data.rowKey, qty, price);  //현재시점의 수량과 단가로 공급가액 계산을하고
                        _setCalcVatAmt.call(this, data.rowKey, nowSupplyAmt, {                 //현재시점의 공급가액으로 부가세 계산을 진행
                            rowData: data.rowItem
                        });

                        changeIDArray.push('supply_amt');                                      //공급가액이 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 공급가액인 경우는 무시
                        changeIDArray.push('vat_amt');                                         //부가세가 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 부가세인 경우는 무시
                    }

                    this.setRowProcess.call(this, {                                            //행단위의 재정리
                        changeIDArray: changeIDArray,                                          //계산식 재정리 시, 영향받지 않을 ID, 계산처리 대상에서 찾을 ID
                        rowDataCallback: function () {
                            return this.pageOption.gridObject.grid.getRowItem(
                                data.rowItem[ecount.grid.constValue.keyColumnPropertyName]
                            );
                        }.bind(this)
                    });

                    if (qty.isZero() == false && price.isZero() == false) {                    //수량과 단가 모두 값이 있다면, 공급가액, 부가세가 바뀌었으므로 합계를 다시 구하기
                        this.setSyncTotalSum.call(this, {                                      //갱신 된 수량, 단가, 공급가액, 부가세 기준으로 합계를 다시 구하기
                            callback: function (supplyAmtTotal, vatAmtTotal) {
                                this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);     //합계를 다시 구한 후, 현금,어음 재계산
                            }.bind(this)
                        });
                    }
                }.bind(this)
            }

            return option;
        }
        /***************************************************************************************************
        *수량 SetCell End
        ***************************************************************************************************/


        /***************************************************************************************************
        *단가 SetCell Start
        ***************************************************************************************************/
        function setCustomPrice(value, rowItem, convertor, dataTypeOption) {
            var option = {};

            option.controlOption = {
                decimalUnit: [28, 10],
                isCheckZero: dataTypeOption.isCheckZero || true,
                dataType: '910'
            }

            option.style = {
                align: 'right'
            };

            option.event = {
                'change': function (e, data) {
                    if ($.parseNumber(data.oldValue) == $.parseNumber(data.newValue))           //단가가 변경됐을경우 재계산
                        return;

                    var qty = new Decimal(data.rowItem['QTY'] || 0),                           //수량     
                        price = new Decimal(data.rowItem['PRICE'] || 0),                       //단가
                        nowSupplyAmt = new Decimal(0),                                         //계산될 공급가액
                        changeIDArray = new Array('price');                                    //단가가 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 단가인 경우는 무시

                    if (qty.isZero() == false && price.isZero() == false) {                    //수량과 단가 모두 값이 있다면
                        nowSupplyAmt = _setCalcSupplyAmt.call(this, data.rowKey, qty, price);  //현재시점의 수량과 단가로 공급가액 계산을하고
                        _setCalcVatAmt.call(this, data.rowKey, nowSupplyAmt, {                 //현재시점의 공급가액으로 부가세 계산을 진행
                            rowData: data.rowItem
                        });

                        changeIDArray.push('supply_amt');                                      //공급가액이 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 공급가액인 경우는 무시
                        changeIDArray.push('vat_amt');                                         //부가세가 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 부가세인 경우는 무시
                    }

                    this.setRowProcess.call(this, {                                            //행단위의 재정리
                        changeIDArray: changeIDArray,                                          //계산식 재정리 시, 영향받지 않을 ID, 계산처리 대상에서 찾을 ID
                        rowDataCallback: function () {
                            return this.pageOption.gridObject.grid.getRowItem(
                                data.rowItem[ecount.grid.constValue.keyColumnPropertyName]
                            );
                        }.bind(this)
                    });

                    if (qty.isZero() == false && price.isZero() == false) {                    //수량과 단가 모두 값이 있다면, 공급가액, 부가세가 바뀌었으므로 합계를 다시 구하기
                        this.setSyncTotalSum.call(this, {                                      //갱신 된 수량, 단가, 공급가액, 부가세 기준으로 합계를 다시 구하기
                            callback: function (supplyAmtTotal, vatAmtTotal) {
                                this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);     //합계를 다시 구한 후, 현금,어음 재계산
                            }.bind(this)
                        });
                    }
                }.bind(this)
            }

            return option;
        }
        /***************************************************************************************************
        *단가 SetCell End
        ***************************************************************************************************/


        /***************************************************************************************************
        *공급가액 SetCell Start
        ***************************************************************************************************/
        function setCustomSupplyAmt(value, rowItem, convertor, dataTypeOption) {
            var option = {};

            var decimalPoint = $.parseNumber((
                dataTypeOption.dataType &&
                dataTypeOption.dataType.substring(1)) || 6);

            option.controlOption = {
                decimalUnit: [18 + decimalPoint, decimalPoint],
                isCheckZero: dataTypeOption.isCheckZero || true
            }

            option.style = {
                align: 'right'
            };

            option.event = {
                'change': function (e, data) {
                    _setCalcVatAmt.call(this, data.rowKey,
                        new Decimal(data.rowItem['SUPPLY_AMT'] || 0), {                     //부가세 계산
                            rowData: data.rowItem
                        });

                    this.setRowProcess.call(this, {                                          //행단위의 재정리
                        changeIDArray: ['supply_amt', 'vat_amt'],                            //공급가액, 부가세가 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 공급가액, 부가세인 경우는 무시
                        rowDataCallback: function () {
                            return this.pageOption.gridObject.grid.getRowItem(
                                data.rowItem[ecount.grid.constValue.keyColumnPropertyName]
                            );
                        }.bind(this)
                    });

                    this.setSyncTotalSum.call(this, {                                       //갱신 된 수량, 단가, 공급가액, 부가세 기준으로 합계를 다시 구하기
                        callback: function (supplyAmtTotal, vatAmtTotal) {
                            this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);      //합계를 다시 구한 후, 현금,어음 재계산
                        }.bind(this)
                    });
                }.bind(this)
            };

            return option;
        }
        /***************************************************************************************************
        *공급가액 SetCell End
        ***************************************************************************************************/


        /***************************************************************************************************
        *부가세 SetCell Start
        ***************************************************************************************************/
        function setCustomVatAmt(value, rowItem, convertor, dataTypeOption) {
            var option = {};

            var decimalPoint = $.parseNumber((
                dataTypeOption.dataType &&
                dataTypeOption.dataType.substring(1)) || 6);

            option.controlOption = {
                decimalUnit: [18 + decimalPoint, decimalPoint],
                isCheckZero: dataTypeOption.isCheckZero || true
            }

            option.style = {
                align: 'right'
            };

            option.event = {
                change: function (e, data) {
                    this.setRowProcess.call(this, {                                         //행단위의 재정리
                        changeIDArray: ['vat_amt'],                                         //부가세가 직접 바뀌었으므로, 계산식 적용 시, 계산식 적용 대상 양식항목이 부가세인 경우는 무시
                        rowDataCallback: function () {
                            return this.pageOption.gridObject.grid.getRowItem(
                                data.rowItem[ecount.grid.constValue.keyColumnPropertyName]
                            );
                        }.bind(this)
                    });

                    this.setSyncTotalSum.call(this, {                                       //갱신 된 수량, 단가, 공급가액, 부가세 기준으로 합계를 다시 구하기
                        callback: function (supplyAmtTotal, vatAmtTotal) {
                            this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);      //합계를 다시 구한 후, 현금,어음 재계산
                        }.bind(this)
                    });
                }.bind(this)
            };

            return option;
        }
        /***************************************************************************************************
        *부가세 SetCell End
        ***************************************************************************************************/



        /***************************************************************************************************
        *품목코드 SetCell Start [리펙토링 대상] [리펙토링 대상] [리펙토링 대상] [리펙토링 대상]
        ***************************************************************************************************/
        function setGridDateCustomProdCd(value, rowItem) {
            var option = {};

            option.controlOption = {
                maxLength: 50,
                codeType: 3,
                widgetOptions: { useAsteriskMode: false },
                controlEvent: {
                    itemSelect: function (rowKey, arg) {
                        var rowData,
                            setDefaultOption = {
                                gridObj: this.pageOption.gridObject.grid,
                                rowKey: '0',
                                column: '',
                                foreignFlag: '0',
                                isSetValue: false
                            };

                        if (arg.type == 'addProdCode' || arg.type == 'addCode') {
                            if (arg.isApi == true) {
                                var AddData = this.getGridProdPopupInfo(rowKey, arg.control.rowIdx, true, null);
                                AddData.Parent = JSON.parse(AddData.ParentDate);
                                rowData = ecmodule.common.prod.setInputSendMessage(this, arg.message.data, AddData);
                                if (!rowData) {
                                    return;
                                }
                            } else {
                                rowData = arg.message.data;
                            }
                        }

                        if (arg.isApi == true) {
                            if (arg.type == 'addProdCode') {
                                rowData.totalItemCnt = arg.cnt.totalcnt;
                                rowData.ItemCnt = arg.cnt.ItemCnt;
                            } else if (arg.type == 'addCode') {
                                rowData.totalItemCnt = 1;
                                rowData.ItemCnt = 0;
                            }
                        }

                        if (arg.type == 'addProdCode' || arg.type == 'addCode') {
                            var closeFlag = rowData && rowData.closeFlag || false;
                            if (closeFlag == false) {
                                var calcOption = ecmodule.inventory.calc.getInputValue(this.ecPageID, { foreignFlag: '0' });

                                if (rowData.BARCODEADD == false && calcOption.isDesCall == true) {
                                    //적요 기본값 처리
                                    ecmodule.inventory.calc.getBasicRemarks(this.ecPageID,
                                        $.extend(
                                            {},
                                            setDefaultOption,
                                            {
                                                isSetValue: true, rowKey: rowData.rowKey
                                            }
                                        )
                                    );
                                }

                                if (rowData.BARCODEADD == false && (calcOption.isProdCall == true || calcOption.isCalcCall == true)) {
                                    if (rowData.PriceInfo && rowData.PriceInfo.rowKey) {
                                        setProdDataInformation.call(this, rowData.PriceInfo);

                                        setProdSeachValue.call(this, this.pageOption.gridObject.grid, rowData.rowKey, rowData, rowData.rowIdx, arg.isApi)
                                    } else {
                                        var prodOption = $.extend(
                                            {},
                                            setDefaultOption,
                                            {
                                                rowKey: rowData.rowKey,
                                                callback: function (result, serachProdInfo, option) {
                                                    if ($.isEmpty(result) == false) {

                                                        setProdDataInformation.call(this, result.Data);
                                                    }

                                                    setProdSeachValue.call(this, this.pageOption.gridObject.grid, option.rowKey, serachProdInfo, rowData.rowIdx, arg.isApi)
                                                }.bind(this)
                                            })

                                        ecmodule.inventory.calc.getProdBasicDatasPrice(this.ecPageID, prodOption, rowData);
                                    }


                                } else {
                                    setProdSeachValue.call(this, this.pageOption.gridObject.grid, rowData.rowKey, rowData, rowData.rowIdx, arg.isApi)
                                }

                                //품목관련정보 세팅
                                function setProdDataInformation(settingData) {
                                    if (calcOption.isCalcCall == true) {
                                        //품목 단가정보 셋팅
                                        ecmodule.inventory.calc.setProdPrice(
                                            $.extend(
                                                {},
                                                setDefaultOption,
                                                {
                                                    isSetValue: true, rowKey: settingData.rowKey, column: 'prod_price'
                                                }
                                            ),
                                            settingData
                                        );
                                    }

                                    if (calcOption.isProdCall == true) {
                                        //품목 기본값 세팅
                                        ecmodule.inventory.calc.getProdBasicDatas(this.ecPageID,
                                            $.extend(
                                                {},
                                                setDefaultOption,
                                                {
                                                    rowKey: settingData.rowKey,
                                                    isSetValue: true,
                                                    isBuyInput: false
                                                }
                                            ),
                                            settingData
                                        );
                                    }
                                }

                                //품목 검색후 그리드 값셋팅
                                function setProdSeachValue(grid, rowKey, rowData, rowIdx, isApi) {
                                    var MMDD = this.pageOption.slipsDetailsData.Master.TAX_NO;
                                    rowData.MMDD = MMDD ? MMDD.substr(4, 4) : '' || this.pageOption.slipsDetailsData.Details[0].MMDD;

                                    grid.setCellTransaction().start();
                                    grid.setCell('mmdd', rowKey, rowData.MMDD);
                                    grid.setCell('prod_cd', rowKey, rowData.PROD_CD);
                                    grid.setCell('prod_des', rowKey, rowData.PROD_DES);
                                    grid.setCell('size_des', rowKey, rowData.SIZE_DES);
                                    grid.setCell('unit', rowKey, rowData.UNIT);
                                    grid.setCell('price', rowKey, rowData.OUT_PRICE || '0');//출고단가 세팅
                                    grid.setCellTransaction().end();

                                    //포커스
                                    if (!$.isEmpty(rowData.INPUTFOCUS)) {
                                        grid.setCellFocus(rowData.INPUTFOCUS, rowKey);
                                    }
                                }
                            }
                        }
                    }.bind(this)
                }
            };
            option.event = {
                'change': function (e, data) {
                    if ($.isEmpty(data.rowItem.PROD_CD)) {
                        this.pageOption.gridObject.grid.setCellTransaction().start({ 'autoRefresh': true });
                        this.pageOption.gridObject.grid.setCell('prod_des', data.rowItem[ecount.grid.constValue.keyColumnPropertyName], '');
                        this.pageOption.gridObject.grid.setCell('unit', data.rowItem[ecount.grid.constValue.keyColumnPropertyName], '');
                        this.pageOption.gridObject.grid.setCell('size_des', data.rowItem[ecount.grid.constValue.keyColumnPropertyName], '', { isChangeRun: false });
                        this.pageOption.gridObject.grid.setCellTransaction().end();
                    }
                }.bind(this)
            };
            return option;
        }

        function setCustomProdDes(value, rowItem) {
            var option = {};
            option.controlOption = {
                maxLength: 100
            };
            return option;
        }

        function setCustomSizeDes(value, rowItem) {
            var option = {};
            option.controlOption = {
                maxLength: 100
            };
            return option;
        }

        function setCustomUnit(value, rowItem) {
            var option = {};
            option.controlOption = {
                maxLength: 6
            };
            return option;
        }

        function setCustomRemarks(value, rowItem) {
            var option = {};
            option.controlOption = {
                maxLength: 200
            };
            return option;
        }     
        
        /***************************************************************************************************
        *품목코드 SetCell End [리펙토링 대상] [리펙토링 대상] [리펙토링 대상] [리펙토링 대상]
        ***************************************************************************************************/

        /***************************************************************************************************
        *금액1 SetCell Start
        ***************************************************************************************************/
        function setCustomPAmt1(value, rowItem, convertor, dataTypeOption) {
            var option = {};

            var decimalPoint = $.parseNumber((
                dataTypeOption.dataType &&
                dataTypeOption.dataType.substring(1)) || 6);

            option.controlOption = {
                decimalUnit: [18 + decimalPoint, decimalPoint],
                isCheckZero: dataTypeOption.isCheckZero || true
            }

            option.style = {
                align: 'right'
            };

            option.event = {
                change: function (e, data) {
                    this.setRowProcess.call(this, {                                         //행단위의 재정리
                        changeIDArray: ['p_amt1'],                                          //계산식 재정리 시, 영향받지 않을 ID
                        rowDataCallback: function () {
                            return this.pageOption.gridObject.grid.getRowItem(
                                data.rowItem[ecount.grid.constValue.keyColumnPropertyName]
                            );
                        }.bind(this)
                    })
                }.bind(this)
            };

            return option;
        }
        /***************************************************************************************************
        *금액1 SetCell Start
        ***************************************************************************************************/


        /***************************************************************************************************
        *금액2 SetCell Start
        ***************************************************************************************************/
        function setCustomPAmt2(value, rowItem, convertor, dataTypeOption) {
            var option = {};

            var decimalPoint = $.parseNumber((
                dataTypeOption.dataType &&
                dataTypeOption.dataType.substring(1)) || 6);

            option.controlOption = {
                decimalUnit: [18 + decimalPoint, decimalPoint],
                isCheckZero: dataTypeOption.isCheckZero || true
            }

            option.style = {
                align: 'right'
            };

            option.event = {
                change: function (e, data) {
                    this.setRowProcess.call(this, {                                         //행단위의 재정리
                        changeIDArray: ['p_amt2'],                                          //계산식 재정리 시, 영향받지 않을 ID
                        rowDataCallback: function () {
                            return this.pageOption.gridObject.grid.getRowItem(
                                data.rowItem[ecount.grid.constValue.keyColumnPropertyName]
                            );
                        }.bind(this)
                    })
                }.bind(this)
            };

            return option;
        }
        /***************************************************************************************************
        *금액2 SetCell End
        ***************************************************************************************************/


        /***************************************************************************************************
        *SetCell for Function Start
        ***************************************************************************************************/
        //공급가액 계산
        function _setCalcSupplyAmt(rowKey, qty, price) {
            /************************
            *Init Start
            ************************/
            var qty = new Decimal(qty || 0),
                price = new Decimal(price || 0),
                returnSupplyamt = ecount.calc.toFixed(
                    qty.times(price),
                    this.getDecimalPoint('supply_amt'),
                    ecount.config.company.AMT_CALC
                );
            /************************
            *Init End
            ************************/


            /************************
            *공급가액 처리 Start
            ************************/
            this.pageOption.gridObject.grid
                .setCell('supply_amt', rowKey, returnSupplyamt.toString(), { isRunChange: false });
            /************************
            *공급가액 처리 End
            ************************/


            /************************
            *계산한 공급가액을 Return (호출용도에 따라 사용) Start
            ************************/
            return returnSupplyamt;
            /************************
            *계산한 공급가액을 Return (호출용도에 따라 사용) End
            ************************/

        }

        //부가세 계산
        function _setCalcVatAmt(rowKey, supply_amt, ectProcessOption) {
            /************************
            *부가세 처리 Start
            ************************/
            var calcResult = ecmodule.account.common.calcVatAmt({
                TAX_TYPE: this.pageOption.TaxTypeControlString.taxType,
                VAT_RATE: this.pageOption.TaxTypeControlString.vatRate,
                VAT_CALC: ecount.config.company.VAT_CALC,
                DEC_AMT: this.getDecimalPoint('vat_amt'),
                SUPPLY_AMT: supply_amt.toString()
            }),
                returnVatAmt = calcResult.VAT_AMT;

            this.pageOption.gridObject.grid
                .setCell('vat_amt', rowKey, returnVatAmt.toString(), { isRunChange: false });
            /************************
            *부가세 처리 End
            ************************/


            /************************
            *계산한 부가세를 Return (호출용도에 따라 사용) Start
            ************************/
            return returnVatAmt;
            /************************
            *계산한 부가세를 Return (호출용도에 따라 사용) End
            ************************/
        }
        /***************************************************************************************************
        *SetCell for Function End
        ***************************************************************************************************/
        /********************************************************************************************************************
        *Content Add For Function End
        ********************************************************************************************************************/
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            controls = widget.generator.control();

        if (this.pageOption.isShowApply == 'Y') {
            toolbar
                .addLeft(controls.define('widget.button', 'Process').label(String.format('{0}{1}', ecount.resource.BTN00070, '(F8)')))
                .addLeft(controls.define('widget.button', 'Close').label(ecount.resource.BTN00008));
        } else {
            toolbar
                .addLeft(controls.define('widget.button', 'Close').label(ecount.resource.BTN00008));
        }

        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        var maxDecLength = 16 + $.parseNumber(ecount.config.company.DEC_AMT);

        switch (cid) {
            case 'tax_no':                                                                                              //일련번호
                control
                    .filter('maxbyte', { message: String.format(ecount.resource.MSG00297, '20', '10'), max: 20 })
                    .value(this.pageOption.slipsDetailsData.Master.TAX_NO);
                break;
            case 'remarks':                                                                                             //비고
                control
                    .filter('maxlength', { message: String.format(ecount.resource.MSG00297, '50', '50'), max: 50 })
                    .value(this.pageOption.slipsDetailsData.Master.REMARKS);
                break;
            case 'settle':                                                                                              //청구영수
                control.label([ecount.resource.LBL02763, ecount.resource.LBL01894]).value(['1', '2'])                   //LBL02763 : 청구, LBL01894 : 영수
                    .select(this.pageOption.slipsDetailsData.Master.SETTLE);
                break;
            case 'settle_amt1':                                                                                         //현금
                control.numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT))
                    .value(ecount.calc.toFixedAmount(this.pageOption.slipsDetailsData.Master.SETTLE_AMT1));
                break;
            case 'settle_amt2':                                                                                         //수표
                control.numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT))
                    .value(ecount.calc.toFixedAmount(this.pageOption.slipsDetailsData.Master.SETTLE_AMT2));
                break;
            case 'settle_amt3':                                                                                         //어음
                control.numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT))
                    .value(ecount.calc.toFixedAmount(this.pageOption.slipsDetailsData.Master.SETTLE_AMT3));
                break;
            case 'settle_amt4':                                                                                         //외상매출금
                control.numericOnly(maxDecLength, $.parseNumber(ecount.config.company.DEC_AMT))
                    .value(ecount.calc.toFixedAmount(this.pageOption.slipsDetailsData.Master.SETTLE_AMT4));
                break;
        }
    },



    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadComplete: function (e) {
        /********************************************************************************************************************
        *Load Complete Process Start
        ********************************************************************************************************************/
        /***************************************************************************************************
        *Focus 설정 Start
        ***************************************************************************************************/
        if (!e.unfocus) {
            this.pageOption.gridObject.grid.setCellFocus('mmdd', this.pageOption.gridObject.grid.getRowKeyByIndex(0));
        }
        /***************************************************************************************************
        *Focus 설정 End
        ***************************************************************************************************/


        /***************************************************************************************************
        *내역불러오기 버튼 보이기/감추기 Start
        ***************************************************************************************************/
        if (this.pageOption.isReloadDetail == 'Y') {
            this.setNavigationToolbar(this.pageOption.toolbarNavigation.first(function (x) {
                return x.action == 'ReloadDetailShow';
            }));
        } else {
            this.setNavigationToolbar(this.pageOption.toolbarNavigation.first(function (x) {
                return x.action == 'ReloadDetailHide';
            }));
        }
        /***************************************************************************************************
        *내역불러오기 버튼 보이기/감추기 End
        ***************************************************************************************************/


        /***************************************************************************************************
        *하단버튼 설정 Start
        ***************************************************************************************************/
        if (this.pageOption.isShowApply == 'Y') {
            switch (this.pageOption.RequestType) {
                case 'SAVE':
                    this.footer.getControl('Process').changeLabel(ecount.resource.BTN00063);
                    break;
                case 'CONFIRM':
                default:
                    this.footer.getControl('Process').changeLabel(String.format('{0}{1}', ecount.resource.BTN00070, '(F8)'));
                    break;
            }
        }
        /***************************************************************************************************
        *하단버튼 설정 End
        ***************************************************************************************************/


        /***************************************************************************************************
        *권장브라우져 처리 Start
        ***************************************************************************************************/
        if (ecount.isNotSupportedBrowser && $.cookie(this.pageOption.cookieKey + 'ie8=esd006m_IE8notice') != 'none') {
            this.openWindow({
                url: '/ECERP/Popup.Common/NoticeIE8ChromeDownload',
                name: ecount.resource.MSG05294,
                param: { width: 500, height: 180 },
                popupType: false,
                additional: this.pageOption.isAdditionalPopup
            });
        };
        /***************************************************************************************************
        *권장브라우져 처리 End
        ***************************************************************************************************/
        /********************************************************************************************************************
        *Load Complete Process End
        ********************************************************************************************************************/

        /* Resource
           MSG05294 : 권장 브라우저 안내
        */

        
        /***************************************************************************************************
        *세부내역 월체크 처리 Start
        ***************************************************************************************************/
        if (this.pageOption.isShowDetailsMonthCheck == 'Y') {
            var grid = this.pageOption.gridObject.grid;
            var gridRowList = grid.getRowList();
            gridRowList.forEach(function (row, rowKey) {
                if ($.isEmpty(row.MMDD) != true && $.isEmpty(row.KEY.IO_DATE) != true) {
                    var detailMonth = row.MMDD.toDate().getMonth();
                    var slipMonth = row.KEY.IO_DATE.toDate().getMonth();
                    if (detailMonth != slipMonth) {
                        grid.setCellShowError("mmdd", rowKey, null);
                    }
                }
            });
        }
        /***************************************************************************************************
        *세부내역 월체크 처리 End
        ***************************************************************************************************/

        

    },

    onFocusOutHandler: function (event) {
        if (event.target == 'contents') {
            this.pageOption.gridObject.grid
                .setCellFocus(this.pageOption.gridFirstCursor || 'mmdd', this.pageOption.gridObject.grid.getRowKeyByIndex(0));
        };
    },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridRenderComplete: function (e, data, grid) {
        /********************************************************************************************************************
        *Grid Render Complete Start
        ********************************************************************************************************************/
        /***************************************************************************************************
        *Init Start
        ***************************************************************************************************/
        this.pageOption.gridObject = this.contents.getGrid(this.pageID + '_Grid');
        /***************************************************************************************************
        *Init End
        ***************************************************************************************************/


        /***************************************************************************************************
        *Etc Process Start
        ***************************************************************************************************/
        this.setSyncTotalSum.call(this);                                    //합계 처리
        //this.setSyncTotalSum.call(this, {                                       //합계 정리
        //    callback: function (supplyAmtTotal, vatAmtTotal) {                  //합계 정리 후 현금,어음 재계산
        //        this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);
        //    }.bind(this)
        //});
        this._super.onGridRenderComplete.apply(this, arguments);
        /***************************************************************************************************
        *Etc Process End
        ***************************************************************************************************/
        /********************************************************************************************************************
        *Grid Render Complete End
        ********************************************************************************************************************/
    },
    /**************************************************************************************************** 
    * define action event listener
    * ex) onFooterSave, onHeaderSearch..   [ 'on' + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    /****************************************************************************************************
    * define Change event listener
    ****************************************************************************************************/
    onChangeControl: function (control) {
        switch (control.cid) {
            case 'LineAdjust':  //라인조정
                if (control.value) {
                    this.setNavigationToolbar(this.pageOption.toolbarNavigation.first(function (x) {
                        return x.action == 'CheckLineAdjust';
                    }));
                } else {
                    this.setNavigationToolbar(this.pageOption.toolbarNavigation.first(function (x) {
                        return x.action == 'CheckItem';
                    }));
                }
                break;
            case 'settle':     //청구/영수
                var supplyAmtTotal = new Decimal(this.pageOption.gridObject.grid.getCell('supply_amt', 'special-row-0') || 0),
                    vatAmtTotal = new Decimal(this.pageOption.gridObject.grid.getCell('vat_amt', 'special-row-0') || 0);

                this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal); // 청구/영수 변경 시, 변경 된 타입에 맞게 설정
                break;
        }
    },

    onMessageHandler: function (event, data) {
        var firstData = data.data || data;
        switch (event.pageID) {
            case 'ES020P': //품목
                var closeFlag = firstData && firstData.closeFlag || false;
                if (closeFlag) {
                    this.pageOption.gridObject.grid.restoreLastActiveCell();
                }
                break;
        }
    },

    //F4 단가조정
    onContentsF4: function () {
        this.setCalcPrice(
            this.pageOption.gridObject.grid.getChecked()
        );
    },

    //라인조정 - 삽입(InsertUp)
    onContentsInsertUp: function () {
        this.pageOption.gridObject.grid.insertUpChecked();
    },

    //라인조정 - 올림(MoveUp)
    onContentsMoveUp: function () {
        this.pageOption.gridObject.grid.moveUpChecked();
    },

    //라인조정 - 내림(MoveDown)
    onContentsMoveDown: function () {
        this.pageOption.gridObject.grid.moveDownChecked();
    },

    //라인조정 - 선택삭제(DeleteSelected)
    onContentsDeleteSelected: function () {
        var checkedRow = this.pageOption.gridObject.grid.getChecked();

        if (checkedRow.length == 0) {
            ecount.alert(ecount.resource.MSG00303);                                 //MSG00303 : 삭제할 항목을 선택 바랍니다.
        } else {
            this.pageOption.gridObject.grid.setCellTransaction().start();

            for (var i = 0; i < checkedRow.length; i++) {
                rowDeletes.call(this, checkedRow[i]);
            }
            this.pageOption.gridObject.grid.setCellTransaction().end();

            this.setToolbar.call(this);

            this.setSyncTotalSum.call(this, {                                       //합계 정리
                callback: function (supplyAmtTotal, vatAmtTotal) {                  //합계 정리 후 현금,어음 재계산
                    this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);
                }.bind(this)
            });
        }

        //삭제관련 Action
        function rowDeletes(item) {
            var rowKey = item[ecount.grid.constValue.keyColumnPropertyName];

            this.pageOption.gridObject.grid.setCell('supply_amt', rowKey, '0', { isRunChange: false, isRunComplete: false });
            this.pageOption.gridObject.grid.setCell('vat_amt', rowKey, '0', { isRunChange: false, isRunComplete: false });
            this.pageOption.gridObject.grid.removeRow(rowKey);
            this.pageOption.gridObject.grid.removeChecked([rowKey], false);
        }
    },

    //내역불러오기
    onContentsReloadDetail: function () {
        var notEmpty;
        var pageParent = ecount.page.popup.prototype.getParentInstance.apply(this, arguments);

        if ($.isFunction(pageParent.onCallbackPopup)) {
            var callbackOption = {
                pageID: this.pageID
            };
            pageParent.onCallbackPopup(callbackOption, function (data) {
                pageParent.pageOption.slipsDetailsDocument
                    .exceptional({
                        linkSlipInformation: data.linkSlipInformation
                    })
                    .callLinkSlipInformation({
                        callback: function (returnCall) {
                            var basedDetailsData = returnCall.returnFunction.call(this),
                                supplyAmtTotal = new Decimal(0),
                                vatAmtTotal = new Decimal(0);

                            basedDetailsData.forEach(function (row) {
                                supplyAmtTotal = supplyAmtTotal.plus(row.SUPPLY_AMT || 0);
                                vatAmtTotal = vatAmtTotal.plus(row.VAT_AMT || 0);
                            });

                            this.pageOption.slipsDetailsData.Details = basedDetailsData;
                            this.pageOption.gridObject.grid.settings().setRowData(basedDetailsData);                                //하단 재설정
                            this.pageOption.gridObject.grid.settings().setEditable(true, 3, this.setEditableLimitCount.call(this))  //maxcount 관련 재설정
                            this.pageOption.gridObject.grid.render();


                            this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);                                              //현금,어음 재계산
                        }.bind(this)
                    })
            }.bind(this));
        }
    },

    //적용/저장(Process)
    onFooterProcess: function () {
        this.SaveProcess.call(this, {
            successCallback: function (successOption) {
                var message = {
                    saveSlipsDetailsData: successOption.saveSlipsDetailsData,
                    requestType: this.pageOption.RequestType,
                    callback: function () {
                        this.close();
                    }.bind(this)
                };

                this.sendMessage(this, message);
            }.bind(this),
            failCallback: function () {
                if (this.pageOption.formValidationErrors.hasError() == true) {
                    this.pageOption.formValidationErrors.show();
                }
                if (this.pageOption.gridValidationErrors.hasError() == true) {
                    this.pageOption.gridValidationErrors.show();
                }

                this.hideProgressbar(true);
            }.bind(this)
        })
    },

    //닫기
    onFooterClose: function (e) {
        this.close();
    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_F4: function (event) {
        var columnId = this.pageOption.gridObject.grid.getActiveCellColumnId();
        if (columnId == 'price') {
            this.pageOption.gridObject.grid.saveActiveCell();

            var rowKey = this.pageOption.gridObject.grid.getActiveCellRowId(),
                data = this.pageOption.gridObject.grid.getRowItem(rowKey),
                targetRowArray = new Array();

            targetRowArray.add(data);
            this.setCalcPrice(targetRowArray);

            this.pageOption.gridObject.grid.restoreActiveCell();
        }
    },

    ON_KEY_F8: function (event) {
        if (this.pageOption.isShowApply == false) {
            return;
        }

        if (this.pageOption.isShowApply != 'Y') {
            return;
        }

        this.onFooterProcess();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    //Editable Count Setting
    setEditableLimitCount: function () {
        var returnCount = 3;
        if (this.pageOption.slipsDetailsData.Details.length > 996) {
            //999줄까지 나와야 하기 때문에
            //996줄이 넘어가면 넘어간 줄수를 3으로 나눈 값 - 1만 추가적으로 보여줌
            returnCount = this.pageOption.slipsDetailsData.Details.length % 3 - 1;
        }

        return returnCount;
    },

    //툴바 Navigation
    setNavigationToolbar: function (toolbarItem) {
        toolbarItem
            .showContents.forEach(function (id) {
                this.contents.getControl(id).show();
            }.bind(this));

        toolbarItem
            .hideContents.forEach(function (id) {
                var control = this.contents.getControl(id);

                control.hide();

                if (control.controlType == 'widget.checkbox')
                    control.setValue(false);
            }.bind(this))
    },

    //툴바 재조정
    setToolbar: function () {
        var getType = getCallBackType.call(this);
        this.setNavigationToolbar(
            this.pageOption.toolbarNavigation.where(function (x) {
                return x.action == getType;
            }.bind(this)).first());

        function getCallBackType() {
            var checkedRow = this.pageOption.gridObject.grid.getChecked();

            /*
                case1. 선택한 목록 중 월/일에 입력된 항목이 있고, 라인조정이 선택되어 있으면 Toolbar 버튼은 모두 보인다.
                case2. 선택한 목록 중 월/일에 입력된 항목이 있는 경우 F4와 라인조정이 보이는 경우 : 
                case2. 모두 보이는 경우 : 선택한 목록 중 월/일에 입력되어 있고, 라인조정에 선택되어 있는 경우
            */
            if (checkedRow.length > 0 &&
                checkedRow.where(function (x) {
                    return $.isEmpty(x.SUPPLY_AMT) == false && $.isEmpty(x.VAT_AMT) == false;
                }).length > 0) {
                if (this.contents.getControl('LineAdjust').getValue() == true)
                    return 'CheckLineAdjust';
                else
                    return 'CheckItem';
            }

            return 'NoCheckItem';
        }
    },

    //단가조정
    setCalcPrice: function (targetRowArray) {
        var taxRate = new Decimal(this.pageOption.TaxTypeControlString.vatRate || 0);

        $.each(targetRowArray, function (i, rowData) { //체크 된 행들에 대해 단가조정을 실행
            var supplyAmt = new Decimal(rowData.SUPPLY_AMT || 0),
                vatAmt = new Decimal(rowData.VAT_AMT || 0),
                price = new Decimal(rowData.PRICE || 0),
                qty = new Decimal(rowData.QTY || 0),
                calcTax = new Decimal(0),
                calcAmt = new Decimal(0),
                calcVat = new Decimal(0);

            if (taxRate.isZero() == false) {
                calcTax = taxRate.times(100);
            }
            if ((price.isZero() == false) && (qty.isZero() == false)) {
                var calcPriceBySupplyAmt = new Decimal((price.times(100)).div(new Decimal(100).plus(calcTax)).toFixed(6, 4));       //공급가액 단가
                var calcPriceByVatAmt = new Decimal((price.times(calcTax)).div(new Decimal(100).plus(calcTax)).toFixed(6, 4));      //부가세 단가

                calcAmt = ecount.calc.toFixed(qty.times(calcPriceBySupplyAmt), this.getDecimalPoint('supply_amt'), ecount.config.company.AMT_CALC);

                if (calcTax.isZero() == false) {
                    calcVat = ecount.calc.toFixed(qty.times(calcPriceByVatAmt), this.getDecimalPoint('vat_amt'), ecount.config.company.VAT_CALC);
                }

                price = new Decimal(calcPriceBySupplyAmt.toFixed(this.getDecimalPoint('price'), 4));

                this.pageOption.gridObject.grid.addCellClass('price', rowData[ecount.grid.constValue.keyColumnPropertyName], 'bg-danger');

                this.pageOption.gridObject.grid.setCell('price', rowData[ecount.grid.constValue.keyColumnPropertyName], price.toString(), { isRunChange: false, isRunComplete: false });
                this.pageOption.gridObject.grid.setCell('supply_amt', rowData[ecount.grid.constValue.keyColumnPropertyName], calcAmt.toString(), { isRunChange: false })
                this.pageOption.gridObject.grid.setCell('vat_amt', rowData[ecount.grid.constValue.keyColumnPropertyName], calcVat.toString(), { isRunChange: false })

                this.setRowProcess.call(this, {                                        //행단위의 재정리
                    rowDataCallback: function () {
                        return this.pageOption.gridObject.grid.getRowItem(
                            rowData[ecount.grid.constValue.keyColumnPropertyName]
                        );
                    }.bind(this)
                })

                this.setSyncTotalSum.call(this, {                                      //합계 정리
                    callback: function (supplyAmtTotal, vatAmtTotal) {                 //합계 정리 후 현금,어음 재계산
                        this.setSettleAmt.call(this, supplyAmtTotal, vatAmtTotal);
                    }.bind(this)
                });
            }
        }.bind(this));
    },

    //데이터 변경 시, 행단위로 이외의 데이터가 변경되어야 하는 작업 호출
    setRowProcess: function (option) {
        var rowData = option.rowDataCallback();
        //계산식항목을 계산식으로 설정한 항목을 위하여 두번 실행 합니다.
        //계산식이 적용된 항목을 push한 후, 두번째 루프에서 실행 됩니다.
        var index = 1;
        while (index <= 2) {
            this.setCalcValueFormItem.call(this, {                                                      //양식설정 계산식 항목 mapping
                targetObject: this.pageOption.detailFormSetting,
                rowData: rowData,
                callback: function (returnOption) {
                    //각 계산식타입의 양식항목, 계산식(calcValue), 계산식치환 실데이터(value)
                    if (option.changeIDArray == undefined ||                                            //체크할 변경대상 아이디가 없거나
                        option.changeIDArray.where(function (catchChangeID) {                           //계산식을 적용해야 할 양식항목이 사용자가 직접 수정 등인 경우는
                            return catchChangeID == returnOption.id                                     //진행하지 않는다
                        }).length == 0) {
                        var isSetCell = false;
                        if (option.changeIDArray == undefined)
                            isSetCell = true;
                        else {
                            $.each(returnOption.calcValue.split('§'), function (i, calcID) {           //계산처리 된 계산식에 
                                if (option.changeIDArray.where(function (catchChangeID) {               //변경대상 아이디들이 있을 경우에만
                                    return catchChangeID == calcID
                                }).length > 0) {
                                    isSetCell = true;
                                    return false;
                                }
                            });
                        }

                        if (isSetCell == true) {
                            if (option.changeIDArray != undefined)
                                option.changeIDArray.push(returnOption.id);

                            this.pageOption.gridObject.grid.setCell(                                    //계산식을 재적용 합니다.
                                returnOption.id,
                                rowData[ecount.grid.constValue.keyColumnPropertyName],
                                returnOption.value,
                                { isRunChange: false }
                            );
                        }
                    }
                }.bind(this)
            });

            index++;
        }
    },

    //상/하단 양식설정 기본값 항목에 대한 mapping
    setInputValueFormItem: function (inputValueOption) {
        inputValueOption.targetObject._setInputValueFormItem.call(this, {
            callback: function (returnOption) {
                inputValueOption && $.isFunction(inputValueOption.callback) && inputValueOption.callback(returnOption);
            }.bind(this)
        });
    },

    //상/하단 양식설정 계산식 항목에 대한 mapping
    setCalcValueFormItem: function (calcValueOption) {
        calcValueOption.targetObject._setCalcValueFormItem.call(this, {
            data: calcValueOption.rowData,
            callback: function (returnOption) {
                //각 계산식타입의 양식항목
                calcValueOption && $.isFunction(calcValueOption.callback) && calcValueOption.callback(returnOption);
            }.bind(this)
        });
    },

    //하단양식설정 항목설정 항목에 대한 mapping
    setCustom3SettingValueFormItemInit: function (option) {
        this.pageOption.detailFormSetting._setCustom3SettingValueFormItemInit.call(this, {
            prodCdArray: option.prodCodeArray,
            callback: function (returnRowDataArray) {
                option.rowList.forEach(function (rowData) {
                    this.setCustom3SettingValueFormItem.call(this, {
                        targetObject: this.pageOption.detailFormSetting,
                        rowData: rowData,
                        returnRowDataArray: returnRowDataArray,
                        callback: function (custom3SettingValueInitOption) {
                            this.pageOption.gridObject.grid.setCell(
                                custom3SettingValueInitOption.id,
                                rowData[ecount.grid.constValue.keyColumnPropertyName],
                                custom3SettingValueInitOption.value,
                                { isRunChange: false }
                            );
                        }.bind(this)
                    })

                }.bind(this))
            }.bind(this)
        });
    },

    //상/하단양식설정 항목설정 항목에 대한 mapping
    setCustom3SettingValueFormItem: function (custom3SettingValueOption) {
        custom3SettingValueOption.targetObject._setCustom3SettingValueFormItem.call(this, {
            prodData: custom3SettingValueOption.rowData && custom3SettingValueOption.rowData.PROD_CD ?
                custom3SettingValueOption.returnRowDataArray.where(function (returnRowData) {
                    return returnRowData.prodCd == custom3SettingValueOption.rowData.PROD_CD;
                }.bind(this)).first() : null,
            callback: function (returnOption) {
                custom3SettingValueOption && $.isFunction(custom3SettingValueOption.callback) && custom3SettingValueOption.callback(returnOption);
            }.bind(this)
        })
    },

    // 위젯 연동 팝업이 뜨기전에 호출되는 콜백
    onPreInitPopupHandler: function (control, keyword, config, response) {
        //alert('onPreInitPopupHandler');
        var flag = false;
        switch (control.id.toUpperCase()) {
            case 'PROD_CD':
                if (response && response.length == 1 && !$.isEmpty(response[0].SIZE_CD)) {
                    config.isOnePopupClose = false;
                }
                else {
                    config.isOnePopupClose = true;
                }

                this.pageOption.gridObject.grid.setCell('price_discount_stand', control.rowKey, '0')
                flag = true;
                break;
            default:
                break;
        }

        control.isOthersDataFlag = 'N';
        return flag;
    },

    //검색창등 팝업 호출전에 
    onPopupHandler: function (control, config, handler) {
        switch (control.id.toUpperCase()) {
            case 'PROD_CD':
                if (config.eventTarget && config.eventTarget.toUpperCase() == 'CHANGE') {
                    this.pageOption.gridObject.grid.setCellTransaction().start({ 'autoRefresh': true });
                    this.pageOption.gridObject.grid.setCell('prod_des', control.rowKey, '');
                    this.pageOption.gridObject.grid.setCell('unit', control.rowKey, '');
                    this.pageOption.gridObject.grid.setCell('size_des', control.rowKey, '', { isChangeRun: false });
                    this.pageOption.gridObject.grid.setCellTransaction().end();
                }
                $.extend(config, this.getGridProdPopupInfo(control.rowKey, control.rowIdx, null, config));
                if (config.eventTarget && config.eventTarget.toUpperCase() == 'KEYDOWN') {
                    config.SFLAG = 'N';
                    config.url = '/ECERP/Popup.Search/ES018P';
                    config.keyword = config.__gridOpenPopupTriggerInfo.rowItem.PROD_CD;
                    config.width = 500;
                    config.height = 640;

                } else if (config.eventTarget && config.eventTarget.toUpperCase() == 'DBLCLICK') {
                    config.keyword = '';
                }

                if (config.eventTarget && config.eventTarget.toUpperCase() == 'DBLCLICK') {
                    config.isOnePopupClose = false;
                };
                break;
            default:
                break;
        }

        handler(config);
    },

    //검색창 자동완성시
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        this._super.onAutoCompleteHandler.apply(this, arguments);
    },

    /////////////////////////////////////////////////////////////////////////////
    /////////////////////////// 리펙토링 대상 Start /////////////////////////////
    /////////////////////////////////////////////////////////////////////////////
    //품목검색창 정보
    getGridProdPopupInfo: function (rowKey, rowIdx, isFirstClick, config) {
        //2019-01-03 조명석: 품목명양식을 품목명(전표)로 설정한경우 품목명이 빈칸인 오류가 있는데, rowKey가 무조건 0으로 가져와짐
        //해당 오류 해결되면 삭제가능
        var colName = "prod_des";
        if (this.pageOption.DetailForm.columns.find(function (row) { return row.id == 'prod_cd' })) {
            colName = "prod_cd";
        }

        var gridObj = this.contents.getGrid().grid;

        if (isFirstClick == false) {
            rowKey = gridObj.getNextRowId(colName);
            rowIdx = gridObj.getRowIndexByKey(rowKey);

            var rowCnt = gridObj.getRowCount() - 1;                                // 추가 할 행이 없으면 행 추가
            if (rowKey == 'special-row-0' || rowCnt == rowIdx) {
                gridObj.addRow(2);
                rowKey = gridObj.getNextRowId(colName);
            }
            rowIdx = gridObj.getRowIndexByKey(rowKey);
        };

        var rowData = gridObj.getRowItem(rowKey), rowDataminus, fcName = 'qty', serialno = '';
        if (Number(rowIdx) > 0) {
            rowDataminus = gridObj.getRowItem(gridObj.getRowList(ecount.grid.constValue.keyColumnPropertyName)[rowIdx - 1][ecount.grid.constValue.keyColumnPropertyName]);
        }

        var popupSize = {
            width: 200,
            height: 300
        };
        if ($.isNull(config) == false) {
            popupSize.width = config.width || popupSize.width;
            popupSize.height = config.height || popupSize.height;
        };

        return {        //default settings
            width: popupSize.width,
            height: popupSize.height,
            additional: this.pageOption.isAdditionalPopup,
            controlID: 'PROD_CD',
            isNewDisplayFlag: true,
            isCheckBoxDisplayFlag: true,
            isApplyDisplayFlag: false,
            checkMaxCount: 100,
            FORM_SER: '3',
            //기존 변수 hidSearchData Split 시작
            IoType: '10',
            FcName: fcName,
            rowKey: rowKey,
            rowIdx: rowIdx,
            Cust: '',
            Types: '10',
            RFlag: '2',
            BGubun: '',
            SFLAG: '',
            DGubun: '',
            Prod_Cd: rowData.PROD_CD,
            AddRow: rowKey,
            BGubun2: '',
            UQtyUse: 'N',
            SerialFlag: ecount.config.inventory.USE_SERIAL,
            SerialTime: this.pageOption.SerialTime,
            SerialKey: rowData.SERIAL_KEY,
            WHCD: '',
            WHCDT: '',
            arrIoTypesData: '',
            decQty: ($.isEmpty(rowData.QTY)) ? 0 : rowData.QTY,
            hfTabGubun: '',
            chkset_flag: '',
            chkprod_type: '',
            unUseAutoResize: true,
            lastRowKey: gridObj.getNextRowId('prod_cd'),
            lastRowIdx: gridObj.getRowIndexByKey(gridObj.getNextRowId('prod_cd')),
            isApplyMulti: true,
            ParentDate: Object.toJSON({
                isDisplayButton: true,
                isCheckNewProdAddAbleYn: true,
                isSetInputValue: true,
                isGetProdInspectItem: false,
                Io_Type: '',
                old_prod_cd: rowData.OLD_PROD_CD,
                old_prod_des: rowData.OLD_PROD_DES,
                prod_cd: (rowDataminus) ? rowDataminus.PROD_CD : '',
                prod_des: (rowDataminus) ? rowDataminus.PROD_DES : '',
                qty: (rowDataminus && !$.isEmpty(rowDataminus.QTY)) ? rowDataminus.QTY : 0,
                uqty: (rowDataminus && !$.isEmpty(rowDataminus.UQTY)) ? rowDataminus.UQTY : 0,
                price: (rowDataminus) ? rowDataminus.PRICE : 0,
                isItem_type: true,
                item_des_ReadOnly: false,
                ProdWhmoveYn: 'N',
                edit_flag: this.pageOption.EditFlag,
                List1: true,
                List2: true,
                RptGubun: 'BUY',
                OrdGubun: null,
                time_date: null,
                colType2: '',
                TimeDate: '',
                cust: '',
                iscust: true,
                iscust_hidden: false,
                iscust_readOnly: false,
                iswh_cd: true,
                PageType: false,
                DecUq: (this.pageOption && !$.isNull(this.pageOption.outUQtyDecimal)) ? this.pageOption.outUQtyDecimal : 6,
                DecQ: (this.pageOption && !$.isNull(this.pageOption.outQtyDecimal)) ? this.pageOption.outQtyDecimal : 6,
                DecP: (this.pageOption && !$.isNull(this.pageOption.outPriceDecimal)) ? this.pageOption.outPriceDecimal : 6,
                isSize_des: true,
                isProd_tax: (rowData.VAT_YN == 'Y' ? true : false) || false
            })
        };
    },
    /////////////////////////////////////////////////////////////////////////////
    //////////////////////////// 리펙토링 대상 End //////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    //합계 다시 구하기
    setSyncTotalSum: function (option) {
        var supplyAmtTotal = new Decimal(0),
            vatAmtTotal = new Decimal(0);

        this.pageOption.gridObject.grid.getRowList().forEach(function (row) {
            supplyAmtTotal = supplyAmtTotal.plus(ecount.calc.toFixedAmount(row.SUPPLY_AMT) || 0);
            vatAmtTotal = vatAmtTotal.plus(ecount.calc.toFixedAmount(row.VAT_AMT) || 0);
        });

        this.pageOption.gridObject.grid.addCellClass('supply_amt', 'special-row-0', ['text-right', 'text-bold']);
        this.pageOption.gridObject.grid.addCellClass('vat_amt', 'special-row-0', ['text-right', 'text-bold']);

        this.pageOption.gridObject.grid.setCell('supply_amt', 'special-row-0', supplyAmtTotal.toString(), { isRunChange: false });
        this.pageOption.gridObject.grid.setCell('vat_amt', 'special-row-0', vatAmtTotal.toString(), { isRunChange: false });

        option &&
            option.callback &&
            $.isFunction(option.callback) &&
            option.callback(supplyAmtTotal, vatAmtTotal);
    },

    //현금,외상매출금 금액 설정
    setSettleAmt: function (supplyAmtTotal, vatAmtTotal) {
        if (ecount.config.nation.USE_SETTLE == false) {
            return false;
        }

        var calcAmt =
            supplyAmtTotal.plus(vatAmtTotal)
                .minus(new Decimal(this.contents.getControl('settle_amt2').getValue() || 0)
                    .plus(new Decimal(this.contents.getControl('settle_amt3').getValue() || 0)));

        if (this.contents.getControl('settle').getValue() == '1') {
            this.contents.getControl('settle_amt1').setValue(0);
            this.contents.getControl('settle_amt4').setValue(calcAmt.toString());
        } else {
            this.contents.getControl('settle_amt1').setValue(calcAmt.toString());
            this.contents.getControl('settle_amt4').setValue(0);
        }
    },

    //적용/저장 시
    SaveProcess: function (option) {
        /********************************************************************************************************************
        *Process Start
        ********************************************************************************************************************/
        /***************************************************************************************************
        *Init Start
        ***************************************************************************************************/
        var saveSlipsDetailsData = $.extend(true, {}, this.pageOption.slipsDetailsData);
        /***************************************************************************************************
        *Init End
        ***************************************************************************************************/


        /***************************************************************************************************
        *저장해야 할 Data Setting Start
        ***************************************************************************************************/
        callSaveData.call(this, {
            SaveSlipsDetailsData: saveSlipsDetailsData
        });
        /***************************************************************************************************
        *저장해야 할 Data Setting End
        ***************************************************************************************************/


        /***************************************************************************************************
        *유효성 체크 및 성공/실패에 대한 이후처리 Start
        ***************************************************************************************************/
        checkValidation.call(this, {
            SaveSlipsDetailsData: saveSlipsDetailsData,
            successCallback: option.successCallback.bind(this),
            failCallback: option.failCallback.bind(this)
        });
        /***************************************************************************************************
        *유효성 체크 및 성공/실패에 대한 이후처리 End
        ***************************************************************************************************/
        /********************************************************************************************************************
        *Process End
        ********************************************************************************************************************/


        /********************************************************************************************************************
        *Function for Process Start
        ********************************************************************************************************************/
        //저장할 Data 가져오기
        function callSaveData(option) {
            /***************************************************************************************************
            *Init Start
            ***************************************************************************************************/
            option.SaveSlipsDetailsData.Details.clear();
            /***************************************************************************************************
            *Init End
            ***************************************************************************************************/
            /***************************************************************************************************
            *취합 Start
            ***************************************************************************************************/
            if ($.isEmpty(this.pageOption.MasterFormTypeString) == false) {
                /************************
                *상단취합 Start
                ************************/

                option.SaveSlipsDetailsData.Master.REMARKS = this.contents.getControl('remarks').getValue();

                if (ecount.config.nation.USE_ECTAX == true) {
                    option.SaveSlipsDetailsData.Master.TAX_NO = this.contents.getControl('tax_no').getValue();
                }

                if (ecount.config.nation.USE_SETTLE == true) {
                    option.SaveSlipsDetailsData.Master.SETTLE = this.contents.getControl('settle').getValue();
                    option.SaveSlipsDetailsData.Master.SETTLE_AMT1 = this.contents.getControl('settle_amt1').getValue();
                    option.SaveSlipsDetailsData.Master.SETTLE_AMT2 = this.contents.getControl('settle_amt2').getValue();
                    option.SaveSlipsDetailsData.Master.SETTLE_AMT3 = this.contents.getControl('settle_amt3').getValue();
                    option.SaveSlipsDetailsData.Master.SETTLE_AMT4 = this.contents.getControl('settle_amt4').getValue();
                }
                /************************
                *상단취합 End
                ************************/
            }

            /************************
            *하단취합 Start
            ************************/
            var rowDataList = this.pageOption.gridObject.grid.getRowList().where(function (rowItem) {
                return checkNotEmptyRowSetting.call(this, rowItem) == true;
            }.bind(this));

            if (rowDataList.length > 0) {
                rowDataList.forEach(function (rowItem, i) {

                    option.SaveSlipsDetailsData.Details.push({
                        Rowkey: rowItem[ecount.grid.constValue.keyColumnPropertyName],          //RowKey
                        MMDD: rowItem['MMDD'],                                                  //월일
                        PROD_DES: rowItem['PROD_DES'],                                          //품목명
                        SIZE_DES: rowItem['SIZE_DES'],                                          //규격명
                        QTY: rowItem['QTY'],                                                    //수량
                        PRICE: rowItem['PRICE'],                                                //단가
                        SUPPLY_AMT: (ecount.calc.toFixedAmount(rowItem['SUPPLY_AMT'])),          //공급가액
                        VAT_AMT: (ecount.calc.toFixedAmount(rowItem['VAT_AMT'])),                //부가세
                        REMARKS: rowItem['REMARKS'],                                            //비고
                        PROD_CD: rowItem['PROD_CD'],                                            //품목코드
                        UNIT: rowItem['UNIT']                                                   //단위
                    });
                }.bind(this));
            }

            function checkNotEmptyRowSetting(rowItem) {
                var _checkTargetConvertColNmList = [
                    'PROD_DES',//빈 값 체크해야 하는 대상 항목의 CONVERT_COL_NM
                    'SUPPLY_AMT',
                    'VAT_AMT'
                ],
                    _targetCount = 0,                                   //유효 체크 대상 Count
                    _EmptyCount = 0;                                    //유효 체크 대상 중 값이 비어있는 대상 Count

                checkRun.call(this, 0);


                function checkRun(index) {
                    var _checkTargetConvertColNm = _checkTargetConvertColNmList[index];

                    if ($.isNull(_checkTargetConvertColNm) == true) {
                        return true;
                    }


                    if (this.pageOption.DetailForm.columns.where(function (x) {
                        return x.propertyName == _checkTargetConvertColNm
                    }).length > 0) {
                        _targetCount++;

                        if ($.isEmpty(rowItem[_checkTargetConvertColNm]) == true) {
                            _EmptyCount++;
                        }
                    }

                    checkRun.call(this, index + 1);
                }

                //유효한 체크 대상 Count와 빈값으로 체크 된 유효한 체크 대상 Count가 같다면 유효성 체크 실패
                if (_targetCount == _EmptyCount)
                    return false;

                if (rowItem.MMDD && rowItem.MMDD.length == 10) {
                    rowItem.MMDD = String.format('{0}{1}', rowItem.MMDD.substring(5, 7), rowItem.MMDD.substring(8, 10))
                }

                return true;
            }
            /************************
            *하단취합 End
            ************************/

            /***************************************************************************************************
            *취합 End
            ***************************************************************************************************/
        }

        //유효성 체크
        function checkValidation(option) {
            /***************************************************************************************************
            *Init Start
            ***************************************************************************************************/
            var isSuccess = true;
            this.pageOption.formValidationErrors = new ecount.errorMessage({ contents: this.contents });
            this.pageOption.gridValidationErrors = new ecount.errorMessage({ contents: this.pageOption.gridObject.grid });
            /***************************************************************************************************
            *Init End
            ***************************************************************************************************/

            /***************************************************************************************************
            *유효성 체크 Start
            ***************************************************************************************************/
            /*******************************************************************
            *선행유효성 체크 Start
            *******************************************************************/
            if (option.SaveSlipsDetailsData.Details.length == 0) {
                this.pageOption.gridValidationErrors
                    .addGrid({ id: 'supply_amt', rowKey: 0, message: '' });
            }
            /*******************************************************************
            *선행유효성 체크 End
            *******************************************************************/
            /*******************************************************************
            *양식유효성 체크 Start
            *******************************************************************/
            if ($.isEmpty(this.pageOption.MasterFormTypeString) == false) {
                /************************
                *상단 유효성 체크 Start
                ************************/
                this.contents.validate().result.forEach(function (data, i) {
                    this.pageOption.formValidationErrors.addWidget({
                        id: data.first().control.id,
                        message: ''
                    })
                }.bind(this))
                /************************
                *상단 유효성 체크 End
                ************************/
            }

            /************************
            *하단 유효성 체크 Start
            ************************/
            option.SaveSlipsDetailsData.Details.forEach(function (rowData) {
                for (cell in rowData) {
                    var catchCell = this.pageOption.DetailForm.columns.first(function (columnData) {
                        return columnData.propertyName == cell;
                    });

                    if ((catchCell && catchCell.colEssentialYn || "N") == "Y" &&
                        $.isEmpty(rowData[cell]) == true && catchCell.width > 0) {
                        this.pageOption.gridValidationErrors.addGrid({ id: cell.toLowerCase(), rowKey: rowData.Rowkey, message: '' });
                    }
                }
            }.bind(this));
            /************************
            *하단 유효성 체크 End
            ************************/
            /*******************************************************************
            *양식유효성 체크 End
            *******************************************************************/

            /*******************************************************************
            *Custom유효성 체크 Start
            *******************************************************************/
            (function () {
                if (ecount.config.nation.USE_SETTLE == false) {
                    return false;
                }

                /************************
                *세부내역 리스트 공급가액 합과
                *현금/어음/수표/외상매출금 합의 유효성 체크 Start
                ************************/
                var settleAmtObject = (function () {
                    return {
                        settleAmt1: new Decimal(option.SaveSlipsDetailsData.Master.SETTLE_AMT1 || 0),
                        settleAmt2: new Decimal(option.SaveSlipsDetailsData.Master.SETTLE_AMT2 || 0),
                        settleAmt3: new Decimal(option.SaveSlipsDetailsData.Master.SETTLE_AMT3 || 0),
                        settleAmt4: new Decimal(option.SaveSlipsDetailsData.Master.SETTLE_AMT4 || 0),
                    }
                }.bind(this))(),
                    sumDetailsAmt = option.SaveSlipsDetailsData.Details.sumToDecimal(function (data) { return new Decimal(ecount.calc.toFixedAmount(data.SUPPLY_AMT) || 0) })
                        .plus(option.SaveSlipsDetailsData.Details.sumToDecimal(function (data) { return new Decimal(ecount.calc.toFixedAmount(data.VAT_AMT) || 0) })),
                    sumSettleAmt = (ecount.calc.toFixedAmount(settleAmtObject.settleAmt1))
                        .plus(ecount.calc.toFixedAmount(settleAmtObject.settleAmt2))
                        .plus(ecount.calc.toFixedAmount(settleAmtObject.settleAmt3))
                        .plus(ecount.calc.toFixedAmount(settleAmtObject.settleAmt4));

                if (sumSettleAmt.eq(sumDetailsAmt) == false) {
                    if (settleAmtObject.settleAmt1.isZero() == false) {
                        this.pageOption.formValidationErrors.addWidget({
                            id: 'settle_amt1',
                            message: ecount.resource.MSG07549
                        })
                    }

                    if (settleAmtObject.settleAmt2.isZero() == false) {
                        this.pageOption.formValidationErrors.addWidget({
                            id: 'settle_amt2',
                            message: ecount.resource.MSG07549
                        })
                    }

                    if (settleAmtObject.settleAmt3.isZero() == false) {
                        this.pageOption.formValidationErrors.addWidget({
                            id: 'settle_amt3',
                            message: ecount.resource.MSG07549
                        })
                    }

                    if (settleAmtObject.settleAmt4.isZero() == false) {
                        this.pageOption.formValidationErrors.addWidget({
                            id: 'settle_amt4',
                            message: ecount.resource.MSG07549
                        })
                    }
                }
                /************************
                *세부내역 리스트 공급가액 합과
                *현금/어음/수표/외상매출금 합의 
                유효성 체크 End
                ************************/
            }.bind(this))();
            /*******************************************************************
            *Custom유효성 체크 End
            *******************************************************************/


            /************************
            *유효성 체크 이후 처리 Start
            ************************/
            if (this.pageOption.gridValidationErrors.hasError() == true ||
                this.pageOption.formValidationErrors.hasError() == true)
                isSuccess = false;

            if (isSuccess == true) {
                option.successCallback &&
                    $.isFunction(option.successCallback) &&
                    option.successCallback({
                        saveSlipsDetailsData: option.SaveSlipsDetailsData
                    });
            } else {
                option.failCallback &&
                    $.isFunction(option.failCallback) &&
                    option.failCallback();
            }
            /************************
            *유효성 체크 이후 처리 End
            ************************/
            /***************************************************************************************************
            *유효성 체크 End
            ***************************************************************************************************/
        }
        /********************************************************************************************************************
        *Function for Process End
        ********************************************************************************************************************/
    },

    //양식항목의 소수점 구해오기
    getDecimalPoint: function (colCd) {
        var catchItem = this.pageOption.DetailForm.columns.first(function (x) { return x.id == colCd }),
            decimalPoint = $.parseNumber((
                catchItem.dataType &&
                catchItem.dataType.substring(1)) || 6
            );

        return decimalPoint;
    }
});