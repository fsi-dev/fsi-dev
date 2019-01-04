// avcfn: Advanced Click Function
// avfn:  Advanced Function
// bfn:     Basic Function
// jsb:     Begin Js
// bte:     Boostrap Tabs Event
// cfn:     Click function
// rfn:     Document Ready function
// sbc:     Sys Browser code
// wcs:     Warning console
function reload() {
    Cdata.init();
    Smile.init();
    Main.init();

    Utils.autoCloseFlash();
    Utils.updateImageViewer();
    Utils.updatePlayer(jQuery(document));
    Utils.updateChart(jQuery(document));
    Utils.updateFormState(jQuery(document));
    Utils.updateInputDate(jQuery(document));
    Utils.updateScrollBar(jQuery(document));
    Autocomplete.init(jQuery(document));    
}





//--DOCUMENT READY FUNCTION BEGIN
jQuery(document).ready(function () {
  
  $.when(includeHTML()).done(function () {


      var check_menu = setInterval(function(){
        if($(".bd-sidebar-content").length != 0){
          clearInterval(check_menu);
          if(document.location.hash){
            load_hash();
          }else{
            getContent("null","false");  
            jQuery(document).find(".useScrollBar").perfectScrollbar();             
          }
        }else{
        }
      }, 10);

  });

  jQuery(document).on('click', '.bd-sidenav > li > a', function(e){
    e.preventDefault();
    $(".bd-sidebar .bd-sidenav > li").removeClass("active");
    $(this).parent("li").addClass("active");
    var link = jQuery(this).attr('data-href');
    syslink(link);
    if(link != "" && link != "#"){
      jQuery(document).find(".bd-content").html("");
      jQuery(document).find(".bd-content").append('<div data-include-html="'+link+'"></div>'); 
      includeHTML(jQuery(".bd-content"));
      var check_highlight = setInterval(function(){
        if($(".syntaxhighlighter").length != 0){
          clearInterval(check_highlight);
        }else{
          Highlight();
        }
      }, 10); 
    }

  });

  jQuery(document).on('click','.menuBar_btn', function(e){
    e.preventDefault();
    $("body").toggleClass("showmenu");
    $(".navbar-nav-scroll").slideToggle("fast");
  });



  //MENU SLIDE UP DOWN
  jQuery(document).on("click",".bd-toc-link",function(e) {
    if(!$(this).parent(".bd-toc-item").hasClass("sidebar_link")){
      e.preventDefault();
      $("#bd_docs_nav.useScrollBar").perfectScrollbar("destroy");
      jQuery('.bd-toc-item').not($(this).parent(".bd-toc-item")).children(".bd-sidenav").each(function() {
        $(this).slideUp(300, function() {
          $(this).parent(".bd-toc-item").removeClass("active");
        });
      });
      if ($(this).parent(".bd-toc-item").hasClass("active")) {
        $(this).parent(".bd-toc-item").children(".bd-sidenav").slideUp(300, function() {
          $(this).parent(".bd-toc-item").removeClass("active");
          $(this).parent(".bd-toc-item").attr("data-show","false");
        });
      } else {
        $(this).parent(".bd-toc-item").children(".bd-sidenav").slideDown(300, function() {
          $(this).parent(".bd-toc-item").addClass("active");
          $(this).parent(".bd-toc-item").attr("data-show","true");
          $("#bd_docs_nav.useScrollBar").perfectScrollbar();
        });
      }

    }
  });
  //SEARCH
  jQuery(document).on("focus","#search-input",function() {
    $(".bd-toc-item").each(function() {
      if ($(this).attr("data-inited") != "true") {
        if ($(this).hasClass("active")) {
          $(this).attr("data-show", "true");
        } else {
          $(this).attr("data-show", "false");
        }
        $(this).attr("data-inited", "true")
      }
    });
  });
  function search_filter() {
    $("#bd_docs_nav.useScrollBar").perfectScrollbar("destroy");
    var filter, div, ul, li, a, i;
    filter = jQuery(document).find("#search-input").val().toUpperCase();
    div = $(".bd-toc-item");
    ul = div.children(".bd-sidenav");
    li = ul.children("li");
    if (!filter) {
      div.each(function() {
        if ($(this).attr("data-show") == "true") {
          $(this).addClass("active");
          $(this).children(".bd-sidenav").css("display","block");
        } else {
          $(this).removeClass("active");
          $(this).children(".bd-sidenav").css("display","none");
        }
      });
      div.removeClass("hidden");
      ul.removeClass("hidden");
      li.removeClass("hidden");
      li.removeClass("highlight_search");
    } else {
          div.removeClass("active");
          div.addClass("hidden");
          ul.addClass("hidden");
          li.addClass("hidden");       
      for (i = 0; i < li.length; i++) {
        a = li.eq(i).find("a");
        if (a.html().toUpperCase().indexOf(filter) > -1) {
          li.eq(i).parents(".bd-toc-item").addClass("active");
          li.eq(i).parents(".bd-toc-item").removeClass("hidden");
          li.eq(i).parent(".bd-sidenav").removeClass("hidden");
          li.eq(i).parent(".bd-sidenav").css("display","block");
          li.eq(i).removeClass("hidden");
          var string = $.trim(a.html().toUpperCase());
          if (filter == string) {
            li.eq(i).addClass("highlight_search");
          } else {
            li.eq(i).removeClass("highlight_search");
          }
        }
      }
    }
  }
  jQuery(document).on("keyup","#search-input",function() {
    search_filter();
    $("#bd_docs_nav.useScrollBar").perfectScrollbar();
  });




});
//--DOCUMENT READY FUNCTION END

//--WINDOW LOADED FUNCTION BEGIN
jQuery(window).bind("load", function () {

});
//--WINDOW LOADED FUNCTION END

//--WINDOW RESIZE FUNCTION BEGIN
jQuery(window).resize(function () {
    
});
//--WINDOW RESIZE FUNCTION END


jQuery(window).load(function () {

});
function load_hash() {
  if(document.location.hash){

    var hash = document.location.hash.replace("#", "");
    jQuery('.bd-sidenav > li > a').each(function(){
      var compare_link = $(this).attr('data-href').split("/").pop(-1).split('.')[0];
      if(compare_link == hash){
        $('.bd-sidenav li').removeClass("active");
        $(this).parent("li").addClass("active");


        jQuery(document).find("#bd_docs_nav").find('.bd-toc-item').removeClass("active");
        jQuery(document).find("#bd_docs_nav").find('.bd-toc-item').children(".bd-sidenav").slideUp();
        $(this).parents(".bd-toc-item").addClass("active");
        $(this).parents(".bd-toc-item").children(".bd-sidenav").slideDown();


        getContent($(this).attr('data-href'),"true");  
        return false
      }
    });
  }else{
    getContent("null","false"); 
  }


     
}

var includeHTML = function(container) {
  if (!container){
    container = jQuery(document);
  }
  container.find("*[data-include-html]").each(function() {
    var obj = jQuery(this);
    if(!obj.hasClass('inited') && obj.attr("data-include-html") != ''){
      obj.addClass('inited');
      /*search for elements with a certain atrribute:*/
      var file = obj.attr("data-include-html");
      if (file) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {
              obj.after(this.responseText);
              obj.remove();
              reload();
                       
            }
            if (this.status == 404) {
              obj.html('Page not found.');
            }
          }
        } 
        xhttp.open("GET", file, true);
        xhttp.send(); 

      }   
    }     
  });  

};
$(window).on("popstate", function(event) {
  load_hash();
});
function syslink(link,has_popstate) {
  if(link == "" || link == "#"){
    return false
  }
  if(has_popstate != "true"){
    var sort_link = link.split("/").pop(-1).split('.')[0];
    console.log("link: "+link);
    console.log("sort_link: "+sort_link);
    window.history.pushState('', '', '#'+sort_link);
    return false;
  }

  
}
var getContent = function(link,has_popstate){
  if(link == "null"){
    if(jQuery(document).find(".bd-sidenav").find("li").hasClass("active")){
      link = jQuery(document).find(".bd-sidenav").find("li.active").find("a").attr('data-href');
    }else{
      link = jQuery(document).find("#bd_docs_nav").find('.bd-toc-item').first().find(".bd-sidenav").find("li").first().find("a").attr('data-href');
      jQuery(document).find("#bd_docs_nav").find('.bd-toc-item').first().find(".bd-sidenav").find("li").first().addClass("active");
    }
  }   

  syslink(link,has_popstate);     
  if(has_popstate == "true"){
    jQuery(document).find(".bd-content").html('<div data-include-html=""></div>');
  }
  jQuery(document).find(".bd-content").find("div[data-include-html]").attr('data-include-html',link);
  
  includeHTML(jQuery(".bd-content"));
  var check_highlight = setInterval(function(){
    if($(".syntaxhighlighter").length != 0){
      clearInterval(check_highlight);
    }else{
      Highlight();
    }
  }, 10); 
  
};

var Highlight = function(){
    SyntaxHighlighter.config.stripBrs = false; 
    SyntaxHighlighter.defaults["gutter"] = true;  
    SyntaxHighlighter.defaults["toolbar"] = true;  
    SyntaxHighlighter.highlight();
    SyntaxHighlighter.all(); 
};

  // $.when(includeHTML()).done(function () {

  //     if($(".bd-sidebar-content").length != 0){
  //       getContent(link,has_popstate);
  //     }else{
  //     }
  // });