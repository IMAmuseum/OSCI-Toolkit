(function($) {

	$(document).ready(function() {
		
		$('#figures').append('<ul id="figure-links"></ul>');
		$('#figures figure').each(function() {
			
			$('#figure-links').append("<li><a class='figure-item' data-figure='" + this.id + "'>" + this.title + "</a></li>");			
			
		}).hide();
		
		$('.figure-item').click(function() {
			$('#' + $(this).attr('data-figure')).dialog({width: 'auto'});			
		});
		
	});
	
})(jQuery);
