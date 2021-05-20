window.__define_resource && __define_resource("LBL03015","LBL03017","LBL02983","LBL02722","LBL04038","LBL02488","LBL01435","LBL01439","BTN00008","LBL03209","LBL93395");
/****************************************************************************************************
1. Create Date : 2016.06.28
2. Creator     : 강성훈
3. Description : 재고 > 판매 입력 > 재고 조회
4. Precaution  :
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES015P", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        
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

    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL03015);
    },

    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            grid = generator.grid();
        var thisObj = this;
        var DEC_Q = ecount.config.inventory.DEC_Q;

        grid
            .setRowData(this.viewBag.InitDatas.DataList)
            .setKeyColumn(["PROD_CD", "PROD_DES"])
            .setColumns([
                    { propertyName: 'PROD_CD', id: 'PROD_CD', title: ecount.resource.LBL03017, width: '', },
                    { propertyName: 'PROD_DES', id: 'PROD_DES', title: ecount.resource.LBL02983, width: '' },
                    { propertyName: 'WH_DES', id: 'WH_DES', title: ecount.resource.LBL02722, width: '', isHideColumn: (this.FLAG == "Y") ? false : true },
                    { propertyName: 'WH_QTY', id: 'WH_QTY', title: ecount.resource.LBL04038, width: '', dataType: '9' + DEC_Q, align: 'right', isCheckZero: true },
                    { propertyName: 'BAL_QTY', id: 'BAL_QTY', title: ecount.resource.LBL02488, width: '', dataType: '9' + DEC_Q, align: 'right', isCheckZero: true },
                    { propertyName: 'WH_QTY_T', id: 'WH_QTY_T', title: ecount.resource.LBL01435, width: '', dataType: '9' + DEC_Q, align: 'right', isCheckZero: true, isHideColumn: (this.LIMIT_QTY_TYPE == "1") ? false : true },
                    { propertyName: 'BAL_QTY_T', id: 'BAL_QTY_T', title: ecount.resource.LBL01439, width: '', dataType: '9' + DEC_Q, align: 'right', isCheckZero: true, isHideColumn: (this.LIMIT_QTY_TYPE == "1") ? false : true },
            ])
            .setCustomRowCell('BAL_QTY', this.setGridDataLink.bind(this))
            .setCustomRowCell('PROD_DES', this.DescSize.bind(this))

        contents.addGrid("dataGrid" + this.pageID, grid);

    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
    },

    onInitControl: function (cid, control) { },

    DescSize: function (value, rowItem) {

        var option = {};

        if ($.isEmpty(rowItem.SIZE_DES)) {
            option.data = rowItem.PROD_DES;
        }
        else {
            option.data = rowItem.PROD_DES + "[<font color='#CC0000'>" + rowItem.SIZE_DES + "</font>]";
        }

        return option;
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) { },

    onLoadComplete: function (event) {

        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
    },

    onPopupHandler: function (control, config, handler) { },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (message) { },

    //onFocusInHandler: function (event) { },

    //onFocusMoveHandler: function (event) { },

    //onFocusOutHandler: function (event) { },


    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    onGridAfterFormLoad: function (e, data, grid) { },

    // 품목코드 클릭 및 링크 설절
    setGridDataLink: function (value, rowItem) {
        var option = {};
        var self = this;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                self.setOpenPopup(data);
                data.event.preventDefault();
            }.bind(self)
        }
        return option;
    },

    setOpenPopup: function (data) {
        var ComCd_Nm = this.viewBag.Com_Code + "/" + ecount.company.COM_DES;
        var RptConfirm = ecount.config.company.RPT_CONFIRM;
        var DateTime = this.viewBag.YMD;
        var strDateY = DateTime.substr(0, 4);
        var strDateM = DateTime.substr(4, 2);
        var strDateD = DateTime.substr(6, 2);
        var PROD_CD = data.rowItem.PROD_CD;
        var PROD_DES = data.rowItem.PROD_DES;

        var strXml = "<root>";
        strXml += "<ddlSYear><![CDATA[" + strDateY + "]]></ddlSYear><ddlSMonth><![CDATA[" + strDateM + "]]></ddlSMonth><txtSDay><![CDATA[" + strDateD + "]]></txtSDay><txtSWhCd><![CDATA[]]></txtSWhCd><txtSWhDes><![CDATA[]]></txtSWhDes><txtItemCd><![CDATA[]]></txtItemCd><txtItemDes><![CDATA[]]></txtItemDes><txtSProdCd><![CDATA[" + PROD_CD + "]]></txtSProdCd><txtSProdDes><![CDATA[" + PROD_DES + "]]></txtSProdDes><hidProdChkDes><![CDATA[]]></hidProdChkDes><txtClassCd><![CDATA[]]></txtClassCd><txtClassDes><![CDATA[==" + ecount.resource.LBL03209 + "1==]]></txtClassDes><txtClassCd2><![CDATA[]]></txtClassCd2><txtClassDes2><![CDATA[==" + ecount.resource.LBL03209 + "2==]]></txtClassDes2><txtClassCd3><![CDATA[]]></txtClassCd3><txtClassDes3><![CDATA[==" + ecount.resource.LBL03209 + "3==]]></txtClassDes3><hidProdChkDes><![CDATA[]]></hidProdChkDes><rbProdChk><![CDATA[]]></rbProdChk><rbSumGubun><![CDATA[2]]></rbSumGubun><cbRptConfirm><![CDATA[" + RptConfirm + "]]></cbRptConfirm><cbBalFlag><![CDATA[1]]></cbBalFlag><cbExcFlag><![CDATA[1]]></cbExcFlag><cbExcProdFlag><![CDATA[]]></cbExcProdFlag><cbDelFlag><![CDATA[1]]></cbDelFlag><ddlSubCode><![CDATA[" + ComCd_Nm + "]]></ddlSubCode><hidLastField1><![CDATA[]]></hidLastField1><txtTreeGroupCd><![CDATA[]]></txtTreeGroupCd><txtTreeGroupNm><![CDATA[]]></txtTreeGroupNm><cbSubTree><![CDATA[]]></cbSubTree><txtTreeWhCd><![CDATA[]]></txtTreeWhCd><txtTreeWhNm><![CDATA[]]></txtTreeWhNm><cbSubTreeWh><![CDATA[]]></cbSubTreeWh><hidLastField2><![CDATA[]]></hidLastField2><hidSearchXml2><![CDATA[]]></hidSearchXml2><hidFmType><![CDATA[]]></hidFmType><hidGubun><![CDATA[]]></hidGubun><hidAFlag><![CDATA[]]></hidAFlag><strListType><![CDATA[]]></strListType><strListFlag><![CDATA[]]></strListFlag><strSort><![CDATA[]]></strSort><strSearchCode><![CDATA[]]></strSearchCode><strSortAd><![CDATA[]]></strSortAd><hidPFlag><![CDATA[T]]></hidPFlag><hidSaleGubun><![CDATA[]]></hidSaleGubun><hidPrev><![CDATA[]]></hidPrev><hidTabGubun><![CDATA[1]]></hidTabGubun><hidTabFirsts><![CDATA[]]></hidTabFirsts><M_RptGubun><![CDATA[54]]></M_RptGubun><M_FormGubun><![CDATA[SM621]]></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_FocusX><![CDATA[0]]></M_FocusX><M_FocusY><![CDATA[0]]></M_FocusY><M_Date></M_Date><M_No><![CDATA[0]]></M_No><M_SerNo><![CDATA[1]]></M_SerNo><M_Type><![CDATA[]]></M_Type><M_TrxSer></M_TrxSer><M_TrxDate></M_TrxDate><M_TrxNo><![CDATA[0]]></M_TrxNo><M_Pgm><![CDATA[/ECMain/ESZ/ESZ002R.aspx]]></M_Pgm><M_Page><![CDATA[1]]></M_Page><M_EdmsFlag><![CDATA[N]]></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag></M_FirstFlag><M_FirstFlag2><![CDATA[1]]></M_FirstFlag2><M_PFlag><![CDATA[]]></M_PFlag><M_BtnFlag></M_BtnFlag>";
        strXml += "</root>";

        var paramData = {
            width: 800,
            height: 600,
            searchMode : "Y",
            isShowSearchForm: "2",
            isOpenPopup: true,
            BASE_DATE: this.viewBag.YMD,
            PROD_CD: data.rowItem.PROD_CD,
            PROD_DES: data.rowItem.PROD_DES,
            SUM_FLAG: "2",
        };

        this.openWindow({
            url: "/ECERP/ESZ/ESZ018R",
            name: ecount.resource.LBL93395,
            param:  paramData,
            popupType: false,
            additional: false      
        });




    },

    onFooterClose: function () {
        this.close();
    }


    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

});