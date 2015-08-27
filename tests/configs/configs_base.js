describe("Checking base config class", function() {

    var config = app.getClass('Config/BaseConfig').createInstance();

    it ("default values", function() {

        var defaults = config.getDefaults();
        var values = config.getData();

        expect(Subclass.Tools.isEqual(defaults, {
            propNumber: 10,
            propString: 'string default',
            propBoolean: false,
            propArray: [3, 2, 1],
            propObject: { item1: "value1", item2: "value2" },
            propClass: null,
            propEnum: 'female',
            propFunction: null,
            propUntyped: "string value",
            propConstructor: null,
            propMixed: 1000,
            propMap: {
                mapNumber: 10,
                mapString: 'map string',
                mapBoolean: true,
                mapArray: [],
                mapObject: {},
                mapClass: null,
                mapEnum: 'male',
                mapFunction: null,
                mapMixed: "10%",
                mapMap: {
                    mapMapNumber: 0,
                    mapMapString: "",
                    mapMapBoolean: false,
                    mapMapArray: [],
                    mapMapObject: {},
                    mapMapClass: null,
                    mapMapEnum: "male",
                    mapMapFunction: function() {},
                    mapMapMixed: 0
                }
            },
            // Array collection
            propStringCollectionArray: ["str1", "str2"],
            propNumberCollectionArray: [3, 2, 1],
            propBooleanCollectionArray: [true],
            propArrayCollectionArray: [[1, 1], [2, 2]],
            propObjectCollectionArray: [{ "item1": 1, "item2": 2}],
            propClassCollectionArray: [],
            propEnumCollectionArray: [],
            propFunctionCollectionArray: [],
            propMixedCollectionArray: [],
            propMapCollectionArray: [],
            propArrayCollectionCollectionArray: [],

            // Object Collection
            propStringCollectionObject: {},
            propNumberCollectionObject: {},
            propBooleanCollectionObject: {},
            propArrayCollectionObject: {},
            propObjectCollectionObject: {},
            propClassCollectionObject: {},
            propEnumCollectionObject: {},
            propFunctionCollectionObject: {},
            propMixedCollectionObject: {},
            propMapCollectionObject: {},
            propArrayCollectionCollectionObject: {}
        })).toBe(true);

        expect(Subclass.Tools.isEqual(values, {
            propNumber: 20,
            propString: 'string value',
            propBoolean: true,
            propArray: [1, 2, 3],
            propObject: { str1: "str1", str2: "str2" },
            propClass: null,
            propEnum: 'male',
            propFunction: function() { return 100; },
            propUntyped: 1000,
            propConstructor: null,
            propMixed: 'string value',
            propMap: {
                mapNumber: 10,
                mapString: 'map string',
                mapBoolean: true,
                mapArray: [],
                mapObject: {},
                mapClass: null,
                mapEnum: 'male',
                mapFunction: null,
                mapMixed: "10%",
                mapMap: {
                    mapMapNumber: 0,
                    mapMapString: "",
                    mapMapBoolean: false,
                    mapMapArray: [],
                    mapMapObject: {},
                    mapMapClass: null,
                    mapMapEnum: "male",
                    mapMapFunction: function() {},
                    mapMapMixed: 0
                }
            },

            // Array collection
            propStringCollectionArray: ["item1", "item2"],
            propNumberCollectionArray: [1, 2, 3],
            propBooleanCollectionArray: [true],
            propArrayCollectionArray: [[3, 3, 3]],
            propObjectCollectionArray: [{ "item1": 1, "item2": 2}],
            propClassCollectionArray: [],
            propEnumCollectionArray: [],
            propFunctionCollectionArray: [],
            propMixedCollectionArray: [],
            propMapCollectionArray: [],
            propArrayCollectionCollectionArray: [],

            // Object Collection
            propStringCollectionObject: {},
            propNumberCollectionObject: {},
            propBooleanCollectionObject: {},
            propArrayCollectionObject: {},
            propObjectCollectionObject: {},
            propClassCollectionObject: {},
            propEnumCollectionObject: {},
            propFunctionCollectionObject: {},
            propMixedCollectionObject: {},
            propMapCollectionObject: {},
            propArrayCollectionCollectionObject: {}

        })).toBe(true);

        config.setDefaults({
            propString: "new default string",
            propNumber: 200
        });

        expect(config.getProperty('propString').getDefaultValue()).toBe('new default string');
        expect(config.getProperty('propNumber').getDefaultValue()).toBe(200);

        expect(config.propString).toBe('string value');
        expect(config.propNumber).toBe(20);

        config.getProperty('propString').resetValue();
        config.getProperty('propNumber').resetValue();

        expect(config.propString).toBe('new default string');
        expect(config.propNumber).toBe(200);

        config.setValues({
            propString: "new value string",
            propNumber: 1200
        });

        expect(config.propString).toBe('new value string');
        expect(config.propNumber).toBe(1200);

    });
});