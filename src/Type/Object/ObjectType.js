/**
 * @namespace
 */
Subclass.Property.Type.Object = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Object.ObjectType = function()
{
    /**
     * @inheritDoc
     */
    function ObjectType()
    {
        ObjectType.$parent.apply(this, arguments);
    }

    ObjectType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ObjectType.getName = function()
    {
        return "object";
    };

    /**
     * @inheritDoc
     */
    ObjectType.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : {};
    };

    /**
     * @inheritDoc
     */
    ObjectType.prototype.validateValue = function(value)
    {
        ObjectType.$parent.prototype.validateValue.call(this, value);

        if (value !== null && !Subclass.Tools.isPlainObject(value)) {
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
    ObjectType.prototype.validateDefault = ObjectType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    ObjectType.prototype.getBaseData = function()
    {
        var basePropertyDefinition = ObjectType.$parent.prototype.getBaseData.call(this);
        basePropertyDefinition.nullable = false;

        return basePropertyDefinition;
    };

    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ObjectType);

    return ObjectType;

}();