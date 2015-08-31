/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.ClassTypeExtension = function() {

    function ClassTypeExtension(classInst)
    {
        ClassTypeExtension.$parent.apply(this, arguments);
    }

    //ClassTypeExtension.$parent = Subclass.Class.ClassExtension;
    ClassTypeExtension.$parent = Subclass.Extension;

    //ClassTypeExtension.$config = {
    //    classes: ["Class", "Config"]
    //};

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

        classInst.getEvent('onCreateClassAfter').addListener(function(evt, classConstructor)
        {
            this.attachProperties(classConstructor.prototype);
        });

        classInst.getEvent('onCreateInstanceBefore').addListener(function(evt, classInstance)
        {
            var classProperties = this.getProperties(true);
            this.attachPropertyMethods(classInstance);

            //Attaching hashed typed properties

            for (var propertyName in classProperties) {
                if (!classProperties.hasOwnProperty(propertyName)) {
                    continue;
                }

                // Getting init value

                var property = classInstance.getProperty(propertyName);
                var propertyDefinition = classProperties[propertyName];
                var initValue = propertyDefinition.getValue();

                // Setting init value

                if (initValue !== undefined) {
                    property.setValue(initValue, false);
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
                        var requiredClass = classManager.get(requiredClassName);

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
        if (!this.getProperties) {
            return;
        }
        var classProperties = this.getProperties();

        for (var propName in classProperties) {
            if (classProperties.hasOwnProperty(propName)) {
                classProperties[propName].attach(context, propName);
            }
        }
    };

    /**
     * Attaches methods for work with properties
     *
     * @param context
     */
    ClassType.prototype.attachPropertyMethods = function(context)
    {
        if (!this.getProperties) {
            return;
        }
        var allClassProperties = this.getProperties(true);
        var properties = {};

        /**
         * Returns property api object
         *
         * @param {string} propertyName
         * @returns {Subclass.Property.Property}
         */
        context.getProperty = function (propertyName)
        {
            return properties[propertyName];
        };

        /**
         * Checks if property is typed
         *
         * @param {string} propertyName
         * @returns {boolean}
         */
        context.issetProperty = function (propertyName)
        {
            return properties.hasOwnProperty(propertyName);
        };

        /**
         * Returns context type name
         *
         * @returns {string}
         */
        context.getContextType = function ()
        {
            return "class";
        };

        for (var propName in allClassProperties) {
            if (allClassProperties.hasOwnProperty(propName)) {
                properties[propName] = allClassProperties[propName].createInstance(propName);
                properties[propName].setContext(context);
                properties[propName].resetValue(false);
            }
        }
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onCreate(function(evt, module)
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