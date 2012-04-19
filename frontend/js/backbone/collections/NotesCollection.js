// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.collections.Notes = OsciTk.collections.BaseCollection.extend({
		model: OsciTk.models.Note,
		initialize: function() {
			this.bind('change', function() {
				app.dispatcher.trigger('notesChanged');
			});
			app.dispatcher.bind('currentNavigationItemChanged', function(section) {
				var navItem = app.collections.navigationItems.getCurrentNavigationItem();
				//TODO: Refactor once Gray cleans up the NavigationItemModel
				if (navItem.get('data-section_id')) {
					app.collections.notes.getNotesForSection(navItem.get('data-section_id'));
				}
			}, this);
		},
		parse: function(response) {
			if (response.success) {
				// return response.notes;
				return response.notes;
			}
			else {
				return false;
			}
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
						app.collections.notes.reset(data.notes);
					}
				}
			});
		}
	});
});