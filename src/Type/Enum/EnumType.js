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

    /**
     * @inheritDoc
     * @throws {Error}
     */
    EnumType.prototype.setNullable = function(nullable)
    {
        this.validateNullable(nullable);

        if (typeof nullable == 'boolean' && nullable) {
            Subclass.Error.create(
                'The "enum" type property ' + this + ' can\'t be nullable.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    EnumType.prototype.validateValue = function(value)
    {
        var allows = this.getAllows();

        if (allows.indexOf(value) < 0) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('one of the specified values [' + allows.join(", ") + ']')
                .apply()
            ;
        }
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

        /**
         * @inheritDoc
         */
        data.nullable = false;

        return data;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(EnumType);

    return EnumType;

}();
