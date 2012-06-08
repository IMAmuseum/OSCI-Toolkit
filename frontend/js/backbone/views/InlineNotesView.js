// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.InlineNotes = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('note-popup'),
	tempNotes: [],
	saveTimeout: null,
	initialize: function() {
		var $this = this;
		// set up qtip options
		this.qtipOptions = {
			content: {
				text: "Test tooltip",
				title: {
					text: "Notes"
				}
			},
			show: {
				ready: true,
				event: ''
			},
			hide: {
				event: 'mouseleave',
				delay: 500,
				fixed: true
			},
			position: {
				my: 'bottom left',
				at: 'top left',
				target: $(event.target)
			}
		}
		app.dispatcher.on('pageChanged', function(pageChanged) {
			// get the current page
			var page = app.views.sectionView.childViews[pageChanged.page - 1];
			
			// bind to the click action on that page's element.
			page.$el.bind('click', function(event){
				// check that the target's id is a valid osci content id
				if (event.target.id.match(/^osci-content-/)) {
					// find the note content if pre-existing
					var note;
					var notes = app.collections.notes.where({content_id: event.target.id});
					if (notes[0]) {
						note = notes[0];
					}
					else {
						note = new OsciTk.models.Note({
							content_id: event.target.id,
							section_id: app.models.section.id
						});
						app.collections.notes.add(note);
					}
					// fire the tooltip
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
							my: 'bottom left',
							at: 'top left',
							target: $(event.target)
						},
						events: {
							render: function(event, api) {
								console.log(api, 'api');
								// bind to keyup on text area to sync changes to back end
								api.elements.content.find('.noteForm textarea').bind('keyup', function(e) {
									console.log(e, 'event');
									// save the content to the model in case the note disappears (user clicks off)
									var cid = api.elements.tooltip.attr('id').match(/c\d+/)[0];
									// search the collection for this cid
									var note = app.collections.notes.getByCid(cid);
									note.set('note', e.target.value);
									// clear the previous timer if there is one
									if ($this.saveTimeout != null) {
										clearTimeout($this.saveTimeout);
										$this.saveTimeout = null;
									}
									// set timer to save the note
									$this.saveTimeout = window.setTimeout(function() {
										note.save();
									}, 1500);
								});
							}
						}
					});
				}
			});
		});
	}
});