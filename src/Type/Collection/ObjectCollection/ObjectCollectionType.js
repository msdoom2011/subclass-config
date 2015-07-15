/**
 * @class
 * @extends {Subclass.Property.Type.Collection.CollectionType}
 */
Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionType = (function()
{
    /*************************************************/
    /*   Describing property type "ObjectCollection" */
    /*************************************************/

    /**
     * @inheritDoc
     */
    function ObjectCollectionType()
    {
        ObjectCollectionType.$parent.apply(this, arguments);
    }

    ObjectCollectionType.$parent = Subclass.Property.Type.Collection.CollectionType;

    /**
     * @inheritDoc
     */
    ObjectCollectionType.getName = function()
    {
        return "objectCollection";
    };

    ObjectCollectionType.getPropertyClass = function()
    {
        return Subclass.Property.Type.Collection.ObjectCollection.ObjectCollectionProperty;
    };

    /**
     * @inheritDoc
     * @retruns {(string|null)}
     */
    ObjectCollectionType.prototype.validateValue = function(value)
    {
        ObjectCollectionType.$parent.prototype.validateValue.apply(this, arguments);

        if (value === null) {
            return;
        }
        if (!value || typeof value != 'object' || !Subclass.Tools.isPlainObject(value)) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('a plain object')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.validateDefault = ObjectCollectionType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.getBaseData = function()
    {
        var baseData = ObjectCollectionType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.default = {};

        return baseData;
    };

    /**
     * @inheritDoc
     */
    ObjectCollectionType.prototype.processData = function()
    {
        var propertyManager = this.getPropertyManager();
        var proto = propertyManager.normalizeTypeDefinition(this.getProto());

        // Adding "extends" parameter to property "schema"
        // parameter if proto type is "map"

        if (proto.type == 'map') {
            if (!proto.schema) {
                proto.schema = {};
            }
            if (!proto.schema.extends) {
                proto.schema.extends = {
                    type: "string",
                    nullable: true
                };
            }
        }
        ObjectCollectionType.$parent.prototype.processData.call(this);
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ObjectCollectionType);

    return ObjectCollectionType;

})();