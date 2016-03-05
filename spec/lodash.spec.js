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
  fdescribe("compare _.sortBy function semantics are not like Array.sort with tuple args", function () {
    var fruit, sortedFruit, sortedValues, scores, stringyScores, things, ages, stringyAges;
    beforeEach(function () {
      fruit = ['cherries', 'apples', 'bananas'];
      scores = [1, 10, 2, 21];
      stringyScores = ['1', '10', '2', '21'];
      things = ['word', 'Word', '1 Word', '2 Words'];
      ages = [ { 'age': 1 }, { 'age': 10 }, { 'age': 2 }, { 'age': 21 } ];
      stringyAges = [ { 'age': '1' }, { 'age': '10' }, { 'age': '2' }, { 'age': '21' } ];
    });
    it("array method obviously sort the original array of problems", function () {
      sortedFruit = fruit.sort();
      expect(sortedFruit).toEqual(['apples', 'bananas', 'cherries']);
      expect(sortedFruit).toBe(fruit);
    });
    it("lodash will create a new array of problems", function () {
      sortedFruit = _.sortBy(fruit);
      expect(sortedFruit).toEqual(['apples', 'bananas', 'cherries']);
      expect(sortedFruit).not.toBe(fruit);
    });
    it("array sort always alphanumeric, even when elements are integers: 1 > 10 > 2!", function () {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
      expect(stringyScores.sort()).toEqual([ '1', '10', '2', '21' ]);
      expect(scores.sort()).toEqual([1, 10, 2, 21]);
      // Watch out that 10 comes before 2, because '10' comes before '2' in Unicode code point order.
      var things = ['word', 'Word', '1 Word', '2 Words'];
      expect(things.sort()).toEqual(['1 Word', '2 Words', 'Word', 'word']);
      // In Unicode, numbers come before upper case letters, which come before lower case letters.
    });
    it("lodash respects strings & integers and does not attempt to convert them", function () {
      expect(stringyScores.sort()).toEqual([ '1', '10', '2', '21' ]);
      expect(_.sortBy(scores)).toEqual([ 1, 2, 10, 21 ]);
      // Watch out that 10 comes before 2, because '10' comes before '2' in Unicode code point order.
      expect(_.sortBy(things)).toEqual(['1 Word', '2 Words', 'Word', 'word']);
      // In Unicode, numbers come before upper case letters, which come before lower case letters.
    });
    it("explicit comparitor needed to force a numeric array sort, coerces strings into integers and: 1 > 2 > 10", function () {
      expect(scores.sort(function(a, b) {
        return a - b;
      })).toEqual([ 1, 2, 10, 21 ]);
      expect(stringyScores.sort(function(a, b) {
        return a - b;
      })).toEqual([ '1', '2', '10', '21' ]);
    });
    it("lodash also needs coercing to force a strings into a numeric sort: 1 > 2 > 10", function () {
      expect(_.sortBy(scores, function(s) {
        return +s;
      })).toEqual([ 1, 2, 10, 21 ]);
      expect(_.sortBy(stringyScores, function(s) {
        return +s;
      })).toEqual([ '1', '2', '10', '21' ]);
    });
    it("lodash also needs coercing to force string object elements into a numeric sort: 1 > 2 > 10", function () {
      sortedValues = _.map(
        _.sortBy(ages, 'age'
        ), _.values);
      expect(sortedValues).toEqual( [ [ 1 ], [ 2 ], [ 10 ], [ 21 ] ]);
      sortedValues = _.map(
        _.sortBy(stringyAges, 'age'
        ), _.values);
      expect(sortedValues).toEqual([ [ '1' ], [ '10' ], [ '2' ], [ '21' ] ]);
      sortedValues = _.map(
        _.sortBy(stringyAges, function (o) { return +o.age; }
        ), _.values);
      expect(sortedValues).toEqual([ [ '1' ], [ '2' ], [ '10' ], [ '21' ] ]);
    });
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


























