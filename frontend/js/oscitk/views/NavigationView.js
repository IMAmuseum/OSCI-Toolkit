OsciTk.views.Navigation = OsciTk.views.BaseView.extend({
	id: 'navigation',
	template: OsciTk.templateManager.get('navigation'),
	initialize: function() {
		//set some defaults
		this.numPages = null;
		this.identifier = null;
		this.currentNavigationItem = null;
		this.page = null;

		// when section is loaded, render the navigation control
		app.dispatcher.on('layoutComplete', function(section) {
			if (this.identifier) {
				app.dispatcher.trigger("navigate", {identifier: this.identifier});
				this.identifier = null;
			}
			else {
				app.dispatcher.trigger("navigate", {page: 1});
			}
			this.numPages = section.numPages;
			this.render();
		}, this);

		app.dispatcher.on('pageChanged', function(info) {
			// clear old identifier in url
			// app.router.navigate("section/" + previous.id + "/end");
			this.page = info.page;
			this.update(info.page);
		}, this);

		// bind routedTo
		app.dispatcher.on('routedToSection', function(params) {
			this.identifier = params.identifier;
			if (!params.section_id) {
				// go to first section
				var sectionId = app.collections.navigationItems.at(0).id;
				this.setCurrentNavigationItem(sectionId);
				app.router.navigate("section/" + sectionId, {trigger: false});
			}
			else {
				// go to section_id
				this.setCurrentNavigationItem(params.section_id);
			}

			var title = app.models.docPackage.getTitle();
			title = (title) ? title + " | ": "";
			title += this.getCurrentNavigationItem().get('title');
			document.title = title;
		}, this);

		// Respond to keyboard events
		$(document).keydown(function(event) {
			var p;
			switch(event.which) {
				case 39:
					// Right arrow navigates to next page
					p = app.views.navigationView.page + 1;
					if (p > app.views.navigationView.numPages) {
						var next = app.views.navigationView.currentNavigationItem.get('next');
						if (next) {
							app.router.navigate("section/" + next.id, {trigger: true});
						}
					} else {
						app.dispatcher.trigger('navigate', {page: p});
					}
					break;
				case 37:
					// Left arrow navigates to previous page
					p = app.views.navigationView.page - 1;
					if (p < 1) {
						var previous = app.views.navigationView.currentNavigationItem.get('previous');
						if (previous) {
							app.router.navigate("section/" + previous.id + "/end", {trigger: true});
						}
					} else {
						app.dispatcher.trigger('navigate', {page: p});
					}
					break;
			}

		});

	},

	render: function() {

		this.$el.html(this.template({
			numPages: this.numPages,
			chapter: this.currentNavigationItem.get('title')
		}));

		// Hide the pager if there's only one page, show otherwise
		if (this.numPages == 1) {
			$('.pager').hide();
		} else {
			$('.pager').show();
		}

		// Calculate the width for the pager head
		var width = (100/this.numPages);
		$('.pager .head', this.$el).css('width', width + '%');

		// Navigate to the appropriate page when mousedown happens in the pager
		$('.pager').mousedown(function(data) {
			var p = parseInt(app.views.navigationView.numPages * data.offsetX / $(this).width(), 10);
			app.dispatcher.trigger('navigate', { page: p+1 });
		});

		// Do other things that can happen whenever the page changes
		this.update(this.page);

	},

	getCurrentNavigationItem: function(){
		return this.currentNavigationItem;
	},

	setCurrentNavigationItem: function(section_id) {
		this.currentNavigationItem = app.collections.navigationItems.get(section_id);
		app.dispatcher.trigger('currentNavigationItemChanged', this.currentNavigationItem);
	},

	update: function(page) {

		// Calculate the position of the pager head
		var width = (100/this.numPages);
		$('.pager .head', this.$el).css('left', width * (page-1) + '%');

		// unbind both controls to start
		this.$el.find('.prev-page').unbind('click');
		this.$el.find('.next-page').unbind('click');

		// Set previous button state
		if (page == 1) {
			// check if we can go to the previous section
			var previous = this.currentNavigationItem.get('previous');
			if (previous) {
				this.$el.find('.prev-page .label').html('Previous Section');
				this.$el.find('.prev-page').removeClass('inactive').click(function () {
					app.router.navigate("section/" + previous.id + "/end", {trigger: true});
				});
			}
			// on first page and no previous section, disable interaction
			else {
				$('.prev-page', this.$el).addClass('inactive').unbind('click');
			}
		} else if (this.numPages > 1) {
			var $this = this;
			this.$el.find('.prev-page .label').html('Previous');
			this.$el.find('.prev-page').removeClass('inactive').click(function () {
				app.router.navigate("section/" + $this.currentNavigationItem.id);
				app.dispatcher.trigger('navigate', {page:(page-1)});
			});
		}

		// Set next button state
		if (page == this.numPages) {
			// check if we can go to the next section
			var next = this.currentNavigationItem.get('next');
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