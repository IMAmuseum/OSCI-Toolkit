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
	OsciTk.nav = null;
	
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
		OsciTk.sections = new OsciTkSectionCollection;
		
		// TODO: Attempt to retrieve nav from local storage
		
		if (OsciTk.nav == null) {
			
			if (OsciTk.document_url == null) return false;			
			// TODO: check if the URL points to an ePub or package document. 
			
			// Assuming it's a package URL
			OsciTk.processPackageDocument(OsciTk.document_url);			
			
		}
		
		if (OsciTk.nav != null) {
			
			// Connect event handlers
			OsciTk.nav.on('change:current_section', OsciTk.onNavigationSectionChange)
		
			// Fetch the navigation document, launcing the event sequence
			OsciTk.nav.fetch();
			
		}
		
		// TODO: Pre-load sections from local storage?
	
	}
	
	
	/**
	 * Respond when navigation occurs
	 */
	OsciTk.onNavigationSectionChange = function(model, current_section) {
		
		console.log('OsciTk.onNavigationSectionChange')
		
		// Check if the section is loaded
		var section = OsciTk.sections.get(current_section['data-section_id'])		
		if (section == undefined) {			
			section = OsciTk.sections.create({
				id: current_section['data-section_id'],
				uri: current_section.href,
			});
		}		

		// Set the section as active, should trigger view update
		
	}
	
	
	/**
	 * Loads the package document so that models can be created for components of the publication
	 * TODO: determine how this would work if an ePub document is unzipped into memory
	 */
	OsciTk.processPackageDocument = function(package_url) {

		var data = xmlToJson(loadXMLDoc(package_url));
		
		var spine = data.package.spine;
		
		if (spine.length = 0) return; // Invertabrate!

		// Find the nav document and create the Navigation model
		for (var i in data.package.manifest.item) {
			if (data.package.manifest.item[i].properties == 'nav') {
				OsciTk.nav = new OsciTkNavigation({uri: data.package.manifest.item[i].href});
			}			
		}
		
	}	
	
}
