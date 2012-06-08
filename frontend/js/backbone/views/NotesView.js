// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Notes = OsciTk.views.BaseView.extend({
	className: 'notes-view',
	template: OsciTk.templateManager.get('notes'),
	initialize: function() {
		// re-render this view when collection changes
		app.collections.notes.bind('add remove change', function() {
			console.log('notes collection changed');
			this.render();
		}, this);
	},
	render: function() {
		// filter notes - only show ones with ids (saved to server)
		var notes = _.filter(app.collections.notes.models, function(note) {
			if (note.id !== null) return true;
			return false;
		});
		this.$el.html(this.template({notes: notes}));
		// bind the clicks to trigger the click on the appropriate content_id
		this.$el.find('.noteLink').on('click', function(e) {
			var target = $(e.target);
			var content_id = target.attr('data-content_id');
			if (content_id) {
				app.dispatcher.trigger('navigate', {identifier: content_id});
				$('#'+content_id).click();
				app.views.toolbarView.contentClose();
			}
		});
		return this;
	}
});