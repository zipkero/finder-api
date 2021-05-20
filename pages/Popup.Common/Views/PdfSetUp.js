window.__define_resource && __define_resource("LBL06400","LBL09985","LBL12660","LBL03576","LBL10560","LBL03577","LBL09986","LBL07711","LBL07586","LBL09988","LBL09989","LBL09990","LBL09991","BTN00545","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.10.19
2. Creator     : 배소영
3. Description : PDF Page Setup
4. Precaution  : 
5. History     :   2019.04.08[LuongAnhDuy] Dev Progress A19_01182 - 인보이스 영문 메일발송시 PDF 리소스 한글로 표기되는 현상
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "PdfSetUp", {
    isOld: null,            //[2017.09.25 pdf old html연결하기 위함]
    off_key_esc: true,
    pageSetup: null,
    resource: null,
    //초기화
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        //this.pageSetup 여기서 설정해주나, onInitContents 쪽에서 초기화 해주나 상관없음.
        this.resource = this.viewBag.DefaultOption.resource;
    },
    //렌더
    render: function () {
        this._super.render.apply(this);
    },

    //헤더 설정
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(this.resource.LBL06400);  //paget setting
    },
    
    //컨텐츠 설정
    onInitContents: function (contents) {
        //위젯 인스턴스 생성
        var g = widget.generator,
            ctrl = g.control(),
            form = g.form();
        this.pageSetup = JSON.parse(this.pageSet);

        if (this.pageSetup.printUseTf == "1") {
            //this.pageSetup.printWay = ecount.config.companyForm.PRINT_WAY;
            //this.pageSetup.printAlign = ecount.config.companyForm.PRINT_HALIGN == "left" ? "L" : ecount.config.companyForm.PRINT_HALIGN == "right" ? "R" : "C";
            //this.pageSetup.sizeType = ecount.config.companyForm.SIZE_TYPE;
            this.pageSetup.topMargin = ecount.config.companyForm.T_MARGIN;
            this.pageSetup.bottomMargin = ecount.config.companyForm.B_MARGIN;
            this.pageSetup.leftMargin = ecount.config.companyForm.L_MARGIN;
            this.pageSetup.rightMargin = ecount.config.companyForm.R_MARGIN;
        }
        if (this.pageSetup.printWay == "L")        // 가로 
        {
            this.pageSetup.printWay = true;
        }
        if (this.pageSetup.printWay == "P")        // 세로 
        {
            this.pageSetup.printWay = false;
        }

        //수신문서 확인 시, 본래 언어와 다른 언어 양식으로 문서를 열었을 때 pdf변환 팝업이 다른 언어 양식을 따르지 않아 viewBag에 언어 담아 처리

        form.template("register")
            .add(ctrl.define("widget.select", "PAPER_SIZE", "PAPER_SIZE", this.resource.LBL09985)       // 용지종류                    
                    .option([
                        ["A3", "A3"],
                        ["A4", "A4"],
                        ["A4_SMALL", "A4Small"],
                        ["A5", "A5"],
                        ["LETTER", "Letter"],
                        ["LETTER_SMALL", "Lettersmall"],
                        ["LEGAL", "Legal"],
                        ["B4", "JIS B4"],
                        ["ISO_B4", "ISO B4"]
                    ])
                    .select(this.pageSetup.paperSize.toUpperCase())
                    .end()
                );
        if (this.pageSetup.printAlign != null) {
            form.add(ctrl.define("widget.radio", "PRINT_ALIGN", "PRINT_ALIGN", this.resource.LBL12660).label([
                this.resource.LBL03576 //왼쪽  
                , this.resource.LBL10560  //가운데
                , this.resource.LBL03577 //오른쪽
            ]).value(["L", "C", "R"]).select(this.pageSetup.printAlign || "C").end());
        }

        form.add(ctrl.define("widget.radio", "PRINT_WAY", "PRINT_WAY", this.resource.LBL09986)       // 인쇄방향                    
            .label([this.resource.LBL07711, this.resource.LBL07586]).value([false, true]).select(this.pageSetup.printWay).end()   //false:세로 true:가로
                )

            .add(ctrl.define("widget.input", "T_MARGIN", "T_MARGIN", this.resource.LBL09988)       // 상단여백
                    .numericOnly(8, 2)
                    .value(this.pageSetup.topMargin)
                    .end()
                )
        
            .add(ctrl.define("widget.input", "B_MARGIN", "B_MARGIN", this.resource.LBL09989)          // 하단여백
                    .numericOnly(8, 2)
                    .value(this.pageSetup.bottomMargin).end()
                )

            .add(ctrl.define("widget.input", "L_MARGIN", "L_MARGIN", this.resource.LBL09990)          // 왼쪽여백
                    .numericOnly(8, 2)
                    .value(this.pageSetup.leftMargin).end()
                )

            .add(ctrl.define("widget.input", "R_MARGIN", "R_MARGIN", this.resource.LBL09991)          // 오른쪽여백
                    .numericOnly(8, 2)
                    .value(this.pageSetup.rightMargin).end()
                )           
        ;
        contents.add(form);
    },


    //하단 옵션 설정
    onInitFooter: function (footer, resource) {
        //위젯 인스턴스 생성
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        // apply
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(this.resource.BTN00545));
        //닫기 위젯 추가
        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));
        // apply
        toolbar.addLeft(ctrl.define("widget.button", "test").label("Old html").hide());
        //툴바 추가
        footer.add(toolbar);
    },
    //로드완료시
    onLoadComplete: function () {
        //하단 버튼 위치조정
        if (ecount.common.isIOS) {
            this.contents.getControl("T_MARGIN").setFocus(0);
        }
    },
    // 
    onFooterApply: function (e) {
        this.isOld = false;
        this.sendMessage(this, this.createPdfMessageHandler.bind(this));
    },
    // 
    onFooterTest: function (e) {
        this.isOld = true;
        this.sendMessage(this, this.createPdfMessageHandler.bind(this));
    },

    //닫기 이벤트
    onFooterClose: function () {
        this.close();
        return false;
    },

    createPdfMessageHandler: function (option) {
        var paperSize = this.contents.getControl("PAPER_SIZE").getSelectedItem().value;
        var marginLeft = this.contents.getControl("L_MARGIN").getValue();
        var marginRight = this.contents.getControl("R_MARGIN").getValue();
        var marginTop = this.contents.getControl("T_MARGIN").getValue();
        var marginBottom = this.contents.getControl("B_MARGIN").getValue();
        var landScape = this.contents.getControl("PRINT_WAY").getValue().toLowerCase() == "true" ? true : false;
        
        if (option.htmlContent.indexOf("wrapper-print-right") > -1) {
            option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print wrapper-print-right\"", "class=\"wrapper-print\"");
        } else if (option.htmlContent.indexOf("wrapper-print-left") > -1) {
            option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print wrapper-print-left\"", "class=\"wrapper-print\"");
        } else if (option.htmlContent.indexOf("wrapper-print-centered") > -1) {
            option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print wrapper-print-centered\"", "class=\"wrapper-print\"");
        }

        //정렬
        if (this.pageSetup.printAlign != null) {
            var printAlign = this.contents.getControl("PRINT_ALIGN").getValue();
            if (printAlign == "R") {
                option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-right\"");
                option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print \"", "class=\"wrapper-print wrapper-print-right\"");
            } else if (printAlign == "L") {
                option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-left\"");
                option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print \"", "class=\"wrapper-print wrapper-print-left\"");
            } else if (printAlign == "C") {
                option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print\"", "class=\"wrapper-print wrapper-print-centered\"");
                option.htmlContent = option.htmlContent.replaceAll("class=\"wrapper-print \"", "class=\"wrapper-print wrapper-print-centered\"");
            }
        }

        //로딩바 출력
        this.showProgressbar();

        //pdf 변환
        ecount.document.convertPdf(this.fdfDownload.bind(this), $.extend({
            PaperSize: paperSize,
            MarginLeft: landScape ? marginTop : marginLeft,
            MarginRight: landScape ? marginBottom : marginRight,
            MarginTop: landScape ? marginLeft : marginTop,
            MarginBottom: landScape ? marginRight : marginBottom,
            Landscape: landScape,
            PrintAlign: printAlign,
            ReduceYn: this.pageSetup.reduceYn,
            UseMargins: true,
            IsCompress: true,
            IsPermanence: false,
            LifeTimeString: ecenum.tempfileLifetime.oneHour,
            OwnerKey: "",
            IsAutoIncrement: false,
            FileName: "",
            errorCallback: this.hideProgressbarPdf.bind(this),
            CheckPermissionRequest: this.CheckPermissionRequest
        }, option), "", true, false, this.isOld);
    },

    fdfDownload: function () {
        var blnReturn = true;
        if (arguments.length == 1 && (typeof arguments[arguments.length - 1] === 'boolean')) {
            blnReturn = arguments[0];
        }

        if (blnReturn) {
            ecount.document.downloadPdf(arguments[0], this.closePdf.bind(this));
        } else {
            this.closePdf();
        }
    },


    closePdf: function () {
        var self = this;
        this.setTimeout(function () {
            self.hideProgressbar();
            self.close();
        }, 1000);
    },

    hideProgressbarPdf: function () {
        var self = this;
        this.setTimeout(function () {
            self.hideProgressbar();
           // self.close();
        }, 1000);
    }
});
