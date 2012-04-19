// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Figures = OsciTk.views.BaseView.extend({
		className: 'figures-view',
		template: _.template($('#template-figures').html()),
		initialize: function() {
			// re-render this view when collection changes
			app.collections.figures.bind('add remove', function() {
				this.render();
			}, this);
		},
		render: function() {
			var fig_data = app.collections.figures.toJSON();
			this.$el.html(this.template({figures: fig_data}));
			return this;
		}
	});
});