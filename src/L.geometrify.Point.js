L.geometrify.Point = L.Class.extend({

	statics: {

		ENTRY: 1,

		EXIT: 2,

		INTERSECTION: 3,

		NOINTERSECTION: 4

	},

	alpha: null,

	entryExit: null,

	hole: null,

	neighbor: null,

	next: null,

	nextPolygon: null,

	latlng: null,

	prev: null,

	status: null,

	initialize: function (latlng) {
		this.latlng = latlng;
	},

	toArray: function () {
		var array = [], point = this;

		do {
			array.push(point);
			point = point.next;
		} while (point && point !== this);

		return array;
	}

});

L.geometrify.Point.compare = function (pointA, pointB) {
	if (pointA.latlng.lng < pointB.latlng.lng) {
		return -1;
	} else if (pointA.latlng.lng > pointB.latlng.lng) {
		return 1;
	} else if (pointA.latlng.lat < pointB.latlng.lat) {
		return -1;
	} else {
		return (pointA.latlng.lat === pointB.latlng.lat) ? 0 : 1;
	}
};

(function () {

	function latLngsToPoint (latlngs) {
		var firstPoint,
		    i,
		    point,
		    prev;

		for (i=0; i < latlngs.length; i++) {
			point = new L.geometrify.Point(latlngs[i]);

			if (!firstPoint) {
				firstPoint = point;
			}

			if (prev) {
				prev.next = point;
				point.prev = prev;
			}

			prev = point;
		}

		point.next = firstPoint;
		firstPoint.prev = point;

		return firstPoint;
	}

	function layertToPoints (layer) {
		var latlngs = layer.getLatLngs();

		if (Array.isArray(latlngs[0])) {
			var shell = latLngsToPoint(latlngs[0]),
			    prevHole,
			    currentHole;

			for (var i=1; i < latlngs.length; i++) {

				currentHole = latLngsToPoint(latlngs[i]);
				if (!shell.hole) {
					shell.hole = currentHole;
				}

				if (prevHole) {
					setNextPolygon(prevHole, currentHole);
				}

				prevHole = currentHole;
			}
		} else {
			return latLngsToPoint(latlngs);
		}
	}

	L.geometrify.point = function (layer) {

		if (layer instanceof L.MultiPolygon) {
			var firstPolygon, prevPolygon, polygon;

			layer.eachLayer(function (layer) {

				polygon = layertToPoints(layer);

				if (prevPolygon) {
					setNextPolygon(prevPolygon, polygon);
				}

				if (!firstPolygon) {
					firstPolygon = polygon;
				}

				prevPolygon = polygon;

			}, this);

			return firstPolygon;

		} else if (layer instanceof L.Polygon) {
			return layertToPoints(layer);
		}
	};

	function setNextPolygon(prev, next) {
		for (; prev; prev = prev.next) {
			prev.nextPolygon = next;
		}
	}

})();