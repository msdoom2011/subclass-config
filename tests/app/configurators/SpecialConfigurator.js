app.registerClass('App/SpecialConfigurator', {

    $_extends: "Subclass/ConfiguratorAbstract",

    /**
     * @inheritDoc
     */
    getName: function()
    {
        return 'special';
    },

    /**
     * @inheritDoc
     */
    getTree: function()
    {
        return { type: "map", nullable: true, default: null, schema: {
            margin: { type: "map", schema: {
                left: { type: "number" },
                top: { type: "number" },
                right: { type: "number" },
                bottom: { type: "number" }
            }},
            padding: { type: "map", schema: {
                left: { type: "number" },
                top: { type: "number" },
                right: { type: "number" },
                bottom: { type: "number" }
            }},
            configurator: { type: "class", className: "Subclass/ConfiguratorInterface" }
        }}
    },

    /**
     * @inheritDoc
     */
    alterTree: function(tree, appTree)
    {
        appTree
            .common.schema
                .providers.proto.schema
                    .elements.proto.schema
                        .special = { type: "boolean" };
    },

    /**
     * @inheritDoc
     */
    processConfigs: function(configs, appConfigs)
    {
        //console.log(configs.getData());
        //console.log(appConfigs.getData());
    }
});
