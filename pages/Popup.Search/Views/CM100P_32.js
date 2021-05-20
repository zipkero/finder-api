window.__define_resource && __define_resource("LBL12335","LBL09363","LBL03311","LBL03312","LBL01688","LBL08484","LBL08485","LBL08947","BTN00008");
/****************************************************************************************************
1. Create Date : 2017.03.16
2. Creator     : 한아름
3. Description : 입력메뉴검색
4. Precaution  : 
5. History     : 
            
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_32", {
    gridObject: null,
    inPartList: null,   
    returnParams : null,

    //data: [],
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            SEARCH: this.keyword,            
            CLASS_CD: this.MENU_TYPE
        };

        this.inPartList = {};

        
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();

        header.setTitle(ecount.resource.LBL12335).useQuickSearch();

    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            grid = generator.grid();

        var title1 = ecount.resource.LBL09363;
        var title2 = ecount.resource.LBL03311;
        var title3 = ecount.resource.LBL03312;

        var id01 = "0";
        var id02 = "2";
        var id03 = "1"
        if (this.MENU_TYPE == "LU25") {
            title1 = ecount.resource.LBL01688;
            title2 = ecount.resource.LBL08484;
            title3 = ecount.resource.LBL08485;

            id01 = "0";
            id02 = "1";
            id03 = "2";
        }



        grid
            .setRowData(this.viewBag.InitDatas.TransactionTypeList)
            .setRowDataUrl("/Common/Infra/GetMenuUseList")
            .setRowDataParameter(this.searchFormParameter)
            .setCheckBoxRememberChecked(false)            
            .setKeyColumn(['RESX_CODE'])
            .setColumns([
                { propertyName: 'RESX_CODE', id: 'Slip', title: ecount.resource.LBL08947, width: '' },
                { propertyName: 'LINK_ITEM01', id: 'LINK_ITEM01_VALUE', title: title1, width: '', controlType: "widget.link" },
                { propertyName: 'LINK_ITEM02', id: 'LINK_ITEM02_VALUE', title: title2, width: '', controlType: "widget.link" },
                { propertyName: 'LINK_ITEM03', id: 'LINK_ITEM03_VALUE', title: title3, width: '', controlType: "widget.link" }
            ])
            .setCustomRowCell('Slip', this.setGridAccResx.bind(this))
            .setCustomRowCell('LINK_ITEM01_VALUE', this.setGridLinkID01Data.bind(this))
            .setCustomRowCell('LINK_ITEM02_VALUE', this.setGridLinkID02Data.bind(this))
            .setCustomRowCell('LINK_ITEM03_VALUE', this.setGridLinkID03Data.bind(this));

        contents.add(toolbar).addGrid("dataGrid" + this.pageID, grid);

    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
             ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        if (this.keyword) {
            this.header.getQuickSearchControl().setValue(this.keyword);
        }


        if (!e.unfocus) {
            //this.contents.getControl("search").setFocus(0);
            this.header.getQuickSearchControl().setFocus(0);
        }

    },

    onMessageHandler: function (event, data) {
        this.close();
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridAfterRowDataLoad: function (e, data) {
        this._super.onGridAfterRowDataLoad.apply(this, arguments);       
        //if ($.isArray(data.result.Data))
        //    this.makeMergeData(data.result.Data);
    },

    setGridAccResx: function (value, rowItem) {
        var option = {};

        option.controlType = "widget.label";
        option.data = ecount.resource[value];

        return option;
    },
    
    setGridLinkID01Data: function (value, rowItem) {
        var option = {};
        var self = this;
        var res = ecount.resource;  
        option.data = res[rowItem.LINK_ITEM01] 
        option.event = {
            'click': function (e, data) {                
                self.fnClickEvnet(e, data);                
            }
        }
        return option
    },
    setGridLinkID02Data: function (value, rowItem) {
        var option = {};
        var self = this;
        var res = ecount.resource;
        option.data = res[rowItem.LINK_ITEM02]
        
        option.event = {
            'click': function (e, data) {
                self.fnClickEvnet(e, data);
            }
        }
        return option
    },
    setGridLinkID03Data: function (value, rowItem) {
        var option = {};
        var self = this;
        var res = ecount.resource;
        
        option.data = res[rowItem.LINK_ITEM03]

        option.event = {
            'click': function (e, data) {
                self.fnClickEvnet(e, data);
            }
        }
        return option
    },
    
    fnClickEvnet: function (e, data) {

        var self = this;

        self.responseID = self.callbackID;

        self.sendMessage(self, {
            VALUE: data.rawRowItem[data.columnId], MENU_RESX_CODE: data.rawRowItem.MENU_RESX_CODE, URL_PATH: data.rawRowItem.URL_PATH, CLASS_SEQ: data.rawRowItem.CLASS_SEQ,
            callback: function (params) {
                    
                if (params == false) return;
                
                if (self.MENU_SEQ == "489" && data.rawRowItem.CLASS_SEQ == 10) {
                    //this.eapprovalList = params.eapprovalList;
                }
                else {
                    var path_url = (params != undefined && params.url != undefined) ? params.url : data.rawRowItem.URL_PATH
                    if (path_url == "/ECERP/ESD/ESD006M") {
                        path_url = "/ECERP/SVC/ESD/ESD006M";
                    }
                    params.isOpenPopup = true;
                    params.parentPopupID = self.getParentInstance().ecPageID;

                    if (params.popupType) {
                        this.openWindow({
                            url: path_url,
                            param: params,
                            popupType: true,
                            fpopupID: self.ecpar,
                            width: 780,
                            height: 720
                        });
                                        
                        this.close();
                    }else {
                        this.onAllSubmitSelf({
                            url: path_url,
                            param: params,
                            popupType: params.popupType,
                            fpopupID: self.ecPageID
                        });
                    }
                }
                
                var apiParam = {
                    MENU_SEQ: self.MENU_SEQ,
                    CLASS_CD: data.rowItem.CLASS_CD,
                    CLASS_SEQ: data.rawRowItem.CLASS_SEQ
                    //URL: url Api.Common.Infra
                };

                //최근입력메뉴 저장
                ecount.common.api({
                    url: "/Common/Infra/SaveComnMenuHistory",
                    data: Object.toJSON(apiParam),
                    success: function (result) {
                        if (result.Status != "200") {
                            runSuccessFunc = result.Status == "202";
                            ecount.alert(result.Error);
                        }
                        //else {
                        //    if (result.Data != null && result.Data != undefined) {
                        //        callBack && callBack(true);
                        //    }
                        // }
                    },
                    complete: function () {
                     //self.close();                        
                    }
                });

            }.bind(self)
        });
    },


    sendToApproval: function (serNo, DocGubun, strchkvalue) {
        debugger;
        var self = this;
        //var strchkvalue = this.eapprovalList;

        var strchkvalue = strchkvalue;

        if (strchkvalue != "") {
            var strEdmsIdx = "";
            //1.전자 결재 저장
            var strData = "BizType=4&SerNo=" + serNo;
            var url = ecount.common.buildSessionUrl("/ECMain/EGD/EGD002M_DATA.aspx");

            $.ajax({
                type: "POST",
                url: url,
                data: strData,
                error: function (errorMsg) {
                    alert("에러발생\nbtnSend:" + errorMsg);
                    return;
                },
                success: function (returnResult) {
                    strEdmsIdx = returnResult;

                    var popupUrl = String.format("/ECMain/EGD/EGD002M.aspx?EditFlag=M&AppType=0&EdmsIdx={0}&RView=N&DocGubun={1}&Page=1&hidSendingPopup=Y{2}", strEdmsIdx, DocGubun, strData);

                    var param = {
                        width: 850,
                        height: 720,
                        hidchkvalue: strchkvalue
                    }

                    self.openWindow({
                        url: popupUrl,
                        name: 'frmECSend',
                        param: param,
                        popupType: true,
                        fpopupID: self.ecPageID
                    });

                }
            });
        }
    },
    
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    //검색, 사용중단 
    onContentsSearch: function (event) {
        //var invalid = this.contents.getControl("Search").validate();
        var invalid = this.header.getQuickSearchControl().validate();
        if (invalid.length > 0) {
            if (!e.unfocus)
                this.header.getQuickSearchControl().setFocus(0);

            return;
        }

        this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue().keyword || '';
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);

        this.header.toggle(true);
    },
   
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    // KEY_F8
    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        if (!$.isNull(target))
            this.onContentsSearch(target.control.getValue());
    },

    onHeaderQuickSearch: function (event) {

        this.searchFormParameter.SEARCH = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();

        grid.draw(this.searchFormParameter);
    }

});
