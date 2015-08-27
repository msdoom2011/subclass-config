var app = Subclass.createModule('app', {
    dataTypes: {
        string: { type: 'string', nullable: true }
        //percents: { type: "string", pattern: /^[a-z]+%$/ },
        //bigNumber: { type: "number", minValue: 1000000 },
        //number: { type: "number", maxValue: -10000 }
    },
    parameters: {
        testParameter: "- test parameter value -"
    },
    services: {
        common_configurator: {
            className: "App/CommonConfigurator",
            tags: ['config']
        },
        special_configurator: {
            className: "App/SpecialConfigurator",
            tags: ['config']
        }
    },
    configs: {
        common: {
            width: 100,
            height: 100,
            name: "some name %testParameter% $common.providers.provider_1.elements[0].name$",
            border: true,
            providers: {
                provider_1: {
                    name: "Provider 1 $common.name$",
                    className: "Path/To/Provider1/Class",
                    description: "Some description for the first provider",
                    elements: [
                        {
                            type: "text",
                            name: "Element 1",
                            extra: 111,
                            special: true
                        },
                        {
                            type: "select",
                            name: "Element 2",
                            extra: 222,
                            special: false
                        }
                    ]
                },
                provider_2: {
                    name: "Provider 2",
                    className: "Path/To/Provider2/Class",
                    description: "Some description for the second provider",
                    elements: [
                        {
                            type: "textarea",
                            name: "Element 3",
                            extra: 333,
                            special: true
                        },
                        {
                            type: "chekboxes",
                            name: "Element 4",
                            extra: 333,
                            special: true
                        }
                    ]
                }
            }
        },
        special: {
            margin: {
                left: 10,
                top: 10,
                right: 10,
                bottom: 10
            },
            padding: {
                left: 20,
                top: 20,
                right: 20,
                bottom: 20
            },
            configurator: "@special_configurator"
        }
    },

    onConfig: function(evt, configs)
    {
        console.log(configs.getData());
    }
});