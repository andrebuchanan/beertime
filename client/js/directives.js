(function()
{
'use strict';

/* Directives */
angular.module('arbapp.directives', []).
  directive("numdrink", function()
  {
    return {
      restrict: "A",
      // scope: {
      //   numdrink: "@"
      // },
      link: function(scope, element, attrs)
      {
        attrs.$observe("numdrink", function(newValue)
        {
          var output = "";
          for (var i = 0; i < attrs.numdrink; i++)
          {
            output += "<img src='/img/beer-icon.png'>";
          }
          element.html(output);
        });
      }
    };
  }).
  directive("onenter", function()
  {
    return {
      restrict: "A",
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
