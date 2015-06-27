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
         * @type {Object.<Subclass.Property.Property>}
         * @private
         */
        this._items = null;


        // Initializing operations

        this._resetItems();

        ///**
        // * List of collection items
        // *
        // * @type {Subclass.Property.Type.Collection.CollectionItems}
        // * @private
        // */
        //this._items = Subclass.Tools.createClassInstance(Collection.getCollectionItemsClass(), this);

        //
        ///**
        // * Collection property context
        // *
        // * @type {Object}
        // * @private
        // */
        //this._context = property.getContext();
        //
        ///**
        // * Instance of collection manager
        // *
        // * @type {Subclass.Property.Type.Collection.CollectionManager}
        // * @private
        // */
        //this._manager = Subclass.Tools.createClassInstance(Subclass.Property.Type.Collection.CollectionManager, this);
    }

    Collection.getCollectionItemsClass = function()
    {
        return Subclass.Property.Type.Collection.CollectionItems;
    };

    //
    ///**
    // * Returns collection property instance to which current collection belongs to.
    // *
    // * @returns {Subclass.Property.Type.Collection.CollectionProperty}
    // */
    //Collection.prototype.getProperty = function()
    //{
    //    return this._property;
    //};
    //
    ///**
    // * Returns context object
    // *
    // * @returns {Object}
    // */
    //Collection.prototype.getContext = function()
    //{
    //    return this._context;
    //};
    //
    ///**
    // * Returns instance of collection manager
    // *
    // * @returns {Subclass.Property.Type.Collection.CollectionManager}
    // */
    //Collection.prototype.getManager = function()
    //{
    //    return this._manager;
    //};
    //
    ///**
    // * Returns clear data of collection item
    // *
    // * @param key
    // * @returns {*|PropertyType}
    // */
    //Collection.prototype.getItemData = function(key)
    //{
    //    var manager = this.getManager();
    //
    //    return manager.getItemProp(key).getValue(
    //        manager.getItems(),
    //        true
    //    );
    //};

    Collection.prototype._resetItems = function()
    {
        var itemsConstructor = this.constructor.getCollectionItemsClass();
        this._items = Subclass.Tools.createClassInstance(itemsConstructor, this);
    };

    ///**
    // * Attaches the new item to collection
    // *
    // * @param {string} key
    // * @param {*} value
    // * @returns {*}
    // * @private
    // */
    //Collection.prototype._attachItem = function(key, value)
    //{
    //    var collectionItemProtoInstance = this._property.getDefinition().getProtoInstance();
    //    this._items[key] = collectionItemProtoInstance.createInstance(key);
    //    this._items[key].setContext(this._items);
    //    this._items[key].resetValue(false);
    //
    //    if (value !== undefined) {
    //        this._items[key].setValue(value, false);
    //    }
    //
    //    return this[key];
    //};

    /**
     * Adds new item to collection
     *
     * @param {(string|number)} key
     * @param {*} value
     * @param {boolean} [normalize=true]
     */
    Collection.prototype.addItem = function(key, value, normalize)
    {
        if (this.issetItem(key)) {
            console.warn(
                'Trying to add already existent collection item with key "' + key + '" ' +
                'to property ' + this._property + '.'
            );
            return;
        }
        if (normalize !== false) {
            normalize = true;
        }
        this._items.attachItem(key, value);

        if (normalize) {
            this.normalizeItem(key);
        }
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
    Collection.prototype.validateItems = function(items)
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
     * Adds new items to collection
     *
     * @param {Object} items
     */
    Collection.prototype.addItems = function(items)
    {
        this.validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.addItem(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * Sets collection item. If item with specified key already exists, it will be replaced.
     *
     * @param {(string|number)} key
     * @param {*} value
     * @param {boolean} [normalize=true]
     */
    Collection.prototype.setItem = function(key, value, normalize)
    {
        if (normalize !== false) {
            normalize = true;
        }
        if (this.issetItem(key)) {
            this._items.getItem(key).setValue(value);

        } else {
            this._items.attachItem(key, value);
        }
        if (normalize) {
            this.normalizeItem(key);
        }
    };

    /**
     * Sets collection items. If items with specified keys already exist, they will be replaced.
     *
     * @param items
     */
    Collection.prototype.setItems = function(items)
    {
        this.validateItems(items);

        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.setItem(key, items[key], false);
            }
        }
        this.normalizeItems();
    };

    /**
     * Replaces collection items by the new items
     *
     * @param {Object} items
     */
    Collection.prototype.replaceItems = function(items)
    {
        this.validateItems(items);
        this.removeItems();
        this.setItems(items);
    };

    /**
     * Returns collection item with specified key
     *
     * @param {(string|number)} key
     * @returns {*}
     */
    Collection.prototype.getItem = function(key)
    {
        if (!this.issetItem(key)) {
            Subclass.Error.create(
                'Trying to get non existent collection item with key "' + key + '" ' +
                'in property ' + this._property + '.'
            );
        }
        return this._items.getItem(key).getValue();
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    Collection.prototype.removeItem = function(key)
    {
        var value = this._items.getItem(key).getData();
        this._items.removeItem(key);

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

        return data;
    };

    /**
     * Checks if item with specified key is existent.
     *
     * @param {(string|number)} key
     * @returns {boolean}
     */
    Collection.prototype.issetItem = function(key)
    {
        return this._items.issetItem(key);
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param {Function} callback
     *      Function that will perform each collection item
     */
    Collection.prototype.eachItem = function(callback)
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
        //var items = this.getManager().getItems();
        var items = this._items.getItems();

        for (var key in items) {
            if (!items.hasOwnProperty(key)) {
                continue;
            }
            if (callback(key, items[key].getValue()) === false) {
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

        this.eachItem(reverse, function(itemKey, itemValue) {
            if ((
                    testCallback
                    && testCallback(itemKey, itemValue) === true
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

        this.eachItem(function(itemKey, itemValue) {
            if (testCallback(itemKey, itemValue) === true) {
                items[itemKey] = itemValue;
            }
        });

        return items;
    };

    /**
     * Normalizes collection elements
     */
    Collection.prototype.normalizeItems = function()
    {
        var $this = this;

        this.eachItem(function(itemName, item) {
            $this.normalizeItem(itemName);
        });
    };

    /**
     * Normalizes specified collection item
     *
     * @param itemName
     * @returns {*}
     */
    Collection.prototype.normalizeItem = function(itemName)
    {
        // Do something

        return this.getItem(itemName);
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

    return Collection;

}();