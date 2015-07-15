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
        baseData.nullable = false;

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
