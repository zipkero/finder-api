window.__define_resource && __define_resource("LBL00495","LBL00479","LBL00402","LBL00703","LBL02266","LBL08113","LBL02475","LBL08976","LBL08104","LBL08105","LBL03590","LBL02704","LBL01018","LBL00865","LBL08394","BTN00113","BTN00427","BTN00141","LBL14416","BTN00561","BTN00330","BTN00169","LBL01457","LBL35390","BTN00043","BTN00026","BTN00959","BTN00204","BTN00033","BTN00203","BTN00050","BTN00177","BTN00341","BTN00410","MSG00075","MSG00564","LBL03530","LBL00043","LBL00055","LBL08064","LBL01072","LBL93038","LBL00476","MSG04752","LBL09678","MSG00705","MSG00299","MSG00141","LBL09653","LBL03176","LBL03228","LBL04893","LBL07516","LBL06568","LBL08107","LBL08111","LBL08109","LBL07520","LBL08085","LBL07088","LBL06575","LBL07102","LBL08094","LBL00114","LBL06574","LBL06577","LBL06578","LBL03547","LBL09416","LBL06583","LBL08095","LBL08087","LBL06585","LBL08089","LBL35154","LBL35155","LBL00113","LBL06589","LBL13192","LBL06591","LBL06592","LBL06571","LBL03543","LBL05318","LBL01472","LBL13141","LBL06590","LBL13142","LBL13115","LBL13116","LBL08395","BTN00009","LBL00866","BTN00263","LBL07973","BTN00272");
/****************************************************************************************************
1. Create Date : 2017.01.16
2. Creator     : 신선미
3. Description : 계정코드등록 리스트
4. Precaution  : 
5. History     : History:    2017.12.08 (LOC) - A17_01202_계정설정 기초등록처럼 하나씩 추가하기-최종안_수정 Dev.#283 (Excel Detail)
                 2018.01.17(Thien.Nguyen) : Add option shaded for grid.
                 2018.09.17 박종국 : 자동대체설정 / 결산회계처리설정 제거 및 자동생성설정 추가
                 2018.12.27 (HoangLinh): Remove $el
                 2019.01.03 (Ngọc Hân) : Remove $el at function onFocusOutHandler
                 2019.02.14 (Duyet) : Set param for reload page
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.05 (NguyenDucThinh) A18_04171 Update resource
6. MenuPath    : 회계1 > 기초등록 > 계정코드등록
****************************************************************************************************/

ecount.page.factory('ecount.page.list', 'EBA001M', {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    incomeFlag: 0,
    comCode: null,
    listApiParameter: null,
    listApiDefaultParameter: null,
    GridData: null,
    GridColumns: null,

    selectedList: "",    // 선택리스트
    canCheckCount: 1000,     // 체크 가능 수 기본 1000    
    formTypeCode: 'AR250',                                      // 리스트폼타입
    formInfo: null,                                         // 리스트 양식정보
    // 사용방법설정 팝업창 높이
    selfCustomizingHeight: 0,
    /*선택삭제 관련*/
    selectedCnt: 0,                                             // 선택한 리스트 수
    BusinessNoList: null,                                         // 선택한 거래처코드 리스트
    errDataAllKey: null,
    userPermit: "",
    /*선택삭제 관련*/
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.comCode = this.viewBag.ComCode;
        this.formInfo = this.viewBag.FormInfos[this.formTypeCode];
        this.incomeFlag = Number(ecount.config.company.INCOME_FLAG);

        this.listApiDefaultParameter = {
            QUICKSEARCH_VALUE: this.QuickSearch_Value,      //퀵서치검색어
            FORM_TYPE: this.formTypeCode,
            FORM_SER: '1',
            GYE_CODE: this.GYE_CODE,
            GYE_DES: this.GYE_DES,
            SEARCH_MEMO: this.SEARCH_MEMO,
            INPUT_GUBUN: this.INPUT_GUBUN,
            PY_GYE_GUBUN: this.PY_GYE_GUBUN,
            CR_DR: this.CR_DR
        };

        this.userPermit = this.viewBag.Permission.Permit.Value;
    },
    
    render: function () {
        if (!this.isPopupTypeWindow()) { this.setLayout(this.formInfo); }
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //SettingHeaderOption(헤더 옵션 설정)
    onInitHeader: function (header) {
        var control = widget.generator.control(),           //widget Control
            contents = widget.generator.contents(),         //widget Content
            toolbar = widget.generator.toolbar(),           //widget Toolbar
            form = widget.generator.form(),                 //widget Form
            res = ecount.resource;

        form.add(control.define('widget.input.codeName', 'txtGyeCode', 'GYE_CODE', res.LBL00495, null).value(this.GYE_CODE).end());         //계정코드
        form.add(control.define('widget.input.codeName', 'txtGyeDes', 'GYE_DES', res.LBL00479, null).value(this.GYE_DES).end());           //계정명
        form.add(control.define('widget.input.codeName', 'txtSearchMemo', 'SEARCH_MEMO', res.LBL00402, null).value(this.SEARCH_MEMO).end());   //검색창내용
        
        if (this.incomeFlag == "0") {
            form.add(control.define("widget.multiCode.gyeType", "rbGyeType", "GYE_TYPE", ecount.resource.LBL00703).end())

        } else {
            form.add(control.define("widget.combine.accountGyeTypeCode", "rbGyeType", "GYE_TYPE", ecount.resource.LBL00703).end());
        }

        form.add(control.define('widget.multiCode.inputGubun', 'txtInputGubun', 'INPUT_GUBUN', ecount.resource.LBL02266, null).end());

        form.add(control.define('widget.checkbox.whole', 'chkPyGyeGubun', 'PY_GYE_GUBUN', res.LBL08113)
            .label([res.LBL02475, res.LBL08976, res.LBL08104, res.LBL08105])
            .value(['', 'X', 'D', 'G'])
            .select('', 'X', 'D', 'G').end());

        form.add(control.define('widget.radio', 'chkCrDr', 'CR_DR', res.LBL03590)
               .label([res.LBL02475, res.LBL02704, res.LBL01018])
               .value(['DR' + ecount.delimiter + 'CR', 'DR', 'CR'])
               .select('DR' + ecount.delimiter + 'CR')
               .end());

        form.add(control.define("widget.checkbox", "chkWithParentYn", "WITH_PARENT_YN", res.LBL00865)
            .value(["Y"])
            .select(this.WITH_PARENT_YN)
            .label(res.LBL08394)
            .end());

        toolbar
            .setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true }) //중요 ignorePrimaryButton 확인
            .addLeft(control.define('widget.button', 'search').css('btn btn-sm btn-primary').label(res.BTN00113));

        contents.add(form).add(toolbar);

        var option = [];
        if (this.userPermit == "W") {
            // 전체삭제
            option.push({ id: "TotalDelete", label: ecount.resource.BTN00427 });
            // 기본값복원
            option.push({ id: "DefaultSettings", label: ecount.resource.BTN00141 });
        }

        // 자동생성설정
        option.push({ id: "SetAutoGenerate", label: ecount.resource.LBL14416 });

        // 기초,당기,기말설정
        option.push({ id: "BegCurrEnd", label: ecount.resource.BTN00561 });
        // 리스트설정
        option.push({ id: "ListSettings", label: ecount.resource.BTN00330 });
        // 검색창설정
        option.push({ id: "SearchTemplate", label: ecount.resource.BTN00169 });
        // 사용방법설정
        option.push({ id: "SelfCustomizing", label: ecount.resource.LBL01457 });

        header
            .useQuickSearch()
            .setTitle(res.LBL35390)
            .add('search', null, false) //중요 null, false 확인
            .add("option", option, false)
            .addContents(contents);
    },
    
    onInitContents: function (contents) {
        var g = widget.generator,
            grid = g.grid(),
            form = g.form();

        contents.add(form).addGrid("dataGrid", grid);
    },

    onChangeControl: function (control, data) {
        var self = this;

        if (this.incomeFlag == "0") {

            if (control.cid == "txtInputGubun" || control.cid == "rbGyeType_code" || control.cid == "chkPyGyeGubun") {
                if ((self.header.getControl('txtInputGubun').getSelectedItem().length == 6 || self.header.getControl('txtInputGubun').getSelectedItem().length == 0)
                    && (self.header.getControl('rbGyeType').getSelectedItem().length == 7 || self.header.getControl('rbGyeType').getSelectedItem().length == 0)
                    && (self.header.getControl('chkPyGyeGubun').getValue(0) == true)) {
                    self.header.getControl('chkWithParentYn').readOnly(false);
                    self.header.getControl('chkWithParentYn').setValue(true);
                } else {
                    self.header.getControl('chkWithParentYn').setValue(false);
                    self.header.getControl('chkWithParentYn').readOnly(true);
                }
            }
        }
        else {
            if (control.cid == "txtInputGubun" || control.cid == "rbGyeType_code" || control.cid == "chkPyGyeGubun") {
                if ((self.header.getControl('txtInputGubun').getSelectedItem().length == 6 || self.header.getControl('txtInputGubun').getSelectedItem().length == 0)
                    && (self.header.getControl('rbGyeType').get(1).getSelectedItem().length == 7 || self.header.getControl('rbGyeType').get(1).getSelectedItem().length == 0)
                    && (self.header.getControl('chkPyGyeGubun').getValue(0) == true)) {
                    self.header.getControl('chkWithParentYn').readOnly(false);
                    self.header.getControl('chkWithParentYn').setValue(true);
                } else {
                    self.header.getControl('chkWithParentYn').setValue(false);
                    self.header.getControl('chkWithParentYn').readOnly(true);
                }
            }
        }
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Change").label(ecount.resource.BTN00026).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                        .addGroup([
                            { id: "Deactivate", label: ecount.resource.BTN00204 },
                            { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                            { id: "Activate", label: ecount.resource.BTN00203 }
                        ]).css("btn btn-default")
                        .clickOnce());
        toolbar.addLeft(ctrl.define("widget.button.group", "Excel").label(ecount.resource.BTN00050)
               .addGroup([{ id: 'ExcelRemarks', label: ecount.resource.BTN00177 },
                          { id: 'ExcelDetails', label: ecount.resource.BTN00341 }])
                .css("btn btn-default").end());
        toolbar.addLeft(ctrl.define("widget.button", "WebUploader").label(ecount.resource.BTN00410));
        
        footer.add(toolbar);
    },
    
    onInitControl: function (cid, control) { },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //Popup initHandler
    onPopupHandler: function (control, config, handler) {
        config.isApplyDisplayFlag = true;
        config.isIncludeInactive = true;
        config.isCheckBoxDisplayFlag = true;

        handler(config);
    },

    //BeforeOpenPopup
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        handler(parameter);
    },

    //AfterOpenPopup
    onMessageHandler: function (page, message) {
        if (page.pageID == undefined && page == "DefaultSettings") {
            if (message.Data == "1") {
                ecount.alert(ecount.resource.MSG00075);
                return false;
            } else {
                ecount.alert(ecount.resource.MSG00564);
                this.listApiParameter.WITH_PARENT_YN = this.header.getControl('chkWithParentYn').getValue(0) == true ? "Y" : "N";
                if (this.header.getControl('chkCrDr').getValue(0) == true) this.listApiParameter.CR_DR = "";
                this.contents.getGrid("dataGrid").draw(this.listApiParameter);
            }
        } else {
            switch (page.pageID) {
                case "CM007P":
                    page.close();
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(true),
                        height: 750,
                        GYE_CODE: message.data.GYE_CODE,
                        EDIT_FLAG: "Copy"
                    };
                    this.openWindow({
                        url: '/ECERP/EBA/EBA002M',
                        name: ecount.resource.LBL03530,
                        param: param,
                        popupType: false,
                        additional: false
                    });
                    break;
                case "EBA001P_19":
                    return false;
                    break;
                case "EBA001P_20":
                    if (page.controlID == "txtInputGubun") {
                        if (message.data.length == 6 || message.data.length == 0) {
                            this.header.getControl('chkWithParentYn').readOnly(false);
                            this.header.getControl('chkWithParentYn').setValue(true);
                        } else {
                            this.header.getControl('chkWithParentYn').setValue(false);
                            this.header.getControl('chkWithParentYn').readOnly(true);
                        }
                    }
                    break;
                case "CM100P_02":
                    this.reloadPage(this);
                    break;
                case "EBD005P_05": //자동생성설정
                    message.callback && message.callback();
                    this.openInfoPopup();
                    break;
                case "EBD005P_09": //재집계 알림
                    message.callback && message.callback();
                    this.openUpdateBalancePopup();
                    break;
                default:
                    this.setReload();
                    break;
            }
        }
    },

    //onGridRenderBefore(그리드 처음로딩)
    onGridRenderBefore: function (gridId, settings) {
        this.listApiParameter = $.extend(this.listApiDefaultParameter, this.header.serialize().result);
        this.header.getQuickSearchControl().setValue(this.QUICKSEARCH_VALUE);
    },

    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setValue(this.listApiParameter.QUICKSEARCH_VALUE);
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    onInitGridInitalize: function (cid, option) {
        var thisObj = this;
        option
           .setRowData(this.viewBag.InitDatas.ListDeptLoad)
           .setRowDataUrl("/Account/Basic/GetListAcc002")
           .setFormData(this.formInfo)
           .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
           .setKeyColumn(['GYE_CODE'])
           .setCheckBoxUse(true)
           .setCheckBoxMaxCount(this.canCheckCount)
           .setCustomRowCell('CHK_H', this.setGridCheckbox.bind(this))
           .setColumnFixHeader(true)
           .setCheckBoxActiveRowStyle(true)
           .setCustomRowCell('GYE_NAME', this.setGridDataLink.bind(this))
           .setCustomRowCell('GROUP_YN', this.setGridDataGroupYn.bind(this))
           .setCustomRowCell('ACC.INPUT_GUBUN', this.setGridDataInputGubun.bind(this))

           //그리드를 트리형태로 설정
           .setStyleTreeGrid(true, 'GYE_NAME')
           //트리 확장 이벤트를 사용하지 않음
           .setStyleTreeEventDisable(false)
           ////트리 이벤트를 A 태그의 레이블에 덮어씌움
           //.setStyleTreeEventOnLabel(true)
           //상위계정포함(전체)
           .setStyleTreeHideOnNoChild(false)
           //최초 로드 시, 트리를 열어놓을 항목 지정
           .setStyleTreeOpenOnInit(true)
            //Shaded
           .setEventShadedColumnId(['GYE_NAME'], { isAllRememberShaded: true })
           //text-muted
           .setCheckBoxCallback({
                // 'change': function (e, data) {
                // thisObj.contents.getGrid().grid.setCheckWithChild(data['rowKey'], e.target.checked);
                // }
            });
    },

    /********************************************************************** 
   *  hotkey [f1~12, 방향키등.. ] 
   **********************************************************************/
    //F8키를 눌렀을 때
    ON_KEY_F8: function () {
        this.setReload();
    },

    //검색버튼이 동작했을 때
    ON_KEY_ENTER: function (e, target) {
        if (target != null && target.cid == 'search')
            this.setReload();
    },

    // F2 click
    ON_KEY_F2: function (e) {
        this.onFooterNew(e);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onLoadComplete: function (e) {
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }

        if (this.PY_GYE_GUBUN) {
            this.header.getControl('chkWithParentYn').setValue(false);
            this.header.getControl('chkWithParentYn').readOnly(true);
        }
        if (this.QUICKSEARCH_VALUE) {     // When calling
            this.header.getQuickSearchControl().setValue(this.QUICKSEARCH_VALUE);
        } 
        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 674
    },

    //마우스로 검색항목리스트에서 검색버튼 클릭 시
    onHeaderSearch: function () {
        this.contents.getGrid().grid.removeShadedColumn();
        this.header.getQuickSearchControl().setValue("");
        this.listApiParameter.QUICKSEARCH_VALUE = "";
        this.setReload();
    },

    //퀵서치검색어 입력 후 엔터를 눌렀을 때
    onHeaderQuickSearch: function (e) {
        this.contents.getGrid().grid.removeShadedColumn();
        this.setReload(e.keyword);
    },

    //onFocusOutHandler(Form 마지막항목에서 포커스 이동 시)
    onFocusOutHandler: function (event) {
        var buttonControl = this.header.getControl("search");
        buttonControl && buttonControl.setFocus(0);
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //전체삭제
    onDropdownTotalDelete: function (e) {
        var self = this;
        var popupParam = {
            width: 480,
            height: 250,
            isSendMsgAfterDelete: true,
            TABLES: 'ACC002',
            DEL_TYPE: 'Y',
            DELFLAG: 'Y',
            parentPageID: this.pageID,
            responseID: this.callbackID
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: ecount.resource.LBL00043,
            param: popupParam,
            additional: true
        });
    },

    //기본값복원
    onDropdownDefaultSettings: function (e) {
        var self = this;
        var popupParam = {
            width: 480,
            height: 250,
            isSendMsgAfterDelete: true,
            TABLES: 'ACC002_DELETE_INSERT',
            DEL_TYPE: 'N',
            DELFLAG: 'N',
            parentPageID: this.pageID,
            responseID: this.callbackID
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM021P',
            name: ecount.resource.LBL00055,
            param: popupParam,
            additional: true
        });
    },

    //자동생성설정
    onDropdownSetAutoGenerate: function () {
        var param = {
            POPUP_CD: 323
            , height: 520
            , width: 860
        };

        this.openWindow({
            url: "/ECERP/SVC/EBD/EBD005P_05",
            name: ecount.resource.LBL14416,
            param: param,
            fpopupID: this.ecPageID,
            popupType: false,
            additional: false
        });
    },

    //기초,당기,기말표시설정
    onDropdownBegCurrEnd: function (e) {
        var self = this;
        var popupParam = {
            width: 500,
            height: 600,
            FOREIGN_FLAG: "N",
            parentPageID: this.pageID,
            responseID: this.callbackID
        };
        this.openWindow({
            url: '/ECERP/EBA/EBA001P_08',
            name: ecount.resource.LBL08064,
            param: popupParam,
            additional: true
        });
    },

    //리스트 설정 팝업(Form Settings pop-up)
    onDropdownListSettings: function (e) {
        if (["W", "U"].contains(this.userPermit)) {
            var param = {
                width: 800,
                height: 700,
                FORM_TYPE: this.formTypeCode,
                FORM_SEQ: 1,
                isSaveAfterClose: true
            };
            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: ecount.resource.LBL01072,
                param: param,
                popupType: false,
                fpopupID: this.ecPageID
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },


    //검색창설정
    onDropdownSearchTemplate: function (e) {
        if (["W", "U"].contains(this.userPermit)) {
            var param = {
                width: 1020,
                height: 800,
                FORM_TYPE: "AP010",
                FORM_SEQ: 1,
                isSaveAfterClose: true
            }
            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_02",
                name: ecount.resource.BTN00169,
                param: param
            });

        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    // 사용방법설정 Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: 750,
            height: this.selfCustomizingHeight,
            PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/ESC/ESC002M',
            name: ecount.resource.LBL01457,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
        });
    },

    //신규
    onFooterNew: function (e) {
        var btnNew = this.footer.get(0).getControl("New");
        if (this.userPermit.equals("R")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnNew.setAllowClick();
            return false;
        }

        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 500,
            CALL_TYPE: '16',
            isTreeEventDisable: true,
            isPutWhenOneDataFlag: true
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM007P',
            name: ecount.resource.LBL00476,
            param: param,
            popupType: false,
            additional: false,
            popupID: this.ecPageID
        });

        btnNew.setAllowClick();
    },

    //변경
    onFooterChange: function (e) {
        var btnChange = this.footer.get(0).getControl("Change");
        var self = this;
        if (!this.userPermit.equals("W")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnChange.setAllowClick();
            return;
        }

        var finishList = this.contents.getGrid().grid.getChecked();
        if (finishList.length == 0) {
            ecount.alert(ecount.resource.MSG04752);
            btnChange.setAllowClick();
            return false;
        };

        var listsOfGyeCode = [];
        $.each(finishList, function (i, data) {
            listsOfGyeCode.push({
                GYE_CODE: data.GYE_CODE
            })
        });

        var params = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 600,
            dataOfGyeCode: Object.toJSON(listsOfGyeCode)
        };

        this.openWindow({
            url: '/ECERP/EBA/EBA001P_17',
            name: ecount.resource.LBL09678,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false,
        });
        btnChange.setAllowClick();
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var self = this;
        if (!this.userPermit.equals("W")) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }

        var selectItem = self.contents.getGrid('dataGrid').grid.getChecked().select(function (x) {
            return { 'GYE_CODE': x.GYE_CODE }
        });

        if (selectItem.length == 0) {
            ecount.alert(ecount.resource.MSG00705);
            btnDelete.setAllowClick();
            return false;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: '/Account/Basic/DeleteUpdateAcc002',
                    data: Object.toJSON({
                        DeleteDatas: selectItem,
                        EditFlag: "D"
                    }),
                    error: function (e) {
                        ecount.alert('선택삭제 처리 시 Error', function () {
                            this.hideProgressbar();
                        }.bind(this));
                    }.bind(this),
                    success: function (result) {
                        if (result.Data.length != 0) {

                            var _data = this.setDataCustom(result.Data);
                            var param = {
                                name: 'frmDetail',
                                width: 650,
                                height: 500,
                                Result_Datas: _data,
                                popupType: false,
                                additional: false
                            };

                            this.setTimeout(function () {
                                this.openWindow({
                                    url: '/ECERP/EBA/EBA001P_19',
                                    param: param
                                });
                            }.bind(this), 0)
                            btnDelete.setAllowClick();
                            this.hideProgressbar();
                        } else {
                            this.setReload(this.header.getQuickSearchControl().getValue());
                            this.hideProgressbar();
                        }
                    }.bind(this),
                    complete: function () {
                        //api 종료 전 page destroy 될 경우는 실행하지 않음.
                        if (!ecount.global.findPageInstance(this.ecPageID)) return;
                        btnDelete.setAllowClick();
                    }.bind(this)
                });
            } else {
                btnDelete.setAllowClick();
                this.hideProgressbar();
            }
        }.bind(this));
    },

    // Excel click event
    onFooterExcel: function () {

        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}-{2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
            ecount.alert(message);
            return false;
        }
        var self = this;
        var res = ecount.resource;
        self.listApiParameter.WITH_PARENT_YN = self.header.getControl('chkWithParentYn').getValue(0) == true ? "Y" : "N";
        if (this.header.getControl('chkCrDr').getValue(0) == true) this.listApiParameter.CR_DR = "";
        this.listApiParameter.GYE_TYPE = this.listApiParameter.GYE_TYPE_code;
        self.listApiParameter.GUBUN = "S";

        self.listApiParameter.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.EXPORT_EXCEL({
            url: "/Account/Basic/GetListAcc002ForExcel",
            param: self.listApiParameter
        });
    },

    //엑셀(적요)
    onButtonExcelRemarks: function () {
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}-{2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
            ecount.alert(message);
            return false;
        }
        var self = this;
        var res = ecount.resource;
        self.listApiParameter.WITH_PARENT_YN = self.header.getControl('chkWithParentYn').getValue(0) == true ? "Y" : "N";
        if (this.header.getControl('chkCrDr').getValue(0) == true) this.listApiParameter.CR_DR = "";
        this.listApiParameter.GYE_TYPE = this.listApiParameter.GYE_TYPE_code;
        self.listApiParameter.excelTitle = String.format("{0} : {1}", res.LBL03176, ecount.company.COM_DES);
        self.listApiParameter.Columns = [
            { propertyName: 'GYE_CODE', id: 'GYE_CODE', title: res.LBL00495, width: '100', align: 'left' },
            { propertyName: 'GYE_NAME', id: 'GYE_NAME', title: res.LBL00479, width: '200', align: 'left' },
            { propertyName: 'REMARKS_CD', id: 'REMARKS_CD', title: res.LBL03228, width: '100', align: 'left' },
            { propertyName: 'REMARKS_DES', id: 'REMARKS_DES', title: res.LBL04893, width: '200', align: 'left' }
        ];
        self.listApiParameter.GUBUN = "R";
        self.EXPORT_EXCEL({
            url: "/Account/Basic/GetListAcc002RemarksForExcel",
            param: self.listApiParameter
        });
    },

    //Excel(상세내역)
    onButtonExcelDetails: function () {
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}-{2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
            ecount.alert(message);
            return false;
        }
        var self = this;
        var res = ecount.resource;
        self.listApiParameter.WITH_PARENT_YN = self.header.getControl('chkWithParentYn').getValue(0) == true ? "Y" : "N";
        if (this.header.getControl('chkCrDr').getValue(0) == true) this.listApiParameter.CR_DR = "";
        this.listApiParameter.GYE_TYPE = this.listApiParameter.GYE_TYPE_code;
        self.listApiParameter.excelTitle = String.format("{0} : {1}", res.LBL03176, ecount.company.COM_DES);

        self.listApiParameter.Columns = [
            { propertyName: 'GYE_CODE', id: 'GYE_CODE', title: res.LBL00495, width: '100', align: 'left' }, //계정코드 
            { propertyName: 'GYE_DES', id: 'GYE_DES', title: res.LBL00479, width: '100', align: 'left' }, //계정명
            { propertyName: 'CR_DR', id: 'CR_DR', title: res.LBL03590, width: '100', align: 'left' }, //대차구분
            { propertyName: 'GYE_TYPE', id: 'GYE_TYPE', title: res.LBL07516, width: '100', align: 'left' }, //계정종류
            { propertyName: 'INPUT_GUBUN', id: 'INPUT_GUBUN', title: res.LBL02266, width: '100', align: 'left' }, //입력구분
            { propertyName: 'SUM_GUBUN', id: 'SUM_GUBUN', title: res.LBL06568, width: '100', align: 'left' }, //잔액집계구분
            { propertyName: 'PY_GYE_GUBUN', id: 'PY_GYE_GUBUN', title: res.LBL08113, width: '100', align: 'left' }, //평가계정구분
            { propertyName: 'APPLY_CODE', id: 'APPLY_CODE', title: res.LBL08107, width: '100', align: 'left' }, //평가계정 대상계정코드
            { propertyName: 'PY_GYE_SORT', id: 'PY_GYE_SORT', title: res.LBL08111, width: '100', align: 'left' }, //평가순서
            { propertyName: 'PY_GYE_BALANCE', id: 'PY_GYE_BALANCE', title: res.LBL08109, width: '100', align: 'left' }, //평가계정잔액
            { propertyName: 'GROUP_CODE', id: 'GROUP_CODE', title: res.LBL07520, width: '100', align: 'left' }, //재무재표상위계정
            { propertyName: 'GYE_CODE_LINK', id: 'GYE_CODE_LINK', title: res.LBL08085, width: '100', align: 'left' }, //재무제표하이퍼링크대상
            { propertyName: 'BS_PL_DES', id: 'BS_PL_DES', title: res.LBL07088, width: '100', align: 'left' }, //재무제표표시명1
            { propertyName: 'CHECK_FLAG', id: 'CHECK_FLAG', title: String.format("{0}{1}", res.LBL06575, res.LBL07102), width: '100', align: 'left' }, //재무제표금액굵기
            { propertyName: 'BRACKET', id: 'BRACKET', title: String.format("{0}{1}", res.LBL08094, res.LBL07102), width: '100', align: 'left' }, //재무제표금액괄호
            { propertyName: 'BS_PL_LEVEL', id: 'BS_PL_LEVEL', title: String.format("{0}{1}", res.LBL00114, res.LBL07102), width: '100', align: 'left' }, //재무제표금액순서
            { propertyName: 'BS_PL_GUBUN', id: 'BS_PL_GUBUN', title: String.format("{0}{1}", res.LBL06574, res.LBL07102), width: '100', align: 'left' }, //재무제표표시여부
            { propertyName: 'BS_PL_SORT', id: 'BS_PL_SORT', title: String.format("{0}{1}", res.LBL06577, res.LBL07102), width: '100', align: 'left' }, //재무제표표시순서
            { propertyName: 'BS_PL_POSITION', id: 'BS_PL_POSITION', title: String.format("{0}{1}", res.LBL06578, res.LBL07102), width: '100', align: 'left' }, //재무제표인쇄위치
            { propertyName: 'INEX_CODE', id: 'INEX_CODE', title: String.format("{0}{1}", res.LBL03547, res.LBL07102), width: '100', align: 'left' }, //수입지출코드
            { propertyName: 'BS_PL_DES2', id: 'BS_PL_DES2', title: res.LBL09416, width: '100', align: 'left' }, //재무제표표시명2
            { propertyName: 'CHECK_FLAG2', id: 'CHECK_FLAG2', title: res.LBL06583, width: '100', align: 'left' }, //재무제표금액굵기(국외용)            
            { propertyName: 'BRACKET2', id: 'BRACKET2', title: res.LBL08095, width: '100', align: 'left' }, //재무제표금액괄호(국외용)
            { propertyName: 'BS_PL_GUBUN2', id: 'BS_PL_GUBUN2', title: res.LBL08087, width: '100', align: 'left' }, //재무제표표시여부(국외용)
            { propertyName: 'BS_PL_SORT2', id: 'BS_PL_SORT2', title: res.LBL06585, width: '100', align: 'left' }, //재무제표표시순서(국외용)
            { propertyName: 'BS_PL_POSITION2', id: 'BS_PL_POSITION2', title: res.LBL08089, width: '100', align: 'left' }, //재무제표인쇄위치(국외용)
            { propertyName: 'SEARCH_MEMO', id: 'SEARCH_MEMO', title: res.LBL00402, width: '100', align: 'left' }, //검색창내용
            { propertyName: 'SE_NAME', id: 'SE_NAME', title: res.LBL35154, width: '100', align: 'left' }, //적요1
            { propertyName: 'GYE_DES2', id: 'GYE_DES2', title: res.LBL35155, width: '100', align: 'left' }, //적요2
            { propertyName: 'FUND_CODE', id: 'FUND_CODE', title: res.LBL00113, width: '100', align: 'left' }, //자금일보출력방법
            { propertyName: 'SHORT_CODE', id: 'SHORT_CODE', title: res.LBL06589, width: '100', align: 'left' }, //자금현황표 출력방법
            { propertyName: 'SHORT_SORT', id: 'SHORT_SORT', title: res.LBL13192, width: '100', align: 'left' }, //자금현황표 출력순서
            { propertyName: 'EST_GUBUN', id: 'EST_GUBUN', title: res.LBL06591, width: '100', align: 'left' }, //예산관리 여부
            { propertyName: 'INEX_GUBUN', id: 'INEX_GUBUN', title: res.LBL06592, width: '100', align: 'left' }, //예산관리 방법
            { propertyName: 'TB_GUBUN', id: 'TB_GUBUN', title: res.LBL06571, width: '100', align: 'left' }, //시산표 출력여부
            { propertyName: 'SUB_GUBUN', id: 'SUB_GUBUN', title: res.LBL03543, width: '100', align: 'left' }, //관련업무
            { propertyName: 'USE_BILL_YN', id: 'USE_BILL_YN', title: res.LBL05318, width: '100', align: 'left' }, //수표
            { propertyName: 'CANCEL', id: 'CANCEL', title: res.LBL01472, width: '100', align: 'left' }, //사용중단
            { propertyName: 'CASH_SORT', id: 'CASH_SORT', title: res.LBL13141, width: '100', align: 'left' },//Cash report print order
            { propertyName: 'FUND_SORT', id: 'FUND_SORT', title: res.LBL06590, width: '100', align: 'left' },//Funds statement print order
            { propertyName: 'TRIAL_BALANCE_SORT', id: 'TRIAL_BALANCE_SORT', title: res.LBL13142, width: '100', align: 'left' },//Trial balance print order
            { propertyName: 'ITEM_TYPE_CD', id: 'ITEM_TYPE_CD', title: res.LBL13115, width: '100', align: 'left' },//추가항목유형코드
            { propertyName: 'ITEM_TYPE_NM', id: 'ITEM_TYPE_NM', title: res.LBL13116, width: '100', align: 'left' },//추가항목유형명
        ];

        self.listApiParameter.GUBUN = "E";
        self.EXPORT_EXCEL({
            url: "/Account/Basic/GetListAcc002RemarksForExcel",
            param: self.listApiParameter
        });
    },

    //웹자료올리기
    onFooterWebUploader: function (e) {
        if (this.userPermit.equals("W") || this.userPermit.equals("U")) {
            var param = {
                width: 800,
                height: 600
            }

            this.openWindow({
                url: "/ECMAIN/EZB/EZB006M.aspx",
                name: 'EZB006M',
                param: param,
                popupType: true,
                fpopupID: this.ecPageID
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }
    },

    reloadPage: function () {
        if (this.listApiParameter.WITH_PARENT_YN[0] == "Y") {
            this.listApiParameter.WITH_PARENT_YN = "Y";
        } else {
            this.listApiParameter.WITH_PARENT_YN = "N";
        }
        // TODO: Set param for reload page
        this.onAllSubmit({
            url: "/ECERP/EBA/EBA001M",
            param: this.listApiParameter,
        });
    },

    setReload: function (quickSearchValue) {
        var _gridObject = this.contents.getGrid('dataGrid'),
            _quickSearchValue = quickSearchValue ? quickSearchValue : '';

        if (this.checkValidate()) {

            this.header.getQuickSearchControl().setValue(_quickSearchValue);
            setSerialize.call(this, _quickSearchValue);            
            this.Selected_Slip = '';    //전표음영처리 초기화

            this.listApiParameter.WITH_PARENT_YN = this.header.getControl('chkWithParentYn').getValue(0) == true ? "Y" : "N";
            if (this.header.getControl('chkPyGyeGubun').getValue(0) == true) this.listApiParameter.PY_GYE_GUBUN = "";
            if (this.header.getControl('chkCrDr').getValue(0) == true) this.listApiParameter.CR_DR = "";
            
            var rbGyeTypeValue = "";
            var checkRoot = "";

            if (this.incomeFlag == "0") {
                this.listApiParameter.GYE_TYPE = this.header.getControl('rbGyeType').serialize().value;
                this.listApiParameter.GYE_TYPE_code = this.header.getControl('rbGyeType').serialize().value;
                checkRoot = "";
            }
            else {
                this.listApiParameter.GYE_TYPE = this.listApiParameter.GYE_TYPE_code;
                rbGyeTypeValue = this.header.getControl('rbGyeType').get(0).getValue();

                if (rbGyeTypeValue != "") {
                    checkRoot = "1";
                }
            }

            if (checkRoot != "") {
                var hidSearchXml = String.format("<root><txtGyeCd><![CDATA[{0}]]></txtGyeCd><txtGyeNm><![CDATA[{1}]]></txtGyeNm><txtSearchMemo><![CDATA[{2}]]></txtSearchMemo><ddlGyeType><![CDATA[]]></ddlGyeType><ddlGyeType2><![CDATA[]]></ddlGyeType2><rbGyeGubun><![CDATA[{3}]]></rbGyeGubun><ddlInputGubun><![CDATA[]]></ddlInputGubun><ddlPyGyeGubun><![CDATA[]]></ddlPyGyeGubun><rbCrDr><![CDATA[{4}]]></rbCrDr><chkEtc><![CDATA[]]></chkEtc><btnSearch><![CDATA[검색(F8)]]></btnSearch><M_Page><![CDATA[0]]></M_Page><Sort><![CDATA[GYE_CODE]]></Sort><Sort_AD><![CDATA[ASC]]></Sort_AD></root>", this.header.getControl('txtGyeCode').getValue(), this.header.getControl('txtGyeDes').getValue(), this.header.getControl('txtSearchMemo').getValue(), rbGyeTypeValue, (this.header.getControl('chkCrDr').getValue(0) == true) ? "" : this.listApiParameter.CR_DR);
                var paramData = {
                    url: "/ECMAIN/EBA/EBA001M_01.aspx",
                    param: {
                        hidSearchXml: hidSearchXml, __ecPage__: null
                    }
                }
                this.onAllSubmitSelf(paramData);
            } else {
                _gridObject.draw(this.listApiParameter);
                this.header.toggle(true);
            }
        }

        //Serialize
        function setSerialize(quickSearchValue) {
            this.listApiDefaultParameter.QUICKSEARCH_VALUE = quickSearchValue;
            this.listApiParameter = $.extend(this.listApiDefaultParameter, this.header.serialize().result);
        }
    },


    //검색폼 Validate
    checkValidate: function () {
        var _validate = this.header.validate();

        if (_validate.result.length > 0) {
            this.header.toggleContents(true);
            return false;
        }

        return true;
    },


    //[계정코드]계정명
    setGridDataLink: function (value, rowItem) {
        var option = {};
        if (rowItem["GYE_CODE"] == "") {
            option.parentAttrs = {
                "class": "text-bold"
            };
            option.data = String.format("[{0}] {1}", "0000", ecount.resource.LBL08395);
        } else {
            var self = this;
            if (rowItem["INPUT_GUBUN"] != "Y") {
                option.parentAttrs = {
                    "class": "text-bold"
                };
                option.data = String.format("[{0}] {1}", rowItem["GYE_CODE"], value);
            } else {
                option.data = String.format("[{0}] {1}", rowItem["GYE_CODE"], value);
            }
            option.controlType = "widget.link";
            option.treeAttrs = {
                'class': ['text-uline-no', 'text-default']
            }
            option.event = {
                'click': function (e, data) {
                    self._ON_REDRAW();
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(true),
                        height: 750,
                        GYE_CODE: data.rowItem['GYE_CODE'],
                        EDIT_FLAG: "M"
                    };
                    this.openWindow({
                        url: '/ECERP/EBA/EBA002M',
                        name: ecount.resource.LBL03530,
                        param: param,
                        popupType: false,
                        additional: false
                    });
                    e.preventDefault();
                }.bind(this)
            }
        }

        return option;
    },

    setGridCheckbox: function (value, rowItem) {
        var option = {};
        if (rowItem["GYE_CODE"] == "") {
            option.controlType = "widget.empty";
        }
        return option;
    },

    //적요
    setGridDataGroupYn: function (value, rowItem) {
        var option = {};
        if (rowItem["INPUT_GUBUN"] == "Y" && rowItem["CANCEL"] == "N") {
            option.data = ecount.resource.BTN00009;
            option.controlType = "widget.link";
            var self = this;
            option.event = {
                'click': function (e, data) {
                    var param = {
                        width: 800,
                        height: 600,
                        GYE_CODE: data.rowItem['GYE_CODE']
                    };
                    this.openWindow({
                        url: '/ECERP/EBA/EBA023M',
                        name: ecount.resource.LBL00866,
                        param: param,
                        popupType: false,
                        fpopupID: this.ecPageID
                    });

                }.bind(this)
            }
        } else {
            option.data = "";
        }
        return option;
    },

    //계정추가
    setGridDataInputGubun: function (value, rowItem) {
        var option = {};
        if (rowItem["INPUT_GUBUN"] != "Y" || ((rowItem["GYE_CODE"] == "" || rowItem["GYE_CODE"] == "0000") && rowItem["GROUP_CODE"] == "0000")) {
            option.data = ecount.resource.BTN00263;
            option.controlType = "widget.link";
            var self = this;
            option.event = {
                'click': function (e, data) {

                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(true),
                        height: 750,
                        GYE_CODE: (data.rowItem['GYE_CODE'] == "") ? "0000" : data.rowItem['GYE_CODE'],
                        EDIT_FLAG: "Copy"
                    };
                    this.openWindow({
                        url: '/ECERP/EBA/EBA002M',
                        name: ecount.resource.LBL03530,
                        param: param,
                        popupType: false,
                        additional: false
                    });
                    e.preventDefault();
                }.bind(this)
            };
        } else {
            option.data = "";
        }
        return option;
    },

    setDataBind: function (result, isApi) {
        var closeflag = false;

        var mainDatasFiltered;
        mainDatasFiltered = result.where(function (item) {
            return item.INPUT_GUBUN == 'Y';
        });

        this.contents.getGrid("dataGrid").settings.setRowData(result);

        //트리
        var gridObj = this.contents.getGrid("dataGrid");
        gridObj.settings
            .setFormData(this.formInfo)
            //그리드를 트리형태로 설정
            .setStyleTreeGrid(true, 'GYE_NAME')
            //트리 확장 이벤트를 사용하지 않음
            .setStyleTreeEventDisable(false)
            ////트리 이벤트를 A 태그의 레이블에 덮어씌움
            //.setStyleTreeEventOnLabel(true)
            //상위계정포함(전체)
            .setStyleTreeHideOnNoChild(false)
            //최초 로드 시, 트리를 열어놓을 항목 지정
            .setStyleTreeOpenOnInit(true);


        //text-muted
        gridObj.settings.setCheckBoxCallback({
            // 'change': function (e, data) {
            // thisObj.contents.getGrid().grid.setCheckWithChild(data['rowKey'], e.target.checked);
            // }
        });

        this.contents.getGrid("dataGrid").draw();
        this.header.getQuickSearchControl().setFocus(0);

        closeflag = false;
    },

    //삭제불가 이력 Data 가공
    setDataCustom: function (_data) {
        var _result = [];

        _data.forEach(function (A) {
            var _customObject = {
                GYE_CODE: A.GYE_CODE,
                ERROR_MESSAGE: A.MSG
            };
            _result.push(_customObject);
        });

        return _result.toJSON();
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnChartAccount(this.getSelectedListforActivate("N"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnChartAccount(this.getSelectedListforActivate("Y"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                DeleteDatas: [{ 'GYE_CODE': data.GYE_CODE}],
                Cancel: cancelYN,
                EditFlag: "U"
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnChartAccount: function (updatedList) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }

        ecount.common.api({
            url: "/Account/Basic/UpdateListActiveChartAccount",
            data: Object.toJSON(updatedList),
            success: function (result) {
                if (result.Status != "200")
                    ecount.alert(result.fullErrorMsg + result.Data);
                else
                    this.contents.getGrid().draw(this.searchFormParameter);
            }.bind(this),
            complete: function (e) {
                //api 종료 전 page destroy 될 경우는 실행하지 않음.
                if (!ecount.global.findPageInstance(this.ecPageID)) return;
                btnDelete.setAllowClick();
            }.bind(this)
        });
    },

    //알림팝업 호출
    openInfoPopup: function () {
        var sendData = {
            Request: { Data: { } }
            , height: 220
            , width: 500
        };

        this.openWindow({
            url: "/ECERP/SVC/EBD/EBD005P_09",
            name: ecount.resource.LBL07973,
            param: sendData,
            fpopupID: this.ecPageID,
            popupType: false,
            additional: false
        });
    },

    //재집계 팝업 호출
    openUpdateBalancePopup: function () {
        var param = {
            requestKey: 'SUMMARYACCT_2'
            , height: 220
            , width: 550
        };

        this.openWindow({
            url: "/ECERP/ECM/SUMMARYACCT",
            name: ecount.resource.BTN00272,
            param: param,
            fpopupID: this.ecPageID,
            popupType: false,
            additional: false
        });
    },
});