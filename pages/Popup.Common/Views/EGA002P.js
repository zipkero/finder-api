window.__define_resource && __define_resource("LBL00229","LBL03086","MSG03407","MSG03901","MSG00957","MSG04805","BTN00065","BTN00008");
/****************************************************************************************************
1. Create Date : oooo.oo.oo
2. Creator     : OOO
3. Description : Main > SMS / 메인 > SMS
4. Precaution  : 
5. History     :  2019.04.04 (배세은) 명함수정 3.0 API 호출
                  2019.04.23 (문요한) 거래처수정 3.0 API 호출
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type1", "EGA002P", {

    modifyType: '',
    param: '',
    hpNo: '',
    custDes: '',

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();

        this.modifyType = this.ModifyType;
        this.param = this.Param;
        this.hpNo = this.HpNo;
        this.custDes = this.CustDes;
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

        var title = ecount.resource.LBL00229;

        header.notUsedBookmark()
              .setTitle(title);
    },
    //본문 옵션 설정(content option setting)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            ctrl = generator.control(),
            form1 = generator.form();

        var txtModifyMobile = ctrl.define("widget.input.codeName", "txtModifyMobile", "HP_NO", ecount.resource.LBL03086)
                            .popover(ecount.resource.MSG03407).dataRules(["required"], ecount.resource.MSG03901)
                            .filter("maxbyte", { message: String.format(ecount.resource.MSG00957, "50"), max: 50 })
                            .filter('numberOnlyAndSign', { message: ecount.resource.MSG04805, reg: '-' })
                            .value(this.hpNo)
                            .end();
        form1.add(txtModifyMobile);
        contents.add(form1);
    },
    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();        
        toolbar
            .attach(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).css("btn btn-primary"))
            .attach(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },
    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //닫기버튼
    onFooterClose: function () {        
        this.close();
        return false;
    },

    //Save(저장)
    onFooterSave: function (e) {
        this.dataSave();  //SaveAndPopupClose(저장/팝업닫기)
    },

    //SaveFunction(저장 함수)
    dataSave: function () {
        this.showProgressbar();

        var _success = true;                                                                //Validity check success of each stage(각 단계별 유효성체크 성공여부)

        //1. Permission(권한체크)

        if (_success) {

            var formData = this.contents.serialize().merge();
            
            var dataURL = '';
            var pram = {};
            if (this.modifyType == "E") {
                dataURL = "/Manage/HR/UpdateInsa001OfMobile";
                pram = {
                    EmpCd: this.param,
                    HpNo: formData.HP_NO
                };
            }
            else if (this.modifyType == "C") {
                dataURL = "/SVC/Account/Basic/UpdateCustOfMobile";                
                pram = {
                    Data: {
                        BusinessNo: this.param,
                        CustDes: this.custDes,
                        HpNo: formData.HP_NO
                    }
                };
            }
            else {
                dataURL = "/SVC/Groupware/CRM/UpdateEgCardCommentOfMobile";
                pram = {               
                    Data: {
                        SerNo: this.param,
                        HpNo: formData.HP_NO
                    }
                };
            }

            //저장 API호출
            ecount.common.api({
                url: dataURL,
                data: Object.toJSON(pram),
                error: function (e, status, messageInfo) {
                    ecount.alert(messageInfo.Message, function () {
                        this.hideProgressbar();
                        this.footer.getControl("save").setAllowClick();
                    }.bind(this));
                }.bind(this),
                success: function (result) {                    
                    this.sendMessage(this, {});
                    this.setTimeout(function () {                        
                        this.close();
                    }.bind(this), 0);

                }.bind(this)
            });

        }

    }
});
