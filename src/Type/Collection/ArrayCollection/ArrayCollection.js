/**
 * @class
 * @extends {Subclass.Property.Type.Collection.Collection}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection = (function()
{
    /**
     * @inheritDoc
     */
    function ArrayCollection()
    {
        ArrayCollection.$parent.apply(this, arguments);
    }

    ArrayCollection.$parent = Subclass.Property.Type.Collection.Collection;

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype._validateItems = function(items)
    {
        if (!Array.isArray(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the collection items for property ' + this._property, false)
                .received(items)
                .expected('an array')
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     * @param {Array} items
     */
    ArrayCollection.prototype.addItems = function(items)
    {
        if (!Array.isArray(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the items for array collection in property ' + this._property, false)
                .received(items)
                .expected('an array')
                .apply()
            ;
        }
        var itemsNew = {};

        for (var i = 0; i < items.length; i++) {
            itemsNew[String(i)] = items[i];
        }
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                this.add(items[key]);
            }
        }
    };

    /**
     * @inheritDoc
     * @param {*} value
     */
    ArrayCollection.prototype.add = function(value)
    {
        if (arguments.length == 2) {
            value = arguments[1];
        }
        if (arguments.length) {
            this._property
                .getDefinition()
                .getProtoInstance()
                .validateValue(value)
            ;
        }
        this._items.attach(
            String(this.getLength()),
            value
        );
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.setItems = function(items)
    {
        if (!Array.isArray(items)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the items for array collection in property ' + this._property, false)
                .received(items)
                .expected('an array')
                .apply()
            ;
        }
        for (var i = 0; i < items.length; i++) {
            if (this.isset(i)) {
                this.set(i, items[i]);
            } else {
                this.add(items[i]);
            }
        }
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.set = function(key, value)
    {
        key = parseInt(key);

        if (isNaN(key)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the index of array collection item', false)
                .received(key)
                .expected('a number')
                .apply()
            ;
        }
        if (this.length < key) {
            for (var i = this.length; i < key; i++) {
                this.add();
            }
        }
        ArrayCollection.$parent.prototype.set.call(
            this, String(key), value
        );
    };

    /**
     * @inheritDoc
     *
     * @param {number} index
     */
    ArrayCollection.prototype.get = function(index)
    {
        if (!this.isset(index)) {
            Subclass.Error.create(
                'Trying to get non existent array element with index "' + index + '" ' +
                'in property ' + this._property + '.'
            );
        }
        return this._items.get(index).getValue();
    };

    /**
     * Removes collection items
     *
     * @param {number} [indexStart]
     *      The index of collection item from which (including it)
     *      the other collection items further will be removed
     *
     * @param {number} [length]
     *      The length of collection items which will be removed
     *      from the indexStart (including collection item with start index)
     */
    ArrayCollection.prototype.removeItems = function(indexStart, length)
    {
        if (!arguments.length) {
            return ArrayCollection.$parent.prototype.removeItems.call(this);
        }
        if (!this.isset(indexStart)) {
            return;
        }
        if (arguments.length == 1) {
            length = this.length;
        }
        if (length < 0) {
            Subclass.Error.create('InvalidArgument')
                .argument('the length of items to remove', false)
                .expected('a positive number')
                .received(length)
                .apply()
            ;
        }
        var indexEnd = indexStart + length - 1;
        var i;

        if (indexEnd >= this.length - 1) {
            for (i = this.length - 1; i >= indexStart; i--) {
                this.remove(i);
            }
        } else {
            for (i = 0; i < length; i++) {
                this.remove(indexStart);
            }
        }
    };

    /**
     * Removes item with specified key from collection
     *
     * @param {(string|number)} key
     */
    ArrayCollection.prototype.remove = function(key)
    {
        key = parseInt(key);

        var items = this._items.getItems();
        var length = this.length;
        var $this = this;
        var value = false;

        this.forEach(function(itemValue, itemIndex) {
            if (itemIndex == key) {
                value = ArrayCollection.$parent.prototype.remove.call($this, key);

            } else if (itemIndex > key) {
                var newKey = String(itemIndex - 1);
                var itemProperty = $this._items.get(itemIndex);

                itemProperty.rename(newKey);
                items[newKey] = itemProperty;
            }
        });

        if (this.length == length) {
            this.pop();
        }

        return value;
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.isset = function(key)
    {
        if (isNaN(parseInt(key))) {
            Subclass.Error.create('InvalidArgument')
                .argument('the index of array collection item', false)
                .received(key)
                .expected('a number')
                .apply()
            ;
        }
        return this._items.isset(String(key));
    };

    /**
     * @alias Subclass.Property.Type.Collection.ArrayCollection#add
     */
    ArrayCollection.prototype.push = ArrayCollection.prototype.add;

    /**
     * Removes from array and returns the last item in collection
     *
     * @returns {(*|null)}
     */
    ArrayCollection.prototype.pop = function()
    {
        var length = this.length;

        if (!length) {
            return null;
        }
        return this.remove(length - 1);
    };

    /**
     * Removes from array and returns the first item in collection
     *
     * @returns {(*|null)}
     */
    ArrayCollection.prototype.shift = function()
    {
        var length = this.length;

        if (!length) {
            return null;
        }
        return this.remove(0);
    };

    /**
     * Adds new item to the start of array
     */
    ArrayCollection.prototype.unshift = function(value)
    {
        var items = this._items.getItems();
        var $this = this;

        this.forEach(true, function(itemValue, itemIndex) {
            var newKey = String(itemIndex + 1);
            var itemProperty = $this._items.get(itemIndex);

            itemProperty.rename(newKey);
            items[newKey] = itemProperty;
        });

        delete $this._items.remove(0);
        this.set(0, value);
    };

    /**
     * @inheritDoc
     */
    ArrayCollection.prototype.indexOf = function(value, reverse)
    {
        var key = ArrayCollection.$parent.prototype.indexOf.call(this, value, reverse);

        if (key === null) {
            return -1;
        }
        return parseInt(key);
    };

    /**
     * Searches item from the end of collection
     *
     * @param {*} value
     * @returns {(number|boolean)}
     */
    ArrayCollection.prototype.lastIndexOf = function(value)
    {
        return this.indexOf(value, true);
    };

    /**
     * Joins the elements of array collection into a string
     *
     * @param {string} separator
     * @returns {(*|string)}
     */
    ArrayCollection.prototype.join = function(separator)
    {
        var items = this.getData();

        return items.join.apply(items, arguments);
    };

    /**
     * Swaps collection items
     *
     * @param {number} index1
     * @param {number} index2
     */
    ArrayCollection.prototype.swap = function(index1, index2)
    {
        var items = this._items.getItems();
        var extraIndex = this.getLength();

        // Renaming item with index1 to extraIndex

        var itemProperty1 = this._items.get(index1);
        itemProperty1.rename(String(extraIndex));
        items[extraIndex] = itemProperty1;

        // Renaming item with index2 to index1

        var itemProperty2 = this._items.get(index2);
        itemProperty2.rename(String(index1));
        items[index1] = itemProperty2;

        // Renaming item with extraIndex to index2

        var itemPropertyExtra = this._items.get(extraIndex);
        itemPropertyExtra.rename(String(index2));
        items[index2] = itemPropertyExtra;

        // Removing collection item with extraIndex

        this.remove.call(this, extraIndex);
    };

    /**
     * Changes the order of array collection items to opposite
     */
    ArrayCollection.prototype.reverse = function()
    {
        var length = this.getLength();
        var lengthHalf = Math.ceil(length / 2);
        var $this = this;

        this.forEach(function(itemValue, itemIndex) {
            if (itemIndex >= lengthHalf) {
                return false;
            }
            var oppositeIndex = length - itemIndex - 1;
            $this.swap(itemIndex, oppositeIndex);
        });
    };

    /**
     * Sorts items
     *
     * @param {Function} compareFn
     */
    ArrayCollection.prototype.sort = function(compareFn)
    {
        var items = [];
        var itemsOrder = [];
        var orderedIndexes = [];

        this.forEach(function(item, index) {
            items[index] = item;
            itemsOrder[index] = item;
        });

        items.sort.apply(items, arguments);

        for (var i = 0; i < items.length; i++) {
            var newIndex = i;
            var oldIndex = itemsOrder.indexOf(items[i]);

            if (
                orderedIndexes.indexOf(newIndex) >= 0
                || orderedIndexes.indexOf(oldIndex) >= 0
            ) {
                continue;
            }
            orderedIndexes.push(newIndex);
            orderedIndexes.push(oldIndex);
            this.swap(newIndex, oldIndex);
        }
    };

    /**
     * Selects a part of an array, and returns the new array with selected items
     *
     * @param {number} start
     * @param {number} end
     * @returns {Array}
     */
    ArrayCollection.prototype.slice = function(start, end)
    {
        var items = [];

        this.forEach(function(item, index) {
            items[index] = item;
        });

        return items.slice.apply(items, arguments);
    };

    /**
    * Filters collection using passed callback function
    *
    * @param testCallback
    * @returns {(Array|Object)}
    */
    ArrayCollection.prototype.filter = function(testCallback)
    {
        if (!testCallback || typeof testCallback !== 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the testing callback', false)
                .received(testCallback)
                .expected('a function')
                .apply()
            ;
        }
        var items = [];

        this.forEach(function(itemValue, itemKey) {
            if (testCallback(itemValue, itemKey) === true) {
                items.push(itemValue);
            }
        });

        return items;
    };

    /**
     * Sorts out all collection items using passed callback function
     *
     * @param {boolean} [reverse]
     * @param {Function} callback
     */
    ArrayCollection.prototype.forEach = function(reverse, callback)
    {
        if (typeof reverse == 'function') {
            callback = reverse;
        }
        if (typeof callback != 'function') {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        if (reverse !== true) {
            reverse = false;
        }

        var keys = Object.keys(this._items.getItems());
        var $this = this;
        keys.sort();

        if (reverse) {
            keys.reverse();
        }

        keys.every(function(key) {
            if (callback($this._items.get(key).getValue(), parseInt(key)) === false) {
                return false;
            }
            return true;
        });
    };

    ArrayCollection.prototype.getData = function()
    {
        var collectionItems = [];
        var $this = this;

        this.forEach(function(value, key) {
            collectionItems[key] = $this._items.get(key).getData();
        });

        return collectionItems;
    };

    return ArrayCollection;

})();