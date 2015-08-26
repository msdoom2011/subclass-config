var app = Subclass.createModule('app', {
    dataTypes: {
        string: { type: 'string', nullable: true }
        //percents: { type: "string", pattern: /^[a-z]+%$/ },
        //bigNumber: { type: "number", minValue: 1000000 },
        //number: { type: "number", maxValue: -10000 }
    },
    services: {
        first_configurator: {
            className: "App/FirstConfigurator",
            tags: ['config_manager']
        }
    }
});