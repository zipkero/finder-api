window.__define_resource && __define_resource("BTN00545","BTN00008","MSG06623");

ecount.page.factory("ecount.page.popup.type2", "GraphPage", {

    /**********************************************************************
     *  page configuration settings
     **********************************************************************/
    _default: {
        titleName: ""
    },
    proption: {},

    printCss:"",

    plotOption : "",

    graphType: "",

    graphTitle: "",


    init: function (options) {
        this._super.init.apply(this, arguments);
        
        var head = document.getElementsByTagName('head')[0];
        var css = (this.printCss != null && this.printCss != "null" && this.printCss != "[object Object]") ? this.printCss : "";

        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1 && navigator.userAgent.toLowerCase().indexOf('edge') < 0) {
            css = css.replace("table-header-group", "table-row-group");
            css = css.indexOf('table-row-group') < 0 ? (css + " thead{ display:table-row-group } ") : css;
        }
        printCss = css;

        var s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        if (s.styleSheet) {   // IE
            s.styleSheet.cssText = css;            
        } else {                // the world
            s.appendChild(document.createTextNode(css));            
        }
        head.appendChild(s);
        this.registerDependencies("jqplot.style", "jqplot.script");
        

    },

    render: function () {       
            this._super.render.apply(this, arguments);         
    },

    /**********************************************************************
    *  set widget options
    **********************************************************************/

    //헤더 옵션 설정 (header option setting)
    onInitHeader: function (header) {
        header.disable();       
    },

    //본문 옵션 설정(content option setting)
    onInitContents: function (contents) {
           
      //  this.sendMessage(this, this.execPrint);        
    },

    //풋터 옵션 설정 (footer option setting)
    onInitFooter: function (footer) {
        //위젯 인스턴스 생성
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        // apply
        //toolbar.addLeft(ctrl.define("widget.button", "apply").label(this.resource.BTN00545));
        //닫기 위젯 추가
        toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        //툴바 추가
        footer.add(toolbar);
    },

    /**********************************************************************
    *  event listener   ==>  [header, form, footer widget]
    **********************************************************************/
    onLoadComplete: function () {

        this.resizeLayer(900, 680);
        this.plotOption = JSON.parse(this.graphOption);
     
        this.graphTitle = this.plotOption.graphTitle == undefined ? "" : this.plotOption.graphTitle;

        var x1AxisLabel = this.plotOption.x1Label;
        var x2AxisLabel = this.plotOption.x2Label;
        var y1AxisLabel = this.plotOption.y1Label;
        var y2AxisLabel = this.plotOption.y2Label;

        this.graphType = this.plotOption.graphType;

        var chartOption = "";
        //1*1
        if (x2AxisLabel == "" && y2AxisLabel == "") {
            chartOption = ecount.graph.data.getOnoByOneOption(this.plotOption);
        }

        //1*2
        if (x2AxisLabel == "" && y2AxisLabel != "") {
            chartOption = ecount.graph.data.getOnoByTwoOption(this.plotOption);
        }

        //2*1
        if (x2AxisLabel != "" && y2AxisLabel == "") {
            chartOption = ecount.graph.data.getTwoByOneOption(this.plotOption);
        }

        //2*2
        if (x2AxisLabel != "" && y2AxisLabel != "") {
            chartOption = ecount.graph.data.getTwoByTwoOption(this.plotOption);

        }

        var isDraw = "";
        if (x2AxisLabel != "" && y2AxisLabel != "" && chartOption.ticks.length >= 30) {
            ecount.confirm(ecount.resource.MSG06623, function (status) {
                if (status) {
                    this.createGraph(chartOption);
                } else {
                    this.onFooterClose();

                }
            }.bind(this));
        }
        else {
            this.createGraph(chartOption);
        }

        //if (isDraw) {
        //    this.createGraph(chartOption);
        //} else {
        //    this.onFooterClose();
        //}

        /*
         oldstyle = {
        title: {
            fontFamily: 'Times New Roman',
            textColor: 'black'
        },
        axesStyles: {
           borderWidth: 0,
           ticks: {
               fontSize: '12pt',
               fontFamily: 'Times New Roman',
               textColor: 'black'
           },
           label: {
               fontFamily: 'Times New Roman',
               textColor: 'black'
           }
        },
        grid: {
            backgroundColor: 'white',
            borderWidth: 0,
            gridLineColor: 'black',
            gridLineWidth: 2,
            borderColor: 'black'
        },
        series: [
            {color: 'red', highlightColors: ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow']},
            {color: 'green', highlightColors: []},
            {color: 'blue', highlightColors: []},
            {color: 'yellow', highlightColors: 'rgb(255, 245, 185)'}
        ],
        legend: {
            background: 'white',
            textColor: 'black',
            fontFamily: 'Times New Roman',
            border: '1px solid black'
        }
    };
    
    plot2.themeEngine.newTheme('oldstyle', oldstyle);
        
        */
        
    },
    /**********************************************************************
   *  기능 처리
   **********************************************************************/
    createGraph: function (chartOption) {

        var graphDiv = document.createElement('div');
        graphDiv.id = 'ecChart';

        //if (chartOption.ticks.length < 6 && this.graphType =="bar") {
        //    graphDiv.style.width = '50%';
        //    graphDiv.style.height = '50%';
        //} else {
            graphDiv.style.width = '90%';
            graphDiv.style.height = '90%';
       // }

        this.$el.find(".contents")[0].appendChild(graphDiv);

        switch (this.graphType) {
            case "bar":
                this.createBarGraph(chartOption);
                break;
            case "pie":
                this.createPieGraph(chartOption);
                break;
            case "line":
                this.createLineGraph(chartOption);
                break;
            case "area":
                this.createAreaGraph(chartOption);
                break;
        }

    },
    
    /*막대그래프 생성*/
    createBarGraph: function (chartOption) {
        $.jqplot.config.enablePlugins = true;
        /*
        xaxis:{
                barLabels:barLabels,
                rendererOptions: {
                barLabelOptions: {
                            angle: -35
                },
                    barLabelRenderer: $.jqplot.CanvasAxisLabelRenderer
                }, 
            max: 175,
            tickOptions:{formatString:'$%dM'}
        }, 
        */
        var plot = $.jqplot('ecChart', chartOption.yInfo, {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            title: this.graphTitle,
            seriesDefaults: {
                renderer: $.jqplot.BarRenderer,
                pointLabels: { show: false }
            },
            series: chartOption.seriesList,
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: chartOption.ticks, //ticks
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        angle: -90   //-90
                    },
                    //barLabels: chartOption.barLabels,
                    //rendererOptions: {
                    //    barLabelOptions: {
                    //        angle: -35
                    //    },
                    //    barLabelRenderer: $.jqplot.CanvasAxisLabelRenderer
                    //},
                    label: chartOption.xLabel
                },
                yaxis: {
                    label: chartOption.yLabel,
                    tickOptions: { formatString: '%d'}
                }
            },
            legend: {
                show: true,
                location: 'ne',
                placement: 'outside'
            }
            //highlighter: { show: false }
        });

        //$('#resizablePlot').bind('resize', function (event, ui) {
        //    plot1.replot({ resetAxes: true });
        //});

        //resizeDiv.appendChild(graphDiv);

    },

    /*
        윈그래프 생성
    */
    createPieGraph: function (chartOption) {
        $.jqplot.config.enablePlugins = true;
        // var plot = $.jqplot('ecChart', [chartOption.yInfo], {
        var plot = $.jqplot('ecChart', chartOption.yInfo, {
            title: this.graphTitle,
            seriesDefaults: {
                renderer: $.jqplot.PieRenderer,
                trendline: { show: false },
                rendererOptions: { padding: 8, showDataLabels: true }
            },
            legend: {
                show: true,
                placement: 'inside',
                location: 'e',
                marginTop: '15px'
            }
        });
    },

    /*
        선그래프 생성
    */
    createLineGraph: function (chartOption) {
        $.jqplot.config.enablePlugins = true;

        var plot = $.jqplot('ecChart', chartOption.yInfo, {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            title: this.graphTitle,
            series: chartOption.seriesList,
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: chartOption.ticks, //ticks
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        angle: -90
                    },
                    label: chartOption.xLabel
                },
                yaxis: {
                    label: chartOption.yLabel
                }
            },
            legend: {
                show: true,
                location: 'e',
                placement: 'outside'
            }
            //highlighter: { show: false }
        });
     
    },

    
    /*
        영역그래프 생성
    */
    createAreaGraph: function (chartOption) {
        $.jqplot.config.enablePlugins = true;

        var plot = $.jqplot('ecChart', chartOption.yInfo, {
            // Only animate if we're not using excanvas (not in IE 7 or IE 8)..
            title: this.graphTitle,
            stackSeries: true,
            showMarker: false,
            seriesDefaults: {
                fill: true
            },
            series: chartOption.seriesList,
            axes: {
                xaxis: {
                    renderer: $.jqplot.CategoryAxisRenderer,
                    ticks: chartOption.ticks, //ticks
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        angle: -90
                    },
                    label: chartOption.xLabel
                },
                yaxis: {
                    label: chartOption.yLabel
                }
            },
            legend: {
                show: true,
                location: 'e',
                placement: 'outside'

            }
        });
    },


    //닫기 이벤트
    onFooterClose: function () {

       // this.onAllSubmitSelf("/ECErp/Popup.Common/GraphSetup", this, '', '', '');
        this.close();
        return false;
    },
});
