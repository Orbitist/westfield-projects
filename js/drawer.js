function flyToProject(lng, lat) {
  map.flyTo({
      center: [lng, lat],
      zoom: 16,
      bearing: 90 * (.5 - Math.random()),
      pitch: 60,
      speed: 0.5,
      curve: 1
  });
};

for (var i = 0; i < projectsFeed.features.length; i++) {
  if (projectsFeed.features[i].properties.featured == "True") {
    $(".chapters-menu-cards").append('<div onclick="flyToProject(\'' + projectsFeed.features[i].geometry.coordinates[0] + '\', \'' + projectsFeed.features[i].geometry.coordinates[1] + '\')" class="chapter-card" id="id' + projectsFeed.features[i].properties.id + '"><div class="chapter-card-title"><p>' + projectsFeed.features[i].properties.name + '</p></div><div class="chapter-card-overlay"></div><img src="https://westfieldny.com' + projectsFeed.features[i].properties.image + '" /></div>');
  }
}

// Toggle the chapters menu
$( "#chapters-menu-toggle" ).click(function() {
  $( "div.chapters-menu" ).toggleClass( "show" );
});
