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
		"click a.view-fullscreen": "onFigurePreviewClicked",
		"click a.view-in-context": "onViewInContextClicked",
		"click figure.thumbnail": "onThumbnailClick",
		"click .back-to-grid": "backToGridClick",
		"click .figure-nav.next": "figureNextClick",
		"click .figure-nav.prev": "figurePrevClick"
	},
	figureNextClick: function(e) {
		var new_fig = this.$el.find('figure.preview.active').hide().removeClass('active').next('figure.preview');
		if (new_fig.length === 0) {
			new_fig = this.$el.find('figure.preview').first();
		}
		new_fig.show().addClass('active');
		this.displayTitle();
	},
	figurePrevClick: function(e) {
		var new_fig = this.$el.find('figure.preview.active').hide().removeClass('active').prev('figure.preview');
		if (new_fig.length === 0) {
			new_fig = this.$el.find('figure.preview').last();
		}
		new_fig.show().addClass('active');
		this.displayTitle();
	},
	backToGridClick: function(e) {
		this.$el.find('.figure-previews').hide();
		this.$el.find('.figure-browser').show();

		//Call active to make sure width is set correctly
		this.active();

		//resize content area to make sure layout is correct
		app.views.toolbarView.updateHeight();
	},
	onThumbnailClick: function(e) {
		this.$el.find('.figure-browser').hide();
		this.$el.find('.figure-previews figure.active').hide().removeClass('active');
		var content = this.$el.find("figure.preview[data-figure-id='" + $(e.currentTarget).attr('data-figure-id') + "']");
		content.show().addClass('active');
		this.displayTitle();
		this.$el.find('.figure-previews').show();
		app.views.toolbarView.updateHeight();
	},
	onFigurePreviewClicked: function(event_data) {
		var figureId = $(event_data.target).parent('figure').attr('data-figure-id');
		var figureView = app.views.figures[figureId];
		if (figureView && figureView.fullscreen) {
			figureView.fullscreen();
		}
		return false;
	},
	onViewInContextClicked: function(event_data) {
		app.dispatcher.trigger('navigate', { identifier: $(event_data.target).parent('figure').attr('data-figure-id') });
		app.views.toolbarView.contentClose();
		return false;
	},
	active: function() {
		// Set the width of the figure reel if there is more than one thumbnail
		if (app.collections.figures.length > 1) {
			var thumbs = this.$el.find('figure.thumbnail');
			this.$el.find('.figure-browser .figure-reel').width(thumbs.length * (thumbs.outerWidth(true)));
		}
	},
	render: function() {
		var fig_data = app.collections.figures.toJSON();
		this.$el.html(this.template({figures: fig_data}));

		return this;
	},
	displayTitle: function() {
		var id = this.$el.find('figure.preview.active').attr('data-figure-id');
		var figure = app.collections.figures.get(id);
		this.$el.find('h2 span.title').html(figure.get('title'));
	}
});