// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Toc = OsciTk.views.BaseView.extend({
		className: 'toc-view',
		template: _.template($('#template-toc').html()),
		events: {
			'click li a': 'itemClick'
		},
		initialize: function() {
			this.parent = this.options.parent;
		},
		render: function() {
			this.$el.html(this.template({
				items: app.collections.navigationItems.where({depth: 0})
			}));
		},
		itemClick: function(event) {
			var sectionId = $(event.currentTarget).attr('data-section-id');
			// app.dispatcher.trigger('navigateToSection', sectionId);
			// TODO: don't really want to address the appRouter directly
			app.router.navigate("section/" + sectionId, {trigger: true});
			this.parent.contentClose();
		}
	});
});