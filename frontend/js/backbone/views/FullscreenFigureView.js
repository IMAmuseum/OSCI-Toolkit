// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.FullscreenFigureView = OsciTk.views.BaseView.extend({
	id: 'fsFigureView',
	initialize: function() {
		app.dispatcher.on('showFigureFullscreen', this.showFigureFullscreen);
	},
	showFigureFullscreen: function(id) {

		var figure_model = app.collections.figures.get(id);
		if (figure_model == undefined) {
			alert('Error: Figure ' + id + ' not found');
			return;
		}

		var figure = null;
		switch (figure_model.get('type')) {
			case 'image_asset':
				var figure = new OsciTk.views.FullscreenImageFigureView({
					id: id,
					model: figure_model
				});
				break;

			default:
				console.log('Unsupported figure type', figure_model);
				return;
		}

		$.fancybox.open({
			content: figure.$el.html()
		});

	}

});