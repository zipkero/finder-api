window.__define_resource && __define_resource("LBL07973","BTN00170","BTN00133","LBL18500","LBL03137","BTN00715","LBL06761","LBL05512","LBL06804","LBL06763","LBL10279","LBL05066","LBL09995","LBL09996","MSG02323","MSG04522","LBL09258","MSG09655","MSG09028","MSG02308","MSG02306","MSG02307","MSG01688","LBL01423","MSG07835","MSG07698");
/****************************************************************************************************
1. Create Date : 2018.07.31
2. Creator     : Phi Ta
3. Description : Tax > Payment Record
4. Precaution  : 
5. History     : 2018.07.11 (이현택) - ESG022M_NOAUTHAction 호출 시 파라미터 strLanguage를 전달            
                 2019.2.25 (mijin yang) - dev progress 19567 비밀번호 확인창 신규프레임웍으로 연결
                 2019.05.11 (LAP) - A19_01306
                 2019.11.14 (정준호) - A19_03368 '수신자확인 전' 워터마크 추가
                 2020.05.08 (김봉기) - A20_01341 이메일 수신문서 인쇄시 양식 불러오는 로직 변경 관련 수정
                 2020.07.21 (왕승양) - 화피아오 doc_gubun분리 49
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "CM302R", {
    printContent: "",
    printPageSet: null,
    currentPage: 1,
    printCompleteFlag: false,   //프린트 완료 여부
    param_info: {
        SESSION_ID: "", // 가상세션키
        com_code: "",   // 회사코드
        io_date: "",    // 전표날짜
        io_no: "",      // 전표번호
        tax_gubun: "",  // 
        doc_gubun: "",  // 문서구분
        trx_type: "",   // 테이블구분
        ser_no: "",     // 문서번호
        p_email: "",    // 수신 메일주소 (받는 사람)
        editFlag: "",   // 에디트구분
        c_native_num: "",   // 고유키
        emn_flag: "",
        s_cust_des: "", // 거래처 이름
        s_mail: "", //  발신 메일주소 (보낸 사람)
        s_tel: "",  // 전화번호
        strLanguage: "",    // 언어
        why: "",    // 사유
        approval_value: "",
        nts_statecode: "",   // 국세청전송여부
        form_Type: "",
        form_Ser: "",
        notiYn: "",
        status_yn: "", //현황에서 오픈여부

    },

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        ecount.resource.dialog.NOTICE = this.viewBag.InitDatas.LBL07973;
        ecount.resource.dialog.OK = this.viewBag.InitDatas.BTN00170;
        ecount.resource.dialog.CANCEL = this.viewBag.InitDatas.BTN00133;
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    onInitHeader: function (header) {
        header.disable();
    },



    onInitContents: function (contents) {
        if (this.IsNewFormType) {
            this.viewBag.FormInfos.PageSet = this.getInitXFormViewModel(this.form_Type);
        }

        if (this.viewYn == "N" || this.userPayPassYN == "Y" || this.eTxtFlag == "N" || this.isNewPage == "N" || this.eTaxLoadFlag == null) {
            return;
        }

        var g = widget.generator;
        var panel = g.panel();
        var hToolbar = g.toolbar();
        var cToolbar = g.toolbar();
        var ctrl = g.control();

        this.printContent = this.trxContents.replace(/margin-left:auto;/, "margin:0 auto;").replace(/wrapper-print hide/g, "wrapper-print");

        // 수신자확인 전 추가 로직 (wrapper-print-content마다 추가)
        var startIdx = this.printContent.indexOf('<div class="wrapper-print-content grid-wrapper-print-content');

        if (this.status_yn == "Y") {
            startIdx = this.printContent.indexOf('__ecGridContainer  position-relative wrapper-grid');
        }
        
        if ((this.agreeFlag != '1' && ['45', '49'].contains(this.doc_gubun) && this.sc_emailmgnt_flag == '1' && this.submit_status != 'C') // 전자세금계산서 인증서첨부전 sc설정 사용 : 확인기준
            || (this.agreeFlag != '1' && !['45', '49'].contains(this.doc_gubun) && this.doc_gubun != '44') // 전자세금계산서, 매출청구서 외 나머지 메뉴 : 확인 기준
            || (this.agreeFlag == '0' && ['45', '49'].contains(this.doc_gubun) && this.sc_emailmgnt_flag == '0' && this.submit_status != 'C') // 전자세금계산서 인증서첨부전 sc설정 사용안함 : 열람기준
            || (this.agreeFlag == '0' && this.doc_gubun == '44')) { // 매출청구서 : 열람기준

            while (startIdx != -1) {
                var endIdx = this.printContent.indexOf('>', startIdx);
                var frontContents = this.printContent.substr(0, endIdx + 1);
                this.printContent = this.printContent.replace(frontContents, frontContents + '<div class="print-watermark"><span>' + this.viewBag.InitDatas.LBL18500 + '</span></div>');
                startIdx = this.printContent.indexOf('<div class="wrapper-print-content grid-wrapper-print-content', endIdx);
            }
        }

        this.printContent = this.printContent.replace(/<NSNDD_ACSH_EMAIL_MGNT_TF>.*<\/NSNDD_ACSH_EMAIL_MGNT_TF>/g, "");

        if (['45', '49'].contains(this.doc_gubun) || this.doc_gubun == "44" || this.doc_gubun == "47" || this.doc_gubun == "48") {
            this.printContent = "<center>" + this.printContent + "</center>";
        }

        hToolbar.addRight(ctrl.define("widget.button.paging", "btnPaging").css("btn btn-default btn-width-auto").setPagingInfo(1, 1));


        if (this.btnOk_YN == "Y") { // 확인 버튼
            hToolbar.addLeft(ctrl.define("widget.button", "btnOk").label(this.viewBag.InitDatas.LBL03137));
        }

        if (this.btnSetPrice_YN == "Y") {   // 단가계산 버튼
            hToolbar.addLeft(ctrl.define("widget.button", "btnSetPrice").label(this.viewBag.InitDatas.BTN00715));
        }

        // Deny
        if (this.btnConfirm_YN == "Y") {    // 검토 버튼
            hToolbar.addLeft(ctrl.define("widget.button", "btnConfirm").label(this.viewBag.InitDatas.LBL06761));
        }

        if (this.btnXML_YN == "Y") {
            hToolbar.addLeft(ctrl.define("widget.button", "btnXml").label("XML"));
        }

        // print
        if (this.btnPrint_YN == "Y") {
            hToolbar.addLeft(ctrl.define("widget.button", "btnPrint").label(this.viewBag.InitDatas.LBL05512)).css("btn btn-default");
        }

        // PDF
        if (this.btnPdf_YN == "Y") {
            hToolbar.addLeft(ctrl.define("widget.button", "btnPdf").label(this.viewBag.InitDatas.LBL06804));
        }

        // Undo Confirmation
        if (this.btnConfirmCancel_YN == "Y") {  // 검토취소 버튼
            hToolbar.addLeft(ctrl.define("widget.button", "btnConfirmCancel").label(this.viewBag.InitDatas.LBL06763));
        }

        // msg undo confirm
        if (this.msgUndoConfirm_YN == "Y")
            hToolbar.addLeft(ctrl.define("widget.label", "unconfirm").label(ecount.resource.LBL10279));

        // 문구 셋팅
        if (this.msgConfirm_YN == "Y") {    // 문구 검토요청중인 문서입니다
            hToolbar.addLeft(ctrl.define("widget.label", "msgConfirm").label(this.viewBag.InitDatas.LBL06761));
        }
        if (this.msgConfirmCancel_YN == "Y") {  // 문구 확인취소 요청중인 문서입니다.
            hToolbar.addLeft(ctrl.define("widget.label", "msgConfirmCancel").label(this.viewBag.InitDatas.LBL06763));
        }

        if (this.pFlag != "1") {
            cToolbar.addRight(ctrl.define("widget.button", "btnPrintControl").css("btn btn-sm btn-default").label("※ " + this.viewBag.InitDatas.LBL05066 + " [" + this.viewBag.InitDatas.LBL09995 + "]"));
        }

        if (this.errorContent_YN == "N") {
            panel.add(g.div().css("received-documents").html(this.printContent));
        }
        else {
            panel.add(g.div().css("received-documents").html(this.msgErrorContent));
        }
        panel.add(cToolbar);
        panel.add(g.divContainer().css("page-received-documents").add(ctrl.define("widget.button.sidePaging", "sidePaging")
            .wrapperCss("slip-page-control").hasWrapperSet(false)));
        
        panel.footer({ layout: [hToolbar] });

        var pnlWrapper = g.divContainer();
        pnlWrapper.css("panel-back");
        pnlWrapper.add(g.div().css("clip")).add(panel);
        pnlWrapper.add(g.div().css("overlap-paper").style("width: 100% !important"));

        if (this.foreignYn == "00") {
            pnlWrapper.add(g.div().html(this.footerInfo_kr));
        } else {
            pnlWrapper.add(g.div().html(this.footerInfo_etc));
        }

        contents.add(pnlWrapper);
    },

    onContentsSidePaging: function(e) {
        this.onContentsBtnPaging(e);
        var btnPaging = this.contents.getControl("btnPaging");
        btnPaging._changeCurrentPageAutomatically(e.buttonType);
    },

    onContentsBtnPaging: function (e) {
        var type = e.buttonType;

        switch (type) {
            case "Next":
                if (this._printPagingHelper) {
                    this.currentPage = this._printPagingHelper.setNext();
                }
                break;
            case "Last":
                if (this._printPagingHelper) {
                    this.currentPage = this._printPagingHelper.setPage(this._printPagingHelper.totalPageCount);
                }
                break;
            case "Previous":
                if (this._printPagingHelper) {
                    this.currentPage = this._printPagingHelper.setPrev();
                }
                break;
            case "First":
                if (this._printPagingHelper) {
                    this.currentPage = this._printPagingHelper.setPage(1);
                }
                break;

        }
    },

    onInitFooter: function (footer) {
        if (this.viewYn == "N" || this.userPayPassYN == "Y" || this.eTxtFlag == "N" || this.isNewPage == "N" || this.eTaxLoadFlag == null) {
            return;
        }
    },

    // Message Handler
    onMessageHandler: function (page, callback) {
        switch (page.pageID) {
            case "PdfSetUp":
                var option = {
                    gridWidth: this.mainWidth,
                    htmlContent: this.pdfHtml,
                    author: 'ECOUNT',
                    keywords: 'CM302R',
                    subject: 'CM302R',
                    title: 'CM302R'
                };
                callback(option);
                break;
            case "PrintPage":
                var option = {
                    gridWidth: this.mainWidth,
                    htmlContent: this.printContent,
                    printCss: this.printPageSet.printCss
                }
                callback(option);
                break;
            case "CM302P_01":
                this.reloadPage();
                break;
        }

        if (page.pageID == "ESD023P_02") {
            this.reloadCancelPage(callback.G_TEXT);
        }
    },

    // 최적화 프로그램 다운로드
    onContentsBtnPrintControl: function () {
        var agent = navigator.userAgent.toLowerCase();
        var strUrl = "";

        if (((navigator.appName == 'Netscape' && agent.search('trident') != -1) || agent.search('msie') != -1)) {
            if (location.href.indexOf("http://") > -1) {
                strUrl = "http://ucloud.ecounterp.com/Download/IE_Opt/EcountRegSet.exe";
            } else {
                strUrl = "https://ucloud.ecounterp.com/Download/IE_Opt/EcountRegSet.exe";
            }
        } else if (agent.indexOf("chrome") > -1 && agent.indexOf("opr") == -1) {
            if (location.href.indexOf("http://") > -1) {
                strUrl = "http://ucloud.ecounterp.com/Download/IE_Opt/EcountChromeSet.exe";
            } else {
                strUrl = "https://ucloud.ecounterp.com/Download/IE_Opt/EcountChromeSet.exe";
            }
        } else {
            ecount.alert(this.viewBag.InitDatas.LBL09996);
            return;
        }
        this.DOWNLOAD_FILE({
            downloadURL: strUrl
            , callback: function () {

                //callback 함수
            }.bind(this)
        });
    },

    // 단가내기
    onContentsBtnSetPrice: function (e) {
        var param = {
            width: 800,
            height: 600
        }

        if (this.estDelYn == "Y") {
            ecount.alert(this.viewBag.InitDatas.MSG02323);
            return;
        }
        if (this.estPFlag == "9") {
            ecount.alert(this.viewBag.InitDatas.MSG04522);
            return;
        }

        var param = {
            Request: {
                Key: {
                    Date: this.io_date,
                    No: this.io_no
                },
                UIOption: {
                    Width: 920,
                    Height: 650
                },
                Data: {
                    CUST: this.cust_cd,
                    isPriceComparison: true,
                    isFromEmail: true,
                },
                EditMode: ecenum.editMode.modify,
                FromProgramId: "E040323",
                isSaveOnly: true
            }
        };

        this.openWindow({
            url: "/ECERP/SVC/ESG/ESG022M?Language=" + this.strLanguage,
            name: ecount.resource.LBL09258,
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    // 인쇄하기
    onContentsBtnPrint: function (e) {
        var _self = this;

        if ((this.agreeFlag != '1' && ['45', '49'].contains(this.doc_gubun) && this.sc_emailmgnt_flag == '1' && this.submit_status != 'C') // 전자세금계산서 인증서첨부전 sc설정 사용 : 확인기준
            || (this.agreeFlag != '1' && !['45', '49'].contains(this.doc_gubun) && this.doc_gubun != '44') // 전자세금계산서, 매출청구서 외 나머지 메뉴 : 확인 기준
            || (this.agreeFlag == '0' && ['45', '49'].contains(this.doc_gubun) && this.sc_emailmgnt_flag == '0' && this.submit_status != 'C') // 전자세금계산서 인증서첨부전 sc설정 사용안함 : 열람기준
            || (this.agreeFlag == '0' && this.doc_gubun == '44')) { // 매출청구서 : 열람기준

            ecount.alert(this.viewBag.InitDatas.MSG09655);
        }

        if (this.printCompleteFlag) {
            return;
        }
        else {
            this.searial = 0;
            this.printContent = this.printContent.replace(/text-primary-inverse/g, "bsy").replace(/&quot;/gi, "");
            this.printContent = this.printContent.replace("<center>", "").replace("</center>", "").replace(/wrapper-print hide/g, "wrapper-print");

            //인쇄 세팅 후 실행
            var callback = function () {
                //인쇄                
                debugger;
                _self.printHtml = " <style type='text/css'>" + _self.printPageSet.printCss + "</style> " + _self.printContent;

                var option = {
                    url: "/ECERP/Popup.Common/PrintLoadPage",
                    destroyImmediately: false,
                    callback: function (page, destroyFrame) {
                        page.print(destroyFrame);

                    }.bind(_self),
                    loadHiddenPage: _self.loadHiddenPage.bind(_self),
                    data: {
                        gridWidth: _self.mainWidth,
                        htmlContent: _self.printHtml,
                        printCss: _self.printPageSet.printCss,
                        isContentAlignCenter: false,
                        isHeightReSize: true,
                        isOpenPopupPrint: false,
                        isAnotherPrint: true,
                        isBodyOnload: false,
                        contentsMargin: { top: 0, right: 0, bottom: 0, left: 0 },
                        printAlign: _self.printPageSet.printAlign
                    }
                }

                _self.EXPORT_PRINT(option);
            }; //this.exportPrint();
            this.GetPrintPageSet(callback);

            this.param_info.pFlag = "0";
            this.printCompleteFlag = true;  //인쇄버튼 중복클릭방지위한 설정값 (초기화는 ecount.page.js loadHiddenPage에서 초기화됨)



            //MAIL_CONFIRM 테이블에 PRINT_HIT 업데이트
            var data = {
                COM_CODE: this.com_code,
                C_NATIVE_NUM: this.c_native_num,
                DOC_GUBUN: this.doc_gubun,
                TRX_TYPE: this.trx_type,
                IO_DATE: this.io_date,
                IO_NO: this.io_no,
                SER_NO: this.ser_no,
                AGREE_FLAG: this.agreeFlag,
                P_EMAIL: this.p_email,
                GUBUN: "2"
            };

            ecount.common.api({
                url: "/Common/Infra/UpdateMailConfirm2",
                data: Object.toJSON(data),
                success: function (result) {
                }.bind(this)
            });
        }
    },

    // pdf 보기
    onContentsBtnPdf: function (e) {
        if ((this.agreeFlag != '1' && ['45', '49'].contains(this.doc_gubun) && this.sc_emailmgnt_flag == '1' && this.submit_status != 'C') // 전자세금계산서 인증서첨부전 sc설정 사용 : 확인기준
            || (this.agreeFlag != '1' && !['45', '49'].contains(this.doc_gubun) && this.doc_gubun != '44') // 전자세금계산서, 매출청구서 외 나머지 메뉴 : 확인 기준
            || (this.agreeFlag == '0' && ['45', '49'].contains(this.doc_gubun) && this.sc_emailmgnt_flag == '0' && this.submit_status != 'C') // 전자세금계산서 인증서첨부전 sc설정 사용안함 : 열람기준
            || (this.agreeFlag == '0' && this.doc_gubun == '44')) { // 매출청구서 : 열람기준

            ecount.alert(this.viewBag.InitDatas.MSG09655);
        }

        var _self = this;

        var callback = function () {
            //거래처관리대장만 예외처리
            debugger;
            if (_self.doc_gubun == "88") {
                _self.mainWidth = _self.ResizeWidth();
            }
            var option = {
                keywords: "CM302R",
                gridWidth: _self.mainWidth,
                pageSetup: _self.printPageSet,
                strLanguage: _self.strLanguage
            };

            _self.searial = 0;
            _self.pdfHtml = _self.printContent.replace(/text-primary-inverse/g, "bsy").replace(/&quot;/gi, "").replace(/wrapper-print hide/g, "wrapper-print");
            _self.EXPORT_PDF(option);
        };

        this.GetPrintPageSet(callback);
    },

    // xml 다운
    onContentsBtnXml: function (e) {
        var btn = this.contents.getControl("btnXml");
        var _data = {
            Request: {
                Data: {
                    COM_CODE: this.com_code,
                    IO_DATE: this.io_date,
                    IO_NO: this.io_no
                }
            }
        }

        ecount.common.api({
            url: "/SVC/Account/Common/GetAcc301ByIoNoKey",
            data: Object.toJSON(_data),
            success: function (result) {
                if (result.Status == "200") {
                    var today = new Date();
                    var submitDtIssue = result.Data.SUBMIT_DT_ISSUE.substring(0, 8);
                    var dateObj = new Date(submitDtIssue.substring(0, 4), Number(submitDtIssue.substring(4, 6)) - 1, submitDtIssue.substring(6, 8));
                    var betweenDay = (today.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24)

                    if (betweenDay >= 90) {
                        ecount.alert(ecount.resource.MSG09028);
                    } else {
                        this.param_info.idIssue = this.idIssue;
                        this.onAllSubmit({
                            url: "/ECMAIN/ECTAX/ECTAX011P_03.aspx",
                            param: this.param_info
                        });
                    }
                } else {
                    ecount.alert("Error");
                }

                btn.setAllowClick();
            }.bind(this),
        });
    },

    // 검토요청
    onContentsBtnConfirm: function () {

        ecount.confirm(this.viewBag.InitDatas.MSG02308, function (status) {
            if (status === false) return false;
            this.onOpenPop();
        }.bind(this));
    },

    // 확인
    onContentsBtnOk: function () {
        ecount.confirm(this.viewBag.InitDatas.MSG02306, function (status) {
            if (status === false) return false;

            this.param_info.editFlag = "ok";
            this.reloadPage();
        }.bind(this));
    },

    // 확인취소
    onContentsBtnConfirmCancel: function () {
        ecount.confirm(this.viewBag.InitDatas.MSG02307, function (status) {
            if (status === false) return false;

            this.onOpenPop();
        }.bind(this));
    },

    onOpenPop: function () {

        var param = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 220,
            popupType: true,
            responseID: this.callbackID,
            popupReasonType: "Not",
            COM_CODE: this.com_code,
            C_NATIVE_NUM: this.c_native_num,
            DOC_GUBUN: this.doc_gubun,
            strLanguage: this.strLanguage
        };

        var edit_flag;

        if (this.agreeFlag == "1") {
            if (this.doc_gubun == "44" || this.doc_gubun == "47") {
                edit_flag = "Return";
                this.param_info.editFlag = "Return";
            }
            else if (['45', '49'].contains(this.doc_gubun)) {
                if (this.submit_status == "C" || (this.submit_status != "C" && this.sc_emailmgnt_flag == "0")) {
                    this.param_info.editFlag = "Return";
                }
                else {
                    this.param_info.editFlag = "Cancel";
                }
            }
            else {
                edit_flag = "Cancel";
                this.param_info.editFlag = "Cancel";
            }
        }
        else {
            edit_flag = "Return";
            this.param_info.editFlag = "Return";
        }

        this.openWindow({
            url: '/ECERP/Popup.Common/ESD023P_02',
            name: "",
            param: param,
            popupType: false
        });
    },

    onLoadComplete: function () {

        this.param_info.SESSION_ID = this.SESSION_ID;
        this.param_info.com_code = this.com_code;
        this.param_info.io_date = this.io_date;
        this.param_info.io_no = this.io_no;
        this.param_info.tax_gubun = this.tax_gubun;
        this.param_info.doc_gubun = this.doc_gubun;
        this.param_info.trx_type = this.trx_type;
        this.param_info.ser_no = this.ser_no;
        this.param_info.p_email = this.p_email;
        this.param_info.editFlag = this.editFlag;
        this.param_info.c_native_num = this.c_native_num;
        this.param_info.emn_flag = this.emn_flag;
        this.param_info.s_cust_des = this.s_cust_des;
        this.param_info.s_mail = this.s_mail;
        this.param_info.s_tel = this.s_tel;
        this.param_info.strLanguage = this.strLanguage;
        this.param_info.why = this.why;
        this.param_info.approval_value = this.approval_value;
        this.param_info.pFlag = this.pFlag;
        this.param_info.nts_statecode = this.nts_statecode;
        this.param_info.form_Type = this.form_Type;
        this.param_info.form_Ser = this.form_Ser;
        this.param_info.eTaxLoadFlag = "";
        this.param_info.notiYn = this.notiYn;
        this.param_info.status_yn = this.status_yn

        var param = {
            width: 400,
            height: 250,
            COM_CODE: this.com_code,
            EMP_CD: this.empNo,
            strLanguage: this.strLanguage
        }

        // 기간체크
        if (this.viewYn == "N") {
            ecount.alert(this.viewBag.InitDatas.MSG01688, function () {
                this.close();
            });
        }

        // asp.net 아닐 경우 asp 페이지
        if (this.isNewPage == "N") {
            this.reloadAspPage();
        }

        // 급여명세서
        if (this.userPayPassYN == "Y") {
            this.openWindow({
                url: "/ECERP/SVC/Popup/CM302P_01",
                name: ecount.resource.LBL01423,
                param: param,
                popupType: false,
                additional: false
            });
        }

        // 사업자등록 비번 체크
        if (this.eTxtFlag == "N") {
            if (this.referer != null &&
                (this.referer.indexOf('ec.ecounterp.com') > -1 || this.referer.indexOf('ecounterp.com:73') > -1)
            ) {
                this.setTimeout(function () {
                    this.reloadPage();
                }.bind(this), 0);
            }
        }

        var pageContent = this.contents.$el.find(".received-documents");

        var contentDiv = this.contents.find(function (item) { return item.__type == "div" && item.css == "received-documents" })[0]

        if (contentDiv != undefined) {
            contentDiv.$el.css("width", this.s_width);
        }

        this._printPagingHelper = ecount.common.gridPrintPagingHelper(pageContent);

        if (this.contents.getControl("btnPaging") != undefined) {
            this.contents.getControl("btnPaging").setTotalPage(this._printPagingHelper.totalPageCount);
        }

        if (this._printPagingHelper.totalPageCount < 2) {
            this.contents.getControl("sidePaging") && this.contents.getControl("sidePaging").hide();
        }

        this.UpGradeOSNoticePopup();

        $("#btn-contents-btnPrint").attr("class", "btn btn-default visible-border")

        if (this.doc_gubun == "21") {
            this.mainWidth = undefined;
        }

        // 전제세금계산서에 승인여부 제거
        if (['45', '49'].contains(this.doc_gubun)) {
            if (this.contents.getControl("unconfirm") != undefined && this.btnConfirm_YN == "Y" && (this.submit_status == "C" || (this.submit_status != "C" && this.sc_emailmgnt_flag == "0"))) {
                this.contents.getControl("unconfirm").hide();
            }
        }

        if (this.status_yn == "Y") {
            this.mainWidth = this.ResizeWidthForStatus();
        }

    },

    exportPrint: function () {
        //인쇄
        var _self = this;
        debugger;        
        this.printHtml = " <style type='text/css'>" + this.printPageSet.printCss + "</style> " + this.printContent;

        var option = {
            url: "/ECERP/Popup.Common/PrintLoadPage",
            destroyImmediately: false,
            callback: function (page, destroyFrame) {
                page.print(destroyFrame);

            }.bind(this),
            loadHiddenPage: this.loadHiddenPage.bind(this),
            data: {
                gridWidth: this.mainWidth,
                htmlContent: this.printHtml,
                printCss: this.printPageSet.printCss,
                isContentAlignCenter: false,
                isHeightReSize: true,
                isOpenPopupPrint: false,
                isAnotherPrint: true,
                isBodyOnload: false,
                contentsMargin: { top: 0, right: 0, bottom: 0, left: 0 },
                printAlign: this.printPageSet.printAlign
            }
        }

        this.EXPORT_PRINT(option);
    },

    // asp.net 아닐 경우 asp 페이지로 이동(이전 데이터)
    reloadAspPage: function () {
        var rediret_url;
        if (this.HostName == "ec.ecounterp.com") {
            rediret_url = "/cs/report/vat_11_emailp.asp";
        }
        else {
            rediret_url = "/report/vat_11_emailp.asp";
        }

        this.onAllSubmit({
            url: rediret_url,
            param: this.param_info
        });
    },

    // 기타 팝업에서 페이지 리다이렉트
    reloadPage: function () {
        this.param_info.eTaxLoadFlag = "Y";
        this.onAllSubmitSelf({
            url: "/ECERP/Popup.Common/CM302R?SESSION_ID=" + this.SESSION_ID,
            param: this.param_info
        });
    },

    // 검토취소 리다이렉트
    reloadCancelPage: function (why) {
        this.param_info.why = why;
        this.reloadPage();
    },



    UpGradeOSNoticePopup: function () {

        var userAgent = navigator.userAgent.toLowerCase();
        // Windows 버전 체크 - Windows XP 사용하는지
        if (userAgent.indexOf('nt 5.1') > 0) {
            if ($("#UpGradeBrowserNotice").length == 0) {
                $("#body_html").prepend('<div id="UpGradeBrowserNotice" class="wrapper-notification main">');
            }

            if ($("#UpGradeBrowserNotice").length > 0) {
                var title = this.viewBag.InitDatas.MSG07835;
                var contents = this.viewBag.InitDatas.MSG07698;
                var cookieName = "UpGradeOSNoticeERP";

                var $popupDiv = $("<div>").addClass("notification animated hidden").addClass("notification-warning").attr("id", "UpGradeBrowserNoticeContent");
                var $popupButtonDiv = $("<div>");
                var $popupButton = $("<button>").addClass("close").html("&times;");
                var $popupheadingDiv = $("<div>").addClass("notification-heading").append(title);   //제목
                var $popupcontentsDiv = $("<div>").addClass("notification-contents").append(contents); //내용
                var $popupbottomDiv = $("<div>").addClass("notification-close").addClass("text-right");

                $popupButtonDiv.append($popupButton);
                $popupDiv.append($popupButtonDiv).append($popupheadingDiv).append($popupcontentsDiv).append($popupbottomDiv);

                if ($.cookie(cookieName) != "done") {
                    $("#UpGradeBrowserNotice").append($popupDiv);

                    // 팝업 닫기 버튼 클릭
                    $(".wrapper-notification.main > .notification >  > button.close").click(function () {
                        $(this).parent().parent().removeClass('bounceInDown').addClass('fadeOut').delay(500).fadeOut(1);
                    })

                    //팝업 보이기
                    $("#UpGradeBrowserNoticeContent").show().removeClass('hidden fadeOut').addClass('bounceInDown');
                }
            }
        }
    },

    //거래처관리대장 resize
    ResizeWidth: function () {        
        //var columns = this.viewBag.FormInfos.PageSet.FormOutSetDetails;        
        var columns = this.printPageSet.FormOutSetDetails
        var width = 0;

        for (var i = 0; i < columns.length; i++) {
            width += columns[i].HEAD_SIZE;            
        }
        return width;
    },

    //현황 resize
    ResizeWidthForStatus: function () {        
        var columns = this.viewBag.FormInfos.PageSet.columns;
        var width = 0;

        for (var i = 0; i < columns.length; i++) {
            if (columns[i].linechange) break;
            if (columns[i].isHideColumn == "1" || columns[i].isHideColumn === true) continue;
            width += columns[i].width;
        }
        return width;
    },

    //Get PrintPageSet callback excelprint
    GetPrintPageSet: function (callback) {        
        var _self = this;
        if (!this.printPageSet) {
            this.printPageSet = {
                printCss: { printCss: "" }
            };           
            
            var formOption = this.IsNewFormType ? this.viewBag.FormInfos.PageSet.option : null;          

            if (!this.IsNewFormType) {
                if (!this.form_Type) {
                    this.form_Type = "SF030";
                }

                var param = {
                    ComCode: this.com_code,
                    FormType: this.form_Type, 
                    FormSeq: this.form_Ser,
                };

                var dataSetting = function (data) {                    
                    _self.printPageSet.bottomMargin = data.PageSetup.B_MARGIN;
                    _self.printPageSet.height = data.PageSetup.HEIGHT;
                    _self.printPageSet.leftMargin = data.PageSetup.L_MARGIN;
                    _self.printPageSet.printAlign = data.PageSetup.PRINT_ALIGN;
                    _self.printPageSet.printWay = data.PageSetup.PRINT_WAY;
                    _self.printPageSet.reduceYn = ecount.common.isTrue(data.PageSetup.REDUCE_YN);
                    _self.printPageSet.rightMargin = data.PageSetup.R_MARGIN;
                    _self.printPageSet.sizeType = data.PageSetup.SIZE_TYPE;
                    _self.printPageSet.topMargin = data.PageSetup.T_MARGIN;
                    _self.printPageSet.width = data.PageSetup.WIDTH;
                    _self.printPageSet.paperSize = data.PaperSize;
                    _self.printPageSet.FormOutSetDetails = data.FormOutSetDetails;

                    switch (_self.printPageSet.printAlign) {
                        case "center":
                            _self.printPageSet.printAlign = "C";
                            break;
                        case "right":
                            _self.printPageSet.printAlign = "R";
                            break;
                        case "left":
                            _self.printPageSet.printAlign = "L";
                            break;
                    }

                    if (data.PageSetup.L_MARGIN == "19.3") {
                        _self.printPageSet.printCss = String.format("@page{size: {0};margin-top:{1}mm;margin-left:15.0mm;margin-right:{2}mm;margin-bottom:{3}mm;}@media print{html,body{min-width:186.1mm;overflow:hidden;}thead {display: table-header-group;}}", data.PaperSize, data.PageSetup.T_MARGIN, data.PageSetup.R_MARGIN, data.PageSetup.B_MARGIN);

                    } else {
                        _self.printPageSet.printCss = data.PrintCss;
                    }

                    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && navigator.userAgent.toLowerCase().indexOf('edge') < 0) {
                        _self.printPageSet.printCss = _self.printPageSet.printCss.replace(/table-header-group/g, "table-row-group");
                    };

                    if (_self.doc_gubun == "21") {
                        _self.printPageSet.printCss = undefined;
                        _self.printPageSet.printWay = "L";
                    }
                }

                _self.GetPageSetData(param, dataSetting, callback);
            } else {    // 신규 폼 타입일때
                this.printPageSet.bottomMargin = formOption.bMargin;
                this.printPageSet.height = formOption.height;
                this.printPageSet.leftMargin = formOption.lMargin;
                this.printPageSet.printAlign = formOption.printAlign;
                this.printPageSet.printWay = formOption.printWay;
                this.printPageSet.reduceYn = ecount.common.isTrue(formOption.reduceYn);
                this.printPageSet.rightMargin = formOption.rMargin;
                this.printPageSet.sizeType = formOption.sizeType;
                this.printPageSet.topMargin = formOption.tMargin;
                this.printPageSet.width = formOption.width;
                this.printPageSet.paperSize = formOption.paperSize;

                switch (this.printPageSet.printAlign) {
                    case "center":
                        this.printPageSet.printAlign = "C";
                        break;
                    case "right":
                        this.printPageSet.printAlign = "R";
                        break;
                    case "left":
                        this.printPageSet.printAlign = "L";
                        break;
                }


                if (formOption.lMargin == "19.3") {
                    this.printPageSet.printCss = String.format("@page{size: {0};margin-top:{1}mm;margin-left:15.0mm;margin-right:{2}mm;margin-bottom:{3}mm;}@media print{html,body{min-width:186.1mm;overflow:hidden;}thead {display: table-header-group;}}", formOption.paperSize, formOption.tMargin, formOption.rMargin, formOption.bMargin);

                } else {
                    this.printPageSet.printCss = formOption.printCss;
                }

                if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && navigator.userAgent.toLowerCase().indexOf('edge') < 0) {
                    this.printPageSet.printCss = this.printPageSet.printCss.replace(/table-header-group/g, "table-row-group");
                };

                if (this.doc_gubun == "21") {
                    this.printPageSet.printCss = undefined;
                    this.printPageSet.printWay = "L";
                }
                
                callback();

            }    // end if                    
        }    // end if(!this.printPageSet)
        else {
            callback();
        }
    },
    // 구 양식 여백정보 가져오기
    GetPageSetData: function (param, dataSetting, callback) {
        ecount.common.api({
            url: "/ECAPI/SVC/Common/Infra/GetCofmPageSetupForCM302R",
            data: Object.toJSON(param),
            success: function (result) {
                dataSetting(result.Data);
                callback();
            }.bind(this)
        });
    },
});