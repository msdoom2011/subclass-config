/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Collection.CollectionProperty = function()
{
    /**
     * @inheritDoc
     * @constructor
     */
    function CollectionProperty()
    {
        CollectionProperty.$parent.apply(this, arguments);
    }

    CollectionProperty.$parent = Subclass.Property.Property;

    /**
     * Returns constructor of collection class which will operate with stored collection elements
     *
     * @returns {Function}
     */
    CollectionProperty.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.Collection;
    };

    CollectionProperty.prototype = {

        /**
         * @inheritDoc
         */
        setValue: function(value, markAsModified)
        {
            if (markAsModified !== false) {
                markAsModified = true;
            }
            if (this.isLocked()) {
                return console.warn(
                    'Trying to set new value for the ' +
                    'property ' + this + ' that is locked for write.'
                );
            }
            var collection = this.getValue();

            if (markAsModified) {
                var oldValue = this.getData();
                var newValue = value;

                if (!Subclass.Tools.isEqual(oldValue, newValue)) {
                    this.modify();
                }
            }
            this.getDefinition().validateValue(value);

            if (value !== null) {
                if (!collection) {
                    this._value = collection = this.createCollection();
                }
                collection.replaceItems(value);
                collection.normalizeItems();

            } else {
                this._value = null;
            }

            // Invoking watchers

            if (markAsModified) {
                this.invokeWatchers(newValue, oldValue);
            }
        },
        /**
         * @inheritDoc
         */
        resetValue: function(markAsModified)
        {
            if (markAsModified !== false) {
                markAsModified = true;
            }
            var value = this.getDefaultValue();

            if (value !== null) {
                value = this.createCollection();
            }
            if (markAsModified) {
                this.modify();
            }

            this._value = value;
        },

        /**
         * @inheritDoc
         */
        createCollection: function()
        {
            var propertyDefinition = this.getDefinition();
            var defaultValue = propertyDefinition.getDefault();
            var protoInstance = propertyDefinition.getProtoInstance();
            var collectionConstructor = this.constructor.getCollectionClass();
            var collection = Subclass.Tools.createClassInstance(collectionConstructor, this);

            // Altering collection

            Object.defineProperty(collection, 'length', {
                enumerable: false,
                set: function() {},
                get: function() {
                    return collection.getLength();
                }
            });

            // Setting default value

            if (defaultValue !== null) {
                for (var propName in defaultValue) {
                    if (!defaultValue.hasOwnProperty(propName)) {
                        continue;
                    }
                    if (!propertyDefinition.isWritable()) {
                        protoInstance.getDefinition().setWritable(false);
                    }
                    collection.add(propName, defaultValue[propName]);
                }
                collection.normalizeItems();
            }

            Object.seal(collection);

            return collection;
        },
        //
        ///**
        // * Alters property collection instance during the reset value operation
        // *
        // * @param {Subclass.Property.Type.Collection} collection
        // *      The instance of property collection
        // */
        //onCreateCollection: function(collection)
        //{
        //    // Do something
        //},

        /**
         * @inheritDoc
         */
        getData: function()
        {
            var value = this.getValue();

            if (value !== null) {
                return value.getData();
            }
            return null;
        }
    };

    return CollectionProperty;
}();
