window.__define_resource && __define_resource("LBL13581","LBL13582","LBL01593","LBL08833","BTN00141","LBL13583","LBL03043","LBL13584","LBL13322","BTN00065","BTN00133","BTN00008","LBL07157","MSG09885","LBL00336","LBL03003","MSG04357","LBL04090","MSG00297","MSG07273","MSG08164","LBL06722","LBL04440","LBL04434","LBL01185","LBL04417","MSG05005","MSG03947","MSG04833","MSG05203","MSG04726","LBL04446","LBL04267","LBL01899","LBL00640","LBL05536","LBL09235","BTN01038","LBL00985","LBL01486","LBL01478","LBL06740","MSG00008","MSG05299","MSG02841","LBL02475","LBL08011","LBL09866","LBL08396","LBL08019","LBL03589","LBL07879","MSG06565","LBL07880","LBL09841","LBL08917","MSG01420","LBL80322","MSG01421");
/***********************************************************************************
 1. Create Date :   2016.09.27
 2. Creator     :   inho
 3. Description :   Input Field Setup(입력항목설정) 
 4. Precaution  :
 5. History        :   2018.04.13 김우정 : 사원(담당)등록 양식설정
                       2018-09-20 Huu Lan Applied Dev 12442 사원등록 > 추가항목등록에서 명칭 수정 시 반영안되는 문제                        
                       2018-09-20 (PhiTa) A18_02765_기초코드 입력화면 설정 항목명칭에 포커스 제공
                       2019.04.11 (LuongAnhDuy) A19_01264 - 품목 입력화면설정 반복저장 막기
                       2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                       2020.01.22 (Kim Woojeong) - [A18_03793] 급여 신규프레임웍 적용 - 급여관리II
                       2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                       2020.05.07 (LuongAnhDuy) - A20_01871 - remove head_size = 0 of form_type SI902
                       2020.06.25 허성길 - A20_01662 단설정_2.0 메뉴에 적용 #EUI1
                       2020.12.09 (VuThien) - Add PIC, Employee to Register User Input Screen
 6. MenuPath   :   Inv.1(재고1)>Setup(기초등록)>Item(품목등록)>New(신규)>Option>Input Field Setup(입력항목설정)
 7. Old File       :   CM100P_06.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.formsetBasic", "CM100P_07_CM", { 

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: true,

    formDataTemp: null,//temp variables for UI data 양식데이터

    formAllDataTemp: null,//temp variables for all data 양식 전체 데이터

    commonForm: null,

    lastEditTime: null,

    lastEditId: null,

    ENABLE_DRAGGABLE_EDIT: null,

    _RowInCellCount: 2,

    allTab: [],

    addAcc009Save: [],   //추가항목 명칭 저장데이터

    addPriceGroupSave: null,  //단가명칭 저장데이터

    addOptions: null,

    authorize: null,

    keyValueSave: [],

    checkProdTypeByMainProdCD: "",

    fistFocusObj: "",

    useTabSetting: true,

    defaultTypeOnly: [],

    saveComplete: true,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecmodule.common.formHelper");
        this.registerDependencies("ecmodule.common.form");
    },

    render: function ($parent) {
        require("widget.lib.dragable", "pluploader", function () {
            this._super.render.apply(this, arguments);
        }.bind(this));
        this.allTab = ['BASIC'];
    },

    initProperties: function () {
        
        //set Template value 양식값 할당
        this.setFormInfosFromDb();
        this._RowInCellCount = this.viewBag.FormInfos.BaseForm.colType * 2;
        switch (this.FORM_TYPE.toUpperCase()) {
            case "SI902":
                this._pageOption = {
                    changeTitleTab: {  //추가항목 설정탭정보
                        exceptionCol: ['IN_PRICE', 'OUT_PRICE'], //탭중에 설정안하는 항목
                        tab: ['PRICE', 'CONT'] //추가항목 설정탭정보
                    },
                    hideColumn: [{ mainCd: "MAIN_PROD_CD_BASE", tabId: "QTY", subId: "SYNC_BOM_YN" }], //특정필드 hide
                    linkControl: [ //link추가하고싶은 필드설정
                        {
                            key: "PROD_CD", options: [{ id: "codeCreate", label: ecount.resource.LBL13581, url: "/ECERP/EMJ/EMJ002P_10", param: { height: 450, width: 560, CODE_TYPE: "7", SETUPID: "INV082" + ecount.delimiter + "INV083" + ecount.delimiter + "INV084" + ecount.delimiter + "INV085" + ecount.delimiter + "INV086" } }
                                , { id: "oemCodeCreate", label: ecount.resource.LBL13582, url: "/ECERP/ESC/ESC001P_320", param: { height: 450, width: 560, POPUP_CD: 589, SETUPID: "INV181" } }]
                        }  // "코드생성기준",  "OEM코드생성기준"
                    ],
                    addOptions: function () {
                        return {
                            isAddAcc009: true,  //추가항목저장여부
                            addAcc009ApiUrl: "/SVC/Common/Infra/UpdateAddFieldPIC", //추가항목저장api
                            isAddPriceGroup: true, //단가명칭 저장여부
                            addPriceGroupApiUrl: "/SelfCustomize/Config/SavePriceGroupInfo", //단가명칭 저장api
                            setAcc009Param: function (rowItem, val) { //추가항목 저장param셋팅함수
                                return {
                                    CODE_CLASS: rowItem.COL_CD.indexOf("CONT") > -1 ? "S01" : "S02",
                                    CODE_DES: val,
                                    CODE_NO: rowItem.COL_CD.indexOf("CONT") > -1 ? "S01" + this.getZeroAdd(rowItem.COL_CD.replace("CONT", "")) : "S02" + this.getZeroAdd(rowItem.COL_CD.replace("NO_USER", "")),
                                    MENUCATEGORY: "S",
                                    USE_GUBUN: "Y",
                                    ORI_PAGE: "ESA002P_01",
                                }
                            }.bind(this),
                            setPriceGroupParam: function (rowItem, valObj, val) {  //단가저장 param셋팅함수
                                valObj = valObj || {};
                                if (rowItem.COL_CD.indexOf("OUT_PRICE") > -1) {
                                    var pname = "PRICE_" + rowItem.COL_CD.replace("OUT_PRICE", "");
                                    valObj[pname] = val;
                                }
                                return valObj;
                            }.bind(this),
                        }
                    }.bind(this),
                    onInitControl: this.prodOnInitControl.bind(this),  //컨트롤 initcontrol 실행함수 
                    validate: function () {
                        return this.prodCdValidate(); //특정validate실행하기위함
                    }.bind(this),
                    saveValueSet: this.prodSaveValueSet.bind(this),  //저장시 param가공이 필요한경우
                    defaultSetting: function (tab) { //기본값셋팅
                        this.getDefaultSettingData(tab);
                        this.prodView = this.intputDefaultData.InputDefaultValue;
                        this.setupView = this.intputDefaultData.InputSetupView;
                        this.viewBag.InitDatas.ProdLevelGroup = this.intputDefaultData.InputLevelGroup;
                        this._colEssentialYnReadOnlyColumn && this._colEssentialYnReadOnlyColumn.push("INV_ADJUST", "OEM_BOM");
                        this.checkProdTypeByMainProdCD = this.prodView && this.prodView.MAIN_PROD_CD_PROD_TYPE ? this.prodView.MAIN_PROD_CD_PROD_TYPE : "";
                    }.bind(this),
                }
                break;
            case "SI912":
            case "SI910":
                if (this.FORM_TYPE.toUpperCase() === "SI912") {
                    ecount.config.limited.feature.USE_CLOSING_BUSINESSNO_SEARCH = false;
                }


                this._pageOption = {
                    changeTitleTab: {
                        exceptionCol: ['FILECNT'],
                        tab: ['CONT']
                    },

                    linkControl: [ //거래처 코드 항목 링크로
                        {
                            key: "BUSINESS_NO", options: [{ id: "businessNoCreate", label: ecount.resource.LBL13581, url: "/ECERP/EMJ/EMJ002P_10", param: { height: 600, width: 600, CODE_TYPE: "1", SETUPID: "ACC016" + ecount.delimiter + "ACC017" + ecount.delimiter + "ACC018" + ecount.delimiter + "ACC019" + ecount.delimiter + "ACC020" + ecount.delimiter + "ACC021" + ecount.delimiter + "ACC022" } }]
                        }

                    ],

                    addOptions: function () {
                        return {
                            isAddAcc009: true,  //추가항목저장여부
                            addAcc009ApiUrl: "/SVC/Common/Infra/UpdateAddFieldPIC", //추가항목저장api
                            setAcc009Param: function (rowItem, val) { //추가항목 저장param셋팅함수
                                return {
                                    //문자형 추가항목 : A10, 숫자형 추가항목 : A13
                                    CODE_CLASS: rowItem.COL_CD.indexOf("CONT") > -1 ? "A10" : "A13",
                                    CODE_DES: val,
                                    CODE_NO: rowItem.COL_CD.indexOf("CONT") > -1 ? "A10" + this.getZeroAdd(rowItem.COL_CD.replace("CONT", "")) : "A13" + this.getZeroAdd(rowItem.COL_CD.replace("NO_CUST_USER", "")),
                                    MENUCATEGORY: "A10",
                                    USE_GUBUN: "Y",
                                    ORI_PAGE: "ESA002P_01",
                                }
                            }.bind(this),
                        }
                    }.bind(this),
                    saveValueSet: this.custSaveValueSet.bind(this),
                    defaultSetting: function (tab) {
                        this.getDefaultSettingData(tab);
                        this.custDataSet = new Object();
                        $.extend(this.custDataSet, { Cust: new Object() });
                        $.extend(this.custDataSet, { ForeignCustData: new Object() });
                        $.extend(this.custDataSet, { CustLevelGroupData: this.viewBag.InitDatas.CustLevelGroupData });
                        //입력항목 기본 값
                        this.custDataSet.Cust = this.intputDefaultData.InputDefaultValue;
                        //외화거래처 값
                        this.custDataSet.ForeignCustData = this.viewBag.InitDatas.CommonCode;
                        if (this.intputDefaultData && !$.isEmpty(this.intputDefaultData.InputDefaultValue)) {

                        }
                        //비활성화 항목 정의(파일관리)
                        this._colEssentialYnReadOnlyColumn && this._colEssentialYnReadOnlyColumn.push("FILECNT");
                    }.bind(this),
                    onInitControl: this.custOninitControl.bind(this),
                    validateTab: ["CUST", "PRICE", "CONT"], //기본 유효성 체크할 탭 정의 
                    validate: function () {
                        return this.custCdValidate(this.checkControlValidationByDefalut()); //기본validate실행하기위함
                    }.bind(this),
                }
                break;
            case "SI950":
                this._pageOption = {
                    changeTitleTab: {
                        exceptionCol: ['BUSINESS_NO', 'CUST_NAME', 'MENU', 'REMARKS', 'REMARKS_WIN'],
                        tab: ['EMP']
                    },
                    addOptions: function () {
                        return {
                            isAddAcc009: true,  //추가항목저장여부
                            addAcc009ApiUrl: "/SVC/Common/Infra/UpdateAddFieldPIC", //추가항목저장api
                            setAcc009Param: function (rowItem, val) { //추가항목 저장param셋팅함수
                                return {
                                    CODE_CLASS: "S21",
                                    CODE_DES: val,
                                    CODE_NO: "S21" + this.getZeroAdd(rowItem.COL_CD.replace("CONT", "")),
                                    MENUCATEGORY: "S21",
                                    USE_GUBUN: "Y",
                                    ORI_PAGE: "ESA002P_01",
                                }
                            }.bind(this),
                        }
                    }.bind(this),
                    defaultSetting: function (tab) {
                        this.getDefaultSettingData(tab);
                        if (this.intputDefaultData && !$.isEmpty(this.intputDefaultData.InputDefaultValue)) {
                           this.WhLoad = this.intputDefaultData.InputDefaultValue;
                        }
                    }.bind(this),
                    isUsePopover: this.IS_USE_POPOVER,
                    onInitControl: this.empOnInitControl.bind(this)
                }
                break;
            case "PI060":
            case "PI050":
                // TODO: Setup data for date type
                var _setupDateList = this.formDataTemp[0].FormGroups[0].FormColumns.where(function (item) { return item.COL_CD.substring(0, 3) == "CD_" });
                var _inputCtrl = [];
                if (_setupDateList.length > 0) {
                    for (var i = 0; i < _setupDateList.length; i++) {
                        _inputCtrl.push({
                            key: _setupDateList[i].COL_CD,
                            options: [{
                                id: _setupDateList[i].COL_CD, label: ecount.resource.LBL01593,
                                param: { height: 450, width: 560, CODE_TYPE: "7", SETUPID: "" }
                            }]
                        });
                    }
                }
                this._pageOption = {
                    changeTitleTab: {
                        exceptionCol: ['EMP_CD', 'EMP_KNAME'],
                        tab: ['ADDT']
                    },
                    inputControl: _inputCtrl,
                    addOptions: function () {
                        return {
                            isAddAcc009: true,
                            addAcc009ApiUrl: "/SVC/Common/Infra/UpdateAddFieldPIC",
                            setAcc009Param: function (rowItem, val) {
                                function _getCodeNo(_rowItem) {
                                    var _codeNo = "", _num = '', _codeClass = "";
                                    var _key = _rowItem.COL_CD.substring(0, 3);
                                    var _cdClassList = { "CT_": "P01", "CN_": "P02", "CB_": "P03", "CD_": "P04", "CC_": "P05" };
                                    _num = _rowItem.COL_CD.replace(_key, '');
                                    _codeClass = _cdClassList[_key];

                                    if (!$.isEmpty(_codeClass) && !$.isEmpty(_num))
                                        _codeNo = _codeClass + _num;

                                    return { codeNo: _codeNo, codeClass: _codeClass };
                                };

                                var _info = _getCodeNo(rowItem);

                                return {
                                    CODE_CLASS: _info.codeClass,
                                    CODE_DES: val,
                                    CODE_NO: _info.codeNo,
                                    MENUCATEGORY: "P",
                                    USE_GUBUN: "Y",
                                    ORI_PAGE: "ESA002P_01",
                                };
                            }.bind(this),
                        }
                    }.bind(this),
                    onInitControl: this.regisEmpOnInitControl.bind(this),
                    validateTab: ["EMP"],
                    validate: function () {
                        return this.regisEmpValidate(this.checkControlValidationByDefalut(["EMP"]));
                    }.bind(this),
                    defaultSetting: function (tab) {
                        this.getDefaultSettingData(tab);
                        this.EmpView = this.intputDefaultData.InputDefaultValue;
                        this.isUsePopOver = true;
                    }.bind(this),
                }
                break;
            case "SI800":
                this._pageOption = {
                    changeTitleTab: {
                        exceptionCol: [],
                        tab: ["GW"]
                    },
                    onInitControl: this.userIdOninitControlEx.bind(this),
                    saveValueSet: this.userIdSaveValueSetEx.bind(this),
                    defaultSetting: this.getDefaultSettingData.bind(this),
                    validate: this.userValidateEx.bind(this),
                    addOptions: function () {
                        return {
                            isAddAcc009: true,
                            addAcc009ApiUrl: "/SVC/Common/Infra/UpdateAddFieldPIC",
                            setAcc009Param: function (rowItem, val) {
                                return {
                                    CODE_CLASS: "M10",
                                    CODE_DES: val,
                                    CODE_NO: String.format("M10{0}", this.getZeroAdd(rowItem.COL_CD.replace("TXT", ""))),
                                    MENUCATEGORY: "SC",
                                    USE_GUBUN: "Y",
                                    ORI_PAGE: "ESA002P_01",
                                }
                            }.bind(this),
                        }
                    }.bind(this),
                };
                break;
            case "SI982":
                this._pageOption = {
                    changeTitleTab: {
                        exceptionCol: [],
                        tab: []
                    },
                    onInitControl: this.userSetupOninitControlEx.bind(this),
                    saveValueSet: this.userSetupSaveValueSetEx.bind(this),
                    defaultSetting: this.getDefaultSettingData.bind(this),
                    validate: this.userSetupValidateEx.bind(this),
                    isNeedToSendMessage: true,
                };
                break;
        }

        this.authorize = { inv: this.viewBag.Permission.Inventory.Value };
        this._pageOption.isFormSetting = true;
        this.addOptions = this._pageOption.addOptions && this._pageOption.addOptions();

        this.viewBag.FormInfos.BaseForm.items.forEach(function (x, i) {
            this[String.format("onContentsRestore{0}", x.id)] = this.getRestoreForm.bind(this);
        }.bind(this));
    },

    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(this.viewBag.Title || ecount.resource.LBL08833);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            form = widget.generator.form(),
            panel = widget.generator.panel(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            toolbar2 = [],
            ctrl = g.control()
        tableForm = [];
        var thisObj = this;
        this._isHideByWidth = false;
        this.ENABLE_DRAGGABLE_EDIT = true;

        this.getFormRequisiteSettalbe();

        this.commonForm = new ecount.common.form();
        this.commonForm.setWidgetMap(thisObj);
        toolbar.attach(ctrl.define("widget.button", "restoreBASIC").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce().end());
        
        var _colSize = this.viewBag.FormInfos.BaseForm.colType;
        //if (['PI050', 'PI060'].contains(thisObj.FORM_TYPE)) {
        //    this._RowInCellCount = 4;
        //    _colSize = 2;
        //}

        form
            .setFormId("topForm")
            .css("table table-border-no-a table-th-left table-template-setup-preview")
            .useBaseForm()
            .useTableType()  
            .setColSize(_colSize)
            .useDynamicColSize()
            .addControls(this._createInitWidgetData())
            .showLeftAndRightBorder(true);

        tabContents.createTab("BASIC", this.viewBag.FormInfos.BaseForm.items[0].name, null, this.useTabSetting, "left").add(toolbar).add(form);

        this.viewBag.FormInfos.BaseForm.items.
            where(function (item) { return item.id != "BASIC"; }).forEach(function (x, i) {
                thisObj.allTab.push(x.id);
                tableForm.push(widget.generator.form());

                var columnSet = [];
                x.subItems = thisObj.customSubItems(x.subItems, x.id);

                if (['SI950'].contains(thisObj.FORM_TYPE)) {
                    columnSet.push({ isHeaderStyle: thisObj.getIsHeaderStyles(x.id, x.subItems), controlType: thisObj.getFormControlType(x.id, x.subItems), id: "labelList_" + x.id, title: ecount.resource.LBL13583, width: 170 }) //"항목", width: 100
                    columnSet.push({ controlType: "widget.checkbox", id: "checkEssential_" + x.id, name: "checkEssential_" + x.id, align: "center", title: ecount.resource.LBL03043, width: 80 }); //"필수항목"
                    columnSet.push({ useForm: true, formData: x.subItems, title: ecount.resource.LBL13584 });//"기본값 및 설정"
                } else {
                    columnSet.push({ isHeaderStyle: thisObj.getIsHeaderStyles(x.id, x.subItems), controlType: thisObj.getFormControlType(x.id, x.subItems), id: "labelList_" + x.id, title: ecount.resource.LBL13583, width: 170 }) //"항목", width: 100
                    columnSet.push({ controlType: "widget.checkbox", id: "checkBasic_" + x.id, name: "checkBasic_" + x.id, align: "center", title: ecount.resource.LBL13322, width: 80 });//"기본탭여부"
                    columnSet.push({ controlType: "widget.checkbox", id: "checkEssential_" + x.id, name: "checkEssential_" + x.id, align: "center", title: ecount.resource.LBL03043, width: 80 }); //"필수항목"
                    columnSet.push({ useForm: true, formData: x.subItems, title: ecount.resource.LBL13584 });//"기본값 및 설정"
                }
                toolbar2.push(g.toolbar());
                toolbar2[i].attach(ctrl.define("widget.button", "restore" + x.id).label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce().end());
                tableForm[i].setTable();
                tableForm[i].useTableHeader();
                tableForm[i].setColumns(columnSet, x.subItems);
                tableForm[i].setRowLength(x.subItems.length);
                tabContents.createTab(x.id, x.name, null, i == 0 && !thisObj.useTabSetting, "left").add(toolbar2[i]).add(tableForm[i]);

                if ((x.id == "PRICE" || (['SI950'].contains(thisObj.FORM_TYPE))) && !$.isEmpty(x.subItems)) {
                    var fistSubItem = "";
                    for (var i = 0; i < x.subItems.length; i++) {
                        if (thisObj._pageOption.changeTitleTab && !thisObj._pageOption.changeTitleTab.exceptionCol.contains(x.subItems[i].dataId)) {
                            fistSubItem = x.subItems[i].dataId;
                            break;
                        }
                    }
                    if (fistSubItem) {
                        thisObj.fistFocusObj = "labelList_" + x.id + "_" + fistSubItem;
                    }
                }

            });
        contents.add(tabContents);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce())
            .addLeft(ctrl.define("widget.button", "cancel").label(ecount.resource.BTN00133))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addLeft(ctrl.define("widget.button", "history").label("H"));

        footer.add(toolbar);
    },

    onChangeControl: function (control, data) {
        var item = {};
        if (!$.isEmpty(control.cid)) {
            switch (control.cid.toString()) {
                // 품목구분 PROD_TYPE
                case "PROD_TYPE":
                case "SET_FLAG":
                case "MAIN_PROD_CD":
                    this.bomSyncVisible && this.bomSyncVisible();
                    break;
                case "G_BUSINESS":
                    this.setG_BusinessValue(control);
                    break;
                case "EMAIL":
                    var ctrl = this.contents.getControl("EMAIL", "USERINFO");
                    if (ctrl) this.contents.getControl("EMAIL", "USERINFO").hideError();
                    break;
                case "USERPAY_chk":
                    if (control.value)
                        this.contents.getControl("passwordLink", "EMP").hide(); // Set hide control link
                    break;
                case "CHK_PIC":
                    if (this.contents.getControl("CHK_PIC", "USERINFO").getValue() === true) {
                        this.contents.getControl("CNNT_OFCR_CD", "USERINFO") && this.contents.getControl("CNNT_OFCR_CD", "USERINFO").hide();
                        this.contents.getControl("CNNT_OFCR_CD_NEW", "USERINFO") && this.contents.getControl("CNNT_OFCR_CD_NEW", "USERINFO").show();
                    }
                    else {
                        this.contents.getControl("CNNT_OFCR_CD", "USERINFO") && this.contents.getControl("CNNT_OFCR_CD", "USERINFO").show();
                        this.contents.getControl("CNNT_OFCR_CD_NEW", "USERINFO") && this.contents.getControl("CNNT_OFCR_CD_NEW", "USERINFO").hide();
                    }
                    break;
                case "CHK_EMP":
                    if (this.contents.getControl("CHK_EMP", "USERINFO").getValue() === true) {
                        this.contents.getControl("CNNT_EMP_CD", "USERINFO") && this.contents.getControl("CNNT_EMP_CD", "USERINFO").hide();
                        this.contents.getControl("CNNT_EMP_NEW", "USERINFO") && this.contents.getControl("CNNT_EMP_NEW", "USERINFO").show();
                    }
                    else {
                        this.contents.getControl("CNNT_EMP_CD", "USERINFO") && this.contents.getControl("CNNT_EMP_CD", "USERINFO").show();
                        this.contents.getControl("CNNT_EMP_NEW", "USERINFO") && this.contents.getControl("CNNT_EMP_NEW", "USERINFO").hide();
                    }
                    break;
                /*case "colType":
                    this._changeColType(control.value);
                    break;*/
            }
        }
    },

    // 탭 체인지 이벤트
    onChangeContentsTab: function (event) {
        if (event.tabId == "PRICE") {
            setTimeout(function () {
                if (this.fistFocusObj) {
                    this.contents.getControl(this.fistFocusObj).setFocus(0);
                }
            }.bind(this), 0);
        };
    },

    onLoadComplete: function (event) {

        //if add form on right layer, you have to recheck 0 is right.
        //because 0 index is left top form.
        //폼기준으로 그려지는 순서가 마지막인 경우 인덱스0 
        //그외의 경우는 예외 처리 해야함.
        this.setMoveSetting(this.contents.getForm(true)[this.viewBag.FormInfos.BaseForm.items.length - 1], this.isReload ? true : false);
        //sync sort for table on right top 오른쪽 상단 위젯 테이블 순서 동기화-값재할당
        this.setSortSync({ formIndex: 0 });
        if (this.useTabSetting) {
            this.showFormsetLayer(this.formDataTemp[0].FormGroups[0].ViewModel.columns[0].id);
        } else {
            this.contents.hideTab("BASIC");
            this.contents.getTabContents().tabs.hide();
        }
        //숨김처리
        //this.setHideColums();
        this.loadComSetting();
        if (this.FORM_TYPE == 'SI912') this.loadGbusinessnoSetting();

        if (this.FORM_TYPE == 'SI950') {
            setTimeout(function () {
                if (this.fistFocusObj) {
                    this.contents.getControl(this.fistFocusObj).setFocus(0);
                }
            }.bind(this), 0);
        }

        if (['PI050', 'PI060'].contains(this.FORM_TYPE)) {
            // Set hide control link
            this.contents.getControl("passwordLink", "EMP").hide();
        }
    },

    //hhy 수정
    //drag completed event  드래그 드롭 완료 후 이벤트
    onDragEndCompleted: function (event, data, grid) {
        if (data && data.target == "widget" && (data.type == "add" || data.type == "move")) {
            //add : from tree grid to widget table 트리에서 위젯으로 추가시 
            //move : drag widget from right to right on right table only 위젯에서 순서만 드래그로 변경시

            //sync table 위젯 순서 동기화-값재할당
            this.setSortSync({ formIndex: 0 });
        }
    },

    //History 히스토리
    onFooterHistory: function (e) {
        var thisObj = this;
        var param = {
            width: 450,
            height: 150,
            lastEditTime: thisObj.lastEditTime,
            lastEditId: thisObj.lastEditId
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        })
    },

    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //save 저장
    onFooterSave: function (e) {
        if (this.saveComplete) {

            this.saveComplete = false;

            var thisObj = this;
            var noneBasicEssenTialY = [];
            var noneBasicDefalutValue = [];

            this.formAllDataTemp.forEach(function (formData, i) {
                formData.FormGroups.forEach(function (formGroup, j) {
                    formGroup.FormOutSetDetails.sortBy(function (s) {
                        //그룹가져오기
                        var groupColCd = thisObj.getFormGroupColCd(s.COL_CD);
                        var colCdName = s.COL_CD
                        //칼럼정보
                        var colInfo = thisObj.formDataTemp[i].FormGroups[j].FormOutColumns.where(function (item, i) { return item.COL_CD == colCdName }).first();
                        //제목
                        var label = thisObj.contents.getControl(String.format("labelList_{0}_{1}", groupColCd, colCdName), groupColCd);
                        //기본여부
                        var basic = thisObj.contents.getControl(String.format("checkBasic_{0}_{1}", groupColCd, colCdName), groupColCd);
                        //필수항목체크
                        var essential = thisObj.contents.getControl(String.format("checkEssential_{0}_{1}", groupColCd, colCdName), groupColCd);
 
                        //기본탭이 아닌데 필수처리된것 
                        if (basic && (!basic.getValue()) && essential.getValue()) {
                            if (thisObj.getInputValueEmptyCheck(groupColCd, colCdName)) {
                                
                                if (!noneBasicEssenTialY.contains(label.getValue() || colInfo.TITLE)) {
                                    noneBasicEssenTialY.push(label.getValue() || colInfo.TITLE);
                                }

                                //noneBasicEssenTialY.push({ "COL_CD": colCdName, "label": label && label.getValue() || colInfo.TITLE });
                            };
                        }
                    });
                });
            });

            
            if (noneBasicEssenTialY.length > 0) {
                ecount.confirm(String.format(ecount.resource.MSG09885
                    , noneBasicEssenTialY.join("<br>")), function (isOk) {
                        if (isOk) {
                            thisObj.setSave();
                        }
                        else
                            thisObj.saveComplete = true;
                    }.bind(thisObj));
            }
            else {
                thisObj.setSave();
            }
  
            this.footer.getControl('save').setAllowClick();
        }
    },

    getInputValueEmptyCheck: function (groupColCd,colCdName) {
        var returnValue = false;
        var colnm = colCdName
        if (["CLASS_CD", "CLASS_CD2", "CLASS_CD3"].contains(colnm)) {
            colnm = colnm == "CLASS_CD" ? "txtClassCd1" : colnm.replace("CLASS_CD", "txtClassCd");
        }

        var valueSerialize = this.contents.getControl(colnm, groupColCd).serialize();
        var widgeteSerialize = ecount.widget.serialize(this.contents.getControl(colnm, groupColCd));

        switch (colCdName) {
            case "G_BUSINESS":
                if (widgeteSerialize.G_BUSINESS_TYPE == "2" && _.isEmpty(widgeteSerialize.G_BUSINESSNO_CD))
                    returnValue = true;
                else if (widgeteSerialize.G_BUSINESS_TYPE == "3" && _.isEmpty(widgeteSerialize.G_BUSINESSNO_DIRECT_INPUT))
                    returnValue = true;
                break;
            case "POST":
                if (_.isEmpty(widgeteSerialize.POST_NO) || _.isEmpty(widgeteSerialize.ADDR))
                    returnValue = true;
                break;
            case "DM_POST":
                if (_.isEmpty(widgeteSerialize.DM_POST) || _.isEmpty(widgeteSerialize.DM_ADDR))
                    returnValue = true;
                break

            case "PROD_TYPE_BASE":
            case "PROD_IMAGE":
            case "PROD_FILE":
            case "SAFE":
            case "SAFE_QTY":
            case "OEM_PROD_TYPE":
                break;

            case "SIZE_DES_BASE": 
                if(widgeteSerialize.SIZE_FLAG == "0" && _.isEmpty(widgeteSerialize.SIZE_CD))
                    returnValue = true;
                else if (widgeteSerialize.SIZE_FLAG == "1" && _.isEmpty(widgeteSerialize.SIZE_DES))
                    returnValue = true;
                else if (widgeteSerialize.SIZE_FLAG == "2" && _.isEmpty(widgeteSerialize.SIZE_CALC_CD))
                    returnValue = true;
                else if (widgeteSerialize.SIZE_FLAG == "3" && _.isEmpty(widgeteSerialize.SIZE_DES))
                    returnValue = true;
                break;
            case "WH_CD_BASE":
                if (widgeteSerialize && _.isEmpty(widgeteSerialize.WH_CD))
                    returnValue = true;
                break;
            case "CLASS_CD":
            case "CLASS_CD1":
            case "CLASS_CD2":
                if (valueSerialize && _.isEmpty(valueSerialize.value))
                    returnValue = true;
                break;
            case "TAX":
                if (widgeteSerialize.TAX_radio == "Y" && _.isEmpty(widgeteSerialize.TAX_input))
                    returnValue = true;
                break;
            case "VAT_RATE_BY":
                if (widgeteSerialize.VAT_RATE_BY_radio == "Y" && _.isEmpty(widgeteSerialize.VAT_RATE_BY_input))
                    returnValue = true;
                break;
            case "EXCH_DENO":
                if (_.isEmpty(widgeteSerialize.EXCH_RATE) || _.isEmpty(widgeteSerialize.DENO_RATE))
                    returnValue = true;
                break;        
            case "CSLimitFlag":                
                if ((widgeteSerialize.CSORD_C0001 != "N") && (_.isEmpty(widgeteSerialize.CSORD_C0001) || _.isEmpty(widgeteSerialize.CSORD_TEXT)))
                    returnValue = true;
                break;  
            default:
                if (widgeteSerialize && _.isEmpty(widgeteSerialize[colCdName]))
                    returnValue = true;
                break;
        }

        return returnValue;
    },

    //취소
    onFooterCancel: function (e) {
        this.reload();
    },

    onFormsetAddClick: function (e) {

        this.setAddItemPopup({ formIndex: 0, rowItem: { COL_CD: e.cid } });
    },

    onFormsetDelClick: function (e) {

        this.setDeleteItem({ formIndex: 0, rowItem: { COL_CD: e.cid } });
        this.setBasicYnCheckbox([{ COL_CD: e.cid, GROUP_COL_CD: "" }], "delItem");
    },

    onFormsetModClick: function (e) {
        this.setSettingPopup({ formIndex: 0, rowItem: { COL_CD: e.cid } });
    },

    onFormsetAllModClick: function (e) {
        this.setSettingPopup({ formIndex: 0, rowItem: { COL_CD: "" } });
    },

    //setting popup  설정 팝업
    setSettingPopup: function (data) {
        var thisObj = this;
        var colcd = data.rowItem.COL_CD;
        var formType = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE;
        var param = {
            width: (($.isEmpty(colcd)) ? 800 : 350),
            height: 450,
            modal: true,
            FORM_TYPE: formType,
            formIndex: data.formIndex,
            COL_CD: colcd,
            isLock: false
        };

        if (colcd.substring(0, 3) === "CD_") {
            param.useDateTypeSetup = true;
        }

        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_42',
            name: "",
            param: param,
            popupType: false,
            additional: false,
        });
    },

    setDateType: function (option) {
        this.setSettingPopup({ formIndex: 0, rowItem: { COL_CD: option.cid } });
    },

    //F8 Event
    ON_KEY_F8: function () {
        if (this.saveComplete) {
            if (ecount.global.isDisableAlert())
                this.onFooterSave();
        }
    },

    //reset wedgets
    setResetWedgets: function (tab) {
        var thisObj = this;
        if (!$.isEmpty(tab)) {
            if (this._pageOption && this._isFormSetting && this._pageOption.defaultSetting) {
                this._pageOption.defaultSetting(tab);
            }
            thisObj[tab].forEach(function (formItem, i) {
                formItem.FormGroups.forEach(function (groupItem, j) {
                    groupItem.ViewModel.columns.forEach(function (item, x) {
                        var essential = this.contents.getControl(String.format("checkEssential_{0}_{1}", item.groupColCd, item.id), item.groupColCd);
                        var colCdName = item.id;
                        if (["CLASS_CD", "CLASS_CD2", "CLASS_CD3"].contains(item.id)) {
                            colCdName = item.id == "CLASS_CD" ? "txtClassCd1" : item.id.replace("CLASS_CD", "txtClassCd");
                        }
                        var basicRestore = this.contents.getControl(colCdName, item.groupColCd);
                        if (essential) {
                            if (!$.isEmpty(this._isRequisiteSettalbe) && this._isRequisiteSettalbe.contains(item.id)) {  //필수상목인경우 
                                essential.setReadOnly(false);
                                essential.setValue(true);
                                essential.setReadOnly(true);
                            } else {
                                essential.setValue(item.colEssentialYn == "Y");
                            }
                        }
                        if (basicRestore) {
                            //basicRestore.restore(JSON.parse(item.defaultVal));
                        }

                    }.bind(this));
                    this.contents.getForm()[0].refreshColumn(3);
                    //숨김처리
                    this.setHideColums();
                }.bind(this))
            }.bind(this));

        } else {
            thisObj.commonForm.getWidgetHelper().getResetKeys().forEach(function (key, j) {
                //call reset function 호출 리셋 펑션
                thisObj.commonForm.getWidgetHelper().getResetWedgets().get(key)();
            });
        }
    },

    //기본값 테이블에 저장하기위한 값
    setKeyValueSave: function (serialize, colCdName, groupColCd, formColumn, _serialize) {
        if (serialize) {
            var formCol = formColumn.find(function (item) { return item.COL_CD == colCdName });
            var _tempValue = "";

            Object.keys(serialize).forEach(function (key, i) {

                if (colCdName == "G_BUSINESS" && !["G_BUSINESS_TYPE", "G_BUSINESSNO_CD","G_BUSINESSNO_DIRECT_INPUT"].contains(key)) {
                    if (_serialize[1].length > 0) {
                        this.keyValueSave.push({
                            COL_CD: colCdName,
                            CONTROL_KEY: _serialize[1][0].key,
                            DEFAULT_VALUE: _serialize[1][0].value,
                            CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                        })
                    } else {
                        this.keyValueSave.push({
                            COL_CD: colCdName,
                            CONTROL_KEY: _serialize[1].key,
                            DEFAULT_VALUE: _serialize[1].value,
                            CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                        })
                    }
                } else if (["USERPAY_LAN_TYPE"].contains(key)) {
                    if (serialize["USERPAY_CHK"] != "Y")
                        serialize.USERPAY_LAN_TYPE = "";

                    this.keyValueSave.push({
                        COL_CD: colCdName,
                        CONTROL_KEY: key,
                        DEFAULT_VALUE: serialize[key],
                        CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                    })
                } else if (["USERPAY_CHK", "FOR_RATE", "DOMESTIC_DISPATCHED_WORKER", "NON_RESIDENT_RESIDENCECOUNTRY_CHECKBOX", "CONTRACTOR_NATIONALITY_CHECKBOX"].contains(key)) {
                    this.keyValueSave.push({
                        COL_CD: colCdName,
                        CONTROL_KEY: key,
                        DEFAULT_VALUE: serialize[key][0] || "",
                        CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                    })
                } else if (["JUMIN_NO1", "JUMIN_NO2"].contains(key)) {
                    _tempValue = _tempValue.concat(serialize[key] || "");
                    this.keyValueSave.push({
                        COL_CD: colCdName,
                        CONTROL_KEY: key,
                        DEFAULT_VALUE: "",
                        CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                    });
                } else if (["REDUCED_INCOME_deductionPeriod_FROM", "REDUCED_INCOME_deductionPeriod_TO", "OUT_DATE", "IN_DATE"].contains(key)) {
                    var _value = serialize[key];
                    if (_value == "0000")
                        _value = '';
                    this.keyValueSave.push({
                        COL_CD: colCdName,
                        CONTROL_KEY: key,
                        DEFAULT_VALUE: _value,
                        CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                    });
                } else if (["CHK_EMP", "CNNT_EMP_NEW", "CNNT_EMP_CD", "CHK_PIC", "CNNT_OFCR_CD", "CNNT_OFCR_CD_NEW", "NAME"].contains(key)) {
                    var _value = serialize[key];

                    if (['SI800'].contains(this.FORM_TYPE)) {
                        if (["CHK_PIC", "CHK_EMP"].contains(key)) {
                            _value = this.contents.getControl(key, "USERINFO").getValue() === true ? "1" : "0";
                        } else if (["CNNT_EMP_NEW", "CNNT_EMP_CD"].contains(key)) {
                            var chkNew = this.contents.getControl("CHK_EMP", "USERINFO").getValue() === true;
                            if (key == "CNNT_EMP_NEW") {
                                _value = !chkNew ? "" : _value;
                            }

                            if (key == "CNNT_EMP_CD") {
                                _value = chkNew ? "" : _value;
                            }
                        } else if (["CNNT_OFCR_CD_NEW", "CNNT_OFCR_CD"].contains(key)) {
                            var chkNew = this.contents.getControl("CHK_PIC", "USERINFO").getValue() === true;
                            if (key == "CNNT_OFCR_CD_NEW") {
                                _value = !chkNew ? "" : _value;
                            }

                            if (key == "CNNT_OFCR_CD") {
                                _value = chkNew ? "" : _value;
                            }
                        }
                    }

                    this.keyValueSave.push({
                        COL_CD: colCdName,
                        CONTROL_KEY: key,
                        DEFAULT_VALUE: _value,
                        CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                    });
                } else {
                    this.keyValueSave.push({
                        COL_CD: colCdName,
                        CONTROL_KEY: key,
                        DEFAULT_VALUE: serialize[key],
                        CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                    });
                }
            }.bind(this));

            if (['PI050', 'PI060'].contains(this.FORM_TYPE ) && colCdName == "JUMIN_NO") {
                this.keyValueSave.push({
                    COL_CD: colCdName,
                    CONTROL_KEY: colCdName,
                    DEFAULT_VALUE: _tempValue,
                    CONTROL_TYPE: formCol && formCol.CONTROL_TYPE || ""
                });
            }
        }
    },

    //save
    setSave: function () {
        this.errorMessageControl = [];
        if (this._pageOption.validate && this._pageOption.validate().contains(false)) {
            this.setHideProgressbar();
            this.setErrorValidate();
            return false;
        }
        var thisObj = this;
        var data = null;
        var reSort = null;
        var detail = null;
        this.addAcc009Save = [];  //추가항목명칭 저장데이터 초기화
        this.addPriceGroupSave = null; //단가항목 명칭저장데이터 초기화
        var etcSaveApiList = [];
        this.formAllDataTemp.forEach(function (formData, i) {
            formData.FormGroups.forEach(function (formGroup, j) {
                formGroup.FormOutSet = thisObj.formDataTemp[i].FormGroups[j].FormOutSet;
                reSort = formGroup.FormOutSetDetails.sortBy(function (s) {

                    detail = thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == s.COL_CD })
                    if ($.isNull(detail)) {
                        s.Key.NUM_SORT = 99;
                        s.BASIC_YN = "N";
                    } else {
                        $.extend(s, detail);
                    }
                    //그룹가져오기
                    var groupColCd = thisObj.getFormGroupColCd(s.COL_CD);
                    //컨트롤 값
                    var colCdName = s.COL_CD;
                    if (["CLASS_CD", "CLASS_CD2", "CLASS_CD3"].contains(s.COL_CD)) {
                        colCdName = s.COL_CD == "CLASS_CD" ? "txtClassCd1" : s.COL_CD.replace("CLASS_CD", "txtClassCd");
                    }
                    if (thisObj.contents.getControl(colCdName, groupColCd)) {

                        thisObj.setKeyValueSave(ecount.widget.serialize(thisObj.contents.getControl(colCdName, groupColCd)), s.COL_CD, groupColCd, thisObj.formDataTemp[i].FormGroups[j].FormColumns, thisObj.contents.getControl(colCdName, groupColCd).serialize());
                    }
                    //필수항목체크
                    var basic = thisObj.contents.getControl(String.format("checkEssential_{0}_{1}", groupColCd, s.COL_CD), groupColCd);
                    if (basic) {
                        s.COL_ESSENTIAL_YN = basic.getValue() ? "Y" : "N";
                    }

                    //추가항목 셋팅 명칭
                    if (thisObj._pageOption.changeTitleTab.tab.contains(groupColCd) && !thisObj._pageOption.changeTitleTab.exceptionCol.contains(s.COL_CD)) {
                        s.HEAD_TITLE_NM = thisObj.contents.getControl(String.format("labelList_{0}_{1}", groupColCd, s.COL_CD), groupColCd).getValue();
                        //추가항목 원래 테이블에 추가하기위함(acc009)
                        var _acc009GroupCol = ["CONT", "ADDT"];
                        if (thisObj.FORM_TYPE == "SI800") {
                            _acc009GroupCol = ["GW"];
                        }
                        if (thisObj.addOptions && thisObj.addOptions.isAddAcc009 && (_acc009GroupCol.contains(groupColCd) || !thisObj.useTabSetting)) {
                            thisObj.addAcc009Save.push(thisObj.addOptions.setAcc009Param(s, s.HEAD_TITLE_NM));
                        }

                        //단가명칭 원래 테이블에 추가하기위함(mypagecompany_sale)
                        if (thisObj.addOptions && thisObj.addOptions.isAddPriceGroup && (groupColCd == "PRICE" || !thisObj.useTabSetting)) {
                            thisObj.addPriceGroupSave = thisObj.addOptions.setPriceGroupParam(s, thisObj.addPriceGroupSave, s.HEAD_TITLE_NM);
                        }
                    }
                    return s.Key.NUM_SORT;
                });
                if (thisObj._pageOption.saveValueSet) {
                    thisObj.keyValueSave = thisObj._pageOption.saveValueSet(thisObj.keyValueSave);
                    thisObj.formAllDataTemp[i].FormGroups[j].FormDefaultValues = thisObj.keyValueSave;
                } else {
                    thisObj.formAllDataTemp[i].FormGroups[j].FormDefaultValues = thisObj.keyValueSave;
                }
                reSort = reSort.sortBy(function (s) { return parseInt(s.Key.NUM_SORT); });
                reSort.forEach(function (sortedItem, j) {
                    sortedItem.Key.NUM_SORT = j + 1;
                })
            });
        });
        if (thisObj.addAcc009Save.length > 0) {
            etcSaveApiList.push({ apiUrl: thisObj.addOptions.addAcc009ApiUrl, data: thisObj.addAcc009Save });
        }
        if (!$.isEmpty(thisObj.addPriceGroupSave)) {
            etcSaveApiList.push({ apiUrl: thisObj.addOptions.addPriceGroupApiUrl, data: thisObj.addPriceGroupSave });
        }

        //this.formAllDataTemp[0].FormGroups[0].FormOutSet.COL_ATTR_ID = this.contents.getControl("colType").getValue();

        data = {
            FORM_TYPE: this.FORM_TYPE,
            FORM_SEQ: 1,
            formDataTemp: this.formAllDataTemp,
            IsDetailPermit: this.IsDetailPermit,
            FromProgramId: this.FromProgramId
        };
        thisObj.setShowProgressbar();
        ecount.common.api({
            url: "/Common/Form/SaveFormTemplate",
            data: Object.toJSON(data),
            success: function (result) {
                thisObj.setHideProgressbar();
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                    this.saveComplete = true;
                } else {
                    var message = {
                        type: "reload",
                        callback: thisObj.close.bind(thisObj)
                    };

                    function sendMessageCallBack() {
                        thisObj.sendMessage(thisObj, message);
                    };

                    if (thisObj._pageOption.isNeedToSendMessage == true) {
                        sendMessageCallBack();
                        this.saveComplete = true;
                    } else if (etcSaveApiList.length > 0) {
                        etcSaveApiList.forEach(function (list, i) {
                            thisObj.ectSaveApi(list, etcSaveApiList.length == (i + 1), sendMessageCallBack);
                            if (etcSaveApiList.length == i)
                                this.saveComplete = true;
                        });

                    }
                }
            }
        });
    },

    //추가항목 저장
    ectSaveApi: function (apiInfo, isCallBack, sendMessageCallBack) {
        var thisObj = this;
        var data = apiInfo.apiUrl.indexOf("SVC") > -1 ? Object.toJSON({ Request: { Data: apiInfo.data } }) : Object.toJSON(apiInfo.data);
        ecount.common.api({
            url: apiInfo.apiUrl,
            data: data,
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                else {
                    if (isCallBack && sendMessageCallBack) {
                        sendMessageCallBack && sendMessageCallBack();
                    }
                }
            }
        });
    },

    //show progress bar 진행바 보이기
    setShowProgressbar: function () {
        this.showProgressbar(true);
    },

    //hide progress bar 진행바 감추기
    setHideProgressbar: function () {
        this.hideProgressbar();
        this.footer.getControl('save').setAllowClick();

        this.allTab.forEach(function (x, i) {
            if (this.contents.getControl("restore" + x) != null)
                this.contents.getControl("restore" + x).setAllowClick();
        }.bind(this));
    },

    // add item popup 항목 추가 팝업
    setAddItemPopup: function (data) {
        var thisObj = this;
        var colcd = data.rowItem.COL_CD;
        showColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == colcd });
        var formType = this.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE;
        var param = {
            height: 450,
            width: 450,
            modal: true,
            FORM_TYPE: formType,
            formIndex: data.formIndex,
            isUsingGroupColCd: false,
            targetColCd: colcd,
            checkMaxCount: this.formDataTemp[data.formIndex].FormGroups[0].FormSet.COLUMN_MAX_CNT
        };
        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_47',
            name: "",
            param: param,
            popupType: false,
            additional: false,
        });
    },

    // delete item 항목 삭제
    setDeleteItem: function (data) {
        //remove widget 삭제 위젯
        this.setFormDeleteWidget(data.rowItem.COL_CD);//param : 0[id]
        //update data 상단 데이터 갱신
        this.setSettingDetail({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
        this.setUiSync({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
    },

    //sync left ui 우측 UI 갱신
    setUiSync: function (data) {
        console.log("setUiSync");
        var thisObj = this;
        var formGroupsIdx = 0;
        if (data.checked) {
            var targetColCdIdx;

            targetColCdIdx = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == data.target.COL_CD }).index);
            if (['PI050', 'PI060'].contains(this.FORM_TYPE)) {
                var colGroup = thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].FormOutColumns.where(function (item, i) { return item.COL_CD == data.rowItem.COL_CD });
                colGroup.forEach(function (colOfGroup) {
                    var objParam = thisObj.formDataTemp[0].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == colOfGroup.COL_CD });
                    thisObj.setFormAddWidget(objParam, targetColCdIdx);
                    data.target.COL_CD = colOfGroup.COL_CD;
                });
            } else {
                //add widget on right top 우측 상단 위젯 추가
                var objParam = thisObj.formDataTemp[0].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == data.rowItem.COL_CD });
                thisObj.setFormAddWidget(objParam, targetColCdIdx);
            }
            data.target.COL_CD = data.rowItem.COL_CD;
        } else {
            //remove widget on right top  우측 상단 위젯제거
            thisObj.setFormDeleteWidget(data.rowItem.COL_CD);//param : 0[id]
        }
        //sync sort number 정렬순서 동기화
        this.setSortSync({ formIndex: 0 });
    },

    //setting detail 상세 설정
    setSettingDetail: function (data) {
        var thisObj = this;
        var formGroupsIdx = 0;

        if (data.checked) {
            var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD });
            var index = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.length) + 1;
            var newFormOutSetDetail = Object.clone(thisObj.formAllDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.find(function (item) { return item.COL_CD == formColumn.COL_CD }), true);
            newFormOutSetDetail.BASIC_YN = "Y";
            var newColumn = Object.clone(thisObj.formAllDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == formColumn.COL_CD }), true);
            newColumn.width = 100;
            if (['PI050', 'PI060'].contains(thisObj.FORM_TYPE)) {
                newColumn.disableMod = false;
                newColumn.disableAllMod = false;
                newFormOutSetDetail.HEAD_SIZE = 100;
                newColumn.basicYn = "Y";
            } else if (['SI902'].contains(thisObj.FORM_TYPE)) {
                    newColumn.disableMod = true;
                    newColumn.disableAllMod = true;
                    newColumn.isLineMrge = false;
            } else
            {
                newColumn.disableMod = true;
                newColumn.disableAllMod = true;
                newColumn.isLineMrge = false;
                newFormOutSetDetail.HEAD_SIZE = 0;
            }
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.add(newFormOutSetDetail);
            thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.add(newColumn);
            //check 체크 처리
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "Y";
        } else {
            var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD });
            //remove detail  디테일 삭제
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.remove(function (item) { return item.COL_CD == formColumn.COL_CD });
            //remove item 항목 삭제
            thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.remove(function (item) { return item.id == formColumn.COL_CD });
            //uncheck 언체크 처리
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "N";
        }
    },

    //sync sort 정렬동기화
    setSortSync: function (data) {
        //sync table  위젯 순서 동기화-값재할당
        var formDataTempCurrent = this.formDataTemp[0].FormGroups[0];
        formDataTempCurrent.ViewModel.columns.forEach(function (sortedItem, j) {
            formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = j + 1;
        });
    },

    //get form template from db 양식 디비값 가져오기
    setFormInfosFromDb: function () {

        var thisObj = this;
        //for ui UI용 데이터
        this.formDataTemp = new Array();
        //for save 저장용 데이터
        this.formAllDataTemp = new Array();

        Object.clone(this.viewBag.InitDatas.Template, true).FormInfos.forEach(function (formTemp, i) {
            thisObj.formDataTemp.push(formTemp);
            thisObj.setColumnExceptBasicN(i);
        });
        Object.clone(this.viewBag.InitDatas.Template, true).FormInfos.forEach(function (formTemp, i) {
            thisObj.formAllDataTemp.push(formTemp);
        });
        thisObj.lastEditTime = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EDIT_DT;
        thisObj.lastEditId = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EDIT_ID;
        thisObj.useTabSetting = thisObj.formDataTemp[0].FormGroups[0].FormSet.IS_BASIC_TAB != null ? thisObj.formDataTemp[0].FormGroups[0].FormSet.IS_BASIC_TAB : true;
    },

    // except basicYn is N 베이직YN이 N인것은 제외
    setColumnExceptBasicN: function (i) {
        //add button disable by col_cd // choijinyoung
        var thisObj = this;
        var reSort = null;
        var z = 0;
        var currentTabId = this.contents && this.contents.currentTabId;
        var formData = $.isEmpty(currentTabId) || currentTabId == "BASIC" ? "formDataTemp" : "FormData" + currentTabId;
        thisObj[formData][i].FormGroups.forEach(function (formGroup, j) {
            reSort = formGroup.ViewModel.columns.sortBy(function (s) {
                return (s.basicYn != "Y") ? s.index = 99 : s.index;
            });
            z = 0;
            reSort = reSort.sortBy(function (s) { return s.index; });
            reSort.forEach(function (sortedItem) {
                if (sortedItem.index == 99) {
                    thisObj[formData][i].FormGroups[j].FormOutSetDetails.remove(function (item) { return item.COL_CD == sortedItem.id });
                    thisObj[formData][i].FormGroups[j].ViewModel.columns.remove(function (item) { return item.id == sortedItem.id });
                } else {
                    z++;
                    thisObj[formData][i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = z;
                    thisObj[formData][i].FormGroups[j].ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).index = z;
                }

                if (["PI050", "PI060"].contains(thisObj.FORM_TYPE )) {
                    sortedItem.disableMod = false;
                    sortedItem.disableAllMod = false;
                } else {
                    sortedItem.disableMod = true;
                    sortedItem.disableAllMod = true;
                    sortedItem.isLineMrge = false;
                }
                defaultYnControl = thisObj[formData][i].FormGroups[j].FormColumns.find(function (item) { return item.COL_CD == sortedItem.id });
                if (defaultYnControl && defaultYnControl.DEFAULT_YN == "Y") {
                    sortedItem.disableDel = true;
                }
            })
        });
    },

    onContentsPROD_CD: function (e) {
        if (this._isFormSetting && this._pageOption && this._pageOption.linkControl) {
            var linkoption = this._pageOption.linkControl.where(function (item, i) { return item.key == e.cid; }).first();
            if (linkoption) {
                var options = linkoption.options.where(function (item, i) { return item.id == e.linkID; }).first();
                if (options) {

                    this.openWindow({
                        url: options.url,
                        param: options.param

                    });
                }
            }
        }
    },

    onContentsBUSINESS_NO: function (e) {
        this.onContentsPROD_CD(e);
    },

    //Restore default 기본값 복원
    getRestoreForm: function () {

        var thisObj = this;
        this.oemModelProdCd = this.oemModelProdCd && null;
        var permit = this.viewBag.Permission.formUserPermit ? this.viewBag.Permission.formUserPermit.Value : "W";
        if (!["W", "U"].contains(permit)) {
            //이 페이지가 지원하는 양식이 거래처와 품목만 해당되기 때문에 권한체크는 하드코딩하기로 - 채주영 2016.10.13
            if (thisObj.FORM_TYPE.toUpperCase() == "SI912") {
                ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]).fullErrorMsg);
            } else {
                ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]).fullErrorMsg);
            }
        } else {
            this.setShowProgressbar();
            //Restore ZA 기본값 복원
            var restoreLists = new Array();

            thisObj.formDataTemp.forEach(function (formData) {
                restoreLists.push({
                    FORM_TYPE: formData.FormGroups[0].FormOutSet.Key.FORM_TYPE,
                    FORM_SEQ: 99,
                    FormItemShowType: thisObj.contents.currentTabId == "BASIC" ? "B" : "G",
                    GroupColCd: thisObj.contents.currentTabId == "BASIC" ? "" : thisObj.contents.currentTabId
                });
            });
            ecount.common.api({
                url: "/Common/Form/GetListFormTemplate",
                data: Object.toJSON(restoreLists),
                success: function (result) {
                    thisObj.setHideProgressbar();
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        var formDataBefor = Object.clone(thisObj.formDataTemp, true);

                        var currentTabId = thisObj.contents && thisObj.contents.currentTabId;
                        var formData = $.isEmpty(currentTabId) || currentTabId == "BASIC" ? "formDataTemp" : "FormData" + currentTabId;


                        thisObj[formData] = Object.clone(result.Data, true);
                        thisObj.formAllDataTemp = Object.clone(result.Data, true);

                        // colType 복원
                        //if (currentTabId == "BASIC")
                        //    thisObj._changeColType(thisObj.formAllDataTemp[0].FormGroups[0].ViewModel.colType, true);

                        for (var i = 0; i < thisObj[formData].length; i++) {
                            thisObj.setColumnExceptBasicN(i);
                        }
                        if (formData == "formDataTemp")
                            thisObj.setMoveTableReset(thisObj._createInitWidgetData(thisObj.contents.currentTabId));
                        thisObj.setResetWedgets(formData == "formDataTemp" ? "" : formData);
                        thisObj.setBasicYnRestore(formDataBefor);
                    }
                }
            });
        }
    },

    //knh #13
    onDragErrorHandler: function (event) {
        if (event._isErrorMessage) {
            ecount.alert(ecount.resource.MSG04357);
        }
    },

    //reload
    reload: function () {
        var param = {
            FORM_TYPE: this.FORM_TYPE,
            isReload: true,
        }
        this.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_07_CM", param);
    },

    //기본 체크박스 해제
    setBasicYnRestore: function (formDataBefor) {
        if ($.isEmpty(formDataBefor))
            return;

        formDataBefor.forEach(function (formItem, i) {
            formItem.FormGroups.forEach(function (groupItem, j) {
                groupItem.ViewModel.columns.forEach(function (item, x) {
                    var basic = this.contents.getControl(String.format("checkBasic_{0}_{1}", item.groupColCd, item.id), item.groupColCd);
                    if (basic) {
                        basic.setReadOnly(false);
                        basic.setValue(false);
                        basic.setReadOnly(true);
                    }
                }.bind(this));
            }.bind(this))
        }.bind(this));

        this.formDataTemp.forEach(function (formItem, i) {
            formItem.FormGroups.forEach(function (groupItem, j) {
                this.setBasicYnCheckbox(groupItem.ViewModel.columns, "addItems");
            }.bind(this))
        }.bind(this));

    },
    //기본값 체크박스 체크해제
    setBasicYnCheckbox: function (rowItems, type) {
        checkValue = type == "addItems";
        rowItems.forEach(function (rowItem, j) {
            var groupColCd = rowItem.GROUP_COL_CD || rowItem.groupColCd;
            var colCd = rowItem.COL_CD || rowItem.id;
            if ($.isEmpty(groupColCd)) {
                groupColCd = this.getFormGroupColCd(colCd);
            }
            var basic = this.contents.getControl(String.format("checkBasic_{0}_{1}", groupColCd, colCd), groupColCd);
            if (basic) {
                basic.setReadOnly(false);
                basic.setValue(checkValue);
                basic.setReadOnly(true);
            }
        }.bind(this));
    },
    //
    getZeroAdd: function (val) {
        return val.length == 1 ? "0" + val : val;
    },

    getAuthorize: function (tab) {
        if (this.authorize.userType === "A")
            return true;
        else if (tab === "general")
            return this.authorize.userFlag === "M";
        else
            return this.authorize[tab] === "W";
    },
    //숨김처리
    setHideColums: function () {
        if (this._pageOption && this._pageOption.hideColumn) {
            this._pageOption.hideColumn.forEach(function (item, i) {
                var hideControl = this.contents.getControl(item.mainCd, item.tabId);
                if (!$.isEmpty(item.subId) && hideControl) {
                    hideControl = hideControl.get(item.subId);
                }
                hideControl && hideControl.hide();
            }.bind(this));
        }
    },
    //기본셋티값
    getDefaultSettingData: function (tab) {
        this.intputDefaultData = this[tab ? tab : "formDataTemp"][0].FormGroups[0].FormDefaultValueConvertData;
    },

    onPOST_NOaddrLink: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(1),
            height: 500,
            strType: '1'
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM004P',
            name: ecount.resource.LBL04090,                                                                     //Resource : 우편번호검색
            param: param,
            additional: false
        });
    },

    //LinkAddress2(우편번호2)
    onDM_POSTaddrLink: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(1),
            height: 500,
            strType: '2'
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM004P',
            name: ecount.resource.LBL04090,                                                                     //Resource : 우편번호검색
            param: param,
            additional: false
        });
    },

    // Link address menu Register Employee
    onADDRESSaddrLink: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(1),
            height: 500,
            strType: '2'
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM004P',
            name: ecount.resource.LBL04090,                                                                     //Resource : 우편번호검색
            param: param,
            additional: false
        });
    },

    getIsHeaderStyles: function (tabId, items) {
        var result = true;
        if (this._pageOption.changeTitleTab && (this._pageOption.changeTitleTab.tab || []).contains(tabId)) {
            result = []
            items.forEach(function (item, i) {
                result.push((this._pageOption.changeTitleTab.exceptionCol || []).contains(item.id));
            }.bind(this));
        }
        return result;
    },

    customSubItems: function (data, tabId) {
        if (this.FORM_TYPE == "SI800") {
            if (tabId == "USERINFO") {
                data.forEach(function (item, i) {
                    if (["EMAILID", "MULTILOGIN"].contains(item.id)) {
                        item.colEssentialYn = "N";
                    }
                });
            }
        }
        else if (this.FORM_TYPE == "SI982") {
            if (tabId == "AUTHOR") {
                data = data.where(function (item) { return item.id != "OUTCUST" });
            }
        }
        return data;
    },

    //OninitControl for [Register User ID] (SI800)
    userIdOninitControlEx: function (cid, control, controlType, rowData, selfObj) {
        if (cid.indexOf("check") == -1 && cid.indexOf("labelList_") == -1) {
            switch (cid) {
                case "ID":
                case "PASSWORD":
                case "MOBILE":
                case "REMARKS":
                case "EMAILID":
                case "MULTILOGIN":
                case "TRANSFERID":
                case "VIEWRANGE":
                    control.end().controlType = "widget.label";
                    break;
                case "NAME":
                    var defaultName = "";
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        defaultName = this.intputDefaultData.InputDefaultValue.NAME || "";
                    }
                    
                    control.value(defaultName)
                    .filter("maxbyte", { message: String.format(ecount.resource.MSG00297, "25", "50"), max: 50 });
                    break;
                case "EMAIL":
                    var options = { isHideMail: true, };
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        options.data = [
                            { value: this.intputDefaultData.InputDefaultValue.EMAIL || "" },
                            { value: this.intputDefaultData.InputDefaultValue.USE_RECOVERY || "N" },
                            { value: this.intputDefaultData.InputDefaultValue.RECOVERY_EMAIL || "" },
                        ];
                    }
                    control.setOptions(options);
                    break;
                case "DEPTMENT":
                    control.codeType(7);
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.IN_PART) {
                        control.setDefault({
                            isDefaultSet: false,
                            editCode: { value: this.intputDefaultData.InputDefaultValue.IN_PART, label: this.intputDefaultData.InputDefaultValue.IN_PART_DES }
                        });
                    }
                    break;
                case "WORKHOURS":
                    var hhOptionList = [];
                    var mmOptionList = [];
                    var list;
                    var selectedValue1 = "00", selectedValue2 = "00", selectedValue3 = "00", selectedValue4 = "00";

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue1 = this.intputDefaultData.InputDefaultValue.START_TIME_HH || "00";
                        selectedValue2 = this.intputDefaultData.InputDefaultValue.END_TIME_HH || "00";
                        selectedValue3 = this.intputDefaultData.InputDefaultValue.START_TIME_MM || "00";
                        selectedValue4 = this.intputDefaultData.InputDefaultValue.END_TIME_MM || "00";
                    }

                    for (var i = 0; i < 24; i++) {
                        hhOptionList.push([i, Number.format("00", i)]);
                    }

                    for (var i = 0; i < 60; i++) {
                        mmOptionList.push([i, Number.format("00", i)]);
                    }

                    control.setOptions({ hhOption: hhOptionList, mmOption: mmOptionList })
                        .value([selectedValue1, selectedValue3, selectedValue2, selectedValue4]);
                    break;
                case "LANGUAGE":
                    var lst = this.viewBag.InitDatas.langList.select(function (x) { return [x.LAN_TYPE, x.LAN_DES]; });
                    control.option(lst);
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.LAN_TYPE) {
                        control.select(this.intputDefaultData.InputDefaultValue.LAN_TYPE);
                    } else {
                        control.select(this.language);
                    }
                    break;
                case "DEFAULTAUTHORIZATION":
                    var lst = this.viewBag.InitDatas.GroupData.ACC009.select(function (x) { return [x.CODE_NO, x.CODE_DES]; });
                    control.popover(ecount.resource.MSG07273).option(lst);
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.DEFAULTAUTHORIZATION) {
                        control.select(this.intputDefaultData.InputDefaultValue.DEFAULTAUTHORIZATION);
                    } else {
                        control.select(this.viewBag.InitDatas.GroupData.DEFAULT_AUTH_GROUP_CD || "*00");
                    }
                    //control.end().controlType = "widget.label";
                    break;
                case "MENUAUTHORIZATION":
                case "TEMPAUTHORIZATION":
                case "CONF_AUTH":
                case "ALLO_PER":
                case "EPDASHBOARD":
                    break;
                case "MENU":
                    var selectedValue = "D";

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = this.intputDefaultData.InputDefaultValue.ONLY_MYPAGE_radio;
                    }

                    control.popover(ecount.resource.MSG08164)
                        .label([ecount.resource.LBL06722, ecount.resource.LBL04440, ecount.resource.LBL04434]).value(["D", "N", "Y"])
                        .setOptions({
                            linkLabel: " ",
                            inlineDivider: 0
                        })
                        .fixedSelect(selectedValue);
                    break;
                case "GW":
                    var selectedValue = "D";

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = this.intputDefaultData.InputDefaultValue.GW_USE;
                    }

                    control.label([ecount.resource.LBL06722, ecount.resource.LBL01185, ecount.resource.LBL04417])
                        .value(["D", "N", "Y"])
                        .select(selectedValue)
                        .setOptions({ inlineDivider: 0 });
                    break;
                case "ERPAPP":
                    var selectedValue = "D";

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = this.intputDefaultData.InputDefaultValue.EC_ERPAPP_USE_YN_radio;
                    }

                    control.popover(ecount.resource.MSG05005)
                        .label([ecount.resource.LBL06722, ecount.resource.LBL01185, ecount.resource.LBL04417]).value(["D", "N", "Y"])
                        .setOptions({
                            linkLabel: " ",
                            inlineDivider: 0
                        })
                        .fixedSelect(selectedValue);
                    break;
                case "QUICKSALE":
                    var selectedValue = "D";

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = this.intputDefaultData.InputDefaultValue.POS_YN_radio;
                    }

                    control.popover(ecount.resource.MSG03947)
                        .label([ecount.resource.LBL06722, ecount.resource.LBL01185, ecount.resource.LBL04417]).value(["D", "N", "Y"])
                        .setOptions({
                            linkLabel: " ",
                            inlineDivider: 0
                        })
                        .fixedSelect(selectedValue);
                    break;
                case "EXCELUPLOAD":
                    var selectedValue = "D";

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = this.intputDefaultData.InputDefaultValue.EXCEL_LOGIN_YN;
                    }

                    control.popover(ecount.resource.MSG04833)
                        .label([ecount.resource.LBL06722, ecount.resource.LBL01185, ecount.resource.LBL04417])
                        .value(["D", "N", "Y"])
                        .setOptions({ inlineDivider: 0 })
                        .select(selectedValue);
                    break;
                case "EXCEL":
                    var selectedValue = "D";

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = this.intputDefaultData.InputDefaultValue.EXCEL_CONVERT_YN;
                    }

                    control.popover(ecount.resource.MSG05203)
                        .label([ecount.resource.LBL06722, ecount.resource.LBL01185, ecount.resource.LBL04417])
                        .value(["D", "N", "Y"])
                        .setOptions({ inlineDivider: 0 })
                        .select(selectedValue);
                    break;
                case "PRICEAMOUNT":
                    var defaultSales = ecount.resource.LBL06722,
                        defaultPurchases = ecount.resource.LBL06722,
                        defaultProduction = ecount.resource.LBL06722,
                        selectedValue = [0, 0, 0];

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = [this.intputDefaultData.InputDefaultValue.PRICEAMOUNT_radioFirst,
                        this.intputDefaultData.InputDefaultValue.PRICEAMOUNT_radioSecond,
                        this.intputDefaultData.InputDefaultValue.PRICEAMOUNT_radioThird];
                    }

                    control.popover(ecount.resource.MSG04726)
                        .label([[defaultSales, ecount.resource.LBL04446, ecount.resource.LBL04267],
                        [defaultPurchases, ecount.resource.LBL04446, ecount.resource.LBL04267],
                        [defaultProduction, ecount.resource.LBL04446, ecount.resource.LBL04267]])
                        .value([["0", "1", "2"],
                        ["0", "1", "2"],
                        ["0", "1", "2"]])
                        .setAddonTitle([ecount.resource.LBL01899, ecount.resource.LBL00640, ecount.resource.LBL05536])
                        .setOptions({ inlineDivider: 0 })
                        .fixedSelect(selectedValue);
                    break;
                case "RESTRICT_TIME":
                    var selectedValue = "Y";
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        selectedValue = this.intputDefaultData.InputDefaultValue.RESTRICT_TIME_radio;
                    }

                    control.setOptions({ linkLabel: " " })
                        .label([ecount.resource.LBL06722, ecount.resource.LBL09235]).value(["Y", "N"])
                        .fixedSelect(selectedValue);
                    break;
                case "TXT1":
                case "TXT2":
                case "TXT3":
                case "TXT4":
                case "TXT5":
                case "TXT6":
                    control.setOptions({ id: cid, name: cid });
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        control.value(this.intputDefaultData.InputDefaultValue[cid]);
                    }
                    break;
                case "LINK_PIC":
                    var g = widget.generator;
                    var ctrl = g.control();

                    control.controlType = control.controlType || "widget.custom";

                    var defaultPicCd = { label: "", value: "" },
                        defaultPicNew = "",
                        defaultNew = false;

                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        // default New
                        defaultNew = this.intputDefaultData.InputDefaultValue.CHK_PIC === "1";
                        //default PIC
                        if (defaultNew && !_.isEmpty(this.intputDefaultData.InputDefaultValue.CNNT_OFCR_CD_NEW)) {
                            defaultPicNew = this.intputDefaultData.InputDefaultValue.CNNT_OFCR_CD_NEW || "";
                        }

                        if (!defaultNew && !_.isEmpty(this.intputDefaultData.InputDefaultValue.CNNT_OFCR_CD)) {
                            defaultPicCd = { value: this.intputDefaultData.InputDefaultValue.CNNT_OFCR_CD, label: this.intputDefaultData.InputDefaultValue.CNNT_OFCR_DES || "" };
                        }
                    }

                    control.addControl(
                      ctrl.define("widget.checkbox", "CHK_PIC", "CHK_PIC").label(ecount.resource.BTN01038)
                        .value(true)
                        .select(defaultNew)
                        .setInlineIndex(0)
                        .end()
                    );

                    control.addControl(
                        ctrl.define("widget.input.codeType", "CNNT_OFCR_CD_NEW", "CNNT_OFCR_CD_NEW", ecount.resource.LBL00985)
                        .filter("maxbyte", { message: String.format(ecount.resource.MSG00297, "15", "30"), max: 30 })
                        .setInlineIndex(1)
                        .value(defaultPicNew)
                        .setOptions({
                            _placeHolder: ecount.resource.LBL01486
                        })
                        .hide(!defaultNew)
                        .end()
                    );

                    control.addControl(
                        ctrl.define("widget.code.PIC", "CNNT_OFCR_CD", "CNNT_OFCR_CD", ecount.resource.LBL00985)
                        .codeType(7)
                        .setOptions({ _enableDirectInput: true })
                        .setInlineIndex(1)
                        .addCode(defaultPicCd)
                        .setOptions({
                            _placeHolder: ecount.resource.LBL00985
                        })
                        .hide(defaultNew)
                        .end()
                    );
                    break;
                case "LINK_EMP":
                    var g = widget.generator;
                    var ctrl = g.control();

                    control.controlType = control.controlType || "widget.custom";

                    var defaultEmpCd = { label: "", value: "" },
                        defautEmpNew = "",
                        defaultNew = false;
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue) {
                        // default New
                        defaultNew = this.intputDefaultData.InputDefaultValue.CHK_EMP === "1";
                        //default Emp
                        if (defaultNew && !_.isEmpty(this.intputDefaultData.InputDefaultValue.CNNT_EMP_NEW)) {
                            defautEmpNew = this.intputDefaultData.InputDefaultValue.CNNT_EMP_NEW || "";
                        }

                        if (!defaultNew && !_.isEmpty(this.intputDefaultData.InputDefaultValue.CNNT_EMP_CD)) {
                            defaultEmpCd = { value: this.intputDefaultData.InputDefaultValue.CNNT_EMP_CD, label: this.intputDefaultData.InputDefaultValue.CNNT_EMP_DES || "" };
                        }
                    }

                    control.addControl(
                      ctrl.define("widget.checkbox", "CHK_EMP", "CHK_EMP").label(ecount.resource.BTN01038)
                        .value(true)
                        .select(defaultNew)
                        .setInlineIndex(0)
                        .end()
                    );

                    control.addControl(
                        ctrl.define("widget.input.codeType", "CNNT_EMP_NEW", "CNNT_EMP_NEW", ecount.resource.LBL01478)
                        .filter("maxbyte", { message: String.format(ecount.resource.MSG00297, "7", "14"), max: 14 })
                        .setInlineIndex(1)
                        .value(defautEmpNew)
                        .setOptions({
                            _placeHolder: ecount.resource.LBL06740
                        })
                        .hide(!defaultNew)
                        .end()
                      );

                    control.addControl(
                        ctrl.define("widget.code.employee", "CNNT_EMP_CD", "CNNT_EMP_CD", ecount.resource.LBL01478)
                        .codeType(7)
                        .setInlineIndex(1)
                        .setOptions({ _enableDirectInput: true })
                        .addCode(defaultEmpCd)
                        .setOptions({
                            _placeHolder: ecount.resource.LBL01478
                        })
                        .hide(defaultNew)
                        .end()
                    );
                    break;
                default:
                    control.end().controlType = "widget.label";
                    break;
            }
        }
    },

    //Custom saving data for [Register User ID] (SI800)
    userIdSaveValueSetEx: function (data) {
        data.where(function (item) { return item.COL_CD == "WORKHOURS" }).forEach(function (item) {
            if (item.CONTROL_KEY != "SLASH") {
                item.DEFAULT_VALUE = Number.format("00", item.DEFAULT_VALUE);
            }
        });

        var isUseRecovery = false;
        data.where(function (item) { return item.COL_CD == "EMAIL" }).forEach(function (item) {
            if (item.CONTROL_KEY == "USE_RECOVERY") {
                item.DEFAULT_VALUE = $.isArray(item.DEFAULT_VALUE) ? item.DEFAULT_VALUE[0] : "N";
                if (item.DEFAULT_VALUE == "Y") {
                    isUseRecovery = true;
                }
            }
        });

        data.where(function (item) { return item.CONTROL_KEY == "RECOVERY_EMAIL" }).forEach(function (item) {
            if (isUseRecovery == false) {
                item.DEFAULT_VALUE = "";
            }
        });

        return data;
    },

    //Validate saving data for [Register User ID] (SI800)
    userValidateEx: function () {
        var errors = new Array(), targetTab = "";

        //Check validate name
        var ctrlName = this.contents.getControl("NAME", "USERINFO");
        if (ctrlName && ctrlName.validate().length > 0) {
            targetTab = "USERINFO";
            ctrlName.showError();
            errors.push(false);
        }

        //Check mail format
        var ctrlMail = this.contents.getControl("EMAIL", "USERINFO");
        if (ctrlMail && ctrlMail.get(1).getValue() == true && ctrlMail.get(3).checkValidate(["required", "email"]).length > 0) {
            targetTab = "USERINFO";
            ctrlMail.showError(0, ecount.resource.MSG00008);
            errors.push(false);
        } else {
            ctrlMail.hideError();
        }

        if (!$.isEmpty(targetTab)) {
            this.contents.changeTab(targetTab, false);
        }

        return errors;
    },

    //OninitControl for [Reg. Cust./Vend. ID] (SI982)
    userSetupOninitControlEx: function (cid, control, controlType, rowData, selfObj) {
        switch (cid) {
            case "BUSINESS_NO":
            case "ID":
            case "PASSWD":
            case "EMAIL":
            case "OUTCUST":
                control.end().controlType = "widget.label";
                break;
            case "ALL_MN_GROUPCD":
                var csGroupList = this.viewBag.InitDatas.CSGroupData.CSGroupList;
                var selected = { value: "", label: "" };
                if (csGroupList && csGroupList.length > 0) {
                    if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.ALL_MN_GROUPCD) {
                        selected.value = this.intputDefaultData.InputDefaultValue.ALL_MN_GROUPCD;
                        var _groupInfo = csGroupList.where(function (item) { return item.ALL_MN_GROUPCD == selected.value });
                        if (_groupInfo && _groupInfo.length > 0) {
                            selected.label = _groupInfo[0].ALL_MN_GROUPNM;
                        } else {
                            selected.value = "";
                        }
                    } else {
                        var defaultValue = csGroupList.where(function (item) { return item.BASIC_YN == "Y" });
                        if (defaultValue && defaultValue.length > 0) {
                            selected = { value: defaultValue[0].ALL_MN_GROUPCD, label: defaultValue[0].ALL_MN_GROUPNM };
                        }
                    }
                }
                control.codeType(7);
                control.popover(ecount.resource.MSG05299);
                control.addCode(selected);
                break;
            case "LAN_TYPE":
                var lst = this.viewBag.InitDatas.langList.select(function (x) { return [x.LAN_TYPE, x.LAN_DES]; });
                control.option(lst);
                var _selectedValue = ecount.user.LAN_TYPE;
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.LAN_TYPE) {
                    _selectedValue = this.intputDefaultData.InputDefaultValue.LAN_TYPE;
                }
                control.select(_selectedValue);
                break;
            case "ALL_GROUP_WH":
                var selectedValue = "0";
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.ALL_GROUP_WH_radio) {
                    selectedValue = this.intputDefaultData.InputDefaultValue.ALL_GROUP_WH_radio;
                }
                control.popover(ecount.resource.MSG02841).setOptions({ inlineDivider: true, linkLabel: " " })
                    .label([ecount.resource.LBL02475, ecount.resource.LBL08011]).value(["0", "1"])
                    .fixedSelect(selectedValue);
                break;
            case "CS_PROD_TYPE":
                var selectedValue = "B";
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.CS_PROD_TYPE_radio) {
                    selectedValue = this.intputDefaultData.InputDefaultValue.CS_PROD_TYPE_radio;
                }
                control.popover(ecount.resource.LBL09866)
                    .setOptions({ inlineDivider: true, linkLabel: " " })
                    .label([ecount.resource.LBL08396, ecount.resource.LBL08019, ecount.resource.LBL09235]).value(["B", "T", "S"])
                    .fixedSelect(selectedValue);
                break;
            case "CS_MIN_ORDER_QTY":
                var selectedValue = "B";
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.CS_MIN_ORDER_QTY) {
                    selectedValue = this.intputDefaultData.InputDefaultValue.CS_MIN_ORDER_QTY;
                }
                control.popover(ecount.resource.LBL09866)
                    .setOptions({ inlineDivider: true })
                    .label([ecount.resource.LBL08396, ecount.resource.LBL03589, ecount.resource.LBL07879]).value(["B", "N", "Y"])
                    .select(selectedValue);
                break;
            case "CS_STOCK_TYPE":
                var selectedValue = ["B", { value: "", label: "" }];
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.CS_STOCK_TYPE_radio) {
                    selectedValue[0] = this.intputDefaultData.InputDefaultValue.CS_STOCK_TYPE_radio;
                }
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.CS_STOCK_TYPE_code) {
                    selectedValue[1] = { value: this.intputDefaultData.InputDefaultValue.CS_STOCK_TYPE_code, label: this.intputDefaultData.InputDefaultValue.CS_STOCK_TYPE_DES };
                }
                control.popover(ecount.resource.MSG06565)
                    .label([ecount.resource.LBL07880, ecount.resource.LBL09841]).value(["N", "B"]).setOptions({ codeType: 7 })
                    .fixedSelect(selectedValue)
                    .setAddonTitle(ecount.resource.LBL08917);
                break;
            case "LIMIT_TIME_BASE_YN":
                var selectedValue = "Y";
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.LIMIT_TIME_BASE_YN_radio) {
                    selectedValue = this.intputDefaultData.InputDefaultValue.LIMIT_TIME_BASE_YN_radio;
                }
                control.popover(ecount.resource.MSG01420).setOptions({ linkLabel: " " })
                    .label([ecount.resource.LBL80322, ecount.resource.LBL09235]).value(["Y", "N"])
                    .fixedSelect(selectedValue);
                break;
            case "CS_NOTI_TYPE":
                var selectedValue = "B";
                if (this.intputDefaultData && this.intputDefaultData.InputDefaultValue && this.intputDefaultData.InputDefaultValue.CS_NOTI_TYPE_radio) {
                    selectedValue = this.intputDefaultData.InputDefaultValue.CS_NOTI_TYPE_radio;
                }
                control.popover(ecount.resource.MSG01421).setOptions({ linkLabel: " " })
                    .label([ecount.resource.LBL80322, ecount.resource.LBL09235]).value(["B", "S"])
                    .fixedSelect(selectedValue);
                break;
            default:
                break;
        }
    },

    //Custom saving data for [Reg. Cust./Vend. ID] (SI982)
    userSetupSaveValueSetEx: function (data) {
        return data;
    },

    //Validate saving data for [Reg. Cust./Vend. ID] (SI982)
    userSetupValidateEx: function () {
        return new Array();
    },

    _changeColType: function (newColType, isSetSelectBox) {
        var topForm = this.contents.getFormById("topForm");
        topForm.setColSize(newColType);
        this._RowInCellCount = newColType * 2;
        this.setMoveSetting(topForm, true);

        if (isSetSelectBox) {
            this.contents.getControl("colType").setValue(newColType);
        }
    }

});
