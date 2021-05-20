window.__define_resource && __define_resource("LBL00703","LBL04414","LBL03638");
/****************************************************************************************************
1. Create Date : 2017.02.13
2. Creator     : 신선미
3. Description : 회계1>기초등록>계정코드등록 변경 항목검색
4. Precaution  :
5. History     :
****************************************************************************************************/

ecount.page.factory("ecount.page.changeItem", "EBA001P_18", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    selectedData: [],
    isShowSaveButtonByRow: false,
    incomeFlag: 0,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments); 
        this.initProperties(options);
    },

    initProperties: function (options) {
        debugger
        incomeFlag = Number(ecount.config.company.INCOME_FLAG);
        this.selectedData = (this.ChangeList || []);
        var willCheckItems = [];

        $.each(this.selectedData, function (i, data) {
            if ((data.IsSelected || "") != "") {
                willCheckItems.push(data["COLUMN"]);
            };

            if (data["COLUMN"] == "1" || data["COLUMN"] == "2" || data["COLUMN"] == "3" || data["COLUMN"] == "4" || data["COLUMN"] == "5") {
                data["GROUP_CODE"] = data["COLUMN"];
                data["_TREE_SET"] = { "_PARENT_GROUP_ID": "0000" };
            }
            else if (data["related"] != "" )
            {
                data["GROUP_CODE"] = data["related"];
                data["_TREE_SET"] = { "_PARENT_GROUP_ID": data["related"] };
            }
            else {
                data["GROUP_CODE"] = data["DOMAIN_TYPE"];
                data["_TREE_SET"] = { "_PARENT_GROUP_ID": data["DOMAIN_TYPE"] };
            };
        }); /*체크박스할 항목들 정의 - 화면을 그리기전에 데이터 영역*/

        options = $.extend({}, options, { data: this.selectedData }); /*그리드에 매칭할 데이터를 공통변수에 넣는다.*/

        var columns = [
                { id: 'TREE_CODE', propertyName: "datatitle", width: "0", editable: false, isHideColumn: true },
                { id: 'domain_type', propertyName: "DOMAIN_TYPE", width: "0", title: ecount.resource.LBL00703, editable: false, isHideColumn: true, controlType: "widget.link" },
                { id: 'datatitle', propertyName: "datatitle", width: "0", title: ecount.resource.LBL00703, editable: false, isHideColumn: true },
                { id: 'resource', propertyName: "resource", width: "", title: ecount.resource.LBL04414, editable: false }
        ]; /*화면에 출력할 그리드 컬럼을 정의한다.*/
        options = $.extend({}, options, { columns: columns, keycolumns: ["COLUMN"], checkedItem: willCheckItems, treeText: ["resource"] });  /*체크박스에서 구분할 키값을 넣는다.*/
        this._super.initProperties.call(this, options);  /*공통 페이지를 호출한다.*/
    },

    render: function ($parent) {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        var g = widget.generator,
                contents = g.contents(),
                tabContents = g.tabContents(),
                toolbar = g.toolbar(),
                ctrl = g.control();

        //header.useQuickSearch(); //로딩시 화면에 표시됨        
        header
            .setTitle(ecount.resource.LBL03638)
            .notUsedBookmark();
    },
    onInitContents: function (contents) {

        var controls = this._super.onInitContents.apply(this); /*contents를 알수 없어서 공통 페이지에서 받아온다.*/

        /*하위 로직, 받아온 object들을 override 하는 과정. - 다른 페이지에서 필요없음 안해도 됨*/
        controls.grid
            .setCustomRowCell('CHK_H', this.setGridDateCheck.bind(this));
        /*~여기까지*/

        contents.add(controls.toolbar)
                .addGrid("dataGrid", controls.grid); /*공통 내부에서 grid의 id는 "dataGrid"로 사용하기 때문에, 이름을 바꾸면 안됨.*/
    },

    onInitFooter: function (footer) {
        var controls = this._super.onInitFooter.apply(this); /*공통페이지를 호출한다. footer를 알수 없어서 받아온다.*/
        footer.add(controls.toolbar);
    },

    /*상단에 퀵서치 영역 처리하는 부분*/
    onHeaderQuickSearch: function (e, value) {
        var grid = this.contents.getGrid("dataGrid");
        var searchParam = { "Keyword": (this.header.getQuickSearchControl().getValue() || "") };
        this.contents.getGrid("dataGrid").grid.clearChecked();
        this.contents.getGrid("dataGrid").draw(searchParam);
    },

    setGridDateCheck: function (value, rowItem) {
        var option = {};
        var self = this;
        if (rowItem["related"] != "") {
            option.attrs = {
                'disabled': true
            };
        }
        return option;
    },

    /*tree를 그리기 위해서 가공*/
    onGridAfterRowDataLoad: function (e, data) {
        var result = data.result.Data;

        $.each(result, function (i, data1) {
            if (data1["COLUMN"] == "1" || data1["COLUMN"] == "2" || data1["COLUMN"] == "3" || data1["COLUMN"] == "4" || data1["COLUMN"] == "5") {
                data1["GROUP_CODE"] = data1["COLUMN"];
                data1["_TREE_SET"] = { "_PARENT_GROUP_ID": "0000" };
            }
            else if (data1["related"] != "" )
            {
                data1["GROUP_CODE"] = data1["related"];
                data1["_TREE_SET"] = { "_PARENT_GROUP_ID": data1["related"] };
            }
            else {
                data1["GROUP_CODE"] = data1["DOMAIN_TYPE"];
                data1["_TREE_SET"] = { "_PARENT_GROUP_ID": data1["DOMAIN_TYPE"] };
            };
        });
    }
});
