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
			chapter: app.collections.navigationItems.currentNavigationItem.get('title')
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

		// unbind both controls to start
		this.$el.find('.prev-page').unbind('click');
		this.$el.find('.next-page').unbind('click');
		
		// Set previous button state
		if (page == 1) {
			// check if we can go to the previous section
			var previous = app.collections.navigationItems.currentNavigationItem.get('previous');
			if (previous) {
				this.$el.find('.prev-page .label').html('Previous Section');
				this.$el.find('.prev-page').removeClass('inactive').click(function () {
					app.router.navigate("section/" + previous.id, {trigger: true});
				});
			}
			// on first page and no previous section, disable interaction
			else {
				$('.prev-page', this.$el).addClass('inactive').unbind('click');
			}
		} else if (this.numPages > 1) {
			this.$el.find('.prev-page .label').html('Previous');
			this.$el.find('.prev-page').removeClass('inactive').click(function () {
				app.dispatcher.trigger('navigate', { page: page-1 });
			});
		}

		// Set next button state
		if (page == this.numPages) {
			// check if we can go to the next section
			var next = app.collections.navigationItems.currentNavigationItem.get('next');
			if (next) {
				this.$el.find('.next-page .label').html('Next Section');
				this.$el.find('.next-page').removeClass('inactive').click(function () {
					app.router.navigate("section/" + next.id, {trigger: true});
				});
			}
			// on last page and no next section, disable interaction
			else {
				this.$el.find('.next-page').addClass('inactive').unbind('click');
			}
		} else if (this.numPages > 1) {
			this.$el.find('.next-page .label').html('Next');
			this.$el.find('.next-page').removeClass('inactive').click(function () {
				app.dispatcher.trigger('navigate', { page: page+1 });
			});
		}

	}

});