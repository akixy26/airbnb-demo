var r = 255;
var g = 110;
var b = 110;
var homes = new Array({
	id: 14831696,
	latitude: 52.36117305,
	longtitude: 4.866754582,
	num_of_reviews: 4
}, {
	id: 3951251,
	latitude: 52.37023656,
	longtitude: 4.859506674,
	num_of_reviews: 17
});
var map;

window.onload = function() {
	L.mapbox.accessToken = 'pk.eyJ1IjoiYWtpeHkyNiIsImEiOiJjajF0YmdoMWowMG5rMnhtbm5pOWk4azY1In0.8ku4svFEQLdi4tlhM8Du6Q';
	map = L.mapbox.map('map', 'https://api.mapbox.com/v4/mapbox.light.json?access_token=pk.eyJ1IjoiYWtpeHkyNiIsImEiOiJjajF0YmdoMWowMG5rMnhtbm5pOWk4azY1In0.8ku4svFEQLdi4tlhM8Du6Q')
	    .setView([52.37, 4.85], 11);

	addMarkers();

	// var marker = L.marker([52.37, 4.85], {
	//     icon: L.mapbox.marker.icon({
	//         'marker-size': 'small',
	//         'marker-color': rgbToHex(r, g, b)
	//     }),
	//     riseOnHover: true
	// });

	// marker.addTo(map);

	// marker.on('click', function(e) {
	// 	alert(e.latlng);
	// });
}

function addMarkers() {
	for (i in homes) {
		var marker = L.marker([homes[i].latitude, homes[i].longtitude], {
		    icon: L.mapbox.marker.icon({
		        'marker-size': 'small',		        
		        'marker-color': rgbToHex(r, 235 - homes[i].num_of_reviews * 3, 235 - homes[i].num_of_reviews * 3)
		    }),
		    alt: homes[i].id,
		    riseOnHover: true
		});

		marker.addTo(map);

		marker.on('click', function(e) {
			// console.log(e);
			// alert(e.latlng);
			// alert(e.target.options.alt);
			var popup = L.popup()
				.setLatLng([e.latlng.lat + 0.01, e.latlng.lng])
				.setContent('<p>' + e.target.options.alt + '</p>')
				.openOn(map);
			});
	}
}

function rgbToHex(r, g, b) {
	return ((r << 16) | (g << 8) | b).toString(16);
}