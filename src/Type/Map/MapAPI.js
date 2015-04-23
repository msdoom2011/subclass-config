/**
 * @class
 * @extends {Subclass.Property.PropertyAPI}
 */
Subclass.Property.Type.Map.MapAPI = function()
{
    function MapAPI()
    {
        MapAPI.$parent.apply(this, arguments);
    }

    MapAPI.$parent = Subclass.Property.PropertyAPI;

    /**
     * Returns simple plain data of map property
     *
     * @returns {Object}
     */
    MapAPI.prototype.getData = function()
    {
        return this._property.getValue(this._context, true);
    };

    /**
     * Returns child property of current map property
     *
     * @param {string} childName
     *      The name of child property
     *
     * @returns {Subclass.Property.PropertyAPI}
     */
    MapAPI.prototype.getChild = function(childName)
    {
        return this._property.getChild(childName).getAPI(this._context);
    };

    /**
     * Returns all map property child properties
     *
     * @returns {Object}
     */
    MapAPI.prototype.getChildren = function()
    {
        var children = this._property.getChildren();
        var childrenAPI = {};

        for (var childName in children) {
            if (!children.hasOwnProperty(childName)) {
                continue;
            }
            childrenAPI[childName] = children[childName].getAPI(this._context);
        }
        return childrenAPI;
    };

    return MapAPI;
}();