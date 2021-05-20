window.__define_resource && __define_resource("MSG07234","MSG08806","LBL80183","LBL00737","LBL09072","LBL09629","LBL00031","LBL00030","MSG07626","MSG07881","MSG06072","BTN00008");
/****************************************************************************************************
1. Create Date : 2017.03.30
2. Creator     : 이용희
3. Description : 웹자료 올리기 결과 팝업(Web uploader result popup)
4. Precaution  :
5. History     : 2018.01.16 박종국 errMessage 추가
                 2018.02.26 김동수 국세청자료올리기 예외처리
                 2018.12.17 (HoangLinh): Change resource MSG07234 to MSG08806
6. Old File    : 
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "UploaderResult", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        debugger;
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
    },

    render: function () {
        this._super.render.apply(this);
    },


    //header 옵션 설정
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL80183).notUsedBookmark();
    },

    //body 옵션 설정
    onInitContents: function (contents) {
        var g = widget.generator
        , grid = g.grid()
        , ctrl = g.control()
        , toolbar = g.toolbar()
        , resultData = this.ResultData
        , columns, rowData;

        rowData = this.setGridRowData(resultData.ResultDetails);

        columns = [
            {
                id: 'errorRows',
                title: this.IsSelectDateChange ? ecount.resource.LBL00737 : ecount.resource.LBL09072,
                width: 100,
                propertyName: 'A1',
                align: 'center'
            },
            {
                id: 'errorCause',
                title: ecount.resource.LBL09629,
                width: 300,
                propertyName: 'A2'
            }
        ]

        //그리드 설정
        grid
            .setColumns(columns)
            .setRowData(rowData)
            .setStyleDisableTableHover(true)
            .setCustomRowCell('errorRows', this.setErrorRows.bind(this));

        var div = g.div();
        var divContents = [String.format(ecount.resource.LBL00031, resultData.SuccessCnt),
							"<br/>", "<br/>",
							String.format(ecount.resource.LBL00030, resultData.FailCnt),
							"<br/>", "<br/>"];
       //debugger
        if (resultData.FailCnt > 0) {
            var errMessage = "";
            if (this.parentPageID.indexOf("EPD020M") == 0 || this.parentPageID.indexOf("EPD021M") == 0)
                errMessage = ecount.resource.MSG07626;
            else if (this.parentPageID.indexOf("EBA062M") == 0 || this.parentPageID.indexOf("EPA040M") == 0) 
                errMessage = ecount.resource.MSG07881;
            else if (this.parentPageID.indexOf("ETG005M") == 0 || this.parentPageID.indexOf("ETG003M") == 0)
                errMessage = "선택한 소득내역을 업로드할 수 없습니다.<br/>다음 사항을 확인 바랍니다.";
            else
                errMessage = this.IsSelectDateChange ? String.format(ecount.resource.MSG06072, ecount.resource.LBL00737) : ecount.resource.MSG08806;

            divContents.push(errMessage);
        }            

        divContents.join("");

        // 국세청자료올리기는 상단내용 제거
        if (this.parentPageID.indexOf("EGM014M") < 0) {
            div.css("well").html(divContents);
            contents.add(div);
        }

        if (resultData.FailCnt > 0)
            contents.addGrid("dataGrid", grid);
    },

    //footer 옵션 설정
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },

    onLoadComplete: function () {

    },


    onFooterClose: function () {

        if (this.IsSelectDateChange)
        {
            var message = {   //부모전달시 확인
                name: "",
                code: "",
                data: {
                    resultData: this.ResultData,
                    isLine: this.IsLine
                },
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);

            if (this.parentPageID.indexOf("EGM014M") > -1)
                this.close();
        } else {
            this.sendMessage(this);
            this.close();
        }
        
    },

    //X버튼 클릭시
    onClosedPopupHandler: function (control) {
        if (this.IsSelectDateChange) {
            var message = {   //부모전달시 확인
                name: "",
                code: "",
                data: {
                    resultData: this.ResultData,
                    isLine: this.IsLine
                },
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } else {
            this.sendMessage(this);
        }
    },

    setGridRowData: function (data) {
        var result = [],
            self = this;

        $.each(data, function (i, item) {
            //debugger
            var row = {},
                message = [],
                errors = item['Errors'];

            if (item.Errors.length > 0) {
                row['A1'] = self.IsSelectDateChange ? (item['Code'] || item['Line']) : item['Line'];

                for (var idx = 0, len = errors.length; idx < len; idx++) {
                    message.push(errors[idx]['Message']);
                }

                row['A2'] = message.join('\n');

                result.push(row);
            }
        });

        return result;
    },

    setErrorRows: function (value, rowItem, dataTypeConvertor) {
        var option = {},
            data;
        debugger
        if (this.IsSelectDateChange) {
            option.data = data;
        } else {
            data = (parseInt(value, 10) + 1).toString();
            option.data = data + ecount.resource.LBL09072;
        }

        // 국세청자료올리기 행정보가 없음
        if (this.parentPageID.indexOf("ECTAX020M_1") == 0)
            option.data = "오류";

        return option;
    }
});