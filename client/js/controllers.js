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
    $scope.dels = {};
    $scope.showAttPanel = true;

    $scope.update = function(att)
    {
      Att.update(att);
    };

    $scope.add = function(att)
    {
      Att.save(att);
    };

    $scope.undo = function(delguy)
    {
      Att.get(delguy, function(oldguy)
      {
        oldguy.deleted = false;
        oldguy.$update();
      });
    };

    $scope.del = function(delme)
    {
      $scope.dels[delme.name] = delme;
      Att.delete(delme);
      $scope.delMessage = "You've deleted " + delme.name + ". Undo?";
    };

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

    $scope.updateList = function(attToFind)
    {
      var added = false;
      angular.forEach($scope.attendees, function(att)
      {
        if (att.name === attToFind.name)
        {
          added = true;
          $scope.attendees[$scope.attendees.indexOf(att)] = attToFind;
        }
      });
      if (!added)
      {
        $scope.attendees.push(attToFind);
      }
    };

    topic.subscribe("evt/rfs", function()
    {
      $window.location.reload();
    });

    topic.subscribe("evt/del", function(message)
    {
      $scope.updateList(message.att);
    });

    topic.subscribe("evt/att", function(message)
    {
      $scope.updateList(message.att);
    });
  });
})();
