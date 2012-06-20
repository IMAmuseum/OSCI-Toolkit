// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.templates === 'undefined'){OsciTk.templates = {};}
// OsciTk Namespace Initialization //

OsciTk.templateManager = {
	get : function(templateName) {
		return function() {
			OsciTk.templateManager.useTemplate(templateName);
		}
	},
	
	useTemplate: function(templateName) {
		if (OsciTk.templates[templateName] === undefined) {
			var templateUrls = app.config.get('templateUrls');
			var found = false;
			for(var i=0; i < templateUrls.length; i++) {
				$.ajax({
					async : false,
					dataType : 'html',
					url : templateUrl[i] + templateName + '.tpl.html',
					success : function(data, textStatus, jqXHR) {
						OsciTk.templates[templateName] = _.template(data);
						found = true;
					}
				});
				if (found) break;
			}
		}
		return OsciTk.templates[templateName];
	}
};