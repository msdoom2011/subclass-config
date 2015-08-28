describe("Checking configuration", function() {
    it ("of application", function() {
        var configs = app.getConfigManager().getConfigs();

        expect(configs.common.width).toBe(100);
        expect(configs.common.height).toBe(100);
        expect(configs.common.name).toBe('some name - test parameter value - Element 1');

        expect(configs.common.providers.get('provider_1').name).toBe('Provider 1 some name - test parameter value - Element 1');
        expect(configs.common.providers.get('provider_1').elements.get(0).extra).toBe(111);
        expect(configs.common.providers.get('provider_1').elements.get(0).special).toBe(true);

        expect(configs.special.margin.top).toBe(10);
        expect(configs.special.padding.bottom).toBe(20);
        expect(configs.special.configurator.isImplements("Subclass/ConfiguratorInterface")).toBe(true);
    });
});