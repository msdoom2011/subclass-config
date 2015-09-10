/**
 * @class
 * @container
 */
Subclass.Property.ConfigContainer = function()
{
    function ConfigContainer(moduleInstance)
    {
        if (!moduleInstance || !(moduleInstance instanceof Subclass.ModuleInstance)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the module instance', false)
                .expected('an instance of class "Subclass.ModuleInstance"')
                .received(moduleInstance)
                .apply()
            ;
        }

        /**
         * Instance of module
         *
         * @type {Subclass.ModuleInstance}
         * @private
         */
        this._moduleInstance = moduleInstance;

        /**
         * Instance of module definition
         *
         * @type {Subclass.Module}
         * @private
         */
        this._module = moduleInstance.getModule();

        /**
         * Instance of config manager
         *
         * @type {Subclass.Property.ConfigManager}
         * @private
         */
        this._configManager = Subclass.Tools.createClassInstance(Subclass.Property.ConfigManager, this);

        /**
         * Instance of config class containing application configuration
         *
         * @type {Subclass.Class.Type.Config.Config}
         * @private
         */
        this._configs = null;

        /**
         * Indicates whether or not current config container is initialized
         *
         * @type {boolean}
         * @private
         */
        this._initialized = false;
    }

    ConfigContainer.prototype = {

        /**
         * Initializes config container instance
         */
        initialize: function()
        {
            if (this.isInitialized()) {
                Subclass.Error.create('The config container is already initialized!');
            }

            var module = this.getModule().getModule();
            var moduleInstance = this.getModuleInstance();
            var serviceContainer = moduleInstance.getServiceContainer();

            this._configs = this.getConfigManager().createConfigs();

            serviceContainer.setServiceInstance('configs', this._configs);
            serviceContainer.setServiceInstance('config_container', this);
            serviceContainer.setServiceInstance('config_manager', this.getConfigManager());
            serviceContainer.setServiceInstance('property_manager', this.getModule().getPropertyManager());

            module.triggerOnConfig(this.getConfigs(), moduleInstance);
        },

        /**
         * Reports whether or not current config container is initialized
         *
         * @returns {boolean}
         */
        isInitialized: function()
        {
            return this._initialized;
        },

        /**
         * Returns module definition instance
         *
         * @returns {Subclass.Module}
         */
        getModule: function()
        {
            return this._module;
        },

        /**
         * Returns module instance
         *
         * @returns {Subclass.ModuleInstance}
         */
        getModuleInstance: function()
        {
            return this._moduleInstance;
        },

        /**
         * Returns instance of parameter manager
         *
         * @returns {Subclass.ConfigManager}
         */
        getConfigManager: function()
        {
            return this._configManager;
        },

        /**
         * Returns all parameters
         *
         * @returns {Subclass.Class.Type.Config.Config}
         */
        getConfigs: function()
        {
            return this._configs;
        },

        /**
         * Sets config values
         *
         * @param {Object} values
         */
        setConfigs: function(values)
        {
            var configs = this.getConfigs();
            configs.setData(configs);
            configs.setData(this.normalizeConfigs(configs.getData()));
        }
    };

    return ConfigContainer;
}();