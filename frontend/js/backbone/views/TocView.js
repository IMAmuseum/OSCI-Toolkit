// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Toc = OsciTk.views.BaseView.extend({
		className: 'toc-view',
		template: _.template($('#template-toc').html()),
		events: {
			'click li a': 'itemClick'
		},
		initialize: function() {
			this.parent = this.options.parent;
			app.dispatcher.on('navigationLoaded', function(navigation) {
				this.navigation = navigation;
			}, this);
		},
		render: function() {
			var toc = [];
			_.each(this.navigation.get('toc').children, function(child) {
				toc.push(app.collections.sections.get(child['data-section_id']));
			}, this);
			console.log(toc, 'toc');
			this.$el.html(this.template({items: toc}));
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