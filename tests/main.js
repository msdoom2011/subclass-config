
// It is required by normal call on onReady callbacks

describe("Launching tests", function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 300;

    it("and setting launch timeout", function(done) {
        setTimeout(function() {
            done();
        }, 200);
    });
});