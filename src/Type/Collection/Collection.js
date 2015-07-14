/**
 * @class
 */
Subclass.Property.Type.Collection.Collection = function()
{
    /**
     * @param {CollectionType} property
     * @constructor
     */
    function Collection(property)
    {
        if (!property || !(property instanceof Subclass.Property.Property)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the property instance', false)
                .received(property)
                .expected('an instance of "Subclass.Property.Property" class')
                .apply()
            ;
        }

        /**
         * Property instance
         *
         * @type {Subclass.Property.Type.Collection.CollectionProperty}
         * @private
         */
        this._property = property;

        /**
         * Instance of items collection manager
         *
         * @type {Object.<Subclass.Property.Type.Collection.CollectionItems>}
         * @private
         */
        this._items = null;

        /**
         * Indicates whether current collection instance can be marked as modified
         *
         * @type {boolean}
         * @private
         */
        this._allowModifying = true;


        // Initializing operations

        this._resetItems();
    }

    /**
     * Returns constructor of collection items class
     *
     * @returns {Subclass.Property.Type.Collection.CollectionItems|*}
     */
    Collection.getCollectionItemsClass = function()
    {
        return Subclass.Property.Type.Collection.CollectionItems;
    };

    /**
     * Resets the collection items creating the new collection items class instance
     *
     * @private
     */
    Collection.prototype._resetItems = function()
    {
        var itemsConstructor = this.constructor.getCollectionItemsClass();
        this._items = Subclass.Tools.createClassInstance(itemsConstructor, this);
    };

    /**
     * Checks whether current items collection is initialized
     *
     * @returns {boolean}
     */
    Collection.prototype.isAllowsModifying = function()
    {
        return this._allowModifying;
    };

    /**
     * Allows for current collection property to be marked as modified
     */
    Collection.prototype.allowModifying = function()
    {
        this._allowModifying = true;
    };

    /**
     * Denies for current collection property to be marked as modified
     */
    Collection.prototype.denyModifying = function()
    {
        this._allowModifying = false;
    };

    /**
     * Validates collection items
     *
     * @throws {Error}
     *      Throws error if specified value is invalid
     *
     * @param {*} items
     * @returns {boolean}
     */
    Collection.prototype._validateItems = function(items)
    {
        if (!Subclass.Tools.isPlainObject(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the items in object collection ' + this._property, false)
                .received(items)
                .expected('a plain object')
                .apply()
            ;
        }
        return true;
    };

    /**
     * Adds new item to collection
     *
     * @param {(string|number)} key
     * @param {*} value
     */
    Collection.prototype.add = function(key, value)
    {
        if (this.isset(key)) {
            console.warn(
                'Trying to add already existent collection item with key "' + key + '" ' +
                'to property ' + this._property + '.'
            );
            return false;
        }
        this._property
            .getDefinition()
            .getProtoInstance()
            .validateValue(value)
        ;
        this._items.attach(key, value);

        if (this.isAllowsModifying()) {
            this._property.modify();
        }
    };

    /**
     * Adds new items to collection
     *
     * @param {Object} items
     */
    Collection.prototype.addItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.add(key, items[key]);
            }
        }
    };

    /**
     * Sets collection item. If item with specified key already exists, it will be replaced.
     *
     * @param {(string|number)} key
     * @param {*} value
     */
    Collection.prototype.set = function(key, value)
    {
        if (this.isset(key)) {
            this._items.get(key).setValue(value, this.isAllowsModifying());

        } else {
            this._property
                .getDefinition()
                .getProtoInstance()
                .validateValue(value)
            ;
            this._items.attach(key, value);
        }
        if (this.isAllowsModifying()) {
            this._property.modify();
        }
    };

    /**
     * Sets collection items. If items with specified keys already exist, they will be replaced.
     *
     * @param items
     */
    Collection.prototype.setItems = function(items)
    {
        this._validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.set(key, items[key]);
            }
        }
    };

    /**
     * Replaces collection items by the new items
     *
     * @param {Object} items
     */
    Collection.prototype.replaceItems = function(items)
    {
        this._validateItems(items);
        this.removeItems();
        this.setItems(items);
    };

    /**
     * Returns collection item with specified key
     *
     * @param {(string|number)} key
     * @returns {*}
     */
    Collection.prototype.get = function(key)
    {
        if (!this.isset(key)) {
            Subclass.Error.create(
                'Trying to get non existent collection item with key "' + key + '" ' +
                'in property ' + this._property + '.'
            );
        }
        return this._items.get(key).getValue();
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    Collection.prototype.remove = function(key)
    {
        var value = this._items.get(key).getData();
        this._items.remove(key);

        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return value;
    };

    /**
     * Removes and returns all items from collection
     *
     * @returns {Object}
     */
    Collection.prototype.removeItems = function()
    {
        var data = this.getData();
        this._resetItems();

        if (this.isAllowsModifying()) {
            this._property.modify();
        }

        return data;
    };

    /**
     * Checks if item with specified key is existent.
     *
     * @param {(string|number)} key
     * @returns {boolean}
     */
    Collection.prototype.isset = function(key)
    {
        return this._items.isset(key);
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param {Function} callback
     *      Function that will perform each collection item
     */
    Collection.prototype.forEach = function(callback)
    {
        if (arguments.length == 2 && typeof arguments[1] == 'function') {
            callback = arguments[1];
        }
        if (typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var items = this._items.getItems();

        for (var key in items) {
            if (!items.hasOwnProperty(key)) {
                continue;
            }
            if (callback(items[key].getValue(), key) === false) {
                break;
            }
        }
    };

    /**
     * Searches item in collection by the value or by the result of test function
     *
     * @param {(function|*)} value
     *      If value will passed then searching
     *      will compare specified value with value of every collection item
     *      until match is not successful.
     *
     *      If function will passed then every collection item value will
     *      tests by this testing function until it not returns true.
     *
     * @param {boolean} reverse
     *      If specified the searching item will start from the end of collection
     *
     * @returns {boolean}
     */
    Collection.prototype.indexOf = function(value, reverse)
    {
        var testCallback = typeof value == 'function' ? value : false;
        var key = null;

        if (reverse !== true) {
            reverse = false;
        }

        this.forEach(reverse, function(itemValue, itemKey) {
            if ((
                    testCallback
                    && testCallback(itemValue, itemKey) === true
                ) || (
                    !testCallback
                    && value == itemValue
                )
            ) {
                key = itemKey;
                return false;
            }
        });

        return key;
    };

    /**
     * Filters collection using passed callback function
     *
     * @param testCallback
     * @returns {(Array|Object)}
     */
    Collection.prototype.filter = function(testCallback)
    {
        if (!testCallback || typeof testCallback !== 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the testing callback', false)
                .received(testCallback)
                .expected('a function')
                .apply()
            ;
        }
        var items = {};

        this.forEach(function(itemValue, itemKey) {
            if (testCallback(itemValue, itemKey) === true) {
                items[itemKey] = itemValue;
            }
        });

        return items;
    };

    /**
     * Returns length of collection
     *
     * @returns {Number}
     */
    Collection.prototype.getLength = function()
    {
        return this._items.getLength();
    };

    /**
     * Returns collection value
     *
     * @returns {Object}
     */
    Collection.prototype.getData = function()
    {
        Subclass.Error.create('NotImplementedMethod')
            .className('Subclass.Property.Type.Collection.Collection')
            .method('getData')
            .apply()
        ;
    };

    /**
     * @inheritDoc
     */
    Collection.prototype.toString = function()
    {
        return this.getData().toString();
    };

    /**
     * @inheritDoc
     */
    Collection.prototype.valueOf = function()
    {
        return this.getData();
    };

    return Collection;

}();