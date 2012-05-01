// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Notes = OsciTk.views.BaseView.extend({
		className: 'notes-view',
		template: _.template($('#template-notes').html()),
		initialize: function() {
			// re-render this view when collection changes
			app.collections.notes.bind('add remove', function() {
				this.render();
			}, this);
		},
		render: function() {
			this.$el.html(this.template({notes: app.collections.notes.toJSON()}));
			return this;
		}
	});
});