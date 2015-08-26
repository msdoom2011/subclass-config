/**
 * @class
 * @constructor
 *
 * Module settings:
 *
 * configurators   {Object}    opt    Array of strings which are names
 *                                    of configurator classes
 *
 *                                    Example:
 *                                    ...
 *
 *                                    var moduleSettings = [
 *                                      "App/FooConfigurator",
 *                                      "App/BarConfigurator"
 *                                    ];
 *
 *
 * configs         {Object}    opt    Object, where you can specify
 *                                    configuration of your application.
 *
 *                                    Example:
 *                                    ...
 *
 *                                    var moduleSettings = {
 *                                      configs: {
 *                                        foo: true,
 *                                        bar: 200,
 *                                        map: {
 *                                            mapFoo: false,
 *                                            mapBar: 300
 *                                        }
 *                                      }
 *                                      ...
 *                                    };
 *
 * dataTypes       {Object}    opt    Object, which keys are the type
 *                                    names and values are
 *                                    its definitions.
 *
 *                                    It allows to create the new data
 *                                    types based on the default
 *                                    (registered) data types using
 *                                    configuration whatever you need.
 *
 *                                    Also you may to change
 *                                    configuration of the default
 *                                    data types.
 *
 *                                    Example:
 *
 *                                    var moduleSettings = {
 *                                      ...
 *                                      dataTypes: {
 *
 *                                        // creating the new type
 *                                        percents: {
 *                                          type: "string",
 *                                          pattern: /^[0-9]+%$/
 *                                        },
 *
 *                                        // altering existent type
 *                                        number: {
 *                                          type: "number",
 *                                          nullable: false,
 *                                          default: 100
 *                                        }
 *                                      },
 *                                      ...
 *                                    };
 */
Subclass.Property.Extension.ModuleExtension = function() {

    function ModuleExtension(classInst)
    {
        ModuleExtension.$parent.apply(this, arguments);
    }

    ModuleExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     */
    ModuleExtension.initialize = function(module)
    {
        this.$parent.initialize.apply(this, arguments);

        var eventManager = module.getEventManager();

        eventManager.getEvent('onInitialize').addListener(function(evt, module)
        {
            /**
             * Config manager instance
             *
             * @type {Subclass.ConfigManager}
             * @private
             */
            this._configManager = Subclass.Tools.createClassInstance(
                Subclass.ConfigManager,
                this
            );

            /**
             * Property manager instance
             *
             * @type {Subclass.Property.PropertyManager}
             * @private
             */
            this._propertyManager = Subclass.Tools.createClassInstance(
                Subclass.Property.PropertyManager,
                this
            );
        });

        eventManager.getEvent('onInitializeAfter').addListener(function(evt, module)
        {
            this.getConfigManager().initialize();
            this.getPropertyManager().initialize();
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var Module = Subclass.Module;

    /**
     * Returns instance of config manager which contains configuration
     * of your application
     *
     * @method getConfigManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.ConfigManager}
     */
    Module.prototype.getConfigManager = function()
    {
        return this._configManager;
    };

    /**
     * Returns instance of property manager which allows to register
     * custom data types and creates typed property instance by its definition.
     *
     * @method getPropertyManager
     * @memberOf Subclass.Module.prototype
     *
     * @returns {Subclass.Property.PropertyManager}
     */
    Module.prototype.getPropertyManager = function()
    {
        return this._propertyManager;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (!Module.hasExtension(ModuleExtension)) {
            Module.registerExtension(ModuleExtension);
        }
    });

    return ModuleExtension;
}();