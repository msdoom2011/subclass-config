/**
 * Registers the new SubclassJS plugin
 */
Subclass.registerPlugin(function() {

    function PropertyPlugin()
    {
        PropertyPlugin.$parent.apply(this, arguments);
    }

    PropertyPlugin.$parent = Subclass.SubclassPlugin;

    /**
     * @inheritDoc
     */
    PropertyPlugin.getName = function()
    {
        return "SubclassConfig";
    };

    /**
     * @inheritDoc
     */
    PropertyPlugin.getDependencies = function()
    {
        return [
            'SubclassInstance',
            'SubclassParser',
            'SubclassParameter',
            'SubclassService'
        ];
    };

    return PropertyPlugin;
}());