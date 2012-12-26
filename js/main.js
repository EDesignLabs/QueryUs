$(function(){

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

    $('#CSVTable').CSVToTable('test.csv').bind("loadComplete",function() { 

        //enable sort functionality 
        $('#CSVTable').find('TABLE').tablesorter();

        //add breacrumbs
        $('#CSVTable thead tr th').each(function(index, ele){
            $('#breadcrumbs').append( '<li class = "breadcrumb animated flipInY"><a>'+$(ele).text()+'</a></li>' );
        });

        $( ".breadcrumb a" ).click(function() {
            
            //tab creation
            $tabs.find( ".ui-tabs-nav" ).append( "<li class = 'bounceIn animated' ><a href='#tab-"+tabCounter+"'>"+$(this).text()+"</a> <span class='ui-icon ui-icon-close'>Remove Tab</span></li>");
            $tabs.append( "<div class = 'tab' id='tab-"+tabCounter+"'><p>" + 'tabContentHtml' + tabCounter + "</p></div>" );
            $tabs.tabs( "refresh" );
            $tabs.tabs( 'select', $tabs.tabs('length') - 1);

            console.log($('#CSVTable table').data().tablesorter.parsers[$(this).parent().index()]);
            //$('#CSV')
            
            //animation
            $(this).addClass("bounceOutDown animated");
            setTimeout(function(){
                $('#breadcrumbs').find('.animated').removeClass("bounceOutDown").addClass("fadeInRight");
            }, 2000);

            setTimeout(function(){ $tabs.find( ".ui-tabs-nav li" ).removeClass('animated'); }, 3000);

        });


    });






});

