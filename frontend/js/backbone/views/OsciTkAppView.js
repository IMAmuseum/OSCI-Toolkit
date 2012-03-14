jQuery(function() {
	window.OsciTkAppView = OsciTkView.extend({
		id: 'reader',
		template: _.template($('#template-app').html()),
		
		initialize: function(options) {
			$('body').append(this.el);
			console.log(options.package_url, 'appview url');
			
			// draw main interface
			this.render();
			
			//
			// init global collections
			//
			this.notes = new OsciTkNotes;
			this.notes.url = options.endpoints.OsciTkNotes;
			this.sections = new OsciTkSections;
			this.figures = new OsciTkFigures;
			this.footnotes = new OsciTkFootnotes;
			
			// create a reader view and add components
			this.toolbarView = new OsciTkToolbarView(options);
			this.sectionView = new OsciTkSectionView(options);
			this.navigationView = new OsciTkNavigationView(options);
			this.addView(this.toolbarView);
			this.addView(this.sectionView);
			this.addView(this.navigationView);
			
			// bind packageLoaded to build navigation model
			this.dispatcher.on('packageLoaded', function(packageModel) {
				console.log(packageModel, 'packageLoaded');
				for (var i in packageModel.get('manifest').item) {
					if (packageModel.get('manifest').item[i].properties == 'nav') {
						
						this.navigation = new OsciTkNavigation({
							uri: packageModel.get('manifest').item[i].href
						}, {dispatcher: this.dispatcher});
						
						this.navigation.on('change:current_section', function() {
							this.dispatcher.trigger('sectionChanged');
						});
						break; // There can be only one... navigation document
					}			
				}
			}, this);
			
			// bind routedToRoot
			this.dispatcher.on('routedToRoot', function() {
				this.navigation.goToBeginning();
			}, this);
			
			// bind routedToSection
			this.dispatcher.on('routedToSection', function(id) {
				this.navigation.set('current_section', id)
			}, this);

			
			// load package document
			this.docPackage = new OsciTkPackage({url: options.package_url}, {dispatcher: this.dispatcher});
			
		},
		
		render: function() {
			this.$el.html(this.template());
		}
	});
});