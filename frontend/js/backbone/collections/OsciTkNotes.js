jQuery(function() {
	window.OsciTkNotes = OsciTkCollection.extend({
		model: OsciTkNote,
		parse: function(response) {
			if (response.success) {
				// return response.notes;
				return response.notes;
			}
			else {
				return false;
			}
		}
	});
});