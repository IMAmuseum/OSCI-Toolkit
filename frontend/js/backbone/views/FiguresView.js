// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Figures = OsciTk.views.BaseView.extend({
	className: 'figures-view',
	template: OsciTk.templateManager.get('figures'),
	initialize: function() {
		// re-render this view when collection changes
		app.collections.figures.on('add remove reset', function() {
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
			var thumbs = this.$el.find('figure.thumbnail');
			this.$el.find('.figure-browser .figure-reel').width(thumbs.length * (thumbs.outerWidth(true)));
		}

		// When the reader clicks on a figure thumbnail, show the preview for that figure...
		this.$el.on('click', 'figure.thumbnail', {view: this},function(e) {
			e.data.view.$el.find('.figure-browser').hide();
			e.data.view.$el.find('.figure-previews figure.active').hide().removeClass('active');
			var content = e.data.view.$el.find("figure.preview[data-figure-id='" + $(this).attr('data-figure-id') + "']");
			content.show().addClass('active');
			e.data.view.displayTitle();
			e.data.view.$el.find('.figure-previews').show();
			e.data.view.parent.updateHeight();
		});

		// When going back to the grid, hide the current preview and replace the close button
		this.$el.on('click', '.back-to-grid', {view: this}, function(e) {
			e.data.view.$el.find('.figure-previews').hide();
			e.data.view.$el.find('.figure-browser').show();
			e.data.view.parent.updateHeight();
		});

		this.$el.on('click', '.figure-nav.next', {view: this}, function(e) {
			var new_fig = e.data.view.$el.find('figure.preview.active').hide().removeClass('active').next('figure.preview');
			if (new_fig.length === 0) {
				new_fig = e.data.view.$el.find('figure.preview').first();
			}
			new_fig.show().addClass('active');
			e.data.view.displayTitle();
		});

		this.$el.on('click', '.figure-nav.prev', {view: this}, function(e) {
			var new_fig = e.data.view.$el.find('figure.preview.active').hide().removeClass('active').prev('figure.preview');
			if (new_fig.length === 0) {
				new_fig = e.data.view.$el.find('figure.preview').last();
			}
			new_fig.show().addClass('active');
			e.data.view.displayTitle();
		});

		return this;
	},
	displayTitle: function() {
		var id = this.$el.find('figure.preview.active').attr('data-figure-id');
		var figure = app.collections.figures.get(id);
		this.$el.find('h2 span.title').html(figure.get('title'));
	}
});