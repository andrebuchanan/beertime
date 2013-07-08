(function()
{
'use strict';

/* Filters */

angular.module('arbapp.filters', []).
  filter("hms", function()
  {
    return function(input, portion) {
      var seconds = Math.floor(input);
      var hours = Math.floor(seconds / 3600);
      var days = Math.floor(hours / 24);
      var minutes = Math.floor(seconds / 60);
      hours -= days * 24;
      minutes -= (hours * 60) + (days * 24 * 60);
      seconds -= (minutes * 60) + (hours * 3600) + (days * 24 * 3600);
      var parts = {
        d: days,
        h: hours,
        m: minutes,
        s: seconds
      };
      if (!portion) return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
      return parts[portion] < 10 && parts[portion] >= 0 ? "0" + parts[portion] : parts[portion];
    };
  }).
  filter("face", function()
  {
    return function(input)
    {
      if (input > 3600 * 24 * 4) return ":-C";
      if (input > 3600 * 24 * 3) return ":-(";
      if (input > 3600 * 24 * 2) return ":-/";
      if (input > 3600 * 24) return ":-L";
      if (input > 3600 * 4) return ":-|";
      if (input > 1800) return ":-)";
      return "8-)";
    };
  }).
  filter("onoff", function()
  {
    return function(input)
    {
      return input ? "O" : "X";
    };
  }).
  // Uppercase first letter;
  filter("fuppercase", function()
  {
    return function(text)
    {
      return text.charAt(0).toUpperCase() + text.slice(1);
    };
  });
})();
