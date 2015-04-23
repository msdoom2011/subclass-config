describe("Testing map property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propMap');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(Object.keys(prop.getDefaultValue()).length).toBe(1);
        expect(prop.getDefaultValue().mapNumber).toBe(10);
    });

    it ("value", function() {
        expect(Object.keys(classInst.getPropMap()).length).toBe(10);
        expect(classInst.getPropMap().mapNumber).toBe(10);
        expect(classInst.getPropMap().mapString).toBe('init string value');
        expect(Object.keys(classInst.getPropMap().mapMap).length).toBe(9);
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

        function checkPropValues() {
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

        checkPropValues();
        classInst.getProperty('propMap').resetValue();

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
        checkPropValues();

        classInst.getPropMap().getChild('mapMap').resetValue();

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

        checkPropValues();

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
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropMap({ mapString: "111" });
        classInst.getPropMap().mapString = "111";
        expect(classInst.getPropMap().mapString).toBe("init string value");
        prop.unlock();
        classInst.setPropMap({ mapString: "111" });
        expect(classInst.getPropMap().mapString).toBe("111");
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropMap).toBe(true);
        expect(classInst.propMapOld.mapString).toBe("init string value");
        expect(classInst.propMapNew.mapString).toBe("111");
    });
});


//console.log('-------------------------');
//console.log(inst.getProperty('typedMap').isModified());
//console.log('-------------------------');
//
//console.log(inst.getTypedMap());
////console.log(inst.setTypedMap(111));
//console.log(inst.getTypedMap().propMapString);
//console.log(inst.getTypedMap().propMapMap.propMapMapString);
////        inst.getTypedMap().propMapMap.propMapMapString = 111;
//inst.getTypedMap().propMapMap.propMapMapString += " changed!!!!";
//console.log(inst.getTypedMap().propMapMap.propMapMapString);
//inst.setTypedMap(null);
//console.log(inst.getTypedMap());
//
//console.log('-------------------------');
//inst.getProperty('typedMap').setModified();
//console.log(inst.getProperty('typedMap').isModified());
//console.log('-------------------------');
//
//inst.setTypedMap({
//    propMapString: 'psix!!!!!!!!!!!!!!!!!!!!!!'
//});
//console.log(inst.getTypedMap());
//inst.getTypedMap().propMapMap.propMapMapString = "psix!!!!";
//console.log(inst.getTypedMap());
//
//
//inst.setTypedMap({
//    propMapMap: {
//        propMapMapString: "another new value!!!!"
//    },
//    propMapString: "changed",
//    propMapNumber: 1111,
//    propMapObject: { a: "yes!!!" }
//});
//
//console.log(inst.getTypedMap());
//console.log(inst.getTypedMap().getData());
