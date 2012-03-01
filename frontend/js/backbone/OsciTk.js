if (!OsciTk) {
	var OsciTk = {};
	var OsciTk.notes = null;

	_.extend(OsciTk, Backbone.Events);
	
	OsciTk.init = function() {
		// get user notes for current user and section
		OsciTk.notes = new OsciTkNotes;
		OsciTkNotes.fetch();
	}
}