/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.Type.AbstractClass.AbstractClassDefinitionExtension = function()
{
    function AbstractClassDefinitionExtension(classInst)
    {
        AbstractClassDefinitionExtension.$parent.apply(this, arguments);
    }

    AbstractClassDefinitionExtension.$parent = Subclass.Extension;

    /**
     * @inheritDoc
     */
    AbstractClassDefinitionExtension.initialize = function(classInst)
    {
        AbstractClassDefinitionExtension.$parent.initialize.apply(this, arguments);

        classInst.getEvent('onGetBaseData').addListener(function(evt, data)
        {
            delete data.issetProperty;
            delete data.getProperty;
        });
    };

    // Registering extension

    Subclass.Module.onInitializeAfter(function(evt, module)
    {
        if (Subclass.ClassManager.issetClassType('AbstractClass')) {
            var AbstractClassDefinition = Subclass.ClassManager.getClassType('AbstractClass').getDefinitionClass();
                AbstractClassDefinition = Subclass.Tools.buildClassConstructor(AbstractClassDefinition);

            if (!AbstractClassDefinition.hasExtension(AbstractClassDefinitionExtension)) {
                AbstractClassDefinition.registerExtension(AbstractClassDefinitionExtension);
            }
        }
    });

    return AbstractClassDefinitionExtension;
}();
