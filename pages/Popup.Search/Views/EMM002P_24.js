window.__define_resource && __define_resource("LBL11944","BTN00070","BTN00008");
/****************************************************************************************************
1. Create Date : 2016.11.11
2. Creator     : LeNguyen
3. Description :  User Customization > User Setup > Register User
4. Precaution  :
5. History     :
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type3", "EMM002P_24", {

    treeURL: "/SelfCustomize/User/GetSearchDepartmentLevelInfo",
    treeData: null,
    TYPE: "SEARCH",     //dto parameter
    detailPageID: "",
    parentControlID: null,//"txtTreeWhCd",
    limitCount: 100,
    $tree: null,    //jstree 
    tree: null,     //ecount.layout.tree
    searchPanel: null,

    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.initData = this.viewBag.InitDatas.DepartmentLevelInfo;
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    initProperties: function () {
        this.treeData = {
            CD_PARENT: 'ROOT',
            YN_USE: null,
            SEARCHVALUE: null
        },
        this.parentControlID = this.parentControlID;
    },

    onInitHeader: function (header, resource) {
        var self = this;

        header.notUsedBookmark();
        header.setTitle(ecount.resource.LBL11944);
    },

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.Type == "SEARCH") {
            toolbar.addLeft(ctrl.define("widget.button", "apply").label(resource.BTN00070));
        }
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008)).setOptions({ css: "btn btn-default", ignorePrimaryButton: true });

        footer.add(toolbar);
    },

    //[tree event] - render complete
    onLoadTree: function (nodedata) {
        this._super.onLoadTree.apply(this, arguments);
    },

    //[tree event] - click node
    onSelectedNode: function (event, data) {
        //this._super.onSelectedNode.apply(this, arguments);
    },

    //[tree event] - exceed limit
    onExceedLimit: function (event, data) {
        this._super.onExceedLimit.apply(this, arguments);
    },

    //[tree event] - called after rename 
    onRenameNode: function (data, handler) {
        handler.rollback();
    },

    //[tree event] - called before delete
    onDeleteNode: function (data, handler) {
        handler.complete();
    },

    //must override
    onSendData: function (data) {
        if (!this.checkLimitCount()) {
            return;
        }

        var selectedNode = this.tree.getSelected();
        var nodes = new Array();

        if (!data && selectedNode.length == 0) {
            nodes = new Array();
        }
        else {
            if (selectedNode.length == 0) {
                var node = { CODE: null, CODE_DES: null };
                if (data.id) {
                    node.CODE = data.id;
                    node.CODE_DES = data.li_attr.hidtext;
                } else {
                    node.CODE = data[0].id;
                    node.CODE_DES = data[0].li_attr.hidtext;
                }
                nodes.push(node);
            }
            else {
                for (var i = 0, j = selectedNode.length; i < j ; i++) {
                    var node = { CODE: null, CODE_DES: null };
                    node.CODE = selectedNode[i].li_attr.id;
                    node.CODE_DES = selectedNode[i].li_attr.hidtext;
                    nodes.push(node);
                }
            }
        }

        var message = {
            name: "CODE_DES",
            code: "CODE",
            data: nodes,
            isAdded: false,
            addPosition: "current",
            callback: this.close.bind(this)
        };

        this.sendMessage(this, message);
    },

    onFooterApply: function () {
        this.onSendData();
    },

    onFooterClose: function () {
        this.close();
    }
});
