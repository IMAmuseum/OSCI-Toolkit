if (!OsciTk) {
	var OsciTk = {};
	OsciTk.settings = {
		'endpoints': {
			'OsciTkNotes': '/api/notes/'
		}
	};
	OsciTk.notes = null;
	_.extend(OsciTk, Backbone.Events);
	
	OsciTk.init = function() {
		// get user notes for current user and section
		OsciTk.notes = new OsciTkNotes;
		OsciTk.notes.url = OsciTk.settings.endpoints.OsciTkNotes;
		OsciTk.notes.fetch();
	}
}