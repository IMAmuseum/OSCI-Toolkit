// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.models === 'undefined'){OsciTk.models = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
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
});