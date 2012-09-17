jQuery(document).ready(function() {
	var $ = jQuery;
	
	// pull the figure from the body
	var figure = $('figure');
	
	// empty the body
	$('body').empty();
	
	// reinject the figure into the body
	figure.appendTo('body');
	
	// initialize the conservation asset
	new ConservationAsset($('.conservation-asset')[0]);
	
});