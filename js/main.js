
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


/*
$( ".btn" ).draggable({revert: true});
$( "td" ).droppable({
    drop: function( event, ui ) {
    	$("colgroup").eq($(this).index()).removeClass("hover");
    },
    over: function( event, ui ) {
    	$("colgroup").eq($(this).index()).addClass("hover");
    },
    out: function( event, ui ) {
    	$("colgroup").eq($(this).index()).removeClass("hover");
    }
});*/