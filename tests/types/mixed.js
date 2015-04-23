describe("Testing mixed property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propMixed');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(prop.getDefaultValue()).toBe(10);
    });

    it ("value", function() {
        expect(classInst.getPropMixed()).toBe("100px");
        expect(prop.getValue()).toBe("100px");
    });

    it ("ability to set new value", function() {
        classInst.setPropMixed(60);
        expect(classInst.getPropMixed()).toBe(60);
        expect(function() { classInst.setPropMixed("60"); }).toThrow();
        expect(function() { classInst.setPropMixed(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropMixed(null);
        expect(classInst.getPropMixed()).toBe(null);
        classInst.setPropMixed("50px");
        expect(classInst.getPropMixed()).toBe("50px");
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropMixed(60);
        expect(classInst.getPropMixed()).toBe("50px");
        prop.unlock();
        classInst.setPropMixed(60);
        expect(classInst.getPropMixed()).toBe(60);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropMixed).toBe(true);
        expect(classInst.propMixedOld).toBe("50px");
        expect(classInst.propMixedNew).toBe(60);
    });
});