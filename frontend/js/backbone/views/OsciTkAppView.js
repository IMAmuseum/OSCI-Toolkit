jQuery(function() {
	window.OsciTkAppView = OsciTkView.extend({
		id: 'reader',
		template: _.template($('#template-app').html()),
		
		initialize: function() {
			$('body').append(this.el);
			console.log(this.options.package_url, 'appview url');
			
			// draw main interface
			this.render();
			
			//
			// init global collections
			//
			this.notes = new OsciTkNotes(null, {dispatcher: this.dispatcher});
			this.notes.url = this.options.endpoints.OsciTkNotes;
			this.sections = new OsciTkSections(null, {dispatcher: this.dispatcher});
			this.figures = new OsciTkFigures(null, {dispatcher: this.dispatcher});
			this.footnotes = new OsciTkFootnotes(null, {dispatcher: this.dispatcher});
			
			// Add the toolbar to the appView
			this.toolbarView = new OsciTkToolbarView(this.options);
			this.addView(this.toolbarView);

			//set the default section view
			var sectionViewClass = OsciTkSectionView;

			//allow a custom section view to be used
			if (this.options.section_view)
			{
				sectionViewClass = this.options.section_view;
			}
			this.sectionView = new sectionViewClass(this.options);
			this.addView(this.sectionView);

			// Add the navigation view to the AppView
			this.navigationView = new OsciTkNavigationView(this.options);
			this.addView(this.navigationView);
			
			// bind packageLoaded to build navigation model
			this.dispatcher.on('packageLoaded', function(packageModel) {
				console.log(packageModel, 'packageLoaded');
				var nav = _.find(packageModel.get('manifest').item,
					function(item){
						return item.properties == 'nav';
					}
				);

				if (nav)
				{
					this.navigation = new OsciTkNavigation({
						uri: nav.href
					}, {dispatcher: this.dispatcher});
						
					this.navigation.on('change:current_section', function() {
						this.dispatcher.trigger('sectionChanged');
					});
				}
			}, this);
			
			// bind routedToRoot
			this.dispatcher.on('routedToRoot', function() {
				this.navigation.goToBeginning();
			}, this);
			
			// bind routedToSection
			this.dispatcher.on('routedToSection', function(id) {
				this.navigation.goToSection(id);
			}, this);

			
			// load package document
			this.docPackage = new OsciTkPackage({url: this.options.package_url}, {dispatcher: this.dispatcher});
			
		},
		
		render: function() {
			this.$el.html(this.template());
		}
	});
});