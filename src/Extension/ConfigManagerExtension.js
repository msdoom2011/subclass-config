/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.ConfigManagerExtension = function() {

    function ConfigManagerExtension(classInst)
    {
        ConfigManagerExtension.$parent.apply(this, arguments);
    }

    ConfigManagerExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ConfigManager = Subclass.ConfigManager;

    /**
     * Defines custom data types relying on existent property types
     * registered in Subclass.Property.PropertyManager.
     *
     * You can also redefine definitions of standard data types,
     * for example, if you want to set default value for all number properties or
     * customize it to be not nullable etc.
     *
     * @method setDataTypes
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @throws {Error}
     *      Throws error if trying to change value after the module became ready
     *
     * @param {Object.<Object>} propertyDefinitions
     *      A plain object with property definitions. Each property
     *      in turn also is a plain object. To learn more look at
     *      {@link Subclass.Property.PropertyManager#createProperty}
     *
     * @example
     * ...
     *
     * var moduleConfigs = moduleInst.getConfigManager();
     *
     * // Setting data types
     * moduleConfigs.setDataTypes({
     *     percents: {               // name of data type
     *         type: "string",       // type of property
     *         pattern: /^[0-9]+%$/, // RegExp instance object
     *         value: "0%"           // default property value
     *     },
     *     ...
     * });
     * ...
     *
     * // Registering TestClass
     * moduleInst.registerClass("Name/Of/TestClass", {
     *     ...
     *     $_properties: {
     *         percentsProp: { type: "percents" }
     *         ...
     *     },
     *     ...
     * });
     *
     * // Creating TestClass instance
     * var testClass = moduleInst.getClass("Name/Of/TestClass");
     * var testClassInst = testClass.createInstance();
     *
     * // Trying to set percentsProp property value
     * testClass.setPercentsProp("10%"); // normally set
     * testClass.setPercentsProp("10");  // throws error
     * ...
     */
    ConfigManager.prototype.setDataTypes = function(propertyDefinitions)
    {
        this.checkModuleIsReady();
        this.getModule()
            .getPropertyManager()
            .addTypeDefinitions(propertyDefinitions)
            //.defineDataTypes(propertyDefinitions)
        ;
    };

    /**
     * Returns defined custom data types in the form in which they were set
     *
     * @method getDataTypes
     * @memberOf Subclass.ConfigManager.prototype
     *
     * @returns {Object.<Object>}
     */
    ConfigManager.prototype.getDataTypes = function()
    {
        return this.getModule()
            .getPropertyManager()
            //.getDataTypeManager()
            .getTypeDefinitions()
        ;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ConfigManager = Subclass.Tools.buildClassConstructor(ConfigManager);

        if (!ConfigManager.hasExtension(ConfigManagerExtension)) {
            ConfigManager.registerExtension(ConfigManagerExtension);
        }
    });

    return ConfigManagerExtension;
}();