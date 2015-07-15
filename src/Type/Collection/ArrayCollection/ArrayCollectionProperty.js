/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionProperty}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionProperty = function()
{
    /**
     * @inheritDoc
     */
    function ArrayCollectionProperty()
    {
        ArrayCollectionProperty.$parent.apply(this, arguments);
    }

    ArrayCollectionProperty.$parent = Subclass.Property.Type.Collection.CollectionProperty;

    /**
     * @inheritDoc
     */
    ArrayCollectionProperty.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection;
    };

    return ArrayCollectionProperty;
}();