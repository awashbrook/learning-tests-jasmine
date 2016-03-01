'use strict';
var _ = require('lodash');

describe("tests to learn jasmine, javascript, em6, lodash", function () {
  // TODO we have now upgraded Jasmine 1.3.1 > 2.1.3 so integrate custom matcher properly
  //beforeEach(function () {
  //  jasmine.addMatchers({
  //    toDeepEqual: function (expected) {
  //      return _.isEqual(this.actual, expected);
  //    }
  //  });
  //});
  it('should log jasmine version', function () {
    if (jasmine.version) { //the case for version 2.0.0
      console.log('jasmine-version:' + jasmine.version);
    }
    else { //the case for version 1.3
      console.log('jasmine-version:' + jasmine.getEnv().versionString());
    }
  });
  it("should cover sample tests for Object.is", function () {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    expect(Object.is('foo', 'foo')).toBeTruthy();     // true
    //expect(Object.is(window, window)).toBeTruthy();   // true // browser only
    expect(Object.is('foo', 'bar')).toBeFalsy();     // false
    expect(Object.is([], [])).toBeFalsy();           // false
    var test = { a: 1 };
    expect(Object.is(test, test)).toBeTruthy();       // true
    expect(Object.is(null, null)).toBeTruthy();       // true
    // Special Cases
    expect(Object.is(0, -0)).toBeFalsy();            // false
    expect(Object.is(-0, -0)).toBeTruthy();           // true
    expect(Object.is(NaN, 0/0)).toBeTruthy();         // true
    expect(Object.is(NaN, NaN)).toBeTruthy();         // true
  });
  it('should provide sanity test comparing objects in general', function () {
    expect(JSON.stringify(({
      from: 'then',
      to: 'now'
    }))).toEqual(JSON.stringify({
      from: 'then',
      to: 'now'
    }));
    expect(JSON.stringify(({
      from: 'then',
      to: 'now'
    }))).not.toEqual(JSON.stringify({ // order dependence of serializing JSON is a major issue :)
        to: 'now',
        from: 'then'
      }));
    expect(_.isEqual({
      from: 'then',
      to: 'now'
    }, { // this appears to be order insensitive :)
      to: 'now',
      from: 'then'
    })).toBeTruthy();
    //expect(({
    //  from: 'then',
    //  to: 'now'
    //})).toDeepEqual({
    //  to: 'now',
    //  from: 'then'
    //});
  });
});
