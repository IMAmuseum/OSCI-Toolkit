// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

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
				this.removeAllChildViews();
				this.render();
			}
		}, this);

	},
	render: function() {
		app.dispatcher.trigger("layoutStart");
		this.renderContent();
		app.dispatcher.trigger("layoutComplete", {numPages : this.model.get('pages').length});
		return this;
	},
	onClose: function() {
		this.model.removeAllPages();
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
				this.model.get('pages').add({});

				page = new OsciTk.views[this.options.pageView]({
					model : this.model.get('pages').at(this.model.get('pages').length - 1),
					pageNumber : this.model.get('pages').length
				});
				this.addView(page, newTarget);
			} else {
				page = page.pop();
			}
		}

		return page;
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