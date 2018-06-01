mapboxgl.accessToken = 'pk.eyJ1Ijoid2VzdGZpZWxkbnkiLCJhIjoiY2pjeGxqcjhiMGljYzMzbzE0eXB6Z3ozYiJ9.VEtcYyEyNf1N2huTqRXElQ';

var bounds = [
    [-80.098094, 41.808723], // Southwest coordinates
    [-78.803060, 42.664566]  // Northeast coordinates
];

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/westfieldny/cjcxob2e71c352smnmnuscxbn',
    center: [-79.585621, 42.329138],
    zoom: 13,
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
  map.on("mousemove", function (e) {
      var features = map.queryRenderedFeatures(e.point, {
          layers: ["Development Regions"]
      });

      if (features.length) {
          document.getElementById('region-hover').innerHTML = "<div class='region-tooltip' style='z-index:1;padding:10px 20px;border-radius:4px;background-color:" + features[0].properties.color + ";left:" + (e.point.x + 15) + "px;top:" + (e.point.y - 50) + "px;position:absolute;'>" + features[0].properties.title + "</div>";
      } else {
          //if not hovering over a feature set tooltip to empty
          document.getElementById('region-hover').innerHTML = "";
      }
  });

  // VR
  map.addSource("vr", {
    "type": "geojson",
    "data": "js/vr.geojson"
  });
  map.addLayer({
    "id": "vr",
    "type": "circle",
    "source": "vr",
    "paint": {
      "circle-radius": 10,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
      "circle-color": "#ffffff",
      "circle-opacity": 1
    }
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
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
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
     var projectInfo = e.features[0].properties.status + ', ' + e.features[0].properties.type;
     var projectLabel = e.features[0].properties.name;
     new mapboxgl.Popup()
         .setLngLat(e.lngLat)
         .setHTML('<div class="card"><a href="' + projectUrl + '" target="_parent"><img src="https://westfieldny.com' + projectImg + '" alt="' + e.features[0].properties.name + '" class="card-img-top"></a><div class="card-body"><a href="' + projectUrl + '" target="_parent"><p class="lead card-title">' + projectLabel + '</p></a><p class="card-text">' + projectInfo + '</p></div></div>')
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
var formProjectStatus = 'All';
var formProjectType = 'All';
var statusFilter = ["==", 'status', formProjectStatus];
var typeFilter = ["==", 'type', formProjectType];

var projectsFilterParams;

function buildProjectsFilter() {
  if (formProjectStatus == 'All' && formProjectType !== 'All') {
    projectsFilterParams = ["all", typeFilter];
  } else if (formProjectStatus !== 'All' && formProjectType == 'All') {
    projectsFilterParams = ["all", statusFilter];
  } else {
    projectsFilterParams = ["all", statusFilter, typeFilter];
  }
  console.log(projectsFilterParams);
}

$('#projectStatus').change(function () {
  formProjectStatus = $(this).find("option:selected").val();
  statusFilter = ["==", 'status', formProjectStatus];
  buildProjectsFilter();
  if (formProjectStatus == 'All' && formProjectType == 'All'){
    map.setFilter('Projects');
    runStats();
  } else {
    map.setFilter('Projects', projectsFilterParams);
    runStats();
  }
});

$('#projectType').change(function () {
  formProjectType = $(this).find("option:selected").val();
  typeFilter = ["==", 'type', formProjectType];
  buildProjectsFilter();
  if (formProjectStatus == 'All' && formProjectType == 'All'){
    map.setFilter('Projects');
    runStats();
  } else {
    map.setFilter('Projects', projectsFilterParams);
    runStats();
  }
});

// Function to toggle with Jquery
$.fn.toggleClick = function(){
    var methods = arguments, // store the passed arguments for future reference
        count = methods.length; // cache the number of methods

    //use return this to maintain jQuery chainability
    return this.each(function(i, item){
        // for each element you bind to
        var index = 0; // create a local counter for that element
        $(item).click(function(){ // bind a click handler to that element
            return methods[index++ % count].apply(this,arguments); // that when called will apply the 'index'th method to that element
            // the index % count means that we constrain our iterator between 0 and (count-1)
        });
    });
};

// Toggle filters block
function inFilters() {
  $('.filters-block').addClass( "active" );
  $('#toggleFilters').addClass( "active" );
}
function outFilters() {
  $('.filters-block').removeClass( "active" );
  $('#toggleFilters').removeClass( "active" );
}
$('#toggleFilters').toggleClick(inFilters, outFilters);

// Toggle stats block
function inStats() {
  $('.figures-block').addClass( "active" );
  $('#toggleStats').addClass( "active" );
}
function outStats() {
  $('.figures-block').removeClass( "active" );
  $('#toggleStats').removeClass( "active" );
}
$('#toggleStats').toggleClick(inStats, outStats);
