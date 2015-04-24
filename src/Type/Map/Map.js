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
    function MapType(propertyManager, propertyName, propertyDefinition)
    {
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

        MapType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition
        );
    }

    MapType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    MapType.getPropertyTypeName = function()
    {
        return "map";
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
    MapType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Map.MapDefinition;
    };

    /**
     * @inheritDoc
     */
    MapType.getAPIClass = function()
    {
        return Subclass.Property.Type.Map.MapAPI;
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
     * Tells is property value null
     *
     * @returns {boolean}
     */
    MapType.prototype.isNull = function()
    {
        return this._isNull;
    };

    /**
     * Sets marker that tells that property value is null
     *
     * @param {boolean} isNull
     */
    MapType.prototype.setIsNull = function(isNull)
    {
        this._isNull = isNull;
    };

    /**
     * Returns list of children properties instances
     *
     * @returns {Object}
     */
    MapType.prototype.getChildren = function()
    {
        return Subclass.Tools.copy(this._children);
    };

    /**
     * Adds children property to current
     *
     * @param {string} childPropName
     * @param {Object} childPropDefinition
     * @returns {Subclass.Property.PropertyType}
     */
    MapType.prototype.addChild = function(childPropName, childPropDefinition)
    {
        return this._children[childPropName] = this.getPropertyManager().createProperty(
            childPropName,
            childPropDefinition,
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
        return !!this.getChild(childPropName);
    };

    /**
     * Returns data only of property value
     *
     * @param context
     * @returns {Object}
     */
    MapType.prototype.getData = function(context)
    {
        var value = MapType.$parent.prototype.getData.call(this, context);
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
    MapType.prototype.resetValue = function(context)
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

    /**
     * @inheritDoc
     */
    MapType.prototype.generateGetter = function()
    {
        var $this = this;

        return function() {
            if ($this.isNull()) {
                return null;
            }
            return this[$this.getNameHashed()];
        };
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.generateSetter = function()
    {
        var $this = this;

        return function(value) {
            if ($this.isLocked()) {
                return console.warn(
                    'Trying to set new value for the ' +
                    'property ' + $this + ' that is locked for write.'
                );
            }
            var oldValue = $this.getData(this);
            var newValue = value;

            $this.validateValue(value);
            $this.setIsModified(true);

            if (value !== null) {
                $this.setIsNull(false);

                for (var childPropName in value) {
                    if (value.hasOwnProperty(childPropName)) {
                        this[$this.getNameHashed()][childPropName] = value[childPropName];
                    }
                }
            } else {
                $this.resetValue(this);
                $this.setIsNull(true);
            }

            // Invoking watchers

            $this.invokeWatchers(this, newValue, oldValue);
        };
    };

    /**
     * @inheritDoc
     */
    MapType.prototype.attachHashed = function(context)
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
    MapType.prototype.attachChildren = function(context)
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

    MapType.prototype.attachMethods = function(context)
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
    MapType.prototype.getSchemaDefaultValue = function()
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

    Subclass.Property.PropertyManager.registerPropertyType(MapType);

    return MapType;

})();