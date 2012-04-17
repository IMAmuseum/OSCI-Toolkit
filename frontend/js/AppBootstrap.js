app = {
	dispatcher : undefined,
	router : undefined,
	config : undefined,
	account : undefined,
	views : {},
	models : {},
	collections : {},

	bootstrap : function(config)
	{
		this.config = new OsciTk.models.Config(config);
		this.dispatcher = _.extend({}, Backbone.Events);
		this.account = new OsciTk.models.Account(null);
		this.router = new OsciTk.router();
		this.views.app = new OsciTk.views.App();
	},

	run : function()
	{
		Backbone.history.start();
	}
};