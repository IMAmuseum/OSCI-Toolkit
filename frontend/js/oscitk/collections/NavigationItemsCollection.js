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
				var navDocument = data.html.body.nav;
				for (var i = 0, c = navDocument.length; i < c; i++) {
					if (navDocument[i].type == 'toc') {
						var navSegment = navDocument[i].ol;
						this.parseChildren(navSegment, null, 0);
						break;
					}
				}

				app.dispatcher.trigger('navigationLoaded', this);
			}
		}, this);
	},
	parseChildren: function(items, parent, depth) {
		if (_.isArray(items) === false) {
			items = [items];
		}
		for (var i = 0, numItems = items.length; i < numItems; i++) {
			var item = items[i];
			if (item.a) {
				var parsedItem = {
					id: item.a['data-section_id'],
					parent: parent,
					depth: depth,
					previous: this.at(this.length - 1) || null,
					next: null,
					length: item.a['data-length'] || null,
					title: item.a['value'],
					subtitle: item.a['data-subtitle'],
					thumbnail: item.a['data-thumbnail'],
					timestamp: item.a['data-timestamp'],
					uri: item.a['href']
				};
				this.add(parsedItem);

				var navItem = this.at(this.length - 1);
				if (navItem.get('previous') !== null) {
					navItem.get('previous').set('next', navItem);
				}

				// if 'ol' tag is present, sub sections exist, process:
				if (item.ol && item.ol.li) {
					var children;
					// due to the way the xml is parsed, it comes back as an array or a direct object
					if (item.ol.li.length) {
						children = item.ol.li;
					}
					else {
						children = [item.ol.li];
					}
					var nextDepth = depth + 1;
					for (var h = 0, numChildren = children.length; h < numChildren; h++) {
						this.parseChildren(children[h], navItem, nextDepth);
					}
				}
			}
			if (item.li) {
				this.parseChildren(item.li, parent, depth);
			}
		}
	}
});