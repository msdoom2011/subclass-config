/**
 * @namespace
 */
Subclass.Property.Type.Class = {};

/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Class.ClassType = (function()
{
    /**
     * @inheritDoc
     */
    function ClassType()
    {
        ClassType.$parent.apply(this, arguments);
    }

    ClassType.$parent = Subclass.Property.PropertyType;

    /**
     * @inheritDoc
     */
    ClassType.getName = function()
    {
        return "class";
    };

    /**
     * @inheritDoc
     */
    ClassType.getEmptyDefinition = function()
    {
        return false;
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ClassType.parseRelatedClasses = function(propertyDefinition)
    {
        if (!propertyDefinition.className) {
            return;
        }
        return [propertyDefinition.className];
    };

    /**
     * @inheritDoc
     */
    ClassType.normalizeDefinition = function(definition)
    {
        if (Array.isArray(definition) && definition.length >= 1 && definition.length <= 4) {
            var fullDefinition = {};

            if (definition[0]) {
                fullDefinition.type = definition[0];
            }
            if (definition.length >= 2) {
                fullDefinition.className = definition[1];
            }
            if (definition.length >= 3) {
                fullDefinition.default = definition[2];
            }
            if (definition.length == 4) {
                fullDefinition.writable = definition[3];
            }
            return fullDefinition;
        }
        return definition;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.validateValue = function(value)
    {
        ClassType.$parent.prototype.validateValue.call(this, value);

        var neededClassName = this.getClassName();

        if (
            (!value && value !== null)
            || typeof value != 'object'
            || (
                value
                && typeof value == 'object'
                && (
                    !value.$_className
                    || !value.isInstanceOf(neededClassName)
                )
            )
        ) {
            Subclass.Error.create('InvalidPropertyValue')
                .property(this)
                .received(value)
                .expected('an instance of class "' + neededClassName + '" or null')
                .apply()
            ;
        }
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.validateDefault = ClassType.prototype.validateValue;

    /**
     * Validates "className" attribute value
     *
     * @param {*} className
     */
    ClassType.prototype.validateClassName = function(className)
    {
        if (typeof className != 'string') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('className')
                .received(className)
                .property(this)
                .expected('a string')
                .apply()
            ;
        }
        var classManager = this.getPropertyManager().getModule().getClassManager();

        if (!classManager.issetClass(className)) {
            Subclass.Error.create(
                'Specified non existent class in "' + className + '" attribute ' +
                'in definition of property ' + property + '.'
            );
        }
    };

    /**
     * @inheritDoc
     * @throws {Error}
     */
    ClassType.prototype.setNullable = function(nullable)
    {
        this.validateNullable(nullable);

        if (typeof nullable == 'boolean' && !nullable) {
            Subclass.Error.create(
                'The "class" property ' + this + ' ' +
                'can\'t be not nullable.'
            );
        }
    };

    /**
     * Set marker if current property is writable
     *
     * @param {string} className
     */
    ClassType.prototype.setClassName = function(className)
    {
        this.validateClassName(className);
        this.getData().className = className;
    };

    /**
     * Returns "className" attribute value
     *
     * @returns {string}
     */
    ClassType.prototype.getClassName = function()
    {
        return this.getData().className;
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getRequiredOptions = function()
    {
        var attrs = ClassType.$parent.prototype.getRequiredOptions.call(this);

        return attrs.concat(['className']);
    };

    /**
     * @inheritDoc
     */
    ClassType.prototype.getBaseData = function()
    {
        var baseData = ClassType.$parent.prototype.getBaseData.apply(this, arguments);

        /**
         * Allows to specify name of class which value must implement.
         *
         * @type {String}
         */
        baseData.className = null;

        /**
         * @inheritDoc
         */
        baseData.default = null;

        return baseData;
    };

    /*************************************************/
    /*        Registering new property type          */
    /*************************************************/

    Subclass.Property.PropertyManager.registerPropertyType(ClassType);

    return ClassType;

})();
