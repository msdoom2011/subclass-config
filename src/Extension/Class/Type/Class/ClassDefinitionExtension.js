/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.Type.Class.ClassDefinitionExtension = function()
{
    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Class.ClassExtension;

    ClassDefinitionExtension.$config = {
        classes: ["Class"]
    };

    /**
     * @inheritDoc
     */
    ClassDefinitionExtension.initialize = function(classInst)
    {
        var performClasses = this.getConfig().classes;

        if (performClasses.indexOf(classInst.getClass().getType()) < 0) {
            return false;
        }
        ClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            /**
             * Returns the property instance based on specified data type.
             *
             * @param {(string|{type:{string}})} dataType
             * @returns {Subclass.Property.PropertyAPI}
             * @private
             */
            data._getDataTypeProperty = function(dataType)
            {
                var classManager = this.getClassManager();
                var propertyManager = classManager.getModule().getPropertyManager();
                var property;

                if (
                    dataType
                    && typeof dataType == 'object'
                    && dataType.type
                    && typeof dataType.type == 'string'
                ) {
                    return propertyManager.createProperty('test', dataType).getAPI(this);

                } else if (!dataType || typeof dataType != 'string') {
                    Subclass.Error.create("InvalidArgument")
                        .argument('the data type', false)
                        .received(dataType)
                        .expected('a string')
                        .apply()
                    ;
                }

                if (this.issetProperty(dataType)) {
                    property = this.getProperty(dataType);

                } else {
                    var dataTypeManager = propertyManager.getDataTypeManager();

                    if (dataTypeManager.issetType(dataType)) {
                        property = dataTypeManager.getType(dataType).getAPI(this);
                    }
                }
                if (!property) {
                    Subclass.Error.create(
                        'Specified non existent or data type which ' +
                        'can\'t be used in data type validation.'
                    );
                }
                return property;
            };

            /**
             * Validates and returns default value if the value is undefined
             * or returns the same value as was specified if it's valid
             *
             * @param {(string|{type:{string}})} dataType
             * @param {*} value
             * @param {*} [valueDefault]
             * @returns {*}
             */
            data.value = function(dataType, value, valueDefault)
            {
                var property = this._getDataTypeProperty(dataType);
                dataType = typeof dataType == 'object' ? dataType.type : dataType;

                if (value === undefined && arguments.length == 3) {
                    return valueDefault;

                } else if (value === undefined) {
                    return property.getDefaultValue();

                } else if (!property.isValueValid(value)) {
                    Subclass.Error.create(
                        'Specified invalid value that is not corresponds to data type "' + dataType + '".'
                    );
                }

                return value;
            };

            /**
             * Validates and returns (if valid)
             * @param dataType
             * @param value
             */
            data.result = function(dataType, value)
            {
                var property = this._getDataTypeProperty(dataType);
                dataType = typeof dataType == 'object' ? dataType.type : dataType;

                if (!property.isValueValid(value)) {
                    Subclass.Error.create(
                        'Trying to return not valid value that is not corresponds to data type "' + dataType + '".'
                    );
                }
                return value;
            };
        });
    };

    Subclass.Module.onInitializeAfter(function(evt, module)
    {
        var ClassDefinition = Subclass.ClassManager.getClassType('Class').getDefinitionClass();
            ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();
