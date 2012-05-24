// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Figures = OsciTk.views.BaseView.extend({
	className: 'figures-view',
	template: OsciTk.templateManager.get('figures'),
	initialize: function() {
		// re-render this view when collection changes
		app.collections.figures.bind('add remove', function() {
			this.render();
		}, this);
	},
	events: {
		"click .figure-preview": "onFigurePreviewClicked",
		"click a.view-in-context": "onViewInContextClicked"
	},
	onFigurePreviewClicked: function(event_data) {
		app.dispatcher.trigger('showFigureFullscreen', $(event_data.target).parent('figure').attr('data-figure-id'));
		return false;
	},
	onViewInContextClicked: function(event_data) {
		app.dispatcher.trigger('navigate', { identifier: $(event_data.target).parent('figure').attr('data-figure-id') });
		app.views.toolbarView.contentClose();
		return false;		
	},
	render: function() {

		this.$el.show(); // Show first so that widths can be calculated

		var fig_data = app.collections.figures.toJSON();
		this.$el.html(this.template({figures: fig_data}));

		// Set the width of the figure reel if there is more than one thumbnail
		if (fig_data.length > 1) {
			var thumbs = $('#toolbar figure.thumbnail');
			$('#toolbar .figure-browser .figure-reel').width(thumbs.length * (thumbs.outerWidth(true)));
		}

		// When the reader clicks on a figure thumbnail, show the preview for that figure...
		$('#toolbar figure.thumbnail').click(function() {
			$('#toolbar .figure-browser').hide();
			$('#toolbar .figure-previews figure.active').hide().removeClass('active');
			var content = $("#toolbar figure.preview[data-figure-id='" + $(this).attr('data-figure-id') + "']");
			content.show().addClass('active');
			OsciTk.views.Figures.prototype.displayTitle();
			$('#toolbar .figure-previews').show();
			$('#toolbar').animate({height: $('#toolbar-content').height() + $('#toolbar-handle').height()}, 'fast');
		});

		// When going back to the grid, hide the current preview and replace the close button
		$('.back-to-grid').click(function() {
			$('#toolbar').animate({
				height: $('.figure-browser').height() + $('#toolbar-handle').height()
			},
			'fast',
			function() {
				$('#toolbar .figure-previews').hide();
				$('#toolbar .figure-browser').show();
			}
			);
		});

		$('#toolbar .figure-nav.next').click(function() {
			var new_fig = $('#toolbar figure.preview.active').hide().removeClass('active').next('figure.preview');
			if (new_fig.length === 0) {
				new_fig = $('#toolbar figure.preview').first();
			}
			new_fig.show().addClass('active');
			OsciTk.views.Figures.prototype.displayTitle();
		});

		$('#toolbar .figure-nav.prev').click(function() {
			var new_fig = $('#toolbar figure.preview.active').hide().removeClass('active').prev('figure.preview');
			if (new_fig.length === 0) {
				new_fig = $('#toolbar figure.preview').last();
			}
			new_fig.show().addClass('active');
			OsciTk.views.Figures.prototype.displayTitle();
		});

		return this;
	},
	displayTitle: function() {
		var id = $('#toolbar figure.preview.active').attr('data-figure-id');
		var figure = app.collections.figures.get(id);
		$('#toolbar h2 span.title').html(figure.get('title'));
	}
});