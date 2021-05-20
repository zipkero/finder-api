window.__define_resource && __define_resource("BTN00493","BTN00141","LBL19154","LBL19155","LBL19156","LBL19157","BTN00065","BTN00008","LBL07157","MSG08629","MSG01816","MSG00141","LBL01482");
/***********************************************************************************
 1. Create Date : 2016.09.20
 2. Creator     : 정명수
 3. Description : Template Setup for search(검색항목설정)
 4. Precaution  :
 5. History     : 2019.11.28 정준호 - AM980 위젯 숨기기
                  2019.12.05 정준호 - AM980 위젯 숨기기 로직 제거
                  2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                  2020.06.25 허성길 - A20_01662 단설정_2.0 메뉴에 적용 #EUI1
                  2020.10.14 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정
 6. MenuPath    : 
 7. Old File    : CM100P_24.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.formset", "CM100P_24", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: true,

    formDataTemp: null, // temp variables for UI data 양식 UI용 데이터

    formAllDataTemp: null, // temp variables for save data 양식 저장용 데이터

    commonForm: null,

    lastEditTime: null,

    lastEditId: null,

    regexEmpty: /["＇'\s\\]/g,

    ENABLE_DRAGGABLE_EDIT: true,

    //_isHideByWidth: false,

    _allowGroupColFormType: ["SN910", "SN900", "SN461", "MN010"],     //GROUP_COL_CD 제거 안하는 양식
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("widget.lib.dragable");
        this.registerDependencies("ecmodule.common.formHelper");
        this.registerDependencies("ecmodule.common.form");
    },

    initProperties: function () {
        var thisObj = this;

        this.formDataTemp = [{ FormGroups: [Object.clone(this.viewBag.InitDatas.Template, true)] }];
        this.formAllDataTemp = [{ FormGroups: [Object.clone(this.viewBag.InitDatas.Template, true)] }];
        this._RowInCellCount = this.formDataTemp[0].FormGroups[0].ViewModel.colType * 2;
        this.setFormSearchToViewModel();
        
        this.lastEditTime = this.formDataTemp[0].FormGroups[0].FormSearchDetails[0].Key.COM_CODE.startsWith("ZA") ? "" : this.formDataTemp[0].FormGroups[0].FormSearchDetails[0].EDIT_DT;
        this.lastEditId = this.formDataTemp[0].FormGroups[0].FormSearchDetails[0].Key.COM_CODE.startsWith("ZA") ? "" : this.formDataTemp[0].FormGroups[0].FormSearchDetails[0].EDIT_ID;
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
        header.setTitle(ecount.resource.BTN00493);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            form = widget.generator.form(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        var thisObj = this;

        //set Template value 양식값 할당
        this.commonForm = new ecount.common.form();
        this.commonForm.setWidgetMap(thisObj);
        toolbar.addLeft(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce().end())
            .addLeft(ctrl.define("widget.select", "colType", "colType", "colType").option([["1", ecount.resource.LBL19154], ["2", ecount.resource.LBL19155], ["3", ecount.resource.LBL19156], ["4", ecount.resource.LBL19157]]).select(this.formDataTemp[0].FormGroups[0].ViewModel.colType).end());    // 단설정

        var colSize = this.formDataTemp[0].FormGroups[0].ViewModel.colType;

        //양식상세설정 사용여부
        IsDetailPermit = this.IsDetailPermit ? true : false;

        form
            .setFormId("topForm")
            .css("table table-border-no-a table-th-left table-template-setup-preview")
            .useBaseForm()
            .useTableType()   //TODO 리팩토링 버전 올라갈떄 변경할것 useBaseForm제거 - dknam
            .useDynamicColSize()
            .setColSize(colSize)
            .addControls(this._createInitWidgetData())
            .showLeftAndRightBorder(true);

        contents.add(toolbar)
                .add(form)
        ;
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
            .addLeft(ctrl.define("widget.button", "history").label("H"));

        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadComplete: function (event) {
        this.setMoveSetting(this.contents.getForm(true)[0], this.isReload ? true : false);
        //sync sort for table on right top 오른쪽 상단 위젯 테이블 순서 동기화-값재할당
        this.setSortSync();
        this.showFormsetLayer(this.formDataTemp[0].FormGroups[0].ViewModel.columns[0].id);
        if (this.FORM_TYPE == "AM013" || this.FORM_TYPE == "AM014") {
            this.contents.getForm()[0].hideRow("rbGubun1");
        } else if (this.FORM_TYPE == "SM697" || this.FORM_TYPE == "AM014") {
            this.contents.getForm()[0].hideRow("rbSumGubun");
        }
    },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        if (page.pageID == 'CM100P_47') {
            if (!$.isNull(message.type) && message.type == "getforminfo") {
                if (thisObj.FORM_TYPE == "SM800") {
                    // TODO: Remove control [Last modifier]
                    this.formDataTemp[0].FormGroups[0].FormSearchColumns = thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.where(function (item)
                    { return item.COL_CD != "txtLastUpdatedID"; });
                }
                var objcColumn = Object.clone(this.formDataTemp[0].FormGroups[0].FormSearchColumns, true);
                message.callback && message.callback(objcColumn);
                return;
            } else if (!$.isNull(message.type) && message.type == "addItems") {                
                var tarcolcd = { COL_CD: message.targetColCd };
                message.colCds.forEach(function (rowItem, j) {
                    thisObj.setSettingDetail({ checked: true, rowItem: rowItem });
                    thisObj.setUiSync({ checked: true, rowItem: rowItem, target: tarcolcd }); //targetColCd: message.targetColCd });
                });
                message.callback && message.callback();
            }
        }
    },

    onChangeControl: function (event, data) {
        switch (event.cid) {
            case "colType":
                this._changeColType(event.value);
                break;
        }
    },

    onDragEndCompleted: function (event, data, grid) {
        if (data && data.target == "widget" && (data.type == "add" || data.type == "move")) {
            //add : from tree grid to widget table 트리에서 위젯으로 추가시 
            //move : drag widget from right to right on right table only 위젯에서 순서만 드래그로 변경시

            //sync table 위젯 순서 동기화-값재할당
            this.setSortSync();
        } else if (data && data.target != "widget") {
            //sync grid 그리드 순서 동기화
            this.setSortSync();
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

    //Restore default 기본값 복원
    onContentsRestore: function () {
        this.getRestoreForm();
    },

    //History 히스토리
    onFooterHistory: function (e) {
        var thisObj = this;
        var param = {
            width: 450,
            height: 150,
            lastEditTime: thisObj.lastEditTime,
            lastEditId: thisObj.lastEditId
        };
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            popupType: false,
            additional: false,
            param: param
        });
    },

    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //save 저장
    onFooterSave: function (e) {
        var thisObj = this;
        
        var permit = thisObj.viewBag.Permission.formUserPermit.Value;
        if (thisObj.IsDetailPermit == false && permit != "W") {
            //permission message 권한 메시지
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.BTN00493, PermissionMode: "W" }]).fullErrorMsg);
            thisObj.footer.getControl('save').setAllowClick();
        } else {
            thisObj.setSave();
        }
    },

    onFormsetAddClick: function (e) {
        this.setAddItemPopup({ rowItem: { COL_CD: e.cid } });
    },

    onFormsetDelClick: function (e) {
        this.setDeleteItem({ rowItem: { COL_CD: e.cid } });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    //F8 Event
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterSave();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //reset wedgets
    setResetWedgets: function () {
        var thisObj = this;
        thisObj.commonForm.getWidgetHelper().getResetKeys().forEach(function (key, j) {
            //call reset function 호출 리셋 펑션
            thisObj.commonForm.getWidgetHelper().getResetWedgets().get(key)();
        });
    },

    //save
    setSave: function () {
        var thisObj = this;
        var data = null;
        var reSort = null;
        var search = null;

        if (this.formAllDataTemp[0].FormGroups[0].FormSearchDetails.length == 0) {
            ecount.alert(ecount.resource.MSG08629);
            thisObj.footer.getControl('save').setAllowClick();
            return false;
        }
        
        var reSort = this.formAllDataTemp[0].FormGroups[0].FormSearchDetails.sortBy(function (s) {
            search = thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails.find(function (item) { return (item.COL_CD || item.Key.COL_CD) == (s.COL_CD || s.Key.COL_CD); });
            if ($.isNull(search)) {
                s.NUM_SORT = 99;
                s.HEAD_SIZE = 0;
            } else {
                $.extend(s, search);
            }
            return s.NUM_SORT;
        });

        reSort = reSort.remove(function (s) { return s.NUM_SORT == 99; });
        reSort = reSort.sortBy(function (s) { return parseInt(s.NUM_SORT); });
        reSort.forEach(function (sortedItem, j) {
            sortedItem.NUM_SORT = j + 1;
        });

        if (reSort.length >= this.MAX_CNT) {
            ecount.alert(ecount.resource.MSG01816.replace("30", this.MAX_CNT));
            this.footer.getControl('save').setAllowClick();
            return false;
        }

        this.formAllDataTemp[0].FormGroups[0].FormSearchDetails = reSort;

        this.formAllDataTemp[0].FormGroups[0].FormSearchBasic.COL_ATTR_ID = this.contents.getControl("colType").getValue();

        data = { FORM_TYPE: this.FORM_TYPE, FORM_SEQ: 1, formDataTemp: this.formAllDataTemp[0].FormGroups[0], IS_CS: this.IS_CS, IsDetailPermit: this.IsDetailPermit, FromProgramId: this.FromProgramId};

        thisObj.setShowProgressbar();
        ecount.common.api({
            url: "/Common/Form/SaveFormSearchTemplate",
            data: Object.toJSON(data),
            success: function (result) {
                thisObj.setHideProgressbar();
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    thisObj.sendMessage(thisObj, { callback: thisObj.close.bind(thisObj) });
                    //thisObj.setTimeout(function() {
                    //    thisObj.reload();
                    //}.bind(thisObj), 0);
                }
            }
        });
    },

    //show progress bar 진행바 보이기
    setShowProgressbar: function () {
        this.showProgressbar(true);
    },

    //hide progress bar 진행바 감추기
    setHideProgressbar: function () {
        this.hideProgressbar();
        this.footer.getControl('save').setAllowClick();
        if (this.contents.getControl("restore") != null)
            this.contents.getControl("restore").setAllowClick();
    },

    // add item popup 항목 추가 팝업
    setAddItemPopup: function (data) {
        var thisObj = this;
        var colcd = data.rowItem.COL_CD;
        var formType = "";
        var showColumn = thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == colcd });
        formType = this.formDataTemp[0].FormGroups[0].FormSet.Key.FORM_TYPE;

        var param = {
            height: 450,
            width: 450,
            modal: true,
            FORM_TYPE: formType,
            formIndex: 0,
            targetColCd: colcd
        };

        if (thisObj._allowGroupColFormType.contains(thisObj.FORM_TYPE))
            param.isUsingGroupColCd = false;

        // Open popup
        thisObj.openWindow({
            url: '/ECERP/Popup.Form/CM100P_47',
            name: "",
            param: param,
            popupType: false,
            additional: false,
        });
    },

    // delete item 항목 삭제
    setDeleteItem: function (data) {
        //remove widget 삭제 위젯
        this.setFormDeleteWidget(data.rowItem.COL_CD);//param : 0[id]

        //update data 상단 데이터 갱신
        this.setSettingDetail({ checked: false, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
        this.setUiSync({ checked: false, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
    },

    //sync left ui 우측 UI 갱신
    setUiSync: function (data) {
        var thisObj = this;
        var formGroupsIdx = 0;
        //get group 그룹가져오기
        var groupColCd = thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD }).GROUP_COL_CD;
        var colGroup = thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.where(function (item, i) {

            if (thisObj._allowGroupColFormType.contains(thisObj.FORM_TYPE)) {
                return item.COL_CD == data.rowItem.COL_CD;
            }
            else return item.GROUP_COL_CD == groupColCd
        });

        if (data.checked) {
            var targetColCdIdx;
            colGroup.forEach(function (colOfGroup) {                
                targetColCdIdx = parseInt(thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == data.target.COL_CD }).index);
                //add widget on right top 우측 상단 위젯 추가
                var objParam = thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == colOfGroup.COL_CD });
                thisObj.setFormAddWidget(objParam, targetColCdIdx);
                data.target.COL_CD = colOfGroup.COL_CD;
            });
        } else {
            colGroup.forEach(function (colOfGroup) {
                //remove widget on right top  우측 상단 위젯제거
                thisObj.setFormDeleteWidget(colOfGroup.COL_CD);//param : 0[id]
            });
        }

        //sync sort number 정렬순서 동기화
        this.setSortSync();
    },

    //setting detail 상세 설정
    setSettingDetail: function (data) {
        var thisObj = this;
        var formGroupsIdx = 0;

        //get group  그룹가져오기
        var groupColCd = thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD }).GROUP_COL_CD;
        var colGroup = thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.where(function (item, i) {
            if (thisObj._allowGroupColFormType.contains(thisObj.FORM_TYPE)) {
                return item.COL_CD == data.rowItem.COL_CD;
            }
            else return item.GROUP_COL_CD == groupColCd
        });

        if (data.checked) {
            colGroup.forEach(function (colOfGroup) {                
                var formColumn = thisObj.formDataTemp[0].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                var index = parseInt(thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.length) + 1;
                var newFormOutSetDetail = Object.clone(thisObj.formAllDataTemp[0].FormGroups[0].FormSearchColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }), true);
                newFormOutSetDetail.HEAD_SIZE = 100;

                var newColumn = Object.clone(thisObj.formAllDataTemp[0].FormGroups[0].ViewModel.items[1].subItems.find(function (item) { return item.id == formColumn.COL_CD }), true);
                newColumn.width = 100;
                $.extend(true, newColumn, {
                    title: newFormOutSetDetail.TITLE
                    , disableAllMod: true
                    , disableMod: true
                });
                newFormOutSetDetail.TAB_INDEX = thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.where(function (item, i) { return item.TAB_INDEX > 0; }).length + 1;
                newColumn.cursorIndex = newFormOutSetDetail.TAB_INDEX;
                var addedFormSearchDetail = {
                    Key: {
                        //        FORM_TYPE: thisObj.formDataTemp[0].FormSet.Key.FORM_TYPE,
                        COL_CD: newFormOutSetDetail.COL_CD
                    },
                    NUM_SORT: newFormOutSetDetail.TAB_INDEX
                    //    USE_CD: "1"
                };
                thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails.add(newFormOutSetDetail);
                thisObj.formAllDataTemp[0].FormGroups[0].FormSearchDetails.add(addedFormSearchDetail);
                thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.add(newColumn);
                //check 체크 처리
                thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "Y";
            });
        } else {
            colGroup.forEach(function (colOfGroup) {
                var formColumn = thisObj.formDataTemp[0].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == colOfGroup.COL_CD });
                //remove detail  디테일 삭제
                thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails.remove(function (item) { return (item.COL_CD || item.Key.COL_CD) == formColumn.COL_CD });
                //remove AllDataTemp 디테일 삭제
                thisObj.formAllDataTemp[0].FormGroups[0].FormSearchDetails.remove(function (item) { return (item.COL_CD || item.Key.COL_CD) == formColumn.COL_CD });
                //remove item 항목 삭제
                thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.remove(function (item) { return item.id == formColumn.COL_CD });
                //uncheck 언체크 처리
                thisObj.formDataTemp[0].FormGroups[0].FormSearchColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "N";
            });
            var z = 0;
            var reSort = thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.sortBy(function (s) { return s.cursorIndex; });
            reSort.forEach(function (sortedItem) {
                if (sortedItem.cursorIndex != 0) {
                    z++;
                    thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails.find(function (item) { return (item.COL_CD || item.Key.COL_CD) == sortedItem.id }).TAB_INDEX = z;
                    thisObj.formDataTemp[0].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).cursorIndex = z;
                }
            });
        }
    },

    //sync sort 정렬동기화
    setSortSync: function () {
        //sync table  위젯 순서 동기화-값재할당
        var formDataTempCurrent = this.formDataTemp[0].FormGroups[0];
        formDataTempCurrent.ViewModel.columns.forEach(function (sortedItem, j) {
            formDataTempCurrent.FormSearchDetails.find(function (item) { return (item.COL_CD || item.Key.COL_CD) == sortedItem.id }).NUM_SORT = j + 1;
        });
    },

    //Restore default 기본값 복원
    getRestoreForm: function () {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (permit != "W" && thisObj.IsDetailPermit == false) {
            //MSG00141
            ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01482, PermissionMode: "W" }]).fullErrorMsg);
        } else {
            this.setShowProgressbar();
            //Restore ZA 기본값 복원
            var restoreLists = new Array();
            thisObj.formDataTemp[0].FormGroups.forEach(function (formData) {
                restoreLists.push({ FORM_TYPE: thisObj.FORM_TYPE, FORM_SEQ: 99, FormTypeMaster: thisObj.FORM_TYPE_MASTER, FormTypeForRemarks: thisObj.FORM_TYPE_INPUT });
            });
            ecount.common.api({
                url: "/Common/Form/GetListFormsearchTemplate",
                data: Object.toJSON(restoreLists),
                success: function (result) {
                    thisObj.setHideProgressbar();
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        thisObj.formDataTemp = [{ FormGroups: Object.clone(result.Data, true) }];
                        thisObj.formAllDataTemp = [{ FormGroups: Object.clone(result.Data, true) }];
                        thisObj.setFormSearchToViewModel();
                        //result.Data[0].ViewModel.columns = result.Data[0].FormSearchDetails.sortBy(function (v) { return v.NUM_SORT; });
                        //result.Data[0].ViewModel.columns.forEach(function (column) {
                        //    var colInfo = result.Data[0].FormColumns.where(function (v) { return v.COL_CD == column.Key.COL_CD; })[0];
                        //    column.id = colInfo.COL_CD;
                        //    column.name = colInfo.CONVERT_COL_NM;
                        //    column.title = colInfo.SUB_REX_DES;
                        //    column.basicYn = colInfo.DEFAULT_YN || "N";
                        //    column.disableAllMod = true;
                        //    column.disableMod = true;
                        //    column.disableDel = colInfo.DEFAULT_YN == "Y";
                        //    column.cursorIndex = column.NUM_SORT;
                        //    column.groupId = colInfo.GROUP_COL_CD;
                        //});
                        //result.Data[0].FormOutSet = { TAB_INDEX_TYPE: "" };

                        // colType 복원
                        thisObj._changeColType(thisObj.formDataTemp[0].FormGroups[0].ViewModel.colType, true);
                        
                        thisObj.setMoveTableReset(thisObj._createInitWidgetData());
                        thisObj.setResetWedgets();
                        if (thisObj.FORM_TYPE == "AM013" || thisObj.FORM_TYPE == "AM014") {
                            thisObj.contents.getForm()[0].hideRow("rbGubun1");
                        } else if (thisObj.FORM_TYPE == "SM697" || thisObj.FORM_TYPE == "AM014") {
                            thisObj.contents.getForm()[0].hideRow("rbSumGubun");
                        }
                    }
                }
            });
        }
    },

    setFormSearchToViewModel: function () {
        //this.formDataTemp = [{ FormGroups: [Object.clone(this.viewBag.InitDatas.Template, true)] }];
        //this.formAllDataTemp = [{ FormGroups: [Object.clone(this.viewBag.InitDatas.Template, true)] }];
        var thisObj = this;
        
        if (thisObj.FORM_TYPE == "SM800") {
            // TODO: Remove control [Last modifier]
            thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails = thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails.where(function (item)
                                    { return item.Key.COL_CD != "txtLastUpdatedID"; });
        }

        if (["AN720", "AN701", "AN700"].contains(thisObj.FORM_TYPE)) {
            // TODO: Remove control [Last modifier]
            thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails = thisObj.formDataTemp[0].FormGroups[0].FormSearchDetails.where(function (item)
            { return item.Key.COL_CD != "cbAcctApply"; });
        }

        this.formDataTemp[0].FormGroups[0].ViewModel.columns = this.formDataTemp[0].FormGroups[0].FormSearchDetails.sortBy(function (v) { return v.NUM_SORT; });

        this.formDataTemp[0].FormGroups[0].ViewModel.columns.forEach(function (column) {
            var colInfo = thisObj.formDataTemp[0].FormGroups[0].FormColumns.where(function (v) { return v.COL_CD == column.Key.COL_CD; })[0];
            if (("p31opDes1"==colInfo.COL_CD||"p31opDes2"==colInfo.COL_CD||"p31opDes3"==colInfo.COL_CD||"p31opDes4"==colInfo.COL_CD||"p31opDes5"==colInfo.COL_CD||"p31opDes6"==colInfo.COL_CD) && thisObj.FORM_TYPE == "SN530")
            {
                column.name = colInfo.CONVERT_COL_NM;
                column.title = colInfo.SUB_REX_DES.substring(1, colInfo.SUB_REX_DES.length);
            } else {
                column.name = colInfo.CONVERT_COL_NM;
                column.title = colInfo.SUB_REX_DES;
            }
            column.id = colInfo.COL_CD;
            
            column.basicYn = colInfo.DEFAULT_YN || "N";
            column.disableAllMod = true;
            column.disableMod = true;
            column.disableDel = colInfo.DEFAULT_YN == "Y";
            column.cursorIndex = column.NUM_SORT;
            column.groupId = colInfo.GROUP_COL_CD;
            column.isLineMrge = false;
        });

        this.formDataTemp[0].FormGroups[0].FormOutSet = { TAB_INDEX_TYPE: "" };
    },

    //reload
    reload: function () {
        var param = {
            FORM_TYPE: this.FORM_TYPE,
            FORM_TYPE_INPUT: this.FORM_TYPE_INPUT,
            FORM_TYPE_MASTER: this.FORM_TYPE_MASTER,
            isReload: true,
        }
        this.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_24", param);
    },

    _changeColType: function (newColType, isSetSelectBox) {
        var topForm = this.contents.getFormById("topForm");
        topForm.setColSize(newColType);
        this._RowInCellCount = newColType * 2;
        this.setMoveSetting(topForm, true);

        if (isSetSelectBox) {
            this.contents.getControl("colType").setValue(newColType);
        }
    }
});
