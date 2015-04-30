///**
// * @class
// * @extends {Subclass.Property.Property}
// */
//Subclass.Property.Type.Number.Number = (function()
//{
//    /*************************************************/
//    /*      Describing property type "Number"        */
//    /*************************************************/
//
//    /**
//     * @param {Subclass.Property.PropertyManager} propertyManager
//     * @param {string} propertyName
//     * @param {Object} propertyDefinition
//     * @extends {PropertyType}
//     * @constructor
//     */
//    function NumberProperty(propertyManager, propertyName, propertyDefinition)
//    {
//        NumberProperty.$parent.call(
//            this,
//            propertyManager,
//            propertyName,
//            propertyDefinition
//        );
//    }
//
//    NumberProperty.$parent = Subclass.Property.PropertyType;
//
//    /**
//     * @inheritDoc
//     */
//    NumberProperty.getPropertyTypeName = function()
//    {
//        return "number";
//    };
//
//    /**
//     * @inheritDoc
//     */
//    NumberProperty.getDefinitionClass = function()
//    {
//        return Subclass.Property.Type.Number.NumberDefinition;
//    };
//
//    /**
//     * @inheritDoc
//     */
//    NumberProperty.getEmptyDefinition = function()
//    {
//        return this.$parent.getEmptyDefinition.call(this);
//    };
//
//    /**
//     * @inheritDoc
//     */
//    NumberProperty.normalizeDefinition = function(definition)
//    {
//        return this.$parent.normalizeDefinition.call(this, definition);
//    };
//
//    return NumberProperty;
//
//})();