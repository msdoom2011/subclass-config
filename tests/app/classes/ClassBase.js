app.registerClass('Class/AppClass', {});

app.registerClass('Class/SimpleDefinition',
{
    $_properties: {

        propNumber: { type: 'number' },

        propString: { type: 'string' },

        propBoolean: { type: 'boolean' },

        propArray: { type: 'array' },

        propObject: { type: 'object' },

        propClass: { type: "class", className: "Class/AppClass"},

        propEnum: { type: "enum", allows: [ "male", "female" ] },

        propFunction: { type: "function" },

        propMixed: { type: "mixed", allows: [
            { type: "number" },
            { type: "string" }
        ]},

        propMap: { type: "map", default: { mapNumber: 10 }, schema: {

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
        }}

    }
});