
describe("Checking", function() {

    it ("standard default values", function() {

        var classInst = app.getClass('Class/BaseDefinition').createInstance();

        expect(classInst.getPropNumber()).toBe(0);
        expect(classInst._usedCustomGetter).toBe(true);

        expect(classInst.getPropString()).toBe('');
        expect(classInst.getPropBoolean()).toBe(false);
        expect(classInst.getPropArray().length).toBe(0);
        expect(Object.keys(classInst.getPropObject()).length).toBe(0);
        expect(classInst.getPropClass()).toBe(null);
        expect(classInst.getPropEnum()).toBe('male');
        expect(typeof classInst.getPropFunction()).toBe('function');
        expect(classInst.getPropMixed()).toBe(null);
        expect(classInst.getPropUntyped()).toBe(null);
        expect(classInst.getPropConstructor()).toBe(null);

        expect(classInst.getPropStringCollectionArray() === null).toBe(false);
        //expect(classInst.getPropStringCollectionArray()).toBe(null);

        var propMap = classInst.getPropMap();
        expect(propMap).not.toBe(null);
        expect(propMap.mapNumber).toBe(0);
        expect(propMap.mapString).toBe('');
        expect(propMap.mapBoolean).toBe(false);
        expect(propMap.mapArray.length).toBe(0);
        expect(Object.keys(propMap.mapObject).length).toBe(0);
        expect(propMap.mapClass).toBe(null);
        expect(propMap.mapEnum).toBe('male');
        expect(typeof propMap.mapFunction).toBe('function');
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
        expect(typeof mapMap.mapMapFunction).toBe('function');
        expect(mapMap.mapMapMixed).toBe(null);
    });
});