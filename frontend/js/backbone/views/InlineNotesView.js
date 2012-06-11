// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.InlineNotes = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('note-popup'),
	tempNotes: [],
	initialize: function() {
		var $this = this;
		
		app.dispatcher.on('pageChanged', function(pageChanged) {
			// get the current page
			var page = app.views.sectionView.childViews[pageChanged.page - 1];
			
			// bind to the click action on that page's element.
			page.$el.bind('click', function(event){
				// check that the target has a data-osci_content_id attribute
				var contentId = $(event.target).attr('data-osci_content_id');
				if (contentId) {
					// find the note content if pre-existing
					var note;
					var notes = app.collections.notes.where({content_id: contentId});
					if (notes[0]) {
						note = notes[0];
					}
					else {
						note = new OsciTk.models.Note({
							content_id: contentId,
							section_id: app.models.section.id
						});
						app.collections.notes.add(note);
					}
					console.log(note, 'note');
					// fire the tooltip, note the preset of position.  Some paragraphs are 
					// continuations, so place their tooltips below the paragraph
					var myPosition = 'bottom left';
					var atPosition = 'top left';
					var marginTop = parseInt($(event.target).css('margin-top'));
					if (marginTop < 0) {
						myPosition = 'top left';
						atPosition = 'bottom left';
					}
					$(event.target).qtip("destroy");
					$(event.target).qtip({
						id: note.cid,
						content: {
							title: {
								text: "Notes"
							},
							text: $this.template(note.toJSON())
						},
						show: {
							ready: true,
							event: ''
						},
						hide: {
							event: 'unfocus',
							fixed: true
						},
						position: {
							my: myPosition,
							at: atPosition,
							target: $(event.target)
						},
						style: {
							classes: 'note-tooltip'
						},
						events: {
							render: function(event, api) {
								// bind to keyup on text area to sync changes to back end
								api.elements.content.find('.noteForm textarea').bind('keyup', function(e) {
									// save the content to the model in case the note disappears (user clicks off)
									var cid = api.elements.tooltip.attr('id').match(/c\d+/)[0];
									// search the collection for this cid
									var note = app.collections.notes.getByCid(cid);
									note.set('note', e.target.value);
									// clear the previous timer if there is one
									if (typeof($this['saveTimeout'+cid]) !== 'undefined') {
										clearTimeout($this['saveTimeout'+cid]);
										delete($this['saveTimeout'+cid]);
									}
									// set timer to save the note
									$this['saveTimeout'+cid] = window.setTimeout(function() {
										note.save();
									}, 1500);
								});
							}
						}
					});
				}
			});
		});
		
		// place icon next to paragraphs with notes after layout is complete
		app.dispatcher.bind('notesLoaded', function(params) {
			_.each(app.views.sectionView.$el.find('p'), function(p) {
				_.each(app.collections.notes.models, function(n) {
					if (p.id == n.get('content_id')) {
						// place a class on the paragraph identifier to indicate a note is present
						var paraControl = app.views.sectionView.$el
							.find('.paragraph-controls[data-osci_content_id="' + n.get('content_id') + '"]');
						paraControl.addClass('notes-present');
					}
				});
			});
		});
	}
});