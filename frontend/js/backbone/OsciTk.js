if (!OsciTk) {
	var OsciTk = {};
	
	OsciTk.settings = {
		'endpoints': {
			'OsciTkNotes': '/api/notes/'
		}
	};	

	var OsciTk.notes = null;
	var OsciTk.sections = null;
	
	/* 
	 * document_url can either be set to the URL of an ePub document (zipped container) 
	 * or it can be set to the URL of an ePub package document
	 */
	var OsciTk.document_url = null;
	
	_.extend(OsciTk, Backbone.Events);
	
	OsciTk.init = function() {
		// get user notes for current user and section
		OsciTk.notes = new OsciTkNotes;
		OsciTk.notes.url = OsciTk.settings.endpoints.OsciTkNotes;
		OsciTk.notes.fetch();		

		OsciTkNotes.fetch();
		
		// Initilize section collection
		// OsciTk.sections = new OsciTkSectionCollection;
		// Retrieve sections from local storage
		// OsciTk.sections.fetch();
		
		if (OsciTk.sections != null) {
			
			// TODO: check if the URL points to an ePub or package document. 
			
			// Assuming it's a package URL
			var package_doc = OsciTk.loadPackageDocument(OsciTk.document_url);
			
			
		}
	
	}
	
	
	/**
	 * Loads the package document so that models can be created for components of the publication
	 * TODO: determine how this would work if an ePub document is unzipped into memory
	 */
	OsciTk.loadPackageDocument(package_url) {
		
		
		
		
	}
	
	
}
