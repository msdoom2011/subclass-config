/**
 * @namespace
 */
Subclass.Property.Type.Collection = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Collection.CollectionType = (function()
{
    /*************************************************/
    /*        Describing property type "Map"         */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @extends {PropertyType}
     * @constructor
     */
    function CollectionType()
    {
        CollectionType.$parent.apply(this, arguments);
        //
        ///**
        // * @type {boolean}
        // * @private
        // */
        //this._isNull = true;
        //
        ///**
        // * @type {(Function|null)}
        // * @private
        // */
        //this._collectionConstructor = null;
        //
        ///**
        // * @type {(Subclass.Property.Type.Collection.Collection|null)}
        // * @private
        // */
        //this._collection = null;

        /**
         * @type {Subclass.Property.PropertyType}
         * @private
         */
        this._protoInst = null;
    }

    CollectionType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    CollectionType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     */
    CollectionType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 5) {
            var fullDefinition = {};
            var isNullable = false;

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.proto = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];

                if (definition[2] === null) {
                    isNullable = true;
                }
            }
            if (definition.length >= 4) {
                fullDefinition.writable = definition[3];
            }
            if (definition.length == 5) {
                fullDefinition.nullable = definition[4];
            }
            if (isNullable) {
                fullDefinition.nullable = true;
            }
            return fullDefinition;
        }
        return definition;
    };
    //
    ///**
    // * Tells is property value null
    // *
    // * @returns {boolean}
    // */
    //CollectionType.prototype.isNull = function()
    //{
    //    return this._isNull;
    //};
    //
    ///**
    // * Sets marker that tells that property value is null
    // *
    // * @param {boolean} isNull
    // */
    //CollectionType.prototype.setIsNull = function(isNull)
    //{
    //    this._isNull = isNull;
    //};
    //
    ///**
    // * Returns constructor of collection class which will operate with stored collection elements
    // *
    // * @returns {Function}
    // */
    //CollectionType.prototype.getCollectionClass = function()
    //{
    //    return Subclass.Property.Type.Collection.Collection;
    //};

    /**
     * @inheritDoc
     */
    CollectionType.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : {};
    };

    ///**
    //* Sets prototype of collection items
    //*
    //* @param {Subclass.Property.PropertyType} proto
    //*/
    //CollectionType.prototype.setProto = function(proto)
    //{
    //    this._proto = proto;
    //};
    //
    ///**
    // * Returns property definition which every collection element should match
    // *
    // * @returns {Object}
    // */
    //CollectionType.prototype.getProto = function()
    //{
    //    return this._proto;
    //};

    /**
     * Returns the property instance of collection item
     *
     * @returns {Subclass.Property.PropertyType}
     */
    CollectionType.prototype.getProtoInstance = function()
    {
        return this._protoInst;
    };

    /**
     * Validates "proto" attribute value
     *
     * @param {*} proto
     */
    CollectionType.prototype.validateProto = function(proto)
    {
        if (!proto || typeof proto != 'object') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('proto')
                .received(proto)
                .property(this)
                .expected('a plain object')
                .apply()
            ;
        }
    };

    /**
     * Sets property proto
     *
     * @param {(Function|null)} proto
     */
    CollectionType.prototype.setProto = function(proto)
    {
        var propertyManager = this.getPropertyManager();
        proto = propertyManager.normalizeTypeDefinition(proto);

        this.validateProto(proto);
        this.getData().proto = proto;
        proto.accessors = false;

        this._protoInst = propertyManager.createProperty(
            'collectionItem',       // property name
            proto,                  // property definition
            this.getContextClass(), // context class
            this                    // context property
        );
    };

    /**
     * Returns proto function or null
     *
     * @returns {(Function|null)}
     */
    CollectionType.prototype.getProto = function()
    {
        return this.getData().proto;
    };



    //
    ///**
    // * Returns prepared collection constructor
    // *
    // * @returns {Function}
    // */
    //CollectionType.prototype.getCollectionConstructor = function()
    //{
    //    if (!this._collectionConstructor) {
    //        //this._collectionConstructor = this.createCollectionConstructor();
    //        var constructor = this.getCollectionClass();
    //        this._collectionConstructor = Subclass.Tools.createClassInstance(constructor);
    //    }
    //    return this._collectionConstructor;
    //};
    //
    ///**
    // * Builds collection class constructor
    // *
    // * @returns {Function}
    // */
    //CollectionType.prototype.createCollectionConstructor = function()
    //{
    //    var collectionConstructor = arguments[0];
    //
    //    if (!arguments[0]) {
    //        collectionConstructor = this.getCollectionClass();
    //    }
    //
    //    if (collectionConstructor.$parent) {
    //        var parentCollectionConstructor = this.createCollectionConstructor(
    //            collectionConstructor.$parent,
    //            false
    //        );
    //
    //        var collectionConstructorProto = Object.create(parentCollectionConstructor.prototype);
    //
    //        collectionConstructorProto = Subclass.Tools.extend(
    //            collectionConstructorProto,
    //            collectionConstructor.prototype
    //        );
    //
    //        collectionConstructor.prototype = collectionConstructorProto;
    //
    //        Object.defineProperty(collectionConstructor.prototype, 'constructor', {
    //            enumerable: false,
    //            value: collectionConstructor
    //        });
    //    }
    //
    //    return collectionConstructor;
    //};
    //
    //CollectionType.prototype.createCollection = function(context)
    //{
    //    var collectionConstructor = this.getCollectionClass();
    //    var propertyDefinition = this.getDefinition();
    //    var defaultValue = this.getDefaultValue();
    //    var proto = this.getProto();
    //
    //    var collection = Subclass.Tools.createClassInstance(collectionConstructor, this, context);
    //
    //    // Altering collection
    //
    //    this.alterCollection(collection);
    //
    //    // Setting default value
    //
    //    if (defaultValue !== null) {
    //        this.setIsNull(false);
    //
    //        for (var propName in defaultValue) {
    //            if (!defaultValue.hasOwnProperty(propName)) {
    //                continue;
    //            }
    //            if (!propertyDefinition.isWritable()) {
    //                proto.getDefinition().setWritable(false);
    //            }
    //            this.addCollectionItem(
    //                collection,
    //                propName,
    //                defaultValue[propName]
    //            );
    //        }
    //        collection.normalizeItems();
    //    }
    //    Object.seal(collection);
    //
    //    return collection;
    //};
    //
    ///**
    // * Returns collection instance
    // *
    // * @returns {Collection}
    // */
    //CollectionType.prototype.getCollection = function(context)
    //{
    //    if (!this._collection) {
    //        this._collection = this.createCollection(context);
    //    }
    //    return this._collection;
    //};
    //
    ///**
    // * Alters property collection instance
    // *
    // * @param {Subclass.Property.Type.Collection} collection
    // *      The instance of property collection
    // */
    //CollectionType.prototype.alterCollection = function(collection)
    //{
    //    // Do something
    //};
    //
    ///**
    // * Clearing property collection instance
    // */
    //CollectionType.prototype.clearCollection = function()
    //{
    //    var context = this._collection.getContext();
    //    this._collection = this.createCollection(context);
    //};
    //
    ///**
    // * Adds new item to collection
    // *
    // * @param collection
    // * @param key
    // * @param value
    // */
    //CollectionType.prototype.addCollectionItem = function(collection, key, value)
    //{
    //    Subclass.Error.create('NotImplementedMethod')
    //        .method('addCollectionItem')
    //        .apply()
    //    ;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //CollectionType.prototype.generateGetter = function()
    //{
    //    var $this = this;
    //
    //    return function() {
    //        if ($this.isNull()) {
    //            return null;
    //        }
    //        return this[$this.getNameHashed()];
    //    };
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //CollectionType.prototype.generateSetter = function()
    //{
    //    var $this = this;
    //
    //    return function(value) {
    //        if ($this.isLocked()) {
    //            return console.warn(
    //                'Trying to set new value for the ' +
    //                'property ' + $this + ' that is locked for write.'
    //            );
    //        }
    //        $this.validateValue(value);
    //        $this.setIsModified(true);
    //
    //        if (value !== null) {
    //            var nameHashed = $this.getNameHashed();
    //            this[nameHashed].replaceItems(value);
    //            this[nameHashed].normalizeItems();
    //            $this.setIsNull(false);
    //
    //            //for (var childPropName in value) {
    //            //    if (!value.hasOwnProperty(childPropName)) {
    //            //        continue;
    //            //    }
    //            //    this[$this.getNameHashed()].setItem(
    //            //        childPropName,
    //            //        value[childPropName]
    //            //    );
    //            //}
    //
    //        } else {
    //            $this.getCollection(this).removeItems();
    //            $this.setIsNull(true);
    //        }
    //    };
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //CollectionType.prototype.attachHashed = function(context)
    //{
    //    var hashedPropName = this.getNameHashed();
    //    var defaultValue = this.getDefaultValue();
    //
    //    if (defaultValue !== null) {
    //        this.setIsNull(false);
    //    }
    //
    //    Object.defineProperty(context, hashedPropName, {
    //        configurable: true,
    //        writable: true,
    //        value: this.getCollection(context)
    //    });
    //};


    /**
     * @inheritDoc
     */
    CollectionType.prototype.getRequiredAttributes = function()
    {
        var attrs = CollectionType.$parent.prototype.getRequiredAttributes.apply(this, arguments);

        return attrs.concat(['proto']);
    };

    /**
     * @inheritDoc
     */
    CollectionType.prototype.getBaseData = function()
    {
        var baseDefinition = CollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * The definition of property to which every collection element should match.
         * @type {null}
         */
        baseDefinition.proto = null;

        return baseDefinition;
    };

    return CollectionType;

})();