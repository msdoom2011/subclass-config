/**
 * @namespace
 */
Subclass.Property.Type.Constructor = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Constructor.ConstructorType = function()
{
    /**
     * @inheritDoc
     */
    function ConstructorType()
    {
        ConstructorType.$parent.apply(this, arguments);
    }

    ConstructorType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ConstructorType.getName = function()
    {
        return "constructor";
    };

    /**
     * @inheritDoc
     */
    ConstructorType.getEmptyDefinition = function()
    {
        return false;
    };

    ConstructorType.prototype = {

        /**
         * @inheritDoc
         * @throws {Error}
         */
        setNullable: function(nullable)
        {
            this.validateNullable(nullable);

            if (typeof nullable == 'boolean' && !nullable) {
                Subclass.Error.create(
                    'The "constructor" type property ' + this + ' should be always nullable.'
                );
            }
        },

        /**
         * @inheritDoc
         */
        validateValue: function (value)
        {
            ConstructorType.$parent.prototype.validateValue.call(this, value);

            var constructor = this.getConstruct();

            if (
                value !== null
                && (
                    typeof value != 'object'
                    || !(value instanceof constructor)
                )
            ) {
                Subclass.Error.create('InvalidPropertyValue')
                    .property(this)
                    .received(value)
                    .expected("an object which is instance of constructor function " + constructor.name)
                    .apply()
                ;
            }
            return true;
        },

        /**
         * Validates "construct" option value
         *
         * @param {*} constructor
         */
        validateConstruct: function(constructor)
        {
            if (typeof constructor != 'function') {
                Subclass.Error.create('InvalidPropertyOption')
                    .option('construct')
                    .property(this)
                    .received(constructor)
                    .expected('a constructor function which prototype the object value should inherit')
                    .apply()
                ;
            }
        },

        /**
         * Sets "construct" option
         *
         * @param {Function} constructor
         */
        setConstruct: function(constructor)
        {
            this.validateConstruct(constructor);
            this.getData().construct = constructor;
        },

        /**
         * Returns value of "construct" option
         *
         * @returns {Function}
         */
        getConstruct: function()
        {
            return this.getData().construct;
        },

        /**
         * @inheritDoc
         */
        getRequiredOptions: function()
        {
            var attrs = ConstructorType.$parent.prototype.getRequiredOptions.call(this);

            return attrs.concat(['construct']);
        },

        /**
         * @inheritDoc
         */
        getBaseData: function()
        {
            var baseData = ConstructorType.$parent.prototype.getBaseData.apply(this, arguments);

            /**
             * Is used to specify the constructor of object instances which current property should store.
             *
             * Every value you want to set to this value should satisfy the condition:
             * {yourObject} instanceof {constructorFunction}
             *
             * @type {Function}
             */
            baseData.construct = null;

            /**
             * @inheritDoc
             */
            baseData.nullable = true;

            /**
             * @inheritDoc
             */
            baseData.default = null;

            return baseData;
        }
    };

    /**
     * @inheritDoc
     */
    ConstructorType.prototype.validateDefault = ConstructorType.prototype.validateValue;


    /*************************************************/
    /*           Registering new data type           */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ConstructorType);

    return ConstructorType;

}();
