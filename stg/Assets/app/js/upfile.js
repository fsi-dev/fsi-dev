var UpfilePage = {

    init: function () {

        UpfilePage.onEvent();
        UpfilePage.upEvent();
    },

    onEvent: function () {

        jQuery(document).on("click", ".attachFile", function () {
            var data = jQuery(this).getData();
            jQuery(data.rel).attr("data-target", data.target);
            jQuery(data.rel).attr("data-file-name", data.fileName);
            jQuery(data.rel).attr("data-file-path", data.filePath);
            if (typeof data.dialogId != 'undefined')
            {
                jQuery(data.rel).attr("data-dialog-id", data.dialogId);
                jQuery(data.rel).attr("data-width", data.width);
            }
            else
            {
                jQuery(data.rel).removeAttr("data-width");
                jQuery(data.rel).removeAttr("data-dialog-id");
            }
            if (typeof data.href != 'undefined')
            {
                jQuery(data.target).closest("form").attr("action", data.href);
            }
            if (typeof data.id != 'undefined')
            {
                jQuery(data.target).closest("form").find("[name='ID']").val(data.id);
            }

            jQuery(data.rel).val("").trigger("click");
            return false;
        });
        jQuery(document).on("click", ".delMember", function () {
            jQuery(this).closest(".member").slideUp("slow", function () {
                var parent = jQuery(this).parent();
                if (parent.find(".member").length == 1) {
                    parent.addClass("hidden");
                }
                jQuery(this).remove();
            });
        });
        jQuery(document).on("click", ".syncFolders", function (e) {
            e.preventDefault();

            var data = jQuery(this).getData();
            jQuery.ajax({
                type: "POST",
                async: true,
                url: ScanSettings.url + "/plugin/sync",
                data: JSON.stringify({
                    Token: window.Cdata.Token,
                    Parent: data.parentId,
                    IDDoctype: data.idDoctype || 0,
                    SyncType: data.syncType || 0,
                    UrlSave: Utils.getDomain() + data.href,
                    UrlStorage: window.Cdata.Storage.domain,
                    ProductKey: window.Cdata.ProductKey
                }),
                contentType: "application/json; charset=utf-8",
                begin: function(){
                    Utils.openOverlay();
                },
                error: function () {
                    jQuery("#DPlugin").dialog({
                        width: 450,
                        autoOpen: true,
                        resizable: false,
                        open: function () {
                            Utils.openOverlay();
                        },
                        close: function () {
                            Utils.closeOverlay();
                        }
                    });
                },
                success: function (response) {
                    var res = jQuery.parseJSON(response);
                    if (res.status.toString() == "0") {
                        alert("Chương trình đang xử lý. Vui lòng xem lại trong [Task Manager]");
                    }
                }
            });

            return false;
        });
    },
    upEvent: function (container) {
        if (Utils.isEmpty(container))
            container = jQuery(document);

        container.find(".inputUpFile").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled"))
            {
                obj.hasClass("setUpFiled");
                obj.ajaxUploader({
                    name: "FileDocument",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    //elTarget: obj.attr("data-target"),
                    onBegin: function (file, t) {
                        jQuery(obj.attr("data-target")).html("<div id='R" + file.id + "' class='fileitem member sortitem loading'></div>");
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
                        jQuery(dataObj.target).closest(".hidden").removeClass("hidden");

                        if (Utils.IsVideo(data.FilePath) || Utils.IsAudio(data.FilePath)) {
                            jQuery("#R" + file.id).replaceWith(jQuery(
                                "<span class='fileitem member sortitem'>" +
                                    "<video width='240' height='180' style='max-width: 100%;' controls>" +
                                        "<source src='" + Cdata.SrcPath(data.FilePath) + "' type='" + data.ContentType + "'>" +
                                        "<source src='movie.ogg' type='video/ogg'>" +
                                        "Your browser does not support the video tag." +
                                    "</video>" +
                                    "<input name='" + dataObj.fileName + "' class='fileNames' type='text' value='" + data.FileName + "' />" +
                                    "<input name='" + dataObj.filePath + "' class='filePaths' type='hidden' value='" + data.FilePath + "'/>" +
                                    "<button type='button' class='btn btn-xs btn-link close delMember'>x</button>" +
                                "</span>"
                            ));
                        }
                        else {
                            jQuery("#R" + file.id).replaceWith(jQuery(
                                "<span class='fileitem member sortitem'>" +
                                    "<img class='img-thumbnail' src='" + Cdata.SrcPath(data.FilePath) + "' title='" + data.FileName + "' />" +
                                    "<input name='" + dataObj.fileName + "' class='fileNames' type='text' value='" + data.FileName + "' />" +
                                    "<input name='" + dataObj.filePath + "' class='filePaths' type='hidden' value='" + data.FilePath + "'/>" +
                                    "<button type='button' class='btn btn-xs btn-link close delMember'>x</button>" +
                                "</span>"
                            ));
                        }
                        try
                        {
                            var form = jQuery(dataObj.target).closest("form");
                            if (form.hasClass("bootstrapValidator")) {
                                form.bootstrapValidator('revalidateField', jQuery(dataObj.target).attr("data-bv-field-rel"));
                            }
                        } catch (e) {
                        }

                        if (typeof dataObj.dialogId != 'undefined')
                        {
                            var dialoger = jQuery(dataObj.dialogId);
                            dialoger.bootstrapValidator('disableSubmitButtons', false).bootstrapValidator('resetForm', true);
                            if (dialoger.hasClass("quickSubmit") && dialoger.hasClass("bootstrapValidator")) {
                                dialoger.removeClass("bootstrapValidator").bootstrapValidator('destroy');
                                dialoger.unbind();
                            }
                            UpfilePage.dialogUp(dialoger, dataObj.width);
                        }
                    }
                });
            }
        });

        container.find(".inputUpFiles").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled")) 
            {
                obj.hasClass("setUpFiled");
                obj.ajaxUploader({
                    name: "FileDocument",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    //elTarget: obj.attr("data-target"),
                    onBegin: function (e, elTarget) {
                        return true;
                    },
                    onClientLoadStart: function (e, file, t) {

                    },
                    onClientProgress: function (e, file) {
                        UpfilePage.onProgress(e, file);
                    },
                    onServerProgress: function (e, file, t) {
                        UpfilePage.onProgress(e, file);
                    },
                    onClientAbort: function (e, file) {
                        UpfilePage.onAbort(e, file);
                    },
                    onClientError: function (e, file) {
                        UpfilePage.onAbort(e, file);
                    },
                    onServerAbort: function (e, file, t) {
                        UpfilePage.onAbort(e, file);
                    },
                    onServerError: function (e, file, t) {
                        UpfilePage.onAbort(e, file);
                    },
                    onSuccess: function (e, file, t, data) {
                        var dataObj = obj.getData();
                        var targetObj = jQuery(dataObj.target);
                        targetObj.closest(".hidden").removeClass("hidden");

                        if (targetObj.hasClass("ui-group-item")) {
                            var item = jQuery(
                                "<div class='form-group has-feedback member isNew'>" +
                                    "<div class='col-lg-12'>" +
                                        "<input name='" + dataObj.filePath + "' type='hidden' value='" + data.FilePath + "'/>" +
                                        "<input name='" + dataObj.fileName + "' type='text' class='form-control' data-bv-notempty-message='" + dataObj.bvNotemptyMessage + "' data-bv-notempty='true' data-bv-field='" + dataObj.fileName + "' value='" + data.FileName + "' />" +
                                        "<i class='glyphicon glyphicon-remove delMember'></i>" +
                                    "</div>" +
                                "</div>"
                            );
                            targetObj.removeClass("loading").append(item);
                            item.bootstrapValidator();
                        }
                        else {
                            targetObj.removeClass("loading").append(
                                "<span class='fileitem member isNew'>" +
                                    "<img class='img-thumbnail' src='" + Cdata.SrcPath(data.FilePath) + "' title='" + data.FileName + "' />" +
                                    "<input name='" + dataObj.fileName + "' class='fileNames' type='text' value='" + data.FileName + "' />" +
                                    "<input name='" + dataObj.filePath + "' class='filePaths' type='hidden' value='" + data.FilePath + "'/>" +
                                    "<button type='button' class='btn btn-xs btn-link close delMember'>x</button>" +
                                "</span>"
                            );
                        }

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

        container.find("#InputAvatar").each(function () {
            var obj = jQuery(this);
            if (!obj.hasClass("setUpFiled")) {
                obj.ajaxUploader({
                    name: "FileDocument",
                    dragBox: "#AvatarDrager",
                    postUrl: Cdata.Storage.domain + "/uploader/upfile",
                    onBegin: function () {
                        jQuery("#AvatarDrager").addClass("loading");
                        return true;
                    },
                    onChange: function () {
                        return true;
                    },
                    onDrop: function () {
                        return true;
                    },
                    onClientLoadStart: function () {
                    },
                    onClientProgress: function () {
                    },
                    onClientAbort: function () {
                        jQuery("#AvatarDrager").removeClass("loading");
                    },
                    onClientError: function () {
                        jQuery("#AvatarDrager").removeClass("loading");
                    },
                    onSuccess: function (e, file, dragbox, data) {
                        var html = "";
                        var thumbPath = "/thumb/120xauto/" + data.FilePath;
                        var avatarUrl = Cdata.Storage.domain + thumbPath + "?" + (new Date).getTime();
                        html += "<a class='imgavt'>";
                        html += "<img id='ImageAvatar' src='" + avatarUrl + "' />";
                        html += "</a>";
                        html += "<input type='hidden' name='Avatar' value='" + thumbPath + "' />";

                        jQuery("#AvatarDrager").removeClass("loading");
                        jQuery("#AvatarDrager").html(html);
                        jQuery("#ImageAvatar").load(function () {
                            AvatarPage.initCrop();
                        });
                    }
                });
            }
        });
    },
    upEventRow: function (row) {
        row.find(".datetime").datetimepicker({
            format: "d-m-Y H:i",
            lang: "vi",
            scrollInput: false
        });
    },
    onProgress: function (e, file) {
        var pc = Math.floor(100 * (e.loaded / e.total));
        var rowId = UpfilePage.getRowId(file.id, true);
        jQuery(rowId).find(".progress-bar").css("width", pc + "%");
        jQuery(rowId).find(".progress-label").text(pc + "%");
    },
    onAbort: function (e, file) {
        jQuery(UpfilePage.getRowId(file.id, true))
            .find(".upStatus")
            .html("<a href='#' class='loadfail' title='Tải tài liệu lên không thành công' ></a>");
    },
    getRowId: function (fileId, isSelector) {
        return (isSelector ? "#" : "") + "DocUploadR" + fileId;
    },

    dialogUp: function (elTarget, width) {
        elTarget.dialog({
            width: width || 350,
            autoOpen: true,
            resizable: false,
            open: function () {
                elTarget.fadeIn();
                Utils.openOverlay();
            },
            close: function () {
                jQuery(this).closest(".ui-dialog").removeClass("hiddenDialog");
                var hiddenDialogs = jQuery(document).find(".hiddenDialog");
                if (hiddenDialogs.length > 0) {
                    hiddenDialogs.last().removeClass("hidden");
                } else {
                    Utils.closeOverlay();
                }
            }
        });
    }
};
jQuery(document).ready(function () {
    UpfilePage.init();
})