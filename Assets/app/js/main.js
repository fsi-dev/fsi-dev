// avcfn: Advanced Click Function
// avfn:  Advanced Function
// bfn:     Basic Function
// jsb:     Begin Js
// bte:     Boostrap Tabs Event
// cfn:     Click function
// rfn:     Document Ready function
// sbc:     Sys Browser code
// wcs:     Warning console





//--DOCUMENT READY FUNCTION BEGIN
jQuery(document).ready(function () {
  
  $.when(includeHTML()).done(function () {
    $.when(getContent()).done(function () {
        SyntaxHighlighter.highlight();
    });
  });
  
  jQuery(document).on('click', '.bd-sidenav > li > a', function(e){
    e.preventDefault();
    var link = jQuery(this).attr('href');
    console.log(link);
    jQuery(document).find(".bd-content").find("div[data-include-html]").attr('data-include-html',link); 
    includeHTML(); 

  });





  //MENU SLIDE UP DOWN
  jQuery(document).on("click",".bd-toc-link",function(e) {
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
    




  jQuery(document).find(".useScrollBar").perfectScrollbar();





});
//--WINDOW LOADED FUNCTION END

//--WINDOW RESIZE FUNCTION BEGIN
jQuery(window).resize(function () {
    
});
//--WINDOW RESIZE FUNCTION END


function includeHTML(container) {
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
}

function getContent(){
  var link = jQuery(document).find(".bd-sidenav").find("li.active").find("a").attr('href');
  console.log(link);
  jQuery(document).find(".bd-content").find("div[data-include-html]").attr('data-include-html',link);
  includeHTML(jQuery(".bd-content"));
}

function Highlight(){
    SyntaxHighlighter.config.stripBrs = false; 
    SyntaxHighlighter.defaults["gutter"] = true;  
    SyntaxHighlighter.defaults["toolbar"] = true;  
    //SyntaxHighlighter.highlight();
    SyntaxHighlighter.all();  
}