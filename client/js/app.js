(function()
{
  "use strict";

  // Declare app level module which depends on filters, and services
  angular.module("arbapp", ["arbapp.controllers", "arbapp.filters", "arbapp.services"]);

  // angular.injector(["arbapp"]).invoke(function(topic)
  // {
  //   topic.publish("evt/load");
  // });
})();
