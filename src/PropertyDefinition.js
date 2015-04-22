/**
 * @class
 */
Subclass.Property.PropertyDefinition = (function()
{
    /**
     * @param {PropertyType} property
     * @param {Object} propertyDefinition
     * @constructor
     */
    function PropertyDefinition (property, propertyDefinition)
    {
        if (!property || !(property instanceof Subclass.Property.PropertyType)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the property instance", false)
                .received(property)
                .expected('an instance of "Subclass.Property.PropertyType"')
                .apply()
            ;
        }
        if (!propertyDefinition || typeof propertyDefinition != 'object') {
            Subclass.Error.create('InvalidArgument')
                .argument("the definition of property " + property, false)
                .received(propertyDefinition)
                .expected('a plain object')
                .apply()
            ;
        }
        /**
         * @type {PropertyType}
         * @private
         */
        this._property = property;

        /**
         * @type {Object}
         * @private
         */
        this._data = propertyDefinition;
    }

    PropertyDefinition.$parent = null;

    /**
     * Returns property definition
     *
     * @returns {Object}
     */
    PropertyDefinition.prototype.getData = function()
    {
        return this._data;
    };

    /**
     * Returns property instance
     *
     * @returns {PropertyType}
     */
    PropertyDefinition.prototype.getProperty = function()
    {
        return this._property;
    };

    /**
     * Returns empty property value
     *
     * @return {(null|*)}
     */
    PropertyDefinition.prototype.getEmptyValue = function()
    {
        return null;
    };

    /**
     * Validates "type" attribute value
     *
     * @param {*} type
     */
    PropertyDefinition.prototype.validateType = function(type)
    {
        if (typeof type != 'string') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('type')
                .received(type)
                .property(this.getProperty())
                .expected('a string')
                .apply()
            ;
        }
    };

    /**
     * Sets "type" attribute value
     *
     * @param {string} type
     */
    PropertyDefinition.prototype.setType = function(type)
    {
        this.validateType(type);
        this.getData().type = type;
    };

    /**
     * Returns property type
     *
     * @returns {*}
     */
    PropertyDefinition.prototype.getType = function()
    {
        return this.getData().type;
    };

    /**
     * Validates "value" attribute value
     *
     * @param {*} value
     */
    PropertyDefinition.prototype.validateValue = function(value)
    {
        if (value === null && !this.isNullable()) {
            Subclass.Error.create('The property ' + this.getProperty() + ' is not nullable.');
        }
    };

    /**
     * Sets property value
     */
    PropertyDefinition.prototype.setValue = function(value)
    {
        this.validateValue(value);
        this.getData().value = value;
    };

    /**
     * Returns property value
     *
     * @returns {*}
     */
    PropertyDefinition.prototype.getValue = function()
    {
        return this.getData().value;
    };

    /**
     * Validates "default" attribute value
     *
     * @alias Subclass.Property.PropertyDefinition#validateValue
     */
    PropertyDefinition.prototype.validateDefault = PropertyDefinition.prototype.validateValue;

    /**
     * Sets property default value
     */
    PropertyDefinition.prototype.setDefault = function(value)
    {
        this.validateDefault(value);
        this.getData().default = value;
    };

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    PropertyDefinition.prototype.getDefault = function()
    {
        return this.getData().default;
    };

    /**
     * Validates "watcher" attribute value
     *
     * @param {*} watcher
     */
    PropertyDefinition.prototype.validateWatcher = function(watcher)
    {
        if (watcher !== null && typeof watcher != 'function') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('watcher')
                .received(watcher)
                .property(this.getProperty())
                .expected('a funciton or null')
                .apply()
            ;
        }
    };

    /**
     * Sets property watcher
     *
     * @param {(Function|null)} watcher
     */
    PropertyDefinition.prototype.setWatcher = function(watcher)
    {
        this.validateWatcher(watcher);
        this.getData().watcher = watcher;
    };

    /**
     * Returns watcher function or null
     *
     * @returns {(Function|null)}
     */
    PropertyDefinition.prototype.getWatcher = function()
    {
        return this.getData().watcher;
    };

    /**
     * Validates "accessors" attribute value
     *
     * @param {*} isAccessors
     */
    PropertyDefinition.prototype.validateAccessors = function(isAccessors)
    {
        if (isAccessors !== null && typeof isAccessors != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('accessors')
                .received(isAccessors)
                .property(this.getProperty())
                .expected('a boolean or null')
                .apply()
            ;
        }
    };

    /**
     * Sets marker if needs to generate accessor methods for current property
     *
     * @param isAccessors
     */
    PropertyDefinition.prototype.setAccessors = function(isAccessors)
    {
        this.validateAccessors(isAccessors);
        this.getData().accessors = isAccessors;
    };

    /**
     * Checks if there is a need in generation of property accessor methods
     *
     * @returns {(boolean|null)}
     */
    PropertyDefinition.prototype.isAccessors = function()
    {
        var isAccessors = this.getData().accessors;

        return isAccessors !== null ? isAccessors : true;
    };

    /**
     * Validates "writable" attribute value
     *
     * @param {*} isWritable
     */
    PropertyDefinition.prototype.validateWritable = function(isWritable)
    {
        if (isWritable !== null && typeof isWritable != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('writable')
                .received(isWritable)
                .property(this.getProperty())
                .expected('a boolean or null')
                .apply()
            ;
        }
    };

    /**
     * Set marker if current property is writable
     *
     * @param {(boolean|null)} isWritable
     */
    PropertyDefinition.prototype.setWritable = function(isWritable)
    {
        this.validateWritable(isWritable);
        this.getData().writable = isWritable;
    };

    /**
     * Checks if current property is writable
     *
     * @returns {boolean}
     */
    PropertyDefinition.prototype.getWritable = function()
    {
        var isWritable = this.getData().writable;

        return isWritable !== null ? isWritable : true;
    };

    /**
     * @alias Subclass.Property.PropertyDefinition
     */
    PropertyDefinition.prototype.isWritable = PropertyDefinition.prototype.getWritable;

    /**
     * Validates "locked" option value
     *
     * @param {*} isLocked
     */
    PropertyDefinition.prototype.validateLocked = function(isLocked)
    {
        if (isLocked !== null && typeof isLocked != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('locked')
                .received(isLocked)
                .property(this.getProperty())
                .expected('a boolean or null')
                .apply()
            ;
        }
    };

    /**
     * Set marker if current property is locked
     *
     * @param {(boolean|null)} isLocked
     */
    PropertyDefinition.prototype.setLocked = function(isLocked)
    {
        this.validateLocked(isLocked);
        this.getData().locked = isLocked;
    };

    /**
     * Checks if current property is locked
     *
     * @returns {boolean}
     */
    PropertyDefinition.prototype.getLocked = function()
    {
        var isLocked = this.getData().locked;

        return isLocked !== null ? isLocked : false;
    };

    /**
     * @alias Subclass.Property.PropertyDefinition
     */
    PropertyDefinition.prototype.isLocked = PropertyDefinition.prototype.getLocked;

    /**
     * Validates "nullable" attribute value
     *
     * @param {*} isNullable
     */
    PropertyDefinition.prototype.validateNullable = function(isNullable)
    {
        if (isNullable !== null && typeof isNullable != 'boolean') {
            Subclass.Error.create('InvalidPropertyOption')
                .option('nullable')
                .received(isNullable)
                .property(this.getProperty())
                .expected('a boolean or null')
                .apply()
            ;
        }
    };

    /**
     * Sets "nullable" attribute value
     *
     * @param {(boolean|null)} isNullable
     */
    PropertyDefinition.prototype.setNullable = function(isNullable)
    {
        this.validateNullable(isNullable);
        this.getData().nullable = isNullable;
    };

    /**
     * Checks if current property can store null value
     *
     * @returns {(boolean|null)}
     */
    PropertyDefinition.prototype.isNullable = function()
    {
        var isNullable = this.getData().nullable;

        return isNullable !== null ? isNullable : true;
    };

    /**
     * Returns attributes that are required to filling
     *
     * @returns {string[]}
     */
    PropertyDefinition.prototype.getRequiredAttributes = function()
    {
        return ["type"];
    };

    /**
     * Modifies class definition
     *
     * @returns {object}
     */
    PropertyDefinition.prototype.getBaseData = function()
    {
        return {

            /**
             * Type of property data
             *
             * @type {string}
             */
            type: null,

            /**
             * Default value of property
             *
             * @type {(*|null)}
             */
            default: null,

            /**
             * Value of property
             *
             * @type {(*|undefined)}
             */
            value: undefined,

            /**
             * It's true if current parameter is changeable and vice-versa
             *
             * @type {boolean}
             */
            writable: true,

            /**
             * Allows to lock ability to write the new value to property.
             *
             * The difference from "writable" option is in ability
             * to unlock ability to write new value to property during
             * application working whenever you need.
             *
             * @type {boolean}
             */
            locked: false,

            /**
             * Callback that triggers when trying to set property value.
             *
             * It takes three arguments:
             * - the new value;
             * - the old value of property;
             * - the current property object instance
             *
             * Pay attention, that you may access current property context
             * directly in watcher function (it may be the class instance
             * or the map type property etc.) where this one is defined
             * using by "this" property.
             *
             * @type {(function|null)}
             */
            watcher: null,

            /**
             * Indicates that accessor functions would be generated
             *
             * @type {(boolean|null)}
             */
            accessors: null,

            /**
             * Indicates that current property can hold null value or not.
             *
             * If null as a value of current parameter was specified it means
             * that value of current parameter will defined in accordance with
             * the default settings of each property type.
             *
             * @type {(boolean|null)}
             */
            nullable: null
        };
    };

    /**
     * Validating property definition
     */
    PropertyDefinition.prototype.validateData = function()
    {
        var requiredAttributes = this.getRequiredAttributes();
        var definition = this.getData();

        for (var i = 0; i < requiredAttributes.length; i++) {
            var attrName = requiredAttributes[i];

            if (!definition.hasOwnProperty(attrName)) {
                Subclass.Error.create(
                    'Missed required attribute "' + attrName + '" ' +
                    'in definition of the property ' + this.getProperty() + '.'
                );
            }
        }
        if (this.getWritable() === false && this.getValue() !== undefined) {
            console.warn(
                'Specified "value" attribute for definition of not writable ' +
                'property ' + this.getProperty() + '.\n The value in "value" attribute ' +
                'was ignored.\n The value from "default" attribute was applied instead.'
            );
        }
    };

    /**
     * Processing property definition
     */
    PropertyDefinition.prototype.processData = function()
    {
        var definition = Subclass.Tools.copy(this.getData());
        var emptyDefaultValue = !definition.hasOwnProperty('default');

        this._data = this.getBaseData();

        for (var attrName in definition) {
            if (
                !definition.hasOwnProperty(attrName)
                || attrName == 'default'
                || attrName == 'value'
            ) {
                continue;
            }
            var setterMethod = "set" + attrName[0].toUpperCase() + attrName.substr(1);

            if (this[setterMethod]) {
                this[setterMethod](definition[attrName]);
            }
        }

        // Setting default value

        if (emptyDefaultValue) {
            try {
                this.setDefault(this.getEmptyValue());

            } catch (e) {
                console.error(
                    'The default value was not specified. \n' +
                    'The standard default value "' + this.getEmptyValue() + '" was used but it is not relevant. \n' +
                    'You should specify appropriate default value or mark this property as nullable.'
                );
                Subclass.Error.create(e.message);
            }

        } else {
            this.setDefault(definition.default);
        }

        // Setting value

        if (definition.hasOwnProperty('value')) {
            this.setValue(definition.value);
        }
    };

    return PropertyDefinition;
})();
