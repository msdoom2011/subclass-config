/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionType = (function()
{
    /*************************************************/
    /*   Describing property type "ArrayCollection"  */
    /*************************************************/

    /**
     * @inheritDoc
     */
    function ArrayCollectionType()
    {
        ArrayCollectionType.$parent.apply(this, arguments);
    }

    ArrayCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.getName = function()
    {
        return "arrayCollection";
    };

    ArrayCollectionType.getPropertyClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionProperty;
    };

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ArrayCollectionType.prototype.validateValue = function(value)
    {
        ArrayCollectionType.$parent.prototype.validateValue.apply(this, arguments);

        if (value === null) {
            return;
        }

        if (!value || typeof value != 'object' || !Array.isArray(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('an array')
                .apply()
            ;
        }
    };

    ArrayCollectionType.prototype.validateDefault = ArrayCollectionType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getBaseData = function()
    {
        var baseData = ArrayCollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = [];

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ArrayCollectionType);

    return ArrayCollectionType;

})();