/**
 * @namespace
 */
Subclass.Property = {};

/**
 * @namespace
 */
Subclass.Property.Error = {};

/**
 * @namespace
 */
Subclass.Property.Type = {};

/**
 * @namespace
 */
Subclass.Property.Extension = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.Class = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.AbstractClass = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.Interface = {};

/**
 * @namespace
 */
Subclass.Property.Extension.Class.Type.Trait = {};

/**
 * @class
 */
Subclass.Property.PropertyManager = (function()
{
    /**
     * Property manager constructor
     *
     * @param {Subclass.Module.Module} module - Instance of module
     * @constructor
     */
    function PropertyManager(module)
    {
        /**
         * Instance of module
         *
         * @type {Subclass.Module.Module}
         * @private
         */
        this._module = module;

        /**
         * @type {(Object.<Object>|{})}
         * @private
         */
        this._typeDefinitions = {};

        /**
         * @type {(Object.<Subclass.Property.PropertyType>|{})}
         * @private
         */
        this._types = {};
    }

    PropertyManager.prototype.initialize = function()
    {
        //this.getDataTypeManager().initialize();

        var module = this.getModule();
        var eventManager = module.getEventManager();
        var $this = this;

        eventManager.getEvent('onLoadingEnd').addListener(function() {
            var typeDefinitions = $this.getTypeDefinitions();

            // Initializing type definitions

            for (var typeName in typeDefinitions) {
                if (!typeDefinitions.hasOwnProperty(typeName)) {
                    continue;
                }
                var typeDefinition = typeDefinitions[typeName];

                $this._types[typeName] = $this.createProperty(
                    typeName,
                    Subclass.Tools.copy(typeDefinition)
                );
            }
        });

        if (module.isRoot()) {
            var propertyTypes = PropertyManager.getPropertyTypes();
            var defaultTypeDefinitions = {};

            for (var typeName in propertyTypes) {
                if (!propertyTypes.hasOwnProperty(typeName)) {
                    continue;
                }

                var defaultPropertyDefinition = propertyTypes[typeName].getEmptyDefinition();

                if (defaultPropertyDefinition) {
                    defaultTypeDefinitions[typeName] = defaultPropertyDefinition;
                }
            }

            this._typeDefinitions = Subclass.Tools.extendDeep(
                defaultTypeDefinitions,
                this._typeDefinitions
            );
        }
    };

    /**
     * Returns subclass module instance
     *
     * @returns {Subclass.Module.Module}
     */
    PropertyManager.prototype.getModule = function()
    {
        return this._module;
    };
    //
    ///**
    // * Returns instance of data type manager
    // *
    // * @returns {Subclass.Property.DataTypeManager}
    // */
    //PropertyManager.prototype.getDataTypeManager = function()
    //{
    //    return this._dataTypeManager;
    //};

    /**
     * Validates data type definitions
     *
     * @param {Object.<Object>} definitions
     * @throws {Error}
     */
    PropertyManager.prototype.validateTypeDefinitions = function(definitions)
    {
        try {
            if (!Subclass.Tools.isPlainObject(definitions)) {
                throw 'error';
            }
            for (var typeName in definitions) {
                if (!definitions.hasOwnProperty(typeName)) {
                    continue;
                }
                if (!Subclass.Tools.isPlainObject(definitions[typeName])) {
                    throw 'error';
                }
            }

        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the data type definitions", false)
                    .received(definitions)
                    .expected('a plain object with another plain objects')
                    .apply()
                ;
            } else {
                throw e;
            }
        }
    };
    //
    ///**
    // * Defines data types
    // *
    // * @param {Object.<Object>} definitions
    // */
    //PropertyManager.prototype.defineDataTypes = function(definitions)
    //{
    //    this.getDataTypeManager().addTypeDefinitions(definitions);
    //};

    /**
     * Adds new type definitions
     *
     * @param {Object.<Object>} definitions
     */
    PropertyManager.prototype.addTypeDefinitions = function(definitions)
    {
        this.validateTypeDefinitions(definitions);

        for (var typeName in definitions) {
            if (definitions.hasOwnProperty(typeName)) {
                this._typeDefinitions[typeName] = definitions[typeName];
            }
        }
    };

    /**
     * Normalizes definition of data type
     *
     * @param definition
     * @returns {*}
     */
    PropertyManager.prototype.normalizeTypeDefinition = function(definition)
    {
        //var dataTypeManager = this.getDataTypeManager();

        if (definition === undefined || definition === null) {
            Subclass.Error.create("InvalidArgument")
                .argument('the definition of property', false)
                .received(definition)
                .expected('not null or undefined')
                .apply()
            ;
        }
        if (typeof definition == 'string' && this.issetType(definition)) {
            return this.getTypeDefinition(definition);
        }
        if (Array.isArray(definition) && definition.length >= 1) {
            var dataTypeName, dataType;

            if (definition[0] && PropertyManager.issetPropertyType(definition[0])) {
                dataTypeName = definition[0];
                dataType = PropertyManager.getPropertyType(dataTypeName);

                definition = dataType.normalizeDefinition(definition);

            } else if (definition[0] && this.issetType(definition[0])) {
                dataTypeName = definition[0];
                definition = this.getTypeDefinition(dataTypeName);
            }
        }
        return definition;
    };

    /**
     * Returns definitions of custom types
     *
     * @param {boolean} [privateDefinitions = false]
     *      If passed true it returns type definitions only from current module
     *      without type definitions from its plug-ins
     *
     * @returns {Object}
     */
    PropertyManager.prototype.getTypeDefinitions = function(privateDefinitions)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var typeDefinitions = {};
        var $this = this;

        if (privateDefinitions !== true) {
            privateDefinitions = false;
        }
        if (privateDefinitions) {
            return this._typeDefinitions;
        }

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(typeDefinitions, $this._typeDefinitions);
                return;
            }
            var modulePropertyManager = module.getPropertyManager();
            var moduleDefinitions = modulePropertyManager.getTypeDefinitions();

            Subclass.Tools.extend(typeDefinitions, moduleDefinitions);
        });

        return typeDefinitions;
    };

    /**
     * Returns definition of data type
     *
     * @param {string} typeName
     * @returns {Object}
     * @throws {Error}
     */
    PropertyManager.prototype.getTypeDefinition = function(typeName)
    {
        if (!this.issetType(typeName)) {
            Subclass.Error.create('Trying to get definition of non existent data type "' + typeName + '".');
        }
        return this.getTypeDefinitions()[typeName];
    };
    //
    ///**
    // * Returns hash of all properties that will further created
    // *
    // * @returns {number}
    // */
    //PropertyManager.prototype.getPropertyNameHash = function()
    //{
    //    return this._hash;
    //};

    /**
     * Returns data types
     *
     * @param {boolean} [privateTypes = false]
     *      If passed true it returns data types only from current module
     *      without data types from its plug-ins
     *
     * @returns {Object}
     */
    PropertyManager.prototype.getTypes = function(privateTypes)
    {
        var mainModule = this.getModule();
        var moduleStorage = mainModule.getModuleStorage();
        var dataTypes = {};
        var $this = this;

        if (privateTypes !== true) {
            privateTypes = false;
        }
        if (privateTypes) {
            return this._types;
        }

        moduleStorage.eachModule(function(module) {
            if (module == mainModule) {
                Subclass.Tools.extend(dataTypes, $this._types);
                return;
            }
            var modulePropertyManager = module.getPropertyManager();
            var moduleDataTypes = modulePropertyManager.getTypes();

            Subclass.Tools.extend(dataTypes, moduleDataTypes);
        });

        return dataTypes;
    };

    /**
     * Returns data type instance
     *
     * @param {string} typeName
     * @returns {PropertyType}
     */
    PropertyManager.prototype.getType = function(typeName)
    {
        if (!this.issetType(typeName)) {
            Subclass.Error.create('Trying to get definition of non existent data type "' + typeName + '".');
        }
        return this.getTypes()[typeName];
    };

    /**
     * Checks if specified data type exists
     *
     * @param {string} typeName
     * @returns {boolean}
     */
    PropertyManager.prototype.issetType = function(typeName)
    {
        return this.getTypeDefinitions().hasOwnProperty(typeName);
    };

    /**
     * Creates instance of specified type property
     *
     * @param {string} propertyName
     *      A name of the property.
     *
     * @param {Object} propertyDefinition
     *      A plain object which describes property.
     *
     * @param {Subclass.Class.ClassType} [contextClass]
     *      A Subclass.Class.ClassType instance to which creating property will belongs to.
     *
     * @param {Subclass.Property.PropertyType} [contextProperty]
     *      A Subclass.Property.PropertyType instance to witch creating property will belongs to.
     *
     * @returns {Subclass.Property.PropertyType}
     */
    PropertyManager.prototype.createProperty = function(propertyName, propertyDefinition, contextClass, contextProperty)
    {
        if (!Subclass.Tools.isPlainObject(propertyDefinition)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the definition of property "' + propertyName + '"', false)
                .received(propertyDefinition)
                .expected('a plain object with mandatory property "type"')
                .apply()
            ;
        }
        //var dataTypeManager = this.getDataTypeManager();
        var propertyTypeName = propertyDefinition.type;

        if (this.issetType(propertyTypeName)) {
            var dataTypeDefinition = Subclass.Tools.copy(this.getTypeDefinition(propertyTypeName));
            propertyTypeName = dataTypeDefinition.type;

            propertyDefinition = Subclass.Tools.extendDeep(dataTypeDefinition, propertyDefinition);
            propertyDefinition.type = propertyTypeName;
        }

        if (!PropertyManager.issetPropertyType(propertyTypeName)) {
            var propertyFullName = (contextProperty && contextProperty.getNameFull() + "." || '') + propertyName;

            Subclass.Error.create(
                'Trying to create property "' + propertyFullName + '" of none existent type "' + propertyTypeName + '"' +
                (contextClass && ' in class "' + contextClass.getName() + '"') + '.'
            );
        }

        var classConstructor = PropertyManager.getPropertyType(propertyDefinition.type);
        var inst = Subclass.Tools.createClassInstance(classConstructor, this, propertyName, propertyDefinition);

        // Setting context class and property

        inst.setContextClass(contextClass || null);
        inst.setContextProperty(contextProperty || null);

        // Checking if property name allowed

        if (!contextProperty && !Subclass.Property.PropertyManager.isPropertyNameAllowed(propertyName)) {
            Subclass.Error.create(
                'Trying to define property with not allowed name "' + propertyName + '"' +
                (contextClass && ' in class "' + contextClass.getName() + '"' || "") +  "."
            );
        }
        inst.initialize();

        return inst;
    };


    //================================ PUBLIC API ==================================

    /**
     * A collection of registered property types
     *
     * @type {Object.<Function>}
     * @private
     */
    PropertyManager._propertyTypes = {};

    /**
     * A collection of non allowed property names
     *
     * @type {Array}
     * @private
     */
    PropertyManager._notAllowedPropertyNames = [];

    /**
     * Registering new property type
     *
     * @param {Function} propertyTypeConstructor
     */
    PropertyManager.registerPropertyType = function(propertyTypeConstructor)
    {
        var propertyTypeName = propertyTypeConstructor.getName();

        this._propertyTypes[propertyTypeName] = Subclass.Tools.buildClassConstructor(propertyTypeConstructor);
    };

    /**
     * Returns property type constructor
     *
     * @param {string} propertyTypeName
     * @returns {Function}
     */
    PropertyManager.getPropertyType = function(propertyTypeName)
    {
        if (!this.issetPropertyType(propertyTypeName)) {
            Subclass.Error.create(
                'Trying to get non existed property type ' +
                'factory "' + propertyTypeName + '".'
            );
        }
        return this._propertyTypes[propertyTypeName];
    };

    /**
     * Returns all registered property types
     *
     * @returns {Object.<Function>}
     */
    PropertyManager.getPropertyTypes = function()
    {
        return this._propertyTypes;
    };

    /**
     * Checks if needed property type was ever registered
     *
     * @param {string} propertyTypeName
     * @returns {boolean}
     */
    PropertyManager.issetPropertyType = function(propertyTypeName)
    {
        return this._propertyTypes.hasOwnProperty(propertyTypeName);
    };

    /**
     * Registers new not allowed class property name
     *
     * @param {Array} propertyNames
     */
    PropertyManager.registerNotAllowedPropertyNames = function(propertyNames)
    {
        try {
            if (!Array.isArray(propertyNames)) {
                throw "error";
            }
            for (var i = 0; i < propertyNames.length; i++) {
                if (this._notAllowedPropertyNames.indexOf(propertyNames[i]) < 0) {
                    if (typeof propertyNames[i] != "string") {
                        throw "error";
                    }
                    this._notAllowedPropertyNames.push(propertyNames[i]);
                }
            }
        } catch (e) {
            if (e == 'error') {
                Subclass.Error.create('InvalidArgument')
                    .argument("the not allowed names of property", false)
                    .received(propertyNames)
                    .expected("an array of strings")
                    .apply()
                ;
            } else {
                throw e;
            }
        }
    };

    /**
     * Returns not allowed property names
     *
     * @returns {string[]}
     */
    PropertyManager.getNotAllowedPropertyNames = function()
    {
        return this._notAllowedPropertyNames;
    };

    /**
     * Checks if specified class property name is allowed
     *
     * @param propertyName
     * @returns {boolean}
     */
    PropertyManager.isPropertyNameAllowed = function(propertyName)
    {
        if (propertyName.match(/[^\$a-z0-9_]/i)) {
            return false;
        }
        for (var i = 0; i < this._notAllowedPropertyNames.length; i++) {
            var regExp = new RegExp("^_*" + this._notAllowedPropertyNames[i] + "_*$", 'i');

            if (regExp.test(propertyName)) {
                return false;
            }
        }
        return true;
    };

    return PropertyManager;

})();