window.__define_resource && __define_resource("LBL12637","BTN00141","LBL01044","LBL03630","LBL08110","LBL03295","LBL12605","LBL02841","LBL08019","LBL07845","LBL00543","LBL00142","LBL01051","LBL01202","LBL01178","LBL10750","LBL05339","BTN00069","BTN00008");
/***********************************************************************************
 1. Create Date : 2017.06.19
 2. Creator     : 신선미
 3. Description : 표시설정
 4. Precaution  :
 5. History     : 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
                  2020.02.12 (On Minh Thien) - A20_00209 - ecRequire 사용하는 로직 registerDependencies로 바꾸기
                  2021.02.08(양미진) - dev 55895 A21_00993 CS > 매출청구서조회에 표시설정기능 제공
 6. MenuPath    : 종이/전자 세금계산서 > 표시설정
 7. Old File    : 
 ***********************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM100P_63", {
    PrintType: ['0', '1', '2'],
    formInfo: null,

    /**********************************************************************
    *  page configuration settings
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.registerDependencies("ecmodule.common.formHelper");
    },

    render: function () {
        this._super.render.apply(this);
    },


    initProperties: function () {
        //debugger
        var thisObj = this;
        this.formInfo = {
            SIGN_PRINT_YN: thisObj.SIGN_PRINT_YN != null ? thisObj.SIGN_PRINT_YN : ecount.config.company.SIGN_PRINT_YN,
            DATE_PRINT_YN: thisObj.DATE_PRINT_YN != null ? thisObj.DATE_PRINT_YN : ecount.config.company.DATE_PRINT_YN,
            SER_NO_PRINT_YN: thisObj.SER_NO_PRINT_YN != null ? thisObj.SER_NO_PRINT_YN : ecount.config.company.SER_NO_PRINT_YN,
            SUPPLIER_PRINT_YN: thisObj.SUPPLIER_PRINT_YN != null ? thisObj.SUPPLIER_PRINT_YN : ecount.config.company.SUPPLIER_PRINT_YN,
            PURCHASER_PRINT_YN: thisObj.PURCHASER_PRINT_YN != null ? thisObj.PURCHASER_PRINT_YN : ecount.config.company.PURCHASER_PRINT_YN,
            SIGN_TYPE: thisObj.SIGN_TYPE != null ? thisObj.SIGN_TYPE : ecount.config.company.SIGN_TYPE,
            SHEET_TF: thisObj.SHEET_TF != null ? thisObj.SHEET_TF : ecount.config.company.SHEET_TF,
            IsTemplateSetup: thisObj.IsTemplateSetup
        }
        if (!thisObj.formInfo.IsTemplateSetup)
            this.PrintType = ['', '', thisObj.formInfo.PURCHASER_PRINT_YN == "1" ? '2' : ''];
        else
            this.PrintType = [thisObj.formInfo.SUPPLIER_PRINT_YN == '1' && thisObj.formInfo.PURCHASER_PRINT_YN == '1' ? '0' : '', thisObj.formInfo.SUPPLIER_PRINT_YN, thisObj.formInfo.PURCHASER_PRINT_YN == "1" ? "2" : ""];

        if (this.isFromCS === true) {
            this.PrintType = "2";
        }
    },

    // Header Initialization
    onInitHeader: function (header) {
        //debugger
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL12637);
    },

    
    // Contents Initialization
    onInitContents: function (contents) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            form = generator.form();

        var thisObj = this;
        toolbar.attach(ctrl.define("widget.button", "restore").label(ecount.resource.BTN00141).css("btn btn-default btn-sm").end());
        contents.add(widget.generator.subTitle().title(ecount.resource.LBL12637))
                .add(toolbar);


        form.add(ctrl.define("widget.radio", "SignPrintYn", "SignPrintYn", ecount.resource.LBL01044)        //도장인쇄
                .label([ecount.resource.LBL03630, ecount.resource.LBL08110]).value([1, 0]).select(thisObj.formInfo.SIGN_PRINT_YN).end())
            .add(ctrl.define("widget.radio", "DatePrintYn", "DatePrintYn", ecount.resource.LBL03295)        //일자인쇄
                    .label([ecount.resource.LBL03630, ecount.resource.LBL08110]).value([1, 0]).select(thisObj.formInfo.DATE_PRINT_YN).end());
        if (thisObj.FORM_SEQ == 0 || thisObj.FORM_SEQ == 1) {
            form.add(ctrl.define("widget.radio", "SerNoPrintYn", "SerNoPrintYn", ecount.resource.LBL12605)      //일련번호
                       .label([ecount.resource.LBL03630, ecount.resource.LBL08110]).value([1, 0]).select(thisObj.formInfo.SER_NO_PRINT_YN).end());
        }
        form.add(ctrl.define("widget.checkbox.whole", "PrintType", "PrintType", ecount.resource.LBL02841)   //인쇄구분
                   .label([ecount.resource.LBL08019, ecount.resource.LBL07845, ecount.resource.LBL00543]).value(['0', '1', '2']).end());
        if (thisObj.FORM_SEQ == 0 || thisObj.FORM_SEQ == 1) {
            form.add(ctrl.define("widget.radio", "SignType", "SignType", ecount.resource.LBL00142)              //청구/영수구분
                    .label([ecount.resource.LBL01051, ecount.resource.LBL01202, ecount.resource.LBL01178]).value(['1', '2', '3']).select(thisObj.formInfo.SIGN_TYPE).end());
        }
        form.add(ctrl.define("widget.checkbox", "SheetTf", "SheetTf", ecount.resource.LBL10750)        //인쇄형태
            .label(ecount.resource.LBL05339).value("1").select(thisObj.formInfo.SHEET_TF).end());
        contents.add(form);
    },
        
    // Footer Initialization
    onInitFooter: function (footer) {
        var tool = widget.generator.toolbar(),
             ctl = widget.generator.control();

        tool.addLeft(ctl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce())
            .addLeft(ctl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(tool);
    },


    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getControl("PrintType").setCheckedValue(this.PrintType);

        if (this.isFromCS === true) {
            this.contents.getControl("PrintType").setReadOnly(true);
        }
    },
        
    // Close button click event
    onFooterClose: function () {
        this.close();
    },

    
    // apply button click event
    onFooterApply: function () {
        //debugger
        var thisObj = this;
        
        var _PRINT_YN = this.contents.getControl("PrintType").getCheckedValue();
        if ((_PRINT_YN.length || []) == 0) {
            this.contents.getControl("PrintType").showError();
            this.contents.getControl("PrintType").setFocus(0);
            this.footer.getControl('apply').setAllowClick();
            return false;
        };
     
        thisObj.formInfo.SIGN_PRINT_YN= thisObj.contents.getControl("SignPrintYn").getValue();
        thisObj.formInfo.DATE_PRINT_YN = thisObj.contents.getControl("DatePrintYn").getValue();
        thisObj.formInfo.SHEET_TF = thisObj.contents.getControl("SheetTf").getValue();
        if (thisObj.FORM_SEQ == 0 || thisObj.FORM_SEQ == 1) {
            thisObj.formInfo.SER_NO_PRINT_YN = thisObj.contents.getControl("SerNoPrintYn").getValue();
            thisObj.formInfo.SIGN_TYPE = thisObj.contents.getControl("SignType").getValue();
        }
        thisObj.formInfo.SUPPLIER_PRINT_YN = _PRINT_YN.contains("1") == true ? 1 : 0;
        thisObj.formInfo.PURCHASER_PRINT_YN = _PRINT_YN.contains("2") == true ? 1 : 0;

          
        var message = {
            formInfo: thisObj.formInfo,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    },

    //기본값복원
    onContentsRestore: function (event) {
        var thisObj = this;
        var setPrintType = [ecount.config.company.SUPPLIER_PRINT_YN == '1' && ecount.config.company.PURCHASER_PRINT_YN == '1' ? '0' : '', ecount.config.company.SUPPLIER_PRINT_YN, ecount.config.company.PURCHASER_PRINT_YN == "1" ? "2" : ""];
        thisObj.contents.getControl("SignPrintYn").setValue(ecount.config.company.SIGN_PRINT_YN);
        thisObj.contents.getControl("DatePrintYn").setValue(ecount.config.company.DATE_PRINT_YN);
        thisObj.contents.getControl("PrintType").setCheckedValue(setPrintType);
        thisObj.contents.getControl("SheetTf").setValue(ecount.config.company.SHEET_TF);
        if (thisObj.FORM_SEQ == 0 || thisObj.FORM_SEQ == 1) {
            thisObj.contents.getControl("SerNoPrintYn").setValue(ecount.config.company.SER_NO_PRINT_YN);
            thisObj.contents.getControl("SignType").setValue(ecount.config.company.SIGN_TYPE);

        }
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    ON_KEY_F8: function () {
        this.onFooterApply();
    }

   /**************************************************************************************************** 
   * define user function 
   ****************************************************************************************************/


});
