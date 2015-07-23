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

        // Extending class properties

        data.$_properties = this.processProperties(data.$_properties);

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
            var parentClass = this.getClass().getClassManager().getClass(parentClassName);
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
            var parentClass = this.getClass().getClassManager().getClass(parentClassName);
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
     * Processes class properties
     */
    ConfigDefinition.prototype.processProperties = function(classProperties)
    {
        var classManager = this.getClass().getClassManager();
        var propertyManager = classManager.getModule().getPropertyManager();
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

            // Processing parent class properties

            classProperties = this.extendProperties(
                parentClass.getDefinition().getProperties(),
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

        var classManager = this.getClass().getClassManager();
        var includes = this.getIncludes();

        // Performing $_includes (Needs to be defined in ConfigDefinition)

        if (includes && this.validateIncludes(includes)) {
            for (var i = 0; i < includes.length; i++) {
                classManager.loadClass(includes[i]);
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
                var includeClass = classManager.getClass(includes[i]);
                var includeClassConstructor = includeClass.getConstructor();
                var includeClassProperties = includeClass.getProperties(true);

                classPropertyNames = classPropertyNames.concat(
                    Object.keys(includeClassProperties)
                );
            }
        }

        if (this.getExtends()) {
            var parentClassName = this.getExtends();
            var parentClass = this.getClass().getClassManager().getClass(parentClassName);
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
            var includeClass = classManager.getClass(includes[i]);
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