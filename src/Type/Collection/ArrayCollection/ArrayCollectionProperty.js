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

    ArrayCollectionProperty.prototype = {

        /**
         * @inheritDoc
         */
        onCreateCollection: function(collection)
        {
            Object.defineProperty(collection, 'length', {
                enumerable: false,
                set: function() {},
                get: function() {
                    return collection.getLength();
                }
            });
        }
    };

    return ArrayCollectionProperty;
}();