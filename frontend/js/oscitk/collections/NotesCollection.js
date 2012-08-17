OsciTk.collections.Notes = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Note,
	initialize: function() {
		app.dispatcher.on('currentNavigationItemChanged', function(navItem) {
			//TODO: Refactor once Gray cleans up the NavigationItemModel
			if (navItem.id) {
				app.collections.notes.getNotesForSection(navItem.id);
			}
		}, this);
	},
	comparator: function(note) {
		// parse out the content id number and use that for internal sorting
		return note.get('content_id').match(/.*-(\d+)/)[1];
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
			data: {section_id: sectionId},
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				if (data.success === true) {
					// notes were returned, set to the notes collection
					app.collections.notes.reset(data.notes);
					app.dispatcher.trigger('notesLoaded', app.collections.notes);
				}
			}
		});
	}
});