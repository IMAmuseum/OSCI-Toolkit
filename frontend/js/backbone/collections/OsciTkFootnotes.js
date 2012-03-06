var OsciTkFootnotes = Backbone.Collection.extend({
	model: OsciTkFootnote,
	initialize: function(data) {
		console.log(data, 'footnotes initialization data');
	}
});