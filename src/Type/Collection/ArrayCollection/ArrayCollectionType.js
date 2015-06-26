/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionType = (function()
{
    /*************************************************/
    /*   Describing property type "ArrayCollection"  */
    /*************************************************/

    /**
     * @inheritDoc
     */
    function ArrayCollectionType()
    {
        ArrayCollectionType.$parent.apply(this, arguments);
    }

    ArrayCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.getName = function()
    {
        return "arrayCollection";
    };

    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.parseRelatedClasses = function(propertyDefinition)
    //{
    //    if (
    //        !propertyDefinition.proto
    //        || typeof propertyDefinition.proto != 'object'
    //        || !propertyDefinition.proto.type
    //    ) {
    //        return;
    //    }
    //    var propDef = propertyDefinition.proto;
    //    var propertyType = Subclass.Property.PropertyManager.getPropertyType(propDef.type);
    //
    //    if (!propertyType.parseRelatedClasses) {
    //        return;
    //    }
    //    return propertyType.parseRelatedClasses(propDef);
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.getDefinitionClass = function()
    //{
    //    return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionDefinition;
    //};

    ArrayCollectionType.getPropertyClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionProperty;
    };
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.prototype.getEmptyValue = function()
    //{
    //    return this.isNullable() ? null : [];
    //};

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ArrayCollectionType.prototype.validateValue = function(value)
    {
        ArrayCollectionType.$parent.prototype.validateValue.apply(this, arguments);

        if (value === null) {
            return;
        }

        if (!value || typeof value != 'object' || !Array.isArray(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this.getProperty())
                .received(value)
                .expected('an array')
                .apply()
            ;
        }
    };

    ArrayCollectionType.prototype.validateDefault = ArrayCollectionType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getBaseData = function()
    {
        var baseData = ArrayCollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = [];

        return baseData;
    };

    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.getEmptyDefinition = function()
    //{
    //    return this.$parent.getEmptyDefinition();
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.normalizeDefinition = function(definition)
    //{
    //    return this.$parent.normalizeDefinition(definition);
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.prototype.getCollectionClass = function()
    //{
    //    return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.prototype.onResetValue = function(collection)
    //{
    //    Object.defineProperty(collection, 'length', {
    //        enumerable: false,
    //        set: function() {},
    //        get: function() {
    //            return collection.getLength();
    //        }
    //    });
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.prototype.addCollectionItem = function(collection, key, value)
    //{
    //    collection.addItem(value);
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.prototype.getData = function(context)
    //{
    //    var collection = this.getCollection();
    //    var collectionItems = [];
    //
    //    collection.eachItem(function(itemName, item) {
    //        collectionItems[itemName] = collection.getItemData(itemName);
    //    });
    //
    //    return collectionItems;
    //};
    //
    ///**
    // * @inheritDoc
    // */
    //ArrayCollectionType.prototype.generateSetter = function()
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
    //            $this.setIsNull(false);
    //
    //            for (var i = 0; i < value.length; i++) {
    //                this[$this.getNameHashed()].addItem(value[i]);
    //            }
    //
    //        } else {
    //            $this.setIsNull(true);
    //            $this.getCollection(this).removeItems();
    //        }
    //    };
    //};


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ArrayCollectionType);

    return ArrayCollectionType;

})();