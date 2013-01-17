$(function(){

  var start = false;
  var question = (getURLParameter('question')) ? getURLParameter('question') : "THIS IS A TEST";
  var description = (getURLParameter('description')) ? getURLParameter('description') : "Description";
  var dataURL = (getURLParameter('data')) ? "php/ba-simple-proxy.php?mode=native&url=" + getURLParameter('data') : "test.csv";
  var isPublishedBtnActivated = false;
  var lastUpdateColumnIndex = -1;

  if (getURLParameter('start')){
    start = true;
    question = "Are you ready?";
    description = "<h1>Welcome to QueryUs.</h1><p> Data is everywhere! QueryUS helps us make sense of this data and the relationships it has to other forms of information. By building queries, which are like mini search routines, you’ll be able to sift through data to arrive at answers we can then share with the world.</p>";
    dataURL = "test.csv";
  }


  $('.lead.main').html(description);
  $('.lead.sub span').text(question);

  //GO SCREEN
  $('.screen').first().show();
  $('.screen').first().find(".lead").css("margin-top", $(window).height()/5+ "px");


  var clicks = 0;
  $('.go button').click(function(){
    clicks++

    if (clicks == 3){
      window.location = "http://queryus.pagodabox.com/pick.html"

    }else if (start == false || clicks == 2){

      $('.screen').first().slideUp();
      $('.screen').last().slideDown();

      if (start){
        $(".explainer").first().show();
        $("button.publish").hide();
        $("#table").css('opacity',".3")
        $("#breadcrumbs").css('opacity',".status")
        $("#3").css('opacity',".3")
      }


    }else{

      $('.lead.main').text("Commercial search engines like Google, Bing, and Yahoo use functions and algorithms that give you results when you type in questions. This is useful, but sometimes the results aren’t what you wanted or are skewed towards companies that pay these search engines to display their results first! Let’s change this with QueryUs!  Are you ready to fight the power!");
      $(this).text("Start!");
      $('.lead.sub span').text("How likely are you to get eaten by a hippo?");
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
/* keeeping this hear as a starting point for stick headers
        //sticky headers
        setTimeout(function(){
          $('.tablesorter-header').each(function(){
            $(this).css('width',$(this).width() + 'px');
            setTimeout(function(){
              $('thead').first().css('position','absolute');
              //$('.tablesorter-filter-row').show();
            }, 1000);
          });
        }, 1000);
*/
        $("#status #rows").text("There are " + ( $("table").find("tr").not(".filtered").length - 2)+" rows left in the table.");

        //enable sort functionality 
        $('#CSVTable').find('TABLE')
          .tablesorter({widgets: ["zebra", "filter"]})
          .bind('filterEnd', function(){ 
            

            $("#status #rows").text("There are " + ( $("table").find("tr").not(".filtered").length - 2)+" rows left in the table.");
            generateAggregate();
           
            

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
            
            var $newTab = $(tmpl(dataType, {"tabCounter": tabCounter, "title": $(this).text().toLowerCase(),"column": $(this).parent().index() })).data('colIndex', $(this).parent().index());

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

              if(isPublishedBtnActivated == false){
                $('.publish').show();
                isPublishedBtnActivated = true;
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

            generateAggregate();
            
            //$('#CSV')
            
            //animation
            $(this).addClass("bounceOutDown animated");
            setTimeout(function(){
                $('#breadcrumbs').find('.animated').removeClass("bounceOutDown").addClass("fadeInRight");
            }, 2000);

            setTimeout(function(){ $tabs.find( ".ui-tabs-nav li" ).removeClass('animated'); }, 3000);

        });


    });

  function generateAggregate(){
     //generate aggrate data
    var columns = $('#CSVTable table').data().tablesorter.parsers;
    for (var i = 0; i < columns.length; i++) {
      columnsType = columns[i].type;
      
      var data = [];


      $('tr').not('.tablesorter-headerRow').not('.tablesorter-filter-row').not('.filtered').each(function(){
        if (isNaN($(this).find('td').eq(i).text()))
          data.push($(this).find('td').eq(i).text())
        else
          data.push(parseFloat($(this).find('td').eq(i).text()));
      });

      data.sort();

      var ouput = '';

      if (columnsType == "numeric"){
        ouput += '<li> <p>lowest value:</p><p> ' + data[data.length - 1]  + "</p></li>";
        ouput += '<li> <p>highest value:</p><p> ' +  data[0] + "</p></li>";
        ouput += '<li> <p>mean:</p><p> ' +  mean(data) + "</p></li>";
        ouput += '<li> <p>median:</p><p> ' +  median(data) + "</p></li>";
        ouput += '<li> <p>mode:</p><p> ' +  mode(data) + "</p></li>";

        $('.column'+i+'.tab .panel ul').html(ouput);

      }else{

        
        ouput += '<li> <p>highest occurence:</p><p> ' +  mode(data) + "</p></li>";

       $('.column'+i+'.tab .panel ul').html(ouput);
      }
    }
  }


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
          columns[$(this).data('colIndex')] = $(this).data('colIndex') + "|" + start + $(this).find('input').val() + end;

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
      $('.lead.main').text("You are a jedi. Now others can see the query you built and published.");
      $('.go button').text("Take me to the questions...")
    }else{

      $('.screen').hide();
      $('.publishfinal').show();

      var output = "";
      $('.tab .selector p').each(function(){
        output += "<p>I want " + ($(this).find('span').text() + "<strong>" + $(this).find("option:selected").text() + " " + $(this).find('input').val() + " </strong>.<p>" );
      });



      $('.publishfinal .parameters').html(output)

      $('table').clone().appendTo('.publishfinal .tablefinal');

       $('.publishfinal').append('<p>I think this because: <textarea></textarea><button class="btn btn-large btn-primary saveshare" type="button">SAVE & SHARE</button> ')

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

//some random number functions, not written by me. 
function mean(numbers) {
    // mean of [3, 5, 4, 4, 1, 1, 2, 3] is 2.875
    var total = 0,
        i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
}
function median(numbers) {
    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    var median = 0,
        numsLen = numbers.length;
    numbers.sort();
    if (numsLen % 2 === 0) { // is even
        // average of two middle numbers
        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else { // is odd
        // middle number only
        median = numbers[(numsLen - 1) / 2];
    }
    return median;
}
function mode(array)
{
    if(array.length == 0)
      return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
      var el = array[i];
      if(modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;  
      if(modeMap[el] > maxCount)
      {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
}
function range(numbers) {
    // range of [3, 5, 4, 4, 1, 1, 2, 3] is [1, 5]
    numbers.sort();
    return [numbers[0], numbers[numbers.length - 1]];
}