window.__define_resource && __define_resource("LBL09297","LBL09298","LBL09222","MSG01136","MSG00550","LBL09223","BTN00356","BTN00008","LBL07531","MSG04528","MSG04971","MSG04969","MSG00291","MSG05516","MSG04958","LBL07244","LBL07243","LBL07309","MSG08770","MSG02642","MSG09073","MSG09929");
/****************************************************************************************************
1. Create Date : 2015.05.28
2. Creator     : Le Dan
3. Description : Acct. I > Setup > Department
                 재고1 > 기초등록 > 품목등록 > 계층그룹 > 왼쪽부분 목록의 fn 클릭 > 그룹추가
4. Precaution  :
5. History     : 2015.09.07(LEDAN)  - Get resource from common js file
                 2015.10.28(ShinHeeJun) 계층그룹 공통페이지 사용할 수 있게 수정
                 2015.11.23(LeeIlYong) 품목계층그룹 사용할 수 있게 수정
                 2016.02.17(Nguyen Anh Tuong) 창고계층그룹 공통화 Location Level Group Standardization
                 2016.03.28 (seongjun-Joe) 소스리팩토링.
                 2019.04.01 (문요한) : 마리아 동기화 작업 - 거래처 계층그룹 저장
                 2019.05.06 (PhiVo): A19_01230-계층그룹 신규등록 시 등록 가능 개수 제한
6. Old File    : ESA056P_04.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA056P_04", {
    pageID: null,
    header: null,
    contents: null,
    footer: null,
    off_key_esc: true,
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    // init
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    // render
    render: function () {
        this._super.render.apply(this, arguments);
    },
    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/
    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark()
            .setTitle(ecount.resource.LBL09297);
    },
    // Contents Initialization
    onInitContents: function (contents) {
        var grid = widget.generator.grid(),
            ctrl = widget.generator.control(),
            form = widget.generator.form();

        if (this.LevelGroupType == 'CUST')
            form.template("register")
                .add(ctrl.define("widget.multiCode.custLevelGroup", "txtTreeCustCd", "txtTreeCustCd", ecount.resource.LBL09298).setOptions({ label: null }).end());
        else if (this.LevelGroupType == 'PROD')
            form.template("register")
                .add(ctrl.define("widget.multiCode.prodLevelGroup", "txtTreeGroupCd", "txtTreeGroupCd", ecount.resource.LBL09298).setOptions({ label: null }).end());
        else if (this.LevelGroupType == 'WH')
            form.template("register")
                .add(ctrl.define("widget.multiCode.whLevelGroup", "txtTreeWhCd", "txtTreeWhCd", ecount.resource.LBL09298).setOptions({ label: null }).end());
        else
            form.template("register")
                .add(ctrl.define("widget.multiCode.deptLevelGroup", "txtTreeDeptCd", "txtTreeDeptCd", ecount.resource.LBL09298).setOptions({ label: null }).end());

        // Initialize Grid
        grid.setKeyColumn(['CD_GROUP', 'NM_GROUP'])
            .setEditable(true, 3)
            .setColumns([
                {
                    propertyName: 'CD_GROUP', id: 'CD_GROUP', title: ecount.resource.LBL09222, width: '150', controlType: 'widget.input.codeName',
                    controlOption: {
                        maxByte: { message: String.format(ecount.resource.MSG01136, "30", "30"), max: 30 },
                        filter: ['regexp', { message: ecount.resource.MSG00550, regexp: "#" }]
                    }
                },
                { propertyName: 'NM_GROUP', id: 'NM_GROUP', title: ecount.resource.LBL09223, width: '', controlType: 'widget.input.codeName', controlOption: { maxByte: { message: String.format(ecount.resource.MSG01136, "100", "100"), max: 100 } } }
            ])
            .setRowData([{ 'CD_GROUP': '', 'NM_GROUP': '' }])
            .setColumnFixHeader(true)
            .setEventAutoAddRowOnLastRow(true, 2, 2);

        contents.add(form).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00356).clickOnce())
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).clickOnce());
        footer.add(toolbar);
    },
    /**********************************************************************
    * define common event listener
    **********************************************************************/
    // After the document loaded
    onLoadComplete: function () {
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height())
            .setFooterBottomMargin(this.footer.height());
        var txtTreeCd = null;
        switch (this.LevelGroupType) {
            case 'CUST':
                txtTreeCd = this.contents.getControl('txtTreeCustCd');
                break;
            case 'PROD':
                txtTreeCd = this.contents.getControl('txtTreeGroupCd');
                break;
            case 'WH':
                txtTreeCd = this.contents.getControl('txtTreeWhCd');
                break;
            default:
                txtTreeCd = this.contents.getControl('txtTreeDeptCd');
                break;
        }
        txtTreeCd.addCode({ label: this.PText, value: this.PCode });
        txtTreeCd.checkMaxCount = 1;
        txtTreeCd.defaultParam.YN_USE = 'Y';
        txtTreeCd.defaultParam.GUBUN = '2';
    },
    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        gridObj.grid.setCellFocus('CD_GROUP', 0);
    },
    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
        switch (control.id) {
            case 'txtTreeCustCd':
                params.popupType = false;
                params.additional = false;
                params.Type = "SELECT";
                break;
            case 'txtTreeGroupCd':
                params.popupType = false;
                params.additional = false;
                params.Type = "SELECT";
                break;
            case 'txtTreeWhCd':
                params.popupType = false;
                params.additional = false;
                params.Type = "SELECT";
                break;
            default:
                params.popupType = false;
                params.additional = false;
                params.Type = "SELECT";
                break;
        }

        handler(params);
    },
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/
    // Footer Save
    onFooterSave: function (e) {
        var btnSave = this.footer.get(0).getControl("Save");
        var thisObj = this;

        if (this.viewBag.Permission.PermitTree.Value != 'W' && this.viewBag.Permission.PermitTree.UPD != true) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07531, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnSave.setAllowClick();
            return false;
        }
        var txtTree = null;
        switch (thisObj.LevelGroupType) {
            case 'CUST':
                txtTree = this.contents.getControl('txtTreeCustCd');
                break;
            case 'PROD':
                txtTree = this.contents.getControl('txtTreeGroupCd');
                break;
            case 'WH':
                txtTree = this.contents.getControl('txtTreeWhCd');
                break;
            default:
                txtTree = this.contents.getControl('txtTreeDeptCd');
                break;
        }
        var cd_Parent = txtTree.serialize().value;

        if (cd_Parent == '') {
            txtTree.showError(ecount.resource.MSG04528);
            txtTree.onFocus(0);
            btnSave.setAllowClick();
            return false;
        }

        var lst = [];
        var bFlag = true, bChk = false;
        var firstCD = '', firstKey = '';
        var sCD = '', sNM = '', sDuplicated = '', cd_List = '';
        var rowList;
        var myGrid = this.contents.getGrid('dataGrid').grid;
        myGrid.editDone();
        rowList = myGrid.getRowList();
        $.each(rowList, function (key, value) {
            sCD = value.CD_GROUP.trim();
            sNM = value.NM_GROUP.trim();
            if (sCD != '' && sNM == '') {
                bFlag = false;
                ecount.alert(ecount.resource.MSG04971, function (status) {
                    myGrid.setCellFocus('NM_GROUP', key);
                    return false;
                });
                return false;
            }

            if (sCD == '' && sNM != '') {
                bFlag = false;
                ecount.alert(ecount.resource.MSG04969, function (status) {
                    myGrid.setCellFocus('CD_GROUP', key);
                    return false;
                });
                return false;
            }

            if (sCD != '' && sNM != '') {
                if (sCD.toUpperCase() == 'ROOT') {
                    bFlag = false;
                    ecount.alert(ecount.resource.MSG00291, function (status) {
                        myGrid.setCellFocus('CD_GROUP', key);
                        return false;
                    });
                    return false;
                }

                if (sCD.indexOf('+') >= 0) {
                    bFlag = false;
                    ecount.alert(ecount.resource.MSG05516, function (status) {
                        myGrid.setCellFocus('CD_GROUP', key);
                        return false;
                    });
                    return false;
                }

                bChk = sCD.isContainsLimitedSpecial('code');
                if (bChk.result) {
                    bFlag = false;
                    ecount.alert(bChk.message, function (status) {
                        myGrid.setCellFocus('CD_GROUP', key);
                        return false;
                    });
                    return false;
                }

                bChk = sNM.isContainsLimitedSpecial('name');
                if (bChk.result) {
                    bFlag = false;
                    ecount.alert(bChk.message, function (status) {
                        myGrid.setCellFocus('NM_GROUP', key);
                        return false;
                    });
                    return false;
                }

                $.each(rowList, function (key2, value2) {
                    if (key != key2) {
                        if (sCD === value2.CD_GROUP.trim()) {
                            if (sDuplicated.indexOf(sCD) < 0) {
                                sDuplicated += String.format('[{0}] : {1} \r\n', sCD, ecount.resource.MSG04958);

                                if (firstKey == '')
                                    firstKey = key;

                                return false;
                            }
                        }
                    }
                });

                lst.push({ CD_GROUP: sCD, NM_GROUP: sNM, KEY: key });
                switch (thisObj.LevelGroupType) {
                    case 'CUST':
                    case 'PROD':
                    case 'WH':
                        cd_List += sCD + ecount.delimiter;
                        break;

                    default:
                        cd_List += sCD + 'ㆍ';
                        break;
                }
                if (firstCD == '')
                    firstCD = sCD;
            }
        });

        if (!bFlag) {
            btnSave.setAllowClick();
            return false;
        }

        if (sDuplicated != '') {
            ecount.alert(sDuplicated, function (status) {
                myGrid.setCellFocus('CD_GROUP', firstKey);
                btnSave.setAllowClick();
                return false;
            });
            return false;
        }

        if (lst.length == 0) {
            ecount.alert(ecount.resource.MSG04969, function (status) {
                myGrid.setCellFocus('CD_GROUP', 0);
                btnSave.setAllowClick();
                return false;
            });
            return false;
        }

        data = {
            Request: {
                Data: {
                    CD_PARENT: cd_Parent,
                    CD_GROUP_LIST: cd_List,
                    LIST_JSON: lst,
                    CheckPermissionRequest: {
                        EditMode: ecenum.editMode.new,
                        ProgramId: this.PROGRAM_ID
                    }
                },
                CheckPermissionRequest: { //가각다르게사용해서 추가
                    EditMode: ecenum.editMode.new,
                    ProgramId: this.PROGRAM_ID
                }
            }
        };

        var _url = '';
        switch (thisObj.LevelGroupType) {
            case 'CUST':
                _url = '/SVC/Account/Basic/InsertCustLevelGroup';
                titleName = ecount.resource.LBL07244;
                break;
            case 'PROD':
                _url = '/SVC/Inventory/Basic/InsertProdLevelGroup';
                titleName = ecount.resource.LBL07243;
                break;
            case 'WH':
                _url = '/SVC/Inventory/Basic/InsertSale001GroupGroup';
                titleName = ecount.resource.LBL07309;
                break;
            default:
                _url = '/SVC/Account/Basic/InsertSiteGroup';
                titleName = ecount.resource.LBL07531;
                break;
        }

        ecount.common.api({
            url: _url,
            data: Object.toJSON(data),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    switch (result.Data.ERR_FLAG) {
                        case '1':
                            ecount.alert(ecount.resource.MSG04528, function (status) {
                                thisObj.sendMessage(thisObj, "");
                                thisObj.close();
                            });
                            break;
                        case '2':
                            if (result.Data.ExistedErrorList && result.Data.ExistedErrorList.length > 0) {
                                var _result = result.Data.ExistedErrorList;
                                var myGrid = thisObj.contents.getGrid("dataGrid").grid;
                                $.each(_result, function (i, item) {
                                    myGrid.setCellShowError('CD_GROUP', item.INDEX, { placement: "top", message: String.format(ecount.resource.MSG08770, titleName) });
                                });
                            }
                            break;
                        case '3':
                            ecount.alert(ecount.resource.MSG02642);
                            break;
                        case '4':
                            ecount.alert(ecount.resource.MSG09073);
                            break;
                        case '6':
                            if (result.Data.ExistedErrorList && result.Data.ExistedErrorList.length > 0) {
                                var myGrid = thisObj.contents.getGrid("dataGrid").grid;
                                $.each(result.Data.ExistedErrorList, function (i, item) {
                                    myGrid.setCellShowError('CD_GROUP', item.INDEX, { placement: "top", message: ecount.resource.MSG09929 });
                                });
                            }
                            break;
                        default:
                            thisObj.sendMessage(thisObj, { keyword: firstCD });
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);
                            break;
                    }
                }
            },
            complete: function () {
                btnSave.setAllowClick();
            }
        });

    },
    //Close button click event
    onFooterClose: function () {
        this.close();
    }
    /**********************************************************************
    * define user function
    **********************************************************************/

});