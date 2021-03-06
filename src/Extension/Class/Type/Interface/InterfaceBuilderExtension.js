/**
* @class
* @constructor
*/
Subclass.Property.Extension.Class.Type.Interface.InterfaceBuilderExtension = function()
{
    function InterfaceBuilderExtension(classInst)
    {
        InterfaceBuilderExtension.$parent.apply(this, arguments);
    }

    InterfaceBuilderExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeBefore(function(evt, module)
    {
        if (Subclass.ClassManager.issetType('Interface')) {
            var InterfaceBuilder = Subclass.ClassManager.getType('Interface').getBuilderClass();

            InterfaceBuilder.prototype.setProperties = undefined;

            InterfaceBuilder.prototype.addProperties = undefined;

            InterfaceBuilder.prototype.getProperties = undefined;

            InterfaceBuilder.prototype.removeProperty = undefined;
        }
    });

    return InterfaceBuilderExtension;
}();
