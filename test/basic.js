describe('Basic oparations:', function() {

	var DOUBLE_PI = Math.PI * 2;

	describe('#1 Leaflet to Polygons', function () {

		it('A simple polygon', function () {

			var basicLayer = L.polygon([
				[-21, -45],
				[0, 0],
				[21, 45]
			]);

			var point = L.geometrify.point(basicLayer);
			var first = point;

			expect(point.latlng).to.be.eql(L.latLng([-21, -45]));

			point = point.next;
			expect(point.latlng).to.be.eql(L.latLng([0, 0]));

			point = point.next;
			expect(point.latlng).to.be.eql(L.latLng([21, 45]));

			expect(point.next).to.be.equal(first);
		});

		it('A big polygon', function () {
			this.timeout(1e4 * 3);

			var latlngs = new Array(1e4), angle, i;

			for (i=0; i < latlngs.length; i++) {
				angle = (i / latlngs.length) * DOUBLE_PI;
				latlngs[i] = [Math.sin(angle) * Math.random() * 30, Math.cos(angle) * Math.random() * 50];
			}


			var point = L.geometrify.point(L.polygon([latlngs]));
			var first = point;
			i = 0;

			do {
				expect(point.latlng).to.eql(L.latLng(latlngs[i]));
				point = point.next;
				i++;
			} while (point !== first);

			expect(i).to.be.equal(latlngs.length);
		});

	});

});