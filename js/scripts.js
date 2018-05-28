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

  // REGIONS
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

  // PROJECTS
  map.addSource("projects", {
    "type": "geojson",
    "data": "https://westfieldny.com/api/geojson/projects"
  });
  map.addLayer({
    "id": "Projects",
    "type": "circle",
    "source": "projects",
    "paint": {
      "circle-radius": 10,
      "circle-color": [
        'match',
        ['get', 'status'],
        'Proposed', '#69D2E7',
        'Underway', '#E0E4CC',
        'Complete', '#FA6900',
        /* other */ '#ccc'
      ],
      "circle-opacity": 1
    }
   });
   map.on('click', 'Projects', function (e) {
     var projectUrl = 'https://westfieldny.com' + e.features[0].properties.path;
     var projectImg = e.features[0].properties.image;
     var projectInfo = e.features[0].properties.status + ' ' + e.features[0].properties.type;
     var projectLabel = e.features[0].properties.name;
     new mapboxgl.Popup()
         .setLngLat(e.lngLat)
         .setHTML('<div class="o-tile"><div class="o-tile-img Point_of_interest"><a href="' + projectUrl + '" target="_parent"><img src="https://westfieldny.com' + projectImg + '" width="200" height="200" alt="' + e.features[0].properties.name + '" class="img-fluid"></a></div><div class="o-tile-content"><div class="o-tile-content-info">' + projectInfo + '</div><div class="o-tile-content-title"><a href="' + projectUrl + '" target="_parent">' + projectLabel + '<p><span class="badge badge-secondary">Learn more</span></p></a></div></div></div>')
         .addTo(map);
   });
   map.on('mouseenter', 'Projects', function () {
       map.getCanvas().style.cursor = 'pointer';
   });
   map.on('mouseleave', 'Projects', function () {
       map.getCanvas().style.cursor = '';
   });

});

// TOGGLE LAYERS
var toggleableLayerIds = [ 'Development Regions', 'Projects' ];

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

// FILTER FUNCTIONALITY
var formProjectStatus;
var statusFilter;

var projectsFilterParams;

$('#projectStatus').change(function () {
  formProjectStatus = $(this).find("option:selected").val();
  statusFilter = ["all",["==", 'status', formProjectStatus]];
  projectsFilterParams = statusFilter;
});

$("#project-filters").submit(function(e) {
  e.preventDefault();
  if (formProjectStatus == 'All'){
    map.setFilter('Projects');
  } else {
    map.setFilter('Projects', projectsFilterParams);
  }
});
