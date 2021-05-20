
/****************************************************************************************************
1. Create Date : 2015.11.11
2. Creator     : 정나리
3. Description : Common File Download.
4. Precaution  :
5. History     :
6. MenuPath    : 고객센터 > PDF 파일 다운로드
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "FileDownloadPage", {

    header: null,

    contents: null,

    footer: null,

/**************************************************************************************************** 
* page initialize
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
    },


/****************************************************************************************************
* UI Layout setting
* http://test.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5kuZ6SJG4&pageId=page-preInit
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-contents
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.setTitle("File Download");
    },

    onInitContents: function (contents, resource) {
        window.location = ecount.common.buildSessionUrl(this.DownloadURL);
    },


/**************************************************************************************************** 
* define common event listener
* http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
****************************************************************************************************/

    onMessageHandler: function (sender, message) {

    }
});