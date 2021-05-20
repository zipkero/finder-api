window.__define_resource && __define_resource("LBL05334","LBL06592","LBL01800","LBL01742","LBL05299","BTN00069","BTN00008","MSG00962");
/****************************************************************************************************
1. Create Date : 2018.07.24
2. Creator     : 박기정
3. Description : 계정 선택 변경 > 계정 항목 선택
4. Precaution  :
5. History     : [2018.07.24] 박기정 :  새추가
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "CM100P_08_CM", {
    pageID: null,

    /**************************************************************************************************** 
      * user opion Variables(사용자변수 및 객체) 
      ****************************************************************************************************/


    /**************************************************************************************************** 
    * page initialize

    ****************************************************************************************************/

    init: function (options) {
        this._super.init.apply(this, arguments);

    },

    render: function ($parent) {
        this._super.render.apply(this, arguments);

    },





    /****************************************************************************************************
    * UI Layout setting

    ****************************************************************************************************/
    onInitHeader: function (header) {
        header.setTitle(ecount.resource.LBL05334);


    },

    onInitContents: function (contents) {
        var g = widget.generator,
        toolbar = g.toolbar(),
        grid = g.grid();


        if (this.FLAG == "5") {
            grid.setRowData([{ INDEX: 1, NAME: ecount.resource.LBL06592 }, { INDEX: 2, NAME: ecount.resource.LBL01800 }])
        }
        else {
            this.close();
        }
            

        grid
            // Columns
            .setColumns([
                { id: "INDEX", propertyName: "INDEX", title: ecount.resource.LBL01742, width: "50" },
                { id: "NAME", propertyName: "NAME", title: ecount.resource.LBL05299, width: "500" },
                
            ])

            // CheckBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(this.canCheckCount)


        

        contents.add(toolbar)
                .addGrid("dataGrid", grid); // Because there are multiple grids must be put in an arbitrary id, grid have to use the  addGrid()
    },


    //setting Footer option
    onInitFooter: function (footer) {

        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "apply").label(ecount.resource.BTN00069));
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/

    // After the document loaded
    onLoadComplete: function (e) {

    },

    onInitControl: function (cid, control) {

        
    },

    // Press key F8
    ON_KEY_F8: function () {

        this.fnApply();
    },

    onFooterApply: function () {

        this.fnApply();
    },


    onFooterClose: function () {
        this.close();
        return false;
    },

    fnApply: function () {
        var selectedItem = this.contents.getGrid("dataGrid").getCheckedItem();

        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00962);
            return false;
        }

        var message = {
            name: "GYE_DES",
            code: "GYE_CODE",
            data: selectedItem,
            callback: this.close.bind(this)
        };
        this.ApplyFLAG = "1";
        this.sendMessage(this, message);

    },

    onClosedPopupHandler: function (page, target) {
        
        
        if (this.ApplyFLAG == "0") {

            var message = {
                name: "GYE_DES",
                code: "GYE_CODE",
                data: [{ INDEX: 1, NAME: ecount.resource.LBL06592 }],
                callback: this.close.bind(this)
            };

            this.sendMessage(this, message);
        }
        
    }






});