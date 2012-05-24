// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.FullscreenHTMLFigureView = OsciTk.views.BaseView.extend({
	className: 'fullscreen-html-figure',
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.model.get('content'));
		return this;
	}

});