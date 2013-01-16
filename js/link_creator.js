$(function(){

  var baseURI = window.location.origin;

	$('#dataset-submit').click(concatenateAndEncodeFields);
	
	function concatenateAndEncodeFields() {
	  var dataset = $('#dataset-input')
		, question = $('#question-input')
		, description = $('#description-input')
		, isCSVLocationValid = /^https*.+\.csv$/
		                       .test($('#dataset-input')
		                       .val())
		, concatenatedLink = baseURI
		                     + "/?data=" + dataset.val()
		                     + "&question=" + question.val()
		                     + "&description=" + description.val()
		;
    
    if (isCSVLocationValid) {
      $('#dataset-link').html("")
      $('#dataset-error').html("")
      $('<a>', {
        text: question.val() || "Your Untitled Dataset",
        title: question.val(),
        href: encodeURI(concatenatedLink)
      }).appendTo('#dataset-link');
    } else {
      $('#dataset-error').html("Your CSV Location must point to a CSV file on the web.")
      return;
    }	
	}

});