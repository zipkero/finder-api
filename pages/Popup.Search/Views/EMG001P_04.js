window.__define_resource && __define_resource("LBL04100","BTN00113","LBL04101","LBL04102","LBL00386","LBL02874","LBL04108","LBL07147","LBL04111","BTN00008");
/*************************************************************************************************
1. Create Date : 2016.11.14
2. Creator      : 양미진
3. Description : 세부업종코드 검색(Biz. Type Code Search)
4. Precaution   : 
5. History       :   
6. MenuPath    : Self-Customizing > 정보관리 > 회사정보변경 > 회사기본정보(Company Information) > 세부업종코드 검색(Biz. Type Code Search)
7. Old File      : ECMAIN/EMG/EMG001P_04.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMG001P_04", {
	/********************************************************************** 
	* page user opion Variables(사용자변수 및 객체) 
	**********************************************************************/


	/**************************************************************************************************** 
	* page initialize
	****************************************************************************************************/
	init: function (options) {
		this._super.init.apply(this, arguments);
		this.initProperties();
	},

	initProperties: function () {
		this.searchFormParameter = {
			ATTRIBUTEYEAR: this.attributeYear,
			PARAM: this.keyword
		};
	},

	render: function () {
		this._super.render.apply(this);
	},

	/**********************************************************************
	* form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
	**********************************************************************/
	//헤더 옵션 설정(Header Option Setup)
	onInitHeader: function (header) {
		header.notUsedBookmark();
		header.setTitle(ecount.resource.LBL04100).useQuickSearch();

		var contents = widget.generator.contents(),
            tabContents = widget.generator.tabContents(),
            form = widget.generator.form(),
            toolbar = widget.generator.toolbar(),
			ctrl = widget.generator.control();

		//검색하단 버튼
		toolbar
			.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113));

		//창고코드, 창고명 검색어
		form.add(ctrl.define("widget.select", "attributeYear", "attributeYear", ecount.resource.LBL04101).option(this.setAttributeYear()).select(this.attributeYear).end())
			.add(ctrl.define("widget.input.codeName", "name", "name", ecount.resource.LBL04102).value(this.keyword).end());

		contents.add(form);    //검색어
		contents.add(toolbar);  //버튼

		header.add("search")
			.addContents(contents);
	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid();
        
		if (this.keyword == "") {
			toolbar.attach(ctrl.define("widget.label", "description", "description").label(ecount.resource.LBL04101 + " : " + this.attributeYear));
		} else {
			toolbar.attach(ctrl.define("widget.label", "description", "description").label(ecount.resource.LBL04101 + " : " + this.attributeYear + " / " + this.keyword + "(" + this.viewBag.InitDatas.SodukrateList.length + ecount.resource.LBL00386 + ")"));
		}		

		grid
			.setRowData(this.viewBag.InitDatas.SodukrateList)
        .setRowDataUrl("/Common/Infra/GetListSodukrateForSearch")
			.setKeyColumn(['ATTRIBUTE_YEAR', 'STD_INCM_RT_CD'])
			.setRowDataParameter(this.searchFormParameter)
			.setColumns([
                    { propertyName: 'STD_INCM_RT_CD', id: 'STD_INCM_RT_CD', title: ecount.resource.LBL02874, width: 50, align: 'center' },
                    { propertyName: 'DETAIL_NM', id: 'DETAIL_NM', title: ecount.resource.LBL04108, width: 120 },
                { propertyName: 'FULL_DETAIL_NM', id: 'FULL_DETAIL_NM', title: ecount.resource.LBL07147, width: 120 },
                { propertyName: 'LAST', id: 'LAST', title: ecount.resource.LBL04111, width: '' }
			])
			.setCustomRowCell('STD_INCM_RT_CD', this.setGridDataLink.bind(this));

		contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
	},
    
    /// Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        debugger
        if (data.dataRows.length > 0) { // Grid has data, re-calculate the col width
            
            if (this.header.getControl("attributeYear").getValue() != "2019") {
                gridObj.grid.setColumnVisibility("LAST", true);
                gridObj.grid.setColumnInfo("LAST", {
                    "width": "510"
                })
            }
            else {
                gridObj.grid.setColumnVisibility("LAST", false);
                gridObj.grid.setColumnInfo("STD_INCM_RT_CD", {
                    "width": "130"
                })
                gridObj.grid.setColumnInfo("DETAIL_NM", {
                    "width": "315"
                })
                gridObj.grid.setColumnInfo("FULL_DETAIL_NM", {
                    "width": "315"
                })
            }
        }
    },
    
	//풋터 옵션 설정
	onInitFooter: function (footer) {
		var g = widget.generator,
			toolbar = g.toolbar(),
			ctrl = g.control();

		toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

		footer.add(toolbar);
	},

	/**************************************************************************************************** 
	* define Button    
	****************************************************************************************************/
	//닫기(Close)
	onFooterClose: function (e) {
		this.close();
	},

	/*************************************************************************************************** 
	*  hotkey [f1~12, 방향키등.. ] 
	****************************************************************************************************/
	// KEY_F8
	ON_KEY_F8: function () {
		this.onHeaderSearch();
	},

	// KEY_ENTER
	ON_KEY_ENTER: function (e, target) {
		if (!$.isNull(target))
			this.onHeaderSearch(target.control.getValue());
	},

	/**************************************************************************************************** 
   * define grid event listener
   ****************************************************************************************************/

	/**************************************************************************************************** 
	* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
	* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
	****************************************************************************************************/
	//Header Search
	onHeaderSearch: function () {
		this.searchFormParameter.ATTRIBUTEYEAR = this.header.getControl("attributeYear").getValue();
		this.searchFormParameter.PARAM = this.header.getControl("name").getValue();

		var grid = this.contents.getGrid();
		grid.draw(this.searchFormParameter);
		this.header.getQuickSearchControl().setValue("");
		this.header.toggle(true);
	},

	//Quich Search
	onHeaderQuickSearch: function () {
		this.searchFormParameter.ATTRIBUTEYEAR = this.header.getControl("attributeYear").getValue();
		this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
		
		var grid = this.contents.getGrid();		
		grid.draw(this.searchFormParameter);
	},

	// 페이지 로드 완료 이벤트(Completion event page load)
	onGridAfterRowDataLoad: function (e, data, grid) {
		var Data = $.isEmpty(data.result) ? data : data.result.Data;

		if (!$.isEmpty(Data)) {
			if (this.searchFormParameter.PARAM == "") {
				this.contents.getControl("description").setLabel(ecount.resource.LBL04101 + " : " + this.searchFormParameter.ATTRIBUTEYEAR);
			} else {
				this.contents.getControl("description").setLabel(ecount.resource.LBL04101 + " : " + this.searchFormParameter.ATTRIBUTEYEAR + " / " + this.searchFormParameter.PARAM + "(" + data.result.Data.length + ecount.resource.LBL00386 + ")");
			}
		}
	},

	//Load Complete
	//onLoadComplete: function (e) {
	//	this.header.toggle();
	//},
	/**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/

	/**************************************************************************************************** 
	* define user function    
	****************************************************************************************************/
	//Code Link
	setGridDataLink: function () {
		var option = {};
		var self = this;

		option.controlType = "widget.link";

		option.event = {
			'click': function (e, data) {
				var param = {
					attributeYear: this.searchFormParameter.ATTRIBUTEYEAR,
					keyword: this.searchFormParameter.PARAM,
					codeLink: data.rowItem.STD_INCM_RT_CD
				};

				this.onAllSubmitSelf('/ECERP/Popup.Search/EMG001P_05', param);
			}.bind(this)
		}
		return option;
	},

	//귀속년월 값 가져오기
	setAttributeYear: function () {
		var option = [];

		this.viewBag.InitDatas.AttributeYear.forEach(function (x) {
			option.push([x.ATTRIBUTE_YEAR, x.ATTRIBUTE_YEAR]);
		});

		return option;
	}
});