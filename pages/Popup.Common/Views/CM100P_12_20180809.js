window.__define_resource && __define_resource("LBL13013","LBL03312","LBL02473","LBL03194","LBL07995","LBL02466","LBL07997","LBL07998","LBL07999","MSG03551","MSG01809","MSG05689","BTN00069","BTN00033","BTN00008");
/****************************************************************************************************
1. Create Date : 2015.10.26
2. Creator     : Le Dan
3. Description : Set balance for top section
4. Precaution  :
5. History     : [2017.11.02] [Duyet] Change title
6. Old File    : CM100P_12.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_12", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    bySlip_Beginning: false,
    bySlip_Ending: false,

    byDate_Beginning: false,
    byDate_Sales: false,
    byDate_Receipt: false,
    byDate_Balance: false,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark().setTitle(ecount.resource.LBL13013);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var ge = widget.generator,
            toolbar = ge.toolbar(),
            form = ge.form(),
            ctrl=ge.control(),
            ctrl1 = ge.control(),
            ctrl2 = ge.control(),
            controls = new Array();

        controls.push(ctrl.define("widget.link", "bySlip1", "bySlip1", ecount.resource.LBL03312).label(ecount.resource.LBL02473).end());
        controls.push(ctrl.define("widget.link", "bySlip2", "bySlip2").label(ecount.resource.LBL03194).end());
        if (this.FORM_TYPE != 'SU210') {
            controls.push(ctrl.define("widget.link", "byDate1_1", "byDate1_1", ecount.resource.LBL07995).label(ecount.resource.LBL02466).end());
            controls.push(ctrl.define("widget.link", "byDate1_2", "byDate1_2").label(ecount.resource.LBL07997).end());
            controls.push(ctrl.define("widget.link", "byDate2_1", "byDate2_1").label(ecount.resource.LBL07998).end());
            controls.push(ctrl.define("widget.link", "byDate2_2", "byDate2_2").label(ecount.resource.LBL07999).end());
        }

        form.css("table table-border-no-a table-border-no-v")
            .colgroup([{ width: 120 }, { width: 200 }, { width: 0 }])
            .useBaseForm({ _isThShow: 1 })
            .setColSize(2)
            .addControls(controls)
            .rowspan(2, 1);
        
        toolbar.attach(ctrl1.define('widget.input', 'description', 'Description').readOnly());

        if (this.FORM_TYPE != 'SU210') {
            contents.add(ge.remark().title(ecount.resource.MSG03551))
        }

        contents
                .add(ge.subTitle().title(ecount.resource.MSG01809))
                .add(form)
                .add(ge.subTitle().title(ecount.resource.MSG05689))
                .add(toolbar);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069))
                .addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033))
                .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },
    
    /**********************************************************************
    * define common event listener
    **********************************************************************/

    // After the document loaded
    onLoadComplete: function () {
        var balanceType = this.BALANCE_TYPE;

        //전잔 1, 3
        this.bySlip_Beginning = ['1', '3'].contains(balanceType);

        //후잔 2, 3
        this.bySlip_Ending = ['2', '3'].contains(balanceType);

        //전일잔액 4,8,9,10,14,15,16,18
        this.byDate_Beginning = ['4', '8', '9', '10', '14', '15', '16', '18'].contains(balanceType);

        //금일(기간)판매 5, 8, 11, 12, 14, 16, 17, 18
        this.byDate_Sales = ['5', '8', '11', '12', '14', '16', '17', '18'].contains(balanceType);

        //금일(기간)수금 6, 9, 11, 13, 14, 15, 17, 18
        this.byDate_Receipt = ['6', '9', '11', '13', '14', '15', '17', '18'].contains(balanceType);

        //금일(기간)잔액 7, 10, 12, 13, 15, 16, 17, 18
        this.byDate_Balance = ['7', '10', '12', '13', '15', '16', '17', '18'].contains(balanceType);

        this.setDescription();
    },
    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    onFooterApply: function () {

        var balanceType = '0';

        if (this.bySlip_Beginning == true && this.bySlip_Ending == false)//* 1-전잔
            balanceType = '1';
        else if (this.bySlip_Beginning == false && this.bySlip_Ending == true)//* 2-후잔
            balanceType = '2';
        else if (this.bySlip_Beginning == true && this.bySlip_Ending == true)//* 3-전잔   후잔
            balanceType = '3';
        else if (this.byDate_Beginning == true && this.byDate_Sales == false && this.byDate_Receipt == false && this.byDate_Balance == false)//* 4-전일잔액
            balanceType = "4";
        else if (this.byDate_Beginning == false && this.byDate_Sales == true && this.byDate_Receipt == false && this.byDate_Balance == false)//* 5-금일(기간)판매
            balanceType = "5";
        else if (this.byDate_Beginning == false && this.byDate_Sales == false && this.byDate_Receipt == true && this.byDate_Balance == false)//* 6-금일(기간)수금
            balanceType = "6";
        else if (this.byDate_Beginning == false && this.byDate_Sales == false && this.byDate_Receipt == false && this.byDate_Balance == true)//* 7-금일(기간)잔액
            balanceType = "7";
        else if (this.byDate_Beginning == true && this.byDate_Sales == true && this.byDate_Receipt == false && this.byDate_Balance == false)//* 8-전일잔액        금일(기간)판매
            balanceType = "8";
        else if (this.byDate_Beginning == true && this.byDate_Sales == false && this.byDate_Receipt == true && this.byDate_Balance == false)//* 9-전일잔액        금일(기간)수금
            balanceType = "9";
        else if (this.byDate_Beginning == true && this.byDate_Sales == false && this.byDate_Receipt == false && this.byDate_Balance == true)//* 10-전일잔액       금일(기간)잔액
            balanceType = "10";
        else if (this.byDate_Beginning == false && this.byDate_Sales == true && this.byDate_Receipt == true && this.byDate_Balance == false)//* 11-금일(기간)판매 금일(기간)수금
            balanceType = "11";
        else if (this.byDate_Beginning == false && this.byDate_Sales == true && this.byDate_Receipt == false && this.byDate_Balance == true)//* 12-금일(기간)판매 금일(기간)잔액
            balanceType = "12";
        else if (this.byDate_Beginning == false && this.byDate_Sales == false && this.byDate_Receipt == true && this.byDate_Balance == true)//* 13-금일(기간)수금 금일(기간)잔액
            balanceType = "13";
        else if (this.byDate_Beginning == true && this.byDate_Sales == true && this.byDate_Receipt == true && this.byDate_Balance == false) //* 14-전일잔액       금일(기간)판매      금일(기간)수금
            balanceType = "14";
        else if (this.byDate_Beginning == true && this.byDate_Sales == false && this.byDate_Receipt == true && this.byDate_Balance == true) //* 15-전일잔액       금일(기간)수금      금일(기간)잔액
            balanceType = "15";
        else if (this.byDate_Beginning == true && this.byDate_Sales == true && this.byDate_Receipt == false && this.byDate_Balance == true) //* 16-전일잔액       금일(기간)판매      금일(기간)잔액
            balanceType = "16";
        else if (this.byDate_Beginning == false && this.byDate_Sales == true && this.byDate_Receipt == true && this.byDate_Balance == true) //* 17-금일(기간)판매 금일(기간)수금      금일(기간)잔액
            balanceType = "17";
        else if (this.byDate_Beginning == true && this.byDate_Sales == true && this.byDate_Receipt == true && this.byDate_Balance == true)  //* 18-전일잔액        금일(기간)판매      금일(기간)수금    금일(기간)잔액
            balanceType = "18";

        this.sendMessage(this, { BALANCE_TYPE: balanceType, INDEX: this.INDEX, callback: this.close.bind(this) });
    },

    onFooterDelete: function () {
        //this.sendMessage(this, { BALANCE_TYPE: '0', callback: this.close.bind(this) });
        this.bySlip_Beginning = false;
        this.bySlip_Ending = false;

        this.byDate_Beginning = false;
        this.byDate_Sales = false;
        this.byDate_Receipt = false;
        this.byDate_Balance = false;
        this.setDescription();
    },

    //Close button click event
    onFooterClose: function () {
        this.close();
    },

    onContentsBySlip1: function () {
        this.bySlip_Beginning = !this.bySlip_Beginning;
        this.byDate_Beginning = this.byDate_Sales = this.byDate_Receipt = this.byDate_Balance = false;
        this.setDescription();
    },

    onContentsBySlip2: function () {
        this.bySlip_Ending = !this.bySlip_Ending;
        this.byDate_Beginning = this.byDate_Sales = this.byDate_Receipt = this.byDate_Balance = false;
        this.setDescription();
    },

    onContentsByDate1_1: function () {
        this.byDate_Beginning = !this.byDate_Beginning;
        this.bySlip_Beginning = this.bySlip_Ending = false;
        this.setDescription();
    },

    onContentsByDate1_2: function () {
        this.byDate_Sales = !this.byDate_Sales;
        this.bySlip_Beginning = this.bySlip_Ending = false;
        this.setDescription();
    },

    onContentsByDate2_1: function () {
        this.byDate_Receipt = !this.byDate_Receipt;
        this.bySlip_Beginning = this.bySlip_Ending = false;
        this.setDescription();
    },

    onContentsByDate2_2: function () {
        this.byDate_Balance = !this.byDate_Balance;
        this.bySlip_Beginning = this.bySlip_Ending = false;
        this.setDescription();
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterApply();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/

    setDescription: function () {
        var sDes = '';
        if (this.bySlip_Beginning)
            sDes += String.format('{0}: ({0}) / ', ecount.resource.LBL02473);
        if (this.bySlip_Ending)
            sDes += String.format('{0}: ({0}) / ', ecount.resource.LBL03194);

        if (this.byDate_Beginning)
            sDes += String.format('{0}: ({0}) / ', ecount.resource.LBL02466);
        if (this.byDate_Sales)
            sDes += String.format('{0}: ({0}) / ', ecount.resource.LBL07997);
        if (this.byDate_Receipt)
            sDes += String.format('{0}: ({0}) / ', ecount.resource.LBL07998);
        if (this.byDate_Balance)
            sDes += String.format('{0}: ({0}) / ', ecount.resource.LBL07999);

        this.contents.getControl('description').setValue('');
        sDes = sDes.trim();
        if (sDes != '') {
            sDes = sDes.substring(0, sDes.length - 2);
            this.contents.getControl('description').setValue(sDes);
        }
    }
});