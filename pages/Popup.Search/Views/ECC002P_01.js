window.__define_resource && __define_resource("LBL11578","LBL00703","LBL00397","BTN00069","BTN00008","MSG00962","LBL13033","LBL13037");
/*************************************************************************************************
1. Create Date : 2016.10.17
2. Creator      : 양미진
3. Description : 회계1 > 출력물 > 커뮤니케이션센터 > SMS 발송내역 > 발송종류
4. Precaution   : 
5. History       :   
6. Old File      : CM3/ECC/ECC002P_01.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ECC002P_01", {
	/********************************************************************** 
	* page user opion Variables(사용자변수 및 객체) 
	**********************************************************************/
	gridObject: null,
	inPartList: null,
	inPartList2: null,

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

		this.inPartList = {};
		this.inPartList2 = {};
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

		header.setTitle(ecount.resource.LBL11578).useQuickSearch();
	},

	//퀵 서치
	onHeaderQuickSearch: function (event) {
		this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue();
		this.searchFormParameter.CLASS_CD = this.CLASS_CD;

		var grid = this.contents.getGrid();

		grid.draw(this.searchFormParameter);
	},

	//본문 옵션 설정
	onInitContents: function (contents) {
		var self = this,
			generator = widget.generator,
            grid = generator.grid();

        this.viewBag.InitDatas.SendTypeList = this.viewBag.InitDatas.SendTypeList.sortBy(function (item) { return String.format("{0}{1}{2}", item.ITEM2, item.ITEM6, item.ITEM9); });

		grid
			.setRowData(this.viewBag.InitDatas.SendTypeList)
			.setRowDataUrl('/Common/Infra/GetListSendType')
			.setRowDataParameter(this.searchFormParameter)
			.setCheckBoxRememberChecked(false)
			.setCheckBoxUse(true)
			.setCustomRowCell('ITEM4', this.setGridType1.bind(this))
			.setCustomRowCell('ITEM8', this.setGridType2.bind(this))
			.setCustomRowCell('ITEM11', this.setGridType3.bind(this))
			.setCustomRowCell('CHK2', function (value, rowItem) {
				var option = {};

				option.event = {
					'change': function (e, data) {
						if (self.inPartList2[data.rowItem['ITEM6']] != undefined) {
							var currentInPartList = self.inPartList2[data.rowItem['ITEM6']];

							for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
								gridObject.setCell('CHK3', currentInPartList[i], data['newValue']);
							}//for end
						}//if end
					}
				};

				return option;
			})
			.setCheckBoxCallback({
				'change': function (e, data) {
					if (this.inPartList[data.rowItem['ITEM2']] != undefined) {
						
						var currentInPartList = this.inPartList[data.rowItem['ITEM2']];

						for (var i = 0, limit = currentInPartList.length ; i < limit; i++) {
							gridObject.setCell('CHK2', currentInPartList[i], gridObject.isChecked(data.rowKey));
						}//for end
					}//if end
					else {
						if (!$.isNull(data.rowItem) && !$.isNull(data.rowKey)) {
							gridObject.setCell('CHK2', data.rowKey, gridObject.isChecked(data.rowKey));
						}
					}
				}.bind(this)
			})
			.setKeyColumn(['ITEM4', 'ITEM8', 'ITEM11'])
			.setColumns([
					{ propertyName: 'ITEM4', id: 'ITEM4', title: ecount.resource.LBL00703, width: '' },
					{
						propertyName: 'CHK2', id: 'CHK2', controlType: 'widget.checkbox', align: "center", width: '30',
						columnOption: {
							attrs: { 'disabled': true }
						}
					},
				   { propertyName: 'ITEM8', id: 'ITEM8', title: ecount.resource.LBL00703, width: '' },
				   {
					   propertyName: 'CHK3', id: 'CHK3', controlType: 'widget.checkbox', align: "center", width: '30',
					   columnOption: {
						   attrs: { 'disabled': true }
					   }
				   },
				   { propertyName: 'ITEM11', id: 'ITEM11', title: ecount.resource.LBL00397, width: '' }
			]);

		this.makeMergeData(this.viewBag.InitDatas.SendTypeList);

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
		this.searchFormParameter.CLASS_CD = this.CLASS_CD;
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
		var rowList = this.contents.getGrid("dataGrid" + this.pageID).grid.getRowList();
		var sendList = new Array();
		var send = new Array();

		for (var i = 0, limit = rowList.length ; i < limit; i++) {
			if (rowList[i].CHK3 == true) {
				if ($.inArray(rowList[i]["KEY"]["CLASS_SEQ"], send) == -1) {
				    this.setCodeByNoCheckPermission(rowList[i]);
					rowList[i]["ITEM11"] = ecount.resource[rowList[i]["ITEM11"]];
					sendList.push(rowList[i]);

				}
				send.push(rowList[i]["KEY"]["CLASS_SEQ"]);
			}
		}//for end

		if (sendList.length == 0) {
			ecount.alert(ecount.resource.MSG00962);
			return false;
		}

		if (!this.NoCheckPermissionTF && this.PER_TYPE != "1" && !this.getAuthCheck(sendList)) {
			return false;
		}

		var message = {
			name: "ITEM11",
			code: "ITEM12",
			data: sendList,
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
		gridObject = this.contents.getGrid().grid;
		if (data.totalDataCount == 1) {
			var obj = {};
			var d = data.dataRows[0];

			this.setCodeByNoCheckPermission(d);

			d["ITEM11"] = ecount.resource[d["ITEM11"]];

			if (!this.NoCheckPermissionTF && this.PER_TYPE != "1" && !this.getAuthCheck(d)) {
				return false;
			}

			var message = {
				name: "ITEM11",
				code: "ITEM12",
				data: d,
				isAdded: true,
				addPosition: "next",
				callback: this.close.bind(this)
			};
			this.sendMessage(this, message);
		}

		this.contents.getGrid().grid.settings().setEventFocusOnInit(true);
	},

	getAuthCheck: function (list) {
		var resultObj = [],
			sendObj = [],
			detailObj = [],
			errPageList = "";
		
		if (!$.isArray(list)) {
			list = [list];
		}
		list.forEach(function (x) {
			detailObj.push(x["ITEM11"]);
			sendObj.push(x["ITEM12"]);
		}.bind(this));

		var param = {
			CLASS_CD : this.CLASS_CD,
			PERMIT_LIST: sendObj,
			DETAIL_LIST: detailObj
		};
		ecount.common.api({
			async: false,
			url: '/Common/Infra/GetListSendTypePermission',
			data: param,
			success: function (result) {
				if (result.Status != "200") {
					ecount.alert("error");
				} else {
					if (!$.isEmpty(result.Data)) {
						result.Data.forEach(function (item) {
							resultObj.push(ecount.resource[item["ITEM11"]]);
						}.bind(this));
					}
				}
			}.bind(this)
		});
		
		if (resultObj.length > 0) {
			for (var i = 0 ; i < resultObj.length; i++) {
				//권한이 없는 경우
				if (errPageList == "") {
					errPageList += resultObj[i];
				}
				else {
					errPageList += "\r\n - " + resultObj[i];
				}
			}
			if (errPageList.length > 0) {
				var msgdto = ecount.common.getAuthMessage("", [{
					MenuResource: errPageList, PermissionMode: "R"
				}]);
				ecount.alert(msgdto.fullErrorMsg);
				return false;
			}
			else
				return true;
		}
		else
			return true;
	},

	//그리드 완료 후
	onGridAfterRowDataLoad: function (e, data) {
		this._super.onGridAfterRowDataLoad.apply(this, arguments);

		this.makeMergeData(data.result.Data);
	},

	/****************************************************************************************************
	* event form listener [tab, content, search, popup ..]
	****************************************************************************************************/
	//페이지 로드 완료 이벤트
	onLoadComplete: function (e) {
		if (this.keyword) {
			this.header.getQuickSearchControl().setValue(this.keyword);
		}

		if (!e.unfocus) {
			this.header.getQuickSearchControl().setFocus(0);
		}
	},

	/**************************************************************************************************** 
	* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
	* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
	****************************************************************************************************/

	/**************************************************************************************************** 
	* define user function    
	****************************************************************************************************/
	//Make Merge Data
	makeMergeData: function (rowData) {
		var loadDateCnt = rowData.count();
		var InPart2 = '';
		var InPart6 = '';

		for (var i = 0 ; i < loadDateCnt; i++) {
			//if (i <= loadDateCnt - 1 && loadDateCnt > 1 && InPart6 != rowData[i].ITEM6) {
			if (loadDateCnt > 1 && InPart6 != rowData[i].ITEM6) {
				rowData[i]['_MERGE_SET'] = [];
				rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(2, parseInt(rowData[i].ITEM5)));
				rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(3, parseInt(rowData[i].ITEM5)));

				if (this.inPartList[rowData[i].ITEM2] == undefined) {
					this.inPartList[rowData[i].ITEM2] = new Array();
				}

				this.inPartList[rowData[i].ITEM2].push(rowData[i].ITEM4 + '∮' + rowData[i].ITEM8 + '∮' + rowData[i].ITEM11);

				if (InPart2 != rowData[i].ITEM2) {
					rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(0, parseInt(rowData[i].ITEM1)));
					rowData[i]['_MERGE_SET'].push(this.setRowSpanMerge(1, parseInt(rowData[i].ITEM1)));
					  
				}
			}

			if (this.inPartList2[rowData[i].ITEM6] == undefined) {
				this.inPartList2[rowData[i].ITEM6] = new Array();
			}

			this.inPartList2[rowData[i].ITEM6].push(rowData[i].ITEM4 + '∮' + rowData[i].ITEM8 + '∮' + rowData[i].ITEM11);

			InPart2 = rowData[i].ITEM2;
			InPart6 = rowData[i].ITEM6;
		}

		return rowData;
	},

	// rowspan merge
	setRowSpanMerge: function (startIndex, rowCnt) {
		var mergeData = {};

		mergeData['_MERGE_USEOWN'] = true;
		if (startIndex == 0)
			mergeData['_IS_CENTER_ALIGN'] = true;
		mergeData['_MERGE_START_INDEX'] = startIndex;
		mergeData['_ROWSPAN_COUNT'] = rowCnt;
		return mergeData;
	},

	//리소스 변환하여 보여주기
	setGridType1: function (value, rowItem) {
		var option = {};

		option.controlType = "widget.label";
		option.data = ecount.resource[value];

		return option;
	},

	//리소스 변환하여 보여주기
	setGridType2: function (value, rowItem) {
		var option = {};

		option.controlType = "widget.label";
		option.data = ecount.resource[value];

		return option;
	},

	//리소스 변환하여 보여주기
	setGridType3: function (value, rowItem) {
		var option = {};

		option.controlType = "widget.label";
		option.data = ecount.resource[value];

		return option;
	},

	setCodeByNoCheckPermission: function (data) {
        if (this.NoCheckPermissionTF === true) {
            if (data["ITEM12"] == "44") {
                switch (data["ITEM11"]) {
                    case "LBL13033":
                        data["ITEM12"] = data["ITEM12"] + "A";
                        break;
                    case "LBL13037":
                        data["ITEM12"] = data["ITEM12"] + "B";
                        break;
                }
            }
        }
	}
});