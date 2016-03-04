'use strict';
var _ = require('lodash');

describe("tests to learn lodash.js", function () {
  it("shows even deepClone works", function () {
    var objects = [
      { 'a': 1 },
      { 'b': 2 }
    ];
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
  it("shows _.sortBy function semantics are not like Array.sort with tuple args", function () {
// Can sortBy really take two params like sort()?
//    return _.sortBy(problems, function (a, b) {
//      return extractPainFromCPI(b.cpi, cpiLabel) - extractPainFromCPI(a.cpi, cpiLabel);
//    };
  });
  it("show how lodash sortByAll behaviour now part of sortAll", function () {
    var users = [
      { 'user': 'fred',   'age': 48 },
      { 'user': 'barney', 'age': 36 },
      { 'user': 'fred',   'age': 42 },
      { 'user': 'barney', 'age': 34 }
    ];
    var sortedValues = _.map(_.sortBy(users, ['user', 'age']), _.values);
    expect(sortedValues).toDeepEqual([['barney', 34], ['barney', 36], ['fred', 42], ['fred', 48]]);

    sortedValues = _.map(_.sortBy(users, 'user', function(chr) {
      return Math.floor(chr.age / 10); // Ignores age diff in same decade
    }), _.values);
    expect(sortedValues).toDeepEqual([['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]);
  });
  it("shows lodash 4 supports only map and not pluck anymore", function () {
    var objects = [
      { 'a': 1 },
      { 'a': 2 }
    ];
    expect(_.pluck).toBeUndefined(); // removed in lodash 3
    expect(_.map(objects, 'a')).toEqual([1, 2]); // lodash 4
  });
  describe("sorting in lodash 4 using orderBy", function () {
    it("sorts as per readme", function () {
      var users = [
        { 'user': 'fred', 'age': 48 },
        { 'user': 'barney', 'age': 34 },
        { 'user': 'fred', 'age': 42 },
        { 'user': 'barney', 'age': 36 }
      ];
      expect(_.sortByOrder).toBeUndefined(); // removed in lodash 3
      var sorted = _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
      console.log(JSON.stringify(sorted));
      // Sort by `user` in ascending order and by `age` in descending order.
      // → objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]
      expect(sorted).toEqual([
        {"user": "barney", "age": 36},
        {"user": "barney", "age": 34},
        {"user": "fred", "age": 48},
        {"user": "fred", "age": 42}
      ]); // lodash 4
    });
    it("sorts with mixed variety of iteratees / identical to sortBy readme with default ascending sort", function () {
      var users = [
        { 'user': 'fred',   'age': 48 },
        { 'user': 'barney', 'age': 36 },
        { 'user': 'fred',   'age': 42 },
        { 'user': 'barney', 'age': 34 }
      ];
      var sortedValues = _.map(
        _.orderBy(users,
          [ 'user', function (chr) { return Math.floor(chr.age / 10); } ]
        ), _.values);
      expect(sortedValues).toDeepEqual([['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]);
    });
    it("sorts with mixed variety of iteratees by ascending name and descending age", function () {
      var users = [
        { 'user': 'fred',   'age': 42 },
        { 'user': 'barney', 'age': 34 },
        { 'user': 'fred',   'age': 48 },
        { 'user': 'barney', 'age': 36 }
      ];
      var sortedValues = _.map(
        _.orderBy(users,
          [ 'user', function (chr) { return chr.age; } ],
          ['asc', 'desc']
        ), _.values);
      expect(sortedValues).toDeepEqual([['barney', 36], ['barney', 34], ['fred', 48], ['fred', 42]]);
    });
    it("sorts with mixed variety of iteratees and shows sorting of numeric string same as numbers", function () {
      var users = [
        { 'user': 'fred',   'age': '1' },
        { 'user': 'barney', 'age': 34 },
        { 'user': 'fred',   'age': '10' },
        { 'user': 'barney', 'age': 36 }
      ];
      var sortedValues = _.map(
        _.orderBy(users,
          [ 'user', function (chr) { return chr.age; } ],
          ['asc', 'desc']
        ), _.values);
      expect(sortedValues).toDeepEqual([['barney', 36], ['barney', 34], ['fred', '10'], ['fred', '1']]);
    });
  });
});


























