var appThirdPlugin = Subclass.createModule('appThirdPlugin', {
    plugin: true,
    services: {
        third_configurator: {
            className: "ThirdPluginConfigurator",
            tags: ['config']
        },
        third_test_service: {
            className: "App/ThirdTestConfigService",
            arguments: ["$common.width$", "$common.height$"]
        }
    },
    configs: {
        common: {
            extraThird: false
        }
    }
});

!function() {

    appThirdPlugin.registerClass('ThirdPluginConfigurator', {

        $_extends: "Subclass/ConfiguratorAbstract",

        getName: function()
        {
            return 'third_plugin';
        },

        isPrivate: function()
        {
            return true;
        },

        alterTree: function(tree, appTree)
        {
            appTree.common.schema
                .extraThird = { type: "boolean", default: true }
            ;
        }
    });

    appThirdPlugin.registerClass('App/ThirdTestConfigService', {
        $_extends: "App/TestConfigService"
    });
}();