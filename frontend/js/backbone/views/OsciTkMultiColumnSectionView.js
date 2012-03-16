jQuery(function() {
	window.OsciTkMultiColumnSectionView = OsciTkSectionView.extend({
		renderContent: function()
		{
			console.log("multi-column");
			this.$el.html(this.template(this.model.toJSON()));
		}
	});
});