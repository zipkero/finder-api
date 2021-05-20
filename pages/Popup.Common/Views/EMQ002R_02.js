window.__define_resource && __define_resource("LBL04872","BTN00054","BTN00153","BTN00008");
/****************************************************************************************************
1. Create Date : 2018.07.13
2. Creator     : 노지혜
3. Description : 고객센터 > 세금계산서 출력 > 청구서
4. Precaution  :
5. History     : 2018.09.12 노지혜- PDF 정렬추가
6. Old File    : EMQ002R_02.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EMQ002R_02", {

   
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        ecount.config = {};
        ecount.config.user = {};
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
        
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(resource.LBL04872); 

    },


    // Contents Initialization
    onInitContents: function (contents) {
   
    },
    
    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button.group", "print").label(ecount.resource.BTN00054).addGroup([{ id: "pdf", label: ecount.resource.BTN00153 }]));
        toolbar.addLeft(ctrl.define("widget.button", "Close").css("btn btn-default").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        
    },
    
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    // Sorting function
    onColumnSortClick: function (e, data) {
        
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    //Close button click event
    onFooterClose: function () {
        this.close();
        return false;
    },

    onFooterPrint: function (e) {
        this.printHtml = this.contents.$el[0].innerHTML;
        var option = {
            printCss: ""            
        }
        this.EXPORT_PRINT_NEW(option);

    },
    onButtonPdf: function (e) {
        this.printPageSet = {
            printAlign: "C",
            reduceYn: "N"
        };   

        var option = {
            keywords: "EMQ002R_02",
            gridWidth: this._contentSize,
            pageSetup: this.printPageSet
        };
        this.pdfHtml = this.contents.$el[0].innerHTML;
        this.EXPORT_PDF(option);
           
    },

    onMessageHandler: function (page, callback) {
        switch (page.pageID) {
            case "PdfSetUp":
                var option = {
                    gridWidth: 650,
                    htmlContent: this.pdfHtml,
                    author: 'ECOUNT',
                    keywords: 'EMQ002R_02',
                    subject: 'EMQ002R_02',
                    title: 'EMQ002R_02',
                    templateName: 'PdfBasic'
                };
                callback(option);
                break;
            case "PrintPage":
                var option = {
                    gridWidth: 908,
                    htmlContent: this.printHtml,
                    printCss: ""
                }
                callback(option);
                break;           
        }
    },
    
    /**********************************************************************
    * define user function
    **********************************************************************/
    setParentColumn: function (value, rowItem) {
       
    }
});