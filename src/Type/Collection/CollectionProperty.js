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
        getData: function()
        {
            var value = this.getValue();

            if (value !== null) {
                return value.getData();
            }
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
                if (collection === null) {
                    this.resetValue(markAsModified);
                    return;
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

            var propertyDefinition = this.getDefinition();
            var defaultValue = propertyDefinition.getDefaultValue();
            var protoInstance = propertyDefinition.getProtoInstance();
            var collectionConstructor = this.getCollectionClass();
            var collection = Subclass.Tools.createClassInstance(collectionConstructor, this);

            // Altering collection

            this.onResetValue(collection);

            // Setting default value

            if (defaultValue !== null) {
                for (var propName in defaultValue) {
                    if (!defaultValue.hasOwnProperty(propName)) {
                        continue;
                    }
                    if (!propertyDefinition.isWritable()) {
                        protoInstance.getDefinition().setWritable(false);
                    }
                    collection.addItem(propName, defaultValue[propName]);
                }
                collection.normalizeItems();
            }
            if (markAsModified) {
                this.modify();
            }
            Object.seal(collection);

            return collection;
        },

        /**
         * Alters property collection instance during the reset value operation
         *
         * @param {Subclass.Property.Type.Collection} collection
         *      The instance of property collection
         */
        onResetValue: function(collection)
        {
            // Do something
        }
    };

    return CollectionProperty;
}();
