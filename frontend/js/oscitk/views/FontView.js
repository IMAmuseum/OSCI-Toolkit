OsciTk.views.Font = OsciTk.views.BaseView.extend({
	className: 'font-view',
	template: OsciTk.templateManager.get('font'),
	initialize: function() {
		this.currentFontSize = 100;
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
		return this;
	},
	events: {
		"click .font-button": "changeFontSize",
		"click .theme-button": "changeTheme"
	},
	changeFontSize: function(e) {
		e.preventDefault();

		var sectionView = app.views.sectionView;
		var clicked = $(e.target);

		if (clicked.attr("href") === "#font-larger") {
			this.currentFontSize += 25;
		} else {
			this.currentFontSize -= 25;
		}

		sectionView.$el.css({
			"font-size": this.currentFontSize + "%"
		});

		app.dispatcher.trigger("windowResized");
	},
	changeTheme: function(e) {
		e.preventDefault();

		var clicked = $(e.target);
		var theme = clicked.attr("href").substr(1);
		var body = $("body");

		body.removeClass("normal sepia night");

		body.addClass(theme);
	}
});