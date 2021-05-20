window.__define_resource && __define_resource("LBL04164","LBL02874","LBL02577","LBL04108","LBL07147","LBL04114","LBL04113","LBL04112","LBL04111","BTN00218","BTN00053","BTN00008","BTN00089");
/*************************************************************************************************
1. Create Date : 2016.11.23
2. Creator      : 양미진
3. Description : 표준소득률상세결과(Detailed Results of the Standard Profit Rate)
4. Precaution   : 
5. History       :   
6. MenuPath    : Self-Customizing > 정보관리 > 회사정보변경 > 회사기본정보(Company Information) > 세부업종코드 검색(Biz. Type Code Search) > 표준소득률상세결과(Detailed Results of the Standard Profit Rate)
7. Old File      : ECMAIN/EMG/EMG001P_05.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMG001P_05", {
	/********************************************************************** 
	* page user opion Variables(사용자변수 및 객체) 
	**********************************************************************/
	

	/**************************************************************************************************** 
	* page initialize
	****************************************************************************************************/
	init: function (options) {
        this.useBelowPopUpLevelAddCode = true;
        this.hasWholeRowLayout = true;
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
		header.setTitle(ecount.resource.LBL04164);
	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var g = widget.generator,
            toolbar = g.toolbar(),			
			ctrl = g.control(),
			form = g.form(),
			arrControls = [];

		form.template("register")
            .useInputForm();

		arrControls.push(ctrl.define("widget.label", "stdIncmRtCd", "stdIncmRtCd", ecount.resource.LBL02874).label(this.viewBag.InitDatas.SodukrateDetail.STD_INCM_RT_CD).end());
		arrControls.push(ctrl.define("widget.label", "middleNm", "middleNm", ecount.resource.LBL02577).label(this.viewBag.InitDatas.SodukrateDetail.MIDDLE_NM).end());
		arrControls.push(ctrl.define("widget.label", "detailNm", "detailNm", ecount.resource.LBL04108).label(this.viewBag.InitDatas.SodukrateDetail.DETAIL_NM).end());
		arrControls.push(ctrl.define("widget.label", "fullDetailNm", "fullDetailNm", ecount.resource.LBL07147).label(this.viewBag.InitDatas.SodukrateDetail.FULL_DETAIL_NM).end());
		arrControls.push(ctrl.define("widget.label", "selfrtApplyFg", "selfrtApplyFg", ecount.resource.LBL04114).label(this.viewBag.InitDatas.SodukrateDetail.SELFRT_APPLY_FG).end());
		arrControls.push(ctrl.define("widget.label", "bsrtGen", "bsrtGen", ecount.resource.LBL04113).label(this.viewBag.InitDatas.SodukrateDetail.BSRT_GEN).end());
		arrControls.push(ctrl.define("widget.label", "bsrtSelf", "bsrtSelf", ecount.resource.LBL04112).label(this.viewBag.InitDatas.SodukrateDetail.BSRT_SELF).end());
		arrControls.push(ctrl.define("widget.label", "last", "last", ecount.resource.LBL04111).label(this.viewBag.InitDatas.SodukrateDetail.LAST).end());

		form.addControls(arrControls);

		contents.add(form);
	},

	//풋터 옵션 설정
	onInitFooter: function (footer) {
		var g = widget.generator,
			toolbar = g.toolbar(),
			ctrl = g.control();

		toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00218));
		toolbar.addLeft(ctrl.define("widget.button", "before").label(ecount.resource.BTN00053));
		toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
		toolbar.addLeft(ctrl.define("widget.button", "searchAgain").label(ecount.resource.BTN00089));

		footer.add(toolbar);
	},

	/**************************************************************************************************** 
	* define Button    
	****************************************************************************************************/
	//Apply
	onFooterApply: function (e) {
		var message = {
			name: "DETAIL_NM",
			code: "STD_INCM_RT_CD",
			data: { DETAIL_NM: this.viewBag.InitDatas.SodukrateDetail.DETAIL_NM, STD_INCM_RT_CD: this.viewBag.InitDatas.SodukrateDetail.STD_INCM_RT_CD },
			addPosition: "current",
			callback: this.close.bind(this)
		};
		this.sendMessage(this, message);
	},

	//Before
	onFooterBefore: function (e) {
		this.onAllSubmitSelf("/ECERP/Popup.Search/EMG001P_04", { attributeYear: this.attributeYear, keyword: this.keyword });
	},

	//닫기(Close)
	onFooterClose: function (e) {
		this.close();
	},

	//Search Again
	onFooterSearchAgain: function(e) {
		this.onAllSubmitSelf("/ECERP/Popup.Search/EMG001P_03", null);
	},

	/*************************************************************************************************** 
	*  hotkey [f1~12, 방향키등.. ] 
	****************************************************************************************************/
	// KEY_F4
	ON_KEY_F4: function () {
		this.onFooterApply();
	}

	/**************************************************************************************************** 
   * define grid event listener
   ****************************************************************************************************/

	/**************************************************************************************************** 
	* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
	* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
	****************************************************************************************************/	

	/**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/

	/**************************************************************************************************** 
	* define user function    
	****************************************************************************************************/
});