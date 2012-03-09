var OsciTkModel = Backbone.Model.extend({
	constructor: function(attrs, dispatcher) {
		this.dispatcher = dispatcher ? dispatcher : null;
		if (this.dispatcher == null) {
			this.dispatcher = this;
		}
		Backbone.Model.prototype.constructor.call(this, attrs);
	}
});