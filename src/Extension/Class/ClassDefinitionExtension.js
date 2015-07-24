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

        });

        classInst.getEvent('onNormalizeData').addListener(function(evt, data)
        {
            if (
                data.hasOwnProperty('$_properties')
                && Subclass.Tools.isPlainObject(data["$_properties"])
            ) {
                data.$_properties = this.normalizeProperties(data.$_properties);

                // Validating result properties

                for (var propName in data.$_properties) {
                    if (data.$_properties.hasOwnProperty(propName)) {
                        var property = data.$_properties[propName];

                        if (!property || !Subclass.Tools.isPlainObject(property)) {
                            Subclass.Error.create(
                                'Specified invalid definition of property "' + propName + '" ' +
                                'in class "' + this.getClass().getName() + '".'
                            );
                        }
                    }
                }
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

        classInst.getEvent('onProcessRelatedClasses').addListener(function(evt)
        {
            var classInst = this.getClass();
            var classManager = classInst.getClassManager();
            var propertyManager = classManager.getModule().getPropertyManager();
            var properties = this.getProperties();

            // Performing $_properties option

            if (properties && Subclass.Tools.isPlainObject(properties)) {
                for (var propName in properties) {
                    if (!properties.hasOwnProperty(propName)) {
                        continue;
                    }
                    var propertyDefinition = propertyManager.normalizeTypeDefinition(
                        properties[propName],
                        propName
                    );

                    if (typeof propertyDefinition != 'object') {
                        continue;
                    }
                    var propertyTypeName = propertyDefinition.type;

                    if (propertyManager.issetType(propertyTypeName)) {
                        var dataTypeDefinition = Subclass.Tools.copy(propertyManager.getTypeDefinition(propertyTypeName));
                        propertyTypeName = dataTypeDefinition.type;
                        propertyDefinition = Subclass.Tools.extendDeep(dataTypeDefinition, propertyDefinition);
                        propertyDefinition.type = propertyTypeName;
                    }
                    var propertyType = Subclass.Property.PropertyManager.getPropertyType(propertyTypeName);

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
     * List of the classes that current one requires. It can be specified in two ways:
     *
     * 1. As an array of class names:
     *
     * Example:
     * [
     *    "Namespace/Of/Class1",
     *    "Namespace/Of/Class2",
     *    ...
     * ]
     *
     * 2. As an object with pairs key/value where key is an class alias and value is a class name.
     *
     * Example:
     * {
     *    classAlias1: "Namespace/Of/Class1",
     *    classAlias2: "Namespace/Of/Class2",
     *    ...
     * }
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
                        .option('"$_properties" (invalid definition of property "' + propName + '")', false)
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
     * Returns functions which should normalize class properties collection
     *
     * Each normalizer takes one argument, which is properties collection object.
     * It can modify this collection whatever its needed and after that should
     * return this collection back.
     *
     * @returns {Array.<Function>}
     */
    ClassDefinition.prototype.getPropertyNormalizers = function()
    {
        var $this = this;

        return [

            // Processing parent class

            function(properties) {
                if ($this.getExtends && $this.getExtends()) {
                    var parentClassName = $this.getExtends();
                    var parentClass = $this.getClass().getClassManager().getClass(parentClassName);
                    var parentClassConstructor = parentClass.getConstructor();

                    // Processing parent class properties

                    properties = $this.extendProperties(
                        parentClass.getDefinition().getProperties(),
                        properties
                    );
                }

                return properties;
            }
        ];
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

        // Bringing property definition to the single form

        if (properties && Subclass.Tools.isPlainObject(properties)) {
            for (var propertyName in properties) {
                if (properties.hasOwnProperty(propertyName)) {
                    properties[propertyName] = propertyManager.normalizeTypeDefinition(
                        properties[propertyName],
                        propertyName
                    );
                }
            }
        }

        // Solving issues of extending property definitions
        // from parent to child class

        var normalizers = this.getPropertyNormalizers();

        for (var i = 0; i < normalizers.length; i++) {
            properties = normalizers[i](properties);
        }

        return properties;
    };

    /**
     * Extending class property definitions
     *
     * @param {Object} childProperties
     * @param {Object} parentProperties
     */
    ClassDefinition.prototype.extendProperties = function(parentProperties, childProperties)
    {
        parentProperties = Subclass.Tools.copy(parentProperties);

        for (var propName in childProperties) {
            if (!childProperties.hasOwnProperty(propName)) {
                continue;
            }
            if (
                Subclass.Tools.isPlainObject(childProperties[propName])
                && childProperties[propName].hasOwnProperty('type')
                && parentProperties
                && parentProperties.hasOwnProperty(propName)
            ) {
                if (childProperties[propName].extends === true) {
                    parentProperties[propName] = Subclass.Tools.extend(
                        parentProperties[propName],
                        childProperties[propName]
                    );
                } else {
                    parentProperties[propName] = childProperties[propName];
                }

            } else if (
                parentProperties
                && parentProperties[propName]
            ) {
                parentProperties[propName] = Subclass.Tools.extend(
                    parentProperties[propName],
                    { value: childProperties[propName] }
                );

            } else {
                parentProperties[propName] = childProperties[propName];
            }
        }

        return parentProperties;
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