window.__define_resource && __define_resource("LBL04100","LBL04101","LBL04102","BTN00113","BTN00008");
/*************************************************************************************************
1. Create Date : 2016.11.14
2. Creator      : 양미진
3. Description : 세부업종코드 검색(Biz. Type Code Search)
4. Precaution   : 
5. History       :   
6. MenuPath    : Self-Customizing > 정보관리 > 회사정보변경 > 회사기본정보(Company Information) > 세부업종코드 검색(Biz. Type Code Search)
7. Old File      : ECMAIN/EMG/EMG001P_03.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMG001P_03", {
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
	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid(),
            form = g.form(),
            arrControls = [];

		form.template("register")
            .useInputForm();

		arrControls.push(ctrl.define("widget.select", "attributeYear", "attributeYear", ecount.resource.LBL04101).option(this.setAttributeYear()).end());
		arrControls.push(ctrl.define("widget.input", "name", "name", ecount.resource.LBL04102).value(this.keyword).maxLength(100).end());

		form.addControls(arrControls);

		contents.add(form);
	},

	//풋터 옵션 설정
	onInitFooter: function (footer) {
		var g = widget.generator,
			toolbar = g.toolbar(),
			ctrl = g.control();

		toolbar.addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113));
		toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

		footer.add(toolbar);
	},

	/**************************************************************************************************** 
	* define Button    
	****************************************************************************************************/
	//검색(Search)
	onFooterSearch: function (e) {
		var param = {
			attributeYear: this.contents.getControl("attributeYear").getValue(),
			keyword: this.contents.getControl("name").getValue()
		}

		this.onAllSubmitSelf('/ECERP/Popup.Search/EMG001P_04', param);
	},

	//닫기(Close)
	onFooterClose: function (e) {
		this.close();
	},

	/*************************************************************************************************** 
	*  hotkey [f1~12, 방향키등.. ] 
	****************************************************************************************************/
	// KEY_F8
	ON_KEY_F8: function () {
		this.onFooterSearch();
	},

	// KEY_ENTER
	ON_KEY_ENTER: function (e, target) {
		if (!$.isNull(target))
			this.onFooterSearch(target.control.getValue());
	},
	/**************************************************************************************************** 
   * define grid event listener
   ****************************************************************************************************/

	/**************************************************************************************************** 
	* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
	* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
	****************************************************************************************************/
	//Quich Search
	onHeaderQuickSearch: function (){
		var param = {
			attributeYear: this.contents.getControl("attributeYear").getValue(),
			keyword: this.header.getQuickSearchControl().getValue()
		}

		this.onAllSubmitSelf('/ECERP/Popup.Search/EMG001P_04', param);
	},

	// 페이지 로드 완료 이벤트(Completion event page load)
	onLoadComplete: function (e) {
		if (!e.unfocus) {
			this.header.getQuickSearchControl().setFocus(0);
		}
	},
	/**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/

	/**************************************************************************************************** 
	* define user function    
	****************************************************************************************************/
	//귀속년월 값 가져오기
	setAttributeYear: function () {
		var option = [];

		this.viewBag.InitDatas.AttributeYear.forEach(function (x) {
			option.push([x.ATTRIBUTE_YEAR, x.ATTRIBUTE_YEAR]);
		});

		return option;
	}
});