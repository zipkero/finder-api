window.__define_resource && __define_resource("BTN00807","LBL35311","BTN00636","BTN00581","BTN00141","LBL03810","BTN00784","LBL35312","BTN00069","BTN00008","LBL07243","MSG00287","LBL09106","MSG02277","MSG02273","MSG02278","MSG02281","MSG02297","MSG08212");
/***********************************************************************************
 1. Create Date : 2016.03.03
 2. Creator     : inho
 3. Description : Top/Bottom Settings(TOP/BOTTOM설정)
 4. Precaution  :
 5. History     : 2019.11.28 (On Minh Thien): A19_04259 - 전자세금계산서 메일수신화면양식 > 이미지 삽입 후, 발송 시 수신측에서 엑박뜹니다.
 6. MenuPath    : Template Setup(양식설정)>Top/Bottom Settings(TOP/BOTTOM설정)
 7. Old File    : CM100P_06.aspx,CM100P_15.aspx
 ***********************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_55", {

    pageID: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    off_key_esc: false,

    formInfo: null,

    FormTableCode: null,
    listCntTop: 1,
    listCntBottom: 1,

    lastListCntTop: 1,
    lastListCntBottom: 1,
    thumbnailSize: "",

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecount-textEditor", "pluploader");
    },

    initProperties: function () {
        this.thumbnailSize = [
              [ecount.config.groupware.THUMBNAIL_1_WIDTH, ecount.config.groupware.THUMBNAIL_1_HEIGHT].join("*"),
              [ecount.config.groupware.THUMBNAIL_2_WIDTH, ecount.config.groupware.THUMBNAIL_2_HEIGHT].join("*"),
              [ecount.config.groupware.THUMBNAIL_3_WIDTH, ecount.config.groupware.THUMBNAIL_3_HEIGHT].join("*")
        ].join(ecount.delimiter);
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
        var message = {
            type: "getFormInfo",
            callback: function (data) {
                this.formInfo = data;
            }.bind(this)
        };
        this.sendMessage(this, message);
        header.notUsedBookmark();
        header.setTitle((this.formInfo.FormOutSet.ONLYTOP_USE_YN == "N" && this.formInfo.FormSet.IS_BOTTOM_SETTABLE) ? ecount.resource.BTN00807 : ecount.resource.LBL35311);
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            tabContents1 = g.tabContents(),
            //divContainer1 = g.divContainer(),
            //divContainer2 = g.divContainer(),
            div1 = g.div(),
            div2 = g.div(),
            form1 = widget.generator.form(),
            form2 = widget.generator.form(),
            toolbar1 = g.toolbar(),
            toolbar2 = g.toolbar(),
            tabContents = g.tabContents(),
            subTitle1 = g.subTitle(),
            subTitle2 = g.subTitle(),
            panel1 = g.panel(),
            panel2 = g.panel(),
            //panel3 = g.panel(),
            ctrl = g.control();
        ctrl1 = g.control();
        ctrl2 = g.control();

        var thisObj = this;

        toolbar1.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true });
        if (!["H", "J"].contains(this.FORM_TYPE.substr(1, 1))) {
            toolbar1.addLeft(ctrl.define("widget.button", "viewSample").label(ecount.resource.BTN00636))
                .addLeft(ctrl.define("widget.button", "addImage").label(ecount.resource.BTN00581))
                .addLeft(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141));
        } else {
            toolbar1.addLeft(ctrl.define("widget.button", "addImage").label(ecount.resource.BTN00581))
               .addLeft(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141));
        }

        toolbar2.setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true });
        if (!["H", "J"].contains(this.FORM_TYPE.substr(1, 1))) {
            toolbar2.addLeft(ctrl.define("widget.button", "viewSample").label(ecount.resource.BTN00636))
                .addLeft(ctrl.define("widget.button", "addImage").label(ecount.resource.BTN00581))
                .addLeft(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141));
        } else {
            toolbar2.addLeft(ctrl.define("widget.button", "addImage").label(ecount.resource.BTN00581))
                .addLeft(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141));
        }

        var uploaderConfig = {
            url: String.format("//{0}/SaveTempResizeImage/{1}/{2}", ecmodule.common.fileStorage.getFileStorageHost(this.storageType), ecenum.tempfileLifetime.oneHour, encodeURIComponent([ecmodule.common.fileStorage.tempComCode, ecount.company.COM_CODE].join(ecount.delimiter))),
            dragdrop: true,
            prevent_duplicates: true,
            multi_selection: false,
            autostart: true,
            max_file_count: 1000,
            menu_code: ecenum.filemenuCode.gwmy,
            resize_format_string: this.thumbnailSize || String.format("150*120{0}375*300{0}50*40", ecount.delimiter),
            extensions: 'png,gif,jpg,jpeg,jpe,jfif,bmp'
        };
        var newFileStorageConfig = {
            storage_host_number: 1,
            comcode: this.comCode,
            collection: "ImageStorage",
            temp_file_lifetime: ecenum.tempfileLifetime.oneHour,
            upload_path: "/SAVETEMPFILE/",
            isOwnerKeyNew: true
        };

        var editorTop = ctrl1.define("widget.textEditor", "editorTop", "editor", "editor").setEditorMode(1)
                    .useHtmlFormat()
                    .value(thisObj.formInfo.FormOutSetTxt.TOP_TXT)
                    .setUploaderConfig("file", uploaderConfig)
                    .setNewFileStorageConfig("file", newFileStorageConfig);
        

        var editorBotton = ctrl2.define("widget.textEditor", "editorBottom", "editor", "editor").setEditorMode(1)
                    .useHtmlFormat()
                    .value(thisObj.formInfo.FormOutSetTxt.BOTTON_TXT)
                    .setUploaderConfig("file", uploaderConfig)
                    .setNewFileStorageConfig("file", newFileStorageConfig);

        // 이미지 첨부 권한 확인
        if (thisObj.ImagePermission.Value == "X") {
            editorTop.isNotEditorImage();
            editorBotton.isNotEditorImage();
        }
        panel1.css("").add(editorTop);
        panel2.css("").add(editorBotton);
        if (thisObj.TabId == "top")
            tabContents.createActiveTab("top", ecount.resource.LBL35311);
        else
            tabContents.createTab("top", ecount.resource.LBL35311);

        tabContents.add(toolbar1)
            .add(panel1);

        //-----code table
        var lst = thisObj.viewBag.InitDatas.TableCode,
            item = new Array();

        subTitle1.title(ecount.resource.LBL03810).wrap()
            .add(ctrl.define("widget.button.search", "searchText").label(ecount.resource.BTN00784).end())

        //test progress 75261
        // 그룹웨어 > 전자결재 > 공통양식등록 > 신규 > option > 출력양식설정 > TOP설정 > 찾기버튼이 겹쳐져서 나옴
        div1.add(subTitle1);
        div1.css("wrapper-toolbar");
        tabContents.add(div1);

        var itemlstTop = lst.select(function (itemTop) { if (["A", "T"].contains(itemTop.TOPBOTTOM_TYPE)) return itemTop })


        itemlstTop.forEach(function (o, index) {
            // if (["A","T"].contains(o.TOPBOTTOM_TYPE)) {
            item.push({
                label: o.SUB_REX_DES,
                value: o.INPUT_CODE,
                isTip: !$.isEmpty(o.TIP_REX_CD) ? true : false,
                type: "",
                message: o.TIP_REX_DES
            });

            if (itemlstTop.length - 1 == index || itemlstTop[index + 1].DIVISION_SORT != o.DIVISION_SORT) {
                var panel3 = g.panel();
                panel3.header({ title: o.REX_DES })
                panel3.add(ctrl.define("widget.list.inputCode", "inputCode" + thisObj.listCntTop, "inputCode" + thisObj.listCntTop)
                               .setOptions({ sArrContents: item })
                               .setOptions({ onClick: thisObj.onTipMessage.bind(thisObj) })
                               .end());
                tabContents.add(panel3);
                item = new Array();
                thisObj.listCntTop++;
            }
            // }
        });




        if (thisObj.TabId == "bottom")
            tabContents.createActiveTab("bottom", ecount.resource.LBL35312);
        else
            tabContents.createTab("bottom", ecount.resource.LBL35312);

        tabContents
            .add(toolbar2)
            .add(panel2);

        //-----code table
        item = new Array();

        subTitle2.title(ecount.resource.LBL03810).wrap()
            .add(ctrl.define("widget.button.search", "searchText").label(ecount.resource.BTN00784).end())

        // test progress 75261
        // 그룹웨어 > 전자결재 > 공통양식등록 > 신규 > option > 출력양식설정 > TOP설정 > 찾기버튼이 겹쳐져서 나옴
        div2.add(subTitle2);
        div2.css("wrapper-toolbar");
        tabContents.add(div2);

        var itemlstBottom = lst.select(function (itembottom) { if (["A", "B"].contains(itembottom.TOPBOTTOM_TYPE)) return itembottom })

        itemlstBottom.forEach(function (o, index) {
            // if (["A","B"].contains(o.TOPBOTTOM_TYPE)) {
            item.push({
                label: o.SUB_REX_DES,
                value: o.INPUT_CODE,
                isTip: !$.isEmpty(o.TIP_REX_CD) ? true : false,
                type: "",
                message: o.TIP_REX_DES
            });

            if (itemlstBottom.length - 1 == index || itemlstBottom[index + 1].DIVISION_SORT != o.DIVISION_SORT) {
                var panel3 = g.panel();
                panel3.header({ title: o.REX_DES })
                panel3.add(ctrl.define("widget.list.inputCode", "inputCode" + thisObj.listCntBottom, "inputCode" + thisObj.listCntBottom)
                               .setOptions({ sArrContents: item })
                               .setOptions({ onClick: thisObj.onTipMessage.bind(thisObj) })
                               .end());
                tabContents.add(panel3);
                item = new Array();
                thisObj.listCntBottom++;
            }
            //}
        });


        if (thisObj.formInfo.FormOutSet.ONLYTOP_USE_YN == "Y" || !thisObj.formInfo.FormSet.IS_BOTTOM_SETTABLE)
            tabContents.hide();

        contents.add(tabContents);

    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))//.clickOnce())
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        //.setOptions({ignorePrimaryButton : true});
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) {
        //if (cid = 'custom') {
        //    var ctrl = widget.generator.control();
        //    control.inline().addControl(ctrl.define("widget.input", "title", "title", ecount.resource.LBL07243))
        //                    .addControl(ctrl.define("widget.link", "changePlainText").label('>>Plain Text'))
        //                    .addControl(ctrl.define("widget.link", "changeRichFormat").label('>>Rich Format'));
        //}    
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) {
        if (event.tabId == "bottom") {
            this.contents.getControl("editorBottom", "bottom").show();
            if (!$.isNull(this.contents.getControl("editorTop", "top")))
                this.contents.getControl("editorTop", "top").hide();
        }
        else {
            if (!$.isNull(this.contents.getControl("editorBottom", "bottom")))
                this.contents.getControl("editorBottom", "bottom").hide();

            this.contents.getControl("editorTop", "top").show();
        }
    },

    onLoadComplete: function (e) {
        //if (!e.unfocus) {
        //    if (!$.isNull(this.contents.getControl("headTitleNm")))
        //        this.contents.getControl("headTitleNm").setFocus(0);
        //    else if (!$.isNull(this.contents.getControl("customFor_ColEssentialYn")))
        //        this.contents.getControl("customFor_ColEssentialYn").setFocus(0);
        //}
    },

    onMessageHandler: function (page, message) {
        var thisObj = this;
        switch (page.pageID) {
            case "CM100P_32":
                if (!$.isNull(message.type) && message.type == "getFormViewHtml") {
                    if (thisObj.contents.currentTabId == "top") {

                        thisObj.contents.getControl("editorTop", "top").setValue(message.data.sampleHtml);
                    } else {
                        thisObj.contents.getControl("editorBottom", "bottom").setValue(message.data.sampleHtml);
                    }
                    message.callback && message.callback();
                    return;
                }
                break;
            case "EGG025M":
                if (!$.isEmpty(message.data)) {
                    var targetEditor = thisObj.contents.currentTabId == "top" ? "editorTop" : "editorBottom";
                    message.data.forEach(function (item) {
                        this.contents.getControl(targetEditor, this.contents.currentTabId).setValue(this.contents.getControl(targetEditor, this.contents.currentTabId).getValue() + item.fileUrlWithTag);
                    }.bind(this));
                }
                message.callback && message.callback();
                return;
        }
        message.callback && message.callback();
    },

    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },

    onFocusOutHandler: function (event) {
        //move next focus 다음 폼으로 이동
        var forms = this.contents.getForm();
        if (forms.length > 0) {
            if (event.__self == this.contents.getForm()[forms.length - 1]) {
                this.footer.getControl("apply").setFocus(0);
            } else {
                for (var i = 0; i < forms.length; i++) {
                    if (event.__self == this.contents.getForm()[i] && (forms.length - 1) > i) {
                        this.contents.getForm()[i + 1].getControlByIndex(0).setFocus(0);
                        break;
                    }
                }
            }
        }
    },

    onFocusOutControlHandler: function (control) {
    },

    onChangeControl: function (control, data) {
    },


    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onContentsSearchText: function (event) {
        this.contents.getControl("searchText").toggleSearchText();
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    //TIP 클릭시
    onTipMessage: function (event, data) {
         switch (event.eventType) {
            case "add":
                 if (event.value) {                     
                     if (this.contents.currentTabId == "top") {                         
                         this.contents.getControl("editorTop", "top").setPasteContent(event.value, null, null, true);
                     } else {
                         this.contents.getControl("editorBottom", "bottom").setPasteContent(event.value, null, null, true);
                     }
                 }
                break;
            case "tip":
                ecount.alert(event.message);
                break;
            default:
                break;
        }
    },

    onContentsRestore: function (event) {
        var thisObj = this;
        var message = {
            type: "getRestoreFormInfo",
            restoreType: this.contents.currentTabId,
            callback: function (data) {
                if (this.contents.currentTabId == "top") {
                    this.formInfo.FormOutSetTxt.TOP_TXT = data.FormOutSetTxt.TOP_TXT;
                    this.contents.getControl("editorTop", "top").setValue(thisObj.formInfo.FormOutSetTxt.TOP_TXT);
                } else {
                    this.formInfo.FormOutSetTxt.BOTTON_TXT = data.FormOutSetTxt.BOTTON_TXT;
                    this.contents.getControl("editorBottom", "bottom").setValue(thisObj.formInfo.FormOutSetTxt.BOTTON_TXT);
                }
            }.bind(this)
        };
        this.sendMessage(this, message);
    },

    onContentsViewSample: function (param) {
        /*
        // gubun [ S : 샘플보기] , [ D : 기부하기 ]
		var strGubun = "S";
		if (gubun == "D")
		{
			strGubun = "D";
			if
			(
				"<%=GetAuthCd(this.ComCd, this.UserId, "E000101").Split(new char[] { '|' }).GetValue(1).ToString() %>" != "W" &&
				"<%=GetAuthCd(this.ComCd, this.UserId, "E000104").Split(new char[] { '|' }).GetValue(1).ToString() %>" != "W" &&
				"<%=GetAuthCd(this.ComCd, this.UserId, "E000105").Split(new char[] { '|' }).GetValue(1).ToString() %>" != "W"
			)
			{
				alert("<%=GetResource("MSG00287") %>");
				return;
			}
		}        
        */
        var thisObj = this;

        var param = {
            width: '800',
            height: '750',
            isShareView: thisObj.viewBag.InitDatas.isShareView,
            formType: thisObj.FORM_TYPE,
            listFlag: 'S'
        }
        thisObj.openWindow({
            url: '/ECERP/POPUP.FORM/CM100P_32',
            name: ecount.resource.LBL09106,
            param: param,
            additional: true
        });
    },

    onContentsAddImage: function (param) {
        var thisObj = this;
        var groupPer = thisObj.viewBag.InitDatas.GroupwarePermission;
        var groupAlert = ecount.infra.getGroupwarePermissionByAlert(groupPer);
        groupAlert.SetNoUseNoFreeFunction(function () {
            ecount.alert(ecount.resource.MSG02277);
        });
        groupAlert.SetNoUseFreeFunction(function () {
            ecount.alert(ecount.resource.MSG02273);
        });
        groupAlert.SetExpireDatePassByMasterFunction(function () {
            ecount.alert(ecount.resource.MSG02278);
        });
        groupAlert.SetExpireDatePassByUserFunction(function () {
            ecount.alert(ecount.resource.MSG02278);
        });
        groupAlert.SetNoPermissionFunction(function () {
            ecount.alert(ecount.resource.MSG02281);
        });
        groupAlert.SetFileSizeExceedByMasterFunction(function () {
            ecount.alert(ecount.resource.MSG02297);
        });
        groupAlert.SetFileSizeExceedByUserFunction(function () {
            ecount.alert(ecount.resource.MSG02297);
        });
        var locationAllow = groupAlert.Excute();
        if (locationAllow && !["EXPIREDATEPASSBYMASTER", "FILESIZEEXCEEDBYUSER"].contains(groupPer)) {
            var param = {
                width: 800,
                height: 600,
                AFlag: "4",
                PageType: "Apply",
                MaxCheckCount: 1,
                CheckedCount: 0,
                isViewApplyButton: true,
                EditorMode: "Y",
                isViewSizeSelectButton: true
            }
            this.openWindow({
                url: "/ECERP/EGG/EGG025M",
                name: 'CM100P_24',
                param: param,
                popupType: false
            });
        }
    },


    //Apply 적용 버튼
    onFooterApply: function () {
        debugger
        var htmlsrc = this.contents.getControl("editorTop", "top").getValue();
        ecount.common.checkLimitContent(htmlsrc, 5, "top", this.checkLimitContentCallback.bind(this));
    },

    checkLimitContentCallback: function (state, tabId) {
        var _self = this;
        if (state) {
            if (_self.formInfo.FormSet.IS_BOTTOM_SETTABLE == false || tabId == "bottom") {
                _self.formInfo.FormOutSetTxt.TOP_TXT = _self.contents.getControl("editorTop", "top").getValue();
                if (_self.formInfo.FormSet.IS_BOTTOM_SETTABLE) {
                    _self.formInfo.FormOutSetTxt.BOTTON_TXT = _self.contents.getControl("editorBottom", "bottom").getValue();
                }
                var message = {
                    formOutSetTxt: _self.formInfo.FormOutSetTxt,
                    callback: _self.close.bind(_self)
                };
                _self.sendMessage(_self, message);
            }
            else {
                var tab_id = "bottom", textEditorId = "editorBottom";
                var htmlsrc = _self.contents.getControl(textEditorId, tab_id).getValue();
                ecount.common.checkLimitContent(htmlsrc, 5, tab_id, _self.checkLimitContentCallback.bind(_self));
            }
        }
        else {
            var btnApply = _self.footer.getControl("apply");
            btnApply.setAllowClick();
            _self.contents.changeTab(tabId, true);
            var param = { tabId: tabId };
            _self.onChangeContentsTab(param);
            ecount.alert(ecount.resource.MSG08212);
        }
    },


    //close 닫기버튼
    onFooterClose: function () {
        this.close();
    },


    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    ON_KEY_F3: function (event) {
        this.contents.getControl("searchText").toggleSearchText();
        event.preventDefault();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (event, target) {
        var intSearchCount = 0;
        var lastContents = ((this.contents.currentTabId == "top") ? this.lastListCntTop : this.lastListCntBottom);
        for (var i = lastContents; i < ((this.contents.currentTabId == "top") ? this.listCntTop : this.listCntBottom) ; i++) {
            var blnSearch = false;
            if (intSearchCount == 0) {
                blnSearch = this.contents.getControl("inputCode" + i, this.contents.currentTabId).setSearchValue(this.contents.getControl("searchText", this.contents.currentTabId).getValue());
            }
            if (blnSearch) {
                intSearchCount++;
                lastContents = i;
            }
            else {
                this.contents.getControl("inputCode" + i, this.contents.currentTabId).setInitSearchValue();
            }
        }
        if (intSearchCount == 0)
            lastContents = 1;

        if (this.contents.currentTabId == "top") {
            this.lastListCntTop = lastContents;
        } else {
            this.lastListCntBottom = lastContents;
        }
    },

    //F8 Event
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterApply();
    },


    //KEY_ESC
    ON_KEY_ESC: function () {
        this.close();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    setGridDataLink: function (value, rowItem) {
        var thisObj = this;
        var errcnt = 0;
        var option = {};
        option.data = rowItem.TITLE;
        option.controlType = "widget.link";
        return option;
    },


    //getParentInfo: function (message) {
    //    if (!$.isNull(message.type) && message.type == "getParentInfo") {
    //        var parentInfo = {
    //            editorMode: "Y"
    //        };
    //        message.callback && message.callback(parentInfo);
    //        return;
    //    }
    //},

    //setParentInfo: function (message) {
    //    if (!$.isNull(message.type) && message.type == "setParentInfo") {
    //        if (this.contents.currentTabId == "top") {
    //            this.contents.getControl("editorTop", "top").setValue(this.contents.getControl("editorTop", "top").getValue() + message.imagePath);
    //        } else {
    //            this.contents.getControl("editorBottom", "bottom").setValue(this.contents.getControl("editorBottom", "bottom").getValue() + message.imagePath);
    //        }
    //        message.callback && message.callback();
    //        return;
    //    }
    //},

});