
var index = 1;


$('.navigation').click(function(){

	if (index == 1){
		$('.facets').slideDown();
		$('.jumbotron').html('<h2>What do you think is important in a subway line?</h2>');
		$('.navigation button').text('What data do you think is important for the best subway line?');
	}else if (index == 2){
		$('.facets').slideUp();
		$('.datasets').slideDown();
		$('.jumbotron').html('<h2>What data do you think is important for the best subway line?</h2>');
		$('.navigation button').text('TABULATE!');
	}else if (index == 3){
		$('.datasets').slideUp();
		$('.tabs').slideDown();
		$('.jumbotron').html('<h2>What do you think is important in a subway line?</h2><p class="lead">Now use the drag and drop the buttons bellow to help demonstrate your proint. </p>');
		$('.navigation button').hide();
	}

	index++;
});

$( ".tabs" ).tabs({
	select: function(event, ui) {
		$(".tabs ul li").removeClass("active");
		$(".tabs ul li").eq(ui.index).addClass("active");
	}
});



$( ".btn-toolbar.draggable .btn" ).draggable({revert: true,});
$( "td" ).droppable({
    drop: function( event, ui ) {
    	$(this).parents('table').find("colgroup").eq($(this).index()).removeClass("hover");

    	$('td').first().parent().fadeTo('slow', 0.3, function() {
      // Animation complete.
    	});

    	var $This = $(this);
    	var col = $This.parent().children().index($(this));
    	var title = $This.closest("table").find("th").eq(col).text();
    	$('.breadcrumb').append('<li>'+title+'<span class="divider">/</span></li>');



    },
    over: function( event, ui ) {
    	
		var $This = $(this);
    	var col = $This.parent().children().index($(this));
    	var title = $This.closest("table").find("th").eq(col).text();
    	$(ui.draggable[0]).text(title);
    	$(this).parents('table').find("colgroup").eq($(this).index()).addClass("hover");

    },
    out: function( event, ui ) {
    	$(this).parents('table').find("colgroup").eq($(this).index()).removeClass("hover");

    }
});