/*
 * OSCI Toolkit - v0.1.0 - 2012-10-23
 * http://oscitoolkit.org/
 * Copyright (c) 2010-2012 The Art Institute of Chicago and the Indianapolis Museum of Art
 * GNU General Public License
 */

OsciTk = {};
OsciTk.collections = {};
OsciTk.models = {};
OsciTk.templates = {};
OsciTk.views = {
	figureTypeRegistry: {}
};
/*
 * Load xml document
 */
function loadXMLDoc(url) {
	xhttp = new XMLHttpRequest();
	xhttp.overrideMimeType('text/xml');
	xhttp.open('GET', url, false);
	xhttp.send();
	return xhttp.responseXML;
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

	var result = true;
	if (xml.attributes && xml.attributes.length > 0) {
		var attribute;
		result = {};
		for (var attributeID = 0; attributeID < xml.attributes.length; attributeID++) {
			attribute = xml.attributes.item(attributeID);
			result[attribute.nodeName.replaceArray(namespace, '').toCamel()] = attribute.nodeValue;
		}
	}
	if (xml.hasChildNodes()) {
		var key, value, xmlChild;
		if (result === true) { result = {}; }
		for (var child = 0; child < xml.childNodes.length; child++) {
			xmlChild = xml.childNodes.item(child);
			if ((xmlChild.nodeType & 7) === 1) {
				key = xmlChild.nodeName.replaceArray(namespace, '').toCamel();
				value = xmlToJson(xmlChild, namespace);
				if (result.hasOwnProperty(key)) {
					if (result[key].constructor !== Array) { result[key] = [result[key]]; }
					result[key].push(value);
				} else { result[key] = value; }
			} else if ((xmlChild.nodeType - 1 | 1) === 3) {
				key = 'value';
				value = xmlChild.nodeType === 3 ? xmlChild.nodeValue.replace(/^\s+|\s+$/g, '') : xmlChild.nodeValue;
				if (result.hasOwnProperty(key)) { result[key] += value; }
				else if (xmlChild.nodeType === 4 || value !== '') { result[key] = value; }
			}
		}
	}
	return(result);
}

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
OsciTk.templateManager = {
	get : function(templateName) {
		return function(data) {
			return OsciTk.templateManager.useTemplate(templateName, data);
		};
	},

	useTemplate: function(templateName, templateData) {
		if (OsciTk.templates[templateName] === undefined) {
			var templateUrls = app.config.get('templateUrls');
			var found = false;
			var numUrls = templateUrls.length;
			for(var i=0; i < numUrls; i++) {
				$.ajax({
					async : false,
					dataType : 'html',
					url : templateUrls[i] + templateName + '.tpl.html',
					success : function(data, textStatus, jqXHR) {
						OsciTk.templates[templateName] = _.template(data);
						found = true;
					}
				});
				if (found) break;
			}
		}
		return OsciTk.templates[templateName](templateData);
	}
};
OsciTk.collections.BaseCollection = Backbone.Collection.extend();
OsciTk.models.BaseModel = Backbone.Model.extend();
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
	removeView: function(view, close) {
		if (this.childViews) {
			for (var i = 0, len = this.childViews.length; i < len; i++) {
				if (view.cid === this.childViews[i].cid) {
					this.childViews.splice(i, 1);
					view.$el.detach();
					if (close || close === undefined) {
						view.close();
					}
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
	getChildViewsByType: function(type) {
		return _.filter(this.childViews, function(childView) {
			return childView.$el.is(type);
		});
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
OsciTk.templates['account-login'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h3>Login</h3>\n<div class="form-error"></div>\n<form id="account-form">\n\t<label for="username">Username:</label>\n\t<input type="text" id="username" placeholder="Username" />\n\t<label for="password">Password:</label>\n\t<input type="password" id="password" placeholder="Password" />\n\t<button type="button" class="login">Log In</button>\n\t<div><a href="#" class="register">Register an account</a></div>\n</form>';
}
return __p;
}
OsciTk.templates['account-profile'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h3>Profile</h3>\n<h4>'+
( username )+
'</h4>\n<h5>'+
( email )+
'</h5>\n<div><a href="#" class="logout">Log out</a></div>';
}
return __p;
}
OsciTk.templates['account-register'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h2>Register</h2>\n<div class="form-error"></div>\n<form id="account-form">\n\t<label for="username">Username:</label>\n\t<input type="text" id="username" placeholder="Username" />\n\t<label for="password">Password:</label>\n\t<input type="password" id="password" placeholder="Password" />\n\t<label for="email">Email:</label>\n\t<input type="text" id="email" placeholder="Email" />\n\t<button type="button" class="register">Register</button>\n\t<div><a href="#" class="login">Already have an account?</a></div>\n</form>';
}
return __p;
}
OsciTk.templates['citation'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="citations">\n\t<span>Format</span>\n\t<ul class="formats">\n\t\t<li class="active"><a href="#citation-format-chicago">Chicago</a></li>\n\t\t<li><a href="#citation-format-mla">MLA</a></li>\n\t</ul>\n\t<div id="citation-format-chicago" class="citation">\n\t\t'+
( creator )+
', "<em>'+
( title )+
'</em>," in <em>'+
( publicationTitle )+
'</em>, ed. '+
( editor )+
' '+
( publisher )+
' '+
( formattedDate )+
', para '+
( paragraphNumber )+
'.\n\t</div>\n\t<div id="citation-format-mla" style="display: none;" class="citation">\n\t\t'+
( creator )+
', "<em>'+
( title )+
'</em>," in <span style="text-decoration:underline;">'+
( publicationTitle )+
'</span>, ed. '+
( editor )+
' ('+
( publisher )+
'), '+
( formattedDate )+
', '+
( paragraphNumber )+
'.\n\t</div>\n</div>\n<div class="citation_url">\n\t<span>Citation URL</span>\n\t<input disabled="disabled" value="'+
( url )+
'" />\n</div>\n<div class="reference_text">\n\t<span>Reference Text</span>\n\t<textarea disabled="disabled">'+
( referenceText )+
'</textarea>\n</div>';
}
return __p;
}
OsciTk.templates['figure-reference'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<a href="#'+
( id )+
'" class="figure_reference">'+
( title )+
'</a>';
}
return __p;
}
OsciTk.templates['figures'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'figure-browser\'>\n\t<h3>Figures</h3>\n\t<div class=\'figure-tray\'>\n\t\t<div class=\'figure-reel\'>\n\t\t\t';
 _.each(figures, function(figure) {
;__p+='\n\t\t\t\t<figure class=\'thumbnail\' data-figure-id="'+
( figure.id )+
'">\n\t\t\t\t\t';
 if (figure.thumbnail_url != undefined) {
;__p+='\n\t\t\t\t\t\t<img class=\'figure-thumbnail\' src=\''+
( figure.thumbnail_url )+
'\'/>\n\t\t\t\t\t';
 } else {
;__p+='\n\t\t\t\t\t\t<div class=\'figure-thumbnail\'>&nbsp;</div>\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t\t<figcaption>'+
( figure.title )+
'</figcaption>\n\t\t\t\t</figure>\n\t\t\t';
 });
;__p+='\n\t\t</div>\n\t</div>\n</div>\n<div class=\'figure-previews\'>\n\t<div class=\'figure-nav prev\' title=\'Previous figure\'>&lt;</div>\n\t<div class=\'figure-nav next\' title=\'Next Figure\'>&gt;</div>\n\n\t<h3><span class=\'back-to-grid\'>&laquo; Figures</span> | <span class=\'title\'>TITLE</span></h3>\n\t<div class=\'figure-tray\'>\n\t\t<div class=\'figure-reel\'>\n\t\t\t';
 _.each(figures, function(figure) {
;__p+='\n\t\t\t\t<figure class=\'preview\' data-figure-id="'+
( figure.id )+
'">\n\t\t\t\t\t';
 if (figure.thumbnail_url != undefined) {
;__p+='\n\t\t\t\t\t\t<img class=\'figure-preview\' src=\''+
( figure.thumbnail_url )+
'\'/>\n\t\t\t\t\t';
 } else {
;__p+='\n\t\t\t\t\t\t<div class=\'figure-preview\'>&nbsp;</div>\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t\t<div class=\'figure-info\'>\n\t\t\t\t\t\t<!--<h3 class=\'title\'>Figure Title?</h3>-->\n\t\t\t\t\t\t<!--<p class=\'meta-info\'>meta info | more meta</p>-->\n\t\t\t\t\t\t<div class=\'caption\'>\n\t\t\t\t\t\t\t'+
( figure.caption )+
'\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<a class=\'view-fullscreen\'>View fullscreen</a>\n\t\t\t\t\t<a class=\'view-in-context\'>View in context</a>\n\t\t\t\t</figure>\n\t\t\t';
 });
;__p+='\n\t\t</div>\n\t</div>\n</div>';
}
return __p;
}
OsciTk.templates['font'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h3>Reading Settings</h3>\n<div class="font-control">\n\t<h3>Font Size</h3>\n\t<a href="#font-larger" class="larger font-button">A</a>\n\t<a href="#font-smaller" class="smaller font-button">A</a>\n</div>\n<div class="theme-control">\n\t<h3>Theme</h3>\n\t<a href="#normal" class="theme-button">Normal</a>\n\t<a href="#sepia" class="theme-button">Sepia</a>\n\t<a href="#night" class="theme-button">Night</a>\n</div>';
}
return __p;
}
OsciTk.templates['multi-column-column'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="column"></div>';
}
return __p;
}
OsciTk.templates['multi-column-figure'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class="figure_content"></div>\n<figcaption>'+
( caption )+
'</figcaption>';
}
return __p;
}
OsciTk.templates['multi-column-section'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="pages"></div>';
}
return __p;
}
OsciTk.templates['navigation'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div class=\'header\'>'+
( chapter )+
'</div>\n<div class=\'prev-page side\'><div class=\'indicator\'>&lt;</div></div>\n<div class=\'next-page side\'><div class=\'indicator\'>&gt;</div></div>\n<div class=\'prev-page corner\'>\n\t<div class=\'label\'>Previous</div>\n\t<div class=\'button\'>&nbsp;</div>\n</div>\n<div class=\'pager\'><div class=\'head\'>&nbsp;</div></div>\n<div class=\'next-page corner\'>\n\t<div class=\'label\'>Next</div>\n\t<div class=\'button\'>&nbsp;</div>\n</div>';
}
return __p;
}
OsciTk.templates['note-popup'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<form class="noteForm">\n\t<textarea>'+
( note )+
'</textarea>\n\t<div class="status">Saved</div>\n</form>\n<div class="reference-text">\n\t<span class="reference-text-label">Reference Text</span>\n\t<div class="reference-text-content">'+
( referenceContent )+
'</div>\n</div>';
}
return __p;
}
OsciTk.templates['notes'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h3>Notes</h3>\n<div class="notesReel">\n\t<ul class="notesList">\n\t\t';
 _.each(notes, function(note) {
;__p+='\n\t\t\t<li class="notesListItem">\n\t\t\t\t<div class="the-note">\n\t\t\t\t\t<span class="note-content">'+
( note.get('note') )+
'</span>\n\t\t\t\t</div>\n\t\t\t\t';
 if (note.get('tags').length > 0) {
;__p+='\n\t\t\t\t\t<div class="note-tags">\n\t                \t<span class="tags-label">tags:</span> ';
 _.each(note.get('tags'), function(tag) {
;__p+=''+
( tag )+
' ';
 });
;__p+='\n\t                </div>\n\t\t\t\t';
 }
;__p+='\n\t\t\t\t<div class="note-buttons">\n\t\t\t\t\t<a href="#" class="noteLink" data-content_id="'+
( note.get('content_id') )+
'">Link</a>\n\t\t\t\t\t<!-- <a href="#" class="noteEdit" data-content_id="'+
( note.get('content_id') )+
'">Edit</a> -->\n\t\t\t\t</div>\n\t\t\t</li>\n\t\t';
 });
;__p+='\n\t</ul>\n</div>';
}
return __p;
}
OsciTk.templates['page'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( content )+
'';
}
return __p;
}
OsciTk.templates['search-results'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='';
 if (query.keyword) {
;__p+='\n<div id="search-results-header">\n\t<div id="search-summary">\n\t\tResult(s) for <span id="search-query">"'+
( query.keyword )+
'"</span> ('+
( response.numFound )+
')\n\t\t<a id="reset-search" href="#">RESET</a>\n\t</div>\n\t<div id="results-sort">\n\t\tSort By:\n\t\t<ul>\n\t\t\t<li id="results-sort-relevance" class="sort-button"><a href="#" class="sort-button">Relevance</a></li>\n\t\t\t<li id="results-sort-type"><a href="#" class="sort-button">Type</a></li>\n\t\t</ul>\n\t</div>\n</div>\n<div id="search-results-container">\n\t<div id="search-results">\n\t\t<div id="search-results-content">\n\t\t\t';
 _.each(results, function(group) { var first = true;
;__p+='\n\t\t\t\t<div class="result-section">\n\t\t\t\t\t';
 _.each(group, function(result) {
;__p+='\n\t\t\t\t\t';
 if (first) {
;__p+='\n\t\t\t\t\t<div class="result-title">'+
( result.get('label') )+
'</div>\n\t\t\t\t\t';
 first = false; }
;__p+='\n\t\t\t\t\t<div class="search-result" data-id="'+
( result.get('id') )+
'">\n\t\t\t\t\t\t<div class="result-content">\n\t\t\t\t\t\t\t<div class="result-type '+
( result.get('bundle') )+
'">'+
( result.get('bundle') )+
'</div>\n\t\t\t\t\t\t\t<div class="result-body">'+
( result.get('teaser') )+
'</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t';
 });
;__p+='\n\t\t\t\t</div>\n\t\t\t';
 });
;__p+='\n\t\t</div>\n\t</div>\n\t<div id="filter-by-section">\n\t\t<div class="section-title">Filter by section</div>\n\t\t<ul>\n\t\t\t';
 _.each(response.facets, function(facet) {
;__p+='\n\t\t\t\t<li><a href="#" data-filter="section:'+
( facet.section_id )+
'" class="facet">'+
( facet.section )+
'</a> ('+
( facet.count )+
')</li>\n\t\t\t';
 });
;__p+='\n\t\t</ul>\n\t</div>\n</div>\n';
 }
;__p+='';
}
return __p;
}
OsciTk.templates['search'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="search-header">\n\t<h3>Search</h3>\n\t<div id="search-box">\n\t\t<form id="search-form" name="search-form" method="POST">\n\t\t\t<input type="text" name="keyword" id="search-keyword" placeholder="search" value="'+
( query.keyword )+
'"/>\n\t\t\t<input type="hidden" name="page" id="search-page" />\n\t\t</form>\n\t</div>\n\t<div id="search-filters">\n\t\t<div class="label">Filter |</div>\n\t\t<ul>\n\t\t\t<li class="filter" data-filter="type:content" id="search-filter-content"><div class="dot">&nbsp;</div><div class="label">Content</div></li>\n\t\t\t<li class="filter" data-filter="type:notes" id="search-filter-notes"><div class="dot">&nbsp;</div><div class="label">My Notes</div></li>\n\t\t\t<li class="filter" data-filter="type:footnotes" id="search-filter-footnotes"><div class="dot">&nbsp;</div><div class="label">Footnotes</div></li>\n\t\t\t<li class="filter" data-filter="type:figures" id="search-filter-figures"><div class="dot">&nbsp;</div><div class="label">Figures</div></li>\n\t\t</ul>\n\t</div>\n</div>\n<div id="search-results-wrapper"></div>';
}
return __p;
}
OsciTk.templates['title'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h1 id="publication-title"></h1>';
}
return __p;
}
OsciTk.templates['toc'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<h3>Table of Contents</h3>\n<ul>\n\t';
 _.each(items, function(item) {
;__p+='\n\t\t<li class="toc-item';
 if (item.id === app.views.navigationView.currentNavigationItem.id) { print(" active"); }
;__p+='">\n\t\t\t<a data-section-id="'+
( item.id )+
'" href="#">\n\t\t\t\t<div class="toc-item-thumbnail">\n\t\t\t\t\t';
 if (item.get('thumbnail')) {
;__p+='\n\t\t\t\t\t\t<img src="'+
( item.get('thumbnail') )+
'">\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t</div>\n\t\t\t\t<div class="toc-item-text">\n\t\t\t\t\t<h4>'+
( item.get('title') )+
'</h4>\n\t\t\t\t\t';
 if (item.get('subtitle')) {
;__p+='\n\t\t\t\t\t\t<h5>'+
( item.get('subtitle') )+
'</h5>\n\t\t\t\t\t';
 }
;__p+='\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t\t<hr>\n\t\t</li>\n\t';
 });
;__p+='\n</ul>';
}
return __p;
}
OsciTk.templates['toolbar-item'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+=''+
( text )+
'';
}
return __p;
}
OsciTk.templates['toolbar'] = function(obj){
var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};
with(obj||{}){
__p+='<div id="toolbar-close">Close</div>\n<div id="toolbar-title-container">\n\t<h2 id="toolbar-title"></h2>\n</div>\n<div id="toolbar-content-container">\n\t<div id="toolbar-content"></div>\n</div>\n<div id="toolbar-handle"></div>';
}
return __p;
}
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
OsciTk.models.Config = OsciTk.models.BaseModel.extend({});
OsciTk.models.Figure = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			section_id: null,
			delta: null,
			caption: null,
			position: null,
			columns: null,
			aspect: 1,
			body: null,
			options: {}
		};
	},

	initialize: function() {
		this.parsePositionData();
	},

	parsePositionData: function() {
		var position = this.get('position');
		var parsedPosition;

		if (position.length > 1) {
			parsedPosition = {
				vertical: position[0],
				horizontal: position[1]
			};
		} else if (position === "n" || position === "p") {
			parsedPosition = {
				vertical: position,
				horizontal: position
			};
		} else {
			parsedPosition = {
				vertical: position,
				horizontal: 'na'
			};
		}

		this.set('position', parsedPosition);

		return this;
	}
});
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
OsciTk.models.Note = OsciTk.models.BaseModel.extend({
	defaults: function() {
		return {
			id: null,
			content_id: null,
			section_id: null,
			note: null,
			tags: []
		};
	},

	initialize: function(attributes, options) {
		this.on('error', function(model, error) {
			console.log([model, error], 'error fired');
		});
	},

	sync: function(method, model, options) {
		var endpoint = app.config.get('endpoints').OsciTkNote;

		console.log('Note.sync: ' + method);
		console.log(model, 'model');
		console.log(options, 'options');

		switch (method) {
			case 'create':
				// convert the model attributes to standard form encoding
				options.data = model.toJSON();
				delete options.data.id;
				// all response codes are successful by design, check
				// the returned success attribute for real status
				// and properly error if necessary
				options.success = function(data, textStatus, jqXHR) {
					var response = JSON.parse(data);
					console.log(response, 'response');
					if (!response.success) {
						options.error(model, jqXHR);
					}
					else {
						model.set('id', response.note.id);
						model.trigger('change');
					}
				};
				options.type = 'POST';
				$.ajax(endpoint, options);
				break;

			case 'update':
				options.data = model.toJSON();
				options.success = function(data, textStatus, jqXHR) {
					var response = JSON.parse(data);
					console.log(response, 'update response');
					if (!response.success) {
						options.error(model, jqXHR);
					}
					else {
						model.trigger('change');
					}
				};
				options.type = 'POST';
				$.ajax(endpoint, options);
				break;

			case 'delete':
				options.data = model.toJSON();
				options.data['delete'] = 1;
				options.type = 'POST';
				options.success = function(data, textStatus, jqXHR) {
					var response = JSON.parse(data);
					console.log(response, 'delete response');
					if (!response.success) {
						options.error(model, jqXHR);
					}
					else {
						model.trigger('change');
					}
				};
				$.ajax(endpoint, options);
				break;
		}
	}
});
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

		//get the publication id
		var ids = data['package']['metadata']['dc:identifier'];
		if (!_.isArray(ids)) {
			ids = [ids];
		}
		var numIds = ids.length;
		for (var i = 0; i < numIds; i++) {
			var pubId = ids[i];
			if (pubId.value.indexOf('urn:osci_tk_identifier:') !== false) {
				this.set('id', pubId.value.substr(23));
				break;
			}
		}

		this.set('version', data['package'].version);
		this.set('xmlns', data['package'].xmlns);

		app.dispatcher.trigger('packageLoaded', this);
	},

	sync: function(method, model, options) {
		console.log('Package.sync: ' + method);
	},

	getTitle: function() {
		var title;
		var metadata = this.get("metadata");
		if (metadata['dc:title'] && metadata['dc:title']['value']) {
			title = metadata['dc:title']['value'];
		}

		return title;
	}
});
OsciTk.models.Page = OsciTk.models.BaseModel.extend({

	defaults: function() {
		return {
			content : [],
			pageNumber : 0
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
	},

	removeAllContent : function() {
		this.set('content', []);
	},

	contentLength : function() {
		return this.get('content').length;
	}
});
OsciTk.models.SearchResult = OsciTk.models.BaseModel.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];

		var val = this.attributes[attr];
		switch(attr) {
			case 'bundle':
				if(val === 'footnote' || val === 'note' || val === 'figure') {
					return val;
				} else {
					return 'content';
				}
				break;
			case 'url':

				break;
			default:
				return this.attributes[attr];
		}
	}
});
OsciTk.models.Section = OsciTk.models.BaseModel.extend({
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
OsciTk.collections.Figures = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Figure,

	initialize: function() {
		app.dispatcher.on('figuresAvailable', function(figures) {
			this.populateFromMarkup(figures);
			app.dispatcher.trigger('figuresLoaded', this);
		}, this);
	},

	comparator: function(figure) {
		return figure.get('delta');
	},

	/**
	 * Populates the collection from an array of figure markup
	 */
	populateFromMarkup: function(data) {
		var figures = [];
		_.each(data, function(markup) {

			var idComponents = markup.id.match(/\w+-(\d+)-(\d+)/);
			var $markup = $(markup);

			var figure = {
				id:         markup.id,
				rawData:    markup,
				body:       markup.innerHTML,
				section_id: idComponents[1],
				delta:      idComponents[2],
				title:      $markup.attr('title'),
				caption:    $markup.find('figcaption').html(),
				content:    $markup.find('.figure_content').html(),
				position:   $markup.data('position'),
				columns:    $markup.data('columns'),
				options:    $markup.data('options'),
				thumbnail_url: undefined, // Defaults to image defined in css
				type:       $markup.data('figure_type'),
				aspect:     $markup.data('aspect')
			};

			// First, check for an explicit thumbnail
			var thumbnail = $markup.children('img.thumbnail').remove();
			if (thumbnail.length) {
				figure.thumbnail_url = thumbnail.attr('src');
				figure.preview_url = thumbnail.attr('src');
			} else {
				// No explicit thumbnail, default to the first image in the figure content
				var image = $('.figure_content img', markup);
				if (image.length) {
					figure.thumbnail_url = image.attr('src');
					figure.preview_url = image.attr('src');
				}
				// TODO: Default to the figure type default? Also via css?
			}

			// add the figure to the array for adding to the collection
			figures.push(figure);

		}, this);

		// populate the collection
		this.reset(figures);
	}
});
OsciTk.collections.Footnotes = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Footnote,

	initialize: function() {
		app.dispatcher.on('footnotesAvailable', function(footnotes) {
			this.populateFromMarkup(footnotes);
			app.dispatcher.trigger('footnotesLoaded', this);
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
				var navDocument = data.html.body.nav;
				for (var i = 0, c = navDocument.length; i < c; i++) {
					if (navDocument[i].type == 'toc') {
						var navSegment = navDocument[i].ol;
						this.parseChildren(navSegment, null, 0);
						break;
					}
				}

				app.dispatcher.trigger('navigationLoaded', this);
			}
		}, this);
	},
	parseChildren: function(items, parent, depth) {
		if (_.isArray(items) === false) {
			items = [items];
		}
		for (var i = 0, numItems = items.length; i < numItems; i++) {
			var item = items[i];
			if (item.a) {
				var parsedItem = {
					id: item.a['data-section_id'],
					parent: parent,
					depth: depth,
					previous: this.at(this.length - 1) || null,
					next: null,
					length: item.a['data-length'] || null,
					title: item.a['value'],
					subtitle: item.a['data-subtitle'],
					thumbnail: item.a['data-thumbnail'],
					timestamp: item.a['data-timestamp'],
					uri: item.a['href']
				};
				this.add(parsedItem);

				var navItem = this.at(this.length - 1);
				if (navItem.get('previous') !== null) {
					navItem.get('previous').set('next', navItem);
				}

				// if 'ol' tag is present, sub sections exist, process:
				if (item.ol && item.ol.li) {
					var children;
					// due to the way the xml is parsed, it comes back as an array or a direct object
					if (item.ol.li.length) {
						children = item.ol.li;
					}
					else {
						children = [item.ol.li];
					}
					var nextDepth = depth + 1;
					for (var h = 0, numChildren = children.length; h < numChildren; h++) {
						this.parseChildren(children[h], navItem, nextDepth);
					}
				}
			}
			if (item.li) {
				this.parseChildren(item.li, parent, depth);
			}
		}
	}
});
OsciTk.collections.Notes = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.Note,
	initialize: function() {
		app.dispatcher.on('currentNavigationItemChanged', function(navItem) {
			//TODO: Refactor once Gray cleans up the NavigationItemModel
			if (navItem.id) {
				app.collections.notes.getNotesForSection(navItem.id);
			}
		}, this);
	},
	comparator: function(note) {
		// parse out the content id number and use that for internal sorting
		return note.get('content_id').match(/.*-(\d+)/)[1];
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
					app.dispatcher.trigger('notesLoaded', app.collections.notes);
				}
			}
		});
	}
});
OsciTk.collections.Pages = OsciTk.collections.BaseCollection.extend({
	model : OsciTk.models.Page,
	initialize : function() {

	}
});
OsciTk.collections.SearchResults = OsciTk.collections.BaseCollection.extend({
	model: OsciTk.models.SearchResult
});
OsciTk.views.Page = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('page'),
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
	},
	removeAllContent : function() {
		this.model.removeAllContent();
		return this;
	},
	containsElementId : function(id) {
		return (this.$el.find('#' + id).length !== 0);
	}
});
OsciTk.views.Section = OsciTk.views.BaseView.extend({
	id: 'section',
	initialize: function() {

		_.defaults(this.options, {
			pageView : 'Page'
		});

		// bind sectionChanged
		app.dispatcher.on('currentNavigationItemChanged', function(navItem) {
			if (navItem) {
				// loading section content
				app.models.section = new OsciTk.models.Section({
					uri : navItem.get('uri'),
					id : navItem.get('id')
				});

				app.models.section.loadContent();
				this.changeModel(app.models.section);
				this.render();
			}
		}, this);

	},
	render: function() {
		//Allow subclasses to do something before we render
		if (this.preRender) {
			this.preRender();
		}
		//clean up the view incase we have already rendered this before
		this.model.removeAllPages();
		this.removeAllChildViews();

		app.dispatcher.trigger("layoutStart");
		this.renderContent();
		app.dispatcher.trigger("layoutComplete", {numPages : this.model.get('pages').length});
		return this;
	},
	onClose: function() {
		this.model.removeAllPages();
	},
	getPageForParagraphId: function(pid) {
		var views = this.getChildViews();
		var p = _.find(views, function(view) {
			return view.$el.find("[data-paragraph_identifier='" + pid + "']").length !== 0;
		});
		if ((p !== undefined) && (p !== -1)) {
			return _.indexOf(views, p) + 1;
		}
		return null;
	},
	getPageForElement: function(element) {
		var page = $(element).parents(".page");
		if (page) {
			return page.data("page_num");
		}

		return null;
	},
	getPageForElementId : function(id) {
		var views = this.getChildViews();
		var p = _.find(views, function(view) { return view.containsElementId(id); });
		if ((p !== undefined) && (p !== -1)) {
			return _.indexOf(views, p) + 1;
		}
		return null;
	},
	isElementVisible: function(element) {
		return true;
	},
	getPageForProcessing : function(id, newTarget) {
		var page;

		if (id !== undefined) {
			page = this.getChildViewById(id);
		} else {
			page = _.filter(this.getChildViews(), function(page){
				return page.isPageComplete() === false;
			});

			if (page.length === 0) {
				var pagesCollection = this.model.get('pages');
				pagesCollection.add({
					pageNumber: this.model.get('pages').length + 1
				});

				page = new OsciTk.views[this.options.pageView]({
					model : pagesCollection.last(),
					pageNumber : this.model.get('pages').length
				});
				this.addView(page, newTarget);
			} else {
				page = page.pop();
			}
		}

		return page;
	},
	getCurrentPageView: function() {
		// TODO: so the only possible child view of a section is a page???
		return this.getChildViewByIndex(app.views.navigationView.page - 1);
	},
	renderContent: function() {
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
//Add this view to the figure type registry
OsciTk.views.figureTypeRegistry["default"] = "MultiColumnFigure";

OsciTk.views.MultiColumnFigure = OsciTk.views.BaseView.extend({

	tagName: 'figure',
	template: OsciTk.templateManager.get('multi-column-figure'),

	initialize: function() {
		//set some defaults
		this.layoutComplete = false;
		this.contentRendered = false;
		this.sizeCalculated = false;
		this.calculatedHeight = 0;
		this.calculatedWidth = 0;
		this.position = {x:[0,0], y:[0,0]};

		this.$el.attr("id", this.model.get("id"));

		//TODO: this does not scale
		//app.dispatcher.on("pageChanged", this.toggleVisibility, this);
	},

	events: {
		"click .figure_content" : "fullscreen"
	},

	onClose: function() {
		app.dispatcher.off("pageChanged", this.toggleVisibility, this);
	},

	toggleVisibility: function(data) {
		if (this.parent.options.pageNumber === data.page) {
			if (!this.contentRendered) {
				this.renderContent();
			}

			this.$el.css("visibility", "visible");
		} else {
			this.$el.css("visibility", "hidden");
		}
	},

	render: function() {
		//template the element
		this.$el.html(this.template(this.model.toJSON()));

		//calculate the size based on layout hints
		this.sizeElement();

		//position the element on the page
		var isPositioned = this.positionElement();

		if (isPositioned) {
			this.layoutComplete = true;
		}

		//remove this
		if (!this.contentRendered) {
			this.renderContent();
		}

		return this;
	},

	renderContent: function() {
		this.$el.find(".figure_content").html(this.model.get('content'));

		this.contentRendered = true;
	},

	fullscreen: function() {
		$.fancybox.open({
			content: this.model.get('content')
		});
	},

	positionElement: function() {
		var modelData = this.model.toJSON();
		var dimensions = this.options.sectionDimensions;

		//if element shouold not be visible on the page, hide it and return
		if (modelData.position.vertical === "n") {
			this.$el.hide();
			return true;
		}

		var column;
		//Detemine the start column based on the layout hint
		switch (modelData.position.horizontal) {
			//right
			case 'r':
				column = dimensions.columnsPerPage - 1;
				break;
			//left & fullpage
			case 'l':
			case 'p':
				column = 0;
				break;
			//In the current column
			default:
				column = this.parent.processingData.currentColumn;
		}

		var positioned = false;
		var numColumns = this.model.get('calculatedColumns');
		var offsetLeft = 0;
		var offsetTop = 0;
		var maxPositionAttemps = numColumns;
		var positionAttempt = 0;

		whilePositioned:
		while (!positioned && positionAttempt <= maxPositionAttemps) {
			positionAttempt++;

			//Detemine the left offset start column and width of the figure
			if ((column + numColumns) > dimensions.columnsPerPage) {
				column -= (column + numColumns) - dimensions.columnsPerPage;
			}

			//If the figure is not as wide as the available space, center it
			var availableWidth = (dimensions.columnWidth * numColumns) + ((numColumns + 1) * dimensions.gutterWidth);
			var addLeftPadding = 0;
			if (this.calculatedWidth < availableWidth) {
				addLeftPadding = Math.floor((availableWidth - this.calculatedWidth) / 2);
			}

			offsetLeft = (column * dimensions.columnWidth) + (column * dimensions.gutterWidth) + addLeftPadding;
			this.$el.css("left", offsetLeft + "px");

			//Determine the top offset based on the layout hint
			switch (modelData.position.vertical) {
				//top & fullpage
				case 't':
				case 'p':
					offsetTop = 0;
					break;
				//bottom
				case 'b':
					offsetTop = dimensions.innerSectionHeight - this.calculatedHeight;
					break;
			}
			this.$el.css("top", offsetTop + "px");

			var figureX = [offsetLeft, offsetLeft + this.calculatedWidth];
			var figureY = [offsetTop, offsetTop + this.calculatedHeight];
			this.position = {
				x : figureX,
				y : figureY
			};

			positioned = true;

			if (offsetLeft < 0 || figureX[1] > dimensions.innerSectionWidth) {
				positioned = false;
			}

			//check if current placement overlaps any other figures
			var pageFigures = this.parent.getChildViewsByType('figure');
			var numPageFigures = pageFigures.length;
			if (positioned && numPageFigures && numPageFigures > 1) {
				for (i = 0; i < numPageFigures; i++) {
					if (pageFigures[i].cid === this.cid) {
						continue;
					}

					var elemX = pageFigures[i].position.x;
					var elemY = pageFigures[i].position.y;

					if (figureX[0] < elemX[1] && figureX[1] > elemX[0] &&
						figureY[0] < elemY[1] && figureY[1] > elemY[0]
					) {
						positioned = false;
						break;
					}
				}
			}

			if (!positioned) {
				//adjust the start column to see if the figure can be positioned on the page
				switch (modelData.position.horizontal) {
					//right
					case 'r':
						column--;
						if (column < 0) {
							break whilePositioned;
						}
						break;
					//left & fullpage
					case 'l':
					case 'p':
						column++;
						if (column >= dimensions.columnsPerPage) {
							break whilePositioned;
						}
						break;
					//no horizontal position
					default:
						column++;
						if (column > dimensions.columnsPerPage) {
							column = 0;
						}
				}
			}
		}

		return positioned;
	},

	sizeElement: function() {
		var width, height;
		var dimensions = this.options.sectionDimensions;
		var modelData = this.model.toJSON();

		//Only process size data if figure will be displayed
		if (modelData.position === "n") {
			this.calculatedHeight = this.$el.height();
			this.calculatedWidth = this.$el.width();
			return this;
		}

		//If a percentage based width hint is specified, convert to number of columns to cover
		if (typeof(modelData.columns) === 'string' && modelData.columns.indexOf("%") > 0) {
			modelData.columns = Math.ceil((parseInt(modelData.columns, 10) / 100) * dimensions.columnsPerPage);
		}

		//Calculate maximum width for a figure
		if (modelData.columns > dimensions.columnsPerPage || modelData.position === 'p') {
			width = dimensions.innerSectionWidth;
			modelData.columns = dimensions.columnsPerPage;
		} else {
			width = (modelData.columns * dimensions.columnWidth) + (dimensions.gutterWidth * (modelData.columns - 1));
		}
		width = Math.floor(width);
		this.$el.css("width", width + "px");

		//Get the height of the caption
		var captionHeight = this.$el.find("figcaption").outerHeight(true);

		//Calculate height of figure plus the caption
		height = (width / modelData.aspect) + captionHeight;

		//If the height of the figure is greater than the page height, scale it down
		if (height > dimensions.innerSectionHeight) {
			height = dimensions.innerSectionHeight;

			//set new width and the new column coverage number
			width = (height - captionHeight) * modelData.aspect;
			this.$el.css("width", width + "px");

			//update caption height at new width
			captionHeight = this.$el.find("figcaption").outerHeight(true);

			//update column coverage
			modelData.columns = Math.ceil((width + dimensions.gutterWidth) / (dimensions.gutterWidth + dimensions.columnWidth));
		}

		//dont use partial pixels
		width = Math.floor(width);
		height = Math.floor(height);

		this.$el.css({ height : height + "px", width : width + "px"});

		this.calculatedHeight = height;
		this.calculatedWidth = width;

		//update model number of columns based on calculations
		this.model.set('calculatedColumns', modelData.columns);

		//Set the size of the figure content div inside the actual figure element
		this.$el.find('.figure_content').css({
			width : width,
			height : height - captionHeight
		});

		this.sizeCalculated = true;
		return this;
	}
});
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
		this.template = OsciTk.templateManager.get('account-register');
		this.$el.html(this.template());
	},
	showLoginForm: function() {
		this.template = OsciTk.templateManager.get('account-login');
		this.$el.html(this.template());
	},
	showProfile: function() {
		this.template = OsciTk.templateManager.get('account-profile');
		this.$el.html(this.template(this.model.toJSON()));
	}
});
OsciTk.views.App = OsciTk.views.BaseView.extend({
	id: 'reader',

	initialize: function() {
		$('body').append(this.el);

		// Add the title view to the appView
		app.views.titleView = new OsciTk.views.Title();
		this.addView(app.views.titleView);

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

		// Add the footnotes view to the AppView
		app.views.footnotesView = new OsciTk.views.Footnotes();

		// Add the inline notes view to the AppView
		app.views.inlineNotesView = new OsciTk.views.InlineNotes();

		// Add the citation view to the AppView
		app.views.citationView = new OsciTk.views.Citation();
	}
});
OsciTk.views.Citation = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('citation'),
	initialize: function() {

		app.dispatcher.on("toggleCiteDialog", function(data) {
			var citationView = this;
			var contentId = data.contentId;
			var content = $('#' + contentId);

			var citationRequestParams = {
				'section_id': app.models.section.get('id'),
				'publication_id': app.models.docPackage.get('id'),
				'element_id': data.contentId
			};

			var colWidth = app.views.sectionView.dimensions.columnWidth;
			var windowWidth = $(window).width();
			var tooltipWidth = colWidth;
			if (colWidth * 1.5 < windowWidth) {
				tooltipWidth = colWidth * 1.5;
			}

			content.qtip("destroy");
			content.qtip({
				content: {
					title: {
						text: "Citation",
						button: "Close"
					},
					text: "Loading...",
					ajax: {
						url: app.config.get('endpoints').OsciTkCitation,
						data: citationRequestParams,
						success: function(data, status) {
							if (data.success) {
								//add reference text to the response
								data.citation.referenceText = content.text();
								data.citation.url = document.URL + "/p-" + app.models.section.get('id') + "-" + content.data('paragraph_number');
								data.citation.paragraphNumber = content.data('paragraph_number');
								data.citation.date = new Date(data.citation.date);
								data.citation.formattedDate = (data.citation.date.getMonth() + 1) + "/" + data.citation.date.getDate() + "/" + data.citation.date.getFullYear();

								//make sure data exists for all variables in templates
								data.citation.creator = data.citation.creator ? data.citation.creator : '';
								data.citation.description = data.citation.description ? data.citation.description : '';
								data.citation.editor = data.citation.editor ? data.citation.editor : '';
								data.citation.publicationTitle = data.citation.publicationTitle ? data.citation.publicationTitle : '';
								data.citation.publisher = data.citation.publisher ? data.citation.publisher : '';
								data.citation.rights = data.citation.rights ? data.citation.rights : '';
								data.citation.title = data.citation.title ? data.citation.title : '';

								//update the display
								this.set('content.text', citationView.template(data.citation));

								this.elements.content.on('click', 'a', function(e) {
									e.preventDefault();
									var $this = $(this);

									var container = $this.parents(".citations");
									container.find('.citation').hide();
									container.find($this.attr('href')).show();

									container.find('li').removeClass('active');
									$this.parent().addClass('active');
								});
							}
						}
					}
				},
				show: {
					event: '',
					ready: true,
					modal: {
						on:true,
						dim: false
					}
				},
				hide: {
					fixed: true,
					event: 'unfocus'
				},
				position: {
					my: 'center',
					at: 'center',
					target: $(document.body)
				},
				style: {
					classes: 'citation-tooltip',
					def: false,
					width: tooltipWidth + 'px'
				},
				events: {
					hide: function(event, api) {
						api.destroy();
					}
				}
			});


		}, this);
	}

});
OsciTk.views.Figures = OsciTk.views.BaseView.extend({
	className: 'figures-view',
	template: OsciTk.templateManager.get('figures'),
	initialize: function() {
		// re-render this view when collection changes
		app.collections.figures.on('add remove reset', function() {
			this.render();
		}, this);
	},
	events: {
		"click .figure-preview": "onFigurePreviewClicked",
		"click a.view-fullscreen": "onFigurePreviewClicked",
		"click a.view-in-context": "onViewInContextClicked",
		"click figure.thumbnail": "onThumbnailClick",
		"click .back-to-grid": "backToGridClick",
		"click .figure-nav.next": "figureNextClick",
		"click .figure-nav.prev": "figurePrevClick"
	},
	figureNextClick: function(e) {
		var new_fig = this.$el.find('figure.preview.active').hide().removeClass('active').next('figure.preview');
		if (new_fig.length === 0) {
			new_fig = this.$el.find('figure.preview').first();
		}
		new_fig.show().addClass('active');
		this.displayTitle();
	},
	figurePrevClick: function(e) {
		var new_fig = this.$el.find('figure.preview.active').hide().removeClass('active').prev('figure.preview');
		if (new_fig.length === 0) {
			new_fig = this.$el.find('figure.preview').last();
		}
		new_fig.show().addClass('active');
		this.displayTitle();
	},
	backToGridClick: function(e) {
		this.$el.find('.figure-previews').hide();
		this.$el.find('.figure-browser').show();

		//Call active to make sure width is set correctly
		this.active();

		//resize content area to make sure layout is correct
		app.views.toolbarView.updateHeight();
	},
	onThumbnailClick: function(e) {
		this.$el.find('.figure-browser').hide();
		this.$el.find('.figure-previews figure.active').hide().removeClass('active');
		var content = this.$el.find("figure.preview[data-figure-id='" + $(e.currentTarget).attr('data-figure-id') + "']");
		content.show().addClass('active');
		this.displayTitle();
		this.$el.find('.figure-previews').show();
		app.views.toolbarView.updateHeight();
	},
	onFigurePreviewClicked: function(event_data) {
		var figureId = $(event_data.target).parent('figure').attr('data-figure-id');
		var figureView = app.views.figures[figureId];
		if (figureView && figureView.fullscreen) {
			figureView.fullscreen();
		}
		return false;
	},
	onViewInContextClicked: function(event_data) {
		app.dispatcher.trigger('navigate', { identifier: $(event_data.target).parent('figure').attr('data-figure-id') });
		app.views.toolbarView.contentClose();
		return false;
	},
	active: function() {
		// Set the width of the figure reel if there is more than one thumbnail
		if (app.collections.figures.length > 1) {
			var thumbs = this.$el.find('figure.thumbnail');
			this.$el.find('.figure-browser .figure-reel').width(thumbs.length * (thumbs.outerWidth(true)));
		}
	},
	render: function() {
		var fig_data = app.collections.figures.toJSON();
		this.$el.html(this.template({figures: fig_data}));

		return this;
	},
	displayTitle: function() {
		var id = this.$el.find('figure.preview.active').attr('data-figure-id');
		var figure = app.collections.figures.get(id);
		this.$el.find('h2 span.title').html(figure.get('title'));
	}
});
OsciTk.views.Font = OsciTk.views.BaseView.extend({
	className: 'font-view',
	template: OsciTk.templateManager.get('font'),
	initialize: function() {
		this.currentFontSize = 100;
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
		return this;
	},
	events: {
		"click .font-button": "changeFontSize",
		"click .theme-button": "changeTheme"
	},
	changeFontSize: function(e) {
		e.preventDefault();

		var sectionView = app.views.sectionView;
		var clicked = $(e.target);

		if (clicked.attr("href") === "#font-larger") {
			this.currentFontSize += 25;
		} else {
			this.currentFontSize -= 25;
		}

		sectionView.$el.css({
			"font-size": this.currentFontSize + "%"
		});

		app.dispatcher.trigger("windowResized");
	},
	changeTheme: function(e) {
		e.preventDefault();

		var clicked = $(e.target);
		var theme = clicked.attr("href").substr(1);
		var body = $("body");

		body.removeClass("normal sepia night");

		body.addClass(theme);
	}
});
OsciTk.views.Footnotes = OsciTk.views.BaseView.extend({
	id: 'footnote',
	initialize: function() {
		// listen to layoutComplete event
		app.dispatcher.on('layoutComplete', function(params) {
			// find all footnote links in the section content
			var fnLinks = app.views.sectionView.$el.find('a.footnote-reference');
			_.each(fnLinks, function(link) {
				link = $(link);
				// is there a matching footnote?
				var id = link.attr('href').slice(1);
				var fn = app.collections.footnotes.get(id);
				if (fn) {
					link.qtip({
						content: fn.get('body'),
						style: {
							def: false
						}
					});
				}
			});
		}, this);
	}
});
OsciTk.views.InlineNotes = OsciTk.views.BaseView.extend({
	template: OsciTk.templateManager.get('note-popup'),
	initialize: function() {

		app.dispatcher.on('toggleNoteDialog', function(data) {
			var $this = this;
			var contentId = data.contentId;
			var content = $('#' + contentId);
			if (contentId) {
				// find the note content if pre-existing
				var note;
				var notes = app.collections.notes.where({content_id: contentId});
				if (notes[0]) {
					note = notes[0];
				}
				else {
					note = new OsciTk.models.Note({
						content_id: contentId,
						section_id: app.models.section.id
					});
					app.collections.notes.add(note);
				}
				var noteJson = note.toJSON();
				noteJson.referenceContent =content.text();

				content.qtip("destroy");
				content.qtip({
					id: note.cid,
					content: {
						title: {
							text: "Notes",
							button: "Save & Close"
						},
						text: $this.template(noteJson)
					},
					show: {
						ready: true,
						event: '',
						modal: {
							on:true,
							dim: false
						}
					},
					hide: {
						event: 'unfocus',
						fixed: true
					},
					position: {
						my: 'center',
						at: 'center',
						target: $(document.body)
					},
					style: {
						classes: 'note-tooltip',
						def: false,
						width: app.views.sectionView.dimensions.columnWidth + 'px'
					},
					events: {
						render: function(event, api) {
							// bind to keyup on text area to sync changes to back end
							api.elements.content.find('.noteForm textarea').on('keyup', function(e) {
								// change status text
								api.elements.content.find('.status').text('Saving...');
								// save the content to the model in case the note disappears (user clicks off)
								var cid = api.elements.tooltip.attr('id').match(/c\d+/)[0];
								// search the collection for this cid
								var note = app.collections.notes.getByCid(cid);
								note.set('note', e.target.value);
								// clear the previous timer if there is one
								if (typeof($this['saveTimeout'+cid]) !== 'undefined') {
									clearTimeout($this['saveTimeout'+cid]);
									delete $this['saveTimeout'+cid];
								}
								// set timer to save the note
								$this['saveTimeout'+cid] = window.setTimeout(function() {
									note.save();
									api.elements.content.find('.status').text('Saved');
								}, 1500);
							});
						},
						hide: function(event, api) {
							// if closing the modal for a note with content, mark the paragraph control
							// to indicate this paragraph has a note
							var content = api.elements.content.find('textarea').val();
							if (content.length > 0) {
								var pageView = app.views.sectionView.getCurrentPageView();
								var pc = pageView.$el.find('.paragraph-controls[data-osci_content_id=' + contentId + ']');
								pc.addClass('notes-present');
							}
						}
					}
				});
			}
		}, this);

		// place icon next to paragraphs with notes after layout is complete
		app.dispatcher.on('notesLoaded', function(params) {
			_.each(app.collections.notes.models, function(n) {
				// place a class on the paragraph identifier to indicate a note is present
				var paragraphControls = app.views.sectionView.$el.find('.paragraph-controls[data-osci_content_id=' + n.get('content_id') + ']');
				if (paragraphControls.length) {
					paragraphControls.addClass('notes-present');
				}
			});
		}, this);
	}
});
//Add this view to the figure type registry
OsciTk.views.figureTypeRegistry["image_asset"] = "MultiColumnFigureImage";

OsciTk.views.MultiColumnFigureImage = OsciTk.views.MultiColumnFigure.extend({
	renderContent: function() {
		var container = this.$el.find(".figure_content");
		var containerHeight = container.height();
		var containerWidth = container.width();

		container.html(this.model.get('content'));
		container.children("img").css({
			height: containerHeight + "px",
			width: containerWidth + "px"
		});

		this.contentRendered = true;
	},
	fullscreen: function() {
		$.fancybox.open({
			href: $(this.model.get('content')).attr('src')
		});
	}
});
//Add this view to the figure type registry
OsciTk.views.figureTypeRegistry["layered_image"] = "MultiColumnFigureLayeredImage";

OsciTk.views.MultiColumnFigureLayeredImage = OsciTk.views.MultiColumnFigure.extend({
	// override MultiColumnFigure's events - polymaps handles events for this class
	events: {},
	renderContent: function() {
		this.figContent = this.figContent || null;
		var container = this.$el.find(".figure_content");
		var containerHeight = container.height();
		var containerWidth = container.width();

		// place figure options on figure tag
		this.jsonOptions = JSON.stringify(this.model.get('options'));
		this.$el.attr('data-options', this.jsonOptions);

		// the content document may already be loaded
		if (this.figContent !== null) {
			this.renderFromContentDoc();
		}
		else {
			// get the figure content document from object's data-url attribute
			var figObj = $(this.model.get('content'));
			var figObjUrl = figObj.attr('data');
			if (figObjUrl !== undefined) {
				var $this = this;
				$.ajax({
					url: figObjUrl,
					type: 'GET',
					dataType: 'html',
					success: function(data) {
						$this.figContent = $(data).filter('.layered_image-asset').first();
						$this.LIMarkup = $this.figContent.clone();
						$this.renderFromContentDoc();
					}
				});
			}
		}
	},
	renderFromContentDoc: function() {
		var contentDiv = this.$el.find('.figure_content');
		contentDiv.empty();
		// place figure content into container and spawn Layered Image
		contentDiv.html(this.figContent);
		new window.LayeredImage(contentDiv.find('.layered_image-asset')[0]);
		this.contentRendered = true;
	},
	fullscreen: function() {
		var li = liCollection.find(this.LIMarkup.attr('id'));
		li.fullscreen();
	}
});

OsciTk.views.MultiColumnPage = OsciTk.views.Page.extend({
	initialize: function() {
		this.columnTemplate = OsciTk.templateManager.get('multi-column-column');
		this.visible = false;
		this.paragraphControlsViews = [];

		OsciTk.views.MultiColumnPage.__super__.initialize.call(this);
	},

	onClose: function() {
		this.model = undefined;
	},

	events: {
		'click a.figure_reference': 'onFigureReferenceClicked'
	},

	onFigureReferenceClicked: function(event_data) {
		var figureId = event_data.currentTarget.hash.substring(1);
		var figureView = app.views.figures[figureId];
		if (figureView && figureView.fullscreen) {
			figureView.fullscreen();
		}
		return false;
	},

	hide: function() {
		this.$el.css("visibility", "hidden");
		this.visible = false;
	},

	show: function() {
		this.$el.css("visibility", "visible");
		this.visible = true;
	},

	resetPage: function() {
		this.removeAllContent();

		for(var i = 0, c = this.paragraphControlsViews.length; i < c; i++) {
			this.removeView(this.paragraphControlsViews[i]);
		}
		this.paragraphControlsViews = [];

		this.$el.children(':not(figure)').remove();

		this.initializeColumns();
	},

	render : function() {
		if (this.processingData.rendered) {
			return this;
		}

		this.hide();

		//size the page to fit the view window
		this.$el.css({
			width: this.parent.dimensions.innerSectionWidth,
			height: this.parent.dimensions.innerSectionHeight
		});

		this.initializeColumns();

		//set rendered flag so that render does not get called more than once while iterating over content
		this.processingData.rendered = true;

		return this;
	},

	layoutContent : function() {
		var overflow = 'none';
		var column = this.getCurrentColumn();

		if (column === null) {
			this.processingComplete();
			overflow = 'contentOverflow';
			return overflow;
		}

		var content = $(this.model.get('content')[(this.model.get('content').length - 1)]);

		column.$el.append(content);

		var lineHeight = parseFloat(content.css("line-height"));
		var contentPosition = content.position();

		//If all of the content is overflowing the column remove it and move to next column
		if ((column.height - contentPosition.top) < lineHeight) {
			content.remove();
			column.heightRemain = 0;
			overflow = 'contentOverflow';
			return overflow;
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
		if (heightRemain < 0) {
			var overflowHeight = heightRemain;
			var hiddenLines = Math.floor(overflowHeight / lineHeight);
			var newHeight = contentPosition.top + content.outerHeight() + (hiddenLines * lineHeight);

			//assign the new height to remove any partial lines of text
			column.height = newHeight;
			column.$el.height(newHeight + "px");

			if (hiddenLines === 0) {
				heightRemain = 0;
				overflow = 'none';
			} else {
				heightRemain = (hiddenLines * lineHeight) - contentMargin.bottom;
				overflow = 'contentOverflow';
			}

			if (this.processingData.currentColumn === (this.parent.dimensions.columnsPerPage - 1)) {
				this.processingComplete();
			}

			//If all of the content is overflowing the column remove it and move to next column
			if ((column.height - contentPosition.top) < lineHeight) {
				content.remove();
				column.heightRemain = 0;
				overflow = 'contentOverflow';
				return overflow;
			}
		}

		if (heightRemain === 0 && this.processingData.currentColumn === (this.parent.dimensions.columnsPerPage - 1)) {
			this.processingComplete();
		}

		column.heightRemain = heightRemain;

		//place a paragraph number
		if (content.is("p")) {
			var paragraphNumber = content.data("paragraph_number");
			var contentIdentifier = content.data("osci_content_id");
			var pidIsOnPage = this.$el.find(".paragraph-identifier-" + paragraphNumber);

			if (pidIsOnPage.length === 0) {
				var columnPosition = column.$el.position();
				var pcv = new OsciTk.views.ParagraphControlsView({
					content: content,
					position: {
						top: (columnPosition.top + contentPosition.top) + "px",
						left: (columnPosition.left + contentPosition.left - this.parent.dimensions.gutterWidth) + "px"
					}
				});
				this.addView(pcv);

				this.paragraphControlsViews.push(pcv);
			}
		}

		return overflow;
	},

	getCurrentColumn : function() {
		var currentColumn = null;
		var lineHeight = parseInt(this.$el.css("line-height"), 10);
		lineHeight = lineHeight ? lineHeight : this.parent.options.defaultLineHeight;
		var minColHeight =  lineHeight * this.parent.dimensions.minLinesPerColumn;

		if (this.processingData.columns[this.processingData.currentColumn] &&
			this.processingData.columns[this.processingData.currentColumn].height >= minColHeight &&
			this.processingData.columns[this.processingData.currentColumn].heightRemain > 0) {
			currentColumn = this.processingData.columns[this.processingData.currentColumn];
		} else {
			for(var i = 0; i < this.parent.dimensions.columnsPerPage; i++) {
				if (this.processingData.columns[i].height >= minColHeight &&
					this.processingData.columns[i].heightRemain > 0) {
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
				left : this.processingData.columns[this.processingData.currentColumn].position.left,
				top : this.processingData.columns[this.processingData.currentColumn].position.top
			};

			currentColumn.$el = $(this.columnTemplate())
				.appendTo(this.$el)
				.addClass('column-' + this.processingData.currentColumn)
				.css(columnCss);
		}

		return currentColumn;
	},

	initializeColumns: function() {
		this.processingData.columns = [];

		var pageFigures = this.getChildViewsByType('figure');
		var numPageFigures = pageFigures.length;

		for (var i = 0; i < this.parent.dimensions.columnsPerPage; i++) {
			var leftPosition = (i * this.parent.dimensions.columnWidth) + (this.parent.dimensions.gutterWidth * (i + 1));
			var height = this.parent.dimensions.innerSectionHeight;
			var topPosition = 0;

			var columnPosition = {
				x : [leftPosition, leftPosition + this.parent.dimensions.columnWidth],
				y : [topPosition, topPosition + height]
			};

			if (numPageFigures) {
				for (var j = 0; j < numPageFigures; j++) {

					var elemX = pageFigures[j].position.x;
					var elemY = pageFigures[j].position.y;

					if (columnPosition.x[0] < elemX[1] && columnPosition.x[1] > elemX[0] &&
						columnPosition.y[0] < elemY[1] && columnPosition.y[1] > elemY[0]
					) {
						height = height - pageFigures[j].calculatedHeight - this.parent.dimensions.gutterWidth;

						//Adjust column top offset based on vertical location of the figure
						switch (pageFigures[j].model.get("position").vertical) {
							//top
							case 't':
							//fullpage
							case 'p':
								topPosition = topPosition + pageFigures[j].calculatedHeight + this.parent.dimensions.gutterWidth;
								break;
							//bottom
							case 'b':
								topPosition = topPosition;
								break;
						}

						columnPosition.y = [topPosition, topPosition + height];
					}
				}
			}

			height = Math.floor(height);
			this.processingData.columns[i] = {
				height : height,
				heightRemain : height > 0 ? height : 0,
				'$el' : null,
				offset : 0,
				position : {
					left : columnPosition.x[0],
					top : columnPosition.y[0]
				}
			};
		}

		this.processingData.currentColumn = 0;
	},

	addFigure: function(figureViewInstance) {
		var figurePlaced = false;

		this.addView(figureViewInstance);

		if (!figureViewInstance.layoutComplete) {
			figureViewInstance.render();

			if (figureViewInstance.layoutComplete) {
				//figure was placed
				figurePlaced = true;
			} else {
				//figure was not placed... carryover to next page
				figurePlaced = false;
				this.removeView(figureViewInstance, false);
			}
		}

		return figurePlaced;
	}
});
OsciTk.views.MultiColumnSection = OsciTk.views.Section.extend({

	template: OsciTk.templateManager.get('multi-column-section'),

	initialize: function() {
		this.options.pageView = 'MultiColumnPage';

		app.dispatcher.on("windowResized", function() {
			//get the identifier of the first element on the page to try and keep the reader in the same location
			var identifier;
			var page = this.getChildViewByIndex(app.views.navigationView.page - 1);
			var element = page.$el.find("[id]:first");
			if (element.length) {
				identifier = element.attr("id");
			}

			//update the navigationView identifier if found
			if (identifier) {
				app.views.navigationView.identifier = identifier;
			}

			this.render();
		}, this);

		app.dispatcher.on("navigate", function(data) {
			var gotoPage = 1;
			if (data.page) {
				gotoPage = data.page;
			}
			else if (data.identifier) {
				switch (data.identifier) {
					case 'end':
						gotoPage = this.model.get('pages').length;
						break;
					case 'start':
						gotoPage = 1;
						break;
					default:
						var page_for_id = null;

						if(data.identifier.search(/^p-[0-9]+/) > -1) {
							var pid = data.identifier.slice(data.identifier.lastIndexOf('-') + 1, data.identifier.length);
							page_for_id = this.getPageForParagraphId(pid);
						} else if (data.identifier.search(/^fig-[0-9]+-[0-9]+-[0-9]+/) > -1) {
							var matches = data.identifier.match(/^(fig-[0-9]+-[0-9]+)-([0-9])+?/);
							var figureId = matches[1];
							var occurrence = matches[2] ? parseInt(matches[2],10) : 1;

							var refs = $(".figure_reference").filter("[href='#" + figureId + "']");
							if (refs.length) {
								if (refs.length === 1) {
									page_for_id = this.getPageForElement(refs[0]);
								} else {
									//find visible occurence
									var occurrenceCount = 0;
									for (var j = 0, l = refs.length; j < l; j++) {
										if (this.isElementVisible(refs[j])) {
											occurrenceCount++;

											if (occurrenceCount === occurrence) {
												page_for_id = this.getPageForElement(refs[j]);
												break;
											}
										}
									}
								}
							}

						} else {
							page_for_id = this.getPageForElementId(data.identifier);
						}

						if (page_for_id !== null) {
							gotoPage = page_for_id;
						} else {
							gotoPage = 1;
							console.log('Navigation error: ', data.identifier, 'not found in any page');
						}

						break;
				}
			}

			//make the view visible
			this.getChildViewByIndex(gotoPage - 1).show();

			//calculate the page offset to move the page into view
			var offset = (gotoPage - 1) * (this.dimensions.innerSectionHeight) * -1;

			//TODO: add step to hide all other pages
			var pages = this.getChildViews();
			var numPages = pages.length;
			for(var i = 0; i < numPages; i++) {
				if (i !== (gotoPage - 1)) {
					pages[i].hide();
				}
			}

			//move all the pages to the proper offset
			this.$el.find("#pages").css({
				"-webkit-transform": "translate3d(0, " + offset + "px, 0)",
				"-moz-transform": "translate3d(0, " + offset + "px, 0)",
				"transform": "translate3d(0, " + offset + "px, 0)"
			});

			//trigger event so other elements can update with current page
			app.dispatcher.trigger("pageChanged", {page: gotoPage});

		}, this);

		this.$el.addClass("oscitk_multi_column");

		//set the default options
		_.defaults(this.options, {
			minColumnWidth : 200,
			maxColumnWidth : 300,
			gutterWidth : 40,
			minLinesPerColumn : 5,
			defaultLineHeight: 16
		});

		//initialize dimensions object
		this.dimensions = {};

		OsciTk.views.MultiColumnSection.__super__.initialize.call(this);
	},

	isElementVisible: function(elem) {
		//determine if it is visible
		var $elem = $(elem);
		var inColumn = $elem.parents(".column");
		var checkContainer = null;
		var visible = true;

		if (inColumn.length) {
			checkContainer = inColumn;
		} else {
			checkContainer = $elem.parents(".page");
		}

		if (checkContainer.length) {
			var position = $elem.position();
			if (position.top < 0 || position.top > checkContainer.height()) {
				visible = false;
			}
		}

		return visible;
	},

	preRender: function() {
		//make sure no figure views are hanging around
		app.views.figures = {};
	},

	renderContent: function() {
		this.$el.html(this.template());

		this.calculateDimensions();

		//setup location to store layout housekeeping information
		this.layoutData = {
			data : this.model.get('content'),
			items : null
		};

		//remove unwanted sections & parse sections
		this.cleanData();

		//create a placeholder for figures that do not fit on a page
		this.unplacedFigures = [];

		this.layoutData.items = this.layoutData.data.length;

		var i = 0;
		var firstOccurence = true;
		var paragraphNumber = 1;
		var paragraphsOnPage = 0;
		var itemsOnPage = 0;
		while(this.layoutData.items > 0) {
			var pageView = this.getPageForProcessing(undefined, "#pages");
			var layoutResults = null;
			var figureIds = [];

			if (!pageView.processingData.rendered) {
				itemsOnPage = 0;
				paragraphsOnPage = 0;
				pageView.render();

				//load any unplaced figures
				figureIds = figureIds.concat(this.unplacedFigures);
			}

			var content = $(this.layoutData.data[i]).clone();

			//Process any figures in the content
			var figureLinks = content.find("a.figure_reference");
			var numFigureLinks = figureLinks.length;
			var inlineFigures = content.find("figure");
			var numinlineFigures = inlineFigures.length;
			if (content.is("figure") || numFigureLinks || numinlineFigures || figureIds.length) {
				var j;

				if (content.is("figure")) {
					figureIds.push(content.attr("id"));
				}

				if (numFigureLinks) {
					for (j = 0; j < numFigureLinks; j++) {
						figureIds.push($(figureLinks[j]).attr("href").substring(1));
					}
				}

				if (numinlineFigures) {
					for (j = 0; j < numinlineFigures; j++) {
						var tempFigure = $(inlineFigures[j]).remove();
						figureIds.push(tempFigure.attr("id"));
					}
				}

				var numFigureIds = figureIds.length;
				for (j = 0; j < numFigureIds; j++) {
					var figure = app.collections.figures.get(figureIds[j]);
					var figureType = figure.get('type');
					var figureViewType = OsciTk.views.figureTypeRegistry[figureType] ? OsciTk.views.figureTypeRegistry[figureType] : OsciTk.views.figureTypeRegistry['default'];
					var figureViewInstance = this.getFigureView(figure.get('id'));

					if (!figureViewInstance) {
						//create instance and add it to app.views for ease of access
						app.views.figures[figureIds[j]] = figureViewInstance = new OsciTk.views[figureViewType]({
							model : figure,
							sectionDimensions : this.dimensions
						});
					}

					if (!figureViewInstance.layoutComplete) {
						if (pageView.addFigure(figureViewInstance)) {
							//figure was added to the page... restart page processing
							layoutResults = 'figurePlaced';
							var inUnplaced = _.indexOf(this.unplacedFigures, figureIds[j]);
							if (inUnplaced > -1) {
								this.unplacedFigures.splice(inUnplaced, 1);
							}
							break;
						} else {
							if (_.indexOf(this.unplacedFigures, figureIds[j]) === -1) {
								this.unplacedFigures.push(figureIds[j]);
							}
							if (content.is("figure")) {
								layoutResults = 'next';
							}
						}
					} else {
						if (content.is("figure")) {
							layoutResults = 'next';
						}
					}
				}
			}

			if (layoutResults === null) {
				if (firstOccurence) {
					content.attr('id', 'osci-content-' + i);
				}

				//add a data attribute for all content for when content is repeated it still has an identifier
				content.attr("data-osci_content_id", 'osci-content-' + i);

				if (content.is("p")) {
					content.attr("data-paragraph_number", paragraphNumber);
				}

				layoutResults = pageView.addContent(content).layoutContent();
			}

			switch (layoutResults) {
				case 'contentOverflow':
					firstOccurence = false;
					break;
				case 'figurePlaced':
					pageView.resetPage();

					paragraphNumber -= paragraphsOnPage;
					paragraphsOnPage = 0;

					this.layoutData.items += itemsOnPage;
					i -= itemsOnPage;
					itemsOnPage = 0;
					break;
				default:
					i++;
					this.layoutData.items--;
					itemsOnPage++;

					if (content.is("p")) {
						paragraphNumber++;
						paragraphsOnPage++;
					}

					firstOccurence = true;
			}
		}
	},

	calculateDimensions: function() {
		var dimensions = this.dimensions;

		//get window height / width
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		//min width to prevent lockup
		if (windowWidth < 300) {
			windowWidth = 300;
		}

		//min height to prevent lockup
		if (windowHeight < 300) {
			windowHeight = 300;
		}

		//if the window size did not change, no need to recalculate dimensions
		if (dimensions.windowWidth && dimensions.windowWidth === windowWidth && dimensions.windowHeight && dimensions.windowHeight === windowHeight) {
			return;
		}

		//cache the window height/width
		dimensions.windowHeight = windowHeight;
		dimensions.windowWidth = windowWidth;

		//copy gutter width out of the options for easy access
		dimensions.gutterWidth = this.options.gutterWidth;

		//copy minLinesPerColumn out of options for eacy access
		dimensions.minLinesPerColumn = this.options.minLinesPerColumn;

		//get the margins of the section container
		dimensions.sectionMargin = {
			left : parseInt(this.$el.css("margin-left"), 10),
			top : parseInt(this.$el.css("margin-top"), 10),
			right : parseInt(this.$el.css("margin-right"), 10),
			bottom : parseInt(this.$el.css("margin-bottom"), 10)
		};

		//get the padding of the section container
		dimensions.sectionPadding = {
			left : parseInt(this.$el.css("padding-left"), 10),
			top : parseInt(this.$el.css("padding-top"), 10),
			right : parseInt(this.$el.css("padding-right"), 10),
			bottom : parseInt(this.$el.css("padding-bottom"), 10)
		};

		//determine the correct height for the section container to eliminate scrolling
		dimensions.outerSectionHeight = windowHeight - dimensions.sectionMargin.top - dimensions.sectionMargin.bottom;
		dimensions.innerSectionHeight = dimensions.outerSectionHeight - dimensions.sectionPadding.top - dimensions.sectionPadding.bottom;

		//determine the correct width for the section container
		dimensions.outerSectionWidth = this.$el.outerWidth();
		dimensions.innerSectionWidth = dimensions.outerSectionWidth - dimensions.sectionPadding.left - dimensions.sectionPadding.right;

		//column width
		if (dimensions.innerSectionWidth < this.options.maxColumnWidth) {
			dimensions.columnWidth = dimensions.innerSectionWidth;
		} else {
			dimensions.columnWidth = this.options.maxColumnWidth;
		}

		//Determine the number of columns per page
		dimensions.columnsPerPage = Math.floor(dimensions.innerSectionWidth / dimensions.columnWidth);
		if (dimensions.innerSectionWidth < (dimensions.columnsPerPage * dimensions.columnWidth) + ((dimensions.columnsPerPage) * this.options.gutterWidth))
		{
			dimensions.columnsPerPage = dimensions.columnsPerPage - 1;
		}

		//If we ended up with no columns, force it to one column
		if (dimensions.columnsPerPage === 0) {
			dimensions.columnsPerPage = 1;
			dimensions.columnWidth = dimensions.innerSectionWidth - this.options.gutterWidth;
		}

		//Large gutters look ugly... reset column width if gutters get too big
		var gutterCheck = (dimensions.innerSectionWidth - (dimensions.columnsPerPage * dimensions.columnWidth)) / (dimensions.columnsPerPage);
		if (gutterCheck > this.options.gutterWidth) {
			dimensions.columnWidth = (dimensions.innerSectionWidth - (this.options.gutterWidth * (dimensions.columnsPerPage))) / dimensions.columnsPerPage;
		}
		dimensions.columnWidth = Math.floor(dimensions.columnWidth);

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

		//chunk the data into managable parts
		this.layoutData.data = this.layoutData.data.find('section').children();
	},

	getFigureView: function(figureId) {
		if (app.views.figures[figureId]) {
			return app.views.figures[figureId];
		}
	}
});
OsciTk.views.Navigation = OsciTk.views.BaseView.extend({
	id: 'navigation',
	template: OsciTk.templateManager.get('navigation'),
	initialize: function() {
		//set some defaults
		this.numPages = null;
		this.identifier = null;
		this.currentNavigationItem = null;
		this.page = null;

		// when section is loaded, render the navigation control
		app.dispatcher.on('layoutComplete', function(section) {
			if (this.identifier) {
				app.dispatcher.trigger("navigate", {identifier: this.identifier});
				this.identifier = null;
			}
			else {
				app.dispatcher.trigger("navigate", {page: 1});
			}
			this.numPages = section.numPages;
			this.render();
		}, this);

		app.dispatcher.on('pageChanged', function(info) {
			// clear old identifier in url
			// app.router.navigate("section/" + previous.id + "/end");
			this.page = info.page;
			this.update(info.page);
		}, this);

		// bind routedTo
		app.dispatcher.on('routedToSection', function(params) {
			this.identifier = params.identifier;
			if (!params.section_id) {
				// go to first section
				var sectionId = app.collections.navigationItems.at(0).id;
				this.setCurrentNavigationItem(sectionId);
				app.router.navigate("section/" + sectionId, {trigger: false});
			}
			else {
				// go to section_id
				this.setCurrentNavigationItem(params.section_id);
			}

			var title = app.models.docPackage.getTitle();
			title = (title) ? title + " | ": "";
			title += this.getCurrentNavigationItem().get('title');
			document.title = title;
		}, this);

		// Respond to keyboard events
		$(document).keydown(function(event) {
			var p;
			switch(event.which) {
				case 39:
					// Right arrow navigates to next page
					p = app.views.navigationView.page + 1;
					if (p > app.views.navigationView.numPages) {
						var next = app.views.navigationView.currentNavigationItem.get('next');
						if (next) {
							app.router.navigate("section/" + next.id, {trigger: true});
						}
					} else {
						app.dispatcher.trigger('navigate', {page: p});
					}
					break;
				case 37:
					// Left arrow navigates to previous page
					p = app.views.navigationView.page - 1;
					if (p < 1) {
						var previous = app.views.navigationView.currentNavigationItem.get('previous');
						if (previous) {
							app.router.navigate("section/" + previous.id + "/end", {trigger: true});
						}
					} else {
						app.dispatcher.trigger('navigate', {page: p});
					}
					break;
			}

		});

	},

	render: function() {

		this.$el.html(this.template({
			numPages: this.numPages,
			chapter: this.currentNavigationItem.get('title')
		}));

		// Hide the pager if there's only one page, show otherwise
		if (this.numPages == 1) {
			$('.pager').hide();
		} else {
			$('.pager').show();
		}

		// Calculate the width for the pager head
		var width = (100/this.numPages);
		$('.pager .head', this.$el).css('width', width + '%');

		// Navigate to the appropriate page when mousedown happens in the pager
		$('.pager').mousedown(function(data) {
			var p = parseInt(app.views.navigationView.numPages * data.offsetX / $(this).width(), 10);
			app.dispatcher.trigger('navigate', { page: p+1 });
		});

		// Do other things that can happen whenever the page changes
		this.update(this.page);

	},

	getCurrentNavigationItem: function(){
		return this.currentNavigationItem;
	},

	setCurrentNavigationItem: function(section_id) {
		this.currentNavigationItem = app.collections.navigationItems.get(section_id);
		app.dispatcher.trigger('currentNavigationItemChanged', this.currentNavigationItem);
	},

	update: function(page) {

		// Calculate the position of the pager head
		var width = (100/this.numPages);
		$('.pager .head', this.$el).css('left', width * (page-1) + '%');

		// unbind both controls to start
		this.$el.find('.prev-page').unbind('click');
		this.$el.find('.next-page').unbind('click');

		// Set previous button state
		if (page == 1) {
			// check if we can go to the previous section
			var previous = this.currentNavigationItem.get('previous');
			if (previous) {
				this.$el.find('.prev-page .label').html('Previous Section');
				this.$el.find('.prev-page').removeClass('inactive').click(function () {
					app.router.navigate("section/" + previous.id + "/end", {trigger: true});
				});
			}
			// on first page and no previous section, disable interaction
			else {
				$('.prev-page', this.$el).addClass('inactive').unbind('click');
			}
		} else if (this.numPages > 1) {
			var $this = this;
			this.$el.find('.prev-page .label').html('Previous');
			this.$el.find('.prev-page').removeClass('inactive').click(function () {
				app.router.navigate("section/" + $this.currentNavigationItem.id);
				app.dispatcher.trigger('navigate', {page:(page-1)});
			});
		}

		// Set next button state
		if (page == this.numPages) {
			// check if we can go to the next section
			var next = this.currentNavigationItem.get('next');
			if (next) {
				this.$el.find('.next-page .label').html('Next Section');
				this.$el.find('.next-page').removeClass('inactive').click(function () {
					app.router.navigate("section/" + next.id, {trigger: true});
				});
			}
			// on last page and no next section, disable interaction
			else {
				this.$el.find('.next-page').addClass('inactive').unbind('click');
			}
		} else if (this.numPages > 1) {
			this.$el.find('.next-page .label').html('Next');
			this.$el.find('.next-page').removeClass('inactive').click(function () {
				app.dispatcher.trigger('navigate', { page: page+1 });
			});
		}
	}
});
OsciTk.views.Notes = OsciTk.views.BaseView.extend({
	className: 'notes-view',
	template: OsciTk.templateManager.get('notes'),
	initialize: function() {
		// re-render this view when collection changes
		app.collections.notes.on('add remove change', function() {
			this.render();
		}, this);

		// catch the page changed event and highlight any notes in list that are on current page
		app.dispatcher.on('pageChanged notesLoaded', function(data) {
			var page;
			if (typeof(data.page) === 'undefined') {
				page = app.views.navigationView.page;
			}
			else {
				page = data.page;
			}
			pageView = app.views.sectionView.getChildViewByIndex(page - 1);
			_.each(app.collections.notes.models, function(note) {
				// reset to false
				note.set('onCurrentPage', false);
				// search for note's content id in current page
				var found = pageView.$el.find('#' + note.get('content_id'));
				if (found.length > 0) {
					note.set('onCurrentPage', true);
				}
			});
			this.render();
		}, this);
	},
	events: {
		"click .noteLink": "noteLinkClick"
	},
	noteLinkClick: function(e) {
		e.preventDefault();
		var target = $(e.target);
		var content_id = target.attr('data-content_id');
		if (content_id) {
			app.dispatcher.trigger('navigate', {identifier: content_id});
			app.dispatcher.trigger('toggleNoteDialog', { contentId: content_id });
			$('#'+content_id).click();
			app.views.toolbarView.contentClose();
		}
	},
	render: function() {
		var notes = this.getSavedNotes();
		this.$el.html(this.template({notes: notes}));
		this.active();

		return this;
	},
	getSavedNotes: function() {
		// filter notes - only return notes with ids (saved to server)
		var notes = _.filter(app.collections.notes.models, function(note) {
			if (note.id !== null) return true;
			return false;
		});
		return notes;
	},
	active: function() {
		// Set the width of the notes reel if there is more than one note
		if (app.collections.notes.length > 1) {
			var notes = this.$el.find('.notesListItem');
			this.$el.find('.notesList').width(notes.length * (notes.first().outerWidth(true)));
		}
	}
});
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
OsciTk.views.SearchResults = OsciTk.views.BaseView.extend({
	id: 'search-results-container',
	template: OsciTk.templateManager.get('search-results'),
	initialize: function(response) {
		console.log(response);
		this.searchResults = new OsciTk.collections.SearchResults({docs: response.docs});
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
	}
});
OsciTk.views.SearchResult = OsciTk.views.BaseView.extend({
	id: 'search-results-container',
	template: OsciTk.templateManager.get('search-result'),
	initialize: function(results) {
		this.render();
	},
	render: function() {
		this.$el.html(this.template());
	}
});
OsciTk.views.Search = OsciTk.views.BaseView.extend({
	id: 'search-view',
	className: 'toolbar-item-view',
	template: OsciTk.templateManager.get('search'),
	initialize: function() {
		// define defaults for the query
		this.query = {
			page: 0,
			keyword: null,
			filters: [],
			sort: null
		};

		// define results object
		this.response = {
			numFound: 0,
			docs: new OsciTk.collections.SearchResults(),
			facets: null
		};
		this.results = null;
		this.hasSearched = false;
		this.isLoading = false;
		this.resultsTemplate = OsciTk.templateManager.get('search-results');
	},
	events: {
		'submit #search-form': 'submitSearch',
		'click .search-result': 'gotoResult',
		'click .facet': 'addFacet',
		'click .filter': 'addFilter',
		'click #reset-search': 'resetSearch'
	},
	render: function() {
		this.$el.html(this.template(this));
	},
	renderResults: function() {
		this.prepareResults();
		this.$el.find("#search-results-wrapper").html(this.resultsTemplate(this));
	},
	resizeResultsContainer: function() {
		var containerSize = $('#toolbar-content').height();
		var searchHeaderSize = this.$el.find('#search-header').outerHeight();
		var resultsHeaderSize = this.$el.find('#search-results-header').outerHeight();

		var newContainerHeight = containerSize - searchHeaderSize - resultsHeaderSize;
		this.$el.find('#search-results-container').height(newContainerHeight);
	},
	search: function() {
		var that = this;

		// set keyword
		this.query.keyword = this.$el.find('#search-keyword').val();
		// reset collection
		this.response.docs.reset();
		// let the template know that we can now display results
		this.hasSearched = true;

		// build query params to send to api
		var queryParams = {
			key: this.query.keyword,
			group: 'true',
			page: this.query.page
		};

		if (this.query.filters.length) {
			queryParams['filters'] = this.query.filters.join(' ');
		}

		// send search query
		$.ajax({
			url: app.config.get('endpoints')['OsciTkSearch'],
			data: queryParams,
			success: function(data) {
				data = JSON.parse(data);
				if(data.numFound === 0) return;

				// add the incoming docs to the results collection
				that.response.docs.reset(data.docs);
				that.response.facets = data.facets;
				that.response.numFound = data.numFound;
				// re-render the search view
				that.renderResults();
				// handle container resizing
				app.views.toolbarView.contentOpen();
				that.resizeResultsContainer();
				// set scroll position to last known
			},
			error: function() {
				// error handling
			}
		});
	},
	prepareResults: function() {
		this.results = _.groupBy(this.response.docs.models, function(doc) {
			return doc.get('ss_section_id');
		});
	},
	gotoResult: function(e) {
		var $elem = $(e.currentTarget);
		var resultModel = this.response.docs.get($elem.data("id"));

		app.router.navigate("section/" + resultModel.get("ss_section_id") + "/" + resultModel.get("id"), {trigger: true});
		app.views.toolbarView.contentClose();
	},
	addFilter: function(e) {
		e.preventDefault();
		var filter = $(e.currentTarget).data('filter');
		var exists = _.indexOf(this.query.filters, filter);

		this.$el.find(".filter").removeClass("active");

		//remove type filters (only one at a time)
		this.query.filters = _.reject(this.query.filters, function(filter) {
			return filter.indexOf("type:") === 0;
		});

		//if filter wasn't in list add it
		if (exists === -1) {
			this.query.filters.push(filter);
			$(e.currentTarget).addClass("active");
		}

		if (this.hasSearched) {
			this.search();
		}
	},
	addFacet: function(e) {
		e.preventDefault();
		var facet = $(e.currentTarget).data('filter');
		this.query.filters.push(facet);

		if (this.hasSearched) {
			this.search();
		}
	},
	submitSearch: function(e) {
		e.preventDefault();
		this.search();
	},
	resetSearch: function(e) {
		e.preventDefault();
		e.stopPropagation();

		this.initialize();
		this.$el.find("#search-results-header").remove();
		this.$el.find("#search-results-container").remove();
		this.$el.find("#search-keyword").val("");

		app.views.toolbarView.contentOpen();
		this.resizeResultsContainer();
	}
});
OsciTk.views.Title = OsciTk.views.BaseView.extend({
	className: 'title-view',
	template: OsciTk.templateManager.get('title'),
	initialize: function() {
		app.dispatcher.on('packageLoaded', function(packageModel) {
			var title = packageModel.getTitle();
			if (title) {
				this.$el.find("#publication-title").text(title);
			}
		}, this);

		this.render();
	},
	render: function() {
		this.$el.html(this.template());
		return this;
	},
	events: {
		"click #publication-title": function(e) {
			e.preventDefault();
			app.dispatcher.trigger('navigate', {identifier: "start"});
		}
	}
});
OsciTk.views.Toc = OsciTk.views.BaseView.extend({
	className: 'toc-view',
	template: OsciTk.templateManager.get('toc'),
	events: {
		'click li a': 'itemClick'
	},
	initialize: function() {
		this.parent = this.options.parent;

		app.dispatcher.on("currentNavigationItemChanged", function() {
			this.render();
		}, this);
	},
	render: function() {
		this.$el.html(this.template({
			items: app.collections.navigationItems.where({depth: 0})
		}));
	},
	itemClick: function(event) {
		event.preventDefault();

		var sectionId = $(event.currentTarget).attr('data-section-id');
		// app.dispatcher.trigger('navigateToSection', sectionId);
		// TODO: don't really want to address the appRouter directly
		app.router.navigate("section/" + sectionId, {trigger: true});
		app.views.toolbarView.contentClose();
	},
	active: function() {
		var containerSize = $('#toolbar-content').height();
		var headerSize = this.$el.find("h3").outerHeight();

		var newContainerHeight = containerSize - headerSize;
		this.$el.find("ul").height(newContainerHeight);
	}
});
OsciTk.views.ToolbarItem = OsciTk.views.BaseView.extend({
	className: 'toolbar-item',
	template: OsciTk.templateManager.get('toolbar-item'),
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
	onClose: function() {
		this.contentView.close();
	},
	render: function() {
		this.contentView = new OsciTk.views[this.options.toolbarItem.view]({parent: this});
		this.$el.html(this.template({
			text: this.options.toolbarItem.text
		}));
	},
	itemClicked: function(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!this.contentViewRendered) {
			this.contentView.render();
			this.contentViewRendered = true;
		}

		this.parent.setActiveToolbarItemView(this);
		this.parent.toggleContentView();

		if (this.contentView.active) {
			this.contentView.active();
		}
	}
});
OsciTk.views.Toolbar = OsciTk.views.BaseView.extend({
	id: 'toolbar',
	template: OsciTk.templateManager.get('toolbar'),
	initialize: function() {
		// if toolbar items were provided, store them in the view
		this.toolbarItems = app.config.get('toolbarItems') ? app.config.get('toolbarItems') : [];

		// tracks the state of the content area drawer
		this.isContentOpen = false;
		this.activeToolbarItemView = undefined;
		this.activeToolbarItemViewChanged = false;
		this.render();

		app.dispatcher.on("packageLoaded", function(packageModel) {
			//Add the publication title to the Toolbar
			var title = packageModel.getTitle();
			if (title) {
				this.$el.find("#toolbar-title").text(title);
			}
		}, this);

		//Close the toolbar if a user clicks outside of it
		$(window).on("click", {view: this}, function(e) {
			var target = $(e.target).parents('#' + e.data.view.id);
			if (e.data.view.isContentOpen && target.length === 0) {
				e.data.view.contentClose();
			}
		});
	},
	events: {
		"click #toolbar-close": "contentClose"
	},
	render: function() {
		this.$el.html(this.template());

		_.each(this.toolbarItems, function(toolbarItem) {
			var item = new OsciTk.views.ToolbarItem({toolbarItem: toolbarItem});
			this.addView(item, '#toolbar-handle');
			item.render();
		}, this);
	},
	setActiveToolbarItemView: function(view) {
		if ((this.activeToolbarItemView && view.cid !== this.activeToolbarItemView.cid) || this.activeToolbarItemView === undefined) {
			this.activeToolbarItemViewChanged = true;
			if (this.activeToolbarItemView) {
				this.activeToolbarItemView.contentView.$el.detach();
			}
		} else {
			this.activeToolbarItemViewChanged = false;
		}
		this.activeToolbarItemView = view;
		this.$el.find("#toolbar-content").html(view.contentView.$el);

		//Redelegate events for contentView
		view.contentView.delegateEvents();

		return this;
	},
	toggleContentView: function() {
		//toolbar closed, open it
		if (!this.isContentOpen) {
			this.contentOpen();
			return this;
		}

		//close the toolbar the same toolbar item view was clicked
		if (!this.activeToolbarItemViewChanged) {
			this.contentClose();
			return this;
		//update the height for the new view
		} else {
			this.updateHeight();
			return this;
		}
	},
	contentOpen: function() {
		this.updateHeight();

		this.isContentOpen = true;
	},
	updateHeight: function() {
		var toolbarContent = this.$el.find('#toolbar-content');

		var toolbarHeight = this.$el.height();
		//clear height form content or resize does not work
		toolbarContent.height("");
		var toolbarContentHeight = toolbarContent.height();

		var toolbarTitleHeight = $('#toolbar-title-container').outerHeight();

		if (toolbarContentHeight > (toolbarHeight - toolbarTitleHeight)) {
			toolbarContent.height((toolbarHeight - toolbarTitleHeight) + 'px');
		} else {
			toolbarContent.height('');
		}

		this.$el.css({
			top: 0
		});
	},
	contentClose: function() {
		this.$el.css({
			top: '-' + this.$el.height() + 'px'
		});

		this.isContentOpen = false;
	}
});
var $ = jQuery;

var LICollection = function() {
	var collection = [];

	this.add = function(asset) {
		var i, count;

		// check that this asset isn't already in the collection
		for (i=0, count = collection.length; i < count; i++) {
			if (collection[i].id == asset.id) {
				return false;
			}
		}
		collection.push(asset);
		return true;
	};

	this.remove = function(asset) {
		var i, count;
		// allow an asset or a string id to be passed in
		if (typeof asset == "string") {
			asset = {id: asset};
		}

		// find this asset in the collection by id
		for (i=0, count = collection.length; i < count; i++) {
			if (collection[i].id == asset.id) {
				collection.splice(i, 1);
			}
		}
	};

	this.find = function(id) {
		var i, count;
		for (i=0, count = collection.length; i < count; i++) {
			if (collection[i].id == id) {
				return collection[i];
			}
		}
		return false;
	};

	this.list = function() {
		return collection;
	};

	this.userIsDraggingAsset = false;
};


var LayeredImage = function(container) { // container should be a html element
	var i, count, layerData;

	// check prereqs
	if (jQuery !== undefined) {
		var $ = this.$ = jQuery;
	}
	else return false;
	if (org.polymaps !== undefined) {
		this.polymaps = org.polymaps;
	}
	else return false;

	// turn the element into a jQuery object
	this.container = $(container);

	// ensure we have something to work on
	if (this.container.length < 1) {
		return false;
	}

	// push this new asset into the registry, only render if not already present
	if (!window.liCollection.add(this)) {
		return;
	}

	// load the layered image id and configuration
	this.id = this.container.attr('id');
	this.settings = this.container.data();
	this.settings.zoomStep = this.settings.zoomStep || 0.1;
	this.settings.annotationSelectorVisible = false;
	this.settings.dragging = undefined;

	// detect and incorporate figure options
	var figure = this.container.parents('figure:first');
	var optString = figure.attr('data-options');
	if (figure.length > 0 && optString) {
		this.figureOptions = JSON.parse(optString);
	}
	// provide defaults if options not set
	if (!this.figureOptions) {
		this.figureOptions = {
			disable_interaction: false,
			disable_annotation: false,
			sliderPosition: 0
		};
	}
	if (!this.figureOptions.sliderPosition) {
		this.figureOptions.sliderPosition = 0;
	}
	// detect and incorporate the caption if it exists
	this.settings.captionMarkup = this.container.parents('figure:first').find('figcaption').clone();

	// store a copy of the original html - will be used to
	// regenerate markup for fullscreen
	this.settings.originalMarkup = outerHTML(this.container[0]);

	// extract the layer data
	this.layers = [];
	var layerContainer = this.container.find('.layered_image-layers');
	var layerItems = layerContainer.find('li');
	for (i=0, count = layerItems.length; i < count; i++) {
		var layerMarkup = $(layerItems[i]);
		this.layers.push(layerMarkup.data());
	}
	layerContainer.remove();

	// sort the layers so that annotations are always last (on top)
	this.layers.sort(function(a,b) {
		var layer1 = a.annotation;
		var layer2 = b.annotation;
		if (layer1 == layer2) return 0;
		if (layer1 && !layer2) return 1;
		if (!layer1 && layer2) return -1;
		return 0;
	});

	// we must order their layer_num properties
	// also create separate arrays of base and annotation layers for convenience
	this.baseLayers = [];
	this.annotationLayers = [];
	for (i=0, count = this.layers.length; i < count; i++) {
		layerData = this.layers[i];
		layerData.layer_num = i + 1;
		if (layerData.annotation) {
			this.annotationLayers.push(layerData);
		}
		else {
			this.baseLayers.push(layerData);
		}
	}

	// initialize the container as a polymap
	this.map = this.polymaps.map();
	this.map.container(this.container[0].appendChild(this.polymaps.svg('svg')));
	this.map.tileSize({
		x: 256,
		y: 256
	});

	// calculate zoom levels if not already present
	for (i=0, count = this.layers.length; i < count; i++) {
		layerData = this.layers[i];
		if (!layerData.zoom_levels) {
			layerData.zoom_levels = this.getZoomLevels(layerData.width, layerData.height);
		}
	}
	// create the first two layers, using preset data if available
	var baseLayerPreset = this.figureOptions.baseLayerPreset ? this.figureOptions.baseLayerPreset : [],
		numBaseLayerPresets = baseLayerPreset.length,
		usedPresetLayers = false;

	if (numBaseLayerPresets > 0) {
		var firstLayer = this.getLayerById(baseLayerPreset[0]);
		var secondLayer;

		if (numBaseLayerPresets > 1) {
			secondLayer = this.getLayerById(baseLayerPreset[1]);
		}

		if (firstLayer && (secondLayer || numBaseLayerPresets == 1)) {
			this.createLayer(firstLayer);

			if (secondLayer) {
				this.createLayer(secondLayer);
				$('#' + secondLayer.id).css('opacity', 0);
			}

			usedPresetLayers = true;
		}
	}

	if (!usedPresetLayers && this.baseLayers.length) {
		// create first layer, second layer, and make second transparent
		this.createLayer(this.baseLayers[0]);
		if (this.baseLayers[1]) {
			this.createLayer(this.baseLayers[1]);
			$('#' + this.baseLayers[1].id).css('opacity', 0);
		}
	}

	// create control interface
	this.createUI();

	// if any annotation presets are present, display those layers
	this.showAnnotationPresets();

	// fit to the map to its container and set the zoom range
	this.zoomToContainer();

	// if fullscreen extents are present, this CA needs to be positioned
	// as its parent was
	var extents = [];
	if (this.figureOptions.fullscreenExtents) {
		extents = [
			{
				lon: this.figureOptions.fullscreenExtents.swLon,
				lat: this.figureOptions.fullscreenExtents.swLat
			},
			{
				lon: this.figureOptions.fullscreenExtents.neLon,
				lat: this.figureOptions.fullscreenExtents.neLat
			}
		];
		this.setExtents(extents);
	}
	// else use the starting postion from the figure options markup
	// - if initial extents were given, honor them
	else if (this.figureOptions.swLat) {
		extents = [
			{
				lon: this.figureOptions.swLon,
				lat: this.figureOptions.swLat
			},
			{
				lon: this.figureOptions.neLon,
				lat: this.figureOptions.neLat
			}
		];
		this.setExtents(extents);
	}
};


LayeredImage.prototype.createLayer = function(layerData) {
	// alias jquery
	var $ = this.$;
	var layer;

	if (layerData === undefined) {
		return;
	}

	// provide zoom_levels if missing
	if (!layerData.zoom_levels) {
		layerData.zoom_levels = this.getZoomLevels(layerData.width, layerData.height);
	}

	// determine type of layer
	if (layerData.type == 'image') {
		layer = this.createLayerImage(layerData);
	}
	if (layerData.type == 'iip') {
		layer = this.createLayerIIP(layerData);
	}
	if (layerData.type == 'svg') {
		layer = this.createLayerSVG(layerData);
	}

	// flag the layer as visible and
	// give the layer a reference to its polymap object
	layerData.visible = true;
	layerData.polymapLayer = layer;

	// give the layer its id, and add it to the map
	layer.id(layerData.id);
	this.map.add(layer);

};


LayeredImage.prototype.removeLayer = function(layerData) {
	if (layerData.polymapLayer) {
		this.map.remove(layerData.polymapLayer);
	}
	layerData.polymapLayer = undefined;
	layerData.visible = false;
};


LayeredImage.prototype.toggleLayer = function(layerData) {
	if (layerData.visible) {
		this.removeLayer(layerData);
	}
	else {
		this.createLayer(layerData);
	}
};

LayeredImage.prototype.repaintLayer = function(layerData) {
	this.removeLayer(layerData);
	this.createLayer(layerData);
};

LayeredImage.prototype.createLayerIIP = function(layerData) {
	var CA = this;
	var layer = this.polymaps.image();
	var tileLoader = function(c) {
		var iipsrv = layerData.ptiff_server;
		var ptiff = layerData.ptiff_path;
		var image_h = layerData.height;
		var image_w = layerData.width;
		var tile_size = 256;
		var scale = CA.getScale(layerData.zoom_levels - 1, c.zoom);
		//var scale = CA.getScale(layerData.zoom_levels, c.zoom);
		var mw = Math.round(image_w / scale);
		var mh = Math.round(image_h / scale);
		var tw = Math.ceil(mw / tile_size);
		var th = Math.ceil(mh / tile_size);
		if (c.row < 0 || c.row >= th || c.column < 0 || c.column >= tw) return null;
		if (c.row == (th - 1)) {
			c.element.setAttribute("height", mh % tile_size);
		}
		if (c.column == (tw - 1)) {
			c.element.setAttribute("width", mw % tile_size);
		}
		var ret =  iipsrv+"?fif="+ptiff+"&jtl="+(c.zoom)+","+((c.row * tw) + c.column);
		return ret;
	};
	layer.url(tileLoader);
	return layer;
};


LayeredImage.prototype.createLayerImage = function(layerData) {
	// alias polymaps, as our load and unload functions change "this" inside
	var CA = this;
	var load = function(tile) {
		var scale = CA.getScale(layerData.zoom_levels, tile.zoom);
		tile.element = CA.polymaps.svg('image');
		tile.element.setAttribute("preserveAspectRatio", "none");
		tile.element.setAttribute("x", 0);
		tile.element.setAttribute("y", 0);
		tile.element.setAttribute("width", layerData.width / scale);
		tile.element.setAttribute("height", layerData.height / scale);
		tile.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", layerData.image_path);
		tile.ready = true;
	};

	var unload = function(tile) {
		if (tile.request) tile.request.abort(true);
	};

	var layer = this.polymaps.layer(load, unload).tile(false);
	return layer;
};


LayeredImage.prototype.createLayerSVG = function(layerData) {
	// alias polymaps, as our load and unload functions change "this" inside
	var CA = this;
	var load = function(tile) {
		var scale = CA.getScale(layerData.zoom_levels, tile.zoom);
		tile.element = CA.polymaps.svg('image');
		tile.element.setAttribute("preserveAspectRatio", "none");
		tile.element.setAttribute("x", 0);
		tile.element.setAttribute("y", 0);
		tile.element.setAttribute("width", layerData.width / scale);
		tile.element.setAttribute("height", layerData.height / scale);
		tile.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", layerData.svg_path);
		tile.ready = true;
	};

	var unload = function(tile) {
		if (tile.request) tile.request.abort(true);
	};

	var layer = this.polymaps.layer(load, unload).tile(false);
	return layer;
};


LayeredImage.prototype.zoomToContainer = function() {
	// always calculate at the highest possible zoom, 18,
	// for max fineness of alignment
	var zoomToCalculateAt = 18, i, count;

	// calculate tw and th for each layer
	for (i=0, count = this.layers.length; i < count; i++) {
		var layerData = this.layers[i];
		var scale = this.getScale(layerData.zoom_levels - 0, zoomToCalculateAt);
		// TODO: figure out why this is a special case:
		if (layerData.type == 'iip') {
			scale = this.getScale(layerData.zoom_levels - 1, zoomToCalculateAt);
		}
		var mw = Math.round(layerData.width / scale);
		var mh = Math.round(layerData.height / scale);
		var tw = Math.ceil(mw / this.map.tileSize().x);
		var th = Math.ceil(mh / this.map.tileSize().y);
		layerData.tiles_wide = tw;
		layerData.tiles_high = th;
		layerData.tiles_zoom = zoomToCalculateAt;
	}

	// scan the layers and find the greatest extents
	var tiles_wide = 0;
	var tiles_high = 0;
	for (i=0, count = this.layers.length; i < count; i++) {
		if (this.layers[i].tiles_high > tiles_high) {
			tiles_high = this.layers[i].tiles_high;
		}
		if (this.layers[i].tiles_wide > tiles_wide) {
			tiles_wide = this.layers[i].tiles_wide;
		}
	}

	// now that we know our max extents, calculate the
	// southwest and northeast corners to fit in container
	this.settings.containerFitSW = this.map.coordinateLocation({
		zoom: zoomToCalculateAt,
		column: 0,
		row: tiles_high
	});
	this.settings.containerFitNE = this.map.coordinateLocation({
		zoom: zoomToCalculateAt,
		column: tiles_wide,
		row: 0
	});

	// apply those extents to the map, bringing all our layers into view
	this.map.extent([this.settings.containerFitSW, this.settings.containerFitNE]);

	// now that the image is zoomed to fit it's container, store the
	// "to fit" zoom level so we can recall it later
	this.settings.containerFitZoomLevel = this.map.zoom();

	// reset the zoom range
	this.resetZoomRange(this.settings.containerFitZoomLevel);
};


LayeredImage.prototype.createUI = function() {
	// local aliases
	var $ = this.$, CA = this, fullscreenClass, currentLayer;

	// hook up polymap drag interaction
	if (!this.figureOptions.disable_interaction || this.figureOptions.editing) {
		this.map
			.add(this.polymaps.drag())
			.add(this.polymaps.wheel())
			.add(this.polymaps.dblclick())
			.add(this.polymaps.touch());

		// we need to augment the polymap event handlers, since the built in polymaps
		// wheel interaction doesn't allow us to update our user interface controls
		$(this.container).bind({
			'mousewheel' : function(event) {
				CA.ui.zoomSlider.slider('value', CA.map.zoom());

				//refresh the viewport if displayed
				CA.refreshViewfinderViewport();
			},
			'DOMMouseScroll' : function(event) {
				CA.ui.zoomSlider.slider('value', CA.map.zoom());

				//refresh the viewport if displayed
				CA.refreshViewfinderViewport();
			},
			'dblclick' : function(event) {
				CA.ui.zoomSlider.slider('value', CA.map.zoom());

				//refresh the viewport if displayed
				CA.refreshViewfinderViewport();
			},
			'mousedown' : function(event) {
				CA.settings.dragging = {
					x: event.clientX,
					y: event.clientY
				};
				liCollection.userIsDraggingAsset = CA.id;
			}
		});
	}

	// init ui object
	this.ui = {};
	this.ui.legendItemsCount = 0;

	// init bottom control bar
	this.ui.controlbar = $('<div class="ca-ui-controlbar"></div>');

	// fullscreen control
	if (this.settings.collapsed) {
		fullscreenClass = "collapsed";
	}
	else {
		fullscreenClass = "expanded";
	}
	this.ui.fullscreen = $('<div class="ca-ui-fullscreen '+fullscreenClass+'"></div>')
	.bind('click', function() {
		if (CA.settings.collapsed) {
			CA.fullscreen();
		}
		else {
			window.liCollection.remove(CA);
			$('.ca-ui-fullscreen-modal').remove();
			if (window.scrollOffset) {
				window.scrollTo(window.scrollOffset[0], window.scrollOffset[1]);
			}
		}
	})
	.appendTo(this.ui.controlbar);

	// reset control
	this.ui.reset = $('<div class="ca-ui-reset"></div>')
	.bind('click', function(event) {
		CA.reset();
	});
	if (!this.figureOptions.disable_interaction || this.figureOptions.editing) {
		this.ui.reset.appendTo(this.ui.controlbar);
	}

	// annotation control
	if (this.annotationLayers.length > 0) {
		this.ui.annotation = $('<div class="ca-ui-annotation"></div>')
			.bind('click', function(event) {
				CA.toggleAnnotationSelector();
			});
		if (!this.figureOptions.disable_annotation || this.figureOptions.editing) {
			this.ui.annotation.appendTo(this.ui.controlbar);
		}
	}

	// layer controls
	var baseLayers = this.getVisibleBaseLayers();
	this.settings.currentLayer1 = baseLayers[0];
	if (baseLayers.length > 1) {
		this.settings.currentLayer2 = baseLayers[1];

		// layer selector
		this.ui.layerSelector = $('<div class="ca-ui-layer-selector"></div>');

		// only provide selectable layers if there are at least three
		if (this.baseLayers.length > 2) {
			this.ui.layerSelector
			.bind('click', {
				layeredImage: this
			}, this.toggleLayerSelector);
		}
		if (!this.figureOptions.disable_interaction || this.figureOptions.editing) {
			this.ui.controlbar.append(this.ui.layerSelector);
		}

		// opacity slider
		this.ui.sliderContainer = $('<div class="ca-ui-layer-slider-container"></div>');
		this.ui.sliderLayerText = $('<div class="ca-ui-layer-slider-layer-text"></div>')
			.text(this.settings.currentLayer1.title + " - " + this.settings.currentLayer2.title)
			.appendTo(this.ui.sliderContainer);
		this.ui.slider = $('<div class="ca-ui-layer-slider"></div>')
			.slider({
				slide: function(event, ui) {
					// set the opacity of layers
					// var primaryOpacity = (100 - ui.value) / 100;
					var secondaryOpacity = ui.value / 100;
					// $('#'+CA.settings.currentLayer1.id).css('opacity', primaryOpacity);
					$('#'+CA.settings.currentLayer2.id).css('opacity', secondaryOpacity);
					CA.refreshViewfinderOpacity(secondaryOpacity);
				},
				change: function(event, ui) {
					var secondaryOpacity = ui.value / 100;
					$('#'+CA.settings.currentLayer2.id).css('opacity', secondaryOpacity);
					CA.refreshViewfinderOpacity(secondaryOpacity);
				}
			})
			.appendTo(this.ui.sliderContainer);

		if (!this.figureOptions.disable_interaction || this.figureOptions.editing) {
			this.ui.sliderContainer.appendTo(this.ui.controlbar);
			this.ui.layerSelector.after(this.ui.sliderContainer);
		}
		// restore preset if available
		if (this.figureOptions.sliderPosition !== undefined) {
			this.ui.slider.slider('value', this.figureOptions.sliderPosition);
		}
	}

	// add controlbar to container
	this.ui.controlbar.appendTo(this.container);
	this.resizeControlBar();

	// zoom control
	this.ui.zoom = $('<div class="ca-ui-zoom"></div>');

	this.ui.zoomIn = $('<div class="ca-ui-zoom-in"></div>')
	.bind('click', function(event) {
		var currentVal = CA.ui.zoomSlider.slider('value');
		var newVal = currentVal + CA.settings.zoomStep;
		CA.ui.zoomSlider.slider('value', newVal);
		CA.map.zoom(newVal);
	})
	.appendTo(this.ui.zoom);

	this.ui.zoomSlider = $('<div class="ca-ui-zoom-slider"></div>')
	.slider({
		step: this.settings.zoomStep,
		orientation: 'vertical',
		slide: function(event, ui) {
			var newZoom = ui.value;
			var currentZoom = CA.map.zoom();
			if (newZoom != currentZoom) {
				CA.map.zoom(newZoom);
			}
		}
	})
	.appendTo(this.ui.zoom);

	this.ui.zoomOut = $('<div class="ca-ui-zoom-out"></div>')
	.bind('click', function(event) {
		// get the current value, and add one to it
		var currentVal = CA.ui.zoomSlider.slider('value');
		var newVal = currentVal - CA.settings.zoomStep;
		CA.ui.zoomSlider.slider('value', newVal);
		CA.map.zoom(newVal);
	})
	.appendTo(this.ui.zoom);
	if (!this.figureOptions.disable_interaction || this.figureOptions.editing) {
		this.ui.zoom.appendTo(this.container);
	}

	// viewfinder control
	this.ui.viewfinder = $('<div class="ca-ui-viewfinder viewfinder-closed"></div>');

	if (!this.figureOptions.disable_interaction || this.figureOptions.editing) {
		this.ui.viewfinder.appendTo(this.container);
	}

	this.ui.viewfinder.bind('click', function(event) {
		if (CA.ui.viewfinder.hasClass('viewfinder-open')) {
			// close
			CA.ui.viewfinder.empty().css('height', '');
			CA.ui.viewfinder.removeClass('viewfinder-open').addClass('viewfinder-closed');
			CA.ui.viewfinderViewport = null;
		}
		else {
			// open
			CA.ui.viewfinder.removeClass('viewfinder-closed').addClass('viewfinder-open');
			CA.refreshViewfinder();
		}
	});

	// store references to the control elements, so they can be manipulated as a collection
	this.ui.controls = [this.ui.controlbar, this.ui.zoom, this.ui.viewfinder, this.ui.currentPopup, this.ui.annotation, this.ui.layerSelector];

	// configure events to show/hide controls
	this.container.bind('mousemove', function(event) {
		var container = CA.container;
		var date = new Date();

		container.attr('data-controls-time', date.getTime());
		var controlState = container.attr('data-controls') || 'false';
		if (controlState == 'false') {
			// ensure no other CA has its controls up
			var assets = window.liCollection.list();
			for (var i=0, count = assets.length; i < count; i++) {
				var asset = assets[i];
				if (asset.container.attr('data-controls') == 'true') {
					asset.container.attr('data-controls', 'false');
					asset.toggleControls();
				}
			}
			// turn on this CA's controls
			container.attr('data-controls', 'true');
			CA.toggleControls();
		}
		CA.ui.controlsTimeout = setTimeout(function() {
			var date = new Date();
			// check if the mouse is over a control, if it is, don't hide
			if (container.attr('data-controls') == 'true' &&
				(date.getTime() - container.attr('data-controls-time')) >= 1750) {

				if (container.attr('data-controls-lock') != 'true') {
					container.attr('data-controls', 'false');
					CA.clearPopups();
					CA.toggleControls();
				}
			}
		}, 2000);
	});
	// mousing over a control locks them "on"
	$.each(this.ui.controls, function() {
		// test if this is still around.  we include popups, and other transients
		if (typeof(this.bind) == 'function') {
			this.bind('mouseenter', function() {
				CA.container.attr('data-controls-lock', 'true');
			});
			this.bind('mouseleave', function() {
				CA.container.attr('data-controls-lock', 'false');
			});
		}
	});
};

LayeredImage.prototype.reset = function() {
	var $ = this.$, i, count,
		CA = this;

	CA.clearPopups();

	// reset to provided inset, or container bounds otherwise
	if (typeof CA.figureOptions.swLat != 'undefined' && !CA.figureOptions.editing) {
		var extents =  [
			{
				lon: CA.figureOptions.swLon,
				lat: CA.figureOptions.swLat
			},
			{
				lon: CA.figureOptions.neLon,
				lat: CA.figureOptions.neLat
			}
			];
		CA.map.extent(extents);
	}
	else {
		CA.zoomToContainer();
	}
	// correct zoom control to reflect new zoom
	CA.ui.zoomSlider.slider('value', CA.map.zoom());

	// reset initial slider position
	if (CA.figureOptions.sliderPosition !== undefined) {
		if (CA.ui.slider) {
			CA.ui.slider.slider('value', CA.figureOptions.sliderPosition);
		}
	}
	/*
	 * Reset original layer selection
	 */
	var baseLayers;
	if (CA.figureOptions.baseLayerPreset) {
		baseLayers = [];
		for (i=0, count = CA.figureOptions.baseLayerPreset.length; i < count; i++) {
			baseLayers.push(CA.getLayerById(CA.figureOptions.baseLayerPreset[i]));
		}
	}
	else {
		baseLayers = CA.baseLayers;
	}
	for (i = 0, count = baseLayers.length; i < count && i < 2; i++) {
		currentLayer = CA.settings['currentLayer' + (i + 1)];
		// turn off current layer
		CA.toggleLayer(currentLayer);
		// turn on new
		CA.toggleLayer(baseLayers[i]);
		// upkeep state
		CA.settings['currentLayer' + (i + 1)] = baseLayers[i];
		// update layer selector ui
		if (CA.ui['layerSelector' + (i + 1)]) {
			CA.ui['layerSelector'+ (i + 1)].find('span').html(baseLayers[i].title);
		}
	}
	// if more than one layer, restore transparency setting
	if (baseLayers.length > 1 && CA.ui.slider) {
		$('#'+CA.settings.currentLayer2.id).css('opacity', CA.ui.slider.slider('value') / 100);
		if (CA.ui.viewfinderLayer2) {
			CA.ui.viewfinderLayer2.css('opacity', CA.ui.slider.slider('value') / 100);
		}
	}

	// reset annotation layer visibility
	CA.showAnnotationPresets();
};


LayeredImage.prototype.refreshViewfinder = function() {
	var $ = this.$;
	var CA = this;
	// first clear out any contents
	this.ui.viewfinder.empty();

	// get image urls from current layers
	var thumbUrl1 = this.settings.currentLayer1.thumb;
	this.ui.viewfinderLayer1 = $('<div class="ca-ui-viewfinderLayer viewfinderLayer1"></div>');
	$('<img />').attr('src', thumbUrl1).appendTo(this.ui.viewfinderLayer1);
	this.ui.viewfinder.append(this.ui.viewfinderLayer1);

	if (this.settings.currentLayer2) {
		var thumbUrl2 = this.settings.currentLayer2.thumb;
		this.ui.viewfinderLayer2 = $('<div class="ca-ui-viewfinderLayer viewfinderLayer2"></div>');
		$('<img />').attr('src', thumbUrl2).appendTo(this.ui.viewfinderLayer2);
		this.ui.viewfinder.append(this.ui.viewfinderLayer2);
		// set opacity to match
		this.ui.viewfinderLayer2.css('opacity', this.ui.slider.slider("value") / 100);
	}

	// set height based on width and aspect
	var vfWidth = this.ui.viewfinder.width();
	var vfHeight = Math.floor(vfWidth / this.settings.aspect);
	this.ui.viewfinder.height(vfHeight);

	// bounds div
	this.refreshViewfinderViewport();

	// - hook up drag events so the div can be dragged
	// - when dragged reflect the change on the map
};


LayeredImage.prototype.refreshViewfinderViewport = function() {

	if (this.ui.viewfinder.hasClass('viewfinder-open')) {
		var $ = this.$;
		var vfWidth = this.ui.viewfinder.width();
		var vfHeight = Math.floor(vfWidth / this.settings.aspect);

		// - draw the div and position it
		if (!this.ui.viewfinderViewport) {
			this.ui.viewfinderViewport = $('<div class="ca-ui-viewfinder-viewport">&nbsp;</div>').appendTo(this.ui.viewfinder);

			if (this.settings.viewPortBorderWidth === undefined) {
				this.settings.viewPortBorderWidth = parseInt(this.ui.viewfinderViewport.css("border-left-width"), 10);
			}
		}

		// calculate inset percentage on all sides
		var pointSW = this.map.locationPoint(this.settings.containerFitSW);
		var pointNE = this.map.locationPoint(this.settings.containerFitNE);

		//calculate the top left offsets
		var offsetX = (((pointSW.x * -1.0) / (pointNE.x - pointSW.x)) * vfWidth) - this.settings.viewPortBorderWidth;
		var offsetY = (((pointNE.y * -1.0) / (pointSW.y - pointNE.y)) * vfHeight) - this.settings.viewPortBorderWidth;

		// calculate the height and width of the viewport
		var ratioX = this.map.size().x / (pointNE.x - pointSW.x);
		var ratioY = this.map.size().y / (pointSW.y - pointNE.y);

		var vpWidth = ratioX * vfWidth;
		var vpHeight = ratioY * vfHeight;

		this.ui.viewfinderViewport.css({
			top : offsetY + "px",
			left : offsetX + "px",
			width : vpWidth + "px",
			height : vpHeight + "px"
		});
	}
};


LayeredImage.prototype.refreshViewfinderOpacity = function(opacity) {
	if (this.ui.viewfinderLayer2) {
		this.ui.viewfinderLayer2.css('opacity', opacity);
	}
};


LayeredImage.prototype.fullscreen = function(reset) {
	var $ = this.$;
	var CA = this;

	// create a parent container that spans the full screen
	var modal = $('<div class="ca-ui-fullscreen-modal"></div>').appendTo(document.body);
	// if the modal background is clicked, close the fullscreen mode
	modal.bind('click', function(event) {
		if ($(event.target).hasClass('ca-ui-fullscreen-modal')) {
			$(this).find('.ca-ui-fullscreen').trigger('click');
		}
	});
	var wrapper = $('<div class="ca-ui-fullscreen-wrap"></div>').appendTo(modal),
		modalOffset = modal.offset(),
		modalHeight = modal.height() - modalOffset.top,
		modalWidth = modal.outerWidth() - modalOffset.left;

	wrapper.css({
		height: Math.round(modalHeight * 0.9) + 'px',
		top:	Math.round(modalHeight * 0.05) + 'px',
		width:	Math.round(modalWidth * 0.9) + 'px',
		left:	Math.round(modalWidth * 0.05) + 'px'
	});
	// retrieve the original markup for this LayeredImage and
	// remap the IDs of the asset and its layers
	var markup = $(this.settings.originalMarkup);
	markup.attr('id', markup.attr('id') + '-fullscreen');
	markup.attr('data-collapsed', 'false');
	markup.find('li').each(function() {
		var el = $(this);
		el.data('id', el.data('id') + '-fullscreen');
		el.data('parent_asset', el.data('parent_asset') + '-fullscreen');
	});

	// the extents of the current map should be restored on full screen
	var extents = this.map.extent();
	this.figureOptions.fullscreenExtents = {
		swLon: extents[0].lon,
		swLat: extents[0].lat,
		neLon: extents[1].lon,
		neLat: extents[1].lat
	};

	var figureWrapper = $('<figure></figure>')
		.attr('data-options', JSON.stringify(this.figureOptions))
		.css({
			height : Math.round(modalHeight * 0.9) + 'px',
			width : Math.round(modalWidth * 0.9) + 'px'
		})
		.appendTo(wrapper);

	// if a caption is present in the figure options, append it to the fullscreen
	var captionHeight = 0;
	if (this.settings.captionMarkup) {
		figureWrapper.append(this.settings.captionMarkup);
		captionHeight = this.settings.captionMarkup.outerHeight(true);
	}

	$('<div>', {
		'class' : 'figureContent',
		css : {
			'height' : (Math.round(modalHeight * 0.9) - captionHeight) + 'px',
			'width' : Math.round(modalWidth * 0.9) + 'px'
		}
	})
	.append(markup)
	.prependTo(figureWrapper);

	var tempCA = new LayeredImage(markup);

	if (reset) {
		tempCA.reset();
	}
};

//resize the control bar so no wrapping occurs
LayeredImage.prototype.resizeControlBar = function()
{
	var containerWidth = this.container.outerWidth(),
		controlBarWidth = this.ui.controlbar.outerWidth(),
		maxWidth = containerWidth - (parseInt(this.ui.controlbar.css('right'), 10) * 2);

	//if controlbar is wider than asset width resize it
	if (controlBarWidth > maxWidth) {
		this.ui.controlbar.css({
			'max-width' : maxWidth + 'px'
		});

		//shrink layer names (only works nicely if a min-width set in css & overflow ellipsis)
		//this might need redone later depending on browser support and custom styles
		this.ui.controlbar.find('.ca-ui-layer > span').css({
			width: '1px'
		});
	}

};

LayeredImage.prototype.toggleLayerSelector = function(event) {
	// set up aliases and build dynamic variable names
	var $ = jQuery;
	var CA = event.data.layeredImage;
	var layerSelector = $(this);
	// var layerControlNum = event.data.layerControlNum;
	// var layerControlOther = (layerControlNum == 1) ? 2 : 1;
	// var layerSelectorPopup = 'layerSelectorPopup';
	// var currentLayer = CA.settings['currentLayer'+layerControlNum];
	var currentLayer1 = CA.settings['currentLayer1'];
	var currentLayer2 = CA.settings['currentLayer2'];
	// var otherLayer = CA.settings['currentLayer'+layerControlOther];

	// if visible already, remove and set state
	if (CA.ui.currentPopup && CA.ui.currentPopup == CA.ui['layerSelectorPopup']) {
		CA.clearPopups();
	}
	else {
		// check that the other popup is closed
		CA.clearPopups();

		// set an active class on the button to change appearance
		layerSelector.addClass('active');

		// create a button row for each layer
		rows = $('<div class="ca-ui-layer-selector-rows"></div>');
		for (var i = 0; i < CA.baseLayers.length; i++) {
			var baseLayer = CA.baseLayers[i];
			rowLayerButton1 = $('<div class="ca-ui-layer-selector-row-button1"><div class="ca-ui-layer-selector-button"></div></div>')
				.attr('data-layer_index', i);
			rowTitle = $('<div class="ca-ui-layer-selector-row-title"><span>' + baseLayer.title + '</span></div>');
			rowLayerButton2 = $('<div class="ca-ui-layer-selector-row-button2"><div class="ca-ui-layer-selector-button"></div></div>')
				.attr('data-layer_index', i);

			// indicate current layers
			if (baseLayer == CA.settings.currentLayer1) {
				rowLayerButton1
					.find('.ca-ui-layer-selector-button')
					.first()
					.addClass('active');
			}
			if (baseLayer == CA.settings.currentLayer2) {
				rowLayerButton2
					.find('.ca-ui-layer-selector-button')
					.first()
					.addClass('active');
			}

			// bind button events
			rowLayerButton1.bind('click', {CA: CA, layerNum: 1}, CA.layerSelect);
			rowLayerButton2.bind('click', {CA: CA, layerNum: 2}, CA.layerSelect);

			// assemble
			row = $('<div class="ca-ui-layer-selector-row"></div>')
				.append(rowLayerButton1)
				.append(rowTitle)
				.append(rowLayerButton2);
			rows.append(row);
		}

		// figure out where to place the popup
		var bottom = parseInt(CA.ui.controlbar.css('bottom'), 10) + CA.ui.controlbar.height();
		var left = CA.ui.controlbar.position().left;
		var width = CA.ui.sliderContainer.outerWidth() + layerSelector.outerWidth();
		var cssParams = {
			bottom : bottom + 'px',
			left: left + 'px'
			// width: width + 'px'
		};

		// create the popup
		CA.ui.layerSelectorPopup = $('<div class="ca-ui-layer-selector-popup"></div>')
		.css(cssParams)
		.bind('mouseenter', function() {
			CA.container.attr('data-controls-lock', 'true');
		})
		.bind('mouseleave', function() {
			CA.container.attr('data-controls-lock', 'false');
		})
		.append(rows)
		.appendTo(CA.container);
		CA.ui.currentPopup = CA.ui.layerSelectorPopup;
	}
};


LayeredImage.prototype.toggleAnnotationSelector = function() {

	// local aliases
	var $ = this.$;
	var CA = this;

	if (this.ui.currentPopup && this.ui.currentPopup == this.ui.annotationSelector) {
		// remove the control
		this.clearPopups();
	}
	else {
		this.clearPopups();

		// set an active class on the button to change appearance
		this.ui.annotation.addClass('active');

		// get the position of the button's top right corner - this is where to bind the popup
		var parentOffset = this.ui.annotation.offsetParent().position();
		var elOffset = this.ui.annotation.position();
		var elWidth = this.ui.annotation.outerWidth();
		var totalWidth = this.ui.annotation.offsetParent().parent().width();
		var totalHeight = this.ui.annotation.offsetParent().parent().height();
		var right = totalWidth - parentOffset.left - elOffset.left - elWidth;
		var bottom = totalHeight - parentOffset.top - elOffset.top;

		// create the annotation selector box
		this.settings.annotationSelectorVisible = true;
		this.ui.annotationSelector = $('<div class="ca-ui-annotation-selector"></div>')
			.css({
				right: right,
				bottom: bottom
			});
		$('<div class="title">Annotations</div>').appendTo(this.ui.annotationSelector);
		this.ui.annotationSelectorList = $('<ul class="ca-ui-annotation-selector-list"></ul>');
		for (var i=0, count = this.annotationLayers.length; i < count; i++) {
			var layerData = this.annotationLayers[i];

			// add list item for annotation layer
			var layerItem = $('<li></li>')
			.bind('click', {
				layerData: layerData,
				CA: CA
			}, CA.annotationLayerClick);
			var layerItemBox = $('<div class="ca-ui-annotation-selector-item-box"></div>')
			.addClass(layerData.visible ? 'filled' : 'empty');

			// add the custom layer color if applicable
			if (layerData.visible && layerData.annotation) {
				layerItemBox.css('background-color', '#'+layerData.color);
			}

			// append the layerItem
			layerItem
			.append(layerItemBox)
			.append('<span>'+layerData.title+'</span>')
			.appendTo(this.ui.annotationSelectorList);

		}
		// append the finished selector box
		this.ui.annotationSelector
		.bind('mouseenter', function() {
			CA.container.attr('data-controls-lock', 'true');
		})
		.bind('mouseleave', function() {
			CA.container.attr('data-controls-lock', 'false');
		})
		.append(this.ui.annotationSelectorList)
		.appendTo(this.container);
		this.ui.currentPopup = this.ui.annotationSelector;
	}
};

LayeredImage.prototype.annotationLayerClick = function(event) {
	var layerData = event.data.layerData;
	var CA = event.data.CA;
	// toggle the layer on
	CA.toggleLayer(layerData);
	// fill the status box according to layer's visibility state
	var layerItemBox = $(this).find('.ca-ui-annotation-selector-item-box');
	if (layerData.visible) {
		layerItemBox.removeClass('empty').addClass('filled');
		// if this is an annotation, use the selected color, and show  layer in legend
		if (layerData.annotation && layerData.type == 'svg') {
			var bgColor = layerData.color || '#fff';
			layerItemBox.css('background-color', '#' + bgColor);
			CA.addLegendItem(layerData);
		}
	}
	else {
		layerItemBox.removeClass('filled').addClass('empty');
		// if annotation, reset the elements background color to fall back to stylesheet
		// and remove layer from legend
		if (layerData.annotation && layerData.type == 'svg') {
			layerItemBox.css('background-color', '');
			CA.removeLegendItem(layerData);
		}
	}
};

LayeredImage.prototype.resetZoomRange = function(zoomMin) {
	// set the zoom range
	zoomMin = zoomMin || 0;
	var zoomMax = 0;
	for (var i=0, count = this.layers.length; i < count; i++) {
		if (this.layers[i].type == 'iip') {
			if (this.layers[i].zoom_levels - 1 > zoomMax) {
				zoomMax = this.layers[i].zoom_levels - 1;
			}
		}
		else {
			if (this.layers[i].zoom_levels > zoomMax) {
				zoomMax = this.layers[i].zoom_levels;
			}
		}
	}
	this.map.zoomRange([zoomMin, zoomMax]);

	// set the range of the ui slider to match
	this.ui.zoomSlider.slider('option', 'min', zoomMin);
	this.ui.zoomSlider.slider('option', 'max', zoomMax);
};


LayeredImage.prototype.getZoomLevels = function(width, height) {
	var tileSize = this.map.tileSize().x;
	// there is always at least one zoom level
	var zoomLevels = 1;
	while (width > tileSize || height > tileSize) {
		zoomLevels++;
		width = width / 2;
		height = height / 2;
	}
	return zoomLevels;
};


LayeredImage.prototype.getScale = function(zoom_levels, zoom) {
	return Math.pow(2, zoom_levels - zoom);
};


LayeredImage.prototype.realignLayers = function() {
	var $ = this.$, i, count;

	// grab the layers out of the dom
	var map = this.container.find('svg.map');
	var layers = map.find('g.layer').remove();

	// sort the layers
	// find the first layer
	for (i=0, count = layers.length; i < count; i++) {
		if ($(layers[i]).attr('id') == this.settings.currentLayer1.id) {
			map.append(layers[i]);
			layers.splice(i,1);
		}
	}
	// find the second layer
	for (i=0, count = layers.length; i < count; i++) {
		if ($(layers[i]).attr('id') == this.settings.currentLayer2.id) {
			map.append(layers[i]);
			layers.splice(i, 1);
		}
	}
	// put the rest of the layers back into the dom
	map.append(layers);
};


LayeredImage.prototype.clearPopups = function() {
	var CA = this;

	if (this.ui.currentPopup) {
		this.ui.currentPopup.fadeOut(400, function() {
			$(this).remove();
		});
		this.ui.currentPopup = false;
	}
	if (this.ui.controls) {
		$.each(this.ui.controls, function() {
			$(this).removeClass('active');
		});
	}
};


LayeredImage.prototype.toggleControls = function(duration) {
	duration = duration || 400;
	var $ = this.$;

	$.each(this.ui.controls, function() {
		// do this test, this.currentPopup could be false making "this" the window
		if (this != window) {
			this.fadeToggle(duration);
		}
	});

};

LayeredImage.prototype.addLegendItem = function(layerData) {
	var $ = this.$;

	// only show if there is color data
	if (!layerData.color || layerData.color === '') {
		return;
	}

	// if the legend does not exist yet, create it here
	if (!this.ui.legend) {
		// legend control
		this.ui.legend = $('<div class="ca-ui-legend"><ul class="legendList"></ul></div>')
		.appendTo(this.container);
		if (this.container.attr('data-controls') != 'true') {
			this.ui.legend.css('display', 'none');
		}
		this.ui.controls.push(this.ui.legend);
	}

	var legendList = this.ui.legend.find('ul');

	var legendItem = $('<li data-layer_num="'+layerData.layer_num+'">'+layerData.title+'</li>')
	.appendTo(legendList);

	var itemBox = $('<div class="item-box"></div>')
		.css('background-color', '#'+layerData.color)
		.prependTo(legendItem);

	this.ui.legendItemsCount++;
};


LayeredImage.prototype.removeLegendItem = function(layerData) {
	var $ = this.$;
	var CA = this;

	if (this.ui.legend) {
		var legendItems = this.ui.legend.find('ul').children();
		// find the item with the matching layer num and remove it
		legendItems.each(function() {
			if ($(this).attr('data-layer_num') == layerData.layer_num) {
				$(this).remove();
				CA.ui.legendItemsCount--;
			}
		});

		// if the legend is empty, remove it
		if (this.ui.legendItemsCount <= 0) {
			this.ui.legend.remove();
			delete this.ui.legend;
			// remove from control array
			for (var i=0, count = this.ui.controls.length; i < count; i++) {
				if ($(this.ui.controls[i]).hasClass('ca-ui-legend')) {
					this.ui.controls.splice(i, 1);
				}
			}
		}
	}
};

// toggle on any annotation layer that's configured from the figure options
LayeredImage.prototype.showAnnotationPresets = function() {
	for (var j=0, layerCount = this.annotationLayers.length; j < layerCount; j++) {
		this.removeLayer(this.annotationLayers[j]);
		this.removeLegendItem(this.annotationLayers[j]);

		if (this.figureOptions.annotationPreset) {
			// each preset is a layer_id for a layer in this.layers
			for (var i=0, count = this.figureOptions.annotationPreset.length; i < count; i++) {
				var presetLayerId = this.figureOptions.annotationPreset[i];
				if (this.annotationLayers[j].layer_id == presetLayerId) {
					this.repaintLayer(this.annotationLayers[j]);

					if (!this.figureOptions.disable_annotation || this.figureOptions.editing) {
						this.addLegendItem(this.annotationLayers[j]);
					}
					break;
				}
			}
		}
	}
};

LayeredImage.prototype.getVisibleBaseLayers = function() {
	var i, count,
		layers = [];

	for (i=0, count = this.baseLayers.length; i< count; i++) {
		var layerData = this.baseLayers[i];
		if (layerData.visible) {
			layers.push(layerData);
		}
	}

	return layers;
};

LayeredImage.prototype.getVisibleBaseLayerIds = function() {
	var i, count,
		layers = [];

	for (i=0, count = this.baseLayers.length; i< count; i++) {
		var layerData = this.baseLayers[i];
		if (layerData.visible) {
			layers.push(layerData.layer_id);
		}
	}

	return layers;
};


LayeredImage.prototype.getVisibleAnnotationIds = function() {
	var i, count,
		annotations = [];

	for (i=0, count = this.annotationLayers.length; i < count; i++) {
		var layerData = this.annotationLayers[i];
		if (layerData.visible) {
			annotations.push(layerData.layer_id);
		}
	}

	return annotations;
};


LayeredImage.prototype.getExtents = function() {
	var extents = this.map.extent();
	return {
		swLon: extents[0].lon,
		swLat: extents[0].lat,
		neLon: extents[1].lon,
		neLat: extents[1].lat
	};
};


LayeredImage.prototype.setExtents = function(extents) {
	this.map.extent(extents);
	// update zoom slider
	if (this.ui.zoomSlider) {
		this.ui.zoomSlider.slider('value', this.map.zoom());
	}
};


LayeredImage.prototype.getSliderPosition = function() {
	if (typeof this.ui.slider != 'undefined') {
		return this.ui.slider.slider('value');
	}
	else {
		return 0;
	}
};


LayeredImage.prototype.getLayerById = function(id) {
	for (var i=0, count = this.layers.length; i < count; i++) {
		if (this.layers[i].layer_id && this.layers[i].layer_id == id) {
			return this.layers[i];
		}
	}
	return false;
};

LayeredImage.prototype.layerSelect = function(event) {
	var CA = event.data.CA;
	var layerNum = event.data.layerNum;
	var layerIndex = parseInt($(this).attr('data-layer_index'), 10);

	// if this button is already active do nothing
	var button = $(this).find('.ca-ui-layer-selector-button');
	if (button.hasClass('active')) {
		return;
	}

	// if this button is already selected on the other side, do nothing
	var otherNum = (layerNum == 1) ? 2: 1;
	var otherSideButton = CA.ui.layerSelectorPopup
		.find('.ca-ui-layer-selector-row-button' + otherNum + '[data-layer_index="' + layerIndex + '"] .ca-ui-layer-selector-button');
	if (otherSideButton.hasClass('active')) {
		return;
	}

	// switch the old layer with the new
	CA.removeLayer(CA.settings['currentLayer' + layerNum]);
	CA.createLayer(CA.baseLayers[layerIndex]);
	CA.settings['currentLayer' + layerNum] = CA.baseLayers[layerIndex];
	if (layerNum == 2) {
		// set the opacity according to slider
		var sliderVal = CA.ui.slider.slider('value');
		var opacity = sliderVal / 100;
		$('#'+ CA.settings.currentLayer2.id).css('opacity', opacity);
	}

	// update button display
	CA.ui.layerSelectorPopup
		.find('.ca-ui-layer-selector-row-button' + layerNum + ' .ca-ui-layer-selector-button')
		.removeClass('active');
	button.addClass('active');

	// update slider layer text
	CA.ui.sliderLayerText.text(CA.settings.currentLayer1.title + ' - ' + CA.settings.currentLayer2.title);

	// realign layers
	CA.realignLayers();
};

function outerHTML(node){
	// if IE, Chrome take the internal method otherwise build one
	return node.outerHTML || (
		function(n){
			var div = document.createElement('div'), h;
			div.appendChild( n.cloneNode(true) );
			h = div.innerHTML;
			div = null;
			return h;
		})(node);
}

window.liCollection = new LICollection();

// update the viewfinder if an asset is being dragged
function liMousemove(e) {
	if (window.liCollection && liCollection.userIsDraggingAsset) {
		var asset = liCollection.find(liCollection.userIsDraggingAsset);

		if (asset) {
			if (!asset.settings.dragging) {
				return;
			}

			asset.refreshViewfinderViewport();

			if (e.conservationDraggingRemove) {
				asset.settings.dragging = undefined;
				liCollection.userIsDraggingAsset = false;
			}
		}
	}
}

// update the viewfinder and remove the dragging flag when done dragging
function liMouseup(e) {
	if (window.liCollection && liCollection.userIsDraggingAsset) {
		e.conservationDraggingRemove = true;
		liMousemove(e);
	}
}

// bind the mouse events for asset dragging and viewfinder updating
window.addEventListener("mousemove", liMousemove, false);
window.addEventListener("mouseup", liMouseup, false);
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
	},

	run : function() {
		// load package document
		this.models.docPackage = new OsciTk.models.Package({url: this.config.get('packageUrl')});
		Backbone.history.start();
	}
};

app.zotero = {
    init: function() {
        app.dispatcher.on('packageLoaded', function(model) {
            // Get date
            var d = new Date(model.get('dc:date'));
            d = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

            // Build COInS data
            var coins = [
                'ctx_ver=Z39.88-2004',
                'rft_val_fmt=info%3Aofi%2Ffmt%3Akev%3Amtx%3Abook',
                'rft.genre=book',
                'rft.date=' + d,
                'rfr_id=' + model.get('dc:identifier'),
                'rft.btitle=' + model.get('dc:title'),
                'rft.atitle=' + model.get('dc:title'),
                'rft.au=' + model.get('dc:creator'),
                'rft.pub=' + model.get('dc:publisher')
            ];

            // Append coins data to body
            var span = $('<span></span>');
            span.addClass('Z3988');
            span.attr('title', coins.join('&'));
            span.appendTo($('body'));

            // Trigger zotero to search for biblio data
            var ev = document.createEvent('HTMLEvents');
            ev.initEvent('ZoteroItemUpdated', true, true);
            document.dispatchEvent(ev);
        });
    }
};
