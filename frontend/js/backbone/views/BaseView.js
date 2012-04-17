// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.BaseView = Backbone.View.extend({
		addView: function(view, target) {
			view.parent = this;
			if (typeof target === "undefined") {
				this.$el.append(view.el);
			}
			else {
				this.$el.find(target).append(view.el);
			}
		},
		replaceView: function(view, target) {
			view.parent = this;
			if (typeof target === "undefined") {
				this.$el.html(view.el);
			}
			else {
				this.$el.find(target).html(view.el);
			}
		},
		changeModel: function(model) {
			this.model = model;
		}
	});
});