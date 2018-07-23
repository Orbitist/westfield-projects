function getParameterByName(name, url) {
    if (!url) url = window.parent.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var queryType = getParameterByName('type');

if (queryType) {

  $('#projectType').val(queryType);

  map.on('load', function(e) {
    formProjectType = $("#projectType").find("option:selected").val();
    typeFilter = ["==", 'type', formProjectType];
    buildProjectsFilter();
    if (formProjectStatus == 'Any Project Status' && formProjectType == 'Any Project Type'){
      map.setFilter('projects');
      runStats();
    } else {
      map.setFilter('projects', projectsFilterParams);
      runStats();
    }
  });

}
