/**
 * @namespace
 */
Subclass.Property.Type.Map = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Map.Map = (function()
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
    //function MapType(propertyManager, propertyName, propertyDefinition)
    function MapProperty()
    {
        MapProperty.$parent.apply(this, arguments);

        /**
         * @type {Object.<PropertyType>}
         * @private
         */
        this._children = {};

        /**
         * @type {boolean}
         * @private
         */
        this._isNull = true;

        //MapType.$parent.call(
        //    this,
        //    propertyManager,
        //    propertyName,
        //    propertyDefinition
        //);
    }

    MapProperty.$parent = Subclass.Property.Property;
    //
    ///**
    // * @inheritDoc
    // */
    //MapProperty.getPropertyTypeName = function()
    //{
    //    return "map";
    //};
    //
    ///**
    // * @inheritDoc
    // * @throws {Error}
    // */
    //MapProperty.parseRelatedClasses = function(propertyDefinition)
    //{
    //    if (!propertyDefinition.schema) {
    //        return;
    //    }
    //    var requires = [];
    //
    //    for (var propName in propertyDefinition.schema) {
    //        if (
    //            !propertyDefinition.schema.hasOwnProperty(propName)
    //            || typeof propertyDefinition.schema[propName] != 'object'
    //            || !propertyDefinition.schema[propName].type
    //        ) {
    //            continue;
    //        }
    //        var propDef = propertyDefinition.schema[propName];
    //        var propertyType = Subclass.Property.PropertyManager.getPropertyType(propDef.type);
    //
    //        if (!propertyType.parseRelatedClasses) {
    //            continue;
    //        }
    //        var requiredClasses = propertyType.parseRelatedClasses(propDef);
    //
    //        if (requiredClasses && requiredClasses.length) {
    //            requires = requires.concat(requiredClasses);
    //        }
    //    }
    //    return requires;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //MapProperty.getDefinitionClass = function()
    //{
    //    return Subclass.Property.Type.Map.MapDefinition;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //MapProperty.getAPIClass = function()
    //{
    //    return Subclass.Property.Type.Map.MapAPI;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //MapProperty.getEmptyDefinition = function()
    //{
    //    return false;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //MapProperty.normalizeDefinition = function(definition)
    //{
    //    if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
    //        var fullDefinition = {};
    //        var isNullable = false;
    //
    //        if (definition[0]) {
    //            fullDefinition.type = definition[0];
    //        }
    //        if (definition.length >= 2) {
    //            fullDefinition.schema = definition[1];
    //        }
    //        if (definition.length >= 3) {
    //            fullDefinition.default = definition[2];
    //
    //            if (definition[2] === null) {
    //                isNullable = true;
    //            }
    //        }
    //        if (definition.length >= 4) {
    //            fullDefinition.writable = definition[3];
    //        }
    //        if (definition.length == 5) {
    //            fullDefinition.nullable = definition[4];
    //        }
    //        if (isNullable) {
    //            fullDefinition.nullable = true;
    //        }
    //        return fullDefinition;
    //    }
    //    return definition;
    //};

    /**
     * Tells is property value null
     *
     * @returns {boolean}
     */
    MapProperty.prototype.isNull = function()
    {
        return this._isNull;
    };

    /**
     * Sets marker that tells that property value is null
     *
     * @param {boolean} isNull
     */
    MapProperty.prototype.setIsNull = function(isNull)
    {
        this._isNull = isNull;
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

    //
    ///**
    // * Returns list of children properties instances
    // *
    // * @returns {Object}
    // */
    //MapProperty.prototype.getChildren = function()
    //{
    //    return Subclass.Tools.copy(this._children);
    //    //return this.getValue().getProperties();
    //};
    //
    ///**
    // * Adds children property to current
    // *
    // * @param {string} childPropName
    // * @param {Object} childPropDefinition
    // * @returns {Subclass.Property.PropertyType}
    // */
    //MapProperty.prototype.addChild = function(childPropName, childPropDefinition)
    //{
    //    return this._children[childPropName] = this.getPropertyManager().createProperty(
    //        childPropName,
    //        childPropDefinition,
    //        this.getContextClass(),
    //        this
    //    );
    //};
    //
    ///**
    // * Returns children property instance
    // *
    // * @param {string} childPropName
    // * @returns {Subclass.Property.PropertyType}
    // */
    //MapProperty.prototype.getChild = function(childPropName)
    //{
    //    return this._children[childPropName];
    //};
    //
    ///**
    // * Checks if child property with specified name was registered
    // *
    // * @param {string} childPropName
    // * @returns {boolean}
    // */
    //MapProperty.prototype.hasChild = function(childPropName)
    //{
    //    return !!this.getChild(childPropName);
    //};

    MapProperty.prototype.createMap = function()
    {
        var $this = this;

        function Map(mapProperty)
        {
            // Do something
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
            return $this.getChildren()[childName];
        };

        return Subclass.Tools.createClassInstance(Map);
    };

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
     * Returns data only of property value
     *
     * @param context
     * @returns {Object}
     */
    MapProperty.prototype.getData = function(context)
    {
        var value = MapProperty.$parent.prototype.getData.call(this, context);
        var valueClear = {};

        for (var propName in value) {
            if (!value.hasOwnProperty(propName)) {
                continue;
            }
            if (
                value[propName]
                && (
                    Subclass.Tools.isPlainObject(value[propName])
                    && value[propName].getData
                ) || (
                    value[propName] instanceof Subclass.Property.Type.Collection.Collection
                )
            ) {
                valueClear[propName] = value[propName].getData();

            } else {
                valueClear[propName] = value[propName];
            }
        }

        return valueClear;
    };

    /**
     * @inheritDoc
     */
    MapProperty.prototype.resetValue = function(context)
    {
        var hashedName = this.getNameHashed();
        var defaultValue = this.getDefaultValue();
        var children = this.getChildren();

        for (var childName in children) {
            if (children.hasOwnProperty(childName)) {
                children[childName].resetValue(context[hashedName]);
            }
        }
        this.setValue(context, defaultValue);
    };
    //
    ///**
    // * @inheritDoc
    // */
    //MapProperty.prototype.generateGetter = function()
    //{
    //    var $this = this;
    //
    //    return function() {
    //        if ($this.isNull()) {
    //            return null;
    //        }
    //        return this[$this.getNameHashed()];
    //    };
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //MapProperty.prototype.generateSetter = function()
    //{
    //    var $this = this;
    //
    //    return function(value) {
    //        if ($this.isLocked()) {
    //            return console.warn(
    //                'Trying to set new value for the ' +
    //                'property ' + $this + ' that is locked for write.'
    //            );
    //        }
    //        var oldValue = $this.getData(this);
    //        var newValue = value;
    //
    //        $this.validateValue(value);
    //        $this.setIsModified(true);
    //
    //        if (value !== null) {
    //            $this.setIsNull(false);
    //
    //            for (var childPropName in value) {
    //                if (value.hasOwnProperty(childPropName)) {
    //                    this[$this.getNameHashed()][childPropName] = value[childPropName];
    //                }
    //            }
    //        } else {
    //            $this.resetValue(this);
    //            $this.setIsNull(true);
    //        }
    //
    //        // Invoking watchers
    //
    //        $this.invokeWatchers(this, newValue, oldValue);
    //    };
    //};

    /**
     * @inheritDoc
     */
    MapProperty.prototype.attachHashed = function(context)
    {
        var hashedPropName = this.getNameHashed();

        Object.defineProperty(context, hashedPropName, {
            writable: this.getDefinition().isWritable(),
            configurable: true,
            value: {}
        });
        this.attachChildren(context);
        this.attachMethods(context);

        Object.seal(context[hashedPropName]);
    };

    /**
     * Attaches children property to current property
     *
     * @param {Object} context
     */
    MapProperty.prototype.attachChildren = function(context)
    {
        var propertyNameHashed = this.getNameHashed();
        var childrenContext = context[propertyNameHashed];
        var children = this._children;

        for (var childPropName in children) {
            if (!children.hasOwnProperty(childPropName)) {
                continue;
            }
            children[childPropName].attach(childrenContext);
        }
    };

    MapProperty.prototype.attachMethods = function(context)
    {
        var $this = this;
        var propName;

        if ($this.getDefinition().isAccessors()) {
            propName = $this.getNameHashed();

        } else {
            propName = $this.getName();
        }

        if (context[propName] === null) {
            context[propName] = {};
        }

        Object.defineProperties(context[propName], {
            getData: {
                configurable: true,
                value: function() {
                    return $this.getAPI(context).getData();
                }
            },
            getChild: {
                configurable: true,
                value: function(childName) {
                    return $this.getAPI(context).getChild(childName);
                }
            },
            getChildren: {
                configurable: true,
                value: function() {
                    return $this.getAPI(context).getChildren();
                }
            }
        });
    };

    /**
     * Returns default values for all properties in schema
     *
     * @returns {Object}
     */
    MapProperty.prototype.getSchemaDefaultValue = function()
    {
        var schemaValues = {};
        var children = this._children;

        for (var propName in children) {
            if (!children.hasOwnProperty(propName)) {
                continue;
            }
            if (children[propName].getSchemaDefaultValue) {
                schemaValues[propName] = children[propName].getSchemaDefaultValue();

            } else {
                schemaValues[propName] = children[propName].getDefaultValue();
            }
        }
        return schemaValues;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(MapProperty);

    return MapProperty;

})();