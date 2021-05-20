window.__define_resource && __define_resource("LBL02279","BTN00141","BTN00065","BTN00008","LBL07157","LBL00336","LBL03003","MSG04357");
/***********************************************************************************
 1. Create Date : 2016.09.27
 2. Creator     : inho
 3. Description : Input Field Setup(입력항목설정) 
 4. Precaution  :
 5. History     : 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                  2020.05.15 (Hae In KIM) - A19_02458 단설정 #EUI1
 6. MenuPath    : Inv.1(재고1)>Setup(기초등록)>Item(품목등록)>New(신규)>Option>Input Field Setup(입력항목설정)
 7. Old File    : CM100P_06.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.formset", "CM100P_07_CM3", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: true,

    formDataTemp: null,//temp variables for UI data 양식데이터

    formAllDataTemp: null,//temp variables for all data 양식 전체 데이터

    commonForm: null,

    lastEditTime: null,

    lastEditId: null,

    ENABLE_DRAGGABLE_EDIT: null,

    _RowInCellCount:2,

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.registerDependencies("widget.lib.dragable");
        this.registerDependencies("ecmodule.common.formHelper");
        this.registerDependencies("ecmodule.common.form");
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
        header.setTitle(this.viewBag.Title || ecount.resource.LBL02279);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            form = widget.generator.form(),
            panel = widget.generator.panel(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        var thisObj = this;
        this._isHideByWidth = false;
        this.ENABLE_DRAGGABLE_EDIT = true;
        //set Template value 양식값 할당
        this.setFormInfosFromDb();
        this.commonForm = new ecount.common.form();
        this.commonForm.setWidgetMap(thisObj);
        toolbar.attach(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce().end());
        form
            .css("table table-border-no-a table-th-left table-template-setup-preview")
            .useBaseForm()
            .useTableType()
            .setColSize(1)
            .useDynamicColSize()
            .addControls(this._createInitWidgetData());
        form.showLeftAndRightBorder(true);
        contents.add(toolbar)
                .add(form);
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

    onChangeControl: function (control, data) {
    },

    onInitControl: function (cid, control) { },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) {
    },
    // 탭 체인지 이벤트
    onChangeContentsTab: function (event) {
    },

    onLoadComplete: function (event) {
        //if add form on right layer, you have to recheck 0 is right.
        //because 0 index is left top form.
        //폼기준으로 그려지는 순서가 마지막인 경우 인덱스0 
        //그외의 경우는 예외 처리 해야함.
        this.setMoveSetting(this.contents.getForm(true)[0], this.isReload ? true : false);
        //sync sort for table on right top 오른쪽 상단 위젯 테이블 순서 동기화-값재할당
        this.setSortSync({ formIndex: 0 });
        this.showFormsetLayer(this.formDataTemp[0].FormGroups[0].ViewModel.columns[0].id);
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        if (page.pageID == 'CM100P_47') {
            if (!$.isNull(message.type) && message.type == "getforminfo") {
                var objcColumn = Object.clone(thisObj.formDataTemp[message.formIndex].FormGroups[0].FormOutColumns, true);
                message.callback && message.callback(objcColumn);
                return;
            } else if (!$.isNull(message.type) && message.type == "addItems") {
                var tarcolcd = { COL_CD: message.targetColCd };
                message.colCds.forEach(function (rowItem, j) {
                    thisObj.setSettingDetail({ checked: true, formIndex: message.formIndex, rowItem: rowItem });
                    thisObj.setUiSync({ checked: true, formIndex: message.formIndex, rowItem: rowItem, target: tarcolcd }); //targetColCd: message.targetColCd });
                });
                message.callback && message.callback();
            }
        } 
    },

    //hhy 수정
    //drag event 드래그 시작 이벤트
    onPreInitDrag: function (event, data, grid) {
    },

    //hhy 수정
    //drag end event  드래그 드롭 후 설정 값 전달 이벤트
    onDragEndPreInit: function (event, data, grid) {
    },

    //hhy 수정
    //drag completed event  드래그 드롭 완료 후 이벤트
    onDragEndCompleted: function (event, data, grid) {
        if (data && data.target == "widget" && (data.type == "add" || data.type == "move")) {
            //add : from tree grid to widget table 트리에서 위젯으로 추가시 
            //move : drag widget from right to right on right table only 위젯에서 순서만 드래그로 변경시

            //sync table 위젯 순서 동기화-값재할당
            this.setSortSync({ formIndex: 0 });
        } 
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onInitGridInitalize: function (cid, option) {
    },

    onGridRenderComplete: function (e, data, gridObj) {
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    onContentsSearch: function () {
    },

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
        })
    },


    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },

    //save 저장
    onFooterSave: function (e) {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (!["W", "U"].contains(permit)) {
            //permission message 권한 메시지
            //이 페이지가 지원하는 양식이 거래처와 품목만 해당되기 때문에 권한체크는 하드코딩하기로 - 채주영 2016.10.13
            if (thisObj.FORM_TYPE.toUpperCase() == "SI912") {
                ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]).fullErrorMsg);
            } else {
                ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]).fullErrorMsg);
            }
            thisObj.footer.getControl('save').setAllowClick();
        } else {
            thisObj.setSave();
        }
    },

    onFormsetAddClick: function (e) {
        this.setAddItemPopup({ formIndex: 0, rowItem: { COL_CD: e.cid } });
    },

    onFormsetDelClick: function (e) {
        this.setDeleteItem({ formIndex: 0, rowItem: { COL_CD: e.cid } });
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
        var detail = null;
        this.formAllDataTemp.forEach(function (formData, i) {
            formData.FormGroups.forEach(function (formGroup, j) {
                formGroup.FormOutSet = thisObj.formDataTemp[i].FormGroups[j].FormOutSet;
                reSort = formGroup.FormOutSetDetails.sortBy(function (s) {
                    detail = thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == s.COL_CD })
                    if ($.isNull(detail)) {
                        s.Key.NUM_SORT = 99;
                        s.BASIC_YN = "N";
                    } else {
                        $.extend(s, detail);
                    }
                    return s.Key.NUM_SORT;
                });
                reSort = reSort.sortBy(function (s) { return parseInt(s.Key.NUM_SORT); });
                reSort.forEach(function (sortedItem, j) {
                    sortedItem.Key.NUM_SORT = j + 1;
                })
            });
        });
        data = { FORM_TYPE: this.FORM_TYPE, FORM_SEQ: 1, formDataTemp: this.formAllDataTemp };
        thisObj.setShowProgressbar();
        ecount.common.api({
            url: "/Common/Form/SaveFormTemplate",
            data: Object.toJSON(data),
            success: function (result) {
                thisObj.setHideProgressbar();
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    var message = {
                        type: "reload",
                        callback: thisObj.close.bind(thisObj)
                    };
                    thisObj.sendMessage(thisObj, message);
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
        showColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == colcd });
        var formType = this.formDataTemp[data.formIndex].FormGroups[0].FormSet.Key.FORM_TYPE;
        var param = {
            height: 450,
            width: 450,
            modal: true,
            FORM_TYPE: formType,
            formIndex: data.formIndex,
            isUsingGroupColCd : false,
            targetColCd: colcd,
            checkMaxCount: this.formDataTemp[data.formIndex].FormGroups[0].FormSet.COLUMN_MAX_CNT
        };
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
        this.setSettingDetail({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
        this.setUiSync({ checked: false, formIndex: data.formIndex, rowItem: { COL_CD: data.rowItem.COL_CD, TITLE: "" } });
    },

    //sync left ui 우측 UI 갱신
    setUiSync: function (data) {
        console.log("setUiSync");
        var thisObj = this;
        var formGroupsIdx = 0;
        if (data.checked) {
            var targetColCdIdx;
            targetColCdIdx = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == data.target.COL_CD }).index);
            //add widget on right top 우측 상단 위젯 추가
            var objParam = thisObj.formDataTemp[0].FormGroups[formGroupsIdx].ViewModel.columns.find(function (item) { return item.id == data.rowItem.COL_CD });
            thisObj.setFormAddWidget(objParam, targetColCdIdx);
            data.target.COL_CD = data.rowItem.COL_CD;
        } else {
            //remove widget on right top  우측 상단 위젯제거
            thisObj.setFormDeleteWidget(data.rowItem.COL_CD);//param : 0[id]
        }
        //sync sort number 정렬순서 동기화
        this.setSortSync({ formIndex: 0 });
    },

    //setting detail 상세 설정
    setSettingDetail: function (data) {
        var thisObj = this;
        var formGroupsIdx = 0;
        if (data.checked) {
            var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD });
            var index = parseInt(thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.length) + 1;
            var newFormOutSetDetail = Object.clone(thisObj.formAllDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.find(function (item) { return item.COL_CD == formColumn.COL_CD }), true);
            newFormOutSetDetail.BASIC_YN = "Y";
            newFormOutSetDetail.HEAD_SIZE = 0;
            var newColumn = Object.clone(thisObj.formAllDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.find(function (item) { return item.id == formColumn.COL_CD }), true);
            newColumn.width = 100;
            newColumn.disableMod = true;
            newColumn.disableAllMod = true;
            newColumn.isLineMrge = false;
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.add(newFormOutSetDetail);
            thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.add(newColumn);
            //check 체크 처리
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "Y";
        } else {
            var formColumn = thisObj.formDataTemp[data.formIndex].FormGroups[0].FormColumns.find(function (item) { return item.COL_CD == data.rowItem.COL_CD });
            //remove detail  디테일 삭제
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutSetDetails.remove(function (item) { return item.COL_CD == formColumn.COL_CD });
            //remove item 항목 삭제
            thisObj.formDataTemp[data.formIndex].FormGroups[0].ViewModel.columns.remove(function (item) { return item.id == formColumn.COL_CD });
            //uncheck 언체크 처리
            thisObj.formDataTemp[data.formIndex].FormGroups[0].FormOutColumns.find(function (item) { return item.COL_CD == formColumn.COL_CD }).CHECKED_YN = "N";
        }
    },

    //sync sort 정렬동기화
    setSortSync: function (data) {
        //sync table  위젯 순서 동기화-값재할당
        var formDataTempCurrent = this.formDataTemp[0].FormGroups[0];
        formDataTempCurrent.ViewModel.columns.forEach(function (sortedItem, j) {
            formDataTempCurrent.FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = j + 1;
        });
    },

    //get form template from db 양식 디비값 가져오기
    setFormInfosFromDb: function () {
        var thisObj = this;
        //for ui UI용 데이터
        this.formDataTemp = new Array();
        //for save 저장용 데이터
        this.formAllDataTemp = new Array();
       
        Object.clone(this.viewBag.InitDatas.Template, true).FormInfos.forEach(function (formTemp, i) {
            thisObj.formDataTemp.push(formTemp);
            thisObj.setColumnExceptBasicN(i);
        });
        Object.clone(this.viewBag.InitDatas.Template, true).FormInfos.forEach(function (formTemp, i) {
            thisObj.formAllDataTemp.push(formTemp);
        });
        thisObj.lastEditTime = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EDIT_DT;
        thisObj.lastEditId = thisObj.formDataTemp[0].FormGroups[0].FormOutSet.EDIT_ID;
    },

    // except basicYn is N 베이직YN이 N인것은 제외
    setColumnExceptBasicN: function (i) {
        //add button disable by col_cd // choijinyoung
        var thisObj = this;
        var reSort = null;
        var z = 0;
        thisObj.formDataTemp[i].FormGroups.forEach(function (formGroup, j) {
            reSort = formGroup.ViewModel.columns.sortBy(function (s) {
                return (s.basicYn != "Y") ? s.index = 99 : s.index;
            });
            z = 0;
            reSort = reSort.sortBy(function (s) { return s.index; });
            reSort.forEach(function (sortedItem) {
                if (sortedItem.index == 99) {
                    thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.remove(function (item) { return item.COL_CD == sortedItem.id });
                    thisObj.formDataTemp[i].FormGroups[j].ViewModel.columns.remove(function (item) { return item.id == sortedItem.id });
                } else {
                    z++;
                    thisObj.formDataTemp[i].FormGroups[j].FormOutSetDetails.find(function (item) { return item.COL_CD == sortedItem.id }).Key.NUM_SORT = z;
                    thisObj.formDataTemp[i].FormGroups[j].ViewModel.columns.find(function (item) { return item.id == sortedItem.id }).index = z;
                }
                sortedItem.disableMod = true;
                sortedItem.disableAllMod = true;
                sortedItem.isLineMrge = false;
                if (thisObj.formDataTemp[i].FormGroups[j].FormColumns.find(function (item) { return item.COL_CD == sortedItem.id }).DEFAULT_YN == "Y") {
                    sortedItem.disableDel = true;
                }
            })
        });
    },

    //Restore default 기본값 복원
    getRestoreForm: function () {
        var thisObj = this;
        var permit = this.viewBag.Permission.formUserPermit.Value;
        if (!["W", "U"].contains(permit)) {
            //이 페이지가 지원하는 양식이 거래처와 품목만 해당되기 때문에 권한체크는 하드코딩하기로 - 채주영 2016.10.13
            if (thisObj.FORM_TYPE.toUpperCase() == "SI912") {
                ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL00336, PermissionMode: "U" }]).fullErrorMsg);
            } else {
                ecount.alert(ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]).fullErrorMsg);
            }
        } else {
            this.setShowProgressbar();
            //Restore ZA 기본값 복원
            var restoreLists = new Array();
            thisObj.formDataTemp.forEach(function (formData) {
                restoreLists.push({ FORM_TYPE: formData.FormGroups[0].FormOutSet.Key.FORM_TYPE, FORM_SEQ: 99 ,FormItemShowType : "B"});
            });
            ecount.common.api({
                url: "/Common/Form/GetListFormTemplate",
                data: Object.toJSON(restoreLists),
                success: function (result) {
                    thisObj.setHideProgressbar();
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        thisObj.formDataTemp = Object.clone(result.Data, true);
                        thisObj.formAllDataTemp = Object.clone(result.Data, true);
                        for (var i = 0; i < thisObj.formDataTemp.length; i++) {
                            thisObj.setColumnExceptBasicN(i);
                        }
                        thisObj.setMoveTableReset(thisObj._createInitWidgetData());
                        thisObj.setResetWedgets();
                    }   
                }
             });
        }
    },

    //knh #13
    onDragErrorHandler: function (event) {
        if (event._isErrorMessage) {
            ecount.alert(ecount.resource.MSG04357);
        }
    },

    //reload
    reload: function () {
        var param = {
            FORM_TYPE: this.FORM_TYPE,
            isReload: true,
        }
        this.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_07_CM3", param);
    },
});
