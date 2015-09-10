/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.ModuleAPIExtension = function() {

    function ModuleAPIExtension(classInst)
    {
        ModuleAPIExtension.$parent.apply(this, arguments);
    }

    ModuleAPIExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ModuleAPI = Subclass.ModuleAPI;

    /**
     * The same as the {@link Subclass.Module#getPropertyManager}
     *
     * @method getPropertyManager
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getPropertyManager = function()
    {
        return this.getModule().getPropertyManager.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.ConfigManager#setDataTypes}
     *
     * @method registerDataTypes
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.registerDataTypes = function()
    {
        return this.getModule().getConfigManager().setDataTypes.apply(
            this.getModule().getConfigManager(),
            arguments
        );
    };

    /**
     * The same as the {@link Subclass.Module#onConfig}
     *
     * @method onConfig
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.onConfig = function()
    {
        return this.getModule().onConfig.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#setConfigsClass}
     *
     * @method setConfigsClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.setConfigsClass = function()
    {
        return this.getModule().setConfigsClass.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#getConfigsClass}
     *
     * @method getConfigsClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.getConfigsClass = function()
    {
        return this.getModule().getConfigsClass.apply(this.getModule(), arguments);
    };

    /**
     * The same as the {@link Subclass.Module#issetConfigsClass}
     *
     * @method issetConfigsClass
     * @memberOf Subclass.ModuleAPI.prototype
     */
    ModuleAPI.prototype.issetConfigsClass = function()
    {
        return this.getModule().issetConfigsClass.apply(this.getModule(), arguments);
    };



    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ModuleAPI = Subclass.Tools.buildClassConstructor(ModuleAPI);

        if (!ModuleAPI.hasExtension(ModuleAPIExtension)) {
            ModuleAPI.registerExtension(ModuleAPIExtension);
        }
    });

    return ModuleAPIExtension;
}();