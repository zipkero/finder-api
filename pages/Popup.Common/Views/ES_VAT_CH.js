window.__define_resource && __define_resource("LBL02475","LBL35133","LBL00540","LBL01356","LBL12098","MSG06862","LBL12099","LBL02388","BTN00854");
/****************************************************************************************************
1. Create Date : 2016.12.30 
2. Creator     : 임명식
3. Description : 재고1 > 입력화면 > 거래유형변경시 부가세변경 관련 팝업창
4. Precaution  :
5. History     :	2018.03.13(양미진) - 부가세율적용 재계산시 선계산 항목 체크
6. Old File    : none
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ES_VAT_CH", {

    pageID: null,


/**************************************************************************************************** 
* user opion Variables(사용자변수 및 객체) 
****************************************************************************************************/
    saveComplete: true,
    labels : [],
    itemValues : [],
    pAmts: [],
    applyCheckItems: {
        defaultCalc: {
            price: ['supply_amt', 'vat_amt'],
            supply_amt: ['vat_amt'],
            vat_amt : [],
            p_amt1: [],
            p_amt2: [],
        },
        userCalc: {
            price: [],
            supply_amt: [],
            vat_amt: [],
            p_amt1: [],
            p_amt2: [],
        }
    },


/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.saveComplete = true; // 연속클릭 막기
        this.labels = [ecount.resource.LBL02475, ecount.resource.LBL35133, ecount.resource.LBL00540, ecount.resource.LBL01356];
        this.itemValues = ['0', 'price', 'supply_amt', 'vat_amt'];
        this.pAmts = this.viewBag.FormInfos.CheckFormInfo.columns.where(function (item) { return (item.id == "p_amt1" || item.id == "p_amt2") && item.defaultValueType == "F"; });
        var firstCol = ['price', 'supply_amt', 'vat_amt'];
        var thisObj = this;
        this.pAmts.forEach(function (item, i) {
            for (var i = 0; i < firstCol.length; i++) {
                if (item.defaultCalcInVal.match(firstCol[i]) != null) {
                    thisObj.labels.push(item.title);
                    thisObj.itemValues.push(item.id);
                    break;
                }
            }
        });
        var calcItems = this.viewBag.FormInfos.CheckFormInfo.columns.where(function (item) { return (["supply_amt", "vat_amt"].contains(item.id.trim()) && item.defaultInType == "C") || (["p_amt1", "p_amt2"].contains(item.id.trim()) && item.defaultValueType == "F"); })
        this.itemValues.where(function (item) { return item != "0"; }).forEach(function (key) {
            for (var i = 0; i < calcItems.length; i++) {
                if (calcItems[i].defaultCalcInVal.match(key) != null) {
                    thisObj.applyCheckItems.userCalc[key].push(calcItems[i].id);
                }
            }
        });
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },


/****************************************************************************************************
* UI Layout setting
* http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
****************************************************************************************************/
    
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL12098);
    },

    onInitContents: function (contents) {
        //위젯 인스턴스 생성
        var generator = widget.generator,
             toolbar = generator.toolbar(),
             toolbar2 = generator.toolbar(),
             toolbar3 = generator.toolbar(),
            ctrl = generator.control();
        var thisRoot = this;
        
        //TODO css에서 공통으로 적용할수 없는지 확인 (label 위젯 쓸때마다 control-inline 클래스 넣어야 하는지 디자인팀 확인)  tp.68571 
        toolbar.addLeft(ctrl.define("widget.label", "warnningMessgae").label(ecount.resource.MSG06862).css("control-inline").useHTML());    
        toolbar2.addLeft(ctrl.define("widget.label", "messgae").label(String.format("</br>[{0}]", ecount.resource.LBL12099)).css("control-inline").useHTML());
        toolbar3.addLeft(ctrl.define("widget.checkbox.whole", "calcItems"));
        
        //폼추가
        contents
            .add(toolbar)
            .add(toolbar2)
            .add(toolbar3);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.LBL02388))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00854));
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        var defaultParam = [];
        var res = ecount.resource;
        var _self = this;

        switch (cid) {
        	case "calcItems":
        		control.label(this.labels).value(this.itemValues).select('0', 'price', 'supply_amt', 'vat_amt', 'p_amt1', 'p_amt2').isSerializeByAll(); /*customize*/
        		break;
        };
    },



/**************************************************************************************************** 
* define common event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
****************************************************************************************************/
    

    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (event) {
        if (!this.IS_PRICE_RIGHT) {
            var checkCtrl = this.contents.getControl("calcItems");
            checkCtrl.setCheckedValue("price", false);
            checkCtrl.setReadOnly(true, 1);
        }

        var calcItems = this.viewBag.FormInfos.CheckFormInfo.columns.where(function (item) { return (["supply_amt", "vat_amt"].contains(item.id.trim()) && item.defaultInType == "C") || (["p_amt1", "p_amt2"].contains(item.id.trim()) && item.defaultValueType == "F"); });

        calcItems.forEach(function (key) {
        	//계산식에 단가가 있을 경우
        	if (key.defaultCalcInVal.contains(["price"]) == true) {
        		this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        	}

        	//계산식에 공급가액이 있을 경우
        	if (key.defaultCalcInVal.contains(["supply_amt"]) == true) {
        		this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        	}

        	//계산식에 부가세가 있을 경우
        	if (key.defaultCalcInVal.contains(["vat_amt"]) == true) {
        		this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        	}
        }.bind(this));
    },

    onPopupHandler: function (control, config, handler) {
       handler(config);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (message) { },

    onFocusOutHandler: function (event) {
        this.footer.getControl("Save").setFocus(0);
    },
    //데이터 변경시 발생
    onChangeControl: function (control, data, command) {
        switch (control.cid) {
        	case "calcItems":
        		var checked = this.contents.getControl("calcItems").getCheckedValue();
        		var calcItems = this.viewBag.FormInfos.CheckFormInfo.columns.where(function (item) { return (["supply_amt", "vat_amt"].contains(item.id.trim()) && item.defaultInType == "C") || (["p_amt1", "p_amt2"].contains(item.id.trim()) && item.defaultValueType == "F"); });

        		calcItems.forEach(function (key) {
        			if (key.defaultCalcInVal.contains(["price"]) == true && key.defaultCalcInVal.contains(["supply_amt"]) == true && key.defaultCalcInVal.contains(["vat_amt"]) == true) {
        				//계산식에 단가, 공급가액, 부가세가 있을 경우
        				if (checked.contains("price") == false) {
        					if (checked.contains("supply_amt") == false && checked.contains("vat_amt") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
							}        					
        				} else {
        					if (checked.contains("supply_amt") == true && checked.contains("vat_amt") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
							}
        				}

        				if (checked.contains("supply_amt") == false) {
        					if (checked.contains("price") == false && checked.contains("vat_amt") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("price") == true && checked.contains("vat_amt") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

        				if (checked.contains("vat_amt") == false) {
        					if (checked.contains("price") == false && checked.contains("supply_amt") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("price") == true && checked.contains("supply_amt") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

        				if (control.cindex == 4 || control.cindex == 5) {
							if (checked.contains("price") == true && checked.contains("supply_amt") == true && checked.contains("vat_amt") == true) {
								this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
							} else if (checked.contains("price") == false || checked.contains("supply_amt") == false || checked.contains("vat_amt") == false) {
								this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
							}
						}
        			} else if (key.defaultCalcInVal.contains(["price"]) == true && key.defaultCalcInVal.contains(["supply_amt"]) == true) {
        				//계산식에 단가, 공급가액이 있을 경우
        				if (checked.contains("price") == false) {
        					if (checked.contains("supply_amt") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("supply_amt") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

        				if (checked.contains("supply_amt") == false) {
        					if (checked.contains("price") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("price") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

        				if (control.cindex == 4 || control.cindex == 5) {
        					if (checked.contains("price") == true && checked.contains("supply_amt") == true) {
								this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					} else {
								this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
							}
						}
        			} else if (key.defaultCalcInVal.contains(["price"]) == true && key.defaultCalcInVal.contains(["vat_amt"]) == true) {
        				//계산식에 단가, 부가세가 있을 경우
        				if (checked.contains("price") == false) {
        					if (checked.contains("vat_amt") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("vat_amt") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

        				if (checked.contains("vat_amt") == false) {
        					if (checked.contains("price") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("price") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

						if (control.cindex == 4 || control.cindex == 5) {
							if (checked.contains("price") == true && checked.contains("vat_amt") == true) {
								this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
							} else {
								this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
						}
        			} else if (key.defaultCalcInVal.contains(["supply_amt"]) == true && key.defaultCalcInVal.contains(["vat_amt"]) == true) {
        				//계산식에 공급가액, 부가세가 있을 경우
        				if (checked.contains("supply_amt") == false) {
        					if (checked.contains("vat_amt") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("vat_amt") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

        				if (checked.contains("vat_amt") == false) {
        					if (checked.contains("supply_amt") == false) {
        						this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				} else {
        					if (checked.contains("supply_amt") == true) {
        						this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					}
        				}

        				if (control.cindex == 4 || control.cindex == 5) {
        					if (checked.contains("supply_amt") == true && checked.contains("vat_amt") == true) {
								this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        					} else {
								this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        						this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        					}
        				}
					} else if (key.defaultCalcInVal.contains(["price"]) == true) {
        				//계산식에 단가가 있을 경우
        				if (checked.contains("price") == false) {
        					this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        					this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        				} else {
        					this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        					this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        				}
        			} else if (key.defaultCalcInVal.contains(["supply_amt"]) == true) {
        				//계산식에 공급가액이 있을 경우
        				if (checked.contains("supply_amt") == false) {
        					this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        					this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        				} else {
        					this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        					this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
						}
        			} else if (key.defaultCalcInVal.contains(["vat_amt"]) == true) {
        				//계산식에 부가세가 있을 경우
        				if (checked.contains("vat_amt") == false) {
        					this.contents.getControl("calcItems").setReadOnly(false, this.itemValues.indexOf(key.id));
        					this.contents.getControl("calcItems").setCheckedValue([key.id], false, true);
        				} else {
        					this.contents.getControl("calcItems").setReadOnly(true, this.itemValues.indexOf(key.id));
        					this.contents.getControl("calcItems").setCheckedValue([key.id], true, true);
        				}
        			}
        		}.bind(this));

                break;
        }
    },
   

/****************************************************************************************************
* define grid event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/

/**************************************************************************************************** 
* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
****************************************************************************************************/
    onClosedPopupHandler: function (pageID, isClick) {
        if (isClick) {
            this.onFooterSave({ cid: "close", isClose: true });
        }
    },
    //닫기버튼
    onFooterClose: function (e) {
        this.onFooterSave(e);
    },
    //저장
    onFooterSave: function (e) {
        var isCalc = !(e.cid == "close");
        var checkItemsTemp = this.contents.getControl("calcItems").getCheckedValue(), checkItem = {
            price: false,
            supply_amt: false,
            vat_amt: false,
            p_amt1: true,
            p_amt2: true,
            isCalc: true
        };
        checkItem.isCalc = isCalc;
        for (var i = 0; i < checkItemsTemp.length; i++) {
            if (checkItemsTemp[i] != "0") {
                checkItem[checkItemsTemp[i]] = true;
            }
        }
        var message = {
            data: { checkItem: checkItem},
            //callback: this.close.bind(this)
        };

        if (!e.isClose) {
            message.callback = this.close.bind(this);
        }

        this.sendMessage(this, message);
    },

/**************************************************************************************************** 
*  define hotkey event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
****************************************************************************************************/
    


/**************************************************************************************************** 
* define user function 
****************************************************************************************************/    
    

});