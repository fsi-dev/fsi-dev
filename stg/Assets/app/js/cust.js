var Cust = {

    list_gen: function(container, resize, n, width) {
        container.find(".more_slide_item.curent_slide").last().nextAll().addClass("temp_next");
        container.find(".more_slide_item.temp_next").css("opacity", ".01");
        var temp_next_length = container.find(".more_slide_item.temp_next").length;
        var next_index = container.children(".more_slide").children(".more_slide_item").index(container.children(".more_slide").children(".more_slide_item.temp_next").first());
        if (!container.attr("data-first-index") && resize != "resize") {
            container.attr("data-first-index", next_index);
        } else if (container.attr("data-first-index") && resize == "resize") {
            container.attr("data-first-index", next_index);
        }
        var first_index = container.attr("data-first-index");
        container.find(".more_slide_next").attr("data-index", next_index);
        container.find(".more_slide_prev").attr("data-index", n - first_index);
        if (temp_next_length != 0) {
            container.find(".more_slide_next").show();
            container.find(".next_count").html("+" + temp_next_length);

        } else {
            container.find(".more_slide_next").hide();
        }
        container.find(".more_slide_item.curent_slide").first().prevAll().addClass("temp_prev");
        container.find(".more_slide_item.temp_prev").css("opacity", ".01");
        var temp_prev_length = container.find(".more_slide_item.temp_prev").length;
        if (temp_prev_length != 0) {
            container.find(".more_slide_prev").show();
            container.find(".prev_count").html("+" + temp_prev_length);

        } else {
            container.find(".more_slide_prev").hide();
        }
        var translate_x = 0;
        for (i = 0, len = temp_prev_length; i < len; i++) {
            translate_x = translate_x + parseInt(container.find(".more_slide_item.temp_prev").eq(i).attr("data-width"));
        }
        var curent_x = 0;
        for (i = 0, len = container.find(".more_slide_item.curent_slide").length; i < len; i++) {
            curent_x = curent_x + parseInt(container.find(".more_slide_item.curent_slide").eq(i).attr("data-width"));
        }
        var half_x = 0;
        if (temp_next_length != 0 || temp_prev_length != 0) {
            half_x = (width - curent_x) / 2;
        }
        container.children(".more_slide").css("transform", "translateX(" + -(translate_x - half_x) + "px)");
    },
    list_pagi: function(n, resize) {
        var width = 0,
            more_slide_width = 0,
            item_width = 0,
            page_width = 0,
            next_count = 0;
        jQuery(document).find(".useMoreSlide").each(function () {
            var target = $("#" + $(this).attr("data-target"));
            target.attr("data-width", target.outerWidth(true));
            target.children(".more_slide").attr("data-width", target.children(".more_slide").outerWidth(true));
            target.find(".more_slide_item").each(function () {
                $(this).attr("data-width", $(this).outerWidth(true));
            });
            width = parseInt(target.attr("data-width"));
            more_slide_width = parseInt(target.children(".more_slide").attr("data-width"));
            target.find(".more_slide_item").removeClass("temp_prev");
            target.find(".more_slide_item").removeClass("temp_next");
            target.find(".more_slide_item").removeClass("curent_slide");
            var length = target.find(".more_slide_item").length;
            for (i = n, len = length; i < len; i++) {
                item_width = parseInt(target.find(".more_slide_item").eq(i).attr("data-width"));
                if (page_width + item_width < width) {
                    page_width = page_width + item_width;
                    target.find(".more_slide_item").eq(i).addClass("curent_slide");
                    target.find(".more_slide_item").eq(i).css("opacity", "1");
                    if (i == len - 1) {
                        Cust.list_gen(target, resize, n, width);
                    }
                } else {
                    Cust.list_gen(target, resize, n, width);
                    break
                }
            }
        });
    },
    dataTables_filter_col: function() {
        //Fix col sm as col md
        if($(document).find('.dataTables_filter > .quickSearch > div[class*="col"]').is(":visible")){
            jQuery(document).find('.dataTables_filter > .quickSearch div[class*="col"]').each(function(){
                var obj = $(this);
                var arr = obj.attr('class').split(' ');
                for(var i=0; i<arr.length; i++){
                    var class_sm = arr[i];
                    var col_sm = 'col-sm-';
                    if(class_sm.indexOf(col_sm) !== -1){
                        obj.removeClass(class_sm);
                    }
                }
                for(var j=0; j<arr.length; j++){
                    var class_md = arr[j];
                    var col_md = 'col-md-';
                    if(class_md.indexOf(col_md) !== -1){
                        var res = class_md.replace("md", "sm");
                        obj.addClass(res);
                    }
                }

            });
        }
    },
    check_required_input: function() {
        jQuery(document).find(".form-control").each(function(){
            var attr = $(this).attr('data-bv-notempty');
            if (typeof attr !== typeof undefined && attr !== false && attr==='true') {
                if(jQuery(this).parent().prev("label").is(":visible") && (jQuery(this).parent().prev("label").find(".red").size() === 0)){
                    var label_text = jQuery(this).parent().prev("label").html();
                    jQuery(this).parent().prev("label").html(label_text+' <span class="red">*</span>');
                }
            }
        });
    },
    //if button group is long > show prev next
    prev_next_group_button: function() {
        var group_button_parent_lenght =0;
        group_button_parent_lenght = $(".fileviewer .file_button_action").outerWidth(true);
        var group_button_lenght = 0;
        $(".fileviewer .important_action_btn>li:not(.hidden)").each(function () {
            var li_width = $(this).outerWidth(true);
            $(this).addClass("li_show");
            group_button_lenght = group_button_lenght + li_width;
        });
        $(".file_button_action").css("height","auto");
        //$("#FileViewer #outerContainer").css("height", "auto");
        jQuery(".fileviewer .important_action_btn>.li_show").css("width","auto");
        if(group_button_lenght > group_button_parent_lenght)
        {
            var li_width_itemts = 0;
            jQuery(".fileviewer .important_action_btn>.li_show").each(function () {
            var li_width_item = jQuery(this).outerWidth(true);
            if (parseInt(li_width_item)> parseInt(li_width_itemts)){
                li_width_itemts = li_width_item;
            }
            });
            jQuery(".fileviewer .important_action_btn>.li_show").css("width",li_width_itemts);
            var file_button_action_h = $(".file_button_action").outerHeight(true);
            var window_h = $(".secrtc1").outerHeight(true);
            var fix_h = window_h - file_button_action_h;
            $("#FileViewer #outerContainer").css("height", fix_h);
        }
    },
    fileViewer_height_fn: function() {
        if($("#FileViewer").is(":visible")){
            if($(window).width() > 991){
                //fix FileViewer height
                $("#FileViewer").css("height", "auto");
                $("#FileViewer #outerContainer").css("height",  "auto");
                $("#FileViewer .group-tab .tab-data").css("height",  "auto");
                var window_height = $(window).outerHeight(true);
                var navbar_height = 0;
                if($(".header_banner").is(":visible")){
                    navbar_height = $(".navbar").outerHeight(true) + $(".header_banner").outerHeight(true);
                }else{
                    navbar_height = $(".navbar").outerHeight(true);
                }
                var breadcrumbs_height = $(".page-breadcrumbs").outerHeight(true);
                var file_button_action_height = $("#FileViewer .file_button_action").outerHeight(true);
                var toolbarViewer_Scanfile_height = $("#FileViewer .toolbarViewer_Scanfile").outerHeight(true);
                var label_group_tab_custom_height = $("#FileViewer .label_group_tab_custom").outerHeight(true);
                var fileViewer_height = window_height - (navbar_height + breadcrumbs_height+2);
                var outerContainer_height = fileViewer_height - (file_button_action_height+2);
                var items_Scan_height  = fileViewer_height - (toolbarViewer_Scanfile_height+2);
                var tab_data_height = fileViewer_height - (label_group_tab_custom_height+2);
                var sidebar_menu_height = window_height - (navbar_height +2);
                var outerContainer_height_i = "height: "+outerContainer_height+"px !important";
                $("#FileViewer").css("height", fileViewer_height);
                $("#FileViewer .secrtc2 .widget").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult .items_Scan").css("height", items_Scan_height);
                $("#FileViewer #outerContainer").css("height", outerContainer_height);
                $("#FileViewer #DocProIMGMap").attr('style', outerContainer_height_i);
                $("#FileViewer .doc-viewer").attr('style', outerContainer_height_i);
                $("#FileViewer .group-tab .tab-data").css("height", tab_data_height);
                $(".page-sidebar .sidebar-menu").css("height", sidebar_menu_height);
            }else{
                $("#FileViewer").css("height", "auto");
                $("#FileViewer .secrtc2 .widget").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult").css("height", fileViewer_height);
                $("#FileViewer .secrtc1 .ScanResult .items_Scan").css("height", items_Scan_height);
                $("#FileViewer #outerContainer").css("height",  outerContainer_height);
                $("#FileViewer #DocProIMGMap").attr('style', outerContainer_height_i);
                $("#FileViewer .doc-viewer").attr('style', outerContainer_height_i);
                $("#FileViewer .group-tab .tab-data").css("height",  "auto");
                $(".page-sidebar .sidebar-menu").css("height","auto");
            }
        }
    },
    newsfeedimg: function() {
        // NewsFeed image grid
         $(".timeline-body").each(function () {
            if ($(this).find(".card-image").is(":visible")) {
                var NewsFeed_Image_Count = $(this).find(".card-image").length;
                //alert(NewsFeed_Image_Count);
                if(parseInt(NewsFeed_Image_Count) > 2){
                    $(this).find(".card-image").addClass("multi_card_img");
                    $(this).find(".card-image").addClass("hidden");
                    $(this).find(".card-image:eq(0)").removeClass("hidden");
                    $(this).find(".card-image:eq(1)").removeClass("hidden").addClass("equal_height");
                    $(this).find(".card-image:eq(2)").removeClass("hidden").addClass("equal_height");
                    var temp_img_heights = 0;
                    $(this).find(".card-image.equal_height img").each(function () {
                        var temp_img_height = jQuery(this).height();
                        if (parseInt(temp_img_height) > parseInt(temp_img_heights)) {
                            temp_img_heights = temp_img_height;
                        }
                    });
                    $(this).find(".card-image.equal_height").css("height", temp_img_heights);
                    $(this).find(".card-image.equal_height img").css("height", temp_img_heights);
                    $(this).find(".card-image.equal_height").addClass("fit_thumbnail");
                    if(parseInt(NewsFeed_Image_Count-3) > 0){
                        var other_img_count_msg = "<div class='other_img_count'>"+(NewsFeed_Image_Count-3)+"<i class='ion-plus-round'></i></div>";
                        $(this).find(".card-image.equal_height:eq(1) img").after(other_img_count_msg);
                        var other_img_count = $(this).find(".other_img_count").width();
                        $(this).find(".other_img_count").css("margin-left", -(other_img_count/2));
                    }
                }else if (parseInt(NewsFeed_Image_Count) == 2){
                    $(this).find(".card-image").addClass("two_card_img");
                }else{
                    $(this).find(".card-image").addClass("one_card_img");
                }
            }

         });
    },
    Scroll_table: function() {
        if($("table.table").is(":visible")){
            jQuery("table.table").each(function () {
                var obj = jQuery(this);
                if(!obj.parent().hasClass("over_auto")){
                    obj.wrapAll('<div class="over_auto"></div>');
                }
                obj.find("tbody tr").each(function () {
                    $(this).find("td").each(function (index) {
                        var data_title =  $(this).parents("tbody").prev("thead").find("tr").find("th").eq(index).clone().children().remove().end().text();
                        if(data_title.trim()){
                            //$(this).attr("data-title",data_title);
                        }
                    });
                });
            });
        }
    },
    Scroll_tab_group: function() {
        if($(".group_tab_scroll").is(":visible")){
            var group_tab_scroll_w =0;
            group_tab_scroll_w = $(".group_tab_scroll").outerWidth(true);

            var group_tab_w = 0;
            $(".group_tab_scroll .tabitem:not(.hidden)").each(function () {
                var group_tab_item_w = $(this).outerWidth(true) + 2;
                $(this).addClass("tab_show");
                group_tab_w = group_tab_w + group_tab_item_w;
            });
            if(group_tab_w > group_tab_scroll_w)
            {
                jQuery(".group_tab_scroll_next").removeClass("hidden");
                var tab_each_itemt = 0;
                jQuery(".group_tab_scroll > .tab_show").each(function () {
                    var tab_show_w = jQuery(this).outerWidth(true);
                    if (parseInt(tab_show_w) > parseInt(tab_each_itemt)){
                        tab_each_itemt = tab_show_w;
                    }
                });
                jQuery(".group_tab_scroll > .tab_show").css("width", tab_each_itemt);
                var tab_length = jQuery(".group_tab_scroll > .tab_show").length;
                $(".group_tab_scroll").css("width", tab_each_itemt*tab_length);
                var translate_css_px = 0;
                var tem_w = tab_each_itemt*tab_length;

                $(".group_tab_scroll_next").click(function () {
                    jQuery(".group_tab_scroll_prev").removeClass("hidden");
                    translate_css_px = translate_css_px - tab_each_itemt;
                    var translate_css = 'translateX('+translate_css_px+'px)';
                    $(".group_tab_scroll").css({"transform" : translate_css});
                    tem_w = tem_w -  tab_each_itemt;
                    $(".group_tab_scroll_prev").show();
                    if( tem_w <= group_tab_scroll_w  ){
                        $(this).hide();
                    }
                });
                $(".group_tab_scroll_prev").click(function () {
                    translate_css_px = translate_css_px + tab_each_itemt;
                    var translate_css = 'translateX('+translate_css_px+'px)';
                    $(".group_tab_scroll").css({"transform" : translate_css});
                    tem_w = tem_w +  tab_each_itemt;
                    $(".group_tab_scroll_next").show();
                    if( tem_w >= (tab_each_itemt*tab_length)  ){
                        $(this).hide();
                    }
                });
            }
        }
    },
    Table_sort: function() {
        if($("table .sortitem").is(":visible")){
            $(document).find(".sortitem").parents("th").addClass("sortitem_th");
        }
    }
};


//--DOCUMENT READY FUNCTION BEGIN
$(document).ready(function () {
    jQuery(document).on('click', '.more_slide_next', function () {
        var target = $("#" + $(this).parent(".useMoreSlide").attr("data-target"));
        var index = parseInt($(this).attr("data-index"));
        Cust.list_pagi(index, "");
    });
    jQuery(document).on('click', '.more_slide_prev', function () {
        var target = $("#" + $(this).parent(".useMoreSlide").attr("data-target"));
        var index = parseInt($(this).attr("data-index"));
        Cust.list_pagi(index, "");
    });
    //check nhap file bat buoc
    jQuery(document).on('submit', '.BorrowCheckRequireFile', function () {
        var form = jQuery(this);
        if (form.find('input[name="IsBorrowTake"]:checked').length > 0 && form.find('input[name="FileName"]').length==0)
        {
            form.bootstrapValidator('resetForm', true);
            form.find('#messgerequirefile').removeClass('hidden');
            return false;
        }
    });

    jQuery('.widget-buttons > [data-toggle="maximize"]').on("click",function(){
        jQuery("body").toggleClass("maximize");
    });
    Cust.dataTables_filter_col();
    Cust.check_required_input();
    $(document).on( "dialogopen", function( event, ui ) {
        if(jQuery(document).find(".date").is(":visible")){
            jQuery('.date').datetimepicker({
                format: 'd/m/Y',
                timepicker:false
            });
        }
        if(jQuery(document).find('[data-toggle="popover"]').is(":visible")){
            jQuery(document).find('[data-toggle="popover"]').popover();
        }
        if(jQuery(document).find(".selectpicker").is(":visible")){
            $('.selectpicker').selectpicker();
        }
        if(jQuery(document).find(".autoSelect2").is(":visible")){
            $("select.autoSelect2").select2();
        }
        // lock scroll position, but retain settings for later
        // var scrollPosition = [
        //   self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        //   self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
        // ];
        // var html = jQuery('html'); // it would make more sense to apply this to body, but IE7 won't have that
        // html.data('scroll-position', scrollPosition);
        // html.data('previous-overflow', html.css('overflow'));
        // html.css('overflow', 'hidden');
        // window.scrollTo(scrollPosition[0], scrollPosition[1]);
        if((jQuery(document).find("#Overlay").is(":visible"))&&(jQuery(document).find("#Overlay").hasClass("loadingc"))){
            jQuery(document).find("#Overlay").removeClass("loadingc");
        }
        Cust.check_required_input();
    });
    $(document).on( "dialogclose", function( event, ui ) {
        // un-lock scroll position
        // var html = jQuery('html');
        // var scrollPosition = html.data('scroll-position');
        // html.css('overflow', html.data('previous-overflow'));
        // window.scrollTo(scrollPosition[0], scrollPosition[1]);
    });
    $(document).on('click', '.FileNotification_btn', function(){
      $(this).parents('.FileNotification').toggleClass('is-opened');
    });
    $(document).on('click', '.FileNotiClose', function(){
      $(this).parents('.FileNotification').toggleClass('is-opened');
    });
    function display_dock() {
        //dock
        var dock = $(".dock #dockWrapper");
        dock.css("margin-top", "0px");
        dock.css("opacity", "1");
        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.css("opacity", "0");
        $(".dock").css("visibility", "visible");
        jQuery(".toggle_dock").addClass("is_hidden");
        jQuery(".toggle_dock").removeClass("is_show");
        localStorage.setItem('toggle_dock_stt', 'dock_is_show');
    }
    function hide_dock() {
        //dock
        var dock = $(".dock #dockWrapper");
        dock.css("margin-top", "100px");
        dock.css("opacity", "0");
        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.css("opacity", "1");

        $(".dock").css("visibility", "hidden");
        jQuery(".toggle_dock").removeClass("is_hidden");
        jQuery(".toggle_dock").addClass("is_show");
        localStorage.setItem('toggle_dock_stt', 'dock_is_hide');
    }
    jQuery(".btn_show_dock").click(function (e) {
        e.preventDefault();
        //dock
        var dock = $(".dock #dockWrapper");
        dock.animate({ "opacity": "1","margin-top": "0px" }, 300 );

        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.animate({ "opacity": "0" }, 300 );
        toggle_dock.css({
        'transition': 'all .3s',
        'transform': 'scale(0)',
        });

        jQuery(".toggle_dock").addClass("is_hidden");
        jQuery(".toggle_dock").removeClass("is_show");
        $(".dock").css("visibility", "visible");
        localStorage.setItem('toggle_dock_stt', 'dock_is_show');
    });
    jQuery(".btn_hide_dock").click(function (e) {
        e.preventDefault();
        //dock
        var dock = $(".dock #dockWrapper");
        dock.animate({ "margin-top": "100px", "opacity": "0" }, 300 );

        //toggle_dock
        var toggle_dock = $(".toggle_dock");
        toggle_dock.animate({ "opacity": "1" }, 300 );


        toggle_dock.css({
        'transition': 'all .3s',
        'transform': 'scale(1)',
        });

        jQuery(".toggle_dock").removeClass("is_hidden");
        jQuery(".toggle_dock").addClass("is_show");
        $(".dock").css("visibility", "hidden");
        localStorage.setItem('toggle_dock_stt', 'dock_is_hide');
    });
    if (localStorage.getItem('toggle_dock_stt') == 'dock_is_show') {
        display_dock();
    } else {
        hide_dock();
    }
    $('.multi-action .action-button').on('click', function(){
      $(this).toggleClass('active');
      if($(this).parents().attr("data-original-title") == ""){
        $(this).parents().attr("data-original-title","Danh sách ghim");
        $(this).parents().next(".tooltip").show();
      }else{
        $(this).parents().attr("data-original-title","");
        $(this).parents().next(".tooltip").hide();
      }
    });


    if(jQuery(".databox span.databox-text").is(":visible")){
        jQuery(".databox span.databox-text").each(function () {
            var databox_text = jQuery(this).text();
            jQuery(this).attr("title",databox_text);
        });
    }
    if(jQuery(".sidebar-menu .menu-text").is(":visible")){
        jQuery(".sidebar-menu .menu-text").each(function () {
            var menu_text = jQuery(this).text();
            jQuery(this).attr("title",menu_text);
        });
    }
    var temp_height = 0;
    jQuery(".contact-box").each(function () {
    var contact_box_height = jQuery(this).height();
    if (parseInt(contact_box_height)> parseInt(temp_height)){
        temp_height = contact_box_height;
    }
    });
    jQuery(".contact-box").css("height",temp_height);


    $(".target_cmt_form").click(function(){
        if ($(this).parents(".timeline-panel").find(".timeline-comment.not_show").is(":visible")) {
            $(this).parents(".timeline-panel").find(".timeline-comment.not_show .p-text-area").focus();
        }else{
            $(this).parents(".timeline-panel").find(".timeline-comment.not_show").show();
            $(this).parents(".timeline-panel").find(".timeline-comment.not_show .p-text-area").focus();
        }
    });
    $('.file_button_action_list li .dropdown-menu .slOcrForm').on('click', function(e){
        e.stopPropagation();
        e.preventDefault();
    });
    $(".reply-cmt-content a").click(function(){
        $(this).parents(".count_reply_cmt_item").hide();
        $(this).parents(".reply-cmt-content").find(".load_more_cmt").show();
    });
    $(".fileviewer .important_action_btn .enableOcr").click(function() {
       if($(".fileviewer .important_action_btn .jbuttons").is(":visible")){
        $(".fileviewer .important_action_btn .jbuttons").hide();
       }else{
        $(".fileviewer .important_action_btn .jbuttons").show();
       }
       Cust.prev_next_group_button();

    });
    $(".chat_w_item_content .box-chat-user-title .chat-name a").click(function(e) {
        e.preventDefault();
        var href = $(this).attr("href");
        location.href = href;
    });
    $(".chat_w_item_content .chat-close").click(function(e) {
        e.preventDefault();
        $(this).parents(".chat_w_item").hide();
    });
    $(".chat_w_item_content .box-chat-user-title").click(function() {
        if($(this).parents(".chat_w_item").hasClass("slideDown")){
            $(this).parents(".chat_w_item").removeClass("slideDown");
        }else{
            $(this).parents(".chat_w_item").addClass("slideDown");
        }
    });
    //advanced_search_bar
    $(".advanced_search_bar .show_form_btn").focus(function() {
        $(this).parents(".advanced_search_bar").addClass("active");
        $(this).parents(".advanced_search_bar").find(".option_search").fadeIn();
    });
    $(".advanced_search_bar .hide_form_btn").click(function() {
        $(this).parents(".advanced_search_bar").removeClass("active");
        $(this).parents(".option_search").fadeOut();
    });
    //notification
    $(".notifies-dropdown-toggle").click(function() {
        if($(this).parents("li").hasClass("open")){
            $(this).parents("li").removeClass("open");
        }else{
            $(this).parents("li").addClass("open");
        }
    });
    jQuery(document).mouseup(function (e) {
        var container = jQuery(".notifies-dropdown-toggle").parents("li");
        if (container.is(":visible")) {
            if (!container.is(e.target) // if the target of the click isn't the container...
                && container.has(e.target).length === 0) // ... nor a descendant of the container
            {
                $(".notifies-dropdown-toggle").parents("li").removeClass("open");
            }
        }
    });
    jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover a .dropdown-expand").click(function(event){
        event.stopPropagation();
        event.preventDefault();
        jQuery(this).toggleClass("inited");
        jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover a .dropdown-expand:not('.inited')").removeClass("active");
        jQuery(this).toggleClass("active");
        jQuery(this).removeClass("inited");

        jQuery(this).parents(".dropdown-hover").toggleClass("inited");
        jQuery(".navbar .navbar-inner .navbar-header .navbar-account .account-area li.dropdown-hover:not('.inited')").find(".dropdown-menu").slideUp(300);
        jQuery(this).parents(".dropdown-hover").find(".dropdown-menu").slideToggle(300);
        jQuery(this).parents(".dropdown-hover").removeClass("inited");
    });

    $('[data-toggle="tooltip"]').tooltip();

    var dragTimer;
    $(window).on('dragenter', function(){
        $(this).preventDefault();
    });
    $(document).on('dragover', function(e) {
      var dt = e.originalEvent.dataTransfer;
      if (dt.types && (dt.types.indexOf ? dt.types.indexOf('Files') != -1 : dt.types.contains('Files'))) {
          $("#drap_drop_fixed").addClass("active");
          $(".drap_drop_fixed_ov").addClass("active");
          window.clearTimeout(dragTimer);
      }
    });
    jQuery(document).on("click", ".close_drap_drop", function () {
        rule_check();
    })
    $(".close_drap_drop").on('click', function (e) {
        e.preventDefault();
        $("#drap_drop_fixed").removeClass("active");
        $(".drap_drop_fixed_ov").removeClass("active");
    });

    // =========== FIT IMAGE TO DIV ==========
    // Detect objectFit support
    if($(".fit_thumbnail").is(":visible")){
        if ('objectFit' in document.documentElement.style === false) {
            // assign HTMLCollection with parents of images with objectFit to variable
            var container = document.getElementsByClassName('fit_thumbnail');
            // Loop through HTMLCollection
            for (var i = 0; i < container.length; i++) {
                // Asign image source to variable
                var imageSource = container[i].querySelector('img').src;
                // Hide image
                container[i].querySelector('img').style.display = 'none';
                // Add background-size: cover
                container[i].style.backgroundSize = 'cover';
                // Add background-image: and put image source here
                container[i].style.backgroundImage = 'url(' + imageSource + ')';
                // Add background-position: center center
                container[i].style.backgroundPosition = 'center center';
            }
        }
        else {
            // You don't have to worry
            //console.log('No worries, your browser supports objectFit')
        }
    }

    // JS click user
    $( '.click_caret' ).click(function( event ) {
        event.preventDefault();
        $('.drop_click_caret').toggleClass('open');
    });
    $(document).click(function(e) {
        var target = e.target;
        if (!$(target).is('.click_caret') && !$(target).is('.click_caret')) {
            $('.drop_click_caret').removeClass('open');
        }
    });
    // JS ADV SEARCH
    $(document).on("click", ".AdvSearchLink", function(e) {
        e.preventDefault();
        var url = $(this).attr("myhref");
        window.location = url;
    });

    $('.advanced_search_bar .btn-searchs .btn-group').on('shown.bs.dropdown', function(){
        $(this).find(".bootstrap-select > .dropdown-menu > .dropdown-menu.inner").addClass("useScrollbar");
        $(this).find(".bootstrap-select > .dropdown-menu > .dropdown-menu.inner.useScrollbar").perfectScrollbar();     
    });
    //JS DATAFILLTER SEARCH
    jQuery(document).on('click', '.dataFilter_Dropdown .dropdown-toggle', function(){
        jQuery(this).parents(".dataFilter_Dropdown").toggleClass("open");
        jQuery(this).parents(".quickSearch ").find(".dataFilter_Dropdown_target").toggleClass("open");
    });
    jQuery(document).on('click', '.dataFilter_Dropdown_close', function(e){
        e.preventDefault();
        jQuery(this).parents(".quickSearch").find(".dataFilter_Dropdown").toggleClass("open");
        jQuery(this).parents(".quickSearch").find(".dataFilter_Dropdown_target").toggleClass("open");
    });


    
});
//--DOCUMENT READY FUNCTION END

//--WINDOW LOADED FUNCTION BEGIN
$(window).bind("load", function () {
    if($('[data-toggle="tooltip"]').is(":visible")){
        $('[data-toggle="tooltip"]').tooltip();
    };
    
$(document).find('.dataTables_wrapper .table:not(.useTreegrid)').each(function() {
	if(!$(this).hasClass("stacktable_inited") && !$(this).hasClass("not_js_responsive")){
		$(this).addClass("stacktable_inited");
		$(this).stacktable();
	}
});	
    // ScanFile_Page();
    // ScanFile_Atc();
    // ScanFile_FixWH();
    // ScanFile_Rorate();
    // $(document).find('#page_zoom_select').on('change', function(){
    //     szoom_stt = $(document).find('#page_zoom_select :selected').val();
    //     ScanFile_FixWH();
    //     if(rorated){
    //         $(document).find(".other_tools").find(".rorate_left").click();

    //     }
    // });
    // $(document).find('.page_zoomer').find('.minus_zoom').on('click', function(){
    //     var tem_val = szoom_stt;
    //     if(tem_val>1){
    //         tem_val = parseInt(tem_val) - 1;
    //         szoom_stt = tem_val;
    //     }
    //     $(document).find('#page_zoom_select').val(szoom_stt);
    //     ScanFile_FixWH();
    //     if(rorated){
    //         $(document).find(".other_tools").find(".rorate_left").click();

    //     }
    // });
    // $(document).find('.page_zoomer').find('.plus_zoom').on('click', function(){
    //     var tem_val = szoom_stt;
    //     if(tem_val<9){
    //         tem_val = parseInt(tem_val) + 1;
    //         szoom_stt = tem_val;
    //     }
    //     $(document).find('#page_zoom_select').val(szoom_stt);
    //     ScanFile_FixWH();
    //     if(rorated){
    //         $(document).find(".other_tools").find(".rorate_left").click();

    //     }
    // });



    Cust.newsfeedimg();
    Cust.prev_next_group_button();
    Cust.fileViewer_height_fn();
    Cust.Scroll_table();
    Cust.Scroll_tab_group();
    Cust.Table_sort();
    // =========== fit_thumbnail img height ==========
    jQuery(".fit_thumbnail img").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
    });
    jQuery(".fit_thumbnail iframe").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
        // console.log(thum_div_height);
    });
        $('.toggle_notifications').on('click', function(){
        if(!$(this).hasClass("inited")){
            $(this).addClass("inited");
            var Ntf_less_count = 0;
            jQuery(document).find("#NtfContainer").find(".user_item").each(function(){
                Ntf_less_count = Ntf_less_count + 1;
                var obj = $(this);
                obj.find(".user_item_info > em").attr("id","Ntf_less_"+Ntf_less_count);
                var elm = document.getElementById("Ntf_less_"+Ntf_less_count);
                if (elm.offsetHeight < elm.scrollHeight) {
                    obj.find(".user_item_info > em").addClass("active");
                    obj.find(".user_item_info > em").append('<a class="icon_show_full_content" href="#" alt="Xem đầy đủ nội dung" title="Xem đầy đủ nội dung"><i class="fa fa-plus-square" aria-hidden="true"></i></a>');
                }  
            });
        }
    });
    jQuery(document).on('click', '#NtfContainer .icon_show_full_content', function(e){
        e.preventDefault();
        $(this).parent("em").toggleClass("open");    
    });
    //Header right dropdown menu
    $('.header_mainMenu').on('show.bs.dropdown', function(){
        var length = $(this).find(".dropdown-notifications>li").length;
        if(!$(this).hasClass("inited") && length > 5){
            $(this).addClass("inited");
            $(this).addClass("is_full");
            $(this).parents(".account-area").addClass("is_full");
            
        }
    });
    //Header left menu when sidebar is empty
    if(!$(".page-sidebar").size() == 0){
        $("#sidebar-collapse").addClass("is_show");
    }
});    
//--WINDOW LOADED FUNCTION END    
//--WINDOW RESIZE FUNCTION BEGIN
$(window).resize(function () {
    Cust.list_pagi(0, "resize");
    Cust.prev_next_group_button();
    Cust.fileViewer_height_fn();
    Cust.Scroll_tab_group();
    // =========== fit_thumbnail img height ==========
    jQuery(".fit_thumbnail img").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
    });
    jQuery(".fit_thumbnail iframe").each(function () {
        var thum_div_height = jQuery(this).parents(".fit_thumbnail").innerHeight();
        jQuery(this).css("height", thum_div_height);
        // console.log(thum_div_height);
    });

});
//--WINDOW RESIZE FUNCTION END


