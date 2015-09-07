/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.ServiceContainerExtension = function() {

    function ServiceContainerExtension(classInst)
    {
        ServiceContainerExtension.$parent.apply(this, arguments);
    }

    ServiceContainerExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     *
     * @param {Subclass.ModuleInstance} moduleInstance
     */
    ServiceContainerExtension.initialize = function(moduleInstance)
    {
        ServiceContainerExtension.$parent.initialize.apply(this, arguments);

        moduleInstance.getEvent('onInitialize').addListener(function() {

            this._services['config_container'] = moduleInstance.getConfigContainer();
            this._services['config_manager'] = moduleInstance.getConfigContainer().getConfigManager();
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ModuleInstance = Subclass.ModuleInstance;

    /**
     * Returns instance of service container
     *
     * @returns {Subclass.Service.ServiceContainer}
     */
    ModuleInstance.prototype.setConfigs = function(values)
    {
        return this._configs.setData(values);
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ModuleInstance = Subclass.Tools.buildClassConstructor(ModuleInstance);

        if (!ModuleInstance.hasExtension(ServiceContainerExtension)) {
            ModuleInstance.registerExtension(ServiceContainerExtension);
        }
    });

    return ServiceContainerExtension;
}();