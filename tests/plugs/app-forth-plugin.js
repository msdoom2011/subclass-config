var appForthPlugin = Subclass.createModule('appForthPlugin', {
    pluginOf: 'appSecondPlugin',
    services: {
        forth_configurator: {
            className: "ForthPluginConfigurator",
            tags: ['config']
        }
    },
    configs: {
        forth: {
            extraForth: 1000
        }
    }
});

!function() {

    appForthPlugin.registerClass('ForthPluginConfigurator', {

        $_extends: "Subclass/ConfiguratorAbstract",

        getName: function()
        {
            return 'forth_plugin';
        },

        isPrivate: function()
        {
            return true;
        },

        getTree: function()
        {
            return { type: "map", schema: {
                extraForth: { type: "number" }
            }};
        }
    });
}();