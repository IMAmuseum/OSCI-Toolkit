// OsciTk Namespace Initialization //
if (typeof OsciTk === 'undefined'){OsciTk = {};}
if (typeof OsciTk.collections === 'undefined'){OsciTk.collections = {};}
// OsciTk Namespace Initialization //

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
				for (var i = 0, c = navDocument.length; i < c; i++) {
					if (navDocument[i].type == 'toc') {
						var navSegment;
						// do a check if there is only one top level item
						if (_.isArray(navDocument[i].ol.li)) {
							navSegment = navDocument[i].ol.li;
						}
						else {
							navSegment = navDocument[i].ol;
						}
						for (var j = 0, numItems = navSegment.length; j < numItems; j++) {
							this.parseChildren(navSegment[j], null, 0);
						}
						break;
					}
				}
				
				app.dispatcher.trigger('navigationLoaded', this);
			}
		}, this);
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
			//if (typeof(item.ol.li.length) != 'undefined') {
			if (item.ol.li.length) {
				items = item.ol.li;
			}
			else {
				items = [item.ol.li];
			}
			for (var i = 0, numItems = items.length; i < numItems; i++) {
				this.parseChildren(items[i], navItem, ++depth);
			}
		}
	}
});