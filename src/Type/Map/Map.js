/**
 * @class
 * @constructor
 */
Subclass.Property.Type.Map.Map = function()
{
    function Map()
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
        return this.getChildren().hasOwnProperty(childName);
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
     * Sort out all child properties using specified callback function
     *
     * @param {function} callback
     *      The callback function which receives three arguments:
     *      - the value of child property
     *      - the name of child property
     *      - the child property
     *
     *      Each call of callback function will be invoked in the Map property context
     */
    Map.prototype.forEach = function(callback)
    {
        var children = this.getChildren();

        for (var childName in children) {
            if (children.hasOwnProperty(childName)) {
                var child = children[childName];

                callback.call(this, child.getValue(), childName, child);
            }
        }
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
     * Returns data of map property
     *
     * @returns {Object}
     */
    Map.prototype.getData = function()
    {
        return this.getProperty().getData();
    };

    /**
     * @inheritDoc
     */
    Map.prototype.toString = function()
    {
        return this.getData().toString();
    };

    /**
     * @inheritDoc
     */
    Map.prototype.valueOf = function()
    {
        return this.getData();
    };

    return Map;
}();