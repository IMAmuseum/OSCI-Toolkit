jQuery(document).ready(function() {
	var $ = jQuery;
	
	// override the Login submit
	var login_submit = $('#edit-submit');
	login_submit.click(function(event) {
		event.preventDefault();
		var data = {
			'action'		: 'login',
			'username'		: $('#edit-username').val(),
			'password'		: $('#edit-password').val()
		};
		var target = $('#login-result');
		user_request(data, target);
	});
	
	// override the Register submit
	var register_submit = $('#edit-submit--2');
	register_submit.click(function(event) {
		event.preventDefault();
		var data = {
			'action'		: 'register',
			'username'		: $('#edit-username--2').val(),
			'password'		: $('#edit-password--2').val(),
			'email'			: $('#edit-email').val()
		};
		var target = $('#register-result');
		user_request(data, target);
	});
	
	
});

function user_request(data, target) {
	var $ = jQuery;
	var endpoint = Drupal.settings.basePath + 'api/users/';
	
	$.post(endpoint, data, function(data) {
		target.html(data);
	})
}