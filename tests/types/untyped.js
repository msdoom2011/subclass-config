describe("Testing untyped property type with its", function() {

    //var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var classInst = window.classInstAdvanced;
    var prop = classInst.getProperty('propUntyped');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(prop.getDefaultValue()).toBe(10);
    });

    it ("value", function() {
        expect(classInst.getPropUntyped()).toBe("string value");
        expect(prop.getValue()).toBe("string value");
    });

    it ("ability to set new value", function() {
        classInst.setPropUntyped(60);
        expect(classInst.getPropUntyped()).toBe(60);
        classInst.setPropUntyped("60");
        expect(classInst.getPropUntyped()).toBe("60");
        classInst.setPropUntyped(true);
        expect(classInst.getPropUntyped()).toBe(true);
    });

    it ("nullable", function() {
        expect(function () { classInst.setPropUntyped(null) }).toThrow();
        expect(classInst.getPropUntyped()).toBe(true);
        classInst.setPropUntyped(50);
        expect(classInst.getPropUntyped()).toBe(50);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropUntyped(60);
        expect(classInst.getPropUntyped()).toBe(50);
        prop.unlock();
        classInst.setPropUntyped(60);
        expect(classInst.getPropUntyped()).toBe(60);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropUntyped).toBe(true);
        expect(classInst.propUntypedOld).toBe(50);
        expect(classInst.propUntypedNew).toBe(60);
    });
});