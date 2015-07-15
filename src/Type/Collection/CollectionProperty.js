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
         * Returns properties default value
         *
         * @returns {*}
         */
        getDefaultValue: function()
        {
            var defaultValue = this.getDefinition().getDefault();

            if (!Subclass.Tools.isEmpty(defaultValue)) {
                defaultValue = this.createCollection().getData();
            }

            return defaultValue;
        },

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
                if (!markAsModified) {
                    collection.denyModifying();
                }
                collection.replaceItems(value);

                if (!markAsModified) {
                    collection.allowModifying();
                }
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
         * Creates the collection instance
         */
        createCollection: function()
        {
            var collectionConstructor = this.constructor.getCollectionClass();
            var collection = Subclass.Tools.createClassInstance(collectionConstructor, this);

            // Initializing collection

            this.initializeCollection(collection);
            Object.seal(collection);

            return collection;
        },

        /**
         * Initializes the instance of collection
         *
         * @param collection
         */
        initializeCollection: function(collection)
        {
            var propertyDefinition = this.getDefinition();
            var defaultValue = propertyDefinition.getDefault();

            // Setting default value

            collection.denyModifying();

            if (defaultValue !== null) {
                collection.addItems(defaultValue);
            }

            collection.allowModifying();

            Object.defineProperty(collection, 'length', {
                enumerable: false,
                set: function() {},
                get: function() {
                    return collection.getLength();
                }
            });
        },

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
