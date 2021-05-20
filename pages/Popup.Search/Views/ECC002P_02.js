window.__define_resource && __define_resource("LBL01282","LBL00397","BTN00069","BTN00008","MSG00962");
/*************************************************************************************************
1. Create Date : 2016.10.17
2. Creator      : 양미진
3. Description : 회계1 > 출력물 > 커뮤니케이션센터 > SMS 발송내역 > 진행상태
4. Precaution   : 
5. History       :   
6. Old File      : CM3/ECC/ECC002P_01.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ECC002P_02", {
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
		    SEARCH: this.keyword,
		    CLASS_CD: this.CLASS_CD
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
        header.setTitle(ecount.resource.LBL01282 + ecount.resource.LBL00397).useQuickSearch();
	},

	//퀵 서치
	onHeaderQuickSearch: function (event) {
		this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue();

		var grid = this.contents.getGrid();

		grid.draw(this.searchFormParameter);
	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var self = this,
			generator = widget.generator,
            grid = generator.grid();

		grid
            .setRowData(this.viewBag.InitDatas.StatusList)
            .setRowDataUrl('/Common/Infra/GetListStatus')
            .setRowDataParameter(this.searchFormParameter)
            .setCheckBoxRememberChecked(false)
            .setCheckBoxUse(true)
            .setKeyColumn(['ITEM2'])
            .setCustomRowCell('ITEM3', this.setGridType.bind(this))
			.setColumns([
					{ propertyName: 'ITEM3', id: 'ITEM3', title: ecount.resource.LBL00397, width: '' }
			]);

		contents.addGrid("dataGrid" + this.pageID, grid);
	},

	//검색, 사용중단 
	onContentsSearch: function (event) {
		var invalid = this.header.getQuickSearchControl().validate();
		if (invalid.length > 0) {
			if (!e.unfocus) {
				this.header.getQuickSearchControl().setFocus(0);
			}				

			return;
		}

		this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue().keyword || '';
		this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
		this.contents.getGrid().draw(this.searchFormParameter);

		this.header.toggle(true);
	},

	//풋터 옵션 설정
	onInitFooter: function (footer) {
		var g = widget.generator,
			toolbar = g.toolbar(),
			ctrl = g.control();

		toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
               .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

		footer.add(toolbar);
	},

	/**************************************************************************************************** 
	* define Button    
	****************************************************************************************************/
	//적용버튼
	onFooterApply: function (e) {
		var rowList = this.contents.getGrid().getCheckedItem();
		var ststusList = new Array();
		var ststus = new Array();

		for (var i = 0, limit = rowList.length ; i < limit; i++) {
		    if (rowList[i]['ITEM1'] == '' && rowList[i]['ITEM2'] == '전체') {
		        rowList[i]['ITEM1'] = 'ALL';
		    } 

			if ($.inArray(rowList[i]["KEY"]["CLASS_SEQ"], ststus) == -1) {
				rowList[i]["ITEM3"] = ecount.resource[rowList[i]["ITEM3"]];
				ststusList.push(rowList[i]);

			}
			ststus.push(rowList[i]["KEY"]["CLASS_SEQ"]);
		}//for end

		if (ststusList.length == 0) {
			ecount.alert(ecount.resource.MSG00962);
			return false;
		}

		var message = {
			name: "ITEM3",
			code: "ITEM1",
			data: ststusList,
			isAdded: true,
			addPosition: "next",
			callback: this.close.bind(this)
		};
		this.sendMessage(this, message);
	},

	//닫기버튼
	onFooterClose: function () {
		this.close();
		return false;
	},

	/*************************************************************************************************** 
	*  hotkey [f1~12, 방향키등.. ] 
	****************************************************************************************************/
	// KEY_F8
	ON_KEY_F8: function () {
		this.onFooterApply();
	},

	// KEY_ENTER
	ON_KEY_ENTER: function (e, target) {
		if (!$.isNull(target)) {
			this.onContentsSearch(target.control.getValue());
		}
	},

	/**************************************************************************************************** 
   * define grid event listener
   ****************************************************************************************************/
	//검색값이 한건일경우 자동으로 입력되도록  
	onGridRenderComplete: function (e, data) {
	    ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

		if (data.totalDataCount == 1) {
			var obj = {};
			var d = data.dataRows[0];

			if (d['ITEM1'] == '' && d['ITEM2'] == '전체') {
			    d['ITEM1'] = 'ALL';
			}

			d["ITEM3"] = ecount.resource[d["ITEM3"]];

			var message = {
				name: "ITEM3",
				code: "ITEM1",
				data: d,
				isAdded: true,
				addPosition: "next",
				callback: this.close.bind(this)
			};
			this.sendMessage(this, message);
		}

		this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
		gridObject = this.contents.getGrid().grid;

	},

	onLoadComplete: function (e) {
	    if (!e.unfocus) {
	        this.header.getQuickSearchControl().setValue(this.keyword);
	        this.header.getQuickSearchControl().setFocus(0);
	    }
	},
	/****************************************************************************************************
    * event form listener [tab, content, search, popup ..]
    ****************************************************************************************************/

	/**************************************************************************************************** 
	* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
	* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
	****************************************************************************************************/

	/**************************************************************************************************** 
	* define user function    
	****************************************************************************************************/
	//리소스 변환하여 보여주기
	setGridType: function (value, rowItem) {
		var option = {};

		option.controlType = "widget.label";
		option.data = ecount.resource[value];

		return option;
	}
});