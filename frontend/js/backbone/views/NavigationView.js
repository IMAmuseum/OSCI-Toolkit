// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.views === 'undefined'){OsciTk.views = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
	OsciTk.views.Navigation = OsciTk.views.BaseView.extend({
		id: 'navigation',
		template: _.template($('#template-navigation').html()),
		initialize: function() {
			// bind packageLoaded to build navigation model
			app.dispatcher.on('packageLoaded', function(packageModel) {
				console.log(packageModel, 'packageLoaded');
				var nav = _.find(packageModel.get('manifest').item,
					function(item){
						return item.properties == 'nav';
					}
				);

				if (nav)
				{
					app.models.navigation = new OsciTk.models.Navigation({
						uri: nav.href
					});
				}
			}, this);
		},
		render: function() {
			this.$el.html(this.template());
		}
	});
});