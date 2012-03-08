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
	OsciTk.navigation = null;
	OsciTk.figures = null;
	OsciTk.footnotes = null;
	OsciTk.dispatcher = { parent: OsciTk };
	_.extend(OsciTk.dispatcher, Backbone.Events);
		
	OsciTk.init = function(package_url) {
		
		//
		// init global collections
		//
		OsciTk.notes = new OsciTkNotes;
		OsciTk.notes.url = OsciTk.settings.endpoints.OsciTkNotes;
		OsciTk.sections = new OsciTkSections;
		OsciTk.figures = new OsciTkFigures;
		OsciTk.footnotes = new OsciTkFootnotes;
		
		//
		// Bindings
		//
		OsciTk.dispatcher.on('packageLoaded', function(package) {
			for (var i in package.get('manifest').item) {
				if (package.get('manifest').item[i].properties == 'nav') {
					this.parent.navigation = new OsciTkNavigation({
						uri: package.get('manifest').item[i].href
					}, OsciTk.dispatcher);
				}			
			}
		});
		OsciTk.dispatcher.on('navigationLoaded', function(navigation) {
			console.log(navigation, 'loaded navigation');
			// populate the sections collection
			_.each(navigation.get('toc').children, function(section) {
				this.parent.populateSections(section);
			}, this);
			
			if (navigation.get('current_section')) {
				// loading section content for first section
				this.parent.sections
					.get(navigation.get('current_section')['data-section_id'])
					.loadContent();
				// load the notes for the current section
				OsciTk.notes.fetch({section_id: navigation.get('current_section')['data-section_id']});
			}
		});
		
		//
		// initialize the package
		//
		OsciTk.package = new OsciTkPackage({url: package_url}, OsciTk.dispatcher);
	}
	
	OsciTk.populateSections = function(origSection) {
		var section = {};
		for (var i in origSection) {
			// don't include arrays or objects, only values
			if (typeof(origSection[i]) != 'object') {
				section[i] = origSection[i];
			}
		}
		section.id = section['data-section_id'];
		this.sections.create(section);
	}
}
