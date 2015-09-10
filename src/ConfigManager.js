Subclass.Property.ConfigManager = function()
{
    function ConfigManager(configContainer)
    {
        if (!configContainer || !(configContainer instanceof Subclass.Property.ConfigContainer)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the instance of config container', false)
                .expected('an instance of class "Subclass.Property.ConfigContainer"')
                .received(configContainer)
                .apply()
            ;
        }

        /**
         * Instance of config container
         *
         * @type {Subclass.Property.ConfigContainer}
         * @private
         */
        this._configContainer = configContainer;

        /**
         * Collection of registered module configurators
         *
         * @type {Array.<Subclass.ConfiguratorInterface>}
         * @private
         */
        this._configurators = [];

        /**
         * App configuration tree
         *
         * @type {Object}
         * @private
         */
        this._tree = null;
    }

    ConfigManager.prototype = {

        /**
         * Returns config container instance
         *
         * @returns {Subclass.Property.ConfigContainer}
         */
        getConfigContainer: function()
        {
            return this._configContainer;
        },

        /**
         * Returns instance of subclass module
         *
         * @returns {Subclass.ModuleInstance}
         */
        getModuleInstance: function()
        {
            return this.getConfigContainer().getModuleInstance();
        },

        /**
         * Returns module configuration class if it was created early
         * or creates and register configs class id it wasn't.
         *
         * @returns {Subclass.Class.Type.Config.Config}
         */
        getConfigsClass: function()
        {
            var module = this.getModuleInstance().getModule();

            if (module.issetConfigsClass()) {
                return module.getConfigsClass();
            }
            var configsClass = module.getClassManager().build('Config')
                .setName('ModuleConfig_' + (Math.round(Math.random() * (new Date().valueOf() / 100000))))
                .setBody(this.createTree())
                .setFinal(true)
                .save()
            ;
            module.setConfigsClass(configsClass.getName());

            return configsClass;
        },

        /**
         * Creates configs class
         *
         * @returns {Subclass.Class.Type.Config.Config}
         */
        createConfigs: function()
        {
            var moduleInstance = this.getModuleInstance();
            var container = moduleInstance.getServiceContainer();
            var configurators = container.findByTag('config');


            // Registering configurators

            for (var i = 0; i < configurators.length; i++) {
                configurators[i].setConfigManager(this);
                this.register(configurators[i]);
            }

            // Creating config class instance

            var configs = this.getConfigsClass().createInstance();


            // Setting config data

            var configsData = this.normalizeConfigs(this.getDefaults());
            configs.setData(configsData);
            configs.setDefaults(configsData);


            // Performing configs processing

            for (i = 0; i < configurators.length; i++) {
                var configuratorName = configurators[i].getName();
                var configuratorConfigs = configs.issetProperty(configuratorName)
                    ? configs[configuratorName]
                    : {};

                configurators[i].processConfigs(
                    configuratorConfigs,
                    configs
                );
            }

            return configs;
        },

        /**
         * Normalizes raw configs object
         *
         * @param {object} configs
         */
        normalizeConfigs: function(configs)
        {
            if (Array.isArray(configs)) {
                for (var i = 0; i < configs.length; i++) {
                    configs[i] = this.normalizeConfigs(configs[i]);
                }
            } else if (configs && typeof configs == 'object') {
                for (var propName in configs) {
                    if (configs.hasOwnProperty(propName)) {
                        configs[propName] = this.normalizeConfigs(configs[propName]);
                    }
                }
            } else if (configs && typeof configs == 'string') {
                var moduleInstance = this.getModuleInstance();
                var parserManager = moduleInstance.getParser();
                configs = parserManager.parse(configs);
            }

            return configs;
        },

        /**
         * Returns module configuration option values
         *
         * @returns {Object}
         */
        getDefaults: function()
        {
            return this.getModuleInstance().getModule().getSettingsManager().getConfigs();
        },

        /**
         * Returns collection of registered configurators
         *
         * @returns {Array.<Subclass.ConfiguratorInterface>}
         */
        getConfigurators: function() //privateOnly)
        {
            return this._configurators;
        },

        /**
         * Registers module configurator
         *
         * @param {Subclass.ConfiguratorInterface} configurator
         */
        register: function(configurator)
        {
            if (
                !configurator
                || typeof configurator != 'object'
                || !configurator.isImplements
                || !configurator.isImplements('Subclass/ConfiguratorInterface')
            ) {
                Subclass.Error.create('InvalidArgument')
                    .argument('the instance of configurator', false)
                    .expected('an instance of configurator which implements interface "Subclass/ConfiguratorInterface"')
                    .received(configurator)
                    .apply()
                ;
            }
            if (this.isset(configurator.getName())) {
                Subclass.Error.create(
                    'Trying to add already registered module configurator ' +
                    'named "' + configurator.getName() + '"'
                );
            }
            this._configurators.push(configurator);
        },

        /**
         * Returns configurator by its name
         *
         * @param {string} configuratorName
         */
        get: function(configuratorName)
        {
            if (!this.isset(configuratorName)) {
                Subclass.Error.create(
                    'Trying to get not registered module configurator ' +
                    'named "' + configuratorName + '"'
                );
            }
            var configurators = this.getConfigurators();
            var configuratorIndex = this.find(configuratorName);

            return configurators[configuratorIndex];
        },

        /**
         * Checks whether is set configurator with specified name
         *
         * @param {string} configuratorName
         * @returns {boolean}
         */
        isset: function(configuratorName)
        {
            return this.find(configuratorName) >= 0;
        },

        /**
         * Searches configurator with specified name and
         * returns its position index in configurators collection
         *
         * @param {string} configuratorName
         * @returns {number}
         */
        find: function(configuratorName)
        {
            var configurators = this.getConfigurators();

            for (var i = 0; i < configurators.length; i++) {
                if (configurators[i].getName() == configuratorName) {
                    return i;
                }
            }
            return -1;
        },

        /**
         * Removes configurator by its name
         *
         * @param {string} configuratorName
         */
        remove: function(configuratorName)
        {
            var configurators = this.getConfigurators();
            var configuratorIndex = this.find(configuratorName);

            if (configuratorIndex >= 0) {
                configurators.splice(configuratorIndex, 1);
            }
        },

        /**
         * Returns module configuration tree
         *
         * @returns {Object}
         */
        getTree: function()
        {
            return this._tree;
        },

        /**
         * Creates configuration tree
         *
         * @returns {{}}
         */
        createTree: function()
        {
            if (this._tree !== null) {
                Subclass.Error.create(
                    'Module configuration tree is already created. ' +
                    'So you can\'t do this again.'
                );
            }
            var configurators = this.getConfigurators();
            var tree = {};

            for (var i = 0; i < configurators.length; i++) {
                if (!configurators[i].isPrivate()) {
                    if (configurators[i].isExpanded()) {
                        var configuratorTree = configurators[i].getTree();

                        for (var optName in configuratorTree) {
                            if (configuratorTree.hasOwnProperty(optName)) {
                                tree[optName] = Subclass.Tools.copy(configuratorTree[optName]);
                            }
                        }
                    } else {
                        tree[configurators[i].getName()] = configurators[i].getTree();
                    }
                }
            }

            this._tree = tree;
            this.alterTree();

            return this._tree;
        },

        /**
         * Alters module configuration tree
         */
        alterTree: function()
        {
            var configurators = this.getConfigurators();
            var appTree = this.getTree();

            for (var i = 0; i < configurators.length; i++) {
                var configuratorName = configurators[i].getName();
                var configuratorTree = appTree[configuratorName] || {};

                configurators[i].alterTree(configuratorTree, appTree);
            }
        }
    };

    return ConfigManager;
}();