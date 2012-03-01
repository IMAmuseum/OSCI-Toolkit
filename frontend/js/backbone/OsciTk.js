if (!OsciTk) {
	var OsciTk = {};
	OsciTk.notes = null;

	_.extend(OsciTk, Backbone.Events);
	
	OsciTk.init = function() {
		// get user notes for current user and section
		OsciTk.notes = new OsciTkNotes;
		OsciTk.notes.fetch();
	}
}