window.__define_resource && __define_resource("BTN00534","LBL06955","LBL06956","BTN00452","MSG01136","MSG05526","BTN00065");
/****************************************************************************************************
1. Create Date : 2015.05.05
2. Creator     : Bao
3. Description : 추가항목등록  
4. Precaution  :
5. History     : 2015.09.01 PHI.LUONG: CODE REFACTORING: RESOURCE CHANGES, CHANGE onBlurHandler TO onFocusOutControlHandler
                 2015.10.21 Youngjun Jeon: bug fix for number type update , CODE_CLASS param change
                 2020.07.08 Lee Sangjin - A20_03160 리팩토링
6. MenuPath    : 재고I > 기초등록 > 거래처등록 > 신규 > 옵션 > 추가항목등록
                 Inv. I > Setup > PIC/Employee > New (PIC/Employee Registration) > Option > Add. Field
****************************************************************************************************/
ecount.page.factory("ecount.page.common", "ESA002P_01", {

    /**************************************************************************************************** 
     * page initialize
     ****************************************************************************************************/

    /********************************************************************** 
     *   Init Data Setting function
     **********************************************************************/
    //page init event
    init: function (option) {
        //footer 레이어 하단에 고정
        this.isFixedFooter = true;
        this._super.init.apply(this, arguments);
    },

    //page render event
    render: function (option) {
        //이벤트시에 사용하는 정보 function
        this.getActionCommonParam();

        this._super.render.apply(this, arguments);
    },

    //서버에서 내려준 값 변수에 설정
    initProperties: function () {
        this.pageOption.charColumn = this.viewBag.InitDatas.WhLoad;
        this.pageOption.intColumn = this.viewBag.InitDatas.WhLoadNext;
        this.pageOption.menu_Gubun = this.menu_Gubun;

        //초기에 내려오는 데이터가 없을 경우. 
        if(this.pageOption.charColumn.length==0){
            for(var i=0;i<6;i++){
                this.pageOption.charColumn.push({CODE_NO:"A100"+(i+1), CODE_DES:"", CODE_CLASS:"A10"})
            }
        }
        if(this.pageOption.intColumn.length==0){
            for(var i=0;i<3;i++){
                this.pageOption.intColumn.push({CODE_NO:"A130"+(i+1), CODE_DES:"", CODE_CLASS:"A13"})
            }
        }

        //페이지 기초정보
        this.pageInfo = {
            name: "ESA002P_01", //현재 페이지 name
            path: "/ECERP/Popup.Common/ESA002P_01", //현재페이지 url                        
            title: ecount.resource.BTN00534,
            permissions: this.viewBag.Permission.Self, // 권한

            pageHeader: [{
                group: "header", id: "header",
                settingInfo: { bookmark: false },
                child: [{ unit: "widget", type: "outputTitle"}] //타이틀
            }],
            pageContents: [{
                group: "contents", id: "contents",
                child: [{ group: "form", type: "simpleInput", child: [] }],
            }],
            pageFooter: [{
                group: "footer", id: "footer",
                child: [{ 
                    group: "toolbar", id: "footerToolbarDefault", sortType: "input-basic-footer",
                    child: [
                        "additionalSave" /*저장*/ ,
                        "slipClose" /*닫기*/ ,
                        "slipHistory" /*이력*/ ,
                    ],
                }]
            }],
            pageFunction: [],
        }
    },

    // api 통신을 위한 파라미터 설정
    getActionCommonParam: function () {
        this.pageInfo.params = {
            footer: {
                //이력보기
                history: function () {
                    return {
                        url: "/ECERP/Popup.Search/CM100P_31",
                        param: {
                            width: 450,
                            height: 150,
                            lastEditTime: this.pageOption.charColumn[0].WDATE,
                            lastEditId: this.pageOption.charColumn[0].WID
                        }
                    };
                }.bind(this),
            }
        }
    },

    /********************************************************************** 
     *   common option function 
     **********************************************************************/

    onInitGroupFormSimpleInput: function () {
        return {
            /**********************************************************************
             *  event function
             **********************************************************************/
            //init
            init: function (option) {
                eccomposite_v1.group.prototype.init.apply(this, arguments);

                //사용할 파일 업로드
                this.ecRequire(["ecount.errorMessage", "ecmodule.common.defaultValue"]);
            },

            //render
            render: function (parent) {
                eccomposite_v1.group.prototype.render.apply(this, arguments);
                this.createLayout(parent);
            },

            //createLayout
            createLayout: function (parent) {
                var g = widget.generator,
                    ctrl = g.control(),
                    toolbar1 = g.toolbar(),
                    toolbar2 = g.toolbar();
                var charColumn = this.pageOption.charColumn,
                    intColumn = this.pageOption.intColumn;

                //문자형식
                toolbar1.addLeft(ctrl.define("widget.label", "lblTitle1", "lblTitle1", "").label(ecount.resource.LBL06955).css("text-bold")); 

                //숫자형식
                toolbar2.addLeft(ctrl.define("widget.label", "lblTitle2", "lblTitle2", "").label(ecount.resource.LBL06956).css("text-bold")); 
                
                
                parent.add(toolbar1);
                parent.add(this.makeFormControl(charColumn));
                parent.add(toolbar2);
                parent.add(this.makeFormControl(intColumn));
            },

            //control 생성
            makeFormControl:function(list){
                var form = widget.generator.form(),
                    ctrl = widget.generator.control();

                form.template("input");
                for(var i=0;i<list.length;i++){
                    form.add(ctrl.define("widget.input.general", list[i].CODE_NO, list[i].CODE_NO, ecount.resource.BTN00452 + (i+1))
                        .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
                        .popover(String.format(ecount.resource.MSG05526, (i+1)))
                        .value(list[i].CODE_DES).end())
                }
                return form;
            },

            

            //전표의 키값 조회 사용안함
            getErrorMessageKey: function () {
                return false;
            },
        }
    },

    /********************************************************************** 
    *  page code
    **********************************************************************/
    onInitUnitWidgetAdditionalSave: function () {
        return {
            /**********************************************************************
            *  event function
            **********************************************************************/
            //init
            init: function (option) {
                eccomposite_v1.unit.widget.prototype.init.apply(this, arguments);
            },

            //render
            render: function (parent) {
                eccomposite_v1.unit.widget.prototype.render.apply(this, arguments);

                //인스턴스 추가
                this.createLayout(parent);
            },

            //유닛 생성
            createLayout: function (footer) {
                var ctrl = widget.generator.control();

                //버튼 위젯 추가
                footer.addLeft(ctrl.define("widget.button", this.id)
                    .label(ecount.resource.BTN00065));

                //단축키 등록
                this.saveShortCutKey("F8");

                //이벤트 바인딩
                this.createButtonEvent();

            },
            
            /**********************************************************************
            * public function
            **********************************************************************/

            //저장버튼 클릭
            _ON_CLICK: function (data) {
                //저장 api 
                var charParam = this.setSaveApiParam(this.pageOption.charColumn);
                var intParam = this.setSaveApiParam(this.pageOption.intColumn);

                intParam.forEach(function(item){charParam.push(item)})

                ecount.common.api({
                    url: "/SVC/Common/Infra/UpdateAddFieldPIC",
                    data: {
                        Request: {
                            Data: charParam,
                        }
                    },
                    success: function (result) {
                        var message = {
                            callback: this.close.bind(this)
                        };
                        this.sendMessage(this, message);
                    }.bind(this),
                    error: function (e) {
                        this.getControls("additionalSave").setAllowClick();
                        this.hideProgressbarDelay();
                    }.bind(this)
                });
            },

            //저장 버튼 클릭시 param 생성
            setSaveApiParam:function(list){
                var DataLists = []
                for(var i =0;i<list.length;i++){
                    var data = {
                        CODE_DES: this.getControls(list[i].CODE_NO,null,"getValue"),
                        CODE_NO: list[i].CODE_NO,
                        CODE_CLASS: list[i].CODE_CLASS,
                        MENUCATEGORY: this.pageOption.menu_Gubun,
                        USE_GUBUN : "Y",
                        ORI_PAGE : "ESA002P_01"
                        
                    };
                    // Fill data into Array
                    DataLists.push(data);
                }
                return DataLists;
            },
        }
    },

    onInitUnitWidgetSlipHistory:function(){
        return{
            isOverriding:true,
            //유닛 생성
            createLayout: function (footer) {
                var ctrl = widget.generator.control();

                if (this.pageOption.charColumn[0].WDATE) {
                    //버튼추가
                    footer.addLeft(ctrl.define("widget.button", this.realId).label("H"));
                }

                this.createButtonEvent();

            },
        }
    }
});