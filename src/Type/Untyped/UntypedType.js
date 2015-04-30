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


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(UntypedType);

    return UntypedType;

})();
