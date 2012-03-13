jQuery(function() {
	window.OsciTkNotes = Backbone.Collection.extend({
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