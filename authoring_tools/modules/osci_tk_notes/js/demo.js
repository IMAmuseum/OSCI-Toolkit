jQuery(document).ready(function() {
	var $ = jQuery;
	
	// override the Store submit
	var store_submit = $('#edit-submit');
	store_submit.click(function(event) {
		event.preventDefault();
		var data = {
			'uid'			: $('#edit-uid').val(),
			'book_id'		: $('#edit-book-id').val(),
			'section_id'	: $('#edit-section-id').val(),
			'paragraph_id'	: $('#edit-paragraph-id').val(),
			'note'			: $('#edit-note').val(),
		};
		var target = $('#store-result');
		store_note(data, target);
	});
	
	// override the Retrieve submit
	var ret_submit = $('#edit-submit--2');
	ret_submit.click(function(event) {
		event.preventDefault();
		var data = {
			'uid'			: $('#edit-uid--2').val(),
			'book_id'		: $('#edit-book-id--2').val(),
			'section_id'	: $('#edit-section-id--2').val(),
			'paragraph_id'	: $('#edit-paragraph-id--2').val(),
		};
		var target = $('#ret-result');
		target.html('');
		retrieve_note(data, target);
	});
});

function store_note(data, target) {
	var $ = jQuery;
	var endpoint = Drupal.settings.basePath + 'notes/';
	
	$.post(endpoint, data, function(data) {
		if (parseInt(data) > 0) {
			target.html('Success');
		}
		else {
			target.html('Failed');
		}
	})
}

function retrieve_note(data, target) {
	var $ = jQuery;
	var endpoint = Drupal.settings.basePath + 'notes/';
	
	$.get(endpoint, data, function(data) {
		target.html(data);
	})
}