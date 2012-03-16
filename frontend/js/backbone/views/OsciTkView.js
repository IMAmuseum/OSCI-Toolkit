jQuery(function() {
	window.OsciTkView = Backbone.View.extend({
		constructor: function(options) {
			console.log(options, 'view options');
			this.dispatcher = (options && options.dispatcher) ? options.dispatcher : null;
			if (this.dispatcher === null) this.dispatcher = this;
			Backbone.View.prototype.constructor.call(this, options);
		},
		addView: function(view) {
			view.parent = this;
			this.$el.append(view.el);
		},
		changeModel: function(model) {
			this.model = model;
		}
	});
});