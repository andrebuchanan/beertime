(function()
{
'use strict';

/* Directives */
angular.module('arbapp.directives', []).
  directive('version', function(version) {
    return {
      replace: true,
      restrict: "E",
      template: '<div>AngualrJS v{{ver}}</div>',
      link: function(scope)
      {
        scope.ver = angular.version.full;
      }
    };
  }).
  // Login Form
  directive("login", function()
  {
    return {
      restrict: "E",
      templateUrl: "partials/login.html",
      replace: true,
      scope: {
        username: "@",
        password: "@",
        login: "&",
        close: "&",
        error: "@"
      },
      link: function(scope, element, attrs)
      {
        scope.showClose = attrs.close ? true : false;
        scope.username = "";
        scope.password = "";
      }
    };
  }).
  //
  directive("markdown", function () {
    var converter = new Showdown.converter();
    return {
      restrict: "AE",
      link: function (scope, element, attrs) {
        attrs.$observe("markdown", function(newValue)
        {
          if (newValue === undefined) return;
          var md = converter.makeHtml(newValue);
          element.html(md);
        });
        if (element.text())
        {
          var md = converter.makeHtml(element.text());
          element.html(md);
        }
      }
    };
  });
})();
