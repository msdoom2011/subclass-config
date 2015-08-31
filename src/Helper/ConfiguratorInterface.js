/**
 * @interface
 * @name Subclass.ConfiguratorInterface
 */
Subclass.ClassManager.register('Interface', 'Subclass/ConfiguratorInterface',
{
    /**
     * Sets instance of subclass config manager
     *
     * @param {Subclass.ConfigManager} configManager
     *      Instance of subclass config manager
     */
    setConfigManager: function(configManager) {},

    /**
     * Returns instance of subclass config manager
     *
     * @returns {Subclass.ConfigManager}
     */
    getConfigManager: function() {},

    /**
     * Returns name of configuration tree
     *
     * @returns {string}
     */
    getName: function() {},

    /**
     * Reports whether current configuration tree can be accessed
     * in the root app configuration object level
     *
     * @returns {boolean}
     */
    isPrivate: function() {},

    /**
     * Returns object containing definitions of typed properties.
     * Each declared property is your configuration option.
     *
     * @returns {Object}
     */
    getTree: function() {},

    /**
     * Alters configuration definition object.
     * Allows add/edit/remove config definition parts of all application
     *
     * @param {Object} tree
     * @param {Object} appTree
     */
    alterTree: function(tree, appTree) {},

    /**
     * Processes configuration values of current configurator
     *
     * @param {Object} configs
     * @param {Object} appConfigs
     */
    processConfigs: function(configs, appConfigs) {}
});