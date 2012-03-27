jQuery(function() {
	window.OsciTkToolbarItemView = OsciTkView.extend({
		className: 'toolbar-item',
		template: _.template($('#template-toolbar-item').html()),
		initialize: function() {
			this.render();
		},
		events: {
			'click': 'itemClicked'
		},
		render: function() {
			this.$el.html(this.template({text: this.options.toolbarItem.text}));
		},
		itemClicked: function() {
			console.log(this, 'clicked');
		}
	});
});