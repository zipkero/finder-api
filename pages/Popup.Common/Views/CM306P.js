$(function () {
    var postData = {};
    var viewBag = window["viewBag" + window.__EC_PAGE_ID];
    postData['PostData'] = viewBag.DefaultOption.PostData;

    ecount.common.submit(viewBag.DefaultOption.RetUrl, postData);
});
