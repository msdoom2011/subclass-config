/**
 * @namespace
 */
Subclass.Property.Type.Function = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Function.FunctionType = (function()
{
    /**
     * @inheritDoc
     */
    function FunctionType()
    {
        FunctionType.$parent.apply(this, arguments);
    }

    FunctionType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    FunctionType.getName = function()
    {
        return "function";
    };

    /**
     * @inheritDoc
     */
    FunctionType.prototype.validateValue = function(value)
    {
        FunctionType.$parent.prototype.validateValue.apply(this, arguments);

        if (value && typeof value != 'function') {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected("a function")
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    FunctionType.prototype.validateDefault = FunctionType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    FunctionType.prototype.getBaseData = function()
    {
        var baseData = FunctionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData['default'] = function() {};

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(FunctionType);

    return FunctionType;

})();
