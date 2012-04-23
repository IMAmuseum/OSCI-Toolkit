// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Section = OsciTk.views.BaseView.extend({
		id: 'section',
		template: _.template($('#template-section').html()),
		initialize: function() {
			// bind sectionChanged
			app.dispatcher.on('currentNavigationItemChanged', function() {
				if (app.collections.navigationItems.getCurrentNavigationItem()) {
					// loading section content
					var navItem = app.collections.navigationItems.getCurrentNavigationItem();

					app.models.section = new OsciTk.models.Section({
						uri : navItem.get('uri')
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
		renderContent: function() {
			//basic layout just loads the content into a single page with scrolling
			var pages = this.model.get('pages');
			pages.add({
				content : this.model.get('content').find('body').html()
			});

			this.addView(new OsciTk.views.Page({
				model : pages.at(pages.length - 1)
			}));
		}
	});
});
