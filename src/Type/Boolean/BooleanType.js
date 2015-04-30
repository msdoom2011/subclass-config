/**
 * @namespace
 */
Subclass.Property.Type.Boolean = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Boolean.BooleanType = (function()
{
    /**
     * @inheritDoc
     */
    function BooleanType()
    {
        BooleanType.$parent.apply(this, arguments);
    }

    BooleanType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    BooleanType.getName = function()
    {
        return "boolean";
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.getEmptyValue = function()
    {
        return this.isNullable() ? null : false;
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.getBaseData = function()
    {
        var basePropertyDefinition = BooleanType.$parent.prototype.getBaseData.call(this);
            basePropertyDefinition.nullable = false;

        return basePropertyDefinition;
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.validateValue = function(value)
    {
        BooleanType.$parent.prototype.validateValue.call(this, value);

        if (value && typeof value != 'boolean') {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected("a boolean")
                .apply()
            ;
        }
        return true;
    };

    /**
     * @inheritDoc
     */
    BooleanType.prototype.validateDefault = BooleanType.prototype.validateValue;

    /**
     * @inheritDoc
     */
    BooleanType.prototype.attach = function(context)
    {
        BooleanType.$parent.prototype.attach.apply(this, arguments);

        var propertyName = this.getName();
        var getterName = Subclass.Tools.generateGetterName(propertyName);
        var checkerName = Subclass.Tools.generateCheckerName(propertyName);

        context[checkerName] = context[getterName];
    };

    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(BooleanType);

    return BooleanType;

})();
