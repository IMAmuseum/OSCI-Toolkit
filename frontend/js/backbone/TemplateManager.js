// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.templates === 'undefined'){OsciTk.templates = {};}
// OsciTk Namespace Initialization //

OsciTk.templateManager = {

	get : function(templateName) {
		if (OsciTk.templates[templateName] === undefined) {
			$.ajax({
				async : false,
				dataType : 'html',
				url : 'js/backbone/templates/' + templateName + '.tpl.html',
				success : function(data, textStatus, jqXHR) {
					OsciTk.templates[templateName] = _.template(data);
				}
			});
		}

		return OsciTk.templates[templateName];
	}

};