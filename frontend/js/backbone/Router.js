// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.router = Backbone.Router.extend({
	
		routes: {
			'' : 'root',
			'section/:section_id' : 'section' // TODO: add params for paragraph, etc.
		},
	
		initialize: function() {
			app.dispatcher.on('layoutComplete', function(section) {

				//TODO: router should decide if going to a selector or the first page
				app.dispatcher.trigger("navigate", {page: 1});
			}, this);
		},
	
		/**
		 * Route to root location
		 */
		root: function() {
			app.dispatcher.trigger('routedToRoot');
		},
	
		/**
		 * Route to the given section
		 */
		section: function(section_id) {
			app.dispatcher.trigger('routedToSection', section_id);
		},
	
		/**
		 * Route to search
		 */
		search: function(query) {
			app.dispatcher.trigger('routedToSearch', query);
		}
	});
});