// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.App = OsciTk.views.BaseView.extend({
		id: 'reader',
		template: _.template($('#template-app').html()),
		
		initialize: function() {
			$('body').append(this.el);
			console.log(app.config.get('package_url'), 'appview url');
			
			// draw main interface
			this.render();
			
			// Add the toolbar to the appView
			app.views.toolbarView = new OsciTk.views.Toolbar(this.options);
			this.addView(app.views.toolbarView);

			//set the default section view
			var sectionViewClass = OsciTk.views.Section;

			//allow a custom section view to be used
			if (app.config.get('section_view'))
			{
				sectionViewClass = app.config.get('section_view');
			}
			app.views.sectionView = new sectionViewClass(this.options);
			this.addView(app.views.sectionView);

			// Add the navigation view to the AppView
			app.views.navigationView = new OsciTk.views.Navigation(this.options);
			this.addView(app.views.navigationView);
			
			//setup window resizing, to trigger an event
			window.onresize = (function(dispatcher){
				return function() {
					if (window.resizeTimer) {
						clearTimeout(window.resizeTimer);
					}

					var onWindowResize = function(){
						dispatcher.trigger("windowResized");
					};

					window.resizeTimer = setTimeout(onWindowResize, 100);
				};
			})(app.dispatcher);
		},
		
		render: function() {
			this.$el.html(this.template());
		}
	});
});