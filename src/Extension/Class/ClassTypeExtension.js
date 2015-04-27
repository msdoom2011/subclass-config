/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.ClassTypeExtension = function() {

    function ClassTypeExtension(classInst)
    {
        ClassTypeExtension.$parent.apply(this, arguments);
    }

    ClassTypeExtension.$parent = Subclass.Class.ClassExtension;

    ClassTypeExtension.$config = {
        classes: ["Class", "Config"]
    };

    /**
     * @inheritDoc
     */
    ClassTypeExtension.initialize = function(classInst)
    {
        ClassTypeExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onInitialize').addListener(function()
        {
            /**
            * @type {Object}
            * @protected
            */
            this._properties = {};
        });

        classInst.getEvent('onCreate').addListener(function(evt, classConstructor)
        {
            this.attachProperties(classConstructor.prototype);
        });

        classInst.getEvent('onCreateInstanceBefore').addListener(function(evt, classInstance)
        {
            var classProperties = this.getProperties(true);

            //Attaching hashed typed properties

            for (var propertyName in classProperties) {
                if (!classProperties.hasOwnProperty(propertyName)) {
                    continue;
                }

                classProperties[propertyName].attachHashed(classInstance);

                // Getting init value

                var property = classProperties[propertyName];
                var propertyDefinition = property.getDefinition();
                var initValue = propertyDefinition.getValue();

                // Setting init value

                if (initValue !== undefined) {
                    if (propertyDefinition.isAccessors()) {
                        var setterName = Subclass.Tools.generateSetterName(propertyName);
                        classInstance[setterName](initValue);

                    } else {
                        classInstance[propertyName] = initValue;
                    }
                    property.setIsModified(false);
                }
            }
        });

        classInst.getEvent('onCreateInstance').addListener(function(evt, classInstance)
        {
            var classManager = this.getClassManager();

            // Setting required classes to alias typed properties

            if (classInstance.$_requires) {
                if (Subclass.Tools.isPlainObject(classInstance.$_requires)) {
                    for (var alias in classInstance.$_requires) {
                        if (!classInstance.$_requires.hasOwnProperty(alias)) {
                            continue;
                        }
                        var setterName = Subclass.Tools.generateSetterName(alias);
                        var requiredClassName = classInstance.$_requires[alias];
                        var requiredClass = classManager.getClass(requiredClassName);

                        classInstance[setterName](requiredClass);
                    }
                }
            }
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassType = Subclass.Class.ClassType;

    /**
     * Returns all typed properties in current class definition instance
     *
     * @param {boolean} [withInherited]
     * @returns {Object.<Subclass.Property.PropertyType>}
     */
    ClassType.prototype.getProperties = function(withInherited)
    {
        var properties = {};

        if (withInherited !== true) {
            withInherited = false;
        }

        if (withInherited && this.hasParent()) {
            var parentClass = this.getParent();
            var parentClassProperties = parentClass.getProperties(withInherited);

            Subclass.Tools.extend(
                properties,
                parentClassProperties
            );
        }
        return Subclass.Tools.extend(
            properties,
            this._properties
        );
    };

    /**
     * Adds new typed property to class
     *
     * @param {string} propertyName
     * @param {Object} propertyDefinition
     */
    ClassType.prototype.addProperty = function(propertyName, propertyDefinition)
    {
        var propertyManager = this.getClassManager().getModule().getPropertyManager();

        this._properties[propertyName] = propertyManager.createProperty(
            propertyName,
            propertyDefinition,
            this
        );
    };

    /**
     * Returns property instance by its name
     *
     * @param {string} propertyName
     * @returns {Subclass.Property.PropertyType}
     * @throws {Error}
     */
    ClassType.prototype.getProperty = function(propertyName)
    {
        var classProperties = this.getProperties();

        if (!classProperties[propertyName] && this.hasParent()) {
            return this.getParent().getProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            Subclass.Error.create(
                'Trying to call to non existent property "' + propertyName + '" ' +
                'in class "' + this.getName() + '".'
            );
        }
        return this.getProperties()[propertyName];
    };

    /**
     * Checks if property with specified property name exists
     *
     * @param {string} propertyName
     * @returns {boolean}
     */
    ClassType.prototype.issetProperty = function(propertyName)
    {
        var classProperties = this.getProperties();

        if (!classProperties[propertyName] && this.hasParent()) {
            return this.getParent().issetProperty(propertyName);

        } else if (!classProperties[propertyName]) {
            return false;
        }
        return true;
    };

    /**
     * Creates and attaches class typed properties
     *
     * @param {Object} context Class constructor prototype
     */
    ClassType.prototype.attachProperties = function(context)
    {
        var classProperties = this.getProperties();

        for (var propName in classProperties) {
            if (!classProperties.hasOwnProperty(propName)) {
                continue;
            }
            classProperties[propName].attach(context);
        }
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ClassType = Subclass.Tools.buildClassConstructor(ClassType);

        if (!ClassType.hasExtension(ClassTypeExtension)) {
            ClassType.registerExtension(ClassTypeExtension);

            /*************************************************/
            /*        Performing register operations         */
            /*************************************************/

            // Adding not allowed class properties

            Subclass.Property.PropertyManager.registerNotAllowedPropertyNames([
                "class",
                "parent",
                "classManager",
                "class_manager",
                "classWrap",
                "class_wrap",
                "className",
                "class_name"
            ]);
        }
    });

    return ClassTypeExtension;
}();