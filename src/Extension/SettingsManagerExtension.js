/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.SettingsManagerExtension = function() {

    function SettingsManagerExtension(classInst)
    {
        SettingsManagerExtension.$parent.apply(this, arguments);
    }

    SettingsManagerExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var SettingsManager = Subclass.SettingsManager;

    /**
     * Sets module configuration option values
     *
     * @param {Object} configs
     */
    SettingsManager.prototype.setConfigs = function(configs)
    {
        if (!configs) {
            return;
        }
        var configManager = this.getModule().getConfigManager();
        configManager.setConfigs(configs);
    };

    /**
     * Returns module configuration
     *
     * @returns {Object}
     */
    SettingsManager.prototype.getConfigs = function()
    {
        var configManager = this.getModule().getConfigManager();
        return configManager.getConfigs();
    };

    /**
     * Sets callback function which will invoke right after module configuration
     * has been processed.
     *
     * It is a good opportunity to modify its settings using plugins of application.
     *
     * @method setOnConfig
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @throws {Error}
     *      Throws error if:<br />
     *      - trying to change value after the module became ready<br />
     *      - specified not function argument value
     *
     * @param callback
     */
    SettingsManager.prototype.setOnConfig = function(callback)
    {
        this.checkModuleIsReady();

        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument('the callback', false)
                .received(callback)
                .expected('a function')
                .apply()
            ;
        }
        var eventManager = this.getModule().getEventManager();
        var onSetupEvent = eventManager.getEvent('onConfig');

        onSetupEvent.addListener(callback);
    };

    /**
     * Defines custom data types relying on existent property types
     * registered in Subclass.Property.PropertyManager.
     *
     * You can also redefine definitions of standard data types,
     * for example, if you want to set default value for all number properties or
     * customize it to be not nullable etc.
     *
     * @method setDataTypes
     * @memberOf Subclass.SettingsManager.prototype
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
     * var moduleSettings = moduleInst.getSettingsManager();
     *
     * // Setting data types
     * moduleSettings.setDataTypes({
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
    SettingsManager.prototype.setDataTypes = function(propertyDefinitions)
    {
        this.checkModuleIsReady();
        this.getModule()
            .getPropertyManager()
            .addTypeDefinitions(propertyDefinitions)
        ;
    };

    /**
     * Returns defined custom data types in the form in which they were set
     *
     * @method getDataTypes
     * @memberOf Subclass.SettingsManager.prototype
     *
     * @returns {Object.<Object>}
     */
    SettingsManager.prototype.getDataTypes = function()
    {
        return this.getModule()
            .getPropertyManager()
            .getTypeDefinitions()
        ;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        SettingsManager = Subclass.Tools.buildClassConstructor(SettingsManager);

        if (!SettingsManager.hasExtension(SettingsManagerExtension)) {
            SettingsManager.registerExtension(SettingsManagerExtension);
        }
    });

    return SettingsManagerExtension;
}();