'use strict';
// TODO enable when we have angular in this particular test suite ;)
xdescribe('AngularJS promises and Jasmine 2.0', function() { // http://stackoverflow.com/a/23131839
  var $q, $timeout;

  beforeEach(inject(function(_$q_, _$timeout_) {
    // Set `$q` and `$timeout` before tests run
    $q = _$q_;
    $timeout = _$timeout_;
  }));

  // Putting `done` as argument allows async testing
  it('Demonstrates asynchronous testing', function(done) {
    var deferred = $q.defer();

    $timeout(function() {
      deferred.resolve('I told you I would come!');
    }, 1000); // This won't actually wait for 1 second.
    // `$timeout.flush()` will force it to execute.

    deferred.promise.then(function(value) {
      // Tests set within `then` function of promise
      expect(value).toBe('I told you I would come!');
    })
      // IMPORTANT: `done` must be called after promise is resolved
      .finally(done);

    $timeout.flush(); // Force digest cycle to resolve promises
  });
});