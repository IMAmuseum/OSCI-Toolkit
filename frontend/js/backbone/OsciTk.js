if (!OsciTk) {
	var OsciTk = {};

	OsciTk.settings = {
		'endpoints': {
			'OsciTkNotes': '/api/notes/',
			'OsciTkNote': '/api/notes/'
		}
	};	

	
	OsciTk.notes = null;
	OsciTk.sections = null;
	OsciTk.nav = null;
	OsciTk.figures = null;
	OsciTk.footnotes = null;

	OsciTk.dispatcher = {};
	_.extend(OsciTk.dispatcher, Backbone.Events);
		
	OsciTk.init = function(package_url) {
		
		// init global collections
		OsciTk.notes = new OsciTkNotes;
		OsciTk.sections = new OsciTkSections;
		OsciTk.figures = new OsciTkFigures;
		OsciTk.footnotes = new OsciTkFootnotes;
		
		
		// bindings
		OsciTk.dispatcher.on('packageLoaded', function(package) {
			for (var i in package.get('manifest').item) {
				if (package.get('manifest').item[i].properties == 'nav') {
					OsciTk.navigation = new OsciTkNavigation({
						uri: package.get('manifest').item[i].href
					}, OsciTk.dispatcher);
				}			
			}
		});
		OsciTk.dispatcher.on('navigationLoaded', function(navigation) {
			console.log(navigation, 'loaded navigation');
		});
		
		
		// initialize the package
		OsciTk.package = new OsciTkPackage({url: package_url}, OsciTk.dispatcher);

		
		
//		// TODO: Attempt to retrieve nav from local storage
//		
//		if (OsciTk.nav == null) {
//			
//			if (OsciTk.document_url == null) return false;			
//			// TODO: check if the URL points to an ePub or package document. 
//			
//			// Assuming it's a package URL
//			OsciTk.processPackageDocument(OsciTk.document_url);			
//			
//		}
//		
//		if (OsciTk.nav != null) {
//			
//			// Connect event handlers
//			OsciTk.nav.on('change:current_section', OsciTk.onNavigationSectionChanged)
//		
//			// Fetch the navigation document, launching the event sequence
//			OsciTk.nav.fetch();
//			
//		}
//		
//		// initalize notes based on section
//		OsciTk.notes = new OsciTkNotes;
//		OsciTk.notes.url = OsciTk.settings.endpoints.OsciTkNotes;
//		OsciTk.notes.fetch({
//			data: {
//				section_id: OsciTk.nav.get('current_section')['data-section_id']
//			}
//		});
//		
//		// initialize footnotes based on section
//		OsciTk.footnotes = new OsciTkFootnotes();
//		// TODO: Pre-load sections from local storage?
//		
//	}
//	
//	
//	/**
//	 * Respond when navigation occurs
//	 */
//	OsciTk.onNavigationSectionChanged = function(model, current_section) {
//		
//		console.log('OsciTk.onNavigationSectionChange')
//		
//		// Check if the section is loaded
//		var section = OsciTk.sections.get(current_section['data-section_id'])		
//		if (section == undefined) {			
//			section = OsciTk.sections.create({
//				id: current_section['data-section_id'],
//				uri: current_section.href,
//			}, { 
//				figure_collection: OsciTk.figures,
//				footnote_collection: OsciTk.footnotes
//			});
//		}		
//
//		// Set the section as active, should trigger view update
//		
//	}
//	
//	
//	/**
//	 * Loads the package document so that models can be created for components of the publication
//	 * TODO: determine how this would work if an ePub document is unzipped into memory
//	 */
//	OsciTk.processPackageDocument = function(package_url) {
//
//		var data = xmlToJson(loadXMLDoc(package_url));
//		console.log(data, 'processPackageDocument');
//		var spine = data.package.spine;
//		
//		if (spine.length = 0) return; // Invertabrate!
//
//		// Find the nav document and create the Navigation model
//		for (var i in data.package.manifest.item) {
//			if (data.package.manifest.item[i].properties == 'nav') {
//				OsciTk.nav = new OsciTkNavigation({uri: data.package.manifest.item[i].href});
//			}			
//		}
//		
	}	
	
}
