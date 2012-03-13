jQuery(function() {
	window.OsciTkCollection = Backbone.Collection.extend({
		constructor: function(attrs, options) {
			this.dispatcher = (options && options.dispatcher) ? options.dispatcher : null;
			if (this.dispatcher == null) this.dispatcher = this;
			Backbone.Model.prototype.constructor.call(this, attrs);
		}
	});
});