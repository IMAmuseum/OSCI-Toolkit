/*
 * OSCI Toolkit - v0.1.0 - 2012-05-01
 * http://oscitoolkit.org/
 * Copyright (c) 2010-2012 The Art Institute of Chicago and the Indianapolis Museum of Art
 * GNU General Public License
 */

// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.BaseCollection = Backbone.Collection.extend();
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.Figures = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Figure,
	
	initialize: function() {
		app.dispatcher.bind('figuresAvailable', function(figures) {
			console.log('figuresAvailable', figures);
			this.populateFromMarkup(figures);
		}, this);
	},

	comparator: function(figure) {
		return figure.get('delta');
	},
	
	/**
	 * Populates the collection from an array of figure markup
	 */
	populateFromMarkup: function(data) {
		_.each(data, function(markup) {
			var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
			var figure = {
				id:         markup.id,
				rawData:    markup,
				body:       markup.innerHTML,
				section_id: idComponents[1],
				delta:      idComponents[2],
				title:      $(markup).attr('title'),
				caption:    $('figcaption', markup).html(),
				position:   $(markup).attr('data-position'),
				columns:    $(markup).attr('data-columns'),
				options:    JSON.parse($(markup).attr('data-options')),
				thumbnail_url: null, // TODO: set to a default?
				preview_url: null
			};
			var image = $('.figure_content img', markup);
			if (image.length) {
				figure.thumbnail_url = image.attr('src');
				figure.preview_url = image.attr('src');
			}

			this.add(figure);
		}, this);
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.Footnotes = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Footnote,
	
	initialize: function() {
		app.dispatcher.bind('footnotesAvailable', function(footnotes) {
			this.populateFromMarkup(footnotes);
		}, this);
	},
	
	populateFromMarkup: function(data) {
		_.each($('aside', data), function(markup) {
			var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
			var footnote = {
				id:         markup.id,
				rawData:    markup,
				body:       markup.innerHTML,
				section_id: idComponents[1],
				delta:      idComponents[2]
			};
			this.add(footnote);
		}, this);
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.NavigationItems = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.NavigationItem,
	currentNavigationItem: null,
	initialize: function() {
		// bind packageLoaded to build navigation model
		app.dispatcher.on('packageLoaded', function(packageModel) {
			var nav = _.find(packageModel.get('manifest').item, function(item){
				return item.properties == 'nav';
			});
			if (nav)
			{
				// load nav doc
				// TODO: ERROR CHECK THE RETURNED XML
				var data = xmlToJson(loadXMLDoc(nav.href));
				// parse the toc and index
				var navDocument = data.html[1].body.nav;
				for (var i in navDocument) {
					if (navDocument[i].type == 'toc') {
						_.each(navDocument[i].ol.li, function(tocItem) {
							this.parseChildren(tocItem, null, 0);
						}, this);
						break;
					}
				}
				
				app.dispatcher.trigger('navigationLoaded', this);
			}
		}, this);
		
		// bind routedToRoot
		app.dispatcher.on('routedToRoot', function() {
			this.goToBeginning();
		}, this);
		
		// bind routedToSection
		app.dispatcher.on('routedToSection', function(id) {
			this.setCurrentNavigationItem(this.get(id));
		}, this);
	},
	getCurrentNavigationItem: function(){
		return this.currentNavigationItem;
	},
	setCurrentNavigationItem: function(navItem) {
		this.currentNavigationItem = navItem;
		app.dispatcher.trigger('currentNavigationItemChanged');
	},
	goToBeginning: function() {
		if (this.at(0)) {
			this.setCurrentNavigationItem(this.at(0));
		}
	},
	parseChildren: function(item, parent, depth) {
		var parsedItem = {
			id: item.a['data-section_id'],
			parent: parent,
			depth: depth,
			previous: this.at(this.length - 1),
			next: undefined,
			length: item.a['data-length'],
			title: item.a['value'],
			subtitle: item.a['data-subtitle'],
			thumbnail: item.a['data-thumbnail'],
			timestamp: item.a['data-timestamp'],
			uri: item.a['href']
		};
		this.add(parsedItem);
		
		var navItem = this.at(this.length - 1);
		if (navItem.get('previous') !== undefined) {
			navItem.get('previous').set('next', navItem);
		}
		// if 'ol' tag is present, sub sections exist, process:
		if (item.ol && item.ol.li) {
			var items;
			// due to the way the xml is parsed, it comes back as an array or a direct object
			if (typeof(item.ol.li.length) != 'undefined') {
				items = item.ol.li;
			}
			else {
				items = [item.ol.li];
			}
			_.each(items, function(item2) {
				this.parseChildren(item2, navItem, ++depth);
			}, this);
		}
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.Notes = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Note,
	initialize: function() {
		this.on('change', function() {
			app.dispatcher.trigger('notesChanged');
		});
		app.dispatcher.on('currentNavigationItemChanged', function(section) {
			var navItem = app.collections.navigationItems.getCurrentNavigationItem();
			//TODO: Refactor once Gray cleans up the NavigationItemModel
			if (navItem.id) {
				app.collections.notes.getNotesForSection(navItem.id);
			}
		}, this);
	},
	parse: function(response) {
		if (response.success) {
			// return response.notes;
			return response.notes;
		}
		else {
			return false;
		}
	},
	getNotesForSection: function(sectionId) {
		// make an api call to get the notes for the current user and section
		$.ajax({
			url: app.config.get('endpoints').OsciTkNotes,
			data: {section_id: sectionId},
			type: 'GET',
			dataType: 'json',
			success: function(data) {
				if (data.success === true) {
					// notes were returned, set to the notes collection
					app.collections.notes.reset(data.notes);
				}
			}
		});
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.Pages = OsciTk.collections.BaseCollection.extend({
	model : OsciTk.models.Page,
	initialize : function() {

	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.SearchResults = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.SearchResult
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

OsciTk.collections.Pages = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Page
});
//this file should only be included when developing and not in production
var originalBackboneTrigger = Backbone.Events.trigger;
Backbone.Events.trigger = function() {
	console.log(arguments, "Event Triggered");
	originalBackboneTrigger.apply(this, arguments);
};
String.prototype.replaceArray = function(find, replace) {
	var replaceString = this;
	for (var i = 0; i < find.length; i++) {
		replaceString = replaceString.replace(find[i], replace);
	}
	return replaceString;
};

String.prototype.toCamel = function(){
    return this.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
		.replace(/\s/g, '')
		.replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};

/*
 * Retrieve attribute based on language
 */
function getAttributeByLanguage(attr) {
	var items = [];
	for(var i = 0; i < attr.length; i++) {
		// get language specific and language neutral
		if(!attr[i].lang || (attr[i].lang && attr[i].lang == tap.language)) {
			items.push(attr[i]);
		}
	}
	// return all items if no language matched
	if(items.length === 0) {
		items = attr;
	}
	return items;
}

/*
 * Load xml document
 */
function loadXMLDoc(url) {
	xhttp = new XMLHttpRequest();
	xhttp.open('GET', url, false);
	xhttp.send();
	return xhttp.responseXML;
}

/*
 * Attempt to make the variable an array
 */
function objectToArray(obj) {
	if(obj === undefined) return;
	return Object.prototype.toString.call(obj) !== '[object Array]' ? [obj] : obj;
}

/*
 * Convert xml to JSON
 */
function xmlToJson(xml, namespace) {
	var obj = true,
		i = 0;
	// retrieve namespaces
	if(!namespace) {
		namespace = ['xml:'];
		for(i = 0; i < xml.documentElement.attributes.length; i++) {
			if(xml.documentElement.attributes.item(i).nodeName.indexOf('xmlns') != -1) {
				namespace.push(xml.documentElement.attributes.item(i).nodeName.replace('xmlns:', '') + ':');
			}
		}
	}
	if (xml.nodeType === Node.TEXT_NODE) { // text
		obj = xml.nodeValue.replace(/^\s+|\s+$/g, '');
	} else {
		if (xml.nodeType === 1) { // element
			// do attributes
			if (xml.attributes.length > 0) {
				var attribute;
				obj = {};
				for (i = 0; i < xml.attributes.length; i++) {
					attribute = xml.attributes.item(i);
					obj[attribute.nodeName.replaceArray(namespace, '').toCamel()] = attribute.nodeValue;
				}
			}
		}

		// do children
		if (xml.hasChildNodes()) {
			var key, value, item;
			if (obj === true) { obj = {}; }
			for (i = 0; i < xml.childNodes.length; i++) {
				item = xml.childNodes.item(i);
				key = item.nodeType === 3 ? 'value' : item.nodeName.replaceArray(namespace, '').toCamel();
				value = xmlToJson(item, namespace);
				if(value.length !== 0 && key !== '#comment') { // ignore empty nodes and comments
					if (obj.hasOwnProperty(key)) {
						if(item.nodeType === 3) {
							obj[key] += value;
						} else {
							if (obj[key].constructor !== Array) {
								obj[key] = [obj[key]];
							}
							obj[key].push(value);
						}
					} else if (item.nodeType !== 3 || value !== '') {
						obj[key] = value;					}
				}
			}
		}
	}
	return(obj);
}
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Account = OsciTk.models.BaseModel.extend({
	defaults: {
		username: 'anonymous',
		id: 0
	},
	initialize: function() {
		// get current state
		this.getSessionState();
	},
	sync: function(method, model, options) {
		console.log(method, 'account sync');
	},
	getSessionState: function() {
		// alias this for use in success function
		var account = this;
		// ask server for session state
		$.ajax({
			url: app.config.get('endpoints').OsciTkAccount,
			data: {action: 'status'},
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				if (data.success === true) {
					account.set(data.user);
				}
			}
		});
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.BaseModel = Backbone.Model.extend();
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Config = OsciTk.models.BaseModel.extend({});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Figure = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			section_id: null,
			delta: null,
			caption: null,
			position: null,
			columns: null,
			body: null,
			options: {}
		};
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Footnote = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			body: '',
			section_id: '',
			delta: ''
		};
	},
	
	sync: function(method, model, options) {
		console.log('Footnote.sync: ' + method);
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.NavigationItem = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			title: null,
			subtitle: null,
			uri: null,
			parent: null,
			next: null,
			previous: null,
			depth: 0,
			thumbnail: null,
			timestamp: null
		};
	},
	initialize: function() {
		
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Note = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			id: null,
			note: null,
			section_id: null,
			paragraph_id: null,
			tags: []
		};
	},
	
	initialize: function(attributes, options) {
		this.bind('error', function(model, error) {
			console.log([model, error], 'error fired');
		});
	},

	sync: function(method, model, options) {
		var endpoint = app.config.get('endpoints').OsciTkNote;
		
		console.log('Note.sync: ' + method);
		console.log(model, 'model');
		console.log(options, 'options');

		if (method == 'create') {
			// convert the model attributes to standard form encoding
			options.data = this.urlFormEncode(model);
			// all responses are successful by design, check the returned success attribute for real status
			// and properly error if necessary
			options.success = function(data, textStatus, jqXHR) {
				var response = JSON.parse(data);
				if (!response.success) {
					options.error(model, jqXHR);
				}
			};
			options.type = 'POST';
			$.ajax(endpoint, options);
		}

		if (method == 'update') {
			options.data = this.urlFormEncode(model);
			options.success = function(data, textStatus, jqXHR) {
				var response = JSON.parse(data);
				console.log(response, 'update response');
				if (!response.success) {
					options.error(model, jqXHR);
				}
			};
			options.type = 'POST';
			$.ajax(endpoint, options);
		}

		if (method == 'delete') {
			options.data = this.urlFormEncode(model);
			options.data = options.data + 'delete=1';
			options.type = 'POST';
			options.success = function(data, textStatus, jqXHR) {
				var response = JSON.parse(data);
				console.log(response, 'delete response');
				if (!response.success) {
					options.error(model, jqXHR);
				}
			};
			$.ajax(endpoint, options);
		}
	},
	
	urlFormEncode: function(model) {
		var data = '';
		for (var key in model.attributes) {
			if ($.isArray(model.attributes[key])) {
				for (var element in model.attributes[key]) {
					data = data + key + '[]=' + model.attributes[key][element] + '&';
				}
			}
			else {
				data = data + key + '=' + model.attributes[key] + '&';
			}
		}
		return data;
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Package = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			url: null,
			lang: null,
			spine: null,
			manifest: null,
			metadata: null,
			id: null,
			version: null,
			xmlns: null
		};
	},

	initialize: function() {
		// TODO: ERROR CHECK THE RETURN XML
		var data = xmlToJson(loadXMLDoc(this.get('url')));

		this.set('lang', data['package'].lang);
		this.set('spine', data['package'].spine);
		this.set('manifest', data['package'].manifest);
		this.set('metadata', data['package'].metadata);
		this.set('id', data['package']['unique-identifier']);
		this.set('version', data['package'].version);
		this.set('xmlns', data['package'].xmlns);
		
		app.dispatcher.trigger('packageLoaded', this);
	},
	
	sync: function(method, model, options) {
		console.log('Package.sync: ' + method);
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Page = OsciTk.models.BaseModel.extend({

	defaults: function() {
		return {
			content : []
		};
	},

	addContent : function(newContent) {
		var content = this.get('content');
		content.push(newContent);

		return this;
	},

	removeContentAt : function(index) {
		var content = this.get('content');
		content.splice(index, 1);

		return this;
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.SearchResult = OsciTk.models.BaseModel.extend({
	
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initialization //

OsciTk.models.Section = OsciTk.models.BaseModel.extend({
	idAttribute: "data-section_id",

	defaults: function() {
		return {
			title: null,
			content: null,
			uri: null,
			media_type: 'application/xhtml+xml',
			contentLoaded: false,
			pages: new OsciTk.collections.Pages()
		};
	},

	sync: function(method, model, options) {
		// console.log('OsciTkSection.sync: ' + method);
	},

	parse: function(response) {
		console.log('parse section');
	},
	
	loadContent: function() {
		var content = null;
		if (this.get('contentLoaded') === false) {
			var data = (loadXMLDoc(this.get('uri')));

			content = $(data);
			this.set('title', data.title);
			this.set('content', content);
			this.set('contentLoaded', true);
		}

		if (content === null) {
			content = $(this.get('content'));
		}
		
		// parse out footnotes and figures, make them available via event
		var footnotes = content.find('section#footnotes');
		var figures   = content.find('figure');
		app.dispatcher.trigger('footnotesAvailable', footnotes);
		app.dispatcher.trigger('figuresAvailable', figures);
		app.dispatcher.trigger('sectionLoaded', this);
	},

	removeAllPages : function() {
		this.set('pages', new OsciTk.collections.Pages());
	}
});
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
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

OsciTk.views.Account = OsciTk.views.BaseView.extend({
	className: 'account-view',
	template: null,
	initialize: function() {
		this.model = app.account;
	},
	render: function() {
		// determine if user is logged in.  Show login form or user details
		if (this.model.get('id') > 0) {
			this.showProfile();
		}
		else {
			this.showLoginForm();
		}
	},
	events: {
		'click button.login': 'login',
		'click button.register': 'register',
		'click a.register': 'showRegistrationForm',
		'click a.login': 'showLoginForm',
		'click a.logout': 'logout'
	},
	login: function() {
		// alias this for use in ajax callbacks
		var accountView = this;
		// get user/pass from form
		var username = this.$el.find('#username').val();
		var password = this.$el.find('#password').val();
		// send login request
		$.ajax({
			url: app.config.get('endpoints').OsciTkAccount,
			data: {action: 'login', username: username, password: password},
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				if (data.success === true) {
					// user was logged in, set the returned user data
					accountView.model.set(data.user);
					accountView.showProfile();
				}
				else {
					// user was not logged in, show error
					accountView.$el.find('div.form-error').html(data.error);
				}
			}
		});
	},
	logout: function() {
		// alias this for use in ajax callback
		var accountView = this;
		$.ajax({
			url: app.config.get('endpoints').OsciTkAccount,
			data: {action: 'logout'},
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				accountView.model.set(data.user);
				accountView.showLoginForm();
			}
		});
	},
	register: function() {
		// alias for callbacks
		var accountView = this;
		// get user/pass from form
		var username = this.$el.find('#username').val();
		var password = this.$el.find('#password').val();
		var email = this.$el.find('#email').val();
		// send registration request
		$.ajax({
			url: app.config.get('endpoints').OsciTkAccount,
			data: {action: 'register', username: username, password: password, email: email},
			type: 'POST',
			dataType: 'json',
			success: function(data) {
				if (data.success === true) {
					// user was logged in, set the returned user data
					accountView.model.set(data.user);
					accountView.showProfile();
				}
				else {
					// user was not logged in, show error
					accountView.$el.find('div.form-error').html(data.error);
				}
			}
		});
	},
	showRegistrationForm: function() {
		this.template = _.template($('#template-account-register').html());
		this.$el.html(this.template());
	},
	showLoginForm: function() {
		this.template = _.template($('#template-account-login').html());
		this.$el.html(this.template());
	},
	showProfile: function() {
		this.template = _.template($('#template-account-profile').html());
		this.$el.html(this.template(this.model.toJSON()));
	}
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.App = OsciTk.views.BaseView.extend({
		id: 'reader',
		template: _.template($('#template-app').html()),
		
		initialize: function() {
			$('body').append(this.el);
			
			// draw main interface
			this.render();
			
			// Add the toolbar to the appView
			app.views.toolbarView = new OsciTk.views.Toolbar();
			this.addView(app.views.toolbarView);

			//set the default section view
			var sectionViewClass = OsciTk.views.Section;

			//allow a custom section view to be used
			if (app.config.get('sectionView') && OsciTk.views[app.config.get('sectionView')]) {
				sectionViewClass = OsciTk.views[app.config.get('sectionView')];
			}
			var sectionViewOptions = {};
			if (app.config.get('sectionViewOptions')) {
				sectionViewOptions = app.config.get('sectionViewOptions');
			}
			app.views.sectionView = new sectionViewClass(sectionViewOptions);
			this.addView(app.views.sectionView);

			// Add the navigation view to the AppView
			app.views.navigationView = new OsciTk.views.Navigation();
			this.addView(app.views.navigationView);
		},
		
		render: function() {
			this.$el.html(this.template());
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

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
	removeView: function(view) {
		if (this.childViews) {
			for (var i = 0, len = this.childViews.length; i < len; i++) {
				if (view.cid === this.childViews[i].cid) {
					this.childViews.splice(i, 1);
					view.close();
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
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

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

			// Set the width of the figure reel if there is more than one thumbnail
			if (fig_data.length > 1) {
				var thumbs = $('#toolbar figure.thumbnail');
				$('#toolbar .figure-browser .figure-reel').width(thumbs.length * (thumbs.outerWidth(true)));
			}

			// When the reader clicks on a figure thumbnail, show the preview for that figure...
			$('#toolbar figure.thumbnail').click(function() {
				$('#toolbar .figure-browser').hide();
				$('#toolbar .figure-previews figure.active').hide().removeClass('active');
				var content = $("#toolbar figure.preview[data-figure-id='" + $(this).attr('data-figure-id') + "']");
				content.show().addClass('active');
				OsciTk.views.Figures.prototype.displayTitle();
				$('#toolbar .figure-previews').show();
				$('#toolbar').animate({height: $('#toolbar-content').height() + $('#toolbar-handle').height()}, 'fast');
			});

			// When going back to the grid, hide the current preview and replace the close button
			$('.back-to-grid').click(function() {
				$('#toolbar').animate({
					height: $('.figure-browser').height() + $('#toolbar-handle').height()
				},
				'fast',
				function() {
					$('#toolbar .figure-previews').hide();
					$('#toolbar .figure-browser').show();
				}
				);
			});

			$('#toolbar .figure-nav.next').click(function() {
				var new_fig = $('#toolbar figure.preview.active').hide().removeClass('active').next('figure.preview');
				if (new_fig.length === 0) {
					new_fig = $('#toolbar figure.preview').first();
				}
				new_fig.show().addClass('active');
				OsciTk.views.Figures.prototype.displayTitle();
			});

			$('#toolbar .figure-nav.prev').click(function() {
				var new_fig = $('#toolbar figure.preview.active').hide().removeClass('active').prev('figure.preview');
				if (new_fig.length === 0) {
					new_fig = $('#toolbar figure.preview').last();
				}
				new_fig.show().addClass('active');
				OsciTk.views.Figures.prototype.displayTitle();
			});

			return this;
		},
		displayTitle: function() {
			var id = $('#toolbar figure.preview.active').attr('data-figure-id');
			var figure = app.collections.figures.get(id);
			$('#toolbar h2 span.title').html(figure.get('title'));
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Font = OsciTk.views.BaseView.extend({
		className: 'font-view',
		template: _.template($('#template-font').html()),
		initialize: function() {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.MultiColumnPage = OsciTk.views.Page.extend({
		template : _.template($('#template-multi-column-page').html()),
		columnTemplate : _.template($('#template-multi-column-column').html()),
		onClose: function() {
			this.model = undefined;
		},
		render : function() {
			if (this.processingData.rendered) {
				return this;
			}

			this.$el.html(this.template());

			//size the page to fit the view window
			this.$el.css({
				width: this.parent.dimensions.innerPageWidth,
				height: this.parent.dimensions.innerPageHeight
			});

			this.processingData.columns = [];
			for (var i = 0; i < this.parent.dimensions.columnsPerPage; i++) {
				this.processingData.columns[i] = {
					height : this.parent.dimensions.innerPageHeight,
					heightRemain : this.parent.dimensions.innerPageHeight,
					'$el' : null,
					offset : 0
				};
			}
			this.processingData.currentColumn = 0;

			//set rendered flag so that render does not get called more than once while iterating over content
			this.processingData.rendered = true;

			return this;
		},
		layoutContent : function() {
			var column = this.getCurrentColumn();

			var content = $(this.model.get('content')[(this.model.get('content').length - 1)]);

			column.$el.append(content);

			var lineHeight = parseFloat(content.css("line-height"));

			//If all of the content is overflowing the column remove it and move to next column
			if ((column.height - content.position().top) < lineHeight) {
				content.remove();
				column.heightRemain = 0;
				return true;
			}

			var contentHeight = content.outerHeight(true);

			//If offset defined (should always be negative) add it to the height of the content to get the correct top margin
			var offset = 0;
			if (column.offset < 0) {
				offset = contentHeight + column.offset;

				//Set the top margin
				content.css("margin-top", "-" + offset + "px");

				//remove the offset so that all items are not shifted up
				column.offset = 0;
			}

			//find figure references and process the figure
			var figureLinks = content.find("a.figure_reference:not(.processed)");
			//console.log(figureLinks, 'figureLinks');
			if (figureLinks.length) {
				
			}

			var contentMargin = {
				top : parseInt(content.css("margin-top"), 10),
				bottom : parseInt(content.css("margin-bottom"), 10)
			};

			//Update how much vertical height remains in the column
			var heightRemain = column.heightRemain - content.outerHeight(true);
			if (heightRemain > 0 && heightRemain < lineHeight) {
				heightRemain = 0;
			} else if (heightRemain < 0 && heightRemain >= (contentMargin.bottom * -1)) {
				heightRemain = 0;
			}

			//If we have negative height remaining, the content must be repeated in the next column
			var overflow = false;
            if (heightRemain < 0) {
                var overflowHeight = heightRemain ,
					hiddenLines = Math.ceil(overflowHeight / lineHeight),
					newHeight = content.position().top + content.outerHeight() + (hiddenLines * lineHeight);

				//assign the new height to remove any partial lines of text
				column.height = newHeight;
				column.$el.height(newHeight + "px");

				if (hiddenLines === 0) {
					heightRemain = 0;
					overflow = false;
				} else {
					heightRemain = (hiddenLines * lineHeight) - contentMargin.bottom;
					overflow = true;
				}

                if (this.processingData.currentColumn === (this.parent.dimensions.columnsPerPage - 1)) {
					this.processingComplete();
                }
            }

            if (heightRemain === 0 && this.processingData.currentColumn === (this.parent.dimensions.columnsPerPage - 1)) {
				this.processingComplete();
            }

            column.heightRemain = heightRemain;

			return overflow;
		},

		getCurrentColumn : function() {
			var currentColumn = null;

			if (this.processingData.columns[this.processingData.currentColumn] && this.processingData.columns[this.processingData.currentColumn].heightRemain > 0) {
				currentColumn = this.processingData.columns[this.processingData.currentColumn];
			} else {
				for(var i = 0; i < this.parent.dimensions.columnsPerPage; i++) {
					if (this.processingData.columns[i].heightRemain > 0) {
						currentColumn = this.processingData.columns[i];
						this.processingData.currentColumn = i;
						break;
					}
				}
			}

			if (currentColumn !== null && currentColumn.$el === null) {
				if (this.processingData.currentColumn > 0) {
					currentColumn.offset = this.processingData.columns[(this.processingData.currentColumn - 1)].heightRemain;
				} else {
					var previousPage = this.parent.getChildViewByIndex(this.parent.getChildViews().length - 2);
					if (previousPage) {
						currentColumn.offset = previousPage.processingData.columns[previousPage.processingData.columns.length - 1].heightRemain;
					}
				}

				var columnCss = {
					width : this.parent.dimensions.columnWidth + "px",
					height : currentColumn.height + "px",
					left : (this.processingData.currentColumn * this.parent.dimensions.columnWidth) + (this.parent.dimensions.gutterWidth * this.processingData.currentColumn)
				};

				currentColumn.$el = $(this.columnTemplate())
					.appendTo(this.$el)
					.addClass('column-' + this.processingData.currentColumn)
					.css(columnCss);
			}

			return currentColumn;
		}
	});
});

// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.MultiColumnSection = OsciTk.views.Section.extend({

		initialize: function() {
			this.options.pageView = 'MultiColumnPage';

			app.dispatcher.on("windowResized", function() {
				this.removeAllChildViews();
				this.model.removeAllPages();
				this.render();
			}, this);

			this.$el.addClass("oscitk_multi_column");

			//set the default options
			_.defaults(this.options, {
				minColumnWidth : 200,
				maxColumnWidth : 300,
				gutterWidth : 40,
				minLinesPerColumn : 5
			});

			//initialize dimensions object
			this.dimensions = {};

			OsciTk.views.MultiColumnSection.__super__.initialize.call(this);
		},

		renderContent: function() {
			//add the template to the page
			this.$el.html(this.template());

			this.calculateDimensions();

			//setup location to store layout housekeeping information
			this.layoutData = {
				data : this.model.get('content'),
				items : null
			};

			//remove unwanted sections & parse sections
			this.cleanData();

			this.layoutData.items = this.layoutData.data.length;

			var i = 0;
			while(this.layoutData.items > 0) {
				var pageView = this.getPageForProcessing();

				if (!pageView.processingData.rendered) {
					pageView.render();
				}

				var overflow = pageView.addContent($(this.layoutData.data[i]).clone()).layoutContent();

				if (!overflow) {
					i++;
					this.layoutData.items--;
				}
			}
		},

		calculateDimensions: function() {
			var dimensions = this.dimensions;

			//get window height / width
			var windowWidth = $(window).width(),
				windowHeight = $(window).height();

			//if the window size did not change, no need to recalculate dimensions
			if (dimensions.windowWidth && dimensions.windowWidth === windowWidth && dimensions.windowHeight && dimensions.windowHeight === windowHeight) {
				return;
			}

			//cache the window height/width
			dimensions.windowHeight = windowHeight;
			dimensions.windowWidth = windowWidth;

			//copy gutter width out of the options for easy access
			dimensions.gutterWidth = this.options.gutterWidth;

			//get the margins of the section container
			dimensions.pageMargin = {
				left : parseInt(this.$el.css("margin-left"), 10),
				top : parseInt(this.$el.css("margin-top"), 10),
				right : parseInt(this.$el.css("margin-right"), 10),
				bottom : parseInt(this.$el.css("margin-bottom"), 10)
			};

			//get the padding of the section container
			dimensions.pagePadding = {
				left : parseInt(this.$el.css("padding-left"), 10),
				top : parseInt(this.$el.css("padding-top"), 10),
				right : parseInt(this.$el.css("padding-right"), 10),
				bottom : parseInt(this.$el.css("padding-bottom"), 10)
			};

			//determine the correct height for the section container to eliminate scrolling
			dimensions.outerPageHeight = windowHeight - dimensions.pageMargin.top - dimensions.pageMargin.bottom;
			dimensions.innerPageHeight = dimensions.outerPageHeight - dimensions.pagePadding.top - dimensions.pagePadding.bottom;

			//determine the correct width for the section container
			dimensions.outerPageWidth = this.$el.outerWidth();
			dimensions.innerPageWidth = dimensions.outerPageWidth - dimensions.pagePadding.left - dimensions.pagePadding.right;

			//column width
			if (dimensions.innerPageWidth < this.options.maxColumnWidth) {
				dimensions.columnWidth = dimensions.innerPageWidth;
			} else {
				dimensions.columnWidth = this.options.maxColumnWidth;
			}

			//Determine the number of columns per page
			dimensions.columnsPerPage = Math.floor(dimensions.innerPageWidth / dimensions.columnWidth);
			if (dimensions.innerPageWidth < (dimensions.columnsPerPage * dimensions.columnWidth) + ((dimensions.columnsPerPage - 1) * this.options.gutterWidth))
			{
				dimensions.columnsPerPage = dimensions.columnsPerPage - 1;
			}

			//Large gutters look ugly... reset column width if gutters get too big
			var gutterCheck = (dimensions.innerPageWidth - (dimensions.columnsPerPage * dimensions.columnWidth)) / (dimensions.columnsPerPage - 1);
			if (gutterCheck > this.options.gutterWidth) {
				dimensions.columnWidth = (dimensions.innerPageWidth - (this.options.gutterWidth * (dimensions.columnsPerPage - 1))) / dimensions.columnsPerPage;
			}

			this.dimensions = dimensions;
			//set the height of the container
			//dont need this if styled correctly I think
			//this.$el.height(dimensions.pageHeight);
		},

		cleanData: function() {
			//remove the figure section
			this.layoutData.data.find("#figures").remove();

			//remove the footnotes section
			this.layoutData.data.find("#footnotes").remove();

			//remove any inline figures and replace with references
			var inlineFigures = this.layoutData.data.find("figure");
			if (inlineFigures.length) {
				var figureRefTemplate = _.template($('#template-figure-reference').html());

				for(var i = 0, len = inlineFigures.length; i < len; i++) {
					var figure = $(inlineFigures[i]);
					var figureData = {
						id : figure.attr("id"),
						title : figure.attr("title")
					};

					figure.replaceWith(figureRefTemplate(figureData));
				}
			}

			//chunk the data into managable parts
			this.layoutData.data = this.layoutData.data.find('section').children();
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Navigation = OsciTk.views.BaseView.extend({
		id: 'navigation',
		template: _.template($('#template-navigation').html()),
		initialize: function() {
			// when section is loaded, render the navigation control
			app.dispatcher.on('layoutComplete', function(section) {
				this.numPages = section.numPages;
				this.render();
			}, this);
		},
		render: function() {
			this.$el.html(this.template({numPages: this.numPages}));
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Notes = OsciTk.views.BaseView.extend({
		className: 'notes-view',
		template: _.template($('#template-notes').html()),
		initialize: function() {
			// re-render this view when collection changes
			app.collections.notes.bind('add remove', function() {
				this.render();
			}, this);
		},
		render: function() {
			this.$el.html(this.template({notes: app.collections.notes.toJSON()}));
			return this;
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Page = OsciTk.views.BaseView.extend({
		template: _.template($('#template-page').html()),
		className: "page",
		initialize: function() {
			this.processingData = {
				complete : false
			};

			this.$el.addClass("page-num-" + this.model.collection.length)
					.attr("data-page_num", this.model.collection.length);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));

			return this;
		},
		processingComplete : function() {
			this.processingData.complete = true;
			return this;
		},
		addContent : function(newContent) {
			this.model.addContent(newContent);

			return this;
		},
		hasContent : function(hasContent) {
			return this.model.get('content').length ? true : false;
		},
		isPageComplete : function() {
			return this.processingData.complete;
		}
	});
});

// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.SearchResults = OsciTk.views.BaseView.extend({
		id: 'search-results-container',
		template: _.template($('#template-search-results').html()),
		initialize: function(response) {
			console.log(response);
			this.searchResults = new OsciTk.collections.SearchResults({docs: response.docs});
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.SearchResult = OsciTk.views.BaseView.extend({
		id: 'search-results-container',
		template: _.template($('#template-search-results').html()),
		initialize: function(results) {
			this.render();
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Search = OsciTk.views.BaseView.extend({
		id: 'search-view',
		className: 'toolbar-item-view',
		template: _.template($('#template-search').html()),
		searchResults: new OsciTk.collections.SearchResults(),
		page: 0,
		query: '',
		filters: null,
		sort: null,
				
		initialize: function() {
			// add our search results collection to the global namespace for convenience
			if (app && app.collections) app.collections.searchResults = this.searchResults;
		},
		
		events: {
			'submit #search-form' : 'search'
		},
		
		render: function() {
			this.$el.html(this.template(this));
		},
		
		search: function(event) {
			// prevent the form from submitting
			event.preventDefault();
			var keyword = this.query = this.$el.find('#search-keyword').val();

			// send search query
			var searchView = this;
			$.ajax({
				url: app.config.get('endpoints')['OsciTkSearch'] + '?key=' + keyword + '&filters=type:note',
				type: 'POST',
				success: function(data) {
					var response = JSON.parse(data);
					// add the incoming docs to the searchResults collection
					_.each(response.docs, function(doc) {
						searchView.searchResults.add(doc);
					});
					// set the keyword to the collection
					searchView.searchResults.keyword = keyword;
					// re-render the search view
					searchView.render();
					searchView.parent.contentOpen();
				}
			});
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Section = OsciTk.views.BaseView.extend({
		id: 'section',
		template: _.template($('#template-section').html()),
		initialize: function() {

			_.defaults(this.options, {
				pageView : 'Page'
			});

			// bind sectionChanged
			app.dispatcher.on('currentNavigationItemChanged', function() {
				if (app.collections.navigationItems.getCurrentNavigationItem()) {
					// loading section content
					var navItem = app.collections.navigationItems.getCurrentNavigationItem();

					app.models.section = new OsciTk.models.Section({
						uri : navItem.get('uri')
					});

					app.models.section.loadContent();
					this.changeModel(app.models.section);
					this.removeAllChildViews();
					this.render();
				}
			}, this);
		},
		render: function() {
			app.dispatcher.trigger("layoutStart");

			this.renderContent();

			app.dispatcher.trigger("layoutComplete", {numPages : this.model.get('pages').length});

			return this;
		},
		onClose: function() {
			this.model.removeAllPages();
		},
		getPageForProcessing : function(id) {
			var page;

			if (id !== undefined) {
				page = this.getChildViewById(id);
			} else {
				page = _.filter(this.getChildViews(), function(page){
					return page.isPageComplete() === false;
				});

				if (page.length === 0) {
					this.model.get('pages').add({});

					page = new OsciTk.views[this.options.pageView]({
						model : this.model.get('pages').at(this.model.get('pages').length - 1)
					});
					this.addView(page);
				} else {
					page = page.pop();
				}
			}

			return page;
		},
		renderContent: function() {
			//add the template to the page
			this.$el.html(this.template());

			//basic layout just loads the content into a single page with scrolling
			var pageView = this.getPageForProcessing();

			//add the content to the view/model
			pageView.addContent(this.model.get('content').find('body').html());

			//render the view
			pageView.render();

			//mark processing complete (not necessary, but here for example)
			pageView.processingComplete();
		}
	});
});

// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Toc = OsciTk.views.BaseView.extend({
		className: 'toc-view',
		template: _.template($('#template-toc').html()),
		events: {
			'click li a': 'itemClick'
		},
		initialize: function() {
			this.parent = this.options.parent;
		},
		render: function() {
			this.$el.html(this.template({
				items: app.collections.navigationItems.where({depth: 0})
			}));
		},
		itemClick: function(event) {
			var sectionId = $(event.currentTarget).attr('data-section-id');
			// app.dispatcher.trigger('navigateToSection', sectionId);
			// TODO: don't really want to address the appRouter directly
			app.router.navigate("section/" + sectionId, {trigger: true});
			this.parent.contentClose();
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.ToolbarItem = OsciTk.views.BaseView.extend({
		className: 'toolbar-item',
		template: _.template($('#template-toolbar-item').html()),
		initialize: function() {
			// add a class to this element based on view button uses
			this.$el.addClass(this.options.toolbarItem.view + '-toolbar-item');
			// tracks the view to render in the content area when this view is clicked
			this.contentView = null;
			this.contentViewRendered = false;
		},
		events: {
			'click': 'itemClicked',
			'touch': 'itemClicked'
		},
		render: function() {
			this.contentView = new OsciTk.views[this.options.toolbarItem.view]({parent: this});
			this.parent.addView(this.contentView, '#toolbar-content');
			this.$el.html(this.template({
				text: this.options.toolbarItem.text
			}));
		},
		itemClicked: function() {
			if (!this.contentViewRendered) {
				this.contentView.render();
				this.contentViewRendered = true;
			}
			
			// content tab is closed.  assign active view and open
			if (this.parent.isContentOpen === false) {
				// the toolbar should know who the active view is
				this.parent.activeContentView = this.options.toolbarItem.view;
				// hide all the views besides this one
					var children = this.parent.$el.find('#toolbar-content').children().not('#' + this.contentView.id);
					_.each(children, function(otherView) {
						$(otherView).hide();
					}, this);
					this.contentView.$el.show();
				// animate the opening of the toolbar
				this.parent.contentOpen();
			}
			// content tab is open already
			else {
				// if active view is this one, close the panel
				if (this.parent.activeContentView == this.options.toolbarItem.view) {
					// closing the toolbar, so clear the active view
					this.parent.activeContentView = null;
					// animate the closing of the toolbar
					this.parent.contentClose();
				}
				// if this isn't the active view, assign active view and switch
				else {
					// the toolbar should know this is now the active view
					this.parent.activeContentView = this.options.toolbarItem.view;
					// hide all the views besides this one
					var children = this.parent.$el.find('#toolbar-content').children().not('#' + this.contentView.id);
					_.each(children, function(otherView) {
						$(otherView).hide();
					}, this);
					this.contentView.$el.show();
					// animate the switch
					this.parent.contentOpen();
				}
			}
		}
	});
});
// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initialization //

jQuery(function() {
	OsciTk.views.Toolbar = OsciTk.views.BaseView.extend({
		id: 'toolbar',
		template: _.template($('#template-toolbar').html()),
		initialize: function() {
			// if toolbar items were provided, store them in the view
			this.toolbarItems = app.config.get('toolbarItems') ? app.config.get('toolbarItems') : [];
			this.toolbarItemViews = [];
			// tracks the state of the content area drawer
			this.isContentOpen = false;
			this.render();
			$('#toolbar-close').live('click', function() {
				app.views.toolbarView.contentClose();
			});
		},
		render: function() {
			this.$el.html(this.template());
			_.each(this.toolbarItems, function(toolbarItem) {
				var item = new OsciTk.views.ToolbarItem({toolbarItem: toolbarItem});
				this.addView(item, '#toolbar-handle');
				item.render();
			}, this);
		},
		contentOpen: function() {
			var toolbarContent = this.$el.find('#toolbar-content');
			var toolbarHandleHeight = this.$el.find('#toolbar-handle').outerHeight();
			var toolbarHeight = toolbarContent.outerHeight() + toolbarHandleHeight;
			// console.log(toolbarHeight, 'toolbarHeight calculated');
			var toolbarMaxHeightPercentage = parseInt(this.$el.css('max-height'), 10);
			var toolbarMaxHeight = $(window).height() * (toolbarMaxHeightPercentage / 100);
			if (toolbarHeight > toolbarMaxHeight) {
				toolbarContent.height(toolbarMaxHeight - toolbarHandleHeight);
			}
			this.$el.animate({
				'height': toolbarHeight + 'px'
			}, 'fast', function() {
				$('#toolbar-close').show();
			});
			this.isContentOpen = true;
			
		},
		contentClose: function() {
			$('#toolbar-close').hide();
			this.$el.animate({
				'height': this.$el.find('#toolbar-handle').outerHeight() + 'px',
				'width': '100%'
			}, 'fast');
			this.isContentOpen = false;
		}
	});
});
app = {
	dispatcher : undefined,
	router : undefined,
	config : undefined,
	views : {},
	models : {},
	collections : {},

	bootstrap : function(config) {
		this.dispatcher = _.extend({}, Backbone.Events);
		this.config = new OsciTk.models.Config(config);
		this.router = new OsciTk.router();
		this.account = new OsciTk.models.Account();
		this.collections.notes = new OsciTk.collections.Notes();
		this.collections.figures = new OsciTk.collections.Figures();
		this.collections.footnotes = new OsciTk.collections.Footnotes();
		this.collections.navigationItems = new OsciTk.collections.NavigationItems();
		
		//setup window resizing, to trigger an event
		window.onresize = function() {
			if (window.resizeTimer) {
				clearTimeout(window.resizeTimer);
			}

			var onWindowResize = function(){
				app.dispatcher.trigger("windowResized");
			};

			window.resizeTimer = setTimeout(onWindowResize, 200);
		};
		
		// init main view
		this.views.app = new OsciTk.views.App();
		// load package document
		this.models.docPackage = new OsciTk.models.Package({url: this.config.get('packageUrl')});
	},

	run : function() {
		Backbone.history.start();
	}
};
