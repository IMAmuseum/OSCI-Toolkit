jQuery(function() {
	if (!window.OsciTk) {
		window.OsciTk = {};

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
			
			// create a reader
			OsciTk.readerView = new OsciTkReaderView;
			//OsciTk.toolbar = new OsciTkToolbar();
			
			//
			// Bindings
			//
			OsciTk.dispatcher.on('packageLoaded', function(package) {
				console.log(package, 'packageLoaded');
				for (var i in package.get('manifest').item) {
					if (package.get('manifest').item[i].properties == 'nav') {
						this.parent.navigation = new OsciTkNavigation({
							uri: package.get('manifest').item[i].href
						}, {dispatcher: this});
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
			
			OsciTk.dispatcher.on('footnotesAvailable', function(data) {
				console.log(data, 'footnotesAvailable');
				// parse the footnotes
				_.each($('aside', data), function(markup) {
					var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
					var footnote = {
						id:         markup.id,
						rawData:    markup,
						body:       markup.innerHTML,
						section_id: idComponents[1],
						delta:      idComponents[2]
					};
					this.parent.footnotes.create(footnote, {dispatcher: this})
				}, this);
			});
			
			OsciTk.dispatcher.on('figuresAvailable', function(data) {
				console.log(data, 'figuresAvailable');
				_.each($('figure', data), function(markup) {
					console.log(markup);
					var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
					var figure = {
						id:         markup.id,
						rawData:    markup,
						body:       markup.innerHTML,
						section_id: idComponents[1],
						delta:      idComponents[2],
						title:      $(markup).attr('title'),
						caption:    $('figcaption', markup).html(),
						position:   $(markup).attr('data-position'),
						columns:    $(markup).attr('data-columns'),
						options:    JSON.parse($(markup).attr('data-options'))
					};
					this.parent.figures.create(figure, {dispatcher: this})
				}, this);
			});
			
			//
			// initialize the package
			//
			OsciTk.package = new OsciTkPackage({url: package_url}, {dispatcher: OsciTk.dispatcher});
			
			// Route the URL - should this come prior to initializing the package?
			// Backbone.history.start();
		};
		
		OsciTk.populateSections = function(origSection) {
			var section = {};
			for (var i in origSection) {
				// don't include arrays or objects, only values
				if (typeof(origSection[i]) != 'object') {
					section[i] = origSection[i];
				}
			}
			section.id = section['data-section_id'];
			
			this.sections.create(section, {dispatcher: this.dispatcher});
		};
	}
});