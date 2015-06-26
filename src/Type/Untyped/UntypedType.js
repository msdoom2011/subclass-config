/**
 * @namespace
 */
Subclass.Property.Type.Untyped = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Untyped.UntypedType = (function()
{
    /**
     * @inheritDoc
     */
    function UntypedType()
    {
        UntypedType.$parent.apply(this, arguments);
    }

    UntypedType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    UntypedType.getName = function()
    {
        return "untyped";
    };

    /**
     * @inheritDoc
     */
    UntypedType.prototype.getBaseData = function()
    {
        var baseData = UntypedType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = null;

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();
