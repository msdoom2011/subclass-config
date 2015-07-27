describe("Testing map property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propMap');

    function checkDefaultValues(prop, mapMapOnly) {
        if (mapMapOnly !== true) {
            mapMapOnly == false;
        }
        if (!mapMapOnly) {
            expect(prop.mapNumber).toBe(10);
            expect(prop.mapString).toBe('');
            expect(prop.mapBoolean).toBe(false);
            expect(prop.mapArray.length).toBe(0);
            expect(Object.keys(prop.mapObject).length).toBe(0);
            expect(prop.mapClass).toBe(null);
            expect(prop.mapEnum).toBe('male');
            expect(typeof prop.mapFunction).toBe('function');
            expect(prop.mapMixed).toBe(null);
        }

        var propMap = prop.mapMap;
        expect(propMap.mapMapNumber).toBe(0);
        expect(propMap.mapMapString).toBe('');
        expect(propMap.mapMapBoolean).toBe(false);
        expect(propMap.mapMapArray.length).toBe(0);
        expect(Object.keys(propMap.mapMapObject).length).toBe(0);
        expect(propMap.mapMapClass).toBe(null);
        expect(propMap.mapMapEnum).toBe('male');
        expect(typeof propMap.mapMapFunction).toBe('function');
        expect(propMap.mapMapMixed).toBe(null);
    }

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(Object.keys(prop.getDefaultValue()).length).toBe(10);
        expect(prop.getDefaultValue().mapNumber).toBe(10);
    });

    it ("value", function() {
        expect(Object.keys(classInst.getPropMap().getChildren()).length).toBe(10);
        expect(classInst.getPropMap().mapNumber).toBe(10);
        expect(classInst.getPropMap().mapString).toBe('init string value');
        expect(Object.keys(classInst.getPropMap().mapMap.getChildren()).length).toBe(9);
        expect(classInst.getPropMap().mapMap.mapMapArray).toContain(10);
    });

    it ("ability to set new value", function() {
        classInst.setPropMap({
            mapNumber: 20,
            mapString: "the new string value",
            mapBoolean: true,
            mapArray: [ 20 ],
            mapObject: { prop: 20 },
            mapClass: app.getClass('Class/AppClass').createInstance(10),
            mapEnum: "female",
            mapFunction: function() { return 50; },
            mapMixed: "string value",
            mapMap: {
                mapMapNumber: 100,
                mapMapString: "200",
                mapMapBoolean: true,
                mapMapArray: [ 20 ],
                mapMapObject: { prop: 30 },
                mapMapClass: app.getClass('Class/AppClass').createInstance(20),
                mapMapEnum: "female",
                mapMapFunction: function() { return 60; },
                mapMapMixed: 20
            }
        });

        var prop = classInst.getPropMap();

        function checkPropValues(prop) {
            expect(prop.mapNumber).toBe(20);
            expect(prop.mapString).toBe('the new string value');
            expect(prop.mapBoolean).toBe(true);
            expect(prop.mapArray).toContain(20);
            expect(prop.mapObject.prop).toBe(20);
            expect(prop.mapClass.value).toBe(10);
            expect(prop.mapEnum).toBe('female');
            expect(prop.mapFunction()).toBe(50);
            expect(prop.mapMixed).toBe('string value');

            var propMap = prop.mapMap;
            expect(propMap.mapMapNumber).toBe(100);
            expect(propMap.mapMapString).toBe("200");
            expect(propMap.mapMapBoolean).toBe(true);
            expect(propMap.mapMapArray).toContain(20);
            expect(propMap.mapMapObject.prop).toBe(30);
            expect(propMap.mapMapClass.value).toBe(20);
            expect(propMap.mapMapEnum).toBe('female');
            expect(propMap.mapMapFunction()).toBe(60);
            expect(propMap.mapMapMixed).toBe(20);
        }

        checkPropValues(prop);
        checkPropValues(prop.getData());
        classInst.getProperty('propMap').resetValue();
        checkDefaultValues(prop);
        checkDefaultValues(prop.getData());

        prop.mapNumber = 20;
        prop.mapString = "the new string value";
        prop.mapBoolean = true;
        prop.mapArray = [ 20 ];
        prop.mapObject = { prop: 20 };
        prop.mapClass = app.getClass('Class/AppClass').createInstance(10);
        prop.mapEnum = "female";
        prop.mapFunction = function() { return 50; };
        prop.mapMixed = "string value";
        prop.mapMap = {
            mapMapNumber: 100,
            mapMapString: "200",
            mapMapBoolean: true,
            mapMapArray: [ 20 ],
            mapMapObject: { prop: 30 },
            mapMapClass: app.getClass('Class/AppClass').createInstance(20),
            mapMapEnum: "female",
            mapMapFunction: function() { return 60; },
            mapMapMixed: 20
        };

        checkPropValues(prop);
        checkPropValues(prop.getData());
        classInst.getPropMap().getProperty('mapMap').resetValue();
        checkDefaultValues(prop, true);
        checkDefaultValues(prop.getData(), true);

        var mapMap = classInst.getPropMap().mapMap;
        mapMap.mapMapNumber = 100;
        mapMap.mapMapString = "200";
        mapMap.mapMapBoolean = true;
        mapMap.mapMapArray = [ 20 ];
        mapMap.mapMapObject = { prop: 30 };
        mapMap.mapMapClass = app.getClass('Class/AppClass').createInstance(20);
        mapMap.mapMapEnum = "female";
        mapMap.mapMapFunction = function() { return 60; };
        mapMap.mapMapMixed = 20;

        checkPropValues(prop);
        checkPropValues(prop.getData());

        expect(function() { classInst.setPropMap("60"); }).toThrow();
        expect(function() { classInst.setPropMap(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropMap(null);
        expect(classInst.getPropMap()).toBe(null);
        classInst.setPropMap({
            mapString: "init string value",
            mapMap: {
                mapMapArray: [10]
            }
        });
        expect(classInst.getPropMap().mapString).toBe("init string value");
        expect(classInst.getPropMap().mapMap.mapMapArray.length).toBe(1);
        expect(classInst.getPropMap().mapMap.mapMapArray).toContain(10);
        expect(classInst.getPropMap().getData().mapMap.mapMapArray).toContain(10);
    });

    it ("valid schema data after null was set", function() {
        var prop = classInst.getPropMap().getData();

        expect(prop.mapNumber).toBe(10);
        expect(prop.mapString).toBe('init string value');
        expect(prop.mapBoolean).toBe(false);
        expect(prop.mapArray.length).toBe(0);
        expect(Object.keys(prop.mapObject).length).toBe(0);
        expect(prop.mapClass).toBe(null);
        expect(prop.mapEnum).toBe('male');
        expect(typeof prop.mapFunction).toBe('function');
        expect(prop.mapMixed).toBe(null);

        var propMap = prop.mapMap;
        expect(propMap.mapMapNumber).toBe(0);
        expect(propMap.mapMapString).toBe('');
        expect(propMap.mapMapBoolean).toBe(false);
        expect(propMap.mapMapArray.length).toBe(1);
        expect(propMap.mapMapArray).toContain(10);
        expect(Object.keys(propMap.mapMapObject).length).toBe(0);
        expect(propMap.mapMapClass).toBe(null);
        expect(propMap.mapMapEnum).toBe('male');
        expect(typeof propMap.mapMapFunction).toBe('function');
        expect(propMap.mapMapMixed).toBe(null);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropMap({ mapMap: { mapMapString: "111" }});
        classInst.getPropMap().mapMap.mapMapString = "111";
        //expect(classInst.getPropMap().mapMap.mapMapString).toBe("init string value");
        expect(classInst.getPropMap().mapMap.mapMapString).toBe("");
        prop.unlock();
        //classInst.setPropMap({ mapString: "111", mapMap: { mapMapString: "111" } });
        classInst.getPropMap().mapMap.mapMapString = "111";
        expect(classInst.getPropMap().mapMap.mapMapString).toBe("111");
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropMap).toBe(true);
        //expect(classInst.propMapOld.mapMap.mapMapString).toBe("init string value");
        expect(classInst.propMapOld.mapMap.mapMapString).toBe("");
        expect(classInst.propMapNew.mapMap.mapMapString).toBe("111");
        console.log('===============================');
        console.log('===============================');
        console.log('===============================');
        console.log('===============================');
        console.log('===============================');
        console.log(classInst.propMapOld);
        console.log(classInst.propMapNew);
        console.log(classInst.propMapDiff);
        console.log('===============================');
        console.log('===============================');
        console.log('===============================');
        console.log('===============================');
        console.log('===============================');
    });
});