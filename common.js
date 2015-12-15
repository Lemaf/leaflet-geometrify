GLOBAL.window = GLOBAL;

GLOBAL.document = {
	createElement: function (tagName) {
		return {tagName: tagName};
	},

	documentElement: {
		style: {

		}
	},

	getElementsByTagName: function () {
		return [];
	}
};

GLOBAL.navigator = {
	userAgent: 'node'
};

GLOBAL.chai = require('chai');
GLOBAL.expect = chai.expect;

require('./bower_components/leaflet/dist/leaflet-src.js');

delete GLOBAL.window;
