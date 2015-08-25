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
        this._configs = {};

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
         * Returns instance of subclass module
         *
         * @returns {Subclass.Module}
         */
        getModule: function()
        {
            return this._module;
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
            var configs = module.getClassManager().buildClass('Config', module.getName() + "_ModuleConfig")
                .setBody(this.createTree())
                .save()
                .createInstance()
                .setValues(this._values)
            ;

            this._configs = configs;

            for (var i = 0; i < configurators.length; i++) {
                var configuratorName = configurators[i].getName();
                var configuratorConfigs = configs.hasOwnProperty(configuratorName)
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
                return;
            }
            this._configs.setValues(configs);
        },

        /**
         * Returns module configuration option values
         *
         * @returns {Object}
         */
        getConfigs: function()
        {
            return this._configs;
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
            var configurators = {};
            var $this = this;

            if (privateOnly !== true) {
                privateOnly = false;
            }
            if (privateOnly) {
                return this._configurators;
            }

            moduleStorage.eachModule(function(module) {
                if (module == mainModule) {
                    Subclass.Tools.extend(configurators, $this._configurators);
                    return;
                }
                var moduleConfigManager = module.getConfigManager();
                var moduleConfigurators = moduleConfigManager.getConfigurators();

                Subclass.Tools.extend(configurators, moduleConfigurators);
            });

            return configurators;
        },

        /**
         * Registers module configurator
         *
         * @param {Subclass.ConfiguratorInterface} configurator
         */
        add: function(configurator)
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
                    tree[configurators.getName()] = configurators.getTree();
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