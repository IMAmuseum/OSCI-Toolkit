if (!OsciTk) {
	var OsciTk = {};
	
	OsciTk.settings = {
		'endpoints': {
			'OsciTkNotes': '/api/notes/',
			'OsciTkNote': '/api/notes/',
		}
	};	

	OsciTk.notes = null;
	OsciTk.sections = null;
	
	/* 
	 * document_url can either be set to the URL of an ePub document (zip container) 
	 * or it can be set to the URL of an ePub package document
	 */
	OsciTk.document_url = null;
	
	_.extend(OsciTk, Backbone.Events);
	
	OsciTk.init = function() {
		
		// get user notes for current user and section
		OsciTk.notes = new OsciTkNotes;
		OsciTk.notes.url = OsciTk.settings.endpoints.OsciTkNotes;
		OsciTk.notes.fetch();		

		// Initilize section collection
		// OsciTk.sections = new OsciTkSectionCollection;
		// Retrieve sections from local storage
		// OsciTk.sections.fetch();
		
		if (OsciTk.sections == null) {
			
			if (OsciTk.document_url == null) return false;			
			// TODO: check if the URL points to an ePub or package document. 
			
			// Assuming it's a package URL
			OsciTk.processPackageDocument(OsciTk.document_url);			
			
		}
	
	}
	
	
	/**
	 * Loads the package document so that models can be created for components of the publication
	 * TODO: determine how this would work if an ePub document is unzipped into memory
	 */
	OsciTk.processPackageDocument = function(package_url) {

		var data = xmlToJson(loadXMLDoc(package_url));
		
		var spine = data.package.spine;
		
		if (spine.length = 0) return; // Invertabrate!
		
		var sections = new OsciTkSections(null, data.package['unique-identifier']);

		// For now, assuming that each item in the spine is a section
		for (var i=0; i<spine.itemref.length; i++) {
			
			sections.create({
				section_id: spine.itemref[i].idref
			});

		}
		
	}	
	
}
