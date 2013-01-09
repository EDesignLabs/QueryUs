$(function(){

  var start = false;
  var question = (getURLParameter('question')) ? getURLParameter('question') : "THIS IS A TEST";
  var description = (getURLParameter('description')) ? getURLParameter('description') : "Description";
  var dataURL = (getURLParameter('data')) ? "php/ba-simple-proxy.php?mode=native&url=" + getURLParameter('data') : "test.csv";
  var lastUpdateColumnIndex = -1;

  if (getURLParameter('start')){
    start = true;
    question = "Are you ready?";
    description = "Welcome to QueryUs.";
    dataURL = "test.csv";
  }


  $('.lead.main').text(description);
  $('.lead.sub span').text(question);

  //GO SCREEN
  $('.screen').first().show();
  $('.screen').first().find(".lead").css("margin-top", $(window).height()/2 - 100+ "px");


  var clicks = 0;
  $('.go button').click(function(){
    clicks++
    if (start == false || clicks == 2){

      $('.screen').first().slideUp();
      $('.screen').last().slideDown();

      if (start){
        $(".explainer").first().show();
        $("button.publish").hide();
        $("#table").css('opacity',".3")
        $("#breadcrumbs").css('opacity',".3")
      }


    }else{

      $('.lead.main').text("This explains questions");
      $(this).text("Ready");
      $('.lead.sub span').text("What are apples?");
    }
  });


  //Table stuff

    var colors = ["005538","005C95","35213D","AC1353","871E3D","F14108","D75C0F",       "005538","005C95","35213D","AC1353","871E3D","F14108","D75C0F", "005538","005C95","35213D","AC1353","871E3D","F14108","D75C0F", "005538","005C95","35213D","AC1353","871E3D","F14108","D75C0F", "005538","005C95","35213D","AC1353","871E3D","F14108","D75C0F"];

    var $tabs = $('#tabs');
    var tabCounter = 0;

    $tabs.tabs();

    $tabs.addClass('ui-state-hover');

    $tabs.find( ".ui-tabs-nav" ).sortable({
        axis: "y",
        stop: function() {
            $tabs.tabs( "refresh" );
        }
    });



    $('#CSVTable').CSVToTable(dataURL).bind("loadComplete",function() { 

        $("#status #rows").text("There are " + ( $("table").find("tr").not(".filtered").length - 2)+" rows left in the table.");

        //enable sort functionality 
        $('#CSVTable').find('TABLE')
          .tablesorter({widgets: ["zebra", "filter"]})
          .bind('filterEnd', function(){ 
            

            $("#status #rows").text("There are " + ( $("table").find("tr").not(".filtered").length - 2)+" rows left in the table.");


            console.log($('#CSVTable table').data().tablesorter.parsers)
            

          });

        //add breacrumbs 
        $('#CSVTable thead tr th').each(function(index, ele){
            $('#breadcrumbs').append( '<li class = "breadcrumb animated flipInY"><a style = "background-color:#'+colors[index]+'" >'+$(ele).text()+'</a></li>' );
            $(this).css('background-color', '#'+colors[index]);
        });

        $( ".breadcrumb a" ).click(function() {


            if (start){
              $('.explainer').eq(1).fadeOut();
              $('.explainer').eq(2).fadeIn();
              $('#breadcrumbs').fadeTo("fast",.3);

            }

            $(".lead").show();
            $(".explain").hide();
            
            //tab creation
            $tabs.find( ".ui-tabs-nav" ).append( "<li class = 'bounceIn animated' style = 'background-color:"+$(this).css('background-color')+"' ><span class='ui-icon ui-icon-close'>Remove Tab</span><a href='#tab-"+tabCounter+"'>"+$(this).text()+"</a> </li>");
            
            var dataType = $('#CSVTable table').data().tablesorter.parsers[$(this).parent().index()].type;
            
            var $newTab = $(tmpl(dataType, {"tabCounter": tabCounter, "title": $(this).text().toLowerCase() })).data('colIndex', $(this).parent().index());

            $newTab.find('select').change(function() {
              updateTable(); 

              if (start){
                $('.explainer').eq(3).fadeOut();
                $('.explainer').eq(4).fadeIn();
              }

            });

            $newTab.find('input').bind('keyup change',function(){ 
              updateTable(); 
              if (start){
                $('.explainer').eq(4).fadeOut();
                $('.explainer').eq(5).fadeIn();
                $('#tabs').fadeTo("fast",.2);
                $('#table').fadeTo("fast",1);
              }
            });

            $tabs.find( "span.ui-icon-close" ).live( "click", function() {
                var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
                $( "#" + panelId ).remove();
                $tabs.tabs( "refresh" );
            });
            



            $tabs.append($newTab);

          

            $tabs.tabs( "refresh" );
            $tabs.tabs( 'select', $tabs.tabs('length') - 1);

            tabCounter++;


            
            //$('#CSV')
            
            //animation
            $(this).addClass("bounceOutDown animated");
            setTimeout(function(){
                $('#breadcrumbs').find('.animated').removeClass("bounceOutDown").addClass("fadeInRight");
            }, 2000);

            setTimeout(function(){ $tabs.find( ".ui-tabs-nav li" ).removeClass('animated'); }, 3000);

        });


    });


  function updateTable(){
    $('table').trigger('search', []); 

    var columns = [];
    var queryEquation = ""; 

    $tabs.find('.tab').each(function(){

      if ($(this).find('input').val() != ""){

        var $selected = $(this).find('option:selected');
        var start = $selected.data("start");
        var end = $selected.data("end");

        if (columns[$(this).data('colIndex')] == undefined)
          columns[$(this).data('colIndex')] = start + $(this).find('input').val() + end;
        else
          columns[$(this).data('colIndex')] += "|" + start + $(this).find('input').val() + end;

        if (start == "")
          start = "≈";

        queryEquation+=$('.tablesorter-header-inner').eq($(this).data('colIndex')).text() + " " + start + " " + $(this).find('input').val() + end + " & ";
      }

    });

    $("#status #query").text("Your query equation: "  + queryEquation.substring(0, queryEquation.length - 2));
    $('table').trigger('search', [columns]);
  }

  $('.publish').click(function(){
    if (start){
      $('.screen').last().slideUp();
      $('.screen').first().slideDown();
      $('.lead.main').text("You are a jedi. take me home.");
    }else{

      alert("not done :(");
    }
  });

  ///EXPLAINER STUFF

  $('.explainer button').eq(0).click(function(){
    $('.lead.sub span').fadeTo("fast",.3);
    $(this).parent().fadeOut();
    $('.explainer').eq(1).fadeIn();
    $('#breadcrumbs').fadeTo("fast",1);
  });

  $('.explainer button').eq(1).click(function(){
    $(this).parent().fadeOut();
    $('.explainer').eq(3).fadeIn();
    
  });

  $('.explainer button').eq(2).click(function(){
    $(this).parent().fadeOut();
    $('.explainer').eq(6).fadeIn();
    $('.publish').fadeIn();
    $('#table').fadeTo("fast",.3);
    $('#status').fadeTo("fast",.3);
  });



});


// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
// @see http://ejohn.org/blog/javascript-micro-templating/
(function(){
  var cache = {};
 
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
 
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
 
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
 
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
 
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

//http://stackoverflow.com/questions/1403888/get-url-parameter-with-jquery
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}