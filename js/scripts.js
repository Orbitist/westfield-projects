mapboxgl.accessToken = 'pk.eyJ1Ijoid2VzdGZpZWxkbnkiLCJhIjoiY2pjeGxqcjhiMGljYzMzbzE0eXB6Z3ozYiJ9.VEtcYyEyNf1N2huTqRXElQ';

var bounds = [
    [-80.098094, 41.808723], // Southwest coordinates
    [-78.803060, 42.664566]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/westfieldny/cjcxob2e71c352smnmnuscxbn',
    center: [-79.585621, 42.329138],
    zoom: 13.5,
    minZoom: 10,
    maxBounds: bounds
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {

    map.addLayer({
        'id': 'Development Regions',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': regionsData
        },
        'layout': {},
        'paint': {
            'fill-color': ['get', 'color'],
            'fill-opacity': 0.4
        }
    });
    map.on('click', 'Development Regions', function (e) {
      new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.html)
          .addTo(map);
    });
    map.on('mouseenter', 'Development Regions', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'Development Regions', function () {
        map.getCanvas().style.cursor = '';
    });

});

var toggleableLayerIds = [ 'Development Regions' ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
