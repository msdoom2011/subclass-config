/**
 * @mixin
 * @description
 *
 * Mixin which allows to specify the property when creating an error instance.
 */
Subclass.Error.Option.Property = function()
{
    function PropertyOption()
    {
        return {
            /**
             * The the property object
             *
             * @type {(string|undefined)}
             */
            _property: undefined
        };
    }

    /**
     * Sets/returns options name
     *
     * @param {string} [property]
     * @returns {Subclass.Error}
     */
    PropertyOption.prototype.property = function(property)
    {
        if (!arguments.length) {
            return this._property;
        }
        if (property && !(property instanceof Subclass.Property.PropertyType)) {
            throw new Error(
                'Specified invalid property object. ' +
                'It must be an instance of Subclass.Property.PropertyType.'
            );
        }
        this._property = property;

        return this;
    };

    /**
     * Checks whether the argument option was specified
     *
     * @returns {boolean}
     */
    PropertyOption.prototype.hasProperty = function()
    {
        return this._property !== undefined;
    };

    return PropertyOption;
}();