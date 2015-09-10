app.registerClass('App/ExpandedConfigurator', {

    $_extends: "Subclass/ConfiguratorAbstract",

    /**
     * @inheritDoc
     */
    getName: function()
    {
        return 'expanded';
    },

    /**
     * @inheritDoc
     */
    isExpanded: function()
    {
        return true;
    },

    /**
     * @inheritDoc
     */
    getTree: function()
    {
        return {
            exp1: { type: "number", default: 100 },
            exp2: { type: "number", default: 200 }
        };
    },

    /**
     * @inheritDoc
     */
    alterTree: function(tree, appTree)
    {
        appTree.exp1 = { type: "string", default: "100" };
    }
});
