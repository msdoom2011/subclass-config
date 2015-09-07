/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.ModuleInstanceExtension = function() {

    function ModuleInstanceExtension(classInst)
    {
        ModuleInstanceExtension.$parent.apply(this, arguments);
    }

    ModuleInstanceExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     *
     * @param {Subclass.ModuleInstance} moduleInstance
     */
    ModuleInstanceExtension.initialize = function(moduleInstance)
    {
        ModuleInstanceExtension.$parent.initialize.apply(this, arguments);

        moduleInstance.getEvent('onInitialize').addListener(function() {

            /**
             * App configuration
             *
             * @type {Object}
             * @private
             */
            this._configContainer = Subclass.Tools.createClassInstance(Subclass.Property.ConfigContainer, this);
        });
    };


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ModuleInstance = Subclass.ModuleInstance;

    /**
     * Returns instance of configs class
     *
     * @returns {Object}
     */
    ModuleInstance.prototype.getConfigContainer = function()
    {
        return this._configContainer;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        ModuleInstance = Subclass.Tools.buildClassConstructor(ModuleInstance);

        if (!ModuleInstance.hasExtension(ModuleInstanceExtension)) {
            ModuleInstance.registerExtension(ModuleInstanceExtension);
        }
    });

    return ModuleInstanceExtension;
}();