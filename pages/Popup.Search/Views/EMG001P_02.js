window.__define_resource && __define_resource("LBL01628","LBL00627","LBL00626","BTN00008");
/*************************************************************************************************
1. Create Date : 2016.11.14
2. Creator      : 양미진
3. Description : 세무서검색(Tax Office Search)
4. Precaution   : 
5. History       :   
6. MenuPath    : Self-Customizing > 정보관리 > 회사정보변경 > 회사기본정보(Company Information) > 세무서검색(Tax Office Search)
7. Old File      : ECMAIN/EMG/EMG001P_02.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMG001P_02", {
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
			SORT_COLUMN: 'OFFICE_NAME',
			SORT_TYPE: 'ASC'
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
		header.setTitle(ecount.resource.LBL01628).useQuickSearch();
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
        .setRowDataUrl("/Common/Infra/GetListAcc901ForSearch")
        .setRowDataParameter(this.searchFormParameter)
		.setKeyColumn(['OFFICE_CODE'])
        .setEventFocusOnInit(true)                  //Focus 이벤트 시작
        .setKeyboardCursorMove(true)                // 위, 아래 방향키
        .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
        .setKeyboardEnterForExecute(true)
		.setColumnSortable(true)
        .setColumnSortExecuting(function (e, data) {
        	thisObj.searchFormParameter.SORT_COLUMN = data.columnId + ' ';
        	thisObj.searchFormParameter.SORT_TYPE = data.sortOrder;
        	thisObj.contents.getGrid().draw(thisObj.searchFormParameter);
        })
		.setColumns([
                    { propertyName: 'OFFICE_CODE', id: 'OFFICE_CODE', title: ecount.resource.LBL00627, width: '200', align: 'center' },
                    { propertyName: 'OFFICE_NAME', id: 'OFFICE_NAME', title: ecount.resource.LBL00626, width: '200', align: 'center' }
		])
        .setCustomRowCell('OFFICE_CODE', this.setGridOfficeCode.bind(this))
        .setCustomRowCell('OFFICE_NAME', this.setGridOfficeName.bind(this));

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
	onHeaderQuickSearch: function(e) {
		this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();		
		var grid = this.contents.getGrid();
		grid.draw(this.searchFormParameter);
	},

	// Popup Handler
	onPopupHandler: function (control, config, handler) {
		if (control.id == "OFFICE_CODE") {
			config.isApplyDisplayFlag = false;
			config.popupType = false;
			config.additional = false;
			config.Type = false;
			config.Title = ecount.resource.LBL01628;
		} else if (control.id == "OFFICE_NAME") {
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
	//Office Code Link
	setGridOfficeCode: function (value, rowItem) {
		var option = {};
		var self = this;

		option.data = rowItem.OFFICE_CODE;
		option.controlType = "widget.link";

		option.event = {
			'click': function (e, data) {
				e.preventDefault();
				var message = {
					name: "OFFICE_NAME",
					code: "OFFICE_CODE",
					data: data.rowItem,
					addPosition: "current",
					callback: this.close.bind(this)
				};
				this.sendMessage(this, message);
			}.bind(this)
		}

		return option;
	},

	//Office Name Link
	setGridOfficeName: function (value, rowItem) {
		var option = {};
		var self = this;

		option.data = rowItem.OFFICE_NAME;
		option.controlType = "widget.link";

		option.event = {
			'click': function (e, data) {
				e.preventDefault();
				var message = {
					name: "OFFICE_NAME",
					code: "OFFICE_CODE",
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