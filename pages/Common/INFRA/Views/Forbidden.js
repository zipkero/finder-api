window.__define_resource && __define_resource("LBL04441");
/****************************************************************************************************
1. Create Date : 2015.11.19
2. Creator     : 소병용
3. Description : 권한없음.
4. Precaution  :
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "Forbidden", {
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        
    },

    render: function () {
        this._super.render.apply(this);
    },
    onInitHeader: function (header, resource) {
        header.setTitle($.isEmpty(this.viewBag.InitDatas.Title) ? ecount.resource.LBL04441 : this.viewBag.InitDatas.Title);
    },

    onInitContents: function (contents, resource) {
        
    },
    onInitFooter: function (footer, resource) {
    },

    onLoadComplete: function () {
        //팝업으로 열릴 경우 리사이즈
        if (this.parentPageID) {
            this.resizeLayer(560, 400);
            $(".wrapper-page-blocked").css("top", "15%");
            //for all in one 1,2
            var fnParent = parent[this.parentPageID];
            if (fnParent && fnParent.fnParentHideProgressBar && (!$.isEmpty(fnParent.currentCustCd) || !$.isEmpty(fnParent.currentProdCd)))
                this.setTimeout(fnParent.fnParentHideProgressBar(), 100); // Call function main page hide progress bar(Gọi hàm cho page chính đóng layer loadding)
        }

        $("#pageBlocked").css("display", "block");
    }
});