var OCR = {
    coord: {},
    coords: {},
    layers: {},
    notes: {},
    ocrLink: "/",
    type: 6,
    noteBind: false,

    upEvent: function (container) {
        OCR.contextmenu();
    },

    reset: function(){
        OCR.type = 6;
        OCR.coord = {};
        //OCR.coords = {};
        OCR.layers = {};
        OCR.notes = {};
        OCR.ocrLink = "/";
        OCR.noteBind = false;

        try {
            OCR.coords = jQuery.parseJSON(jQuery("#FileUpdateCoords").val());
        } catch (e) {
            OCR.coords = {};
        }
    },
    onEvent: function () {

        try {
            OCR.coords = jQuery.parseJSON(jQuery("#FileUpdateCoords").val());
        } catch (e) {
            OCR.coords = {};
        }

        /**********************************************************/
        /*******************OCR Enable - Disable*******************/
        /**********************************************************/
        jQuery(document).on("click", ".enableOcr", function () {
            OCR.resumLayers(jQuery(this));
        });
        jQuery(document).on("click", ".disableOcr", function () {
            jQuery(".jbuttons").addClass("hidden");
            jQuery(".enableOcr").removeClass("hidden");
            jQuery("#FileViewer").addClass("readonly");
            window.webViewerLoad(true);
            //jQuery(".pdfViewer .textLayer").removeClass("cropping").unbind();
            //jQuery(".jcrop-selection, .jcrop-shades").remove();

            return false;
        });

        /**********************************************************/
        /**************************COPPER**************************/
        /**********************************************************/
        jQuery(document).on("focusin", ".noteitem", function () {
            var field = jQuery(this).attr("id");
            var coords = OCR.notes;

            if (!jQuery("#BtnNote").hasClass("inited")) {
                jQuery("#BtnNote").addClass("inited").trigger("click");
            }
            if (typeof coords[field] != "undefined") {
                var data = coords[field];
                var layer = data.Page + 1;

                if (typeof OCR.layers[layer] != "undefined") {

                    var pageWidth = jQuery("#textLayer" + layer).width();
                    var pageHeight = jQuery("#textLayer" + layer).height();
                    var rateWidth = (pageWidth / data.PageWidth).toFixed(2);
                    var rateHeight = (pageHeight / data.PageHeight).toFixed(2);

                    var x = Math.floor(rateWidth * data.X);
                    var y = Math.floor(rateHeight * data.Y);
                    var w = Math.floor(data.Width * rateWidth);
                    var h = Math.floor(data.Height * rateHeight);

                    var dest = [null, { name: "XYZ" }, x, y, null];
                    window.PDFViewerApplication.pdfViewer.scrollPageIntoView(layer, dest);

                    try {
                        var shades = jQuery("#textLayer" + layer).find(".jcrop-shades div");
                        jQuery(shades[0]).css({ height: y + "px", left: x + "px", width: w + "px" });
                        jQuery(shades[1]).css({ height: pageHeight + "px", left: (x + w) + "px", width: (pageWidth - (x + w)) + "px" });
                        jQuery(shades[2]).css({ height: pageHeight + "px", left: "0", width: x + "px" });
                        jQuery(shades[3]).css({ height: (pageHeight - (y + h)) + "px", left: x + "px", width: w + "px", top: (y + h) + "px" });
                    } catch (e) {
                    }

                    jQuery("#textLayer" + layer).find(".jcrop-selection").removeClass("jcrop-focus").removeClass("jcrop-current");
                    jQuery(".jcrop-selection[data-value=\"" + field + "\"]").addClass("jcrop-focus").addClass("jcrop-current");
                }
            }

        });
        jQuery(document).on("focusin", ".frmDocOcr .form-control, .frmDocOcr .control-checkbox", function () {
            var field = jQuery(this).attr("name");
            var coords = OCR.coords;

            if (!jQuery("#BtnNote").hasClass("inited")) {
                jQuery("#BtnNote").addClass("inited").trigger("click");
            }
            if (typeof coords[field] != "undefined") {
                var data = coords[field];
                var layer = data.Page + 1;

                if (typeof OCR.layers[layer] != "undefined") {

                    var pageWidth = jQuery("#textLayer" + layer).width();
                    var pageHeight = jQuery("#textLayer" + layer).height();
                    var rateWidth = (pageWidth / data.PageWidth).toFixed(2);
                    var rateHeight = (pageHeight / data.PageHeight).toFixed(2);

                    var x = Math.floor(rateWidth * data.X);
                    var y = Math.floor(rateHeight * data.Y);
                    var w = Math.floor(data.Width * rateWidth);
                    var h = Math.floor(data.Height * rateHeight);

                    var dest = [null, { name: "XYZ" }, x, y, null];
                    window.PDFViewerApplication.pdfViewer.scrollPageIntoView(layer, dest);

                    try {
                        var shades = jQuery("#textLayer" + layer).find(".jcrop-shades div");
                        jQuery(shades[0]).css({ height: y + "px", left: x + "px", width: w + "px" });
                        jQuery(shades[1]).css({ height: pageHeight + "px", left: (x + w) + "px", width: (pageWidth - (x + w)) + "px" });
                        jQuery(shades[2]).css({ height: pageHeight + "px", left: "0", width: x + "px" });
                        jQuery(shades[3]).css({ height: (pageHeight - (y + h)) + "px", left: x + "px", width: w + "px", top: (y + h) + "px" });
                    } catch (e) {
                    }

                    jQuery("#textLayer" + layer).find(".jcrop-selection").removeClass("jcrop-focus").removeClass("jcrop-current");
                    jQuery(".jcrop-selection[data-value=\"" + field + "\"]").addClass("jcrop-focus").addClass("jcrop-current");
                }
            }

        });
        jQuery(document).on("click", "#BtnType", function () {
            jQuery(this).closest(".form-group").addClass("hidden");
            jQuery(".form-group-type").removeClass("hidden");
            jQuery("#FormOCRTypeNew").val("");
        });
        jQuery(document).on("click", "#BtnTypeNew", function () {
            jQuery(this).closest(".form-group").addClass("hidden");
            jQuery(".form-group-type-new").removeClass("hidden");
            jQuery("#FormOCRType").val(0);
        });
        jQuery(document).on("click", "#BtnName", function () {
            jQuery(this).closest(".form-group").addClass("hidden");
            jQuery(".form-group-name").removeClass("hidden");
            jQuery("#FormOCRNameNew").val("");
        });
        jQuery(document).on("click", "#BtnNameNew", function () {
            jQuery(this).closest(".form-group").addClass("hidden");
            jQuery(".form-group-name-new").removeClass("hidden");
            jQuery("#FormOCRName").val(0);
        });
        jQuery(document).on("mouseover", ".textLayer", function () {
            OCR.layer(jQuery(this));
        });
        jQuery(document).on("contextmenu", ".pdfViewer .textLayer", function (e) {
            e.preventDefault();
        });
        jQuery(document).on("click", ".saveOcrForm", function () {

            try{
                var count = 0;
                var fieldInfos = {};
                for (var field in OCR.coords) {
                    if (OCR.coords.hasOwnProperty(field)) {
                        if (jQuery(".jcrop-selection[data-value='" + field + "']").length == 0) {
                            delete OCR.coords[field];
                        }
                        else {
                            count++;
                            var fieldInfo = OCR.fields[field];
                            fieldInfos[field] = fieldInfo.name;
                        }
                    }
                }
                if (count === 0) {
                    alert("Bạn chưa định nghĩa mẫu OCR");
                    return false;
                }

                var data = jQuery(this).getData();
                jQuery.ajax({
                    type: "POST",
                    url: data.href,
                    data: {
                        FieldInfo: JSON.stringify(fieldInfos),
                        ID: jQuery("#SlOcrForm").find(":selected").attr("data-id")
                    },
                    async: true,
                    beforeSend: function () {

                    },
                    error: function () {

                    },
                    success: function (response) {
                        
                        Utils.sectionBuilder(response);
                        if (response.status == 1) {
                            Utils.reloadPage();
                        }
                        //Autocomplete.init(jQuery(data.target));
                    }
                });
            }catch(e){}
            return false;
        });

        jQuery(document).on("submit", "#FrmCrOcrForm", function () {

            try {
                var form = jQuery(this);
                if (Utils.validateDataForm(form)) {

                    var coords = {};
                    form.find(".ocrField").each(function () {
                        try{
                            if (jQuery(this).prop("checked")) {
                                var k = jQuery(this).val();
                                coords[k] = OCR.coords[k];
                            }
                        }catch(e){}
                    });
                    var data = Utils.getSerialize(form);
                    data.Coords = JSON.stringify(coords);
                    data.IDDoctype = jQuery(".changeDoctype").val();

                    jQuery.ajax({
                        type: "POST",
                        url: form.attr("action"),
                        data: data,
                        async: true,
                        beforeSend: function () {
                            Utils.closeOverlay(true);
                        },
                        error: function () {

                        },
                        success: function (response) {
                            Utils.sectionBuilder(response);
                            Utils.closeOverlay(true);
                            Utils.reloadPage();
                        }
                    });
                }
            } catch (e) {
                console.log(e);
            }

            return false;
        });

        jQuery(document).on("click", ".execOcrForm", function () {
            try {
                var objexec = jQuery(this);
                var data = jQuery(this).getData();
                jQuery(".jcrop-selection").each(function () {
                    jQuery(this).remove();
                });
                jQuery("#viewerContainer").scrollTop(0);
                jQuery(".jbuttons").removeClass("hidden");
                jQuery("#FileViewer").removeClass("readonly").find(".textLayer").each(function () {
                    try {
                        OCR.layer(jQuery(this));
                    } catch (e) {
                    };
                });
                if (typeof data.doctype != 'undefined' && parseInt(data.doctype) > 0 && data.doctype != jQuery(".changeDoctype").val())
                {
                    jQuery(".changeDoctype").val(data.doctype);

                    var obj = jQuery(".changeDoctype");
                    var target = jQuery(".changeDoctype").attr("data-target");
                    var dataDoctype = jQuery(".changeDoctype").getDataUppername();
                    dataDoctype.RedirectPath = Utils.getRedirect();
                    dataDoctype.IDDoctype = jQuery(".changeDoctype").val();

                    delete dataDoctype.Target;

                    jQuery.ajax({
                        type: "POST",
                        async: true,
                        url: dataDoctype.Href,
                        data: dataDoctype,
                        beforeSend: function () {
                            obj.addClass("loadingr");
                        },
                        complete: function () {
                            obj.removeClass("loadingr");
                        },
                        error: function () {
                            obj.removeClass("loadingr");
                        },
                        success: function (response) {
                            
                            try{
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
                            } catch (e) {
                                console.log(e);
                            }


                            OCR.setfields();
                            OCR.coords = jQuery.parseJSON(data.coords);
                            OCR.setOcr(data);
                            OCR.drawing();
                            jQuery(".ocrForms").find("li").removeClass("active");
                            if (objexec.addClass("active").hasClass("isExecute")) {
                                for (var field in OCR.coords) {
                                    if (OCR.coords.hasOwnProperty(field)) {
                                        OCR.ocrText(field);
                                    }
                                }
                            }
                            OCR.contextmenu();
                        }
                    });
                }
                else
                {
                    OCR.setfields();
                    OCR.coords = jQuery.parseJSON(data.coords);
                    OCR.setOcr(data);
                    OCR.drawing();
                    jQuery(".ocrForms").find("li").removeClass("active");
                    if (jQuery(this).addClass("active").hasClass("isExecute")) {
                        for (var field in OCR.coords) {
                            if (OCR.coords.hasOwnProperty(field)) {
                                OCR.ocrText(field);
                            }
                        }
                    }
                    OCR.contextmenu();
                }
            } catch (e) {
                console.log(e);
            }
        });
        jQuery(document).on("click", ".execOcrPdfSearchable", function () {
            try {
                var data = jQuery(this).getData();
                jQuery.ajax({
                    type: "POST",
                    url: data.href,
                    data: { ID: data.id, Type: data.type },
                    async: true,
                    beforeSend: function () {
                        Utils.openOverlay();
                    },
                    error: function () {
                        Utils.closeOverlay();
                    },
                    complete: function () {
                    },
                    success: function (response) {
                        if (parseInt(response.status) === 1) {
                            setTimeout(function () {
                                try {
                                    Utils.closeOverlay();
                                    var urlPdfSearchable = Utils.getDomain() + response.text;
                                    jQuery("#DEFAULT_URL").val(urlPdfSearchable);
                                    window.webViewerLoad(true);
                                } catch (e) { }
                            }, 5000);
                        } else {
                            Utils.closeOverlay();
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
        jQuery(document).on("click", ".execOcrExtractInfo", function () {
            try {
                var data = jQuery(this).getDataUppername();
                jQuery.ajax({
                    type: "POST",
                    url: data.Href,
                    data: data,
                    async: true,
                    beforeSend: function () {
                        Utils.openOverlay();
                        jQuery("#TabLabelDocInfo").trigger("click");
                    },
                    error: function () {
                        Utils.closeOverlay();
                    },
                    complete: function () {
                        Utils.closeOverlay();
                    },
                    success: function (response) {
                        try {
                            if (parseInt(response.reload) == 1) {
                                window.location.href = Utils.getRedirect();
                            }
                            else if (parseInt(response.openLink) == 1) {
                                Utils.closeOverlay();
                                var url = Utils.getDomain() + response.text;
                                window.location.href = url;
                            }
                            else if (parseInt(response.status) === 1) {
                                var dataFields = jQuery.parseJSON(response.text);
                                for (var field in dataFields) {
                                    var dataField = dataFields[field];
                                    jQuery("#FileViewer")
                                        .find("[name=\"" + field + "\"]")
                                        .val(jQuery.trim(dataField));

                                    jQuery("#FileViewer")
                                        .find("[data-code=\"" + field + "\"]")
                                        .val(jQuery.trim(dataField));

                                    jQuery("#FileViewer")
                                        .find("[data-code-id=\"" + field + "\"]")
                                        .val(0);
                                }
                            }

                        } catch (e) {
                            console.log(e);
                        }
                    }
                });
            } catch (e) {
                console.log(e);
            }
        });
        jQuery(document).on("change", ".slOcrForm", function () {
            try
            {
                var val = jQuery(this).val();
                if (!Utils.isEmpty(val))
                {
                    jQuery(".enableOcr").trigger("click");
                    jQuery(".jcrop-selection").each(function () {
                        jQuery(this).remove();
                    });

                    setTimeout(function () {
                        OCR.setfields();
                        OCR.coords = jQuery.parseJSON(val);
                        OCR.drawing();
                    }, 500);
                }
            } catch (e) {
                console.log(e);
            }
        });


        /**********************************************************/
        /**************************SAVE NOTE***********************/
        /**********************************************************/
        jQuery(document).on("click", ".saveDocNote", function () {

            var data = jQuery(this).getData();
            for (var i in OCR.notes) {
                OCR.notes[i].comment = jQuery("#" + i).val();
                if (typeof OCR.notes[i].uid === "undefined") {
                    OCR.notes[i].Uid = MessageProfile.currentuser.Uid;
                }
            }
            var dataNotes = {
                ID: data.id,
                Notes: JSON.stringify(OCR.notes)
            };
            jQuery.ajax({
                type: "POST",
                url: data.href,
                data: dataNotes,
                async: true,
                beforeSend: function () {
                    
                },
                error: function () {

                },
                success: function (response) {
                    Utils.sectionBuilder(response);
                }
            });
            return false;
        });
        OCR.bindNote();
    },

    resumLayers: function (obj) {
        jQuery(".jbuttons").removeClass("hidden");
        jQuery("#FileViewer").removeClass("readonly").find(".textLayer").each(function () {
            try {
                OCR.layer(jQuery(this));
            } catch (e) {
            };
        });
        try {
            OCR.setOcr(obj.getData());
            OCR.contextmenu();
        }
        catch (e) { }
    },

    setfields: function() {
        try {
            var ghiChu = jQuery("#TextGhiChu").val();
            if (Utils.isEmpty(ghiChu)) {
                ghiChu = "Ghi chú";
            }
            OCR.fields = {
                "NoteDoc": { name: ghiChu, icon: "edit" },
                "step1": "-----------"
            };
            var fieldData = jQuery.parseJSON(jQuery("#FileUpdateFields").val());
            for (var k in fieldData) {
                if (fieldData.hasOwnProperty(k)) {
                    if (k === "Type") continue;
                    if (k === "Created") continue;
                    if (k === "Updated") continue;
                    OCR.fields[k] = { name: fieldData[k].Title, icon: k.toLowerCase() };

                    try {
                        var type = fieldData[k].Type.toString();
                        switch (type) {
                            case "1":
                                OCR.checkboxs[k] = 1;
                                break;
                            case "2":
                                OCR.handlenumberwritting[k] = 2;
                                break;
                            case "3":
                                OCR.handlewritting[k] = 3;
                                break;
                            case "4":
                                OCR.numbers[k] = 4;
                                break;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
    setOcr: function (data)
    {
        OCR.type = data.type;
        OCR.ocrLink = data.href;
    },
    setnotecount: function () {
        var ntCount = jQuery("#DocumentNotes").find(".noteitem").length;
        jQuery("#TabLabelDocNote").find("sub").remove();
        jQuery("#TabLabelDocNote").append("<sub class='statn' data-value='" + ntCount + "'>" + ntCount + "</sub>");
    },

    layer: function (textLayer) {
        if (!jQuery("#FileViewer").hasClass("readonly"))
        {
            var layer = textLayer.attr("id").replace("textLayer", "");
            if (!textLayer.hasClass("cropping")) {
                textLayer.addClass("cropping").Jcrop({
                    onChange: function(c) {
                        OCR.points(c);
                    },
                    onSelect: function(c) {
                        var page = parseInt(layer) - 1;
                        var width = textLayer.width();
                        var height = textLayer.height();
                        var field = textLayer.find(".jcrop-current").attr("data-value");
                        OCR.points(c, field, page, width, height);
                    },
                    multi: true
                }, function() {
                    OCR.layers[layer] = this;
                    OCR.bindNote();
                    try {
                        OCR.drawing();
                    } catch (e) {
                    };
                });
            }
        }
    },

    bindNote: function(){
        try {
            if (!OCR.noteBind) {
                OCR.noteBind = true;
                OCR.notes = jQuery.parseJSON(jQuery("#NoteData").val());
                for (var i in OCR.notes) {
                    var comment = OCR.notes[i].comment;
                    jQuery("#DocumentNotes").append("<div><textarea spellcheck='false' class='noteitem form-control' id='" + i + "' placeholder='Ghi chú ...' rows='2' cols='20' >" + comment + "</textarea></div>");
                }
                OCR.setnotecount();
            }
        } catch (e) {
        }
    },
    
    contextmenu: function () {

        jQuery.contextMenu({
            selector: ".textLayer .jcrop-selection",
            build: function (ui, e) {

                OCR.setfields();
                return {
                    autoHide: true,
                    callback: function (key, options) {
                        var currentValue = jQuery(this).attr("data-value");
                        var layer = jQuery(this).closest(".textLayer");
                        var layerId = layer.attr("id");
                        var page = parseInt(layerId.replace("textLayer", "")) - 1;
                        var pageWidth = layer.width();
                        var pageHeight = layer.height();

                        if (key != "NoteDoc") 
                        {
                            if (typeof OCR.coords[key] != "undefined") {
                                if (typeof currentValue == "undefined" || currentValue !== key) {
                                    var coord = OCR.coords[key];
                                    var pageCoord = parseInt(coord.Page) + 1;
                                    alert("Bạn đã định nghĩa [" + options.items[key].name + "] tại trang " + pageCoord);
                                    return;
                                }
                            }
                            if (typeof OCR.coords[currentValue] != "undefined") {
                                delete OCR.coords[currentValue];
                            }

                            jQuery(this).attr("data-value", key);
                            jQuery(this).find("tag").remove();
                            jQuery(this).append(jQuery("<tag>").text(options.items[key].name));
                            jQuery("#TabLabelDocInfo").trigger("click");
                            jQuery(".secrtc2").scrollTop(jQuery("[name='" + key + "']").offset().top).focus();
                            jQuery(layer).find(".jcrop-shades").removeClass("jshades");
                            OCR.ocrCoords(key, page, pageWidth, pageHeight);
                            OCR.ocrText(key);
                        }
                        else
                        {
                            if (currentValue !== undefined && currentValue.indexOf("NoteDoc") == -1) {
                                delete OCR.coords[currentValue];
                                currentValue = jQuery(this).attr("data-id-note");
                            }
                            if (currentValue === undefined) {
                                currentValue = "NoteDoc" + (new Date()).getTime();

                                OCR.notes[currentValue] = {};
                                jQuery(this).attr("data-value", currentValue);
                                jQuery(this).attr("data-id-note", currentValue);
                                jQuery(this).addClass("jnote");
                                jQuery("#DocumentNotes").append("<li><textarea spellcheck='false' class='noteitem form-control' id='" + currentValue + "' placeholder='Ghi chú ...' rows='2' cols='20' ></textarea></li>");
                            }
                            OCR.ocrNotes(currentValue, page, pageWidth, pageHeight);
                            OCR.setnotecount();
                            jQuery(layer).find(".jcrop-shades").addClass("jshades");
                            jQuery("#TabLabelDocNote").trigger("click");
                            jQuery(layer).find(".jcrop-shades").addClass("jshades");
                            jQuery("#" + currentValue).focus();
                        }
                    },
                    items: OCR.fields
                };
            }
        });
    },

    deleteSelection: function(s) {
        var currentValue = s.element.attr("data-value");
        if (typeof OCR.coords[currentValue] != "undefined") {
            delete OCR.coords[currentValue];
        }
        if (typeof OCR.notes[currentValue] != "undefined") {
            delete OCR.notes[currentValue];
            jQuery("#" + currentValue).closest("li").remove();
        }
    },

    ocrCoords: function(field, page, pageWidth, pageHeight) {

        var data = {};
        data.Field = field;
        data.Page = page;
        data.PageWidth = pageWidth;
        data.PageHeight = pageHeight;
        data.X = Math.round(OCR.coord.X);
        data.Y = Math.round(OCR.coord.Y);
        data.Width = OCR.coord.Width;
        data.Height = OCR.coord.Height;
        data.Id = jQuery("#IDViewer").val();

        OCR.coords[field] = data;
    },

    ocrNotes: function (field, page, pageWidth, pageHeight) {
        if (field === undefined)
            return;

        var data = {};
        data.Field = field;
        data.Page = page;
        data.PageWidth = pageWidth;
        data.PageHeight = pageHeight;
        data.X = Math.round(OCR.coord.X);
        data.Y = Math.round(OCR.coord.Y);
        data.Width = OCR.coord.Width;
        data.Height = OCR.coord.Height;
        data.Id = jQuery("#IDViewer").val();

        OCR.notes[field] = data;
    },

    checkboxs: {},
    handlenumberwritting: {},
    handlewritting: {},
    numbers: {},

    ocrText: function (field)
    {
        var data = OCR.coords[field];
        if (typeof data.Id != 'undefined')
            delete data.Id;

        data.Type = OCR.type;
        data.FieldType = 0;
        data.ID = jQuery("#IDViewer").val();
        if (typeof OCR.checkboxs[field] != "undefined") {
            data.FieldType = 1;
        }
        else if (typeof OCR.handlenumberwritting[field] != "undefined") {
            data.FieldType = 2;
        }
        else if (typeof OCR.handlewritting[field] != "undefined") {
            data.FieldType = 3;
        }
        else if (typeof OCR.numbers[field] != "undefined") {
            data.FieldType = 4;
        }

        jQuery.ajax({
            type: "POST",
            url: OCR.ocrLink,
            data: data,
            async: true,
            beforeSend: function() {
                jQuery("#FileViewer")
                    .find("[name=\"" + field + "\"]")
                    .addClass("ui-autocomplete-loading");

                jQuery(".jcrop-selection[data-value=\"" + field + "\"]")
                    .addClass("loading")
                    .removeClass("jcrop-checked")
                    .removeClass("jcrop-unchecked");
            },
            success: function(response) {

                /*Default*/
                if (data.IsChecked === 1) {
                    jQuery("#FileViewer")
                        .find("[name=\"" + field + "\"]")
                        .removeClass("ui-autocomplete-loading")
                        .prop("checked", false);
                    jQuery(".jcrop-selection[data-value=\"" + field + "\"]")
                        .removeClass("loading")
                        .addClass("jcrop-unchecked");
                } else {
                    jQuery("#FileViewer")
                        .find("[name=\"" + field + "\"]")
                        .removeClass("loading")
                        .removeClass("ui-autocomplete-loading")
                        .val("");
                    jQuery(".jcrop-selection[data-value=\"" + field + "\"]")
                        .removeClass("loading")
                        .addClass("jcrop-checked");
                }

                if (parseInt(response.status) === 1) {
                    if (data.IsChecked === 1) {
                        var checked = jQuery.trim(response.text).toString().indexOf("True") !== -1 ? true : false;
                        jQuery("#FileViewer")
                            .find("[name=\"" + field + "\"]")
                            .prop("checked", checked);

                        if (checked) {
                            jQuery(".jcrop-selection[data-value=\"" + field + "\"]")
                                .addClass("jcrop-checked");
                        }
                    } else {
                        jQuery("#FileViewer")
                            .find("[name=\"" + field + "\"]")
                            .val(jQuery.trim(response.text));
                    }
                } else {
                    alert(response.messages);
                }
            },
            error: function() {
                alert("Lỗi thực hiện xử lý thao tác");
                jQuery("#FileViewer")
                    .find("[name=\"" + field + "\"]")
                    .removeClass("ui-autocomplete-loading");
            }
        });
    },

    points: function(c, field, page, pageWidth, pageHeight) {
        if (c.x === 0 && c.y === 0) {
            return;
        }
        OCR.coord.X = c.x;
        OCR.coord.Y = c.y;
        OCR.coord.Width = c.w;
        OCR.coord.Height = c.h;

        if (typeof OCR.coords[field] != "undefined") {
            OCR.ocrCoords(field, page, pageWidth, pageHeight);
        }
        else if (typeof OCR.notes[field] != "undefined") {
            OCR.ocrNotes(field, page, pageWidth, pageHeight);
        }
    },

    drawing: function() {

        if (OCR.coords.length === 0 && OCR.notes.length === 0) {
            return false;
        }
        jQuery(".jcrop-selection").each(function() {
            var fieldS = jQuery(this).attr("data-value");
            if (fieldS == undefined || (typeof OCR.coords[fieldS] == "undefined" && typeof OCR.notes[fieldS] == "undefined")) {
                jQuery(this).remove();
            }
        });
        for (var field in OCR.coords) {
            if (OCR.coords.hasOwnProperty(field)) {
                if (typeof OCR.coords[field] == "undefined") {
                    continue;
                }
                var data = OCR.coords[field];
                var page = parseInt(data.Page) + 1;

                var flagNew = true;
                var pageWidth = jQuery("#textLayer" + page).width();
                var pageHeight = jQuery("#textLayer" + page).height();
                var rateWidth = (pageWidth / data.PageWidth).toFixed(2);
                var rateHeight = (pageHeight / data.PageHeight).toFixed(2);

                var x = Math.floor(rateWidth * data.X);
                var y = Math.floor(rateHeight * data.Y);
                var w = Math.floor(data.Width * rateWidth);
                var h = Math.floor(data.Height * rateHeight);

                var jcrops = jQuery("#textLayer" + page).find(".jcrop-selection");
                for (var kj in jcrops) {
                    if (jcrops.hasOwnProperty(kj)) {

                        var jcrop = jcrops[kj];
                        if (jQuery(jcrop).attr("data-value") === field) {
                            flagNew = false;
                            jQuery(jcrop).css({ top: y + "px", left: x + "px", width: w + "px", height: h + "px" });
                            try {
                                var shades = jQuery("#textLayer" + page).find(".jcrop-shades div");
                                jQuery(shades[0]).css({ height: y + "px", left: x + "px", width: w + "px" });
                                jQuery(shades[1]).css({ height: pageHeight + "px", left: (x + w) + "px", width: (pageWidth - (x + w)) + "px" });
                                jQuery(shades[2]).css({ height: pageHeight + "px", left: "0", width: x + "px" });
                                jQuery(shades[3]).css({ height: (pageHeight - (y + h)) + "px", left: x + "px", width: w + "px", top: (y + h) + "px" });
                            } catch (e) {
                            }
                        }
                    }
                }
                if (flagNew) {
                    OCR.layers[page].newSelection().update(
                        jQuery.Jcrop.wrapFromXywh([x, y, w, h])
                    );

                    jQuery("#textLayer" + page)
                        .find(".jcrop-current")
                        .attr("data-value", field)
                        .append(jQuery("<tag>").text(typeof OCR.fields[field] != 'undefined' ? OCR.fields[field].name : (typeof data.Name != 'undefined' ? data.Name : '')));
                }
            }
        }
        for (var field in OCR.notes) {
            if (OCR.notes.hasOwnProperty(field)) {
                if (typeof OCR.notes[field] == "undefined") {
                    continue;
                }
                var data = OCR.notes[field];
                var page = parseInt(data.Page) + 1;

                var flagNew = true;
                var pageWidth = jQuery("#textLayer" + page).width();
                var pageHeight = jQuery("#textLayer" + page).height();
                var rateWidth = (pageWidth / data.PageWidth).toFixed(2);
                var rateHeight = (pageHeight / data.PageHeight).toFixed(2);

                var x = Math.floor(rateWidth * data.X);
                var y = Math.floor(rateHeight * data.Y);
                var w = Math.floor(data.Width * rateWidth);
                var h = Math.floor(data.Height * rateHeight);

                var jcrops = jQuery("#textLayer" + page).find(".jcrop-selection");
                for (var kj in jcrops) {
                    if (jcrops.hasOwnProperty(kj)) {

                        var jcrop = jcrops[kj];
                        if (jQuery(jcrop).attr("data-value") === field) {
                            flagNew = false;
                            jQuery(jcrop).addClass("jnote").css({ top: y + "px", left: x + "px", width: w + "px", height: h + "px" });
                            try {
                                var shades = jQuery("#textLayer" + page).find(".jcrop-shades div");
                                jQuery(shades[0]).css({ height: y + "px", left: x + "px", width: w + "px" });
                                jQuery(shades[1]).css({ height: pageHeight + "px", left: (x + w) + "px", width: (pageWidth - (x + w)) + "px" });
                                jQuery(shades[2]).css({ height: pageHeight + "px", left: "0", width: x + "px" });
                                jQuery(shades[3]).css({ height: (pageHeight - (y + h)) + "px", left: x + "px", width: w + "px", top: (y + h) + "px" });
                                jQuery("#textLayer" + page).find(".jcrop-shades").addClass("jshades");
                            } catch (e) {
                            }
                        }
                    }
                }
                if (flagNew) {
                    OCR.layers[page].newSelection().update(
                        jQuery.Jcrop.wrapFromXywh([x, y, w, h])
                    );
                    jQuery("#textLayer" + page)
                        .find(".jcrop-current")
                        .addClass("jnote")
                        .attr("data-value", field)
                }
            }
        }
        return true;
    },

    fields: {}
};
jQuery(document).ready(function () {
    OCR.onEvent();
});