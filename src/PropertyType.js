/**
 * @class
 */
Subclass.Property.PropertyType = (function()
{
    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {Object} definitionData
     * @constructor
     */
    function PropertyType(propertyManager, definitionData)
    {
        if (!propertyManager || !(propertyManager instanceof Subclass.Property.PropertyManager)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the property manager instance', false)
                .expected('an instance of "Subclass.Property.PropertyManager" class')
                .received(propertyManager)
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
         * The plain object with definition data
         *
         * @type {Object}
         * @private
         */
        this._data = definitionData;

        //
        ///**
        // * A name of current property
        // *
        // * @type {string}
        // * @private
        // */
        //this._name = propertyName;
        //
        ///**
        // * A definition of current property
        // *
        // * @type {Subclass.Property.PropertyDefinition}
        // * @private
        // */
        //this._definition = this.createDefinition(propertyDefinition);
        //
        ///**
        // * An instance of class which presents public api of current property
        // *
        // * @type {(PropertyAPI|null)}
        // * @private
        // */
        //this._api = null;
        //
        ///**
        // * An instance of class to which current property belongs to
        // *
        // * @type {(ClassType|null)}
        // * @private
        // */
        //this._contextClass = null;
        //
        ///**
        // * An instance of another property to which current one belongs to
        // *
        // * @type {(PropertyType|null)}
        // * @private
        // */
        //this._contextProperty = null;
        //
        ///**
        // * A set of callbacks which will invoked when property changes its value
        // *
        // * @type {Function[]}
        // * @private
        // */
        //this._watchers = [];
        //
        ///**
        // * Checks if current value was ever modified (was set any value)
        // *
        // * @type {boolean}
        // * @private
        // */
        //this._isModified = false;
        //
        ///**
        // * Reports that current property is temporary locked for the write operation
        // *
        // * @type {boolean}
        // * @private
        // */
        //this._isLocked = false;
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
        Subclass.Error.create('NotImplementedMethod')
            .method("parseRelatedClasses")
            .apply()
        ;
    };
    //
    ///**
    // * Returns property definition constructor
    // *
    // * @returns {Function}
    // */
    //PropertyType.getDefinitionClass = function()
    //{
    //    return Subclass.Property.PropertyDefinition;
    //};
    //
    ///**
    // * Returns class of property APIs
    // *
    // * @returns {Function}
    // */
    //PropertyType.getAPIClass = function()
    //{
    //    return Subclass.Property.PropertyAPI;
    //};

    /**
     * Returns the empty definition of property
     *
     * @returns {(Object|boolean)}
     */
    PropertyType.getEmptyDefinition = function()
    {
        return {
            type: this.getPropertyTypeName()
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
        var propertyDefinition = this.getDefinition();

        //if (this.getContextProperty()) {
        //    propertyDefinition.setAccessors(false);
        //}
        propertyDefinition.validateData();
        propertyDefinition.processData();
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
    //
    ///**
    // * Returns property clear name
    // *
    // * @returns {string}
    // */
    //PropertyType.prototype.getName = function()
    //{
    //    return this._name;
    //};
    //
    ///**
    // * Returns property name with names of context property
    // *
    // * @returns {string}
    // */
    //PropertyType.prototype.getNameFull = function()
    //{
    //    var propertyName = this.getName();
    //    var contextProperty = this.getContextProperty();
    //    var contextPropertyName = "";
    //
    //    if (contextProperty) {
    //        contextPropertyName = contextProperty.getNameFull();
    //    }
    //    return (contextPropertyName && contextPropertyName + "." || "") + propertyName;
    //};
    //
    ///**
    // * Returns property hashed name
    // *
    // * @returns {*}
    // */
    //PropertyType.prototype.getNameHashed = function()
    //{
    //    var propertyNameHash = this.getPropertyManager().getPropertyNameHash();
    //    var propertyName = this.getName();
    //
    //    if (propertyName.indexOf(propertyNameHash) >= 0) {
    //        return propertyName;
    //    }
    //    return "_" + propertyName + "_" + propertyNameHash;
    //};
    //
    ///**
    // * Renames current property
    // *
    // * @param {string} newName
    // * @param {Object} context
    // */
    //PropertyType.prototype.rename = function(newName, context)
    //{
    //    if (!newName || typeof newName != 'string') {
    //        Subclass.Error.create(
    //            'Specified invalid new value argument while was called method rename in property ' + this + '. ' +
    //            'It must be a string.'
    //        );
    //    }
    //    if (Object.isSealed(context)) {
    //        Subclass.Error.create(
    //            'Can\'t rename property ' + this + '. ' +
    //            'The context object is sealed.'
    //        );
    //    }
    //    var definition = this.getDefinition();
    //    var value = this.getData(context);
    //
    //    if (definition.isAccessors()) {
    //        Subclass.Error.create('Can\'t rename property ' + this + ' because it uses accessor functions.');
    //    }
    //
    //    this.detach(context);
    //    this._name = newName;
    //    this.attach(context);
    //    this.setValue(context, value);
    //};
    //
    ///**
    // * Creates and returns property definition instance.
    // *
    // * @param {Object} propertyDefinition
    // * @returns {Subclass.Property.PropertyDefinition}
    // */
    //PropertyType.prototype.createDefinition = function(propertyDefinition)
    //{
    //    var constructor = this.constructor.getDefinitionClass();
    //
    //    return Subclass.Tools.createClassInstance(
    //        constructor,
    //        this,
    //        propertyDefinition
    //    );
    //};
    //
    ///**
    // * Returns property definition instance
    // *
    // * @returns {Subclass.Property.PropertyDefinition}
    // */
    //PropertyType.prototype.getDefinition = function()
    //{
    //    return this._definition;
    //};
    //
    ///**
    // * Returns property api
    // *
    // * @param {Object} [context]
    // * @returns {Subclass.Property.PropertyAPI}
    // */
    //PropertyType.prototype.getAPI = function(context)
    //{
    //    if (!this._api) {
    //        var apiClass = this.constructor.getAPIClass();
    //        this._api = Subclass.Tools.createClassInstance(apiClass, this, context);
    //    }
    //    if (context && this._api.getContext() != context) {
    //        this._api.setContext(context);
    //    }
    //    return this._api;
    //};
    //
    ///**
    // * Setup marker if current property value was ever modified
    // *
    // * @param {boolean} isModified
    // */
    //PropertyType.prototype.setIsModified = function(isModified)
    //{
    //    if (typeof isModified != 'boolean') {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the property modified marker value", false)
    //            .received(isModified)
    //            .expected("a boolean")
    //            .apply()
    //        ;
    //    }
    //    if (this.getContextProperty()) {
    //        this.getContextProperty().setIsModified(isModified);
    //    }
    //    this._isModified = isModified;
    //};
    //
    ///**
    // * Checks if current property value was ever modified
    // *
    // * @returns {boolean}
    // */
    //PropertyType.prototype.isModified = function()
    //{
    //    return this._isModified;
    //};
    //
    ///**
    // * Sets property context class
    // *
    // * @param {(ClassType|null)} contextClass
    // */
    //PropertyType.prototype.setContextClass = function(contextClass)
    //{
    //    if ((
    //            !contextClass
    //            && contextClass !== null
    //        ) || (
    //            contextClass
    //            && !(contextClass instanceof Subclass.Class.ClassType)
    //        )
    //    ) {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the context class instance", false)
    //            .received(contextClass)
    //            .expected('an instance of class "Subclass.Class.ClassType"')
    //            .apply()
    //        ;
    //    }
    //    this._contextClass = contextClass;
    //};
    //
    ///**
    // * Returns context class instance to which current property belongs to
    // *
    // * @returns {(ClassType|null)}
    // */
    //PropertyType.prototype.getContextClass = function()
    //{
    //    return this._contextClass;
    //};
    //
    ///**
    // * Sets name of the chain of properties to which current property belongs to.
    // *
    // * @param {(PropertyType|null)} contextProperty
    // */
    //PropertyType.prototype.setContextProperty = function(contextProperty)
    //{
    //    if ((
    //            !contextProperty
    //            && contextProperty !== null
    //        ) || (
    //            contextProperty
    //            && !(contextProperty instanceof Subclass.Property.PropertyType)
    //        )
    //    ) {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the context property instance", false)
    //            .received(contextProperty)
    //            .expected('an instance of "Subclass.Property.PropertyType" class')
    //            .apply()
    //        ;
    //    }
    //    this._contextProperty = contextProperty;
    //};
    //
    ///**
    // * Returns name of the chain of properties to which current property belongs to.
    // *
    // * @returns {string}
    // */
    //PropertyType.prototype.getContextProperty = function()
    //{
    //    return this._contextProperty;
    //};
    //
    ///**
    // * Returns all registered watchers
    // *
    // * @returns {Function[]}
    // */
    //PropertyType.prototype.getWatchers = function()
    //{
    //    var watcher = this.getDefinition().getWatcher();
    //    var watchers = [];
    //
    //    if (watcher) {
    //        watchers.push(watcher);
    //    }
    //    return Subclass.Tools.extend(watchers, this._watchers);
    //};
    //
    ///**
    // * Adds new watcher
    // *
    // * @param {Function} callback Function, that takes two arguments:
    // *      - newValue {*} New property value
    // *      - oldValue {*} Old property value
    // *
    // *      "this" variable inside callback function will link to the class instance to which property belongs to
    // *      This callback function MUST return newValue value.
    // *      So you can modify it if you need.
    // */
    //PropertyType.prototype.addWatcher = function(callback)
    //{
    //    if (typeof callback != "function") {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the callback", false)
    //            .received(callback)
    //            .expected("a function")
    //            .apply()
    //        ;
    //    }
    //    if (!this.issetWatcher(callback)) {
    //        this._watchers.push(callback);
    //    }
    //};
    //
    ///**
    // * Checks if specified watcher callback is registered
    // *
    // * @param {Function} callback
    // * @returns {boolean}
    // */
    //PropertyType.prototype.issetWatcher = function(callback)
    //{
    //    if (this.getDefinition().getWatcher() == callback) {
    //        return true;
    //    }
    //    return this._watchers.indexOf(callback) >= 0;
    //};
    //
    ///**
    // * Removes specified watcher callback
    // *
    // * @param {Function} callback
    // */
    //PropertyType.prototype.removeWatcher = function(callback)
    //{
    //    var watcherIndex;
    //
    //    if ((watcherIndex = this._watchers.indexOf(callback)) >= 0) {
    //        this._watchers.splice(watcherIndex, 1);
    //    }
    //    if (this.getDefinition().getWatcher() == callback) {
    //        this.getDefinition().setWatcher(null);
    //    }
    //};
    //
    ///**
    // * Unbind all watchers from current property
    // */
    //PropertyType.prototype.removeWatchers = function()
    //{
    //    this.getDefinition().setWatcher(null);
    //    this._watchers = [];
    //};
    //
    ///**
    // * Invokes all registered watcher functions
    // *
    // * @param {Object} context
    // * @param {*} newValue
    // * @param {*} oldValue
    // */
    //PropertyType.prototype.invokeWatchers = function(context, newValue, oldValue)
    //{
    //    if (typeof context != "object" || Array.isArray(context)) {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the context object", false)
    //            .received(context)
    //            .expected("an object")
    //            .apply()
    //        ;
    //    }
    //    var watchers = this.getWatchers();
    //
    //    for (var i = 0; i < watchers.length; i++) {
    //        watchers[i].call(context, newValue, oldValue, this);
    //    }
    //};
    //
    ///**
    // * Makes current property locked
    // */
    //PropertyType.prototype.lock = function()
    //{
    //    this._isLocked = true;
    //};
    //
    ///**
    // * Makes current property unlocked
    // */
    //PropertyType.prototype.unlock = function()
    //{
    //    this._isLocked = false;
    //};
    //
    ///**
    // * Reports whether current property is locked
    // *
    // * @returns {boolean}
    // */
    //PropertyType.prototype.isLocked = function()
    //{
    //    if (this._isLocked) {
    //        return true;
    //    }
    //    if (this.getContextProperty()) {
    //        return this.getContextProperty().isLocked() || false;
    //    } else {
    //        return false;
    //    }
    //};

    /**
     * Returns property definition
     *
     * @returns {Object}
     */
    PropertyType.prototype.getData = function()
    {
        return this._data;
    };
    //
    ///**
    // * Validates property value. Throws error if value is invalid
    // *
    // * @param {*} value
    // * @returns {boolean}
    // * @throws {Error}
    // */
    //PropertyType.prototype.validateValue = function(value)
    //{
    //    return this.getDefinition().validateValue(value);
    //};
    //
    ///**
    // * Sets property value
    // *
    // * @param {Object} context
    // * @param {*} value
    // * @returns {*}
    // */
    //PropertyType.prototype.setValue = function(context, value)
    //{
    //    if (!this.getDefinition().isWritable()) {
    //        console.warn('Trying to change not writable property ' + this + ".");
    //        return;
    //    }
    //    if (this.getDefinition().isAccessors()) {
    //        var setterName = Subclass.Tools.generateSetterName(this.getName());
    //        return context[setterName](value);
    //    }
    //    var propName = this.getName();
    //    context[propName] = value;
    //};
    //
    ///**
    // * Returns value of current property
    // *
    // * @param {Object} context
    // *      The object to which current property belongs to.
    // */
    //PropertyType.prototype.getValue = function(context)
    //{
    //    if (this.getDefinition().isAccessors()) {
    //        var getterName = Subclass.Tools.generateGetterName(this.getName());
    //        return context[getterName]();
    //    }
    //    var propName = this.getName();
    //
    //    return context[propName];
    //};
    //
    ///**
    // * Returns only data of current property
    // *
    // * @param context
    // * @returns {*}
    // */
    //PropertyType.prototype.getData = function(context)
    //{
    //    return this.getValue(context);
    //};
    //
    ///**
    // * Resets the value of current property to default
    // *
    // * @param {Object} context
    // *      The object to which current property belongs to.
    // */
    //PropertyType.prototype.resetValue = function(context)
    //{
    //    var defaultValue = this.getDefaultValue();
    //
    //    this.setValue(context, defaultValue);
    //};
    //
    ///**
    // * Sets property default value
    // *
    // * @param {*} value
    // * @param {Object} [context]
    // */
    //PropertyType.prototype.setDefaultValue = function(context, value)
    //{
    //    var propertyDefinition = this.getDefinition();
    //        propertyDefinition.setDefault(value);
    //
    //    if (this.isDefaultValue(context)) {
    //        this.setValue(context, value);
    //        this.setIsModified(false);
    //    }
    //};
    //
    ///**
    // * Returns property default value
    // *
    // * @returns {*}
    // */
    //PropertyType.prototype.getDefaultValue = function()
    //{
    //    return this.getDefinition().getDefault();
    //};
    //
    ///**
    // * Checks whether current property equals default and was not modified
    // *
    // * @param context
    // * @returns {boolean}
    // */
    //PropertyType.prototype.isDefaultValue = function(context)
    //{
    //    var oldDefaultValue = this.getDefaultValue();
    //
    //    if (context) {
    //        if ((
    //                Subclass.Tools.isEqual(oldDefaultValue, this.getValue(context))
    //                && !this.isModified()
    //            ) || (
    //                oldDefaultValue === null
    //                && this.isEmpty(context)
    //                && !this.isModified()
    //            )
    //        ) {
    //            return true;
    //        }
    //    }
    //    return false;
    //};

    /**
     * Creates the instance of property
     *
     * @param {string} propertyName
     * @param {Object} context
     */
    PropertyType.prototype.createInstance = function(propertyName, context)
    {
        var constructor = this.constructor.getPropertyClass();

        return Subclass.Tools.createClassInstance(
            constructor,
            propertyName,
            context,
            this
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
            return this.getProperty(propertyName)._value;
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
        var $this = this;

        if (!this.isWritable()) {
            return function() {
                Subclass.Error.create('Property ' + $this + ' is not writable.');
            }
        }
        return function(value) {
            var property = this.getProperty(propName);

            if (property.isLocked()) {
                return console.warn(
                    'Trying to set new value for the ' +
                    'property ' + $this + ' that is locked for write.'
                );
            }
            var oldValue = property.getData();
            var newValue = value;

            $this.validateValue(value);
            property.modify();
            property._value = value;
            property.invokeWatchers(newValue, oldValue);
        };
    };

    /**
     * Validates "value" attribute value
     *
     * @param {*} value
     */
    PropertyType.prototype.validateValue = function(value)
    {
        if (value === null && !this.isNullable()) {
            Subclass.Error.create('The property ' + this.getProperty() + ' is not nullable.');
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
    PropertyType.prototype.getValueEmpty = function()
    {
        return null;
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
                .received(watcher)
                .property(this.getProperty())
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
                .property(this.getProperty())
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
    PropertyType.prototype.isAccessors = function()
    {
        var isAccessors = this.getData().accessors;

        return isAccessors !== null ? isAccessors : true;
    };

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
                .property(this.getProperty())
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
                .property(this.getProperty())
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
             * Default value of property
             *
             * @type {(*|null)}
             */
            default: null,

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
        var requiredAttributes = this.getRequiredAttributes();
        var definition = this.getData();

        for (var i = 0; i < requiredAttributes.length; i++) {
            var attrName = requiredAttributes[i];

            if (!definition.hasOwnProperty(attrName)) {
                Subclass.Error.create(
                    'Missed required attribute "' + attrName + '" ' +
                    'in definition of the property ' + this.getProperty() + '.'
                );
            }
        }
        if (this.getWritable() === false && this.getValue() !== undefined) {
            console.warn(
                'Specified "value" attribute for definition of not writable ' +
                'property ' + this.getProperty() + '.\n The value in "value" attribute ' +
                'was ignored.\n The value from "default" attribute was applied instead.'
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

        if (emptyDefaultValue) {
            try {
                this.setDefault(this.getEmptyValue());

            } catch (e) {
                console.error(
                    'The default value was not specified. \n' +
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
    //
    ///**
    // * Attaches property to specified context
    // *
    // * @param {Object} context
    // */
    //PropertyType.prototype.attach = function(context)
    //{
    //    if (!context || typeof context != 'object') {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the context object", false)
    //            .received(context)
    //            .expected("an object")
    //            .apply()
    //        ;
    //    }
    //    var propName = this.getName();
    //
    //    if (this.getDefinition().isAccessors()) {
    //        this.attachAccessors(context);
    //
    //    } else if (this.getDefinition().isWritable()) {
    //        Object.defineProperty(context, propName, {
    //            configurable: true,
    //            enumerable: true,
    //            get: this.generateGetter(),
    //            set: this.generateSetter()
    //        });
    //
    //    } else {
    //        Object.defineProperty(context, propName, {
    //            configurable: true,
    //            writable: false,
    //            enumerable: true,
    //            value: this.getDefaultValue()
    //        });
    //    }
    //    if (Subclass.Tools.isPlainObject(context)) {
    //        this.attachHashed(context);
    //    }
    //};
    //
    ///**
    // * Detaches property from class instance
    // *
    // * @param {Object} context
    // */
    //PropertyType.prototype.detach = function(context)
    //{
    //    if (!context || typeof context != 'object') {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the context object", false)
    //            .received(context)
    //            .expected("an object")
    //            .apply()
    //        ;
    //    }
    //    if (Object.isSealed(context)) {
    //        Subclass.Error.create('Can\'t detach property ' + this + ' because the context object is sealed.');
    //    }
    //    var hashedPropName = this.getNameHashed();
    //    var propName = this.getName();
    //
    //    for (var i = 0, propNames = [hashedPropName, propName]; i < propNames.length; i++) {
    //        delete context[propNames[i]];
    //    }
    //};
    //
    ///**
    // * Attaches property accessor functions
    // *
    // * @param {Object} context
    // */
    //PropertyType.prototype.attachAccessors = function(context)
    //{
    //    var propName = this.getName();
    //    var getterName = Subclass.Tools.generateGetterName(propName);
    //
    //    context[getterName] = this.generateGetter();
    //
    //    if (this.getDefinition().isWritable()) {
    //        var setterName = Subclass.Tools.generateSetterName(propName);
    //
    //        context[setterName] = this.generateSetter();
    //    }
    //};
    //
    ///**
    // * Attaches property that will hold property value in class instance
    // *
    // * @param {Object} context
    // */
    //PropertyType.prototype.attachHashed = function(context)
    //{
    //    if (!context || typeof context != 'object') {
    //        Subclass.Error.create('InvalidArgument')
    //            .argument("the context object", false)
    //            .received(context)
    //            .expected("an object")
    //            .apply()
    //        ;
    //    }
    //    var hashedPropName = this.getNameHashed();
    //    var defaultValue = this.getDefaultValue();
    //
    //    Object.defineProperty(context, hashedPropName, {
    //        writable: this.getDefinition().isWritable(),
    //        configurable: true,
    //        //enumerable: true,
    //        value: defaultValue
    //    });
    //    //if (
    //    //    this.getDefinition().isWritable()
    //    //    && !this.getDefinition().isAccessors()
    //    //) {
    //    //    Object.defineProperty(context, hashedPropName, {
    //    //        configurable: true,
    //    //        writable: true,
    //    //        value: defaultValue
    //    //    });
    //    //
    //    //} else if (this.getDefinition().isAccessors()) {
    //    //    Object.defineProperty(context, hashedPropName, {
    //    //        configurable: true,
    //    //        //enumerable: true,
    //    //        writable: this.getDefinition().isWritable(),
    //    //        value: defaultValue
    //    //    });
    //    //}
    //};
    //
    ///**
    // * Return string implementation of property
    // *
    // * @returns {string}
    // */
    //PropertyType.prototype.toString = function()
    //{
    //    var propertyName = this.getNameFull();
    //    var contextClassName = this.getContextClass()
    //        ? (' in the class "' + this.getContextClass().getName() + '"')
    //        : "";
    //
    //    return '"' + propertyName + '"' + contextClassName;
    //};

    return PropertyType;
})();
