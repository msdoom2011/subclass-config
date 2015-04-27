/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.ClassDefinitionExtension = function() {

    function ClassDefinitionExtension(classInst)
    {
        ClassDefinitionExtension.$parent.apply(this, arguments);
    }

    ClassDefinitionExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     */
    ClassDefinitionExtension.initialize = function(classInst)
    {
        ClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            /**
             * List of class typed properties
             *
             * @type {Object}
             */
            data.$_properties = {};

            /**
             * Checks if property is typed
             *
             * @param {string} propertyName
             * @returns {boolean}
             */
            data.issetProperty = function(propertyName)
            {
                return this.$_class.issetProperty(propertyName);
            };

            /**
             * Returns property api object
             *
             * @param {string} propertyName
             * @returns {Subclass.Property.PropertyAPI}
             */
            data.getProperty = function(propertyName)
            {
                return this.$_class.getProperty(propertyName).getAPI(this);
            };
        });

        classInst.getEvent('onNormalizeData').addListener(function(evt, data)
        {
            if (
                data.hasOwnProperty('$_properties')
                && Subclass.Tools.isPlainObject(data["$_properties"])
            ) {
                data["$_properties"] = this.normalizeProperties(data["$_properties"]);
            }
        });

        classInst.getEvent('onValidateData').addListener(function(evt, data)
        {
            var classInst = this.getClass();

            for (var propName in data) {
                if (!data.hasOwnProperty(propName)) {
                    continue;
                }
                if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
                    Subclass.Error.create(
                        'Trying to define property with not allowed name "' + propName + '" ' +
                        'in class "' + classInst.getName() + '".'
                    );
                }
            }
        });

        classInst.getEvent('onProcessData').addListener(function(evt, data)
        {
            //Extending accessors

            this.processPropertyAccessors();
        });

        classInst.getEvent('onProcessRelatedClasses').addListener(function(evt) {
            var classInst = this.getClass();
            var classManager = classInst.getClassManager();
            var propertyManager = classManager.getModule().getPropertyManager();
            var dataTypeManager = propertyManager.getDataTypeManager();
            var properties = this.getProperties();

            // Performing $_properties option

            if (properties && Subclass.Tools.isPlainObject(properties)) {
                for (var propName in properties) {
                    if (!properties.hasOwnProperty(propName)) {
                        continue;
                    }
                    var propertyDefinition = propertyManager.normalizePropertyDefinition(properties[propName]);

                    if (typeof propertyDefinition != 'object') {
                        continue;
                    }
                    var propertyTypeName = propertyDefinition.type;

                    if (dataTypeManager.issetType(propertyTypeName)) {
                        var dataTypeDefinition = Subclass.Tools.copy(dataTypeManager.getTypeDefinition(propertyTypeName));
                        propertyTypeName = dataTypeDefinition.type;
                        propertyDefinition = Subclass.Tools.extendDeep(dataTypeDefinition, propertyDefinition);
                        propertyDefinition.type = propertyTypeName;
                    }
                    var propertyType = Subclass.Property.PropertyManager.getPropertyType(propertyDefinition.type);

                    if (!propertyType.parseRelatedClasses) {
                        continue;
                    }
                    var requiredClasses = propertyType.parseRelatedClasses(propertyDefinition);

                    if (requiredClasses && requiredClasses.length) {
                        for (var i = 0; i < requiredClasses.length; i++) {
                            classManager.loadClass(requiredClasses[i]);
                        }
                    }
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassDefinition = Subclass.Class.ClassDefinition;

    /**
     * Sets "$_requires" option value
     *
     * @param {Object.<string>} requires
     *
     *      List of the classes that current one requires. It can be specified in two ways:
     *
     *      1. As an array of class names:
     *
     *      Example:
     *      [
     *         "Namespace/Of/Class1",
     *         "Namespace/Of/Class2",
     *         ...
     *      ]
     *
     *      2. As an object with pairs key/value where key is an class alias and value is a class name.
     *
     *      Example:
     *      {
     *         classAlias1: "Namespace/Of/Class1",
     *         classAlias2: "Namespace/Of/Class2",
     *         ...
     *      }
     */
    ClassDefinition.prototype.setRequires = function(requires)
    {
        this.validateRequires(requires);
        this.getData().$_requires = requires || null;
        var classInst = this.getClass();

        if (requires && Subclass.Tools.isPlainObject(requires)) {
            for (var alias in requires) {
                if (!requires.hasOwnProperty(alias)) {
                    continue;
                }
                classInst.addProperty(alias, {
                    type: "untyped",
                    className: requires[alias]
                });
            }
        }
    };

    /**
     * Validates "$_properties" option value
     *
     * @param {*} properties
     * @returns {boolean}
     * @throws {Error}
     */
    ClassDefinition.prototype.validateProperties = function(properties)
    {
        if (properties && typeof properties != 'object') {
            Subclass.Error.create('InvalidClassOption')
                .option('$_properties')
                .received(properties)
                .className(this.getClass().getName())
                .expected('a plain object with property definitions')
                .apply()
            ;

        } else if (properties) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                if (!Subclass.Property.PropertyManager.isPropertyNameAllowed(propName)) {
                    Subclass.Error.create(
                        'Specified not allowed typed property name "' + propName + '" in option "$_properties" ' +
                        'in definition of class "' + this.getClass().getName() + '".'
                    );
                }
                if (!properties[propName] || !Subclass.Tools.isPlainObject(properties[propName])) {
                    Subclass.Error.create('InvalidClassOption')
                        .option('$_properties')
                        .received(properties)
                        .className(this.getClass().getName())
                        .expected('a plain object with property definitions')
                        .apply()
                    ;
                }
                if (!properties[propName].type) {
                    Subclass.Error.create(
                        'Trying to set not valid definition of typed property "' + propName + '" in option "$_properties" ' +
                        'in definition of class "' + this.getClass().getName() + '". ' +
                        'Required property "type" was missed.'
                    );
                }
            }
        }
        return true;
    };

    /**
     * Normalizes property definitions.
     * Brings all property definitions to the single form.
     *
     * @param {Object} properties
     *      The object with property definitions
     *
     * @returns {Object}
     */
    ClassDefinition.prototype.normalizeProperties = function(properties)
    {
        var classManager = this.getClass().getClassManager();
        var propertyManager = classManager.getModule().getPropertyManager();

        if (properties && Subclass.Tools.isPlainObject(properties)) {
            for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                    properties[propertyName] = propertyManager.normalizePropertyDefinition(
                        properties[propertyName]
                    );
                }
            }
        }
        return properties;
    };

    /**
     * Sets "$_properties" option value
     *
     * @param {Object.<Object>} properties
     *
     *      List of the property definitions
     *
     *      Example: {
     *         propName1: { type: "string", value: "init value" },
     *         propName2: { type: "boolean" },
     *         ...
     *      }
     */
    ClassDefinition.prototype.setProperties = function(properties)
    {
        this.normalizeProperties(properties);
        this.validateProperties(properties);
        this.getData().$_properties = properties || {};

        if (properties) {
            for (var propName in properties) {
                if (!properties.hasOwnProperty(propName)) {
                    continue;
                }
                this.getClass().addProperty(
                    propName,
                    properties[propName]
                );
            }
        }
    };

    /**
     * Return "$_properties" option value
     *
     * @returns {Object.<Object>}
     */
    ClassDefinition.prototype.getProperties = function()
    {
        return this.getData().$_properties;
    };

    /**
    * Extends class constructor with specific methods.
    *
    * If getter or setter of any typed property was redefined in the class definition
    * the new methods will generated. For setter it's gonna be "<setterOrGetterName>Default"
    * where "<setterOrGetterName>" is name of redefined setter or getter name.
    *
    * These methods allows to interact with private properties through redefined getters and setters.
    */
    ClassDefinition.prototype.processPropertyAccessors = function()
    {
        if (!this.getClass().getProperties) {
            return;
        }
        var classProperties = this.getClass().getProperties();
        var classDefinition = this.getData();

        for (var propertyName in classProperties) {
            if (!classProperties.hasOwnProperty(propertyName)) {
                continue;
            }
            var property = classProperties[propertyName];

            if (!property.getDefinition().isAccessors()) {
                continue;
            }
            var accessors = {
                Getter: Subclass.Tools.generateGetterName(propertyName),
                Setter: Subclass.Tools.generateSetterName(propertyName)
            };

            for (var accessorType in accessors) {
                if (!accessors.hasOwnProperty(accessorType)) {
                    continue;
                }
                var accessorName = accessors[accessorType];

                if (classDefinition[accessorName]) {
                    classDefinition[accessorName + "Default"] = property['generate' + accessorType]();
                }
            }
        }
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassDefinition = Subclass.Tools.buildClassConstructor(ClassDefinition);

        if (!ClassDefinition.hasExtension(ClassDefinitionExtension)) {
            ClassDefinition.registerExtension(ClassDefinitionExtension);
        }
    });

    return ClassDefinitionExtension;
}();