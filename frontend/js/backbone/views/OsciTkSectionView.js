jQuery(function() {
	window.OsciTkSectionView = OsciTkView.extend({
		id: 'section',
		template: _.template($('#template-section').html()),
		initialize: function() {
			// bind navigationLoaded
			this.dispatcher.on('navigationLoaded', function(navigation) {
				console.log(navigation, 'loaded navigation');
				// populate the sections collection
				_.each(navigation.get('toc').children, function(section) {
					this.populateSections(section);
				}, this);
				// initialization complete, router takes back over
			}, this);

			// bind sectionChanged
			this.dispatcher.on('sectionChanged', function() {
				console.log('section changed');
				if (this.parent.navigation.get('current_section')) {
					// loading section content for first section
					var section = this.parent.sections.get(
						this.parent.navigation.get('current_section')['data-section_id']
					);
					section.loadContent();
					this.changeModel(section);
					this.render();
				}
			}, this);
		},
		render: function() {
			this.renderContent();

			//TODO: add paging information to this event
			this.dispatcher.trigger("layoutComplete");
		},
		renderContent: function()
		{
			this.$el.html(this.template(this.model.toJSON()));
		},
		populateSections: function(origSection) {
			var section = {};
			for (var i in origSection) {
				// don't include arrays or objects, only values
				if (typeof(origSection[i]) != 'object') {
					section[i] = origSection[i];
				}
			}
			section.id = section['data-section_id'];
			
			this.parent.sections.create(section, {dispatcher: this.dispatcher});

			_.each(origSection.children, function(section) {
				this.populateSections(section);
			}, this);

		}
	});
});