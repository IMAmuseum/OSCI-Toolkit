OsciTk.models.SearchResult = OsciTk.models.BaseModel.extend({
	get: function(attr) { // override get method
		if(!this.attributes[attr]) return this.attributes[attr];

		var val = this.attributes[attr];
		switch(attr) {
			case 'bundle':
				if(val === 'footnote' || val === 'note' || val === 'figure') {
					return val;
				} else {
					return 'content';
				}
				break;
			case 'url':

				break;
			default:
				return this.attributes[attr];
		}
	}
});