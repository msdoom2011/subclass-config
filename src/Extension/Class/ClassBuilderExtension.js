/**
 * @class
 * @constructor
 */
Subclass.Property.Extension.Class.ClassBuilderExtension = function() {

    function ClassBuilderExtension(classInst)
    {
        ClassBuilderExtension.$parent.apply(this, arguments);
    }

    ClassBuilderExtension.$parent = Subclass.Extension;


    //=========================================================================
    //========================== ADDING NEW METHODS ===========================
    //=========================================================================

    var ClassBuilder = Subclass.Class.ClassBuilder;

    /**
     * Validates the definition of typed class properties
     *
     * @method _validateProperties
     * @private
     *
     * @throws {Error}
     *      Throws error if specified invalid definition of class properties
     *
     * @param {*} classProperties
     *      The plain object with definitions of typed class properties
     */
    ClassBuilder.prototype._validateProperties = function(classProperties)
    {
        if (!classProperties || !Subclass.Tools.isPlainObject(classProperties)) {
            Subclass.Error.create('InvalidArgument')
                .option("classProperties")
                .received(classProperties)
                .expected("a plain object")
                .apply()
            ;
        }
    };

    /**
     * Sets the typed properties of class.<br /><br />
     *
     * This method redefines all typed class properties.<br />
     * If the class already has definitions of typed properties they will be erased.<br />
     *
     * @method setProperties
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @param {Object.<Object>} classProperties
     *      The plain object with definitions of typed class properties
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     * app.registerClass("Foo/Bar/TestClass", {
     *      ...
     *      $_properties: {
     *          prop1: { type: "string" },
     *          prop2: { type: "boolean" }
     *      },
     *      ...
     * });
     * ...
     *
     * app.alterClass("Foo/Bar/TestClass")
     *     .setProperties({
     *          foo: { type: "number" },
     *          bar: { type: "string" }
     *     })
     *     .save()
     * ;
     *
     * var TestClass = app.getClass('Foo/Bar/TestClass');
     *
     * console.log(TestClass.getDefinition().getProperties());
     *
     * // {
     * //     foo: { type: "number" },
     * //     bar: { type: "string" }
     * // }
     */
    ClassBuilder.prototype.setProperties = function(classProperties)
    {
        this._validateProperties(classProperties);
        this.getDefinition().$_properties = classProperties;

        return this;
    };

    /**
     * Adds new definitions of typed properties to the class.<br /><br />
     *
     * Current method allows to add new typed property definitions.<br />
     * If typed properties with the same name already exists in class
     * they will be redefined by the new added.
     * The left properties will be not touched.
     *
     * @method addProperties
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @param {Object.<Object>} classProperties
     *      The plain object with definitions of typed class properties
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     * app.registerClass("Foo/Bar/TestClass", {
     *      ...
     *      $_properties: {
     *          prop1: { type: "string" },
     *          prop2: { type: "boolean" },
     *          prop3: { type: "array" }
     *      },
     *      ...
     * });
     * ...
     *
     * app.alterClass("Foo/Bar/TestClass")
     *     .addProperties({
     *          foo: { type: "number" },
     *          bar: { type: "string" },
     *          prop3: { type: "object" }
     *     })
     *     .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass('Foo/Bar/TestClass');
     *
     * console.log(TestClass.getDefinition().getProperties());
     *
     * // {
     * //     prop1: { type: "string" },
     * //     prop2: { type: "boolean" },
     * //     prop3: { type: "object" },
     * //     foo: { type: "number" },
     * //     bar: { type: "string" }
     * // }
     */
    ClassBuilder.prototype.addProperties = function(classProperties)
    {
        this._validateProperties(classProperties);

        if (!this.getDefinition().$_properties) {
            this.getDefinition().$_properties = {};
        }
        Subclass.Tools.extend(
            this.getDefinition().$_properties,
            classProperties
        );

        return this;
    };

    /**
     * Returns the typed properties of class
     *
     * @method getProperties
     * @memberOf Subclass.Class.ClassBuilder.prototype
     *
     * @returns {Object.<Object>}
     */
    ClassBuilder.prototype.getProperties = function()
    {
        return this.getDefinition().$_properties || {};
    };

    /**
     * Removes the typed class property with specified name
     *
     * @throws {Error}
     *      Throws error if specified invalid name of typed property
     *
     * @param {string} propertyName
     *      The name of typed property
     *
     * @returns {Subclass.Class.ClassBuilder}
     *
     * @example
     * ...
     *
     * app.registerClass("Foo/Bar/TestClass", {
     *      ...
     *      $_properties: {
     *          foo: { type: "string" },
     *          bar: { type: "number" }
     *      },
     *      ...
     * });
     * ...
     *
     * app.alterClass("Foo/Bar/TestClass")
     *      .removeProperty("foo")
     *      .save()
     * ;
     * ...
     *
     * var TestClass = app.getClass("Foo/Bar/TestClass");
     *
     * console.log(TestClass.getDefinition().getProperties());
     *
     * // { bar: { type: "number" } }
     */
    ClassBuilder.prototype.removeProperty = function(propertyName)
    {
        if (typeof propertyName !== 'string') {
            Subclass.Error.create('InvalidArgument')
                .argument("the name of property", false)
                .received(propertyName)
                .expected("a string")
                .apply()
            ;
        }
        delete this.getDefinition().$_properties[propertyName];

        return this;
    };


    //=========================================================================
    //======================== REGISTERING EXTENSION ==========================
    //=========================================================================

    Subclass.Module.onCreate(function(evt, module)
    {
        ClassBuilder = Subclass.Tools.buildClassConstructor(ClassBuilder);

        if (!ClassBuilder.hasExtension(ClassBuilderExtension)) {
            ClassBuilder.registerExtension(ClassBuilderExtension);
        }
    });

    return ClassBuilderExtension;
}();