(function()
{
'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('arbapp.services', ["ngResource"]).
  value('version', '0.1').
    factory("topic", function()
    {
      // Place to register topics.
      var topics = {};
      // Return module.
      return {
        // Publish: causes execution of all subscribed callbacks.
        publish: function(topic, args)
        {
          // When publish is used, execute callbacks for each subscribe to the topic.
          angular.forEach(topics[topic], function(item, index)
          {
            // This is doing something I don't fully understand.
            item.apply(null, args || []);
          });
        },
        // Subscribe: register a callback to be executed when topic message is received.
        subscribe: function(topic, callback)
        {
          // If topic doesn't exist, create array for topic.
          if (!topics[topic])
          {
            topics[topic] = [];
          }
          // Add callback to topic array.
          topics[topic].push(callback);
          // Return array of topic and callback for, I assume, use in unsubbing.
          return [topic, callback];
        },
        // Unsubscribe: remove callback from array of subs in topic.
        unsubscribe: function(handle)
        {
          var topic = handle[0];
          angular.forEach(topics[topic], function(item, index)
          {
            // If stored function is same as handle callback, remove element from array.
            if (item === handle[1])
            {
              topics[topic].splice(index, 1);
            }
          });
        }
      };
    }).
  // Event system.
  factory("events", function($http, topic)
  {
    var reqEvent = function()
    {
      $http({ method: "GET", url: "/evt" })
      // On success, immediately ask for more events.
      .success(function(data, status)
      {
        topic.publish("evt/load");
        topic.publish("evt/" + data.type, [data]);
        console.log(new Date().getTime(), ">>> event data", data);
      })
      // Try again after a respectful pause.
      .error(function(data, status, headers, config)
      {
        setTimeout(function()
        {
          topic.publish("evt/load");
        }, 10000);
      });
    };

    // When the evt/load message is published, go and get events from the server.
    topic.subscribe("evt/load", reqEvent);
    // Kick off point for event gathering.
    topic.publish("evt/load");
  }).
  factory("Att", function($resource)
  {
    var Att = $resource("/att/:name", {}, {
      update: {
        method: "PUT"
      },
      cache: {
        method: "GET"
      }
    });
    return Att;
  }).
  factory("Chat", function($resource)
  {
    var Chat = $resource("/chat/:name", {},{
    });
    return Chat;
  });
})();
