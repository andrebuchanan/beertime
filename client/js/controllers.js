(function()
{
'use strict';

/* Controllers */

angular.module('arbapp.controllers', []).
  //
  // App controller. Handle basic functions.
  controller("appCtrl", function($scope, $timeout, events, topic, $window, Att, Chat, App)
  {

    $scope.attendees = Att.query();
    $scope.dels = {};
    $scope.status = {};
    $scope.status.viewedMessages = 0;

    // XXX Neaten this please. Make eventHorizon scope var and selectable.
    App.get({ setting: "beerTime" }, function(settingObj)
    {
      $scope.beerTime = new Date(settingObj.value);
      $scope.go();
    });
    $scope.beerClock = new Date();
    $scope.go = function()
    {
      var now = new Date();
      var diff = $scope.beerTime.getTime() - now.getTime();
      $scope.beerClock = Math.floor(diff / 1000);
      $timeout(function()
      {
        $scope.go();
      }, 1000);
    };

    $scope.showDatePicker = function()
    {
      // Attempt to set up date picker.
      jQuery("#beerTime").datepicker();
      jQuery("#beerTime").datepicker("option", "onSelect", function(newDate)
      {
        $scope.status.beerTimeText = newDate;
      });
      jQuery("#beerTime").datepicker("show");
    };

    $scope.saveBeerTime = function(beerTimeText)
    {
      var beerTime = new Date(beerTimeText + " 16:00:00");
      console.log(beerTime);
      $scope.beerTime = beerTime;
      App.save({ setting: "beerTime", value: beerTime });
    };

    $scope.update = function(att)
    {
      if (att.shout > 3) att.shout = 1;
      if (!att.pub) att.shots = att.pub;
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
        $scope.status.viewedMessages = $scope.messages.length;
        chat.message = "";
      });
    };

    // Subscribe to chat events. Update viewed message count only if messages panel is not displayed.
    topic.subscribe("evt/chat", function(message)
    {
      $scope.messages.push(message.chat);
      if ($scope.status.showChat) $scope.status.viewedMessages = $scope.messages.length;
    });
  });
})();
