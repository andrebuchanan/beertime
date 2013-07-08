(function()
{
'use strict';

/* Controllers */

angular.module('arbapp.controllers', []).
  //
  // App controller. Handle basic functions.
  controller("appCtrl", function($scope, $timeout, Att, events, topic, $window, Chat)
  {
    $scope.attendees = Att.query();
    $scope.dels = {};
    $scope.showAttPanel = true;
    $scope.msg = {
      scroll: "scrolled"
    };

    $scope.scrollTimer = function()
    {
      $timeout(function()
      {
        $scope.msg.scroll = $scope.msg.scroll ? "" : "scrolled";
        $scope.scrollTimer();
      }, 1500);
    };
    $scope.scrollTimer();

    $scope.update = function(att)
    {
      if (att.shout > 3) att.shout = 1;
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

    var eventHorizon = new Date("Jul 12, 2013 16:00:00");
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

    $scope.messages = Chat.query();
    // Chatting
    $scope.sendMessage = function(chat)
    {
      Chat.save(chat, function()
      {
        $scope.chat.message = "";
      });
    };

    topic.subscribe("evt/chat", function(message)
    {
      $scope.messages.push(message.chat);
    });
  });
})();
