window.__define_resource && __define_resource("LBL11147","LBL05870","LBL05101","BTN85017","LBL09913","BTN00065","BTN00008","LBL04366","LBL06083","LBL93573","LBL93574","LBL05087","LBL93309","LBL93326","LBL93312","LBL07386","LBL90008","LBL05319","LBL04321","LBL05040","LBL13036","LBL93226","LBL02916","LBL06370","LBL06373","LBL06374","LBL14260","LBL02037","LBL07460","LBL10337","LBL00274","LBL12268","LBL02283","LBL04936","LBL12480","LBL00692","LBL93362","LBL02728","LBL93320","LBL10942","LBL04030","LBL01489","LBL09840","LBL90113","LBL04937","LBL02939","LBL02963","LBL00433","LBL35299","LBL04785","LBL16316");
/****************************************************************************************************
1. Create Date : 2016.05.13
2. Creator     : 이정민
3. Description : 회신메일발송여부설정
4. Precaution  :
5. History     : 2017.05.04(Hao) - Add dogunun 34 purchase
                 2017.05.10(Bao) - Add doc gubun 38 location trans
                 2017.05.23(Hao) - Add dogunun 30 purchase request
                 2017.08.04(Hao) - Add dogunun 28 Release Sales Order
                 2019.10.07(HEUNGSAN) - ADD DOC GUBUN 78 GENERAL CERTIFICATE 
                 2019.11.07(한재국) - ADD DOC GUBUN 29 (DEPOSITSLIP)
                 2020.02.07 (JINHO JANG) - ADD DOCTYPE 19 (PAYMENTSTATEMENT2)
                 2020.02.17 (이현택) - ADD DOC GUBUN 20 (일용근로소득지급명세서(원천징수영수증))
****************************************************************************************************/

ecount.page.factory('ecount.page.popup.type2', 'ES300P_02', {

    /*******************************************DEC_AMT********************************************************* 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    RMList: null, //회신메일발송여부 리스트

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

    },

    initProperties: function () {
        this.RMList = this.viewBag.InitDatas.RMList;
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL11147);
    },

    onInitContents: function (contents, resource) {
        var g = widget.generator,
            grid = g.grid(),
            self = this;

        grid
            .setRowData(this.setGridData())
            .setColumns([
                { propertyName: 'DOC_NAME', id: 'DOC_NAME', title: ecount.resource.LBL05870, width: 220, align: "left", controlType: 'widget.label' }, //서식명 LBL05870                
                {
                    propertyName: 'HEAD_YN', id: 'HEAD_YN', title: ecount.resource.LBL05101, width: 120, align: "left", controlType: 'widget.checkbox'
                    , columnOption: {
                        'event': {
                            'click': function (e, data) {
                                //발송여부 체크박시 클릭시 전체 발송여부 변경
                                var gridObj = self.contents.getGrid().grid;
                                var isHeaderChecked = gridObj.isCheckedCustomHeader('HEAD_YN');

                                $.each(gridObj.getRowList(), function () {
                                    var rowKey = this[ecount.grid.constValue.keyColumnPropertyName];
                                    gridObj.setCell('HEAD_YN', rowKey, isHeaderChecked === true ? 'Y' : 'N');
                                });
                            }
                        }
                    }
                }
                //발송여부 LBL05101
            ])
            .setEventCustomCheckBoxCheckAllDeterminer(function (data) {
                return false;
            })

            .setEditable(true, 0, 0)
            .setCheckboxIgnore(true, ["HEAD_YN"])
            .setCustomRowCell('HEAD_YN', function (value, rowItem) {
                var option = {};
                option.controlType = 'widget.select';
                var selectOption = new Array();
                selectOption.push(['Y', ecount.resource.BTN85017, '']); //BTN85017
                selectOption.push(['N', ecount.resource.LBL09913, '']); //LBL09913           
                option.optionData = selectOption;

                return option;
            });

        contents.addGrid("dataGrid" + this.pageID, grid)

    },

    onInitFooter: function (footer, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();

        toolbar
            .addLeft(ctrl.define('widget.button', 'Send').label(ecount.resource.BTN00065))
            .addLeft(ctrl.define('widget.button', 'Close').label(ecount.resource.BTN00008));

        footer.add(toolbar); //toolbar add[footer 영역의 닫기]
    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
    onLoadTabPane: function (event) {
    },

    onLoadTabContents: function (event) {
        this._super.onLoadTabContents.apply(this, arguments);
    },

    onChangeHeaderTab: function (event) {
        this._super.onChangeHeaderTab.apply(this, arguments);
    },

    onChangeContentsTab: function (event) {
    },

    onLoadComplete: function (event) {
        this._super.onLoadComplete.apply(this, arguments);
    },

    onPopupHandler: function (control, param, handler) {
        handler(param);
    },

    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        this._super.onAutoCompleteHandler.apply(this, arguments);
    },

    onChangeControl: function (control) {

    },

    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data, grid) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },

    onGridAfterFormLoad: function (e, data, grid) {
        this._super.onGridAfterFormLoad.apply(this, arguments);
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ 'on' + target + control id ]
    ****************************************************************************************************/
    onFooterClose: function () {
        //this._getParent = ecount.page.popup.prototype._getParent;
        ecount.page.popup.prototype.close.call(this);
    },

    onFooterSend: function () {
        var gridObj = this.contents.getGrid().grid;
        var saveDatas = gridObj.getRowList().where(function (entity) { return entity.HEAD_YN == "Y"; })
        var docGubuns = new Array();

        $.each(saveDatas, function () {
            docGubuns.push(this.DOC_GUBUN);
        });

        var param = {
            SEND_SER: "RM201",
            DOC_GUBUN_LIST: docGubuns,
            HEAD_YN: "Y"
        };

        ecount.common.api({
            url: "/Common/Infra/SaveReplyMailSendStatus",
            async: false,
            data: param,
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.Error);
                } else {
                    //현재 메뉴의 발송여부 정보를 parent popup에 반영
                    var message = {
                        type: 'replayMailSendType',
                        HEAD_YN: docGubuns.indexOf(this.DOC_GUBUN) > -1 ? ecenum.useYn.yes : ecenum.useYn.none
                    };

                    this.sendMessage(this, message);
                    this.onFooterClose();
                }
            }.bind(this)
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    ON_KEY_F8: function () {
        this.onFooterSend();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    setGridData: function () {
        var defaultRowData = [
            { 'DOC_NAME': ecount.resource.LBL04366, 'DOC_GUBUN': '29', 'HEAD_YN': 'N' },  //DOC_GUBUN 29 DepositSlip
            { 'DOC_NAME': ecount.resource.LBL06083, 'DOC_GUBUN': '44', 'HEAD_YN': 'N' }, //DOC_GUBUN 44
            { 'DOC_NAME': this.getTaxResource(), 'DOC_GUBUN': this.getTaxDocGubun(), 'HEAD_YN': 'N' }, //DOC_GUBUN 45/49
            { 'DOC_NAME': ecount.resource.LBL93573, 'DOC_GUBUN': '88', 'HEAD_YN': 'N' }, //DOC_GUBUN 88
            { 'DOC_NAME': ecount.resource.LBL93574, 'DOC_GUBUN': '89', 'HEAD_YN': 'N' }, //DOC_GUBUN 89
            { 'DOC_NAME': ecount.resource.LBL05087, 'DOC_GUBUN': '66', 'HEAD_YN': 'N' }, //DOC_GUBUN 66
            { 'DOC_NAME': ecount.resource.LBL93309, 'DOC_GUBUN': '22', 'HEAD_YN': 'N' }, //DOC_GUBUN 22
            { 'DOC_NAME': ecount.resource.LBL93326, 'DOC_GUBUN': '33', 'HEAD_YN': 'N' }, //DOC_GUBUN 33
            { 'DOC_NAME': ecount.resource.LBL93312, 'DOC_GUBUN': '23', 'HEAD_YN': 'N' }, //DOC_GUBUN 23
            { 'DOC_NAME': ecount.resource.LBL07386, 'DOC_GUBUN': '24', 'HEAD_YN': 'N' }, //DOC_GUBUN 24
            { 'DOC_NAME': ecount.resource.LBL90008, 'DOC_GUBUN': '46', 'HEAD_YN': 'N' }, //DOC_GUBUN 46
            { 'DOC_NAME': ecount.resource.LBL05319, 'DOC_GUBUN': '92', 'HEAD_YN': 'N' }, //DOC_GUBUN 92
            { 'DOC_NAME': ecount.resource.LBL04321, 'DOC_GUBUN': '73', 'HEAD_YN': 'N' }, //DOC_GUBUN 73
            { 'DOC_NAME': ecount.resource.LBL05040, 'DOC_GUBUN': '11', 'HEAD_YN': 'N' }, //DOC_GUBUN 11
            { 'DOC_NAME': ecount.resource.LBL13036, 'DOC_GUBUN': '19', 'HEAD_YN': 'N' }, //DOC_GUBUN 19
            { 'DOC_NAME': ecount.resource.LBL93226, 'DOC_GUBUN': '12', 'HEAD_YN': 'N' }, //DOC_GUBUN 12
            { 'DOC_NAME': ecount.resource.LBL02916, 'DOC_GUBUN': '13', 'HEAD_YN': 'N' }, //DOC_GUBUN 13

            { 'DOC_NAME': ecount.resource.LBL06370, 'DOC_GUBUN': '15', 'HEAD_YN': 'N' }, //DOC_GUBUN 15
            { 'DOC_NAME': ecount.resource.LBL06373, 'DOC_GUBUN': '16', 'HEAD_YN': 'N' }, //DOC_GUBUN 16
            { 'DOC_NAME': ecount.resource.LBL06374, 'DOC_GUBUN': '17', 'HEAD_YN': 'N' }, //DOC_GUBUN 17
            { 'DOC_NAME': ecount.resource.LBL14260, 'DOC_GUBUN': '10', 'HEAD_YN': 'N' }, //DOC_GUBUN 10
            { 'DOC_NAME': ecount.resource.LBL02037, 'DOC_GUBUN': '21', 'HEAD_YN': 'N' }, //DOC_GUBUN 21
            { 'DOC_NAME': ecount.resource.LBL07460, 'DOC_GUBUN': '20', 'HEAD_YN': 'N' }, //DOC_GUBUN 20

            { 'DOC_NAME': ecount.resource.LBL10337, 'DOC_GUBUN': '18', 'HEAD_YN': 'N' }, //DOC_GUBUN 18
            { 'DOC_NAME': ecount.resource.LBL00274, 'DOC_GUBUN': '78', 'HEAD_YN': 'N' }, //DOC_GUBUN 78 GENERAL CERTIFICATE
            { 'DOC_NAME': ecount.resource.LBL12268, 'DOC_GUBUN': '48', 'HEAD_YN': 'N' }, //DOC_GUBUN 48
            { 'DOC_NAME': ecount.resource.LBL02283, 'DOC_GUBUN': '70', 'HEAD_YN': 'N' }, //DOC_GUBUN 70 Internal Use
            { 'DOC_NAME': ecount.resource.LBL04936, 'DOC_GUBUN': '36', 'HEAD_YN': 'N' }, //DOC_GUBUN 36
            { 'DOC_NAME': ecount.resource.LBL12480, 'DOC_GUBUN': '26', 'HEAD_YN': 'N' }, //DOC_GUBUN 26
            { 'DOC_NAME': ecount.resource.LBL00692, 'DOC_GUBUN': '34', 'HEAD_YN': 'N' }, //DOC_GUBUN 34 Purchase
            { 'DOC_NAME': ecount.resource.LBL93362, 'DOC_GUBUN': '40', 'HEAD_YN': 'N' }, //DOC_GUBUN 40
            { 'DOC_NAME': ecount.resource.LBL02728, 'DOC_GUBUN': '38', 'HEAD_YN': 'N' }, //DOC_GUBUN 38 Location trans
            { 'DOC_NAME': ecount.resource.LBL93320, 'DOC_GUBUN': '30', 'HEAD_YN': 'N' }, //DOC_GUBUN 30 Purchase Request
            { 'DOC_NAME': ecount.resource.LBL10942, 'DOC_GUBUN': '71', 'HEAD_YN': 'N' }, //DOC_GUBUN 71
            { 'DOC_NAME': ecount.resource.LBL04030, 'DOC_GUBUN': '27', 'HEAD_YN': 'N' }, //DOC_GUBUN 27 Shipment 
            { 'DOC_NAME': ecount.resource.LBL01489, 'DOC_GUBUN': '35', 'HEAD_YN': 'N' }, //DOC_GUBUN 35 Job Order
            { 'DOC_NAME': ecount.resource.LBL09840, 'DOC_GUBUN': '72', 'HEAD_YN': 'N' }, //DOC_GUBUN 72 Qual. Insp
            { 'DOC_NAME': ecount.resource.LBL90113, 'DOC_GUBUN': '28', 'HEAD_YN': 'N' }, //DOC_GUBUN 28 Release Sales Order
            { 'DOC_NAME': ecount.resource.LBL04937, 'DOC_GUBUN': '37', 'HEAD_YN': 'N' }, //DOC_GUBUN 37 Goods Receipt

            { 'DOC_NAME': ecount.resource.LBL02939, 'DOC_GUBUN': '67', 'HEAD_YN': 'N' }, //DOC_GUBUN 67 Sales Status
            { 'DOC_NAME': ecount.resource.LBL02963, 'DOC_GUBUN': '68', 'HEAD_YN': 'N' }, //DOC_GUBUN 68 Sales Order Status
            { 'DOC_NAME': ecount.resource.LBL00433, 'DOC_GUBUN': '69', 'HEAD_YN': 'N' }, //DOC_GUBUN 69 Quotation Status
            { 'DOC_NAME': ecount.resource.LBL35299, 'DOC_GUBUN': '76', 'HEAD_YN': 'N' } //DOC_GUBUN 76 Purchase Status
        ];

        //defaultRowData의 data들은 화면에 무조건 출력되는 데이터
        //this.RMList로 조회하는 데이터는 '발송'으로 설정된 ROW만 가져오게된다. (HEAD_YN은 무조건 Y) - 데이터가있으면 '발송', 없으면 '발송안함'
        //RMList의 HEAD_YN이 Y로 조회된 DOC_GUBUN과 defaultRowData의 DOC_GUBUN이 일치하면 HEAD_YN을 'Y'로 변경하여 '발송'으로 표시
        $.each(this.RMList, function () {
            var self = this;

            $.each(defaultRowData, function () {
                if (self.HEAD_YN == "Y" && self.Key.DOC_GUBUN == this.DOC_GUBUN) {
                    this.HEAD_YN = 'Y';
                }
            });
        });

        return defaultRowData;
    },

    getTaxResource: function () {
        var res = ecount.resource;
        var result = null;
        switch (this.viewBag.Nation) {
            case "KR":
                result = res.LBL04785;
                break;
            case "TW":
                result = res.LBL16316;
                break;
        }
        return result;
    },

    getTaxDocGubun: function () {
        var result = '45'
        switch (this.viewBag.Nation) {
            case "KR":
                result = '45'
                break;
            case "TW":
                result = '49'
                break;
        }
        return result;
    }

});