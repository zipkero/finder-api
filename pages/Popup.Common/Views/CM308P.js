window.__define_resource && __define_resource("LBL04743","LBL03174","LBL12174","LBL12173","LBL01043","LBL12175","LBL06965","LBL09012","LBL18477","MSG05723","MSG05724","BTN00065","BTN00033","BTN00008","MSG00474","MSG04346","MSG00644");
/****************************************************************************************************
1. Create Date : 2015.11.18
2. Creator     : 설택근
3. Description : 회사로고/도장 설정 팝업
4. Precaution  :
5. History     : 2019.11.06 (Nguyen Duc Thinh) A19_02866 탭에 메뉴명 나타내면서 회사코드 여러개 사용하는 경우 회사로고를 탭에 보여주기
                        2019.11.06 (Nguyen Duc Thinh) A19_02866 탭에 메뉴명 나타내면서 회사코드 여러개 사용하는 경우 회사로고를 탭에 보여주기 rollback
                        2019.11.12 (Nguyen Duc Thinh) A19_02866 탭에 메뉴명 나타내면서 회사코드 여러개 사용하는 경우 회사로고를 탭에 보여주기
                        2020-05-27(ThanhSang): A20_01940_권한세분화 선작업_나머지메뉴 적용 (SC설정)
****************************************************************************************************/
 
ecount.page.factory("ecount.page.popup.type2", "CM308P", {

    pageID: null,
    header: null,
    contents: null,
    footer: null,
    off_key_esc: true,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    wLimit: 0,
    hLimit: 0,
    isOldLogo: "false",
    tmpUrl: "",
    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.wLimit = this.viewBag.DefaultOption.w;
        this.hLimit = this.viewBag.DefaultOption.h;
        this.tmpUrl = this.viewBag.DefaultOption.tmpUrl;

        if (this.viewBag.DefaultOption.ttres == "LBL04743") { // 도장인 경우
            switch (ecount.company.INNER_GYESET_CD) { // 중국 코드로 들어온 경우 (ZA021, ZA022)
                case "ZA021":
                case "ZA022":
                    this.wLimit = 160;
                    this.hLimit = 160;
                    break;
                default:
                    this.wLimit = this.viewBag.DefaultOption.w;
                    this.hLimit = this.viewBag.DefaultOption.h;
                    break;
            }
        }

        if (this.viewBag.InitDatas.isExist)
            this.strSavedRoot = this.viewBag.InitDatas.dp;

        if (this.viewBag.DefaultOption.ttres == "LBL03174") // 로고인 경우
            this.isOldLogo = this.viewBag.DefaultOption.isOldLogo.toLowerCase() != "true" ? "false" : "true";

        if (this.viewBag.InitDatas.bCloseKind == "1") {
            if (ecount.parentFrame.objDHtml != null)
                ecount.parentFrame.objDHtml.close();
            else
                this.close();
        }
        this.registerDependencies(["pluploader", "widget.crop"]);
    },

    render: function () {        
            this._super.render.apply(this);
        
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark();
        var sTitle = "";
        switch (this.viewBag.DefaultOption.ttres) {
            case 'LBL03174':
                sTitle = ecount.resource.LBL03174;
                break;
            case 'LBL04743':
                sTitle = ecount.resource.LBL04743;
                break;
            case 'LBL12174': //LBL12174
                sTitle = String.format("{0}({1})", ecount.resource.LBL12173, ecount.resource.LBL12174);
                break;
            case 'LBL01043':
                sTitle = ecount.resource.LBL01043;
                break;
            case 'LBL12175':
                sTitle = String.format("{0}({1})", ecount.resource.LBL12173, ecount.resource.LBL12175);
                break;
            case 'LBL06965':
                sTitle = ecount.resource.LBL09012;
                break;
            case 'LBL18477':
                sTitle = ecount.resource.LBL18477;
                break;
        }
        header.setTitle(sTitle);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            layout = g.panel();

        var fileKey;

        if (this.viewBag.InitDatas.dp) {
            var dpArry = {};
            dpArry = this.viewBag.InitDatas.dp.split("/");
            fileKey = dpArry[dpArry.length - 1];
        }

        var sArrContents = new Array();

        sArrContents[0] = ecount.resource.MSG05723;

        if (this.viewBag.DefaultOption.isNotAfterResize != true) {
            sArrContents[1] = ecount.resource.MSG05724;
        }

        layout
            .add(
                ctrl.define("widget.list", "list", "list")
                    .setOrder(true)
                    .setOptions({
                        sArrContents: sArrContents
                })
                .wholeRow()
            )
            .add(
                 ctrl.define("widget.crop", "crop", "crop")
                    .setOptions({
                        isLogo: this.viewBag.InitDatas.isLogo,
                        wLimit: this.wLimit,
                        hLimit: this.hLimit,
                        sSavedRoot: this.strSavedRoot,
                        isExist: this.viewBag.InitDatas.isExist,
                        storageEndpoint: "/SaveTempFile/" + ecenum.tempfileLifetime.oneHour + "/" + encodeURIComponent([ecmodule.common.fileStorage.tempComCode, ecount.company.COM_CODE].join(ecount.delimiter)) + "/",
                        sTempFileRoot: "/ViewImage/" + ecenum.tempfileLifetime.oneHour + "/" + encodeURIComponent([ecmodule.common.fileStorage.tempComCode, ecount.company.COM_CODE].join(ecount.delimiter)) + "/",
                        uiwLimit: 410,
                        uihLimit: 290,
                        aWidth: 243,
                        isViewSizeInfo: true,
                        isAfterResize: this.isNotAfterResize ? false : true,
                        isUseDefaultBtn: true,
                        isOldLogo: this.isOldLogo,
                        tmpUrl: this.tmpUrl,
                        comCode: this.viewBag.COM_CODE,
                        fileKey: fileKey,
                        fileStorageHost: this.fileStorageHost || ecmodule.common.fileStorage.getFileStorageHost(0),
                        isNewFile: true,
                        autostart : false
                    })
            ).css("panel-inverse");
        //layout

        contents.add(layout);
    },
    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "delete").label(ecount.resource.BTN00033).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    onLoadComplete: function () {
        this.$el.find('#browse_file').click();

    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    // SAVE button click event
    onFooterSave: function () {
        var thisObj = this;
        var cropObj = this.contents.getControl('crop');
        var btnSave = this.footer.get(0).getControl("save");
        var flag = "";

        // validation
        if ($("#imgBeforeCropping").attr("src") == "") {
            ecount.alert(ecount.resource.MSG00474); // MSG00474 '자료가 없습니다'
            btnSave.setAllowClick();
            return false;
        }
        else {
            if (cropObj.isCropped != true) {
                ecount.alert(ecount.resource.MSG04346); // MSG04346 '영역을 지정하기 바랍니다.'
                btnSave.setAllowClick();
                return false;
            }
        }

        var selection = cropObj.cropObj.getSelection();
        var tempFileName;
        var tmpeFileNameArry = cropObj.strImgFilePath.split("/");
        tempFileName = tmpeFileNameArry[tmpeFileNameArry.length - 1];
        //필수값 순서유의
        var option = [
            ecenum.tempfileLifetime.oneHour,
            thisObj.viewBag.COM_CODE,
            cropObj.fileManager.initData.file_name,
            cropObj.fileKey,
            cropObj.fileManager.initData.owner_key,
            selection.x1,
            selection.y1,
            selection.width,
            selection.height,
            cropObj.xsize,
            cropObj.ysize
        ];

        cropObj.cropSave(option, function (result) {
            if (!result || result.Data == "Error") {
                ecount.alert("Error");
            }
            else {
                ecount.common.api({
                    url: "/SelfCustomize/Info/SaveLogoSign",
                    data: Object.toJSON({
                        SourcePath: cropObj.strImgFilePath,
                        CropX: selection.x1,
                        CropY: selection.y1,
                        CropWidth: selection.width,
                        CropHeight: selection.height,
                        TargetWidth: cropObj.xsize,
                        TargetHeight: cropObj.ysize,
                        EncPath: thisObj.viewBag.DefaultOption.ep,
                        flag: thisObj.viewBag.DefaultOption.fl,
                        CheckPermissionRequest: thisObj.CheckPermissionRequest
                    }),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else { // 성공

                            var locObj = window.location;

                            thisObj.setTimeout(function () {
                                var strIsOld;
                                if (thisObj.viewBag.DefaultOption.ttres == "LBL03174") { // 로고인 경우
                                    strIsOld = "false";
                                }

                                if (ecount.parentFrame.objDHtml != null) {
                                    var option = ["ViewImage", ecenum.tempfileLifetime.infinity, thisObj.viewBag.COM_CODE, cropObj.fileKey];
                                    var filePath = ecmodule.common.fileStorage._makeUrl(option, 0);

                                    ecount.parentFrame.fnChangeImage && ecount.parentFrame.fnChangeImage(filePath, cropObj.xsize, cropObj.ysize, strIsOld);
                                }
                                else {
                                    if (opener && opener.fnChangeImage) {
                                        opener.fnChangeImage(filePath, cropObj.xsize, cropObj.ysize, strIsOld);
                                        thisObj.close();
                                    }
                                }

                                if (ecount.parentFrame.objDHtml != null) {
                                    ecount.parentFrame.objDHtml.close();
                                }
                                else {
                                    if (!(opener && opener.fnChangeImage)) {
                                        var message = {
                                            fileKey: cropObj.fileKey,
                                            xSize: cropObj.xsize,
                                            ySize: cropObj.ysize,
                                            isDel: false,
                                            callback: thisObj.close.bind(thisObj),
                                            flag: thisObj.viewBag.InitDatas.fl,
                                            fileName: cropObj.fileManager.initData.file_name,
                                            owner_key: cropObj.fileManager.initData.owner_key,
                                            isAWS: true
                                        };
                                        thisObj.sendMessage(thisObj, message);
                                    }
                                }
                            }, 0);
                        }
                    }
                });
            }
        });
    },

    // DELETE button click event
    onFooterDelete: function (e) {
        var thisObj = this;
        var btnDelete = thisObj.footer.get(0).getControl("delete");

        var data = {
            EncPath: this.viewBag.DefaultOption.ep
        }
        //한번 지워진 자료는 복구 될 수 없습니다.\n\n삭제하겠습니까?
        ecount.confirm(ecount.resource.MSG00644, function (status) {
            if (status === true) {

                var fileName;
                var arrFileName = thisObj.viewBag.InitDatas.dp.split("/");
                if (arrFileName.length > 0) {
                    fileName = arrFileName[arrFileName.length - 1];
                }

                var option = [
                    ecenum.tempfileLifetime.infinity,
                    thisObj.viewBag.COM_CODE,
                    fileName
                ];

                var cropObj = thisObj.contents.getControl('crop');
                cropObj.deleteImage(option, function (result) {
                    if (result.Data != "true") {
                        ecount.alert("Error");
                    }
                    else {                        
                        data.CheckPermissionRequest = thisObj.CheckPermissionRequest;
                        ecount.common.api({
                            url: "/SelfCustomize/Info/DeleteLogoSign",
                            data: Object.toJSON(data),
                            success: function (result) {
                                if (result.Status != "200")
                                    ecount.alert(result.fullErrorMsg);
                                else {

                                    thisObj.setTimeout(function () {
                                        if (ecount.parentFrame.objDHtml != null) {
                                            ecount.parentFrame.fnChangeImage();
                                            ecount.parentFrame.fnDeleteImgMessage();
                                        }
                                        else {
                                            if (opener && opener.fnChangeImage) {
                                                opener.fnChangeImage();
                                                opener.fnDeleteImgMessage();
                                                thisObj.close();
                                            }
                                        }

                                        if (ecount.parentFrame.objDHtml != null) {
                                            ecount.parentFrame.objDHtml.close();
                                        }
                                        else {
                                            if (!(opener && opener.fnChangeImage)) {
                                                var message = {
                                                    imgFilePath: "",
                                                    isDel: true,
                                                    callback: thisObj.close.bind(thisObj),
                                                    flag: thisObj.viewBag.InitDatas.fl
                                                }
                                                thisObj.sendMessage(thisObj, message);
                                            }
                                        }
                                    }, 0);
                                }
                            }
                        });
                    }
                });
            } else {
                btnDelete.setAllowClick();
            }
        });
    },

    // CLOSE button click event
    onFooterClose: function () {
        //this.close();
        if (ecount.parentFrame.objDHtml != null) {
            ecount.parentFrame.objDHtml.close();
        }
        else {
            this.close();
        }
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function () {
        this.onFooterSave();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/

});