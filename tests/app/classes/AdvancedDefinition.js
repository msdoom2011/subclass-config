app.registerClass('Class/AdvancedDefinition',
{
    $_extends: "Class/StandardDefinition",

    $_traits: ['Class/StandardTrait'],

    $_properties: {

        propNumber: {
            type: 'number',
            //minValue: 0,
            //maxValue: 100,
            value: 50,
            extends: true
        },

        propString: {
            type: 'string',
            default: "0%",
            pattern: /^[0-9]*%$/i,
            minLength: 2,
            maxLength: 3,
            value: "10%",
            extends: true
        },

        propBoolean: {
            type: 'boolean',
            default: false,
            value: true,
            extends: true
        },

        propArray: {
            type: 'array',
            value: [ 40, 50, 60 ],
            extends: true
        },

        propObject: {
            type: 'object',
            value: { prop1: 30 },
            extends: true
        },

        propClass: {
            type: "class",
            value: null,
            extends: true
        },

        propEnum: {
            type: "enum",
            default: "male",
            value: "female",
            extends: true
        },

        propFunction: {
            type: "function",
            value: function() { return false; },
            extends: true
        },

        propMixed: {
            type: "mixed",
            allows: [
                { type: "number" },
                { type: "string", pattern: /^[0-9]+px$/i }
            ],
            default: 10,
            value: "100px",
            extends: true
        },

        propConstructor: {
            type: "constructor",
            value: new Date(100),
            extends: true
        },

        propMap: {
            type: "map",
            default: {
                mapNumber: 10
            },
            value: {
                mapString: "init string value",
                mapMap: {
                    mapMapArray: [10]
                }
            },
            extends: true
        },


        // Array Collection

        propStringCollectionArray: {
            type: "arrayCollection",
            value: ["str1", "str2", "str3"],
            extends: true
        },


        propMapCollectionArray: {
            type: "arrayCollection",
            default: [
                {
                    propMapNumber: 10,
                    propMapString: "string value",
                    propMapMap: {
                        mapMapString: "map string value"
                    }
                },
                {
                    propMapNumber: 20,
                    propMapString: "string value 2",
                    propMapMap: {
                        mapMapString: "map string value 2"
                    }
                }
            ],
            value: [
                {
                    propMapNumber: 1000,
                    propMapString: "string value 1000",
                    propMapMap: {
                        mapMapString: "map string value 1000"
                    }
                },
                {
                    propMapNumber: 1001,
                    propMapString: "string value 1001",
                    propMapMap: {
                        mapMapString: "map string value 1001"
                    }
                }
            ],
            extends: true
        },

        propArrayCollectionCollectionArray: {
            type: "arrayCollection",
            proto: { type: "arrayCollection", proto: { type: 'string', default: "default_str" } },
            value: [
                [ 'item11', 'item12', 'item13'],
                [ 'item21', 'item22', 'item23']
            ],
            extends: true
        },


        // Object Collection

        propStringCollectionObject: {
            type: "objectCollection",
            value: {
                "item1": "str1",
                "item2": "str2",
                "item3": "str3"
            },
            extends: true
        },


        propMapCollectionObject: {
            type: "objectCollection",
            default: {
                "item1": {
                    propMapNumber: 1000,
                    propMapString: "string value 1000",
                    propMapMap: {
                        mapMapString: "map string value 1000"
                    }
                },
                "item2": {
                    extends: "item1",
                    propMapNumber: 2000,
                    propMapMap: {
                        mapMapString: "map string value 2000"
                    }
                },
                "item3": {
                    extends: "item2",
                    propMapString: "string value 3000"
                }
            },
            value: {
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
            extends: true
        },

        propArrayCollectionCollectionObject: {
            type: "objectCollection",
            proto: {
                type: "arrayCollection",
                proto: {
                    type: 'string',
                    default: "default_str"
                }
            },
            value: {
                "item1": ['item11', 'item12', 'item13'],
                "item2": ['item21', 'item22', 'item23']
            },
            extends: true
        }
    }
});