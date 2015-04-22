
describe("Checking", function() {

    var classInst = app.getClass('Class/StandardDefinition').createInstance();

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

    it ('changing values', function() {

        expect(classInst.changedPropNumber).toBe(false);
        expect(classInst.propNumberOld).toBe(false);
        expect(classInst.propNumberNew).toBe(false);

        expect(classInst.changedPropString).toBe(false);
        expect(classInst.propStringOld).toBe(false);
        expect(classInst.propStringNew).toBe(false);

        expect(classInst.changedPropBoolean).toBe(false);
        expect(classInst.propBooleanOld).toBe(false);
        expect(classInst.propBooleanNew).toBe(false);

        expect(classInst.changedPropArray).toBe(false);
        expect(classInst.propArrayOld).toBe(false);
        expect(classInst.propArrayNew).toBe(false);

        expect(classInst.changedPropObject).toBe(false);
        expect(classInst.propObjectOld).toBe(false);
        expect(classInst.propObjectNew).toBe(false);

        expect(classInst.changedPropClass).toBe(false);
        expect(classInst.propClassOld).toBe(false);
        expect(classInst.propClassNew).toBe(false);

        expect(classInst.changedPropEnum).toBe(false);
        expect(classInst.propEnumOld).toBe(false);
        expect(classInst.propEnumNew).toBe(false);

        expect(classInst.changedPropFunction).toBe(false);
        expect(classInst.propFunctionOld).toBe(false);
        expect(classInst.propFunctionNew).toBe(false);

        expect(classInst.changedPropMixed).toBe(false);
        expect(classInst.propMixedOld).toBe(false);
        expect(classInst.propMixedNew).toBe(false);

        expect(classInst.changedPropMixed).toBe(false);
        expect(classInst.propMixedOld).toBe(false);
        expect(classInst.propMixedNew).toBe(false);

        expect(classInst.changedPropMap).toBe(false);
        expect(classInst.propMapOld).toBe(false);
        expect(classInst.propMapNew).toBe(false);

    });
});