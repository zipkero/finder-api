window.__define_resource && __define_resource("LBL09106","LBL09124","LBL08019","BTN00113","BTN00007","LBL00703","LBL05141","LBL05436","LBL01310","LBL01732","LBL07534","LBL02561","LBL01158","BTN00043","BTN00008","BTN00037","BTN00744","MSG00287","LBL05624","MSG00296","MSG00141","MSG03839","LBL10765","MSG00722");
/****************************************************************************************************
1. Create Date : 2016.05.23
2. Creator     : 노지혜
3. Description : 양식 샘플/공유 리스트 팝업 (Sample Forms list )
4. Precaution  : 
5. History     : 
6. MenuPath    : 양식 > 샘플보기, 양식공유 리스트(Template > Templates ,  Share Template )
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_32", {   
    falsecnt: 0,  // Failure Count(삭제실패갯수)

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.acctPermit = this.viewBag.Permission.Account.Value; //Account Permit(회계권한)
        this.gwPermit = this.viewBag.Permission.Gw.Value; //Gw Permit(그룹웨어권한)

        this.searchFormParameter = {
            FORM_TYPE: this.formtype
            , LAN_TYPE_SEARCH: this.viewBag.Language
            , TITLE_NM: null
            , PARAM: this.keyword
            , listFlag: this.listFlag
        };
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
        header.setTitle(this.listFlag == "S" ? ecount.resource.LBL09106 : ecount.resource.LBL09124).useQuickSearch();
        
        //퀵서치 추가
        var contents = widget.generator.contents(),
        tabContents = widget.generator.tabContents(),
        form1 = widget.generator.form(),
        toolbar = widget.generator.toolbar();
        var ctrl = widget.generator.control();
        
        var opts = [];
        var lst = this.viewBag.InitDatas.LanguageType;
            
        lst.forEach(function (o) {
            if (o.Key.CLASS_SEQ == 0) {
                opts.push(["", ecount.resource.LBL08019]);
            }
            else {
                opts.push([o.ITEM1, o.ITEM2]);
            }
        });         

        //검색하단 버튼
        toolbar
            .addLeft(ctrl.define("widget.button", "search").label(ecount.resource.BTN00113))
            .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007))

        //검색창 검색어
        form1.add(ctrl.define("widget.multiCode.cofmFormCmcd", "FORM_TYPE", "FORM_TYPE", ecount.resource.LBL00703).end()) //구분
            .add(ctrl.define("widget.select", "LAN_TYPE_SEARCH", "LAN_TYPE_SEARCH", ecount.resource.LBL05141) //언어
                .option(opts).end())
            .add(ctrl.define("widget.input", "TITLE_NM", "TITLE_NM", ecount.resource.LBL05436).end()) //제목

        contents.add(form1);    //검색어
        contents.add(toolbar);  //버튼

        header.add("search")
            .addContents(contents);
      
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            columns = [
                { propertyName: 'ROWNUMBER', id: 'ROWNUMBER', title: ecount.resource.LBL01310, width: '50', align: 'center' },
                { propertyName: 'FORM_NAME', id: 'FORM_NAME', title: ecount.resource.LBL00703, width: '90', align: 'center' },
                { propertyName: 'LAN_TYPE_NM', id: 'LAN_TYPE_NM', title: ecount.resource.LBL05141, width: '100', align: 'center' },
                { propertyName: 'TITLE_NM', id: 'TITLE_NM', title: ecount.resource.LBL05436, width: ''}               
            ];

        if (this.listFlag == "D") {
            columns.push({ propertyName: 'MODIFY', id: 'MODIFY', title: ecount.resource.LBL01732, width: '50', align: 'center' });
            columns.push({ propertyName: 'VIEW', id: 'VIEW', title: ecount.resource.LBL07534, width: '50', align: 'center' });
            columns.push({ propertyName: 'READ_CNT', id: 'READ_CNT', title: ecount.resource.LBL02561, width: '50', align: 'center' });
        }
        else
        {
            columns.push({ propertyName: 'VIEW', id: 'VIEW', title: ecount.resource.LBL07534, width: '50', align: 'center' });
            if(this.isShareView && this.listFlag == "S")
                columns.push({ propertyName: 'DELETE', id: 'DELETE', title: ecount.resource.LBL01158, width: '50', align: 'center' });
        }

        settings
            .setRowData(this.viewBag.InitDatas.FormSampleList)
            .setRowDataUrl('/Common/Form/GetListSampleForm')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['ROWNUMBER', 'FORM_TYPE','FORM_SEQ'])           
            .setColumns(columns)
            .setColumnSortable(true)
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setColumnSortDisableList(['ROWNUMBER', 'TITLE_NM', 'MODIFY', 'VIEW', 'READ_CNT','DELETE'])
            .setCheckBoxUse(this.isCheckBoxDisplayFlag)
            .setCheckBoxMaxCountExceeded(this.setItemCountMessage.bind(this))
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('TITLE_NM', this.setGridTitleDate.bind(this))
            .setCustomRowCell('MODIFY', this.setGridModifyDateLink.bind(this))
            .setCustomRowCell('VIEW', this.setGridViewDateLink.bind(this))
            .setCustomRowCell('DELETE', this.setGridDeleteDateLink.bind(this))
            .setEventFocusOnInit(true)                  //Focus 이벤트 시작
            .setKeyboardCursorMove(true)                // 위, 아래 방향키
            .setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            .setKeyboardPageMove(true)                  // 페이징 이동
            .setKeyboardEnterForExecute(true)
            .setCheckBoxActiveRowStyle(true);
              
        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },    

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        
        if (this.isNewDisplayFlag || this.isShareView) 
            toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));   

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));               
        
        if (this.isDeleteDisplayFlag)
            toolbar.addLeft(ctrl.define("widget.button", "selectedDelete").label(ecount.resource.BTN00037));

        if (this.isDonationFlag && this.isShareView)
            toolbar.addLeft(ctrl.define("widget.button", "donation").label(ecount.resource.BTN00744));
        
        footer.add(toolbar);
    },

    //팝업띄울경우
    onPopupHandler: function (control, param, handler) {
        if (control.id == "FORM_TYPE") {       // 
            param.isApplyDisplayFlag = true;       // apply 
            param.isCheckBoxDisplayFlag = true;    // checkbox
            param.classCd = 'LU04';
        }

        handler(param);
    },    

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        if (control.id == "FORM_TYPE" ) {
            parameter.CLASS_CD = "LU04"; 
        }

        handler(parameter);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {
        var self = this;

        if (!$.isNull(self.keyword)) {
            self.header.getQuickSearchControl().setValue(self.keyword);
        }

        if (!$.isNull(self.formtype)) {
            var formName= self.viewBag.InitDatas.MenuTypeLoad[0].FORM_NM;
            self.header.getControl("FORM_TYPE").addCode({ label: formName, value: self.formtype });
            //self.searchFormParameter.FORM_TYPE = self.formtype;
        }
        self.header.getControl("LAN_TYPE_SEARCH").setValue(self.viewBag.Language);
        //self.searchFormParameter.LAN_TYPE_SEARCH = self.viewBag.Language;
               
        var grid = self.contents.getGrid();
        grid.getSettings().setHeaderTopMargin(self.header.height());
        if (!e.unfocus) {
            self.header.getQuickSearchControl().setFocus(0);
        }

        this.searchFormParameter = $.extend({}, this.searchFormParameter, this.header.serialize().result);


    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    setGridTitleDate: function (value, rowItem) {
        var self = this,
        option = {};
        if (value.length > 40)
            value = value.substring(0, 40) + '..';

        option.data = value;
        return option;
    },

    //grid row의 특정 date관련 - 수정 D
    setGridModifyDateLink: function (value, rowItem) {
        var self = this,  
            option = {};
        option.data = ecount.resource.LBL01732;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                if (self.setPermit(data.rowItem.CATEGORY) != "W") {
                    ecount.alert(ecount.resource.MSG00287);
                    return false;
                }

                ecount.confirm("양식샘플등록/수정시 현재 접속한 Zone에만 적용됩니다. \r\n 모든 Zone에서 동일하게 신규등록/수정바랍니다.", function (status) {
                    if (status == true) {
                        var param = {
                            width: 850,
                            height: 600,
                            formType: data.rowItem.FORM_TYPE,
                            formSeq: data.rowItem.FORM_SEQ,
                            cateGory: data.rowItem.CATEGORY,
                            listFalg: self.listFlag,
                            editFlag: 'M'
                        }

                        ecount.grid.resetActiveGrid();

                        self.openWindow({
                            url: '/ECERP/POPUP.FORM/CM100P_33',
                            //name: ecount.resource.LBL09124,
                            param: param,
                            additional: true
                        });
                    }
                });
            }.bind(this)
        };
        return option;
    },

    //grid row의 특정 date관련 - 보기 S
    setGridViewDateLink: function (value, rowItem) {

        var self = this,
            option = {};
        option.data = ecount.resource.LBL07534;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) { 
                var param = {
                    width: 850,
                    height: 600,
                    formType: data.rowItem.FORM_TYPE,
                    formSeq: data.rowItem.FORM_SEQ,
                    cateGory: data.rowItem.CATEGORY,
                    listFlag: self.listFlag,
                    isApplyDisplayFlag: self.listFlag == 'S' ? true : false,
                    isShareView: self.listFlag == 'S' ? self.isShareView : false
                }

                self.openWindow({
                    url: '/ECERP/POPUP.FORM/CM100P_34',
                    name: ecount.resource.LBL05624,
                    param: param,
                    additional: true
                });
            }.bind(this)
        };
        return option;
    },

    //grid row의 특정 date관련 - 삭제 
    setGridDeleteDateLink: function (value, rowItem) {
        var self = this;
        var option = {};        
        option.data = ecount.resource.LBL01158;
        option.controlType = "widget.link";
        option.attrs = {
            'class': 'text-danger'
        };
        option.event = {
            'click': function (e, data) {
                ecount.confirm("양식샘플등록/수정시 현재 접속한 Zone에만 적용됩니다. \r\n 모든 Zone에서 동일하게 신규등록/수정바랍니다.", function (status) {
                    if (status == true) {
                        ecount.confirm(ecount.resource.MSG00296, function (status) {
                            if (status == true) {
                                if (self.setPermit(data.rowItem.CATEGORY) != "W") {
                                    ecount.alert(ecount.resource.MSG00141);
                                    return false;
                                }
                                var arryData = [];
                                arryData.push({
                                    FORM_TYPE: data.rowItem.FORM_TYPE,
                                    FORM_SEQ: data.rowItem.FORM_SEQ
                                });
                                self.setDeleteApi(arryData);
                            }
                        });
                    }
                });
            }.bind(this)
        };
        return option;
    },
        
    //체크박스 체크갯수 제한
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },

    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId == "FORM_NAME" ? "FORM_TYPE": "LAN_TYPE"  ;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onHeaderSearch: function (event) {
        this.onContentsSearch('button');
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //신규버튼
    onFooterNew: function () {
        var self = this;
        if (self.acctPermit == "W" || self.invenPermit == "W" || self.gwPermit == "W") {

            ecount.confirm("양식샘플등록/수정시 현재 접속한 Zone에만 적용됩니다. \r\n 모든 Zone에서 동일하게 신규등록/수정바랍니다.", function (status) {
                if (status == true) {
                    var param = {
                        width: 800,
                        height: 750,
                        formtype: self.formtype,
                        isViewDisplayFlag: self.listFlag == "S" ? true : false ,
                        listFlag: self.listFlag
                    }
                    ecount.grid.resetActiveGrid();
                    self.openWindow({
                        url: '/ECERP/POPUP.FORM/CM100P_33',
                        name: ecount.resource.LBL10765,
                        param: param,
                        additional: true
                    });
                }
            });

        }
        else {
            ecount.alert(ecount.resource.MSG00287);
            self.footer.getControl("New").setAllowClick();
            return false;
        }

    },
    
    //양식공유버튼
    onFooterDonation: function () {
        var self = this;
        if (self.acctPermit == "W" || self.invenPermit == "W" || self.gwPermit == "W") {
            var param = {
                width: 800,
                height: 750,
                formtype: self.formtype,
                listFlag: 'D'
            }

            self.openWindow({
                url: '/ECERP/POPUP.FORM/CM100P_32',
                name:  ecount.resource.LBL09124,
                param: param,
                additional: true
            });
        }
        else {
            ecount.alert(ecount.resource.MSG00287);
            self.footer.getControl("Donation").setAllowClick();
            return false;
        }
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //검색 
    onContentsSearch: function (event) {
        var searchParam = $.extend({ }, this.searchFormParameter, this.header.serialize().result);        
        searchParam.PARAM = "";
        this.searchFormParameter = searchParam;            

        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.contents.getGrid().grid.settings().setCheckBoxClearChecked();
                        
        this.contents.getGrid().grid.settings().setEventFocusOnInit(false);
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().setFocus(0);
        this.header.getQuickSearchControl().setValue("");
        this.header.toggle(true);
    },

    // 다시작성 
    onHeaderRewrite: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },


    // 선택삭제(chioce delete) button click event
    onFooterSelectedDelete: function (e) {
        var self = this;
        var btnDelete = self.footer.getControl("selectedDelete"), 
            selectItem = self.contents.getGrid().grid.getChecked(),
            selectedCnt = selectItem.length,
            arryData = [];

        if (selectedCnt == 0) {
            ecount.alert(ecount.resource.MSG00722);
            btnDelete.setAllowClick();
            return;
        }
        ecount.confirm("양식샘플등록/수정시 현재 접속한 Zone에만 적용됩니다. \r\n 모든 Zone에서 동일하게 신규등록/수정바랍니다.", function (status) {
            if (status == true) {
                ecount.confirm(ecount.resource.MSG00296, function (status) {
                    if (status == true) {
                        falsecnt = 0;
                        $.each(selectItem, function (i, val) {
                            arryData.push({
                                FORM_TYPE: val.FORM_TYPE,
                                FORM_SEQ: val.FORM_SEQ
                            });
                            if (self.setPermit(val.CATEGORY) != "W") {
                                falsecnt++;
                            }
                        });
                        self.setDeleteApi(arryData);
                    }
                });
            }
        });
        btnDelete.setAllowClick();
    },

    //삭제api
    setDeleteApi: function (data) {
        var self = this;
        ecount.common.api({
            url: "/Common/Form/DeleteSampleForm",            
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status == "200") {
                    //if(falsecnt > 0)
                    //    ecount.alert(ecount.resource.MSG00141);
                }
            },
            complete: function () {
                self.contents.getGrid().grid.clearChecked();
                self.contents.getGrid().draw(self.searchFormParameter);
                self.hideProgressbar(true);
            }
        });
    },

    setPermit: function(value){
        var userPermit = "";
        var self = this;
        switch (value) {
            case "INVEN":
                userPermit = self.invenPermit;
                break;
            case "ACCT":
                userPermit = self.acctPermit;
                break;
            case "GW":
                userPermit = self.gwPermit;
                break;
        }
        return userPermit;
    },

    onMessageHandler: function (event, data) {
        var firstData = data.data || data,
            self = this;

        if (event.pageID == "CM100P_33") {
            self.contents.getGrid().draw(self.searchFormParameter);
        }
        else if (event.pageID == "CM100P_34") {
            var message = {
                type: "getFormViewHtml",
                data: data,
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } 
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // KEY_F2
    ON_KEY_F2: function () {
        if (this.isNewDisplayFlag || this.isShareView)
            this.onFooterNew();
    },

    // KEY_F8
    ON_KEY_F8: function () {
        if (this.header.isVisible()) {
            this.onContentsSearch('button', '');
        }
        else if (this.isApplyDisplayFlag)
            this.onFooterApply();
    },

    // KEY_Mouseup
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
        this.gridFocus && this.gridFocus();
    },

    onHeaderQuickSearch: function (event) { 
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        searchParam.TITLE_NM = "";
        searchParam.PARAM = this.header.getQuickSearchControl().getValue();
        this.searchFormParameter = searchParam;

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },


    ON_KEY_ENTER: function (e, target) {
        if (target != null && target.cid == "Search") {
            this.onHeaderSearch();
        }
    },


    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
   
});