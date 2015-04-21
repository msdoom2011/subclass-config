
describe("Checking", function() {

    var classInst = app.getClass('Class/DefaultDefinition').createInstance();

    it ("standard default values", function() {

        expect(classInst.getPropNumber()).toBe(10);
        expect(classInst.getPropString()).toBe('default string');
        expect(classInst.getPropBoolean()).toBe(true);
        expect(classInst.getPropArray().length).toBe(3);
        expect(Object.keys(classInst.getPropObject()).length).toBe(2);
        expect(classInst.getPropClass()).toBe(null);
        expect(classInst.getPropEnum()).toBe('female');
        expect(typeof classInst.getPropFunction()).toBe('function');
        expect(classInst.getPropMixed()).toBe('string value');

        var propMap = classInst.getPropMap();
        expect(propMap).not.toBe(null);
        expect(propMap.mapNumber).toBe(0);
        expect(propMap.mapString).toBe('');
        expect(propMap.mapBoolean).toBe(false);
        expect(propMap.mapArray.length).toBe(0);
        expect(Object.keys(propMap.mapObject).length).toBe(0);
        expect(propMap.mapClass).toBe(null);
        expect(propMap.mapEnum).toBe('male');
        expect(propMap.mapFunction).toBe(null);
        expect(propMap.mapMixed).toBe(null);

        var mapMap = propMap.mapMap;
        expect(mapMap).not.toBe(null);
        expect(mapMap.mapMapNumber).toBe(0);
        expect(mapMap.mapMapString).toBe('');
        expect(mapMap.mapMapBoolean).toBe(false);
        expect(mapMap.mapMapArray.length).toBe(0);
        expect(Object.keys(mapMap.mapMapObject).length).toBe(0);
        expect(mapMap.mapMapClass).toBe(null);
        expect(mapMap.mapMapEnum).toBe('male');
        expect(mapMap.mapMapFunction).toBe(null);
        expect(mapMap.mapMapMixed).toBe(null);

    });

    it ('changing values', function() {



    });
});