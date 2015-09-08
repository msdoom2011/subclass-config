describe("Checking configuration", function() {
    it ("of application", function() {

        var inst = app.createInstance();
        var configs = inst.getConfigContainer().getConfigs();

        expect(configs.common.width).toBe(100);
        expect(configs.common.height).toBe(100);
        expect(configs.common.border).toBe(false);
        expect(configs.common.name).toBe('some name - second plugin test value - Element 1');
        expect(configs.common.extraThird).toBe(false);
        expect(configs.forth.extraForth).toBe(1000);

        expect(configs.common.providers.get('provider_1').name).toBe('Provider 1 some name - second plugin test value - Element 1');
        expect(configs.common.providers.get('provider_1').elements.get(0).extra).toBe(111);
        expect(configs.common.providers.get('provider_1').elements.get(0).special).toBe(true);
        expect(configs.common.providers.get('provider_2').name).toBe('Provider 2 Path/To/Provider2/Class');

        expect(configs.special.margin.top).toBe(10);
        expect(configs.special.padding.bottom).toBe(20);
        expect(configs.special.configurator.isImplements("Subclass/ConfiguratorInterface")).toBe(true);
    });
});