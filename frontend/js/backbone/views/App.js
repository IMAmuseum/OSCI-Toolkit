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
			
			// init user and fetch session
			// this.account = new OsciTkAccount(null, {dispatcher: this.dispatcher});

			//
			// init global collections
			//
			this.notes = new OsciTk.collections.Notes(null, {dispatcher: this.dispatcher});
			this.notes.url = window.appConfig.get('endpoints').OsciTkNotes;
			this.sections = new OsciTk.collections.Sections(null, {dispatcher: this.dispatcher});
			this.figures = new OsciTk.collections.Figures(null, {dispatcher: this.dispatcher});
			this.footnotes = new OsciTk.collections.Footnotes(null, {dispatcher: this.dispatcher});
			
			// Add the toolbar to the appView
			this.toolbarView = new OsciTk.views.Toolbar(this.options);
			this.addView(this.toolbarView);

			//set the default section view
			var sectionViewClass = OsciTk.views.Section;

			//allow a custom section view to be used
			if (window.appConfig.get('section_view'))
			{
				sectionViewClass = window.appConfig.get('section_view');
			}
			this.sectionView = new sectionViewClass(this.options);
			this.addView(this.sectionView);

			// Add the navigation view to the AppView
			this.navigationView = new OsciTk.views.Navigation(this.options);
			this.addView(this.navigationView);
			
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
			})(this.dispatcher);
			
			// bind packageLoaded to build navigation model
			//move this to the navigation view
			this.dispatcher.on('packageLoaded', function(packageModel) {
				console.log(packageModel, 'packageLoaded');
				var nav = _.find(packageModel.get('manifest').item,
					function(item){
						return item.properties == 'nav';
					}
				);

				if (nav)
				{
					this.navigation = new OsciTk.models.Navigation({
						uri: nav.href
					}, {dispatcher: this.dispatcher});
				}
			}, this);
			
			// load package document
			this.docPackage = new OsciTk.models.Package({url: window.appConfig.get('package_url')}, {dispatcher: this.dispatcher});
			
		},
		
		render: function() {
			this.$el.html(this.template());
		}
	});
});