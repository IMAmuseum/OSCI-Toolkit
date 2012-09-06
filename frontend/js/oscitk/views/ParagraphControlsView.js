OsciTk.views.ParagraphControlsView = OsciTk.views.BaseView.extend({
	className: 'paragraph-controls',

	initialize: function() {
		this.options.paragraphNumber = this.options.content.data("paragraph_number");
		this.options.contentIdentifier = this.options.content.data("osci_content_id");
		this.options.linkItems = app.config.get('paragraphControls');

		if (this.options.linkItems) {
			this.render();
		}
	},

	render: function() {
		var contentPosition = this.options.content.position();

		this.$el.attr('data-osci_content_id', this.options.contentIdentifier);
		this.$el.attr('data-paragraph_identifier', this.options.paragraphNumber);
		this.$el.html('<span class="paragraph-identifier paragraph-identifier-' + this.options.paragraphNumber + '">' + (this.options.paragraphNumber) + '</span>');
		this.$el.css(this.options.position);

		//remove qtip if already present
		if(this.$el.data("qtip")) {
			this.$el.qtip("destroy");
		}

		var tipContent = '';
		for(var i in this.options.linkItems) {
			var text = this.options.linkItems[i];
			tipContent += '<a href="' + i + '" data-event="' + i + '" class="' + i +'">' + text + '</a> ';
		}

		this.$el.qtip({
			position: {
				my: "left center",
				at: "right center",
				target: this.$el,
				container: this.$el,
				adjust: {
					y: -10
				}
			},
			show: {
				ready: false,
				solo: true
			},
			hide: {
				fixed: true,
				delay: 500
			},
			style: {
				def: false
			},
			overwrite: false,
			content: tipContent
		});

		this.$el.on('click', 'a', {content: this.options.content}, function(e) {
			e.preventDefault();
			app.dispatcher.trigger(
				$(this).data('event'),
				{
					contentId: $(e.data.content).attr('data-osci_content_id')
				}
			);
		});

		return this;
	}
});