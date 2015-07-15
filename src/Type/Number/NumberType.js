/**
 * @namespace
 */
Subclass.Property.Type.Number = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Number.NumberType = (function()
{
    /**
     * @inheritDoc
     * @constructor
     */
    function NumberType()
    {
        NumberType.$parent.apply(this, arguments);
    }

    NumberType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    NumberType.getName = function()
    {
        return "number";
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validateValue = function(value)
    {
        NumberType.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();
        var error = false;

        if (typeof value != 'number') {
            error = true;
        }
        if (!error && minValue !== null && value < minValue) {
            Subclass.Error.create(
                'The value of the property ' + this + ' is too small ' +
                'and must be more or equals the number ' + minValue + "."
            );
        }
        if (!error && maxValue !== null && value > maxValue) {
            Subclass.Error.create(
                'The value of the property ' + this + ' is too high ' +
                'and must be less or equals the number ' + maxValue + "."
            );
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('a number')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validateDefault = NumberType.prototype.validateValue;

    /**
     * Validates "maxValue" attribute value
     *
     * @param {*} maxValue
     */
    NumberType.prototype.validateMaxValue = function(maxValue)
    {
        if (maxValue !== null && typeof maxValue != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('maxValue')
                .received(maxValue)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "maxValue" attribute value
     *
     * @param {(number|null)} maxValue
     */
    NumberType.prototype.setMaxValue = function(maxValue)
    {
        this.validateMaxValue(maxValue);
        this.getData().maxValue = maxValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "maxValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberType.prototype.getMaxValue = function()
    {
        return this.getData().maxValue;
    };

    /**
     * Validates "minValue" attribute value
     *
     * @param {*} minValue
     */
    NumberType.prototype.validateMinValue = function(minValue)
    {
        if (minValue !== null && typeof minValue != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('minValue')
                .received(minValue)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "minValue" attribute value
     *
     * @param {(number|null)} minValue
     */
    NumberType.prototype.setMinValue = function(minValue)
    {
        this.validateMinValue(minValue);
        this.getData().minValue = minValue;
        this.validateMinMaxValues();
    };

    /**
     * Returns value of "minValue" attribute
     *
     * @returns {(number|null)}
     */
    NumberType.prototype.getMinValue = function()
    {
        return this.getData().minValue;
    };

    /**
     * Validates how minValue and maxValue are compatable
     */
    NumberType.prototype.validateMinMaxValues = function()
    {
        var minValue = this.getMinValue();
        var maxValue = this.getMaxValue();

        if (minValue !== null && maxValue !== null && minValue > maxValue) {
            Subclass.Error.create(
                'The "maxLength" attribute value must be higher than "minLength" attribute value ' +
                'in definition of property ' + this + ' must be number or null.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.getBaseData = function()
    {
        var baseData = NumberType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * Specified max number value if it isn't null
         * @type {(number|null)}
         */
        baseData.maxValue = null;

        /**
         * Specifies min number value if it isn't null
         * @type {(number|null)}
         */
        baseData.minValue = null;

        /**
         * @inheritDoc
         */
        baseData.nullable = false;

        /**
         * @inheritDoc
         */
        baseData.default = 0;

        return baseData;
    };

    /**
     * @inheritDoc
     */
    NumberType.prototype.validateData = function()
    {
        NumberType.$parent.prototype.processData.call(this);

        this.validateMinMaxValues();
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(NumberType);

    return NumberType;

})();
