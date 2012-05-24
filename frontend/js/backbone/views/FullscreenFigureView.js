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

				// For simple images, this is a better way to display within fancybox than the alternate method below
				// TODO: generalize for other types of media?
				$.fancybox.open({
					href: $(figure_model.get('content')).attr('src')
				});
				return;

				/*
				 * Alternate implementation, if we need to have a custom image viewport like a tiled image viewer -
				 * but this may be a different asset type
				 *
				var figure = new OsciTk.views.FullscreenImageFigureView({
					id: id,
					model: figure_model
				});
				*/				

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