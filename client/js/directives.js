(function()
{
'use strict';

/* Directives */
angular.module('arbapp.directives', []).
  directive("numDrink", function()
  {
    return {
      restrict: "A",
      scope: {
        numDrink: "@"
      },
      template: "<span></span>",
      link: function(scope, element, attrs)
      {
        var output = "";
        for (var i = 0; i < attrs.numDrink; i++)
        {
          output += "<img src='/img/beer-icon.png'>";
        }
        console.log("WTF");
        element.html(output);
      }
    };
  }).
  directive("onEnter", function()
  {
    return {
      restrict: "A",
      // scope: {
      //   onEnter: "&"
      // },
      link: function(scope, element, attrs)
      {
        console.log("HI");
        element.bind("keydown keypress", function(event)
        {
          console.log(event);
          if (event.which === 13)
          {
            scope.$apply(attrs.onEnter, scope.chat);
          }
        });
      }
    };
  });
})();
