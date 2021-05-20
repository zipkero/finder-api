window.__define_resource && __define_resource("BTN00351","BTN00113","BTN00007","LBL04331","LBL03682","LBL07530","LBL01595","BTN00291","BTN00169","MSG03839","LBL10749","LBL19106","LBL70709","LBL19107","BTN00152","BTN00069","BTN00008","LBL02792","BTN00426","LBL16433","BTN00756","BTN00603","LBL16434","MSG09879","MSG01541","MSG10471","MSG01699","MSG00962");
/****************************************************************************************************
1. Create Date : 2015.09.01
2. Creator     : 양미진
3. Description : 재고 > 영업관리 > 판매입력 > 알림설정 > 사용자 아이디 검색
4. Precaution  : 알림설정 > 사용자 아이디 검색시 기능만 개발(전자결제 및 다른 메뉴에서 사용자 아이디 검색시 이용되는 기능은 개발해야함)
5. History     : 2015.09.10(양미진) - 리팩토링
				 2016.05.03 (Jong-In Baik) A16_00542 검색팝업내 간편검색 Quick Search로 변경
				 2017.07.13(서성범) - 스크립트 오류 수정
				 2016.09.29(Nguyen Chi Hieu) changed a logic: from "this.ChkUserId.indexOf(item.USER_ID) > -1)"
															  to   "this.ChkUserId.indexOf(String.format("{0}{1}{2}","∬",item.USER_ID,"∬")) > -1)
				 2016.11.30(CONGTHANH) Add some logic with GwUse, isIncludeInactive flags and SEARCH2, SEARCH3 parameters  
				 2016.12.14 (doTrinh) add some logic for select user single.
				 2017.03.21(SON): Merge search user and search person popup                 
				[2018.03.21][Tuan] Fix No Check Max Cout for receivers (isNoCheckMaxCount)
				 2018.06.05 (이현택) - 사용자선택 갯수 1000개로 제한 & 페이징처리
				 2018.07.03 (이현택) - 페이지당 로우 수가 1일 경우에는 부모페이지로 값이 바로 들어가는 현상 수정
				 2018.07.04 (이현택) - TestProgress_50069 검색시 동일한 아이디일 경우 바로 받는 사람에 적용
				 2018.07.16 (이현택) - DevProgress_11270 쪽지발송시 PK오류
				 2018.07.18 Huu Lan: Apply Dev 9134 - ERP게시글 작성 시, CS 거래처 담당자에게 쪽지 발송되도록
				 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
				 2019.04.16 (김봉기) : 코드 연계항목 관련 API 호출 추가 : getReceiveDataALL
				 2019.07.10 (이은총) - A18_04223 리스트에 전체ID 나오도록 수정
				 2019.08.16 (AiTuan) : Change logic autoFlag
				 2019.08.21 (AiTuan) : Fix up30 Dev28259 그룹웨어>기안서작성>결재라인>사용자검색 
				 2019.10.10 (Hao) : Add Forward button for ENote
				 2020.10.30 (정준호) A20_02943 - 외부알림1차
                 2021.01.25 (VuThien) Apply Org Chart
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EGD002P_02", {
	gridObject: null,
	inPartList: {},
	aprvLineList: {},
	formInfo: null,
	UserPermit: null,

	//검색된 상태여부
	isSearched: false,
	checkedGridData: null,
	userIds: new Array(),
	gridRenderCount: 0,
	beforeTabId: "department",
	_customChkColumn: "CHK2",

	/**********************************************************************
	*  page init
	**********************************************************************/
	init: function (options) {
		this._super.init.apply(this, arguments);
		this.initProperties();

		this.hidCancelYn = this.hidCancelYn ? this.hidCancelYn : "N";
		this.hidGwUse = this.hidGwUse ? this.hidGwUse : "0";
		this.searchFormParameter = {
			FORM_TYPE: 'GP040',
			FORM_SER: 1,
			SEARCH_TEXT: this.keyword,
			SEARCH2: (!$.isNull(this.keyword2)) ? this.keyword2 : '',
			SEARCH3: (!$.isNull(this.keyword3)) ? this.keyword3 : '',
			CSFlag: this.CSFlag,
			GW_USE: "1",
			CANCEL: "N",
			PAGE_SIZE: 100,
			PAGE_CURRENT: 1,
			PAGE_USE_FLAG: true,
			SEARCH_RANGE: this.SEARCH_RANGE,
			IN_PART: this.IN_PART,
			TYPE: this.TYPE_FLAG,
		    IsUseChart: true,
			SEARCH_TYPE : "D"// D: 부서 / A : 결재라인 
		};

		if ($.isEmpty(this.ChkUserId)) {
			this.ChkUserId = '';
		}

		this.checkMaxCount = 1000;
	},

	initProperties: function () {
		this.UserPermit = this.viewBag.InitDatas.USER_PERMIT;
		this.formInfo = this.viewBag.InitDatas.GP040;
		this.searchMethod = this.formInfo.option.searchMethod || "S";
		this.expandMethod = this.formInfo.option.expandMethod || "E";
	},

	render: function () {
		this.setLayout(this.formInfo);
		this._super.render.apply(this);
	},

	/**********************************************************************
	* form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
	**********************************************************************/
	//헤더 옵션 설정
	onInitHeader: function (header) {

		header.notUsedBookmark();
		var self = this,
			res = ecount.resource,
			arrMn_Type = ['S', 'M', 'C'];

		var viewallres = res.BTN00351;
		var contents = widget.generator.contents(),
			form = widget.generator.form(),
			toolbar = widget.generator.toolbar()
		ctrl = widget.generator.control();
		toolbar.addLeft(ctrl.define("widget.button.group", "search")
			.label(ecount.resource.BTN00113)
		);

		//검색하단 버튼
		toolbar
			.addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));

		if (self.isPerson) {
			header.setTitle(res.LBL04331);
			header.useQuickSearch();
		}
		else {
			if ($.isEmpty(self.Type) == true)
				header.disable();

			if (self.Title) {
				if ($.isEmpty(self.Type) == false)
					header.setTitle(self.Title).useQuickSearch();
				else
					header.setTitle(self.Title);//Search User
			}
			else {
				if ($.isEmpty(self.Type) == false) {
					header.setTitle(res.LBL03682).useQuickSearch();
				}
	
				else
					header.setTitle(res.LBL03682);//Search User
			}
		}

		form.add(ctrl.define("widget.input.codeName", "search1", "search1", res.LBL07530).end())
			.add(ctrl.define("widget.input.codeName", "search2", "search2", res.LBL01595).end());

		contents.add(form);    //검색어
		contents.add(toolbar);  //버튼

		header.add("search").addContents(contents);

		header.add("option", [
				{ id: "searchTemplate", label: ecount.resource.BTN00291 },
				{ id: "listSetting", label: ecount.resource.BTN00169 }
		]);
	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var generator = widget.generator,
			tabContents = generator.tabContents(),
			toolbar = generator.toolbar(),
			grid = generator.grid(),
			grid2 = generator.grid(),
			self = this,
			columnDanger = [this._getCustomChkColumn(), 'T.SITE_DES', 'T.UNAME', 'T.ID'];

		if ($.isEmpty(this.MENU_TYPE) && !this.isCheckBoxDisplayFlag) {
			for (var i = 0; i < self.ColumnInfoList.count() ; i++) {
				if (self.ColumnInfoList[i].id == self._getCustomChkColumn()) {
					self.ColumnInfoList.remove(self.ColumnInfoList[i].index);
				}
				var findForms = self.formInfo.columns.where(function (obj) {
					return obj.id.toString() == self.ColumnInfoList[i].id.toString();
				});
				if (!_.isEmpty(findForms)) {
					self.ColumnInfoList[i].align = findForms[0].align;
					self.ColumnInfoList[i].valign = findForms[0].valign;
				}
			}
		}

		// Memo
		if ($.isEmpty(self.Type) == false) {
			self.MemoGubun = "Y";
		}

		// [소속부서별]
		grid.setColumns(self.ColumnInfoList)
			.setRowDataParameter(self.searchFormParameter)
			.setCheckBoxCustomRememberChecked(self._getCustomChkColumn(), true)
			.setCheckBoxUse(self.isPerson ? true : self.isCheckBoxDisplayFlag)
			.setCheckBoxHeaderCallback({
				'change': function (e, data) {
					self.gridObject.checkAllCustom(self._getCustomChkColumn(), data.target.checked);
				}
			})
			.setCheckBoxCallback({
				'change': self.setChangeCheckBoxCallback.bind(self)
			})
			.setCheckBoxRememberChecked(true)
			.setKeyColumn(self.isPerson ? ['SITE_DES', 'USER_ID', 'UNAME', 'IN_PART'] : ['SITE_DES', 'USER_ID', 'No'])
			.setCustomRowCell('T.UNAME', self.setGridDataLink.bind(self))
			.setCustomRowCell('T.ID', self.setDataCellIDGrid.bind(self))

			.setPagingUse(true)
			.setPagingRowCountPerPage(this.formInfo.option.pageSize, true)
			.setPagingIndexChanging(this.setPagingChangingCallBack.bind(this))

			// 특정 컬럼에 대해 Max Count 지정
			.setCheckBoxCustomMaxCount(self._getCustomChkColumn(), self.checkMaxCount)
			.setCheckBoxCustomMaxCountExceeded(self._getCustomChkColumn(), function (maxcount) { ecount.alert(String.format(ecount.resource.MSG03839, maxcount)); });

		if (self.formInfo != null && self.formInfo.option != null) {
			var formOutSet = self.formInfo.option;
			grid
				.setGridTypeHeaderTrHeight(formOutSet.headHeight || 0)
				.setTitleFontSize(formOutSet.headFontSize || 0)
				.setTitleHorizontalAlign((formOutSet.headHAlign == "left") ? "left" : ((formOutSet.headHAlign == "right") ? "right" : "center"))
				.setTitleVerticalAlign((formOutSet.headVAlign == "top") ? "top" : ((formOutSet.headVAlign == "bottom") ? "bottom" : "middle"))
				.setTitleFontBold(formOutSet.headFontBold || false)
				.setTitleFontItalic(formOutSet.headFontItalic || false)
				.setTitleFontStrike(formOutSet.headFontStrike || false)
				.setTitleFontUnderline(formOutSet.headFontUnderline || false);
		}

		if (self.isCheckBoxDisplayFlag == false) {
			if (!$.isEmpty(this.MENU_TYPE)) {
				columnDanger.remove(3);
			}
		}
		else {
			columnDanger.remove(3);
			columnDanger.remove(2);
		}

		if (self.GwUse)
			grid.setStyleRowBackgroundColor(self.setRowBackgroundColor.bind(self), 'danger');

		for (var i = 0; i < self.ColumnInfoList.count(); i++) {
			if (!columnDanger.contains(self.ColumnInfoList[i].id))
				grid.setCustomRowCell(self.ColumnInfoList[i].id, self.setBackGroudCellForList.bind(self));
		}
		

		// [결재라인별] -----------------------------------------------------
		var columns = [
			{ propertyName: 'APRV_LINE_NM', id: 'APRV_LINE_NM', title: ecount.resource.LBL10749, width: '200', align: 'left' }
		];

		if (self.isPerson ? true : self.isCheckBoxDisplayFlag) {
			columns = columns.concat([{ propertyName: self._getCustomChkColumn(), id: self._getCustomChkColumn(), title: '', width: '30', controlType: "widget.checkbox" }]);
		}
		columns = columns.concat([{ propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL01595, width: '200', align: 'left' }]);

		grid2
			.setColumns(columns)
			.setRowDataParameter(self.searchFormParameter)
			//.setRowData(self.viewBag.InitDatas.LoadDataByGwAprvLine)
			.setRowDataUrl("/Groupware/CRM/GetListSelectPerson")
			.setCheckBoxCustomRememberChecked(self._getCustomChkColumn(), true)
			.setCheckBoxUse(self.isPerson ? true : self.isCheckBoxDisplayFlag)
			.setCheckBoxHeaderCallback({
				'change': function (e, data) {
					self.gridObject.checkAllCustom(self._getCustomChkColumn(), data.target.checked);
				}
			})
			.setCheckBoxCallback({
				'change': self.setChangeCheckBoxByAprvLineCallback.bind(self)
			})
			.setCheckBoxActiveRowDeterminer(function (rowItem) {
				if (_.isNil(rowItem["INPUT_GUBUN"]) || rowItem["INPUT_GUBUN"] == "Y")
					return true;
				else
					return false;
			})
			.setCheckBoxRememberChecked(true)
			.setKeyColumn(['APRV_LINE_SNO','APRV_TGT_TYPE_CD', 'ID', 'DTLS_SNO'])
			.setCustomRowCell('UNAME', self.setGridDataLinkByAprvLine.bind(self))

			.setPagingUse(true)
			.setPagingRowCountPerPage(100, true)
			.setPagingIndexChanging(this.setPagingChangingCallBack.bind(this))

			// 특정 컬럼에 대해 Max Count 지정
			.setCheckBoxCustomMaxCount(self._getCustomChkColumn(), self.checkMaxCount)
			.setCheckBoxCustomMaxCountExceeded(self._getCustomChkColumn(), function (maxcount) { ecount.alert(String.format(ecount.resource.MSG03839, maxcount)); });

		if ($.isArray(self.viewBag.InitDatas.LoadDataByGwAprvLine)) {
			self.makeMergeData(self.viewBag.InitDatas.LoadDataByGwAprvLine, "aprvLine");
		}

		//--------------------------------------------------------------------

		//contents.add(toolbar).addGrid("dataGrid" + self.pageID, grid);

		tabContents
			.createActiveTab("department", this.CSFlag ? ecount.resource.LBL19106: ecount.resource.LBL70709)
			.add(toolbar)
			.addGrid("dataGrid" + self.pageID, grid);

		if (this.IsShowDepartmentOnly == false) {
			tabContents
				.createTab("aprvLine", ecount.resource.LBL19107)
				.add(toolbar)
				.addGrid("dataGrid2" + self.pageID, grid2);
		}
		
		contents
			.add(tabContents);

	},  

	setChangeCheckBoxCallback: function (e, data) {
		var self = this;
		if (this._getCustomChkColumn() == "CHK_H") {
			self.gridObject.setCheckWithChild(data['rowKey'], e.target.checked)
		}
		else {
			if (self.inPartList[data.rowItem['SITE_DES']] != undefined) {
				var currentInPartList = self.inPartList[data.rowItem['SITE_DES']];
				for (var i = 0, limit = currentInPartList.length; i < limit; i++) {
					var dataKey = currentInPartList[i];
					var isChecked = self.gridObject && self.gridObject.isChecked(data.rowKey);

					self.gridObject && self.gridObject.setCell(self._getCustomChkColumn(), dataKey, isChecked);
				}
			}
		}
	},

	setChangeCheckBoxByAprvLineCallback: function (e, data) {
		var self = this;
		if (self.aprvLineList[data.rowItem['APRV_LINE_SNO']] != undefined) {
			var currentAprvLineList = self.aprvLineList[data.rowItem['APRV_LINE_SNO']];
			for (var i = 0, limit = currentAprvLineList.length; i < limit; i++) {
				var dataKey = currentAprvLineList[i];
				var isChecked = self.gridObject && self.gridObject.isChecked(data.rowKey);

				self.gridObject && self.gridObject.setCell(self._getCustomChkColumn(), dataKey, isChecked);
			}
		}
	},

	setBackGroudCellForList: function (value, rowItem) {
		var option = {};

		if (rowItem.CANCEL == "Y")
			option.parentAttrs = { 'class': 'danger' };
		return option;
	},

	setGridDataLink: function (value, rowItem) {
		var self = this,
		   option = {};
		option.data = value;
		if (rowItem.CANCEL == "Y")
			option.parentAttrs = { 'class': 'danger' };

		if (self.isPerson || rowItem['CANCEL'] == 'N' || self.isIncludeInactive) {
			option.controlType = "widget.link";
			option.event = {
				'click': function (e, data) {
					e.preventDefault();
					var d = data.rowItem;
					var userIds = new Array();
					userIds = {
						ID: data.rowItem.USER_ID.toLowerCase(),
						UNAME: data.rowItem.UNAME
					};
					var message = {
						name: "UNAME",
						code: self.isPerson ? "ID" : "USER_ID",
						data: self.isPerson ? userIds : d,
						isAdded: self.isPerson ? true : self.isCheckBoxDisplayFlag,
						addPosition: self.isPerson ? "next" : "current",
						Receiver_Type: self.Receiver_Type,
						callback: self.close.bind(self),
						controlID: self.controlID,
						ROOM_SEQ: self.ROOM_SEQ,
					};
					if (this.isReceiveDataAll) {
						self.getReceiveDataALL(message);
					}
					else {
						self.sendMessage(self, message);
					}
				}.bind(self)
			};
		}

		return option;
	},

	setGridDataLinkByAprvLine: function (value, rowItem) {
		var self = this,
			option = {};
		option.data = value;
		if (!self.isCheckBoxDisplayFlag) {
			option.controlType = "widget.link";
			option.event = {
				'click': function (e, data) {
					e.preventDefault();
					var d = data.rowItem;
					var userIds = new Array();
					userIds = {
						ID: data.rowItem.ID.toLowerCase(),
						UNAME: data.rowItem.UNAME
					};
					var message = {
						name: "UNAME",
						code: "ID",
						data: self.isPerson ? userIds : d,
						isAdded: self.isPerson ? true : self.isCheckBoxDisplayFlag,
						addPosition: self.isPerson ? "next" : "current",
						Receiver_Type: self.Receiver_Type,
						callback: self.close.bind(self)

					};
					if (this.isReceiveDataAll) {
						self.getReceiveDataALL(message);
					}
					else {
						self.sendMessage(self, message);
					}
				}.bind(self)
			};
		}

		return option;
	},
	/********************************************************************** 
	* 2019.04.11 : 기초 코드 팝업 데이터 모두 가져오기 API [김봉기]
	**********************************************************************/
	getReceiveDataALL: function (message) {
		var self = this;
		var url = "/SVC/Common/Infra/GetReceiveCodeData";
		var returnData = null;
		message.data.CODE_TYPE = ecount.constValue.codePopupType.userId; // 팝업 코드 타입 추가
		var param = {
			Request: {
				Data: message.data
			}
		};

		ecount.common.api({
			url: url,
			data: Object.toJSON(param),
			success: function (result) {
				if (result.Status != "200") {
					alert(result.fullErrorMsg);
				} else {
					returnData = result.Data;
				}
			},
			complete: function () {
				message.data = returnData;
				self.sendMessage(self, message);
			}
		});
	},

	//소속부서별 아이디
	setDataCellIDGrid: function (value, rowItem) {
		var self = this,
			option = {};
		option.data = self.isPerson ? self.firstToUpperCase((rowItem.USER_ID != null ? rowItem.USER_ID.toString() : "")) : value;

		if (rowItem.CANCEL == "Y")
			option.parentAttrs = { 'class': 'danger' };

		if (!$.isNull(self.MENU_TYPE) && !self.isPerson && (rowItem['CANCEL'] == 'N' || self.isIncludeInactive)) {
			option.controlType = "widget.link";
			option.event = {
				'click': function (e, data) {
					var message = {
						name: "UNAME",
						code: "USER_ID",
						data: data.rowItem,
						isAdded: self.isCheckBoxDisplayFlag,
						addPosition: "current",
						callback: self.close.bind(self)
					};

					if (this.isReceiveDataAll) {
						self.getReceiveDataALL(message);
					}
					else {
						self.sendMessage(self, message);
					}
				}.bind(self)
			};
		}

		return option;
	},

	firstToUpperCase: function (value) {
		if (value.length > 1)
			return value.substr(0, 1).toUpperCase() + value.substr(1);
		else
			return value;
	},

	//풋터 옵션 설정
	onInitFooter: function (footer) {
		var toolbar = widget.generator.toolbar(),
			ctrl = widget.generator.control(),
			res = ecount.resource;
		if (this.isENoteForward)
			toolbar.addLeft(ctrl.define("widget.button", "Forward").label(ecount.resource.BTN00152));
		else if (!$.isEmpty(this.MENU_TYPE) || this.isCheckBoxDisplayFlag)
				toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00069));

		if (this.isPerson) {
			toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
			if (this.CSFlag == true)
				toolbar.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions([(this.isNewDisplayFlag) ? "" : 10]));
		}
		else {
			if (this.GwUse)
				toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
			else {
				toolbar
					.addLeft(ctrl.define("widget.button", "Add").label(ecount.resource.LBL02792).hide())
					.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
			}
		}

		

		footer.add(toolbar);
	},

	// Init Control
	onInitControl: function (cid, option) {
		var self = this,
			res = ecount.resource,
			arrMn_Type = ['S', 'M', 'C'];
		var viewallres = '';
		switch (cid) {
			case "search":
				if (arrMn_Type.contains(self.MENU_TYPE)) {
					if (self.isIncludeInactive) {
						//퀵서치 추가
						viewallres = res.BTN00426;
						if (this.searchFormParameter.CANCEL == "N") {
							viewallres = self.GwUse == '0' ? res.BTN00426 : res.BTN00351;
							if (this.parentPageID == "EMM016M")
								viewallres = res.LBL16433;
						}
						else {
							viewallres = self.GwUse == '0' ? res.BTN00756 : res.BTN00603;
							if (this.parentPageID == "EMM016M")
								viewallres = res.LBL16434;
						}
					}
				}

				if (this.isIncludeInactive) {
					option.addGroup([{ id: 'usegubun', label: viewallres }])
				}
				break;
			default:
				break;
		}
	},

	/**************************************************************************************************** 
	* define common event listener
	* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
	****************************************************************************************************/

	// 검색 항목 설정
	onDropdownSearchTemplate: function () {
		var self = this;
		ecount.confirm(this.CSFlag ? String.format("{0}\n\n{1}", ecount.resource.MSG09879, ecount.resource.MSG01541) : ecount.resource.MSG10471, function (isOk) {
			if (isOk == true) {
				
				if (ecount.user.PER_TYPE == '1') {
					var param = {
						width: ecount.infra.getPageWidthFromConfig(),
						height: 450,
						FORM_TYPE: "GP040"
					};
					self.openWindow({
						url: "/ECERP/Popup.Form/CM100P_01_CM3",
						name: ecount.resource.BTN00169,
						param: param
					});
				}
				else {
					ecount.alert(ecount.resource.MSG01699);
					return false;
				}
			} else {
				return false;
			}
		});

	   
	},

	// 리스트 설정
	onDropdownListSetting: function () {
		var self = this;
		ecount.confirm(this.CSFlag ? String.format("{0}\n\n{1}", ecount.resource.MSG09879, ecount.resource.MSG01541) : ecount.resource.MSG10471, function (isOk) {
			if (isOk == true) {
				if (ecount.user.PER_TYPE == '1') {
					var param = {
						width: 1020,
						height: 800,
						FORM_TYPE: 'GP040',
						FORM_SEQ: 1
					};
					self.openWindow({
						url: "/ECERP/Popup.Form/CM100P_02",
						name: ecount.resource.BTN00169,
						param: param
					});
				}
				else {
					ecount.alert(ecount.resource.MSG01699);
					return false;
				}
			} else {
				return false;
			}
		});

	},

	onLoadComplete: function (event) {

		if (this.isPerson) {
			if (!event.unfocus) {
				this.header.getQuickSearchControl().setValue(this.keyword || '');
				this.header.getQuickSearchControl().setFocus(0);
			}
		}
		else {
			if (this.GwUse) {
				if (!$.isNull(this.keyword))
					this.header.getQuickSearchControl().setValue(this.keyword);

				var grid = this.contents.getGrid();
				grid.getSettings().setHeaderTopMargin(this.header.height());
			}
			else {
				if (this.AddButtonFlag == "y") {
					this.footer.getControl("Add").show();
				}
				if (this.header.getQuickSearchControl()) {
					this.header.getQuickSearchControl().setValue(this.keyword);
				}
			}

			if (!event.unfocus) {
				if (this.header.getQuickSearchControl()) {
					this.header.getQuickSearchControl().setFocus(0);
				}
			}
		}

		this.setDataBind(this.viewBag.InitDatas.LoadData, (this.currentTabId || "department") == "department")
	},

	/********************************************************************** 
	* event grid listener [click, change...] 
	**********************************************************************/
	onGridInit: function (e, data) {
		var gridId = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2";
		var q = this.contents.getGrid(gridId + this.pageID).grid.getColumnInfoList();

		for (var i = 0; i < q.count(); i++) {
			if (q[i].id == this._getCustomChkColumn()) {
				q[i].columnOption = { attrs: { 'disabled': this.IsSchedule == true ? false : true } };
				break;
			}
		}

		this._super.onGridInit.apply(this, arguments);
	},

	onGridAfterRowDataLoad: function (e, data) {
		var gridId = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "department" : this.currentTabId;
		this._super.onGridAfterRowDataLoad.apply(this, arguments);

		if (gridId != "department") {
			if ($.isArray(data.result.Data)) {
				this.makeMergeData(data.result.Data, gridId);
			}
		}
	},

	//사용중단row색 변경
	setRowBackgroundColor: function (data) {
		if (data['CANCEL'] == "Y")
			return true;
	},

	/**********************************************************************
	* event  [button, link, FN, optiondoropdown..]
	**********************************************************************/

	// Header reset button click (Sự kiện click nút reset)
	onHeaderViewall: function (e) {
		if (this.hidCancelYn == 'N')
			this.hidCancelYn = 'Y';
		else
			this.hidCancelYn = 'N';
		this.reloadPage();
	},

	onButtonUsegubun: function (event) {
		if (this.searchFormParameter.CANCEL == 'N')
			this.searchFormParameter.CANCEL = 'Y';
		else
		    this.searchFormParameter.CANCEL = 'N';

		this.onHeaderSearch(event);
	},

	onHeaderReset: function (event) {
		this.header.reset();
		this.header.getControl("search1") && this.header.getControl("search1").setFocus(0);
	},

	//적용버튼
	onFooterApply: function () {
		var gridId = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2",
			userIds = [],
			users = [];

		var selectedItem = this.contents.getGrid(gridId + this.pageID).grid.getCheckedCustomRowDatas(this._getCustomChkColumn()).where(function (item) {
			return item.rowItem.INPUT_GUBUN != "N";
		});

		for (var i = 0; i < selectedItem.length; i++) {
			if ($.inArray(selectedItem[i].rowItem["USER_ID"].toUpperCase(), users) == -1) {
				userIds.push(selectedItem[i].rowItem);
			}
			users.push(selectedItem[i].rowItem["USER_ID"].toUpperCase());
		}

		if (userIds.length == 0) {
			ecount.alert(ecount.resource.MSG00962);
			return false;
		} else if (userIds.length > this.checkMaxCount) {
			ecount.alert(String.format(ecount.resource.MSG03839, this.checkMaxCount));
			return false;
		}

		var message = {
			name: this.viewBag.DefaultOption.NAME || "UNAME",
			code: this.viewBag.DefaultOption.CODE || "USER_ID",
			data: userIds,
			isAdded: true,
			addPosition: "next",
			callback: this.close.bind(this),
			Receiver_Type: this.Receiver_Type
		};
		if (this.isReceiveDataAll) {
			this.getReceiveDataALL(message);
		}
		else {
			this.sendMessage(this, message);
		}
	},

	onFooterForward: function () {
		var gridId = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2",
			userIds = [],
			users = [];

		var selectedItem = this.contents.getGrid(gridId + this.pageID).grid.getCheckedCustomRowDatas(this._getCustomChkColumn()).where(function (item) {
			return item.rowItem.INPUT_GUBUN != "N";
		});

		for (var i = 0; i < selectedItem.length; i++) {
			if ($.inArray(selectedItem[i].rowItem["USER_ID"].toUpperCase(), users) == -1) {
				userIds.push(selectedItem[i].rowItem);
			}
			users.push(selectedItem[i].rowItem["USER_ID"].toUpperCase());
		}

		if (userIds.length == 0) {
			ecount.alert(ecount.resource.MSG00962);
			return false;
		} else if (userIds.length > this.checkMaxCount) {
			ecount.alert(String.format(ecount.resource.MSG03839, this.checkMaxCount))
			return false;
		}
		var message = {
			name: "UNAME",
			code: "USER_ID",
			data: userIds,
			isAdded: true,
			addPosition: "next",
			callback: this.close.bind(this)
		};        
		this.sendMessage(this, message);
	},

	//추가버튼
	onFooterAdd: function () {
		var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
		var userIds = new Array();
		for (var i = 0, limit = rowList.length ; i < limit; i++) {
			if (rowList[i][this._getCustomChkColumn()] == true) {
				userIds.push(rowList[i]);
			}
		}//for end

		var message = {
			name: "UNAME",
			code: "USER_ID",
			data: userIds,
			isAdded: true,
			addPosition: "next"
		};

		if (this.isReceiveDataAll) {
			self.getReceiveDataALL(message);
		}
		else {
			self.sendMessage(self, message);
		}
	},

	//닫기버튼
	onFooterClose: function () {
		this.close();
		return false;
	},

	onHeaderSearch: function (event) {
		if (this.header.getQuickSearchControl())
		    this.header.getQuickSearchControl().setValue('');

		this.searchFormParameter.PAGE_CURRENT = 1;
		this.searchFormParameter.SEARCH_TEXT = '';

		var gridId = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2";
		var grid = this.contents.getGrid(gridId + this.pageID);
		grid.getSettings().setPagingCurrentPage(1);
		grid.getSettings().setPagingTotalRowCount(0);

		this.onContentsSearch('button');
	},

	onGridRenderComplete: function (e, data) {

		ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

		var gridId = (this.currentTabId == "department" || _.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2";
		this.gridObject = this.contents.getGrid(gridId + this.pageID).grid;

		if (gridId == "dataGrid") {
			return;
		}

		var self = this;
		var d = data.dataRows[0];

		if (d) {
			d.ID = d.USER_ID.toLowerCase();
			this.userId = d;
			this.userIds.push(d);
		}

		var value = this.keyword;
		if (!$.isEmpty(value)) {
			this.isOnePopupClose = true;
		}
		if (data.dataRows.length === 1 && $.isEmpty(d.APRV_TGT_TYPE_CD) && this.isOnePopupClose) {

			var code = !$.isEmpty(this.CODE) ? this.CODE : self.isPerson ? "ID" : "USER_ID";
			var name = !$.isEmpty(this.NAME) ? this.NAME : "UNAME";
			var message = {
				name: name,
				code: code,
				data: self.isPerson ? data.dataRows : this.userId,
				isAdded: true,
				addPosition: "next",
				callback: self.close.bind(self),
				Receiver_Type: self.Receiver_Type,
				controlID: self.controlID,
				ROOM_SEQ: self.ROOM_SEQ,
			};

			

			if (this.isReceiveDataAll) {
				self.getReceiveDataALL(message);
			}
			else {
				if (this.isENoteForward !== true && this.isSingleUserSendMessage !== false ) {
					self.sendMessage(self, message);
				}
			}
			this.userIds = new Array();
		}
		
		if (!self.isPerson) {

			var value2 = "";
			var value3 = "";

			if (self.isIncludeInactive && self.GwUse) {
				value2 = self.header.getControl("search1").getValue();
				value3 = self.header.getControl("search2").getValue();
			}

			if (data.dataCount > 1) {
				if (value2 !== '')
					self.header.getControl("search1").setValue(value2);

				if (value3 !== '')
					self.header.getControl("search2").setValue(value3);

				if (!$.isEmpty(self.ChkUserId) && self.isCheckBoxDisplayFlag) {
					self.ChkUserId = ecount.delimiter + self.ChkUserId + ecount.delimiter;

					var rowList = self.contents.getGrid().grid.getRowList();

					$.each(rowList, function (i, item) {
						if (self.ChkUserId.indexOf(String.format("{0}{1}{2}", ecount.delimiter, item.USER_ID, ecount.delimiter)) > -1) {
							self.contents.getGrid().grid.setCell(self._getCustomChkColumn(), item[ecount.grid.constValue.keyColumnPropertyName], true);
						}
					}.bind(self));
				}
			}
		}

		self.gridObject.settings().setEventFocusOnInit(true);

		if (this.isCheckBoxDisplayFlag) {
			var idList = [];
			var gridRowList = self.gridObject.getRowList();
			//이전 탭의 체크된 아이디 리스트 추출
			if (!$.isEmpty(self.checkedGridData) && self.checkedGridData.length > 0) {
				$.each(self.checkedGridData, function (index, item) {
					//아이디
					if (this.beforeTabId != "department") {
						idList.push(item.rowKey.split("∮")[2]);
					} else {
						idList.push(item.rowKey.split("∮")[1]);
					}
				}.bind(self));

				for (var i = 0; i < gridRowList.length; i++) {
					for (var j = 0; j < idList.length; j++) {
						if (gridRowList[i].USER_ID == idList[j]) {
							self.gridObject.setCell(self._getCustomChkColumn(), gridRowList[i][ecount.grid.constValue.keyColumnPropertyName], true);
						}
					}
				}

			}

		}
	},

	//검색
	onContentsSearch: function (event, isAutoClose) {
		if (this.header.getQuickSearchControl() != undefined) {
			var invalid = this.header.getQuickSearchControl().validate();
			if (invalid.length > 0) {
				if (!e.unfocus)
					this.header.getQuickSearchControl().setFocus(0);
				return;
			}
		}
        
		this.searchFormParameter.SEARCH2 = this.header.getControl("search1") ? this.header.getControl("search1").getValue() : '';
		this.searchFormParameter.SEARCH3 = this.header.getControl("search2") ? this.header.getControl("search2").getValue() : '';

		this.searchFormParameter.MEMBERS = this.MEMBERS;
		this.isOnePopupClose = true;
		var btnSearch = this.header.getControl("search");
		if (this.isIncludeInactive && this.GwUse) {
			this.searchFormParameter.GwUse = true;
			if (!$.isNull(event) && this.searchFormParameter.CANCEL == "Y") {
				btnSearch.removeGroupItem("usegubun");
				btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00603 }]);
			}
			else {
				btnSearch.removeGroupItem("usegubun");
				btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00351 }]);
			}
		} else if (this.isIncludeInactive && !this.GwUse) {
			this.searchFormParameter.GwUse = false;
			if (!$.isNull(event) && this.searchFormParameter.CANCEL == "Y") {
				btnSearch.removeGroupItem("usegubun");
				if (this.parentPageID == "EMM016M")
					btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.LBL16434 }]);
				else
					btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00756 }]);
			}
			else {
				btnSearch.removeGroupItem("usegubun");
				if (this.parentPageID == "EMM016M")
					btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00426 }]);
				else
					btnSearch.addGroupItem([{ id: "usegubun", label: ecount.resource.BTN00426 }]);
			}
		}

		var gridId = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2";
		var grid = this.contents.getGrid(gridId + this.pageID);
		this.searchFormParameter.SEARCH_TYPE = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "D" : "A";

		grid.grid.settings().setEventFocusOnInit(false);

		if (gridId == "dataGrid") {
			ecount.common.api({
				url: "/Common/Form/GetFormView",
				data: Object.toJSON({
					FormType: "GP040",
					FormSeq: 1,
					ExtendedCondition: {}
				}),
				success: function (res) {
					var columnForm = res.Data;
					this.searchMethod = columnForm.option.searchMethod || "S";
					this.expandMethod = columnForm.option.expandMethod || "E";
					this.formInfo = columnForm;
					ecount.common.api({
						url: "/Groupware/CRM/GetListSelectPerson",
						data: Object.toJSON(this.searchFormParameter),
						success: function (result) {
							console.log(result);
							if (result.Status != "200") {
								ecount.alert(result.fullErrorMsg);
							}
							else {
							    this.setDataBind(result.Data, true, isAutoClose);
							}
						}.bind(this)
					});
				}.bind(this)
			});
		}

		this.header.toggle(true);
	},

	onBeforeChangeTab: function (event) {
		this.beforeTabId = this.currentTabId ? this.currentTabId : "department";
		var gridId = (event.tabId == "department" || $.isEmpty(event.tabId)) ? "dataGrid" : "dataGrid2";

		var beforeGridId = this.beforeTabId == "department" ? "dataGrid" : "dataGrid2";
		if (beforeGridId == "dataGrid")
			this.checkedGridData = this.contents.getGrid(beforeGridId + this.pageID, this.beforeTabId).grid.getCheckedCustomRowDatas(this._getCustomChkColumn());
		
		return true;
	},

	onChangeContentsTab: function (event) {
		var gridId = (event.tabId == "department" || $.isEmpty(event.tabId)) ? "dataGrid" : "dataGrid2";
		var grid = this.contents.getGrid(gridId + this.pageID);

		if (this.beforeTabId != event.tabId && (this.isPerson ? true : this.isCheckBoxDisplayFlag)) {
			this.contents.getGrid(gridId + this.pageID).grid.clearChecked(this._getCustomChkColumn());
		}
		this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl() ? this.header.getQuickSearchControl().getValue() || '' : '';
		this.searchFormParameter.SEARCH2 = '';
		this.searchFormParameter.SEARCH3 = '';
		this.searchFormParameter.SEARCH_TYPE = (event.tabId == "department" || $.isEmpty(event.tabId)) ? "D" : "A";
					   
		if (gridId == "dataGrid") { //부서
			this.header.getControl("search1").changeSubTitle(ecount.resource.LBL07530);
			this.header.getControl("search1").setPlaceHolder(ecount.resource.LBL07530);
			this.header.getControl("search1").setValue("");
			this.header.getControl("search2").setValue("");
		} else {                    //결재라인
			this.header.getControl("search1").changeSubTitle(ecount.resource.LBL10749);
			this.header.getControl("search1").setPlaceHolder(ecount.resource.LBL10749);
			this.header.getControl("search1").setValue("");
			this.header.getControl("search2").setValue("");
		}

		if (gridId == "dataGrid") {
		    this.onContentsSearch(event, false);
		} else {
		    grid.draw(this.searchFormParameter);
		    this.header.getQuickSearchControl() && this.header.getQuickSearchControl().setFocus(0);
		}

	},

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //엔터
    ON_KEY_ENTER: function (e, target) {
        if (!_.isNull(target) && target.control) {
            this.onHeaderSearch();
        }
    },

	//F8 적용
	ON_KEY_F8: function () {
		if (this.header.isVisible()) 
		    this.onHeaderSearch();
		else if (this.isENoteForward)
			this.onFooterForward();
		else
			this.onFooterApply();
	},

	// ESC
	ON_KEY_ESC: function () {
		this.close();
	},

	ON_KEY_DOWN: function () {
		this.gridFocus && this.gridFocus();
	},

	ON_KEY_UP: function () {
		this.gridFocus && this.gridFocus();
	},

	ON_KEY_TAB: function () {
		var gridObj = this.contents.getGrid().grid;
		this.setTimeout(function () { gridObj.focus(); }, 0);
	},

	onMouseupHandler: function () {
		this.gridFocus = function () {
			var gridObj = this.contents.getGrid().grid;
			gridObj.focus();
			this.gridFocus = null;
		}.bind(this);
	},

	onHeaderQuickSearch: function (event) {
		var gridId = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2";
		var grid = this.contents.getGrid(gridId + this.pageID);

		this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl().getValue();
		this.searchFormParameter.SEARCH_TYPE = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "D" : "A";
		this.searchFormParameter.PAGE_CURRENT = 1;
		this.keyword = this.searchFormParameter.SEARCH_TEXT;

		this.isOnePopupClose = true;
		if (!this.isPerson) {
			if (this.isIncludeInactive && this.GwUse) {
				if (this.header.getControl("search1").getValue() == "")
					this.searchFormParameter.SEARCH2 = "";

				if (this.header.getControl("search2").getValue() == "")
					this.searchFormParameter.SEARCH3 = "";

				this.searchFormParameter.GwUse = true;
			}

			if (gridId != "dataGrid")
			    grid.getSettings().setPagingCurrentPage(1);
		}

		if (gridId == "dataGrid") {
		    grid.getSettings().setPagingCurrentPage(1);
		    grid.getSettings().setPagingTotalRowCount(0);
			this.onContentsSearch();
		} else {
			grid.draw(this.searchFormParameter);
		}
	},

	// Call back message
	onMessageHandler: function (page, message) {
		switch (page.pageID) {
			case "CM100P_01_CM3":
				setTimeout(function () {
					message.callback && message.callback();
				}, 0);
				break;
			case "CM100P_02":
				this.reloadPage();
				break;

		}
	},

	/**********************************************************************
	* user function
	=>사용자가 생성한 기능 function 등
	**********************************************************************/

	// rowspan merge
	setRowSpanMerge: function (startIndex, rowCnt,rowItem) {
		mergeData = {};
		mergeData['_MERGE_USEOWN'] = true;
		mergeData['_MERGE_START_INDEX'] = startIndex;
		mergeData['_ROWSPAN_COUNT'] = rowCnt;
		return mergeData;
	},

	makeMergeData: function (rowData, gridId) {
		var loadDateCnt = rowData.count();
		var self = this,
			indexMerge = 1,
			listColumns,
			keyColumnValue = '';

		if (gridId == "department") {
			listColumns = self.ColumnInfoList;

			for (var i = 0; i < loadDateCnt; i++) {
				var findForms = listColumns.where(function (obj) {
					return obj.id.toString() == "T.SITE_DES";
				});

				if (findForms != null)
					rowData[i]["ALIGN_DATA"] = findForms[0].align;
				else
					rowData[i]["ALIGN_DATA"] = "center";
			}

			for (var i = 0; i < listColumns.count(); i++) {
				if (listColumns[i].id == "T.SITE_DES") {
					if (self.isPerson || self.isCheckBoxDisplayFlag) {
						indexMerge = i + 1;
					} else
						indexMerge = i;
					break;
				}
			}
			

		} else {
			if (self.isPerson || self.isCheckBoxDisplayFlag) {
				indexMerge = 1;
			} else
				indexMerge = 0;
		}

		for (var i = 0; i < loadDateCnt; i++) {

			if (gridId == "department") {
				var tempRowCnt = parseInt(rowData[i].ROW_CNT);

				if (i < loadDateCnt - 1 && tempRowCnt > 1 && keyColumnValue != rowData[i].SITE_DES) {
					rowData[i]['_MERGE_SET'] = [];

					if (self.isPerson)
						rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(0, tempRowCnt, rowData[i]));
					else
						if (self.isCheckBoxDisplayFlag)
							rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(0, tempRowCnt, rowData[i]));

					rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(indexMerge, tempRowCnt, rowData[i]));
				}

				if (self.inPartList[rowData[i].SITE_DES] == undefined)
					self.inPartList[rowData[i].SITE_DES] = new Array();

				if (self.isPerson)
					self.inPartList[rowData[i].SITE_DES].push(rowData[i].SITE_DES + "∮" + rowData[i].USER_ID + "∮" + rowData[i].UNAME + "∮" + rowData[i].IN_PART);
				else
					self.inPartList[rowData[i].SITE_DES].push(rowData[i].SITE_DES + "∮" + rowData[i].USER_ID + "∮" + rowData[i].No);
				keyColumnValue = rowData[i].SITE_DES;

			} else {
				var tempMaxcnt = parseInt(rowData[i].ROW_CNT);

				if (i < loadDateCnt - 1 && tempMaxcnt > 1 && keyColumnValue != rowData[i].APRV_LINE_SNO) {
					rowData[i]['_MERGE_SET'] = [];

					if (self.isPerson)
						rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(0, tempMaxcnt, rowData[i]));
					else
						if (self.isCheckBoxDisplayFlag)
							rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(0, tempMaxcnt, rowData[i]));

					rowData[i]['_MERGE_SET'].push(self.setRowSpanMerge(indexMerge, tempMaxcnt, rowData[i]));
				}

				if (self.aprvLineList[rowData[i].APRV_LINE_SNO] == undefined)
					self.aprvLineList[rowData[i].APRV_LINE_SNO] = new Array();

				self.aprvLineList[rowData[i].APRV_LINE_SNO].push(rowData[i].APRV_LINE_SNO + "∮" + rowData[i].APRV_TGT_TYPE_CD + "∮" + rowData[i].ID + "∮" + rowData[i].DTLS_SNO);
				keyColumnValue = rowData[i].APRV_LINE_SNO;
			}
			
		}
		return rowData;
	},

	//reload page function 
	reloadPage: function () {
		var self = this;
		var url = "/ECERP/Popup.Search/EGD002P_02";

		params = {
			isIncludeInactive: self.isIncludeInactive,
			hidGwUse: self.hidGwUse,
			hidCancelYn: self.hidCancelYn,
			isPerson: self.isPerson,
			MENU_TYPE: self.MENU_TYPE,
			GwUse: self.GwUse,
			Type: self.Type,
			CSFlag: self.CSFlag,
			isCheckBoxDisplayFlag: self.isCheckBoxDisplayFlag,
			keyword:this.searchFormParameter.SEARCH,
			keyword2:this.searchFormParameter.SEARCH2,
			keyword3:this.searchFormParameter.SEARCH3,
			MEMBERS: self.MEMBERS,
			IsAppLine: self.IsAppLine,
			SEARCH_RANGE: self.SEARCH_RANGE,
			IN_PART: self.IN_PART,
			TYPE_FLAG: self.TYPE_FLAG,
			PRG_ID: self.PRG_ID
		};

		self.onAllSubmitSelf({
			url: url,
			param: params
		});
	},
	//페이징 콜백
	setPagingChangingCallBack: function (e, data) {
		var gridId = (this.currentTabId  == "department" || $.isEmpty(this.currentTabId)) ? "dataGrid" : "dataGrid2";
		var grid = this.contents.getGrid(gridId + this.pageID);
		this.searchFormParameter.PAGE_CURRENT = data.pageIndex;
		this.searchFormParameter.SEARCH_TYPE = (this.currentTabId == "department" || $.isEmpty(this.currentTabId)) ? "D" : "A";
		grid.getSettings().setPagingCurrentPage(data.pageIndex);

		if (gridId == "dataGrid") {
			this.onContentsSearch();
		} else {
			grid.draw(this.searchFormParameter);
		}
	},

	setDataBind: function (mainData, isCustom, isAutoClose) {
		var gridObj = this.contents.getGrid("dataGrid" + this.pageID);
		var realData = mainData.where(function (x) { return x["INPUT_GUBUN"] != "N"; });
		
		if (!_.isEmpty(this.keyword))
			this.isOnePopupClose = true;

		if (isAutoClose !== false && realData.length === 1 && $.isEmpty(realData[0].APRV_TGT_TYPE_CD) && this.isOnePopupClose) {
			var message = {
				name: !_.isEmpty(this.NAME) ? this.NAME : "UNAME",
				code: !_.isEmpty(this.CODE) ? this.CODE : this.isPerson ? "ID" : "USER_ID",
				data: realData[0],
				isAdded: true,
				addPosition: "next",
				callback: this.close.bind(this),
				Receiver_Type: this.Receiver_Type,
				controlID: this.controlID,
				ROOM_SEQ: this.ROOM_SEQ,
			};

			if (this.isReceiveDataAll) {
				this.getReceiveDataALL(message);
			}
			else {
				if (this.isENoteForward !== true && this.isSingleUserSendMessage !== false) {
					this.sendMessage(this, message);
				}
			}
			this.userIds = [];
			return;
		}

		if (this.CSFlag === true || this.searchMethod == "S") {
			this._setCustomChkColumn("CHK2");

			if (!_.isEmpty(mainData)) 
				this.makeMergeData(mainData, "department");

			gridObj.settings
				.setColumns(this.ColumnInfoList)
				.setRowData(mainData)
				.setStyleTreeGrid(true, 'T.SITE_DES')
				.setKeyColumn(this.isPerson ? ['SITE_DES', 'USER_ID', 'UNAME', 'IN_PART'] : ['SITE_DES', 'USER_ID', 'No'])
				.setStyleTreeEventDisable(true)
				.setStyleTreeEventOnLabel(false)
				.setCheckBoxCustomRememberChecked(this._getCustomChkColumn(), true)
				.setCheckBoxCustomMaxCount(this._getCustomChkColumn(), this.checkMaxCount)
				.setCheckBoxCustomMaxCountExceeded(this._getCustomChkColumn(), function (maxcount) { ecount.alert(String.format(ecount.resource.MSG03839, maxcount)); });
		} else {
			this._setCustomChkColumn("CHK_H");
			
			gridObj.settings
				.setColumns(this.formInfo.columns)
				.setRowData(mainData)
				.setStyleTreeGrid(true, 'T.SITE_DES')
				.setKeyColumn(['TREE_KEY'])
				.setStyleTreeEventDisable(false)
				.setStyleTreeColumnSort(false)
				.setStyleTreeEventOnLabel(true)
				.setStyleTreeHideOnNoChild(false)
				.setCheckBoxCustomRememberChecked(this._getCustomChkColumn(), true)
				.setCheckBoxCustomMaxCount(this._getCustomChkColumn(), this.checkMaxCount)
				.setCheckBoxCustomMaxCountExceeded(this._getCustomChkColumn(), function (maxcount) { ecount.alert(String.format(ecount.resource.MSG03839, maxcount)); });

			if (this.expandMethod == "P") {
			    gridObj.settings.setStyleTreeOpenOnInit("upper");
			}
			else {
				gridObj.settings.setStyleTreeOpenOnInit(this.expandMethod == "E");
			}
		}

		this.contents.getGrid().draw();

		if (!$.isEmpty(this.keyword)) {
			this.header.getQuickSearchControl().setValue(this.keyword);
		}

		this.header.getQuickSearchControl() && this.header.getQuickSearchControl().setFocus(0);
	},

	_getCustomChkColumn: function () {
		return ((this.currentTabId || "department") == "department") ? this._customChkColumn : "CHK2";
	},

	_setCustomChkColumn: function (value) {
		return this._customChkColumn = value;
	},
	
});