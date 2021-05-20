window.__define_resource && __define_resource("LBL07154","LBL07155","LBL01519","LBL02498","LBL07157","LBL04418","LBL10802","LBL00250","LBL00251","LBL35373","LBL03314","LBL01742","LBL03614","MSG00205","LBL93365","LBL00909","LBL03503","LBL02211","LBL01432","BTN00008","LBL01578","LBL03968","LBL00703","LBL30081","LBL01209","LBL10698","LBL00723","LBL13806","LBL13807","LBL01770","LBL01155","LBL01382","LBL80306","LBL08134","LBL05852","BTN00204","LBL02436","LBL06864","LBL15145","LBL00182","LBL01472","LBL01158","LBL07436","LBL00240","LBL13510","LBL06804","LBL01159","LBL02749","LBL10804","LBL80096","BTN00650","LBL03287","LBL01042","LBL00732","LBL09353","LBL02333","LBL04198","LBL04200","LBL04201","LBL04212","LBL07877","LBL05310","LBL05628","LBL05626","LBL03684","LBL01241","LBL06953","LBL07172","LBL03085","LBL00306","LBL10803","LBL02207","LBL10651","LBL01163");
/****************************************************************************************************
1. Create Date : 2015.09.24
2. Creator     : 박현민
3. Description : 이력 (history)
4. Precaution  :
5. History     : Edit by Nguyen Minh Thien (2016.05.16) add logic load history menu Acct. E.D.R.P./Inv. E.D.R.P.(Thêm xem lịch sử màn hình:
                 Thời điểm hạn chế thay đổi(Kế toán)/ Thời điểm hạn chế thay đổi(Kiểm kê))
                 2016.06.15 Phạm Văn Phú Add Menutype [Insp_Item, Insp_Type, Insp_Setting, Sub_Insp], statement [Insp_Item, Insp_Type, Insp_Setting, Sub_Insp] for New Inpection Type  Menu
                 2016.06.15 NGuyen Chi Hieu Add MenuType[Item_Setting], statement[Item_Setting] for menu New Inspection Type
                 2017.10.27(HAO) - Add Menu_type 99 (Service hour)
                 2017.11.08 Nguyen Van Hoang Add MenuType[Schedule_History]
                 2018.08.01(이용희): Dev.11188 거래처등록 - 거래처 이력확인 시 Last Update가 현재 시간으로 나타나는 문제
                 2019.01.25(박종국) : A18_03940 - 전표이력조회에서 실사전표 삭제 취소 가능하도록
                 2019.02.19(김봉기) : 다목적입력 이력, 다목적편집 제한일자 추가 
                 2019.01.31(bsy) : 품목관계등록 추가
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.25(taind) A19_01497 - 소스코드진단결과 반영 - Master
                 2019.07.02(이현택) : 거래처관계 이력 추가
                 2019.08.08(박종국) : A18_01666 - 신규프레임_자금계획
                 2019.10.03 (tuan): Add key for RE ASSIGNMENT
                 2020.05.15(Hao) Add Extension Number to profile
6. MenuPath    : 재고전표 > 이력
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ES303P", {

    listUser: null,

    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        this.statement = this.menuType;

        if (this.isParentHistoryListFlag) {
            if (this.menuType == "C" || this.menuType == "13" || this.menuType == "14" || this.menuType == "70" || this.menuType == "P2") //heejun 외부시스템 연결, //C는 신규프레임워크 거래처입력 (13이 거래처입력이지만, 기존에 ES303에서의 13은 회원등록일 경우였음)
            {
                this.StatementNo = this.historySlipNo;
                this.historySlipDate = this.historySlipNo;
            }
        }
        else if (!this.IsLastDateShow) {
            this.lastData = "";
        }

        if (this.isParentHistoryListFlag && ["C", "13", "14"].contains(this.menuType)) {
            this.writeDate = this.historySlipDate;
        }
        else if (this.historySlipDate && this.historySlipDate.length == 8)
            this.writeDate = ecount.infra.getECDateFormat('DATE10', false, this.historySlipDate.toDate()) + "-" + this.historySlipNo;
        else
            this.writeDate = this.historySlipDate;

        this.searchFormParameter = {
            HISTORY_TYPE: this.menuType
            , HISTORY_DATE: this.historySlipDate
            , HISTORY_NO: this.historySlipNo
            , HISTORY_SEQ: -1
        };
    },

    // init properties
    initProperties: function () {
        debugger
        this.listUser = this.viewBag.InitDatas.ListUser;

        this.initContentFunc = {};
        //////___01___///////*****Process History by Program ID*********/////__this.PRG_ID__////___E020721___///////
        this.initContentFunc["E020721"] = function (contents) {
            //ERPProgramId.Manage.ReassignmentInput, E020721
            var generator = widget.generator,
                toolbar = generator.toolbar(),
                ctrl = generator.control(),
                settings = generator.grid();

            settings
                .setRowData(this.viewBag.InitDatas.DataByPrgId || [])
                .setRowDataNumbering(true, true)
                .setKeyColumn(this.setKeyColumnsSetting())
                .setColumns([
                    { propertyName: 'WRITE_ID', id: 'WRITE_ID', title: ecount.resource.LBL07154, width: 100, align: 'center' },
                    { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: 200, align: 'center' },
                    { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL01519, width: 100, align: 'center' }
                ])
                .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this))
                .setCustomRowCell('WRITE_ID', this.setGridDataLinkProfile.bind(this))
                .setEmptyGridMessage(this.lastData);

            toolbar.addLeft(ctrl.define("widget.label", "information").label(String.format("{0} : {1}",ecount.resource.LBL02498, this.writeDate)));
            contents.add(toolbar);
            contents.addGrid("dataGrid" + this.pageID, settings);
        }.bind(this);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        if (this.statement == '61')
            if (this.IsRegisterUser) {
                title = String.format("{0} {1}", ecount.resource.LBL07157, ecount.resource.LBL04418);
            }
            else {
                title = this.lastData ? ecount.resource.LBL07157 : ecount.resource.LBL10802;
            }
        else if (this.isEidtLimitedFlag) {
            if (this.statement == "50")
                title = ecount.resource.LBL00250;
            else if (this.statement == "51")
                title = ecount.resource.LBL00251;
        }
        else {
            if (this.statement == "98")
                title = ecount.resource.LBL35373;
            else
                title = ecount.resource.LBL07157;
        }
        header.setTitle(title);
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {

        //*****************Process History by Program ID*****************//
        if (!$.isEmpty(this.PRG_ID) && this.initContentFunc[this.PRG_ID]) {
            return this.initContentFunc[this.PRG_ID](contents);
        }
        //*****************Process History by Program ID*****************//

        if (this.menuType == "98") {

            var g = widget.generator
                , setting = g.settingPanel()
                , setting2 = g.settingPanel()
                , form = g.form()
                , physicalGrid = g.grid()
                , adjustGrid = g.grid();

            setting.focusIndex(1)
                .setId("setting1")
                .header(ecount.resource.LBL03314);

            contents.add(setting);

            var Columns = [
                { propertyName: 'ROWNUMBER', id: 'ROWNUMBER', title: ecount.resource.LBL01742, width: 96, align: 'center' },
                { propertyName: 'WRITE_ID', id: 'WRITE_ID', title: ecount.resource.LBL07154, width: 146, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: 274, align: 'center' },
                { propertyName: 'GB_TYPE', id: 'GB_TYPE', title: ecount.resource.LBL03614, width: 166, align: 'center' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL01519, width: 147, align: 'center' }
            ];

            var emptyMessageForCount = "";
            if (this.lastData)
                emptyMessageForCount = ecount.resource.MSG00205;
            else
                emptyMessageForCount = this.lastData;

            physicalGrid.setRowData(this.viewBag.InitDatas.ItemHistoryLoad[0])
                .setEmptyGridMessage(emptyMessageForCount)
                .setKeyColumn(['WRITER_ID'])
                .setColumns(Columns)
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this))
                .setCustomRowCell('GB_TYPE', this.setGridDataSlipType.bind(this))
                .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
                .setCustomRowCell('WRITER_ID', this.setGridDataLinkProfile.bind(this));
            contents.addGrid('physicalGrid', physicalGrid);

            setting2.focusIndex(1)
                .setId("setting2")
                .header(ecount.resource.LBL93365);

            contents.add(setting2);
            adjustGrid.setRowData(this.viewBag.InitDatas.ItemHistoryLoad[1])
                .setEmptyGridMessage("Last Update : " + this.lastData)
                .setKeyColumn(['WRITER_ID'])
                .setColumns(Columns)
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this))
                .setCustomRowCell('GB_TYPE', this.setGridDataSlipType.bind(this))
                .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
                .setCustomRowCell('WRITER_ID', this.setGridDataLinkProfile.bind(this));
            contents.addGrid('adjustGrid', adjustGrid);
        }
        else if (['765'].contains(this.menuType)) { //Approval Line for Print (Manage)

            var grid = widget.generator.grid();

            var Columns = [
                { propertyName: 'WRITER_ID', id: 'WRITER_ID', title: ecount.resource.LBL07154, width: 100, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: 200, align: 'center' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL01519, width: 100, align: 'center' }
            ];

            var keyColumns = ['WRITER_ID', 'WRITE_DT', 'HISTORY_STATUS'];

            grid.setRowDataNumbering(true, true)
                .setKeyColumn(keyColumns)
                .setColumns(Columns)
                .setRowData(this.viewBag.InitDatas.ItemHistoryLoad)
                .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this))
                .setCustomRowCell('WRITER_ID', this.setGridDataLinkProfile.bind(this))
                .setEmptyGridMessage(this.lastData);

            contents.addGrid("dataGrid" + this.pageID, grid);
        }
        else if (['756'].contains(this.menuType)) {
            var generator = widget.generator,
                toolbar = generator.toolbar(),
                ctrl = generator.control(),
                settings = generator.grid(),
                toolbar2 = generator.toolbar();

            var Columns = [
                { propertyName: 'WRITE_ID', id: 'WRITE_ID', title: ecount.resource.LBL07154, width: 100, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: 200, align: 'center' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL01519, width: 100, align: 'center' }
            ];

            settings.setRowData(this.viewBag.InitDatas.ItemHistoryLoad);
            settings.setRowDataNumbering(true, true)
                .setKeyColumn(this.setKeyColumnsSetting())
                .setColumns(Columns)
                .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this));

            if (!this.isFromUserPay)
                settings.setCustomRowCell('WRITE_ID', this.setGridDataLinkProfile.bind(this));

            settings.setEmptyGridMessage(this.lastData);

            toolbar.addLeft(ctrl.define("widget.label", "information").label(this.fnInfomationLabel()));
            contents.add(toolbar);
           
            contents.addGrid("dataGrid" + this.pageID, settings);
        }
        else if (['1912'].contains(this.menuType)) { //RFQ Progress Status            
            var grid = widget.generator.grid();

            if (this.isParentHistoryListFlag)
                this.IsLastDateShow = true;

            var Columns = [                  
                    { propertyName: 'HISTORY_NO', id: 'REQ_NO', title: ecount.resource.LBL01742, width: 96, align: 'center' },
                    { propertyName: 'USER_ID', id: 'USER_ID', title: ecount.resource.LBL07154, width: 146, align: 'center' },
                    { propertyName: 'CUST_NM', id: 'CUST_NM', title: ecount.resource.LBL00909, width: 274, align: 'center' },
                    { propertyName: 'EDIT_DT', id: 'EDIT_DT', title: ecount.resource.LBL03503, width: 166, align: 'center' }
                    
            ];

            var keyColumns = ['USER_ID', 'EDIT_DT'];

            grid
                .setRowDataNumbering(false, false)
                .setKeyColumn(keyColumns)
                .setColumns(Columns)
                .setRowData(this.viewBag.InitDatas.ItemHistoryLoad)
                .setCustomRowCell('EDIT_DT', this.setGridDataEDIT_DT.bind(this))
                .setCustomRowCell('CUST_NM', this.setGridDataCust_Detail.bind(this))
                .setEmptyGridMessage(this.IsLastDateShow ? "Last Update : " + this.lastData : "");

            contents.addGrid("dataGrid" + this.pageID, grid);
        }
        else if (['1933'].contains(this.menuType)) { //RFQ Progress Status            
            var grid = widget.generator.grid();

            if (this.isParentHistoryListFlag)
                this.IsLastDateShow = true;

            var Columns = [
                    { propertyName: 'HISTORY_SER', id: 'HISTORY_SER', title: ecount.resource.LBL01742, width: 45, align: 'center' },
                    { propertyName: 'WRITER_ID', id: 'WRITER_ID', title: ecount.resource.LBL07154, width: 105, align: 'center' },
                    { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL00909, width: 210, align: 'center' },
                    { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL03503, width: 65, align: 'center' }

            ];

            var keyColumns = ['WRITER_ID', 'WRITE_DT'];

            grid
                .setRowDataNumbering(false, false)
                .setKeyColumn(keyColumns)
                .setColumns(Columns)
                .setRowData(this.viewBag.InitDatas.ItemHistoryLoad)
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this))
                .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
                .setEmptyGridMessage(this.IsLastDateShow ? "Last Update : " + this.lastData : "");

            contents.addGrid("dataGrid" + this.pageID, grid);
        }
        else if (['Allodedu', 'AllodeduGrp'].contains(this.menuType)) {
            var grid = widget.generator.grid();

            if (this.isParentHistoryListFlag)
                this.IsLastDateShow = true;

            var Columns = [
                { propertyName: 'ALLODEDU_SEQ', id: 'ALLODEDU_SEQ', title: ecount.resource.LBL01742, width: 70, align: 'center' },
                { propertyName: 'WRITER_ID', id: 'WRITER_ID', title: ecount.resource.LBL07154, width: 120, align: 'center' },
                { propertyName: 'JOB_TYPE', id: 'JOB_TYPE', title: ecount.resource.LBL00909, width: 150, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL03503, width: 200, align: 'center' }
            ];

            var keyColumns = ['ALLODEDU_GUBUN', 'ALLODEDU_CD', 'ALLODEDU_SEQ'];

            grid
                .setRowDataNumbering(false, false)
                .setKeyColumn(keyColumns)
                .setColumns(Columns)
                .setRowData(this.viewBag.InitDatas.ItemHistoryLoad)
                .setCustomRowCell('ALLODEDU_SEQ', this.setGridDataALLODEDU_SEQ.bind(this))
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this))
                .setCustomRowCell('JOB_TYPE', this.setGridDataJobType.bind(this))
                .setEmptyGridMessage(this.IsLastDateShow ? "Last Update : " + this.lastData : "");

            contents.addGrid("dataGrid" + this.pageID, grid);
        }
        else if (['ProjectionVoucher'].contains(this.menuType)) {
            
            var grid = widget.generator.grid(),
                generator = widget.generator,
                toolbar = generator.toolbar(),
                ctrl = generator.control();

            toolbar.addLeft(ctrl.define("widget.label", "io_date").label(String.format("{0}{1}{2}", ecount.resource.LBL02211, " : ", ecount.infra.getECDateFormat('DATE10', false, this.historySlipDate.toDate()))));
            contents.add(toolbar)

            if (this.isParentHistoryListFlag)
                this.IsLastDateShow = true;

            var Columns = [
                { propertyName: 'HIST_SNO', id: 'HIST_SNO', title: ecount.resource.LBL01742, width: 45, align: 'center' },
                { propertyName: 'WRTR_ID', id: 'WRTR_ID', title: ecount.resource.LBL07154, width: 105, align: 'center' },
                { propertyName: 'WRT_DTM', id: 'WRT_DTM', title: ecount.resource.LBL07155, width: 210, align: 'center' },
                { propertyName: 'HIST_STAT_CD', id: 'HIST_STAT_CD', title: ecount.resource.LBL01519, width: 65, align: 'center' }
            ];

            var keyColumns = ['WRTR_ID', 'WRT_DTM'];

            grid
                .setRowDataNumbering(false, false)
                .setKeyColumn(keyColumns)
                .setColumns(Columns)
                .setRowData(this.viewBag.InitDatas.ItemHistoryLoad)
                .setCustomRowCell('HIST_SNO', this.setGridDataHIST_SNO.bind(this))
                .setCustomRowCell('WRT_DTM', this.setGridDataWRT_DTM.bind(this))
                .setCustomRowCell('HIST_STAT_CD', this.setGridDataHIST_STAT_CD.bind(this))
                .setEmptyGridMessage(this.IsLastDateShow ? "Last Update : " + this.lastData : "");

            contents.addGrid("dataGrid" + this.pageID, grid);
        }
        else {
            var generator = widget.generator,
                toolbar = generator.toolbar(),
                ctrl = generator.control(),
                settings = generator.grid(),
                toolbar2 = generator.toolbar();
            
            if (['C', '13', '14', '17', '70', '25', 'OM', '50', 'Insp_Item', 'Insp_Setting', 'Sub_Insp', '61', '51', '16', 'CT', '110', 'DailyTimeSheet', '99', 'Schedule', 'OfficeEquipment', 'DIYBoard', 'DiyBoardLimit', 'P2', 'CR', '103'].contains(this.menuType))
                settings.setRowData(this.viewBag.InitDatas.ItemHistoryLoad);
            else
                settings.setRowData(this.viewBag.InitDatas.HistoryLoad);

            if (this.menuType == '81') {
                //품질검사요청 경우, 본 history가 없으면, 전표의 수정, 생성일로 기본 구성을 해준다.

                if (!(this.viewBag.InitDatas.HistoryLoad && this.viewBag.InitDatas.HistoryLoad.length > 0))
                    settings.setRowData(this.viewBag.InitDatas.ItemHistoryLoad);
            }

            if (this.isParentHistoryListFlag)
                this.IsLastDateShow = true;

            if (this.historySlipType == 4 || this.historySlipType == 12) {
                toolbar2.addLeft(ctrl.define("widget.label", "businessNo").label(String.format("{0}{1}{2}", ecount.resource.LBL01432, " : ", this.historySlipNo)));
                contents.add(toolbar2);
            }

            var emptyMessageForCount = "";
            if ($.isEmpty(this.lastData)) {
                this.IsLastDateShow = false;
                emptyMessageForCount = ecount.resource.MSG00205;
            }
            else
                emptyMessageForCount = this.lastData;

            settings
                .setRowDataNumbering(true, true)
                .setKeyColumn(this.setKeyColumnsSetting())
                .setColumns(this.setColumnsSettings())
                .setCustomRowCell('GB_TYPE', this.setGridDataSlipType.bind(this))
                .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
                .setCustomRowCell('WRITE_DT', this.setGridDataWRITE_DT.bind(this))
                .setCustomRowCell('ERP_REQ_DATE', this.setGridDataOpenMarketSlipDate.bind(this))
                .setCustomRowCell('WRITE_ID', this.setGridDataLinkProfile.bind(this))
                .setEmptyGridMessage(this.IsLastDateShow ? "Last Update : " + this.lastData : emptyMessageForCount);

            if (!['OM', '61', '16', 'pay', 'TaxRate', 'CR', '103'].contains(this.menuType)) {
                //툴바
                toolbar.addLeft(ctrl.define("widget.label", "information").label(this.fnInfomationLabel()));
                contents.add(toolbar);
            }

            contents.addGrid("dataGrid" + this.pageID, settings);
        }
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
    },

    setDataUrl: function () {
        var url = "/Inventory/Basic/GetListHistory";
        return url;
    },

    //toolbar 출력값
    fnInfomationLabel: function () {
        var infolabel = "";

        if (this.isShowItem)
            return "";

        if (this.statement == "98")
            infolabel = "";

        if (this.statement == "25")
            infolabel = ecount.resource.LBL01578 + " : " + this.prodCode + " : " + this.prodDes;
        else {
            if (!this.isParentHistoryListFlag) {
                if (this.menuType == "14" || this.menuType == "C" || this.menuType == "P2")   // 품목이면
                    infolabel = this.resource.LBL02498 + " : " + this.historySlipNo;
                else
                    infolabel = this.resource.LBL02498 + " : " + this.statementNo;
            }
            else
                infolabel = this.resource.LBL02498 + " : " + this.writeDate;
        }

        if ((this.statement == "50" || this.statement == "51" || this.menuType == '17' || this.statement == "Allodedu" || this.menuType == 'DiyBoardLimit') && !this.isEidtLimitedFlag)
            infolabel = "";

        return infolabel;
    },

    //grid columns
    setColumnsSettings: function (e, data) {

        var columns = [];
        // Column property name by menu type / Tên thuộc tính cột theo từng loại trình đơn
        var userColPropertyName = "WRITE_ID";
        // Column title by menu type / Tiêu đề cột theo từng loại trình đơn
        var userColTitle = ecount.resource.LBL07154;
        var tmpResx = ecount.resource.LBL01519;
        var tmpWidth = 100;

        if (this.menuType == "C" || this.menuType == "DailyTimeSheet") {
            userColPropertyName = "WRITER_ID";
        } else if (this.menuType == '16') { // Register Apvl. Line
            userColPropertyName = 'WRITE_USERNAME';
            userColTitle = ecount.resource.LBL03968;
        } else if (this.menuType == '61') {
            tmpResx = ecount.resource.LBL00703;
            tmpWidth = '';
        }

        if (this.menuType == "OM") {
            columns = [
                { propertyName: 'WRITER_ID', id: 'WRITER_ID', title: ecount.resource.LBL07154, width: 100, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: 200, align: 'center' },
                { propertyName: 'ERP_REQ_DATE', id: 'ERP_REQ_DATE', title: "ERP전송전표번호", width: '', align: 'left' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL01519, width: 100, align: 'center' }
            ];
        } else if (this.menuType == "CT") {
            columns = [
                { propertyName: 'WRITER_ID', id: 'WRITER_ID', title: ecount.resource.LBL07154, width: 100, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: '', align: 'center' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: tmpResx, width: 100, align: 'center' }
            ];
        } else if (this.menuType != "C" && this.menuType != "13" && this.menuType != "14" && this.menuType != "25" && this.menuType != "99" && this.menuType != "70"
            && (this.menuType == "Insp_Item" || this.menuType == "Insp_Type" || this.menuType == "Insp_Setting" || this.menuType == "Sub_Insp" || this.menuType == "12")) { //heejun 외부시스템 연결
            columns = [
                { propertyName: userColPropertyName, id: userColPropertyName, title: ecount.resource.LBL07154, width: 100, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: 200, align: 'center' },
                { propertyName: 'GB_TYPE', id: 'GB_TYPE', title: ecount.resource.LBL03614, width: 100, align: 'center' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL01519, width: 100, align: 'center' }
            ];
        } else {
            columns = [
                { propertyName: userColPropertyName, id: userColPropertyName, title: userColTitle, width: 100, align: 'center' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, width: 200, align: 'center' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: tmpResx, width: tmpWidth, align: 'center' }
            ];
        }

        return columns;
    },

    // grid columnKey 
    setKeyColumnsSetting: function (e, data) {
        var columns = [];

        if (this.menuType == "OM") {
            columns = ['WRITER_ID', 'WRITE_DT', 'ERP_REQ_DATE', 'HISTORY_STATUS'];
        } else if (this.menuType != "C" && this.menuType != "13" && this.menuType != "14" && this.menuType != "25" && this.menuType != "99" && this.menuType != "70") { //heejun 외부시스템 연결
            columns = ['WRITE_ID', 'WRITE_DT', 'GB_TYPE', 'HISTORY_STATUS'];
        }
        else if (this.menuType == "CT") {
            columns = ['WRITER_ID', 'WRITE_DT', 'HISTORY_STATUS'];
        }
        else {
            var userColName = 'WRITE_ID';
            if (this.menuType == '16') {
                userColName = 'WRITE_USERNAME';
            }
            columns = [userColName, 'WRITE_DT', 'HISTORY_STATUS'];
        }
        return columns;
    },

    //전표종류 리소스변환
    setGridDataSlipType: function (e, data) {
        var datavalue = "";

        if ((this.menuType != "C" && this.menuType != "13" && this.menuType != "14" && this.menuType != "70") && !this.isEidtLimitedFlag) //heejun 외부시스템 연결
        {
            if (data["GB_TYPE"] == "Z")
                datavalue = ecount.resource.LBL30081; //전자결재
            else if (data["GB_TYPE"] == "N")
                datavalue = ecount.resource.LBL01209; //미확인
            else if (data["GB_TYPE"] == "A")
                datavalue = ecount.resource.LBL10698; //전표결재
            else
                datavalue = ecount.resource.LBL00723; //확인
        }

        if (this.menuType == "50")
            datavalue = "";

        var option = { data: datavalue };
        return option
    },

    setProfileLink: function (userId) {
        var self = this;
        userId = userId.toLowerCase();

        var lstTmp = $.grep($(self.listUser), function (x) {
            return (x.USER_ID.toLowerCase() == userId);
        });

        if (lstTmp.length > 0)
            return true;

        return false;
    },

    //Set link 
    setGridDataLinkProfile: function (value, rowItem) {
        var self = this;
        var option = { controlType: "widget.label" };
        var userID = self.menuType == '98' || self.menuType == '765' || self.menuType == '1933' ? rowItem.WRITER_ID : rowItem.WRITE_ID;

        if (this.setProfileLink(userID) === true && this.isFromCS !== true) {
            option.controlType = "widget.link";

            option.event = {
                'click': function (e, data) {
                    if (self.menuType == "98" || self.menuType == '765')
                        userID = data.rowItem.WRITER_ID;
                    else
                        userID = data.rowItem.WRITE_ID;

                    ecount.common.api({
                        url: '/Common/Menu/GetProfileUserInfomation',
                        data: { WRITER_ID: userID },
                        ecPageID: self.ecPageID,
                        success: function (result) {
                            if (result.Status == "200" && result.Data.length != 0) {
                                var vData = result.Data.Data,
                                    url = vData.DefaultImage;

                                if (vData.IS_EXIST) {
                                    url = vData.FILE_PATH;
                                }

                                var userData = {
                                    ID: vData.data.ID,
                                    name: vData.data.UNAME,
                                    site: vData.data.SITE_DES,
                                    extNumber: vData.data.EXTENSION_PHONE,
                                    phone: vData.data.HP_NO,
                                    email: vData.data.EMAIL,
                                    message: vData.CHAT_STATUS_PHRASE,
                                    url: url, //image url 입니다.
                                    authority: {    //sms를 권한을 체크합니다. 추후에 1:1대화나 쪽지보내기 기능이 추가되면 늘어날 수 있습니다.
                                        sms: vData.AuthSMS
                                    },
                                    chatYN: vData.CHAT_YN,
                                    userName: vData.data.UNAME,
                                    metaData: self._getPopupMetadata(),
                                    memoPopupType: vData.MEMO_POPUP_TYPE,
                                    RetUrl: result.Data.Data.RetUrl,
                                    SessionData: result.Data.Data.SessionData,
                                    PostData: result.Data.Data.PostData
                                };

                                ecount.profile.show(userData);
                            }
                        },
                        complete: function () {
                            self.hideProgressbar();
                        }
                    });

                    e.preventDefault();
                }.bind(self)
            }
        }

        return option;
    },

    setGridDataWRITE_DT: function (e, data) {
        var option = {};
        option.data = ecount.infra.getECDateFormat('date11', false, data.WRITE_DT.toDatetime());
        return option
    },

    setGridDataWRT_DTM: function (e, data) {
        var option = {};
        option.data = ecount.infra.getECDateFormat('date11', false, data.WRT_DTM.toDatetime());
        return option;
    },

    setGridDataEDIT_DT: function (e, data) {
        var option = {};
        option.data = ecount.infra.getECDateFormat('date11', false, data.EDIT_DT.toDatetime());
        return option
    },
    setGridDataCust_Detail: function (e, data) {
        var strDetail = "";
        var cust_Mn = data["CUST_NM"]
        var option = {};
        if (data["STATUS"] == "Q")
            strDetail = ecount.resource.LBL13806;
        else if (data["STATUS"] == "7")
            strDetail = ecount.resource.LBL13807;
        else if (data["STATUS"] == "I")
            strDetail = ecount.resource.LBL01770;
        else if (data["STATUS"] == "M")
            strDetail = ecount.resource.LBL01155;
        else if (data["STATUS"] == "T")
            strDetail = ecount.resource.LBL01382;
        else if (data["STATUS"] == "D")
            strDetail = ecount.resource.LBL80306;
        else if (data["STATUS"] == "F")
            strDetail = ecount.resource.LBL08134;
        else if (data["STATUS"] == "E")
            strDetail = ecount.resource.LBL05852;

        if (!$.isEmptyObject(cust_Mn) && cust_Mn != "")
            option.data = strDetail + "(" + cust_Mn + ")";
        else
            option.data = strDetail;
        return option;
    },

    // 순번
    setGridDataALLODEDU_SEQ: function (e, data) {
        var option = {};

        option.data = data.Key.ALLODEDU_SEQ;

        return option;
    },

    //수당/항목등록
    setGridDataJobType: function (e, data) {
        var option = {};

        switch (data["JOB_TYPE"]) {
            case "I":
                option.data = ecount.resource.LBL01770;
                break;
            case "M":
                option.data = ecount.resource.LBL01155;
                break;
            case "S":
                option.data = ecount.resource.BTN00204;
                break;
            case "R":
                option.data = ecount.resource.LBL02436;
                break;
            default:
                option.data = ecount.resource.LBL01770;
                break;
        }

        return option;
    },

    setGridDataOpenMarketSlipDate: function (e, data) {
        var option = {};

        if (data.ERP_REQ_DATE != null) {
            // 주문서
            option.data = "[" + ecount.resource.LBL06864 + "] " + data.ERP_REQ_DATE + '-' + data.ERP_REQ_NO;
        }
        else if (data.ERP_IO_DATE != null) {
            // 판매
            option.data = "[" + ecount.resource.LBL15145 + "] " + data.ERP_IO_DATE + '-' + data.ERP_IO_NO;
        }
        return option;
    },

    //상태 리소스변환
    setGridDataHistoryStatus: function (e, data) {
        var strState = "";

        if (data["HISTORY_STATUS"] == "I")
            strState = ecount.resource.LBL01770;  //신규
        else if (data["HISTORY_STATUS"] == "M")
            strState = ecount.resource.LBL01155;  //수정                               
        else if (data["HISTORY_STATUS"] == "S") {
            if (['01', '02', '04', '06', '07', '08', '12', '15', '81', '82', 'CT'].contains(this.menuType))
                strState = ecount.resource.LBL00182;  //종결 
            else
                strState = ecount.resource.LBL01472;  //사용중단
        }
        else if (data["HISTORY_STATUS"] == "D")
            strState = ecount.resource.LBL01158;   //삭제
        else if (data["HISTORY_STATUS"] == "E")
            strState = ecount.resource.LBL05852;  //Email발송
        else if (data["HISTORY_STATUS"] == "F")
            strState = ecount.resource.LBL08134;  //Fax발송
        else if (data["HISTORY_STATUS"] == "X")
            strState = ecount.resource.LBL07436;  //엑셀변환
        else if (data["HISTORY_STATUS"] == "W")
            strState = ecount.resource.LBL00240;  //Word
        else if (data["HISTORY_STATUS"] == "P") {
            if (data["HISTORY_TYPE"] == "1") {
                strState = ecount.resource.LBL01155 + "(" + ecount.resource.LBL13510 + ")";//수정(매장판매입력설정)
            }
            else {
                strState = ecount.resource.LBL06804;  //PDF 변환
            }
        }
        else if (data["HISTORY_STATUS"] == "O")
            strState = ecount.resource.LBL01159;  //인쇄
        else if (data["HISTORY_STATUS"] == "R") {
            if (['C', '13', '14', '70', '61', '17'].contains(this.menuType)) //heejun 외부시스템 연결
                strState = ecount.resource.LBL02436;   //재사용
            else
                strState = ecount.resource.LBL02749;  //종결취소 
        }
        else if (data["HISTORY_STATUS"] == "C") {
            if (this.menuType == '61')
                strState = ecount.resource.LBL10804;
            else
                strState = ecount.resource.LBL80096; //승인
        }
        else if (data["HISTORY_STATUS"] == "N") {
            if (this.menuType == "42") {
                strState = ecount.resource.BTN00650;   //생산입고II로 변경
            }
            else if (this.menuType == "43") // 생산 체크로 생산입고 전표가 만들어 진 경우 : 43&N
                strState = ecount.resource.LBL01770;  //신규
            else
                strState = ecount.resource.LBL01770 + "(" + ecount.resource.LBL03287 + ")";    //신규(생산전표)
        }
        else if (data["HISTORY_STATUS"] == "U") {
            if (this.menuType == "43" || this.menuType == "C" || this.menuType == "OM" || this.menuType == "89") // 수정 : 43&U
                strState = ecount.resource.LBL01155;  //수정
            else
                strState = ecount.resource.LBL01155 + "(" + ecount.resource.LBL03287 + ")";    //수정(생산전표)
        }
        else if (data["HISTORY_STATUS"] == "V") {
            strState = ecount.resource.LBL01042;     //확인
        }
        else if (data["HISTORY_STATUS"] == "T")
            strState = ecount.resource.LBL00732;     //확인취소
        else if (data["HISTORY_STATUS"] == "L")
            strState = ecount.resource.LBL01155 + "(" + ecount.resource.LBL01209 + ")";    //수정(미확인)
        else if (data["HISTORY_STATUS"] == "B")
            strState = ecount.resource.LBL01382; //삭제취소
        else if (data["HISTORY_STATUS"] == "A") {
            if (data["HISTORY_TYPE"] == "1") {
                strState = ecount.resource.LBL01155 + "(" + ecount.resource.LBL09353 + ")";//수정(이카운트ERP앱)
            }
            else {
                strState = ecount.resource.LBL02333; //수정(일괄)
            }
        }
        else if (data["HISTORY_STATUS"] == "G")
            strState = ecount.resource.LBL04198; //신규(출하)
        else if (data["HISTORY_STATUS"] == "H")
            strState = ecount.resource.LBL04200; //수정(출하)
        else if (data["HISTORY_STATUS"] == "J")
            strState = ecount.resource.LBL04201; //신규(생산.출하)
        else if (data["HISTORY_STATUS"] == "K")
            strState = ecount.resource.LBL04212; //수정(생산.출하)
        else if (data["HISTORY_STATUS"] == "Y")
            strState = "";
        else if (data["HISTORY_STATUS"] == "Z") {
            if (this.menuType == '61')
                strState = ecount.resource.LBL07877;
            else
                strState = ecount.resource.LBL05310; //결재
        }

        else if (data["GB_TYPE"] == "A" && data["HISTORY_STATUS"] == "1")
            strState = ecount.resource.LBL05310; //결재
        else if (data["GB_TYPE"] == "A" && data["HISTORY_STATUS"] == "3")
            strState = ecount.resource.LBL05628; //결재취소
        else if (data["GB_TYPE"] == "A" && data["HISTORY_STATUS"] == "9")
            strState = ecount.resource.LBL05626; //전결
        else if (data["GB_TYPE"] == "A" && data["HISTORY_STATUS"] == "8")
            strState = ecount.resource.LBL03684; //후결
        else if (data["GB_TYPE"] == "A" && data["HISTORY_STATUS"] == "2")
            strState = ecount.resource.LBL01241; //반려
        else if (data["GB_TYPE"] == "A" && data["HISTORY_STATUS"] == "5")
            strState = ecount.resource.LBL06953; //반려취소

        else if (data["HISTORY_STATUS"] == "0")
            strState = ecount.resource.LBL07172;
        else if (data["HISTORY_STATUS"] == "1")
            strState = ecount.resource.LBL03085;//사용자정보
        else if (data["HISTORY_STATUS"] == "2")
            strState = ecount.resource.LBL00306;//개인정보변경
        else if (data["HISTORY_STATUS"] == "3")
            strState = ecount.resource.LBL07877;//다음에변경하기
        else if (data["HISTORY_STATUS"] == "4")
            strState = ecount.resource.LBL10803;//비밀번호재설정
        else if (data["HISTORY_STATUS"] == "5")
            strState = ecount.resource.LBL10804;//정기변경
        else if (data["HISTORY_STATUS"] == "6" || data["HISTORY_STATUS"] == "8")
            strState = ecount.resource.LBL02207;//사원등록
        else if (data["HISTORY_STATUS"] == "7" || data["HISTORY_STATUS"] == "9")
            strState = ecount.resource.LBL10651;//CS ID등록
        else if ($.isNull(data["HISTORY_STATUS"]) || $.isEmpty(data["HISTORY_STATUS"]))
            strState = ecount.resource.LBL01163;   //상태없음

        if (!['C', '13', '14', '25', '99', '70'].contains(this.menuType) && !this.isEidtLimitedFlag) {//heejun 외부시스템 연결
            if (data["GB_TYPE"] == "C")
                strState = strState + "(CS)";
        }

        var option = {};
        option.data = strState;
        return option
    },

    setGridDataHIST_STAT_CD: function (e, data) {

        var strState = "";

        if (data["HIST_STAT_CD"] === "I")
            strState = ecount.resource.LBL01770;  //신규
        else if (data["HIST_STAT_CD"] === "M")
            strState = ecount.resource.LBL01155;  //수정
        else if (data["HIST_STAT_CD"] === "D")
            strState = ecount.resource.LBL01158;  //삭제

        var option = {};
        option.data = strState;
        return option;

    },

    setGridDataHIST_SNO: function (e, data) {
        var option = {};
        option.data = data.Key.HIST_SNO;
        return option;
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    }
});
