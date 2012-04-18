app = {
	dispatcher : undefined,
	router : undefined,
	config : undefined,
	views : {},
	models : {},
	collections : {},

	bootstrap : function(config)
	{
		this.dispatcher = _.extend({}, Backbone.Events);
		this.config = new OsciTk.models.Config(config);
		this.router = new OsciTk.router();
		this.account = new OsciTk.models.Account();
		this.collections.notes = new OsciTk.collections.Notes();
		this.collections.sections = new OsciTk.collections.Sections();
		this.collections.figures = new OsciTk.collections.Figures();
		this.collections.footnotes = new OsciTk.collections.Footnotes();
		
		// Create figures when the data becomes available
		this.dispatcher.on('figuresAvailable', function(figure_data) {
			console.log('adding figures');
			_.each(figure_data, function(figure_body) { 
				app.collections.figures.create({body: figure_body})
			});

		});

		//setup window resizing, to trigger an event
		window.onresize = function()
		{
			if (window.resizeTimer) {
				clearTimeout(window.resizeTimer);
			}

			var onWindowResize = function(){
				app.dispatcher.trigger("windowResized");
			};

			window.resizeTimer = setTimeout(onWindowResize, 100);
		};
		
		// init main view
		this.views.app = new OsciTk.views.App();
		// load package document
		this.models.docPackage = new OsciTk.models.Package({url: this.config.get('packageUrl')});
	},

	run : function()
	{
		Backbone.history.start();
	}
};
