OsciTk.views.Notes = OsciTk.views.BaseView.extend({
	className: 'notes-view',
	template: OsciTk.templateManager.get('notes'),
	initialize: function() {
		// re-render this view when collection changes
		app.collections.notes.on('add remove change', function() {
			this.render();
		}, this);

		// catch the page changed event and highlight any notes in list that are on current page
		app.dispatcher.on('pageChanged notesLoaded', function(data) {
			var page;
			if (typeof(data.page) === 'undefined') {
				page = app.views.navigationView.page;
			}
			else {
				page = data.page;
			}
			pageView = app.views.sectionView.getChildViewByIndex(page - 1);
			_.each(app.collections.notes.models, function(note) {
				// reset to false
				note.set('onCurrentPage', false);
				// search for note's content id in current page
				var found = pageView.$el.find('#' + note.get('content_id'));
				if (found.length > 0) {
					note.set('onCurrentPage', true);
				}
			});
			this.render();
		}, this);
	},
	events: {
		"click .noteLink": "noteLinkClick"
	},
	noteLinkClick: function(e) {
		e.preventDefault();
		var target = $(e.target);
		var content_id = target.attr('data-content_id');
		if (content_id) {
			app.dispatcher.trigger('navigate', {identifier: content_id});
			app.dispatcher.trigger('toggleNoteDialog', { contentId: content_id });
			$('#'+content_id).click();
			app.views.toolbarView.contentClose();
		}
	},
	render: function() {
		var notes = this.getSavedNotes();
		this.$el.html(this.template({notes: notes}));
		this.active();

		return this;
	},
	getSavedNotes: function() {
		// filter notes - only return notes with ids (saved to server)
		var notes = _.filter(app.collections.notes.models, function(note) {
			if (note.id !== null) return true;
			return false;
		});
		return notes;
	},
	active: function() {
		// Set the width of the notes reel if there is more than one note
		if (app.collections.notes.length > 1) {
			var notes = this.$el.find('.notesListItem');
			this.$el.find('.notesList').width(notes.length * (notes.first().outerWidth(true)));
		}
	}
});