OsciTk.views.Section = OsciTk.views.BaseView.extend({
	id: 'section',
	initialize: function() {

		_.defaults(this.options, {
			pageView : 'Page'
		});

		// bind sectionChanged
		app.dispatcher.on('currentNavigationItemChanged', function(navItem) {
			if (navItem) {
				// loading section content
				app.models.section = new OsciTk.models.Section({
					uri : navItem.get('uri'),
					id : navItem.get('id')
				});

				app.models.section.loadContent();
				this.changeModel(app.models.section);
				this.render();
			}
		}, this);

	},
	render: function() {
		//Allow subclasses to do something before we render
		if (this.preRender) {
			this.preRender();
		}
		//clean up the view incase we have already rendered this before
		this.model.removeAllPages();
		this.removeAllChildViews();

		app.dispatcher.trigger("layoutStart");
		this.renderContent();
		app.dispatcher.trigger("layoutComplete", {numPages : this.model.get('pages').length});
		return this;
	},
	onClose: function() {
		this.model.removeAllPages();
	},
	getPageForParagraphId: function(pid) {
		var views = this.getChildViews();
		var p = _.find(views, function(view) {
			return view.$el.find("[data-paragraph_number='" + pid + "']").length !== 0;
		});
		if ((p !== undefined) && (p !== -1)) {
			return _.indexOf(views, p) + 1;
		}
		return null;
	},
	getPageForElementId : function(id) {
		var views = this.getChildViews();
		var p = _.find(views, function(view) { return view.containsElementId(id); });
		if ((p !== undefined) && (p !== -1)) {
			return _.indexOf(views, p) + 1;
		}
		return null;
	},
	getPageForProcessing : function(id, newTarget) {
		var page;

		if (id !== undefined) {
			page = this.getChildViewById(id);
		} else {
			page = _.filter(this.getChildViews(), function(page){
				return page.isPageComplete() === false;
			});

			if (page.length === 0) {
				var pagesCollection = this.model.get('pages');
				pagesCollection.add({
					pageNumber: this.model.get('pages').length + 1
				});

				page = new OsciTk.views[this.options.pageView]({
					model : pagesCollection.last(),
					pageNumber : this.model.get('pages').length
				});
				this.addView(page, newTarget);
			} else {
				page = page.pop();
			}
		}

		return page;
	},
	getCurrentPageView: function() {
		// TODO: so the only possible child view of a section is a page???
		return this.getChildViewByIndex(app.views.navigationView.page - 1);
	},
	renderContent: function() {
		//basic layout just loads the content into a single page with scrolling
		var pageView = this.getPageForProcessing();

		//add the content to the view/model
		pageView.addContent(this.model.get('content').find('body').html());

		//render the view
		pageView.render();

		//mark processing complete (not necessary, but here for example)
		pageView.processingComplete();
	}
});