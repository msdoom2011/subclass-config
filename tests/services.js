describe("Injection configuration options into service", function() {
    it ("", function() {
        var serviceManager = app.getServiceManager();
        var testService = serviceManager.getService('test_service');

        expect(testService.getWidth()).toBe(100);
        expect(testService.getHeight()).toBe(100);
    });
});