OsciTk.views.BaseView = Backbone.View.extend({
	getChildViews: function() {
		if (!this.childViews) { this.childViews = []; }
		return this.childViews;
	},
	addView: function(view, target) {
		view.parent = this;
		if (typeof target === "undefined") {
			this.$el.append(view.el);
		}
		else {
			this.$el.find(target).append(view.el);
		}

		this._addViewReference(view);

		return this;
	},
	removeAllChildViews : function() {
		if (this.childViews) {
			for (var i = 0, len = this.childViews.length; i < len; i++) {
				this.childViews[i].close();
			}
			this.childViews = [];
		}

		return this;
	},
	removeView: function(view, close) {
		if (this.childViews) {
			for (var i = 0, len = this.childViews.length; i < len; i++) {
				if (view.cid === this.childViews[i].cid) {
					this.childViews.splice(i, 1);
					view.$el.detach();
					if (close || close === undefined) {
						view.close();
					}
					break;
				}
			}
		}

		return this;
	},
	getChildViewById: function(id) {
		var view;
		if (this.childViews) {
			for (var i = 0, len = this.childViews.length; i < len; i++) {
				if (id === this.childViews[i].cid) {
					view = this.childViews[i];
					break;
				}
			}
		}
		return view;
	},
	getChildViewByIndex: function(index) {
		var view;
		if (this.childViews && this.childViews[index]) {
			view = this.childViews[index];
		}
		return view;
	},
	getChildViewsByType: function(type) {
		return _.filter(this.childViews, function(childView) {
			return childView.$el.is(type);
		});
	},
	replaceView: function(view, target) {
		view.parent = this;
		if (typeof target === "undefined") {
			this.$el.html(view.el);
		}
		else {
			this.$el.find(target).html(view.el);
		}

		this._addViewReference(view);

		return this;
	},
	changeModel: function(model) {
		this.model = model;

		return this;
	},
	close: function() {
		this.removeAllChildViews();
		this.remove();
		this.unbind();
		this.undelegateEvents();
		if (this.onClose){
			this.onClose();
		}
	},
	_addViewReference: function(view) {
		if (!this.childViews) { this.childViews = []; }
		var alreadyAdded = false;
		for (var i = 0, len = this.childViews.length; i < len; i++) {
			if (view.cid === this.childViews[i].cid) {
				alreadyAdded = true;
				break;
			}
		}

		if (!alreadyAdded) {
			this.childViews.push(view);
		}
	}
});