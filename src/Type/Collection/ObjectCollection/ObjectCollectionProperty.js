/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionProperty}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionProperty = function()
{
    /**
     * @inheritDoc
     */
    function ObjectCollectionProperty()
    {
        ObjectCollectionProperty.$parent.apply(this, arguments);
    }

    ObjectCollectionProperty.$parent = Subclass.Property.Type.Collection.CollectionProperty;

    /**
     * @inheritDoc
     */
    ObjectCollectionProperty.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection;
    };

    return ObjectCollectionProperty;
}();