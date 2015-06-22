describe("Testing array property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propConstructor');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        var value = prop.getDefaultValue();
        expect(Array.isArray(value)).toBe(true);
        expect(value.length).toBe(3);
        expect(value).toContain(10);
        expect(value).toContain(20);
        expect(value).toContain(30);
    });

    it ("value", function() {
        var value = classInst.getPropArray();
        expect(Array.isArray(value)).toBe(true);
        expect(value.length).toBe(3);
        expect(value).toContain(40);
        expect(value).toContain(50);
        expect(value).toContain(60);
    });

    it ("ability to set the new value", function() {
        classInst.setPropArray([100]);
        expect(classInst.getPropArray().length).toBe(1);
        expect(classInst.getPropArray()).toContain(100);
        expect(function() { classInst.setPropArray("100"); }).toThrow();
        expect(function() { classInst.setPropArray(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropArray(null);
        expect(classInst.getPropArray()).toBe(null);
        classInst.setPropArray([50]);
        expect(classInst.getPropArray().length).toBe(1);
        expect(classInst.getPropArray()).toContain(50);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropArray([60]);
        expect(Array.isArray(classInst.getPropArray())).toBe(true);
        expect(classInst.getPropArray().length).toBe(1);
        expect(classInst.getPropArray()).toContain(50);
        prop.unlock();
        classInst.setPropArray([60]);
        expect(classInst.getPropArray().length).toBe(1);
        expect(classInst.getPropArray()).toContain(60);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropArray).toBe(true);
        expect(classInst.propArrayOld).toContain(50);
        expect(classInst.propArrayNew).toContain(60);
    });
});