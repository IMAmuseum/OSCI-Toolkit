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