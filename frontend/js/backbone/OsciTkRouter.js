jQuery(function() {
	window.OsciTkRouter = Backbone.Router.extend({
	
		routes: {
			'' : 'root',
			'section/:section_id' : 'section', // TODO: add params for paragraph, etc.
			'search/:query' : 'search'
		},
	
		initialize: function(options) {
			console.log(options.package_url, 'router url');
			this.dispatcher = _.extend({}, Backbone.Events);
			options.dispatcher = this.dispatcher;
			window.appView = new OsciTkAppView(options);
		},
	
		/**
		 * Route to root location
		 */
		root: function() {
			console.log('routing to root');
			this.dispatcher.trigger('routedToRoot');
		},
	
		/**
		 * Route to the given section
		 */
		section: function(section_id) {
			console.log('routing to section ' + section_id);
			this.dispatcher.trigger('routedToSection', section_id);
		},
	
		/**
		 * Route to search
		 */
		search: function(query) {
			console.log('searching for ' + query);
			this.dispatcher.trigger('routedToSearch', query);
		}
	});
});