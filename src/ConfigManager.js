Subclass.ConfigManager = function()
{
    function ConfigManager(module)
    {
        if (!module || !(module instanceof Subclass.Module)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the instance of subclass module', false)
                .expected('an instance of class Subclass.Module')
                .received(module)
                .apply()
            ;
        }

        /**
         * Instance of module
         *
         * @type {Subclass.Module}
         * @private
         */
        this._module = module;

        /**
         * Collection of registered module configurators
         *
         * @type {Array.<Subclass.ConfiguratorInterface>}
         * @private
         */
        this._configurators = [];

        /**
         * Module configuration option values
         *
         * @type {{}}
         * @private
         */
        this._values = {};

        /**
         * App configuration
         *
         * @type {Object}
         * @private
         */
        this._configs = null;

        /**
         * App configuration tree
         *
         * @type {Object}
         * @private
         */
        this._tree = null;

        /**
         * Reports whether config manager is initialized
         *
         * @type {boolean}
         * @private
         */
        this._initialized = false;


        // Registering and attaching events

        module.getEventManager()
            .registerEvent('onConfig')
        ;
    }

    ConfigManager.prototype = {

        /**
         * Returns instance of subclass module
         *
         * @returns {Subclass.Module}
         */
        getModule: function()
        {
            return this._module;
        },

        /**
         * Initializes config manager
         */
        initialize: function()
        {
            var module = this.getModule();
            var eventManager = module.getEventManager();
            var $this = this;

            eventManager.getEvent('onLoadingEnd').addListener(function()
            {
                if (module.isRoot()) {
                    var serviceManager = module.getServiceManager();
                    serviceManager.register('config_manager', $this);
                }
            });

            // It should invoke only after services becomes normalized

            eventManager.getEvent('onReadyBefore').addListener(-1000000, function()
            {
                if (module.isRoot()) {
                    var serviceManager = module.getServiceManager();
                    var configurators = serviceManager.getServicesByTag('config');

                    for (var i = 0; i < configurators.length; i++) {
                        var configuratorInst = configurators[i].createInstance();
                        configuratorInst.setConfigManager($this);
                        $this.register(configuratorInst);
                    }
                    $this.createConfigs();
                    $this._initialized = true;
                    eventManager.getEvent('onConfig').trigger($this.getConfigs());

                } else {
                    $this._initialized = true;
                }
            });

            eventManager.getEvent('onAddPlugin').addListener(function(evt, pluginModule)
            {
                var rootModule = pluginModule.getRoot();
                var rootConfigManager = rootModule.getConfigManager();
                var pluginConfigManager = pluginModule.getConfigManager();
                var pluginServiceManager = pluginModule.getServiceManager();
                var pluginEventManager = pluginModule.getEventManager();
                var pluginConfigurators = pluginServiceManager.getServicesByTag('config');

                for (var i = 0; i < pluginConfigurators.length; i++) {
                    var configuratorInst = pluginConfigurators[i].createInstance();

                    if ($this.isset(configuratorInst.getName())) {
                        continue;
                    }
                    configuratorInst.setConfigManager($this);
                    $this.register(configuratorInst);
                }

                var rootConfigs = rootConfigManager.getConfigs();
                var pluginConfigs = pluginConfigManager.getConfigs();

                if (
                    rootConfigs
                    && typeof rootConfigs == 'object'
                    && rootConfigs instanceof Subclass.Class.Type.Config.Config
                ) {
                    rootConfigs = rootConfigs.getData();
                }

                Subclass.Tools.extend(rootConfigs, pluginConfigs);

                rootConfigs._tree = null;
                rootConfigs._values = {};
                rootConfigs._configs = null;
                rootConfigs._initialized = false;

                rootConfigs.setConfigs(rootConfigs);
                rootConfigs.createConfigs();
                rootConfigs._initialized = true;

                pluginConfigManager._initialized = true;
                pluginEventManager.getEvent('onConfig').trigger(pluginConfigManager.getConfigs());
            });
        },

        /**
         * Checks whether config manager is initialized
         *
         * @returns {boolean}
         */
        isInitialized: function()
        {
            return this._initialized;
        },

        /**
         * Creates configs class
         *
         * @returns {Subclass.Class.ClassBuilder}
         */
        createConfigs: function()
        {
            var module = this.getModule();
            var configurators = this.getConfigurators();
            var configs = module.getClassManager().buildClass('Config')
                .setBody(this.createTree())
                .create()
                .createInstance()
            ;

            var configsData = this.normalizeConfigs(this.getConfigs());
            configs.setData(configsData);
            this._configs = configs;

            for (var i = 0; i < configurators.length; i++) {
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
                var parserManager = this.getModule().getParserManager();
                configs = parserManager.parse(configs);
            }

            return configs;
        },

        /**
         * Sets module configuration option values
         *
         * @param {Object} configs
         */
        setConfigs: function(configs)
        {
            if (!configs || typeof configs != 'object') {
                Subclass.Error.create('InvalidArgument')
                    .argument('the module configuration values', false)
                    .expected('a plain object')
                    .received(configs)
                    .apply()
                ;
            }

            if (!this._configs) {
                this._values = configs;

            } else {
                this._configs.setData(configs);
                this._configs.setData(this.normalizeConfigs(this._configs.getData()));
            }
        },

        /**
         * Returns module configuration option values
         *
         * @returns {Object}
         */
        getConfigs: function(privateOnly)
        {
            var mainModule = this.getModule();
            var moduleStorage = mainModule.getModuleStorage();

            if (this.isInitialized() && !mainModule.isRoot()) {
                var rootModule = mainModule.getRoot();
                return rootModule.getConfigManager().getConfigs();

            } else if (this.isInitialized()) {
                return this._configs;
            }

            var configs = {};
            //var configs = this._values;
            var $this = this;

            if (privateOnly !== true) {
                privateOnly = false;
            }
            if (privateOnly) {
                return this._values;
            }

            moduleStorage.eachModule(function(module) {
                if (module == mainModule) {
                    Subclass.Tools.extendDeep(configs, $this._values);
                    return;
                }
                //if (module != mainModule) {
                    var moduleConfigManager = module.getConfigManager();
                    var moduleConfigs = moduleConfigManager.getConfigs();

                    Subclass.Tools.extendDeep(configs, moduleConfigs);
                //}
            });

            //if (mainModule.getName() == 'app') {
            //    console.log(configs);
            //}

            return configs;
        },

        /**
         * Returns collection of registered configurators
         *
         * @returns {Array.<Subclass.ConfiguratorInterface>}
         */
        getConfigurators: function(privateOnly)
        {
            var mainModule = this.getModule();
            var moduleStorage = mainModule.getModuleStorage();
            var configurators = [];
            var $this = this;

            if (privateOnly !== true) {
                privateOnly = false;
            }
            if (privateOnly) {
                return this._configurators;
            }

            moduleStorage.eachModule(function(module) {
                if (module == mainModule) {
                    configurators = configurators.concat($this._configurators);
                    return;
                }
                var moduleConfigManager = module.getConfigManager();
                var moduleConfigurators = moduleConfigManager.getConfigurators();
                configurators = configurators.concat(moduleConfigurators);
            });

            return Subclass.Tools.unique(configurators);
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
                    tree[configurators[i].getName()] = configurators[i].getTree();
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