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
            return;
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
