/**
 * @namespace
 */
Subclass.Property.Type.Collection.ArrayCollection = {};

/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection = (function()
{
    /*************************************************/
    /*   Describing property type "ArrayCollection"  */
    /*************************************************/

    /**
     * @param {Subclass.Property.PropertyManager} propertyManager
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     * @param {ClassType} contextClass
     * @extends {PropertyType}
     * @constructor
     */
    function ArrayCollectionType(propertyManager, propertyName, propertyDefinition, contextClass)
    {
        ArrayCollectionType.$parent.call(
            this,
            propertyManager,
            propertyName,
            propertyDefinition,
            contextClass
        );
    }

    ArrayCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

    /**
     * @inheritDoc
     */
    ArrayCollectionType.getPropertyTypeName = function()
    {
        return "arrayCollection";
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.parseRelatedClasses = function(propertyDefinition)
    {
        if (
            !propertyDefinition.proto
            || typeof propertyDefinition.proto != 'object'
            || !propertyDefinition.proto.type
        ) {
            return;
        }
        var propDef = propertyDefinition.proto;
        var propertyType = Subclass.Property.PropertyManager.getPropertyType(propDef.type);

        if (!propertyType.parseRelatedClasses) {
            return;
        }
        return propertyType.parseRelatedClasses(propDef);
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.getDefinitionClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollectionDefinition;
    };


    /**
     * @inheritDoc
     */
    ArrayCollectionType.getEmptyDefinition = function()
    {
        return this.$parent.getEmptyDefinition();
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.normalizeDefinition = function(definition)
    {
        return this.$parent.normalizeDefinition(definition);
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getCollectionClass = function()
    {
        return Subclass.Property.Type.Collection.ArrayCollection.ArrayCollection;
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.alterCollection = function(collection)
    {
        var $this = this;

        Object.defineProperty(collection, 'length', {
            enumerable: false,
            set: function() {},
            get: function() {
                return collection.getLength();
            }
        });
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.addCollectionItem = function(collection, key, value)
    {
        collection.addItem(value);
    };

    /**
     * @inheritDoc
     */
    ArrayCollectionType.prototype.getData = function(context)
    {
        var collection = this.getCollection();
        var collectionItems = [];

        collection.eachItem(function(item, itemName) {
            collectionItems[itemName] = collection.getItemData(itemName);
        });

        return collectionItems;
    };
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