window.__define_resource && __define_resource("LBL00212","LBL01730","MSG06116","BTN00141","LBL00456","LBL85114","LBL35616","LBL35617","LBL00359","LBL01035","LBL03086","LBL02509","LBL00223","LBL03213","LBL02146","BTN00065","BTN00007","BTN00008","MSG00141","LBL07157","LBL06674","LBL06675","LBL06676","LBL03539","LBL06672","LBL00911","LBL06673","MSG01184");
/****************************************************************************************************
1. Create Date : 2016.04.29
2. Creator     : Le Thanh Vu
3. Description : Recipient / Set recipient on invoice (Template) (Thiết lập người nhận trên hóa đơn (mẫu))
4. Precaution  :
5. History     : 2020.10.22 (유형준) - A20_04994 option에 있는 설정들 상세권한 설정 권한 타도록 수정_회계1
6. Old File    : CM100P_09.aspx
****************************************************************************************************/

//Popup Batch Import Bundling Settings (Popup Các mục chuẩn cho phiếu)
ecount.page.factory("ecount.page.popup.type2", "CM100P_09", {
    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/

    //Permission
    userPermit: null,

    //KeyForm
    keyForm: null,

    //List Data Grid (Dữ liệu cho lưới)
    ListData: null,

    //For Show History (Chứa dữ liệu để hiện History)
    History: null,

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },

    initProperties: function () {
        //Set Data Key
        this.keyForm = this.viewBag.InitDatas.KeyForm;
        //Set Permission
        this.userPermit = this.viewBag.Permission.Permit.Value;
        //Set Data Grid
        this.ListData = this.viewBag.InitDatas.ListData;
        this.userPermit1 = this.viewBag.Permission.permitUser.Value;
    },

    /*************************************************************************************************** 
    * UI Layout setting
    ****************************************************************************************************/

    //Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark()
            .disable()
            .setTitle(this.keyForm.FORM_TYPE == 'SF910' ? ecount.resource.LBL00212 : ecount.resource.LBL01730);
    },

    //Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            div = g.div(),
            toolbar = g.toolbar(),
            panel = g.settingPanel(),
            ctrl = g.control();

        this.resizeLayer(750, 615);

        //Create Panel
        if (this.keyForm.FORM_TYPE == 'SF910') {
            panel
           //Set title, Description And List Field Name Default (Thêm danh tên trường mặc định). MSG06116
           .header(ecount.resource.LBL00212);
        } else {
            panel
           //Set title, Description And List Field Name Default (Thêm danh tên trường mặc định). MSG06116
           .header(ecount.resource.LBL01730, ecount.resource.MSG06116);
        }

        if (this.keyForm.FORM_TYPE == 'SF910') {
            //Create toolbar
            toolbar
                //Add Button Restore Default
                .addLeft(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").clickOnce());
        } else {
            //Create toolbar
            toolbar
                //Add Button Restore Default
                .addRight(ctrl.define("widget.button", "Restore").label(ecount.resource.BTN00141).clickOnce());
        }

        if (this.keyForm.FORM_TYPE == 'SF910') {
            var divtitle = '<div style="width: 700px;' +
                                        'margin: 25px;' +
                                        'padding: 5px;' +
                                        'border: 7px solid #f2f2f2;' +
                                        'text-align: center;">' +
                                        '<div id="titlemail">' +
                                        '<span style="font-size:25px; margin:10px 0 0 0; display: inline-block;">' +
                                        '<lable style="padding-bottom:2px; border-bottom:1px solid #000; font-size:25px;  font-weight:bold; line-height:32px;">' +
                                        ecount.resource.LBL00212 +
                                        '</lable></span></div><br>'
            var divcontent = '<div id= "content1" style="width:650px; height:auto; margin:10px auto 0 auto; padding:0 0 5px 2px;">'
                            + '<table summary="" style="width: 100%; padding:0; margin:0; border:1px solid #bbb; border-collapse: collapse;"><tbody>';

            //Create row for table
            for (var i = 0; i < 5; i++) {
                divcontent = divcontent + '</tr><td align="' + this.ListCofmFormOutSetDetailMust[i].HEAD_POS_TYPE + '" style="padding-left:5; border:0 0 0 0; height:20px;"><span style="font-size:' +
                    this.ListCofmFormOutSetDetailMust[i].FONT_SIZE + 'px" >';

                switch (this.ListCofmFormOutSetDetailMust[i].COL_CD) {
                    case ("cust.addr"):
                        divcontent = divcontent + ecount.resource.LBL00456;
                        break;
                    case ("cust.dm_addr"):
                        divcontent = divcontent + ecount.resource.LBL85114;
                        break;
                    case "cust.post_no":
                        divcontent = divcontent + ecount.resource.LBL35616;
                        break;
                    case "cust.dm_post":
                        divcontent = divcontent + ecount.resource.LBL35617;
                        break;
                    case "cust.cust_name":
                        divcontent = divcontent + ecount.resource.LBL00359;
                        break;
                    case "cust.boss_name":
                        divcontent = divcontent + ecount.resource.LBL01035;
                        break;
                    case "cust.hp_no":
                        divcontent = divcontent + ecount.resource.LBL03086;
                        break;
                    case "cust.tel":
                        divcontent = divcontent + ecount.resource.LBL02509;
                        break;
                    case "cust.fax":
                        divcontent = divcontent + ecount.resource.LBL00223;
                        break;
                    case "cust.remarks_win":
                        divcontent = divcontent + ecount.resource.LBL03213;
                        break;
                    case "cust.cont1":
                        divcontent = divcontent + this.ListParamPDes["cont1"];
                        break;
                    case "cust.cont2":
                        divcontent = divcontent + this.ListParamPDes["cont2"];
                        break;
                    case "cust.cont3":
                        divcontent = divcontent + this.ListParamPDes["cont3"];
                        break;
                    case "cust.cont4":
                        divcontent = divcontent + this.ListParamPDes["cont4"];
                        break;
                    case "cust.cont5":
                        divcontent = divcontent + this.ListParamPDes["cont5"];
                        break;
                    case "cust.cont6":
                        divcontent = divcontent + this.ListParamPDes["cont6"];
                        break;
                    case "cust.no_cust_user1":
                        divcontent = divcontent + this.ListNoCustUser["no_cust_user1"];
                        break;
                    case "cust.no_cust_user2":
                        divcontent = divcontent + this.ListNoCustUser["no_cust_user2"];
                        break;
                    case "cust.no_cust_user3":
                        divcontent = divcontent + this.ListNoCustUser["no_cust_user3"];
                        break;
                }
                divcontent = divcontent + " " + this.ListCofmFormOutSetDetailMust[i].HEAD_TXT +
                '</span></td></tr>';
            }
            divcontent = divcontent + '</tbody></table></div>';
            console.log(divcontent);
            div.html(divtitle + divcontent + '<table style="margin:10px auto 0 auto; padding:0 0 5px 2px;;width: 650px;padding: 0;font-size: 12px;border-collapse: collapse;'
            + 'border-spacing: 0;'
            + 'border: 1px solid #bbb;'
            + 'clear: both;"><div><tr><td style="text-align: center;" >--------------------' + ecount.resource.LBL02146 + '--------------------</td></tr></table></div>');
            //contents.add(divcontent);
            contents.add(div);
        }
        contents.add(panel);
        contents.add(toolbar);
        contents.addGrid('GridMain', this.uiGenerateGrid());
    },

    //Footer Initialization
    onInitFooter: function (footer) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "History").label("H").hide());

        footer.add(toolbar);
    },

    /***************************************************************************************************
    * define common event listener
    ***************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {
        //Set Size UI
        //if (this.keyForm.FORM_TYPE != 'SF910')
        //    this.uiGetRealHeightPopup();

        //Set History
        if (this.ListCofmFormOutSetDetailMust.length > 0 && this.ListCofmFormOutSetDetailMust[0].WRITE_DT != undefined && this.ListCofmFormOutSetDetailMust[0].WRITE_DT != null) {
            this.footer.getControl("History").show();
            this.History = {
                WRITE_DT: this.ListCofmFormOutSetDetailMust[0].WRITE_DT,
                WRITE_ID: this.ListCofmFormOutSetDetailMust[0].WRITE_ID
            };
        }
    },

    //Click button Default Settings (Click nút mặc định)
    onContentsRestore: function(e) {
        var self = this,
            btnRestore = self.contents.getControl("Restore");

        //Param API
        var parms = {
            Key: this.keyForm,
            IsRestoreDefault: true
        };
        //Call API
        ecount.common.api({
            url: "/Common/Form/GetDefaultCofmOutSetDetailMust",
            data: Object.toJSON(parms),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                    //IF Success Refresh Data grid (Nếu thành công thì làm mới dữ liệu lưới)
                else if (result != null) {
                    //Refresh data grid (làm mới dữ liệu của grid)
                    self.contents.getGrid().getSettings().setRowData(result.Data); //Set Data
                    self.contents.getGrid().draw(); //Refresh
                }
            },
            complete: function () {
                btnRestore.setAllowClick();
            }
        });
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            this.contents.getGrid().grid.setCellFocus('HEAD_TXT', '0');
        }
    },

    //Click Reset Button
    onFooterReset: function (e) {

        var btnReset = this.footer.getControl("Reset");
        //Refresh data grid (làm mới dữ liệu của grid)
        this.contents.getGrid().getSettings().setRowData(this.ListData); //Set Data
        this.contents.getGrid().draw(); //Refresh

        btnReset.setAllowClick();
    },

    //저장 버튼 (save button click event)
    onFooterSave: function (e) {

        //Get button Save from toolbar index 0 in footer (Lấy ra nút Save trong toolbar đầu ở trong footer)
        var btnSave = this.footer.getControl("Save");

        //Check Permission
        if (this.isDetailPermit == false) {
            if (this.keyForm.FORM_TYPE != 'SF910') {
                if (this.userPermit != 'W') {
                    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.MSG00141, PermissionMode: "W" }]);
                    ecount.alert(msgdto.detail);
                    btnSave.setAllowClick();
                    return;
                }
            } else {
                if (this.userPermit != 'W') {
                    ecount.alert(ecount.resource.MSG00141);
                    btnSave.setAllowClick();
                    return;
                }
                if (this.userPermit1 != 'W') {
                    ecount.alert(ecount.resource.MSG00141);
                    btnSave.setAllowClick();
                    return;
                }
            }
        }
        //Call Function Save
        this.fnSave();
    },

    //On Click Close Button (Khi nhấp vào nút đóng)
    onFooterClose: function (e) {
        var self = this;
        this.setTimeout(function () {
            self.close();
        }, 0);
    },

    // History button clicked event (Khi nhấp vào nút H)
    onFooterHistory: function (e) {

        if (this.History.WRITE_DT == null || this.History.WRITE_ID == null) {
            ecount.alert('Data Empty');
            return;
        }

        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.ListCofmFormOutSetDetailMust[0].WRITE_DT,
            lastEditId: this.ListCofmFormOutSetDetailMust[0].WRITE_ID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false,
            additional: false
        });
    },

    /**************************************************************************************************** 
     * define UI function 
     ****************************************************************************************************/

    //Get Real Height Tag by selector (lấy thông số chiều cao của Tag theo lệnh selector)
    uiGetRealHeighPopupBySelector: function (selector) {

        //Array css effect tag height (danh sách các css có ảnh hưởng đến chiều cao của tag)
        var cssEffectHeight = ["padding-top", "padding-bottom", "margin-top", "margin-bottom"];

        //Param temp use in for loop (biến nháp dùng để gán dữ liệu cho vòng lập)
        var heightTmp = 0;
        //Sum Height of Tag (tổng chiều cao của Tag)
        var sumHeight = $(selector).height();

        //Height of tag sum with value of css (Lấy chiều cao của Tag cộng với giá trị của css)
        for (i = 0 ; i < cssEffectHeight.length ; i++) {
            heightTmp = $(selector).css(cssEffectHeight[i]);

            //IF contents char 'px' then it has height (Nếu có ký tự 'px' thì nó xác định được chiều cai của css đó)
            if (heightTmp.indexOf('px') > 0) {
                sumHeight += 1 * heightTmp.trim('px');
            }
        }

        return sumHeight;
    },

    //Get Real Height Popup need (lấy thông số chiều cao mà popup cần)
    uiGetRealHeightPopup: function () {
        var self = this;

        //Sum Height Window Popup (tổng chiều cao của cửa sổ popup)
        var sumHeightWindowPopup = 0;
        //Get real height header (lấy chiều cao của header)
        var headerHeight = this.uiGetRealHeighPopupBySelector('div.header.header-fixed');
        //Get real height table in contents (lấy chiều cao của table trong contents)
        var contentsHeight = 0;
        $("div.contents.contents-fixed").children().each(function () {
            contentsHeight += self.uiGetRealHeighPopupBySelector(this);
        });
        contentsHeight += self.uiGetRealHeighPopupBySelector("div.contents") - $("div.contents").height();

        //Get real height footer (lấy chiều cao của footer)
        var footerHeight = this.uiGetRealHeighPopupBySelector('div.footer.footer-fixed');

        //Check where Popup be contain (Kiểm tra Popup được chứa ở đâu)
        var checkTag = $(document.getElementsByTagName('body'))
            .children('div[role="dialog"]')
            .children('div.panel-heading');

        var tagParent = null;
        if (checkTag.length == 0) {
            tagParent = ecount.getParentFrame(window).document;
        }
        else {
            tagParent = document;
            contentsHeight += 35; //Extend 20px
        }

        //Height of tag 'div.panel-heading' And custom sub a alot pixel (chiều cao của Tag 'div.panel-heading' và trừ lại vào pixel)
        var heightTitleWindowPopup = $(tagParent.getElementsByTagName('body'))
            .children('div[role="dialog"]')
            .children('div.panel-heading')
            .eq(0).height();

        sumHeightWindowPopup = heightTitleWindowPopup + headerHeight + contentsHeight + footerHeight + 250;

        //Get Tag parent of popup (Lấy phần tử chứa popup)
        var findTagContain = $(tagParent.getElementsByTagName('body'))
            .children('div[role="dialog"]')
            .children('div[id^="ecpopup"]')
            .eq(0);
        findTagContain.height(sumHeightWindowPopup);

        //Top window popup (vị trí top của cửa sổ Popup)
        var tagParentPopupHeight = $(findTagContain).parent('div[role="dialog"]').height();
        var top = (($(tagParent).height() - tagParentPopupHeight) / 2);// - discountValue;

        //If top less 20 then set top = 20 (Nếu top nhỏ hơn 20 thì cho top cách lề trên là 20px)
        if (top < 20)
            top = 20;

        $(findTagContain).parent('div[role="dialog"]').css({ "top": top + "px" });
    },

    //Custom Cell COL_CD (Hiệu chỉnh Cell COL_CD)
    uiCustomCell_COL_CD: function (value, rowItem) {
        var option = {};

        var dataSelect = this.viewBag.InitDatas.DataUI_COL_CD;
        var selectOption = new Array();
        for (i = 0; i < dataSelect.length; i++) {
            selectOption.push([dataSelect[i].Value, dataSelect[i].Name]);
        }

        option.controlType = 'widget.select';
        option.optionData = selectOption;

        if (rowItem.COL_CD == '' || rowItem.COL_CD == null)
            option.data = '';

        return option;
    },

    //Custom Cell FONT_SIZE (Hiệu chỉnh cell FONT_SIZE)
    uiCustomCell_FONT_SIZE: function (value, rowItem) {
        var option = {};

        var minFontSize = 9,
            maxFontSize = 20;

        var selectOption = new Array();
        for (i = maxFontSize; i >= minFontSize; i--) {
            selectOption.push([i, i + 'px']);
        }

        option.controlType = 'widget.select';
        option.optionData = selectOption;

        if (rowItem.FONT_SIZE == '' || rowItem.FONT_SIZE == null)
            option.data = 11;

        return option;
    },

    //Custom Cell HEAD_POS_TYPE (Hiệu chỉnh cell HEAD_POS_TYPE)
    uiCustomCell_HEAD_POS_TYPE: function (value, rowItem) {
        var option = {};
        option.controlType = 'widget.select';
        option.optionData = [
            ['left', ecount.resource.LBL06674],
            ['center', ecount.resource.LBL06675],
            ['right', ecount.resource.LBL06676],
        ];

        if (rowItem.HEAD_POS_TYPE == '' || rowItem.HEAD_POS_TYPE == null)
            option.data = 'left';

        return option;
    },

    //Custom Cell HEAD_TEXT (Hiệu chỉnh cell HEAD_TEXT)
    uiCustomCell_HEAD_TEXT: function (value, rowItem) {
        var self = this;
        var option = {};
        option.event = {
            //Event Set next focus
            'setNextFocus': function (e, data) {
                var rowCount = self.contents.getGrid().grid.getRowCount();
                //Last row focus to button Save
                if (data.rowIdx == rowCount - 1) {
                    self.footer.getControl('Save').setFocus(0);
                    return false;
                }
                return true;
            }
        };
        return option;
    },

    //Generate Grid (Tạo lưới)
    uiGenerateGrid: function () {
        var g = widget.generator,
            grid = g.grid();

        // Initialize Grid
        grid.setRowData(this.ListData)
            .setColumnFixHeader(true)
            .setRowDataNumbering(true, true)
            //Allow Edit in Grid (Cho phép chỉnh sửa trong lưới)
            .setEditable(true, 0, 0)
            .setColumns([
                    { propertyName: 'HEAD_POS_TYPE', id: 'HEAD_POS_TYPE', title: ecount.resource.LBL03539, width: '80', controlType: 'widget.select' },
                    { propertyName: 'FONT_SIZE', id: 'FONT_SIZE', title: ecount.resource.LBL06672, width: '80', controlType: 'widget.select' },
                    { propertyName: 'COL_CD', id: 'COL_CD', title: ecount.resource.LBL00911, width: '250', controlType: 'widget.select' },
                    { propertyName: 'HEAD_TXT', id: 'HEAD_TXT', title: ecount.resource.LBL06673, width: '', controlType: 'widget.input.general' },
            ])
            //Custom Display Content Cell (Hiệu hỉnh nội dung hiển thị của cell)
            .setCustomRowCell('COL_CD', this.uiCustomCell_COL_CD.bind(this))
            .setCustomRowCell('FONT_SIZE', this.uiCustomCell_FONT_SIZE.bind(this))
            .setCustomRowCell('HEAD_POS_TYPE', this.uiCustomCell_HEAD_POS_TYPE.bind(this))
            .setCustomRowCell('HEAD_TXT', this.uiCustomCell_HEAD_TEXT.bind(this))
        ;
        return grid;
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //Function Save (Hàm Save)
    fnSave: function () {
        var self = this;
        //Get button Save from toolbar index 0 in footer (Lấy ra nút Save trong toolbar đầu ở trong footer)
        var btnSave = this.footer.getControl("Save");

        //Get List Row in Grid (Lây tất cả dòng dữ liệu trong grid)
        var listRowInGrid = this.contents.getGrid().grid.getRowList();
        if (listRowInGrid == null || listRowInGrid.length == 0) {
            btnSave.setAllowClick();
            return;
        }

        var tempdata = this.keyForm.FORM_TYPE;
        //Call API
        ecount.common.api({
            url: "/Common/Form/SaveCofmOutSetDetailMust",
            data: Object.toJSON({
                CofmFormoutsetDetailMusts: listRowInGrid,
                FormTypeSeqKey: this.keyForm
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                    //IF Success Refresh new History (Nếu thành công thì cập nhật lại lịch sử mới)
                    //When Success result.Data is COFM_FORMOUTSET
                else if (result != null) {
                    self.History = result.Data.History;
                    self.footer.getControl("History").show();
                    if (tempdata == 'SF910') {
                        btnSave.setAllowClick();
                        var message = {
                            name: "CM100P_09",
                            code: "",
                            data: "CM100P_09",
                            isAdded: true,
                            addPosition: "current",
                            callback: this.close.bind(this)
                        };
                        self.reloadPage();
                    } else {
                        ecount.alert(ecount.resource.MSG01184, { width: 200, height: 100 });
                    }
                }
            },
            complete: function () {
                btnSave.setAllowClick();
            }
        });
    },

    //Reload page(load lai page)
    reloadPage: function () {
        var self = this;

        var param = {
            width: 760,
            height: 560,
            FORM_TYPE: "SF910"
        }
        self.onAllSubmitSelf("/ECERP/Popup.Form/CM100P_09", param);
    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    *****************************************************************************************************/

    // Press F8
    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },

    // Press ENTER
    ON_KEY_ENTER: function (e, target) {
        if (target == null) {
            this.footer.getControl("Save").setFocus(0);
        }
    }
});