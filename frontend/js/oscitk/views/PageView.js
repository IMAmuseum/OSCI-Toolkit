OsciTk.views.Page = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('page'),
	className: "page",
	initialize: function() {
		this.processingData = {
			complete : false
		};

		this.$el.addClass("page-num-" + this.model.collection.length)
				.attr("data-page_num", this.model.collection.length);
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
	processingComplete : function() {
		this.processingData.complete = true;
		return this;
	},
	addContent : function(newContent) {
		this.model.addContent(newContent);

		return this;
	},
	hasContent : function(hasContent) {
		return this.model.get('content').length ? true : false;
	},
	isPageComplete : function() {
		return this.processingData.complete;
	},
	removeAllContent : function() {
		this.model.removeAllContent();
		return this;
	},
	containsElementId : function(id) {
		return (this.$el.find('#' + id).length !== 0);
	}
});