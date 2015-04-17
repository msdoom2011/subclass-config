/**
* @class
* @constructor
*/
Subclass.Property.Extension.Class.Type.Interface.InterfaceExtension = function()
{
    function InterfaceExtension(classInst)
    {
        InterfaceExtension.$parent.apply(this, arguments);
    }

    InterfaceExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeAfter(function(evt, module)
    {
        if (Subclass.ClassManager.issetClassType('Interface')) {
            var Interface = Subclass.ClassManager.getClassType('Interface');

            Interface.prototype.setProperties = undefined;

            Interface.prototype.addProperties = undefined;

            Interface.prototype.getProperties = undefined;

            Interface.prototype.removeProperty = undefined;

            Interface.prototype.attachProperties = function() {};
        }
    });

    return InterfaceBuilderExtension;
}();
