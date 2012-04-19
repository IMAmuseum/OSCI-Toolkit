// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.BaseView = Backbone.View.extend({
		childViews: [],
		addView: function(view, target) {
			view.parent = this;
			if (typeof target === "undefined") {
				this.$el.append(view.el);
			}
			else {
				this.$el.find(target).append(view.el);
			}

			this.addViewToLocalArray(view);

			return this;
		},
		removeAllChildViews : function() {
			for (var i, len = this.childViews.length; i < len; i++) {
				this.childViews[i].close();
			}

			return this;
		},
		removeView: function(view) {
			for (var i, len = this.childViews.length; i < len; i++) {
				if (view.cid === this.childViews[i].cid) {
					this.childViews.splice(i, 1);
					view.close();
					break;
				}
			}

			return this;
		},
		replaceView: function(view, target) {
			view.parent = this;
			if (typeof target === "undefined") {
				this.$el.html(view.el);
			}
			else {
				this.$el.find(target).html(view.el);
			}

			this.addViewToLocalArray(view);

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
		addViewToLocalArray: function(view) {
			var alreadyAdded = false;
			for (var i, len = this.childViews.length; i < len; i++) {
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
});