/**
 * @final
 * @class
 * @extends {Subclass.Error}
 */
Subclass.Property.Error.InvalidPropertyOptionError = (function()
{
    function InvalidPropertyOptionError(message)
    {
        InvalidPropertyOptionError.$parent.call(this, message);
    }

    InvalidPropertyOptionError.$parent = Subclass.Error.ErrorBase;

    InvalidPropertyOptionError.$mixins = [
        Subclass.Error.Option.Option,
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
    InvalidPropertyOptionError.getName = function()
    {
        return "InvalidPropertyOption";
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyOptionError.getRequiredOptions = function()
    {
        var required = InvalidPropertyOptionError.$parent.getRequiredOptions();

        return required.concat([
            'property',
            'option'
        ]);
    };

    /**
     * @inheritDoc
     */
    InvalidPropertyOptionError.prototype.buildMessage = function()
    {
        var message = InvalidPropertyOptionError.$parent.prototype.buildMessage.call(this);

        if (!message) {
            message += 'Invalid value of option ' + this.option() + ' ';
            message += 'in definition of property "' + this.property() + '". ';
            message += this.hasExpected() ? ('It must be ' + this.expected() + '. ') : "";
            message += this.hasReceived() ? this.received() : ""
        }

        return message;
    };

    Subclass.Error.registerType(
        InvalidPropertyOptionError.getName(),
        InvalidPropertyOptionError
    );

    return InvalidPropertyOptionError;

})();