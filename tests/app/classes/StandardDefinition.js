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

    changedPropConstructor: false,
    propConstructorOld: false,
    propConstructorNew: false,

    changedPropMap: false,
    propMapOld: false,
    propMapNew: false,
    propMapDiff: false,

    changedPropStringCollectionArray: false,
    propStringCollectionArrayOld: false,
    propStringCollectionArrayNew: false,

    changedPropMapCollectionArray: false,
    propMapCollectionArrayOld: false,
    propMapCollectionArrayNew: false,

    changedPropArrayCollectionCollectionArray: false,
    propArrayCollectionCollectionArrayOld: false,
    propArrayCollectionCollectionArrayNew: false,

    changedPropStringCollectionObject: false,
    propStringCollectionObjectOld: false,
    propStringCollectionObjectNew: false,

    changedPropMapCollectionObject: false,
    propMapCollectionObjectOld: false,
    propMapCollectionObjectNew: false,

    changedPropArrayCollectionCollectionObject: false,
    propArrayCollectionCollectionObjectOld: false,
    propArrayCollectionCollectionObjectNew: false,

    $_properties: {

        propNumber: {
            type: 'number',
            default: 10,
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(event) {
                this.changedPropNumber = true;
                this.propNumberOld = event.getOldValue();
                this.propNumberNew = event.getNewValue();
            }
        },

        propString: {
            type: 'string',
            default: "default string",
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(event) {
                this.changedPropString = true;
                this.propStringOld = event.getOldValue();
                this.propStringNew = event.getNewValue();
            }
        },

        propBoolean: {
            type: 'boolean',
            default: true,
            writable: true,
            accessors: true,
            nullable: true,
            watcher: function(event) {
                this.changedPropBoolean = true;
                this.propBooleanOld = event.getOldValue();
                this.propBooleanNew = event.getNewValue();
            }
        },

        propArray: {
            type: 'array',
            default: [ 10, 20, 30 ],
            writable: true,
            accessors: true,
            watcher: function(event) {
                this.changedPropArray = true;
                this.propArrayOld = event.getOldValue();
                this.propArrayNew = event.getNewValue();
            }
        },

        propObject: {
            type: 'object',
            default: { foo: 10, bar: 20 },
            writable: true,
            accessors: true,
            watcher: function(event) {
                this.changedPropObject = true;
                this.propObjectOld = event.getOldValue();
                this.propObjectNew = event.getNewValue();
            }
        },

        propClass: {
            type: "class",
            className: "Class/AppClass",
            default: null,
            writable: true,
            accessors: true,
            watcher: function(event) {
                this.changedPropClass = true;
                this.propClassOld = event.getOldValue();
                this.propClassNew = event.getNewValue();
            }
        },

        propEnum: {
            type: "enum",
            allows: [ "male", "female" ],
            default: "female",
            writable: true,
            accessors: true,
            watcher: function(event) {
                this.changedPropEnum = true;
                this.propEnumOld = event.getOldValue();
                this.propEnumNew = event.getNewValue();
            }
        },

        propFunction: {
            type: "function",
            "default": function () { return true },
            writable: true,
            accessors: true,
            watcher: function(event) {
                this.changedPropFunction = true;
                this.propFunctionOld = event.getOldValue();
                this.propFunctionNew = event.getNewValue();
            }
        },

        propUntyped: {
            type: "untyped",
            default: 10,
            writable: true,
            accessors: true,
            nullable: false,
            value: "string value",
            watcher: function(event) {
                this.changedPropUntyped = true;
                this.propUntypedOld = event.getOldValue();
                this.propUntypedNew = event.getNewValue();
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
            watcher: function(event) {
                this.changedPropMixed = true;
                this.propMixedOld = event.getOldValue();
                this.propMixedNew = event.getNewValue();
            }
        },

        propConstructor: {
            type: "constructor",
            construct: Date,
            default: new Date(0),
            writable: true,
            accessors: true,
            watcher: function(event) {
                this.changedPropConstructor = true;
                this.propConstructorOld = event.getOldValue();
                this.propConstructorNew = event.getNewValue();
            }
        },

        propMap: {
            type: "map",
            watcher: function(event) {
                this.changedPropMap = true;
                this.propMapOld = event.getOldValue();
                this.propMapNew = event.getNewValue();
                this.propMapDiff = event.getDiffValue();
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


        // Array Collection

        propStringCollectionArray: {
            type: "arrayCollection",
            proto: { type: "string" },
            writable: true,
            accessors: true,
            default: ["foo", "bar"],
            watcher: function(event) {
                this.changedPropStringCollectionArray = true;
                this.propStringCollectionArrayOld = event.getOldValue();
                this.propStringCollectionArrayNew = event.getNewValue();
            }
        },

        propMapCollectionArray: {
            type: "arrayCollection",
            proto: { type: "map", schema: {
                propMapNumber: { type: "number" },
                propMapString: { type: "string" },
                propMapMap: { type: "map", schema: {
                    mapMapString: { type: "string" }
                }}
            }},
            writable: true,
            accessors: true,
            default: [
                {
                    propMapNumber: 10,
                    propMapString: "string value",
                    propMapMap: {
                        mapMapString: "map string value"
                    }
                }
            ],
            watcher: function(event)
            {
                this.changedPropMapCollectionArray = true;
                this.propMapCollectionArrayOld = event.getOldValue();
                this.propMapCollectionArrayNew = event.getNewValue();
            }
        },

        propArrayCollectionCollectionArray: {
            type: "arrayCollection",
            proto: { type: "arrayCollection", proto: { type: 'string' } },
            writable: true,
            accessors: true,
            default: [
                [ 'str11', 'str12', 'str13'],
                [ 'str21', 'str22', 'str23']
            ],
            watcher: function(event)
            {
                this.changedPropArrayCollectionCollectionArray = true;
                this.propArrayCollectionCollectionArrayOld = event.getOldValue();
                this.propArrayCollectionCollectionArrayNew = event.getNewValue();
            }
        },


        // Object Collection

        propStringCollectionObject: {
            type: "objectCollection",
            proto: { type: "string" },
            writable: true,
            accessors: true,
            default: {
                "item1": "foo",
                "item2": "bar"
            },
            watcher: function(event) {
                this.changedPropStringCollectionObject = true;
                this.propStringCollectionObjectOld = event.getOldValue();
                this.propStringCollectionObjectNew = event.getNewValue();
            }
        },

        propMapCollectionObject: {
            type: "objectCollection",
            proto: { type: "map", schema: {
                propMapNumber: { type: "number" },
                propMapString: { type: "string" },
                propMapMap: { type: "map", schema: {
                    mapMapString: { type: "string" }
                }}
            }},
            writable: true,
            accessors: true,
            default: {
                "item1": {
                    propMapNumber: 10,
                    propMapString: "string value",
                    propMapMap: {
                        mapMapString: "map string value"
                    }
                },
                "item2": {
                    extends: "item1",
                    propMapNumber: 100
                },
                "item3": {
                    extends: "item2",
                    propMapMap: {
                        mapMapString: "new map string value!!!"
                    }
                }
            },
            watcher: function(event)
            {
                this.changedPropMapCollectionObject = true;
                this.propMapCollectionObjectOld = event.getOldValue();
                this.propMapCollectionObjectNew = event.getNewValue();
            }
        },

        propArrayCollectionCollectionObject: {
            type: "objectCollection",
            proto: { type: "arrayCollection", proto: { type: 'string' } },
            writable: true,
            accessors: true,
            default: {
                "item1": ['str11', 'str12', 'str13'],
                "item2": ['str21', 'str22', 'str23']
            },
            watcher: function(event)
            {
                this.changedPropArrayCollectionCollectionObject = true;
                this.propArrayCollectionCollectionObjectOld = event.getOldValue();
                this.propArrayCollectionCollectionObjectNew = event.getNewValue();
            }
        }
    }
});