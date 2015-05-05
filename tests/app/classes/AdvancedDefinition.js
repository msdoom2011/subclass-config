app.registerClass('Class/AdvancedDefinition',
{
    $_extends: "Class/StandardDefinition",

    $_properties: {

        propNumber: {
            type: 'number',
            default: 10,
            writable: true,
            accessors: true,
            nullable: true,
            minValue: 0,
            maxValue: 100,
            value: 50,
            watcher: function(newValue, oldValue, property) {
                this.changedPropNumber = true;
                this.propNumberOld = oldValue;
                this.propNumberNew = newValue;
            }
        },

        propString: {
            type: 'string',
            default: "0%",
            writable: true,
            accessors: true,
            nullable: true,
            pattern: /^[0-9]*%$/i,
            minLength: 2,
            maxLength: 3,
            value: "10%",
            watcher: function(newValue, oldValue, property) {
                this.changedPropString = true;
                this.propStringOld = oldValue;
                this.propStringNew = newValue;
            }
        },

        propBoolean: {
            type: 'boolean',
            default: false,
            writable: true,
            accessors: true,
            nullable: true,
            value: true,
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
            value: [ 40, 50, 60 ],
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
            value: { prop1: 30 },
            watcher: function(newValue, oldValue, property) {
                this.changedPropObject = true;
                this.propObjectOld = oldValue;
                this.propObjectNew = newValue;
            }
        },

        propClass: {
            type: "class",
            className: "Class/AppClass",
            default: null,
            writable: true,
            accessors: true,
            nullable: true,
            value: null,
            watcher: function(newValue, oldValue, property) {
                this.changedPropClass = true;
                this.propClassOld = oldValue;
                this.propClassNew = newValue;
            }
        },

        propEnum: {
            type: "enum",
            allows: [ "male", "female", null ],
            default: "male",
            writable: true,
            accessors: true,
            value: "female",
            watcher: function(newValue, oldValue, property) {
                this.changedPropEnum = true;
                this.propEnumOld = oldValue;
                this.propEnumNew = newValue;
            }
        },

        propFunction: {
            type: "function",
            "default": function () { return true; },
            writable: true,
            accessors: true,
            nullable: true,
            value: function() { return false; },
            watcher: function(newValue, oldValue, property) {
                this.changedPropFunction = true;
                this.propFunctionOld = oldValue;
                this.propFunctionNew = newValue;
            }
        },

        propMixed: {
            type: "mixed",
            allows: [
                { type: "number" },
                { type: "string", pattern: /^[0-9]+px$/i }
            ],
            default: 10,
            writable: true,
            accessors: true,
            nullable: true,
            value: "100px",
            watcher: function(newValue, oldValue, property) {
                this.changedPropMixed = true;
                this.propMixedOld = oldValue;
                this.propMixedNew = newValue;
            }
        },

        propMap: {
            type: "map",
            nullable: true,
            watcher: function(newValue, oldValue, property) {
                this.changedPropMap = true;
                this.propMapOld = oldValue;
                this.propMapNew = newValue;
            },
            default: {
                mapNumber: 10
            },
            value: {
                mapString: "init string value",
                mapMap: {
                    mapMapArray: [10]
                }
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
        //
        //propStringCollectionArray: {
        //    type: "arrayCollection",
        //    proto: { type: "string" },
        //    writable: true,
        //    accessors: true,
        //    nullable: true,
        //    default: ["foo", "bar"],
        //    value: ["str1", "str2", "str3"],
        //    watcher: function(newValue, oldValue, property) {
        //        this.changedPropStringCollectionArray = true;
        //        this.propStringCollectionArrayOld = oldValue;
        //        this.propStringCollectionArrayNew = newValue;
        //    }
        //}
    }
});