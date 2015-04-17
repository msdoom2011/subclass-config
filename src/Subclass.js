/**
 * Registers the new SubclassJS plug-in
 */
Subclass.registerPlugin(function() {

    function PropertyPlugin()
    {
        PropertyPlugin.$parent.call(this);
    }

    PropertyPlugin.$parent = Subclass.SubclassPlugin;

    /**
     * @inheritDoc
     */
    PropertyPlugin.getName = function()
    {
        return "SubclassProperty";
    };

    return PropertyPlugin;
}());