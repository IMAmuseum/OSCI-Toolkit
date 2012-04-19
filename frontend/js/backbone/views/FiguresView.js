// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Figures = OsciTk.views.BaseView.extend({
		className: 'figures-view',
		template: _.template($('#template-figures').html()),
		initialize: function() {
			// re-render this view when collection changes
			app.collections.figures.bind('add remove', function() {
				this.render();
			}, this);
		},
		render: function() {
			var fig_data = app.collections.figures.toJSON();
			this.$el.html(this.template({figures: fig_data}));

			$('#toolbar figure.thumbnail').click(function() {
				$('#toolbar .figure-browser').hide();
				var content = $("#toolbar figure.preview[data-figure-id='" + $(this).attr('data-figure-id') + "']");
				content.show();
				$('#toolbar').animate({height: content.height() + $('#toolbar-handle').height()}, 'fast');
			});

			$('.back-to-grid').click(function() {
				$('#toolbar').animate({
					height: $('.figure-browser').height() + $('#toolbar-handle').height()
				}, 
				'fast', 
				function() {
					$('#toolbar figure.preview').hide();
					$('#toolbar .figure-browser').show();				
				}	
				);
			});

			return this;
		}
	});
});