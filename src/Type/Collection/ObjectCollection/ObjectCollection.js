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
    ObjectCollection.prototype.normalizeItem = function(itemName)
    {
        //var item = this.getItemData(itemName);
        //var manager = this.getManager();
        var itemData = this._items.getItem(itemName).getData();

        if (
            this.getProperty().getProto().constructor.getPropertyTypeName() != 'map'
            || !itemData.extends
        ) {
            return itemData;
        }
        if (!this.issetItem(itemData.extends)) {
            Subclass.Error.create(
                'Trying to extend object collection element "' + itemName + '" ' +
                'by non existent another collection element with key "' + itemData.extends + '".'
            );
        }
        var parentItem = Subclass.Tools.copy(this.normalizeItem(itemData.extends));
        itemData.extends = null;

        for (var propName in itemData) {
            if (!itemData.hasOwnProperty(propName)) {
                continue;
            }
            //var itemChild = manager.getItemProp(itemName).getChild(propName);
            var itemChild = this._items.getItem(itemName).getChild(propName);

            if (itemChild.isDefaultValue()) {
                delete itemData[propName];
            }
        }

        itemData = Subclass.Tools.extendDeep(parentItem, itemData);
        this.setItem(itemName, itemData);

        return itemData;
    };

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.getData = function()
    {
        var collectionItems = {};
        var $this = this;

        this.eachItem(function(itemName) {
            collectionItems[itemName] = $this._items.getItem(itemName).getData();
        });

        return collectionItems;
    };

    return ObjectCollection;

})();