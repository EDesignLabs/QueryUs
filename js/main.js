$(function(){

    var $tabs = $('#tabs');
    var tabCounter = 0;

    var categories = [{name:"test1",type:"numeric"} , {name:"testd",type:"numeric"} , {name:"facatt",type:"numeric"} , {name:"rum",type:"string"} ];

    for (var i = 0; i < categories.length; i++) 
         $('#breadcrumbs').append( '<li class = "breadcrumb"><a>'+categories[i].name+'</a></li>' );


    $tabs.tabs();

    $tabs.addClass('ui-state-hover');

    $tabs.find( ".ui-tabs-nav" ).sortable({
        axis: "y",
        stop: function() {
            $tabs.tabs( "refresh" );
        }
    });

    $('#CSVTable').CSVToTable('test.csv').bind("loadComplete",function() { 
        $('#CSVTable').find('TABLE').tablesorter();
    });


    $( ".breadcrumb a" ).click(function() {
        $tabs.find( ".ui-tabs-nav" ).append( "<li class = 'bounceIn animated' ><a href='#tab-"+tabCounter+"'>tres"+tabCounter+"</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>");
        $tabs.append( "<div class = 'tab' id='tab-"+tabCounter+"'><p>" + 'tabContentHtml' + tabCounter + "</p></div>" );
        $tabs.tabs( "refresh" );
        $tabs.tabs( 'select', $tabs.tabs('length') - 1);
        tabCounter++;
        $(this).addClass("bounceOutDown animated");
        setTimeout(function(){
            $('#breadcrumbs').find('.animated').removeClass("bounceOutDown").addClass("fadeInUp");
        }, 2000);

        setTimeout(function(){ $tabs.find( ".ui-tabs-nav li" ).removeClass('animated'); }, 3000);

    });



});

