// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Navigation = OsciTk.views.BaseView.extend({
		id: 'navigation',
		template: _.template($('#template-navigation').html()),
		initialize: function() {
			// when section is loaded, render the navigation control
			app.dispatcher.on('layoutComplete', function(section) {
				this.numPages = section.numPages;
				this.render();
			}, this);
		},
		render: function() {
			this.$el.html(this.template({numPages: this.numPages}));
		}
	});
});