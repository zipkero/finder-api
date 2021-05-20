window.__define_resource && __define_resource("MSG04442","MSG04446","BTN00026","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.10.20
2. Creator     : Unknown
3. Description : 회계1 > (세금)계산서진행단계 > 종류 변경
4. Precaution  : 
5. History     : 2020.06.08 (tuan) Authorization PreJob - A20_01930_Auth_Account01
6. MenuPath    :
7. Old File    :
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ECTAX023P_01", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    pagePermission: null,

    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.pagePermission = this.viewBag.InitDatas.Permission;
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
        header.setTitle("세금(계산서)종류변경");
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        
        var generator = widget.generator,
            ctrl = generator.control(),
            form = generator.form();

        //입력에서 필수 설정해야 함
        form.template("register");

        form.add(ctrl.define("widget.code.ectaxflagone", "txtEctaxFlag", "ECTAX_FLAG", "세금(계산서)종류")
            .maxSelectCount(1).popover("세금(계산서)종류를 선택합니다.")
            .dataRules(["required"], "세금(계산서)종류를 입력 바랍니다.")
            .codeType(7).end());

        form.add(ctrl.define("widget.input.general", "txtOrgIssue", "ORG_ID_ISSUE", "당초승인번호")
                    .popover(ecount.resource.MSG04442)
                    .filter("maxlength", { message: String.format(ecount.resource.MSG04446, "24", "24"), max: 24 })
                    .value(this.ORG_ID_ISSUE).end());
        

        //폼추가
        contents.add(form);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "modify").label(ecount.resource.BTN00026));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getControl("txtEctaxFlag").addCode({
            label: this.ECTAX_FLAG_DES, value: this.ECTAX_FLAG
        });
        if (this.ECTAX_FLAG != "00" && this.ECTAX_FLAG != "99") {
            this.contents.showRow("txtOrgIssue");
        } else {
            this.contents.hideRow("txtOrgIssue");
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    
    onMessageHandler: function (page, param) {
        switch (page.pageID) {
            case 'ECTAX023P_04':
                if (param.data.ITEM1 != "00" && param.data.ITEM1 != "99") {
                    this.contents.showRow("txtOrgIssue");
                } else {
                    this.contents.hideRow("txtOrgIssue");
                    this.contents.getControl('txtOrgIssue').hideError();
                }
                this.contents.getControl('txtOrgIssue').reset();
                break;
            case 'NoticeCanNotSlips':
                this.hideProgressbar();
                this.close();
                break;
        }
        
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },

    //적용버튼
    onFooterModify: function (e) {        
        var _returnSeletedData = [{            
                'IO_DATE': this.IO_DATE,
                'IO_NO': this.IO_NO,
                'SlipIssueType': this.S_SYSTEM,
                'VersionNo': this.VERSION_NO
            }];
        ecount.alert("수정사유 변경시 적요란을 확인해 주세요.", function () {

            if (this.contents.getControl('txtEctaxFlag').getSelectedCode()[0] != "00" && this.contents.getControl('txtEctaxFlag').getSelectedCode()[0] != "99") {

                var pattern = /^[a-z0-9+]*$/,
                    CheckValue = this.contents.getControl("txtOrgIssue").getValue();
                if (CheckValue.length == 0) {
                    this.contents.getControl("txtOrgIssue").showError('수정(세금)계산서 발행 시 당초승인번호는 필수입력사항입니다.');
                    this.contents.getControl('txtOrgIssue').setFocus(0);
                    return false;
                }
                else if (CheckValue.length < 24 || !pattern.test(CheckValue)) {
                    this.contents.getControl("txtOrgIssue").showError(ecount.resource.MSG04446);
                    this.contents.getControl('txtOrgIssue').setFocus(0);
                    return false;
                } 
            }


            this.showProgressbar();

            ecount.common.api({
                url: '/Account/ETaxInvoice/ECTAXEtcProcessing',
                data: Object.toJSON({
                    RequestSlips: _returnSeletedData,
                    List_Type: 'AA',
                    Action_Type: this.contents.getControl('txtEctaxFlag').getSelectedCode()[0],
                    Org_Id_Issue: this.contents.getControl('txtOrgIssue').getValue(),
                    CheckPermissionRequest: {
                        EditMode: ecenum.editMode.new,
                        ProgramId: "E010849",
                    }
                }),
                error: function (e, Status, error) {
                    
                    if (Status != "200") {
                        ecount.alert('세금(계산서)종류변경 처리 시 Error', function () {
                            this.footer.getControl('modify').setAllowClick();
                            this.hideProgressbar();
                        }.bind(this));
                    } else {
                        this.footer.getControl('modify').setAllowClick();
                        this.hideProgressbar();
                    }
                }.bind(this),
                success: function (result) {
                    
                    var _filteringData = result.Data.where(function (x) {
                        return x.Error_Flag == 'Y';
                    });

                    if (_filteringData.length == 0) {
                        this.sendMessage(this, { eventID: 'setOrgIssue' });
                    } else {
                        var _data = this.setDataCustom(_filteringData);
                        var param = {
                            name: 'frmDetail',
                            width: 650,
                            height: 500,
                            Result_Datas: _data,
                            popupType: false,
                            additional: false
                        };

                        this.setTimeout(function () {
                            this.openWindow({
                                url: '/ECERP/ECTAX/NoticeCanNotSlips',
                                param: param
                            });
                        }.bind(this), 0)
                    }
                }.bind(this)
            });

        }.bind(this));
    },


    //첨부불가 이력 Data 가공
    setDataCustom: function (_data) {
        var _result = [];

        _data.forEach(function (A) {
            var _customObject = {
                IO_DATE: String.format('{0}/{1}/{2}', A.IO_DATE.substring(0, 4), A.IO_DATE.substring(4, 6), A.IO_DATE.substring(6, 8)),
                IO_NO: A.IO_NO,
                ERROR_MESSAGE: A.ResultAttachmentECTAX.select(function (X) {
                    return X.Error_Message
                })
            };
            _result.push(_customObject);
        });

        return _result.toJSON();
    },

    //닫기버튼
    onFooterClose: function () {
        this.close();
    },

});
