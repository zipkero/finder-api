window.__define_resource && __define_resource("LBL03764","LBL00329","LBL04053","LBL08396","LBL09847","LBL09848","LBL02159","LBL09849","LBL01992","LBL03589","BTN00065","BTN00008","LBL01084","LBL09594","LBL09595","LBL09596","LBL09597","LBL09598","LBL09599","LBL09600");
/****************************************************************************************************
1. Create Date : 2015.08.21
2. Creator     : 신희준
3. Description : ex) 일반전표 > 관리버튼 > 만기일자설정 > 수금/지급계획등록 > 수금/지급예정일변경 팝업창
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory('ecount.page.popup.type2', 'CM009P_02', {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/


    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL03764);  //수금/지급예정일변경
    },

    onInitContents: function (contents, resource) {
        var settingData = this.viewBag.InitDatas.CustInfomation,    //수금/지급예정일 설정값
            permit = this.viewBag.Permission.permit,                //권한
            g = widget.generator,
            ctrl = g.control(),
            formdata = g.form(),

            collPayType = settingData.COLL_PAY_TYPE, //해당거래처의 수금/지급예정일 유형
            collBasicPayType = this.TrxType === '1' ? ecount.config.company.COLL_PLAN_TYPE : ecount.config.company.PAY_PLAN_TYPE, //회사설정의 수금/지급예정일 유형

            collPayD = collPayType !== 'B' ? settingData.COLL_PAY_D : this.TrxType === '1' ? ecount.config.company.COLL_PLAN_D : ecount.config.company.PAY_PLAN_D,     //해당거래처의 수금/지급예정일이 기본설정이면 회사정보의 수금/지급예정일 설정값, 기본설정이 아니면 해당거래처의 수금/지급예정일 설정값
            collPayM = collPayType !== 'B' ? settingData.COLL_PAY_M : this.TrxType === '1' ? ecount.config.company.COLL_PLAN_M : ecount.config.company.PAY_PLAN_M,     //해당거래처의 수금/지급예정일이 기본설정이면 회사정보의 수금/지급예정일 설정값, 기본설정이 아니면 해당거래처의 수금/지급예정일 설정값
            collPayW = collPayType !== 'B' ? settingData.COLL_PAY_W : this.TrxType === '1' ? ecount.config.company.COLL_PLAN_W : ecount.config.company.PAY_PLAN_W,     //해당거래처의 수금/지급예정일이 기본설정이면 회사정보의 수금/지급예정일 설정값, 기본설정이 아니면 해당거래처의 수금/지급예정일 설정값
            collPayDW = collPayType !== 'B' ? settingData.COLL_PAY_DW : this.TrxType === '1' ? ecount.config.company.COLL_PLAN_DW : ecount.config.company.PAY_PLAN_DW, //해당거래처의 수금/지급예정일이 기본설정이면 회사정보의 수금/지급예정일 설정값, 기본설정이 아니면 해당거래처의 수금/지급예정일 설정값

            basicSettingText = '(' + this.SetBasicSettingText(this.TrxType, collBasicPayType) + ')';

        formdata.template('register');             //form 템플릿

        if (this.IsCustNameDisplay) {
            formdata
                .add( //labe위젯 추가(거래처)
                    ctrl
                      .define('widget.label', 'lblCust', 'lblCust', ecount.resource.LBL00329) //거래처
                      .label(settingData.CUST_NAME)
                      .end()
                );
        }

        formdata
            .add( //paymentData Radio위젯 추가
                ctrl
                  .define('widget.radio.paymentDate', 'rdoPayment', 'rdoSetting', ecount.resource.LBL04053) //설정변경
                  .label(
                        //Data : 위젯에서 각행에 보여지는 항목 = Data는 Object로 받는다.
                        //Data[arr].label : 위젯에서 각행에 포함되는 각각의 위젯[현재는 radio, select, label 사용가능]
                            [   //Data
                                [ //Data[0].label 1
                                    { type: 'radio', value: 'B', label: ecount.resource.LBL08396 + basicSettingText, checked: collPayType === 'B' ? 'checked' : '' } //기본설정
                                ],
                                [ //Data[0].label 3
                                    { type: 'radio', value: 'D', label: '', checked: collPayType === 'D' ? 'checked' : '' },
                                    { type: 'select', value: '365', selectedValue: collPayType === 'D' ? collPayD : '' },
                                    { type: 'label', value: ecount.resource.LBL09847.replace('{0}','') }
                                ],
                                [ //Data[0].label 5
                                    { type: 'radio', value: 'M', label: '', checked: collPayType === 'M' ? 'checked' : '' },
                                    { type: 'select', value: '12', selectedValue: collPayType === 'M' ? collPayM : '' },
                                    { type: 'label', value: ecount.resource.LBL09848.replace('{0}', '') },
                                    { type: 'select', value: 'lastday', selectedValue: collPayType === 'M' ? collPayD : '' },
                                    { type: 'label', value: ecount.resource.LBL02159 } //일
                                ],
                                [ //Data[0].label 5
                                    { type: 'radio', value: 'W', label: '', checked: collPayType === 'W' ? 'checked' : '' },
                                    { type: 'select', value: '52', selectedValue: collPayType === 'W' ? collPayW : '' },
                                    { type: 'label', value: ecount.resource.LBL09849.replace('{0}', '') },
                                    { type: 'select', value: 'weekly', selectedValue: collPayType === 'W' ? collPayDW : '' },
                                    { type: 'label', value: ecount.resource.LBL01992 } //일
                                ],
                                [ //Data[0].label 1
                                    { type: 'radio', value: 'N', label: ecount.resource.LBL03589, checked: collPayType == 'N' ? 'checked' : '' } //사용안함
                                ]
                            ]
                        )
                  .end()
            );

        contents.add(formdata);
    },

    onInitFooter: function (footer, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control();

        toolbar
            .addLeft(ctrl.define('widget.button', 'Save').label(ecount.resource.BTN00065))                  //footer 영역의 toolbar에 저장 위젯 추가
            .addLeft(ctrl.define('widget.button', 'Close').label(ecount.resource.BTN00008));                //footer 영역의 toolbar에 닫기 위젯 추가

        footer.add(toolbar); //toolbar add[footer 영역의 닫기]
    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
    onLoadTabPane: function (event) {
        this._super.onLoadTabPane.apply(this, arguments);
    },

    onLoadTabContents: function (event) {
        this._super.onLoadTabContents.apply(this, arguments);
    },

    onChangeHeaderTab: function (event) {
        this._super.onChangeHeaderTab.apply(this, arguments);
    },

    onChangeContentsTab: function (event) {
        this._super.onChangeContentsTab.apply(this, arguments);
    },

    onLoadComplete: function (event) {
        this._super.onLoadComplete.apply(this, arguments);
    },

    onPopupHandler: function (control, config, handler) {
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        this._super.onAutoCompleteHandler.apply(this, arguments);
    },

    onMessageHandler: function (message) {
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },

    onGridAfterFormLoad: function (e, data, grid) {
        this._super.onGridAfterFormLoad.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ 'on' + target + control id ]
    ****************************************************************************************************/

    onFooterSave: function (e) {
        var thisObj = this,
            _saveData = this.contents.getControl('rdoPayment').getSelectedValue(),
            _collPayType = 'N',
            _collPayD = _collPayM = _collPayW = _collPayDW = 0;

        switch (_saveData[0])
        {
            case 'B':
                _collPayType = 'B';
                break;
            case 'D':
                _collPayType = 'D';
                _collPayD = _saveData[1];
                break;
            case 'M':
                _collPayType = 'M';
                _collPayM = _saveData[1];
                _collPayD = _saveData[2];
                break;
            case 'W':
                _collPayType = 'W';
                _collPayW = _saveData[1];
                _collPayDW = _saveData[2];
                break;
            case 'N':
            default:
                _collPayType = 'N';
                break;
        }

        var saveData = {
            Request: {
                Data: {
                    BUSINESS_NO: this.CustCode,
                    COLL_PAY_TYPE: _collPayType,
                    COLL_PAY_D: _collPayD,
                    COLL_PAY_M: _collPayM,
                    COLL_PAY_W: _collPayW,
                    COLL_PAY_DW: _collPayDW
                }
            }
        }

        ecount.common.api({
            url: '/SVC/Account/Basic/UpdateCust',
            data: Object.toJSON(saveData),
            success: function (result) {
                thisObj.footer.get(0).getControl('Save').setAllowClick();
                this.setTimeout(function () {
                    thisObj.close();
                }, 0);
            }
        })
    },


    onFooterClose: function(e){
        this.close();
        return false;
    },


    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F8: function (e) {
        this.onFooterSave(e);
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/


    //기본설정Text Return(Return BasicSetting Text)
    SetBasicSettingText: function (_trxType, _collBasicPayType) {
        var returnText;

        _d = _trxType == '1' ? ecount.config.company.COLL_PLAN_D : ecount.config.company.PAY_PLAN_D;
        _m = _trxType == '1' ? ecount.config.company.COLL_PLAN_M : ecount.config.company.PAY_PLAN_M;
        _w = _trxType == '1' ? ecount.config.company.COLL_PLAN_W : ecount.config.company.PAY_PLAN_W;
        _dw = _trxType == '1' ? ecount.config.company.COLL_PLAN_DW : ecount.config.company.PAY_PLAN_DW;

        switch (_collBasicPayType)
        {
            case 'D':
                returnText = String.format(ecount.resource.LBL09847, _d);
                break;
            case 'M':
                if (_d == '31')
                    returnText = String.format(ecount.resource.LBL09848 + ' ', _m) + ecount.resource.LBL01084;
                else
                    returnText = String.format(ecount.resource.LBL09848 + ' ', _m) + _d + ecount.resource.LBL02159;
                break;
            case 'W':
                returnText = String.format(ecount.resource.LBL09849 + ' ', _w) + this.GetWeekDay(_dw);
                break;
            case 'N':
            default:
                returnText = ecount.resource.LBL03589;
                break;
        }
        return returnText;
    },

    //날짜 명 Return(Return WeekDay Resource)
    GetWeekDay: function (index) {
        var value;
        switch (index) {
            case '1':
                value = ecount.resource.LBL09594;   //일
                break;
            case '2':
                value = ecount.resource.LBL09595;   //월
                break;
            case '3':
                value = ecount.resource.LBL09596;   //화
                break;
            case '4':
                value = ecount.resource.LBL09597;   //수
                break;
            case '5':
                value = ecount.resource.LBL09598;   //목
                break;
            case '6':
                value = ecount.resource.LBL09599;   //금
                break;
            case '7':
                value = ecount.resource.LBL09600;   //토
                break;
        }
        return value;
    }
});