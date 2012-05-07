// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //


OsciTk.views.Navigation = OsciTk.views.BaseView.extend({
	id: 'navigation',
	template: OsciTk.templateManager.get('navigation'),
	initialize: function() {
		// when section is loaded, render the navigation control
		app.dispatcher.on('layoutComplete', function(section) {
			this.numPages = section.numPages;
			this.render();
		}, this);
	},
	render: function() {
		this.$el.html(this.template({numPages: this.numPages}));
		if (this.numPages == 1) {
			$('.pager').hide();
		} else {
			$('.pager').show();
		}
		var width = (100/this.numPages);
		$('.pager .head', this.$el).css('width', width + '%');

		// TODO: determine which page is being viewed (from router?)
		var page = 1;
		$('.pager .head', this.$el).css('left', width * (page-1) + '%');

		console.log('Page indicator placed at ' + page + ' of ' + this.numPages);

		$('.next-page', this.$el).click(function () {
			if (page < this.numPages) {
				app.dispatcher.trigger('navigate', { page: page+1 });
			}
		});

		$('.prev-page', this.$el).click(function () {
			if (page > 1) {
				app.dispatcher.trigger('navigate', { page: page-1 });
			}
		});

	}
});