window.__define_resource && __define_resource("LBL07217","LBL08010","LBL07214","LBL07215","MSG10336","BTN00008","MSG04360","LBL02961","LBL00694","MSG00205","LBL00960");
/****************************************************************************************************
1. Create Date : 20150924 
2. Creator     : ParkHyunMin
3. Description : 재고1 > 영업관리 > 판매 > 판매입력 > 품목코드입력후, 단가탭에서 F6
4. Precaution  :
5. History     : 
            2016.03.28 (seongjun-Joe) 소스리팩토링.
            2018.09.06 (Ngo Thanh Lam) Add load price tax included when F6 (follow jobcode A18_02371)
            2020.01.28 (HyungJun-Yoo) A20_00080 - 단가기준정립 1차
			2020.04.20 (김동수) : A20_01538 - 최종단가 사용안함 설정 시 최종단가 관련 기능 제한
			2020.10.26 (김동수) : A20_00289 - 품목단가 팝업창 F6 UI 변경하기
6. Old File    :                  
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ES023P", {

    /**********************************************************************
    * page user opion Variables(사용자변수 및 객체)
    **********************************************************************/

    permissions: null,          //권한값

    /**********************************************************************
    * page init
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.initProperties();

        Decimal.config({
            precision: 28,
            rounding: 4,    //round down            
            toExpPos: 28,
            maxE: 28,
            errors: false
        });

    },

    initProperties: function () {

        this.permissions = $.extend({}, this.permissions, this.viewBag.Permission || {});

    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);
        //debugger
    },

    /****************************************************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter, onInitControl](화면 구성) 
    ****************************************************************************************************/
    //Header Setting
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL07217);
    },
    //Contents Setting
    onInitContents: function (contents, resource) {
        var priceInfoJson = this.viewBag.InitDatas.priceInfoJson.Result;

        var title = ecount.resource.LBL08010 + " : " + this.PROD_CD + " " + this.PROD_DES;
        $(".wrapper-sub-title").append(title);

        if (!$.isEmpty(this.SIZE_DES)) {
            $(".wrapper-sub-title").append(" [" + this.SIZE_DES + "]");
        }

        if (!$.isEmpty(this.CUST_CODE)) {
            $(".wrapper-sub-title").append("&nbsp;/&nbsp;" + this.CUST_CODE + "&nbsp;" + this.CUST_DES);
        }

        if (!$.isEmpty(this.WH_CD)) {
            var wh_des = this.WH_DES;
            $(".wrapper-sub-title").append("&nbsp;/&nbsp;" + this.WH_CD + "&nbsp;" + wh_des);
        }

        var thTitle = "", num1 = 0, num2 = 1;
        if (this.MENU_NAME != null)
            num1 = 1, num2 = 0;

        //최근판매전표
        if (this.IO_TYPE == "10") {
            thTitle = ecount.resource.LBL07214;
        } else {
            thTitle = ecount.resource.LBL07215;
        }
        this.fnMakeSaleList(thTitle, priceInfoJson.Data[num1], 1);

        //최근구매전표
        if (this.IO_TYPE == "10") {
            thTitle = ecount.resource.LBL07215;
        } else {
            thTitle = ecount.resource.LBL07214;
        }
        this.fnMakeSaleList(thTitle, priceInfoJson.Data[num2], 2);

        //단가정보(적용단가/특별단가/최종단가/거래처별조정률/출고단가
        this.fnMakePriceInfo(priceInfoJson.PriceInfo);

		$("#divPriceInfo")[0].innerHTML = "* <span class='fa fa-check text-warning'></span> " + ecount.resource.MSG10336;	// 표시는 VAT포함 단가입니다.
    },
    // Footer Setting
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..](form 에서 발생하는 이벤트)
    **********************************************************************/
    onLoadComplete: function () {
        if (this.TAX_INCLUDED) {
            var $colgroup = "<colgroup>",
                $col = "<col />",
                $colWithStyle = "<col width='30px' />";
            $colgroup = $colgroup + "<col width='140px' />"
                + $colWithStyle + $col
                + $colWithStyle + $col
                + $colWithStyle + $col
                + $colWithStyle + $col
                + $colWithStyle + $col
                + "</colgroup>";
            $("#saleList").append($colgroup);
        }   
    },

    onPopupHandler: function (control, parameter, handler) { },

    onMessageHandler: function (message) { },

    /**********************************************************************
    * event  [button, link, FN, optiondoropdown..]
    **********************************************************************/
    //닫기버튼
    onFooterClose: function () {
        this.close();
        return false;
    },

    /********************************************************************** 
    *  hotkey [f1~12, Rudder etc.. ] 
    **********************************************************************/
    ON_KEY_ESC: function () {
        this.close();
    },

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    //거래내역 리스트
    fnMakeSaleList: function (thTitle, data, no) {

        var self = this;

        var $titleTR = $("<tr>");
        var $titleTH = $("<th>");
        var $titleTD = $("<td>").addClass("text-center");

        var $contentTR = $("<tr>");
        var $contentTH = $("<th>");
        var $contentTD = $("<td>").addClass("text-center");

        var isPermission = false;
        var permissionMSG = "";

        if (no == 1) {//첫번째 tr을 만들때..
            if (this.IO_TYPE == "10" && this.permissions.sellPermit.Value != "X" || this.IO_TYPE == "20" && this.permissions.buyPermit.Value != "X") {
                isPermission = true;
            } else {
                if (this.IO_TYPE == "10") {
                    permissionMSG = String.format(ecount.resource.MSG04360, ecount.resource.LBL02961);
                } else {
                    permissionMSG = String.format(ecount.resource.MSG04360, ecount.resource.LBL00694);
                }
            }
        } else {
            if (this.IO_TYPE == "10" && this.permissions.buyPermit.Value != "X" || this.IO_TYPE == "20" && this.permissions.sellPermit.Value != "X") {
                isPermission = true;
            } else {
                if (this.IO_TYPE == "10") {
                    permissionMSG = String.format(ecount.resource.MSG04360, ecount.resource.LBL00694);
                } else {
                    permissionMSG = String.format(ecount.resource.MSG04360, ecount.resource.LBL02961);
                }
            }
        }

        if (isPermission) {

            if (data == null || data.count() == 0 || (no == 1 && this.CUST_CODE == null)) {
                $titleTH.append(thTitle);
                if (this.TAX_INCLUDED)
                    $titleTD.attr("colspan", "10").attr("rowspan", "2").append(ecount.resource.MSG00205);
                else
                    $titleTD.attr("colspan", "5").attr("rowspan", "2").append(ecount.resource.MSG00205);
                $titleTR.append($titleTH).append($titleTD);

                $contentTH.append(ecount.resource.LBL00960);
                $contentTR.append($contentTH);
            } else {
                $titleTH.append(thTitle);
                $titleTR.append($titleTH);

                var loopCount = data.count();

                for (var i = 0; i < loopCount; i++) {
                    if (this.TAX_INCLUDED)
                        $titleTR.append("<td colspan=2 class=text-center>" + data[i].IO_DATE + "-" + data[i].IO_NO + "</td>");
                    else
                        $titleTR.append("<td class=text-center>" + data[i].IO_DATE + "-" + data[i].IO_NO + "</td>");
                }
                if (loopCount < 5) {
                    for (var i = 0; i < 5 - loopCount; i++) {
                        if (this.TAX_INCLUDED)
                            $titleTR.append("<td colspan=2 class=text-center></td>");
                        else
                            $titleTR.append("<td class=text-center></td>");
                    }
                }

                $contentTH.append(ecount.resource.LBL00960);
                $contentTR.append($contentTH);

                for (var i = 0; i < loopCount; i++) {
                    var $td = $("<td>").addClass("text-right");
                    var $a = $("<a>").attr("href", "javascript:;");
                    $a.append(data[i].PriceDisplay);
                    if (this.TAX_INCLUDED) {
                        $contentTR.append("<td class='text-center'><span class='fa fa-check text-warning'></span></td>");
                    }
                    $a.data("Price", data[i].PRICE)
                        .data("PriceVatInclude", data[i].USER_PRICE_VAT)
                        .data("IsPriceVatInclude", true);

                    $a.bind('click', function () {
                        self.fnLinkClick($(this).data("Price"), false, 0, $(this).data("IsPriceVatInclude"), $(this).data("PriceVatInclude"));
                    });

                    $td.append($a);
                    $contentTR.append($td);
                }
                if (loopCount < 5) {
                    for (var i = 0; i < 5 - loopCount; i++) {
                        if (this.TAX_INCLUDED)
                            $contentTR.append("<td class=text-right></td><td class=text-right></td>");
                        else
                            $contentTR.append("<td class=text-right></td>");
                    }
                }

            }
        } else {
            $titleTH.append(thTitle);
            if (this.TAX_INCLUDED)
                $titleTD.attr("colspan", "10").attr("rowspan", "2").append(permissionMSG);
            else
                $titleTD.attr("colspan", "5").attr("rowspan", "2").append(permissionMSG);
            $titleTR.append($titleTH).append($titleTD);

            $contentTH.append(ecount.resource.LBL00960);
            $contentTR.append($contentTH);
        }

        $("#saleList").append($titleTR).append($contentTR);
    },

    //단가정보(적용단가/특별단가/최종단가/거래처조정률/출고단가)
    fnMakePriceInfo: function (data) {
        var self = this;
        var $tr1 = $("<tr>");
        var $tr2 = $("<tr>");
        var $tr3 = $("<tr>");
        var $tr4 = $("<tr>");
        var $tr5 = $("<tr>");
        var $tr6 = $("<tr>");
        var $tr7 = $("<tr>");
		var $tr8 = $("<tr>");
		var colPos = 8;		// 최종단가 여부에 따른 컬럼위치 조정(1간 줄어든다)

		if (this.LAST_SALE_FLAG != "I" && this.IO_TYPE.left(1) == "1")			// 판매최종단가 사용여부
			colPos = 7;
		else if (this.LAST_INOUT_FLAG != "I" && this.IO_TYPE.left(1) == "2")		// 구매최종단가 사용여부
			colPos = 7;

        for (var i = 0; i < 5; i++) {
            $tr1.append("<th colspan='2'>" + data[i].Name + "</th>");

            if (data[i].IsVAT) {
                $tr2.append("<td class='text-center'><span class='fa fa-check text-warning'></span></td>");
            } else {
                $tr2.append("<td class='text-center'></td>");
            }

            var $td = $("<td>").addClass("text-right");
            var $a = $("<a>").attr("href", "javascript:;");
            if (parseFloat(data[i].Price) > 0) {
                $a.append(data[i].PriceDisplay);
            } else {
                $a.append(data[i].PriceDisplay); 
            }
           
            $a.data("Price", data[i].Price)
                .data("IsVAT", data[i].IsVAT)
                .data("VATRate", data[i].VATRate)
                .data("PriceVatInclude", data[i].PriceVatInclude)
                .data("IsPriceVatInclude", data[i].IsPriceVatInclude);

            $a.bind('click', function () {
                self.fnLinkClick($(this).data("Price"), $(this).data("IsVAT"), $(this).data("VATRate"), $(this).data("IsPriceVatInclude"), $(this).data("PriceVatInclude"));
            });

            $td.append($a);
            $tr2.append($td);
        }
        // 추가
		for (var i = 5; i < colPos; i++) {
            $tr3.append("<th colspan='2'>" + data[i].Name + "</th>");

            if (data[i].IsVAT) {
                $tr4.append("<td class='text-center'><span class='fa fa-check text-warning'></span></td>");
            } else {
                $tr4.append("<td class='text-center'></td>");
            }

            var $td = $("<td>").addClass("text-right");
            var $a = $("<a>").attr("href", "javascript:;");
            if (parseFloat(data[i].Price) > 0) {
                $a.append(data[i].PriceDisplay);
            } else {
                $a.append(data[i].PriceDisplay);
            }

            
            $a.data("Price", data[i].Price)
                .data("IsVAT", data[i].IsVAT)
                .data("VATRate", data[i].VATRate)
                .data("PriceVatInclude", data[i].PriceVatInclude)
                .data("IsPriceVatInclude", data[i].IsPriceVatInclude);

            $a.bind('click', function () {
                self.fnLinkClick($(this).data("Price"), $(this).data("IsVAT"), $(this).data("VATRate"), $(this).data("IsPriceVatInclude"), $(this).data("PriceVatInclude"));
            });

            $td.append($a);
            $tr4.append($td);
        }
		for (var i = 0; i < 10 - colPos; i++) {           
            $tr3.append("<th colspan='2'></th>");
            $tr4.append("<td class='text-center'></td>");

            var $td = $("<td>").addClass("text-right");
            var $a = $("<a>").attr("href", "javascript:;");

            $td.append($a);
            $tr3.append($td);
            $tr4.append($td);
        }
		for (var i = colPos; i < colPos+5; i++) {
            $tr5.append("<th colspan='2'>" + data[i].Name + "</th>");

            if (data[i].IsVAT) {
                $tr6.append("<td class='text-center'><span class='fa fa-check text-warning'></span></td>");
            } else {
                $tr6.append("<td class='text-center'></td>");
            }

            var $td = $("<td>").addClass("text-right");
            var $a = $("<a>").attr("href", "javascript:;");
            if (parseFloat(data[i].Price) > 0) {
                $a.append(data[i].PriceDisplay);
            } else {
                $a.append(data[i].PriceDisplay);
            }

            
            $a.data("Price", data[i].Price)
                .data("IsVAT", data[i].IsVAT)
                .data("VATRate", data[i].VATRate)
                .data("PriceVatInclude", data[i].PriceVatInclude)
                .data("IsPriceVatInclude", data[i].IsPriceVatInclude);

            $a.bind('click', function () {
                self.fnLinkClick($(this).data("Price"), $(this).data("IsVAT"), $(this).data("VATRate"), $(this).data("IsPriceVatInclude"), $(this).data("PriceVatInclude"));
            });

            $td.append($a);
            $tr6.append($td);
        }
		for (var i = colPos + 5; i < colPos+10; i++) {
            $tr7.append("<th colspan='2'>" + data[i].Name + "</th>");

            if (data[i].IsVAT) {
                $tr8.append("<td class='text-center'><span class='fa fa-check text-warning'></span></td>");
            } else {
                $tr8.append("<td class='text-center'></td>");
            }

            var $td = $("<td>").addClass("text-right");
            var $a = $("<a>").attr("href", "javascript:;");
            if (parseFloat(data[i].Price) > 0) {
                $a.append(data[i].PriceDisplay);
            } else {
                $a.append(data[i].PriceDisplay);
            }

            
            $a.data("Price", data[i].Price)
                .data("IsVAT", data[i].IsVAT)
                .data("VATRate", data[i].VATRate)
                .data("PriceVatInclude", data[i].PriceVatInclude)
                .data("IsPriceVatInclude", data[i].IsPriceVatInclude);

            $a.bind('click', function () {
                self.fnLinkClick($(this).data("Price"), $(this).data("IsVAT"), $(this).data("VATRate"), $(this).data("IsPriceVatInclude"), $(this).data("PriceVatInclude"));
            });

            $td.append($a);
            $tr8.append($td);
        }
        $("#priceInfo > tbody").append($tr1).append($tr2).append($tr3).append($tr4).append($tr5).append($tr6).append($tr7).append($tr8);
    },

    //링크 클릭
    fnLinkClick: function (objValue, isVAT, vatRate, IsPriceVatInclude, priceVatInclude) {
        var priceVat = new Decimal(0);
        if (isVAT) {
            priceVat = objValue;
            if (parseFloat(vatRate) != 0) {   // 부가세 포함일때
                //objValue = ((Number(objValue) / (parseFloat(vatRate) / 100 + 1)) * 10) * 0.1;
                objValue = new Decimal(objValue);
                var divinder = parseFloat(vatRate) / 100 + 1;
                objValue = objValue.div(divinder).times(10).times(0.1);
            }
        }

        priceVat = new Decimal(priceVatInclude || "0");

        // 자릿수 설정에 따라 값 가공
        var price = 0, tempPriceVat = 0;
        price = ecount.calc.toFixed(objValue, this.OUTPRICEDECIMAL, "R");
        tempPriceVat = ecount.calc.toFixed(priceVat, this.OUTPRICEDECIMAL, "R");
        var msgDTO = {
            Price: Number.formatNumeric(price),
            PriceVatInclude: Number.formatNumeric(tempPriceVat),
            RowNo: this.ROWID
        };

        var message = {
            data: msgDTO,
            callback: this.close.bind(this)
        };
        this.sendMessage(this, message);
    }


});