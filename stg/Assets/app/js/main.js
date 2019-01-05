var Main = {
    init: function () {

        Main.onEvent();
        Main.upEvent();
        Main.backLink();
        Main.setRefresh();

    },
    upEvent: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);
        Cust.list_pagi(0, "");

        if(container.find("[data-fancybox]").length !=0){
            container.find("[data-fancybox]").fancybox({
                margin: [44, 0, 22, 0],
                loop: true,
                buttons: [
                    "zoom",
                    //"share",
                    //"slideShow",
                    "fullScreen",
                    "download",
                    //"thumbs",
                    "close"
                ],        
            });
        } 

        container.find(".useSlider").each(function () {
            var obj = $(this);
            var SliderBar = obj.find(".SliderBar");
            var useSlider_percent = obj.find(".useSlider_percent");
            var SliderPercent = obj.find(".SliderPercentCount");
            var percentCompleted = obj.attr("data-percent-completed");
            var urlchange = obj.attr('data-urlchange');
            var id = obj.attr('data-id');
            SliderBar.noUiSlider({
                range: [0, 100],
                start: percentCompleted,
                step: 1,
                handles: 1,
                connect: "lower",
                serialization: {
                    resolution: 1,
                    to: [SliderPercent, 'html']
                }
            }).on('change', function (value, handler) {
                var value = jQuery(this).val();
                var data = {};
                data.ID = id;
                data.OldPercentCompleted = percentCompleted;
                if (percentCompleted != value) {
                    data.PercentCompleted = value;
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: urlchange,
                        data: data,
                        beforeSend: function () {
                        },
                        complete: function () {
                        },
                        error: function () {
                        },
                        success: function (response) {
                            location.reload();
                        }
                    });
                }
            });
            useSlider_percent.show();
        });

        container.find(".useDragable").draggable({
            cursorAt: { left: 5 }
        });
        Cust.dataTables_filter_col();
        container.find('.dataTables_wrapper .table:not(.useTreegrid)').each(function () {
            if (!$(this).hasClass("stacktable_inited") && !$(this).hasClass("not_js_responsive")) {
                $(this).addClass("stacktable_inited");
                $(this).stacktable();
            }
        });
        container.find(".selectpicker").selectpicker();
        container.find(".editorSummernote").each(function () {
            if (!jQuery(this).hasClass("setSummernote")) {
                jQuery(this).addClass("setSummernote").summernote({
                    height: '200px',
                    onpaste: function (e) {
                        var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');

                        e.preventDefault();
                        if (bufferText) {
                            while (bufferText.indexOf("ï¯") != -1) {
                                bufferText = bufferText.replace("ï¯", "");
                            }
                            while (bufferText.indexOf("ï") != -1) {
                                bufferText = bufferText.replace("ï", "");
                            }
                        }
                        document.execCommand('insertText', false, bufferText);
                    }
                });
            }
        });
        container.find(".useTreegrid").each(function () {
            var column = jQuery(this).attr('data-column');
            if (column == undefined) {
                jQuery(this).treegrid();
            }
            else {
                jQuery(this).treegrid({
                    treeColumn: column,
                    initialState: 'collapsed'
                });
            }
        });
        container.find(".nestable").each(function () {
            if (!jQuery(this).hasClass("setNestabled")) {
                var obj = jQuery(this);
                var maxDepth = obj.attr("data-max-depth") || 0;
                obj.addClass("setNestabled").nestable({
                    maxDepth: maxDepth
                }).on('change', function (e) {

                    var ids = [];
                    var idTheme = obj.attr("data-theme-id");
                    var idRegion = obj.attr("data-region-id");
                    var idPage = obj.attr("data-page-id");
                    var url = obj.attr("data-url");
                    var data = obj.nestable('serialize');

                    for (var i in data) {
                        var item = data[i];
                        ids.push(item.id);
                    }
                    if (!Utils.isEmpty(url)) {
                        var dataPost = {};
                        if (obj.hasClass("regions")) {
                            dataPost = {
                                IDTheme: idTheme,
                                IDPage: idPage || 0,
                                IDRegions: JSON.stringify(ids)
                            };
                        }
                        else {
                            dataPost = {
                                IDTheme: idTheme,
                                IDRegion: idRegion,
                                IDPage: idPage || 0,
                                IDBlocks: JSON.stringify(ids)
                            };
                        }

                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            url: url,
                            data: dataPost,
                            success: function (response) {
                                obj.closest(".ui-dialog").addClass("refresh");
                            }
                        });
                    }
                });
            }
        });

        container.find(".useSortable").each(function () {
            if (jQuery(this).hasClass("inited")) {
                jQuery(this).sortable("destroy");
            }
            jQuery(this).sortable({
                items: ".sortitem"
            });
        });
        container.find('.useRate').each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("inited")) {
                obj.addClass("inited").rating({
                    min: 0,
                    max: 5,
                    step: 1,
                    size: 'xs',
                    showClear: false,
                    hoverOnClear: false,
                    theme: 'krajee-svg'
                }).on("rating.change", function (event, value, caption) {

                    var data = obj.getDataUppername();
                    data.Rating = value;
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: data.Href,
                        data: data,
                        beforeSend: function () {
                        },
                        complete: function () {
                        },
                        error: function () {
                        },
                        success: function (response) {
                        }
                    });
                });
            }
        });
        container.find(".morris-line-chart").each(function () {
            var w = jQuery(this).width();
            if (w == 0) {
                jQuery(this).css("width", '500px');
            }
            var mrdata = JSON.parse(jQuery(this).find('#txtdata').val());
            Morris.Line({
                element: jQuery(this),
                data: mrdata.data,
                xkey: mrdata.xkey,
                ykeys: mrdata.ykeys,
                labels: mrdata.labels,
                lineColors: mrdata.colors,
                parseTime: false
            });
        });

        container.find(".QLCVtotal-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: mrdata.title
                },
                colors: mrdata.colors,
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %',
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    alignColumns: false,
                    maxHeight: 60
                },                 
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: mrdata.data
                    //[
                    //    { name: 'HoĂ n thĂ nh', y: 40 },
                    //    { name: 'Äang xá»­ lĂ½', y: 20 },
                    //    { name: 'ChÆ°a xá»­ lĂ½', y: 30 },
                    //]
                }]
            });
        });

        container.find(".QLCVtotalmonth-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {

                chart: {
                    type: 'column'
                },

                title: {
                    text: mrdata.title
                },
                colors: mrdata.colors,

                xAxis: {
                    categories: mrdata.categories//['ThĂ¡ng 1', 'ThĂ¡ng 2', 'ThĂ¡ng 3', 'ThĂ¡ng 4', 'ThĂ¡ng 5', 'ThĂ¡ng 6', 'ThĂ¡ng 7', 'ThĂ¡ng 8', 'THĂ¡ng 9', 'ThĂ¡ng 10', 'ThĂ¡ng 11', 'ThĂ¡ng 12']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: ''
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Tá»•ng: ' + this.point.stackTotal;
                    }
                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        pointWidth: 30
                    }
                },

                series: mrdata.series
                //    [{
                //    name: 'HoĂ n thĂ nh',
                //    data: [8, 3, 1, 4, 7, 2, 1, 1, 1, 5, 1, 1],
                //    stack: 'male'
                //}, {
                //    name: 'Äang xá»­ lĂ½',
                //    data: [7, 1, 2, 4, 3, 0, 7, 3, 4, 3, 4, 10],
                //    stack: 'male'
                //}, {
                //    name: 'ChÆ°a xá»­ lĂ½',
                //    data: [7, 1, 2, 4, 3, 0, 7, 3, 5, 3, 4, 10],
                //    stack: 'male'
                //}]
            });
        });

        container.find(".QLCVtkeCty-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {

                chart: {
                    type: 'column'
                },

                title: {
                    text: mrdata.title
                },
                colors: mrdata.colors, //['#53a93f', '#57b5e3', '#cccccc'],
                xAxis: {
                    categories: mrdata.categories//['Tá»•ng sá»‘ cĂ´ng viá»‡c', 'ThĂ¡ng 2', 'ThĂ¡ng 3']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: ''
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Tá»•ng: ' + this.point.stackTotal;
                    }
                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        pointWidth: 30
                    }
                },

                series: mrdata.series
                //    [{
                //    name: 'HoĂ n ThĂ nh',
                //    data: [34, 7, 2],
                //    stack: 'male'
                //}, {
                //    name: 'Äang xá»­ lĂ½',
                //    data: [19, 12, 0],
                //    stack: 'male'
                //}, {
                //    name: 'ChÆ°a xá»­ lĂ½',
                //    data: [138, 44, 8],
                //    stack: 'male'
                //}]
            });
        });

        container.find(".QLCVtkePban-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: mrdata.title//'THá»NG KĂ CĂ”NG VIá»†C PHĂ’NG BAN'
                },
                colors: mrdata.colors,//['#53a93f', '#57b5e3', '#cccccc'],
                xAxis: {
                    categories: mrdata.categories//['Tá»•ng sá»‘ cĂ´ng viá»‡c', 'ThĂ¡ng 2', 'ThĂ¡ng 3']
                },
                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Tá»•ng: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        pointWidth: 30
                    }
                },
                series: mrdata.series
                //    [{
                //    name: 'HoĂ n ThĂ nh',
                //    data: [34, 7, 2],
                //    stack: 'male'
                //}, {
                //    name: 'Äang xá»­ lĂ½',
                //    data: [19, 12, 0],
                //    stack: 'male'
                //}, {
                //    name: 'ChÆ°a xá»­ lĂ½',
                //    data: [138, 44, 8],
                //    stack: 'male'
                //}]
            });
        });

        container.find(".QLCVtkeNV-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {

                chart: {
                    type: 'column'
                },

                title: {
                    text: mrdata.title//'THá»NG KĂ CĂ”NG VIá»†C NHĂ‚N VIĂN'
                },
                colors: mrdata.colors,//['#53a93f', '#57b5e3', '#cccccc'],

                xAxis: {
                    categories: mrdata.categories//['Tá»•ng sá»‘ cĂ´ng viá»‡c', 'ThĂ¡ng 2', 'ThĂ¡ng 3']
                },

                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: ''
                    }
                },

                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Tá»•ng: ' + this.point.stackTotal;
                    }
                },

                plotOptions: {
                    column: {
                        stacking: 'normal'
                    },
                    series: {
                        pointWidth: 30
                    }
                },

                series: mrdata.series
                //[{
                //    name: 'HoĂ n ThĂ nh',
                //    data: [10, 6, 2],
                //    stack: 'male'
                //}, {
                //    name: 'Äang xá»­ lĂ½',
                //    data: [4, 2, 0],
                //    stack: 'male'
                //}, {
                //    name: 'ChÆ°a xá»­ lĂ½',
                //    data: [75, 14, 3],
                //    stack: 'male'
                //}]
            });
        });

        container.find(".QLCVcmt-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: mrdata.title//'THá»NG KĂ ÄĂNH GIĂ CĂ”NG VIá»†C'
                },
                colors: mrdata.colors,//['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %',
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    alignColumns: false,
                    maxHeight: 60
                },                 
                series: [{
                    name: 'Brands',
                    colorByPoint: true,

                    data: mrdata.data
                    //    [
                    //    { name: 'Xuáº¥t sáº¯c', y: 10 },
                    //    { name: 'Äáº¡t', y: 20 },
                    //    { name: 'KhĂ´ng Ä‘áº¡t', y: 10 },
                    //    { name: 'ChÆ°a xĂ¡c Ä‘á»‹nh', y: 60 },
                    //]
                }]
            });
        });

        container.find(".QLCVcmtCty-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: mrdata.title//'THá»NG KĂ ÄĂNH GIĂ CĂ”NG VIá»†C CTY'
                },
                colors: mrdata.colors,// ['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %',
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    alignColumns: false,
                    maxHeight: 60
                },                
                series: [{
                    name: 'Brands',
                    colorByPoint: true,

                    data: mrdata.data
                    //    [
                    //    { name: 'Xuáº¥t sáº¯c', y: 10 },
                    //    { name: 'Äáº¡t', y: 20 },
                    //    { name: 'KhĂ´ng Ä‘áº¡t', y: 10 },
                    //    { name: 'ChÆ°a xĂ¡c Ä‘á»‹nh', y: 60 },
                    //]
                }]
            });
        });

        container.find(".QLCVcmtPban-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: mrdata.title//'THá»NG KĂ ÄĂNH GIĂ CĂ”NG VIá»†C PHĂ’NG BAN'
                },
                colors: mrdata.colors,//['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %',
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    alignColumns: false,
                    maxHeight: 60
                },                
                series: [{
                    name: 'Brands',
                    colorByPoint: true,

                    data: mrdata.data
                    //    [
                    //    { name: 'Xuáº¥t sáº¯c', y: 10 },
                    //    { name: 'Äáº¡t', y: 20 },
                    //    { name: 'KhĂ´ng Ä‘áº¡t', y: 10 },
                    //    { name: 'ChÆ°a xĂ¡c Ä‘á»‹nh', y: 60 },
                    //]
                }]
            });
        });

        container.find(".QLCVcmtNV-chart").each(function () {
            var obj = jQuery(this);
            var target = obj.attr("data-target");
            var mrdata = JSON.parse(obj.find('#txtdata').val());
            Highcharts.chart(target, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: mrdata.title//'THá»NG KĂ ÄĂNH GIĂ CĂ”NG VIá»†C NHĂ‚N VIĂN'
                },
                colors: mrdata.colors,//['#53a93f', '#57b5e3', '#d73d32', '#cccccc'],
                tooltip: {
                    pointFormat: '<b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '{point.percentage:.1f} %',
                            distance: -50,
                            filter: {
                                property: 'percentage',
                                operator: '>',
                                value: 4
                            }
                        },
                        showInLegend: true
                    }
                },
                legend: {
                    alignColumns: false,
                    maxHeight: 60
                },                
                series: [{
                    name: 'Brands',
                    colorByPoint: true,

                    data: mrdata.data
                    //    [
                    //    { name: 'Xuáº¥t sáº¯c', y: 10 },
                    //    { name: 'Äáº¡t', y: 20 },
                    //    { name: 'KhĂ´ng Ä‘áº¡t', y: 10 },
                    //    { name: 'ChÆ°a xĂ¡c Ä‘á»‹nh', y: 60 },
                    //]
                }]
            });
        });

        container.find(".inputUpFileImport").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled")) {
                obj.hasClass("setUpFiled");
                obj.ajaxUploader({
                    name: "FileDocument",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    //elTarget: obj.attr("data-target"),
                    onBegin: function (e, t) {
                        return true;
                    },
                    onClientLoadStart: function (e, file, t) {
                    },
                    onClientProgress: function (e, file, t) {
                        jQuery(obj.attr("data-target")).addClass("loading");
                    },
                    onServerProgress: function (e, file, t) {
                        jQuery(obj.attr("data-target")).addClass("loading");
                    },
                    onClientAbort: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onClientError: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onServerAbort: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onServerError: function (e, file, t) {
                        jQuery(obj.attr("data-target")).removeClass("loading");
                    },
                    onSuccess: function (e, file, t, data) {
                        var dataObj = obj.getData();
                        jQuery.ajax({
                            type: "POST",
                            async: true,
                            url: dataObj.url,
                            data: data,
                            beforeSend: function () {
                                obj.addClass("loading-btn");
                            },
                            complete: function () {
                                obj.removeClass("loading-btn");
                            },
                            error: function () {
                                obj.removeClass("loading-btn");
                            },
                            success: function (response) {
                                Utils.sectionBuilder(response);
                                if (response.hasOwnProperty("isCust")) {
                                    jQuery(dataObj.target).html(response.htCust);
                                    if ($("#ConfirmImport").length != 0) {
                                        $("#ConfirmImport").removeClass("hidden");
                                    }
                                }
                                Utils.updateInputDate(jQuery(dataObj.target));
                                Utils.updateFormState(jQuery(dataObj.target));
                                Utils.updateScrollBar(jQuery(dataObj.target));
                                Autocomplete.init(jQuery(dataObj.target));
                                Main.upEvent(jQuery(dataObj.target));
                                //Utils.sectionBuilder(response);
                                //Utils.updateScrollBar(jQuery(".ui-dialog:visible"));
                            }
                        });

                        try {
                            var form = jQuery(dataObj.target).closest("form");
                            if (form.hasClass("bootstrapValidator")) {
                                form.bootstrapValidator('revalidateField', jQuery(dataObj.target).attr("data-bv-field"));
                            }
                        } catch (e) { }
                    }
                });
            }
        });
    },
    onEvent: function () {
        jQuery(document).on("click", ".jobFile_Fancybox", function () {
            $(this).parents(".jobFile_Attach").find(".jobFile_Name").click();
        });   
        jQuery(document).on("change", ".datetime, .date", function (e) {
            try {
                var dateInput = jQuery(e.currentTarget);
                var form = dateInput.closest("form");
                if (form.hasClass("bootstrapValidator")) {
                    form.bootstrapValidator('revalidateField', dateInput.attr("name"));
                }
                if (dateInput.hasClass("changeRemindDate")) {

                    var inputStart = jQuery(dateInput.attr("data-rel-start"));
                    var inputEnd = jQuery(dateInput.attr("data-rel-end"));

                    var start_dateString = inputStart.val();
                    var start_args = start_dateString.split(" ");
                    var start_ddMMyyyy = start_args[0].split("-");
                    var start_HHmm = start_args[1].split(":");
                    var startDate = new Date(start_ddMMyyyy[2], parseInt(start_ddMMyyyy[1]) - 1, start_ddMMyyyy[0], start_HHmm[0], start_HHmm[1]);


                    var end_dateString = inputEnd.val();
                    var end_args = end_dateString.split(" ");
                    var end_ddMMyyyy = end_args[0].split("-");
                    var end_HHmm = end_args[1].split(":");

                    var endDate = new Date(end_ddMMyyyy[2], parseInt(end_ddMMyyyy[1]) - 1, end_ddMMyyyy[0], end_HHmm[0], end_HHmm[1]);
                    var totalDay = DateDiff.inDays(startDate, endDate);
                    if (totalDay >= 1) {

                        var inputRemind = jQuery(dateInput.attr("data-rel-remind"));
                        var remindDay = inputRemind.attr("data-remind-day");
                        var remindDate = endDate.addDays(-parseFloat(remindDay));
                        inputRemind.val(remindDate.toDateFormat("dd-MM-yyyy HH:mm"));
                    }
                    else {
                        var inputRemind = jQuery(dateInput.attr("data-rel-remind"));
                        var remindHour = inputRemind.attr("data-remind-hour");
                        var remindDate = endDate.addHours(-parseFloat(remindHour));
                        inputRemind.val(remindDate.toDateFormat("dd-MM-yyyy HH:mm"));
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });

        jQuery(document).on("click", ".close-flash", function () {
            jQuery(this).closest(".flash").fadeOut("fast");
        });
        jQuery(document).on("click", ".closeDialog", function () {
            Utils.closeOverlay(true);
        });
        jQuery(document).on("click", ".closeForm", function () {
            jQuery(this).closest("form").slideUp("fast");
        });
        jQuery(document).on("click", ".deleteItem", function () {
            var form = jQuery(this).closest("form");
            var field = jQuery(this).closest("[data-bv-field]");

            jQuery(this).closest(".item").remove();
            try {
                if (form.hasClass("bootstrapValidator")) {
                    var fieldName = field.attr("name");
                    if (fieldName) {
                        form.bootstrapValidator('revalidateField', fieldName);
                    }
                    else {
                        var bootstrapValidator = form.data('bootstrapValidator');
                        //bootstrapValidator.validate(true);
                        if (bootstrapValidator.isValid()) {
                            form.bootstrapValidator('disableSubmitButtons', false);
                        }
                    }
                }
            } catch (e) {
                console.log(e);
            }
        });
        jQuery(document).on("click", ".clickSort", function () {
            var data = jQuery(this).getData();
            window.location.href = Utils.getSorthref(data.sortname, data.sorttype == "1" ? 0 : 1);
            return false;
        });
        jQuery(document).on("click", ".copyHtml", function () {
            try {
                var data = jQuery(this).getDataUppername();
                var html = jQuery(data.Template).clone(false);
                html.removeClass("hidden");
                html.removeClass(data.Template.replace(".", "")).appendTo(jQuery(data.Target));
            } catch (e) {
            }
        });
        jQuery(document).find(".autoOpenDialog").each(function () {
            Utils.autoOpenDialog(jQuery(this));
        });


        jQuery(document).on("click", ".openDialog", function () {
            var data = jQuery(this).getData();
            var dialoger = jQuery(data.target);
            var maxH = jQuery(window).height();
            if (!dialoger.hasClass("ui-dialog-content")) {
                jQuery(".ui-dialog[aria-describedby='" + dialoger.attr("id") + "']").remove();
            }

            dialoger.dialog({
                width: data.width,
                resizable: false,
                open: function () {
                    if (maxH < dialoger.height()) {
                        dialoger.css("height", maxH - 50);
                    }
                    if (typeof data.formTarget != 'undefined') {
                        dialoger.attr("data-target", data.formTarget);
                    }
                    if (typeof data.formInsertType != 'undefined') {
                        dialoger.attr("data-insert-type", data.formInsertType);
                    }
                    if (typeof data.formClass != 'undefined') {
                        dialoger.addClass(data.formClass);
                    }
                    if (dialoger.hasClass("uhf50d")) {
                        dialoger.closest(".ui-dialog").addClass("hf50d");
                    }
                    if (dialoger.hasClass("bootstrapValidator")) {
                        dialoger
                            .bootstrapValidator('disableSubmitButtons', false)
                            .bootstrapValidator('resetForm', true);
                        dialoger.reset();

                        if (dialoger.hasClass("quickSubmit") && dialoger.hasClass("bootstrapValidator")) {
                            dialoger.removeClass("bootstrapValidator").bootstrapValidator('destroy');
                            dialoger.unbind();
                        }
                    }

                    Utils.openOverlay();
                    Utils.updateFormState(dialoger);
                    Utils.updateScrollBar(dialoger);
                    Autocomplete.init(dialoger);

                    if (typeof data.id != 'undefined') {
                        dialoger.find("input[name='ID']").val(data.id);
                    }
                    if (typeof data.parentId != 'undefined') {
                        dialoger.find("input[name='Parent']").val(data.parentId);
                    }
                    if (typeof data.parentName != 'undefined') {
                        dialoger.find("input[name='ParentName']").val(data.parentName);
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
            return false;
        });
        jQuery(document).on("click", ".quickTree", function () {
            try {
                var obj = jQuery(this);
                var data = obj.getDataUppername();
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: data.Url,
                    data: data,
                    beforeSend: function () {
                        obj.addClass("loading-btn");
                    },
                    complete: function () {
                        obj.removeClass("loading-btn");
                    },
                    error: function () {
                        obj.removeClass("loading-btn");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        Utils.updateScrollBar(jQuery(".ui-dialog:visible"));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".clickViewer", function () {
            var data = jQuery(this).getDataUppername();
            if (jQuery(this).hasClass("tabOpen")) {
                jQuery("[href='" + data.TabOpen + "']").trigger("click");
            }
            Utils.viewer(data);
            return false;
        });
        jQuery(document).on("click", ".tabitem", function () {
            var tab = jQuery(this).attr("data-tab");
            jQuery(this).parent().find(".tabitem").removeClass("active");
            var container = jQuery(this).addClass("active").closest(".group-tab");
            container.children(".tab-data").addClass("hidden");
            container.find(tab).removeClass("hidden");
        });
        jQuery(document).on('change', '.tickAllFormGroup', function () {
            var checked = jQuery(this).is(":checked");
            jQuery(this).closest(".form-group").find(".tickItem").prop("checked", checked);
        });
        jQuery(document).on('change', '.tickKey', function () {

            if (jQuery(this).prop("checked")) {
                var checkeds = jQuery(this).closest(".tickGroup").find(".tickItem").filter(":checked");
                if (checkeds.length == 0) {
                    jQuery(this).closest(".form-group").find(".tickItem").first().prop("checked", true);
                }
            } else {
                jQuery(this).closest(".form-group").find(".tickItem").prop("checked", false);
            }
        });
        jQuery(document).on('change', '.tickItem', function () {

            if (jQuery(this).prop("checked")) {
                jQuery(this).closest(".tickGroup").find(".tickKey").prop("checked", true);
            } else {
                var checkeds = jQuery(this).closest(".tickGroup").find(".tickItem").filter(":checked");
                jQuery(this).closest(".form-group").find(".tickKey").first().prop("checked", checkeds.length != 0);
            }
        });

        jQuery(document).on('change', '.group-checkable', function () {

            var table = jQuery(this).closest("table");
            var set = table.find(".checkboxes");
            var checked = jQuery(this).is(":checked");
            jQuery(set).each(function () {
                if (checked) {
                    jQuery(this).prop("checked", true);
                    jQuery(this).closest('tr').addClass("active");
                } else {
                    jQuery(this).prop("checked", false);
                    jQuery(this).closest('tr').removeClass("active");
                }
            });
            Utils.toggleMultiTicks(table);
        });
        jQuery(document).on('change', '.checkboxes', function () {
            jQuery(this).closest('tr').toggleClass("active");
            Utils.toggleMultiTicks(jQuery(this).closest('table'));
        });
        jQuery(document).on("change", ".changeRel", function () {
            var v = jQuery(this).prop("checked") ? 1 : 0;
            var data = jQuery(this).getDataUppername();
            jQuery(data.Rel).val(v);
            if (v) {
                jQuery(jQuery(this).attr("data-rel-date")).removeClass("hidden")
            } else {
                jQuery(jQuery(this).attr("data-rel-date")).addClass("hidden");
                jQuery(jQuery(this).attr("data-rel-date")).find("input").val("");
            }
            if (typeof data.RelVisible != 'undefined') {
                var dataOptions = jQuery(this).find("option:selected").getDataUppername();
                if (dataOptions.IsVisible.toLowerCase() == "true") {
                    jQuery(data.RelVisible).removeClass("hidden")
                } else {
                    jQuery(data.RelVisible).addClass("hidden")
                }
            }
        });
        jQuery(".changeRel").trigger("change");

        jQuery(document).on("change", ".fieldRadio", function () {
            var obj = jQuery(this);
            if (obj.prop("checked")) {
                var data = obj.getDataUppername();
                obj.closest("form").find(".fieldRadio").each(function () {
                    if (obj.attr("name") != jQuery(this).attr("name")) {
                        if (data.Label == jQuery(this).attr("data-label")) {
                            jQuery(this).prop("checked", false);
                        }
                    }
                });
            }
        });

        jQuery(document).on("keydown", ".pressSubmit", function (e) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key === 13) {
                try {
                    jQuery(this).closest("form").trigger("submit");
                } catch (ex) {
                }
                return false;
            }
            return true;
        });
        jQuery(document).on("submit", ".quickSearch", function () {
            try {
                var form = jQuery(this);
                var url = form.attr("action");
                var target = form.attr("data-target");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return;
                }
                for (var i in data) {
                    if (Utils.isEmpty(data[i]))
                        delete data[i];
                }


                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        jQuery(target).addClass("loading").html("")
                    },
                    complete: function () {
                        jQuery(target).removeClass("loading");
                    },
                    error: function () {
                        jQuery(target).removeClass("loading");
                    },
                    success: function (response) {
                        try {
                            window.history.pushState(null, response.title, url + Utils.builderQString(data));
                            jQuery(document).prop("title", response.title);
                        } catch (e) {
                            console.log(e);
                        }

                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            jQuery(target).html(response.htCust);
                        }

                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent(jQuery(target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("submit", ".quickSubmit", function (e) {
            e.preventDefault();
            try {
                var form = jQuery(this);
                var url = form.attr("action");
                var target = form.attr("data-target");
                var targetDelete = form.attr("data-target-delete");

                var type = form.attr("data-insert-type");
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(url)) {
                    return false;
                }

                if (!form.hasClass("bootstrapValidator")) {
                    form.addClass("bootstrapValidator").bootstrapValidator();
                }
                var bootstrapValidator = form.data('bootstrapValidator');
                bootstrapValidator.validate();
                if (!bootstrapValidator.isValid(true)) {
                    return false;
                }

                if (!Utils.validateDataForm(form)) {
                    return false;
                }
                if (form.find(".has-error").length > 0) {
                    return false;
                }
                if (form.hasClass("submited")) {
                    return false;
                }

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        form.addClass("submited").find("[type='submit']").prop("disabled", true);
                    },
                    complete: function () {
                        form.removeClass("submited").find("[type='submit']").prop("disabled", false);
                    },
                    error: function () {
                        form.removeClass("submited").find("[type='submit']").prop("disabled", false);
                    },
                    success: function (response) {

                        try {
                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                if (type == "append") {
                                    jQuery(target).append(response.htCust);
                                }
                                else if (type == "prepend") {
                                    jQuery(target).prepend(response.htCust);
                                }
                                else if (type == "replaceWith") {
                                    jQuery(target).replaceWith(response.htCust);
                                }
                                else {
                                    jQuery(target).html(response.htCust);
                                }
                            }

                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent(jQuery(target));

                            if (!Utils.isEmpty(targetDelete)) {
                                jQuery(targetDelete).fadeOut("fast", function () {
                                    jQuery(this).remove();
                                });
                            }
                            if (form.hasClass("closeOnSubmit")) {
                                Utils.closeOverlay(true);
                            }
                        }
                        catch (e) {
                        }

                        try {
                            form.reset();
                            form.find("[type='submit']").prop("disabled", false);
                        } catch (e) {
                            console.log(e);
                        }

                        form.find(".editorSummernote").each(function () {
                            try {
                                jQuery(this).code('');
                            } catch (e) {
                            }
                        });
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickMore", function () {
            try {
                var node = jQuery(this);
                var data = jQuery(this).getDataUppername();
                if (typeof data.Skip == 'undefined') {
                    data.Skip = 0;
                }
                if (typeof data.Take == 'undefined') {
                    data.Take = 10;
                }
                data.Skip = parseInt(data.Skip) + parseInt(data.Take);

                var target = data.Target;
                var type = data.InsertType;
                var url = node.attr("href").replace("#", "");
                if (Utils.isEmpty(url)) {
                    return;
                }
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                        node.addClass("loading");
                    },
                    complete: function () {
                        node.removeClass("loading");
                    },
                    error: function () {
                        node.removeClass("loading");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            if (type == "prepend") {
                                jQuery(target).prepend(response.htCust);
                            }
                            else {
                                jQuery(target).append(response.htCust);
                            }
                        }
                        node.attr("data-skip", data.Skip);
                        node.attr("data-take", data.Take);
                        if (response.htCust == "" || jQuery(response.htCust).find(".itemMore").length < data.Take) {
                            node.addClass("hidden")
                        }
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickLike", function () {
            try {
                var node = jQuery(this);
                var data = jQuery(this).getDataUppername();
                var target = data.Target;
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: node.attr("href"),
                    data: data,
                    beforeSend: function () {
                        node.addClass("loading");
                    },
                    complete: function () {
                        node.removeClass("loading");
                    },
                    error: function () {
                        node.removeClass("loading");
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        node.toggleClass("active");
                        if (response.hasOwnProperty("isCust")) {
                            jQuery(target).html(response.htCust);
                        }
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickView", function () {
            try {
                var node = jQuery(this);
                var url = node.attr("href").replace("#", "");
                var target = node.attr("data-target");
                if (Utils.isEmpty(url)) {
                    return;
                }
                if (window.history.pushState) {
                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: url,
                        data: { RedirectPath: Utils.getRedirect() },
                        beforeSend: function () {
                            jQuery(target).addClass("loading").html("")
                        },
                        complete: function () {
                            jQuery(target).removeClass("loading");
                        },
                        error: function () {
                            jQuery(target).removeClass("loading");
                        },
                        success: function (response) {
                            window.history.pushState(null, response.title, url);
                            jQuery(document).prop("title", response.title);

                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                jQuery(target).html(response.htCust);
                            }

                            Utils.updatePDFViewer(response);
                            Utils.updateImageViewer();
                            Utils.updateChart(jQuery(target));
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent(jQuery(target));
                            JobPage.upEvent(jQuery(target));
                            Main.backLink();

                            //window.webViewerLoad(true);
                            //jQuery("#viewerContainer").scrollTop(0);
                            Cust.fileViewer_height_fn();
                            Cust.toogle_steps();
                            Cust.Scroll_table();
                            Cust.Scroll_tab_group();
                            Cust.Table_sort();
                            Cust.dataTables_filter_col(); //Responsive dataTables_filter Col
                            Cust.gotoStep();
                            Cust.check_required_input();
                            //Cust.prev_next_group_button();
                        }
                    });
                } else {
                    window.location.href = url;
                }
            } catch (e) {

            }
            if (jQuery(this).hasClass("closeOpen")) {
                jQuery(this).closest(".open").removeClass("open");
            }
            return false;
        });
        jQuery(document).on("click", ".quickUpdate", function () {
            try {
                var obj = jQuery(this);
                var target = jQuery(this).attr("data-target");
                var dialogWidth = jQuery(this).attr("data-width");;
                var data = obj.getDataUppername();
                data.RedirectPath = Utils.getRedirect();

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    data: data,
                    beforeSend: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    complete: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    error: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    success: function (response) {
                        if (dialogWidth) {
                            response.wDL = dialogWidth;
                        }
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).html(response.htCust);
                        }
                        if (!response.isErr && data.OnSuccessRefresh == "1") {
                            Utils.reloadPage();
                        }
                        else {
                            Utils.updateTab(jQuery(target));
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            Autocomplete.init(jQuery(target));
                            Main.upEvent(jQuery(target));
                            Cust.check_required_input();
                        }
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickAppend", function () {
            try {
                var obj = jQuery(this);
                var target = jQuery(this)
                    .attr("data-target");
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    beforeSend: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    complete: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    error: function () {
                        if (!obj.hasClass("not-overlay")) {
                            Utils.openOverlay();
                        }
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).append(response.htCust);
                        }

                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent(jQuery(target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickDelete", function () {
            try {
                var data = jQuery(this).getDataUppername();
                if (typeof data.RedirectPath == "undefined")
                    data.RedirectPath = Utils.getRedirect();

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.openOverlay();
                    },
                    error: function () {
                        Utils.openOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(data.Target).html(response.htCust);
                        }
                        if (!Utils.isEmpty(data.TargetDeleteClick)) {
                            jQuery(data.TargetDeleteClick).fadeOut("fast", function () {
                                jQuery(this).remove();
                            });
                        }
                        Utils.updateFormState(jQuery(data.Target));
                        Utils.updateScrollBar(jQuery(data.Target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickDeletes, .quickConfirms", function () {
            try {
                var target = jQuery(this)
                    .attr("data-target");
                var href = jQuery(this)
                    .attr("data-href");
                var table = jQuery(this)
                    .closest(".dataTables_wrapper")
                    .find("table");

                var ids = [];
                var idFiles = [];
                table.find(".checkboxes").each(function () {
                    if (jQuery(this).prop("checked")) {
                        var id = jQuery(this).attr("data-id");
                        var idFile = jQuery(this).attr("data-id-file");
                        if (Utils.isInteger(id))
                            ids.push(id);
                        if (!Utils.isEmpty(idFile))
                            idFiles.push(idFile);
                    }
                });
                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: href,
                    data: { ID: ids, IDFile: idFiles, RedirectPath: Utils.getRedirect() },
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.openOverlay();
                    },
                    error: function () {
                        Utils.openOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).html(response.htCust);
                        }
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                    }
                });
            } catch (e) {

            }
            return false;
        });

        jQuery(document).on("click", ".attachFileImport", function () {
            var data = jQuery(this).getData();
            jQuery(data.rel).attr("data-target", data.target);
            jQuery(data.rel).attr("data-file-name", data.fileName);
            jQuery(data.rel).attr("data-file-path", data.filePath);
            jQuery(data.rel).attr("data-file-title", data.fileTitle);
            jQuery(data.rel).attr("data-file-url", data.fileUrl);
            jQuery(data.rel).attr("data-url", data.url);
            jQuery(data.rel).val("").trigger("click");
            Main.upEvent();

        });

        jQuery(document).on("submit", ".quickCmt", function (e) {
            try {
                var form = jQuery(this);
                var attrs = jQuery(this).getDataUppername();
                var container = form.closest(".container-cmts");
                var target = container.find(".cmts").first();
                var data = Utils.getSerialize(form);
                if (Utils.isEmpty(data.Body))
                    return false;

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: form.attr("action"),
                    data: data,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {

                        try {
                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                Utils.closeOverlay();
                                jQuery(target).append(response.htCust);
                                var dataInc = jQuery(attrs.IncTarget).getData();

                                var v = parseInt(dataInc.value) + 1;
                                jQuery(attrs.IncTarget).attr("data-value", v).val(v);
                            }
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            jQuery(target).scrollTop(jQuery(target).scrollHeight());
                        } catch (e) { }

                        form.reset();
                        form.find("[type='submit']").prop("disabled", false);
                    }
                });
            } catch (e) {
                console.log(e);
            }

            return false;
        });

        jQuery(document).on("click", ".nextChart", function () {

            var chartViewer = jQuery(this).closest(".chartViewer");
            var chart = chartViewer.highcharts();
            var data = chartViewer.getData();
            var from = parseInt(data.from);
            var to = parseInt(data.to);
            var max = parseInt(data.max);
            var step = parseInt(data.step);

            chart.xAxis[0].setExtremes(from + step, to + step);
            chartViewer.attr("data-from", from + step);
            chartViewer.attr("data-to", to + step);

            if (to + step >= max) {
                chartViewer.find(".nextChart").addClass("hidden");
            } else {
                chartViewer.find(".nextChart").removeClass("hidden");
            }
        });

        jQuery(document).on("click", ".prevChart", function () {
            var chartViewer = jQuery(this).closest(".chartViewer");
            var chart = chartViewer.highcharts();
            var data = chartViewer.getData();
            var from = parseInt(data.from);
            var to = parseInt(data.to);
            var max = parseInt(data.max);
            var step = parseInt(data.step);

            chart.xAxis[0].setExtremes(from - step, to - step);
            chartViewer.attr("data-from", from - step);
            chartViewer.attr("data-to", to - step);

            if (to - step >= max) {
                chartViewer.find(".nextChart").addClass("hidden");
            } else {
                chartViewer.find(".nextChart").removeClass("hidden");
            }
        });
        jQuery(document).on("change", ".slChangeFT", function () {
            if (jQuery(this).val() == "textarea") {
                jQuery(this).closest(".scrollItem").find(".ofTextarea").removeClass("hidden");
            } else {
                jQuery(this).closest(".scrollItem").find(".ofTextarea").addClass("hidden");
            }
        });
        jQuery(window).resize(function () {
            Utils.autoResize();
        });
    },

    callRefresh: null,
    setRefresh: function () {
        if (document.getElementById("RefreshPage")) {
            try {
                var timeRefresh = parseInt(jQuery("#RefreshPage").val());
                if (timeRefresh > 0) {
                    Main.callRefresh = setTimeout(function () {
                        if (jQuery("#Overlay").is(":visible")) {
                            clearTimeout(Main.callRefresh);
                            Main.setRefresh();
                        }
                        else {
                            Utils.reloadPage();
                        }
                    }, timeRefresh * 1000);
                }
            }
            catch (e) {
                console.log(e);
            }
        }
    },

    backLink: function () {
        try {
            var bcItems = jQuery(".breadcrumb").find("li");
            var len = bcItems.length;
            if (len > 2) {

                var a = jQuery(bcItems[len - 2]).find("a");
                var attr_href = a.attr("href");
                var data_target = a.attr("data-target");
                jQuery(".widget_back_btn")
                    .removeClass("hidden")
                    .attr("href", attr_href)
                    .attr("data-target", data_target);
                if (a.hasClass("quickView")) {
                    jQuery(".widget_back_btn").addClass("quickView");
                }
                else {
                    jQuery(".widget_back_btn").removeClass("quickView");
                }
            } else {
                jQuery(".widget_back_btn").addClass("hidden");
            }
        } catch (e) { }
    }
};
jQuery(window).bind("load", function () {
    // Cdata.init();
    // Smile.init();
    // Main.init();

    // Utils.autoCloseFlash();
    // Utils.updateImageViewer();
    // Utils.updatePlayer(jQuery(document));
    // Utils.updateChart(jQuery(document));
    // Utils.updateFormState(jQuery(document));
    // Utils.updateInputDate(jQuery(document));
    // Utils.updateScrollBar(jQuery(document));
    // Autocomplete.init(jQuery(document));
});
