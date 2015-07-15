/**
 * @namespace
 */
Subclass.Property.Type.Collection = {};

/**
 * @namespace
 */
Subclass.Property.Type.Collection.ArrayCollection = {};

/**
 * @namespace
 */
Subclass.Property.Type.Collection.ObjectCollection = {};

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
    CollectionType.parseRelatedClasses = function(propertyDefinition)
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

        if (!this.isWritable()) {
            proto.writable = false;
        }

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
        var baseData = CollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * The definition of property to which every collection element should match.
         * @type {null}
         */
        baseData.proto = null;

        return baseData;
    };

    return CollectionType;

})();