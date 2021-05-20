window.__define_resource && __define_resource("LBL07736","BTN00169","LBL06076","LBL06077","LBL06078","LBL06079","LBL06928","LBL06929","LBL06951","LBL08028","BTN00069","BTN00372","BTN00008","BTN00027","MSG02007");
var _self = ecount.page.factory("ecount.page.popup.type1", "ES022P"/** page ID */, {
    /**********************************************************************
    *  widget reference
    **********************************************************************/
    ecConfig: ["user"],

    /**********************************************************************
    *  page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);

        this.searchFormParameter = {
            PROD_CD: this.PROD_CD,
            IO_TYPE: this.IO_TYPE,
            IO_DATE: this.IO_DATE,
            IO_NO: this.IO_NO,
            SER_NO: (this.IO_TYPE == "47") ? parseInt(this.SERIALKEY) - 500 : this.SERIALKEY,
            SERIAL_IDX: "",
            SERIAL_IDXS: "",
            GUBUN_CHK: this.STRCHECK,
            SERIAL_DATE: this.SERIALTIME,
            SERIAL_KEY: this.SERIALKEY,
            QTY: this.QTY,
            WH_CD: this.WH_CD,
            SORT_COLUMN: "SERIAL_IDX ASC",
        };

        this.setLayout({
            formType: "SP721",// 양식구분            
            formSeq: 1// 양식순번
        });


    },
    initEcConfig: function () {
    },
    render: function () {
        this._super.render.apply(this);
    },
    
    /**********************************************************************
    *  set widget options
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.setTitle(resource.LBL07736)
        
        if (this.viewBag.Permission.UserPermit) {
            header.add("option", [
                { id: "listSetting", label: resource.BTN00169 }
            ])
        }
    },
    
    /**********************************************************************
    *  setContents
    **********************************************************************/
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            toolbar = g.toolbar(),
            toolbar2 = g.toolbar(),
            grid = g.grid(),
            grid2 = g.grid(),
            tabContents = g.tabContents(),            
            form1 = widget.generator.form();
        var ctrl = widget.generator.control();

        var thisObj = this;


        if (this.IO_TYPE != "31" && this.IO_TYPE != "32" && this.IO_TYPE != "71" && this.IO_TYPE != "72") {
            var rdresource_F = "";
            var rdresource_E = "";

            if (this.IO_TYPE.substring(0, 1) == "1") {
                rdresource_F = resource.LBL06076;
                rdresource_E = resource.LBL06077;
            }
            else if (this.IO_TYPE.substring(0, 1) == "2") {
                rdresource_F = resource.LBL06078;
                rdresource_E = resource.LBL06079;
            }
            else if (this.IO_TYPE == "42" || this.IO_TYPE == "43" || this.IO_TYPE == "62") {
                rdresource_F = resource.LBL06928;
                rdresource_E = resource.LBL06929;
            }
            else if (this.IO_TYPE == "AS") {
                rdresource_F = resource.LBL06951;
                rdresource_E = "";
            }
            else {
                rdresource_F = resource.LBL06929;
                rdresource_E = resource.LBL06928;
            }

            toolbar.addLeft(ctrl.define("widget.radio", "rd1", "rd1").label([rdresource_F, rdresource_E]).value(["1", "2"]).select("1"))

            toolbar.addRight(ctrl.define("widget.search", "search").setOptions({
                label: '검색',
            }));
        }

        /**********************************************************************
        * 시리얼 리스트
        **********************************************************************/
        grid
            .setRowDataUrl("/Inventory/Serial/GetSerialList")
            .setFormParameter({ formType: "SP721", formSeq: 1 })
            .setKeyColumn(['SERIAL_IDX'])
            .setColumnSortable(true)
            .setColumnSortExecuting(function (e, data) {
                if (data.sortOrder == "D")
                    thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + " DESC";
                else
                    thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + " ASC";

                thisObj.contents.getGrid("dataGrid").draw(thisObj.searchFormParameter);
            })
            .setColumnFixHeader(true)
            .setCheckBoxUse(true)
            .setCheckBoxRememberChecked(true)
            .setPagingRowCountPerPage(0, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('sale011.detail', this.setGridDateLink.bind(this))
            .setCustomRowCell('sale011.udc_num_01', this.setGridDatePrice.bind(this))
            .setCustomRowCell('sale011.udc_num_02', this.setGridDatePrice.bind(this))
            .setCustomRowCell('sale011.udc_num_03', this.setGridDatePrice.bind(this));

        /**********************************************************************
        * 선택된 시리얼 리스트
        **********************************************************************/
        grid2
            .setRowDataUrl("/Inventory/Serial/GetSerialList")
            .setFormData(this.formData)
            .setKeyColumn(['SERIAL_IDX'])
            .setColumnSortable(true)
            .setColumnSortExecuting(function (e, data) {
                if (data.sortOrder == "D")
                    thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + " DESC";
                else
                    thisObj.searchFormParameter.SORT_COLUMN = data.propertyName + " ASC";

                thisObj.contents.getGrid("dataGrid2").draw(thisObj.searchFormParameter);
            })
            .setColumnFixHeader(true)
            .setCheckBoxUse(false)
            .setPagingRowCountPerPage(0, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setColumnSortDisableList(['sale011.detail'])
            .setCustomRowCell('sale011.detail', this.setGridDateSelLink.bind(this))

        toolbar2
                .addLeft(ctrl.define("widget.label", "SelLabel", "SelLabel").label(resource.LBL08028).useHTML())

        contents.add(toolbar)
            .addGrid("dataGrid", grid)
            .add(toolbar2)
            .addGrid("dataGrid2", grid2);
    },
    
    /**********************************************************************
    *  setFooter
    **********************************************************************/
    onInitFooter: function (footer, resource) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(resource.BTN00069))
            .addLeft(ctrl.define("widget.button", "New").label(resource.BTN00372));

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(resource.BTN00008));

        footer.add(toolbar);
    },
    
    /**********************************************************************
    *  페이지 로드 후 이벤트
    **********************************************************************/
    onLoadComplete: function () {
        this.contents.getGrid("dataGrid").draw(this.searchFormParameter);

        this.searchFormParameter.SERIAL_IDX = "";
        this.searchFormParameter.SERIAL_IDXS = $.isNull(this.SERIALNO) ? "" : this.SERIALNO;

        //if (!$.isNull(this.SERIALNO)){
            this.contents.getGrid("dataGrid2").draw(this.searchFormParameter);
        //}

        $(".pull-left")[2].innerHTML = String.format($(".pull-left")[2].innerHTML, 0);
    },

    setGridDateSelLink: function (value, rowItem) {
        var option = {};

        option.data = ' ';
        option.dataType = "1";
        option.type = "widget.link";
        option.event = {
            'click': function (e, data) {
            }.bind(this)
        };
        return option;
    },

    /**********************************************************************
    *  [grid] 링크 클릭
    **********************************************************************/
    setGridDateLink: function (value, rowItem) {
        var option = {};

        option.data = this.viewBag.Resource.BTN00027;
        option.dataType = "1";
        option.type = "widget.link";
        option.event = {
            'click': function (e, data) {
                this.setGridDateLinkPOP(data);
                this.close();
            }.bind(this)
        };
        return option;
    },

    /**********************************************************************
    *  [grid] 가격 정보
    **********************************************************************/
    setGridDatePrice: function (value, rowItem) {
        var option = {};

        option.data = (value == "0") ? ' ' : value;
        option.dataType = "1";
        option.type = "widget.link";
        option.event = {
            'click': function (e, data) {
            }.bind(this)
        };
        return option;
    },

    /**********************************************************************
    *  [grid] 상세보기 팝업 오픈
    **********************************************************************/
    setGridDateLinkPOP: function (data) {
        var param = {
            width: 780,
            height: 500,
            strSerialIdx: data.rowItem.SERIAL_NO,
            strProdCd: this.PROD_CD,
            strAFlag: "4"
        };
        ecount.popup.openWindow('/ECMain/ESQ/ESQ200M.aspx', "ESQ200M", param, true);
    },
    
    /**********************************************************************
    *  [Footer] 적용버튼 클릭( 부모가 개발 되면 변경 값 확인 해야 한다.)
    **********************************************************************/
    onFooterApply: function (e) {

        var pos = this.POS;
        var qty = this.QTY;
        var serials = ($.isNull(this.SERIALNO) ? '' : this.SERIALNO);
        //부모의 시리얼 번호를 초기화 한다.
        //opener.document.getElementById("hidserialno" + pos).value = "";

        var iNewQty = serials == "" ? 0 : serials.split("ㆍ").length;
        if (this.contents.getControl('rd1').getValue() == "2")
            iNewQty = -iNewQty;


        var thisObj = this;

        if (iNewQty != qty) {

            ecount.confirm("컨펌창 내용", function (status) {
                if (status === true) {
                    //부모 수량 값 저장
                    //opener.document.getElementById("qty" + pos).value = iNewQty;

                    if (thisObj.IO_TYPE == "72") {
                        //부모값 변경
                        //opener.document.getElementById("old_value").value = qty;
                        //opener.fnChkQty(pos, false);
                    }
                    else if (thisObj.IO_TYPE.substring(0, 1) != "4" && thisObj.IO_TYPE != "AS" && thisObj.IO_TYPE != "59" && thisObj.IO_TYPE != "51" && thisObj.IO_TYPE != "52" && thisObj.IO_TYPE != "53" && thisObj.IO_TYPE != "62") {
                        //부모값 변경
                        //opener.document.getElementById("old_value").value = qty;
                        //opener.chk_qty(pos, 1);
                    }

                } else {
                    return false;
                }

            });
           
        }
        //부모값 변경
        //opener.document.getElementById("hidserialno" + pos).value = serials;
        //obj_img = opener.$("#serial_cd" + pos);
        //obj_img.removeClass();
        //if (Math.abs(iNewQty) > 0) {
        //    obj_img.addClass('link-yellow-shadow');
        //    opener.document.getElementById("qty" + pos).readOnly = true;
        //}
        //else {
        //    obj_img.addClass('link-gray');
        //    opener.document.getElementById("qty" + pos).readOnly = false;
        //}

        /**********************************************************************
        *  저장 로직 시작
        **********************************************************************/
        var _io_type = "";
        var _serial_idx = "";
        if (this.IO_TYPE.substring(0, 1) == "1" || this.IO_TYPE.substring(0, 1) == "2")
            _io_type = this.IO_TYPE.substring(0, 1) + "*";
        else
            _io_type = this.IO_TYPE;
        var selectedItem = this.contents.getGrid().getCheckedItem();
        $.each(selectedItem, function (i, val) {
            console.log(val);
            _serial_idx += val.SERIAL_IDX + "ㆍ";
        })

        var formData = JSON.stringify({ SERIAL_DATE: this.SERIALTIME, WID: ecount.user.WID, IO_TYPE: _io_type, SERIAL_IDX: _serial_idx, SERIAL_KEY: this.SERIALKEY });
        ecount.common.api({
            url: "/Inventory/Serial/InsertToSaleOrPurchases",
            async: false,
            data: formData,
            success: function (result) {
                console.log(result);
            }.bind(this)
        });
        /**********************************************************************
        *  저장 로직 끝
        **********************************************************************/

    },

    /**********************************************************************
    *  [Contents] 검색 버튼 클릭 이벤트
    **********************************************************************/
    onContentsSearch: function (e) {
        this.contents.getGrid().grid.settings().setPagingCurrentPage(1);
        this.searchFormParameter.SERIAL_IDX = this.contents.getControl('search').getValue().keyword;
        this.contents.getGrid("dataGrid").draw(this.searchFormParameter);

        this.searchFormParameter.SERIAL_IDX = "";
        this.searchFormParameter.SERIAL_IDXS = $.isNull(this.SERIALNO) ? "" : this.SERIALNO;
        this.contents.getGrid("dataGrid2").draw(this.searchFormParameter);
    },

    /**********************************************************************
    *  [Footer] 시리얼NO 등록
    **********************************************************************/
    onFooterNew: function (e) {
        var param = {
            width: 700,
            height: 600,
            PROD_CD: this.PROD_CD,
            PROD_DES: this.PROD_DES,
            SIZE_DES: this.SIZE_DES,
            EDIT_FLAG: "I",
            hidPage: "1",
            PARAM: this.IO_DATE + "|" + this.IO_NO + "|" + this.IO_TYPE + "||" + "" + this.STRCHECK + "|" + this.PROD_CD + "|" + this.POS + "|" + this.QTY + "|0|" + this.SERIALNO + "|" + this.SERIALTIME + "|" + this.SERIALKEY + "|" + this.SERIALNO + "|" + this.WH_CD,
            PAGE: "/ECMain/CM/ES/ES022P.aspx"
        };
        ecount.popup.openWindow('/ECMAIN/ESA/ESA009P_09.aspx', "ESA009P_09", param, true);
    },

    /**********************************************************************
    *  [HEADER] 검색창 설정
    **********************************************************************/
    onDropdownListSetting: function () {
        var param = {
            width: 800,
            height: 700,
            FORM_GUBUN: "SP721",
            FORM_SER: 1,
            CHKBOXFLAG: "Y"
        };
        ecount.popup.openWindow('/ECMain/CM3/CM100P_02.aspx', "CM100P_02", param, true);
    },

    /**********************************************************************
    *  [Footer] 닫기 버튼 클릭
    **********************************************************************/
    onFooterClose: function (e) {
        this.close();
    },

    /**********************************************************************
    *  시리얼 등록 후 다시 조회( 자식 창에서 부모창으로 보내줌)
    **********************************************************************/
    onReloadSch: function () {        
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    /**********************************************************************
    *  라디오 버튼 체인지 이벤트
    **********************************************************************/
    onChangeControl: function (e)
    {
        if (e.cid == "rd1") {
            gridChecked = this.contents.getGrid().grid.getChecked();
            if (gridChecked.length > 0) {
                ecount.alert(this.viewBag.Resource.MSG02007);
                if (e.value == "2") this.contents.getControl('rd1').setValue(1);
                else this.contents.getControl('rd1').setValue(2);
                return false;
            }

            this.searchFormParameter.GUBUN_CHK = (e.value == '1') ? 1 : -1;
            this.onContentsSearch();
        }
    },

    /**********************************************************************
    *  ## ENTER
    **********************************************************************/
    ON_KEY_ENTER: function () {
        if (!$.isNull(arguments[1]) && arguments[1].cid == "search") {
            this.onContentsSearch();
        }
    },

    
});


/**********************************************************************
*  시리얼 등록 후 다시 조회( 자식 창에서 부모창으로 보내줌)
**********************************************************************/
function searchit(){
    this._self.onReloadSch();
}
