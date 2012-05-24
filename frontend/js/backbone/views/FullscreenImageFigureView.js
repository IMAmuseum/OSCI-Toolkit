// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

/*
 * This class is currently deprecated, but could be used as a template for a more advanced image viewer
 */

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