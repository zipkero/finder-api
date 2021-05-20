window.__define_resource && __define_resource("LBL07973","LBL02502","MSG06854","MSG06855","LBL09629","BTN00008","BTN00276","LBL02853");
/****************************************************************************************************
1. Create Date : 2016.12.21
2. Creator     : 이수진(Lee Soojin)
3. Description : validation 체크 팝업(validation check popup)
4. Precaution  :
5. History     :
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "NoticeCommonCustom", {
    parentInfo: {},

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.parentInfo = $.extend(this.parentInfo, options.pageOption);
        //ecount.popup.parent.ecount.callback.execute(this.callbackIDparam, this);
    },

    render: function () {
        this._super.render.apply(this);        
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {

        if (this.parentInfo.menuName != null && this.parentInfo.menuName != undefined)
            header.setTitle(this.parentInfo.menuName); 
        else
            header.setTitle(ecount.resource.LBL07973); //알림(Notice)
        
        header.notUsedBookmark();
    },
    
    onInitContents: function (contents) {

        debugger;
        var g = widget.generator,
            toolbar = g.toolbar(),
            toolbar2 = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();

        var titleDate = this.parentInfo.titleDate != null ? this.parentInfo.titleDate : ecount.resource.LBL02502;   //Voucher Date
        var msgTopWarning = this.parentInfo.msgTopWarning != null ? this.parentInfo.msgTopWarning : ecount.resource.MSG06854;  // 그리드 위에 보일 내용
        var msgBottomWarning = this.parentInfo.msgBottomWarning != null ? this.parentInfo.msgBottomWarning : ecount.resource.MSG06855;  // 그리드 아래에 보일 내용
        var titleMsg = this.parentInfo.titleMsg != null ? this.parentInfo.titleMsg : ecount.resource.LBL09629;    //Cause
        var menuName = this.parentInfo.menuName != null ? this.parentInfo.menuName : "";    //Unable to delete
        var titleCus = this.parentInfo.titleCus != null ? this.parentInfo.titleCus : "";
        var leftHtml = this.parentInfo.menuName != null ? "<span style=' font-weight: bold'>[" + menuName + "]</span>" : "";
        var date_width = this.parentInfo.date_width != null ? this.parentInfo.date_width : 130;
        var msg_width = this.parentInfo.msg_width != null ? this.parentInfo.msg_width : 380;

        toolbar.addLeft(ctrl.define("widget.label", "topWarning").label(msgTopWarning).useHTML()).end();
        toolbar2.addLeft(ctrl.define("widget.label", "bottomWarning").label(msgBottomWarning).useHTML()).end();

        var columns = [];
        
        columns = [
                    { propertyName: 'IO_DATE', id: 'IO_DATE', title: titleDate, width: date_width, dataType: 'DATE10' },
                    { propertyName: 'MESSAGE', id: 'MESSAGE', title: titleMsg, width: msg_width }
        ];

        grid            
            .setRowData(this.parentInfo.parentData)
            .setColumns(columns)
            .setKeyColumn(['IO_DATE', 'MESSAGE'])
            .setColumnFixHeader(true)
            .setHeaderTopLeftHTML(leftHtml)
            .setCustomRowCell('MESSAGE', function (value, rowItem, dataTypeConvertor) {
                var option = {};
                option.controlType = 'widget.text.multi';
                option.attrs = {
                    'type': 'vertical'     // 나열형 지정(가로형) - ygh #20
                }
                return option;
            });

        contents.add(toolbar)
                .addGrid("dataGrid", grid)
                .add(toolbar2);

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            closeResource = ecount.resource.BTN00008; // 닫기
        
        if (this.parentInfo.confirmFlag == "Y") {
            toolbar.addLeft(ctrl.define("widget.button", "confirm").label(ecount.resource.BTN00276)); // 확인
            closeResource = ecount.resource.LBL02853; // 취소
        }

        toolbar.addLeft(ctrl.define("widget.button", "close").label(closeResource).css("btn btn-default"));
        
        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {
    },

    //닫기버튼
    onFooterClose: function () {
        if (this.parentInfo.callback) {
            this.parentInfo.callback("CANCEL", function () { this.close()}.bind(this));
            return;
        }
        this.close();
    },

    onFooterConfirm: function () {
        if (this.parentInfo.callback) {
            this.parentInfo.callback("OK", function () { this.close() }.bind(this));
            return;
        }
        this.close();
    },

    onClosedPopupHandler: function (pageID, isClick) {
        if (this.parentInfo.callback) {
            this.parentInfo.callback("CANCEL", function () {  }.bind(this));
            return;
        }
        //this.close();
    },

});