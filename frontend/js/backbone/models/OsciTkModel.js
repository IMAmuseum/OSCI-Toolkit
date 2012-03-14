jQuery(function() {
	window.OsciTkModel = Backbone.Model.extend({
		constructor: function(attrs, options) {
			console.log(options, 'model options');
			this.dispatcher = (options && options.dispatcher) ? options.dispatcher : null;
			if (this.dispatcher == null) this.dispatcher = this;
			Backbone.Model.prototype.constructor.call(this, attrs);
		}
	});
});