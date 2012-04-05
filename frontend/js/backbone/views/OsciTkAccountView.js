jQuery(function() {
	window.OsciTkAccountView = OsciTkView.extend({
		className: 'account-view',
		template: _.template($('#template-account').html()),
		initialize: function() {
			this.model = new OsciTkAccount(null, {dispatcher: this.dispatcher});
		},
		render: function() {
			this.$el.html(this.template());
		},
		events: {
			'click button.login': 'login',
			'click a.register': 'showRegistrationForm'
		},
		login: function(event) {
			console.log(event, 'login event');
			// alias this for use in ajax callbacks
			var accountView = this;
			// get user/pass from form
			var username = this.$el.find('#username').val();
			var password = this.$el.find('#password').val();
			// send login request
			$.ajax({
				url: appView.options.endpoints.OsciTkAccount,
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
		showRegistrationForm: function(event) {
			
		}
	});
});