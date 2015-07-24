app.registerConfig("Config/BaseConfig", {

    $_properties: {

        propNumber: {type: 'number', default: 10, value: 20},

        propString: {type: 'string', default: "string default", value: "string value" },

        propBoolean: {type: 'boolean', default: false, value: true},

        propArray: {type: 'array', default: [3, 2, 1], value: [1, 2, 3] },

        propObject: {type: 'object', default: { item1: "value1", item2: "value2" }, value: { str1: "str1", str2: "str2" } },

        propClass: {type: "class", className: "Class/AppClass" },

        propEnum: {type: "enum", allows: ["male", "female"], default: "female", value: "male" },

        propFunction: {type: "function", default: null, value: function() { return 100; }},

        propUntyped: {type: "untyped", default: 'string value', value: 1000 },

        propConstructor: { type: "constructor", construct: Date, default: null },

        propMixed: {
            type: "mixed",
            allows: [
                {type: "number"},
                {type: "string"}
            ],
            default: 1000,
            value: "string value"
        }
    },

    propMap: { type: "map", schema: {

        mapNumber: [ "number", 10 ],

        mapString: [ "string", "map string" ],

        mapBoolean: [ "boolean", true ],

        mapArray: [ "array" ],

        mapObject: [ "object" ],

        mapClass: [ "class", "Class/AppClass" ],

        mapEnum: [ "enum", [ "male", "female" ] ],

        mapFunction: [ "function", null ],

        mapMixed: [ "mixed", [
            [ "number" ],
            { type: "string", pattern: /[0-9]+%$/i }
        ], "10%" ],

        mapMap: [ "map", {

            mapMapNumber: ["number"],

            mapMapString: ["string"],

            mapMapBoolean: ["boolean"],

            mapMapArray: ["array"],

            mapMapObject: ["object"],

            mapMapClass: ["class", "Class/AppClass"],

            mapMapEnum: ["enum", [ "male", "female" ]],

            mapMapFunction: ["function"],

            mapMapMixed: {type: "mixed", nullable: false, allows: [
                [ "number" ],
                [ "string" ]
            ]}
        }]
    }},

    // Array Collection

    propStringCollectionArray: { type: "arrayCollection", proto: { type: "string" }, default: ["str1", "str2"], value: ["item1", "item2"] },

    propNumberCollectionArray: { type: "arrayCollection", proto: { type: "number" }, default: [3, 2, 1], value: [1, 2, 3] },

    propBooleanCollectionArray: ["arrayCollection", ["boolean"], [true]],

    propArrayCollectionArray: { type: "arrayCollection", proto: { type: "array" }, default: [[1, 1], [2, 2]], value: [[3,3,3]] },

    propObjectCollectionArray: { type: "arrayCollection", proto: { type: "object" }, default: [{ "item1": 1, "item2": 2}] },

    propClassCollectionArray: { type: "arrayCollection", proto: { type: "class", className: "Class/AppClass" } },

    propEnumCollectionArray: { type: "arrayCollection", proto: { type: "enum", allows: [ "male", "female" ] } },

    propFunctionCollectionArray: { type: "arrayCollection", proto: { type: "function" } },

    propMixedCollectionArray: { type: "arrayCollection", proto: ["mixed", [
        ["number"],
        ["string"]
    ]]},

    propMapCollectionArray: { type: "arrayCollection", proto: ["map", {
        propMapNumber: ["number"],
        propMapString: ["string"],
        propMapMap: ["map", {
            mapMapString: ["string"]
        }]
    }]},

    propArrayCollectionCollectionArray: { type: "arrayCollection", proto: {
        type: "arrayCollection",
        proto: { type: "string" }
    }},


    // Object Collection

    propStringCollectionObject: { type: "objectCollection", proto: { type: "string" } },

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

});