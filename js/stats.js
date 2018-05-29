var projectsAPI = 'https://westfieldny.com/api/geojson/projects';

var projectsFeed = (function () {
    var projectsData = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': projectsAPI,
        'dataType': "json",
        'success': function (data) {
            projectsData = data;
        }
    });
    return projectsData;
})();

var constructionJobs;
var cost;
var jobsRetained;
var economicImpact;
var indirectJobs;
var requiredInvestment;

// Add commas to numbers
$.fn.digits = function(){
    return this.each(function(){
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
    })
}

function runStats() {
  constructionJobs = 0;
  cost = 0;
  jobsRetained = 0;
  economicImpact = 0;
  indirectJobs = 0;
  requiredInvestment = 0;

  if (formProjectStatus == 'All' && formProjectType == 'All') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      constructionJobs = constructionJobs + parseInt(projectsFeed.features[i].properties.construction_jobs, 10);
      cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
      jobsRetained = jobsRetained + parseInt(projectsFeed.features[i].properties.jobs_retained, 10);
      economicImpact = economicImpact + parseInt(projectsFeed.features[i].properties.economic_impact, 10);
      indirectJobs = indirectJobs + parseInt(projectsFeed.features[i].properties.indirect_jobs, 10);
      requiredInvestment = requiredInvestment + parseInt(projectsFeed.features[i].properties.required_investment, 10);
    }
  } else if (formProjectStatus == 'All' && formProjectType != 'All') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (formProjectType == projectsFeed.features[i].properties.type) {
        constructionJobs = constructionJobs + parseInt(projectsFeed.features[i].properties.construction_jobs, 10);
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        jobsRetained = jobsRetained + parseInt(projectsFeed.features[i].properties.jobs_retained, 10);
        economicImpact = economicImpact + parseInt(projectsFeed.features[i].properties.economic_impact, 10);
        indirectJobs = indirectJobs + parseInt(projectsFeed.features[i].properties.indirect_jobs, 10);
        requiredInvestment = requiredInvestment + parseInt(projectsFeed.features[i].properties.required_investment, 10);
      }
    }
  } else if (formProjectStatus != 'All' && formProjectType == 'All') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (formProjectStatus == projectsFeed.features[i].properties.status) {
        constructionJobs = constructionJobs + parseInt(projectsFeed.features[i].properties.construction_jobs, 10);
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        jobsRetained = jobsRetained + parseInt(projectsFeed.features[i].properties.jobs_retained, 10);
        economicImpact = economicImpact + parseInt(projectsFeed.features[i].properties.economic_impact, 10);
        indirectJobs = indirectJobs + parseInt(projectsFeed.features[i].properties.indirect_jobs, 10);
        requiredInvestment = requiredInvestment + parseInt(projectsFeed.features[i].properties.required_investment, 10);
      }
    }
  } else if (formProjectStatus != 'All' && formProjectType != 'All') {
    for (var i = 0; i < projectsFeed.features.length; i++) {
      if (formProjectStatus == projectsFeed.features[i].properties.status  && formProjectType == projectsFeed.features[i].properties.type) {
        constructionJobs = constructionJobs + parseInt(projectsFeed.features[i].properties.construction_jobs, 10);
        cost = cost + parseInt(projectsFeed.features[i].properties.cost, 10);
        jobsRetained = jobsRetained + parseInt(projectsFeed.features[i].properties.jobs_retained, 10);
        economicImpact = economicImpact + parseInt(projectsFeed.features[i].properties.economic_impact, 10);
        indirectJobs = indirectJobs + parseInt(projectsFeed.features[i].properties.indirect_jobs, 10);
        requiredInvestment = requiredInvestment + parseInt(projectsFeed.features[i].properties.required_investment, 10);
      }
    }
  }


  $('#constructionJobs').html(constructionJobs);
  $('#cost').html(cost);
  $('#jobsRetained').html(jobsRetained);
  $('#economicImpact').html(economicImpact);
  $('#indirectJobs').html(indirectJobs);
  $('#requiredInvestment').html(requiredInvestment);
}

runStats();
