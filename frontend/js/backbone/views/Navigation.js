// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Navigation = OsciTk.views.BaseView.extend({
		id: 'navigation',
		template: _.template($('#template-navigation').html()),
		initialization: function() {
			
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});