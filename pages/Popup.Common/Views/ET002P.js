window.__define_resource && __define_resource("BTN00007","BTN00603","BTN00351");
/****************************************************************************************************
1. Create Date : 2018.06.07
2. Creator     : 백종인
3. Description : 소득자 검색
4. Precaution  : 
5. History     :	2021.02.18 (김동수) : A21_01092 - 검색창에 강조색 빼기_2차
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ET002P", {
    newItem: false,
    isFixedFooter: true,
    rowAddCnt: 0,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = {
            FLAG: (!$.isNull(this.FLAG)) ? this.FLAG : '',
            DEL_FLAG: (!$.isNull(this.DEL_FLAG)) ? this.DEL_FLAG : 'N',
            KEYWORD: (!$.isNull(this.KEYWORD)) ? this.KEYWORD : '',
            PARAM1: (!$.isNull(this.PARAM1)) ? this.PARAM1 : '',
            PARAM2: (!$.isNull(this.PARAM2)) ? this.PARAM2 : '',
            PARAM3: (!$.isNull(this.PARAM3)) ? this.PARAM3 : '',
            PARAM4: (!$.isNull(this.PARAM4)) ? this.PARAM4 : '',
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
        header.setTitle("소득자검색").useQuickSearch();
                
        //퀵서치 추가
        var g = widget.generator,
            toolbar = g.toolbar(),
            contents = g.contents(),
            ctrl = g.control();
        form = widget.generator.form();

        //검색창 하단 버튼
        toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
        //    .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label("검색(F8)"));
            
        //if (this.USE_OUT_FLAG != 'N')
        //    toolbar.addLeft(ctrl.define("widget.button", "outUser").label('사용중단포함'));
        toolbar.addLeft(ctrl.define("widget.button.group", "search")
            .label("검색(F8)")
        );

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007))

        form
            //성명
            .add(ctrl.define("widget.input", "PER_NAME", "PER_NAME", "성명")
            .end())

            //주민등록번호
            .add(ctrl.define("widget.input", "PER_NO", "PER_NO", "주민등록번호")
            .end())

            //상호
            .add(ctrl.define("widget.input", "VEN_DES", "VEN_DES", "상호")
            .end())

            //사업자등록번호
            .add(ctrl.define("widget.input", "VEN_NO", "VEN_NO", "사업자등록번호")
            .end())

        contents
            .add(form)
            .add(toolbar)
        ;

        header
            //.useQuickSearch()
            .add("search", null, false)
            .addContents(contents);
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
        var chkFlag = true;
        var lstCheck = ['ETG003M', 'ETG004R', 'ETG006M'];

        if (this.CHECK_FLAG == 'N')
            chkFlag = false;
        settings
            .setRowData(this.viewBag.InitDatas.DataList)
            .setRowDataUrl('/Account/Basic/GetListForSearchIncomeEarner')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['PER_NAME', 'PER_NO'])
            .setColumns([
                { propertyName: 'PER_NAME', id: 'PER_NAME', title: "성명", width: '150', align: 'center' },
                { propertyName: 'PER_NO', id: 'PER_NO', title: "주민번호", width: '', align: 'center' },
                { propertyName: 'VEN_DES', id: 'VEN_DES', title: "상호", width: '', align: 'center' },
                { propertyName: 'VEN_NO', id: 'VEN_NO', title: "사업자등록번호", width: '', align: 'center' },
            ])
            .setCheckBoxUse(chkFlag)
            .setCheckBoxCallback({                                                          //체크 박스 클릭시 발생 하는 이벤트(입력 화면에서 필요)
                'change': function (e, data) {
                    if (e.target.checked && !lstCheck.contains(this.getParentInstance().pageID)) {
                        var message = {
                            name: "PER_NAME",
                            code: "PER_NO",
                            data: data.rowItem,
                            addPosition: "current",
                            isAdded: this.isCheckBoxDisplayFlag,
                            rowIdx: Number(this.rowIdx) + this.rowAddCnt,
                            rowKey: Number(this.rowKey) + this.rowAddCnt,
                        };
                        this.sendMessage(this, message);
                        this.rowAddCnt++;
                    }
                }.bind(this)
            })
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')    //setRowBackgroundColor함수를 이용하여 해당하는 행의 배경색 설정
            .setCheckBoxHeaderStyle({
                'title': !lstCheck.contains(this.getParentInstance().pageID) ? '선택' : '',
                'visible': !lstCheck.contains(this.getParentInstance().pageID) ? false : true,
                'width': 35
            })
            .setCustomRowCell('PER_NAME', this.setGridDateLink.bind(this))
            .setCustomRowCell('PER_NO', this.setGridDateLink2.bind(this))
            //.setCustomRowCell('VEN_DES', this.setGridDateLink.bind(this))
            .setCustomRowCell('VEN_NO', function (value, rowItem) {
                var option = {};
                if (rowItem.VEN_NO != null) {
                    if (rowItem.VEN_NO.length == 10)
                        option.data = rowItem.VEN_NO.substring(0, 3) + "-" + rowItem.VEN_NO.substring(3, 5) + "-" + rowItem.VEN_NO.substring(5);
                    else
                        option.data = rowItem.VEN_NO;
                }

                return option;
            });
            
                
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        
        if (this.INPUT_FLAG == 'Y') {
			toolbar.addLeft(ctrl.define("widget.button", "new").label('신규(F2)'));
			toolbar.setOptions({ css: "btn btn-default", ignorePrimaryButton: true });
       }
        else {
			toolbar.addLeft(ctrl.define("widget.button", "apply").label('적용(F8)'));
        }
        
		toolbar.addLeft(ctrl.define("widget.button", "close").label('닫기'));
               
        footer.add(toolbar);
    },

    // Init Control
    onInitControl: function (cid, option) {
        
        switch (cid) {
            case "search":
                if (this.USE_OUT_FLAG != 'N') {
                    option.addGroup([{ id: 'outUser', label: "사용중단포함" }])
                }
                break;
            default:
                break;
        }
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        if (!$.isEmpty(this.KEYWORD)) {
            this.header.getQuickSearchControl().setValue(this.KEYWORD);
        }
        this.header.getQuickSearchControl().setFocus(0);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //grid row의 특정 date관련  
    setGridDateLink: function (value, rowItem) {
        var option = {};
        
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                
                var message = {
                    name: "PER_NAME",
                    code: "PER_NO",
                    data: data.rowItem,
                    addPosition: "current",
                    isAdded: this.isCheckBoxDisplayFlag,
                    rowIdx: this.rowIdx,
                    rowKey: this.rowKey,
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },

    setInputSendMessage: function (page, rowData, gOption) {
        
        //입력화면으로 내려줄 데이터
        //var ParentDataM = {
        //    PER_NAME: "",
        //    PER_NO: ""
        //}

        //this.ParentData = {
        //};

        //this.ParentData[page.pageID] = {};
        //this.ParentData[page.pageID].PER_NO = rowData.data.PER_NO;
        //this.ParentData[page.pageID].PER_NAME = rowData.data.PER_NAME;
        //this.ParentData[page.pageID].rowKey = this.rowKey;
        //this.ParentData[page.pageID].rowIdx = this.rowIdx;
        rowData.rowKey = this.rowKey;
        rowData.rowIdx = this.rowIdx;

        this.sendMessage(this, rowData);
        //return this.ParentData[page.pageID];
    },

    //grid row의 특정 date관련  
    setGridDateLink2: function (value, rowItem) {
        var option = {};
        
        if (value.length == 13)
            option.data = value.substring(0, 6) + "-" + value.substring(6);
        else
            option.data = value;

        //option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "PER_NAME",
                    code: "PER_NO",
                    data: data.rowItem,
                    addPosition: "current",
                    isAdded: this.isCheckBoxDisplayFlag,
                    rowIdx: this.rowIdx,
                    rowKey: this.rowKey,
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
        //if (data.dataCount === 1 && !this.isNewDisplayFlag) {

        var value = this.KEYWORD;
        if (!$.isEmpty(value))
            this.searchFormParameter.gridRenderFlag = "Y";

        if (data.dataCount === 1 && this.searchFormParameter.gridRenderFlag === "Y") {

            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "PER_NAME",
                code: "PER_NO",
                data: rowItem,
                isAdded: false,
                addPosition: "next",
                rowIdx: this.rowIdx,
                rowKey: this.rowKey,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
        this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
    },

    onHeaderSearch: function (event) {
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

    onFooterNew: function () {
        var params = {
            width: 800,
            height: 550,
            EditFlag: 'I',
        };

        this.openWindow({
            url: '/ECERP/ETG/ETG002M',
            name: '소득자등록',
            param: params,
            popupType: false,
            additional: false
        });
    },

    onFooterApply: function () {
        var selectedItem = this.contents.getGrid().getCheckedItem();
        var InsertLists = [];
        
        if (selectedItem.length == 0) {
            ecount.alert("검색할 소득자가 선택되지 않았습니다.");
            this.footer.getControl("apply") && this.footer.getControl("apply").setAllowClick();
            return false;
        }
        else {
            var Data = [];
            selectedItem.forEach(function (val) {
                Data.push({ PER_NO: val.PER_NO, PER_NAME: val.PER_NAME });
            });

            var message = {
                data: Data,
                code: "PER_NO",
                name: "PER_NAME",
                isAdded: true,
                rowIdx: this.rowIdx,
                rowKey: this.rowKey,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        }
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        var invalid = this.header.validate();

        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            return;
        }

        this.setSearchParam();
        this.searchFormParameter.gridRenderFlag = "Y";
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);        
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    onMessageHandler: function (event, data) {
        switch (event.pageID) {
            case "ETG002M":
                this.onContentsSearch(this.searchFormParameter);
                break;
        }
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/    
    // KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch();
        } else {
            this.onFooterApply();
        }
    },

    onHeaderQuickSearch: function (event) {
        this.setSearchParam();
        this.searchFormParameter.KEYWORD = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter.gridRenderFlag = "Y";
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    //사용중단버튼
    onHeaderOutUser: function (e) {
        if (this.searchFormParameter.DEL_FLAG == 'N') {
            this.searchFormParameter.DEL_FLAG = 'Y';
            this.header.getControl("outUser").changeLabel('사용중단미포함');
        }
        else {
            this.searchFormParameter.DEL_FLAG = 'N';
            this.header.getControl("outUser").changeLabel('사용중단포함');
        }
        
        this.onContentsSearch();
    },

    onButtonOutUser: function (event) {
        if (this.searchFormParameter.DEL_FLAG == "Y")
            this.searchFormParameter.DEL_FLAG = "N";
        else
            this.searchFormParameter.DEL_FLAG = "Y";

        this.onContentsSearch('button');
    },

    onHeaderReset: function (event) {
        this.header.reset();
        this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
    },

    setSearchParam: function () {
        var self = this;
        var tempSearchParam = self.header.serialize().result;
        
        this.searchFormParameter.PARAM1 = tempSearchParam.PER_NAME;
        this.searchFormParameter.PARAM2 = tempSearchParam.PER_NO;
        this.searchFormParameter.PARAM3 = tempSearchParam.VEN_DES;
        this.searchFormParameter.PARAM4 = tempSearchParam.VEN_NO;

        var btnSearch = this.header.getControl("search");
        if (this.USE_OUT_FLAG != 'N') {
            if (this.searchFormParameter.DEL_FLAG == "Y") {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00603);
                btnSearch.removeGroupItem("outUser");
                btnSearch.addGroupItem([{ id: "outUser", label: "사용중단미포함" }]);
            }
            else {
                //this.header.getControl("usegubun").changeLabel(ecount.resource.BTN00351);
                btnSearch.removeGroupItem("outUser");
                btnSearch.addGroupItem([{ id: "outUser", label: "사용중단포함" }]);
            }
        }
    },

    // Suspension Change colors row     배경색 보여줄 데이터
    setRowBackgroundColor: function (data) {
        if (data['USE_YN'] != "Y") {
            return true;
        }
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
