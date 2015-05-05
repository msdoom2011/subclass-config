///**
// * @class
// * @extends {Subclass.Property.PropertyAPI}
// */
//Subclass.Property.Type.Map.MapAPI = function()
//{
//    function MapAPI()
//    {
//        MapAPI.$parent.apply(this, arguments);
//    }
//
//    MapAPI.$parent = Subclass.Property.PropertyAPI;
//
//    ///**
//    // * @inheritDoc
//    // */
//    //MapAPI.prototype.resetValue = function()
//    //{
//    //    var defaultValue = this.getDefaultValue();
//    //    var children = this.getChildren();
//    //    var childrenDefaultValues = {};
//    //
//    //    for (var childName in children) {
//    //        if (children.hasOwnProperty(childName)) {
//    //            childrenDefaultValues[childName] = children[childName].getDefaultValue();
//    //        }
//    //    }
//    //    defaultValue = Subclass.Tools.extendDeep(childrenDefaultValues, defaultValue);
//    //    this._property.setValue(this._context, defaultValue);
//    //};
//
//    /**
//     * Returns child property of current map property
//     *
//     * @param {string} childName
//     *      The name of child property
//     *
//     * @returns {Subclass.Property.PropertyAPI}
//     */
//    MapAPI.prototype.getChild = function(childName)
//    {
//        var hashedName = this._property.getNameHashed();
//        return this._property.getChild(childName).getAPI(this._context[hashedName]);
//    };
//
//    /**
//     * Returns all map property child properties
//     *
//     * @returns {Object}
//     */
//    MapAPI.prototype.getChildren = function()
//    {
//        var hashedName = this._property.getNameHashed();
//        var children = this._property.getChildren();
//        var childrenAPI = {};
//
//        for (var childName in children) {
//            if (!children.hasOwnProperty(childName)) {
//                continue;
//            }
//            childrenAPI[childName] = children[childName].getAPI(this._context[hashedName]);
//        }
//        return childrenAPI;
//    };
//
//    return MapAPI;
//}();