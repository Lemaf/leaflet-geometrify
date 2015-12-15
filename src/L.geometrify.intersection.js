/**
 * @requires L.geometrify.Point.js
 */

L.geometrify.intersection = function (clipLayer, subjectLayer) {
	var clipPolygon = L.geometrify.point(clipLayer).toArray(),
	    subjectPolygon = L.geometrify.point(subjectLayer).toArray();


	clipPolygon.sort(L.geometrify.Point.compare);
	subjectPolygon.sort(L.geometrify.Point.compare);

	
};