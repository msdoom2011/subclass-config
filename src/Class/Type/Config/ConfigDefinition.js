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
    }

    ConfigDefinition.$parent = Subclass.Class.ClassDefinition;

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
     * @inheritDoc
     */
    ConfigDefinition.prototype.getBaseData = function()
    {
        var classDefinition = ConfigDefinition.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @type {string[]}
         */
        classDefinition.$_includes = [];

        /**
         * Sets values
         *
         * @param {Object} values
         */
        classDefinition.setValues = function(values)
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
        classDefinition.getValues = function()
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
        ConfigDefinition.$parent.prototype.normalizeData.call(this);

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

        // Extending class properties

        data.$_properties = this.normalizeProperties();

        // Customising property definitions

        for (propName in data.$_properties) {
            if (data.$_properties.hasOwnProperty(propName)) {
                data.$_properties[propName].accessors = false;
            }
        }
    };

    /**
     * Normalising class properties
     */
    ConfigDefinition.prototype.normalizeProperties = function()
    {
        var classManager = this.getClass().getClassManager();
        var propertyManager = classManager.getModule().getPropertyManager();
        var classProperties = this.getProperties();
        var propName;

        // Normalizing short style property definitions

        for (propName in classProperties) {
            if (classProperties.hasOwnProperty(propName)) {
                classProperties[propName] = propertyManager.normalizeTypeDefinition(
                    classProperties[propName],
                    propName
                );
            }
        }

        // Processing included and decoration classes

        var includes = this.getIncludes();

        for (var i = 0; i < includes.length; i++) {
            var includeClassName = includes[i];
            var includeClass = this.getClass().getClassManager().getClass(includeClassName);
            var includeClassConstructor = includeClass.getConstructor();
            var includeClassProperties = includeClass.getDefinition().getProperties();

            classProperties = this.extendProperties(
                includeClassProperties,
                classProperties
            );
        }

        // Processing parent class

        if (this.getExtends()) {
            var parentClassName = this.getExtends();
            var parentClass = this.getClass().getClassManager().getClass(parentClassName);
            var parentClassConstructor = parentClass.getConstructor();
            var parentClassProperties = parentClass.getDefinition().getProperties();

            classProperties = this.extendProperties(
                parentClassProperties,
                classProperties
            );
        }

        // Validating result properties

        for (propName in classProperties) {
            if (!classProperties.hasOwnProperty(propName)) {
                continue;
            }
            var property = classProperties[propName];

            if (!property || !Subclass.Tools.isPlainObject(property)) {
                Subclass.Error.create(
                    'Specified invalid definition of property "' + propName + '" ' +
                    'in class "' + this.getClass().getName() + '".'
                );
            }
        }

        return classProperties;
    };

    /**
     * Extending class property definitions
     *
     * @param {Object} childProperties
     * @param {Object} parentProperties
     */
    ConfigDefinition.prototype.extendProperties = function(parentProperties, childProperties)
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
                parentProperties[propName] = Subclass.Tools.extendDeep(
                    parentProperties[propName],
                    childProperties[propName]
                );

            } else if (
                parentProperties
                && parentProperties[propName]
            ) {
                parentProperties[propName] = Subclass.Tools.extendDeep(
                    parentProperties[propName],
                    { value: childProperties[propName] }
                );

            } else {
                parentProperties[propName] = childProperties[propName];
            }
        }

        return parentProperties;
    };

    ConfigDefinition.prototype.processRelatedClasses = function()
    {
        ConfigDefinition.$parent.prototype.processRelatedClasses.call(this);

        var classInst = this.getClass();
        var classManager = classInst.getClassManager();
        var includes = this.getIncludes();

        // Performing $_includes (Needs to be defined in ConfigDefinition)

        if (includes && this.validateIncludes(includes)) {
            for (var i = 0; i < includes.length; i++) {
                classManager.loadClass(includes[i]);
            }
        }
    };

    return ConfigDefinition;

})();