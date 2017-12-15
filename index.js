var homes = [{
	id: 14831696,
	latitude: 52.36117305,
	longtitude: 4.866754582,
	num_of_reviews: 4,
	available: true
}, {
	id: 3951251,
	latitude: 52.37023656,
	longtitude: 4.859506674,
	num_of_reviews: 17,
	available: true
}, {
	id: 16590973,
	latitude: 52.36201576,
	longtitude: 4.86687246,
	num_of_reviews: 4,
	available: true
}, {
	id: 9283701,
	latitude: 52.36582593,
	longtitude: 4.858177973,
	num_of_reviews: 2,
	available: false
}, {
	id: 6458721,
	latitude: 52.36417929,
	longtitude: 4.86488485,
	num_of_reviews: 10,
	available: false
}, {
	id: 14864447,
	latitude: 52.35975308,
	longtitude: 4.866176048,
	num_of_reviews: 11,
	available: true
}, {
	id: 874340,
	latitude: 52.42364739,
	longtitude: 4.887019218,
	num_of_reviews: 256,
	available: true
}, {
	id: 15211538,
	latitude: 52.3734097,
	longtitude: 4.865153998,
	num_of_reviews: 33,
	available: true
}, {
	id: 1261425,
	latitude: 52.37364212,
	longtitude: 4.860512821,
	num_of_reviews: 2,
	available: true
}, {
	id: 931801,
	latitude: 52.36104184,
	longtitude: 4.863302655,
	num_of_reviews: 115,
	available: true
}];

var homeInfo = {
	name: "Adorable house with garden in popular 'Old West'",
	summary: "Cozy quiet house within the popular area of Amsterdam 'Old-West'. It is really close to the Ten Kate market and De Hallen. The house is in walking distance from the Vondelpark and the Jordaan area. It has everything you need for a great stay: a comfortable living room, a bright fully equipped kitchen overlooking a small garden, a bathroom equipped with shower + bathtub, and a big bedroom upstairs. My cuddly cat Sammy stays around and would appreciate if you could feed her twice a day.",
	host_name: "Michelle",
	review_scores_rating: 92,
	review_scores_accuracy: 10,
	review_scores_cleanliness: 10,
	review_scores_checkin: 10,
	review_scores_communication: 10,
	review_scores_location: 9,
	review_scores_value: 9,
	beds: 2,
	prices: [200, 300, 300, 320]
};

var reviews = [{
	reviewer_name: 'Flavio',
	date: '2013-08-18',
	comments: 'The apartment is complete with all the comforts. Particularly a excellent and modern kitchen with dishwasher. The apartment is above a market for the expenses of last minutes,and three minutes walk from a biggest supermarket with product of excellent quality. Well connected with public transport. I and my friends have rented 4 bikes and when we was in the apartment could see these from the window that overlooks the street. The owner has been helpful to every need especially for flexibility on check in and check out. Great Barry'
},{
	reviewer_name: 'Nina',
	date: '2013-08-28',
	comments: 'Barry was a very pleasant host. Everytime we had a question, he would reply asap. We had everything we needed in the studio, including lining and towels. The location was very convenient, 20 minutes walk from Centraal Station, and several trams were available. Plus, the Zeeburg P+R parking was 10 minutes drive from the studio. We really enjoyed our stay, and we would definitely recommend this place, because of the location, the indoor space, and most importantly because of Barry and Robert kindness and patience !'
}, {
	reviewer_name: 'Alyona',
	date: '2013-09-09',
	comments: 'Me and my friends stayed at Barry\'s apartment in early september. And it was perfect for us. There is enough space for everyone, good kitchen equipment, bathroom and a window view with a mill. The apartment also has good location close to central station. It takes only 10-15 min to get there by tram or by bike.'
}];

var map;
var featureLayer;

var filterOn = false;
var popupPinned = false;
var reviewsShown = false;

var currDate = new Date().toLocaleDateString('zh-Hans').replace(new RegExp('/', "gm"), '-');
var currHomeId;

window.onload = function() {
	/* Initialize */
	$('#date-input').val(currDate);

	/* Load map */
	L.mapbox.accessToken = 'pk.eyJ1IjoiYWtpeHkyNiIsImEiOiJjajF0YmdoMWowMG5rMnhtbm5pOWk4azY1In0.8ku4svFEQLdi4tlhM8Du6Q';
	map = L.mapbox.map('map', 'https://api.mapbox.com/v4/mapbox.light.json?access_token=pk.eyJ1IjoiYWtpeHkyNiIsImEiOiJjajF0YmdoMWowMG5rMnhtbm5pOWk4azY1In0.8ku4svFEQLdi4tlhM8Du6Q')
	    .setView([52.37, 4.85], 11);
	featureLayer = L.mapbox.featureLayer().addTo(map);

	/* Get homes info from server and add markers to the map */
	getHomes();

	/* Events */
	map.on('click', function(e) {
		popupPinned = false;
	});

	$('#popup-add-bt-cancel').click(function() {
		$('#mask').css('display', 'none');
	});

	$('#popup-add-bt-submit').click(function() {
		var accuracy = $('#accuracy-slider').val();
		var cleanliness = $('#cleanliness-slider').val();
		var checkin = $('#checkin-slider').val();
		var communication = $('#communication-slider').val();
		var location = $('#location-slider').val();
		var value = $('#value-slider').val();
		var comments = $('#popup-comments-input').val();

		// console.log(currHomeId);

		/* Add review to server */
		// $.post({'AirbnbDemo/addreview',
		// 	{
		// 		listing_id: currHomeId,
		// 		reviewer_id: 0,
		// 		reviewer_name: 'Anonymous',
		// 		accuracy: accuracy,
		// 		cleanliness: cleanliness,
		// 		checkin: checkin,
		// 		communication: communication,
		// 		location: location,
		// 		value: value,
		// 	},
		// 	function(res, status) {
		// 	}
		// });
	});
}

function getHomes() {
	/* Get query restrictions */
	var date = $('#date-input').val();
	var city = 'Amsterdam';
	var min_beds = $('#beds-slider').val();
	var min_number_of_reviews = $('#reviews-slider').val();
	var min_host_listings_count = $('#host-slider').val();

	/* Get homes info from server */
	// $.post({'AirbnbDemo/gethomes',
	// 	{
	// 		date: date,
	// 		city: city,
	// 		min_beds: min_beds,
	// 		min_number_of_reviews: min_number_of_reviews,
	// 		min_host_listings_count: min_host_listings_count
	// 	},
	// 	function(res, status) {
	// 		homes = res;
	// 	}
	// });

	/* Clear all markers */
	featureLayer.clearLayers();

	/* Add markers to the map */
	addMarkers();
}

function addMarkers() {
	for (i in homes) {
		if (homes[i].available) {
			marker = L.marker([homes[i].latitude, homes[i].longtitude], {
			    icon: L.mapbox.marker.icon({
			        'marker-size': 'small',		        
			        'marker-color': rgbToHex(255, 235 - homes[i].num_of_reviews * 0.3, 235 - homes[i].num_of_reviews * 0.3)
			    }),
			    alt: homes[i].id,
			    riseOnHover: true
			});
		}
		else {
			marker = L.marker([homes[i].latitude, homes[i].longtitude], {
			    icon: L.mapbox.marker.icon({
			        'marker-size': 'small',		        
			        'marker-color': rgbToHex(220, 220, 220)
			    }),
			    alt: homes[i].id,
			    riseOnHover: true
			});
		}

		marker.addTo(featureLayer);

		marker.on('mouseover', function(e) {
			if (!popupPinned)
				popup(e);
		});
		marker.on('mouseout', function(e) {
			if (!popupPinned)
				map.closePopup();
		});
		marker.on('click', function(e) {
			popupPin(e);
			currHomeId = homes[i].id;
		});
	}
}

function popup(e) {
	/* Get home ID */
	var homeId = parseInt(e.target.options.alt);

	/* Get home info from server */
	// $.post({'AirbnbDemo/gethomeinfo',
	// 	{
	// 		id: id,
	// 		date: currDate
	// 	},
	// 	function(res, status) {
	// 		homeInfo = res;
	// 	}
	// });

	// Display popup
	var popup = L.popup({
		maxHeight: 420,
		closeButton: false,
		offset: [0, -18],
		className: 'popup'
	})
	.setLatLng(e.latlng)
	.setContent("<div class='div-popup'><div class='popup-div-head'><div class='popup-title'>" + homeInfo.name + 
		"</div><div class='popup-host'>owned by <span class='popup-info'>" + homeInfo.host_name + 
		"</span></div><div class='popup-beds'><span class='popup-info'>" + homeInfo.beds + 
		"</span> beds</div></div><div class='popup-summary'>" + homeInfo.summary + "</div>" +
		"<div class='popup-div-reviews'><div class='popup-rating'>Overall rating: <span class='popup-info'>" + homeInfo.review_scores_rating + 
		"</span></div><div class='popup-radar'></div><div class='popup-bt-add-review'>ADD REVIEW</div>" + 
		"<div class='popup-bt-show-reviews'>SHOW REVIEWS</div><div class='popup-reviews'></div></div>" +
		"<div class='popup-div-price'><div class='popup-price-title'>Recent and future prices:</div><div class='popup-price-curve'></div></div></div>")
	.openOn(map);

	popupPinned = false;
	reviewsShown = false;

	$('.popup-bt-add-review').click(function() {
		$('#mask').css('display', 'block');
	});

	$('.popup-bt-show-reviews').click(function() {
		if (!reviewsShown) {
			/* Get reviews from server */
			// $.post({'AirbnbDemo/getreviews',
			// 	{
			// 		id: homeId
			// 	},
			// 	function(res, status) {
			// 		reviews = res;
			// 	}
			// });

			/* Show reviews */
			for (i in reviews) {
				$('.popup-reviews').append("<div class='reviewer-name'>" + reviews[i].reviewer_name + 
					"</div><div class='review-date'>" + reviews[i].date + 
					"</div><div class='review-comments'>" + reviews[i].comments + "</div>");
			}
			$('.popup-bt-show-reviews').html('HIDE REVIEWS');
			reviewsShown = true;
		}
		else {
			$('.popup-reviews').html('');
			$('.popup-bt-show-reviews').html('SHOW REVIEWS');
			reviewsShown = false;
		}
	});
}

function popupPin(e) {
	popup(e);
	popupPinned = true;
}

function showFilter() {
	if (filterOn) {
		document.getElementById('filter-panel').style.display = "none";
		document.getElementById('bt-filter').style.backgroundColor = "#fff";
		document.getElementById('bt-filter').style.color = "rgba(0, 0, 0, 0.75)";
		filterOn = !filterOn;
	}
	else {
		document.getElementById('filter-panel').style.display = "block";
		document.getElementById('bt-filter').style.color = "#fff";
		document.getElementById('bt-filter').style.backgroundColor = "rgba(0, 0, 0, 0.75)";
		filterOn = !filterOn;
	}
}

function changeBedsValue() {
	var bedsVal = document.getElementById('beds-slider').value;
	document.getElementById('beds-value').innerHTML = bedsVal;
	getHomes();
}

function changeReviewsValue() {
	var reviewsVal = document.getElementById('reviews-slider').value;
	document.getElementById('reviews-value').innerHTML = reviewsVal;
	getHomes();
}

function changeHostValue() {
	var hostVal = document.getElementById('host-slider').value;
	document.getElementById('host-value').innerHTML = hostVal;
	getHomes();
}

function changeAccuracyVal() {
	$('#accuracy-value').html($('#accuracy-slider').val());
}

function changeCleanlinessVal() {
	$('#cleanliness-value').html($('#cleanliness-slider').val());
}

function changeCheckinVal() {
	$('#checkin-value').html($('#checkin-slider').val());
}

function changeCommunicationVal() {
	$('#communication-value').html($('#communication-slider').val());
}

function changeLocationVal() {
	$('#location-value').html($('#location-slider').val());
}

function changeValueVal() {
	$('#value-value').html($('#value-slider').val());
}

function rgbToHex(r, g, b) {
	return ((r << 16) | (g << 8) | b).toString(16);
}