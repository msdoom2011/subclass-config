Subclass.Property.Property = function()
{
    function Property(name, definition)
    {
        if (!name || typeof name != 'string') {
            Subclass.Error.create('InvalidError')
                .argument('the name of property', false)
                .expected('a string')
                .received(name)
                .apply()
            ;
        }
        if (!definition || !(definition instanceof Subclass.Property.PropertyType)) {
            Subclass.Error.create('InvalidArgument')
                .argument('the property definition', false)
                .expected('an instance of "Subclass.Property.PropertyType" class')
                .received(definition)
                .apply()
            ;
        }

        /**
         * The name of property
         *
         * @type {string}
         * @private
         */
        this._name = name;

        /**
         * The data type definition
         *
         * @type {Subclass.Property.PropertyType}
         * @private
         */
        this._definition = definition;

        /**
         * The property context object
         *
         * @type {Object}
         * @private
         */
        this._context = null;

        /**
         * A set of callbacks which will invoked when property changes its value
         *
         * @type {Function[]}
         * @private
         */
        this._watchers = [];

        /**
         * Checks if current value was ever modified (was set any value)
         *
         * @type {boolean}
         * @private
         */
        this._isModified = false;

        /**
         * Reports that current property is temporary locked for the write operation
         *
         * @type {boolean}
         * @private
         */
        this._isLocked = false;

        /**
         * The value of the property
         *
         * @type {undefined}
         * @private
         */
        this._value = undefined;
    }

    /**
     * Sets the property name
     *
     * @param {string} name
     */
    Property.prototype.setName = function(name)
    {
        this._name = name;
    };

    /**
     * Returns name of property
     *
     * @returns {string}
     */
    Property.prototype.getName = function()
    {
        return this._name;
    };

    /**
     * Returns the name of properties type
     *
     * @returns {string}
     */
    Property.prototype.getType = function()
    {
        return this.getDefinition().constructor.getName();
    };

    /**
     * Returns property name with names of context property
     *
     * @returns {string}
     */
    Property.prototype.getNameFull = function()
    {
        var propertyName = this.getName();
        var context = this.getContext();
        var parentName = "";

        if (context.getContextType() == 'property') {
            parentName = context.getProperty().getNameFull();
        }
        return (parentName && parentName + "." || "") + propertyName;
    };

    /**
     * Renames current property
     *
     * @param {string} newName
     */
    Property.prototype.rename = function(newName)
    {
        var context = this.getContext();
        var isAttached = this.isAttached();

        if (!newName || typeof newName != 'string') {
            Subclass.Error.create(
                'Specified invalid new value argument while was called method rename in property ' + this + '. ' +
                'It must be a string.'
            );
        }
        if (isAttached && Object.isSealed(context)) {
            Subclass.Error.create(
                'Can\'t rename property ' + this + '. ' +
                'The context object is sealed.'
            );
        }
        var definition = this.getDefinition();
        var value = this.getData();

        if (definition.isAccessors()) {
            Subclass.Error.create('Can\'t rename property ' + this + ' because it uses accessor functions.');
        }

        if (isAttached) {
            definition.detach(context, this._name);
            definition.attach(context, newName);
        }

        this._name = newName;
        this.setValue(value);
    };

    /**
     * Returns property definition
     *
     * @returns {Subclass.Property.PropertyType}
     */
    Property.prototype.getDefinition = function()
    {
        return this._definition;
    };

    /**
     * Validates property context object
     *
     * @throws {Error}
     *      Throws error if specified invalid property context object
     *
     * @returns {Object} context object
     */
    Property.prototype.validateContext = function(context)
    {
        var requiredMethods = [
            'getProperty',
            'issetProperty',
            'getContextType'
        ];

        for (var i = 0; i < requiredMethods.length; i++) {
            if (
                !context
                || typeof context !== 'object'
                || typeof context[requiredMethods[i]] != 'function'
            ) {
                Subclass.Error.create(
                    'Trying to attach typed property ' + this + ' to invalid context object. ' +
                    'The valid context object should implement methods: "' + requiredMethods.join('", "') + "."
                );
            }
        }
        return context;
    };

    /**
     * Sets the property context object
     *
     * @param context
     */
    Property.prototype.setContext = function(context)
    {
        this.validateContext(context);
        this._context = context;
    };

    /**
     * Returns property context object
     *
     * @returns {(Object|null)}
     */
    Property.prototype.getContext = function()
    {
        return this._context;
    };

    /**
     * Marks that current property was modified
     */
    Property.prototype.modify = function()
    {
        var context = this.getContext();
        var contextType = context.getContextType();

        if (contextType == 'property') {
            var parentProperty = context.getProperty();
            parentProperty.modify();
        }
        this._isModified = true;
    };

    /**
     * Marks that current property was not modified
     */
    Property.prototype.unModify = function()
    {
        this._isModified = false;
    };

    /**
     * Checks if current property value was ever modified
     *
     * @returns {boolean}
     */
    Property.prototype.isModified = function()
    {
        return this._isModified;
    };

    /**
     * Makes current property locked
     */
    Property.prototype.lock = function()
    {
        this._isLocked = true;
    };

    /**
     * Makes current property unlocked
     */
    Property.prototype.unlock = function()
    {
        this._isLocked = false;
    };

    /**
     * Reports whether current property is locked
     *
     * @returns {boolean}
     */
    Property.prototype.isLocked = function()
    {
        if (this._isLocked) {
            return true;
        }
        var context = this.getContext();

        if (context && context.getContextType() == 'property') {
            var parentProperty = context.getProperty();
            return parentProperty.isLocked() || false;

        } else {
            return false;
        }
    };

    /**
     * Returns all registered watchers
     *
     * @returns {Function[]}
     */
    Property.prototype.getWatchers = function()
    {
        var watcher = this.getDefinition().getWatcher();
        var watchers = [];

        if (watcher) {
            watchers.push(watcher);
        }
        return Subclass.Tools.extend(watchers, this._watchers);
    };

    /**
     * Adds new watcher
     *
     * @param {Function} callback Function, that takes two arguments:
     *      - newValue {*} New property value
     *      - oldValue {*} Old property value
     *
     *      "this" variable inside callback function will link to the class instance to which property belongs to
     *      This callback function MUST return newValue value.
     *      So you can modify it if you need.
     */
    Property.prototype.addWatcher = function(callback)
    {
        if (typeof callback != "function") {
            Subclass.Error.create('InvalidArgument')
                .argument("the callback", false)
                .received(callback)
                .expected("a function")
                .apply()
            ;
        }
        if (!this.issetWatcher(callback)) {
            this._watchers.push(callback);
        }
    };

    /**
     * Checks if specified watcher callback is registered
     *
     * @param {Function} callback
     * @returns {boolean}
     */
    Property.prototype.issetWatcher = function(callback)
    {
        if (this.getDefinition().getWatcher() == callback) {
            return true;
        }
        return this._watchers.indexOf(callback) >= 0;
    };

    /**
     * Removes specified watcher callback
     *
     * @param {Function} callback
     */
    Property.prototype.removeWatcher = function(callback)
    {
        var watcherIndex;

        if ((watcherIndex = this._watchers.indexOf(callback)) >= 0) {
            this._watchers.splice(watcherIndex, 1);
        }
        if (this.getDefinition().getWatcher() == callback) {
            this.getDefinition().setWatcher(null);
        }
    };

    /**
     * Unbind all watchers from current property
     */
    Property.prototype.removeWatchers = function()
    {
        this.getDefinition().setWatcher(null);
        this._watchers = [];
    };

    /**
     * Invokes all registered watcher functions
     *
     * @param {Subclass.Property.WatcherEvent} event
     */
    Property.prototype.invokeWatchers = function(event)
    {
        var watchers = this.getWatchers();
        var context = this.getContext();

        if (typeof context != "object" || Array.isArray(context)) {
            Subclass.Error.create('InvalidArgument')
                .argument("the context object", false)
                .received(context)
                .expected("an object")
                .apply()
            ;
        }
        for (var i = 0; i < watchers.length; i++) {
            watchers[i].call(context, event);
        }
    };

    Property.prototype._createWatcherEvent = function(newValue, oldValue)
    {
        return Subclass.Tools.createClassInstance(
            Subclass.Property.WatcherEvent,
            this,
            newValue,
            oldValue
        );
    };

    /**
     * Returns new and old values of parent context properties
     *
     * @param {Subclass.Property.Property} property
     * @param {*} newValue
     * @returns {Array.<{"property": {Subclass.Property.Property}, "newValue": {*}, "oldValue": {*}}>}
     * @protected
     */

    Property.prototype._getParentWatcherValues = function(property, newValue)
    {
        var context = property.getContext();
        var parents = [];

        if (arguments[2]) {
            parents = arguments[2];
        }
        if (context && context.getContextType && context.getContextType() == 'property') {
            var parent = property.getContext().getProperty();
            var parentOldValue = parent.getData();
            var parentNewValue = Subclass.Tools.copy(parentOldValue);

            parentNewValue[property.getName()] = newValue;

            parents.push({
                property: parent,
                newValue: parentNewValue,
                oldValue: parentOldValue
            });

            this._getParentWatcherValues(
                parent,
                parentNewValue,
                parents
            );
        }

        return parents;
    };

    /**
     * Invokes all parent property watchers specified in "parents" argument
     *
     * @param {Subclass.Property.WatcherEvent} event
     * @param {Array.<{"property": {Subclass.Property.Property}, "newValue": {*}, "oldValue": {*}}>} parents
     * @private
     */
    Property.prototype._invokeParentWatchers = function(event, parents)
    {
        for (var i = 0; i < parents.length; i++) {
            if (event.isPropagationStopped()) {
                break;
            }
            var parentValues = parents[i];
            event.setProperty(parentValues.property);
            event.setNewValue(parentValues.newValue);
            event.setOldValue(parentValues.oldValue);
            parentValues.property.invokeWatchers(event);
        }
    };

    Property.prototype.isAttached = function()
    {
        var context = this.getContext();

        if (this.getDefinition().isAccessors()) {
            var getterName = Subclass.Tools.generateGetterName(this.getName());

            if (context[getterName] !== undefined) {
                return true;
            }
        } else {
            if (context[this.getName()] !== undefined) {
                return true;
            }
        }
        return false;
    };

    /**
     * Checks if property contains empty value
     *
     * @param {*} [value]
     * @returns {boolean}
     */
    Property.prototype.isEmpty = function(value)
    {
        if (!arguments.length) {
            value = this.getValue();
        }
        return this.getDefinition().isValueEmpty(value);
    };

    /**
     * Checks whether is valid specified value
     *
     * @param {*} value
     * @returns {boolean}
     */
    Property.prototype.isValid = function(value)
    {
        try {
            this.getDefinition().validateValue(value);
            return true;

        } catch (e) {
            return false;
        }
    };

    /**
     * Sets property value
     *
     * @param {*} value
     * @param {boolean} [markAsModified=true]
     * @param {boolean} [invokeParentWatchers=true]
     * @returns {*}
     */
    Property.prototype.setValue = function(value, markAsModified, invokeParentWatchers)
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

        var valueChanged = false;
        var parents = [];

        if (markAsModified) {
            var oldValue = this.getData();
            var newValue = value;
            var event = this._createWatcherEvent(newValue, oldValue);

            valueChanged = typeof newValue == 'function' || !Subclass.Tools.isEqual(oldValue, newValue);

            if (invokeParentWatchers) {
                parents = this._getParentWatcherValues(this, newValue);
            }
            if (valueChanged) {
                this.modify();
            }
        }

        this.getDefinition().validateValue(value);
        this._value = value;

        if (valueChanged) {
            this.invokeWatchers(event);

            if (invokeParentWatchers) {
                this._invokeParentWatchers(event, parents);
            }
        }
    };

    /**
     * Returns value of current property
     */
    Property.prototype.getValue = function()
    {
        return this._value;
    };

    /**
     * Resets the value of current property to default
     *
     * @param {boolean} [markAsModified=true]
     */
    Property.prototype.resetValue = function(markAsModified)
    {
        var defaultValue = this.getDefaultValue();

        this.setValue(defaultValue, markAsModified);
    };

    /**
     * Returns only data of current property
     *
     * @returns {*}
     */
    Property.prototype.getData = function()
    {
        return this.getValue();
    };

    /**
     * Sets property default value
     *
     * @param {*} value
     */
    Property.prototype.setDefaultValue = function(value)
    {
        var propertyDefinition = this.getDefinition();
        propertyDefinition.setDefault(value);

        if (this.isDefaultValue()) {
            this.setValue(value);
            this.unModify();
        }
    };

    /**
     * Returns property default value
     *
     * @returns {*}
     */
    Property.prototype.getDefaultValue = function()
    {
        return this.getDefinition().getDefault();
    };

    /**
     * Checks whether current property equals default and was not modified
     *
     * @returns {boolean}
     */
    Property.prototype.isDefaultValue = function()
    {
        var defaultValue = this.getDefaultValue();
        var value = this.getValue();

        return (
            Subclass.Tools.isEqual(defaultValue, value)
            && !this.isModified()
        ) || (
            defaultValue === null
            && this.isEmpty()
            && !this.isModified()
        );
    };

    /**
     * Return string implementation of property
     *
     * @returns {string}
     */
    Property.prototype.toString = function()
    {
        var propertyName = this.getNameFull();
        var context = this.getContext();
        var contextClassName = "";

        if (context.getContextType() == 'class') {
            contextClassName = ' in the class "' + context.getClassName() + '"';
        }
        return '"' + propertyName + '"' + contextClassName;
    };

    return Property;
}();