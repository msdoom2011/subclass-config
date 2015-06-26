/**
 * @class
 * @constructor
 */
Subclass.Property.Type.Collection.CollectionItems = function()
{
    function CollectionItems(collection)
    {
        if (!collection || !(collection instanceof Subclass.Property.Type.Collection.Collection)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the collection instance', false)
                .received(collection)
                .expected('an instance of "Subclass.Property.Type.Collection.Collection"')
                .apply()
            ;
        }

        /**
         * @type {Subclass.Property.Collection.Collection}
         * @private
         */
        this._collection = collection;

        /**
         * @type {Object.<Subclass.Property.Property>}
         * @private
         */
        this._items = {};
    }

    CollectionItems.prototype = {

        /**
         * Returns the instance of current property or the instance of its items
         *
         * @param {string} [itemKey]
         *      The name of item property which you want to get
         *
         * @returns {*}
         */
        getProperty: function (itemKey)
        {
            if (!arguments.length) {
                return this._collection._property;
            }
            return this._items[itemKey];
        },

        /**
         * Checks whether the item property with specified name is exists
         *
         * @param {string} itemKey
         *      The name of child property
         *
         * @returns {boolean}
         */
        issetProperty: function (itemKey)
        {
            return this.getItems().hasOwnProperty(itemKey);
        },

        /**
         * Returns the type of children context
         *
         * @returns {string}
         */
        getContextType: function ()
        {
            return 'property';
        },

        attachItem: function (key, value)
        {
            var collectionItemProtoInstance = this._collection._property.getDefinition().getProtoInstance();

            this._items[key] = collectionItemProtoInstance.createInstance(key);
            this._items[key].setContext(this);
            this._items[key].resetValue(false);

            if (value !== undefined) {
                this._items[key].setValue(value, false);
            }
        },

        /**
         * Returns all map property children
         *
         * @returns {Object.<Subclass.Property.Property>}
         */
        getItems: function ()
        {
            return this._items;
        },

        getItem: function(key)
        {
            return this.getProperty(key);
        },

        issetItem: function(key)
        {
            return this.issetProperty(key);
        },

        /**
         * Removes the collection item
         *
         * @param {string} key
         */
        removeItem: function(key)
        {
            delete this.getItems()[key];
        },

        /**
         * Removes all collection items
         */
        removeItems: function()
        {
            var items = this.getItems();

            for (var key in items) {
                if (items.hasOwnProperty(key)) {
                    this.removeItem(key);
                }
            }
        },

        /**
         * Returns the count of items in collection
         *
         * @returns {Number}
         */
        getLength: function ()
        {
            return Object.keys(this.getItems()).length;
        }
    };

    return CollectionItems;

}();