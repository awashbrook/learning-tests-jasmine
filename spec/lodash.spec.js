'use strict';
var _ = require('lodash');

describe("tests to learn lodash.js", function () {
  it("shows even deepClone works", function () {
    var objects = [ { 'a': 1 }, { 'b': 2 } ];
    var deep = _.cloneDeep(objects);
    expect(deep[0] === objects[0]).not.toBeTruthy();
    expect(deep[0]).not.toBe(objects[0]);
  });
  it("shows even deepClone works efficiently clone nested objects by reference only ONCE", function () {
    var object = {};
    var objects = [ object, object ];
    expect(objects[1]).toBe(objects[0]);
    var deep = _.cloneDeep(objects);
    expect(deep[1]).toBe(deep[0]); // Can surprise, behaviour identical for angular.copy();
  });
  it("shows lodash 4 supports only map and not pluck anymore", function () {
    var objects = [ { 'a': 1 }, { 'a': 2 } ];
    expect(_.pluck).toBeUndefined(); // removed in lodash 3
    expect(_.map(objects, 'a')).toEqual( [1, 2]); // lodash 4
  });
});
