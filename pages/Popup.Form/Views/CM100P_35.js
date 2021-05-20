window.__define_resource && __define_resource("LBL03810","BTN00784","LBL08019","LBL06937","LBL06936","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.05.30
2. Creator     : 노지혜
3. Description : 입력코드표  (form  Code Table )
4. Precaution  : 
5. History     : 
6. MenuPath    : 양식 > 샘플보기 > 등록,수정 >입력코드표 (Template > Templates ,  Share Template >Code Table )
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_35", {

    //FormTableCode: null,
    listCnt: 1, // Item count(항목갯수)
    lastContents: 1,
    /**********************************************************************
    *  page init
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);       
    },

    initProperties: function () { 
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
        header.setTitle(ecount.resource.LBL03810);              
    },

    //본문 옵션 설정
    onInitContents: function (contents, resource) {
        var g = widget.generator,
             ctrl = g.control(),
             subTitle = g.subTitle(),
             self = this;

        subTitle.title(ecount.resource.LBL03810)
                .add(ctrl.define("widget.button.search", "searchText").label(ecount.resource.BTN00784).end())

        contents.add(subTitle)

        var lst = self.viewBag.InitDatas.TableCode,
            item = new Array();

        lst.forEach(function (o,index) {   
            var typeName = "";
            if (self.formtype != "GF010") {
                if (o.TOPBOTTOM_TYPE == "A")
                    typeName = "(" + ecount.resource.LBL08019 + ")";
                else if (o.TOPBOTTOM_TYPE == "B")
                    typeName = "(" + ecount.resource.LBL06937 + ")";
                else
                    typeName = "(" + ecount.resource.LBL06936 + ")";
            }
            
            item.push({
                label: o.SUB_REX_DES,
                value: o.INPUT_CODE,
                isTip: !$.isEmpty(o.TIP_REX_CD) ? true : false,
                type: typeName,
                message: o.TIP_REX_DES
            });
               
            if (lst.length -1 == index || lst[index + 1].DIVISION_SORT != o.DIVISION_SORT) {
                var panel2 = g.panel();
                panel2.header({ title: o.REX_DES })
                panel2.add(ctrl.define("widget.list.inputCode", "inputCode" + self.listCnt, "inputCode" + self.listCnt)
                               .setOptions({ sArrContents: item })
                               .setOptions({ onClick: self.onTipMessage.bind(self) })
                               .end());
                contents.add(panel2);
                item = new Array();
                self.listCnt++;
            } 
        });
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
                
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));    
        footer.add(toolbar);
    },
  
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //페이지 로드 완료 이벤트
    onLoadComplete: function (e) {  
    },

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/  
    onContentsSearchText: function (event) {
        this.contents.getControl("searchText").toggleSearchText();
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //버튼 이벤트 클릭전 호출 
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //권한 체크 
        return true;
    },  
      
    //닫기버튼
    onFooterClose: function () {
        this.close();
    },   
  
    //TIP 클릭시
    onTipMessage: function (event, data) {
        ecount.alert(event.message);
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/

    _ON_KEY_F3: function (event) {
        this.contents.getControl("searchText").toggleSearchText();
        event.preventDefault();
    },

    // KEY_ENTER
    ON_KEY_ENTER: function (event, target) {
        var intSearchCount = 0;
        for (var i = this.lastContents; i < this.listCnt ; i++) {
            var blnSearch = false;
            if (intSearchCount == 0) {
                blnSearch = this.contents.getControl("inputCode" + i).setSearchValue(this.contents.getControl("searchText").getValue());
            }
            if (blnSearch) {
                intSearchCount++;
                this.lastContents = i;
            }
            else {
                this.contents.getControl("inputCode" + i).setInitSearchValue();
            }
        }

        if (intSearchCount == 0)
            this.lastContents = 1;
    }
   
});