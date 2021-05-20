window.__define_resource && __define_resource("BTN00008","LBL05852","LBL01192","LBL00723","LBL06761","LBL00736","LBL18546","LBL08033");
/****************************************************************************************************
1. Create Date : 2016-11-01
2. Creator     : 신선미
3. Description : (세금)계산서진행단계 상세
4. Precaution  :
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECTAX023P_02", {

    /**********************************************************************
    *  page configuration settings
    **********************************************************************/

    //수정화면에서 보여줄 데이터(history)
    editData: null,

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this);
    },


    /**********************************************************************
    *  set widget options
    **********************************************************************/
    initProperties: function () {


    },

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header, resource) {
        header.notUsedBookmark()
              .setTitle("(세금)계산서진행단계 상세"); //(세금)계산서진행단계 상세
    },


    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {

        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid(),
            columns = [];


        columns.push({ propertyName: 'DATE', id: 'DATE', title: '작업일자', width: 120, align: "center" });

        columns.push({ propertyName: 'STATS', id: 'STATS', title: '작업구분', width: 150, align: "left" });

        columns.push({ propertyName: 'BIGO', id: 'BIGO', title: '비고', width: 200, align: "left" });



        grid.setRowData(this.viewBag.InitDatas.LoadData)
           .setColumns(columns)
           .setRowDataNumbering(true, true)
           .setCustomRowCell("DATE", this.setGridDataDate.bind(this))
           .setCustomRowCell("STATS", this.setGridDataStats.bind(this))
           .setCustomRowCell("BIGO", this.setGridDataBigo.bind(this));


        contents.addGrid("dataGrid" + this.pageID, grid);

    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
  *  event listener   ==>  [header, form, footer widget]
  **********************************************************************/
    onLoadComplete: function () {

    },

    /********************************************************************** 
   * event grid listener [click, change...] 
   **********************************************************************/
    setGridDataDate: function (e, data) {
        var option = {};
        option.data = ecount.infra.getECDateFormat('date10', false, data.DATE.toDatetime());
        return option;
    },


    setGridDataStats: function (e, data) {
        var option = {},
            value;

        switch (data["STATS"]) {
            case "T":value = "첨부오류"; break;
            case "I":value = "인증서첨부"; break;
            case "N":value = "인증서첨부취소"; break;
            case "Y":value = "국세청전송"; break;
            case "E":value = "국세청전송에러"; break;
            case "C": value = "국세청전송완료"; break;
            case "0": value = String.format("{0}({1})", ecount.resource.LBL05852, ecount.resource.LBL01192); break;  // Email발송(미수신)
            case "1": value = String.format("{0}({1})", ecount.resource.LBL05852, ecount.resource.LBL00723); break;  // Email발송(확인)
            case "2": value = String.format("{0}({1})", ecount.resource.LBL05852, ecount.resource.LBL06761); break;  // Email발송(검토요청)
            case "3": value = String.format("{0}({1})", ecount.resource.LBL05852, ecount.resource.LBL00736); break;  // Email발송(발송취소)
            default:
                value = "";
                break;

        }

        option.data = value;

        return option;
    },

    setGridDataBigo: function (e, data) {
        var option = {};
        if (['0', '1', '2', '3'].contains(data["STATS"])) {
            option.controlType = "widget.link";
            option.data = ecount.resource.LBL18546;
            option.event = {
                'click': function (e, data) {
                    var param = {
                        width: ecount.infra.getPageWidthFromConfig(),
                        height: 300,
                        popupType: true,//필수값
                        responseID: this.callbackID, //필수값
                        S_EMAIL: data.rowItem['S_EMAIL'],
                        C_NATIVE_NUM: data.rowItem['BIGO'],

                    };
                    //모달로 띄우기
                    this.openWindow({
                        url: '/ECERP/Popup.Common/ESD023P_03',
                        name: ecount.resource.LBL08033,
                        param: param,
                        popupType: false
                    });

                }.bind(this)
            };
        } else {
            option.data = data["BIGO"];
        }
        return option;
    },


    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    //닫기 버튼
    onFooterClose: function () {
        this.close();
        return false;
    },


    /**********************************************************************
    *  기능 처리
    **********************************************************************/


});
