app.registerClass('Class/StandardDefinition',
{
    $_extends: "Class/BaseDefinition",

    changedPropNumber: false,
    propNumberOld: false,
    propNumberNew: false,

    changedPropString: false,
    propStringOld: false,
    propStringNew: false,

    changedPropBoolean: false,
    propBooleanOld: false,
    propBooleanNew: false,

    changedPropArray: false,
    propArrayOld: false,
    propArrayNew: false,

    changedPropObject: false,
    propObjectOld: false,
    propObjectNew: false,

    changedPropClass: false,
    propClassOld: false,
    propClassNew: false,

    changedPropEnum: false,
    propEnumOld: false,
    propEnumNew: false,

    changedPropFunction: false,
    propFunctionOld: false,
    propFunctionNew: false,

    changedPropUntyped: false,
    propUntypedOld: false,
    propUntypedNew: false,

    changedPropMixed: false,
    propMixedOld: false,
    propMixedNew: false,

    changedPropMap: false,
    propMapOld: false,
    propMapNew: false,

    changedPropStringCollectionArray: false,
    propStringCollectionArrayOld: false,
    propStringCollectionArrayNew: false,

    $_properties: {

        propNumber: {
            type: 'number',
            default: 10,
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropNumber = true;
                this.propNumberOld = oldValue;
                this.propNumberNew = newValue;
            }
        },

        propString: {
            type: 'string',
            default: "default string",
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropString = true;
                this.propStringOld = oldValue;
                this.propStringNew = newValue;
            }
        },

        propBoolean: {
            type: 'boolean',
            default: true,
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropBoolean = true;
                this.propBooleanOld = oldValue;
                this.propBooleanNew = newValue;
            }
        },

        propArray: {
            type: 'array',
            default: [ 10, 20, 30 ],
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropArray = true;
                this.propArrayOld = oldValue;
                this.propArrayNew = newValue;
            }
        },

        propObject: {
            type: 'object',
            default: { foo: 10, bar: 20 },
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropArray = true;
                this.propArrayOld = oldValue;
                this.propArrayNew = newValue;
            }
        },

        propClass: {
            type: "class",
            className: "Class/AppClass",
            default: null,
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropClass = true;
                this.propClassOld = oldValue;
                this.propClassNew = newValue;
            }
        },

        propEnum: {
            type: "enum",
            allows: [ "male", "female", null ],
            default: "female",
            writable: true,
            accessors: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropEnum = true;
                this.propEnumOld = oldValue;
                this.propEnumNew = newValue;
            }
        },

        propFunction: {
            type: "function",
            "default": function () { return true },
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropFunction = true;
                this.propFunctionOld = oldValue;
                this.propFunctionNew = newValue;
            }
        },

        propUntyped: {
            type: "untyped",
            default: 10,
            writable: true,
            accessors: true,
            nullable: false,
            value: "string value",
            watcher: function(newValue, oldValue, property) {
                this.changedPropUntyped = true;
                this.propUntypedOld = oldValue;
                this.propUntypedNew = newValue;
            }
        },

        propMixed: {
            type: "mixed",
            allows: [
                { type: "number" },
                { type: "string" }
            ],
            default: "string value",
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropMixed = true;
                this.propMixedOld = oldValue;
                this.propMixedNew = newValue;
            }
        },

        propMap: {
            type: "map",
            watcher: function(newValue, oldValue, property) {
                this.changedPropMap = true;
                this.propMapOld = oldValue;
                this.propMapNew = newValue;
            },
            schema: {

                mapNumber: { type: "number" },

                mapString: { type: "string" },

                mapBoolean: { type: "boolean" },

                mapArray: { type: "array" },

                mapObject: { type: "object" },

                mapClass: { type: "class", className: "Class/AppClass" },

                mapEnum: { type: "enum", allows: [ "male", "female" ] },

                mapFunction: { type: "function" },

                mapMixed: {type: "mixed", allows: [
                    { type: "number" },
                    { type: "string" }
                ]},

                mapMap: { type: "map", schema: {

                    mapMapNumber: { type: "number" },

                    mapMapString: { type: "string" },

                    mapMapBoolean: { type: "boolean" },

                    mapMapArray: { type: "array" },

                    mapMapObject: { type: "object" },

                    mapMapClass: { type: "class", className: "Class/AppClass" },

                    mapMapEnum: { type: "enum", allows: [ "male", "female" ] },

                    mapMapFunction: { type: "function" },

                    mapMapMixed: {type: "mixed", allows: [
                        { type: "number" },
                        { type: "string" }
                    ]}
                }}
            }
        },

        propStringCollectionArray: {
            type: "arrayCollection",
            proto: { type: "string" },
            writable: true,
            accessors: true,
            nullable: true,
            default: ["foo", "bar"],
            watcher: function(newValue, oldValue, property) {
                this.changedPropStringCollectionArray = true;
                this.propStringCollectionArrayOld = oldValue;
                this.propStringCollectionArrayNew = newValue;
            }
        }

        //propNumberCollectionArray: { type: "arrayCollection", proto: { type: "number" } },
        //
        //propBooleanCollectionArray: { type: "arrayCollection", proto: { type: "boolean" } },
        //
        //propArrayCollectionArray: { type: "arrayCollection", proto: { type: "array" } },
        //
        //propObjectCollectionArray: { type: "arrayCollection", proto: { type: "object" } },
        //
        //propClassCollectionArray: { type: "arrayCollection", proto: { type: "class", className: "Class/AppClass" } },
        //
        //propEnumCollectionArray: { type: "arrayCollection", proto: { type: "enum", allows: [ "male", "female" ] } },
        //
        //propFunctionCollectionArray: { type: "arrayCollection", proto: { type: "function" } },
        //
        //propMixedCollectionArray: { type: "arrayCollection", proto: { type: "mixed", allows: [
        //    { type: "number" },
        //    { type: "string" }
        //]}},
        //
        //propMapCollectionArray: { type: "arrayCollection", proto: { type: "map", schema: {
        //    propMapNumber: { type: "number" },
        //    propMapString: { type: "string" },
        //    propMapMap: { type: "map", schema: {
        //        mapMapString: { type: "string" }
        //    }}
        //}}}
    }
});