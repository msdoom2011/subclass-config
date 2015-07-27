/**
 * @class
 * @constructor
 */
Subclass.Property.WatcherEvent = function()
{
    function WatcherEvent(property, newValue, oldValue)
    {
        if (!property || typeof property != 'object' || !(property instanceof Subclass.Property.Property)) {
            Subclass.Error.create('InvalidArgument')
                .argument('property instance')
                .expected('an instance of class Subclass.Property.Proeprty')
                .received(property)
                .apply()
            ;
        }
        /**
         * Property instance
         *
         * @type {Subclass.Property.Property}
         * @private
         */
        this._property = property;

        /**
         * Reports whether propagation stopped
         *
         * @type {boolean}
         * @private
         */
        this._stopped = false;

        /**
         * Old property value before modification
         *
         * @type {*}
         * @private
         */
        this._oldValue = oldValue;

        /**
         * New property value after modification
         *
         * @type {*}
         * @private
         */
        this._newValue = newValue;

        /**
         * Difference between old and new property values.
         * It is actual only if new value is a plain object an array.
         * In other cases it will have the same value as the newValue.
         *
         * @type {null}
         * @private
         */
        this._diffValue = null;
    }

    WatcherEvent.prototype = {

        /**
         * Sets property instance
         *
         * @param {Subclass.Property.Property} property
         */
        setProperty: function(property)
        {
            this._property = property;
        },

        /**
         * Returns property instance
         * @returns {Subclass.Property.Property}
         */
        getProperty: function()
        {
            return this._property;
        },

        /**
         * Starts event propagation
         */
        startPropagation: function ()
        {
            this._stopped = false;
        },

        /**
         * Stops event propagation
         */
        stopPropagation: function ()
        {
            this._stopped = true;
        },

        /**
         * Reports whether event propagation stopped
         *
         * @returns {boolean}
         */
        isPropagationStopped: function ()
        {
            return this._stopped;
        },

        /**
         * Sets new property value
         *
         * @param {*} newValue
         */
        setNewValue: function(newValue)
        {
            this._diffValue = null;
            this._newValue = newValue;
        },

        /**
         * Returns new property value
         *
         * @returns {*}
         */
        getNewValue: function()
        {
            return this._newValue;
        },

        /**
         * Sets old property value
         *
         * @param oldValue
         */
        setOldValue: function(oldValue)
        {
            this._diffValue = null;
            this._oldValue = oldValue;
        },

        /**
         * Returns old property value
         *
         * @returns {*}
         */
        getOldValue: function()
        {
            return this._oldValue;
        },

        /**
         * Returns difference between newValue and oldValue
         * It is actual only if new value is a plain object or an array.
         * In other cases it will return just the same as getNewValue method.
         *
         * @returns {*}
         */
        getDiffValue: function()
        {
            if (this._diffValue) {
                return this._diffValue;
            }

            this._diffValue = _defineDiffValue(
                this.getNewValue(),
                this.getOldValue()
            );

            return this._diffValue;
        }
    };

    /**
     * Returns diff between two values
     *
     * @param {*} newValue
     * @param {*} oldValue
     * @returns {*}
     * @private
     */
    function _defineDiffValue(newValue, oldValue)
    {
        var diff;

        if (
            Array.isArray(newValue)
            && Array.isArray(oldValue)
        ) {
            diff = [];

            for (var i = 0; i < newValue.length; i++) {
                if (!Subclass.Tools.isEqual(newValue[i], oldValue[i])) {
                    diff[i] = _defineDiffValue(newValue[i], oldValue[i]);
                }
            }

        } else if (
            Subclass.Tools.isPlainObject(newValue)
            && Subclass.Tools.isPlainObject(oldValue)
        ) {
            diff = {};

            for (var propName in newValue) {
                if (newValue.hasOwnProperty(propName)) {
                    if (!Subclass.Tools.isEqual(newValue[propName], oldValue[propName])) {
                        diff[propName] = _defineDiffValue(newValue[propName], oldValue[propName]);
                    }
                }
            }
        } else {
            diff = newValue;
        }

        return Subclass.Tools.copy(diff);
    }

    return WatcherEvent;

}();