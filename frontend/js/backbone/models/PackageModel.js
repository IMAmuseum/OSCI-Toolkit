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

		//get the publication id
		var ids = data['package']['metadata']['dc:identifier'];
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
	}
});