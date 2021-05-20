window.__define_resource && __define_resource("LBL10231","BTN00230","BTN00834","LBL11626","LBL01478","LBL00271","LBL01151","MSG01517","MSG00552","MSG06616","MSG06617","MSG00319","MSG10009","MSG10007","MSG00260","MSG07888","LBL11306","LBL04837","BTN00553","LBL01492","LBL01710","LBL01732","LBL30148","MSG02158","BTN00042","LBL30074","LBL00336","LBL01156","LBL11628");
/****************************************************************************************************
1. Create Date : 2016.11.07
2. Creator     : 손홍광
3. Description : Main > SMS / 메인 > SMS
4. Precaution  :
5. History     :
                ...
                [2018.01.16] 이현택 : LMS 체크 시점 변경
                [2018.03.20] 김우정 : A18_00600 메일발송화면에서 SMS발송 시 메뉴타입 정리
                                      sendSMS - MenuType 변경

****************************************************************************************************/

ecount.page.factory("ecount.page.list", "EGA002M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    currentTabId: null,
    checkClick: "N", //중복 전송 방지: 좌측메뉴 위젯이 아니여서 따로 체크해야함
    prevSmsCount: 0, // 이전 메세지의 총 count
    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        debugger;
        this._headerClassName = ".sms-contact-header";
        this._contentsClassName = ".sms-contact-contents";
        this._footerClassName = ".sms-contact-footer";
        this.container = "div.wrapper-sms";
        this._isAside = true;
        this.__needChangeTitle = false;
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            PARAM: '',

            // SORT, PAGING
            PAGE_SIZE: 100,
            PAGE_CURRENT: 1
        };
    },

    initEcConfig: function () { },

    render: function ($parent) {
        this._super.render.apply(this);
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
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            form = g.form(),
            ctrl = g.control(),
            toolbar = g.toolbar(),
            tabContents = g.tabContents();


        var option = [];

        // 발신번호 인증
        option.push({ id: "checkEnableSendSms", label: ecount.resource.LBL10231 });
        // SMS 발송문구등록
        option.push({ id: "smsMessage", label: ecount.resource.BTN00230 });
        // 관련법령
        option.push({ id: "smsLaw", label: ecount.resource.BTN00834 });

        header
            .setTitle(ecount.resource.LBL11626)
            .useQuickSearch(true)
            .notUsedBookmark()
            .add("option", option, false)
            .addContents(contents);

    },

    onHeaderSave: function () {
        this.finalHeaderSearch = this.header.extract().merge();
    },

    onHeaderReset: function () {
        this.header.lastReset(this.finalHeaderSearch);
    },

    //에러메세지 보여주기, widget, grid, alert, confirm
    setShowErrorMessage: function (isConfirmCheck) {
    },

    onInitContents: function (contents, resource) {
        var self = this;
        var g = widget.generator,
            tabContents = g.tabContents(),
            form = g.form(),
            ctrl = g.control(),
            toolbar = g.toolbar(),
            grid = g.grid();

        tabContents
            .onSingleMode()
            .createActiveTab("tabEmp", ecount.resource.LBL01478, null, true, "left") //사원
            .createTab("tabCust", ecount.resource.LBL00271, null, false, "left") //거래처
            .createTab("tabCardComment", ecount.resource.LBL01151, null, false, "left");   // 명함
        //.addGrid("dataGrid", grid);

        contents
            .add(tabContents)
            .addGrid("dataGrid", grid);
        ;

        if (this.SmsSendList != null) {
            this.applyValidate("SendList");
        }


        //전송
        $("#btnSendSms").bind("click", function () { this.saveValidate(); }.bind(this));

        //닫기
        $("#btnColse").bind("click", function () { this.onFooterClose(); }.bind(this));

        //LMS체크
        $("#chkLms").bind("click", this.setLmsChange.bind(this));

        //문자형식 검증
        $("#SmsTxt").bind("keyup", function () { this.checkContent('Y'); }.bind(this));

        //붙여넣기 이벤트
        $("#SmsTxt").bind("paste", function (e) {
            ecount.global.setTimeout(this.ecPageID, function () {
                this.checkContent('Y');
            }.bind(this), 0);
        }.bind(this));

        //충전
        $("#btnCharge").bind("click", this.onCharge.bind(this));

        //내역
        $("#btnContent").bind("click", this.onContent.bind(this));

        ////장애처리
        //if (this.Troubleshooting != null) {
        //    $("#empList").bind("click", this.setEmpList.bind(this));
        //}
        $("#input_body").find("tr").each(function (i, o) {
            $("#Name" + (i + 1)).bind("keydown", function () { return this.setEnter($("#Name" + (i + 1)).get(0), "Hp" + (i + 1)); }.bind(this));
            $("#Hp" + (i + 1)).bind("keydown", function () { return this.setEnter($("#Hp" + (i + 1)).get(0), "Hp" + (i + 2)); }.bind(this))
                .bind("click", function () { this.setAddRow('3', $("#Hp" + (i + 1)).get(0)); }.bind(this))
                .bind("keyup", function () { this.checkNumber($("#Hp" + (i + 1)).get(0)); }.bind(this))
                .bind("blur", function () { this.checkduplication($("#Hp" + (i + 1)).get(0)); return this.checkNumber($("#Hp" + (i + 1)).get(0)); }.bind(this));
            $("#aClear" + (i + 1)).bind("click", function () { this.dataClear((i + 1)); }.bind(this));
        }.bind(this));

        $("a[name='hfMessage']").each(function (i, o) {
            $("#hfMessage" + (i + 1)).bind("click", function () { this.setComment((i + 1)); }.bind(this));
        }.bind(this));

        if (this.viewBag.InitDatas.DefaultComment != null) {
            $("#SmsTxt").get(0).value = this.viewBag.InitDatas.DefaultComment;
        }
        this.setPhoneProfile(self.HpNoProfile != null ? self.HpNoProfile : '', self.NameProfile != null ? self.NameProfile : '');
        // 기본문구가 있을경우 바이트 체크
        this.checkContent();
    },

    setEnter: function (obj, nextfield) {
        var keyCode = event.keyCode;
        if (keyCode == 13) {
            if (obj.id.substring(0, 2) == "Hp") {
                this.setAddRow('3', obj);
            }
            if ($("#" + nextfield).get(0) != undefined) {
                $("#" + nextfield).focus();
                return false
            }
            else {
                $("#btnSendSms").focus();
            }
        }
    },

    setAddRow: function (cnt, obj) {
        var _self = this;
        var ROW_CNT = $("input[name='Name']").length;
        if (obj.id.substring(2) >= ROW_CNT - 1) {
            if (ROW_CNT < 101) {
                for (var count = 1; count <= cnt; count++)
                    if (ROW_CNT + count < 101)
                        $("#input_body").append(_self.setRowTemplate(ROW_CNT + count));
                    else {
                        break;
                    }
            } else
                ecount.alert(ecount.resource.MSG01517);  //99명까지만 가능합니다.
        }
    },

    //줄추가
    setRowTemplate: function (index) {
        var rowTemplate = "<tr>"
            + "<td class=\"text-center\">" + index + "</td>"
            + "<td>"
            + "<input type=\"text\" class=\"form-control\" id=\"Name" + index + "\" name=\"Name\" onkeydown=\"ecount.global.findPageInstance('" + this.ecPageID + "').setEnter(this, 'Hp" + (index) + "')\">"
            + "</td>"
            + "<td>"
            + "<input type=\"text\" class=\"form-control\" id=\"Hp" + index + "\" name=\"Hp\"  "
            + "onkeydown=\"return ecount.global.findPageInstance('" + this.ecPageID + "').setEnter(this, 'Hp" + (index + 1) + "')\" "
            + "onclick=\"ecount.global.findPageInstance('" + this.ecPageID + "').setAddRow('3',this)\" "
            + "onkeyup=\"return ecount.global.findPageInstance('" + this.ecPageID + "').checkNumber(this);\" "
            + "onblur=\"ecount.global.findPageInstance('" + this.ecPageID + "').checkduplication(this); return ecount.global.findPageInstance('" + this.ecPageID + "').checkNumber(this);\" >"
            + "</td>"
            + "<td class=\"text-center\"><a href=\"javascript:;\" class=\"delete\" id=\"aClear" + index + "\" onclick=\"ecount.global.findPageInstance('" + this.ecPageID + "').dataClear('" + index + "');\"  ></a></td>"
            + "</tr>";
        return rowTemplate;
    },

    //메크로 이벤트
    setComment: function (row) {
        var result = this.viewBag.InitDatas.SmsComment[row];
        var len = result.length;
        var one_ch = "";
        var count = 0;
        var total2 = 0;
        var x = 0;
        var y = 0;

        for (i = 0; i < len; i++) {
            one_ch = result.charAt(i);	//한문자만 추출
            if (encodeURIComponent(one_ch).length > 4) {
                count = count + 2;   //한글
                total2 = i
            } else {
                count = count + 1;   //영문
                total2 = i
            }
            if (count == 90) {	//90을 타지 않을 때도 있어서 91까지 설정해 줌
                x = i;
                y = 1;
            } else if (count == 91 && y != 1)
                x = i;
        }
        if (count > 90) {
            //spNowBytes
            //spMaxBytes /$("#amtEmoney").get(0).textContent
            $("#chkLms").get(0).checked = true;
            $("#spNowBytes").get(0).textContent = count;
            $("#spMaxBytes").get(0).textContent = "2000";
            $("#SmsTxt").get(0).value = result;
        } else {
            $("#chkLms").get(0).checked = false;
            $("#spNowBytes").get(0).textContent = count;
            $("#spMaxBytes").get(0).textContent = "90";
            $("#SmsTxt").get(0).value = result;
        }
    },

    checkNumber: function (obj) {

        var reg = /[^0-9]/g;
        if (reg.test(obj.value)) {
            obj.value = obj.value.toString().replace(/[^0-9]/g, "");  //숫자가 아닌값은 제외   
            return false;
        }
    },

    //입력 데이터 초기화
    dataClear: function (row) {
        $("#Name" + row).get(0).value = "";
        $("#Hp" + row).get(0).value = "";
    },

    //중복체크
    checkduplication: function (obj) {
        var cnt = 0;
        $("#input_body").find("tr").each(function (i, o) {
            if (obj.value.trim() != "" && obj.value == $(o).find("[name=Hp]").val()) {
                cnt = cnt + 1;
            }
            if (cnt > 1) {
                ecount.alert(ecount.resource.MSG00552);
                obj.value = "";
                obj.focus();
                return false;
            }
        });

    },

    //lms 체크이벤트
    setLmsChange: function () {
        if ($("#chkLms").get(0).checked == true) {
            $("#spMaxBytes").get(0).textContent = "2000";
        } else {
            $("#spMaxBytes").get(0).textContent = "90";
            this.checkContent('N');
        }
    },



    //bytes 수 계산
    checkContent: function (flag) {
        //total : 총 문자길이
        var total = $("#spMaxBytes").get(0).textContent;
        var obj = $("#SmsTxt").get(0);
        var len = obj.value.length;
        var one_ch = "";
        var count = 0;
        var countOld = 0;
        var total2 = 0;
        var objText = "";
        // var objText2 = "";

        for (i = 0; i < len; i++) {
            one_ch = obj.value.charAt(i);	//한문자만 추출
            if (encodeURIComponent(one_ch).length > 4) {
                countOld = count;
                count = count + 2;   //한글
                total2 = i;
                objText += obj.value.charAt(i);

                //if (count <= total) {
                //    objText += obj.value.charAt(i);
                //}
                //else {
                //    objText2 = objText + obj.value.charAt(i);
                //}
            } else {
                countOld = count;
                count = count + 1;   //영문
                total2 = i;
                objText += obj.value.charAt(i);

                //if (count <= total) {
                //    objText += obj.value.charAt(i);
                //}
                //else {
                //    objText2 = objText + obj.value.charAt(i);
                //}
            }
            $("#spNowBytes").get(0).textContent = count;

            if (count > total) {
                if (flag == "Y" && $("#chkLms").get(0).checked != true && this.checkClick == "N") {

                    //ecount.confirm(ecount.resource.MSG06616, function (status) {
                    //    if (status) {
                    //        $("#SmsTxt").get(0).value = objText2;//$("#SmsTxt").get(0).value.substring(0, 90);
                    //        $("#spNowBytes").get(0).textContent = count;
                    //        $("#chkLms").get(0).checked = true;
                    //        this.setLmsChange();
                    //        $("#SmsTxt").focus();
                    //        this.checkClick = "N";
                    //    } else {
                    //        $("#SmsTxt").focus();
                    //        $("#SmsTxt").get(0).value = objText;//$("#SmsTxt").get(0).value.substring(0, 90);
                    //        $("#spNowBytes").get(0).textContent = countOld;
                    //        this.checkClick = "N";
                    //    }
                    //}.bind(this));

                    // LMS로 변경
                    $("#chkLms").get(0).checked = true;
                    this.setLmsChange();
                    total = $("#spMaxBytes").get(0).textContent;    // 최대값을 2000byte로 변경해줌

                    continue;

                    // return false;
                }  //$("#chkInput").get(0).checked != true                     

                // if (text == "SmsTxt")
                if (this.checkClick == "N") {
                    if ($("#chkLms").get(0).checked != true) {
                        ecount.alert(String.format(ecount.resource.MSG06617, "45", "90"));
                    }
                    else {
                        ecount.alert(String.format(ecount.resource.MSG06617, "1000", "2000"));
                    }

                    // 길이를 초과했을 경우 이전 값으로 돌리고 리턴
                    $("#SmsTxt").get(0).value = objText.substring(0, objText.length - 1);
                    $("#spNowBytes").get(0).textContent = countOld;
                    return false;
                }

                // return false;
            }
        } // if (count > total)

        // LMS -> SMS 변환 : sms가 아니고, 현재 길이가 sms이며, 전에 길이가 lms에 해당하는 경우
        if (total > 90 && count <= 90 && this.prevSmsCount > 90) {
            $("#chkLms").get(0).checked = false;
            this.setLmsChange();
        }
        this.prevSmsCount = count;  // 현재 총 메시지 길이를 preSmsCount에 저장
    },

    checkEmoney: function (checkType, addCnt) {
        var eMoney = this.AmtEmoney;
        var smsprice = this.viewBag.InitDatas.priceInfo.AmtSmsPrice;
        var lmsprice = this.viewBag.InitDatas.priceInfo.AmtLmsPrice;
        var smsmoney = 0;

        var cnt = addCnt;
        $("#input_body").find("tr").each(function (i, o) {
            if ($(o).find("[name=Hp]").val().trim() != "") {
                cnt = cnt + 1;
            }
        });

        if (cnt == 0 && checkType == "Send") {
            ecount.alert(ecount.resource.MSG00319);
            this.checkClick = "N";
            $("#Hp1").focus();
            return false;
        }

        if ($("#chkLms").get(0).checked != true) {
            smsmoney = smsprice * cnt;
        }
        else {
            smsmoney = lmsprice * cnt;
        }

        if (eMoney < 0) {
            ecount.confirm(ecount.resource.MSG10009, function (isOk) {
                if (isOk) {
                    this.onCharge();
                    this.checkClick = "N";
                    return false;
                } else {
                    if (checkType == "Send") {
                        this.checkClick = "N";
                        ecount.alert(ecount.resource.MSG10007);
                    }
                    return false;
                }
            }.bind(this))
        }
        else {
            return true;
        }
    },

    //SMS발송
    saveValidate: function () {
        // F8키 눌러 저장할 때, #Hp 컨트롤의 Onblur 이벤트 실행하기 위해
        setTimeout(function () { $("#SmsTxt").focus(); }, 1);

        var self = this;

        var arrHpNum = $('input[name="Hp"]').map(function () {
            if (!$.isEmpty(this.value)) {
                return this.value.trim();
            }
        }).toArray();

        var hasDups = !arrHpNum.every(function (v, i) {
            return (arrHpNum.indexOf(v) == i);
        });

        if (hasDups) {
            return false;
        }

        if (this.checkClick == "Y") {
            return false;
        }
        else {
            this.checkClick = "Y";
        }

        if ($("#sCaller").val().trim() == "") {
            $("#sCaller").val(this.viewBag.InitDatas.Caller);
        }

        ecount.infra.checkEnableSendSms.apply(this, [$("#sCaller").val(), function (resultObj) {
            if (resultObj == true) {
                if ($("#SmsTxt").val().trim() == "") {
                    $("#SmsTxt").focus();
                    ecount.alert(ecount.resource.MSG00260);
                    this.checkClick = "N";
                    return;
                }

                if (this.checkEmoney("Send", 0) == true) {
                    // LMS 여부 확인 (check message size count)
                    if ($("#spMaxBytes").get(0).textContent > 90) {
                        ecount.confirm(ecount.resource.MSG07888, function (status) {
                            if (status) {
                                this.sendSMS();
                            } else {
                                this.checkClick = "N";
                                return false;
                            }
                        }.bind(this));
                    }
                    else {
                        this.sendSMS();
                    }
                }
            } else {
                this.checkClick = "N";
                return false;
            }
        }.bind(this)]);
    },

    // 메세지 보내기 (send SMS)
    sendSMS: function () {
        var com_code = this.viewBag.COM_CODE;

        var sendData = {
            SendInfo: {
                COM_CODE: com_code,
                SenderNumber: $("#sCaller").val(),
                MenuType: "91",                // ETC > 91
                SendList: new Array(),
            }
        }

        $("#input_body").find("tr").each(function (i, o) {
            if ($(o).find("[name=Hp]").val() != null && $(o).find("[name=Hp]").val() != "") {
                sendData.SendInfo.SendList.push({
                    MSG_TYPE: $("#chkLms").get(0).checked != true ? "1" : "3",
                    RECEIVE_NUMBER: $(o).find("[name=Hp]").val(),
                    CONTENT: $("#SmsTxt").val(),
                    RECEIVE_NAME: $(o).find("[name=Name]").val(),
                });
            }
        });

        ecount.common.api({
            url: '/Common/Infra/SendSms', //Common.Infra
            data: Object.toJSON(sendData),
            success: function (result) {
                if (result.Status == "200") {
                    if (result.Data == undefined) {
                        this.showAlertCircle(ecount.resource.LBL11306, { delay: "500" });
                        this.setTimeout(function () {
                            this._ON_REDRAW();
                            this.dataClear((1));
                            self.HpNoProfile = "";
                            self.NameProfile = "";
                        }.bind(this), 1000);
                    }
                    else {
                        this.checkClick = "N";
                        ecount.infra.checkEnableSendSms.apply(this, [$("#sCaller").val(), function (resultObj) {
                            if (resultObj != true) {
                                return false;
                            }
                        }.bind(this)]);
                    }
                }
            }.bind(this)
        })
    },

    //setEmpList: function () {

    //    this.Troubleshooting.forEach(function (i, o) {

    //        var hpValue = i[1];
    //        var nameValue = i[0];

    //        this.setAddRow(3, $("#Hp" + (o + 1)).get(0));

    //        $("#Hp" + (o + 1)).get(0).value = hpValue;
    //        $("#Name" + (o + 1)).get(0).value = nameValue;
    //    }.bind(this));

    //    $("#SmsTxt").get(0).value = "작성자 - \n\n장애내용 -";
    //    this.checkContent();
    //},

    onInitFooter: function (footer, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            ctrl = g.control();


        toolbar.attach(ctrl.define("widget.label", "AddCount").label(ecount.resource.LBL04837 + " : 0").end())
            .alignCenter();

        toolbar.attach(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00553).end())
            .alignCenter();

        footer.add(toolbar);
    },

    onFooterReset: function () {
    },

    onFooterButton: function () {
    },

    onInitControl: function (cid, control) {
    },

    //충전
    onCharge: function () {
        //var sessionId = window.requestUrl.param['ec_req_sid'];
        //var url = "/ECMAIN/KCP/KCP001M.aspx?ec_req_sid=" + sessionId + "&com_code=" + this.viewBag.COM_CODE + "&db_con_flag=" + this.dbConFlag + "&emn_flag=N&access_site=" + this.accessSite + "&CcProdDesc=" + encodeURIComponent(this.viewBag.COM_CODE + " SMS");     //신용카드 결제
        //window.open(url, "kcp", 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=630,height=700');

        ecount.common.openKCPType1({
            callComCode: this.viewBag.COM_CODE,
            emn_flag: "N",
            access_site: this.accessSite,
            ccProdDesc: encodeURIComponent(this.viewBag.COM_CODE + " SMS")
        });
    },

    //내역
    onContent: function (e) {
        this.openWindow({
            url: '/ECERP/SVC/ECC/ECC002M',
            name: "ECC002M_SM",
            additional: true,
            param: {
                width: 850,
                height: 750,
                popFlag: "S",
                MenuTypes: "91"
            }
        });
    },

    //SMS 발신번호 인증
    onDropdownCheckEnableSendSms: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Common/EGA008P_05',
            name: "EGA008P_05_SM",
            additional: true,
            param: {
                width: 660,
                height: 470
            }
        });
    },

    //SMS발송문구등록
    onDropdownSmsMessage: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Search/EGA001P_03',
            name: "EGA001P_03_SM",
            additional: true,
            param: {
                width: 605,
                height: 500,
                SEND_SER: "SM",
                DOC_GUBUN: "77",
                Edit: true
            }
        });
    },

    //관련 법령
    onDropdownSmsLaw: function (e) {
        this.openWindow({
            url: '/ECERP/Popup.Common/EGA001P_10',
            name: "EGA001P_10_SM",
            additional: true,
            param: {
                width: 640,
                height: 370
            }
        });
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) {
        this.currentTabId = event.tabId;
        this.dataSearch(false);
    },

    onLoadComplete: function (event) {
        this.currentTabId = this.contents.currentTabId;
        if (!event.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
        if ($("#topAmt").get(0).offsetHeight > 30) {
            $("#leftPreview").addClass("height-adjust");
        }
        //this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        this.dataSearch();

    },

    dataSearch: function (initFlag) {

        this.footer.getControl("AddCount").setLabel(ecount.resource.LBL04837 + " : 0 ");

        var thisObj = this;
        var settings = widget.generator.grid(),
            gridObj = this.contents.getGrid("dataGrid");

        // Initialize Grid
        if (this.currentTabId == "tabEmp") {
            settings
                .setRowDataUrl('/Manage/HR/GetListInsa001forMoblie')
                .setKeyColumn(["EMP_CD"])
                .setColumns([
                    { propertyName: 'EMP_KNAME', id: 'EMP_KNAME', title: ecount.resource.LBL01492, width: '' },
                    { propertyName: 'HP_NO', id: 'HP_NO', title: ecount.resource.LBL01710, width: '' },
                    { propertyName: 'MODIFY_HP', id: 'MODIFY_HP', title: ecount.resource.LBL01732, width: '80', align: 'center' }
                ])
                ;
        }
        else if (this.currentTabId == "tabCust") {
            settings
                .setRowDataUrl('/Account/Basic/GetListCustforMoblie')
                .setKeyColumn(["BUSINESS_NO"])
                .setColumns([
                    { propertyName: 'CUST_NAME', id: 'CUST_NAME', title: ecount.resource.LBL30148, width: '' },
                    { propertyName: 'HP_NO', id: 'HP_NO', title: ecount.resource.LBL01710, width: '' },
                    { propertyName: 'MODIFY_HP', id: 'MODIFY_HP', title: ecount.resource.LBL01732, width: '80', align: 'center' }
                ])
                ;
        }
        else {
            settings
                .setRowDataUrl('/Groupware/CRM/GetListEGCardComForMobile')//'/SVC/Groupware/CRM/GetListEGCardComForMobile'=> 페이지 3.0으로 개발시에 위 url로 변경(udp,svc 개발완료)
                .setKeyColumn(["SER_NO"])
                .setColumns([
                    { propertyName: 'COMPANY_DES', id: 'COMPANY_DES', title: ecount.resource.LBL30148, width: '' },
                    { propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL01492, width: '' },
                    { propertyName: 'HP_NO', id: 'HP_NO', title: ecount.resource.LBL01710, width: '' },
                    { propertyName: 'MODIFY_HP', id: 'MODIFY_HP', title: ecount.resource.LBL01732, width: '80', align: 'center' }
                ])
                ;
        }
        settings
            //.setHeaderFix(true)
            //.setColumnFixHeader(true)
            .setRowDataParameter(this.searchFormParameter)

            .setCustomRowCell('MODIFY_HP', this.setGridModifyHP.bind(this))          // 모바일수정
            .setCustomRowCell('HP_NO', this.setGridHpNo.bind(this))          // 링크

            //틀고정 옵션
            //.setHeaderTopMargin(this.header.height() + 6) //css wrapper-sms-contact top:5
            //.setFixGridTarget("smsContents")
            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // CheckBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(self.ecount.resource.MSG02158, maxcount)) })
            .setCheckBoxCallback({                                                          //체크 박스 클릭시 발생 하는 이벤트(입력 화면에서 필요)
                'change': function (e, data) {
                    this.setInputSendMessage()
                }.bind(this)
            })
            .setCheckBoxMaxCount(100)
            //.setCheckBoxRememberChecked(true)

            ;

        this.gridSettings = settings;
        gridObj.grid.settings(settings);
        gridObj.draw(this.searchFormParameter);

        return true;
    },

    // 입력 데이터 내려주기
    setInputSendMessage: function () {

        var selectedCnt = this.contents.getGrid().getCheckedItem().length;
        this.footer.getControl("AddCount").setLabel(ecount.resource.LBL04837 + " : " + selectedCnt);
        return true;
    },
    //번호 클릭시 입력
    setGridHpNo: function (rowitem) {
        var option = [];

        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                var smsSendList = new Array();

                if (this.currentTabId == "tabEmp") {
                    smsSendList.push(
                        new Array(data.rowItem['HP_NO'].trim(), data.rowItem['EMP_KNAME'].trim())
                    );
                }
                else if (this.currentTabId == "tabCust") {
                    smsSendList.push(
                        new Array(data.rowItem['HP_NO'].trim(), data.rowItem['CUST_NAME'].trim())
                    );
                }
                else {
                    smsSendList.push(
                        new Array(data.rowItem['HP_NO'].trim(), data.rowItem['UNAME'].trim())
                    );
                }
                this.SmsSendList = smsSendList;
                this.applyValidate("Link");
            }.bind(this)
        }

        return option;

    },
    //Set HP_NO get from user profile
    setPhoneProfile: function (hp_no, name) {
        if (hp_no != undefined) {
            var smsSendList = new Array();
            var _name = name.trim().split("/")
            if (_name.length > 0)
                _name = _name[0].trim();
            else
                _name = '';
            if (this.currentTabId == "tabEmp") {

                smsSendList.push(
                    new Array(hp_no, _name.trim())
                );
            }
            else if (this.currentTabId == "tabCust") {
                smsSendList.push(
                    new Array(hp_no, _name.trim())
                );
            }
            else {
                smsSendList.push(
                    new Array(hp_no, _name.trim())
                );
            }
            this.SmsSendList = smsSendList;
            this.applyValidate("Link");
        }
    },
    //모바일수정
    setGridModifyHP: function (rowItem) {
        var option = [];

        option.data = ecount.resource.BTN00042;
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {

                var modifyType = "";
                var param = {};
                var permission = "";
                var resource = "";
                if (this.currentTabId == "tabEmp") {
                    permission = this.viewBag.Permission.EmpPermit.Value;
                    resource = ecount.resource.LBL30074;
                    param = {
                        width: 300,
                        height: 200,
                        ModifyType: "E",
                        HpNo: data.rowItem['HP_NO'].trim(),
                        Param: data.rowItem['EMP_CD'].trim(),
                    };
                }
                else if (this.currentTabId == "tabCust") {
                    permission = this.viewBag.Permission.CustPermit.Value;
                    resource = ecount.resource.LBL00336;
                    param = {
                        width: 300,
                        height: 200,
                        ModifyType: "C",
                        HpNo: data.rowItem['HP_NO'],
                        Param: data.rowItem['BUSINESS_NO'].trim(),
                        CustDes: data.rowItem['CUST_NAME'].trim(),
                    };
                }
                else {
                    permission = this.viewBag.Permission.CardCommentPermit.Value;
                    resource = ecount.resource.LBL01156;
                    param = {
                        width: 300,
                        height: 200,
                        ModifyType: "CD",
                        HpNo: data.rowItem['HP_NO'].trim(),
                        Param: data.rowItem['SER_NO'].trim(),
                    };
                }
                if (!permission.equals("W")) {
                    var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: resource, PermissionMode: "U" }]);  //             
                    ecount.alert(msgdto.fullErrorMsg);
                    return;
                }

                this.openWindow({
                    url: '/ECERP/popup.Common/EGA002P',
                    name: 'EGA002P',
                    param: param,
                    popupType: false,
                    additional: true
                });
            }.bind(this)
        }

        return option;
    },

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },
    onMessageHandler: function (message) {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.showAlertCircle(ecount.resource.LBL11628);
    },

    onHeaderQuickSearch: function (e, value) {
        this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        this.contents.getGrid().grid.clearChecked();
        this.footer.getControl("AddCount").setLabel(ecount.resource.LBL04837 + " : 0");
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    onChangeControl: function (control) {

    },

    onBeforeChangeTab: function (event) {
        return true;
    },

    onHeaderSimpleSearch: function (e) { },
    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) { },

    onGridAfterFormLoad: function (e, data, grid) { },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onFooterApply: function () {

        this.applyValidate("Apply");
    },
    applyValidate: function (type) {
        var checkdata = "";
        var isfull = true;

        if (type == "Apply") {
            checkdata = this.contents.getGrid().grid.getChecked();
        }
        else {
            checkdata = this.SmsSendList
        }
        var btnGubun = "N";

        //금액계산    

        if (this.checkEmoney("Apply", checkdata.length) == true) {

            checkdata.forEach(function (i, o) {

                var newHPValue = "";
                var newDesValue = "";

                if (type == "Apply") {
                    newHPValue = i.HP_NO;
                    if (this.currentTabId == "tabEmp") {
                        newDesValue = i.EMP_KNAME;
                    }
                    else if (this.currentTabId == "tabCust") {
                        newDesValue = i.CUST_NAME;
                    }
                    else {
                        newDesValue = i.UNAME;
                    }
                }
                else {
                    newHPValue = i[0];
                    newDesValue = i[1];
                }

                var cnt = 0;
                if (newHPValue != "" && newHPValue != null) {

                    $("input[name='Name']").each(function (t) {
                        var newHp = $("#Hp" + (t + 1));
                        var newName = $("#Name" + (t + 1));
                        var BFlag = 0;
                        this.setAddRow(3, newHp.get(0));

                        if (newHp.get(0).value == "" && newName.get(0).value == "" && cnt == 0) {
                            isfull = false;
                            $("input[name='Name']").each(function (j) {
                                var oldValue = $("#Hp" + (j + 1)).get(0).value;

                                if (oldValue == newHPValue.replaceAll("-", "")) {
                                    if (btnGubun == "N") {
                                        ecount.alert(ecount.resource.MSG00552);
                                        btnGubun = "Y";
                                    }
                                    BFlag = "1";
                                }
                            });
                            if (BFlag == 1) {
                                return false;
                            }

                            newName.get(0).value = newDesValue;
                            newHp.get(0).value = newHPValue.replaceAll("-", "");

                            cnt = cnt + 1;
                        }
                    }.bind(this));

                }
            }.bind(this));

        }
    },
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },
    // Reload grid
    _ON_REDRAW: function (param) {
        //this.searchFormParameter.PARAM = this.header.getQuickSearchControl().getValue();
        //this.contents.getGrid().grid.clearChecked();
        //this.footer.getControl("AddCount").setLabel(ecount.resource.LBL04837 + " : 0");
        //this.contents.getGrid().draw(this.searchFormParameter);
        this.onAllSubmitSelf("/ECERP/Popup.Common/EGA002M", "", "");
    },
    //F8 적용 (function8 click event)
    ON_KEY_F8: function () {
        this.saveValidate();
    },
    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

});
