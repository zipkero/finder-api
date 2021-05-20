window.__define_resource && __define_resource("LBL06046","LBL02874","LBL06043","LBL06044","LBL01627","BTN00008","LBL01628");
/*************************************************************************************************
1. Create Date : 2016.11.14
2. Creator      : 양미진
3. Description : 법정동코드 검색(Legal Address Code Search)
4. Precaution   : 
5. History       :   
6. MenuPath    : Self-Customizing > 정보관리 > 회사정보변경 > 회사기본정보(Company Information) > 법정동코드 검색(Legal Address Code Search)
7. Old File      : ECMAIN/EMG/EMG001P_08.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMG001P_08", {
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
			PARAM: this.keyword,
			SORT_COLUMN: 'NTS_COURT_CD',
			SORT_TYPE: 'ASC',
			PAGE_SIZE: 100,
			PAGE_CURRENT: 1
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
		header.setTitle(ecount.resource.LBL06046).useQuickSearch();
	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid();
		var thisObj = this;

		grid
        .setRowData(this.viewBag.InitDatas.LoadData)
        .setRowDataUrl("/Common/Infra/GetListCocpAddressForSearch")
        .setRowDataParameter(this.searchFormParameter)
		.setKeyColumn(['NTS_COURT_CD'])
        .setEventFocusOnInit(true)                  //Focus 이벤트 시작
        .setKeyboardCursorMove(true)                // 위, 아래 방향키
        .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
        .setKeyboardEnterForExecute(true)
		.setKeyboardPageMove(true)                  // 페이징 이동
		.setPagingUse(true)
        .setPagingUseDefaultPageIndexChanging(true)
        .setPagingRowCountPerPage(100, true)
		.setColumnSortable(true)
        .setColumnSortExecuting(function (e, data) {
        	thisObj.searchFormParameter.SORT_COLUMN = data.columnId + ' ';
        	thisObj.searchFormParameter.SORT_TYPE = data.sortOrder;
        	thisObj.searchFormParameter.PAGE_SIZE = 100;
        	thisObj.contents.getGrid().draw(thisObj.searchFormParameter);
        })
		.setColumns([
                    { propertyName: 'NTS_COURT_CD', id: 'NTS_COURT_CD', title: ecount.resource.LBL02874, width: '90', align: 'center' },
                    { propertyName: 'ADDR_1', id: 'ADDR_1', title: ecount.resource.LBL06043, width: '80', align: 'center' },
                    { propertyName: 'ADDR_2', id: 'ADDR_2', title: ecount.resource.LBL06044, width: '80', align: 'center' },
                    { propertyName: 'ADDR_3', id: 'ADDR_3', title: "동/읍/면", width: '80', align: 'center' },
                    { propertyName: 'ADDR_4', id: 'ADDR_4', title: "리", width: '', align: 'center' },
                    { propertyName: 'POST_NO', id: 'POST_NO', title: ecount.resource.LBL01627, width: '80', align: 'center' }
		])
		.setCustomRowCell('NTS_COURT_CD', this.setGridNtsCourtCd.bind(this));

		contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);
	},

	//풋터 옵션 설정
	onInitFooter: function (footer) {
		var g = widget.generator,
			toolbar = g.toolbar(),
			ctrl = g.control();

		toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addRight(ctrl.define("widget.keyHelper", "keyHelper"));

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

	/**************************************************************************************************** 
   * define grid event listener
   ****************************************************************************************************/
	// 페이지 로드 완료 이벤트(Completion event page load)
	onLoadComplete: function (e) {
		if (!$.isNull(this.keyword)) {
			this.header.getQuickSearchControl().setValue(this.keyword);
		}

		this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());

		if (!e.unfocus) {
			this.header.getQuickSearchControl().setFocus(0);

		}
	},

	/**************************************************************************************************** 
	* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
	* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
	****************************************************************************************************/
	onHeaderQuickSearch: function (e) {
		this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
		var grid = this.contents.getGrid();
		grid.draw(this.searchFormParameter);
	},

	// Popup Handler
	onPopupHandler: function (control, config, handler) {
		if (control.id == "NTS_COURT_CD") {
			config.isApplyDisplayFlag = false;
			config.popupType = false;
			config.additional = false;
			config.Type = false;
			config.Title = ecount.resource.LBL01628;
		}

		handler(config);
	},

	/**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/

	/**************************************************************************************************** 
	* define user function    
	****************************************************************************************************/
	//Nts Court Code
	setGridNtsCourtCd: function (value, rowItem) {
		var option = {};
		var self = this;

		option.data = rowItem.NTS_COURT_CD;
		option.controlType = "widget.link";

		option.event = {
			'click': function (e, data) {
				e.preventDefault();
				var message = {
					name: "ADDRESS_DES",
					code: "NTS_COURT_CD",
					data: data.rowItem,
					addPosition: "current",
					callback: this.close.bind(this)
				};
				this.sendMessage(this, message);
			}.bind(this)
		}

		return option;
	}
});