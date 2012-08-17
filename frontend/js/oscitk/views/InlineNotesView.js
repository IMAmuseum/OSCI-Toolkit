OsciTk.views.InlineNotes = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('note-popup'),
	initialize: function() {

		app.dispatcher.on('toggleNoteDialog', function(data) {
			var $this = this;
			var contentId = data.contentId;
			var content = $('#' + contentId);
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
				var noteJson = note.toJSON();
				noteJson.referenceContent =content.text();

				content.qtip("destroy");
				content.qtip({
					id: note.cid,
					content: {
						title: {
							text: "Notes",
							button: "Save & Close"
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
							api.elements.content.find('.noteForm textarea').on('keyup', function(e) {
								// change status text
								api.elements.content.find('.status').text('Saving...');
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
									api.elements.content.find('.status').text('Saved');
								}, 1500);
							});
						},
						hide: function(event, api) {
							// if closing the modal for a note with content, mark the paragraph control
							// to indicate this paragraph has a note
							var content = api.elements.content.find('textarea').val();
							if (content.length > 0) {
								var pageView = app.views.sectionView.getCurrentPageView();
								var pc = pageView.$el.find('.paragraph-controls[data-osci_content_id=' + contentId + ']');
								pc.addClass('notes-present');
							}
						}
					}
				});
			}
		}, this);

		// place icon next to paragraphs with notes after layout is complete
		app.dispatcher.on('notesLoaded', function(params) {
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