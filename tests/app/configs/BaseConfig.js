app.registerConfig("Config/BaseConfig", {

    $_properties: {

        propNumber: {type: 'number'},

        propString: {type: 'string'},

        propBoolean: {type: 'boolean'},

        propArray: {type: 'array'},

        propObject: {type: 'object'},

        propClass: {type: "class", className: "Class/AppClass"},

        propEnum: {type: "enum", allows: ["male", "female"]},

        propFunction: {type: "function"},

        propUntyped: {type: "untyped"},

        propMixed: { type: "mixed", allows: [
            {type: "number"},
            {type: "string"}
        ]},

        propConstructor: {type: "constructor", construct: Date},
    },

    propMap: { type: "map", schema: {

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
    }},

    // Array Collection

    propStringCollectionArray: { type: "arrayCollection", proto: { type: "string" } },

    propNumberCollectionArray: { type: "arrayCollection", proto: { type: "number" } },

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