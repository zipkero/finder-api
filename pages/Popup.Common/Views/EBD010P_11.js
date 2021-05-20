window.__define_resource && __define_resource("LBL01018","LBL02704","LBL01343","LBL01188","LBL11854","LBL12656","LBL12657","LBL17464","LBL17465","LBL04701","LBL11642","LBL11643","LBL11638","LBL17470","LBL17450","LBL11641","BTN00069","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.10.31
2. Creator     : 하상수
3. Description : 분개설정(Journal Settings)
4. Precaution  : 
5. History     : 2019.09.09 (Ngoc Han) [A19_03221] type is Dr : change value from supplyAmt to sumAmt for vatMapper  
6. MenuPath    : 
****************************************************************************************************/
ecount.page.factory("ecount.page.input", "EBD010P_11", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    pageID: null,
    header: null,
    contents: null,
    footer: null,

    pageOption: {
        sampleControlId: "",

        sumAmt: "",
        supplyAmt: "",
        vatAmt: "",
        feesAmt: "",

        sampleRowMapper: null,
        sampleRes: null
    },

    /**********************************************************************
    *  page init
    **********************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);
    },

    initProperties: function () {
        initPageOption.call(this);
        initSampleRowMapper.call(this);

        function initPageOption() {
            this.pageOption = {
                sampleControlId: "_sampleDiv",
                isFixedAsset: false,
                totalAmt: "1,200",
                sumAmt: "1,100",
                supplyAmt: "1,000",
                vatAmt: "100",
                feesAmt: "100",
                withholdingAmt: "100",
                withholdingAmt2: "900",

                sampleRes: {
                    Cr: ecount.resource.LBL01018,   // 대변
                    Dr: ecount.resource.LBL02704,   // 차변
                    Cash: ecount.resource.LBL01343, // 현금/보통예금
                    Receivable: ecount.resource.LBL01188,   // 미수금
                    Payable: ecount.resource.LBL11854,   // 미지급금
                    FixedAssetDisposalGainOrLoss: ecount.resource.LBL12656    // 고정자산 유형자산처분이익
                }
            };

            this.pageOption.isFixedAsset = this.viewBag.DefaultOption.TrxType == "40" && this.viewBag.DefaultOption.SerNo == "10";

            if (this.pageOption.isFixedAsset == true) {
                this.CR_GYE_DES1 = ecount.resource.LBL12657;
            }

            if ($.isEmpty(this.CR_GYE_DES1) == true) {
                this.CR_GYE_DES1 = ecount.resource.LBL12657;
            }

            if ($.isEmpty(this.DR_GYE_DES4) == true) {
                this.DR_GYE_DES4 = ecount.resource.LBL17464;
            }

            if ($.isEmpty(this.CR_GYE_DES4) == true) {
                this.CR_GYE_DES4 = ecount.resource.LBL17465;
            }
        }

        function initSampleRowMapper() {
            //===========================================
            // Cash
            //===========================================
            var cashMapper = {};

            if (this.IoGubun == "1") {
                //---------------------------
                // 매출 (Sales)
                //---------------------------
                cashMapper = {
                    //-----------------------
                    // 대체분개 (Alternal)
                    //-----------------------
                    "A": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        { type: "dr", label: this.pageOption.sampleRes.Cash, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.DR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true }
                    ],
                    //-----------------------
                    // 직접분개 (Manual)
                    //-----------------------
                    "M": [
                        { type: "dr", label: this.pageOption.sampleRes.Cash, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                    ]
                };

                //--------------------------------
                // 고정자산 추가분개 (Fixed Asset)
                //--------------------------------
                if (this.pageOption.isFixedAsset == true) {
                    cashMapper["A"].insert(3, { type: "cr", label: this.pageOption.sampleRes.FixedAssetDisposalGainOrLoss, value: this.pageOption.supplyAmt, isInfo: false });
                    cashMapper["A"].insert(3, { type: "cr", label: this.CR_GYE_DES1, value: "-" + this.pageOption.supplyAmt, isInfo: false });
                    
                    cashMapper["M"].insert(3, { type: "cr", label: this.pageOption.sampleRes.FixedAssetDisposalGainOrLoss, value: this.pageOption.supplyAmt, isInfo: false });
                    cashMapper["M"].insert(3, { type: "cr", label: this.CR_GYE_DES1, value: "-" + this.pageOption.supplyAmt, isInfo: false });
                }

            } else {
                //---------------------------
                // 매입 (Purchases)
                //---------------------------
                cashMapper = {
                    //-----------------------
                    // 대체분개 (Alternal)
                    //-----------------------
                    "A": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "dr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.pageOption.sampleRes.Cash, value: this.pageOption.sumAmt, isInfo: true }
                    ],
                    //-----------------------
                    // 직접분개 (Manual)
                    //-----------------------
                    "M": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        { type: "cr", label: this.pageOption.sampleRes.Cash, value: this.pageOption.sumAmt, isInfo: true }
                    ]
                };
            }

            //===========================================
            // Account
            //===========================================
            var accountMapper = {};

            if (this.IoGubun == "1") {
                //---------------------------
                // 매출 (Sales)
                //---------------------------
                accountMapper = {
                    //-----------------------
                    // 대체분개 (Alternal)
                    //-----------------------
                    "A": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        { type: "dr", label: this.pageOption.sampleRes.Receivable, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.DR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true }
                    ],
                    //-----------------------
                    // 직접분개 (Manual)
                    //-----------------------
                    "M": [
                        { type: "dr", label: this.pageOption.sampleRes.Receivable, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                    ]
                };

                //--------------------------------
                // 고정자산 추가분개 (Fixed Asset)
                //--------------------------------
                if (this.pageOption.isFixedAsset == true) {
                    accountMapper["A"].insert(3, { type: "cr", label: this.pageOption.sampleRes.FixedAssetDisposalGainOrLoss, value: this.pageOption.supplyAmt, isInfo: false });
                    accountMapper["A"].insert(3, { type: "cr", label: this.CR_GYE_DES1, value: "-" + this.pageOption.supplyAmt, isInfo: false });

                    accountMapper["M"].insert(3, { type: "cr", label: this.pageOption.sampleRes.FixedAssetDisposalGainOrLoss, value: this.pageOption.supplyAmt, isInfo: false });
                    accountMapper["M"].insert(3, { type: "cr", label: this.CR_GYE_DES1, value: "-" + this.pageOption.supplyAmt, isInfo: false });
                }

            } else {
                //---------------------------
                // 매입 (Purchases)
                //---------------------------
                accountMapper = {
                    //-----------------------
                    // 대체분개 (Alternal)
                    //-----------------------
                    "A": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "dr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.pageOption.sampleRes.Payable, value: this.pageOption.sumAmt, isInfo: true }
                    ],
                    //-----------------------
                    // 직접분개 (Manual)
                    //-----------------------
                    "M": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        { type: "cr", label: this.pageOption.sampleRes.Payable, value: this.pageOption.sumAmt, isInfo: true },
                    ]
                };
            }

            //===========================================
            // Fees
            //===========================================
            var feesMapper = {};

            if (this.IoGubun == "1") {
                //---------------------------
                // 매출 (Sales)
                //---------------------------
                feesMapper = {
                    //-----------------------
                    // 대체분개 (Alternal)
                    //-----------------------
                    "A": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES3, value: this.pageOption.feesAmt, isInfo: true },
                        { type: "cr", label: this.DR_GYE_DES1, value: this.pageOption.feesAmt, isInfo: true }
                    ],
                    //-----------------------
                    // 직접분개 (Manual)
                    //-----------------------
                    "M": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: true },
                        { type: "dr", label: this.DR_GYE_DES3, value: this.pageOption.feesAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                    ]
                };
                
            } else {
                //---------------------------
                // 매입 (Purchases)
                //---------------------------

                // 지출결의서인 경우
                if (this.TrxType == "98" && this.SerNo == "04") {
                    feesMapper = {
                        //-----------------------
                        // 대체분개 (Alternal)
                        //-----------------------
                        "A": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: true },
                            { type: "dr", label: this.DR_GYE_DES3, value: this.pageOption.feesAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.feesAmt, isInfo: true },
                        ],
                        //-----------------------
                        // 직접분개 (Manual)
                        //-----------------------
                        "M": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES3, value: this.pageOption.feesAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        ]
                    };
                } else {
                    feesMapper = {
                        //-----------------------
                        // 대체분개 (Alternal)
                        //-----------------------
                        "A": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                            { type: "dr", label: this.DR_GYE_DES3, value: this.pageOption.feesAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.feesAmt, isInfo: true },
                        ],
                        //-----------------------
                        // 직접분개 (Manual)
                        //-----------------------
                        "M": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES3, value: this.pageOption.feesAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.totalAmt, isInfo: true },
                        ]
                    };
                }
                

            }

            //===========================================
            // vat
            //===========================================
            var vatMapper = {};
            
            if (this.IoGubun == "1") {
                //---------------------------
                // 매출 (Sales)
                //---------------------------
                vatMapper = {
                    //-----------------------
                    // 대체분개 (Alternal)
                    //-----------------------
                    "A": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.vatAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: true }
                    ],
                    //-----------------------
                    // 직접분개 (Manual)
                    //-----------------------
                    "M": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: true },
                    ]
                };
            } else {
                //---------------------------
                // 매입 (Purchases)
                //---------------------------
                vatMapper = {
                    //-----------------------
                    // 대체분개 (Alternal)
                    //-----------------------
                    "A": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.vatAmt, isInfo: true },
                    ],
                    //-----------------------
                    // 직접분개 (Manual)
                    //-----------------------
                    "M": [
                        { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                        { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: true },
                        { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                    ]
                };
            }

            //===========================================
            // Withholding
            //===========================================
            var withholdingMapper = {};
            
            if (this.IoGubun == "1") {
                //---------------------------
                // 매출 (Sales)
                //---------------------------

                // 매출전표, 고정자산 감소 메뉴일경우
                if ((this.TrxType == "40" && this.SerNo == "01") || (this.TrxType == "40" && this.SerNo == "10")) {
                    withholdingMapper = {
                        //-----------------------
                        // 대체분개 (Alternal)
                        //-----------------------
                        "A": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true },
                            { type: "cr", label: this.DR_GYE_DES1, value: this.pageOption.withholdingAmt, isInfo: true },
                        ],
                        //-----------------------
                        // 직접분개 (Manual)
                        //-----------------------
                        "M": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: true },
                            { type: "dr", label: this.DR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true},
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                        ]
                    };
                } else {
                    withholdingMapper = {
                        //-----------------------
                        // 대체분개 (Alternal)
                        //-----------------------
                        "A": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true },
                            { type: "cr", label: this.DR_GYE_DES1, value: this.pageOption.withholdingAmt, isInfo: true },
                        ],
                        //-----------------------
                        // 직접분개 (Manual)
                        //-----------------------
                        "M": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.withholdingAmt2, isInfo: true },
                            { type: "dr", label: this.DR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false }
                        ]
                    };
                }
                
            } else {
                //---------------------------
                // 매입 (Purchases)
                //---------------------------

                // 매입전표, 고정자산 증가, (세금)계산서수령 메뉴일경우
                if ((this.TrxType == "45" && this.SerNo == "01") || (this.TrxType == "45" && this.SerNo == "10") || (this.TrxType == "45" && this.SerNo == "04")) {

                    withholdingMapper = {
                        //-----------------------
                        // 대체분개 (Alternal)
                        //-----------------------
                        "A": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.sumAmt, isInfo: true },
                            { type: "dr", label: this.CR_GYE_DES1, value: this.pageOption.withholdingAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true },
                        ],
                        //-----------------------
                        // 직접분개 (Manual)
                        //-----------------------
                        "M": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "dr", label: this.DR_GYE_DES2, value: this.pageOption.vatAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true },
                        ]
                    };

                } else {

                    withholdingMapper = {
                        //-----------------------
                        // 대체분개 (Alternal)
                        //-----------------------
                        "A": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: true },
                            { type: "dr", label: this.CR_GYE_DES1, value: this.pageOption.withholdingAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true },
                        ],
                        //-----------------------
                        // 직접분개 (Manual)
                        //-----------------------
                        "M": [
                            { type: "dr", label: this.DR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: false },
                            { type: "cr", label: this.CR_GYE_DES1, value: this.pageOption.supplyAmt, isInfo: true },
                            { type: "cr", label: this.CR_GYE_DES4, value: this.pageOption.withholdingAmt, isInfo: true },
                        ]
                    };

                }

                
            }

            this.pageOption.sampleRowMapper = {
                cash: cashMapper,
                account: accountMapper,
                fees: feesMapper,
                vat: vatMapper,
                withholding: withholdingMapper
            };
        }
    },

    render: function () {
        this.initProperties();
        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //Header Option
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL04701).notUsedBookmark();
    },

    //Content
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            ctrl = generator.control();

        //======================================
        // 통장/현금
        //======================================
        if (this.UseCash == true) {
            var settingPanel = getSettingPanel.call(this, "cash");
            contents.add(settingPanel);
        }

        //======================================
        // 계정
        //======================================
        if (this.UseAccount == true) {
            var settingPanel = getSettingPanel.call(this, "account");
            contents.add(settingPanel);
        }

        //======================================
        // 수수료
        //======================================
        if (this.UseFees == true) {
            var settingPanel = getSettingPanel.call(this, "fees");
            contents.add(settingPanel);
        }

        //======================================
        // 부가세
        //======================================
        if (this.UseVat == true) {
            var settingPanel = getSettingPanel.call(this, "vat");
            contents.add(settingPanel);
        }

        //======================================
        // 원천징수
        //======================================
        if (this.UseWithholding == true) {
            var settingPanel = getSettingPanel.call(this, "withholding");
            contents.add(settingPanel);
        }

        function getSettingPanel(settingType) {
            var setting = generator.settingPanelContainer(),
                toolbar = generator.toolbar(),
                sampleTitle = generator.remark(),
                sample = generator.div();

            //----------------------------------
            // Title
            //----------------------------------
            var header = { title: "" };;

            switch (settingType) {
                case "cash":
                    header.title = ecount.resource.LBL11642;
                    break;
                case "account":
                    header.title = ecount.resource.LBL11643;
                    break;
                case "fees":
                    header.title = ecount.resource.LBL11638;
                    break;
                case "vat":
                    header.title = ecount.resource.LBL17470;
                    break;
                case "withholding":
                    header.title = ecount.resource.LBL17450;
                    break;
            }

            //----------------------------------
            // Option
            //----------------------------------
            var selectedValue = "A";
            switch (settingType) {
                case "cash":
                    selectedValue = this.CASH_JRNL_TYPE;
                    break;
                case "account":
                    selectedValue = this.ACCOUNT_JRNL_TYPE;
                    break;
                case "fees":
                    selectedValue = this.FEES_JRNL_TYPE;
                    break;
                case "vat":
                    selectedValue = this.VAT_JNLZ_TYPE_CD;
                    break;
                case "withholding":
                    selectedValue = this.WTHDG_JNLZ_TYPE_CD;
                    break;
            }

            toolbar.attach(ctrl.define("widget.radio", settingType, settingType)
                               .label([this.JRNL_TYPE_DES1, this.JRNL_TYPE_DES2]) // 대체분개, 직접분개
                               .value(["A", "M"])
                               .select([selectedValue]));

            //----------------------------------
            // Sample Title
            //----------------------------------
            sampleTitle.title(ecount.resource.LBL11641).css("");  // 분개예시

            //----------------------------------
            // Sample
            //----------------------------------
            sample.id(settingType + this.pageOption.sampleControlId).css("well").html(this.getSampleHtml(settingType, selectedValue));

            //----------------------------------
            // Add
            //----------------------------------
            setting.header(header)
                   .add(toolbar)
                   .add(sampleTitle)
                   .add(sample);

            return setting;
        }
    },

    //Footer(하단)
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(this.resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(this.resource.BTN00008));

        footer.add(toolbar);
    },

    onFooterApply: function () {
        var result = {
            CASH_JRNL_TYPE: this.UseCash == true ? this.contents.getControl("cash").getValue() : this.CASH_JRNL_TYPE,
            ACCOUNT_JRNL_TYPE: this.UseAccount == true ? this.contents.getControl("account").getValue() : this.ACCOUNT_JRNL_TYPE,
            FEES_JRNL_TYPE: this.UseFees == true ? this.contents.getControl("fees").getValue() : this.FEES_JRNL_TYPE,
            VAT_JNLZ_TYPE_CD: this.UseVat == true ? this.contents.getControl("vat").getValue() : this.VAT_JNLZ_TYPE_CD,
            WTHDG_JNLZ_TYPE_CD: this.UseWithholding == true ? this.contents.getControl("withholding").getValue() : this.WTHDG_JNLZ_TYPE_CD,
        };

        this.sendMessage(this, {
            data: result,
            callback: this.close.bind(this)
        });
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {

    },

    onChangeControl: function (event, data) {
        switch (event.cid) {
            case "cash":
            case "account":
            case "fees":
            case "vat":
            case "withholding":
                var sampleHtml = this.getSampleHtml(event.cid, event.value);
                this.getSampleControl(event.cid).modifyHtml(sampleHtml);
                this.adjustContentsDimensions();
                break;
        }
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/ 
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },


    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    ON_KEY_F8: function () {
        this.onFooterApply();
    },

    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);
        return true;
    },

    //닫기버튼(Close Button)
    onFooterClose: function () {
        this.close();
        return false;
    },


    /********************************************************************** 
    * user function 
    **********************************************************************/
    getSampleHtml: function (settingType, jrnlType) {
        var table = $("<div><table class='table table-layout-auto table-border-no-a'><tbody></tbody></table></div>");

        //-------------------------------------------------
        // Get Rows
        //-------------------------------------------------
        var rows = this.pageOption.sampleRowMapper[settingType][jrnlType];

        //-------------------------------------------------
        // Add Rows
        //-------------------------------------------------
        var prefix = { dr: this.pageOption.sampleRes.Dr + " ", cr: this.pageOption.sampleRes.Cr + " " };
        var body = table.find("tbody");

        $.each(rows, function (i, row) {
            var tr = $("<tr></tr>");

            switch (row.type) {
                case "dr":
                    tr.append($("<td></td>").text(prefix[row.type] + row.label));
                    tr.append($("<td></td>").text(row.value).addClass("text-right"));
                    tr.append("<td></td><td></td><td></td>");
                    break;
                case "cr":
                    tr.append("<td></td><td></td><td></td>");
                    tr.append($("<td></td>").text(prefix[row.type] + row.label));
                    tr.append($("<td></td>").text(row.value).addClass("text-right"));
                    break;
            }

            if (row.isInfo == true) {
                tr.addClass("text-info");
            }

            body.append(tr);
        }.bind(this));

        //-------------------------------------------------
        // Return Html
        //-------------------------------------------------
        return table.html();
    },

    // 샘플콘트롤 가져오기 (Get Sample Control)
    getSampleControl: function (settingType) {
        return this.contents.getDiv(settingType + this.pageOption.sampleControlId);
    }
});
