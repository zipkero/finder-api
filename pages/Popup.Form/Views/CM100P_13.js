window.__define_resource && __define_resource("LBL00042","MSG06110","BTN00065","BTN00008","MSG00141","LBL07157","MSG01184");
/****************************************************************************************************
1. Create Date : 2016.04.29
2. Creator     : Le Thanh Vu
3. Description : Popup Batch Import Bundling Settings (Popup Các mục chuẩn cho phiếu)
4. Precaution  :
5. History     :
6. Old File    : CM100P_13.aspx
****************************************************************************************************/

//Popup Batch Import Bundling Settings (Popup Các mục chuẩn cho phiếu)
ecount.page.factory("ecount.page.popup.type2", "CM100P_13", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/

    //Data for check box (Dữ liệu cho check box)
    dataCheckBox: {},

    //Permission
    userPermit: "",

    //For Show History (Chứa dữ liệu để hiện History)
    history: null,

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
        //Set Permission
        this.userPermit = this.viewBag.Permission.Permit.Value;
        //Set History
        this.history = {
            EDIT_DT: this.CofmFormOutSet.EDIT_DT,
            EDIT_ID: this.CofmFormOutSet.EDIT_ID
        };
    },

    /*************************************************************************************************** 
    * UI Layout setting
    ****************************************************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark()
            .disable()
            .setTitle(ecount.resource.LBL00042);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            panel = g.settingPanel(),
            ctrl = g.control(),
            ctrlCustom = g.control();

        this.resizeLayer(500, 50);

        //Data For CheckBox (Dữ liệu CheckBox)
        this.dataCheckBox = this.fnGetDataForCheckBox();

        //Create Control CheckBox (Tạo CheckBox)
        var listCheckBox = ctrl.define('widget.checkbox', 'ImportBundlingSettings', 'ImportBundlingSettings')
                .label(this.dataCheckBox.LabelData)
                .value(this.dataCheckBox.ValueData);

        //Set Selected CheckBox (Đánh đấu các giá trị được chọn)
        for (i = 0; i < this.dataCheckBox.SelectData.length; i++) {
            ctrl.select(this.dataCheckBox.SelectData[i]);
        }

        //Create Panel
        panel
            //Set title, Description And List Field Name Default (Thêm danh tên trường mặc định). MSG06110
            .header(ecount.resource.LBL00042, String.format(ecount.resource.MSG06110, this.uiGetFieldNameDefault()))
            //Add Check List Field (Thêm mục chọn các trường)
            .addContents(listCheckBox.end());

        contents.add(panel);
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));

        footer.add(toolbar);
    },

    /***************************************************************************************************
    * define common event listener
    ***************************************************************************************************/

    //로드시 (On Load Complete)
    onLoadComplete: function (e) {
       // this.uiGetRealHeightPopup();
        //Set focus
        this.contents.getControl('ImportBundlingSettings').setFocus(0);
    },

    //저장 버튼 (save button click event)
    onFooterSave: function (e) {

        //Get button Save from toolbar index 0 in footer (Lấy ra nút Save trong toolbar đầu ở trong footer)
        var btnSave = this.footer.getControl("Save");

        //Check Permission
        if (this.userPermit != 'W') {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.MSG00141, PermissionMode: "W" }]);
            ecount.alert(msgdto.detail);
            btnSave.setAllowClick();
            return;
        }

        //Save
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

        if (this.history.EDIT_DT == null || this.history.EDIT_ID == null) {
            ecount.alert('Data Empty');
            return;
        }

        var param = {
            width: 300,
            height: 121,
            lastEditTime: this.history.EDIT_DT,
            lastEditId: this.history.EDIT_ID
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
            tagParent = ecount.parentFrame.document;
        }
        else {
            tagParent = document;
            contentsHeight += 20; //Extend 20px
        }

        //Height of tag 'div.panel-heading' And custom sub a alot pixel (chiều cao của Tag 'div.panel-heading' và trừ lại vào pixel)
        var heightTitleWindowPopup = $(tagParent.getElementsByTagName('body'))
            .children('div[role="dialog"]')
            .children('div.panel-heading')
            .eq(0).height();

        sumHeightWindowPopup = heightTitleWindowPopup + headerHeight + contentsHeight + footerHeight;

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

    //Get List Field Name Default (Lấy danh tên trường mặc định)
    uiGetFieldNameDefault: function () {

        //Add list field Default
        var strFieldDefault = '';
        var listField = this.viewBag.InitDatas.ListField;
        for (x in listField) {
            if (listField[x].DIVISION_SORT != 1) {
                continue;
            }

            strFieldDefault += listField[x].TITLE + ', ';
        }

        return strFieldDefault.trim(', ');
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

    //Get Data For CheckBox (lấy dữ liệu cho CheckBox)
    fnGetDataForCheckBox: function () {
        
        var result = {
            //Data for Lable CheckBox (Dữ liệu cho Label của CheckBox)
            LabelData: [],
            //Data for value CheckBox (Dữ liệu cho Value của CheckBox)
            ValueData: [],
            //Data for select of CheckBox (Dữ liệu cho Select của CheckBox)
            SelectData: []
        };

        //Field Not Obligatory (Danh sách trường không bắt buộc)
        var listField = this.viewBag.InitDatas.ListField;
        for (i = 0; i < listField.length; i++) {
            if (listField[i].DIVISION_SORT == 1)
                continue;

            result.LabelData.push(listField[i].TITLE);
            result.ValueData.push(listField[i].COL_CD);
        }

        //Field Had Select (Danh sách trường được chọn)
        var listFieldHasCheck = this.viewBag.InitDatas.ListFieldUse;
        for (i = 0; i < listFieldHasCheck.length; i++) {
            if (listFieldHasCheck[i].DIVISION_SORT == 1)
                continue;

            result.SelectData.push(listFieldHasCheck[i].COL_CD);
        }

        return result;
    },

    //Save
    fnSave: function () {
        var self = this;
        var listCofmFormOutSetDetail = [];
        var btnSave = this.footer.getControl("Save");

        //List all Data (Danh sách sách tất cả)
        var listField = this.viewBag.InitDatas.ListField;

        if (listField == null || listField.length == 0) {
            return;
        }

        //List item Checked (Danh sách các item được check)
        var listChecked = self.contents.getControl('ImportBundlingSettings').getCheckedValue();

        //Add for list data (Thêm vào danh sách dữ liệu)
        for (i = 0; i < listField.length; i++) {
            //Add item Obligatory (Thêm danh sách bắt buộc).
            if (listField[i].DIVISION_SORT == 1) {
                listCofmFormOutSetDetail.push({
                    HEAD_TITLE_NM: listField[i].TITLE,
                    COL_CD: listField[i].COL_CD,
                });
            }
            //Add item checked (Thêm các item được check)
            else if (listChecked.contains(listField[i].COL_CD)) {
                listCofmFormOutSetDetail.push({
                    HEAD_TITLE_NM: listField[i].TITLE,
                    COL_CD: listField[i].COL_CD,
                });
            }
        }

        //Call API
        ecount.common.api({
            url: "/Common/Form/SaveCofmFormOutSet",
            data: Object.toJSON({
                COFM_FORMOUTSET: self.CofmFormOutSet,
                CofmFormoutsetDetails: listCofmFormOutSetDetail
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                }
                //IF Success Refresh new History (Nếu thành công thì cập nhật lại lịch sử mới)
                //When Success result.Data is COFM_FORMOUTSET
                else if (result != null) {
                    self.history = result.Data.History;
                    ecount.alert(ecount.resource.MSG01184, { width: 200, height: 100 });
                }
            },
            complete: function () {
                btnSave.setAllowClick();
                //Set focus
                self.contents.getControl('ImportBundlingSettings').setFocus(0);
            }
        });
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
        if (target != null) {
            //If focus current is last check item then set focus btnSave (Nếu focus đang ở item checkbox cuối cùng thì chuyển focus sang nút Save)
            if (target.cid == 'ImportBundlingSettings' && target.cindex == this.dataCheckBox.ValueData.length - 1) {
                this.footer.getControl('Save').setFocus(0);
            }
        }
        else {
            this.footer.getControl('Save').setFocus(0);
        }
    }
});
