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
     * @param {string} key
     * @param {*} value
     * @param {boolean} normalize
     */
    ObjectCollection.prototype.add = function(key, value, normalize)
    {
        if (!key || typeof key != 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument('the key of object collection item', false)
                .expected('a string')
                .received(key)
                .apply()
            ;
        }
        if (arguments.length < 2) {
            Subclass.Error.create(
                'Method Subclass.Property.Type.Collection.ObjectCollection.ObjectCollection#add ' +
                'requires at least two arguments.'
            );
        }
        if (ObjectCollection.$parent.prototype.add.apply(this, arguments) === false) {
            return false;
        }
        if (normalize !== false) {
            this.normalize(key);
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.addItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.add(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * @inheritDoc
     *
     * @param {string} key
     * @param {*} value
     * @param {boolean} normalize
     */
    ObjectCollection.prototype.set = function(key, value, normalize)
    {
        if (ObjectCollection.$parent.prototype.set.apply(this, arguments) === false) {
            return false;
        }
        if (normalize !== false) {
            this.normalize(key);
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollection.prototype.setItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.set(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * Normalizes collection elements
     */
    ObjectCollection.prototype.normalizeItems = function()
    {
        var $this = this;

        this.forEach(function(itemValue, itemKey) {
            $this.normalize(itemKey);
        });
    };

    /**
     * Normalizes specified collection item
     *
     * @param itemName
     * @returns {*}
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
        delete itemData.extends;

        function prepareItemData(itemProperty, itemData)
        {
            if (itemProperty.getType() == 'map') {
                var children = itemProperty.getChildren();

                for (var childName in children) {
                    if (!children.hasOwnProperty(childName)) {
                        continue;
                    }
                    if (!children[childName].isDefaultValue()) {
                        prepareItemData(children[childName], itemData[childName]);

                    } else {
                        delete itemData[childName];
                    }
                }
            }
        }

        for (var propName in itemData) {
            if (!itemData.hasOwnProperty(propName)) {
                continue;
            }
            var itemChild = this._items.get(itemName).getChild(propName);

            if (itemChild.isDefaultValue()) {
                delete itemData[propName];
            } else {
                prepareItemData(itemChild, itemData[propName]);
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