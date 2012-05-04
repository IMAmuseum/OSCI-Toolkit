// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //


OsciTk.views.MultiColumnFigure = OsciTk.views.BaseView.extend({

	tagName: 'figure',
	processed: false,

	initialize: function() {
		this.preRender();
	},

	render: function() {
		console.log("rendering");
	},

	preRender: function() {
		var modelData = this.model.toJSON();
		//console.log(this.options.sectionDimensions, 'dimensions');

		if (modelData.position === "n") {
			this.$el.hide();
		}
	}
});