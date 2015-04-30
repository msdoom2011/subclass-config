/**
 * @namespace
 */
Subclass.Property.Type.Function = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Function.FunctionDefinition = (function()
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
    FunctionType.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : function() {};
    };

    /**
     * @inheritDoc
     */
    FunctionType.prototype.validateValue = function(value)
    {
        FunctionType.$parent.prototype.validateValue.call(this, value);

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


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(FunctionType);

    return FunctionType;

})();
