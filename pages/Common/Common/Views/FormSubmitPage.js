/****************************************************************************************************
1. Create Date : 2017.08.13
2. Creator     : 윤국한
3. Description : 리다이렉션시 form 형태로 데이터를 submit하는 경우 사용하는 중간 페이지
4. Precaution  :
5. History     : 
****************************************************************************************************/

$(function () {
    var postData = {};
    debugger;
    var viewBag = window["viewBag" + window.__EC_PAGE_ID] || window["viewBag"];
    postData[viewBag.DefaultOption.DataType] = viewBag.DefaultOption.PostData;

    ecount.common.submit(viewBag.DefaultOption.RetUrl, postData);
});

