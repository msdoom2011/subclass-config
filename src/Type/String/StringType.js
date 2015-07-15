/**
 * @namespace
 */
Subclass.Property.Type.String = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.String.StringType = (function()
{
    /**
     * @inheritDoc
     */
    function StringType ()
    {
        StringType.$parent.apply(this, arguments);
    }

    StringType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    StringType.getName = function()
    {
        return 'string';
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.validateValue = function(value)
    {
        StringType.$parent.prototype.validateValue.call(this, value);

        if (value === null) {
            return;
        }
        var pattern = this.getPattern();
        var minLength = this.getMinLength();
        var maxLength = this.getMaxLength();
        var error = false;

        if (typeof value != 'string') {
            error = true;
        }

        if (!error && pattern && !pattern.test(value)) {
            Subclass.Error.create(
                'The value "' + value + '" of the property ' + this + ' is not valid ' +
                'and must match the regular expression "' + pattern.toString() + '".'
            );
        }
        if (!error && minLength !== null && value.length < minLength) {
            Subclass.Error.create(
                'The value "' + value + '" of the property ' + this + ' is too short ' +
                'and must consist of at least ' + minLength + ' symbols.'
            );
        }
        if (!error && maxLength !== null && value.length > maxLength) {
            Subclass.Error.create(
                'The value "' + value + '" of the property "' + this + '" is too long ' +
                'and must be not longer than ' + maxLength + ' symbols.'
            );
        }
        if (error) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('a string')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.validateDefault = StringType.prototype.validateValue;

    /**
     * Validates "pattern" attribute value
     *
     * @param {*} pattern
     */
    StringType.prototype.validatePattern = function(pattern)
    {
        if (pattern !== null && typeof pattern != 'object' && !(pattern instanceof RegExp)) {
            Subclass.Error.create('InvalidPropertyOption')
                .option('pattern')
                .received(pattern)
                .property(this)
                .expected('a RegExp instance or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "maxLength" attribute value
     *
     * @param {(RegExp|null)} pattern
     */
    StringType.prototype.setPattern = function(pattern)
    {
        this.validatePattern(pattern);
        this.getData().pattern = pattern;
    };

    /**
     * Returns value of "pattern" attribute
     *
     * @returns {(RegExp|null)}
     */
    StringType.prototype.getPattern = function()
    {
        return this.getData().pattern;
    };

    /**
     * Validates "maxLength" attribute value
     *
     * @param {*} maxLength
     */
    StringType.prototype.validateMaxLength = function(maxLength)
    {
        if (maxLength !== null && typeof maxLength != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('maxLength')
                .received(maxLength)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "maxLength" attribute value
     *
     * @param {(number|null)} maxLength
     */
    StringType.prototype.setMaxLength = function(maxLength)
    {
        this.validateMaxLength(maxLength);
        this.getData().maxLength = maxLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "maxLength" attribute
     *
     * @returns {(number|null)}
     */
    StringType.prototype.getMaxLength = function()
    {
        return this.getData().maxLength;
    };

    /**
     * Validates "minLength" attribute value
     *
     * @param {*} minLength
     */
    StringType.prototype.validateMinLength = function(minLength)
    {
        if (minLength !== null && typeof minLength != 'number') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('minLength')
                .received(minLength)
                .property(this)
                .expected('a number or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "minLength" attribute value
     *
     * @param {(number|null)} minLength
     */
    StringType.prototype.setMinLength = function(minLength)
    {
        this.validateMinLength(minLength);
        this.getData().minLength = minLength;
        this.validateMinMaxLengths();
    };

    /**
     * Returns value of "minLength" attribute
     *
     * @returns {(number|null)}
     */
    StringType.prototype.getMinLength = function()
    {
        return this.getData().minLength;
    };

    /**
     * Validates how minLength and maxLength are compatable
     */
    StringType.prototype.validateMinMaxLengths = function()
    {
        var minLength = this.getMinLength();
        var maxLength = this.getMaxLength();

        if (minLength !== null && maxLength !== null && minLength > maxLength) {
            Subclass.Error.create(
                'The "maxLength" attribute value must be more than "minLength" attribute value ' +
                'in definition of property ' + this + ' must be number or null.'
            );
        }
    };

    /**
     * @inheritDoc
     */
    StringType.prototype.getBaseData = function()
    {
        var baseData = StringType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * @inheritDoc
         */
        baseData.nullable = false;

        /**
         * Regular expression that property value will match
         * @type {(RegExp|null)}
         */
        baseData.pattern = null;

        /**
         * Specified max string length if it isn't null
         * @type {(number|null)}
         */
        baseData.maxLength = null;

        /**
         * Specifies min string length if it isn't null
         * @type {(number|null)}
         */
        baseData.minLength = null;

        /**
         * @inheritDoc
         */
        baseData.default = "";

        return baseData;
    };


    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(StringType);


    return StringType;

})();
