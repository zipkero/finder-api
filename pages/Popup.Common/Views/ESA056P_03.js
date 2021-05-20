window.__define_resource && __define_resource("LBL01809","LBL01595","LBL08019","BTN00227","BTN00008","LBL07531","MSG10096","MSG10118");
/****************************************************************************************************
1. Create Date : 2015.05.28
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department
                 재고1 > 기초등록 > 품목등록 > 계층그룹 > 왼쪽부분 목록의 fn 클릭 > 권한보기
4. Precaution  :
5. History     : 2015.10.28(ShinHeeJun) 계층그룹 공통페이지 사용할 수 있게 수정
                 2015.11.28(LeeIlYong) 계층그룹 권한 리스트 조회 - 품목추가
                 2016.02.17(Nguyen Anh Tuong) 창고계층그룹 공통화 Location Level Group Standardization
                 2016.03.28 (seongjun-Joe) 소스리팩토링.
                 2109.06.10 (문요한) 거래처, 부서, 품목, 창고 계층그룹 팝업 > 권한보기 > '그룹에서 해제' 버튼 제거 
6. Old File    : ESA056P_03.aspx                  
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA056P_03", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    searchFormParameter: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.searchFormParameter = { CD_GROUP: this.PCode, SORT_COLUMN: "UNAME", SORT_TYPE: "A" };
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var grid = widget.generator.grid();

        var url = '';
        switch (this.LevelGroupType) {
            case 'CUST':
                url = '/Account/Basic/GetCustLevelGroupAuth';
                break;
            case 'PROD':
                url = '/Inventory/Basic/GetProdLevelGroupAuth';
                break;
            case 'WH':
                url = '/Inventory/Basic/GetListAuthenByLocationLevelName';
                break;
            default:
                url = '/Account/Basic/GetDeptLevelGroupAuth';
                break;
        }

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.gridLoad)
            .setRowDataUrl(url)
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['ID'])
            .setColumns([
                { propertyName: 'ID', id: 'ID', title: ecount.resource.LBL01809, width: 110 },
                { propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL01595, width: '' },
                { propertyName: '', id: 'AUTH', title: ecount.resource.LBL08019, width: 60, align: "center" }
            ])
            .setColumnFixHeader(true)

            //Show checkbox column
            .setCheckBoxUse(false)
            .setCheckBoxRememberChecked(false)

            //Sorting
            .setColumnSortEnableList(['ID', 'UNAME'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.viewBag.InitDatas.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'success')
            //Custom cells
            .setCustomRowCell('AUTH', this.setAuthColumn.bind(this))
            .setCustomRowCell(ecount.grid.constValue.checkBoxPropertyName, this.setChkDisable.bind(this));

        contents.addGrid("dataGrid", grid);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        //toolbar.addLeft(ctrl.define("widget.button", "Delete").label(ecount.resource.BTN00227).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).clickOnce().css("btn btn-default"));

        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        this.changeTitle(this.PText);
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //onFooterDelete: function () {
    //    var btnDelete = this.footer.get(0).getControl("Delete");

    //    if (this.viewBag.Permission.PermitTree.Value != 'W') {
    //        var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07531, PermissionMode: 'U' }]);
    //        ecount.alert(msgdto.fullErrorMsg);
    //        btnDelete.setAllowClick();
    //        return false;
    //    }

    //    var selectItem = this.contents.getGrid().grid.getChecked();

    //    if (selectItem.count() == 0) {
    //        ecount.alert(ecount.resource.MSG10096);
    //        btnDelete.setAllowClick();
    //        return false;
    //    }

    //    var thisObj = this;

    //    ecount.confirm(ecount.resource.MSG10118, function (status) {
    //        if (status === true) {
    //            var idList = '';
    //            $.each(selectItem, function (i, data) {
    //                switch (thisObj.LevelGroupType) {
    //                    case 'CUST':
    //                        idList += data.ID + ecount.delimiter;
    //                        break;
    //                    case 'PROD':
    //                        idList += data.ID + ecount.delimiter;
    //                        break;
    //                    case 'WH':
    //                        idList += data.ID + ecount.delimiter;
    //                        break;
    //                    default:
    //                        idList += data.ID + 'ㆍ';
    //                        break;
    //                }
    //            });

    //            var data = {
    //                CD_GROUP: thisObj.PCode,
    //                ID_LIST: idList
    //            };



    //            var callUrl = '';
    //            switch (thisObj.LevelGroupType) {
    //                case 'CUST':
    //                    callUrl = '/SVC/Account/Basic/DeleteCustLevelGroupAuth';
    //                    data = {
    //                        Request: {
    //                            Data: data
    //                        }
    //                    };
    //                    break;
    //                case 'PROD':
    //                    callUrl = '/Inventory/Basic/DeleteProdLevelGroupAuth';
    //                    break;
    //                case 'WH':
    //                    callUrl = '/SVC/Inventory/Basic/DeleteAuthenticationLevelGroupNode';
    //                    data = {
    //                        CD_GROUP: thisObj.PCode,
    //                        ID_USER: idList
    //                    };
    //                    break;
    //                default:
    //                    data = {
    //                        Request: {
    //                            Data: {
    //                                CD_GROUP: thisObj.PCode,
    //                                CD_LIST: idList
    //                            }
    //                        }
    //                    };

    //                    callUrl = '/SVC/Account/Basic/DeleteDeptLevelGroupAuth';
    //                    break;
    //            }

    //            ecount.common.api({
    //                //url: thisObj.LevelGroupType == 'CUST' ? "/Common/Basic/DeleteCustLevelGroupAuth" : "/Common/Basic/DeleteDeptLevelGroupAuth",
    //                url: callUrl,
    //                data: Object.toJSON(data),
    //                success: function (result) {
    //                    if (result.Status != "200")
    //                        ecount.alert(result.fullErrorMsg);
    //                    else
    //                        thisObj.contents.getGrid().draw(thisObj.searchFormParameter);
    //                },
    //                complete: function () {
    //                    btnDelete.setAllowClick();
    //                }
    //            });
    //        } else {
    //            btnDelete.setAllowClick();
    //        }
    //    });
    //},

    //Close button click event
    onFooterClose: function () {
        this.close();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    setAuthColumn: function (value, rowItem) {
        var option = {};
        if (this.LevelGroupType == 'CUST')
            option.data = rowItem.ALL_GROUP_CUST.toString() == "0" ? "Y" : "N";
        else if (this.LevelGroupType == 'PROD')
            option.data = rowItem.ALL_GROUP_PROD.toString() == "0" ? "Y" : "N";
        else if (this.LevelGroupType == 'WH')
            option.data = rowItem.ALL_GROUP_WH.toString() == "0" ? "Y" : "N";
        else
            option.data = rowItem.ALL_GROUP_SITE.toString() == "0" ? "Y" : "N";
        return option;
    },

    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['CS'] == "Y" && this.LevelGroupType == 'WH')
            return true;
        return false;
    },

    setChkDisable: function (value, rowItem, dataTypeConvertor) {
        var option = {};
        option.attrs = {};

        if (this.LevelGroupType == 'CUST') {
            if (rowItem.ALL_GROUP_CUST.toString() == "0")
                option.attrs['disabled'] = 'true';
        } else if (this.LevelGroupType == 'PROD') {
            if (rowItem.ALL_GROUP_PROD.toString() == "0")
                option.attrs['disabled'] = 'true';
        } else if (this.LevelGroupType == 'WH') {
            if (rowItem.ALL_GROUP_WH.toString() == "0")
                option.attrs['disabled'] = 'true';
        } else {
            if (rowItem.ALL_GROUP_SITE.toString() == "0")
                option.attrs['disabled'] = 'true';
        }
        return option;
    }
});