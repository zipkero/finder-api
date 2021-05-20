window.__define_resource && __define_resource("LBL08499","LBL08491","LBL11536","LBL02001","LBL08529","LBL08530","LBL10749","MSG00959","MSG10556","BTN00004","LBL03780","LBL04041","MSG01136","BTN00070","BTN00008","MSG00205","MSG03839");
/****************************************************************************************************
1. Create Date : 2015.09.24
2. Creator     : 박현민
3. Description : 우편번호검색
4. Precaution  : 
5. History     : 2018.09.20(이용희) - 그리드 키 변경
               : 2019.01.03 Ngọc Hân A18_04272 - FE 리팩토링_페이지 일괄작업 (Remove $el at function setGridZipCodeLink, onContentsAdvanceSearch)
               : 2021.02.22 (Ho Thanh Phu) A21_01063 - 우편번호검색 쉽게 하도록
   MenuPath    : 재고1 > 기초등록 > 거래처등록 > 거래처 팝업 > 우편번호검색
6. Old File    : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM004P", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    height: 544,
    tabId: "simple",
    advancedKeyword: "",
    simpleKeyword: "",
    isFirstTimeSearch: true,
    onlyRoadname: false,
    rowItem: null,
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            PARAM: this.keyword,
            SIDO: "",
            GUGUN: "",
            PAGE_SIZE: 100,
            PAGE_CURRENT: 1
        };
        this.initProperties();
    },

    initProperties: function () {
       
        // 도로명 분기처리
        if (this.isOnlyRoadname != null) this.onlyRoadname = this.isOnlyRoadname;
    },

    render: function () {

        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header) {
        var title = this.Type == "ACC328" ? ecount.resource.LBL08499 : (this.Type == "ACC315" ? ecount.resource.LBL08491 : ecount.resource.LBL11536);
        header.notUsedBookmark();
        header.setTitle(title);
    },

    // 도로명 주소만 필요한 상황이 생겨 JIBUN 에 isHideColumn로 분기 처리 했습니다.
    //onInitContents(본문 옵션 설정)
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            ctrl2 = generator.control(),
            settings = generator.grid(), frm = generator.form();
        columns = [
            { propertyName: 'ZIPCODE', id: 'ZIPCODE', title: ecount.resource.LBL02001, width: '100', align: 'center', mrowspan: 2 },
            { propertyName: 'ADDR', id: 'ADDR', title: ecount.resource.LBL08529, width: '' },
            { propertyName: 'JIBUN', id: 'JIBUN', title: ecount.resource.LBL08530, width: '', linechange: true, isHideColumn: this.onlyRoadname },

        ];

        var loaddata = {
            ZIPCODE: null,
            ADDR: null,
            JIBUN: null
        };
        var optionData = [];
        var selectedValue = this.CUST + "";
        settings
            .setRowData(loaddata)
            .setRowDataUrl('/Common/Infra/GetListCityComnBySearch')
            .setRowDataParameter(this.searchFormParameter)
            .setColumns(columns)
            .setKeyColumn(['SEQ'])
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setPagingUse(true)
            .setColumnFixHeader(false)
            .setHeaderFix(false)
            .setColumnSortable(false)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setEventFocusOnInit(true) //Focus 이벤트 시작
            .setKeyboardCursorMove(true) // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true) // 스페이스로 선택
            .setKeyboardPageMove(true) // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true)
            .setCustomRowCell('ZIPCODE', this.setGridZipCodeLink.bind(this))
            .setCustomRowCell('ADDR', this.setGridAddrLink.bind(this))
            .setCustomRowCell('JIBUN', this.setGridAddrLinkJIBUN.bind(this));

        toolbar.wholeRow().attach(ctrl.define("widget.custom", "CustomSearch", "CustomSearch", ecount.resource.LBL10749).columns(3, 3, 6)
            .addControl(ctrl2.define("widget.searchGroup", "advanceSearch", "advanceSearch", ecount.resource.MSG00959).setPlaceHolder(ecount.resource.MSG10556)
                .dataRules([{ "minlength": 2 }], "검색어를 2글자이상으로 입력해 주십시오.")
                .maxLength(20)
                .setOptions({ label: ecount.resource.BTN00004 })
            ));

        frm.template("register")
            .add(ctrl.define("widget.label", "zipcode", "zipcode", ecount.resource.LBL02001).option(optionData).select(selectedValue).end())
            .add(ctrl.define("widget.label", "address", "address", ecount.resource.LBL03780).option(optionData).select(selectedValue).end())
            .add(ctrl.define("widget.input.codeName", "otheraddress", "otheraddress", ecount.resource.LBL04041).filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "250", "500"), max: 500 }).option(optionData).select(selectedValue).end());
        contents.add(toolbar).add(frm).addGrid("dataGrid", settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            keyHelper = [];
        keyHelper.push(11);
        keyHelper.push(10);
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00070))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        if (!$.isNull(this.keyword)) {
            this.contents.getControl('CustomSearch').get(0).setValue(this.keyword);
        }
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        this.contents.getControl('CustomSearch').get(0).setFocus(0);
        this.setFixedHeader(false);
        this.contents.getGrid().settings.setHeaderTopMargin(5);
        this.contents.hideRow("otheraddress");
        this.contents.hideRow("zipcode");
        this.contents.hideRow("address");
        this.footer.getControl("apply").hide();
        this.contents.getGrid().settings.setEmptyGridMessage(ecount.resource.MSG00205);
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //grid row의 특정 date관련  
    setGridZipCodeLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                this.contents.getControl("zipcode").setLabel(data.rowItem.ZIPCODE);
                this.contents.getControl("address").setLabel(data.rowItem.ADDR);
                this.footer.getControl("apply").show();
                this.contents.showRow("otheraddress");
                this.contents.showRow("zipcode");
                this.contents.showRow("address");
                this.contents.getControl('otheraddress').setFocus(0);
                this.footer.getControl("keyHelper").hide();
                this.footer.getControl("apply").show();
                this.contents.getGrid().hide();
                this.footer.getControl("keyHelper").hide();

                // 주소 정보를 모두 담고 있는 변수
                this.rowItem = data.rowItem,

                    e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    //grid row의 특정 date관련  
    setGridAddrLink: function (value, rowItem) {
        var objthis = this;
        var option = {};
        option.data = rowItem.ADDR;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                this.contents.getControl("zipcode").setLabel(data.rowItem.ZIPCODE);
                this.contents.getControl("address").setLabel(data.rowItem.ADDR);
                this.footer.getControl("apply").show();
                this.contents.showRow("otheraddress");
                this.contents.showRow("zipcode");
                this.contents.showRow("address");
                this.contents.getControl('otheraddress').setFocus(0);
                this.footer.getControl("apply").show();
                this.$el.find('.wrapper-keyboard-help').hide();
                this.$el.find('#dataGrid').hide();
                this.contents.getGrid().hide();

                // 주소 정보를 모두 담고 있는 변수
                this.rowItem = data.rowItem,

                    e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    //grid row의 특정 date관련  
    setGridAddrLinkJIBUN: function (value, rowItem) {
        var objthis = this;
        var option = {};
        option.data = rowItem.JIBUN;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                this.contents.getControl("zipcode").setLabel(data.rowItem.ZIPCODE);
                this.contents.getControl("address").setLabel(data.rowItem.JIBUN);
                this.footer.getControl("apply").show();
                this.contents.showRow("otheraddress");
                this.contents.showRow("zipcode");
                this.contents.showRow("address");
                this.contents.getControl('otheraddress').setFocus(0);
                this.footer.getControl("apply").show();
                this.$el.find('.wrapper-keyboard-help').hide();
                this.$el.find('#dataGrid').hide();
                this.contents.getGrid().hide();
                e.preventDefault();
            }.bind(this)
        };

        return option;
    },

    //검색값이 한건일경우 자동으로 입력되도록 
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (data.dataCount === 0)
            this.contents.getGrid().settings.setEmptyGridMessage(ecount.resource.MSG00205);
        if (data.totalDataCount >= 200 && this.isFirstTimeSearch)
            this.isFirstTimeSearch = false;
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },
    // Search button click event
    onContentsAdvanceSearch: function (event) {
        var advance = this.contents.getControl('CustomSearch').get(0);
        var invalid = advance.validate();
        if (invalid.length > 0) {
            advance.setFocus(0);
            return;
        }

        var count = this.$el.find(".contents>.has-error").length;
        if (count == 0) {
            this.searchFormParameter.PARAM = this.contents.getControl('CustomSearch').get(0).getValue().keyword;
            this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
            this.contents.getGrid().draw(this.searchFormParameter);
            this.contents.getGrid().show();
            this.footer.getControl("apply").hide();
            this.isFirstTimeSearch = true;
            this.contents.hideRow("otheraddress");
            this.contents.hideRow("zipcode");
            this.contents.hideRow("address");
        }
    },

    //적용버튼
    onFooterApply: function (e) {
        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {
            this.contents.getControl("otheraddress").setFocus(0);
            return false;
        }

        var zipcode = this.contents.getControl("zipcode").getLabel();
        var address = this.contents.getControl("address").getLabel();
        var otheraddress = this.contents.getControl("otheraddress").getValue();
        var message = {
            name: "ZIPCODE",
            zipcode: zipcode,
            address: address,
            otheraddress: otheraddress,
            index: this.index,
            // 주소 정보를 모두 담고 있는 변수
            rowItem: this.rowItem,

            addPosition: "next",
            strType: this.strType,
            CheckLine : 1,
            callback: this.close.bind(this)
        };

        this.sendMessage(this, message);
        this.close();
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },


    onChangeControl: function (control) {
        if (control.cid == "apply")
            this.onFooterApply(event);
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    //엔터
    ON_KEY_ENTER: function (e, target) {

        var countErrors;
        if (e != undefined && e.target.name == "keyword" && target == null) {
            var keyword = e.target.value;
            countErrors = this.$el.find(".contents>.has-error").length;
            if (countErrors == 0) {
                this.onContentsAdvanceSearch(keyword);
            }
        }
        else if (e != undefined && e.target.name == "apply" && target == null) {
            this.onFooterApply(e);
        } else if (target != undefined && target.cid == "search1") {
            countErrors = this.$el.find(".contents>.has-error").length;
            if (countErrors == 0) {
                this.onContentsAdvanceSearch(target.control.getValue());
            }
        }
        else if (target != undefined && target.cid == "advanceSearch") {
            countErrors = this.$el.find(".contents>.has-error").length;
            if (countErrors == 0) {
                this.onContentsAdvanceSearch(target.control.getValue());
            }
        }
        else if (target != undefined && target.cid == "CustomSearch") {
            target.control.setFocus(target.origin_control.cIndex + 1);
        }

        if (target != undefined && target.control.id == "otheraddress") {
            this.footer.getControl("apply").setFocus(0);
        }
        e.preventDefault();
    },

    ON_KEY_DOWN: function (e) {
        if (this.contents.getGrid().getSettings().getPagingTotalRowCount() > 0)
            this.gridFocus && this.gridFocus();
    },

    ON_KEY_UP: function (e, target) {
        if (this.contents.getGrid().getSettings().getPagingTotalRowCount() > 0)
            this.gridFocus && this.gridFocus();
    },

    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },

    ON_KEY_TAB: function () {
        if (this.contents.getGrid().getSettings().getPagingTotalRowCount() > 0) {
            var gridObj = this.contents.getGrid().grid;
            this.setTimeout(function () { gridObj.focus(); }, 0);
        }
    }
});
