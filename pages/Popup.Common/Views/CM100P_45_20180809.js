window.__define_resource && __define_resource("LBL05516","LBL05518","LBL05519","LBL05520","LBL05521","LBL05522","LBL05523","LBL01249","LBL02513","LBL02512","BTN00033","MSG01809","MSG01810","MSG01811","MSG02887","LBL00916","LBL01957","BTN00069","BTN00008","MSG01801","MSG01802","MSG01803","MSG01804","MSG01805","MSG01806","MSG01807");
/****************************************************************************************************
1. Create Date : 2015.10.28
2. Creator     : Le Dan
3. Description : Set formula for top section
4. Precaution  :
5. History     : 2016/02/11 Youngjun Jeon 내외자 리스트 로직 추가 및 저장 로직 수정
                                          Edit and add list items and save logic  
6. Old File    : CM100P_16.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_45", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    lt: 0,          //왼쪽괄호 left bracket
    rt: 0,          //오른쪽괄호 right bracket
    tc_cnt: 0,      //계산카운트 calc count
    th_cnt: 0,      //항목카운트  item count
    ts_cnt: 0,      //숫자 number
    na_cnt: 0,      //나누기 카운트 divide count
    first_cnt: 0,   //처음작성인지구분 whether first or not
    com_cnt: 0,     //콤마 comma
    calc_cnt: 0,    //R,C,F
    old_first_cnt_domestic: 0,
    old_first_cnt_foreign: 0,
    setAutoFocusOnTabPane : false,

    // validationObj[0]--> 내자, validationObj[1]--> 외자
    validationObj: [{
        //내자
        old_lt: 0,
        old_rt: 0,
        old_tc_cnt: 0,
        old_th_cnt: 0,
        old_ts_cnt: 0,
        old_na_cnt: 0,
        old_com_cnt: 0,
        old_calc_cnt: 0,
        chkDec: 0,
        chkOpen: 0,
    }, {
        //외자
        old_lt: 0,
        old_rt: 0,
        old_tc_cnt: 0,
        old_th_cnt: 0,
        old_ts_cnt: 0,
        old_na_cnt: 0,
        old_com_cnt: 0,
        old_calc_cnt: 0,
        chkDec: 0,
        chkOpen: 0,
    }],

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
    },

    render: function () {

        this._super.render.apply(this, arguments);

        this.defaultSetting();
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark().setTitle(ecount.resource.LBL05516);
    },
    // Contents Initialization
    onInitContents: function (contents) {

        var ge = widget.generator,
            ctrl = ge.control(),
            ctrl3 = ge.control(),
            formDomestic = ge.form(),
            formForeign = ge.form(),
            toolbar1 = ge.toolbar(),
            toolbar2 = ge.toolbar(),
            controls2 = new Array(),
            form2 = ge.form(),
            toolbar3 = ge.toolbar(),
            toolbar4 = ge.toolbar(),
            controls3 = new Array(),
            form3 = ge.form(),
            toolbar3 = ge.toolbar(),
            ctrl1 = ge.control(),
            ctrl2 = ge.control(),
            controlsDomestic = new Array(),
            controlsForeign = new Array(),
            tabContents = ge.tabContents(),
            itemsDomestic = this.viewBag.InitDatas.formulaItemsDomestic.Data,
            itemsForeign = this.viewBag.InitDatas.formulaItemsForeign.Data;


        toolbar1.setOptions({ "cssToolbar": "text-center" })
                .attach(ctrl1.define("widget.button", "openBracket").label(String.format('(<br/>{0}', ecount.resource.LBL05518)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "closeBracket").label(String.format(')<br/>{0}', ecount.resource.LBL05519)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "add").label(String.format('+<br/>{0}', ecount.resource.LBL05520)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "subtract").label(String.format('-<br/>{0}', ecount.resource.LBL05521)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "multiply").label(String.format('*<br/>{0}', ecount.resource.LBL05522)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "devide").label(String.format('/<br/>{0}', ecount.resource.LBL05523)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "round").label(String.format('R<br/>{0}', ecount.resource.LBL01249)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "roundUp").label(String.format('C<br/>{0}', ecount.resource.LBL02513)).css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "roundDown").label(String.format('F<br/>{0}', ecount.resource.LBL02512)).css("btn btn-sm btn-default"));

        toolbar2.setOptions({ "cssToolbar": "text-center" })
                .attach(ctrl1.define("widget.button", "num0").label('0').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num1").label('1').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num2").label('2').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num3").label('3').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num4").label('4').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num5").label('5').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num6").label('6').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num7").label('7').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num8").label('8').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "num9").label('9').css("btn btn-sm btn-default"))
                .attach(ctrl1.define("widget.button", "decimal").label('.').css("btn btn-sm btn-default"));

        controls2.push(ctrl.define("widget.input.buttonGroup", "btnGroupDomestic", "btnGroupDomestic", "Group")
                            .value(this.tabParameter.DOMESTIC_DES)
                            .setOptions({ label: [ecount.resource.BTN00033], statusId: ["bdelete"], containsType: "gen" })
                            .readOnly()
                            .end());
        form2
            .css("table table-border-no-a table-th-left table-layout-auto")
            .useBaseForm({ _isThShow: 0 })
            .colgroup([{ width: "" }])
            .addControls(controls2);

        //내자탭 생성 domestic CREATE DOMESTIC TAB
        for (var i = 0; i < itemsDomestic.length; i++) {
            var item = itemsDomestic[i];
            controlsDomestic.push(ctrl.define("widget.link", "item" + i.toString(), item.USERCOL_CD).label(item.COL_TITLE).setOptions({ "onClick": this.selectItem.bind(this) }).end());
        }

        formDomestic.css("table table-border-no-a table-border-no-v")
            .useBaseForm({ _isThShow: 0 })
            .setColSize(3)
            .addControls(controlsDomestic);

        //상하단 여부 (재고 공통)
        //description: 상세설정이거나 상단 계산식인경우 탭 생성안함
        // no tab will be created if calculation is for the top section or that is calculation for the second level configuration

        if (this.LOCATION_TOP) {
            //탭 적용 tab config
            contents.add(ge.subTitle().title(ecount.resource.MSG01809));
            contents.add(formDomestic);
            contents.add(ge.subTitle().title(ecount.resource.MSG01810));
            contents.add(toolbar1);
            contents.add(toolbar2);
            contents.add(widget.generator.subTitle().title(ecount.resource.MSG01811));
            contents.add(form2);
            contents.add(ge.remark().title(ecount.resource.MSG02887));

        } else {
            //상세 설정이 아닌경우 case of no detail config
            if (this.FORM_TYPE !== "SD010" && this.FORM_TYPE !== "SD020" && this.FORM_TYPE !== "SD021" && this.FORM_TYPE !== "SD030") {

                //내자만 보이는경우 ONLY SHOW DOMESTIC
                if (this.SHOW_TYPE == "C" && this.F_TYPE == "0") {

                    tabContents
                        .createActiveTab("domestic", ecount.resource.LBL00916) //내자 Domestic
                        .add(ge.subTitle().title(ecount.resource.MSG01809))
                        .add(formDomestic)
                        .add(ge.subTitle().title(ecount.resource.MSG01810))
                        .add(toolbar1)
                        .add(toolbar2)
                        .add(widget.generator.subTitle().title(ecount.resource.MSG01811))
                        .add(form2)
                        .add(ge.remark().title(ecount.resource.MSG02887))

                    this.tabParameter.IS_SINGLE = true;
                    contents.add(tabContents)

                    // 내자 외자 다보이는경우 SHOW DOMESTIC AND FOREIGN ALL TOGETHER
                } else {
                    //외자일경우 생성 
                    toolbar3.setOptions({ "cssToolbar": "text-center" })
                            .attach(ctrl2.define("widget.button", "openBracket").label(String.format('(<br/>{0}', ecount.resource.LBL05518)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "closeBracket").label(String.format(')<br/>{0}', ecount.resource.LBL05519)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "add").label(String.format('+<br/>{0}', ecount.resource.LBL05520)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "subtract").label(String.format('-<br/>{0}', ecount.resource.LBL05521)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "multiply").label(String.format('*<br/>{0}', ecount.resource.LBL05522)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "devide").label(String.format('/<br/>{0}', ecount.resource.LBL05523)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "round").label(String.format('R<br/>{0}', ecount.resource.LBL01249)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "roundUp").label(String.format('C<br/>{0}', ecount.resource.LBL02513)).css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "roundDown").label(String.format('F<br/>{0}', ecount.resource.LBL02512)).css("btn btn-sm btn-default"));

                    toolbar4.setOptions({ "cssToolbar": "text-center" })
                            .attach(ctrl2.define("widget.button", "num0").label('0').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num1").label('1').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num2").label('2').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num3").label('3').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num4").label('4').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num5").label('5').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num6").label('6').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num7").label('7').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num8").label('8').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "num9").label('9').css("btn btn-sm btn-default"))
                            .attach(ctrl2.define("widget.button", "decimal").label('.').css("btn btn-sm btn-default"));

                    controls3.push(ctrl3.define("widget.input.buttonGroup", "btnGroupForeign", "btnGroupForeign", "Group")
                                        .value(this.tabParameter.FOREIGN_DES)
                                        .setOptions({ label: [ecount.resource.BTN00033], statusId: ["bdelete"], containsType: "gen" })
                                        .readOnly()
                                        .end());
                    form3
                        .css("table table-border-no-a table-th-left table-layout-auto")
                        .useBaseForm({ _isThShow: 0 })
                        .colgroup([{ width: "" }])
                        .addControls(controls3);

                    //외자탭 (foreign) 생성 CREATE FOREIGN TAB
                    for (var i = 0; i < itemsForeign.length; i++) {
                        var item = itemsForeign[i];
                        controlsForeign.push(ctrl3.define("widget.link", "item" + i.toString(), item.USERCOL_CD).label(item.COL_TITLE).setOptions({ "onClick": this.selectItem.bind(this) }).end());
                    }
                    formForeign.css("table table-border-no-a table-border-no-v")
                     .useBaseForm({ _isThShow: 0 })
                     .setColSize(3)
                     .addControls(controlsForeign);

                    //내자 domestic
                    tabContents
                        .createActiveTab("domestic", ecount.resource.LBL00916) //내자 Domestic
                        .add(ge.subTitle().title(ecount.resource.MSG01809))
                        .add(formDomestic)
                        .add(ge.subTitle().title(ecount.resource.MSG01810))
                        .add(toolbar1)
                        .add(toolbar2)
                        .add(widget.generator.subTitle().title(ecount.resource.MSG01811))
                        .add(form2)
                        .add(ge.remark().title(ecount.resource.MSG02887))

                        //외자 foreign
                        .createTab("foreign", ecount.resource.LBL01957) // 외자 Foreign
                        .add(ge.subTitle().title(ecount.resource.MSG01809))
                        .add(formForeign)
                        .add(ge.subTitle().title(ecount.resource.MSG01810))
                        .add(toolbar3)
                        .add(toolbar4)
                        .add(widget.generator.subTitle().title(ecount.resource.MSG01811))
                        .add(form3)
                        .add(ge.remark().title(ecount.resource.MSG02887))

                    contents.add(tabContents);
                }
                this.tabParameter.activeTab = "domestic";
                //상세 설정인경우 case of detail config
            } else {

                contents.add(ge.subTitle().title(ecount.resource.MSG01809));
                contents.add(formDomestic);
                contents.add(ge.subTitle().title(ecount.resource.MSG01810));
                contents.add(toolbar1);
                contents.add(toolbar2);
                contents.add(widget.generator.subTitle().title(ecount.resource.MSG01811));
                contents.add(form2);
                contents.add(ge.remark().title(ecount.resource.MSG02887));

            }
        }
    },
    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069).clickOnce())
                .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        footer.add(toolbar);
    },

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/
    onContentsOpenBracket: function (e) { this.fnAdd('(', '(', '2'); },
    onContentsCloseBracket: function (e) { this.fnAdd(')', ')', '2'); },
    onContentsAdd: function (e) { this.fnAdd('+', '+', '3'); },
    onContentsSubtract: function (e) { this.fnAdd('-', '-', '3'); },
    onContentsMultiply: function (e) { this.fnAdd('*', '*', '3'); },
    onContentsDevide: function (e) { this.fnAdd('/', '/', '3'); },
    //onContentsRound: function (e) { this.fnAdd('R(', 'ecount.calc.toFixedRound(', '5'); },
    //onContentsRoundUp: function (e) { this.fnAdd('C(', 'ecount.calc.toFixedCeil(', '5'); },
    //onContentsRoundDown: function (e) { this.fnAdd('F(', 'ecount.calc.toFixedFloor(', '5'); },
    onContentsRound: function (e) { this.fnAdd('R(', 'fnMathRound(', '5'); },
    onContentsRoundUp: function (e) { this.fnAdd('C(', 'fnMathIncrease(', '5'); },
    onContentsRoundDown: function (e) { this.fnAdd('F(', 'fnMathCutCalc(', '5'); },
    onContentsNum0: function (e) { this.fnAdd('0', '0', '4'); },
    onContentsNum1: function (e) { this.fnAdd('1', '1', '4'); },
    onContentsNum2: function (e) { this.fnAdd('2', '2', '4'); },
    onContentsNum3: function (e) { this.fnAdd('3', '3', '4'); },
    onContentsNum4: function (e) { this.fnAdd('4', '4', '4'); },
    onContentsNum5: function (e) { this.fnAdd('5', '5', '4'); },
    onContentsNum6: function (e) { this.fnAdd('6', '6', '4'); },
    onContentsNum7: function (e) { this.fnAdd('7', '7', '4'); },
    onContentsNum8: function (e) { this.fnAdd('8', '8', '4'); },
    onContentsNum9: function (e) { this.fnAdd('9', '9', '4'); },
    onContentsDecimal: function (e) { this.fnAdd('.', '.', '3'); },



    defaultSetting: function () {

        var DETAIL_FORM = ["SD010", "SD020", "SD021", "SD030"];

        /// this.tabParameter.activeTab 의 경우의 수
        /// 1. 내자만 있는경우 -> "domestic"
        /// 2. 내외자 모두 있는경우 -> default는 "domestic" 이후 foreign 클릭에따라 foreign 으로 바뀜
        /// 3. 내외자 구분이 없는경우(상단 계산식으로 설정시: LOCATION_TOP:true 일떄) -> "domestic" 으로 세팅

        /// this.tabParameter.activeTab VALUE SETTING CASES
        /// 1. A case of domestic: set to "domestic".
        /// 2. A case of both domestic and foreign designated: default->set to "domestic", then change to "foreign" if necessary.
        /// 3. A case of no tab(when calculation is for upper section[no tab will be created]) -> set to "domestic".

        this.tabParameter = {
            activeTab: "domestic",
            //IS_SINGLE: this.FOREIGN_DES != "" && this.FOREIGN_DES != null ? false : true, // 내자 만인지 외자까지 포함 인지 true: 내자만, false: 외자까지 포함 
            //탭이 없는경우 : true 탭이 하나인경우 : true 탭이 두개인경우 : false
            // no tab : true , one tab: true , two tab : false;
            IS_SINGLE: this.LOCATION_TOP != true && DETAIL_FORM.contains(this.FORM_TYPE) == false ? false : true,
            DOMESTIC_DES: this.DOMESTIC_DES == null || this.DOMESTIC_DES == "" ? "" : this.DOMESTIC_DES.trim(),
            DOMESTIC_VAL: this.DOMESTIC_VAL == null || this.DOMESTIC_VAL == "" ? "" : this.DOMESTIC_VAL.trim(),
            FOREIGN_DES: this.FOREIGN_DES == null || this.FOREIGN_DES == "" ? "" : this.FOREIGN_DES.trim(),
            FOREIGN_VAL: this.FOREIGN_VAL == null || this.FOREIGN_VAL == "" ? "" : this.FOREIGN_VAL.trim(),
        }
        if (this.tabParameter.DOMESTIC_VAL != "") {
            this.old_formula_domestic = this.tabParameter.DOMESTIC_VAL;
            this.old_first_cnt_domestic = 1;
        }
        if (this.tabParameter.FOREIGN_VAL != "") {
            this.old_formula_foreign = this.tabParameter.FOREIGN_VAL;
            this.old_first_cnt_foreign = 1;
        }

    },

    //삭제 Delete Domestic
    onContentsBtnGroupDomestic: function (e) {

        this.tabParameter.DOMESTIC_DES = "";
        this.tabParameter.DOMESTIC_VAL = "";
        this.old_formula_domestic = "";
        this.old_first_cnt_domestic = 0;
        this.validationObj[0].old_lt = 0;
        this.validationObj[0].old_rt = 0;
        this.validationObj[0].old_tc_cnt = 0;
        this.validationObj[0].old_th_cnt = 0;
        this.validationObj[0].old_ts_cnt = 0;
        this.validationObj[0].old_na_cnt = 0;
        this.validationObj[0].old_com_cnt = 0;
        this.validationObj[0].old_calc_cnt = 0;
        this.validationObj[0].chkDec = 0;
        this.validationObj[0].chkOpen = 0;
        this.contents.getControl("btnGroupDomestic", "domestic").setValue('');
    },
    //삭제 Delete Foreign
    onContentsBtnGroupForeign: function (e) {

        this.tabParameter.FOREIGN_DES = "";
        this.tabParameter.FOREIGN_VAL = "";
        this.old_formula_foreign = "";
        this.old_first_cnt_foreign = 0;
        this.validationObj[1].old_lt = 0;
        this.validationObj[1].old_rt = 0;
        this.validationObj[1].old_tc_cnt = 0;
        this.validationObj[1].old_th_cnt = 0;
        this.validationObj[1].old_ts_cnt = 0;
        this.validationObj[1].old_na_cnt = 0;
        this.validationObj[1].old_com_cnt = 0;
        this.validationObj[1].old_calc_cnt = 0;
        this.validationObj[1].chkDec = 0;
        this.validationObj[1].chkOpen = 0;
        this.contents.getControl("btnGroupForeign", "foreign").setValue('');
    },

    onFooterApply: function () {

        // 내자만 있는경우 1(기본값), 외자포함 :2 번 반복
        // if current tab includes foreign one, loop will be excuted one more times
        var iterator = 1;
        var err = [];
        // 내외자 모두 지정된경우 
        // A case both of domestic and fpreign designated
        if (!this.tabParameter.IS_SINGLE) {
            iterator++;
        }
        for (var j = 0, len = iterator; j < len; j++) {
            var fomula = '';
            var colString = this.fnCheck(j);

          //  if (colString == 'Y')
            //    return false;

            if (!$.isArray(colString)) {

                formula = colString;

                var firstCnt = (j == 0) ? this.old_first_cnt_domestic : this.old_first_cnt_foreign;
                var idx = (j === 0) ? 0 : 1;
                var control = (idx == 0) ? this.contents.getControl("btnGroupDomestic", "domestic") : this.contents.getControl("btnGroupForeign", "foreign");


                this.lt = this.validationObj[idx].old_lt;               //왼쪽괄호
                this.rt = this.validationObj[idx].old_rt;               //오른쪽괄호
                this.tc_cnt = this.validationObj[idx].old_tc_cnt;       //계산카운트
                this.th_cnt = this.validationObj[idx].old_th_cnt;       //항목카운트 
                this.ts_cnt = this.validationObj[idx].old_ts_cnt;       //숫자
                this.na_cnt = this.validationObj[idx].old_na_cnt;       //나누기 카운트 
                this.first_cnt = firstCnt;                              //처음작성인지구분
                this.com_cnt = this.validationObj[idx].old_com_cnt;     //콤마
                this.calc_cnt = this.validationObj[idx].old_calc_cnt;   //R,C,F

                if (this.tc_cnt == 0 && (this.th_cnt == 1 || this.th_cnt == 0)) {
                    var lc = 0; //왼쪽괄호
                    var rc = 0; //오른쪽괄호
                    var i = 0;
                    var k = 0;
                    var col = formula;
                    for (k = 0; k < col.length; k++) {
                        if (col.charAt(k) == "(")
                            lc += 1;
                        if (col.charAt(k) == ")")
                            rc += 1;
                    }
                    if (lc != 0 && rc != 0 && lc != rc) {
                        err.push({ idx: j, ctrl: control, message: ecount.resource.MSG01801 });
                    }
                } else {
                    if (this.tc_cnt != 0) {
                        //3계산식이 유효하지 않습니다.\n\n연산자를 확인하세요.
                        //invalis validation, please confirm the operator proper
                        err.push({ idx: j, ctrl: control, message: ecount.resource.MSG01802 });
                    }
                    else {
                        //4계산식이 유효하지 않습니다.\n\n확인하세요.
                        //invalis validation, please confirm the operator proper
                        err.push({ idx: j, ctrl: control, message: ecount.resource.MSG01803 });
                    }
                }

            } else {
                err.push(colString[0])
            }

        }


        if (err.length == 0) {
            this.sendMessage(this, {
                DOMESTIC_DES: this.tabParameter.DOMESTIC_DES,
                DOMESTIC_VAL: this.tabParameter.DOMESTIC_VAL,
                FOREIGN_DES: this.tabParameter.FOREIGN_DES,
                FOREIGN_VAL: this.tabParameter.FOREIGN_VAL,
                callback: this.close.bind(this)
            });
        } else {
            this.setTab(err);
            return;
        }
    },



    //Close button click event
    onFooterClose: function () {
        this.close();
    },

    onChangeContentsTab: function () {

        if (!this.tabParameter.IS_SINGLE) {
            if (this.tabParameter.activeTab == "domestic") {

                this.tabParameter.DOMESTIC_DES = this.contents.getControl("btnGroupDomestic", "domestic").getValue();
                this.tabParameter.activeTab = "foreign";
                this.contents.getControl("btnGroupForeign", "foreign").setValue(this.tabParameter.FOREIGN_DES);

            } else {
                this.tabParameter.FOREIGN_DES = this.contents.getControl("btnGroupForeign", "foreign").getValue();
                this.tabParameter.activeTab = "domestic";
                this.contents.getControl("btnGroupDomestic", "domestic").setValue(this.tabParameter.DOMESTIC_DES);
            }
        }

    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/
    setTab: function (errObj) {

        var tab = "domestic";
        if (errObj.length > 1) {

            for (var i = 0, len = errObj.length; i < len; i++) {
                errObj[i].ctrl.showError(errObj[i].message);
            }
            this.contents.changeTab(tab, false);
            this.tabParameter.activeTab = "domestic";
        } else {

            if (errObj[0].idx == 0) {
                errObj[0].ctrl.showError(errObj[0].message);
                this.contents.changeTab(tab, false);
                this.tabParameter.activeTab = "domestic";
            } else {
                errObj[0].ctrl.showError(errObj[0].message);
                this.contents.changeTab("foreign", false);
                this.tabParameter.activeTab = "foreign";
            }
        }
    },

    // F8 click
    ON_KEY_F8: function () {
        if (ecount.global.isDisableAlert())
            this.onFooterApply();
    },

    selectItem: function (e) {
        this.fnAdd(e.__self.data[0].label, e.name, '1');
    },

    fnAdd: function (des, col, gubun) {

        var idx, txtDes;

        if (this.tabParameter.activeTab == "domestic") {
            idx = 0;
            txtDes = this.contents.getControl("btnGroupDomestic", "domestic");
        } else {
            idx = 1;
            txtDes = this.contents.getControl("btnGroupForeign", "foreign");
        }

        var old_des = txtDes.getValue().trim();
        var formula = "";

        if (this.tabParameter.activeTab == "domestic") {
            formula = this.tabParameter.DOMESTIC_VAL

        } else {
            formula = this.tabParameter.FOREIGN_VAL
        }


        if ((formula + col).length > 300) {
            ecount.alert(ecount.resource.MSG02887);
            return false;
        }

        if ((formula + col).indexOf('()') > -1) {
            //닫을수 없습니다 unable to close
            ecount.alert(ecount.resource.MSG01804);
            return false;
        }

        if ((formula + col).indexOf(')(') > -1) {
            //닫을수 없습니다 unable to close
            ecount.alert(ecount.resource.MSG01805);
            return false;
        }

        if (this.validationObj[idx].chkDec == 2 && gubun != '4') {
            ecount.alert(ecount.resource.MSG01802);
            return false;
        }

        //if (old_des != '' && this.validationObj[idx].chkOpen == 0 && col == '(') {
        //    //닫을수 없습니다 unable to close
        //    ecount.alert(ecount.resource.MSG01805);
        //    return false;
        //}

        var firstCnt = this.tabParameter.activeTab == "domestic" ? this.old_first_cnt_domestic : this.old_first_cnt_foreign
        //idx= 0 --> 내자 idx= 1 --> 외자
        var idx = this.tabParameter.activeTab == "domestic" ? 0 : 1;

        this.lt = this.validationObj[idx].old_lt;            //왼쪽괄호
        this.rt = this.validationObj[idx].old_rt;              //오른쪽괄호
        this.tc_cnt = this.validationObj[idx].old_tc_cnt;      //계산카운트
        this.th_cnt = this.validationObj[idx].old_th_cnt;      //항목카운트 
        this.ts_cnt = this.validationObj[idx].old_ts_cnt;      //숫자
        this.na_cnt = this.validationObj[idx].old_na_cnt;      //나누기 카운트 
        this.first_cnt = firstCnt;          //처음작성인지구분
        this.com_cnt = this.validationObj[idx].old_com_cnt;    //콤마
        this.calc_cnt = this.validationObj[idx].old_calc_cnt;  //R,C,F

        this.validationObj[idx].chkOpen = 0;

        if (gubun == "1") {
            if (this.th_cnt == 0 && this.ts_cnt == 0 && this.first_cnt == 0) {
                this.th_cnt = this.th_cnt + 1;

                if (this.tc_cnt > 0) {
                    this.tc_cnt = 0;
                }
                if (this.na_cnt == 1) {
                    this.na_cnt = 0;
                }
            } else {
                //연산자를 선택하세요. please select an operator
                ecount.alert(ecount.resource.MSG01806);
                return false;
            }
        } else if (gubun == "2") {
            if (des == ")") {
                if(this.lt < this.tc_cnt) {// if (this.lt <= 0 || this.tc_cnt > 0) {
                    //닫을수 없습니다 unable to close
                    ecount.alert(ecount.resource.MSG01804);
                    return false;
                } else {
                    this.lt = this.lt - 1;
                }
            } else {
                if (this.lt >= 0 && this.ts_cnt == 0) {
                    this.lt = this.lt + 1;
                } else {
                    //열수 없습니다. unable to open
                    ecount.alert(ecount.resource.MSG01805);
                    return false;
                }
            }
            this.validationObj[idx].chkDec = 0;
        } else if (gubun == "3") {
            if (des == '.') {
                if (this.validationObj[idx].chkDec != 1) {
                    ecount.alert(ecount.resource.MSG01802);
                    return false;
                }

                this.validationObj[idx].chkDec = 2;
            }
            else {
                this.validationObj[idx].chkOpen = 1;
            }
            if (this.ts_cnt == 1 || this.first_cnt == 1) {

                this.ts_cnt = 0;
                this.tc_cnt = 1;
                this.first_cnt = 0;
                if (des == "/")
                    this.na_cnt = 1;
            } else {
                if (this.th_cnt == 0) {
                    //항목을 먼저 선택하세요. plase select an item first
                    ecount.alert(ecount.resource.MSG01807);
                    return false;
                } else {
                    this.th_cnt = this.th_cnt - 1;
                    this.tc_cnt = 1;
                    this.ts_cnt = 0;
                    this.first_cnt = 0;
                    if (des == "/")
                        this.na_cnt = 1;
                }
            }
            if (this.validationObj[idx].chkDec != 2)
                this.validationObj[idx].chkDec = 0;

        } else if (gubun == "4") {
            if (txtDes.getValue() == "" || this.tc_cnt > 0) {
                if (this.th_cnt == 0 && this.first_cnt == 0) {
                    if (this.tc_cnt > 0) {
                        this.tc_cnt = this.tc_cnt - 1;
                    }
                    this.ts_cnt = 1;
                    this.na_cnt = 0;
                } else {
                    //연산자를 선택하세요. please select an operator first
                    ecount.alert(ecount.resource.MSG01806);
                    return false;
                }
            } else {
                if (this.tc_cnt == 0 && this.th_cnt == 0 && this.first_cnt == 0) {
                    if (this.tc_cnt > 0)
                        this.tc_cnt = this.tc_cnt - 1;

                    this.ts_cnt = 1;
                    this.na_cnt = 0;
                } else {
                    //연산자를 선택하세요. please select an operator first
                    ecount.alert(ecount.resource.MSG01806);
                    return false;
                }
            }
            if (this.validationObj[idx].chkDec >= 2)
                this.validationObj[idx].chkDec++;
            else
                this.validationObj[idx].chkDec = 1;

        } else if (gubun == "5") {
            if (this.th_cnt == 0 && this.ts_cnt == 0 && this.first_cnt == 0)
                this.lt = this.lt + 1;
            else {
                //연산자를 선택하세요. please select an operator first
                ecount.alert(ecount.resource.MSG01806);
                return false;
            }

            this.validationObj[idx].chkDec = 0;
            this.validationObj[idx].chkOpen = 1;
        }

        this.validationObj[idx].old_lt = this.lt
        this.validationObj[idx].old_rt = this.rt
        this.validationObj[idx].old_tc_cnt = this.tc_cnt
        this.validationObj[idx].old_th_cnt = this.th_cnt
        this.validationObj[idx].old_ts_cnt = this.ts_cnt
        this.validationObj[idx].old_na_cnt = this.na_cnt
        this.validationObj[idx].old_com_cnt = this.com_cnt
        this.validationObj[idx].old_calc_cnt = this.calc_cnt


        if (this.tabParameter.activeTab == "domestic") {
            this.old_first_cnt_domestic = this.first_cnt; 
        } else {
            this.old_first_cnt_foreign = this.first_cnt;
        }

        txtDes.setValue(old_des + des);

        if (this.tabParameter.activeTab == "domestic") {
            this.tabParameter.DOMESTIC_VAL += col;
            this.tabParameter.DOMESTIC_DES = old_des + des;

        } else {
            this.tabParameter.FOREIGN_VAL += col;
            this.tabParameter.FOREIGN_DES = old_des + des;
        }
    },


    fnCheck: function (catagory) {

        var formula = "";
        var old_formula = "";
        var err = [];
        if (catagory == 0) {
            formula = this.tabParameter.DOMESTIC_VAL;
            old_formula = this.old_formula_domestic;
        } else {
            formula = this.tabParameter.FOREIGN_VAL;
            old_formula = this.old_formula_foreign;
        }


        if ($.isNull(old_formula))
            old_formula = "";

        var taget_string = ($.isEmpty(formula) || $.isNull(formula)) ? "" : formula.substring(old_formula.length, formula.length);
        var return_string = "";

        if (taget_string.split("(").length != taget_string.split(")").length) {

            var control = (catagory == 0) ? this.contents.getControl("btnGroupDomestic", "domestic") : this.contents.getControl("btnGroupForeign", "foreign");
            err.push({ idx: catagory, ctrl: control, message: ecount.resource.MSG01802 });
            //this.setTab(err);
            //ecount.alert(ecount.resource.MSG01802 + "11");
            //return 'Y';
            return err;
        }

        if (taget_string.indexOf("/") == -1) { // /가 있는지 체크 check whether "/" exists
            return_string = taget_string;
        }
        else {
            var j_t = taget_string.split("/").length;  //  j_t = /갯수 

            for (var j_s = 1; j_s < j_t; j_s++) {
                var taget_string2 = taget_string.split("/");
                return_string = "";
                taget_string3 = "";

                for (var j_0 = 0; j_0 < taget_string2.length; j_0++) {
                    if (j_0 < j_s)
                        return_string += taget_string2[j_0] + "/";
                    else {
                        taget_string3 += taget_string2[j_0];
                        if (j_0 != (taget_string2.length - 1))
                            taget_string3 += "/";
                    }
                } //for end 

                var j = 0;
                var nullif = "N";

                if (taget_string3.indexOf("(") != -1) { // /가 있는지 체크 check whether "/" exists
                    //return_string += "ecount.calc.nullifchk("
                    return_string += "nullifchk("
                    nullif = "Y"
                }

                for (var j_1 = 0; j_1 < taget_string3.length; j_1++) {

                    switch (taget_string3.substr(j_1, 1)) {
                        case "(":
                            j++;
                            return_string += taget_string3.substr(j_1, 1);
                            break;
                        case ")":
                            j--;
                            if (j < 1) {
                                if (j == 0)
                                    return_string += taget_string3.substr(j_1, 1) + ",1)" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                else {
                                    if (nullif == "Y")
                                        return_string += ",1))" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                    else
                                        return_string += taget_string3.substr(j_1, taget_string3.length);
                                }

                                j_1 = taget_string3.length;
                            }
                            else
                                return_string += taget_string3.substr(j_1, 1);
                            break;
                        default:
                            return_string += taget_string3.substr(j_1, 1);
                    }
                }
                taget_string = return_string;
            }
        }


         var arrCalcs = ["fnMathRound(", "fnMathIncrease(", "fnMathCutCalc("];
        //var arrCalcs = ["ecount.calc.toFixedRound(", "ecount.calc.toFixedCeil(", "ecount.calc.toFixedFloor("];
        taget_string = return_string;

        for (var ii = 0; ii < 3; ii++) {
            if (taget_string.indexOf(arrCalcs[ii]) == -1) { // /가 있는지 체크 check whether "/" exists 
                return_string = taget_string;
            }
            else {
                var j_t = taget_string.split(arrCalcs[ii]).length;  //  j_t = /갯수 count

                for (var j_s = 1; j_s < j_t; j_s++) {
                    var taget_string2 = taget_string.split(arrCalcs[ii]);
                    return_string = "";
                    taget_string3 = "";
                    for (var j_0 = 0; j_0 < taget_string2.length; j_0++) {
                        if (j_0 < j_s)
                            return_string += taget_string2[j_0] + arrCalcs[ii];
                        else {
                            taget_string3 += taget_string2[j_0];

                            if (j_0 != (taget_string2.length - 1))
                                taget_string3 += arrCalcs[ii];
                        }
                    }//for end

                    var j = 1;
                    for (var j_1 = 0; j_1 < taget_string3.length; j_1++) {

                        switch (taget_string3.substr(j_1, 1)) {
                            case "(":
                                j++;
                                return_string += taget_string3.substr(j_1, 1);

                                break;
                            case ")":
                                j--;
                                if (j == 0) {
                                    return_string += ",0)" + taget_string3.substr(j_1 + 1, taget_string3.length);
                                    j_1 = taget_string3.length;
                                }
                                else
                                    return_string += taget_string3.substr(j_1, 1);
                                break;
                            default:
                                return_string += taget_string3.substr(j_1, 1);
                        }
                    }
                    taget_string = return_string;
                }
            }
        }

        return_string = old_formula + return_string;

        return return_string
    }
});