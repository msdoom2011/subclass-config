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
        //
        ///**
        // * @type {boolean}
        // * @private
        // */
        //this._isNull = true;
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
    MapType.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : {};
    };
    //
    ///**
    // * @inheritDoc
    // */
    //MapType.prototype.generateGetter = function()
    //{
    //    var $this = this;
    //
    //    return function() {
    //        return this[$this.getNameHashed()];
    //    };
    //};

    /**
     * @inheritDoc
     */
    MapType.prototype.generateSetter = function(propName)
    {
        var $this = this;

        return function(value) {
            var property = this.getProperty(propName);

            if (property.isLocked()) {
                return console.warn(
                    'Trying to set new value for the ' +
                    'property ' + property + ' that is locked for write.'
                );
            }
            var childrenContext = property.getValue();
            var oldValue = property.getData();
            var newValue = value;

            if (!Subclass.Tools.isEqual(oldValue, newValue)) {
                property.modify();
            }
            $this.validateValue(value);

            if (value !== null) {
                if (childrenContext === null) {
                    property.resetValue();
                    childrenContext = property.getValue();
                }
                for (var childName in value) {
                    if (value.hasOwnProperty(childName)) {
                        childrenContext.getProperty(childName).setValue(value[childName]);
                    }
                }
            } else {
                property._value = null;
            }

            // Invoking watchers

            property.invokeWatchers(newValue, oldValue);
        };
    };

    /**
     * Returns default values for all properties in schema
     *
     * @returns {Object}
     */
    MapType.prototype.getDefaultValue = function()
    {
        var defaultValue = {};
        var children = this.getChildren();

        for (var propName in children) {
            if (children.hasOwnProperty(propName)) {
                defaultValue[propName] = children[propName].getDefaultValue();
            }
            //if (children[propName].getDefaultValue) {
            //    schemaValues[propName] = children[propName].getDefaultValue();
            //
            //} else {
            //    schemaValues[propName] = children[propName].getDefaultValue();
            //}
        }
        return defaultValue;
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
        //var defaultValue = {};

        for (var propName in schema) {
            if (!schema.hasOwnProperty(propName)) {
                continue;
            }
            schema[propName] = propertyManager.normalizeTypeDefinition(schema[propName]);

            if (!this.isWritable()) {
                schema[propName].writable = false;
            }
            this.addChild(propName, schema[propName]);

            //defaultValue[propName] = property
            //    .getChild(propName)
            //    .getDefinition()
            //    .getDefault()
            //;
        }

        //this._setDefaultValues(defaultValue);
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
        var baseDefinition = MapType.$parent.prototype.getBaseData.call(this);

        /**
         * Defines available properties in value
         * @type {null}
         */
        baseDefinition.schema = null;

        /**
         * @inheritDoc
         */
        baseDefinition.nullable = false;

        return baseDefinition;
    };

    /**
     * Validating property definition
     */
    MapType.prototype.validateData = function()
    {
        MapType.$parent.prototype.validateData.call(this);

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

    ///**
    // * Sets default values for inner properties
    // *
    // * @param {*|Object} defaultValue
    // * @private
    // */
    //MapType.prototype._setDefaultValues = function(defaultValue)
    //{
    //    if (defaultValue !== null && Subclass.Tools.isPlainObject(defaultValue)) {
    //        var property = this.getProperty();
    //
    //        for (var propName in defaultValue) {
    //            if (!defaultValue.hasOwnProperty(propName)) {
    //                continue;
    //            }
    //            if (
    //                defaultValue[propName]
    //                && Subclass.Tools.isPlainObject(defaultValue[propName])
    //                && property.hasChild(propName)
    //                && property.getChild(propName).constructor.getPropertyTypeName() == "map"
    //            ) {
    //                property.getChild(propName)
    //                    .getDefinition()
    //                    ._setDefaultValues(defaultValue[propName])
    //                ;
    //            } else if (property.hasChild(propName)) {
    //                property.getChild(propName)
    //                    .getDefinition()
    //                    .setDefault(defaultValue[propName])
    //                ;
    //            }
    //        }
    //    }
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //MapType.prototype.processData = function()
    //{
    //    MapType.$parent.prototype.processData.call(this);
    //
    //    if (this.getValue() != undefined || this.getDefault() !== null) {
    //        this.getProperty().setIsNull(false);
    //    }
    //};



    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(MapType);

    return MapType;

}();
