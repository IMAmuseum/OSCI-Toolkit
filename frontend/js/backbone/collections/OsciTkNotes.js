var OsciTkNotes = Backbone.Collection.extend({
	model: OsciTkNote,
	parse: function(response) {
		if (response.success) {
			return response.notes;
		}
		else {
			return [];
		}
	}
});