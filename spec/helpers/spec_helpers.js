'use strict';
var _ = require('lodash');

var customMatchers = {
  toDeepEqual: function () {
    return {
      compare: function (actual, expected) {
        if (expected === undefined) {
          expected = '';
        }
        var result = {};
        result.pass = _.isEqual(actual, expected);
        /* default behaviour of expectation exactly matches the following :)
         if (result.pass) {
         result.message = "Expected" + JSON.stringify(actual) + "not to be deeply equal to " + JSON.stringify(expected);
         } else {
         result.message = "Expected" + JSON.stringify(actual) + "to be deeply equal to " + JSON.stringify(expected);
         }
         */
        return result;
      }
    };
  }
};
beforeEach(function () {
  jasmine.addMatchers(customMatchers);
});

describe("debug for jasmine", function () {
  it('should log jasmine version', function () {
    if (jasmine.version) { //the case for version 2.0.0
      console.log('jasmine-version:' + jasmine.version);
    }
    else { //the case for version 1.3
      console.log('jasmine-version:' + jasmine.getEnv().versionString());
    }
  });
});
