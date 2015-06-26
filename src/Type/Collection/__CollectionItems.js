///**
// * @class
// */
//Subclass.Property.Type.Collection.CollectionItems = function()
//{
//    function CollectionItems(collection)
//    {
//        if (!collection || !(collection instanceof Subclass.Property.Type.Collection.Collection)) {
//            Subclass.Error.create('InvalidArgument')
//                .argument('the collection instance', false)
//                .received(collection)
//                .expected('an instance of "Subclass.Property.Type.Collection.Collection"')
//                .apply()
//            ;
//        }
//        /**
//         * The instance of collection
//         *
//         * @type {Subclass.Property.Type.Collection.Collection}
//         * @private
//         */
//        this._collection = collection;
//
//        /**
//         * List of all collection item properties
//         *
//         * @type {Object.<Subclass.Property.Property>}
//         * @private
//         */
//        this._properties = {};
//    }
//
//    CollectionItems.prototype = {
//
//        /**
//         * Returns the instance of collection
//         *
//         * @returns {Subclass.Property.Type.Collection.Collection}
//         */
//        getCollection: function()
//        {
//            return this._collection;
//        },
//
//        /**
//         * Returns the list of collection item properties
//         *
//         * @returns {Object.<Subclass.Property.Property>}
//         */
//        getProperties: function()
//        {
//            return this._properties;
//        },
//
//        /**
//         * Returns the collection item property
//         *
//         * @param {string} key
//         *      The name of property (the same as the key of collection item)
//         */
//        getProperty: function(key)
//        {
//            return this._properties[key];
//        },
//
//        /**
//         * Checks whether property with specified name exists
//         *
//         * @param {string} key
//         *      The name of property (the same as the key of collection item)
//         *
//         * @returns {boolean}
//         */
//        issetProperty: function(key)
//        {
//            return this._properties.hasOwnProperty(key);
//        },
//
//        /**
//         * Returns the type of current context property
//         *
//         * @returns {string}
//         */
//        getContextType: function()
//        {
//            return 'property';
//        },
//
//        /**
//         * Attaches the new item to collection
//         *
//         * @param {string} key
//         * @param {*} value
//         * @returns {*}
//         */
//        attachItem: function(key, value)
//        {
//            var collectionProperty = this.getCollection().getProperty();
//            var collectionItemProtoInstance = collectionProperty.getProtoInstance();
//            var properties = this.getProperties();
//
//            properties[key] = collectionItemProtoInstance.createInstance(key);
//            //properties[key].attach(this);
//
//            if (value !== undefined) {
//                properties[key].setValue(value);
//            }
//
//            return this[key];
//        },
//
//        /**
//         * Returns the value of collection item
//         *
//         * @param {string} key
//         * @returns {*}
//         */
//        getItemValue: function(key)
//        {
//            return this.getProperty(key).getValue();
//        },
//
//        /**
//         * Sets the value of collection item
//         *
//         * @param {string} key
//         * @param {*} value
//         */
//        setItemValue: function(key, value)
//        {
//            this.getProperty(key).setValue(value);
//        },
//
//        /**
//         * Removes the collection item
//         *
//         * @param {string} key
//         */
//        removeItem: function(key)
//        {
//            //var property = this.getProperty(key);
//            //property.getDefinition().detach(this, property.getName());
//
//            delete this.getProperties()[key];
//        },
//
//        /**
//         * Removes all collection items
//         */
//        removeItems: function()
//        {
//            var properties = this.getProperties();
//
//            for (var key in properties) {
//                if (properties.hasOwnProperty(key)) {
//                    this.removeItem(key);
//                }
//            }
//        },
//
//        /**
//         * Returns the count of items in collection
//         *
//         * @returns {Number}
//         */
//        getLength: function()
//        {
//            return Object.keys(this.getProperties()).length;
//        }
//    };
//
//    return CollectionItems;
//};