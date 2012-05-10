// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.router = Backbone.Router.extend({
	
		routes: {
			'' : 'routeToSection',
			'section/:section_id' : 'routeToSection',
			'section/:section_id/:identifier' : 'routeToSection'
		},
	
		routeToSection: function(section_id, identifier) {
			app.dispatcher.trigger('routedToSection', {section_id: section_id, identifier: identifier});
		}
	});
});