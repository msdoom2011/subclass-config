/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.Type.Class.ClassExtension = function()
{
    function ClassExtension(classInst)
    {
        ClassExtension.$parent.apply(this, arguments);
    }

    ClassExtension.$parent = Subclass.Extension;

    ClassExtension.initialize = function(classInst)
    {
        ClassExtension.$parent.initialize.apply(this, arguments);

        if (!classInst.issetEvent('onAddTrait')) {
            classInst.registerEvent('onAddTrait');
        }

        classInst.getEvent('onAddTrait').addListener(function(evt, traitClass)
        {
            var traitClassProperties = traitClass.getProperties();

            for (var propName in traitClassProperties) {
                if (!traitClassProperties.hasOwnProperty(propName)) {
                    continue;
                }
                var property = traitClassProperties[propName];
                this.addProperty(propName, property.getData());
            }
        });
    };

    Subclass.Module.onInitializeAfter(function(evt, module)
    {
        if (Subclass.ClassManager.issetClassType('Trait')) {
            var Class = Subclass.ClassManager.getClassType('Class');
                Class = Subclass.Tools.buildClassConstructor(Class);

            if (!Class.hasExtension(ClassExtension)) {
                Class.registerExtension(ClassExtension);
            }
        }
    });

    return ClassExtension;
}();
