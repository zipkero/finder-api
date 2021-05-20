window.__define_resource && __define_resource("LBL07736","MSG07415");
/****************************************************************************************************
1. Create Date : 2017.01.18
2. Creator     : 김정수
3. Description : 시리얼/로트 선택 팝업창 - new
4. Precaution  :
5. History     : 이일용 (2017-10-26) 창고수량항목 제거
                 
****************************************************************************************************/

/*--- ES028P.js ---*/
ecount.page.factory("ecount.page.popupSerial", "ES028P", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    url: "/ECERP/Popup.Search/ES028P",
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this._super.initProperties.apply(this, arguments);
    },

    render: function ($parent) {
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(this.PROD_DES + '  ' + ecount.resource.LBL07736)
                .add("search", null, true).useQuickSearch();
    },

    onInitContents: function (contents, resource) {
        this._super.initContents.apply(this, arguments);
    },

    onInitFooter: function (footer, resource) {
        this._super.initFooter.apply(this, arguments);
    },
    
    onLoadComplete : function(event){
        this._super.loadComplete.apply(this);

        if (this.viewBag.LocalTime.toDate().format("yyyy-MM-dd HH:mm:ss") > "2017-11-02 09:00:00" && this.viewBag.LocalTime.toDate().format("yyyy-MM-dd HH:mm:ss") < "2017-11-13 18:00:00") {
            // 공지사항 띄우기
            if ($.cookie("32160") != "done") {
                var url = ecount.common.buildSessionUrl("/ECERP/SVC/EAM/EAM012M") + "&boardType=M&MenuType=0&seq=2160&showDaily=Y";
                var hwnd = window.open(url, 2160, 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=800,height=600');
                if (hwnd != null)
                    hwnd.focus();
            }
        };

        if (!event.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        };        

        // 재집계를 실행 해야 하지만 실행 시간이 되지 않을때 메세지 처리
        if (this.CHECKBALANCEYN == "Y") {
            ecount.alert(String.format(ecount.resource.MSG07415, this.CHECKBALANCE_DATE));
        }
    },

    onGridRenderBefore: function (gridId, settings) {
        var _self = this;
        var gridID = ("dataGrid" + this.pageID);
        _self.searchFormParameter["CALL_TYPE"] = 1;
        settings.setPagingIndexChanging(function (e, data) {            
            _self.contents.getGrid(gridID).grid.settings().setPagingCurrentPage(data.pageIndex);
            _self.contents.getGrid(gridID).draw(_self.searchFormParameter);
            /*_self.contents.getGrid(gridID).grid.render();*/ /*검색값을 다시 바인딩하기 위해서 주석처리-체크박스를 풀어서 페이징시 정상동작안함 오류 수정*/
        });
    }
});
