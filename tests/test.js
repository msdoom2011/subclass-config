
describe("Checking", function() {

    it ("standard default values", function() {

        var classInst = app.getClass('Class/SimpleDefinition').createInstance();

        expect(classInst.getPropNumber()).toBe(0);
        expect(classInst.getPropString()).toBe(null);
        expect(classInst.getPropBoolean()).toBe(false);
        expect(classInst.getPropArray().length).toBe(0);
        expect(Object.keys(classInst.getPropObject()).length).toBe(0);
        expect(classInst.getPropClass()).toBe(null);
        expect(classInst.getPropEnum()).toBe('male');
        expect(classInst.getPropFunction()).toBe(null);
        expect(classInst.getPropMixed()).toBe(null);

        var propMap = classInst.getPropMap();
        expect(propMap).not.toBe(null);
        expect(propMap.mapNumber).toBe(10);
    });
});