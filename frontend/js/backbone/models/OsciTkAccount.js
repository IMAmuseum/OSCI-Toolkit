jQuery(function() {
	window.OsciTkAccount = OsciTkModel.extend({
		defaults: {
			username: 'anonymous',
			id: 0
		},
		initialize: function() {
			// get current state
			this.getSessionState();
		},
		sync: function(method, model, options) {
			console.log(method, 'account sync');
		},
		getSessionState: function() {
			// alias this for use in success function
			var account = this;
			// ask server for session state
			$.ajax({
				url: window.appConfig.get('endpoints').OsciTkAccount,
				data: {action: 'status'},
				type: 'POST',
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						account.set(data.user);
					}
				}
			});
		}
	});
});