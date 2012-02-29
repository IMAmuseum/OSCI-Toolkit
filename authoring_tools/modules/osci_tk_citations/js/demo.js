jQuery(document).ready(function() {
	var $ = jQuery;
	
	// override the Retrieve submit
	var ret_submit = $('#edit-submit');
	ret_submit.click(function(event) {
		event.preventDefault();
		var data = {
			'book_id'		: $('#edit-book-id').val(),
			'section_id'	: $('#edit-section-id').val(),
			'paragraph_id'	: $('#edit-paragraph-id').val()
		};
		var target = $('#ret-result');
		retrieve_note(data, target);
	});
	
	
});

function retrieve_note(data, target) {
	var $ = jQuery;
	var endpoint = Drupal.settings.basePath + 'api/citations/';
	
	$.get(endpoint, data, function(data) {
		target.html(data);
	})
}