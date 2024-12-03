
	mapboxgl.accessToken = maptoken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        // Display the map as a globe, since satellite-v9 defaults to Mercator
        center: listing.geometry.coordinates, //starting position [long,latitu]
        zoom: 8, //starting zoom
    });

// console.log(coordinates);
const marker = new mapboxgl.Marker({color:"red"})
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${listing.location}</h4><p>Exact location after booking! </p>`))
.addTo(map);