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
		app.dispatcher.on('pageChanged', function(info) {
			this.page = info.page;
			this.update(info.page);
		}, this);
	},
	render: function() {
		this.$el.html(this.template({
			numPages: this.numPages,
			chapter: app.models.section.get('title')
		}));
		if (this.numPages == 1) {
			$('.pager').hide();
		} else {
			$('.pager').show();
		}
		var width = (100/this.numPages);
		$('.pager .head', this.$el).css('width', width + '%');

		this.update(this.page);

	},
	update: function(page) {

		var width = (100/this.numPages);
		$('.pager .head', this.$el).css('left', width * (page-1) + '%');

		//console.log('Page indicator placed at ' + page + ' of ' + this.numPages);

		// Set previous button state
		if (page == 1) {
			$('.prev-page', this.$el).addClass('inactive').unbind('click');
		} else if (this.numPages > 1) {
			$('.prev-page', this.$el).removeClass('inactive').click(function () {
				app.dispatcher.trigger('navigate', { page: page-1 });
			});
		}

		// Set next button state
		if (page == this.numPages) {
			$('.next-page', this.$el).addClass('inactive').unbind('click');
		} else if (this.numPages > 1) {
			$('.next-page', this.$el).removeClass('inactive').click(function () {
				app.dispatcher.trigger('navigate', { page: page+1 });
			});
		}

	}

});