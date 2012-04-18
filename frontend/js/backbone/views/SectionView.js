// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Section = OsciTk.views.BaseView.extend({
		id: 'section',
		template: _.template($('#template-section').html()),
		initialize: function() {
			// bind navigationLoaded
			app.dispatcher.on('navigationLoaded', function(navigation) {
				console.log(navigation, 'loaded navigation');
				// populate the sections collection
				_.each(navigation.get('toc').children, function(section) {
					this.populateSections(section);
				}, this);
				// initialization complete, router takes back over
			}, this);

			// bind sectionChanged
			app.dispatcher.on('sectionChanged', function() {
				console.log('section changed');
				if (app.models.navigation.get('current_section')) {
					// loading section content for first section
					var section = app.collections.sections.get(
						app.models.navigation.get('current_section')['data-section_id']
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
			app.dispatcher.trigger("layoutComplete");
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
			
			app.collections.sections.add(section);

			_.each(origSection.children, function(section) {
				this.populateSections(section);
			}, this);

		}
	});
});