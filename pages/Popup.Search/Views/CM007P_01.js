window.__define_resource && __define_resource("LBL08061","LBL08062","LBL00496","BTN00291","BTN00141","BTN00113","BTN00351","LBL00495","LBL00478","LBL00402","LBL03552","LBL03553","LBL03554","LBL01826","LBL08097","LBL03557","LBL02739","LBL02740","LBL05746","LBL02478","BTN00069","BTN00008","BTN00603","BTN00169","MSG00141","MSG02479","MSG00962");
/****************************************************************************************************
1. Create Date : 2017.09.19
2. Creator     : Le Phuoc Hao
3. Description : 계정팝업
4. Precaution  : 
5. History     : 2019.08.08 (김선모) - isGraph => isViewNoChildParent로 변경
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM007P_01", {

    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체)
    **********************************************************************/

    off_key_esc: true,

    //폼정보
    formInfo: null,
    //계정검색창 조회방식(S:계정별/A:상위계정포함(전체)/P:상위계정포함(직전)
    searchMethod: null,
    //계정검색창 펼침방식(E:모든계정펼침/P:상위계정만펼침/C:모든계정닫힘)
    expandMethod: null,
    //계정검색창 상위계정기준(F:재무제표기준/O:수입지출명세서기준)
    PARENT_TYPE: null,

    //검색된 상태여부
    isSearched: false,

    /**********************************************************************
    * page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = { CALL_TYPE: "0", GYE_CODE: "", BUSINESS_NO: "", PARAM: this.keyword, PARAM2: this.keyword2, PARAM3: this.keyword3, PARAM4: this.keyword4, EACHUSE_YN: "", SEARCH_TYPE: "", isTopTen: false, TRX_TYPE: "", CUST_CD: "", SER_NO: "", TYPE: "", PAGE_FLAG: "", BS_PL_GUBUN: "", MODE: "", EACHUSE_YN: "", isSpecialCase: false, isViewNoChildParent: false, PARENT_TYPE : null };
        this.formInfo = this.viewBag.FormInfos.AP010;
        this.searchMethod = "A";
        this.expandMethod = "E";
    },

    render: function () {
        this.setLayout(this.formInfo);
        this._super.render.apply(this);
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
    **********************************************************************/
    //Header Setting
    onInitHeader: function (header, resource) {
        
        header.notUsedBookmark();
        if (this.PAGE_FLAG == "1")
            header.setTitle(ecount.resource.LBL08061).useQuickSearch();
        else if (this.PAGE_FLAG == "2")
            header.setTitle(ecount.resource.LBL08062).useQuickSearch();
        else
            header.setTitle(ecount.resource.LBL00496).useQuickSearch();
        
        header.add("search");
        if (this.PAGE_FLAG == "") {
            header.add("option", [
                    { id: "searchTemplate", label: ecount.resource.BTN00291 }
            ])
        } else {
            header.add("option", [
                    { id: "searchTemplate", label: ecount.resource.BTN00291 },                    
                    { id: "restoreDefault", label: ecount.resource.BTN00141 }
            ])
        }

        var contents = widget.generator.contents(),
        tabContents = widget.generator.tabContents(),
        form1 = widget.generator.form(),
        form2 = widget.generator.form(),
        toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))

        if (this.isIncludeInactive) {
            toolbar.addLeft(ctrl.define("widget.button", "usegubun").label(ecount.resource.BTN00351).value("Y"));  //포함            
        }

        //코드, 코드명 검색어
        form1.add(ctrl.define("widget.input.codeName", "GYE_CODE", "GYE_CODE", ecount.resource.LBL00495).end()) //거래처코드
            .add(ctrl.define("widget.input.codeName", "GYE_DES", "GYE_DES", ecount.resource.LBL00478).end())   //거래처명
            .add(ctrl.define("widget.input.codeName", "SEARCH_MEMO", "SEARCH_MEMO", ecount.resource.LBL00402).end());   //업태

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.addContents(contents);
         
    },

    //Contents Setting
    onInitContents: function (contents, resource, formData) {
        
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid1 = generator.grid();
        grid2 = generator.grid();
        var thisObj = this;

        var formInfo = {
            FormType: "AP010",// 양식구분            
            FormSeq: 1,// 양식순번,
            ExtendedCondition: {}
        };

        grid1       
       .setFormParameter(formInfo)
       .setKeyColumn(['GYE_CODE'])
       .setEventFocusOnInit(true)                  //Focus 이벤트 시작
       .setKeyboardCursorMove(true, this.setGridMoveCusor.bind(this))                // 위, 아래 방향키
       .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
       .setKeyboardEnterForExecute(true)
       .setKeyboardPageMove(true)                  // 페이징 이동
       .setColumnSortable(false)
       .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
       .setCustomRowCell('GYE_NAME', this.setGridDataLink.bind(this))
       .setCustomRowCell('CHILDREN.INEX_DV_CD', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.GYE_TYPE', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.SUB_GUBUN', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.INPUT_GUBUN', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.GYE_CODE_LINK', this.setGridDataFromResource.bind(this));

        grid2
        .setFormParameter(formInfo)
       .setKeyColumn(['GYE_CODE'])
       .setEventFocusOnInit(true)                  //Focus 이벤트 시작
       .setKeyboardCursorMove(true, this.setGridMoveCusor.bind(this))                // 위, 아래 방향키
       .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
       .setKeyboardEnterForExecute(true)
       .setKeyboardPageMove(true)                  // 페이징 이동
       .setColumnSortable(false)
       .setCheckBoxUse(false)
       .setCheckBoxActiveRowStyle(true);
                
        grid2.setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
       .setCustomRowCell('GYE_NAME', this.setGridDataLink.bind(this))
       .setCustomRowCell('CHILDREN.INEX_DV_CD', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.GYE_TYPE', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.SUB_GUBUN', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.INPUT_GUBUN', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('CHILDREN.GYE_CODE_LINK', this.setGridDataFromResource.bind(this))
       .setCustomRowCell('PAGE_FLAG', function (value, rowItem) {

           var option = {};
           if (thisObj.PAGE_FLAG == "1") {
               switch (rowItem.SUB_GUBUN) {
                   case "00":
                       option.data = ecount.resource.LBL03552;
                       break;
                   case "01":
                       option.data = ecount.resource.LBL03553;
                       break;
                   case "02":
                       option.data = ecount.resource.LBL03554;
                       break;
                   case "03":
                       strType = ecount.resource.LBL01826;
                       break;
                   case "32":
                       option.data = ecount.resource.LBL08097;
                       break;
                   case "31":
                       option.data = ecount.resource.LBL03557;
                       break;
                   default:
                       option.data = ecount.resource.LBL03552;
                       break;
               }
           } else if (thisObj.PAGE_FLAG == "2") {
               switch (rowItem.BD_GUBUN) {
                   case "0":
                       option.data = ecount.resource.LBL03552;
                       break;
                   case "1":
                       option.data = ecount.resource.LBL02739;
                       break;
                   case "2":
                       strType = ecount.resource.LBL02740;
                       option.data;
                   default:
                       option.data = ecount.resource.LBL03552;
                       break;
               }
           }
           return option;
       })

        contents.add(toolbar);
        if (this.isTopTen) {
            contents.add(ctrl.define("widget.label").label("<div class=\"wrapper-sub-title\">" + ecount.resource.LBL05746.unescapeHTML() + "</div>").useHTML())
                .addGrid("dataGrid1" + this.pageID, grid1)
                .add(ctrl.define("widget.label").label("<div class=\"wrapper-sub-title\">" + ecount.resource.LBL02478.unescapeHTML() + "</div>").useHTML());
        }
        contents.addGrid("dataGrid2" + this.pageID, grid2);

    },
    // Footer Setting
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        if (this.isApplyDisplayFlag) toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]))
        footer.add(toolbar);
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
    **********************************************************************/
    // 페이지 로드 완료 이벤트(Completion event page load)
    onLoadComplete: function (e) {
        if (!$.isNull(this.keyword)) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }
        if (this.isTopTen) {
            this.contents.getGrid("dataGrid1" + this.pageID).settings.setHeaderTopMargin(this.header.height());
        }
        this.contents.getGrid("dataGrid2" + this.pageID).settings.setHeaderTopMargin(this.header.height());
        var closeflag = this.setDataBind(this.viewBag.InitDatas.AccountCodeData);
        if (!e.unfocus && closeflag == false) {
            this.header.getQuickSearchControl().setFocus(0);
        }

    },
    // 그리드 로드 완료 이벤트(Completion event Grid load)
    onGridRenderComplete: function (e, data, gridObj) {
        this.isSearched = true;
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
            if (this.isTopTen)
                this.contents.getGrid("dataGrid1" + this.pageID).grid.focus();
            else
                this.contents.getGrid("dataGrid2" + this.pageID).grid.focus();
        }
    },
    setGridMoveCusor: function (direction) {
        var nextFocusGridId = "";
        var option = {};

        var gridID = this.contents.getGrid("dataGrid1" + this.pageID) && this.contents.getGrid("dataGrid1" + this.pageID).grid.getGridId() || null;
        switch (ecount.runtime.getActivateGrid().activeId) {
            case gridID:
                nextFocusGridId = "dataGrid2" + this.pageID;
                option = { preventDefault: true, direction: direction };
                break;
            default:
                nextFocusGridId = "dataGrid1" + this.pageID;
                option = { direction: direction };
                break;
        }

        var grid = this.contents.getGrid(nextFocusGridId) && this.contents.getGrid(nextFocusGridId).grid;

        if ($.isEmpty(grid) == false) {
            grid.focus(option);
        }

        return (this.isTopTen) ? false : true;
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

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {

        if (data['INPUT_GUBUN'] == "Y" && data['CANCEL'] == "Y")
            return true;
    },
    /**********************************************************************
    * event grid listener [click, change...] (grid에서 발생, 사용하는 이벤트)
    **********************************************************************/

    // 리소스로 결과 보내주는 컬럼 데이터 세팅
    setGridDataFromResource: function (value, rowItem) {
        return { data: ecount.resource[value] || value }
    },

    // 계정코드 클릭
    setGridDataLink: function (value, rowItem) {
        
        var option = {};
        var self = this;
        option.data = String.format("[{0}] {1}", rowItem.GYE_CODE, rowItem.GYE_DES);
     
        var self = this;
        if (rowItem["INPUT_GUBUN"] != "Y") {
            option.controlType = "widget.link";
            if (this.CALL_TYPE == "0") {
                option.data = String.format("<span style='font-weight:bolder;padding-left:4px;'>[{0}] {1}</span>", rowItem.GYE_CODE, rowItem.GYE_DES);
            } else {
                option.data = String.format("[{0}] {1}", rowItem.GYE_CODE, rowItem.GYE_DES);
            }
        } else {
            option.data = String.format("[{0}] {1}", rowItem.GYE_CODE, rowItem.GYE_DES);
        }     

        option.treeAttrs = {
            'class': ['text-uline-no', 'text-default']
        }

        option.event = {
            'click': function (e, data) {
        
                e.preventDefault();
                if (this.PAGE_FLAG == "") {
                    var message = {
                        name: "GYE_DES",
                        code: "GYE_CODE",
                        data: data.rowItem,
                        isAdded: false,
                        addPosition: "current",
                        callback: this.close.bind(this)
                    };
                    this.sendMessage(this, message);
                } else {
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 190,
                        popupType: true,//필수값
                        responseID: this.callbackID, //필수값
                        GYE_CODE: data.rowItem.GYE_CODE,
                        PAGE_FLAG: this.PAGE_FLAG,
                    };
                    //모달로 띄우기
                    this.openWindow({
                        url: '/ECERP/EBA/EBA001P_10',
                        name: this.viewBag.Title,
                        param: param,
                        //popupType: false,
                        additional: false
                    });
                }
            }.bind(this)
        }
        return option;
    },

    /**********************************************************************
    * event  [button, link, FN, optiondoropdown..]
    **********************************************************************/

    setDataBind: function (result, isApi) {
        
        var closeflag = false;
        //집계계정만 필터링 데이터 (level 0 : search 조건 적용된 데이터, INPUT_GUBUN != "Y" : 전표입력계정제외)
        var mainDatasFiltered;
        if (this.isPutWhenOneDataFlag == true && result.Data.MainDatas != null) {
            mainDatasFiltered = result.Data.MainDatas.where(function (item) {
                return item.LEVEL == 0 && item.INPUT_GUBUN != "Y";
            });
        }

        //데이터 한건일 때        
        if (this.isPutWhenOneDataFlag == true && mainDatasFiltered != null && mainDatasFiltered.length == 1){
            if (isApi != null && isApi == true) {
                var message = {
                    name: "GYE_DES",
                    code: "GYE_CODE",
                    data: mainDatasFiltered[0],
                    isAdded: false,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);                
            } else {
                var message = {
                    name: "GYE_DES",
                    code: "GYE_CODE",
                    data: mainDatasFiltered[0],
                    isAdded: false,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }
            closeflag = true;
        } else {
            if (this.isTopTen) {
                this.contents.getGrid("dataGrid1" + this.pageID).settings.setFormData(this.formInfo).setRowData(result.Data.TopTenDatas);
                this.contents.getGrid("dataGrid1" + this.pageID).draw();
            }
            
            this.contents.getGrid("dataGrid2" + this.pageID).settings.setRowData(result.Data.MainDatas);
            if (this.isSpecialCase == true || this.searchMethod == "S") {
                //트리아님
                this.contents.getGrid("dataGrid2" + this.pageID).settings.setStyleTreeGrid(false, 'GYE_NAME');
            } else {
                //트리
                var gridObj = this.contents.getGrid("dataGrid2" + this.pageID);
                gridObj.settings
					.setFormData(this.formInfo)
                    //그리드를 트리형태로 설정
                    .setStyleTreeGrid(true, 'GYE_NAME')
                    //트리 확장 이벤트를 사용하지 않음                    
                    .setStyleTreeEventDisable(false)
                    //트리 이벤트를 A 태그의 레이블에 덮어씌움
                    .setStyleTreeEventOnLabel(false);

                //상위계정포함(직전)
                if (this.searchMethod == "P")
                    gridObj.settings.setStyleTreeHideOnNoChild(true);
                else
                    gridObj.settings.setStyleTreeHideOnNoChild(false);

                ////최초 로드 시, 트리를 열어놓을 항목 지정
                if (this.expandMethod == "E")
                    //모든계정펼침
                    gridObj.settings.setStyleTreeOpenOnInit(true);
                else if (this.expandMethod == "P")
                    //상위계정만 펼침
                    gridObj.settings.setStyleTreeOpenOnInit("upper");
                else
                    //모든계정 닫힘
                    gridObj.settings.setStyleTreeOpenOnInit(false);
            }
            this.contents.getGrid("dataGrid2" + this.pageID).draw();
            this.header.getQuickSearchControl().setFocus(0);

            closeflag = false;
        }
    },

    // 검색 이벤트(Search event)
    onContentsSearch: function (event) {

        var invalid = this.header.getQuickSearchControl().validate();
        var value2 = "";
        var value3 = "";
        var value4 = "";

        //if (this.isIncludeInactive) {
            value2 = this.header.getControl("GYE_CODE").getValue();      //코드
            value3 = this.header.getControl("GYE_DES").getValue();      //코드명
            value4 = this.header.getControl("SEARCH_MEMO").getValue();  //검색어
        //}
        if (invalid.length > 0) {         
            this.header.getQuickSearchControl().setFocus(0);
            return;
        }
        
        var value = this.header.getQuickSearchControl().getValue()//.keyword;

        this.searchFormParameter.PARAM = value;
        if (!$.isEmpty(value2) || !$.isEmpty(value3) || !$.isEmpty(value4)) {
            this.isOnePopupClose = true;
            this.searchFormParameter.PARAM = "";
            this.header.getQuickSearchControl().setValue("");
        }

        this.searchFormParameter.CALL_TYPE = this.CALL_TYPE;
        this.searchFormParameter.GYE_CODE = this.GYE_CODE;
        this.searchFormParameter.BUSINESS_NO = this.BUSINESS_NO;

        this.searchFormParameter.PARAM2 = value2;
        this.searchFormParameter.PARAM3 = value3;
        this.searchFormParameter.PARAM4 = value4;

        this.searchFormParameter.SORT_COLUMN = "";
        this.searchFormParameter.SORT_TYPE = "";
        this.searchFormParameter.PAGE_SIZE = "0"
        this.searchFormParameter.PAGE_CURRENT = "0"

        this.searchFormParameter.SEARCH_TYPE = "9";//value == "" ? "9" : this.contents.getControl("search").getValue().category;
        this.searchFormParameter.TRX_TYPE = this.TRX_TYPE;
        this.searchFormParameter.SER_NO = this.SER_NO;

        this.searchFormParameter.CUST_CD = this.CUST_CD;
        this.searchFormParameter.TYPE = this.TYPE;
        this.searchFormParameter.PAGE_FLAG = this.PAGE_FLAG;
        this.searchFormParameter.BS_PL_GUBUN = this.BS_PL_GUBUN;
        this.searchFormParameter.MODE = this.MODE;
        this.searchFormParameter.EACHUSE_YN = this.EACHUSE_YN;

        this.searchFormParameter.isTopTen = this.isTopTen;
        this.searchFormParameter.isSpecialCase = this.isSpecialCase;
        this.searchFormParameter.isViewNoChildParent = this.isViewNoChildParent;
        this.searchFormParameter.PARENT_TYPE = this.PARENT_TYPE;
        if (this.isIncludeInactive) {
            if (!$.isNull(event) && this.searchFormParameter.DEL_FLAG == "Y") {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
            }
            else {
                this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
            }
        }

        if (this.isTopTen) {
            this.contents.getGrid("dataGrid1" + this.pageID).grid.settings().setCheckBoxClearChecked();
        }
        var self = this;
        //테이블이 여러개 이므로 데이터 별도로 호출해야 함.
        ecount.common.api({
            url: "/Common/Form/GetFormView",
            data: Object.toJSON({
                FormType: "AP010",// 양식구분            
                FormSeq: 1,// 양식순번,
                ExtendedCondition: {}
            }),
            success: function (res) {
                var columnForm = res.Data;
                self.searchMethod = "A";
                self.expandMethod = "E";
                self.formInfo = columnForm;
                ecount.common.api({
                    url: "/Account/Basic/GetListAccountCodeForSearch",
                    data: Object.toJSON(self.searchFormParameter),
                    success: function (result) {
                        console.log(result);
                        if (result.Status != "200") {
                            runSuccessFunc = result.Status == "202";
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            runSuccessFunc = true;

                            if (result.Data.ERR_FLAG != null && result.Data.ERR_FLAG == "Y")
                                ecount.alert(result.Data.ERR_MSG);
                            else {
                                this.setDataBind(result, true);
                            }
                        }
                    }.bind(self)
                });
            }
        });

        this.header.toggle(true);
    },
    
    // 닫기 버튼 이벤트(CLOSE button to event)
    onFooterClose: function () {
        this.close();
    },

    //부모 페이지에서 검색시
    onMessageHandler: function (page, message) {
        switch (page.pageID) {
            case "EBA001P_10":
                this.onContentsSearch();
                break;
            case "CM100P_01_CM3":
                setTimeout(function () {
                    message.callback && message.callback();
                }, 0);
                break;
            case "CM100P_02":
                if (this.isSearched) {
                    this.onContentsSearch('button');
                }

                setTimeout(function () {
                    message.callback && message.callback();
                }, 0);
                break;
        }
    },

    // 검색 항목 설정
    onDropdownSearchTemplate: function () {
        if (this.viewBag.Permission.ChartOfAccounts.Value == "W") {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(),
                height: 450,
                FORM_TYPE: "AS020"
            };
            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_01_CM3",
                name: ecount.resource.BTN00169,
                param: param
            });
        }
        else {
            ecount.alert(ecount.resource.MSG00141);
            return false;
        }
    },
   
    //기본값
    onDropdownRestoreDefault: function () {
        var thisObj = this;
        ecount.confirm(ecount.resource.MSG02479, function (status) {

            if (status === true) {
                var formData = {
                    GUBUN: thisObj.PAGE_FLAG
                };
                ecount.common.api({
                    url: "/Account/Basic/UpdateAccountCodeForRestore",
                    async: true,
                    data: Object.toJSON(formData),
                    success: function (result) {
                        if (result.Status != "200") {
                            runSuccessFunc = result.Status == "202";
                            ecount.alert(result.fullErrorMsg);
                        }
                        else {
                            runSuccessFunc = true;

                            //재검색
                            thisObj.header.getQuickSearchControl().setValue("");
                            thisObj.onContentsSearch();

                            return false;

                        }
                    }.bind(this)
                });
            }
        });
    },


    /**********************************************************************
    *  hotkey [f1~12, 방향키등.. ]
    **********************************************************************/
    // F8 
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
            return
        }
        var selectedItem = this.contents.getGrid("dataGrid2" + this.pageID).grid.getChecked();
        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }
        var message = {
            name: "GYE_DES",
            code: "GYE_CODE",
            data: selectedItem,
            isAdded: false,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },
    // F2
    ON_KEY_F2: function () {

    },
    // ESC
    ON_KEY_ESC: function () {
        this.close();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target))
            this.onContentsSearch(target.control.getValue());
    },

    //KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },

    //KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },

    //KEY_Mouseup
    onMouseupHandler: function () {
        this.gridFocus = function () {
            if (this.isTopTen)
                this.contents.getGrid("dataGrid1" + this.pageID).grid.focus();
            else
                this.contents.getGrid("dataGrid2" + this.pageID).grid.focus();

            this.gridFocus = null;
        }.bind(this);
    },

    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.PARAM = event.keyword;
        if (!$.isEmpty(this.searchFormParameter.PARAM)) {
            this.isOnePopupClose = true;
        }

        this.onContentsSearch();
    },
    /**********************************************************************
    * user function
    **********************************************************************/

    //그리드 포커드 함수
    gridFocus: function () { },
});

