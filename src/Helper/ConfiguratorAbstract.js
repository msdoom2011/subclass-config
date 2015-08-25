/**
 * @class
 * @abstract
 * @name Subclass.ConfiguratorAbstract
 */
Subclass.ClassManager.registerClass('AbstractClass', 'Subclass/ConfiguratorAbstract',
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
        if (!configManager || !(configManager instanceof Subclass.ConfigManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the instance of subclass config manager', false)
                .expected('an instance of class "Subclass.ConfigManager"')
                .received(configManager)
                .apply()
            ;
        }
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
    isPrivate: function()
    {
        return false;
    },

    /**
     * @inheritDoc
     */
    getTree: function()
    {
        return {};
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
    processConfigs: function(configuratorConfigs, appConfigs)
    {
        // Do something
    }
});