/**
 * @class
 * @constructor
 */
Subclass.Property.Type.Map.Map = function()
{
    function Map(property)
    {
        // Do nothing
    }

    /**
     * Returns the instance of current property or the instance of its child
     *
     * @param {string} [childName]
     *      The name of child property which you want to get
     *
     * @returns {*}
     */
    Map.prototype.getProperty = function(childName)
    {
        Subclass.Error.create('NotImplementedMethod')
            .className('Subclass.Property.Type.Map.Map')
            .method('getProperty')
            .apply()
        ;
    };

    /**
     * Checks whether the child property with specified name is exists
     *
     * @param {string} childName
     *      The name of child property
     *
     * @returns {boolean}
     */
    Map.prototype.issetProperty = function(childName)
    {
        return this._children.hasOwnProperty(childName);
    };

    /**
     * Returns the type of children context
     *
     * @returns {string}
     */
    Map.prototype.getContextType = function()
    {
        return 'property';
    };

    /**
     * Returns all map property children
     *
     * @returns {Object.<Subclass.Property.Property>}
     */
    Map.prototype.getChildren = function()
    {
        return this.getProperty().getChildren();
    };

    /**
     * 
     */
    Map.prototype.forEach = function()
    {

    };

    return Map;
}();