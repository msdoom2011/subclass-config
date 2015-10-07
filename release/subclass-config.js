/**
 * subclass-config - v0.1.0 - 2015-10-07
 * https://github.com/msdoom2011/subclass-config
 *
 * Copyright (c) 2015 Dmitry Osipishin | msdoom2011@gmail.com
 */
(function() {
"use strict";

/**
 * @namespace
 */
Subclass.Class.Type.Config = {};

/**
 * @class
 * @extends {Subclass.Class.ClassType}
 */
Subclass.Class.Type.Config.Config = function()
{
    /*************************************************/
    /*        Describing class type "Config"          */
    /*************************************************/

    /**
     * @param {Subclass.Class.ClassManager} classManager
     * @param {string} className
     * @param {Object} classDefinition
     * @extends {ClassType}
     * @constructor
     */
    function Config(classManager, className, classDefinition)
    {
        /**
         * List of config classes
         *
         * @type {Config[]}
         * @private
         */
        this._includes = [];

        Config.$parent.apply(this, arguments);
    }

    Config.$parent = Subclass.Class.ClassType;

    /**
     * @inheritDoc
     */
    Config.getClassTypeName = function ()
    {
        return "Config";
    };

    /**
     * @inheritDoc
     */
    Config.getBuilderClass = function()
    {
        return Subclass.Class.Type.Config.ConfigBuilder;
    };

    /**
     * @inheritDoc
     */
    Config.getDefinitionClass = function()
    {
        return Subclass.Class.Type.Config.ConfigDefinition;
    };

    /**
     * @inheritDoc
     */
    Config.prototype.setParent = function(parentClassName)
    {
        if (
            this._parent
            && this._parent.constructor != Config
        ) {
            Subclass.Error.create(
                'The config "' + this.getName() + '" can be ' +
                'inherited only from an another config.'
            );
        }

        Config.$parent.prototype.setParent.apply(this, arguments);
    };

    /**
     * @inheritDoc
     */
    Config.prototype.getConstructorEmpty = function ()
    {
        return function Config() {

            // Hook for the grunt-contrib-uglify plugin
            return Config.name;
        };
    };

    /**
     * Returns all included config classes
     *
     * @returns {Config[]}
     */
    Config.prototype.getIncludes = function()
    {
        return this._includes;
    };

    /**
     * Adds included config class instance
     *
     * @param className
     */
    Config.prototype.addInclude = function(className)
    {
        if (!className || typeof className != "string") {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of including class", false)
                .received(className)
                .expected("a name of existent config class")
                .apply()
            ;
        }
        if (!this.getClassManager().isset(className)) {
            Subclass.Error.create(
                'Trying to include non existent class "' + className + '" ' +
                'to config class "' + this.getName() + '".'
            );
        }
        var classObj = this.getClassManager().get(className);

        this._includes.push(classObj);
    };

    /**
     * Checks if current config class includes specified
     *
     * @param {string} className
     * @returns {boolean}
     */
    Config.prototype.isIncludes = function(className)
    {
        if (!className || typeof className != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of included class", false)
                .received(className)
                .expected("a string")
                .apply()
            ;
        }
        var includes = this.getIncludes();

        for (var i = 0; i < includes.length; i++) {
            if (includes[i].isInstanceOf(className)) {
                return true;
            }
        }
        if (this.hasParent()) {
            var parent = this.getParent();

            if (parent.isIncludes) {
                return parent.isIncludes(className);
            }
        }
        return false;
    };

    /*************************************************/
    /*        Registering the new class type         */
    /*************************************************/

    Subclass.ClassManager.registerType(Config);

    return Config;

}();

// Source file: src/Class/Type/Config/ConfigBuilder.js

/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Config.ConfigBuilder = (function()
{
    function ConfigBuilder(classManager, classType, className)
    {
        ConfigBuilder.$parent.apply(this, arguments);
    }

    ConfigBuilder.$parent = Subclass.Class.ClassBuilder;

    /**
     * Validates includes list argument
     *
     * @param {*} includesList
     * @private
     */
    ConfigBuilder.prototype._validateIncludes = function(includesList)
    {
        try {
            if (!Array.isArray(includesList)) {
                throw "error";
            }
            for (var i = 0; i < includesList.length; i++) {
                this._validateInclude(includesList[i]);
            }
        } catch (e) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of config including class names", false)
                .received(includesList)
                .expected("an array of strings")
                .apply()
            ;
        }
    };

    /**
     * Validates config include
     *
     * @param {*} include
     * @private
     */
    ConfigBuilder.prototype._validateInclude = function(include)
    {
        if (
            typeof include != "string"
            && typeof include != "object"
            && include.getClassTypeName
            && include.getClassTypeName() !== "Config"
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of including config class', false)
                .expected('an instance of config class or a string')
                .received(include)
                .apply()
            ;
        }
    };

    /**
     * Brings includes list to common state
     *
     * @param {Array} includesList
     * @private
     */
    ConfigBuilder.prototype._normalizeIncludes = function(includesList)
    {
        for (var i = 0; i < includesList.length; i++) {
            includesList[i] = this._normalizeInclude(includesList[i]);
        }
    };

    /**
     * Normalizes config include
     *
     * @param {(string|Config)} include
     * @returns {string}
     * @private
     */
    ConfigBuilder.prototype._normalizeInclude = function(include)
    {
        this._validateInclude(include);

        if (typeof include != 'string') {
            return include.getName();
        }
    };

    /**
     * Sets includes list
     *
     * @param {string[]} includesList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.setIncludes = function(includesList)
    {
        this._validateIncludes(includesList);
        this._normalizeIncludes(includesList);
        this.getDefinition().$_includes = includesList;

        return this;
    };

    /**
     * Adds new includes
     *
     * @param {string[]} includesList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addIncludes = function(includesList)
    {
        this._validateIncludes(includesList);

        if (!this.getDefinition().$_includes) {
            this.getDefinition().$_includes = [];
        }
        this.getDefinition().$_includes = this.getDefinition().$_includes.concat(includesList);

        return this;
    };

    /**
     * Adds new include
     *
     * @param {string[]} include
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addInclude = function(include)
    {
        this._validateInclude(include);

        if (!this.getDefinition().$_includes) {
            this.getDefinition().$_includes = [];
        }
        this.getDefinition().$_includes.push(include);

        return this;
    };

    /**
     * Returns includes list
     *
     * @returns {string[]}
     */
    ConfigBuilder.prototype.getIncludes = function()
    {
        return this.getDefinition().$_includes || [];
    };

    /**
     * Makes class either final or not
     *
     * @method setFinal
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of final option
     *
     * @param {boolean} isFinal
     */
    ConfigBuilder.prototype.setFinal = function(isFinal)
    {
        if (typeof isFinal != 'boolean') {
            Subclass.Error.create('InvalidArgument')
                .argument('is final option value', false)
                .expected('a boolean')
                .received(isFinal)
                .apply()
            ;
        }
        this.getDefinition().$_final = isFinal;

        return this;
    };

    /**
     * Returns $_final option value
     *
     * @method getFinal
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @returns {boolean}
     */
    ConfigBuilder.prototype.getFinal = function()
    {
        return this.getDefinition().$_final;
    };

    return ConfigBuilder;

})();

// Source file: src/Class/Type/Config/ConfigDefinition.js

/**
 * @class
 * @extends {Subclass.Class.ClassDefinition}
 */
Subclass.Class.Type.Config.ConfigDefinition = (function()
{
    /**
     * @inheritDoc
     */
    function ConfigDefinition(classInst, classDefinition)
    {
        ConfigDefinition.$parent.apply(this, arguments);

        /**
         * Collection of properties stored in form as they were defined in class definition
         *
         * @type {{}}
         * @private
         */
        this._originProperties = {};
    }

    ConfigDefinition.$parent = Subclass.Class.ClassDefinition;

    /**
     * Sets origin config properties
     *
     * @param {Object} originProperties
     */
    ConfigDefinition.prototype.setOriginProperties = function(originProperties)
    {
        this._originProperties = originProperties;
    };

    /**
     * Returns origin config properties
     *
     * @returns {Object}
     */
    ConfigDefinition.prototype.getOriginProperties = function()
    {
        return this._originProperties;
    };

    /**
     * Validates "$_includes" attribute value
     *
     * @param {*} includes
     * @returns {boolean}
     * @throws {Error}
     */
    ConfigDefinition.prototype.validateIncludes = function(includes)
    {
        try {
            if (includes && !Array.isArray(includes)) {
                throw 'error';
            }
            if (includes) {
                for (var i = 0; i < includes.length; i++) {
                    if (typeof includes[i] != 'string') {
                        throw 'error';
                    }
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidClassOption')
                    .option('$_includes')
                    .className(this.getClass().getName())
                    .received(includes)
                    .expected('an array of strings')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
        return true;
    };

    /**
     * Sets "$_includes" attribute value
     *
     * @param {string[]} includes
     *
     *      List of the classes which properties current one will contain.
     *
     *      Example: [
     *         "Namespace/Of/Config1",
     *         "Namespace/Of/Config2",
     *         ...
     *      ]
     */
    ConfigDefinition.prototype.setIncludes = function(includes)
    {
        this.validateIncludes(includes);
        this.getData().$_includes = includes || [];

        if (includes) {
            for (var i = 0; i < includes.length; i++) {
                this.getClass().addInclude(includes[i]);
            }
        }
    };

    /**
     * Return "$_includes" attribute value
     *
     * @returns {string[]}
     */
    ConfigDefinition.prototype.getIncludes = function()
    {
        return this.getData().$_includes || [];
    };

    /**
     * Validates "$_final" option value
     *
     * @throws {Error}
     * @param {*} isFinal
     * @returns {boolean}
     */
    ConfigDefinition.prototype.validateFinal = function(isFinal)
    {
        if (typeof isFinal != 'boolean') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_final')
                .className(this.getClass().getName())
                .received(isFinal)
                .expected('a boolean')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Sets "$_final" option value
     *
     * @param {boolean} isFinal
     */
    ConfigDefinition.prototype.setFinal = function(isFinal)
    {
        this.validateFinal(isFinal);
        this.getData().$_final = isFinal;
    };

    /**
     * Reports whether current class is final
     *
     * @returns {boolean}
     */
    ConfigDefinition.prototype.getFinal = function()
    {
        var classTypeInst = this.getClass();
        var data = this.getData();

        if (!classTypeInst.hasParent()) {
            return this.getData().$_final;
        }
        if (data.$_final) {
            return true;
        }
        return classTypeInst
            .getParent()
            .getDefinition()
            .getFinal()
        ;
    };

    /**
     * Alias of Subclass.Class.Type.Config.ConfigDefinition#getFinal
     *
     * @alias {Subclass.Class.Type.Config.ConfigDefinition#getFinal}
     * @returns {boolean}
     */
    ConfigDefinition.prototype.isFinal = function()
    {
        return this.getFinal();
    };

    /**
     * @inheritDoc
     */
    ConfigDefinition.prototype.getBaseData = function()
    {
        var classDefinition = ConfigDefinition.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * Reports whether current config class is final
         * and its children can't contain any new or change already
         * existent property definitions
         *
         * @type {boolean}
         */
        classDefinition.$_final = false;

        /**
         * Allows specify a list of config classes which properties
         * will be included into current class definition
         *
         * @type {string[]}
         */
        classDefinition.$_includes = [];

        /**
         * Sets values
         *
         * @param {Object} values
         */
        classDefinition.setData = function(values)
        {
            if (!values || !Subclass.Tools.isPlainObject(values)) {
                Subclass.Error.create('InvalidArgument')
                    .argument("the config class values", false)
                    .received(values)
                    .expected('a plain object')
                    .apply()
                ;
            }
            for (var propName in values) {
                if (values.hasOwnProperty(propName)) {
                    this[propName] = values[propName];
                }
            }
        };

        /**
         * Returns object with all config properties with current values
         *
         * @returns {{}}
         */
        classDefinition.getData = function()
        {
            var properties = this.$_class.getProperties(true);
            var values = {};

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    values[propName] = this.getProperty(propName).getData();
                }
            }
            return values;
        };

        /**
         * Sets class property defaults
         *
         * @param defaults
         * @returns {*}
         */
        classDefinition.setDefaults = function(defaults)
        {
            for (var propName in defaults) {
                if (defaults.hasOwnProperty(propName)) {
                    this.getProperty(propName).setDefaultValue(defaults[propName]);
                }
            }
            return defaults;
        };

        /**
         * Returns default values
         *
         * @returns {Object}
         */
        classDefinition.getDefaults = function()
        {
            var defaults = {};
            var properties = this.$_class.getProperties(true);

            for (var propName in properties) {
                if (properties.hasOwnProperty(propName)) {
                    defaults[propName] = this.getProperty(propName).getDefaultValue();
                }
            }
            return defaults;
        };

        return classDefinition;
    };

    /**
     * Normalizes class definition at initialisation stage
     */
    ConfigDefinition.prototype.normalizeData = function()
    {
        // Retrieving class definition data

        var defaultDefinition = this.getBaseData();
        var dataDefault = this.getData();
        var propName;

        // Retrieving all properties we want to save

        var properties = this.getProperties();
        var systemProperties = {};

        // Removing from definition data all properties that are not definitions of typed properties

        for (propName in defaultDefinition) {
            if (defaultDefinition.hasOwnProperty(propName) && dataDefault.hasOwnProperty(propName)) {
                systemProperties[propName] = dataDefault[propName];
                delete dataDefault[propName];
            }
        }

        // Creating new empty class definition data

        this._data = {};
        var data = this._data;

        if (!properties) {
            properties = {};
        }

        // Filling $_properties parameter by all property definitions from old class definition

        data.$_properties = Subclass.Tools.extend(properties, dataDefault);

        // Storing origin property definitions

        this.setOriginProperties(Subclass.Tools.copy(data.$_properties));

        // Restoring system properties of class definition

        for (propName in systemProperties) {
            if (systemProperties.hasOwnProperty(propName) && propName != "$_properties") {
                var validatorMethodName = Subclass.Tools.generateValidatorName(propName.replace(/^\$_/i, ''));

                if (
                    this[validatorMethodName]
                    && this[validatorMethodName](systemProperties[propName])
                ) {
                    data[propName] = systemProperties[propName];
                }
            }
        }

        // Calling current method from the parent class

        ConfigDefinition.$parent.prototype.normalizeData.call(this);

        // Customising property definitions

        for (propName in data.$_properties) {
            if (data.$_properties.hasOwnProperty(propName)) {
                data.$_properties[propName].accessors = false;
            }
        }
    };

    /**
     * @inheritDoc
     */
    ConfigDefinition.prototype.validateData = function()
    {
        if (!ConfigDefinition.$parent.prototype.validateData.apply(this, arguments)) {
            return false;
        }

        if (this.getExtends()) {
            var parentClassName = this.getExtends();
            var parentClass = this.getClass().getClassManager().get(parentClassName);
            var parentClassDefinition = parentClass.getDefinition();

            // Checking whether the parent class is final and searching
            // for changed definitions of existing properties in current class

            if (parentClassDefinition.isFinal()) {
                var definedProperties = this.getDefinedProperties();
                var newProperties = this.getNewProperties();

                for (var i = 0; i < newProperties.length; i++) {
                    var index = definedProperties.indexOf(newProperties[i]);

                    if (index >= 0) {
                        definedProperties.splice(index, 1);
                    }
                }

                if (definedProperties.length > 0) {
                    Subclass.Error.create(
                        'Trying to change definitions of typed properties ("' + definedProperties.join('", "') + '") ' +
                        'for the config class "' + this.getClass().getName() + '" which extends ' +
                        'the final config class "' + parentClassName + '".'
                    );
                }
            }
        }

        return true;
    };

    /**
     * @inheritDoc
     */
    ConfigDefinition.prototype.validateProperties = function(properties)
    {
        if (this.getExtends()) {
            var parentClassName = this.getExtends();
            var parentClass = this.getClass().getClassManager().get(parentClassName);
            var parentClassDefinition = parentClass.getDefinition();

            // Checking whether the parent class is final and presence
            // of new property definitions in current class

            if (parentClassDefinition.isFinal()) {
                var newClassProperties = this.getNewProperties(properties);

                if (newClassProperties.length > 0) {
                    Subclass.Error.create(
                        'Trying to define new typed properties ("' + newClassProperties.join('", "') + '") ' +
                        'for the config class "' + this.getClass().getName() + '" which extends ' +
                        'the final config class "' + parentClassName + '".'
                    );
                }
            }
        }

        return ConfigDefinition.$parent.prototype.validateProperties.apply(this, arguments);
    };

    /**
     * @inheritDoc
     */
    ConfigDefinition.prototype.getPropertyNormalizers = function()
    {
        var normalizes = ConfigDefinition.$parent.prototype.getPropertyNormalizers.apply(this, arguments);
        var $this = this;

        // Processing included classes

        normalizes.unshift(function(properties) {
            var includes = $this.getIncludes();

            if (!includes) {
                return properties;
            }

            for (var i = 0; i < includes.length; i++) {
                var includeClassName = includes[i];
                var includeClass = $this.getClass().getClassManager().get(includeClassName);
                var includeClassConstructor = includeClass.getConstructor();
                var includeClassProperties = includeClass.getDefinition().getProperties();

                properties = $this.extendProperties(
                    includeClassProperties,
                    properties
                );
            }

            return properties;
        });

        return normalizes;
    };

    ConfigDefinition.prototype.processRelatedClasses = function()
    {
        ConfigDefinition.$parent.prototype.processRelatedClasses.call(this);

        var classManager = this.getClass().getClassManager();
        var includes = this.getIncludes();

        // Performing $_includes (Needs to be defined in ConfigDefinition)

        if (includes && this.validateIncludes(includes)) {
            for (var i = 0; i < includes.length; i++) {
                classManager.load(includes[i]);
            }
        }
    };

    /**
     * Returns the list of new properties of current class which were not defined in its parent.
     * The properties from included classes also fall into current list.
     *
     * @param {Object} [properties]
     * @returns {Object}
     */
    ConfigDefinition.prototype.getNewProperties = function(properties)
    {
        var classPropertyNames = [];

        if (properties) {
            classPropertyNames = Object.keys(properties);

        } else {
            classPropertyNames = Object.keys(this.getOriginProperties());
            var classManager = this.getClass().getClassManager();
            var includes = this.getIncludes();

            for (var i = 0; i < includes.length; i++) {
                var includeClass = classManager.get(includes[i]);
                var includeClassConstructor = includeClass.getConstructor();
                var includeClassProperties = includeClass.getProperties(true);

                classPropertyNames = classPropertyNames.concat(
                    Object.keys(includeClassProperties)
                );
            }
        }

        if (this.getExtends()) {
            var parentClassName = this.getExtends();
            var parentClass = this.getClass().getClassManager().get(parentClassName);
            var parentClassPropertyNames = Object.keys(parentClass.getProperties(true));

            for (i = 0; i < parentClassPropertyNames.length; i++) {
                var index = classPropertyNames.indexOf(parentClassPropertyNames[i]);

                if (index >= 0) {
                    classPropertyNames.splice(index, 1);
                }
            }
        }

        return Subclass.Tools.unique(classPropertyNames);
    };

    /**
     * Returns the list of properties which were specified using
     * normal property declaration but not specifying just a value.
     *
     * The such properties from included classes also fall into
     * current list, but not from parent class.
     *
     * @returns {Object}
     */
    ConfigDefinition.prototype.getDefinedProperties = function()
    {
        var classManager = this.getClass().getClassManager();
        var classProperties = this.getOriginProperties();
        var includes = this.getIncludes();
        var definedProperties = [];

        for (var i = 0; i < includes.length; i++) {
            var includeClass = classManager.get(includes[i]);
            var includeClassDefinition = includeClass.getDefinition();

            definedProperties = definedProperties.concat(
                includeClassDefinition.getDefinedProperties()
            );
            if (includeClass.hasParent()) {
                definedProperties = definedProperties.concat(
                    includeClass.getParent().getDefinition().getDefinedProperties()
                );
            }
        }

        for (var propName in classProperties) {
            if (
                classProperties.hasOwnProperty(propName)
                && typeof classProperties[propName] == 'object'
                && classProperties[propName].hasOwnProperty('type')
            ) {
                definedProperties.push(propName);
            }
        }

        return Subclass.Tools.unique(definedProperties);
    };

    return ConfigDefinition;

})();

// Source file: src/Parser/ConfigParser.js

/**
 * @class
 * @constructor
 */
Subclass.Parser.ConfigParser = function()
{
    function ConfigParser()
    {
        ConfigParser.$parent.apply(this, arguments);
    }

    ConfigParser.$parent = Subclass.Parser.ParserAbstract;

    /**
     * @inheritDoc
     */
    ConfigParser.getName = function()
    {
        return "config";
    };

    ConfigParser.prototype = {

        /**
         * @inheritDoc
         */
        parse: function(string)
        {
            if (typeof string == 'string' && string.match(/\$.+\$/i)) {
                var parserManager = this.getParserManager();
                var moduleInstance = parserManager.getModuleInstance();
                var configContainer = moduleInstance.getConfigContainer();
                var configManager = configContainer.getConfigManager();
                var regExpStr = "\\$([^\\$]+)\\$";
                var regExp = new RegExp(regExpStr, "i");
                var configs = configContainer.getConfigs() || configManager.getDefaults();
                var configName, configValue;

                if (!(new RegExp("^" + regExpStr + "$", "i")).test(string)) {
                    while (regExp.test(string)) {
                        configName = string.match(regExp)[1];
                        configValue = eval("(" + "configs." + configName + ")");
                        string = string.replace(regExp, this.getParserManager().parse(configValue));
                    }
                } else {
                    configName = string.match(regExp)[1];
                    configValue = eval("(" + "configs." + configName + ")");
                    string = this.getParserManager().parse(configValue);
                }
            }
            return string;
        }
    };

    // Registering Parser

    Subclass.Parser.ParserManager.registerParser(ConfigParser);

    return ConfigParser;
}();

// Source file: src/Helper/ConfiguratorAbstract.js

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

// Source file: src/Helper/ConfiguratorInterface.js

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
     * Returns instance of module
     *
     * @returns {Subclass.ModuleInstance}
     */
    getModuleInstance: function() {},

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

// Source file: src/PropertyManager.js

/**
 * @namespace
 */
Subclass.Property = {};

/**
 * @namespace
 */
Subclass.Property.Error = {};

/**
 * @namespace
 */
Subclass.Property.Type = {};

/**
 * @namespace
 */
Subclass.Property.Extension = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.Class = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.AbstractClass = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.Interface = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.Trait = {};

/**
 * @class
 */
Subclass.Property.PropertyManager = (function()
{
    /**
     * Property manager constructor
     *
     * @param {Subclass.Module.Module} module - Instance of module
     * @constructor
     */
    function PropertyManager(module)
    {
        /**
         * Instance of module
         *
         * @type {Subclass.Module.Module}
         * @private
         */
        this._module = module;

        /**
         * @type {(Object.<Object>|{})}
         * @private
         */
        this._typeDefinitions = {};

        /**
         * @type {(Object.<Subclass.Property.PropertyType>|{})}
         * @private
         */
        this._types = {};
    }

    PropertyManager.prototype.initialize = function()
    {
        var module = this.getModule();
        var eventManager = module.getEventManager();
        var $this = this;

        eventManager.getEvent('onLoadingEnd').addListener(function() {
            var typeDefinitions = $this.getTypeDefinitions();

            // Initializing type definitions

            for (var typeName in typeDefinitions) {
                if (!typeDefinitions.hasOwnProperty(typeName)) {
                    continue;
                }
                var typeDefinition = typeDefinitions[typeName];

                $this._types[typeName] = $this.createProperty(
                    typeName,
                    Subclass.Tools.copy(typeDefinition)
                );
            }
        });

        if (module.isRoot()) {
            var propertyTypes = PropertyManager.getPropertyTypes();
            var defaultTypeDefinitions = {};

            for (var typeName in propertyTypes) {
                if (!propertyTypes.hasOwnProperty(typeName)) {
                    continue;
                }

                var defaultPropertyDefinition = propertyTypes[typeName].getEmptyDefinition();

                if (defaultPropertyDefinition) {
                    defaultTypeDefinitions[typeName] = defaultPropertyDefinition;
                }
            }

            this._typeDefinitions = Subclass.Tools.extendDeep(
                defaultTypeDefinitions,
                this._typeDefinitions
            );
        }
    };

    /**
     * Returns subclass module instance
     *
     * @returns {Subclass.Module.Module}
     */
    PropertyManager.prototype.getModule = function()
    {
        return this._module;
    };

    /**
     * Validates data type definitions
     *
     * @param {Object.<Object>} definitions
     * @throws {Error}
     */
    PropertyManager.prototype.validateTypeDefinitions = function(definitions)
    {
        try {
            if (!Subclass.Tools.isPlainObject(definitions)) {
                throw 'error';
            }
            for (var typeName in definitions) {
                if (!definitions.hasOwnProperty(typeName)) {
                    continue;
                }
                if (!Subclass.Tools.isPlainObject(definitions[typeName])) {
                    throw 'error';
                }
            }

        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the data type definitions", false)
                    .received(definitions)
                    .expected('a plain object with another plain objects')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
    };

    /**
     * Adds new type definitions
     *
     * @param {Object.<Object>} definitions
     */
    PropertyManager.prototype.addTypeDefinitions = function(definitions)
    {
        this.validateTypeDefinitions(definitions);

        for (var typeName in definitions) {
            if (definitions.hasOwnProperty(typeName)) {
                this._typeDefinitions[typeName] = definitions[typeName];
            }
        }
    };

    /**
     * Normalizes definition of data type
     *
     * @param definition
     * @param {string} [propertyName]
     * @returns {*}
     */
    PropertyManager.prototype.normalizeTypeDefinition = function(definition, propertyName)
    {
        if (definition === undefined || definition === null) {
            Subclass.Error.create("InvalidArgument")
                .argument('the definition of property' + (propertyName ? ' "' + propertyName + '"' : ''), false)
                .received(definition)
                .expected('not null and not undefined')
                .apply()
            ;
        }
        if (typeof definition == 'string' && this.issetType(definition)) {
            return this.getTypeDefinition(definition);
        }
        if (Array.isArray(definition) && definition.length >= 1) {
            var dataTypeName, dataType;

            if (definition[0] && PropertyManager.issetPropertyType(definition[0])) {
                dataTypeName = definition[0];
                dataType = PropertyManager.getPropertyType(dataTypeName);

                definition = dataType.normalizeDefinition(definition);

            } else if (definition[0] && this.issetType(definition[0])) {
                dataTypeName = definition[0];
                definition = this.getTypeDefinition(dataTypeName);
            }
        }
        return definition;
    };

    /**
     * Returns definitions of custom types
     *
     * @param {boolean} [privateOnly = false]
     *      If passed true it returns type definitions only from current module
     *      without type definitions from its plug-ins
     *
     * @returns {Object}
     */
    PropertyManager.prototype.getTypeDefinitions = function(privateOnly)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var typeDefinitions = {};
        var $this = this;

        if (privateOnly !== true) {
            privateOnly = false;
        }
        if (privateOnly) {
            return this._typeDefinitions;
        }

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(typeDefinitions, $this._typeDefinitions);
                return;
            }
            var modulePropertyManager = module.getPropertyManager();
            var moduleDefinitions = modulePropertyManager.getTypeDefinitions();

            Subclass.Tools.extend(typeDefinitions, moduleDefinitions);
        });

        return typeDefinitions;
    };

    /**
     * Returns definition of data type
     *
     * @param {string} typeName
     * @returns {Object}
     * @throws {Error}
     */
    PropertyManager.prototype.getTypeDefinition = function(typeName)
    {
        if (!this.issetType(typeName)) {
            Subclass.Error.create('Trying to get definition of non existent data type "' + typeName + '".');
        }
        return this.getTypeDefinitions()[typeName];
    };

    /**
     * Returns data types
     *
     * @param {boolean} [privateTypes = false]
     *      If passed true it returns data types only from current module
     *      without data types from its plug-ins
     *
     * @returns {Object}
     */
    PropertyManager.prototype.getTypes = function(privateTypes)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var dataTypes = {};
        var $this = this;

        if (privateTypes !== true) {
            privateTypes = false;
        }
        if (privateTypes) {
            return this._types;
        }

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(dataTypes, $this._types);
                return;
            }
            var modulePropertyManager = module.getPropertyManager();
            var moduleDataTypes = modulePropertyManager.getTypes();

            Subclass.Tools.extend(dataTypes, moduleDataTypes);
        });

        return dataTypes;
    };

    /**
     * Returns data type instance
     *
     * @param {string} typeName
     * @returns {PropertyType}
     */
    PropertyManager.prototype.getType = function(typeName)
    {
        if (!this.issetType(typeName)) {
            Subclass.Error.create('Trying to get definition of non existent data type "' + typeName + '".');
        }
        return this.getTypes()[typeName];
    };

    /**
     * Checks if specified data type exists
     *
     * @param {string} typeName
     * @returns {boolean}
     */
    PropertyManager.prototype.issetType = function(typeName)
    {
        return this.getTypeDefinitions().hasOwnProperty(typeName);
    };

    /**
     * Creates instance of specified type property
     *
     * @param {string} propertyName
     *      A name of the property.
     *
     * @param {Object} propertyDefinition
     *      A plain object which describes property.
     *
     * @param {Subclass.Class.ClassType} [contextClass]
     *      A Subclass.Class.ClassType instance to which creating property will belongs to.
     *
     * @param {Subclass.Property.PropertyType} [contextProperty]
     *      A Subclass.Property.PropertyType instance to witch creating property will belongs to.
     *
     * @returns {Subclass.Property.PropertyType}
     */
    PropertyManager.prototype.createProperty = function(propertyName, propertyDefinition, contextClass, contextProperty)
    {
        if (!Subclass.Tools.isPlainObject(propertyDefinition)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the definition of property "' + propertyName + '"', false)
                .received(propertyDefinition)
                .expected('a plain object with mandatory property "type"')
                .apply()
            ;
        }
        var propertyTypeName = propertyDefinition.type;

        if (this.issetType(propertyTypeName)) {
            var dataTypeDefinition = Subclass.Tools.copy(this.getTypeDefinition(propertyTypeName));
            propertyTypeName = dataTypeDefinition.type;

            propertyDefinition = Subclass.Tools.extendDeep(dataTypeDefinition, propertyDefinition);
            propertyDefinition.type = propertyTypeName;
        }

        if (!PropertyManager.issetPropertyType(propertyTypeName)) {
            var propertyFullName = (contextProperty && contextProperty.getNameFull() + "." || '') + propertyName;

            Subclass.Error.create(
                'Trying to create property "' + propertyFullName + '" of none existent type "' + propertyTypeName + '"' +
                (contextClass && ' in class "' + contextClass.getName() + '"') + '.'
            );
        }

        var classConstructor = PropertyManager.getPropertyType(propertyDefinition.type);
        var inst = Subclass.Tools.createClassInstance(classConstructor, this, propertyName, propertyDefinition);

        // Setting context class and property

        inst.setContextClass(contextClass || null);
        inst.setContextProperty(contextProperty || null);

        // Checking if property name allowed

        if (!contextProperty && !Subclass.Property.PropertyManager.isPropertyNameAllowed(propertyName)) {
            Subclass.Error.create(
                'Trying to define property with not allowed name "' + propertyName + '"' +
                (contextClass && ' in class "' + contextClass.getName() + '"' || "") +  "."
            );
        }

        inst.initialize();

        return inst;
    };


    //================================ PUBLIC API ==================================

    /**
     * A collection of registered property types
     *
     * @type {Object.<Function>}
     * @private
     */
    PropertyManager._propertyTypes = {};

    /**
     * A collection of non allowed property names
     *
     * @type {Array}
     * @private
     */
    PropertyManager._notAllowedPropertyNames = [];

    /**
     * Registering new property type
     *
     * @param {Function} propertyTypeConstructor
     */
    PropertyManager.registerPropertyType = function(propertyTypeConstructor)
    {
        var propertyTypeName = propertyTypeConstructor.getName();

        this._propertyTypes[propertyTypeName] = Subclass.Tools.buildClassConstructor(propertyTypeConstructor);
    };

    /**
     * Returns property type constructor
     *
     * @param {string} propertyTypeName
     * @returns {Function}
     */
    PropertyManager.getPropertyType = function(propertyTypeName)
    {
        if (!this.issetPropertyType(propertyTypeName)) {
            Subclass.Error.create(
                'Trying to get non existed data type ' +
                'factory "' + propertyTypeName + '".'
            );
        }
        return this._propertyTypes[propertyTypeName];
    };

    /**
     * Returns all registered property types
     *
     * @returns {Object.<Function>}
     */
    PropertyManager.getPropertyTypes = function()
    {
        return this._propertyTypes;
    };

    /**
     * Checks if needed property type was ever registered
     *
     * @param {string} propertyTypeName
     * @returns {boolean}
     */
    PropertyManager.issetPropertyType = function(propertyTypeName)
    {
        return this._propertyTypes.hasOwnProperty(propertyTypeName);
    };

    /**
     * Registers new not allowed class property name
     *
     * @param {Array} propertyNames
     */
    PropertyManager.registerNotAllowedPropertyNames = function(propertyNames)
    {
        try {
            if (!Array.isArray(propertyNames)) {
                throw "error";
            }
            for (var i = 0; i < propertyNames.length; i++) {
                if (this._notAllowedPropertyNames.indexOf(propertyNames[i]) < 0) {
                    if (typeof propertyNames[i] != "string") {
                        throw "error";
                    }
                    this._notAllowedPropertyNames.push(propertyNames[i]);
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the not allowed names of property", false)
                    .received(propertyNames)
                    .expected("an array of strings")
                    .apply()
                ;
            } else {
                throw e;
            }
        }
    };

    /**
     * Returns not allowed property names
     *
     * @returns {string[]}
     */
    PropertyManager.getNotAllowedPropertyNames = function()
    {
        return this._notAllowedPropertyNames;
    };

    /**
     * Checks if specified class property name is allowed
     *
     * @param propertyName
     * @returns {boolean}
     */
    PropertyManager.isPropertyNameAllowed = function(propertyName)
    {
        if (propertyName.match(/[^\$a-z0-9_]/i)) {
            return false;
        }
        for (var i = 0; i < this._notAllowedPropertyNames.length; i++) {
            var regExp = new RegExp("^_*" + this._notAllowedPropertyNames[i] + "_*$", 'i');

            if (regExp.test(propertyName)) {
                return false;
            }
        }
        return true;
    };

    return PropertyManager;

})();

// Source file: src/PropertyType.js

/**
 * @class
 */
Subclass.Property.PropertyType = (function()
{
    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} definitionData
     * @constructor
     */
    function PropertyType(propertyManager, propertyName, definitionData)
    {
        if (!propertyManager || !(propertyManager instanceof Subclass.Property.PropertyManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the property manager instance', false)
                .expected('an instance of "Subclass.Property.PropertyManager" class')
                .received(propertyManager)
                .apply()
            ;
        }
        if (!propertyName || typeof propertyName != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of property", false)
                .received(definitionData)
                .expected('a string')
                .apply()
            ;
        }
        if (!definitionData || typeof definitionData != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of property", false)
                .received(definitionData)
                .expected('a plain object')
                .apply()
            ;
        }

        /**
         * An instance of property manager
         *
         * @type {Subclass.Property.PropertyManager}
         * @private
         */
        this._propertyManager = propertyManager;

        /**
         * The name of current data type definition
         *
         * @type {string}
         * @private
         */
        this._name = propertyName;

        /**
         * The plain object with definition data
         *
         * @type {Object}
         * @private
         */
        this._data = definitionData;

        /**
         * The class to which current property belongs
         *
         * @type {(Subclass.Class.ClassType|null)}
         * @private
         */
        this._contextClass = null;

        /**
         * The property to which current one belongs
         *
         * @type {(Subclass.Property.PropertyType|null)}
         * @private
         */
        this._contextProperty = null;
    }

    PropertyType.$parent = null;

    /**
     * Returns name of current property type
     *
     * @static
     * @returns {string}
     */
    PropertyType.getName = function()
    {
        Subclass.Error.create('NotImplementedMethod')
            .method("getPropertyTypeName")
            .className(this.name)
            .apply()
        ;
    };

    /**
     * Returns class constructor of property
     *
     * @returns {Function}
     */
    PropertyType.getPropertyClass = function()
    {
        return Subclass.Property.Property;
    };

    /**
     * Parses passed property definition and returns required classes to load
     *
     * @param {Object} propertyDefinition
     */
    PropertyType.parseRelatedClasses = function(propertyDefinition)
    {
        // Do something
    };

    /**
     * Returns the empty definition of property
     *
     * @returns {(Object|boolean)}
     */
    PropertyType.getEmptyDefinition = function()
    {
        return {
            type: this.getName()
        };
    };

    /**
     * Normalizes definition of data type
     *
     * @param {Object} definition
     * @returns {Object}
     */
    PropertyType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 4) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.default = definition[1];

                if (definition[1] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 3) {
                fullDefinition.writable = definition[2];
            }
            if (definition.length == 4) {
                fullDefinition.nullable = definition[3];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * Initializing property instance
     */
    PropertyType.prototype.initialize = function()
    {
        this.validateData();
        this.processData();
    };

    /**
     * Returns the name of data type
     *
     * @returns {*}
     */
    PropertyType.prototype.getType = function()
    {
        return this.constructor.getName();
    };

    /**
     * Returns property manager instance
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    PropertyType.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * Returns the name of property
     *
     * @returns {string}
     */
    PropertyType.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns property name with names of context property
     *
     * @returns {string}
     */
    PropertyType.prototype.getNameFull = function()
    {
        var propertyName = this.getName();
        var contextProperty = this.getContextProperty();
        var contextPropertyName = "";

        if (contextProperty) {
            contextPropertyName = contextProperty.getNameFull();
        }
        return (contextPropertyName && contextPropertyName + "." || "") + propertyName;
    };

    /**
     * Returns property definition
     *
     * @returns {Object}
     */
    PropertyType.prototype.getData = function()
    {
        return this._data;
    };

    /**
     * Sets the context class
     *
     * @param {Subclass.Class.ClassType} contextClass
     */
    PropertyType.prototype.setContextClass = function(contextClass)
    {
        this._contextClass = contextClass;
    };

    /**
     * Returns the context class
     *
     * @returns {(Subclass.Class.ClassType|null)}
     */
    PropertyType.prototype.getContextClass = function()
    {
        return this._contextClass;
    };

    /**
     * Sets the context property
     *
     * @param {Subclass.Property.PropertyType} contextProperty
     */
    PropertyType.prototype.setContextProperty = function(contextProperty)
    {
        this._contextProperty = contextProperty;
    };

    /**
     * Returns the context property
     *
     * @returns {(Subclass.Property.PropertyType|null)}
     */
    PropertyType.prototype.getContextProperty = function()
    {
        return this._contextProperty;
    };

    /**
     * Creates the instance of property
     *
     * @param {string} propertyName
     */
    PropertyType.prototype.createInstance = function(propertyName)
    {
        var constructor = this.constructor.getPropertyClass();

        return Subclass.Tools.createClassInstance(
            constructor,    // class constructor function
            propertyName,   // the name of creating property
            this            // the definition of creating property
        );
    };

    /**
     * Generates property getter function
     *
     * @returns {Function}
     */
    PropertyType.prototype.generateGetter = function(propertyName)
    {
        return function () {
            return this.getProperty(propertyName).getValue();
        };
    };

    /**
     * Generates setter for specified property
     * @TODO Implement delegation invoking watchers from children to its context properties (ancestors)
     *
     * @param {string} propName
     *      The name of property for which you want to create setter
     *
     * @returns {function}
     */
    PropertyType.prototype.generateSetter = function(propName)
    {
        if (!this.isWritable()) {
            return function() {
                Subclass.Error.create('Property ' + this.getProperty(propName) + ' is not writable.');
            }
        }
        return function(value) {
            this.getProperty(propName).setValue(value);
        };
    };

    /**
     * Attaches property to specified context
     */
    PropertyType.prototype.attach = function(context, propName)
    {
        if (Object.isSealed(context)) {
            Subclass.Error.create(
                'Can\'t attach property ' + this + ' because ' +
                'the context object is sealed.'
            );
        }
        if (this.isAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(propName);

            if (context.hasOwnProperty(getterName) && typeof context[getterName] == 'function') {
                getterName += 'Default';
            }
            context[getterName] = this.generateGetter(propName);

            if (this.isWritable()) {
                var setterName = Subclass.Tools.generateSetterName(propName);

                if (context.hasOwnProperty(setterName) && typeof context[setterName] == 'function') {
                    setterName += 'Default';
                }
                context[setterName] = this.generateSetter(propName);
            }
        } else {
            Object.defineProperty(context, propName, {
                configurable: true,
                enumerable: true,
                get: this.generateGetter(propName),
                set: this.generateSetter(propName)
            });
        }
    };

    /**
     * Detaches property from class instance
     */
    PropertyType.prototype.detach = function(context, propName)
    {
        if (Object.isSealed(context)) {
            var property = context.getProperty(propName);

            Subclass.Error.create(
                'Can\'t detach property ' + property + ' because ' +
                'the context object is sealed.'
            );
        }
        delete context[propName];
    };

    /**
     * Validates "value" attribute value
     *
     * @param {*} value
     */
    PropertyType.prototype.validateValue = function(value)
    {
        if (value === null && !this.isNullable()) {
            Subclass.Error.create('The property ' + this + ' is not nullable.');
        }
    };

    /**
     * Sets the property value
     */
    PropertyType.prototype.setValue = function(value)
    {
        this.validateValue(value);
        this.getData().value = value;
    };

    /**
     * Returns property value
     *
     * @returns {*}
     */
    PropertyType.prototype.getValue = function()
    {
        return this.getData().value;
    };

    /**
     * Returns empty property value
     *
     * @return {(null|*)}
     */
    PropertyType.prototype.getEmptyValue = function()
    {
        return this.isNullable() && this.getDefault() == undefined
            ? null
            : this.getDefault()
        ;
    };

    /**
     * Checks if property contains empty value
     *
     * @returns {boolean}
     */
    PropertyType.prototype.isValueEmpty = function(value)
    {
        var emptyValue = this.getEmptyValue();
        return Subclass.Tools.isEqual(emptyValue, value);
    };

    /**
     * Validates "default" attribute value
     *
     * @alias Subclass.Property.PropertyDefinition#validateValue
     */
    PropertyType.prototype.validateDefault = PropertyType.prototype.validateValue;

    /**
     * Sets property default value
     */
    PropertyType.prototype.setDefault = function(value)
    {
        this.validateDefault(value);
        this.getData().default = value;
    };

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    PropertyType.prototype.getDefault = function()
    {
        return this.getData().default;
    };

    PropertyType.prototype.validateDefaultless = function(value)
    {
        if (typeof value !== 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('defaultless')
                .property(this)
                .received(value)
                .expected('a boolean')
                .apply()
            ;
        }
    };

    /**
     * Sets the "defaultless" property option
     *
     * @param {boolean} value
     */
    PropertyType.prototype.setDefaultless = function(value)
    {
        this.validateDefaultless(value);
        this.getData().defaultless = value;
    };

    /**
     * Returns the "defaultless" property option value
     *
     * @returns {*}
     */
    PropertyType.prototype.getDefaultless = function()
    {
        return this.getData().defaultless;
    };

    /**
     * @alias Subclass.Property.PropertyType#getDefaultless
     */
    PropertyType.prototype.isDefaultless = function()
    {
        return this.getDefaultless();
    };

    /**
     * Validates "watcher" attribute value
     *
     * @param {*} watcher
     */
    PropertyType.prototype.validateWatcher = function(watcher)
    {
        if (watcher !== null && typeof watcher != 'function') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('watcher')
                .property(this)
                .received(watcher)
                .expected('a funciton or null')
                .apply()
            ;
        }
    };

    /**
     * Sets property watcher
     *
     * @param {(Function|null)} watcher
     */
    PropertyType.prototype.setWatcher = function(watcher)
    {
        this.validateWatcher(watcher);
        this.getData().watcher = watcher;
    };

    /**
     * Returns watcher function or null
     *
     * @returns {(Function|null)}
     */
    PropertyType.prototype.getWatcher = function()
    {
        return this.getData().watcher;
    };

    /**
     * Validates "accessors" attribute value
     *
     * @param {*} isAccessors
     */
    PropertyType.prototype.validateAccessors = function(isAccessors)
    {
        if (typeof isAccessors != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('accessors')
                .received(isAccessors)
                .property(this)
                .expected('a boolean')
                .apply()
            ;
        }
    };

    /**
     * Sets marker if needs to generate accessor methods for current property
     *
     * @param {boolean} isAccessors
     */
    PropertyType.prototype.setAccessors = function(isAccessors)
    {
        this.validateAccessors(isAccessors);
        this.getData().accessors = isAccessors;
    };

    /**
     * Checks if there is a need in generation of property accessor methods
     *
     * @returns {boolean}
     */
    PropertyType.prototype.getAccessors = function()
    {
        return this.getData().accessors;
    };

    PropertyType.prototype.isAccessors = PropertyType.prototype.getAccessors;

    /**
     * Validates "writable" attribute value
     *
     * @param {*} isWritable
     */
    PropertyType.prototype.validateWritable = function(isWritable)
    {
        if (typeof isWritable != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('writable')
                .received(isWritable)
                .property(this)
                .expected('a boolean')
                .apply()
            ;
        }
    };

    /**
     * Set marker if current property is writable
     *
     * @param {boolean} isWritable
     */
    PropertyType.prototype.setWritable = function(isWritable)
    {
        this.validateWritable(isWritable);
        this.getData().writable = isWritable;
    };

    /**
     * Checks if current property is writable
     *
     * @returns {boolean}
     */
    PropertyType.prototype.getWritable = function()
    {
        return this.getData().writable;
    };

    /**
     * @alias Subclass.Property.PropertyDefinition
     */
    PropertyType.prototype.isWritable = function()
    {
        return this.getWritable();
    };

    /**
     * Validates "nullable" attribute value
     *
     * @param {*} isNullable
     */
    PropertyType.prototype.validateNullable = function(isNullable)
    {
        if (typeof isNullable != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('nullable')
                .received(isNullable)
                .property(this)
                .expected('a boolean')
                .apply()
            ;
        }
    };

    /**
     * Sets "nullable" attribute value
     *
     * @param {(boolean|null)} isNullable
     */
    PropertyType.prototype.setNullable = function(isNullable)
    {
        this.validateNullable(isNullable);
        this.getData().nullable = isNullable;
    };

    /**
     * Checks if current property can store null value
     *
     * @returns {boolean}
     */
    PropertyType.prototype.isNullable = function()
    {
        return this.getData().nullable;
    };

    /**
     * Validates "extends" attribute value
     *
     * @param {*} isExtends
     */
    PropertyType.prototype.validateExtends = function(isExtends)
    {
        if (typeof isExtends != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('extends')
                .received(isExtends)
                .property(this)
                .expected('a boolean')
                .apply()
            ;
        }
    };

    /**
     * Set marker if current property extends property
     * with the same name from the parent class
     *
     * @param {boolean} isExtends
     */
    PropertyType.prototype.setExtends = function(isExtends)
    {
        this.validateExtends(isExtends);
        this.getData().extends = isExtends;
    };

    /**
     * Checks if current property extends property
     * with the same name from the parent class
     *
     * @returns {boolean}
     */
    PropertyType.prototype.getExtends = function()
    {
        return this.getData().extends;
    };

    /**
     * @alias {Subclass.Property.PropertyDefinition#getExtends}
     */
    PropertyType.prototype.isExtends = function()
    {
        return this.getExtends();
    };

    /**
     * Returns attributes that are required to filling
     *
     * @returns {string[]}
     */
    PropertyType.prototype.getRequiredOptions = function()
    {
        return ["type"];
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    PropertyType.prototype.getBaseData = function()
    {
        return {

            /**
             * Type of property data
             *
             * @type {string}
             */
            type: this.constructor.getName(),

            /**
             * Reports whether the default value will be ignored by default
             *
             * If its true and the current property is nullable
             * the default value will be null too.
             *
             * @type {boolean}
             */
            defaultless: false,

            /**
             * Default value of property
             *
             * @type {(*|undefined)}
             */
            default: undefined,

            /**
             * Value of property
             *
             * @type {(*|undefined)}
             */
            value: undefined,

            /**
             * It's true if current parameter is changeable and vice-versa
             *
             * @type {boolean}
             */
            writable: true,

            /**
             * Callback that triggers when trying to set property value.
             *
             * It takes three arguments:
             * - the new value;
             * - the old value of property;
             * - the current property object instance
             *
             * Pay attention, that you may access current property context
             * directly in watcher function (it may be the class instance
             * or the map type property etc.) where this one is defined
             * using by "this" property.
             *
             * @type {(function|null)}
             */
            watcher: null,

            /**
             * Indicates that accessor functions would be generated
             *
             * @type {(boolean|null)}
             */
            accessors: true,

            /**
             * Indicates that current property can hold null value or not.
             *
             * If null as a value of current parameter was specified it means
             * that value of current parameter will defined in accordance with
             * the default settings of each property type.
             *
             * @type {(boolean|null)}
             */
            nullable: true,

            /**
             * Influences on behaviour of property definition when the class
             * to which it belongs, extends another class which contains
             * property with the same name.
             *
             * If it's true the property definition in child class should
             * extend the property with the same name in parent class.
             * Otherwise the the definition in child should replace definition
             * of the same property in parent class by the new definition.
             *
             * @type {boolean}
             */
            extends: false
        };
    };

    /**
     * Validating property definition
     */
    PropertyType.prototype.validateData = function()
    {
        var requiredOptions = this.getRequiredOptions();
        var definition = this.getData();

        for (var i = 0; i < requiredOptions.length; i++) {
            var optName = requiredOptions[i];

            if (!definition.hasOwnProperty(optName)) {
                Subclass.Error.create(
                    'Missed required option "' + optName + '" ' +
                    'in definition of the property ' + this + '.'
                );
            }
        }
        if (this.getWritable() === false && this.getValue() !== undefined) {
            console.warn(
                'Specified "value" option for definition of not writable ' +
                'property ' + this + '.\n The value in "value" option ' +
                'was ignored.\n The value from "default" option was applied instead.'
            );
        }
    };

    /**
     * Processing property definition
     */
    PropertyType.prototype.processData = function()
    {
        var definition = Subclass.Tools.copy(this.getData());
        var emptyDefaultValue = !definition.hasOwnProperty('default');

        this._data = this.getBaseData();

        if (emptyDefaultValue && this.getDefault() !== undefined) {
            definition.default = this.getDefault();
            emptyDefaultValue = false;
        }

        for (var attrName in definition) {
            if (
                !definition.hasOwnProperty(attrName)
                || attrName == 'default'
                || attrName == 'value'
            ) {
                continue;
            }
            var setterMethod = "set" + attrName[0].toUpperCase() + attrName.substr(1);

            if (this[setterMethod]) {
                this[setterMethod](definition[attrName]);
            }
        }

        // Setting default value

        if (this.isNullable() && this.isDefaultless()) {
            emptyDefaultValue = false;
            definition.default = null;
        }

        if (emptyDefaultValue) {
            try {
                this.setDefault(this.getEmptyValue());

            } catch (e) {
                console.error(
                    'The default value was not specified for property ' + this + '. \n' +
                    'The standard default value "' + this.getEmptyValue() + '" was used but it is not relevant. \n' +
                    'You should specify appropriate default value or mark this property as nullable.'
                );
                Subclass.Error.create(e.message);
            }
        } else {
            this.setDefault(definition.default);
        }

        // Setting value

        if (definition.hasOwnProperty('value')) {
            this.setValue(definition.value);
        }
    };

    /**
     * Return string implementation of property
     *
     * @returns {string}
     */
    PropertyType.prototype.toString = function()
    {
        var propertyName = this.getNameFull();
        var contextClassName = this.getContextClass()
            ? (' in the class "' + this.getContextClass().getName() + '"')
            : "";

        return 'definition "' + propertyName + '"' + contextClassName;
    };

    return PropertyType;

})();

// Source file: src/Property.js

Subclass.Property.Property = function()
{
    function Property(name, definition)
    {
        if (!name || typeof name != 'string') {
            Subclass.Error.create('InvalidError')
                .argument('the name of property', false)
                .expected('a string')
                .received(name)
                .apply()
            ;
        }
        if (!definition || !(definition instanceof Subclass.Property.PropertyType)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the property definition', false)
                .expected('an instance of "Subclass.Property.PropertyType" class')
                .received(definition)
                .apply()
            ;
        }

        /**
         * The name of property
         *
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * The data type definition
         *
         * @type {Subclass.Property.PropertyType}
         * @private
         */
        this._definition = definition;

        /**
         * The property context object
         *
         * @type {Object}
         * @private
         */
        this._context = null;

        /**
         * A set of callbacks which will invoked when property changes its value
         *
         * @type {Function[]}
         * @private
         */
        this._watchers = [];

        /**
         * Checks if current value was ever modified (was set any value)
         *
         * @type {boolean}
         * @private
         */
        this._isModified = false;

        /**
         * Reports that current property is temporary locked for the write operation
         *
         * @type {boolean}
         * @private
         */
        this._isLocked = false;

        /**
         * The value of the property
         *
         * @type {undefined}
         * @private
         */
        this._value = undefined;
    }

    /**
     * Sets the property name
     *
     * @param {string} name
     */
    Property.prototype.setName = function(name)
    {
        this._name = name;
    };

    /**
     * Returns name of property
     *
     * @returns {string}
     */
    Property.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns the name of properties type
     *
     * @returns {string}
     */
    Property.prototype.getType = function()
    {
        return this.getDefinition().constructor.getName();
    };

    /**
     * Returns property name with names of context property
     *
     * @returns {string}
     */
    Property.prototype.getNameFull = function()
    {
        var propertyName = this.getName();
        var context = this.getContext();
        var parentName = "";

        if (context.getContextType() == 'property') {
            parentName = context.getProperty().getNameFull();
        }
        return (parentName && parentName + "." || "") + propertyName;
    };

    /**
     * Renames current property
     *
     * @param {string} newName
     */
    Property.prototype.rename = function(newName)
    {
        var context = this.getContext();
        var isAttached = this.isAttached();

        if (!newName || typeof newName != 'string') {
            Subclass.Error.create(
                'Specified invalid new value argument while was called method rename in property ' + this + '. ' +
                'It must be a string.'
            );
        }
        if (isAttached && Object.isSealed(context)) {
            Subclass.Error.create(
                'Can\'t rename property ' + this + '. ' +
                'The context object is sealed.'
            );
        }
        var definition = this.getDefinition();
        var value = this.getData();

        if (definition.isAccessors()) {
            Subclass.Error.create('Can\'t rename property ' + this + ' because it uses accessor functions.');
        }

        if (isAttached) {
            definition.detach(context, this._name);
            definition.attach(context, newName);
        }

        this._name = newName;
        this.setValue(value);
    };

    /**
     * Returns property definition
     *
     * @returns {Subclass.Property.PropertyType}
     */
    Property.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Validates property context object
     *
     * @throws {Error}
     *      Throws error if specified invalid property context object
     *
     * @returns {Object} context object
     */
    Property.prototype.validateContext = function(context)
    {
        var requiredMethods = [
            'getProperty',
            'issetProperty',
            'getContextType'
        ];

        for (var i = 0; i < requiredMethods.length; i++) {
            if (
                !context
                || typeof context !== 'object'
                || typeof context[requiredMethods[i]] != 'function'
            ) {
                Subclass.Error.create(
                    'Trying to attach typed property ' + this + ' to invalid context object. ' +
                    'The valid context object should implement methods: "' + requiredMethods.join('", "') + "."
                );
            }
        }
        return context;
    };

    /**
     * Sets the property context object
     *
     * @param context
     */
    Property.prototype.setContext = function(context)
    {
        this.validateContext(context);
        this._context = context;
    };

    /**
     * Returns property context object
     *
     * @returns {(Object|null)}
     */
    Property.prototype.getContext = function()
    {
        return this._context;
    };

    /**
     * Marks that current property was modified
     */
    Property.prototype.modify = function()
    {
        var context = this.getContext();
        var contextType = context.getContextType();

        if (contextType == 'property') {
            var parentProperty = context.getProperty();
            parentProperty.modify();
        }
        this._isModified = true;
    };

    /**
     * Marks that current property was not modified
     */
    Property.prototype.unModify = function()
    {
        this._isModified = false;
    };

    /**
     * Checks if current property value was ever modified
     *
     * @returns {boolean}
     */
    Property.prototype.isModified = function()
    {
        return this._isModified;
    };

    /**
     * Makes current property locked
     */
    Property.prototype.lock = function()
    {
        this._isLocked = true;
    };

    /**
     * Makes current property unlocked
     */
    Property.prototype.unlock = function()
    {
        this._isLocked = false;
    };

    /**
     * Reports whether current property is locked
     *
     * @returns {boolean}
     */
    Property.prototype.isLocked = function()
    {
        if (this._isLocked) {
            return true;
        }
        var context = this.getContext();

        if (context && context.getContextType() == 'property') {
            var parentProperty = context.getProperty();
            return parentProperty.isLocked() || false;

        } else {
            return false;
        }
    };

    /**
     * Returns all registered watchers
     *
     * @returns {Function[]}
     */
    Property.prototype.getWatchers = function()
    {
        var watcher = this.getDefinition().getWatcher();
        var watchers = [];

        if (watcher) {
            watchers.push(watcher);
        }
        return Subclass.Tools.extend(watchers, this._watchers);
    };

    /**
     * Adds new watcher
     *
     * @param {Function} callback Function, that takes two arguments:
     *      - newValue {*} New property value
     *      - oldValue {*} Old property value
     *
     *      "this" variable inside callback function will link to the class instance to which property belongs to
     *      This callback function MUST return newValue value.
     *      So you can modify it if you need.
     */
    Property.prototype.addWatcher = function(callback)
    {
        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected("a function")
                .apply()
            ;
        }
        if (!this.issetWatcher(callback)) {
            this._watchers.push(callback);
        }
    };

    /**
     * Checks if specified watcher callback is registered
     *
     * @param {Function} callback
     * @returns {boolean}
     */
    Property.prototype.issetWatcher = function(callback)
    {
        if (this.getDefinition().getWatcher() == callback) {
            return true;
        }
        return this._watchers.indexOf(callback) >= 0;
    };

    /**
     * Removes specified watcher callback
     *
     * @param {Function} callback
     */
    Property.prototype.removeWatcher = function(callback)
    {
        var watcherIndex;

        if ((watcherIndex = this._watchers.indexOf(callback)) >= 0) {
            this._watchers.splice(watcherIndex, 1);
        }
        if (this.getDefinition().getWatcher() == callback) {
            this.getDefinition().setWatcher(null);
        }
    };

    /**
     * Unbind all watchers from current property
     */
    Property.prototype.removeWatchers = function()
    {
        this.getDefinition().setWatcher(null);
        this._watchers = [];
    };

    /**
     * Invokes all registered watcher functions
     *
     * @param {Subclass.Property.WatcherEvent} event
     */
    Property.prototype.invokeWatchers = function(event)
    {
        var watchers = this.getWatchers();
        var context = this.getContext();

        if (typeof context != "object" || Array.isArray(context)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the context object", false)
                .received(context)
                .expected("an object")
                .apply()
            ;
        }
        for (var i = 0; i < watchers.length; i++) {
            watchers[i].call(context, event);
        }
    };

    Property.prototype._createWatcherEvent = function(newValue, oldValue)
    {
        return Subclass.Tools.createClassInstance(
            Subclass.Property.WatcherEvent,
            this,
            newValue,
            oldValue
        );
    };

    /**
     * Returns new and old values of parent context properties
     *
     * @param {Subclass.Property.Property} property
     * @param {*} newValue
     * @returns {Array.<{"property": {Subclass.Property.Property}, "newValue": {*}, "oldValue": {*}}>}
     * @protected
     */

    Property.prototype._getParentWatcherValues = function(property, newValue)
    {
        var context = property.getContext();
        var parents = [];

        if (arguments[2]) {
            parents = arguments[2];
        }
        if (context && context.getContextType && context.getContextType() == 'property') {
            var parent = property.getContext().getProperty();
            var parentOldValue = parent.getData();
            var parentNewValue = Subclass.Tools.copy(parentOldValue);

            parentNewValue[property.getName()] = newValue;

            parents.push({
                property: parent,
                newValue: parentNewValue,
                oldValue: parentOldValue
            });

            this._getParentWatcherValues(
                parent,
                parentNewValue,
                parents
            );
        }

        return parents;
    };

    /**
     * Invokes all parent property watchers specified in "parents" argument
     *
     * @param {Subclass.Property.WatcherEvent} event
     * @param {Array.<{"property": {Subclass.Property.Property}, "newValue": {*}, "oldValue": {*}}>} parents
     * @private
     */
    Property.prototype._invokeParentWatchers = function(event, parents)
    {
        for (var i = 0; i < parents.length; i++) {
            if (event.isPropagationStopped()) {
                break;
            }
            var parentValues = parents[i];
            event.setProperty(parentValues.property);
            event.setNewValue(parentValues.newValue);
            event.setOldValue(parentValues.oldValue);
            parentValues.property.invokeWatchers(event);
        }
    };

    Property.prototype.isAttached = function()
    {
        var context = this.getContext();

        if (this.getDefinition().isAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(this.getName());

            if (context[getterName] !== undefined) {
                return true;
            }
        } else {
            if (context[this.getName()] !== undefined) {
                return true;
            }
        }
        return false;
    };

    /**
     * Checks if property contains empty value
     *
     * @param {*} [value]
     * @returns {boolean}
     */
    Property.prototype.isEmpty = function(value)
    {
        if (!arguments.length) {
            value = this.getValue();
        }
        return this.getDefinition().isValueEmpty(value);
    };

    /**
     * Checks whether is valid specified value
     *
     * @param {*} value
     * @returns {boolean}
     */
    Property.prototype.isValid = function(value)
    {
        try {
            this.getDefinition().validateValue(value);
            return true;

        } catch (e) {
            return false;
        }
    };

    /**
     * Sets property value
     *
     * @param {*} value
     * @param {boolean} [markAsModified=true]
     * @param {boolean} [invokeParentWatchers=true]
     * @returns {*}
     */
    Property.prototype.setValue = function(value, markAsModified, invokeParentWatchers)
    {
        if (markAsModified !== false) {
            markAsModified = true;
        }
        if (invokeParentWatchers !== false) {
            invokeParentWatchers = true;
        }
        if (this.isLocked()) {
            return console.warn(
                'Trying to set new value for the ' +
                'property ' + this + ' that is locked for write.'
            );
        }

        var valueChanged = false;
        var parents = [];

        if (markAsModified) {
            var oldValue = this.getData();
            var newValue = value;
            var event = this._createWatcherEvent(newValue, oldValue);

            valueChanged = typeof newValue == 'function' || !Subclass.Tools.isEqual(oldValue, newValue);

            if (invokeParentWatchers) {
                parents = this._getParentWatcherValues(this, newValue);
            }
            if (valueChanged) {
                this.modify();
            }
        }

        this.getDefinition().validateValue(value);
        this._value = value;

        if (valueChanged) {
            this.invokeWatchers(event);

            if (invokeParentWatchers) {
                this._invokeParentWatchers(event, parents);
            }
        }
    };

    /**
     * Returns value of current property
     */
    Property.prototype.getValue = function()
    {
        return this._value;
    };

    /**
     * Resets the value of current property to default
     *
     * @param {boolean} [markAsModified=true]
     */
    Property.prototype.resetValue = function(markAsModified)
    {
        var defaultValue = this.getDefaultValue();

        this.setValue(defaultValue, markAsModified);
    };

    /**
     * Returns only data of current property
     *
     * @returns {*}
     */
    Property.prototype.getData = function()
    {
        return this.getValue();
    };

    /**
     * Sets property default value
     *
     * @param {*} value
     */
    Property.prototype.setDefaultValue = function(value)
    {
        var propertyDefinition = this.getDefinition();
        propertyDefinition.setDefault(value);

        if (this.isDefaultValue()) {
            this.setValue(value);
            this.unModify();
        }
    };

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    Property.prototype.getDefaultValue = function()
    {
        return this.getDefinition().getDefault();
    };

    /**
     * Checks whether current property equals default and was not modified
     *
     * @returns {boolean}
     */
    Property.prototype.isDefaultValue = function()
    {
        var defaultValue = this.getDefaultValue();
        var value = this.getValue();

        return (
            Subclass.Tools.isEqual(defaultValue, value)
            && !this.isModified()
        ) || (
            defaultValue === null
            && this.isEmpty()
            && !this.isModified()
        );
    };

    /**
     * Return string implementation of property
     *
     * @returns {string}
     */
    Property.prototype.toString = function()
    {
        var propertyName = this.getNameFull();
        var context = this.getContext();
        var contextClassName = "";

        if (context.getContextType() == 'class') {
            contextClassName = ' in the class "' + context.getClassName() + '"';
        }
        return '"' + propertyName + '"' + contextClassName;
    };

    return Property;
}();

// Source file: src/Error/Option/Property.js

/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the property when creating an error instance.
 */
Subclass.Error.Option.Property = function()
{
    function PropertyOption()
    {
        return {
            /**
             * The the property object
             *
             * @type {(string|undefined)}
             */
            _property: undefined
        };
    }

    /**
     * Sets/returns options name
     *
     * @param {string} [property]
     * @returns {Subclass.Error}
     */
    PropertyOption.prototype.property = function(property)
    {
        if (!arguments.length) {
            return this._property;
        }
        if (property && !(property instanceof Subclass.Property.PropertyType)) {
            throw new Error(
                'Specified invalid property object. ' +
                'It must be an instance of Subclass.Property.PropertyType.'
            );
        }
        this._property = property;

        return this;
    };

    /**
     * Checks whether the argument option was specified
     *
     * @returns {boolean}
     */
    PropertyOption.prototype.hasProperty = function()
    {
        return this._property !== undefined;
    };

    return PropertyOption;
}();

// Source file: src/Error/InvalidPropertyOptionError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Property.Error.InvalidPropertyOptionError = (function()
{
    function InvalidPropertyOptionError(message)
    {
        InvalidPropertyOptionError.$parent.apply(this, arguments);
    }

    InvalidPropertyOptionError.$parent = Subclass.Error.ErrorBase;

    InvalidPropertyOptionError.$mixins = [
        Subclass.Error.Option.Option,
        Subclass.Error.Option.Property,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received
    ];

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidPropertyOptionError.getName = function()
    {
        return "InvalidPropertyOption";
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyOptionError.getRequiredOptions = function()
    {
        var required = InvalidPropertyOptionError.$parent.getRequiredOptions();

        return required.concat([
            'property',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyOptionError.prototype.buildMessage = function()
    {
        var message = InvalidPropertyOptionError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option ' + this.option() + ' ';
            message += 'in definition of property "' + this.property() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidPropertyOptionError.getName(),
        InvalidPropertyOptionError
    );

    return InvalidPropertyOptionError;

})();

// Source file: src/Error/InvalidPropertyValueError.js

/**
 * @final
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Property.Error.InvalidPropertyValueError = (function()
{
    function InvalidPropertyValueError(message)
    {
        InvalidPropertyValueError.$parent.apply(this, arguments);
    }

    InvalidPropertyValueError.$parent = Subclass.Error.ErrorBase;

    InvalidPropertyValueError.$mixins = [
        Subclass.Error.Option.Property,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received
    ];

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidPropertyValueError.getName = function()
    {
        return "InvalidPropertyValue";
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.getRequiredOptions = function()
    {
        var required = InvalidPropertyValueError.$parent.getRequiredOptions();

        return required.concat([
            'property'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.prototype.buildMessage = function()
    {
        var message = InvalidPropertyValueError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Specified invalid value of property ' + this.property() + '. ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : "";
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidPropertyValueError.getName(),
        InvalidPropertyValueError
    );

    return InvalidPropertyValueError;

})();

// Source file: src/Extension/Class/ClassBuilderExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.ClassBuilderExtension = function() {

    function ClassBuilderExtension(classInst)
    {
        ClassBuilderExtension.$parent.apply(this, arguments);
    }

    ClassBuilderExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassBuilder = Subclass.Class.ClassBuilder;

    /**
     * Validates the definition of typed class properties
     *
     * @method _validateProperties
     * @private
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of class properties
     *
     * @param {*} classProperties
     *      The plain object with definitions of typed class properties
     */
    ClassBuilder.prototype._validateProperties = function(classProperties)
    {
        if (!classProperties || !Subclass.Tools.isPlainObject(classProperties)) {
            Subclass.Error.create('InvalidArgument')
                .option("classProperties")
                .received(classProperties)
                .expected("a plain object")
                .apply()
            ;
        }
    };

    /**
     * Sets the typed properties of class.<br /><br />
     *
     * This method redefines all typed class properties.<br />
     * If the class already has definitions of typed properties they will be erased.<br />
     *
     * @method setProperties
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @param {Object.<Object>} classProperties
     *      The plain object with definitions of typed class properties
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     * app.registerClass("Foo/Bar/TestClass", {
     *      ...
     *      $_properties: {
     *          prop1: { type: "string" },
     *          prop2: { type: "boolean" }
     *      },
     *      ...
     * });
     * ...
     *
     * app.alterClass("Foo/Bar/TestClass")
     *     .setProperties({
     *          foo: { type: "number" },
     *          bar: { type: "string" }
     *     })
     *     .save()
     * ;
     *
     * var TestClass = app.getClass('Foo/Bar/TestClass');
     *
     * console.log(TestClass.getDefinition().getProperties());
     *
     * // {
     * //     foo: { type: "number" },
     * //     bar: { type: "string" }
     * // }
     */
    ClassBuilder.prototype.setProperties = function(classProperties)
    {
        this._validateProperties(classProperties);
        this.getDefinition().$_properties = classProperties;

        return this;
    };

    /**
     * Adds new definitions of typed properties to the class.<br /><br />
     *
     * Current method allows to add new typed property definitions.<br />
     * If typed properties with the same name already exists in class
     * they will be redefined by the new added.
     * The left properties will be not touched.
     *
     * @method addProperties
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @param {Object.<Object>} classProperties
     *      The plain object with definitions of typed class properties
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     * app.registerClass("Foo/Bar/TestClass", {
     *      ...
     *      $_properties: {
     *          prop1: { type: "string" },
     *          prop2: { type: "boolean" },
     *          prop3: { type: "array" }
     *      },
     *      ...
     * });
     * ...
     *
     * app.alterClass("Foo/Bar/TestClass")
     *     .addProperties({
     *          foo: { type: "number" },
     *          bar: { type: "string" },
     *          prop3: { type: "object" }
     *     })
     *     .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass('Foo/Bar/TestClass');
     *
     * console.log(TestClass.getDefinition().getProperties());
     *
     * // {
     * //     prop1: { type: "string" },
     * //     prop2: { type: "boolean" },
     * //     prop3: { type: "object" },
     * //     foo: { type: "number" },
     * //     bar: { type: "string" }
     * // }
     */
    ClassBuilder.prototype.addProperties = function(classProperties)
    {
        this._validateProperties(classProperties);

        if (!this.getDefinition().$_properties) {
            this.getDefinition().$_properties = {};
        }
        Subclass.Tools.extend(
            this.getDefinition().$_properties,
            classProperties
        );

        return this;
    };

    /**
     * Returns the typed properties of class
     *
     * @method getProperties
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Object.<Object>}
     */
    ClassBuilder.prototype.getProperties = function()
    {
        return this.getDefinition().$_properties || {};
    };

    /**
     * Removes the typed class property with specified name
     *
     * @throws {Error}
     *      Throws error if specified invalid name of typed property
     *
     * @param {string} propertyName
     *      The name of typed property
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * app.registerClass("Foo/Bar/TestClass", {
     *      ...
     *      $_properties: {
     *          foo: { type: "string" },
     *          bar: { type: "number" }
     *      },
     *      ...
     * });
     * ...
     *
     * app.alterClass("Foo/Bar/TestClass")
     *      .removeProperty("foo")
     *      .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass("Foo/Bar/TestClass");
     *
     * console.log(TestClass.getDefinition().getProperties());
     *
     * // { bar: { type: "number" } }
     */
    ClassBuilder.prototype.removeProperty = function(propertyName)
    {
        if (typeof propertyName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of property", false)
                .received(propertyName)
                .expected("a string")
                .apply()
            ;
        }
        delete this.getDefinition().$_properties[propertyName];

        return this;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onCreate(function(evt, module)
    {
        ClassBuilder = Subclass.Tools.buildClassConstructor(ClassBuilder);

        if (!ClassBuilder.hasExtension(ClassBuilderExtension)) {
            ClassBuilder.registerExtension(ClassBuilderExtension);
        }
    });

    return ClassBuilderExtension;
}();

// Source file: src/Extension/Class/ClassDefinitionExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.ClassDefinitionExtension = function() {

    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     */
    ClassDefinitionExtension.initialize = function(classInst)
    {
        ClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            /**
             * List of class typed properties
             *
             * @type {Object}
             */
            data.$_properties = {};

        });

        classInst.getEvent('onNormalizeData').addListener(function(evt, data)
        {
            if (
                data.hasOwnProperty('$_properties')
                && Subclass.Tools.isPlainObject(data["$_properties"])
            ) {
                data.$_properties = this.normalizeProperties(data.$_properties);

                // Validating result properties

                for (var propName in data.$_properties) {
                    if (data.$_properties.hasOwnProperty(propName)) {
                        var property = data.$_properties[propName];

                        if (!property || !Subclass.Tools.isPlainObject(property)) {
                            Subclass.Error.create(
                                'Specified invalid definition of property "' + propName + '" ' +
                                'in class "' + this.getClass().getName() + '".'
                            );
                        }
                    }
                }
            }
        });

        classInst.getEvent('onValidateData').addListener(function(evt, data)
        {
            var classInst = this.getClass();

            for (var propName in data) {
                if (!data.hasOwnProperty(propName)) {
                    continue;
                }
                if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
                    Subclass.Error.create(
                        'Trying to define property with not allowed name "' + propName + '" ' +
                        'in class "' + classInst.getName() + '".'
                    );
                }
            }
        });

        classInst.getEvent('onProcessRelatedClasses').addListener(function(evt)
        {
            var classInst = this.getClass();
            var classManager = classInst.getClassManager();
            var propertyManager = classManager.getModule().getPropertyManager();
            var properties = this.getProperties();

            // Performing $_properties option

            if (properties && Subclass.Tools.isPlainObject(properties)) {
                for (var propName in properties) {
                    if (!properties.hasOwnProperty(propName)) {
                        continue;
                    }
                    var propertyDefinition = propertyManager.normalizeTypeDefinition(
                        properties[propName],
                        propName
                    );

                    if (typeof propertyDefinition != 'object') {
                        continue;
                    }
                    var propertyTypeName = propertyDefinition.type;

                    if (propertyManager.issetType(propertyTypeName)) {
                        var dataTypeDefinition = Subclass.Tools.copy(propertyManager.getTypeDefinition(propertyTypeName));
                        propertyTypeName = dataTypeDefinition.type;
                        propertyDefinition = Subclass.Tools.extendDeep(dataTypeDefinition, propertyDefinition);
                        propertyDefinition.type = propertyTypeName;
                    }
                    var propertyType = Subclass.Property.PropertyManager.getPropertyType(propertyTypeName);

                    if (!propertyType.parseRelatedClasses) {
                        continue;
                    }
                    var requiredClasses = propertyType.parseRelatedClasses(propertyDefinition);

                    if (requiredClasses && requiredClasses.length) {
                        for (var i = 0; i < requiredClasses.length; i++) {
                            classManager.load(requiredClasses[i]);
                        }
                    }
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassDefinition = Subclass.Class.ClassDefinition;

    /**
     * Sets "$_requires" option value
     *
     * @param {Object.<string>} requires
     *
     * List of the classes that current one requires. It can be specified in two ways:
     *
     * 1. As an array of class names:
     *
     * Example:
     * [
     *    "Namespace/Of/Class1",
     *    "Namespace/Of/Class2",
     *    ...
     * ]
     *
     * 2. As an object with pairs key/value where key is an class alias and value is a class name.
     *
     * Example:
     * {
     *    classAlias1: "Namespace/Of/Class1",
     *    classAlias2: "Namespace/Of/Class2",
     *    ...
     * }
     */
    ClassDefinition.prototype.setRequires = function(requires)
    {
        this.validateRequires(requires);
        this.getData().$_requires = requires || null;
        var classInst = this.getClass();

        if (requires && Subclass.Tools.isPlainObject(requires)) {
            for (var alias in requires) {
                if (!requires.hasOwnProperty(alias)) {
                    continue;
                }
                classInst.addProperty(alias, {
                    type: "untyped",
                    className: requires[alias]
                });
            }
        }
    };

    /**
     * Validates "$_properties" option value
     *
     * @param {*} properties
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateProperties = function(properties)
    {
        if (properties && typeof properties != 'object') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_properties')
                .received(properties)
                .className(this.getClass().getName())
                .expected('a plain object with property definitions')
                .apply()
            ;

        } else if (properties) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
                    Subclass.Error.create(
                        'Specified not allowed typed property name "' + propName + '" in option "$_properties" ' +
                        'in definition of class "' + this.getClass().getName() + '".'
                    );
                }
                if (!properties[propName] || !Subclass.Tools.isPlainObject(properties[propName])) {
                    Subclass.Error.create('InvalidClassOption')
                        .option('"$_properties" (invalid definition of property "' + propName + '")', false)
                        .received(properties)
                        .className(this.getClass().getName())
                        .expected('a plain object with property definitions')
                        .apply()
                    ;
                }
                if (!properties[propName].type) {
                    Subclass.Error.create(
                        'Trying to set not valid definition of typed property "' + propName + '" in option "$_properties" ' +
                        'in definition of class "' + this.getClass().getName() + '". ' +
                        'Required property "type" was missed.'
                    );
                }
            }
        }
        return true;
    };

    /**
     * Returns functions which should normalize class properties collection
     *
     * Each normalizer takes one argument, which is properties collection object.
     * It can modify this collection whatever its needed and after that should
     * return this collection back.
     *
     * @returns {Array.<Function>}
     */
    ClassDefinition.prototype.getPropertyNormalizers = function()
    {
        var $this = this;

        return [

            // Processing parent class

            function(properties) {
                if ($this.getExtends && $this.getExtends()) {
                    var parentClassName = $this.getExtends();
                    var parentClass = $this.getClass().getClassManager().get(parentClassName);
                    var parentClassConstructor = parentClass.getConstructor();

                    // Processing parent class properties

                    properties = $this.extendProperties(
                        parentClass.getDefinition().getProperties(),
                        properties
                    );
                }

                return properties;
            }
        ];
    };

    /**
     * Normalizes property definitions.
     * Brings all property definitions to the single form.
     *
     * @param {Object} properties
     *      The object with property definitions
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.normalizeProperties = function(properties)
    {
        var classManager = this.getClass().getClassManager();
        var propertyManager = classManager.getModule().getPropertyManager();

        // Bringing property definition to the single form

        if (properties && Subclass.Tools.isPlainObject(properties)) {
            for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                    properties[propertyName] = propertyManager.normalizeTypeDefinition(
                        properties[propertyName],
                        propertyName
                    );
                }
            }
        }

        // Solving issues of extending property definitions
        // from parent to child class

        var normalizers = this.getPropertyNormalizers();

        for (var i = 0; i < normalizers.length; i++) {
            properties = normalizers[i](properties);
        }

        return properties;
    };

    /**
     * Extending class property definitions
     *
     * @param {Object} childProperties
     * @param {Object} parentProperties
     */
    ClassDefinition.prototype.extendProperties = function(parentProperties, childProperties)
    {
        parentProperties = Subclass.Tools.copy(parentProperties);

        for (var propName in childProperties) {
            if (!childProperties.hasOwnProperty(propName)) {
                continue;
            }
            if (
                Subclass.Tools.isPlainObject(childProperties[propName])
                && childProperties[propName].hasOwnProperty('type')
                && parentProperties
                && parentProperties.hasOwnProperty(propName)
            ) {
                if (childProperties[propName].extends === true) {
                    parentProperties[propName] = Subclass.Tools.extend(
                        parentProperties[propName],
                        childProperties[propName]
                    );
                } else {
                    parentProperties[propName] = childProperties[propName];
                }

            } else if (
                parentProperties
                && parentProperties[propName]
            ) {
                parentProperties[propName] = Subclass.Tools.extend(
                    parentProperties[propName],
                    { value: childProperties[propName] }
                );

            } else {
                parentProperties[propName] = childProperties[propName];
            }
        }

        return parentProperties;
    };

    /**
     * Sets "$_properties" option value
     *
     * @param {Object.<Object>} properties
     *
     *      List of the property definitions
     *
     *      Example: {
     *         propName1: { type: "string", value: "init value" },
     *         propName2: { type: "boolean" },
     *         ...
     *      }
     */
    ClassDefinition.prototype.setProperties = function(properties)
    {
        this.validateProperties(properties);
        this.getData().$_properties = properties || {};

        if (properties) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                this.getClass().addProperty(
                    propName,
                    properties[propName]
                );
            }
        }
    };

    /**
     * Return "$_properties" option value
     *
     * @returns {Object.<Object>}
     */
    ClassDefinition.prototype.getProperties = function()
    {
        return this.getData().$_properties;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onCreate(function(evt, module)
    {
        ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();

// Source file: src/Extension/Class/ClassTypeExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.ClassTypeExtension = function() {

    function ClassTypeExtension(classInst)
    {
        ClassTypeExtension.$parent.apply(this, arguments);
    }

    //ClassTypeExtension.$parent = Subclass.Class.ClassExtension;
    ClassTypeExtension.$parent = Subclass.Extension;

    //ClassTypeExtension.$config = {
    //    classes: ["Class", "Config"]
    //};

    /**
     * @inheritDoc
     */
    ClassTypeExtension.initialize = function(classInst)
    {
        ClassTypeExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onInitialize').addListener(function()
        {
            /**
             * @type {Object}
             * @protected
             */
            this._properties = {};
        });

        classInst.getEvent('onCreateClassAfter').addListener(function(evt, classConstructor)
        {
            this.attachProperties(classConstructor.prototype);
        });

        classInst.getEvent('onCreateInstanceBefore').addListener(function(evt, classInstance)
        {
            var classProperties = this.getProperties(true);
            this.attachPropertyMethods(classInstance);

            //Attaching hashed typed properties

            for (var propertyName in classProperties) {
                if (!classProperties.hasOwnProperty(propertyName)) {
                    continue;
                }

                // Getting init value

                var property = classInstance.getProperty(propertyName);
                var propertyDefinition = classProperties[propertyName];
                var initValue = propertyDefinition.getValue();

                // Setting init value

                if (initValue !== undefined) {
                    property.setValue(initValue, false);
                }
            }
        });

        classInst.getEvent('onCreateInstance').addListener(function(evt, classInstance)
        {
            var classManager = this.getClassManager();

            // Setting required classes to alias typed properties

            if (classInstance.$_requires) {
                if (Subclass.Tools.isPlainObject(classInstance.$_requires)) {
                    for (var alias in classInstance.$_requires) {
                        if (!classInstance.$_requires.hasOwnProperty(alias)) {
                            continue;
                        }
                        var setterName = Subclass.Tools.generateSetterName(alias);
                        var requiredClassName = classInstance.$_requires[alias];
                        var requiredClass = classManager.get(requiredClassName);

                        classInstance[setterName](requiredClass);
                    }
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassType = Subclass.Class.ClassType;

    /**
     * Returns all typed properties in current class definition instance
     *
     * @param {boolean} [withInherited]
     * @returns {Object.<Subclass.Property.PropertyType>}
     */
    ClassType.prototype.getProperties = function(withInherited)
    {
        var properties = {};

        if (withInherited !== true) {
            withInherited = false;
        }
        if (withInherited && this.hasParent()) {
            var parentClass = this.getParent();
            var parentClassProperties = parentClass.getProperties(withInherited);

            Subclass.Tools.extend(
                properties,
                parentClassProperties
            );
        }
        return Subclass.Tools.extend(
            properties,
            this._properties
        );
    };

    /**
     * Adds new typed property to class
     *
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     */
    ClassType.prototype.addProperty = function(propertyName, propertyDefinition)
    {
        var propertyManager = this.getClassManager().getModule().getPropertyManager();

        this._properties[propertyName] = propertyManager.createProperty(
            propertyName,
            propertyDefinition,
            this
        );
    };

    /**
     * Returns property instance by its name
     *
     * @param {string} propertyName
     * @returns {Subclass.Property.PropertyType}
     * @throws {Error}
     */
    ClassType.prototype.getProperty = function(propertyName)
    {
        var classProperties = this.getProperties();

        if (!classProperties[propertyName] && this.hasParent()) {
            return this.getParent().getProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            Subclass.Error.create(
                'Trying to call to non existent property "' + propertyName + '" ' +
                'in class "' + this.getName() + '".'
            );
        }
        return this.getProperties()[propertyName];
    };

    /**
     * Checks if property with specified property name exists
     *
     * @param {string} propertyName
     * @returns {boolean}
     */
    ClassType.prototype.issetProperty = function(propertyName)
    {
        var classProperties = this.getProperties();

        if (!classProperties[propertyName] && this.hasParent()) {
            return this.getParent().issetProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            return false;
        }
        return true;
    };

    /**
     * Creates and attaches class typed properties
     *
     * @param {Object} context Class constructor prototype
     */
    ClassType.prototype.attachProperties = function(context)
    {
        if (!this.getProperties) {
            return;
        }
        var classProperties = this.getProperties();

        for (var propName in classProperties) {
            if (classProperties.hasOwnProperty(propName)) {
                classProperties[propName].attach(context, propName);
            }
        }
    };

    /**
     * Attaches methods for work with properties
     *
     * @param context
     */
    ClassType.prototype.attachPropertyMethods = function(context)
    {
        if (!this.getProperties) {
            return;
        }
        var allClassProperties = this.getProperties(true);
        var properties = {};

        /**
         * Returns property api object
         *
         * @param {string} propertyName
         * @returns {Subclass.Property.Property}
         */
        context.getProperty = function (propertyName)
        {
            return properties[propertyName];
        };

        /**
         * Checks if property is typed
         *
         * @param {string} propertyName
         * @returns {boolean}
         */
        context.issetProperty = function (propertyName)
        {
            return properties.hasOwnProperty(propertyName);
        };

        /**
         * Returns context type name
         *
         * @returns {string}
         */
        context.getContextType = function ()
        {
            return "class";
        };

        for (var propName in allClassProperties) {
            if (allClassProperties.hasOwnProperty(propName)) {
                properties[propName] = allClassProperties[propName].createInstance(propName);
                properties[propName].setContext(context);
                properties[propName].resetValue(false);
            }
        }
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onCreate(function(evt, module)
    {
        ClassType = Subclass.Tools.buildClassConstructor(ClassType);

        if (!ClassType.hasExtension(ClassTypeExtension)) {
            ClassType.registerExtension(ClassTypeExtension);

            /*************************************************/
            /*        Performing register operations         */
            /*************************************************/

            // Adding not allowed class properties

            Subclass.Property.PropertyManager.registerNotAllowedPropertyNames([
                "class",
                "parent",
                "classManager",
                "class_manager",
                "classWrap",
                "class_wrap",
                "className",
                "class_name"
            ]);
        }
    });

    return ClassTypeExtension;
}();

// Source file: src/Extension/Class/Type/AbstractClass/AbstractClassDefinitionExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.Type.AbstractClass.AbstractClassDefinitionExtension = function()
{
    function AbstractClassDefinitionExtension(classInst)
    {
        AbstractClassDefinitionExtension.$parent.apply(this, arguments);
    }

    AbstractClassDefinitionExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     */
    AbstractClassDefinitionExtension.initialize = function(classInst)
    {
        AbstractClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            delete data.issetProperty;
            delete data.getProperty;
        });
    };

    // Registering extension

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('AbstractClass')) {
            var AbstractClassDefinition = Subclass.ClassManager.getType('AbstractClass').getDefinitionClass();
                AbstractClassDefinition = Subclass.Tools.buildClassConstructor(AbstractClassDefinition);

            if (!AbstractClassDefinition.hasExtension(AbstractClassDefinitionExtension)) {
                AbstractClassDefinition.registerExtension(AbstractClassDefinitionExtension);
            }
        }
    });

    return AbstractClassDefinitionExtension;
}();

// Source file: src/Extension/Class/Type/Class/ClassDefinitionExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.Type.Class.ClassDefinitionExtension = function()
{
    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Class.ClassExtension;

    ClassDefinitionExtension.$config = {
        classes: ["Class"]
    };

    /**
     * @inheritDoc
     */
    ClassDefinitionExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getClass().getType()) < 0) {
            return false;
        }
        ClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            /**
             * Returns the property instance based on specified data type.
             *
             * @param {(string|{type:{string}})} dataType
             * @returns {Subclass.Property.PropertyAPI}
             * @private
             */
            data._getDataTypeProperty = function(dataType)
            {
                var classManager = this.getClassManager();
                var propertyManager = classManager.getModule().getPropertyManager();
                var property;

                if (
                    dataType
                    && typeof dataType == 'object'
                    && dataType.type
                    && typeof dataType.type == 'string'
                ) {
                    return propertyManager.createProperty('test', dataType).getAPI(this);

                } else if (!dataType || typeof dataType != 'string') {
                    Subclass.Error.create("InvalidArgument")
                        .argument('the data type', false)
                        .received(dataType)
                        .expected('a string')
                        .apply()
                    ;
                }

                if (this.issetProperty(dataType)) {
                    property = this.getProperty(dataType);

                } else {
                    //var dataTypeManager = propertyManager.getDataTypeManager();

                    if (this.issetType(dataType)) {
                        property = this.getType(dataType).getAPI(this);
                    }
                }
                if (!property) {
                    Subclass.Error.create(
                        'Specified non existent or data type which ' +
                        'can\'t be used in data type validation.'
                    );
                }
                return property;
            };

            /**
             * Validates and returns default value if the value is undefined
             * or returns the same value as was specified if it's valid
             *
             * @param {(string|{type:{string}})} dataType
             * @param {*} value
             * @param {*} [valueDefault]
             * @returns {*}
             */
            data.value = function(dataType, value, valueDefault)
            {
                var property = this._getDataTypeProperty(dataType);
                dataType = typeof dataType == 'object' ? dataType.type : dataType;

                if (value === undefined && arguments.length == 3) {
                    return valueDefault;

                } else if (value === undefined) {
                    return property.getDefaultValue();

                } else if (!property.isValueValid(value)) {
                    Subclass.Error.create(
                        'Specified invalid value that is not corresponds to data type "' + dataType + '".'
                    );
                }

                return value;
            };

            /**
             * Validates and returns (if valid)
             * @param dataType
             * @param value
             */
            data.result = function(dataType, value)
            {
                var property = this._getDataTypeProperty(dataType);
                dataType = typeof dataType == 'object' ? dataType.type : dataType;

                if (!property.isValueValid(value)) {
                    Subclass.Error.create(
                        'Trying to return not valid value that is not corresponds to data type "' + dataType + '".'
                    );
                }
                return value;
            };
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassDefinition = Subclass.Class.Type.Class.ClassDefinition;


    /**
     * @inheritDoc
     */
    ClassDefinition.prototype.getPropertyNormalizers = function()
    {
        var normalizes = ClassDefinition.$parent.prototype.getPropertyNormalizers.apply(this, arguments);
        var $this = this;

        // Processing included classes

        normalizes.unshift(function(properties) {
            if (!$this.getTraits) {
                return properties;
            }
            var traits = $this.getTraits();

            if (!traits) {
                return properties;
            }

            for (var i = 0; i < traits.length; i++) {
                var traitClassName = traits[i];
                var traitClass = $this.getClass().getClassManager().get(traitClassName);
                var traitClassConstructor = traitClass.getConstructor();
                var traitClassProperties = traitClass.getDefinition().getProperties();

                properties = $this.extendProperties(
                    traitClassProperties,
                    properties
                );
            }

            return properties;
        });

        return normalizes;
    };


    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        var ClassDefinition = Subclass.ClassManager.getType('Class').getDefinitionClass();
            ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();

// Source file: src/Extension/Class/Type/Interface/InterfaceBuilderExtension.js

/**
* @class
* @constructor
*/
Subclass.Property.Extension.Class.Type.Interface.InterfaceBuilderExtension = function()
{
    function InterfaceBuilderExtension(classInst)
    {
        InterfaceBuilderExtension.$parent.apply(this, arguments);
    }

    InterfaceBuilderExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Interface')) {
            var InterfaceBuilder = Subclass.ClassManager.getType('Interface').getBuilderClass();

            InterfaceBuilder.prototype.setProperties = undefined;

            InterfaceBuilder.prototype.addProperties = undefined;

            InterfaceBuilder.prototype.getProperties = undefined;

            InterfaceBuilder.prototype.removeProperty = undefined;
        }
    });

    return InterfaceBuilderExtension;
}();

// Source file: src/Extension/Class/Type/Interface/InterfaceExtension.js

/**
* @class
* @constructor
*/
Subclass.Property.Extension.Class.Type.Interface.InterfaceExtension = function()
{
    function InterfaceExtension(classInst)
    {
        InterfaceExtension.$parent.apply(this, arguments);
    }

    InterfaceExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Interface')) {
            var Interface = Subclass.ClassManager.getType('Interface');

            Interface.prototype.setProperties = undefined;

            Interface.prototype.addProperties = undefined;

            Interface.prototype.getProperties = undefined;

            Interface.prototype.removeProperty = undefined;

            Interface.prototype.attachProperties = function() {};
        }
    });

    return InterfaceExtension;
}();

// Source file: src/Extension/Class/Type/Trait/TraitExtension.js

/**
* @class
* @constructor
*/
Subclass.Property.Extension.Class.Type.Trait.TraitExtension = function()
{
    function TraitExtension(classInst)
    {
        TraitExtension.$parent.apply(this, arguments);
    }

    TraitExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Trait')) {
            var Trait = Subclass.ClassManager.getType('Trait');

            Trait.prototype.attachProperties = function() {};

            /**
             * @inheritDoc
             */
            Trait.prototype.getProperties = function()
            {
                var properties = {};

                if (this.hasParent()) {
                    var parentClass = this.getParent();
                    var parentProperties = parentClass.getProperties();
                    properties = Subclass.Tools.extend(properties, parentProperties);
                }
                return Subclass.Tools.extend(
                    properties,
                    this._properties
                );
            };
        }
    });

    return TraitExtension;
}();

// Source file: src/Extension/ModuleAPIExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.ModuleAPIExtension = function() {

    function ModuleAPIExtension(classInst)
    {
        ModuleAPIExtension.$parent.apply(this, arguments);
    }

    ModuleAPIExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ModuleAPI = Subclass.ModuleAPI;

    /**
     * The same as the {@link Subclass.Module#getPropertyManager}
     *
     * @method getPropertyManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getPropertyManager = function()
    {
        return this.getModule().getPropertyManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.ConfigManager#setDataTypes}
     *
     * @method registerDataTypes
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.registerDataTypes = function()
    {
        return this.getModule().getConfigManager().setDataTypes.apply(
            this.getModule().getConfigManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.Module#onConfig}
     *
     * @method onConfig
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.onConfig = function()
    {
        return this.getModule().onConfig.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#setConfigsClass}
     *
     * @method setConfigsClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.setConfigsClass = function()
    {
        return this.getModule().setConfigsClass.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getConfigsClass}
     *
     * @method getConfigsClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getConfigsClass = function()
    {
        return this.getModule().getConfigsClass.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#issetConfigsClass}
     *
     * @method issetConfigsClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.issetConfigsClass = function()
    {
        return this.getModule().issetConfigsClass.apply(this.getModule(), arguments);
    };



    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ModuleAPI = Subclass.Tools.buildClassConstructor(ModuleAPI);

        if (!ModuleAPI.hasExtension(ModuleAPIExtension)) {
            ModuleAPI.registerExtension(ModuleAPIExtension);
        }
    });

    return ModuleAPIExtension;
}();

// Source file: src/Extension/ModuleExtension.js

/**
 * @class
 * @constructor
 *
 * Module settings:
 *
 * configurators   {Object}    opt    Array of strings which are names
 *                                    of configurator classes
 *
 *                                    Example:
 *                                    ...
 *
 *                                    var moduleSettings = [
 *                                      "App/FooConfigurator",
 *                                      "App/BarConfigurator"
 *                                    ];
 *
 *
 * configs         {Object}    opt    Object, where you can specify
 *                                    configuration of your application.
 *
 *                                    Example:
 *                                    ...
 *
 *                                    var moduleSettings = {
 *                                      configs: {
 *                                        foo: true,
 *                                        bar: 200,
 *                                        map: {
 *                                            mapFoo: false,
 *                                            mapBar: 300
 *                                        }
 *                                      }
 *                                      ...
 *                                    };
 *
 * dataTypes       {Object}    opt    Object, which keys are the type
 *                                    names and values are
 *                                    its definitions.
 *
 *                                    It allows to create the new data
 *                                    types based on the default
 *                                    (registered) data types using
 *                                    configuration whatever you need.
 *
 *                                    Also you may to change
 *                                    configuration of the default
 *                                    data types.
 *
 *                                    Example:
 *
 *                                    var moduleSettings = {
 *                                      ...
 *                                      dataTypes: {
 *
 *                                        // creating the new type
 *                                        percents: {
 *                                          type: "string",
 *                                          pattern: /^[0-9]+%$/
 *                                        },
 *
 *                                        // altering existent type
 *                                        number: {
 *                                          type: "number",
 *                                          nullable: false,
 *                                          default: 100
 *                                        }
 *                                      },
 *                                      ...
 *                                    };
 */
Subclass.Property.Extension.ModuleExtension = function() {

    function ModuleExtension(classInst)
    {
        ModuleExtension.$parent.apply(this, arguments);
    }

    ModuleExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     */
    ModuleExtension.initialize = function(module)
    {
        this.$parent.initialize.apply(this, arguments);

        var eventManager = module.getEventManager();
            eventManager.registerEvent('onConfig');

        eventManager.getEvent('onInitialize').addListener(function(evt, module)
        {
            /**
             * Property manager instance
             *
             * @type {Subclass.Property.PropertyManager}
             * @private
             */
            this._propertyManager = Subclass.Tools.createClassInstance(
                Subclass.Property.PropertyManager,
                this
            );

            /**
             * Name of module configuration class
             *
             * @type {string}
             * @private
             */
            this._configsClassName = null;
        });

        eventManager.getEvent('onInitializeAfter').addListener(function(evt, module)
        {
            this.getPropertyManager().initialize();
        });

        eventManager.getEvent('onLoadingEnd').addListener(function() {
            if (module.isRoot()) {
                var serviceManager = module.getServiceManager();
                serviceManager.register('configs');
                serviceManager.register('config_container');
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var Module = Subclass.Module;

    /**
     * Returns instance of property manager which allows to register
     * custom data types and creates typed property instance by its definition.
     *
     * @method getPropertyManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    Module.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };

    /**
     * The same as the {@link Subclass.SettingsManager#setOnConfig}
     *
     * @method onConfig
     * @memberOf Subclass.Module.prototype
     *
     * @param {Function} callback
     *      The callback function
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.onConfig = function(callback)
    {
        this.getSettingsManager().setOnConfig(callback);

        return this;
    };

    /**
     * Invokes registered onConfig callback functions forcibly.<br /><br />
     *
     * @method triggerOnConfig
     * @memberOf Subclass.Module.prototype
     *
     * @param {Subclass.Class.Type.Config.Config} configs
     *
     * @returns {Subclass.Module}
     */
    Module.prototype.triggerOnConfig = function(configs)
    {
        if (
            !configs
            || typeof configs != 'object'
            || !configs.getClassType
            || configs.getClassType() != 'Config'
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument('the configs instance', false)
                .expected('an instance of Config class type')
                .received(configs)
                .apply()
            ;
        }
        this.getEventManager().getEvent('onConfig').trigger(configs);

        return this;
    };

    /**
     * Sets module configuration class
     *
     * @method setConfigsClass
     * @memberOf Subclass.Module.prototype
     *
     * @param {string} configsClassName
     */
    Module.prototype.setConfigsClass = function(configsClassName)
    {
        if (
            !configsClassName
            || typeof configsClassName != 'string'
            || !this.getClassManager().isset(configsClassName)
        ) {
            Subclass.Error.create('InvalidError')
                .argument('the name of module configuration class', false)
                .expected('a string')
                .received(configsClassName)
                .apply()
            ;
        }
        this._configsClassName = configsClassName;
    };

    /**
     * Returns module configuration class
     *
     * @method getConfigsClass
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Class.Type.Config.Config}
     */
    Module.prototype.getConfigsClass = function()
    {
        var configsClassName = this._configsClassName;

        if (!configsClassName) {
            Subclass.Error.create('Trying to get configs class before it was defined.');
        }
        return this.getClassManager().get(configsClassName);
    };

    /**
     * Checks whether or not module configuration class was set
     *
     * @method issetConfigsClass
     * @memberOf Subclass.Module.prototype
     *
     * @returns {boolean}
     */
    Module.prototype.issetConfigsClass = function()
    {
        return !!this._configsClassName;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (!Module.hasExtension(ModuleExtension)) {
            Module.registerExtension(ModuleExtension);
        }
    });

    return ModuleExtension;
}();

// Source file: src/Extension/ModuleInstanceExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.ModuleInstanceExtension = function() {

    function ModuleInstanceExtension(classInst)
    {
        ModuleInstanceExtension.$parent.apply(this, arguments);
    }

    ModuleInstanceExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     *
     * @param {Subclass.ModuleInstance} moduleInstance
     */
    ModuleInstanceExtension.initialize = function(moduleInstance)
    {
        ModuleInstanceExtension.$parent.initialize.apply(this, arguments);

        moduleInstance.getEvent('onInitialize').addListener(function() {

            /**
             * App configuration
             *
             * @type {Object}
             * @private
             */
            this._configContainer = Subclass.Tools.createClassInstance(Subclass.Property.ConfigContainer, this);


            // Initializing

            this._configContainer.initialize();
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ModuleInstance = Subclass.ModuleInstance;

    /**
     * Returns instance of configs class
     *
     * @returns {Object}
     */
    ModuleInstance.prototype.getConfigContainer = function()
    {
        return this._configContainer;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ModuleInstance = Subclass.Tools.buildClassConstructor(ModuleInstance);

        if (!ModuleInstance.hasExtension(ModuleInstanceExtension)) {
            ModuleInstance.registerExtension(ModuleInstanceExtension);
        }
    });

    return ModuleInstanceExtension;
}();

// Source file: src/Extension/SettingsManagerExtension.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.SettingsManagerExtension = function() {

    function SettingsManagerExtension(classInst)
    {
        SettingsManagerExtension.$parent.apply(this, arguments);
    }

    SettingsManagerExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     */
    SettingsManagerExtension.initialize = function(settingsManager)
    {
        SettingsManagerExtension.$parent.initialize.apply(this, arguments);

        settingsManager.getEvent('onInitialize').addListener(function() {

            /**
             * Module config values
             *
             * @type {Object}
             * @private
             */
            this._configs = {};
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var SettingsManager = Subclass.SettingsManager;

    /**
     * Sets module configuration default values
     *
     * @param {Object} configs
     */
    SettingsManager.prototype.setConfigs = function(configs)
    {
        if (!configs) {
            return;
        }
        if (!Subclass.Tools.isPlainObject(configs)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the module configuration values', false)
                .expected('a plain object')
                .received(configs)
                .apply()
            ;
        }
        this._configs = configs;
    };

    /**
     * Returns module configuration default values
     *
     * @param {boolean} privateOnly
     *
     * @returns {Object}
     */
    SettingsManager.prototype.getConfigs = function(privateOnly)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var defaults = {};
        var $this = this;

        if (privateOnly !== true) {
            privateOnly = false;
        }
        if (privateOnly || !moduleStorage) {
            return this._configs;
        }

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extendDeep(defaults, $this.getConfigs(true));
                return;
            }
            var moduleSettingsManager = module.getSettingsManager();
            var moduleDefaults = moduleSettingsManager.getConfigs();

            Subclass.Tools.extendDeep(defaults, moduleDefaults);
        });

        return defaults;
    };

    /**
     * Sets callback function which will invoke right after module configuration
     * has been processed.
     *
     * It is a good opportunity to modify its settings using plugins of application.
     *
     * @method setOnConfig
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param callback
     */
    SettingsManager.prototype.setOnConfig = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var eventManager = this.getModule().getEventManager();
        var onSetupEvent = eventManager.getEvent('onConfig');

        onSetupEvent.addListener(callback);
    };

    /**
     * Defines custom data types relying on existent property types
     * registered in Subclass.Property.PropertyManager.
     *
     * You can also redefine definitions of standard data types,
     * for example, if you want to set default value for all number properties or
     * customize it to be not nullable etc.
     *
     * @method setDataTypes
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if trying to change value after the module became ready
     *
     * @param {Object.<Object>} propertyDefinitions
     *      A plain object with property definitions. Each property
     *      in turn also is a plain object. To learn more look at
     *      {@link Subclass.Property.PropertyManager#createProperty}
     *
     * @example
     * ...
     *
     * var moduleSettings = moduleInst.getSettingsManager();
     *
     * // Setting data types
     * moduleSettings.setDataTypes({
     *     percents: {               // name of data type
     *         type: "string",       // type of property
     *         pattern: /^[0-9]+%$/, // RegExp instance object
     *         value: "0%"           // default property value
     *     },
     *     ...
     * });
     * ...
     *
     * // Registering TestClass
     * moduleInst.registerClass("Name/Of/TestClass", {
     *     ...
     *     $_properties: {
     *         percentsProp: { type: "percents" }
     *         ...
     *     },
     *     ...
     * });
     *
     * // Creating TestClass instance
     * var testClass = moduleInst.getClass("Name/Of/TestClass");
     * var testClassInst = testClass.createInstance();
     *
     * // Trying to set percentsProp property value
     * testClass.setPercentsProp("10%"); // normally set
     * testClass.setPercentsProp("10");  // throws error
     * ...
     */
    SettingsManager.prototype.setDataTypes = function(propertyDefinitions)
    {
        this.checkModuleIsReady();
        this.getModule()
            .getPropertyManager()
            .addTypeDefinitions(propertyDefinitions)
        ;
    };

    /**
     * Returns defined custom data types in the form in which they were set
     *
     * @method getDataTypes
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {Object.<Object>}
     */
    SettingsManager.prototype.getDataTypes = function()
    {
        return this.getModule()
            .getPropertyManager()
            .getTypeDefinitions()
        ;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        SettingsManager = Subclass.Tools.buildClassConstructor(SettingsManager);

        if (!SettingsManager.hasExtension(SettingsManagerExtension)) {
            SettingsManager.registerExtension(SettingsManagerExtension);
        }
    });

    return SettingsManagerExtension;
}();

// Source file: src/Type/Map/MapType.js

/**
 * @namespace
 */
Subclass.Property.Type.Map = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Map.MapType = function()
{
    /**
     * @inheritDoc
     */
    function MapType()
    {
        MapType.$parent.apply(this, arguments);

        /**
         * @type {Object.<Subclass.Property.PropertyType>}
         * @private
         */
        this._children = {};
    }

    MapType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    MapType.getName = function()
    {
        return "map";
    };

    /**
     * @inheritDoc
     */
    MapType.getPropertyClass = function()
    {
        return Subclass.Property.Type.Map.MapProperty;
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    MapType.parseRelatedClasses = function(propertyDefinition)
    {
        if (!propertyDefinition.schema) {
            return;
        }
        var requires = [];

        for (var propName in propertyDefinition.schema) {
            if (
                !propertyDefinition.schema.hasOwnProperty(propName)
                || typeof propertyDefinition.schema[propName] != 'object'
                || !propertyDefinition.schema[propName].type
            ) {
                continue;
            }
            var propDef = propertyDefinition.schema[propName];
            var propertyType = Subclass.Property.PropertyManager.getPropertyType(propDef.type);

            if (!propertyType.parseRelatedClasses) {
                continue;
            }
            var requiredClasses = propertyType.parseRelatedClasses(propDef);

            if (requiredClasses && requiredClasses.length) {
                requires = requires.concat(requiredClasses);
            }
        }
        return requires;
    };

    /**
     * @inheritDoc
     */
    MapType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    MapType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.schema = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];

                if (definition[2] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 4) {
                fullDefinition.writable = definition[3];
            }
            if (definition.length == 5) {
                fullDefinition.nullable = definition[4];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * Returns list of children properties instances
     *
     * @returns {Object}
     */
    MapType.prototype.getChildren = function()
    {
        return this._children;
    };

    /**
     * Adds children property to current
     *
     * @param {string} childName
     * @param {Object} childDefinition
     * @returns {Subclass.Property.PropertyType}
     */
    MapType.prototype.addChild = function(childName, childDefinition)
    {
        childDefinition.accessors = false;

        return this._children[childName] = this.getPropertyManager().createProperty(
            childName,
            childDefinition,
            this.getContextClass(),
            this
        );
    };

    /**
     * Returns children property instance
     *
     * @param {string} childPropName
     * @returns {Subclass.Property.PropertyType}
     */
    MapType.prototype.getChild = function(childPropName)
    {
        return this._children[childPropName];
    };

    /**
     * Checks if child property with specified name was registered
     *
     * @param {string} childPropName
     * @returns {boolean}
     */
    MapType.prototype.hasChild = function(childPropName)
    {
        return this._children.hasOwnProperty(childPropName);
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.validateValue = function(value)
    {
        MapType.$parent.prototype.validateValue.call(this, value);
        var error = false;

        if (
            value
            && (
                typeof value != 'object'
                || !Subclass.Tools.isPlainObject(value)
            )
        ) {
            error = true;
        }

        if (!error) {
            for (var propName in value) {
                if (!value.hasOwnProperty(propName)) {
                    continue;
                }
                if (!this.hasChild(propName)) {
                    var childrenProps = this.getChildren();

                    Subclass.Error.create(
                        'Trying to set not registered property "' + propName + '" ' +
                        'to not extendable map property ' + this + '. ' +
                        'Allowed properties are: "' + Object.keys(childrenProps).join('", "') + '".'
                    );

                } else {
                    this
                        .getChild(propName)
                        .validateValue(value[propName])
                    ;
                }
            }
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected("a plain object")
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.validateDefault = MapType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    MapType.prototype.setDefault = function(defaultValue)
    {
        MapType.$parent.prototype.setDefault.call(this, defaultValue);

        if (defaultValue !== null) {
            for (var propName in defaultValue) {
                if (defaultValue.hasOwnProperty(propName)) {
                    this.getChild(propName).setDefault(defaultValue[propName]);
                }
            }
        }
    };

    /**
     * Validates "schema" attribute value
     *
     * @param {*} schema
     */
    MapType.prototype.validateSchema = function(schema)
    {
        if (
            !schema
            || typeof schema != 'object'
            || !Subclass.Tools.isPlainObject(schema)
        ) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('schema')
                .property(this)
                .received(schema)
                .expected('a plain object with definitions of properties')
                .apply()
            ;
        }
    };

    /**
     * Sets property schema
     *
     * @param {(Function|null)} schema
     */
    MapType.prototype.setSchema = function(schema)
    {
        this.validateSchema(schema);
        this.getData().schema = schema;

        var propertyManager = this.getPropertyManager();

        for (var propName in schema) {
            if (!schema.hasOwnProperty(propName)) {
                continue;
            }
            schema[propName] = propertyManager.normalizeTypeDefinition(
                schema[propName],
                propName
            );

            if (!this.isWritable()) {
                schema[propName].writable = false;
            }
            this.addChild(propName, schema[propName]);
        }
    };

    /**
     * Returns schema function or null
     *
     * @returns {(Function|null)}
     */
    MapType.prototype.getSchema = function()
    {
        return this.getData().schema;
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.getRequiredAttributes = function()
    {
        var attrs = MapType.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['schema']);
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.getBaseData = function()
    {
        var baseData = MapType.$parent.prototype.getBaseData.call(this);

        /**
         * Defines available properties in value
         * @type {null}
         */
        baseData.schema = null;

        /**
         * @inheritDoc
         */
        baseData.default = {};

        return baseData;
    };

    /**
     * Validating property definition
     */
    MapType.prototype.validateData = function()
    {
        MapType.$parent.prototype.validateData.apply(this, arguments);

        var schema = this.getSchema();

        if (schema && Subclass.Tools.isPlainObject(schema)) {
            for (var propName in schema) {
                if (
                    !schema.hasOwnProperty(propName)
                    || !schema[propName].hasOwnProperty('value')
                ) {
                    continue;
                }
                console.warn(
                    'Specified "value" option for definition of ' +
                    'property ' + this + ' was ignored.\n ' +
                    'The value from "default" attribute was applied instead.'
                );
            }
        }
    };



    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(MapType);

    return MapType;

}();

// Source file: src/Type/Map/Map.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Type.Map.Map = function()
{
    function Map()
    {
        // Do nothing
    }

    /**
     * Returns the instance of current property or the instance of its child
     *
     * @param {string} [childName]
     *      The name of child property which you want to get
     *
     * @returns {*}
     */
    Map.prototype.getProperty = function(childName)
    {
        Subclass.Error.create('NotImplementedMethod')
            .className('Subclass.Property.Type.Map.Map')
            .method('getProperty')
            .apply()
        ;
    };

    /**
     * Checks whether the child property with specified name is exists
     *
     * @param {string} childName
     *      The name of child property
     *
     * @returns {boolean}
     */
    Map.prototype.issetProperty = function(childName)
    {
        return this.getChildren().hasOwnProperty(childName);
    };

    /**
     * Returns the type of children context
     *
     * @returns {string}
     */
    Map.prototype.getContextType = function()
    {
        return 'property';
    };

    /**
     * Sort out all child properties using specified callback function
     *
     * @param {function} callback
     *      The callback function which receives three arguments:
     *      - the value of child property
     *      - the name of child property
     *      - the child property
     *
     *      Each call of callback function will be invoked in the Map property context
     */
    Map.prototype.forEach = function(callback)
    {
        var children = this.getChildren();

        for (var childName in children) {
            if (children.hasOwnProperty(childName)) {
                var child = children[childName];

                callback.call(this, child.getValue(), childName, child);
            }
        }
    };

    /**
     * Returns all map property children
     *
     * @returns {Object.<Subclass.Property.Property>}
     */
    Map.prototype.getChildren = function()
    {
        return this.getProperty().getChildren();
    };

    /**
     * Sets map property value
     *
     * @param {*} value
     * @returns {*}
     */
    Map.prototype.setValue = function(value)
    {
        return this.getProperty().setValue(value);
    };

    /**
     * Returns itself
     */
    Map.prototype.getValue = function()
    {
        return this;
    };

    /**
     * Returns data of map property
     *
     * @returns {Object}
     */
    Map.prototype.getData = function()
    {
        return this.getProperty().getData();
    };

    /**
     * @inheritDoc
     */
    Map.prototype.toString = function()
    {
        return this.getData().toString();
    };

    /**
     * @inheritDoc
     */
    Map.prototype.valueOf = function()
    {
        return this.getData();
    };

    return Map;
}();

// Source file: src/Type/Map/MapProperty.js

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Map.MapProperty = function()
{
    /*************************************************/
    /*        Describing property type "Map"         */
    /*************************************************/

    /**
     * @inheritDoc
     */
    function MapProperty()
    {
        MapProperty.$parent.apply(this, arguments);

        /**
         * @type {Object.<Subclass.Property.Property>}
         * @private
         */
        this._children = {};

        var childrenDefinitions = this.getDefinition().getChildren();

        for (var childName in childrenDefinitions) {
            if (childrenDefinitions.hasOwnProperty(childName)) {
                this._children[childName] = childrenDefinitions[childName].createInstance(childName);
            }
        }
    }

    MapProperty.$parent = Subclass.Property.Property;

    /**
     * Sets the children properties
     *
     * @param {Object.<Subclass.Property.Property>} children
     */
    MapProperty.prototype.setChildren = function(children)
    {
        if (Object.isSealed(this)) {
            Subclass.Error.create(
                'The property ' + this.getProperty() + ' is ' +
                'sealed so you can\'t change its children.'
            )
        }
        try {
            if (!children || typeof children != 'object') {
                throw new Error();
            }
            for (var propName in children) {
                if (
                    children.hasOwnProperty(propName)
                    && !(children[propName] instanceof Subclass.Property.Property)
                ) {
                    throw new Error();
                }
            }
        } catch (e) {
            Subclass.Error.create('InvalidArgument')
                .argument('the map children collection', false)
                .expected('an object with instances of class "Subclass.Property.Property"')
                .received(children)
                .apply()
            ;
        }
        this._children = children;
    };

    /**
     * Returns all map child properties
     *
     * @returns {Object.<Subclass.Property.Property>}
     */
    MapProperty.prototype.getChildren = function()
    {
        return this._children;
    };

    /**
     * Returns map child property by its name
     *
     * @param {string} childName
     * @returns {Subclass.Property.Property}
     */
    MapProperty.prototype.getChild = function(childName)
    {
        return this._children[childName];
    };

    /**
     * Returns properties default value
     *
     * @returns {*}
     */
    MapProperty.prototype.getDefaultValue = function()
    {
        if (this.getDefinition().getDefault() === null) {
            return null;
        }
        var children = this.getChildren();
        var defaultValue = {};

        for (var propName in children) {
            if (children.hasOwnProperty(propName)) {
                defaultValue[propName] = children[propName].getDefaultValue();
            }
        }
        return defaultValue;
    };

    /**
     * @inheritDoc
     */
    MapProperty.prototype.setValue = function(value, markAsModified, invokeParentWatchers)
    {
        if (markAsModified !== false) {
            markAsModified = true;
        }
        if (invokeParentWatchers !== false) {
            invokeParentWatchers = true;
        }
        if (this.isLocked()) {
            return console.warn(
                'Trying to set new value for the ' +
                'property ' + this + ' that is locked for write.'
            );
        }
        var childrenContext = this.getValue();
        var valueChanged;
        var parents = [];

        if (markAsModified) {
            var oldValue = this.getData();
            var newValue = value;
            var event = this._createWatcherEvent(newValue, oldValue);

            valueChanged = typeof newValue == 'function' || !Subclass.Tools.isEqual(oldValue, newValue);

            if (invokeParentWatchers) {
                parents = this._getParentWatcherValues(this, newValue);
            }
            if (valueChanged) {
                this.modify();
            }
        }
        this.getDefinition().validateValue(value);

        if (value !== null) {
            if (!childrenContext) {
                this._value = childrenContext = this.createMap();
            }
            for (var childName in value) {
                if (value.hasOwnProperty(childName)) {
                    childrenContext.getProperty(childName).setValue(
                        value[childName],
                        markAsModified,
                        false
                    );
                }
            }
        } else {
            this._value = null;
        }

        // Invoking watchers

        if (valueChanged) {
            this.invokeWatchers(event);

            if (invokeParentWatchers) {
                this._invokeParentWatchers(event, parents);
            }
        }
    };

    /**
     * @inheritDoc
     */
    MapProperty.prototype.resetValue = function(markAsModified)
    {
        if (markAsModified !== false) {
            markAsModified = true;
        }
        if (markAsModified) {
            this.modify();
        }
        var value = this.getDefaultValue();

        if (value !== null) {
            value = this.createMap();
        }

        this._value = value;
    };

    /**
     * Creates the map instance
     */
    MapProperty.prototype.createMap = function()
    {
        var $this = this;

        function Map()
        {
            // Hack for the grunt-contrib-uglify plugin
            return Map.name;
        }

        Map.$parent = Subclass.Property.Type.Map.Map;

        /**
         * @inheritDoc
         */
        Map.prototype.getProperty = function(childName)
        {
            if (!arguments.length) {
                return $this;
            }
            return this.getChildren()[childName];
        };

        // Creating instance of map

        var mapInst = Subclass.Tools.createClassInstance(Map);

        // Attaching map children

        var children = this.getChildren();

        for (var childName in children) {
            if (children.hasOwnProperty(childName)) {
                children[childName].getDefinition().attach(Map.prototype, childName);
                children[childName].setContext(mapInst);
                children[childName].resetValue(false);
            }
        }

        Object.seal(mapInst);

        return mapInst;
    };

    /**
     * Returns data only of property value
     *
     * @returns {Object}
     */
    MapProperty.prototype.getData = function()
    {
        var value = this.getValue();

        if (value === null) {
            return null;
        }
        var children = this.getChildren();
        var data = {};

        for (var childName in children) {
            if (children.hasOwnProperty(childName)) {
                data[childName] = children[childName].getData();
            }
        }
        return data;
    };

    return MapProperty;

}();

// Source file: src/Type/Collection/CollectionType.js

/**
 * @namespace
 */
Subclass.Property.Type.Collection = {};

/**
 * @namespace
 */
Subclass.Property.Type.Collection.ArrayCollection = {};

/**
 * @namespace
 */
Subclass.Property.Type.Collection.ObjectCollection = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Collection.CollectionType = (function()
{
    /*************************************************/
    /*        Describing property type "Map"         */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function CollectionType()
    {
        CollectionType.$parent.apply(this, arguments);

        /**
         * @type {Subclass.Property.PropertyType}
         * @private
         */
        this._protoInst = null;
    }

    CollectionType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    CollectionType.parseRelatedClasses = function(propertyDefinition)
    {
        if (
            !propertyDefinition.proto
            || typeof propertyDefinition.proto != 'object'
            || !propertyDefinition.proto.type
        ) {
            return;
        }
        var propDef = propertyDefinition.proto;
        var propertyType = Subclass.Property.PropertyManager.getPropertyType(propDef.type);

        if (!propertyType.parseRelatedClasses) {
            return;
        }
        return propertyType.parseRelatedClasses(propDef);
    };

    /**
     * @inheritDoc
     */
    CollectionType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    CollectionType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.proto = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];

                if (definition[2] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 4) {
                fullDefinition.writable = definition[3];
            }
            if (definition.length == 5) {
                fullDefinition.nullable = definition[4];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * Returns the property instance of collection item
     *
     * @returns {Subclass.Property.PropertyType}
     */
    CollectionType.prototype.getProtoInstance = function()
    {
        return this._protoInst;
    };

    /**
     * Validates "proto" attribute value
     *
     * @param {*} proto
     */
    CollectionType.prototype.validateProto = function(proto)
    {
        if (!proto || typeof proto != 'object') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('proto')
                .received(proto)
                .property(this)
                .expected('a plain object')
                .apply()
            ;
        }
    };

    /**
     * Sets property proto
     *
     * @param {(Function|null)} proto
     */
    CollectionType.prototype.setProto = function(proto)
    {
        var propertyManager = this.getPropertyManager();
        proto = propertyManager.normalizeTypeDefinition(proto);

        this.validateProto(proto);
        this.getData().proto = proto;
        proto.accessors = false;

        if (!this.isWritable()) {
            proto.writable = false;
        }

        this._protoInst = propertyManager.createProperty(
            'collectionItem',       // property name
            proto,                  // property definition
            this.getContextClass(), // context class
            this                    // context property
        );
    };

    /**
     * Returns proto function or null
     *
     * @returns {(Function|null)}
     */
    CollectionType.prototype.getProto = function()
    {
        return this.getData().proto;
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.getRequiredAttributes = function()
    {
        var attrs = CollectionType.$parent.prototype.getRequiredAttributes.apply(this, arguments);

        return attrs.concat(['proto']);
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.getBaseData = function()
    {
        var baseData = CollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * The definition of property to which every collection element should match.
         * @type {null}
         */
        baseData.proto = null;

        return baseData;
    };

    return CollectionType;

})();

// Source file: src/Type/Collection/Collection.js

/**
 * @class
 */
Subclass.Property.Type.Collection.Collection = function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function Collection(property)
    {
        if (!property || !(property instanceof Subclass.Property.Property)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the property instance', false)
                .received(property)
                .expected('an instance of "Subclass.Property.Property" class')
                .apply()
            ;
        }

        /**
         * Property instance
         *
         * @type {Subclass.Property.Type.Collection.CollectionProperty}
         * @private
         */
        this._property = property;

        /**
         * Instance of items collection manager
         *
         * @type {Object.<Subclass.Property.Type.Collection.CollectionItems>}
         * @private
         */
        this._items = null;

        /**
         * Indicates whether current collection instance can be marked as modified
         *
         * @type {boolean}
         * @private
         */
        this._allowModifying = true;


        // Initializing operations

        this._resetItems();
    }

    /**
     * Returns constructor of collection items class
     *
     * @returns {Subclass.Property.Type.Collection.CollectionItems|*}
     */
    Collection.getCollectionItemsClass = function()
    {
        return Subclass.Property.Type.Collection.CollectionItems;
    };

    /**
     * Resets the collection items creating the new collection items class instance
     *
     * @private
     */
    Collection.prototype._resetItems = function()
    {
        var itemsConstructor = this.constructor.getCollectionItemsClass();
        this._items = Subclass.Tools.createClassInstance(itemsConstructor, this);
    };

    /**
     * Checks whether current items collection is initialized
     *
     * @returns {boolean}
     */
    Collection.prototype.isAllowsModifying = function()
    {
        return this._allowModifying;
    };

    /**
     * Allows for current collection property to be marked as modified
     */
    Collection.prototype.allowModifying = function()
    {
        this._allowModifying = true;
    };

    /**
     * Denies for current collection property to be marked as modified
     */
    Collection.prototype.denyModifying = function()
    {
        this._allowModifying = false;
    };

    /**
     * Validates collection items
     *
     * @throws {Error}
     *      Throws error if specified value is invalid
     *
     * @param {*} items
     * @returns {boolean}
     */
    Collection.prototype._validateItems = function(items)
    {
        if (!Subclass.Tools.isPlainObject(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the items in object collection ' + this._property, false)
                .received(items)
                .expected('a plain object')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Adds new item to collection
     *
     * @param {(string|number)} key
     * @param {*} value
     */
    Collection.prototype.add = function(key, value)
    {
        if (this.isset(key)) {
            console.warn(
                'Trying to add already existent collection item with key "' + key + '" ' +
                'to property ' + this._property + '.'
            );
            return false;
        }
        this._property
            .getDefinition()
            .getProtoInstance()
            .validateValue(value)
        ;
        this._items.attach(key, value);

        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return this._items.get(key);
    };

    /**
     * Adds new items to collection
     *
     * @param {Object} items
     */
    Collection.prototype.addItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.add(key, items[key]);
            }
        }
    };

    /**
     * Sets collection item. If item with specified key already exists, it will be replaced.
     *
     * @param {(string|number)} key
     * @param {*} value
     */
    Collection.prototype.set = function(key, value)
    {
        if (this.isset(key)) {
            this._items.get(key).setValue(value, this.isAllowsModifying());

        } else {
            this._property
                .getDefinition()
                .getProtoInstance()
                .validateValue(value)
            ;
            this._items.attach(key, value);
        }
        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return this._items.get(key);
    };

    /**
     * Sets collection items. If items with specified keys already exist, they will be replaced.
     *
     * @param items
     */
    Collection.prototype.setItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.set(key, items[key]);
            }
        }
    };

    /**
     * Replaces collection items by the new items
     *
     * @param {Object} items
     */
    Collection.prototype.replaceItems = function(items)
    {
        this._validateItems(items);
        this.removeItems();
        this.setItems(items);
    };

    /**
     * Returns collection item with specified key
     *
     * @param {(string|number)} key
     * @returns {*}
     */
    Collection.prototype.get = function(key)
    {
        if (!this.isset(key)) {
            Subclass.Error.create(
                'Trying to get non existent collection item with key "' + key + '" ' +
                'in property ' + this._property + '.'
            );
        }
        return this._items.get(key).getValue();
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    Collection.prototype.remove = function(key)
    {
        var value = this._items.get(key).getData();
        this._items.remove(key);

        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return value;
    };

    /**
     * Removes and returns all items from collection
     *
     * @returns {Object}
     */
    Collection.prototype.removeItems = function()
    {
        var data = this.getData();
        this._resetItems();

        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return data;
    };

    /**
     * Checks if item with specified key is existent.
     *
     * @param {(string|number)} key
     * @returns {boolean}
     */
    Collection.prototype.isset = function(key)
    {
        return this._items.isset(key);
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param {Function} callback
     *      Function that will perform each collection item
     */
    Collection.prototype.forEach = function(callback)
    {
        if (arguments.length == 2 && typeof arguments[1] == 'function') {
            callback = arguments[1];
        }
        if (typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var items = this._items.getItems();

        for (var key in items) {
            if (!items.hasOwnProperty(key)) {
                continue;
            }
            if (callback(items[key].getValue(), key) === false) {
                break;
            }
        }
    };

    /**
     * Searches item in collection by the value or by the result of test function
     *
     * @param {(function|*)} value
     *      If value will passed then searching
     *      will compare specified value with value of every collection item
     *      until match is not successful.
     *
     *      If function will passed then every collection item value will
     *      tests by this testing function until it not returns true.
     *
     * @param {boolean} reverse
     *      If specified the searching item will start from the end of collection
     *
     * @returns {boolean}
     */
    Collection.prototype.indexOf = function(value, reverse)
    {
        var testCallback = typeof value == 'function' ? value : false;
        var key = null;

        if (reverse !== true) {
            reverse = false;
        }

        this.forEach(reverse, function(itemValue, itemKey) {
            if ((
                    testCallback
                    && testCallback(itemValue, itemKey) === true
                ) || (
                    !testCallback
                    && value == itemValue
                )
            ) {
                key = itemKey;
                return false;
            }
        });

        return key;
    };

    /**
     * Filters collection using passed callback function.
     *
     * @param {function} testCallback
     *      The callback function. The first argument is item value.
     *      The second is item key. If this callback function will
     *      return TRUE then current item will put into filter result.
     *
     * @returns {Object}
     */
    Collection.prototype.filter = function(testCallback)
    {
        if (!testCallback || typeof testCallback !== 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the testing callback', false)
                .received(testCallback)
                .expected('a function')
                .apply()
            ;
        }
        var items = {};

        this.forEach(function(itemValue, itemKey) {
            if (testCallback(itemValue, itemKey) === true) {
                items[itemKey] = itemValue;
            }
        });

        return items;
    };

    /**
     * Searches collection items by specified options
     *
     * @param {*} options
     *      It can be a whole value or just a part of value.
     *
     *      For example, if this is collection of strings
     *      then you can specify some string value
     *      which is contained in this collection.
     *
     *      Example:
     *      var result = stringCollection.find('str1');
     *
     *      If this is, for example, collection of map objects
     *      then you can specify a plain object with
     *      allowed by map property keys and its values what you
     *      searching for, something like this:
     *
     *      var result = mapCollection.find({ opt1: val1, opt2: val2 });
     *
     * @returns {Object}
     */
    Collection.prototype.find = function(options)
    {
        var items = this._items;

        return this.filter(function(value, key) {
            if (Subclass.Tools.isPlainObject(options)) {
                for (var optionName in options) {
                    if (
                        !options.hasOwnProperty(optionName)
                        || items.get(key).getData()[optionName] != options[optionName]
                    ) {
                        return false;
                    }
                }
                return true;

            } else if (Subclass.Tools.isEqual(items.get(key).getData(), options)) {
                return true;
            }
            return false;
        });
    };

    /**
     * Returns length of collection
     *
     * @returns {Number}
     */
    Collection.prototype.getLength = function()
    {
        return this._items.getLength();
    };

    /**
     * Returns collection value
     *
     * @returns {Object}
     */
    Collection.prototype.getData = function()
    {
        Subclass.Error.create('NotImplementedMethod')
            .className('Subclass.Property.Type.Collection.Collection')
            .method('getData')
            .apply()
        ;
    };

    /**
     * @inheritDoc
     */
    Collection.prototype.toString = function()
    {
        return this.getData().toString();
    };

    /**
     * @inheritDoc
     */
    Collection.prototype.valueOf = function()
    {
        return this.getData();
    };

    return Collection;

}();

// Source file: src/Type/Collection/CollectionItems.js

/**
 * @class
 * @constructor
 */
Subclass.Property.Type.Collection.CollectionItems = function()
{
    function CollectionItems(collection)
    {
        if (!collection || !(collection instanceof Subclass.Property.Type.Collection.Collection)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the collection instance', false)
                .received(collection)
                .expected('an instance of "Subclass.Property.Type.Collection.Collection"')
                .apply()
            ;
        }

        /**
         * @type {Subclass.Property.Collection.Collection}
         * @private
         */
        this._collection = collection;

        /**
         * @type {Object.<Subclass.Property.Property>}
         * @private
         */
        this._items = {};
    }

    CollectionItems.prototype = {

        /**
         * Returns the instance of current property or the instance of its items
         *
         * @param {string} [itemKey]
         *      The name of item property which you want to get
         *
         * @returns {*}
         */
        getProperty: function (itemKey)
        {
            if (!arguments.length) {
                return this._collection._property;
            }
            return this._items[itemKey];
        },

        /**
         * Checks whether the item property with specified name is exists
         *
         * @param {string} itemKey
         *      The name of child property
         *
         * @returns {boolean}
         */
        issetProperty: function (itemKey)
        {
            return this.getItems().hasOwnProperty(itemKey);
        },

        /**
         * Returns the type of children context
         *
         * @returns {string}
         */
        getContextType: function ()
        {
            return 'property';
        },

        attach: function (key, value)
        {
            var collectionItemProtoInstance = this._collection._property.getDefinition().getProtoInstance();

            this._items[key] = collectionItemProtoInstance.createInstance(key);
            this._items[key].setContext(this);
            this._items[key].resetValue(false);

            if (value !== undefined) {
                this._items[key].setValue(value, false);
            }
        },

        /**
         * Returns all map property children
         *
         * @returns {Object.<Subclass.Property.Property>}
         */
        getItems: function ()
        {
            return this._items;
        },

        /**
         * Returns collection item property
         *
         * @param {(string|number)} key
         * @returns {Subclass.Property.Property}
         */
        get: function(key)
        {
            return this.getProperty(key);
        },

        /**
         * Checks whether collection item with specified key exists
         *
         * @param {(string|number)} key
         * @returns {boolean}
         */
        isset: function(key)
        {
            return this.issetProperty(key);
        },

        /**
         * Removes the collection item
         *
         * @param {string} key
         */
        remove: function(key)
        {
            delete this.getItems()[key];
        },

        /**
         * Removes all collection items
         */
        removeItems: function()
        {
            var items = this.getItems();

            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    this.remove(key);
                }
            }
        },

        /**
         * Returns the count of items in collection
         *
         * @returns {Number}
         */
        getLength: function ()
        {
            return Object.keys(this.getItems()).length;
        }
    };

    return CollectionItems;

}();

// Source file: src/Type/Collection/CollectionProperty.js

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Collection.CollectionProperty = function()
{
    /**
     * @inheritDoc
     * @constructor
     */
    function CollectionProperty()
    {
        CollectionProperty.$parent.apply(this, arguments);
    }

    CollectionProperty.$parent = Subclass.Property.Property;

    /**
     * Returns constructor of collection class which will operate with stored collection elements
     *
     * @returns {Function}
     */
    CollectionProperty.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.Collection;
    };

    CollectionProperty.prototype = {

        /**
         * Returns properties default value
         *
         * @returns {*}
         */
        getDefaultValue: function()
        {
            var defaultValue = this.getDefinition().getDefault();

            if (!Subclass.Tools.isEmpty(defaultValue)) {
                defaultValue = this.createCollection().getData();
            }

            return defaultValue;
        },

        /**
         * @inheritDoc
         */
        setValue: function(value, markAsModified, invokeParentWatchers)
        {
            if (markAsModified !== false) {
                markAsModified = true;
            }
            if (invokeParentWatchers !== false) {
                invokeParentWatchers = true;
            }
            if (this.isLocked()) {
                return console.warn(
                    'Trying to set new value for the ' +
                    'property ' + this + ' that is locked for write.'
                );
            }
            var collection = this.getValue();
            var valueChanged;
            var parents = [];

            if (markAsModified) {
                var oldValue = this.getData();
                var newValue = value;
                var event = this._createWatcherEvent(newValue, oldValue);

                valueChanged = typeof newValue == 'function' || !Subclass.Tools.isEqual(oldValue, newValue);

                if (invokeParentWatchers) {
                    parents = this._getParentWatcherValues(this, newValue);
                }
                if (valueChanged) {
                    this.modify();
                }
            }
            this.getDefinition().validateValue(value);

            if (value !== null) {
                if (!collection) {
                    this._value = collection = this.createCollection();
                }
                if (!markAsModified) {
                    collection.denyModifying();
                }
                collection.replaceItems(value);

                if (!markAsModified) {
                    collection.allowModifying();
                }
            } else {
                this._value = null;
            }

            // Invoking watchers

            if (valueChanged) {
                this.invokeWatchers(event);

                if (invokeParentWatchers) {
                    this._invokeParentWatchers(event, parents);
                }
            }
        },
        /**
         * @inheritDoc
         */
        resetValue: function(markAsModified)
        {
            if (markAsModified !== false) {
                markAsModified = true;
            }
            var value = this.getDefaultValue();

            if (value !== null) {
                value = this.createCollection();
            }
            if (markAsModified) {
                this.modify();
            }

            this._value = value;
        },

        /**
         * Creates the collection instance
         */
        createCollection: function()
        {
            var collectionConstructor = this.constructor.getCollectionClass();
            var collection = Subclass.Tools.createClassInstance(collectionConstructor, this);

            // Initializing collection

            this.initializeCollection(collection);
            Object.seal(collection);

            return collection;
        },

        /**
         * Initializes the instance of collection
         *
         * @param collection
         */
        initializeCollection: function(collection)
        {
            var propertyDefinition = this.getDefinition();
            var defaultValue = propertyDefinition.getDefault();

            // Setting default value

            collection.denyModifying();

            if (defaultValue !== null) {
                collection.addItems(defaultValue);
            }

            collection.allowModifying();

            Object.defineProperty(collection, 'length', {
                enumerable: false,
                set: function() {},
                get: function() {
                    return collection.getLength();
                }
            });
        },

        /**
         * @inheritDoc
         */
        getData: function()
        {
            var value = this.getValue();

            if (value !== null) {
                return value.getData();
            }
            return null;
        }
    };

    return CollectionProperty;
}();

// Source file: src/Type/Collection/ArrayCollection/ArrayCollection.js

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.Collection}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection = (function()
{
    /**
     * @inheritDoc
     */
    function ArrayCollection()
    {
        ArrayCollection.$parent.apply(this, arguments);
    }

    ArrayCollection.$parent = Subclass.Property.Type.Collection.Collection;

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype._validateItems = function(items)
    {
        if (!Array.isArray(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the collection items for property ' + this._property, false)
                .received(items)
                .expected('an array')
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     * @param {Array} items
     */
    ArrayCollection.prototype.addItems = function(items)
    {
        if (!Array.isArray(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the items for array collection in property ' + this._property, false)
                .received(items)
                .expected('an array')
                .apply()
            ;
        }
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.add(items[key]);
            }
        }
    };

    /**
     * @inheritDoc
     * @param {*} value
     */
    ArrayCollection.prototype.add = function(value)
    {
        if (arguments.length == 2) {
            value = arguments[1];
        }
        if (arguments.length) {
            this._property
                .getDefinition()
                .getProtoInstance()
                .validateValue(value)
            ;
        }
        var key = String(this.getLength());
        this._items.attach(key, value);

        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return this._items.get(key);
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.setItems = function(items)
    {
        if (!Array.isArray(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the items for array collection in property ' + this._property, false)
                .received(items)
                .expected('an array')
                .apply()
            ;
        }
        for (var i = 0; i < items.length; i++) {
            if (this.isset(i)) {
                this.set(i, items[i]);
            } else {
                this.add(items[i]);
            }
        }
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.set = function(key, value)
    {
        key = parseInt(key);

        if (isNaN(key)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the index of array collection item', false)
                .received(key)
                .expected('a number')
                .apply()
            ;
        }
        if (this.length < key) {
            for (var i = this.length; i < key; i++) {
                this.add();
            }
        }
        return ArrayCollection.$parent.prototype.set.call(
            this, String(key), value
        );
    };

    /**
     * @inheritDoc
     *
     * @param {number} index
     */
    ArrayCollection.prototype.get = function(index)
    {
        if (!this.isset(index)) {
            Subclass.Error.create(
                'Trying to get non existent array element with index "' + index + '" ' +
                'in property ' + this._property + '.'
            );
        }
        return this._items.get(index).getValue();
    };

    /**
     * Removes collection items
     *
     * @param {number} [indexStart]
     *      The index of collection item from which (including it)
     *      the other collection items further will be removed
     *
     * @param {number} [length]
     *      The length of collection items which will be removed
     *      from the indexStart (including collection item with start index)
     */
    ArrayCollection.prototype.removeItems = function(indexStart, length)
    {
        if (!arguments.length) {
            return ArrayCollection.$parent.prototype.removeItems.call(this);
        }
        if (!this.isset(indexStart)) {
            return;
        }
        if (arguments.length == 1) {
            length = this.length;
        }
        if (length < 0) {
            Subclass.Error.create('InvalidArgument')
                .argument('the length of items to remove', false)
                .expected('a positive number')
                .received(length)
                .apply()
            ;
        }
        var indexEnd = indexStart + length - 1;
        var i;

        if (indexEnd >= this.length - 1) {
            for (i = this.length - 1; i >= indexStart; i--) {
                this.remove(i);
            }
        } else {
            for (i = 0; i < length; i++) {
                this.remove(indexStart);
            }
        }
        if (this.isAllowsModifying()) {
            this._property.modify();
        }
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    ArrayCollection.prototype.remove = function(key)
    {
        key = parseInt(key);

        var items = this._items.getItems();
        var length = this.length;
        var $this = this;
        var value = false;

        this.forEach(function(itemValue, itemIndex) {
            if (itemIndex == key) {
                value = ArrayCollection.$parent.prototype.remove.call($this, key);

            } else if (itemIndex > key) {
                var newKey = String(itemIndex - 1);
                var itemProperty = $this._items.get(itemIndex);

                itemProperty.rename(newKey);
                items[newKey] = itemProperty;
            }
        });

        if (this.length == length) {
            this.pop();
        }
        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return value;
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.isset = function(key)
    {
        if (isNaN(parseInt(key))) {
            Subclass.Error.create('InvalidArgument')
                .argument('the index of array collection item', false)
                .received(key)
                .expected('a number')
                .apply()
            ;
        }
        return this._items.isset(String(key));
    };

    /**
     * @alias Subclass.Property.Type.Collection.ArrayCollection#add
     */
    ArrayCollection.prototype.push = ArrayCollection.prototype.add;

    /**
     * Removes from array and returns the last item in collection
     *
     * @returns {(*|null)}
     */
    ArrayCollection.prototype.pop = function()
    {
        var length = this.length;

        if (!length) {
            return null;
        }
        return this.remove(length - 1);
    };

    /**
     * Removes from array and returns the first item in collection
     *
     * @returns {(*|null)}
     */
    ArrayCollection.prototype.shift = function()
    {
        var length = this.length;

        if (!length) {
            return null;
        }
        return this.remove(0);
    };

    /**
     * Adds new item to the start of array
     */
    ArrayCollection.prototype.unshift = function(value)
    {
        var items = this._items.getItems();
        var $this = this;

        this.forEach(true, function(itemValue, itemIndex) {
            var newKey = String(itemIndex + 1);
            var itemProperty = $this._items.get(itemIndex);

            itemProperty.rename(newKey);
            items[newKey] = itemProperty;
        });

        delete $this._items.remove(0);
        this.set(0, value);
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.indexOf = function(value, reverse)
    {
        var key = ArrayCollection.$parent.prototype.indexOf.call(this, value, reverse);

        if (key === null) {
            return -1;
        }
        return parseInt(key);
    };

    /**
     * Searches item from the end of collection
     *
     * @param {*} value
     * @returns {(number|boolean)}
     */
    ArrayCollection.prototype.lastIndexOf = function(value)
    {
        return this.indexOf(value, true);
    };

    /**
     * Joins the elements of array collection into a string
     *
     * @param {string} separator
     * @returns {(*|string)}
     */
    ArrayCollection.prototype.join = function(separator)
    {
        var items = this.getData();

        return items.join.apply(items, arguments);
    };

    /**
     * Swaps collection items
     *
     * @param {number} index1
     * @param {number} index2
     */
    ArrayCollection.prototype.swap = function(index1, index2)
    {
        var items = this._items.getItems();
        var extraIndex = this.getLength();

        // Renaming item with index1 to extraIndex

        var itemProperty1 = this._items.get(index1);
        itemProperty1.rename(String(extraIndex));
        items[extraIndex] = itemProperty1;

        // Renaming item with index2 to index1

        var itemProperty2 = this._items.get(index2);
        itemProperty2.rename(String(index1));
        items[index1] = itemProperty2;

        // Renaming item with extraIndex to index2

        var itemPropertyExtra = this._items.get(extraIndex);
        itemPropertyExtra.rename(String(index2));
        items[index2] = itemPropertyExtra;

        // Removing collection item with extraIndex

        this.remove.call(this, extraIndex);
    };

    /**
     * Changes the order of array collection items to opposite
     */
    ArrayCollection.prototype.reverse = function()
    {
        var length = this.getLength();
        var lengthHalf = Math.ceil(length / 2);
        var $this = this;

        this.forEach(function(itemValue, itemIndex) {
            if (itemIndex >= lengthHalf) {
                return false;
            }
            var oppositeIndex = length - itemIndex - 1;
            $this.swap(itemIndex, oppositeIndex);
        });
    };

    /**
     * Sorts items
     *
     * @param {Function} compareFn
     */
    ArrayCollection.prototype.sort = function(compareFn)
    {
        var items = [];
        var itemsOrder = [];
        var orderedIndexes = [];

        this.forEach(function(item, index) {
            items[index] = item;
            itemsOrder[index] = item;
        });

        items.sort.apply(items, arguments);

        for (var i = 0; i < items.length; i++) {
            var newIndex = i;
            var oldIndex = itemsOrder.indexOf(items[i]);

            if (
                orderedIndexes.indexOf(newIndex) >= 0
                || orderedIndexes.indexOf(oldIndex) >= 0
            ) {
                continue;
            }
            orderedIndexes.push(newIndex);
            orderedIndexes.push(oldIndex);
            this.swap(newIndex, oldIndex);
        }
    };

    /**
     * Selects a part of an array, and returns the new array with selected items
     *
     * @param {number} start
     * @param {number} end
     * @returns {Array}
     */
    ArrayCollection.prototype.slice = function(start, end)
    {
        var items = [];

        this.forEach(function(item, index) {
            items[index] = item;
        });

        return items.slice.apply(items, arguments);
    };

    /**
    * Filters collection using passed callback function
    *
    * @param testCallback
    * @returns {(Array|Object)}
    */
    ArrayCollection.prototype.filter = function(testCallback)
    {
        if (!testCallback || typeof testCallback !== 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the testing callback', false)
                .received(testCallback)
                .expected('a function')
                .apply()
            ;
        }
        var items = [];

        this.forEach(function(itemValue, itemKey) {
            if (testCallback(itemValue, itemKey) === true) {
                items.push(itemValue);
            }
        });

        return items;
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param {boolean} [reverse]
     * @param {Function} callback
     */
    ArrayCollection.prototype.forEach = function(reverse, callback)
    {
        if (typeof reverse == 'function') {
            callback = reverse;
        }
        if (typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        if (reverse !== true) {
            reverse = false;
        }

        var keys = Object.keys(this._items.getItems());
        var $this = this;
        keys.sort();

        if (reverse) {
            keys.reverse();
        }

        keys.every(function(key) {
            if (callback($this._items.get(key).getValue(), parseInt(key)) === false) {
                return false;
            }
            return true;
        });
    };

    ArrayCollection.prototype.getData = function()
    {
        var collectionItems = [];
        var $this = this;

        this.forEach(function(value, key) {
            collectionItems[key] = $this._items.get(key).getData();
        });

        return collectionItems;
    };

    return ArrayCollection;

})();

// Source file: src/Type/Collection/ArrayCollection/ArrayCollectionProperty.js

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionProperty}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionProperty = function()
{
    /**
     * @inheritDoc
     */
    function ArrayCollectionProperty()
    {
        ArrayCollectionProperty.$parent.apply(this, arguments);
    }

    ArrayCollectionProperty.$parent = Subclass.Property.Type.Collection.CollectionProperty;

    /**
     * @inheritDoc
     */
    ArrayCollectionProperty.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection;
    };

    return ArrayCollectionProperty;
}();

// Source file: src/Type/Collection/ArrayCollection/ArrayCollectionType.js

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionType = (function()
{
    /*************************************************/
    /*   Describing property type "ArrayCollection"  */
    /*************************************************/

    /**
     * @inheritDoc
     */
    function ArrayCollectionType()
    {
        ArrayCollectionType.$parent.apply(this, arguments);
    }

    ArrayCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.getName = function()
    {
        return "arrayCollection";
    };

    ArrayCollectionType.getPropertyClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionProperty;
    };

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ArrayCollectionType.prototype.validateValue = function(value)
    {
        ArrayCollectionType.$parent.prototype.validateValue.apply(this, arguments);

        if (value === null) {
            return;
        }

        if (!value || typeof value != 'object' || !Array.isArray(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('an array')
                .apply()
            ;
        }
    };

    ArrayCollectionType.prototype.validateDefault = ArrayCollectionType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getBaseData = function()
    {
        var baseData = ArrayCollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = [];

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ArrayCollectionType);

    return ArrayCollectionType;

})();

// Source file: src/Type/Collection/ObjectCollection/ObjectCollection.js

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.Collection}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection = (function()
{
    /**
     * @inheritDoc
     */
    function ObjectCollection()
    {
        ObjectCollection.$parent.apply(this, arguments);
    }

    ObjectCollection.$parent = Subclass.Property.Type.Collection.Collection;

    /**
     * @inheritDoc
     *
     * @param {string} key
     * @param {*} value
     * @param {boolean} normalize
     */
    ObjectCollection.prototype.add = function(key, value, normalize)
    {
        var result;

        if (!key || typeof key != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the key of object collection item', false)
                .expected('a string')
                .received(key)
                .apply()
            ;
        }
        if (arguments.length < 2) {
            Subclass.Error.create(
                'Method Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection#add ' +
                'requires at least two arguments.'
            );
        }
        if ((result = ObjectCollection.$parent.prototype.add.apply(this, arguments)) === false) {
            return false;
        }
        if (normalize !== false) {
            this.normalize(key);
        }

        return result;
    };

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.addItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.add(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * @inheritDoc
     *
     * @param {string} key
     * @param {*} value
     * @param {boolean} normalize
     */
    ObjectCollection.prototype.set = function(key, value, normalize)
    {
        if (ObjectCollection.$parent.prototype.set.apply(this, arguments) === false) {
            return false;
        }
        if (normalize !== false) {
            this.normalize(key);
        }
        return this._items.get(key);
    };

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.setItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.set(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * Normalizes collection elements
     */
    ObjectCollection.prototype.normalizeItems = function()
    {
        var $this = this;

        this.forEach(function(itemValue, itemKey) {
            $this.normalize(itemKey);
        });
    };

    /**
     * Normalizes specified collection item
     *
     * @param itemName
     * @returns {*}
     */
    ObjectCollection.prototype.normalize = function(itemName)
    {
        var itemData = this._items.get(itemName).getData();

        if (
            this._property.getDefinition().getProto().type != 'map'
            || !itemData.extends
        ) {
            return itemData;
        }
        if (!this.isset(itemData.extends)) {
            Subclass.Error.create(
                'Trying to extend object collection element "' + itemName + '" ' +
                'by non existent another collection element with key "' + itemData.extends + '".'
            );
        }
        var parentItem = Subclass.Tools.copy(this.normalize(itemData.extends));
        delete itemData.extends;

        function prepareItemData(itemProperty, itemData)
        {
            if (itemProperty.getType() == 'map') {
                var children = itemProperty.getChildren();

                for (var childName in children) {
                    if (!children.hasOwnProperty(childName)) {
                        continue;
                    }
                    if (!children[childName].isDefaultValue()) {
                        prepareItemData(children[childName], itemData[childName]);

                    } else {
                        delete itemData[childName];
                    }
                }
            }
        }

        for (var propName in itemData) {
            if (!itemData.hasOwnProperty(propName)) {
                continue;
            }
            var itemChild = this._items.get(itemName).getChild(propName);

            if (itemChild.isDefaultValue()) {
                delete itemData[propName];
            } else {
                prepareItemData(itemChild, itemData[propName]);
            }
        }

        itemData = Subclass.Tools.extendDeep(parentItem, itemData);
        this.set(itemName, itemData);

        return itemData;
    };

    /**
     * Returns all collection items keys
     *
     * @returns {string[]}
     */
    ObjectCollection.prototype.keys = function()
    {
        return Object.keys(this._items.getItems());
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param {Function} callback
     *      Function that will perform each collection item
     */
    ObjectCollection.prototype.forEach = function(callback)
    {
        if (this._property.getDefinition().getProto().type != 'map') {
            return ObjectCollection.$parent.prototype.forEach.apply(this, arguments);
        }
        if (arguments.length == 2 && typeof arguments[1] == 'function') {
            callback = arguments[1];
        }
        if (typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var items = this._items.getItems();
        var priorities = [];
        var $this = this;

        for (var itemName in items) {
            if (items.hasOwnProperty(itemName)) {
                var itemProperty = items[itemName];
                priorities.push(itemProperty.getValue().priority);
            }
        }

        priorities = priorities.sort(function(a, b) {
            a = parseInt(a);
            b = parseInt(b);

            if (a > b) return -1;
            if (a < b) return 1;

            return 0;
        });

        for (var i = 0; i < priorities.length; i++) {
            for (itemName in items) {
                if (!items.hasOwnProperty(itemName)) {
                    continue;
                }
                itemProperty = items[itemName];
                var itemValue = itemProperty.getValue();

                if (itemValue.priority == priorities[i]) {
                    if (callback.call($this, itemValue, itemName) === false) {
                        return false;
                    }
                }
            }
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.getData = function()
    {
        var collectionItems = {};
        var $this = this;

        this.forEach(function(itemValue, itemName) {
            collectionItems[itemName] = $this._items.get(itemName).getData();
        });

        return collectionItems;
    };

    return ObjectCollection;

})();

// Source file: src/Type/Collection/ObjectCollection/ObjectCollectionProperty.js

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionProperty}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionProperty = function()
{
    /**
     * @inheritDoc
     */
    function ObjectCollectionProperty()
    {
        ObjectCollectionProperty.$parent.apply(this, arguments);
    }

    ObjectCollectionProperty.$parent = Subclass.Property.Type.Collection.CollectionProperty;

    /**
     * @inheritDoc
     */
    ObjectCollectionProperty.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection;
    };

    return ObjectCollectionProperty;
}();

// Source file: src/Type/Collection/ObjectCollection/ObjectCollectionType.js

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionType = (function()
{
    /*************************************************/
    /*   Describing property type "ObjectCollection" */
    /*************************************************/

    /**
     * @inheritDoc
     */
    function ObjectCollectionType()
    {
        ObjectCollectionType.$parent.apply(this, arguments);
    }

    ObjectCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

    /**
     * @inheritDoc
     */
    ObjectCollectionType.getName = function()
    {
        return "objectCollection";
    };

    ObjectCollectionType.getPropertyClass = function()
    {
        return Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionProperty;
    };

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ObjectCollectionType.prototype.validateValue = function(value)
    {
        ObjectCollectionType.$parent.prototype.validateValue.apply(this, arguments);

        if (value === null) {
            return;
        }
        if (!value || typeof value != 'object' || !Subclass.Tools.isPlainObject(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('a plain object')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.validateDefault = ObjectCollectionType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getBaseData = function()
    {
        var baseData = ObjectCollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = {};

        return baseData;
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.processData = function()
    {
        var propertyManager = this.getPropertyManager();
        var proto = propertyManager.normalizeTypeDefinition(this.getProto());

        // Adding "extends" parameter to property "schema"
        // parameter if proto type is "map"

        if (proto.type == 'map') {
            if (!proto.schema) {
                proto.schema = {};
            }
            if (!proto.schema.extends) {
                proto.schema.extends = {
                    type: "string",
                    nullable: true
                };
            }
            if (!proto.schema.priority) {
                proto.schema.priority = {
                    type: "number"
                };
            }
        }
        ObjectCollectionType.$parent.prototype.processData.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ObjectCollectionType);

    return ObjectCollectionType;

})();

// Source file: src/Type/Array/ArrayType.js

/**
 * @namespace
 */
Subclass.Property.Type.Array = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Array.ArrayType = (function()
{
    /**
     * @inheritDoc
     */
    function ArrayType()
    {
        ArrayType.$parent.apply(this, arguments);
    }

    ArrayType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ArrayType.getName = function()
    {
        return "array";
    };

    /**
     * @inheritDoc
     */
    ArrayType.prototype.validateValue = function(value)
    {
        ArrayType.$parent.prototype.validateValue.call(this, value);

        if (value && !Array.isArray(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected("an array")
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    ArrayType.prototype.validateDefault = ArrayType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ArrayType.prototype.getBaseData = function()
    {
        var baseData = ArrayType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = [];

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ArrayType);

    return ArrayType;

})();

// Source file: src/Type/Boolean/BooleanType.js

/**
 * @namespace
 */
Subclass.Property.Type.Boolean = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Boolean.BooleanType = (function()
{
    /**
     * @inheritDoc
     */
    function BooleanType()
    {
        BooleanType.$parent.apply(this, arguments);
    }

    BooleanType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    BooleanType.getName = function()
    {
        return "boolean";
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.getBaseData = function()
    {
        var baseData = BooleanType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.nullable = false;

        /**
         * @inheritDoc
         */
        baseData.default = false;

        return baseData;
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.validateValue = function(value)
    {
        BooleanType.$parent.prototype.validateValue.call(this, value);

        if (value && typeof value != 'boolean') {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected("a boolean")
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.validateDefault = BooleanType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    BooleanType.prototype.attach = function(context)
    {
        BooleanType.$parent.prototype.attach.apply(this, arguments);

        if (this.isAccessors()) {
            var propertyName = this.getName();
            var getterName = Subclass.Tools.generateGetterName(propertyName);
            var checkerName = Subclass.Tools.generateCheckerName(propertyName);

            context[checkerName] = context[getterName];
        }
    };

    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(BooleanType);

    return BooleanType;

})();

// Source file: src/Type/Class/ClassType.js

/**
 * @namespace
 */
Subclass.Property.Type.Class = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Class.ClassType = (function()
{
    /**
     * @inheritDoc
     */
    function ClassType()
    {
        ClassType.$parent.apply(this, arguments);
    }

    ClassType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ClassType.getName = function()
    {
        return "class";
    };

    /**
     * @inheritDoc
     */
    ClassType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ClassType.parseRelatedClasses = function(propertyDefinition)
    {
        if (!propertyDefinition.className) {
            return;
        }
        return [propertyDefinition.className];
    };

    /**
     * @inheritDoc
     */
    ClassType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 4) {
            var fullDefinition = {};

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.className = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];
            }
            if (definition.length == 4) {
                fullDefinition.writable = definition[3];
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.validateValue = function(value)
    {
        ClassType.$parent.prototype.validateValue.call(this, value);

        var neededClassName = this.getClassName();

        if (
            (!value && value !== null)
            || typeof value != 'object'
            || (
                value
                && typeof value == 'object'
                && (
                    !value.$_className
                    || !value.isInstanceOf(neededClassName)
                )
            )
        ) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('an instance of class "' + neededClassName + '" or null')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.validateDefault = ClassType.prototype.validateValue;

    /**
     * Validates "className" attribute value
     *
     * @param {*} className
     */
    ClassType.prototype.validateClassName = function(className)
    {
        if (typeof className != 'string') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('className')
                .received(className)
                .property(this)
                .expected('a string')
                .apply()
            ;
        }
        var classManager = this.getPropertyManager().getModule().getClassManager();

        if (!classManager.isset(className)) {
            Subclass.Error.create(
                'Specified non existent class in "' + className + '" attribute ' +
                'in definition of property ' + property + '.'
            );
        }
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ClassType.prototype.setNullable = function(nullable)
    {
        this.validateNullable(nullable);

        if (typeof nullable == 'boolean' && !nullable) {
            Subclass.Error.create(
                'The "class" property ' + this + ' ' +
                'can\'t be not nullable.'
            );
        }
    };

    /**
     * Set marker if current property is writable
     *
     * @param {string} className
     */
    ClassType.prototype.setClassName = function(className)
    {
        this.validateClassName(className);
        this.getData().className = className;
    };

    /**
     * Returns "className" attribute value
     *
     * @returns {string}
     */
    ClassType.prototype.getClassName = function()
    {
        return this.getData().className;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getRequiredOptions = function()
    {
        var attrs = ClassType.$parent.prototype.getRequiredOptions.call(this);

        return attrs.concat(['className']);
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getBaseData = function()
    {
        var baseData = ClassType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * Allows to specify name of class which value must implement.
         *
         * @type {String}
         */
        baseData.className = null;

        /**
         * @inheritDoc
         */
        baseData.default = null;

        return baseData;
    };

    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ClassType);

    return ClassType;

})();

// Source file: src/Type/Constructor/ConstructorType.js

/**
 * @namespace
 */
Subclass.Property.Type.Constructor = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Constructor.ConstructorType = function()
{
    /**
     * @inheritDoc
     */
    function ConstructorType()
    {
        ConstructorType.$parent.apply(this, arguments);
    }

    ConstructorType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ConstructorType.getName = function()
    {
        return "constructor";
    };

    /**
     * @inheritDoc
     */
    ConstructorType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    ConstructorType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.construct = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];

                if (definition[2] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 4) {
                fullDefinition.writable = definition[3];
            }
            if (definition.length == 5) {
                fullDefinition.nullable = definition[4];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };

    ConstructorType.prototype = {

        /**
         * @inheritDoc
         * @throws {Error}
         */
        setNullable: function(nullable)
        {
            this.validateNullable(nullable);

            if (typeof nullable == 'boolean' && !nullable) {
                Subclass.Error.create(
                    'The "constructor" type property ' + this + ' should be always nullable.'
                );
            }
        },

        /**
         * @inheritDoc
         */
        validateValue: function (value)
        {
            ConstructorType.$parent.prototype.validateValue.call(this, value);

            var constructor = this.getConstruct();

            if (
                value !== null
                && (
                    typeof value != 'object'
                    || !(value instanceof constructor)
                )
            ) {
                Subclass.Error.create('InvalidPropertyValue')
                    .property(this)
                    .received(value)
                    .expected("an object which is instance of constructor function " + constructor.name)
                    .apply()
                ;
            }
            return true;
        },

        /**
         * Validates "construct" option value
         *
         * @param {*} constructor
         */
        validateConstruct: function(constructor)
        {
            if (typeof constructor != 'function') {
                Subclass.Error.create('InvalidPropertyOption')
                    .option('construct')
                    .property(this)
                    .received(constructor)
                    .expected('a constructor function which prototype the object value should inherit')
                    .apply()
                ;
            }
        },

        /**
         * Sets "construct" option
         *
         * @param {Function} constructor
         */
        setConstruct: function(constructor)
        {
            this.validateConstruct(constructor);
            this.getData().construct = constructor;
        },

        /**
         * Returns value of "construct" option
         *
         * @returns {Function}
         */
        getConstruct: function()
        {
            return this.getData().construct;
        },

        /**
         * @inheritDoc
         */
        getRequiredOptions: function()
        {
            var attrs = ConstructorType.$parent.prototype.getRequiredOptions.call(this);

            return attrs.concat(['construct']);
        },

        /**
         * @inheritDoc
         */
        getBaseData: function()
        {
            var baseData = ConstructorType.$parent.prototype.getBaseData.apply(this, arguments);

            /**
             * Is used to specify the constructor of object instances which current property should store.
             *
             * Every value you want to set to this value should satisfy the condition:
             * {yourObject} instanceof {constructorFunction}
             *
             * @type {Function}
             */
            baseData.construct = null;

            /**
             * @inheritDoc
             */
            baseData.default = null;

            return baseData;
        }
    };

    /**
     * @inheritDoc
     */
    ConstructorType.prototype.validateDefault = ConstructorType.prototype.validateValue;


    /*************************************************/
    /*           Registering new data type           */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ConstructorType);

    return ConstructorType;

}();

// Source file: src/Type/Enum/EnumType.js

/**
 * @namespace
 */
Subclass.Property.Type.Enum = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Enum.EnumType = function()
{
    /**
     * @inheritDoc
     */
    function EnumType()
    {
        EnumType.$parent.apply(this, arguments);
    }

    EnumType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    EnumType.getName = function()
    {
        return "enum";
    };

    /**
     * @inheritDoc
     */
    EnumType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    EnumType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 4) {
            var fullDefinition = {};

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.allows = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];
            }
            if (definition.length == 4) {
                fullDefinition.writable = definition[3];
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.getEmptyValue = function()
    {
        return this.getAllows()[0];
    };
    //
    ///**
    // * @inheritDoc
    // * @throws {Error}
    // */
    //EnumType.prototype.setNullable = function(nullable)
    //{
    //    this.validateNullable(nullable);
    //
    //    if (typeof nullable == 'boolean' && nullable) {
    //        Subclass.Error.create(
    //            'The "enum" type property ' + this + ' can\'t be nullable.'
    //        );
    //    }
    //};

    /**
     * @inheritDoc
     */
    EnumType.prototype.validateValue = function(value)
    {
        EnumType.$parent.prototype.validateValue.apply(this, arguments);

        if (value === null) {
            return true;
        }
        var allows = this.getAllows();

        if (allows.indexOf(value) < 0) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('one of the specified values [' + allows.join(", ") + ']')
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.validateDefault = EnumType.prototype.validateValue;

    /**
     * Validates "allows" attribute value
     *
     * @param {*} allows
     */
    EnumType.prototype.validateAllows = function(allows)
    {
        if (!allows || !Array.isArray(allows) || !allows.length) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('allows')
                .property(this)
                .received(allows)
                .expected('a not empty array with items of a certain types: "string", "number", "boolean" or null.')
                .apply()
            ;
        }

        var allowedTypes = ['string', 'number', 'boolean'];

        for (var i = 0; i < allows.length; i++) {
            if (allowedTypes.indexOf(typeof allows[i]) < 0 && allows[i] !== null) {
                Subclass.Error.create(
                    'Specified not valid values in "allows" parameter in definition ' +
                    'of property ' + this + '. ' +
                    'Allowed types are: ' + allowedTypes.join(", ") + '" or null.'
                );
            }
        }
    };

    /**
     * Sets "allows" attribute of property definition
     *
     * @param {Array} allows
     */
    EnumType.prototype.setAllows = function(allows)
    {
        this.validateAllows(allows);
        this.getData().allows = allows;
    };

    /**
     * Returns value of "allows" attribute of property definition
     *
     * @returns {Array}
     */
    EnumType.prototype.getAllows = function()
    {
        return this.getData().allows;
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.getRequiredOptions = function()
    {
        var attrs = EnumType.$parent.prototype.getRequiredOptions.call(this);

        return attrs.concat(['allows']);
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.getBaseData = function()
    {
        var data = EnumType.$parent.prototype.getBaseData.call(this);

        /**
         * Allows to specify allowed property values.
         * Every value in array must belongs to one of the types: "number", "string", "boolean"
         *
         * @type {Array}
         */
        data.allows = null;

        return data;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(EnumType);

    return EnumType;

}();

// Source file: src/Type/Function/FunctionType.js

/**
 * @namespace
 */
Subclass.Property.Type.Function = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Function.FunctionType = (function()
{
    /**
     * @inheritDoc
     */
    function FunctionType()
    {
        FunctionType.$parent.apply(this, arguments);
    }

    FunctionType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    FunctionType.getName = function()
    {
        return "function";
    };

    /**
     * @inheritDoc
     */
    FunctionType.prototype.validateValue = function(value)
    {
        FunctionType.$parent.prototype.validateValue.apply(this, arguments);

        if (value && typeof value != 'function') {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected("a function")
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    FunctionType.prototype.validateDefault = FunctionType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    FunctionType.prototype.getBaseData = function()
    {
        var baseData = FunctionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData['default'] = function() {};

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(FunctionType);

    return FunctionType;

})();

// Source file: src/Type/Mixed/MixedType.js

/**
 * @namespace
 */
Subclass.Property.Type.Mixed = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Mixed.MixedType = (function()
{
    /**
     * @inheritDoc
     */
    function MixedType()
    {
        MixedType.$parent.apply(this, arguments);

        /**
         * Array of data types
         * @type {Array}
         * @private
         */
        this._allowedTypes = [];
    }

    MixedType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    MixedType.getName = function()
    {
        return "mixed";
    };

    /**
     * @inheritDoc
     */
    MixedType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    MixedType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.allows = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];

                if (definition[2] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 4) {
                fullDefinition.writable = definition[3];
            }
            if (definition.length == 5) {
                fullDefinition.nullable = definition[4];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * Returns property instances according to allows parameter of property definition.
     *
     * @returns {PropertyType[]}
     */
    MixedType.prototype.getAllowedTypes = function()
    {
        return this._allowedTypes;
    };

    /**
     * Adds new allowed type that property can holds
     *
     * @param typeDefinition
     */
    MixedType.prototype.addAllowedType = function(typeDefinition)
    {
        typeDefinition.defaultless = true;

        this._allowedTypes.push(this.getPropertyManager().createProperty(
            "mixedProperty",
            typeDefinition,
            this.getContextClass(),
            this
        ));
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.validateValue = function(value)
    {
        MixedType.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return true;
        }

        var allowedTypes = this.getAllowedTypes();
        var error = true;

        for (var i = 0; i < allowedTypes.length; i++) {
            var allowedType = allowedTypes[i];

            try {
                allowedType.validateValue(value);
                error = false;
                break;

            } catch (e) {
                // Do nothing
            }
        }

        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('one of the specified types: "' + this.getAllowsNames().join('", "') + '"')
                .apply()
            ;
        }

        return true;
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.validateDefault = MixedType.prototype.validateValue;

    /**
    * @inheritDoc
    */
    MixedType.prototype.setDefault = function(defaultValue)
    {
        if (!this.isNullable() && defaultValue === null) {
            var allows = this.getAllows();
            var propType = this.getPropertyManager().createProperty('mixedPropertyType', allows[0]);

            defaultValue = propType.getDefault();
        }
        return MixedType.$parent.prototype.setDefault.call(this, defaultValue);
    };

    /**
     * Validates "allows" attribute value
     *
     * @param {*} allows
     */
    MixedType.prototype.validateAllows = function(allows)
    {
        if (!allows || !Array.isArray(allows) || !allows.length) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('allows')
                .property(this)
                .received(allows)
                .expected('a not empty array with definitions of needed property types')
                .apply()
            ;
        }
        for (var i = 0; i < allows.length; i++) {
            if (!Subclass.Tools.isPlainObject(allows[i])) {
                Subclass.Error.create(
                    'Specified not valid values in "allows" option in definition ' +
                    'of property ' + this + '. ' +
                    'It must be property definitions.'
                );
            }
        }
    };

    MixedType.prototype.normalizeAllows = function(allows)
    {
        var propertyManager = this.getPropertyManager();

        if (allows && Array.isArray(allows)) {
            for (var i = 0; i < allows.length; i++) {
                allows[i] = propertyManager.normalizeTypeDefinition(allows[i]);
            }
        }
        return allows;
    };

    /**
     * Sets "allows" attribute of property definition
     *
     * @param {Array} allows
     */
    MixedType.prototype.setAllows = function(allows)
    {
        allows = this.normalizeAllows(allows);

        this.validateAllows(allows);
        this.getData().allows = allows;
    };

    /**
     * Returns value of "allows" attribute of property definition
     *
     * @returns {Array}
     */
    MixedType.prototype.getAllows = function()
    {
        return this.getData().allows;
    };

    /**
     * Returns all allowed value types according to allows parameter of property definition.
     *
     * @returns {string[]}
     */
    MixedType.prototype.getAllowsNames = function()
    {
        var allows = this.getAllows();
        var typeNames = [];

        for (var i = 0; i < allows.length; i++) {
            typeNames.push(allows[i].type);
        }
        return typeNames;
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.getRequiredAttributes = function()
    {
        var attrs = MixedType.$parent.prototype.getRequiredAttributes.call(this);

        return attrs.concat(['allows']);
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.getBaseData = function()
    {
        var baseData = MixedType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * Allows to specify allowed types of property value.
         * Every value in array must be property definition of needed type
         *
         * @type {Object[]}
         */
        baseData.allows = [];

        /**
         * @inheritDoc
         */
        baseData.default = null;

        return baseData;
    };

    /**
     * @inheritDoc
     */
    MixedType.prototype.processData = function()
    {
        var allows = this.normalizeAllows(this.getAllows());

        if (allows && Array.isArray(allows)) {
            for (var i = 0; i < allows.length; i++) {
                if (Subclass.Tools.isPlainObject(allows[i])) {
                    this.addAllowedType(allows[i]);
                }
            }
        }
        MixedType.$parent.prototype.processData.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(MixedType);

    return MixedType;

})();

// Source file: src/Type/Number/NumberType.js

/**
 * @namespace
 */
Subclass.Property.Type.Number = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Number.NumberType = (function()
{
    /**
     * @inheritDoc
     * @constructor
     */
    function NumberType()
    {
        NumberType.$parent.apply(this, arguments);
    }

    NumberType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    NumberType.getName = function()
    {
        return "number";
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validateValue = function(value)
    {
        NumberType.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();
        var error = false;

        if (typeof value != 'number') {
            error = true;
        }
        if (!error && minValue !== null && value < minValue) {
            Subclass.Error.create(
                'The value of the property ' + this + ' is too small ' +
                'and must be more or equals the number ' + minValue + "."
            );
        }
        if (!error && maxValue !== null && value > maxValue) {
            Subclass.Error.create(
                'The value of the property ' + this + ' is too high ' +
                'and must be less or equals the number ' + maxValue + "."
            );
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('a number')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validateDefault = NumberType.prototype.validateValue;

    /**
     * Validates "maxValue" attribute value
     *
     * @param {*} maxValue
     */
    NumberType.prototype.validateMaxValue = function(maxValue)
    {
        if (maxValue !== null && typeof maxValue != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('maxValue')
                .received(maxValue)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "maxValue" attribute value
     *
     * @param {(number|null)} maxValue
     */
    NumberType.prototype.setMaxValue = function(maxValue)
    {
        this.validateMaxValue(maxValue);
        this.getData().maxValue = maxValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "maxValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberType.prototype.getMaxValue = function()
    {
        return this.getData().maxValue;
    };

    /**
     * Validates "minValue" attribute value
     *
     * @param {*} minValue
     */
    NumberType.prototype.validateMinValue = function(minValue)
    {
        if (minValue !== null && typeof minValue != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('minValue')
                .received(minValue)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "minValue" attribute value
     *
     * @param {(number|null)} minValue
     */
    NumberType.prototype.setMinValue = function(minValue)
    {
        this.validateMinValue(minValue);
        this.getData().minValue = minValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "minValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberType.prototype.getMinValue = function()
    {
        return this.getData().minValue;
    };

    /**
     * Validates how minValue and maxValue are compatable
     */
    NumberType.prototype.validateMinMaxValues = function()
    {
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();

        if (minValue !== null && maxValue !== null && minValue > maxValue) {
            Subclass.Error.create(
                'The "maxLength" attribute value must be higher than "minLength" attribute value ' +
                'in definition of property ' + this + ' must be number or null.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.getBaseData = function()
    {
        var baseData = NumberType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * Specified max number value if it isn't null
         * @type {(number|null)}
         */
        baseData.maxValue = null;

        /**
         * Specifies min number value if it isn't null
         * @type {(number|null)}
         */
        baseData.minValue = null;

        /**
         * @inheritDoc
         */
        baseData.nullable = false;

        /**
         * @inheritDoc
         */
        baseData.default = 0;

        return baseData;
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validateData = function()
    {
        NumberType.$parent.prototype.validateData.apply(this, arguments);

        this.validateMinMaxValues();
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(NumberType);

    return NumberType;

})();

// Source file: src/Type/Object/ObjectType.js

/**
 * @namespace
 */
Subclass.Property.Type.Object = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Object.ObjectType = function()
{
    /**
     * @inheritDoc
     */
    function ObjectType()
    {
        ObjectType.$parent.apply(this, arguments);
    }

    ObjectType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ObjectType.getName = function()
    {
        return "object";
    };

    /**
     * @inheritDoc
     */
    ObjectType.prototype.validateValue = function(value)
    {
        ObjectType.$parent.prototype.validateValue.call(this, value);

        if (value !== null && !Subclass.Tools.isPlainObject(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('a plain object')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    ObjectType.prototype.validateDefault = ObjectType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ObjectType.prototype.getBaseData = function()
    {
        var baseData = ObjectType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = {};

        return baseData;
    };

    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ObjectType);

    return ObjectType;

}();

// Source file: src/Type/String/StringType.js

/**
 * @namespace
 */
Subclass.Property.Type.String = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.String.StringType = (function()
{
    /**
     * @inheritDoc
     */
    function StringType ()
    {
        StringType.$parent.apply(this, arguments);
    }

    StringType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    StringType.getName = function()
    {
        return 'string';
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.validateValue = function(value)
    {
        StringType.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }
        var pattern = this.getPattern();
        var minLength = this.getMinLength();
        var maxLength = this.getMaxLength();
        var error = false;

        if (typeof value != 'string') {
            error = true;
        }

        if (!error && pattern && !pattern.test(value)) {
            Subclass.Error.create(
                'The value "' + value + '" of the property ' + this + ' is not valid ' +
                'and must match the regular expression "' + pattern.toString() + '".'
            );
        }
        if (!error && minLength !== null && value.length < minLength) {
            Subclass.Error.create(
                'The value "' + value + '" of the property ' + this + ' is too short ' +
                'and must consist of at least ' + minLength + ' symbols.'
            );
        }
        if (!error && maxLength !== null && value.length > maxLength) {
            Subclass.Error.create(
                'The value "' + value + '" of the property "' + this + '" is too long ' +
                'and must be not longer than ' + maxLength + ' symbols.'
            );
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('a string')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.validateDefault = StringType.prototype.validateValue;

    /**
     * Validates "pattern" attribute value
     *
     * @param {*} pattern
     */
    StringType.prototype.validatePattern = function(pattern)
    {
        if (pattern !== null && typeof pattern != 'object' && !(pattern instanceof RegExp)) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('pattern')
                .received(pattern)
                .property(this)
                .expected('a RegExp instance or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "maxLength" attribute value
     *
     * @param {(RegExp|null)} pattern
     */
    StringType.prototype.setPattern = function(pattern)
    {
        this.validatePattern(pattern);
        this.getData().pattern = pattern;
    };

    /**
     * Returns value of "pattern" attribute
     *
     * @returns {(RegExp|null)}
     */
    StringType.prototype.getPattern = function()
    {
        return this.getData().pattern;
    };

    /**
     * Validates "maxLength" attribute value
     *
     * @param {*} maxLength
     */
    StringType.prototype.validateMaxLength = function(maxLength)
    {
        if (maxLength !== null && typeof maxLength != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('maxLength')
                .received(maxLength)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "maxLength" attribute value
     *
     * @param {(number|null)} maxLength
     */
    StringType.prototype.setMaxLength = function(maxLength)
    {
        this.validateMaxLength(maxLength);
        this.getData().maxLength = maxLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "maxLength" attribute
     *
     * @returns {(number|null)}
     */
    StringType.prototype.getMaxLength = function()
    {
        return this.getData().maxLength;
    };

    /**
     * Validates "minLength" attribute value
     *
     * @param {*} minLength
     */
    StringType.prototype.validateMinLength = function(minLength)
    {
        if (minLength !== null && typeof minLength != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('minLength')
                .received(minLength)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "minLength" attribute value
     *
     * @param {(number|null)} minLength
     */
    StringType.prototype.setMinLength = function(minLength)
    {
        this.validateMinLength(minLength);
        this.getData().minLength = minLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "minLength" attribute
     *
     * @returns {(number|null)}
     */
    StringType.prototype.getMinLength = function()
    {
        return this.getData().minLength;
    };

    /**
     * Validates how minLength and maxLength are compatable
     */
    StringType.prototype.validateMinMaxLengths = function()
    {
        var minLength = this.getMinLength();
        var maxLength = this.getMaxLength();

        if (minLength !== null && maxLength !== null && minLength > maxLength) {
            Subclass.Error.create(
                'The "maxLength" attribute value must be more than "minLength" attribute value ' +
                'in definition of property ' + this + ' must be number or null.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.getBaseData = function()
    {
        var baseData = StringType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.nullable = false;

        /**
         * Regular expression that property value will match
         * @type {(RegExp|null)}
         */
        baseData.pattern = null;

        /**
         * Specified max string length if it isn't null
         * @type {(number|null)}
         */
        baseData.maxLength = null;

        /**
         * Specifies min string length if it isn't null
         * @type {(number|null)}
         */
        baseData.minLength = null;

        /**
         * @inheritDoc
         */
        baseData.default = "";

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(StringType);


    return StringType;

})();

// Source file: src/Type/Untyped/UntypedType.js

/**
 * @namespace
 */
Subclass.Property.Type.Untyped = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Untyped.UntypedType = (function()
{
    /**
     * @inheritDoc
     */
    function UntypedType()
    {
        UntypedType.$parent.apply(this, arguments);
    }

    UntypedType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    UntypedType.getName = function()
    {
        return "untyped";
    };

    /**
     * @inheritDoc
     */
    UntypedType.prototype.getBaseData = function()
    {
        var baseData = UntypedType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = null;

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();

// Source file: src/ConfigContainer.js

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

// Source file: src/ConfigManager.js

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

// Source file: src/Subclass.js

/**
 * Registers the new SubclassJS plugin
 */
Subclass.registerPlugin(function() {

    function PropertyPlugin()
    {
        PropertyPlugin.$parent.apply(this, arguments);
    }

    PropertyPlugin.$parent = Subclass.SubclassPlugin;

    /**
     * @inheritDoc
     */
    PropertyPlugin.getName = function()
    {
        return "SubclassConfig";
    };

    /**
     * @inheritDoc
     */
    PropertyPlugin.getDependencies = function()
    {
        return [
            'SubclassInstance',
            'SubclassParser',
            'SubclassParameter',
            'SubclassService'
        ];
    };

    return PropertyPlugin;
}());

// Source file: src/WatcherEvent.js

/**
 * @class
 * @constructor
 */
Subclass.Property.WatcherEvent = function()
{
    function WatcherEvent(property, newValue, oldValue)
    {
        if (!property || typeof property != 'object' || !(property instanceof Subclass.Property.Property)) {
            Subclass.Error.create('InvalidArgument')
                .argument('property instance')
                .expected('an instance of class Subclass.Property.Proeprty')
                .received(property)
                .apply()
            ;
        }
        /**
         * Property instance
         *
         * @type {Subclass.Property.Property}
         * @private
         */
        this._property = property;

        /**
         * Reports whether propagation stopped
         *
         * @type {boolean}
         * @private
         */
        this._stopped = false;

        /**
         * Old property value before modification
         *
         * @type {*}
         * @private
         */
        this._oldValue = oldValue;

        /**
         * New property value after modification
         *
         * @type {*}
         * @private
         */
        this._newValue = newValue;

        /**
         * Difference between old and new property values.
         * It is actual only if new value is a plain object an array.
         * In other cases it will have the same value as the newValue.
         *
         * @type {null}
         * @private
         */
        this._diffValue = null;
    }

    WatcherEvent.prototype = {

        /**
         * Sets property instance
         *
         * @param {Subclass.Property.Property} property
         */
        setProperty: function(property)
        {
            this._property = property;
        },

        /**
         * Returns property instance
         * @returns {Subclass.Property.Property}
         */
        getProperty: function()
        {
            return this._property;
        },

        /**
         * Starts event propagation
         */
        startPropagation: function ()
        {
            this._stopped = false;
        },

        /**
         * Stops event propagation
         */
        stopPropagation: function ()
        {
            this._stopped = true;
        },

        /**
         * Reports whether event propagation stopped
         *
         * @returns {boolean}
         */
        isPropagationStopped: function ()
        {
            return this._stopped;
        },

        /**
         * Sets new property value
         *
         * @param {*} newValue
         */
        setNewValue: function(newValue)
        {
            this._diffValue = null;
            this._newValue = newValue;
        },

        /**
         * Returns new property value
         *
         * @returns {*}
         */
        getNewValue: function()
        {
            return this._newValue;
        },

        /**
         * Sets old property value
         *
         * @param oldValue
         */
        setOldValue: function(oldValue)
        {
            this._diffValue = null;
            this._oldValue = oldValue;
        },

        /**
         * Returns old property value
         *
         * @returns {*}
         */
        getOldValue: function()
        {
            return this._oldValue;
        },

        /**
         * Returns difference between newValue and oldValue
         * It is actual only if new value is a plain object or an array.
         * In other cases it will return just the same as getNewValue method.
         *
         * @returns {*}
         */
        getDiffValue: function()
        {
            if (this._diffValue) {
                return this._diffValue;
            }

            this._diffValue = _defineDiffValue(
                this.getNewValue(),
                this.getOldValue()
            );

            return this._diffValue;
        }
    };

    /**
     * Returns diff between two values
     *
     * @param {*} newValue
     * @param {*} oldValue
     * @returns {*}
     * @private
     */
    function _defineDiffValue(newValue, oldValue)
    {
        var diff;

        if (
            Array.isArray(newValue)
            && Array.isArray(oldValue)
        ) {
            diff = [];

            for (var i = 0; i < newValue.length; i++) {
                if (!Subclass.Tools.isEqual(newValue[i], oldValue[i])) {
                    diff[i] = _defineDiffValue(newValue[i], oldValue[i]);
                }
            }

        } else if (
            Subclass.Tools.isPlainObject(newValue)
            && Subclass.Tools.isPlainObject(oldValue)
        ) {
            diff = {};

            for (var propName in newValue) {
                if (newValue.hasOwnProperty(propName)) {
                    if (!Subclass.Tools.isEqual(newValue[propName], oldValue[propName])) {
                        diff[propName] = _defineDiffValue(newValue[propName], oldValue[propName]);
                    }
                }
            }
        } else {
            diff = newValue;
        }

        return Subclass.Tools.copy(diff);
    }

    return WatcherEvent;

}();
})();