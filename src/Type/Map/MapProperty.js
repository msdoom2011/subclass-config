/**
 * @class
 * @extends {Subclass.Property.PropertyType}
 */
Subclass.Property.Type.Map.MapProperty = function()
{
    /*************************************************/
    /*        Describing property type "Map"         */
    /*************************************************/

    /**
     * @inheritDoc
     */
    function MapProperty()
    {
        MapProperty.$parent.apply(this, arguments);

        /**
         * @type {Object.<Subclass.Property.Property>}
         * @private
         */
        this._children = {};

        var childrenDefinitions = this.getDefinition().getChildren();

        for (var childName in childrenDefinitions) {
            if (childrenDefinitions.hasOwnProperty(childName)) {
                this._children[childName] = childrenDefinitions[childName].createInstance(childName);
            }
        }
    }

    MapProperty.$parent = Subclass.Property.Property;

    /**
     * Sets the children properties
     *
     * @param {Object.<Subclass.Property.Property>} children
     */
    MapProperty.prototype.setChildren = function(children)
    {
        if (Object.isSealed(this)) {
            Subclass.Error.create(
                'The property ' + this.getProperty() + ' is ' +
                'sealed so you can\'t change its children.'
            )
        }
        try {
            if (!children || typeof children != 'object') {
                throw new Error();
            }
            for (var propName in children) {
                if (
                    children.hasOwnProperty(propName)
                    && !(children[propName] instanceof Subclass.Property.Property)
                ) {
                    throw new Error();
                }
            }
        } catch (e) {
            Subclass.Error.create('InvalidArgument')
                .argument('the map children collection', false)
                .expected('an object with instances of class "Subclass.Property.Property"')
                .received(children)
                .apply()
            ;
        }
        this._children = children;
    };

    /**
     * Returns all map child properties
     *
     * @returns {Object.<Subclass.Property.Property>}
     */
    MapProperty.prototype.getChildren = function()
    {
        return this._children;
    };

    /**
     * Returns map child property by its name
     *
     * @param {string} childName
     * @returns {Subclass.Property.Property}
     */
    MapProperty.prototype.getChild = function(childName)
    {
        return this._children[childName];
    };

    /**
     * Returns properties default value
     *
     * @returns {*}
     */
    MapProperty.prototype.getDefaultValue = function()
    {
        var children = this.getChildren();
        var defaultValue = {};

        for (var propName in children) {
            if (children.hasOwnProperty(propName)) {
                defaultValue[propName] = children[propName].getDefaultValue();
            }
        }
        return defaultValue;
    };

    /**
     * @inheritDoc
     */
    MapProperty.prototype.setValue = function(value, markAsModified, invokeParentWatchers)
    {
        if (markAsModified !== false) {
            markAsModified = true;
        }
        if (invokeParentWatchers !== false) {
            invokeParentWatchers = true;
        }
        if (this.isLocked()) {
            return console.warn(
                'Trying to set new value for the ' +
                'property ' + this + ' that is locked for write.'
            );
        }
        var childrenContext = this.getValue();
        var parents = [];

        if (markAsModified) {
            var oldValue = this.getData();
            var newValue = value;
            var event = this._createWatcherEvent(newValue, oldValue);

            if (invokeParentWatchers) {
                parents = this._getParentWatcherValues(this, newValue);
            }
            if (!Subclass.Tools.isEqual(oldValue, newValue)) {
                this.modify();
            }
        }
        this.getDefinition().validateValue(value);

        if (value !== null) {
            if (!childrenContext) {
                this._value = childrenContext = this.createMap();
            }
            for (var childName in value) {
                if (value.hasOwnProperty(childName)) {
                    childrenContext.getProperty(childName).setValue(
                        value[childName],
                        markAsModified,
                        false
                    );
                }
            }
        } else {
            this._value = null;
        }

        // Invoking watchers

        if (markAsModified) {
            this.invokeWatchers(event);

            if (invokeParentWatchers) {
                this._invokeParentWatchers(event, parents);
            }
        }
    };

    /**
     * @inheritDoc
     */
    MapProperty.prototype.resetValue = function(markAsModified)
    {
        if (markAsModified !== false) {
            markAsModified = true;
        }
        if (markAsModified) {
            this.modify();
        }
        var value = this.getDefaultValue();

        if (value !== null) {
            value = this.createMap();
        }

        this._value = value;
    };

    /**
     * Creates the map instance
     */
    MapProperty.prototype.createMap = function()
    {
        var $this = this;

        function Map()
        {
            // Hack for the grunt-contrib-uglify plugin
            return Map.name;
        }

        Map.$parent = Subclass.Property.Type.Map.Map;

        /**
         * @inheritDoc
         */
        Map.prototype.getProperty = function(childName)
        {
            if (!arguments.length) {
                return $this;
            }
            return this.getChildren()[childName];
        };

        // Creating instance of map

        var mapInst = Subclass.Tools.createClassInstance(Map);

        // Attaching map children

        var children = this.getChildren();

        for (var childName in children) {
            if (children.hasOwnProperty(childName)) {
                children[childName].getDefinition().attach(Map.prototype, childName);
                children[childName].setContext(mapInst);
                children[childName].resetValue(false);
            }
        }

        Object.seal(mapInst);

        return mapInst;
    };

    /**
     * Returns data only of property value
     *
     * @returns {Object}
     */
    MapProperty.prototype.getData = function()
    {
        var value = this.getValue();

        if (value === null) {
            return null;
        }
        var children = this.getChildren();
        var data = {};

        for (var childName in children) {
            if (children.hasOwnProperty(childName)) {
                data[childName] = children[childName].getData();
            }
        }
        return data;
    };

    return MapProperty;

}();