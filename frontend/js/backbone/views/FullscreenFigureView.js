// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.FullscreenFigureView = OsciTk.views.BaseView.extend({
	id: 'fsFigureView',
	initialize: function() {
		app.dispatcher.on('showFigureFullscreen', this.showFigureFullscreen);
	},
	showFigureFullscreen: function(event) {
		console.log('showFigureFullscreen');
	}


});