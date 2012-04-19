// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initializaiotn //

jQuery(function() {
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
					var navDocument = data.html[1].body.nav;
					for (var i in navDocument) {
						if (navDocument[i].type == 'toc') {
							_.each(navDocument[i].ol.li, function(tocItem) {
								this.parseChildren(tocItem, null, 0);
							}, this);
							break;
						}
					}
					
					app.dispatcher.trigger('navigationLoaded', this);
				}
			}, this);
			
			// bind routedToRoot
			app.dispatcher.on('routedToRoot', function() {
				this.goToBeginning();
			}, this);
			
			// bind routedToSection
			app.dispatcher.on('routedToSection', function(id) {
				this.setCurrentNavigationItem(this.get(id));
			}, this);
		},
		getCurrentNavigationItem: function(){
			return this.currentNavigationItem;
		},
		setCurrentNavigationItem: function(navItem) {
			this.currentNavigationItem = navItem;
			app.dispatcher.trigger('currentNavigationItemChanged');
		},
		goToBeginning: function() {
			console.log('going to begnning');
			if (this.at(0)) {
				this.setCurrentNavigationItem(this.at(0));
			}
		},
		parseChildren: function(item, parent, depth) {
			var parsedItem = {
				id: item.a['data-section_id'],
				parent: parent,
				depth: depth,
				previous: this.at(this.length - 1),
				next: undefined,
				length: item.a['data-length'],
				title: item.a['value'],
				subtitle: item.a['data-subtitle'],
				thumbnail: item.a['data-thumbnail'],
				timestamp: item.a['data-timestamp'],
				uri: item.a['href']
			};
			this.add(parsedItem);
			
			var navItem = this.at(this.length - 1);
			if (navItem.get('previous') !== undefined) {
				navItem.get('previous').set('next', navItem);
			}
			// if 'ol' tag is present, sub sections exist, process:
			if (item.ol && item.ol.li) {
				var items;
				// due to the way the xml is parsed, it comes back as an array or a direct object
				if (typeof(item.ol.li.length) != 'undefined') {
					items = item.ol.li;
				}
				else {
					items = [item.ol.li];
				}
				_.each(items, function(item2) {
					this.parseChildren(item2, navItem, ++depth);
				}, this);
			}
		}
	});
});