/**
 * @final
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Property.Error.InvalidPropertyValueError = (function()
{
    function InvalidPropertyValueError(message)
    {
        InvalidPropertyValueError.$parent.call(this, message);
    }

    InvalidPropertyValueError.$parent = Subclass.Error.ErrorBase;

    InvalidPropertyValueError.$mixins = [
        Subclass.Error.Option.Property,
        Subclass.Error.Option.Expected,
        Subclass.Error.Option.Received
    ];

    /**
     * Returns the name of the error type
     *
     * @returns {string}
     * @static
     */
    InvalidPropertyValueError.getName = function()
    {
        return "InvalidPropertyValue";
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.getRequiredOptions = function()
    {
        var required = InvalidPropertyValueError.$parent.getRequiredOptions();

        return required.concat([
            'property'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyValueError.prototype.buildMessage = function()
    {
        var message = InvalidPropertyValueError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Specified invalid value of property ' + this.property() + '. ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : "";
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidPropertyValueError.getName(),
        InvalidPropertyValueError
    );

    return InvalidPropertyValueError;

})();