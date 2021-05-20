window.__define_resource && __define_resource("LBL00731","LBL00401","LBL03017","LBL02983","MSG03839","LBL01587","BTN00069","BTN00008","MSG00962","LBL00730");
/****************************************************************************************************
1. Create Date : 2015.08.13
2. Creator     : 신희준(ShinHeeJun)
3. Description : 재고 > 판매 입력 > 품목 검색 > 규격 팝업창 (Inv. > New Sales > Item Search > Spec. Popup)
4. Precaution  :
5. History     : 2019.12.09(양미진) - dev 33028 A19_04455 품목검색창에서 규격그룹지정된 품목관련 확인요청
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ES016P_01", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    //입력 화면 컨트롤 체크 여부
    ParentEntity: null,

    //부모창에서 전달 받은 데이터 - 초기화 용도
    paramDataInit: null,

    //부모창에서 전달 받은 데이터
    paramData: null,

    //부모창(전표입력화면)으로 값 내려주기 위한 기초 - 초기화 용도
    parentDataM: null,

    //부모창(전표입력화면)으로 값 내려줄 데이터
    parentData: null,

    itemCount : 0,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        //입력 화면 컨트롤 체크 여부
        this.ParentEntity = {
            Io_Type: "",
            isSetInputValue: "",
            DecQ: "",
            DecP: ""
        };
        //부모창에서 전달 받은 데이터 - 초기화 용도
        this.paramDataInit = {
            PROD_CD: "",            //품목코드                                             A
            PROD_DES: "",           //품목명                                               B               
            
            EXCHRATE: "",           //당수량                                               H   
            SPRICEVAT: "",          //특별단가 부가세 포함여부(Y,N)                        I   
            SIZE_DES: "",           //규격명                                               J   
            VATRATE: "",            //부가가치세율                                         K
            SIZE_FLAG: "",          //                                                     L

            FCNAME: "",
            rowKey: "",
            rowIdx: "",
            BGUBUN: "",
            ADDROW: "",
            EXCH_RATE2: "",
            DENO_RATE: "",

            BAL_FLAG: "",           //재고수량관리 사용여부(1,0)                           M
            TAX: "",                //매입 부가가치세율 / 품목의 부가가치세율(Sale003.Tax) N
            VATYN: "",              //부가가치세율(매입/매출)                              O
            BUSINESS_NO: "",        //거래처코드                                           T
            CUST_NAME: ""           //거래처명                                             U
        };
        //부모창에서 전달 받은 데이터
        this.paramData = {};
        //부모창(전표입력화면)으로 값 내려주기 위한 기초 - 초기화 용도
        this.parentDataM = {
            PROD_CD: "",            //품목코드
            PROD_CD_FOCUS: "",      //품목코드 포커스
            PROD_DES: "",           //품목명
            PROD_DES_FOCUS: "",     //품목명 포커스("")
            QTY: "",                //수량
            QTY_READONLY: "",       //수량 수정불가("")
            QTY_FOCUS: "",          //수량 포커스
            P_BOM_QTY1_FOCUS: "",   //포커스
            SIZE_DES: "",           //규격명
            TAX: "",                //부가세율
            PROD_TAX: "",           //판매면 품목의 부가가치세율(Sale003.Tax), 구매면 매입 부가가치세율(Sale003_Price.VAT_RATE_BY)
            PROD_TAX_YN: "",        //IO_Type이 20/24/42/43 이면 부가가치세율(매입) 기본여부(N:기본설정, Y:직접입력), 아니면 부가세적용여부(Y:적용, N:미적용)
            PRICE: "",              //단가
            PRICE_VAT_INCLUDE: "",
            UQTY: "",               //추가수량
            UQTY_FOCUS: "",         //추가수량 포커스
            EXCH_RATE: "",          //당수량
            SIZE_FLAG: "",          //규격계산설정(0:계산안함/1:계산함)   
            BAL_FLAG: "",           //수불품목(0:제외,1:수불,2:수불(재고체크))   
            OLD_PROD_CD: "",        //기존품목코드("")
            OLD_PROD_DES: "",       //기존품목명("")
            SERIAL_CLASS: "",       //시리얼항목 스타일시트의 Class("")
            T_QTY: "",              //("")
            BOM_DES: "",            //BOM명칭("")
            BOM_NO: "",             //BOM번호("")
            HFBOMDESDEFAULT: "",    //("")
            HFBOMNODEFAULT: "",     //("")
            UNIT: "",               //("")
            CUST: "",               //거래처코드
            CUST_FOCUS: "",         //거래처코드 포커스("")
            CUST_DES: "",           //거래처코드명
            ITEM_TYPE: "",          //("")
            ITEM_CD: "",            //("")
            ITEM_DES: "",           //("")
            ITEM_DES_READONLY: "",  //("")
            SERIALNO: "",           //시리얼번호("")
            SERIAL_TYPE: "",        //시리얼타입("")
            SERIAL_CD_CSS: "",      //시리얼코드 스타일시트의 Class("")
            SERIAL_CD_FOCUS: "",    //시리얼코드 포커스("")
            CHKWARE_CHECKED: "",    //("")
            WARE_FLAG_CHECKED: "",  //("")
            QC_YN: "",              //("")
            QC_BUY_TYPE: "",        //("")
            ACCTSUBPROD: "",        //("")
            ACCTSUBSIZE: "",        //("")
            ACCTSUBBIGO: "",        //("")
            TIME_DATE: "",          //("")
            TIME_DATE_COLOR: "",    //("")
            WH_CD_FOCUS: "",         //("")
            INPUTFOCUS: "",
            INPUTFOCUSFLAG: "N",
            INSPECT_STATUS: "L",     //
            totalItemCnt: 0,
            ItemCnt: 0
        };
        //부모창(전표입력화면)으로 값 내려줄 데이터
        this.parentData = {
        };
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) { // Header Setting
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL00731);
    },

    onInitContents: function (contents, resource) { // Contents Setting
        var generator = widget.generator,
            grid = generator.grid(),
            toolbar = generator.toolbar(),
            ctrl = generator.control(),

            WHERE_TITLE = this.Prod_Des + ' [' + this.Prod_Cd + '] - ' + this.Size_Cd; //Contents 영역의 상단 타이틀(Top Title)

        var thisobj = this;
        this.ParentEntity = $.parseJSON(decodeURIComponent(this.Parent));   //JsonString으로 전달받은 Parent부가정보를 Parsing

        toolbar.addLeft(ctrl.define('widget.label', 'SchDisplay').label(ecount.resource.LBL00401 + ' : ' + WHERE_TITLE));  //상단 타이틀 정보를 툴바에 add

        // SP에서 넘겨받은 Data를 재가공, Klass Binding하여 품목정보를 List에 가공
        var _list = this.viewBag.InitDatas.DataList.select(function (item) {
            var _data = {},
                _sizedes = $.trim(this.Size_Des + ' ' + item.SIZE_DES);

            _data["PROD_CD"] = this.Prod_Cd;    //품목코드
            _data["PROD_DES"] = this.Prod_Des;  //품목명
            _data["SIZE_DES"] = _sizedes;

            if (!$.isEmpty(_data["SIZE_DES"]))
                _data["CUSTOM_SIZE_DES"] = this.Prod_Des + "[" + _data["SIZE_DES"] + "]";  //품목명 [규격명]
            else
                _data["CUSTOM_SIZE_DES"] = this.Prod_Des;

            return _data;   //array return
        }, this);    //static select function에 this객체전달


        grid
            .setRowData(_list) //가공된 정보를 Grid List로 활용
            .setColumns([ //컬럼설정
                    {
                        id: 'PROD_CD',              //각 컬럼을 식별하기 위한 속성
                        propertyName: 'PROD_CD',    //행 데이터에서 해당컬럼을 식별하기 위한 속성 
                        title: ecount.resource.LBL03017,   //화면에서 표시 될 컬럼의 제목
                        width: '100'                //해당컬럼의 가로넓이
                    }, // 품목코드
                    {
                        id: 'SIZE_CD',              //컬럼을 식별하기 위한 속성
                        propertyName: 'CUSTOM_SIZE_DES',   //행 데이터에서 해당컬럼을 식별하기 위한 속성 
                        title: ecount.resource.LBL02983,   //화면에서 표시 될 컬럼의 제목
                        width: ''                   //해당컬럼의 가로넓이
                    }  //품목,규격
            ])
            .setKeyColumn(['PROD_CD', 'SIZE_CD'])   //각 행을 식별하기 위한 속성

            .setCheckBoxUse((this.isCheckBoxDisplayFlag) ? true : false)                //체크박스 사용여부
            .setCheckBoxRememberChecked(true)                                           //선택했던 체크박스 값 기억여부
            /* 체크박스 최대개수 체크는 현재화면에서는 의미가 없음, 
               현재는 체크 시 전표로 전달되는 형태
               추후 적용버튼 등 기능 추가 시 아래의 API호출 필요함
            .setCheckBoxMaxCount(this.checkBoxMaxCount)                                 //체크박스 최대 체크개수
            .setCheckBoxMaxCountExceeded(function (maxCount) {                          //체크박스 최대 체크개수 이상 체크 시 메시지 설정
                ecount.alert(String.format(ecount.resource.MSG03839, maxCount));               //최대 {0}개까지 선택 가능합니다.
            })
            */
            .setCheckBoxHeaderStyle({
                     'title': this.KeyMode == true ? '' : ecount.resource.LBL01587,
                     'visible': this.KeyMode,
                     'width': 35
                 })
            .setCheckBoxActiveRowStyle(true)                                            //체크박스 체크 시 배경색 설정여부
            //.setCheckBoxHeaderCallback({                                                      //체크박스 콜백함수 설정
            //    'click': function (e, data) {                                           //클릭 시 동작할 콜백함수 설정 
            //        debugger;
            //        if (e.target.checked) {
            //            var checked = this.contents.getGrid().grid.getChecked();
            //            $.each(checked, function (i, item) {
            //                thisobj.setInitDataSetting(item);                              //기초데이터 설정
            //                thisobj.setInputSendMessage(item, thisobj.paramData, "checkBox"); //부모창(전표입력화면)으로 값 내려주기
            //            });
            //        }
            //    }.bind(this)
            //})
            .setCheckBoxCallback({                                                      //체크박스 콜백함수 설정
                'click': function (e, data) {                                           //클릭 시 동작할 콜백함수 설정 
                    if (!this.KeyMode) {
                        if (e.target.checked) {
                            this.itemCount++;
                            this.setInitDataSetting(data.rowItem);                              //기초데이터 설정
                            this.setInputSendMessage(data.rowItem, this.paramData, "checkBox"); //부모창(전표입력화면)으로 값 내려주기
                        }
                    }
                }.bind(this)
            })

            .setCustomRowCell('SIZE_CD', this.setSizeDescreption.bind(this));           //데이터 재정의(품목/규격)

        contents
            .add(toolbar)                                                               //toolbal add[컨텐츠 영역의 상단 타이틀]
            .addGrid("dataGrid" + this.pageID, grid);                                                 //grid add[리스트]
    },

    onInitFooter: function (footer, resource) { // Footer Setting
        var generator = widget.generator;
        var toolbar = generator.toolbar();
        var ctrl = generator.control();
        if (this.KeyMode) {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        }
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));    //footer 영역의 toolbar에 닫기 위젯 추가

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
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/

    // 닫기 버튼 클릭
    onFooterClose: function () {
        this.close();
        return false;
    },

    // 적용 버튼 클릭
    onFooterApply: function (e) {
        var thisobj = this;
        var checked = this.contents.getGrid().grid.getChecked();

        if (checked.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        $.each(checked, function (i, item) {
            thisobj.setInitDataSetting(item);                              //기초데이터 설정
            thisobj.setInputSendMessage(item, thisobj.paramData, "checkBox"); //부모창(전표입력화면)으로 값 내려주기
        });

        this.close();
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/
    ON_KEY_F8: function (e) {
        this.onFooterApply(e);
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //그리드에서 품목/규격 셀 클릭 시 호출되는 이벤트
    setSizeDescreption: function (value, rowItem) {
        var option = {};
        option.data = value

        if (this.isDisableLinkFlag !== true) {
        option.controlType = 'widget.link';                                                                 //위젯 타입
        option.event = {
            'click': function (e, data) {                                 //클릭 시
                this.setInitDataSetting(data.rowItem);                    //기초 데이터 설정
                this.setInputSendMessage(data.rowItem, this.paramData)    //부모창(전표입력화면)으로 값 내려주기
            }.bind(this)    //해당 이벤트를 Klass Binding
        }
        } else {
            option.controlType = 'widget.label';
        }

        return option;
    },


    // 기초 데이터 설정
    setInitDataSetting: function (data) {
        var prodData = { isParentNotFocus: true };
        if (this.getParentInstance() && this.getParentInstance().contents.getGrid() && this.getParentInstance().contents.getGrid().grid.getRowList() && this.getParentInstance().contents.getGrid().grid.getRowList().where(function (item) { return item.PROD_CD == this.Prod_Cd }.bind(this)).length > 0) {
            if (this.getParentInstance().setProdInputDataSave) {
                prodData = this.getParentInstance().setProdInputDataSave(this.getParentInstance().contents.getGrid().grid.getRowList().where(function (item) { return item.PROD_CD == this.Prod_Cd }.bind(this))[0]);
            }
        }

        $.extend(this.paramData, this.paramDataInit, prodData);   //부모창에서 전달 받은 데이터 객체 초기화
        // 부모에서 전달 받은 데이터 Mapping
        this.paramData.PROD_CD = this.Prod_Cd;                                              // A
        this.paramData.PROD_DES = this.Prod_Des;                                            // B
        this.paramData.SPECIALPRICE = this.SpecialPrice;                                    // E
         this.paramData.EXCHRATE = this.ExchRate;                                            // H
        this.paramData.SPRICEVAT = this.SpriceVat;                                          // I
        this.paramData.SIZE_DES = $.trim((this.Size_Des + " " + data.SIZE_DES));            // J
        this.paramData.VATRATE = this.VatRate;                                              // K
        this.paramData.SIZE_FLAG = this.Size_Flag;                                          // L
        // ""
        this.paramData.FCNAME = this.FcName;
        this.paramData.rowKey = this.rowKey;
        this.paramData.rowIdx = this.rowIdx;
        this.paramData.BGUBUN = this.BGubun;
        this.paramData.ADDROW = this.AddRow;
        this.paramData.EXCH_RATE2 = this.Exch_Rate2;
        this.paramData.DENO_RATE = this.Deno_Rate;
        // ""
        this.paramData.BAL_FLAG = this.Bal_Flag;                                            // M
        this.paramData.TAX = this.Tax;                                                      // N
        this.paramData.VATYN = this.VatYn;                                                  // O
        this.paramData.BUSINESS_NO = this.Business_No;                                      // T
        this.paramData.CUST_NAME = this.Cust_Name;                                          // U
        this.paramData.LastPriceVatInclude = this.LastPriceVatInclude;
        this.paramData.IsLastPriceVatInc = this.IsLastPriceVatInc;
        this.paramData.UNIT = this.Unit;
        this.paramData.INSPECT_STATUS = this.InspectStaus;
    },

    // 부모창으로 값 내려주기
    setInputSendMessage: function (data, paramData, clickType) {
        debugger;
        console.log(data);
        $.extend(this.parentData, this.parentDataM);            //부모창(전표입력화면)으로 값 내려주기 위한 객체 초기화

        if (this.isFromCS == true) {
            this.parentData["C0001"] = this.ParentEntity.C0001;
            this.parentData["C0002"] = this.ParentEntity.C0002;
            this.parentData["C0003"] = this.ParentEntity.C0003;
            this.parentData["BASE_QTY"] = this.ParentEntity.BASE_QTY;
        }

        var parentPopup = this.getParentInstance();             //부모창(ex : 품목검색) 객체 생성
        var ownerPopup = this.getOwnerParent(this.OwnerPopupID) //부모창(전표입력화면) 객체 생성

        if (this.OwnerPopupID == "EGP005M") {               //부모창의 ID가 다목적입력 팝업일 경우의 예외처리
            this.parentData.PROD_CD = paramData.PROD_CD;    //품목코드
            this.parentData.PROD_DES = paramData.PROD_DES;  //품목명
            this.parentData.totalItemCnt = 1;
            this.parentData.ItemCnt = 0;

            var message = {
                name: "PROD_DES",
                code: "PROD_CD",
                data: this.OwnerPopupID,
                isAdded: true,
                addPosition: "current",
                callback: this.close.bind(this, false)
            };
            parentPopup.sendMessage({ pageID: this.ParentPopupID }, message);     //부모창(ex : 품목검색)에서 sendMessage Function 호출 - 전표입력화면의 Grid로 데이터를 매핑하기 위한 방법
            return; //함수종료
        }

        var rowIdx = this.rowkey;  //부모창(전표입력화면)에서 팝업을 띄운 시점의 그리드 행 Index

        //if (this.Pos == "1000")
        //    rowIdx = 1000;

        if (this.isSetInputValue) { //입력화면 기본값 설정여부
            ownerPopup.fnSetInputValue(rowIdx, this.paramData.PROD_CD); //부모창(전표입력화면)의 fnSetInputValue함수 호출
        }

        var Io_Type = this.ParentEntity.Io_Type;    //부모창(ex : 품목검색)에서 전달받은 io_type할당

        this.parentData.PROD_CD = this.paramData.PROD_CD; //품목코드

        if (this.BGubun == "Y")
            this.parentData.QTY = "1"; //수량

        if ((Io_Type.substring(0, 1) == '1') || (Io_Type.substring(0, 1) == '2') || (Io_Type == "31" || Io_Type == "32" || Io_Type == "41" || Io_Type == "42" || Io_Type == "43")) {
            this.parentData.SIZE_DES = this.paramData.SIZE_DES;  //<%=GetResource("LBL00730")%>명
            this.parentData.PROD_DES = this.paramData.PROD_DES;  //품목명

            if ((Io_Type.substring(0, 1) == '1') || (Io_Type.substring(0, 1) == '2'))
                this.parentData.TAX = this.paramData.VATRATE;   //tax            
        } else {
            if (this.Size_Des != '') {
                this.parentData.PROD_DES = this.paramData.PROD_DES + ' [' + this.paramData.SIZE_DES + ']';  //품목명
            } else {
                this.parentData.PROD_DES = this.paramData.PROD_DES;   //<%=GetResource("LBL00730")%>명
            }
        }
        //판/구매에서만 값 넘겨줌
        if ((Io_Type.substring(0, 1) == '1') || (Io_Type.substring(0, 1) == '2') || (Io_Type == "31" || Io_Type == "32" || Io_Type == "41" || Io_Type == "42" || Io_Type == "43")) {
            this.parentData.SIZE_DES = this.paramData.SIZE_DES;   //<%=GetResource("LBL00730")%>명
        }
        if ((Io_Type.substring(0, 1) == '1') || (Io_Type.substring(0, 1) == '3')) {
            var dec_p = Number(this.ParentEntity.DecP);
            var dec_q = Number(this.ParentEntity.DecQ);
        } else {
            var dec_p = Number(ecount.config.inventory.IN_DEC_P);
        }
        var dec_p = Number(this.ParentEntity.DecP);
        var dec_q = Number(this.ParentEntity.DecQ);

        //현업요청및 발주계획 [거래처 찍어주기]
        this.parentData.CUST = this.paramData.BUSINESS_NO;
        this.parentData.CUST_DES = this.paramData.CUST_NAME;
        this.parentData.INSPECT_STATUS = this.paramData.INSPECT_STATUS;

        this.parentData.PRICE = this.SizePriceInfo.PRICE;
        this.parentData.PRICE_VAT_INCLUDE = this.SizePriceInfo.PRICE_VAT_INCLUDE;
        this.parentData.PRICE_VAT_YN = this.SizePriceInfo.PRICE_VAT_YN;

        this.parentData.IN_PRICE = this.SizePriceInfo.IN_PRICE;
        this.parentData.IN_PRICE_VAT_INCLUDE = this.SizePriceInfo.IN_PRICE_VAT_INCLUDE;
        this.parentData.IN_PRICE_VAT_YN = this.SizePriceInfo.IN_PRICE_VAT_YN;

        this.parentData.OUT_PRICE = this.SizePriceInfo.OUT_PRICE;
        this.parentData.OUT_PRICE_VAT_INCLUDE = this.SizePriceInfo.OUT_PRICE_VAT_INCLUDE;
        this.parentData.OUT_PRICE_VAT_YN = this.SizePriceInfo.OUT_PRICE_VAT_YN;

        this.parentData.OUT_PRICE1 = this.SizePriceInfo.OUT_PRICE1;
        this.parentData.OUT_PRICE1_VAT = this.SizePriceInfo.OUT_PRICE1_VAT;
        this.parentData.OUT_PRICE1_VAT_YN = this.SizePriceInfo.OUT_PRICE1_VAT_YN;

        this.parentData.OUT_PRICE2 = this.SizePriceInfo.OUT_PRICE2;
        this.parentData.OUT_PRICE2_VAT = this.SizePriceInfo.OUT_PRICE2_VAT;
        this.parentData.OUT_PRICE2_VAT_YN = this.SizePriceInfo.OUT_PRICE2_VAT_YN;

        this.parentData.OUT_PRICE3 = this.SizePriceInfo.OUT_PRICE3;
        this.parentData.OUT_PRICE3_VAT = this.SizePriceInfo.OUT_PRICE3_VAT;
        this.parentData.OUT_PRICE3_VAT_YN = this.SizePriceInfo.OUT_PRICE3_VAT_YN;

        this.parentData.OUT_PRICE4 = this.SizePriceInfo.OUT_PRICE4;
        this.parentData.OUT_PRICE4_VAT = this.SizePriceInfo.OUT_PRICE4_VAT;
        this.parentData.OUT_PRICE4_VAT_YN = this.SizePriceInfo.OUT_PRICE4_VAT_YN;

        this.parentData.OUT_PRICE5 = this.SizePriceInfo.OUT_PRICE5;
        this.parentData.OUT_PRICE5_VAT = this.SizePriceInfo.OUT_PRICE5_VAT;
        this.parentData.OUT_PRICE5_VAT_YN = this.SizePriceInfo.OUT_PRICE5_VAT_YN;

        this.parentData.OUT_PRICE6 = this.SizePriceInfo.OUT_PRICE6;
        this.parentData.OUT_PRICE6_VAT = this.SizePriceInfo.OUT_PRICE6_VAT;
        this.parentData.OUT_PRICE6_VAT_YN = this.SizePriceInfo.OUT_PRICE6_VAT_YN;

        this.parentData.OUT_PRICE7 = this.SizePriceInfo.OUT_PRICE7;
        this.parentData.OUT_PRICE7_VAT = this.SizePriceInfo.OUT_PRICE7_VAT;
        this.parentData.OUT_PRICE7_VAT_YN = this.SizePriceInfo.OUT_PRICE7_VAT_YN;

        this.parentData.OUT_PRICE8 = this.SizePriceInfo.OUT_PRICE8;
        this.parentData.OUT_PRICE8_VAT = this.SizePriceInfo.OUT_PRICE8_VAT;
        this.parentData.OUT_PRICE8_VAT_YN = this.SizePriceInfo.OUT_PRICE8_VAT_YN;

        this.parentData.OUT_PRICE9 = this.SizePriceInfo.OUT_PRICE9;
        this.parentData.OUT_PRICE9_VAT = this.SizePriceInfo.OUT_PRICE9_VAT;
        this.parentData.OUT_PRICE9_VAT_YN = this.SizePriceInfo.OUT_PRICE9_VAT_YN;

        this.parentData.OUT_PRICE10 = this.SizePriceInfo.OUT_PRICE10;
        this.parentData.OUT_PRICE10_VAT = this.SizePriceInfo.OUT_PRICE10_VAT;
        this.parentData.OUT_PRICE10_VAT_YN = this.SizePriceInfo.OUT_PRICE10_VAT_YN;

        //this.parentData.PRICE_VAT_INCLUDE = new Decimal(0);
        //var priceVatInclude = new Decimal(0);
        if ((Io_Type != '31') && (Io_Type != '32') && (Io_Type != '41') && (Io_Type != '42') && (Io_Type != '43') && (Io_Type != '47') && (Io_Type != '50') && (Io_Type != '51') && (Io_Type != '59') && (Io_Type != '99')) {
        //    var price = 0;
        //    if (this.paramData.SPECIALPRICE == '') { this.paramData.SPECIALPRICE = 0; }
        //    if (this.paramData.SPECIALPRICE == 0) {
        //        if ((Io_Type.substring(0, 1) == '1') || (Io_Type.substring(0, 1) == '3')) {
        //            if (this.paramData.OUT_PRICE == '') { this.paramData.OUT_PRICE = 0; }
        //            if (this.paramData.OUT_PRICE != 0) {
        //                if (this.paramData.OUT_PRICE_VAT == '0') {
        //                    price = this.paramData.OUT_PRICE;
        //                    if (paramData.IsLastPriceVatInc) {
        //                        priceVatInclude = paramData.LastPriceVatInclude;
        //                    }
        //                }
        //                else {
        //                    price = ((Number(this.paramData.OUT_PRICE) / (this.paramData.VATRATE / 100 + 1)) * 10) * 0.1;
        //                    priceVatInclude = this.paramData.OUT_PRICE;
        //                }
        //            }
        //        } else {
        //            if (this.paramData.IN_PRICE == '') { this.paramData.IN_PRICE = 0; }
        //            if (this.paramData.IN_PRICE != 0) {
        //                if (this.paramData.IN_PRICE_VAT == '0') price = this.paramData.IN_PRICE;
        //                else {
        //                    price = ((Number(this.paramData.IN_PRICE) / (this.paramData.VATRATE / 100 + 1)) * 10) * 0.1;
        //                    priceVatInclude = this.paramData.IN_PRICE;
        //                }
        //            }
        //        }
        //    } else {
        //        if (this.paramData.SPRICEVAT == '0' || this.paramData.SPRICEVAT == 'N') { // 특별단가
        //            price = this.paramData.SPECIALPRICE;
        //        } else {
        //            if (this.paramData.VATRATE != 0) {
        //                price = ((Number(this.paramData.SPECIALPRICE) / (this.paramData.VATRATE / 100 + 1)) * 10) * 0.1;
        //                priceVatInclude = this.paramData.SPECIALPRICE;
        //            } else {
        //                price = this.paramData.SPECIALPRICE;
        //            }
        //        }
        //    }

            if (this.parentData.PRICE != 0) {

        //        //as-is
        //        switch (dec_p) {
        //            case 0: price = Math.round(price); break;
        //            case 1: price = Math.round(Number(price) * 10) / 10; break;
        //            case 2: price = Math.round(Number(price) * 100) / 100; break;
        //            case 3: price = Math.round(Number(price) * 1000) / 1000; break;
        //            case 4: price = Math.round(Number(price) * 10000) / 10000; break;
        //            case 5: price = Math.round(Number(price) * 100000) / 100000; break;
        //            case 6: price = Math.round(Number(price) * 1000000) / 1000000; break;
        //        }

        //        //to-be
        //        price = ecount.calc.toFixedRound(Number(price), dec_p).toString();



        //        var num = this.formatNumber(price, dec_p, null, null, null, null, true); //price;

        //        this.parentData.PRICE = num;
                if ((Io_Type.substring(0, 1) == '1') || (Io_Type.substring(0, 1) == '2') || (Io_Type.substring(0, 1) == '3')) {
                    this.parentData.EXCH_RATE = this.paramData.EXCHRATE;
                }
        //        priceVatInclude = new Decimal(priceVatInclude);
        //        if (priceVatInclude.toString() != "0") {
        //            switch (dec_p) {
        //                case 0: priceVatInclude = priceVatInclude.round(); break;
        //                case 1: priceVatInclude = priceVatInclude.times(10).round().div(10); break;
        //                case 2: priceVatInclude = priceVatInclude.times(100).round().div(100); break;
        //                case 3: priceVatInclude = priceVatInclude.times(1000).round().div(1000); break;
        //                case 4: priceVatInclude = priceVatInclude.times(10000).round().div(10000); break;
        //                case 5: priceVatInclude = priceVatInclude.times(100000).round().div(100000); break;
        //                case 6: priceVatInclude = priceVatInclude.times(1000000).round().div(1000000); break;
        //                case 7: priceVatInclude = priceVatInclude.times(10000000).round().div(10000000); break;
        //                case 8: priceVatInclude = priceVatInclude.times(100000000).round().div(100000000); break;
        //                case 9: priceVatInclude = priceVatInclude.times(1000000000).round().div(1000000000); break;
        //                case 10: priceVatInclude = priceVatInclude.times(10000000000).round().div(10000000000); break;
        //            }
        //            var numVat = new Decimal(ecmodule.inventory.calc.getCalcNumberDecimal(priceVatInclude.toString(), 'R', dec_p));
        //            //if (!(gOption.IoType == '42' && rowIdx > 500)) { // 생산입고 2,3 / 소모탭 / 생산품목코드, 소모품목코드 제외
        //            if (!(Io_Type == '47')) { // 생산입고 2,3 / 소모탭 / 생산품목코드, 소모품목코드 제외                    
        //                this.parentData.PRICE_VAT_INCLUDE = new Decimal(numVat);
        //            }
        //        }
        //        else {
        //            //if (!(gOption.IoType == '42' && rowIdx > 500)) { // 생산입고 2,3 / 소모탭 / 생산품목코드, 소모품목코드 제외
        //            if (!(Io_Type == '47')) { // 생산입고 2,3 / 소모탭 / 생산품목코드, 소모품목코드 제외                    
        //                this.parentData.PRICE_VAT_INCLUDE = new Decimal(0);
        //            }
        //        }
            } else {
                this.parentData.PRICE = 0;
                if ((Io_Type.substring(0, 1) == '1') || (Io_Type.substring(0, 1) == '2') || (Io_Type.substring(0, 1) == '3'))
                    this.parentData.EXCH_RATE = "0";
            }

            if (Io_Type.substring(0, 1) == '1') {
                if (ecount.config.inventory.UQTY_FLAG == "0") {
                    // <%=GetResource("LBL00730")%>계산시작
                    var size_qty = 1;
                    if (this.Size_Flag == '1') {
                        var old_size_des = this.paramData.SIZE_DES;
                        var filter = /([^0-9\.\/\*\-\+\(\)])/g

                        if (old_size_des != "") {
                            var strlen = old_size_des.length;
                            var calc = 0;
                            for (i = 0; i < strlen; i++) {
                                if (old_size_des.charAt(i) == "*" || old_size_des.charAt(i) == "/" || old_size_des.charAt(i) == "+" || old_size_des.charAt(i) == "-")
                                    calc++;
                            }

                            if (calc > 0) {
                                try {
                                    size_qty = eval(old_size_des.replace(' ', ''));
                                }
                                catch (e) {
                                    size_qty = 1;
                                }
                            }
                        }
                        if (size_qty == 0)
                            size_qty = 1;

                        if (size_qty > 0) {
                            if (dec_q == 0) {
                                size_qty = Math.floor(size_qty);
                            } else if (dec_q == 1) {
                                size_qty = Math.round(Number(size_qty) * 10) / 10;
                            } else if (dec_q == 2) {
                                size_qty = Math.round(Number(size_qty) * 100) / 100;
                            } else if (dec_q == 3) {
                                size_qty = Math.round(Number(size_qty) * 1000) / 1000;
                            } else if (dec_q == 4) {
                                size_qty = Math.round(Number(size_qty) * 10000) / 10000;
                            } else if (dec_q == 5) {
                                size_qty = Math.round(Number(size_qty) * 100000) / 100000;
                            } else if (dec_q == 6) {
                                size_qty = Math.round(Number(size_qty) * 1000000) / 1000000;
                            }
                            var num = this.formatNumber(size_qty, dec_q, null, null, null, null, true); //size_qty;

                            this.parentData.QTY = num;
                            //opener.ecount.parentFrame.calc_amt(rowIdx);
                        }

                    }
                }
                else {
                    //this.parentData.UQTY = H;
                    this.parentData.EXCH_RATE = this.paramData.EXCHRATE;
                }
                this.parentData.SIZE_FLAG = this.paramData.SIZE_FLAG;
                this.parentData.BAL_FLAG = this.paramData.BAL_FLAG;
            }
            //opener.ecount.parentFrame.chk_price(rowIdx, 2)
        }

        if (Io_Type == '20') {
            this.parentData.BAL_FLAG = this.paramData.BAL_FLAG;
        }

        this.parentData.PROD_TAX = this.paramData.TAX;
        this.parentData.PROD_TAX_YN = this.paramData.VATYN;

        if (Io_Type == "31" || Io_Type == "32" || Io_Type == "41" || Io_Type == "42" || Io_Type == "43") {
            if (Io_Type != "31")
                this.parentData.BAL_FLAG = this.paramData.BAL_FLAG;
            this.parentData.SIZE_FLAG = this.paramData.SIZE_FLAG;
            this.parentData.EXCH_RATE = this.paramData.EXCHRATE;
        }

        if (this.paramData.BGUBUN == "Y") {
            this.parentData.PROD_CD_FOCUS = true;
        }
        else {
            if (this.paramData.FCNAME == "") {
                //var row = opener.ecount.parentFrame.document.forms[0].elements.length;
                //for (i = 1; i < row; i++) {
                //    if (opener.ecount.parentFrame.document.forms[0].elements[i].name.substr(0, 6) == 'uqty' || opener.ecount.parentFrame.document.forms[0].elements[i].name.substr(0, 6) == 'qty') {
                //        if (opener.ecount.parentFrame.document.forms[0].elements[i].type == 'text' && (opener.ecount.parentFrame.document.forms[0].elements[i].value == '' || opener.ecount.parentFrame.document.forms[0].elements[i].value == '0')) {
                //            opener.ecount.parentFrame.document.forms[0].elements[i].select();
                //            opener.ecount.parentFrame.document.forms[0].elements[i].focus();
                //            break;
                //        }
                //    }
                //}
            }
            else {
                if (this.paramData.rowIdx == "1000")
                    this.parentData.P_BOM_QTY1_FOCUS = true;
                else
                    this.parentData.QTY_FOCUS = true;
            }
        }

        //품목팝업이 닫히지 않은 상태임으로 입력 팝업에 포커스를 줄 필요가 없음으로 주석처리
        //if (this.parentData.PROD_CD_FOCUS) {
        //    this.parentData.INPUTFOCUS = "prod_cd";
        //}
        //else if (this.parentData.SERIAL_CD_FOCUS) {
        //    this.parentData.INPUTFOCUS = "serial_cd";
        //}
        //else if (this.parentData.QTY_FOCUS) {
        //    this.parentData.INPUTFOCUS = "qty";
        //}
        //else if (this.parentData.UQTY_FOCUS) {
        //    this.parentData.INPUTFOCUS = "uqty";
        //}
        //else {
        //    this.parentData.INPUTFOCUS = "qty";
        //}

        $.extend(this.parentData, this.parentData, this.paramData);

        // 품목 팝업 > 판매입력 에서 등록되어져야할 rowKey 가져온다.
        var saleParamData = parentPopup.setDataSettingSize();
        this.parentData.rowKey = saleParamData.rowKey;
        this.parentData.rowIdx = saleParamData.rowIdx;
        this.parentData.totalItemCnt = 1;
        this.parentData.ItemCnt = 0;

        var message = {
            data: this.parentData,
            isAdded: this.isCheckBoxDisplayFlag,
            addPosition: "next",
            isNextFocus: true          // dev.46419
        };

        if (clickType !== "checkBox")
            message.callback = this.close.bind(this);

        parentPopup.sendMessage({ pageID: this.ParentPopupID }, message);
        //if (this.parentData.rowKey == "0")
        parentPopup.isSpecGroupAdd = true;
        if (parentPopup.isSpecGroupAdd == true) {
            parentPopup.rowAddCnt = parseInt(this.parentData.rowKey) + 1;
            parentPopup.rowKey = (parseInt(this.parentData.rowKey) + 1).toString();
            parentPopup.rowIdx = parentPopup.rowKey;
        }
    },

    //UnformatNumber
    unformatNumber: function (num, numType) {
        numType = numType || 0;
        if (numType == 0)  //rturn : number type
            return (num.trim().replace(/([^0-9\.\-])/g, '') * 1);
        else                        // return : string type
            return num.trim().replace(/([^0-9\.\-])/g, '');
    },

    //Format
    formatNumber: function (num, point, e, prefix, Lpoint, altTxt) {
        point = point || 0;
        Lpoint = Lpoint || 0;
        prefix = prefix || '';
        e = e || '';
        num += '';
        var sign = '';

        if (event == undefined || (event && !(event.keyCode == 37 || event.keyCode == 38 || event.keyCode == 39 || event.keyCode == 40 || event.keyCode == 9 || event.keyCode == 13))) {
            if (event && event.keyCode == 109 && num.length > 2) {
                if (e == '') {
                    return prefix + sign + splitLeft + splitRight;
                } else {
                    e.value = prefix + sign + num.substring(0, num.length - 1);
                    return;
                }
            }
            if (num.substring(0, 1) == "-" || num.substring(0, 2) == "0-") {
                if (num.substring(0, 2) == "0-") {
                    sign = '-';
                    num = num.substring(1, num.length);
                } else {
                    sign = num.substring(0, 1);
                    num = num.substring(1, num.length);
                }
            }
            if (num == ".") {
                num = "0.";
            }
            var splitStr = num.split('.');
            var splitLeft = '';
            if (!(splitStr[0] == '' || isNaN(this.unformatNumber(splitStr[0])))) {
                var splitLeft = this.unformatNumber(splitStr[0]).toString();
                if (splitLeft.length > Lpoint && Lpoint != 0) {
                    alert(altTxt)
                    formatNumber(this.oldNum, point, e, prefix, Lpoint, altTxt)
                    return;
                }
            }
            var splitRight = splitStr.length > 1 ? '.' + this.unformatNumber(splitStr[1].substring(0, point), 1) : '';
            var regx = /(\d+)(\d{3})/;
            while (regx.test(splitLeft)) {
                splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
            }
            if (e == '') {
                this.oldNum = prefix + sign + splitLeft + splitRight;
                return prefix + sign + splitLeft + splitRight;
            } else {
                if (num.indexOf(".") == -1 || point == 0) {
                    num = splitLeft;
                } else {
                    if (splitStr[1] == undefined) {
                        num = splitLeft + ".";
                    } else {
                        num = splitLeft + splitRight;
                    }
                }
                if (isNaN(this.unformatNumber(num))) {
                    e.value = 0;
                    this.oldNum = 0;
                } else {
                    e.value = prefix + sign + num;
                    this.oldNum = prefix + sign + num;
                }
            }
        }
    }
});