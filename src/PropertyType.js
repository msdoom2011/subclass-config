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
        //Subclass.Error.create('NotImplementedMethod')
        //    .method("parseRelatedClasses")
        //    .apply()
        //;

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
        //var propertyDefinition = this.getDefinition();

        //if (this.getContextProperty()) {
        //    propertyDefinition.setAccessors(false);
        //}
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
        if (isAccessors !== null && typeof isAccessors != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('accessors')
                .received(isAccessors)
                .property(this)
                .expected('a boolean or null')
                .apply()
            ;
        }
    };

    /**
     * Sets marker if needs to generate accessor methods for current property
     *
     * @param isAccessors
     */
    PropertyType.prototype.setAccessors = function(isAccessors)
    {
        this.validateAccessors(isAccessors);
        this.getData().accessors = isAccessors;
    };

    /**
     * Checks if there is a need in generation of property accessor methods
     *
     * @returns {(boolean|null)}
     */
    PropertyType.prototype.getAccessors = function()
    {
        var isAccessors = this.getData().accessors;

        return isAccessors !== null ? isAccessors : true;
    };

    PropertyType.prototype.isAccessors = PropertyType.prototype.getAccessors;

    /**
     * Validates "writable" attribute value
     *
     * @param {*} isWritable
     */
    PropertyType.prototype.validateWritable = function(isWritable)
    {
        if (isWritable !== null && typeof isWritable != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('writable')
                .received(isWritable)
                .property(this)
                .expected('a boolean or null')
                .apply()
            ;
        }
    };

    /**
     * Set marker if current property is writable
     *
     * @param {(boolean|null)} isWritable
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
        var isWritable = this.getData().writable;

        return isWritable !== null ? isWritable : true;
    };

    /**
     * @alias Subclass.Property.PropertyDefinition
     */
    PropertyType.prototype.isWritable = PropertyType.prototype.getWritable;

    /**
     * Validates "nullable" attribute value
     *
     * @param {*} isNullable
     */
    PropertyType.prototype.validateNullable = function(isNullable)
    {
        if (isNullable !== null && typeof isNullable != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('nullable')
                .received(isNullable)
                .property(this)
                .expected('a boolean or null')
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
     * @returns {(boolean|null)}
     */
    PropertyType.prototype.isNullable = function()
    {
        var isNullable = this.getData().nullable;

        return isNullable !== null ? isNullable : true;
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
            type: null,

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
            accessors: null,

            /**
             * Indicates that current property can hold null value or not.
             *
             * If null as a value of current parameter was specified it means
             * that value of current parameter will defined in accordance with
             * the default settings of each property type.
             *
             * @type {(boolean|null)}
             */
            nullable: null
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
