jQuery(function() {
	window.OsciTkAccountView = OsciTkView.extend({
		className: 'account-view',
		template: null,
		initialize: function() {
			this.model = window.appAccount;
		},
		render: function() {
			this.showLoginForm();
		},
		events: {
			'click button.login': 'login',
			'click a.register': 'showRegistrationForm',
			'click a.login': 'showLoginForm'
		},
		login: function(event) {
			// alias this for use in ajax callbacks
			var accountView = this;
			// get user/pass from form
			var username = this.$el.find('#username').val();
			var password = this.$el.find('#password').val();
			// send login request
			$.ajax({
				url: window.appConfig.get('endpoints').OsciTkAccount,
				data: {action: 'login', username: username, password: password},
				type: 'POST',
				dataType: 'json',
				success: function(data) {
					console.log(data, 'data');
					if (data.success === true) {
						// user was logged in, set the returned user data
						accountView.model.set(data.user);
						console.log(accountView, 'accountView');
					}
					else {
						// user was not logged in, show error
					}
				}
			});
		},
		showRegistrationForm: function() {
			this.template = _.template($('#template-account-register').html());
			this.$el.html(this.template());
		},
		showLoginForm: function() {
			this.template = _.template($('#template-account-login').html());
			this.$el.html(this.template());
		}
	});
});