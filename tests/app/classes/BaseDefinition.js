app.registerClass('Class/AppClass', {

    value: null,

    $_constructor: function(value)
    {
        this.value = value;
    }
});

app.registerClass('Class/BaseDefinition',
{
    _usedCustomGetter: false,
    
    getPropNumber: function()
    {
        this._usedCustomGetter = true;

        return this.getPropNumberDefault();
    },

    $_properties: {

        propNumber: [ 'number' ],

        propString: [ 'string' ],

        propBoolean: [ 'boolean' ],

        propArray: [ 'array' ],

        propObject: [ 'object' ],

        propClass: [ "class", "Class/AppClass" ],

        propEnum: [ "enum", [ "male", "female" ] ],

        propFunction: [ "function" ],

        propUntyped: [ "untyped" ],

        propMixed: [ "mixed", [
            [ "number" ],
            [ "string" ]
        ]],

        propConstructor: [ "constructor", Date ],

        propMap: [ "map", {

            mapNumber: [ "number" ],

            mapString: [ "string" ],

            mapBoolean: [ "boolean" ],

            mapArray: [ "array" ],

            mapObject: [ "object" ],

            mapClass: [ "class", "Class/AppClass" ],

            mapEnum: [ "enum", [ "male", "female" ] ],

            mapFunction: [ "function" ],

            mapMixed: ["mixed", [
                [ "number" ],
                [ "string" ]
            ]],

            mapMap: [ "map", {

                mapMapNumber: [ "number" ],

                mapMapString: [ "string" ],

                mapMapBoolean: [ "boolean" ],

                mapMapArray: [ "array" ],

                mapMapObject: [ "object" ],

                mapMapClass: [ "class", "Class/AppClass" ],

                mapMapEnum: [ "enum", [ "male", "female" ] ],

                mapMapFunction: [ "function" ],

                mapMapMixed: [ "mixed", [
                    [ "number" ],
                    [ "string" ]
                ]]
            }]
        }],

        // Array Collection

        propStringCollectionArray: [ "arrayCollection", [ "string" ] ],

        propNumberCollectionArray: [ "arrayCollection", [ "number" ] ],

        propBooleanCollectionArray: { type: "arrayCollection", proto: { type: "boolean" } },

        propArrayCollectionArray: { type: "arrayCollection", proto: { type: "array" } },

        propObjectCollectionArray: { type: "arrayCollection", proto: { type: "object" } },

        propClassCollectionArray: { type: "arrayCollection", proto: { type: "class", className: "Class/AppClass" } },

        propEnumCollectionArray: { type: "arrayCollection", proto: { type: "enum", allows: [ "male", "female" ] } },

        propFunctionCollectionArray: { type: "arrayCollection", proto: { type: "function" } },

        propMixedCollectionArray: { type: "arrayCollection", proto: { type: "mixed", allows: [
            { type: "number" },
            { type: "string" }
        ]}},

        propMapCollectionArray: { type: "arrayCollection", proto: { type: "map", schema: {
            propMapNumber: { type: "number" },
            propMapString: { type: "string" },
            propMapMap: { type: "map", schema: {
                mapMapString: { type: "string" }
            }}
        }}},

        propArrayCollectionCollectionArray: { type: "arrayCollection", proto: {
            type: "arrayCollection",
            proto: { type: "string" }
        }},


        // Object Collection

        propStringCollectionObject: [ "objectCollection", [ "string" ] ],

        propNumberCollectionObject: { type: "objectCollection", proto: { type: "number" } },

        propBooleanCollectionObject: { type: "objectCollection", proto: { type: "boolean" } },

        propArrayCollectionObject: { type: "objectCollection", proto: { type: "array" } },

        propObjectCollectionObject: { type: "objectCollection", proto: { type: "object" } },

        propClassCollectionObject: { type: "objectCollection", proto: { type: "class", className: "Class/AppClass" } },

        propEnumCollectionObject: { type: "objectCollection", proto: { type: "enum", allows: [ "male", "female" ] } },

        propFunctionCollectionObject: { type: "objectCollection", proto: { type: "function" } },

        propMixedCollectionObject: { type: "objectCollection", proto: { type: "mixed", allows: [
            { type: "number" },
            { type: "string" }
        ]}},

        propMapCollectionObject: { type: "objectCollection", proto: { type: "map", schema: {
            propMapNumber: { type: "number" },
            propMapString: { type: "string" },
            propMapMap: { type: "map", schema: {
                mapMapString: { type: "string" }
            }}
        }}},

        propArrayCollectionCollectionObject: { type: "objectCollection", proto: {
            type: "arrayCollection",
            proto: { type: "string" }
        }}
    }
});
