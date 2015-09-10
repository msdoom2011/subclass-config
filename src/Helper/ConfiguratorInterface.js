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
     * If returns true then all returned properties by getTree methods
     * will be added in the root scope of the module configuration
     *
     * @returns {boolean}
     */
    isExpanded: function() {},

    /**
     * Returns object which contains definitions of typed properties.
     * Each declared property is option in your module configuration object.
     *
     * If method isExpanded returns true, then current method
     * should return collection of property definitionS.
     *
     * And vise versa, should return definition of ONE property
     * if isExpanded method returns false (by default).
     *
     * @returns {Object}
     *      Returns definition of the property
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