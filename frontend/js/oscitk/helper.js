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