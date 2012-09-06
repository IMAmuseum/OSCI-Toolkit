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