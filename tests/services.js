describe("Injection configuration options into service", function() {
    it ("", function() {
        var inst = app.createInstance();
        var container = inst.getServiceContainer();
        var testService = container.get('test_service');

        expect(testService.getWidth()).toBe(100);
        expect(testService.getHeight()).toBe(100);
    });
});