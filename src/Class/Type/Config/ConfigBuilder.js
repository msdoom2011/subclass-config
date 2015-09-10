/**
 * @class
 * @extends {Subclass.Class.ClassBuilder}
 */
Subclass.Class.Type.Config.ConfigBuilder = (function()
{
    function ConfigBuilder(classManager, classType, className)
    {
        ConfigBuilder.$parent.apply(this, arguments);
    }

    ConfigBuilder.$parent = Subclass.Class.ClassBuilder;

    /**
     * Validates includes list argument
     *
     * @param {*} includesList
     * @private
     */
    ConfigBuilder.prototype._validateIncludes = function(includesList)
    {
        try {
            if (!Array.isArray(includesList)) {
                throw "error";
            }
            for (var i = 0; i < includesList.length; i++) {
                this._validateInclude(includesList[i]);
            }
        } catch (e) {
            Subclass.Error.create('InvalidArgument')
                .argument("the list of config including class names", false)
                .received(includesList)
                .expected("an array of strings")
                .apply()
            ;
        }
    };

    /**
     * Validates config include
     *
     * @param {*} include
     * @private
     */
    ConfigBuilder.prototype._validateInclude = function(include)
    {
        if (
            typeof include != "string"
            && typeof include != "object"
            && include.getClassTypeName
            && include.getClassTypeName() !== "Config"
        ) {
            Subclass.Error.create('InvalidArgument')
                .argument('the name of including config class', false)
                .expected('an instance of config class or a string')
                .received(include)
                .apply()
            ;
        }
    };

    /**
     * Brings includes list to common state
     *
     * @param {Array} includesList
     * @private
     */
    ConfigBuilder.prototype._normalizeIncludes = function(includesList)
    {
        for (var i = 0; i < includesList.length; i++) {
            includesList[i] = this._normalizeInclude(includesList[i]);
        }
    };

    /**
     * Normalizes config include
     *
     * @param {(string|Config)} include
     * @returns {string}
     * @private
     */
    ConfigBuilder.prototype._normalizeInclude = function(include)
    {
        this._validateInclude(include);

        if (typeof include != 'string') {
            return include.getName();
        }
    };

    /**
     * Sets includes list
     *
     * @param {string[]} includesList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.setIncludes = function(includesList)
    {
        this._validateIncludes(includesList);
        this._normalizeIncludes(includesList);
        this.getDefinition().$_includes = includesList;

        return this;
    };

    /**
     * Adds new includes
     *
     * @param {string[]} includesList
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addIncludes = function(includesList)
    {
        this._validateIncludes(includesList);

        if (!this.getDefinition().$_includes) {
            this.getDefinition().$_includes = [];
        }
        this.getDefinition().$_includes = this.getDefinition().$_includes.concat(includesList);

        return this;
    };

    /**
     * Adds new include
     *
     * @param {string[]} include
     * @returns {Subclass.Class.Type.Config.ConfigBuilder}
     */
    ConfigBuilder.prototype.addInclude = function(include)
    {
        this._validateInclude(include);

        if (!this.getDefinition().$_includes) {
            this.getDefinition().$_includes = [];
        }
        this.getDefinition().$_includes.push(include);

        return this;
    };

    /**
     * Returns includes list
     *
     * @returns {string[]}
     */
    ConfigBuilder.prototype.getIncludes = function()
    {
        return this.getDefinition().$_includes || [];
    };

    /**
     * Makes class either final or not
     *
     * @method setFinal
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of final option
     *
     * @param {boolean} isFinal
     */
    ConfigBuilder.prototype.setFinal = function(isFinal)
    {
        if (typeof isFinal != 'boolean') {
            Subclass.Error.create('InvalidArgument')
                .argument('is final option value', false)
                .expected('a boolean')
                .received(isFinal)
                .apply()
            ;
        }
        this.getDefinition().$_final = isFinal;

        return this;
    };

    /**
     * Returns $_final option value
     *
     * @method getFinal
     * @memberOf Subclass.Class.Type.Class.ClassBuilder.prototype
     *
     * @returns {boolean}
     */
    ConfigBuilder.prototype.getFinal = function()
    {
        return this.getDefinition().$_final;
    };

    return ConfigBuilder;

})();