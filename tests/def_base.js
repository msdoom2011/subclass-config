
describe("Checking", function() {

    it ("standard default values", function() {

        var classInst = app.getClass('Class/BaseDefinition').createInstance();

        expect(classInst.getPropNumber()).toBe(0);
        expect(classInst.getPropString()).toBe(null);
        expect(classInst.getPropBoolean()).toBe(false);
        expect(classInst.getPropArray().length).toBe(0);
        expect(Object.keys(classInst.getPropObject()).length).toBe(0);
        expect(classInst.getPropClass()).toBe(null);
        expect(classInst.getPropEnum()).toBe('male');
        expect(classInst.getPropFunction()).toBe(null);
        expect(classInst.getPropMixed()).toBe(null);

        expect(classInst.getPropStringCollectionArray() === null).toBe(true);
        //expect(classInst.getPropStringCollectionArray()).toBe(null);

        var propMap = classInst.getPropMap();
        expect(propMap).not.toBe(null);
        expect(propMap.mapNumber).toBe(0);
        expect(propMap.mapString).toBe(null);
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
        expect(mapMap.mapMapString).toBe(null);
        expect(mapMap.mapMapBoolean).toBe(false);
        expect(mapMap.mapMapArray.length).toBe(0);
        expect(Object.keys(mapMap.mapMapObject).length).toBe(0);
        expect(mapMap.mapMapClass).toBe(null);
        expect(mapMap.mapMapEnum).toBe('male');
        expect(mapMap.mapMapFunction).toBe(null);
        expect(mapMap.mapMapMixed).toBe(null);
    });
});