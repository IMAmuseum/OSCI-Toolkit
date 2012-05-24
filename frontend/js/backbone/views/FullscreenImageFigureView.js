// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.FullscreenImageFigureView = OsciTk.views.BaseView.extend({
	className: 'fullscreen-image-figure',
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.model.get('content'));
		return this;
	}

});