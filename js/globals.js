"use strict";

var S3_PREFIX = "https://s3.amazonaws.com/mix.suraiyahossain.com/";
var MIN_YEAR = 2008;
var MAX_YEAR = 2022;

var Helpers = {
  parseYear: function (input) {
    input = input.toString();
    if (!input) {
      return MAX_YEAR;
    }
    if (input.startsWith("#")) {
      input = input.substring(1);
    }
    if (input == "all") {
      return input;
    }
    var re = /(20\d\d)/;
    var matches = re.exec(input);
    if (matches && matches.length > 1) {
      var year = matches[1];
      if (year >= MIN_YEAR && year <= MAX_YEAR) {
        return parseInt(year);
      }
    }
    return MAX_YEAR;
  },
};
