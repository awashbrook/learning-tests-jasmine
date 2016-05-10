'use strict';
var moment = require('moment');

describe("tests to learn moment.js", function () {
  it("should show how we validate a moment", function () {
    expect(moment.utc(1, "d").isValid).toBeDefined();
    expect(moment.utc(1, "d").isValid).toEqual(jasmine.any(Function));
    expect(moment.utc(1, "d").isValid()).toBeTruthy();
    expect(moment.utc("foobar").isValid()).toBeFalsy(); // triggers deprecation warning with moment.js 2.9.0
  });
  it("should show how we validate a moment duration", function () {
    expect(moment.duration(1, "d").isValid).toBeUndefined(); // Duration does not support moment.isValid
    expect(moment.duration(1, "d").isValid).not.toEqual(jasmine.any(Function));
    expect(moment.duration(1, "d").valueOf()).not.toEqual(0); // This is how you validate a duration
    expect(moment.duration(1, "foobar").valueOf()).toEqual(0);
  });
  it("should show same behavior for no args and undefined - naturally so - moment returns the present instant for both", function () {
    expect(moment.isMoment(moment.utc())).toBeTruthy();
    expect(moment.isMoment(moment.utc(undefined))).toBeTruthy();
    expect(moment.utc().isValid).toEqual(jasmine.any(Function));
    expect(moment.utc().isValid()).toBeTruthy();
    expect(moment.utc(undefined).isValid()).toBeTruthy();
    expect(moment.utc().seconds() === moment.utc(undefined).seconds()).toBeTruthy();
  });
  it("should show how 'null' is interpretated - very differently - as epoch time NaN", function () {
    expect(moment.isMoment(moment.utc(null))).toBeTruthy();
    expect(moment.utc(null).isValid()).toBeFalsy();
    expect(Object.is(NaN, moment.utc(null).valueOf())).toBeTruthy();
    expect(Object.is(NaN, moment.utc(null).unix())).toBeTruthy();
  });
  it("should show that moment and Date handle undefined and null very differently!", function () {
    expect(Object.is(NaN, new Date(undefined).valueOf())).toBeTruthy();
    expect(Object.is(0, new Date(null).valueOf())).toBeTruthy();
    expect(Object.is(moment.utc(undefined), new Date(undefined).valueOf())).toBeFalsy();
    expect(Object.is(moment.utc(null), new Date(null).valueOf())).toBeFalsy();
  });
  it("shows you how to clone() a moment and to use copy constructor for duration!", function () {
    var thePresentMoment = moment.utc();
    expect(thePresentMoment.clone).toBeDefined();
    expect(thePresentMoment.clone).toEqual(jasmine.any(Function));
    expect(thePresentMoment.clone()).not.toBe(thePresentMoment); // clone
    expect(moment.utc(thePresentMoment)).not.toBe(thePresentMoment); // copy constructor
    expect(JSON.stringify(thePresentMoment.clone())).toEqual(JSON.stringify(thePresentMoment));

    //https://github.com/moment/moment/blob/develop/test/moment/duration.js
    var yesterday = moment.duration(1, "days");
    expect(yesterday.clone).toBeUndefined();
    expect(moment.duration(yesterday)).not.toBe(yesterday); // copy constructor
    expect(JSON.stringify(moment.duration(yesterday))).toEqual(JSON.stringify(yesterday));
  });
  it("should show how to correctly determine a moment vs duration instance: not using member function of Moment objects, but static factory method only!", function () {
    var thePresentMoment = moment.utc();
    expect(thePresentMoment.isMoment).toBeUndefined();
    expect(thePresentMoment.isMoment).not.toEqual(jasmine.any(Function));

    expect(moment.isMoment(moment.duration(3, "days"))).toBeFalsy();
    expect(moment.isDuration(moment.utc())).toBeFalsy();
    expect(moment.isDuration(moment.duration(3, "days"))).toBeTruthy();
    expect(moment.isDuration(moment.utc())).toBeFalsy();
  });
  it('should prove miscellaneous assumptions around moment.js', function () {
    expect("a day ago").toEqual(moment.duration(-1, "days").humanize(true)); // Our default interval :)
    expect(moment.duration(-3, "days")).toEqual(moment.duration(-3, "d"));
    expect(moment.duration(-2, "days")).toEqual(moment.duration(-2, "d"));
    expect(moment.duration(2, "days")).toEqual(moment.duration(2, "d"));
    expect(moment.duration(3, "days")).toEqual(moment.duration(3, "d"));
    expect(moment.duration(3, "days")).toEqual(moment.duration(3, "d"));
    expect(parseInt("3m")).toEqual(3); // This is to generous for us :)
    expect(parseInt("-3days")).toEqual(-3); // This is to generous for us :)

    expect(moment.utc(1424283310165).unix()).toEqual(1424283310); // unix is seconds from epoch, not millis
    expect(moment.utc(1424196910165).toISOString()).toEqual("2015-02-17T18:15:10.165Z");
    expect(moment.utc("2000-02-01T01:00:00.000Z").unix()).toEqual(949366800);
    expect(moment.duration(5, "m").toISOString()).toEqual("PT5M");
    expect(moment.utc(1424196910165).isSame(moment.utc(1424196910165))).toBeTruthy(); // Along with ISO sting, NOT deprecated...
    expect(moment.utc("1424196910165").isSame(moment.utc(1424196910165))).toBeFalsy(); // Irritating we can't specify moment as integer string!

    expect(JSON.stringify(moment.utc("2000-02-01T01:00:00.000Z"))).toEqual(JSON.stringify("2000-02-01T01:00:00.000Z")); // moment.toJSON() uses ISO
    expect(JSON.stringify(moment.utc(1424196910165))).toEqual(JSON.stringify("2015-02-17T18:15:10.165Z")); // moment.toJSON() uses ISO
    expect(JSON.stringify(moment.duration(5, 'm'))).toEqual(JSON.stringify("PT5M")); // moment.duration.toJSON() only works with moment.js 2.9.0+
    expect(JSON.stringify(moment.utc(moment.utc("1424196910165")))).toEqual(JSON.stringify(moment.utc("1424196910165"))); // are moments idempotent
    expect(JSON.stringify(moment.duration(moment.duration(3, "days")))).toEqual(JSON.stringify(moment.duration(3, "days"))); // are durations idempotent

    expect(moment.utc(1424283310165).add(moment.duration(-1, "days")).isSame(moment.utc(1424196910165))).toBeTruthy(); // These epoch times are 24h apart
  });
  it("moment duration behaviour for weeks", function () {
    var duration = moment.duration(8, "days");
    var weeksInMonth = duration.weeks(); // http://momentjs.com/docs/#/durations/weeks/ max 4 in month!
    expect(weeksInMonth).toEqual(jasmine.any(Number));
    expect(weeksInMonth % 1).toEqual(0); // integer
    expect(weeksInMonth).toEqual(1);

    var fractionalWeeks = duration.asWeeks();
    expect(fractionalWeeks).toEqual(jasmine.any(Number));
    expect(fractionalWeeks % 1).not.toEqual(0); // floating

    var roundedWeeks = Math.floor( fractionalWeeks );
    expect(duration.subtract(roundedWeeks, 'weeks').asDays()).toEqual(1);
  });
});





















