(function()
{
'use strict';

/* Controllers */

angular.module('arbapp.controllers', []).
  //
  // App controller. Handle basic functions.
  controller("appCtrl", function($scope, $timeout, Att, events, topic, $window)
  {
    $scope.attendees = Att.query();

    $scope.update = function(att)
    {
      Att.update(att);
    };

    $scope.add = function(att)
    {
      Att.save(att, function(newAtt)
      {
        $scope.attendees.push(newAtt)        ;
      });
    }

    var eventHorizon = new Date("Jul 5, 2013 16:30:00");
    $scope.beerDate = eventHorizon;
    $scope.beerClock = new Date();
    $scope.go = function()
    {
      var now = new Date();
      var diff = eventHorizon.getTime() - now.getTime();
      $scope.beerClock = Math.floor(diff / 1000);
      $timeout(function()
      {
        $scope.go();
      }, 1000);
    };
    $scope.go();

    topic.subscribe("evt/rfs", function()
    {
      $window.location.reload();
    });

    topic.subscribe("evt/att", function(message)
    {
      console.log(message, $scope.attendees);
      Att.cache(message.att);
    });
  });
})();
