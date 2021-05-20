window.__define_resource && __define_resource("LBL11580","LBL01587","LBL11581","LBL11582","LBL11583","LBL11584","LBL11585","BTN00545","BTN00008","MSG06600","MSG30001","MSG06620","MSG06621","MSG06624","MSG06625","MSG00679");
/****************************************************************************************************
1. Create Date : 2016.10.09
2. Creator     : 고흥모
3. Description : Graph Page Setup
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "GraphSetUp", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    off_key_esc: true,
    axis: null,

    x1ColumnId: null,
    x2ColumnId: null,
    y1ColumnId: null,
    y2ColumnId: null,

    x1Title: null,
    x2Title: null,
    y1Title: null,
    y2Title: null,
    graphType: null,
    graphTitle :null,

    /**********************************************************************
    * page init
    **********************************************************************/

    //초기화
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        //this.pageSetup 여기서 설정해주나, onInitContents 쪽에서 초기화 해주나 상관없음.
    },
    //렌더
    render: function () {
        this._super.render.apply(this);
    },
    /********************************************************************** 
    * form render layout setting [setHeader, setContents, setFooter ...](화면 구성)  
    **********************************************************************/

    //헤더 설정
    onInitHeader: function (header) {
        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL11580);  //paget setting
    },

    //컨텐츠 설정
    onInitContents: function (contents) {
         //위젯 인스턴스 생성
        var g = widget.generator,
            ctrl = g.control(),
            form = g.form();

        this.axis = JSON.parse(this.axisInfo);

        this.graphTitle = this.axis.graphTitle;

        var x_axis = this.axis.xaxis;
        var y_axis = this.axis.yaxis;
        var xoption = new Array(x_axis.length);
        var yoption = new Array(y_axis.length);

        
        for (var i = 0; i < x_axis.length; i++) {
            xoption[i] = [x_axis[i].id, x_axis[i].title];
        }

        for (var j = 0; j < y_axis.length; j++) {
            yoption[j] = [y_axis[j].id, y_axis[j].title];
        }
        
        var resource = ecount.resource;
        
        if (xoption == undefined || xoption == null || xoption.length == 0) {
            xoption.insert(0, ['', ecount.resource.LBL01587]);
        }

        if (yoption == undefined || yoption == null || yoption.length == 0) {
            yoption.insert(0, ['', ecount.resource.LBL01587]);
        }
        //LBL

        //선택   LBL01587



        form.template("register")
            .add(ctrl.define("widget.select", "X1", "X1", ecount.resource.LBL11581)       // 비교대상1                 
                    .option(
                        xoption
                    )
                    .select(xoption[0])
                   
                    .end()
                )

            .add(ctrl.define("widget.select", "X2", "X2", ecount.resource.LBL11582)       // 비교대상2                    
                    .option(
                        xoption.insert(0, ['', ecount.resource.LBL01587])
                    )
                   // .select(this.pageSetup.paperSize)
                    .end()
                )

            .add(ctrl.define("widget.select", "Y1", "Y1", ecount.resource.LBL11583)       // 비교값1                    
                    .option(
                        yoption
                    )
                    .select(yoption[0])
                    .end()
                )

            .add(ctrl.define("widget.select", "Y2", "Y2", ecount.resource.LBL11584)       // 비교값2                    
                    .option(
                        yoption.insert(0, ['', ecount.resource.LBL01587])
                    )
                   // .select(this.pageSetup.paperSize)
                    .end()
                )
            
            .add(ctrl.define("widget.radio.image", "GRAPH_TYPE", "GRAPH_TYPE", ecount.resource.LBL11585)
                .label(["fa fa-bar-chart", "fa fa-pie-chart",  "fa fa-area-chart", "fa fa-line-chart"])
                .value(["bar", "pie", "area", "line"]).select('bar')
               .end()
               );
            
        contents.add(form);
        
    },


    //하단 옵션 설정
    onInitFooter: function (footer, resource) {
        //위젯 인스턴스 생성
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        // apply
        toolbar.addLeft(ctrl.define("widget.button", "apply").label(this.resource.BTN00545));
        //닫기 위젯 추가
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        //툴바 추가
        footer.add(toolbar);
    },


    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //로드완료시
    onLoadComplete: function () {
        //하단 버튼 위치조정
        //  this.adjustContentsDimensions();

       
    },


    /**********************************************************************
    *  event from listener controls
    **********************************************************************/
    onInitControl: function (cid, option) {
     
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        //this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },


    //키 이벤트
    onKeyDownHandler: function (e) {
        this._super.onKeyDownHandler.apply(this, arguments);
        return true;
    },

    // 
    onFooterApply: function (e) {

        this.x1ColumnId = this.contents.getControl("X1").getSelectedItem().value;
        this.x2ColumnId = this.contents.getControl("X2").getSelectedItem().value;
        this.y1ColumnId = this.contents.getControl("Y1").getSelectedItem().value;
        this.y2ColumnId = this.contents.getControl("Y2").getSelectedItem().value;

        this.x1Title = this.contents.getControl("X1").getSelectedItem().label;
        this.x2Title = this.contents.getControl("X2").getSelectedItem().label == ecount.resource.LBL01587 ? "" : this.contents.getControl("X2").getSelectedItem().label;
        this.y1Title = this.contents.getControl("Y1").getSelectedItem().label;
        this.y2Title = this.contents.getControl("Y2").getSelectedItem().label == ecount.resource.LBL01587 ? "" : this.contents.getControl("Y2").getSelectedItem().label;

        this.graphType = this.contents.getControl("GRAPH_TYPE").getValue();



//        @WriteResource("LBL11580"),
//@WriteResource("LBL11581"),
//@WriteResource("LBL11582"),
//@WriteResource("LBL11583"),
        //@WriteResource("LBL11584"),

//@WriteResource("LBL11585"),


//        @WriteResource("MSG06600"),
//@WriteResource("MSG30001"),

//@WriteResource("MSG06620"),
//@WriteResource("MSG06621"),
        //MSG
        //파이 그래프는 하나의 비교대상과 비교값만 선택 가능합니다.   MSG06600
        //        같은 항목을 선택 할 수 없습니다.   MSG30001
        if (this.x1ColumnId == this.x2ColumnId ) {
            ecount.alert(ecount.resource.MSG06620);
            return false;
        }

        if (this.y1ColumnId == this.y2ColumnId) {
            ecount.alert(ecount.resource.MSG06621);
            return false;
        }

        if (this.x1ColumnId == "") {
            ecount.alert(ecount.resource.MSG06624);
            return false;
        }

        if (this.y1ColumnId == "") {
            ecount.alert(ecount.resource.MSG06625);
            return false;
        }


        if (this.graphType== "pie" && (this.x2ColumnId != "" || this.y2ColumnId != "")) {
            ecount.alert(ecount.resource.MSG06600);
            return false;
        }

        // 부모창의 그리드 행 개수를 확인하여, 변환할 데이터가 없을 경우 알럿 처리
        var parentGridRowCnt = this.getParentGridRowCount();

        if (parentGridRowCnt == 0) {
            this.sendMessage(this, this.setNoDataAlert.bind(this));
            this.close();
            return false;
        }
        else {
            this.sendMessage(this, this.createGraphMessageHandler.bind(this));
        }
    },

    //닫기 이벤트
    onFooterClose: function () {
        this.close();
        return false;
    },

    /**
        Move Graph Windows
    */
    createGraphMessageHandler: function (option) {
        this.onAllSubmitSelf("/ECErp/Popup.Common/GraphPage", option, '', '', '');
    },

    // 부모창의 그리드 행 개수 가져오기
    getParentGridRowCount: function () {
        var returnVal = null

        if (!$.isEmpty(this.getParentInstance(this.parentPageID)) && !$.isEmpty(this.getParentInstance(this.parentPageID).contents) && !$.isEmpty(this.getParentInstance(this.parentPageID).contents.getGrid())) {
            if (this.getParentInstance(this.parentPageID).contents.getGrid().grid.getRowCount) {
                returnVal = this.getParentInstance(this.parentPageID).contents.getGrid().grid.getRowCount();
            }
            else {
                returnVal = this.getParentInstance(this.parentPageID).contents.getGrid().grid.getTbodyRowCount();
            }
        }

        return returnVal;        
    },

    setNoDataAlert: function () {
        ecount.alert(ecount.resource.MSG00679);
    },


});
