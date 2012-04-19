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

			// When the reader clicks on a figure thumbnail, show the preview for that figure...
			$('#toolbar figure.thumbnail').click(function() {
				$('#toolbar .figure-browser').hide();
				$('#toolbar-close').hide();
				var content = $("#toolbar figure.preview[data-figure-id='" + $(this).attr('data-figure-id') + "']");
				content.show().addClass('active');
				$('#toolbar .figure-nav').show();
				$('#toolbar').animate({height: content.height() + $('#toolbar-handle').height()}, 'fast');
			});

			// When going back to the grid, hide the current preview and replace the close button
			$('.back-to-grid').click(function() {
				$('#toolbar').animate({
					height: $('.figure-browser').height() + $('#toolbar-handle').height()
				}, 
				'fast', 
				function() {
					$('#toolbar figure.preview').hide().removeClass('active');
					$('#toolbar .figure-nav').hide();					
					$('#toolbar .figure-browser').show();				
					$('#toolbar-close').show();
				}	
				);
			});

			$('#toolbar .figure-nav .next').click(function() {
				var new_fig = $('#toolbar figure.preview.active').hide().removeClass('active').next('figure.preview');
				if (new_fig.length == 0) {
					new_fig = $('#toolbar figure.preview').first();
				}
				new_fig.show().addClass('active');
			});

			$('#toolbar .figure-nav .prev').click(function() {
				var new_fig = $('#toolbar figure.preview.active').hide().removeClass('active').prev('figure.preview');
				if (new_fig.length == 0) {
					new_fig = $('#toolbar figure.preview').last();
				}
				new_fig.show().addClass('active');				
			});



			return this;
		}
	});
});