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