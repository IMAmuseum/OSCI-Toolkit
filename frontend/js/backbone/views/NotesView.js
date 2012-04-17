// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Notes = OsciTk.views.BaseView.extend({
		className: 'notes-view',
		template: _.template($('#template-notes').html()),
		initialize: function() {
			
			
		},
		render: function() {
			console.log(app, 'app');

			if (app.models.navigation.get('current_section')) {
				var sectionId = app.models.navigation.get('current_section')['data-section_id'];
				if (sectionId) {
					this.getNotesForSection(sectionId);
				}
				
			}
			this.$el.html(this.template());
		},
		getNotesForSection: function(sectionId) {
			// make an api call to get the notes for the current user and section
			$.ajax({
				url: app.config.get('endpoints').OsciTkNotes,
				data: {section_id: 18},
				type: 'GET',
				dataType: 'json',
				success: function(data) {
					if (data.success === true) {
						// notes were returned, set to the notes collection
						_.each(data.notes, function(note) {
							app.collections.notes.add(note);
						});
					}
				}
			});
		}
	});
});