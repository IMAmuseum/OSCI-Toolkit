jQuery(function() {
	window.OsciTkNavigation = OsciTkModel.extend({
		
		defaults: function() {
			return {
				uri: null,
				toc: null,
				current_section: null
			};
		},
	
		
		initialize: function() {
			// TODO: ERROR CHECK THE RETURNED XML
			var data = xmlToJson(loadXMLDoc(this.get('uri')));
			var nav = data.html[1].body.nav;
			// parse the toc and index
			for (var i in nav) {
				if (nav[i].type == 'toc') {
					var toc = {
						id: nav[i].id,
						title: nav[i].h1.value,
						children: []
					};
					_.each(nav[i].ol.li, function(tocItem) {
						this.parseChildren(tocItem, toc);
					}, this);
					this.set('toc', toc);
				}
				else if (nav[i].type == 'index') {
					var index = {
						id: nav[i].id,
						title: nav[i].h1.value,
						children: []
					};
					_.each(nav[i].ol.li, function(indexItem) {
						this.parseChildren(indexItem, index);
					}, this);
					this.set('index', index);
				}
				else {
					this.set(nav[i].type, nav[i]);
				}
			}

			// bind routedToRoot
			this.dispatcher.on('routedToRoot', function() {
				this.goToBeginning();
			}, this);
			
			// bind routedToSection
			this.dispatcher.on('routedToSection', function(id) {
				this.goToSection(id);
			}, this);

			this.dispatcher.trigger('navigationLoaded', this);
		},

		
		/**
		 * Get a section from a subtree of the TOC
		 */
		getSectionFromSubtree: function(section_id, subtree) {

			for (var i in subtree.children) {
				if (subtree.children[i]['data-section_id'] == section_id) {
					return subtree.children[i];
				}
				if (subtree.children[i].children !== undefined) {
					var section = this.getSectionFromSubtree(section_id, subtree.children[i]);
					if (section !== null) return section;
				}
			}

			// Not found
			return null;

		},

		getSection: function(section_id) {
			return this.getSectionFromSubtree(section_id, this.attributes.toc);
		},

		goToBeginning: function() {
			console.log('going to begnning');
			if (this.get('toc').children[0]) {
				this.set({current_section: this.get('toc').children[0]});
			}
		},
		
		goToSection: function(id) {
			// TODO: traverse the TOC and find the actual section
			section = this.getSection(id);
			if (section !== null) {
				this.set({current_section: section});
			}

		},
		
		parseChildren: function(item, parent) {
			var parsedItem = {};
			// include the 'a' tag items as properties
			for (var i in item.a) {
				parsedItem[i] = item.a[i];
			}
			// if 'ol' tag is present, sub sections exist, process:
			if (item.ol && item.ol.li) {
				parsedItem.children = [];
				var items;
				// due to the way the xml is parsed, it comes back as an array or a direct object
				if (typeof(item.ol.li.length) != 'undefined') {
					items = item.ol.li;
				}
				else {
					items = [item.ol.li];
				}
				_.each(items, function(item2) {
					this.parseChildren(item2, parsedItem);
				}, this);
			}
			parent.children.push(parsedItem);
		}
		
	});
});