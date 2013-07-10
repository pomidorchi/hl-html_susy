$(function(){
  $( ".pin" ).draggable({ containment: ".macrophoto__main-area-image" });
  var pin_edit_block = "<div class='pin_edit_block'><a href='microphoto-new.html' class='macro'>Сделать микроснимок</a><a href='#' class='close'>Удалить метку</a></div>";

$('body').on("click", ".pin", function(){
    var this_position = $(this).position();
    if ($(this).hasClass("pin_expanded")) {
      var this_position_top=this_position.top+100;
      $(this).animate({top:this_position_top+'px'}, 200);
      $(this).removeClass("pin_expanded");
      $(this).next(".pin_edit_block").remove();
    } else {
      var this_position_top=this_position.top-100;
      $(this).animate({top:this_position_top+'px'}, 200);
      $(this).addClass("pin_expanded");
      var this_pin_edit_block = $(pin_edit_block).attr('rel', $(this).children("a").text());
      $(this).after(this_pin_edit_block);
      this_pin_edit_block.position({
        my: "center bottom-180px",
        at: "center bottom",
        of: ".pin_expanded"
      });
      this_pin_edit_block.animate({ marginTop:0,height:'100px'}, 300);
    }
  });
  $('body').on("click", ".pin_edit_block .close", function(){
  // $( ".pin_edit_block .close" ).click(function(){
  
   $(this).siblings(".macro").hide();
   $(this).removeClass("close").addClass("close_disabled");
   $(this).html($(this).html()+"?");
   $(this).after("<a class='close_yes' href='#'>ДА</a><a class='close_no' href='#'>НЕТ</a>"); 
 });

  $('body').on("click", ".pin_edit_block .close_no", function(){
        // $(this).animate({ marginTop:"-3.6em"}, 500);
        $(this).siblings(".macro").show();
        $(this).siblings(".close_disabled").addClass("close").removeClass("close_disabled");
        $(this).siblings(".close_yes").remove();
        $(this).remove();
      });

$('body').on("click", ".pin_edit_block .close_yes", function(){
    var rel = $(this).parent().attr('rel');
    $(this).parent().siblings('.pin'+rel).remove();
    $(this).parent().remove();
  });


  $('.add_pin').click(function(){
      // var last_pin = 0;
      last_pin = $(this).parent().parent().find(".pins_overlay").children(".pin").last().children("a").html();
      if(typeof last_pin==="undefined") last_pin=0;
      last_pin++;
      var the_pin='<li class="pin pin'+last_pin+'"><a href="#">'+last_pin+'</a></li>';
      console.log(the_pin);
      $(".pins_overlay").append(the_pin);
      $( ".pin" ).draggable({ containment: ".macrophoto__main-area-image" });
    });

  // $(".macrophoto__main-area-image").each(function(){
function censureAdd(target) {
     var this_index = target.index();
     target.prepend('<div class="svg_overlay" id="overlay'+this_index+'" style="position:absolute; z-index:9"></div>');
      // var id = $(this).attr("id");
      var this_div_id= $("#overlay"+this_index);
      var this_image=target.children().children().children(".macrophoto__main-area-image");
      this_div_id.width(this_image.width());
      this_div_id.height(this_image.height());
      var id = target.find(".svg_overlay").attr("id");
      var canvas = document.getElementById(id);
      editor = new VectorEditor(canvas, $(canvas).width(),$(canvas).height());
      editor.set("fill", "black");
      editor.set("fill-opacity", "1");
      editor.set("stroke-opacity","0");
      editor.setMode('rect');
      
      $(window).resize(function(){
        this_div_id.width(this_image.width());
        this_div_id.height(this_image.height());
        editor.draw.setSize(this_div_id.width(),this_div_id.height())
      })
}



$(".censure").click(function(){
  if($(this).hasClass("clicked")){
    $(this).siblings(".censure_save").remove();
  } else {
    $(this).addClass("clicked");
  censureAdd($(this).parent().parent());
  $(this).after("<a href='#' class='censure_save'><span class='iconic check'></span></a><a href='#' class='censure_dismiss'><span class='iconic x_alt'></span></a>");
  }
});

$('body').on('click', '.censure_dismiss', function(){
    $('.censure_dismiss').remove();
    $('.censure_save').remove();
    $('.svg_overlay').remove();
    $(".censure").removeClass('clicked');
});

$(".add_figure").click(function(){
  var figure = $(this).attr("rel");
  setFigure(figure);
});
$(".add_ruler").click(function(){
  lineTool();
});

// $(this).after("<a href='#' class='censure_save'><span class='iconic check'></span></a><a href='#' class='censure_dismiss'><span class='iconic x_alt'></span></a>");



function drawMark(target) {
  target.prepend('<div class="svg_overlay" id="draw_mark" style="position:absolute; z-index:9"></div>');
  var canvas = document.getElementById("draw_mark");
  
  $("#draw_mark").width($(".macrophoto__main-area-image").width());
  $("#draw_mark").height($(".macrophoto__main-area-image").height());
  editor = new VectorEditor(canvas, $(canvas).width(),$(canvas).height());

      $(window).resize(function(){
        $("#draw_mark").width($(".macrophoto__main-area-image").width());
  $("#draw_mark").height($(".macrophoto__main-area-image").height());
        editor.draw.setSize($(".macrophoto__main-area-image").width(),$(".macrophoto__main-area-image").height())
      })
}
if($("#draw_mark").length<1) drawMark($("section.patient-card__content-block"));

  $(".add_ellipse").click(function(){
  setFigure('ellipse');
});
$(".add_rectangle").click(function(){
  setFigure('rect');
});
$(".add_polygon").click(function(){
  setFigure('polygon');
});
$(".add_ruler").click(function(){
  lineTool();
});


 $("body").on("mouseup", ".svg_overlay", function(){
       if(editor.mode != "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  }); 

 $("body").on("dblclick", ".svg_overlay", function(){
    if(editor.mode = "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  });


  function setFigure(mode){
    editor.setMode(mode=='selectp'?'select+':mode);
  }

  function lineTool() {
    mode="line";
    editor.setMode(mode=='selectp'?'select+':mode);    
  }

  function setModeDelete() {
    mode="delete";
    editor.setMode(mode=='selectp'?'select+':mode);    
  }

  $("#canvas").on("mouseup", function(){
    if(editor.mode != "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  });

  $("#canvas").on("dblclick", function(){
    if(editor.mode = "polygon") {
      mode="select";
      editor.setMode(mode=='selectp'?'select+':mode);
    }
  });


});

$(function(){
  function resize() {
    var div_height = $(".macrophoto__main-area-image").height();
    if($(".macrophoto__side-macrophoto").length>0) div_height = div_height - $(".macrophoto__side-macrophoto").height();
    $(".macrophoto__side-area ul").height(div_height);
    $(".pins_overlay").height(div_height);
  }
  resize();
  window.onresize = function(event) {
    resize();
  }
});



