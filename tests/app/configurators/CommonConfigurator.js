app.registerClass('App/CommonConfigurator', {

    $_extends: "Subclass/ConfiguratorAbstract",

    /**
     * @inheritDoc
     */
    getName: function()
    {
        return 'common';
    },

    /**
     * @inheritDoc
     */
    getTree: function()
    {
        return { type: "map", nullable: true, default: null, schema: {
            width: { type: "number" },
            height: { type: "number" },
            name: { type: "string" },
            border: { type: "boolean", default: false },
            providers: { type: "objectCollection", proto: { type: "map", schema: {
                name: { type: "string" },
                className: { type: "string" },
                description: { type: "string" },
                elements: { type: "arrayCollection", proto: { type: "map", schema: {
                    type: { type: "string" },
                    name: { type: "string" }
                }}}
            }}}
        }}
    },

    /**
     * @inheritDoc
     */
    alterTree: function(tree, appTree)
    {
        tree.schema
            .providers.proto.schema
                .elements.proto.schema
                    .extra = { type: "number" };
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
