var Main = {
    init: function () {

        Main.onEvent();
        Main.upEvent();
        Main.backLink();
        //Utils.getToastMessage();
    },
    upEvent: function (container)
    {
        if (Utils.isEmpty(container))
            container = jQuery(document);

        container.find(".useDragable").draggable({
            cursorAt: { left: 5 }
        });
        container.find(".doc-marker").draggable();
        
        container.find(".secrtc2").resizable({
            handles: "w",
            maxWidth: 700,
            minWidth: 7,
            resize: function (event, ui) {
                jQuery(this).find(".clsr").removeClass("awl");
                jQuery(this).removeClass("closed").css("left", "0");
                jQuery(this).parent().find(".secrtc1").removeClass("frt").css("width", "calc((100%) - " + ui.size.width + "px)");
            }
        });

        Cust.dataTables_filter_col();
container.find(".chart_class_name").each(function () {
                                                    try{
                                                        function labelFormatter(label, series) {
                                                            return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
                                                        } 
                                                        var data = jQuery(this).attr('data-value');
                                                        if (typeof data != "undefined") {
                                                            data = jQuery.parseJSON(data);
                                                            jQuery(this).unbind();
                                                            $.plot(jQuery(this), data, {
                                                                series: {
                                                                    pie: {
                                                                        show: true,
                                                                        radius: 1,
                                                                        label: {
                                                                            show: true,
                                                                            radius: 2 / 3,
                                                                            formatter: labelFormatter,
                                                                            threshold: 0.1
                                                                        }
                                                                    }
                                                                },
                                                                legend: {
                                                                    show: false
                                                                }
                                                            }); 
                                                        }               
                                                    } catch (e) { 
                                                        console.log(e);
                                                    }

                                                });         
container.find('.dataTables_wrapper .table:not(.useTreegrid)').each(function() {
	if(!$(this).hasClass("stacktable_inited") && !$(this).hasClass("not_js_responsive")){
		$(this).addClass("stacktable_inited");
		$(this).stacktable();
	}
});
container.find(".selectpicker").selectpicker();
container.find(".editorSummernote").each(function () {
            if (!jQuery(this).hasClass("setSummernote")) {
                jQuery(this).addClass("setSummernote").summernote({
                    height: jQuery(this).attr("data-height") || '200px'
                });
            }
        });
container.find(".useTreegrid").each(function () {
    jQuery(this).treegrid();
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
                    var idDoc = obj.attr("data-id-doc");
                    var idDoctype = obj.attr("data-doctype-id");
                    var idRecordType = obj.attr("data-record-type-id");
                    var idPage = obj.attr("data-page-id");
                    var url = obj.attr("data-url");
                    var data = obj.nestable('serialize');

                    for (var i in data) {
                        var item = data[i];
                        ids.push(item.id);
                    }
                    if (!Utils.isEmpty(url))
                    {
                        var dataPost = {};
                        if (obj.hasClass("regions"))
                        {
                            dataPost = {
                                IDTheme: idTheme,
                                IDPage: idPage || 0,
                                IDRegions: JSON.stringify(ids)
                            };
                        }
                        else if (obj.hasClass("doctypes")) {
                            dataPost = {
                                IDDoc: idDoc,
                                IDDoctype: idDoctype,
                                IDFieldSettings: JSON.stringify(ids)
                            };
                        }
                        else if (obj.hasClass("recordtypes")) {
                            dataPost = {
                                IDRecordType: idRecordType,
                                IDFieldSettings: JSON.stringify(ids)
                            };
                        }
                        else
                        {
                            dataPost = {
                                IDTheme: idTheme,
                                IDRegion: idRegion,
                                IDPage: idPage || 0,
                                IDBlocks: JSON.stringify(ids)
                            };
                        }
                        if (obj.hasClass("withTicks")) {
                            var ticks = [];
                            obj.find(".checkboxes").each(function () {
                                if (jQuery(this).prop("checked")) {
                                    ticks.push(jQuery(this).attr("data-id"));
                                }
                            });;
                            dataPost.Ticks = JSON.stringify(ticks);
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
container.find(".donut-chart").each(function () {
    //var mrdata = JSON.parse(jQuery(this).find('#txtdata').val());
    Morris.Donut({
        element: jQuery(this),
        data: [
          { label: 'IOS', value: 40 , },
          { label: 'Win', value: 30 },
          { label: 'Android', value: 25 },
          { label: 'Java', value: 5 }
        ],
        colors: ["#9c0", "#c20000","#007bc1","#ccc"]
    });
});
container.find(".morris-bar-chart").each(function () {
    //var mrdata = JSON.parse(jQuery(this).find('#txtdata').val());
    Morris.Bar({
        element: jQuery(this),
        data: [
            { y: '2006', a: 100, b: 90, c:80 },
            { y: '2007', a: 75, b: 65 , c:25},
            { y: '2008', a: 50, b: 40 , c:90},
            { y: '2009', a: 75, b: 65 , c:15},
            { y: '2010', a: 50, b: 40 , c:50},
            { y: '2011', a: 75, b: 65 ,c:10},
            { y: '2012', a: 100, b: 90 ,c:90}
        ],
        xkey:'y',
        ykeys: ['a', 'b', 'c'],
        labels: ['Series A', 'Series B', 'Series C'],
    });
});
container.find(".morris-line-chart").each(function () {
    //var mrdata = JSON.parse(jQuery(this).find('#txtdata').val());
    Morris.Line({
        element: jQuery(this),
        data: tax_data,
        xkey: 'period',
        ykeys: ['licensed', 'sorned'],
        labels: ['Licensed', 'Off the road'],
        parseTime: false
    });
});
    },
    onEvent: function () {

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
            jQuery(this).closest(".item").remove();
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

        jQuery(document).on("click", ".btnGPrev", function () {

            var i = 0;
            var flag = false;
            var gNextPrev = jQuery(this).closest(".gNextPrevContainer");
            var data = gNextPrev.getDataUppername();

            var viewCount = parseInt(data.ViewCount);
            var objs = gNextPrev.find(".gNextPrevItem");
            var objReverses = objs.get().reverse();
            jQuery(".compare").removeClass("compare-focus");

            jQuery(objReverses).each(function () {
                if (jQuery(this).is(":visible")) {
                    flag = true;
                    jQuery(this).addClass("hidden");
                }
                else if (flag && i < viewCount) {
                    i++;
                    jQuery(this).removeClass("hidden");

                    var objTarget = jQuery(jQuery(this).attr("data-target"));
                    objTarget.addClass("compare-focus");

                    objTarget.closest(".useScrollBar").scrollTop(objTarget.position().top);
                }
            });

            gNextPrev.find(".btnGNext").prop("disabled", false);
            if (objs.first().is(":visible")) {
                gNextPrev.find(".btnGPrev").prop("disabled", true);
            }
        });
        jQuery(document).on("click", ".btnGNext", function () {

            var i = 0;
            var flag = false;
            var gNextPrev = jQuery(this).closest(".gNextPrevContainer");
            var data = gNextPrev.getDataUppername();
            jQuery(".compare").removeClass("compare-focus");

            var viewCount = parseInt(data.ViewCount);
            var objs = gNextPrev.find(".gNextPrevItem");

            objs.each(function () {
                if (jQuery(this).is(":visible")) {
                    flag = true;
                    jQuery(this).addClass("hidden");
                }
                else if (flag && i < viewCount)
                {
                    i++;
                    jQuery(this).removeClass("hidden");

                    var objTarget = jQuery(jQuery(this).attr("data-target"));
                    objTarget.addClass("compare-focus");

                    console.log(objTarget.position());
                    objTarget.closest(".useScrollBar").scrollTop(objTarget.position().top);
                }
            });
            gNextPrev.find(".btnGPrev").prop("disabled", false);
            if (objs.last().is(":visible")) {
                gNextPrev.find(".btnGNext").prop("disabled", true);
            }
        });

        jQuery(document).on("click", ".openEditor", function () {
            jQuery(".gEditor").removeClass("gEditorActive");

            var title = jQuery(this).attr("title");
            var text = jQuery(this).closest(".gEditor").addClass("gEditorActive").find(".fEditor").val();
            jQuery("#dialogEditor").find("textarea").val(text);
            jQuery("#dialogEditor").dialog({
                dialogClass: "dialogEditor",
                title: title,
                resizable: false,
                height: "auto",
                width: 800,
                open: function () {
                    Utils.openOverlay();
                },
                buttons: {
                    "Ok": function () {
                        jQuery(this).dialog("close");
                        jQuery(".gEditorActive").find(".fEditor").val(jQuery("#dialogEditor").find("textarea").val());
                    },
                    Cancel: function () {
                        jQuery(this).dialog("close");
                    }
                },
                close: function () {
                    Utils.closeOverlay();
                }
            });
        });
        jQuery(document).on("click", ".openDialog", function () {

            var data = jQuery(this).getData();
            var dialoger = jQuery(data.target);
            var maxH = jQuery(window).height();
            if (!dialoger.hasClass("ui-dialog-content")) {
                jQuery(".ui-dialog[aria-describedby='" + dialoger.attr("id") + "']").remove();
            }
            var data_with = 600;
            if(data.width != null && data.width != ""){
                data_with = data.width;
            }
            dialoger.dialog({
                width: data.width,
                resizable: false,
                open: function () {
                    if (maxH < dialoger.height()) {
                        dialoger.css("height", (maxH - 50));
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
                    Utils.updateScrollBar(dialoger);
                    Utils.updateFormState(dialoger);
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
                    if (typeof data.idCategoryType != 'undefined') {
                        dialoger.find("input[name='IDCategoryType']").val(data.idCategoryType);
                        dialoger.find("select[name='IDCategoryType']").val(data.idCategoryType);
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
            jQuery(this).closest(".form-group").find(".tickItem").each(function(){
                if(!jQuery(this).prop("disabled"))
                    jQuery(this).prop("checked", checked);
            });
        });
        jQuery(document).on('change', '.tickAll', function () {
            var checked = jQuery(this).is(":checked");
            jQuery(this).closest(".tickGroup").find(".tickItem, .tickKey").each(function () {
                if (!jQuery(this).prop("disabled"))
                    jQuery(this).prop("checked", checked);
            });
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
            if (typeof data.RelVisible != 'undefined')
            {
                var dataOptions = jQuery(this).find("option:selected").getDataUppername();
                if (dataOptions.IsVisible.toLowerCase() == "true") {
                    jQuery(data.RelVisible).removeClass("hidden")
                } else {
                    jQuery(data.RelVisible).addClass("hidden")
                }
            }
            if (typeof data.RelChecked != 'undefined') {
                jQuery(data.RelChecked).prop("checked", true);
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
        jQuery(document).on('change', '.checkone', function () {
            var checked = jQuery(this).prop("checked");
            jQuery(this).closest('.checkone-group').find(".checkone").prop("checked", false);
            jQuery(this).prop("checked", checked);
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
                            window.history.pushState(null, response.title, Utils.builderUrlQString(data, url));
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
                        Main.upEvent();

                        form.find("[type='submit']").prop("disabled", false);
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("submit", ".quickSubmit", function (event) {
            event.preventDefault();
            event.stopPropagation();
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
                if (!Utils.validateDataForm(form)) {
                    return false;
                }
                //if (!form.hasClass("bootstrapValidator")) {
                //    form.addClass("bootstrapValidator").bootstrapValidator();
                //}
                //var bootstrapValidator = form.data('bootstrapValidator');
                //bootstrapValidator.validate();
                //if (!bootstrapValidator.isValid()) {
                //    jQuery(this).unbind();
                //    return false;
                //}

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: url,
                    data: data,
                    beforeSend: function () {
                    },
                    complete: function () {
                    },
                    error: function () {
                    },
                    success: function (response) {

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
                        Main.upEvent();

                        if (!Utils.isEmpty(targetDelete)) {
                            jQuery(targetDelete).fadeOut("fast", function () {
                                jQuery(this).remove();
                            });
                        }
                        if (form.hasClass("closeOnSubmit")) {
                            Utils.closeOverlay(true);
                        }
                        if (!response.hasOwnProperty("isErr") &&
                            form.hasClass("successOnRefresh")) {
                            window.location.href = Utils.getRedirect();
                        }

                        form.reset();
                        form.find("[type='submit']").prop("disabled", false);
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
                            jQuery(".quickView").removeClass("active");
                            node.addClass("active");
                        },
                        complete: function () {
                            jQuery(target).removeClass("loading");
                        },
                        error: function () {
                            jQuery(target).removeClass("loading");
                        },
                        success: function (response) {
                            Utils.sectionBuilder(response);
                            if (response.hasOwnProperty("isCust")) {
                                jQuery(target).html(response.htCust);
                            }
                            if (node.attr("data-state") != "0") {
                                    window.history.pushState(null, response.title, url);
                                    jQuery(document).prop("title", response.title);
                            }
                            Utils.updatePDFViewer(response);
                            Utils.updateImageViewer();
                            Utils.updatePlayer(jQuery(target));
                            Utils.updateChart(jQuery(target));
                            Utils.updateInputDate(jQuery(target));
                            Utils.updateFormState(jQuery(target));
                            Utils.updateScrollBar(jQuery(target));
                            //Utils.getToastMessage();
                            Autocomplete.init(jQuery(target));
                            Main.upEvent();
                            Main.backLink();

                            //window.webViewerLoad(true);
                            //jQuery("#viewerContainer").scrollTop(0);
                            OCR.bindNote();
                            Cust.fileViewer_height_fn();
                            Cust.prev_next_group_button();
                            Cust.Scroll_table();
                            Cust.Scroll_tab_group();
                            Cust.Table_sort();
                            Cust.dataTables_filter_col(); //Responsive dataTables_filter Col
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
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent();
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".quickUpdate , .quickConfirm", function () {
            try {
                var obj = jQuery(this);
                var target = obj.attr("data-target");

                var data = jQuery(this).getDataUppername();
                data.RedirectPath = Utils.getRedirect();

                delete data.Target;

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: jQuery(this).attr("href"),
                    data: data,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    complete: function () {
                        Utils.closeOverlay();
                    },
                    error: function () {
                        Utils.closeOverlay();
                    },
                    success: function (response) {
                        Utils.sectionBuilder(response);
                        if (response.hasOwnProperty("isCust")) {
                            Utils.closeOverlay();
                            jQuery(target).html(response.htCust);
                        }
                        Utils.updateImageViewer();
                        Utils.updatePlayer(jQuery(target));
                        Utils.updateTab(jQuery(target));
                        Utils.updateInputDate(jQuery(target));
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                        Autocomplete.init(jQuery(target));
                        Main.upEvent();
                        Cust.check_required_input();
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
        jQuery(document).on("click", ".quickDeletes, .quickConfirms, .quickMoves", function () {
            try
            {
                var data = jQuery(this).getDataUppername();
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
                data.ID = ids;
                data.IDFile = idFiles;
                data.RedirectPath = Utils.getRedirect();

                var target = data.Target;
                if (jQuery(this).hasClass("quickMoves")) {
                    delete data.Target;
                }

                jQuery.ajax({
                    type: "POST",
                    async: true,
                    url: data.Href,
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
                        Utils.updateFormState(jQuery(target));
                        Utils.updateScrollBar(jQuery(target));
                    }
                });
            } catch (e) {

            }
            return false;
        });
        jQuery(document).on("click", ".toogleClass", function () {
            try{
                var data = jQuery(this).getData();
                jQuery(data.target).toggleClass(data.toogleClass);
            }catch(e){}
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

        jQuery(document).on("click", ".addPoint", function () {
            jQuery("#DocProIMGMap").find(".doc-pos")
                .removeClass("hidden")
                .attr("data-row-shelf", "")
                .attr("data-rack-no", "")
                .attr("data-shelf-no", "")
                .attr("data-id", "");

            jQuery("#DocProIMGMap").find(".docPoint").addClass("hidden");
            jQuery(".savePoint").removeClass("hidden");
            jQuery(".cancelPoint").removeClass("hidden");
            jQuery(this).addClass("hidden");
        });
        jQuery(document).on("click", ".cancelPoint", function () {
            jQuery("#DocProIMGMap").find(".doc-pos").addClass("hidden");
            jQuery("#DocProIMGMap").find(".docPoint").removeClass("hidden");
            jQuery(".savePoint").addClass("hidden");
            jQuery(".addPoint").removeClass("hidden");
            jQuery(this).addClass("hidden");
        });
        jQuery(document).on("click", ".map-marker", function () {

            var data = jQuery(this).getDataUppername();
            //jQuery('#DocProIMGMap').lhpMegaImgViewer('setPosition', null, null, 0.2);

            var mapWidth = jQuery("#MapWidth").val();
            var mapHeight = jQuery("#MapHeight").val();
            var content = jQuery(".lhp_miv_content");
            var posContentHolder = jQuery(".lhp_miv_content_holder").position();

            var w = content.width();
            var h = content.height();

            var l = parseFloat(data.X) / (parseInt(mapWidth) / w);
            var t = parseFloat(data.Y) / (parseInt(mapHeight) / h);

            var l2 = posContentHolder.left;
            var t2 = posContentHolder.top;

            var t1 = t - Math.abs(t2);
            var l1 = l - Math.abs(l2);

            jQuery(".doc-marker").addClass("hidden");
            jQuery('#DocProIMGMap').lhpMegaImgViewer('setPosition', l1, t1, null);

            setTimeout(function () {

                posContentHolder = jQuery(".lhp_miv_content_holder").position();
                l2 = posContentHolder.left;
                t2 = posContentHolder.top;

                t1 = t - Math.abs(t2);
                l1 = l - Math.abs(l2);

                jQuery(".doc-marker")
                    .removeClass("hidden")
                    .attr("data-row-shelf", data.RowShelf)
                    .attr("data-rack-no", data.RackNo)
                    .attr("data-shelf-no", data.ShelfNo)
                    .attr("data-id", data.ID)
                    .css({
                        left: l1 + "px",
                        top: t1 + "px"
                    });

            }, 600);

            jQuery(".savePoint").removeClass("hidden");
            jQuery(".cancelPoint").removeClass("hidden");
            jQuery(".addPoint").addClass("hidden");
            jQuery("#DocProIMGMap").find(".docPoint").addClass("hidden");
        });
        jQuery(document).on("click", ".savePoint", function () {

            var posMarker = jQuery(".doc-marker").position();
            var dataMarker = jQuery(".doc-marker").getDataUppername();
            var posContentHolder = jQuery(".lhp_miv_content_holder").position();

            var content = jQuery(".lhp_miv_content");
            var data = {
                W: content.width(),
                H: content.height(),
                L1: posMarker.left,
                T1: posMarker.top,
                L2: posContentHolder.left,
                T2: posContentHolder.top,
                RowShelf: dataMarker.RowShelf,
                RackNo: dataMarker.RackNo,
                ShelfNo: dataMarker.ShelfNo,
                IDWarehouseInfo: dataMarker.ID
            };

            var target = jQuery(this).attr("data-target");
            jQuery.ajax({
                type: "POST",
                async: true,
                url: jQuery(this).attr("data-url"),
                data: data,
                beforeSend: function () {
                    Utils.openOverlay();
                },
                complete: function () {
                    Utils.closeOverlay();
                },
                error: function () {
                    Utils.closeOverlay();
                },
                success: function (response) {
                    Utils.sectionBuilder(response);
                    if (response.hasOwnProperty("isCust")) {
                        Utils.closeOverlay();
                        jQuery(target).html(response.htCust);
                    }
                    Utils.updateInputDate(jQuery(target));
                    Utils.updateFormState(jQuery(target));
                    Main.upEvent();
                }
            });

            return false;
        });

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
jQuery(document).ready(function () {
    Cdata.init();
    Main.init();

    Utils.autoCloseFlash();
    Utils.updateImageViewer();

    Utils.updatePlayer(jQuery(document));
    Utils.updateChart(jQuery(document));
    Utils.updateFormState(jQuery(document));
    Utils.updateInputDate(jQuery(document));
    Utils.updateScrollBar(jQuery(document));
    Autocomplete.init(jQuery(document));
});