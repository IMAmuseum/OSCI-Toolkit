// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Page = OsciTk.views.BaseView.extend({
		template: _.template($('#template-page').html()),
		className: "page",
		initialize: function() {
			this.$el.addClass("page-num-" + this.model.collection.length)
					.attr("data-page_num", this.model.collection.length);

			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.model.set('renderedHtml', this.$el.html);
		}
	});
});
