window.__define_resource && __define_resource("LBL02874","LBL02878","LBL06434","LBL04057","LBL02869","LBL01780","LBL11973","MSG06802","LBL11974","LBL02871","MSG06801","LBL11975","MSG06803","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.12.06
2. Creator     : 
3. Description :통장계좌 삭제 불가 목록
4. Precaution  :
5. History     :
                
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "NoticeNonDeletableBankAccount", {


    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {

    },

    render: function () {
        this._super.render.apply(this);
    },


    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        debugger;
        header.setTitle(this.GetMenuName("TITLE"));
        header.notUsedBookmark();
    },

    onInitContents: function (contents) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid(),
            ctrl = g.control(),
            form = g.form();

        var menuName = this.GetMenuName("TITLE");
        var subMsge = this.GetMenuName("SUBMSG");

        toolbar.addLeft(ctrl.define("widget.label", "warning").label(subMsge).useHTML()).end();

        grid
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setKeyColumn(['BUSINESS_NO'])
            .setColumns([
                { propertyName: 'BUSINESS_NO', id: 'BUSINESS_NO', title: ecount.resource.LBL02874, width: '130' },
                { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL02878, width: '170' },
            ])
            .setColumnFixHeader(true)
            .setCustomRowCell('BUSINESS_NO', this.setLinkData.bind(this));

        contents.add(toolbar)
                .addGrid("dataGrid", grid);
    },


    //팝업연결
    setLinkData: function (value, rowData) {
        var option = {};

        option.data = rowData["BUSINESS_NO"];
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                this.openWindow({
                    url: this.GetLinkDataInfo(data.rowItem, "URL"),
                    name: this.GetLinkDataInfo(data.rowItem, "POP"),
                    param: this.GetLinkDataObjParam(data.rowItem),
                    popupType: this.GetLinkDataInfo(data.rowItem, "POPUPTYPE"),
                    additional: false
                });

                e.preventDefault();                
            }.bind(this)
        };

        return option;
    },

    //링크정보 반환
    GetLinkDataInfo: function (rowData, returnType) {
        debugger;
        var linkUrl;
        var popupName;
        var popupType;
        var returnValue;
        var menuCode = this.MENU_CODE;

        switch (menuCode) {
            
            case "PAYMENTAGENCY": //결재대행사
                linkUrl = "/ECERP/EBA/EBA012M";
                popupName = String.format(ecount.resource.LBL06434, ecount.resource.LBL04057);
                popupType = false;
                break;
            case "MERCHANTACCOUNT": //카드사
                linkUrl = "/ECERP/EBA/EBA010M";
                popupName = String.format(ecount.resource.LBL06434, ecount.resource.LBL02869),
                popupType = false;
                break;

            case "CREDITCARD": //신용카드
                linkUrl = "/ECERP/EBA/EBA008M";
                popupName = String.format(ecount.resource.LBL06434, ecount.resource.LBL01780);
                popupType = false;
                break;

            default:
                linkUrl = "";
                popupName = "List";
                popupType = true;
                break;
        }

        if (returnType == "URL") {
            returnValue = linkUrl;
        }
        else if (returnType == "POPUPTYPE") {
            returnValue = popupType;
        }
        else {
            returnValue = popupName;
        }

        return returnValue;
    },

    //링크연결시 검색조건값 설정
    GetLinkDataObjParam: function (rowData) {
        var returnParam = {};
        var menuCode = this.MENU_CODE;

        switch (menuCode) {
            case "PAYMENTAGENCY": //결재대행사
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 875,
                    editFlag: "M",
                    business_No: rowData['BUSINESS_NO'],
                    cancel: rowData['CANCEL']
                };
                break;
            case "MERCHANTACCOUNT": //카드사
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 425,
                    editFlag: 'M',
                    businessNo: rowData['BUSINESS_NO']
                };
                break;
            case "CREDITCARD": //신용카드
                returnParam = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 385,
                    editFlag: "M",
                    GUBUN: rowData['GUBUN'],
                    BUSINESS_NO: rowData['BUSINESS_NO'],
                    isCloseDisplayFlag: true,
                };
                break;
            default:
                returnParam = {
                    width: 300,
                    height: 600,
                }
                break;
        }
        return returnParam;
    },

    //메뉴명 반환
    GetMenuName: function (findType) {
        var menuCode = this.MENU_CODE;
        var returnValue = "";
        var returnName = "";
        var returnsubMsg = "";
        switch (menuCode) {            
            case "CREDITCARD":
                returnName = ecount.resource.LBL11973;    //신용카드
                returnsubMsg = ecount.resource.MSG06802;
                break;
            case "MERCHANTACCOUNT":
                returnName = ecount.resource.LBL11974;    //카드사 (LBL02871 : 카드사코드)
                returnsubMsg = ecount.resource.MSG06801;
                break;
            case "PAYMENTAGENCY":
                returnName = ecount.resource.LBL11975;    //결제대행사
                returnsubMsg = ecount.resource.MSG06803;
                break;
        }

        if (findType == "TITLE") {
            returnValue = returnName;
        } else if (findType == "SUBMSG") {
            returnValue = returnsubMsg;
        }

        return returnValue;

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar
            .attach(ctrl.define("widget.button", "close").label(this.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {

    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

    /**********************************************************************
   *  기능 처리
   **********************************************************************/

});