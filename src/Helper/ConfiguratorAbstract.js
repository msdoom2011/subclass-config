/**
 * @class
 * @abstract
 * @name Subclass.ConfiguratorAbstract
 */
Subclass.ClassManager.register('AbstractClass', 'Subclass/ConfiguratorAbstract',
{
    $_implements: ["Subclass/ConfiguratorInterface"],

    /**
     * An instance of subclass config manager
     *
     * @type {Subclass.ConfigManager}
     * @private
     */
    _configManager: null,

    /**
     * @inheritDoc
     */
    setConfigManager: function(configManager)
    {
        if (!configManager || !(configManager instanceof Subclass.Property.ConfigManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the instance of subclass config manager', false)
                .expected('an instance of class "Subclass.Property.ConfigManager"')
                .received(configManager)
                .apply()
            ;
        }
        this._configManager = configManager;
    },

    /**
     * @inheritDoc
     */
    getConfigManager: function()
    {
        return this._configManager;
    },

    /**
     * @inheritDoc
     */
    getModuleInstance: function()
    {
        var configManager = this.getConfigManager();
        var configContainer = configManager.getConfigContainer();

        return configContainer.getModuleInstance();
    },

    /**
     * @inheritDoc
     */
    isPrivate: function()
    {
        return false;
    },

    /**
     * @inheritDoc
     */
    isExpanded: function()
    {
        return false;
    },

    /**
     * @inheritDoc
     */
    getTree: function()
    {
        return {
            "type": "map",
            "schema": {},
            "nullable": true,
            "default": null
        };
    },

    /**
     * @inheritDoc
     */
    alterTree: function(tree, appTree)
    {
        // Do something
    },

    /**
     * @inheritDoc
     */
    processConfigs: function(configs, appConfigs)
    {
        // Do something
    }
});