/**
 * @class
 * @extends {Subclass.Property.Type.Collection.Collection}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection = (function()
{
    /**
     * @inheritDoc
     */
    function ObjectCollection()
    {
        ObjectCollection.$parent.apply(this, arguments);
    }

    ObjectCollection.$parent = Subclass.Property.Type.Collection.Collection;

    /**
     * @inheritDoc
     *
     * @returns {Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection}
     */
    ObjectCollection.prototype.normalize = function(itemName)
    {
        var itemData = this._items.get(itemName).getData();

        if (
            this._property.getDefinition().getProto().type != 'map'
            || !itemData.extends
        ) {
            return itemData;
        }
        if (!this.isset(itemData.extends)) {
            Subclass.Error.create(
                'Trying to extend object collection element "' + itemName + '" ' +
                'by non existent another collection element with key "' + itemData.extends + '".'
            );
        }
        var parentItem = Subclass.Tools.copy(this.normalize(itemData.extends));
        itemData.extends = null;

        for (var propName in itemData) {
            if (!itemData.hasOwnProperty(propName)) {
                continue;
            }
            var itemChild = this._items.get(itemName).getChild(propName);

            if (itemChild.isDefaultValue()) {
                delete itemData[propName];
            }
        }

        itemData = Subclass.Tools.extendDeep(parentItem, itemData);
        this.set(itemName, itemData);

        return itemData;
    };

    /**
     * Returns all collection items keys
     *
     * @returns {string[]}
     */
    ObjectCollection.prototype.keys = function()
    {
        return Object.keys(this._items.getItems());
    };

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.getData = function()
    {
        var collectionItems = {};
        var $this = this;

        this.forEach(function(itemValue, itemName) {
            collectionItems[itemName] = $this._items.get(itemName).getData();
        });

        return collectionItems;
    };

    return ObjectCollection;

})();