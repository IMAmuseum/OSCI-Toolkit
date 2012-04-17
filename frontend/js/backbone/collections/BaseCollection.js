// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.collections.BaseCollection = Backbone.Collection.extend({
		constructor: function(attrs, options) {
			this.dispatcher = (options && options.dispatcher) ? options.dispatcher : null;
			if (this.dispatcher === null) this.dispatcher = this;
			Backbone.Collection.prototype.constructor.call(this, attrs);
		}
	});
});