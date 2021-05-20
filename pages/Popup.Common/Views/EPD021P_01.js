window.__define_resource && __define_resource("LBL02435");
/****************************************************************************************************
1. Create Date : 2017.03.26
2. Creator     : Vu Thien
3. Description : Quotation print slip
4. Precaution  : ecount.page.slipInventoryBasicForm.js 상속받아서 사용합니다.
                 특이성있는 기능은 해당페이지에서 작업하시고, 공통적인 기능은 위의 js에 구현되어있습니다.
5. History     : 2017.06.13 (이현우) - 거래관리시스템 확인/취소요청/검토요청 작업
                 [2018.10.05] (Ngo Thanh Lam): Remove old button by job A18_02948_old 버튼 정리 및 제거.
                 2020.01.07 (On Minh Thien) - A19_04630 - ecmodule 경로 변경 후속처리 요청
                 2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
6. Old File    : EPD021P_01.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.slipInventoryBasicForm", "EPD021P_01", {
    pageID: "EPD021P_01",
    header: null,
    contents: null,
    footer: null,

    /**************************************************************************************************** 
     *START
    * Contents/js/widget_base/page/slip/ecount.page.slipInventoryBasicForm.js
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.registerDependencies("ecmodule.inventory.guides");
    },

    render: function ($parent) {
        this.ParentPageID = this.pageID;
        this.setInit();

        this._super.render.apply(this, arguments);
    },

    onInitContents: function (contents, resource) {
        this._super.onInitContents.apply(this, arguments);
    },

    onInitFooter: function (footer, resource) {
        this._super.onInitFooter.apply(this, arguments);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) { },

    onMessageHandler: function (event, data) {
        switch (event.controlID) {
            default:
                this._super.onMessageHandler.apply(this, arguments);
                break;
        }
    },

    //양식종류 변경시
    onChangeControl: function (control, data) {
        this.changeFormList(control);
    },

    // 양식 팝업
    onFooterYangsic: function (e) {
        this.formSetup(e);
    },

    // 페이징 처리
    onFooterPaging: function (event) {
        this.paging(event);
    },

    // 인쇄
    onFooterPrint: function (e) {
        debugger
        this.pagePrint(e);
    },

    // 용지설정후 인쇄
    onFooterPrintSetup: function (e) {
        this.printSetup(e);
    },

    // PDF
    onButtonPdf: function (e) {
        this.convertPdf(e);
    },

    // 바코드인쇄
    onFooterBarcodePrint: function (e) {
        this.barcodePrint(e);
    },

    // Excel
    onFooterExcel: function (e) {
        this.convertExcel(e);
    },

    // Email
    onFooterEmail: function (e) {
        this.sendEmail(e);
    },

    // Fax
    onButtonFax: function (e) {
        this.sendFax(e);
    },

    //CS - 확인
    onFooterCsconfirm: function (e) {
        this.csConfirmStatusChange(e, "2");
    },

    //CS - 확인취소요청
    onFooterCsconfirmcancel: function (e) {
        this.csConfirmStatusChange(e, "4");
    },

    //CS - 검토요청
    onFooterCsdeny: function (e) {
        this.csConfirmStatusChange(e, "3");
    },

    //전표화면 닫힐때 인쇄시 생성된 iframe 일괄 삭제를 위해서 추가
    onClosedPopupHandler: function (page, target) {
        this.removeIframe(page, target);
    },



    /**************************************************************************************************** 
    * Contents/js/widget_base/page/slip/ecount.page.slipInventoryBasicForm.js
    * END
    ****************************************************************************************************/

    /********************************************************************** 
    * user setting start
    **********************************************************************/
    //메뉴별 기능제공여부 설정 (거래관리시스템, 양식타입이 상단만인 경우, 해외코드등에 대한 기능제한은 공통js에서 처리해줍니다.)
    setInit: function () {
        var setPageOption = this.pageOption;

        setPageOption.isViewEmailButton = false;         //Email 
        setPageOption.isViewFaxButton = false;           //FAX
        setPageOption.isViewPdfButton = true;            //PDF
        setPageOption.isViewBarcodePrintButton = false;  //바코드인쇄
        setPageOption.isViewExcelButton = false;         //EXCEL
        setPageOption.isViewPrintSetupButton = true;    //용지설정

        setPageOption.isViewPagingButton = true;        //Paging
        setPageOption.isViewGridTypeUsePaging = true;   //그리드에서 페이지별로 보여줄지 여부(true:페이지별, false:페이지없이 전부)

        setPageOption.isMinusRowHeight = false,          //*행높이설정 : 신규에서는 [양식설정 줄높이px - 1px]값으로 적용됨(그리드에서 계산)
        //만약 구프레임워크에서 -1px이 적용되지 않고, 설정값 그대로 적용되었다면 false로 설정 (개발자도구로 확인 필요)
            
        setPageOption.isViewPageNumber = false;          //그리드에서 제공하는 페이지번호 사용여부 (입력코드표로 변경해야함)
        setPageOption.isViewYangPrintButton = false;
        //chu y phan nay kiem tra ben CS
        setPageOption.isViewCsConfirmButton = false;             //*거래관리시스템(CS) - 확인버튼 (구CS에서 제공하지 않아도 신규에서는 모두 제공하기로 했음)
        setPageOption.isViewCsConfirmCancelButton = false;       //*거래관리시스템(CS) - 확인취소요청 (구CS에서 제공하지 않아도 신규에서는 모두 제공하기로 했음)
        setPageOption.isViewCsDeny = false;                      //*거래관리시스템(CS) - 검토요청 (구CS에서 제공하지 않아도 신규에서는 모두 제공하기로 했음)

        setPageOption.thisPageUniqueValue = "EPD021P_01";          //해당파일 구분값 (used in convertPdf, onMessageHandler, pagePrint)
        setPageOption.thisPageFileUrl = "/ECERP/Popup.Common/EPD021P_01";   //해당파일 url (used in changeFormData, reload)
        setPageOption.thisPageName = ecount.resource.LBL02435;  //해당파일 메뉴명(used in onInitHeader, savePrintHitCount)

        //MainGrid ColName Setting
        //setPageOption.mainGridColName_QtyUnit = "sale021.qty_unit";          //Template Setup - col_cd of Qty.(Include Unit)
        //setPageOption.mainGridColName_Serial = "sale021.serial";             //Template Setup - col_cd of Sequence
        //setPageOption.mainGridColName_ProdCdBythisMenu = "sale021.prod_cd";  //Template Setup - col_cd of ItemCode(SaleSlip)

        //setPageOption.mainGridColName_ProdCdBythisProd = "sale003.prod_cd"; //Template Setup - col_cd of ItemCode(Prod)
        //setPageOption.mainGridColName_Barcode = "sale003.bar_code";         //Template Setup - col_cd of Barcode(prod)
        //setPageOption.mainGridColName_ProdImg = "sale003_img.prod_img";     //Template Setup - col_cd of ProdImage

        //notok kiem tra ky phan nay sale order list khong co
        //DetailGrid ColName Setting (상세품목 사용하는 경우에만 추가)
        //if (this.pageFormInfo.formInfo.option.detailBodyYn == "Y") {
        //    setPageOption.detailGridColName_ProdCdBythisMenu = "subprod.prod_cd";                               //Sub-Item Template Setup - col_cd of ItemCode(Item Details)
        //    setPageOption.detailGridColName_ProdCdBythisProd = setPageOption.mainGridColName_ProdCdBythisProd;  //Sub-Item Template Setup - col_cd of ItemCode(Prod)
        //    setPageOption.detailGridColName_Barcode = setPageOption.mainGridColName_Barcode;                    //Sub-Item Template Setup - col_cd of Barcode(Prod)
        //}

        //Excel Convert Api Url (used in convertExcel)
        //if (setPageOption.isViewExcelButton) {
        //    //notok viet ham xuat excel
        //    setPageOption.excelApiUrl = "/Inventory/Quotation/GetListQuoSlipPrintForExcel";  //api는 메뉴별 생성 필요
        //    setPageOption.excelTitle = setPageOption.thisPageName;
        //}

        //SendFax parameter Setting (Fax발송 기능이 있는 경우에만 추가)
        //if (setPageOption.isViewFaxButton) {
        //    setPageOption.faxDocId = "3∬NF";   //발송이력 저장,css세팅시 필요한 구분값 (구프레임워크에서 사용하는 DocId∬신규구분여부)
        //    setPageOption.faxDocType = "22";    //견적서:22, 주문서:23, 발주서:33, 청구서:44, 거래명세서:66, 거래처관리대장1:88, 거래처관리대장2:89, AS 접수증:92
        //    //setPageOption.faxApiUrl = "/ECMain/ECount.Common/Send/Fax.aspx";    //Fax Send Api Url (by Old Framework)
        //}

        setPageOption.SlipCd = "4160";
    },

});

