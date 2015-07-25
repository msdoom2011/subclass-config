/**
* @class
* @constructor
*/
Subclass.Property.Extension.Class.Type.Trait.TraitExtension = function()
{
    function TraitExtension(classInst)
    {
        TraitExtension.$parent.apply(this, arguments);
    }

    TraitExtension.$parent = Subclass.Extension;

    Subclass.Module.onInitializeAfter(function(evt, module)
    {
        if (Subclass.ClassManager.issetClassType('Trait')) {
            var Trait = Subclass.ClassManager.getClassType('Trait');

            Trait.prototype.attachProperties = function() {};

            /**
             * @inheritDoc
             */
            Trait.prototype.getProperties = function()
            {
                var properties = {};

                if (this.hasParent()) {
                    var parentClass = this.getParent();
                    var parentProperties = parentClass.getProperties();
                    properties = Subclass.Tools.extend(properties, parentProperties);
                }
                return Subclass.Tools.extend(
                    properties,
                    this._properties
                );
            };
        }
    });

    return TraitExtension;
}();
