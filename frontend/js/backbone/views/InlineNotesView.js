// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.InlineNotes = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('note-popup'),
	initialize: function() {
		
		app.dispatcher.on('toggleNoteDialog', function(data) {
			var $this = this;
			var contentId = data.content.data('osci_content_id');
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
				// fire the tooltip, note the preset of position.  Some paragraphs are
				// continuations, so place their tooltips below the paragraph
				// var myPosition = 'bottom left';
				// var atPosition = 'top left';
				// var marginTop = parseInt(data.content.css('margin-top'), 10);
				// if (marginTop < 0) {
				// 	myPosition = 'top left';
				// 	atPosition = 'bottom left';
				// }
				var noteJson = note.toJSON();
				noteJson.referenceContent = data.content.text();

				data.content.qtip("destroy");
				data.content.qtip({
					id: note.cid,
					content: {
						title: {
							text: "Notes",
							button: "Close"
						},
						text: $this.template(noteJson)
					},
					show: {
						ready: true,
						event: '',
						modal: {
							on:true,
							dim: false
						}
					},
					hide: {
						event: 'unfocus',
						fixed: true
					},
					position: {
						// my: myPosition,
						// at: atPosition,
						// target: data.content
						my: 'center',
						at: 'center',
						target: $(document.body)
					},
					style: {
						classes: 'note-tooltip',
						def: false,
						width: app.views.sectionView.dimensions.columnWidth + 'px'
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
									delete $this['saveTimeout'+cid];
								}
								// set timer to save the note
								$this['saveTimeout'+cid] = window.setTimeout(function() {
									note.save();
								}, 1500);
							});
						},
						hide: function(event, api) {
							var cid = api.elements.tooltip.attr('id').match(/c\d+/)[0];
							var note = app.collections.notes.getByCid(cid);

							if (note) {
								
							}
						}
					}
				});
			}
		}, this);
		
		// place icon next to paragraphs with notes after layout is complete
		app.dispatcher.bind('notesLoaded', function(params) {
			_.each(app.collections.notes.models, function(n) {
				// place a class on the paragraph identifier to indicate a note is present
				var paragraphControls = app.views.sectionView.$el.find('.paragraph-controls[data-osci_content_id=' + n.get('content_id') + ']');
				if (paragraphControls.length) {
					paragraphControls.addClass('notes-present');
				}
			});
		}, this);
	}
});