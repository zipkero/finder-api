window.__define_resource && __define_resource("LBL07157","LBL01742","LBL07154","LBL07155","LBL01519","BTN00008","LBL01770","LBL01155");
/****************************************************************************************************
1. Create Date : 2017.09.05
2. Creator     : ChauMinh
3. Description : History For Attendance data
4. Precaution  : Manage> Time Mgmt > Register Record Time > H
5. History     : 2017.09.05
6: Old file    :                
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "EPA030P", {
    newItem: false,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        debugger;
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL07157);
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();

        settings
            .setRowData(this.viewBag.InitDatas.AttendanceHistory)
            //.setRowDataUrl('/Manage/TimeMgmt/GetDataWidgetPaidLeave')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(['ATTEND_ID'])
            .setColumns([
                //{ propertyName: 'ATTEND_ID', id: 'ATTEND_ID', title: ecount.resource.LBL01742, align: 'center', width: '50' },
                { propertyName: 'WRITE_ID', id: 'WRITE_ID', title: ecount.resource.LBL07154, align: 'center', width: '100' },
                { propertyName: 'WRITE_DT', id: 'WRITE_DT', title: ecount.resource.LBL07155, align: 'center', width: '' },
                { propertyName: 'HISTORY_STATUS', id: 'HISTORY_STATUS', title: ecount.resource.LBL01519, width: 147, align: 'center', width: '60' }
            ])

            .setCustomRowCell('WRITE_DT', this.setGridDataWrittenDate.bind(this))
            .setCustomRowCell('HISTORY_STATUS', this.setGridDataHistoryStatus.bind(this))
            //.setEventFocusOnInit(true)                  //Focus 이벤트 시작
            //.setKeyboardCursorMove(true)                // 위, 아래 방향키
            //.setKeyboardSpacebarForSelectRow(true)      // 스페이스로 선택
            //.setKeyboardPageMove(true)                  // 페이징 이동
            //.setKeyboardEnterForExecute(true)
            //.setCheckBoxActiveRowStyle(true)
            ;

        contents
            .add(toolbar)
            .addGrid("dataGrid" + this.pageID, settings);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
                //.addRight(ctrl.define("widget.keyHelper", "keyHelper").disableOptions(keyHelper))
        ;

        footer.add(toolbar);
    },

    setGridDataWrittenDate: function (e, data) {
        var option = {};
        option.data = ecount.infra.getECDateFormat('date11', false, data.WRITE_DT.toDatetime());
        return option
    },

    setGridDataHistoryStatus: function (e, data) {
        var strState = "";

        if (data["HISTORY_STATUS"] == "I")
            strState = ecount.resource.LBL01770;  //신규
        else if (data["HISTORY_STATUS"] == "M")
            strState = ecount.resource.LBL01155;  //수정 

        var option = {};
        option.data = strState;
        return option
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
    },

    reloadPage: function () {
        this.onAllSubmitSelf({
            url: "/ECERP/Popup.Search/EPA030P",
            param: { }
        });

        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 그리드 포커스를 위한 함수
    gridFocus: function () { }
});
